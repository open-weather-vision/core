// import type { HttpContext } from '@adonisjs/core/http'

import NotFoundException from '#exceptions/not_found_exception'
import Sensor from '#models/sensor'
import Summary from '#models/summary'
import SummaryRecord from '#models/summary_record'
import WeatherStation from '#models/weather_station'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { TimeUnit } from '../other/scheduler.js'
import {
  get_latest_query_params_validator,
  get_latest_route_params_validator,
  get_one_query_params_validator,
  get_one_route_params_validator,
} from '#validators/summaries'

export default class SummariesController {
  async get_one(ctx: HttpContext) {
    const params = await get_one_route_params_validator.validate(ctx.request.params())
    const query = await get_one_query_params_validator.validate(ctx.request.qs())

    const weather_station = await WeatherStation.query()
      .select('id')
      .where('slug', params.slug)
      .first()

    if (!weather_station) {
      throw new NotFoundException(
        `Cannot read from sensor of unknown weather station '${params.slug}'`
      )
    }

    const sensor = await Sensor.query()
      .where('weather_station_id', weather_station.id)
      .where('slug', params.sensor_slug)
      .select('id')
      .first()

    if (!sensor) {
      throw new NotFoundException(
        `Cannot read from unknown sensor '${params.sensor_slug}' of weather station '${params.slug}'`
      )
    }

    let type: TimeUnit
    if (query.hour) type = 'hour'
    else if (query.day) type = 'day'
    else if (query.week) type = 'week'
    else if (query.month) type = 'month'
    else type = 'year'

    let start_date: DateTime
    if (type === 'week') {
      start_date = DateTime.local(query.year, 1, 1).set({
        localWeekNumber: query.week,
        localWeekday: 1,
      })
    } else {
      start_date = DateTime.local(query.year, query.month ?? 1, query.day ?? 1).set({
        hour: query.hour ?? 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
    }
    const stop_date = start_date.plus({ [type]: 1 })

    const summary = await Summary.query()
      .where('weather_station_id', weather_station.id)
      .andWhere('type', type)
      .andWhere('created_at', '>=', start_date.toBSON())
      .andWhere('created_at', '<', stop_date.toBSON())
      .select('id', 'created_at')
      .first()

    if (!summary) {
      throw new NotFoundException(`There is no summary for the specified interval!`)
    }

    const record = await SummaryRecord.query()
      .where('sensor_id', sensor.id)
      .where('summary_id', summary.id)
      .first()

    if (query.unit) record?.convert_to(query.unit)

    return {
      success: true,
      data: {
        ...record?.data,
        created_at: summary.created_at,
      },
    }
  }

  async get_latest_one(ctx: HttpContext) {
    const params = await get_latest_route_params_validator.validate(ctx.request.params())
    const query = await get_latest_query_params_validator.validate(ctx.request.qs())

    const weather_station = await WeatherStation.query()
      .select('id')
      .where('slug', params.slug)
      .first()

    if (!weather_station) {
      throw new NotFoundException(
        `Cannot read from sensor of unknown weather station '${params.slug}'`
      )
    }

    const sensor = await Sensor.query()
      .where('weather_station_id', weather_station.id)
      .where('slug', params.sensor_slug)
      .select('id')
      .first()

    if (!sensor) {
      throw new NotFoundException(
        `Cannot read from unknown sensor '${params.sensor_slug}' of weather station '${params.slug}'`
      )
    }

    const summary = await Summary.query()
      .where('weather_station_id', weather_station.id)
      .andWhere('type', query.type)
      .orderBy('created_at', 'desc')
      .select('id', 'created_at')
      .firstOrFail()

    const record = await SummaryRecord.query()
      .where('sensor_id', sensor.id)
      .where('summary_id', summary.id)
      .first()

    if (query.unit) record?.convert_to(query.unit)

    return {
      success: true,
      data: {
        ...record?.data,
        created_at: summary.created_at,
      },
    }
  }
}