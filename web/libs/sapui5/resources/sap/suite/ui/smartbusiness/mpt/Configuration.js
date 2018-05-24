/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.mpt.Configuration");jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");jQuery.sap.require("sap.ca.scfld.md.app.Application");jQuery.sap.require("sap.suite.ui.smartbusiness.Adapter");sap.ca.scfld.md.ConfigurationBase.extend("sap.suite.ui.smartbusiness.mpt.Configuration",{oServiceParams:{serviceList:[{name:"SMART_BUSINESS",masterCollection:"CHIPS_USER",serviceUrl:sap.suite.ui.smartbusiness.Adapter.getService("RuntimeServices").getRuntimeServiceUrl(),isDefault:true,refreshAfterChange:true,useBatch:false}]},getServiceList:function(){return this.getServiceParams().serviceList;},getMasterKeyAttributes:function(){return["Id"];},getExcludedQueryStringParameters:function(){return["sap-client","sap-language"];},getHanaSystem:function(){var h=hasher||window.hasher;var a=h.getHashAsArray();if(a&&a.length&&a[0]){var b=a[0].substr(a[0].indexOf("?")+1).split("&");for(var i=0,l=b.length;i<l;i++){if(b[i]&&(b[i].indexOf("sap-system")!=-1)){return b[i].split("=")[1];}}}return"";},getServiceParams:function(){var s=this.oServiceParams.serviceList[0].serviceUrl;if(sap.suite.ui.smartbusiness&&sap.suite.ui.smartbusiness.Adapter){s=sap.suite.ui.smartbusiness.Adapter.getService("RuntimeServices").getRuntimeServiceUrl();this.oServiceParams.serviceList[0].serviceUrl=sap.suite.ui.smartbusiness.Adapter.getService("RuntimeServices").addSystemToServiceUrl(s);}else if(sap.ushell&&sap.ushell.Container){this.oServiceParams.serviceList[0].serviceUrl=sap.ushell.Container.getService("URLParsing").addSystemToServiceUrl(s,this.getHanaSystem());}return this.oServiceParams;},getDefaultEmptyMessageKey:function(){return this.oApplicationFacade.getResourceBundle().getText("MULTI_EMPTY_TEXT");}});