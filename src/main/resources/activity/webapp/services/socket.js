/**
 * Check for the IS.Configuration object.
 */
if (!IS || !IS.Configuration) {
  console.error("IS.MessageModule depends upon IS.Configuration. Add a WebConfigHandler to your live activity's WebServer and load it before this module.");
}

/**
 * Check for the IS.Connection object.
 */
if (!IS || !IS.Connection) {
  console.error("IS.MessageModule depends upon IS.Connection. Load the is.socket library before this module.");
}

/**
 * A module for interacting with IS websockets.
 */
angular.module('IS.MessageModule', [])

/**
 * Configuration for the socket backend.
 */
.value('SocketConfig', {
  Host: '127.0.0.1',
  Port: Number(IS.Configuration['space.activity.webapp.web.server.port']),
  Channel: '/websocket'
})

/**
 * A service for communicating with IS typed websocket messages.
 */
.factory('MessageService', ['SocketConfig', function(SocketConfig) {
  var messageHandlers = {};
  var socket = new IS.Connection();

  /**
   * Handle socket messages by routing them to their handlers.
   */
  socket.onMessage(function(type, data) {
    if (type in messageHandlers) {
      for(var handler in messageHandlers[type]) {
        messageHandlers[type][handler](data);
      }
    }
  });

  /**
   * Connect to the socket.
   */
  socket.connect(SocketConfig.Host, SocketConfig.Port, SocketConfig.Channel);

  /**
   * Sends a message to the server.
   */
  function emit(type, data) {
    data = data || {};

    socket.sendMessage(type, data);
  }

  /**
   * Subscribes to messages from the server.
   */
  function on(type, cb) {
    if (type in messageHandlers) {
      messageHandlers[type].push(cb);
    } else {
      messageHandlers[type] = [cb];
    }
  }

  /**
   * Public interface.
   */
  return {
    emit: emit,
    on: on
  };
}]);
