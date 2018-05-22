/* global QUnit sinon */
jQuery.sap.require("sap.ui.qunit.qunit-coverage");

jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.ui.thirdparty.sinon-ie");
jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");

(function() {
	"use strict";

	jQuery.sap.require("sap.ui.rta.qunit.RtaQunitUtils");
	jQuery.sap.require("sap.ui.rta.ui.AddElementsDialog");
	jQuery.sap.require("sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory");
	jQuery.sap.require("sap.ui.fl.fieldExt.Access");

	startFakeLREP("sap.ui.rta.qunit.customField.FakeLrepConnector");

	QUnit.module("Given an app that is field extensible enabled...", {
		beforeEach : function(assert) {
			this.sandbox = sinon.sandbox.create();

			var done = assert.async();

			this.STUB_EXTENSIBILITY_BUSINESS_CTXT = {
				BusinessContexts : ["some context"],
				ServiceName : "servive name",
				ServiceVersion : "some dummy ServiceVersion"
			};
			this.STUB_EXTENSIBILITY_USHELL_PARAMS = {
				target : {
					semanticObject : "CustomField",
					action : "develop"
				},
				params : {
					businessContexts : ["some context"],
					serviceName : "servive name",
					serviceVersion : "some dummy ServiceVersion",
					entityType : "Header"
				}
			};
			this.STUB_EXTENSIBILITY_USHELL_URL = "someURLToCheckOurParameterPassing:"
					+ JSON.stringify(this.STUB_EXTENSIBILITY_USHELL_PARAMS);

			// this overrides the ushell globally, which is no issue as this is on the current test page only!
			// Ensure better
			sap.ushell = jQuery.extend(sap.ushell, {
				Container : {
					getService : function() {
						return {
							hrefForExternal : function(mData) {
								return "someURLToCheckOurParameterPassing:" + JSON.stringify(mData);
							}
						};
					},
					getLogonSystem: function() {
						return {
							getName: function(){
								return "ETX";
							},
							getClient: function() {
								return "100";
							}
						};
					}
				}
			});

			this.fnFieldExtAccessStub = this.sandbox.stub(sap.ui.fl.fieldExt.Access, "getBusinessContexts").returns(
					jQuery.Deferred().resolve(this.STUB_EXTENSIBILITY_BUSINESS_CTXT));
			this.fnGetComponentStub = this.sandbox.stub(sap.ui.fl.Utils, "getComponentClassName").returns("someComponent");

			this.oCompCont = renderTestModuleAt("sap.ui.rta.test", "test-view");

			this.oFieldInFormControl = sap.ui.getCore().byId("idMain1--GeneralLedgerDocument.ExpirationDate");

			return waitForBinding().then(function(){
				done();
			});
		},
		afterEach : function(assert) {
			this.sandbox.restore();
			this.oCompCont.destroy();

		}
	});

	QUnit.test("when smart form control analyzer asks about custom field enabling,", function(assert) {
		var done = assert.async();
		var that = this;
		var oSmartFormAnalyzer = sap.ui.rta.controlAnalyzer.ControlAnalyzerFactory
				.getControlAnalyzerFor(this.oFieldInFormControl);

		oSmartFormAnalyzer.prepare().then(
				function() {
					var oResult = oSmartFormAnalyzer.getCustomFieldAvailable()
					// TODO: test in UTILS class (isCustomFieldAvailable)
					// assert.deepEqual(oResult, that.STUB_EXTENSIBILITY_BUSINESS_CTXT, "then our stub field extensibility service
					// is called");
					assert.equal((oResult !== null), true, "then our stub field extensibility service is called");
					assert.equal(that.fnFieldExtAccessStub.args[0][0],
							"/destinations/E91/sap/opu/odata/SAP/FAC_FINANCIAL_DOCUMENT_SRV_01",
							"then the field extensibility service is called with the correct odata service");
					assert.equal(that.fnFieldExtAccessStub.args[0][1], "Header",
							"then the field extensibility service is called with the correct entity type");
					done();
				})
	});

	QUnit.test("when create custom field button is pressed,", function(assert) {
		var oAddElementsDialog = new sap.ui.rta.ui.AddElementsDialog();
		var done = assert.async();
		var that = this;

		oAddElementsDialog.attachOpened(function() {
			oAddElementsDialog._oCustomFieldButton.$().trigger("tap");
		});

		this.sandbox.stub(sap.ui.rta.Utils, "openNewWindow", function(sUrl) {
			assert.equal(sUrl, that.STUB_EXTENSIBILITY_USHELL_URL,
					"then we are calling the extensibility tool with the correct parameter");
			done();
		});

		oAddElementsDialog.open(this.oFieldInFormControl);
	});

	QUnit.test("when add elements dialog is opened", function(assert){
		var isServiceUpToDateSpy = this.sandbox.spy(sap.ui.rta.Utils, "isServiceUpToDate");

		var oAddElementsDialog = new sap.ui.rta.ui.AddElementsDialog();
		var done = assert.async();
		var that = this;

		oAddElementsDialog.attachOpened(function() {
			assert.equal(isServiceUpToDateSpy.callCount, 1, "then it is ensured that the service is up to date");
			done();
			oAddElementsDialog.cancelDialog();
		});
		oAddElementsDialog.open(this.oFieldInFormControl);
	});

	QUnit.test("when service is outdated and add elements dialog is opened", function(assert){
		var isServiceUpToDateSpy = this.sandbox.stub(sap.ui.rta.Utils, "isServiceUpToDate").returns(Promise.resolve(false));

		var oAddElementsDialog = new sap.ui.rta.ui.AddElementsDialog();
		var dialogOpenSpy = this.sandbox.spy(oAddElementsDialog._oDialog, "open");

		var done = assert.async();
		var that = this;

		oAddElementsDialog.attachOpened(function() {
			assert.equal(dialogOpenSpy.callCount, 0, "then opened is fired, but the dialog is not opened");
			done();
		});
		oAddElementsDialog.open(this.oFieldInFormControl);
	});

	removeTestViewAfterTestsWhenCoverageIsRequested();

	function waitForBinding() {
		var oBindingReady = new Promise(function(resolve) {
			var oView = sap.ui.getCore().byId("idMain1");
			oView.getModel().attachRequestCompleted(function() {
				resolve();
			});
		});
		return oBindingReady.then(function() {
			var oView = sap.ui.getCore().byId("idMain1");
			return oView.getModel().getMetaModel().loaded();
		});
	}

})();