import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import LagoService from '#services/lago'

@inject()
export default class AuthController {
  constructor(private lagoService: LagoService) {}

  async store({ ally }: HttpContext) {
    return ally.use('github').redirect()
  }

  async callback({ ally, auth, response }: HttpContext) {
    const github = ally.use('github')
    const profile = await github.user()

    const user = await User.updateOrCreate(
      {
        providerId: profile.id,
      },
      {
        fullname: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
      }
    )

    // first time login
    // create user in Lago and subscribe user to default plan

    if (!user.lagoServicesCreated) {
      const customerId = await this.lagoService.createCustomer(user)

      if (!customerId) {
        return response.redirect('/')
      }

      user.lagoExternalCustomerId = customerId
      const subscriptionId = await this.lagoService.assignCustomerToDefaultPlan(customerId)

      if (!subscriptionId) {
        return response.redirect('/')
      }

      user.lagoServicesCreated = true
      user.lagoExternalSubscriptionId = customerId
      user.lagoExternalSubscriptionId = subscriptionId
      await user.save()
    }

    await auth.use('web').login(user)
    return response.redirect('/')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
