/*global sap,jQuery sinon, OData */
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../');
jQuery.sap.require("sap.apf.Component");
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.ushellHelper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
jQuery.sap.require('sap.apf.testhelper.stub.ajaxStub');
jQuery.sap.require('sap.apf.testhelper.stub.textResourceHandlerStub');

(function() {
	'use strict';
	var sapApfAppConfigPath = "/pathOfNoInterest/applicationConfiguration.json"; // stubJQueryAjax stubs any path matching "applicationConfiguration.json"
	var sapApfAppConfigPathOfComponent = "/pathOfNoInterestHugo/hugo/applicationConfiguration.json"; // stubJQueryAjax stubs any path matching "applicationConfiguration.json"
	var sapApfAppConfigPathDefault = "/pathOfNoInterestDefault/default/applicationConfiguration.json";
	var sapApfAppConfigPathFacetFilter = "/pathOfNoInterestDefault/applicationConfigurationFacetFilter.json";
	function defineApiSpies(testModule, apiReferences) {
		testModule.spyCoreApiLoadApplicationConfig = sinon.spy(apiReferences.coreApi, "loadApplicationConfig");
		testModule.spyUiCreateApplicationLayout = sinon.spy(apiReferences.uiApi, "createApplicationLayout");
		testModule.spyGetLayoutView = sinon.spy(apiReferences.uiApi, "getLayoutView");
		testModule.spyUiHandleStartup = sinon.spy(apiReferences.uiApi, "handleStartup");
		testModule.spyNavigationHandlerCheckMode = sinon.spy(apiReferences.navigationHandler, "checkMode");
	}
	/**
	 * @description Creates a component inheriting from sap.apf.Component where its api instance is stubbed, using the "probe" concept.
	 * @param {object} testModule reference to the test's "this".
	 * @param {Function} [createContent] The createContent function of the Component. The default is an empty function.
	 * @param {object} [startParameters] optional component's start parameters. Value undefined is allowed.
	 * @param {object} [loadApplPathForComponent] The path/filename of the application configuration which will be loaded by the Component,
	 *              unless overridden by the start parameter 'sap-apf-app-config-path'.
	 * @returns {sap.apf.Component} the created component
	 */
	function createApplicationComponentWithStubbedApi(testModule, createContentF, startParameters, loadApplPathForComponent) {
		sap.apf.testhelper.doubles = sap.apf.testhelper.doubles || {};
		sap.apf.testhelper.doubles.applComponentWithStubbedApi = sap.apf.testhelper.doubles.applComponentWithStubbedApi || {};
		/** Consumer Component build like DSO app for testing backward compatibility.
		 * Here, the parent call to sap.Component.init is replaced by a copy of that code in order to inject a probe */
		sap.apf.Component.extend("sap.apf.testhelper.doubles.applComponentWithStubbedApi.Component", {
			metadata : {
				"name" : "Component",
				"version" : "0.0.0"
			},
			init : function() {
				var oReferences;
				var injectConstructors = {
					probe : function ApiProbe(apiReferences) { // a constructor for getting access to inner references of the api instance.
						oReferences = apiReferences;
						defineApiSpies(testModule, apiReferences); // a method defining sinon spies on inner references.
					}
				};
				this.getProbeReferences = function() {
					return oReferences;
				};
				this.oApi = new sap.apf.Api(this, injectConstructors);
				// After new ... the probe references are set.
				sap.apf.Component.prototype.init.apply(this, arguments);
			},
			createContent : function() {
				if (createContentF) {
					createContentF(this);
				}
			}
		});
		var oComponentParameter = {
			componentData : {
				startupParameters : (startParameters || {
					startupParameters : {}
				})
			}
		};
		var component = new sap.apf.testhelper.doubles.applComponentWithStubbedApi.Component(oComponentParameter);
		return component;
	}
	/**
	 * Creates a component whose createContent is structurally equal to the fin.ar.DSO application.
	 * @param testModule
	 * @param startParameters
	 * @param loadApplPathForComponent
	 * @returns {sap.apf.Component}
	 */
	function createComponentLikeDSO(testModule, startParameters, loadApplPathForComponent) {
		function createContent(component) {
			// Phase 1
			if (!loadApplPathForComponent) {
				loadApplPathForComponent = sapApfAppConfigPathDefault; // default path stubbed by  AJAX
			}
			component.getApi().loadApplicationConfig(loadApplPathForComponent);
			// Phase 2
			// FIXME: add test for SAPClient as a filter, in afterCallback??
			// Phase 3
			var layoutView = component.getApi().createApplicationLayout();
			// Phase 4
			sap.apf.Component.prototype.createContent.apply(component, arguments);
			return layoutView;
		}
		return createApplicationComponentWithStubbedApi(testModule, createContent, startParameters, loadApplPathForComponent);
	}
	QUnit.module("Component creation -- tests the test setup ", {
		beforeEach : function() {
			sap.apf.testhelper.stub.stubJQueryAjax();
			sap.apf.testhelper.ushellHelper.setup();
		},
		afterEach : function() {
			sap.apf.testhelper.ushellHelper.teardown();
			jQuery.ajax.restore();
		}
	});
	QUnit.test("API is stubbed and probe transfers the  references", function(assert) {
		var component = createComponentLikeDSO(this);
		assert.notStrictEqual(component.getProbeReferences(), undefined, "probe successfully created");
		assert.notStrictEqual(component.getProbeReferences().coreApi, undefined);
		assert.notStrictEqual(component.getProbeReferences().uiApi, undefined);
		assert.notStrictEqual(component.getProbeReferences().component, undefined);
		assert.notStrictEqual(component.getProbeReferences().serializationMediator, undefined);
	});
	QUnit.test("load application configuration THEN with default. This test also proves that the stubbed API instance is constructed, not the default of apf.Component.init", function(assert) {
		createComponentLikeDSO(this);
		assert.equal(this.spyCoreApiLoadApplicationConfig.getCall(0).args[0], sapApfAppConfigPathDefault);
	});
	QUnit.test("api instance is defined", function(assert) {
		var component = createComponentLikeDSO(this);
		assert.ok(component.getApi() !== undefined, "Api successfully created");
	});
	QUnit.module("Startup, test api without Component -- test locking against multiple execution. ", {
		beforeEach : function() {
			var that = this;
			sap.apf.testhelper.stub.stubJQueryAjax();
			this.oReferences = null;
			var injectConstructors = {
				probe : function ApiProbe(references) {
					that.oReferences = references;
				}
			};
			this.getMetadata = function() {
				var Metadata = function() {
					this.getComponentName = function() { return "comp1"; };
				};
				return new Metadata();
			};
			this.oApi = new sap.apf.Api(this, injectConstructors);
			// After new ... the references are set.
			this.spyLoadApplicationConfig = sinon.spy(this.oApi, "loadApplicationConfig");
			this.coreApiLoadSpy = sinon.spy(this.oReferences.coreApi, "loadApplicationConfig");
			this.AnalyticalConfigSpy = sinon.spy(this.oReferences.coreApi.getStartParameterFacade(), "getAnalyticalConfigurationId");
			this.layoutViewSpy = sinon.spy(this.oReferences.uiApi, "getLayoutView");
			//this.getApi().activateOnErrorHandling(true);
		},
		afterEach : function() {
			jQuery.ajax.restore();
			this.oApi.loadApplicationConfig.restore();
			this.oReferences.coreApi.loadApplicationConfig.restore();
			this.AnalyticalConfigSpy.restore();
			this.layoutViewSpy.restore();
			this.spyLoadApplicationConfig.restore();
		}
	});
	QUnit.test("WHEN calling loadApplicationConfig twice THEN the second call is blocked", function(assert) {
		this.oApi.loadApplicationConfig(sapApfAppConfigPath);
		assert.equal(this.spyLoadApplicationConfig.callCount, 1, "loadApplicationConfig called on API");
		assert.equal(this.spyLoadApplicationConfig.getCall(0).args[0], sapApfAppConfigPath, "loadApplicationConfig has correct path");
		assert.equal(this.coreApiLoadSpy.callCount, 1, "loadApplicationConfig called on core API");
		assert.equal(this.coreApiLoadSpy.getCall(0).args[0], sapApfAppConfigPath, "loadApplicationConfig on coreApi has correct path");
		assert.equal(this.AnalyticalConfigSpy.callCount, 1, "by indirect method: loadApplicationConfig call by exited immediately");
		var callCount = this.spyLoadApplicationConfig.callCount;
		this.oApi.loadApplicationConfig(sapApfAppConfigPathOfComponent);
		assert.equal(this.spyLoadApplicationConfig.callCount, callCount + 1, "loadApplicationConfig called again on API");
		assert.equal(this.spyLoadApplicationConfig.getCall(callCount).args[0], sapApfAppConfigPathOfComponent, "loadApplicationConfig has correct path"); // callCount less 1 as array index.
		assert.equal(this.coreApiLoadSpy.callCount, callCount + 1, "loadApplicationConfig called again on core API");
		assert.equal(this.AnalyticalConfigSpy.callCount, callCount, "by indirect method: further call blocked");
	});
	QUnit.module("Component startup -- Forward Navigation", {
		beforeEach : function() {
			var testEnv = this;
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			sap.apf.testhelper.stub.stubJQueryAjax();
			sap.apf.testhelper.ushellHelper.setup();
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.fnMetadata = sap.apf.core.Metadata;
			sap.apf.core.Metadata = sap.apf.testhelper.doubles.Metadata;
			this.filterFromFacetFilterConfiguration = new sap.apf.core.utils.Filter(this.messageHandler, "CompanyCode", sap.apf.core.constants.FilterOperators.EQ, "1000");
			this.fnExternalContext = sap.apf.utils.ExternalContext;
			sap.apf.utils.ExternalContext = function() {
				this.getCombinedContext = function() {
					if (testEnv.xappStateFilter && testEnv.filterFromSmartBusiness) {
						var combinedFilter = new sap.apf.core.utils.Filter(testEnv.messageHandler);
						combinedFilter.addAnd(testEnv.xappStateFilter).addAnd(testEnv.filterFromSmartBusiness);
						return jQuery.Deferred().resolve(combinedFilter);
					}
					if (testEnv.xappStateFilter) {
						return jQuery.Deferred().resolve(testEnv.xappStateFilter);
					}
					if (testEnv.filterFromSmartBusiness) {
						return jQuery.Deferred().resolve(testEnv.filterFromSmartBusiness);
					}
					return jQuery.Deferred().resolve(new sap.apf.core.utils.Filter(testEnv.messageHandler));
				};
			};
		},
		addFilterToXappState : function() {
			this.xappStateFilter = new sap.apf.core.utils.Filter(this.messageHandler, "Customer", sap.apf.core.constants.FilterOperators.EQ, "SAP");
		},
		addSmartBusinessEvaluation : function() {
			this.fnSmartBusiness = sap.apf.utils.SmartBusinessHandler;
			this.filterFromSmartBusiness = new sap.apf.core.utils.Filter(this.messageHandler, "Smart", sap.apf.core.constants.FilterOperators.EQ, "Business");
			sap.apf.utils.SmartBusinessHandler = function() {
				this.initialize = function() {
				};
				this.getEvaluationId = function() {
					return "";
				};
				this.getAllFilters = function() {
					var sbFilter = [ {
						ID : "SmartBusinessEvalId",
						NAME : "Smart",
						OPERATOR : "EQ",
						TYPE : "FI",
						VALUE_1 : "Business",
						VALUE_2 : ""
					} ];
					return jQuery.Deferred().resolve(sbFilter);
				};
			};
		},
		afterEach : function() {
			jQuery.ajax.restore();
			sap.apf.testhelper.ushellHelper.teardown();
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
			sap.apf.core.Request = this.fnRequest;
			sap.apf.core.Metadata = this.fnMetadata;
			if (this.fnSmartBusiness) {
				sap.apf.utils.SmartBusinessHandler = this.fnSmartBusiness;
			}
			sap.apf.utils.ExternalContext = this.fnExternalContext;
		}
	});
	QUnit.test("Consumption of filter from xapp-state", function(assert) {
		assert.expect(1);
		this.addFilterToXappState();
		var component = createComponentLikeDSO(this);
		var oApi = component.getApi();
		oApi.createStep("stepTemplate1", function() {
		});
		var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
		oApi.updatePath(callbackUpdate.bind(this));
		function callbackUpdate() {
			assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), this.xappStateFilter.toUrlParam(), "First step received filter from xapp-state");
		}
	});
	QUnit.test("Consumption of filter from Facet Filter", function(assert) {
		assert.expect(1);
		var component = createComponentLikeDSO(this, undefined, sapApfAppConfigPathFacetFilter);
		var oApi = component.getApi();
		oApi.createStep("stepTemplate1", function() {
		});
		var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
		oApi.updatePath(callbackUpdate.bind(this));
		function callbackUpdate() {
			assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), '((CompanyCode%20eq%20%271000%27))', "First step received filter from xapp-state and FacetFilter");
		}
	});
	QUnit.test("Consumption of filter from SmartBusiness", function(assert) {
		assert.expect(1);
		this.addSmartBusinessEvaluation();
		var component = createComponentLikeDSO(this, {
			evaluationId : "SmartBusiness"
		});
		var oApi = component.getApi();
		oApi.createStep("stepTemplate1", function() {
		});
		var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
		oApi.updatePath(callbackUpdate.bind(this));
		function callbackUpdate() {
			assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), this.filterFromSmartBusiness.toUrlParam(), "First step received filter from SmartBusiness");
		}
	});
	QUnit.test("Consumption of filter from xapp-state, Facet Filter and SmartBusiness", function(assert) {
		assert.expect(1);
		this.addFilterToXappState();
		this.addSmartBusinessEvaluation();
		var expectedFilter = new sap.apf.core.utils.Filter(this.messageHandler);
		expectedFilter.addAnd(this.filterFromSmartBusiness).addAnd(this.xappStateFilter).addAnd(this.filterFromFacetFilterConfiguration);
		var component = createComponentLikeDSO(this, {
			evaluationId : "SmartBusiness"
		}, sapApfAppConfigPathFacetFilter);
		var oApi = component.getApi();
		oApi.createStep("stepTemplate1", function() {
		});
		var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
		oApi.updatePath(callbackUpdate.bind(this));
		function callbackUpdate() {
			assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), '(((Smart%20eq%20%27Business%27)%20and%20(Customer%20eq%20%27SAP%27))%20and%20(CompanyCode%20eq%20%271000%27))' , "First step received filter from xapp-state, FacetFilter and SmartBusiness");
		}
	});
	//   QUnit.module("Component startup -- Backward Navigation", {
	//        beforeEach: function(){
	//        	this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
	//
	//        	sap.apf.testhelper.stub.stubJQueryAjax();
	//            sap.apf.testhelper.ushellHelper.setup();
	//            
	//            sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
	//            sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
	//            
	//            this.fnRequest = sap.apf.core.Request;
	//            sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
	//            
	//            this.fnMetadata = sap.apf.core.Metadata;
	//            sap.apf.core.Metadata = sap.apf.testhelper.doubles.Metadata;
	//            
	//            this.hashChanger = sap.ui.core.routing.HashChanger;
	//        	sap.ui.core.routing.HashChanger = {
	//        			getInstance : function(){
	//        				return {
	//        					getHash : function(){
	//        						return "sap-iapp-state=123456ABcd";
	//        					}, 
	//        					replaceHash : function(){
	//        						return;
	//        					}
	//        				};
	//        			} 
	//        	};
	//        	
	//        	var iAppStateExpression = {
	//        			name: "FilterFromIappState",
	//        			operator: sap.apf.core.constants.FilterOperators.EQ,
	//        			value: "12345"
	//        	};
	//        	this.filterFromIappState = new sap.apf.utils.Filter(this.messageHandler);
	//        	this.filterFromIappState.getTopAnd().addExpression(iAppStateExpression);
	//        	
	//        	sap.ushell.sapApfState = {
	//        			path : {
	//        				steps : [],  
	//        				indicesOfActiveSteps : []
	//        			},        				
	//        			context : this.filterFromIappState.serialize()
	//        	};
	//        },
	//        afterEach: function(){
	//            jQuery.ajax.restore();
	//            sap.apf.testhelper.ushellHelper.teardown();
	//            sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
	//            sap.apf.core.Request = this.fnRequest;
	//            sap.apf.core.Metadata = this.fnMetadata;
	//            sap.ui.core.routing.HashChanger = this.hashChanger;
	//        }
	//    });
	//
	//    QUnit.test("Consumption of filter from iapp-state", function(assert){
	//    	assert.expect(1);
	//		  
	//		var component = createComponentLikeDSO(this);
	//		var oApi = component.getApi();
	//		
	//		oApi.createStep("stepTemplate1", function(){});
	//		var spyFirstStepUpdate = sinon.spy(oApi.getSteps()[0], "update");
	//	
	//		oApi.updatePath(callbackUpdate.bind(this));
	//		 
	//		function callbackUpdate(){
	//			assert.equal(spyFirstStepUpdate.getCall(0).args[0].toUrlParam(), this.filterFromIappState.getInternalFilter().toUrlParam(), "First step received filter from iapp-state");
	//		}
	//    });
	QUnit.module("Component startup -- sequence of operations", {
		beforeEach : function() {
			sap.apf.testhelper.stub.stubJQueryAjax();
			sap.apf.testhelper.ushellHelper.setup();
		},
		afterEach : function() {
			sap.apf.testhelper.ushellHelper.teardown();
			jQuery.ajax.restore();
		}
	});
	QUnit.test("WHEN calling createApplicationLayout twice THEN the second call is blocked", function(assert) {
		var component = createComponentLikeDSO(this, {
			'sap-apf-app-config-path' : [ sapApfAppConfigPath ]
		}, sapApfAppConfigPathOfComponent);
		var oApi = component.getApi();
		assert.equal(this.spyUiCreateApplicationLayout.called, true, "called by createContent / startApf");
		assert.equal(this.spyGetLayoutView.callCount, 1, "called by createContent");
		var layout2 = oApi.createApplicationLayout();
		assert.equal(this.spyGetLayoutView.callCount, 1, "test objective");
		assert.notStrictEqual(layout2, undefined, "layout already created by very first call of createApplicationLayout is simply returned");
	});
	QUnit.test("WHEN creating DSO like Component with startParameter THEN loadApplicationConfig comes first", function(assert) {
		createComponentLikeDSO(this, {
			'sap-apf-app-config-path' : [ sapApfAppConfigPath ]
		}, sapApfAppConfigPathOfComponent);
		assert.ok(this.spyUiCreateApplicationLayout.calledAfter(this.spyCoreApiLoadApplicationConfig), "LoadApplicationConfig shall always exec before CreateApplicationLayout ");
		assert.ok(this.spyUiHandleStartup.calledAfter(this.spyCoreApiLoadApplicationConfig), "LoadApplicationConfig shall always exec before uiInstance.handleStartup ");
	});
	QUnit.test("WHEN creating DSO like Component without startParameter THEN loadApplicationConfig comes first (same sequence as with startParam)", function(assert) {
		createComponentLikeDSO(this);
		assert.ok(this.spyUiCreateApplicationLayout.calledAfter(this.spyCoreApiLoadApplicationConfig), "LoadApplicationConfig shall always exec before CreateApplicationLayout ");
		assert.ok(this.spyUiHandleStartup.calledAfter(this.spyCoreApiLoadApplicationConfig), "LoadApplicationConfig shall always exec before uiInstance.handleStartup ");
	});
	QUnit.test("WHEN creating DSO like Component with a start parameter THEN loadApplicationConfig is called with that start parameter", function(assert) {
		createComponentLikeDSO(this, {
			'sap-apf-app-config-path' : [ sapApfAppConfigPath ]
		}, sapApfAppConfigPathOfComponent);
		assert.equal(this.spyCoreApiLoadApplicationConfig.getCall(0).args[0], sapApfAppConfigPath, "load config on start param runs first");
		assert.equal(this.spyCoreApiLoadApplicationConfig.getCall(1).args[0], sapApfAppConfigPathOfComponent, "load config of appl component runs second");
	});
	QUnit.test("WHEN creating DSO like Component without start parameter THEN the loadApplicationConfig of the application Component is called", function(assert) {
		createComponentLikeDSO(this, undefined, sapApfAppConfigPathOfComponent);
		assert.equal(this.spyCoreApiLoadApplicationConfig.getCall(0).args[0], sapApfAppConfigPathOfComponent, "WHEN no start parameter THEN component path must be taken");
		assert.ok(this.spyCoreApiLoadApplicationConfig.callCount >= 1, "further call (but blocked, see prior tests above)");
	});
	QUnit.test("handleStartup receives navigationMode forward via promise", function(assert) {
		assert.expect(1);
		createComponentLikeDSO(this);
		this.spyUiHandleStartup.getCall(0).args[0].done(function(mode) {
			assert.ok(mode.navigationMode === 'forward', "navigation mode is forward");
		});
	});
	QUnit.test("Navigation handler checkMode is called during startup", function(assert) {
		createComponentLikeDSO(this);
		assert.ok(this.spyNavigationHandlerCheckMode.calledOnce, "Method is called");
	});

}());
