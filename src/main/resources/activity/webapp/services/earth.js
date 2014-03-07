/**
 * A Service for interactions with the Earth activity group.
 */
LiquidGalaxyApp.service('EarthService', function($rootScope, SocketService,MasterService, MasterAPI, Messages, QueryMessageFields) {

  /**
   * Handle view changes from Earth by broadcasting into the root scope.
   */
  SocketService.on(Messages.Earth.ViewChanged, function(viewSyncState) {
    console.debug(Messages.Earth.ViewChanged);
    $rootScope.$broadcast(Messages.Earth.ViewChanged, viewSyncState);
  });

  /**
   * Activates the Earth activity group.
   */
  function activate() {
    console.debug(Messages.Earth.Activate);
    //SocketService.emit(Messages.Earth.Activate);
    MasterService.activateLiveActivityGroupByName(MasterAPI.Groups.Earth);
  }

  /**
   * Deactivates the Earth activity group.
   */
  function deactivate() {
    console.debug(Messages.Earth.Deactivate);
    //SocketService.emit(Messages.Earth.Deactivate);
    MasterService.deactivateLiveActivityGroupByName(MasterAPI.Groups.Earth);
  }

  /**
   * Sends a view change to Earth.
   */
  function setView(abstractView) {
    console.debug(Messages.Earth.SetView);
    SocketService.emit(Messages.Earth.SetView, abstractView);
  }

  /**
   * Changes planets.
   */
  function setPlanet(planetName) {
    console.debug(Messages.Earth.SetPlanet);

    var message = {};
    message[QueryMessageFields.Planet.Destination] = planetName;

    SocketService.emit(Messages.Earth.SetPlanet, message);
  }

  /**
   * Sends a search query to Earth.
   */
  function search(query) {
    console.debug(Messages.Earth.Search);

    var message = {};
    message[QueryMessageFields.Search.Query] = query;

    SocketService.emit(Messages.Earth.Search, message);
  }

  return {
    activate: activate,
    deactivate: deactivate,
    setView: setView,
    setPlanet: setPlanet,
    search: search
  };
});
