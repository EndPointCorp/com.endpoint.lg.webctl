/**
 * A Services for interactions with the Street View activity group.
 */
LiquidGalaxyApp.service('StreetViewService', function($rootScope, MessageService, MasterService, ActivityGroups, Messages) {

  /**
   * Handle pano changes from Street View by broadcasting into the root scope.
   */
  MessageService.on(Messages.StreetView.PanoChanged, function(pano) {
    console.debug(Messages.StreetView.PanoChanged);
    $rootScope.$broadcast(Messages.StreetView.PanoChanged, pano);
  });

  /**
   * Handle pov changes from Street View by broadcasting into the root scope.
   */
  MessageService.on(Messages.StreetView.PovChanged, function(pov) {
    console.debug(Messages.StreetView.PovChanged);
    $rootScope.$broadcast(Messages.StreetView.PovChanged, pov);
  });

  /**
   * Starts up the Street View activity group.
   */
  function startup() {
    console.debug(Messages.StreetView.Startup);
    MasterService.startupLiveActivityGroupByName(ActivityGroups.StreetView);
  }

  /**
   * Shuts down the Street View activity group.
   */
  function shutdown() {
    console.debug(Messages.StreetView.Shutdown);
    MasterService.shutdownLiveActivityGroupByName(ActivityGroups.StreetView);
  }

  /**
   * Activates the Street View activity group.
   */
  function activate() {
    console.debug(Messages.StreetView.Activate);
    MasterService.activateLiveActivityGroupByName(ActivityGroups.StreetView);
  }

  /**
   * Deactivates the Street View activity group.
   */
  function deactivate() {
    console.debug(Messages.StreetView.Deactivate);
    MasterService.deactivateLiveActivityGroupByName(ActivityGroups.StreetView);
  }

  /**
   * Sends a pano change to Street View.
   */
  function setPano(panoid) {
    console.debug(Messages.StreetView.SetPano);
    MessageService.emit(Messages.StreetView.SetPano, { panoid: panoid });
  }

  /**
   * Sends a pov change to Street View.
   */
  function setPov(pov) {
    console.debug(Messages.StreetView.SetPov);
    MessageService.emit(Messages.StreetView.SetPov, pov);
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
