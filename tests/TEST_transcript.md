# TEST ONLY: local website test (not a deliverable)

Run with `node tests/run-local.mjs` against `api/chat.js` and the real model (claude-haiku-5-5) on 2026-11-26T22:22:11.159Z. Answers are scripted; answer 1 is deliberately wrong.

## Question 1

In plain terms, what is a large language model and how does it produce text?

## Answer 1 (deliberately wrong)

A large language model works like a search engine. It looks the answer up in a database of facts it stored during training, so its answers are always accurate and it cannot make things up.

## Question 2

What is the difference between pre-training and fine-tuning, and why does a company need both to get a useful assistant?

## Answer 2

I think it depends on the task: you should check the cost, keep a human in the loop for important decisions and ground the model in reliable sources.

## Feedback

## Strengths

- For question 2, you raised cost, human oversight and grounding in reliable sources. These are sensible considerations for deploying AI, and grounding a model in reliable sources is a point the course material supports in its discussion of retrieval.

## Knowledge gaps

- Question 1: the course describes an LLM as a foundation model that predicts the next token and generates text one token at a time. The comparison with a search engine does not capture this.
- Question 2: your answer did not address pre-training or fine-tuning. The course material explains that pre-training builds broad knowledge, while fine-tuning uses a smaller, task-specific dataset to turn the general model into a specialist, such as a helpful assistant.

## Incorrect points

> You said: "A large language model works like a search engine. It looks the answer up in a database of facts it stored during training, so its answers are always accurate and it cannot make things up."

Correct: An LLM is a foundation model trained on a very large text corpus to predict the next token. It does not look answers up in a database. The knowledge in its parameters is a vague recollection, and models can hallucinate, producing plausible but wrong or invented content.

Source: how-llms-work.md (What is a large language model); Karpathy video, [98:50] to [100:51] for the vague recollection point. hallucinations.md, What Are Hallucinations, [01:02] to [03:11] for the definition of hallucinations.

## What to review

- how-llms-work.md: How Large Language Models Work, [00:00] to [04:13]
- how-llms-work.md: Deep Dive into LLMs like ChatGPT (Karpathy), [08:10] to [14:19] (tokenisation and next-token prediction)
- hallucinations.md: Why Large Language Models Hallucinate, [01:02] to [03:11]
- how-llms-work.md: Deep Dive into LLMs like ChatGPT (Karpathy), [146:45] (the three training stages: pre-training, supervised fine-tuning and reinforcement learning)

---

- Wrong answer flagged under "Incorrect points": yes
- Fourth model turn refused (turn cap): yes
- Cost of this run: USD 0.004190
