jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.coreApi");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.persistence");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.ui.thirdparty.sinon");

(function() {
	'use strict';

	function assertUrlPatternIsContained(assert, sOriginalUri, sExpectedUri, sComment) {
		var sUri = sOriginalUri.replace(/\//g, 'X');
		var sExpected = sExpectedUri.replace(/\//g, 'X');
		var sPosition = sUri.indexOf(sExpected);
		assert.equal(sPosition > -1, true, sComment);
	}
	function commonSetupPersistence(oContext, configurationOfLogicalSystem) {
		var sapClientValue;
		oContext.originalODataWrapper = sap.apf.core.odataRequestWrapper;
		oContext.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		sap.apf.core.dummyPath = {
			path : {
				indicesOfActiveSteps : [ 0 ],
				steps : [ {
					stepId : 'one',
					binding : {
						selectedRepresentationId : 'reprOne'
					}
				}, {
					stepId : 'two',
					binding : {
						selectedRepresentationId : 'reprTwo'
					}
				} ]
			},
			context : {}
		};
		oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances : {
				messageHandler : oContext.oMessageHandler
			}
		});
		if (configurationOfLogicalSystem && configurationOfLogicalSystem.noSapClientValue) {
			sapClientValue = undefined;
		} else {
			sapClientValue = '777';
		}
		oContext.oCoreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return undefined;
				},
				getSapClient : function() {
					return sapClientValue;
				}
			};
		};
		oContext.oCoreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		oContext.oCoreApi.getXsrfToken = function() {
			return 'dummyToken';
		};
		oContext.spyGetXsrfToken = sinon.spy(oContext.oCoreApi, 'getXsrfToken');
		if (configurationOfLogicalSystem && configurationOfLogicalSystem.withoutLogicalSystem) {
			oContext.oCoreApi.getPersistenceConfiguration = function() {
				return {
					"path" : {
						"service" : "/sap/hba/r/apf/core/odata/apf.xsodata",
						"entitySet" : sap.apf.core.constants.entitySets.analysisPath
					}
				};
			};
		} else if (configurationOfLogicalSystem && configurationOfLogicalSystem.customerSpecificEntitySet) {
			oContext.oCoreApi.getPersistenceConfiguration = function() {
				return {
					"path" : {
						"service" : "/sap/hba/r/apf/core/odata/apf.xsodata",
						"entitySet" : sap.apf.core.constants.entitySets.analysisPath
					},
					"logicalSystem" : {
						"service" : "/sapperlot/odata/wca.xsodata",
						"entitySet" : "CustomerDefinedQueryForLogicalSystem"
					}
				};
			};
		} else {
			oContext.oCoreApi.getPersistenceConfiguration = function() {
				return {
					"path" : {
						"service" : "/sap/hba/r/apf/core/odata/apf.xsodata",
						"entitySet" : sap.apf.core.constants.entitySets.analysisPath
					},
					"logicalSystem" : {
						"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
					}
				};
			};
		}
		oContext.oCoreApi.getApplicationConfigurationURL = function() {
			return "/path/to/applicationConfiguration.json";
		};
		oContext.oCoreApi.serialize = function() {
			return sap.apf.core.dummyPath;
		};
		oContext.oCoreApi.resetPath = function() {
		};
		oContext.oCoreApi.deserialize = function(oDeserializablePath) {
			oContext.openedPath = oDeserializablePath;
		};
		oContext.oCoreApi.updatePath = function(fnStepProcessedCallback) {
			fnStepProcessedCallback();
		};
		oContext.oCoreApi.ajax = sap.apf.core.ajax;
		oContext.oCoreApi.getEntityTypeMetadata = function(sAbsolutePathToServiceDocument, sEntityType) {
			return {};
		};
		oContext.oCoreApi.getCumulativeFilter = function() {
			var deferred = jQuery.Deferred();
			var filter = new sap.apf.core.utils.Filter(oContext.oMessageHandler, "SAPClient", "eq", "999");
			filter = filter.addAnd(new sap.apf.core.utils.Filter(oContext.oMessageHandler, "PropertyOfNoInterest", "eq", "333"));
			deferred.resolve(filter);
			return deferred.promise();
		};
	}
	QUnit.module('Persistence request object spy', {
		beforeEach : function(assert) {
			var that = this;
			commonSetupPersistence(this, false);
			this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError) {
				if (oRequest.requestUri.search('select=LogicalSystem') > -1) {
					that.usedUrlForLogicalSystem = oRequest.requestUri;
					var data = {
						results : [ {
							LogicalSystem : "dummySystem"
						} ]
					};
					fnSuccess(data);
				} else {
					that.oRequest = oRequest;
					fnSuccess({}, {
						data : "ContentOfNoInterest",
						statusCode : 201,
						statusText : "Created"
					});
				}
			};
		},
		afterEach : function(assert) {
			sap.apf.core.odataRequestWrapper = this.originalODataWrapper;
		}
	});
	QUnit.test('createPath()', function(assert) {
		var done = assert.async();
		var oPersistence = new sap.apf.core.Persistence({
			instances: {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		var expectedStructuredAnalysisPath = {
			steps : [ {
				stepId : "one",
				selectedRepresentationId : "reprOne"
			}, {
				stepId : "two",
				selectedRepresentationId : "reprTwo"
			} ],
			indexOfActiveStep : 0
		};
		oPersistence.createPath("myPath", callbackCreate.bind(this), {
			filterIdHandler : {
				fih : 'fih'
			}
		});
		function callbackCreate() {
			var data = this.oRequest.data;
			assert.equal(this.spyGetXsrfToken.getCall(0).args[0], '/sap/hba/apps/wca/dso/s/odata/wca.xsodata', 'Correct service root for requesting XSRF token for logical system service');
			assert.equal(this.spyGetXsrfToken.getCall(1).args[0], '/sap/hba/r/apf/core/odata/apf.xsodata', 'Correct service root for requesting XSRF token for persistence service');
			assert.ok(this.oRequest.method === "POST", "Correct request method");
			assertUrlPatternIsContained(assert, this.oRequest.requestUri, "/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults", "Correct request uri");
			assert.ok(this.oRequest.headers['x-csrf-token'] === "dummyToken", "Correct request XSRF Token");
			assert.equal(data.AnalyticalConfiguration, undefined, "Analytical Configuration is not existing when no startparameter set");
			assert.ok(!data.AnalysisPath, "No need of AnalysisPath ID");
			assert.ok(data.AnalysisPathName === "myPath", "Correct AnalysisPathName");
						assert.equal(data.ApplicationConfigurationURL, 'comp1', 'Correct ApplicationConfigurationURL');
			assert.ok(data.LogicalSystem === "dummySystem", "LogicalSystem");
			assert.ok(this.usedUrlForLogicalSystem.search("SAPClientQuery") > -1, "THEN the default entity set is used");
			var oExpectedSerializedAnalysisPath = jQuery.extend(true, {}, sap.apf.core.dummyPath);
			oExpectedSerializedAnalysisPath.filterIdHandler = {
				fih : 'fih'
			};
			assert.deepEqual(JSON.parse(data.SerializedAnalysisPath), oExpectedSerializedAnalysisPath, "Correct SerializedAnalysisPath");
			assert.deepEqual(JSON.parse(data.StructuredAnalysisPath), expectedStructuredAnalysisPath, "Correct StructuredAnalysisPath");
			done();
		}
	});
	QUnit.test('deletePath()', function(assert) {
		var that = this;
		var done = assert.async();
		var oPersistence = new sap.apf.core.Persistence({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.deletePath("myPathID", callbackDelete.bind(this));
		function callbackDelete() {
			assert.ok(that.oRequest.method === "DELETE", "Correct request method");
			assertUrlPatternIsContained(assert, that.oRequest.requestUri, "/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults('myPathID')", "Correct request uri");
			assert.ok(!that.oRequest.data, "No need of data");
			done();
		}
	});
	QUnit.test('modifyPath()', function(assert) {
		var that = this;
		var done = assert.async();
		var oPersistence = new sap.apf.core.Persistence({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		var expectedStructuredAnalysisPath = {
			steps : [ {
				stepId : "one",
				selectedRepresentationId : "reprOne"
			}, {
				stepId : "two",
				selectedRepresentationId : "reprTwo"
			} ],
			indexOfActiveStep : 0
		};
		oPersistence.modifyPath("myPathID", "myPath", callbackModify.bind(this), {
			filterIdHandler : {
				fih : 'fih'
			}
		});
		function callbackModify() {
			var data = that.oRequest.data;
			assert.ok(that.oRequest.method === "PUT", "Correct request method");
			assertUrlPatternIsContained(assert, that.oRequest.requestUri, "/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults('myPathID')", "Correct request uri");
			assert.ok(that.oRequest.headers['x-csrf-token'] === "dummyToken", "Correct request XSRF Token");
			assert.ok(!data.AnalysisPath, "No AnalysisPath needeed");
			assert.ok(data.AnalysisPathName === "myPath", "Correct AnalysisPathName");
			assert.ok(data.ApplicationConfigurationURL === "comp1", "Correct ApplicationConfigurationURL");
			assert.ok(data.LogicalSystem === "dummySystem", "LogicalSystem");
			var oExpectedSerializedAnalysisPath = jQuery.extend(true, {}, sap.apf.core.dummyPath);
			oExpectedSerializedAnalysisPath.filterIdHandler = {
				fih : 'fih'
			};
			assert.deepEqual(JSON.parse(data.SerializedAnalysisPath), oExpectedSerializedAnalysisPath, "Correct SerializedAnalysisPath");
			assert.deepEqual(JSON.parse(data.StructuredAnalysisPath), expectedStructuredAnalysisPath, "Correct StructuredAnalysisPath");
			done();
		}
	});
	QUnit.test('openPath()', function(assert) {
		var that = this;
		var done = assert.async();
		this.oMessageHandler.putMessage = function(oMessageObject) { // allow put error message
			if (oMessageObject.getSeverity() === "fatal") {
				throw new Error();
			}
		};
		var oPersistence = new sap.apf.core.Persistence({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.openPath("myPathID", callbackOpen.bind(this));
		function callbackOpen() {
			assert.ok(that.oRequest.method === "GET", "Correct request method");
			assertUrlPatternIsContained(assert, that.oRequest.requestUri, "/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults('myPathID')", "Correct request uri");
			assert.ok(that.oRequest.headers['x-csrf-token'] === "dummyToken", "Correct request XSRF Token");
			assert.ok(!that.oRequest.data, "Correct AnalysisPath");
			done();
		}
	});

	QUnit.test('readPaths', function(assert) {
			var that = this;
			var oPersistence = new sap.apf.core.Persistence({
					instances  : {
						messageHandler : this.oMessageHandler,
						coreApi : this.oCoreApi
					},
					functions : { 
						getComponentName : function() { return  "comp1"; }
					}
				});
			oPersistence.readPaths(callbackRead.bind(this));
						
			function callbackRead() {
				assert.ok(that.oRequest.method === "GET", "Correct request method");
				assertUrlPatternIsContained(
									assert,
									that.oRequest.requestUri,
									"/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults?$select=AnalysisPath,AnalysisPathName,StructuredAnalysisPath,CreationUTCDateTime,LastChangeUTCDateTime&$filter=(LogicalSystem%20eq%20'dummySystem'%20and%20ApplicationConfigurationURL%20eq%20'comp1')&$orderby=LastChangeUTCDateTime%20desc",
									"Correct request uri");
				assert.ok(that.oRequest.headers['x-csrf-token'] === "dummyToken", "Correct request XSRF Token");
			}
	});
	
	QUnit.test('createPath and readPaths path with configuration id', function(assert) {
		var that = this;
		var done = assert.async();
		this.oCoreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { configurationId: 'dummyConfigurationId'};
				},
				getSapClient : function() {
					return '777';
				}
			};
		};
		var oPersistence = new sap.apf.core.Persistence({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.createPath("myPath", callbackCreate.bind(this), {
			filterIdHandler : {
				fih : 'fih'
			}
		});
		function callbackCreate() {
			assert.equal(this.oRequest.data.AnalyticalConfiguration, "dummyConfigurationId", "Analytical Configuration is set when startparameter set");
			oPersistence.readPaths(callbackRead.bind(this));
		}
		function callbackRead() {
			assertUrlPatternIsContained(
					assert,
					that.oRequest.requestUri,
					"/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults?$select=AnalysisPath,AnalysisPathName,StructuredAnalysisPath,CreationUTCDateTime,LastChangeUTCDateTime&$filter=(AnalyticalConfiguration%20eq%20'dummyConfigurationId'%20and%20LogicalSystem%20eq%20'dummySystem'%20and%20ApplicationConfigurationURL%20eq%20'comp1')&$orderby=LastChangeUTCDateTime%20desc",
			"Correct request uri");
			done();
		}
	});
	
	QUnit.test('createPath and readPaths path with compound configuration id', function(assert) {
		var that = this;
		var done = assert.async();
		this.oCoreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					return { applicationId :'ApplicationId',
						     configurationId : 'ConfigurationId' 
					};
				},
				getSapClient : function() {
					return '777';
				}
			};
		};
		var oPersistence = new sap.apf.core.Persistence({
			instances  : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.createPath("myPath", callbackCreate.bind(this), {
			filterIdHandler : {
				fih : 'fih'
			}
		});
		function callbackCreate() {
			assert.equal(this.oRequest.data.AnalyticalConfiguration, "ConfigurationId", "Analytical Configuration is set when startparameter set");
			oPersistence.readPaths(callbackRead.bind(this));
		}
		function callbackRead() {
			assertUrlPatternIsContained(
					assert,
					that.oRequest.requestUri,
						"/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults?$select=AnalysisPath,AnalysisPathName,StructuredAnalysisPath,CreationUTCDateTime,LastChangeUTCDateTime&$filter=(AnalyticalConfiguration%20eq%20'ConfigurationId'%20and%20LogicalSystem%20eq%20'dummySystem'%20and%20ApplicationConfigurationURL%20eq%20'comp1')&$orderby=LastChangeUTCDateTime%20desc",
			"Correct request uri");
			done();
		}
	});
	QUnit.module('Persistence -create path but without logical system configuration', {
		beforeEach : function(assert) {
			var that = this;
			that.usedUrlForLogicalSystem = "notUsed";
			var configurationOfLogicalSystem = {
				withoutLogicalSystem : true
			};
			commonSetupPersistence(this, configurationOfLogicalSystem);
			this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError) {
				if (oRequest.requestUri.search('select=LogicalSystem') > -1) {
					that.usedUrlForLogicalSystem = oRequest.requestUri;
					var data = {
						results : [ {
							LogicalSystem : "dummySystem"
						} ]
					};
					fnSuccess(data);
				} else {
					that.oRequest = oRequest;
					fnSuccess({}, {
						data : "ContentOfNoInterest",
						statusCode : 201,
						statusText : "Created"
					});
				}
			};
		},
		afterEach : function(assert) {
			sap.apf.core.odataRequestWrapper = this.originalODataWrapper;
		}
	});
	QUnit.test('WHEN createPath() BUT WITHOUT logical system configuration', function(assert) {
		var that = this;
		var done = assert.async();
		var oPersistence = new sap.apf.core.Persistence({
			instances :  {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.createPath("myPath", callbackCreate.bind(this), {
			pathContextHandler : {
				path : "context"
			}
		});
		function callbackCreate() {
			var data = that.oRequest.data;
			assert.ok(data.LogicalSystem === "777", "THEN SAP CLient as LogicalSystem");
			assert.equal(that.usedUrlForLogicalSystem, "notUsed", "THEN no request for logical system was performed");
			done();
		}
	});
	QUnit.module('Persistence -create path but use customer specific logical system configuration', {
		beforeEach : function(assert) {
			var that = this;
			that.usedUrlForLogicalSystem = "notUsed";
			var configurationOfLogicalSystem = {
				customerSpecificEntitySet : true
			};
			commonSetupPersistence(this, configurationOfLogicalSystem);
			this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError) {
				if (oRequest.requestUri.search('select=LogicalSystem') > -1) {
					that.usedUrlForLogicalSystem = oRequest.requestUri;
					var data = {
						results : [ {
							LogicalSystem : "dummySystem"
						} ]
					};
					fnSuccess(data);
				} else {
					that.oRequest = oRequest;
					fnSuccess({}, {
						data : "ContentOfNoInterest",
						statusCode : 201,
						statusText : "Created"
					});
				}
			};
		},
		afterEach : function(assert) {
			sap.apf.core.odataRequestWrapper = this.originalODataWrapper;
		}
	});
	QUnit.test('WHEN createPath() WITH customer defined logical system configuration', function(assert) {
		var that = this;
		var done = assert.async();
		var oPersistence = new sap.apf.core.Persistence({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.createPath("myPath", callbackCreate.bind(this), {
			pathContextHandler : {
				path : "context"
			}
		});
		function callbackCreate() {
			var data = that.oRequest.data;
			assert.ok(data.LogicalSystem === "dummySystem", "THEN dummy system was found as LogicalSystem");
			assert.ok(that.usedUrlForLogicalSystem.search("sapperlot") > -1, "THEN customer defined service root was used");
			assert.ok(that.usedUrlForLogicalSystem.search("CustomerDefinedQueryForLogicalSystem") > -1, "THEN customer defined entity set was used");
			done();
		}
	});
	QUnit.module('Persistence -create path and use SapClient for logical system from the cummulative filter', {
		beforeEach : function(assert) {
			var that = this;
			that.usedUrlForLogicalSystem = "notUsed";
			var configurationOfLogicalSystem = {
				noSapClientValue : true,
				withoutLogicalSystem : true
			};
			commonSetupPersistence(this, configurationOfLogicalSystem);
			this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError) {
				if (oRequest.requestUri.search('select=LogicalSystem') > -1) {
					that.usedUrlForLogicalSystem = oRequest.requestUri;
					var data = {
						results : [ {
							LogicalSystem : "dummySystem"
						} ]
					};
					fnSuccess(data);
				} else {
					that.oRequest = oRequest;
					fnSuccess({}, {
						data : "ContentOfNoInterest",
						statusCode : 201,
						statusText : "Created"
					});
				}
			};
		},
		afterEach : function(assert) {
			sap.apf.core.odataRequestWrapper = this.originalODataWrapper;
		}
	});
	QUnit.test('WHEN createPath() WITH customer defined logical system configuration', function(assert) {
		var that = this;
		var done = assert.async();
		var oPersistence = new sap.apf.core.Persistence({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.createPath("myPath", callbackCreate.bind(this), {
			pathContextHandler : {
				path : "context"
			}
		});
		function callbackCreate() {
			var data = that.oRequest.data;
			assert.ok(data.LogicalSystem === "999", "THEN SAP CLient from cummulative filter was taken");
			done();
		}
	});

	
	QUnit.module('Error handling open path', {
		beforeEach : function(assert) {
			var that = this;
			commonSetupPersistence(this, false);
			this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError) {
				var data;
				if (oRequest.requestUri.search('select=LogicalSystem') > -1) {
					that.usedUrlForLogicalSystem = oRequest.requestUri;
					data = {
						results : [ {
							LogicalSystem : "dummySystem"
						} ]
					};
					fnSuccess(data);
				} else {
					data = { SerializedAnalysisPath : JSON.stringify({ path : "aValue" })};
					that.oRequest = oRequest;
					fnSuccess({}, {
						data : data,
						statusCode : 200,
						statusText : "Created"
					});
				}
			};
		},
		afterEach : function(assert) {
			sap.apf.core.odataRequestWrapper = this.originalODataWrapper;
		}
	});
	
	QUnit.test('WHEN openPath() and fatal error message in deserialize method', function(assert) {
		var that = this;
		that.restoreOriginalPathWasCalled = false;
		var done = assert.async();
		this.oCoreApi.deserialize = function(oDeserializablePath) {
			that.openedPath = oDeserializablePath;
			that.oMessageHandler.check(false, "Fatal error should occurr");
		};
		this.oCoreApi.restoreOriginalPath = function() {
			that.restoreOriginalPathWasCalled = true;
		};
		this.oMessageHandler.putMessage = function(oMessageObject) { // allow put error message
			if (oMessageObject.getSeverity() === "fatal") {
				throw new Error();
			}
		};
		var oPersistence = new sap.apf.core.Persistence({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.openPath("myPathID", callbackOpen.bind(this));
		function callbackOpen(response, metadata, messageObject) {
			assert.ok(messageObject, "THEN messageObject is supplied");
			assert.ok(that.restoreOriginalPathWasCalled, "THEN the restore method was called");
			done();
		}
	});
	QUnit.test('WHEN openPath() and fatal error message in deserialize method', function(assert) {
		var that = this;
		this.oMessageHandler.doubleGetConfigurationByCode();
		that.restoreOriginalPathWasCalled = false;
		var done = assert.async();
		this.oCoreApi.deserialize = function(oDeserializablePath) {
			that.openedPath = oDeserializablePath;
			that.oMessageHandler.putMessage(new sap.apf.core.MessageObject({code : "5100"} ));
		};
		this.oCoreApi.restoreOriginalPath = function() {
			that.restoreOriginalPathWasCalled = true;
		};
		this.oMessageHandler.putMessage = function(oMessageObject) { // allow put error message
			if (oMessageObject.getSeverity() === "fatal") {
				throw new Error();
			}
		};
		var oPersistence = new sap.apf.core.Persistence({
			instances: {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.openPath("myPathID", callbackOpen.bind(this));
		function callbackOpen(response, metadata, messageObject) {
			assert.ok(messageObject, "THEN messageObject is supplied");
			assert.ok(that.restoreOriginalPathWasCalled, "THEN the restore method was called");
			done();
		}
	});

	QUnit.test('WHEN openPath() and warning message in deserialize method', function(assert) {
		var that = this;

		this.oMessageHandler.doubleGetConfigurationByCode();
		that.restoreOriginalPathWasCalled = false;
		var done = assert.async();
		this.oCoreApi.deserialize = function(oDeserializablePath) {
			that.openedPath = oDeserializablePath;
			that.oMessageHandler.putMessage(new sap.apf.core.MessageObject({code : "5301"} ));

		};
		this.oCoreApi.restoreOriginalPath = function() {
			that.restoreOriginalPathWasCalled = true;
		};
		this.oMessageHandler.putMessage = function(oMessageObject) { // allow put error message
			if (oMessageObject.getSeverity() === "fatal") {
				throw new Error();
			}
		};
		var oPersistence = new sap.apf.core.Persistence({
			instances : {
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			},
			functions : { 
				getComponentName : function() { return  "comp1"; }
			}
		});
		oPersistence.openPath("myPathID", callbackOpen.bind(this));
		function callbackOpen(response, metadata, messageObject) {
			assert.ok(!messageObject, "THEN no messageObject is supplied - warning is suppressed");
			assert.ok(!that.restoreOriginalPathWasCalled, "THEN the restore method was NOT called");
			done();
		}
	});
}());