jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
jQuery.sap.require("sap.apf.testhelper.mockServer.wrapper");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.entityTypeMetadata");
jQuery.sap.require("sap.apf.core.metadataFacade");
jQuery.sap.require("sap.apf.core.metadataProperty");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.testhelper.createDefaultAnnotationHandler");

(function() {
	'use strict';

	/* globals OData */
	QUnit.module('Get instances', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGenericMetadata();
			sap.apf.testhelper.mockServer.activateGenericMetadata2();
			sap.apf.testhelper.mockServer.activateApf();
			var oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler : annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					Metadata : sap.apf.core.Metadata,
					EntityTypeMetadata : sap.apf.core.EntityTypeMetadata,
					MetadataFacade : sap.apf.core.MetadataFacade,
					MetadataProperty : sap.apf.core.MetadataProperty,
					ODataModel : this.ODataModel
				}
			};
			this.oMetadataFactory = new sap.apf.core.MetadataFactory(oInject);
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('Same metadata instance returned if retrieved twice for service root', function(assert) {
		var oFirstRetrieval = this.oMetadataFactory.getMetadata('/some/path/dummy.xsodata');
		var oSecondRetrieval = this.oMetadataFactory.getMetadata('/some/path/dummy.xsodata');
		assert.equal(oFirstRetrieval.type, 'metadata', 'Metadata instance expected');
		assert.equal(oFirstRetrieval, oSecondRetrieval, 'Same instance expected');
	});
	QUnit.test('Same entity type metadata instance returned if retrieved twice for same service root and entity type', function(assert) {
		var oFirstRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/some/path/dummy.xsodata', 'secondEntityQueryType');
		var oSecondRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/some/path/dummy.xsodata', 'secondEntityQueryType');
		assert.equal(oFirstRetrieval.type, 'entityTypeMetadata', 'Entity type metadata instance expected');
		assert.equal(oFirstRetrieval, oSecondRetrieval, 'Same instance expected');
	});
	QUnit.test('Different entity type metadata instance returned if same entity type retrieved twice for different service roots', function(assert) {
		var oFirstRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/some/path/dummy.xsodata', 'secondEntityQueryType');
		var oSecondRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/some/path2/dummyTwo.xsodata', 'secondEntityQueryType');
		assert.equal(oFirstRetrieval.type, 'entityTypeMetadata', 'Entity type metadata instance expected');
		assert.equal(oSecondRetrieval.type, 'entityTypeMetadata', 'Entity type metadata instance expected');
		assert.notEqual(oFirstRetrieval, oSecondRetrieval, 'Different instances expected');
	});
	QUnit.module('Metadata facade provisioning', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGenericMetadata();
			sap.apf.testhelper.mockServer.activateApf();
			var oConfigurationFactory = {
				getServiceDocuments : function() {
					return [ "/some/path/dummy.xsodata", "/sap/hba/r/apf/core/odata/apf.xsodata" ];
				}
			};
			var oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					configurationFactory : oConfigurationFactory,
					annotationHandler : annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					Metadata : sap.apf.core.Metadata,
					EntityTypeMetadata : sap.apf.core.EntityTypeMetadata,
					MetadataFacade : sap.apf.core.MetadataFacade,
					MetadataProperty : sap.apf.core.MetadataProperty,
					ODataModel : this.ODataModel
				}
			};
			this.oMetadataFactory = new sap.apf.core.MetadataFactory(oInject);
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('Get entity types', function(assert) {
		var aExpectedEntityTypes =
			[
			  "firstEntityQueryResultsType",
			  "firstEntityQueryType",
			  "secondEntityQueryResultsType",
			  "secondEntityQueryType",
			  "thirdEntityDirectlyAddressableQueryResultsType",
			  "fourthEntityWithoutSapSemanticsType"
			];
		assert.deepEqual(this.oMetadataFactory.getEntityTypes("/some/path/dummy.xsodata"), aExpectedEntityTypes, "Array with entity sets from service root");
	});
	QUnit.test('Get entity sets', function(assert) {
		var aExpectedEntitySets = [ "firstEntityQuery", "secondEntityQuery", "thirdEntityDirectlyAddressableQueryResults", "fourthEntityWithoutSapSemantics" ];
		assert.deepEqual(this.oMetadataFactory.getEntitySets("/some/path/dummy.xsodata"), aExpectedEntitySets, "Array with entity sets from service root");
	});
	QUnit.test('Get service documents', function(assert) {
		var oExpectedServiceDocuments = [ "/some/path/dummy.xsodata", "/sap/hba/r/apf/core/odata/apf.xsodata" ];
		assert.deepEqual(this.oMetadataFactory.getServiceDocuments(), oExpectedServiceDocuments, "Array with service documents from analytical configuration file expected");
	});
	QUnit.test('Metadata facade integration in factory and test getAllProperties()', function(assert) {
		assert.expect(2);
		var oMetadataFacade = this.oMetadataFactory.getMetadataFacade();
		assert.ok(oMetadataFacade.type === "metadataFacade", "getMetadataFacade() returns instance of MetadataFacade");
		oMetadataFacade.getAllProperties(function callback(propertyNames) {
			var expectedProperties = [ "firstProperty", "secondProperty", "nonFilterableProperty", "P_FirstParameter", "P_SecondParameter", "PropertyOneForThird", "PropertyTwoForThird", "PropertyOneForFourth", "PropertyTwoForFourth",
					"SerializedAnalysisPath", "StructuredAnalysisPath", "GenID", "AnalysisPath", "AnalysisPathName", "LogicalSystem", "ApplicationConfigurationURL", "NumberOfAnalysisPaths", "AnalyticalConfiguration", "AnalyticalConfigurationName",
					"CreationUTCDateTime", "CreatedByUser", "LastChangedByUser", "SerializedAnalyticalConfiguration", "TextElement", "Language", "TextElementType", "TextElementDescription", "Application", "MaximumLength", "TranslationHint",
					"LastChangeUTCDateTime" ];
			assert.deepEqual(propertyNames, expectedProperties, "Property Names as expected");
		});
	});
	QUnit.test('Metadata facade instance with parameter for one service document', function(assert) {
		assert.expect(1);
		var oMetadataFacade = this.oMetadataFactory.getMetadataFacade("/sap/hba/r/apf/core/odata/apf.xsodata");
		var callback = function(aPropertyNames) {
			assert.deepEqual(aPropertyNames, [ "SerializedAnalysisPath", "StructuredAnalysisPath", "GenID", "AnalysisPath", "AnalysisPathName", "LogicalSystem", "ApplicationConfigurationURL", "NumberOfAnalysisPaths", "AnalyticalConfiguration",
					"AnalyticalConfigurationName", "CreationUTCDateTime", "CreatedByUser", "LastChangedByUser", "SerializedAnalyticalConfiguration", "TextElement", "Language", "TextElementType", "TextElementDescription", "Application",
					"MaximumLength", "TranslationHint", "LastChangeUTCDateTime" ], "Only property names for the specified service document expected");
		};
		//Here a metadata facade is used, which has access to two different service documents, but is instantiated with a param for one service document
		oMetadataFacade.getAllProperties(callback);
	});

}());
