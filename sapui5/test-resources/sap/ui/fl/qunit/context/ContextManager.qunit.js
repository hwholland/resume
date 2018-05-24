/*globals QUnit, sinon*/
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}

sap.ui.require(["sap/ui/fl/context/ContextManager", "sap/ui/fl/Change", "sap/ui/fl/Utils"], function(ContextManager, Change, Utils) {
	var sandbox = sinon.sandbox.create();

	var oRuntimeContext = {
		"weather": "nice",
		"coolDrinks": "unavailable"
	};

	QUnit.module("sap.ui.fl.context.ContextManager", {
		beforeEach: function() {
			this.oControl = {};
			this.oChangeDef = {
				fileName: "0815_1",
				namespace: "apps/smartFilterBar/changes/",
				packageName: "$TMP",
				fileType: "variant",
				layer: "VENDOR",
				changeType: "filterVariant",
				reference: "smartFilterBar",
				componentName: "smartFilterBar",
				selector: {"persistenceKey": "control1"},
				conditions: {},
				context: "ctx001",
				content: {something: "createNewVariant"},
				texts: {
					variantName: {
						value: "myVariantName",
						type: "myTextType"
					}
				},
				originalLanguage: "DE",
				support: {
					generator: "Dallas beta 1",
					user: "cookie monster"
				}
			};

			sandbox.stub(ContextManager._oContext, "getValue").returns(Promise.resolve(oRuntimeContext));
		},
		afterEach: function() {
			sandbox.restore();
		}
	});

	/*
	 * doesContextMatch
	 */

	QUnit.test("doesContextMatch returns true if no context is passed", function(assert) {
		this.oChangeDef.context = undefined;
		var aActiveContexts = [];

		var bContextMatches = ContextManager.doesContextMatch(this.oChangeDef, aActiveContexts);

		assert.ok(bContextMatches);
	});

	QUnit.test("doesContextMatch returns true if an empty context id is passed", function(assert) {
		this.oChangeDef.context = undefined;
		var aActiveContexts = [];

		var bContextMatches = ContextManager.doesContextMatch(this.oChangeDef, aActiveContexts);

		assert.ok(bContextMatches);
	});

	QUnit.test("doesContextMatch returns true if the context is within the active contexts", function(assert) {
		this.oChangeDef.context = "ctx001";
		var aActiveContexts = ["ctx000", "ctx001", "ctx002"];

		var bContextMatches = ContextManager.doesContextMatch(this.oChangeDef, aActiveContexts);

		assert.ok(bContextMatches);
	});

	QUnit.test("doesContextMatch returns false if the context is not within the active contexts", function(assert) {
		this.oChangeDef.context = "ctx007";
		var aActiveContexts = ["ctx000", "ctx001", "ctx002"];

		var bContextMatches = ContextManager.doesContextMatch(this.oChangeDef, aActiveContexts);

		assert.notOk(bContextMatches);
	});

	/*
	 * getActiveContext
	 */

	QUnit.test("getActiveContext can identify a active context", function (assert) {
		var sContextId = "ctx001";
		var oContext = {
			id: sContextId,
			parameters: []
		};

		sandbox.stub(ContextManager, "_isContextObjectActive").returns(true);

		return ContextManager.getActiveContexts([oContext]).then(function (aActiveContexts) {
			assert.equal(aActiveContexts.length, 1, "one context is active");
			assert.equal(aActiveContexts[0], sContextId, "the active context is the one passed to the function");
		});
	});

	QUnit.test("getActiveContext can identify a inactive context", function (assert) {
		var sContextId = "ctx001";
		var oContext = {
			id: sContextId,
			parameters: []
		};

		sandbox.stub(ContextManager, "_isContextObjectActive").returns(false);

		return ContextManager.getActiveContexts([oContext]).then(function (aActiveContexts) {
			assert.equal(aActiveContexts.length, 0, "no context is active");
		});
	});

	QUnit.test("getActiveContext can identify multiple active contexts", function (assert) {
		var sContextId1 = "ctx001";
		var oContext1 = {
			id: sContextId1,
			parameters: []
		};

		var sContextId2 = "ctx002";
		var oContext2 = {
			id: sContextId2,
			parameters: []
		};

		sandbox.stub(ContextManager, "_isContextObjectActive").returns(true);

		return ContextManager.getActiveContexts([oContext1, oContext2]).then(function (aActiveContexts) {
			assert.equal(aActiveContexts.length, 2, "two contexts are active");
			assert.equal(aActiveContexts[0], sContextId1, "the first active context is the first passed to the function");
			assert.equal(aActiveContexts[1], sContextId2, "the second active context is the second passed to the function");
		});
	});

	QUnit.test("getActiveContext can identify multiple inactive contexts", function (assert) {
		var sContextId1 = "ctx001";
		var oContext1 = {
			id: sContextId1,
			parameters: []
		};

		var sContextId2 = "ctx002";
		var oContext2 = {
			id: sContextId2,
			parameters: []
		};

		sandbox.stub(ContextManager, "_isContextObjectActive").returns(false);

		return ContextManager.getActiveContexts([oContext1, oContext2]).then(function (aActiveContexts) {
			assert.equal(aActiveContexts.length, 0, "no context is active");
		});
	});

	QUnit.test("getActiveContext can identify the active in a list of multiple contexts", function (assert) {
		var sContextId1 = "ctx001";
		var oContext1 = {
			id: sContextId1,
			parameters: []
		};

		var sContextId2 = "ctx002";
		var oContext2 = {
			id: sContextId2,
			parameters: []
		};

		var oIsContextObjectActiveStub = sandbox.stub(ContextManager, "_isContextObjectActive");
		oIsContextObjectActiveStub.onFirstCall().returns(false);
		oIsContextObjectActiveStub.onSecondCall().returns(true);

		return ContextManager.getActiveContexts([oContext1, oContext2]).then(function (aActiveContexts) {
			assert.equal(aActiveContexts.length, 1, "one context is active");
			assert.equal(aActiveContexts[0], sContextId2, "the only active context is the second passed to the function");
		});
	});

	/*
	 * _isContextObjectActive
	 */

	QUnit.test("_isContextObjectActive can determine the activeness of an context object in a runtime environment", function (assert) {
		var oContext = {
			id: "ctx001",
			parameters: []
		};

		this.stub(ContextManager, "_getContextIdsFromUrl").returns([]);

		var isActive = ContextManager._isContextObjectActive(oContext, oRuntimeContext);
		assert.ok(isActive);
	});

	QUnit.test("_isContextObjectActive can determine the inactiveness of an context object in a runtime environment", function (assert) {
		var oContext = {
			id: "ctx001",
			parameters: [
				{
					"selector": "weather",
					"operator": "EQ",
					"value": "nice"
				},
				{
					"selector": "coolDrinks",
					"operator": "EQ",
					"value": "available"
				}
			]
		};

		var oRuntimeContext = {
			"weather": "nice",
			"coolDrinks": "unavailable"
		};


		this.stub(ContextManager, "_getContextIdsFromUrl").returns([]);

		var isActive = ContextManager._isContextObjectActive(oContext, oRuntimeContext);
		assert.notOk(isActive);
	});

	QUnit.test("can determine the activeness of an context object in a designtime scenario", function (assert) {
		var sContextObjectId = "ctx001";

		var aContexts = [{
			id: sContextObjectId,
			parameters: []
		}];

		var aActiveContextsFromUrl = ["ctx000", sContextObjectId, "ctx002"];

		var aActiveContexts = ContextManager._getActiveContextsByUrlParameters(aContexts, aActiveContextsFromUrl);
		assert.equal(aActiveContexts.length, 1, "only one context is active");
		assert.equal(aActiveContexts[0], sContextObjectId, "the passed contexts id is correct returned");
	});

	QUnit.test("_isContextObjectActive can determine the inactiveness of an context object in a designtime environment", function (assert) {

		var sContextObjectId = "ctx001";

		var oContext = {
			id: sContextObjectId,
			parameters: [
				{
					"selector": "weather",
					"operator": "EQ",
					"value": "nice"
				},
				{
					"selector": "coolDrinks",
					"operator": "EQ",
					"value": "available"
				}
			]
		};

		var aActiveContextsFromUrl = ["ctx000", "ctx002"];

		this.stub(ContextManager, "_getContextIdsFromUrl").returns(aActiveContextsFromUrl);

		var isActive = ContextManager._isContextObjectActive(oContext, oRuntimeContext);
		assert.notOk(isActive);
	});

	/*
	 * _getContextIdsFromUrl
	 */

	QUnit.test("_getContextIdsFromUrl can determine that no context id is passed via url", function (assert) {
		var oGetUrlParameterMock = sandbox.stub(Utils, "getUrlParameter").returns(undefined);

		var aContextIdsFromUrl = ContextManager._getContextIdsFromUrl();

		assert.equal(oGetUrlParameterMock.getCall(0).args[0], "sap-ui-flexDesignTimeContext");
		assert.equal(aContextIdsFromUrl.length, 0, "no context id was determined");
	});

	QUnit.test("_getContextIdsFromUrl can determine that no context id is passed via url if the parameter is present without any value", function (assert) {
		sandbox.stub(Utils, "getUrlParameter").returns("");

		var aContextIdsFromUrl = ContextManager._getContextIdsFromUrl();

		assert.equal(aContextIdsFromUrl.length, 0, "no context id was determined");
	});

	QUnit.test("_getContextIdsFromUrl can determine that one context id is passed via url", function (assert) {
		var sContextId = "ctx001";

		sandbox.stub(Utils, "getUrlParameter").returns(sContextId);

		var aContextIdsFromUrl = ContextManager._getContextIdsFromUrl();

		assert.equal(aContextIdsFromUrl.length, 1, "one context id was determined");
		assert.equal(aContextIdsFromUrl[0], sContextId, "the context id matches the url value");
	});

	QUnit.test("_getContextIdsFromUrl can determine that multiple context ids is passed via url", function (assert) {
		var sContextId1 = "ctx001";
		var sContextId2 = "ctx002";

		sandbox.stub(Utils, "getUrlParameter").returns(sContextId1 + "," + sContextId2);

		var aContextIdsFromUrl = ContextManager._getContextIdsFromUrl();

		assert.equal(aContextIdsFromUrl.length, 2, "two context ids was determined");
		assert.equal(aContextIdsFromUrl[0], sContextId1, "the context id matches the first value within the url");
		assert.equal(aContextIdsFromUrl[1], sContextId2, "the context id matches the first value within the url");
	});

	/*
	 * _checkContextParameter
	 */

	QUnit.test("_checkContextParameter calls the corresponding matcher depending on the operator", function (assert) {

		var aRuntimeContext = [];

		var sSelector = "country";
		var sValue = "china";

		var oContext = {
			"selector": sSelector,
			"operator": "EQ",
			"value": sValue
		};

		var checkEqualsStub = this.stub(ContextManager, "_checkEquals").returns(true);
		ContextManager._checkContextParameter(oContext, aRuntimeContext);

		assert.equal(checkEqualsStub.getCalls().length, 1, "the equals comparsion was called once");
		var aPassedParameters = checkEqualsStub.getCall(0).args;
		assert.equal(aPassedParameters[0], sSelector, "the selector was passed");
		assert.equal(aPassedParameters[1], sValue, "the value was passed");
		assert.equal(aPassedParameters[2], aRuntimeContext, "the runtime context was passed");
	});

	QUnit.test("_checkContextParameter provides a logger information of an operator for an matcher is not available and tells the context is not active", function (assert) {

		var aRuntimeContext = [];

		var sSelector = "country";
		var sOperator = "some absolutely unknown operator";
		var sValue = "china";

		var oContext = {
			"selector": sSelector,
			"operator": sOperator,
			"value": sValue
		};

		var loggerStub = this.stub(jQuery.sap.log, "info");
		var bContextActive = ContextManager._checkContextParameter(oContext, aRuntimeContext);

		var iNumberOfCalls = loggerStub.getCalls().length;
		assert.equal(iNumberOfCalls, 1, "a logging was done");
		var loggingMessage = loggerStub.getCall(0).args[0];
		var expectedMessage = "A context within a flexibility change with the operator '" + sOperator + "' could not be verified";
		assert.equal(loggingMessage, expectedMessage);
		assert.notOk(bContextActive, "the context paramter missmatched");
	});

	/*
	 * _checkEquals
	 */

	QUnit.test("_checkEquals determines if a value is equals the current runtime value", function (assert) {
		var sSelector = "country";
		var oValue = "china";
		var aRuntimeContext = {};
		aRuntimeContext[sSelector] = oValue;

		var bEquals = ContextManager._checkEquals(sSelector, oValue, aRuntimeContext);

		assert.ok(bEquals);
	});

	QUnit.test("_checkEquals determines if a value is not equals the current runtime value", function (assert) {
		var sSelector = "country";
		var oValue = "china";
		var aRuntimeContext = {};
		aRuntimeContext[sSelector] = oValue;

		var bEquals = ContextManager._checkEquals(sSelector, oValue + " a difference", aRuntimeContext);

		assert.notOk(bEquals);
	});

	QUnit.test("createOrUpdateContextObject throws an error if no anchor aka app variant id is provided", function (assert) {
		var oPropertyBag = {
			appVariantId: undefined
		};

		assert.throws(
			function () {
				ContextManager.createOrUpdateContextObject(oPropertyBag);
			},
			new Error("no app variant id passed for the context object"),
			"an error was thrown"
		);
	});

	QUnit.test("createOrUpdateContextObject creates a new change and calls the backend connection class to propagate the creation", function (assert) {

		var sAppVariantId = "anAppVariantId";
		var sGeneratedId = "id_123_0";
		this.stub(Utils, "createDefaultFileName").returns(sGeneratedId);
		var sExpectedUrl = "/sap/bc/lrep/content/apps/" + sAppVariantId + "/contexts/"+ sGeneratedId + ".context?layer=CUSTOMER";
		var oPropertyBag = {
			appVariantId: sAppVariantId
		};

		var oLrepConnectorSendStub = this.stub(ContextManager._oLrepConnector, "send");

		ContextManager.createOrUpdateContextObject(oPropertyBag);

		assert.ok(oLrepConnectorSendStub.calledOnce, "the sending was initiated");
		var oCallArguments = oLrepConnectorSendStub.getCall(0).args;
		assert.equal(oCallArguments[0], sExpectedUrl, "the url was build correct");
		assert.equal(oCallArguments[1], "PUT", "the backend operation should be a writing");
		assert.equal(oCallArguments[2].appVariantId, sAppVariantId, "the app variant id was passed");
		assert.ok(!!oCallArguments[2].id, "a ID was generated");
	});
});
