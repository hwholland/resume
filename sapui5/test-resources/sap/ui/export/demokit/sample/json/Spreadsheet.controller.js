sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast"
], function(Controller, JSONModel, Spreadsheet, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.export.sample.json.Spreadsheet", {

		onInit: function() {
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
			this.getView().setModel(oModel);
		},

		createColumnConfig: function() {
			return [
				{
					label: 'Product ID',
					property: 'ProductId'
				},
				{
					label: 'Category',
					property: 'Category',
					width: '25'
				},
				{
					label: 'Main Category',
					property: 'MainCategory',
					width: '25'
				},
				{
					label: 'Tax Code',
					property: 'TaxTarifCode',
					type: 'number',
					scale: 0
				},
				{
					label: 'Weight',
					property: 'WeightMeasure',
					type: 'number',
					scale: 1,
					unitProperty: 'WeightUnit'
				},
				{
					label: 'Name',
					property: 'Name',
					width: '25'
				},
				{
					label: 'Date of Sale',
					property: 'DateOfSale',
					type: 'date'
				},
				{
					label: 'Status',
					property: 'Status',
					width: '12'
				},
				{
					label: 'Quantity',
					property: 'Quantity',
					type: 'number',
					scale: '0',
					unitProperty: 'UoM'
				},
				{
					label: 'Price',
					property: 'Price',
					value: 'Price',
					type: 'currency',
					unitProperty: 'CurrencyCode',
					width: 18
				},
				{
					label: 'Description',
					property: 'Description',
					type: 'string',
					width: '35'
				}];
		},

		onExport: function() {
			var aCols, aProducts, oSettings;

			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel().getProperty("/ProductCollection");

			oSettings = {
				workbook: { columns: aCols },
				dataSource: aProducts
			};

			new Spreadsheet(oSettings)
				.build()
				.then( function() {
					MessageToast.show("Spreadsheet export has finished");
				});
		}
	});
});
