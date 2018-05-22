/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./Base'],function(q,B){"use strict";var R=function(){};R.prototype=q.sap.newObject(B.prototype);R.prototype.applyChange=function(c,g){if(g.getParent){var f=g.getParent();if(f.removeGroup){f.removeGroup(g);}}else{throw new Error("no Group control provided for removing the group");}};R.prototype.completeChangeContent=function(c,s){var C=c.getDefinition();if(!C.content){C.content={};}};return R;},true);
