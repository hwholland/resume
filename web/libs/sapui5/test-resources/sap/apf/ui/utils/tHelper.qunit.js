/*
 * Copyright (C) 2010-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');

jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerStubbedAjax");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.declare('test.sap.apf.ui.utils.helper');
jQuery.sap.require('sap.apf.ui.utils.helper');
(function() {
	QUnit.module("Utils qUnit", {
		beforeEach : function(assert) {
			var inject = {
					SessionHandler : sap.apf.testhelper.doubles.sessionHandlerStubbedAjax
			};
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi("CompUi", 
					"/apf-test/test-resources/sap/apf/testhelper/config/applicationConfigurationIntegration.json", inject);
			this.oCoreApi = this.oGlobalApi.oCoreApi;

			this.utils = new sap.apf.ui.utils.Helper(this.oCoreApi);
			this.getMetaDataFacade = function() {
				var obj = {};
				obj.getProperty = function(sName, callback) {
					var propertyDetails = {};
					propertyDetails.label = sName;
					callback(propertyDetails);
				};
				return obj;
			};
			sinon.stub(this.oCoreApi, 'getMetadataFacade', this.getMetaDataFacade);
			this.getTextNotHtmlEncoded = function(text) {
				if (text.key === "RevenueAmountInDisplayCrcy_Ekey") {
					return "Revenue";
				} else if (text.key === "YearMonthkey") {
					return "Time";
				}
			};
			sinon.stub(this.oCoreApi, 'getTextNotHtmlEncoded', this.getTextNotHtmlEncoded);
			this.oRepresentationWithFieldDesc = { // Representation with two orderby Fields, which matches the dimension/measures
				"parameter" : { //Also the Description for both orderby is available in dimension/measures
					"dimensions" : [ {
						"fieldName" : "YearMonth",
						"kind" : "xAxis",
						"fieldDesc" : {
							"type" : "label",
							"kind" : "text",
							"key" : "YearMonthkey"
						}
					} ],
					"measures" : [ {
						"fieldName" : "RevenueAmountInDisplayCrcy_E",
						"kind" : "yAxis",
						"fieldDesc" : {
							"type" : "label",
							"kind" : "text",
							"key" : "RevenueAmountInDisplayCrcy_Ekey"
						}
					} ],
					"orderby" : [ {
						"property" : "RevenueAmountInDisplayCrcy_E",
						"ascending" : false
					}, {
						"property" : "YearMonth",
						"ascending" : false
					} ]
				},
				"picture" : "sap-icon://line-chart",
				"label" : {
					"type" : "label",
					"key" : "LineChart",
					"kind" : "text"
				}
			};
			this.oRepresentationWithoutFieldDesc = { // Representation with one orderby Field, which matches the dimension/measures 
				"parameter" : { //But Description is not available in dimension/measure i.e it should be read from metadataFacade
					"dimensions" : [ {
						"fieldName" : "YearMonth",
						"kind" : "xAxis"
					} ],
					"measures" : [ {
						"fieldName" : "RevenueAmountInDisplayCrcy_E",
						"kind" : "yAxis"
					} ],
					"orderby" : [ {
						"property" : "RevenueAmountInDisplayCrcy_E",
						"ascending" : false
					} ]
				},
				"picture" : "sap-icon://line-chart",
				"label" : {
					"type" : "label",
					"key" : "LineChart",
					"kind" : "text"
				}
			};
			this.oRepresentationWithNullKeyInFieldDesc = { // Representation with one orderby Field, which matches the dimension/measures 
				"parameter" : { //But Description is not available in dimension/measure i.e it should be read from metadataFacade
					"dimensions" : [ {
						"fieldName" : "YearMonth",
						"kind" : "xAxis",
						"fieldDesc" : {
							"type" : "label",
							"kind" : "text",
							"key" : ""
						}
					} ],
					"measures" : [ {
						"fieldName" : "RevenueAmountInDisplayCrcy_E",
						"kind" : "yAxis",
						"fieldDesc" : {
							"type" : "label",
							"kind" : "text",
							"key" : ""
						}
					} ],
					"orderby" : [ {
						"property" : "RevenueAmountInDisplayCrcy_E",
						"ascending" : false
					} ]
				},
				"picture" : "sap-icon://line-chart",
				"label" : {
					"type" : "label",
					"key" : "LineChart",
					"kind" : "text"
				}
			};
			this.oRepresentationMixed = { // Representation with two orderby Fields, which matches the dimension/measures 
				"parameter" : { //But Description is available only for one orderby Field (YearMonth) in dimension/measure 				                       //i.e it should be read from metadataFacade
					"dimensions" : [ { //Description is not available for field (RevenueAmountInDisplayCrcy_E) i.e it will be read from metadataFacade
						"fieldName" : "YearMonth",
						"kind" : "xAxis",
						"fieldDesc" : {
							"type" : "label",
							"kind" : "text",
							"key" : "YearMonthkey"
						}
					} ],
					"measures" : [ {
						"fieldName" : "RevenueAmountInDisplayCrcy_E",
						"kind" : "yAxis",
						"fieldDesc" : {
							"type" : "label",
							"kind" : "text",
							"key" : " "
						}
					} ],
					"orderby" : [ {
						"property" : "YearMonth",
						"ascending" : false
					}, {
						"property" : "RevenueAmountInDisplayCrcy_E",
						"ascending" : false
					} ]
				},
				"picture" : "sap-icon://line-chart",
				"label" : {
					"type" : "label",
					"key" : "LineChart",
					"kind" : "text"
				}
			};
			this.oRepresentationNewSortProperty = { // Representation with one orderby Fields, which does not match the dimension/measures 
				"parameter" : { //Description will be read from metadataFacade
					"dimensions" : [ {
						"fieldName" : "YearMonth",
						"kind" : "xAxis",
						"fieldDesc" : {
							"type" : "label",
							"kind" : "text",
							"key" : "YearMonthkey"
						}
					} ],
					"measures" : [ {
						"fieldName" : "RevenueAmountInDisplayCrcy_E",
						"kind" : "yAxis",
						"fieldDesc" : {
							"type" : "label",
							"kind" : "text",
							"key" : " "
						}
					} ],
					"orderby" : [ {
						"property" : "NewProperty",
						"ascending" : false
					} ]
				},
				"picture" : "sap-icon://line-chart",
				"label" : {
					"type" : "label",
					"key" : "LineChart",
					"kind" : "text"
				}
			};
		},
		afterEach : function() {
			this.oCoreApi.getMetadataFacade.restore();
			this.oCoreApi.getTextNotHtmlEncoded.restore();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Api's Availability", function(assert) {
		assert.ok(typeof this.utils.getRepresentationSortInfo === "function", "getRepresentationSortInfo API exists");
	});
	QUnit.test("Orderby Property available in dimension/measures (Sort Description read from dimension/measures) - getRepresentationSortInfo() API", function(assert) {
		var representationSortDetail = this.utils.getRepresentationSortInfo(this.oRepresentationWithFieldDesc);
		var expectedSortDetails = "Revenue, Time"; //Value from dimension/measure label
		assert.ok(representationSortDetail === expectedSortDetails, "Expected Sort details : " + expectedSortDetails + " , Sort Description available for the representation from dimension/measures.");
	});
	QUnit.test("Orderby Property available in dimension/measures (Sort Description read from metadataFacade)  - getRepresentationSortInfo() API", function(assert) {
		var representationSortDetail = this.utils.getRepresentationSortInfo(this.oRepresentationWithNullKeyInFieldDesc);
		var expectedSortDetails = "RevenueAmountInDisplayCrcy_E"; // value from metaDataFacade
		assert.ok(representationSortDetail === expectedSortDetails, "Expected Sort details : " + expectedSortDetails + " , Sort Description available for the representation from metaDataFacade.");
	});
	QUnit.test("Orderby Property available in dimension/measures (One Sort Description read from dimension/measures, another from metadataFacade) - getRepresentationSortInfo() API", function(assert) {
		var representationSortDetail = this.utils.getRepresentationSortInfo(this.oRepresentationMixed);
		var expectedSortDetails = "Time, RevenueAmountInDisplayCrcy_E"; // one value from metaDataFacade and one from dimension/measure
		assert.ok(representationSortDetail === expectedSortDetails, "Expected Sort details : " + expectedSortDetails + " , Sort Description available for the representation from metaDataFacade and dimension/measure.");
	});
	QUnit.test("Orderby Property not available in dimension/measures (Sort Description read from metadataFacade) - getRepresentationSortInfo() API", function(assert) {
		var representationSortDetail = this.utils.getRepresentationSortInfo(this.oRepresentationNewSortProperty);
		var expectedSortDetails = "NewProperty"; // value from metaDataFacade
		assert.ok(representationSortDetail === expectedSortDetails, "Expected Sort details : " + expectedSortDetails + " , Sort Description available for the representation from metaDataFacade.");
	});
	QUnit.test("Sort Description read from metadataFacade if the field description is not available  - getRepresentationSortInfo() API", function(assert) {
		var representationSortDetail = this.utils.getRepresentationSortInfo(this.oRepresentationWithoutFieldDesc);
		var expectedSortDetails = "RevenueAmountInDisplayCrcy_E"; // value from metaDataFacade
		assert.ok(representationSortDetail === expectedSortDetails, "Expected Sort details : " + expectedSortDetails + " , Sort Description available for the representation from metaDataFacade.");
	});
}());