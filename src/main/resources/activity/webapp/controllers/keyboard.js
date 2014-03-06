/**
 * Controller for the keyboard.
 */
function KeyboardController($scope, $rootScope, UIEvents) {
  /**
   * Handles a keystroke by broadcasting it.
   */
  $scope.keyPress = function(key) {
    $rootScope.$broadcast(UIEvents.Keyboard.KeyPress, key);
  }
}
