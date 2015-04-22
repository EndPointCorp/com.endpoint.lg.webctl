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
 * Controller for the Point of Interest (POI) list.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
 */
function PoiController($scope, $rootScope, $sanitize, PoiService, UIEvents) {
  $scope.selectedIndex = null;

  var setupPoiContent = function() {
      if (typeof(PoiService.content) !== 'undefined' && PoiService.content.hasOwnProperty($scope.page)) {
          $scope.content = PoiService.content[$scope.page].points;
      };

      // force the poi lists to the bottom by inserting dummy items
      for (var category in PoiService.content) {
          while (PoiService.content[category].length < 10) {
              PoiService.content[category].splice(0, 0, {});
          }
      }
  }

  // Either PoiService is fully set up, or it isn't. If it isn't, this $watch
  // will make sure we're properly set up when it does complete. We call
  // setupPoiContent() later, in case PoiService is already configured.
  $scope.$watch(
    function() { return PoiService.content; },
    setupPoiContent
  );
  setupPoiContent();

  /**
   * Broadcasts a POI selection.
   */
  $scope.selectPoi = function($index, poi) {
    $rootScope.$broadcast(UIEvents.Poi.SelectPoi, poi);
    $scope.selectedIndex = $index;
  }

  /**
   * Clears the selection.
   */
  $scope.selectNone = function() {
    $scope.selectedIndex = null;
  }

  /**
   * Handlers for clearing the selection on external UI events.
   */
  $rootScope.$on(UIEvents.MapMode.SelectMode, $scope.selectNone);
  $rootScope.$on(UIEvents.Search.Query, $scope.selectNone);

  /**
   * Handler for page changes, causing new content to be loaded.
   */
  $rootScope.$on(UIEvents.Page.SelectPage, function($event, page) {
    $scope.selectNone();
    $scope.content = PoiService.content[page].points;
  });
}
