/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.hana.NavigationAdapter");
sap.suite.ui.smartbusiness.adapter.hana.NavigationAdapter=function(){var _={};this.getLinksBySemanticObject=function(p){var d=new sap.ui.model.odata.ODataModel("/sap/hana/uis/odata/uis_nav_data.xsodata",true);var s="UIS_US_NAVIGATIONParameters(IN_TAG='"+p.semanticObject+"')/Results?$format=json";var c=d.read(s,null,null,true,function(a){p.success.call(p.context||null,a.results);},function(){jQuery.sap.log.error("Error fetching getLinksBySemanticObject : "+p.semanticObject);p.success.call(p.context||null,[]);},!!p.async);return c;};this.getLinksByContext=function(p){return this.getLinksBySemanticObject(p);};this.reset=function(){_={};};};
