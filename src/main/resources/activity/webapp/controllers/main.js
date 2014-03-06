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

  $scope.svSvc = new google.maps.StreetViewService();

  /**
   * Switches the active App to Earth.
   */
  $scope.switchToEarth = function() {
    if ($scope.activeApp != Apps.Earth) {
      $scope.activeApp = Apps.Earth;

      EarthService.activate();
      StreetViewService.deactivate();
    }
  }

  /**
   * Switches the active App to Street View.
   */
  $scope.switchToStreetView = function() {
    if ($scope.activeApp != Apps.StreetView) {
      $scope.activeApp = Apps.StreetView;

      StreetViewService.activate();
      EarthService.deactivate();
    }
  }

  /**
   * Loads the given planet, if not already on that planet.
   *
   * Ensures that Earth is the active App.
   */
  $scope.changePlanet = function(planet) {
    if (planet != $scope.planet) {
      $scope.planet = planet;
      EarthService.setPlanet(planet);
      $scope.switchToEarth();
    }
  }

  /**
   * Loads the given Street View panorama.
   *
   * Ensures that Street View is the active App.
   */
  $scope.loadPano = function(panoid, heading) {
    // TODO: abstract number validation
    if (!isNaN(parseFloat(heading)) && isFinite(heading)) {
      StreetViewService.setPov({heading: heading, pitch: 0});
    }
    StreetViewService.setPano(panoid);
    $scope.switchToStreetView();
  }

  /**
   * Loads the given Earth Point of Interest.
   *
   * Ensures that Earth is the active App.
   */
  $scope.loadEarthPoi = function(poi) {
    EarthService.setView(poi.abstractView);
    $scope.switchToEarth();
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
      function(data, stat) {
        if (stat == google.maps.StreetViewStatus.OK) {
          $scope.loadPano(data.location.pano, thatPoi.heading);
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
      $scope.switchToEarth();
    }
  });

  /**
   * Handle pano selections from the map.
   */
  $scope.$on(UIEvents.Map.SelectPano, function($event, panoData) {
    console.log('loading pano', panoData);

    $scope.loadPano(panoData.location.pano);
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
    $scope.switchToEarth();
  });

  /**
   * Handle planet changes from UI.
   */
  $scope.$on(UIEvents.Planet.SelectPlanet, function($event, planet) {
    console.log('switching to planet', planet);

    $scope.changePlanet(planet);
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
  $scope.$on(Messages.StreetView.PanoChanged, function() {
    $scope.switchToStreetView();
  });
}
