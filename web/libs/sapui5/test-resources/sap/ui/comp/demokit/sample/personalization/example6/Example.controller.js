sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", 'sap/ui/comp/personalization/Controller', 'sap/ui/comp/personalization/Util', '../../../personalization/Util'
], function(Controller, JSONModel, PersonalizationController, PersonalizationUtil, TestUtil) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.personalization.example6.Example", {

		onInit: function() {
			jQuery.sap.require("sap.ui.core.util.MockServer");
			this.oMockServer = new sap.ui.core.util.MockServer({
				rootUri: "demokit.personalization.example6/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new sap.ui.model.odata.ODataModel("demokit.personalization.example6", true);
			sap.ui.model.analytics.ODataModelAdapter.apply(this.oModel);
			this.getView().setModel(this.oModel);

			var oTable = this.byId("AnalyticalTable");
			this.addColumns(oTable, this.oModel);
			oTable.setModel(this.oModel);
			oTable.bindRows({
				path: "/ProductCollection",
				parameters: {
					entitySet: "ProductCollection",
					useBatchRequests: true,
					useAcceleratedAutoExpand: false
				}
			});

			this.oP13nDialogController = new sap.ui.comp.personalization.Controller({
				table: oTable
			});
			this.oP13nDialogController.attachAfterP13nModelDataChange(this.fHandleAfterP13nModelDataChange, this);
		},

		onExit: function() {
			this.oMockServer.stop();
			this.oModel.destroy();
		},

		onP13nDialogPress: function(oEvent) {
			this.oP13nDialogController.openDialog();
		},

		addColumns: function(oTable, oModel) {
			var oResult = oModel.getAnalyticalExtensions().findQueryResultByName("ProductCollection");
			var aSortableColumns = oResult._oEntityType.getSortablePropertyNames();
			var aFilterableColumns = oResult._oEntityType.getFilterablePropertyNames();
			var oDimensions = oResult.getAllDimensions();
			for ( var i in oDimensions) {
				var sPath = oDimensions[i].getKeyProperty().name;
				oTable.addColumn(new sap.ui.table.AnalyticalColumn({
					visible: true,
					autoResizable: true,
					showFilterMenuEntry: false,
					template: sPath,
					sortProperty: aSortableColumns.indexOf(sPath) === -1 ? undefined : sPath,
					filterProperty: aFilterableColumns.indexOf(sPath) === -1 ? undefined : sPath,
					leadingProperty: sPath
				}).data("p13nData", {
					columnKey: sPath,
					aggregationRole: "dimension"
				}));
			}
			var oMeasures = oResult.getAllMeasures();
			for ( var i in oMeasures) {
				var sPath = oMeasures[i].getRawValueProperty().name;
				oTable.addColumn(new sap.ui.table.AnalyticalColumn({
					visible: true,
					autoResizable: true,
					showFilterMenuEntry: false,
					template: sPath,
					sortProperty: aSortableColumns.indexOf(sPath) === -1 ? undefined : sPath,
					filterProperty: aFilterableColumns.indexOf(sPath) === -1 ? undefined : sPath,
					leadingProperty: sPath
				}).data("p13nData", {
					columnKey: sPath,
					aggregationRole: "measure"
				}));
			}
		},

		fHandleAfterP13nModelDataChange: function(oEvent) {
			var oChangeData = oEvent.getParameter("changeData");
			var oTable = oEvent.oSource.getTable();
			var aColumns = oTable.getColumns();
			var oBinding = oTable instanceof sap.m.Table ? oTable.getBinding("items") : oTable.getBinding("rows");

			this.fSetDirtyFlag(oTable, oEvent);

			if (oChangeData.sort && oChangeData.sort.sortItems) {
				var aSorters = [];
				var fGetSorterByPath = function(aSorters, sPath) {
					var oFoundSorter;
					aSorters.some(function(oSorter) {
						if (oSorter.sPath === sPath) {
							oFoundSorter = oSorter;
							return true;
						}
					}, true);
					return oFoundSorter;
				};
				oChangeData.sort.sortItems.forEach(function(oSortItem) {
					var oColumn = TestUtil.getColumn(oSortItem.columnKey, aColumns);
					var sPath = PersonalizationUtil.getColumnKey(oColumn);
					var bDescending = oSortItem.operation === sap.m.P13nConditionOperation.Descending;
					var oSorter = fGetSorterByPath(aSorters, sPath);
					if (oSorter) {
						oSorter.bDescending = bDescending;
					} else {
						aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
					}
				}, this);
				oBinding.sort(aSorters);
			}

			if (oChangeData.filter && oChangeData.filter.filterItems) {
				var aFilters = [];
				oChangeData.filter.filterItems.forEach(function(oModelItem) {
					var oColumn = TestUtil.getColumn(oModelItem.columnKey, aColumns);
					var sPath = PersonalizationUtil.getColumnKey(oColumn);
					aFilters.push(new sap.ui.model.Filter(sPath, oModelItem.operation, oModelItem.value1, oModelItem.value2));
				}, this);
				oBinding.filter(aFilters);
			}
		},

		fSetDirtyFlag: function(oTable, oEvent) {
			var oPersData = oEvent.getParameter("persistentData");
			var oChangeData = oEvent.getParameter("changeData");
			var oChangeType = oEvent.getParameter("changeType");
			var oChangeTypeVariant = oEvent.getParameter("changeTypeVariant");

			var sText = "";
			if (oTable instanceof sap.m.Table && oTable.getHeaderToolbar() && oTable.getHeaderToolbar().getContent()) {
				sText = oTable.getHeaderToolbar().getContent()[0].getText();
			} else if (oTable instanceof sap.ui.table.Table && oTable.getToolbar()) {
				sText = oTable.getToolbar().getItems()[0].getText();
			}
			var bTextDirty = (sText.indexOf("*") !== -1 && sText.indexOf("*") === (sText.length - 1));
			if (!bTextDirty && PersonalizationUtil.hasChangedType(oChangeTypeVariant)) {
				var sTextDirty = sText + " *";
				oTable instanceof sap.m.Table ? oTable.getHeaderToolbar().getContent()[0].setText(sTextDirty) : oTable.getToolbar().getItems()[0].setText(sTextDirty);
			} else if (bTextDirty && !PersonalizationUtil.hasChangedType(oChangeTypeVariant)) {
				var sTextNotDirty = sText.substring(0, sText.length - 1);
				oTable instanceof sap.m.Table ? oTable.getHeaderToolbar().getContent()[0].setText(sTextNotDirty) : oTable.getToolbar().getItems()[0].setText(sTextNotDirty);
			}
		}
	});
});
