/**
 * A Service for interacting with the IS master.
 */
LiquidGalaxyApp.service('MasterService', function($http, MasterAPI) {

  /** 
   * Makes a cached HTTP request.
   */
  function makeRequest(uri, callback, cache) {
    callback = callback || null;
    cache = cache ? true : false;

    console.debug('Master.makeRequest', uri);

    $http.get(uri, { cache: cache })

    .success(function(response, stat) {
      if (response[MasterAPI.Fields.Result] == MasterAPI.Results.Success) {
        if (callback) {
          callback(response[MasterAPI.Fields.Data]);
        }
      } else {
        console.error('Interactive Spaces error from', uri);
        console.error(reponse[MasterAPI.Fields.Message]);
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
    return MasterAPI.Uri + '/' + path;
  }

  /**
   * Sends a command to a live activity.
   */
  function sendCommandToLiveActivity(liveActivity, command) {
    makeRequest(
      uri([MasterAPI.Paths.LiveActivity, liveActivity.id, command+'.json'].join('/'))
    );
  }

  /**
   * Sends a command to a live activity group.
   */
  function sendCommandToLiveActivityGroup(liveActivityGroup, command) {
    makeRequest(
      uri([MasterAPI.Paths.LiveActivityGroup, liveActivityGroup.id, command+'.json'].join('/'))
    );
  }

  /**
   * Makes a request for the live activity list.
   */
  function getLiveActivities(callback) {
    makeRequest(
      uri([MasterAPI.Paths.LiveActivity, MasterAPI.Commands.List+'.json'].join('/')),
      callback,
      true
    );
  }

  /**
   * Makes a request for the live activity group list.
   */
  function getLiveActivityGroups(callback) {
    makeRequest(
      uri([MasterAPI.Paths.LiveActivityGroup, MasterAPI.Commands.List+'.json'].join('/')),
      callback,
      true
    );
  }

  /**
   * Find a live activity by its name and run the callback if found.
   */
  function getLiveActivityByName(name, callback) {
    getLiveActivities(function(liveActivities) {
      for (var liveActivity in liveActivities) {
        if (liveActivities[liveActivity][MasterAPI.Fields.Name] == name) {
          callback(liveActivities[liveActivity]);
          break;
        }
      }
    });
  }

  /**
   * Find a live activity group by namemaster and run the callback if found.
   */
  function getLiveActivityGroupByName(name, callback) {
    getLiveActivityGroups(function(liveActivityGroups) {
      for (var liveActivityGroup in liveActivityGroups) {
        if (liveActivityGroups[liveActivityGroup][MasterAPI.Fields.Name] == name) {
          callback(liveActivityGroups[liveActivityGroup]);
          break;
        }
      }
    });
  }

  /**
   * Methods for controlling activities.
   */

  function startupLiveActivityByName(name) {
    getLiveActivityByName(name, function(liveActivity) {
      sendCommandToLiveActivity(liveActivity, MasterAPI.Commands.Startup);
    });
  }

  function shutdownLiveActivityByName(name) {
    getLiveActivityByName(name, function(liveActivity) {
      sendCommandToLiveActivity(liveActivity, MasterAPI.Commands.Shutdown);
    });
  }

  function activateLiveActivityByName(name) {
    getLiveActivityByName(name, function(liveActivity) {
      sendCommandToLiveActivity(liveActivity, MasterAPI.Commands.Activate);
    });
  }

  function deactivateLiveActivityByName(name) {
    getLiveActivityByName(name, function(liveActivity) {
      sendCommandToLiveActivity(liveActivity, MasterAPI.Commands.Deactivate);
    });
  }

  function startupLiveActivityGroupByName(name) {
    getLiveActivityGroupByName(name, function(liveActivityGroup) {
      sendCommandToLiveActivityGroup(liveActivityGroup, MasterAPI.Commands.Startup);
    });
  }

  function shutdownLiveActivityGroupByName(name) {
    getLiveActivityGroupByName(name, function(liveActivityGroup) {
      sendCommandToLiveActivityGroup(liveActivityGroup, MasterAPI.Commands.Shutdown);
    });
  }

  function activateLiveActivityGroupByName(name) {
    getLiveActivityGroupByName(name, function(liveActivityGroup) {
      sendCommandToLiveActivityGroup(liveActivityGroup, MasterAPI.Commands.Activate);
    });
  }

  function deactivateLiveActivityGroupByName(name) {
    getLiveActivityGroupByName(name, function(liveActivityGroup) {
      sendCommandToLiveActivityGroup(liveActivityGroup, MasterAPI.Commands.Deactivate);
    });
  }

  /**
   * Service public interface.
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
});