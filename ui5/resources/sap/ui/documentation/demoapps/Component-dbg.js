/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/model/json/JSONModel',
	'sap/ui/documentation/demoapps/model/libraryData',
	'sap/ui/documentation/demoapps/model/models'
], function(UIComponent, JSONModel, libraryData, models) {
	"use strict";

	return UIComponent.extend("sap.ui.documentation.demoapps.Component", {
		metadata : {
			manifest:"json"
		},

		init : function () {
			// call base class constructor
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// load demo app metadata from docuindex of all available libraries
			var oModel = new JSONModel();
			libraryData.fillJSONModel(oModel);
			this.setModel(oModel);
		}
	});
});
