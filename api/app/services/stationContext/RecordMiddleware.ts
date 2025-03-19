import { RawRecord } from '../../../types/RawRecord.js'
import Sensor from '#models/sensor'
import Station from '#models/station'

export abstract class RecordMiddleware {
  abstract init(station: Station): Promise<void>
  abstract process(sensor: Sensor, record: RawRecord): Promise<void>
}
