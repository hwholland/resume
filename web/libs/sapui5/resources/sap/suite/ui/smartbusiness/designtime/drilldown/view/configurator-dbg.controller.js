/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Bullet");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Comparison");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.MeasureComparison");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.AreaChart");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Numeric");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.HarveyBall");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.vbm.AnalyticMap");
jQuery.sap.require("sap.ui.core.format.NumberFormat");

sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.drilldown.view.configurator", {
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
		//this.errorMessages = [];
		this.errorState = false;
		
		this.DDA_MODEL = null;
		this.evaluationId = null;
		this.viewId = null;
		this.ddaFilter=this.byId("ddaFilter");
		
		try{
            if(sap.ui.core.Fragment.byId("addTileDialog","addTileDialog")){
            	sap.ui.core.Fragment.byId("addTileDialog","addTileDialog").destroy();
             }
            if(sap.ui.core.Fragment.byId("addRelatedTilesDialog","evaluationTilesList")){
            	sap.ui.core.Fragment.byId("addRelatedTilesDialog","evaluationTilesList").getParent().destroy();
            }
            if(sap.ui.core.Fragment.byId("configureTileDialog","multipleMeasureDialog")){
            	sap.ui.core.Fragment.byId("configureTileDialog","multipleMeasureDialog").destroy();
             }
			
		}catch(e){
			
		}
		this._addTileDialog=sap.ui.xmlfragment("addTileDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.addTileDialog", this);
		this._addRelatedTilesDialog=sap.ui.xmlfragment("addRelatedTilesDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.addRelatedTilesDialog", this);
		this._configureTileDialog=sap.ui.xmlfragment("configureTileDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.multipleMeasureDialog", this);
		this.initializeTileHeader();
		this.initializeAddTileDialog();
		this.initialiazeValueHelpDialog();
		this.defineHeaderFooterOptions();
		this.oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
		//flag to show if views ever re-ordered
		this.viewsReordered = false;
		this.busyIndicator = new sap.m.BusyDialog();
		var header=this.byId("headerRibbon");
		this.HeaderRibbonModel = new sap.ui.model.json.JSONModel();
		header.setModel(this.HeaderRibbonModel);
		//warning when leaving the page
		var self = this;
		if(this.oApplicationFacade.navigatingWithinDrilldown) {
			this.navigatingWithinDrilldown = true;
			this.oApplicationFacade.navigatingWithinDrilldown = undefined;
		} 
		else {
			this.navigatingWithinDrilldown = false;
		}
		/* //warning on closing tab removed, since changes to window can have global side effects.
		 window.onbeforeunload = function(){return self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")}; 
		*/		
		
	},
	
	leftArrowAction: function(){
		var that = this;
		var i, tempObj;
		var headerArrayModel = that.getView().getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE;
		var visibleArrayHeader = that.byId("tileContainer").getAggregation("scrollContainer").getAggregation("content");
		try{
			var selectedTile=this._getSelectedTile().tile.getBindingContext("SB_DDACONFIG").getObject();
		}catch(e){selectedTile=null;}
		for(i=0;i<headerArrayModel.length;i++){
			if(headerArrayModel[i] == selectedTile){
				tempObj = headerArrayModel.splice(i,1);
				headerArrayModel.splice(i-1,0,tempObj[0]);
				break;
			}
		}
		that.getView().getModel("SB_DDACONFIG").setProperty("/HEADERS_VISIBLE",headerArrayModel);
		that.getView().getModel("SB_DDACONFIG").updateBindings();
		that._setSelectedTile(that._getSelectedTile().index-1);
	},
	rightArrowAction: function(){
		var that = this;
		var i, tempObj;
		var headerArrayModel = that.getView().getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE;
		var visibleArrayHeader = that.byId("tileContainer").getAggregation("scrollContainer").getAggregation("content");
		try{
			var selectedTile=this._getSelectedTile().tile.getBindingContext("SB_DDACONFIG").getObject();
		}catch(e){selectedTile=null;}
		for(i=0;i<headerArrayModel.length;i++){
			if(headerArrayModel[i] == selectedTile){
				tempObj = headerArrayModel.splice(i,1);
				headerArrayModel.splice(i+1,0,tempObj[0]);
				break;
			}
		}
		that.getView().getModel("SB_DDACONFIG").setProperty("/HEADERS_VISIBLE",headerArrayModel);
		that.getView().getModel("SB_DDACONFIG").updateBindings();
		that._setSelectedTile(that._getSelectedTile().index+1);
	},
	selectedTilesFormatter:function(curId,allHeaders){
		var str=""
		var tileTypeText={
				NT : "Numeric",
		        CT : "Comparison",
		        AT : "Bullet",
		        TT : "Trend"
		};
		allHeaders.forEach(function(s){
			if(s.REFERENCE_EVALUATION_ID==curId && s.visible)
			str+=tileTypeText[s.VISUALIZATION_TYPE]+", ";
		});
		return str?"Selected: "+str.replace(/, $/g,""):"";
	},
	_cloneObj:function(ele){
		var tmp;
		if(ele instanceof Array){
			tmp=[];
			for(var i=0;i<ele.length;i++){
				tmp[i]=this._cloneObj(ele[i]);
			}
		}else if(ele instanceof Object){
			tmp={};
			for(var each in ele){
				if(ele.hasOwnProperty(each)){
					tmp[each]=this._cloneObj(ele[each]);	
				}
			}
		}else{
			tmp=ele;
		}
		return tmp;
	},
	_cache:{},
	setApplicationCache:function(key,val){
		this._cache[key]=val;
	},
	getApplicationCache:function(key){
		return this._cache[key];
	},
	takeConfigSnapShot:function(){
		this._configSnapShot=this._cloneObj(this.getView().getModel("SB_DDACONFIG").getData());
	},
	restoreFromConfigSnapShot:function(){
		this.getView().getModel("SB_DDACONFIG").setData(this._configSnapShot);
	},
	bindUiToModel:function(){
		this.DDA_MODEL.bindModel(this.getView(),"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._addTileDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._addRelatedTilesDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._configureTileDialog,"SB_DDACONFIG");
	},
	onRoutePatternMatched:function(oEvent){
		var that=this;
		if (oEvent.getParameter("name") === "configurator") {
			
			try {
				that.errorState = undefined; 
				that.errorMsg = undefined;
				var evaluationId = oEvent.getParameter("arguments")["evaluationId"];
				var viewId = oEvent.getParameter("arguments")["viewId"];
				if(that.oApplicationFacade.__newViewAdded && that.oApplicationFacade.createdViewId) {
					viewId = that.oApplicationFacade.createdViewId;
					that.oApplicationFacade.createdViewId = null;
					that.oApplicationFacade.__newViewAdded = false;
					window.location.replace(window.location.hash.substring(0,window.location.hash.lastIndexOf("/")) + "/" + viewId);
				}
				that.oApplicationFacade.createdViewId = null;
				that.oApplicationFacade.__newViewAdded = false;
				that._setSelectedTile(-1);
				if(evaluationId !== this.evaluationId || that.viewsReordered) {
					that.viewsReordered=false;
					this.evaluationId = evaluationId;
					this.DDA_MODEL =  sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.getInstance(this.evaluationId, true,this.getView().getModel("i18n"));
					this.EVALUATION = sap.suite.ui.smartbusiness.lib.Util.kpi.parseEvaluation(this.DDA_MODEL.EVALUATION_DATA);
					var newViewId=this.DDA_MODEL.NEW_VIEWID;
					/*
					 * when nav'ing from configureNewView, it could
					 * request a context referenced by a viewId.
					 */
					if(!viewId) {
						viewId = this.DDA_MODEL.getConfigurator().getDefaultViewId();
					}
					this._oTextsModel = this.getView().getModel("i18n");
					this._addTileDialog.setModel(this._oTextsModel,"i18n");
					this._addRelatedTilesDialog.setModel(this._oTextsModel,"i18n");
					this._configureTileDialog.setModel(this._oTextsModel,"i18n");
//					var url=this.getView().getModel("SB_DDACONFIG").getData().QUERY_SERVICE_URI;
//					var entitySet=this.getView().getModel("SB_DDACONFIG").getData().QUERY_ENTITY_SET;
//					var mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(url,entitySet);
//					this.COLUMN_LABEL_MAPPING = this.mProperties.getLabelMappingObject();
					if(viewId != null) {
						this.viewId = viewId;
						this.DDA_MODEL.setViewId(viewId);
					} else {
						this.viewId = newViewId;
					}
					this.bindUiToModel();
					this.initCopy = this._cloneObj(this.getView().getModel("SB_DDACONFIG").getData());
					this.ddaFilter.setEvaluationData(this.EVALUATION);
					this.ddaFilter.setEvaluationId(this.evaluationId);
					var filterDimensions=[];
					this.getView().getModel("SB_DDACONFIG").getProperty("/FILTERS").forEach(function(s){
						filterDimensions.push(s.name); 
					})
					this.ddaFilter.setDimensions(filterDimensions);
					try{
						this.ddaFilter.rerender();					
					}catch(e){};
				}else{
					if(this.viewId==newViewId && this.getView().getModel("SB_DDACONFIG").getProperty("/ID")!=newViewId ){
						
					}
				}
				
				//store init count of headers and filters
				this.INIT_COUNT_HEADERS = function(){
					h = that.getView().getModel("SB_DDACONFIG").getData()["HEADERS"];
					var count = 0;
					for(var i = 0; i < h.length; ++i) {
						if (h[i]["visible"] == true)
							++count;
					}
					return count;
				}();
				this.INIT_COUNT_FILTERS = this.getView().getModel("SB_DDACONFIG").getData()["FILTERS"].length;
				if(!this.init_filters) {
					this.init_filters = [];
					this.getView().getModel("SB_DDACONFIG").getData()["FILTERS"].forEach(function(x){that.init_filters.push(x.name)});
				}				
				
				var otoolBarDimSelect = this.getView().byId("vizViewSelector");
				otoolBarDimSelect.bindProperty("selectedKey","SB_DDACONFIG>/ID");
				
				this.getView().byId("choroplethViewSelect").bindProperty("selectedKey","SB_DDACONFIG>/ID");				
				this._oModel = this.getView().getModel("SB_DDACONFIG").getData();
				this.refreshChart();

//				this.fetchAndRenderHeaderRibbon();            // commenting this to show dummy value instead of actual kpi value . 
	            this.displayAggregate(); 

			}
			catch(e) {
				that.errorState = true;
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
	/**
	 * Change the Order of View
	 */
	changeViewOrder : function() {
	    var that = this;
	    new sap.suite.ui.smartbusiness.lib.ListPersona({
	        view : this.getView(),
	        context : '/ALL_VIEWS',
	        listItemContext : 'TITLE',
	        namedModel : 'SB_DDACONFIG',
	        callback : function() {
	            var configId = that.DDA_MODEL.selectedView.getId();
	            that.byId('vizViewSelector').setSelectedItem(that.byId('vizViewSelector').getItemByKey(configId));
	            
            	that.byId('choroplethViewSelect').setSelectedItem(that.byId('choroplethViewSelect').getItemByKey(configId));
	            that.viewsReordered = true;
	        }
	    }).start();
	},
	SaveConfig: function(inDialog) {
		var self = this;
		this.warn_header = false;
		var modelData=this.getView().getModel("SB_DDACONFIG").getData();
		modelData.CURRENT_FILTERS=this.getView().byId("ddaFilter").getActiveDimensions();
		var saveService=sap.suite.ui.smartbusiness.Adapter.getService("DrilldownServices");
		if(modelData.ALL_VIEWS.length > 0 ) {
			this.busyIndicator.open() && this.getView().setBusy(true);
			saveService.saveEvalConfiguration(this.evaluationId,modelData,"update",function(){
				jQuery.sap.log.info("all calls success");
				self.busyIndicator.close() && self.getView().setBusy(false);
				sap.m.MessageToast.show(self._oTextsModel.getResourceBundle().getText("EVAL_CONFIG_SAVE_SUCCESS"));
				if(inDialog==false){
                    //self.oRouter.navTo("detail",{"contextPath" : "EVALUATIONS_MODELER(ID='" + self.evaluationId + "',IS_ACTIVE=1)"});
                    sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"detail", context: "EVALUATIONS_MODELER(ID='" + self.evaluationId + "',IS_ACTIVE=1)"});
                }
				//this tells the detail route that model has to be refreshed due to eval level save
				self.oApplicationFacade.__refreshModel = 1;
				try {
					if(sap.suite && sap.suite.ui && sap.suite.ui.smartbusiness && sap.suite.ui.smartbusiness.drilldown.lib.Configuration && sap.suite.ui.smartbusiness.drilldown.lib.Configuration.resetDrilldownConfiguration) {
						sap.suite.ui.smartbusiness.drilldown.lib.Configuration.resetDrilldownConfiguration(self.evaluationId);
					}
				} catch(e) {}
			},function(e){
				jQuery.sap.log.error(e + " failed");
				self.busyIndicator.close() && self.getView().setBusy(false);
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(self._oTextsModel.getResourceBundle().getText("SAVE_ERROR"));
				});
		}
		else {
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(self._oTextsModel.getResourceBundle().getText("SAVE_ERROR_NO_VIEW_CONFIGURED"));
			jQuery.sap.log.error("No Views Configured. Please configure Views before adding filters/headers");
			}
	},
	
	defineHeaderFooterOptions:function(){
		var that = this;
		this.oHeaderFooterOptions = { 
				onBack: function () {
					if(that.isModelChanged()){
						var self = that;
						new sap.m.Dialog({
			              icon:"sap-icon://warning2",
			              title:self._oTextsModel.getResourceBundle().getText("WARNING"),
			              state:"Error",
			              type:"Message",
			              content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")})],
			              beginButton: new sap.m.Button({
			                   text:self._oTextsModel.getResourceBundle().getText("OK"),
			                   press: function(){
			                	    var contextPath = "EVALUATIONS_MODELER(ID='" + self.evaluationId + "',IS_ACTIVE=1)";
			                	   	self.evaluationId = null;
			                	   	this.getParent().close();
			   						//window.history.back();
			                	   	sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"detail", context: contextPath});
			                   }
			              }),
			              endButton: new sap.m.Button({
			                   text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
			                   press:function(){this.getParent().close();}
			              })                                           
						}).open();
					}
						else{
							 var contextPath = "EVALUATIONS_MODELER(ID='" + that.evaluationId + "',IS_ACTIVE=1)";
							that.evaluationId = null;
	                	   	//window.history.back();
	                	   	sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"detail", context: contextPath});
						}
				},
				sI18NDetailTitle:"SB_GENERIC_DRILLDOWN",
		        bSuppressBookmarkButton : true,
				buttonList : [{
                    sI18nBtnTxt : "Save Configuration",
                    onBtnPressed : function(evt) {
                    	jQuery.sap.log.info("Save button pressed");
                    	if(that.errorState) {
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), that.errorMsg);
							return;
						}
                    	that.SaveConfig(false);
                    },
               },
