
(function() {
	'use strict';
	
	jQuery.sap.declare("test.sap.apf.ui.representations.tbubbleChart");	
	jQuery.sap.registerModulePath("sap.apf.testhelper", "../../testhelper");

	jQuery.sap.require("sap.apf.testhelper.helper");
	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
	jQuery.sap.require("sap.apf.ui.instance");
	jQuery.sap.require("sap.apf.ui.representations.bubbleChart");
	jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerStubbedAjax");
	jQuery.sap.require("sap.apf.testhelper.config.representationHelper");
	
	var bubbleChart, oGlobalApi, attachSelectionFormatSpy, formatterForMeasureSpy, isAllMeasureSameUnitSpy, representationHelper, sampleData;
	function _getSampleMetadata() {
		return {
			getPropertyMetadata : representationHelper.setPropertyMetadataStub.call()
		};
	}
	function _getSampleData() {
		if (sampleData) {
			return sampleData;
		}
		sampleData = sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleDataForCharts');
		return sampleData;
	}
	function _getDataPointForSelection() {
		return [ {
			data : {
				"Debit in Display Currency (USD)" : 50518,
				"Overdue Debit in Display Currency (USD)" : 32336,
				"Revenue in Display Currency (USD)" : 50518,
				"Year Month" : "201302"
			}
		}, {
			data : {
				"Debit in Display Currency (USD)" : 96971,
				"Overdue Debit in Display Currency (USD)" : 22340,
				"Revenue in Display Currency (USD)" : 33240,
				"Year Month" : "201311"
			}
		} ];
	}
	function _getDimensionForBubble() {
		return [ {
			"fieldName" : "YearMonth",
			"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONCOLOR
		} ];
	}
	function _getMeasureForBubble() {
		return [ {
			"fieldName" : "DebitAmtInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.XAXIS
		}, {
			"fieldName" : "OverdueDebitAmtInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.YAXIS
		}, {
			"fieldName" : "RevenueAmountInDisplayCrcy_E",
			"kind" : sap.apf.core.constants.representationMetadata.kind.BUBBLEWIDTH
		} ];
	}
	function _getMultiDimensionForBubble() {
		return [ {
			"fieldName" : "CustomerCountry",
			"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONCOLOR
		}, {
			"fieldName" : "YearMonth",
			"kind" : sap.apf.core.constants.representationMetadata.kind.REGIONSHAPE
		} ];
	}
	function _commonInitializationAsserts(assert) {
		// arrange
		var requiredParameter = representationHelper.representatationDataWithDimension();
		requiredParameter.dimensions = _getDimensionForBubble();
		requiredParameter.measures = _getMeasureForBubble();
		var thumbnailContent = bubbleChart.getThumbnailContent();
		// act
		var mainContent = bubbleChart.getMainContent("sample Title", 600, 600);
		// assert
		assert.strictEqual(requiredParameter.dimensions.length, bubbleChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, bubbleChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(bubbleChart.getParameter().dimensions[0].axisfeedItemId, "color", 
				"Then axis feedItemId for regionColor is color");
		assert.strictEqual(bubbleChart.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for xAxis is valueAxis");
		assert.strictEqual(bubbleChart.getParameter().measures[1].axisfeedItemId, "valueAxis2", 
				"Then axis feedItemId for yAxis is valueAxis2");
		assert.strictEqual(bubbleChart.getParameter().measures[2].axisfeedItemId, "bubbleWidth", 
				"Then axis feedItemId for bubbleWidth is width");
		assert.deepEqual(requiredParameter.alternateRepresentationType, bubbleChart.getAlternateRepresentation(), 
				"Then required Parameter of alternate representation same as return parameter of representation from chart");
		assert.deepEqual(_getSampleData(), bubbleChart.getData(), "Then Data available for chart to plot");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("YearMonth"), bubbleChart.getMetaData().getPropertyMetadata("YearMonth"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("DebitAmtInDisplayCrcy_E"), bubbleChart.getMetaData().getPropertyMetadata("DebitAmtInDisplayCrcy_E"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("OverdueDebitAmtInDisplayCrcy_E"), bubbleChart.getMetaData().getPropertyMetadata("OverdueDebitAmtInDisplayCrcy_E"), 
				"Then metadata available for data");
		assert.deepEqual(_getSampleMetadata().getPropertyMetadata("RevenueAmountInDisplayCrcy_E"), bubbleChart.getMetaData().getPropertyMetadata("RevenueAmountInDisplayCrcy_E"), 
				"Then metadata available for data");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(bubbleChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, "Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "bubble", "Then mainContent is a Bubble chart");
		assert.strictEqual(bubbleChart.thumbnailChart.getVizType(), "bubble", "Then thumbnailcontent has Bubble chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(formatterForMeasureSpy.calledThrice, true, "Then Required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledThrice, true, "Then Required method called for checking all measures has same unit");
	}
	function _commonSetupForCreatingChart(requiredParameter) {
		formatterForMeasureSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
		attachSelectionFormatSpy = sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
		isAllMeasureSameUnitSpy = sinon.spy(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");
		bubbleChart = new sap.apf.ui.representations.bubbleChart(oGlobalApi.oApi, requiredParameter);
		bubbleChart.setData(_getSampleData(), _getSampleMetadata());
		return bubbleChart;
	}
	function _checkForAfterDestroy(assert) {
		assert.strictEqual(bubbleChart.dataset, null, "After destroy dataset is null");
		assert.strictEqual(bubbleChart.oDataSetHelper, null, "After destroy Dataset Helper is null");
		assert.strictEqual(bubbleChart.formatter, null, " After destroy formatter is null");
		assert.strictEqual(bubbleChart.UI5ChartHelper, null, " After destroy UI5ChartHelper is null");
		assert.strictEqual(bubbleChart.fnHandleSelection, null, " After destroy selection function is null");
		assert.strictEqual(bubbleChart.fnHandleDeselection, null, "After destroy deselection function is null");
		assert.strictEqual(bubbleChart.chart, null, "After destroy mainChart is null");
		assert.strictEqual(bubbleChart.thumbnailChart, null, "After destroy thumbnailchart is null");
		assert.deepEqual(bubbleChart.thumbnailLayout.getContent(), [], "After destroy thumbnailLayout is empty");
	}
	QUnit.module("Bubble Chart Tests - Basic Check", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.dimensions = _getDimensionForBubble();
			requiredParameter.measures = _getMeasureForBubble();
			bubbleChart = _commonSetupForCreatingChart(requiredParameter);
		},
		afterEach : function(assert) {
			oGlobalApi.oCompContainer.destroy();
			bubbleChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When BubbleChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		//arrange
		var vizPropOnChart = representationHelper.getVizPropertiesJSONOnChart();
		var vizPropOnThumbnailChart = representationHelper.getVizPropertiesJSONOnThumbnail();
		vizPropOnChart.plotArea.adjustScale = true;
		vizPropOnChart.sizeLegend = {
			formatString : "#,#0.00",
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
		assert.deepEqual(bubbleChart.chart.getVizProperties(), vizPropOnChart, "Then vizProperties are applied to the chart");
		assert.deepEqual(bubbleChart.thumbnailChart.getVizProperties(), vizPropOnThumbnailChart, 
				"Then vizProperties are applied to the thumbnail chart");
		assert.strictEqual(bubbleChart.chart.getVizProperties().interaction.selectability.mode, 'none', 
				"Since requird filter is not defined so selectability mode of main chart is none");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = bubbleChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		//assert
		assert.strictEqual(printContentType.getVizType(), "bubble", "printContent is a Bubble chart");
		assert.strictEqual(storedSelection, null, "Since nothing has been selected on chart" + " so selection on print content is null");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//arrange
		var expectedFilterValue = [ {
			"data" : {}
		} ];
		//act
		bubbleChart.deserialize({
			oFilter : [ {
				data : {}
			} ]
		});
		//assert
		assert.deepEqual(bubbleChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since nothing has been seleted so deserialized value is empty");
		//act
		var serializedData = bubbleChart.serialize();
		//assert
		assert.deepEqual(bubbleChart.UI5ChartHelper.filterValues, bubbleChart.serialize().oFilter, 
				"Since nothing has been seleted so serialized value is empty");
	});
	QUnit.module("Bubble Chart Tests - When Datapoints are selected and deselected on Chart", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.dimensions = _getDimensionForBubble();
			requiredParameter.measures = _getMeasureForBubble();
			var requiredFilters = [ "YearMonth" ];
			requiredParameter["requiredFilters"] = requiredFilters;
			bubbleChart = _commonSetupForCreatingChart(requiredParameter);
			var mainContent = bubbleChart.getMainContent("sample Title", 600, 600);
			var thumbnailContent = bubbleChart.getThumbnailContent("sample Title", 600, 600);
			mainContent.placeAt('qunit-chart');
			thumbnailContent.placeAt('qunit-chart');
			sap.ui.getCore().applyChanges();
			var done = assert.async();
			mainContent.attachEventOnce('renderComplete', function() {
				bubbleChart.setSelectionOnMainChart(_getDataPointForSelection());
				done();
			});
			thumbnailContent.attachEventOnce('renderComplete', function() {
				bubbleChart.setSelectionOnThumbnailChart(_getDataPointForSelection());
				done();
			});
		},
		afterEach : function() {
			bubbleChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When bubbleChart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(assert);
		var selectionCountOnMainChart = bubbleChart.getSelectionFromChart().length;
		var selectionCountOnThumbnailChart = bubbleChart.thumbnailChart.vizSelection().length;
		assert.strictEqual(2, selectionCountOnMainChart, "Then Selected two points on main chart");
		assert.strictEqual(2, selectionCountOnThumbnailChart, "Then Selected two points on thumbnail chart");
		assert.strictEqual(bubbleChart.chart.getVizProperties().interaction.selectability.mode, 'multiple', 
				"Since requird filter is defined so selectability mode is multiple");
	});
	QUnit.test("When switching between the charts", function(assert) {
		//act
		bubbleChart.adoptSelection(bubbleChart);
		//assert
		assert.strictEqual(bubbleChart.UI5ChartHelper.filterValues.length, _getDataPointForSelection().length, 
				"Then only selected filter values are passed");
	});
	QUnit.test("When Checking content type of print", function(assert) {
		//act
		var printContent = bubbleChart.getPrintContent("sample Title");
		var printContentType = printContent.oChartForPrinting;
		var storedSelection = printContent.aSelectionOnChart;
		var aExpectedSelection = _getDataPointForSelection();
		//assert
		assert.strictEqual(printContentType.getVizType(), "bubble", "Then printContent is a Bubble chart");
		assert.strictEqual(storedSelection.length, aExpectedSelection.length, 
				"Then selected data points sending to the print content is same");
	});
	QUnit.test("When Serialize and Deserialize the filters", function(assert) {
		//act
		bubbleChart.deserialize({
			oFilter : [ {
				data : {
					"Debit in Display Currency (USD)" : 50518,
					"Overdue Debit in Display Currency (USD)" : 32336,
					"Revenue in Display Currency (USD)" : 50518,
					"Year Month" : "201302"
				}
			}, {
				data : {
					"Debit in Display Currency (USD)" : 96971,
					"Overdue Debit in Display Currency (USD)" : 22340,
					"Revenue in Display Currency (USD)" : 33240,
					"Year Month" : "201311"
				}
			} ]
		});
		//assert
		assert.deepEqual(bubbleChart.UI5ChartHelper.filterValues, _getDataPointForSelection(), 
				"Since two points got selected so selescted point is deserialized");
		//act
		var serializedData = bubbleChart.serialize();
		//assert
		assert.deepEqual(bubbleChart.UI5ChartHelper.filterValues, bubbleChart.serialize().oFilter, 
				"Since two points got selected so selected point is serialised");
	});
	QUnit.test("When Deselecting Data points", function(assert) {
		//arrange 
		var expectedFilterValue = [ {
			data : {
				"Debit in Display Currency (USD)" : 96971,
				"Overdue Debit in Display Currency (USD)" : 22340,
				"Revenue in Display Currency (USD)" : 33240,
				"Year Month" : "201311"
			}
		} ];
		//act
		var mainContent = bubbleChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = bubbleChart.getThumbnailContent("sample Title", 600, 600);
		var deSelectionData = [ {
			data : {
				"Debit in Display Currency (USD)" : 96971,
				"Overdue Debit in Display Currency (USD)" : 22340,
				"Revenue in Display Currency (USD)" : 33240,
				"Year Month" : "201311"
			}
		} ];
		//act
		bubbleChart.deserialize({
			oFilter : [ {
				data : {
					"Debit in Display Currency (USD)" : 96971,
					"Overdue Debit in Display Currency (USD)" : 22340,
					"Revenue in Display Currency (USD)" : 33240,
					"Year Month" : "201311"
				}
			} ]
		});
		assert.deepEqual(bubbleChart.UI5ChartHelper.filterValues, expectedFilterValue, 
				"Since only one point got selected so selcted point is deserialized");
		//act
		var serializedData = bubbleChart.serialize();
		//assert
		assert.deepEqual(bubbleChart.UI5ChartHelper.filterValues, bubbleChart.serialize().oFilter, 
				"Since only one point got selected so selcted point is serialized");
	});
	QUnit.module("Bubble Chart Tests - With multiple parameters(Dimensions and measures)", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			bubbleChart.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When bubbleChart is initialized with multiple parameters", function(assert) {
		//arrange
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var orderBy = [ {
			"descending" : true,
			"property" : "RevenueAmountInDisplayCrcy_E"
		} ];
		requiredParameter.orderby = orderBy;
		requiredParameter.dimensions = _getMultiDimensionForBubble();
		requiredParameter.measures = _getMeasureForBubble();
		bubbleChart = _commonSetupForCreatingChart(requiredParameter);
		var mainContent = bubbleChart.getMainContent("sample Title", 600, 600);
		var thumbnailContent = bubbleChart.getThumbnailContent();
		var paging = {
			"top" : "100"
		};
		var requestOptions = bubbleChart.getRequestOptions();
		//assert
		assert.strictEqual(requiredParameter.dimensions.length, bubbleChart.getParameter().dimensions.length, 
				"Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, bubbleChart.getParameter().measures.length, 
				"Then required Parameter of measure same as return parameter of measure from chart");
		assert.strictEqual(bubbleChart.getParameter().dimensions[0].axisfeedItemId, "color", 
				"Then axis feedItemId for regionColor is color");
		assert.strictEqual(bubbleChart.getParameter().dimensions[1].axisfeedItemId, "shape", 
				"Then axis feedItemId for regionShape is shape");
		assert.strictEqual(bubbleChart.getParameter().measures[0].axisfeedItemId, "valueAxis", 
				"Then axis feedItemId for xAxis is valueAxis");
		assert.strictEqual(bubbleChart.getParameter().measures[1].axisfeedItemId, "valueAxis2", 
				"Then axis feedItemId for yAxis is valueAxis2");
		assert.strictEqual(bubbleChart.getParameter().measures[2].axisfeedItemId, "bubbleWidth", 
				"Then axis feedItemId for bubbleWidth is width");
		assert.deepEqual(requiredParameter.alternateRepresentationType, bubbleChart.getAlternateRepresentation(), 
				"Then required Parameter of alternaterepresentation same as return parameter of representation from chart");
		assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "Then mainContent is instance of a vizframe");
		assert.ok(bubbleChart.thumbnailChart instanceof sap.viz.ui5.controls.VizFrame, "Then thumbnail chart is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "bubble", "Then mainContent is a Bubble chart");
		assert.ok(thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "Then thumbnailContent is a layout");
		assert.strictEqual(bubbleChart.thumbnailChart.getVizType(), "bubble", "Then thumbnailcontent has Bubble chart");
		assert.strictEqual(Object.keys(requestOptions).length, 2, "Then it returns the request oprtion(orderby property & topN)");
		assert.deepEqual(requestOptions.orderby, orderBy, "Then order by property returns sorting informaton");
		assert.deepEqual(requestOptions.paging, paging, "Then topN returns top value");
		assert.strictEqual(formatterForMeasureSpy.calledThrice, true, "Then required method called for formatting measure");
		assert.strictEqual(attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(isAllMeasureSameUnitSpy.calledThrice, true, 
				"Then Required method called for checking all measures has same unit");
	});
	QUnit.test("When required filter is defined", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForBubble();
		requiredParameter.measures = _getMeasureForBubble();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter["requiredFilters"] = requiredFilters;
		bubbleChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		var mainContent = bubbleChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(bubbleChart.chart.getVizProperties().interaction.selectability.mode, "multiple", 
				"Since required filter is avialable so selectabilty mode is set as multiple");
	});
	QUnit.test("When required parameter is same as second dimension(legend)", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForBubble();
		requiredParameter.measures = _getMeasureForBubble();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter["requiredFilters"] = requiredFilters;
		bubbleChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		var mainContent = bubbleChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(bubbleChart.chart.getVizProperties().interaction.selectability.axisLabelSelection, false, 
				"Since required filter is same as second dimension so selectabilty for axis label is set as false");
	});
	QUnit.test("When required parameter is same as first dimension", function(assert) {
		//arrange 
		representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.dimensions = _getMultiDimensionForBubble();
		requiredParameter.measures = _getMeasureForBubble();
		var requiredFilters = [ "CustomerCountry" ];
		requiredParameter["requiredFilters"] = requiredFilters;
		bubbleChart = _commonSetupForCreatingChart(requiredParameter);
		//act
		var mainContent = bubbleChart.getMainContent("sample Title", 600, 600);
		//assert
		assert.strictEqual(bubbleChart.chart.getVizProperties().interaction.selectability.legendSelection, false, 
				"Since requird filter is same as first dimension so Selectabilty for legend is set as false");
	});
	QUnit.module("Bubble Chart Tests - When Bubble chart is destroyed", {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataWithDimension();
			requiredParameter.dimensions = _getDimensionForBubble();
			requiredParameter.measures = _getMeasureForBubble();
			bubbleChart = _commonSetupForCreatingChart(requiredParameter);
			var mainContent = bubbleChart.getMainContent("sample Title", 600, 600);
			var thumbnailContent = bubbleChart.getThumbnailContent();
			bubbleChart.destroy();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			formatterForMeasureSpy.restore();
			attachSelectionFormatSpy.restore();
			isAllMeasureSameUnitSpy.restore();
		}
	});
	QUnit.test("When Bubble chart destroyed", function(assert) {
		//assert
		_checkForAfterDestroy(assert);
	});
})();
