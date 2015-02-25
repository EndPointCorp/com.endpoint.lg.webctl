/*
 * Copyright (C) 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * Controller for the search box.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
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
  $scope.$on(UIEvents.Page.SelectPage, function() {
    $scope.clear();
  });
}
