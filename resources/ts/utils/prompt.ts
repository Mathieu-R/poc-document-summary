// chain of density
// https://arxiv.org/pdf/2309.04269
export const codPromptString = `
  Article: {content}

  You will generate increasingly concise, entity-dense summaries of the above Article.

  Repeat the following 2 steps 5 times.

  Step 1. Identify 1-3 informative Entities ("; " delimited) from the Article which are missing from the previously generated summary.
  Step 2. Write a new, denser summary of identical length which covers every entity and detail from the previous summary plus the Missing Entities.

  A Missing Entity is:
  - Relevant: to the main story.
  - Specific: descriptive yet concise (5 words or fewer).
  - Novel: not in the previous summary.
  - Faithful: present in the Article.
  - Anywhere: located anywhere in the Article.

  Guidelines:
  - The first summary should be long (4-5 sentences, ~80 words) yet highly non-specific, containing little information beyond the entities marked as missing. Use overly verbose language and fillers (e.g., "this article discusses") to reach ~80 words.
  - Make every word count: rewrite the previous summary to improve flow and make space for additional entities.
  - Make space with fusion, compression, and removal of uninformative phrases like "the article discusses".
  - The summaries should become highly dense and concise yet self-contained, e.g., easily understood without the Article.
  - Missing entities can appear anywhere in the new summary.
  - Never drop entities from the previous summary. If space cannot be made, add fewer new entities.
  - Focus only the case, the story and not on general information about company involved or about general conditions or terms of agreements.
  - Do not write a summary with bullet points but write whole sentence instead like a real writer would do.
  - Always answer in input article main language.

  Remember, use the exact same number of words for each summary.

  Finally, answer only with the last summary and ensure it is in {language}.
`
export const summarizePromptString = `
  You are an expert at summarizing text.

  Given a text, write a concise but information loaded summary.
  Focus only the case, the story and not on general information about company involved or about general conditions or terms of agreements.
  Do not write summary with bullet points but write whole sentences instead like a real writer would do.
  The answer should be one paragraph long and contains a maximum of 10 sentences.
  Answer in {language}.

  Here is the text:
  ----------
  {content}
  ----------
`

export const combinePromptString = `
  You are an expert at writing.
  Your goal is to take a set of summaries, rework and combine and distill them into a single consolidated summary.
  Focus only the case, the story and not on general information about company involved or about general conditions or terms of agreements.
  Answer in a maximum of 5 small paragraphs containing a maximum 10 lines each. Do not answer using bullet point. Answer using whole sentences like a writer do.
  Answer in {language}.

  Here is the set of summaries:
  ----------
  {content}
  ----------
`
