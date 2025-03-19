export type UnitGroup =
  | 'temperature'
  | 'speed'
  | 'pressure'
  | 'precipitation'
  | 'uv'
  | 'airQuality'
  | 'weatherCode'
  | 'portion'
  | 'duration'
  | 'distance'
  | 'direction'
  | 'sunshineStrength'
  | 'other'

export const UnitGroups = [
  'temperature',
  'speed',
  'pressure',
  'precipitation',
  'uv',
  'airQuality',
  'weatherCode',
  'portion',
  'duration',
  'distance',
  'direction',
  'sunshineStrength',
  'other',
] as const
