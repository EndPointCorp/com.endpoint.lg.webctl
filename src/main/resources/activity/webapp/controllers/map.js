/**
 * A Controller for the map.
 */
function MapController($scope, $rootScope, $timeout, MapConfig, MapStyles, Apps, Modes, Planets, Messages, UIEvents) {
  $scope.map = null;
  $scope.svCoverageLayer = new google.maps.StreetViewCoverageLayer();
  $scope.svSvc = new google.maps.StreetViewService();
  $scope.streetView = false;
  $scope.canvas = document.getElementById('map');
  $scope.coverage = false;
  $scope.mapTakeover = false;
  $scope.mapTakeoverTimeout = null;

  /**
   * Instantiate the map.
   */
  $scope.map = new google.maps.Map(
    $scope.canvas,
    {
      zoom: 8,
      disableDefaultUI: true,
      styles: MapStyles,
      center: MapConfig.DefaultCenter
    }
  );

  /**
   * Instantiate the Street View location marker.
   * TODO: make marker visibility logic less terribly scattered
   */
  $scope.svMarker = new google.maps.Marker({
    position: MapConfig.DefaultCenter,
    title: 'Street View',
    icon: 'images/sv_sprite.png',
    clickable: false
  });

  /**
   * Show the Street View location marker when appropriate.
   */
  $scope.$watch('streetView', function(streetView) {
    if (streetView) {
      $scope.svMarker.setMap($scope.map);
    } else {
      $scope.svMarker.setMap(null);
    }
  });

  /**
   * Move the Street View location marker when the pano changes.
   */
  $scope.$watch('panoData', function(panoData) {
    if (panoData) {
      $scope.svMarker.setPosition($scope.panoData.location.latLng);
    }
  });

  /**
   * Broadcast zoom changes.
   */
  google.maps.event.addListener($scope.map, 'zoom_changed', function() {
    $rootScope.$broadcast(UIEvents.Map.ZoomChanged, $scope.map.getZoom());
    $scope.checkCoverage();
  });

  /**
   * Handle map clicks.
   */
  google.maps.event.addListener($scope.map, 'click', function(ev) {
    $scope.clickLatLng = ev.latLng;
    if (!$scope.coverage) return;

    $scope.svSvc.getPanoramaByLocation(
      ev.latLng,
      MapConfig.MapClickSearchRadius,
      function(data, stat) {
        if (stat == google.maps.StreetViewStatus.OK) {
          $rootScope.$broadcast(UIEvents.Map.SelectPano, data);
        }
      }
    );
  });

  /**
   * Disable Earth view sync.
   */
  $scope.startTakeover = function() {
    $timeout.cancel($scope.mapTakeoverTimeout);

    if ($scope.activeApp == Apps.Earth) {
      $scope.mapTakeover = true;
    }
  }

  /**
   * Schedule resume of Earth view sync.
   */
  $scope.endTakeoverSchedule = function() {
    $timeout.cancel($scope.mapTakeoverTimeout);

    $scope.mapTakeoverTimeout = $timeout(function() {
      $scope.mapTakeover = false;
    }, 2000);
  }

  /**
   * Suspend Earth view sync on map drags.
   */
  google.maps.event.addListener($scope.map, 'dragstart', function() {
    $scope.startTakeover();
  });

  /**
   * Suspend Earth view sync on map clicks.
   */
  google.maps.event.addListener($scope.map, 'click', function() {
    $scope.startTakeover();
    $scope.endTakeoverSchedule();
  })

  /**
   * Resume Earth view sync when map drags finish.
   */
  google.maps.event.addListener($scope.map, 'dragend', function() {
    $scope.endTakeoverSchedule();
  });

  /**
   * Shows the Street View coverage layer.
   */
  $scope.showCoverage = function() {
    if ($scope.coverage) return;

    $scope.coverage = true;
    $scope.svCoverageLayer.setMap($scope.map);
  }

  /**
   * Hides the Street View coverage layer.
   */
  $scope.hideCoverage = function() {
    if (!$scope.coverage) return;

    $scope.coverage = false;
    $scope.svCoverageLayer.setMap(null);
  }

  /**
   * Updates the Street View coverage layer's visibility.
   */
  $scope.checkCoverage = function() {
    if ($scope.map.getZoom() >= MapConfig.MinStreetViewZoomLevel && $scope.streetView && $scope.checkVisibility()) {
      $scope.showCoverage();
    } else {
      $scope.hideCoverage();
    }
  }

  /**
   * Handle UI mode changes.
   */
  $scope.$on(UIEvents.Mode.SelectMode, function($event, mode) {
    $scope.streetView = (mode == Modes.StreetView);
    $scope.checkCoverage();
  });

  /**
   * Returns true if the map canvas should be visible.
   *
   * This method may also need to manipulate the map to prevent glitches.
   */
  $scope.checkVisibility = function() {
    var visibility = ($scope.planet == Planets.Earth && !$scope.searching);
    /*
    // this might prevent map canvas glitches
    if (visibility) {
      google.maps.event.trigger($scope.map, 'resize');
    }
    */
    return visibility;
  }

  /**
   * Handle Earth view changes.
   */
  $scope.$on(Messages.Earth.ViewChanged, function($event, viewsyncData) {
    if ($scope.activeApp != Apps.Earth || $scope.mapTakeover) return;

    var altitude = viewsyncData.altitude;
    altitude = Math.log(Math.max(altitude - MapConfig.EarthAltitudeMin, MapConfig.EarthAltitudeMin));

    var EarthAltitudeMinLog = Math.log(MapConfig.EarthAltitudeMin);
    var EarthAltitudeMaxLog = Math.log(MapConfig.EarthAltitudeMax);

    var zoom = (EarthAltitudeMaxLog - altitude) / ((EarthAltitudeMaxLog - EarthAltitudeMinLog) / (MapConfig.MapZoomMax - MapConfig.MapZoomMin)) + MapConfig.MapZoomMin;
    zoom -= zoom % 1;
    zoom = Math.min(Math.max(zoom + MapConfig.MapZoomFudge, MapConfig.MapZoomMin), MapConfig.MapZoomMax);
    $scope.map.setZoom(zoom);

    var latLng = new google.maps.LatLng(viewsyncData.latitude, viewsyncData.longitude);
    $scope.map.panTo(latLng);
  });

  /**
   * Handle Street View pano changes.
   */
  $scope.$on(Messages.StreetView.PanoChanged, function($event, pano) {
    $scope.svSvc.getPanoramaById(pano.panoid, function(data, stat) {
      if (stat == google.maps.StreetViewStatus.OK) {
        $scope.map.panTo(data.location.latLng);
        $scope.map.setZoom(Math.max(MapConfig.MinStreetViewZoomLevel, $scope.map.getZoom()));
      }
    })
  });
}
