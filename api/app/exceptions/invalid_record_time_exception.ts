import { Exception } from '@adonisjs/core/exceptions'

export default class InvalidRecordTimeException extends Exception {
  static status = 400

  constructor(sensor_slug: string) {
    super(
      `Invalid record time on '${sensor_slug}'. A more recent record has already been uploaded!`
    )
  }
}
