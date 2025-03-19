import { BaseSchema } from '@adonisjs/lucid/schema'
import { HistoryRecordTypes } from '../../types/HistoryRecordType.js'

export default class extends BaseSchema {
  protected tableName = 'history_records'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.dateTime('time').notNullable()
      table.jsonb('data').nullable()
      table.enum('type', HistoryRecordTypes).notNullable().defaultTo('live')
      table
        .integer('sensor_id')
        .references('sensors.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()
      table.boolean('processed').defaultTo(false).notNullable()
      table.unique(['time', 'sensor_id', 'type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
