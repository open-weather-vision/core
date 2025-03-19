export type HistoryRecordData = {
  value: number | string
  trend?: 'rising strongly' | 'rising' | 'steady' | 'falling' | 'falling strongly'
}
