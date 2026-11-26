// Live test: one short scripted interview against the deployed site.
// Usage: node tests/run-live.mjs https://your-site.vercel.app
import { writeFileSync } from "node:fs";

const base = process.argv[2];
if (!base) throw new Error("Pass the site URL");
const post = async (body) => {
  const r = await fetch(`${base}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json();
  if (!r.ok) throw new Error(`${r.status} ${data.error}`);
  return data;
};
const cost = (u) =>
  ((u.input_tokens || 0) * 0.10 + (u.cache_creation_input_tokens || 0) * 0.125 + (u.cache_read_input_tokens || 0) * 0.01 + (u.output_tokens || 0) * 0.50) / 1e6;

// Answer 1 is deliberately wrong; on-topic where the question's keywords allow it.
const wrongFor = (q) => {
  const t = q.toLowerCase();
  if (t.includes("token") || t.includes("context window")) return "Tokens are just the words of the text, so a 128,000 token context window holds exactly 128,000 words.";
  if (t.includes("rag") || t.includes("retriev")) return "RAG means retraining the model on your company's documents so it memorises them.";
  if (t.includes("hallucinat")) return "A hallucination is when the model refuses to answer because it is unsure.";
  if (t.includes("deterministic") || t.includes("probabilistic")) return "An LLM agent is deterministic: the same request always gives exactly the same answer.";
  return "A large language model works like a search engine: it looks the answer up in a database of stored facts, so it is always accurate and cannot make things up.";
};
const A2 = "I would keep a human in the loop for important decisions and ground the model in reliable sources, but I am not sure about the details.";

let total = 0;
const r1 = await post({ history: [] });
total += cost(r1.usage);
console.log("Q1 usage", r1.usage);
const r2 = await post({ history: [r1.text, wrongFor(r1.text)], interviewId: r1.interviewId, sig: r1.sig });
total += cost(r2.usage);
console.log("Q2 usage", r2.usage);
const r3 = await post({ history: [r1.text, wrongFor(r1.text), r2.text, A2], interviewId: r2.interviewId, sig: r2.sig });
total += cost(r3.usage);
console.log("Feedback usage", r3.usage);
console.log(`cost USD ${total.toFixed(6)}`);

writeFileSync(
  "tests/TEST_live.md",
  `# TEST ONLY: live site test (not a deliverable)\n\nSite: ${base}, run ${new Date().toISOString()}. Scripted answers; answer 1 is deliberately wrong.\n\n## Question 1\n\n${r1.text}\n\n## Answer 1 (deliberately wrong)\n\n${wrongFor(r1.text)}\n\n## Question 2\n\n${r2.text}\n\n## Answer 2\n\n${A2}\n\n## Feedback\n\n${r3.text}\n\n---\n\nSystem prompt tokens (cache): ${r1.usage.cache_creation_input_tokens || r1.usage.cache_read_input_tokens}. Cost of this run: USD ${total.toFixed(6)}\n`
);
console.log("saved tests/TEST_live.md");
