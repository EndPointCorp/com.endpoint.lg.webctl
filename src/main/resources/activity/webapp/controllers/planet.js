/**
 * Controller for the Planet selector.
 */
function PlanetController($scope, $rootScope, UIEvents) {

  /**
   * Broadcast planet selections. 
   */
  $scope.selectPlanet = function(planet) {
    $rootScope.$broadcast(UIEvents.Planet.SelectPlanet, planet);
  }
}
