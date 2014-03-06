/**
 * Controller for the Splash background, shown when non-Earth planets are active.

 */
function SplashController($scope, $rootScope, Planets) {
  /**
   * Returns true if the Splash imagery should be visible.
   */
  $scope.checkVisibility = function() {
    return $scope.planet != Planets.Earth;
  }
}
