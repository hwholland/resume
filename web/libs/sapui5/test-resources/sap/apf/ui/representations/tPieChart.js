(function() {
	'use strict';

	jQuery.sap.declare("test.sap.apf.ui.representations.tPieChart");

	jQuery.sap.registerModulePath("sap.apf.testhelper", "../../testhelper");

	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require("sap.apf.testhelper.helper");
	jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
	jQuery.sap.require("sap.apf.ui.representations.pieChart");
	jQuery.sap.require("sap.apf.testhelper.config.representationHelper");

	var pieChart, oGlobalApi, attachSelectionFormatSpy, formatterForMeasureSpy, isAllMeasureSameUnitSpy, representationHelper;
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
	function _getDimensionForPie() {
		return [ {
			"fieldName" : "YearMonth",
			"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR
		} ];
	}
	function _getMeasureForPie() {
		return [ {
			"fieldName" : "DaysSalesOutstanding",
			"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORSIZE
		} ];
	}
	function _getMultiDimensionForPie() {
		return [ {
			"fieldName" : "CompanyCodeCountry",
			"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR
		}, {
			"fieldName" : "YearMonth",
			"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORCOLOR
		} ];
	}
	function _getMultiMeasureForPie() {
		return [ {
			"fieldName" : "RevenueAmountInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.SECTORSIZE
		} ];
	}
	function _commonInitializationAsserts(assert) {
		// arrange
		var requiredParameter = representationHelper.representatationDataWithDimension();
		requiredParameter.dimensions = _getDimensionForPie();
		requiredParameter.measures = _getMeasureForPie();
		var thumbnailContent = pieChart.getThumbnailContent();
		// act
		var mainContent = pieChart.getMainContent("sample Title", 600, 600);
		// assert
		assert.strictEqual(requiredParameter.dimensions.length, pieChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, pieChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(pieChart.getParameter().dimensions[0].axisfeedItemId, "color", 
				"Then axis feedItemId for sectorColor is color");
		assert.strictEqual(pieChart.getParameter().measures[0].axisfeedItemId, "size", 
				"Then axis feedItemId for sectorSize is size");
		assert.deepEqual(requiredParameter.alternateRepresentationType, pieChart.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.deepEqual(_getSampleData(), pieChart.getData(), "Then Data available for chart to plot");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("YearMonth"), pieChart.getMetaData().getPropertyMetadata("YearMonth"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("DaysSalesOutstanding"), pieChart.getMetaData().getPropertyMetadata("DaysSalesOutstanding"), 
				"Then metadata available for data");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(pieChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, "Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "pie", "Then mainContent is a Pie chart");
		assert.strictEqual(pieChart.thumbnailChart.getVizType(), "pie", "Then thumbnailcontent has Pie chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(formatterForMeasureSpy.calledOnce, true, "Then Required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledOnce, true, "Then Required method called for checking all measures has same unit");
	}
	function _commonSetupForCreatingChart(requiredParameter) {
		formatterForMeasureSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
		attachSelectionFormatSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
		isAllMeasureSameUnitSpy = sinon.spy(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");
		pieChart = new sap.apf.ui.representations.pieChart(oGlobalApi.oApi, requiredParameter);
		pieChart.setData(_getSampleData(), _getSampleMetadata());
		return pieChart;
	}
	function _checkForAfterDestroy(assert) {
		assert.strictEqual(pieChart.dataset, null, "After destroy dataset is null");
		assert.strictEqual(pieChart.oDataSetHelper, null, "After destroy Dataset Helper is null");
		assert.strictEqual(pieChart.formatter, null, " After destroy formatter is null");
		assert.strictEqual(pieChart.UI5ChartHelper, null, " After destroy UI5ChartHelper is null");
		assert.strictEqual(pieChart.fnHandleSelection, null, " After destroy selection function is null");
		assert.strictEqual(pieChart.fnHandleDeselection, null, "After destroy deselection function is null");
		assert.strictEqual(pieChart.chart, null, "After destroy mainChart is null");
		assert.strictEqual(pieChart.thumbnailChart, null, "After destroy thumbnailchart is null");
		assert.deepEqual(pieChart.thumbnailLayout.getContent(), [], "After destroy thumbnailLayout is empty");
	}
	QUnit.module("Pie Chart Tests - Basic Check", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.dimensions = _getDimensionForPie();
			requiredParameter.measures = _getMeasureForPie();
			pieChart = _commonSetupForCreatingChart(requiredParameter);
		},
		afterEach : function(assert) {
			oGlobalApi.oCompContainer.destroy();
			pieChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When PieChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		//arrange
		var valueAxisOnChart = {
			label : {
				visible : true
			},
			title : {
				visible : true
			},
			visible : true
		};
		var vizPropOnChart = representationHelper.getVizPropertiesJSONOnChart();
		vizPropOnChart.valueAxis = valueAxisOnChart;
		//assert
		assert.deepEqual(pieChart.chart.getVizProperties(), vizPropOnChart, "Then vizProperties are applied to the chart");
		assert.deepEqual(pieChart.thumbnailChart.getVizProperties(), representationHelper.getVizPropertiesJSONOnThumbnail(),
				"Then vizProperties are applied to the thumbnail chart");
		assert.strictEqual(pieChart.chart.getVizProperties().interaction.selectability.mode, 'none', 
				"Since requird filter is not defined so selectability mode of main chart is none");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = pieChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		//assert
		assert.strictEqual(printContentType.getVizType(), "pie", "printContent is a Pie chart");
		assert.strictEqual(storedSelection, null, 
				"Since nothing has been selected on chart so selection on print content is null");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//arrange
		var expectedFilterValue = [ {
			"data" : {}
		} ];
		//act
		pieChart.deserialize({
			oFilter : [ {
				data : {}
			} ]
		});
		//assert
		assert.deepEqual(pieChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since nothing has been seleted so deserialized value is empty");
		//act
		pieChart.serialize();
		//assert
		assert.deepEqual(pieChart.UI5ChartHelper.filterValues, pieChart.serialize().oFilter, 
				"Since nothing has been seleted so serialized value is empty");
	});
	QUnit.module("Pie Chart Tests - When Datapoints are selected and deselected on Chart", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.dimensions = _getDimensionForPie();
			requiredParameter.measures = _getMeasureForPie();
			var requiredFilters = [ "YearMonth" ];
			requiredParameter.requiredFilters = requiredFilters;
			pieChart = _commonSetupForCreatingChart(requiredParameter);
			var mainContent = pieChart.getMainContent("sample Title", 600, 600);
			var thumbnailContent = pieChart.getThumbnailContent("sample Title", 600, 600);
			mainContent.placeAt('qunit-chart');
			thumbnailContent.placeAt('qunit-chart');
			sap.ui.getCore().applyChanges();
			var done = assert.async();
			mainContent.attachEventOnce('renderComplete', function() {
				pieChart.setSelectionOnMainChart(_getDataPointForSelection());
				done();
			});
			thumbnailContent.attachEventOnce('renderComplete', function() {
				pieChart.setSelectionOnThumbnailChart(_getDataPointForSelection());
				done();
			});
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			pieChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When PieChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		var selectionCountOnMainChart = pieChart.getSelectionFromChart().length;
		var selectionCountOnThumbnailChart = pieChart.thumbnailChart.vizSelection().length;
		assert.strictEqual(2, selectionCountOnMainChart, "Then Selected two points on main chart");
		assert.strictEqual(2, selectionCountOnThumbnailChart, "Then Selected two points on thumbnail chart");
		assert.strictEqual(pieChart.chart.getVizProperties().interaction.selectability.mode, 'multiple', 
				"Since requird filter is defined so selectability mode is multiple");
	});
	QUnit.test("When switching between the charts", function(assert) {
		//act
		pieChart.adoptSelection(pieChart);
		//assert
		assert.strictEqual(pieChart.UI5ChartHelper.filterValues.length, _getDataPointForSelection().length, 
				"Then only selected filter values are passed");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = pieChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		var aExpectedSelection = _getDataPointForSelection();
		//assert
		assert.strictEqual(printContentType.getVizType(), "pie", "Then printContent is a Pie chart");
		assert.strictEqual(storedSelection.length, aExpectedSelection.length, 
				"Then selected data points sending to the print content is same");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//act
		pieChart.deserialize({
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
		assert.deepEqual(pieChart.UI5ChartHelper.filterValues, _getDataPointForSelection(), 
				"Since two points got selected so selescted point is deserialized");
		//act
		pieChart.serialize();
		//assert
		assert.deepEqual(pieChart.UI5ChartHelper.filterValues, pieChart.serialize().oFilter, 
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
		var mainContent = pieChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = pieChart.getThumbnailContent("sample Title", 600, 600);
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
			pieChart.clearSelectionFromMainChart();
			pieChart.setSelectionOnMainChart(deSelectionData);
			var selectionCount = pieChart.getSelectionFromChart().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the chart");
			pieChart.clearSelectionFromMainChart();
			done();
		});
		thumbnailContent.attachEventOnce('renderComplete', function() {
			pieChart.clearSelectionThumbnailChart();
			pieChart.setSelectionOnThumbnailChart(deSelectionData);
			var selectionCount = pieChart.thumbnailChart.vizSelection().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the thumbnail chart");
			pieChart.clearSelectionThumbnailChart();
			done();
		});
		//act
		pieChart.deserialize({
			oFilter : [ {
				data : {
					"Days Sales Outstanding" : 56.89,
					"Year Month" : "201401"
				}
			} ]
		});
		assert.deepEqual(pieChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since only one point got selected so selcted point is deserialized");
		//act
		pieChart.serialize();
		//assert
		assert.deepEqual(pieChart.UI5ChartHelper.filterValues, pieChart.serialize().oFilter, 
				"Since only one point got selected so selcted point is serialized");
	});
	QUnit.module("Pie Chart Tests - With multiple parameters(Dimensions and measures)", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			pieChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When PieChart is initialized with multiple parameters", function(assert) {
		//arrange
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var orderBy = [ {
			"descending" : true,
			"property" : "RevenueAmountInDisplayCrcy_E"
		} ];
		requiredParameter.dimensions = _getMultiDimensionForPie();
		requiredParameter.measures = _getMultiMeasureForPie();
		requiredParameter.orderby = orderBy;
		pieChart = _commonSetupForCreatingChart(requiredParameter);
		var mainContent = pieChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = pieChart.getThumbnailContent();
		var paging = {
			"top" : "100"
		};
		var requestOptions = pieChart.getRequestOptions();
		//assert
		assert.strictEqual(requiredParameter.dimensions.length, pieChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, pieChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(pieChart.getParameter().dimensions[0].axisfeedItemId, "color", 
				"Then axis feedItemId for sectorColor is color");
		assert.strictEqual(pieChart.getParameter().dimensions[1].axisfeedItemId, "color", 
				"Then axis feedItemId for sectorColor is color");
		assert.strictEqual(pieChart.getParameter().measures[0].axisfeedItemId, "size", 
				"Then axis feedItemId for sectorSize is size");
		assert.deepEqual(requiredParameter.alternateRepresentationType, pieChart.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(pieChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, "Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "pie", "Then mainContent is a Pie chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(pieChart.thumbnailChart.getVizType(), "pie", "Then thumbnailcontent has Pie chart");
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
		requiredParameter.dimensions = _getMultiDimensionForPie();
		requiredParameter.measures = _getMultiMeasureForPie();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		pieChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		pieChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(pieChart.chart.getVizProperties().interaction.selectability.mode, "multiple", 
				"Since required filter is avialable so selectabilty mode is set as multiple");
	});
	QUnit.test("When required parameter is same as second dimension(legend)", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForPie();
		requiredParameter.measures = _getMultiMeasureForPie();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		pieChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		pieChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(pieChart.chart.getVizProperties().interaction.selectability.axisLabelSelection, false, 
				"Since required filter is same as second dimension so selectabilty for axis label is set as false");
	});
	QUnit.test("When required parameter is same as first dimension", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithDimension();
		requiredParameter.dimensions = _getMultiDimensionForPie();
		requiredParameter.measures = _getMultiMeasureForPie();
		var requiredFilters = [ "CompanyCodeCountry" ];
		requiredParameter.requiredFilters = requiredFilters;
		pieChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		pieChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(pieChart.chart.getVizProperties().interaction.selectability.legendSelection, false, 
				"Since requird filter is same as first dimension so Selectabilty for legend is set as false");
	});
	QUnit.module("Pie Chart Tests - When pie chart is destroyed", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
			requiredParameter.dimensions = _getDimensionForPie();
			requiredParameter.measures = _getMeasureForPie();
			pieChart = _commonSetupForCreatingChart(requiredParameter);
			pieChart.getMainContent("sample Title", 600, 600);
			pieChart.getThumbnailContent();
			pieChart.destroy();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Pie chart destroyed", function(assert) {
		//assert
		_checkForAfterDestroy(assert);
	});
})();
