import { column } from '@adonisjs/lucid/orm'
import { type SummaryAlgorithm } from '../../types/SummaryAlgorithm.js'
import AppBaseModel from './app_base_model.js'

export default class Element extends AppBaseModel {
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
