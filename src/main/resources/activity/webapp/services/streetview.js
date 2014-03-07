/**
 * A Services for interactions with the Street View activity group.
 */
LiquidGalaxyApp.service('StreetViewService', function($rootScope, SocketService, MasterService, MasterAPI, Messages) {

  /**
   * Handle pano changes from Street View by broadcasting into the root scope.
   */
  SocketService.on(Messages.StreetView.PanoChanged, function(pano) {
    console.debug(Messages.StreetView.PanoChanged);
    $rootScope.$broadcast(Messages.StreetView.PanoChanged, pano);
  });

  /**
   * Handle pov changes from Street View by broadcasting into the root scope.
   */
  SocketService.on(Messages.StreetView.PovChanged, function(pov) {
    console.debug(Messages.StreetView.PovChanged);
    $rootScope.$broadcast(Messages.StreetView.PovChanged, pov);
  });

  /**
   * Activates the Street View activity group.
   */
  function activate() {
    console.debug(Messages.StreetView.Activate);
    //SocketService.emit(Messages.StreetView.Activate);
    MasterService.activateLiveActivityGroupByName(MasterAPI.Groups.StreetView);
  }

  /**
   * Deactivates the Street View activity group.
   */
  function deactivate() {
    console.debug(Messages.StreetView.Deactivate);
    //SocketService.emit(Messages.StreetView.Deactivate);
    MasterService.deactivateLiveActivityGroupByName(MasterAPI.Groups.StreetView);
  }

  /**
   * Sends a pano change to Street View.
   */
  function setPano(panoid) {
    console.debug(Messages.StreetView.SetPano);
    SocketService.emit(Messages.StreetView.SetPano, { panoid: panoid });
  }

  /**
   * Sends a pov change to Street View.
   */
  function setPov(pov) {
    console.debug(Messages.StreetView.SetPov);
    SocketService.emit(Messages.StreetView.SetPov, pov);
  }

  return {
    activate: activate,
    deactivate: deactivate,
    setPano: setPano,
    setPov: setPov
  };
});
