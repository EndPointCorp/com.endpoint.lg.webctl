/**
 * A Service for interactions with the Earth activity group.
 */
LiquidGalaxyApp.service('EarthService', function($rootScope, MessageService, MasterService, ActivityGroups, Messages, QueryMessageFields) {

  /**
   * Handle view changes from Earth by broadcasting into the root scope.
   */
  MessageService.on(Messages.Earth.ViewChanged, function(viewSyncState) {
    console.debug(Messages.Earth.ViewChanged);
    $rootScope.$broadcast(Messages.Earth.ViewChanged, viewSyncState);
  });

  /**
   * Starts up the Earth activity group.
   */
  function startup() {
    console.debug(Messages.Earth.Startup);
    MasterService.startupLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Shuts down the Earth activity group.
   */
  function shutdown() {
    console.debug(Messages.Earth.Shutdown);
    MasterService.shutdownLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Activates the Earth activity group.
   */
  function activate() {
    console.debug(Messages.Earth.Activate);
    MasterService.activateLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Deactivates the Earth activity group.
   */
  function deactivate() {
    console.debug(Messages.Earth.Deactivate);
    MasterService.deactivateLiveActivityGroupByName(ActivityGroups.Earth);
  }

  /**
   * Sends a view change to Earth.
   */
  function setView(abstractView) {
    console.debug(Messages.Earth.SetView);
    MessageService.emit(Messages.Earth.SetView, abstractView);
  }

  /**
   * Changes planets.
   */
  function setPlanet(planetName) {
    console.debug(Messages.Earth.SetPlanet);

    var message = {};
    message[QueryMessageFields.Planet.Destination] = planetName;

    MessageService.emit(Messages.Earth.SetPlanet, message);
  }

  /**
   * Sends a search query to Earth.
   */
  function search(query) {
    console.debug(Messages.Earth.Search);

    var message = {};
    message[QueryMessageFields.Search.Query] = query;

    MessageService.emit(Messages.Earth.Search, message);
  }

  /**
   * Public interface.
   */
  return {
    startup: startup,
    shutdown: shutdown,
    activate: activate,
    deactivate: deactivate,
    setView: setView,
    setPlanet: setPlanet,
    search: search
  };
});
