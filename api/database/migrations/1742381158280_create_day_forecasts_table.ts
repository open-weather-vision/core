import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'day_forecasts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .string('stationSlug')
        .notNullable()
        .references('stations.slug')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.date('date').notNullable()
      table.float('maxTemperature')
      table.float('minTemperature')
      table.float('precipitationSum')
      table.integer('weatherCode')
      table.float('sunshineDuration')
      table.float('rainSum')
      table.float('snowSum')
      table.float('dominantWindDirection')
      table.float('maximimalWindGusts')
      table.float('maximumWindSpeed')
      table.float('UVIndex')
      table.dateTime('sunset')
      table.dateTime('sunrise')
      table.unique(['stationSlug', 'date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
