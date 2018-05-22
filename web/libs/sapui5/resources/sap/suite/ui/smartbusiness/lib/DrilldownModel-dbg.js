/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.DrilldownModel");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.DrilldownConfiguration");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");

sap.suite.ui.smartbusiness.lib.DrilldownModel = sap.suite.ui.smartbusiness.lib.DrilldownModel || {};

sap.suite.ui.smartbusiness.lib.DrilldownModel.Model = function(evaluationId, viewId, i18n) {
    this.ddaConfigurator = null;
    this.viewId = viewId;
    this.selectedView = null;
    this.i18nModel=i18n;
    this.evaluationId = evaluationId;
    if(this.evaluationId) {
        this._init();
    }
};
sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances = {};
sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts={
		ALL_LANGUAGES:[],
		CURRENT_LANGUAGE:[],
		isLoaded:false
};
sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.getInstance = function(evaluationId, bForce, i18n) {
    function getInstance(eId) {
        var modelInstance = new sap.suite.ui.smartbusiness.lib.DrilldownModel.Model(eId,null,i18n);
        sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances[eId] = modelInstance;
        return sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances[eId];
    }
    if(bForce) {
        return getInstance(evaluationId,null,i18n);
    }
    if(sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances[evaluationId]) {
        return sap.suite.ui.smartbusiness.lib.DrilldownModel.Model._instances[evaluationId];  
    } else {
        return getInstance(evaluationId,null,i18n);
    }
};
sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.prototype = {
    _init : function(evaluationId) {
        this.ddaConfigurator = new sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.Configuration(this.evaluationId);
        this.EVALUATION_DATA = sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({
           id : this.evaluationId,
           cache : true,
           filters:true,
           thresholds:true
        });
        this._setModel();
    },
    NEW_VIEWID:"~NA~",
    _setModel : function() {
    	this._oModel=new sap.ui.model.json.JSONModel(this.getModelDataForDDAConfiguration());
    	try{
    		this._oModel.setSizeLimit(9999);
    	}catch(e){	
    	}
    },
    removeAllViews:function(){
    	this.getConfigurator().removeAllViews();
    	this._oModel.setData(this.getModelDataForDDAConfiguration());
    },
    bindModel:function(oControl,sName){
    	if(sName){
    		oControl.setModel(this._oModel,sName);
    	}else{
    		oControl.setModel(this._oModel);
    	}
    	this._oModel.refresh();
    },
    getConfigurator : function() {
        return this.ddaConfigurator;
    },
    setEvaluationId : function(evaluationId) {
        this.evaluationId = evaluationId;
        this._init()
    },
    setViewId : function(viewId) {
        this.viewId = viewId;
        this.selectedView = this.ddaConfigurator.findViewById(this.viewId);
        this._setModel();
    },
    fetchLanguageData:function(sName,fnS){
    	if(sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.isLoaded){
    		fnS({
    			ALL_LANGUAGES:sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.ALL_LANGUAGES,
    			CURRENT_LANGUAGE:sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.CURRENT_LANGUAGE
    		});
    	}else{
    		var locale_language = sap.ui.getCore().getConfiguration().getLocale().getLanguage().toUpperCase();
    		new sap.ui.model.odata.ODataModel(sap.suite.ui.smartbusiness.lib.Util.utils.appendUrlParameters("/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata"), true)
    								.read("/LANGUAGE?$select=SPRAS,LAISO&orderby=LAISO", null, null, true, 
    										function(data) {
    										sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.isLoaded=true;
    										var lang={ALL_LANGUAGES:[],CURRENT_LANGUAGE:[]};
    											for(var i = 0; i < data.results.length; ++i) {
    												if(data.results[i]["LAISO"] == locale_language) {
    													lang["CURRENT_LANGUAGE"] = data.results[i]["SPRAS"];
    													//remove current language from the list of addnl languages
    													data.results.splice(i, 1);
    													break;
    												}
    											}
    										lang["ALL_LANGUAGES"] = data.results;
    							    		sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.ALL_LANGUAGES=lang["ALL_LANGUAGES"];
    							    		sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.languageTexts.CURRENT_LANGUAGE=lang["CURRENT_LANGUAGE"];
    										fnS(lang);
    											
    										});
    	
    	}
    },
    _getEvalData:function(sId){
		try{
    		var evalData=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({
 	           id : sId, cache : true, filters:false, thresholds:false, getDDAEvaluation:true
 	        });
    		return evalData;
		}catch(e){
			return {};
		}
    },
    getDefaultModelData:function(){
    	var that=this;
    	try{
    		var dimensions=sap.suite.ui.smartbusiness.lib.Util.odata.getAllDimensions(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);
    		var sortableDimensions=sap.suite.ui.smartbusiness.lib.Util.odata.getSortableProperties(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);
    		var measures=sap.suite.ui.smartbusiness.lib.Util.odata.getAllMeasures(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);
    		var filterableDimensions = sap.suite.ui.smartbusiness.lib.Util.odata.getAllFilterableDimensions(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET)||[] ;
    		var mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(this.EVALUATION_DATA.ODATA_URL,this.EVALUATION_DATA.ODATA_ENTITYSET);
            var COLUMN_LABEL_MAPPING = mProperties.getLabelMappingObject();
    	}catch(e){
    		var dimensions=[];
    		var measures=[];
    	}
    	function _getEvaluationTitle(sId){
    		return that._getEvalData(sId).INDICATOR_TITLE;
    	}
    	function _getEvaluationSubTitle(sId){
    		return that._getEvalData(sId).TITLE;
    	}
    	function _getEvaluationIndicator(sId){
    		return that._getEvalData(sId).INDICATOR;
    	}
    	function getMeasureWithLabels(){
    		
    		var msrLabel=[];
    		for(var i=0;i<measures.length;i++){
    			msrLabel.push({
    				NAME:measures[i],
    				LABEL:COLUMN_LABEL_MAPPING[measures[i]]
    			})
    			
    		}
    		//msrLabel.unshift(this.i18nModel.getProperty("SELECT_NONE"));
    		return msrLabel;
    		
    	}
    	function getDefaultHeaders(){
    		var headers=[];
    		var tileTypes=["NT","AT","CT","TT","CM" /*,"HT"*/];
    		// pushing generic configuration for all tiles. even those which are relevant for only
    		//one tile type
    		
    		for(var i=0,length=tileTypes.length;i<length;i++){
    			headers.push({
    				           EVALUATION_ID : that.evaluationId,
                               CONFIGURATION_ID : that.NEW_VIEWID,
                               REFERENCE_EVALUATION_ID : that.evaluationId,
                               VISUALIZATION_TYPE : tileTypes[i],
                               VISUALIZATION_TYPE_INDEX:4,
                               VISUALIZATION_ORDER : 1,
                               DIMENSION :  dimensions[0],
                               DIMENSION_COLOR:"Neutral",
                               SORT_BY:"",
                               SORT_ORDER:"MD",
                               MEASURE1:measures[0],
                               MEASURE2:measures[1]||measures[0],
                               MEASURE3:"",
                               COLOR1:"Good",
                               COLOR2:"Critical",
                               COLOR3:"Error",
                               ALL_MEASURES:measures,
                               ALL_DIMENSIONS:dimensions,
                               HARVEY_FILTERS:[{
                            	   					NAME: filterableDimensions[0],
                            	   					OPERATOR:"EQ",
                            	   					VALUE_1:[],
                            	   					VALUE_2:[]
                               					}],
                               HARVEY_TOTAL_MEASURE:measures[0],
                               FILTERABLE_DIMENSIONS: filterableDimensions,
                               IS_HARVEY_FRACTION_KPIMEASURE : true,
                               IS_HARVEYMEASURE_KPIMEASURE : false,
                               VISIBILITY : 1,
                               visible : false,
                               TITLE : _getEvaluationTitle(that.evaluationId),
                               SUBTITLE : _getEvaluationSubTitle(that.evaluationId),
                               GROUPING_TITLE:_getEvaluationTitle(that.evaluationId)+" "+_getEvaluationSubTitle(that.evaluationId),
                               INDICATOR:_getEvaluationIndicator(that.evaluationId)
    			})
    		}
    		return headers;
    	}
        var modelData =  {
        		CONFIG:{
        			SAP_AGGREGATE_VALUE:true
        		},
            	ID_EDITABLE:true,
            	INDICATOR:this.EVALUATION_DATA.INDICATOR,
            	ID : "",
            	TITLE : "",
            	EVALUATION_TITLE:this.EVALUATION_DATA.TITLE,
                QUERY_SERVICE_URI : this.EVALUATION_DATA.ODATA_URL,
                QUERY_ENTITY_SET : this.EVALUATION_DATA.ODATA_ENTITYSET,
            	TEXT:"", 
            	MAIN_MEASURE:"",
            	THRESHOLD_MEASURE:"",
                ALL_DIMENSIONS:dimensions,
                ALL_SORTABLE_DIMENSIONS:sortableDimensions,
                ALL_MEASURES:measures,
                ALL_MEASURES_LABELS:getMeasureWithLabels(),
                VALUE_TYPES : [
                       {key : "ABSOLUTE", text : this.i18nModel.getProperty("ABSOLUTE_VALUES")},           
                       {key : "PERCENTAGE", text : this.i18nModel.getProperty("PERCENTAGE_VALUES")}           
                ],
                AXIS_TYPES : [
                       {key : "SINGLE", text : this.i18nModel.getProperty("SINGLE_AXIS")},           
                       {key : "DUAL", text : this.i18nModel.getProperty("DUAL_AXIS")}           
                ],
                AXIS_TYPE : "SINGLE",
                VALUE_TYPE : "ABSOLUTE",
                CHART_TYPE: "Column",
                CHART_TYPES : [
                                   {key : "Bar", text : this.i18nModel.getProperty("BARS")},
                                   {key : "Column", text :this.i18nModel.getProperty("COLUMNS")},
                                   {key : "Line", text : this.i18nModel.getProperty("LINES")},
                                   {key : "Combination", text : this.i18nModel.getProperty("COLUMNS_AND_LINES")},
                                   {key : "Bubble", text : this.i18nModel.getProperty("BUBBLES")},
                                   {key : "Table", text : this.i18nModel.getProperty("TABLE")}                                  
                                   /*{key : "Choropleth", text : this.i18nModel.getProperty("CHOROPLETH")},*/
                                   
                               ],
                GEO_MAP_TYPE : "Pie",
                GEO_MAP_TYPES : [
                                 
                                 {key : "Pie", text : this.i18nModel.getProperty("PIE")},
                                 {key : "Bubble", text :this.i18nModel.getProperty("BUBBLES")},
                                 {key : "Pin", text : this.i18nModel.getProperty("PIN")},
                                  
                                 
                                 ],
                DATA_MODES :[
                             {key : "DUMMY", text : this.i18nModel.getProperty("DUMMY_DATA")},
                             {key : "RUNTIME", text : this.i18nModel.getProperty("ACTUAL_BACKEND_DATA")}
                             
                ],
                DATA_MODE:"DUMMY",
                DATA_LIMIT :  200,
                DATA_LIMITATIONS :false,
                COLOR_SCHEME : "NONE",
                COLOR_SCHEMES : [
                             	 {key : "NONE", text : this.i18nModel.getProperty("DEFAULT_COLORS")},                                 
                                 {key : "AUTO_SEMANTIC", text :this.i18nModel.getProperty("AUTO_SEMANTIC_COLORS")},
                                 {key : "MANUAL_SEMANTIC", text : this.i18nModel.getProperty("MANUAL_SEMANTIC_COLORS")},
                                 {key : "MANUAL_NON_SEMANTIC", text : this.i18nModel.getProperty("MANUAL_COLORS")}                                 
                    ],
            	"MANUAL_NON_SEMANTIC":	[ 	
    			                  	  	{color:"sapUiChartPaletteQualitativeHue1",index:0},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue2",index:1},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue3",index:2},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue4",index:3},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue5",index:4},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue6",index:5},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue7",index:6},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue8",index:7},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue9",index:8},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue10",index:9},
    			                  	  	{color:"sapUiChartPaletteQualitativeHue11",index:10}
    			                  	 ],
              	"MANUAL_SEMANTIC": [	 
              	                  	 {color:"sapUiChartPaletteSemanticNeutralDark1",index:0},
              	                  	 {color:"sapUiChartPaletteSemanticNeutral",index:1},
              	                  	 {color:"sapUiChartPaletteSemanticNeutralLight1",index:2},
              	                  	 {color:"sapUiChartPaletteSemanticGoodDark1",index:3},
              	                  	 {color:"sapUiChartPaletteSemanticGood",index:4},
              	                  	 {color:"sapUiChartPaletteSemanticGoodLight1",index:5},
              	                  	 {color:"sapUiChartPaletteSemanticCriticalDark1" ,index:6},
              	                  	 {color:"sapUiChartPaletteSemanticCritical",index:7},
              	                  	 {color:"sapUiChartPaletteSemanticCriticalLight1",index:8},
              	                  	 {color:"sapUiChartPaletteSemanticBadDark1",index:9},
              	                  	 {color:"sapUiChartPaletteSemanticBad",index:10},
              	                  	 {color:"sapUiChartPaletteSemanticBadLight1",index:11}
              	                  ],
                COLUMNS : [

                ],
                SIBLING_EVALUATIONS:[
                 ],
                ASSOCIATED_EVALUATIONS:[
                ],
                ADDITIONAL_LANGUAGE_TITLES: [],
                FILTERS : [],
                HEADER_EVALUATIONID:{},
                HEADERS_VISIBLE:[],
                HEADERS :getDefaultHeaders(),
                SELECTED_VIEW : "",
                ALL_VIEWS : this.ddaConfigurator.getAllViews(),
                ALL_LANGUAGES: [],
                CURRENT_LANGUAGE: "E"
            };
            modelData.HEADER_EVALUATIONID[this.evaluationId]=true;
            //modelData.TITLE=this.EVALUATION_DATA.TITLE;
            this.fetchLanguageData("SB_DDACONFIG_LANG",function(o){
            	modelData.ALL_LANGUAGES=o.ALL_LANGUAGES;
            	modelData.CURRENT_LANGUAGE=o.CURRENT_LANGUAGE;
            });
            return modelData;
    },
    getModelDataForDDAConfiguration : function() {
    	function getDataLimit(n){
    		return (n==-1 || !n)?200:n;
    	}
    	function _getAllDimensionsForEval(sId){
    		try{
        		var evalData=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({
     	           id : sId,cache : true, filters:true,thresholds:true
     	        });
        		return sap.suite.ui.smartbusiness.lib.Util.odata.getAllDimensions(evalData.ODATA_URL,evalData.ODATA_ENTITYSET);
    		}catch(e){
    			return [];
    		}
    	}
    	function _getAllMeasuresForEval(sId){
    		try{
        		var evalData=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({
     	           id : sId,cache : true, filters:true,thresholds:true
     	        });
        		return sap.suite.ui.smartbusiness.lib.Util.odata.getAllMeasures(evalData.ODATA_URL,evalData.ODATA_ENTITYSET);
    		}catch(e){
    			return [];
    		}
    	}
    	function _getAllFilterableDimensions(sId){
    		try{
        		var evalData=sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({
     	           id : sId,cache : true, filters:true,thresholds:true
     	        });
        		return sap.suite.ui.smartbusiness.lib.Util.odata.getAllFilterableDimensions(evalData.ODATA_URL,evalData.ODATA_ENTITYSET);
    		}catch(e){
    			return [];
    		}
    	}
    	function _getEvaluationTitle(sId){
    		var evaluationData = that._getEvalData(sId);
    		return (evaluationData && evaluationData.INDICATOR_TITLE) ? evaluationData.INDICATOR_TITLE : "";
    	}
    	function _getEvaluationSubTitle(sId){
    		var evaluationData = that._getEvalData(sId);
    		return (evaluationData && evaluationData.TITLE) ? evaluationData.TITLE : "";
    	}
    	function _getEvaluationIndicator(sId){
    		var evaluationData = that._getEvalData(sId);
    		return (evaluationData && evaluationData.INDICATOR) ? evaluationData.INDICATOR : "";
    	}
    	var that=this;
    	var tileTypes=["NT","AT","CT","TT","CM" /*,"HT"*/];
    	var modelData=this.getDefaultModelData();
    	var filterableDimensions,dimensions,measures;
        if(this.selectedView) {
            /**
             * Filling ALL Views Array
             */
        		var that=this;
            modelData.ALL_VIEWS = this.ddaConfigurator.getAllViews();
            modelData.SELECTED_VIEW = this.selectedView.getId();
            modelData.ID = this.selectedView.getId();
            modelData.TITLE = this.selectedView.getTitle();
            modelData.ADDITIONAL_LANGUAGE_TITLES = this.selectedView.getAdditionalLanguageTitles();
            modelData.ID_EDITABLE = false;
            var chartConfiguration=this.selectedView.getChartConfiguration()[0];
            modelData.THRESHOLD_MEASURE = chartConfiguration?chartConfiguration.getThresholdMeasure():"";
            modelData.AXIS_TYPE = chartConfiguration?chartConfiguration.getAxisType():"SINGLE";
            modelData.VALUE_TYPE = chartConfiguration?chartConfiguration.getValueType():"ABSOLUTE";
            modelData.CHART_TYPE = chartConfiguration?chartConfiguration.getChartType().getText():"Bar";
            modelData.DATA_LIMIT = chartConfiguration?getDataLimit(chartConfiguration.getDataLimit()):200;
            modelData.DATA_LIMITATIONS=this.getDataLimitations();
            modelData.CONFIG.SAP_AGGREGATE_VALUE=this.selectedView.isAggregateValueEnabled();
            modelData.COLOR_SCHEME = chartConfiguration?chartConfiguration.getColorScheme().getText():"AUTO_SEMANTIC";
            if(this.selectedView.getHeaders().length){
            	var headers = this.selectedView.getHeaders();
            	modelData.HEADERS = [];
            	modelData.HEADERS_VISIBLE=[];
            	var headerTileRegister={};
                modelData.HEADER_EVALUATIONID={};
                headers.forEach(function(oHeader) {
                	if(oHeader.getVisualizationType() == "HT"){
	                	return;
                	}
                	modelData.HEADER_EVALUATIONID[oHeader.getReferenceEvaluationId()]=true;
                	headerTileRegister[oHeader.getReferenceEvaluationId()]=headerTileRegister[oHeader.getReferenceEvaluationId()]||{};
                    var measures=_getAllMeasuresForEval(oHeader.getReferenceEvaluationId());
                    var dimensions=_getAllDimensionsForEval(oHeader.getReferenceEvaluationId());
                    var filterableDimensions = _getAllFilterableDimensions(oHeader.getReferenceEvaluationId());
                    var headerConfig=oHeader.getConfiguration();
                	modelData.HEADERS_VISIBLE.push({
                        EVALUATION_ID : that.evaluationId,
                        CONFIGURATION_ID : modelData.SELECTED_VIEW,
                        REFERENCE_EVALUATION_ID : oHeader.getReferenceEvaluationId(),
                        VISUALIZATION_TYPE : oHeader.getVisualizationType(),
                        VISUALIZATION_ORDER : oHeader.getVisualizationOrder(),
                        DIMENSION : oHeader.getDimension()||dimensions[0],
                        SORT_BY:"",
                        SORT_ORDER	:headerConfig.SORTING.by+(headerConfig.SORTING.order=="desc"?+"D":"A"),
                        MEASURE1	:headerConfig.MEASURES[0].name||measures[0],
                        MEASURE2	:headerConfig.MEASURES[1].name||measures[1]||measures[0],
                        MEASURE3	:headerConfig.MEASURES[2]?headerConfig.MEASURES[2].name:"",
                        COLOR1:headerConfig.MEASURES[0].color||"Neutral",
                        COLOR2:headerConfig.MEASURES[1].color||"Neutral",
                        COLOR3:headerConfig.MEASURES[2]?headerConfig.MEASURES[2].color:"Neutral",
                        DIMENSION_COLOR:headerConfig.SORTING.dimension_color||"Neutral",
                        FILTERABLE_DIMENSIONS: filterableDimensions,
                        HARVEY_TOTAL_MEASURE:headerConfig.HARVEY_TOTAL_MEASURE||measures[0],
                        HARVEY_FILTERS:headerConfig.HARVEY_FILTERS||[{
											                        	NAME:filterableDimensions[0],
											                        	OPERATOR:"EQ",
											                        	VALUE_1:[],
											                        	VALUE_2:[]
											                        }],
                        IS_HARVEY_FRACTION_KPIMEASURE : !!headerConfig.IS_HARVEY_FRACTION_KPIMEASURE,
                        IS_HARVEYMEASURE_KPIMEASURE : !headerConfig.IS_HARVEY_FRACTION_KPIMEASURE,
                        ALL_MEASURES:measures,
                        ALL_DIMENSIONS:dimensions,
                        VISIBILITY : oHeader.getVisibility(),
                        visible : true,
                        TITLE : _getEvaluationTitle(oHeader.getReferenceEvaluationId()),
                        SUBTITLE : _getEvaluationSubTitle(oHeader.getReferenceEvaluationId()),
                        INDICATOR:_getEvaluationIndicator(oHeader.getReferenceEvaluationId())
                    });
                	//headerTileRegister[oHeader.getReferenceEvaluationId()][oHeader.getVisualizationType()]=true;
                });
                modelData.HEADERS_VISIBLE.sort(function(a,b){
                	return a.VISUALIZATION_ORDER > b.VISUALIZATION_ORDER?1:-1;
                });
                modelData.HEADER_EVALUATIONID[this.evaluationId]=true;
                headerTileRegister[this.evaluationId]=headerTileRegister[this.evaluationId]||{};
                var that=this;
                
                for(var each in headerTileRegister){     
                	var measures=_getAllMeasuresForEval(each);
                	var dimensions=_getAllDimensionsForEval(each);
                    var filterableDimensions = _getAllFilterableDimensions(each);
                	tileTypes.forEach(function(s){
                        modelData.HEADERS.push({
                            EVALUATION_ID : that.evaluationId,
                            CONFIGURATION_ID : modelData.SELECTED_VIEW,
                            REFERENCE_EVALUATION_ID : each,
                            VISUALIZATION_TYPE : s,
                            VISUALIZATION_TYPE_INDEX:tileTypes.indexOf(s),
                            VISUALIZATION_ORDER : 1,
                            DIMENSION : dimensions[0],
                            SORT_BY:"",
                            SORT_ORDER:"MD",
                            MEASURE1	:measures[0],
                            MEASURE2	:measures[1]||measures[0],
                            MEASURE3	:"",
                            DIMENSION_COLOR : "Neutral",
                            HARVEY_TOTAL_MEASURE: measures[0],
                            FILTERABLE_DIMENSIONS: filterableDimensions,
                            HARVEY_FILTERS:[{
                            	NAME: filterableDimensions[0],
                            	OPERATOR:"EQ",
                            	VALUE_1:[],
                            	VALUE_2:[]
                            }],
                            IS_HARVEY_FRACTION_KPIMEASURE : true,
                            IS_HARVEYMEASURE_KPIMEASURE : false,                            
                            COLOR1:"Good",
                            COLOR2:"Critical",
                            COLOR3:"Error",
                            ALL_MEASURES:measures,
                            ALL_DIMENSIONS:_getAllDimensionsForEval(each),
                            VISIBILITY : 1,
                            visible : false,
                            TITLE: _getEvaluationTitle(each),
                        	SUBTITLE: _getEvaluationSubTitle(each),
                        	GROUPING_TITLE:_getEvaluationTitle(each)+" "+_getEvaluationSubTitle(each),
                            INDICATOR:_getEvaluationIndicator(each)
                        });
                	});
                }
            }
            //modelData.HEADERS = [];
            

            var columns  = this.selectedView.getColumns();
            for(var i=0;i<columns.length;i++) {
                var column = this.selectedView.findColumnByName(columns[i]);
                modelData.COLUMNS.push({
                    NAME : column.getName(),
                    TYPE : column.getType(),
                    COLOR1 : modelData.COLOR_SCHEME=="MANUAL_NON_SEMANTIC"?column. getColor():"",
                    COLOR2 : modelData.COLOR_SCHEME=="MANUAL_SEMANTIC"?column. getColor():"",
                    AXIS : column.getAxis(),
                    SORT_ORDER : column.getSortOrder(),
                    SORT_BY : column.getSortBy(),
                    COLUMNS_ORDER : column.getColumnOrder(),
                    VISIBILITY : column.getVisibility(),
                    STACKING : column.getStacking()
                });
            }
            var filters = this.selectedView.getFilters();
            for(var i=0; i<filters.length;i++) {
                var filter = filters[i];
                modelData.FILTERS.push({
                    name : filter
                });
            }
        }
        return modelData;
    },

    getDataLimitations:function(){
    	var chartConfiguration=this.selectedView.getChartConfiguration()[0];
       	if(chartConfiguration && chartConfiguration.getDataLimit()!= -1){
       		return true;
       	}else if(chartConfiguration && chartConfiguration.getDataLimit()== -1){
       		return false;
       		
       	}
       }
      
};
