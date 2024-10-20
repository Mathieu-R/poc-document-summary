import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import LagoService from '#services/lago'
import UserService from '#services/user'

@inject()
export default class CreditsController {
  constructor(
    private userService: UserService,
    private lagoService: LagoService
  ) {}

  async index({ inertia, auth }: HttpContext) {
    const { user } = auth
    return inertia.render('credits', { user: user ? this.userService.DTO(user) : undefined })
  }

  async store({ request, auth, response }: HttpContext) {
    const { amount } = request.qs()
    const { user } = auth

    await this.lagoService.orderCredits(user!.lagoExternalCustomerId, amount)
    return response.ok({})
  }
}
