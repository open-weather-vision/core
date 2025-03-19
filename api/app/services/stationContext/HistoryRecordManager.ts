import InvalidRecordTimeException from '#exceptions/invalid_record_time_exception'
import HistoryRecord from '#models/history_record'
import Sensor from '#models/sensor'
import Station from '#models/station'
import { DateTime } from 'luxon'
import { HistoryRecordType, previousRecordType } from '../../../types/HistoryRecordType.js'
import { parseTimeInterval } from '../../../types/InterfaceConfig.js'
import { RawRecord } from '../../../types/RawRecord.js'
import { RecordMiddleware } from './RecordMiddleware.js'
import logger from '@adonisjs/core/services/logger'

type SensorState = {
  live: {
    nextRecordCount: number
    unprocessedRecordsCount: number
  }
  day: {
    nextRecordCount: number
    unprocessedRecordsCount: number
  }
  week: {
    nextRecordCount: number
    unprocessedRecordsCount: number
  }
  month: {
    nextRecordCount: number
    unprocessedRecordsCount: number
  }
}

export class HistoryRecordManager extends RecordMiddleware {
  private lastSensorRecords: Map<string, DateTime> = new Map()
  private sensorState: Map<string, SensorState> = new Map()
  private station?: Station

  async init(station: Station): Promise<void> {
    const sensors = await Sensor.query().where('stationSlug', station.slug)
    this.station = station
    for (const sensor of sensors) {
      const intervals = station.interfaceConfig.sensors[sensor.slug].map((interval) =>
        parseTimeInterval(interval)
      )
      this.sensorState.set(sensor.slug, {
        live: {
          nextRecordCount: Math.ceil(intervals[1] / intervals[0]),
          unprocessedRecordsCount: (
            await HistoryRecord.query()
              .where('processed', false)
              .andWhere('type', 'live')
              .andWhere('sensorId', sensor.id)
              .select('processed')
          ).length,
        },
        day: {
          nextRecordCount: Math.ceil(intervals[2] / intervals[1]),
          unprocessedRecordsCount: (
            await HistoryRecord.query()
              .where('processed', false)
              .andWhere('type', 'day')
              .andWhere('sensorId', sensor.id)
              .select('processed')
          ).length,
        },
        week: {
          nextRecordCount: Math.ceil(intervals[3] / intervals[2]),
          unprocessedRecordsCount: (
            await HistoryRecord.query()
              .where('processed', false)
              .andWhere('type', 'week')
              .andWhere('sensorId', sensor.id)
              .select('processed')
          ).length,
        },
        month: {
          nextRecordCount: Math.ceil(intervals[4] / intervals[3]),
          unprocessedRecordsCount: (
            await HistoryRecord.query()
              .where('processed', false)
              .andWhere('type', 'month')
              .andWhere('sensorId', sensor.id)
              .select('processed')
          ).length,
        },
      })
    }
  }

  private isNewTime(sensor: Sensor, time: DateTime) {
    const lastTime = this.lastSensorRecords.get(sensor.slug)
    return !lastTime || lastTime < time
  }

  /** Creates a new live record from a raw record. Returns a batch or records if they need to get processed to create a new day record. */
  private async newLiveRecord(
    sensor: Sensor,
    rawRecord: RawRecord
  ): Promise<HistoryRecord[] | false> {
    const liveRecord = new HistoryRecord()
    liveRecord.sensorId = sensor.id
    liveRecord.processed = false
    liveRecord.data = {
      value: rawRecord.value, // TODO: convert to internal unit
    }
    liveRecord.time = DateTime.fromISO(rawRecord.time)
    liveRecord.type = 'live'
    await liveRecord.save()

    logger.info(`${this.station?.slug}/${sensor.slug}: ${liveRecord.toString()}`)
    return await this.tryToGetUnprocessedBatch(sensor, 'live')
  }

  /** Creates a summarized record from a batch of sub-records. Returns a batch of summarized records if they need to get processed to a super-record. */
  private async newSummarizedRecord(
    sensor: Sensor,
    batch: HistoryRecord[],
    type: Exclude<HistoryRecordType, 'live'>
  ): Promise<HistoryRecord[] | false> {
    await this.summarizeRecords(sensor, batch, type)
    if (type !== 'year') return await this.tryToGetUnprocessedBatch(sensor, type)
    return false
  }

  /** Gets the unprocessed batch of the given type if it is ready to be processed. */
  async tryToGetUnprocessedBatch(sensor: Sensor, type: Exclude<HistoryRecordType, 'year'>) {
    const sensorState = this.sensorState.get(sensor.slug)!
    sensorState[type].unprocessedRecordsCount++
    if (sensorState[type].unprocessedRecordsCount >= sensorState[type].nextRecordCount) {
      const batch = await HistoryRecord.query()
        .where('processed', false)
        .andWhere('type', type)
        .andWhere('sensorId', sensor.id)
        .orderBy('time', 'asc')
      return batch
    }
    return false
  }

