import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { SensorSummaryType } from '../other/summaries/summary_types.js'
import type { UnitType } from '../other/units/units.js'
import WeatherStation from './weather_station.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Record from './record.js'
import SensorTag from './sensor_tag.js'
import type { TimeUnit } from '../other/scheduler.js'

export type SensorValueType = 'double' | 'int'

export default class Sensor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare summary_type: SensorSummaryType

  @column()
  declare interval: number

  @column()
  declare interval_unit: TimeUnit

  @column()
  declare unit_type: UnitType

  @column()
  declare value_type: SensorValueType

  @column()
  declare weather_station_id: number

  @belongsTo(() => WeatherStation, {
    foreignKey: 'weather_station_id',
  })
  declare weather_station: BelongsTo<typeof WeatherStation>

  @hasMany(() => Record, {
    foreignKey: 'sensor_id',
  })
  declare records: HasMany<typeof Record>

  @hasMany(() => SensorTag, {
    foreignKey: 'sensor_id',
  })
  declare tags: HasMany<typeof SensorTag>
}
