export type TimeInterval = '${number}d' | '${number}h' | '${number}min' | '${number}s'

export type InterfaceConfig = {
  configParams: { [Property in string]: any }
  sensors: { [Property in string]: TimeInterval }
}
