import { BaseSchema } from '@adonisjs/lucid/schema'
import { RankingRecordIntervalTypes } from '../../types/RankingRecordIntervalType.js'
import { RankingRecordTypes } from '../../types/RankingRecordType.js'

export default class extends BaseSchema {
  protected tableName = 'ranking_records'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.dateTime('time').primary()
      table.float('value').notNullable()
      table.enum('intervalType', RankingRecordIntervalTypes).notNullable().defaultTo('month')
      table.enum('type', RankingRecordTypes).defaultTo('min').notNullable()
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
