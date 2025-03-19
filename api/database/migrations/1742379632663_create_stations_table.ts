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
      table.jsonb('interfaceConfig').notNullable()
      table.enum('recorderStatus', RecorderStatuses).notNullable().defaultTo('disconnected')
      table.boolean('isRecorderReachable').notNullable().defaultTo(false)
      table.dateTime('lastRecorderPing').nullable()
      table.boolean('isForecastEnabled').notNullable().defaultTo(false)
      table
        .integer('interfaceId')
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
