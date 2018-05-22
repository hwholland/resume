/*global sap, jQuery, sinon, location */
jQuery.sap.declare('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require("sap.ui.core.util.MockServer");
jQuery.sap.require("sap.apf.utils.hashtable");
(function() {
	'use strict';
	var mockServers = [];
	var annotationMockServers = [];
	var applicationPath = getTestRunnerRoot();
	var oldDsoPath = '/sap/hba/apps/wca/dso/s/odata/';
	var oldDpoPath = '/sap/hba/apps/wca/dpo/s/odata/';
	var wcaPath = '/sap/hba/r/sfin700/wca/odata/wca.xsodata/'; // dso & dpo
	var apfPath = '/sap/hba/r/apf/core/odata/';
	var modelerPath = '/sap/hba/r/apf/core/odata/modeler/';
	var genericPath = '/some/path/';
	var genericPath2 = '/some/path2/';
	var gatewayPath = "/sap/opu/odata/sap/";
	var mmPath = "/sap/mm/";
	var emptyPath = "/sap/empty/";
	var anaFlightsCdsPath = '/cds/';
	var metadataPath = applicationPath + "testhelper/mockServer/metadata/<placeholder>.xml";
	var dataPath = applicationPath + "testhelper/mockServer/data/<placeholder>/";
	sap.apf.testhelper.mockServer = {
		activateGenericMetadata : function() {
			mockServers.push(createMockServer(genericPath, 'dummy.xsodata', "genericMetadata", "genericAnnotation"));
		},
		activateGenericMetadataWithoutAnnotations : function() {
			mockServers.push(createMockServer(genericPath, 'dummy.xsodata', "genericMetadata"));
		},
		activateGenericMetadata2 : function() {
			mockServers.push(createMockServer(genericPath2, 'dummyTwo.xsodata', "genericMetadata", "genericAnnotation"));
		},
		activateGateway : function() {
			mockServers.push(createMockServer(gatewayPath, 'ZJH_4APF_005_SRV', "gatewayMetadata"));
		},
		activateMmMetadata : function() {
			mockServers.push(createMockServer(mmPath, 'ZAPF_Q002_SRV', "mmMetadata"));
		},
		activateDso : function() {
			mockServers.push(createMockServer(oldDsoPath, 'wca.xsodata', "dso"));
		},
		activateDpo : function() {
			mockServers.push(createMockServer(oldDpoPath, 'wca.xsodata', "dpo"));
		},
		activateWca : function() {
			mockServers.push(createMockServer(wcaPath, 'wca.xsodata', "wca"));
		},
		activateApf : function() {
			mockServers.push(createMockServer(apfPath, 'apf.xsodata', "apf", "apfAnnotation"));
		},
		activateModeler : function() {
			mockServers.push(createMockServer(modelerPath, 'AnalyticalConfiguration.xsodata', "modeler"));
		},
		activateGatewayWithEntitySetWithOutAggretation : function() {
			mockServers.push(createMockServer(anaFlightsCdsPath, 'ZI_ANA_FLIGHT_CDS', "zi_ana_flight_cds"));
		},
		activateEmptyMetadata : function() {
			mockServers.push(createMockServer(emptyPath, 'empty.xsodata', "empty"));
		},
		deactivate : function() {
			mockServers.forEach(function(mockServer) {
				mockServer.stop();
				mockServer.destroy();
			});
			mockServers = [];
			annotationMockServers.forEach(function(mockServer) {
				mockServer.stop();
				mockServer.destroy();
			});
			annotationMockServers = [];
			//teardownCrossMockServer();
		}
	};
	function getTestRunnerRoot() {
		var sApfLocation = jQuery.sap.getModulePath("sap.apf") + '/';
		var index = sApfLocation.indexOf("/base");
		if (index === 0) { // Karma
			return "base/test/uilib/sap/apf/";
		}
		var sHref = jQuery(location).attr('href');
		sHref = sHref.replace(location.protocol + "//" + location.host, "");
		sHref = sHref.slice(0, sHref.indexOf("test-resources"));
		return sHref + "test-resources/sap/apf/";
	}
	// annotationFile is optional
	function createMockServer(servicePath, rootDocument, serviceName, annotationFile) {
		var annotationMockServer;
		var mockServer = new sap.ui.core.util.MockServer({
			rootUri : servicePath + rootDocument + '/'
		});
		mockServer.simulate(metadataPath.replace("<placeholder>", serviceName), dataPath.replace("<placeholder>", serviceName));
		if (annotationFile) {
			annotationMockServer = new sap.ui.core.util.MockServer({
				rootUri : servicePath,
				requests : [ {
					method : "GET",
					path : new RegExp(".*annotation.xml"),
					response : function(xhr, sUrl) {
						var annotationFilePath = metadataPath.replace("<placeholder>", annotationFile);
						return xhr.respondFile(200, {}, annotationFilePath);
					}
				}, {
					method : "HEAD",
					path : new RegExp(".*annotation.xml"),
					response : function(xhr, sUrl) {
						var annotationFilePath = metadataPath.replace("<placeholder>", annotationFile);
						return xhr.respondFile(200, {}, annotationFilePath);
					}
				} ]
			});
		} else {
			annotationMockServer = new sap.ui.core.util.MockServer({
				rootUri : servicePath,
				requests : [ {
					method : "GET",
					path : new RegExp(".*annotation.xml"),
					response : function(xhr) {
						return xhr.respondFile(404, {}, "");
					}
				}, {
					method : "HEAD",
					path : new RegExp(".*annotation.xml"),
					response : function(xhr, sUrl) {
						return xhr.respondFile(404, {}, "");
					}
				} ]
			});
		}
		annotationMockServer.start();
		annotationMockServers.push(annotationMockServer);
		mockServer.start();
		return mockServer;
	}
}());
