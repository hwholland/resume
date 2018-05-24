jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfCoreApi");
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.metadataFacade");
jQuery.sap.require("sap.apf.core.metadataProperty");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.testhelper.mockServer.wrapper");
jQuery.sap.require("sap.apf.core.utils.fileExists");
jQuery.sap.require("sap.apf.testhelper.createDefaultAnnotationHandler");
/* globals OData */
(function() {
	'use strict';


	QUnit.module('MetadataFacade with core api, message handler and annotation double', {
		beforeEach : function(assert) {
			var that = this;
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			this.getServiceMetadataCalls = 0;
			sap.apf.testhelper.mockServer.activateGenericMetadata();
			sap.apf.testhelper.mockServer.activateApf();
			var oInjectMetadata = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler: annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ODataModel : this.ODataModel
				}
			};
			var MetadataFactory = function() {
				var oMetadataInstances = new sap.apf.utils.Hashtable(that.oIfMessageHandler);
				var aServiceDocuments = [];
				this.getMetadata = function(sAbsolutePathToServiceDocument) {
					if (oMetadataInstances.hasItem(sAbsolutePathToServiceDocument) === false) {
						oMetadataInstances.setItem(sAbsolutePathToServiceDocument, {
							metadata : new sap.apf.core.Metadata(oInjectMetadata, sAbsolutePathToServiceDocument)
						});
					}
					return oMetadataInstances.getItem(sAbsolutePathToServiceDocument).metadata;
				};
				this.getServiceDocuments = function() {
					return aServiceDocuments;
				};
				this.setServiceDocuments = function(serviceDocuments) {
					aServiceDocuments = serviceDocuments;
				};
			};
			var oMetadataFactory = new MetadataFactory();
			oMetadataFactory.setServiceDocuments([ "/some/path/dummy.xsodata" ]);
			var oInjectMetadataFacade = {
				instances : { 
					messageHandler : this.oIfMessageHandler,
					metadataFactory : oMetadataFactory
				},
				constructors : {
					MetadataProperty : sap.apf.core.MetadataProperty
				}
			};
			this.oMetadataFacade = new sap.apf.core.MetadataFacade(oInjectMetadataFacade);
			var oMetadataFactoryWithTwoServiceDocuments = new MetadataFactory();
			oMetadataFactoryWithTwoServiceDocuments.setServiceDocuments([ "/some/path/dummy.xsodata", "/sap/hba/r/apf/core/odata/apf.xsodata" ]);
			var oInjectMetadataFacadeWithTwoServiceDocuments = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					metadataFactory : oMetadataFactoryWithTwoServiceDocuments
				},
				constructors : {
					MetadataProperty : sap.apf.core.MetadataProperty
				}
			};
			this.oMetadataFacadeWithTwoServiceDocuments = new sap.apf.core.MetadataFacade(oInjectMetadataFacadeWithTwoServiceDocuments);
			this.oMetadataFacadeWithServiceDocParam = new sap.apf.core.MetadataFacade(oInjectMetadataFacadeWithTwoServiceDocuments, "/sap/hba/r/apf/core/odata/apf.xsodata");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('Get all properties', function(assert) {
		assert.expect(1);
		var aExpectedResult = [ "GenID", "firstProperty", "secondProperty", "nonFilterableProperty", "P_FirstParameter", "P_SecondParameter", "PropertyOneForThird", "PropertyTwoForThird", "PropertyOneForFourth", "PropertyTwoForFourth" ];
		var callback = function(aAllProperties) {
			assert.deepEqual(aAllProperties, aExpectedResult, "All properties for all entity types of one service document returned");
		};
		this.oMetadataFacade.getAllProperties(callback);
	});
	QUnit.test('Get all parameter entity set key properties', function(assert) {
		assert.expect(1);
		var aExpectedParameterEntitySetKeyProperties = [ "P_FirstParameter", "P_SecondParameter" ];
		var callback = function(aAllParameterEntitySetKeyProperties) {
			assert.deepEqual(aAllParameterEntitySetKeyProperties, aExpectedParameterEntitySetKeyProperties, "All parameter entity set key properties received");
		};
		this.oMetadataFacade.getAllParameterEntitySetKeyProperties(callback);
	});
	QUnit.test('Get property returns correct property with attributes as MetadataProperty object', function(assert) {
		assert.expect(4);
		var callback = function(oProperty) {
			assert.equal(oProperty.getAttribute("name"), "firstProperty", 'Correct value for attribute name returned');
			assert.equal(oProperty.getAttribute("aggregation-role"), "dimension", 'Correct value for attribute aggregation-role returned');
			assert.equal(oProperty.getAttribute("type"), "Edm.String", 'Correct value for attribute type returned');
			assert.equal(oProperty.getAttribute("maxLength"), "3", 'Correct value for attribute maxLength returned');
		};
		this.oMetadataFacade.getProperty("firstProperty", callback);
	});
	QUnit.test('Get property annotation', function(assert) {
		assert.expect(2);
		var callback = function(oProperty) {
			assert.equal(oProperty.getAttribute("name"), "P_SecondParameter", 'Correct value for attribute name returned');
			assert.equal(oProperty.getAttribute("defaultValue"), "secondParamDefaultValue", 'Correct annotation attribute returned');
		};
		this.oMetadataFacade.getProperty("P_SecondParameter", callback);
	});
	QUnit.test('Check property for isParameterEntitySetKeyProperty()', function(assert) {
		assert.expect(2);
		var callbackParameterEntitySetKeyProperty = function(oProperty) {
			assert.ok(oProperty.isParameterEntitySetKeyProperty() === true, "isParameterEntitySetKeyProperty() returns true for a parameter key property");
		};
		var callbackProperty = function(oProperty) {
			assert.ok(oProperty.isParameterEntitySetKeyProperty() === false, "isParameterEntitySetKeyProperty() returns false for a non parameter key property");
		};
		this.oMetadataFacade.getProperty("P_FirstParameter", callbackParameterEntitySetKeyProperty);
		this.oMetadataFacade.getProperty("firstProperty", callbackProperty);
	});
	QUnit.test('Check property for isKey()', function(assert) {
		assert.expect(2);
		var callbackKeyProperty = function(oProperty) {
			assert.ok(oProperty.isKey() === true, "isKey() returns true for a key property");
		};
		var callbackProperty = function(oProperty) {
			assert.ok(oProperty.isKey() === false, "isParameterEntitySetKeyProperty() returns false for a non key property");
		};
		this.oMetadataFacade.getProperty("GenID", callbackKeyProperty);
		this.oMetadataFacade.getProperty("firstProperty", callbackProperty);
	});
	QUnit.test('Get properties from metadata facade with more then one service document', function(assert) {
		assert.expect(2);
		var callbackServiceDoc1 = function(oProperty) {
			assert.ok(oProperty.getAttribute("name") === "firstProperty", "Property from first service document returnend");
		};
		var callbackServiceDoc2 = function(oProperty) {
			assert.ok(oProperty.getAttribute("name") === "AnalysisPath", "Property from second service document returnend");
		};
		this.oMetadataFacadeWithTwoServiceDocuments.getProperty("firstProperty", callbackServiceDoc1);
		this.oMetadataFacadeWithTwoServiceDocuments.getProperty("AnalysisPath", callbackServiceDoc2);
	});
	QUnit.test('Create metadata facade instance with parameter for one service document', function(assert) {
		assert.expect(1);
		var callback = function(aPropertyNames) {
			assert.deepEqual(aPropertyNames, [ "SerializedAnalysisPath", "StructuredAnalysisPath", "GenID", "AnalysisPath", "AnalysisPathName", "LogicalSystem", "ApplicationConfigurationURL", "NumberOfAnalysisPaths", "AnalyticalConfiguration",
					"AnalyticalConfigurationName", "CreationUTCDateTime", "CreatedByUser", "LastChangedByUser", "SerializedAnalyticalConfiguration", "TextElement", "Language", "TextElementType", "TextElementDescription", "Application",
					"MaximumLength", "TranslationHint", "LastChangeUTCDateTime" ], "Only property names for the specified service document expected");
		};
		//Here a metadata facade is used, which has access to two different service documents, but is instantiated with a param for one service document
		this.oMetadataFacadeWithServiceDocParam.getAllProperties(callback);
	});
}());