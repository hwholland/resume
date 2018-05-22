/*globals QUnit*/
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}

jQuery.sap.require("sap.ui.fl.ChangePersistenceFactory");
jQuery.sap.require("sap.ui.fl.ChangePersistence");

(function(ChangePersistenceFactory, ChangePersistence, Control) {
	"use strict";

	var sandbox = sinon.sandbox.create();
	var oAsyncHints;

	QUnit.module("sap.ui.fl.ChangePersistenceFactory", {
		beforeEach: function(assert) {
			var done = assert.async();
			jQuery.getJSON( "./testResources/asyncHints.json", function( oLoadedAsyncHints ) {
				oAsyncHints = oLoadedAsyncHints;

				// MOCK find for phantomJS
				oAsyncHints.requests.find = function () {
					return oAsyncHints.requests[0];
				};

				done();
			});
		},
		afterEach: function() {
			sandbox.restore();
			sap.ui.core.Component._fnManifestLoadCallback = null;
		}
	});

	QUnit.test("shall provide an API to create a ChangePersistence for a component", function(assert) {
		assert.equal(typeof ChangePersistenceFactory.getChangePersistenceForComponent, "function");
	});

	QUnit.test("shall provide an API to create a ChangePersistence for a control", function(assert) {
		assert.equal(typeof ChangePersistenceFactory.getChangePersistenceForControl, "function");
	});

	QUnit.test("shall create a new ChangePersistence for a given component", function(assert) {
		var oChangePersistence;

		//Call CUT
		oChangePersistence = ChangePersistenceFactory.getChangePersistenceForComponent("RambaZambaComponent");

		assert.ok(oChangePersistence, "ChangePersistence shall be created");
	});

	QUnit.test("shall create a new ChangePersistence for a given control", function(assert) {
		var oControl, oChangePersistence;
		oControl = new Control();
		sandbox.stub(ChangePersistenceFactory, "_getComponentClassNameForControl").returns("AComponentForAControl");

		//Call CUT
		oChangePersistence = ChangePersistenceFactory.getChangePersistenceForControl(oControl);

		assert.ok(oChangePersistence, "ChangePersistence shall be created");
	});

	QUnit.test("shall return the same cached instance, if it exists", function(assert) {
		var componentName = "Sinalukasi";

		var firstlyRequestedChangePersistence = ChangePersistenceFactory.getChangePersistenceForComponent(componentName);
		var secondlyRequestedChangePersistence = ChangePersistenceFactory.getChangePersistenceForComponent(componentName);

		assert.strictEqual(firstlyRequestedChangePersistence, secondlyRequestedChangePersistence, "Retrieved ChangePersistence instances are equal");
	});

	QUnit.test("can register its manifest loaded event handler to the sap.ui.core.Component", function (assert) {
		ChangePersistenceFactory.registerManifestLoadedEventHandler();

		assert.equal(sap.ui.core.Component._fnManifestLoadCallback, ChangePersistenceFactory._onManifestLoaded, "the event handler was registered");
	});

	QUnit.test("does nothing if its manifest loaded event handler was called with a non application manifest", function (assert) {
		var oManifest = {
			"sap.app": {
				"type": "smartTemplate"
			}
		};

		var oChangePersistence = ChangePersistenceFactory.getChangePersistenceForComponent("myComponent");
		var oChangePersistenceGetChangesForComponentStub = sandbox.stub(oChangePersistence, "getChangesForComponent");
		sandbox.stub(ChangePersistenceFactory, "getChangePersistenceForComponent").returns(oChangePersistence);

		ChangePersistenceFactory._onManifestLoaded(oManifest, oAsyncHints);

		assert.equal(oChangePersistenceGetChangesForComponentStub.callCount, 0, "changes were not requested");
	});

	QUnit.test("should preload changes if its manifest loaded event handler was called with an application manifest", function (assert) {
		var oManifest = {
			"sap.app": {
				"type": "application"
			}
		};

		var oChangePersistence = ChangePersistenceFactory.getChangePersistenceForComponent("myComponent");
		var oChangePersistenceGetChangesForComponentStub = sandbox.stub(oChangePersistence, "getChangesForComponent");
		var oChangePersistenceFactoryGetChangePersistenceForComponentStub = sandbox.stub(ChangePersistenceFactory, "getChangePersistenceForComponent").returns(oChangePersistence);

		ChangePersistenceFactory._onManifestLoaded(oManifest, oAsyncHints);

		assert.equal(oChangePersistenceGetChangesForComponentStub.callCount, 1, "changes were requested once");
		var oGetChangePersistenceForComponentCall = oChangePersistenceFactoryGetChangePersistenceForComponentStub.getCall(0).args[0];
		assert.equal(oGetChangePersistenceForComponentCall, oAsyncHints.requests[0].reference, "the component/app variant id was passed correct");
		var oGetChangesForComponentCall = oChangePersistenceGetChangesForComponentStub.getCall(0).args[0];
		assert.equal(oGetChangesForComponentCall.cacheKey, oAsyncHints.requests[0].cachebusterToken, "the cache key was determined and passed correct");
	});

}(sap.ui.fl.ChangePersistenceFactory, sap.ui.fl.ChangePersistence, sap.ui.core.Control));
