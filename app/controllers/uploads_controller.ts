import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

import { getModel, makeSummary } from '#services/summary'
import LagoService from '#services/lago'
import { inject } from '@adonisjs/core'

@inject()
export default class UploadsController {
  constructor(private lagoService: LagoService) {}

  static validator = vine.compile(
    vine.object({
      pdf: vine.file({
        size: '10mb',
        extnames: ['pdf'],
      }),
    })
  )

  async createSummary({ request, auth }: HttpContext) {
    const { user } = auth
    // https://docs.adonisjs.com/guides/basics/file-uploads#file-properties
    const { summaryPrompt, combinePrompt } = request.body()
    const { model, language } = request.qs()
    const document = request.file('document')

    if (!document) {
      console.log('no file uploaded...')
      return
    }

    const modelInstance = getModel(model)

    try {
      const summary = await makeSummary(
        modelInstance,
        summaryPrompt,
        combinePrompt,
        language,
        document.tmpPath!
      )

      await this.lagoService.useSummary(user!.lagoExternalSubscriptionId)

      return summary
    } catch (err) {
      console.log(err)
    }
  }
}
