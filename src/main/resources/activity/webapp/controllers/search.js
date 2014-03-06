/**
 * Controller for the search box.
 */
function SearchController($scope, $rootScope, $timeout, Planets, UIEvents) {
  $scope.searchQuery = "";
  $scope.searchElement = angular.element('#searchInput');

  /**
   * Clears the search box.
   */
  $scope.clear = function() {
    $scope.searchQuery = "";
    $scope.deactivate();
  }

  /**
   * Processes the search query, if any.
   */
  $scope.doSearch = function(query) {
    if (query == "") {
      return;
    }

    $rootScope.$broadcast(UIEvents.Search.Query, query);
    $scope.deactivate();
  }

  /**
   * Activates search mode.
   */
  $scope.activate = function() {
    $rootScope.$broadcast(UIEvents.Search.Activated);
  }

  /**
   * Deactivates search mode.
   */
  $scope.deactivate = function() {
    $rootScope.$broadcast(UIEvents.Search.Deactivated);
  }

  /**
   * Returns true if the search box should be visible.
   */
  $scope.checkVisibility = function() {
    return $scope.planet == Planets.Earth;
  }

  /**
   * Handles cursor focus entry into the search box.
   */
  $scope.focusEvent = function() {
    $scope.activate();
  }

  /**
   * Moves the cursor to a position in the search entry.
   */
  $scope.moveCursor = function(pos) {
    var moveTo = pos;
    $timeout(function() {
      $scope.searchElement.focus();
      $scope.searchElement[0].setSelectionRange(moveTo, moveTo);
    }, 0);
  }

  /**
   * Handler for on-screen keyboard keystrokes.
   */
  $scope.$on(UIEvents.Keyboard.KeyPress, function($event, key) {
    var cursorPos = $scope.searchElement[0].selectionStart;
    var text = $scope.searchQuery;
    var textLen = text.length;
    var change, newPos;

    if (key == 'backspace') {
      if (textLen == 0) return;

      change = text.substr(0, cursorPos-1) + text.substr(cursorPos, textLen);
      newPos = cursorPos - 1;
    } else {

      change = text.substr(0, cursorPos) + key + text.substr(cursorPos, textLen);
      newPos = cursorPos + 1;
    }

    $scope.searchQuery = change;
    $scope.moveCursor(newPos);
  });

  /**
   * Handler for POI selection, which deactivates search mode.
   */
  $scope.$on(UIEvents.Poi.SelectPoi, function() {
    $scope.deactivate();
  });

  /**
   * Clears the search entry upon planet change.
   */
  $scope.$on(UIEvents.Planet.SelectPlanet, function() {
    $scope.clear();
  });
}
