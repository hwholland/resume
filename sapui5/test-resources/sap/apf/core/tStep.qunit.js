jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.binding');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.apfApi');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.step");
jQuery.sap.require("sap.apf.core.request");
jQuery.sap.require("sap.apf.core.binding");
jQuery.sap.require("sap.apf.core.configurationFactory");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.ui.representations.lineChart");
jQuery.sap.require("sap.apf.ui.representations.columnChart");
jQuery.sap.require("sap.apf.ui.representations.scatterPlotChart");
jQuery.sap.require("sap.apf.ui.representations.table");
jQuery.sap.require("sap.apf.ui.representations.stackedColumnChart");
jQuery.sap.require("sap.apf.ui.representations.pieChart");
jQuery.sap.require("sap.apf.ui.representations.percentageStackedColumnChart");
jQuery.sap.require('sap.apf.ui.representations.bubbleChart');

(function() {
	'use strict';
	function commonSetupStep(testEnvironment, bSpyPutMessage) {
		testEnvironment.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		if (bSpyPutMessage) {
			testEnvironment.oMessageHandler.spyPutMessage();
		}
		testEnvironment.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances : {
				messageHandler : testEnvironment.oMessageHandler
			}
		}).doubleMessaging();
		testEnvironment.oApi = new sap.apf.testhelper.doubles.ApfApi({
			instances : {
				messageHandler : testEnvironment.oMessageHandler,
				coreApi : testEnvironment.oCoreApi
			}
		}).doubleStandardMethods().doubleCreateRepresentation().doubleCreateFilter();
		testEnvironment.oConfigurationTemplate = sap.apf.testhelper.config.getSampleConfiguration();
		testEnvironment.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
			instances : {
				messageHandler : testEnvironment.oMessageHandler,
				coreApi : testEnvironment.oCoreApi
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable
			}
		});
		testEnvironment.oConfigurationFactory.loadConfig(testEnvironment.oConfigurationTemplate);
	}
	QUnit.module("Create Step with given Representation", {
		beforeEach : function(assert) {
			commonSetupStep(this);
			this.originalRequest = sap.apf.core.Request;
			sap.apf.core.Request = function() {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					fnCallback('Callback from request double');
				};
			};
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.originalRequest;
		}
	});
	QUnit.test("WHEN create Step without explicite represenation id", function(assert) {
		var oStep = this.oConfigurationFactory.createStep("stepTemplate3");
		var representationType = oStep.getSelectedRepresentation().type;
		assert.equal(representationType, "Representation2TestDouble", "THEN the default represenation is selected");
	});
	QUnit.test("WHEN create Step without explicite represenation id", function(assert) {
		var oStep = this.oConfigurationFactory.createStep("stepTemplate3", "representationId1");
		var representationType = oStep.getSelectedRepresentation().type;
		assert.equal(representationType, "RepresentationTestDouble", "THEN the explicite represenation is selected");
	});
	QUnit.module("Create Step with invalid RepresentationId", {
		beforeEach : function(assert) {
			commonSetupStep(this, true);
			this.originalRequest = sap.apf.core.Request;
			sap.apf.core.Request = function() {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					fnCallback('Callback from request double');
				};
			};
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.originalRequest;
		}
	});
	QUnit.test("WHEN step is created with non existing representation id", function(assert) {
		var oStep = this.oConfigurationFactory.createStep("stepTemplate3", "unknownRepresentationId");
		var representationType = oStep.getSelectedRepresentation().type;
		assert.equal(representationType, "Representation2TestDouble", "THEN the default represenation is selected");
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5037", "THEN warning message has been emitted");
	});
	QUnit.module('Step update', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			var testEnv = this;
			
			this.originalBinding = sap.apf.core.Binding;
			sap.apf.core.Binding = function(oInject, oBindingConfig, oFactory, sRepresentationId){
				testEnv.originalBinding.call(this, oInject, oBindingConfig, oFactory, sRepresentationId); 
				testEnv.spyGetRequestOptions = sinon.spy(this, "getRequestOptions");
			};
			
			this.originalRequest = sap.apf.core.Request;
			sap.apf.core.Request = function() {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					fnCallback('Callback from request double');
				};
			};
			var oStepConfig = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
			this.oStep = new sap.apf.core.Step(this.oMessageHandler, oStepConfig, this.oConfigurationFactory);
			this.wrapCallbackWithFilter = function(oFilter) {
				return function(data) {
					this.oStep.setData(data, oFilter);
					this.callBackFromStepUpdate(data);
				}.bind(this);
			};
		},
		afterEach : function() {
			sap.apf.core.Request = this.originalRequest;
			sap.apf.core.Binding = this.originalBinding;
		},
		counterSendCalled : 0,
		counterCallbackCalled : 0,
		callBackFromStepUpdate : function(data) {
			this.counterCallbackCalled++;
			if (data === 'Callback from request double') {
				this.counterSendCalled++;
			}
		},
		getSendCounter : function() {
			return this.counterSendCalled;
		},
		getCallbackCounter : function() {
			return this.counterCallbackCalled;
		}
	});
	QUnit.test('Request is not triggered when filter in step has not changed - from setup', function(assert) {
		var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "val1");
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 1, 'One callback expected');
		assert.equal(this.getSendCounter(), 1, 'One call to sendGetInBatch() on request expected');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 2, 'Two callbacks expected after 2nd update');
		assert.equal(this.getSendCounter(), 1, 'One, i.e. no additional call of sendGetInBatch() on request expected');
	});
	QUnit.test('Request is triggered when filter in step has changed', function(assert) {
		var oFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "val1");
		var oAdditionalFilterCondition = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop2", sap.apf.core.constants.FilterOperators.EQ, "val2");
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 1, 'One callback expected');
		assert.equal(this.getSendCounter(), 1, 'One call to sendGetInBatch() on request expected');
		oFilter.addAnd(oAdditionalFilterCondition);
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 2, 'Two callbacks expected after 2nd update');
		assert.equal(this.getSendCounter(), 2, 'Two calls to sendGetInBatch() on request expected');
	});
	QUnit.test('Request triggered dependent on changed request options', function(assert) {
		var oFilter = new sap.apf.core.utils.Filter();
		var oRepresentation = this.oStep.getSelectedRepresentation();
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 1, 'One callback expected');
		assert.equal(this.getSendCounter(), 1, 'One call to sendGetInBatch() on request expected');
		oRepresentation.emulateRequestOptionsStrategy('top');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 2, 'Two callbacks expected after 2nd update');
		assert.equal(this.getSendCounter(), 2, 'Two calls to sendGetInBatch() on request expected due to changed request options');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 3, 'Three callbacks expected after 3rd update');
		assert.equal(this.getSendCounter(), 2, 'Two, i.e. no additional call to sendGetInBatch() on request expected');
		oRepresentation.emulateRequestOptionsStrategy('topSkip');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 4, 'Four callbacks expected after 4th update');
		assert.equal(this.getSendCounter(), 3, 'Three calls to sendGetInBatch() on request expected due to changed request options');
		oRepresentation.emulateRequestOptionsStrategy('inlineCount');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 5, 'Five callbacks expected after 5th update');
		assert.equal(this.getSendCounter(), 4, 'Four calls to sendGetInBatch() on request expected due to changed request options');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 6, 'Six callbacks expected after 6th update');
		assert.equal(this.getSendCounter(), 4, 'Four calls to sendGetInBatch() on request expected due to changed request options');
	});
	QUnit.test('Request triggered dependent on changed complex request options', function(assert) {
		var oFilter = new sap.apf.core.utils.Filter();
		var oRepresentation = this.oStep.getSelectedRepresentation();
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 1, 'One callback expected');
		assert.equal(this.getSendCounter(), 1, 'One call to sendGetInBatch() on request expected');
		oRepresentation.emulateRequestOptionsStrategy('multiOptionsPagingAndOrderbyPropertyOne');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 2, 'Two callbacks expected after 2nd update');
		assert.equal(this.getSendCounter(), 2, 'Two calls to sendGetInBatch() on request expected due to changed request options');
		oRepresentation.emulateRequestOptionsStrategy('multiOptionsPagingAndOrderbyPropertyTwo');
		this.oStep.update(oFilter, this.wrapCallbackWithFilter(oFilter));
		assert.equal(this.getCallbackCounter(), 3, 'Three callbacks expected after 3rd update');
		assert.equal(this.getSendCounter(), 3, 'Three calls to sendGetInBatch() on request expected due to changed request options');
	});
	QUnit.test('Methods availability', function(assert) {
		assert.ok(this.oStep.setSelectedRepresentation, 'Method setSelectedRepresentation() available');
	});
	QUnit.test('Get Filter', function(assert) {
		var oFilter = this.oStep.getFilter();
		assert.ok(oFilter instanceof sap.apf.core.utils.Filter, "Filter object expected");
	});
	QUnit.test('getRequestOptions called with filterChanged boolean', function (assert) {
		var oFilterOne = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "X");
		var oFilterTwo = new sap.apf.core.utils.Filter(this.oMessageHandler, "prop1", sap.apf.core.constants.FilterOperators.EQ, "Y");
		this.oStep.update(oFilterOne, this.wrapCallbackWithFilter(oFilterOne));
		assert.strictEqual(this.spyGetRequestOptions.getCall(0).args[0], true, 'First update, getRequestOptions called with true as no filter cached so far');
		assert.strictEqual(this.spyGetRequestOptions.getCall(1).args[0], true, 'First setData, getRequestOptions called with true as no filter cached so far');
		this.oStep.update(oFilterOne, this.wrapCallbackWithFilter(oFilterOne));
		assert.strictEqual(this.spyGetRequestOptions.getCall(2).args[0], false, 'Second update, getRequestOptions called with false as provided filter has not changed');
		assert.strictEqual(this.spyGetRequestOptions.getCall(3).args[0], false, 'Second setData, getRequestOptions called with false as provided filter has not changed');
		this.oStep.update(oFilterTwo, this.wrapCallbackWithFilter(oFilterTwo));
		assert.strictEqual(this.spyGetRequestOptions.getCall(4).args[0], true, 'Third update, getRequestOptions called with true as provided filter has changed');
		assert.strictEqual(this.spyGetRequestOptions.getCall(5).args[0], true, 'Third setData, getRequestOptions called with true as provided filter has changed');
	});
	QUnit.module('Filter Mapping', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			var that = this;
			this.originalRequest = sap.apf.core.Request;
			this.spySendGetInBatch = function() {
			};
			sap.apf.core.Request = function(oInject, oConfig) {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					//callback for checking oFilter and oConfig in test
					that.spySendGetInBatch(oFilter, oConfig);
					if (that.letRequestFail) {
						fnCallback(new sap.apf.core.MessageObject({
							code : "5001"
						}));
						return;
					}
					var oResponse = {
						data : [ {
							targetProperty1 : "A",
							targetProperty2 : "B"
						}, {
							targetProperty1 : "C",
							targetProperty2 : "D"
						} ]
					};
					fnCallback(oResponse);
				};
			};
			this.oCumulatedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler);
			this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMapping"));
			this.oStepFilterMapping = this.oConfigurationFactory.createStep("stepFilterMapping");
			this.oStepFilterMapping.getFilter = function() {
				return new sap.apf.core.utils.Filter(that.oMessageHandler, "testProperty", "eq", "test");
			};
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.originalRequest;
		}
	});
	QUnit.test('WHEN the request for filter mapping is executed THEN the right service, entity type and select properties are supplied to sendGetInBatch()', function(assert) {
		var sExpectedService = "serviceForFilterMapping.xsodata";
		var sExpectedEntityType = "entitytypeForFilterMapping";
		var sExpectedSelectProperties = [ "targetProperty1", "targetProperty2" ];
		var sResultService = "";
		var sResultEntityType = "";
		var sResultSelectProperties = "";
		this.spySendGetInBatch = function(oFilter, oConfig) {
			sResultService = oConfig.service;
			sResultEntityType = oConfig.entityType;
			sResultSelectProperties = oConfig.selectProperties;
		};
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, function() {
		}); //CUT
		assert.equal(sResultService, sExpectedService, "Correct service used in sendGetInBatch");
		assert.equal(sResultEntityType, sExpectedEntityType, "Correct entitytype used in sendGetInBatch");
		assert.deepEqual(sResultSelectProperties, sExpectedSelectProperties, "Correct select properties used in sendGetInBatch");
	});
	QUnit.test('WHEN the request for filter mapping fails THEN the callback is not processed and the error is logged', function(assert) {
		assert.expect(1);
		this.oMessageHandler.spyPutMessage();
		this.letRequestFail = true;
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, callbackFromStepFilterProcessing); //CUT
		function callbackFromStepFilterProcessing(oFilter) {
			assert.ok(false, "The callback from determineFilter() was called despite a failed filter mapping request");
		}
		assert.equal(this.oMessageHandler.spyResults.putMessage.getCode(), "5001", "The error from the failed filter mapping request is logged");
	});
	QUnit.test('WHEN keep source is false THEN replace filter from step specific selections by mapped filter', function(assert) {
		assert.expect(1);
		jQuery.extend(this, sap.apf.utils.Filter.getOperators());
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "B");
		var oFilter3 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oFilter4 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "D");
		var oFilterAnd1 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addAnd(oFilter2);
		var oFilterAnd2 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter3).addAnd(oFilter4);
		var oExpectedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilterAnd1).addOr(oFilterAnd2);
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, callbackFromStepFilterProcessing); //CUT
		function callbackFromStepFilterProcessing(oFilter) {
			assert.equal(oFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "Correctly mapped filter returned");
		}
	});
	QUnit.test('WHEN keep source is true THEN enhance filter from step specific selections with mapped filter', function(assert) {
		assert.expect(1);
		var that = this;
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMappingKeepSource"));
		this.oStepFilterMapping = this.oConfigurationFactory.createStep("stepFilterMappingKeepSource");
		this.oStepFilterMapping.getFilter = function() {
			return new sap.apf.core.utils.Filter(that.oMessageHandler, "sourceProperty", that.EQ, "A");
		};
		jQuery.extend(this, sap.apf.utils.Filter.getOperators());
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "B");
		var oFilter3 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oFilter4 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "D");
		var oFilter5 = new sap.apf.core.utils.Filter(this.oMessageHandler, "sourceProperty", this.EQ, "A");
		var oFilterAnd1 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addAnd(oFilter2);
		var oFilterAnd2 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter3).addAnd(oFilter4);
		var oMappedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilterAnd1).addOr(oFilterAnd2);
		var oExpectedFilter = oFilter5.addAnd(oMappedFilter);
		this.oStepFilterMapping.determineFilter(this.oCumulatedFilter, callbackFromStepFilterProcessing); //CUT
		function callbackFromStepFilterProcessing(oFilter) {
			assert.equal(oFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "Correctly enhanced filter returned");
		}
	});
	QUnit.module('Step no binding test double', {
		beforeEach : function(assert) {
			var that = this;
			commonSetupStep(this);
			sap.apf.core.getMetadata = function() {
				return new sap.apf.testhelper.doubles.Metadata();
			};
			function RequestDouble() {
				this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
					that.requestOptions = oRequestOptions;
					fnCallback('Callback from request double');
				};
			}
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = RequestDouble;
			var oStepConfig = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
			this.oStep = new sap.apf.core.Step(this.oMessageHandler, oStepConfig, this.oConfigurationFactory);
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test('getSelectedRepresentationInfo()', function(assert) {
		var oRepTyp = this.oStep.getSelectedRepresentationInfo();
		assert.ok(oRepTyp, "is defined");
		assert.equal(oRepTyp.representationId, "representationId1", "check representation id");
		assert.equal(oRepTyp.label.key, "Text1", "check label.key");
		assert.deepEqual(this.oStep.getRepresentationInfo()[0], this.oStep.getSelectedRepresentationInfo(), "is first one by default, deep equal");
	});
	QUnit.test('getRepresentationInfo()', function(assert) {
		var aRepInfo = this.oStep.getRepresentationInfo();
		var oRepInfo = aRepInfo[0];
		assert.ok(oRepInfo, "RepresentationInfo is defined");
		assert.equal(oRepInfo.representationId, "representationId1", "RepresentationInfo has representation id");
		assert.equal(oRepInfo.label.key, "Text1", "RepresentationInfo has label.key");
		assert.deepEqual(this.oStep.getRepresentationInfo(), this.oStep.getRepresentationInfo(), "deep equal"); //TODO AK & PS: is this really needed???
	});
	QUnit.test('Get request options', function(assert) {
		this.oStep.getSelectedRepresentation().emulateRequestOptionsStrategy('all');
		this.oStep.update(new sap.apf.core.utils.Filter(), function() {
		});
		assert.deepEqual(this.requestOptions, {
			paging : {
				top : 20,
				skip : 10,
				inlineCount : true
			}
		}, 'Emulated request options expected');
	});
	QUnit.module('Step - Destroy Function', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate2");
			this.oRepresentation = this.oStep.getSelectedRepresentation();
			this.spyRepresentationDestroy = sinon.spy(this.oRepresentation, "destroy");
		},
		afterEach : function() {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test("WHEN Destroy Step is called", function(assert) {
		this.oStep.destroy();
		assert.ok(this.spyRepresentationDestroy.calledOnce, "THEN the destroy of the representation is called");
	});
	QUnit.module('Various methods', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate3");
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test("WHEN getAssignedNavigationTargets is called", function(assert) {
		var expectedResult = [ {
			id : 'nav-MM',
			type : 'navigationTarget'
		} ];
		assert.deepEqual(this.oStep.getAssignedNavigationTargets(), expectedResult, "THEN an array containing the navigtion targets assigned in configuration is returned");
	});
	QUnit.module('Step with Representation - empty representations)', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate2");
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test('Method getRepresentationInfo', function(assert) {
		assert.ok(this.oStep.getRepresentationInfo(), "getRepresentationInfo() runs");
	});
	QUnit.test('Method getSelectedRepresentationInfo', function(assert) {
		assert.throws(function() {
			var oStep = this.oConfigurationFactory.createStep("initialStep");
			oStep.getSelectedRepresentationInfo();
		}, "successfully thrown, index not in array boundaries");
	});
	QUnit.module('Step with Representation', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			sap.apf.core.getMetadata = function() {
				return new sap.apf.testhelper.doubles.Metadata();
			};
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			var oStepConfig = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
			this.oStep = new sap.apf.core.Step(this.oMessageHandler, oStepConfig, this.oConfigurationFactory);
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test('Method getRepresentationInfo', function(assert) {
		var aRepInfo = this.oStep.getRepresentationInfo();
		assert.ok(aRepInfo, "getRepresentationInfo() obj");
		assert.equal(aRepInfo.length, 4, "getRepresentationInfo() non-empty"); // currently 3 in the configuration
		assert.notEqual(aRepInfo[0], undefined, "aReprs[0] defined");
		assert.notEqual(aRepInfo[1], undefined, "aReprs[1] defined");
		assert.notEqual(aRepInfo[0].representationId, undefined, "Representation id of aReprs[0] defined");
		assert.notEqual(aRepInfo[0].representationLabel.key, undefined, "Representation label of aReprs[0] defined");
	});
	QUnit.test('Method getSelectedRepresentationInfo()', function(assert) {
		var oRT = this.oStep.getSelectedRepresentationInfo();
		assert.ok(oRT, "return obj");
	});
	QUnit.test('Method getSelectedRepresentation()', function(assert) {
		var oSelectedRep = this.oStep.getSelectedRepresentation();
		assert.equal(oSelectedRep.type, "RepresentationTestDouble", "getSelectedRepresentation returned the expected object");
	});
	QUnit.test('Method getAdditionalConfigurationProperties()', function(assert) {
		// TODO This test must be extended if additional properties are added to a steptemplate, e.g. extension, exit etc.
		var oAdditionalConfigurationProperties = this.oStep.getAdditionalConfigurationProperties();
		assert.deepEqual(oAdditionalConfigurationProperties, {}, "StepTemplate1 has no additional configuration properties");
	});
	QUnit.module('Serialization / deserialization', {
		beforeEach : function(assert) {
			commonSetupStep(this);
			sap.apf.core.getMetadata = function() {
				return new sap.apf.testhelper.doubles.Metadata();
			};
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		},
		afterEach : function() {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test('Serialize and deserialize a step', function(assert) {
		var oExpectedSerializableStep = {
			stepId : "stepTemplate1",
			binding : {
				selectedRepresentation : {
					data : [],
					indicesOfSelectedData : [],
					selectionStrategy : "all"
				},
				selectedRepresentationId : "representationId1"
			}
		};
		this.oStep.getSelectedRepresentation().emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.all);
		this.oStep.setData({
			data : [],
			metadata : {}
		}, new sap.apf.core.utils.Filter(this.oMessageHandler, 'SAPClient', sap.apf.utils.Filter.getOperators().EQ, '777'));
		var oSerializableStep = this.oStep.serialize();
		assert.deepEqual(oSerializableStep, oExpectedSerializableStep, "Step serialized as expected");
		this.oNewStep = this.oConfigurationFactory.createStep("stepTemplate1");
		this.oNewStep.deserialize(oSerializableStep);
		assert.deepEqual(this.oNewStep.serialize(), oSerializableStep, "Step deserialized as expected");
	});
}());