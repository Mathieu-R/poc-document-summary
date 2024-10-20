import ky from 'ky'
import env from '#start/env'
import UserService from '#services/user'
import { DEFAULT_PLAN_CODE, WALLET_RATE_AMOUNT } from '../config.js'
import crypto from 'node:crypto'

export default class LagoService {
  async createCustomer(user: ReturnType<UserService['DTO']>) {
    const lagoExternalCustomerId = crypto.randomUUID()
    const response = await ky.post(`${env.get('LAGO_URL')}/customers`, {
      headers: {
        authorization: `Bearer ${env.get('LAGO_KEY')}`,
      },
      json: {
        customer: {
          external_id: lagoExternalCustomerId,
          currency: 'EUR',
          country: 'BE',
          email: user.email,
          name: user.fullname,
          customer_type: 'individual',
        },
      },
    })

    return response.ok && lagoExternalCustomerId
  }

  async assignCustomerToDefaultPlan(customerId: string) {
    const lagoExternalSubscriptionId = crypto.randomUUID()
    const response = await ky.post(`${env.get('LAGO_URL')}/subscriptions`, {
      headers: {
        authorization: `Bearer ${env.get('LAGO_KEY')}`,
      },
      json: {
        subscription: {
          external_customer_id: customerId,
          external_id: lagoExternalSubscriptionId,
          plan_code: DEFAULT_PLAN_CODE,
        },
      },
    })

    if (!response.ok) {
      console.log(await response.json())
    }

    return response.ok && lagoExternalSubscriptionId
  }

  async createWallet(customerId: string, initialCredits: number) {
    const response = await ky
      .post<any>(`${env.get('LAGO_URL')}/wallets`, {
        headers: {
          authorization: `Bearer ${env.get('LAGO_KEY')}`,
        },
        json: {
          wallet: {
            rate_amount: WALLET_RATE_AMOUNT,
            currency: 'EUR',
            paid_credits: initialCredits,
            external_customer_id: customerId,
          },
        },
      })
      .json()

    return response.lago_id
  }

  async updateWallet(walletId: string, credits: number) {
    return ky.post(`${env.get('LAGO_URL')}/wallet_transactions`, {
      headers: {
        authorization: `Bearer ${env.get('LAGO_KEY')}`,
      },
      json: {
        wallet_transaction: {
          wallet_id: walletId,
          paid_credits: credits,
        },
      },
    })
  }

  async useSummary(subscriptionId: string) {
    return ky.post(`${env.get('LAGO_URL')}/events`, {
      headers: {
        authorization: `Bearer ${env.get('LAGO_KEY')}`,
      },
      json: {
        event: {
          transaction_id: crypto.randomUUID(),
          external_subscription_id: subscriptionId,
          code: 'AI_DOC_SUMMARY',
        },
      },
    })
  }
}
