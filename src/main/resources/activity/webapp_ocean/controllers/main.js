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
 * The main Controller keeps track of most of the interface state.
 *
 * All child Controllers can access its scoped attributes.
 *
 * This Controller also interacts with the Earth and StreetView services.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
 */
function MainController($scope, $rootScope, $timeout, EarthService, StreetViewService, Apps, MapModes, Planets, EarthMessages, StreetViewMessages, UIEvents, PoiService, AttractLoopService, MessageService) {
  $scope.searching = false;
  $scope.zoom = null;
  $scope.planet = Planets.Earth;
  $scope.page = Planets.Earth;
  $scope.mapMode = MapModes.Earth;
  $scope.activeApp = Apps.Earth;
  $scope.panoData = null;
  $scope.poi_diving = true;

  $scope.svSvc = new google.maps.StreetViewService();

  /**
   * Let the app know when spacenav movement happens
   */
  MessageService.on('spacenav', function(viewSyncState) {
    $rootScope.$broadcast('spacenav', '');
  });

  /**
   * Initialize the activities.
   */
  EarthService.startup();
  StreetViewService.startup();

  var selectFirstPoiPage = function() {
    if (PoiService.pages.length > 0) {
      $scope.page = PoiService.pages[0].name;
    }
  };
  $scope.$watch(function() { return PoiService.valid; }, selectFirstPoiPage);
  selectFirstPoiPage();

  $scope.notifyClick = function() {
    $rootScope.$broadcast('body-click', {});
  }

  $scope.changePage = function(diving) {
    $scope.poi_diving = diving;
    $rootScope.$broadcast(UIEvents.Poi.Diving, $scope.poi_diving);
    $rootScope.$broadcast(UIEvents.MapMode.SelectMode, 'earth');
  };

  /**
   * Control the active app.
   */
  $scope.$watch('activeApp', function(app) {
    if (app == Apps.Earth) {
      EarthService.activate();
      StreetViewService.deactivate();
    } else if (app == Apps.StreetView) {
      StreetViewService.activate();
      EarthService.deactivate();
    }
  });

  /**
   * Observe planet changes.
   */
  $scope.$watch('planet', function(planet) {
    console.debug('switching to planet', planet);

    EarthService.setPlanet(planet);
    $scope.activeApp = Apps.Earth;
  });

  /**
   * Loads the given Street View panorama, optionally with a heading.
   */
  $scope.loadPano = function(panoData, heading) {
    // TODO: abstract number validation
    StreetViewService.setPano(panoData.location.pano);

    // XXX Hack -- this is an attempt to work around https://github.com/EndPointCorp/com.endpoint.lg.streetview.pano/issues/1
    $timeout( function() {
      if (!isNaN(parseFloat(heading)) && isFinite(heading)) {
        StreetViewService.setPov({heading: parseFloat(heading), pitch: 0});
      }
    }, 200);
  }

  /**
   * Loads the given Earth Point of Interest.
   *
   * Ensures that Earth is the active App.
   */
  $scope.loadEarthPoi = function(poi) {
    EarthService.setView(poi.abstractView);
    $scope.activeApp = Apps.Earth;
  }

  var arrivedAtStreetViewPano = function(l, t, found, error, panoData, poi) {
    if (typeof(l) !== 'undefined') {
      l();
    }
    if (typeof(t) !== 'undefined') {
      $timeout.cancel(l);
    }

    // If the attract loop started this transition, and if the attract loop has
    // been stopped before we got to this point, don't finish the transition
    if (poi.attractLoop && ! AttractLoopService.isAttractLoopRunning()) {
        return;
    }

    $scope.loadPano(panoData, poi.heading);
  }

  var transitionToStreetViewPano = function(poi) {
    var panoData;
    var found = false, error = false;
    var deregisterListener, timeout;
    var marginOfError = 0.3; // When Earth gets within this many degrees of its target, we'll switch to street view
                                                        // X * 1 makes 'em numbers, not strings
    var earthQuery = EarthService.generateGroundView(poi.location.latitude * 1, poi.location.longitude * 1, 500);
    EarthService.setView(earthQuery);
 
    $scope.svSvc.getPanoramaById(
      poi.panoid,
      function(data, stat) {
        if (stat == google.maps.StreetViewStatus.OK) {
          panoData = data;
          found = true;
        } else {
          console.error('pano not found:', poi.panoid);
          error = true;
        }
      }
    );

    deregisterListener = $rootScope.$on(EarthMessages.ViewChanged, function(ev, coords) {
      // Check coordinates to see if they're "close enough" to the POI
      if (Math.abs(coords.latitude - (poi.location.latitude * 1)) <= marginOfError &&
          Math.abs(coords.longitude - (poi.location.longitude * 1)) <= marginOfError) {
        console.log("We're close enough!");
        console.log(poi.location);
        console.log(coords);
        arrivedAtStreetViewPano(deregisterListener, timeout, found, error, panoData, poi);
      }
    });

    // In case we never get there, eventually switch to street view anyway
    timeout = $timeout(function() {
      // Switch to street view if we haven't already
      if ($scope.activeApp !== Apps.StreetView) {
        console.log("We haven't switched to street view yet; do it now");
        arrivedAtStreetViewPano(deregisterListener, timeout, found, error, panoData, poi);
      }
    }, 10000);
  }

  /**
   * Loads the given Street View Point of Interest.
   *
   * Ensures that Street View is the active App.
   */
  $scope.loadStreetViewPoi = function(poi) {
    var thatPoi = poi;

    // Redmine 2944 : BUEI wants to fly to new streetview locations by
    // switching to Earth first, flying to the spot, and then opening
    // streetview again.

    if (poi.hasOwnProperty('location') && poi.location.hasOwnProperty('latitude') && poi.location.hasOwnProperty('longitude')) {
      $scope.activeApp = Apps.Earth;

      $timeout( function() { transitionToStreetViewPano(thatPoi) }, 1000);
    }
    else {
      console.log("Can't fly Earth to this poi, because it has no coordinate information");
    }
  }

  /**
   * Routing for POI handlers.
   */
  $scope.poiHandlers = {
    earth: $scope.loadEarthPoi,
    streetview: $scope.loadStreetViewPoi
  };

  /**
   * Routes Point of Interest requests to the appropriate handler.
   */
  $scope.loadPoi = function(poi) {
    if (poi.type in $scope.poiHandlers) {
      $scope.poiHandlers[poi.type](poi);
    } else {
      console.error("no handler for this poi", poi);
    }
  }

  /**
   * Handle UI mode changes.  Switch to Earth if it is selected.
   */
  $scope.$on(UIEvents.MapMode.SelectMode, function($event, mapMode) {
    console.log('switching UI mode to', mapMode);

    $scope.mapMode = mapMode;

    if (mapMode == MapModes.Earth) {
      $scope.activeApp = Apps.Earth;
    }
  });

  /**
   * Handle pano selections from the map.
   */
  $scope.$on(UIEvents.Map.SelectPano, function($event, panoData) {
    console.log('loading pano', panoData);

    $scope.loadPano(panoData);
  });

  /**
   * Handle zoom changes from the map.
   */
  $scope.$on(UIEvents.Map.ZoomChanged, function($event, zoom) {
    $scope.zoom = zoom;
  });

  /**
   * Handle POI selections from UI.
   */
  $scope.$on(UIEvents.Poi.SelectPoi, function($event, poi) {
    console.log('loading poi', poi);

    $scope.loadPoi(poi);
  });

  /**
   * Handle search queries from UI.
   */
  $scope.$on(UIEvents.Search.Query, function($event, query) {
    console.log('handling search for', query);

    EarthService.search(query);
    $scope.activeApp = Apps.Earth;
  });

  /**
   * Handle planet changes from UI.
   */
  $scope.$on(UIEvents.Page.SelectPage, function($event, page) {
    $scope.page = page;
    $scope.planet = PoiService.lookupPage(page).planet;
  });

  /**
   * Handle search state changes from the search box.
   */
  $scope.$on(UIEvents.Search.Activated, function() {
    $scope.searching = true;
  });
  $scope.$on(UIEvents.Search.Deactivated, function() {
    $scope.searching = false;
  });

  /**
   * Handle pano changes from the Street View service.
   *
   * Ensure that Street View is the active App.
   */
  $scope.$on(StreetViewMessages.PanoChanged, function($event, panoMessage) {
    $scope.svSvc.getPanoramaById(
      panoMessage.panoid,
      function(panoData, stat) {
        if (stat == google.maps.StreetViewStatus.OK) {
          $scope.panoData = panoData;
          $scope.activeApp = Apps.StreetView;

          var latLng = panoData.location.latLng;
          var earthQuery = EarthService.generateGroundView(latLng.lat(), latLng.lng(), 500);
          EarthService.setView(earthQuery);
        } else {
          console.error('pano not found:', panoMessage.panoid);
        }
      }
    );
  });
}
