import { column } from '@adonisjs/lucid/orm'
import AppBaseModel from './app_base_model.js'

export default class AdminUser extends AppBaseModel {
  @column({ isPrimary: true })
  declare name: string

  @column()
  declare password: string
}
