import vine from '@vinejs/vine'

export const sensor_data_validator = vine.compile(
  vine.object({
    value: vine.number().nullable(),
    time: vine.date({
      formats: ['iso8601'],
    }),
    unit: vine.string(),
  })
)
