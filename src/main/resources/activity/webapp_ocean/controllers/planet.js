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
 * Controller for the Planet selector.
 *
 * @author Matt Vollrath <matt@endpoint.com>
 */
function PlanetController($scope, $rootScope, UIEvents, PoiService) {

  // When the PoiService refreshes, we need to know about it
  var setupPoiPages = function () { $scope.pages = PoiService.pages; };
  $scope.$watch(
    function() { return PoiService.pages; },
    setupPoiPages
  );
  setupPoiPages();

  /**
   * Broadcast planet selections.
   */
  $scope.selectPage = function(page) {
    $rootScope.$broadcast(UIEvents.Page.SelectPage, page);
  }

  $scope.page_image = function(p) {
    return 'images/' + p + (p == $scope.page ? '-bright.png' : '-dark.png');
  }

  $rootScope.$on(UIEvents.Attract.GoToPoi, function($event, data) {
    $scope.poi_diving = true;
  });

  $rootScope.$on(UIEvents.Poi.Diving, function(ev, data) {
    $scope.poi_diving = data;
  });

}
