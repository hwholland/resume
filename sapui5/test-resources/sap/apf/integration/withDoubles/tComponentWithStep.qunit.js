jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.ushellHelper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerStubbedAjax');
jQuery.sap.require('sap.apf.testhelper.createComponent');
jQuery.sap.require('sap.apf.testhelper.stub.textResourceHandlerStub');
jQuery.sap.require("sap.apf.core.request");
(function() {
	'use strict';
	QUnit.module("tComponentWithStep -- APF API", {
		beforeEach : function() {
			sap.apf.testhelper.ushellHelper.setup();

			this.componentDouble = {
				startupParameters : {
					'sap-apf-step-id' : [ 'stepTemplate1' ],
					'sap-apf-representation-id' : [ 'representationId' ]
				}
			};
			this.createComponentWithParamAndApi = function(context, componentData) {
				var inject = {
						constructors : {
							SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
							Request : sap.apf.testhelper.doubles.Request
						}
				};

				sap.apf.testhelper.createComponent(context, 
						{ stubAjaxForResourcePaths : true,  componentId : "Comp1", inject : inject, componentData : componentData});
			};
		},
		afterEach : function() {

			// this.stubSBHandler.restore();
			sap.apf.testhelper.ushellHelper.teardown();
			this.oCompContainer.destroy();

		}
	});
	QUnit.test("When one step is added on app startUp Then active step is the added step", function(assert) {
		this.createComponentWithParamAndApi(this, this.componentDouble);
		assert.ok(this.oApi !== undefined, "Api successfully created");
		var steps = this.oApi.getSteps();
		assert.equal(steps.length, 1, "Only one step created");
		var firstStep = steps[0];
		var activeStep = this.oApi.getActiveStep();
		assert.equal(firstStep, activeStep, "First step set to active Step");
	});
	QUnit.test("When no representation type set Then default representation is used", function(assert) {
		this.createComponentWithParamAndApi(this, this.componentDouble);
		var steps = this.oApi.getSteps();
		var firstStep = steps[0];
		var oRepTyp = firstStep.getSelectedRepresentationInfo();
		assert.equal(oRepTyp.representationId, "representationId1", "check representation id");
		assert.equal(oRepTyp.label.key, "Text1", "check label.key");
		assert.deepEqual(firstStep.getRepresentationInfo()[0], firstStep.getSelectedRepresentationInfo(), "repID not provide, first representation used by default");
	});
	QUnit.test("When representation type is incompatible with selected step Then default representation is used", function(assert) {
		var customComponentDouble = {
			startupParameters : {
				'sap-apf-step-id' : [ 'stepTemplate2' ],
				'sap-apf-representation-id' : [ 'representationId2' ]
			}
		};
		this.createComponentWithParamAndApi(this, customComponentDouble);
		var steps = this.oApi.getSteps();
		var firstStep = steps[0];
		var oRepTyp = firstStep.getSelectedRepresentationInfo();
		assert.equal(oRepTyp.representationId, "representationId1", "check representation id");
		assert.equal(oRepTyp.label.key, "Text1", "check label.key");
	});
	QUnit.test("When representation type selected is compatible with selected step Then selected representation is used", function(assert) {
		var customComponentDouble = {
			startupParameters : {
				'sap-apf-step-id' : [ 'stepTemplate1' ],
				'sap-apf-representation-id' : [ 'representationId2' ]
			}
		};
		this.createComponentWithParamAndApi(this, customComponentDouble);
		var steps = this.oApi.getSteps();
		var firstStep = steps[0];
		var oRepTyp = firstStep.getSelectedRepresentationInfo();
		assert.equal(oRepTyp.representationId, "representationId2", "check representation id");
		assert.equal(oRepTyp.label.key, "Text2", "check label.key");
	});
	QUnit.test('Method getAdditionalConfigurationProperties()', function(assert) {
		// must be extended if additional properties are added to a steptemplate, e.g. extension, exit etc.
		this.createComponentWithParamAndApi(this, this.componentDouble);
		var steps = this.oApi.getSteps();
		var firstStep = steps[0];
		var oAdditionalConfigurationProperties = firstStep.getAdditionalConfigurationProperties();
		assert.deepEqual(oAdditionalConfigurationProperties, {}, "StepTemplate1 has no additional configuration properties");
	});
	QUnit.test('Method getFilter() of representation double for first step', function(assert) {
		this.createComponentWithParamAndApi(this, this.componentDouble);
		var steps = this.oApi.getSteps();
		var firstStep = steps[0];
		var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
		oMessageHandler.check = function() {
			return null;
		};
		var oInternalFilter = firstStep.getFilter();
		var oInternalFilterCompare = new sap.apf.core.utils.Filter(oMessageHandler, 'SAPClient', this.EQ, '777');
		assert.equal(oInternalFilter.isEqual(oInternalFilterCompare), true, "Method returns expected filter");
	});
	QUnit.test('Invalid step ID puts message object', function(assert) {
		var customComponentDouble = {
			startupParameters : {
				'sap-apf-step-id' : [ 'myInvalidStep' ],
				'sap-apf-representation-id' : [ 'representationId2' ]
			}
		};
		this.messageHandler = sinon.stub(sap.apf.core, 'MessageHandler', function() {
			assert.expect(1);
			this.setLifeTimePhaseStartup = function() {
			};
			this.setLifeTimePhaseRunning = function() {
			};
			this.setLifeTimePhaseShutdown = function() {
			};
			this.putMessage = function(messageObject) {
			};
			this.check = function() {
			};
			this.setTextResourceHandler = function() {
			};
			this.activateOnErrorHandling = function() {
			};
			this.loadConfig = function() {
			};
			this.setMessageCallback = function(fnCallback) {
			};
			this.isOwnException = function(error) {
				return (error && error.message && error.message.search("1972") > -1);
			};
			this.createMessageObject = function(rawMessageObject) {
				if (rawMessageObject.code === '5036') {
					assert.equal(rawMessageObject.code, '5036', "Correct message code exptected");
				}
			};
		});
		this.createComponentWithParamAndApi(this, customComponentDouble);
		sap.apf.core.MessageHandler.restore();
	});
}());

