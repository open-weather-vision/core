import { Exception } from '@adonisjs/core/exceptions'

export default class SensorNotFoundException extends Exception {
  static status = 404
  static code = 'E_SENSOR_NOT_FOUND'

  constructor(sensor_slug: string) {
    super(`Can't find any sensor called '${sensor_slug}'!`)
  }
}
