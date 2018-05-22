/*global location*/
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.declare('sap.apf.integration.withDoubles.persistenceHelper');
if (!sap.apf.integration.withDoubles.persistenceHelper) {
	sap.apf.integration.withDoubles.persistenceHelper = {};
	sap.apf.integration.withDoubles.persistenceHelper.init = function(oErrorStrategy) {
		jQuery.sap.storage.clear();
		var that = this;
		var nGuidCounter = 0;
		sap.apf.core.odataRequestWrapper = function(oMessageHandler, oRequest, fnSuccess, fnError, oBatchHandler) {
			var memberOfAnalysisPathUrl = sap.apf.core.constants.entitySets.analysisPath + '(';
			if (oRequest.requestUri.search("apf.xsodata") > -1) {
				switch (oRequest.method) {
					case "POST":
						post(oRequest, fnSuccess, fnError);
						break;
					case "GET":
						if (oRequest.requestUri.indexOf(memberOfAnalysisPathUrl) > -1) {
							getPath(oRequest, fnSuccess, fnError, oErrorStrategy);
						} else {
							return getAllPaths(oRequest, fnSuccess, fnError);
						}
						break;
					case "PUT":
						put(oRequest, fnSuccess, fnError);
						break;
					case "DELETE":
						delete_(oRequest);
						break;
					default:
						//
				}
			} else if (oRequest.requestUri.search("wca.xsodata") > -1) {
				throw new Error("not implemented");
			} else {
				that.fnOdataRequestWrapper(oMessageHandler, oRequest, fnSuccess, fnError, oBatchHandler);
			}
			function delete_(oRequest) {
				var sId = extractUrlParam();
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				jQuery.sap.storage.removeAll("path");
				for(var i = 0; i < aPathData.length; i++) {
					if (aPathData[i].AnalysisPath === sId) {
						aPathData.splice(i, 1);
					}
				}
				jQuery.sap.storage.put("path", JSON.stringify(aPathData));
				var oData = {};
				var oResponse = {
					body : "",
					requestUri : oRequest.requestUri,
					statusCode : 204,
					statusText : "No Content"
				};
				fnSuccess(oData, oResponse);
			}
			function post(oRequest, fnSuccess, fnError) {
				if (oErrorStrategy && oErrorStrategy.insufficientPriviledges) {
					var oError = {
						message : "Failed", //check
						request : oRequest,
						response : {
							statusCode : 404,
							statusText : "Insufficient priviledges",
							requestUri : "http://localhost:8080/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults"
						}
					};
					fnError(oError);
					return;
				}
				if (oErrorStrategy && oErrorStrategy.sqlServerError) {
					var oError = {
						message : "Failed", //check
						request : oRequest,
						response : {
							statusCode : 404,
							statusText : "SQL error occured during server request",
							requestUri : "http://localhost:8080/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults"
						}
					};
					fnError(oError);
					return;
				}
				if (oErrorStrategy && oErrorStrategy.objectNotFound) {
					//		responseText : '{ "code": "5208"	}'
					var oError = {
						message : "Failed", //check
						request : oRequest,
						response : {
							statusCode : 404,
							statusText : "Not found", //"HANA object not found",
							requestUri : "http://localhost:8080/sap/hba/r/apf/core/odata/apf.xsodata/AnalysisPathQueryResults"
						}
					};
					fnError(oError);
					return;
				}
				var oRequestData = oRequest.data;
				if (oRequestData.AnalysisPath === "") {
					createNewPath(oRequestData, fnSuccess);
				}
			}
			function put(oRequest, fnSuccess, fnError) {
				var oRequestData = oRequest.data;
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				if (aPathData === null) {
					aPathData = [];
				}
				var sId = extractUrlParam();
				var response;
				for(var i = 0; i < aPathData.length; i++) {
					if (aPathData[i].AnalysisPath === sId) {
						aPathData[i].AnalysisPathName = oRequestData.AnalysisPathName;
						aPathData[i].SerializedAnalysisPath = oRequestData.SerializedAnalysisPath;
						aPathData[i].StructuredAnalysisPath = oRequestData.StructuredAnalysisPath;
						jQuery.sap.storage.put("path", JSON.stringify(aPathData));
						response = {
							statusCode : 204,
							statusText : "No Content"
						};
						fnSuccess(undefined, response);
						return;
					}
				}
			}
			function createNewPath(oRequestData, fnSuccess) {
				nGuidCounter++;
				oRequestData.AnalysisPath = "guid" + nGuidCounter;
				oRequestData.CreationUtcDateTime = "UTC date time";
				oRequestData.LastChangeUTCDateTime = "/Date(1398852805307)/";
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				if (aPathData === null) {
					aPathData = [];
				}
				aPathData.push(oRequestData);
				jQuery.sap.storage.put("path", JSON.stringify(aPathData));
				var data = oRequestData;
				var response = {
					data : data,
					requestUri : oRequest.requestUri,
					statusCode : 201,
					statusText : "Created"
				};
				fnSuccess(data, response);
			}
			function getAllPaths(oRequest, fnSuccess, fnError) {
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				var sLogicalSystem = extractFilterValue("LogicalSystem");
				var aResults = [];
				var oSingleEntry;
				if (aPathData === null) {
					return [];
				}
				for(var i = 0; i < aPathData.length; i++) {
					if (aPathData[i].LogicalSystem === sLogicalSystem) {
						oSingleEntry = aPathData[i];
						delete oSingleEntry.SerializedAnalysisPath;
						delete oSingleEntry.ApplicationConfigurationURL;
						delete oSingleEntry.LogicalSystem;
						oSingleEntry.StructuredAnalysisPath = oSingleEntry.StructuredAnalysisPath;
						aResults.push(aPathData[i]);
					}
				}
				var data = {
					results : aResults
				};
				var response = {
					data : data,
					statusCode : 200,
					statusText : "OK"
				};
				fnSuccess(data, response);
			}
			function getPath(oRequest, fnSuccess, fnError, oErrorStrategy) {
				var data, response;
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				if (aPathData === null) {
					aPathData = [];
				}
				var sId = extractUrlParam();
				for(var i = 0; i < aPathData.length; i++) {
					if (aPathData[i].AnalysisPath === sId) {
						if (oErrorStrategy && oErrorStrategy.exchangeSecondStepIdInGetPath) {
							aPathData[i].SerializedAnalysisPath.path.steps[1].stepId = "unknownStep";
						}
						data = {
							AnalysisPath : sId,
							AnalysisPathName : 'myPath',
							SerializedAnalysisPath : aPathData[i].SerializedAnalysisPath
						};
						response = {
							data : data,
							statusCode : 200,
							statusText : "OK"
						};
						fnSuccess(data, response);
						return;
					}
				}
			}
			function extractUrlParam() {
				return oRequest.requestUri.match(/\('([^)]+)'\)/)[1];
			}
			function extractFilterValue(name) {
				var result = oRequest.requestUri.match("\(" + name + "%20eq%20'([^)]+)'%20\)");
				return result[2];
			}
		};
	};
	sap.apf.integration.withDoubles.persistenceHelper.setup = function(oContext, oErrorStrategy) {
		sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
		sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
		sap.apf.core.Metadata = sap.apf.testhelper.doubles.Metadata;
		sap.apf.core.ResourcePathHandler = sap.apf.testhelper.doubles.ResourcePathHandler;
		sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
		sap.apf.core.ResourcePathHandler.prototype.getConfigurationProperties = function() {
			return { appName : "appName" };
		};
		sap.apf.core.ResourcePathHandler.prototype.loadConfigFromFilePath = function() {
			this.oMessageHandler.loadConfig(this.getApfMessages(), true);
			this.oMessageHandler.loadConfig(this.getAppMessages());
			var oConfiguration = sap.apf.testhelper.config.getSampleConfiguration();
			this.oCoreApi.loadAnalyticalConfiguration(oConfiguration);
		};
		sap.apf.core.ResourcePathHandler.prototype.getPersistenceConfiguration = function() {
			return {
				"path" : {
					"service" : "/sap/hba/r/apf/core/odata/apf.xsodata",
					"entitySet" : sap.apf.core.constants.entitySets.analysisPath
				}
			};
		};
		sap.apf.core.ResourcePathHandler.prototype.getApplicationConfigurationURL = function() {
			return "/path/to/applicationConfiguration.json";
		};
		sap.apf.core.ResourcePathHandler.prototype.getResourceLocation = function(param) {
			var determineTestResourcePath = function() {
				var sApfLocation = jQuery.sap.getModulePath("sap.apf") + '/';
				var sHref = jQuery(location).attr('href');
				var index = sApfLocation.indexOf("/base");
				if (index > -1) { // Karma
					return "/base/test/uilib/sap/apf";
				}
				// HTML QUnit based
				//extract deployment project and use it as path to test resources
				sHref = sHref.replace(location.protocol + "//" + location.host, "");
				sHref = sHref.slice(0, sHref.indexOf("test-resources"));
				return sHref + "test-resources/sap/apf";
			};
			if (param === "apfUiTextBundle") {
				var sConfigPath = determineTestResourcePath() + '/resources/i18n/apfUi.properties';
				return sConfigPath;
			} else if (param === "applicationUiTextBundle") {
				var sAppTextPath = determineTestResourcePath() + '/resources/i18n/test_texts.properties';
				return sAppTextPath;
			}
		};
	};
}