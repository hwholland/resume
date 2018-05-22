/*global OData */

jQuery.sap.require('sap.apf.utils.navigationHandler');

jQuery.sap.registerModulePath('sap.apf.internal.server', '../../internal/server');
jQuery.sap.require('sap.apf.internal.server.userData');

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require("sap.ui.thirdparty.datajs");

jQuery.sap.registerModulePath('sap.apf.tests.withServer', '../../withServer');
jQuery.sap.require('sap.apf.tests.withServer.helper');

function navigationHandlerCommonSetup(context, defaultTargets) {
	var that = context;
	
	that.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
	var inject = {
			instances : {
				messageHandler: that.messageHandler
			},
			functions : {
				getNavigationTargets : function() {
					return defaultTargets;
				},
				getCumulativeFilterUpToActiveStep : function() {
					var filter = new sap.apf.core.utils.Filter(that.messageHandler, "SAPClient", "EQ", "888");
					return filter.addAnd(new sap.apf.core.utils.Filter(that.messageHandler, "Country", "EQ", "BRA"));
				},
				serializePath : function() {
				    context.serializePathCalled = true;
				    return {path : 'Alpha'};
				},
				serializeContext : function() {
				    context.serializeContextCalled = true;
				    return {context : 'Beta'};
				},
				deserializePath : function() {
				    context.deserializePathCalled = true;
				},
				deserializeContext : function() {
				    context.deserializeContextCalled = true;
				}
			}
	};
	that.navigationHandler = new sap.apf.utils.NavigationHandler(inject);
}

function addNavigationTarget(semanticObjects, counter, navTargets) {

	var navigationService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
	var semanticObject = semanticObjects[counter];
	var deferred = jQuery.Deferred();

	if (counter > 99) {
		deferred.resolve(navTargets);
		return deferred.promise();
	}

	navigationService.getSemanticObjectLinks(semanticObject.id, undefined, true, {}, undefined).done(function(aIntents) {

		aIntents.forEach(function(intentDefinition) {
			var actionWithParameters = intentDefinition.intent.split("-");
			var action = actionWithParameters[1].split("?");
			action = action[0].split("~");
			navTargets.push({
				semanticObject : semanticObject.id,
				action : action[0],
				id : "xxx" + counter
			});

		});

		counter++;
		addNavigationTarget(semanticObjects, counter, navTargets).done(function() {
			deferred.resolve(navTargets);
		});

	});
	return deferred.promise();
}

function getAllAvailableSemanticObjects (messageHandler, authTestHelper, fnCallback) {
	
  	 function prepareNavigationTargetsConfiguration(oData, results) { 
  		 var semanticObjects = oData.results;

  		 var counter = 0;
  		 var navTargets = [];
  		
  		 addNavigationTarget(semanticObjects, 0, navTargets).done(function() {
  			fnCallback(navTargets);
  		 });
  	 }
  	 function returnErrors (oError) { 
  		 var messageObject;
  		 if (oError.messageObject) {
  			 messageObject = oError.messageObject;
  		 } else {
  			messageObject = messageHandler.createMessageObject({ code : "11041"});
  		 }
  		 
  	 }
  	
  	 var request = {
  			 requestUri : "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text",
  			 method : "GET",
  			 headers : { "x-csrf-token" : authTestHelper.getXsrfToken("/sap/opu/odata/UI2/INTEROP/SemanticObjects")}
  	 };
  	 OData.request(request, prepareNavigationTargetsConfiguration, returnErrors);
}
   
module("Ushell container", {
    setup: function() {
    	QUnit.stop(); 	
    	
		this.config = {
					serviceRoot : "/sap/opu/odata/UI2/INTEROP/",
					entitySet : "SemanticObjects",
					systemType : "abap"
		};

		this.helper = new sap.apf.tests.withServer.Helper(this.config);
		
		this.oAuthTestHelper = this.helper.createAuthTestHelper(function() {
			start();
		}.bind(this));
    }
});

asyncTest("WHEN get all semantic objects", function() {
	 function returnSemanticObjects(oData, results) { 
		 var allAvailableSemanticObjects = oData.results;
		 ok(true, "could read all semantic objects");
		 start();
		 allAvailableSemanticObjects.forEach(function(semanticObject) {
			 console.log(semanticObject.id + " - " + semanticObject.text);
		 });
	 }
	 
	 function returnErrors (oError) { 
		 ok(false);
		 start();
	 }
	 
	 var request = {
			 requestUri : "/sap/opu/odata/UI2/INTEROP/SemanticObjects?$format=json&$select=id,text",
			 method : "GET",
			 headers : { "x-csrf-token" : this.oAuthTestHelper.getXsrfToken("/sap/opu/odata/UI2/INTEROP/SemanticObjects")}
	 };
	 OData.request(request, returnSemanticObjects, returnErrors);
});


asyncTest("WHEN getNavigationTargetsWithText is called", function() {
	
	var that = this;
	function handleNavigationTargets(navTargets) {
		navigationHandlerCommonSetup(that, navTargets);
		that.navigationHandler.getNavigationTargetsWithText().done(function(navTargets){
			ok(navTargets);
			start();
		}).fail(function() {
			ok(false, "error occurred");
			start();
		});
	}
	getAllAvailableSemanticObjects(this.messageHandler, this.oAuthTestHelper, handleNavigationTargets);
});

