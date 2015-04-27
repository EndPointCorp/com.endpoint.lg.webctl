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
 * Controller for the MapMode selector, the Earth/Street View control in the top right corner.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
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
      return $scope.planet == Planets.Earth && !$scope.searching; // && ($scope.mode == MapModes.StreetView || $scope.zoom >= MapConfig.MinStreetViewZoomLevel);
  }

  /**
   * Handle planet selections from UI.
   */
  $scope.$on(UIEvents.Page.SelectPage, function() {
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
