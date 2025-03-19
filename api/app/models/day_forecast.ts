import { DateTime } from 'luxon'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Station from './station.js'
import AppBaseModel from './app_base_model.js'

export default class DayForecast extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare stationSlug: string
  @belongsTo(() => Station, {
    foreignKey: 'stationSlug',
  })
  declare station: BelongsTo<typeof Station>

  @column()
  declare date: DateTime

  @column()
  declare maxTemperature: number | null

  @column()
  declare minTemperature: number | null

  @column()
  declare precipitationSum: number | null

  @column()
  declare weatherCode: number | null

  @column()
  declare sunshineDuration: number | null

  @column()
  declare rainSum: number | null

  @column()
  declare snowSum: number | null

  @column()
  declare dominantWindDirection: number | null

  @column()
  declare maximimalWindGusts: number | null

  @column()
  declare maximumWindSpeed: number | null

  @column()
  declare UVIndex: number | null

  @column()
  declare sunset: DateTime | null

  @column()
  declare sunrise: DateTime | null
}
