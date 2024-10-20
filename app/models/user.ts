import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare providerId: number

  @column()
  declare fullname: string

  @column()
  declare email: string

  @column()
  declare avatarUrl: string

  @column()
  declare lagoServicesCreated: boolean

  @column()
  declare lagoCustomerId: string

  @column()
  declare lagoSubscriptionId: string

  @column()
  declare lagoWalletId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
