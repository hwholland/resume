(function() {
	'use strict';

	jQuery.sap.declare('test.sap.apf.ui.representations.tLineChartWithTimeAxis');

	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');

	jQuery.sap.require("sap.apf.testhelper.helper");
	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
	jQuery.sap.require('sap.apf.ui.representations.lineChartWithTimeAxis');
	jQuery.sap.require('sap.apf.testhelper.config.representationHelper');

	var lineChartWithTimeAxis, oGlobalApi, attachSelectionFormatSpy, formatterForMeasureSpy, isAllMeasureSameUnitSpy, representationHelper;
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
	function _commonInitializationAsserts(assert) {
		// arrange
		var requiredParameter = representationHelper.representatationDataWithDimension();
		var thumbnailContent = lineChartWithTimeAxis.getThumbnailContent();
		// act
		var mainContent = lineChartWithTimeAxis.getMainContent("sample Title", 600, 600);
		// assert
		assert.strictEqual(requiredParameter.dimensions.length, lineChartWithTimeAxis.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, lineChartWithTimeAxis.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(lineChartWithTimeAxis.getParameter().dimensions[0].axisfeedItemId, "timeAxis", 
				"Then axis feedItemId for xAxis is timeAxis");
		assert.strictEqual(lineChartWithTimeAxis.getParameter().dimensions[0].dataType, "date", 
				"Then dataType for timeAxis is date");
		assert.strictEqual(lineChartWithTimeAxis.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for yAxis is valueAxis");
		assert.deepEqual(requiredParameter.alternateRepresentationType, lineChartWithTimeAxis.getAlternateRepresentation(), 
				"Then required Parameter of alternate representation same as return parameter of representation from chart");
		assert.deepEqual(_getSampleData(), lineChartWithTimeAxis.getData(), "Then Data available for chart to plot");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("YearMonth"), lineChartWithTimeAxis.getMetaData().getPropertyMetadata("YearMonth"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("DaysSalesOutstanding"), lineChartWithTimeAxis.getMetaData().getPropertyMetadata("DaysSalesOutstanding"), 
				"Then metadata available for data");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(lineChartWithTimeAxis.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, "Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "timeseries_line", "Then mainContent is a Time axis line chart");
		assert.strictEqual(lineChartWithTimeAxis.thumbnailChart.getVizType(), "timeseries_line", 
				"Then thumbnailcontent has Time axis line chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(formatterForMeasureSpy.calledOnce, true, "Then Required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledOnce, true, "Then Required method called for checking all measures has same unit");
	}
	function _commonSetupForCreatingChart(requiredParameter) {
		formatterForMeasureSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
		attachSelectionFormatSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
		isAllMeasureSameUnitSpy = sinon.spy(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");
		lineChartWithTimeAxis = new sap.apf.ui.representations.lineChartWithTimeAxis(oGlobalApi.oApi, requiredParameter);
		lineChartWithTimeAxis.setData(_getSampleData(), _getSampleMetadata());
		return lineChartWithTimeAxis;
	}
	function _checkForAfterDestroy(assert) {
		assert.strictEqual(lineChartWithTimeAxis.dataset, null, "After destroy dataset is null");
		assert.strictEqual(lineChartWithTimeAxis.oDataSetHelper, null, "After destroy Dataset Helper is null");
		assert.strictEqual(lineChartWithTimeAxis.formatter, null, " After destroy formatter is null");
		assert.strictEqual(lineChartWithTimeAxis.UI5ChartHelper, null, " After destroy UI5ChartHelper is null");
		assert.strictEqual(lineChartWithTimeAxis.fnHandleSelection, null, " After destroy selection function is null");
		assert.strictEqual(lineChartWithTimeAxis.fnHandleDeselection, null, "After destroy deselection function is null");
		assert.strictEqual(lineChartWithTimeAxis.chart, null, "After destroy mainChart is null");
		assert.strictEqual(lineChartWithTimeAxis.thumbnailChart, null, "After destroy thumbnailchart is null");
		assert.deepEqual(lineChartWithTimeAxis.thumbnailLayout.getContent(), [], "After destroy thumbnailLayout is empty");
	}
	QUnit.module("Line Chart With Time Axis Tests - Basic Check", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			lineChartWithTimeAxis = _commonSetupForCreatingChart(requiredParameter);
		},
		afterEach : function(assert) {
			oGlobalApi.oCompContainer.destroy();
			lineChartWithTimeAxis.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Line Chart With TimeAxis is initialized", function(assert) {
		//arrange
		var vizPropOnChart = representationHelper.getVizPropertiesJSONOnChart();
		var vizPropOnThumbnailChart = representationHelper.getVizPropertiesJSONOnThumbnail();
		vizPropOnChart.timeAxis = {
			label : {
				visible : true
			},
			title : {
				visible : true
			},
			visible : true
		};
		var scrollProperty = {
				start : "firstDataPoint",
				end : "lastDataPoint"
		};
		vizPropOnChart.plotArea.window = scrollProperty;
		vizPropOnThumbnailChart.plotArea.window = scrollProperty;
		vizPropOnThumbnailChart.timeAxis = {
			visible : false,
			title : {
				visible : false
			}
		};
		//assert
		_commonInitializationAsserts(assert);
		assert.deepEqual(lineChartWithTimeAxis.chart.getVizProperties(), vizPropOnChart, "Then vizProperties are applied to the chart");
		assert.deepEqual(lineChartWithTimeAxis.thumbnailChart.getVizProperties(), vizPropOnThumbnailChart, 
				"Then vizProperties are applied to the thumbnail chart");
		assert.strictEqual(lineChartWithTimeAxis.chart.getVizProperties().interaction.selectability.mode, 'none', 
				"Since requird filter is not defined so selectability mode of main chart is none");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = lineChartWithTimeAxis.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		//assert
		assert.strictEqual(printContentType.getVizType(), "timeseries_line", "printContent is a Time axis line chart");
		assert.strictEqual(storedSelection, null, "Since nothing has been selected on chart" + " so selection on print content is null");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//arrange
		var expectedFilterValue = [ {
			"data" : {}
		} ];
		//act
		lineChartWithTimeAxis.deserialize({
			oFilter : [ {
				data : {}
			} ]
		});
		//assert
		assert.deepEqual(lineChartWithTimeAxis.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since nothing has been seleted so deserialized value is empty");
		//act
		lineChartWithTimeAxis.serialize();
		//assert
		assert.deepEqual(lineChartWithTimeAxis.UI5ChartHelper.filterValues, lineChartWithTimeAxis.serialize().oFilter, 
				"Since nothing has been seleted so serialized value is empty");
	});
	//To-Do Once the data format is decided then Selection/Deselection logic has to be updated  
//	QUnit.module("Line Chart With Time Axis Tests - When Datapoints are selected and deselected on Chart", {
//		beforeEach : function(assert) {
//			var inject = {
//					ajax : sap.apf.testhelper.ajaxWithAdjustedRessourcePath
//			};
//			oGlobalApi = new sap.apf.testhelper.doubles.UiApi(undefined, undefined, inject);
//			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
//			var requiredParameter = representationHelper.representatationDataWithDimension();
//			var requiredFilters = [ "YearMonth" ];
//			requiredParameter.requiredFilters = requiredFilters;
//			lineChartWithTimeAxis = _commonSetupForCreatingChart(requiredParameter);
//			var mainContent = lineChartWithTimeAxis.getMainContent("sample Title", 600, 600);
//			var thumbnailContent = lineChartWithTimeAxis.getThumbnailContent("sample Title", 600, 600);
//			mainContent.placeAt('qunit-chart');
//			thumbnailContent.placeAt('qunit-chart');
//			sap.ui.getCore().applyChanges();
//			var done = assert.async();
//			mainContent.attachEventOnce('renderComplete', function() {
//				lineChartWithTimeAxis.setSelectionOnMainChart(_getDataPointForSelection());
//				done();
//			});
//			thumbnailContent.attachEventOnce('renderComplete', function() {
//				lineChartWithTimeAxis.setSelectionOnThumbnailChart(_getDataPointForSelection());
//				done();
//			});
//		},
//		afterEach : function() {
//			oGlobalApi.oCompContainer.destroy();
//			lineChartWithTimeAxis.destroy();
//			formatterForMeasureSpy.restore();
//			attachSelectionFormatSpy.restore();
//			isAllMeasureSameUnitSpy.restore();
//		}
//	});
//	QUnit.test("When Line Chart With Time Axis is initialized", function(assert) {
//		//assert
//		_commonInitializationAsserts(assert);
//		var selectionCountOnMainChart = lineChartWithTimeAxis.getSelectionFromChart().length;
//		var selectionCountOnThumbnailChart = lineChartWithTimeAxis.thumbnailChart.vizSelection().length;
//		assert.strictEqual(2, selectionCountOnMainChart, "Then Selected two points on main chart");
//		assert.strictEqual(2, selectionCountOnThumbnailChart, "Then Selected two points on thumbnail chart");
//		assert.strictEqual(lineChartWithTimeAxis.chart.getVizProperties().interaction.selectability.mode, 'multiple', 
//				"Since requird filter is defined so selectability mode is multiple");
//	});
//	QUnit.test("When switching between the charts", function(assert) {
//	act
//	lineChartWithTimeAxis.adoptSelection(lineChartWithTimeAxis);
//	assert
//	assert.strictEqual(lineChartWithTimeAxis.UI5ChartHelper.filterValues.length, _getDataPointForSelection().length, 
//		"Then only selected filter values are passed");
//	});
//	QUnit.test("When Checking content type of print", function(assert) {
//		//act
//		var printContent = lineChartWithTimeAxis.getPrintContent("sample Title");
//		var printContentType = printContent.oChartForPrinting;
//		var storedSelection = printContent.aSelectionOnChart;
//		var aExpectedSelection = _getDataPointForSelection();
//		//assert
//		assert.strictEqual(printContentType.getVizType(), "timeseries_line", "Then printContent is a Time Axis Line chart");
//		//assert.strictEqual(storedSelection.length, aExpectedSelection.length, "Then selected data " +
//		//	"points sending to the print content is same");
//	});
//	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
//		//act
//		lineChartWithTimeAxis.deserialize({
//			oFilter : [ {
//				data : {
//					"Year Month" : "201312",
//					"Days Sales Outstanding" : 55.22
//				}
//			}, {
//				data : {
//					"Year Month" : "201311",
//					"Days Sales Outstanding" : 40.3
//				}
//			} ]
//		});
//		//assert
//		assert.deepEqual(lineChartWithTimeAxis.UI5ChartHelper.filterValues, _getDataPointForSelection(), 
//				"Since two points got selected so selescted point is deserialized");
//		//act
//		lineChartWithTimeAxis.serialize();
//		//assert
//		assert.deepEqual(lineChartWithTimeAxis.UI5ChartHelper.filterValues, lineChartWithTimeAxis.serialize().oFilter, 
//				"Since two points got selected so selected point is serialised");
//	});
//	QUnit.test("When Deselecting Data points", function(assert) {
//		//arrange 
//		var expectedFilterValue = [ {
//			data : {
//				"Days Sales Outstanding" : 56.89,
//				"Year Month" : "201401"
//			}
//		} ];
//		//act
//		var mainContent = lineChartWithTimeAxis.getMainContent("sample Title", 600, 600);
//		var thumbnailContent = lineChartWithTimeAxis.getThumbnailContent("sample Title", 600, 600);
//		var deSelectionData = [ {
//			data : {
//				"Year Month" : "201312",
//				"Days Sales Outstanding" : 55.22
//			}
//		} ];
//		mainContent.placeAt('qunit-chart');
//		sap.ui.getCore().applyChanges();
//		var done = assert.async();
//		mainContent.attachEventOnce('renderComplete', function() {
//			//assert
//			lineChartWithTimeAxis.clearSelectionFromMainChart();
//			lineChartWithTimeAxis.setSelectionOnMainChart(deSelectionData);
//			var selectionCount = lineChartWithTimeAxis.getSelectionFromChart().length;
//			//assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the chart");
//			lineChartWithTimeAxis.clearSelectionFromMainChart();
//			done();
//		});
//		thumbnailContent.attachEventOnce('renderComplete', function() {
//			lineChartWithTimeAxis.clearSelectionThumbnailChart();
//			lineChartWithTimeAxis.setSelectionOnThumbnailChart(deSelectionData);
//			var selectionCount = lineChartWithTimeAxis.thumbnailChart.vizSelection().length;
//			//assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the thumbnail chart");
//			lineChartWithTimeAxis.clearSelectionThumbnailChart();
//			done();
//		});
//		//act
//		lineChartWithTimeAxis.deserialize({
//			oFilter : [ {
//				data : {
//					"Days Sales Outstanding" : 56.89,
//					"Year Month" : "201401"
//				}
//			} ]
//		});
//		assert.deepEqual(lineChartWithTimeAxis.UI5ChartHelper.filterValues, expectedFilterValue, 
//				"Since only one point got selected so selcted point is deserialized");
//		//act
//		lineChartWithTimeAxis.serialize();
//		//assert
//		assert.deepEqual(lineChartWithTimeAxis.UI5ChartHelper.filterValues, lineChartWithTimeAxis.serialize().oFilter, 
//				"Since only one point got selected so selcted point is serialized");
//	});
	QUnit.module("Line Chart With Time Axis Tests - With multiple parameters(Dimensions and measures)", {
		beforeEach : function() {
			var inject = {
					ajax : sap.apf.testhelper.ajaxWithAdjustedRessourcePath
			};
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi(undefined, undefined, inject);
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			lineChartWithTimeAxis.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Line Chart With Time Axis is initialized with multiple parameters", function(assert) {
		//arrange
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		lineChartWithTimeAxis = _commonSetupForCreatingChart(requiredParameter);
		var mainContent = lineChartWithTimeAxis.getMainContent("sample Title", 600, 600);
		var thumbnailContent = lineChartWithTimeAxis.getThumbnailContent();
		var orderBy = [ {
			"descending" : true,
			"property" : "RevenueAmountInDisplayCrcy_E"
		} ];
		var paging = {
			"top" : "100"
		};
		var requestOptions = lineChartWithTimeAxis.getRequestOptions();
		//assert
		assert.strictEqual(requiredParameter.dimensions.length, lineChartWithTimeAxis.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, lineChartWithTimeAxis.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(lineChartWithTimeAxis.getParameter().dimensions[0].axisfeedItemId, "timeAxis", 
				"Then axis feedItemId for xAxis is timeAxis");
		assert.strictEqual(lineChartWithTimeAxis.getParameter().dimensions[1].axisfeedItemId, "color", 
				"Then axis feedItemId for legend is color");
		assert.strictEqual(lineChartWithTimeAxis.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for yAxis is valueAxis");
		assert.deepEqual(requiredParameter.alternateRepresentationType, lineChartWithTimeAxis.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(lineChartWithTimeAxis.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, 
				"Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "timeseries_line", "Then mainContent is a Time axis line chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(lineChartWithTimeAxis.thumbnailChart.getVizType(), "timeseries_line", 
				"Then thumbnailcontent has Time axis line chart");
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
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		lineChartWithTimeAxis = _commonSetupForCreatingChart(requiredParameter);
		//act
		var mainContent = lineChartWithTimeAxis.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(lineChartWithTimeAxis.chart.getVizProperties().interaction.selectability.mode, "multiple", 
				"Since required filter is avialable so selectabilty mode is set as multiple");
	});
	QUnit.test("When required parameter is same as second dimension(legend)", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		lineChartWithTimeAxis = _commonSetupForCreatingChart(requiredParameter);
		//act
		lineChartWithTimeAxis.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(lineChartWithTimeAxis.chart.getVizProperties().interaction.selectability.axisLabelSelection, false, 
				"Since required filter is same as second dimension so selectabilty for axis label is set as false");
	});
	QUnit.test("When required parameter is same as first dimension", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var requiredFilters = [ "CompanyCodeCountry" ];
		requiredParameter.requiredFilters = requiredFilters;
		lineChartWithTimeAxis = _commonSetupForCreatingChart(requiredParameter);
		//act
		lineChartWithTimeAxis.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(lineChartWithTimeAxis.chart.getVizProperties().interaction.selectability.legendSelection, false, 
				"Since requird filter is same as first dimension so Selectabilty for legend is set as false");
	});
	QUnit.module("Line Chart With Time Axis Tests - When Line Chart With Time Axis Chart is destroyed", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			lineChartWithTimeAxis = _commonSetupForCreatingChart(requiredParameter);
			lineChartWithTimeAxis.getMainContent("sample Title", 600, 600);
			lineChartWithTimeAxis.getThumbnailContent();
			lineChartWithTimeAxis.destroy();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Line Chart With Time Axis chart destroyed", function(assert) {
		//assert
		_checkForAfterDestroy(assert);
	});
})();
