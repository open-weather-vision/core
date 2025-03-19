import { DateTime } from 'luxon'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import { type HistoryRecordData as HistoryRecordData } from '../../types/HistoryRecordValue.js'
import { type HistoryRecordType } from '../../types/HistoryRecordType.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sensor from './sensor.js'
import AppBaseModel from './app_base_model.js'

export default class HistoryRecord extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare time: DateTime

  @column()
  declare data: HistoryRecordData

  @column()
  declare type: HistoryRecordType

  @column()
  declare processed: boolean

  @column()
  declare sensorId: number
  @belongsTo(() => Sensor, {
    foreignKey: 'sensorId',
  })
  declare sensor: BelongsTo<typeof Sensor>

  toString() {
    return `[${this.type}]${this.time.toISO()}(sensor: ${this.sensorId}): ${this.data.value}`
  }
}
