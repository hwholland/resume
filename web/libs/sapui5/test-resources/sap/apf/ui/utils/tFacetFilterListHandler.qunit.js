/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare('sap.apf.ui.utils.tFacetFilterListHandler');
jQuery.sap.require('sap.apf.ui.utils.facetFilterListHandler');
jQuery.sap.require('sap.apf.ui.utils.facetFilterListConverter');
(function() {
	'use strict';
	var ffListHandler, oConfiguredFilter, getValuesStubForReject, oCoreApi, oUiApi, oPropertyMetadata, oNewPromiseForStartDateValues, oNewPromiseForStartDateSelectedValues;
	var oFacetFilterListConverter = new sap.apf.ui.utils.FacetFilterListConverter();
	function doNothing() {
	}
	//Start filter functions for start date filter
	function getLabelForStartDate() {
		return {
			"type" : "label",
			"kind" : "text",
			"key" : "StartDate"
		};
	}
	function getPropertyNameForStartDate() {
		return "StartDate";
	}
	function getMetadataForStartDate() {
		var oDeferredMetadata = jQuery.Deferred();
		oPropertyMetadata = {
			"name" : "StartDate",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "8"
			},
			"label" : "Start Date",
			"aggregation-role" : "dimension",
			"isCalendarDate" : "true"
		};
		oDeferredMetadata.resolve(oPropertyMetadata);
		return oDeferredMetadata.promise();
	}
	function getValuesForStartDate() {
		var oDeferredValues = jQuery.Deferred();
		var aFilterValues = [ {
			"StartDate" : "20000101"
		}, {
			"StartDate" : "20000201"
		} ];
		oNewPromiseForStartDateValues = jQuery.Deferred();
		oDeferredValues.resolve(aFilterValues, oNewPromiseForStartDateValues.promise());
		return oDeferredValues.promise();
	}
	QUnit.module("Facet Filter List Handler - Positive tests", {
		beforeEach : function() {
			//Stub for getSelectedValues() start date filter
			var getSelectedValuesStub = sinon.stub();
			//Deferred object for getSelectedValues() for start date filter
			var oDeferredSelectedValues1 = jQuery.Deferred();
			var aSelectedFilterValues1 = [ "20000101" ];
			oNewPromiseForStartDateSelectedValues = jQuery.Deferred();
			oDeferredSelectedValues1.resolve(aSelectedFilterValues1, oNewPromiseForStartDateSelectedValues.promise());
			//Different values returned based on the call count
			getSelectedValuesStub.onFirstCall().returns(oDeferredSelectedValues1.promise());
			//oCoreApi stub
			oCoreApi = {
				getTextNotHtmlEncoded : doNothing,
				createMessageObject : doNothing,
				putMessage : sinon.spy()
			};
			//oUiApi stub
			oUiApi = {
				getEventCallback : doNothing
			};
			//Start filter and its functions
			oConfiguredFilter = {
				getLabel : getLabelForStartDate,
				getPropertyName : getPropertyNameForStartDate,
				getAliasNameIfExistsElsePropertyName : doNothing,
				getMetadata : getMetadataForStartDate,
				getValues : getValuesForStartDate,
				getSelectedValues : getSelectedValuesStub,
				setSelectedValues : sinon.spy()
			};
			ffListHandler = new sap.apf.ui.utils.FacetFilterListHandler(oCoreApi, oUiApi, oConfiguredFilter, oFacetFilterListConverter);
		}
	});
	QUnit.test("Get Facet Filter List data", function(assert) {
		//act
		var oFacetFilterListDataPromise = ffListHandler.getFacetFilterListData();
		oFacetFilterListDataPromise.then(function(oValues) {
			//arrangement
			var oFormatterArgs = {
				oCoreApi : oCoreApi,
				oUiApi : oUiApi,
				oPropertyMetadata : oPropertyMetadata,
				sSelectProperty : "StartDate"
			};
			var oExpectedValues = {
				aFilterValues : [ {
					"StartDate" : "20000101"
				}, {
					"StartDate" : "20000201"
				} ],
				oFilterRestrictionPropagationPromiseForValues : oNewPromiseForStartDateValues.promise(),
				oFormatterArgs : oFormatterArgs
			};
			//assert
			assert.deepEqual(oValues, oExpectedValues, "then filter values, new promise and formater args returned as expected");
		});
	});
	QUnit.test("Get selected facet filter list values", function(assert) {
		//act
		var oSelectedValueDataPromise = ffListHandler.getSelectedFFValues();
		oSelectedValueDataPromise.then(function(oValues) {
			//arrangement
			var oExpectedValues = {
				aSelectedFilterValues : [ "20000101" ],
				oFilterRestrictionPropagationPromiseForSelectedValues : oNewPromiseForStartDateSelectedValues.promise()
			};
			//assert
			assert.deepEqual(oValues, oExpectedValues, "then selected filter values data and new promise returned as expected");
		});
	});
	QUnit.test("Set selected values on filter", function(assert) {
		//arrangement
		var aSelectedFilterValues = [ "20000201" ];
		//act
		ffListHandler.setSelectedFFValues(aSelectedFilterValues);
		//assert
		assert.equal(oConfiguredFilter.setSelectedValues.calledOnce, true, "then setSelectedValues is called once");
	});
	QUnit.module("Facet Filter List Handler - Negative Tests", {
		beforeEach : function() {
			//oCoreApi stub
			oCoreApi = {
				getTextNotHtmlEncoded : doNothing,
				createMessageObject : doNothing,
				putMessage : sinon.spy()
			};
			//oUiApi stub
			oUiApi = {
				getEventCallback : doNothing
			};
			//Stub for getValues() of start date filter reject case
			getValuesStubForReject = sinon.stub();
			//Stub for getSelectedValues()
			var getSelectedValuesStub = sinon.stub();
			var oDeferredSelectedValuesForReject = jQuery.Deferred();
			oDeferredSelectedValuesForReject.reject("Error");
			getSelectedValuesStub.onFirstCall().returns(oDeferredSelectedValuesForReject.promise());
			//Start filter and its functions
			oConfiguredFilter = {
				getLabel : getLabelForStartDate,
				getValues : getValuesStubForReject,
				getSelectedValues : getSelectedValuesStub
			};
			ffListHandler = new sap.apf.ui.utils.FacetFilterListHandler(oCoreApi, oUiApi, oConfiguredFilter, oFacetFilterListConverter);
		}
	});
	QUnit.test("Get facet filter list data request fails", function(assert) {
		//arrangement
		var oDeferredValuesForReject = jQuery.Deferred();
		oDeferredValuesForReject.reject("Error");
		getValuesStubForReject.onFirstCall().returns(oDeferredValuesForReject.promise());
		//act
		var oFacetFilterListDataPromise = ffListHandler.getFacetFilterListData();
		//assert
		oFacetFilterListDataPromise.then(function(aData) {
			return aData;
		}, function(aData) {
			assert.deepEqual(aData, [], "then promise is resolved with empty array");
			assert.equal(oCoreApi.putMessage.calledOnce, true, "and error message is logged");
		});
	});
	QUnit.test("Get facet filter list data returns no data []", function(assert) {
		//arrangement
		var oDeferredValuesForEmpty = jQuery.Deferred();
		oDeferredValuesForEmpty.resolve([]);
		getValuesStubForReject.onFirstCall().returns(oDeferredValuesForEmpty.promise());
		//act
		var oFacetFilterListDataPromiseForNull = ffListHandler.getFacetFilterListData();
		//assert
		oFacetFilterListDataPromiseForNull.then(function(aData) {
			return aData;
		}, function(aData) {
			assert.deepEqual(aData, [], "then promise is resolved with empty array");
			assert.equal(oCoreApi.putMessage.calledOnce, true, "and error message is logged");
		});
	});
	QUnit.test("Get facet filter list data returns null", function(assert) {
		//arrangement
		var oDeferredValuesForNull = jQuery.Deferred();
		oDeferredValuesForNull.resolve(null);
		getValuesStubForReject.onFirstCall().returns(oDeferredValuesForNull.promise());
		//act
		var oFacetFilterListDataPromiseForNull = ffListHandler.getFacetFilterListData();
		//assert
		oFacetFilterListDataPromiseForNull.then(function(aData) {
			return aData;
		}, function(aData) {
			assert.deepEqual(aData, [], "then promise is resolved with empty array");
			assert.equal(oCoreApi.putMessage.calledOnce, true, "and error message is logged");
		});
	});
	//TODO What should happen when getSelectedValues() fails?
	//	QUnit.test("Get facet filter selected list data request fails", function(assert) {
	//		//act
	//		var oFacetFilterListDataPromise = ffListHandler.getSelectedFFValues();
	//		//assert
	//		oFacetFilterListDataPromise.then(function(aSelectedFilterValues) {
	//			assert.deepEqual(aSelectedFilterValues, [], "then selected values are null");
	//			assert.equal(oCoreApi.putMessage.calledOnce, true, "and error message is logged");
	//		});
	//	});
}());