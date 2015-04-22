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
 * Controller for the Splash background, shown when non-Earth planets are
 * active.
 *
 * @author Matt Vollrath <matt@endpoint.com>
 *
 * @param {object} $scope - foo
 * @param {object} $rootScope - foo
 * @param {object} Planets - foo
 */
function SplashController($scope, $rootScope, Planets) {
  /**
   * @return {boolean} - true if Splash imagery should be visible
   */
  $scope.checkVisibility = function() {
    return $scope.planet != Planets.Earth;
  };
}
