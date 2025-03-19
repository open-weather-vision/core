import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('name').primary()
      table.string('password').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
