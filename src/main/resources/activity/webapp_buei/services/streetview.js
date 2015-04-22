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
 * Message types for websocket communication.
 */
LiquidGalaxyApp.value('StreetViewMessages', {
  Activate: 'StreetView.activate',
  Deactivate: 'StreetView.deactivate',
  SetPano: 'StreetView.setPano',
  SetPov: 'StreetView.setPov',
  PanoChanged: 'StreetView.panoChanged',
  PovChanged: 'StreetView.povChanged'
});

/**
 * A Service for interactions with the Street View activity group.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
 */
LiquidGalaxyApp.service('StreetViewService', function($rootScope, MessageService, MasterService, ActivityGroups, StreetViewMessages) {

  /**
   * Handle pano changes from Street View by broadcasting into the root scope.
   */
  MessageService.on(StreetViewMessages.PanoChanged, function(pano) {
    console.debug(StreetViewMessages.PanoChanged);
    $rootScope.$broadcast(StreetViewMessages.PanoChanged, pano);
  });

  /**
   * Handle pov changes from Street View by broadcasting into the root scope.
   */
  MessageService.on(StreetViewMessages.PovChanged, function(pov) {
    console.debug(StreetViewMessages.PovChanged);
    $rootScope.$broadcast(StreetViewMessages.PovChanged, pov);
  });

  /**
   * Starts up the Street View activity group.
   */
  function startup() {
    console.debug(StreetViewMessages.Startup);
    MasterService.startupLiveActivityGroupByName(ActivityGroups.StreetView);
  }

  /**
   * Shuts down the Street View activity group.
   */
  function shutdown() {
    console.debug(StreetViewMessages.Shutdown);
    MasterService.shutdownLiveActivityGroupByName(ActivityGroups.StreetView);
  }

  /**
   * Activates the Street View activity group.
   */
  function activate() {
    console.debug(StreetViewMessages.Activate);
    MasterService.activateLiveActivityGroupByName(ActivityGroups.StreetView);
  }

  /**
   * Deactivates the Street View activity group.
   */
  function deactivate() {
    console.debug(StreetViewMessages.Deactivate);
    MasterService.deactivateLiveActivityGroupByName(ActivityGroups.StreetView);
  }

  /**
   * Sends a pano change to Street View.
   */
  function setPano(panoid) {
    console.debug(StreetViewMessages.SetPano);
    MessageService.emit(StreetViewMessages.SetPano, { panoid: panoid });
  }

  /**
   * Sends a pov change to Street View.
   */
  function setPov(pov) {
    console.debug(StreetViewMessages.SetPov);
    MessageService.emit(StreetViewMessages.SetPov, pov);
  }

  /**
   * Public interface.
   */
  return {
    startup: startup,
    shutdown: shutdown,
    activate: activate,
    deactivate: deactivate,
    setPano: setPano,
    setPov: setPov
  };
});
