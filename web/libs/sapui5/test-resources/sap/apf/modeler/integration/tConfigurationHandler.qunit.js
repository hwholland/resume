/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, apf, modeler, jQuery, module, test, ok, equal, notEqual, expect, sinon, asyncTest, start */

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');

jQuery.sap.require("sap.apf.modeler.core.instance");

(function () {
    'use strict';

    module("M: Configuration Handler with temporary configurations without JSON", {
        setup: function() {
        	QUnit.stop();
        	var that = this;
        	
        	this.authTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
        		this.modelerCore = new sap.apf.modeler.core.Instance({
        			serviceRoot : "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata" 
                });
        		this.modelerCore.getApplicationHandler(function(applicationHandler){
        			that.applicationHandler = applicationHandler;
        			QUnit.start();
        		});
        	}.bind(this));
        	
        },
        teardown: function() {
        	var that = this;
        	var applicationList = this.applicationHandler.getList();
        	applicationList.forEach( function(application) {
        		if(application.ApplicationName.indexOf("apf1972-") === 0) {
        			that.applicationHandler.removeApplication(application.Application, function(response, metadata, messageObject) {
        				if(messageObject !== undefined) {
        					throw new Error("Error in teardown during cleanup");
        				}
        			});
        		}
			});
        },
    	application : {
    			ApplicationName : "apf1972-app",
    			SemanticObject : "semanticObject"
    	}, 
    	configuration : {AnalyticalConfigurationName : "test config"}
    });
    asyncTest("Set and get configuration", function(){
    	expect(3);
    	var tempId;
    	var expectedConfigList =  [{
            AnalyticalConfiguration : "",
            AnalyticalConfigurationName : "test config",
            Application : ""
        }];
    	
    	function callbackSave(id, metadata, messageObject) {
    		expectedConfigList[0].Application = id;
    		function callbackConfigHandler(configHandler) {
    			tempId = configHandler.setConfiguration(this.configuration); 
    			expectedConfigList[0].AnalyticalConfiguration = tempId;
    			
    			deepEqual(configHandler.getList(), expectedConfigList, "Correct configuration list returned");
    			deepEqual(configHandler.getConfiguration(tempId), expectedConfigList[0], "Correct configuration object returned");
    			
    			configHandler.removeAllConfigurations();
    			equal(configHandler.getList().length, 0, "Correct configuration list returned after remove all configurations");
    			
    			QUnit.start();
    		}
    		this.modelerCore.getConfigurationHandler(id, callbackConfigHandler.bind(this));
    	}
    	this.applicationHandler.setAndSave(this.application, callbackSave.bind(this));
    });
}());
