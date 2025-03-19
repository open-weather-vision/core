import { BaseSchema } from '@adonisjs/lucid/schema'
import { RightLevels } from '../../types/RightLevel.js'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('token').notNullable()
      table.string('refreshToken').nullable()
      table.enum('rightLevel', RightLevels).notNullable().defaultTo('read-only')
      table.dateTime('validUntil').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
