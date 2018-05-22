/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
//jQuery.sap.require("sap.ui.vbm.AnalyticMap");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Bullet");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Comparison")
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.AreaChart");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Numeric");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.MeasureComparison");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.HarveyBall");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.drilldown.view.S3", {

	onInit : function() {
		this.chartDummyData = {MEASURES:[[50,80,40,120,60,200,170,20,160,190],
		                                 [30,40,20,90,130,150,200,50,70,90],
		                                 [120,60,200,20,160,190,200,30,40,20],
		                                 [100,160,20,120,60,80,150,130,80,90],
		                                 [180,70,90,30,20,80,130,40,160,190],
		                                 [70,20,190,40,80,120,130,10,60,60],
		                                 [90,80,100,50,160,90,80,30,140,120],
		                                 [80,90,120,200,50,150,140,20,150,130],
		                                 [90,130,150,180,70,90,70,20,190,40],
		                                 [20,160,190,10,160,20,100,50,160,90],
		                                 [40,160,190,30,40,20,90,130,150,180]
						 				]
							  };
//		this.getView().getContent()[0].addContent(new sap.ui.core.HTML({
//            content:'<div class="invisibleDiv">'
//                }));
		//this.errorMessages = [];
		this.errorState = false;
		this.DDA_MODEL = null;
		this.evaluationId = null;
		this.viewId = null;
		this.ddaFilter=this.byId("ddaFilter");
		this.initializeTileHeader();
		this.defineHeaderFooterOptions();
		this.navigatingWithinDrilldown = true;
		this.oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
		this.busyIndicator = new sap.m.BusyDialog();		
		
	},
	tileTypeMapping:{
		NT : "Numeric",
		AT : "Bullet",
		CT : "Comparison",
		TT : "AreaChart",
		CM:"MeasureComparison",
		HT:"HarveyBall"
	},
	headerNumberFormatter:function(s){
		return s?"12,345.67":"";
	},
	headerNumberUnitFormatter:function(s){
		return s?"EUR":"";
	},
	bindUiToModel:function(){
		this.DDA_MODEL.bindModel(this.getView(),"SB_DDACONFIG");
	},
	initializeTileHeader:function(){
		var that=this;
		var tileContainer=this.byId("tileContainer");
		//var filter= new sap.ui.model.Filter("visible",sap.ui.model.FilterOperator.EQ,true);
		tileContainer.bindAggregation("items",{
			path:"SB_DDACONFIG>/HEADERS_VISIBLE",
			factory:function(sId,oBindingContext){
				var type=oBindingContext.getProperty("VISUALIZATION_TYPE");
				return new sap.suite.ui.smartbusiness.tiles[that.tileTypeMapping[type]]({
					evaluationId:that.evaluationId,
					mode:"DUMMY",
					header:	"{SB_DDACONFIG>TITLE}",
					subheader: "{SB_DDACONFIG>SUBTITLE}"
				}).addStyleClass("drilldownKpiTiles");

			},
			//filters:[filter]
		});
	},
	lauchConfigurator: function() {
		var route = null;
		var contextPath = this.evaluationId + "/" + this.viewId;
		this.oApplicationFacade.navigatingWithinDrilldown = this.navigatingWithinDrilldown;
		if(this.DDA_MODEL.getConfigurator().getAllViews().length==0){
			route = "configureChart";
            //this.oRouter.navTo("configureChart",{evaluationId: this.evaluationId, viewId: this.viewId});
        }
        else{
        	route = "configurator";
        	//this.oRouter.navTo("configurator", {evaluationId: this.evaluationId, viewId: this.viewId});
        }
		sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:route, context: contextPath});
		//this.evaluationId = null;
	},
	onRoutePatternMatched: function(oEvent) {
		var view = this.getView();
		var that=this;

		if (oEvent.getParameter("name") === "detail") {
			that.errorState = undefined; 
			that.errorMsg = undefined;
			try {
				//check if the model has to be refreshed due to an eval level save/delete
				if(this.oApplicationFacade.__refreshModel && this.oApplicationFacade.__refreshModel === 1) {
					this.getView().getModel() && this.getView().getModel().refresh();
				}
				this.isPasteEnabled = false;
				var str=oEvent.getParameter("arguments").contextPath;
				var context = new sap.ui.model.Context(view.getModel(), '/' + str);
				this.evalContext = context;
				view.setBindingContext(context);
				if(!(this.oApplicationFacade.__refreshModel) && context.getObject() && (context.getObject()["VIEWS_COUNT"] === null)){
					this.oApplicationFacade.navigatingWithinDrilldown = this.navigatingWithinDrilldown;
					sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"noDataView",context:context.sPath.substr(1)});
					return;
                }
				this.oApplicationFacade.__refreshModel = undefined;
				try{
					this.evaluationId = view.getBindingContext().getObject()["ID"];
				}catch(e){
					try{
						this.evaluationId=  str.match(/ID=[^,]+/g)[0].replace(/(ID=')|(')/g,"");
					}catch(e){
						this.evaluationId=str.replace(/EVALUATIONS_MODELER\('|'\)/g,"")
					}
				}

				var evaluationId=oEvent.getParameter("arguments")["evaluationId"];
				if(evaluationId !== this.evaluationId) {
					this.DDA_MODEL =  sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.getInstance(this.evaluationId, true, this.getView().getModel("i18n"));
					this.EVALUATION = sap.suite.ui.smartbusiness.lib.Util.kpi.parseEvaluation(this.DDA_MODEL.EVALUATION_DATA);
					var newViewId=this.DDA_MODEL.NEW_VIEWID;
					var viewId = this.DDA_MODEL.getConfigurator().getDefaultViewId();
					
					if(this.DDA_MODEL.getConfigurator().getAllViews().length==0){
						sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"noDataView",context:context.sPath.substr(1)});
                    }
					
					if(viewId != null) {
						this.viewId = viewId;
						this.DDA_MODEL.setViewId(viewId);
					} else {
						this.viewId = newViewId;
					}
					this.oApplicationFacade.configuratorViewId = this.DDA_MODEL.NEW_VIEWID;
					this.bindUiToModel();
					this.ddaFilter.setEvaluationData(this.EVALUATION);
					this.ddaFilter.setEvaluationId(this.evaluationId);
					var filterDimensions=[];
					this.getView().getModel("SB_DDACONFIG").getProperty("/FILTERS").forEach(function(s){
						filterDimensions.push(s.name); 
					})
					this.ddaFilter.setDimensions(filterDimensions);
				}else{
					this.bindUiToModel();
					if(this.viewId==newViewId && this.getView().getModel("SB_DDACONFIG").getProperty("/ID")!=newViewId ){

					}
				}
				//store init count of headers and filters
				this.INIT_COUNT_HEADERS = this.getView().getModel("SB_DDACONFIG").getData()["HEADERS"].length;
				this.INIT_COUNT_FILTERS = this.getView().getModel("SB_DDACONFIG").getData()["FILTERS"].length;

				this._oTextsModel = this.getView().getModel("i18n");
								
				var otoolBarDimSelect = this.getView().byId("vizViewSelector");
				otoolBarDimSelect.bindProperty("selectedKey","SB_DDACONFIG>/ID");				

				this.getView().byId("choroplethViewSelect").bindProperty("selectedKey","SB_DDACONFIG>/ID");
				this._oModel = this.getView().getModel("SB_DDACONFIG").getData();
				this.refreshChart();
				
				if(this.copyClipboard && Object.keys(this.copyClipboard) && Object.keys(this.copyClipboard).length) {
					this.checkEvaluationForPaste();
				}
				else {
					if(this._oControlStore && this._oControlStore.oButtonListHelper) {
						this.updateHeaderFooterOptions(false);
					}
				}

				if(this.getPage().getFooter()) {
					this.checkForCopy();
				}
			}
			catch(e) {
				that.errorState = true;
				that.errorMsg = e.message;
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), e.message);
			}
			finally {
				if(this.byId("choroplethViewSelect") && this.byId("choroplethViewSelect").getSelectedItem()) {
					this.byId("choroplethViewSelect").setTooltip(this.byId("choroplethViewSelect").getSelectedItem().getText());
				}
				if(this.byId("vizViewSelector") && this.byId("vizViewSelector").getSelectedItem()) {
					this.byId("vizViewSelector").setTooltip(this.byId("vizViewSelector").getSelectedItem().getText());
				}
			}
		}
	}, 
	
	defineHeaderFooterOptions:function(){
		var that = this;
		this.oHeaderFooterOptions = { 
				bSuppressBookmarkButton : true,
				sI18NDetailTitle: "DRILLDOWN_CONFIG_DETAILS",
				oEditBtn : {
					sI18nBtnTxt : "CONFIGURE",
					onBtnPressed : function(evt) {
						if(that.errorState) {
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), that.errorMsg);
							return;
						}
						that.lauchConfigurator()
					},
					bEnabled : false, // default true
				},
				buttonList : [{
				            	  sId : "Copy", // optional
				            	  sI18nBtnTxt : "COPY",
				            	  onBtnPressed : function(evt) {
				            		  if(that.errorState) {
											sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), that.errorMsg);
											return;
										}
				            		  that.copyEvaluationToClipboard();
				            	  }
				              },
				              {
				            	  sId : "Paste", // optional
				            	  sI18nBtnTxt : "PASTE",
				            	  bDisabled : (!(that.isPasteEnabled)),
				            	  onBtnPressed : function(evt) {
				            		  if(that.errorState) {
											sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), that.errorMsg);
											return;
										}
				            		  that.copyDDAConfiguration();
				            	  }
				              },
				              {
				            	  sId : "Delete", // optional
				            	  sI18nBtnTxt : "DELETE",
				            	  onBtnPressed : function(evt) {
				            		  if(that.errorState) {
											sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), that.errorMsg);
											return;
										}
				            		  that.onDeleteConfiguration();
				            	  }
				              }
				              /* {
				                  sId : "cancel", // optional
				                  sI18nBtnTxt : "Cancel",
				                  onBtnPressed : function(evt) {
				                  }
				             },*/

				              ]
		
		};
	},
	
	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},
	
	formatColorForMap : function(main_measure,threshold_measure){
		var semanticColorOption = this.dda_config.chartConfig.colorScheme.toUpperCase();
		var goal_type = this.DDA_MODEL.EVALUATION_DATA.GOAL_TYPE;

		if(semanticColorOption=="AUTO_SEMANTIC" && threshold_measure){
			if(goal_type == "MA" || goal_type == "RA"){
				if(main_measure > threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')); //good
				}
				else if(main_measure == threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNeutral'));	//neutral
				}
				else if(main_measure < threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative'));//bad
				}
			}
			else if(goal_type == "MI"){
				if(main_measure < threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')); //good
				}
				else if(main_measure == threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNeutral'));	//neutral
				}
				else if(main_measure > threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative'));//bad
				}
			}
		}
		else if(semanticColorOption=="NONE" && threshold_measure){
			if(goal_type == "MA" || goal_type == "RA"){
				if(main_measure > threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNeutral'),"1"); //good
				}
				else if(main_measure == threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNeutral'),"0.60");	//neutral
				}
				else if(main_measure < threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNeutral'),"0.30");//bad
				}
			}
			else if(goal_type == "MI"){
				if(main_measure < threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNeutral'),"1"); //good
				}
				else if(main_measure == threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNeutral'),"0.60");	//neutral
				}
				else if(main_measure > threshold_measure){
					return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNeutral'),"0.30");//bad
				}
			}
		}
		else{
			return sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNeutral'));
		}
	},
	
	formatCode : function(code){
		return code;
	},

	refreshChart: function() {
		var oController = this ;
		var vizVbox = this.getView().byId("viz_vbox");
		var choroplethVbox = this.getView().byId("choropleth_select_vbox");
		var choroplethMapContainer = this.getView().byId("choropleth_vbox");
		var geoDimensionForChoropleth,mainMeasureForChoropleth,thresholdMeasureForChoropleth = null;
		this.oChartDataModel = new sap.ui.model.json.JSONModel() ;
		this.oChartData = [] ;
		
		var tmpData = this._oModel;
		this.dda_config = {} ;
		this.dda_config.chartConfig = {
				mode: tmpData.DATA_MODE || "DUMMY",
				title: "",
				dataLimit: tmpData.DATA_LIMIT || null,	
				dataLimitations: tmpData.DATA_LIMITATIONS || false,
				type: (tmpData.CHART_TYPE).toUpperCase() || "BAR",
				axis: tmpData.AXIS_TYPE || "SINGLE",
				value: tmpData.VALUE_TYPE || "ABSOLUTE",
				colorScheme: tmpData.COLOR_SCHEME || "NONE",
				thresholdMeasure: tmpData.THRESHOLD_MEASURE || ""
		} ;

		this.dda_config.columnsConfig = [] ;
		for(var i=0;i<tmpData.COLUMNS.length;i++) {
			this.dda_config.columnsConfig.push({
				name: tmpData.COLUMNS[i].NAME,
				type: tmpData.COLUMNS[i].TYPE,
				visibility: tmpData.COLUMNS[i].VISIBILITY || "BOTH",
				columns_order: tmpData.COLUMNS[i].COLUMNS_ORDER,
				sortOrder: tmpData.COLUMNS[i].SORT_ORDER || "NONE",
				sortBy: tmpData.COLUMNS[i].SORT_BY || "",
				axis: tmpData.COLUMNS[i].AXIS || 1,
				stacking: tmpData.COLUMNS[i].STACKING || 0,
				color:tmpData.COLOR_SCHEME=="MANUAL_NON_SEMANTIC"?tmpData.COLUMNS[i].COLOR1:tmpData.COLOR_SCHEME=="MANUAL_SEMANTIC"?tmpData.COLUMNS[i].COLOR2:""
			}) ;
		}			

		this.oColumns = [] ;
		this.oDimensions = [] ;
		this.oMeasures = [] ;
		this.dimNameArray = [] ;
		this.msrNameArray = [] ;
		this.chartDimensions = [] ;
		this.chartDimNames = [] ;
		this.chartMeasures = [] ;
		this.chartMsrNames = [] ;
		this.tableDimensions = [] ;
		this.tableDimNames = [] ;
		this.tableMeasures = [] ;
		this.tableMsrNames = [] ;
		for(var i=0;i<this.dda_config.columnsConfig.length;i++) {
			this.oColumns.push(this.dda_config.columnsConfig[i]);
			if((this.dda_config.columnsConfig[i].type).toUpperCase() === "DIMENSION") {
				this.oDimensions.push(this.dda_config.columnsConfig[i]) ;
				this.dimNameArray.push(this.dda_config.columnsConfig[i].name) ;
				if(((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "CHART") || ((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "BOTH")) {
					this.chartDimensions.push(this.dda_config.columnsConfig[i]) ;
					this.chartDimNames.push(this.dda_config.columnsConfig[i].name) ;
			    }
				if(((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "TABLE") || ((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "BOTH")) {
			    	this.tableDimensions.push(this.dda_config.columnsConfig[i]) ;
			    	this.tableDimNames.push(this.dda_config.columnsConfig[i].name) ;
			    }	
			} else if((this.dda_config.columnsConfig[i].type).toUpperCase() === "MEASURE") {
				this.oMeasures.push(this.dda_config.columnsConfig[i]) ;
				this.msrNameArray.push(this.dda_config.columnsConfig[i].name) ;
				if(((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "CHART") || ((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "BOTH")) {
					this.chartMeasures.push(this.dda_config.columnsConfig[i]) ;
					this.chartMsrNames.push(this.dda_config.columnsConfig[i].name) ;
			    }
				if(((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "TABLE") || ((this.dda_config.columnsConfig[i].visibility).toUpperCase() === "BOTH")) {
			    	this.tableMeasures.push(this.dda_config.columnsConfig[i]) ;
			    	this.tableMsrNames.push(this.dda_config.columnsConfig[i].name) ;
			    }
			}
		}
		
		this.stacking = this.getStacking(this.chartMeasures,this.chartDimensions);                        // TODO      workaround for stacking .
		this.isStackMsr = false;
		this.isStackDim = false;
		if(this.stacking.isEnabled && (this.stacking.type == "M"))                                     
			this.isStackMsr = true;
		else if(this.stacking.isEnabled && (this.stacking.type == "D")) 
			this.isStackDim = true;
		
		//getting labels , texts etc.
		try {
			var mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(this._oModel.QUERY_SERVICE_URI,this._oModel.QUERY_ENTITY_SET);
		}
		catch(e) {
			jQuery.sap.log.error("Failed to instantiate the odata model");
			throw e;
		}
        this.column_labels_mapping = mProperties.getLabelMappingObject();
        this.dimension_text_property_mapping = mProperties.getTextPropertyMappingObject();
        this.measure_unit_property_mapping = mProperties.getUnitPropertyMappingObject();		
		
		// create viz chart :
		vizVbox.setVisible(true);
		choroplethVbox.setVisible(false);
		
		// get data for chart.....................
		if((this.dda_config.chartConfig.mode).toUpperCase() === "DUMMY") {
			this.oChartData = this.getDummyDataForChart(this.dimNameArray,this.msrNameArray) ;
			this.oChartDataModel.setData({businessData: oController.oChartData}) ;
		} else if((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME") {
			this.getRuntimeChartData(this.dimNameArray,this.msrNameArray,this.oDimensions,this.oMeasures) ;           // TODO        P.S.  write code for avoiding multiple calls - caching .
		} 
		
		if((this.dda_config.chartConfig.type).toUpperCase() == "CHOROPLETH"){
			this.plotMapForChoropleth();
		}
		else{
			this.createVizChart(this.chartDimensions,this.chartMeasures);
		}						
		
		// show or hide legend 
		this.showChartLegendIfApplicable(this.chartDimNames,this.chartMsrNames);		
		
	},  

	plotMapForChoropleth : function(){
		var oController = this ;
		var vizVbox = this.getView().byId("viz_vbox");
		var choroplethVbox = this.getView().byId("choropleth_select_vbox");
		var choroplethMapContainer = this.getView().byId("choropleth_vbox");
		var geoDimensionForChoropleth,mainMeasureForChoropleth,thresholdMeasureForChoropleth = null;

		vizVbox.setVisible(false);
		choroplethVbox.setVisible(true);
		choroplethMapContainer.removeAllItems();
		this.oModelForMap = new sap.ui.model.json.JSONModel();

		var items = this.getView().getModel("SB_DDACONFIG").getData().COLUMNS;
		var itemsLength = items.length;
		var measuresArray = [];
		for(i=0;i<itemsLength;i++){
			if(items[i].TYPE=='MEASURE'){
				measuresArray.push(items[i]);
			}
			else if(items[i].TYPE=='DIMENSION'){
				this.getView().getModel("SB_DDACONFIG").getData().GEO_DIMENSION = items[i].NAME;
			}
		}
		this.getView().getModel("SB_DDACONFIG").getData().MAIN_MEASURE = measuresArray[0].NAME;

		if((this.dda_config.chartConfig.mode).toUpperCase() === "DUMMY") {
			geoDimensionForChoropleth = "CustomerCountry";
			mainMeasureForChoropleth = "DaysSalesOutstanding";
			thresholdMeasureForChoropleth = "BestPossibleDaysSalesOutstndng";

			var oData = 
			{
					businessData :
						[
						 { "CustomerCountry": "IT","DaysSalesOutstanding" : 125,"BestPossibleDaysSalesOutstndng" : 125},
						 { "CustomerCountry": "IN","DaysSalesOutstanding" : 500,"BestPossibleDaysSalesOutstndng" : 125},
						 { "CustomerCountry": "RU","DaysSalesOutstanding" : 40,"BestPossibleDaysSalesOutstndng" : 125},
						 { "CustomerCountry": "AU","DaysSalesOutstanding" : 200,"BestPossibleDaysSalesOutstndng" : 125},
						 { "CustomerCountry": "BR","DaysSalesOutstanding" : 125,"BestPossibleDaysSalesOutstndng" : 125},
						 { "CustomerCountry": "NO","DaysSalesOutstanding" : 200,"BestPossibleDaysSalesOutstndng" : 125},
						 { "CustomerCountry": "AR","DaysSalesOutstanding" : 130,"BestPossibleDaysSalesOutstndng" : 125},
						 { "CustomerCountry": "ZA","DaysSalesOutstanding" : 125,"BestPossibleDaysSalesOutstndng" : 125},
						 { "CustomerCountry": "CA","DaysSalesOutstanding" : 75,"BestPossibleDaysSalesOutstndng" : 125}
						 ],
			};
			this.oModelForMap.setData(oData);
		}
		else if((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME") {
			geoDimensionForChoropleth = oController.getView().getModel('SB_DDACONFIG').getData().GEO_DIMENSION;
			mainMeasureForChoropleth = oController.getView().getModel('SB_DDACONFIG').getData().MAIN_MEASURE;
			thresholdMeasureForChoropleth = oController.getView().getModel('SB_DDACONFIG').getData().THRESHOLD_MEASURE;

			this.getRuntimeChartData(this.dimNameArray,this.msrNameArray,this.oDimensions,this.oMeasures);
		}
		//sap.ui.vbm.AnalyticMap.GeoJSONURL  =  jQuery.sap.getModulePath("sap.suite.ui.smartbusiness.lib")+"/L0.json";
		jQuery.sap.require("sap.ui.vbm.AnalyticMap");
		choroplethMapContainer.addItem(new sap.ui.vbm.AnalyticMap({
			width : "100%",
			height : "600px",
			regions : {
				path : "mapModel>/businessData",
				template: new sap.ui.vbm.Region({
					code: {
						path: "mapModel>"+geoDimensionForChoropleth,
						formatter:jQuery.proxy(oController.formatCode,oController)
					},
					color: {
						parts:[{
							path: "mapModel>"+mainMeasureForChoropleth
						},
						{
							path: "mapModel>"+thresholdMeasureForChoropleth
						}], 
						formatter:jQuery.proxy(oController.formatColorForMap,oController)
					},
				})
			}
		}).addStyleClass('choroplethMap')).setModel(this.oModelForMap,"mapModel");

		return;
	},
	
	showChartLegendIfApplicable : function(dimensions, measures) {
   	 	var that = this;
   	 	var otoolbar = this.getView().byId("vizChartContainer") ;
   	 	
        var chtype = this.dda_config.chartConfig.type ;           
        var isStackApplied = (((chtype == "BAR") || (chtype == "COLUMN")) && (this.isisStackDim) && (this.getDimensionToBeStacked(that.chartDimensions)) && (dimensions.length > 1)) ? true : false ;        
                
		if((measures.length > 1) || (isStackApplied)) {             
			otoolbar.setShowLegend(true);
		} else {
			otoolbar.setShowLegend(false);
		}
		
    },
    
    getChartPercentFormatter: function(isStandard){
 		//var locale=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
 		function isNumber(n) {
 			return !isNaN(parseFloat(n)) && isFinite(n);
 		}
 		var formatterConstructor={style:isStandard?'standard':'short'};
 		//if(dec||dec==0){formatterConstructor["shortDecimals"]=dec;}
 		var chartFormatter=sap.ui.core.format.NumberFormat.getPercentInstance(formatterConstructor);
 		return function(s){
 			return isNumber(s)?chartFormatter.format_percentage(s):s;
 		};
     },
	
	getStacking: function(measures,dimensions) {													    // TODO
		var oStacking = {};
		oStacking.isEnabled = false;
		oStacking.type = "none";
		
		for(var i=0;i<measures.length;i++) {
			if(measures[i].stacking === 1) {
				oStacking.isEnabled = true;
				oStacking.type = "M";
			}				
		}
		if(!(oStacking.isEnabled)) {
			for(var i=0;i<dimensions.length;i++) {
				if(dimensions[i].stacking === 1) {
					oStacking.isEnabled = true;
					oStacking.type = "D";
				}				
			}
		}
		
		return oStacking;
	},
	
	setStacking: function(isEnabled,type,columns) {																// TODO     type : M for measure , D for dimension and N for none .
		var that = this;
		if(isEnabled) {
			if(type == "M") {
				for(var i=0;i<columns.length;i++) {
					if((columns[i].TYPE).toUpperCase() === "MEASURE") {
						columns[i].STACKING = 1;
					} else if((columns[i].TYPE).toUpperCase() === "DIMENSION") {
						columns[i].STACKING = 0;
					}	
				}
			} else if(type == "D") {
				for(var i=0;i<columns.length;i++) {
					if((columns[i].TYPE).toUpperCase() === "MEASURE") {
						columns[i].STACKING = 0;
					} else if((columns[i].TYPE).toUpperCase() === "DIMENSION") {
						columns[i].STACKING = 1;
					}				
				}
			}
		} else {
			for(var i=0;i<columns.length;i++) {
				columns[i].STACKING = 0;
			}
		}		
	},
	
	getDimensionToBeStacked: function(dimensions) {
		var oDim = null;
		for(var i=0;i<dimensions.length;i++) {
			if(dimensions[i].axis === 2) {
				oDim = dimensions[i];
				break;
			}
		}
		
		return oDim ;
	},
	
	setDimensionToBeStacked: function(columns,stackDim) {
		if(stackDim) {
			for(var i=0;i<columns.length;i++) {
				if((columns[i].TYPE).toUpperCase() === "DIMENSION") {
					columns[i].AXIS = 1;
					if(columns[i].NAME === stackDim) {
						columns[i].AXIS = 2;
					}
				}
			}
		}
	},
	
	updateColumnProperty: function(columns,name,property,value) {
		for(var i=0;i<columns.length;i++) {
			if(columns[i].NAME === name) {
				(columns[i])[property] = value;
				break;
			}
		}
	},
	
	getMeasuresByAxis: function(columns) {
		var dualMsr = {};
		dualMsr.axis1 = {};
		dualMsr.axis1.objArr = [];
		dualMsr.axis1.nameArr = [];
		dualMsr.axis2 = {};
		dualMsr.axis2.objArr = [];
		dualMsr.axis2.nameArr = [];
		
		for(var i=0;i<columns.length;i++) {
			if(columns[i].axis === 1) {
				dualMsr.axis1.objArr.push(columns[i]);
				dualMsr.axis1.nameArr.push(columns[i].name);
			} else if(columns[i].axis === 2) {
				dualMsr.axis2.objArr.push(columns[i]);
				dualMsr.axis2.nameArr.push(columns[i].name);
			}
		}
		return dualMsr;
	},

	/*
	 * 2 Table related methods follow - same as runtime methods. 
	 */
	_getValueState : function(actualValue, thresholdValue) {
        if(!this.EVALUATION.isTargetKpi()) {
            if(actualValue < thresholdValue) {
                return this.EVALUATION.isMaximizingKpi() ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.Success;
            } else if (actualValue == thresholdValue) {
                return sap.ui.core.ValueState.None;
            } else {
                return this.EVALUATION.isMaximizingKpi() ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error;
            }
        } else {
            return sap.ui.core.ValueState.None;
        }
    },
    _getTableCell : function(originalMeasure, thresholdMeasure) {
        var that = this;
        if(thresholdMeasure && (originalMeasure !== thresholdMeasure)) {
            return new sap.m.ObjectNumber({
                number: {
                    path: originalMeasure
                },
                state : {
                    parts : [
                             {path : originalMeasure},
                             {path : thresholdMeasure}
                    ],
                    formatter : function(oMeasureValue, tMeasureValue) {
                        try {
                            oMeasureValue = window.parseFloat(oMeasureValue);
                            tMeasureValue = window.parseFloat(tMeasureValue);
                            return that._getValueState(oMeasureValue, tMeasureValue);
                        }catch(e) {
                            return sap.ui.core.ValueState.None;
                        }
                    }
                }
            });
        } else {
            return new sap.m.Label({
                text : {
                    path : originalMeasure
                }
            })
        }
    },
	
	formatChartNumbers: function (value) {
		//var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}

		if (isNumber(value)) {
			if (!this.chartFormatter) {
				var dec = 1;                              //   TODO            numberOfDecimals
				if (dec || dec==0){
					this.chartFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({
						style: 'short',
						minFractionDigits: dec,
						maxFractionDigits: dec
					});
				}

				else{
					this.chartFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({
						style: 'short'
					});
				}
			}
			value = this.chartFormatter.format(value);
		}

		return value;
	},
	pseudoChartFormatter: function (value) {
		return value;
	},
	
	getRuntimeChartData: function(dimensions,measures) {                          // TODO
		var that = this;
				
		var chartToolbarRef = this.getView().byId("vizChartContainer");
		chartToolbarRef.setBusy(true);
		
		this.COLUMNS_SORT = [];
        for(var i=0;i<that.oColumns.length;i++) {
            if(that.oColumns[i].sortBy && that.oColumns[i].sortOrder) {
                if((that.oColumns[i].sortOrder).toUpperCase() == "ASC" || (that.oColumns[i].sortOrder).toUpperCase == "DESC") {
                    this.COLUMNS_SORT.push({
                        name : that.oColumns[i].sortBy,
                        order : that.oColumns[i].sortOrder
                    });
                }
            }
        }
        
        try{
			var oUriObject = sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
		        serviceUri : this._oModel.QUERY_SERVICE_URI,
		        entitySet : this._oModel.QUERY_ENTITY_SET,
		        dimension : dimensions,
		        measure : measures,
		        filter : this.DDA_MODEL.EVALUATION_DATA.FILTERS.results,
		        sort : this.COLUMNS_SORT,
	            dataLimit : (((this.dda_config.chartConfig.dataLimitations) && (this.dda_config.chartConfig.dataLimit > 0)) ? (this.dda_config.chartConfig.dataLimit) : null),
	            //includeDimensionKeyTextAttribute : true/false, default true,
	            //includeMeasureRawFormattedValueUnit : true/false, default True,
		    });
		    
		    oUriObject.model.read(oUriObject.uri, null, null, true, function(data) {
		    	if(data.results.length) {
		    		that.oChartData = data.results ;		
					that.oChartDataModel.setData({businessData: that.oChartData}) ;
					if((that.getView().getModel('SB_DDACONFIG').getData().CHART_TYPE).toUpperCase()=='CHOROPLETH'){
						that.oModelForMap.setData({businessData: that.oChartData});
					}	
				} else {
					jQuery.sap.log.info("Chart data Table Returned Empty Results");
					that.oChartData = [];		
					that.oChartDataModel.setData({businessData: that.oChartData}) ;
				}
		    	chartToolbarRef.setBusy(false);
		    }, function() {
		    	jQuery.sap.log.error("Error fetching data : "+oUriObject.uri);
		    	that.oChartData = [];		
				that.oChartDataModel.setData({businessData: that.oChartData}) ;
				chartToolbarRef.setBusy(false);
		    });
		} catch(exp){
			jQuery.sap.log.error(exp.toString());
			that.oChartData = [];		
			that.oChartDataModel.setData({businessData: that.oChartData}) ;
			chartToolbarRef.setBusy(false);
		}
	},
	
	getDummyDataForChart: function(dim,measure,MAX_D,DATA_SZ) {
		var that = this;
		MAX_D=MAX_D|| 10;
		DATA_SZ= DATA_SZ||10;
		var chartData=[];
		var tmp,dimension={},p;
		for(var i=0;i<dim.length;i++){
			dimension[dim[i]]=[];
			for(var j=0;j<MAX_D;j++){
				dimension[dim[i]].push(dim[i]+"_"+j);
			}
		}
		p=MAX_D-1;
		for(var i=0;i<DATA_SZ;i++){
			tmp={};
			for(var j=0;j<dim.length;j++){
				tmp[dim[j]]=dimension[dim[j]][p];
			}
			for(var j=0;j<measure.length;j++){
				tmp[measure[j]]=that.chartDummyData.MEASURES[i][j];
			}
			chartData.push(tmp);
			p--;
		}
		chartData=this.sortChartData(chartData,dim);
		return chartData;
	},
	
	sortChartData: function(arr,dim) {
		var data=[];
		arr.sort(function(a,b){
			var i=0;
			while(i<dim.length){
				if(a[dim[i]]>b[dim[i]]){
					return -1;
				}
				else if(a[dim[i]]<b[dim[i]]){
					return 1;
				}
				i++;

			}

		});
		var tmp={};
		for(var i=0,k=0;i<arr.length;i++){
			var s="";
			for(var j=0;j<dim.length;j++){
				s+=arr[i][dim[j]];
			}
			if(!tmp[s]){
				tmp[s]=true;
				data[k++]=arr[i];
			}
		}
		return data;
	},

//	** For deleting a view :

	onDeleteConfiguration: function() {
		  var that=this;
		
    	  var self = that;
     	  this.confirmDialog = new sap.m.Dialog({
     		 icon:"sap-icon://warning2",
     		 title:self._oTextsModel.getResourceBundle().getText("WARNING"),
     		 state:"Error",
     		 type:"Message",
     		 content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("DELETE_ALL_CONFIGURATIONS")})],
     		 beginButton: new sap.m.Button({
     			 text:self._oTextsModel.getResourceBundle().getText("OK"),
     			 press: function(){
     				//go into busy mode.
     				that.busyIndicator.open() && that.getView().setBusy(true);
     				self.deleteMaster();
     			 }
     		 }),
     		 endButton: new sap.m.Button({
     			 text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
     			 press:function(){this.getParent().close();}
     		 })
     	 });
     	 this.confirmDialog.open();
	},	
	deleteMaster: function() {	
		var that = this;
		var modelData=this.getView().getModel("SB_DDACONFIG").getData();
		this.busyIndicator.open() && this.getView().setBusy(true);
		var saveService=sap.suite.ui.smartbusiness.Adapter.getService("DrilldownServices");
		saveService.saveEvalConfiguration(this.evaluationId,modelData,"delete",function(){
    		  jQuery.sap.log.info("Deleted master configuration for the evaluation");
      		  that.busyIndicator.close() && that.getView().setBusy(false);
      		  sap.m.MessageToast.show(that._oTextsModel.getResourceBundle().getText("EVAL_CONFIG_DELETE_SUCCESS"));
      		  that.confirmDialog.close();
      		  that.DDA_MODEL.removeAllViews();
      		  that.DDA_MODEL.setViewId("");
      		  that.bindUiToModel();
      		  that._oModel = that.DDA_MODEL.getModelDataForDDAConfiguration();
      		  that.refreshChart();
      		  sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"noDataView",context:that.evalContext.sPath.substr(1)});
      		  that.getView().getModel().refresh();
		},function(e){
      		  jQuery.sap.log.error(e + " failed");
      		  that.busyIndicator.close() && that.getView().setBusy(false);
      		  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that._oTextsModel.getResourceBundle().getText("DELETE_ERROR"));
      		  });
	},
	// --------------------------------------------------------------------------------------------
	
	updateHeaderFooterOptions: function(paste) {
		this.isPasteEnabled = paste;
		this.defineHeaderFooterOptions();
		this.setHeaderFooterOptions(this.getHeaderFooterOptions());
		//this.setBtnEnabled("Paste",paste);
	},
	
	checkEvaluationForPaste: function() {
		var currentEvaluationData = this.EVALUATION.evaluationData;
		var currentMasterData = this.getView().getModel("SB_DDACONFIG").getData();

		if((this.copyClipboard.evaluationData.ID == currentEvaluationData.ID) || this.checkEvaluationForPaste1()) {
			this.updateHeaderFooterOptions(false);
		}
		else {
			this.updateHeaderFooterOptions(true);
		}
		
//		if(this.copyClipboard.evaluationData.ID != currentEvaluationData.ID) {
//			for(var i=0,l=this.copyClipboard.MasterData.ALL_MEASURES.length; i<l; i++) {
//				if(currentMasterData.ALL_MEASURES.indexOf(this.copyClipboard.MasterData.ALL_MEASURES[i]) == -1) {
//					this.updateHeaderFooterOptions(false);
//					return;
//				}
//			}
//			for(var i=0,l=this.copyClipboard.MasterData.ALL_DIMENSIONS.length; i<l; i++) {
//				if(currentMasterData.ALL_DIMENSIONS.indexOf(this.copyClipboard.MasterData.ALL_DIMENSIONS[i]) == -1) {
//					this.updateHeaderFooterOptions(false);
//					return;
//				}
//			}
//			this.updateHeaderFooterOptions(true);
//		}
//		else {
//			this.updateHeaderFooterOptions(false);
//		}
//		return;
	},
	
	checkEvaluationForPaste1: function() {
		//var currentEvaluationData = this.EVALUATION.evaluationData;
		var masterData = this.copyClipboard.masterData;
		var measures = {};
		var dimensions = {};
		if(this.getView().getModel("SB_DDACONFIG").getData().ALL_MEASURES.length) {
			if(this.getView().getModel("SB_DDACONFIG").getData().ALL_MEASURES.length == 1) {
				measures[this.getView().getModel("SB_DDACONFIG").getData().ALL_MEASURES[0]] = "M";
			}
			else {
				measures = this.getView().getModel("SB_DDACONFIG").getData().ALL_MEASURES.reduce(function(p,c,i,a) { measures = measures || {}; if(i == 1){ measures[a[0]] = "M"; }  measures[a[i]] = "M"; return measures;});
			}
		}
		if(this.getView().getModel("SB_DDACONFIG").getData().ALL_DIMENSIONS.length) {
			if(this.getView().getModel("SB_DDACONFIG").getData().ALL_DIMENSIONS.length == 1) {
				dimensions[this.getView().getModel("SB_DDACONFIG").getData().ALL_DIMENSIONS[0]] = "D";
			}
			else {
				dimensions = this.getView().getModel("SB_DDACONFIG").getData().ALL_DIMENSIONS.reduce(function(p,c,i,a) { dimensions = dimensions || {}; if(i == 1){ dimensions[a[0]] = "D"; }  dimensions[a[i]] = "D"; return dimensions;});
			}
		}
		
		var error = null;
		this.diffHeaders = [];
		
		for(var i=0,l=masterData.FILTERS.length; i<l; i++) {
			delete masterData.FILTERS[i].__metadata;
			if(dimensions[masterData.FILTERS[i].DIMENSION] != "D") {
				if(error == null) {
					error = {};
				}
				if(error.DIMENSIONS == undefined) {
					error.DIMENSIONS = {};
				}
				if(error.DIMENSIONS[masterData.FILTERS[i].DIMENSION] == undefined) {
					error.DIMENSIONS[masterData.FILTERS[i].DIMENSION] = [];
				} 
				masterData.FILTERS[i].entityType = "FILTER";
				error.DIMENSIONS[masterData.FILTERS[i].DIMENSION].push(masterData.FILTERS[i]);
			}
		}
		
		for(var i=0,l=masterData.CHART.length; i<l; i++) {
			delete masterData.CHART[i].__metadata;
			if(masterData.CHART[i].THRESHOLD_MEASURE) {
				if(measures[masterData.CHART[i].THRESHOLD_MEASURE] != "M") {
					if(error == null) {
						error = {};
					}
					if(error.MEASURES == undefined) {
						error.MEASURES = {};
					}
					if(error.MEASURES[masterData.CHART[i].THRESHOLD_MEASURE] == undefined) {
						error.MEASURES[masterData.CHART[i].THRESHOLD_MEASURE] = [];	
					}
					masterData.CHART[i].entityType = "THRESHOLD_MEASURE";
					error.MEASURES[masterData.CHART[i].THRESHOLD_MEASURE].push(masterData.CHART[i]);
				}
			}
		}

		for(var i=0,l=masterData.COLUMNS.length; i<l; i++) {
			delete masterData.COLUMNS[i].__metadata;
			var measure = null;
			var dimension = null;
			if(masterData.COLUMNS[i].TYPE == "MEASURE") {
				if((measures[masterData.COLUMNS[i].NAME] != "M")) {
					if(error == null) {
						error = {};
					}
					if(error.MEASURES == undefined) {
						error.MEASURES = {};
					}
					if(error.MEASURES[masterData.COLUMNS[i].NAME] == undefined) {
						error.MEASURES[masterData.COLUMNS[i].NAME] = [];	
					}
					masterData.COLUMNS[i].entityType = "MEASURE";
					error.MEASURES[masterData.COLUMNS[i].NAME].push(masterData.COLUMNS[i]);
					//error.MEASURES[masterData.COLUMNS[i].NAME][error.MEASURES[masterData.COLUMNS[i].NAME].length-1].entityType = "MEASURE";
				}
				if((measures[masterData.COLUMNS[i].SORT_BY] != "M")) {
					if(error == null) {
						error = {};
					}
					if(error.MEASURES == undefined) {
						error.MEASURES = {};
					}
					if(error.MEASURES[masterData.COLUMNS[i].SORT_BY] == undefined) {
						error.MEASURES[masterData.COLUMNS[i].SORT_BY] = [];	
					}
					measure = jQuery.extend(true, {}, masterData.COLUMNS[i], {});
					measure.entityType = "SORT_BY";
					error.MEASURES[masterData.COLUMNS[i].SORT_BY].push(measure);
				}
			}
			else if(masterData.COLUMNS[i].TYPE == "DIMENSION") {
				if((dimensions[masterData.COLUMNS[i].NAME] != "D")) {
					if(error == null) {
						error = {};
					}
					if(error.DIMENSIONS == undefined) {
						error.DIMENSIONS = {};
					}
					if(error.DIMENSIONS[masterData.COLUMNS[i].NAME] == undefined) {
						error.DIMENSIONS[masterData.COLUMNS[i].NAME] = [];	
					}
					masterData.COLUMNS[i].entityType = "DIMENSION";
					error.DIMENSIONS[masterData.COLUMNS[i].NAME].push(masterData.COLUMNS[i]);
					//error.DIMENSIONS[masterData.COLUMNS[i].NAME][error.DIMENSIONS[masterData.COLUMNS[i].NAME].length-1].entityType = "DIMENSION";
				}
				if((dimensions[masterData.COLUMNS[i].SORT_BY] != "D")) {
					if(error == null) {
						error = {};
					}
					if(error.DIMENSIONS == undefined) {
						error.DIMENSIONS = {};
					}
					if(error.DIMENSIONS[masterData.COLUMNS[i].SORT_BY] == undefined) {
						error.DIMENSIONS[masterData.COLUMNS[i].SORT_BY] = [];	
					}
					dimension = jQuery.extend(true, {}, masterData.COLUMNS[i], {});
					dimension.entityType = "SORT_BY";
					error.DIMENSIONS[masterData.COLUMNS[i].SORT_BY].push(dimension);
				}
			}
		}
		
		for(var i=0,l=masterData.HEADER.length; i<l; i++) {
			if(masterData.HEADER[i].EVALUATION_ID !== masterData.HEADER[i].REFERENCE_EVALUATION_ID) {
				this.diffHeaders.push(masterData.HEADER[i]);
			}
			else {
				if((masterData.HEADER[i].VISUALIZATION_TYPE != "NT") && (masterData.HEADER[i].VISUALIZATION_TYPE != "AT")) {
					if((masterData.HEADER[i].VISUALIZATION_TYPE === "CM")) {
						var measuresArr = undefined;
						try{
							measuresArr = JSON.parse(JSON.parse(masterData.HEADER[i].CONFIGURATION).MEASURES);
						}
						catch(e) {
							throw new Error("Failed to parse multiple measures of Comparison Chart Multiple Measures");
						}
						
						for(var j=0,m=measuresArr.length; i<m; i++) {
							if(measures[measuresArr[j]["name"]] != "M") {
								masterData.HEADER[i].entityType = "HEADERS";
								if(error == null) {
									error = {};
								}
								if(error.MEASURES == undefined) {
									error.MEASURES = {};
								}
								if(error.MEASURES[measuresArr[j]["name"]] == undefined) {
									error.MEASURES[measuresArr[j]["name"]] = [];	
								}
								error.MEASURES[measuresArr[j]["name"]].push(masterData.HEADER[i]);
								break;
							}
						}
					}
					else {
						if(dimensions[masterData.HEADER[i].DIMENSION] != "D") {
							masterData.HEADER[i].entityType = "HEADERS";
							if(error == null) {
								error = {};
							}
							if(error.DIMENSIONS == undefined) {
								error.DIMENSIONS = {};
							}
							if(error.DIMENSIONS[masterData.HEADER[i].DIMENSION] == undefined) {
								error.DIMENSIONS[masterData.HEADER[i].DIMENSION] = [];	
							}
							error.DIMENSIONS[masterData.HEADER[i].DIMENSION].push(masterData.HEADER[i]);
						}
					}
				}
			}
		}
		return error;
	},
	
	copyEvaluationToClipboard: function() {
		var that = this;
		var copyToClipboard = function() {
			that.copyClipboard = {};
			that.copyClipboard.MasterData = that.getView().getModel("SB_DDACONFIG").getData();
			that.copyClipboard.masterData = sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData;
			that.copyClipboard.evaluationData = that.EVALUATION.evaluationData;
			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("COPY_DDA_TO_CLIPBOARD", that.EVALUATION.evaluationData.TITLE || (that.EVALUATION.evaluationData.ID + "*")));
			that.oApplicationFacade.copyClipboard = that.copyClipboard;
			that.updateHeaderFooterOptions(false);
		}
		if(sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.HEADER && sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.HEADER.length) {
			var diffHeaders = [];
			for(var i=0,l=sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.HEADER.length; i<l; i++) {
				if(sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.HEADER[i].EVALUATION_ID != sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.HEADER[i].REFERENCE_EVALUATION_ID) {
					diffHeaders.push(sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.HEADER[i]);
				}
			}
			if(diffHeaders && diffHeaders.length) {
				that.warnDialog = that.warnDialog || new sap.m.Dialog({
					icon:"sap-icon://warning2",
					title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
					state:"Warning",
					type:"Message",
					content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("RELATED_KPIS_HEADER_TILES_EXIST_WARN")})],
					beginButton: new sap.m.Button({
						text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
						press: function(){
							that.warnDialog.close();
							copyToClipboard();
						}
					})//,
//					endButton: new sap.m.Button({
//						text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
//						press:function(){
//							that.warnDialog.close();
//						}
//					})   	                                           
				});
				that.warnDialog.open();
			}
			else {
				copyToClipboard();
			}
		}
		else {
			copyToClipboard();
		}
	},
	
	copyDDAConfiguration: function() {
		var that = this;
		if(this.copyClipboard && this.copyClipboard.evaluationData) {
			var payload = {sourceEvaluationId:this.copyClipboard.evaluationData.ID, targetEvaluationId: this.EVALUATION.evaluationData.ID};
			var callCopyDDA = function(){
				sap.suite.ui.smartbusiness.lib.Util.utils.create(sap.suite.ui.smartbusiness.lib.Util.utils.serviceUrl("COPY_DDA_CONFIGURATION_SERVICE_URI"),payload,null,function(data){
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DDA_COPY_SUCCESS"));
					that.getView().getModel().refresh();
					var evt = {
							getParameter: function(param) {
								var evtObj = {
										name:"detail",
										arguments:{contextPath: "EVALUATIONS_MODELER(ID='" + that.evaluationId + "',IS_ACTIVE=1)"}  
								};
								return evtObj[param];
							}	
					};
					that.onRoutePatternMatched(evt);
				},function(err){
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DDA_COPY_ERROR"), err.responseText);
					});
			};
			if(sap.suite.ui.smartbusiness && sap.suite.ui.smartbusiness.lib.DrilldownConfiguration && sap.suite.ui.smartbusiness.lib.DrilldownConfiguration && sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData && sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.MASTER && sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.MASTER.length) {
				this.warnOverwriteDialog = this.warnOverwriteDialog || new sap.m.Dialog({
				icon:"sap-icon://warning2",
				title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
				state:"Warning",
				type:"Message",
				content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("DDA_CONFIG_EXISTING_WARN")})],
				beginButton: new sap.m.Button({
					text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
					press: function(){
						that.warnOverwriteDialog.close();
						callCopyDDA();
					}
				}),
				endButton: new sap.m.Button({
					text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
					press:function(){
						that.warnOverwriteDialog.close();
					}
				})   	                                           
			});
			this.warnOverwriteDialog.open();
			}
			else {
				callCopyDDA();
			}
		}
	},
	
	checkForCopy: function() {
		if(sap.suite.ui.smartbusiness.lib.DrilldownConfiguration && sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData && sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.MASTER && sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.MasterData.MASTER.length) {
			this.setBtnEnabled("Copy",true);
		}
		else {
			this.setBtnEnabled("Copy",false);
		}
	},
	
	onAfterRendering: function() {
		//this.setBtnEnabled("Paste",false);
		this.checkForCopy();
//		try{
//            if(this.DDA_MODEL.getConfigurator().getAllViews().length==0){
//                $(".invisibleDiv").css("display","block");
//            }
//            else{
//                $(".invisibleDiv").css("display","none");
//            }
//        }
//        catch(e){
//            //DO nothing
//        }
	},
	
