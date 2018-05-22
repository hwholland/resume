/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"jquery.sap.global"
], function(jQuery) {
	"use strict";

	/**
	 * ProgressIndicator renderer.
	 * @namespace
	 */
	var ProgressIndicatorRenderer = {};

	ProgressIndicatorRenderer.render = function(rm, oControl) {
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.addClass("sapUiVizkitProgressIndicator");
		rm.writeClasses();
		rm.write(">");
		rm.renderControl(oControl.getAggregation("progressText"));
		rm.renderControl(oControl.getAggregation("progressBar"));
		rm.write("</div>");
	};

	return ProgressIndicatorRenderer;

}, /* bExport= */ true);
