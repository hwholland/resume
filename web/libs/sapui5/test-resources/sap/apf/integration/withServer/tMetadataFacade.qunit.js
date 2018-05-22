jQuery.sap.declare("sap.apf.tests.integration.withServer.tMetadataFacade");

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.registerModulePath('sap.apf.internal.server', '../../internal/server');
jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance'); // FIXME must occur in ALL test file that require helper.js
jQuery.sap.require('sap.apf.tests.integration.withDoubles.helper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.Component');

module("Metadata Facade", {
	setup : function() {
		QUnit.stop();
		var that = this;
		var component = {
				getComponentData: function() {
					return {
						startupParameters: {}
					};
				}
		};
		function Probe(dependencies) {
			that.coreApi = dependencies.coreApi;
			that.serializationMediator = dependencies.serializationMediator;
			that.pathContextHandler = dependencies.pathContextHandler;
		}
		this.api = new sap.apf.Api(component, {
			probe: Probe
		});
		
		
		this.fnOriginalAjax = jQuery.ajax;
		sap.apf.testhelper.replacePathsInAplicationConfiguration(this.fnOriginalAjax);
		var sUrl = sap.apf.testhelper.determineTestResourcePath() + "/integration/withServer/integrationTestingApplicationConfiguration.json";
		this.coreApi.loadApplicationConfig(sUrl);
		new sap.apf.testhelper.AuthTestHelper(function() {
			QUnit.start();
		}.bind(this));
	},
	teardown : function() {
		jQuery.ajax = this.fnOriginalAjax;
	}
});

asyncTest("Get all properties from two different service documents", function() {
	expect(1);
	
	var callbackAllProperties = function(aProperties){
		equal(aProperties.length, 118, "118 different property names expected");
		start();
	};
	this.coreApi.getMetadataFacade().getAllProperties(callbackAllProperties);
});

asyncTest("Get all parameter entity set key properties from two different service documents", function() {
	expect(1);
	
	var callbackAllParameterEntitySetKeyProperties = function(aParameterEntitySetKeyProperties){
		equal(aParameterEntitySetKeyProperties.length, 11, "11 different parameter entity set key properties expected");
		start();
	};
	this.coreApi.getMetadataFacade().getAllParameterEntitySetKeyProperties(callbackAllParameterEntitySetKeyProperties);
});

asyncTest("Get property from two different service documents", function(){
	expect(4);
	
	var callbackProperty = function(oProperty){
		//different checks on returned property
		equal(oProperty.name, "CompanyCodeCountry", "Correct metadata property 'CompanyCodeCountry' returned");
		equal(oProperty.getAttribute("maxLength"), 3, "Property has correct attribute 'MaxLength'");
		equal(oProperty.isKey(), false, "Property 'CompanyCodeCountry' is no key");
		equal(oProperty.isParameterEntitySetKeyProperty(), false, "Property 'CompanyCodeCountry' is no parameter key property");
		start();
	};
	this.coreApi.getMetadataFacade().getProperty("CompanyCodeCountry", callbackProperty);
});

asyncTest("Get annotation for property attribute from two different service documents", function(){
	expect(2);
	
	var callbackProperty = function(oProperty){
		//different checks on returned property
		equal(oProperty.name, "P_FromDate", "Correct metadata property 'P_FromDate' returned");
		equal(oProperty.getAttribute("isCalendarDate"), "true", "Property 'P_FromDate' has annotation");
		start();
	};
	this.coreApi.getMetadataFacade().getProperty("P_FromDate", callbackProperty);
});

asyncTest("Get key property from two different service documents", function(){
	expect(4);
	
	var callbackProperty = function(oProperty){
		//different checks on returned property
		equal(oProperty.name, "P_SAPClient", "Correct metadata property 'P_SAPClient' returned");
		equal(oProperty.getAttribute("maxLength"), 3, "Property has correct attribute 'maxLength'");
		equal(oProperty.isKey(), true, "Property 'P_SAPClient' is key");
		equal(oProperty.isParameterEntitySetKeyProperty(), true, "Property 'P_SAPClient' is parameter key property");
		start();
	}; 
	this.coreApi.getMetadataFacade().getProperty("P_SAPClient", callbackProperty);
});
