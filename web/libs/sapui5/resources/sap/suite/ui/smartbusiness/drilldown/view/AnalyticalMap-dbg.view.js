/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.require("sap.ui.vbm.AnalyticMap");
(function () {
    "use strict";

    sap.ui.jsview("sap.suite.ui.smartbusiness.drilldown.view.AnalyticalMap", {
        getControllerName: function () {
            return "sap.suite.ui.smartbusiness.drilldown.view.AnalyticalMap";
        },
        createContent: function (oController) {
			//sap.ui.vbm.AnalyticMap.GeoJSONURL  =  jQuery.sap.getModulePath("sap.suite.ui.smartbusiness.lib")+"/L0.json"

        	this.analyticalMap = new sap.ui.vbm.AnalyticMap({
				width : "100%",
				plugin: false
			});
        	
        	return this.analyticalMap;
        }
    });
}());