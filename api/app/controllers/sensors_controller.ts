import StationNotFoundException from '#exceptions/station_not_found_exception'
import Sensor from '#models/sensor'
import Station from '#models/station'
import StationOrchestrator from '#services/stationContext/StationOrchestrator'
import { sensor_data_validator } from '#validators/sensor_data'
import type { HttpContext } from '@adonisjs/core/http'
import { RawRecord } from '../../types/RawRecord.js'
import SensorNotFoundException from '#exceptions/sensor_not_found_exception'

export default class SensorsController {
  // GET /station/:station/sensors
  async getAll(context: HttpContext) {
    const station = await Station.query().where('slug', context.params.station).first()
    if (!station) {
      throw new StationNotFoundException(context.params.station)
    }

    const sensors = (
      await Sensor.query()
        .where('station_slug', context.params.station)
        .preload('element')
        .select('slug', 'element_slug', 'index', 'public', 'sensor_group')
    ).map((sensor) => ({
      slug: sensor.slug,
      public: sensor.public,
      sensor_group: sensor.sensorGroup,
      element: sensor.elementSlug,
      unit: sensor.element.defaultUnit,
      index: sensor.index,
    }))
    return sensors
  }

  // POST /station/:station/sensors/:sensor
  async write(context: HttpContext) {
    await context.request.validateUsing(sensor_data_validator)

    const station = await Station.query().where('slug', context.params.station).first()
    if (!station) {
      throw new StationNotFoundException(context.params.station)
    }

    const sensor = await Sensor.query().where('slug', context.params.station).first()
    if (!sensor) {
      throw new SensorNotFoundException(context.params.sensor)
    }

    await StationOrchestrator.getStationManager(station.slug)!.process(
      sensor,
      context.request.body() as RawRecord
    )

    return {
      success: true,
    }
  }
}
