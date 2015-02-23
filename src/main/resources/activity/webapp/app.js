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
.service('PoiService', function ($http) {
    var poiService = {
        'url' : IS.Configuration['poi.json.url'],
        'valid' : false
    };

    poiService.refresh = function () {
        poiService.promise = $http.get(poiService.url)
            .success(function (data, status, headers, config) {
                console.log("Success getting POI json from " + poiService.url);
                poiService.content = data;
                poiService.valid = true;
            })
            .error(function (data, status, headers, config) {
                console.log("Failed to get POI json from " + poiService.url);
                poiService.data = ('PoiService', { 'earth' : [] });
            });
    };

    poiService.refresh();
    return poiService;
});
