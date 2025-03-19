import { BaseSchema } from '@adonisjs/lucid/schema'
import { SummaryAlgorithms } from '../../types/SummaryAlgorithm.js'
import { UnitGroups } from '../../types/UnitGroup.js'
import { Elements } from '../../types/Elements.js'

export default class extends BaseSchema {
  protected tableName = 'elements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.enum('slug', Elements).primary()
      table.enum('summaryAlgorithm', SummaryAlgorithms).notNullable()
      table.boolean('hasMaxRanking').notNullable()
      table.boolean('hasMinRanking').notNullable()
      table.enum('unitGroup', UnitGroups).notNullable()
      table.string('defaultUnit').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
