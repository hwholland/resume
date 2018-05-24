/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.hana.CatalogServicesAdapter");
sap.suite.ui.smartbusiness.adapter.hana.CatalogServicesAdapter=function(){var g=function(e,E){if(E){return E.evaluationValues;}else{var v=[];e.VALUES["results"].forEach(function(j){delete j.__metadata;var o={};for(var c in j){if(j.hasOwnProperty(c)){o[c]=j[c];}}v.push(o);});return v;}};var _=function(f){var c=[];if(f&&f.length){f.forEach(function(e){var o={};o["NAME"]=e[0];o["OPERATOR"]=e[1];o["VALUE_1"]=e[2];o["VALUE_2"]=e[3];o["TYPE"]="FI";c.push(o);});}return c;};var a=function(u,s){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService){var c=sap.ushell.Container.getService("URLParsing");if(c){u=c.addSystemToServiceUrl(u,s);}}return u;};var p=function(c,s,C,f){var d="/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata";d=a(d,s);var O=sap.suite.ui.smartbusiness.lib.Util.odata.getModelByServiceUri(d);O.create("/CHIPS_USER",c,null,function(){C.call();},function(e){f.call(null,e);},false);};var b=function(c,s,C,f){var d="/sap/hba/r/sb/core/logic/__token.xsjs";d=a(d,s);jQuery.ajax({url:d,type:"HEAD",async:false,headers:{"X-CSRF-Token":"Fetch"},success:function(e,h,x){d="/sap/hba/r/sb/core/logic/addToCatalog.xsjs";d=a(d,s);var t=x.getResponseHeader("x-csrf-token");jQuery.ajax({url:d,type:"POST",async:false,data:encodeURIComponent(JSON.stringify(c)),dataType:"json",headers:{"x-csrf-token":t},success:function(e){C.call(null,e);},error:function(i){f.call(null,i);}});},error:function(e){f.call(null,e);}});};this.savePersonalizedTile=function(P){var r={},R,s,c,C;if(P.evaluationId&&P.tileType){var d=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({id:P.evaluationId,cache:true,filters:true,thresholds:true,useRuntimeService:true,sapSystem:P.sapSystem});if(d&&d.ID){var T=Date.now()+"";var M={};try{R=sap.suite.ui.smartbusiness.Adapter.getService("RuntimeServices");s=sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters();c=s["chipId"][0];C=R.getChipById({id:c,isActive:1});C=C.CHIP;}catch(e){return{status:"Failed",message:e.message};}M["tileType"]=C.tileType;M["url"]=C.url;M["description"]=P.title||d.TITLE;M["title"]=d.INDICATOR_TITLE;M["catalogId"]="HANA_CATALOG";M["configuration"]={};M["evaluationId"]=C.evaluationId;M["keywords"]=C.keywords;oChipConfiguration=JSON.parse(C.configuration);oChipConfiguration.isSufficient="1";oChipConfiguration.timestamp=T;oChipTileConfiguration=JSON.parse(oChipConfiguration.tileConfiguration);var t=JSON.parse(oChipTileConfiguration.TILE_PROPERTIES);t.id="_____CHIPID__________CHIPID_____";oChipTileConfiguration.TILE_PROPERTIES=JSON.stringify(t);oChipTileConfiguration.ADDITIONAL_FILTERS=JSON.stringify(_(P.additionalFilters));var E=g(d,P.evaluationValues);oChipTileConfiguration.EVALUATION_VALUES=JSON.stringify(E);M.configuration={tileConfiguration:JSON.stringify(oChipTileConfiguration)};var m=JSON.stringify(M.configuration);if(m.length>4096){oChipTileConfiguration.EVALUATION_FILTERS=JSON.stringify([]);M.configuration.isSufficient="0";M.configuration={tileConfiguration:JSON.stringify(oChipTileConfiguration)};m=JSON.stringify(M.configuration);if(m.length>4096){oChipTileConfiguration.EVALUATION_VALUES=JSON.stringify([]);}}M.configuration=m;b(M,P.sapSystem,function(f){r.status="Success",r.chipId=f.chipId,r.message="Tile Created Successfully";},function(f){r.status="Failed",r.message="Error Creating Tile";r.errorDescription=f;});}else{r.status="Failed",r.message="Invalid Evaluation Id : "+P.evaluationId;}}else{r.status="Failed",r.message="Mandatory Param evaluationId or TileType is Missing";}if(r.status=='Success'){P.success(r);}else{P.error(r);}return r;};};