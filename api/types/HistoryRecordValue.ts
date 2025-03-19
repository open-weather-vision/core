export type HistoryRecordData = {
  value: number | string | null
  trend?: 'rising strongly' | 'rising' | 'steady' | 'falling' | 'falling strongly'
}
