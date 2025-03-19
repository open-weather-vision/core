import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type InterfaceConfig } from '../../types/InterfaceConfig.js'
import { type RecorderStatus } from '../../types/RecorderStatus.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Interface from './interface.js'

export default class Station extends BaseModel {
  @column({ isPrimary: true })
  declare slug: string

  @column()
  declare name: string

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare interfaceConfig: InterfaceConfig

  @column()
  declare recorderStatus: RecorderStatus

  @column()
  declare isRecorderReachable: boolean

  @column()
  declare lastRecorderPing: DateTime

  @column()
  declare isForecastEnabled: boolean

  @column()
  declare interfaceId: number

  @belongsTo(() => Interface, {
    foreignKey: 'interfaceId',
  })
  declare interface: BelongsTo<typeof Interface>
}
