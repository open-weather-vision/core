import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { SummaryType } from '../other/summaries/summary_types.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import SummaryRecord from './summary_record.js'
import WeatherStation from './weather_station.js'

export default class Summary extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column()
  declare type: SummaryType

  @column()
  declare weather_station_id: number

  @belongsTo(() => WeatherStation, {
    foreignKey: 'weather_station_id',
  })
  declare weather_station: BelongsTo<typeof WeatherStation>

  @hasMany(() => SummaryRecord, {
    foreignKey: 'summary_id',
  })
  declare records: HasMany<typeof SummaryRecord>
}
