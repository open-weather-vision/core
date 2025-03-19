export type RecorderStatus = 'connected' | 'connecting' | 'disconnected' | 'disconnecting'
export const RecorderStatuses = [
  'connected',
  'connecting',
  'disconnected',
  'disconnecting',
] as const
