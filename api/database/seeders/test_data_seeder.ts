import HistoryRecord from '#models/history_record'
import Interface from '#models/interface'
import Sensor from '#models/sensor'
import Station from '#models/station'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import { parseTimeInterval, TimeInterval } from '../../types/InterfaceConfig.js'
import Element from '#models/element'
import { WeatherElement } from '../../types/Elements.js'
import { SummaryAlgorithm } from '../../types/SummaryAlgorithm.js'
import { UnitGroup } from '../../types/UnitGroup.js'

export default class extends BaseSeeder {
  async run() {
    await this.createElements()

    const testInterface = new Interface()
    testInterface.name = 'Davis Vantage Interface'
    testInterface.repositoryUrl = 'https://github.com/open-weather-vision/davis-vantage-interface'
    testInterface.version = '1.0.0'
    testInterface.official = true
    await testInterface.save()

    const station = new Station()
    station.name = 'Test Station'
    station.slug = 'test-station'
    station.interfaceId = testInterface.id
    station.latitude = 51.5074
    station.longitude = 0.1278
    station.interfaceConfig = {
      configParams: {
        port: '/dev/ttyUSB0',
        baudRate: 9600,
      },
      sensors: {
        temperature: '5s',
        humidity: '1min',
        windSpeed: '2s',
        precipation: '15min',
      },
    }
    station.recorderStatus = 'connected'
    station.isRecorderReachable = true
    station.lastRecorderPing = DateTime.now()
    station.isForecastEnabled = true
    await station.save()

    const temperatureSensor = new Sensor()
    temperatureSensor.elementSlug = 'air-temperature'
    temperatureSensor.slug = 'temperature'
    temperatureSensor.public = true
    temperatureSensor.stationSlug = station.slug
    await temperatureSensor.save()

    const humiditySensor = new Sensor()
    humiditySensor.elementSlug = 'humidity'
    humiditySensor.slug = 'humidity'
    humiditySensor.public = true
    humiditySensor.stationSlug = station.slug
    await humiditySensor.save()

    const windSpeedSensor = new Sensor()
    windSpeedSensor.elementSlug = 'wind-speed'
    windSpeedSensor.slug = 'windSpeed'
    windSpeedSensor.public = true
    windSpeedSensor.stationSlug = station.slug
    await windSpeedSensor.save()

    const precipationSensor = new Sensor()
    precipationSensor.elementSlug = 'precipation'
    precipationSensor.slug = 'precipation'
    precipationSensor.public = true
    precipationSensor.stationSlug = station.slug
    await precipationSensor.save()

    const recordCount = 100
    const now = DateTime.now()
    await this.createFloatingPointRecordsForSensor(
      temperatureSensor,
      station.interfaceConfig.sensors.temperature,
      recordCount,
      [10, 30],
      1,
      now
    )

    await this.createFloatingPointRecordsForSensor(
      humiditySensor,
      station.interfaceConfig.sensors.humidity,
      recordCount,
      [50, 100],
      1,
      now
    )

    await this.createFloatingPointRecordsForSensor(
      precipationSensor,
      station.interfaceConfig.sensors.precipation,
      recordCount,
      [0, 2],
      0.5,
      now
    )
  }

