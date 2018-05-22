jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require('sap.apf.testhelper.modelerHelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');


jQuery.sap.require("sap.apf.modeler.core.instance");
jQuery.sap.require("sap.apf.core.instance");
jQuery.sap.require("sap.apf.utils.startParameter"); 
(function () {
    'use strict';
    
    var isMockServerActive = true;    	
    if(jQuery.sap.getUriParameters().get("responderOff") === "true") {
    	isMockServerActive = false;
    }
    

    module("Import Dirks config", {
    	setup : function() {
    	        	QUnit.stop();
    	        	
    	        	var that = this;
    	        	this.modelerServicePath = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
    	        	this.wcaServicePath = "/sap/hba/apps/wca/dso/s/odata/wca.xsodata";
    	    	  
    	            this.messageHandler = new sap.apf.core.MessageHandler();
    		        this.coreApi = new sap.apf.core.Instance({
    		      			messageHandler : this.messageHandler
    		      		});
    		   		this.configFactory = new sap.apf.core.ConfigurationFactory({messageHandler: this.messageHandler, coreApi : this.coreApi});
    	 
    		   		sap.apf.testhelper.modelerHelper.createConfigurationEditorWithSave(isMockServerActive, that, that.appA, callbackForSetup, callbackAfterSave);
    		   		
    		   		if(isMockServerActive) {
    		   			this.isValidGuid = sap.apf.utils.isValidGuid;
    		   			sap.apf.utils.isValidGuid = function(guid){ return true; };
    		   		}
    		   		
    		   	   function callbackForSetup(){ 
    		   		   return;
    		   	   }
    	            
    	            function callbackAfterSave() {
    	            			  start(); 
    	            }
    	    
    	},
    	appA: {
			ApplicationName : "apf1972-appA",
			SemanticObject : "semObjA"
	}
    });
     
    function removeTextElements(configObject) {
    	var props, obj;
    	
    	for (props in configObject) {
    		
    		if (props === "TextElement" || props === "description" || props === "stepDescription" || props === "UI5Version") {
    			delete configObject[props];
    		} else if (typeof configObject[props]  === "object") {
    			removeTextElements(configObject[props])
    		}
    	}
    }
    
    asyncTest("Import Dirks Config", function() {
    	var that = this;
    	this.modelerCore.importConfiguration(JSON.stringify(configForTesting), undefined, callbackImport);
		
		function callbackImport(configuration, metadata, messageObject) {
			
			ok(!messageObject, "No errors expected");
		
			
		    that.modelerCore.getConfigurationHandler("54529684BA632664E10000000A154CDB", function(configHandler) {
					configHandler.exportConfiguration(configuration, callbackExportConfiguration);
				
		    });
		    
		    function callbackExportConfiguration(configurationString) {
		    	var config = JSON.parse(configurationString);
		    	removeTextElements(config);
		    	var expectedConfig = jQuery.extend({}, true, configForTesting);
		    	removeTextElements(expectedConfig);
		    	deepEqual(config, expectedConfig, "Config export and import is ok");
		    	start();
		    }
		
		}
    });
    

 

}());