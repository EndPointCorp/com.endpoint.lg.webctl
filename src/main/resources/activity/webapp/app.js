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
  PanoViewer: 'panoviewer',
  Earth: 'earth'
})

/**
 * ActivityGroups are the names of activity groups for Apps.
 */
.value('ActivityGroups', {
  PanoViewer: IS.Configuration['lg.webctl.group.panoviewer'],
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
    SelectPano: 'Map.selectPano',
        // These are just for the attract loop, to know the user did something
    Click: 'Map.click',
    DragStart: 'Map.dragStart',
    DragEnd: 'Map.dragEnd'
  },
  MapMode: {
    SelectMode: 'MapMode.selectMode'
  },
  Page: {
    SelectPage: 'Page.selectPage'
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
        'valid' : false,
        'pages' : []
    };

    poiService.lookupPage = function (p) {
        for (var i = 0; i < poiService.pages.length; i++) {
            if (poiService.pages[i].name === p) {
                return poiService.pages[i];
            }
        }
        return {};
    }

    poiService.refresh = function () {
        poiService.promise = $http.get(poiService.url)
            .success(function (data, status, headers, config) {
                console.log("Success getting POI json from " + poiService.url);

                // Gotta get a list of pages and what planet they refer to (used to figure out the CSS class for the icon)
                var pages = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        pages.push({ "name" : key, "planet" : data[key].planet, "planet_hl" : data[key].planet + '_hl' });
                    }
                }

                poiService.pages = pages;
                poiService.content = data;
                poiService.valid = true;
            })
            .error(function (data, status, headers, config) {
                console.log("Failed to get POI json from " + poiService.url);
                poiService.data = { };
                poiService.pages = [];
            });
    };

    poiService.refresh();
    return poiService;
});
