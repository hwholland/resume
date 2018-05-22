/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.Adapter");
(function() {
	jQuery.sap.require("sap.suite.ui.smartbusiness.Configuration");
	var SERVICES = {
			"Navigation" : {
				func : "getNavigationServicePath"
			},
			"ModelerServices" : {
				func : "getMetadataPath"
			},
			"CatalogServices" : {
				func : "getCatalogServicePath"
			},
			"DrilldownServices":{
				func:"getMetadataPath"
			},
			"RuntimeServices":{
				func:"getMetadataPath"
			}
		};
	var oConfig = sap.suite.ui.smartbusiness.Configuration;
	var _cache = {};
	var getPlatformPath = function(oConfig, sServiceName) {
		return oConfig[SERVICES[sServiceName]["func"]]() +"."+sServiceName;
	};
	var Adapter = function() {
		this.getService = function(sServiceName, oParam) {
			oParam = oParam || {};
			var module, adapterPath, service, tempObj, cacheKey;
			if(!SERVICES[sServiceName]) {
				throw new Error("Service '"+sServiceName+"' Not Supported!");
			}
			module = oConfig.getLibraryModulePath()+"."+sServiceName;
			cacheKey = module + "_" + JSON.stringify(oParam);
			if(_cache[cacheKey]) {
				return _cache[cacheKey];
			}
			jQuery.sap.require(module);
			service = jQuery.sap.getObject(module);
			if(service.hasAdapter) {
				adapterPath = getPlatformPath(oConfig, sServiceName)+"Adapter";
				jQuery.sap.require(adapterPath);
				service = jQuery.sap.getObject(adapterPath);
			}
			if(service instanceof Function) {
				var tempObj = new service(oParam);
			} else {
				tempObj = service;
			}
			tempObj  = jQuery.sap.newObject(tempObj);
			_cache[cacheKey] = tempObj;
			return _cache[cacheKey]
		};
		this.getCache = function() {
			return _cache;
		}
	};
	sap.suite.ui.smartbusiness.Adapter = new Adapter();
})();
