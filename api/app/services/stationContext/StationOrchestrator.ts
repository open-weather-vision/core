import Station from '#models/station'
import StationManager from './StationManager.js'
import logger from '@adonisjs/core/services/logger'

class StationOrchestrator {
  public static singleton: StationOrchestrator = new StationOrchestrator()

  private managers: Map<string, StationManager>

  private constructor() {
    this.managers = new Map()
  }

  public async init() {
    logger.info('Initializing station orchestrator service')
    const stations = await Station.query()
    await Promise.all(stations.map((station) => this.addStationManager(station)))
  }

  public async addStationManager(station: Station) {
    const manager = new StationManager(station)
    await manager.init()
    this.managers.set(station.slug, manager)
    logger.info(`Added station manager for station ${station.slug}`)
  }

  public getStationManager(stationSlug: string) {
    return this.managers.get(stationSlug)
  }
}

export default StationOrchestrator.singleton
