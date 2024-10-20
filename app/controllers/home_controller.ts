import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user'
import { inject } from '@adonisjs/core'

@inject()
export default class HomeController {
  constructor(private userService: UserService) {}

  async index({ inertia, auth }: HttpContext) {
    await auth.check()
    return inertia.render('home', { user: auth.user ? this.userService.DTO(auth.user) : undefined })
  }
}
