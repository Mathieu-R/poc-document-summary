import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

import { getModel, makeSummary } from '#services/summary'

export default class UploadsController {
  static validator = vine.compile(
    vine.object({
      pdf: vine.file({
        size: '10mb',
        extnames: ['pdf'],
      }),
    })
  )

  async createSummary({ request }: HttpContext) {
    // https://docs.adonisjs.com/guides/basics/file-uploads#file-properties
    const { summaryPrompt, combinePrompt } = request.body()
    const { model, language } = request.qs()
    const document = request.file('document')

    if (!document) {
      console.log('no file uploaded...')
      return
    }

    const modelInstance = getModel(model)

    const summary = await makeSummary(
      modelInstance,
      summaryPrompt,
      combinePrompt,
      language,
      document.tmpPath!
    )

    return summary
  }
}
