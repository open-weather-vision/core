import { Element } from './Elements.js'
import { TimeInterval } from './InterfaceConfig.js'

export type ConfigParam<T extends 'string' | 'number' | 'boolean'> = {
  type: T
  required?: boolean
  choices?: T[]
  default?: T
}

export type Tag = 'outside' | 'inside'
export const Tags = ['outside', 'inside'] as const

export type SensorDescription = {
  element: Element
  unit: string
  tags: Tag[]
  index?: number
  sensorGroup?: number
  private?: boolean
  interval:
    | TimeInterval
    | {
        type: 'multiple-of'
        value: TimeInterval
      }
    | {
        type: 'selectable'
        choices: TimeInterval[]
      }
}

export type InterfaceMeta = {
  name: string
  supportedStations: [string, string][]
  entrypoint: string
  configParams: { [Property in string]: ConfigParam<any> }
  sensors: { [Property in string]: SensorDescription }
}
