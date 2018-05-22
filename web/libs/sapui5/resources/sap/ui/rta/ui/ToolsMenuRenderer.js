/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var T={};T.render=function(r,c){var C=q("body").children().length;if(q("body").children()[C-1]!=q("#RTA-ToolbarBottom")){q("body").append(q("#RTA-ToolbarBottom"));}if(c.getToolbars().length!==0){c.getToolbars().forEach(function(o){r.renderControl(o);});}};return T;},true);
