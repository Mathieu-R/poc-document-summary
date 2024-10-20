import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('provider_id').notNullable().unique()
      table.string('fullname').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('avatar_url').notNullable()

      table.boolean('lago_services_created').notNullable().defaultTo(false)
      table.string('lago_external_customer_id').nullable()
      table.string('lago_external_subscription_id').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
