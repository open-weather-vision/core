import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type RankingRecordIntervalType } from '../../types/RankingRecordIntervalType.js'
import { type RankingRecordType } from '../../types/RankingRecordType.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sensor from './sensor.js'

export default class RankingRecord extends BaseModel {
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
    foreignKey: 'sensorId',
  })
  declare sensor: BelongsTo<typeof Sensor>
}
