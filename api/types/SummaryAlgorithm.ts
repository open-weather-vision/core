export type SummaryAlgorithm =
  | 'avg'
  | 'min'
  | 'max'
  | 'min-max'
  | 'sum'
  | 'middle'
  | 'start'
  | 'end'

export const SummaryAlgorithms = [
  'avg',
  'min',
  'max',
  'min-max',
  'sum',
  'middle',
  'start',
  'end',
] as const
