/**
 * A Service for interactions with the Earth activity group.
 */
LiquidGalaxyApp.service('EarthService', function($rootScope, SocketService, Messages) {

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
    SocketService.emit(Messages.Earth.Activate);
  }

  /**
   * Deactivates the Earth activity group.
   */
  function deactivate() {
    console.debug(Messages.Earth.Deactivate);
    SocketService.emit(Messages.Earth.Deactivate);
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
    SocketService.emit(Messages.Earth.SetPlanet, { planet: planetName });
  }

  /**
   * Sends a search query to Earth.
   */
  function search(query) {
    console.debug(Messages.Earth.Search);
    SocketService.emit(Messages.Earth.Search, { query: query });
  }

  return {
    activate: activate,
    deactivate: deactivate,
    setView: setView,
    setPlanet: setPlanet,
    search: search
  };
});
