import { Exception } from '@adonisjs/core/exceptions'

export default class StationNotFoundException extends Exception {
  static status = 404
  static code = 'E_STATION_NOT_FOUND'

  constructor(station_slug: string) {
    super(`Can't find any station called '${station_slug}'!`)
  }
}
