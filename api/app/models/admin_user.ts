import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AdminUser extends BaseModel {
  @column({ isPrimary: true })
  declare name: string

  @column()
  declare password: string
}
