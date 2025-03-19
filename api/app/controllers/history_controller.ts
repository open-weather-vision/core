// import type { HttpContext } from '@adonisjs/core/http'

import StationNotFoundException from '#exceptions/station_not_found_exception'
import HistoryRecord from '#models/history_record'
import Sensor from '#models/sensor'
import Station from '#models/station'
import { history_interval_validator } from '#validators/history_interval'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class HistoryController {
  // GET /station/:station/history/now
  // TODO: Unit conversion
  async now(context: HttpContext) {
    const station = await Station.query().where('slug', context.params.station).first()

    if (!station) {
      throw new StationNotFoundException(context.params.station)
    }

    const sensors = await Sensor.query().where('station_slug', context.params.station)
    const result: any = {}
    if (station.isRecorderReachable) {
      for (const sensor of sensors) {
        const latestRecord = await HistoryRecord.query()
          .where('sensor_id', sensor.id)
          .orderBy('time', 'desc')
          .select('data', 'time')
          .first()
        result[sensor.slug] = latestRecord
      }
    } else {
      for (const sensor of sensors) {
        result[sensor.slug] = null
      }
    }
    return result
  }

  // GET /station/:station/history?from=date&interval=month
  async interval(context: HttpContext) {
    const station = await Station.query().where('slug', context.params.station).first()
    if (!station) {
      throw new StationNotFoundException(context.params.station)
    }

    await context.request.validateUsing(history_interval_validator)
    const sensors = await Sensor.query().where('station_slug', context.params.station)
    const result: any = {}
    const from = DateTime.fromISO(context.request.input('from'))
    const to = from.plus({ [context.request.input('interval')]: 1 })

    for (const sensor of sensors) {
      const allRecords = (
        await HistoryRecord.query()
          .where('sensor_id', sensor.id)
          .andWhere('type', context.request.input('interval'))
          .andWhere('time', '>=', from.toISO()!)
          .andWhere('time', '<', to.toISO()!)
          .orderBy('time', 'asc')
          .select('data', 'time')
      ).map((record: any) => ({ time: record.time, value: record.data.value }))
      result[sensor.slug] = allRecords
    }
    return result
  }
}
