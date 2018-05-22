jQuery.sap.declare('sap.apf.testhelper.doubles.resourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
(function() {
		'use strict';
	/**
	 * @description Constructor, simply clones the resource path handler interface object
	 * @param oInject
	 */
	sap.apf.testhelper.doubles.ResourcePathHandler = function(oInject) {
	    var that = this;
	    this.oMessageHandler = oInject.instances.messageHandler;
	    this.oCoreApi = oInject.instances.coreApi;
	
	    sap.apf.testhelper.config.getSampleConfiguration();
	
	    this.doLoadMessageConfigurations = function() {
	        that.loadConfigFromFilePath = function() {
	            oInject.instances.messageHandler.loadConfig(sap.apf.testhelper.doubles.getApfMessageDefinitions(), true);
	            oInject.instances.messageHandler.loadConfig(sap.apf.testhelper.doubles.getApplicationMessageDefinitions());
	        };
	        that.loadConfigFromFilePath();
	        return this;
	    };
	
	    this.getApfMessages = function() {
	        return sap.apf.testhelper.doubles.getApfMessageDefinitions();
	    };
	    this.getAppMessages = function() {
	        return sap.apf.testhelper.doubles.getApplicationMessageDefinitions();
	    };
	    this.getConfigurationProperties = function() {
			return { appName : "appName" };
		};
	};
	
	sap.apf.testhelper.doubles.ResourcePathHandler.prototype = new sap.apf.testhelper.interfaces.IfResourcePathHandler();
	sap.apf.testhelper.doubles.ResourcePathHandler.prototype.constructor = sap.apf.testhelper.doubles.ResourcePathHandler;
	
	/**
	 *
	 * @returns {*[]}
	 */
	sap.apf.testhelper.doubles.getApplicationMessageDefinitions = function () {
	    return [
	        {
	            "code": "8000",
	            "severity": "warning",
	            "key": "8000"
	        },
	        {
	            "code": "8001",
	            "severity": "fatal",
	            "key": "8001"
	        },
	        {
	            "code": "10000",
	            "severity": "warning",
	            "rawText": "I am a rawtext warning message"
	        },
	        {
	            "code": "10001",
	            "severity": "error",
	            "rawText": "I am a rawtext error message"
	        },
	        {
	            "code": "10002",
	            "severity": "error",
	            "logOnly": "true",
	            "rawText": "I am a rawtext error message"
	        },
	        {
	            "code": "10003",
	            "severity": "undefined",
	            "rawText": "I am a rawtext info message"
	        }
	    ];
	};
	
	/**
	 *
	 * @returns {*[]}
	 */
	sap.apf.testhelper.doubles.getApfMessageDefinitions = function () {
	    return [
	        {
	            "code": "3001",
	            "severity": "technError",
	            "text": "Text is not available for the following key: {0}."
	        }
	        ,
	        {
	            "code": "5001",
	            "severity": "technError",
	            "text": "Request {3} to server failed with http status code {0}, http error message {1}, and server response {2}."
	        },
	        {
	            "code": "5002",
	            "severity": "error",
	            "description": "Error in OData request; update of analysis step {0} failed.",
	            "key": "5002"
	        },
	        {
	            "code": "5004",
	            "severity": "fatal",
	            "key": "5004",
	            "description": "Request with ID {0} does not exist in the analytical configuration."
	        },
	        {
	            "code": "5005",
	            "severity": "technError",
	            "text": "Required property {1} is missing in the filter of the OData request for entity type {0}."
	        },
	        {
	            "code": "5006",
	            "severity": "technError",
	            "text": "Inconsistency in data model; non-filterable property {1} is set as required filter for entity type {0}."
	        },
	        {
	            "code": "5015",
	            "severity": "fatal",
	            "key": "5015",
	            "description": "The service for request {0} is not defined in the analytical configuration."
	        },
	        {
	            "code": "5016",
	            "severity": "technError",
	            "text": "Mandatory parameter key property {0} is missing in filter."
	        },
	        {
	            "code": "5018",
	            "severity": "fatal",
	            "key": "5018",
	            "description": "Metadata request {3} to server failed with http status code {0}, http error message {1}, and server response {2}."
	        },
	        {
	            "code": "5019",
	            "severity": "technError",
	            "text": "System query option $orderby for property {1} removed from OData request for entity type {0}."
	        },
	        {
	            "code": "5020",
	            "severity": "fatal",
	            "key": "5020",
	            "description": "Analytical configuration is not available."
	        },
	        {
	            "code": "5021",
	            "severity": "technError",
	            "text": "Timeout"
	        },
	        {
	            "code": "5025",
	            "severity": "fatal",
	            "key": "5025",
	            "description": "SAP client is not contained in the context."
	        },
	        {
	            "code": "5026",
	            "severity": "fatal",
	            "key": "5026",
	            "description": "Logical system cannot be determined for SAP client {0}."
	        },
	        {
	            "code": "5027",
	            "severity": "technError",
	            "text": "Inconsistent parameters; analysis path cannot be saved. Path ID: {0}, path name: {1}, callback function {2}"
	        },
	        {
	            "code": "5028",
	            "severity": "technError",
	            "text": "Binding with ID {0} contains a representation without ID."
	        },
	        {
	            "code": "5029",
	            "severity": "technError",
	            "text": "Binding with ID {0} contains a duplicated representation ID."
	        },
	        {
	            "code": "5100",
	            "severity": "fatal",
	            "key": "5100",
	            "description": "Unexpected internal error: {0}. Contact SAP."
	        },
	        {
	            "code": "5101",
	            "severity": "technError",
	            "text": "Unexpected internal error: {0}. Contact SAP."
	        },
	        {
	            "code": "5102",
	            "severity": "fatal",
	            "key": "5102",
	            "description": "Wrong definition in analytical configuration: {0}"
	        },
	        {
	            "code": "5103",
	            "severity": "technError",
	            "text": "Wrong definition in analytical configuration."
	        },
	        {
	            "code": "5200",
	            "severity": "technError",
	            "text": "Server error during processing a path: {0} {1}"
	        },
	        {
	            "code": "5201",
	            "severity": "error",
	            "key": "5201",
	            "description": "Unknown server error"
	        },
	        {
	            "code": "5202",
	            "severity": "technError",
	            "text": "Error during server request; incorrect URL parameter."
	        },
	        {
	            "code": "5203",
	            "severity": "technError",
	            "text": "Error during server request; data is structured incorrectly."
	        },
	        {
	            "code": "5204",
	            "severity": "error",
	            "key": "5204",
	            "description": "Error during server request; maximum number of analysis steps exceeded."
	        },
	        {
	            "code": "5205",
	            "severity": "error",
	            "key": "5205",
	            "description": "Error during server request; maximum number of analysis paths exceeded."
	        },
	        {
	            "code": "5206",
	            "severity": "error",
	            "key": "5206",
	            "description": "SQL error 268 during server request; insufficient privileges."
	        },
	        {
	            "code": "5207",
	            "severity": "error",
	            "key": "5207",
	            "description": "SQL error 165 during server request; maximum length of analysis path name exceeded."
	        },
	        {
	            "code": "5208",
	            "severity": "error",
	            "key": "5208",
	            "description": "Error during restoring of path; path cannot be retrieved due to unknown ID."
	        },
	        {
	            "code": "5210",
	            "severity": "fatal",
	            "key": "5210",
	            "description": "Error during opening of analysis path. See log."
	        },
	        {
	            "code": "5300",
	            "severity": "fatal",
	            "key": "5300",
	            "description": "An unexpected error occurred. Application has to stop."
	        },
	        {
	            "code": "6001",
	            "severity": "fatal",
	            "key": "6001",
	            "description": "Missing {0} in configuration"
	        },
	        {
	            "code": "6000",
	            "severity": "error",
	            "key": "6000",
	            "description": "Data not available for step {0}"
	        },
	        {
	            "code": "6002",
	            "severity": "error",
	            "key": "6002",
	            "description": "Missing {0} for {1} in configuration"
	        },
	        {
	            "code": "6003",
	            "severity": "error",
	            "key": "6001",
	            "description": "Missing {0} in configuration"
	        },
	        {
	            "code": "6004",
	            "severity": "technError",
	            "text": "Metadata not available for step {0}"
	        },
	        {
	            "code": "7000",
	            "severity": "error",
	            "key": "6001",
	            "description": "Missing {0} in configuration"
	        }
	    ];
	};
}());