export type HistoryRecordValue = {
  value: number | string
  trend?: 'rising strongly' | 'rising' | 'steady' | 'falling' | 'falling strongly'
}
