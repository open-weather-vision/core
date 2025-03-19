import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hour_forecasts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('dayForecastId')
        .notNullable()
        .references('day_forecasts.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.dateTime('time').notNullable()
      table.float('temperature')
      table.float('humidity')
      table.integer('weatherCode')
      table.float('precipationSum')
      table.float('rainSum')
      table.float('snowSum')
      table.float('maximimalWindGusts')
      table.float('windSpeed')
      table.float('windDirection')
      table.float('seaLevelPressure')
      table.unique(['dayForecastId', 'time'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
