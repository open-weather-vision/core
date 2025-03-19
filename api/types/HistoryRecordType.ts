export type HistoryRecordType = 'live' | 'day' | 'week' | 'month' | 'year'
export const HistoryRecordTypes = ['live', 'day', 'week', 'month', 'year'] as const

export function nextRecordType(
  type: Exclude<HistoryRecordType, 'year'>
): Exclude<HistoryRecordType, 'live'> {
  switch (type) {
    case 'live':
      return 'day'
    case 'day':
      return 'week'
    case 'week':
      return 'month'
    case 'month':
      return 'year'
  }
}

export function previousRecordType(
  type: Exclude<HistoryRecordType, 'live'>
): Exclude<HistoryRecordType, 'year'> {
  switch (type) {
    case 'year':
      return 'month'
    case 'day':
      return 'live'
    case 'week':
      return 'day'
    case 'month':
      return 'week'
  }
}
