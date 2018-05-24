/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare('sap.apf.ui.utils.tFacetFilterValueFormatter');
jQuery.sap.require('sap.apf.ui.utils.facetFilterValueFormatter');
(function() {
	'use strict';
	var oCoreApi;
	var oUiApi;
	var oFacetFilterValueFormatter;
	function doNothing() {
	}
	//Stub for formatter
	function formatterDouble() {
		var getFormattedValueStub = sinon.stub();
		var oFormatterStub = {
			getFormattedValue : getFormattedValueStub
		};
		//Different values returned based on the arguments passed
		getFormattedValueStub.withArgs("StartDate", "20000101").returns("1/1/2000");
		getFormattedValueStub.withArgs("StartDate", "20000201").returns("2/1/2000");
		getFormattedValueStub.withArgs("CompanyCode", "0001").returns("0001");
		getFormattedValueStub.withArgs("CompanyCode", "0002").returns("0002");
		getFormattedValueStub.withArgs("CompanyCodeName", "SAP AG").returns("SAP AG");
		getFormattedValueStub.withArgs("CompanyCodeName", "SAP SE").returns("SAP SE");
		return oFormatterStub;
	}
	sinon.stub(sap.apf.ui.utils, "formatter", sinon.stub().returns(formatterDouble()));
	QUnit.module("Facet Filter value formatter for list values", {
		beforeEach : function() {
			//oCoreApi stub
			oCoreApi = {
				getTextNotHtmlEncoded : doNothing
			};
			//oUiApi stub
			oUiApi = {
				getEventCallback : doNothing
			};
			oFacetFilterValueFormatter = new sap.apf.ui.utils.FacetFilterValueFormatter();
		}
	});
	QUnit.test("Format filter value of property with no text field ", function(assert) {
		// arrangement
		var aExpectedFilterValues = [ {
			"StartDate" : "20000101",
			"formattedValue" : "1/1/2000"
		}, {
			"StartDate" : "20000201",
			"formattedValue" : "2/1/2000"
		} ];
		var sSelectProperty = "StartDate";
		var aFilterValues = [ {
			"StartDate" : "20000101"
		}, {
			"StartDate" : "20000201"
		} ];
		var oPropertyMetadata = {
			"name" : "StartDate",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "8"
			},
			"label" : "Start Date",
			"aggregation-role" : "dimension",
			"isCalendarDate" : "true"
		};
		var oArgs = {
			sSelectProperty : sSelectProperty,
			aFilterValues : aFilterValues,
			oPropertyMetadata : oPropertyMetadata,
			oCoreApi : oCoreApi,
			oUiApi : oUiApi
		};
		// act
		var aModifiedFilters = oFacetFilterValueFormatter.getFormattedFFData(oArgs);
		// assert
		assert.deepEqual(aModifiedFilters, aExpectedFilterValues, "the formatted value is correct");
	});
	QUnit.test("Format filter value of property with a text field  ", function(assert) {
		// arrangement
		var sSelectProperty = "CompanyCode";
		var aFilterValues = [ {
			"CompanyCode" : "0001",
			"CompanyCodeName" : "SAP AG"
		}, {
			"CompanyCode" : "0002",
			"CompanyCodeName" : "SAP SE"
		} ];
		var oPropertyMetadata = {
			"name" : "CompanyCode",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "4"
			},
			"label" : "Company Code",
			"aggregation-role" : "dimension",
			"text" : "CompanyCodeName"
		};
		var oArgs = {
			sSelectProperty : sSelectProperty,
			aFilterValues : aFilterValues,
			oPropertyMetadata : oPropertyMetadata,
			oCoreApi : oCoreApi,
			oUiApi : oUiApi
		};
		var aExpectedFilterValues = [ {
			"CompanyCode" : "0001",
			"CompanyCodeName" : "SAP AG",
			"formattedValue" : "0001 - SAP AG"
		}, {
			"CompanyCode" : "0002",
			"CompanyCodeName" : "SAP SE",
			"formattedValue" : "0002 - SAP SE"
		} ];
		// act
		var aModifiedFilters = oFacetFilterValueFormatter.getFormattedFFData(oArgs);
		// assert
		assert.deepEqual(aModifiedFilters, aExpectedFilterValues, "the formatted value is correct");
	});
	QUnit.test("Format filter value of property with an 'undefined' text field ", function(assert) {
		// arrangement
		var sSelectProperty = "CompanyCode";
		var aFilterValues = [ {
			"CompanyCode" : "0001"
		} ];
		var oPropertyMetadata = {
			"name" : "CompanyCode",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "4"
			},
			"label" : "Company Code",
			"aggregation-role" : "dimension",
			"text" : "CompanyCodeName"
		};
		var oArgs = {
			sSelectProperty : sSelectProperty,
			aFilterValues : aFilterValues,
			oPropertyMetadata : oPropertyMetadata,
			oCoreApi : oCoreApi,
			oUiApi : oUiApi
		};
		var aExpectedFilterValues = [ {
			"CompanyCode" : "0001",
			"formattedValue" : "0001"
		} ];
		// act
		var aModifiedFilters = oFacetFilterValueFormatter.getFormattedFFData(oArgs);
		// assert
		assert.deepEqual(aModifiedFilters, aExpectedFilterValues, "the formatted value is correct");
	});
}());
