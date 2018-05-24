sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/export/Spreadsheet"
], function(Controller, MockServer, Spreadsheet) {
	"use strict";

	return Controller.extend("sap.ui.export.sample.formatting.Spreadsheet", {

		onInit: function() {
			var oModel, oView;

			this._oMockServer = new MockServer({
				rootUri: "./localService/"
			});

			var sPath = jQuery.sap.getModulePath("sap.ui.export.sample.localService");
			this._oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");
			this._oMockServer.start();

			oModel = new sap.ui.model.odata.ODataModel("./localService", true);
			oModel.setCountSupported(false);

			oView = this.getView();
			oView.setModel(oModel);
		},

		createColumnConfig: function() {
			var aCols = [];

			/* 1. Add a simple text column */
			aCols.push({
				label: 'Text',
				type: 'string',
				property: 'SampleString'
			});

			/* 2. Add a concatenated text column */
			aCols.push({
				label: 'Concatenated Text',
				type: 'string',
				property: ['SampleString', 'SampleCurrency'],
				template: 'The company {0} accepts {1}'
			});

			/* 3. Add a simple Integer column */
			aCols.push({
				label: 'Integer',
				type: 'number',
				property: 'SampleInteger',
				scale: 0
			});

			/* 4. Add a simple Decimal column */
			aCols.push({
				label: 'Decimal',
				type: 'number',
				property: 'SampleDecimal'
			});

			/* 5. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (scale=0)',
				type: 'number',
				property: 'SampleDecimal',
				scale: 0
			});

			/* 6. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (scale=2)',
				type: 'number',
				property: 'SampleDecimal',
				scale: 2
			});

			/* 7. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (delimiter)',
				type: 'number',
				property: 'SampleDecimal',
				delimiter: true
			});

			/* 8. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (UoM)',
				type: 'number',
				property: 'SampleDecimal',
				scale: 3,
				unit: 'kg'
			});

			/* 9. Add a custom Decimal column */
			aCols.push({
				label: 'Decimal (UoM property)',
				type: 'number',
				property: 'SampleDecimal',
				scale: 2,
				unitProperty: 'SampleCurrency'
			});

			/* 10. Add a simple Date column */
			aCols.push({
				label: 'Date',
				type: 'date',
				property: 'SampleDate'
			});

			/* 11. Add an islamic Date column */
			aCols.push({
				label: 'Date (calendar=islamic)',
				type: 'date',
				property: 'SampleDate',
				calendar: 'islamic'
			});

			/* 12. Add a japanese Date column */
			aCols.push({
				label: 'Date (calendar=japanese)',
				type: 'date',
				property: 'SampleDate',
				calendar: 'japanese'
			});

			/* 13. Add a simple DateTime column */
			aCols.push({
				label: 'DateTime',
				type: 'datetime',
				property: 'SampleDate'
			});

			/* 14. Add a simple Time column */
			aCols.push({
				label: 'Time',
				type: 'time',
				property: 'SampleDate'
			});

			/* 15. Add a custom Date column */
			aCols.push({
				label: 'Date (format)',
				type: 'date',
				property: 'SampleDate',
				format: 'dd-mm-yyyy h:mm:ss AM/PM',
				width: 25
			});

			/* 16. Add a simple Currency column */
			aCols.push({
				label: 'Currency',
				type: 'currency',
				property: 'SampleDecimal',
				unitProperty: 'SampleCurrency',
				displayUnit: true,
				width: 15
			});

			/* 17. Add a simple Boolean column */
			aCols.push({
				label: 'Boolean',
				type: 'boolean',
				property: 'SampleBoolean'
			});

			/* 18. Add a custom Boolean column */
			aCols.push({
				label: 'Boolean (custom)',
				type: 'boolean',
				property: 'SampleBoolean',
				trueValue: 'AVAILABLE',
				falseValue: 'OUT OF STOCK'
			});

			return aCols;
		},

		onExport: function() {
			var aBoundProperties, aCols, oProperties, oRowBinding, oSettings, oTable, oController;

			oController = this;

			if (!this._oTable) {
				this._oTable = this.byId("exportTable");
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding("items");

			aCols = this.createColumnConfig();

			var oModel = oRowBinding.getModel();
			var oModelInterface = oModel.getInterface();

			oSettings = {
				workbook: { columns: aCols },
				dataSource: {
					type: "oData",
					dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
					serviceUrl: oModelInterface.sServiceUrl,
					headers: oModelInterface.getHeaders ? oModelInterface.getHeaders() : null,
					count: oRowBinding.getLength ? oRowBinding.getLength() : null,
					useBatch: oModelInterface.bUseBatch,
					sizeLimit: oModelInterface.iSizeLimit
				},
				worker: false // We need to disable worker because we are using a Mockserver as OData Service
			};

			new Spreadsheet(oSettings).build();
		},

		onExit: function() {
			this._oMockServer.stop();
		}
	});
});
