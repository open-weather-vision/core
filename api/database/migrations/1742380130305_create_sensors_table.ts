import { BaseSchema } from '@adonisjs/lucid/schema'
import { WeatherElements } from '../../types/Elements.js'

export default class extends BaseSchema {
  protected tableName = 'sensors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').notNullable()
      table.integer('index').nullable()
      table.boolean('public').notNullable().defaultTo(true)
      table.integer('sensor_group').nullable()
      table
        .string('station_slug')
        .references('stations.slug')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()
      table
        .enum('element_slug', WeatherElements)
        .references('elements.slug')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()
      table.unique(['station_slug', 'slug'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
