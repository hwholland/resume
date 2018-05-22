sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", 'sap/ui/comp/personalization/Controller', 'sap/ui/comp/personalization/Util', '../../../personalization/Util'
], function(Controller, JSONModel, PersonalizationController, PersonalizationUtil, TestUtil) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.personalization.example3.Example", {

		onInit: function() {
			jQuery.sap.require("sap.ui.core.util.MockServer");
			this.oMockServer = new sap.ui.core.util.MockServer({
				rootUri: "demokit.personalization.example3/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new sap.ui.model.odata.ODataModel("demokit.personalization.example3", true);
			this.getView().setModel(this.oModel);

			this.oP13nDialogController = new sap.ui.comp.personalization.Controller({
				table: this.getView().byId("MTable"),
				resetToInitialTableState: true
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

		fHandleAfterP13nModelDataChange: function(oEvent) {
			var oPersData = oEvent.getParameter("persistentData");
			var oChangeData = oEvent.getParameter("changeData");
			var oTable = oEvent.oSource.getTable();
			var aColumns = oTable.getColumns();
			var oBinding = oTable instanceof sap.m.Table ? oTable.getBinding("items") : oTable.getBinding("rows");

			this.fSetDirtyFlag(oTable, oEvent);

			if (oChangeData.group || oChangeData.sort) {
				var aSorters = [];
				if (oPersData.group && oPersData.group.groupItems) {
					oPersData.group.groupItems.some(function(oModelItem) {
						var oColumn = TestUtil.getColumn(oModelItem.columnKey, aColumns);
						var sPath = PersonalizationUtil.getColumnKey(oColumn);
						var bDescending = oModelItem.operation === sap.m.P13nConditionOperation.GroupDescending;

						if (sPath === "Category") {
							aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, function(oContext) {
								var sColumnsText = oColumn.getHeader().getText();
								var sKey = oContext.getProperty(sPath);
								return {
									key: sKey,
									text: sColumnsText + ": " + sKey
								};
							}));
						}
						if (sPath === "Name") {
							aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, function(oContext) {
								var sKey = oContext.getProperty("Name").charAt(0);
								return {
									key: sKey,
									text: "Product: " + sKey
								};
							}));
						}
						if (sPath === "SupplierName") {
							aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, function(oContext) {
								var sKey = oContext.getProperty("SupplierName").charAt(0);
								return {
									key: sKey,
									text: "Supplier: " + sKey
								};
							}));
						}
						if (sPath === "Price") {
							aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, function(oContext) {
								var iPrice = parseFloat(oContext.getProperty("Price"));
								var key, text;
								if (iPrice <= 50) {
									key = "1";
									text = "0 - 50";
								} else if (iPrice <= 100) {
									key = "2";
									text = "50 - 100";
								} else if (iPrice <= 500) {
									key = "3";
									text = "100 - 500";
								} else if (iPrice <= 1000) {
									key = "4";
									text = "500 - 1000";
								} else if (iPrice > 1000) {
									key = "5";
									text = "> 1000";
								}
								return {
									key: key,
									text: text
								};
							}));
						}
						return true;
					}, this);
				}
				if (oPersData.sort && oPersData.sort.sortItems) {
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
					oPersData.sort.sortItems.forEach(function(oSortItem) {
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
				}
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
