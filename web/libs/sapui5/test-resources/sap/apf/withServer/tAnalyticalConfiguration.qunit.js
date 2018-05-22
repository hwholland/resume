jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');

jQuery.sap.registerModulePath('sap.apf.internal.server', '../internal/server');
jQuery.sap.require('sap.apf.internal.server.userData');

jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.core.odataRequest');
jQuery.sap.require('sap.apf.core.utils.Filter');

sap.apf.testhelper.generateBatchRequest = function(sXsrfToken, sServiceRoot, sEntityType, aCreateEntries, aUpdateEntries, aDeleteEntries) {
	var aChangeRequests = [];
	var oChangeRequest, i, len;

	len = aCreateEntries.length;
	for(i = 0; i < len; i++) {
		oChangeRequest = {
			requestUri : sEntityType, 
			method : "POST",
			data : aCreateEntries[i],
			headers : {
				"Accept-Language" : sap.ui.getCore().getConfiguration().getLanguage(),
				"x-csrf-token" : sXsrfToken
			}
		};
		aChangeRequests.push(oChangeRequest);
	}

	len = aUpdateEntries.length;
	
	for(i = 0; i < len; i++) {
		oChangeRequest = {
			requestUri : sEntityType + "(TextElement='" + aUpdateEntries[i].TextElement + "',Language='" + aUpdateEntries[i].Language + "')", 
			method : "PUT",
			data : aUpdateEntries[i],
			headers : {
				"Accept-Language" : sap.ui.getCore().getConfiguration().getLanguage(),
				"x-csrf-token" : sXsrfToken
			}
		};
		aChangeRequests.push(oChangeRequest);
	}
	
	len = aDeleteEntries.length;
	for(i = 0; i < len; i++) {
		oChangeRequest = {
			requestUri : sEntityType + "(TextElement='" + aDeleteEntries[i].TextElement + "',Language='" + aDeleteEntries[i].Language + "')", 
			method : "DELETE",
			headers : {
				"Accept-Language" : sap.ui.getCore().getConfiguration().getLanguage(),
				"x-csrf-token" : sXsrfToken
			}
		};
		aChangeRequests.push(oChangeRequest);
	}
	
	
	var oBatchRequest = {
		requestUri : sServiceRoot  + '/' + '$batch',
		method : "POST",
		headers : {
			"x-csrf-token" : sXsrfToken
		},
		data : {
			__batchRequests : [ {
				__changeRequests : aChangeRequests
			} ]
		}
	};

	return oBatchRequest;
};
module('Create/Read all/Update/Delete Application for Analytical Configurations', {
	setup : function() {
		QUnit.stop();
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			QUnit.start();
		}.bind(this));
	},
	teardown : function() {
		
	}
});

