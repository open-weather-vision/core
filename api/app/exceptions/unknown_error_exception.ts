import { Exception } from '@adonisjs/core/exceptions'

export default class UnknownErrorException extends Exception {
  static status = 500
  static code = 'E_UNKNOWN_ERROR'

  constructor(message: string) {
    super(`An unknown error occured: ${message}`)
  }
}
