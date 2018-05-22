/*
 * Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved
 */
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.declare('test.sap.apf.ui.utils.tFacetFilterHandler');
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require('sap.apf.ui.utils.facetFilterHandler');
jQuery.sap.require('sap.apf.utils.filter');
jQuery.sap.require('sap.apf.core.constants');
sap.ui.getCore().loadLibrary('sap.m');
(function() {
	// Mock oPathContextHandler
	var oPathContextHandlerStub = {
		update : sinon.spy(),
		saveInitialContext : sinon.spy()
	};
	// Mock oUiApi
	var addFacetFilterSpy = sinon.spy();
	var oUiApiStub = {
		contextChanged : sinon.spy(),
		getLayoutView : sinon.stub().returns({
			getController : sinon.stub().returns({
				addFacetFilter : addFacetFilterSpy
			})
		})
	};
	var subHeaderInstanceStub = {
		addItem : sinon.spy()
	};
	var oCoreApiStub, oSBHandlerStub;
	var onContextChangedSpy = sinon.spy();
	var getFormattedFiltersSpy = sinon.spy();
	module("FacetFilterHandler Test- PCH", {
		setup : function() {
			var oSBFilterDeferred = new jQuery.Deferred();
			var oFilterStub = new sinon.stub(); // Hack to avoid the side effects produced by stub.returns() method. (https://groups.google.com/forum/#!topic/sinonjs/wI-uv8ZhYqc)
			oFilterStub.returns(new sap.apf.utils.Filter(new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging()));
			/********Stub Dependencies********/
			// Mock oCoreApi
			oCoreApiStub = {
				getFacetFilterConfigurations : sinon.stub().returns([ {
					"type" : "facetFilter",
					"id" : "toDateFilter",
					"property" : "P_ToDate",
					"alias" : "EndDate",
					"valueHelpRequest" : "requestTimeFrameInitialStep",
					"multiSelection" : "false",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "P_ToDate"
					}
				} ]),
				createFilter : oFilterStub
			};
			// Mock oSBHandler
			oSBHandlerStub = {
				initializeTest : function() {
					oSBFilterDeferred.resolveWith(this, [ [ {
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
					} ] ]);
				},
				initialize : sinon.stub().returns(oSBFilterDeferred.resolveWith(this, [ [ {
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
				} ] ])),
				getAllFilters : sinon.stub().returns(oSBFilterDeferred.promise())
			};
			sinon.stub(sap.ui, "view", sinon.stub().returns({
				onContextChanged : onContextChangedSpy,
				getFormattedFilters : getFormattedFiltersSpy
			}));
			//			/******** Instantiate facetFilterHandler ********/
			this.oFacetFilterHandler = new sap.apf.ui.utils.FacetFilterHandler({
				oCoreApi : oCoreApiStub,
				oSBHandler : oSBHandlerStub,
				oPathContextHandler : oPathContextHandlerStub,
				oUiApi : oUiApiStub
			});
		},
		teardown : function() {
			sap.ui.view.restore();
		}
	});
	test("Initialization of Facet Filter Handler", function() {
		this.oFacetFilterHandler.initialize();
		ok(oSBHandlerStub.initialize.calledOnce, "SBHandler initialized.");
		ok(oSBHandlerStub.getAllFilters.calledOnce, "SBHandler filter received.");
		ok(oCoreApiStub.getFacetFilterConfigurations.calledOnce, "Facet Filter Configuration read.");
		var aExpecedArgsForUpdatePathContext = [ {
			"filterName" : "P_ToDate",
			"serializedFilter" : {
				"id" : "filterTopAnd",
				"type" : "filterAnd",
				"expressions" : [],
				"terms" : [ {
					"id" : "P_ToDate",
					"type" : "filterOr",
					"expressions" : [ {
						"name" : "P_ToDate",
						"operator" : "EQ",
						"value" : "20140531"
					} ],
					"terms" : []
				} ]
			}
		} ];
		var aActualArgsForUpdatePathContext = [];
		oPathContextHandlerStub.update.args.forEach(function(arg) {
			var oArg = {
				filterName : arg[0],
				serializedFilter : arg[1].serialize()
			};
			aActualArgsForUpdatePathContext.push(oArg);
		});
		deepEqual(aActualArgsForUpdatePathContext, aExpecedArgsForUpdatePathContext, "PathContextHandler updated with appropriate filters.");
		ok(oPathContextHandlerStub.saveInitialContext.calledOnce, "Initial Context Saved.");
	});
	module("FacetFilterHandler Test", {
		setup : function() {
			var oSBFilterDeferred = new jQuery.Deferred();
			var oFilterStub = new sinon.stub(); // Hack to avoid the side effects produced by stub.returns() method. (https://groups.google.com/forum/#!topic/sinonjs/wI-uv8ZhYqc)
			oFilterStub.returns(new sap.apf.utils.Filter(new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging()));
			/********Stub Dependencies********/
			// Mock oCoreApi
			oCoreApiStub = {
				getFacetFilterConfigurations : sinon.stub().returns([ {
					"type" : "facetFilter",
					"id" : "toDateFilter",
					"property" : "P_ToDate",
					"alias" : "EndDate",
					"valueHelpRequest" : "requestTimeFrameInitialStep",
					"multiSelection" : "false",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "P_ToDate"
					}
				}, {
					"type" : "facetFilter",
					"id" : "companyCodeFilter",
					"property" : "CompanyCode",
					"valueHelpRequest" : "requestCompanyCodeInitialStep",
					"filterResolutionRequest" : "requestCompanyCodeInitialStep",
					"multiSelection" : "true",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "CompanyCode"
					}
				}, {
					"type" : "facetFilter",
					"id" : "salesOrganizationFilter",
					"property" : "SalesOrganization",
					"valueHelpRequest" : "requestDSObySalesOrganization",
					"multiSelection" : "true",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "SalesOrganization"
					}
				} ]),
				createFilter : oFilterStub
			};
			// Mock oSBHandler
			oSBHandlerStub = {
				initializeTest : function() {
					oSBFilterDeferred.resolveWith(this, [ [ {
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
					} ] ]);
				},
				initialize : sinon.stub().returns(oSBFilterDeferred.resolveWith(this, [ [ {
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
				} ] ])),
				getAllFilters : sinon.stub().returns(oSBFilterDeferred.promise())
			};
			sinon.stub(sap.ui, "view", sinon.stub().returns({
				onContextChanged : onContextChangedSpy,
				getFormattedFilters : getFormattedFiltersSpy
			}));
			//			/******** Instantiate facetFilterHandler ********/
			this.oFacetFilterHandler = new sap.apf.ui.utils.FacetFilterHandler({
				oCoreApi : oCoreApiStub,
				oSBHandler : oSBHandlerStub,
				oPathContextHandler : oPathContextHandlerStub,
				oUiApi : oUiApiStub
			});
		},
		teardown : function() {
			sap.ui.view.restore();
		}
	});
	test("Drawing Facet Filter", function() {
		this.oFacetFilterHandler.initialize();
		this.oFacetFilterHandler.drawFacetFilter(subHeaderInstanceStub);
		ok(subHeaderInstanceStub.addItem.calledOnce, "Facet Filter added as item inside sub header");
	});
	test("Context Changed Event Handler", function() {
		this.oFacetFilterHandler.initialize();
		this.oFacetFilterHandler.contextChanged();
		ok(!onContextChangedSpy.called, "Context Changed on Facet Filter does not get triggered when facet filter is not drawn.");
		this.oFacetFilterHandler.drawFacetFilter(subHeaderInstanceStub);
		this.oFacetFilterHandler.contextChanged();
		ok(onContextChangedSpy.calledOnce, "Context Changed on Facet Filter gets trigerred when facet filter is drawn.");
	});
	test("getFormattedFilters Test", function() {
		this.oFacetFilterHandler.initialize();
		ok(!this.oFacetFilterHandler.getFormattedFilters(), "returns false value when facet filter is not available.");
		this.oFacetFilterHandler.drawFacetFilter(subHeaderInstanceStub);
		this.oFacetFilterHandler.getFormattedFilters();
		ok(getFormattedFiltersSpy.calledOnce, "getFormattedFilters on Facet Filter gets invoked when facet filter is drawn.");
	});
}());