asyncTest('Create, Read, Delete Application', function() {

	expect(8);
	var that = this;
	var oMessageHandler = new sap.apf.core.MessageHandler();
	var sServiceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
	var sEntityType = 'ApplicationQueryResults';
	var sXsrfToken = this.oAuthTestHelper.getXsrfToken();
	var sUrl = sServiceRoot + '/' + sEntityType;
	var sApplicationName = "ApplicationForUnitTesting";
	
	var fnSuccessOnDeleteApplication = function(oData, oResponse) {
		if (!oData && oResponse.statusText === "No Content") {
			ok(1, "Deletion succeeded");
		} else {
			ok(false, "Deletion failed.");
		}
		start();
	};
	
	var fnErrorDeleteApplication = function(oError) {
		ok(false, "Delete of Application failed");
		start();
	};
	
	var doDeleteApplication = function(sApplication) {
		var sUrl = sServiceRoot + '/' + sEntityType + "('" + sApplication + "')";
		var oRequest = {
			requestUri : sUrl,
			method : "DELETE",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnDeleteApplication, fnErrorDeleteApplication);	
	};
	var fnSuccessOnReadApplicationAfterUpdate = function(oData, oResponse) {
	
		if (oData && oData.Application && oResponse.statusCode === 200 && oResponse.statusText === "OK") {
			equal(oData.Application, that.ApplicationCreatedByThisTest, "Request returns expected application.");
			equal(oData.SemanticObject, "aNewSemanticalObject", "updated semantic object as expected");
			doDeleteApplication(that.ApplicationCreatedByThisTest);
		} else {
			ok(false, "Request failed.");
			start();
		}
	};
	
	var fnErrorOnReadApplicationAfterUpdate = function(oError) {
		ok(false, "Read/GET of Application failed");
		start();
	};
	
	var doReadApplicationAfterUpdate = function(sApplication) {
		var sUrl = sServiceRoot + '/' + sEntityType + "('" + sApplication + "')";
		var oRequest = {
			requestUri : sUrl,
			method : "GET",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnReadApplicationAfterUpdate, fnErrorOnReadApplicationAfterUpdate);	
	};
	var fnSuccessOnUpdateApplication = function(oData, oResponse) {
		if (!oData && oResponse.statusCode === 204) {
			ok(1, "Update succeeded");
			doReadApplicationAfterUpdate(that.ApplicationCreatedByThisTest);
		} else {
			ok(false, "Update failed.");
			start();
		}
	};
	
	var fnErrorUpdateApplication = function(oError) {
		ok(false, "Update of Application failed");
		start();
	};
	
	var doUpdateApplication = function(sApplication) {
		var sUrl = sServiceRoot + '/' + sEntityType + "('" + sApplication + "')";
		var oPostObject = { 
				Application : "",
				ApplicationName : sApplicationName,
				SemanticObject : "aNewSemanticalObject" };
		
		var oRequest = {
			requestUri : sUrl,
			method : "PUT",
			headers : {
				"x-csrf-token" : sXsrfToken
			},
			data : oPostObject
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnUpdateApplication, fnErrorUpdateApplication);
	};
	
	var fnSuccessOnReadAllApplications = function(oData, oResponse) {
		var i, len, bFound = false;
		
		if (oData && oData.results) {
			len = oData.results.length;
			for(i = 0; i < len && !bFound; i++) {
				if (oData.results[i].Application === that.ApplicationCreatedByThisTest) {
					bFound = true;
					
				}
			}
			if (bFound) {
				ok(1, "Application is returned ");

				doUpdateApplication(that.ApplicationCreatedByThisTest);
				
			} else {
				ok(false, "Newly created application not existing!");
				start();
			}

		} else {
			ok(false, "Reading all applications did not return at least one application");
			start();
		}
		
	};
	
	var fnErrorOnReadAllApplications = function(oError) {
		ok(false, "Read of all Application failed");
		start();
	};
	
	var doReadAllApplications = function() {
		var sUrl = sServiceRoot + '/' + sEntityType;
		var oRequest = {
			requestUri : sUrl,
			method : "GET",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnReadAllApplications, fnErrorOnReadAllApplications);
	};

	var fnSuccessOnCreateApplication = function(oData, oResponse) {

		if (oData && oData.Application && oResponse.statusText === "Created") {
			ok(true, "Application has been created");
			equal(oData.ApplicationName, sApplicationName, "Identical application name returned" );
			equal(oData.SemanticObject, "aSemanticalObject", "Identical semantic object returned" );
			that.ApplicationCreatedByThisTest = oData.Application;
			
			doReadAllApplications();
		} else {
			ok(false, "Create of Application failed.");
			start();
		}
	};
	
	var fnErrorOnCreateApplication = function(oError) {
		ok(false, "Create of Application failed.");
		start();
	};
	
	var doCreateApplication = function() {
		
		var oPostObject = {
				Application : "",
				ApplicationName : sApplicationName,
				SemanticObject : "aSemanticalObject"
		};
		var oRequest = {
			requestUri : sUrl,
			method : "POST",
			headers : {
				"x-csrf-token" : sXsrfToken
			},
			data : oPostObject
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnCreateApplication, fnErrorOnCreateApplication);
	};
	
	doCreateApplication();
});


 module('Create, Read, Update and Delete Analytical Configurations', {
	setup : function() {
		QUnit.stop();
		this.sUniqueValue = this.getUniqueValue();
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			QUnit.start();
		}.bind(this));
		this.oPostObject = {
			AnalyticalConfiguration : sap.apf.testhelper.generateGuidForTesting(), // Needs to be a "GUID": the server will check for /[0-9A-F]{32}/
			AnalyticalConfigurationName : 'new name',
			Application : "",
			CreationUTCDateTime: null,
            LastChangeUTCDateTime: null, 
			SerializedAnalyticalConfiguration : '{  someProperty : "somePropertyValue"}'
		};
	},
	teardown : function() {

	},
	getUniqueValue : function() {
		var date = new Date();
		var uniqueInteger = Math.random() * date.getTime();
		return "val" + uniqueInteger;
	},
	getSpecialLanguageCode : function() {
		return "zy";
	}
});

