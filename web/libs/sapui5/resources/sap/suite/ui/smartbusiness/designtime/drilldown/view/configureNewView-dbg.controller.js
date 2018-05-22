/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.IDGenerator");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.vbm.AnalyticMap");
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");

sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.drilldown.view.configureNewView",{
	onInit:function(){
		var that = this;
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
		this.CDS = "cds";
		var viewmode = jQuery.sap.getUriParameters().get("viewmode");
		viewmode = viewmode ? viewmode.toUpperCase() : null;
		if(viewmode === this.CDS.toUpperCase()) {
			this.isCDS = true;
		}
		this.errorState = false;
		this.DDA_MODEL = null;
		this.evaluationId = null;
		this.COLUMN_LABEL_MAPPING={};
		//this.getView().getModel("SB_DDACONFIG").getData().NO_OF_ADDITIONAL_LANGUAGES = 0;
		this.measureDimensionList=this.byId(sap.ui.core.Fragment.createId('measureDimensionsList','measureDimensionsList'));
		this._oDimensionList=sap.ui.xmlfragment("sap.suite.ui.smartbusiness.designtime.drilldown.view.list",this);
		this._oMeasureList=sap.ui.xmlfragment("sap.suite.ui.smartbusiness.designtime.drilldown.view.list",this);

		try{
			if(sap.ui.core.Fragment.byId("measureDimensionDialog","measureDimensionDialog")){
				sap.ui.core.Fragment.byId("measureDimensionDialog","measureDimensionDialog").destroy();
			} 
			if(sap.ui.core.Fragment.byId("thresholdDialog","dialogRef")){
				sap.ui.core.Fragment.byId("thresholdDialog","dialogRef").destroy();
			}
			if(sap.ui.core.Fragment.byId("editDialog","editDialog")){
				sap.ui.core.Fragment.byId("editDialog","editDialog").destroy();
			}
			if(sap.ui.core.Fragment.byId("editChartDialog","editChartDialog")){
				sap.ui.core.Fragment.byId("editChartDialog","editChartDialog").destroy();
			}
			if(sap.ui.core.Fragment.byId("dualAxisConfig","dualAxisConfig")){
				sap.ui.core.Fragment.byId("dualAxisConfig","dualAxisConfig").destroy();
			}
			if(sap.ui.core.Fragment.byId("msrDialogForStack1","stack1SelectDialog")){
				sap.ui.core.Fragment.byId("msrDialogForStack1","stack1SelectDialog").destroy();
			}
			if( sap.ui.core.Fragment.byId("additionalLanguageDialog","additionalLanguageDialog")){
				sap.ui.core.Fragment.byId("additionalLanguageDialog","additionalLanguageDialog").destroy();
			}
			if( sap.ui.core.Fragment.byId("chartTypeConfig","chartTypeConfig")){
				sap.ui.core.Fragment.byId("chartTypeConfig","chartTypeConfig").getParent().destroy();
			}
			if(sap.ui.core.Fragment.byId("choroplethSettingsDialog","choroplethSettingsDialog")){
				sap.ui.core.Fragment.byId("choroplethSettingsDialog","choroplethSettingsDialog").destroy();
			}
		}
		catch(e){};
		this._oShowMeasureDialog = sap.ui.xmlfragment("measureDimensionDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.measureDimensionDialog", this);
		this._oShowMeasureDialog.addStyleClass("dialog");
		this.addThresholdMeasureDialog=sap.ui.xmlfragment("thresholdDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.addThresholdMeasure", this);
		this._editMeasureDialog = sap.ui.xmlfragment("editDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.editDialog", this);
		this._editChartDialog = sap.ui.xmlfragment("editChartDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.editChartDialog", this);
		this._dualAxisConfig = sap.ui.xmlfragment("dualAxisConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.dualAxisConfig", this);
		this._msrDialogForStack1 = sap.ui.xmlfragment("msrDialogForStack1","sap.suite.ui.smartbusiness.designtime.drilldown.view.msrDialogForStack1", this);
		this.AdditionalLanguagesDialog = new sap.ui.xmlfragment("additionalLanguageDialog" ,"sap.suite.ui.smartbusiness.designtime.drilldown.view.additionalLanguagesDialog", this);
		this.choroplethSettingsDialog = new sap.ui.xmlfragment("choroplethSettingsDialog" ,"sap.suite.ui.smartbusiness.designtime.drilldown.view.choroplethSettingsDialog", this);
		this._chartTypeConfig = sap.ui.xmlfragment("chartTypeConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.chartTypeConfig", this);		
		this.oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
		this.busyIndicator = new sap.m.BusyDialog();
		
		if(this.oApplicationFacade.navigatingWithinDrilldown) {
			this.navigatingWithinDrilldown = true;
			this.oApplicationFacade.navigatingWithinDrilldown = undefined;
		} 
		else {
			this.navigatingWithinDrilldown = false;
		}
		
		this.choroplethSettingsDialog.attachAfterOpen(jQuery.proxy(that.afterChoroplethSettingsDialogOpen,that));
//		this.byId("chartTitleInput").attachChange(function (){
//			that.copyConfigSnapshot();
//		});
	},
	onError : function(event){
		sap.suite.ui.smartbusiness.lib.Util.utils.handleMessagePopover(event,this);
	},
	afterChoroplethSettingsDialogOpen : function(controller){
		var that=this;
		var aFilterMeasure = [new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE"),new sap.ui.model.Filter("SELECTED",sap.ui.model.FilterOperator.EQ,true)];
		var aFilterDimension = [new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"DIMENSION"),new sap.ui.model.Filter("SELECTED",sap.ui.model.FilterOperator.EQ,true)];
		//var aFilterThresholdMeasure = [new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE"),new sap.ui.model.Filter("SELECTED",sap.ui.model.FilterOperator.EQ,true),new sap.ui.model.Filter("NAME",sap.ui.model.FilterOperator.NE,sap.ui.getCore().byId("choroplethSettingsDialog--choroplethKpiMeasure").getSelectedKey())];
		
		sap.ui.getCore().byId("choroplethSettingsDialog--choroplethKpiMeasure").getBinding("items").filter(new sap.ui.model.Filter(aFilterMeasure,true));
		sap.ui.getCore().byId("choroplethSettingsDialog--choroplethKpiMeasure").rerender();
		//sap.ui.getCore().byId("choroplethSettingsDialog--choroplethGeoDimension").getBinding("items").filter(new sap.ui.model.Filter(aFilterDimension,true));
		this.handleMainMeasureChange();
		//sap.ui.getCore().byId("choroplethSettingsDialog--choroplethThresholdMeasure").getBinding("items").filter(new sap.ui.model.Filter(aFilterThresholdMeasure,true));

/*		sap.ui.core.Fragment.byId("choroplethSettingsDialog","thresholdMeasureList").setVisible(false);
		sap.ui.core.Fragment.byId("choroplethSettingsDialog","displaySelectedParametersGrid").setVisible(true);
		
		if(this.getView().getModel('SB_DDACONFIG').getData().MAIN_MEASURE == this.getView().getModel('SB_DDACONFIG').getData().THRESHOLD_MEASURE){
			sap.ui.core.Fragment.byId("choroplethSettingsDialog","choroplethThresholdMeasure").setValue("");
		}
		
		if(!(this.choroplethSettingsDialog.getBeginButton())){
			this.choroplethSettingsDialog.setBeginButton(new sap.m.Button({
				text : "{i18n>OK}",
				id : "okButton",
				press : jQuery.proxy(that.onChoroplethSettingsOk,that)
			}));
		}
*/
	},

	onRoutePatternMatched:function(oEvent){
		var that=this;
		var newViewFlag;
		if (oEvent.getParameter("name") === "configureChart") {
			that.errorState = undefined; 
			that.errorMsg = undefined;
			try {
				this.evaluationId = oEvent.getParameter("arguments")["evaluationId"];
				this.currentViewId = oEvent.getParameter("arguments")["viewId"];
				this.DDA_MODEL = sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.getInstance(this.evaluationId,false,this.getView().getModel("i18n"));
				if(this.currentViewId !== this.DDA_MODEL.NEW_VIEWID) {
					this.DDA_MODEL.setViewId(this.currentViewId);	
				}
				else{
					this.DDA_MODEL.setViewId(this.DDA_MODEL.NEW_VIEWID);
					newViewFlag = true;
				}
				this.EVALUATION = sap.suite.ui.smartbusiness.lib.Util.kpi.parseEvaluation(this.DDA_MODEL.EVALUATION_DATA);
				this.mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(this.EVALUATION.getODataUrl(),this.EVALUATION.getEntitySet());
				this.COLUMN_LABEL_MAPPING = this.mProperties.getLabelMappingObject();
				this.bindUiToModel();
				this._oModel = this.getView().getModel("SB_DDACONFIG");
				this._oModel.getData().NO_OF_ADDITIONAL_LANGUAGES = this._oModel.getData().ADDITIONAL_LANGUAGE_TITLES.length ? (this._oModel.getData().ADDITIONAL_LANGUAGE_TITLES.length - 1) : 0;
				this._oTextsModel = this.getView().getModel("i18n");
				this._editMeasureDialog.setModel(this._oTextsModel,"i18n");
				this._editChartDialog.setModel(this._oTextsModel,"i18n");
				this._dualAxisConfig.setModel(this._oTextsModel,"i18n");
				this._msrDialogForStack1.setModel(this._oTextsModel,"i18n");
				this._oShowMeasureDialog.setModel(this._oTextsModel,"i18n");
				this.addThresholdMeasureDialog.setModel(this._oTextsModel,"i18n");
				this.prepareInitialModelData(this._oModel);

				this._updateMeasureDimensionBindings();
				this.choroplethSettingsDialog.setModel(this._oTextsModel,"i18n");

                this.choroplethSettingsDialog.setModel(this._oModel,"SB_DDACONFIG");

                //decimals given by user
        		this.nDecimal = this.EVALUATION.getDecimalPrecision();
        		this.oFormatOptions_core = { style: "short" };
        		if(!(this.nDecimal === null || this.nDecimal === -1)) {
        			this.oFormatOptions_core.minFractionDigits = this.nDecimal;
        			this.oFormatOptions_core.maxFractionDigits = this.nDecimal;
        		}
        		if(this.nDecimal === -1){
        			this.oFormatOptions_core.minFractionDigits = 2;
        			this.oFormatOptions_core.maxFractionDigits = 2;
        		}
                
				this.refreshChart();
				this.chartTypeInit();
				jQuery.sap.require("sap.suite.ui.smartbusiness.lib.AppSetting");
				
				var viewData=this.getView().getModel("SB_DDACONFIG").getData();
				/*moving this above ID generation so as to open Measure&Dimension
				 * dialog on navigation to configureNewView 
				 */
/*				if(viewData.SELECTED_VIEW==""){
					var newViewFlag = true;
				}*/
				if(this.currentViewId == this.DDA_MODEL.NEW_VIEWID) {
					this.generateViewId(this);
				}
				this.takeConfigMasterSnapShot();
				this.initCopy = this.getView().getModel("SB_DDACONFIG").getJSON();
				
				
				
				sap.suite.ui.smartbusiness.lib.AppSetting.init({
					oControl : this.byId("chartIdInput"),		
					controllerReference : that,		
					hideElement  : "input",		
					i18n: {		
						checkBoxText: that.oApplicationFacade.getResourceBundle().getText("CHECKBOX_TEXT"),		
						saveText: that.oApplicationFacade.getResourceBundle().getText("OK"),		
						cancelText: that.oApplicationFacade.getResourceBundle().getText("CANCEL"),		
						settingsText: that.oApplicationFacade.getResourceBundle().getText("SETTINGS"),
						settingInfoTitle: that.oApplicationFacade.getResourceBundle().getText("SETTING_INFO_TITLE"),
						settingInfoText: that.oApplicationFacade.getResourceBundle().getText("SETTING_INFO_TEXT")		
					},		
					title : that.oApplicationFacade.getResourceBundle().getText("SETTINGS_SB"),		
					action: that.generateViewId		
				});
				this.settingModel = sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
				sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");
				this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");
			}
			catch(e) {
				that.errorState = true;
				that.errorMsg = e.message;
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(this.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), e.message);
			}
			finally {
				this.setTooltipForAllSelect();
			}
			//open this dialog on navigation to configureNewView 
			if(newViewFlag){
			this.openAllMeasuresDimension();
			}
		}
	},
	setTooltipForAllSelect: function() {
		var select, text, i, l;
		var data = this.getView().getModel("SB_DDACONFIG").getData();
		select = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
		for(i = 0, l = data.CHART_TYPES.length; i < l; i++) {
			if(data.CHART_TYPES[i].key == data.CHART_TYPE) {
				text = data.CHART_TYPES[i].text;
			}
		}
		select.setTooltip(text);
		
		select = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual"));
		for(i = 0, l = data.AXIS_TYPES.length; i < l; i++) {
			if(data.AXIS_TYPES[i].key == data.AXIS_TYPE) {
				text = data.AXIS_TYPES[i].text;
			}
		}
		select.setTooltip(text);
		
		select = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","isAbsolute"));
		for(i = 0, l = data.VALUE_TYPES.length; i < l; i++) {
			if(data.VALUE_TYPES[i].key == data.VALUE_TYPE) {
				text = data.VALUE_TYPES[i].text;
			}
		}
		select.setTooltip(text);
		
		select = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));
		for(i = 0, l = data.COLOR_SCHEMES.length; i < l; i++) {
			if(data.COLOR_SCHEMES[i].key == data.COLOR_SCHEME) {
				text = data.COLOR_SCHEMES[i].text;
			}
		}
		select.setTooltip(text);
		
		select = this.getView().byId("chartDataMode");
		// data mode always defaulted to dummy value
		text = data.DATA_MODES[0].text;
		select.setTooltip(text);
	},
	displayLabelsFormatter:function(s){
		return this.COLUMN_LABEL_MAPPING[s]||s;
	},
	bindUiToModel:function(){
		this.DDA_MODEL.bindModel(this.getView(),"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._editMeasureDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._editMeasureDialog);
		this.DDA_MODEL.bindModel(this._editChartDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._editChartDialog);
		this.DDA_MODEL.bindModel(this._oShowMeasureDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this._oShowMeasureDialog);
		this.DDA_MODEL.bindModel(this.addThresholdMeasureDialog,"SB_DDACONFIG");
		this.DDA_MODEL.bindModel(this.AdditionalLanguagesDialog,"SB_DDACONFIG");
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
	takeConfigMasterSnapShot:function(){
		this._masterConfig=this._cloneObj(this._oModel.getData());
	},
	restoreFromConfigMasterSnapShot:function(){
		this._oModel.setData(this._cloneObj(this._masterConfig));
	},
	copyConfigSnapshot:function(){
		this._config=this._cloneObj(this._oModel.getData());
		this.enableOrDisableSave();//check for presence of atleast 1 msr or dim, disable save if nothing is selected
	},
	restorePrevConfig:function(){
		this._oModel.setData(this._cloneObj(this._config));
	},
	prepareInitialModelData:function(oModel){
		var tmpData=oModel.getData();
		var isSingleAxis = (tmpData.AXIS_TYPE === "SINGLE");
		var dim=tmpData.ALL_DIMENSIONS;
		var msr=tmpData.ALL_MEASURES;
		var data=[],isColumnConfigured={};
		var configuredColumns=tmpData.COLUMNS;
		for(var i=0;i<configuredColumns.length;i++){
			if(isSingleAxis && configuredColumns[i].TYPE === "MEASURE"){
				configuredColumns[i].AXIS = 1;
			}
			configuredColumns[i].SELECTED=true;
			configuredColumns[i].LABEL=this.COLUMN_LABEL_MAPPING[configuredColumns[i].NAME];
			data.push(configuredColumns[i]);
			isColumnConfigured[configuredColumns[i].NAME]=true;
		}
		for(var i=0;i<dim.length;i++){
			if(isColumnConfigured[dim[i]])
				continue;
			data.push({AXIS: 1,NAME: dim[i],SORT_BY: dim[i],SORT_ORDER: "none",STACKING: 0,
				TYPE: "DIMENSION",VISIBILITY: "BOTH",SELECTED:false,LABEL:this.COLUMN_LABEL_MAPPING[dim[i]]});
		}
		for(var i=0;i<msr.length;i++){
			if(isColumnConfigured[msr[i]]){
				continue;
			}
			data.push({0: Object,AXIS: 1,COLOR1: "",COLOR2:"",NAME: msr[i],SORT_BY: msr[i],
				SORT_ORDER: "none",STACKING: 0,TYPE: "MEASURE",VISIBILITY: "BOTH",SELECTED:tmpData.SELECTED_VIEW==""?this.DDA_MODEL.EVALUATION_DATA.COLUMN_NAME==msr[i]:false,LABEL:this.COLUMN_LABEL_MAPPING[msr[i]]
			});
		}
		tmpData.items=data;
		oModel.setData(tmpData);
	},
	_updateMeasureDimensionBindings:function(){
		var filter = new sap.ui.model.Filter("SELECTED",sap.ui.model.FilterOperator.EQ,true);
		var sorter = new sap.ui.model.Sorter("COLUMNS_ORDER",false,null);
		var binding=this.measureDimensionList.getBinding("items");
		binding.filter(filter);
		binding.sort(sorter);
	},
	onChartTypeChange:function(oEvent){
		var that=this;
		//this.copyConfigSnapshot();
		if (! this._chartTypeConfig) {
			this._chartTypeConfig = sap.ui.xmlfragment("chartTypeConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.chartTypeConfig", this);
		}
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartTypeConfig"));
		var chart_type = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
//		if(chart_type.getSelectedKey().toUpperCase()!="BUBBLE")
//			this.copyConfigSnapshot();
		
/*        if(chart_type.getSelectedKey().toUpperCase()=="CHOROPLETH" ){
            this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","choroplethSettingsLink")).setVisible(true);
	    }else{
	            this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","choroplethSettingsLink")).setVisible(false);
	    }*/
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setVisible((chart_type.getSelectedKey().toUpperCase()!="BUBBLE" && chart_type.getSelectedKey().toUpperCase()!="TABLE" && chart_type.getSelectedKey().toUpperCase().toUpperCase()!="LINE" && chart_type.getSelectedKey().toUpperCase()!="COMBINATION" && chart_type.getSelectedKey().toUpperCase()!="GEOMAP" && chart_type.getSelectedKey().toUpperCase()!="CHOROPLETH")?true:false);
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","isAbsolute")).setVisible((chart_type.getSelectedKey().toUpperCase()!="BUBBLE" &&  chart_type.getSelectedKey().toUpperCase()!="TABLE"&& chart_type.getSelectedKey().toUpperCase().toUpperCase()!="LINE" && chart_type.getSelectedKey().toUpperCase()!="COMBINATION" && chart_type.getSelectedKey().toUpperCase()!="CHOROPLETH")?true:false);
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors")).setVisible(chart_type.getSelectedKey().toUpperCase()!="GEOMAP" && chart_type.getSelectedKey().toUpperCase()!="CHOROPLETH" );
		this.updateSemanticColorComboBox(chart_type.getSelectedKey());
		this._updateMeasureDimensionBindings();
		
		this.getView().getModel('SB_DDACONFIG').setProperty("/AXIS_TYPE","SINGLE");
		this.getView().getModel('SB_DDACONFIG').setProperty("/VALUE_TYPE","ABSOLUTE");
		this.getView().getModel('SB_DDACONFIG').setProperty("/COLOR_SCHEME","NONE");
		
		if(chart_type.getSelectedKey().toUpperCase()=="LINE" || chart_type.getSelectedKey().toUpperCase()=="COMBINATION"||chart_type.getSelectedKey().toUpperCase()=="BUBBLE"||chart_type.getSelectedKey().toUpperCase()=="TABLE")
			this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","openchartsettings")).setEnabled(false);
		else
			this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","openchartsettings")).setEnabled(true);
		if(chart_type.getSelectedKey().toUpperCase()=="CHOROPLETH"){
			if(this.chartMeasures.length < 2){
				this.refreshChart();
			}
			else if(this.chartDimensions.length > 1){
				this.refreshChart();
			}
			else{
				that.choroplethSettingsDialog.open();
			}
		}
		else{
			this.refreshChart();
		}

		this.enableOrDisableSave();
		chart_type.setTooltip(chart_type.getSelectedItem().getText());
	},

	chartTypeInit:function(oEvent){
		var that=this;
		//this.copyConfigSnapshot();
		if (! this._chartTypeConfig) {
			this._chartTypeConfig = sap.ui.xmlfragment("chartTypeConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.chartTypeConfig", this);
		}
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartTypeConfig"));
		var chart_type = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
		if(chart_type.getSelectedKey().toUpperCase()!="BUBBLE")
			this.copyConfigSnapshot();
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setVisible((chart_type.getSelectedKey().toUpperCase()!="BUBBLE" && chart_type.getSelectedKey().toUpperCase()!="TABLE" && chart_type.getSelectedKey().toUpperCase().toUpperCase()!="LINE" && chart_type.getSelectedKey().toUpperCase()!="COMBINATION" && chart_type.getSelectedKey().toUpperCase()!="GEOMAP" && chart_type.getSelectedKey().toUpperCase()!="CHOROPLETH")?true:false);
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","isAbsolute")).setVisible((chart_type.getSelectedKey().toUpperCase()!="BUBBLE" &&  chart_type.getSelectedKey().toUpperCase()!="TABLE"&& chart_type.getSelectedKey().toUpperCase().toUpperCase()!="LINE" && chart_type.getSelectedKey().toUpperCase()!="COMBINATION" && chart_type.getSelectedKey().toUpperCase()!="CHOROPLETH")?true:false);	
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors")).setVisible(chart_type.getSelectedKey().toUpperCase()!="GEOMAP" && chart_type.getSelectedKey().toUpperCase()!="CHOROPLETH" );

		/*if(chart_type.getSelectedKey().toUpperCase()=="CHOROPLETH"){
            this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","choroplethSettingsLink")).setVisible(true);
		}*/
		this.setSemanticColorComboBox(chart_type.getSelectedKey());
		this.refreshChart();
		this.enableOrDisableSave();
	},

	updateSemanticColorComboBox:function(chart_type){
		if (! this._chartTypeConfig) {

			this._chartTypeConfig = sap.ui.xmlfragment("chartTypeConfig","sap.suite.ui.smartbusiness.designtime.drilldown.view.chartTypeConfig", this);

		}
		chart_type = chart_type.toUpperCase();

		var semanticComboBox = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));

		if(chart_type == "BAR" || chart_type=="COLUMN"){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);

			// if stacking by dimension is applied , disable manual coloring .
			if(this.isStackDim) {
				semanticComboBox.setSelectedKey("NONE");
				semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
				semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
				semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);
			}

		}else if(chart_type=="BUBBLE"){
			semanticComboBox.setSelectedKey("NONE");
			semanticComboBox.setVisible(false);

		} else if(chart_type=="TABLE"){

			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			if(!(semanticComboBox.getSelectedKey().toUpperCase() == "NONE" || semanticComboBox.getSelectedKey().toUpperCase() == "AUTO_SEMANTIC"))
				semanticComboBox.setSelectedKey("NONE");
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);

		} else if(chart_type=="CHOROPLETH"){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);
			
			if(this.dda_config.chartConfig.colorScheme == "AUTO_SEMANTIC"){
				semanticComboBox.setSelectedKey("AUTO_SEMANTIC");
				if(!(this.getView().getModel('SB_DDACONFIG').getData().THRESHOLD_MEASURE)){
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_THRESHOLD_MEASURE"));
					return;
				}
			}
			else{
				semanticComboBox.setSelectedKey("NONE");
			}
		} else if(chart_type=="LINE"|| chart_type=="COMBINATION" ){
			semanticComboBox.setSelectedKey("MANUAL_NON_SEMANTIC");
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);
		}

	},

	setSemanticColorComboBox:function(chart_type){
		chart_type = chart_type.toUpperCase();
		var semanticComboBox = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));
		if(chart_type == "BAR" || chart_type=="COLUMN"){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);

			// if stacking by dimension is applied , disable manual coloring .
			if(this.isStackDim) {
				semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
				semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
				semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);
			}

		}else if(chart_type=="BUBBLE"){
			semanticComboBox.setVisible(false);

		} else if(chart_type=="TABLE"){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);

		} else if(chart_type=="CHOROPLETH"){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);
			
			if(this.dda_config.chartConfig.colorScheme == "AUTO_SEMANTIC"){
				semanticComboBox.setSelectedKey("AUTO_SEMANTIC");
				if(!(this.getView().getModel('SB_DDACONFIG').getData().THRESHOLD_MEASURE)){
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_THRESHOLD_MEASURE"));
					return;
				}
			}
			else{
				semanticComboBox.setSelectedKey("NONE");
			}
		} else if(chart_type=="LINE"|| chart_type=="COMBINATION" ){
			semanticComboBox.setVisible(true);
			semanticComboBox.setEnabled(true);
			semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
			semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
			semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);
		}

	},

	formatcolor:function(s){

		return s?sap.ui.core.theming.Parameters.get(s):"transparent";
	},
	formatEditColor:function(s){

		return s?sap.ui.core.theming.Parameters.get(s):"black";
	},
	sortByMeasureVisibility:function(s){
		return s?(s.toUpperCase()=="MEASURE"||s.toUpperCase()=="KPI MEASURE"):false;
	},
	sortByDimensionVisibility:function(s){
		return s?s.toUpperCase()=="DIMENSION":false;
	},
	openAllMeasuresDimension:function(){
		this.copyConfigSnapshot();
		this._oShowMeasureDialog.open();
		var buttonContainer=this._oShowMeasureDialog.getContent()[0];
		buttonContainer.getButtons()[1].firePress();
		if(buttonContainer.getSelectedButton()==buttonContainer.getButtons()[1].getId()){
			this.showDimensionList();
		}else{
			this.showMeasureList();
		}

	},
	_isAddDimensionMode:function(){
		var buttonContainer=this._oShowMeasureDialog.getContent()[0];
		return buttonContainer.getSelectedButton()==buttonContainer.getButtons()[1].getId()
	},
	onMeasureDimensionSearch:function(oEvt){
		var mode=this._isAddDimensionMode()?"DIMENSION":"MEASURE";
		var curList=this._isAddDimensionMode()?this._oDimensionList:this._oMeasureList;
		var filter=[new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.Contains,mode)];
		var sKey = oEvt.getSource().getValue();
		if (sKey && sKey.length > 0) {
			filter.push(new sap.ui.model.Filter("LABEL", sap.ui.model.FilterOperator.StartsWith, sKey));
		}
		var binding = curList.getBinding("items");
		binding.filter(filter);
	},
	onMeasureDimensionAdded:function(){
		//this.refreshChart();
/*		var count = 0;
		for(var i=0;i<this._oDimensionList.getItems().length;i++){
			if(this._oDimensionList.getItems()[i].getContent()[0].getItems()[0].getSelected()==true){
				count++;
			}
		}
*/
		var count = this._oDimensionList.getSelectedItems().length;
		if(this.chartMeasures.length == 0 || count == 0){
			if(this.chartMeasures.length==0){
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: this.getView().getModel("i18n").getProperty("NO_MEASURES")
				});
			}
			if(count==0){
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: this.getView().getModel("i18n").getProperty("SELECT_AT_LEAST_ONE_DIMENSION")
				});
			}
		}
		else{
			this._updateMeasureDimensionBindings();
			this._oShowMeasureDialog.close();
			this.refreshChart();
			this.enableOrDisableSave(); //check for presence of atleast 1 msr or dim, disable save if nothing is selected
		}
	},
	onMeasureDimensionCancel:function(){
		this.restorePrevConfig();
		this._updateMeasureDimensionBindings();
		this._oShowMeasureDialog.close();
	},

	showDimensionList:function(){
		this._oShowMeasureDialog.removeContent(this._oMeasureList);
		this._oShowMeasureDialog.addContent(this._oDimensionList);
		this._oDimensionList.getBinding("items").filter(new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"DIMENSION"));

	},
	showMeasureList:function(){
		this._oShowMeasureDialog.removeContent(this._oDimensionList);
		this._oShowMeasureDialog.addContent(this._oMeasureList);
		this._oMeasureList.getBinding("items").filter(new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE"));

	},
	formatSortOrder:function(s){
		if(s=="asc"){
			return "sap-icon://up"
		}else if(s=="desc"){
			return "sap-icon://down"
		}
		else{
			return "";
		}
	},
	colorButtonVisiblity:function(s,colorMode){
		if(s)
			return (colorMode=="MANUAL_SEMANTIC"||colorMode=="MANUAL_NON_SEMANTIC")&& s.toLowerCase()=='measure';
	},
	colorButton1Visiblity:function(s){
		return s=="MANUAL_NON_SEMANTIC";
	},
	colorButton2Visiblity:function(s){
		return s=="MANUAL_SEMANTIC";
	},
	openChartSettings : function(oEvent){
		var that = this;
		this.copyConfigSnapshot();
		// if dual axis charts chosen .
		if((((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN")) && ((this.dda_config.chartConfig.axis).toUpperCase() === "DUAL")) {
			//sap.ui.core.Fragment.byId("editChartDialog","Dual_config_1").setVisible(true);
			sap.ui.core.Fragment.byId("editChartDialog","Dual_config_2").setVisible(true);
			this.copyStackConfigSnapshot();
			this.setDualStackModel(this.chartMeasures);
		} else {
			sap.ui.core.Fragment.byId("editChartDialog","Dual_config_2").setVisible(false);
		}

		var StackConfig = that.getStacking(that.chartMeasures, that.chartDimensions);
		sap.ui.core.Fragment.byId("editChartDialog","enableStacking").setEnabled(true);
		if (StackConfig.isEnabled) {
			sap.ui.core.Fragment.byId("editChartDialog","enableStacking").setSelected(true);
			sap.ui.core.Fragment.byId("editChartDialog","stackingOptions").setVisible(true);
			if(StackConfig.type === "M") {
				sap.ui.core.Fragment.byId("editChartDialog","addMsrToStack").setSelected(true);
				sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setVisible(false);
			} else if(StackConfig.type === "D") {
				sap.ui.core.Fragment.byId("editChartDialog","addMsrToStack").setSelected(false);
				sap.ui.core.Fragment.byId("editChartDialog","dimStack").setSelected(true);
				sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setVisible(true);
				var oJSONModel = new sap.ui.model.json.JSONModel();
				oJSONModel.setData({STdata:that.chartDimensions});
				sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setModel(oJSONModel);
				var otemplate = new sap.ui.core.Item({
					key: "{name}",
					text: {path:"name",
						   formatter : jQuery.proxy(that.formatMeasureName,that),
					   } 
				});
				sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").bindItems("/STdata",otemplate);
				if(that.getDimensionToBeStacked(that.chartDimensions)) {
					sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setSelectedKey(that.getDimensionToBeStacked(that.chartDimensions).name);
				}
			}
		} else {
			sap.ui.core.Fragment.byId("editChartDialog","enableStacking").setSelected(false);
			sap.ui.core.Fragment.byId("editChartDialog","stackingOptions").setVisible(false);
		}

		// disable stacking option if dual charts / percentage charts :
		if((((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN")) && (((this.dda_config.chartConfig.axis).toUpperCase() === "DUAL") || ((this.dda_config.chartConfig.value).toUpperCase() === "PERCENTAGE"))) {
			sap.ui.core.Fragment.byId("editChartDialog","stackingOptions").setVisible(false);
			sap.ui.core.Fragment.byId("editChartDialog","enableStacking").setSelected(true);
			sap.ui.core.Fragment.byId("editChartDialog","enableStacking").setEnabled(false);
		}
		// disable stacking option for all charts except bar and column :
		if(!(((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN"))) {
			sap.ui.core.Fragment.byId("editChartDialog","stackingOptions").setVisible(false);
			sap.ui.core.Fragment.byId("editChartDialog","enableStacking").setVisible(false);
		}
		else{
			sap.ui.core.Fragment.byId("editChartDialog","enableStacking").setVisible(true);
		}
		
		if((this.dda_config.chartConfig.colorScheme).toUpperCase() === "AUTO_SEMANTIC" || (this.dda_config.chartConfig.type).toUpperCase() === "CHOROPLETH"){
			var filters=[];
			var filterObject;
			if((this.dda_config.chartConfig.type).toUpperCase() === "CHOROPLETH"){
				sap.ui.core.Fragment.byId("editChartDialog","messageAddThresholdMeasure").setVisible(false);
				//sap.ui.core.Fragment.byId("editChartDialog","Dual_config_1").setVisible(false);
				sap.ui.core.Fragment.byId("editChartDialog","Dual_config_2").setVisible(false);
				sap.ui.core.Fragment.byId("editChartDialog","ThresholdMeasureSettings").setVisible(true);
				sap.ui.core.Fragment.byId("editChartDialog","MainMeasureSettings").setVisible(true);
				var filterObject = {
						"type": (new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE")),
						"name": (new sap.ui.model.Filter("NAME",sap.ui.model.FilterOperator.NE,sap.ui.core.Fragment.byId("editChartDialog","choroplethKpiMeasurechartsetting").getSelectedKey())),
						"selected": (new sap.ui.model.Filter("SELECTED", sap.ui.model.FilterOperator.EQ,true)),
				};
				var aFilterMeasure = [new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE"),new sap.ui.model.Filter("SELECTED",sap.ui.model.FilterOperator.EQ,true)];
				sap.ui.core.Fragment.byId("editChartDialog","choroplethKpiMeasurechartsetting").getBinding('items').filter(new sap.ui.model.Filter(aFilterMeasure,true));
			}
			else{
				sap.ui.core.Fragment.byId("editChartDialog","MainMeasureSettings").setVisible(false);
				sap.ui.core.Fragment.byId("editChartDialog","ThresholdMeasureSettings").setVisible(true);
				var filterObject = {
						"type": (new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE")),
//						"name": (new sap.ui.model.Filter("NAME",sap.ui.model.FilterOperator.NE,this.DDA_MODEL.EVALUATION_DATA.COLUMN_NAME)),   // commenting this to include kpi measure in the dropdown
						"selected": (new sap.ui.model.Filter("SELECTED", sap.ui.model.FilterOperator.EQ,true)),
				};
			}

			for(var item in filterObject) {
				filters.push(filterObject[item]);
			}
			var selectionBox=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("editChartDialog","thresholdMeasureChart"));
			var selectionItems= selectionBox.getItems()?selectionBox.getItems():[];
			if(selectionItems.length && selectionBox.getBinding('items')) {
				selectionBox.getBinding('items').filter(filters);
			}
			if(this._oModel.getData().THRESHOLD_MEASURE)  
				selectionBox.setSelectedKey(this._oModel.getData().THRESHOLD_MEASURE); 
				selectionBox.setTooltip(this._oModel.getData().THRESHOLD_MEASURE);
		}
		else{
			sap.ui.core.Fragment.byId("editChartDialog","ThresholdMeasureSettings").setVisible(false);
			sap.ui.core.Fragment.byId("editChartDialog","MainMeasureSettings").setVisible(false);
		}

/*		if(bindingContext.getObject().TYPE.toUpperCase()=="MEASURE") {
			sap.ui.core.Fragment.byId("editChartDialog","useAsThreshold").setVisible(true);     
			if(bindingContext.getObject().NAME === that._oModel.getData().THRESHOLD_MEASURE)
				sap.ui.core.Fragment.byId("editChartDialog","useAsThreshold").setSelected(true);     
			else
				sap.ui.core.Fragment.byId("editChartDialog","useAsThreshold").setSelected(false);     
		} else if(bindingContext.getObject().TYPE.toUpperCase()=="DIMENSION") {
			sap.ui.core.Fragment.byId("editChartDialog","useAsThreshold").setVisible(false);          
		}*/
		this._editChartDialog.open();
	},
	
	onEditIconPress:function(oEvent){
		var that = this;
		this.copyConfigSnapshot();
		var bindingContext=oEvent.getSource().getBindingContext("SB_DDACONFIG");

		this.columnBeingEdited = bindingContext.getObject();

		this._editMeasureDialog.bindElement(bindingContext.getPath());

		if(bindingContext.getObject().TYPE.toLowerCase()=="kpi measure"){
			sap.ui.core.Fragment.byId("editDialog","typeOf").setText(this.getView().getModel("i18n").getProperty("KPI_MEASURE"));
		}

		// showing fields relevant to measure or dimension :
		if(bindingContext.getObject().VISIBILITY.toUpperCase() === "CHART")
			sap.ui.core.Fragment.byId("editDialog","hideInTable").setSelected(true);
		else
			sap.ui.core.Fragment.byId("editDialog","hideInTable").setSelected(false);              

		sap.ui.core.Fragment.byId("editDialog","allMeasures").setTooltip(sap.ui.core.Fragment.byId("editDialog","allMeasures").getSelectedItem().getText());
		sap.ui.core.Fragment.byId("editDialog","allDimensions").setTooltip(sap.ui.core.Fragment.byId("editDialog","allDimensions").getSelectedItem().getText());
		sap.ui.core.Fragment.byId("editDialog","sortOrder").setTooltip(sap.ui.core.Fragment.byId("editDialog","sortOrder").getSelectedItem().getText());
		this._editMeasureDialog.open();
	},

	onEnableStacking: function() {
		var isChecked = sap.ui.core.Fragment.byId("editChartDialog","enableStacking").getSelected();
		if(isChecked) {
			sap.ui.core.Fragment.byId("editChartDialog","stackingOptions").setVisible(true);
		} else {
			sap.ui.core.Fragment.byId("editChartDialog","stackingOptions").setVisible(false);
		}
	},

	onMsrStacking: function() {
		if(sap.ui.core.Fragment.byId("editChartDialog","addMsrToStack").getSelected()) {
			sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setVisible(false);
		}
	},

	onDimStacking: function() {
		var that = this;
		if(sap.ui.core.Fragment.byId("editChartDialog","dimStack").getSelected()) {
			sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setVisible(true);
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData({STdata:that.chartDimensions});
			sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setModel(oJSONModel);
			var otemplate = new sap.ui.core.Item({
				key: "{name}",
				text: {path:"name",
					   formatter : jQuery.proxy(that.formatMeasureName,that),
				   } 
			});
			sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").bindItems("/STdata",otemplate);
			if(that.getDimensionToBeStacked(that.chartDimensions)) {
				sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setSelectedKey(that.getDimensionToBeStacked(that.chartDimensions).name);
				sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setTooltip(this.COLUMN_LABEL_MAPPING[that.getDimensionToBeStacked(that.chartDimensions).name]);
			}
			else {
				sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setTooltip(this.COLUMN_LABEL_MAPPING[that.chartDimensions[0].name]);
			}
		} else {
			sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").setVisible(false);
		}
	},

	onAfterRendering : function() {
		this._fixSplitterHeight();
		sap.ui.Device.resize.attachHandler(this._fixSplitterHeight,this);
	},
	_fixSplitterHeight : function() {
		var _height = $(window).height();
		var _headerHeight = 48;
		var _footerHeight = 49;
		this.byId('splitContainer').$().css("height",(_height-(_headerHeight + _footerHeight + _headerHeight))+"px");
	},

	onEditChartDialogOk : function(oEvent){
		var that = this;

		if(sap.ui.core.Fragment.byId("editChartDialog","enableStacking").getSelected()) {                                                   // setting stacking options   
			if(sap.ui.core.Fragment.byId("editChartDialog","addMsrToStack").getSelected()) {
				that.setStacking(true, "M", that._oModel.getData().items);
				var semanticComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));     
				var chartTypeComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
				if(chartTypeComboBox.getSelectedKey().toUpperCase() == "BAR" || chartTypeComboBox.getSelectedKey().toUpperCase()=="COLUMN") {
					// semanticComboBox.setSelectedKey("NONE");
					semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
					semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
					semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);                    
				}
			} else if(sap.ui.core.Fragment.byId("editChartDialog","dimStack").getSelected()) {
				var oDim = sap.ui.core.Fragment.byId("editChartDialog","dimsToStack").getSelectedKey();
				that.setStacking(true, "D", that._oModel.getData().items);
				that.setDimensionToBeStacked(that._oModel.getData().items, oDim);
				var semanticComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));     
				var chartTypeComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
				if(chartTypeComboBox.getSelectedKey().toUpperCase() == "BAR" || chartTypeComboBox.getSelectedKey().toUpperCase()=="COLUMN") {
					semanticComboBox.setSelectedKey("NONE");
					semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
					semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
					semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);                    
				}
			}
		} else {
			that.setStacking(false, "N", that._oModel.getData().items);
			var semanticComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));     
			var chartTypeComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
			if(chartTypeComboBox.getSelectedKey().toUpperCase() == "BAR" || chartTypeComboBox.getSelectedKey().toUpperCase()=="COLUMN") {
				// semanticComboBox.setSelectedKey("NONE");
				semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
				semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
				semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);                    
			}
		}

		// dual axis config setting :
		if((((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN")) && ((this.dda_config.chartConfig.axis).toUpperCase() === "DUAL")) {

			var tmpData = this._oModel.getData();           
			for(var i=0;i<tmpData.items.length;i++){
				if(tmpData.items[i].TYPE.toUpperCase() === "MEASURE") {
					tmpData.items[i].AXIS = 1;              
					for(var j=0;j<that.chartMeasures.length;j++) {
						if(tmpData.items[i].NAME === that.chartMeasures[j].name) {
							tmpData.items[i].AXIS = that.chartMeasures[j].axis ;
							break;
						}
					}
				}
			}
			this._oModel.setData(tmpData);
//			}
		}
		if((this.dda_config.chartConfig.type).toUpperCase() == "CHOROPLETH"){
			var choroplethKpiMeasureSelected = sap.ui.core.Fragment.byId("choroplethSettingsDialog","choroplethKpiMeasure").getSelectedKey();
			var choroplethThresholdMeasureSelected = sap.ui.core.Fragment.byId("choroplethSettingsDialog","choroplethThresholdMeasure").getSelectedKey();
			this.updateMeasuresAndDimensionsInmodel(choroplethKpiMeasureSelected, choroplethThresholdMeasureSelected);
		}
		this.copyConfigSnapshot();
		this._updateMeasureDimensionBindings();
		this.refreshChart();
		this._editChartDialog.close();
	},
	onEditChartDialogCancel : function(oEvent){
		this.restorePrevConfig();
		if((((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN")) && ((this.dda_config.chartConfig.axis).toUpperCase() === "DUAL")) {
			this.restoreStackPrevConfig();
		}
		this._updateMeasureDimensionBindings();
		this._editChartDialog.close();
	},
	onEditDialogOk:function(oEvent){
		var that = this;
		// updating the model
		var bindingContext=oEvent.getSource().getBindingContext("SB_DDACONFIG");

		if(sap.ui.core.Fragment.byId("editDialog","hideInTable").getSelected()) {                                                     // hide in table
			that.updateColumnProperty(that._oModel.getData().items, that.columnBeingEdited.NAME, "VISIBILITY", "CHART");
		} else {
			that.updateColumnProperty(that._oModel.getData().items, that.columnBeingEdited.NAME, "VISIBILITY", "BOTH");
		}

/*		if(that.columnBeingEdited.TYPE.toUpperCase() === "MEASURE") {                                                            // setting threshold measure
			if(sap.ui.core.Fragment.byId("editDialog","useAsThreshold").getSelected()) {
				that._oModel.getData().THRESHOLD_MEASURE = that.columnBeingEdited.NAME ;
			}
			else {
				if(that.columnBeingEdited.NAME === that._config.THRESHOLD_MEASURE) {
					that._oModel.getData().THRESHOLD_MEASURE = "";
				}
			}
		}*/

		/*if(sap.ui.core.Fragment.byId("editDialog","enableStacking").getSelected()) {                                                   // setting stacking options   
			if(sap.ui.core.Fragment.byId("editDialog","addMsrToStack").getSelected()) {
				that.setStacking(true, "M", that._oModel.getData().items);
				var semanticComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));     
				var chartTypeComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
				if(chartTypeComboBox.getSelectedKey().toUpperCase() == "BAR" || chartTypeComboBox.getSelectedKey().toUpperCase()=="COLUMN") {
					// semanticComboBox.setSelectedKey("NONE");
					semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
					semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
					semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);                    
				}
			} else if(sap.ui.core.Fragment.byId("editDialog","dimStack").getSelected()) {
				var oDim = sap.ui.core.Fragment.byId("editDialog","dimsToStack").getSelectedKey();
				that.setStacking(true, "D", that._oModel.getData().items);
				that.setDimensionToBeStacked(that._oModel.getData().items, oDim);
				var semanticComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));     
				var chartTypeComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
				if(chartTypeComboBox.getSelectedKey().toUpperCase() == "BAR" || chartTypeComboBox.getSelectedKey().toUpperCase()=="COLUMN") {
					semanticComboBox.setSelectedKey("NONE");
					semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(false);
					semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(false);
					semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(false);                    
				}
			}
		} else {
			that.setStacking(false, "N", that._oModel.getData().items);
			var semanticComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));     
			var chartTypeComboBox = that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType"));
			if(chartTypeComboBox.getSelectedKey().toUpperCase() == "BAR" || chartTypeComboBox.getSelectedKey().toUpperCase()=="COLUMN") {
				// semanticComboBox.setSelectedKey("NONE");
				semanticComboBox.getItemByKey("AUTO_SEMANTIC").setEnabled(true);
				semanticComboBox.getItemByKey("MANUAL_NON_SEMANTIC").setEnabled(true);
				semanticComboBox.getItemByKey("MANUAL_SEMANTIC").setEnabled(true);                    
			}
		}

		// dual axis config setting :
		if((((this.dda_config.chartConfig.type).toUpperCase() === "BAR") || ((this.dda_config.chartConfig.type).toUpperCase() === "COLUMN")) && ((this.dda_config.chartConfig.axis).toUpperCase() === "DUAL")) {
			var axis1 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("editDialog","AxisMsr1_edit"));
			var axis2 = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("editDialog","AxisMsr2_edit"));
			if(axis1.getSelectedKey() === axis2.getSelectedKey()) {
//				var alert_text = "Please choose a different measure for each axis .";
//				sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("SAME_MEASURE_CHOSEN_FOR_BOTH_AXES"));     
				jQuery.sap.log.error("Same measure chosen for both axes");
			} //else {
			var tmpData = this._oModel.getData();           
			for(var i=0;i<tmpData.items.length;i++){
				if(tmpData.items[i].TYPE.toUpperCase() === "MEASURE") {
					tmpData.items[i].AXIS = 2;              
					for(var j=0;j<that.chartMeasures.length;j++) {
						if(tmpData.items[i].NAME === that.chartMeasures[j].name) {
							tmpData.items[i].AXIS = that.chartMeasures[j].axis ;
							break;
						}
					}
				}
			}
			this._oModel.setData(tmpData);
//			}
		}*/

		this._updateMeasureDimensionBindings();
		this._editMeasureDialog.close();
		this.refreshChart();
	},
	onEditDialogCancel:function(){
		this.restorePrevConfig();
		this._updateMeasureDimensionBindings();
		this._editMeasureDialog.close();
	},
	_getColorPaletteTemplate:function(oButton){

		var iconTemplate= new sap.ui.core.Icon({
			color:{
				path:"SB_DDACONFIG>color",
				formatter:this.formatcolor
			},
			src:"sap-icon://color-fill",
			size:"32px",
			width:"5%",
			press:function(e){
				var colorType=oButton.getModel("SB_DDACONFIG").getProperty("/COLOR_SCHEME");
				colorType=(colorType=="MANUAL_NON_SEMANTIC")?"COLOR1":(colorType=="MANUAL_SEMANTIC")?"COLOR2":"";
				oButton.getBindingContext().getObject()[colorType]=this.getBindingContext("SB_DDACONFIG").getProperty("color");
				oButton.getModel().refresh();
			}
		});
		var colorCategory= new sap.m.Label({
			text:{
				path:"SB_DDACONFIG>index",
				formatter:function(ind){
					var text="";
					switch(ind){
					case 1 : text="Neutral";break;
					case 4    : text="Good";break;
					case 7:   text="Warning";break;
					case 10: text="Bad";
					}
					return text;
				}
			},
			visible:{
				path:"SB_DDACONFIG>/COLOR_SCHEME",
				formatter:function(s){return s=="MANUAL_SEMANTIC"}
			}
		})
		return new sap.m.HBox({items:[iconTemplate,colorCategory]});

	},
	showColorPopUp:function(oEvent){
		var chosenColor;
		var oButton = oEvent.getSource();
		var colorScheme=this._oModel.getProperty("/COLOR_SCHEME");
		var colorsVerticalLayout = new sap.m.VBox();
		colorsVerticalLayout.bindAggregation("items","SB_DDACONFIG>/"+colorScheme,this._getColorPaletteTemplate(oButton));
		var colorPopup = new sap.m.Popover({
			visible:{
				path:"SB_DDACONFIG>/COLOR_SCHEME",
				formatter:function(s){return s=="MANUAL_SEMANTIC"||s=="MANUAL_NON_SEMANTIC";}
			},
			showHeader:false,
			content:[ colorsVerticalLayout],

		});
		colorPopup.setModel(this._oModel,"SB_DDACONFIG");
		colorPopup.openBy(oButton);  
	},

	onEditDialogCloseButton:function(){
		this._editMeasureDialog.close();
	},

	onSingleDualChange: function(){
		var that=this;
		var selectedAxis = ((this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual"))).getSelectedKey()).toUpperCase() ;
		this.byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setTooltip(this.byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).getSelectedItem().getText());
		switch(selectedAxis) {
		case "SINGLE":
			if(!(this.prevStack && this.prevStack.isEnabled)) {
				this.setStacking(false, "N", that._oModel.getData().items);
			}
			this.refreshChart();
			break;
		case "DUAL":
			if(this.chartMeasures.length < 2) {
				sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("DUAL_AXIS_CHART_MIN_MEASURE"),{onClose:function(){
					that.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setSelectedKey("SINGLE");
				}});                    
			} else {
				// to get stacking info for previous single axis chart :
				this.prevStack = this.getStacking(this.chartMeasures,this.chartDimensions);	

				// if dual chart is chosen , disable stacking by dimension :        
				this.setStacking(true, "M", this._oModel.getData().items);
				this.copyStackConfigSnapshot();
				this.dualStackValue(this.chartMeasures);
				this.setDualStackModel(this.chartMeasures);
				
				this._dualAxisConfig.open();               
			}
			break;
		default:
			break;
		}
	},
	setDualStackModel : function(measures){
		var that = this;
		var dualMsr = this.getMeasuresByAxis(measures);
		
		var DualModelStack1 = new sap.ui.model.json.JSONModel();
		DualModelStack1.setData({DATA: dualMsr.axis1.objArr});
		this._dualAxisConfig.setModel(DualModelStack1,"DUAL_AXIS1");
		this._editChartDialog.setModel(DualModelStack1,"DUAL_AXIS1");
		
		
		var DualModelStack2 = new sap.ui.model.json.JSONModel();
		DualModelStack2.setData({DATA: dualMsr.axis2.objArr});
		this._dualAxisConfig.setModel(DualModelStack2,"DUAL_AXIS2");
		this._editChartDialog.setModel(DualModelStack2,"DUAL_AXIS2");
		
		sap.ui.core.Fragment.byId("dualAxisConfig","stack1list").setText("");
		sap.ui.core.Fragment.byId("editChartDialog","stack1list_edit").setText("");
		sap.ui.core.Fragment.byId("dualAxisConfig","stack2list").setText("");
		sap.ui.core.Fragment.byId("editChartDialog","stack2list_edit").setText("");
		
		sap.ui.core.Fragment.byId("dualAxisConfig","stack1list").setText("(" + dualMsr.axis1.objArr.length + ")");
		sap.ui.core.Fragment.byId("editChartDialog","stack1list_edit").setText("(" + dualMsr.axis1.objArr.length + ")");
		sap.ui.core.Fragment.byId("dualAxisConfig","stack2list").setText("(" + dualMsr.axis2.objArr.length + ")");
		sap.ui.core.Fragment.byId("editChartDialog","stack2list_edit").setText("(" + dualMsr.axis2.objArr.length + ")");
	},
	
	copyStackConfigSnapshot:function(){
		this._stackConfig = this._cloneObj(this.chartMeasures);
	},
	restoreStackPrevConfig:function(){
		this.chartMeasures = this._stackConfig;
		this.setDualStackModel(this._stackConfig);
	},
	
	stack1removed : function(oEvent){
		var removed = new sap.ui.model.Context(this._dualAxisConfig.getModel("DUAL_AXIS1"),oEvent.getSource().getBindingContextPath()).getProperty();
		var that = this;
		if(oEvent.getSource().getModel("DUAL_AXIS1").getData().DATA.length === 1){
			sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("STACK_ERROR_MSG"));
		} else {
		for(var i=0;i<that.chartMeasures.length;i++) {           
				if(that.chartMeasures[i].name === removed.name) {
					that.chartMeasures[i].axis = 2;
				}
			}
		this.setDualStackModel(this.chartMeasures);
		}
	},
	
	stack2removed : function(oEvent){
		var removed = new sap.ui.model.Context(this._dualAxisConfig.getModel("DUAL_AXIS2"),oEvent.getSource().getBindingContextPath()).getProperty();
		var that = this;
		if(oEvent.getSource().getModel("DUAL_AXIS2").getData().DATA.length === 1){
			sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("STACK_ERROR_MSG"));
		} else {
		for(var i=0;i<that.chartMeasures.length;i++) {           
				if(that.chartMeasures[i].name === removed.name) {
					that.chartMeasures[i].axis = 1;
				}
			}
		this.setDualStackModel(this.chartMeasures);
		
		}
	},
	onDualAxisDialogOk: function(){
		var that=this;

		var tmpData = this._oModel.getData();           
		for(var i=0;i<tmpData.items.length;i++){
			if(tmpData.items[i].TYPE.toUpperCase() === "MEASURE") {
				tmpData.items[i].AXIS = 1;              
				for(var j=0;j<that.chartMeasures.length;j++) {
					if(tmpData.items[i].NAME === that.chartMeasures[j].name) {
						tmpData.items[i].AXIS = that.chartMeasures[j].axis ;
						break;
					}
				}
			}
		}
		this._oModel.setData(tmpData);        
		this.refreshChart();
		this._dualAxisConfig.close();
	},

	onDualAxisDialogCancel: function(){
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","singleDual")).setSelectedKey("SINGLE");
		this.restoreStackPrevConfig();
		this._dualAxisConfig.close();
	},

	formatAxisToBool: function(a) {
		if(a === 1)
			return true;
		else
			return false;
	},

	openMsrDialogForStack1: function() {
		var that = this;
		if (! this._msrDialogForStack1) {
			this._msrDialogForStack1 = sap.ui.xmlfragment("msrDialogForStack1","sap.suite.ui.smartbusiness.designtime.drilldown.view.msrDialogForStack1", this);
		}

		var Stack1Model = new sap.ui.model.json.JSONModel();
		Stack1Model.setData({DATA: that.chartMeasures});
		this._msrDialogForStack1.setModel(Stack1Model);
		this._msrDialogForStack1.open();
	},

	onSearchInStack1SelectDialog: function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sValue);
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter([oFilter]);
	},

	onStack1SelectDialogOK: function(oEvent) {
		var that=this;
		var aContexts = oEvent.getParameter("selectedItems");
		if(!(aContexts.length)) {
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that._oTextsModel.getResourceBundle().getText("SELECT_MEASURE_FOR_AXIS",1));
			}
		else if(aContexts.length == that.chartMeasures.length){
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that._oTextsModel.getResourceBundle().getText("STACK_ALL_MEASURES"));
			}
		else {
			for(var i=0;i<that.chartMeasures.length;i++) {
				that.chartMeasures[i].axis = 1;            
				for(var j=0;j<aContexts.length;j++) {
					if(that.chartMeasures[i].name === aContexts[j].getTitle()) {
						that.chartMeasures[i].axis = 2;
						break;
					}
				}
			}
			oEvent.getSource().getBinding("items").filter([]);
			var dualMsr = this.getMeasuresByAxis(this.chartMeasures);
			sap.ui.core.Fragment.byId("dualAxisConfig","stack1MsrsLabel").setText(dualMsr.axis1.nameArr.join(","));
			sap.ui.core.Fragment.byId("dualAxisConfig","stack2MsrsLabel").setText(dualMsr.axis2.nameArr.join(","));          
			if(dualMsr.axis1.nameArr.length) {sap.ui.core.Fragment.byId("dualAxisConfig","AxisMsr1").setSelectedKey(dualMsr.axis1.nameArr[0])};
			if(dualMsr.axis2.nameArr.length) {sap.ui.core.Fragment.byId("dualAxisConfig","AxisMsr2").setSelectedKey(dualMsr.axis2.nameArr[0])};

			sap.ui.core.Fragment.byId("editChartDialog","stack1MsrsLabel_edit").setText(dualMsr.axis1.nameArr.join(","));
			sap.ui.core.Fragment.byId("editChartDialog","stack2MsrsLabel_edit").setText(dualMsr.axis2.nameArr.join(","));          
			if(dualMsr.axis1.nameArr.length) {sap.ui.core.Fragment.byId("editChartDialog","AxisMsr1_edit").setSelectedKey(dualMsr.axis1.nameArr[0])};
			if(dualMsr.axis2.nameArr.length) {sap.ui.core.Fragment.byId("editChartDialog","AxisMsr2_edit").setSelectedKey(dualMsr.axis2.nameArr[0])};
		}          
	},

	onStack1SelectDialogCancel: function() {

	},

	onDataModeChange: function() {
		this.refreshChart();
		var datalimit = this.getView().byId("chartDataMode");
		datalimit.setTooltip(datalimit.getSelectedItem().getText());
	},

	onIsAbsoluteChange: function(){
		var valueType = ((this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","isAbsolute"))).getSelectedKey()).toUpperCase() ;
		// if percentage is chosen , disable stacking by dimension :
		if(valueType === "PERCENTAGE")
			this.setStacking(true, "M", this._oModel.getData().items);
		this.refreshChart();
		this.byId(sap.ui.core.Fragment.createId("chartTypeConfig","isAbsolute")).setTooltip(this.byId(sap.ui.core.Fragment.createId("chartTypeConfig","isAbsolute")).getSelectedItem().getText());
	},

	onSemanticColorOptionChange: function(){

		var that = this;

		var semanticColorSelect = this.byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors"));
		semanticColorSelect.setTooltip(semanticColorSelect.getSelectedItem().getText());
		
		if(this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors")).getSelectedKey()=="AUTO_SEMANTIC"){
			if(this.chartMeasures.length >= 2){

				if(!(this.dda_config.chartConfig.type.toUpperCase() == "CHOROPLETH" && this.getView().getModel('SB_DDACONFIG').getData().THRESHOLD_MEASURE)){
					var filters=[];
					var filterObject = {
							"type": (new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE")),
//							"name": (new sap.ui.model.Filter("NAME",sap.ui.model.FilterOperator.NE,this.DDA_MODEL.EVALUATION_DATA.COLUMN_NAME)),   // commenting this to include kpi measure in the dropdown
							"selected": (new sap.ui.model.Filter("SELECTED", sap.ui.model.FilterOperator.EQ,true)),
					};
					for(var item in filterObject) {
						filters.push(filterObject[item]);
					}
					var selectionBox=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("thresholdDialog","thresholdMeasure"));
					var selectionItems= selectionBox.getItems()?selectionBox.getItems():[];
					if(selectionItems.length && selectionBox.getBinding('items')) {
						selectionBox.getBinding('items').filter(filters);
					}
					if(this._oModel.getData().THRESHOLD_MEASURE)  
						selectionBox.setSelectedKey(this._oModel.getData().THRESHOLD_MEASURE); 
					this.addThresholdMeasureDialog.open();
					if(selectionBox && selectionBox.getSelectedItem()) {
						selectionBox.setTooltip(selectionBox.getSelectedItem().getText());
					}
					return;
				}
			}
		}
		this.refreshChart();
	},
	onThresholdMeasureAdded:function(){
		var threshold = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("thresholdDialog","thresholdMeasure")).getSelectedKey();
		this.updateMeasuresAndDimensionsInmodel(this.getView().getModel('SB_DDACONFIG').getData().MAIN_MEASURE, threshold);
		this.copyConfigSnapshot();
		this.refreshChart();
		this.addThresholdMeasureDialog.close();

	},
	onThresholdMeasureCancel:function(){
		this.addThresholdMeasureDialog.close();

	},

	/******* methods for Chart Name Additional Languages : BEGIN ************/
	//utility fn
	getLAISOfromSPRAS: function(key) {
		var allLangs = this.getView().getModel('SB_DDACONFIG').getData().ALL_LANGUAGES;
		for(var i = 0; i < allLangs.length; ++i) {
			if(allLangs[i]["SPRAS"] == key)
				return allLangs[i]["LAISO"];
		}
	},
	//utilify fn: gives the index of duplicate if exists, else returns -1. @param data. @param SAP_LANGUAGE_KEY.
	getIndexOfDuplicate: function(data, lang){
		for(var i = 0; i < data.length; ++i) {
			if(data[i]["SAP_LANGUAGE_KEY"] == lang)
				return i; //duplicate at position i
		}
		//no duplicate
		return -1;
	},

	openAdditionalLanguagesDialog: function() {
		var self = this;
		this.AdditionalLanguagesDialog.setModel(this._oTextsModel,"i18n");
		//take a copy of model incase the user needs to cancel
		this.copyConfigSnapshot();
		//reset input field as blank
		sap.ui.core.Fragment.byId("additionalLanguageDialog", "newTitle").setValue("")
		var ALTable = sap.ui.core.Fragment.byId("additionalLanguageDialog", "ALTable");
		ALTable.bindAggregation("items", "SB_DDACONFIG>/ADDITIONAL_LANGUAGE_TITLES", new sap.m.ColumnListItem({
			cells:[
			       new sap.m.Label({text: "{SB_DDACONFIG>TEXT}"}),
			       new sap.m.Label({text: {path: "SB_DDACONFIG>SAP_LANGUAGE_KEY", formatter: function(s){return self.getLAISOfromSPRAS(s)}}}),
			       new sap.ui.core.Icon({src: "sap-icon://decline", press: this.deleteEntry})
			       ],
			       //text in locale language not to be shown
			       visible: {
			    	   path: "SB_DDACONFIG>SAP_LANGUAGE_KEY",
			    	   formatter: function(s){
			    		   return s != self._oModel.getData()["CURRENT_LANGUAGE"]
			    	   }
			       }
		}));
		this.AdditionalLanguagesDialog.open();
		return;
	},

	closeAdditionalLanguagesDialog_OK: function(evt) {
		//set the clipboard variable since OK pressed
		this.copyConfigSnapshot();
		this.AdditionalLanguagesDialog.close();
		return;
	},

	closeAdditionalLanguagesDialog_Cancel: function(evt) {
		//restore to the model copied when dialog is open
		this.restorePrevConfig();
		this.AdditionalLanguagesDialog.close();
		return;
	},
	
	formatAdditionalLanguageLink : function(sValue){
		return this.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+sValue+")";
	},



	deleteEntry: function(evt) {
		var bindingPath = evt.getSource().getParent().getBindingContextPath();
		var index = parseInt(bindingPath.split("/").pop());
		var ALTable = sap.ui.core.Fragment.byId("additionalLanguageDialog", "ALTable");
		//remove the entry from model
		ALTable.getModel("SB_DDACONFIG").getData()["ADDITIONAL_LANGUAGE_TITLES"].splice(index, 1);
		ALTable.getModel("SB_DDACONFIG").getData().NO_OF_ADDITIONAL_LANGUAGES = ALTable.getModel("SB_DDACONFIG").getData().NO_OF_ADDITIONAL_LANGUAGES - 1;
		ALTable.getModel("SB_DDACONFIG").refresh();
		return;
	},

	addEntry: function() {
		var newTitle = sap.ui.core.Fragment.byId("additionalLanguageDialog", "newTitle").getValue();
		var newTitleLanguage = sap.ui.core.Fragment.byId("additionalLanguageDialog", "newTitleLanguage").getSelectedKey();

		//die silently if both not valid
		if (newTitle && newTitleLanguage) {} else return;

		var ALTable = sap.ui.core.Fragment.byId("additionalLanguageDialog", "ALTable");
		var tableData = ALTable.getModel("SB_DDACONFIG").getData();
		//add entry to the model
		var newEntry = {
				EVALUATION_ID : this.DDA_MODEL.getConfigurator().evaluationId,
				CONFIGURATION_ID : this._oModel.getData().SELECTED_VIEW || this._oModel.getData().ID,
				SAP_LANGUAGE_KEY : newTitleLanguage,
				TEXT : newTitle,
				IS_ACTIVE : this._oModel.getData()["IS_ACTIVE"] || 1
		};
		var index;
		if((index = this.getIndexOfDuplicate(tableData["ADDITIONAL_LANGUAGE_TITLES"], newTitleLanguage)) == -1)
			tableData["ADDITIONAL_LANGUAGE_TITLES"].push(newEntry);
		else {
			tableData["ADDITIONAL_LANGUAGE_TITLES"].splice(index, 1);
			tableData["ADDITIONAL_LANGUAGE_TITLES"].push(newEntry);
		}
		ALTable.getModel("SB_DDACONFIG").getData().NO_OF_ADDITIONAL_LANGUAGES = ALTable.getModel("SB_DDACONFIG").getData().NO_OF_ADDITIONAL_LANGUAGES + 1;
		ALTable.getModel("SB_DDACONFIG").refresh();
		return;
	},
	formatName:function(a,b){
		return a+" "+b;
	},

	formatColorForMap : function(main_measure,threshold_measure){
		var semanticColorOption = this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors")).getSelectedKey();
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

	/******* methods for Chart Name Additional Languages : END ************/

//	All Chart Refresh Functions :

	refreshChart: function() {

		var oController = this ;
		var vizVbox = this.getView().byId("viz_vbox");
		var choroplethVbox = this.getView().byId("choropleth_vbox");
		var geoDimensionForChoropleth,mainMeasureForChoropleth,thresholdMeasureForChoropleth = null;
		// for checking proper configuration while saving .
		this.canSave = false;
		
		this.oChartDataModel = new sap.ui.model.json.JSONModel() ;
		this.oChartData = [] ;

		var tmpData = this._oModel.getData();
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
		for(var i=0;i<tmpData.items.length;i++) {
			this.dda_config.columnsConfig.push({
				name: tmpData.items[i].NAME,
				type: tmpData.items[i].TYPE,
				selected: tmpData.items[i].SELECTED || false,
				visibility: tmpData.items[i].VISIBILITY || "BOTH",
				sortOrder: tmpData.items[i].SORT_ORDER || "NONE",
				sortBy: tmpData.items[i].SORT_BY || "",
				axis: tmpData.items[i].AXIS || 2,
				stacking: tmpData.items[i].STACKING || 0,
				color:tmpData.COLOR_SCHEME=="MANUAL_NON_SEMANTIC"?tmpData.items[i].COLOR1:tmpData.COLOR_SCHEME=="MANUAL_SEMANTIC"?tmpData.items[i].COLOR2:""
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
			if(this.dda_config.columnsConfig[i].selected) {
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
			var mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(this._oModel.getData().QUERY_SERVICE_URI,this._oModel.getData().QUERY_ENTITY_SET); 
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
						
	},  

	plotMapForChoropleth : function(){
		var oController = this ;
		var vizVbox = this.getView().byId("viz_vbox");
		var choroplethVbox = this.getView().byId("choropleth_vbox");
		var geoDimensionForChoropleth,mainMeasureForChoropleth,thresholdMeasureForChoropleth = null;

		if(this.chartMeasures.length < 2){
			sap.m.MessageBox.alert(oController._oTextsModel.getResourceBundle().getText("CHOROPLETH_CHART_MIN_MEASURE"),{onClose:function(){
				if(oController._config){
					oController.restorePrevConfig();
				}
				else{
					oController.restoreFromConfigMasterSnapShot();
				}
					oController.onChartTypeChange();
					oController.refreshChart();
				
				}});
			return;
		}
		else if(this.chartDimensions.length > 1){
			sap.m.MessageBox.alert(oController._oTextsModel.getResourceBundle().getText("CHOROPLETH_CHART_MIN_DIMENSION"),{onClose:function(){
				if(oController._config){
					oController.restorePrevConfig();
				}
				else{
					oController.restoreFromConfigMasterSnapShot();
				}
					oController.onChartTypeChange();
					oController.refreshChart();
				
				}});
			return;
		}

		vizVbox.setVisible(false);
		choroplethVbox.setVisible(true);
		choroplethVbox.removeAllItems();
		this.oModelForMap = new sap.ui.model.json.JSONModel();

		var items = this.getView().getModel("SB_DDACONFIG").getData().items;
		var itemsLength = items.length;
		var measuresArray = [];
		for(var i=0;i<itemsLength;i++){
			if(items[i].TYPE=='MEASURE' && items[i].SELECTED==true){
				if(items[i].MAIN_MEASURE){
					this.getView().getModel("SB_DDACONFIG").getData().MAIN_MEASURE = items[i].NAME;
				}
				measuresArray.push(items[i]);
			}
			else if(items[i].TYPE=='DIMENSION' && items[i].SELECTED==true){
				this.getView().getModel("SB_DDACONFIG").getData().GEO_DIMENSION = items[i].NAME;
			}
		}
		
		for(var i=0;i<itemsLength;i++){
			if(items[i].TYPE=='DIMENSION'){
				items[i].COLUMNS_ORDER = 4
			}
			else if(items[i].TYPE='MEASURE'){
				if(items[i].NAME==this.getView().getModel("SB_DDACONFIG").getData().MAIN_MEASURE){
					items[i].COLUMNS_ORDER = 1
				}
				else if(items[i].NAME==this.getView().getModel("SB_DDACONFIG").getData().THRESHOLD_MEASURE){
					items[i].COLUMNS_ORDER = 2
				}
				else{
					items[i].COLUMNS_ORDER = 3
				}
			}
		}
		this._updateMeasureDimensionBindings();
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
		choroplethVbox.addItem(new sap.ui.vbm.AnalyticMap({
			width : "100%",
			height : "700px",
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

	getStacking: function(measures,dimensions) {                                                                 // TODO
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

	setStacking: function(isEnabled,type,columns) {                                                                         // TODO     type : M for measure , D for dimension and N for none .
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
	
	dualStackValue : function(columns){
		var count = 1;
		for(var i=0;i<columns.length;i++){
			if(columns[i].axis === 1){
				count++
			}
			if(columns.length === count ){
				columns[columns.length - 1].axis = 2;
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


	getAxisOfMsr: function(oMeasure) {
		var axis = 1 ; 
		for(var i=0;i<this.chartMeasures.length;i++) {
			if((this.chartMeasures[i]).name === oMeasure) {
				axis = (this.chartMeasures[i]).axis ;
				break;
			}
		}
		return axis;
	},
	
	getSelectedMeasuresCount: function(msrObjArray) {
		var count=0;
		for(var i=0;i<msrObjArray.length;i++) {
			if((msrObjArray[i].TYPE).toUpperCase() == "MEASURE" && (msrObjArray[i].SELECTED))
				++count;
		}
		return count;
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
	_getTableCellFormatter: function(originalMeasure, isPercentScaled, axisScaled) {
		var that = this;
		var formatter;
		var chartType = this.dda_config.chartConfig.type ;
		var valueType = this.dda_config.chartConfig.value ;
		var axisType = this.dda_config.chartConfig.axis ;
		if(isPercentScaled) {
			if(chartType.toUpperCase() == "TABLE") {
				if(that._isEvaluationThresholdMeasure(originalMeasure))
					formatter= this.getChartPercentFormatter(true);
				else
					formatter= this.getChartNumberFormatter(true);
			} else if((axisType == 'DUAL') && (valueType == "ABSOLUTE") && (chartType == 'BAR' || chartType == 'COLUMN')) {
				if(axisScaled[(that.getAxisOfMsr(originalMeasure))-1])
					formatter= this.getChartPercentFormatter(true);
				else
					formatter= this.getChartNumberFormatter(true);
			} else {
				formatter= this.getChartPercentFormatter(true);
			}
		}
		else	
			formatter= this.getChartNumberFormatter(true);
		return formatter;
	},
	_getTableCell : function(originalMeasure, thresholdMeasure, is_percent_scale, axisScale) {
		var that = this;
		if(thresholdMeasure && (originalMeasure !== thresholdMeasure)) {
			return new sap.m.ObjectNumber({
				number: {
					path: originalMeasure,
					formatter: that._getTableCellFormatter(originalMeasure, is_percent_scale, axisScale)  
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
					path : originalMeasure,
					formatter: that._getTableCellFormatter(originalMeasure, is_percent_scale, axisScale)
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
	get_hana_client : function(){
		var sessionClient;
		var cacheHanaClient = sap.suite.ui.smartbusiness.lib.Util.cache.getCacheHanaClient();
		if(cacheHanaClient){
			sessionClient = cacheHanaClient;
			return sessionClient;
		}
		jQuery.ajax({
			type: "GET",
			async: false,
			dataType: "json",
			url: sap.suite.ui.smartbusiness.lib.Util.utils.appendUrlParameters("/sap/hba/r/sb/core/logic/GetSessionClient.xsjs"),
			success: function(d, s, x) {
				sessionClient = d.sessionClient;
			},
			error: function (jqXHR, textStatus, errorThrown) {
				            	jQuery.sap.log.error(jqXHR.responseText);
				    }
		});
		sap.suite.ui.smartbusiness.lib.Util.cache.setCacheHanaClient(sessionClient);
		return sessionClient;
	},

	getRuntimeChartData: function(dimensions,measures,dimObjArr,msrObjArr) {                          // TODO
		var that = this;

		var chartToolbarRef = this.getView().byId("vizChartContainer");
		chartToolbarRef.setBusy(true);

		var oDims = [];
		var oMsrs = [];

		dimensions.forEach(function(x){oDims.push(x)}) ;
		measures.forEach(function(x){oMsrs.push(x)}) ;

		this.COLUMNS_SORT = [];
		for(var i=0;i<that.oColumns.length;i++) {
			if(that.oColumns[i].sortBy && that.oColumns[i].sortOrder) {
				if((that.oColumns[i].sortOrder).toUpperCase() == "ASC" || (that.oColumns[i].sortOrder).toUpperCase() == "DESC") {
					this.COLUMNS_SORT.push({
						name : that.oColumns[i].sortBy,
						order : that.oColumns[i].sortOrder
					});
					if(that.oColumns[i].sortBy != that.oColumns[i].name) {
						if((that.oColumns[i].type).toUpperCase() == "DIMENSION") {
							if((oDims.indexOf(that.oColumns[i].sortBy)) == -1) {
								oDims.push(that.oColumns[i].sortBy) ;
							}
						} else if((that.oColumns[i].type).toUpperCase() == "MEASURE") {
							if((oMsrs.indexOf(that.oColumns[i].sortBy)) == -1) {
								oMsrs.push(that.oColumns[i].sortBy) ;
							}
						}
					}
				}
			}
		}        

		try{
			/* TODO: get this from an xsjs service
			 * something like:
			 * var HANA_USER_CLIENT = get_hana_client();
			 */
			var modelerService = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
			if(!(this.isCDS)) {
				var HANA_USER_CLIENT = that.get_hana_client();
				//var HANA_USER_CLIENT = "ERR_sapclient_getRuntimeChartData";
				this.DDA_MODEL.EVALUATION_DATA.FILTERS.results.forEach(function(r,i,a){
					if(r["NAME"] === "P_SAPClient" && r["VALUE_1"] === "$$$") {
						r["VALUE_1"] = HANA_USER_CLIENT;
					}
				});
			}

			var oUriObject = sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
				serviceUri : this._oModel.getData().QUERY_SERVICE_URI,
				entitySet : this._oModel.getData().QUERY_ENTITY_SET,
				dimension : oDims,
				measure : oMsrs,
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
					that.oChartDataModel.setData({businessData: that.oChartData});
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

	getChartPercentFormatter: function(isStandard){
		//var locale=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		var formatterConstructor={style:isStandard?'standard':'short'};
		//if(dec||dec==0){formatterConstructor["shortDecimals"]=dec;}
		var chartFormatter=sap.ui.core.format.NumberFormat.getPercentInstance(formatterConstructor);
		return function(s){
			return isNumber(s)?chartFormatter.format_percentage(Number(s)):s;
		};
	},

	getChartNumberFormatter: function(isStandard){
		//var locale=new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		var formatterConstructor={style:isStandard?'standard':'short'};
		//if(dec||dec==0){formatterConstructor["shortDecimals"]=dec;}
		var chartFormatter=sap.ui.core.format.NumberFormat.getFloatInstance(formatterConstructor);
		return function(s){
			return isNumber(s)?chartFormatter.format(Number(s)):s;
		};
	},

	getIsPercentScaled: function(measures) {
		if(this.thresholdMeasuresArray && this.thresholdMeasuresArray.length) {
			var thresholdMsrsArray = this.thresholdMeasuresArray;
		} else {
			var thresholdMsrsArray = this._getEvaluationThresholdMeasures();
		}
		var isPercentScaled = false ;
		if(thresholdMsrsArray && thresholdMsrsArray.length) {
			for(var i=0;i<measures.length;i++) {
				if(thresholdMsrsArray.indexOf(measures[i]) != -1) {
					isPercentScaled = true ;
					break ;
				} 
			}
		}
		return isPercentScaled;
	},

	_getEvaluationThresholdMeasures : function(){
		var thresholdMeasuresArray = [];
		thresholdMeasuresArray.push(this.EVALUATION.getKpiMeasureName());
		if(this.EVALUATION.getThresholdValueType() === "MEASURE") {
			var thresholdObjArray = this.EVALUATION.getValues().results ;
			if(thresholdObjArray && thresholdObjArray.length) {
				for(var i=0;i<thresholdObjArray.length;i++) {
					if((thresholdObjArray[i]).COLUMN_NAME && !((thresholdObjArray[i]).FIXED)) {
						thresholdMeasuresArray.push((thresholdObjArray[i]).COLUMN_NAME);
					}
				}
			}
		}
		return thresholdMeasuresArray;
	},

	_isEvaluationThresholdMeasure : function(oMsr) {
		if(this.thresholdMeasuresArray && this.thresholdMeasuresArray.length) {
			var thresholdMsrsArray = this.thresholdMeasuresArray;
		} else {
			var thresholdMsrsArray = this._getEvaluationThresholdMeasures();
		}
		if(thresholdMsrsArray && thresholdMsrsArray.length) {
			if(thresholdMsrsArray.indexOf(oMsr) != -1) {
				return true;					
			} 
		}
		return false;
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

	// --------------------------------------------------------------------------------------------

	/*
	 * START - VALIDATE AND SAVE FUNCTIONS
	 */
	/**
	 * No need to make odata call, as all the configurations available locally.
	 */
	//called on change as well as before save
	validateChartId: function(oEvent){
		//@TODO get Field reference using fragment
		var chartIdField = oEvent ? oEvent.getSource() : this.getView().getContent()[0].getContent()[0].getMasterPages()[0].getContent()[2].getItems()[1];
		var chartId =  chartIdField.getValue();
		
		//chartId shouldn't be blank, must contain only words,numbers,.,_
		if(/^[\w\d\.\_]+$/.test(chartId)) {
			if(this.DDA_MODEL.getConfigurator().findViewById(chartId)) {
				if(!this._oModel.getData().ID_EDITABLE){
					chartIdField.setValueState(sap.ui.core.ValueState.None);
					return true;
				} else {
					chartIdField.setValueState(sap.ui.core.ValueState.Error);
					chartIdField.focus();
					return false;
				}
			} else {
				chartIdField.setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		} else {
			chartIdField.setValueState(sap.ui.core.ValueState.Error);
			return false;
		}
	},

	validateChartName: function() {
		//@TODO get Field reference using fragment
		var chartNameField = this.getView().getContent()[0].getContent()[0].getMasterPages()[0].getContent()[2].getItems()[3];
		var chartName = chartNameField.getValue();
		if(chartName) {
			chartNameField.setValueState(sap.ui.core.ValueState.None);
			return true;
		} else {
			chartNameField.setValueState(sap.ui.core.ValueState.Error);
			chartNameField.focus();
			return false;
		}
	},

	validateDataLimit:function(oEvent){
		var datafield = oEvent ? oEvent.getSource() :this.getView().getContent()[0].getContent()[0].getMasterPages()[0].getContent()[2].getItems()[7];	
		var dataLimit = datafield.getValue();
		if(/^\d+$/gi.test(dataLimit)) {

			var parseDataLimit=parseInt(dataLimit,10);
			if( parseDataLimit>0){
				datafield.setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		}else{
			datafield.setValueState(sap.ui.core.ValueState.Error);
			return false; 
		}

	},
	onSave:function(){
		var that = this;
		if(that.errorState) {
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), that.errorMsg);
			return;
		}
		if(this.validateChartName()&&this.validateDataLimit()) {
			var self = this;
			if(this.currentViewId == this.DDA_MODEL.NEW_VIEWID) {
				this.oApplicationFacade.__newViewAdded = true;
				this.oApplicationFacade.createdViewId = this.getView().getModel("SB_DDACONFIG").getData().SELECTED_VIEW;
			}
			this.busyIndicator.open() && this.getView().setBusy(true);
			var modelData=this.getView().getModel("SB_DDACONFIG").getData();
			var saveService=sap.suite.ui.smartbusiness.Adapter.getService("DrilldownServices");
			saveService.saveViewConfiguration(this.evaluationId,modelData,"update",function(){
				jQuery.sap.log.info("all calls success");
				self.busyIndicator.close() && self.getView().setBusy(false);
				sap.m.MessageToast.show(self._oTextsModel.getResourceBundle().getText("CHART_CONFIG_SAVE_SUCCESS"));
				self.oApplicationFacade.__refreshModel = 1;
				/*
				 * oApplicationFacade.__contextViewId stores view id on save
				 * so that configurator view can init under this context.
				 */
				self.oApplicationFacade.__contextViewId = self.getView().getModel("SB_DDACONFIG").getData()["SELECTED_VIEW"];
				try {
					if(sap.suite && sap.suite.ui && sap.suite.ui.smartbusiness && sap.suite.ui.smartbusiness.drilldown.lib.Configuration && sap.suite.ui.smartbusiness.drilldown.lib.Configuration.resetDrilldownConfiguration) {
						sap.suite.ui.smartbusiness.drilldown.lib.Configuration.resetDrilldownConfiguration(self.evaluationId);
					}
				} catch(e) {}
//				if(self.DDA_MODEL.getConfigurator().getAllViews().length==0){
//                    //self.oRouter.navTo("configurator", {evaluationId: self.DDA_MODEL.EVALUATION_DATA.ID, viewId: self.getView().getModel("SB_DDACONFIG").getData().SELECTED_VIEW});
//                    sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"configurator", context: self.DDA_MODEL.EVALUATION_DATA.ID + "/" + self.getView().getModel("SB_DDACONFIG").getData().SELECTED_VIEW});
//                }
//                else{
//                    window.history.back();
//                }
				if(self.navigatingWithinDrilldown) {
					sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"configurator", context: self.DDA_MODEL.EVALUATION_DATA.ID + "/" + self.getView().getModel("SB_DDACONFIG").getData().SELECTED_VIEW});
					self.takeConfigMasterSnapShot();
				}
				else {
					window.history.back();
				}
			},function(){
				jQuery.sap.log.error(x + " failed");
				self.busyIndicator.close() && self.getView().setBusy(false);
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(self._oTextsModel.getResourceBundle().getText("SAVE_ERROR"));
				});
		}
	},
	formatMeasureName : function(s){
		var label = this.COLUMN_LABEL_MAPPING[s];
		if(s==this.DDA_MODEL.EVALUATION_DATA.COLUMN_NAME){       
			label+= "(" + this.getView().getModel("i18n").getProperty("KPI_MEASURE") +")";
		}  
		return label;
	},
	formatMeasureNameInList: function(name,type){
		var text = null;
		var kpiMeasure = this.DDA_MODEL.EVALUATION_DATA.COLUMN_NAME;
		var mainMeasure = this.getView().getModel('SB_DDACONFIG').getData().MAIN_MEASURE;
		var thresholdMeasure = this.getView().getModel('SB_DDACONFIG').getData().THRESHOLD_MEASURE;
		
		if(type=="DIMENSION"){
			text=this.getView().getModel("i18n").getProperty("DIMENSION");
		}
		if(type=="MEASURE"){
			text=this.getView().getModel("i18n").getProperty("MEASURE");

			if(name==kpiMeasure){
				text=this.getView().getModel("i18n").getProperty("KPI_MEASURE");
			}
			if(name==thresholdMeasure){
				if(name === kpiMeasure) {
					text = this.getView().getModel("i18n").getProperty("KPI_MEASURE_THRESHOLD_MEASURE");
				} else {
					text=this.getView().getModel("i18n").getProperty("THRESHOLD_MEASURE");
				}
			}
		}
		
		if((this.getView().getModel('SB_DDACONFIG').getData().CHART_TYPE).toUpperCase() == "CHOROPLETH"){
			if(type=="DIMENSION"){
				text=this.getView().getModel("i18n").getProperty("GEO_DIMENSION");
			}
			if(type=="MEASURE"){
				if(name==mainMeasure){
					text=this.getView().getModel("i18n").getProperty("MAIN_MEASURE");
				}
			}
		}
		return text;
	},

	formatType:  function(type){
		if(type=="MEASURE")
			type=this.getView().getModel("i18n").getProperty("MEASURE");
		if(type=="DIMENSION")
			type=this.getView().getModel("i18n").getProperty("DIMENSION");
		return type;
	},

	/**
	 * Change the order of Dimensions And Measures Added
	 */
	sortDimensionsAndMeasures : function() {
		var oController = this;
		new sap.suite.ui.smartbusiness.lib.ListPersona({
			title : this.getView().getModel("i18n").getProperty("CHANGE_ORDER"),
			view : this.getView(),
			context : '/items',
			listItemContext : 'LABEL',
			formatter:jQuery.proxy(this.formatMeasureName,this),
			namedModel : 'SB_DDACONFIG',
			filter : {
				property : 'SELECTED',
				value : true
			},
			callback : function() {
				oController.refreshChart();
			}
		}).start();
	},

	onBack : function() {
		var self = this;
		
		var replaceHashObject = {};
		if(self.DDA_MODEL.getConfigurator().getAllViews().length) {
			replaceHashObject = {action:"configureSBKPIDrilldown", route:"configurator", context: self.DDA_MODEL.EVALUATION_DATA.ID + "/" + self.oApplicationFacade.configuratorViewId};
		}
		else {
			replaceHashObject = {action:"configureSBKPIDrilldown", route:"noDataView", context: "EVALUATIONS_MODELER(ID='" + self.DDA_MODEL.EVALUATION_DATA.ID + "',IS_ACTIVE=1)"};
		}
		
		if(this.isModelChanged()){
			new sap.m.Dialog({
				icon:"sap-icon://warning2",
				title:self._oTextsModel.getResourceBundle().getText("WARNING"),
				state:"Error",
				type:"Message",
				content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")})],
				beginButton: new sap.m.Button({
					text:self._oTextsModel.getResourceBundle().getText("OK"),
					press: function(){
						self.restoreFromConfigMasterSnapShot();
						this.getParent().close();
						if(self.navigatingWithinDrilldown) {
							sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash(replaceHashObject);
						}
						else {
							window.history.back();
						}
					}
				}),
				endButton: new sap.m.Button({
					text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
					press:function(){this.getParent().close();}
				})                                           
			}).open();
		}
		else{
			self.restoreFromConfigMasterSnapShot();
			//this.getParent().close();
			if(self.navigatingWithinDrilldown) {
				sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash(replaceHashObject);
			}
			else {
				window.history.back();
			}
		}

	},

	onCancel: function() {
		var self = this;
		
		var replaceHashObject = {};
		if(self.DDA_MODEL.getConfigurator().getAllViews().length) {
			replaceHashObject = {action:"configureSBKPIDrilldown", route:"configurator", context: self.DDA_MODEL.EVALUATION_DATA.ID + "/" + self.oApplicationFacade.configuratorViewId};
		}
		else {
			replaceHashObject = {action:"configureSBKPIDrilldown", route:"noDataView", context: "EVALUATIONS_MODELER(ID='" + self.DDA_MODEL.EVALUATION_DATA.ID + "',IS_ACTIVE=1)"};
		}
		
		if(this.isModelChanged()){
			new sap.m.Dialog({
				icon:"sap-icon://warning2",
				title:self._oTextsModel.getResourceBundle().getText("WARNING"),
				state:"Error",
				type:"Message",
				content:[new sap.m.Text({text:self._oTextsModel.getResourceBundle().getText("ARE_YOU_SURE")})],
				beginButton: new sap.m.Button({
					text:self._oTextsModel.getResourceBundle().getText("OK"),
					press: function(){
						self.restoreFromConfigMasterSnapShot();
						this.getParent().close();
						if(self.navigatingWithinDrilldown) {
							sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash(replaceHashObject);
						}
						else {
							window.history.back();
						}
					}
				}),
				endButton: new sap.m.Button({
					text:self._oTextsModel.getResourceBundle().getText("CANCEL"),
					press:function(){this.getParent().close();}
				})                                           
			}).open();
		}
		else{
			self.restoreFromConfigMasterSnapShot();
			//this.getParent().close();
			if(self.navigatingWithinDrilldown) {
				sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash(replaceHashObject);
			}
			else {
				window.history.back();
			}
		}
	},
	onExit:function(){
		this.restoreFromConfigMasterSnapShot();
	},

	//disable save button when no measure/dimension is selected
	enableOrDisableSave : function(){
		var msrDimArr = this._config.items.filter(function(s){return s.SELECTED});
		if(this.dda_config.chartConfig.type.toUpperCase() == "TABLE") this.canSave = true;
		if(this.dda_config.chartConfig.type.toUpperCase() == "CHOROPLETH") this.canSave = true;
		if(msrDimArr.length && this.canSave){
			this.getView().byId("save-btn").setEnabled(true);
		}
		else{
			this.getView().byId("save-btn").setEnabled(false);
		}
	},

	isModelChanged : function(){
		this.currentCopy = this._oModel.getJSON();
		if(this.initCopy.length == this.currentCopy.length){
			if(this.initCopy === this.currentCopy){
				return false;
			}
		}
		return true;
	},

//	viz charts code :

	createVizChart: function(dimensions, measures) {
		var that = this;
		var chartType = this.dda_config.chartConfig.type ;
		var axisType = this.dda_config.chartConfig.axis ;
		var valueType = this.dda_config.chartConfig.value ;	
		var mode = this.dda_config.chartConfig.mode ;
		var vizChartContainer = this.getView().byId("vizChartContainer");
		vizChartContainer.removeAllContent();
		
		// if auto semantic color is chosen, but less than 2 measures selected
		if(chartType.toUpperCase() === "BAR" || chartType.toUpperCase() === "COLUMN" || chartType.toUpperCase() === "TABLE") {
			if(this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","semanticColors")).getSelectedKey() === "AUTO_SEMANTIC"){
				if(this.chartMeasures.length < 2){
					sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("AUTO_SEMANTICS_CHART_MIN_MEASURE"),{onClose:function(){
						if(that._config){
							that.restorePrevConfig();
						}
						else{
							that.restoreFromConfigMasterSnapShot();
						}
						//that.onChartTypeChange();
						that.refreshChart();
					}});
					return;
				}
			}
		}
		
		// get table view for the toolbar :
		var vTableFrame = this.getTableForViz(this.tableDimensions, this.tableMeasures);	
		
		if(chartType.toUpperCase() == "TABLE") {
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
						formatString: "dataLabelFormatter",
						hideWhenOverlap: false
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
		        },
				valueAxis:{
					label:{
							formatString:"yValueAxisFormatter"
					}
				}
			});		
			
			oVizFrame.addEventDelegate({                    // should be handled by vizframe library.              
				onBeforeRendering : function() {
					var oSplitContainer = that.byId('splitContainer');
					var oHeight = oSplitContainer.$().css("height");
					oVizFrame.setHeight(oHeight);
				}
			});
	
			// check for atleast one dimension & measure :
			if((!(this.chartDimensions.length)) || (!(this.chartMeasures.length))) {
				oVizFrame.setDataset(new sap.viz.ui5.data.FlattenedDataset({}));
				vizChartContainerContent.setContent(oVizFrame);				
				vizChartContainer.addContent(vizChartContainerContent); 
				vizChartContainer.addContent(vTableFrame); 
				return;
			}  
			// if bubble chart chosen , but less than 3 measures selected .
			if((chartType.toUpperCase() === "BUBBLE") && (this.chartMeasures.length < 3)) {
				sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("BUBBLE_CHART_MEASURE_COUNT"),{onClose:function(){
					if(that._config && (((that._config.CHART_TYPE).toUpperCase() != "BUBBLE") || (that.getSelectedMeasuresCount(that._config.COLUMNS) >= 3)))
						that.restorePrevConfig();
					else
						that.restoreFromConfigMasterSnapShot();
					that.onChartTypeChange();
					that.refreshChart();
					//that.oVizFrame.setDataset(new sap.viz.ui5.data.FlattenedDataset({}));
				}});
				return;
			}  		
			// if combination chart chosen , but less than 2 measures selected .
			if((chartType.toUpperCase() === "COMBINATION") && (this.chartMeasures.length < 2)) {
				sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("COMBINATION_CHART_MEASURE_COUNT"),{onClose:function(){
					if(that._config && (((that._config.CHART_TYPE).toUpperCase() != "COMBINATION") || (that.getSelectedMeasuresCount(that._config.COLUMNS) >= 2))) {
						that.restorePrevConfig();
					} else {
						that.restoreFromConfigMasterSnapShot();
					}
					that.onChartTypeChange();
					that.refreshChart();
					//that.oVizFrame.setDataset(new sap.viz.ui5.data.FlattenedDataset({}));
				}});
				return;
			}  
			// if dual chart is chosen and there is no measure with axis 1 or 2 :
			if((chartType.toUpperCase() === "BAR" || chartType.toUpperCase() === "COLUMN") && (axisType === "DUAL")) {
				var isOneMsrAxis1 = false, isOneMsrAxis2 = false, i;
				for(i=0;i<this.chartMeasures.length;i++) {
					if(this.chartMeasures[i].axis === 1)
						isOneMsrAxis1 = true;
					else if(this.chartMeasures[i].axis === 2)
						isOneMsrAxis2 = true;
				}

				if(!(isOneMsrAxis1) || !(isOneMsrAxis2)) {
					sap.m.MessageBox.alert(that._oTextsModel.getResourceBundle().getText("STACK_REMOVE_MSG"),{onClose:function(){
						that.restorePrevConfig();
						that._updateMeasureDimensionBindings();
						that.refreshChart();
					}}); 
					return;
				}
			}
			
			this.addFeedsToVizFrame(oVizFrame);		
			
			var vDataset = this.create_vizDataset(dimensions, measures);
			oVizFrame.setDataset(vDataset);
			oVizFrame.setModel(this.oChartDataModel);	
			
			var vizChartPopover = new sap.viz.ui5.controls.Popover().setFormatString("vizPopOver");
			vizChartPopover.connect(oVizFrame.getVizUid());
			
			this.setAllVizFormatters();		
			
			if(axisType === "DUAL" || chartType.toUpperCase() === "BUBBLE") {
				var vProperties = oVizFrame.getVizProperties();
				vProperties.valueAxis2 = {
						label:{
							formatString:"y2ValueAxisFormatter"
						}
				};
				oVizFrame.setVizProperties(vProperties);
				
				if((mode === "RUNTIME") && (this.EVALUATION.getScaling() == -2) && (valueType === "ABSOLUTE") && (chartType === "BAR" || chartType === "COLUMN")) {
					this._handleVizDualAxisWhenPercentScale(oVizFrame, vizChartPopover);
				}
			}
			
			this.applyColorToViz(oVizFrame);
	
			vizChartContainerContent.setContent(oVizFrame);
			
			vizChartContainer.addContent(vizChartContainerContent); 
			vizChartContainer.addContent(vTableFrame); 
			
			// show or hide legend 
			this.showChartLegendIfApplicable(this.chartDimNames,this.chartMsrNames);		
			
		}
		this.canSave = true;
		this.copyConfigSnapshot();
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
		var that = this;
		sap.viz.api.env.Format.useDefaultFormatter(false);
		jQuery.sap.require("sap.ui.core.format.NumberFormat");
		
		var chartType = this.dda_config.chartConfig.type ;
		var axisType = this.dda_config.chartConfig.axis ;
		var valueType = this.dda_config.chartConfig.value ;	
		var mode = this.dda_config.chartConfig.mode ;	
		
		if(mode === "RUNTIME") {
			var isPercentScaled = this.getIsPercentScaled(this.chartMsrNames);
			if((this.EVALUATION.getScaling() == -2) && (axisType === "DUAL") && (valueType === "ABSOLUTE") && (chartType === "BAR" || chartType === "COLUMN")) {
				var axisMeasures = this.getMeasuresByAxis(this.chartMeasures);
				var isAxis1Scaled = this.getIsPercentScaled(axisMeasures.axis1.nameArr);
				var isAxis2Scaled = this.getIsPercentScaled(axisMeasures.axis2.nameArr);
			}
		}
		
		var customerFormatter = {
				locale: function(){},
				format: function(value, pattern) {

					if(pattern == "yValueAxisFormatter"){
						var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance( 
								{style: 'short', 
									minFractionDigits: 1,
									maxFractionDigits: 1,}
						);
						if(valueType === "PERCENTAGE" && (chartType === "BAR" || chartType === "COLUMN")) {
							numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance();							
						} else if((mode === "RUNTIME") && (that.EVALUATION.getScaling() == -2) && isPercentScaled && (axisType === "DUAL") && (chartType === "BAR" || chartType === "COLUMN")) {
							if(isAxis1Scaled) {
								numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
										{style: 'short', 
											minFractionDigits: 1,
											maxFractionDigits: 1,}
								);	
							}
						} else if((mode === "RUNTIME") && (that.EVALUATION.getScaling() == -2) && isPercentScaled) {
							numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
									{style: 'short', 
										minFractionDigits: 1,
										maxFractionDigits: 1,}
							);	
						}	
						return numberFormat.format(Number(value)); 
					} else if(pattern == "y2ValueAxisFormatter"){
						var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance( 
								{style: 'short', 
									minFractionDigits: 1,
									maxFractionDigits: 1,}
						);
						if(valueType === "PERCENTAGE" && (chartType === "BAR" || chartType === "COLUMN")) {
							numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance();							
						} else if((mode === "RUNTIME") && (that.EVALUATION.getScaling() == -2) && isPercentScaled && (axisType === "DUAL") && (chartType === "BAR" || chartType === "COLUMN")) {
							if(isAxis2Scaled) {
								numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
										{style: 'short', 
											minFractionDigits: 1,
											maxFractionDigits: 1,}
								);	
							}
						} else if((mode === "RUNTIME") && (that.EVALUATION.getScaling() == -2) && isPercentScaled) {
							numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
									{style: 'short', 
										minFractionDigits: 1,
										maxFractionDigits: 1,}
							);	
						}						
						return numberFormat.format(Number(value)); 
					} else if(pattern == "dataLabelFormatter"){
						var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance(that.oFormatOptions_core);
						if((mode === "RUNTIME") && (that.EVALUATION.getScaling() == -2) && isPercentScaled && !((valueType === "PERCENTAGE" || axisType === "DUAL") && (chartType === "BAR" || chartType === "COLUMN"))) {
							numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(that.oFormatOptions_core);
						}
						return numberFormat.format(Number(value));  
					} else if(pattern == "dataLabelPercentFormatter"){
						var numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(that.oFormatOptions_core);
						return numberFormat.format(Number(value));  
					} else if(pattern == "vizPopOver"){
						if(valueType === "PERCENTAGE" && (chartType === "BAR" || chartType === "COLUMN")) {
							var numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(that.oFormatOptions_core);
							return numberFormat.format(Number(value)); 
						} else if((mode === "RUNTIME") && (that.EVALUATION.getScaling() == -2) && isPercentScaled  && !((valueType === "PERCENTAGE" || axisType === "DUAL") && (chartType === "BAR" || chartType === "COLUMN"))) {
							var numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(that.oFormatOptions_core);
							return numberFormat.format(Number(value));
						} else {
							var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance(that.oFormatOptions_core);
							return numberFormat.format(Number(value)); 
						}
					} else if(pattern == "vizPercentPopOver"){
						var numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(that.oFormatOptions_core);
						return numberFormat.format(Number(value));  
					}
				}
		};
		
		jQuery.sap.require("sap.viz.ui5.api.env.Format");
		sap.viz.ui5.api.env.Format.numericFormatter(customerFormatter);

	},
	
	_handleVizDualAxisWhenPercentScale: function(chart, vizChartPopover) {
		var that = this;
		var vProperties = chart.getVizProperties();
		var formatObj = {};
		var popopFormatter = {};
		var axisMeasures = this.getMeasuresByAxis(this.chartMeasures);
		var isAxis1Scaled = this.getIsPercentScaled(axisMeasures.axis1.nameArr);
		var isAxis2Scaled = this.getIsPercentScaled(axisMeasures.axis2.nameArr);
		if(isAxis1Scaled) {
			for(var i=0;i<axisMeasures.axis1.nameArr.length;i++) {
				formatObj[(that.column_labels_mapping[((axisMeasures.axis1.nameArr)[i])])] = "dataLabelPercentFormatter";
				popopFormatter[(that.column_labels_mapping[((axisMeasures.axis1.nameArr)[i])])] = "vizPercentPopOver";
			}
		} else {
			for(var i=0;i<axisMeasures.axis1.nameArr.length;i++) {
				formatObj[(that.column_labels_mapping[((axisMeasures.axis1.nameArr)[i])])] = "dataLabelFormatter";
				popopFormatter[(that.column_labels_mapping[((axisMeasures.axis1.nameArr)[i])])] = "vizPopOver";
			}
		}
		if(isAxis2Scaled) {
			for(var i=0;i<axisMeasures.axis2.nameArr.length;i++) {
				formatObj[(that.column_labels_mapping[((axisMeasures.axis2.nameArr)[i])])] = "dataLabelPercentFormatter";
				popopFormatter[(that.column_labels_mapping[((axisMeasures.axis2.nameArr)[i])])] = "vizPercentPopOver";
			}
		} else {
			for(var i=0;i<axisMeasures.axis2.nameArr.length;i++) {
				formatObj[(that.column_labels_mapping[((axisMeasures.axis2.nameArr)[i])])] = "dataLabelFormatter";
				popopFormatter[(that.column_labels_mapping[((axisMeasures.axis2.nameArr)[i])])] = "vizPopOver";
			}
		}
		vProperties.plotArea.dataLabel = {
				visible: true,
				formatString: formatObj
		};
		chart.setVizProperties(vProperties);
		//popover
		vizChartPopover.setFormatString(popopFormatter);
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
		var thresholdmsr = this._oModel.getData()["THRESHOLD_MEASURE"];

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
			if(this._oModel.getData()["COLOR_SCHEME"] == "AUTO_SEMANTIC")
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
	
	generateViewId : function(oController){       
		var x = {};
		x.title = "";		
		var promiseObj = sap.suite.ui.smartbusiness.lib.IDGenerator.generateViewId(x);		
		var id;		
		promiseObj.done(function(vId){		
			id = vId;
			oController.getView().getModel("SB_DDACONFIG").setProperty("/SELECTED_VIEW",id);		
			oController.bindUiToModel();		
			oController.copyConfigSnapshot();		
		});		
	},

	openChoroplethSettingsDialog: function(){
		this.choroplethSettingsDialog.open();
	}, 
	onChoroplethSettingsOk: function(){
		if (! this.choroplethSettingsDialog) {
			this._choroplethSettingsDialog = sap.ui.xmlfragment("choroplethSettingsDialog","sap.suite.ui.smartbusiness.designtime.drilldown.view.choroplethSettingsDialog", this);
		}

		var choroplethKpiMeasureSelected = sap.ui.core.Fragment.byId("choroplethSettingsDialog","choroplethKpiMeasure").getSelectedKey();
		var choroplethThresholdMeasureSelected = sap.ui.core.Fragment.byId("choroplethSettingsDialog","choroplethThresholdMeasure").getSelectedKey();

		this.updateMeasuresAndDimensionsInmodel(choroplethKpiMeasureSelected, choroplethThresholdMeasureSelected);		
		this.copyConfigSnapshot();
		this.refreshChart();
		this.enableOrDisableSave();
		this.choroplethSettingsDialog.close();
	},
	onChoroplethSettingsCancel:function(){
		this.restorePrevConfig();
		this.getView().byId(sap.ui.core.Fragment.createId("chartTypeConfig","chartType")).fireChange();
		this.choroplethSettingsDialog.close();
	},      
                       
	chooseMeasureForThreshold : function(){
		var that=this;
		sap.ui.core.Fragment.byId("choroplethSettingsDialog","displaySelectedParametersGrid").setVisible(false);
		var thresholdList = sap.ui.core.Fragment.byId("choroplethSettingsDialog","thresholdMeasureList");
		
		this.choroplethSettingsDialog.setTitle(this.oApplicationFacade.getResourceBundle().getText("SELECT_THRESHOLD_MEASURE"));
		this.choroplethSettingsDialog.destroyBeginButton();
		
		thresholdList.bindItems({
			path : "SB_DDACONFIG>/items",
			template : new sap.m.StandardListItem({
				title: "{SB_DDACONFIG>NAME}",
				type:"Active",
				press : jQuery.proxy(that.selectedThresholdMeasure,that)
			})
		});
		
		var choroplethKpiMeasureSelected = sap.ui.core.Fragment.byId("choroplethSettingsDialog","choroplethKpiMeasure").getSelectedKey();

		var aFilterMeasure = [new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE"),new sap.ui.model.Filter("SELECTED",sap.ui.model.FilterOperator.EQ,true),new sap.ui.model.Filter("NAME",sap.ui.model.FilterOperator.NE,choroplethKpiMeasureSelected)];
		var aFilterDimension = [new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"DIMENSION"),new sap.ui.model.Filter("SELECTED",sap.ui.model.FilterOperator.EQ,true)];
		
		sap.ui.getCore().byId("choroplethSettingsDialog--thresholdMeasureList").getBinding("items").filter(new sap.ui.model.Filter(aFilterMeasure,true));
		sap.ui.core.Fragment.byId("choroplethSettingsDialog","thresholdMeasureList").setVisible(true);
	},
	
	selectedThresholdMeasure : function(oEvent){
		var that=this;
		sap.ui.core.Fragment.byId("choroplethSettingsDialog","thresholdMeasureList").setVisible(false);
		sap.ui.core.Fragment.byId("choroplethSettingsDialog","displaySelectedParametersGrid").setVisible(true);
		this.choroplethSettingsDialog.setTitle(this.oApplicationFacade.getResourceBundle().getText("CHOROPLETH_MAP_SETTING"));
		if(!(this.choroplethSettingsDialog.getBeginButton())){
			this.choroplethSettingsDialog.setBeginButton(new sap.m.Button({
				text : "{i18n>OK}",
				press : jQuery.proxy(that.onChoroplethSettingsOk,that)
			}));
		}
		
		this.getView().getModel('SB_DDACONFIG').getData().THRESHOLD_MEASURE = oEvent.getSource().getTitle();
		this.getView().getModel('SB_DDACONFIG').updateBindings();
		
	},
	
	handleMainMeasureChange : function(){
		//sap.ui.getCore().byId("choroplethSettingsDialog--choroplethKpiMeasure").rerender();
		var aFilterThresholdMeasure = [new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE"),new sap.ui.model.Filter("SELECTED",sap.ui.model.FilterOperator.EQ,true),new sap.ui.model.Filter("NAME",sap.ui.model.FilterOperator.NE,sap.ui.getCore().byId("choroplethSettingsDialog--choroplethKpiMeasure").getSelectedKey())];
		sap.ui.getCore().byId("choroplethSettingsDialog--choroplethThresholdMeasure").getBinding("items").filter(new sap.ui.model.Filter(aFilterThresholdMeasure,true));
	},
	handleMainMeasureChangechartsettings : function(){
		var filters = [];
		sap.ui.getCore().byId(sap.ui.core.Fragment.createId("editChartDialog","choroplethKpiMeasurechartsetting")).rerender();
		var selectionBox=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("editChartDialog","thresholdMeasureChart"));
		var filterObject = {
				"type": (new sap.ui.model.Filter("TYPE",sap.ui.model.FilterOperator.EQ,"MEASURE")),
				"name": (new sap.ui.model.Filter("NAME",sap.ui.model.FilterOperator.NE,sap.ui.core.Fragment.byId("editChartDialog","choroplethKpiMeasurechartsetting").getSelectedKey())),
				"selected": (new sap.ui.model.Filter("SELECTED", sap.ui.model.FilterOperator.EQ,true)),
		};
		for(var item in filterObject) {
			filters.push(filterObject[item]);
		}
		var selectionItems= selectionBox.getItems()?selectionBox.getItems():[];
		if(selectionItems.length && selectionBox.getBinding('items')) {
			selectionBox.getBinding('items').filter(filters);
		}
	},
	
	helpPopOver : function(oEvent){
		var that=this;
		var title = null;
		var content = null;
		if(oEvent.getSource().getId() == "choroplethSettingsDialog--kpiMeasureHelp"){
			title = that.oApplicationFacade.getResourceBundle().getText("MAIN_MEASURE");
			content = that.oApplicationFacade.getResourceBundle().getText("MAIN_MEASURE_HELP_CONTENT");
		}
		/*else if(oEvent.getSource().getId() == "choroplethSettingsDialog--geoDimensionHelp"){
			title = that.oApplicationFacade.getResourceBundle().getText("GEO_DIMENSION");
			content = that.oApplicationFacade.getResourceBundle().getText("GEO_DIMENSION_HELP_CONTENT");
		}*/
		else if(oEvent.getSource().getId() == "choroplethSettingsDialog--thresholdMeasureHelp"){
			title = that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_MEASURE");
			content = that.oApplicationFacade.getResourceBundle().getText("THRESHOLD_MEASURE_HELP_CONTENT");
		}
		this.helpPopOver = new sap.m.ResponsivePopover({
			contentWidth : '15%',
			contentHeight : '10%',
			placement : sap.m.PlacementType.Right,
			content : new sap.m.Text({
				text : content,
				width : "100%"
			}),
			title : title,
			verticalScrolling : true,
			horizontalScrolling : false
		});
		this.helpPopOver.openBy(oEvent.getSource());
	},
	updateMeasuresAndDimensionsInmodel : function(mainMeasure,thresholdMeasure){
		var items=this.choroplethSettingsDialog.getModel("SB_DDACONFIG").getData().items;
		var itemsLength = items.length;

		for(var i=0;i<itemsLength;i++){
			if(items[i].NAME==mainMeasure){
				items[i].MAIN_MEASURE = true;
				items[i].SELECTED=true;
				delete items[i].THRESHOLD_MEASURE;
				this.choroplethSettingsDialog.getModel("SB_DDACONFIG").getData().MAIN_MEASURE = mainMeasure;
			}
			else if(items[i].NAME==thresholdMeasure ){
				items[i].THRESHOLD_MEASURE = true;
				items[i].SELECTED=true;
				delete items[i].MAIN_MEASURE;
				this.choroplethSettingsDialog.getModel("SB_DDACONFIG").getData().THRESHOLD_MEASURE = thresholdMeasure;
			}
			else{
				delete items[i].MAIN_MEASURE;
				delete items[i].THRESHOLD_MEASURE;
			}
		}
		for(var i=0;i<itemsLength;i++){
			if(items[i].TYPE=='DIMENSION' && items[i].SELECTED){
				items[i].COLUMNS_ORDER = 4
				items[i].GEO_DIMENSION = true;
			}
			else if(items[i].TYPE=='MEASURE'){
				if(items[i].NAME==this.getView().getModel("SB_DDACONFIG").getData().MAIN_MEASURE){
					items[i].COLUMNS_ORDER = 1
				}
				else if(items[i].NAME==this.getView().getModel("SB_DDACONFIG").getData().THRESHOLD_MEASURE){
					items[i].COLUMNS_ORDER = 2
				}
				else{
					items[i].COLUMNS_ORDER = 3
				}
			}
		}
		this._updateMeasureDimensionBindings();

	},
	onThresholdMeasureChange: function(evt) {
		evt.getSource().setTooltip(evt.getParameters().selectedItem.getText());
	},
	
	genericSelectTooltipChange: function(evt) {
		evt.getSource().setTooltip(evt.getParameters().selectedItem.getText());
	}

});
