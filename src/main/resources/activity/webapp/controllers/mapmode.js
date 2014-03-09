/**
 * Controller for the MapMode selector, the Earth/Street View control in the top right corner.
 */
function MapModeController($scope, $rootScope, MapConfig, MapModes, Planets, StreetViewMessages, UIEvents) {

  /**
   * Broadcasts the selected mode.
   */
  $scope.selectMode = function(mode) {
    $rootScope.$broadcast(UIEvents.MapMode.SelectMode, mode);
  }

  /**
   * Handle map zoom changes.
   */
  $scope.$on(UIEvents.Map.ZoomChanged, function($event, zoom) {
    // why do we need to force dirty checking here?
    $scope.$apply();
  });

  /**
   * Returns true if the mode selector should be visible.
   */
  $scope.checkVisibility = function() {
    return $scope.planet == Planets.Earth && !$scope.searching && ($scope.mode == MapModes.StreetView || $scope.zoom >= MapConfig.MinStreetViewZoomLevel);
  }

  /**
   * Handle planet selections from UI.
   */
  $scope.$on(UIEvents.Planet.SelectPlanet, function() {
    $scope.selectMode(MapModes.Earth);
  });

  /**
   * Handle search queries by switching to Earth mode.
   */
  $scope.$on(UIEvents.Search.Query, function() {
    $scope.selectMode(MapModes.Earth);
  });

  /**
   * Handle POI selections by switching to the appropriate mode for that POI.
   */
  $scope.$on(UIEvents.Poi.SelectPoi, function($event, poi) {
    $scope.selectMode(poi.type);
  });

  /**
   * Handle pano changes by switching to Street View mode.
   */
  $scope.$on(StreetViewMessages.PanoChanged, function($event) {
    $scope.selectMode(MapModes.StreetView);
  });
}
