import { BaseSchema } from '@adonisjs/lucid/schema'
import { HistoryRecordTypes } from '../../types/HistoryRecordType.js'

export default class extends BaseSchema {
  protected tableName = 'history_records'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.dateTime('time').primary()
      table.jsonb('value').nullable()
      table.integer('intervalSeconds').notNullable()
      table.enum('type', HistoryRecordTypes).notNullable().defaultTo('live')
      table
        .integer('sensorId')
        .references('sensors.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
