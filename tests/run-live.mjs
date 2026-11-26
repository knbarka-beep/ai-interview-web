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

const WRONG = "Tokens are just the words of the text, so a model with a 128,000 token context window can read exactly 128,000 words.";
const A2 = "It means the model looks things up in documents before answering, so it can cite sources.";

let total = 0;
const r1 = await post({ history: [] });
total += cost(r1.usage);
console.log("Q1 usage", r1.usage);
const r2 = await post({ history: [r1.text, WRONG], interviewId: r1.interviewId, sig: r1.sig });
total += cost(r2.usage);
console.log("Q2 usage", r2.usage);
const r3 = await post({ history: [r1.text, WRONG, r2.text, A2], interviewId: r2.interviewId, sig: r2.sig });
total += cost(r3.usage);
console.log("Feedback usage", r3.usage);
console.log(`cost USD ${total.toFixed(6)}`);

writeFileSync(
  "tests/TEST_live.md",
  `# TEST ONLY: live site test (not a deliverable)\n\nSite: ${base}, run ${new Date().toISOString()}. Scripted answers; answer 1 is a deliberately wrong claim about tokens (it may not match the question asked).\n\n## Question 1\n\n${r1.text}\n\n## Answer 1 (deliberately wrong)\n\n${WRONG}\n\n## Question 2\n\n${r2.text}\n\n## Answer 2\n\n${A2}\n\n## Feedback\n\n${r3.text}\n\n---\n\nSystem prompt tokens (cache): ${r1.usage.cache_creation_input_tokens || r1.usage.cache_read_input_tokens}. Cost of this run: USD ${total.toFixed(6)}\n`
);
console.log("saved tests/TEST_live.md");
