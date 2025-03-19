import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { RightLevel } from '../../types/RightLevel.js'

export default class Session extends BaseModel {
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
