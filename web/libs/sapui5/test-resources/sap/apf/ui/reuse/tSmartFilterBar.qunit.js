/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare('sap.apf.ui.reuse.tSmartFilterBar');
jQuery.sap.require("sap.ui.core.util.MockServer");
jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
jQuery.sap.require("sap.ui.fl.Utils");
(function() {
	'use strict';
	var oSmartFilterBarView, sUrl, oMockServer, spyOnGetSFBPersistenceKey, spyOnGetAnnotationsForService, spyOnRegisterSmartFilterBarInstance, flUtilsStub, oCoreApi = {}, oUiApi = {};
	//setup for mock server to instantiate OData model for SFB
	oMockServer = new sap.ui.core.util.MockServer({
		rootUri : "/foo/"
	});
	sUrl = "../../testhelper/mockServer/metadata/smartFilterBar.xml";
	oMockServer.simulate(sUrl, {
		'sMockdataBaseUrl' : "../../testhelper/mockServer/metadata/",
		'bGenerateMissingMockData' : true
	});
	function _returnPersistenceKey() {
		return "testSFB";
	}
	function _doNothing() {
	}
	function _createCommonSetup(oSmartFilterBarConfiguration) {
		var oViewData = {};
		//oCoreApi stub
		oCoreApi = {
			getSmartFilterBarPersistenceKey : _returnPersistenceKey,
			getAnnotationsForService : _doNothing,
			registerSmartFilterBarInstance : _doNothing,
			createMessageObject : sinon.spy(),
			putMessage : _doNothing
		};
		//oUiApi stub
		oUiApi = {
			selectionChanged : sinon.spy()
		};
		oMockServer.start();
		oViewData.oSmartFilterBarConfiguration = oSmartFilterBarConfiguration;
		oViewData.oCoreApi = oCoreApi;
		oViewData.oUiApi = oUiApi;
		sap.ui.fl.FakeLrepConnector.enableFakeConnector('../../testhelper/mockServer/fakeLrepConnector/component-changes.json');
		flUtilsStub = sinon.stub(sap.ui.fl.Utils, "getComponentClassName", function() {
			return "testComponent";
		});
		spyOnGetSFBPersistenceKey = sinon.spy(oCoreApi, "getSmartFilterBarPersistenceKey");
		spyOnGetAnnotationsForService = sinon.spy(oCoreApi, "getAnnotationsForService");
		spyOnRegisterSmartFilterBarInstance = sinon.spy(oCoreApi, "registerSmartFilterBarInstance");
		oSmartFilterBarView = sap.ui.view({
			viewName : "sap.apf.ui.reuse.view.smartFilterBar",
			type : sap.ui.core.mvc.ViewType.JS,
			viewData : oViewData
		});
	}
	function _commonTeardown() {
		oSmartFilterBarView.destroy();
		oMockServer.stop();
		flUtilsStub.restore();
	}
	QUnit.module("Smart Filter Bar Tests", {
		beforeEach : function() {
			var oSmartFilterBarConfiguration = {
				"type" : "smartFilterBar",
				"id" : "SmartFilterBar-1",
				"service" : "/foo",
				"entityType" : "testEntityType"
			};
			_createCommonSetup(oSmartFilterBarConfiguration);
		},
		afterEach : function() {
			_commonTeardown();
		}
	});
	QUnit.test("When smart filter bar view is loaded", function(assert) {
		var done = assert.async();
		//arrange
		var oSmartFilterBar = oSmartFilterBarView.byId("idAPFSmartFilterBar");
		//assert
		assert.ok(oSmartFilterBar, "then smart filter bar view is created");
		assert.strictEqual(oSmartFilterBar.getModel().sServiceUrl, "/foo", "then oData model is created with service URL as /foo");
		assert.strictEqual(oSmartFilterBar.getEntityType(), "testEntityType", "then entity is set as testEntityType");
		assert.strictEqual(oSmartFilterBar.getCustomData()[0].getKey(), "dateFormatSettings", "then dateFormatSettings are set in smartFilterBar");
		assert.deepEqual(oSmartFilterBar.getCustomData()[0].getValue(), {
			UTC: true
		}, "Then UTC date is set to formatSettings");
		assert.strictEqual(spyOnGetSFBPersistenceKey.calledWith("SmartFilterBar-1"), true, "then persistence key is retrieved");
		assert.strictEqual(spyOnGetAnnotationsForService.calledWith("/foo"), true, "then annotations for service is retrieved");
		//initialized event is called only when SmartVariantManagement is initialised. Therefore SFB instance is not registered with core until then
		oSmartFilterBar.attachInitialized(function() {
			assert.strictEqual(oCoreApi.createMessageObject.called, false, "No Message created");
			assert.strictEqual(spyOnRegisterSmartFilterBarInstance.calledWith(oSmartFilterBar), true, "then smart filter bar is registered with core");
			done();
		});
	});
	QUnit.test("When smart filter 'Go' button is pressed", function(assert) {
		var done = assert.async();
		//arrange
		var oSmartFilterBar = oSmartFilterBarView.byId("idAPFSmartFilterBar");
		oSmartFilterBar.attachInitialized(function() {
			//action
			oSmartFilterBar.fireSearch();
			//assert
			assert.strictEqual(oCoreApi.createMessageObject.called, false, "No Message created");
			assert.ok(oSmartFilterBarView.getViewData().oUiApi.selectionChanged.calledOnce, "then selectionChanged event is trigerred");
			done();
		});
	});
	QUnit.module("Smart Filter Bar Tests when metadata fails", {
		beforeEach : function() {
			var oSmartFilterBarConfiguration = {
				"type" : "smartFilterBar",
				"id" : "SmartFilterBar-1",
				"service" : "/fo",
				"entityType" : "testEntityType"
			};
			_createCommonSetup(oSmartFilterBarConfiguration);
		},
		afterEach : function() {
			_commonTeardown();
		}
	});
	QUnit.test("When smart filter bar is created with a service for which no metadata is available", function(assert) {
		//arrange
		var nCounter = 0;
		var oSmartFilterBar = oSmartFilterBarView.byId("idAPFSmartFilterBar");
		//assert
		var done = assert.async();
		oSmartFilterBar.getModel().attachMetadataFailed(function() {
			if (nCounter === 0) {
				assert.ok(oSmartFilterBar, "then smart filter bar view is created");
				assert.strictEqual(oSmartFilterBar.getModel().sServiceUrl, "/fo", "then oData model is created with service URL as /fo");
				assert.strictEqual(oSmartFilterBar.getEntityType(), "testEntityType", "then entity is set as testEntityType");
				assert.strictEqual(oCoreApi.createMessageObject.calledWith({
					code : "5052",
					aParameters : [ "/fo" ]
				}), true, "then attach of metadata failed");
				nCounter++;
				done();
			}
		});
	});
	QUnit.module("Smart Filter Bar Tests when entity type is not available in metadata", {
		beforeEach : function() {
			var oSmartFilterBarConfiguration = {
					"type" : "smartFilterBar",
					"id" : "SmartFilterBar-1",
					"service" : "/foo",
					"entityType" : "wrongEntityType"
			};
			_createCommonSetup(oSmartFilterBarConfiguration);
		},
		afterEach : function() {
			_commonTeardown();
		}
	});
	QUnit.test("Entity type is not in service", function(assert) {
		//arrange
		var oSmartFilterBar = oSmartFilterBarView.byId("idAPFSmartFilterBar");
		//assert
		assert.ok(oSmartFilterBar, "then smart filter bar view is created");
		assert.strictEqual(oSmartFilterBar.getModel().sServiceUrl, "/foo", "then oData model is created with service URL as /foo");
		assert.strictEqual(oSmartFilterBar.getEntityType(), "wrongEntityType", "then entity is set as wrongEntityType");
		assert.strictEqual(oCoreApi.createMessageObject.calledWith({
			code : "5053",
			aParameters : [ "wrongEntityType", "/foo" ]
		}), true, "then initialization failed");
	});
}());
