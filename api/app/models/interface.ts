import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Interface extends BaseModel {
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
