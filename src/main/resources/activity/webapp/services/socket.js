/**
 * A Service for interfacing the IS websocket library.
 */
LiquidGalaxyApp.service('SocketService', function(SocketConfig) {

  var messageHandlers = {};
  var socket = new IS.Connection();

  /**
   * Handle socket connection.
   */
  socket.onConnect(function() {
    console.debug('Socket.connected');
  });

  /**
   * Handle socket disconnection.
   */
  socket.onDisconnect(function() {
    console.debug('Socket.disconnected');
  });

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

  return {
    emit: emit,
    on: on
  }
});
