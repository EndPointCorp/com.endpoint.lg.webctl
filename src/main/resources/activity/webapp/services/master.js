/**
 * A module for interacting with the IS master.
 * 
 * Depends on the IS.Configuration object served by WebConfigHandler.
 */
angular.module('IS.MasterModule', [])

/**
 * Configuration and constants for the IS master service.
 */
.value('MasterHTTP', {
  Uri: IS.Configuration['lg.master.api.uri'],
  ObjectTypes: {
    LiveActivity: 'liveactivity',
    LiveActivityGroup: 'liveactivitygroup'
  },
  Fields: {
    Result: 'result',
    Data: 'data',
    Message: 'message',
    Name: 'name'
  },
  Results: {
    Success: 'success'
  },
  Commands: {
    List: 'all',
    Startup: 'startup',
    Shutdown: 'shutdown',
    Activate: 'activate',
    Deactivate: 'deactivate'
  },
  Groups: {
    Earth: IS.Configuration['lg.webctl.group.earth'],
    StreetView: IS.Configuration['lg.webctl.group.streetview']
  }
})

/**
 * A service for sending commands to the IS master.
 */
.factory('MasterService', ['$http', 'MasterHTTP', function($http, MasterHTTP) {
  /** 
   * Makes a cached HTTP request.
   */
  function makeRequest(uri, callback, opts) {
    callback = callback || null;
    opts = opts || {};

    console.debug('Master.makeRequest', uri);

    $http.get(uri, opts)

    .success(function(response, stat) {
      if (response[MasterHTTP.Fields.Result] == MasterHTTP.Results.Success) {
        if (callback) {
          callback(response[MasterHTTP.Fields.Data]);
        }
      } else {
        console.error('Interactive Spaces error from', uri);
        console.error(reponse[MasterHTTP.Fields.Message]);
      }
    })

    .error(function(response, stat) {
      console.error('failed request for', uri);
    });
  }

  /**
   * Get a uri to the master API with the given relative path.
   */
  function uri(path) {
    return MasterHTTP.Uri + '/' + path;
  }

  /**
   * Makes a request for a list of IS objects.
   */
  function getObjects(type, callback) {
    makeRequest(
      uri([type, MasterHTTP.Commands.List+'.json'].join('/')),
      callback,
      { cache: true }
    );
  }

  /**
   * Find an IS object by its name and run the callback if found.
   * 
   * Only the first object with the provided name is processed.
   */
  function getObjectByName(name, type, callback) {
    getObjects(type, function(objects) {
      for (var i in objects) {
        var object = objects[i];

        if (object[MasterHTTP.Fields.Name] == name) {
          callback(object);
          break;
        }
      }
    });
  }

  /**
   * Sends a command to an IS object.
   */
  function sendCommandToObject(object, type, command) {
    makeRequest(
      uri([type, object.id, command+'.json'].join('/'))
    );
  }

  /**
   * Send a command to an IS object by name.
   */
  function sendCommandToObjectByName(name, type, command) {
    getObjectByName(name, type, function(object) {
      sendCommandToObject(object, type, command);
    });
  }

  /**
   * Methods for controlling activities.
   */

  function startupLiveActivityByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivity;
    var command = MasterHTTP.Commands.Startup;

    sendCommandToObjectByName(name, type, command);
  }

  function shutdownLiveActivityByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivity;
    var command = MasterHTTP.Commands.Shutdown;

    sendCommandToObjectByName(name, type, command);
  }

  function activateLiveActivityByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivity;
    var command = MasterHTTP.Commands.Activate;

    sendCommandToObjectByName(name, type, command);
  }

  function deactivateLiveActivityByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivity;
    var command = MasterHTTP.Commands.Deactivate;

    sendCommandToObjectByName(name, type, command);
  }

  function startupLiveActivityGroupByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivityGroup;
    var command = MasterHTTP.Commands.Startup;

    sendCommandToObjectByName(name, type, command);
  }

  function shutdownLiveActivityGroupByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivityGroup;
    var command = MasterHTTP.Commands.Shutdown;

    sendCommandToObjectByName(name, type, command);
  }

  function activateLiveActivityGroupByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivityGroup;
    var command = MasterHTTP.Commands.Activate;

    sendCommandToObjectByName(name, type, command);
  }

  function deactivateLiveActivityGroupByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivityGroup;
    var command = MasterHTTP.Commands.Deactivate;

    sendCommandToObjectByName(name, type, command);
  }

  /**
   * Public interface.
   */
  return {
    startupLiveActivityByName: startupLiveActivityByName,
    shutdownLiveActivityByName: shutdownLiveActivityByName,
    activateLiveActivityByName: activateLiveActivityByName,
    deactivateLiveActivityByName: deactivateLiveActivityByName,

    startupLiveActivityGroupByName: startupLiveActivityGroupByName,
    shutdownLiveActivityGroupByName: shutdownLiveActivityGroupByName,
    activateLiveActivityGroupByName: activateLiveActivityGroupByName,
    deactivateLiveActivityGroupByName: deactivateLiveActivityGroupByName
  };
}]);