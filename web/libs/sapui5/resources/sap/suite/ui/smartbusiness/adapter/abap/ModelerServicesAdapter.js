/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.abap.ModelerServicesAdapter");
sap.suite.ui.smartbusiness.adapter.abap.ModelerServicesAdapter=function(){var t=this;this.cache=this.cache||{};var _={DDA_COLUMN:["EVALUATION_ID",{name:"IS_ACTIVE",formatter:function(s){return parseInt(s);}},"CONFIGURATION_ID","NAME","TYPE"],DDA_CHART:["EVALUATION_ID","IS_ACTIVE","CONFIGURATION_ID"],EVALUATIONS:["ID","IS_ACTIVE"],EvaluationTexts:["ID","IS_ACTIVE","LANGUAGE"],IndicatorTexts:["ID","IS_ACTIVE","LANGUAGE"],INDICATORS:["ID","IS_ACTIVE"],IndicatorTexts:["ID","IS_ACTIVE","LANGUAGE"],EVALUATION_FILTERS:["ID","IS_ACTIVE","TYPE","NAME","VALUE_1","OPERATOR","VALUE_2"],FILTERS:["ID","IS_ACTIVE","TYPE","NAME","VALUE_1","OPERATOR","VALUE_2"],EVALUATION_VALUES:["ID","IS_ACTIVE","TYPE"],TAGS:["ID","IS_ACTIVE","TYPE","TAG"],PROPERTIES:["ID","IS_ACTIVE","TYPE","NAME","VALUE"],CHIPS:["ID","IS_ACTIVE"],INDICATOR:[],EVALUATION:[],CHIPS:[],ACTIVATE_INDICATOR:[],ACTIVATE_EVALUATION:[],INDICATOR_FAVOURITE:[],EVALUATION_FAVOURITE:[],ASSOCIATION:[],ACTIVATE_ASSOCIATION:[],ACTIVATE_CHIP:[],AUTHORIZATION:[]};_ENTITYSETMAP={EVALUATION:"EVALUATIONS",CHIP:"CHIPS",INDICATOR:"INDICATORS",FILTERS:"EVALUATION_FILTERS",TEXTS:"EVALUATION_TEXTS",VALUES:"EVALUATION_VALUES"};_DATATYPE={IS_ACTIVE:"int"};function b(e){var a={"INDICATORS":{"indicator":{"entity":"INDICATORS","type":"INDICATOR"},"texts":{"entity":"TEXTS","type":"INDICATOR_TEXT"},"evaluations":{"entity":"EVALUATIONS","type":"EVALUATION"},"tags":{"entity":"TAGS","type":"TAG"},"properties":{"entity":"PROPERTIES","type":"PROPERTY"},"associations":{"entity":"ASSOCIATIONS","type":"ASSOCIATION"},"association_source":{"entity":"ASSOCIATION_SOURCE","type":"ASSOCIATION"},"association_target":{"entity":"ASSOCIATION_TARGET","type":"ASSOCIATION"}},"INDICATORS_MODELER":{"indicator":{"entity":"INDICATORS_MODELER","type":"INDICATOR"},"texts":{"entity":"TEXTS","type":"INDICATOR_TEXT"},"evaluations":{"entity":"EVALUATIONS","type":"EVALUATION"},"tags":{"entity":"TAGS","type":"TAG"},"properties":{"entity":"PROPERTIES","type":"PROPERTY"},"associations":{"entity":"ASSOCIATIONS","type":"ASSOCIATION"},"association_source":{"entity":"ASSOCIATION_SOURCE","type":"ASSOCIATION"},"association_target":{"entity":"ASSOCIATION_TARGET","type":"ASSOCIATION"}},"EVALUATIONS":{"evaluation":{"entity":"EVALUATIONS","type":"EVALUATION"},"texts":{"entity":"TEXTS","type":"EVALUATION_TEXT"},"chips":{"entity":"CHIPS","type":"CHIP"},"tags":{"entity":"TAGS","type":"TAG"},"properties":{"entity":"PROPERTIES","type":"PROPERTY"},"indicator":{"entity":"INDICATOR_INFO","type":"INDICATOR"},"filters":{"entity":"FILTERS","type":"FILTER"},"values":{"entity":"VALUES","type":"VALUE"},"dda_configurations":{"entity":"DDA_CONFIGURATIONS","type":"DDA_MASTER"},"dda_header_tiles":{"entity":"DDA_HEADER_TILES","type":"DDA_HEADER"}},"EVALUATIONS_MODELER":{"evaluation":{"entity":"EVALUATIONS_MODELER","type":"EVALUATION"},"texts":{"entity":"TEXTS","type":"EVALUATION_TEXT"},"chips":{"entity":"CHIPS","type":"CHIP"},"tags":{"entity":"TAGS","type":"TAG"},"properties":{"entity":"PROPERTIES","type":"PROPERTY"},"indicator":{"entity":"INDICATOR_INFO","type":"INDICATOR"},"filters":{"entity":"FILTERS","type":"FILTER"},"values":{"entity":"VALUES","type":"VALUE"},"dda_configurations":{"entity":"DDA_CONFIGURATIONS","type":"DDA_MASTER"},"dda_header_tiles":{"entity":"DDA_HEADER_TILES","type":"DDA_HEADER"},"texts_for_chip":{"entity":"TEXTS_FOR_CHIP","type":"EVALUATION_TEXT"}},"CHIPS":{"texts":{"entity":"TEXTS","type":"CHIP_TEXT"},"evaluation":{"entity":"EVALUATION_INFO","type":"EVALUATION"},"dda_configurations":{"entity":"DDA_CONFIGURATIONS","type":"DDA_MASTER"}}};return a[e];};function f(e){return beans={"INDICATOR":{"bean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","COUNTER":"COUNTER","TITLE":"TITLE","DESCRIPTION":"DESCRIPTION","TYPE":"TYPE","DATA_SPECIFICATION":"DATA_SPECIFICATION","GOAL_TYPE":"GOAL_TYPE","ODATA_URL":"ODATA_URL","ODATA_ENTITYSET":"ODATA_ENTITYSET","VIEW_NAME":"VIEW_NAME","COLUMN_NAME":"COLUMN_NAME","OWNER_NAME":"OWNER_NAME","OWNER_E_MAIL":"OWNER_E_MAIL","OWNER_ID":"OWNER_ID","CREATED_BY":"CREATED_BY","CREATED_ON":"CREATED_ON","CHANGED_BY":"CHANGED_BY","CHANGED_ON":"CHANGED_ON","ENTITY_TYPE":"ENTITY_TYPE","ODATA_PROPERTY":"ODATA_PROPERTY","SEMANTIC_OBJECT":"SEMANTIC_OBJECT","ACTION":"ACTION","EVALUATION_COUNT":"EVALUATION_COUNT","MANUAL_ENTRY":"MANUAL_ENTRY","LAST_WORKED_ON":"LAST_WORKED_ON","ASSOCIATION_SOURCE_COUNT":"ASSOCIATION_SOURCE_COUNT","ASSOCIATION_TARGET_COUNT":"ASSOCIATION_TARGET_COUNT"},"reverseBean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","COUNTER":"COUNTER","TITLE":"TITLE","DESCRIPTION":"DESCRIPTION","TYPE":"TYPE","DATA_SPECIFICATION":"DATA_SPECIFICATION","GOAL_TYPE":"GOAL_TYPE","ODATA_URL":"ODATA_URL","ODATA_ENTITYSET":"ODATA_ENTITYSET","VIEW_NAME":"VIEW_NAME","COLUMN_NAME":"COLUMN_NAME","OWNER_NAME":"OWNER_NAME","OWNER_E_MAIL":"OWNER_E_MAIL","OWNER_ID":"OWNER_ID","CREATED_BY":"CREATED_BY","CREATED_ON":"CREATED_ON","CHANGED_BY":"CHANGED_BY","CHANGED_ON":"CHANGED_ON","ENTITY_TYPE":"ENTITY_TYPE","ODATA_PROPERTY":"ODATA_PROPERTY","SEMANTIC_OBJECT":"SEMANTIC_OBJECT","ACTION":"ACTION","EVALUATION_COUNT":"EVALUATION_COUNT","MANUAL_ENTRY":"MANUAL_ENTRY","LAST_WORKED_ON":"LAST_WORKED_ON","ASSOCIATION_SOURCE_COUNT":"ASSOCIATION_SOURCE_COUNT","ASSOCIATION_TARGET_COUNT":"ASSOCIATION_TARGET_COUNT"}},"EVALUATION":{"bean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","COUNTER":"COUNTER","TITLE":"TITLE","DESCRIPTION":"DESCRIPTION","INDICATOR":"INDICATOR","SCALING":"SCALING","ODATA_URL":"ODATA_URL","ODATA_ENTITYSET":"ODATA_ENTITYSET","VIEW_NAME":"VIEW_NAME","COLUMN_NAME":"COLUMN_NAME","OWNER_NAME":"OWNER_NAME","OWNER_E_MAIL":"OWNER_E_MAIL","OWNER_ID":"OWNER_ID","CREATED_BY":"CREATED_BY","CREATED_ON":"CREATED_ON","CHANGED_BY":"CHANGED_BY","CHANGED_ON":"CHANGED_ON","ENTITY_TYPE":"ENTITY_TYPE","ODATA_PROPERTY":"ODATA_PROPERTY","SEMANTIC_OBJECT":"SEMANTIC_OBJECT","ACTION":"ACTION","VALUES_SOURCE":"VALUES_SOURCE","INDICATOR_TYPE":"INDICATOR_TYPE","DATA_SPECIFICATION":"DATA_SPECIFICATION","GOAL_TYPE":"GOAL_TYPE","MANUAL_ENTRY":"MANUAL_ENTRY","LAST_WORKED_ON":"LAST_WORKED_ON","CHIPS_COUNT":"CHIPS_COUNT","INDICATOR_TITLE":"INDICATOR_TITLE","VIEWS_COUNT":"VIEWS_COUNT","NAMESPACE":"NAMESPACE"},"reverseBean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","COUNTER":"COUNTER","TITLE":"TITLE","DESCRIPTION":"DESCRIPTION","INDICATOR":"INDICATOR","SCALING":"SCALING","ODATA_URL":"ODATA_URL","ODATA_ENTITYSET":"ODATA_ENTITYSET","VIEW_NAME":"VIEW_NAME","COLUMN_NAME":"COLUMN_NAME","OWNER_NAME":"OWNER_NAME","OWNER_E_MAIL":"OWNER_E_MAIL","OWNER_ID":"OWNER_ID","CREATED_BY":"CREATED_BY","CREATED_ON":"CREATED_ON","CHANGED_BY":"CHANGED_BY","CHANGED_ON":"CHANGED_ON","ENTITY_TYPE":"ENTITY_TYPE","ODATA_PROPERTY":"ODATA_PROPERTY","SEMANTIC_OBJECT":"SEMANTIC_OBJECT","ACTION":"ACTION","VALUES_SOURCE":"VALUES_SOURCE","INDICATOR_TYPE":"INDICATOR_TYPE","DATA_SPECIFICATION":"DATA_SPECIFICATION","GOAL_TYPE":"GOAL_TYPE","MANUAL_ENTRY":"MANUAL_ENTRY","LAST_WORKED_ON":"LAST_WORKED_ON","CHIPS_COUNT":"CHIPS_COUNT","INDICATOR_TITLE":"INDICATOR_TITLE","VIEWS_COUNT":"VIEWS_COUNT"}},"CHIP":{"bean":{"ID":"id","IS_ACTIVE":"isActive","EVALUATION_ID":"evaluationId","CATALOG_ID":"catalogId","TYPE":"tileType","COUNTER":"COUNTER","CREATED_BY":"createdBy","CHANGED_BY":"changedBy","CREATED_ON":"createdOn","CHANGED_ON":"changedOn"},"reverseBean":{"id":"ID","isActive":"IS_ACTIVE","evaluationId":"EVALUATION_ID","catalogId":"CATALOG_ID","tileType":"TYPE","COUNTER":"COUNTER","createdBy":"CREATED_BY","changedBy":"CHANGED_BY","createdOn":"CREATED_ON","changedOn":"CHANGED_ON"}},"ASSOCIATION":{"bean":{"NAMESPACE":"NAMESPACE","TYPE":"TYPE","SOURCE_INDICATOR":"SOURCE_INDICATOR","TARGET_INDICATOR":"TARGET_INDICATOR","IS_ACTIVE":"IS_ACTIVE","COUNTER":"COUNTER","CREATED_BY":"CREATED_BY","CREATED_ON":"CREATED_ON","CHANGED_BY":"CHANGED_BY","CHANGED_ON":"CHANGED_ON","SOURCE_INDICATOR_TITLE":"SOURCE_INDICATOR_TITLE","TARGET_INDICATOR_TITLE":"TARGET_INDICATOR_TITLE"},"reverseBean":{"NAMESPACE":"NAMESPACE","TYPE":"TYPE","SOURCE_INDICATOR":"SOURCE_INDICATOR","TARGET_INDICATOR":"TARGET_INDICATOR","IS_ACTIVE":"IS_ACTIVE","COUNTER":"COUNTER","CREATED_BY":"CREATED_BY","CREATED_ON":"CREATED_ON","CHANGED_BY":"CHANGED_BY","CHANGED_ON":"CHANGED_ON","SOURCE_INDICATOR_TITLE":"SOURCE_INDICATOR_TITLE","TARGET_INDICATOR_TITLE":"TARGET_INDICATOR_TITLE"}},"TAG":{"bean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","TYPE":"TYPE","TAG":"TAG"},"reverseBean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","TYPE":"TYPE","TAG":"TAG"}},"PROPERTY":{"bean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","TYPE":"TYPE","NAME":"NAME","VALUE":"VALUE"},"reverseBean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","TYPE":"TYPE","NAME":"NAME","VALUE":"VALUE"}},"FILTER":{"bean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","TYPE":"TYPE","NAME":"NAME","VALUE_1":"VALUE_1","OPERATOR":"OPERATOR","VALUE_2":"VALUE_2"},"reverseBean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","TYPE":"TYPE","NAME":"NAME","VALUE_1":"VALUE_1","OPERATOR":"OPERATOR","VALUE_2":"VALUE_2"}},"VALUE":{"bean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","TYPE":"TYPE","FIXED":"FIXED","COLUMN_NAME":"COLUMN_NAME","ODATA_PROPERTY":"ODATA_PROPERTY"},"reverseBean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","TYPE":"TYPE","FIXED":"FIXED","COLUMN_NAME":"COLUMN_NAME","ODATA_PROPERTY":"ODATA_PROPERTY"}},"DDA_MASTER":{"bean":{"EVALUATION_ID":"EVALUATION_ID","CONFIGURATION_ID":"CONFIGURATION_ID","CONFIG_ORDER":"CONFIG_ORDER","TEXT":"TEXT","IS_ACTIVE":"IS_ACTIVE"},"reverseBean":{"EVALUATION_ID":"EVALUATION_ID","CONFIGURATION_ID":"CONFIGURATION_ID","CONFIG_ORDER":"CONFIG_ORDER","TEXT":"TEXT","IS_ACTIVE":"IS_ACTIVE"}},"DDA_HEADER":{"bean":{"EVALUATION_ID":"EVALUATION_ID","CONFIGURATION_ID":"CONFIGURATION_ID","REFERENCE_EVALUATION_ID":"REFERENCE_EVALUATION_ID","VISUALIZATION_TYPE":"VISUALIZATION_TYPE","VISUALIZATION_ORDER":"VISUALIZATION_ORDER","VISIBILITY":"VISIBILITY","DIMENSION":"DIMENSION","IS_ACTIVE":"IS_ACTIVE","CONFIGURATION":"CONFIGURATION"},"reverseBean":{"EVALUATION_ID":"EVALUATION_ID","CONFIGURATION_ID":"CONFIGURATION_ID","REFERENCE_EVALUATION_ID":"REFERENCE_EVALUATION_ID","VISUALIZATION_TYPE":"VISUALIZATION_TYPE","VISUALIZATION_ORDER":"VISUALIZATION_ORDER","VISIBILITY":"VISIBILITY","DIMENSION":"DIMENSION","IS_ACTIVE":"IS_ACTIVE","CONFIGURATION":"CONFIGURATION"}},"LANGUAGE":{"bean":{"SPRAS":"SPRAS","LAISO":"LAISO","SPTXT":"SPTXT"},"reverseBean":{"SPRAS":"SPRAS","LAISO":"LAISO","SPTXT":"SPTXT"}},"INDICATOR_TEXT":{"bean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","LANGUAGE":"LANGUAGE","TITLE":"TITLE","DESCRIPTION":"DESCRIPTION"},"reverseBean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","LANGUAGE":"LANGUAGE","TITLE":"TITLE","DESCRIPTION":"DESCRIPTION"}},"EVALUATION_TEXT":{"bean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","LANGUAGE":"LANGUAGE","TITLE":"TITLE","DESCRIPTION":"DESCRIPTION"},"reverseBean":{"ID":"ID","IS_ACTIVE":"IS_ACTIVE","LANGUAGE":"LANGUAGE","TITLE":"TITLE","DESCRIPTION":"DESCRIPTION"}},"CHIP_TEXT":{"bean":{"ID":"id","IS_ACTIVE":"isActive","LANGUAGE":"language","CATALOG_ID":"catalogId","TITLE":"title","DESCRIPTION":"description"},"reverseBean":{"id":"ID","isActive":"IS_ACTIVE","language":"LANGUAGE","catalogId":"CATALOG_ID","title":"TITLE","description":"DESCRIPTION"}}};};this.formBean=function(a,e,c){var j={};var m=[];var p={};var A={};var E=false;if(c){j=beans[e].bean;}else{j=beans[e].reverseBean;}if(a instanceof Array){E=true;}else{a=[a];}for(var i=0,l=a.length;i<l;i++){p={};A=a[i];for(var F in j){if(j.hasOwnProperty(F)){if(A[F]!==undefined&&A[F]!==null){p[j[F]]=A[F];}}}m.push(p);}if(!E){m=m[0];}return m;};function g(){t.cache.designtimeModel=t.cache.designtimeModel||new sap.ui.model.odata.ODataModel(t.getDesigntimeServiceUrl(),true);return t.cache.designtimeModel;};function h(){t.cache.runtimeModel=t.cache.runtimeModel||new sap.ui.model.odata.ODataModel(t.getRuntimeServiceUrl(),true);return t.cache.runtimeModel;};function k(){return"/sap/opu/odata/SSB/SMART_BUSINESS_MODELER_SRV";};this.getDesigntimeServiceUrl=function(){jQuery.sap.log.info("Abap Adapter --> Designtime Service URI");return"/sap/opu/odata/SSB/SMART_BUSINESS_MODELER_SRV";};this.getRuntimeServiceUrl=function(){jQuery.sap.log.info("Abap Adapter --> Runtime Service URI");return"/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV";};function n(a){return jQuery.sap.encodeURL(a);};this.getSessionUser=function(a){jQuery.sap.log.info("Abap Adapter --> Calling Session User");var c=null;var i=a.success;var j=a.error;if(t.cache.sessionUser){c=t.cache.sessionUser;jQuery.sap.log.info("Abap Adapter --> Current Session User From Cache - "+t.cache.sessionUser);if(i){i(c);}}else{try{if(!(sap.ushell&&sap.ushell.Container)){jQuery.sap.require(sap.ushell.Container);}c=sap.ushell.Container.getUser().getId();t.cache.sessionUser=c;jQuery.sap.log.info("Abap Adapter --> Current Session User - "+t.cache.sessionUser);if(i){i(c);}}catch(e){jQuery.sap.log.error("Abap Adapter --> Fetching Session User Failed");if(j){j(d,s,x);}}}return t.cache.sessionUser;};this.getSystemInfo=function(a){jQuery.sap.log.info("Abap Adapter --> Fetching System Info");var e=null;var c=a.success;var i=a.error;function j(d){if(d===null||d===undefined){d={};d.SYSFLAG=1;}if(d.length&&d[0]){e=parseInt(d[0].SYSFLAG,10);}if(jQuery.sap.getUriParameters().get("env")=="cust"){e=0;}t.cache.env=e;jQuery.sap.log.info("Abap Adapter --> System Environment - "+((t.cache.env)?"SAP":"Non-SAP"));if(c){c(e);}}function l(d,s,x){jQuery.sap.log.error("Abap Adapter --> Fetching System Info Failed");if(i){i(d,s,x);}}if(t.cache.env==undefined){t.getDataByEntity({entity:"SysInfoSet",async:a.async||false,success:j,error:l,model:a.model});}else{jQuery.sap.log.info("Abap Adapter --> System Environment From Cache - "+((t.cache.env)?"SAP":"Non-SAP"));if(c){c(t.cache.env);}}return t.cache.env;};this.getAllLanguages=function(e){var l=undefined;var j=e.success;var m=e.error;var A=function(F){F=(F.results)?F.results:F;if(F.length){if(F.length==1){var S={LAISO:{},SPRAS:{}};S.LAISO[F[0]["LAISO"]]=F[0]["SPRAS"];S.SPRAS[F[0]["SPRAS"]]=F[0]["LAISO"];}else{S=F.reduce(function(p,c,i,a){S=S||{};S.LAISO=S.LAISO||{};S.SPRAS=S.SPRAS||{};if(i==1){S.LAISO[a[0]["LAISO"]]=a[0]["SPRAS"];S.SPRAS[a[0]["SPRAS"]]=a[0]["LAISO"];}S.LAISO[a[i]["LAISO"]]=a[i]["SPRAS"];S.SPRAS[a[i]["SPRAS"]]=a[i]["LAISO"];return S;});}var G=F;t.cache.SAP_LANGUAGES=S;t.cache.SAP_LANGUAGE_ARRAY=G;t.cache.localeIsoLanguage=sap.ui.getCore().getConfiguration().getLocale().getLanguage().split("-")[0].toUpperCase();l=S.LAISO[t.cache.localeIsoLanguage];t.cache.localLanguage=l;t.cache.localeSapLanguage=l;jQuery.sap.log.info("Abap Adapter --> Logon Language - "+t.cache.localeIsoLanguage+" - "+t.cache.localeSapLanguage);}if(j){j(S,G,l);}};var E=function(d,s,x){if(m){m(d,s,x);}};if(t.cache.SAP_LANGUAGE_ARRAY&&t.cache.SAP_LANGUAGES){jQuery.sap.log.info("Abap Adapter --> Picking All Languages from cache");t.cache.localeIsoLanguage=sap.ui.getCore().getConfiguration().getLocale().getLanguage().split("-")[0].toUpperCase();t.cache.localLanguage=t.cache.SAP_LANGUAGES.LAISO[t.cache.localeIsoLanguage];t.cache.localeSapLanguage=t.cache.localLanguage;if(j){j(t.cache.SAP_LANGUAGES,t.cache.SAP_LANGUAGE_ARRAY,t.cache.localLanguage);}}else{jQuery.sap.log.info("Abap Adapter --> Calling All Languages");this.getDataByEntity({entity:"LANGUAGE",async:(e.async||false),success:A,error:E,model:e.model});}};this.getKPIById=function(a){jQuery.sap.log.info("Abap Adapter --> Calling KPI Data");var t=this;if(!(a.ID&&a.IS_ACTIVE!==null&&a.IS_ACTIVE!==undefined)&&!(a.context)){throw new Error("Failed to get Indicator Id or Status for data fetch");return null;}var c=null;var j=a.context||null;var m=a.model||g();var p={};if(a.context){c=a.context.sPath;if(a.context.getObject()){a.ID=a.context.getObject().ID;a.IS_ACTIVE=a.context.getObject().IS_ACTIVE;}else{a.ID=c.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');a.IS_ACTIVE=((c.indexOf("IS_ACTIVE=0")!=-1)||(c.indexOf("IS_ACTIVE=1")!=-1))?((c.indexOf("IS_ACTIVE=0")!=-1)?0:1):null;}}else if(a.ID&&a.IS_ACTIVE!==null&&a.IS_ACTIVE!==undefined){a.entity=a.entity||"/INDICATORS_MODELER";a.entity=(a.entity.indexOf("/")!=0)?("/"+a.entity):a.entity;c=a.entity+"(ID='"+a.ID+"',IS_ACTIVE="+a.IS_ACTIVE+")";j=new sap.ui.model.Context(m,c);}var s=a.success;var e=a.error;var E=[];var F=[];if(!(a.noIndicator)){if(j&&j.getObject()&&Object.keys(j.getObject())&&Object.keys(j)){p.INDICATOR=j.getObject();}else{E.push(m.createBatchOperation(c,"GET"));F.push("INDICATOR");}}if(a.tags){E.push(m.createBatchOperation(c+"/TAGS","GET"));F.push("TAGS");}if(a.properties){E.push(m.createBatchOperation(c+"/PROPERTIES","GET"));F.push("PROPERTIES");}if(a.texts){E.push(m.createBatchOperation(c+"/TEXTS","GET"));F.push("TEXTS");}if(a.evaluations){E.push(m.createBatchOperation(c+"/EVALUATIONS","GET"));F.push("EVALUATIONS");}if(a.associations&&a.associationProperties){E.push(m.createBatchOperation("/ASSOCIATIONS_MODELER?$filter="+n("SOURCE_INDICATOR eq '"+a.ID+"' or TARGET_INDICATOR eq '"+a.ID+"'")+"&$expand=PROPERTIES","GET"));F.push("ASSOCIATIONS");}else if(a.associations){E.push(m.createBatchOperation(c+"/ASSOCIATION_SOURCE","GET"));E.push(m.createBatchOperation(c+"/ASSOCIATION_TARGET","GET"));F.push("ASSOCIATION_SOURCE");F.push("ASSOCIATION_TARGET");}a.async=(a.async)?true:false;m.addBatchReadOperations(E);m.submitBatch(function(G,H){var A=G.__batchResponses;for(var i=0,l=A.length;i<l;i++){jQuery.sap.log.info(F[i]+" : "+JSON.stringify(A[i]));p[F[i]]=(A[i].data)?((A[i].data.results)?A[i].data.results:A[i].data):null;}if(s){s(p);}},function(A){if(e){e(A);}throw new Error("Failed to fetch Indicator details");},a.async);if(a.associations&&a.associationProperties){for(var i=0,l=p.ASSOCIATIONS.length;i<l;i++){if(p.ASSOCIATIONS[i].PROPERTIES){if(p.ASSOCIATIONS[i].PROPERTIES.results&&p.ASSOCIATIONS[i].PROPERTIES.results.length){p.ASSOCIATIONS[i].PROPERTIES=p.ASSOCIATIONS[i].PROPERTIES.results;}else{p.ASSOCIATIONS[i].PROPERTIES=[];}}else{p.ASSOCIATIONS[i].PROPERTIES=[];}}}else{p.ASSOCIATIONS=[].concat(p.ASSOCIATION_SOURCE).concat(p.ASSOCIATION_TARGET);}return p;};this.getEvaluationById=function(a){jQuery.sap.log.info("Abap Adapter --> Calling Evaluation Data");var t=this;if(!(a.ID&&a.IS_ACTIVE!==null&&a.IS_ACTIVE!==undefined)&&!(a.context)){throw new Error("Failed to get Evaluation Id or Status for data fetch");return null;}var c=null;var j=a.context||null;var m=a.model||g();var p={};if(a.context){c=a.context.sPath;if(a.context.getObject()){a.ID=a.context.getObject().ID;a.IS_ACTIVE=a.context.getObject().IS_ACTIVE;}else{a.ID=c.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');a.IS_ACTIVE=((c.indexOf("IS_ACTIVE='0'")!=-1)||(c.indexOf("IS_ACTIVE='1'")!=-1))?((c.indexOf("IS_ACTIVE='0'")!=-1)?0:1):null;}}else if(a.ID&&a.IS_ACTIVE!==null&&a.IS_ACTIVE!==undefined){a.entity=a.entity||"/EVALUATIONS_MODELER";a.entity=(a.entity.indexOf("/")!=0)?("/"+a.entity):a.entity;c=a.entity+"(ID='"+a.ID+"',IS_ACTIVE="+a.IS_ACTIVE+")";j=new sap.ui.model.Context(m,c);}var s=a.success;var e=a.error;var E=[];var F=[];if(!(a.noEvaluation)){if(j&&j.getObject()&&Object.keys(j.getObject())&&Object.keys(j)){p.EVALUATION=j.getObject();}else{E.push(m.createBatchOperation(c,"GET"));F.push("EVALUATION");}}if(a.tags){E.push(m.createBatchOperation(c+"/TAGS","GET"));F.push("TAGS");}if(a.indicator_tags){E.push(m.createBatchOperation(c+"/INDICATOR_TAGS","GET"));F.push("INDICATOR_TAGS");}if(a.properties){E.push(m.createBatchOperation(c+"/PROPERTIES","GET"));F.push("PROPERTIES");}if(a.texts){E.push(m.createBatchOperation(c+"/TEXTS","GET"));F.push("TEXTS");}if(a.filters){E.push(m.createBatchOperation(c+"/FILTERS","GET"));F.push("FILTERS");}if(a.values){E.push(m.createBatchOperation(c+"/VALUES","GET"));F.push("VALUES");}if(a.chips){E.push(m.createBatchOperation(c+"/CHIPS","GET"));F.push("CHIPS");}if(a.dda_configurations){E.push(m.createBatchOperation(c+"/DDA_CONFIGURATIONS","GET"));F.push("DDA_CONFIGURATIONS");}if(a.dda_header_tiles){E.push(m.createBatchOperation(c+"/DDA_HEADER_TILES","GET"));F.push("DDA_HEADER_TILES");}a.async=(a.async)?true:false;m.addBatchReadOperations(E);m.submitBatch(function(G,H){var A=G.__batchResponses;for(var i=0,l=A.length;i<l;i++){jQuery.sap.log.info(F[i]+" : "+JSON.stringify(A[i]));p[F[i]]=(A[i].data)?((A[i].data.results)?A[i].data.results:A[i].data):null;}if(s){s(p);}},function(i){if(e){e(i);}throw new Error("Failed to fetch Evaluation details");},a.async);return p;};this.getAssociationById=function(a){jQuery.sap.log.info("Abap Adapter --> Calling Association Data");var t=this;var c=null;var j=a.context||null;var m=a.model||g();var p={};if(a.context){c=a.context.sPath;}else if(a.ID&&a.IS_ACTIVE!==null&&a.IS_ACTIVE!==undefined){}var s=a.success;var e=a.error;var E=[];var F=[];if(!(a.noAssociation)){if(j&&j.getObject()&&Object.keys(j.getObject())&&Object.keys(j)){p.ASSOCIATION=j.getObject();}else{E.push(m.createBatchOperation(c,"GET"));F.push("ASSOCIATION");}}if(a.properties){E.push(m.createBatchOperation(c+"/PROPERTIES","GET"));F.push("PROPERTIES");}if(a.source){E.push(m.createBatchOperation(c+"/SOURCE_INDICATOR_INFO","GET"));F.push("SOURCE_INDICATOR_INFO");}if(a.target){E.push(m.createBatchOperation(c+"/TARGET_INDICATOR_INFO","GET"));F.push("TARGET_INDICATOR_INFO");}a.async=(a.async)?true:false;m.addBatchReadOperations(E);m.submitBatch(function(G,H){var A=G.__batchResponses;for(var i=0,l=A.length;i<l;i++){jQuery.sap.log.info(F[i]+" : "+JSON.stringify(A[i]));p[F[i]]=(A[i].data)?((A[i].data.results)?A[i].data.results:A[i].data):null;}if(s){s(p);}},function(i){if(e){e(i);}throw new Error("Failed to fetch Association details");},a.async);return p;};this.getChipById=function(a){jQuery.sap.log.info("Abap Adapter --> Calling Chip Data");var t=this;if(!(a.id&&a.isActive!==null&&a.isActive!==undefined)&&!(a.context)){throw new Error("Failed to get Chip Id or Status for data fetch");return null;}var c=null;var j=a.context||null;var m=a.model||g();var p={};if(a.context){c=a.context.sPath;if(a.context.getObject()){a.id=a.context.getObject().ID;a.isActive=a.context.getObject().IS_ACTIVE;}else{a.id=c.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');a.isActive=((c.indexOf("IS_ACTIVE=0")!=-1)||(c.indexOf("IS_ACTIVE=1")!=-1))?((c.indexOf("IS_ACTIVE=0")!=-1)?0:1):null;}}else if(a.id&&a.isActive!==null&&a.isActive!==undefined){a.entity=a.entity||"/CHIPS";a.entity=(a.entity.indexOf("/")!=0)?("/"+a.entity):a.entity;c=a.entity+"(ID='"+a.id+"',IS_ACTIVE="+a.isActive+")";j=new sap.ui.model.Context(m,c);}var s=a.success;var e=a.error;var E=[];var F=[];if(!(a.noChip)){if(j&&j.getObject()&&Object.keys(j.getObject())&&Object.keys(j)){p.CHIP=j.getObject();}else{E.push(m.createBatchOperation(c,"GET"));F.push("CHIP");}}if(a.evaluation){E.push(m.createBatchOperation(c+"/EVALUATION_INFO","GET"));F.push("EVALUATION_INFO");}if(a.texts){E.push(m.createBatchOperation(c+"/TEXTS","GET"));F.push("TEXTS");}if(a.dda_configurations){E.push(m.createBatchOperation(c+"/DDA_CONFIGURATIONS","GET"));F.push("DDA_CONFIGURATIONS");}a.async=(a.async)?true:false;m.addBatchReadOperations(E);m.submitBatch(function(G,H){var A=G.__batchResponses;for(var i=0,l=A.length;i<l;i++){jQuery.sap.log.info(F[i]+" : "+JSON.stringify(A[i]));p[F[i]]=(A[i].data)?((A[i].data.results)?A[i].data.results:A[i].data):null;}if(s){s(p);}},function(i){if(e){e(i);}throw new Error("Failed to fetch Chip details");},a.async);return p;};this.getChipByEvaluation=function(a){jQuery.sap.log.info("Abap Adapter --> Calling Chips for Evaluation");a.async=false;a.chips=true;var c=a.success;var e=a.error;t.chipObj={};function i(l){var m=l.EVALUATION;if(a.partial){t.chipObj={EVALUATION:l.EVALUATION,CHIPS:l.CHIPS,CATALOGS:[]};c(t.chipObj);return;}t.chipObj={EVALUATION:l.EVALUATION,CHIPS:[],CATALOGS:[]};var p=y(l);var A=z(c,e);}function j(d,s,x){if(e){e(d,s,x);}}a.success=i;a.error=j;var l=this.getEvaluationById(a);return null;};this.getDataByEntity=function(a){jQuery.sap.log.info("Abap Adapter --> Calling Entity Data");var t=this;var c=a.uri;var m=a.model||(c?new sap.ui.model.odata.ODataModel(c,true):g());var e="";var j=[];var p="";var A="";var E="";var F=null;var G=null;var H=null;var I=a.success;var J=a.error;if(!(a.entity)){jQuery.sap.log.error("Entity or Context is missing for getDataByEntity call");throw Error("Entity or Context is missing for getDataByEntity call");}jQuery.sap.log.info("Abap Adapter --> Calling Entity Data - "+a.entity);entity=a.entity;entity=(entity.indexOf("/")==0)?entity:("/"+entity);if(a.select){if(typeof(a.select)=="string"){A=a.select;}else{A=a.select;}}if(a.expand){if(a.expand instanceof Array){for(var i=0,l=a.expand.length;i<l;i++){e+=(e)?",":"";e+=a.expand[i];}j=a.expand;}else if(typeof(a.expand)=="string"){e=a.expand;j=a.expand.split(",");}}if(a.filter){if(typeof(a.filter)=="string"){p=a.filter;}else{p=a.filter;}}if(a.orderby){if(typeof(a.orderby)=="string"){E=a.orderby;}else{E=a.orderby;}}a.async=(a.async)?true:false;if(entity.indexOf("$select")==-1){if(A){entity+=(entity.indexOf("?")==-1)?("?$select="+A):("&$select="+A);}}if(entity.indexOf("$expand")==-1){if(e){entity+=(entity.indexOf("?")==-1)?("?$expand="+e):("&$expand="+e);}}if(entity.indexOf("$filter")==-1){if(p){entity+=(entity.indexOf("?")==-1)?("?$filter="+p):("&$filter="+p);}}if(entity.indexOf("$orderby")==-1){if(E){entity+=(entity.indexOf("?")==-1)?("?$orderby="+E):("&$orderby="+E);}}if(entity.indexOf("$top")==-1){if(Number(F)){entity+=(entity.indexOf("?")==-1)?("?$top="+Number(F)):("&$top="+Number(F));}}if(entity.indexOf("$skip")==-1){if(Number(G)){entity+=(entity.indexOf("?")==-1)?("?$skip="+Number(G)):("&$skip="+Number(G));}}var K=function(d,s,x){H=(d&&d.results)?d.results:d;if(I){I(H);}};var L=function(d,s,x){jQuery.sap.log.error(d);jQuery.sap.log.error(s);jQuery.sap.log.error(x);if(J){H={d:d,s:s,x:x};J(d,s,x);}};m.read(entity,null,null,a.async,K,L);return H;};this.getDataByBatch=function(){jQuery.sap.log.info("Abap Adapter --> Calling Entity Batch Data");};this.populateRelevantEntitySet=function(a,m,c){jQuery.sap.log.info("Abap Adapter --> Calling for Relevant Entity Sets");};this.getAllViews=function(a){jQuery.sap.log.info("Abap Adapter --> Calling for All Views");};this.getPlatform=function(){jQuery.sap.log.info("Abap Adapter --> Fetching Platform");t.cache.platform=t.cache.platform||"abap";jQuery.sap.log.info("Abap Adapter --> Platform - "+t.cache.platform);return t.cache.platform;};function o(a,c,j,l){a=a.replace(/\/$/g,"");var m=(_ENTITYSETMAP[a]||a);if(!l){try{var p=(_[a]&&_[a].length)?_[a]:Object.keys(c);}catch(e){var p=c instanceof Object?Object.keys(c):[];}if(p.length){m+="(";for(var i=0,A;i<p.length;i++){var E=p[i];A=_DATATYPE[E]=="int"?"":"'";var F=(c[E]==undefined)?j[E]:c[E];m+=p[i]+"="+A+F+A+",";}m=m.replace(/,$/g,"")+")";}}return m;}function q(a,e,p,c,m,S,E){var t=this,j,R=[];if(!(p instanceof Array)){p=[p];}for(var i=0;i<p.length;i++){if(Object.keys(p[i]).length==0)continue;for(var l in c){p[i][l]=c[l];}j=o(e,c,p[i],m=="POST");if(m=="DELETE"){R.push(a.createBatchOperation(j,m));}else{R.push(a.createBatchOperation(j,m,p[i]));}}if(R.length){a.addBatchChangeOperations(R);}else{S();}}function r(a,c,S,e){var j=a();if(j&&j.length){var t=this;var l=k();var m=sap.suite.ui.smartbusiness.lib.Util.odata?sap.suite.ui.smartbusiness.lib.Util.odata.getModelByServiceUri(l):new sap.ui.model.odata.ODataModel(l,true);for(var i=0,p;i<j.length&&((p=j[i]));i++){q(m,p.entity,p.payload,p.keys,p.method,S,e);}m.submitBatch(function(A,E){r(a,c,S,e);},c,true);}}function u(p,e){var a=[],c=[],j="POST",l=p;var R=[];if(!(l instanceof Array)){l=[l];}for(var i=0,m;i<l.length;i++){var m=l[i].payload||l[i];var A=l[i].keys||null;for(var E in m){var F=m[E]||{};if(F.remove){a.push({keys:A,payload:F.remove,method:"DELETE",entity:E});}if(F.update){c.push({keys:A,payload:F.update,method:"PUT",entity:E});}if(F.create){c.push({keys:A,payload:F.create,method:"POST",entity:E});}if(!(F.remove||F.create||F.update)){c.push({keys:A,payload:F,method:j,entity:E});}}}if(a.length)R.push(a);if(c.length)R.push(c);return R;}function v(p,e){var a=[],c=p;var j="DELETE";if(!(p instanceof Array)){c=p.payload||p;c=[c];}for(var i=0,l;i<c.length;i++){l=c[i];a.push({keys:l,payload:l,method:j,entity:e})}return a.length?[a]:[];}function w(a,c,S,e,j){var l=[],i=0;function m(){delete l;e();}function p(){var A=l[i++];if(!A){S();}return A;}if(a=='remove'){l=v(c,j);}else{l=u(c,j);}r(p,m,S,e);}this.create=function(e,p,a,S,E,c,i){w("create",p,S,E,e);};this.update=function(e,p,a,S,E,m,c,i,j){w("update",p,S,E,e);};this.remove=function(e,p,S,E,a,c,i,j){w("remove",p,S,E,e);};this.addSystemToServiceUrl=function(a){jQuery.sap.log.info("Abap Adapter --> Add System to Service Url");return a;};this.getUI2Scope=function(){if(!(t.cache.ui2Scope)){jQuery.sap.log.info("Abap Adapter --> Fetching UI2 Scope from URL");var a="CUST";var c=t.getSystemInfo({async:false,model:g()});if(c){a="CONF";var e=jQuery.sap.getUriParameters().get("scope");if(e==="CUST"){a=e;}}else{a="CUST";}t.cache.ui2Scope=a;}else{jQuery.sap.log.info("Abap Adapter --> Fetching UI2 Scope from cache");}jQuery.sap.log.info("Abap Adapter --> Current UI2 Scope - "+t.cache.ui2Scope);return t.cache.ui2Scope;};this.getUI2Factory=function(){if(!(t.cache.ui2Factory)){var S=S||this.getUI2Scope();jQuery.sap.log.info("Abap Adapter --> Creating UI2 Factory with Scope - "+S);if(sap.ushell&&sap.ushell.Container){t.cache.ui2Factory=sap.ushell.Container.getService("PageBuilding",S).getFactory();}}else{jQuery.sap.log.info("Abap Adapter --> Picking UI2 Factory from cache");}return t.cache.ui2Factory;};this.getUI2PageBuildingService=function(){if(!(t.cache.ui2PageBuildeingService)){if(sap.ushell&&sap.ushell.Container){jQuery.sap.log.info("Abap Adapter --> Creating UI2 PageBuildingService");var a=this.getUI2Factory();t.cache.ui2PageBuildeingService=a.getPageBuildingService();}}else{jQuery.sap.log.info("Abap Adapter --> Picking UI2 PageBuildingService from cache");}return t.cache.ui2PageBuildeingService;};function y(e){var c=e.CHIPS;var a=[];var j={};var m={};var p={};var A=null;if(c&&c.length){for(var i=0,l=c.length;i<l;i++){j={};j.id=c[i].ID;j.isActive=1;j.catalogId=c[i].CATALOG_ID;j.evaluationId=c[i].EVALUATION_ID;j.tileType=c[i].TYPE;j.COUNTER=1;p[j.id]=j;m[c[i].CATALOG_ID]=m[c[i].CATALOG_ID]||{};m[c[i].CATALOG_ID][c[i].ID]=m[c[i].CATALOG_ID][c[i].ID]||false;}}t.chipObj.getObjByChip=p;t.chipObj.catalogObj=m;return m;};function z(a,e){var c=t.chipObj.catalogObj;var p=jQuery.Deferred();if(!(sap.ushell&&sap.ushell.Container)){jQuery.sap.require(sap.ushell.Container);}var F=t.getUI2Factory();var P=t.getUI2PageBuildingService(F);var A=0;var E=false;function G(J){var K=[];var L={};var M={};var N=[];if(!E){K=(J.Chips&&J.Chips.results)?J.Chips.results:[];t.chipObj.CATALOGS.push(J);for(var i=0,l=K.length;i<l;i++){if(t.chipObj.getObjByChip[K[i].catalogPageChipInstanceId]){t.chipObj.catalogObj[J.id][K[i].catalogPageChipInstanceId]=true;L=t.chipObj.getObjByChip[K[i].catalogPageChipInstanceId]||{};L.catalogName=J.title;L.title=K[i].title;if(K[i].ChipBags&&K[i].ChipBags.results&&K[i].ChipBags.results.length){M=K[i].ChipBags.results[0];if(M.ChipProperties&&M.ChipProperties.results&&M.ChipProperties.results.length){N=M.ChipProperties.results;for(var j=0,m=N.length;j<m;j++){if(N[j].name=="title"){L.title=N[j].value;}if(N[j].name=="description"){L.description=N[j].value;}}}}L.url=K[i].url;L.configuration=K[i].configuration;t.chipObj.CHIPS.push(L);}}var O=t.chipObj.catalogObj[J.id];for(var Q in O){if(!(O[Q])){t.chipObj.affectedTiles=t.chipObj.affectedTiles||[];t.chipObj.affectedTiles.push(Q);var R=t.chipObj.getObjByChip[Q];R.catalogName="-NA-"+R.catalogId;R.configuration=JSON.stringify({});R.title=t.chipObj.EVALUATION.INDICATOR_TITLE;R.description=t.chipObj.EVALUATION.TITLE;R.isAffected=true;t.chipObj.CHIPS.push(R);}}if(A==0){if(!E){a(t.chipObj);}}else{A--;}}}function H(d,s,x){E=true;if(e){jQuery.sap.log.error("Catalog "+this.Catalog+" does not exist");e(d,s,x);}}A=(c)?Object.keys(c).length-1:0;for(var I in c){P.readCatalog(I,G,jQuery.proxy(H,{Catalog:I}),false,false);}if(!(Object.keys(c).length)){a(t.chipObj);}return p.promise();};this.readChipFromUI2ById=function(c,a,e,i){var U='X-SAP-UI2-PAGE';var j=U+":"+c+":"+a;var p=this.getUI2PageBuildingService();p.readChip(j,e,i);};this.readAllUI2Catalogs=function(a,e,c){var p=this.getUI2PageBuildingService();p.readCatalogs(a,e,c);};function B(a){var c={'NT':'X-SAP-UI2-CHIP:/SSB/NUMERIC_TILE','CT':'X-SAP-UI2-CHIP:/SSB/COMPARISON_TILE','TT':'X-SAP-UI2-CHIP:/SSB/TREND_TILE','AT':'X-SAP-UI2-CHIP:/SSB/DEVIATION_TILE','CM':'X-SAP-UI2-CHIP:/SSB/COMPARISON_MM_TILE','DT-CT':'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_COMPARISON','DT-CM':'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_COMPARISON_MM','DT-AT':'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_DEVIATION','DT-TT':'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_TREND'};return c[a];}this.removeTile=function(p,c,a,e){jQuery.sap.log.info("Abap Adapter --> Calling Chip delete");if(!(sap.ushell&&sap.ushell.Container)){jQuery.sap.require(sap.ushell.Container);}if(p.isAffected){m();return;}var F=t.getUI2Factory();var P=t.getUI2PageBuildingService(F);var j=new sap.ui2.srvc.Page(F,p.catalogId);function m(){jQuery.sap.log.info("Abap Adapter --> Chip Instance removed successfully");var i={ID:p.id,IS_ACTIVE:p.isActive};t.remove("CHIP",i,a,e);}function A(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while removing the Chip Instance");e(d,s,x);}function E(){jQuery.sap.log.info("Abap Adapter --> Chip Stub loaded successfully");oChip=oChipStub;oChip.remove(m,A);}function G(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while loading the Chip Stub");e(d,s,x);}function H(){jQuery.sap.log.info("Abap Adapter --> Page Stub loaded successfully");oPage=j;oChips=oPage.getChipInstances();for(var i=0,l=oChips.length;i<l;i++){if(oChips[i].getId()==p.id){oChipStub=oChips[i];}}oChipStub.remove(m,A);}function I(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while loading the Page Stub");e(d,s,x);}j.load(H,I);};function C(p,c,a,e){if(!(sap.ushell&&sap.ushell.Container)){jQuery.sap.require(sap.ushell.Container);}var F=t.getUI2Factory();var P=t.getUI2PageBuildingService(F);var i=B(p.tileType);p.id=i;p.chipId=i;var j=new sap.ui2.srvc.Chip(p,F);var l=new sap.ui2.srvc.Page(F,p.catalogId);var m=null;var A=null;function E(d){var R={payload:{CHIP:{ID:p.ID,IS_ACTIVE:1,EVALUATION_ID:p.evaluationId,TYPE:p.tileType,CATALOG_ID:p.catalogId}}};t.create('CHIP',R,null,a,e);}function G(d){jQuery.sap.log.info("Abap Adapter --> Bag updated successfully for the Chip Instance");}function H(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while writing into the Bag of the Chip Instance");e(d,s,x);}function I(d){jQuery.sap.log.info("Abap Adapter --> Configuration updated successfully for the Chip Instance");E(d);}function J(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while writing Configuration to the Chip Instance");e(d,s,x);}function K(d){var U='X-SAP-UI2-PAGE';jQuery.sap.log.info("Abap Adapter --> Chip Instance created successfully");var R=d;var S=R.getId();p.ID=S;p.configuration=p.configuration.replace(/___CHIPINSTID______CHIPINSTID___/g,S);p.configuration=p.configuration.replace(/_____CHIPID__________CHIPID_____/g,U+":"+p.catalogId+":"+S);R.getApi().writeConfiguration.setParameterValues(p.configuration,I,J);R.setTitle(p.title);var T=R.getBag("sb_tileProperties");T.setText("title",p.title);T.setText("description",p.description);T.save(G,H);}function L(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error in creating a Chip Instance in the UI2 Catalog");e(d,s,x);}function M(){jQuery.sap.log.info("Abap Adapter --> Chip Stub loaded successfully");m=j;A.addChipInstance(m,K,L);}function N(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while loading the Chip Stub");e(d,s,x);}function O(){jQuery.sap.log.info("Abap Adapter --> Page Stub loaded successfully");A=l;j.load(M,N);}function Q(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while loading the Page Stub");e(d,s,x);}l.load(O,Q);};function D(p,c,a,e){if(!(sap.ushell&&sap.ushell.Container)){jQuery.sap.require(sap.ushell.Container);}var F=t.getUI2Factory();var P=t.getUI2PageBuildingService(F);var j=B(p.tileType);var m=[];var A=new sap.ui2.srvc.Chip(p,F);var E=new sap.ui2.srvc.Page(F,p.catalogId);var G=null;var H=null;function I(d){var i={keys:{ID:p.ID,IS_ACTIVE:1},payload:{CHIP:{update:[{ID:p.ID,IS_ACTIVE:1,EVALUATION_ID:p.evaluationId,TYPE:p.tileType,CATALOG_ID:p.catalogId}]}}};c.metadataRef.update('CHIP',i,null,a,e);}function J(d){jQuery.sap.log.info("Abap Adapter --> Bag updated successfully for the Chip Instance");}function K(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while writing into the Bag of the Chip Instance");e(d,s,x);}function L(d){jQuery.sap.log.info("Abap Adapter --> Configuration updated successfully for the Chip Instance");I(d);}function M(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while writing Configuration to the Chip Instance");e(d,s,x);}function N(d){jQuery.sap.log.info("Abap Adapter --> Chip Instance created successfully");var i=d;p.ID=i.getId();i.getApi().writeConfiguration.setParameterValues(p.configuration,L,M);i.setTitle(p.title);var l=i.getBag("sb_tileProperties");l.setText("title",p.title);l.setText("description",p.description);l.save(J,K);}function O(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error in creating a Chip Instance in the UI2 Catalog");e(d,s,x);}function Q(){jQuery.sap.log.info("Abap Adapter --> Chip Stub loaded successfully");G=A;N(G);}function R(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while loading the Chip Stub");e(d,s,x);}function S(){jQuery.sap.log.info("Abap Adapter --> Page Stub loaded successfully");H=E;m=H.getChipInstances();for(var i=0,l=m.length;i<l;i++){if(m[i].getId()==p.id){A=m[i];}}A.load(Q,R);}function T(d,s,x){jQuery.sap.log.error("Abap Adapter --> Error while loading the Page Stub");e(d,s,x);}E.load(S,T);};this.publishChip=function(p,m,c,a,e){if(m=="create"){jQuery.sap.log.info("Abap Adapter --> Calling Chip create");C(p,c,a,e);}else{jQuery.sap.log.info("Abap Adapter --> Calling Chip update");D(p,c,a,e);}};this.isTokenHandlingEnabledForODataRead=function(){return true;};};