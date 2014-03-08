/**
 * Query interface message fields.
 */
LiquidGalaxyApp.value('QueryMessageFields', {
  Planet: {
    Destination: 'destination'
  },
  Search: {
    Query: 'query'
  },
  FlyTo: {
    Type: 'type',
    Location: 'location',
    Orientation: 'orientation',
    Latitude: 'latitude',
    Longitude: 'longitude',
    Altitude: 'altitude',
    Heading: 'heading',
    Tilt: 'tilt',
    Roll: 'roll',
    Range: 'range',
    AltitudeMode: 'altitudeMode'
  }
});

/**
 * FlyTo message values.
 */
LiquidGalaxyApp.value('FlyToMessageValues', {
  Type: {
    Camera: 'camera',
    LookAt: 'lookat'
  },
  AltitudeMode: {
    Absolute: 'absolute',
    RelativeToGround: 'relativeToGround',
    RelativeToSeaFloor: 'relativeToSeaFloor',
    ClampToGround: 'clampToGround',
    ClampToSeaFloor: 'clampToSeaFloor'
  }
});

/**
 * A Service for interactions with the Earth activity group.
 */
LiquidGalaxyApp.service('EarthService', function($rootScope, MessageService, MasterService, ActivityGroups, Messages, QueryMessageFields, FlyToMessageValues) {

  /**
   * Generates a query message for a view looking down at a point on the ground.
   */
  function generateGroundView(latitude, longitude, altitude) {
    var query = {};

    query[QueryMessageFields.FlyTo.Type] = FlyToMessageValues.Type.Camera;

    var location = {};
    location[QueryMessageFields.FlyTo.Latitude] = latitude;
    location[QueryMessageFields.FlyTo.Longitude] = longitude;
    location[QueryMessageFields.FlyTo.Altitude] = altitude;
    query[QueryMessageFields.FlyTo.Location] = location;

    var orientation = {};
    orientation[QueryMessageFields.FlyTo.Heading] = 0;
    orientation[QueryMessageFields.FlyTo.Tilt] = 0;
    orientation[QueryMessageFields.FlyTo.Roll] = 0;
    query[QueryMessageFields.FlyTo.Orientation] = orientation;

    query[QueryMessageFields.FlyTo.AltitudeMode] = FlyToMessageValues.AltitudeMode.RelativeToGround;

    return query;
  }

  /**
   * Handle view changes from Earth by broadcasting into the root scope.
   */
  MessageService.on(Messages.Earth.ViewChanged, function(viewSyncState) {
    console.debug(Messages.Earth.ViewChanged);
    $rootScope.$broadcast(Messages.Earth.ViewChanged, viewSyncState);
  });

  /**
   * Starts up the Earth activity group.
   */
  function startup() {
    console.debug(Messages.Earth.Startup);
    MasterService.startupLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Shuts down the Earth activity group.
   */
  function shutdown() {
    console.debug(Messages.Earth.Shutdown);
    MasterService.shutdownLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Activates the Earth activity group.
   */
  function activate() {
    console.debug(Messages.Earth.Activate);
    MasterService.activateLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Deactivates the Earth activity group.
   */
  function deactivate() {
    console.debug(Messages.Earth.Deactivate);
    MasterService.deactivateLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Sends a view change to Earth.
   */
  function setView(abstractView) {
    console.debug(Messages.Earth.SetView);
    MessageService.emit(Messages.Earth.SetView, abstractView);
  }

  /**
   * Changes planets.
   */
  function setPlanet(planetName) {
    console.debug(Messages.Earth.SetPlanet);

    var message = {};
    message[QueryMessageFields.Planet.Destination] = planetName;

    MessageService.emit(Messages.Earth.SetPlanet, message);
  }

  /**
   * Sends a search query to Earth.
   */
  function search(query) {
    console.debug(Messages.Earth.Search);

    var message = {};
    message[QueryMessageFields.Search.Query] = query;

    MessageService.emit(Messages.Earth.Search, message);
  }

  /**
   * Public interface.
   */
  return {
    generateGroundView: generateGroundView,
    startup: startup,
    shutdown: shutdown,
    activate: activate,
    deactivate: deactivate,
    setView: setView,
    setPlanet: setPlanet,
    search: search
  };
});
