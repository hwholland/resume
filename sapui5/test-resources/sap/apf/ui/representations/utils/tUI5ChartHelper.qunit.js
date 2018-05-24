jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../../integration');
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.interfaces.IfUiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.helper");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.declare('test.sap.apf.ui.representations.utils.tUI5ChartHelper');
jQuery.sap.require('sap.apf.ui.instance');
jQuery.sap.require('sap.apf.ui.representations.utils.UI5ChartHelper');
jQuery.sap.require('sap.apf.ui.representations.utils.vizDatasetHelper');
jQuery.sap.require('sap.apf.ui.representations.utils.vizFrameDatasetHelper');
(function() {
	var getPropertyMetadataStub = sinon.stub();
	var oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
	var UI5ChartHelper, sampleData;
	function setPropertyStubs(changeCompanyCodeCountryStub) {
		getPropertyMetadataStub.withArgs("CompanyCodeCountry").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.String"
			},
			"aggregation-role" : "dimension",
			"label" : "Company Code Country",
			"name" : "CompanyCodeCountry",
			"text" : "CompanyCodeCountryName"
		});
		if (changeCompanyCodeCountryStub) {
			getPropertyMetadataStub.withArgs("CompanyCodeCountry").returns({
				"dataType" : {
					"maxLength" : "10",
					"type" : "Edm.String"
				},
				"aggregation-role" : "dimension",
				"label" : "Company Code Country",
				"name" : "CompanyCodeCountry"
			});
		}
		getPropertyMetadataStub.withArgs("CompanyCodeCountryISOCode").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.String"
			},
			"aggregation-role" : "dimension",
			"name" : "CompanyCodeCountryISOCode"
		});
		getPropertyMetadataStub.withArgs("CompanyCodeCountryName").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.String"
			},
			"label" : "Company Code Country Name",
			"name" : "CompanyCodeCountryName"
		});
		getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E").returns({
			"ISOCurrency" : "DisplayCurrency",
			"aggregation-role" : "measure",
			"dataType" : {
				"precision" : "26",
				"type" : "Edm.Decimal"
			},
			"filterable" : "false",
			"label" : "Revenue in Display Currency",
			"name" : "RevenueAmountInDisplayCrcy_E",
			"scale" : "DisplayCurrencyDecimals",
			"unit" : "RevenueAmountInDisplayCrcy_E.CURRENCY"
		});
		getPropertyMetadataStub.withArgs("DaysSalesOutstanding").returns({
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.Int32"
			},
			"aggregation-role" : "measure",
			"name" : "DaysSalesOutstanding"
		});
		getPropertyMetadataStub.withArgs("YearMonth").returns({
			"dataType" : {
				"maxLength" : "8",
				"type" : "Edm.String"
			},
			"aggregation-role" : "dimension",
			"label" : "Year Month",
			"name" : "YearMonth"
		});
	}
	function instantiateUI5ChartHelper(parameter) {
		var param, bIsGroupTypeChart = true, oDataSetHelper, sampleMetadata, formatter;
		if (!parameter) {
			param = {
				"dimensions" : [ {
					"fieldName" : "CompanyCodeCountry"
				}, {
					"fieldName" : "CompanyCodeCountryISOCode"
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
		}
		oDataSetHelper = new sap.apf.ui.representations.utils.VizDatasetHelper(bIsGroupTypeChart);
		sampleMetadata = {
			getPropertyMetadata : getPropertyMetadataStub
		};
		formatter = new sap.apf.ui.utils.formatter({
			getEventCallback : oGlobalApi.oApi.getEventCallback.bind(oGlobalApi.oApi),
			getTextNotHtmlEncoded : oGlobalApi.oApi.getTextNotHtmlEncoded
		}, sampleMetadata, sampleData);
		sampleData = sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleData');
		parameter = parameter || param;
		UI5ChartHelper = new sap.apf.ui.representations.utils.UI5ChartHelper(oGlobalApi.oApi, parameter);
		UI5ChartHelper.init(sampleData, sampleMetadata, bIsGroupTypeChart, oDataSetHelper, formatter);
	}
	QUnit.module("UI5 Chart Helper Tests", {
		beforeEach : function(assert) {
			sap.apf.core.SessionHandler = function() {
				sinon.stub().returns(true);
			};
			setPropertyStubs();
			instantiateUI5ChartHelper();
		}
	});
	QUnit.test("Functionality Tests of UI5 Chart helper for viz charts", function(assert) {
		var model, dataset, dummySelections, highLightPoints, selections, filterCount, filterObj, filterObject, filterValues;
		assert.ok((UI5ChartHelper.displayNameLookup.CompanyCodeCountry.DISPLAY_NAME === "Company Code Country" && UI5ChartHelper.displayNameLookup.CompanyCodeCountry.VALUE === "formatted_CompanyCodeCountry"),
				"init Method - display name hash map is created");
		assert.ok((UI5ChartHelper.fieldNameLookup["Company Code Country"].FIELD_NAME === "CompanyCodeCountry" && UI5ChartHelper.fieldNameLookup["Company Code Country"].VALUE === "formatted_CompanyCodeCountry"),
				"init Method - field name hash map is created");
		assert.ok((UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountry === "Argentina (AR)"), "init Method - Extended data response created.");
		assert.ok((UI5ChartHelper.filterLookup["Argentina (AR)"][0].id === "AR" && UI5ChartHelper.filterLookup["Argentina (AR)"][0].text === "Argentina (AR)"), "init Method - filter hash map created");
		model = UI5ChartHelper.getModel();
		assert.equal(model.getData().data.length, sampleData.length, "getModel returns model");
		dataset = UI5ChartHelper.getDataset();
		assert.ok((dataset.getDimensions().length === 3 && dataset.getMeasures().length === 2), "getDataset returns dataset");
		dummySelections = [ {
			"data" : {
				"Company Code Country" : "Argentina (AR)",
				"Days Sales Outstanding" : 40.2,
				"CompanyCodeCountryISOCode" : "ARG",
				"Year Month" : "201304"
			}
		} ];
		highLightPoints = UI5ChartHelper.getHighlightPointsFromSelectionEvent(dummySelections);
		assert.equal(highLightPoints.length, 8, "getHighlightPointsFromSelectionEvent returns highlightPoints");
		filterObj = UI5ChartHelper.getFilterFromSelection();
		assert.equal(filterObj.getExpressions()[0][0].value, "AR", "getFilterFromSelection returns filter object");
		selections = UI5ChartHelper.getSelectionFromFilter();
		assert.equal(selections.length, 8, "getSelectionFromFilter returns selection");
		filterCount = UI5ChartHelper.getFilterCount();
		assert.equal(filterCount, 1, "getFilterCount returns filter count");
		filterObject = {
			id : "AR",
			text : "Argentina (AR)"
		};
		filterValues = UI5ChartHelper.getFilters();
		assert.deepEqual(filterValues[0], filterObject, "getFilters returns filter id and text objects");
		highLightPoints = UI5ChartHelper.getHighlightPointsFromDeselectionEvent(dummySelections);
		assert.equal(highLightPoints.length, 0, "getHighlightPointsFromDeselectionEvent returns highlightPoints");
	});
	QUnit.test("Functionality Tests of UI5 Chart helper for vizFrame charts", function(assert) {
		var model, dataset, dummySelections, highLightPoints, filterObj, selections, filterCount, filterObject, filterValues;
		assert.ok((UI5ChartHelper.displayNameLookup.CompanyCodeCountry.DISPLAY_NAME === "Company Code Country" && UI5ChartHelper.displayNameLookup.CompanyCodeCountry.VALUE === "formatted_CompanyCodeCountry"),
				"init Method - display name hash map is created");
		assert.ok((UI5ChartHelper.fieldNameLookup["Company Code Country"].FIELD_NAME === "CompanyCodeCountry" && UI5ChartHelper.fieldNameLookup["Company Code Country"].VALUE === "formatted_CompanyCodeCountry"),
				"init Method - field name hash map is created");
		assert.ok((UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountry === "Argentina (AR)"), "init Method - Extended data response created.");
		assert.ok((UI5ChartHelper.filterLookup["Argentina (AR)"][0].id === "AR" && UI5ChartHelper.filterLookup["Argentina (AR)"][0].text === "Argentina (AR)"), "init Method - filter hash map created");
		model = UI5ChartHelper.getModel();
		assert.equal(model.getData().data.length, sampleData.length, "getModel returns model");
		dataset = UI5ChartHelper.getDataset();
		assert.ok((dataset.getDimensions().length === 3 && dataset.getMeasures().length === 2), "getDataset returns dataset");
		dummySelections = [ {
			"data" : {
				"Company Code Country" : "Argentina (AR)",
				"Days Sales Outstanding" : 40.2,
				"CompanyCodeCountryISOCode" : "ARG",
				"Year Month" : "201304"
			}
		} ];
		highLightPoints = UI5ChartHelper.getHighlightPointsFromSelectionEvent(dummySelections);
		assert.equal(highLightPoints.length, 8, "getHighlightPointsFromSelectionEvent returns highlightPoints");
		filterObj = UI5ChartHelper.getFilterFromSelection();
		assert.equal(filterObj.getExpressions()[0][0].value, "AR", "getFilterFromSelection returns filter object");
		selections = UI5ChartHelper.getSelectionFromFilter();
		assert.equal(selections.length, 8, "getSelectionFromFilter returns selection");
		filterCount = UI5ChartHelper.getFilterCount();
		assert.equal(filterCount, 1, "getFilterCount returns filter count");
		filterObject = {
			id : "AR",
			text : "Argentina (AR)"
		};
		filterValues = UI5ChartHelper.getFilters();
		assert.deepEqual(filterValues[0], filterObject, "getFilters returns filter id and text objects");
		highLightPoints = UI5ChartHelper.getHighlightPointsFromDeselectionEvent(dummySelections);
		assert.equal(highLightPoints.length, 0, "getHighlightPointsFromDeselectionEvent returns highlightPoints");
	});
	QUnit.test("If metadata of property does not have label field", function(assert) {
		//assert
		assert.ok((UI5ChartHelper.displayNameLookup.CompanyCodeCountryISOCode.DISPLAY_NAME === "CompanyCodeCountryISOCode" && UI5ChartHelper.displayNameLookup.CompanyCodeCountryISOCode.VALUE === "formatted_CompanyCodeCountryISOCode"),
				"init Method - display name hash map is created with name field");
		assert.ok((UI5ChartHelper.fieldNameLookup["CompanyCodeCountryISOCode"].FIELD_NAME === "CompanyCodeCountryISOCode" && UI5ChartHelper.fieldNameLookup["CompanyCodeCountryISOCode"].VALUE === "formatted_CompanyCodeCountryISOCode"),
				"init Method - field name hash map is created with name field");
		assert.ok((UI5ChartHelper.displayNameLookup.DaysSalesOutstanding.DISPLAY_NAME === "DaysSalesOutstanding" && UI5ChartHelper.displayNameLookup.DaysSalesOutstanding.VALUE === "DaysSalesOutstanding"),
				"init Method - display name hash map is created with name field");
		assert.ok((UI5ChartHelper.fieldNameLookup["DaysSalesOutstanding"].FIELD_NAME === "DaysSalesOutstanding" && UI5ChartHelper.fieldNameLookup["DaysSalesOutstanding"].VALUE === "DaysSalesOutstanding"),
				"init Method - field name hash map is created with name field");
	});
	QUnit.test("When dimension parameters do not have label display option", function(assert) {
		//assert
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountry, "Argentina (AR)", "then CompanyCodeCountry is appended to the text field CompanyCodeCountryName available in data response");
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountryISOCode, "ARG", "then CompanyCodeCountryISOCode field has nothing appended since it a key field without text");
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_YearMonth, "201304", "then YearMonth field has nothing appended since it a key field without text");
	});
	QUnit.test("When dimension parameters do not have label display option", function(assert) {
		//arrangement
		setPropertyStubs(true);
		instantiateUI5ChartHelper();
		//assert
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountry, "AR", "then CompanyCodeCountry is not appended to the text field CompanyCodeCountryName since it is not available in data response");
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountryISOCode, "ARG", "then CompanyCodeCountryISOCode field has nothing appended since it a key field without text");
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_YearMonth, "201304", "then YearMonth field has nothing appended since it a key field without text");
	});
	QUnit.test("When getFilterFromSelection is called and metadata is available", function(assert) {
		//arrangement
		getPropertyMetadataStub.reset();//reset the count
		var dummySelections = [ {
			"data" : {
				"Company Code Country" : "Argentina (AR)",
				"Days Sales Outstanding" : 40.2,
				"CompanyCodeCountryISOCode" : "ARG",
				"Year Month" : "201304"
			}
		} ];
		var highLightPoints = UI5ChartHelper.getHighlightPointsFromSelectionEvent(dummySelections);
		assert.equal(getPropertyMetadataStub.callCount, 0, "getPropertyMetadataStub call count is reset");
		var filterObj = UI5ChartHelper.getFilterFromSelection();
		//assert
		assert.equal(highLightPoints.length, 8, "getHighlightPointsFromSelectionEvent returns highlightPoints");
		assert.equal(getPropertyMetadataStub.callCount, 1, "getPropertyMetadataStub is called once");
		assert.equal(filterObj.getExpressions()[0][0].value, "AR", "getFilterFromSelection returns filter object");
		assert.equal(getPropertyMetadataStub.called, true, "getPropertyMetadataStub is called when metadata is available");
	});
	QUnit.test("When getFilterFromSelection is called and metadata is not available", function(assert) {
		//arrangement
		getPropertyMetadataStub.reset();//reset the count
		var dummySelections = [ {
			"data" : {
				"Company Code Country" : "Argentina (AR)",
				"Days Sales Outstanding" : 40.2,
				"CompanyCodeCountryISOCode" : "ARG",
				"Year Month" : "201304"
			}
		} ];
		UI5ChartHelper.metadata = undefined;
		var highLightPoints = UI5ChartHelper.getHighlightPointsFromSelectionEvent(dummySelections);
		assert.equal(getPropertyMetadataStub.callCount, 0, "getPropertyMetadataStub call count is reset");
		var filterObj = UI5ChartHelper.getFilterFromSelection();
		//assert
		assert.equal(highLightPoints.length, 8, "getHighlightPointsFromSelectionEvent returns highlightPoints");
		assert.equal(getPropertyMetadataStub.callCount, 0, "getPropertyMetadataStub call count is zero even after getFilterFromSelection is called ");
		assert.equal(filterObj.getExpressions()[0][0].value, "AR", "getFilterFromSelection returns filter object");
		assert.equal(getPropertyMetadataStub.called, false, "getPropertyMetadataStub is not called when metadata is not available");
	});
	QUnit.module("UI5 Chart Helper Tests", {
		beforeEach : function(assert) {
			sap.apf.core.SessionHandler = function() {
				sinon.stub().returns(true);
			};
			setPropertyStubs();
		}
	});
	QUnit.test("When dimension parameters have label display option", function(assert) {
		//arrangement
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry",
				"labelDisplayOption" : "keyAndText"
			}, {
				"fieldName" : "CompanyCodeCountryISOCode",
				"labelDisplayOption" : "key"
			}, {
				"fieldName" : "YearMonth",
				"labelDisplayOption" : "key"
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
		instantiateUI5ChartHelper(parameter);
		//assert
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountry, "Argentina (AR)",
				"then CompanyCodeCountry is appended to the text field CompanyCodeCountryName available in data response since labelDisplay option was keyAndText");
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountryISOCode, "ARG",
				"then CompanyCodeCountryISOCode is not appended to the text field CompanyCodeCountryISOCodeName since it was not available in data response and labelDisplayOption was key");
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_YearMonth, "201304", "then YearMonth field has nothing appended since it a key field without text and labelDisplayOption was key");
	});
	QUnit.test("When dimension parameters have label display option", function(assert) {
		//arrangement
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry",
				"labelDisplayOption" : "text"
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
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
		instantiateUI5ChartHelper(parameter);
		//assert
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountry, "Argentina",
				"then CompanyCodeCountry is not appended to the text field CompanyCodeCountryName available in data response since labelDisplay option was text");
	});
	QUnit.test("When labeldisplay option given as text and dataresponse does not have text field", function(assert) {
		//arrangement
		var bIsGroupTypeChart = false;
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry",
				"labelDisplayOption" : "text"
			}, {
				"fieldName" : "CompanyCodeCountryISOCode"
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
		var aDataResponse = [ {
			CompanyCodeCountry : "",
			CompanyCodeCountryISOCode : "ERT",
			DaysSalesOutstanding : 59407,
			RevenueAmountInDisplayCrcy_E : 2345
		} ];
		var sampleMetadata = {
			getPropertyMetadata : getPropertyMetadataStub
		};
		var formatter = new sap.apf.ui.utils.formatter({
			getEventCallback : oGlobalApi.oApi.getEventCallback.bind(oGlobalApi.oApi),
			getTextNotHtmlEncoded : oGlobalApi.oApi.getTextNotHtmlEncoded
		}, sampleMetadata, aDataResponse);
		var oDataSetHelper = new sap.apf.ui.representations.utils.VizDatasetHelper(bIsGroupTypeChart);
		UI5ChartHelper = new sap.apf.ui.representations.utils.UI5ChartHelper(oGlobalApi.oApi, parameter);
		UI5ChartHelper.init(aDataResponse, sampleMetadata, bIsGroupTypeChart, oDataSetHelper, formatter);
		//assert
		assert.equal(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountry, "", "Then extendedDataResponse be returned as empty string");
	});
	QUnit.test("When labeldisplay option given as key and text and data response does not have text field", function(assert) {
		//arrangement
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountryISOCode",
				"labelDisplayOption" : "keyAndText"
			} ],
			"measures" : [ {
				"fieldName" : "RevenueAmountInDisplayCrcy_E"
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
		instantiateUI5ChartHelper(parameter);
		//assert
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountryISOCode, "ARG", "Then extendedDataResponse be returned as key since text field not avilable");
	});
	QUnit.test("When dimension parameters have label display option", function(assert) {
		//arrangement
		var parameter = {
			"dimensions" : [ {
				"fieldName" : "CompanyCodeCountry",
				"labelDisplayOption" : "key"
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
		instantiateUI5ChartHelper(parameter);
		//assert
		assert.strictEqual(UI5ChartHelper.extendedDataResponse[0].formatted_CompanyCodeCountry, "AR", "then CompanyCodeCountry is not appended to the text field CompanyCodeCountryName available in data response since labelDisplay option was key");
	});
})();