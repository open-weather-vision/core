import { DateTime } from 'luxon'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import { type InterfaceConfig } from '../../types/InterfaceConfig.js'
import { type RecorderStatus } from '../../types/RecorderStatus.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Interface from './interface.js'
import AppBaseModel from './app_base_model.js'

export default class Station extends AppBaseModel {
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
