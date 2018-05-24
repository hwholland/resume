jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.utils.startParameter");
jQuery.sap.require("sap.apf.core.utils.fileExists");
(function() {
	'use strict';
	var MessageHandler = function() {
		this.setup = function() {
			if (this.check.restore) {
				this.check.restore();
			}
			if (this.putMessage.restore) {
				this.putMessage.restore();
			}
			if (this.createMessageObject.restore) {
				this.createMessageObject.restore();
			}
			sinon.stub(this, "check", function(booleExpr, sMessage) {
				if (!booleExpr) {
					throw new Error(sMessage);
				}
				return true;
			});
			sinon.stub(this, "putMessage", function(oMessage) {
				throw new Error(oMessage);
			});
			sinon.stub(this, "createMessageObject", function(oConfig) {
				return new sap.apf.core.MessageObject(oConfig);
			});
		};
	};
	MessageHandler.prototype = new sap.apf.testhelper.interfaces.IfMessageHandler();
	MessageHandler.prototype.constructor = MessageHandler;
	
	function commonSetup(oContext) {
		var oMessageHandler = new MessageHandler();
		oMessageHandler.setup();
		oMessageHandler.aaaDebug = "tResourcePathHandler";
		oContext.oMessageHandler = oMessageHandler;
		oContext.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
		oContext.coreApi.aaaDebug = "tResourcePathHandler";
		oContext.coreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		oContext.coreApi.getStartParameterFacade = function() {
			return new sap.apf.utils.StartParameter();
		};
		oContext.coreApi.loadMessageConfiguration = function() {
		};
		oContext.coreApi.ajax = function(context) {
			jQuery.ajax(context);
		};
		oContext.spyloadAnalyticalConfiguration = sinon.stub(oContext.coreApi, "loadAnalyticalConfiguration", function() {
			return null;
		});
		oContext.oInject = {
			instances: {
				messageHandler : oMessageHandler,
				coreApi : oContext.coreApi,
				fileExists : new sap.apf.core.utils.FileExists()
			}
		};
		oContext.resPathHandler = new sap.apf.core.ResourcePathHandler(oContext.oInject);
		//------------
		oContext.applConfigJSON = {
			"applicationConfiguration" : {
				"type" : "applicationConfiguration",
				"appName" : "appName",
				"appTitle" : "appTitle",
				"analyticalConfigurationLocation" : "analytical.json",
				"applicationMessageDefinitionLocation" : "ZZZ2.json",
				"textResourceLocations" : {
					"applicationMessageTextBundle" : "zzz.properties",
					"apfUiTextBundle" : "qqq.properties",
					"applicationUiTextBundle" : "uuu.properties"
				},
				"persistence" : {
					"path" : {
						"service" : "/sap/hba/apps/reuse/apf/s/logic/path.xsjs"
					},
					"logicalSystem" : {
						"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
					}
				},
				"smartBusiness" : {
					"evaluations" : {
						"type" : "smartBusinessRequest",
						"id" : "smartBusinessRequest",
						"service" : "hugo-non-existing",
						"entityType" : "Evaluations"
					}
				}
			}
		};
	}
	function commonTeardown(oContext) {
		oContext.spyloadAnalyticalConfiguration.restore();
	}
	QUnit.module('RPH - load and handle error in Ajax', {
		beforeEach : function(assert) {
			commonSetup(this);
		},
		afterEach : function(assert) {
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN coreApi.check() is stubbed WHEN check true THEN returns true", function(assert) {
		assert.ok(this.oInject.instances.messageHandler.check(true, "", 5));
	});
	QUnit.test("GIVEN coreApi.check() is stubbed WHEN check false THEN threw", function(assert) {
		assert.throws(function() {
			this.oInject.instances.messageHandler.check(false, "", 4711);
		});
		assert.ok(this.oMessageHandler.check.threw());
	});
	QUnit.test("GIVEN jQuery.ajax stubbed as error WHEN loadConfigFromFilePath() with invalid file name THEN putMessage() AND throws AND code===errorLoadingRessource", function(assert) {
		var ajaxSpy = sinon.stub(jQuery, "ajax", function(oParam1) {
			oParam1.error("", "", "###test provoked error in configuration");
		});
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("PathToNotExistingConfiguration.json");
		});
		var spy = this.oMessageHandler.putMessage;
		assert.ok(spy.called, "putMessage");
		assert.ok(spy.threw(), "putMessage");
		var msg0 = spy.getCall(0).args[0];
		assert.equal(msg0.getCode(), sap.apf.core.constants.message.code.errorLoadingRessource, "correct code");
		ajaxSpy.restore();
	});
	QUnit.module('RPH - load application configuration.json and check properties', {
		beforeEach : function(assert) {
			var that = this;
			commonSetup(this);
			this.ajaxSpy = sinon.stub(jQuery, "ajax", function(oParam1) {
				oParam1.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
			});
		},
		afterEach : function(assert) {
			this.ajaxSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called with file name THEN parser returns correct properties", function(assert) {
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageDefinitionLocation);
		var sExpectedPath = "ZZZ2.json";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationMessageDefinitionLocation ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);
		sExpectedPath = "zzz.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationMessageTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.apfUiTextBundle);
		sExpectedPath = "qqq.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of apfUiTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		sExpectedPath = "uuu.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationUiTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation);
		sExpectedPath = "analytical.json";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of analyticalConfigurationLocation ");
		assert.equal(this.ajaxSpy.callCount, 8, "# ajax calls");
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called twice THEN loads as called once", function(assert) {
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageDefinitionLocation);
		var sExpectedPath = "ZZZ2.json";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationMessageDefinitionLocation ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);
		sExpectedPath = "zzz.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationMessageTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.apfUiTextBundle);
		sExpectedPath = "qqq.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of apfUiTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		sExpectedPath = "uuu.properties";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of applicationUiTextBundle ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation);
		sExpectedPath = "analytical.json";
		assert.ok(sPath.indexOf(sExpectedPath) > -1, "expected path of analyticalConfigurationLocation ");
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called twice THEN file loaded only once", function(assert) {
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed.json");
		assert.equal(this.ajaxSpy.callCount, 8, "# ajax calls");
	});
	QUnit.module('RPH - load application configuration.json check defaults', {
		beforeEach : function(assert) {
			var that = this;
			commonSetup(this);
			this.ajaxSpy = sinon.stub(jQuery, "ajax", function(oParam1) {
				oParam1.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
			});
		},
		afterEach : function(assert) {
			this.ajaxSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json AND some config properties are missing WHEN loadConfigFromFilePath() is called THEN default value is set", function(assert) {
		this.applConfigJSON.applicationConfiguration.applicationMessageDefinitionLocation = undefined;
		this.applConfigJSON.applicationConfiguration.textResourceLocations.apfUiTextBundle = undefined;
		this.applConfigJSON.applicationConfiguration.textResourceLocations.applicationMessageTextBundle = undefined;
		this.applConfigJSON.applicationConfiguration.textResourceLocations.applicationUiTextBundle = undefined;
		this.resPathHandler.loadConfigFromFilePath("doesNotMatterSinceStubbed");
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.apfUiTextBundle);
		assert.ok(sPath.indexOf("resources/i18n/apfUi.properties") > -1, "expected default ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);
		assert.ok(sPath.length === 0, "expected default ");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageDefinitionLocation);
		assert.ok(sPath.length === 0, "expected default ");
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json AND analyticalConfigurationLocation is missing WHEN loadConfigFromFilePath() is called THEN default value is set", function(assert) {
		var that = this;
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = undefined;
		assert.throws(function() {
			that.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		});
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation);
		assert.ok(sPath.length === 0, "expected default ");
	});
	QUnit.module('RPH - load persistence in configuration.json', {
		beforeEach : function(assert) {
			var thisSetup = this;
			commonSetup(this);
			this.ajaxSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				requestSpec.success.bind(thisSetup.resPathHandler, thisSetup.applConfigJSON, "", "")();
			});
		},
		afterEach : function(assert) {
			this.ajaxSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called with file name THEN parser returns persistence config", function(assert) {
		var oPersistenceConfigurationExpected = jQuery.extend(true, {}, this.applConfigJSON.applicationConfiguration.persistence);
		oPersistenceConfigurationExpected.path.entitySet = sap.apf.core.constants.entitySets.analysisPath;
		this.resPathHandler.loadConfigFromFilePath("hugo.json"); //CUT
		var oPersistenceConfiguration = this.resPathHandler.getPersistenceConfiguration(); //CUT
		assert.deepEqual(oPersistenceConfiguration, oPersistenceConfigurationExpected, "Persistence Configuration with default entity set for path");
	});
	QUnit.test("GIVEN jQuery.ajax stubbed such that it returns a json WHEN loadConfigFromFilePath() is called with file name THEN parser returns persistence config", function(assert) {
		this.applConfigJSON.applicationConfiguration.persistence.path.entitySet = "PathEntitySetFromConfig";
		var oPersistenceConfigurationExpected = jQuery.extend(true, {}, this.applConfigJSON.applicationConfiguration.persistence);
		this.resPathHandler.loadConfigFromFilePath("hugo.json"); //CUT
		var oPersistenceConfiguration = this.resPathHandler.getPersistenceConfiguration(); //CUT 
		assert.deepEqual(oPersistenceConfiguration, oPersistenceConfigurationExpected, "Persistence Configuration with entity set for path from application configuration");
	});
	QUnit.module('RPH - load application configuration json', {
		beforeEach : function(assert) {
			var that = this;
			commonSetup(this);
			function successStub(requestSpec, httpCode) { // avoid code copies
				requestSpec.success.bind(that.resPathHandler, {
					response : "hugo"
				}, httpCode, null)();
			}
			this.ajaxLoadApplConfigSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				if (requestSpec.url.search("hugo.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				} else {
					successStub(requestSpec, 200);
				}
			});
		},
		afterEach : function(assert) {
			this.ajaxLoadApplConfigSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN ajax stub and stubbed config json WHEN loading the analytical config file THEN no putMessage AND no check is called AND loadAnalyticalConfiguration called", function(assert) {
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(this.spyloadAnalyticalConfiguration.calledOnce, "called loadAnalyticalConfiguration");
		assert.ok(!this.spyloadAnalyticalConfiguration.threw(), "!throws loadAnalyticalConfiguration");
		assert.ok(!this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
	});
	QUnit.module('RPH - load analytical json', {
		beforeEach : function(assert) {
			var that = this;
			commonSetup(this);
			function successStub(requestSpec, httpCode) { // avoid code copies
				requestSpec.success.bind(that.resPathHandler, {
					response : "hugo"
				}, httpCode, null)();
			}
			this.ajaxLoadApplConfigSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				if (requestSpec.url.search("hugo.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				} else if (requestSpec.url.search("hugo222.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				} else if (requestSpec.url.search("hugo333.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				} else if (requestSpec.url.search("analytical.json") >= 0) {
					requestSpec.error.bind(that.resPathHandler, {
						response : "error"
					}, 404, "error")();
				} else if (requestSpec.url.search("analyticalWithName.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, {
						applicationTitle : {
							key : "TextGUID"
						}
					}, 200, "http:200")();
				} else if (requestSpec.url.search("doesExistButNullResponse.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, null, 200, "http:200")();
				} else if (requestSpec.url.search("doesExistButEmptyResponse.json") >= 0) { // analytical
					requestSpec.success.bind(that.resPathHandler, {}, 200, "http:200")();
				} else {
					successStub(requestSpec, 404);
				}
			});
			this.applConfigJSON = {
				"applicationConfiguration" : {
					"analyticalConfigurationLocation" : "analytical.json",
					"textResourceLocations" : {},
					"persistence" : {
						"path" : {
							"service" : "/sap/hba/apps/reuse/apf/s/logic/path.xsjs"
						},
						"logicalSystem" : {
							"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
						}
					},
					"smartBusiness" : {
						"evaluations" : {
							"type" : "smartBusinessRequest",
							"id" : "smartBusinessRequest",
							"service" : "hugo-non-existing",
							"entityType" : "Evaluations"
						}
					}
				}
			};
		},
		afterEach : function(assert) {
			this.ajaxLoadApplConfigSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("Get application title text key from config file", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = 'analyticalWithName.json';
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		var configProperties = this.resPathHandler.getConfigurationProperties();
		assert.equal(configProperties.appName, "TextGUID", "Correct text key from file retrieved");
		assert.equal(configProperties.appTitle, "TextGUID", "Correct text key from file retrieved");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN analytical config file not exists (analytical.json) THEN putMessage is called with a specific code", function(assert) {
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("hugo.json");
		});
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(!this.spyloadAnalyticalConfiguration.calledOnce, "! called loadAnalyticalConfiguration");
		assert.ok(!this.spyloadAnalyticalConfiguration.threw(), "! throws loadAnalyticalConfiguration");
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.ok(call0.args[0].getCode() === sap.apf.core.constants.message.code.wrongRessourcePath, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing applicationConfiguration THEN putMessage is called with errorStartUp", function(assert) {
		this.applConfigJSON.applicationConfiguration = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo.json");
		});
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(!this.spyloadAnalyticalConfiguration.calledOnce, "! called loadAnalyticalConfiguration");
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.ok(call0.args[0].getCode() === sap.apf.core.constants.message.code.errorStartUp, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing textResourceLocations THEN putMessage is called with errorStartUp", function(assert) {
		this.applConfigJSON.applicationConfiguration.textResourceLocations = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo.json");
		});
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(!this.spyloadAnalyticalConfiguration.calledOnce, "! called loadAnalyticalConfiguration");
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.ok(call0.args[0].getCode() === sap.apf.core.constants.message.code.errorStartUp, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and files WHEN request to analytical file has no response THEN putMessage is called with errorLoadingAnalyticalConfig", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButNullResponse.json";
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo222.json");
		});
		assert.ok(this.ajaxLoadApplConfigSpy.called, "ajax called");
		assert.ok(!this.spyloadAnalyticalConfiguration.called, "NOT called loadAnalyticalConfiguration");
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(!this.oMessageHandler.check.threw());
		var call0 = this.oMessageHandler.putMessage.getCall(0);
		assert.ok(call0.args[0].getCode() === sap.apf.core.constants.message.code.errorLoadingAnalyticalConfig, "Correct message code thrown, code==" + call0.args[0].getCode());
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing persistence THEN putMessage is called with errorInAnalyticalConfig", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButEmptyResponse.json";
		this.applConfigJSON.applicationConfiguration.persistence = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		});
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(this.oMessageHandler.putMessage.getCall(0).args[0].getCode() === sap.apf.core.constants.message.code.errorInAnalyticalConfig, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing persistence path THEN putMessage is called with errorInAnalyticalConfig", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButEmptyResponse.json";
		this.applConfigJSON.applicationConfiguration.persistence.path = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		});
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(this.oMessageHandler.putMessage.getCall(0).args[0].getCode() === sap.apf.core.constants.message.code.errorInAnalyticalConfig, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing persistence service THEN putMessage is called with errorInAnalyticalConfig", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButEmptyResponse.json";
		this.applConfigJSON.applicationConfiguration.persistence.path.service = undefined;
		assert.throws(function() {
			this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		});
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(this.oMessageHandler.putMessage.getCall(0).args[0].getCode() === sap.apf.core.constants.message.code.errorInAnalyticalConfig, "Correct message code thrown");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has logical system service 'null' THEN no putMessage is called with errorInAnalyticalConfig", function(assert) {
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = "doesExistButEmptyResponse.json";
		this.applConfigJSON.applicationConfiguration.persistence.logicalSystem.service = null;
		this.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		assert.ok(!this.oMessageHandler.putMessage.threw(), "No putMessage called");
	});
	QUnit.test("GIVEN ajax stub and applConfig.json WHEN appl config has missing persistence service THEN putMessage is called with missingAnalyticalConfig", function(assert) {
		var that = this;
		this.applConfigJSON.applicationConfiguration.analyticalConfigurationLocation = undefined;
		assert.throws(function() {
			that.resPathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/hugo333.json");
		});
		assert.ok(this.oMessageHandler.putMessage.threw());
		assert.ok(this.oMessageHandler.putMessage.getCall(0).args[0].getCode() === sap.apf.core.constants.message.code.missingAnalyticalConfig, "Correct message code thrown");
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation);
		assert.ok(sPath.length === 0, "expected default ");
	});
	QUnit.module('RPH - load SmartBusiness service root by appl configuration file', {
		beforeEach : function(assert) {
			var thisSetup = this;
			commonSetup(this);
			this.ajaxSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				requestSpec.success.bind(thisSetup.resPathHandler, thisSetup.applConfigJSON, "", "")();
			});
		},
		afterEach : function(assert) {
			this.ajaxSpy.restore();
			commonTeardown(this);
		}
	});
	QUnit.test("GIVEN jQuery.ajax stubbed returning a json WHEN loadConfigFromFilePath() THEN parser returns Smart Business config input", function(assert) {
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		var oConfigurationProperties = this.resPathHandler.getConfigurationProperties();
		assert.ok(this.applConfigJSON.applicationConfiguration.smartBusiness, "Smart Business configuration is available");
		var oSmartBusinessConfigurationExpected = this.applConfigJSON.applicationConfiguration.smartBusiness;
		assert.deepEqual(oConfigurationProperties.smartBusiness, oSmartBusinessConfigurationExpected, "Smart Business Configuration as expected");
	});
	QUnit.module('RPH - Load analytical configuration by mocked service ', {
		beforeEach : function(assert) {
			var that = this;
			sap.apf.testhelper.mockServer.activateModeler();
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.coreApi.getXsrfToken = function() {
				return 'otto';
			};
			this.coreApi.getStartParameterFacade = function() {
				return new sap.apf.utils.StartParameter();
			};
			this.coreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.coreApi.loadMessageConfiguration = function() {
			};
			this.coreApi.ajax = function(context) {
				jQuery.ajax(context);
			};
			this.coreApi.getEntityTypeMetadata = function() {
				return {
					getPropertyMetadata : function() {
						return {};
					}
				};
			};
			this.coreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.coreApi.loadAnalyticalConfiguration = function(object) {
				that.loadedAnalyticalConfiguration = object;
			};
			this.coreApi.loadTextElements = function(textElements) {
				that.loadedTextElements = textElements;
			};
			this.oInject = {
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.coreApi
				}
			};
			this.resPathHandler = new sap.apf.core.ResourcePathHandler(this.oInject);
			this.ajaxLoadApplConfigSpy = sinon.stub(jQuery, "ajax", function(requestSpec) {
				if (requestSpec.url.search("hugo.json") >= 0) {
					requestSpec.success.bind(that.resPathHandler, that.applConfigJSON, "", "")();
				}
			});
			this.applConfigJSON = {
				"applicationConfiguration" : {
					"appName" : "key-from-appConfig-to-local-text-source",
					"appTitle" : "key-from-appConfig-to-local-text-source",
					"textResourceLocations" : {},
					"persistence" : {
						"path" : {
							"service" : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata"
						},
						"logicalSystem" : {
							"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
						}
					}
				}
			};
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
			this.ajaxLoadApplConfigSpy.restore();
		}
	});
	QUnit.test("GIVEN URL paramter containing configuration ID WHEN loadAnalyticalConfiguration THEN mocked service is called", function(assert) {
		this.coreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { configurationId : "ID_7891" };
				},
				getSapClient : function() {
					return undefined;
				},
				isLrepActive : function() {
					return false;
				}
			};
		};
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		var expectedConfig = {
			applicationTitle : {
				key : "TextKeyForConfigurationName"
			},
			categories : [ {
				type : 'category',
				id : 'category1',
				label : 'dummyLabel',
				steps : []
			} ]
		};
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		assert.deepEqual(this.loadedAnalyticalConfiguration, expectedConfig, "Correct configuration loaded from service");
		assert.equal(this.loadedTextElements[0].TextElement, "ID_1", "Ressourcepath Handler called coreApi to load the texts");
	});
	QUnit.test("GIVEN URL paramter containing invalid configuration ID WHEN loadAnalyticalConfiguration THEN throw fatal error", function(assert) {
		this.coreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { configurationId : "invalidId" };
				},
				isLrepActive : function() {
					return false;
				}
			};
		};
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		assert.equal(this.oMessageHandler.spyResults.putMessage[1].code, "5022", "Correct Message Code");
	});
	QUnit.test("Get application name text key from service", function(assert) {
		this.coreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { configurationId : "ID_7891" };
				},
				isLrepActive : function() {
					return false;
				}
			};
		};
		this.resPathHandler.loadConfigFromFilePath("hugo.json");
		var configProperties = this.resPathHandler.getConfigurationProperties();
		assert.equal(configProperties.appName, "TextKeyForConfigurationName", "Correct text key from service retrieved");
		assert.equal(configProperties.appTitle, "TextKeyForConfigurationName", "Correct text key from service retrieved");
	});
	QUnit.module("Load application config without application message definition, application message texts, logical system ", {
		beforeEach : function(assert) {
			var that = this;
			this.originalAjax = jQuery.ajax;
			sap.apf.testhelper.adjustResourcePaths(this.originalAjax);
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.coreApi.getXsrfToken = function() {
				return 'otto';
			};
			this.coreApi.getStartParameterFacade = function() {
				return new sap.apf.utils.StartParameter();
			};
			this.coreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.coreApi.loadMessageConfiguration = function(conf, bResetRegistry) {
				if (bResetRegistry) {
					that.loadedApfMessageConfiguration = conf;
				} else {
					that.loadedApplicationMessageConfiguration = conf;
				}
			};
			this.coreApi.getEntityTypeMetadata = function() {
				return {
					getPropertyMetadata : function() {
						return {};
					}
				};
			};
			this.coreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.coreApi.loadAnalyticalConfiguration = function(object) {
				that.loadedAnalyticalConfiguration = object;
			};
			this.coreApi.loadTextElements = function(textElements) {
				that.loadedTextElements = textElements;
			};
			this.coreApi.ajax = function(context) {
				jQuery.ajax(context);
			};
			this.oInject = {
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.coreApi,
					fileExists : new sap.apf.core.utils.FileExists()
				}
			};
			this.resPathHandler = new sap.apf.core.ResourcePathHandler(this.oInject);
		},
		afterEach : function(assert) {
			jQuery.ajax = this.originalAjax;
		}
	});
	QUnit.test("WHEN loadApplicationConfig is called", function(assert) {
		this.resPathHandler.loadConfigFromFilePath("/apf-test/test-resources/sap/apf/testhelper/config/minimalApplicationConfiguration.json");
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle);
		assert.equal(sPath, "", "THEN empty path for application Messages is still set");
		sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		assert.ok(sPath.search("/sap/apf/resources/i18n/test_texts.properties") > -1, "THEN correct path for application UI texts is set");
		assert.equal(this.loadedAnalyticalConfiguration.steps.length, 6, "THEN analytical configuration with 6 steps has been loaded");
		assert.equal(this.loadedAnalyticalConfiguration.steps[0].id, "stepTemplate1", "THEN the first step has expected id");
		assert.equal(this.loadedApplicationMessageConfiguration, undefined, "THEN application message configuration has not been loaded");
		assert.equal(this.loadedApfMessageConfiguration.length > 50, true, "THEN the apf message configuration has been loaded");
	});
	QUnit.module("Load application configuration directly", {
		beforeEach : function(assert) {
			var that = this;
			this.fileExists = new sap.apf.core.utils.FileExists();
			this.originalAjax = jQuery.ajax;
			sap.apf.testhelper.adjustResourcePaths(this.originalAjax);
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.coreApi.getXsrfToken = function() {
				return 'otto';
			};
			this.coreApi.getStartParameterFacade = function() {
				return new sap.apf.utils.StartParameter();
			};
			this.coreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.coreApi.loadMessageConfiguration = function(conf, bResetRegistry) {
				if (bResetRegistry) {
					that.loadedApfMessageConfiguration = conf;
				} else {
					that.loadedApplicationMessageConfiguration = conf;
				}
			};
			this.coreApi.registerTextWithKey = function(key, text) {
				that.registeredText = { key : key, text : text };
			};
			this.coreApi.ajax = function(context) {
				jQuery.ajax(context);
			};
			this.coreApi.getEntityTypeMetadata = function() {
				return {
					getPropertyMetadata : function() {
						return {};
					}
				};
			};
			this.coreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.coreApi.loadAnalyticalConfiguration = function(object) {
				that.loadedAnalyticalConfiguration = object;
			};
			this.coreApi.loadTextElements = function(textElements) {
				that.loadedTextElements = textElements;
			};
		},
		afterEach : function(assert) {
			jQuery.ajax = this.originalAjax;
		},
		loadManifestAndResourcePathHandler : function(bWithOutApfSection) {
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

			if (bWithOutApfSection) {
				manifest["sap.apf"] = undefined;
			}
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

			this.oInject = {
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.coreApi,
					fileExists : new sap.apf.core.utils.FileExists()
				},
				manifests : {
					manifest : manifest,
					baseManifest : baseManifest
				}
			};
			this.resPathHandler = new sap.apf.core.ResourcePathHandler(this.oInject);
		}
	});
	QUnit.test("WHEN loadAnalyticalConfigurationAndRessources is called", function(assert) {
		this.loadManifestAndResourcePathHandler();
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		assert.ok(this.fileExists.check(sPath), "THEN correct path for application UI texts is set");
		assert.equal(this.loadedAnalyticalConfiguration.steps.length, 6, "THEN analytical configuration with 6 steps has been loaded");
		assert.equal(this.loadedAnalyticalConfiguration.steps[0].id, "stepTemplate1", "THEN the first step has expected id");
		assert.equal(this.resPathHandler.getConfigurationProperties().defaultExchangeRateType, "M", "THEN the correct additional parameter is returned");
		assert.equal(this.resPathHandler.getConfigurationProperties().appName, this.registeredText.key, "THEN app title was registered properly");
		var expectedPersistenceConfiguration = {
			logicalSystem : {
				service : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
			},
			path : {
				service : "/sap/opu/odata/sap/BSANLY_APF_RUNTIME_SRV",
				entitySet : 'AnalysisPathQueryResults'
			}
		};
		assert.deepEqual(this.resPathHandler.getPersistenceConfiguration(), expectedPersistenceConfiguration, "THEN the persistence configuration is set");
	});
	QUnit.test("WHEN manifest without apf section is loaded", function(assert) {
		this.loadManifestAndResourcePathHandler(true);
		var sPath = this.resPathHandler.getResourceLocation(sap.apf.core.constants.resourceLocation.applicationUiTextBundle);
		assert.ok(this.fileExists.check(sPath), "THEN correct path for application UI texts is set");
		assert.ok(true, "No exception occurred");
	});
}());
