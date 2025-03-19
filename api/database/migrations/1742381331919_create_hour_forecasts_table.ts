import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hour_forecasts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('day_forecast_id')
        .notNullable()
        .references('day_forecasts.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.dateTime('time').notNullable()
      table.float('temperature')
      table.float('humidity')
      table.integer('weather_code')
      table.float('precipation_sum')
      table.float('rain_sum')
      table.float('snow_sum')
      table.float('maximimal_wind_gusts')
      table.float('wind_speed')
      table.float('wind_direction')
      table.float('sea_level_pressure')
      table.unique(['day_forecast_id', 'time'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
