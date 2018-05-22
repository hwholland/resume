/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.Configuration");
(function() {
	jQuery.sap.require("sap.suite.ui.smartbusiness.drilldown.lib.Hash"); 
	var ROOT,LIB,sPlatform, adapter_paths, _hanaModelerServiceUrl,_hanaRuntimeServiceUrl;
	var _SBMetadataServicePath, _NavigationService, _CatalogServicePath;
	// SoH
	//*****
	// _SBMetadataServicePath = /sap/hba/r/sb/core/modeler/SMART_BUSINESS.xsodata
	// _NavigationService = /sap/opu/../INETEROP
	// _CatalogServicePath = /sap/hba/r/sb/core/modeler/SMART_BUSINESS.xsodata
	//
	// SimplifiedSuite
	//****************
	// _SBMetadataServicePath = /sap/opu/...
	// _NavigationService = /sap/opu/../INETEROP
	// _CatalogServicePath = /sap/opu/.../catalog
	//
	//HCP
	//***
	// _SBMetadataServicePath = /sap/hba/r/sb/core/modeler/SMART_BUSINESS.xsodata
	// _NavigationService = /sap/1/uis/...
	// _CatalogServicePath = /sap/1/uis/... (?)
	
	//_hanaModelerServiceUrl = "/sap/hba/apps/r/sb/core/modeler/SMART_BUSINESS.xsodata";
	//_hanaRuntimeServiceUrl = "/sap/hba/apps/r/sb/core/runtime/SMART_BUSINESS.xsodata";
	adapter_paths= {
		"abap" : "adapter.abap",
		"hana" : "adapter.hana"
	};
	ROOT= "sap.suite.ui.smartbusiness";
	LIB = ROOT + ".lib";
	/**
	 * There should be a way to know the platform
	 * For the time being reading it from URL
	 */
	//sPlatform = jQuery.sap.getUriParameters().get("platform") || "soh";
	try {
		var sParams = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters();
		if(sParams) {
			if(sParams.sb_metadata) {
				_SBMetadataServicePath = sParams.sb_metadata[0];
			}
			if(sParams.sb_navigation) {
				_NavigationService = sParams.sb_navigation[0];
			}
			if(sParams.sb_catalog) {
				_CatalogServicePath = sParams.sb_catalog[0];
			}
		}
	}catch(e) {
		
	}
	finally {
		_SBMetadataServicePath = _SBMetadataServicePath || jQuery.sap.getUriParameters().get("sb_metadata") || "hana";
		_NavigationService = _NavigationService || jQuery.sap.getUriParameters().get("sb_navigation") || "abap";
		_CatalogServicePath = _CatalogServicePath || jQuery.sap.getUriParameters().get("sb_catalog") || "hana";
	}
//	_SBMetadataServicePath = _SBMetadataServicePath || jQuery.sap.getUriParameters().get("sb_metadata") || "hana";
//	_NavigationService = _NavigationService || jQuery.sap.getUriParameters().get("sb_navigation") || "abap";
//	_CatalogServicePath = _CatalogServicePath || jQuery.sap.getUriParameters().get("sb_catalog") || "hana";

	var Config = {
		getLibraryModulePath : function() {
			return LIB;
		},
		getMetadataPath : function(){
			return ROOT+"."+adapter_paths[_SBMetadataServicePath];
		},
		getNavigationServicePath : function(){
			return ROOT+"."+adapter_paths[_NavigationService];
		},
		getCatalogServicePath : function(){
			return ROOT+"."+adapter_paths[_CatalogServicePath];	
		},
		isMetadataFromABAP:function(){
			return _SBMetadataServicePath.toUpperCase()=="ABAP"
		},
		
		getMetadataServicePlatfrom : function(){
			return _SBMetadataServicePath;
		},
		
		getNavigationServicePlatform : function(){
			return _NavigationService;
		},
		
		getCatalogServicePlatform : function(){
			return _CatalogServicePath;
		}
		
	};

	Config.Constants = {
		TileType : {
			"NT" : "NT",
			"CT" : "CT",
			"TT" : "TT",
			"AT" : "AT",
			"CM" : "CM",
			"DT-AT" : "DT-AT",
			"DT-CT" : "DT-CT",
			"DT-TT" : "DT-TT",
			"DT-CM" : "DT-CM",
			"HT":"HT"
		},
		ChipUrl : {
            "NT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatornumeric/NumericTileChip.xml",
            "CT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorcontribution/ContributionTileChip.xml",
            "TT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorArea/AreaChartTileChip.xml",
            "AT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatordeviation/DeviationTileChip.xml",
            "CM" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatordeviation/ComparisionTileChip.xml",
            "HT":	"/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorHarveyBall/HarveyBallTileChip.xml"
		},
		Platform : {
			"ABAP" : "abap",
			"HANA" : "hana",
			"SOH" : "soh",
			"MODELS" : "modelS",
			"IOT" : "iot"
		},
		SMARTBUSINESS_NULL_VALUE : "sap_smartbusiness_null"
	};
	sap.suite.ui.smartbusiness.Configuration = Config;
})();