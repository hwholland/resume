/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.hana.NavigationAdapter");
sap.suite.ui.smartbusiness.adapter.hana.NavigationAdapter = function() {
	var _cache = {};
	this.getLinksBySemanticObject = function(oParam) {
    	var oDataModel = new sap.ui.model.odata.ODataModel("/sap/hana/uis/odata/uis_nav_data.xsodata",true);
        var serviceUri = "UIS_US_NAVIGATIONParameters(IN_TAG='" + oParam.semanticObject + "')/Results?$format=json"
        var callReference = oDataModel.read(serviceUri,null, null, true, function(data) {
            oParam.success.call(oParam.context || null, data.results);
            /**
             * Array of 
             * {
             *     id   : so-action~asd
             *     text : '',
             *     applicationAlias : action,
             *     applicationType : "URL"
             * }
             */
        }, function() {
            jQuery.sap.log.error("Error fetching getLinksBySemanticObject : "+oParam.semanticObject);
            oParam.success.call(oParam.context || null, []);
        }, !!oParam.async);
        return callReference ;
	};
	this.getLinksByContext = function(oParam) {
	    return this.getLinksBySemanticObject(oParam);
	};
	this.reset =function() {
		_cache = {};
	};
};
