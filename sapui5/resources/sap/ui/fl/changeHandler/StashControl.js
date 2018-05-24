/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./Base'],function(q,B){"use strict";var S={};S.applyChange=function(c,C,p){p.modifier.setVisible(C,false);p.modifier.setStashed(C,true);return true;};S.completeChangeContent=function(c,s){var C=c.getDefinition();if(!C.content){C.content={};}};return S;},true);
