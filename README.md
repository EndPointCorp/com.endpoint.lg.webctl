Web Control
===========

Java package: com.endpoint.lg.webctl

Web interface that controls the rest of a Liquid Galaxy powered by Interactive Spaces.

Copyright (C) 2014 Google Inc.  
Copyright (C) 2015 End Point Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.

## Configuration Variables

* **lg.master.api.uri** The URL for the Interactive Spaces master
* **lg.webctl.group.earth** The name of the Live Activity Group containing the Earth Client live activities
* **lg.webctl.group.panoviewer** The name of the Live Activity Group containing the Pano Viewer live activities
* **lg.webctl.group.streetview** The name of the Live Activity Group containing the Street View live activities
* **poi.json.url** The URL for the points of interest data, which should be JSON and match the format of the orig.json file in this repository
* **attractLoop.timeout** The time in milliseconds during which the touchscreen waits for no activity, before starting the attract loop. Default is five minutes.
* **attractLoop.pointDelay** The time in milliseconds the attract loop waits on one point before switching to another. Default is 30 seconds.
* **attractLoop.ignoreMsgInterval** The attract loop ignores all incoming signals for a brief time after switching to a new point of interest. This is hackish behavior and probably no longer necessary. This variable is the length of this delay, in milliseconds. Default is 500 milliseconds.
