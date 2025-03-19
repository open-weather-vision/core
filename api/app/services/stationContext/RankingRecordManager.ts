import Sensor from '#models/sensor'
import Station from '#models/station'
import { RawRecord } from '../../../types/RawRecord.js'
import { RecordMiddleware } from './RecordMiddleware.js'

export class RankingRecordManager extends RecordMiddleware {
  async init(station: Station): Promise<void> {}
  async process(sensor: Sensor, record: RawRecord): Promise<void> {}
}
