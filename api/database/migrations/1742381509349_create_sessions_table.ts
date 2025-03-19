import { BaseSchema } from '@adonisjs/lucid/schema'
import { RightLevels } from '../../types/RightLevel.js'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('token').notNullable()
      table.string('refresh_token').nullable()
      table.enum('right_level', RightLevels).notNullable().defaultTo('read-only')
      table.dateTime('valid_until').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
