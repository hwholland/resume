/*global dudespace:true, QUnit, sap, jQuery */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.utils.filter');
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	//'use strict'; // would fail the delete dudespace on Browser!
	sap.apf.testhelper.injectURLParameters({
		"SAPClient" : "777",
		"Customer" : "10123"
	});
	QUnit.module('Miscellaneous helpers', {
		beforeEach : function(assert) {
			this.oMsgHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		}
	});
	QUnit.test("Elimination of duplicates in array", function(assert) {
		var aToCheck = [ 1, 2, 3, 3, 4, 5, "abc", "def", "abc" ];
		var aResult = sap.apf.utils.eliminateDuplicatesInArray(this.oMsgHandler, aToCheck);
		assert.deepEqual(aResult, [ 1, 2, 3, 4, 5, "def", "abc" ], "function eliminateDuplicatesInArray is working correctly");
	});
	QUnit.test("HashCode testing", function(assert) {
		assert.equal(sap.apf.utils.hashCode("klaus"), 9497488, "function hashCode returns a correct hash value");
		assert.equal(sap.apf.utils.hashCode('klaus'), 9497488, "function hashCode returns a correct hash value twice");
		assert.notEqual(sap.apf.utils.hashCode("klaus"), sap.apf.utils.hashCode('klaus1'), "function hashCode returns different hash values for different input values");
	});
	QUnit.test("URI parameter retrieval", function(assert) {
		var oUriParameters = sap.apf.utils.getUriParameters();
		assert.equal(oUriParameters.SAPClient, "777", "Parameter SAPClient was handed over in URI with value 777");
		assert.equal(oUriParameters.Customer, "10123", "Parameter Customer was handed over in URI with value 10123");
	});
	QUnit.test("OData string escaping", function(assert) {
		assert.equal(sap.apf.utils.escapeOdata('Tom\'s tom'), 'Tom\'\'s tom', 'Replacement of \' by \'\' expected');
	});
	QUnit.test("Odata formating values of different types", function(assert) {
		assert.equal(sap.apf.utils.formatValue(null, ""), "null", "Null returned as convention");
		assert.equal(sap.apf.utils.formatValue("today", "Edm.String"), "'today'", "String formated according OData conventions");
		assert.equal(sap.apf.utils.formatValue("Tom\'s tom", "Edm.String"), "'Tom\'\'s tom'", "Correct escaping of string Replacement of \' by \'\' expected");
		assert.equal(sap.apf.utils.formatValue("1963", "Edm.Int32"), "1963", "Int32 formated according OData conventions");
		assert.equal(sap.apf.utils.formatValue(1963, "Edm.Int64"), "1963L", "Int 64 formated according OData conventions");
		assert.equal(sap.apf.utils.formatValue('101', "Edm.Binary"), "binary'101'", "Binary formated according OData conventions");
		assert.equal(sap.apf.utils.formatValue(2.3, "Edm.Single"), "2.3f", "Single formated according OData conventions");
		assert.equal(sap.apf.utils.formatValue(2.345, "Edm.Decimal"), "2.345M", "Decimal formated according OData conventions");
		assert.equal(sap.apf.utils.formatValue('12345678-aaaa-bbbb-cccc-ddddeeeeffff', "Edm.Guid"), "guid'12345678-aaaa-bbbb-cccc-ddddeeeeffff'", "Guid formated according OData conventions");
		assert.equal(sap.apf.utils.formatValue("13:20:00", "Edm.Time"), "time'13:20:00'", "Time formated  from String according OData conventions");
		assert.equal(sap.apf.utils.formatValue(39600000, "Edm.Time"), "time'11:00:00'", "Time formated  from number according OData conventions");
		assert.equal(sap.apf.utils.formatValue(40149000, "Edm.Time"), "time'11:09:09'", "Time formated  from number according OData conventions with padding of leading zeroes");
		var sFormatedValue = sap.apf.utils.formatValue("1995-12-17T03:24:00", "Edm.DateTime");
		assert.equal(sFormatedValue.search("datetime'1995-12-17T") > -1, true, "DateTime formated according OData conventions");
		sFormatedValue = sap.apf.utils.formatValue("2002-10-10T17:00:00", "Edm.DateTimeOffset");
		assert.equal(sFormatedValue.search("datetimeoffset'2002-10-10T") > -1, true, "DateTimeOffset formated according OData conventions");
		sFormatedValue = sap.apf.utils.formatValue("/Date(1402876800000)/", "Edm.DateTime");
		assert.equal(sFormatedValue.search("datetime'2014-06-16T00:00:00'") > -1, true, "DateTime from json format formated according OData conventions");
		sFormatedValue = sap.apf.utils.formatValue(new Date("2002-10-10T17:00:00"), "Edm.DateTime");
		assert.equal(sFormatedValue.search("datetime'2002-10-10T") > -1, true, "DateTime with date object formated according OData conventions");
	});
	QUnit.test("JSON format to Javascript", function(assert) {
		assert.equal(sap.apf.utils.json2javascriptFormat("/Date(1402876800000)/", "Edm.DateTime").valueOf(), new Date(1402876800000).valueOf(), "DateTime Format converted properly");
		assert.equal(sap.apf.utils.json2javascriptFormat("a String", "Edm.String"), "a String", "String Format converted properly");
		assert.equal(sap.apf.utils.json2javascriptFormat("true", "Edm.Boolean"), true, "Boolean Format converted properly");
		assert.equal(sap.apf.utils.json2javascriptFormat("32", "Edm.Int32"), 32, "Integer Format converted properly 1");
		assert.equal(sap.apf.utils.json2javascriptFormat(32, "Edm.Int32"), 32, "Integer Format converted properly 1");
		assert.equal(sap.apf.utils.json2javascriptFormat("32.32", "Edm.Float"), 32.32, "Float Format converted properly 2");
		assert.equal(sap.apf.utils.json2javascriptFormat(32.32, "Edm.Float"), 32.32, "Float Format converted properly 2");
	});
	QUnit.test("Is valid GUID", function(assert) {
		assert.ok(sap.apf.utils.isValidGuid("01234567890123456789012345678901"), "01234567890123456789012345678901 is a valid GUID");
		assert.ok(sap.apf.utils.isValidGuid("ABCDEF67890123456789012345678901"), "ABCDEF67890123456789012345678901 is a valid GUID");
		assert.ok(!sap.apf.utils.isValidGuid("0123456789012345678901234567890"), "0123456789012345678901234567890 is not a valid GUID");
		assert.ok(!sap.apf.utils.isValidGuid("012345678901234567890123456789012"), "012345678901234567890123456789012 is not a valid GUID");
	});
	QUnit.test("Is valid Psuedo GUID", function(assert) {
		assert.ok(sap.apf.utils.isValidPseudoGuid("01234567890123456789012345678901"), "01234567890123456789012345678901 is a valid GUID");
		assert.ok(sap.apf.utils.isValidPseudoGuid("ABCDEF67890123456789012345678901"), "ABCDEF67890123456789012345678901 is a valid GUID");
		assert.ok(!sap.apf.utils.isValidPseudoGuid("0123456789012345678901234567890"), "0123456789012345678901234567890 is no valid GUID");
		assert.ok(!sap.apf.utils.isValidPseudoGuid("012345678901234567890123456789012"), "012345678901234567890123456789012 is no valid GUID");
	});
	QUnit.test("create pseudo guid", function(assert) {
		assert.equal(sap.apf.utils.createPseudoGuid().length, 32, "Psuedo GUID is correct length");
		assert.notDeepEqual(sap.apf.utils.createPseudoGuid(), sap.apf.utils.createPseudoGuid(), "Psuedo GUID is unique");
		assert.ok(sap.apf.utils.isValidPseudoGuid(sap.apf.utils.createPseudoGuid()), "Psuedo GUID is valid");
	});
	QUnit.test('GIVEN an old configuration with categories attribute for steps', function(assert) {
		var inject = {
			constructors : {
				Hashtable : sap.apf.utils.Hashtable
			},
			instances : {
				messageHandler : new sap.apf.core.MessageHandler()
			}
		};
		var oldConfig = {
			steps : [ {
				type : "step",
				id : "stepId-1",
				categories : [ {
					type : "category",
					id : "categoryId-1"
				}, {
					type : "category",
					id : "categoryId-2"
				} ]
			}, {
				type : "step",
				id : "stepId-2",
				categories : [ {
					type : "category",
					id : "categoryId-1"
				} ]
			}, {
				type : "step",
				id : "stepId-3",
				categories : [ {
					type : "category",
					id : "categoryId-2"
				} ]
			}, {
				type : "step",
				id : "stepId-4",
				categories : []
			} ],
			categories : [ {
				type : "category",
				id : "categoryId-1"
			}, {
				type : "category",
				id : "categoryId-2"
			} ]
		};
		var migratedConfig = {
			steps : [ {
				type : "step",
				id : "stepId-1"
			}, {
				type : "step",
				id : "stepId-2"
			}, {
				type : "step",
				id : "stepId-3"
			}, {
				type : "step",
				id : "stepId-4"
			} ],
			categories : [ {
				type : "category",
				id : "categoryId-1",
				steps : [ {
					type : "step",
					id : "stepId-1"
				}, {
					type : "step",
					id : "stepId-2"
				} ]
			}, {
				type : "category",
				id : "categoryId-2",
				steps : [ {
					type : "step",
					id : "stepId-1"
				}, {
					type : "step",
					id : "stepId-3"
				} ]
			} ]
		};
		sap.apf.utils.migrateConfigToCategoryStepAssignment(oldConfig, inject);
		assert.deepEqual(oldConfig, migratedConfig, "WHEN migrateConfigToCategoryStepAssignment the old configuration is migrated as expected");
	});
	QUnit.test('GIVEN an new (migrated) configuration with steps attribute for categories', function(assert) {
		var inject = {
			constructors : {
				Hashtable : sap.apf.utils.Hashtable
			},
			instances : {
				messageHandler : new sap.apf.core.MessageHandler()
			}
		};
		var migratedConfig = {
			steps : [ {
				type : "step",
				id : "stepId-1"
			}, {
				type : "step",
				id : "stepId-2"
			}, {
				type : "step",
				id : "stepId-3"
			}, {
				type : "step",
				id : "stepId-4"
			} ],
			categories : [ {
				type : "category",
				id : "categoryId-1",
				steps : [ "stepId-1", "stepId-2" ]
			}, {
				type : "category",
				id : "categoryId-2",
				steps : [ "stepId-1", "stepId-3" ]
			} ]
		};
		var expected = jQuery.extend(true, {}, migratedConfig);
		sap.apf.utils.migrateConfigToCategoryStepAssignment(migratedConfig, inject);
		assert.deepEqual(migratedConfig, expected, "WHEN migrateConfigToCategoryStepAssignment nothing is changed in a new configuration");
	});
	QUnit.module('extractFunctionFromModulePathString - Dynamic instantiation', {
		beforeEach : function(assert) {
			dudespace = {};
			dudespace.moduleOne = {};
			dudespace.moduleOne.moduleTwo = {};
			this.Constructor = function() {
				return null;
			};
		}
	});
	QUnit.test('Constructor function declared in single level namespace', function(assert) {
		var oConstructor;
		dudespace.IAmInNamespace = this.Constructor;
		oConstructor = sap.apf.utils.extractFunctionFromModulePathString('dudespace.IAmInNamespace');
		assert.deepEqual(oConstructor, dudespace.IAmInNamespace, 'Receive constructor of function declared in singel level namespace');
	});
	QUnit.test('Constructor function declared in multi level namespace', function(assert) {
		var oConstructor;
		dudespace.moduleOne.moduleTwo.IAmDeepInNamespace = this.Constructor;
		oConstructor = sap.apf.utils.extractFunctionFromModulePathString('dudespace.moduleOne.moduleTwo.IAmDeepInNamespace');
		assert.deepEqual(oConstructor, dudespace.moduleOne.moduleTwo.IAmDeepInNamespace, 'Receive constructor of function declared in multi level namespace');
	});
	QUnit.test('Calling "extractFunctionFromModulePathString" with constructor function', function(assert) {
		var oInstance = sap.apf.utils.extractFunctionFromModulePathString(this.Constructor);
		assert.equal(jQuery.isFunction(oInstance), true, "instance");
	});
	QUnit.test('Terminate on undefined property in module path', function(assert) {
		var result = sap.apf.utils.extractFunctionFromModulePathString('dudespace.not.existing');
		assert.equal(result, undefined, "If module path is invalid, then abort without error");
	});
	QUnit.module('FilterMapping', {
		beforeEach : function(assert) {
			var that = this;
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.spySendGetInBatch = undefined;
			this.letRequestFail = false;
			this.oMappingRequest = {
				sendGetInBatch : function(oFilter, fnCallback, oRequestOptions) {
					if (typeof (that.spySendGetInBatch) === "function") {
						//callback for checking oFilter and oConfig in test
						that.spySendGetInBatch(oFilter);
					}
					if (that.letRequestFail) {
						fnCallback(new sap.apf.core.MessageObject({
							code : "5001"
						}));
						return;
					}
					var oResponse = {
						data : [ {
							targetProperty1 : "A",
							targetProperty2 : "B"
						}, {
							targetProperty1 : "C",
							targetProperty2 : "D"
						} ]
					};
					fnCallback(oResponse);
				}
			};
			jQuery.extend(this, sap.apf.utils.Filter.getOperators());
			this.oInputFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, "property1", this.EQ, "A");
		}
	});
	QUnit.test('WHEN executeFilterMapping THEN the mapping request is called with the right filter', function(assert) {
		assert.expect(1);
		var expectedUrlParam = this.oInputFilter.toUrlParam();
		this.spySendGetInBatch = function(oFilter) {
			assert.equal(oFilter.toUrlParam(), expectedUrlParam, "the expected filter is used for the mapping request");
		};
		sap.apf.utils.executeFilterMapping(this.oInputFilter, this.oMappingRequest, [], function() {
			return null;
		}, this.oMessageHandler); //CUT
	});
	QUnit.test('WHEN executeFilterMapping with failing mapping request THEN the error is logged and returned', function(assert) {
		assert.expect(2);
		var that = this;
		this.letRequestFail = true;
		function fnCallback(oMappedFilter, oMessageObject) {
			assert.ok(oMessageObject, "a message object is returned");
			assert.equal(that.oMessageHandler.spyResults.putMessage.getCode(), "5001", "The error from the failed filter mapping request is logged");
		}
		sap.apf.utils.executeFilterMapping(this.oInputFilter, this.oMappingRequest, [], fnCallback, this.oMessageHandler);
	});
	QUnit.test('WHEN executeFilterMapping with one target property and succeeding mapping request THEN the right result filter is returned', function(assert) {
		assert.expect(2);
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oExpectedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addOr(oFilter2);
		function fnCallback(oMappedFilter, oMessageObject) {
			assert.ok(!oMessageObject, "no message object is returned");
			assert.equal(oMappedFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "the right filter is returned to the callback from executeFilterMapping");
		}
		sap.apf.utils.executeFilterMapping(this.oInputFilter, this.oMappingRequest, [ "targetProperty1" ], fnCallback, this.oMessageHandler); //CUT
	});
	QUnit.test('WHEN executeFilterMapping with with two target properties and succeeding mapping request THEN the right result filter is returned', function(assert) {
		assert.expect(2);
		var oFilter1 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "A");
		var oFilter2 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "B");
		var oFilter3 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty1", this.EQ, "C");
		var oFilter4 = new sap.apf.core.utils.Filter(this.oMessageHandler, "targetProperty2", this.EQ, "D");
		var oFilterAnd1 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter1).addAnd(oFilter2);
		var oFilterAnd2 = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilter3).addAnd(oFilter4);
		var oExpectedFilter = new sap.apf.core.utils.Filter(this.oMessageHandler, oFilterAnd1).addOr(oFilterAnd2);
		function fnCallback(oMappedFilter, oMessageObject) {
			assert.ok(!oMessageObject, "no message object is returned");
			assert.equal(oMappedFilter.toUrlParam(), oExpectedFilter.toUrlParam(), "the right filter is returned to the callback from executeFilterMapping");
		}
		sap.apf.utils.executeFilterMapping(this.oInputFilter, this.oMappingRequest, [ "targetProperty1", "targetProperty2" ], fnCallback, this.oMessageHandler); //CUT
	});
	QUnit.module('Manifest Component Name Retrieval', {});
	QUnit.test("WHEN manifest with app id is provided", function(assert){
		var manifest = {
				"sap.app" : {
					"id" : "sap.apf.base"
				}
		};
		var componentName = sap.apf.utils.getComponentNameFromManifest(manifest);
		assert.equal(componentName, "sap.apf.base.Component");
	});
	QUnit.test("WHEN manifest with sap.ui5/componentName is provided", function(assert){
		var manifest = {
				"sap.app" : {
					"id" : "sap.apf.base"
				},
				"sap.ui5" : {
					"componentName" : "sap.apf.comp.Component"
				}
		};
		var componentName = sap.apf.utils.getComponentNameFromManifest(manifest);
		assert.equal(componentName, "sap.apf.comp.Component");
	});
	QUnit.test("WHEN manifest with sap.ui5/componentName is provided without Component suffix", function(assert){
		var manifest = {
				"sap.app" : {
					"id" : "sap.apf.base"
				},
				"sap.ui5" : {
					"componentName" : "sap.apf.comp"
				}
		};
		var componentName = sap.apf.utils.getComponentNameFromManifest(manifest);
		assert.equal(componentName, "sap.apf.comp.Component");
	});

	QUnit.module('extract the pathname from url', {});
	QUnit.test("Remove protocol, server and port from an URL", function(assert){
		var url = '/fire/wire/index.html';
		assert.equal(sap.apf.utils.extractPathnameFromUrl(url), url, "THEN original url returned");
		assert.equal(sap.apf.utils.extractPathnameFromUrl('https://localhost' + url), url, "THEN original url returned");
		assert.equal(sap.apf.utils.extractPathnameFromUrl('http://localhost:9090' + url), url, "THEN original url returned");
		assert.equal(sap.apf.utils.extractPathnameFromUrl('//localhost' + url), url, "THEN original url returned");
	});
}());
