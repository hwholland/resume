jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.declare('test.sap.apf.ui.representations.tBarChart');

jQuery.sap.require("sap.apf.testhelper.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.ui.representations.barChart');
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
(function() {
	'use strict';
	var barChart, oGlobalApi, attachSelectionFormatSpy, formatterForMeasureSpy, isAllMeasureSameUnitSpy, representationHelper;
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
		var thumbnailContent = barChart.getThumbnailContent();
		// act
		var mainContent = barChart.getMainContent("sample Title", 600, 600);
		// assert
		assert.strictEqual(requiredParameter.dimensions.length, barChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(barChart.getParameter().dimensions[0].axisfeedItemId, "categoryAxis", 
				"Then axis feedItemId for xAxis is categoryAxis");
		assert.strictEqual(requiredParameter.measures.length, barChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(barChart.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for yAxis is valueAxis");
		assert.deepEqual(requiredParameter.alternateRepresentationType, barChart.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.deepEqual(_getSampleData(), barChart.getData(), "Then Data available for chart to plot");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("YearMonth"), barChart.getMetaData().getPropertyMetadata("YearMonth"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("DaysSalesOutstanding"), barChart.getMetaData().getPropertyMetadata("DaysSalesOutstanding"), 
				"Then metadata available for data");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(barChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, "Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "bar", "Then mainContent is a Bar chart");
		assert.strictEqual(barChart.thumbnailChart.getVizType(), "bar", "Then thumbnailcontent has Bar chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(formatterForMeasureSpy.calledOnce, true, "Then Required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledOnce, true, "Then Required method called for checking all measures has same unit");
	}
	function _commonSetupForCreatingChart(requiredParameter) {
		formatterForMeasureSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
		attachSelectionFormatSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
		isAllMeasureSameUnitSpy = sinon.spy(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");
		barChart = new sap.apf.ui.representations.barChart(oGlobalApi.oApi, requiredParameter);
		barChart.setData(_getSampleData(), _getSampleMetadata());
		return barChart;
	}
	function _checkForAfterDestroy(assert) {
		assert.strictEqual(barChart.dataset, null, "After destroy dataset is null");
		assert.strictEqual(barChart.oDataSetHelper, null, "After destroy Dataset Helper is null");
		assert.strictEqual(barChart.formatter, null, " After destroy formatter is null");
		assert.strictEqual(barChart.UI5ChartHelper, null, " After destroy UI5ChartHelper is null");
		assert.strictEqual(barChart.fnHandleSelection, null, " After destroy selection function is null");
		assert.strictEqual(barChart.fnHandleDeselection, null, "After destroy deselection function is null");
		assert.strictEqual(barChart.chart, null, "After destroy mainChart is null");
		assert.strictEqual(barChart.thumbnailChart, null, "After destroy thumbnailchart is null");
		assert.deepEqual(barChart.thumbnailLayout.getContent(), [], "After destroy thumbnailLayout is empty");
	}
	QUnit.module("Bar Chart Tests - Basic Check", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi(undefined, undefined);
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			barChart = _commonSetupForCreatingChart(requiredParameter);
		},
		afterEach : function(assert) {
			oGlobalApi.oCompContainer.destroy();
			barChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When BarChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		assert.deepEqual(barChart.chart.getVizProperties(), representationHelper.getVizPropertiesJSONOnChart(), 
				"Then vizProperties are applied to the chart");
		assert.deepEqual(barChart.thumbnailChart.getVizProperties(), representationHelper.getVizPropertiesJSONOnThumbnail(), 
				"Then vizProperties are applied to the thumbnail chart");
		assert.strictEqual(barChart.chart.getVizProperties().interaction.selectability.mode, 'none', 
				"Since requird filter is not defined so selectability mode of main chart is none");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = barChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		//assert
		assert.strictEqual(printContentType.getVizType(), "bar", "printContent is a Bar chart");
		assert.strictEqual(storedSelection, null, 
				"Since nothing has been selected on chart so selection on print content is null");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//arrange
		var expectedFilterValue = [ {
			"data" : {}
		} ];
		//act
		barChart.deserialize({
			oFilter : [ {
				data : {}
			} ]
		});
		//assert
		assert.deepEqual(barChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since nothing has been seleted so deserialized value is empty");
		//act
		barChart.serialize();
		//assert
		assert.deepEqual(barChart.UI5ChartHelper.filterValues, barChart.serialize().oFilter, 
				"Since nothing has been seleted so serialized value is empty");
	});
	QUnit.module("Bar Chart Tests - When Datapoints are selected and deselected on Chart", {
		beforeEach : function(assert) {

			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			var requiredFilters = [ "YearMonth" ];
			requiredParameter.requiredFilters = requiredFilters;
			barChart = _commonSetupForCreatingChart(requiredParameter);
			var mainContent = barChart.getMainContent("sample Title", 600, 600);
			var thumbnailContent = barChart.getThumbnailContent("sample Title", 600, 600);
			mainContent.placeAt('qunit-chart');
			thumbnailContent.placeAt('qunit-chart');
			sap.ui.getCore().applyChanges();
			var done = assert.async();
			mainContent.attachEventOnce('renderComplete', function() {
				barChart.setSelectionOnMainChart(_getDataPointForSelection());
				done();
			});
			thumbnailContent.attachEventOnce('renderComplete', function() {
				barChart.setSelectionOnThumbnailChart(_getDataPointForSelection());
				done();
			});
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			barChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When BarChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		var selectionCountOnMainChart = barChart.getSelectionFromChart().length;
		var selectionCountOnThumbnailChart = barChart.thumbnailChart.vizSelection().length;
		assert.strictEqual(2, selectionCountOnMainChart, "Then Selected two points on main chart");
		assert.strictEqual(2, selectionCountOnThumbnailChart, "Then Selected two points on thumbnail chart");
		assert.strictEqual(barChart.chart.getVizProperties().interaction.selectability.mode, 'multiple', 
				"Since requird filter is defined so selectability mode is multiple");
	});
	QUnit.test("When switching between the charts", function(assert) {
		//act
		barChart.adoptSelection(barChart);
		//assert
		assert.strictEqual(barChart.UI5ChartHelper.filterValues.length, _getDataPointForSelection().length, 
				"Then only selected filter values are passed");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = barChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		var aExpectedSelection = _getDataPointForSelection();
		//assert
		assert.strictEqual(printContentType.getVizType(), "bar", "Then printContent is a Bar chart");
		assert.strictEqual(storedSelection.length, aExpectedSelection.length, 
				"Then selected data points sending to the print content is same");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//act
		barChart.deserialize({
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
		assert.deepEqual(barChart.UI5ChartHelper.filterValues, _getDataPointForSelection(), 
				"Since two points got selected so selescted point is deserialized");
		//act
		barChart.serialize();
		//assert
		assert.deepEqual(barChart.UI5ChartHelper.filterValues, barChart.serialize().oFilter, 
				"Since two points got selected so selected point is serialised");
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
		var mainContent = barChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = barChart.getThumbnailContent("sample Title", 600, 600);
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
			barChart.clearSelectionFromMainChart();
			barChart.setSelectionOnMainChart(deSelectionData);
			var selectionCount = barChart.getSelectionFromChart().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the chart");
			barChart.clearSelectionFromMainChart();
			done();
		});
		thumbnailContent.attachEventOnce('renderComplete', function() {
			barChart.clearSelectionThumbnailChart();
			barChart.setSelectionOnThumbnailChart(deSelectionData);
			var selectionCount = barChart.thumbnailChart.vizSelection().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the thumbnail chart");
			barChart.clearSelectionThumbnailChart();
			done();
		});
		//act
		barChart.deserialize({
			oFilter : [ {
				data : {
					"Days Sales Outstanding" : 56.89,
					"Year Month" : "201401"
				}
			} ]
		});
		assert.deepEqual(barChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since only one point got selected so selcted point is deserialized");
		//act
		barChart.serialize();
		//assert
		assert.deepEqual(barChart.UI5ChartHelper.filterValues, barChart.serialize().oFilter, 
				"Since only one point got selected so selcted point is serialized");
	});
	QUnit.module("Bar Chart Tests - With multiple parameters(Dimensions and measures)", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			barChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When BarChart is initialized with multiple parameters", function(assert) {
		//arrange
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		barChart = _commonSetupForCreatingChart(requiredParameter);
		var mainContent = barChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = barChart.getThumbnailContent();
		var orderBy = [ {
			"descending" : true,
			"property" : "RevenueAmountInDisplayCrcy_E"
		} ];
		var paging = {
			"top" : "100"
		};
		var requestOptions = barChart.getRequestOptions();
		//assert
		assert.strictEqual(requiredParameter.dimensions.length, barChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, barChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(barChart.getParameter().dimensions[0].axisfeedItemId, "categoryAxis", 
				"Then axis feedItemId for xAxis is categoryAxis");
		assert.strictEqual(barChart.getParameter().dimensions[1].axisfeedItemId, "color", 
				"Then axis feedItemId for legend is color");
		assert.strictEqual(barChart.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for yAxis is valueAxis");
		assert.deepEqual(requiredParameter.alternateRepresentationType, barChart.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(barChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, "Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "bar", "Then mainContent is a Bar chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(barChart.thumbnailChart.getVizType(), "bar", "Then thumbnailcontent has Bar chart");
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
		barChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		barChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(barChart.chart.getVizProperties().interaction.selectability.mode, "multiple", 
				"Since required filter is avialable so selectabilty mode is set as multiple");
	});
	QUnit.test("When required parameter is same as second dimension(legend)", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		barChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		barChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(barChart.chart.getVizProperties().interaction.selectability.axisLabelSelection, false, 
				"Since required filter is same as second dimension so selectabilty for axis label is set as false");
	});
	QUnit.test("When required parameter is same as first dimension", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var requiredFilters = [ "CompanyCodeCountry" ];
		requiredParameter.requiredFilters = requiredFilters;
		barChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		barChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(barChart.chart.getVizProperties().interaction.selectability.legendSelection, false, 
				"Since requird filter is same as first dimension so Selectabilty for legend is set as false");
	});
	QUnit.module("Bar Chart Tests - When bar chart is destroyed", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			barChart = _commonSetupForCreatingChart(requiredParameter);
			barChart.getMainContent("sample Title", 600, 600);
			barChart.getThumbnailContent();
			barChart.destroy();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When bar chart destroyed", function(assert) {
		//assert
		_checkForAfterDestroy(assert);
	});
})();
