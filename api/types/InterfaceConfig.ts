export type TimeInterval =
  | `${number}w`
  | `${number}d`
  | `${number}h`
  | `${number}min`
  | `${number}s`

export function parseTimeInterval(timeInterval: TimeInterval): number {
  if (timeInterval.match(/\d+w/)) {
    return parseInt(timeInterval.match(/\d+/)![0]) * 86400 * 7
  } else if (timeInterval.match(/\d+d/)) {
    return parseInt(timeInterval.match(/\d+/)![0]) * 86400
  } else if (timeInterval.match(/\d+h/)) {
    return parseInt(timeInterval.match(/\d+/)![0]) * 3600
  } else if (timeInterval.match(/\d+min/)) {
    return parseInt(timeInterval.match(/\d+/)![0]) * 60
  }
  return parseInt(timeInterval.match(/\d+/)![0])
}

export type InterfaceConfig = {
  configParams: { [Property in string]: any }
  sensors: {
    [Property in string]: [TimeInterval, TimeInterval, TimeInterval, TimeInterval, TimeInterval]
  }
}
