jQuery.sap.declare('sap.apf.modeler.ui.tCatalogService');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.ui.core.util.MockServer");
(function() {
	'use strict';
	var oCatalogServiceView, spyOnHandleFormatter, oMockServer, spyOnHandleSearch;
	QUnit.module("For a catalog service", {
		beforeEach : function(assert) {
			var oCatalogServiceController = new sap.ui.controller("sap.apf.modeler.ui.controller.catalogService");
			var spyOnInit = sinon.spy(oCatalogServiceController, "onInit");
			spyOnHandleFormatter = sinon.spy(oCatalogServiceController, "handleFormatting");
			spyOnHandleSearch = sinon.spy(oCatalogServiceController, "handleSearch");
			// create mockserver
			oMockServer = new sap.ui.core.util.MockServer({
				rootUri : "/sap/opu/odata/iwfnd/catalogservice/"
			});
			// start and return
			var url = "../../testhelper/mockServer/metadata/catalogDummy.xml";
			oMockServer.simulate(url, {
				'sMockdataBaseUrl' : "../../testhelper/mockServer/metadata/",
				'bGenerateMissingMockData' : true
			});
			oMockServer.start();
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				var oParentControl = new sap.m.Input({
				//id : "idDummyControl"
				});
				oCatalogServiceView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.catalogService",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : oCatalogServiceController,
					viewData : {
						oTextReader : oModelerInstance.modelerCore.getText,
						parentControl : oParentControl,
						getCalatogServiceUri : function getCalatogServiceUri() {
							return "/sap/opu/odata/iwfnd/catalogservice";
						}
					}
				});
				assert.strictEqual(spyOnInit.calledOnce, true, "then catalog onInit function is called and view is initialized");
				done();
			});
		},
		afterEach : function() {
			oMockServer.stop();
			oCatalogServiceView.destroy();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		}
	});
	QUnit.test("When Catalog Service view is initialized", function(assert) {
		var oDialog = oCatalogServiceView.byId("idGatewayCatalogListDialog");
		sap.ui.getCore().applyChanges();
		assert.ok(oCatalogServiceView, "then catalog service view exists");
		assert.ok(oDialog, "Gateway select dialog exists");
		assert.strictEqual(oDialog.getTitle(), oCatalogServiceView.getViewData().oTextReader("selectService"), "Title is set for select dialog");
		assert.strictEqual(oDialog.getNoDataText(), oCatalogServiceView.getViewData().oTextReader("noDataText"), "No data text is set for select dialog");
		assert.strictEqual(spyOnHandleFormatter.called, true, "handleFormatter is called to format the service");
		assert.ok(oDialog.getItems().length > 0, "List of service Items exists in dialog");
		oDialog._executeSearch("MR01", "search");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(spyOnHandleSearch.calledOnce, true, "then, handleSearch is called to search the given string in the list the service");
		oCatalogServiceView.byId("idGatewayCatalogListDialog")._dialog.close();
	});
}());