  async createElements() {
    const elements: {
      [key in Exclude<WeatherElement, 'other'>]: {
        summaryAlgorithm: SummaryAlgorithm
        hasMaxRanking: boolean
        hasMinRanking: boolean
        defaultUnit: string
        unitGroup: UnitGroup
      }
    } = {
      'air-quality': {
        summaryAlgorithm: 'min-max',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: 'µg/m³',
        unitGroup: 'air-quality',
      },
      'air-temperature': {
        summaryAlgorithm: 'min-max',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: '°C',
        unitGroup: 'temperature',
      },
      'cloudiness': {
        summaryAlgorithm: 'avg',
        hasMaxRanking: false,
        hasMinRanking: false,
        defaultUnit: '%',
        unitGroup: 'portion',
      },
      'dew-point': {
        summaryAlgorithm: 'min-max',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: '°C',
        unitGroup: 'temperature',
      },
      'humidity': {
        summaryAlgorithm: 'avg',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: '%',
        unitGroup: 'portion',
      },
      'davis-leaf-wetness': {
        summaryAlgorithm: 'min-max',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: 'LWI',
        unitGroup: 'portion',
      },
      'evaporation': {
        summaryAlgorithm: 'sum',
        hasMaxRanking: true,
        hasMinRanking: false,
        defaultUnit: 'mm',
        unitGroup: 'precipitation',
      },
      'heat-index': {
        summaryAlgorithm: 'max',
        hasMaxRanking: true,
        hasMinRanking: false,
        defaultUnit: '°C',
        unitGroup: 'temperature',
      },
      'leaf-temperature': {
        summaryAlgorithm: 'avg',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: '°C',
        unitGroup: 'temperature',
      },
      'precipation': {
        summaryAlgorithm: 'sum',
        hasMaxRanking: true,
        hasMinRanking: false,
        defaultUnit: 'mm',
        unitGroup: 'precipitation',
      },
      'perceived-temperature': {
        summaryAlgorithm: 'min-max',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: '°C',
        unitGroup: 'temperature',
      },
      'pressure': {
        summaryAlgorithm: 'avg',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: 'hPa',
        unitGroup: 'pressure',
      },
      'snow-height': {
        summaryAlgorithm: 'max',
        hasMaxRanking: true,
        hasMinRanking: false,
        defaultUnit: 'cm',
        unitGroup: 'length',
      },
      'soil-moisture': {
        summaryAlgorithm: 'min-max',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: 'cb',
        unitGroup: 'soil-moisture',
      },
      'soil-temperature': {
        summaryAlgorithm: 'min-max',
        hasMaxRanking: true,
        hasMinRanking: true,
        defaultUnit: '°C',
        unitGroup: 'temperature',
      },
      'sunshine-duration': {
        summaryAlgorithm: 'sum',
        hasMaxRanking: true,
        hasMinRanking: false,
        defaultUnit: 'h',
        unitGroup: 'duration',
      },
      'sunshine-strength': {
        summaryAlgorithm: 'avg',
        hasMaxRanking: false,
        hasMinRanking: false,
        defaultUnit: 'W/m²',
        unitGroup: 'sunshine-strength',
      },
      'thsw-index': {
        summaryAlgorithm: 'max',
        hasMaxRanking: true,
        hasMinRanking: false,
        defaultUnit: '°C',
        unitGroup: 'temperature',
      },
      'uv': {
        summaryAlgorithm: 'max',
        hasMaxRanking: true,
        hasMinRanking: false,
        defaultUnit: 'UVI',
        unitGroup: 'uv',
      },
      'visibility': {
        summaryAlgorithm: 'avg',
        hasMaxRanking: false,
        hasMinRanking: false,
        defaultUnit: 'km',
        unitGroup: 'distance',
      },
      'weather-condition': {
        summaryAlgorithm: 'middle',
        hasMaxRanking: false,
        hasMinRanking: false,
        defaultUnit: '',
        unitGroup: 'weather-code',
      },
      'wind-chill': {
        summaryAlgorithm: 'min',
        hasMaxRanking: false,
        hasMinRanking: true,
        defaultUnit: '°C',
        unitGroup: 'temperature',
      },
      'wind-direction': {
        summaryAlgorithm: 'avg',
        hasMaxRanking: false,
        hasMinRanking: false,
        defaultUnit: '°',
        unitGroup: 'direction',
      },
      'wind-gust-speed': {
        summaryAlgorithm: 'max',
        hasMaxRanking: true,
        hasMinRanking: false,
        defaultUnit: 'km/h',
        unitGroup: 'speed',
      },
      'wind-speed': {
        summaryAlgorithm: 'max',
        hasMaxRanking: true,
        hasMinRanking: false,
        defaultUnit: 'km/h',
        unitGroup: 'speed',
      },
    }

    for (const _element of Object.keys(elements)) {
      const element = _element as keyof typeof elements
      const elementModel = new Element()
      elementModel.slug = element
      elementModel.summaryAlgorithm = elements[element].summaryAlgorithm
      elementModel.hasMaxRanking = elements[element].hasMaxRanking
      elementModel.hasMinRanking = elements[element].hasMinRanking
      elementModel.defaultUnit = elements[element].defaultUnit
      elementModel.unitGroup = elements[element].unitGroup
      await elementModel.save()
    }
  }

  async createFloatingPointRecordsForSensor(
    sensor: Sensor,
    sensorInterval: TimeInterval,
    count: number,
    range: [number, number],
    changePerInterval: number,
    now: DateTime
  ) {
    const parsedInterval = parseTimeInterval(sensorInterval)
    let valueBefore = Math.random() * (range[1] - range[0]) + range[0]
    for (let i = 0; i < count; i++) {
      const record = new HistoryRecord()
      record.sensorId = sensor.id
      let value = valueBefore + Math.random() * changePerInterval - changePerInterval / 2
      if (value > range[1]) value = range[1]
      if (value < range[0]) value = range[0]
      record.data = {
        value,
      }
      record.time = now.minus({ seconds: i * parsedInterval })
      record.type = 'live'
      record.intervalSeconds = parsedInterval
      await record.save()
    }
  }
}
