import { BaseSchema } from '@adonisjs/lucid/schema'
import { RecorderStatuses } from '../../types/RecorderStatus.js'

export default class extends BaseSchema {
  protected tableName = 'stations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('slug').primary()
      table.string('name').notNullable()
      table.float('latitude').notNullable()
      table.float('longitude').notNullable()
      table.jsonb('interface_config').notNullable()
      table.enum('recorder_status', RecorderStatuses).notNullable().defaultTo('disconnected')
      table.boolean('is_recorder_reachable').notNullable().defaultTo(false)
      table.dateTime('last_recorder_ping').nullable()
      table.boolean('is_forecast_enabled').notNullable().defaultTo(false)
      table
        .integer('interface_id')
        .notNullable()
        .references('interfaces.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
