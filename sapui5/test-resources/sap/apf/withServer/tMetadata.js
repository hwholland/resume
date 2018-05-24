jQuery.sap.declare('sap.apf.withServer.tMetadata');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.ajax');
jQuery.sap.require('sap.apf.core.sessionHandler');
jQuery.sap.require('sap.apf.core.odataRequest');
jQuery.sap.require('sap.ui.model.odata.ODataModel');
jQuery.sap.require('sap.apf.core.metadata');
jQuery.sap.require('sap.apf.testhelper.createDefaultAnnotationHandler');

(function() {
	'use strict';
	/*globals OData, window */
	if (!sap.apf.withServer.tMetadata) {
		sap.apf.withServer.tMetadata = {};
		sap.apf.withServer.tMetadata.commonIsolatedSetup = function(oContext) {
			oContext.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			var oMessageHandler = oContext.oMessageHandler;
			oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : oContext.oMessageHandler
				}
			});
			oContext.oCoreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			oContext.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			oContext.oMetadataInject = {};
			oContext.oMetadataInject.coreApi = oContext.oCoreApi;
			oContext.oMetadataInject.messageHandler = oContext.oMessageHandler;
			oContext.oMetadataInject.hashtable = sap.apf.utils.Hashtable;
			oContext.oMetadataInject.entityTypeMetadata = sap.apf.core.EntityTypeMetadata;
			oContext.oMetadataInject.annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
		};
	}
	QUnit.module('Metadata', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.withServer.tMetadata.commonIsolatedSetup(this);
			this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
				done();
			});
			this.oCoreApi.getXsrfToken = function(sServiceRootPath) {
				return this.oAuthTestHelper.getXsrfToken();
			}.bind(this);
		}
	});
	QUnit.test('Get metadata for property', function(assert) {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		var oCompanyCode = {
			name : "CompanyCode",
			dataType : {
				type : "Edm.String",
				maxLength : "4"
			},
			"aggregation-role" : "dimension",
			"text" : "CompanyCodeName",
			"label" : "Company Code"
		};
		var oSAPClient = {
			name : "SAPClient",
			dataType : {
				type : "Edm.String",
				maxLength : "3"
			},
			"aggregation-role" : "dimension",
			"label" : "SAP Client"
		};
		var oNetDueDays = {
			name : "NetDueDays",
			dataType : {
				type : "Edm.Int32"
			},
			"aggregation-role" : "dimension",
			"label" : "Net Due Days"
		};
		var oPostingDate = {
			name : "PostingDate_E",
			dataType : {
				type : "Edm.DateTime"
			},
			"aggregation-role" : "dimension",
			"display-format" : "Date",
			"label" : "Posting Date"
		};
		var oDebitAmtInDisplayCrcy = {
			name : "DebitAmtInDisplayCrcy_E",
			dataType : {
				type : "Edm.Decimal",
				precision : "26"
			},
			"aggregation-role" : "measure",
			"filterable" : "false",
			"ISOCurrency" : "DisplayCurrency",
			"label" : "Receivables in Display Currency",
			"scale" : "DisplayCurrencyDecimals",
			"unit" : "DebitAmtInDisplayCrcy_E.CURRENCY"
		};
		var oYearMonth = {
			name : "YearMonth",
			dataType : {
				type : "Edm.String",
				maxLength : "6"
			},
			"aggregation-role" : "dimension",
			"isCalendarYearMonth" : "true",
			"label" : "Year and Month"
		};
		assert.equal(oMetadata.getPropertyMetadata("WCAReceivableQuery", "FiscalYear").isFiscalYear, "true", 'Metadata shall contain the annotation');
		assert.deepEqual(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "CompanyCode"), oCompanyCode, 'All metadata of the property ("Edm.Decimal, Precision:"34") received');
		assert.deepEqual(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "SAPClient"), oSAPClient, 'All metadata of the property ("Edm.String", MaxLength:"3") received');
		assert.deepEqual(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "NetDueDays"), oNetDueDays, 'All metadata of the property ("Edm.Int32") received');
		assert.deepEqual(oMetadata.getPropertyMetadata("WCAOpenReceivableQuery", "PostingDate_E"), oPostingDate, 'All metadata of the property ("Edm.DateTime") received');
		assert.deepEqual(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "YearMonth"), oYearMonth, 'Annotation "yearmonth" of the property YearMonth contains value "yyyymm"');
		assert.deepEqual(oMetadata.getPropertyMetadata("WCAClearedReceivableQuery", "DebitAmtInDisplayCrcy_E"), oDebitAmtInDisplayCrcy,
				'Entity type DebitAmtInDisplayCrcy_E: annotation "unit" of the property DebitAmtInDisplayCrcy_E contains value "DisplayCurrency"');
		assert.equal(oMetadata.getPropertyMetadata("YearMonthQueryResults", "Year").isCalendarYear, "true", "Property 'Year' of entity set 'YearMonthQueryResults' has attribute 'isCalendarYear'");
		assert.equal(oMetadata.getPropertyMetadata("YearMonthQueryResults", "StartDate").isCalendarDate, "true", "Property 'StartDate' of entity set 'YearMonthQueryResults' has attribute 'isCalendarDate'");
	});
	QUnit.test('Get parameters for entity type', function(assert) {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		assert.throws(function() {
			oMetadata.getParameterEntitySetKeyProperties();
		}, "Error successfully thrown due to missing argument for getParameterEntitySetKeyProperties");
		var expectedResult = [ {
			"dataType" : {
				"maxLength" : "3",
				"type" : "Edm.String"
			},
			"label" : "SAP Client",
			"name" : "P_SAPClient",
			"nullable" : "false",
			"parameter" : "mandatory"
		}, {
			"dataType" : {
				"maxLength" : "8",
				"type" : "Edm.String"
			},
			"isCalendarDate" : "true",
			"label" : "From Date",
			"name" : "P_FromDate",
			"nullable" : "false",
			"parameter" : "mandatory"
		}, {
			"dataType" : {
				"maxLength" : "8",
				"type" : "Edm.String"
			},
			"isCalendarDate" : "true",
			"label" : "To Date",
			"name" : "P_ToDate",
			"nullable" : "false",
			"parameter" : "mandatory"
		}, {
			"dataType" : {
				"maxLength" : "5",
				"type" : "Edm.String"
			},
			"label" : "Display Currency",
			"name" : "P_DisplayCurrency",
			"nullable" : "false",
			"parameter" : "mandatory"
		}, {
			"dataType" : {
				"maxLength" : "4",
				"type" : "Edm.String"
			},
			"defaultValue" : "M",
			"label" : "Currency Exchange Rate Type",
			"name" : "P_ExchangeRateType",
			"nullable" : "false",
			"parameter" : "mandatory"
		}, {
			"dataType" : {
				"maxLength" : "8",
				"type" : "Edm.String"
			},
			"defaultValue" : "00000000",
			"isCalendarDate" : "true",
			"label" : "Currency Exchange Rate Date",
			"name" : "P_ExchangeRateDate",
			"nullable" : "false",
			"parameter" : "mandatory"
		}, {
			"dataType" : {
				"type" : "Edm.Int32"
			},
			"defaultValue" : "10",
			"label" : "Width of Aging Interval",
			"name" : "P_AgingGridMeasureInDays",
			"nullable" : "false",
			"parameter" : "mandatory"
		}, {
			"dataType" : {
				"type" : "Edm.Int32"
			},
			"defaultValue" : "10",
			"label" : "Width of Net Due Days Interval",
			"name" : "P_NetDueGridMeasureInDays",
			"nullable" : "false",
			"parameter" : "mandatory"
		}, {
			"dataType" : {
				"type" : "Edm.Int32"
			},
			"defaultValue" : "10",
			"label" : "Width of Days in Arrears Interval",
			"name" : "P_NetDueArrearsGridMsrInDays",
			"nullable" : "false",
			"parameter" : "mandatory"
		} ];
		expectedResult.forEach(function(property) {
			property.isKey = true;
		});
		assert.deepEqual(oMetadata.getParameterEntitySetKeyProperties("WCADaysSalesOutstandingQuery"), expectedResult, 'Nine parameters with their attributes expected');
	});
	QUnit.test('Get filterable properties of entity type', function(assert) {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		assert.deepEqual(oMetadata.getFilterableProperties("CurrencyQuery"), [ "SAPClient", "Currency", "CurrencyShortName" ], 'Array with property names expected');
	});
	QUnit.test('Get metadata for an entitytype', function(assert) {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		var oExpected = {
			"requiresFilter" : "true",
			"requiredProperties" : "SAPClient"
		};
		assert.deepEqual(oMetadata.getEntityTypeAnnotations("CurrencyQuery"), oExpected);
	});
	/*
	QUnit.module('Metadata Error Handling', {
	beforeEach : function() {
			QUnit.stop();
			sap.apf.withServer.tMetadata.commonIsolatedSetup(this);
			this.oSavedXmlHttpRequest = window.XMLHttpRequest;
			
			this.bWasErrorThrown = false;
			this.oCoreApi.check = function(booleExpr, sMessage, sCode) {
				if (!booleExpr) {
					this.bWasErrorThrown = true;
					throw new Error(sMessage);
				}
			}.bind(this);
			this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
				window.XMLHttpRequest = function() {
					this.open = function() {

					};
					this.send = function() {

					};
					this.setRequestHeader = function() {

					};
					this.responseXML = "";
					this.responseText = "";

				};
				QUnit.start();
			}.bind(this));
			this.oCoreApi.getXsrfToken = function(sServiceRootPath) {
				return this.oAuthTestHelper.getXsrfToken();
			}.bind(this);
		},
	afterEach : function() {
			window.XMLHttpRequest = this.oSavedXmlHttpRequest;
		}
	});
	QUnit.test('Check if access on undefined properties in getFilterableProperties is handled', function() {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		throws(function() {
			oMetadata.getFilterableProperties("WCAClearedReceivableQuery");
	assert.ok(this.bWasErrorThrown);
		}, "Error expected due calling getFilterableProperties");
	});
	QUnit.test('Check if access on undefined properties in getEntityTypeAnnotations is handled', function() {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		throws(function() {
			oMetadata.getEntityTypeAnnotations("CurrencyQuery");
	assert.ok(!this.bWasErrorThrown);
		}, "Error expected due calling getFilterableProperties");
	});
	QUnit.test('Check if access on undefined properties in getParameterEntitySetKeyProperties is handled', function() {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		throws(function() {
			oMetadata.getParameterEntitySetKeyProperties("WCAClearedReceivableQuery");
	assert.ok(this.bWasErrorThrown);
		}, "Error expected due calling getParameterEntitySetKeyProperties");
	});
	QUnit.test('Check if access on undefined properties in getPropertyMetadata is handled', function() {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		throws(function() {
			oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "CompanyCode");
	assert.ok(this.bWasErrorThrown);
		}, "Error expected due calling getParameterEntitySetKeyProperties");
	});

	*/
	QUnit.module('Metadata hash behavior', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.withServer.tMetadata.commonIsolatedSetup(this);
			this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
				done();
			});
			this.oCoreApi.getXsrfToken = function(sServiceRootPath) {
				return this.oAuthTestHelper.getXsrfToken();
			}.bind(this);
		}
	});
	QUnit.test('Check is "getPropertyMetadata" return the same object reference as before', function(assert) {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		assert.ok(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "CompanyCode") === oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "CompanyCode"), 'Same object reference expected');
	});
	QUnit.test('Check is "getParameterEntitySetKeyProperties" return the same object reference as before', function(assert) {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		assert.ok(oMetadata.getParameterEntitySetKeyProperties("WCADaysSalesOutstandingQuery") === oMetadata.getParameterEntitySetKeyProperties("WCADaysSalesOutstandingQuery"), 'Same object reference expected');
	});
	QUnit.test('Check is "getEntityTypeAnnotations" return the same object reference as before', function(assert) {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		assert.ok(oMetadata.getEntityTypeAnnotations("CurrencyQuery") === oMetadata.getEntityTypeAnnotations("CurrencyQuery"), 'Same object reference expected');
	});
	QUnit.test('Check is "getFilterableProperties" return the same object reference as before', function(assert) {
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		assert.ok(oMetadata.getFilterableProperties("WCAClearedReceivableQuery") === oMetadata.getFilterableProperties("WCAClearedReceivableQuery"), 'Same object reference expected');
	});
})();