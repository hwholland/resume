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
			this.oMockServer.simulate("../../../../../../../test-resources/sap/ui/comp/qunit/personalization/applicationUnderTestWithVariant/mockserver/metadata.xml", "../../../../../../../test-resources/sap/ui/comp/qunit/personalization/applicationUnderTestWithVariant/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("/mockserver", true);
			ODataModelAdapter.apply(this.oModel);
			this.getView().setModel(this.oModel);

			var oTable = this.byId("AnalyticalTable");
			TestUtil.addAnalyticalColumns(oTable, this.oModel, "ProductCollection");
			oTable.setModel(this.oModel);
			oTable.bindRows({
				path: "/ProductCollection",
				parameters: {
					entitySet: "ProductCollection",
					useBatchRequests: true,
					useAcceleratedAutoExpand: false
				}
			});
			TestUtil.addSorter(oTable, [
				{
					path: "Category",
					order: "Ascending"
				}
			]);
			TestUtil.addFilterer(oTable, [
				{
					path: "Date",
					operation: sap.ui.model.FilterOperator.EQ,
					value1: new Date(1397512800000), // "Apr 15, 2014"
					value2: ""
				}
			]);
			TestUtil.addGroup(oTable, [
				{
					path: "Name"
				}
			]);

			this.oP13nDialogController = new PersonalizationController({
				table: oTable,
				resetToInitialTableState: false
			});
			this.oP13nDialogController.attachAfterP13nModelDataChange(this.fHandleAfterP13nModelDataChange, this);
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
			var oTable = this.byId("AnalyticalTable");
			jQuery.sap.require("sap.ui.comp.qunit.personalization.test.Util");
			var oController = sap.ui.comp.qunit.personalization.test.Util.getController(oTable);
			oController.oP13nDialogController.setPersonalizationData({
				columns: {
					columnsItems: []
				},
				sort: {
					sortItems: []
				},
				filter: {
					filterItems: [
						{
							columnKey: "Name",
							exclude: false,
							operation: "EQ",
							value1: "Gladiator MX"
						}
					]
				},
				group: {
					groupItems: []
				}
			});
		},

		fHandleAfterP13nModelDataChange: function(oEvent) {
			var oChangeData = oEvent.getParameter("changeData");
			var oChangeTypeVariant = oEvent.getParameter("changeTypeVariant");
			var oTable = oEvent.oSource.getTable();

			TestUtil.setDirtyFlag(this.byId("IDDirtyFlagLabel"), sap.ui.comp.personalization.Util.hasChangedType(oChangeTypeVariant));

			TestUtil.updateSortererFromP13nModelDataChange(oTable, oChangeData);
			TestUtil.updateFiltererFromP13nModelDataChange(oTable, oChangeData);
		}

	});
	return oController;
});