//	viz charts code :

	createVizChart: function(dimensions, measures) {
		var that = this;
		var vizChartContainer = this.getView().byId("vizChartContainer");
		vizChartContainer.removeAllContent();
		
		// get table view for the toolbar :
		var vTableFrame = this.getTableForViz(this.tableDimensions, this.tableMeasures);
		
		if((this.dda_config.chartConfig.type).toUpperCase() == "TABLE") {
			vizChartContainer.addContent(vTableFrame); 
			setTimeout(function(){
				vizChartContainer.rerender();	
			},0);			
			//return;
		} 
		else {
			var oViz = this.getVizTypeAndIcon();
			
			var vizChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
				icon: oViz.icon,
			});
			
			var oVizFrame = new sap.viz.ui5.controls.VizFrame({
				vizType : oViz.type,
				uiConfig : {
					applicationSet : 'fiori'
				},	
			});
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel : {
						visible: true,
						hideWhenOverlap: false
						//formatString: "#,##0.00"
					}
				},
				legend: {
			        title: {
			        	visible : false
			        	},
			        isScrollable: true
			    },
				title: {
		              visible: false,
		        }
			});		
	
			this.addFeedsToVizFrame(oVizFrame);		
			
			var vDataset = this.create_vizDataset(dimensions, measures);
			oVizFrame.setDataset(vDataset);
			oVizFrame.setModel(this.oChartDataModel);	
			
			var vizChartPopover = new sap.viz.ui5.controls.Popover();
			vizChartPopover.connect(oVizFrame.getVizUid());
			
			this.setAllVizFormatters();		
			
			this.applyColorToViz(oVizFrame);
	
			vizChartContainerContent.setContent(oVizFrame);
			
			vizChartContainer.addContent(vizChartContainerContent); 
			vizChartContainer.addContent(vTableFrame); 
		}
	},
	
	addFeedsToVizFrame: function(oVizFrame) {
		var that=this;
		var oChartType = (this.dda_config.chartConfig.type).toUpperCase();
		var oAxisType = (this.dda_config.chartConfig.axis).toUpperCase();
		var dimensionToBeStacked = this.getDimensionToBeStacked(this.chartDimensions);
		
		var dimensionLabels=[],measureLabels=[] ;
		for(var i=0;i<that.chartDimNames.length;i++) {
			dimensionLabels.push(that.column_labels_mapping[that.chartDimNames[i]] || that.chartDimNames[i]);
		}
		for(var i=0;i<that.chartMsrNames.length;i++) {
			measureLabels.push(that.column_labels_mapping[that.chartMsrNames[i]] || that.chartMsrNames[i]);
		}

		if(oChartType == "BUBBLE") {
			var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "primaryValues",
				type: "Measure",
				values: [measureLabels[0]]
			}), feedSecondaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "secondaryValues",
				type: "Measure",
				values: [measureLabels[1]]
			}), feedBubbleWidth = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "bubbleWidth",
				type: "Measure",
				values: [measureLabels[2]]
			}), feedRegionColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "regionColor",
				type: "Dimension",
				values: dimensionLabels
			});
			oVizFrame.addFeed(feedPrimaryValues);
			oVizFrame.addFeed(feedSecondaryValues);
			oVizFrame.addFeed(feedBubbleWidth);
			oVizFrame.addFeed(feedRegionColor);
		} else if(((oChartType == "BAR") || (oChartType == "COLUMN")) && (oAxisType == "DUAL")) {
			var dualMsr = this.getMeasuresByAxis(this.chartMeasures);
			var dualMsrAxis1 = [],dualMsrAxis2 = [] ;
			for(var i=0;i<dualMsr.axis1.nameArr.length;i++) {
				dualMsrAxis1.push(that.column_labels_mapping[dualMsr.axis1.nameArr[i]] || dualMsr.axis1.nameArr[i]);
			}
			for(var i=0;i<dualMsr.axis2.nameArr.length;i++) {
				dualMsrAxis2.push(that.column_labels_mapping[dualMsr.axis2.nameArr[i]] || dualMsr.axis2.nameArr[i]);
			}
			var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "primaryValues",
				type: "Measure",
				values: dualMsrAxis1
			});
			var feedSecValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "secondaryValues",
				type: "Measure",
				values: dualMsrAxis2
			});
			var feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "axisLabels",
				type: "Dimension",
				values: dimensionLabels
			});
			oVizFrame.addFeed(feedPrimaryValues);
			oVizFrame.addFeed(feedSecValues);
			oVizFrame.addFeed(feedAxisLabels);
		} else if(((oChartType == "BAR") || (oChartType == "COLUMN")) && (this.isStackDim) && (dimensionToBeStacked) && (dimensionLabels.length > 1)) {
			var index = dimensionLabels.indexOf(that.column_labels_mapping[(dimensionToBeStacked.name)]);
			if (index > -1) {
			    var oDimStackArray = dimensionLabels.splice(index, 1);
			}
			var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "primaryValues",
				type: "Measure",
				values: measureLabels
			}), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "axisLabels",
				type: "Dimension",
				values: dimensionLabels
			}); 
			oVizFrame.addFeed(feedPrimaryValues);
			oVizFrame.addFeed(feedAxisLabels);
			if(oDimStackArray && oDimStackArray.length) {
				var feedRegionColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid: "regionColor",
					type: "Dimension",
					values: oDimStackArray
				});			
				oVizFrame.addFeed(feedRegionColor);
			}
		} else {
			var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "primaryValues",
				type: "Measure",
				values: measureLabels
			});
			var feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "axisLabels",
				type: "Dimension",
				values: dimensionLabels
			});
			oVizFrame.addFeed(feedPrimaryValues);
			oVizFrame.addFeed(feedAxisLabels);
		}		
	},

	create_vizDataset: function(dimensions,measures){
		var that = this;
		var chtype = this.dda_config.chartConfig.type || "BAR";
		var axisType = this.dda_config.chartConfig.axis || "SINGLE";
		var valueType = this.dda_config.chartConfig.value || "ABSOLUTE";
		var stacking = this.isStackMsr;
		var dimensionToBeStacked = this.getDimensionToBeStacked(dimensions);

		var dataset = new sap.viz.ui5.data.FlattenedDataset({
			data: {
				path: "/businessData"
			}
		});
		// setting dimensions :
		for (var i = 0; i < dimensions.length; i++) {
			var val = ((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME")? this.dimension_text_property_mapping[dimensions[i].name] : dimensions[i].name;
			//var oAxis = 1;			
			var dimchart = new sap.viz.ui5.data.DimensionDefinition({
				//axis: oAxis,
				value: "{" + val + "}",
				name: this.column_labels_mapping[dimensions[i].name] || dimensions[i].name
			});
			dataset.addDimension(dimchart);
		}
		// setting measures :
		if ((chtype == "LINE") || (chtype == "COMBINATION") || (chtype == "BUBBLE") || (chtype == "BAR") || (chtype == "COLUMN")) {   

			for (var i = 0; i < measures.length; i++) {
				var val = measures[i].name;
				var msrchart = new sap.viz.ui5.data.MeasureDefinition({
					name: this.column_labels_mapping[val] || val,
					value: "{" + val + "}"
				});
				dataset.addMeasure(msrchart);
			}

		}
		
		return dataset;

	},
	
	applyColorToViz: function(oVizFrame) {
		var that=this;
		var chType = (this.dda_config.chartConfig.type).toUpperCase();
		// implement custom coloring ..............................
		if((chType == "BAR") || (chType == "COLUMN") || (chType == "COMBINATION") || (chType == "LINE")) {
			if((this.dda_config.chartConfig.colorScheme).toUpperCase() === "AUTO_SEMANTIC") {
				var thresholdmsr = this.dda_config.chartConfig.thresholdMeasure || "";                 // || (this.chartMeasures)[0].name ;         // TODO                                       
				var colorArray = [];
				var tmsr = -1;
				for(var i=0;i<this.chartMeasures.length;i++) {
					colorArray.push({color: "sapUiChartPaletteSemanticGoodLight1"}) ;
					if(this.chartMeasures[i].name === thresholdmsr)
						tmsr = i ;
				}
				if(tmsr >= 0)
					colorArray[tmsr].color = "sapUiChartPaletteSemanticNeutral";
				this.applyVizCustomColoring(oVizFrame, this.dda_config.chartConfig.colorScheme, colorArray, thresholdmsr, this.DDA_MODEL.EVALUATION_DATA.GOAL_TYPE) ;
			} else if(((this.dda_config.chartConfig.colorScheme).toUpperCase() === "MANUAL_SEMANTIC") || ((this.dda_config.chartConfig.colorScheme).toUpperCase() === "MANUAL_NON_SEMANTIC")) {
				this.setVizCustomColors(oVizFrame, this.chartMeasures, this.dda_config.chartConfig.colorScheme) ;
			}
		}	
	},
	
	applyVizCustomColoring: function(oChart, colorScheme, arr, thresholdMeasure, improvementDirection) {                       // pass chart reference , type of coloring , measures obj , threshold measure (if applicable) and improvementDirection(either 0, 1 or 2)
		var that = this;
		var oVizProperties = oChart.getVizProperties();
		
		if((colorScheme).toUpperCase() === "AUTO_SEMANTIC") {                                                       
			if(((improvementDirection == "MA") || (improvementDirection == "MI")) && thresholdMeasure) {                                                                
				that.setVizCustomColors(oChart,arr,colorScheme) ;
				oVizProperties.plotArea.dataPointStyle = {
					    rules:
							  [
								{
									callback: function (oContext) {
										var data = oChart.getModel().getData().businessData;
										var bindingContext = oContext._context_row_number;
										var bindingData = data[bindingContext];
										var referenceMeasureValue = bindingData[thresholdMeasure];
										if(referenceMeasureValue!=null && typeof referenceMeasureValue!='undefined') {
											if(oContext[oContext.measureNames] > referenceMeasureValue) {
												if(improvementDirection == "MA")
													return true;
											} else if(oContext[oContext.measureNames] < referenceMeasureValue) {
												if(improvementDirection == "MI")
													return true;
											}
										} else
											return false;	
									},
									properties: {
									   color:"sapUiChartPaletteSemanticGoodLight1" 
									},
									displayName: (that._oTextsModel.getResourceBundle().getText("GOOD"))
								},{
									callback: function (oContext) {
										var data = oChart.getModel().getData().businessData;
										var bindingContext = oContext._context_row_number;
										var bindingData = data[bindingContext];
										var referenceMeasureValue = bindingData[thresholdMeasure];
										if(referenceMeasureValue!=null && typeof referenceMeasureValue!='undefined') {
											if(oContext[oContext.measureNames] > referenceMeasureValue) {
												if(improvementDirection == "MI")
													return true;
											} else if(oContext[oContext.measureNames] < referenceMeasureValue) {
												if(improvementDirection == "MA")
													return true;
											}
										} else
											return false;	
									},
									properties : {
										color : "sapUiChartPaletteSemanticBadLight1"
									},
									displayName: (that._oTextsModel.getResourceBundle().getText("BAD"))
								},{
									callback: function (oContext) {
										var data = oChart.getModel().getData().businessData;
										var bindingContext = oContext._context_row_number;
										var bindingData = data[bindingContext];
										var referenceMeasureValue = bindingData[thresholdMeasure];
										if(referenceMeasureValue==null || typeof referenceMeasureValue=='undefined') {
											jQuery.sap.log.error("Threshold Measure:'"+thresholdMeasure+"' not in Dataset. Error Applying Semantic Color");
											return true;
										} 	
									},
									properties : {
										color : "sapUiChartPaletteSemanticNeutralLight1"
									},
									displayName: (that._oTextsModel.getResourceBundle().getText("NEUTRAL"))
							}],
						 others : {
						  properties: {
							 color: 'sapUiChartPaletteSemanticNeutral'
						  },
						  displayName: (that._oTextsModel.getResourceBundle().getText("THRESHOLD_REFERENCE"))
						 }
					 }
				oChart.setVizProperties(oVizProperties);
			} else {
				jQuery.sap.log.error("Threshold Measure not available or Goal type is RA . Error Applying Semantic Color");
			}
		} else if(((colorScheme).toUpperCase() === "MANUAL_SEMANTIC") || ((colorScheme).toUpperCase() === "MANUAL_NON_SEMANTIC")) {                                           
			that.setVizCustomColors(oChart,arr,colorScheme) ;
		}

	},

	setVizCustomColors: function(vFrame,msrObj,colorScheme){                           // pass chart reference and msr obj.
		var that = this;
		var oChartType = (this.dda_config.chartConfig.type).toUpperCase();
		var oAxisType = (this.dda_config.chartConfig.axis).toUpperCase();
//		var colorMapper = this.getCAtoVizColorMapping();
		
		var dset = vFrame.getDataset() ;
		var msr = dset.getMeasures() ;

		var defaultColor = "";
		if((colorScheme).toUpperCase() === "AUTO_SEMANTIC" || (colorScheme).toUpperCase() === "MANUAL_SEMANTIC")
			defaultColor = "sapUiChartPaletteSemanticNeutral";

		var oVizProperties = vFrame.getVizProperties();
		
		if(((oChartType == "BAR") || (oChartType == "COLUMN")) && (oAxisType == "DUAL")) {
			oVizProperties.plotArea.primaryValuesColorPalette = [];
			oVizProperties.plotArea.secondaryValuesColorPalette = [];
			var dualMsr = this.getMeasuresByAxis(this.chartMeasures);
			for(var i=0;i<dualMsr.axis1.objArr.length;i++) {
				(oVizProperties.plotArea.primaryValuesColorPalette)[i] = (that.convertCAtoVizColorCode((dualMsr.axis1.objArr)[i].color)) || (defaultColor) || ("sapUiChartPaletteQualitativeHue"+((i % 11)+1));
			}
			for(var i=0;i<dualMsr.axis2.objArr.length;i++) {
				(oVizProperties.plotArea.secondaryValuesColorPalette)[i] = (that.convertCAtoVizColorCode((dualMsr.axis2.objArr)[i].color)) || (defaultColor) || ("sapUiChartPaletteQualitativeHue"+(((i+(dualMsr.axis1.objArr.length)) % 11)+1));
			}
		} else {
			oVizProperties.plotArea.colorPalette = [];
			for(var i=0;i<msr.length;i++)
			{
				(oVizProperties.plotArea.colorPalette)[i] = (that.convertCAtoVizColorCode(msrObj[i].color)) || (defaultColor) || ("sapUiChartPaletteQualitativeHue"+((i % 11)+1));
			}        
		}

		vFrame.setVizProperties(oVizProperties);

	},

	setAllVizFormatters: function() {
		//sap.viz.api.env.Format.useDefaultFormatter(false);
		var chartType = this.dda_config.chartConfig.type ;
		var axisType = this.dda_config.chartConfig.axis ;
		var valueType = this.dda_config.chartConfig.value ;		

		var customerFormatter = {
				locale: function(){},
				format: function(value, pattern) {
					//var locale=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
					var coreFormatter = sap.ui.core.format.NumberFormat.getInstance();
					return coreFormatter.format(value);
				}
		};
		jQuery.sap.require("sap.viz.ui5.api.env.Format");
//				var coreFormatter = sap.ui.core.format.NumberFormat.getInstance();
		sap.viz.ui5.api.env.Format.numericFormatter(customerFormatter);

	},
	
	getVizTypeAndIcon: function() {
		var vType = "bar";
		var vIcon = "sap-icon://bar-chart";
		var oType = this.dda_config.chartConfig.type || "BAR";	
		var axisType = this.dda_config.chartConfig.axis ;
		var valueType = this.dda_config.chartConfig.value ;
		var stacking = (this.isStackMsr || (this.isStackDim && (this.chartDimensions.length > 1))) ? true : false ;
		if(oType.toUpperCase() == "BAR") {
			vType = "bar";
			vIcon = "sap-icon://horizontal-bar-chart";
			if(axisType === "SINGLE") {
				if(valueType === "ABSOLUTE") {
					if(stacking) {
						vType = "stacked_bar";
						vIcon = "sap-icon://horizontal-stacked-chart";
					} else {
						vType = "bar";
					}
				} else if(valueType === "PERCENTAGE") {
					vType = "100_stacked_bar";
					vIcon = "sap-icon://full-stacked-chart";
				}
			} else if(axisType === "DUAL") {
				if(valueType === "ABSOLUTE") {
					vType = "dual_stacked_bar";
					vIcon = "sap-icon://horizontal-bar-chart";
				} else if(valueType === "PERCENTAGE") {
					vType = "100_dual_stacked_bar";
					vIcon = "sap-icon://full-stacked-chart";
				}
			} 
		} else if(oType.toUpperCase() == "COLUMN") {
			vType = "column";
			vIcon = "sap-icon://vertical-bar-chart";
			if(axisType === "SINGLE") {
				if(valueType === "ABSOLUTE") {
					if(stacking) {
						vType = "stacked_column";
						vIcon = "sap-icon://vertical-stacked-chart";
					} else {
						vType = "column";
					}
				} else if(valueType === "PERCENTAGE") {
					vType = "100_stacked_column";
					vIcon = "sap-icon://full-stacked-column-chart";
				}
			} else if(axisType === "DUAL") {
				if(valueType === "ABSOLUTE") {
					vType = "dual_stacked_column";
					vIcon = "sap-icon://vertical-bar-chart";
				} else if(valueType === "PERCENTAGE") {
					vType = "100_dual_stacked_column";
					vIcon = "sap-icon://full-stacked-column-chart";
				}
			} 
		} else if(oType.toUpperCase() == "LINE") {
			vType = "line";
			vIcon = "sap-icon://line-chart";
		} else if(oType.toUpperCase() == "COMBINATION") {
			vType = "combination";
			vIcon = "sap-icon://business-objects-experience";
		} else if(oType.toUpperCase() == "BUBBLE") {
			vType = "bubble";
			vIcon = "sap-icon://bubble-chart";
		}

		return {type:vType,icon:vIcon};
	},

	getTableForViz: function(dimensions,measures) {

		var vizChartContainerTable = new sap.suite.ui.commons.ChartContainerContent({
			icon: 'sap-icon://table-chart',
		});

		var vTable = new sap.m.Table({
			showUnread: true,
		});

		for(var i=0;i<dimensions.length;i++) {
			var val = dimensions[i].name;
			var Label = new sap.m.Label({
				text: this.column_labels_mapping[val] || val
			});
			var columns = new sap.m.Column({
				hAlign: "Begin",                                      
				header: Label,
				minScreenWidth: "Tablet",
				demandPopin: true,
			});
			vTable.addColumn(columns);
		}

		for (var i=0;i<measures.length;i++) {
			var val = measures[i].name;
			var Label = new sap.m.Label({
				text: this.column_labels_mapping[val] || val
			});
			var columns = new sap.m.Column({
				hAlign: "End",
				header: Label,
				minScreenWidth: "Tablet",
				demandPopin: true,
			});
			vTable.addColumn(columns);
		}

		var template = new sap.m.ColumnListItem({
			//type : "Navigation",
			unread : false,              
		});

		for(var i=0;i<dimensions.length;i++){
			var val = ((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME")? this.dimension_text_property_mapping[dimensions[i].name] : dimensions[i].name;
			var ocell = new sap.m.Label({
				text : "{"+val+"}"
			});
			template.addCell(ocell);

		}
		var thresholdmsr = (this._oModel)["THRESHOLD_MEASURE"];

		var is_percent_scale = false;
		var chartType = this.dda_config.chartConfig.type ;
		var valueType = this.dda_config.chartConfig.value ;
		var axisType = this.dda_config.chartConfig.axis ;
		if(chartType.toUpperCase() === "TABLE")
			var oMsrs = this.tableMsrNames ;
		else
			var oMsrs = this.chartMsrNames ;
		if(((this.dda_config.chartConfig.mode).toUpperCase() === "RUNTIME") && (this.EVALUATION.getScaling() == -2) && this.getIsPercentScaled(oMsrs) && !(((chartType == 'BAR') || (chartType == 'COLUMN')) && (valueType == 'PERCENTAGE'))) {
			is_percent_scale = true;
		}
		var axisScale = [] ;
		if(is_percent_scale) {
			if((axisType == 'DUAL') && (valueType == "ABSOLUTE") && (chartType == 'BAR' || chartType == 'COLUMN')) {
				var msrsObj = this.getMeasuresByAxis(this.chartMeasures);	        	
				axisScale.push(this.getIsPercentScaled(msrsObj.axis1.nameArr));
				axisScale.push(this.getIsPercentScaled(msrsObj.axis2.nameArr));
			}
		}

		for(var i=0;i<measures.length;i++){
			var val = measures[i].name;
			if((this._oModel)["COLOR_SCHEME"] == "AUTO_SEMANTIC")
				var ocell = this._getTableCell(val, thresholdmsr, is_percent_scale, axisScale);
			else
				var ocell = this._getTableCell(val, val, is_percent_scale, axisScale);
			template.addCell(ocell);
		}

		vTable.setModel(this.oChartDataModel);
		vTable.bindAggregation("items", "/businessData", template);

		vizChartContainerTable.setContent(vTable);
		return vizChartContainerTable;
	},   

/*	getCAtoVizColorMapping: function() {
		var colorMapper = {
				"sapUiChart1" : "sapUiChartPaletteQualitativeHue1",
				"sapUiChart2" : "sapUiChartPaletteQualitativeHue2",
				"sapUiChart3" : "sapUiChartPaletteQualitativeHue3",
				"sapUiChart4" : "sapUiChartPaletteQualitativeHue4",
				"sapUiChart5" : "sapUiChartPaletteQualitativeHue5",
				"sapUiChart6" : "sapUiChartPaletteQualitativeHue6",
				"sapUiChart7" : "sapUiChartPaletteQualitativeHue7",
				"sapUiChart8" : "sapUiChartPaletteQualitativeHue8",
				"sapUiChart9" : "sapUiChartPaletteQualitativeHue9",
				"sapUiChart10" : "sapUiChartPaletteQualitativeHue10",
				"sapUiChart11" : "sapUiChartPaletteQualitativeHue11",
				"sapCaUiChartSemanticColor-Bad" : "sapUiChartPaletteSemanticBad",
				"sapCaUiChartSemanticColor-Bad-Dark" : "sapUiChartPaletteSemanticBadDark1",
				"sapCaUiChartSemanticColor-Bad-Light" : "sapUiChartPaletteSemanticBadLight1",
				"sapCaUiChartSemanticColor-Critical" : "sapUiChartPaletteSemanticCritical",
				"sapCaUiChartSemanticColor-Critical-Dark" : "sapUiChartPaletteSemanticCriticalDark1",
				"sapCaUiChartSemanticColor-Critical-Light" : "sapUiChartPaletteSemanticCriticalLight1",
				"sapCaUiChartSemanticColor-Good" : "sapUiChartPaletteSemanticGood",
				"sapCaUiChartSemanticColor-Good-Dark" : "sapUiChartPaletteSemanticGoodDark1",
				"sapCaUiChartSemanticColor-Good-Light" : "sapUiChartPaletteSemanticGoodLight1",
				"sapCaUiChartSemanticColor-Neutral" : "sapUiChartPaletteSemanticNeutral",
				"sapCaUiChartSemanticColor-Neutral-Dark" : "sapUiChartPaletteSemanticNeutralDark1",
				"sapCaUiChartSemanticColor-Neutral-Light" : "sapUiChartPaletteSemanticNeutralLight1",
		};
		
		return colorMapper;
	},
*/		
	convertCAtoVizColorCode: function(oColor) {
		var vColor = oColor;
		if(oColor) {
			var splitColorArray = oColor.match(/[a-zA-Z]+|[0-9]+/g);
			if(splitColorArray[0] === "sapUiChart") {
				vColor = "sapUiChartPaletteQualitativeHue"+splitColorArray[1];
			} else if(splitColorArray[0] === "sapCaUiChartSemanticColor") {
				if(splitColorArray.length === 2) {
					vColor = "sapUiChartPaletteSemantic"+splitColorArray[1];
				} else if(splitColorArray.length === 3) {
					vColor = "sapUiChartPaletteSemantic"+splitColorArray[1]+splitColorArray[2]+"1";
				}
			}
		}
		return vColor;
	},
			
	onVizViewChange: function(oEvent) {
		var sKey = oEvent.getParameters().selectedItem.getProperty("key");
		this.viewId = sKey;
		this.DDA_MODEL.setViewId(this.viewId);
		this._oModel = this.DDA_MODEL.getModelDataForDDAConfiguration();
		this.bindUiToModel();
		this.refreshChart();
		oEvent.getSource().setTooltip(oEvent.getParameters().selectedItem.getText());
	},
		

});
