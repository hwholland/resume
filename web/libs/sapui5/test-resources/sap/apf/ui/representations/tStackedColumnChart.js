(function() {
	'use strict';

	jQuery.sap.declare("test.sap.apf.ui.representations.tStackedColumnChart");

	jQuery.sap.registerModulePath("sap.apf.testhelper", "../../testhelper");

	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
	jQuery.sap.require("sap.apf.ui.representations.stackedColumnChart");
	jQuery.sap.require("sap.apf.testhelper.config.representationHelper");
	jQuery.sap.require("sap.apf.testhelper.helper");

	var stackedColumnChart, oGlobalApi, attachsSelectionFormatSpy, formatterForMeasureSpy, isAllMeasureSameUnitSpy, representationHelper;
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
		var thumbnailContent = stackedColumnChart.getThumbnailContent();
		// act
		var mainContent = stackedColumnChart.getMainContent("sample Title", 600, 600);
		// assert
		assert.strictEqual(requiredParameter.dimensions.length, stackedColumnChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, stackedColumnChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(stackedColumnChart.getParameter().dimensions[0].axisfeedItemId, "categoryAxis", 
				"Then axis feedItemId for xAxis is categoryAxis");
		assert.strictEqual(stackedColumnChart.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for yAxis is valueAxis");
		assert.deepEqual(requiredParameter.alternateRepresentationType, stackedColumnChart.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.deepEqual(_getSampleData(), stackedColumnChart.getData(), "Then Data available for chart to plot");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("YearMonth"), stackedColumnChart.getMetaData().getPropertyMetadata("YearMonth"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("DaysSalesOutstanding"), stackedColumnChart.getMetaData().getPropertyMetadata("DaysSalesOutstanding"), 
				"Then metadata available for data");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(stackedColumnChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, 
				"Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "stacked_column", "Then mainContent is a Stacked Column chart");
		assert.strictEqual(stackedColumnChart.thumbnailChart.getVizType(), "stacked_column", 
				"Then thumbnailcontent has Stacked Column chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(formatterForMeasureSpy.calledOnce, true, "Then Required method called for formatting measure");
		assert.strictEqual(attachsSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledOnce, true, "Then Required method called for checking all measures has same unit");
	}
	function _commonSetupForCreatingChart(requiredParameter) {
		formatterForMeasureSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
		attachsSelectionFormatSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
		isAllMeasureSameUnitSpy = sinon.spy(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");
		stackedColumnChart = new sap.apf.ui.representations.stackedColumnChart(oGlobalApi.oApi, requiredParameter);
		stackedColumnChart.setData(_getSampleData(), _getSampleMetadata());
		return stackedColumnChart;
	}
	function _checkForAfterDestroy(assert) {
		assert.strictEqual(stackedColumnChart.dataset, null, "After destroy dataset is null");
		assert.strictEqual(stackedColumnChart.oDataSetHelper, null, "After destroy Dataset Helper is null");
		assert.strictEqual(stackedColumnChart.formatter, null, " After destroy formatter is null");
		assert.strictEqual(stackedColumnChart.UI5ChartHelper, null, " After destroy UI5ChartHelper is null");
		assert.strictEqual(stackedColumnChart.fnHandleSelection, null, " After destroy selection function is null");
		assert.strictEqual(stackedColumnChart.fnHandleDeselection, null, "After destroy deselection function is null");
		assert.strictEqual(stackedColumnChart.chart, null, "After destroy mainChart is null");
		assert.strictEqual(stackedColumnChart.thumbnailChart, null, "After destroy thumbnailchart is null");
		assert.deepEqual(stackedColumnChart.thumbnailLayout.getContent(), [], "After destroy thumbnailLayout is empty");
	}
	QUnit.module("Stacked Column Chart Tests - Basic Check", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			stackedColumnChart = _commonSetupForCreatingChart(requiredParameter);
		},
		afterEach : function(assert) {
			oGlobalApi.oCompContainer.destroy();
			stackedColumnChart.destroy();
			formatterForMeasureSpy.restore();
			attachsSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When StackedColumnChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		var animatedVizProp = {
			dataLoading : false,
			dataUpdating : false
		};
		var vizPropOnChart = representationHelper.getVizPropertiesJSONOnChart();
		var vizPropOnThumbnailChart = representationHelper.getVizPropertiesJSONOnThumbnail();
		vizPropOnChart.plotArea.animation = animatedVizProp;
		vizPropOnThumbnailChart.plotArea.animation = animatedVizProp;
		assert.deepEqual(stackedColumnChart.chart.getVizProperties(), vizPropOnChart, 
				"Then vizProperties are applied to the chart");
		assert.deepEqual(stackedColumnChart.thumbnailChart.getVizProperties(), vizPropOnThumbnailChart, 
				"Then vizProperties are applied to the thumbnail chart");
		assert.strictEqual(stackedColumnChart.chart.getVizProperties().interaction.selectability.mode, 'none', 
				"Since requird filter is not defined so selectability mode of main chart is none");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = stackedColumnChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		//assert
		assert.strictEqual(printContentType.getVizType(), "stacked_column", "printContent is a Stacked Column chart");
		assert.strictEqual(storedSelection, null, 
				"Since nothing has been selected on chart so selection on print content is null");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//arrange
		var expectedFilterValue = [ {
			"data" : {}
		} ];
		//act
		stackedColumnChart.deserialize({
			oFilter : [ {
				data : {}
			} ]
		});
		//assert
		assert.deepEqual(stackedColumnChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since nothing has been seleted so deserialized value is empty");
		//act
		stackedColumnChart.serialize();
		//assert
		assert.deepEqual(stackedColumnChart.UI5ChartHelper.filterValues, stackedColumnChart.serialize().oFilter, 
				"Since nothing has been seleted so serialized value is empty");
	});
	QUnit.module("Stacked Column Chart Tests - When Datapoints are selected and deselected on Chart", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			var requiredFilters = [ "YearMonth" ];
			requiredParameter["requiredFilters"] = requiredFilters;
			stackedColumnChart = _commonSetupForCreatingChart(requiredParameter);
			var mainContent = stackedColumnChart.getMainContent("sample Title", 600, 600);
			var thumbnailContent = stackedColumnChart.getThumbnailContent("sample Title", 600, 600);
			mainContent.placeAt('qunit-chart');
			thumbnailContent.placeAt('qunit-chart');
			sap.ui.getCore().applyChanges();
			var done = assert.async();
			mainContent.attachEventOnce('renderComplete', function() {
				stackedColumnChart.setSelectionOnMainChart(_getDataPointForSelection());
				done();
			});
			thumbnailContent.attachEventOnce('renderComplete', function() {
				stackedColumnChart.setSelectionOnThumbnailChart(_getDataPointForSelection());
				done();
			});
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			stackedColumnChart.destroy();
			formatterForMeasureSpy.restore();
			attachsSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When StackedColumnChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		var selectionCountOnMainChart = stackedColumnChart.getSelectionFromChart().length;
		var selectionCountOnThumbnailChart = stackedColumnChart.thumbnailChart.vizSelection().length;
		assert.strictEqual(2, selectionCountOnMainChart, "Then Selected two points on main chart");
		assert.strictEqual(2, selectionCountOnThumbnailChart, "Then Selected two points on thumbnail chart");
		assert.strictEqual(stackedColumnChart.chart.getVizProperties().interaction.selectability.mode, 'multiple', 
				"Since requird filter is defined so selectability mode is multiple");
	});
	QUnit.test("When switching between the charts", function(assert) {
		//act
		stackedColumnChart.adoptSelection(stackedColumnChart);
		//assert
		assert.strictEqual(stackedColumnChart.UI5ChartHelper.filterValues.length, _getDataPointForSelection().length, 
				"Then only selected filter values are passed");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = stackedColumnChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		var aExpectedSelection = _getDataPointForSelection();
		//assert
		assert.strictEqual(printContentType.getVizType(), "stacked_column", "Then printContent is a Stacked Column chart");
		assert.strictEqual(storedSelection.length, aExpectedSelection.length, 
				"Then selected data points sending to the print content is same");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//act
		stackedColumnChart.deserialize({
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
		assert.deepEqual(stackedColumnChart.UI5ChartHelper.filterValues, _getDataPointForSelection(), 
				"Since two points got selected so selescted point is deserialized");
		//act
		stackedColumnChart.serialize();
		//assert
		assert.deepEqual(stackedColumnChart.UI5ChartHelper.filterValues, stackedColumnChart.serialize().oFilter, 
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
		var mainContent = stackedColumnChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = stackedColumnChart.getThumbnailContent("sample Title", 600, 600);
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
			stackedColumnChart.clearSelectionFromMainChart();
			stackedColumnChart.setSelectionOnMainChart(deSelectionData);
			var selectionCount = stackedColumnChart.getSelectionFromChart().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the chart");
			stackedColumnChart.clearSelectionFromMainChart();
			done();
		});
		thumbnailContent.attachEventOnce('renderComplete', function() {
			stackedColumnChart.clearSelectionThumbnailChart();
			stackedColumnChart.setSelectionOnThumbnailChart(deSelectionData);
			var selectionCount = stackedColumnChart.thumbnailChart.vizSelection().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the thumbnail chart");
			stackedColumnChart.clearSelectionThumbnailChart();
			done();
		});
		//act
		stackedColumnChart.deserialize({
			oFilter : [ {
				data : {
					"Days Sales Outstanding" : 56.89,
					"Year Month" : "201401"
				}
			} ]
		});
		assert.deepEqual(stackedColumnChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since only one point got selected so selcted point is deserialized");
		//act
		stackedColumnChart.serialize();
		//assert
		assert.deepEqual(stackedColumnChart.UI5ChartHelper.filterValues, stackedColumnChart.serialize().oFilter, 
				"Since only one point got selected so selcted point is serialized");
	});
	QUnit.module("Stacked Column Chart Tests - With multiple parameters(Dimensions and measures)", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			stackedColumnChart.destroy();
			formatterForMeasureSpy.restore();
			attachsSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When StackedColumnChart is initialized with multiple parameters", function(assert) {
		//arrange
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		stackedColumnChart = _commonSetupForCreatingChart(requiredParameter);
		var mainContent = stackedColumnChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = stackedColumnChart.getThumbnailContent();
		var orderBy = [ {
			"descending" : true,
			"property" : "RevenueAmountInDisplayCrcy_E"
		} ];
		var paging = {
			"top" : "100"
		};
		var requestOptions = stackedColumnChart.getRequestOptions();
		//assert
		assert.strictEqual(requiredParameter.dimensions.length, stackedColumnChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, stackedColumnChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(stackedColumnChart.getParameter().dimensions[0].axisfeedItemId, "categoryAxis", 
				"Then axis feedItemId for xAxis is categoryAxis");
		assert.strictEqual(stackedColumnChart.getParameter().dimensions[1].axisfeedItemId, "color", 
				"Then axis feedItemId for legend is color");
		assert.strictEqual(stackedColumnChart.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for yAxis is valueAxis");
		assert.deepEqual(requiredParameter.alternateRepresentationType, stackedColumnChart.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(stackedColumnChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, 
				"Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "stacked_column", "Then mainContent is a Stacked Column chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(stackedColumnChart.thumbnailChart.getVizType(), "stacked_column", 
				"Then thumbnailcontent has Stacked Column chart");
		assert.strictEqual(Object.keys(requestOptions).length, 2, "Then it returns the request oprtion(orderby property & topN)");
		assert.deepEqual(requestOptions.orderby, orderBy, "Then order by property returns sorting informaton");
		assert.deepEqual(requestOptions.paging, paging, "Then topN returns top value");
		assert.strictEqual(formatterForMeasureSpy.calledOnce, true, "Then required method called for formatting measure");
		assert.strictEqual(attachsSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledOnce, true, "Then Required method called for checking all measures has same unit");
	});
	QUnit.test("When required filter is defined", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		stackedColumnChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		stackedColumnChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(stackedColumnChart.chart.getVizProperties().interaction.selectability.mode, "multiple", 
				"Since required filter is avialable so selectabilty mode is set as multiple");
	});
	QUnit.test("When required parameter is same as second dimension(legend)", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		stackedColumnChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		stackedColumnChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(stackedColumnChart.chart.getVizProperties().interaction.selectability.axisLabelSelection, false, 
				"Since required filter is same as second dimension so selectabilty for axis label is set as false");
	});
	QUnit.test("When required parameter is same as first dimension", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var requiredFilters = [ "CompanyCodeCountry" ];
		requiredParameter.requiredFilters = requiredFilters;
		stackedColumnChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		stackedColumnChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(stackedColumnChart.chart.getVizProperties().interaction.selectability.legendSelection, false, 
				"Since requird filter is same as first dimension so Selectabilty for legend is set as false");
	});
	QUnit.module("Stacked Column Chart Tests - When stacked column chart is destroyed", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			stackedColumnChart = _commonSetupForCreatingChart(requiredParameter);
			stackedColumnChart.getMainContent("sample Title", 600, 600);
			stackedColumnChart.getThumbnailContent();
			stackedColumnChart.destroy();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			formatterForMeasureSpy.restore();
			attachsSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When stacked column chart destroyed", function(assert) {
		//assert
		_checkForAfterDestroy(assert);
	});
})();
