(function() {
	'use strict';

	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');

	jQuery.sap.declare('test.sap.apf.ui.representations.tHeatmapChart');

	jQuery.sap.require("sap.apf.testhelper.helper");
	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
	jQuery.sap.require('sap.apf.ui.representations.heatmapChart');
	jQuery.sap.require('sap.apf.testhelper.config.representationHelper');

	var heatmapChart, oGlobalApi, attachSelectionFormatSpy, formatterForMeasureSpy, isAllMeasureSameUnitSpy, representationHelper;
	function _getSampleMetadata() {
		return {
			getPropertyMetadata : representationHelper.setPropertyMetadataStub.call()
		};
	}
	function _getSampleData() {
		return sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleData');
	}
	function _getDataPointForSelection() {
		return [ {
			data : {
				"Year Month" : "201312",
				"Days Sales Outstanding" : 55.22
			}
		}, {
			data : {
				"Year Month" : "201311",
				"Days Sales Outstanding" : 40.3
			}
		} ];
	}
	function _getMeasureForHeatmap() {
		return [ {
			"fieldName" : "DaysSalesOutstanding",
			"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR
		} ];
	}
	function _getMultiDimensionForHeatmap() {
		return [ {
			"fieldName" : "CompanyCodeCountry",
			"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
		}, {
			"fieldName" : "YearMonth",
			"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS2
		} ];
	}
	function _getMultiMeasureForHeatmap() {
		return [ {
			"fieldName" : "RevenueAmountInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR
		} ];
	}
	function _commonInitializationAsserts(assert) {
		// arrange
		var requiredParameter = representationHelper.representatationDataWithDimension();
		requiredParameter.measures = _getMeasureForHeatmap();
		var thumbnailContent = heatmapChart.getThumbnailContent();
		// act
		var mainContent = heatmapChart.getMainContent("sample Title", 600, 600);
		// assert
		assert.strictEqual(requiredParameter.dimensions.length, heatmapChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, heatmapChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(heatmapChart.getParameter().dimensions[0].axisfeedItemId, "categoryAxis", 
				"Then axis feedItemId for xAxis is categoryAxis");
		assert.strictEqual(heatmapChart.getParameter().measures[0].axisfeedItemId, "color", 
				"Then axis feedItemId for sectorColor is color");
		assert.deepEqual(requiredParameter.alternateRepresentationType, heatmapChart.getAlternateRepresentation(),
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.deepEqual(_getSampleData(), heatmapChart.getData(), "Then Data available for chart to plot");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("YearMonth"), heatmapChart.getMetaData().getPropertyMetadata("YearMonth"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("DaysSalesOutstanding"), 
				heatmapChart.getMetaData().getPropertyMetadata("DaysSalesOutstanding"), "Then metadata available for data");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(heatmapChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, "Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "heatmap", "Then mainContent is a Heatmap chart");
		assert.strictEqual(heatmapChart.thumbnailChart.getVizType(), "heatmap", "Then thumbnailcontent has Heatmap chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(formatterForMeasureSpy.calledOnce, true, "Then Required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledOnce, true, "Then Required method called for checking all measures has same unit");
	}
	function _commonSetupForCreatingChart(requiredParameter) {
		formatterForMeasureSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
		attachSelectionFormatSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
		isAllMeasureSameUnitSpy = sinon.spy(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");
		heatmapChart = new sap.apf.ui.representations.heatmapChart(oGlobalApi.oApi, requiredParameter);
		heatmapChart.setData(_getSampleData(), _getSampleMetadata());
		return heatmapChart;
	}
	function _checkForAfterDestroy(assert) {
		assert.strictEqual(heatmapChart.dataset, null, "After destroy dataset is null");
		assert.strictEqual(heatmapChart.oDataSetHelper, null, "After destroy Dataset Helper is null");
		assert.strictEqual(heatmapChart.formatter, null, " After destroy formatter is null");
		assert.strictEqual(heatmapChart.UI5ChartHelper, null, " After destroy UI5ChartHelper is null");
		assert.strictEqual(heatmapChart.fnHandleSelection, null, " After destroy selection function is null");
		assert.strictEqual(heatmapChart.fnHandleDeselection, null, "After destroy deselection function is null");
		assert.strictEqual(heatmapChart.chart, null, "After destroy mainChart is null");
		assert.strictEqual(heatmapChart.thumbnailChart, null, "After destroy thumbnailchart is null");
		assert.deepEqual(heatmapChart.thumbnailLayout.getContent(), [], "After destroy thumbnailLayout is empty");
	}
	QUnit.module("Heatmap Chart Tests - Basic Check", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.measures = _getMeasureForHeatmap();
			heatmapChart = _commonSetupForCreatingChart(requiredParameter);
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			heatmapChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When HeatmapChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		//arrange
		var vizPropOnChart = representationHelper.getVizPropertiesJSONOnChart();
		var vizPropOnThumbnailChart = representationHelper.getVizPropertiesJSONOnThumbnail();
		vizPropOnChart.categoryAxis2 = {
			label : {
				visible : true
			},
			title : {
				visible : true
			},
			visible : true
		};
		vizPropOnChart.valueAxis = {
			label : {
				visible : true
			},
			title : {
				visible : true
			},
			visible : true
		};
		vizPropOnThumbnailChart.categoryAxis2 = {
			visible : false,
			title : {
				visible : false
			}
		};
		//assert
		assert.deepEqual(heatmapChart.chart.getVizProperties(), vizPropOnChart, "Then vizProperties are applied to the chart");
		assert.deepEqual(heatmapChart.thumbnailChart.getVizProperties(), vizPropOnThumbnailChart, "Then vizProperties are applied to the thumbnail chart");
		assert.strictEqual(heatmapChart.chart.getVizProperties().interaction.selectability.mode, 'none', "Since required filter is not defined so selectability mode of main chart is none");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = heatmapChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		//assert
		assert.strictEqual(printContentType.getVizType(), "heatmap", "printContent is a Heatmap chart");
		assert.strictEqual(storedSelection, null, "Since nothing has been selected on chart" + " so selection on print content is null");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//arrange
		var expectedFilterValue = [ {
			"data" : {}
		} ];
		//act
		heatmapChart.deserialize({
			oFilter : [ {
				data : {}
			} ]
		});
		//assert
		assert.deepEqual(heatmapChart.UI5ChartHelper.filterValues, expectedFilterValue, "Since nothing has been seleted so deserialized value is empty");
		//act
		heatmapChart.serialize();
		//assert
		assert.deepEqual(heatmapChart.UI5ChartHelper.filterValues, heatmapChart.serialize().oFilter, "Since nothing has been seleted so serialized value is empty");
	});
	QUnit.module("Heatmap Chart Tests - When Datapoints are selected and deselected on Chart", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.measures = _getMeasureForHeatmap();
			var requiredFilters = [ "YearMonth" ];
			requiredParameter.requiredFilters = requiredFilters;
			heatmapChart = _commonSetupForCreatingChart(requiredParameter);
			var mainContent = heatmapChart.getMainContent("sample Title", 600, 600);
			var thumbnailContent = heatmapChart.getThumbnailContent("sample Title", 600, 600);
			mainContent.placeAt('qunit-chart');
			thumbnailContent.placeAt('qunit-chart');
			sap.ui.getCore().applyChanges();
			var done = assert.async();
			mainContent.attachEventOnce('renderComplete', function() {
				heatmapChart.setSelectionOnMainChart(_getDataPointForSelection());
				done();
			});
			thumbnailContent.attachEventOnce('renderComplete', function() {
				heatmapChart.setSelectionOnThumbnailChart(_getDataPointForSelection());
				done();
			});
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			heatmapChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When HeatmapChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		var selectionCountOnMainChart = heatmapChart.getSelectionFromChart().length;
		var selectionCountOnThumbnailChart = heatmapChart.thumbnailChart.vizSelection().length;
		assert.strictEqual(2, selectionCountOnMainChart, "Then Selected two points on main chart");
		assert.strictEqual(2, selectionCountOnThumbnailChart, "Then Selected two points on thumbnail chart");
		assert.strictEqual(heatmapChart.chart.getVizProperties().interaction.selectability.mode, 'multiple', "Since requird filter is defined so selectability mode is multiple");
	});
	QUnit.test("When switching between the charts", function(assert) {
		//act
		heatmapChart.adoptSelection(heatmapChart);
		//assert
		assert.strictEqual(heatmapChart.UI5ChartHelper.filterValues.length, _getDataPointForSelection().length, "Then only selected filter values are passed");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = heatmapChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		var aExpectedSelection = _getDataPointForSelection();
		//assert
		assert.strictEqual(printContentType.getVizType(), "heatmap", "Then printContent is a Heatmap chart");
		assert.strictEqual(storedSelection.length, aExpectedSelection.length, "Then selected data " + "points sending to the print content is same");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//act
		heatmapChart.deserialize({
			oFilter : [ {
				data : {
					"Year Month" : "201312",
					"Days Sales Outstanding" : 55.22
				}
			}, {
				data : {
					"Year Month" : "201311",
					"Days Sales Outstanding" : 40.3
				}
			} ]
		});
		//assert
		assert.deepEqual(heatmapChart.UI5ChartHelper.filterValues, _getDataPointForSelection(), "Since two points got selected so selescted point is deserialized");
		//act
		heatmapChart.serialize();
		//assert
		assert.deepEqual(heatmapChart.UI5ChartHelper.filterValues, heatmapChart.serialize().oFilter, "Since two points got selected so selected point is serialised");
	});
	QUnit.test("When Deselecting Data points", function(assert) {
		//arrange 
		var expectedFilterValue = [ {
			data : {
				"Days Sales Outstanding" : 56.89,
				"Year Month" : "201401"
			}
		} ];
		//act
		var mainContent = heatmapChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = heatmapChart.getThumbnailContent("sample Title", 600, 600);
		var deSelectionData = [ {
			data : {
				"Year Month" : "201312",
				"Days Sales Outstanding" : 55.22
			}
		} ];
		mainContent.placeAt('qunit-chart');
		sap.ui.getCore().applyChanges();
		var done = assert.async();
		mainContent.attachEventOnce('renderComplete', function() {
			//assert
			heatmapChart.clearSelectionFromMainChart();
			heatmapChart.setSelectionOnMainChart(deSelectionData);
			var selectionCount = heatmapChart.getSelectionFromChart().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the chart");
			heatmapChart.clearSelectionFromMainChart();
			done();
		});
		thumbnailContent.attachEventOnce('renderComplete', function() {
			heatmapChart.clearSelectionThumbnailChart();
			heatmapChart.setSelectionOnThumbnailChart(deSelectionData);
			var selectionCount = heatmapChart.thumbnailChart.vizSelection().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the thumbnail chart");
			heatmapChart.clearSelectionThumbnailChart();
			done();
		});
		//act
		heatmapChart.deserialize({
			oFilter : [ {
				data : {
					"Days Sales Outstanding" : 56.89,
					"Year Month" : "201401"
				}
			} ]
		});
		assert.deepEqual(heatmapChart.UI5ChartHelper.filterValues, expectedFilterValue, "Since only one point got selected so selcted point is deserialized");
		//act
		heatmapChart.serialize();
		//assert
		assert.deepEqual(heatmapChart.UI5ChartHelper.filterValues, heatmapChart.serialize().oFilter, "Since only one point got selected so selcted point is serialized");
	});
	QUnit.module("Heatmap Chart Tests - With multiple parameters(Dimensions and measures)", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			heatmapChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When HeatmapChart is initialized with multiple parameters", function(assert) {
		//arrange
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForHeatmap();
		requiredParameter.measures = _getMultiMeasureForHeatmap();
		heatmapChart = _commonSetupForCreatingChart(requiredParameter);
		var mainContent = heatmapChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = heatmapChart.getThumbnailContent();
		var orderBy = [ {
			"descending" : true,
			"property" : "RevenueAmountInDisplayCrcy_E"
		} ];
		var paging = {
			"top" : "100"
		};
		var requestOptions = heatmapChart.getRequestOptions();
		//assert
		assert.strictEqual(requiredParameter.dimensions.length, heatmapChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, heatmapChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(heatmapChart.getParameter().dimensions[0].axisfeedItemId, "categoryAxis", 
				"Then axis feedItemId for xAxis is categoryAxis");
		assert.strictEqual(heatmapChart.getParameter().dimensions[1].axisfeedItemId, "categoryAxis2", 
				"Then axis feedItemId for xAxis2 is categoryAxis2");
		assert.strictEqual(heatmapChart.getParameter().measures[0].axisfeedItemId, "color", 
				"Then axis feedItemId for sectorColor is color");
		assert.deepEqual(requiredParameter.alternateRepresentationType, heatmapChart.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(heatmapChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, "Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "heatmap", "Then mainContent is a Heatmap chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(heatmapChart.thumbnailChart.getVizType(), "heatmap", "Then thumbnailcontent has Heatmap chart");
		assert.strictEqual(Object.keys(requestOptions).length, 2, "Then it returns the request oprtion(orderby property & topN)");
		assert.deepEqual(requestOptions.orderby, orderBy, "Then order by property returns sorting informaton");
		assert.deepEqual(requestOptions.paging, paging, "Then topN returns top value");
		assert.strictEqual(formatterForMeasureSpy.calledOnce, true, "Then required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledOnce, true, "Then Required method called for checking all measures has same unit");
	});
	QUnit.test("When required filter is defined", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForHeatmap();
		requiredParameter.measures = _getMultiMeasureForHeatmap();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		heatmapChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		heatmapChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(heatmapChart.chart.getVizProperties().interaction.selectability.mode, "multiple", 
				"Since required filter is avialable so selectabilty mode is set as multiple");
	});
	QUnit.test("When required parameter is same as second dimension(legend)", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForHeatmap();
		requiredParameter.measures = _getMultiMeasureForHeatmap();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		heatmapChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		heatmapChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(heatmapChart.chart.getVizProperties().interaction.selectability.axisLabelSelection, false, 
				"Since required filter is same as second dimension so selectabilty for axis label is set as false");
	});
	QUnit.test("When required parameter is same as first dimension", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForHeatmap();
		requiredParameter.measures = _getMultiMeasureForHeatmap();
		var requiredFilters = [ "CompanyCodeCountry" ];
		requiredParameter.requiredFilters = requiredFilters;
		heatmapChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		heatmapChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(heatmapChart.chart.getVizProperties().interaction.selectability.legendSelection, false, 
				"Since requird filter is same as first dimension so Selectabilty for legend is set as false");
	});
	QUnit.module("Heatmap Chart Tests - When Heatmap chart is destroyed", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.measures = _getMeasureForHeatmap();
			heatmapChart = _commonSetupForCreatingChart(requiredParameter);
			heatmapChart.getMainContent("sample Title", 600, 600);
			heatmapChart.getThumbnailContent();
			heatmapChart.destroy();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Heatmap chart destroyed", function(assert) {
		//assert
		_checkForAfterDestroy(assert);
	});
})();
