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
			this.oMockServer.simulate("../../../../../../../test-resources/sap/ui/comp/qunit/personalization/applicationUnderTestDimeasure/mockserver/metadata.xml", "../../../../../../../test-resources/sap/ui/comp/qunit/personalization/applicationUnderTestDimeasure/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("/mockserver", true);
			ODataModelAdapter.apply(this.oModel);
			this.getView().setModel(this.oModel);

			var aVisibleCols = [];
			this.oModel.getServiceAnnotations()["EPM_DEVELOPER_SCENARIO_SRV.Product"]["com.sap.vocabularies.UI.v1.LineItem"].forEach(function(oLineItem) {
				aVisibleCols.push(oLineItem.Value.Path);
			});

			var oResult = this.oModel.getAnalyticalExtensions().findQueryResultByName("ProductCollection");
			var oEntityTypeProperties = oResult.getEntityType().getProperties();
			var aSortableColumns = oResult._oEntityType.getSortablePropertyNames();
			var aFilterableColumns = oResult._oEntityType.getFilterablePropertyNames();

			var oColumn;
			var aDimensions = [], aMeasures = [], aNotDimeasures = [];
			var aDimensionsVisible = [], aMeasuresVisible = [];

			for ( var i in oEntityTypeProperties) {
				var sPath = oEntityTypeProperties[i].name;
				var bVisible = aVisibleCols.indexOf(sPath) === -1 ? false : true;
				if (oResult.getAllDimensionNames().indexOf(sPath) > -1) {
					oColumn = new sap.chart.data.Dimension({
						label: sPath,
						name: sPath
					});
					this._setP13nData(oColumn, sPath);
					aDimensions.push(oColumn);
					if (bVisible) {
						aDimensionsVisible.push(sPath);
					}
				} else if (oResult.getAllMeasureNames().indexOf(sPath) > -1) {
					oColumn = new sap.chart.data.Measure({
						label: sPath,
						name: sPath
					// role: "axis1"
					});
					this._setP13nData(oColumn, sPath);
					aMeasures.push(oColumn);
					if (bVisible) {
						aMeasuresVisible.push(sPath);
					}
				} else {
					aNotDimeasures.push({
						columnKey: sPath,
						leadingProperty: sPath,
						sortProperty: aSortableColumns.indexOf(sPath) === -1 ? undefined : sPath,
						filterProperty: aFilterableColumns.indexOf(sPath) === -1 ? undefined : sPath,
						label: sPath,
						tooltip: sPath
					});
				}
			}

			var fSort = function(a, b) {
				var iA = aVisibleCols.indexOf(a);
				var iB = aVisibleCols.indexOf(b);
				if (iA < iB) {
					return -1;
				}
				if (iA > iB) {
					return 1;
				}
				// a must be equal to b
				return 0;
			};
			aDimensionsVisible.sort(fSort);
			aMeasuresVisible.sort(fSort);

			var oChart = new sap.chart.Chart({
				width: '100%',
				isAnalytical: true,
				uiConfig: {
					applicationSet: 'fiori'
				},
				chartType: sap.chart.ChartType.Column,
				selectionMode: sap.chart.SelectionMode.Single,
				visibleDimensions: aDimensionsVisible,
				visibleMeasures: aMeasuresVisible,
				dimensions: aDimensions,
				measures: aMeasures
			});
			oChart.data("NonDimeasures", aNotDimeasures);
			oChart.bindData({
				path: "/ProductCollection",
				parameters: {
					entitySet: "ProductCollection",
					useBatchRequests: true,
					provideGrandTotals: true,
					provideTotalResultSize: true
				}
			});
			oChart.setModel(this.oModel);

			this.byId("IDVBox").addItem(oChart);

			this.oP13nDialogController = new PersonalizationController({
				table: sap.ui.comp.personalization.Util.createChartWrapper(oChart, oChart.data("NonDimeasures")),
				resetToInitialTableState: true,
				setting: {
					dimeasure: {
						visible: true,
						payload: {
							// This is only relevant for release 1.34
							availableChartTypes: test.sap.ui.comp.personalization.Util.getAvailableChartTypes(oChart)
						}
					},
					sort: {
						visible: true
					},
					filter: {
						visible: true
					}
				}
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
					sortItems: [
						{
							columnKey: "Name",
							operation: "Descending"
						}
					]
				},
				filter: {
					filterItems: []
				},
				group: {
					groupItems: []
				}
			});
		},

		fHandleAfterP13nModelDataChange: function(oEvent) {
			var oChangeData = oEvent.getParameter("changeData");
			var oChangeTypeVariant = oEvent.getParameter("changeTypeVariant");
			var oChart = oEvent.oSource.getTable();

			TestUtil.setDirtyFlag(this.byId("IDDirtyFlagLabel"), sap.ui.comp.personalization.Util.hasChangedType(oChangeTypeVariant));

			TestUtil.updateSortererFromP13nModelDataChange(oChart, oChangeData);
			TestUtil.updateFiltererFromP13nModelDataChange(oChart, oChangeData);
		},

		_setP13nData: function(oColumn, sPath) {
			var sType = undefined;
			if (sPath === "Date") {
				sType = "date"
			}
			if (sPath === "Price") {
				sType = "numeric"
			}
			if (sPath === "Bool") {
				sType = "boolean"
			}
			if (sPath === "Time") {
				sType = "time"
			}
			oColumn.data("p13nData", {
				columnKey: sPath,
				sortProperty: sPath,
				filterProperty: sPath,
				leadingProperty: sPath,
				type: sType,
				maxLength: sPath === "Quantity" ? 10 : undefined
			});
		}
	});
	return oController;
});
