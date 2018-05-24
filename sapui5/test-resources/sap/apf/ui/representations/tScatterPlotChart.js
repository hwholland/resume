(function() {
	'use strict';

	jQuery.sap.declare("test.sap.apf.ui.representations.tScatterPlotChart");

	jQuery.sap.registerModulePath("sap.apf.testhelper", "../../testhelper");

	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
	jQuery.sap.require("sap.apf.ui.representations.scatterPlotChart");
	jQuery.sap.require("sap.apf.testhelper.config.representationHelper");
	jQuery.sap.require("sap.apf.testhelper.helper");

	var scatterPlotChart, oGlobalApi, attachSelectionFormatSpy, formatterForMeasureSpy, isAllMeasureSameUnitSpy, representationHelper;
	function _getSampleMetadata() {
		return {
			getPropertyMetadata : representationHelper.setPropertyMetadataStub.call()
		};
	}
	function _getSampleData() {
		return sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleDataForCharts');
	}
	function _getDataPointForSelection() {
		return [ {
			data : {
				"Debit in Display Currency (USD)" : 50518,
				"Overdue Debit in Display Currency (USD)" : 32336,
				"Year Month" : "201302"
			}
		}, {
			data : {
				"Debit in Display Currency (USD)" : 96971,
				"Overdue Debit in Display Currency (USD)" : 22340,
				"Year Month" : "201311"
			}
		} ];
	}
	function _getDimensionForScatter() {
		return [ {
			"fieldName" : "YearMonth",
			"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONCOLOR
		} ];
	}
	function _getMeasureForScatter() {
		return [ {
			"fieldName" : "DebitAmtInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
		}, {
			"fieldName" : "OverdueDebitAmtInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
		} ];
	}
	function _getMultiDimensionForScatter() {
		return [ {
			"fieldName" : "YearMonth",
			"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONCOLOR
		}, {
			"fieldName" : "CustomerCountry",
			"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONSHAPE
		} ];
	}
	function _commonInitializationAsserts(assert) {
		// arrange
		var requiredParameter = representationHelper.representatationDataWithDimension();
		requiredParameter.dimensions = _getDimensionForScatter();
		requiredParameter.measures = _getMeasureForScatter();
		var thumbnailContent = scatterPlotChart.getThumbnailContent();
		// act
		var mainContent = scatterPlotChart.getMainContent("sample Title", 600, 600);
		// assert
		assert.strictEqual(requiredParameter.dimensions.length, scatterPlotChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, scatterPlotChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(scatterPlotChart.getParameter().dimensions[0].axisfeedItemId, "color", 
				"Then axis feedItemId for regionColor is color");
		assert.strictEqual(scatterPlotChart.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for xAxis is valueAxis");
		assert.strictEqual(scatterPlotChart.getParameter().measures[1].axisfeedItemId, "valueAxis2", 
				"Then axis feedItemId for yAxis is valueAxis2");
		assert.deepEqual(requiredParameter.alternateRepresentationType, scatterPlotChart.getAlternateRepresentation(), 
				"Then required Parameter of alternate representation same as return parameter of representation from chart");
		assert.deepEqual(_getSampleData(), scatterPlotChart.getData(), "Then Data available for chart to plot");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("YearMonth"), scatterPlotChart.getMetaData().getPropertyMetadata("YearMonth"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("DebitAmtInDisplayCrcy_E"), scatterPlotChart.getMetaData().getPropertyMetadata("DebitAmtInDisplayCrcy_E"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("OverdueDebitAmtInDisplayCrcy_E"), scatterPlotChart.getMetaData().getPropertyMetadata("OverdueDebitAmtInDisplayCrcy_E"), 
				"Then metadata available for data");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(scatterPlotChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, 
				"Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "scatter", "Then mainContent is a scatterplot chart");
		assert.strictEqual(scatterPlotChart.thumbnailChart.getVizType(), "scatter", "Then thumbnailcontent has scatterplot chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(formatterForMeasureSpy.calledTwice, true, "Then Required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledTwice, true, "Then Required method called for checking all measures has same unit");
	}
	function _commonSetupForCreatingChart(requiredParameter) {
		formatterForMeasureSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
		attachSelectionFormatSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
		isAllMeasureSameUnitSpy = sinon.spy(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");
		scatterPlotChart = new sap.apf.ui.representations.scatterPlotChart(oGlobalApi.oApi, requiredParameter);
		scatterPlotChart.setData(_getSampleData(), _getSampleMetadata());
		return scatterPlotChart;
	}
	function _checkForAfterDestroy(assert) {
		assert.strictEqual(scatterPlotChart.dataset, null, "After destroy dataset is null");
		assert.strictEqual(scatterPlotChart.oDataSetHelper, null, "After destroy Dataset Helper is null");
		assert.strictEqual(scatterPlotChart.formatter, null, " After destroy formatter is null");
		assert.strictEqual(scatterPlotChart.UI5ChartHelper, null, " After destroy UI5ChartHelper is null");
		assert.strictEqual(scatterPlotChart.fnHandleSelection, null, " After destroy selection function is null");
		assert.strictEqual(scatterPlotChart.fnHandleDeselection, null, "After destroy deselection function is null");
		assert.strictEqual(scatterPlotChart.chart, null, "After destroy mainChart is null");
		assert.strictEqual(scatterPlotChart.thumbnailChart, null, "After destroy thumbnailchart is null");
		assert.deepEqual(scatterPlotChart.thumbnailLayout.getContent(), [], "After destroy thumbnailLayout is empty");
	}
	QUnit.module("ScatterPlot Chart Tests - Basic Check", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.dimensions = _getDimensionForScatter();
			requiredParameter.measures = _getMeasureForScatter();
			scatterPlotChart = _commonSetupForCreatingChart(requiredParameter);
		},
		afterEach : function(assert) {
			oGlobalApi.oCompContainer.destroy();
			scatterPlotChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When ScatterPlotChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		//arrange
		var vizPropOnChart = representationHelper.getVizPropertiesJSONOnChart();
		var vizPropOnThumbnailChart = representationHelper.getVizPropertiesJSONOnThumbnail();
		vizPropOnChart.plotArea.adjustScale = true;
		vizPropOnChart.sizeLegend = {
			visible : true
		};
		vizPropOnChart.tooltip.formatString = "#,#0.00";
		vizPropOnChart.valueAxis.label.formatString = "#,#0.00";
		vizPropOnChart.valueAxis2 = {
			label : {
				formatString : "#,#0.00",
				visible : true
			},
			title : {
				visible : true
			},
			visible : true
		};
		vizPropOnThumbnailChart.plotArea.adjustScale = true;
		vizPropOnThumbnailChart.plotArea.markerSize = 4;
		vizPropOnThumbnailChart.plotArea.marker = {
			visible : true,
			size : 4
		};
		vizPropOnThumbnailChart.sizeLegend = {
			visible : false
		};
		vizPropOnThumbnailChart.valueAxis2 = {
			visible : false,
			title : {
				visible : false
			}
		};
		//assert
		assert.deepEqual(scatterPlotChart.chart.getVizProperties(), vizPropOnChart, "Then vizProperties are applied to the chart");
		assert.deepEqual(scatterPlotChart.thumbnailChart.getVizProperties(), vizPropOnThumbnailChart, 
				"Then vizProperties are applied to the thumbnail chart");
		assert.strictEqual(scatterPlotChart.chart.getVizProperties().interaction.selectability.mode, 'none', 
				"Since requird filter is not defined so selectability mode of main chart is none");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = scatterPlotChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		//assert
		assert.strictEqual(printContentType.getVizType(), "scatter", "printContent is a scatterplot chart");
		assert.strictEqual(storedSelection, null, "Since nothing has been selected on chart" + " so selection on print content is null");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//arrange
		var expectedFilterValue = [ {
			"data" : {}
		} ];
		//act
		scatterPlotChart.deserialize({
			oFilter : [ {
				data : {}
			} ]
		});
		//assert
		assert.deepEqual(scatterPlotChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since nothing has been seleted so deserialized value is empty");
		//act
		scatterPlotChart.serialize();
		//assert
		assert.deepEqual(scatterPlotChart.UI5ChartHelper.filterValues, scatterPlotChart.serialize().oFilter, 
				"Since nothing has been seleted so serialized value is empty");
	});
	QUnit.module("ScatterPlot Chart Tests - When Datapoints are selected and deselected on Chart", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.dimensions = _getDimensionForScatter();
			requiredParameter.measures = _getMeasureForScatter();
			var requiredFilters = [ "YearMonth" ];
			requiredParameter.requiredFilters = requiredFilters;
			scatterPlotChart = _commonSetupForCreatingChart(requiredParameter);
			var mainContent = scatterPlotChart.getMainContent("sample Title", 600, 600);
			var thumbnailContent = scatterPlotChart.getThumbnailContent("sample Title", 600, 600);
			mainContent.placeAt('qunit-chart');
			thumbnailContent.placeAt('qunit-chart');
			sap.ui.getCore().applyChanges();
			var done = assert.async();
			mainContent.attachEventOnce('renderComplete', function() {
				scatterPlotChart.setSelectionOnMainChart(_getDataPointForSelection());
				done();
			});
			thumbnailContent.attachEventOnce('renderComplete', function() {
				scatterPlotChart.setSelectionOnThumbnailChart(_getDataPointForSelection());
				done();
			});
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			scatterPlotChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When ScatterPlotChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		var selectionCountOnMainChart = scatterPlotChart.getSelectionFromChart().length;
		var selectionCountOnThumbnailChart = scatterPlotChart.thumbnailChart.vizSelection().length;
		assert.strictEqual(2, selectionCountOnMainChart, "Then Selected two points on main chart");
		assert.strictEqual(2, selectionCountOnThumbnailChart, "Then Selected two points on thumbnail chart");
		assert.strictEqual(scatterPlotChart.chart.getVizProperties().interaction.selectability.mode, 'multiple', 
				"Since requird filter is defined so selectability mode is multiple");
	});
	QUnit.test("When switching between the charts", function(assert) {
		//act
		scatterPlotChart.adoptSelection(scatterPlotChart);
		//assert
		assert.strictEqual(scatterPlotChart.UI5ChartHelper.filterValues.length, _getDataPointForSelection().length, 
				"Then only selected filter values are passed");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = scatterPlotChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		var aExpectedSelection = _getDataPointForSelection();
		//assert
		assert.strictEqual(printContentType.getVizType(), "scatter", "Then printContent is a scatterplot chart");
		assert.strictEqual(storedSelection.length, aExpectedSelection.length, 
				"Then selected data points sending to the print content is same");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//act
		scatterPlotChart.deserialize({
			oFilter : [ {
				data : {
					"Debit in Display Currency (USD)" : 50518,
					"Overdue Debit in Display Currency (USD)" : 32336,
					"Year Month" : "201302"
				}
			}, {
				data : {
					"Debit in Display Currency (USD)" : 96971,
					"Overdue Debit in Display Currency (USD)" : 22340,
					"Year Month" : "201311"
				}
			} ]
		});
		//assert
		assert.deepEqual(scatterPlotChart.UI5ChartHelper.filterValues, _getDataPointForSelection(), 
				"Since two points got selected so selescted point is deserialized");
		//act
		scatterPlotChart.serialize();
		//assert
		assert.deepEqual(scatterPlotChart.UI5ChartHelper.filterValues, scatterPlotChart.serialize().oFilter, 
				"Since two points got selected so selected point is serialised");
	});
	QUnit.test("When Deselecting Data points", function(assert) {
		//arrange 
		var expectedFilterValue = [ {
			data : {
				"Debit in Display Currency (USD)" : 96971,
				"Overdue Debit in Display Currency (USD)" : 22340,
				"Year Month" : "201311"
			}
		} ];
		//act
		var mainContent = scatterPlotChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = scatterPlotChart.getThumbnailContent("sample Title", 600, 600);
		var deSelectionData = [ {
			data : {
				"Debit in Display Currency (USD)" : 96971,
				"Overdue Debit in Display Currency (USD)" : 22340,
				"Year Month" : "201311"
			}
		} ];
		mainContent.placeAt('qunit-chart');
		sap.ui.getCore().applyChanges();
		var done = assert.async();
		mainContent.attachEventOnce('renderComplete', function() {
			//assert
			scatterPlotChart.clearSelectionFromMainChart();
			scatterPlotChart.setSelectionOnMainChart(deSelectionData);
			var selectionCount = scatterPlotChart.getSelectionFromChart().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the chart");
			scatterPlotChart.clearSelectionFromMainChart();
			done();
		});
		thumbnailContent.attachEventOnce('renderComplete', function() {
			scatterPlotChart.clearSelectionThumbnailChart();
			scatterPlotChart.setSelectionOnThumbnailChart(deSelectionData);
			var selectionCount = scatterPlotChart.thumbnailChart.vizSelection().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the thumbnail chart");
			scatterPlotChart.clearSelectionThumbnailChart();
			done();
		});
		//act
		scatterPlotChart.deserialize({
			oFilter : [ {
				data : {
					"Debit in Display Currency (USD)" : 96971,
					"Overdue Debit in Display Currency (USD)" : 22340,
					"Year Month" : "201311"
				}
			} ]
		});
		assert.deepEqual(scatterPlotChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since only one point got selected so selcted point is deserialized");
		//act
		scatterPlotChart.serialize();
		//assert
		assert.deepEqual(scatterPlotChart.UI5ChartHelper.filterValues, scatterPlotChart.serialize().oFilter, 
				"Since only one point got selected so selcted point is serialized");
	});
	QUnit.module("ScatterPlot Chart Tests - With multiple parameters(Dimensions and measures)", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			scatterPlotChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When ScatterPlotChart is initialized with multiple parameters", function(assert) {
		//arrange
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForScatter();
		requiredParameter.measures = _getMeasureForScatter();
		var orderBy = [ {
			"descending" : true,
			"property" : "DebitAmtInDisplayCrcy_E"
		} ];
		requiredParameter.orderby = orderBy;
		scatterPlotChart = _commonSetupForCreatingChart(requiredParameter);
		var mainContent = scatterPlotChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = scatterPlotChart.getThumbnailContent();
		var paging = {
			"top" : "100"
		};
		var requestOptions = scatterPlotChart.getRequestOptions();
		//assert
		assert.strictEqual(requiredParameter.dimensions.length, scatterPlotChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, scatterPlotChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(scatterPlotChart.getParameter().dimensions[0].axisfeedItemId, "color", 
				"Then axis feedItemId for regionColor is color");
		assert.strictEqual(scatterPlotChart.getParameter().dimensions[1].axisfeedItemId, "shape", 
				"Then axis feedItemId for regionShape is shape");
		assert.strictEqual(scatterPlotChart.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for xAxis is valueAxis");
		assert.strictEqual(scatterPlotChart.getParameter().measures[1].axisfeedItemId, "valueAxis2", 
				"Then axis feedItemId for yAxis is valueAxis2");
		assert.deepEqual(requiredParameter.alternateRepresentationType, scatterPlotChart.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(scatterPlotChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, 
				"Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "scatter", "Then mainContent is a scatterplot chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(scatterPlotChart.thumbnailChart.getVizType(), "scatter", "Then thumbnailcontent has scatterplot chart");
		assert.strictEqual(Object.keys(requestOptions).length, 2, "Then it returns the request oprtion(orderby property & topN)");
		assert.deepEqual(requestOptions.orderby, orderBy, "Then order by property returns sorting informaton");
		assert.deepEqual(requestOptions.paging, paging, "Then topN returns top value");
		assert.strictEqual(formatterForMeasureSpy.calledTwice, true, "Then required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledTwice, true, "Then Required method called for checking all measures has same unit");
	});
	QUnit.test("When required filter is defined", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForScatter();
		requiredParameter.measures = _getMeasureForScatter();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		scatterPlotChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		scatterPlotChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(scatterPlotChart.chart.getVizProperties().interaction.selectability.mode, "multiple", 
				"Since required filter is avialable so selectabilty mode is set as multiple");
	});
	QUnit.test("When required parameter is same as second dimension(legend)", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForScatter();
		requiredParameter.measures = _getMeasureForScatter();
		var requiredFilters = [ "CustomerCountry" ];
		requiredParameter.requiredFilters = requiredFilters;
		scatterPlotChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		scatterPlotChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(scatterPlotChart.chart.getVizProperties().interaction.selectability.axisLabelSelection, false, 
				"Since required filter is same as second dimension so selectabilty for axis label is set as false");
	});
	QUnit.test("When required parameter is same as first dimension", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForScatter();
		requiredParameter.measures = _getMeasureForScatter();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		scatterPlotChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		scatterPlotChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(scatterPlotChart.chart.getVizProperties().interaction.selectability.legendSelection, false, 
				"Since requird filter is same as first dimension so Selectabilty for legend is set as false");
	});
	QUnit.module("ScatterPlot Chart Tests - When scatterplot chart is destroyed", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.dimensions = _getDimensionForScatter();
			requiredParameter.measures = _getMeasureForScatter();
			scatterPlotChart = _commonSetupForCreatingChart(requiredParameter);
			scatterPlotChart.getMainContent("sample Title", 600, 600);
			scatterPlotChart.getThumbnailContent();
			scatterPlotChart.destroy();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Scatterplot chart destroyed", function(assert) {
		//assert
		_checkForAfterDestroy(assert);
	});
})();
