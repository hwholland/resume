/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2015 SAP SE. All rights reserved
 */
/*global sap:false, jQuery:false, sinon */

jQuery.sap.declare('sap.apf.testhelper.doubles.UiInstance');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfUiInstance');
/**
 * @description Constructor. Creates as less as possible. The App may be an empty object when sap.m.App is undefined.
 * @param oInject injected module references
 */
sap.apf.testhelper.doubles.UiInstance = function(oInject) {
	'use strict';
	var app = (sap && sap.m && sap.m.App) ? new sap.m.App() : {};

	this.createApplicationLayout = function() {
		return app;
	};
	
	this.handleStartup = function() {
		return jQuery.Deferred();
	};
};

sap.apf.testhelper.doubles.UiInstance.prototype = new sap.apf.testhelper.interfaces.IfUiInstance();
sap.apf.testhelper.doubles.UiInstance.prototype.constructor = sap.apf.testhelper.doubles.UiInstance;

sap.apf.testhelper.doubles.UiInstance.prototype.selectionChanged = function() {
};