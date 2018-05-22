(function () {
	'use strict';

	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.require('sap.apf.testhelper.stub.ajaxStub');
	jQuery.sap.require('sap.apf.testhelper.odata.savedPaths');
	jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.doubles.component');
	jQuery.sap.require('sap.apf.testhelper.createComponent');
	jQuery.sap.require('sap.apf.testhelper.doubles.representation');
	jQuery.sap.require('sap.apf.Component');
	QUnit.module("tComponent -- APF API", {
		beforeEach : function(assert) {
			var path = "/apf-test/test-resources/sap/apf/testhelper/config/applicationConfiguration.json";	
			var inject =  { functions : { ajax : sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch }};
			this.oComponent = sap.apf.testhelper.doubles.component.create(this, "compId", inject,  path, {});
		},
		afterEach : function(assert) {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Check putMessage() and interaction between MessageHandler, ResourcePathHandler and TextResourceHandler", function(assert) {
		var sMessageText;
		var sMessageCode;
		var fnCallback = function(oMessageObject) {
			sMessageCode = oMessageObject.getCode();
			sMessageText = oMessageObject.getMessage();
		};

		this.oComponent.getProbe().messageHandler.setMessageCallback(fnCallback);
		var oMessageObject = this.oComponent.oApi.createMessageObject({
			code : "5206",
			aParameters : [],
			oCallingObject : this
		});

		this.oComponent.oApi.putMessage(oMessageObject);
		assert.equal(sMessageCode, "5206", "Correct message code expected");
		assert.equal(sMessageText, "SQL error 268 during server request; insufficient privileges", "Correct message text expected");
	});
	QUnit.module('tComponent -- Create multiple instances', {
		beforeEach : function(assert) {
			this.oContext1 = {};
			this.oContext2 = {};

			sap.apf.testhelper.createComponent(this.oContext1, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, noLoadingOfApplicationConfig : true, componentId: "Comp1"});
			sap.apf.testhelper.createComponent(this.oContext2, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, noLoadingOfApplicationConfig : true, componentId: "Comp2"});
			this.oApi1 = this.oContext1.oApi;
			this.oApi2 = this.oContext2.oApi;
		},
		afterEach : function() {
			this.oContext1.oCompContainer.destroy();
			this.oContext2.oCompContainer.destroy();
		}
	});
	QUnit.test('Proper access to api function of created component', function(assert) {
		var oMessageObject = this.oApi1.createMessageObject({
			code : "5100"
		});
		assert.ok(oMessageObject, "Proper access to api function");
	});
	QUnit.test('GIVEN created two components - WHEN their apf APIs compared - THEN APIs are not equal (necessary condition, not sufficient)', function(assert) {
		assert.ok(this.oApi1 !== this.oApi2, "different references");
	});
	QUnit.test('GIVEN created two components - WHEN their contexts compared - THEN contexts are different', function(assert) {
		var bCalled1 = false;
		var bCalled2 = false;
		var fnCallback1 = function() {
			bCalled1 = true;
		};
		var fnCallback2 = function() {
			bCalled2 = true;
		};
		var oMessageObject = this.oApi1.createMessageObject({
			code : sap.apf.core.constants.message.code.errorLoadingAnalyticalConfig
		});
		this.oApi1.setCallbackForMessageHandling(fnCallback1);
		this.oApi2.setCallbackForMessageHandling(fnCallback2);
		try {
			this.oApi1.putMessage(oMessageObject);
		} catch (oError) {
			assert.ok(true, "Exception was raised on fatal message");
		}
		assert.ok(bCalled1 !== bCalled2, "contexts are different");
	});
	QUnit.test('GIVEN created two components - WHEN the second one destroyed - THEN the first one works', function(assert) {
		this.oContext2.oCompContainer.destroy();
		var oMessageObject1 = this.oApi1.createMessageObject({
			code : "5100"
		});
		assert.ok(oMessageObject1, "Proper access to api function of second Api");
	});
	QUnit.test('GIVEN a component created - WHEN destroyed - THEN no function used by  is cut off', function(assert) {
		var fnResourcePathHandlerBefore = sap.apf.core.ResourcePathHandler;
		var fnMetadataFactoryBefore = sap.apf.core.MetadataFactory;
		var fnTextResourceHandlerBefore = sap.apf.core.TextResourceHandler;
		var fnConfigurationFactoryBefore = sap.apf.core.ConfigurationFactory;
		var fnPathBefore = sap.apf.core.Path;
		var fnSessionHandlerBefore = sap.apf.core.SessionHandler;
		var fnPersistenceBefore = sap.apf.core.Persistence;
		var fnReadRequestBefore = sap.apf.core.ReadRequest;
		var fnCoreBefore = sap.apf.core;
		var fnUtilsBefore = sap.apf.utils;
		this.oContext1.oCompContainer.destroy();
		var fnResourcePathHandlerAfter = sap.apf.core.ResourcePathHandler;
		var fnMetadataFactoryAfter = sap.apf.core.MetadataFactory;
		var fnTextResourceHandlerAfter = sap.apf.core.TextResourceHandler;
		var fnConfigurationFactoryAfter = sap.apf.core.ConfigurationFactory;
		var fnPathAfter = sap.apf.core.Path;
		var fnSessionHandlerAfter = sap.apf.core.SessionHandler;
		var fnPersistenceAfter = sap.apf.core.Persistence;
		var fnReadRequestAfter = sap.apf.core.ReadRequest;
		var fnCoreAfter = sap.apf.core;
		var fnUtilsAfter = sap.apf.utils;
		assert.equal(fnResourcePathHandlerBefore, fnResourcePathHandlerAfter, "fnResourcePathHandler not cutted off");
		assert.equal(fnMetadataFactoryBefore, fnMetadataFactoryAfter, "fnMetadataFactory not cutted off");
		assert.equal(fnTextResourceHandlerBefore, fnTextResourceHandlerAfter, "fnTextResourceHandler not cutted off");
		assert.equal(fnConfigurationFactoryBefore, fnConfigurationFactoryAfter, "fnConfigurationFactory not cutted off");
		assert.equal(fnPathBefore, fnPathAfter, "fnPath not cutted off");
		assert.equal(fnSessionHandlerBefore, fnSessionHandlerAfter, "fnSessionHandler not cutted off");
		assert.equal(fnPersistenceBefore, fnPersistenceAfter, "fnPersistence not cutted off");
		assert.equal(fnReadRequestBefore, fnReadRequestAfter, "fnReadRequest not cutted off");
		assert.ok(fnUtilsAfter.Filter, "context of sap.apf.utils exists");
		assert.deepEqual(fnCoreBefore, fnCoreAfter, "core objects not modified");
		assert.deepEqual(fnUtilsBefore, fnUtilsAfter, "utils objects not modified");
	});
	QUnit.module("Component: Destroy", {
		beforeEach : function() {
			var sId = "Comp1";
			var oComponent;
			var fnUiInstance = sap.apf.ui.Instance;
			sap.apf.ui.Instance = sap.apf.testhelper.doubles.UiInstance;
			sap.apf.testhelper.stub.stubJQueryAjax();
			oComponent = new sap.apf.Component({
				id : sId,
				componentData : {
					startupParameters : {}
				}
			});
			jQuery.ajax.restore();
			sap.apf.ui.Instance = fnUiInstance;
			var sContId = "Comp" + sId;
			this.oCompContainer = new sap.ui.core.ComponentContainer(sContId, {
				component : oComponent
			});
			this.oCompContainer.setComponent(oComponent);
			this.oApi = oComponent.getApi();
			this.spyComponentExit = sinon.spy(oComponent, "exit");
			this.spyApiDestroy = sinon.spy(this.oApi, "destroy");
		},
		afterEach : function() {
			this.spyComponentExit.restore();
		}
	});
	QUnit.test("WHEN component container is removed", function(assert) {
		this.oCompContainer.destroy();
		assert.ok(this.spyComponentExit.calledOnce, "THEN exit is called in COMPONENT");
		assert.ok(this.spyApiDestroy.calledOnce, "THEN destroy is called in ApiT");
	});
}());