asyncTest("Create new Analytical Configuration and read it again", function() {
	expect(13);
	var that = this;
	var sApplicationName = "ApplicationForUnitTesting";
	var oMessageHandler = new sap.apf.core.MessageHandler();
	var sServiceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
	var sEntityType = 'AnalyticalConfigurationQueryResults';
	var sXsrfToken = this.oAuthTestHelper.getXsrfToken();

	var doDeleteApplication = function(sApplication) {
		var sEntityType = 'ApplicationQueryResults';
		var sUrl = sServiceRoot + '/' + sEntityType + "('" + sApplication + "')";
		var oRequest = {
			requestUri : sUrl,
			method : "DELETE",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, function() { ok(1, "delete application"); start();}, function(oError) { ok(false, "deletion failed"); start();});	
	};
	var fnSuccessOnDeleteAnalyticalConfiguration = function(oData, oResponse) {
		if (!oData && oResponse.statusText === "No Content") {
			ok(1, "Deletion succeeded");
			doDeleteApplication(that.ApplicationCreatedByThisTest);
			
		} else {
			ok(false, "Deletion failed.");
			start();
		}
	};

	var fnSuccessOnUpdateAnalyticalConfiguration = function(oData, oResponse) {

		if (!oData && oResponse.statusCode === 204) {
			ok(1, "Update succeeded");
			readAnalyticalConfigurationAfterModify(that.AnalyticalConfigurationFromCreate);
		} else {
			ok(false, "Deletion failed.");
			start();
		}

	};
	var readAnalyticalConfigurationAfterModify = function(sAnalyticalConfiguration) {

		var sUrl = sServiceRoot + '/' + sEntityType + "('" + sAnalyticalConfiguration + "')";
		var oRequest = {
			requestUri : sUrl,
			method : "GET",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnReadAnalyticalConfigurationAfterModify, fnErrorOnReadAnalyticalConfiguration);
	};

	var fnSuccessOnReadAnalyticalConfiguration = function(oData, oResponse) {

		if (oData && oData.AnalyticalConfiguration && oResponse.statusCode === 200 && oResponse.statusText === "OK") {
			equal(oData.AnalyticalConfiguration, that.AnalyticalConfigurationFromCreate, "Request returns expected configuration.");
			equal(that.oPostObject.SerializedAnalyticalConfiguration, oData.SerializedAnalyticalConfiguration, "Serialized Configuration as expected");
			updateAnalyticalConfiguration(that.AnalyticalConfigurationFromCreate);
		} else {
			ok(false, "Request failed.");
			start();
		}

	};

	var fnSuccessOnReadAnalyticalConfigurationAfterModify = function(oData, oResponse) {

		if (oData && oData.AnalyticalConfiguration && oResponse.statusCode === 200 && oResponse.statusText === "OK") {
			equal(oData.AnalyticalConfiguration, that.AnalyticalConfigurationFromCreate, "Request returns expected configuration.");
			equal(oData.SerializedAnalyticalConfiguration, '{  someProperty : "newPropertyValue"}', "Serialized Configuration after update as expected");
			deleteAnalyticalConfiguration(that.AnalyticalConfigurationFromCreate);
		} else {
			ok(false, "Request failed.");
			start();
		}

	};
	var fnSuccessOnReadAllAnalyticalConfigurations = function(oData, oResponse) {
		var i, len, bFound = false;
		var sSerializedAnalyticalConfiguration = that.oPostObject.SerializedAnalyticalConfiguration;
		if (oData && oData.results) {
			len = oData.results.length;
			for(i = 0; i < len && !bFound; i++) {
				if (oData.results[i].AnalyticalConfiguration === that.AnalyticalConfigurationFromCreate) {
					bFound = true;
					equal(sSerializedAnalyticalConfiguration, oData.results[i].SerializedAnalyticalConfiguration, "Serialized Configuration as expected");
				}
			}
			if (bFound) {
				ok(1, "Analytical Configuration is returned ");

				readAnalyticalConfiguration(that.AnalyticalConfigurationFromCreate);

			} else {
				ok(false, "Newly created analytical configuration not existing!");
				start();
			}

		}
	};

	var readAllAnalyticalConfigurations = function() {
		var sUrl = sServiceRoot + '/' + sEntityType;
		var oRequest = {
			requestUri : sUrl,
			method : "GET",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnReadAllAnalyticalConfigurations, fnErrorOnReadAllAnalyticalConfigurations);
	};

	var updateAnalyticalConfiguration = function(sAnalyticalConfiguration) {
		var sUrl = sServiceRoot + '/' + sEntityType + "('" + sAnalyticalConfiguration + "')";
		var oPostObject = jQuery.extend({}, that.oPostObject);
		oPostObject.SerializedAnalyticalConfiguration = '{  someProperty : "newPropertyValue"}';

		var oRequest = {
			requestUri : sUrl,
			method : "PUT",
			headers : {
				"x-csrf-token" : sXsrfToken
			},
			data : oPostObject
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnUpdateAnalyticalConfiguration, fnErrorUpdateAnalyticalConfiguration);
	};
	var readAnalyticalConfiguration = function(sAnalyticalConfiguration) {

		var sUrl = sServiceRoot + '/' + sEntityType + "('" + sAnalyticalConfiguration + "')";
		var oRequest = {
			requestUri : sUrl,
			method : "GET",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnReadAnalyticalConfiguration, fnErrorOnReadAnalyticalConfiguration);
	};

	var deleteAnalyticalConfiguration = function(sAnalyticalConfiguration) {
		var sUrl = sServiceRoot + '/' + sEntityType + "('" + sAnalyticalConfiguration + "')";
		var oRequest = {
			requestUri : sUrl,
			method : "DELETE",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnDeleteAnalyticalConfiguration, fnErrorDeleteAnalyticalConfiguration);

	};

	var fnSuccessOnCreate = function(oData, oResponse) {
		that.AnalyticalConfigurationFromCreate = oData.AnalyticalConfiguration;
		if (oData && oData.AnalyticalConfiguration && oResponse.statusText === "Created") {
			ok(true, "Request succeeded.");

			readAllAnalyticalConfigurations();
		} else {
			ok(false, "Request failed.");
			start();
		}

	};
	var fnErrorOnReadAnalyticalConfiguration = function(oError) {
		ok(false, "Request Read failed.");
		start();
	};

	var fnErrorOnCreate = function(oError) {
		ok(false, "Create Analytical configuration failed.");
		start();
	};
	var fnErrorOnReadAllAnalyticalConfigurations = function(oError) {
		ok(false, "Request failed on Read all Analytical Configurations");
		start();
	};
	var fnErrorDeleteAnalyticalConfiguration = function(oError) {
		ok(false, "Request failed on Delete Analytical Configuration");
		start();
	};
	var fnErrorUpdateAnalyticalConfiguration = function(oError) {
		ok(false, "Request failed on Update Analytical Configuration");
		start();
	};

	var createAnalyticalConfiguration = function(sApplication) {
		var sUrl = sServiceRoot + '/' + sEntityType;
		that.oPostObject.Application = sApplication;
		
		var oRequest = {
			requestUri : sUrl,
			method : "POST",
			headers : {
				"x-csrf-token" : sXsrfToken
			},
			data : that.oPostObject
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnCreate, fnErrorOnCreate);
	};
	
	
	var fnSuccessOnCreateApplication = function(oData, oResponse) {
		
		if (oData && oData.Application && oResponse.statusText === "Created") {
			ok(true, "Application has been created");
			equal(oData.ApplicationName, sApplicationName, "Identical application name returned" );
			equal(oData.SemanticObject, "aSemanticalObject", "Identical semantic object returned" );
			that.ApplicationCreatedByThisTest = oData.Application;
			createAnalyticalConfiguration(that.ApplicationCreatedByThisTest);
			
		} else {
			ok(false, "Create of Application failed.");
			start();
		}
	};
	
	var fnErrorOnCreateApplication = function(oError) {
		ok(false, "Create of Application failed.");
		start();
	};
	
	var doCreateApplication = function() {
		var sServiceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
		var sEntityType = 'ApplicationQueryResults';
		var sUrl = sServiceRoot + '/' + sEntityType;
		
		var oPostObject = {
				Application : "",
				ApplicationName : sApplicationName,
				SemanticObject : "aSemanticalObject"
		};
		var oRequest = {
			requestUri : sUrl,
			method : "POST",
			headers : {
				"x-csrf-token" : sXsrfToken
			},
			data : oPostObject
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnCreateApplication, fnErrorOnCreateApplication);
	};
	
	doCreateApplication();
});


