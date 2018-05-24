/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.DrilldownModel");jQuery.sap.require("sap.suite.ui.smartbusiness.lib.DrilldownConfiguration");jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");sap.suite.ui.smartbusiness.lib.DrilldownModel=sap.suite.ui.smartbusiness.lib.DrilldownModel||{};
sap.suite.ui.smartbusiness.lib.DrilldownModel.Model=function(e,v,i){this.ddaConfigurator=null;this.viewId=v;this.selectedView=null;this.i18nModel=i;this.evaluationId=e;if(this.evaluationId){this._init();}};
sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances={};sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts={ALL_LANGUAGES:[],CURRENT_LANGUAGE:[],isLoaded:false};
sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.getInstance=function(e,f,i){function g(a){var m=new sap.suite.ui.smartbusiness.lib.DrilldownModel.Model(a,null,i);sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances[a]=m;return sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances[a];}if(f){return g(e,null,i);}if(sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances[e]){return sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances[e];}else{return g(e,null,i);}};
sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.prototype={_init:function(e){this.ddaConfigurator=new sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.Configuration(this.evaluationId);this.EVALUATION_DATA=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({id:this.evaluationId,cache:true,filters:true,thresholds:true});this._setModel();},NEW_VIEWID:"~NA~",_setModel:function(){this._oModel=new sap.ui.model.json.JSONModel(this.getModelDataForDDAConfiguration());try{this._oModel.setSizeLimit(9999);}catch(e){}},removeAllViews:function(){this.getConfigurator().removeAllViews();this._oModel.setData(this.getModelDataForDDAConfiguration());},bindModel:function(c,n){if(n){c.setModel(this._oModel,n);}else{c.setModel(this._oModel);}this._oModel.refresh();},getConfigurator:function(){return this.ddaConfigurator;},setEvaluationId:function(e){this.evaluationId=e;this._init()},setViewId:function(v){this.viewId=v;this.selectedView=this.ddaConfigurator.findViewById(this.viewId);this._setModel();},fetchLanguageData:function(n,s){if(sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.isLoaded){s({ALL_LANGUAGES:sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.ALL_LANGUAGES,CURRENT_LANGUAGE:sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.CURRENT_LANGUAGE});}else{var l=sap.ui.getCore().getConfiguration().getLocale().getLanguage().toUpperCase();new sap.ui.model.odata.ODataModel(sap.suite.ui.smartbusiness.lib.Util.utils.appendUrlParameters("/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata"),true).read("/LANGUAGE?$select=SPRAS,LAISO&orderby=LAISO",null,null,true,function(d){sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.isLoaded=true;var a={ALL_LANGUAGES:[],CURRENT_LANGUAGE:[]};for(var i=0;i<d.results.length;++i){if(d.results[i]["LAISO"]==l){a["CURRENT_LANGUAGE"]=d.results[i]["SPRAS"];d.results.splice(i,1);break;}}a["ALL_LANGUAGES"]=d.results;sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.ALL_LANGUAGES=a["ALL_LANGUAGES"];sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.CURRENT_LANGUAGE=a["CURRENT_LANGUAGE"];s(a);});}},_getEvalData:function(i){try{var a=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({id:i,cache:true,filters:false,thresholds:false,getDDAEvaluation:true});return a;}catch(e){return{};}},getDefaultModelData:function(){var t=this;try{var d=sap.suite.ui.smartbusiness.lib.Util.odata.getAllDimensions(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);var s=sap.suite.ui.smartbusiness.lib.Util.odata.getSortableProperties(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);var m=sap.suite.ui.smartbusiness.lib.Util.odata.getAllMeasures(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);var f=sap.suite.ui.smartbusiness.lib.Util.odata.getAllFilterableDimensions(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET)||[];var p=sap.suite.ui.smartbusiness.lib.Util.odata.properties(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);var C=p.getLabelMappingObject();}catch(e){var d=[];var m=[];}function _(i){return t._getEvalData(i).INDICATOR_TITLE;}function a(i){return t._getEvalData(i).TITLE;}function b(i){return t._getEvalData(i).INDICATOR;}function g(){var j=[];for(var i=0;i<m.length;i++){j.push({NAME:m[i],LABEL:C[m[i]]})}return j;}function c(){var j=[];var k=["NT","AT","CT","TT","CM"];for(var i=0,l=k.length;i<l;i++){j.push({EVALUATION_ID:t.evaluationId,CONFIGURATION_ID:t.NEW_VIEWID,REFERENCE_EVALUATION_ID:t.evaluationId,VISUALIZATION_TYPE:k[i],VISUALIZATION_TYPE_INDEX:4,VISUALIZATION_ORDER:1,DIMENSION:d[0],DIMENSION_COLOR:"Neutral",SORT_BY:"",SORT_ORDER:"MD",MEASURE1:m[0],MEASURE2:m[1]||m[0],MEASURE3:"",COLOR1:"Good",COLOR2:"Critical",COLOR3:"Error",ALL_MEASURES:m,ALL_DIMENSIONS:d,HARVEY_FILTERS:[{NAME:f[0],OPERATOR:"EQ",VALUE_1:[],VALUE_2:[]}],HARVEY_TOTAL_MEASURE:m[0],FILTERABLE_DIMENSIONS:f,IS_HARVEY_FRACTION_KPIMEASURE:true,IS_HARVEYMEASURE_KPIMEASURE:false,VISIBILITY:1,visible:false,TITLE:_(t.evaluationId),SUBTITLE:a(t.evaluationId),GROUPING_TITLE:_(t.evaluationId)+" "+a(t.evaluationId),INDICATOR:b(t.evaluationId)})}return j;}var h={CONFIG:{SAP_AGGREGATE_VALUE:true},ID_EDITABLE:true,INDICATOR:this.EVALUATION_DATA.INDICATOR,ID:"",TITLE:"",EVALUATION_TITLE:this.EVALUATION_DATA.TITLE,QUERY_SERVICE_URI:this.EVALUATION_DATA.ODATA_URL,QUERY_ENTITY_SET:this.EVALUATION_DATA.ODATA_ENTITYSET,TEXT:"",MAIN_MEASURE:"",THRESHOLD_MEASURE:"",ALL_DIMENSIONS:d,ALL_SORTABLE_DIMENSIONS:s,ALL_MEASURES:m,ALL_MEASURES_LABELS:g(),VALUE_TYPES:[{key:"ABSOLUTE",text:this.i18nModel.getProperty("ABSOLUTE_VALUES")},{key:"PERCENTAGE",text:this.i18nModel.getProperty("PERCENTAGE_VALUES")}],AXIS_TYPES:[{key:"SINGLE",text:this.i18nModel.getProperty("SINGLE_AXIS")},{key:"DUAL",text:this.i18nModel.getProperty("DUAL_AXIS")}],AXIS_TYPE:"SINGLE",VALUE_TYPE:"ABSOLUTE",CHART_TYPE:"Column",CHART_TYPES:[{key:"Bar",text:this.i18nModel.getProperty("BARS")},{key:"Column",text:this.i18nModel.getProperty("COLUMNS")},{key:"Line",text:this.i18nModel.getProperty("LINES")},{key:"Combination",text:this.i18nModel.getProperty("COLUMNS_AND_LINES")},{key:"Bubble",text:this.i18nModel.getProperty("BUBBLES")},{key:"Table",text:this.i18nModel.getProperty("TABLE")}],GEO_MAP_TYPE:"Pie",GEO_MAP_TYPES:[{key:"Pie",text:this.i18nModel.getProperty("PIE")},{key:"Bubble",text:this.i18nModel.getProperty("BUBBLES")},{key:"Pin",text:this.i18nModel.getProperty("PIN")},],DATA_MODES:[{key:"DUMMY",text:this.i18nModel.getProperty("DUMMY_DATA")},{key:"RUNTIME",text:this.i18nModel.getProperty("ACTUAL_BACKEND_DATA")}],DATA_MODE:"DUMMY",DATA_LIMIT:200,DATA_LIMITATIONS:false,COLOR_SCHEME:"NONE",COLOR_SCHEMES:[{key:"NONE",text:this.i18nModel.getProperty("DEFAULT_COLORS")},{key:"AUTO_SEMANTIC",text:this.i18nModel.getProperty("AUTO_SEMANTIC_COLORS")},{key:"MANUAL_SEMANTIC",text:this.i18nModel.getProperty("MANUAL_SEMANTIC_COLORS")},{key:"MANUAL_NON_SEMANTIC",text:this.i18nModel.getProperty("MANUAL_COLORS")}],"MANUAL_NON_SEMANTIC":[{color:"sapUiChartPaletteQualitativeHue1",index:0},{color:"sapUiChartPaletteQualitativeHue2",index:1},{color:"sapUiChartPaletteQualitativeHue3",index:2},{color:"sapUiChartPaletteQualitativeHue4",index:3},{color:"sapUiChartPaletteQualitativeHue5",index:4},{color:"sapUiChartPaletteQualitativeHue6",index:5},{color:"sapUiChartPaletteQualitativeHue7",index:6},{color:"sapUiChartPaletteQualitativeHue8",index:7},{color:"sapUiChartPaletteQualitativeHue9",index:8},{color:"sapUiChartPaletteQualitativeHue10",index:9},{color:"sapUiChartPaletteQualitativeHue11",index:10}],"MANUAL_SEMANTIC":[{color:"sapUiChartPaletteSemanticNeutralDark1",index:0},{color:"sapUiChartPaletteSemanticNeutral",index:1},{color:"sapUiChartPaletteSemanticNeutralLight1",index:2},{color:"sapUiChartPaletteSemanticGoodDark1",index:3},{color:"sapUiChartPaletteSemanticGood",index:4},{color:"sapUiChartPaletteSemanticGoodLight1",index:5},{color:"sapUiChartPaletteSemanticCriticalDark1",index:6},{color:"sapUiChartPaletteSemanticCritical",index:7},{color:"sapUiChartPaletteSemanticCriticalLight1",index:8},{color:"sapUiChartPaletteSemanticBadDark1",index:9},{color:"sapUiChartPaletteSemanticBad",index:10},{color:"sapUiChartPaletteSemanticBadLight1",index:11}],COLUMNS:[],SIBLING_EVALUATIONS:[],ASSOCIATED_EVALUATIONS:[],ADDITIONAL_LANGUAGE_TITLES:[],FILTERS:[],HEADER_EVALUATIONID:{},HEADERS_VISIBLE:[],HEADERS:c(),SELECTED_VIEW:"",ALL_VIEWS:this.ddaConfigurator.getAllViews(),ALL_LANGUAGES:[],CURRENT_LANGUAGE:"E"};h.HEADER_EVALUATIONID[this.evaluationId]=true;this.fetchLanguageData("SB_DDACONFIG_LANG",function(o){h.ALL_LANGUAGES=o.ALL_LANGUAGES;h.CURRENT_LANGUAGE=o.CURRENT_LANGUAGE;});return h;},getModelDataForDDAConfiguration:function(){function g(n){return(n==-1||!n)?200:n;}function _(I){try{var a=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({id:I,cache:true,filters:true,thresholds:true});return sap.suite.ui.smartbusiness.lib.Util.odata.getAllDimensions(a.ODATA_URL,a.ODATA_ENTITYSET);}catch(e){return[];}}function c(I){try{var a=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({id:I,cache:true,filters:true,thresholds:true});return sap.suite.ui.smartbusiness.lib.Util.odata.getAllMeasures(a.ODATA_URL,a.ODATA_ENTITYSET);}catch(e){return[];}}function d(I){try{var a=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({id:I,cache:true,filters:true,thresholds:true});return sap.suite.ui.smartbusiness.lib.Util.odata.getAllFilterableDimensions(a.ODATA_URL,a.ODATA_ENTITYSET);}catch(e){return[];}}function f(I){var e=t._getEvalData(I);return(e&&e.INDICATOR_TITLE)?e.INDICATOR_TITLE:"";}function h(I){var e=t._getEvalData(I);return(e&&e.TITLE)?e.TITLE:"";}function j(I){var e=t._getEvalData(I);return(e&&e.INDICATOR)?e.INDICATOR:"";}var t=this;var k=["NT","AT","CT","TT","CM"];var m=this.getDefaultModelData();var l,o,p;if(this.selectedView){var t=this;m.ALL_VIEWS=this.ddaConfigurator.getAllViews();m.SELECTED_VIEW=this.selectedView.getId();m.ID=this.selectedView.getId();m.TITLE=this.selectedView.getTitle();m.ADDITIONAL_LANGUAGE_TITLES=this.selectedView.getAdditionalLanguageTitles();m.ID_EDITABLE=false;var q=this.selectedView.getChartConfiguration()[0];m.THRESHOLD_MEASURE=q?q.getThresholdMeasure():"";m.AXIS_TYPE=q?q.getAxisType():"SINGLE";m.VALUE_TYPE=q?q.getValueType():"ABSOLUTE";m.CHART_TYPE=q?q.getChartType().getText():"Bar";m.DATA_LIMIT=q?g(q.getDataLimit()):200;m.DATA_LIMITATIONS=this.getDataLimitations();m.CONFIG.SAP_AGGREGATE_VALUE=this.selectedView.isAggregateValueEnabled();m.COLOR_SCHEME=q?q.getColorScheme().getText():"AUTO_SEMANTIC";if(this.selectedView.getHeaders().length){var r=this.selectedView.getHeaders();m.HEADERS=[];m.HEADERS_VISIBLE=[];var u={};m.HEADER_EVALUATIONID={};r.forEach(function(H){if(H.getVisualizationType()=="HT"){return;}m.HEADER_EVALUATIONID[H.getReferenceEvaluationId()]=true;u[H.getReferenceEvaluationId()]=u[H.getReferenceEvaluationId()]||{};var p=c(H.getReferenceEvaluationId());var o=_(H.getReferenceEvaluationId());var l=d(H.getReferenceEvaluationId());var a=H.getConfiguration();m.HEADERS_VISIBLE.push({EVALUATION_ID:t.evaluationId,CONFIGURATION_ID:m.SELECTED_VIEW,REFERENCE_EVALUATION_ID:H.getReferenceEvaluationId(),VISUALIZATION_TYPE:H.getVisualizationType(),VISUALIZATION_ORDER:H.getVisualizationOrder(),DIMENSION:H.getDimension()||o[0],SORT_BY:"",SORT_ORDER:a.SORTING.by+(a.SORTING.order=="desc"?+"D":"A"),MEASURE1:a.MEASURES[0].name||p[0],MEASURE2:a.MEASURES[1].name||p[1]||p[0],MEASURE3:a.MEASURES[2]?a.MEASURES[2].name:"",COLOR1:a.MEASURES[0].color||"Neutral",COLOR2:a.MEASURES[1].color||"Neutral",COLOR3:a.MEASURES[2]?a.MEASURES[2].color:"Neutral",DIMENSION_COLOR:a.SORTING.dimension_color||"Neutral",FILTERABLE_DIMENSIONS:l,HARVEY_TOTAL_MEASURE:a.HARVEY_TOTAL_MEASURE||p[0],HARVEY_FILTERS:a.HARVEY_FILTERS||[{NAME:l[0],OPERATOR:"EQ",VALUE_1:[],VALUE_2:[]}],IS_HARVEY_FRACTION_KPIMEASURE:!!a.IS_HARVEY_FRACTION_KPIMEASURE,IS_HARVEYMEASURE_KPIMEASURE:!a.IS_HARVEY_FRACTION_KPIMEASURE,ALL_MEASURES:p,ALL_DIMENSIONS:o,VISIBILITY:H.getVisibility(),visible:true,TITLE:f(H.getReferenceEvaluationId()),SUBTITLE:h(H.getReferenceEvaluationId()),INDICATOR:j(H.getReferenceEvaluationId())});});m.HEADERS_VISIBLE.sort(function(a,b){return a.VISUALIZATION_ORDER>b.VISUALIZATION_ORDER?1:-1;});m.HEADER_EVALUATIONID[this.evaluationId]=true;u[this.evaluationId]=u[this.evaluationId]||{};var t=this;for(var v in u){var p=c(v);var o=_(v);var l=d(v);k.forEach(function(s){m.HEADERS.push({EVALUATION_ID:t.evaluationId,CONFIGURATION_ID:m.SELECTED_VIEW,REFERENCE_EVALUATION_ID:v,VISUALIZATION_TYPE:s,VISUALIZATION_TYPE_INDEX:k.indexOf(s),VISUALIZATION_ORDER:1,DIMENSION:o[0],SORT_BY:"",SORT_ORDER:"MD",MEASURE1:p[0],MEASURE2:p[1]||p[0],MEASURE3:"",DIMENSION_COLOR:"Neutral",HARVEY_TOTAL_MEASURE:p[0],FILTERABLE_DIMENSIONS:l,HARVEY_FILTERS:[{NAME:l[0],OPERATOR:"EQ",VALUE_1:[],VALUE_2:[]}],IS_HARVEY_FRACTION_KPIMEASURE:true,IS_HARVEYMEASURE_KPIMEASURE:false,COLOR1:"Good",COLOR2:"Critical",COLOR3:"Error",ALL_MEASURES:p,ALL_DIMENSIONS:_(v),VISIBILITY:1,visible:false,TITLE:f(v),SUBTITLE:h(v),GROUPING_TITLE:f(v)+" "+h(v),INDICATOR:j(v)});});}}var w=this.selectedView.getColumns();for(var i=0;i<w.length;i++){var x=this.selectedView.findColumnByName(w[i]);m.COLUMNS.push({NAME:x.getName(),TYPE:x.getType(),COLOR1:m.COLOR_SCHEME=="MANUAL_NON_SEMANTIC"?x.getColor():"",COLOR2:m.COLOR_SCHEME=="MANUAL_SEMANTIC"?x.getColor():"",AXIS:x.getAxis(),SORT_ORDER:x.getSortOrder(),SORT_BY:x.getSortBy(),COLUMNS_ORDER:x.getColumnOrder(),VISIBILITY:x.getVisibility(),STACKING:x.getStacking()});}var y=this.selectedView.getFilters();for(var i=0;i<y.length;i++){var z=y[i];m.FILTERS.push({name:z});}}return m;},getDataLimitations:function(){var c=this.selectedView.getChartConfiguration()[0];if(c&&c.getDataLimit()!=-1){return true;}else if(c&&c.getDataLimit()==-1){return false;}}};