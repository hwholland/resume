jQuery.sap.declare('sap.apf.modeler.ui.tPreviewContent');
jQuery.sap.require("sap.apf.ui.utils.constants");
(function() {
	'use strict';
	var oPreviewContent;
	function _instantiateView(aRepresentationDetails, assert) {
		var oPreviewContentController = sap.ui.controller("sap.apf.modeler.ui.controller.previewContent");
		var spy = sinon.spy(oPreviewContentController, "onInit");
		oPreviewContent = sap.ui.view({
			type : sap.ui.core.mvc.ViewType.XML,
			viewName : "sap.apf.modeler.ui.view.previewContent",
			viewData : aRepresentationDetails,
			controller : oPreviewContentController
		});
		assert.strictEqual(spy.calledOnce, true, "preview content is initialized");
	}
	function _getRepresentationDetails(sChartType) {
		return {
			sChartType : sChartType,
			sStepTitle : "DSO by Country over Time",
			sStepLongTitle : "DSO by Country over Time",
			aDimensions : (sChartType === sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION) ? [] : [ "Country", "YearMonth" ],
			aMeasures : (sChartType === sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION) ? [] : [ "DSO", "OverdueDSO", "Revenue", "Profit" ],
			aProperties : (sChartType === sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION) ? [ "Country", "YearMonth", "DSO", "OverdueDSO", "Revenue", "Profit" ] : [],
			oChartParameter : (sChartType === sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION) ? {
				dimensions : [],
				measures : [],
				properties : [ {
					fieldName : "Country",
					fieldDesc : "Country",
					kind : "sectorColor"
				}, {
					fieldName : "YearMonth",
					fieldDesc : "YearMonth",
					kind : "sectorColor"
				}, {
					fieldName : "DSO",
					fieldDesc : "DSO",
					kind : "sectorSize"
				} ],
				requiredFilters : []
			} : {
				dimensions : [ {
					fieldName : "Country",
					fieldDesc : "Country",
					kind : "sectorColor"
				}, {
					fieldName : "YearMonth",
					fieldDesc : "YearMonth",
					kind : "sectorColor"
				} ],
				measures : [ {
					fieldName : "DSO",
					fieldDesc : "DSO",
					kind : "sectorSize"
				} ],
				properties : []
			},
			aSort : [ {
				sSortField : "DSO",
				bDescending : true
			} ],
			aCornerTexts : {
				sLeftUpper : "DSO",
				sRightUpper : "",
				sLeftLower : "",
				sRightLower : "Country"
			}
		};
	}
	QUnit.module("Preview Content Controller - Tests", {
		beforeEach : function(assert) {
			var aRepresentationDetails = _getRepresentationDetails("PieChart");
			_instantiateView(aRepresentationDetails, assert);
		},
		afterEach : function(assert) {
			oPreviewContent.destroy();
			var oController = oPreviewContent.getController();
			assert.strictEqual(oController, null, "preview content is destroyed");
		}
	});
	QUnit.test("when the preview content is loaded ", function(assert) {
		// Check if charts is drawn.
		//arrangement
		var oMainChart = oPreviewContent.byId("idMainChart");
		var oThumbnailChart = oPreviewContent.byId("idThumbnailChartLayout");
		var sChartType = oMainChart.getItems()[0].getVizType();
		// Check dimensions and measures.
		var aDimensions = oMainChart.getItems()[0].getDataset().getDimensions();
		var aMeasures = oMainChart.getItems()[0].getDataset().getMeasures();
		var pieChartCode = "pie";
		assert.ok(oMainChart.getItems()[0] instanceof sap.viz.ui5.controls.VizFrame, "main chart is drawn on main chart holder.");
		//assert
		assert.strictEqual(sChartType, pieChartCode, "and main chart is a pie chart");
		assert.ok(oThumbnailChart.getItems()[0].getContent()[0] instanceof sap.viz.ui5.controls.VizFrame, " thumbnail chart is drawn on thumbnail chart holder.");
		var sChartTypeThumbnail = oThumbnailChart.getItems()[0].getContent()[0].getVizType();
		assert.strictEqual(sChartTypeThumbnail, pieChartCode, " thumbnail chart is a pie chart");
		assert.strictEqual(aDimensions.length, 2, " two Dimensions are present in the chart.");
		assert.strictEqual(aMeasures.length, 1, " one Measure is present in the chart.");
		//act
		var aDimensionNames = aDimensions.map(function(oDimension) {
			return oDimension.getName();
		});
		var aMeasureNames = aMeasures.map(function(oMeasure) {
			return oMeasure.getName();
		});
		//assert
		assert.strictEqual(aDimensionNames.toString(), "Country,YearMonth", "Country and YearMonth available as dimensions.");
		assert.strictEqual(aMeasureNames.toString(), "DSO", "DSO available as measure.");
		// Check for Thumbnail Text settings.
		assert.strictEqual(oPreviewContent.byId("idStepTitleText").getText(), "DSO by Country over Time", " step Title is set");
		assert.strictEqual(oPreviewContent.byId("idLeftUpperCornerText").getText(), "DSO", "left Upper Corner Text is set properly.");
		assert.strictEqual(oPreviewContent.byId("idRightUpperCornerText").getText(), "", " right Upper Corner Text is set properly.");
		assert.strictEqual(oPreviewContent.byId("idLeftLowerCornerText").getText(), "", " left Lower Corner Text is set properly.");
		assert.strictEqual(oPreviewContent.byId("idRightLowerCornerText").getText(), "Country", " right Lower Corner Text is set properly.");
	});
	QUnit.test("when random sample data is generated ", function(assert) {
		//arrangement
		var oMainChart = oPreviewContent.getContent()[0].mAggregations.items[1];
		var aData = oMainChart.getItems()[0].getModel().getData().data;
		//act
		assert.strictEqual(aData.length, 9, "then chart has 9 data rows.");
		// Check sort property
		var nCurrentMaxValue = 500;
		var bIsSorted = aData.reduce(function(prev, current) {
			var bSortedTillNow = prev && (nCurrentMaxValue >= current.DSO);
			nCurrentMaxValue = current.DSO;
			return bSortedTillNow;
		}, true);
		//assert
		assert.ok(bIsSorted, "then data presented is in sorted order");
	});
	QUnit.module("Preview Content Tests for Table Representation", {
		beforeEach : function(assert) {
			var aRepresentationDetails = _getRepresentationDetails("TableRepresentation");
			_instantiateView(aRepresentationDetails, assert);
		},
		afterEach : function(assert) {
			oPreviewContent.destroy();
			assert.strictEqual(oPreviewContent.getController(), null, "preview content is destroyed");
		}
	});
	QUnit.test("when the preview content is loaded ", function(assert) {
		// Check if table representation is drawn.
		//arrangement
		var oMainChart = oPreviewContent.byId("idMainChart");
		var oThumbnailChart = oPreviewContent.byId("idThumbnailChartLayout");
		var oTableWithoutHeaders = oPreviewContent.byId("idMainChart").getItems()[0].getContent()[0].getContent()[1].getContent()[0];
		var oTableWithHeaders = oPreviewContent.byId("idMainChart").getItems()[0].getContent()[0].getContent()[0];
		assert.ok(oTableWithoutHeaders instanceof sap.m.Table, true, "then table is drawn in main chart area");
		// Check properties of the table.
		var aProperties = oTableWithoutHeaders.getColumns();
		//assert
		assert.ok(oThumbnailChart.getItems()[0].getSrc(), "sap-icon://table-chart", "then table icon is drawn on thumbnail chart holder.");
		assert.strictEqual(aProperties.length, 3, "then three columns are present in the table");
		//act
		var aPropertyNames = oTableWithHeaders.getColumns().map(function(oColumn) {
			return oColumn.getHeader().getText();
		});
		//assert
		assert.strictEqual(aPropertyNames.toString(), "Country,YearMonth,DSO", "Country,YearMonth,DSO are available as properties for table");
		// Check for Thumbnail Text settings.
		assert.strictEqual(oPreviewContent.byId("idStepTitleText").getText(), "DSO by Country over Time", " step Title is set");
		assert.strictEqual(oPreviewContent.byId("idLeftUpperCornerText").getText(), "DSO", "left Upper Corner Text is set properly.");
		assert.strictEqual(oPreviewContent.byId("idRightUpperCornerText").getText(), "", " right Upper Corner Text is set properly.");
		assert.strictEqual(oPreviewContent.byId("idLeftLowerCornerText").getText(), "", " left Lower Corner Text is set properly.");
		assert.strictEqual(oPreviewContent.byId("idRightLowerCornerText").getText(), "Country", " right Lower Corner Text is set properly.");
	});
	QUnit.test("when random sample data is generated ", function(assert) {
		//arrangement
		var oMainChart = oPreviewContent.byId("idMainChart").getItems()[0].getContent()[0].getContent()[1].getContent()[0];
		var aData = oMainChart.getModel().getData().tableData;
		//act
		assert.strictEqual(aData.length, 729, "then table has 729 data rows.");
		// Check sort property
		var nCurrentMaxValue = 500;
		var bIsSorted = aData.reduce(function(prev, current) {
			var bSortedTillNow = prev && (nCurrentMaxValue >= current.DSO);
			nCurrentMaxValue = current.DSO;
			return bSortedTillNow;
		}, true);
		//assert
		assert.ok(bIsSorted, "then data presented is in sorted order");
	});
}());