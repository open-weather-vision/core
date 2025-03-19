import { BaseModel, column } from '@adonisjs/lucid/orm'
import { type SummaryAlgorithm } from '../../types/SummaryAlgorithm.js'

export default class Element extends BaseModel {
  @column({ isPrimary: true })
  declare slug: string

  @column()
  declare summaryAlgorithm: SummaryAlgorithm

  @column()
  declare hasMaxRanking: boolean

  @column()
  declare hasMinRanking: boolean

  @column()
  declare unitGroup: string

  @column()
  declare defaultUnit: string
}