asyncTest("Analytical Configuration Texts - Create/Update in Batch and Delete", function() {
	expect(29);
	var that = this;
	var oMessageHandler = new sap.apf.core.MessageHandler();
	var sServiceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
	var sEntityType = 'TextElementQueryResults';
	var sXsrfToken = this.oAuthTestHelper.getXsrfToken();
	var sApplicationName = "ApplicationForUnitTesting";
	
	var generateNewTextsEntries = function() {
		var i;
		var sLanguageCode = that.getSpecialLanguageCode();
		;
		var aTexts = [];

		for(i = 0; i < 9; i++) {
			var oText = {
				TextElement : "",   //key should be filled automatically
				Language : sLanguageCode,
				TextElementType : "TITLE",
				TextElementDescription : "TITLE",
				MaximumLength : 30,
				Application : that.ApplicationCreatedByThisTest,	
				TranslationHint : "Hint"
			};
			aTexts.push(oText);
		}
		;
		return aTexts;
	};

	var fnSuccessOnDeleteTexts = function(oData, oResponse) {
		var len, i;
		if (oData) {
			
			len = oData.__batchResponses[0].__changeResponses.length;
			equal(len, 14, "expected number of deleted texts");
			for (i = 0; i < len; i++) {
				equal(oData.__batchResponses[0].__changeResponses[i].statusCode, 204, "correct status code for delete");
			}
		}
		doDeleteApplication(that.ApplicationCreatedByThisTest);
	};
	
	var fnErrorOnDeleteTexts = function (oError) {
		ok(false, "Delete of Texts failed");
		doDeleteApplication(that.ApplicationCreatedByThisTest);
	};
	
	var fnErrorOnReadAllAnalyticalTextsOfApplication = function (oError) {
		ok(false, "Reading of Texts failed");
		doDeleteApplication(that.ApplicationCreatedByThisTest);
	};
	
	var doDeleteTexts = function() {
		/*global OData: false */
		var oBatchRequest = sap.apf.testhelper.generateBatchRequest(sXsrfToken, sServiceRoot, sEntityType, [], [], that.texts);
		
		OData.request(oBatchRequest, fnSuccessOnDeleteTexts, fnErrorOnDeleteTexts, OData.batchHandler);
	};
	
	var fnSuccessOnReadAllAnalyticalTextsOfApplication = function(oData, oResponse) {
		
		that.texts = oData.results;
		doDeleteTexts();
	};
	var doReadAllAnalyticalTextsOfApplication = function() {
		var messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		var filterExpr = new sap.apf.core.utils.Filter(messageHandler, 'Application', 'eq', that.ApplicationCreatedByThisTest).toUrlParam();
			var sUrl = sServiceRoot + '/' + sEntityType + '?$filter=' + filterExpr + '&$format=json';
			var oRequest = {
				requestUri : sUrl,
				method : "GET",
				headers : {
					"x-csrf-token" : sXsrfToken
				}
			};
			sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnReadAllAnalyticalTextsOfApplication, fnErrorOnReadAllAnalyticalTextsOfApplication);
	};
	
	var fnSuccessOnCreateAndDeleteAndModifyTexts = function(oData, oResponse) {
		var len;
		if (oData) {
			len = oData.__batchResponses[0].__changeResponses.length;
			equal(len, 18, "expected number of entries");
			doReadAllAnalyticalTextsOfApplication();
		}
	};
	var fnErrorOnCreateAndDeleteAndModifyTexts = function(oError) {
		ok(false, "Multiple operation on Texts failed");
		doDeleteApplication(that.ApplicationCreatedByThisTest);
	};
	
	var doCreateAndDeleteAndModifyTexts = function() {
		/*global OData: false */
		var aNewTexts = generateNewTextsEntries();
		
		var aTextsForUpdate = [];
		var aTextsForDelete = [];
		var i, len = that.texts.length;
		for (i = 0; i < len; i++) {
			if (i < 5) {
				
				aTextsForUpdate.push(that.texts[i]);
				aTextsForUpdate[i].TextElementDescription = "ChangedTitle";
			} else {
				aTextsForDelete.push(that.texts[i]);
			}
		}
		
		var oBatchRequest = sap.apf.testhelper.generateBatchRequest(sXsrfToken, sServiceRoot, sEntityType, aNewTexts, aTextsForUpdate, aTextsForDelete);
		
		OData.request(oBatchRequest, fnSuccessOnCreateAndDeleteAndModifyTexts, fnErrorOnCreateAndDeleteAndModifyTexts, OData.batchHandler);
	};
	var fnSuccessOnUpdateTexts = function(oData, oResponse) {
		var len, i;
		
		if (oData) {
			
			len = oData.__batchResponses[0].__changeResponses.length;
			equal(len, 9, "expected number of updated texts");
			for (i = 0; i < len; i++) {
				equal(oData.__batchResponses[0].__changeResponses[i].statusCode, 204, "correct status code for update");
			}
			doCreateAndDeleteAndModifyTexts();  		
		} else {
			ok(false, "Update of Texts failed");
			start();
		}
	};
	
	var fnErrorOnUpdateTexts = function(oError) {
		ok(false, "Update of Texts failed");
		start();
	};
	var modifyCreatedTexts = function(aEntries) {
		/*global OData: false */
		var i, len = aEntries.length;
		var aModifiedEntries = [];
		
		for (i = 0; i < len; i++) {
			
			aEntries[i].data.TextElementDescription =  aEntries[i].data.TextElementDescription + '_and_more';
			aModifiedEntries.push(aEntries[i].data);
		}
		var oBatchRequest = sap.apf.testhelper.generateBatchRequest(sXsrfToken, sServiceRoot, sEntityType, [], aModifiedEntries, []);
		that.texts = aModifiedEntries;
		
		OData.request(oBatchRequest, fnSuccessOnUpdateTexts, fnErrorOnUpdateTexts, OData.batchHandler);
	};
	
	
	var fnSuccessOnCreateTexts = function(oData, oResponse) {

		if (oData && oData.__batchResponses && oData.__batchResponses[0] &&
				oData.__batchResponses[0].__changeResponses ) {

			equal(oData.__batchResponses[0].__changeResponses.length, 9, "Response contains the 9 newly created records");
			
			modifyCreatedTexts(oData.__batchResponses[0].__changeResponses); 
			
		} else {
			ok(false, "Error on create texts");
			start();
		}
		
	};
	var fnErrorOnCreateTexts = function(oError) {

		ok(false, "Failed on Create Texts");
		start();
	};
	

	var doDeleteApplication = function(sApplication) {
		var sEntityType = 'ApplicationQueryResults';
		var sUrl = sServiceRoot + '/' + sEntityType + "('" + sApplication + "')";
		var oRequest = {
			requestUri : sUrl,
			method : "DELETE",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, function() { 
			ok(1, "delete application"); start();}, function(oError) { ok(false, "deletion failed"); start();});	
	};
	
	var fnSuccessOnCreateApplication = function(oData, oResponse) {

		if (oData && oData.Application && oResponse.statusText === "Created") {
			ok(true, "Application has been created");
			that.ApplicationCreatedByThisTest = oData.Application;
			
			var aNewTextEntries = generateNewTextsEntries();
			var oBatchRequest = sap.apf.testhelper.generateBatchRequest(sXsrfToken, sServiceRoot, sEntityType, aNewTextEntries,[],  []);

			OData.request(oBatchRequest, fnSuccessOnCreateTexts, fnErrorOnCreateTexts, OData.batchHandler);
		} else {
			ok(false, "Create of Application failed.");
			start();
		}
	};
	
	var fnErrorOnCreateApplication = function(oError) {
		ok(false, "Create of Application failed.");
		start();
	};
	
	var doCreateApplication = function() {
		
		var sServiceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
		var sEntityType = 'ApplicationQueryResults';
		var sUrl = sServiceRoot + '/' +  sEntityType;
		
		var oPostObject = {
				Application : "",
				ApplicationName : sApplicationName,
				SemanticObject : "aSemanticalObject"
		};
		var oRequest = {
			requestUri : sUrl,
			method : "POST",
			headers : {
				"x-csrf-token" : sXsrfToken
			},
			data : oPostObject
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnCreateApplication, fnErrorOnCreateApplication);
	};
	
	doCreateApplication();
});

