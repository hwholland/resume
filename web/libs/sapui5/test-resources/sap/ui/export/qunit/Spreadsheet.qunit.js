sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/ui/export/Spreadsheet",
	"sap/ui/export/ExportDialog"
], function (MockServer, Spreadsheet, ExportDialog) {
	"use strict";

	function runTests() {
		var oMockServer, oSpreadsheet, mSettings;

		var QUnit = window.QUnit;

		// Tweak saveFile
		sap.ui.requireSync("sap/ui/export/js/XLSXExportUtils");

		var fnOnSave;
		window.XLSXExportUtils.saveFile = function(blob) {
			console.log("XLSXExportUtils.saveFile called with " + blob.size + " bytes of data");
			return fnOnSave && fnOnSave();
		}

		// create mock server
		var sPath = "../demokit/sample/localService/";
		var oMockServer = new MockServer({
			rootUri: "/data/"
		});
	
		oMockServer.simulate(sPath + "metadata.xml", sPath + "mockdata");
		oMockServer.start();

		var aCols = [
			{ /* 1. Add a simple text column */
				label: 'Text',
				type: 'wrong type',
				property: 'SampleString',
				textAlign: 'wrong value',
				width: '10em',
			},
			{ /* 2. Add a simple Integer column */
				label: 'Integer',
				type: 'number',
				property: 'SampleInteger',
				scale: 0
			},
			{ /* 3. Add a simple Decimal column */
				label: 'Decimal',
				type: 'number',
				property: 'SampleDecimal'
			},
			{/* 4. Add a custom Decimal column */
				label: 'Decimal (scale=0)',
				type: 'number',
				property: 'SampleDecimal',
				scale: 0
			},
			{/* 5. Add a custom Decimal column */
				label: 'Decimal (scale=2)',
				type: 'number',
				property: 'SampleDecimal',
				scale: '2'
			},
			{/* 6. Add a custom Decimal column */
				label: 'Decimal (delimiter)',
				type: 'number',
				property: 'SampleDecimal',
				delimiter: true
			},
			{/* 7. Add a simple Date column */
				label: 'Date',
				type: 'date',
				property: 'SampleDate'
			},
			{/* 8. Add an islamic Date column */
				label: 'Date (calendar=islamic)',
				type: 'date',
				property: 'SampleDate',
				calendar: 'islamic'
			},
			{/* 8. Add a japanese Date column */
				label: 'Date (calendar=japanese)',
				type: 'date',
				property: 'SampleDate',
				calendar: 'japanese'
			},
			{/* 9. Add a simple DateTime column */
				label: 'DateTime',
				type: 'datetime',
				property: 'SampleDate'
			},
			{/* 10. Add a simple Time column */
				label: 'Time',
				type: 'time',
				property: 'SampleDate'
			},
			{/* 11. Add a custom Date column */
				label: 'Date (format)',
				type: 'date',
				property: 'SampleDate',
				format: 'dd-mm-yyyy h:mm:ss AM/PM'
			},
			{/* 12. Add a simple Currency column */
				label: 'Currency',
				type: 'currency',
				property: 'SampleDecimal',
				unitProperty: 'SampleCurrency',
				displayUnit: true
			},
			{/* 13. Add a Currency column without unitProperty */
				label: 'Currency',
				type: 'currency',
				property: 'SampleDecimal',
				width: '50px'
			}
		];

		mSettings = {
			workbook: { columns: aCols },
			dataSource: {
				type: "oData",
				dataUrl: sPath + "mockdata/Elements.json",
				count: 10,
				useBatch: true,
				sizeLimit: 100
			},
			showProgress: true,
			worker: false // We need to disable worker because we are using a Mockserver as OData Service
		};
	

		QUnit.module("Integration", {
			afterEach: function () {
				fnOnSave = null;
			}
		});

		QUnit.test("Successful", 3, function (assert) {
			fnOnSave = sinon.spy();
			var done = assert.async();
			var oSpreadsheet = new Spreadsheet(mSettings);
			oSpreadsheet.onprogress = sinon.spy();
			oSpreadsheet.build().then(function() {
				assert.ok(true, "The spreadsheet was created");
				assert.ok(fnOnSave.calledOnce, "File was saved");
				assert.ok(oSpreadsheet.onprogress.callCount > 1, "onprogress was called several times");
				done();
			});
			this.clock.tick(10);
		});

		QUnit.test("Worker", 3, function (assert) {
			fnOnSave = sinon.spy();
			var done = assert.async();
			var settings = jQuery.extend(true, {}, mSettings);
			settings.worker = true;
			var oSpreadsheet = new Spreadsheet(settings);
			oSpreadsheet.onprogress = sinon.spy();
			oSpreadsheet.build().then(function() {
				assert.ok(true, "The spreadsheet was created");
				assert.ok(fnOnSave.calledOnce, "File was saved");
				assert.ok(oSpreadsheet.onprogress.callCount > 1, "onprogress was called several times");
				done();
			});
			this.clock.tick(10);
		});

		QUnit.test("Silent run", 2, function (assert) {
			fnOnSave = sinon.spy();
			var done = assert.async();
			var settings = jQuery.extend(true, {}, mSettings);
			settings.showProgress = false;
			var oSpreadsheet = new Spreadsheet(settings);
			oSpreadsheet.build().then(function() {
				assert.ok(true, "The spreadsheet was created in a silent mode");
				assert.ok(fnOnSave.calledOnce, "File was saved");
				done();
			});
			this.clock.tick(10);
		});

		QUnit.test("dataSource as String", 3, function (assert) {
			fnOnSave = sinon.spy();
			var done = assert.async();
			var settings = jQuery.extend(true, {}, mSettings);
			settings.dataSource = settings.dataSource.dataUrl;
			var oSpreadsheet = new Spreadsheet(settings);
			oSpreadsheet.onprogress = sinon.spy();
			oSpreadsheet.build().then(function() {
				assert.ok(true, "The spreadsheet was created");
				assert.ok(fnOnSave.calledOnce, "File was saved");
				assert.ok(oSpreadsheet.onprogress.callCount > 1, "onprogress was called several times");
				done();
			});
			this.clock.tick(10);
		});

		QUnit.test("dataSource as Array", 3, function (assert) {
			fnOnSave = sinon.spy();
			var done = assert.async();
			var settings = jQuery.extend(true, {}, mSettings);
			var data = oMockServer.getEntitySetData("Elements");
			settings.dataSource = data.slice();
			var oSpreadsheet = new Spreadsheet(settings);
			oSpreadsheet.onprogress = sinon.spy();
			oSpreadsheet.build().then(function() {
				assert.ok(true, "The spreadsheet was created");
				assert.ok(fnOnSave.calledOnce, "File was saved");
				assert.ok(oSpreadsheet.onprogress.callCount > 1, "onprogress was called several times");
				done();
			});
			this.clock.tick(10);
		});

		QUnit.test("Negative", 3, function (assert) {
			fnOnSave = sinon.spy();
			var done = assert.async();
			var settings = jQuery.extend(true, {}, mSettings);
			settings.dataSource.dataUrl = "dummy.json";
			var oSpreadsheet = new Spreadsheet(settings);
			oSpreadsheet.onprogress = sinon.spy();
			oSpreadsheet.build().catch(function() {
				assert.ok(true, "The spreadsheet was aborted");
				assert.ok(!fnOnSave.called, "File was not saved");
				assert.ok(oSpreadsheet.onprogress.callCount == 1, "onprogress was called once");
				done();
				// close the error message dialog
				var dialogElement = document.getElementsByClassName("sapMMessageBoxError")[0];
				var dialog = sap.ui.getCore().byId(dialogElement && dialogElement.id);
				dialog && dialog.close();
			});
			this.clock.tick(10);
		});

		QUnit.test("Do not run in parallel", 2, function (assert) {
			var done = assert.async();
			var oSpreadsheet = new Spreadsheet(mSettings);
			oSpreadsheet.onprogress = sinon.spy();
			oSpreadsheet.build().then(function() {
				assert.ok(true, "The first run was successful");
				done();
			});
			oSpreadsheet.build().catch(function() {
				assert.ok(true, "The secod run was aborted");
			});
			this.clock.tick(10);
		});

		QUnit.test("Cancel API", 3, function (assert) {
			fnOnSave = sinon.spy();
			var done = assert.async();
			var oSpreadsheet = new Spreadsheet(mSettings);
			oSpreadsheet.onprogress = sinon.spy(function(progress){
				if (progress > 0) {
					oSpreadsheet.cancel(); // cancel after 50%
				}
			});
			oSpreadsheet.build().then(function() {
				assert.ok(true, "The process has finished");
				assert.ok(fnOnSave.callCount == 0, "File was not saved");
				assert.ok(oSpreadsheet.onprogress.callCount == 2, "onprogress was called two times");
				done();
			});
			this.clock.tick(10);
		});

		QUnit.test("Cancel during JSON export", 3, function (assert) {
			fnOnSave = sinon.spy();
			var done = assert.async();
			var settings = jQuery.extend(true, {}, mSettings);
			var data = oMockServer.getEntitySetData("Elements");
			settings.dataSource = data.slice();
			var oSpreadsheet = new Spreadsheet(settings);
			oSpreadsheet.onprogress = sinon.spy(function(progress){
				if (progress > 0) {
					oSpreadsheet.cancel(); // cancel after 50%
				}
			});
			oSpreadsheet.build().then(function() {
				assert.ok(true, "The process has finished");
				assert.ok(fnOnSave.callCount == 0, "File was not saved");
				assert.ok(oSpreadsheet.onprogress.callCount == 2, "onprogress was called two times");
				done();
			});
			this.clock.tick(10);
		});

		QUnit.test("Cancel from the Progress Dialog", 3, function (assert) {
			fnOnSave = sinon.spy();
			var done = assert.async();
			var oSpreadsheet = new Spreadsheet(mSettings);
			oSpreadsheet.onprogress = sinon.spy(function(progress){
				if (progress > 0) {
					var progressDialog = ExportDialog.getProgressDialog();
					var oButton = progressDialog.getEndButton();
					oButton.firePress(); // cancel after 50%
				}
			});
			oSpreadsheet.build().then(function() {
				assert.ok(true, "The process has finished");
				assert.ok(fnOnSave.callCount == 0, "File was not saved");
				assert.ok(oSpreadsheet.onprogress.callCount == 2, "onprogress was called two times");
				done();
			});
			this.clock.tick(10);
		});

	}


	sap.ui.getCore().attachInit(runTests);
});