# AI interview simulator (website version)

A two-question mock interview about AI. Press Start, answer a basic question, answer a harder one, and get feedback on strengths, knowledge gaps and incorrect points with sources to review. The transcript can be downloaded as Markdown.

- `index.html`: the whole front end (vanilla JS, no framework).
- `api/chat.js`: Vercel serverless function that calls Anthropic (claude-haiku-5-5). The API key stays on the server.
- `lib/knowledge.js`: the knowledge base sent as a cached system prompt (about 18k tokens), generated from the project version's notes and question bank by `scripts/build-knowledge.mjs`.
- `tests/run-local.mjs`: local test that calls the function directly.

## Limits (the key is shared, so the server enforces them)

- 3 model calls per interview (question 1, question 2, feedback); the history is HMAC-signed so steps cannot be skipped or forged.
- Answers up to 1,500 characters; `max_tokens` 700.
- Per IP: 5 interviews and 30 requests per hour (in memory, per serverless instance).
- Anything outside the expected flow gets a friendly error.

## Run locally

```
npm install
node scripts/build-knowledge.mjs ../interview-project/knowledge   # only if the notes changed
node tests/run-local.mjs path/to/.env                              # runs one real interview (costs about 0.004 USD)
```

## Deploy

```
npx vercel link
vercel env add ANTHROPIC_API_KEY production
vercel --prod
```
