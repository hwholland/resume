jQuery.sap.require("sap.ui.fl.Utils");
jQuery.sap.require("sap.ui.layout.VerticalLayout");
jQuery.sap.require("sap.ui.layout.HorizontalLayout");
jQuery.sap.require("sap.m.Button");

(function (Utils, HorizontalLayout, VerticalLayout, Button) {

	var aControls = [];
	QUnit.module("sap.ui.fl.Utils", {
		beforeEach: function () {
		},
		afterEach: function () {
			aControls.forEach(function (oControl) {
				oControl.destroy();
			})
		}
	});

	QUnit.test("sap.ui.fl.Utils", function (assert) {
		var oInstance = Utils;
		assert.ok(oInstance);
	});

	QUnit.test("getComponentClassName shall return an empty string if the control does not belong to a SAPUI5 component", function (assert) {
		var sComponent = Utils.getComponentClassName({});
		assert.strictEqual(sComponent, "");
	});

	QUnit.test("getComponentClassName shall return the component id", function (assert) {
		var sComponentName = "testName.Component";
		var oControl = {};
		var oComponentMock = {
			getMetadata: function () {
				return {
					getName: function () {
						return sComponentName;
					}
				};
			},
			getManifestEntry: function () {
				return undefined;
			}
		};
		var oGetComponentIdForControlStub = this.stub(Utils, "_getComponentIdForControl").returns("testId");
		var oGetComponentStub = this.stub(Utils, "_getComponent").returns(oComponentMock);

		assert.equal(Utils.getComponentClassName(oControl), sComponentName);

		assert.ok(oGetComponentIdForControlStub.called);
		assert.ok(oGetComponentStub.called);

		oGetComponentIdForControlStub.restore();
		oGetComponentStub.restore();
	});

	QUnit.test("getComponentClassName shall return the variant id instead if it is filled instead of the component id", function (assert) {
		var sComponentName = "testName.Component";
		var sAppVariantName = "myTestVariant";
		var oControl = {};
		var oComponentMock = {
			getMetadata: function () {
				return {
					getName: function () {
						return sComponentName;
					}
				};
			},
			getComponentData: function () {
				return {
					startupParameters: {
						"sap-app-id": [
							sAppVariantName
						]
					}
				};
			}
		};
		var oGetComponentIdForControlStub = this.stub(Utils, "_getComponentIdForControl").returns("testId");
		var oGetComponentStub = this.stub(Utils, "_getComponent").returns(oComponentMock);

		assert.equal(Utils.getComponentClassName(oControl), sAppVariantName);

		assert.ok(oGetComponentIdForControlStub.called);
		assert.ok(oGetComponentStub.called);

		oGetComponentIdForControlStub.restore();
		oGetComponentStub.restore();
	});

	QUnit.test("smartTemplating case: getComponentClassName shall return the variant id instead if it is filled instead of the component id", function (assert) {
		var sComponentName = "testName.Component";
		var sAppVariantName = "myTestVariant";
		var oControl = {};

		var oComponentMock = {
			getMetadata: function () {
				return {
					getName: function () {
						return sComponentName;
					}
				};
			},
			getComponentData: function () {
				return {
					startupParameters: {
						"sap-app-id": [
							sAppVariantName
						]
					}
				};
			}
		};
		var oSmartTemplateCompMock = {
			getAppComponent: function () {
				return oComponentMock;
			}
		};
		var oGetComponentIdForControlStub = this.stub(Utils, "_getComponentIdForControl").returns("testId");
		var oGetComponentStub = this.stub(Utils, "_getComponent").returns(oSmartTemplateCompMock);

		assert.equal(Utils.getComponentClassName(oControl), sAppVariantName);

		assert.ok(oGetComponentIdForControlStub.called);
		assert.ok(oGetComponentStub.called);

		oGetComponentIdForControlStub.restore();
		oGetComponentStub.restore();
	});


	QUnit.test("getCurrentLayer shall return sap-ui-layer parameter", function (assert) {
		var oUriParams = {
			mParams: {
				"sap-ui-layer": [
					"VENDOR"
				]
			}
		};
		var getUriParametersStub = this.stub(Utils, "_getUriParameters").returns(oUriParams);
		var sLayer = Utils.getCurrentLayer();
		assert.equal(sLayer, "VENDOR");
		getUriParametersStub.restore();
	});

	QUnit.test("getCurrentLayer shall return USER layer if endUser flag is set ", function (assert) {
		var oUriParams = {
			mParams: {
				"sap-ui-layer": [
					"VENDOR"
				]
			}
		};
		var getUriParametersStub = this.stub(Utils, "_getUriParameters").returns(oUriParams);
		var sLayer = Utils.getCurrentLayer(true);
		assert.equal(sLayer, "USER");
		assert.ok(true);
		getUriParametersStub.restore();
	});

	QUnit.test("getCurrentLayer shall return default CUSTOMER layer ", function (assert) {
		var oUriParams = {
			mParams: {}
		};
		var getUriParametersStub = this.stub(Utils, "_getUriParameters").returns(oUriParams);
		var sLayer = Utils.getCurrentLayer(false);
		assert.equal(sLayer, "CUSTOMER");
		assert.ok(true);
		getUriParametersStub.restore();
	});

	QUnit.test("doesSharedVariantRequirePackage", function (assert) {
		var bDoesSharedVariantRequirePackage;
		this.stub(Utils, "getCurrentLayer").returns("CUSTOMER");

		// Call CUT
		bDoesSharedVariantRequirePackage = Utils.doesSharedVariantRequirePackage();

		assert.strictEqual(bDoesSharedVariantRequirePackage, false);
		Utils.getCurrentLayer.restore();
	});

	QUnit.test("getClient", function (assert) {
		var oUriParams = {
			mParams: {
				"sap-client": [
					"123"
				]
			}
		};
		var getUriParametersStub = this.stub(Utils, "_getUriParameters").returns(oUriParams);
		var sClient = Utils.getClient();
		assert.equal(sClient, "123");
		assert.ok(true);
		getUriParametersStub.restore();
	});

	QUnit.test("convertBrowserLanguageToISO639_1 shall return the ISO 639-1 language of a RFC4646 language", function (assert) {
		assert.equal(Utils.convertBrowserLanguageToISO639_1("en-us"), 'EN');
		assert.equal(Utils.convertBrowserLanguageToISO639_1("de"), 'DE');
		assert.equal(Utils.convertBrowserLanguageToISO639_1(""), '');
		assert.equal(Utils.convertBrowserLanguageToISO639_1("hkjhkashik"), '');
	});

	QUnit.test("_getComponentIdForControl shall return the result of getOwnerIdForControl", function (assert) {
		var sComponentId;
		this.stub(Utils, "_getOwnerIdForControl").returns('Rumpelstilzchen');
		// Call CUT
		sComponentId = Utils._getComponentIdForControl(null);
		assert.equal(sComponentId, 'Rumpelstilzchen');
		Utils._getOwnerIdForControl.restore();
	});

	QUnit.test("_getComponentIdForControl shall walk up the control tree until it finds a component id", function (assert) {
		var sComponentId, oControl1, oControl2, oControl3, f_getOwnerIdForControl;
		oControl1 = {};
		oControl2 = {
			getParent: this.stub().returns(oControl1)
		};
		oControl3 = {
			getParent: this.stub().returns(oControl2)
		};

		f_getOwnerIdForControl = this.stub(Utils, "_getOwnerIdForControl");
		f_getOwnerIdForControl.withArgs(oControl3).returns("");
		f_getOwnerIdForControl.withArgs(oControl2).returns("");
		f_getOwnerIdForControl.withArgs(oControl1).returns("sodimunk");

		// Call CUT
		sComponentId = Utils._getComponentIdForControl(oControl3);

		assert.equal(sComponentId, 'sodimunk');
		sinon.assert.calledThrice(f_getOwnerIdForControl);
		Utils._getOwnerIdForControl.restore();
	});

	QUnit.test("_getComponentIdForControl shall stop walking up the control tree after 100 iterations", function (assert) {
		var sComponentId, aControls, i, f_getOwnerIdForControl, previous;
		aControls = [];
		for (i = 0; i < 200; i++) {
			previous = (i >= 1) ? aControls[i - 1] : null;
			(function (previous, i) {
				aControls[i] = {
					getParent: function () {
						return previous
					}
				}
			})(previous, i);
		}

		f_getOwnerIdForControl = this.stub(Utils, "_getOwnerIdForControl").returns("");

		// Call CUT
		sComponentId = Utils._getComponentIdForControl(aControls[199]);

		assert.strictEqual(sComponentId, '');
		sinon.assert.callCount(f_getOwnerIdForControl, 100);
		f_getOwnerIdForControl.restore();
	});

	QUnit.test("_getComponentName shall return the component name for a component", function (assert) {
		var oMetadata = {
			_sComponentName: 'testcomponent.Component',
			getName: function () {
				return this._sComponentName;
			}
		};
		var oComponent = {
			getMetadata: function () {
				return oMetadata;
			}
		};
		// 1. simple check
		var sComponentName = Utils._getComponentName(oComponent);
		assert.equal(sComponentName, 'testcomponent.Component');

		// 2. check that .Component is added if the actual component name has no .Component suffix
		oMetadata._sComponentName = 'testcomponent';
		sComponentName = Utils._getComponentName(oComponent);
		assert.equal(sComponentName, 'testcomponent.Component');

		//Commented out since method _getComponentName is always called from getComponentClassName and this method already includes the check for smart templates.
		// 3. check that in case of a smart templating component the app component is retrieved
		/*var oAppCompMetadata = {
		 _sComponentName: 'app.testcomponent.Component',
		 getName: function() {
		 return this._sComponentName;
		 }
		 };
		 var oAppComponent = {
		 getMetadata: function() {
		 return oAppCompMetadata;
		 }
		 };
		 oComponent.getAppComponent = function() {
		 return oAppComponent;
		 };
		 sComponentName = Utils._getComponentName(oComponent);
		 assert.equal(sComponentName, 'app.testcomponent.Component');*/
	});

	QUnit.test("getXSRFTokenFromControl shall return an empty string if retrieval failes", function (assert) {
		var oControl, sXSRFToken;
		oControl = {};

		// Call CUT
		sXSRFToken = Utils.getXSRFTokenFromControl(oControl);

		assert.strictEqual(sXSRFToken, '');
	});

	QUnit.test("getXSRFTokenFromControl shall return the XSRF Token from the Control's OData model", function (assert) {
		var oControl, sXSRFToken, fStub;
		oControl = {
			getModel: function () {
			}
		};
		fStub = this.stub(Utils, "_getXSRFTokenFromModel").returns("abc");

		// Call CUT
		sXSRFToken = Utils.getXSRFTokenFromControl(oControl);

		assert.strictEqual(sXSRFToken, 'abc');
		fStub.restore();
	});

	QUnit.test("_getXSRFTokenFromModel shall return an empty string if the retrieval failed", function (assert) {
		var oModel, sXSRFToken, fStub;
		oModel = {};

		// Call CUT
		sXSRFToken = Utils._getXSRFTokenFromModel(oModel);

		assert.strictEqual(sXSRFToken, '');
	});

	QUnit.test("_getXSRFTokenFromModel shall return the XSRF Token from the OData model", function (assert) {
		var oModel, sXSRFToken, fStub;
		oModel = {
			getHeaders: function () {
				return {
					"x-csrf-token": "gungalord"
				}
			}
		};

		// Call CUT
		sXSRFToken = Utils._getXSRFTokenFromModel(oModel);

		assert.strictEqual(sXSRFToken, 'gungalord');
	});

	QUnit.test("Utils.isHotfixMode shall return the hotfix url parameter", function (assert) {
		var oUriParams = {
			mParams: {
				"hotfix": [
					"true"
				]
			}
		};
		var getUriParametersStub = this.stub(Utils, "_getUriParameters").returns(oUriParams);
		var bIsHotfix = Utils.isHotfixMode();
		assert.strictEqual(bIsHotfix, true);
		getUriParametersStub.restore();
	});

	QUnit.test("isHotfixMode shall return false if there is no hotfix url parameter", function (assert) {
		var oUriParams = {
			mParams: {}
		};
		var getUriParametersStub = this.stub(Utils, "_getUriParameters").returns(oUriParams);
		var bIsHotfix = Utils.isHotfixMode();
		assert.strictEqual(bIsHotfix, false);
		getUriParametersStub.restore();
	});

	QUnit.test("Utils.log shall call jQuery.sap.log.warning once", function (assert) {
		// PREPARE
		var spyLog = sinon.spy(jQuery.sap.log, "warning");

		// CUT
		Utils.log.warning("");

		// ASSERTIONS
		assert.equal(spyLog.callCount, 1);

		// RESTORE
		spyLog.restore();
	});

	QUnit.test("log shall call jQuery.sap.log.error once", function (assert) {
		// PREPARE
		var spyLog = sinon.spy(jQuery.sap.log, "error");

		// CUT
		Utils.log.error("");

		// ASSERTIONS
		assert.equal(spyLog.callCount, 1);

		// RESTORE
		spyLog.restore();
	});

	QUnit.test('getFirstAncestorOfControlWithControlType', function (assert) {
		var button1 = new Button('button1');
		var hLayout1 = new HorizontalLayout('hLayout1');
		var hLayout2 = new HorizontalLayout('hLayout2');
		var vLayout1 = new VerticalLayout('vLayout1');
		var vLayout2 = new VerticalLayout('vLayout2');
		vLayout2.addContent(button1);
		hLayout2.addContent(vLayout2);
		vLayout1.addContent(hLayout2);
		hLayout1.addContent(vLayout1);
		// hL1-vL1-hL2-vL2-b1
		aControls.push(hLayout1);

		var ancestorControlOfType = Utils.getFirstAncestorOfControlWithControlType(button1, HorizontalLayout);

		assert.strictEqual(hLayout2, ancestorControlOfType);

		ancestorControlOfType = Utils.getFirstAncestorOfControlWithControlType(button1, Button);

		assert.strictEqual(button1, ancestorControlOfType);

	});

	QUnit.test('hasControlAncestorWithId shall return true if the control itself is the ancestor', function (assert) {
		var button = new Button('button1'), bHasAncestor;
		aControls.push(button);

		bHasAncestor = Utils.hasControlAncestorWithId('button1', 'button1');
		assert.strictEqual(bHasAncestor, true);
	});

	QUnit.test("hasControlAncestorWithId shall return true if the control's parent is the ancestor", function (assert) {
		var hLayout, button, bHasAncestor;
		hLayout = new HorizontalLayout('hLayout');
		button = new Button('button1');
		hLayout.addContent(button);
		aControls.push(hLayout);

		bHasAncestor = Utils.hasControlAncestorWithId('button1', 'hLayout');
		assert.strictEqual(bHasAncestor, true);
	});

	QUnit.test("hasControlAncestorWithId shall return true if the control has the specified ancestor", function (assert) {
		var hLayout1, hLayout2, button, bHasAncestor;
		hLayout1 = new HorizontalLayout('hLayout1');
		hLayout2 = new HorizontalLayout('hLayout2');
		button = new Button('button');
		hLayout1.addContent(button);
		hLayout2.addContent(hLayout1);
		aControls.push(hLayout2);

		bHasAncestor = Utils.hasControlAncestorWithId('button', 'hLayout2');

		assert.strictEqual(bHasAncestor, true);
	});

	QUnit.test("hasControlAncestorWithId shall return false if the control does not have the specified ancestor", function (assert) {
		var hLayout, button, bHasAncestor;
		hLayout = new HorizontalLayout('hLayout');
		button = new Button('button');
		aControls.push(hLayout, button);

		bHasAncestor = Utils.hasControlAncestorWithId('button', 'hLayout');
		assert.strictEqual(bHasAncestor, false);
	});

	QUnit.test("checkControlId shall log and return true if control id was not generated", function (assert) {
		var oGenControlId = new sap.ui.base.ManagedObject( "__generatedId--controlId");
		var oAppComponent = {
			getLocalId: function() {return undefined}
		};
		assert.equal(Utils.checkControlId(oGenControlId, oAppComponent), false);

		var oNonGenControlId = {
			getId: function () {
				return "view1--non_generatedId--controlId";
			}
		};
		assert.equal(Utils.checkControlId(oNonGenControlId), true);

	});

	QUnit.test("getAppDescriptor shall return NULL if the control does not belong to a SAPUI5 component", function (assert) {
		var oAppDescriptor;

		// Call CUT
		oAppDescriptor = Utils.getAppDescriptor({});
		assert.strictEqual(oAppDescriptor, null);
	});

	QUnit.test("getAppDescriptor shall return the an appDescriptor instance", function (assert) {
		var oAppDescriptor = {
			"id": "sap.ui.smartFormOData"
		};
		var oControl = {};
		var oComponentMock = {
			getMetadata: function () {
				return {
					getManifest: function () {
						return oAppDescriptor;
					}
				};
			}
		};
		var oGetComponentIdForControlStub = this.stub(Utils, "_getComponentIdForControl").returns("testId");
		var oGetComponentStub = this.stub(Utils, "_getComponent").returns(oComponentMock);

		// Call CUT
		assert.equal(Utils.getAppDescriptor(oControl), oAppDescriptor);

		assert.ok(oGetComponentIdForControlStub.called);
		assert.ok(oGetComponentStub.called);

		oGetComponentIdForControlStub.restore();
		oGetComponentStub.restore();
	});

	QUnit.test("getSiteID shall return NULL if no valid UI5 control is filled in", function (assert) {
		var sSiteId;

		// Call CUT
		sSiteId = Utils.getSiteId({});
		assert.strictEqual(sSiteId, null);
	});

	QUnit.test("getSiteID shall return a siteId", function (assert) {
		var sSiteId = 'dummyId4711';
		var oControl = {};
		var oComponentMock = {
			getComponentData: function () {
				return {
					startupParameters: {
						//"scopeId": [
						"hcpApplicationId": [
							sSiteId, 'dummyId4712'
						]
					}
				};
			}
		};
		var oGetComponentIdForControlStub = this.stub(Utils, "_getComponentIdForControl").returns("testId");
		var oGetComponentStub = this.stub(Utils, "_getComponent").returns(oComponentMock);

		// Call CUT
		assert.equal(Utils.getSiteId(oControl), sSiteId);

		assert.ok(oGetComponentIdForControlStub.called);
		assert.ok(oGetComponentStub.called);

		oGetComponentIdForControlStub.restore();
		oGetComponentStub.restore();
	});

	QUnit.test("encodes a string into ascii", function (assert) {
		var string = "Hallo Welt!";
		var expectedString = "72,97,108,108,111,32,87,101,108,116,33";

		var encodedString = Utils.stringToAscii(string);

		assert.equal(encodedString, expectedString);
	});

	QUnit.test("decodes ascii into a string", function (assert) {
		var string = "72,97,108,108,111,32,87,101,108,116,33";
		var expectedString = "Hallo Welt!";

		var decodedString = Utils.asciiToString(string);

		assert.equal(decodedString, expectedString);
	});

	QUnit.test("getComponentClassName shall return the next component of type 'application' in the hierarchy", function (assert) {
		var sComponentNameApp = "testName.ComponentApp";
		var sComponentNameComp = "testName.ComponentComp";
		var oControl = {};

		var oComponentMockComp = {
			getMetadata: function () {
				return {
					getName: function () {
						return sComponentNameComp;
					}
				};
			},
			getManifestEntry: function () {
				return {
					type: "component"
				}
			}
		};

		var oComponentMockApp = {
			getMetadata: function () {
				return {
					getName: function () {
						return sComponentNameApp;
					}
				};
			},
			getManifestEntry: function () {
				return {
					type: "application"
				}
			}
		};

		var oGetComponentForControlStub = this.stub(Utils, "_getComponentForControl").onFirstCall().returns(oComponentMockComp).onSecondCall().returns(oComponentMockApp);

		assert.equal(Utils.getComponentClassName(oControl), sComponentNameApp, "Check that the type of the component is 'application'");

		oGetComponentForControlStub.stub.restore();
	});

	QUnit.test("getComponentClassName does not find component of type 'application' in the hierarchy", function (assert) {
		var sComponentNameComp = "testName.ComponentComp";
		var oControl = {};

		var oComponentMockComp = {
			getMetadata: function () {
				return {
					getName: function () {
						return sComponentNameComp;
					}
				};
			},
			getManifestEntry: function () {
				return {
					type: "component"
				}
			}
		};

		var oGetComponentForControlStub = this.stub(Utils, "_getComponentForControl").onFirstCall().returns(oComponentMockComp).onSecondCall().returns(null);

		assert.equal(Utils.getComponentClassName(oControl), "", "Check that empty string is returned.");

		oGetComponentForControlStub.stub.restore();
	});

	QUnit.test("getAppComponentForControl can determine the OVP special case", function () {
		var oComponent = new sap.ui.core.UIComponent();
		var oAppComponent = new sap.ui.core.UIComponent();
		oComponent.oComponentData = {appComponent: oAppComponent};

		var oDeterminedAppComponent = Utils._getAppComponentForComponent(oComponent);

		assert.equal(oDeterminedAppComponent, oAppComponent);
	});

	QUnit.test("getAppComponentClassNameForComponent can determine the application component name", function (assert) {
		var oComponent = {};
		var oAppComponent = {
			getManifestEntry: function () {
				return undefined;
			}
		};
		var sAppComponentName = "appComponentName";
		var oStubbedGetAppComponent = this.stub(Utils, "getAppComponentForControl").returns(oAppComponent);
		var oStubbedGetStartupParameter = this.stub(Utils, "_getComponentStartUpParameter").returns(undefined);
		var oStubbedGetComponentName = this.stub(Utils, "_getComponentName").returns(sAppComponentName);

		var sCalculatedComponentName = Utils.getAppComponentClassNameForComponent(oComponent);

		assert.ok(oStubbedGetAppComponent.calledOnce, "the app component was calculated");
		assert.equal(oStubbedGetAppComponent.getCall(0).args[0], oComponent,"for the passed control");
		assert.ok(oStubbedGetStartupParameter.calledOnce, "the startup parameter");
		assert.equal(oStubbedGetStartupParameter.getCall(0).args[1], "sap-app-id", "named 'sap-app-id'");
		assert.equal(oStubbedGetStartupParameter.getCall(0).args[0], oAppComponent, "for the application component was retrieved");
		assert.ok(oStubbedGetComponentName.calledOnce, "and the component name of the application was determined");
		assert.equal(oStubbedGetComponentName.getCall(0).args[0], oAppComponent, "for the applicaiton component");
		assert.equal(sCalculatedComponentName, sAppComponentName, "and the componnent name was determined correct");
	});

	QUnit.test("getAppComponentClassNameForComponent can determine the application component name", function (assert) {
		var oComponent = {};
		var oAppComponent = {};
		var sSapAppId = "sapAppId";
		var sAppComponentName = "appComponentName";
		var oStubbedGetAppComponent = this.stub(Utils, "getAppComponentForControl").returns(oAppComponent);
		var oStubbedGetStartupParameter = this.stub(Utils, "_getComponentStartUpParameter").returns(sSapAppId);
		var oStubbedGetComponentName = this.stub(Utils, "_getComponentName").returns(sAppComponentName);

		var sCalculatedComponentName = Utils.getAppComponentClassNameForComponent(oComponent);

		assert.ok(oStubbedGetAppComponent.calledOnce, "the app component was calculated");
		assert.equal(oStubbedGetAppComponent.getCall(0).args[0], oComponent,"for the passed control");
		assert.ok(oStubbedGetStartupParameter.calledOnce, "the startup parameter");
		assert.equal(oStubbedGetStartupParameter.getCall(0).args[1], "sap-app-id", "named 'sap-app-id'");
		assert.equal(oStubbedGetStartupParameter.getCall(0).args[0], oAppComponent, "for the application component was retrieved");
		assert.equal(oStubbedGetComponentName.callCount, 0, "and the component name of the application was determined");
		assert.equal(sCalculatedComponentName, sSapAppId, "and the componnent name was determined correct");
	});

}(sap.ui.fl.Utils, sap.ui.layout.HorizontalLayout, sap.ui.layout.VerticalLayout, sap.m.Button));
