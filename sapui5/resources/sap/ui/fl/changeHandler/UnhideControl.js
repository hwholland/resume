/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./Base'],function(q,B){"use strict";var U={};U.applyChange=function(c,C,p){p.modifier.setVisible(C,true);return true;};U.completeChangeContent=function(c,s){var C=c.getDefinition();if(!C.content){C.content={};}};return U;},true);
