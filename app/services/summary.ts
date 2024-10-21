import crypto from 'node:crypto'
import { TokenTextSplitter } from '@langchain/textsplitters'
//import { ChatMistralAI } from '@langchain/mistralai'
import { ChatOpenAI } from '@langchain/openai'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { PromptTemplate } from '@langchain/core/prompts'
import { createHeaders, PORTKEY_GATEWAY_URL } from 'portkey-ai'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'

// @ts-ignore
import { combinePrompt, summarizePrompt, codPrompt } from '../../resources/ts/utils/prompt.js'
import { MAX_TOKEN_PER_DOC } from '../config.js'
import { loadPdf } from '../utils/pdf.js'
import env from '#start/env'

type IOpenAiModels = 'gpt-3.5-turbo' | 'gpt-4o-mini' | 'gpt-4o'
type IMistralModels = 'open-mistral-nemo' | 'mistral-small-latest' | 'mistral-large-latest'

const portKeyOpenAIConf = {
  baseURL: PORTKEY_GATEWAY_URL,
  defaultHeaders: createHeaders({
    apiKey: env.get('PORTKEY_KEY'),
    virtualKey: env.get('OPENAI_VKEY'),
    provider: 'open-ai',
  }),
}

const portKeyMistralConf = {
  baseURL: PORTKEY_GATEWAY_URL,
  defaultHeaders: createHeaders({
    apiKey: env.get('PORTKEY_KEY'),
    virtualKey: env.get('MISTRAL_VKEY'),
    provider: 'mistral',
  }),
}

const llmCallbacks = [
  {
    // @ts-ignore
    handleLLMEnd(output, runId, parentRunId, tags) {
      console.log(`parent run id: ${parentRunId}`)
      console.log(`run id: ${runId}`)
      console.log(`token usage: ${output.llmOutput.tokenUsage.totalTokens}`)
    },
  },
]

const commonChatOptions = {
  temperature: 0,
  maxTokens: MAX_TOKEN_PER_DOC,
  maxRetries: 0,
  callbacks: llmCallbacks,
}

export function getModel(modelName: IOpenAiModels | IMistralModels, customerId: string) {
  if (modelName.includes('gpt')) {
    return new ChatOpenAI({
      ...commonChatOptions,
      apiKey: 'X',
      model: modelName,
      configuration: portKeyOpenAIConf,
      user: customerId,
    })
  }

  if (modelName.includes('mistral')) {
    return new ChatOpenAI({
      ...commonChatOptions,
      apiKey: 'X', //env.get('MISTRAL_KEY'),
      model: modelName,
      configuration: portKeyMistralConf,
      user: customerId,
    })
  }

  throw new Error('LLM model unsupported...')
}
// Parses LLMResult into the top likely string.
// https://v03.api.js.langchain.com/classes/_langchain_core.output_parsers.StringOutputParser.html
const outputParser = new StringOutputParser()

export async function makeSummary(
  model: BaseChatModel,
  summaryPromptTemplate: string,
  combinePromptTemplate: string,
  language: string,
  path: string
): Promise<string> {
  // 1. Load PDF document (one document combining all the pages in the PDF)
  const docs = await loadPdf(path)

  // 2. check if whole document is short enought to pass directly to the LLM
  const numTokensInWholeDoc = await model.getNumTokens(docs[0].pageContent)

  // map: associate each document content with its summary
  // RunnableSequence = sequence of runnable (output of each runnable is the input of the next one)
  const mapChain = RunnableSequence.from([
    PromptTemplate.fromTemplate(summaryPromptTemplate),
    model,
    outputParser,
  ]).withConfig({ runName: 'Summarize a document batch' })

  if (numTokensInWholeDoc <= MAX_TOKEN_PER_DOC) {
    console.log('HELLO')
    return mapChain.invoke({ content: docs[0].pageContent, language })
  }

  // 3. If combined document is too long, we try splitting in chunk and summarizing each one
  // then combining back into a single summary
  const textSplitter = new TokenTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const splittedDocs = await textSplitter.invoke(docs)

  // reduce: combine each summary into one
  const reduceChain = RunnableSequence.from([
    PromptTemplate.fromTemplate(combinePromptTemplate),
    model,
    outputParser,
  ]).withConfig({ runName: 'Combine and distill summaries' })

  const summaries = await mapChain.batch(
    splittedDocs.map((doc) => ({
      content: doc.pageContent,
      language,
    }))
  )

  return reduceChain.invoke({ content: summaries.join('\n'), language: language })
}
