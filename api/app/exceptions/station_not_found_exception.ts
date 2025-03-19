import { Exception } from '@adonisjs/core/exceptions'

export default class StationNotFoundException extends Exception {
  static status = 404

  constructor(station_slug: string) {
    super(`Can't find any station called '${station_slug}'!`)
  }
}
