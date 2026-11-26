# TEST ONLY: live site test (not a deliverable)

Site: https://ai-interview-web-steel.vercel.app, run 2026-11-26T22:29:32.124Z. Scripted answers; answer 1 is deliberately wrong.

## Question 1

What is a parameter, and what does the "large" in large language model refer to?

## Answer 1 (deliberately wrong)

A large language model works like a search engine: it looks the answer up in a database of stored facts, so it is always accurate and cannot make things up.

## Question 2

Give one reason why an LLM can produce wrong answers even when it appears confident, and explain what causes this.

## Answer 2

I would keep a human in the loop for important decisions and ground the model in reliable sources, but I am not sure about the details.

## Feedback

## Strengths
- Q2: You mention keeping a human in the loop for important decisions, a sensible safeguard.
- Q2: You mention grounding the model in reliable sources, which is a real mitigation.

## Knowledge gaps
- Q1: You did not address what a parameter is or what "large" refers to. The question asked about parameters and the size of the model, and your answer described a search engine instead.
- Q2: You did not explain why an LLM gives wrong answers or what causes this. Causes such as data quality, the generation method and unclear input were not covered.

## Incorrect points
> You said: "A large language model works like a search engine: it looks the answer up in a database of stored facts, so it is always accurate and cannot make things up."
Correct: The course material describes an LLM as a neural network trained on a very large text corpus to predict the next token. It does not look answers up in a database, and it can produce hallucinations, which are plausible-sounding but wrong or invented outputs.
Source: how-llms-work.md (How Large Language Models Work, [00:00] to [04:13]); why-large-language-models-hallucinate, [00:00] to [01:02]

## What to review
- how-llms-work.md: How Large Language Models Work, [00:00] to [04:13]
- hallucinations.md: Why Large Language Models Hallucinate, [01:02] to [05:18]
- how-llms-work.md: Deep Dive into LLMs like ChatGPT (Karpathy), [01:02]

---

System prompt tokens (cache): 18853. Cost of this run: USD 0.003060
