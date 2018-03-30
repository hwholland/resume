/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/Sorter'
	], function(Controller, Sorter) {
	"use strict";

	var MainController = Controller.extend("sap.ui.core.sample.odata.v4.SalesOrdersTemplate.Main", {

		onSort : function (oEvent) {
			var oBinding = this.getView().byId('entitySets').getBinding('items');

			oBinding.sort(new Sorter("@sapui.name", oEvent.getSource().getPressed()));
		}

	});

	return MainController;
});
