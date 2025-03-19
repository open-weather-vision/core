export type UnitGroup =
  | 'temperature'
  | 'speed'
  | 'pressure'
  | 'precipitation'
  | 'uv'
  | 'air-quality'
  | 'weather-code'
  | 'portion'
  | 'duration'
  | 'distance'
  | 'direction'
  | 'sunshine-strength'
  | 'length'
  | 'soil-moisture'
  | 'other'

export const UnitGroups = [
  'temperature',
  'speed',
  'pressure',
  'precipitation',
  'uv',
  'air-quality',
  'weather-code',
  'portion',
  'duration',
  'distance',
  'direction',
  'sunshine-strength',
  'length',
  'soil-moisture',
  'other',
] as const
