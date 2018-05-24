/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/changeHandler/HideControl","sap/ui/fl/changeHandler/UnhideControl","sap/ui/fl/changeHandler/StashControl","sap/ui/fl/changeHandler/UnstashControl","sap/ui/fl/changeHandler/MoveElements","sap/ui/fl/changeHandler/PropertyChange","sap/ui/fl/changeHandler/PropertyBindingChange"],function(q,H,U,S,a,M,P,b){"use strict";var c={hideControl:{changeType:"hideControl",changeHandler:H},unhideControl:{changeType:"unhideControl",changeHandler:U},stashControl:{changeType:"stashControl",changeHandler:S},unstashControl:{changeType:"unstashControl",changeHandler:a},moveElements:{changeType:"moveElements",changeHandler:M},propertyChange:{changeType:"propertyChange",changeHandler:P},propertyBindingChange:{changeType:"propertyBindingChange",changeHandler:b}};return c;},true);