/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerStubbedAjax");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.declare('test.sap.apf.ui.utils.tPrint');
(function() {
	'use strict';
	var inject = {
			SessionHandler : sap.apf.testhelper.doubles.sessionHandlerStubbedAjax
	};
	var oGlobalApi = new sap.apf.testhelper.doubles.UiApi("CompUi", 
			"/apf-test/test-resources/sap/apf/testhelper/config/applicationConfigurationIntegration.json", inject);
	var printHelper,  oPrintLayout = {};
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#doNothing
	 * @description Dummy function for stubbing unused methods
	 * */
	function doNothing() {
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#getApplicationConfigPropertiesStub
	 * @description To stub oGlobalApi.oCoreApi.getApplicationConfigProperties
	 * */
	function getApplicationConfigPropertiesStub() {
		return {
			appName : "dummy-app-name"
		};
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#createApplicationLayoutStub
	 * @description To stub oGlobalApi.oUiApi.createApplicationLayout
	 * */
	function createApplicationLayoutStub() {
		return {
			setBusy : doNothing
		};
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#getAnalysisPathStub
	 * @description To stub oGlobalApi.oUiApi.getAnalysisPath
	 * */
	function getAnalysisPathStub() {
		var oSavedPathName = {};
		oSavedPathName.getTitle = function() {
			return "dummy-analysis-path-name";
		};
		return {
			oSavedPathName : oSavedPathName
		};
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#setTimeoutStub
	 * @param {Function} fn - function which needs to be exectued after the timer
	 * @param {Integer} v - timer 
	 * @description To stub window.setTimeout
	 * */
	function setTimeoutStub(fn, v) {
		if (v === 10) {
			oPrintLayout = printHelper.oPrintLayout.clone();
		}
		fn();
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#getAllInternalIdsStub
	 * @description To stub oGlobalApi.oFilterIdHandler.getAllInternalIds
	 * */
	function getAllInternalIdsStub() {
		return [ 1 ];
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#getInFilterIdHandlerStub
	 * @description To stub oGlobalApi.oFilterIdHandler.get
	 * */
	function getInFilterIdHandlerStub() {
		var obj = {};
		var oFilterExp = [ [ {
			name : "P_DisplayCurrency",
			operator : "EQ",
			value : "USD",
			length : 1
		} ], [ {
			name : "P_DisplayCurrency",
			operator : "EQ",
			value : "USD",
			length : 1
		} ] ];
		obj.getExpressions = function() {
			return oFilterExp;
		};
		return obj;
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#getFacetFilterForPrintStub
	 * @description To stub oGlobalApi.oUiApi.getFacetFilterForPrint
	 * */
	function getFacetFilterForPrintStub() {
		var obj = {};
		var oFacetFilter = [ {
			length : 1,
			getTitle : function() {
				return "Facet Filter";
			},
			getSelectedItems : function() {
				var obj = {
					length : 0
				};
				return obj;
			},
			getItems : function() {
				var obj = [ new sap.ui.core.Item({
					text : "text"
				}) ];
				return obj;
			}
		} ];
		obj.getLists = function() {
			return oFacetFilter;
		};
		return obj;
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#metaData
	 * @description Sample metadata for lineChart
	 * */
	function metaDataStub() {
		var getPropertyMetadataStub = sinon.stub();
		getPropertyMetadataStub.withArgs("CompanyCodeCountry").returns({
			dataType : {
				maxLength : 10,
				type : "Edm.String"
			},
			label : "Company Code Country",
			name : "CompanyCodeCountry"
		});
		getPropertyMetadataStub.withArgs("DaysSalesOutstanding").returns({
			dataType : {
				maxLength : 10,
				type : "Edm.Int32"
			},
			label : "Days Sales Outstanding",
			name : "DaysSalesOutstanding"
		});
		getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E").returns({
			ISOCurrency : "DisplayCurrency",
			label : "Revenue in Display Currency",
			name : "RevenueAmountInDisplayCrcy_E",
			scale : "DisplayCurrencyDecimals",
			unit : "RevenueAmountInDisplayCrcy_E.CURRENCY",
			dataType : {
				precision : 34,
				type : "Edm.Decimal"
			}
		});
		getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E.CURRENCY").returns({
			name : "RevenueAmountInDisplayCrcy_E.CURRENCY",
			semantics : "currency-code",
			dataType : {
				precision : 5,
				type : "Edm.String"
			}
		});
		return getPropertyMetadataStub;
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#getStepsStub
	 * @description To stub oGlobalApi.oCoreApi.getSteps (LineChart)
	 * */
	function getStepsStub() {
		var oGetStepsOfLineChart = [ {
			title : "dummy-title",
			length : 1,
			getSelectedRepresentation : function() {
				var sampleData = sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleData');
				var sampleMetadata = {
					getPropertyMetadata : metaDataStub
				};
				var parameter = {
					dimensions : [ {
						fieldName : "CompanyCodeCountry"
					} ],
					measures : [ {
						fieldName : "RevenueAmountInDisplayCrcy_E"
					}, {
						fieldName : "DaysSalesOutstanding"
					} ],
					requiredFilters : [ "CompanyCodeCountry" ],
					chartType : "line",
					alternateRepresentationType : {
						type : "representationType",
						id : "table",
						constructor : "sap.apf.ui.representations.table",
						picture : "sap-icon://table-chart (sap-icon://table-chart/)",
						label : {
							type : "label",
							kind : "text",
							key : "table"
						}
					}
				};
				var dummyContentForChart = new sap.apf.ui.representations.lineChart(oGlobalApi.oApi, parameter);
				dummyContentForChart.setData(sampleData, sampleMetadata);
				dummyContentForChart.getPrintContent("sample Title").oChartForPrinting;
				dummyContentForChart.getMainContent("sample Title", 100, 100);
				return dummyContentForChart;
			}
		} ];
		return oGetStepsOfLineChart;
	}
	/**
	 * @function
	 * @name sap.apf.ui.utils.tPrint#getStepsStubOfTableRep
	 * @description To stub oGlobalApi.oCoreApi.getSteps (Table Representation)
	 * */
	function getStepsStubOfTableRep() {
		var oGetStepsOfTable = [ {
			title : "dummy-title",
			length : 1,
			getSelectedRepresentation : function() {
				return {
					type : "TableRepresentation",
					getPrintContent : function(stepTitle) {
						var dummyContent = new sap.m.Button({
							text : "Dummy-Button-Test",
							tooltip : "Button tooltip"
						});
						return dummyContent;
					}
				};
			}
		} ];
		return oGetStepsOfTable;
	}
	QUnit.module("Print qUnit", {
		beforeEach : function() {
			var oViewData = {
				oCoreApi : oGlobalApi.oCoreApi,
				uiApi : oGlobalApi.oUiApi,
				oFilterIdHandler : oGlobalApi.oFilterIdHandler
			};
			printHelper = new sap.apf.ui.utils.PrintHelper(oViewData);
			sinon.stub(oGlobalApi.oCoreApi, "getApplicationConfigProperties", getApplicationConfigPropertiesStub);
			sinon.stub(oGlobalApi.oUiApi, "getAnalysisPath", getAnalysisPathStub);
			sinon.stub(oGlobalApi.oUiApi, "getEventCallback", doNothing);
			sinon.stub(window, "print", doNothing);
			sinon.stub(window, "setTimeout", setTimeoutStub);
			sinon.stub(oGlobalApi.oUiApi, "createApplicationLayout", createApplicationLayoutStub);
		},
		afterEach : function() {
			oGlobalApi.oCoreApi.getApplicationConfigProperties.restore();
			oGlobalApi.oUiApi.getAnalysisPath.restore();
			oGlobalApi.oUiApi.getEventCallback.restore();
			window.print.restore();
			window.setTimeout.restore();
			oGlobalApi.oUiApi.createApplicationLayout.restore();
		}
	});
	QUnit.test("When Print API loaded", function(assert) {
		//assert
		assert.ok(printHelper.doPrint, "then Do Print API exists");
	});
	QUnit.test("When Printing without facet filter and steps", function(assert) {
		//act
		printHelper.doPrint();
		//assert
		assert.strictEqual(jQuery("#apfPrintArea").length, 1, "then print Area Injected into the DOM");
		assert.strictEqual(oGlobalApi.oUiApi.getFacetFilterForPrint.calledOnce, undefined, "then Facet filter not available");
		assert.strictEqual(oGlobalApi.oCoreApi.getSteps.calledOnce, undefined, "then steps not available");
		assert.strictEqual(window.print.calledOnce, true, "then Window.print is called");
	});
	/*	QUnit.test("When printing steps (line chart) without facet filter", function(assert) {
			// arrange
			sinon.stub(oGlobalApi.oCoreApi, "getSteps", getStepsStub);
			//act
			printHelper.doPrint();
			//assert
			assert.strictEqual(jQuery("#apfPrintArea").length, 1, "then, print Area Injected into the DOM");
			assert.strictEqual(oGlobalApi.oUiApi.getFacetFilterForPrint.calledOnce, undefined, "then, Facet filter not available");
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps.calledOnce, true, "then, steps has been captured");
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps()[0].getSelectedRepresentation().type, "LineChart", "then Given step is line chart");
			assert.strictEqual(window.print.calledOnce, true, "then, Window.print called");
			//cleanup
			oGlobalApi.oCoreApi.getSteps.restore();
		});*/
	QUnit.test("When printing steps (table representation) without facet filter", function(assert) {
		// arrange
		sinon.stub(oGlobalApi.oCoreApi, "getSteps", getStepsStubOfTableRep);
		//act
		printHelper.doPrint();
		//assert
		assert.strictEqual(jQuery("#apfPrintArea").length, 1, "then Print Area Injected into the DOM");
		assert.strictEqual(oGlobalApi.oUiApi.getFacetFilterForPrint.calledOnce, undefined, "then Facet filter not available");
		assert.strictEqual(oGlobalApi.oCoreApi.getSteps.calledOnce, true, "then steps has been captured");
		assert.strictEqual(oGlobalApi.oCoreApi.getSteps()[0].getSelectedRepresentation().type, "TableRepresentation", "then Given step is table representation");
		assert.strictEqual(window.print.calledOnce, true, "then Window.print is called");
		//cleanup
		oGlobalApi.oCoreApi.getSteps.restore();
	});
	QUnit.test("When printing without steps and in presence of facet filter", function(assert) {
		// arrange
		sinon.stub(oGlobalApi.oUiApi, "getFacetFilterForPrint", getFacetFilterForPrintStub);
		sinon.stub(oGlobalApi.oFilterIdHandler, "getAllInternalIds", getAllInternalIdsStub);
		sinon.stub(oGlobalApi.oFilterIdHandler, "get", getInFilterIdHandlerStub);
		//act
		printHelper.doPrint();
		//assert
		assert.strictEqual(jQuery("#apfPrintArea").length, 1, "then Print Area Injected into the DOM");
		assert.strictEqual(oGlobalApi.oUiApi.getFacetFilterForPrint.calledOnce, true, "then Facet filter details has been extracted");
		assert.strictEqual(oGlobalApi.oCoreApi.getSteps.calledOnce, undefined, "then steps not available");
		assert.strictEqual(window.print.calledOnce, true, "then Window.print is called");
		//cleanup
		oGlobalApi.oUiApi.getFacetFilterForPrint.restore();
		oGlobalApi.oFilterIdHandler.getAllInternalIds.restore();
		oGlobalApi.oFilterIdHandler.get.restore();
	});
	/*	QUnit.test("When printing steps (line chart) and facet filter", function(assert) {
			// arrange
			sinon.stub(oGlobalApi.oUiApi, "getFacetFilterForPrint", getFacetFilterForPrintStub);
			sinon.stub(oGlobalApi.oCoreApi, "getSteps", getStepsStub);
			sinon.stub(oGlobalApi.oFilterIdHandler, "getAllInternalIds", getAllInternalIdsStub);
			sinon.stub(oGlobalApi.oFilterIdHandler, "get", getInFilterIdHandlerStub);
			//act
			printHelper.doPrint();
			//assert
			assert.strictEqual(jQuery("#apfPrintArea").length, 1, "then, print Area Injected into the DOM");
			assert.strictEqual(oGlobalApi.oUiApi.getFacetFilterForPrint.calledOnce, true, "then, Facet filter details has been extracted");
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps.calledOnce, true, "then, steps has been captured");
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps()[0].getSelectedRepresentation().type, "LineChart", "then given step is line chart");
			assert.strictEqual(window.print.calledOnce, true, "then, Window.print called");
			//cleanup
			oGlobalApi.oUiApi.getFacetFilterForPrint.restore();
			oGlobalApi.oCoreApi.getSteps.restore();
			oGlobalApi.oFilterIdHandler.getAllInternalIds.restore();
			oGlobalApi.oFilterIdHandler.get.restore();
		});*/
	QUnit.test("When printing both steps (table representation) and facet filter", function(assert) {
		// arrange
		sinon.stub(oGlobalApi.oUiApi, "getFacetFilterForPrint", getFacetFilterForPrintStub);
		sinon.stub(oGlobalApi.oCoreApi, "getSteps", getStepsStubOfTableRep);
		sinon.stub(oGlobalApi.oFilterIdHandler, "getAllInternalIds", getAllInternalIdsStub);
		sinon.stub(oGlobalApi.oFilterIdHandler, "get", getInFilterIdHandlerStub);
		//act
		printHelper.doPrint();
		//assert
		assert.strictEqual(jQuery("#apfPrintArea").length, 1, "then Print Area Injected into the DOM");
		assert.strictEqual(oGlobalApi.oUiApi.getFacetFilterForPrint.calledOnce, true, "then Facet filter details has been extracted");
		assert.strictEqual(oGlobalApi.oCoreApi.getSteps.calledOnce, true, "then steps has been captured");
		assert.strictEqual(oGlobalApi.oCoreApi.getSteps()[0].getSelectedRepresentation().type, "TableRepresentation", "then given step is table representation");
		assert.strictEqual(window.print.calledOnce, true, "then Window.print is called");
		//cleanup
		oGlobalApi.oUiApi.getFacetFilterForPrint.restore();
		oGlobalApi.oCoreApi.getSteps.restore();
		oGlobalApi.oFilterIdHandler.getAllInternalIds.restore();
		oGlobalApi.oFilterIdHandler.get.restore();
	});
}());
