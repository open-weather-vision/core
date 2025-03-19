import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import type { RightLevel } from '../../types/RightLevel.js'
import AppBaseModel from './app_base_model.js'

export default class Session extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare token: string

  @column()
  declare refreshToken: string | null

  @column()
  declare rightLevel: RightLevel

  @column.dateTime()
  declare validUntil: DateTime | null
}
