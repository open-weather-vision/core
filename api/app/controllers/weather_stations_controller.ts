// import type { HttpContext } from '@adonisjs/core/http'

import NotFoundException from '#exceptions/not_found_exception'
import UnitConfig from '#models/unit_config'
import WeatherStation from '#models/weather_station'
import { initializeWeatherStationValidator } from '#validators/weather_station'
import { HttpContext } from '@adonisjs/core/http'
import { SummaryCreator } from '../other/summary_creator.js'
import WeatherStationInterface from '../other/weather_station_interface.js'
import Sensor from '#models/sensor'

export default class WeatherStationsController {
  async getAll() {
    const data = await WeatherStation.query().select('slug', 'name', 'interface', 'state')

    return {
      success: true,
      data,
    }
  }

  async getOne(ctx: HttpContext) {
    const data = await WeatherStation.query()
      .preload('unit_config')
      .where('slug', ctx.params.slug)
      .first()

    const serializedData = data?.serialize()

    console.log(serializedData)
    if (serializedData?.unit_config === null) {
      serializedData.unit_config = (
        await UnitConfig.query().where('global', true).firstOrFail()
      ).serialize()
    }

    if (data == null) {
      throw new NotFoundException(`No weather station with name '${ctx.params.slug}' exist!`)
    }

    return {
      success: true,
      data: serializedData,
    }
  }

  async initialize(ctx: HttpContext) {
    const data = ctx.request.all()
    const payload = await initializeWeatherStationValidator.validate(data)

    const weatherStation = await WeatherStation.create({
      interface: payload.interface,
      interface_config: payload.interface_config,
      name: payload.name,
      slug: payload.slug,
      state: 'disconnected',
    })

    if (payload.units) {
      await UnitConfig.create({
        elevation_unit: payload.units.elevation,
        evo_transpiration_unit: payload.units.evo_transpiration,
        humidity_unit: payload.units.humidity,
        leaf_temperature_unit: payload.units.leaf_temperature,
        temperature_unit: payload.units.temperature,
        solar_radiation_unit: payload.units.solar_radiation,
        soil_moisture_unit: payload.units.soil_moisture,
        precipation_unit: payload.units.precipation,
        pressure_unit: payload.units.pressure,
        soil_temperature_unit: payload.units.soil_temperature,
        wind_unit: payload.units.wind,
        weather_station_id: weatherStation.id,
        global: false,
      })
    }

    const StationInterface = await import(`../../interfaces/${payload.interface}.js`)
    const station_interface: WeatherStationInterface = new StationInterface.default(
      payload.interface_config
    )

    for (const sensor_slug in station_interface.sensors) {
      const sensor = station_interface.sensors[sensor_slug]
      await Sensor.create({
        ...sensor,
        weather_station_id: weatherStation.id,
        slug: sensor_slug,
      })
    }

    await SummaryCreator.createAndStart(weatherStation.id, station_interface)

    return {
      success: true,
    }
  }
}
