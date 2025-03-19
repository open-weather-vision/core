import { column } from '@adonisjs/lucid/orm'
import AppBaseModel from './app_base_model.js'

export default class Interface extends AppBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare repositoryUrl: string

  @column()
  declare version: string

  @column()
  declare official: boolean
}
