/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.designtime.workspace.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
jQuery.sap.require("sap.suite.ui.smartbusiness.Adapter");

sap.ca.scfld.md.ConfigurationBase.extend("sap.suite.ui.smartbusiness.designtime.workspace.Configuration", {
	oServiceParams: {
		serviceList: [{
			name : "SMART_BUSINESS",
			masterCollection : "INDICATORS_MODELER",
			serviceUrl : sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices").getDesigntimeServiceUrl(),
			isDefault : true,
			mockedDataSource : "",
			useBatch : false
		}]
	},

	/**
	 * @inherit
	 */
	getServiceList : function() {
		return this.getServiceParams().serviceList;
	},

	getMasterKeyAttributes : function() {
		//return the key attribute of your master list item
		return ["Id"];
	},
	getExcludedQueryStringParameters : function() {
		return ["sap-client","sap-language"];
	},
	getHanaSystem : function() {
        var hashObj = hasher || window.hasher; 
        var hashArr = hashObj.getHashAsArray();
        if(hashArr && hashArr.length && hashArr[0]) {
               var hashParameters = hashArr[0].substr(hashArr[0].indexOf("?") + 1).split("&");
               for(var i=0,l=hashParameters.length; i<l; i++) {
                     if(hashParameters[i] && (hashParameters[i].indexOf("sap-system") != -1)) {
                            return hashParameters[i].split("=")[1]; 
                     }
               }
        }
        return "";
	},
	getServiceParams : function() {
		var serviceUrl = this.oServiceParams.serviceList[0].serviceUrl;
		if(sap.suite.ui.smartbusiness && sap.suite.ui.smartbusiness.Adapter) {
			serviceUrl = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices").getDesigntimeServiceUrl();
			this.oServiceParams.serviceList[0].serviceUrl = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices").addSystemToServiceUrl(serviceUrl);
		}
		else if(sap.ushell && sap.ushell.Container) {
			this.oServiceParams.serviceList[0].serviceUrl = sap.ushell.Container.getService("URLParsing").addSystemToServiceUrl(serviceUrl, this.getHanaSystem());
		}
        return this.oServiceParams;
	},
});