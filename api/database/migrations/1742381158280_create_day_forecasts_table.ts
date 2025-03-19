import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'day_forecasts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .string('station_slug')
        .notNullable()
        .references('stations.slug')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.date('date').notNullable()
      table.float('max_temperature')
      table.float('min_temperature')
      table.float('precipitation_sum')
      table.integer('weather_code')
      table.float('sunshine_duration')
      table.float('rain_sum')
      table.float('snow_sum')
      table.float('dominant_wind_direction')
      table.float('maximimal_wind_gusts')
      table.float('maximum_wind_speed')
      table.float('UV_index')
      table.dateTime('sunset')
      table.dateTime('sunrise')
      table.unique(['station_slug', 'date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
