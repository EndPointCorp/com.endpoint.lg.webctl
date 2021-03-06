/*
 * Copyright (C) 2014 Google Inc.
 * Copyright (C) 2015 End Point Corporation
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

package com.endpoint.lg.webctl;

import interactivespaces.activity.impl.web.BaseRoutableRosWebServerActivity;
import interactivespaces.service.web.server.WebServer;
import interactivespaces.util.data.json.JsonNavigator;
import interactivespaces.util.data.json.JsonBuilder;

import java.util.Map;

import com.endpoint.lg.support.message.WebsocketMessageHandlers;
import com.endpoint.lg.support.message.WebsocketMessageHandler;
import com.endpoint.lg.support.message.RosMessageHandlers;
import com.endpoint.lg.support.message.RosMessageHandler;
import com.endpoint.lg.support.message.MessageWrapper;
import com.endpoint.lg.support.message.panoviewer.MessageTypesPanoviewer;
import com.endpoint.lg.support.message.earthQuery.MessageTypesQuery;
import com.endpoint.lg.support.domain.streetview.StreetviewPov;
import com.endpoint.lg.support.domain.streetview.StreetviewPano;
import com.endpoint.lg.support.viewsync.EarthViewSyncState;
import com.endpoint.lg.support.web.WebConfigHandler;

/**
 * Provides a websocket interface for manipulating the Liquid Galaxy.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
 */
public class WebctlActivity extends BaseRoutableRosWebServerActivity {

  public static final String WS_EARTH_ACTIVATE = "Earth.activate";
  public static final String WS_EARTH_DEACTIVATE = "Earth.deactivate";
  public static final String WS_EARTH_SET_VIEW = "Earth.setView";
  public static final String WS_EARTH_SET_PLANET = "Earth.setPlanet";
  public static final String WS_EARTH_SEARCH = "Earth.search";
  public static final String WS_EARTH_VIEW_CHANGED = "Earth.viewChanged";

  public static final String WS_STREETVIEW_ACTIVATE = "StreetView.activate";
  public static final String WS_STREETVIEW_DEACTIVATE = "StreetView.deactivate";
  public static final String WS_STREETVIEW_SET_PANO = "StreetView.setPano";
  public static final String WS_STREETVIEW_SET_POV = "StreetView.setPov";
  public static final String WS_STREETVIEW_PANO_CHANGED = "StreetView.panoChanged";
  public static final String WS_STREETVIEW_POV_CHANGED = "StreetView.povChanged";

  public static final String WS_REFRESH = "Refresh";

  public static final String CONFIG_HANDLER_PATH = "/is.config.js";

  private StreetviewPov lastStreetviewPov;
  private StreetviewPano lastStreetviewPano;
  private EarthViewSyncState lastEarthView;

  private WebsocketMessageHandlers websocketHandlers;
  private RosMessageHandlers rosHandlers;

  private WebConfigHandler configHandler;

  private double lastSpnavMsg;

  /**
   * Broadcasts the Earth view state to all websocket clients.
   */
  private void sendEarthViewChanged() {
    if (lastEarthView == null)
      return;

    JsonBuilder json =
        MessageWrapper.newTypedMessage(WS_EARTH_VIEW_CHANGED, lastEarthView.getMap());

    sendAllWebSocketJsonBuilder(json);
  }

  /**
   * Broadcasts the Street View pano state to all websocket clients.
   */
  private void sendStreetViewPanoChanged() {
    if (lastStreetviewPano == null)
      return;

    JsonBuilder json =
        MessageWrapper.newTypedMessage(WS_STREETVIEW_PANO_CHANGED, lastStreetviewPano.getMap());

    sendAllWebSocketJsonBuilder(json);
  }

  /**
   * Broadcasts the Street View pov state to all websocket clients.
   */
  private void sendStreetViewPovChanged() {
    if (lastStreetviewPov == null)
      return;

    JsonBuilder json =
        MessageWrapper.newTypedMessage(WS_STREETVIEW_POV_CHANGED, lastStreetviewPov.getMap());

    sendAllWebSocketJsonBuilder(json);
  }