//               {
//                   sId : "SaveAndActivate", // optional
//                   sI18nBtnTxt : "Save and Activate",
//                   onBtnPressed : function(evt) {
//                	   jQuery.sap.log.info("Save and Activate button pressed");  
//                	   that.SaveConfig();
//                   }
//              },
              {
                  sId : "Delete", // optional
                  sI18nBtnTxt : "Delete",
                  onBtnPressed : function(evt) {
                	  if(that.errorState) {
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), that.errorMsg);
							return;
						}
                 	  new sap.m.Dialog({
                 		 icon:"sap-icon://warning2",
                 		 title:that._oTextsModel.getResourceBundle().getText("WARNING"),
                 		 state:"Error",
                 		 type:"Message",
                 		 content:[new sap.m.Text({text:that._oTextsModel.getResourceBundle().getText("DELETE_ALL_CONFIGURATIONS")})],
                 		 beginButton: new sap.m.Button({
                 			 text:that._oTextsModel.getResourceBundle().getText("OK"),
                 			 press: function(){
                 				//go into busy mode.
                 				this.getParent().close();
                 				that.busyIndicator.open() && that.getView().setBusy(true);
                 				that.deleteMaster();
                 			 }
                 		 }),
                 		 endButton: new sap.m.Button({
                 			 text:that._oTextsModel.getResourceBundle().getText("CANCEL"),
                 			 press:function(){this.getParent().close();}
                 		 })
                 	 }).open();
                  }
             },
             {
                 sId : "cancel", // optional
                 sI18nBtnTxt : "Cancel",
                 onBtnPressed : function(evt) {
                	 var self = that;
                	 if(that.isModelChanged()){
                	 new sap.m.Dialog({
                		 icon:"sap-icon://warning2",
                		 title:self._oTextsModel.getResourceBundle().getText("WARNING"),
                		 state:"Error",
                		 type:"Message",
                		 content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")})],
                		 beginButton: new sap.m.Button({
                			 text:self._oTextsModel.getResourceBundle().getText("OK"),
                			 press: function(){
                				 var contextPath = "EVALUATIONS_MODELER(ID='" + self.evaluationId + "',IS_ACTIVE=1)";
                				 this.getParent().close();
                				 //self.oRouter.navTo("detail",{"contextPath" : "EVALUATIONS_DDA('" + self.evaluationId + "')"});
                				 //this tells the detail route that model has to be refreshed due to eval level save

                				 //self.oApplicationFacade.__refreshModel = 1;
                				 self.evaluationId = null;
                				 //window.history.back();
                				 sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"detail", context: contextPath});
                			 }
                		 }),
                		 endButton: new sap.m.Button({
                			 text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
                			 press:function(){this.getParent().close();}
                		 })                                           
                	 }).open();
                	 }
                	 else{
                		 var contextPath = "EVALUATIONS_MODELER(ID='" + self.evaluationId + "',IS_ACTIVE=1)";
                		 //this.getParent().close();
                		 self.evaluationId = null;
                		 //window.history.back();
                		 sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"detail", context: contextPath});
                	 }
                 }
            },
               
               ]
		};
	},
	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},
	onBeforeRendering : function() {
	},
	navigateToConfigureChart:function(){
		//var routeObject = {evaluationId: this.evaluationId, viewId: this.viewId+""};
		var contextPath = this.evaluationId + "/" + this.viewId;
		this.evaluationId=null;/*added by chan to invalidate 
		the drilldown confiuration when navigating to addnew view		
		*/
//		this.DDA_MODEL.setViewId(this.viewId);
//		this.getView().setModel(sap.ui.getCore().getModel("SB_DDACONFIG"),"SB_DDACONFIG");
//		this.getView().getModel("SB_DDACONFIG").refresh();
		if(this.navigatingWithinDrilldown) {
			this.oApplicationFacade.navigatingWithinDrilldown = true;
		}
		else {
			this.oApplicationFacade.navigatingWithinDrilldown = undefined;
		}
		sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"configureChart", context: contextPath});
		//this.oRouter.navTo('configureChart', routeObject);
	},
	onAddView: function() {
		var self = this;
		var current_filters = this.getView().byId("ddaFilter").getActiveDimensions();
		this.oApplicationFacade.configuratorViewId = this.viewId || this.DDA_MODEL.NEW_VIEWID;
		if(this.warn_header || String(this.init_filters) != String(current_filters)) {
			//navigation warning
	       	 new sap.m.Dialog({
	       		 icon:"sap-icon://warning2",
	       		 title:self._oTextsModel.getResourceBundle().getText("WARNING"),
	       		 state:"Error",
	       		 type:"Message",
	       		 content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE_TO_SAVE_CONFIGURATION")})],
	       		 beginButton: new sap.m.Button({
	       			 text:self._oTextsModel.getResourceBundle().getText("SAVE_AND_CONTINUE"),
	       			 press: function(){
	       				var inDialog = true;
	       				self.warn_header = false;
	       				self.SaveConfig(inDialog);
	       				self.viewId=self.DDA_MODEL.NEW_VIEWID;
	       				self.DDA_MODEL.setViewId(self.viewId);
	       				self.bindUiToModel();
	       				this.getParent().close();
	       				self.navigateToConfigureChart();
	       			 }
	       		 }),
	       		 endButton: new sap.m.Button({
	       			 text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
	       			 press:function(){this.getParent().close();}
	       		 })                                           
	       	 }).open();
		} else {
			/*
			 * __contextViewId is stored so that on pressing 'Cancel' from 
			 * configureNewView, the context is not lost.
			 * Overwritten on success of 'Save'.
			 */
			this.oApplicationFacade.__contextViewId = this.viewId;
			this.viewId=this.DDA_MODEL.NEW_VIEWID;
			this.DDA_MODEL.setViewId(this.viewId);
			this.bindUiToModel();
			this.navigateToConfigureChart();
		}
	},

	onEditView:function(){
		var self = this;
		var current_filters = this.getView().byId("ddaFilter").getActiveDimensions();
		this.oApplicationFacade.configuratorViewId = this.viewId || this.DDA_MODEL.NEW_VIEWID;
		if(this.warn_header || String(this.init_filters) != String(current_filters)) {
			//navigation warning
	       	 new sap.m.Dialog({
	       		 icon:"sap-icon://warning2",
	       		 title:self._oTextsModel.getResourceBundle().getText("WARNING"),
	       		 state:"Error",
	       		 type:"Message",
	       		 content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE_TO_SAVE_CONFIGURATION")})],
	       		 beginButton: new sap.m.Button({
	       			 text:self._oTextsModel.getResourceBundle().getText("SAVE_AND_CONTINUE"),
	       			 press: function(){
	       				 var inDialog = true;
	       				 self.warn_header = false;
	       				 this.getParent().close();
	       				 self.SaveConfig(inDialog);
	       				 self.navigateToConfigureChart();
	       			 }
	       		 }),
	       		 endButton: new sap.m.Button({
	       			 text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
	       			 press:function(){this.getParent().close();}
	       		 })                                           
	       	 }).open();
		} else {
			this.navigateToConfigureChart();
		}
	},
	tileTypeMapping:{
				NT : "Numeric",
                AT : "Bullet",
                CT : "Comparison",
                TT : "AreaChart",
                CM:"MeasureComparison"
                /*HT : "HarveyBall" */
	},
	_getSelectedTile:function(){
		var tiles=this.byId("tileContainer").getItems()||[];
		return {
			tile:tiles[this._selectedTileIndex],
			index:this._selectedTileIndex
		}
		
	},
	_setSelectedTile:function(i){
		this._selectedTileIndex=i;
		var tiles=this.byId("tileContainer").getItems()||[];
		for(j=0;j<tiles.length;j++){
			tiles[j].getTileControl().removeStyleClass("mySelectedStyle");
		}
		this.byId("deleteTile").setEnabled(i!=-1);
		if(i!=-1){
			tiles[i].getTileControl().addStyleClass("mySelectedStyle");
		}
		/*
		if(i!=-1){
			tiles[i].getTileControl().addStyleClass("mySelectedStyle");
			var contextData=tiles[i].getBindingContext("SB_DDACONFIG").getObject();
			this.byId("deleteTile").setEnabled(!(contextData.VISUALIZATION_TYPE=="NT" && contextData.EVALUATION_ID==contextData.REFERENCE_EVALUATION_ID));			
		}else{
			this.byId("deleteTile").setEnabled(i!=-1);
		}
		*/
		this.byId("leftMoveArrow").setEnabled((i!=-1)&&i!=0);
		this.byId("rightMoveArrow").setEnabled((i!=-1)&& i!=tiles.length-1);
	},
	deleteTile:function(){
		var that = this;
		var confirmDialog = new sap.m.Dialog({
			title:"Delete",
			type:"Message",
			content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("DELETE_CONFIRMATION")})],
			beginButton: new sap.m.Button({
				text:"Ok",
				press: function(oEvent){
					confirmDialog.close();
					var tileRef=that._getSelectedTile().tile;
					var visibleHeaderTiles=tileRef.getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE;
					visibleHeaderTiles.splice(that._getSelectedTile().index,1);
					that._setSelectedTile(-1);
					that.refreshTileBindings();
				}
			}),
			endButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				press:function(){
					confirmDialog.close();}
			})
		});
		confirmDialog.open(); 
	},
	initializeTileHeader:function(){
		var that=this;
		var tileContainer=this.byId("tileContainer");
		tileContainer.bindAggregation("items",{
				path:"SB_DDACONFIG>/HEADERS_VISIBLE",
				factory:function(sId,oBindingContext){
					var type=oBindingContext.getProperty("VISUALIZATION_TYPE");
					return new sap.suite.ui.smartbusiness.tiles[that.tileTypeMapping[type]]({
						evaluationId:that.evaluationId,
						mode:"DUMMY",
						header:	"{SB_DDACONFIG>TITLE}",
						subheader: "{SB_DDACONFIG>SUBTITLE}"
					}).addStyleClass("drilldownKpiTiles").attachBrowserEvent("click",function(evt){
								var visibleHeaderArray = this.getParent().getAggregation("content");
								that._setSelectedTile(visibleHeaderArray.indexOf(this));
					});
				},
				//filters:[filter]
			});
	},
	initializeAddTileDialog:function(){
		var that=this;
		this._tileEvaluationList=sap.ui.core.Fragment.byId("addRelatedTilesDialog","evaluationTilesList");
		var tileTypeText={
			NT : "NUMBER_TILE",
	        AT : "ACTUAL_VS_TARGET_TILE",
	        CT : "COMPARISON_TILE",
	        TT : "TREND_TILE",
	        CM:"COMPARISON_MM_TILE",
	        HT : "HARVEY_BALL_TILE"
		};
		var sorter1=new sap.ui.model.Sorter('SB_DDACONFIG>GROUPING_TITLE',false,function(oContext){
			return oContext.getProperty('GROUPING_TITLE');
		});
		var sorter2=new sap.ui.model.Sorter('SB_DDACONFIG>VISUALIZATION_TYPE_INDEX',false);
		this._tileEvaluationList.bindAggregation("items",{
			path:"SB_DDACONFIG>/HEADERS",
			factory:function(sId,oBindingContext){
				var type=oBindingContext.getProperty("VISUALIZATION_TYPE");
				var miniTile=new sap.suite.ui.smartbusiness.tiles[that.tileTypeMapping[type]]({
					evaluationId:that.evaluationId,
				 	mode:"DUMMY",
				 	header:	"TITLE",
					subheader: "SUBTITLE",
					contentOnly:true
				});
				var miniTileShadow=new sap.m.HBox({
					width:"100%",
					justifyContent:"SpaceAround",
					items:[new sap.suite.ui.smartbusiness.tiles[that.tileTypeMapping[type]]({
						evaluationId:that.evaluationId,
					 	mode:"DUMMY",
					 	header:	"TITLE",
						subheader: "SUBTITLE",
						contentOnly:true
					})]
				});
				var tilePane= new sap.m.HBox({
					justifyContent:"Start",
					width:"98%",
					items:[miniTile,new sap.m.Label({
			        		 text:{
			        			 path:"SB_DDACONFIG>VISUALIZATION_TYPE",
			        			 formatter:function(s){return that._oTextsModel.getResourceBundle().getText(tileTypeText[s]);}
			        		 }
		        	 		})]
				});
				return new sap.m.CustomListItem({
					type:(type=='NT'||type=='AT')?'Active':'Navigation',
					press:function(){
						var oBindingcontext=this.getBindingContext('SB_DDACONFIG').getObject();
						var vizualizationType=oBindingcontext.VISUALIZATION_TYPE;
						oBindingcontext['visible']=true;
						if(vizualizationType=='NT'||vizualizationType=='AT'){
							that.getView().getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE.push(that._cloneObj(oBindingcontext));
							that.onAddTileOk();
							that.refreshTileBindings();
						}else{
							that._addRelatedTilesDialog.close();
							try{
								var index=vizualizationType=='CM'?1:(vizualizationType=="HT")?2:0;
								that._configureTileDialog.getContent()[index].getItems()[1].removeAllContent();
								that._configureTileDialog.getContent()[index].getItems()[1].addContent(miniTileShadow);	
								
							}catch(e){}
							 that._configureTileDialog.bindElement('SB_DDACONFIG>'+this.getBindingContextPath());
							 that._configureTileDialog.open();
								var oI18nModel = that.getView().getModel("i18n");
								
								 var otemplate = new sap.ui.core.Item({
				                        key: "_none^",
				                        text: oI18nModel.getResourceBundle().getText("SELECT_NONE"),

				                   });
								 
								
								 
								 if(!sap.ui.core.Fragment.byId("configureTileDialog","measuresForTile3").getItemByKey("_none^"))

								 sap.ui.core.Fragment.byId("configureTileDialog","measuresForTile3").insertItem(otemplate,"0");
				
						}
					},
					content:[new sap.m.HBox({
						justifyContent:"SpaceAround",
						items:[tilePane]
					})]
				});
			},
			sorter:[sorter1,sorter2]
		});
	},
	onMiniChartConfigureOk:function(){
		var oBindingcontext=this._configureTileDialog.getBindingContext("SB_DDACONFIG").getObject();
		oBindingcontext['visible']=true;
		this.getView().getModel("SB_DDACONFIG").getData().HEADERS_VISIBLE.push(this._cloneObj(oBindingcontext));
		this.onAddTileOk();
		this.refreshTileBindings();
	},
	showConfigureTileMeasure:function(sVal){
		return sVal=='CM';
	},
	showConfigureTileDimension:function(sVal){
		return sVal=='CT'|| sVal=='TT';
	},
	showConfigureTileSortOrder:function(sVal){
		return sVal=='CT';
	},
	showThirdMeasure:function(sVal){
		return !!sVal;
	},
	showHarveyConfigurator: function (tileType){
		return tileType=="HT";
	},
	harveyTotalMeasureVisibility:function(tileType,bIsKpiFractionMeasure){
		return tileType=="HT" && bIsKpiFractionMeasure;
	},
	harveyFilterVisibility:function(tileType,bIsKpiTotalMeasure){
		return  tileType=="HT" && bIsKpiTotalMeasure;
	},
	harveyFilterOptionVisibility:function(tileType,bIsKpiTotalMeasure,selectedDimension){
		return  tileType=="HT" && bIsKpiTotalMeasure && selectedDimension;
	},
	betweenOperatorLabelVisibility:function(operator){
		return operator=="BT";
	},	
	refreshTileBindings:function(){
		try{
			var tileContainer=this.byId("tileContainer");
			tileContainer.getModel("SB_DDACONFIG").refresh();
		}catch(e){}
	},
	_refreshEvaluationsBinding:function(){
//		var siblingEvaluations=sap.ui.core.Fragment.byId('addRelatedTilesDialog','siblingEvaluations');
//		var associatedEvaluations=sap.ui.core.Fragment.byId('addRelatedTilesDialog','associatedEvaluations');
//		if(siblingEvaluations.getItems().length){
//			siblingEvaluations.updateItems();
//		}
//		if(associatedEvaluations.getItems().length){
//			associatedEvaluations.updateItems();
//		}
	},
	onAddTileOk:function(oEvent){
		this.takeConfigSnapShot();
		this._setSelectedTile(-1);
		this.refreshTileBindings();
		try{
			this._configureTileDialog.close();
			this._addRelatedTilesDialog.close();	
		}catch(e){}
		this._refreshEvaluationsBinding();
		//to know if navigation warning is to be shown on not.
		this.warn_header = true;
	},
	onAddTileCancel:function(oEvent){
		this.restoreFromConfigSnapShot();
		this._setSelectedTile(-1);
		this.refreshTileBindings();
		try{
			this._configureTileDialog.close();
			this._addRelatedTilesDialog.close();	
		}catch(e){}
		this._refreshEvaluationsBinding();
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
	createTileMenuForCurrentEvaluation:function(evalId){
		var that=this;
		 var tileOrder = ['NT', 'AT', 'CT', 'TT', 'CM'];
		 var evalData = this._getEvalData(evalId);
		 var measures = sap.suite.ui.smartbusiness.lib.Util.odata.getAllMeasures(evalData.ODATA_URL,evalData.ODATA_ENTITYSET) || [];
		 var dimensions = sap.suite.ui.smartbusiness.lib.Util.odata.getAllDimensions(evalData.ODATA_URL,evalData.ODATA_ENTITYSET) || [];
		 var filterableDimensions = sap.suite.ui.smartbusiness.lib.Util.odata.getAllFilterableDimensions(evalData.ODATA_URL,evalData.ODATA_ENTITYSET)||[] ;
		 
		var model=this.getView().getModel("SB_DDACONFIG");
		if(!model.getProperty("/HEADER_EVALUATIONID")[evalId]){
			model.getProperty("/HEADER_EVALUATIONID")[evalId]=true;
			var header=model.getProperty("/HEADERS");
			for(var each in this.tileTypeMapping){
				header.push({
                        EVALUATION_ID : this.evaluationId,
                        CONFIGURATION_ID : this.viewId,
                        REFERENCE_EVALUATION_ID : evalId,
                        VISUALIZATION_TYPE : each,
                        VISUALIZATION_TYPE_INDEX:tileOrder.indexOf(each),
                        VISUALIZATION_ORDER : 1,
                        ALL_DIMENSIONS: dimensions,                        
                        DIMENSION : dimensions[0]||'',
                        SORT_BY: '',
                        SORT_ORDER:'MD',
                        MEASURE1	:measures[0],
                        MEASURE2	:measures[1]||measures[0],
                        MEASURE3	:measures[2]||"",
                        COLOR1:"Good",
                        COLOR2:"Critical",
                        COLOR3:"Error",
                        DIMENSION_COLOR : "Neutral",
                        HARVEY_FILTERS:[{
				    	   					NAME:filterableDimensions[0],
				    	   					OPERATOR:"EQ",
				    	   					VALUE_1:[],
				    	   					VALUE_2:[]
				       					}],
				       	HARVEY_TOTAL_MEASURE: measures[0],
                        FILTERABLE_DIMENSIONS: filterableDimensions,
				       	IS_HARVEY_FRACTION_KPIMEASURE : true,
				       	IS_HARVEYMEASURE_KPIMEASURE : false,
				       	ALL_MEASURES:measures,
                        VISIBILITY : 1,
                        visible : false ,
                        TITLE : evalData.INDICATOR_TITLE,
                        SUBTITLE : evalData.TITLE,
                        INDICATOR: evalData.INDICATOR
				});
			}
		}
	},
	openEvaluationsDialog:function(){
		//this.openMinichartsCancel();
		this._addRelatedTilesDialog.open();
		sap.ui.core.Fragment.byId('addRelatedTilesDialog','showCurrentKpiEvals').firePress();
		
	},
	evaluationGroupTextFormatter:function(context){
		return {text:context.getProperty("GROUPING_TEXT"),key:context.getProperty("GROUPING_TEXT")};
	},
	relatedEvalGroupTextFormatter:function(context){
		var rBundle=this.getView().getModel("i18n").getResourceBundle();
		return {text: (rBundle.getText("KPI")+": " + context.getProperty("INDICATOR")), key: context.getProperty("INDICATOR")}; 
	},
	
	showCurrentKPIEvals:function(){
		var that=this;
		var oModel=this.getView().getModel('SB_DDACONFIG');
		var rBundle=this.getView().getModel("i18n").getResourceBundle();
		if(!oModel.getProperty('/SIBLING_EVALUATIONS').length){
			var tmp=sap.suite.ui.smartbusiness.lib.Util.kpi.getSiblingEvaluations({
		           indicator : oModel.getProperty('/INDICATOR'),
		           id:this.evaluationId,
		           cache : false,
		           filters: false,
		           thresholds: false,
		           getDDAEvaluation: true
		        });
            tmp.forEach(function(s){
        		that.createTileMenuForCurrentEvaluation(s.ID);
            });
            oModel.getData().SIBLING_EVALUATIONS=tmp;
            oModel.getData().HEADERS.forEach(function(s){
    			var prefix=s.REFERENCE_EVALUATION_ID==s.EVALUATION_ID?'('+that._oTextsModel.getResourceBundle().getText('CURRENT_EVALUATION')+')':'';
    			s.GROUPING_TITLE=prefix+s.TITLE+" "+s.SUBTITLE;
            });
		}
		this.takeConfigSnapShot();
		var binding=this._tileEvaluationList.getBinding("items");
		var currentIndicator=this.getView().getModel("SB_DDACONFIG").getProperty("/INDICATOR");
		binding.filter(new sap.ui.model.Filter("INDICATOR",sap.ui.model.FilterOperator.EQ,currentIndicator));
		oModel.refresh();
	},
	showAssociatedEvals:function(){
		var that=this;
		var oModel=this.getView().getModel('SB_DDACONFIG');
		if(!oModel.getProperty('/ASSOCIATED_EVALUATIONS').length){
			oModel.getData().ASSOCIATED_EVALUATIONS=sap.suite.ui.smartbusiness.lib.Util.kpi.getAssociatedEvaluations({
		           indicator : oModel.getProperty('/INDICATOR'),
		           id:this.evaluationId,
		           cache : true
		        });
			oModel.getData().ASSOCIATED_EVALUATIONS.forEach(function(s){
        		that.createTileMenuForCurrentEvaluation(s.ID);
			});
            oModel.getData().HEADERS.forEach(function(s){
    			s.GROUPING_TITLE=s.TITLE+" "+s.SUBTITLE;
            });
		}
		this.takeConfigSnapShot();
		var binding=this._tileEvaluationList.getBinding("items");
		var currentIndicator=this.getView().getModel("SB_DDACONFIG").getProperty("/INDICATOR");
		binding.filter(new sap.ui.model.Filter("INDICATOR",sap.ui.model.FilterOperator.NE,currentIndicator));
		oModel.refresh();
		//sap.ui.core.Fragment.byId('addRelatedTilesDialog','siblingEvaluations').setVisible(false);
		//sap.ui.core.Fragment.byId('addRelatedTilesDialog','associatedEvaluations').setVisible(true);
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
		choroplethMapContainer.addItem(new sap.ui.vbm.AnalyticMap({
			width : "100%",
			height : "550px",
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
        var isStackApplied = (((chtype == "BAR") || (chtype == "COLUMN")) && (this.isStackDim) && (this.getDimensionToBeStacked(that.chartDimensions)) && (dimensions.length > 1)) ? true : false ;        
                
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
 		var chartFormatter = sap.ui.core.format.NumberFormat.getPercentInstance(formatterConstructor);
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
					that.oChartDataModel.setData({businessData: that.oChartData});
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
	
// ** For deleting a view :
	onDeleteView:function(){
		var that = this;
		//navigation warning
		new sap.m.Dialog({
			icon:"sap-icon://warning2",
			title:that._oTextsModel.getResourceBundle().getText("WARNING"),
			state:"Error",
			type:"Message",
			content:[new sap.m.Text({text:that._oTextsModel.getResourceBundle().getText("VIEW_WILL_BE_DELETED")})],
			beginButton: new sap.m.Button({
				text:that._oTextsModel.getResourceBundle().getText("OK"),
				press: function(){
					
					that.warn_header = false;
					var tmpData=that.getView().getModel("SB_DDACONFIG").getData();
					var saveService=sap.suite.ui.smartbusiness.Adapter.getService("DrilldownServices");
					//save headers and filters only if views are already configured
					if(tmpData.ALL_VIEWS.length > 0 ) {
						that.busyIndicator.open() && that.getView().setBusy(true);
						saveService.saveViewConfiguration(that.evaluationId,tmpData,"delete",function(){
							jQuery.sap.log.info("view delete success");
							that.busyIndicator.close() && that.getView().setBusy(false);
							sap.m.MessageToast.show(that._oTextsModel.getResourceBundle().getText("CHART_CONFIG_DELETE_SUCCESS"));						
							for(var i=0,index;i<tmpData.ALL_VIEWS.length;i++){
								if(tmpData.ALL_VIEWS[i].ID == that.viewId) {
									index = i;break;
								}				
							}
							if(index || (index==0)){
								tmpData.ALL_VIEWS.splice(index,1);	
							}
							that.viewId=(tmpData.ALL_VIEWS.length <=0 ? "" : (tmpData.ALL_VIEWS.length == (index)? tmpData.ALL_VIEWS[0].ID : tmpData.ALL_VIEWS[index].ID));					
							that.DDA_MODEL.getConfigurator().removeViewById(tmpData.ID);
							that.DDA_MODEL.setViewId(that.viewId);
							that.bindUiToModel();
							that._oModel = that.DDA_MODEL.getModelDataForDDAConfiguration();
							that.refreshChart();
						},function(e){
							jQuery.sap.log.error(e + " failed");
							//go out of busy mode.
							that.busyIndicator.close() && that.getView().setBusy(false);
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that._oTextsModel.getResourceBundle().getText("DELETE_ERROR"));
							});
					}
					this.getParent().close();
				}
			}),
			endButton: new sap.m.Button({
				text:that._oTextsModel.getResourceBundle().getText("CANCEL"),
				press:function(){this.getParent().close();}
			})                                           
		}).open();
	
	},
	// --------------------------------------------------------------------------------------------
	
	enableDisableButton : function(arr){
		if(arr.length<1){
			return false;
		}
		else{
			return true;
		}
	},	
	
	//--------------------------------------------------------------------------------------------
//	openminicharts:function(){
//		
//		this._oMiniCharts=sap.ui.xmlfragment("sap.suite.ui.smartbusiness.designtime.drilldown.view.minichartsDialog",this);
//		this._oMiniCharts.setModel(this._oTextsModel,"i18n");
//		
//		this._oMiniCharts.open();
//	},
//	openMinichartsCancel:function(){
//		this._oMiniCharts.close();	
//
//	},
	
	/*
	 * START - SAVE AND DELETE FUNCTIONS 
	 */
	
	deleteMaster: function() {

		var that = this;
		this.warn_header = false;
		var modelData=this.getView().getModel("SB_DDACONFIG").getData();
		var saveService=sap.suite.ui.smartbusiness.Adapter.getService("DrilldownServices");
		this.busyIndicator.open() && this.getView().setBusy(true);
		saveService.saveEvalConfiguration(this.evaluationId,modelData,"delete",function(){
    		  jQuery.sap.log.info("Deleted master configuration for the evaluation");
      		  that.busyIndicator.close() && that.getView().setBusy(false);
      		  that.DDA_MODEL.removeAllViews();
      		  sap.m.MessageToast.show(that._oTextsModel.getResourceBundle().getText("EVAL_CONFIG_DELETE_SUCCESS"));
              that.oRouter.navTo("detail",{"contextPath" : "EVALUATIONS_MODELER(ID='" + self.evaluationId + "',IS_ACTIVE=1)"});
      		  that.evaluationId=null;
      		  that.oApplicationFacade.__refreshModel = 1;
		},function(e){
      		  jQuery.sap.log.error(e + " failed");
      		  //go out of busy mode.
      		  that.busyIndicator.close() && that.getView().setBusy(false);
      		  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that._oTextsModel.getResourceBundle().getText("DELETE_ERROR"));
      		  });
	},
	
	/*
	 * END - SAVE AND DELETE FUNCTIONS
	 */

	



/*ENABLE AGGREGATE*/

	fetchAndRenderHeaderRibbon: function(filters) {
		      
	        var self = this;
	        var Evaluation = this.DDA_MODEL.EVALUATION_DATA;
			var mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(Evaluation.ODATA_URL,Evaluation.ODATA_ENTITYSET);
			var MEASURE_UNIT_PROPERTY_MAPPING = mProperties.getUnitPropertyMappingObject();
	        //on init load, take evaluation's filters; otherwise consider combined filters.
			var oUriObject = sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
	        	serviceUri : Evaluation.ODATA_URL,
	            entitySet : Evaluation.ODATA_ENTITYSET,
	            measure: Evaluation.COLUMN_NAME,
	            filter : Evaluation.FILTERS["results"]
	        });
	        oUriObject.model.read(oUriObject.uri, null, null, true, function(data) {
	            if(data) {
	                self.HeaderRibbonModel.setData({data:data.results[0]});
	            } else {
	                jQuery.sap.log.error("Couldn't fetch Aggregate Value. Response was "+data+" for uri : "+oUriObject.uri);
	            }
	        });
	        var kpiMeasureUnitProperty = MEASURE_UNIT_PROPERTY_MAPPING[Evaluation.COLUMN_NAME];
	       
	        
	        var oI18nModel = this.getView().getModel("i18n");
	       
	        this.byId("aggregate_number").bindProperty("text","/data/"+Evaluation.COLUMN_NAME,function(value){
	        	
	        	if(value==""||value==null)
	        		{
	        		value= oI18nModel.getResourceBundle().getText("NO_DATA");
	        		}
	        	return value;
	        	
	        	
	        });
	        
	        if(kpiMeasureUnitProperty) {
	            this.byId("aggregate_number_unit").bindProperty("text", "/data/" + kpiMeasureUnitProperty,function(value){
	            	return value;
	            });
	        }
	       
	        
	    },

	    displayAggregate: function(){

	    	var oI18nModel = this.getView().getModel("i18n");

	    	if(this.byId("enableAggregate").getSelected() === false) {
	    		this.byId("enableAggregate").setText(oI18nModel.getResourceBundle().getText("ENABLE_KPI_AGGREGATE"));
	    		this.byId("enableAggregate").invalidate();
	    	} else if(this.byId("enableAggregate").getSelected() === true) {
	    		this.byId("enableAggregate").setText("");
	    		this.byId("aggregate_number").setText("12,345.67");
	    		this.byId("aggregate_number_unit").setText("EUR");
	    	}

	    },
		
		    isModelChanged : function() {
				this.currentCopy = this._cloneObj(this.getView().getModel("SB_DDACONFIG").getData());
				//check for aggregate number state
				if(this.initCopy.CONFIG.SAP_AGGREGATE_VALUE != this.currentCopy.CONFIG.SAP_AGGREGATE_VALUE){
					return true;
				}
				//check for filters state
				var currentFilters = this.getView().byId("ddaFilter").getActiveDimensions();
				if(currentFilters.length == this.initCopy.FILTERS.length){
					for(var i = 0; i<currentFilters.length; i++){
						if(currentFilters[i] != this.initCopy.FILTERS[i].name){
							return true;
						}
					}
				}
				else{
					return true;
				}
				//check for headers state
				if(this.initCopy.HEADERS_VISIBLE.length == this.currentCopy.HEADERS_VISIBLE.length){
					for(var i = 0; i<this.initCopy.HEADERS_VISIBLE.length; i++){
						delete this.initCopy.HEADERS_VISIBLE[i].ALL_MEASURES;
						delete this.initCopy.HEADERS_VISIBLE[i].ALL_DIMENSIONS;
						delete this.currentCopy.HEADERS_VISIBLE[i].ALL_MEASURES;
						delete this.currentCopy.HEADERS_VISIBLE[i].ALL_DIMENSIONS;
						response = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({oldPayload:this.initCopy.HEADERS_VISIBLE[i],newPayload:this.currentCopy.HEADERS_VISIBLE[i]});
						if((response.updates && response.updates.length) || (response.deletes && response.deletes.length)){
							return true;
						}
					}
				}
				else{
					return true;
				}
				return false;
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
		this.bindUiToModel();
		this._oModel = this.DDA_MODEL.getModelDataForDDAConfiguration();
		this.refreshChart();
		oEvent.getSource().setTooltip(oEvent.getParameters().selectedItem.getText());
		window.location.replace(window.location.hash.substring(0,window.location.hash.lastIndexOf("/")) + "/" + this.viewId);
	},
	initialiazeValueHelpDialog:function(){
		var that = this;
		this.filterValueHelpDialog = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("SELECT_FILTERS"),
			multiSelect : true,
			items : {
				path : "/filterValues",
				template : new sap.m.StandardListItem({title : "{value}",selected:"{selected}"})
			},
			//rememberSelections:true,
			growingThreshold:999,
			confirm : function(oEvent) {
				var aSelectedContexts=oEvent.mParameters.selectedContexts;
				var values=[];
				aSelectedContexts.forEach(function(oContext){
					values.push(oContext.getProperty("value"));
				});
				that.getView().getModel("SB_DDACONFIG").setProperty(this.ownerBindingPath+"/HARVEY_FILTERS/0/VALUE_1",values);
			},
			cancel:function(oEvent){
				
			},
			liveChange : function(oEvent) {
				var searchValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter("value", sap.ui.model.FilterOperator.Contains, searchValue);
				var oFilterLabel = new sap.ui.model.Filter("value", sap.ui.model.FilterOperator.Contains, searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter([oFilter,oFilterLabel], true);
			}
		});
		//this.initializeDataForDimensionsDialog();
		this.filterValueHelpDialog.setModel(new sap.ui.model.json.JSONModel({
			filterValues:[]
		}));
		return this.filterValueHelpDialog;
	},
	fetchFilterValuesForDimension:function(sDim,aValues,fnS,fnE){
		var that=this;
		var cachedValues;
		var model=this.getView().getModel("SB_DDACONFIG");
		var oDataUrl= model.getProperty("/QUERY_SERVICE_URI");
		var oValues={};
		aValues.forEach(function(val){
			oValues[val]=true;
		});
		//var sDim=model.getProperty("/CHIP/harveyFilterDimension");
		var oDataConfig=sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
			serviceUri :oDataUrl,
			entitySet : model.getProperty("/QUERY_ENTITY_SET"),
			filter : this.DDA_MODEL.EVALUATION_DATA.FILTERS?this.DDA_MODEL.EVALUATION_DATA.FILTERS.results:[],
			dimension : sDim
		});
		if((cachedValues=this.getApplicationCache(oDataUrl+"/"+oDataConfig.uri))){
			fnS(cachedValues);
		}else{
			oDataConfig.model.read(oDataConfig.uri,null, null, false,function(data){
				var d=[];
				data.results.forEach(function(o){
					d.push({
						value:o[sDim],
						selected:!!oValues[o[sDim]]
					});
				});
				that.setApplicationCache(oDataUrl+"/"+oDataConfig.uri,d);
				fnS(d);
			},fnE);
		}
		
	},
	openFilterValueHelp:function(oEvent){
		var that=this;
		var viewModel= that.getView().getModel("SB_DDACONFIG");
		this.filterValueHelpDialog.open();
		this.filterValueHelpDialog.setBusy(true);
		this.filterValueHelpDialog.ownerBindingPath=oEvent.getSource().getBindingContext("SB_DDACONFIG").getPath();
		var sDim =oEvent.getSource().getBindingContext("SB_DDACONFIG").getProperty("HARVEY_FILTERS/0/NAME");
		var aSelectedValues =oEvent.getSource().getBindingContext("SB_DDACONFIG").getProperty("HARVEY_FILTERS/0/VALUE_1");
		that.fetchFilterValuesForDimension(sDim,aSelectedValues,function fetchFilterValuesForDimensionCallBack(data){
			that.filterValueHelpDialog.getModel().setProperty("/filterValues",data);
			that.filterValueHelpDialog.setBusy(false);
		},function(e){
			that.filterValueHelpDialog.setBusy(false);
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_FETCHING_FILTERS"), e);
			});
	
	},
});
