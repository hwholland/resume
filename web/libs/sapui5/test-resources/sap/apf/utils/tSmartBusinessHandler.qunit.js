/*
 * Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare('test.sap.apf.utils.tSmartBusinessHandler');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.utils.smartBusinessHandler');
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
(function() {
	var oInjectStub = {
		getApplicationConfigProperties : sinon.stub().returns({
			smartBusiness : {
				"runtime" : {
					"service" : "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata"
				}
			}
		}),
		createReadRequestByRequiredFilter : sinon.spy(),
		getTextNotHtmlEncoded : sinon.spy(),
		oMessageHandler : {
			createMessageObject : sinon.spy(),
			putMessage : sinon.spy()
		}
	};
	module("Smart Business Handler Tests - With Evaluation ID", {
		setup : function() {
			this.oInjectStub = oInjectStub;
			this.oInjectStub.startParameter = {
				getEvaluationId : function() {
					return "com.sap.apf.receivables.america";
				}
			};
			this.oSBHandler = new sap.apf.utils.SmartBusinessHandler(this.oInjectStub);
			this.oAjaxStub = sinon.stub();
			this.oSBResponse = {
				d : {
					results : [ {
						"__metadata" : {
							"uri" : "http://localhost:8080/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodat…eivables.america',TYPE='FI',NAME='CompanyCode',VALUE_1='CZ10',OPERATOR='BT')",
							"type" : "sap.hba.r.sb.core.odata.runtime.SMART_BUSINESS.EVALUATION_FILTERSType"
						},
						"ID" : "com.sap.apf.receivables.america",
						"TYPE" : "FI",
						"NAME" : "CompanyCode",
						"VALUE_1" : "CZ10",
						"OPERATOR" : "BT",
						"VALUE_2" : "GB40"
					}, {
						"__metadata" : {
							"uri" : "http://localhost:8080/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodat…ivables.america',TYPE='PA',NAME='P_ToDate',VALUE_1='20140531',OPERATOR='EQ')",
							"type" : "sap.hba.r.sb.core.odata.runtime.SMART_BUSINESS.EVALUATION_FILTERSType"
						},
						"ID" : "com.sap.apf.receivables.america",
						"TYPE" : "PA",
						"NAME" : "P_ToDate",
						"VALUE_1" : "20140531",
						"OPERATOR" : "EQ",
						"VALUE_2" : ""
					} ]
				}
			};
			sinon.stub(jQuery, "ajax").yieldsTo("success", this.oSBResponse);
		},
		teardown : function() {
			jQuery.ajax.restore();
		}
	});
	test("getEvaluationId Test", function() {
		var sActualEvalId = this.oSBHandler.getEvaluationId();
		equal(sActualEvalId, "com.sap.apf.receivables.america", "Returns correct Evaluation Id.");
	});
	test("initialize Test", function() {
		this.oSBHandler.initialize();
		ok(jQuery.ajax.calledOnce, "Ajax request fired to fetch SB Filters.");
		var sExpectedRequestUrl = "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata/EVALUATIONS('com.sap.apf.receivables.america')/FILTERS?$format=json";
		var sActualRequestUrl = jQuery.ajax.args[0][0].url;
		equal(sActualRequestUrl, sExpectedRequestUrl, "Request url generated as expected.");
	});
	test("getAllFilters Test", function() {
		this.oSBHandler.initialize();
		var oSBPromise = this.oSBHandler.getAllFilters();
		var oSelf = this;
		oSBPromise.then(function(aData) {
			equal(JSON.stringify(oSelf.oSBResponse.d.results), JSON.stringify(aData), "Returns all SB Filters");
		});
	});
	/* Without Evaluation ID */
	module("Smart Business Handler Tests - Without Evaluation ID", {
		setup : function() {
			this.oInjectStub = oInjectStub;
			this.oInjectStub.startParameter = {
				getEvaluationId : function() {
					return;
				}
			};
			this.oSBHandler = new sap.apf.utils.SmartBusinessHandler(this.oInjectStub);
		},
		teardown : function() {
			return;
		}
	});
	test("getEvaluationId Test", function() {
		var sActualEvalId = this.oSBHandler.getEvaluationId();
		ok(!sActualEvalId, "Returns Evaluation as 'undefined'.");
	});
	test("getAllFilters Test", function() {
		this.oSBHandler.initialize();
		var oSBPromise = this.oSBHandler.getAllFilters();
		oSBPromise.then(function(aData) {
			ok(!aData.length, "Returns empty array as SB Filters");
		});
	});
	/* Bad SmartBusiness Service */
	module("Smart Business Handler Tests -  Bad Smart Business Service", {
		setup : function() {
			this.oInjectStub = oInjectStub;
			this.oInjectStub.startParameter = {
				getEvaluationId : function() {
					return "com.sap.apf.receivables.america";
				}
			};
			this.oSBHandler = new sap.apf.utils.SmartBusinessHandler(this.oInjectStub);
			sinon.stub(jQuery, "ajax").yieldsTo("error", []);
		},
		teardown : function() {
			jQuery.ajax.restore();
		}
	});
	test("initialize Test", function() {
		this.oSBHandler.initialize();
		var oExpectedArgForCreateMessageObject = {
			code : "6011"
		};
		var oActualArgForCreateMessageObject = this.oInjectStub.oMessageHandler.createMessageObject.args[0][0];
		equal(JSON.stringify(oExpectedArgForCreateMessageObject), JSON.stringify(oActualArgForCreateMessageObject), "Message Object with proper message code created.");
		ok(this.oInjectStub.oMessageHandler.putMessage.calledOnce, "Put Message called once to post the fatal error.");
	});
}());