import { Document } from '@langchain/core/documents'

export function combineDocuments(documents: Document[]) {
  return documents.map((document) => document.pageContent).join('\n\n')
}
