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
  $scope.$watch(
    function() {
      return $scope.activeApp == Apps.StreetView && $scope.mode == Modes.StreetView;
    },
    function(streetView) {
      if (streetView) {
        $scope.svMarker.setMap($scope.map);
      } else {
        $scope.svMarker.setMap(null);
      }
    }
  );

  /**
   * Move the Street View location marker when the pano changes.
   */
  $scope.$watch('panoData', function(panoData) {
    if (panoData) {
      $scope.svMarker.setPosition($scope.panoData.location.latLng);
    }
  });

  /**
   * Show the Street View coverage layer when appropriate.
   */
  $scope.$watch(
    function() {
      return $scope.mode == Modes.StreetView && $scope.zoom >= MapConfig.MinStreetViewZoomLevel;
    },
    function(showCoverage) {
      if (showCoverage) {
        $scope.coverage = true;
        $scope.svCoverageLayer.setMap($scope.map);
      } else {
        $scope.coverage = false;
        $scope.svCoverageLayer.setMap(null);
      }
    }
  );

  /**
   * Broadcast zoom changes.
   */
  google.maps.event.addListener($scope.map, 'zoom_changed', function() {
    $rootScope.$broadcast(UIEvents.Map.ZoomChanged, $scope.map.getZoom());
    $scope.$digest();
  });

  /**
   * Handle map clicks, load Street View if a pano is found nearby.
   */
  google.maps.event.addListener($scope.map, 'click', function(ev) {
    $scope.clickLatLng = ev.latLng;
    if (!$scope.coverage) return;

    $scope.svSvc.getPanoramaByLocation(
      ev.latLng,
      MapConfig.MapClickSearchRadius,
      function(panoData, stat) {
        if (stat == google.maps.StreetViewStatus.OK) {
          $rootScope.$broadcast(UIEvents.Map.SelectPano, panoData);
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
   * Returns true if the map canvas should be visible.
   */
  $scope.checkVisibility = function() {
    return $scope.planet == Planets.Earth && !$scope.searching;
  }

  /**
   * Handle Earth view changes from the websocket.
   * TODO: refactor altitude to zoom conversion
   * TODO: refactor viewsync to latLng conversion
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
   * Handle Street View pano changes from the websocket.
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
