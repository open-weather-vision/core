import { BaseSchema } from '@adonisjs/lucid/schema'
import { Elements } from '../../types/Elements.js'

export default class extends BaseSchema {
  protected tableName = 'sensors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').notNullable()
      table.integer('index').nullable()
      table.boolean('public').notNullable().defaultTo(true)
      table.integer('sensorGroup').nullable()
      table
        .string('stationSlug')
        .references('stations.slug')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()
      table
        .enum('elementSlug', Elements)
        .references('elements.slug')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()
      table.unique(['stationSlug', 'slug'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
