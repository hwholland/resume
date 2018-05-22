(function() {
	"use strict";

	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
	if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
		jQuery.sap.require("sap.ui.qunit.qunit-coverage");
	}
	jQuery.sap.declare('test.sap.apf.ui.representations.BarChart');

	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');

	jQuery.sap.require("sap.apf.testhelper.helper");
	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
	jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerStubbedAjax");
	jQuery.sap.require('sap.apf.ui.instance');
	jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");

	/**
	 * @class barChart constructor.
	 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
	 * @returns chart object
	 */
	test.sap.apf.ui.representations.BarChart = function(oApi, oParameters) {
		sap.apf.ui.representations.BaseVizChartRepresentation.apply(this, [ oApi, oParameters ]);
		this.type = "BarChart";
		this.chartType = "Bar";
	};
	test.sap.apf.ui.representations.BarChart.prototype = Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);
	//Set the "constructor" property to refer to barChart
	test.sap.apf.ui.representations.BarChart.prototype.constructor = test.sap.apf.ui.representations.BarChart;
	test.sap.apf.ui.representations.BarChart.prototype.handleCustomFormattingOnChart = function() {
		var aMeasure = sap.apf.ui.representations.BaseVizChartRepresentation.prototype.getMeasures.call(this);
		var sFormatString = sap.apf.ui.representations.BaseVizChartRepresentation.prototype.getFormatStringForMeasure.call(this, aMeasure[0]); //get the format string from base class
		sap.apf.ui.representations.BaseVizChartRepresentation.prototype.setFormatString.call(this, "xAxis", sFormatString);
	};
	QUnit.module("Viz Bar Chart Tests", {
		beforeEach : function(assert) {
			var inject = {
					SessionHandler : sap.apf.testhelper.doubles.sessionHandlerStubbedAjax
			};
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi(undefined, undefined, inject);
			this.parameter = {
				"dimensions" : [ {
					"fieldName" : "CompanyCodeCountry"
				} ],
				"measures" : [ {
					"fieldName" : "RevenueAmountInDisplayCrcy_E"
				}, {
					"fieldName" : "DaysSalesOutstanding"
				} ],
				"requiredFilters" : [ "CompanyCodeCountry" ],
				"alternateRepresentationType" : {
					"type" : "representationType",
					"id" : "table",
					"constructor" : "sap.apf.ui.representations.table",
					"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "table"
					}
				}
			};
			this.vizBarChart = new test.sap.apf.ui.representations.BarChart(this.oGlobalApi.oApi, this.parameter);
			this.sampleData = sap.apf.testhelper.odata.getSampleService(this.oGlobalApi.oApi, 'sampleData');
			var getPropertyMetadataStub = sinon.stub();
			getPropertyMetadataStub.withArgs("CompanyCodeCountry").returns({
				"dataType" : {
					"maxLength" : "10",
					"type" : "Edm.String"
				},
				"label" : "Company Code Country",
				"name" : "CompanyCodeCountry"
			});
			getPropertyMetadataStub.withArgs("DaysSalesOutstanding").returns({
				"dataType" : {
					"maxLength" : "10",
					"type" : "Edm.Int32"
				},
				"label" : "Days Sales Outstanding",
				"name" : "DaysSalesOutstanding"
			});
			getPropertyMetadataStub.withArgs("BestPossibleDaysSalesOutstndng").returns({
				"dataType" : {
					"maxLength" : "10",
					"type" : "Edm.Int32"
				},
				"label" : "Best Possible Day Sales Outstanding",
				"name" : "BestPossibleDaysSalesOutstndng"
			});
			getPropertyMetadataStub.withArgs("YearMonth").returns({
				"dataType" : {
					"maxLength" : "8",
					"type" : "Edm.String"
				},
				"label" : "Year Month",
				"name" : "YearMonth"
			});
			getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E").returns({
				"ISOCurrency" : "DisplayCurrency",
				"label" : "Revenue in Display Currency",
				"name" : "RevenueAmountInDisplayCrcy_E",
				"scale" : "DisplayCurrencyDecimals",
				"unit" : "RevenueAmountInDisplayCrcy_E.CURRENCY",
				"dataType" : {
					"precision" : "34",
					"type" : "Edm.Decimal"
				}
			});
			getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E.CURRENCY").returns({
				"name" : "RevenueAmountInDisplayCrcy_E.CURRENCY",
				"semantics" : "currency-code",
				"dataType" : {
					"precision" : "5",
					"type" : "Edm.String"
				}
			});
			getPropertyMetadataStub.withArgs("OverdueDebitAmtInDisplayCrcy_E").returns({
				"ISOCurrency" : "DisplayCurrency",
				"label" : "Overdue Debit in Display Currency",
				"name" : "OverdueDebitAmtInDisplayCrcy_E",
				"scale" : "DisplayCurrencyDecimals",
				"unit" : "OverdueDebitAmtInDisplayCrcy_E.CURRENCY",
				"dataType" : {
					"precision" : "34",
					"type" : "Edm.Decimal"
				}
			});
			getPropertyMetadataStub.withArgs("OverdueDebitAmtInDisplayCrcy_E.CURRENCY").returns({
				"name" : "OverdueDebitAmtInDisplayCrcy_E.CURRENCY",
				"semantics" : "currency-code",
				"dataType" : {
					"precision" : "5",
					"type" : "Edm.String"
				}
			});
			getPropertyMetadataStub.withArgs("DebitAmtInDisplayCrcy_E").returns({
				"ISOCurrency" : "DisplayCurrency",
				"label" : "Debit in Display Currency",
				"name" : "DebitAmtInDisplayCrcy_E",
				"scale" : "DisplayCurrencyDecimals",
				"unit" : "DebitAmtInDisplayCrcy_E.CURRENCY",
				"dataType" : {
					"precision" : "34",
					"type" : "Edm.Decimal"
				}
			});
			getPropertyMetadataStub.withArgs("DebitAmtInDisplayCrcy_E.CURRENCY").returns({
				"name" : "DebitAmtInDisplayCrcy_E.CURRENCY",
				"semantics" : "currency-code",
				"dataType" : {
					"precision" : "5",
					"type" : "Edm.String"
				}
			});
			this.sampleMetadata = {
				getPropertyMetadata : getPropertyMetadataStub
			};
			this.vizBarChart.setData(this.sampleData, this.sampleMetadata);
			this.thumbnailContent = this.vizBarChart.getThumbnailContent();
			this.printContent = this.vizBarChart.getPrintContent("sample Title").oChartForPrinting;
			this.mainContent = this.vizBarChart.getMainContent("sample Title", 100, 100);
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();

		}
	});
	QUnit.test("getParameter", function(assert) {
		var parameter = this.vizBarChart.getParameter();
		assert.equal(this.parameter, parameter, "getParamter returns parameters");
	});
	QUnit.test("Data handling in Representation", function(assert) {
		this.vizBarChart.setData(this.sampleData, this.sampleMetadata);
		var getData = this.vizBarChart.getData();
		assert.equal(this.sampleData, getData, "Data available in representation.");
		var metadata = this.vizBarChart.getMetaData();
		assert.equal(this.sampleMetadata, metadata, "getMetaData returns metadata");
	});
	QUnit.test("alternative representation", function(assert) {
		var alternateRepresentationType = this.vizBarChart.getAlternateRepresentation();
		assert.equal(this.parameter.alternateRepresentationType, alternateRepresentationType, "getAlterlternateRepresentation returns alternate representation");
	});
	QUnit.test('If no request option are set', function(assert) {
		var requestOptions = this.vizBarChart.getRequestOptions();
		assert.equal(Object.keys(requestOptions).length, 0, 'Nothing is returned');
	});
	QUnit.test("If top request option is set", function(assert) {
		this.vizBarChart.topN = 5;	
		var requestOptionsWithTopN = this.vizBarChart.getRequestOptions();
		assert.equal(requestOptionsWithTopN.paging.top, 5, "Correct value returned");
	});	
	QUnit.test("content type", function(assert) {
		assert.ok(this.mainContent instanceof sap.viz.ui5.Bar, "mainContent is instance of a viz bar chart");
		assert.strictEqual(this.mainContent.getVIZChartType(), "viz/bar", "mainContent is a viz bar chart");
		assert.ok(this.printContent instanceof sap.viz.ui5.Bar, "printContent is instance of a vizframe");
		assert.strictEqual(this.printContent.getVIZChartType(), "viz/bar", "printContent is a viz bar chart");
		assert.ok(this.thumbnailContent instanceof sap.ui.layout.HorizontalLayout, "thumbnailContent is a layout");
	});
	QUnit.test("empty selection", function(assert) {
		var selectionCount = this.vizBarChart.getSelections().length;
		assert.equal(0, selectionCount, "no selection done");
		var filter = this.vizBarChart.getFilter();
		assert.equal(filter.getExpressions().length, 0, "no filter set");
		var filterMethodType = this.vizBarChart.getFilterMethodType();
		assert.equal("f", filterMethodType, "get filter method type");
	});
	QUnit.test("serialize data", function(assert) {
		this.vizBarChart.deserialize({
			oFilter : []
		});
		var serializedData = this.vizBarChart.serialize();
		assert.equal(serializedData.oFilter.length, 0, "get serialized data returns empty object");
	});
	QUnit.test("Rendering test", function(assert) {
		this.mainContent.placeAt('qunit-fixture');
		sap.ui.getCore().applyChanges();
		assert.ok(document.getElementById('qunit-fixture').children.length > 0, "Chart is rendered.");
	});
	QUnit.test("validateSelectionModes", function(assert) {
		this.vizBarChart.validateSelectionModes();
		assert.equal(this.vizBarChart.chart.getInteraction().getSelectability().getMode(), "multiple", "Selectabilty mode is set as multiple");
		this.parameterWithMultipleDimensions1 = {//Number of dimensions increased for test coverage; Required filter changed
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "YearMonth"
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			} ],
			"requiredFilters" : [ "YearMonth" ],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		this.vizBarChartWithMultipleDimensions1 = new test.sap.apf.ui.representations.BarChart(this.oGlobalApi.oApi, this.parameterWithMultipleDimensions1);
		this.sampleData = sap.apf.testhelper.odata.getSampleService(this.oGlobalApi.oApi, 'sampleData');
		this.vizBarChartWithMultipleDimensions1.setData(this.sampleData, this.sampleMetadata);
		this.vizBarChartWithMultipleDimensions1.getMainContent("sample Title", 100, 100);
		this.vizBarChartWithMultipleDimensions1.validateSelectionModes();
		assert.equal(this.vizBarChartWithMultipleDimensions1.chart.getInteraction().getSelectability().getAxisLabelSelection(), false, "Selectabilty for axis is set as false");
		this.parameterWithMultipleDimensions2 = {//Number of dimensions increased for test coverage; Required filter changed
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry"
			}, {
				"fieldName" : "YearMonth"
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			}, {
				"fieldName" : "DaysSalesOutstanding"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		this.vizBarChartWithMultipleDimensions2 = new test.sap.apf.ui.representations.BarChart(this.oGlobalApi.oApi, this.parameterWithMultipleDimensions2);
		this.sampleData = sap.apf.testhelper.odata.getSampleService(this.oGlobalApi.oApi, 'sampleData');
		this.vizBarChartWithMultipleDimensions2.setData(this.sampleData, this.sampleMetadata);
		this.vizBarChartWithMultipleDimensions2.getMainContent("sample Title", 100, 100);
		this.vizBarChartWithMultipleDimensions2.validateSelectionModes();
		assert.equal(this.vizBarChartWithMultipleDimensions2.chart.getInteraction().getSelectability().getLegendSelection(), false, "Selectabilty for legend is set as false");
	});
	QUnit.test("Formatting of axis labels and tooltip for single measure case(no currency measures)", function(assert) {
		var xAxisFormatString = this.vizBarChart.chart.getXAxis().getLabel().getFormatString();
		var yAxisFormatString = this.vizBarChart.chart.getYAxis().getLabel().getFormatString();
		assert.ok(yAxisFormatString === "", "Y-AXIS FORMATTING - Format string not avilable for Y-Axis");
		assert.ok(xAxisFormatString === null, "X-AXIS FORMATTING - Format string not avilable for X-Axis");
	});
	QUnit.test("Formatting of axis labels and tooltip for multiple measure case(currency measure available)", function(assert) {
		var i = 0;
		this.parameterWithMultipleMeasures = {
			"dimensions" : [ {
				"fieldName" : "YearMonth"
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
			}, {
				"fieldName" : "OverdueDebitAmtInDisplayCrcy_E"
			} ],
			"requiredFilters" : [ "CompanyCodeCountry" ],
			"alternateRepresentationType" : {
				"type" : "representationType",
				"id" : "table",
				"constructor" : "sap.apf.ui.representations.table",
				"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
				"label" : {
					"type" : "label",
					"kind" : "text",
					"key" : "table"
				}
			}
		};
		this.vizBarChartMultipleMeasures = new test.sap.apf.ui.representations.BarChart(this.oGlobalApi.oApi, this.parameterWithMultipleMeasures);
		this.sampleDataRevenue = sap.apf.testhelper.odata.getSampleService(this.oGlobalApi.oApi, 'sampleDataRevenue');
		this.vizBarChartMultipleMeasures.setData(this.sampleDataRevenue, this.sampleMetadata);
		this.vizBarChartMultipleMeasures.getMainContent("sample Title", 100, 100);
		var measuresInChart = this.parameterWithMultipleMeasures.measures;
		var xAxisFormatString = this.vizBarChartMultipleMeasures.chart.getXAxis().getLabel().getFormatString();
		var yAxisFormatString = this.vizBarChartMultipleMeasures.chart.getYAxis().getLabel().getFormatString();
		var tooltipFormatString = this.vizBarChartMultipleMeasures.chart.getToolTip().getFormatString();
		assert.equal(tooltipFormatString.length, measuresInChart.length, "Formatting done for all the measures to be displayed in tooltip");
		assert.ok((yAxisFormatString !== null && yAxisFormatString !== undefined), "Y-AXIS FORMATTING - Format string avilable for Y-Axis" + " ( " + yAxisFormatString + " )");
		assert.ok((xAxisFormatString !== null || xAxisFormatString !== undefined), "X-AXIS FORMATTING - Format string avilable for X-Axis");
		measuresInChart.forEach(function(measure) {
			assert.ok((tooltipFormatString !== null && tooltipFormatString !== undefined), "TOOLTIP FORMATTING - Format string avilable for Tooltip for measure " + measure.fieldName + " ( " + tooltipFormatString[i++] + " )");
		});
	});
})();