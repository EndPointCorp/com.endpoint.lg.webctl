/**
 * The main Controller keeps track of most of the interface state.
 *
 * All child Controllers can access its scoped attributes.
 *
 * This Controller also interacts with the Earth and StreetView services.
 */
function MainController($scope, $rootScope, $timeout, EarthService, StreetViewService, Apps, Modes, Planets, Messages, UIEvents) {
  $scope.searching = false;
  $scope.zoom = null;
  $scope.planet = Planets.Earth;
  $scope.mode = Modes.Earth;
  $scope.activeApp = Apps.Earth;
  $scope.panoData = null;

  $scope.svSvc = new google.maps.StreetViewService();

  /**
   * Initialize the activities.
   */
  EarthService.startup();
  StreetViewService.startup();

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
   * Generates an Earth view looking down at the given LatLng.
   */
  $scope.generateEarthQuery = function(latLng) {
    return {
      type: "camera",
      location: {
        latitude: latLng.lat(),
        longitude: latLng.lng(),
        altitude: 500
      },
      orientation: {
        heading: 0,
        tilt: 0,
        roll: 0
      },
      altitudeMode: "relativeToGround"
    };
  }

  /**
   * Loads the given Street View panorama.
   *
   * Ensures that Street View is the active App.
   * @param panoData
   *          a google.maps.StreetViewPanoramaData object
   */
  $scope.loadPano = function(panoData, heading) {
    $scope.panoData = panoData;

    // TODO: abstract number validation
    if (!isNaN(parseFloat(heading)) && isFinite(heading)) {
      StreetViewService.setPov({heading: heading, pitch: 0});
    }
    StreetViewService.setPano(panoData.location.pano);
    $scope.activeApp = Apps.StreetView;

    var earthQuery = $scope.generateEarthQuery(panoData.location.latLng);
    EarthService.setView(earthQuery);
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
  $scope.$on(UIEvents.Mode.SelectMode, function($event, mode) {
    console.log('switching UI mode to', mode);

    $scope.mode = mode;

    if (mode == Modes.Earth) {
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
  $scope.$on(UIEvents.Planet.SelectPlanet, function($event, planet) {
    $scope.planet = planet;
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
  $scope.$on(Messages.StreetView.PanoChanged, function($event, panoMessage) {
    $scope.svSvc.getPanoramaById(
      panoMessage.panoid,
      function(panoData, stat) {
        if (stat == google.maps.StreetViewStatus.OK) {
          $scope.panoData = panoData;
          $scope.activeApp = Apps.StreetView;
          var earthQuery = $scope.generateEarthQuery(panoData.location.latLng);
          EarthService.setView(earthQuery);
        } else {
          console.error('pano not found:', panoMessage.panoid);
        }
      }
    );
  });
}
