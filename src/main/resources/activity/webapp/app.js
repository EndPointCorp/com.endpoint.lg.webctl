/**
 * A somewhat monolithic Angular module for this webapp.
 */
var LiquidGalaxyApp = angular.module('LiquidGalaxyApp', ['ngSanitize']);

LiquidGalaxyApp

  /**
   * Apps are user-facing applications that fill the main displays. 
   */
  .value('Apps', {
    StreetView: 'streetview',
    Earth: 'earth'
  })

  /**
   * Modes are states of map operation, for toggling Street View coverage layer and exiting Street View.
   */
  .value('Modes', {
    StreetView: 'streetview',
    Earth: 'earth'
  })

  /**
   * Planets are solar bodies.
   */
  .value('Planets', {
    Earth: 'earth',
    Moon: 'moon',
    Mars: 'mars'
  })

  /**
   * Configuration for the socket backend.
   */
  .value('SocketConfig', {
    Host: '127.0.0.1',
    Port: 8999,
    Channel: '/websocket'
  })

  /**
   * Extra configuration for map behaviors.
   */
  .value('MapConfig', {
    MapZoomMax: 18,
    MapZoomMin: 1,
    MinStreetViewZoomLevel: 14,
    MapClickSearchRadius: 50,
    MapZoomFudge: -1,
    EarthAltitudeMin: 100,
    EarthAltitudeMax: 100000000
  })

  /**
   * Messages types for websocket communication.
   */
  .value('Messages', {
    Earth: {
      Activate: 'Earth.activate',
      Deactivate: 'Earth.deactivate',
      SetView: 'Earth.setView',
      SetPlanet: 'Earth.setPlanet',
      Search: 'Earth.search',
      ViewChanged: 'Earth.viewChanged'
    },
    StreetView: {
      Activate: 'StreetView.activate',
      Deactivate: 'StreetView.deactivate',
      SetPano: 'StreetView.setPano',
      SetPov: 'StreetView.setPov',
      PanoChanged: 'StreetView.panoChanged',
      PovChanged: 'StreetView.povChanged'
    }
  })

  /**
   * Event types for controller communication.
   */
  .value('UIEvents', {
    Keyboard: {
      KeyPress: 'Keyboard.keyPress'
    },
    Map: {
      ZoomChanged: 'Map.zoomChanged',
      SelectPano: 'Map.selectPano'
    },
    Mode: {
      SelectMode: 'Mode.selectMode'
    },
    Planet: {
      SelectPlanet: 'Planet.selectPlanet'
    },
    Poi: {
      SelectPoi: 'Poi.selectPoi'
    },
    Search: {
      Query: 'Search.query',
      Activated: 'Search.activated',
      Deactivated: 'Search.deactivated'
    }
  })

  /**
   * Style selections for the map.
   */
  .value('MapStyles', [
    {
      featureType: "poi",
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    },
    {
      featureType: "administrative",
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    },
    {
      featureType: "administrative.province",
      elementType: "all",
      stylers: [
        { visibility: "on" }
      ]
    },
    {
      featureType: "administrative.country",
      elementType: "all",
      stylers: [
        { visibility: "on" }
      ]
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    },
  ])

  .value('QueryMessageFields', {
    Planet: {
      Destination: 'destination'
    },
    Search: {
      Query: 'query'
    }
  })

  .value('FlyToMessageFields', {
    Type: 'type',
    Location: 'location',
    Altitude: 'altitude',
    Orientation: 'orientation'
  })

  /**
   * Points of Interest for each planet.
   */
  .value('PoiContent', {
    'earth': [
      { style: "outdoor", title: "Trevi Fountain, Rome", type: "earth" },
      { style: "outdoor", title: "Eiffel Tower, Paris", type: "earth" },
      { style: "street", title: "Sunset Boulevard, Los Angeles", type: "streetview", panoid: "o4yrNps7LEEGNTssM-xiDg", heading: 50 },
      { style: "ocean", title: "Heron Island, Great Barrier Reef", type: "streetview", panoid: "CWskcsTEZBNXaD8gG-zATA", heading: -25 },
      { style: "outdoor", title: "Guylian Chocolate Store, Sydney", type: "earth" },
      { style: "outdoor", title: "Saint John Cathedral, New York", type: "earth" },
      { style: "indoor", title: "Opera House, Sydney", type: "streetview", panoid: "j-ItqSf62H4AAAAGOzBYXA", heading: 0 },
      { style: "outdoor", title: "The Grand Canyon", type: "earth" },
      { style: "indoor", title: "State Dining Room,<br />The White House", type: "streetview", panoid: "I5NDPRik49udZwxm4LYdCQ", heading: 90 },
      { style: "outdoor", title: "GBus Locations<br />(updated @ 10 mins)", type: "earth" }
    ],
    'moon': [
      { style: "outdoor", title: "Apollo 11", type: "earth" },
      { style: "outdoor", title: "Mare Ingenii", type: "earth" },
      { style: "outdoor", title: "Lacus Excellentiae", type: "earth" },
      { style: "outdoor", title: "Sinus Concordiae", type: "earth" },
      { style: "outdoor", title: "Mons Huygens", type: "earth" },
      { style: "outdoor", title: "Montes Riphaeus", type: "earth" },
      { style: "outdoor", title: "Rima Cleopatra", type: "earth" }
    ],
    'mars': [
      { style: "outdoor", title: "Curiosity Landing Site", type: "earth" },
      { style: "outdoor", title: "Opportunity Landing Site", type: "earth" },
      { style: "outdoor", title: "Olympus Mons", type: "earth" },
      { style: "outdoor", title: "Amazonis Planitia", type: "earth" },
      { style: "outdoor", title: "Solis Planum", type: "earth" },
      { style: "outdoor", title: "Chasma Boreale", type: "earth" },
      { style: "outdoor", title: "Valles Marineris", type: "earth" }
    ]
  });
