class StationOrchestrator {
  public static singleton: StationOrchestrator = new StationOrchestrator()

  private constructor() {}

  public init() {}

  public destroy() {}
}

export default StationOrchestrator.singleton
