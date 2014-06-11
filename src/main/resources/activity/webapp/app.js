/*
 * Copyright (C) 2014 Google Inc.
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
 * A somewhat monolithic Angular module for this webapp.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
 */
var LiquidGalaxyApp = angular.module('LiquidGalaxyApp', ['ngSanitize', 'IS.MasterModule', 'IS.MessageModule'])

/**
 * Apps are user-facing applications that fill the main displays. 
 */
.value('Apps', {
  StreetView: 'streetview',
  Earth: 'earth'
})

/**
 * ActivityGroups are the names of activity groups for Apps.
 */
.value('ActivityGroups', {
  StreetView: IS.Configuration['lg.webctl.group.streetview'],
  Earth: IS.Configuration['lg.webctl.group.earth']
})

/**
 * MapModes are states of the Earth/Street View control.
 */
.value('MapModes', {
  StreetView: 'streetview',
  Earth: 'earth'
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
  EarthAltitudeMax: 100000000,
  DefaultCenter: new google.maps.LatLng(-34.397, 150.644)
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
  MapMode: {
    SelectMode: 'MapMode.selectMode'
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

/**
 * Points of Interest for each planet.
 */
.value('PoiContent', {
  'earth': [
    { style: "outdoor", title: "Tower of Pisa, Pisa", type: "earth", abstractView: {
      type: "lookat",
      location: {
        altitude: 28.58164049751593,
        latitude: 43.72294597791009,
        longitude: 10.39670539535571
      },
      orientation: {
        heading: -80.41521503853949,
        range: 139.75740405485944,
        tilt: 72.66275673973938
      },
      altitudeMode: "relativeToSeaFloor"
    } },
    { style: "outdoor", title: "Eiffel Tower, Paris", type: "earth", abstractView: {
      type: "lookat",
      location: {
        altitude: 0,
        latitude: 48.86067281595832,
        longitude: 2.292014985093174
      },
      orientation: {
        heading: -30.82811991881539,
        range: 870.2504450963008,
        tilt: 68.12334319265283
      },
      altitudeMode: "relativeToGround"
    } },
    { style: "street", title: "Sunset Boulevard, Los Angeles", type: "streetview", panoid: "o4yrNps7LEEGNTssM-xiDg", heading: 50 },
    { style: "ocean", title: "Heron Island, Great Barrier Reef", type: "streetview", panoid: "CWskcsTEZBNXaD8gG-zATA", heading: -25 },
    { style: "outdoor", title: "Stonehenge, Wiltshire", type: "earth", abstractView: {
      type: "camera",
      location: {
        altitude: 6.235463957643131,
        latitude: 51.17885614970503,
        longitude: -1.825937904608913
      },
      orientation: {
        heading: -87.65004513518046,
        tilt: 82.84456584198047,
        roll: 0
      },
      altitudeMode: "relativeToSeaFloor"
    } },
    { style: "outdoor", title: "Mount Misen, Hiroshima", type: "earth", abstractView: {
      type: "lookat",
      location: {
        altitude: 0,
        latitude: 34.29760881139214,
        longitude: 132.3182374372446
      },
      orientation: {
        heading: 173.5020669569355,
        range: 69.31842303519369,
        tilt: 82.5619204869066
      },
      altitudeMode: "relativeToSeaFloor"
    } },
    { style: "indoor", title: "Opera House, Sydney", type: "streetview", panoid: "yr58FW-eQtEAAAQW4fRy2g", heading: 180 },
    { style: "outdoor", title: "The Grand Canyon, Arizona", type: "earth", abstractView: {
      type: "lookat",
      location: {
        altitude: 0,
        latitude: 36.03873353926406,
        longitude: -111.8889022015411
      },
      orientation: {
        heading: -85.87896607649738,
        range: 5355.631620407577,
        tilt: 67.92562079561495
      },
      altitudeMode: "relativeToGround"
    } },
    { style: "indoor", title: "State Dining Room,<br />The White House", type: "streetview", panoid: "I5NDPRik49udZwxm4LYdCQ", heading: 90 },
    { style: "ocean", title: "Playful Sea Lions, Galapagos", type: "streetview", panoid: "0yfJCnICQIUAAAQIt--IJw", heading: 54 }
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