  /**
   * Sets up message handlers. Most handlers simply relay information from Ros
   * to the websocket clients or vice versa.
   */
  @Override
  public void onActivitySetup() {
    lastStreetviewPov = null;
    lastStreetviewPano = null;
    lastEarthView = null;

    websocketHandlers = new WebsocketMessageHandlers(getLog());

    /**
     * Handle Earth activation requests from websockets.
     */
    websocketHandlers.registerHandler(WS_EARTH_ACTIVATE, new WebsocketMessageHandler() {
      public void handleMessage(String connectionId, JsonNavigator json) {
        getLog().info(WS_EARTH_ACTIVATE);
      }
    });

    /**
     * Handle Earth deactivation requests from websockets.
     */
    websocketHandlers.registerHandler(WS_EARTH_DEACTIVATE, new WebsocketMessageHandler() {
      public void handleMessage(String connectionId, JsonNavigator json) {
        getLog().info(WS_EARTH_DEACTIVATE);
      }
    });

    /**
     * Handle Earth view and planet changes, and search queries from websockets.
     */
    relayWebsocketToRos(websocketHandlers, WS_EARTH_SET_VIEW,   MessageTypesQuery.MESSAGE_TYPE_QUERYFILE_FLYTO,  "query");
    relayWebsocketToRos(websocketHandlers, WS_EARTH_SET_PLANET, MessageTypesQuery.MESSAGE_TYPE_QUERYFILE_PLANET, "query");
    relayWebsocketToRos(websocketHandlers, WS_EARTH_SEARCH,     MessageTypesQuery.MESSAGE_TYPE_QUERYFILE_SEARCH, "query");

    /**
     * Handle pano viewer stuff
     *
     * Can't use relayWebsocketToRos() because it creates a new TypedMessage, which this already will be.
     */
    websocketHandlers.registerHandler(MessageTypesPanoviewer.MESSAGE_TYPE_CHANGEPANO, new WebsocketMessageHandler() {
      public void handleMessage(String connectionId, JsonNavigator json) {
        sendOutputJson("panoviewer", json.getRoot());
      }
    });

    /**
     * Handle Street View activation requests from websockets.
     */
    websocketHandlers.registerHandler(WS_STREETVIEW_ACTIVATE, new WebsocketMessageHandler() {
      public void handleMessage(String connectionId, JsonNavigator json) {
        getLog().info(WS_STREETVIEW_ACTIVATE);
      }
    });

    /**
     * Handle Street View deactivation requests from websockets.
     */
    websocketHandlers.registerHandler(WS_STREETVIEW_DEACTIVATE, new WebsocketMessageHandler() {
      public void handleMessage(String connectionId, JsonNavigator json) {
        getLog().info(WS_STREETVIEW_DEACTIVATE);
      }
    });

    /**
     * Handle Street View pano changes from websockets.
     */
    websocketHandlers.registerHandler(WS_STREETVIEW_SET_PANO, new WebsocketMessageHandler() {
      public void handleMessage(String connectionId, JsonNavigator json) {
        sendOutputJsonBuilder("pano", json.getCurrentAsJsonBuilder());
      }
    });

    /**
     * Handle Street View pov changes from websockets.
     */
    websocketHandlers.registerHandler(WS_STREETVIEW_SET_POV, new WebsocketMessageHandler() {
      public void handleMessage(String connectionId, JsonNavigator json) {
        sendOutputJsonBuilder("pov", json.getCurrentAsJsonBuilder());
      }
    });

    /**
     * Handle a refresh message by sending the last known state.
     */
    websocketHandlers.registerHandler(WS_REFRESH, new WebsocketMessageHandler() {
      public void handleMessage(String connectionId, JsonNavigator json) {
        getLog().info(WS_REFRESH);

        sendEarthViewChanged();
      }
    });

    rosHandlers = new RosMessageHandlers(getLog());

    /**
     * Handle Street View pov changes from Ros.
     */
    rosHandlers.registerHandler("pov", new RosMessageHandler() {
      public void handleMessage(JsonNavigator json) {
        lastStreetviewPov = new StreetviewPov(json);

        sendStreetViewPovChanged();
      }
    });

    /**
     * Handle Street View pano changes from Ros.
     */
    rosHandlers.registerHandler("pano", new RosMessageHandler() {
      public void handleMessage(JsonNavigator json) {
        lastStreetviewPano = new StreetviewPano(json);

        sendStreetViewPanoChanged();
      }
    });

    /**
     * Handle Earth view changes from Ros.
     */
    rosHandlers.registerHandler("earthpos", new RosMessageHandler() {
      public void handleMessage(JsonNavigator json) {
        lastEarthView = new EarthViewSyncState(json);

        sendEarthViewChanged();
      }
    });

    /**
     * Handle spacenav messages
     */
    rosHandlers.registerHandler("spacenav", new RosMessageHandler() {
      public void handleMessage(JsonNavigator json) {
        double now;

        // Don't send *every* spacenav message; we only need
        // it for resetting the attract loop
        now = System.currentTimeMillis();
        if (now - 100 > lastSpnavMsg) {
          JsonBuilder msg =
              MessageWrapper.newTypedMessage("spacenav", json.getCurrentItem());

          sendAllWebSocketJsonBuilder(msg);
          lastSpnavMsg = now;
        }
      }
    });
  }

  /**
   * Registers a handler for forwarding messages from websockets to Ros.
   * 
   * @param handlers
   *          the websocket handler registry
   * @param type
   *          the message type/channel
   */
  private void relayWebsocketToRos(WebsocketMessageHandlers handlers, final String ws_msg_type, final String ros_msg_type, final String channel) {
    handlers.registerHandler(ws_msg_type, new WebsocketMessageHandler() {
      public void handleMessage(String connectionId, JsonNavigator json) {
        JsonBuilder message =
            MessageWrapper.newTypedMessage(ros_msg_type, json.getCurrentItem());
        sendOutputJsonBuilder(channel, message);
      }
    });
  }


  /**
   * Sets up the <code>WebConfigHandler</code>.
   */
  @Override
  public void onActivityStartup() {
    WebServer webserver = getWebServer();
    configHandler = new WebConfigHandler(getConfiguration());
    webserver.addDynamicContentHandler(CONFIG_HANDLER_PATH, false, configHandler);
    lastSpnavMsg = 0;
  }

  /**
   * Sends incoming web socket messages to the web socket message handlers.
   */
  @Override
  public void onWebSocketReceive(String connectionId, Object data) {
    websocketHandlers.handleMessage(connectionId, data);
  }

  /**
   * Sends incoming Ros messages to the Ros message handlers.
   */
  @Override
  public void onNewInputJson(String channel, Map<String, Object> message) {
    rosHandlers.handleMessage(channel, message);
  }
}
