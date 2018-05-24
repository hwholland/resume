jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.createComponent');


jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerStubbedAjax');

(function () {
	'use strict';

	/**
	 * convenience function to define a filter //todo must be put in universal helper function
	 */
	function defineFilter (oApi, filters) {
		var oFilter = oApi.createFilter();
		var oExpression;
		var property;
		for(property in filters) {
			if (filters.hasOwnProperty(property)) {
				oExpression = {
					name : property,
					operator : sap.apf.core.constants.FilterOperators.EQ,
					value : filters[property]
				};
				oFilter.getTopAnd().addExpression(oExpression);
			}
		}
		return oFilter;
	}
	function getConfiguration() {
		return {
			analyticalConfigurationName: "configForTesting-tApi",
			steps: [],
			requests: [],
			bindings: [],
			categories: [],
			representationTypes: [],
			navigationTargets: []
		};
	}

	function setupTheIsolatedComponent(context) {
		var PatchedResourcePathHandler = function(inject) {
			sap.apf.testhelper.doubles.ResourcePathHandler.call(this, inject);
			sap.apf.testhelper.interfaces.IfResourcePathHandler.call(this);
			this.loadConfigFromFilePath = function() {
				var oConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
				this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
			};
		};
		var inject = {
				constructors : {
					ResourcePathHandler : PatchedResourcePathHandler
				}
		};
		if (context.stubs) {
			inject = jQuery.extend(true, inject, context.stubs);
		}
		if (!inject.constructors.Request) {
			inject.constructors.Request = sap.apf.testhelper.doubles.Request;
		}
		sap.apf.testhelper.createComponent(context, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true, componentId : "CompId1", path : "pathOfNoInterest",  inject : inject, componentData : {}});
		context.callbackForUpdatePath = function(oStep) {
			return null;
		};
	}

	QUnit.module('PathFilter with Apf Component', {
		beforeEach : function() {
			var that = this;
			this.stubs = {};
			this.stubs.constructors = {
					StartFilterHandler : function(inject) {
						sap.apf.utils.StartFilterHandler.call(this, inject);
						sinon.stub(this, "getCumulativeFilter", function() {
							return jQuery.Deferred().resolve(that.cumulativeFilter.getInternalFilter());
						});
					}
			};
			setupTheIsolatedComponent(this);
		},
		afterEach : function() {
			this.oCompContainer && this.oCompContainer.destroy();
		}
	});
	QUnit.test("Cumulative filter SAPClient=777 restricts result set", function(assert) {
		this.cumulativeFilter = defineFilter(this.oApi, {
			SAPClient : "777"
		});
		this.oApi.createStep("stepTemplateComponent1", this.callbackForUpdatePath);
		var length = this.oApi.getSteps()[0].getSelectedRepresentation().aDataResponse.length;
		assert.equal(length, 10, "match 10 rows");
	});
	QUnit.test("Cumulative filter SAPClient=777 && companyCode EQ 2000 ", function(assert) {
		this.cumulativeFilter = defineFilter(this.oApi, {
			SAPClient : "777",
			CompanyCode : "2000"
		});
		this.oApi.createStep("stepTemplateComponent1", this.callbackForUpdatePath);
		var length = this.oApi.getSteps()[0].getSelectedRepresentation().aDataResponse.length;
		assert.equal(length, 5, "match 5 rows");
	});
	QUnit.test("Cumualtive Filter with SAPClient=777 && companyCode EQ 2000 && Customer EQ 2001", function(assert) {
		this.cumulativeFilter = defineFilter(this.oApi, {
			SAPClient : "777",
			CompanyCode : "2000",
			Customer : "2001"
		});
		this.oApi.createStep("stepTemplateComponent1", this.callbackForUpdatePath);
		var length = this.oApi.getSteps()[0].getSelectedRepresentation().aDataResponse.length;
		assert.equal(length, 1, "match 1 row");
	});
	QUnit.test("Cumulative filter with SAPClient=777 && companyCode EQ 2000 && Customer EQ 5555", function(assert) {
		this.cumulativeFilter = defineFilter(this.oApi, {
			SAPClient : "777",
			CompanyCode : "2000",
			Customer : "5555"
		});
		this.oApi.createStep("stepTemplateComponent1", this.callbackForUpdatePath);
		var length = this.oApi.getSteps()[0].getSelectedRepresentation().aDataResponse.length;
		assert.equal(length, 0, "match 0 row");
	});
	QUnit.module('StartFilter and SmartFilterBarFilter reflected in path', {
		beforeEach : function() {
			var that = this;
			this.stubs = {};
			this.stubs.constructors = {
					StartFilterHandler : function(inject) {
						sap.apf.utils.StartFilterHandler.call(this, inject);
						sinon.stub(this, "getCumulativeFilter", function() {
							return jQuery.Deferred().resolve(that.cumulativeFilter.getInternalFilter());
						});
					},
					Request : function() {
						this.sendGetInBatch = function(oFilter, fnCallback) {
							that.usedFilterInPath = oFilter;
							fnCallback({
								data : [],
								metadata : undefined
							}, false);
						};
					}
			};
			setupTheIsolatedComponent(this);


			this.cumulativeFilter = defineFilter(this.oApi, {
				SAPClient : "777"
			});
		},
		registerSFB : function(){
			var oSFBStub = {
					getFilters: function(){
						return this.SFBFilter;
					}.bind(this),
					applyVariant: function(serializedFilter){
						this.SFBFilter = serializedFilter;
					}.bind(this), 
					fetchVariant: function(){
					}
			};
			this.oComponent.getProbe().coreApi.loadAnalyticalConfiguration(sap.apf.testhelper.config.getSampleConfiguration('addSmartFilterBar'));
			this.oComponent.getProbe().coreApi.registerSmartFilterBarInstance(oSFBStub);
		},
		afterEach : function() {
			this.oCompContainer && this.oCompContainer.destroy();
		}
	});
	QUnit.test("StartFilter and no SmartFilterBar", function(assert){
		var that = this;
		var done = assert.async();
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), "(SAPClient%20eq%20%27777%27)", "Filter from StartFilter only represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(),  "((SAPClient%20eq%20%27777%27))", "Filter from StartFilter only represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	QUnit.test("StartFilter and empty filter of SmartFilterBar", function(assert){
		var that = this;
		var done = assert.async();
		this.registerSFB();
		this.SFBFilter = [];
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), "(SAPClient%20eq%20%27777%27)", "Filter from StartFilter only represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(),  "((SAPClient%20eq%20%27777%27))", "Filter from StartFilter only represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	QUnit.test("StartFilter and single filter of SmartFilterBar", function(assert){
		var that = this;
		var done = assert.async();
		this.registerSFB();
		this.SFBFilter = [{
			sPath: "A",
			sOperator: "EQ",
			oValue1: "1"
		}];
		var expectedFilter = "((SAPClient%20eq%20%27777%27)%20and%20(A%20eq%20%271%27))";
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), expectedFilter, "Both filters represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(),  expectedFilter, "Both filters represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	QUnit.test("StartFilter and two filter of SmartFilterBar", function(assert){
		var that = this;
		var done = assert.async();
		this.registerSFB();
		this.SFBFilter = [{
			sPath: "A",
			sOperator: "EQ",
			oValue1: "1"
		},{
			sPath: "B",
			sOperator: "EQ",
			oValue1: "2"
		}];
		var expectedFilter = "((SAPClient%20eq%20%27777%27)%20and%20(A%20eq%20%271%27)%20and%20(B%20eq%20%272%27))";
		this.oApi.createStep("stepTemplateComponent1", function(){
			assert.equal(that.usedFilterInPath.toUrlParam(), expectedFilter, "Both filters represented in request of step update");
			that.oComponent.getProbe().coreApi.getCumulativeFilterUpToActiveStep().done(function(cumulativeFilter){
				assert.equal(cumulativeFilter.toUrlParam(), expectedFilter, "Both filters represented in getCumulativeFilterUpToActiveStep in core");
				done();
			});
		});
	});
	QUnit.module('Isolated API with cumulative filter', {
		beforeEach: function () {
			var that = this;
			this.testContext = {};
			function ResourcePathHandler(inject) {
				var handlerContext = this;
				sap.apf.testhelper.interfaces.IfResourcePathHandler.call(this, inject);
				sap.apf.testhelper.doubles.ResourcePathHandler.call(this, inject);
				this.loadConfigFromFilePath = function () {
					handlerContext.oCoreApi.loadAnalyticalConfiguration(getConfiguration()); // loading is required
				};
			}

			this.testContext.stubs = {
					constructors: {
						ResourcePathHandler: ResourcePathHandler,
						SessionHandler: sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
						UiInstance: sap.apf.testhelper.doubles.UiInstance
					},
					probe: function (dependencies) {
						that.testContext.dependencies = dependencies;
					}
			};
			this.testContext.oApi = new sap.apf.Api(
					{},  // is in role of class Component, so some API stubs may be needed
					this.testContext.stubs
			);
			this.testContext.oApi.loadApplicationConfig('pathNameDoesNotMatter');
			this.testContext.oApi.startApf();
		},
		afterEach: function () {
		}
	});
	QUnit.test("create stubbed API ", function (assert) {
		assert.notEqual(this.testContext.oApi, undefined, "api exists");
		assert.notEqual(this.testContext.dependencies, undefined, "dependencies exists");
		assert.notEqual(this.testContext.dependencies.coreApi, undefined, "dependencies.coreApi exists");
	});
	QUnit.test("addPathFilter adds filter to cumulative path", function (assert) {
		var done = assert.async();
		var filter = this.testContext.oApi.createFilter();
		filter.getTopAnd().addExpression({
			name: 'A', operator: 'EQ', value: 1
		});
		// act
		this.testContext.oApi.addPathFilter(filter);

		var promise = this.testContext.dependencies.coreApi.getCumulativeFilter();
		promise.then(function (cumulativeFilter) {
			assert.notEqual(cumulativeFilter, undefined, "cumulativeFilter exists");
			assert.equal(cumulativeFilter.toUrlParam(), "(A%20eq%201)", "A eq 1");
			done();
		});
	});
	QUnit.test("updatePathFilter shall replace its filter in cumulative path", function (assert) {
		var done = assert.async();
		var filter = this.testContext.oApi.createFilter();
		filter.getTopAnd().addExpression({
			name: 'A', operator: 'EQ', value: 1
		});
		var replacement = this.testContext.oApi.createFilter();
		replacement.getTopAnd().addExpression({
			name: 'A', operator: 'EQ', value: 777
		});
		var id = this.testContext.oApi.addPathFilter(filter);

		// act
		this.testContext.oApi.updatePathFilter(id, replacement);
		var promise = this.testContext.dependencies.coreApi.getCumulativeFilter();
		promise.then(function (cumulativeFilter) {
			assert.notEqual(cumulativeFilter, undefined, "cumulativeFilter exists");
			assert.equal(cumulativeFilter.toUrlParam(), "(A%20eq%20777)", "A eq 777");
			done();
		});
	});
	QUnit.test("updatePathFilter called twice with different property names refuses 2nd update with error", function (assert) {
		var done = assert.async();
		var filter = this.testContext.oApi.createFilter();

		function errorCallback(messageObject) {
			assert.equal(messageObject.getPrevious().getCode(), "5100", "THEN message has been emitted");
		}
		this.testContext.oApi.setCallbackForMessageHandling(errorCallback);
		filter.getTopAnd().addExpression({
			name: 'A', operator: 'EQ', value: 1
		});
		var replacement = this.testContext.oApi.createFilter();
		replacement.getTopAnd().addExpression({
			name: 'B', operator: 'EQ', value: 777
		});
		var id = this.testContext.oApi.addPathFilter(filter);

		// act
		assert.throws(function() {
			this.testContext.oApi.updatePathFilter(id, replacement);
		}, Error, "fatal error");

		var promise = this.testContext.dependencies.coreApi.getCumulativeFilter();
		promise.then(function(cumulativeFilter) {
			assert.notEqual(cumulativeFilter, undefined, "cumulativeFilter exists");
			assert.equal(cumulativeFilter.toUrlParam(), "(A%20eq%201)", "A eq 1");
			done();
		});
	});


}());