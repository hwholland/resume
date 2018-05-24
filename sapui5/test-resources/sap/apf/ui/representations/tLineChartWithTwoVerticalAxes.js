(function() {
	'use strict';

	jQuery.sap.declare("test.sap.apf.ui.representations.tLineChartWithTwoVerticalAxes");

	jQuery.sap.registerModulePath("sap.apf.testhelper", "../../testhelper");

	jQuery.sap.require("sap.apf.testhelper.helper");
	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
	jQuery.sap.require("sap.apf.ui.representations.lineChartWithTwoVerticalAxes");
	jQuery.sap.require("sap.apf.testhelper.config.representationHelper");

	var lineChartWithTwoVerticalAxes, oGlobalApi, attachSelectionFormatSpy, formatterForMeasureSpy, isAllMeasureSameUnitSpy, representationHelper;
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
				"Year Month" : "201302"
			}
		}, {
			data : {
				"Overdue Debit in Display Currency (USD)" : 32336,
				"Year Month" : "201302"
			}
		} ];
	}
	function _getMeasureForDualLine() {
		return [ {
			"fieldName" : "DebitAmtInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
		}, {
			"fieldName" : "OverdueDebitAmtInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS2
		} ];
	}
	function _getMultiDimensionForDualLine() {
		return [ {
			"fieldName" : "YearMonth",
			"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
		}, {
			"fieldName" : "CustomerCountry",
			"kind" : sap.apf.core.constants.representationMetadata.kind.LEGEND
		} ];
	}
	function _getMultiMeasureForDualLine() {
		return [ {
			"fieldName" : "DebitAmtInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
		}, {
			"fieldName" : "OverdueDebitAmtInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS2
		} ];
	}
	function _commonInitializationAsserts(assert) {
		// arrange
		var requiredParameter = representationHelper.representatationDataWithDimension();
		requiredParameter.measures = _getMeasureForDualLine();
		var thumbnailContent = lineChartWithTwoVerticalAxes.getThumbnailContent();
		// act
		var mainContent = lineChartWithTwoVerticalAxes.getMainContent("sample Title", 600, 600);
		// assert
		assert.strictEqual(requiredParameter.dimensions.length, lineChartWithTwoVerticalAxes.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, lineChartWithTwoVerticalAxes.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(lineChartWithTwoVerticalAxes.getParameter().dimensions[0].axisfeedItemId, "categoryAxis", 
				"Then axis feedItemId for xAxis is categoryAxis");
		assert.strictEqual(lineChartWithTwoVerticalAxes.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for yAxis is valueAxis");
		assert.strictEqual(lineChartWithTwoVerticalAxes.getParameter().measures[1].axisfeedItemId, "valueAxis2", 
				"Then axis feedItemId for yAxis2 is valueAxis2");
		assert.deepEqual(requiredParameter.alternateRepresentationType, lineChartWithTwoVerticalAxes.getAlternateRepresentation(), 
				"Then required Parameter of alternate representation same as return parameter of representation from chart");
		assert.deepEqual(_getSampleData(), lineChartWithTwoVerticalAxes.getData(), "Then Data available for chart to plot");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("YearMonth"), lineChartWithTwoVerticalAxes.getMetaData().getPropertyMetadata("YearMonth"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("DebitAmtInDisplayCrcy_E"), lineChartWithTwoVerticalAxes.getMetaData().getPropertyMetadata("DebitAmtInDisplayCrcy_E"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("OverdueDebitAmtInDisplayCrcy_E"), lineChartWithTwoVerticalAxes.getMetaData().getPropertyMetadata("OverdueDebitAmtInDisplayCrcy_E"), 
				"Then metadata available for data");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(lineChartWithTwoVerticalAxes.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, 
				"Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "dual_line", "Then mainContent is a Dual Line chart");
		assert.strictEqual(lineChartWithTwoVerticalAxes.thumbnailChart.getVizType(), "dual_line", 
				"Then thumbnailcontent has Dual Line chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(formatterForMeasureSpy.calledTwice, true, "Then Required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledTwice, true, "Then Required method called for checking all measures has same unit");
	}
	function _commonSetupForCreatingChart(requiredParameter) {
		formatterForMeasureSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
		attachSelectionFormatSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
		isAllMeasureSameUnitSpy = sinon.spy(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");
		lineChartWithTwoVerticalAxes = new sap.apf.ui.representations.lineChartWithTwoVerticalAxes(oGlobalApi.oApi, requiredParameter);
		lineChartWithTwoVerticalAxes.setData(_getSampleData(), _getSampleMetadata());
		return lineChartWithTwoVerticalAxes;
	}
	function _checkForAfterDestroy(assert) {
		assert.strictEqual(lineChartWithTwoVerticalAxes.dataset, null, "After destroy dataset is null");
		assert.strictEqual(lineChartWithTwoVerticalAxes.oDataSetHelper, null, "After destroy Dataset Helper is null");
		assert.strictEqual(lineChartWithTwoVerticalAxes.formatter, null, " After destroy formatter is null");
		assert.strictEqual(lineChartWithTwoVerticalAxes.UI5ChartHelper, null, " After destroy UI5ChartHelper is null");
		assert.strictEqual(lineChartWithTwoVerticalAxes.fnHandleSelection, null, " After destroy selection function is null");
		assert.strictEqual(lineChartWithTwoVerticalAxes.fnHandleDeselection, null, "After destroy deselection function is null");
		assert.strictEqual(lineChartWithTwoVerticalAxes.chart, null, "After destroy mainChart is null");
		assert.strictEqual(lineChartWithTwoVerticalAxes.thumbnailChart, null, "After destroy thumbnailchart is null");
		assert.deepEqual(lineChartWithTwoVerticalAxes.thumbnailLayout.getContent(), [], "After destroy thumbnailLayout is empty");
	}
	QUnit.module("Dual Line Chart Tests - Basic Check", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.measures = _getMeasureForDualLine();
			lineChartWithTwoVerticalAxes = _commonSetupForCreatingChart(requiredParameter);
		},
		afterEach : function(assert) {
			oGlobalApi.oCompContainer.destroy();
			lineChartWithTwoVerticalAxes.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Dual Line Chart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		//arrange
		var vizPropOnChart = representationHelper.getVizPropertiesJSONOnChart();
		var vizPropOnThumbnailChart = representationHelper.getVizPropertiesJSONOnThumbnail();
		vizPropOnChart.plotArea.primaryValuesColorPalette = [ "#FF0000", "#9400D3" ];
		vizPropOnChart.plotArea.secondaryValuesColorPalette = [ "#0000FF", "#008000" ];
		vizPropOnChart.tooltip.formatString = "#,#0.00";
		vizPropOnChart.valueAxis = {
			label : {
				formatString : "#,#0.00",
				visible : true
			},
			title : {
				style : {
					color : "#000000"
				},
				visible : true
			},
			visible : true
		};
		vizPropOnChart.valueAxis2 = {
			label : {
				formatString : "#,#0.00",
				visible : true
			},
			title : {
				visible : true,
				style : {
					color : "#000000"
				}
			},
			visible : true
		};
		vizPropOnThumbnailChart.plotArea.primaryValuesColorPalette = [ "#FF0000", "#9400D3" ];
		vizPropOnThumbnailChart.plotArea.secondaryValuesColorPalette = [ "#0000FF", "#008000" ];
		vizPropOnThumbnailChart.valueAxis2 = {
			visible : false,
			title : {
				visible : false
			}
		};
		//assert
		assert.deepEqual(lineChartWithTwoVerticalAxes.chart.getVizProperties(), vizPropOnChart, 
				"Then vizProperties are applied to the chart");
		assert.deepEqual(lineChartWithTwoVerticalAxes.thumbnailChart.getVizProperties(), vizPropOnThumbnailChart, 
				"Then vizProperties are applied to the thumbnail chart");
		assert.strictEqual(lineChartWithTwoVerticalAxes.chart.getVizProperties().interaction.selectability.mode, 'none', 
				"Since requird filter is not defined so selectability mode of main chart is none");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = lineChartWithTwoVerticalAxes.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		//assert
		assert.strictEqual(printContentType.getVizType(), "dual_line", "printContent is a Dual Line chart");
		assert.strictEqual(storedSelection, null, "Since nothing has been selected on chart" + " so selection on print content is null");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//arrange
		var expectedFilterValue = [ {
			"data" : {}
		} ];
		//act
		lineChartWithTwoVerticalAxes.deserialize({
			oFilter : [ {
				data : {}
			} ]
		});
		//assert
		assert.deepEqual(lineChartWithTwoVerticalAxes.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since nothing has been seleted so deserialized value is empty");
		//act
		lineChartWithTwoVerticalAxes.serialize();
		//assert
		assert.deepEqual(lineChartWithTwoVerticalAxes.UI5ChartHelper.filterValues, lineChartWithTwoVerticalAxes.serialize().oFilter, 
				"Since nothing has been seleted so serialized value is empty");
	});
	QUnit.module("Dual Line Chart Tests - When Datapoints are selected and deselected on Chart", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.measures = _getMeasureForDualLine();
			var requiredFilters = [ "YearMonth" ];
			requiredParameter.requiredFilters = requiredFilters;
			lineChartWithTwoVerticalAxes = _commonSetupForCreatingChart(requiredParameter);
			var mainContent = lineChartWithTwoVerticalAxes.getMainContent("sample Title", 600, 600);
			var thumbnailContent = lineChartWithTwoVerticalAxes.getThumbnailContent("sample Title", 600, 600);
			mainContent.placeAt('qunit-chart');
			thumbnailContent.placeAt('qunit-chart');
			sap.ui.getCore().applyChanges();
			var done = assert.async();
			mainContent.attachEventOnce('renderComplete', function() {
				lineChartWithTwoVerticalAxes.setSelectionOnMainChart(_getDataPointForSelection());
				done();
			});
			thumbnailContent.attachEventOnce('renderComplete', function() {
				lineChartWithTwoVerticalAxes.setSelectionOnThumbnailChart(_getDataPointForSelection());
				done();
			});
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			lineChartWithTwoVerticalAxes.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Dual Line Chart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		var selectionCountOnMainChart = lineChartWithTwoVerticalAxes.getSelectionFromChart().length;
		var selectionCountOnThumbnailChart = lineChartWithTwoVerticalAxes.thumbnailChart.vizSelection().length;
		assert.strictEqual(2, selectionCountOnMainChart, "Then Selected two points on main chart");
		assert.strictEqual(2, selectionCountOnThumbnailChart, "Then Selected two points on thumbnail chart");
		assert.strictEqual(lineChartWithTwoVerticalAxes.chart.getVizProperties().interaction.selectability.mode, 'multiple', 
				"Since requird filter is defined so selectability mode is multiple");
	});
	QUnit.test("When switching between the charts", function(assert) {
		//act
		lineChartWithTwoVerticalAxes.adoptSelection(lineChartWithTwoVerticalAxes);
		//assert
		assert.strictEqual(lineChartWithTwoVerticalAxes.UI5ChartHelper.filterValues.length, _getDataPointForSelection().length - 1, 
				"Then only selected filter values are passed");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = lineChartWithTwoVerticalAxes.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		var aExpectedSelection = _getDataPointForSelection();
		//assert
		assert.strictEqual(printContentType.getVizType(), "dual_line", "Then printContent is a Dual Line Chart");
		assert.strictEqual(storedSelection.length, aExpectedSelection.length, 
				"Then selected data points sending to the print content is same");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//act
		lineChartWithTwoVerticalAxes.deserialize({
			oFilter : [ {
				data : {
					"Debit in Display Currency (USD)" : 50518,
					"Year Month" : "201302"
				}
			}, {
				data : {
					"Overdue Debit in Display Currency (USD)" : 32336,
					"Year Month" : "201302"
				}
			} ]
		});
		//assert
		assert.deepEqual(lineChartWithTwoVerticalAxes.UI5ChartHelper.filterValues, _getDataPointForSelection(), 
				"Since two points got selected so selescted point is deserialized");
		//act
		lineChartWithTwoVerticalAxes.serialize();
		//assert
		assert.deepEqual(lineChartWithTwoVerticalAxes.UI5ChartHelper.filterValues, lineChartWithTwoVerticalAxes.serialize().oFilter, 
				"Since two points got selected so selected point is serialised");
	});
	QUnit.test("When Deselecting Data points", function(assert) {
		//arrange 
		var expectedFilterValue = [ {
			data : {
				"Debit in Display Currency (USD)" : 96971,
				"Year Month" : "201311"
			}
		} ];
		//act
		var mainContent = lineChartWithTwoVerticalAxes.getMainContent("sample Title", 600, 600);
		var thumbnailContent = lineChartWithTwoVerticalAxes.getThumbnailContent("sample Title", 600, 600);
		var deSelectionData = [ {
			data : {
				"Debit in Display Currency (USD)" : 96971,
				"Year Month" : "201311"
			}
		} ];
		mainContent.placeAt('qunit-chart');
		sap.ui.getCore().applyChanges();
		var done = assert.async();
		mainContent.attachEventOnce('renderComplete', function() {
			//assert
			lineChartWithTwoVerticalAxes.clearSelectionFromMainChart();
			lineChartWithTwoVerticalAxes.setSelectionOnMainChart(deSelectionData);
			var selectionCount = lineChartWithTwoVerticalAxes.getSelectionFromChart().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the chart");
			lineChartWithTwoVerticalAxes.clearSelectionFromMainChart();
			done();
		});
		thumbnailContent.attachEventOnce('renderComplete', function() {
			lineChartWithTwoVerticalAxes.clearSelectionThumbnailChart();
			lineChartWithTwoVerticalAxes.setSelectionOnThumbnailChart(deSelectionData);
			var selectionCount = lineChartWithTwoVerticalAxes.thumbnailChart.vizSelection().length;
			assert.strictEqual(1, selectionCount, "Then deselecting one of the points in the thumbnail chart");
			lineChartWithTwoVerticalAxes.clearSelectionThumbnailChart();
			done();
		});
		//act
		lineChartWithTwoVerticalAxes.deserialize({
			oFilter : [ {
				data : {
					"Debit in Display Currency (USD)" : 96971,
					"Year Month" : "201311"
				}
			} ]
		});
		assert.deepEqual(lineChartWithTwoVerticalAxes.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since only one point got selected so selcted point is deserialized");
		//act
		lineChartWithTwoVerticalAxes.serialize();
		//assert
		assert.deepEqual(lineChartWithTwoVerticalAxes.UI5ChartHelper.filterValues, lineChartWithTwoVerticalAxes.serialize().oFilter, 
				"Since only one point got selected so selcted point is serialized");
	});
	QUnit.module("Dual Line Chart Tests - With multiple parameters(Dimensions and measures)", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			lineChartWithTwoVerticalAxes.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Dual Line Chart is initialized with multiple parameters", function(assert) {
		//arrange
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var orderBy = [ {
			"descending" : true,
			"property" : "DebitAmtInDisplayCrcy_E"
		} ];
		requiredParameter.dimensions = _getMultiDimensionForDualLine();
		requiredParameter.measures = _getMultiMeasureForDualLine();
		requiredParameter.orderby = orderBy;
		lineChartWithTwoVerticalAxes = _commonSetupForCreatingChart(requiredParameter);
		var mainContent = lineChartWithTwoVerticalAxes.getMainContent("sample Title", 600, 600);
		var thumbnailContent = lineChartWithTwoVerticalAxes.getThumbnailContent();
		var paging = {
			"top" : "100"
		};
		var requestOptions = lineChartWithTwoVerticalAxes.getRequestOptions();
		//assert
		assert.strictEqual(requiredParameter.dimensions.length, lineChartWithTwoVerticalAxes.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, lineChartWithTwoVerticalAxes.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(lineChartWithTwoVerticalAxes.getParameter().dimensions[0].axisfeedItemId, "categoryAxis", 
				"Then axis feedItemId for xAxis is categoryAxis");
		assert.strictEqual(lineChartWithTwoVerticalAxes.getParameter().dimensions[1].axisfeedItemId, "color", 
				"Then axis feedItemId for legend is color");
		assert.strictEqual(lineChartWithTwoVerticalAxes.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for yAxis is valueAxis");
		assert.strictEqual(lineChartWithTwoVerticalAxes.getParameter().measures[1].axisfeedItemId, "valueAxis2", 
				"Then axis feedItemId for yAxis2 is valueAxis2");
		assert.deepEqual(requiredParameter.alternateRepresentationType, lineChartWithTwoVerticalAxes.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(lineChartWithTwoVerticalAxes.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, 
				"Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "dual_line", "Then mainContent is a dual line chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(lineChartWithTwoVerticalAxes.thumbnailChart.getVizType(), "dual_line", 
				"Then thumbnailcontent has dual line chart");
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
		requiredParameter.dimensions = _getMultiDimensionForDualLine();
		requiredParameter.measures = _getMultiMeasureForDualLine();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		lineChartWithTwoVerticalAxes = _commonSetupForCreatingChart(requiredParameter);
		//act
		lineChartWithTwoVerticalAxes.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(lineChartWithTwoVerticalAxes.chart.getVizProperties().interaction.selectability.mode, "multiple", 
				"Since required filter is avialable so selectabilty mode is set as multiple");
	});
	QUnit.test("When required parameter is same as second dimension(legend)", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForDualLine();
		requiredParameter.measures = _getMultiMeasureForDualLine();
		var requiredFilters = [ "CustomerCountry" ];
		requiredParameter.requiredFilters = requiredFilters;
		lineChartWithTwoVerticalAxes = _commonSetupForCreatingChart(requiredParameter);
		//act
		lineChartWithTwoVerticalAxes.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(lineChartWithTwoVerticalAxes.chart.getVizProperties().interaction.selectability.axisLabelSelection, false, 
				"Since required filter is same as second dimension so selectabilty for axis label is set as false");
	});
	QUnit.test("When required parameter is same as first dimension", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForDualLine();
		requiredParameter.measures = _getMultiMeasureForDualLine();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		lineChartWithTwoVerticalAxes = _commonSetupForCreatingChart(requiredParameter);
		//act
		lineChartWithTwoVerticalAxes.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(lineChartWithTwoVerticalAxes.chart.getVizProperties().interaction.selectability.legendSelection, false, 
				"Since requird filter is same as first dimension so Selectabilty for legend is set as false");
	});
	QUnit.module("Dual Line Chart Tests - When scatterplot chart is destroyed", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.measures = _getMeasureForDualLine();
			lineChartWithTwoVerticalAxes = _commonSetupForCreatingChart(requiredParameter);
			lineChartWithTwoVerticalAxes.getMainContent("sample Title", 600, 600);
			lineChartWithTwoVerticalAxes.getThumbnailContent();
			lineChartWithTwoVerticalAxes.destroy();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Dual Line chart destroyed", function(assert) {
		//assert
		_checkForAfterDestroy(assert);
	});
})();
