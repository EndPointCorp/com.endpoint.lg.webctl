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
function MainController($scope, $rootScope, $timeout, EarthService, StreetViewService, Apps, MapModes, Planets, EarthMessages, StreetViewMessages, UIEvents, PoiService, AttractLoopService) {
  $scope.searching = false;
  $scope.zoom = null;
  $scope.planet = Planets.Earth;
  $scope.page = Planets.Earth;
  $scope.mapMode = MapModes.Earth;
  $scope.activeApp = Apps.Earth;
  $scope.panoData = null;

  $scope.svSvc = new google.maps.StreetViewService();

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
    if (!isNaN(parseFloat(heading)) && isFinite(heading)) {
      StreetViewService.setPov({heading: heading, pitch: 0});
    }
    StreetViewService.setPano(panoData.location.pano);
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

  /**
   * Loads the given Street View Point of Interest.
   *
   * Ensures that Street View is the active App.
   */
  $scope.loadStreetViewPoi = function(poi) {
    var thatPoi = poi;

    $scope.svSvc.getPanoramaById(
      poi.panoid,
      function(panoData, stat) {
        if (stat == google.maps.StreetViewStatus.OK) {
          $scope.loadPano(panoData, thatPoi.heading);
        } else {
          console.error('pano not found:', poi.panoid);
        }
      }
    );
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