module('Create/Delete Application and Texts with given Guid-Keys', {
	setup : function() {
		this.applicationGuid = "343EC63F05550175E10000000A445B6D";
		this.texts = [ {
			TextElement : "143EC63F05550175E10000000A445B6A",  
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE1",
			MaximumLength : 30,
			Application : this.applicationGuid,
			TranslationHint : "Hint",
			LastChangeUTCDateTime: "/Date(1412692222731)/"
		}, {
			TextElement : "243EC63F05550175E10000000A445B6A",  
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE2",
			MaximumLength : 20,
			Application : this.applicationGuid,
			TranslationHint : "Hint",
		    LastChangeUTCDateTime: "/Date(1412692229733)/"
		}, {
			TextElement : "843EC63F05550175E10000000A445B6A",  
			Language : "",
			TextElementType : "XLAB",
			TextElementDescription : "uniqueLabelText",
			MaximumLength : 15,
			Application : this.applicationGuid,
			TranslationHint : "Hint",
			LastChangeUTCDateTime: "/Date(1412690202721)/"
		} ];
		QUnit.stop();
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			QUnit.start();
			
		}.bind(this));
	},
	teardown : function() {
		
	}
});

asyncTest("Create/Delete Application and Texts with given Guid-Keys", function() {
	var that = this;
	var sServiceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
	var sEntityType = 'ApplicationQueryResults';
	var sUrl = sServiceRoot + '/' + sEntityType;
	var oMessageHandler = new sap.apf.core.MessageHandler();
	
	var sXsrfToken = this.oAuthTestHelper.getXsrfToken();
	var sApplicationName = "ApplicationForUnitTesting";
	
	
	var fnSuccessOnCreateTexts = function(oData, oResponse) {

		if (oData && oData.__batchResponses && oData.__batchResponses[0] &&
				oData.__batchResponses[0].__changeResponses ) {

			equal(oData.__batchResponses[0].__changeResponses.length, 3, "Response contains the 3 newly created records");
			
		} else {
			ok(false, "Error on create texts");
		}

		start();
		
	};
	var fnErrorOnCreateTexts = function(oError) {

		ok(false, "Failed on Create Texts");
		start();
	};
	
	var fnSuccessOnCreateApplication = function(oData, oResponse) {
		/*global OData: false */
		if (oData && oData.Application && oResponse.statusText === "Created") {
			
			that.ApplicationCreatedByThisTest = oData.Application;
			equal(that.ApplicationCreatedByThisTest, that.applicationGuid, "Guid was taken over on creation" );
			
			var oBatchRequest = sap.apf.testhelper.generateBatchRequest(sXsrfToken, sServiceRoot, 'TextElementQueryResults', that.texts,[],  []);

			OData.request(oBatchRequest, fnSuccessOnCreateTexts, fnErrorOnCreateTexts, OData.batchHandler);
			
		} else {
			ok(false, "Create of Application failed.");
			start();
		}
	};
	
	var fnErrorOnCreateApplication = function(oError) {
		ok(false, "Create of Application failed.");
		start();
	};
	
	var doCreateApplication = function() {
		var oPostObject = {
				Application : that.applicationGuid,
				ApplicationName : sApplicationName,
				SemanticObject : "aSemanticalObject"
		};
		var oRequest = {
			requestUri : sUrl,
			method : "POST",
			headers : {
				"x-csrf-token" : sXsrfToken
			},
			data : oPostObject
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccessOnCreateApplication, fnErrorOnCreateApplication);
		
	};
	
	var doDeleteApplication = function() {
		
		var oRequest = {
			requestUri : sUrl + "('" + that.applicationGuid + "')",
			method : "DELETE",
			headers : {
				"x-csrf-token" : sXsrfToken
			}
		};
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, 
				function(oData, oResponse) { 
			ok(1, "delete application"); doCreateApplication(); 
			}, 
			function(oError) { 
				ok(true, "deletion failed"); doCreateApplication(); 
				});	
	};
	doDeleteApplication();
});
