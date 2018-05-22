sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/core/util/MockServer', 'sap/ui/comp/personalization/Controller', 'sap/ui/model/analytics/ODataModelAdapter', 'sap/ui/model/odata/ODataModel', 'test/sap/ui/comp/personalization/Util'
], function(Controller, MockServer, PersonalizationController, ODataModelAdapter, ODataModel, TestUtil) {
	"use strict";

	var oController = Controller.extend("view.Main", {

		onInit: function() {
			// NOTE TO DEVELOPERS: You do not need to reproduce this following section
			// It is just so we can simulate 3000ms delay from the fictional back end, giving
			// us some context to show delayed loading sequences.
			this.oMockServer = new MockServer({
				rootUri: "/mockserver/"
			});
			this.oMockServer.simulate("../../../../../../../test-resources/sap/ui/comp/qunit/personalization/applicationUnderTestPerf/mockserver/metadata.xml", "../../../../../../../test-resources/sap/ui/comp/qunit/personalization/applicationUnderTestPerf/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("/mockserver", true);
			ODataModelAdapter.apply(this.oModel);
			this.getView().setModel(this.oModel);

			var oTable = this.byId("AnalyticalTable");
			TestUtil.addAnalyticalColumnPerf(oTable, this.oModel, "ProductCollection");
			oTable.setModel(this.oModel);
			oTable.bindRows({
				path: "/ProductCollection",
				parameters: {
					entitySet: "ProductCollection",
					useBatchRequests: true,
					useAcceleratedAutoExpand: false
				}
			});
			this.oP13nDialogController = new PersonalizationController({
				table: oTable,
				resetToInitialTableState: true,
				columnKeys: [
					"ProductId", "Category", "Name", "Price"
				],
				requestColumns: jQuery.proxy(this.fHandleRequestColumns, this),
				afterP13nModelDataChange: jQuery.proxy(this.fHandleAfterP13nModelDataChange, this),
			});
		},

		onExit: function() {
			this.oMockServer.stop();
			// destroy the model and clear the model data
			this.oModel.destroy();
		},

		onP13nDialogPress: function(oEvent) {
			this.oP13nDialogController.openDialog();
		},

		onSetVariantPress: function(oEvent) {
// var oTable = this.byId("AnalyticalTable");
// jQuery.sap.require("sap.ui.comp.qunit.personalization.test.Util");
// var oController = sap.ui.comp.qunit.personalization.test.Util.getController(oTable);
// oController.oP13nDialogController.setPersonalizationData({
// columns: {
// columnsItems: []
// },
// sort: {
// sortItems: [
// {
// columnKey: "Name",
// operation: "Descending"
// }
// ]
// },
// filter: {
// filterItems: []
// },
// group: {
// groupItems: []
// }
// });
		},

		fHandleAfterP13nModelDataChange: function(oEvent) {
			var oChangeData = oEvent.getParameter("changeData");
			var oChangeTypeVariant = oEvent.getParameter("changeTypeVariant");
			var oTable = oEvent.oSource.getTable();

			TestUtil.setDirtyFlag(this.byId("IDDirtyFlagLabel"), sap.ui.comp.personalization.Util.hasChangedType(oChangeTypeVariant));

			TestUtil.updateSortererFromP13nModelDataChange(oTable, oChangeData);
			TestUtil.updateFiltererFromP13nModelDataChange(oTable, oChangeData);
		},

		fHandleRequestColumns: function(oEvent) {
			var aColumnKeys = oEvent.getParameter("columnKeys");
			var oTable = oEvent.oSource.getTable();

			var oColumnKey2ColumnMap = {};
			if (oTable instanceof sap.ui.table.AnalyticalTable) {
				oColumnKey2ColumnMap = TestUtil.createAnalyticalColumns(oTable, aColumnKeys, "ProductCollection");
				this.oP13nDialogController.addColumns(oColumnKey2ColumnMap);
			}
		}

	});
	return oController;
});
