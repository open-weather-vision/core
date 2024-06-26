import { WeatherStationStates } from '#models/weather_station'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'weather_stations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug', 50).unique()
      table.string('name', 50).unique()
      table.string('interface', 50).notNullable()
      table.json('interface_config').defaultTo({}).notNullable()
      table.enum('state', WeatherStationStates).defaultTo('connecting').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
