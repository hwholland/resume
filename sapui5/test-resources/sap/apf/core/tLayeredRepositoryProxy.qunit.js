/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery*/
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.utils.startParameter');
jQuery.sap.require('sap.apf.core.layeredRepositoryProxy');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');

(function() {
	'use strict';
	function getApplicationTemplate (applicationGuid, applicationName) {
		return {
			"layer": "CUSTOMER",
			"ns": "sap/apf/dt/" + applicationGuid + "/",
			"name": "metadata",
			"fileType": "apfapplication",
			"category": "FILE",
			"metadata": [{
				"name": "createdAt",
				"value": "2015-09-10T11:53:22.9152410Z",
				"category": "system",
				"datatype": "iso8601"
			}, {
				"name": "apfdt-applname",
				"value": applicationName,
				"category": "custom"
			}]};
	}
	function  getConfigurationTemplate(applicationGuid, configurationGuid, configurationName) {
		return {
			"layer": "CUSTOMER",
			"ns": "sap/apf/dt/" + applicationGuid + "/",
			"name": configurationGuid,
			"fileType": "apfconfiguration",
			"category": "FILE",
			"metadata": [{
				"name": "createdAt",
				"value": "2015-09-02T09:06:26.0147340Z",
				"category": "system",
				"datatype": "iso8601"
			}, {
				"name": "apfdt-configname",
				"value": configurationName,
				"category": "custom"
			}]
		};
	}
	function createProxy(messageHandler, Connector) {
		var coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
		coreApi.getStartParameterFacade = function() {
			var startParameterFacade = new sap.apf.utils.StartParameter();
			startParameterFacade.isLrepActive = function() {
				return true;
			};
			startParameterFacade.getSapClient = function() {
				return 120;
			};
			return startParameterFacade;
		};
		var inject = {
			instances : {
				messageHandler : messageHandler,
				coreApi : coreApi
			},
			constructors : {
				LrepConnector : Connector
			}
		};
		return new sap.apf.core.LayeredRepositoryProxy({}, inject);
	}
	QUnit.module("Create application and texts", {
		beforeEach : function(assert) {
			var that = this;
			that.numberOfCallsForUpsert = 0;
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			var Connector = function() {
				this.upsert = function(namespace, filename, type, layer, content, fileType) {
					if (that.numberOfCallsForUpsert === 0) {
						content = JSON.parse(content);
						that.numberOfCallsForUpsert++;
						assert.ok(content.ApplicationName, "Metadata has property ApplicationName");
						assert.ok(content.Application, "Metadata has property Application (guid)");
						assert.ok(content.SemanticObject, "Metadata has property SemanticObject");
						assert.equal(filename, "metadata", "The correct name is supplied for creating application metadata file");
						assert.equal(type, "apfapplication", "The correct type is supplied for creating application metadata file");
						assert.equal(layer, "CUSTOMER", "The correct layer is supplied for creating application metadata file");
					} else if (that.numberOfCallsForUpsert === 1) {
						that.numberOfCallsForUpsert++;
						assert.ok(content.search("__ldi.translation.uuid") > -1,  "Text properties content is created with correct format");
						assert.equal(filename, "text", "The correct name is supplied for creating text properties file");
						assert.equal(type, "properties", "THEN the correct type is supplied for creating text properties file");
						assert.equal(layer, "CUSTOMER", "THEN the correct layer is supplied for creating text properties file");
					} else if (that.numberOfCallsForUpsert === 2) {
						content = JSON.parse(content);
						assert.ok(content.ApplicationName, "Metadata has property ApplicationName");
						assert.ok(content.Application, "Metadata has property Application (guid)");
						assert.ok(content.SemanticObject, "Metadata has property SemanticObject");
						assert.equal(namespace, 'sap/apf/dt/' + that.Application, "The correct namespace is supplied for updating metadata");
						assert.equal(filename, 'metadata', 'The correct name is supplied for updating metadata');
						assert.equal(type, 'apfapplication', 'The correct type is supplied for updating metadata');
					} else if (that.numberOfCallsForUpsert === 3) {
						that.numberOfCallsForUpsert++;
						var texts = content.texts;
						assert.ok(texts, "Texts has correct name");
						assert.ok(sap.apf.utils.isValidGuid(texts[0].TextElement), "Text has a text element");
						assert.ok(texts[0].Language, "Text has a language");
						assert.ok(texts[0].TextElementType, "Text has a type");
						assert.ok(texts[0].MaximumLength, "Text has a maximum length");
						assert.ok(texts[0].Application, "Text has an application");
						assert.ok(texts[0].TranslationHint, "Text has a translation hint");
						assert.equal(filename, "text", "The correct name is supplied for creating text properties file");
						assert.equal(type, "properties", "THEN the correct type is supplied for creating text properties file");
						assert.equal(layer, "CUSTOMER", "THEN the correct layer is supplied for creating text properties file");
					}
					var deferred = jQuery.Deferred();
					deferred.resolve({});
					return deferred.promise();
				};
				this.send = function(url, method, data, options) {
					assert.strictEqual(data, undefined, "No data provided");
					assert.equal(method, "GET", "Text property file is read");
					assert.equal(options.contentType, "text/plain", "Text property file is read with correct content type");
					assert.ok(url.search("text.properties") > -1, "Correct property file name");
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : ""
					});
					return deferred.promise();
				};
			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test("Create Application, create Texts and update application", function(assert) {
		var that = this;
		var appObject = {
			ApplicationName : "marvel",
			SemanticObject : "FioriApplication"
		};
		that.calledFirstTime = true;
		function callbackFromUpdateApplication(metadata, messageObject) {
			assert.equal(messageObject, undefined, "No error appeared when updating application");
		}
		function callbackFromCreateText1(text, metadata, messageObject) {
			assert.ok(sap.apf.utils.isValidPseudoGuid(text.TextElement), "The text element guid was returned and is valid");
			assert.equal(text.Application, that.Application, "Application Guid is filled correctly");
			that.TextElementGuid = text.TextElement;
			appObject.Application = text.Application;
			that.proxy.update("application", appObject, callbackFromUpdateApplication, [ {
				name : "Application",
				value : text.Application
			} ]);
		}
		function callbackFromCreateApplication(applicationData, metadata, messageObject) {
			var text1 = {
				TextElementDescription : "TextDescription1",
				Language : sap.apf.core.constants.developmentLanguage,
				TextElementType : "XFLD",
				MaximumLength : 10,
				Application : applicationData.Application,
				TranslationHint : "TranslateIt"
			};
			that.Application = applicationData.Application;
			assert.ok(sap.apf.utils.isValidPseudoGuid(applicationData.Application), "The application guid was returned and is valid");
			assert.equal(applicationData.ApplicationName, "marvel", "The application was named correctly");
			assert.equal(applicationData.SemanticObject, "FioriApplication", "The application has the correct semantic object");
			assert.equal(messageObject, undefined, "There was no error during application creation");
			assert.equal(that.numberOfCallsForUpsert, 2, "Connector.upsert was called twice times - metadata and texts");
			that.proxy.create('texts', text1, callbackFromCreateText1, false);
		}
		this.proxy.create("application", appObject, callbackFromCreateApplication);
	});
	QUnit.test("Create Application With Guid (creating application from imported configuration)", function(assert) {
		var that = this;
		var appObject = {
			Application : "12345678912234567890123456789012",
			ApplicationName : "marvel",
			SemanticObject : "FioriApplication"
		};
		that.calledFirstTime = true;
		function callbackFromCreateText1(text, metadata, messageObject) {
			assert.equal(text.TextElement, "123456798012345678901234567890AB", "The text was created with the correct guid");
			assert.equal(text.Application, that.Application, "Application Guid is filled correctly");
		}
		function callbackFromCreateApplication(applicationData, metadata, messageObject) {
			var text1 = {
				TextElement : "123456798012345678901234567890AB",
				TextElementDescription : "TextDescription1",
				Language : sap.apf.core.constants.developmentLanguage,
				TextElementType : "XFLD",
				MaximumLength : 10,
				Application : applicationData.Application,
				TranslationHint : "TranslateIt"
			};
			that.Application = applicationData.Application;
			assert.equal(applicationData.Application, "12345678912234567890123456789012", "The application was created with the correct guid");
			assert.equal(applicationData.ApplicationName, "marvel", "The application was named correctly");
			assert.equal(applicationData.SemanticObject, "FioriApplication", "The application has the correct semantic object");
			assert.equal(messageObject, undefined, "There was no error during application creation");
			assert.equal(that.numberOfCallsForUpsert, 2, "Connector.upsert was called twice times - metadata and texts");
			that.proxy.create('texts', text1, callbackFromCreateText1, false);
		}
		this.proxy.create("application", appObject, callbackFromCreateApplication);
	});
	QUnit.module("Update application", {
		beforeEach : function(assert) {
			var that = this;
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			var Connector = function() {
				var callsToUpsert = 0;
				this.upsert = function(sNamespace, sName, sType, sLayer, sContent, sContentType, sChangelist) {
					callsToUpsert++;
					if (callsToUpsert === 1) {
						assert.equal(sNamespace, 'sap/apf/dt/' + that.config.Application, "The correct namespace is supplied for updating metadata");
						assert.equal(sName, 'metadata', 'The correct name is supplied for updating metadata');
						assert.equal(sType, 'apfapplication', 'The correct type is supplied for updating metadata');
					}
					var deferred = jQuery.Deferred();
					deferred.resolve({});
					return deferred.promise();
				};
			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test("Update analytical application", function(assert) {
		this.Application = sap.apf.utils.createPseudoGuid(32);
		assert.expect(4);
		this.config = {
			Application : this.Application,
			ApplicationName : "an application",
			SemanticObject : ""
		};
		function callbackFromUpdateApplication(metadata, messageObject) {
			assert.equal(messageObject, undefined, "No error appeared when updating application");
		}
		this.proxy.update("application", this.config, callbackFromUpdateApplication, [ {
			name : "Application",
			value : this.config.Application
		} ]);
	});
	QUnit.module("Read collection of applications", {
		beforeEach : function(assert) {
			var that = this;
			var appGuid1 = sap.apf.utils.createPseudoGuid();
			var appGuid2 = sap.apf.utils.createPseudoGuid();
			that.applicationListResponse = [ getApplicationTemplate(appGuid1, "k1"), getApplicationTemplate(appGuid2, "k2")];
			that.application = sap.apf.utils.createPseudoGuid();
			that.configuration = sap.apf.utils.createPseudoGuid();
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			that.messageHandler = messageHandler;
			var Connector = function() {
				this._buildParams = function(options) {
					var expectedOptions = [ {name: "layer", value: "CUSTOMER"},
					                        {name: "deep-read", value: true}, 
					                        {name: "metadata",value: true}];
					assert.deepEqual(options, expectedOptions, "THEN options for deep read are set");
					return "";
				};
				this.send = function(url, method, data, options) {

					var deferred = jQuery.Deferred();
					var applications = that.applicationListResponse;
					deferred.resolve({
						response : applications
					});
					assert.strictEqual(data, undefined, "No data provided");
					return deferred.promise();
				};
			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test("Read Collection of Applications", function(assert) {
		function callbackFromReadCollection(data, metadata, messageObject) {
			assert.equal(messageObject, undefined, "No error during read collection");
			assert.equal(data.length, 2, "data exists for two configurations");
		}
		this.proxy.readCollection('application', callbackFromReadCollection);
	});
	QUnit.test("Read Collection of Applications when no application exists", function(assert) {
		this.applicationListResponse = [];
		function callbackFromReadCollection(data, metadata, messageObject) {
			assert.equal(messageObject, undefined, "No error during read collection");
			assert.equal(data.length, 0, "Empty application array returned");
		}
		this.proxy.readCollection('application', callbackFromReadCollection);
	});
	QUnit.test("Read Collection in Batch", function(assert) {
		var that = this;
		var readCollectionStub = sinon.stub(that.proxy, "readCollection");
		readCollectionStub.callsArg(1, "data");
		function callback(result, messageObject) {
			assert.ok(readCollectionStub.calledWith('application'), "Collection of applications was read");
			assert.ok(readCollectionStub.calledWith('configuration'), "Collection of configurations was read");
			assert.ok(readCollectionStub.calledWith('texts'), "Collection of texts was read");
			assert.ok(readCollectionStub.calledThrice, "read collection called for every request in list of requests");
			that.proxy.readCollection.restore();
		}
		var filterApplication = new sap.apf.core.utils.Filter(this.messageHandler, 'Application', 'eq', this.application);
		var filterLanguage = new sap.apf.core.utils.Filter(this.messageHandler, 'Language', 'eq', sap.apf.core.constants.developmentLanguage);
		filterLanguage.addAnd(filterApplication);
		var applicationRequest = {
			entitySetName : 'application'
		};
		var configurationRequest = {
			entitySetName : 'configuration',
			inputParameters : [ {
				value : "configuration"
			} ],
			selectList : [ "Application" ],
			filter : filterLanguage
		};
		var textRequest = {
			entitySetName : 'texts',
			inputParameters : [ {
				value : "texts"
			} ],
			selectList : [ "Application" ],
			filter : filterLanguage
		};
		var requestConfigurations = [ applicationRequest, configurationRequest, textRequest ];
		this.proxy.readCollectionsInBatch(requestConfigurations, callback, true);
	});
	QUnit.module("Create configuration", {
		beforeEach : function(assert) {
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			var Connector = function() {
				var callsToUpsert = 0;
				var metadataRead = new sap.apf.utils.Hashtable(messageHandler);
				this.upsert = function(namespace, filename, type, layer, content, fileType) {
					callsToUpsert++;
					if (callsToUpsert === 1) {
						assert.equal(type, "apfconfiguration", "The right type is supplied for creating a configuration");
						assert.equal(layer, "CUSTOMER", "The correct layer is supplied for creating a configuration");
						assert.equal(fileType, "application/json", "The correct file type is supplied");
						content = JSON.parse(content);
						assert.ok(content.analyticalConfigurationName, "Configuration has a name");
						assert.ok(content.configHeader, "Configuration has a header");
						assert.ok(sap.apf.utils.isValidGuid(content.configHeader.Application), "Configuration has application in header");
						assert.ok(content.configHeader.ApplicationName, "Configuration has a header with application name");
						assert.ok(content.configHeader.SemanticObject, "Configuration has a header with semantic object");
						assert.ok(content.configHeader.AnalyticalConfigurationName, "Configuration has a header with AnalyticalConfigurationName");
						assert.ok(sap.apf.utils.isValidGuid(content.configHeader.AnalyticalConfiguration), "Configuration has guid in header");
						assert.ok(content.steps, "Configuration has configuration properties");
					} else if (callsToUpsert === 2) {
						assert.equal(type, "properties", "The right type is supplied for creating a text file");
						assert.equal(layer, "CUSTOMER", "The correct layer is supplied for creating a text file");
						var texts = content.texts;
						assert.ok(texts, "Texts has correct name");
					}
					var deferred = jQuery.Deferred();
					deferred.resolve({});
					return deferred.promise();
				};
				this.getStaticResource = function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : {
							ApplicationName : "App",
							SemanticObject : "SemanticObject"
						}
					});
					return deferred.promise();
				};
				this.getFileAttributes = function(sNamespace, sName, sType, sLayer) {
					var alreadyRead = metadataRead.getItem(sName);
					assert.ok(!alreadyRead, "metadata is not read multiple times for the same file");
					metadataRead.setItem(sName, true);
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : {
							ApplicationName : "App",
							SemanticObject : "SemanticObject"
						}
					});
					return deferred.promise();
				};
			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test("Create Configuration", function(assert) {
		function callbackFromCreateConfiguration(configurationData, metadata, messageObject) {
			assert.ok(sap.apf.utils.isValidPseudoGuid(configurationData.AnalyticalConfiguration), "THEN the Analytical Configuration Guid is returned");
			assert.equal(messageObject, undefined, "THEN no error appeared");
		}
		var analyticalConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		var config = {
			AnalyticalConfigurationName : "configForTesting",
			Application : sap.apf.utils.createPseudoGuid(32),
			SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration)
		};
		this.proxy.create("configuration", config, callbackFromCreateConfiguration);
	});
	QUnit.test("Create Configuration With Guid (imported configuration)", function(assert) {
		var analyticalConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		var config = {
			AnalyticalConfigurationName : "configForTesting",
			Application : sap.apf.utils.createPseudoGuid(32),
			AnalyticalConfiguration : sap.apf.utils.createPseudoGuid(32),
			SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration)
		};
		function callbackFromCreateConfiguration(configurationData, metadata, messageObject) {
			assert.equal(config.AnalyticalConfiguration, configurationData.AnalyticalConfiguration, "THEN the correct Analytical Configuration Guid is returned");
			assert.equal(messageObject, undefined, "THEN no error appeared");
		}
		this.proxy.create("configuration", config, callbackFromCreateConfiguration);
	});
	QUnit.module("Update and delete configuration", {
		beforeEach : function(assert) {
			var that = this;
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.Application = sap.apf.utils.createPseudoGuid();
			this.AnalyticalConfiguration = sap.apf.utils.createPseudoGuid();
			var Connector = function() {
				var callsToUpsert = 0;
				this.upsert = function(sNamespace, sName, sType, sLayer, sContent, sContentType, sChangelist) {
					callsToUpsert++;
					if (callsToUpsert === 1) {
						assert.equal(sNamespace, 'sap/apf/dt/' + that.Application, "The correct namespace is supplied for updating configuration");
						assert.equal(sName, that.AnalyticalConfiguration, 'The correct name is supplied for updating configuration');
						assert.equal(sType, 'apfconfiguration', 'The correct type is supplied for updating configuration');
					} else if (callsToUpsert === 2) {
						assert.equal(sNamespace, 'sap/apf/dt/' + that.Application, "The correct namespace is supplied for updating text properties");
						assert.equal(sName, 'text', 'The correct name is supplied for updating text properties');
						assert.equal(sType, 'properties', 'The correct type is supplied for updating text properties');
					}
					var deferred = jQuery.Deferred();
					deferred.resolve({});
					return deferred.promise();
				};
				this.deleteFile = function(sNamespace, sName, sType, sLayer, sChangelist) {
					assert.equal(sNamespace, 'sap/apf/dt/' + that.Application, "The correct namespace is supplied for removing configuration");
					assert.equal(sName, that.AnalyticalConfiguration, 'The correct name is supplied for removing configuration');
					assert.equal(sType, 'apfconfiguration', 'The correct type is supplied for removing configuration');
					var deferred = jQuery.Deferred();
					deferred.resolve({});
					return deferred.promise();
				};
				this.getStaticResource = function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : {
							ApplicationName : "App",
							SemanticObject : "SemanticObject"
						}
					});
					return deferred.promise();
				};
				this.getFileAttributes = function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : {
							ApplicationName : "App",
							SemanticObject : "SemanticObject"
						}
					});
					return deferred.promise();
				};
			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test("Update configuration", function(assert) {
		assert.expect(4);
		function callbackFromUpdateConfiguration(metadata, messageObject) {
			assert.equal(messageObject, undefined, "No error appeared when updating configuration");
		}
		var serializedConfig = JSON.stringify(sap.apf.testhelper.config.getSampleConfiguration());
		var analyticalConfiguration = this.AnalyticalConfiguration;
		var application = this.Application;
		var data = {
			Application : application,
			AnalyticalConfiguration : analyticalConfiguration,
			SerializedAnalyticalConfiguration : serializedConfig
		};
		this.proxy.update('configuration', data, callbackFromUpdateConfiguration, [ {
			name : "AnalyticalConfiguration",
			value : analyticalConfiguration
		} ]);
	});
	QUnit.test("Delete configuration", function(assert) {
		var analyticalConfiguration = this.AnalyticalConfiguration;
		var application = this.Application;
		var inputParameters = [ {
			name : "config for testing",
			value : analyticalConfiguration
		} ];
		function callbackFromRemoveConfiguration(metadata, messageObject) {
			assert.equal(messageObject, undefined, "No error while deleting configuration");
		}
		this.proxy.remove('configuration', inputParameters, callbackFromRemoveConfiguration, undefined, application);
	});
	QUnit.module("Read collection of configuration", {
		beforeEach : function(assert) {
			var that = this;
			that.application = sap.apf.utils.createPseudoGuid();
			that.configuration = sap.apf.utils.createPseudoGuid();
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.messageHandler = messageHandler;
			that.timesCalled = {
				getStaticResource : 0,
				getFileAttributes : 0
			};
			var Connector = function() {
				this.getStaticResource = function(sNamespace, sName, sType, bIsRuntime) {
					that.timesCalled.getStaticResource++;
					assert.equal(sNamespace, 'sap/apf/dt/' + that.application, "Configuration is read with correct namespace");
					assert.equal(sType, 'apfconfiguration', "Correct type is supplied for reading configuration");
					var serializedConfiguration = JSON.stringify(sap.apf.testhelper.config.getSampleConfiguration());
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : serializedConfiguration
					});
					return deferred.promise();
				};
				this.getFileAttributes = function(sNamespace, sName, sType, sLayer) {
					that.timesCalled.getFileAttributes++;
					assert.equal(sNamespace, 'sap/apf/dt/' + that.application, "Configuration metadata is read with correct namespace");
					assert.equal(sType, 'apfconfiguration', "Correct type is supplied for reading configuration metadata");
					var metadata = {
						ApplicationName : "App Name"
					};
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : metadata
					});
					return deferred.promise();
				};
				this.listContent = function(sNamespace, sLayer) {
					var deferred = jQuery.Deferred();
					var files = [ {
						name : "config1",
						fileType : 'apfconfiguration'
					}, {
						name : "config2",
						fileType : 'apfconfiguration'
					}, {
						name : "notAConfig",
						fileType : 'other'
					} ];
					deferred.resolve({
						response : files
					});
					return deferred.promise();
				};
			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test("Read Collection of Configurations", function(assert) {
		var that = this;
		function callbackFromReadCollection(data, metadata, messageObject) {
			assert.equal(that.timesCalled.getFileAttributes, 2, "Metadata read for two files");
			assert.equal(that.timesCalled.getStaticResource, 2, "Two files read");
			assert.equal(messageObject, undefined, "No error during read collection");
			assert.equal(data.length, 2, "data exists for two configurations");
		}
		var filterApplication = new sap.apf.core.utils.Filter(this.messageHandler, 'Application', 'eq', this.application);
		var filterLanguage = new sap.apf.core.utils.Filter(this.messageHandler, 'Language', 'eq', sap.apf.core.constants.developmentLanguage);
		filterLanguage.addAnd(filterApplication);
		this.proxy.readCollection('configuration', callbackFromReadCollection, undefined, undefined, filterLanguage);
	});

	QUnit.module("Read all configurations from vendor layer", {
		beforeEach : function(assert) {
			var that = this;
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.messageHandler = messageHandler;
			
			var Connector = function() {
				this._buildParams = function(options) {
					var expectedOptions = [ {name: "layer", value: "VENDOR"}, { name: "deep-read", value: true}, 
					                        {name: "metadata",value: true}];
					assert.deepEqual(options, expectedOptions, "THEN options for deep read are set");
					return "";
				};
				this.send = function(url, method, data, options) {

					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : that.response
					});
					assert.strictEqual(data, undefined, "No data provided");
					return deferred.promise();
				};

			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test("Applications with configurations exist", function(assert) {
		var done = assert.async();
		var appGuid1 = sap.apf.utils.createPseudoGuid();
		var appGuid2 = sap.apf.utils.createPseudoGuid();
		var configuration1OfApp1 = sap.apf.utils.createPseudoGuid();
		var configuration2OfApp1 = sap.apf.utils.createPseudoGuid();
		var configuration1OfApp2 = sap.apf.utils.createPseudoGuid();
		this.response = [getApplicationTemplate(appGuid1, "Application 1"),
		                 getApplicationTemplate(appGuid2, "Application 2"),
		                 getConfigurationTemplate(appGuid1, configuration1OfApp1, "sapConfig11"),
		                 getConfigurationTemplate(appGuid1, configuration2OfApp1, "sapConfig12"),
		                 getConfigurationTemplate(appGuid2, configuration1OfApp2, "sapConfig2")];
		
		
		var promise = this.proxy.readAllConfigurationsFromVendorLayer();
		promise.then(function(configurations) {
			var expectedValueHelp = [ { applicationText : "Application 1", configurationText : "sapConfig11", value : appGuid1 + "." + configuration1OfApp1}, 
			                          { applicationText : "Application 1", configurationText : "sapConfig12", value : appGuid1 + "." + configuration2OfApp1},
			                          { applicationText : "Application 2", configurationText : "sapConfig2", value : appGuid2 + "." + configuration1OfApp2}];
			assert.deepEqual(configurations, expectedValueHelp, "Expected list of configurations returned");
			done();
		});
	});
	QUnit.test("No applications exist", function(assert) {
		var done = assert.async();
		this.response = [];
		var promise = this.proxy.readAllConfigurationsFromVendorLayer();
		promise.then(function(configurations) {
			var expectedValueHelp = [];
			assert.deepEqual(configurations, expectedValueHelp, "Returned list is empty");
			done();
		});
	});
	QUnit.test("Applications without configurations exist", function(assert) {
		var done = assert.async();
		var appGuid1 = sap.apf.utils.createPseudoGuid();
		var appGuid2 = sap.apf.utils.createPseudoGuid();
		this.response = [ getApplicationTemplate(appGuid1, "Application 1"), getApplicationTemplate(appGuid2, "Application 2")];
		var promise = this.proxy.readAllConfigurationsFromVendorLayer();
		promise.then(function(configurations) {
			var expectedValueHelp = [];
			assert.deepEqual(configurations, expectedValueHelp, "Returned list is empty");
			done();
		});
	});
	QUnit.module("Delete application and configuration", {
		beforeEach : function(assert) {
			var that = this;
			that.called = { send : 0 };
			that.numberOfCallsToDelete = 0;
			that.Application = sap.apf.utils.createPseudoGuid(32);
			that.AnalyticalConfiguration = sap.apf.utils.createPseudoGuid(32);
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.messageHandler = messageHandler;
			var Connector = function() {

				var textResponse =
					"#FIORI: insert Fiori-Id\n" + 
					"# __ldi.translation.uuid=" + that.Application + "\n" +
					"#XTIT,60:Hint\n" + 
					"14395631782976233920652753624875=Category 1.1.1\n" +
					"# LastChangeDate=2014/10/07 15:56:42\n\n" + 
					"#XTIT,60:Hint\n" + 
					"14395631877028739882768245665019=Category 1.1.2\n" +
					"# LastChangeDate=2014/10/07 15:56:42\n\n";

				this._buildParams = function(aParams) {
					that.suppliedParams = aParams;
					return "";
				};
				this.deleteFile = function(sNamespace, sName, sType, sLayer, sChangelist) {
					that.numberOfCallsToDelete++;
					if (sType === "apfconfiguration") {
						assert.equal(sNamespace, 'sap/apf/dt/' + that.Application, "The correct namespace is supplied for removing configuration");
						assert.equal(sName, "config", 'The correct name is supplied for removing configuration');
					} else if (sType === 'properties') {
						assert.equal(sNamespace, 'sap/apf/dt/' + that.Application, "The correct namespace is supplied for removing texts");
						assert.equal(sName, 'text', 'The correct name is supplied for removing configuration');
					} else if (sType === 'metadata') {
						assert.equal(sNamespace, 'sap/apf/dt/' + that.Application, "The correct namespace is supplied for removing metadata");
						assert.equal(sName, 'metadata', 'The correct name is supplied for removing configuration');
					} else if (sType === 'apfapplication') {
						assert.equal(sNamespace, 'sap/apf/dt', "The correct namespace is supplied for removing application");
						assert.equal(sName, that.Application, 'The correct name is supplied for removing configuration');
					} else {
						assert.ok(false, "Unexpected call to deletion with type " + sType);
					}
					var deferred = jQuery.Deferred();
					deferred.resolve({});
					return deferred.promise();
				};
				this.send = function(url, method, data, options) {
					that.called.send++;
					if (options.async !== undefined && options.async === false && options.complete) {
						options.complete({ response : textResponse});
					}
					assert.equal(url, "/sap/bc/lrep/content/sap/apf/dt/" + that.Application + "/text.properties");

					assert.strictEqual(data, undefined, "No data provided");
					var deferred = jQuery.Deferred();
					deferred.resolve({ response : textResponse});
					return deferred.promise();
				};
				this.listContent = function(sNamespace, sLayer) {
					assert.equal(sNamespace, 'sap/apf/dt/' + that.Application, "The correct namespace is used for finding content to delete");
					var deferred = jQuery.Deferred();
					var aFiles = [ {
						name : "config",
						fileType : "apfconfiguration",
						layer : "CUSTOMER"
					}, {
						name : "text",
						fileType : "properties",
						layer : "CUSTOMER"
					}, {
						name : "metadata",
						fileType : "metadata",
						layer : "CUSTOMER"
					} ];
					deferred.resolve({
						response : aFiles
					});
					return deferred.promise();
				};
				this.getStaticResource = function() {
					var deferred = jQuery.Deferred();
					deferred.resolve(textResponse);
					return deferred.promise();
				};
			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test('Delete Application', function(assert) {
		assert.expect(9);
		var value = this.Application;
		var inputParameters = [ {
			value : value
		} ];
		function callbackFromRemoveApplication(metadata, messageObject) {
			assert.equal(messageObject, undefined, "There weren't any errors during deletion");
		}
		this.proxy.remove('application', inputParameters, callbackFromRemoveApplication);
		assert.equal(this.numberOfCallsToDelete, 3, "All files in the application namespace");
	});
	QUnit.test("Updating and reading texts", function(assert) {
		var that = this;
		var analyticalConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
		that.config = {
				AnalyticalConfigurationName : "configForTesting",
				Application : that.Application,
				SerializedAnalyticalConfiguration : JSON.stringify(analyticalConfiguration),
				AnalyticalConfiguration : that.AnalyticalConfiguration
		};
		var filterApplication = new sap.apf.core.utils.Filter(this.messageHandler, 'Application', 'eq', that.config.Application);
		var filterLanguage = new sap.apf.core.utils.Filter(this.messageHandler, 'Language', 'eq', sap.apf.core.constants.developmentLanguage);
		var textData = {
			TextElement : "", //key should be filled automatically
			Language : sap.apf.core.constants.developmentLanguage,
			TextElementType : "YMSG",
			TextElementDescription : "this is a text",
			MaximumLength : 10,
			Application : that.config.Application,
			TranslationHint : ""
		};
		filterLanguage.addAnd(filterApplication);
		for(var i = 0; i < 2; i++) {
			if (i === 1) {
				textData = jQuery.extend({}, textData, true);
				textData.TextElementDescription = "other text";
			}			
			this.proxy.create("texts", textData, callbackFromCreateText, false);
		}
		function callbackFromCreateText(textData) {
			if (textData && sap.apf.utils.isValidPseudoGuid(textData.TextElement)) {
				assert.ok(true, "text element is valid guid");
			}
		}
		var loadTextsSync = function(existingTexts, metadata, messageObject) {
			assert.equal(existingTexts.length, 2, 'two texts exist');
			assert.equal(messageObject, undefined, 'no message object');
			assert.equal(that.suppliedParams[0].value, 'CUSTOMER', "Then customer-layer is provided by default");
		};
		var loadTextsSyncWithLayer = function ( existingTexts, metadata, messageObject) {
			assert.equal(existingTexts.length, 2, 'two texts exist');
			assert.equal(messageObject, undefined, 'no message object');
			assert.equal(that.suppliedParams.length, 0, "Then no layer is provided");
		};
		var loadTextsAsync = function(existingTexts, metadata, messageObject) {
			assert.equal(existingTexts.length, 2, 'two texts exist');
			assert.equal(messageObject, undefined, 'no message object');
			that.proxy.readCollection("texts", loadTextsSync, undefined, undefined, filterLanguage, false);
			that.proxy.readCollection("texts", loadTextsSyncWithLayer, undefined, undefined, filterLanguage, false, { layer : 'ALL' });
		};
		assert.equal(that.called.send, 1, "connecter.send has been called");
		this.proxy.readCollection("texts", loadTextsAsync, undefined, undefined, filterLanguage, true);
	});
	QUnit.module("Read entity", {
		beforeEach : function(assert) {
			var that = this;
			that.application = sap.apf.utils.createPseudoGuid();
			that.configuration = sap.apf.utils.createPseudoGuid();
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.messageHandler = messageHandler;
			that.called = {};
			var Connector = function() {
				this._buildParams = function(aParams) {
					var result = "";
					var len = aParams.length;
					var i;
					for (i = 0; i < len; i++) {
						if (i === 0) {
							result += "?";
						} else if (i > 0 && i < len) {
							result += "&";
						}
						result += aParams[i].name + "=" + aParams[i].value;
					}
					return result;
				};
				this.send = function(url, method, data, options) {
					that.called.send = true;
					assert.strictEqual(data, undefined, "No data provided");
					assert.ok(url.search('/sap/bc/lrep/content/sap/apf/dt/') === 0, "Correct namespace provided");
					var serializedConfiguration = JSON.stringify(sap.apf.testhelper.config.getSampleConfiguration());
 
					if (options.complete) {
						options.complete({ responseText : JSON.stringify(serializedConfiguration)});
					} else if (url.search('layer=VENDOR') > -1) {
						that.vendorLayerOptionWasProvided = true;
						serializedConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
					}
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : serializedConfiguration
					});
					return deferred.promise();
				};
				this.getStaticResource = function(sNamespace, sName, sType, bIsRuntime) {
					that.called.getStaticResource = true;
					assert.equal(sNamespace, 'sap/apf/dt/' + that.application, "Configuration is read with correct namespace");
					assert.equal(sName, that.configuration, "Configuration is read with the correct name");
					assert.equal(sType, 'apfconfiguration', "Correct type is supplied for reading configuration");
					var serializedConfiguration = JSON.stringify(sap.apf.testhelper.config.getSampleConfiguration());
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : serializedConfiguration
					});
					return deferred.promise();
				};
				this.getFileAttributes = function(sNamespace, sName, sType, sLayer) {
					that.called.getFileAttributes = true;
					assert.equal(sNamespace, 'sap/apf/dt/' + that.application, "Configuration metadata is read with correct namespace");
					assert.equal(sName, that.configuration, "Configuration metadata is read with the correct name");
					assert.equal(sType, 'apfconfiguration', "Correct type is supplied for reading configuration metadata");
					var metadata = [ {
						name : "ApplicationName",
						value : "App Name"
					}, {
						name : "apfdt-configname",
						value : "Config Name"
					} ];
					var deferred = jQuery.Deferred();
					deferred.resolve({
						response : metadata
					});
					return deferred.promise();
				};
			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test("Without select list", function(assert) {
		var that = this;
		var done = assert.async();
		var application = this.application;
		var configuration = this.configuration;
		var inputParameters = [ {
			value : configuration
		} ];
		function callbackFromSecondRead(data, metadata, messageObject) {
			assert.equal(messageObject, undefined, "There weren't any errors during readEntity");
			assert.ok(!that.called.getFileAttributes, "Metadata was not read a second time");
			assert.ok(that.called.getStaticResource, "File was read");
			done();
		}
		function callbackFromReadEntityWithoutSelectList(data, metadata, messageObject) {
			assert.equal(messageObject, undefined, "There weren't any errors during readEntity");
			assert.ok(that.called.getFileAttributes, "Metadata was read");
			assert.ok(that.called.getStaticResource, "File was read");
			that.called.getFileAttributes = false;
			that.proxy.readEntity('configuration', callbackFromSecondRead, inputParameters, undefined, undefined, application);
		}

		this.proxy.readEntity('configuration', callbackFromReadEntityWithoutSelectList, inputParameters, undefined, undefined, application);
	});
	QUnit.test("With async false and without select list", function(assert) {
		var that = this;
		var done = assert.async();
		function callbackFromReadEntityWithoutSelectList(data, metadata, messageObject) {
			assert.equal(messageObject, undefined, "There weren't any errors during readEntity");
			assert.equal(that.called.send, true, "THEN ajax send was called");
			done();
		}
		var application = this.application;
		var configuration = this.configuration;
		var inputParameters = [ {
			value : configuration
		} ];
		this.proxy.readEntity('configuration', callbackFromReadEntityWithoutSelectList, inputParameters, undefined, false, application);
	});
	QUnit.test("With select list", function(assert) {
		var that = this;
		var done = assert.async();
		var application = this.application;
		var configuration = this.configuration;
		var inputParameters = [ {
			value : configuration
		} ];
		function callbackFromSecondRead(data, metadata, messageObject) {
			assert.equal(messageObject, undefined, "There weren't any errors during readEntity");
			assert.equal(data.SerializedAnalyticalConfiguration, undefined, "Attributes that are not requested are not returned");
			assert.equal(data.AnalyticalConfigurationName, "Config Name", "Requested attribute is returned with the correct value");
			assert.ok(!that.called.getFileAttributes, "Metadata was not read a second time");
			assert.ok(!that.called.getStaticResource, "File was not read because serialized configuration was not requested");
			done();
		}
		function callbackFromReadEntityWithSelectList(data, metadata, messageObject) {
			assert.equal(messageObject, undefined, "There weren't any errors during readEntity");
			assert.equal(data.SerializedAnalyticalConfiguration, undefined, "Attributes that are not requested are not returned");
			assert.equal(data.AnalyticalConfigurationName, "Config Name", "Requested attribute is returned with the correct value");
			assert.ok(that.called.getFileAttributes, "Metadata was read");
			assert.ok(!that.called.getStaticResource, "File was not read because serialized configuration was not requested");
			that.called.getFileAttributes = false;
			that.proxy.readEntity('configuration', callbackFromSecondRead, inputParameters, [ "AnalyticalConfigurationName" ], undefined, application);
		}
		this.proxy.readEntity('configuration', callbackFromReadEntityWithSelectList, inputParameters, [ "AnalyticalConfigurationName" ], undefined, application);
	});
	QUnit.test("With VENDOR layer option and without select list", function(assert) {
		var that = this;
		var done = assert.async();
		function callbackFromReadEntity(data, metadata, messageObject) {
			assert.deepEqual(data.SerializedAnalyticalConfiguration, JSON.stringify(sap.apf.testhelper.config.getSampleConfiguration()));
			assert.equal(messageObject, undefined, "There weren't any errors during readEntity");
			assert.equal(that.vendorLayerOptionWasProvided, true, "THEN layer option was provided in send");
			done();
		}
		var application = this.application;
		var configuration = this.configuration;
		var inputParameters = [ {
			value : configuration
		} ];
		this.proxy.readEntity('configuration', callbackFromReadEntity, inputParameters, undefined, true, application, { layer : 'VENDOR'});
	});
	QUnit.module("Batch operations", {
		beforeEach : function(assert) {
			var that = this;
			that.application = sap.apf.utils.createPseudoGuid();
			that.configuration = sap.apf.utils.createPseudoGuid();
			var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			this.messageHandler = messageHandler;
			that.callsToUpsert = 0;
			that.testingDelete = true;
			that.calledSend = 0;
			var Connector = function() {
				this._buildParams = function() {
					return "";
				};
				this.send = function(url, method, data, options) {

					var textResponse =
						"#FIORI: insert Fiori-Id\n" + 
						"# __ldi.translation.uuid=" + that.application + "\n" +
						"#XTIT,30:Hint\n" + 
						"143EC63F05550175E10000000A445B6D=TITLE1\n" +
						"# LastChangeDate=2014/10/07 15:56:42\n\n" + 
						"#XTIT,60:Hint\n" + 
						"243EC63F05550175E10000000A445B6D=TITLE2\n" +
						"# LastChangeDate=2014/10/07 15:56:42\n\n"  +
						"#XTIT,30:Hint\n" + 
						"343EC63F05550175E10000000A445B6D=TITLE3\n" +
						"# LastChangeDate=2014/10/07 15:56:42\n\n";
					that.calledSend++;
					if (options.async !== undefined && options.async === false && options.complete) {
						options.complete(textResponse);
					}
					assert.equal(url, "/sap/bc/lrep/content/sap/apf/dt/" + that.application + "/text.properties");

					var deferred = jQuery.Deferred();
					deferred.resolve({ response : textResponse} );
					assert.strictEqual(data, undefined, "No data provided");
					return deferred.promise();
				};
				this.listContent = function(sNamespace, sLayer) {
					var contentPromise = jQuery.Deferred();
					var files = [ {
						name : 'texts'
					} ];
					contentPromise.resolve({
						response : files
					});
					return contentPromise;
				};

				this.upsert = function(sNamespace, sName, sType, layer, content, fileType) {
					that.callsToUpsert++;
					assert.equal(sNamespace, 'sap/apf/dt/' + that.application, "Texts updated for the correct application");
					assert.equal(sType, 'properties', "Correct type is supplied for text properties");
					assert.equal(sName, 'text', "Correct name is supplied for text properties");

					var parseResult = sap.apf.utils.parseTextPropertyFile(content, { instances : { messageHandler : messageHandler }});
					if (that.testingDelete) {

						if (that.callsToUpsert === 1) {						
							assert.equal(parseResult.TextElements.length, 3, "No texts are deleted (call 1)");
						} else if (that.callsToUpsert === 2) {
							assert.equal(parseResult.TextElements.length, 1, "Two out of three texts are deleted (call 2)");
						} else if (that.callsToUpsert === 3) {
							assert.equal(parseResult.TextElements.length, 0, "All texts are deleted (call 3)");
						} else {
							assert.ok(false, "Too many calls to upsert");
						}
					} else {
						assert.equal(parseResult.TextElements.length, 5, "5 texts are uploaded (3 existing and 2 new)");
					}
					var deferred = jQuery.Deferred();
					deferred.resolve({});
					return deferred.promise();
				};
			};
			Connector.createConnector = function() {
				return new Connector();
			};
			this.proxy = createProxy(messageHandler, Connector);
		}
	});
	QUnit.test("Delete Texts in batch (textpool cleanup)", function(assert) {
		var that = this;
		function callback(messageObject) {
			assert.equal(messageObject, undefined, "No message object was created");
		}
		var batchRequestsNone = [];
		batchRequestsNone.push({
			method : "DELETE",
			entitySetName : "texts",
			inputParameters : [ {
				name : 'TextElement',
				value : "143EC63F05550175E10000000A445B6E"
			}, {
				name : 'Language',
				value : sap.apf.core.constants.developmentLanguage
			} ]
		});
		batchRequestsNone.push({
			method : "DELETE",
			entitySetName : "texts",
			inputParameters : [ {
				name : 'TextElement',
				value : "243EC63F05550175E10000000A445B6E"
			}, {
				name : 'Language',
				value : sap.apf.core.constants.developmentLanguage
			} ]
		});
		batchRequestsNone.push({
			method : "DELETE",
			entitySetName : "texts",
			inputParameters : [ {
				name : 'TextElement',
				value : "343EC63F05550175E10000000A445B6E"
			}, {
				name : 'Language',
				value : sap.apf.core.constants.developmentLanguage
			} ]
		});
		that.proxy.doChangeOperationsInBatch(batchRequestsNone, callback, that.application);
		var batchRequestsTwo = [];
		batchRequestsTwo.push({
			method : "DELETE",
			entitySetName : "texts",
			inputParameters : [ {
				name : 'TextElement',
				value : "143EC63F05550175E10000000A445B6D"
			}, {
				name : 'Language',
				value : sap.apf.core.constants.developmentLanguage
			} ]
		});
		batchRequestsTwo.push({
			method : "DELETE",
			entitySetName : "texts",
			inputParameters : [ {
				name : 'TextElement',
				value : "243EC63F05550175E10000000A445B6D"
			}, {
				name : 'Language',
				value : sap.apf.core.constants.developmentLanguage
			} ]
		});
		that.proxy.doChangeOperationsInBatch(batchRequestsTwo, callback, that.application);
		var batchRequestsAll = [];
		batchRequestsAll.push({
			method : "DELETE",
			entitySetName : "texts",
			inputParameters : [ {
				name : 'TextElement',
				value : "143EC63F05550175E10000000A445B6D"
			}, {
				name : 'Language',
				value : sap.apf.core.constants.developmentLanguage
			} ]
		});
		batchRequestsAll.push({
			method : "DELETE",
			entitySetName : "texts",
			inputParameters : [ {
				name : 'TextElement',
				value : "243EC63F05550175E10000000A445B6D"
			}, {
				name : 'Language',
				value : sap.apf.core.constants.developmentLanguage
			} ]
		});
		batchRequestsAll.push({
			method : "DELETE",
			entitySetName : "texts",
			inputParameters : [ {
				name : 'TextElement',
				value : "343EC63F05550175E10000000A445B6D"
			}, {
				name : 'Language',
				value : sap.apf.core.constants.developmentLanguage
			} ]
		});
		that.proxy.doChangeOperationsInBatch(batchRequestsAll, callback, that.application);
	});
	QUnit.test("Create texts in batch for existing application", function(assert) {
		var that = this;
		that.testingDelete = false;
		function callback(metadata, messageObject) {
			assert.equal(messageObject, undefined, "No message object created");
		}
		var requestConfigurations = [];
		var texts = [ {
			TextElement : "143EC63F05550175E10000000A445B6E",
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE1",
			MaximumLength : 30,
			Application : that.application,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412692222731)/"
		}, {
			TextElement : "143EC63F05550175E10000000A445B6F",
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE1",
			MaximumLength : 30,
			Application : that.application,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412692222731)/"
		} ];
		requestConfigurations.push({
			method : "POST",
			entitySetName : "texts",
			data : texts[0]
		});
		requestConfigurations.push({
			method : "POST",
			entitySetName : "texts",
			data : texts[1]
		});
		that.proxy.doChangeOperationsInBatch(requestConfigurations, callback, that.application);
	});
	QUnit.test("Create texts in batch for application without text file (import case)", function(assert) {
		var that = this;
		that.testingDelete = false;
		function callback(metadata, messageObject) {
			assert.equal(messageObject, undefined, "No message object created");
		}
		var requestConfigurations = [];
		var texts = [ {
			TextElement : "143EC63F05550175E10000000A445B6E",
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE1",
			MaximumLength : 30,
			Application : that.application,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412692222731)/"
		}, {
			TextElement : "143EC63F05550175E10000000A445B6F",
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE1",
			MaximumLength : 30,
			Application : that.application,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412692222731)/"
		} ];
		requestConfigurations.push({
			method : "POST",
			entitySetName : "texts",
			data : texts[0]
		});
		requestConfigurations.push({
			method : "POST",
			entitySetName : "texts",
			data : texts[1]
		});
		that.proxy.doChangeOperationsInBatch(requestConfigurations, callback, that.application);
	});
}());
