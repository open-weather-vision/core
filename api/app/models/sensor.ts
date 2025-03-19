import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Station from './station.js'
import Element from './element.js'

export default class Sensor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare index: number | null

  @column()
  declare public: boolean

  @column()
  declare sensorGroup: number | null

  @column()
  declare stationSlug: string
  @belongsTo(() => Station, {
    foreignKey: 'stationSlug',
  })
  declare station: BelongsTo<typeof Station>

  @column()
  declare elementSlug: Element
  @belongsTo(() => Element, {
    foreignKey: 'elementSlug',
  })
  declare element: BelongsTo<typeof Element>
}
