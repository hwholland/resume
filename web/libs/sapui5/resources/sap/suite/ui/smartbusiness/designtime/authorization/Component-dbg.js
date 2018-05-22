/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.suite.ui.smartbusiness.designtime.authorization.Component");
jQuery.sap.require("sap.suite.ui.smartbusiness.designtime.authorization.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

sap.ca.scfld.md.ComponentBase.extend("sap.suite.ui.smartbusiness.designtime.authorization.Component", {
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name" : "Master Detail Sample",
		"version" : "1.0.0-SNAPSHOT",
		"library" : "sap.suite.ui.smartbusiness.designtime.authorization",
		"includes" : ["../../lib/formatters.js","../../lib/Util.js"],
			"dependencies" : {
			"libs" : ["sap.m"],
		"components" : []
		},
		"config" : {
			"resourceBundle" : "i18n/i18n.properties",
			"titleResource" : "SHELL_TITLE",
			"icon" : "sap-icon://Fiori5/F0816",
			"favIcon" : "../../../../../../../resources/sap/ca/ui/themes/base/img/favicon/F0816_Manage_Authorizations.ico",
			"homeScreenIconPhone" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0816_Manage_Authorizations/57_iPhone_Desktop_Launch.png",
			"homeScreenIconPhone@2" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0816_Manage_Authorizations/114_iPhone-Retina_Web_Clip.png",
			"homeScreenIconTablet" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0816_Manage_Authorizations/72_iPad_Desktop_Launch.png",
			"homeScreenIconTablet@2" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0816_Manage_Authorizations/144_iPad_Retina_Web_Clip.png",
			"startupImage320x460" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
			"startupImage640x920" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
			"startupImage640x1096" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
			"startupImage768x1004" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
			"startupImage748x1024" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
			"startupImage1536x2008" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
			"startupImage1496x2048" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
	},
	viewPath : "sap.suite.ui.smartbusiness.designtime.authorization.view",
	
	// masterPageRoutes : {
	// // fill the routes to your master pages in here. The application will start with a navigation to route "master"
	// leading to master screen S2.
	// // If this is not desired please define your own route "master"
	// },
	// detailPageRoutes : {
	// //fill the routes to your detail pages in here. The application will navigate from the master page to route
	// //"detail" leading to detail screen S3.
	// If this is not desired please define your own route "detail"
	//		"toS5" : {
	//			"pattern" : "toS5",
	//			"view" : "S5",
	//		}
	//},
	fullScreenPageRoutes : {
		// fill the routes to your full screen pages in here.
		"subDetail" : {
			"pattern" : "subDetail/{contextPath}",
			"view" : "S4",
		}
	}
}),

/**
 * Initialize the application
 *
 * @returns {sap.ui.core.Control} the content
 */
createContent : function() {

	var oViewData = {
		component : this
	};
	return sap.ui.view({
		viewName : "sap.suite.ui.smartbusiness.designtime.authorization.Main",
		type : sap.ui.core.mvc.ViewType.XML,
		viewData : oViewData
	});
}
});