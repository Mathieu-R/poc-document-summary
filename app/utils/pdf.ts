import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { Document } from '@langchain/core/documents'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

export function writeDocument(json: Document[], path: string) {
  const jsonString = JSON.stringify(json, null, 2)
  return fs.writeFile(resolve(import.meta.dirname, path), jsonString, 'utf-8')
}

export async function loadPdf(path: string) {
  const loader = new PDFLoader(path, { splitPages: false })
  return loader.load()
}
