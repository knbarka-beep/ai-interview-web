# TEST ONLY: live site test (not a deliverable)

Site: https://ai-interview-web-steel.vercel.app, run 2026-11-26T22:27:03.352Z. Scripted answers; answer 1 is a deliberately wrong claim about tokens (it may not match the question asked).

## Question 1

Pick from level 1 questions, vary choice. I'll pick Q38 about MCP? Or Q22 embeddings. Choose Q41: AI agents basic. Output only question text.

What is an AI agent, and what three capabilities does it have?

## Answer 1 (deliberately wrong)

Tokens are just the words of the text, so a model with a 128,000 token context window can read exactly 128,000 words.

## Question 2

Looking at your answer to the first question, you have not answered it at all: the question asked about AI agents, not tokens. Question 2 builds on your reply, so I'll ask about tokens and context windows, but the answer you gave contains an error I'll cover in the feedback.

Given that a context window is measured in tokens, what else besides your own messages takes up space in it?

## Answer 2

It means the model looks things up in documents before answering, so it can cite sources.

## Feedback

## Strengths
- Your second answer describes a real idea: some systems do look up documents before answering and can cite sources. This is a reasonable intuition about how retrieval-based systems work.

## Knowledge gaps
- Question 1 (AI agents): you did not address the question. An AI agent is a system where an LLM is in charge of the control logic, planning and deciding its own steps. Its three capabilities are to reason, to act (call tools) and to access memory.
- Question 2 (what else fills a context window): this was not answered. Your reply described a different idea, which is covered below.
- Tokens: your first answer said a token is a word. The course material says tokens can be characters, parts of words, whole words or short phrases, with roughly 1.5 tokens per English word, so a 128,000 token window does not hold 128,000 words.

## Incorrect points
> You said: "Tokens are just the words of the text, so a model with a 128,000 token context window can read exactly 128,000 words."
Correct: Tokens can be characters, parts of words, whole words or short phrases. There are roughly 1.5 tokens per English word, so a 128,000 token window holds fewer than 128,000 words.
Source: What is a Context Window? (video), [03:12] to [05:23]

> You said: "It means the model looks things up in documents before answering, so it can cite sources."
Correct: This describes retrieval-augmented generation (RAG), not the context window. It is a separate framework. The course material does not say that the context window itself performs lookups or citations, and the question asked what takes up space in the context window (your messages, the model's responses, the system prompt, attached documents, and retrieved content).
Source: What is Retrieval-Augmented Generation? (video), [02:03] to [04:08]

## What to review
- AI agents: What are AI Agents? (video), [04:11] to [07:18]
- Tokens and context windows: What is a Context Window? (video), [03:12] to [05:23]
- What fills the context window: What is a Context Window? (video), [07:33] to [08:36]
- Retrieval-augmented generation: What is Retrieval-Augmented Generation

---

System prompt tokens (cache): 18772. Cost of this run: USD 0.003233
