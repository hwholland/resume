/* globals OData, jQuery, sap, QUnit */

jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfCoreApi");
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.testhelper.mockServer.wrapper");
jQuery.sap.require("sap.apf.core.utils.fileExists");
jQuery.sap.require("sap.apf.testhelper.createDefaultAnnotationHandler");

QUnit.config.reorder = false;

(function() {
	'use strict';

	QUnit.module('Basic functionality', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGenericMetadata();
			sap.apf.testhelper.mockServer.activateModeler();
			var oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler : annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.metadataForAnalyticalConfig = new sap.apf.core.Metadata(oInject, "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata");
			this.oMetadata = new sap.apf.core.Metadata(oInject, "/some/path/dummy.xsodata");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('getPropertyMetadata() by name and entity set, test attributes', function(assert) {
		var expected = {
			"aggregation-role" : "dimension",
			dataType : {
				type : "Edm.String",
				maxLength : "3"
			},
			"name" : "firstProperty"
		};
		var result = this.oMetadata.getPropertyMetadata("firstEntityQueryResults", "firstProperty");
		assert.deepEqual(result.dataType, expected.dataType, 'required metadata: dataType ');
		assert.deepEqual(result.name, expected.name, 'required metadata: name');
		assert.deepEqual(result["aggregation-role"], expected["aggregation-role"], 'required metadata: aggregation-role');
	});
	QUnit.test('getParameterEntitySetKeyProperties()throws when parameter missing', function(assert) {
		var thisTest = this;
		assert.throws(function() {
			thisTest.oMetadata.getParameterEntitySetKeyProperties();
		}, "Error successfully thrown due to missing argument for getParameterEntitySetKeyProperties");
	});
	QUnit.test('getParameterEntitySetKeyProperties(), test attributes', function(assert) {
		var expected = {
			"dataType" : {
				"maxLength" : "5",
				"type" : "Edm.String"
			},
			"defaultValue" : "secondParamDefaultValue",
			"name" : "P_SecondParameter",
			"nullable" : "false",
			isKey : true
		};
		var result = this.oMetadata.getParameterEntitySetKeyProperties("firstEntityQuery");
		assert.deepEqual(result.length, 1, 'One view parameter');
		assert.deepEqual(result[0].name, expected.name, 'name');
		assert.strictEqual(result[0].isKey, true, 'One key parameter with its attributes');
		assert.strictEqual(result[0].nullable, "false", 'One key parameter with its attributes');
		assert.strictEqual(result[0].defaultValue, "secondParamDefaultValue", 'One key parameter with its attributes');
	});
	QUnit.test('getFilterableProperties() of entity type', function(assert) {
		assert.deepEqual(this.oMetadata.getFilterableProperties("firstEntityQuery"), [ "firstProperty" ], '1 filterable properties expected');
	});
	QUnit.test('getFilterableProperties() of entity type without aggregation semantics', function(assert) {
		assert.deepEqual(this.oMetadata.getFilterableProperties("fourthEntityWithoutSapSemantics"),
			[ "PropertyOneForFourth", "PropertyTwoForFourth"  ], '2 filterable properties');
	});
	QUnit.test('getAllKeys()', function(assert) {
		var aExpectedKeys = [ "GenID", "P_FirstParameter", "P_SecondParameter", "PropertyOneForThird", "PropertyOneForFourth" ];
		assert.deepEqual(this.oMetadata.getAllKeys(), aExpectedKeys, "All keys of all EntityTypes");
	});
	QUnit.test('getAttributes() by a property name', function(assert) {
		var oExpectedProperty = {
			"aggregation-role" : "dimension",
			dataType : {
				type : "Edm.String",
				maxLength : "3"
			},
			"name" : "firstProperty"
		};
		var oExpectedParameter = {
			"dataType" : {
				"type" : "Edm.Int32"
			},
			"name" : "P_FirstParameter",
			"nullable" : "false",
			"parameter" : "mandatory"
		};
		var first = this.oMetadata.getAttributes("firstProperty");
		assert.deepEqual(first.dataType, oExpectedProperty.dataType, 'required metadata: dataType ');
		assert.deepEqual(first.name, oExpectedProperty.name, 'required metadata: name');
		assert.deepEqual(first["aggregation-role"], oExpectedProperty["aggregation-role"], 'required metadata: aggregation-role');

		var second = this.oMetadata.getAttributes("P_FirstParameter");
		assert.deepEqual(second.dataType, oExpectedParameter.dataType, 'required metadata: dataType ');
		assert.deepEqual(second.name, oExpectedParameter.name, 'required metadata: name');
		assert.deepEqual(second["aggregation-role"], oExpectedParameter["aggregation-role"], 'required metadata: aggregation-role');
		assert.deepEqual(second.nullable, oExpectedParameter.nullable, 'required metadata: nullable');
		assert.deepEqual(second.parameter, oExpectedParameter.parameter, 'required metadata: parameter');
	});
	QUnit.test('getParameterEntitySetKeyPropertiesForService()', function(assert) {
		var aExpecteParameterEntitySetKeyProperties = [ "P_FirstParameter", "P_SecondParameter" ];
		assert.deepEqual(this.oMetadata.getParameterEntitySetKeyPropertiesForService(), aExpecteParameterEntitySetKeyProperties, 'All parameter entity set key properties received');
	});
	QUnit.test('getEntityTypes()', function(assert) {
		var aExpectedEntityTypes = [
		                            "firstEntityQueryResultsType",
		                            "firstEntityQueryType",
		                            "secondEntityQueryResultsType",
		                            "secondEntityQueryType",
		                            "thirdEntityDirectlyAddressableQueryResultsType",
		                            "fourthEntityWithoutSapSemanticsType"
		                          ];
		assert.deepEqual(this.oMetadata.getEntityTypes(), aExpectedEntityTypes, 'All entity types received');
	});
	QUnit.test('getEntitySets()', function(assert) {
		var aExpectedEntitySets = [ "firstEntityQuery", "secondEntityQuery", "thirdEntityDirectlyAddressableQueryResults", "fourthEntityWithoutSapSemantics" ];
		assert.deepEqual(this.oMetadata.getEntitySets(), aExpectedEntitySets, 'All entity sets received');
	});
	QUnit.test('getEntityTypeAnnotations()', function(assert) {
		var oExpected = {
			"requiresFilter" : "true",
			"requiredProperties" : "SAPClient"
		};
		assert.deepEqual(this.oMetadata.getEntityTypeAnnotations("secondEntityQueryResultsType"), oExpected, 'Entity type annotations returned as expected for second entity type');
		oExpected.requiredProperties = "firstProperty";
		assert.deepEqual(this.oMetadata.getEntityTypeAnnotations("firstEntityQueryResultsType"), oExpected, 'Entity type annotations returned as expected for first entity type');
	});
	QUnit.test('WHEN getEntityTypeAnnotations() AND no annotations exists', function(assert){
		assert.deepEqual(this.metadataForAnalyticalConfig.getEntityTypeAnnotations("AnalyticalConfigurationQueryResults"), {}, "THEN empty object is returned");
	});
	QUnit.test('getUriComponents(sEntitySet) - Valid use cases', function(assert) {
		var expected, result;
		expected = {
			entitySet : "thirdEntityDirectlyAddressableQueryResults",
			navigationProperty : ""
		};
		result = this.oMetadata.getUriComponents("thirdEntityDirectlyAddressableQuery");
		assert.deepEqual(result, expected, "Not existing <name> is patched to existing <name>Results with no navigation property");
		expected = {
			entitySet : "fourthEntityWithoutSapSemantics",
			navigationProperty : ""
		};
		result = this.oMetadata.getUriComponents("fourthEntityWithoutSapSemantics");
		assert.deepEqual(result, expected, "The name for an existing entity set without sap semantics is returned unchanged without navigation property");
		expected = {
			entitySet : "firstEntityQuery",
			navigationProperty : "Results"
		};
		result = this.oMetadata.getUriComponents("firstEntityQuery");
		assert.deepEqual(result, expected, "The name for an existing parameter entity set is returned unchanged with the right navigation property");
		expected = {
			entitySet : "secondEntityQuery",
			navigationProperty : "ResultsSecond"
		};
		result = this.oMetadata.getUriComponents("secondEntityQueryResults");
		assert.deepEqual(result, expected, "An aggregate entity set is mapped to the corresponding parameter entity set with the right navigation property");
	});
	QUnit.test('getUriComponents(sEntitySet) - Not resolvable use cases', function(assert) {
		var expected, result;
		result = this.oMetadata.getUriComponents("notExistingEntitySet");
		assert.deepEqual(result, null, "Not existing <name> and <name>Results delivers result 'null' ");
		expected = {
			entitySet : "secondEntityQuery",
			navigationProperty : undefined
		};
		result = this.oMetadata.getUriComponents("secondEntityQuery");
		assert.deepEqual(result, expected, "Not unique association from an existing parameter entity set delivers undefined as navigation property");
		expected = {
			entitySet : undefined,
			navigationProperty : undefined
		};
		result = this.oMetadata.getUriComponents("firstEntityQueryResults");
		assert.deepEqual(result, expected, "Not unique association to an aggregate entity set delivers entity set and undefined as navigation property");
	});
	QUnit.test('getFilterablePropertiesAndParameters()', function (assert) {
		var expected = ["firstProperty", "secondProperty", "P_FirstParameter", "P_SecondParameter"];
		var result = this.oMetadata.getFilterablePropertiesAndParameters();
		assert.deepEqual(result, expected, 'Only filterable properties and parameters returned. Criteria is sap:aggregation-role=dimension AND sap:filterable!=false OR parameter');
	});
	QUnit.module('Metadata for Entity Sets without aggregation semantics', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGatewayWithEntitySetWithOutAggretation();
			var oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler : annotationHandler
				},
				constructors  : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.metadata = new sap.apf.core.Metadata(oInject, "/cds/ZI_ANA_FLIGHT_CDS");
		},
		afterEach : function() {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('WHEN entity set without semantics of aggregate or parameters is called', function(assert) {
		var entitySets = this.metadata.getEntitySets();
		var expectedEntitySets = [ "ZI_ANA_Flight" ];
		var expectedProperties = [ "AirlineCode", "FlightConnectionNumber", "FlightDate" ];
		assert.deepEqual(entitySets, expectedEntitySets, "THEN correct entity set is returned");
		assert.deepEqual(this.metadata.getAllPropertiesOfEntitySet("ZI_ANA_Flight"), expectedProperties, "THEN all properties of special entity set are detected");
		assert.deepEqual(this.metadata.getAllProperties(), expectedProperties, "THEN all properties of all entity sets are detected");
	});
	QUnit.module('Metadata  without annotation', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck();
			this.oIfMessageHandler.spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateGenericMetadataWithoutAnnotations();
			this.oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler : annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ODataModel : this.ODataModel
				}
			};
			this.oMetadata = new sap.apf.core.Metadata(this.oInject, "/some/path/dummy.xsodata");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test('getPropertyMetadata() by property name and entity set', function(assert) {
		assert.equal(this.oIfMessageHandler.spyResults.putMessage, undefined, "no Error thrown. ");
		var expected = {
			"aggregation-role" : "dimension",
			"dataType" : {
				"maxLength" : "3",
				"type" : "Edm.String"
			},
			"name" : "firstProperty"
		};
		var result = this.oMetadata.getPropertyMetadata("firstEntityQueryResults", "firstProperty");
		assert.deepEqual(result.dataType, expected.dataType, 'required metadata: dataType ');
		assert.deepEqual(result.name, expected.name, 'required metadata: name');
		assert.deepEqual(result["aggregation-role"], expected["aggregation-role"], 'required metadata: aggregation-role');
	});
	QUnit.test('Get filterable properties', function(assert) {
		assert.deepEqual(this.oMetadata.getFilterableProperties("firstEntityQueryResultsType"), [ "firstProperty" ], 'Filterable properties without annotation expected');
	});
	QUnit.test('getParameterEntitySetKeyProperties() by entity type', function(assert) {
		var first = {
			"dataType" : {
				"type" : "Edm.Int32"
			},
			"name" : "P_FirstParameter",
			"nullable" : "false",
			"parameter" : "mandatory",
			isKey : true
		};
		var second = {
			"dataType" : {
				"maxLength" : "5",
				"type" : "Edm.String"
			},
			"name" : "P_SecondParameter",
			"nullable" : "false",
			isKey : true
		};
		var result = this.oMetadata.getParameterEntitySetKeyProperties("secondEntityQueryType");
		assert.deepEqual(result[0].dataType, first.dataType, 'required metadata: dataType ');
		assert.deepEqual(result[0].name, first.name, 'required metadata: name');
		assert.deepEqual(result[0]["aggregation-role"], first["aggregation-role"], 'required metadata: aggregation-role');
		assert.deepEqual(result[0].isKey, true, 'required metadata: isKey');
		assert.deepEqual(result[0].parameter, first.parameter, 'required metadata: parameter');
		assert.deepEqual(result[0].nullable, first.nullable, 'required metadata: nullable');

		assert.deepEqual(result[1].dataType, second.dataType, 'required metadata: dataType ');
		assert.deepEqual(result[1].name, second.name, 'required metadata: name');
		assert.deepEqual(result[1]["aggregation-role"], second["aggregation-role"], 'required metadata: aggregation-role');
		assert.deepEqual(result[1].isKey, true, 'required metadata: isKey');
		assert.deepEqual(result[1].nullable, second.nullable, 'required metadata: nullable');
	});
	QUnit.test('Invalid service puts message with fatal error', function(assert) {
		this.oMetadata = new sap.apf.core.Metadata(this.oInject, "invalidService");
		assert.equal(this.oIfMessageHandler.spyResults.putMessage.code, 5018, "Fatal error thrown");
	});
	QUnit.test('Invalid service from Modeler puts message with technical error', function(assert) {
		this.oInject.deactivateFatalError = true;
		var metadata = new sap.apf.core.Metadata(this.oInject, "invalidService");
		assert.equal(metadata.failed, true, "Metadata object indicates error during initialization");
		assert.equal(this.oIfMessageHandler.spyResults.putMessage.code, 11013, "Technical error thrown");
	});
	/*
	QUnit.module('Metadata for gateway service root', {
	beforeEach : function() {

			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();

			var oMessageHandler = this.oIfMessageHandler;
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.coreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};

		var oInject = {
				messageHandler : this.oIfMessageHandler,
				coreApi : this.coreApi
				ODataModel : this.ODataModel,
				hashtable : sap.apf.utils.Hashtable
			};
			this.metadata = new sap.apf.core.Metadata(oInject, "/sap/opu/odata/sap/ZJH_4APF_005_SRV"); 
		
		},
	afterEach : function() {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});

	QUnit.test('Handle Gateway Service', function() {

	    var entitySets = this.metadata.getEntitySets();
		var expectedEntitySets = [ "ZJH_4APF_0053Results"];
	assert.deepEqual(entitySets, expectedEntitySets, "correct entity sets returned");
			
	});
	*/
	QUnit.module('Metadata for Navigation from Parameter entity set to results set', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateMmMetadata();
			var oInject = {
				instances  : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler: annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.oMetadata = new sap.apf.core.Metadata(oInject, "/sap/mm/ZAPF_Q002_SRV");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test("WHEN get entity set is called", function(assert) {
		var entitySets = this.oMetadata.getEntitySets();
		var expectedEntitySets = [ "ZAPF_Q002", "D_SUSD_CURR" ];
		assert.deepEqual(entitySets, expectedEntitySets, "THEN entity sets are discovered");
		var uriComponents = this.oMetadata.getUriComponents("ZAPF_Q002");
		assert.equal(uriComponents.navigationProperty, "Results", "THEN the navigation property is discovered");
	});

	QUnit.module('Errorhandling for empty Metadata document', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			var annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
			sap.apf.testhelper.mockServer.activateEmptyMetadata();
			var oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler: annotationHandler
				},
				constructors  : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.oMetadata = new sap.apf.core.Metadata(oInject, "/sap/empty/empty.xsodata");
		},
		afterEach : function(assert) {
			sap.apf.testhelper.mockServer.deactivate();
		}
	});
	QUnit.test("WHEN get entity set is called", function(assert) {
		var entitySets = this.oMetadata.getEntitySets();
		var expectedEntitySets = [];
		assert.deepEqual(entitySets, expectedEntitySets, "THEN no entity sets are discovered");
		var messageObject = this.oIfMessageHandler.spyResults.putMessage;
		assert.equal(messageObject.code, "5041", "THEN error message was emitted");
	});
	QUnit.module('Annotation file handling', {
		beforeEach : function(assert) {
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
		}
	});
	QUnit.test("Test, whether annotations from annotation handler are taken over", function(assert) {
		var annotationHandler = {
				getAnnotationsForService : function(serviceRoot) {
					return [ "annotation1.xml, annotation2.xml"];
				}
		};

		var OdataModelSpy = function(sAbsolutePathToServiceDocument, parameterSet){

			assert.equal(sAbsolutePathToServiceDocument, "/some/path/to/service/empty.xsodata", "THEN service path is handed over");
			assert.deepEqual(parameterSet.annotationURI, [ "annotation1.xml, annotation2.xml"], "THEN annotations are handed over correctly" );
			assert.equal(parameterSet.json, true, "JSON format is requested");

			this.getODataEntityContainer = function() {
				return undefined;
			};
			this.getServiceMetadata = function() {
				return undefined;
			};
		};
		var oInject = {
			instances : {
				messageHandler : this.oIfMessageHandler,
				coreApi : this.coreApi,
				annotationHandler: annotationHandler
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable,
				ODataModel : OdataModelSpy
			}
		};
		var metadata = new sap.apf.core.Metadata(oInject, "/some/path/to/service/empty.xsodata");
		assert.ok(metadata);
	});

	QUnit.module('annotation name mapping', {
		beforeEach : function(assert) {
			var that = this;
			this.propertyObject = {};
			var annotationHandler = {
				getAnnotationsForService : function() {
					return [ "annotationX4711.xml"];
				}
			};
			var metaModel = {
				getODataEntityContainer : function() {
					return {
						entitySet: [
							{
								entityType: "sap.hugo",
								name: "hugoResults"
							}
						] // serves initializeEntityTypeOfEntitySetsAndAllEntityTypes()
					};
				},
				getODataEntityType: function () {
					return undefined;
				},
				getODataProperty: function(entityType, sPropertyName) {
					return that.propertyObject;
				}
			};
			var OdataModelStub = function(sAbsolutePathToServiceDocument, parameterSet){
				this.getServiceMetadata = function() {
					return true;
				};
				this.getServiceAnnotations = function () {
					return undefined;
				};
				this.getMetaModel = function() {
					return metaModel;
				};
			};
			this.oIfMessageHandler = new sap.apf.testhelper.doubles.MessageHandler();
			this.oIfMessageHandler.raiseOnCheck().spyPutMessage();
			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.oInject = {
				instances : {
					messageHandler : this.oIfMessageHandler,
					coreApi : this.coreApi,
					annotationHandler: annotationHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ODataModel : OdataModelStub
				}
			};
			this.metadata = new sap.apf.core.Metadata(this.oInject, "/some/path/to/service/empty.xsodata");
		}
	});
	QUnit.test("getAttributes() case: plain name", function(assert) {
		this.propertyObject = { mimi: 1};
		var result = this.metadata.getAttributes("otto");
		assert.strictEqual(result.mimi, 1, "plain member remains");
	});
	QUnit.test("getAttributes() case: fancy name", function(assert) {
		this.propertyObject = { "sap:": 1};
		var result = this.metadata.getAttributes("otto");
		assert.strictEqual(result["sap:"], 1, "fancy member remains");
	});
	QUnit.test("getAttributes() case: name prefix 'sap:'", function(assert) {
		this.propertyObject = { "sap:mimi": 1};
		var result = this.metadata.getAttributes("otto");
		assert.strictEqual(result["sap:mimi"], 1, "member not deleted");
		assert.strictEqual(result.mimi, undefined, "not converted");
		assert.strictEqual(result.sap, undefined, "not converted");
	});
	QUnit.test("getAttributes() case: name prefix", function(assert) {
		this.propertyObject = { "namespace.mimi": 123};
		var result = this.metadata.getAttributes("otto");
		assert.strictEqual(result["namespace.mimi"], 123, "member not deleted");
		assert.strictEqual(result.mimi, 123, "member created");
	});
	QUnit.test("getAttributes() case: name's first letter uppercase converted to lowercase", function(assert) {
		this.propertyObject = { "Mimi.X": 123};
		var result = this.metadata.getAttributes("otto");
		assert.strictEqual(result["Mimi.X"], 123, "member not deleted");
		assert.strictEqual(result.x, 123, "member created");
	});
	QUnit.test("getAttributes() case: ISO first letter not converted to lowercase", function(assert) {
		this.propertyObject = { "Mimi.ISO": 123};
		var result = this.metadata.getAttributes("otto");
		assert.strictEqual(result["Mimi.ISO"], 123, "member not deleted");
		assert.strictEqual(result.ISO, 123, "new member but name not converted");
	});
	QUnit.test("getAttributes() case: name value pair", function(assert) {
		this.propertyObject = { "extensions": [ {
			name: "mara",
			value: "bam"
		}]};
		var result = this.metadata.getAttributes("otto");
		assert.deepEqual(result.extensions, this.propertyObject.extensions, "member not deleted");
		assert.strictEqual(result.mara, "bam", "member created");
	});
	QUnit.test("getAttributes() case: type", function(assert) {
		this.propertyObject = { type: 1};
		var result = this.metadata.getAttributes("otto");
		assert.strictEqual(result.type, 1, "member not deleted");
		assert.strictEqual(result.dataType.type, 1, "goes to sub-object dataType");
	});
	QUnit.test("getAttributes() case: maxLength", function(assert) {
		this.propertyObject = { maxLength: 1};
		var result = this.metadata.getAttributes("otto");
		assert.strictEqual(result.maxLength, 1, "member not deleted");
		assert.strictEqual(result.dataType.maxLength, 1, "goes to sub-object dataType");
	});
	QUnit.test("getAttributes() case: precision", function(assert) {
		this.propertyObject = { precision: 1};
		var result = this.metadata.getAttributes("otto");
		assert.strictEqual(result.precision, 1, "member not deleted");
		assert.strictEqual(result.dataType.precision, 1, "goes to sub-object dataType");
	});

}());