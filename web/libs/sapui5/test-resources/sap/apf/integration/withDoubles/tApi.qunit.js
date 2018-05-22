jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.createComponent');
jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerStubbedAjax');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');

(function () {
	'use strict';

	function getConfiguration() {
		return {
			analyticalConfigurationName: "configForTesting-tApi",
			steps: [],
			requests: [],
			bindings: [],
			categories: [],
			representationTypes: [],
			navigationTargets: []
		};
	}

	QUnit.module('Create an isolated apf.Component with stubbed instance', {
		beforeEach: function() {
			var testContext = this;
			function ResourcePathHandlerPatched(inject) {
				sap.apf.testhelper.interfaces.IfResourcePathHandler.call(this, inject);
				sap.apf.testhelper.doubles.ResourcePathHandler.call(this, inject);
				this.loadConfigFromFilePath = function () { // overwrite
					this.oCoreApi.loadAnalyticalConfiguration(getConfiguration());
					testContext.configWasLoaded = true;
				};
			}
			this.defaultInject = {
					constructors : {
						ResourcePathHandler : ResourcePathHandlerPatched,
						SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
						UiInstance : sap.apf.testhelper.doubles.UiInstance
					}
			};
		}
	});
	QUnit.test("Empty stubs takes defaults", function (assert) {
		var testContext = this;

		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject});
		assert.notEqual(testContext.oApi, undefined, "api exists");
		assert.notEqual(testContext.oComponent.getProbe(), undefined, "dependencies exists");
		assert.notEqual(testContext.oComponent.getProbe().apfApi, undefined, "dependencies.apfApi exists");
		testContext.oCompContainer.destroy();
	});
	QUnit.test("Set analytical configuration", function (assert) {
		var testContext = this;
		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject});

		assert.strictEqual(testContext.configWasLoaded , true, "testContext.configuration was used");
		testContext.oCompContainer.destroy();
	});
	QUnit.test("Define the probe", function (assert) {
		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject});

		assert.notStrictEqual(this.oComponent.getProbe(), undefined, "probe function called");
		this.oCompContainer.destroy();
	});
	QUnit.test("Define the coreProbe", function (assert) {
		var testContext = this;
		this.defaultInject.coreProbe = function (coreDependencies) {
				testContext.coreProbe = coreDependencies;
		};
		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject});
		assert.notEqual(testContext.coreProbe.resourcePathHandler, undefined, "resourcePathHandler exists in probe");
		testContext.oCompContainer.destroy();
	});
	QUnit.test("Define the ResourcePathHandler double", function (assert) {
		var testContext = this;
		this.defaultInject.constructors.ResourcePathHandler = function (inject) {
				sap.apf.testhelper.interfaces.IfResourcePathHandler.call(this, inject);
				sap.apf.testhelper.doubles.ResourcePathHandler.call(this, inject);
				this.loadConfigFromFilePath = function () {
					this.oCoreApi.loadAnalyticalConfiguration(getConfiguration());
					testContext.ownRPH = 4711;
				};
		};
		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance: true,  path : "pathOfNoInterest",  inject : this.defaultInject});
		assert.strictEqual(testContext.ownRPH, 4711, "own resource path handler called");
		testContext.oCompContainer.destroy();
	});
	QUnit.test("Define the UiInstance", function (assert) {
		var testContext = this;
		this.defaultInject.constructors.UiInstance = function (inject) {
				sap.apf.testhelper.doubles.UiInstance.call(this, inject);
				testContext.ownUiInstance = 4711;
		};
		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject});

		assert.strictEqual(testContext.ownUiInstance, 4711, "UiInstance function called");
		testContext.oCompContainer.destroy();
	});
	QUnit.test("A core method can be tested using the coreProbe", function (assert) {
		var testContext = this;
		this.defaultInject.constructors.ResourcePathHandler = function (inject) {
					var handlerContext = this;
					sap.apf.testhelper.interfaces.IfResourcePathHandler.call(this, inject);
					sap.apf.testhelper.doubles.ResourcePathHandler.call(this, inject);
					this.loadConfigFromFilePath = function () {
						handlerContext.oCoreApi.loadAnalyticalConfiguration(getConfiguration());
					};
		};
		this.defaultInject.coreProbe = function(dependencies) {
			testContext.coreDependencies = dependencies;
		};
		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject});
		assert.notEqual(testContext.coreDependencies.resourcePathHandler, undefined, "coreDependencies.resourcePathHandler exists");
		var spy_configurationFactory = sinon.spy(testContext.coreDependencies.configurationFactory, "loadConfig");
		var spy_resourcePathHandler = sinon.spy(testContext.coreDependencies.resourcePathHandler, "loadConfigFromFilePath");

		testContext.coreDependencies.resourcePathHandler.loadConfigFromFilePath("pathThatCannotWork");

		assert.strictEqual(spy_resourcePathHandler.callCount, 1, "resourcePathHandler.loadConfigFromFilePath called once");
		assert.strictEqual(spy_configurationFactory.callCount, 1, "configurationFactory.loadConfig called once");
		testContext.oCompContainer.destroy();
	});
	QUnit.test("Calling via api and Stubbing the method messageHandler.putMessage using sinon", function (assert) {
		var testContext = this;
		this.defaultInject.coreProbe = function(dependencies) {
			testContext.coreDependencies = dependencies;
		};
		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject});
		assert.notEqual(testContext.oComponent.getProbe().messageHandler, undefined, "dependencies.messageHandler exists");
		var stub_messageHandler_putMessage = sinon.stub(testContext.oComponent.getProbe().messageHandler, "putMessage", function() {
			return null;
		});

		testContext.oApi.putMessage("none");

		assert.strictEqual(stub_messageHandler_putMessage.callCount, 1, "messageHandler.putMessage called once");
		testContext.oCompContainer.destroy();
	});
	
	QUnit.module('Creating startFilterHandler with onBeforeStartUpPromise', {
		beforeEach: function(assert) {
			var testContext = this;
			function ResourcePathHandlerPatched(inject) {
				sap.apf.testhelper.interfaces.IfResourcePathHandler.call(this, inject);
				sap.apf.testhelper.doubles.ResourcePathHandler.call(this, inject);
				this.loadConfigFromFilePath = function () { // overwrite
					this.oCoreApi.loadAnalyticalConfiguration(getConfiguration());
					testContext.configWasLoaded = true;
				};
			}
			this.defaultInject = {
					constructors : {
						ResourcePathHandler : ResourcePathHandlerPatched,
						SessionHandler : sap.apf.testhelper.doubles.SessionHandlerStubbedAjax,
						UiInstance : sap.apf.testhelper.doubles.UiInstance,
						StartFilterHandler : function (inject){
							inject.instances.onBeforeApfStartupPromise.done(function(){
								assert.ok(true, "Promise onBeforeApfStartup resolved");
							});
						}
					}
			};
		}
	});
	QUnit.test("Without on BeforeStartupCallback", function (assert) {
		assert.expect(1);
		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject});
	});
	QUnit.test("With on BeforeStartupCallback", function (assert) {
		assert.expect(2);
		sap.apf.testhelper.createComponent(this, 
				{ stubAjaxForResourcePaths : true, doubleUiInstance : true,  path : "pathOfNoInterest",  inject : this.defaultInject, onBeforeStartApfCallback : function(){
					assert.ok(true, "OnBeforeStartApfCallback called");
				}
		});
	});
}());
