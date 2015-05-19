/*
 * Copyright (C) 2014 Google Inc.
 * Copyright (C) 2015 End Point Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

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
 * Planets are solar bodies.
 */
LiquidGalaxyApp.value('Planets', {
  Earth: 'earth',
  Moon: 'moon',
  Mars: 'mars'
});

/**
 * Message types for websocket communication.
 */
LiquidGalaxyApp.value('EarthMessages', {
  Activate: 'Earth.activate',
  Deactivate: 'Earth.deactivate',
  SetView: 'Earth.setView',
  SetPlanet: 'Earth.setPlanet',
  Search: 'Earth.search',
  Startup: 'Earth service starting',
  ViewChanged: 'Earth.viewChanged'
});

/**
 * A Service for interactions with the Earth activity group.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
 */
LiquidGalaxyApp.service('EarthService', function($rootScope, MessageService, MasterService, ActivityGroups, EarthMessages, QueryMessageFields, FlyToMessageValues) {

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
  MessageService.on(EarthMessages.ViewChanged, function(viewSyncState) {
    console.debug(EarthMessages.ViewChanged);
    $rootScope.$broadcast(EarthMessages.ViewChanged, viewSyncState);
  });

  /**
   * Starts up the Earth activity group.
   */
  function startup() {
    console.debug(EarthMessages.Startup);
    MasterService.startupLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Shuts down the Earth activity group.
   */
  function shutdown() {
    console.debug(EarthMessages.Shutdown);
    MasterService.shutdownLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Activates the Earth activity group.
   */
  function activate() {
    console.debug(EarthMessages.Activate);
    MasterService.activateLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Deactivates the Earth activity group.
   */
  function deactivate() {
    console.debug(EarthMessages.Deactivate);
    MasterService.deactivateLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Sends a view change to Earth.
   */
  function setView(abstractView) {
    console.debug(EarthMessages.SetView);
    MessageService.emit(EarthMessages.SetView, abstractView);
  }

  /**
   * Changes planets.
   */
  function setPlanet(planetName) {
    console.debug(EarthMessages.SetPlanet);

    var message = {};
    message[QueryMessageFields.Planet.Destination] = planetName;

    MessageService.emit(EarthMessages.SetPlanet, message);
  }

  /**
   * Sends a search query to Earth.
   */
  function search(query) {
    console.debug(EarthMessages.Search);

    var message = {};
    message[QueryMessageFields.Search.Query] = query;

    MessageService.emit(EarthMessages.Search, message);
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