  /** Summarizes a batch of records and creates a new record of the passed type. */
  private async summarizeRecords(
    sensor: Sensor,
    batch: HistoryRecord[],
    type: Exclude<HistoryRecordType, 'live'>
  ) {
    logger.debug(
      `Summarizing ${this.station?.slug}/${sensor.slug} ${previousRecordType(type)}-record batch of length ${batch.length}`
    )
    await sensor.load('element')
    const result: HistoryRecord[] = []
    switch (sensor.element.summaryAlgorithm) {
      case 'avg':
        result[0] = new HistoryRecord()
        result[0].sensorId = sensor.id
        let avgValue: number | null = 0
        let count = 0
        for (const record of batch) {
          if (typeof record.data.value === 'number') {
            avgValue += record.data.value
            count++
          }
        }
        if (count == 0) {
          avgValue = null
        } else {
          avgValue = avgValue / count
        }
        result[0].data = {
          value: avgValue,
        }
        result[0].time = DateTime.fromMillis(
          (batch[0].time.toMillis() + batch[1].time.toMillis()) / 2
        )
        await result[0].save()
        break
      case 'start':
        result[0] = new HistoryRecord()
        result[0].sensorId = sensor.id
        result[0].type = type
        result[0].time = batch[0].time
        result[0].data = {
          value: batch[0].data.value,
        }
        await result[0].save()
        break
      case 'end':
        result[0] = new HistoryRecord()
        result[0].sensorId = sensor.id
        result[0].type = type
        result[0].time = batch[batch.length - 1].time
        result[0].data = {
          value: batch[batch.length - 1].data.value,
        }
        await result[0].save()
        break
      case 'max':
        result[0] = new HistoryRecord()
        result[0].sensorId = sensor.id
        result[0].type = type
        const maxRecord = batch.reduce((prev, current) => {
          if (
            prev &&
            prev.data.value &&
            current.data.value &&
            prev.data.value >= current.data.value
          )
            return prev
          else return current
        })
        result[0].time = maxRecord.time
        result[0].data = {
          value: maxRecord.data.value,
        }
        await result[0].save()
        break
      case 'min':
        result[0] = new HistoryRecord()
        result[0].sensorId = sensor.id
        result[0].type = type
        const minRecord = batch.reduce((prev, current) => {
          if (
            prev &&
            prev.data.value &&
            current.data.value &&
            prev.data.value <= current.data.value
          )
            return prev
          else return current
        })
        result[0].time = minRecord.time
        result[0].data = {
          value: minRecord.data.value,
        }
        await result[0].save()
        break
      case 'middle':
        result[0] = new HistoryRecord()
        result[0].sensorId = sensor.id
        result[0].type = type
        const middle = Math.ceil(batch.length / 2)
        result[0].time = batch[middle].time
        result[0].data = {
          value: batch[middle].data.value,
        }
        await result[0].save()
        break
      case 'min-max':
        const extremes = [
          batch.reduce((prev, current) => {
            if (
              prev &&
              prev.data.value &&
              current.data.value &&
              prev.data.value <= current.data.value
            )
              return prev
            else return current
          }),
          batch.reduce((prev, current) => {
            if (
              prev &&
              prev.data.value &&
              current.data.value &&
              prev.data.value >= current.data.value
            )
              return prev
            else return current
          }),
        ]

        // min
        result[0] = new HistoryRecord()
        result[0].sensorId = sensor.id
        result[0].type = type
        result[0].data = {
          value: extremes[0].data.value,
        }
        result[0].time = extremes[0].time
        await result[0].save()

        // max
        result[1] = new HistoryRecord()
        result[1].sensorId = sensor.id
        result[1].type = type
        result[1].data = {
          value: extremes[1].data.value,
        }
        result[1].time = extremes[1].time
        await result[1].save()

        break
      case 'sum':
        result[0] = new HistoryRecord()
        result[0].sensorId = sensor.id
        result[0].type = type
        result[0].data = {
          value: batch
            .map((record) => record.data.value)
            .reduce((prev: any, current: any) => prev + current),
        }
        result[0].time = batch[batch.length - 1].time
        await result[0].save()
        break
    }
    logger.info(`${this.station?.slug}/${sensor.slug}: ${result[0].toString()}`)
    if (result[1]) logger.info(`${this.station?.slug}/${sensor.slug}: ${result[1].toString()}`)
    for (const record of batch) {
      record.processed = true
      await record.save()
    }
    this.sensorState.get(sensor.slug)![previousRecordType(type)].unprocessedRecordsCount = 0
  }

  async process(sensor: Sensor, record: RawRecord): Promise<void> {
    const parsedTime = DateTime.fromISO(record.time)

    if (!this.isNewTime(sensor, parsedTime)) {
      logger.warn(`Received record with invalid time on ${this.station!.slug}/${sensor.slug}!`)
      throw new InvalidRecordTimeException(sensor.slug)
    }

    const liveRecordBatch = await this.newLiveRecord(sensor, record)
    if (liveRecordBatch) {
      const dayRecordBatch = await this.newSummarizedRecord(sensor, liveRecordBatch, 'day')
      if (dayRecordBatch) {
        const weekRecordBatch = await this.newSummarizedRecord(sensor, dayRecordBatch, 'week')
        if (weekRecordBatch) {
          const monthRecordBatch = await this.newSummarizedRecord(sensor, weekRecordBatch, 'month')
          if (monthRecordBatch) {
            await this.newSummarizedRecord(sensor, monthRecordBatch, 'year')
          }
        }
      }
    }
  }
}
