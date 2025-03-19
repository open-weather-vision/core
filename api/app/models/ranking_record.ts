import { DateTime } from 'luxon'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import { type RankingRecordIntervalType } from '../../types/RankingRecordIntervalType.js'
import { type RankingRecordType } from '../../types/RankingRecordType.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sensor from './sensor.js'
import AppBaseModel from './app_base_model.js'

export default class RankingRecord extends AppBaseModel {
  @column.dateTime({ isPrimary: true })
  declare time: DateTime

  @column()
  declare value: number

  @column()
  declare intervalType: RankingRecordIntervalType

  @column()
  declare type: RankingRecordType

  @column()
  declare sensorId: number
  @belongsTo(() => Sensor, {
    foreignKey: 'sensor_id',
  })
  declare sensor: BelongsTo<typeof Sensor>
}
