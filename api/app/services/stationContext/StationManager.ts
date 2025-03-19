import Sensor from '#models/sensor'
import Station from '#models/station'
import logger from '@adonisjs/core/services/logger'
import { RawRecord } from '../../../types/RawRecord.js'
import { HistoryRecordManager } from './HistoryRecordManager.js'
import { RankingRecordManager } from './RankingRecordManager.js'
import { RecordMiddleware } from './RecordMiddleware.js'

export default class StationManager {
  private station: Station
  private recordPipeline: RecordMiddleware[] = [
    new HistoryRecordManager(),
    new RankingRecordManager(),
  ]

  constructor(station: Station) {
    this.station = station
  }

  async init() {
    await Promise.all(this.recordPipeline.map((middleware) => middleware.init(this.station)))
  }

  async process(sensor: Sensor, rawRecord: RawRecord) {
    logger.debug(
      `Processing raw record for ${this.station?.slug}/${sensor.slug}: ${rawRecord.value?.toFixed(2)}${rawRecord.unit} at ${rawRecord.time}`
    )
    await Promise.all(
      this.recordPipeline.map((middleware) => middleware.process(sensor, rawRecord))
    )
  }
}
