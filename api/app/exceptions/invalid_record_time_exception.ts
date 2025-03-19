import { Exception } from '@adonisjs/core/exceptions'

export default class InvalidRecordTimeException extends Exception {
  static status = 400
  static code = 'E_INVALID_RECORD_TIME'

  constructor(sensor_slug: string) {
    super(
      `Invalid record time on '${sensor_slug}'. A more recent record has already been uploaded!`
    )
  }
}
