/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/fl/Utils","jquery.sap.global"],function(U,$){"use strict";var B={};B.setTextInChange=function(c,k,t,T){if(!c.texts){c.texts={};}if(!c.texts[k]){c.texts[k]={};}c.texts[k].value=t;c.texts[k].type=T;};return B;},true);
