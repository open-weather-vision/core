import { BaseSchema } from '@adonisjs/lucid/schema'
import { SummaryAlgorithms } from '../../types/SummaryAlgorithm.js'
import { UnitGroups } from '../../types/UnitGroup.js'
import { WeatherElements } from '../../types/Elements.js'

export default class extends BaseSchema {
  protected tableName = 'elements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.enum('slug', WeatherElements).primary()
      table.enum('summary_algorithm', SummaryAlgorithms).notNullable()
      table.boolean('has_max_ranking').notNullable()
      table.boolean('has_min_ranking').notNullable()
      table.enum('unit_group', UnitGroups).notNullable()
      table.string('default_unit').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
