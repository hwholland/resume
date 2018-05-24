/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var P={};P.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapUiVizkitProgressIndicator");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("progressText"));r.renderControl(c.getAggregation("progressBar"));r.write("</div>");};return P;},true);
