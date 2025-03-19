import vine from '@vinejs/vine'
import { HistoryRecordTypes } from '../../types/HistoryRecordType.js'

export const history_interval_validator = vine.compile(
  vine.object({
    from: vine.date({
      formats: ['iso8601'],
    }),
    interval: vine.enum(HistoryRecordTypes.filter((type) => type !== 'live')),
  })
)
