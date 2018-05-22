jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.step');
jQuery.sap.require('sap.apf.testhelper.doubles.binding');
jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require('sap.apf.core.resourcePathHandler');
jQuery.sap.require('sap.apf.core.configurationFactory');
jQuery.sap.require('sap.apf.core.representationTypes');
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

	QUnit.module('Configuration Factory', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oConfigurationTemplate = sap.apf.testhelper.config.getSampleConfiguration();
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			});
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.fnStep = sap.apf.core.Step;
			sap.apf.core.Step = sap.apf.testhelper.doubles.Step;
			this.fnBinding = sap.apf.core.Binding;
			sap.apf.core.Binding = sap.apf.testhelper.doubles.Binding;
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
			sap.apf.core.Step = this.fnStep;
			sap.apf.core.Binding = this.fnBinding;
		}
	});
	QUnit.test('Initialization', function(assert) {
		assert.ok(this.oConfigurationFactory, "Factory initialized");
	});
	QUnit.test('Get navigation targets', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var navigationTargets = this.oConfigurationFactory.getNavigationTargets();
		var expectedTargets = [ {
			"action" : "analyzeDSO",
			"id" : "nav-SD",
			"semanticObject" : "DaysSalesOutstanding",
			"type" : "navigationTarget"
		}, {
			"action" : "analyzeDPO",
			"id" : "nav-MM",
			"isStepSpecific" : true,
			"semanticObject" : "DaysPayablesOutstanding",
			"type" : "navigationTarget"
		} ];
		assert.deepEqual(navigationTargets, expectedTargets, "THEN equals expected navigation targets");
	});
	QUnit.test('Blind load and default representation types available', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oRepresentationType = this.oConfigurationFactory.getConfigurationById("ColumnChartClustered");
		assert.equal(oRepresentationType.type, "representationType", "Default Representation Type available");
	});
	QUnit.test("Analytical configuration, that contains no representation types", function(assert) {
		var oConfigWithoutRepresenationType = {
			steps : [ {
				type : "step", // optional
				id : "stepTemplate1",
				request : "requestTemplate1",
				binding : "bindingTemplate1",
				categories : [ {
					type : "category", // optional
					id : "initial"
				} ]
			} ],
			requests : [ {
				type : "request",
				id : "requestTemplate1",
				service : "dummy.xsodata",
				entityType : "EntityType1",
				selectProperties : [ "PropertyOne", "PropertyTwo" ]
			} ],
			bindings : [ {
				type : "binding",
				id : "bindingTemplate1",
				requiredFilters : [ "Customer" ], // set of filters required to uniquely identify rows selection
				representations : [ {
					type : "representation",
					id : "representationId1"
				} ]
			} ],
			categories : []
		};
		this.oConfigurationFactory.loadConfig(oConfigWithoutRepresenationType);
		var oStep = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
		assert.ok(oStep, "Object properly hashed");
	});
	QUnit.test("Analytical configuration, that contains a configHeader", function(assert) {
		this.oConfigurationTemplate.configHeader = { // should be ignored by loadConfiguration.
			severalAttributes1 : "a",
			severalAttributes2 : "b",
			severalAttributes3 : "c"
		};
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oStep = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
		assert.ok(oStep, "Object properly hashed");
	});
	QUnit.test('Load and get step', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oStep = this.oConfigurationFactory.getConfigurationById("stepTemplate1");
		assert.ok(oStep, "Object properly hashed");
		assert.equal(oStep.type, "step", "Object has type step");
	});
	QUnit.test('Load and get request', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oRequest = this.oConfigurationFactory.getConfigurationById("requestTemplate1");
		assert.ok(oRequest, "Object properly hashed");
		assert.equal(oRequest.type, "request", "Object has type step");
	});
	QUnit.test('Load and get binding', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oBinding = this.oConfigurationFactory.getConfigurationById("bindingTemplate1");
		assert.ok(oBinding, "Object properly hashed");
		assert.equal(oBinding.type, "binding", "Object has type step");
	});
	QUnit.test('Load binding fails if a representation has no id', function(assert) {
		assert.throws(function() {
			this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("representationWithoutId"));
		}, "Error successfully thrown due to missing representation id");
	});
	QUnit.test('Load binding fails if representations have duplicated ids', function(assert) { 
		this.oMessageHandler.spyPutMessage();
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("representationsWithDuplicatedtIds"));
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5029", "Error successfully thrown due to duplicated representation ids");
	});
	QUnit.test('Load and get category', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oCategory = this.oConfigurationFactory.getConfigurationById("categoryTemplate1");
		assert.ok(oCategory, "Object properly hashed");
		assert.equal(oCategory.type, "category", "Object has type step");
		assert.equal(oCategory.id, "categoryTemplate1", "Object has correct id");
	});
	QUnit.test('Load and get configuration header', function (assert) {
		var oExpectedConfigHeader = {
				"Application": "12345",
				"ApplicationName": "APF Application",
				"SemanticObject": "SemObj",
				"AnalyticalConfiguration": "67890",
				"AnalyticalConfigurationName": "APF Configuration",
				"UI5Version": "1.XX.XX",
				"CreationUTCDateTime": "/Date(1423809274738)/",
				"LastChangeUTCDateTime": "/Date(1423809274738)/"
		};
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oConfigHeader = this.oConfigurationFactory.getConfigHeader();
		assert.deepEqual(oConfigHeader, oExpectedConfigHeader, "ConfigHeader returned");
	});
	QUnit.test('Set item', function(assert) {
		var oFactory = new sap.apf.core.ConfigurationFactory({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			}
		});
		var oConfigurationWithDuplicatedIds = {
			steps : [ {
				type : "step", // optional
				id : "stepTemplate1"
			}, {
				id : "stepTemplate1"
			} ]
		};
		assert.throws(function() {
			oFactory.loadConfig(oConfigurationWithDuplicatedIds);
		}, "Error successfully thrown due to duplicated id's in configuration file");
	});
	QUnit.test('Create binding', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oBindingTemplate1 = this.oConfigurationFactory.createBinding("bindingTemplate1", {}, {});
		assert.ok(oBindingTemplate1.type === "binding", "Binding has correct type'");
		assert.ok(!oBindingTemplate1.hasOwnProperty("filters"), "Filters has been deleted");
		assert.ok(!oBindingTemplate1.hasOwnProperty("model"), "Model has been deleted");
		assert.ok(!oBindingTemplate1.hasOwnProperty("exit"), "Exit has been deleted");
		assert.throws(function() {
			this.oConfigurationFactory.createBinding("stepTemplate1");
		}, "Error successfully thrown, because handed over id does not belong to type binding");
	});
	QUnit.test('Create request', function(assert) {
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("filterMapping"));
		var oRequest = this.oConfigurationFactory.createRequest("requestTemplate1");
		assert.ok(oRequest.type === "request", "Request is of type 'request'");
		assert.throws(function() {
			this.oConfigurationFactory.createRequest("requestTemplateX");
		}, "Error successfully thrown, because id doesn't exist");
		assert.throws(function() {
			this.oConfigurationFactory.createRequest("stepTemplate1");
		}, "Error successfully thrown, because handed over id does not belong to type request");
		var oRequestConfig = this.oConfigurationFactory.getConfigurationById("requestFilterMapping");
		var oRequestFilterMapping = this.oConfigurationFactory.createRequest(oRequestConfig);
		assert.ok(oRequestFilterMapping.type === "request", "Filter mapping request is of type 'request'");
	});
	QUnit.test('Create step with thumbnails', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		assert.equal(oStep.thumbnail.type, "thumbnail", "Object step has thumbnail of type thumbnail");
		assert.ok(oStep.thumbnail.leftUpper !== undefined, "leftUpper is defined ");
		assert.equal(oStep.thumbnail.leftUpper.key, "localTextReferenceStepTemplate1LeftUpper", "Step has leftUpper with correct key");
		assert.equal(oStep.thumbnail.rightUpper.key, "localTextReferenceStepTemplate1RightUpper", "Step has rightUpper with correct key");
		assert.equal(oStep.thumbnail.rightLower.key, "localTextReferenceStepTemplate1RightLower", "Step has rightLower with correct key");
		assert.equal(oStep.thumbnail.leftLower.key, "localTextReferenceStepTemplate1LeftLower", "Step has leftLower with correct key");
	});
	QUnit.test('Create step', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		assert.ok(oStep.type === "step", "Step has type 'step'");
		assert.equal(oStep.title.key, "localTextReference2", "Step has correct title");
		assert.equal(oStep.categories[0].type, "category", "Object step has category of type category");
		assert.equal(oStep.categories[0].id, "categoryTemplate1", "Object step has category with correct id");
		var oStep2 = this.oConfigurationFactory.getConfigurationById("stepTemplate2");
		assert.equal(oStep2.thumbnail.type, "thumbnail", "Object step has thumbnail of type picture");
		assert.ok(!oStep.hasOwnProperty("bindingRef"), "Step has no public property BindingRef");
		assert.ok(!oStep.hasOwnProperty("requestRef"), "Step has no public property RequestRef");
	});
	QUnit.test('Load config again in order to replace the first config', function(assert) {
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		var secondConfig = sap.apf.testhelper.config.getSampleConfiguration();
		secondConfig.steps[0].id = secondConfig.categories[0].steps[0].id = "stepTemplateNew";
		this.oConfigurationFactory.loadConfig(secondConfig);
		assert.throws(function() {
			this.oConfigurationFactory.createStep("stepTemplate1");
		}, "Creation of original step should fail (modified config).");
		assert.ok(this.oConfigurationFactory.createStep("stepTemplateNew"), "Creation of modified step succeeds.");
	});
	QUnit.test('Set step constructor', function(assert) {
		var fnStepConstructor = function(oInject, oStepTemplate) {
			this.id = 'Created by constructor set from outside ' + oStepTemplate.id;
		};
		var oStep;
		var fnStep = sap.apf.core.Step;
		sap.apf.core.Step = fnStepConstructor;
		this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
		oStep = this.oConfigurationFactory.createStep("stepTemplate1");
		var bResult = oStep.id === 'Created by constructor set from outside stepTemplate1';
		assert.ok(bResult, 'Same IDs expected');
		sap.apf.core.Step = fnStep;
	});
	QUnit.test('Get service documents', function(assert) {
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("secondServiceDocument"));
		var aServiceDocuments = this.oConfigurationFactory.getServiceDocuments();
		assert.deepEqual(aServiceDocuments, [ "dummy.xsodata", "secondServiceDocument.xsodata" ], "Correct name of requested service documents");
	});
	QUnit.module('Configuration factory reactions on wrong configuration', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}				
			});
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.fnStep = sap.apf.core.Step;
			sap.apf.core.Step = sap.apf.testhelper.doubles.Step;
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
			sap.apf.core.Step = this.fnStep;
		}
	});
	QUnit.test('Representation constructor module path does not contain a function', function(assert) {
		this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("wrongRepresentationConstructor"));
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5030", "Error Code 5030 expected");
	});
	QUnit.module('Configuration factory reactions on wrong configuration', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.fnStep = sap.apf.core.Step;
			sap.apf.core.Step = sap.apf.testhelper.doubles.Step;
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
			sap.apf.core.Step = this.fnStep;
		}
	});
	QUnit.test('Mal formed step assignment throws technical error', function(assert) {
		assert.expect(1);
		try {
			this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("malformedStepAssignmentForCategory"));
		} catch (err) {
			assert.ok(err.message.indexOf("step with wrong format") > -1, "the right exception was raised");
		}
	});
	QUnit.test('category assignment for not existing step throws technical error', function(assert) {
		assert.expect(1);
		try {
			this.oConfigurationFactory.loadConfig(sap.apf.testhelper.config.getSampleConfiguration("notExistingStepAssignedToCategory"));
		} catch (err) {
			assert.ok(err.message.indexOf("does not exist") > -1, "the right exception was raised");
		}
	});
	QUnit.module('Error behavior', {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().supportLoadConfigWithoutAction().spyPutMessage();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doLoadMessageConfigurations();
		}
	});
	QUnit.test('No analytical configuration loaded', function(assert) {
		this.oConfigurationFactory.getStepTemplates();
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5020", "THEN fatal error WHEN accessing configuration objects");
	});
	QUnit.module('SmartFilterBar', {
		beforeEach : function(assert) {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.configurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.messageHandler
				}
			});
			this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		}
	});
	QUnit.test('Load without SmartFilterBar config', function(assert) {
		var SFBLoadResult;
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		SFBLoadResult = this.configurationFactory.getSmartFilterBarConfiguration();
		assert.strictEqual(SFBLoadResult, undefined, '"undefined" expected if there is no SFB config');
	});
	QUnit.test('Load complete SmartFilterBar config and retrieve it', function(assert) {
		var SFBLoadResult;
		var SFBConfig = {
			type : "smartFilterBar",
			id : "SmartFilterBar-1",
			service : "/test/service",
			entityType : "testEntityType"
		};
		this.sampleConfiguration.smartFilterBar = SFBConfig;
		
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		SFBLoadResult = this.configurationFactory.getSmartFilterBarConfiguration();
		assert.deepEqual(SFBLoadResult, SFBConfig, 'Object with same values expected');
		assert.notEqual(SFBLoadResult, SFBConfig, 'Different instance expected');
	});
	QUnit.test('Load incomplete SmartFilterBar config and retrieve it - service missing', function(assert) {
		var SFBLoadResult;
		var SFBConfig = {
				type : "smartFilterBar",
				id : "SmartFilterBar-1",
				entityType : "testEntityType"
		};
		this.sampleConfiguration.smartFilterBar = SFBConfig;
		
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		SFBLoadResult = this.configurationFactory.getSmartFilterBarConfiguration();
		assert.deepEqual(SFBLoadResult, undefined, 'Object with same values expected');
	});
	QUnit.test('Load incomplete SmartFilterBar config and retrieve it - entityType missing', function(assert) {
		var SFBLoadResult;
		var SFBConfig = {
				type : "smartFilterBar",
				id : "SmartFilterBar-1",
				service : "/test/service"
		};
		this.sampleConfiguration.smartFilterBar = SFBConfig;
		
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		SFBLoadResult = this.configurationFactory.getSmartFilterBarConfiguration();
		assert.deepEqual(SFBLoadResult, undefined, 'Object with same values expected');
	});
	QUnit.module('Load facet filter config', {
		beforeEach : function(assert) {
			var testEnv = this;
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.configurationFactory = new sap.apf.core.ConfigurationFactory({
				instances: {
					messageHandler : this.messageHandler
				},
				constructors : {
						RegistryProbe : function(idRegistry) {
							testEnv.idRegistry = idRegistry;
					}
				}
			});
			this.sampleConfiguration = sap.apf.testhelper.config.getSampleConfiguration('addTwoFacetFilters');
		}
	});
	QUnit.test('Configured facet filters create no indicator in idRegistry for facet filter option', function(assert) {
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getRegistry();
		assert.equal(this.idRegistry.getItem(sap.apf.core.constants.existsEmptyFacetFilterArray), undefined, 'Indicator for facet filter not set');
	});
	QUnit.test('Not at all configured facet filters create no indicator in idRegistry', function(assert) {
		delete this.sampleConfiguration.facetFilters;
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getRegistry();
		assert.equal(this.idRegistry.getItem(sap.apf.core.constants.existsEmptyFacetFilterArray), undefined, 'Indicator for facet filter not set');
	});
	QUnit.test('Empty array creates indicator in idRegistry', function(assert) {
		this.sampleConfiguration.facetFilters = [];
		this.configurationFactory.loadConfig(this.sampleConfiguration);
		this.configurationFactory.getRegistry();
		assert.equal(this.idRegistry.getItem(sap.apf.core.constants.existsEmptyFacetFilterArray), true, 'Indicator for facet filter set');
	});
	QUnit.module('Facet filter via object creation', {
		beforeEach : function(assert) {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.messageHandler
				}
			}).doubleMessaging();
			this.configurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.messageHandler,
					coreApi : this.coreApi					
				}
			});
		},
		afterEach : function(assert) {
			delete sap.apf.preselectionFunction;
		}
	});
	QUnit.test('Create minimal facet filter object and retrieve it', function(assert) {
		var expectedFilter = {
			type : 'facetFilter',
			id : 'filterIdA',
			property : 'property1',
			valueHelpRequest : 'valueHelpRequestProperty1',
			filterResolutionRequest : 'filterResolutionRequestProperty1',
			multiSelection : false,
			preselectionDefaults : [ 1, 2, 3 ],
			preselectionFunction : undefined,
			label : {
				type : 'label',
				kind : 'text',
				key : 'property1'
			}
		};
		this.configurationFactory.addObject(expectedFilter);
		assert.equal(this.configurationFactory.getConfigurationById('filterIdA'), expectedFilter, 'Identical object expected');
	});
	QUnit.test('Mandatory properties for facet filter object', function(assert) {
		var wrongFilterType = {
			type : 'filter',
			id : 'filterIdA',
			property : 'property1'
		};
		var wrongFilterProperty = {
			type : 'facetFilter',
			id : 'filterIdA',
			property : undefined
		};
		var wrongFilterId = {
			type : 'facetFilter',
			id : undefined,
			property : 'property1'
		};
		this.configurationFactory.addObject(wrongFilterType);
		assert.equal(this.messageHandler.spyResults.putMessage.code, 5033, "Message code for wrong type");
		this.configurationFactory.addObject(wrongFilterProperty);
		assert.equal(this.messageHandler.spyResults.putMessage[1].code, 5034, "Message code for missing property");
		assert.throws(function() {
			this.configurationFactory.addObject(wrongFilterId);
		}, 'Technical message logged - test double throws instead');
	});
	QUnit.test('Get facet filters previously added', function(assert) {
		var facetFilter1 = {
			type : 'facetFilter',
			id : 'filterIdA',
			property : 'property1'
		};
		var facetFilter2 = {
			type : 'facetFilter',
			id : 'filterIdB',
			property : 'property2'
		};
		var expected = [ facetFilter1, facetFilter2 ];
		this.configurationFactory.addObject(facetFilter1);
		this.configurationFactory.addObject(facetFilter2);
		assert.deepEqual(this.configurationFactory.getFacetFilterConfigurations(), expected, "Expected facet filters returned");
		assert.notEqual(this.configurationFactory.getFacetFilterConfigurations()[0], expected[0], "Returned filters are copies and no references");
	});
	QUnit.test('Preselection function module path resolution successful', function(assert) {
		sap.apf.preselectionFunction = function() {
			return 'Successfully resolved';
		};
		var configWithValidPreselectionFunctionPath = {
			type : 'facetFilter',
			id : 'filterIdP',
			property : 'propertyP',
			preselectionFunction : 'sap.apf.preselectionFunction'
		};
		this.configurationFactory.addObject(configWithValidPreselectionFunctionPath);
		assert.equal(this.configurationFactory.getFacetFilterConfigurations()[0].preselectionFunction(), 'Successfully resolved', ',Resolvement succussful');
	});
	QUnit.test('Preselection function module path resolution fails', function(assert) {
		sap.apf.preselectionFunction = 'I am no function';
		var configWithValidPreselectionFunctionPath = {
			type : 'facetFilter',
			id : 'filterIdP',
			property : 'propertyP',
			preselectionFunction : 'sap.apf.preselectionFunction'
		};
		this.configurationFactory.addObject(configWithValidPreselectionFunctionPath);
		assert.equal(this.configurationFactory.getFacetFilterConfigurations()[0].preselectionFunction, undefined, 'Facet filter property preselectionFunction set undefined');
		assert.equal(this.messageHandler.spyResults.putMessage.code, 5035, "Message code for invalid function module path");
	});
	QUnit.module("Configuration from modeler", {
		beforeEach : function(assert) {
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : this.oMessageHandler
				}
			}).doubleMessaging();
			this.oCoreApi.createRepresentation = function(sRepresentationConstructorPath, oConfig) {
				var interfaceProxy = new sap.apf.ui.representations.RepresentationInterfaceProxy(this.oCoreApi, {});
				var Representation = sap.apf.utils.extractFunctionFromModulePathString(sRepresentationConstructorPath);
				return new Representation(interfaceProxy, oConfig);
			};
			this.oConfigurationTemplate = this.getJSON('../testhelper/config/analyticalConfigurationFromModeler1.json', assert);
			this.oConfigurationFactory = new sap.apf.core.ConfigurationFactory({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi
				}
			});
			this.oConfigurationFactory.loadConfig(this.oConfigurationTemplate);
			this.fnRequest = sap.apf.core.Request;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
		},
		getJSON : function(url, assert) {
			var analyticalConfiguration;
			jQuery.ajax({
				url : url,
				dataType : "json",
				success : function(data) {
					analyticalConfiguration = data;
				},
				error : function() {
					assert.ok(false, "error in retrieving json");
				},
				async : false
			});
			return analyticalConfiguration;
		},
		afterEach : function(assert) {
			sap.apf.core.Request = this.fnRequest;
		}
	});
	QUnit.test("Get thumbnails of step and representation", function(assert) {
		var oStep = this.oConfigurationFactory.createStep("Step-1");
		assert.ok(oStep, "Step has been created");
		var representationInfo = oStep.getRepresentationInfo();
		assert.ok(representationInfo[0].thumbnail, "Thumbnail expected");
	});
}());