/**
 * Controller for the Mode selector, the Earth/Street View control in the top right corner.
 *
 * TODO: rename this entire system
 */
function ModeController($scope, $rootScope, MapConfig, Modes, Planets, Messages, UIEvents) {

  /**
   * Broadcasts the selected mode.
   */
  $scope.selectMode = function(mode) {
    $rootScope.$broadcast(UIEvents.Mode.SelectMode, mode);
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
    return $scope.planet == Planets.Earth && !$scope.searching && ($scope.mode == Modes.StreetView || $scope.zoom >= MapConfig.MinStreetViewZoomLevel);
  }

  /**
   * Handle planet selections from UI.
   */
  $scope.$on(UIEvents.Planet.SelectPlanet, function() {
    $scope.selectMode(Modes.Earth);
  });

  /**
   * Handle search queries by switching to Earth mode.
   */
  $scope.$on(UIEvents.Search.Query, function() {
    $scope.selectMode(Modes.Earth);
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
  $scope.$on(Messages.StreetView.PanoChanged, function($event) {
    $scope.selectMode(Modes.StreetView);
  });
}
