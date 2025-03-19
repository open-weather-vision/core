import { DateTime } from 'luxon'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import DayForecast from './day_forecast.js'
import AppBaseModel from './app_base_model.js'

export default class HourForecast extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare dayForecastId: number
  @belongsTo(() => DayForecast, {
    foreignKey: 'dayForecastId',
  })
  declare dayForecast: BelongsTo<typeof DayForecast>

  @column.dateTime()
  declare time: DateTime

  @column()
  declare temperature: number | null

  @column()
  declare humidity: number | null

  @column()
  declare weatherCode: number | null

  @column()
  declare precipationSum: number | null

  @column()
  declare rainSum: number | null

  @column()
  declare snowSum: number | null

  @column()
  declare maximimalWindGusts: number | null

  @column()
  declare windSpeed: number | null

  @column()
  declare windDirection: number | null

  @column()
  declare seaLevelPressure: number | null
}
