jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.core.instance');
jQuery.sap.require('sap.apf.utils.startParameter');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');

(function() {
	'use strict';
		function createManifests () {
		var manifest;
		jQuery.ajax({
			url : "../testhelper/comp/manifest.json",
			dataType : "json",
			success : function(oData) {
				manifest = oData;
			},
			error : function(oJqXHR, sStatus, sError) {
				manifest = {};
			},
			async : false
		});
		var baseManifest;
		jQuery.ajax({
			url : "../../../../resources/sap/apf/base/manifest.json",
			dataType : "json",
			success : function(oData) {
				baseManifest = oData;
			},
			error : function(oJqXHR, sStatus, sError) {
				baseManifest = {};
			},
			async : false
		});
		return {
			manifest : manifest,
			baseManifest : baseManifest
		};
	}
	QUnit.module('Core API and Injection', {
		beforeEach : function(assert) {
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
		},
		afterEach : function(assert) {
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
		}
	});
	QUnit.test('MessageObject is properly created', function(assert) {
		var oMessageHandler = new sap.apf.core.MessageHandler();
		var oInstance = new sap.apf.core.Instance({
			instances: {
				messageHandler : oMessageHandler
			}
		});
		var oMessageObject = oInstance.createMessageObject({
			code : "5021"
		});
		assert.equal(oMessageObject.getCode(), "5021", "MessageObject properly created");
	});
	QUnit.test('Core objects instantiated properly', function(assert) {
		var spyMessageHandler = sinon.spy(sap.apf.core, "MessageHandler");
		var spyMetadataFactory = sinon.spy(sap.apf.core, "MetadataFactory");
		var spyTextResourceHandler = sinon.spy(sap.apf.core, "TextResourceHandler");
		var spyConfigurationFactory = sinon.spy(sap.apf.core, "ConfigurationFactory");
		var spyPath = sinon.spy(sap.apf.core, "Path");
		var spySessionHandler = sinon.spy(sap.apf.core, "SessionHandler");
		var spyResourcePathHandler = sinon.spy(sap.apf.core, "ResourcePathHandler");
		var spyPersistence = sinon.spy(sap.apf.core, "Persistence");
		var spyAnnotationHandler = sinon.spy(sap.apf.core.utils, "AnnotationHandler");
		var oMessageHandler = new sap.apf.core.MessageHandler();
		this.oInstance = new sap.apf.core.Instance({
			instances: {
				messageHandler : oMessageHandler
			}
		});
		assert.ok(spyMessageHandler.calledOnce, "MessageHandler constructor called exactly once");
		assert.ok(spyMetadataFactory.calledOnce, "MetadataFactory constructor called exactly once");
		assert.ok(spyTextResourceHandler.calledOnce, "TextResourceHandler constructor called exactly once");
		assert.ok(spyConfigurationFactory.calledOnce, "ConfigurationFactory constructor called exactly once");
		assert.ok(spyPath.calledOnce, "Path constructor called exactly once");
		assert.ok(spySessionHandler.calledOnce, "SessionHandler constructor called exactly once");
		assert.ok(spyResourcePathHandler.calledOnce, "ResourcePathHandler constructor called exactly once");
		assert.ok(spyPersistence.calledOnce, "Persistence constructor called exactly once");
		assert.ok(spyAnnotationHandler.calledOnce, "AnnotationHandler called exactly once");
		sap.apf.core.MessageHandler.restore();
		sap.apf.core.MetadataFactory.restore();
		sap.apf.core.TextResourceHandler.restore();
		sap.apf.core.ConfigurationFactory.restore();
		sap.apf.core.Path.restore();
		sap.apf.core.SessionHandler.restore();
		sap.apf.core.ResourcePathHandler.restore();
		sap.apf.core.Persistence.restore();
		sap.apf.core.utils.AnnotationHandler.restore();
	});
	QUnit.test('WHEN ajax is injected', function(assert) {

		var myAjax = function(config) {
			config.success("GreetingsFromMyAjax");
			assert.notOk(config.messageHandler, "THEN the message handler is not mixed into the ajax configuration");
		};
		var messageHandler = new sap.apf.core.MessageHandler();
		var instance = new sap.apf.core.Instance({
			functions : {
				ajax : myAjax
			},
			instances: {
				messageHandler : messageHandler
			}
		});

		instance.ajax({
			success : function(result) {
				assert.equal(result, "GreetingsFromMyAjax",
						"THEN injected AJAX is used instead of native AJAX");
			},
			error : function() {
			}
		});
	});

	QUnit.test('WHEN ajax is injected', function(assert) {

		var myAjax = function(config) {
			assert.equal(config.url, "/path/to/resource", "Injected Ajax has been called");
			config.success();
		};
		var myResourcePathHandler = function(inject) {
			assert.ok(true, inject.instances.fileExists.check("/path/to/resource"), "THEN file exists");
		};
		var messageHandler = new sap.apf.core.MessageHandler();
		new sap.apf.core.Instance({
			functions: { ajax : myAjax },
			instances: {
				messageHandler : messageHandler
			},
			constructors: {
				ResourcePathHandler : myResourcePathHandler
			}
		});
	});
	QUnit.test('WHEN session handler constructor is injected', function(assert) {

		var mySessionHandler = function() {
			this.getXsrfToken = function() {
				return "token";
			};
		};
		var messageHandler = new sap.apf.core.MessageHandler();
		var instance = new sap.apf.core.Instance({
			instances : {
				messageHandler : messageHandler
			},
			constructors : {
				SessionHandler : mySessionHandler
			}
		});

		var xsrfToken = instance.getXsrfToken("/path/of/no/interest");
		assert.equal(xsrfToken, "token", "THEN the token is returned from injected Session Handler");
	});

	QUnit.test('WHEN resource path handler constructor is injected', function(assert) {

		var myResourcePathHandler = function() {
			assert.ok(true, "THEN injected constructor is used");
			};
		var messageHandler = new sap.apf.core.MessageHandler();
		new sap.apf.core.Instance({
			instances : {
				messageHandler : messageHandler
			},
			constructors : {
				ResourcePathHandler : myResourcePathHandler
			}
		});

	});

	QUnit.test('WHEN metadata constructor is injected', function(assert) {

		var expectedProps = [ "prop1", "prop2"];
		var myMetadata = function() {
			this.getAllProperties = function() {
				return expectedProps;
			};
		};
		var messageHandler = new sap.apf.core.MessageHandler();
		var instance = new sap.apf.core.Instance({
			instances : {
				messageHandler : messageHandler
			},
			constructors: {
				Metadata : myMetadata
			}
		});

		var props = instance.getMetadata("/some/path").getAllProperties();
		assert.deepEqual(props, expectedProps, "THEN the properties are returned from injected metadata");
	});
	QUnit.test('WHEN metadata factory is created', function(assert){
		var messageHandler = new sap.apf.core.MessageHandler();

		var MetadataFactorySpy = function(inject) {

			assert.ok(inject.constructors.EntityTypeMetadata, "THEN proper injection of constructor of entity type metadata");
			assert.ok(inject.constructors.Hashtable, "THEN proper injection of constructor of hashtable");
			assert.ok(inject.constructors.Metadata, "THEN proper injection of constructor of metadata");
			assert.ok(inject.constructors.MetadataFacade, "THEN proper injection of constructor of metadata facade");
			assert.ok(inject.constructors.MetadataProperty, "THEN proper injection of constructor of metadata property");
			assert.ok(inject.constructors.ODataModel, "THEN proper injection of constructor of odata model");
			assert.ok(inject.instances.messageHandler, "THEN proper injection of instance of message handler");
			assert.ok(inject.instances.coreApi, "THEN proper injection of instance of core api");
			assert.ok(inject.instances.annotationHandler, "THEN proper injection of instance of annotation handler");
			assert.ok(inject.functions.getServiceDocuments, "THEN proper injection of function getServiceDocuments");
		};

		new sap.apf.core.Instance({
			instances : {
				messageHandler : messageHandler
			},
			constructors: {
				MetadataFactory : MetadataFactorySpy
			}
		});
	});
	QUnit.test('WHEN text resource handler constructor is injected', function(assert) {

		var expectedText = "expected Text";
		var myTextResourceHandler = function() {
			this.getTextNotHtmlEncoded = function() {
				return expectedText;
			};
		};
		var messageHandler = new sap.apf.core.MessageHandler();
		var instance = new sap.apf.core.Instance({
			instances : {
				messageHandler : messageHandler
			},
			constructors : {
				TextResourceHandler : myTextResourceHandler
			}
		});

		var text = instance.getTextNotHtmlEncoded("/some/path");
		assert.deepEqual(text, expectedText, "THEN the text is returned from injected text resource handler");
	});
	QUnit.test("WHEN Persistence is injected", function(assert) {
		var myPersistence = function(inject) {
			assert.ok(typeof inject.functions.getComponentName  === "function", "THEN getComponentName is injected");
			assert.ok(inject.instances.coreApi, "THEN core api is injected");
			assert.ok(inject.instances.messageHandler, "THEN messageHandler is injected");
		};
		var messageHandler = new sap.apf.core.MessageHandler();

		new sap.apf.core.Instance({
				instances : {
					messageHandler : messageHandler
				},
				constructors : {
					Persistence : myPersistence
				},
				functions: {
					getComponentName : function() { return "Comp1"; }
				}
		});

	});
	QUnit.module('Rudimentary apf core API functionality', {
		beforeEach : function(assert) {
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
		},
		afterEach : function(assert) {
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
		}
	});
	QUnit.test('getStartParameterFacade()', function(assert) {
		var componentDouble = {
			getComponentData : function() {
				var returnValue = {
					startupParameters : {
						'sap-apf-configuration-id' : [ 'configId' ]
					}
				};
				return returnValue;
			}
		};
		var startParameter = new sap.apf.utils.StartParameter(componentDouble);
		var messageHandler = new sap.apf.core.MessageHandler();
		var core = new sap.apf.core.Instance({
			instances : {
				startParameter : startParameter,
				messageHandler : messageHandler
			}
		});
		assert.equal(core.getStartParameterFacade().getAnalyticalConfigurationId().configurationId, componentDouble.getComponentData().startupParameters['sap-apf-configuration-id'][0], "Correct Id returned");
	});
	QUnit.module("core API: destroy", {
		beforeEach : function(assert) {
			var that = this;
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			this.fnPath = sap.apf.core.Path;
			sap.apf.core.Path = function() {
				this.destroy = function() {
					that.pathDestroyWasCalled = true;
				};
			};
			var componentDouble = {
				getComponentData : function() {
					var returnValue = {
						startupParameters : {
							'sap-apf-configuration-id' : [ 'configId' ]
						}
					};
					return returnValue;
				}
			};
			var startParameter = new sap.apf.utils.StartParameter(componentDouble);
			var messageHandler = new sap.apf.core.MessageHandler();
			this.core = new sap.apf.core.Instance({
				instances : {
					startParameter : startParameter,
					messageHandler : messageHandler
				}
			});
		},
		afterEach : function(assert) {
			sap.apf.core.Path = this.fnPath;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
		}
	});
	QUnit.test("WHEN coreAPI destroy is called", function(assert) {
		this.core.destroy();
		assert.ok(this.pathDestroyWasCalled, "THEN destroy method of path is called");
	});
	QUnit.module("core API - handling the manifests", {
		beforeEach : function(assert) {
			this.originalAjax = jQuery.ajax;
			sap.apf.testhelper.adjustResourcePaths(this.originalAjax);
		},
		afterEach : function() {
			jQuery.ajax = this.originalAjax;
		}
	});
	QUnit.test("WHEN manifests are injected", function(assert) {
		var spyResourcePathHandler = sinon.spy(sap.apf.core, "ResourcePathHandler");
		var spyConfigurationFactory = sinon.spy(sap.apf.core, "ConfigurationFactory");
		var oMessageHandler = new sap.apf.core.MessageHandler();
		var manifests = createManifests();
		var startParameter = new sap.apf.utils.StartParameter({});
		this.oInstance = new sap.apf.core.Instance({
			manifests : manifests,
			instances : {
				startParameter : startParameter,
				messageHandler : oMessageHandler
			}
		});
		assert.deepEqual(spyResourcePathHandler.getCall(0).args[0].manifests, manifests, "THEN manifests are injected into ressource path handler");
		assert.deepEqual(spyConfigurationFactory.getCall(0).args[0].manifests, manifests, "THEN manifests are injected into configuration factory");
		assert.equal(spyConfigurationFactory.getCall(0).args[0].manifests.manifest["sap.apf"].activateFilterReduction, true, "THEN filter reduction switch in manifest is recognized");
		sap.apf.core.ConfigurationFactory.restore();
		sap.apf.core.ResourcePathHandler.restore();
	});
	QUnit.module("core API - instantiation of resource path handler", {
		beforeEach : function(assert) {
			this.originalAjax = jQuery.ajax;
			sap.apf.testhelper.adjustResourcePaths(this.originalAjax);
		},
		afterEach : function() {
			jQuery.ajax = this.originalAjax;
		}
	});
	QUnit.test('WHEN resource path handler is created', function(assert) {
		var myResourcePathHandler = function(inject) {
			assert.deepEqual(inject.manifests, createManifests(), "THEN manifests have been injected");
			assert.ok(inject.instances.fileExists, "THEN fileExists is injected");
			assert.ok(inject.instances.messageHandler, "THEN messageHandler is injected");
			assert.ok(inject.instances.coreApi, "THEN coreApi is injected");
		};
		var messageHandler = new sap.apf.core.MessageHandler();
		new sap.apf.core.Instance({
			instances : {
				messageHandler : messageHandler
			},
			constructors : {
				ResourcePathHandler : myResourcePathHandler
			},
			functions : {
				getComponentName : function() { return "comp1"; }
			},
			manifests: createManifests()
		});

	});
	QUnit.module("WHEN open path is called", {
		beforeEach : function(assert) {
				var that = this;
				that.expectedPath1 = { path : { AnalysisPathName : "TheJustOpenedPath1" }};
				that.expectedPath2 = { path : { AnalysisPathName : "TheJustOpenedPath2" }};
				sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
				sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
				sap.apf.testhelper.doubles.OriginalPersistence = sap.apf.core.Persistence;
				sap.apf.core.Persistence = 	function () {
					this.openPath = function(sPathId, localCallback, nActiveStep) {
						var oResponse;
						if (sPathId == "idOfOpenedPath1") {
							oResponse = that.expectedPath1;
						} else {
							oResponse = that.expectedPath2;
						}
						localCallback(oResponse, {}, undefined);
					};
				};
			},
			afterEach : function(assert) {
				sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
				sap.apf.core.Persistence = sap.apf.testhelper.doubles.OriginalPersistence;
			}
	});
	QUnit.test("WHEN no error occurred", function(assert) {
		var that = this;
		var oMessageHandler = new sap.apf.core.MessageHandler();
		var oInstance = new sap.apf.core.Instance({
			instances : {
				messageHandler : oMessageHandler
			}
		});
		function callback1(path, metadata, messageObject) {
			assert.equal(messageObject, undefined, "THEN no error occurred");
			assert.deepEqual(path, that.expectedPath1, "THEN the correct path object is returned");
			assert.equal(oInstance.getPathName(), "TheJustOpenedPath1", "THEN the correct Path name is set" );
		}
		function callback2(path, metadata, messageObject) {
			assert.equal(messageObject, undefined, "THEN no error occurred");
			assert.deepEqual(path, that.expectedPath2, "THEN the correct path object is returned");
			assert.equal(oInstance.getPathName(), "TheJustOpenedPath2", "THEN the correct Path name is set" );
		}
		oInstance.openPath("idOfOpenedPath1", callback1);
		oInstance.resetPath();
		oInstance.openPath("idOfOpenedPath2", callback2);
	});
	QUnit.module("WHEN open path is called AND error occurrs", {
		beforeEach : function(assert) {
				sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
				sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
				sap.apf.testhelper.doubles.OriginalPersistence = sap.apf.core.Persistence;
				sap.apf.core.Persistence = 	function () {
					this.openPath = function(sPathId, localCallback, nActiveStep) {
						var messageObject = new sap.apf.core.MessageObject({ code : "5003"});
						localCallback(undefined, {}, messageObject);
					};
				};
			},
			afterEach : function(assert) {
				sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
				sap.apf.core.Persistence = sap.apf.testhelper.doubles.OriginalPersistence;
			}
	});
	QUnit.test("WHEN no error occurred", function(assert) {
		var oMessageHandler = new sap.apf.core.MessageHandler();
		var oInstance = new sap.apf.core.Instance({
			instances : {
				messageHandler : oMessageHandler
			}
		});
		function callback1(path, metadata, messageObject) {
			assert.equal(messageObject.getCode(), "5003", "THEN error is returned correctly");
			assert.equal(path, undefined, "THEN the correct path object is returned");
			assert.equal(oInstance.getPathName(), "", "THEN no Path name is set" );
		}
		oInstance.openPath("idOfOpenedPath1", callback1);
	});
	QUnit.module("SmartFilterBar", {
		beforeEach : function() {
			this.coreInstance = new sap.apf.core.Instance({
				instances: {
					messageHandler : new sap.apf.core.MessageHandler()
				}
			});
		}
	});
	QUnit.test("Get configuration if existing", function(assert){
		this.coreInstance.loadAnalyticalConfiguration(sap.apf.testhelper.config.getSampleConfiguration('addSmartFilterBar'));
		assert.ok(this.coreInstance.getSmartFilterBarConfiguration(), "SmartFilterBar configuration retrieved");
	});
	QUnit.test("Get configuration if NOT existing", function(assert){
		assert.strictEqual(this.coreInstance.getSmartFilterBarConfiguration(), undefined, "No SmartFilterBar configured");
	});
	QUnit.test('Get instance if no configuration exists', function (assert) {
		assert.strictEqual(this.coreInstance.getSmartFilterBar(), null, "Null indicates that an instance will never be created due to missing configuration");
	});
	QUnit.test('Get instance if configuration exists but no instance is registered', function (assert) {
		this.coreInstance.loadAnalyticalConfiguration(sap.apf.testhelper.config.getSampleConfiguration('addSmartFilterBar'));
		assert.ok(this.coreInstance.getSmartFilterBar().done, "Promise returned");
	});
	QUnit.test('Get instance if configuration exists and instance is registered', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var oSFB = {
				type: "SmartFilterBar"
		};
		this.coreInstance.loadAnalyticalConfiguration(sap.apf.testhelper.config.getSampleConfiguration('addSmartFilterBar'));
		this.coreInstance.getSmartFilterBar().done(function(oSFB){
			assert.equal(oSFB.type, "SmartFilterBar", "Instance is set and returned");
			done();
		});
		setTimeout(function(){
			this.coreInstance.registerSmartFilterBarInstance(oSFB);
		}.bind(this), 1);
	});
	QUnit.test("Serialize without SFB instance", function(assert){
		assert.equal(this.coreInstance.serialize().smartFilterBar, undefined, "No SFB filter information in serializable object");
	});
	QUnit.test("Serialize", function(assert){
		assert.expect(2);
		this.coreInstance.loadAnalyticalConfiguration(sap.apf.testhelper.config.getSampleConfiguration('addSmartFilterBar'));
		var oSFB = {
			type: "SmartFilterBar",
			fetchVariant: function(){
				assert.ok(true, "fetchVariant called");
				return { filters: "<InsertFilterHere>"};
			}
		};
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
		assert.deepEqual(this.coreInstance.serialize().smartFilterBar, {filters: "<InsertFilterHere>"},"SFB filter information assigned to the right property of serializable object");
	});
	QUnit.test("Deserialize with SFB instance and without serialized property", function(assert){
		assert.expect(1);
		var serializedObject = {
			path: {
				indicesOfActiveSteps: [],
				steps: []
			}
		};
		var oSFB = {
				type: "SmartFilterBar",
				applyVariant: function(){
					assert.ok(false, "applyVariant called, though not needed");
				}
			};
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
		this.coreInstance.deserialize(serializedObject);
		assert.ok(true, "Only assertion");
	});
	QUnit.test("Deserialize without SFB instance and with serialized property", function(assert){
		assert.expect(1);
		var serializedObject = {
				smartFilterBar: {filters: "<InsertFilterHere>"},
				path: {
					indicesOfActiveSteps: [],
					steps: []
				}
		};
		this.coreInstance.deserialize(serializedObject);
		assert.ok(true, "Only assertion");
	});
	QUnit.test("Deserialize", function(assert){
		assert.expect(1);
		var serializedObject = {
				smartFilterBar: {filters: "<InsertFilterHere>"},
				path: {
					indicesOfActiveSteps: [],
					steps: []
				}
		};
		var oSFB = {
				type: "SmartFilterBar",
				applyVariant: function(variant){
					assert.deepEqual(variant,  {filters: "<InsertFilterHere>"});
				}
		};
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
		this.coreInstance.deserialize(serializedObject);
	});
	QUnit.test("Serialize & Deserialize", function(assert){
		assert.expect(1);
		this.coreInstance.loadAnalyticalConfiguration(sap.apf.testhelper.config.getSampleConfiguration('addSmartFilterBar'));
		var oSFB = {
				type: "SmartFilterBar",
				fetchVariant: function(){
					return {filters: "<InsertFilterHere>"};
				},
				applyVariant: function(variant){
					assert.deepEqual(variant,  {filters: "<InsertFilterHere>"});
				}
		};
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
		var serializedObject = this.coreInstance.serialize();
		this.coreInstance.deserialize(serializedObject);
	});
	QUnit.test("Deserialize after backward navigation", function(assert){
		assert.expect(1);
		var serializedObject = {
				smartFilterBar: {filters: "<InsertFilterHere>"},
				path: {
					indicesOfActiveSteps: [],
					steps: []
				}
		};
		var oSFB = {
				type: "SmartFilterBar",
				applyVariant: function(variant){
					assert.deepEqual(variant,  {filters: "<InsertFilterHere>"});
				}
		};
		this.coreInstance.deserialize(serializedObject);
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
	});
	QUnit.test('Retrieve persistence key', function (assert) {
		this.coreInstance.loadAnalyticalConfiguration(sap.apf.testhelper.config.getSampleConfiguration('addSmartFilterBar'));
		assert.equal(this.coreInstance.getSmartFilterBarPersistenceKey('SmartFilterBar-1'), "APF67890SmartFilterBar-1", 'Correct persistence key for given SFB id returned');
	});
	QUnit.module("SmartFilterBar default filter values", {
		beforeEach : function() {
			var that = this;
			this.messageHandler = new sap.apf.core.MessageHandler();
			this.controlConfigurationStub = sinon.stub(sap.ui.comp.smartfilterbar, 'ControlConfiguration', function(controlConfig){
				return controlConfig;
			});
			this.selectOptionStub = sinon.stub(sap.ui.comp.smartfilterbar, 'SelectOption', function(selectOption){
				return selectOption;
			});
			this.coreInstance = new sap.apf.core.Instance({
				instances : {
					messageHandler : this.messageHandler
				},
				functions : {
					getCombinedContext : function(){
						return jQuery.Deferred().resolve(that.externalContext);
					}	
				}				
			});
		}, 
		afterEach : function() {
			this.selectOptionStub.restore();
			this.controlConfigurationStub.restore();
		}
	});
	QUnit.test('Empty external context', function (assert) {
		assert.expect(1);
		var done = assert.async();
		this.externalContext = new sap.apf.core.utils.Filter(this.messageHandler);
		this.coreInstance.getSmartFilterbarDefaultFilterValues().done(function(oControlConfig){
			assert.deepEqual(oControlConfig, [], 'Empty array returned');
			done();
		});
	});
	QUnit.test('External context with simple filter', function (assert) {
		assert.expect(1);
		var done = assert.async();
		this.externalContext = new sap.apf.core.utils.Filter(this.messageHandler, 'A', 'EQ', '1');
		this.coreInstance.getSmartFilterbarDefaultFilterValues().done(function(oControlConfig){
			var expectedControlConfig = [{
				key : 'A', 
				visibleInAdvancedArea : true,
				defaultFilterValues : [{
					sign: 'I',
					low: '1',
					operator: 'EQ', 
					high : undefined
				}]
			}];
			assert.deepEqual(oControlConfig, expectedControlConfig, 'Array with one control configuration returned');
			done();
		});
	});
	QUnit.test('External context with advanced filter', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var filterA = new sap.apf.core.utils.Filter(this.messageHandler, 'A', 'EQ', '1');
		filterA.addOr('A', 'EQ', '2');
		var filterB = new sap.apf.core.utils.Filter(this.messageHandler, 'B', 'BT', '1', '5');
		this.externalContext = new sap.apf.core.utils.Filter(this.messageHandler).addAnd(filterA).addAnd(filterB);
		
		this.coreInstance.getSmartFilterbarDefaultFilterValues().done(function(oControlConfig){
			var expectedControlConfig = [{
				key : 'A',
				visibleInAdvancedArea : true,
				defaultFilterValues : [{
					sign: 'I',
					low: '1',
					operator: 'EQ', 
					high : undefined
				}, 
				{
					sign: 'I',
					low: '2',
					operator: 'EQ', 
					high : undefined
				}]
			}, 
			{
				key : 'B',
				visibleInAdvancedArea : true,
				defaultFilterValues : [{
					sign: 'I',
					low: '1',
					operator: 'BT', 
					high : '5'
				}]
			}
			];
			assert.deepEqual(oControlConfig, expectedControlConfig, 'Correct control configuration resolved in promise');
			done();
		});
	});
	QUnit.module("SmartFilterBar filter and external context", { 
		beforeEach : function() {
			var that = this;
			this.messageHandler = new sap.apf.core.MessageHandler();
			this.coreInstance = new sap.apf.core.Instance({
				instances : { messageHandler : this.messageHandler },
				functions : {
					getCombinedContext : function(){
						 return jQuery.Deferred().resolve(that.externalContext);
					}
				}
			});
			this.smartFilterBar = jQuery.Deferred().resolve({
				getFilters : function(){
					return that.smartFilterBarFilters;
				} 
			});
			this.coreInstance.getSmartFilterBar = function(){
				return that.smartFilterBar;
			};
		}
	});
	QUnit.test('No SmartFilterBar', function (assert) {
		this.smartFilterBar = null;
		this.externalContext = new sap.apf.core.utils.Filter(this.messageHandler, 'A', 'EQ', '1');
		this.coreInstance.getReducedCombinedContext().done(function(filter){
			assert.ok(filter.isEqual(this.externalContext), 'Unchanged filter from external context expected');
		}.bind(this));
	});
	QUnit.test('External context not applicable to SmartFilterBar', function (assert) {
		this.smartFilterBarFilters = [];
		this.externalContext = new sap.apf.core.utils.Filter(this.messageHandler, 'A', 'EQ', '1');
		this.coreInstance.getReducedCombinedContext().done(function(filter){
			assert.ok(filter.isEqual(this.externalContext), 'Unchanged filter from external context expected');
		}.bind(this));
	});
	QUnit.test('External context fully applicable to SmartFilterBar', function (assert) {
		this.smartFilterBarFilters = [{
			aFilters : [{
				aFilters : [{
					oValue1 : '1', 
					oValue2 : '', 
					sOperator : 'EQ', 
					sPath : 'A'
				}],
				bAnd : false
			}, 
			{
				aFilters : [{
					oValue1 : '2', 
					oValue2 : '', 
					sOperator : 'EQ', 
					sPath : 'B'
				}],
				bAnd : false
			}], 
			bAnd : true
		}];
		this.externalContext = new sap.apf.core.utils.Filter(this.messageHandler, 'A', 'EQ', '1').addAnd('B', 'EQ', '2');
		this.coreInstance.getReducedCombinedContext().done(function(filter){
			assert.ok(filter.isEmpty(), 'All filters applied in SmartFilterBar which results in empty filter in reduced combined context');
		});
	});
	QUnit.test('External context partially applicable to SmartFilterBar', function (assert) {
		this.smartFilterBarFilters = [{
			aFilters : [{
				aFilters : [{
					oValue1 : '1', 
					oValue2 : '', 
					sOperator : 'EQ', 
					sPath : 'A'
				}],
				bAnd : false
			}, 
			{
				aFilters : [{
					oValue1 : '2', 
					oValue2 : '', 
					sOperator : 'EQ', 
					sPath : 'B'
				}],
				bAnd : false
			}], 
			bAnd : true
		}];
		this.externalContext = new sap.apf.core.utils.Filter(this.messageHandler, 'A', 'EQ', '1').addAnd('B', 'EQ', '2').addAnd('C', 'EQ', '3');
		this.coreInstance.getReducedCombinedContext().done(function(filter){
			assert.equal(filter.toUrlParam(), '(C%20eq%20%273%27)', 'Reduced combined context contains correct filter');
		});
	});
	
	QUnit.module("AnnotationHandler", {
		beforeEach : function() {
			this.coreInstance = new sap.apf.core.Instance({
				instances : {
					messageHandler : new sap.apf.core.MessageHandler()
				},
				constructors : {
					AnnotationHandler : function(){
						this.getAnnotationsForService = function(serviceRoot){
						return serviceRoot;
						};
					}
				}
			});
		}
	});
	QUnit.test('getAnnotationsForService', function (assert) {
		assert.equal(this.coreInstance.getAnnotationsForService('myServiceRoot'), 'myServiceRoot' , 'getAnnotationsForService call forwarded to AnnotationHandler');
	});
}());
