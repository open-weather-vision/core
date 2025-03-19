import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type HistoryRecordValue } from '../../types/HistoryRecordValue.js'
import { type HistoryRecordType } from '../../types/HistoryRecordType.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sensor from './sensor.js'

export default class HistoryRecord extends BaseModel {
  @column.dateTime({ isPrimary: true })
  declare time: DateTime

  @column()
  declare value: HistoryRecordValue

  @column()
  declare intervalSeconds: number

  @column()
  declare type: HistoryRecordType

  @column()
  declare sensorId: number
  @belongsTo(() => Sensor, {
    foreignKey: 'sensorId',
  })
  declare sensor: BelongsTo<typeof Sensor>
}
