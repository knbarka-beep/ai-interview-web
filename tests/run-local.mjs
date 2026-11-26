// Local test: calls api/chat.js directly (no vercel dev needed).
// Usage: node tests/run-local.mjs <path-to-.env>   (the key is read into process.env, never printed)
// 1) flow and limit checks that never reach the API; 2) exactly one full interview with scripted answers.
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

const envPath = process.argv[2];
if (!envPath) throw new Error("Pass the path to the .env file");
const line = readFileSync(envPath, "utf8").split(/\r?\n/).find((l) => l.startsWith("ANTHROPIC_API_KEY="));
process.env.ANTHROPIC_API_KEY = line.slice("ANTHROPIC_API_KEY=".length).trim().replace(/^["']|["']$/g, "");

const { default: handler } = await import("../api/chat.js");

function call(body, ip = "10.0.0.1", method = "POST") {
  return new Promise((resolve) => {
    const res = {
      code: 200,
      status(c) { this.code = c; return this; },
      json(d) { resolve({ status: this.code, data: d }); },
    };
    handler({ method, body, headers: { "x-forwarded-for": ip } }, res);
  });
}

// Price per million tokens (Haiku 5.5): input 0.10, output 0.50; cache write 1.25x input, cache read 0.1x input.
const cost = (u) =>
  ((u.input_tokens || 0) * 0.10 + (u.cache_creation_input_tokens || 0) * 0.125 + (u.cache_read_input_tokens || 0) * 0.01 + (u.output_tokens || 0) * 0.50) / 1e6;

// --- 1. Flow checks (all rejected before any model call) ---
assert.equal((await call({}, "10.0.0.9", "GET")).status, 405);
assert.equal((await call({ history: ["only one item"] })).status, 400);
assert.equal((await call({ history: ["q", "a"], interviewId: "x", sig: "00" })).status, 400, "forged signature must fail");
assert.equal((await call({ history: ["q", "x".repeat(1501)], interviewId: "x", sig: "00" })).status, 400, "long answer must fail");
assert.equal((await call({ history: ["q", "  "], interviewId: "x", sig: "00" })).status, 400, "empty answer must fail");
console.log("flow checks passed (no API calls)");

// --- 2. One full interview ---
// Answer 1 is deliberately wrong whatever question 1 is: it claims an LLM looks facts up and cannot hallucinate.
const WRONG = "A large language model works like a search engine. It looks the answer up in a database of facts it stored during training, so its answers are always accurate and it cannot make things up.";
const answer2For = (q) => {
  const t = q.toLowerCase();
  if (t.includes("rag") || t.includes("retriev")) return "RAG retrieves relevant documents from a content store and adds them to the prompt with the question, so the answer is grounded and up to date without retraining. A weak retriever gives poor grounding.";
  if (t.includes("context window") || t.includes("token")) return "The context window is the model's working memory in tokens. Larger windows cost more compute, roughly quadratically, and models can miss information in the middle of long inputs.";
  if (t.includes("agent")) return "An agent lets the LLM decide the steps: it reasons, calls tools and uses memory, looping until it reaches an answer. For narrow, well-defined tasks a fixed programmatic workflow is cheaper and more predictable.";
  if (t.includes("hallucinat")) return "Hallucinations come from data quality, the generation method and unclear input context. You reduce them with specific prompts, lower temperature, examples and grounding in sources.";
  return "I think it depends on the task: you should check the cost, keep a human in the loop for important decisions and ground the model in reliable sources.";
};

const transcript = [];
let total = 0;
let r = await call({ history: [] });
assert.equal(r.status, 200, JSON.stringify(r.data));
total += cost(r.data.usage); transcript.push(["Question 1", r.data.text]);
console.log("Q1 usage", r.data.usage);
const history = [r.data.text, WRONG];
transcript.push(["Answer 1 (deliberately wrong)", WRONG]);

r = await call({ history, interviewId: r.data.interviewId, sig: r.data.sig });
assert.equal(r.status, 200, JSON.stringify(r.data));
total += cost(r.data.usage); transcript.push(["Question 2", r.data.text]);
console.log("Q2 usage", r.data.usage);
const a2 = answer2For(r.data.text);
history.push(r.data.text, a2);
transcript.push(["Answer 2", a2]);

const id = r.data.interviewId, sig = r.data.sig;
r = await call({ history, interviewId: id, sig });
assert.equal(r.status, 200, JSON.stringify(r.data));
total += cost(r.data.usage);
console.log("Feedback usage", r.data.usage);
const feedback = r.data.text;

// Turn cap: a 4th call for the same interview is refused without a model call.
const capped = await call({ history, interviewId: id, sig });
assert.equal(capped.status, 429, "fourth turn must be refused");

const flagged = /incorrect points/i.test(feedback) && /you said/i.test(feedback) && /(search engine|database|always accurate|cannot make things up)/i.test(feedback);
const noDashes = !/[–—]/.test(feedback);
console.log(`wrong answer flagged: ${flagged}; dashes absent: ${noDashes}; cost USD ${total.toFixed(6)}`);

writeFileSync(
  "tests/TEST_transcript.md",
  `# TEST ONLY: local website test (not a deliverable)\n\nRun with \`node tests/run-local.mjs\` against \`api/chat.js\` and the real model (claude-haiku-5-5) on ${new Date().toISOString()}. Answers are scripted; answer 1 is deliberately wrong.\n\n` +
    transcript.map(([h, t]) => `## ${h}\n\n${t}\n`).join("\n") +
    `\n## Feedback\n\n${feedback}\n\n---\n\n- Wrong answer flagged under "Incorrect points": ${flagged ? "yes" : "NO"}\n- Fourth model turn refused (turn cap): yes\n- Cost of this run: USD ${total.toFixed(6)}\n`
);
console.log("saved tests/TEST_transcript.md");
