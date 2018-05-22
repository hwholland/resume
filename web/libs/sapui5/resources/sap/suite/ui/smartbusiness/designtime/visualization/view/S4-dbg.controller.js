/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 */

jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.visualization.view.S4", {
	onInit : function() {
		var that = this;
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		var view = this.getView();
		this.oResourceBundle = this.oApplicationFacade.getResourceBundle();

		this.errorMessages = [];
		this.errorState = false;

		this.LUMIRA_SEMANTIC_OBECT = "LumiraAnalytics";
		this.LUMIRA_ACTION = "openStory";

		this.lumiraSemanticObject = "LumiraAnalytics";
		this.lumiraAction = "openStory";

		this.apfSemanticObject = "FioriApplication";
		this.apfAction = "executeAPFConfiguration";

		this.APF_SEMANTIC_OBECT = "FioriApplication";
		this.APF_ACTION = "executeAPFConfiguration";

		this.adhocAnalysisSemanticObject = "AdhocAnalysis";
		this.adhocAnalysisAction = "analyze";

		this.ADHOC_ANALYSIS_SEMANTIC_OBECT = "AdhocAnalysis";
		this.ADHOC_ANALYSIS_ACTION = "analyze";

		this.sbAction = "analyzeSBKPIDetails";

		this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
		this.confRef = sap.suite.ui.smartbusiness.Configuration;
		this.constantsRef = this.confRef.Constants;
		this.tileTypeConst = this.constantsRef.TileType;
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.PLATFORM = this.metadataRef.getPlatform();
		this.initialiazeDialogs();
		if(!(this.oApplicationFacade.env)) {
			// Fetch System Environment info => Either running on SAP env or CUST env
			function sysInfoFetchCallBack(d) {
				if(d === null || d === undefined) {
					d = {};
					d.SYS_FLAG = 1;
				}
				that.env = d.SYS_FLAG;
				that.sScope = d.SYS_FLAG ? "CONF" : "CUST"; 
			}
			function sysInfoFetchErrCallBack(d,s,x) {
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_SYS_INFO"), d.response.body);
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_SYS_INFO"),
					"description" : d.response.body
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			}
			this.metadataRef.getSystemInfo({async:false, success:sysInfoFetchCallBack, error:sysInfoFetchErrCallBack, model:this.oDataModel});
		}

		if(!(that.oApplicationFacade.currentLogonHanaUser)) {
			//Adapter Implementation ----
			var sessionUserFetchCallBack = function(user) {
				that.oApplicationFacade.currentLogonHanaUser = user;
			};
			var sessionUserFetchErrCallBack = function(d,s,x) {
				that.oApplicationFacade.currentLogonHanaUser = null;
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), d.response.body);
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"),
					"description" : d.response.body
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			};
			this.metadataRef.getSessionUser({async:true, success:sessionUserFetchCallBack, error:sessionUserFetchErrCallBack, model:this.oApplicationFacade.getODataModel()});
		}

		this.oRouter.attachRouteMatched(function(oEvent) {
			if(oEvent.getParameter("name") == "addTile") {
				this.createMode = true;
				this.editMode = false;
			}
			else if(oEvent.getParameter("name") == "editTile") {
				this.createMode = false;
				this.editMode = true;
			}
			else {
				this.createMode = false;
				this.editMode = false;
			}
			if(this.createMode || this.editMode) {

				this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");

				that.inSufficientAdditionalMeasureAlerted = false;
				that.inSufficientAdditionalMeasure = false;
				var chipModel = new sap.ui.model.json.JSONModel();
				chipModel.setSizeLimit(100000);
				this.getView().setModel(chipModel,"tileConfig");
				this.modelRef = this.getView().getModel("tileConfig");
				var initialData = this.getInitialModelData();
				this.getView().getModel("tileConfig").setData(initialData);
				var partialObject = this.fetchChipData({evalContextPath: oEvent.getParameter("arguments").contextPath, chipContextPath: oEvent.getParameter("arguments").chipContextPath});
				//this.getView().getModel("tileConfig").setData(partialObject);
				if(oEvent.getParameter("arguments").contextPath) {
					this.context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
				}
				if(oEvent.getParameter("arguments").chipContextPath) {
					this.chipContext = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").chipContextPath);
				}

				this.appMode = oEvent.getParameter("name");
				that.byId("tileSubtitle").setValueState("None");
				that.byId("appPropertyName").setValueState("None");
				that.byId("semanticObjectText").setValueState("None");
				that.byId("selectODD").setValueState("None");
				that.byId("tileTitle").setValueState("None");
				that.byId("appPropertyValue").setValueState("None");
				that.byId("selectStoryId").setValueState("None");
				that.byId("apfConfId").setValueState("None");
				//this.selectVizRight();
			}
		}, this);
		try{
			if(sap.ui.core.Fragment.byId("tiles","compchart")){
				sap.ui.core.Fragment.byId("tiles","compchart").destroy();
			} 
			if(sap.ui.core.Fragment.byId("tiles","compchartmul")){
				sap.ui.core.Fragment.byId("tiles","compchartmul").destroy();
			} 
			if(sap.ui.core.Fragment.byId("tiles","bulletchart")){
				sap.ui.core.Fragment.byId("tiles","bulletchart").destroy();
			}
			if(sap.ui.core.Fragment.byId("tiles","areachart")){
				sap.ui.core.Fragment.byId("tiles","areachart").destroy();
			}
		}catch(e){};

		sap.ui.xmlfragment("tiles","sap.suite.ui.smartbusiness.designtime.visualization.view.tiles", this);

	},

	getHeaderFooterOptions : function() {
		var that = this;
		this.oHeaderFooterOptions = {
				bSuppressBookmarkButton: {},
				onBack: function() {
					that.handleBackAndCancel();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.saveTile();
					}
				},
				buttonList : []
		};
		return this.oHeaderFooterOptions;
	},
	getHeaderFooterOptionsForError : function(){
		var that = this;
		this.oErrorOptions = {
				bSuppressBookmarkButton: {},
				onBack: function() {
					that.handleBackAndCancel();
				},
				oNegativeAction : {
					sControlId : "errorBtn",
					sId : "errorBtn",
					sIcon : "sap-icon://alert",
					bDisabled : false,
					onBtnPressed : function(event){
						that.utilsRef.handleMessagePopover(event,that);
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.saveTile();
					}
				}]
		};
		return this.oErrorOptions;
	},
	setFooterOnError : function(){
		var that = this;
		if(that.errorMessages.length>1){
			switch(that.mode){
			case "create" :
				that.setHeaderFooterOptions(that.oErrorOptions);
				break;
			case "edit" :
				that.updateFooterButtons(this.modelRef.getData());
				that.setHeaderFooterOptions(that.oErrorOptionsForDraft);
				break;
			}
		}else{
			switch(that.mode){
			case "create" :
				that.setHeaderFooterOptions(that.oHeaderFooterOptions);
				break;

			case "edit" :
				that.updateFooterButtons(this.modelRef.getData());
				that.setHeaderFooterOptions(that.oHeaderFooterOptionsForDraft);
				break;
			}
		}
	},

	initialiazeDialogs:function(){
		var that = this;
		this.filterValueHelpDialog = new sap.m.SelectDialog({
			title : that.oResourceBundle.getText("SELECT_FILTERS"),
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
				that.getView().getModel("tileConfig").setProperty("/CHIP/harveyFilters/0/VALUE_1",values);
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
		var model=this.getView().getModel("tileConfig");
		var oDataUrl= model.getProperty("/EVALUATION/ODATA_URL");
		var oValues={};
		aValues.forEach(function(val){
			oValues[val]=true;
		});
		//var sDim=model.getProperty("/CHIP/harveyFilterDimension");
		var oDataConfig=sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
			serviceUri :oDataUrl,
			entitySet : model.getProperty("/EVALUATION/ODATA_ENTITYSET"),
			filter : model.getProperty("/FILTERS"),
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
	openFilterValueHelp:function(){
		var that=this;
		var viewModel= that.getView().getModel("tileConfig");
		this.filterValueHelpDialog.open();
		this.filterValueHelpDialog.setBusy(true);
		var sDim = viewModel.getProperty("/CHIP/harveyFilters/0/NAME");
		var aSelectedValues = viewModel.getProperty("/CHIP/harveyFilters/0/VALUE_1");
		that.fetchFilterValuesForDimension(sDim,aSelectedValues,function fetchFilterValuesForDimensionCallBack(data){
			that.filterValueHelpDialog.getModel().setProperty("/filterValues",data);
			that.filterValueHelpDialog.setBusy(false);
		},function(e){
			that.filterValueHelpDialog.setBusy(false);
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_FETCHING_FILTERS"), e);
			that.errorMessages.push({
				"type":"Error",
				"title":that.oApplicationFacade.getResourceBundle().getText("ERROR_FETCHING_FILTERS"),
				"description" : e
			});
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
		});

	},
	initializeDimensionsForHarveyFilters:function(oTileConfig){
		//var model=this.getView().getModel("tileConfig");
		var oDataUrl= oTileConfig.EVALUATION.ODATA_URL;
		var entitySet=oTileConfig.EVALUATION.ODATA_ENTITYSET;
		var aDimension=sap.suite.ui.smartbusiness.lib.Util.odata.dimensions(oDataUrl, entitySet).getAsObjectArrayWithLabel();
		var oDimensions=sap.suite.ui.smartbusiness.lib.Util.odata.getAllFilterableDimensionsWithProperty(oDataUrl, entitySet);
		var aHarveyDimension=[];
		var tmp={};
		aHarveyDimension.forEach(function(o){
			tmp[o.name]=true;
		});
		for(var each in oDimensions){
			if(!tmp[each]){
				aHarveyDimension.push({
					name:each,
					label:oDimensions[each]._sLabelText||each
				});
			}
		}
		oTileConfig.CHIP.HARVEY_DIMENSION = aHarveyDimension;
		if(!oTileConfig.CHIP.harveyFilters[0].NAME){
			oTileConfig.CHIP.harveyFilters[0].NAME=aHarveyDimension[0].label;
		}
		//model.setProperty("/CHIP/HARVEY_DIMENSION",aHarveyDimension);
	},
	harveyTotalMeasureVisibility:function(bIsHarveyBall,bIsKpiFractionMeasure){
		return bIsHarveyBall && bIsKpiFractionMeasure;
	},
	harveyFilterVisibility:function(bIsHarveyBall,bIsKpiTotalMeasure){
		return bIsHarveyBall && bIsKpiTotalMeasure;
	},
	harveyFilterOptionVisibility:function(bIsHarveyBall,bIsKpiTotalMeasure,selectedDimension){
		return bIsHarveyBall && bIsKpiTotalMeasure && selectedDimension;
	},
	betweenOperatorLabelVisible:function(operator){
		return operator=="BT";
	},
	_cache:{},
	setApplicationCache:function(key,val){
		this._cache[key]=val;
	},
	getApplicationCache:function(key){
		return this._cache[key];
	},
	onKpiMeasureAsHarveyTotalMeasure:function(oEvent){
		//dont do anyting as of now
//		if(oEvent && oEvent.mParameters.selected && oEvent.getSource().data("type")=="harveyTotalMeasure"){
//		this.fetchFilterValuesForCurrentDimension();    
//		}
	},
	getSelectedRadioButton : function(oEvent, confirmationType) {
		var bindingContext = this.getView().getBindingContext();
		var dataRef = this.modelRef.getData();
		if((oEvent && oEvent.mParameters.selected) || confirmationType || true){
			this.confirmationType = (oEvent) ? oEvent.getSource().data("drilldownType") : confirmationType;
			if (this.confirmationType === 'GDD') {
				dataRef.CHIP.navType = "0";
				dataRef.CONTROL = this.getControlObject(dataRef);
				dataRef.CHIP.semanticObject = this.tempSemanticObject || this.onLoadSemanticObject;
				dataRef.CHIP.semanticAction = this.sbAction;
				this.updateFooterButtons(dataRef);
				this.modelRef.setData(dataRef);
			}
			else if (this.confirmationType === 'ODD') {
				dataRef.CHIP.navType = (Number(dataRef.CHIP.navType)) ? dataRef.CHIP.navType : "4";
				dataRef.CONTROL = this.getControlObject(dataRef);
				this.modelRef.setData(dataRef);
				this.selectNavType(null, dataRef.CHIP.navType);
			}
		}
	},

	selectTileType:function(oEvent){
		this.selectTile(oEvent.getSource().getSelectedItem().getKey());
	},

	onTileSelect: function(oEvent){
		this.selectTile(oEvent.getSource().data("tileType"));
	},

	selectTile: function(key){
		var dataRef = this.modelRef.getData();
		dataRef.CHIP.tileType = key;
		dataRef.CONTROL = this.getControlObject(dataRef);
		this.modelRef.setData(dataRef);
		if(key == "CM") {
			if(this.inSufficientAdditionalMeasure && !(this.inSufficientAdditionalMeasureAlerted)) {
				sap.m.MessageToast.show(this.oApplicationFacade.getResourceBundle().getText("INSUFFICIENT_ADDL_MEASURES"));
				this.inSufficientAdditionalMeasureAlerted = true;
			}
		}
		this.getView().byId(dataRef.CHIP.tileType).$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
		this.byId("selectTileType").setTooltip(this.byId("selectTileType").getSelectedItem().getText());
	},

	selectSortOrder:function(oEvent){
		oEvent.getSource().setTooltip(oEvent.getParameters().selectedItem.getText());
	},

	multiMeasureSelect: function(oEvent) {
		oEvent.getSource().setTooltip(oEvent.getParameters().selectedItem.getText());
	},
	
	semanticColorContributionChange: function(oEvent) {
		oEvent.getSource().setTooltip(oEvent.getParameters().selectedItem.getText());
	},
	
	selectNavType:function(oEvent, key){
		var dataRef = this.modelRef.getData();
		if(oEvent) {
			key = oEvent.getSource().getSelectedKey();
			oEvent.getSource().setTooltip(oEvent.getParameters().selectedItem.getText());
		}
		dataRef.CHIP.navType = key;
		dataRef.CONTROL = this.getControlObject(dataRef);
		switch(Number(key)) {
		case 1: //@Bring up Lumira Content
			dataRef.CHIP.semanticObject = this.lumiraSemanticObject;
			dataRef.CHIP.semanticAction = this.lumiraAction;
			break;
		case 2: //@Bring up APF Content
			dataRef.CHIP.semanticObject = this.apfSemanticObject;
			dataRef.CHIP.semanticAction = this.apfAction;
			break;
		case 3: //@Bring up CXO Content
			dataRef.CHIP.semanticObject = this.tempSemanticObject || this.onLoadSemanticObject || "";
			dataRef.CHIP.semanticAction = this.tempAction || this.onLoadSemanticAction || "";
			break;
		case 4: //@Bring up Custom DrillDown
			dataRef.CHIP.semanticObject = this.tempSemanticObject || this.onLoadSemanticObject || "";
			dataRef.CHIP.semanticAction = this.tempAction || this.onLoadSemanticAction || "";
			break;
		case 5: //@Bring up Adhoc Analysis
			dataRef.CHIP.semanticObject = this.adhocAnalysisSemanticObject;
			dataRef.CHIP.semanticAction = this.adhocAnalysisAction;
			break;
		default: break;
		}
		this.updateFooterButtons(dataRef);
		this.modelRef.setData(dataRef);
	},

	formChipConfiguration: function() {
		var that = this;
		var payload = {};
		var dataRef = this.modelRef.getData();
		var data = dataRef.CHIP;
		var configuration = null;
		var tileConfig = {};
		var tileProperties = {};
		var harveyFilters= data.harveyFilters||[];
		//chip properties
		payload.id = data.id || "";
		this.currentChipId = payload.id;
		payload.isActive = 0;
		payload.catalogId = 'HANA_CATALOG';
		payload.title = data.title;
		payload.description = data.description;
		if(data.tileType == "DT")
		{
			payload.tileType = data.tileType + "-" + data.dualTileType;

		}
		else{
			payload.tileType = data.tileType;
		}
		payload.evaluationId = data.evaluationId;
		payload.url = this.getChipUrl(payload.tileType);
		payload.keywords = data.keywords;

		if(data.changedOn) {
			payload.changedOn = data.changedOn;
		}

		// TILE_PROPERTIES in configuration
		tileProperties.id = data.id || "";
		tileProperties.evaluationId = data.evaluationId; 
		if(data.tileType == "DT")
		{
			tileProperties.tileType = data.tileType + "-" + data.dualTileType;

		}
		else{
			tileProperties.tileType = data.tileType;
		}

		if(data.tileType == 'CT' || (data.tileType == 'DT' && data.dualTileType == 'CT')) {
			tileProperties.dimension = data.dimension;
			tileProperties.sortOrder = data.sortOrder;
			tileProperties.semanticColorContribution = data.semanticColorContribution;
		}
		if(data.tileType == 'TT' || (data.tileType == 'DT' && data.dualTileType == 'TT')) {
			tileProperties.dimension = data.dimension;
		}

		var evaluation = dataRef.EVALUATION;

		if(data.tileType == 'NT' || data.tileType == 'TT' || data.tileType == 'CT' || data.tileType == 'AT' || data.tileType == 'CM'|| data.tileType=="HT") {
			tileProperties.frameType = 'OneByOne';
		}
		else {
			tileProperties.frameType = 'TwoByOne';
			// For 2x1 tiles
		}

		tileProperties.navType = data.navType;

		if(tileProperties.navType == "0") {
			tileProperties.semanticObject = (data.semanticObject && (data.semanticObject.length != (data.semanticObject.split(" ").length - 1))) ? data.semanticObject : evaluation.COLUMN_NAME;
			tileProperties.semanticAction = this.sbAction;
		}
		else if(tileProperties.navType == "1") {
			tileProperties.storyId = data.storyId;
			tileProperties.semanticObject = data.semanticObject || this.lumiraSemanticObject || this.LUMIRA_SEMANTIC_OBECT;
			tileProperties.semanticAction = data.semanticAction || this.lumiraAction || this.LUMIRA_ACTION; 
		}
		else if(tileProperties.navType == "2") {
			tileProperties.apfConfId = data.apfConfId;
			tileProperties.semanticObject = data.semanticObject || this.apfSemanticObject || this.APF_SEMANTIC_OBECT;
			tileProperties.semanticAction = data.semanticAction || this.apfAction || this.APF_ACTION;
		}
		else if(tileProperties.navType == "5") {
			tileProperties.semanticObject = data.semanticObject || this.adhocAnalysisSemanticObject || this.ADHOC_ANALYSIS_SEMANTIC_OBECT;
			tileProperties.semanticAction = data.semanticAction || this.adhocAnalysisAction || this.ADHOC_ANALYSIS_ACTION;
		}
		else {
			tileProperties.semanticObject = data.semanticObject;
			tileProperties.semanticAction = data.semanticAction;
		}

		if(data.tileType == 'CM' || (data.tileType == 'DT' && data.dualTileType == 'CM')) {
			tileProperties.COLUMN_NAMES = [];
			var customMeasures = data.MULTI_MEASURE;
			var evaluationCustomMeasureArray = [];
			for(var i=0,l=customMeasures.length; i<l; i++) {
				if(customMeasures[i].COLUMN_NAME) {
					tileProperties.COLUMN_NAMES.push({COLUMN_NAME:customMeasures[i].COLUMN_NAME, semanticColor:customMeasures[i].semanticColor});
					evaluationCustomMeasureArray.push({COLUMN_NAME:customMeasures[i].COLUMN_NAME, semanticColor:customMeasures[i].semanticColor});
				}
				else {
					evaluationCustomMeasureArray.push({COLUMN_NAME:null, semanticColor:null});
				}
			}
		}
		if(data.tileType== 'HT'){
			tileProperties.isFractionMeasure = dataRef.CHIP.isKPIMeasureFractionMeasureHarvey;
			if(tileProperties.isFractionMeasure){
				tileProperties.harveyTotalMeasure = data.totalValueMeasure;
			}else{
				tileProperties.harveyFilters=[];
				if(harveyFilters[0]&& harveyFilters[0].VALUE_1){
					harveyFilters[0].VALUE_1.forEach(function(val){
						tileProperties.harveyFilters.push({
							NAME:harveyFilters[0].NAME,
							OPERATOR:harveyFilters[0].OPERATOR,
							VALUE_1:val,
							VALUE_2:"",
							TYPE: "FI"
						});
					});
				}
			}
		}
		tileConfig.ADDITIONAL_APP_PARAMETERS = {};

		var appParameters = dataRef.CHIP.APP_PARAMETERS;
		if(appParameters && appParameters.length) {
			for(var i=0,l=appParameters.length; i<l; i++) {
				tileConfig.ADDITIONAL_APP_PARAMETERS[appParameters[i].NAME] = appParameters[i].VALUE; 
			}
		}

		tileConfig.ADDITIONAL_APP_PARAMETERS = Object.keys(tileConfig.ADDITIONAL_APP_PARAMETERS).length ? JSON.stringify(tileConfig.ADDITIONAL_APP_PARAMETERS) : JSON.stringify({});

		tileConfig.TILE_PROPERTIES = JSON.stringify(tileProperties);


		// EVALUATION_FILTERS properties in configuration
		tileConfig.EVALUATION_FILTERS = dataRef.FILTERS.length ? JSON.stringify(dataRef.FILTERS) : JSON.stringify([]);

		// EVALUATION_VALUES properties in configuration
		tileConfig.EVALUATION_VALUES =  dataRef.VALUES.length ? JSON.stringify( dataRef.VALUES) : JSON.stringify([]);

		// TAGS in configuration
		tileConfig.TAGS = dataRef.TAGS ? JSON.stringify(Object.keys(dataRef.TAGS)) : JSON.stringify([]);

		// EVALUATION properties in configuration
		var evaluationInfo = {};
		evaluationInfo.ID = evaluation.ID;
		evaluationInfo.INDICATOR = evaluation.INDICATOR;
		evaluationInfo.INDICATOR_TYPE = evaluation.INDICATOR_TYPE;
		evaluationInfo.INDICATOR_TITLE = evaluation.INDICATOR_TITLE;
		evaluationInfo.GOAL_TYPE = evaluation.GOAL_TYPE;
		evaluationInfo.TITLE = evaluation.TITLE;
		evaluationInfo.SCALING = evaluation.SCALING;
		evaluationInfo.ODATA_URL = evaluation.ODATA_URL;
		evaluationInfo.ODATA_ENTITYSET = evaluation.ODATA_ENTITYSET;
		evaluationInfo.VIEW_NAME = evaluation.VIEW_NAME;
		evaluationInfo.COLUMN_NAME = evaluation.COLUMN_NAME;
		evaluationInfo.OWNER_NAME = evaluation.OWNER_NAME; 
		evaluationInfo.VALUES_SOURCE = evaluation.VALUES_SOURCE;
		evaluationInfo.DECIMAL_PRECISION = evaluation.DECIMAL_PRECISION;

		tileConfig.EVALUATION = evaluationInfo ? JSON.stringify(evaluationInfo) : JSON.stringify({});

		var dateString = Date.now().toString();
		configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"1", timeStamp:dateString});

		var tileConfigLimit = 4050;
		if(payload.id) {
			tileConfigLimit = 4096;
		}

		if(configuration.length > tileConfigLimit) {
			tileConfig.TAGS = JSON.stringify([]);
			configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"0", timeStamp:dateString});
			if(configuration.length > tileConfigLimit) {
				tileConfig.EVALUATION_FILTERS = JSON.stringify([]);
				tileConfig.TAGS = JSON.stringify([]);
				configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"0", timeStamp:dateString});
				if(configuration.length > tileConfigLimit) {
					tileConfig.EVALUATION_VALUES = JSON.stringify([]);
					tileConfig.EVALUATION_FILTERS = JSON.stringify([]);
					tileConfig.TAGS = JSON.stringify([]);
					configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"0", timeStamp:dateString});
				}
			}
		}

//		if(configuration.length > tileConfigLimit) {
//		tileConfig.EVALUATION_FILTERS = JSON.stringify([]);  
//		configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"0", timeStamp:dateString});
//		if(configuration.length > tileConfigLimit) {
//		tileConfig.EVALUATION_VALUES = JSON.stringify([]);
//		tileConfig.EVALUATION_FILTERS = JSON.stringify([]);
//		configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"0", timeStamp:dateString});
//		}
//		}

		payload.configuration = configuration;

		return payload;
	},

	publishChip: function(payload) {
		var serviceStatus = true;
		var that = this;
		payload.keywords = payload.keywords || "";
		delete payload.navType;
		delete payload.semanticObject;
		delete payload.action;
		this.chipTextPayload = [];
		var batchOperations = [];
		this.deleteBatch = [];
		this.createBatch = [];
		var isUpdatesSuccessful = true;

		var oDataModel = this.oApplicationFacade.getODataModel();

		if(this.createMode) {
			//odata write
//			oDataModel.create("/CHIPS",payload, null, function(data) {
//			if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES) {
//			for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
//			var chipTextObject = {};
//			that.oApplicationFacade.getODataModel().read("/LANGUAGE?$filter=LAISO eq '" +encodeURIComponent(that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].isoLanguage)  + "'", null, null, false, function(data){
//			chipTextObject.language = data.results[0].SPRAS;
//			});
//			chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].title;
//			chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].description;
//			chipTextObject.id = payload.id;
//			chipTextObject.isActive = 0;
//			that.chipTextPayload.push(chipTextObject);
//			batchOperations.push(oDataModel.createBatchOperation("/CHIP_TEXTS","POST",chipTextObject));
//			}
//			oDataModel.addBatchChangeOperations(batchOperations);
//			oDataModel.submitBatch(function(data,response,errorResponse){
//			if(errorResponse.length)
//			{       
//			isUpdatesSuccessful = false;
//			return;
//			}
//			var responses = data.__batchResponses[0].__changeResponses;
//			for(var key in responses)
//			if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//			isUpdatesSuccessful = false;      
//			}
//			if(isUpdatesSuccessful) {
//			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
//			}
//			},function(error){
//			isUpdatesSuccessful = false;
//			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//			},false);
//			}
//			else {
//			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
//			}

//			}, function(err) {
//			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//			});

			//xsjs write
			var finalPayload = [];
			if(that.modelRef.getData().NO_OF_ADDITIONAL_LANGUAGES) {
				for(var i=0;i<that.modelRef.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
					var chipTextObject = {};
					chipTextObject.title = that.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].title;
					chipTextObject.description = that.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].description;
					chipTextObject.id = payload.id;
					chipTextObject.language = that.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].language;
					chipTextObject.isActive = 0;
					that.chipTextPayload.push(chipTextObject);
				}
			}
			finalPayload.push({keys:{id:payload.id, isActive:payload.isActive}, payload:{CHIP:payload, TEXTS:that.chipTextPayload}});
			that.metadataRef.create("CHIP",finalPayload,null,function(data) {
				serviceStatus = true;
				that.currentChipId = JSON.parse(data).response[0].id;
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
			},function(err){
				serviceStatus = false;
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"),
					"description" : err.responseText
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			});
		}
		else if(this.editMode){
			if(this.currentContextState) {
				//odata create
//				oDataModel.create("/CHIPS",payload, null,  function(data) {
//				if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES) {
//				for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
//				var chipTextObject = {};
//				that.oApplicationFacade.getODataModel().read("/LANGUAGE?$filter=LAISO eq '" +encodeURIComponent(that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].isoLanguage)  + "'", null, null, false, function(data){
//				chipTextObject.language = data.results[0].SPRAS;
//				});
//				chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].title;
//				chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].description;
//				chipTextObject.id = payload.id;
//				chipTextObject.isActive = 0;
//				that.chipTextPayload.push(chipTextObject);
//				batchOperations.push(oDataModel.createBatchOperation("/CHIP_TEXTS","POST",chipTextObject));
//				}
//				oDataModel.addBatchChangeOperations(batchOperations);
//				oDataModel.submitBatch(function(data,response,errorResponse){
//				if(errorResponse.length)
//				{       
//				isUpdatesSuccessful = false;
//				return;
//				}
//				var responses = data.__batchResponses[0].__changeResponses;
//				for(var key in responses)
//				if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//				isUpdatesSuccessful = false;      
//				}
//				if(isUpdatesSuccessful) {
//				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//				}
//				},function(error){
//				isUpdatesSuccessful = false;
//				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//				},false);
//				}
//				else{
//				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//				}
//				}, function(err) {
//				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//				});

				//xsjs write
				var finalPayload = [];
				if(that.modelRef.getData().NO_OF_ADDITIONAL_LANGUAGES) {
					for(var i=0;i<that.modelRef.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
						var chipTextObject = {};
						chipTextObject.title = that.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].title;
						chipTextObject.description = that.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].description;
						chipTextObject.id = payload.id;
						chipTextObject.language = that.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].language;
						chipTextObject.isActive = 0;
						that.chipTextPayload.push(chipTextObject);
					}
				}
				finalPayload.push({keys:{id:payload.id, isActive:payload.isActive}, payload:{CHIP:payload, TEXTS:that.chipTextPayload}});
				that.metadataRef.create("CHIP",finalPayload,null,function(data) {
					serviceStatus = true;
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
				},function(err){
					serviceStatus = false;
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
					that.errorMessages.push({
						"type":"Error",
						"title":that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"),
						"description" : err.responseText
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
				});
			}
			else {
				//odata update
//				oDataModel.update(this.chipContext.sPath,payload, null,  function(data) {
//				if(that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES || that.oldLanguagePayload) {
//				for(var i=0;i<that.additionalLanguageLinkModel.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
//				var chipTextObject = {};
//				that.oApplicationFacade.getODataModel().read("/LANGUAGE?$filter=LAISO eq '" +encodeURIComponent(that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].isoLanguage)  + "'", null, null, false, function(data){
//				chipTextObject.language = data.results[0].SPRAS;
//				});
//				chipTextObject.title = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].title;
//				chipTextObject.description = that.additionalLanguageLinkModel.getData().ADDITIONAL_LANGUAGE_ARRAY[i].description;
//				chipTextObject.id = payload.id;
//				chipTextObject.isActive = payload.isActive;
//				that.chipTextPayload.push(chipTextObject);
//				}

//				that.languagePayloadForDirtyBitTest = []; 

//				for(var i=0;i<that.oldLanguagePayload.length;i++){
//				var textObject = {};
//				textObject.id = payload.id;
//				textObject.language = that.oldLanguagePayload[i].language;
//				textObject.isActive = that.oldLanguagePayload[i].isActive;
//				textObject.description = that.oldLanguagePayload[i].description;
//				textObject.title= that.oldLanguagePayload[i].title;
//				that.languagePayloadForDirtyBitTest.push(textObject);
//				}

//				var languageDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
//				oldPayload : that.languagePayloadForDirtyBitTest,
//				newPayload : that.chipTextPayload,
//				objectType : "CHIP_TEXTS"
//				});

//				if(languageDeltaObject){
//				if(languageDeltaObject.deletes.length){
//				var i;
//				for(i=0;i<languageDeltaObject.deletes.length;i++){
//				that.deleteBatch.push(oDataModel.createBatchOperation("/CHIP_TEXTS(id='"+languageDeltaObject.deletes[i].id+"',isActive="+languageDeltaObject.deletes[i].isActive+",language='"+languageDeltaObject.deletes[i].language+"')","DELETE"));
//				}
//				}
//				if(languageDeltaObject.updates.length){
//				var i;
//				for(i=0;i<languageDeltaObject.updates.length;i++){
//				that.createBatch.push(oDataModel.createBatchOperation("/CHIP_TEXTS","POST",languageDeltaObject.updates[i]));
//				}
//				}

//				if(that.deleteBatch.length){
//				oDataModel.addBatchChangeOperations(that.deleteBatch);
//				oDataModel.submitBatch(function(data,response,errorResponse){
//				if(errorResponse.length)
//				{       
//				isUpdatesSuccessful = false;
//				return;
//				}
//				var responses = data.__batchResponses[0].__changeResponses;
//				for(var key in responses)
//				if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//				isUpdatesSuccessful = false;      
//				}
//				if(isUpdatesSuccessful) {
//				if(that.createBatch.length){
//				oDataModel.addBatchChangeOperations(that.createBatch);
//				oDataModel.submitBatch(function(data,response,errorResponse){
//				if(errorResponse.length)
//				{       
//				isUpdatesSuccessful = false;
//				return;
//				}
//				var responses = data.__batchResponses[0].__changeResponses;
//				for(var key in responses)
//				if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//				isUpdatesSuccessful = false;      
//				}
//				if(isUpdatesSuccessful) {
//				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//				}
//				},function(error){
//				isUpdatesSuccessful = false;
//				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//				},false);
//				}
//				else{
//				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//				}
//				}
//				},function(error){
//				isUpdatesSuccessful = false;
//				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//				},false);
//				}
//				else{
//				if(that.createBatch.length){
//				oDataModel.addBatchChangeOperations(that.createBatch);
//				oDataModel.submitBatch(function(data,response,errorResponse){
//				if(errorResponse.length)
//				{       
//				isUpdatesSuccessful = false;
//				return;
//				}
//				var responses = data.__batchResponses[0].__changeResponses;
//				for(var key in responses)
//				if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//				isUpdatesSuccessful = false;      
//				}
//				if(isUpdatesSuccessful) {
//				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//				}
//				},function(error){
//				isUpdatesSuccessful = false;
//				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.response.body);
//				},false);
//				}

//				}
//				}
//				}
//				else{
//				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_EDITED_SUCCESSFULLY"));
//				}
//				}, function(err) {
//				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"),err.response.body);
//				});

				//xsjs update
				var finalPayload = [];
				if(that.modelRef.getData().NO_OF_ADDITIONAL_LANGUAGES) {
					for(var i=0;i<that.modelRef.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
						var chipTextObject = {};
						chipTextObject.title = that.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].title;
						chipTextObject.description = that.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].description;
						chipTextObject.id = payload.id;
						chipTextObject.language = that.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].language;
						chipTextObject.isActive = 0;
						that.chipTextPayload.push(chipTextObject);
					}
				}
				that.languagePayloadForDirtyBitTest = []; 
				for(var i=0;i<that.initialData.ADDITIONAL_LANGUAGE_ARRAY.length;i++){
					var textObject = {};
					textObject.id = payload.id;
					textObject.language = that.initialData.ADDITIONAL_LANGUAGE_ARRAY[i].language;
					textObject.isActive = that.initialData.ADDITIONAL_LANGUAGE_ARRAY[i].isActive;
					textObject.description = that.initialData.ADDITIONAL_LANGUAGE_ARRAY[i].description;
					textObject.title= that.initialData.ADDITIONAL_LANGUAGE_ARRAY[i].title;
					that.languagePayloadForDirtyBitTest.push(textObject);
				}
				var languageDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
					oldPayload : that.languagePayloadForDirtyBitTest,
					newPayload : that.chipTextPayload,
					objectType : "CHIP_TEXTS"
				});
				var textsUpdatePayload = {remove:[],create:[]};
				if(languageDeltaObject) {
					if(languageDeltaObject.deletes.length){
						for(var i=0;i<languageDeltaObject.deletes.length;i++){
							textsUpdatePayload.remove.push(languageDeltaObject.deletes[i]);
						}
					}
					if(languageDeltaObject.updates.length){
						for(var i=0;i<languageDeltaObject.updates.length;i++){
							that.createBatch.push(oDataModel.createBatchOperation("/CHIP_TEXTS","POST",languageDeltaObject.updates[i]));
							textsUpdatePayload.create.push(languageDeltaObject.updates[i]);
						}
					}
				}
				finalPayload.push({keys:{id:payload.id, isActive:payload.isActive}, payload:{CHIP:{update:payload}, TEXTS:textsUpdatePayload}});
				that.metadataRef.update("CHIP",finalPayload,null,function(data) {
					serviceStatus = true;
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
				},function(err){
					serviceStatus = false;
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
					that.errorMessages.push({
						"type":"Error",
						"title":that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"),
						"description" : err.responseText
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
				}); 
			}
		}
		return serviceStatus;
	},

	getChipUrl: function(tileType) {
		var chipUrls = {
				"NT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatornumeric/NumericTileChip.xml",
				"CT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorcontribution/ContributionTileChip.xml",
				"HT":	"/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorHarveyBall/HarveyBallTileChip.xml",
				"TT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorArea/AreaChartTileChip.xml",
				"AT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatordeviation/DeviationTileChip.xml",
				"CM" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorcomparison/ComparisonTileChip.xml",
				"DT-CT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorDual/DualTileChip.xml",
				"DT-CM" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorDual/DualTileChip.xml",
				"DT-AT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorDual/DualTileChip.xml",
				"DT-TT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorDual/DualTileChip.xml"
		}
		return chipUrls[tileType];
	},

	populateDimension : function(dataSource, entitySet) {
		dataSource = this.validateQueryServiceURI(dataSource) + "";
		entitySet = entitySet + "";
		var dimensions = [], dimensionDataArray = [], obj = {};
		var i;
		dimensions = sap.suite.ui.smartbusiness.lib.Util.odata.dimensions(dataSource, entitySet).getAsStringArray();
		for (i = 0; i < dimensions.length; i++) {
			obj = {};
			obj.dimensionName = dimensions[i];
			dimensionDataArray.push(obj);
		}
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			dimensions : dimensionDataArray
		});
		return oModel;
	},

	validateQueryServiceURI : function(dataSource) {
		dataSource = jQuery.trim(dataSource);
		if (!jQuery.sap.startsWith(dataSource, "/")) {
			dataSource = "/" + dataSource;
		}
		if (jQuery.sap.endsWith(dataSource, "/")) {
			dataSource = dataSource.substring(0, dataSource.length - 1);
		}
		return dataSource;
	},

	handleDimensionSelectionChange: function(evt) {
		//this.tileConfigurationModel.getData().dimension = evt.getSource().getSelectedItem().getKey();
		evt.getSource().setTooltip(evt.getParameters().selectedItem.getText());
	},

	setGenericDrillDown: function(navType) {
		return (navType == 0) ? true : false;
	},

	setOtherDrillDown: function(navType) {
//		if(navType > 0) {
//		this.getView().byId('selectODD').setVisible(true);
//		} 
//		else {
//		this.getView().byId('selectODD').setVisible(false);
//		}
		return (navType > 0) ? true : false;
	},

	onAfterContextData: function(contextObj) {
		var that = this; 
		this.evaluationObj = contextObj;

		if(this.customMeasuresModel && this.customMeasuresModel.getData()) {
			var customMeasures = this.customMeasuresModel.getData();
			customMeasures.Measures.unshift({COLUMN_NAME: this.evaluationObj.COLUMN_NAME});
			this.customMeasuresModel.setData(customMeasures);
		}

		try {
			this.oModelForEntity = this.populateDimension(contextObj.ODATA_URL, contextObj.ODATA_ENTITYSET);
			this.tileConfigurationModel.getData().dimension = this.oModelForEntity.getData().dimensions[0].dimensionName;
			this.initialData = jQuery.extend(true, {}, this.tileConfigurationModel.getData(), {});
		} catch (err) {

		} finally {
			if (this.oModelForEntity && this.oModelForEntity.getData() && this.oModelForEntity.getData().dimensions && this.oModelForEntity.getData().dimensions.length) {
				this.getView().byId("selectDimension").setModel(this.oModelForEntity, "populateDimension");
			} else {
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("UNABLE_TO_FETCH_NAVIG"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("UNABLE_TO_FETCH_NAVIG")
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			}
		}

		if(this.appMode == "addTile") {
			that.selectTile('NT');
			that.getView().byId('NT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));

			that.currentLocaleLanguage = that.languagesObject.LAISO[sap.ui.getCore().getConfiguration().getLanguage().split("-")[0].toUpperCase()];

			var texts_entity = "/EVALUATIONS_CHIP_TEXTS?$filter=ID eq '" + contextObj.ID + "' and IS_ACTIVE eq 1"; 

			that.oApplicationFacade.getODataModel().read(texts_entity,null,null,true,function(data) {
				that.evaluationDetails = that.evaluationDetails || {};
				that.evaluationDetails.TEXTS = [];
				var obj = {};
				for(var i=0,l=data.results.length; i<l; i++) {
					obj = {};
					obj.language = data.results[i].LANGUAGE;
					obj.title = data.results[i].TITLE;
					obj.description = data.results[i].DESCRIPTION;
					that.evaluationDetails.TEXTS.push(obj);
				}
			}, function(err) {
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"),
					"description" : err.response.body
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			});

			this.updateFooterButtons(null);   
			this.tileConfigurationModel.setData({evaluationId:contextObj.ID,title:contextObj.INDICATOR_TITLE,description:contextObj.TITLE,semanticObject:(contextObj.SEMANTIC_OBJECT || ''),action:(contextObj.ACTION || ''),storyId:'',tileType:'NT',navType:0});
			this.initialData = jQuery.extend(true, {}, this.tileConfigurationModel.getData(), {});

			this.tempSemanticObject = contextObj.SEMANTIC_OBJECT || "";
			this.onLoadSemanticObject = this.tempSemanticObject;
			this.tempAction = contextObj.ACTION || "";

			var multiMeasureModel = new sap.ui.model.json.JSONModel();
			multiMeasureModel.setData({MULTI_MEASURE:[{COLUMN_NAME:that.evaluationObj.COLUMN_NAME,semanticColor:"Error"},{COLUMN_NAME:"",semanticColor:"Critical"},{COLUMN_NAME:"",semanticColor:"Good"}]});
			this.getView().setModel(multiMeasureModel,"multiMeasures");

		}
	},

	onAfterChipContextData: function(contextObj) {
		var that = this;
		this.currentContextState = contextObj.isActive;
		this.currentChipId = contextObj.id;

		this.updateFooterButtons(contextObj);
		if(this.appMode == "editTile") {
			var configuration = JSON.parse(contextObj.configuration);
			var appParameters = [];
			if(JSON.parse(configuration.tileConfiguration).ADDITIONAL_APP_PARAMETERS) {
				appParameters = JSON.parse(JSON.parse(configuration.tileConfiguration).ADDITIONAL_APP_PARAMETERS);
			}

			var evaluation = {};
			var multiMeasures = {MULTI_MEASURE:[]}
			if(JSON.parse(configuration.tileConfiguration).EVALUATION) {
				evaluation = JSON.parse(JSON.parse(configuration.tileConfiguration).EVALUATION);
				var multiMeasureModel = new sap.ui.model.json.JSONModel();
				if(evaluation.COLUMN_NAMES && evaluation.COLUMN_NAMES.length) {
					for(var i=0,l=evaluation.COLUMN_NAMES.length; i<l; i++) {
						multiMeasures.MULTI_MEASURE.push({COLUMN_NAME:evaluation.COLUMN_NAMES[i].COLUMN_NAME, semanticColor:evaluation.COLUMN_NAMES[i].semanticColor});
					}
					if(multiMeasures.MULTI_MEASURE && multiMeasures.MULTI_MEASURE.length == 2) {
						multiMeasures.MULTI_MEASURE.push({COLUMN_NAME:"", semanticColor:"Good"});
					}
					multiMeasureModel.setData(multiMeasures);
					this.getView().setModel(multiMeasureModel,"multiMeasures");
				}
				else {
					multiMeasureModel.setData({MULTI_MEASURE:[{COLUMN_NAME:that.evaluationObj.COLUMN_NAME,semanticColor:"Error"},{COLUMN_NAME:"",semanticColor:"Critical"},{COLUMN_NAME:"",semanticColor:"Good"}]});
					this.getView().setModel(multiMeasureModel,"multiMeasures");
				}

			}

			var tileProperties = JSON.parse(JSON.parse(configuration.tileConfiguration).TILE_PROPERTIES); 

			contextObj.semanticObject = tileProperties.semanticObject;
			that.onLoadSemanticObject = contextObj.semanticObject;
			contextObj.action = tileProperties.semanticAction;

			this.tempSemanticObject = contextObj.semanticObject || "";
			this.tempAction = contextObj.action || "";

			contextObj.navType = tileProperties.navType || "0";
			contextObj.sortOrder = tileProperties.sortOrder || undefined;
			contextObj.dimension = tileProperties.dimension || undefined;

			if(contextObj.navType.toString() == "1") {
				this.lumiraSemanticObject = contextObj.semanticObject;
				this.lumiraAction = contextObj.action;
				this.apfSemanticObject = this.APF_SEMANTIC_OBECT;
				this.apfAction = this.APF_ACTION;
				this.adhocAnalysisSemanticObject = this.ADHOC_ANALYSIS_SEMANTIC_OBECT;
				this.adhocAnalysisAction = this.ADHOC_ANALYSIS_ACTION;
			}
			else if(contextObj.navType.toString() == "2") {
				this.apfSemanticObject = contextObj.semanticObject;
				this.apfAction = contextObj.action;
				this.lumiraSemanticObject = this.LUMIRA_SEMANTIC_OBECT;
				this.lumiraAction = this.LUMIRA_ACTION;
				this.adhocAnalysisSemanticObject = this.ADHOC_ANALYSIS_SEMANTIC_OBECT;
				this.adhocAnalysisAction = this.ADHOC_ANALYSIS_ACTION;
			}
			else if(contextObj.navType.toString() == "5") {
				this.adhocAnalysisSemanticObject = contextObj.semanticObject;
				this.adhocAnalysisAction = contextObj.action;
				this.lumiraSemanticObject = this.LUMIRA_SEMANTIC_OBECT;
				this.lumiraAction = this.LUMIRA_ACTION;
				this.apfSemanticObject = this.APF_SEMANTIC_OBECT;
				this.apfAction = this.APF_ACTION;
			}
			else {
				this.apfSemanticObject = this.APF_SEMANTIC_OBECT;
				this.apfAction = this.APF_ACTION;
				this.lumiraSemanticObject = this.LUMIRA_SEMANTIC_OBECT;
				this.lumiraAction = this.LUMIRA_ACTION;
				this.adhocAnalysisSemanticObject = this.ADHOC_ANALYSIS_SEMANTIC_OBECT;
				this.adhocAnalysisAction = this.ADHOC_ANALYSIS_ACTION;
			}

			this.byId('selectTileType').setSelectedKey(contextObj.tileType);
			this.selectTile(contextObj.tileType);

			if(Number(contextObj.navType) == 1) {
				contextObj.storyId = tileProperties.storyId;
			}
			else {
				contextObj.storyId = "";
			}

			this.tileConfigurationModel.setData(contextObj);
			this.initialData = jQuery.extend(true, {}, this.tileConfigurationModel.getData(), {});

			if(Number(contextObj.navType)) {
				this.byId("selectNavType").setSelectedKey(contextObj.navType);
				this.getSelectedRadioButton(null,"ODD");
			}
			else {
				this.getSelectedRadioButton(null,"GDD");
			}

			//this.handleSemanticObjectChange(null, contextObj.semanticObject);

			var parametersJson = [];

			if(appParameters && Object.keys(appParameters).length) {
				for(var key in appParameters) {
					if(appParameters.hasOwnProperty(key)) {
						parametersJson.push({NAME:key, VALUE:appParameters[key]});
					}
				}
			}
			this.byId("propertyNameValueBox").getModel("appParameters").setData({PROPERTIES:parametersJson});
			this.initialAppParameters = jQuery.extend(true, [], (this.appParametersModel.getData().PROPERTIES || []));
		}
	},

	addNewProperty : function() {
		var that = this;
		if (this.getView().byId("appPropertyName").getValue()) {
			this.getView().byId("appPropertyName").setValueState("None");
			if (this.getView().byId("appPropertyValue").getValue()) {
				this.getView().byId("appPropertyValue").setValueState("None");
				var properties = this.modelRef.getData().CHIP.APP_PARAMETERS;
				properties = properties || [];
				if(this.checkForDuplicateProperty()) {
					properties.push({
						NAME : this.getView().byId("appPropertyName").getValue(),
						VALUE : this.getView().byId("appPropertyValue").getValue()
					});
					this.getView().byId("appPropertyName").setValue("");
					this.getView().byId("appPropertyValue").setValue("");
					var dataRef = this.modelRef.getData();
					dataRef.CHIP.APP_PARAMETERS = properties;
					this.modelRef.setData(dataRef);
				}
			} else {
				that.isPropertyAdded = false;
				this.getView().byId("appPropertyValue").setValueState("Error");
				this.getView().byId("appPropertyValue").setValueStateText(this.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_VALUE"));
				sap.m.MessageToast.show(this.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_VALUE"));
			}
		} else {
			that.isPropertyAdded = false;
			this.getView().byId("appPropertyName").setValueState("Error");
			this.getView().byId("appPropertyName").setValueStateText(this.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_NAME"));
			sap.m.MessageToast.show(this.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_NAME"));
		}
	},

	removeProperty : function(evt) { 
		var path = evt.getSource().getBindingContext("tileConfig").getPath();
		evt.getSource().getBindingContext("tileConfig").getModel().getData().CHIP.APP_PARAMETERS.splice(path.substring(path.lastIndexOf("/") + 1), 1);
		evt.getSource().getBindingContext("tileConfig").getModel().updateBindings();
	},

	getAllFooterButtons: function() {
		var that = this;
		var buttonsList = [{
			sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("DELETE_DRAFT"),
			onBtnPressed : function(evt) {
				this.errorMessages=[];
				this.errorState=false;
				sap.m.MessageBox.show(
						that.oApplicationFacade.getResourceBundle().getText("WANT_TO_DELETE_SELECTED_TILE"),
						"sap-icon://hint",
						that.oApplicationFacade.getResourceBundle().getText("DELETE"),
						[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
						function(evt){
							if(evt=="OK"){
								//odata remove
//								that.oApplicationFacade.getODataModel().remove(that.chipContext.sPath,null,function(data) {
//								sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
//								that.oApplicationFacade.getODataModel().refresh();
//								that.oRouter.navTo("detail",{
//								contextPath: that.context.sPath.substr(1)
//								});
//								},function(err){
//								sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.response.body);
//								});

								//xsjs remove
								that.errorMessages=[];
								that.errorState = false;
								that.metadataRef.remove("CHIP",{payload:{id:that.currentChipId,isActive:that.currentContextState}},function(data) {
									sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
									//that.oApplicationFacade.getODataModel().refresh();
									that.refreshMasterList();
									sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
								},function(err){
//									sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.response.body);
//									that.errorMessages.push({
//									"type":"Error",
//									"title":that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"),
//									"description" : err.response.body
//									});
//									sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
								});

							}
							if(evt=="CANCEL"){

							}
						}
				);
			},
		}, {
			sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("SAVE") + ' and ' + that.oApplicationFacade.getResourceBundle().getText("ACTIVATE"),
			onBtnPressed : function(evt) {

				that.errorMessages=[];
				that.errorState = false;

				var dataRef = that.modelRef.getData();
				var data = dataRef.CHIP;

				var errorLog = "";
				var configuration = null;
				errorLog = that.checkForValidChipForActivation();
				if(errorLog) {
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), errorLog);
					that.errorMessages.push({
						"type":"Error",
						"title":that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"),
						"description" : errorLog
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);

				}
				else {

					//usability improvement - Save appParams without explicit click on "+"
					that.isPropertyAdded = true;
					if(that.getView().byId("appPropertyName").getValue() || that.getView().byId("appPropertyValue").getValue()){
						that.addNewProperty();
					}
					if(!that.isPropertyAdded){
						return;
					}
					configuration = that.formChipConfiguration();
					function publishChipCallBack(data) {
						try {
							that.currentChipId = JSON.parse(data).response[0].id;
						}
						catch(e) {
							that.currentChipId = that.currentChipId || null; 
						}
						finally {
							that.metadataRef.create("ACTIVATE_CHIP",{id:that.currentChipId},null,function(data) {
								sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_SUCCESSFUL"));
								//that.oApplicationFacade.getODataModel().refresh();
								that.oApplicationFacade.__tileModified = true;
								that.refreshMasterList();
								sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
							},function(err){
								sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), err.responseText);
								that.errorMessages.push({
									"type":"Error",
									"title":that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"),
									"description" : err.responseText
								});
								sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
							});
						}
					}
					function publishChipErrCallBack(err) {
						sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
						that.errorMessages.push({
							"type":"Error",
							"title":that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"),
							"description" : err.responseText
						});
						sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
					}
					mode = that.createMode ? "create" : (that.editMode ? "edit" : "edit");
					that.mode = mode;
					that.metadataRef.publishChip(configuration, mode, that, publishChipCallBack, publishChipErrCallBack);

				}
				that.setFooterOnError();
			},
		},{
			sI18nBtnTxt : "SAVE_AND_CONFIG_DRILLDOWN",
			onBtnPressed : function(evt) {
				that.handleNavToDrillDown();
			}
		}, {
			sI18nBtnTxt : "SAVE_CREATE_NEW",
			onBtnPressed : function(evt) {

				//usability improvement - Save appParams without explicit click on "+"
				that.isPropertyAdded = true;
				that.errorMessages=[];
				that.errorState = false;

				if(that.getView().byId("appPropertyName").getValue() || that.getView().byId("appPropertyValue").getValue()){
					that.addNewProperty();
				}
				if(!that.isPropertyAdded){
					return;
				}

				var configuration = that.formChipConfiguration();

				function publishChipCallBack(data) {
					try {
						that.currentChipId = JSON.parse(data).response[0].id;
					}
					catch(e) {

					}
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
					if(that.appMode == "addTile") {
						var hashObj = hasher || window.hasher;
						var currentHash = hasher.getHash();
						sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action: "configureSBKPITile"});
						setTimeout(function(){
							sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({hash: "#"+currentHash}, true);
						},0);
					}
					else {
						sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"addTile", context: that.context.sPath.substr(1)});
					}
				}
				function publishChipErrCallBack(err) {
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
					that.errorMessages.push({
						"type":"Error",
						"title":that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"),
						"description" : err.responseText
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
				}

				mode = that.createMode ? "create" : (that.editMode ? "edit" : "edit");
				that.mode = mode;
				that.metadataRef.publishChip(configuration, mode, that, publishChipCallBack, publishChipErrCallBack);
				that.setFooterOnError();
			}
		}, {
			sI18nBtnTxt : "CANCEL",
			onBtnPressed : function(evt) {
				that.handleBackAndCancel();
			}
		}

		];
		return buttonsList;

	},

	updateFooterButtons: function(chipObj) {
		var buttonsList = this.getAllFooterButtons();
		this.oHeaderFooterOptions.buttonList = [];
		this.oErrorOptionsForDraft={
				bSuppressBookmarkButton: {},
				onBack: function() {
					that.handleBackAndCancel();
				},
				oNegativeAction :{
					sControlId : "errorBtn",
					sId : "errorBtn",
					sIcon : "sap-icon://alert",
					bDisabled : false,
					onBtnPressed : function(event){
						that.utilsRef.handleMessagePopover(event,that);
					}
				},
				buttonList : []
		};
		this.oErrorOptionsForDraft.buttonList.push({
			sI18nBtnTxt : "SAVE",
			onBtnPressed : function(evt) {
				that.saveTile();
			}
		});
		if(chipObj && chipObj.CHIP) {
			if((!(chipObj.CHIP.isActive)) && (this.editMode)) {
				this.oHeaderFooterOptions.buttonList.push(buttonsList[0]);
				this.oErrorOptionsForDraft.buttonList.push(this.oHeaderFooterOptions.buttonList[0]);
			}
		}
		for(var i=1,l=buttonsList.length; i<l; i++) {
			if(i==2) {
//				if(chipObj.CHIP && (chipObj.CHIP.isActive == 1)) {
//	this.oHeaderFooterOptions.buttonList.push(buttonsList[i]);
//}
if(chipObj.CHIP && (chipObj.CHIP.navType == "2" || chipObj.CHIP.navType == "0")) {
	this.oHeaderFooterOptions.buttonList.push(buttonsList[i]);
	this.oErrorOptionsForDraft.buttonList.push(this.oHeaderFooterOptions.buttonList[i]);
}
			}
			else {
				this.oHeaderFooterOptions.buttonList.push(buttonsList[i]);
				this.oErrorOptionsForDraft.buttonList.push(this.oHeaderFooterOptions.buttonList[i]);
			}

		}

		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	},

	checkForDuplicateProperty: function() {
		var that = this;
		var properties = this.modelRef.getData().CHIP.APP_PARAMETERS;
		var property = this.getView().byId("appPropertyName").getValue();
		var value = this.getView().byId("appPropertyValue").getValue();
		if(!isNaN(Number(property))) {
			this.getView().byId("appPropertyName").setValueState("Error");
			this.getView().byId("appPropertyName").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_PROPERTY_NOT_STRING"));
			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ERROR_PROPERTY_NOT_STRING"));
			return false;
		}
		for(var i=0,l=properties.length; i<l; i++) {
			if((properties[i].NAME == property)) {
				if(properties[i].NAME == property) {
					this.getView().byId("appPropertyName").setValueState("Error");
					this.getView().byId("appPropertyName").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_MULTIPLE_VALUES_FOR_PROPERTY"));
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ERROR_MULTIPLE_VALUES_FOR_PROPERTY"));
				}
				return false;
			} 
		}
		return true;
	},

	inputNameChange: function(evt) {
		var that = this;
		var property = evt.getSource().getValue();
		var index = Number(evt.getSource().getBindingContext("tileConfig").sPath[evt.getSource().getBindingContext("tileConfig").sPath.length - 1]);
		var properties = this.modelRef.getData().CHIP.APP_PARAMETERS;
		for(var i=0,l=properties.length; i<l; i++) {
			if(i == index) {
				continue;
			}
			if(properties[i].NAME == property) {
				evt.getSource().setValueState("Error");
				evt.getSource().setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_MULTIPLE_VALUES_FOR_PROPERTY"));
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ERROR_MULTIPLE_VALUES_FOR_PROPERTY"));
				return;
			}
		}
		evt.getSource().setValueState("None");
	},

	inputValueChange: function(evt) {
		var that = this;
		var value = evt.getSource().getValue();
		var property = evt.getSource().getBindingContext("tileConfig").getObject().NAME;
		var index = Number(evt.getSource().getBindingContext("tileConfig").sPath[evt.getSource().getBindingContext("tileConfig").sPath.length - 1]);
		var properties = this.modelRef.getData().CHIP.APP_PARAMETERS;
		for(var i=0,l=properties.length; i<l; i++) {
			if(i == index) {
				continue;
			}
			if(properties[i].NAME == property && properties[i].VALUE == value) {
				evt.getSource().setValueState("Error");
				evt.getSource().setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_PROPERTY_VALUE"));
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_PROPERTY_VALUE"));
			}
		}
	},

	onAfterRendering: function() {
		var that = this;
//		if(this.appMode == "addTile") {
//		this.getView().byId('NT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
//		}
//		this.initialData = jQuery.extend(true, {}, this.tileConfigurationModel.getData(), {});
	},

	handleSemanticObjectChange: function(evt) {
		this.tempSemanticObject = evt.getSource().getValue();
		if(this.tempSemanticObject) {
			evt.getSource().setValueState("None");
		}
		if(this.tempSemanticObject.indexOf(" ") > -1) {
			evt.getSource().setValueState("Error");
			evt.getSource().setValueStateText(this.oApplicationFacade.getResourceBundle().getText("INVALID_SEMANTIC_OBJECT"));
		}
		if(this.modelRef.getData().CHIP.navType.toString() == "2") {
			this.apfSemanticObject = evt.getSource().getValue();
		}
		if(this.modelRef.getData().CHIP.navType.toString() == "1") {
			this.lumiraSemanticObject = evt.getSource().getValue();
		}
		if(this.modelRef.getData().CHIP.navType.toString() == "5") {
			this.adhocAnalysisSemanticObject = evt.getSource().getValue();
		}
		if(this.modelRef.getData().CHIP.navType.toString() == "0" || this.modelRef.getData().CHIP.navType.toString() == "4") {
			this.onLoadSemanticObject = evt.getSource().getValue();
		}
	},

	setSemanticAction: function(evt) {
		this.tempAction = evt.getSource().getValue();
		if(this.tempAction) {
			evt.getSource().setValueState("None");
		}
		if(this.tempAction.indexOf(" ") > -1) {
			evt.getSource().setValueState("Error");
			evt.getSource().setValueStateText(this.oApplicationFacade.getResourceBundle().getText("INVALID_SEMANTIC_ACTION"));
		}
		if(this.modelRef.getData().CHIP.navType.toString() == "2") {
			this.apfAction = evt.getSource().getValue();
		}
		if(this.modelRef.getData().CHIP.navType.toString() == "1") {
			this.lumiraAction = evt.getSource().getValue();
		}
	},

	subTitleChange: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	titleChange: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	appPropertyNameChange: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	appPropertyValueChange: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	setStoryId: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
		if(evt.getSource().getValue().indexOf(" ") > -1) {
			evt.getSource().setValueState("Error");
			evt.getSource().setValueStateText(this.oApplicationFacade.getResourceBundle().getText("INVALID_STORY_ID"));
		}
	},

	setAPFConfId: function(evt) {
		if(evt.getSource().getValue()) {
			evt.getSource().setValueState("None");
		}
	},

	handleStoryIdValueHelp: function() {
		var that = this;
		var viewName = this.modelRef.getData().EVALUATION.VIEW_NAME;
		var storyIdValueHelpDialog = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("STORY_ID"),
			noDataText : that.oApplicationFacade.getResourceBundle().getText("NO_DATA_FOUND"),
			items : {
				path : "/Stories",
				template : new sap.m.StandardListItem({
					title : "{NAME}",
					description : "{UUID}"
				})
			},
			confirm : function(oEvent) {
				that.modelRef.getData().CHIP.storyId = oEvent.getParameter("selectedItem").getProperty("description");
				that.byId("selectStoryId").setValueState("None");
				that.getView().getModel("tileConfig").setData(that.modelRef.getData());
				//that.byId("selectStoryId").setValue(that.tileConfigurationModel.getData().storyId);
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterPackage = new sap.ui.model.Filter("tolower(NAME)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterObject = new sap.ui.model.Filter("tolower(UUID)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				var oFilterContent = new sap.ui.model.Filter([oFilterPackage, oFilterObject], false);
				if(viewName) {
					var oFilterViewName = new sap.ui.model.Filter("VIEW_NAME",sap.ui.model.FilterOperator.EQ,viewName);
					oBinding.filter(new sap.ui.model.Filter([oFilterContent, oFilterViewName], true));
				}
				else {
					oBinding.filter(oFilterContent);
				}
			}
		});
		storyIdValueHelpDialog.open();
		that.oDataStoryIdModel = that.oDataStoryIdModel || new sap.ui.model.odata.ODataModel("/sap/bi/launchpad/integration/smb.xsodata",true);
		storyIdValueHelpDialog.setModel(that.oDataStoryIdModel);
		if(viewName) {
			storyIdValueHelpDialog.getBinding("items").filter([new sap.ui.model.Filter("VIEW_NAME",sap.ui.model.FilterOperator.EQ,viewName)]);
			that.getView().getModel("tileConfig").setData(that.modelRef.getData());
		}
	},

	handleAPFConfigIdValueHelp: function() {
		var that = this;
		var semanticObject = that.modelRef.getData().CHIP.semanticObject;
		var action = that.modelRef.getData().CHIP.semanticAction;
		that.jsonApfConfigIdModel = that.jsonApfConfigIdModel || new sap.ui.model.json.JSONModel();

		var apfConfigIdValueHelpDialog = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("CONFIG_ID"),
			noDataText : that.oApplicationFacade.getResourceBundle().getText("NO_DATA_FOUND"),
			items : {
				path : "/AnalyticalConfigForSemObjQueryResults",
				template : new sap.m.StandardListItem({
					title : "{AnalyticalConfigurationName}",
					description : "{AnalyticalConfiguration}"
				})
			},
			confirm : function(oEvent) {
				that.modelRef.getData().CHIP.apfConfId = oEvent.getParameter("selectedItem").getBindingContext().getProperty("AnalyticalConfiguration");
				that.modelRef.getData().CHIP.apfConfName = oEvent.getParameter("selectedItem").getBindingContext().getProperty("AnalyticalConfigurationName");
				that.modelRef.getData().CHIP.apfAppId = oEvent.getParameter("selectedItem").getBindingContext().getProperty("Application");
				that.byId("apfConfId").setValueState("None");
				that.getView().getModel("tileConfig").setData(that.modelRef.getData());
			},
			liveChange : function(oEvent) {
				var searchValue = oEvent.getParameter("value");
				var oFilterPackage = new sap.ui.model.Filter("AnalyticalConfigurationName", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterObject = new sap.ui.model.Filter("AnalyticalConfiguration", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterContent = new sap.ui.model.Filter([oFilterPackage, oFilterObject], false);
				var oFilterSemanticObject = new sap.ui.model.Filter("SemanticObject",sap.ui.model.FilterOperator.EQ,semanticObject);
				var oBinding = oEvent.getSource().getBinding("items");
				if(semanticObject) {
					oBinding.filter(new sap.ui.model.Filter([oFilterContent, oFilterSemanticObject], true));	
				}
				else {
					oBinding.filter(new sap.ui.model.Filter(oFilterContent));
				}

			}
		});
		apfConfigIdValueHelpDialog.open();

		that.oDataApfConfigIdModel = that.oDataApfConfigIdModel || new sap.ui.model.odata.ODataModel("/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata",true);
//		apfConfigIdValueHelpDialog.setModel(that.oDataApfConfigIdModel);
//		if(semanticObject) {
//		apfConfigIdValueHelpDialog.getBinding("items").filter([new sap.ui.model.Filter("SemanticObject",sap.ui.model.FilterOperator.EQ,semanticObject)]);
//		}

		function apfConfigurationCallBack(data) {
			if((semanticObject !== that.APF_SEMANTIC_OBECT) || (action !== that.APF_ACTION)) {
				data.unshift({AnalyticalConfigurationName:"", AnalyticalConfiguration:"", Application:""});
			}
			that.jsonApfConfigIdModel.setData({AnalyticalConfigForSemObjQueryResults:data});
			apfConfigIdValueHelpDialog.setModel(that.jsonApfConfigIdModel);
		}

		function apfConfigurationErrCallBack(d,s,x) {
			var data = [];

			data.unshift({AnalyticalConfigurationName:"", AnalyticalConfiguration:"", Application:""});
			that.jsonApfConfigIdModel.setData({AnalyticalConfigForSemObjQueryResults:data});
			apfConfigIdValueHelpDialog.setModel(that.jsonApfConfigIdModel);
		}

		that.metadataRef.getDataByEntity({entity:"AnalyticalConfigForSemObjQueryResults", filter:semanticObject ? "SemanticObject eq '" + semanticObject +"'" : undefined, success:apfConfigurationCallBack, error:apfConfigurationErrCallBack, model:that.oDataApfConfigIdModel});

	},

	handleCustomMeasure: function(evt) {
		var that = this;
		var currentInput = evt.getSource();
		this.customMeasuresDialog = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("CHOOSE_ADDL_MEASURE"),
			noDataText : that.oApplicationFacade.getResourceBundle().getText("NO_DATA_FOUND"),
			items : {
				path : "tileConfig>/ADDITIONAL_MEASURES/Measures",
				template : new sap.m.StandardListItem({
					title : "{tileConfig>COLUMN_NAME}"
				})
			},
			confirm : function(oEvent) {
				var value = oEvent.getParameter("selectedItem").getProperty("title");
				currentInput.setValue(value);
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterPackage = new sap.ui.model.Filter("tolower(COLUMN_NAME)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage], false));
			}
		});
		this.customMeasuresDialog.open();
		this.customMeasuresDialog.setModel(this.modelRef, "tileConfig");
	},

	addAdditionalLanguageDialog : function(){
		var that=this;
		var modelData = this.getView().getModel("tileConfig").getData();

		this.languageTextInput = new sap.m.Input({
			layoutData : new sap.ui.layout.GridData({
				span : "L8 M8 S8"
			})
		});
		this.languageDescriptionInput = new sap.m.Input({
			layoutData : new sap.ui.layout.GridData({
				span : "L8 M8 S8"
			})
		});
		this.languageKeySelect = new sap.m.Select({
			layoutData : new sap.ui.layout.GridData({
				span : "L6 M6 S6"
			})
		});
		this.addedLanguagesList = new sap.m.List({
			layoutData : new sap.ui.layout.GridData({
				span : "L5 M5 S5"
			}),
		}).setModel(that.getView().getModel("tileConfig"),"tileConfig");

		this.addedLanguagesList.bindItems("tileConfig>/ADDITIONAL_LANGUAGE_ARRAY", new sap.m.CustomListItem({
			content : new sap.ui.layout.Grid({
				hSpacing: 1,
				vSpacing: 0,
				defaultSpan : "L12 M12 S12",
				content: [
				          new sap.m.Input({
				        	  value : "{tileConfig>title}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L12 M12 S12",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{tileConfig>description}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L6 M6 S6",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{tileConfig>isoLanguage}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L4 M4 S4"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Button({
				        	  icon : "sap-icon://sys-cancel",
				        	  type : "Transparent",
				        	  press : function(oEvent){
				        		  var path = oEvent.getSource().getBindingContext("tileConfig").getPath();
				        		  var deletedIndex = Number(path.substr(path.lastIndexOf("/") + 1));
				        		  var newData = that.addedLanguagesList.getModel("tileConfig").getData().ADDITIONAL_LANGUAGE_ARRAY.splice(deletedIndex,1);
				        		  that.addedLanguagesList.getModel("tileConfig").getData().NO_OF_ADDITIONAL_LANGUAGES = that.addedLanguagesList.getModel("tileConfig").getData().ADDITIONAL_LANGUAGE_ARRAY.length;
				        		  that.addedLanguagesList.getModel("tileConfig").updateBindings();
				        	  },
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L2 M2 S2"
				        	  })
				          })
				          ]
			})
		}));

		var additionalLanguageDialog = new sap.m.Dialog({
			contentHeight : "50%",
			contentWidth : "25%",
			title : that.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE"),
			content :  [
			            new sap.ui.layout.Grid({
			            	hSpacing: 1,
			            	vSpacing: 4,
			            	defaultSpan : "L12 M12 S12",
			            	content: [
			            	          new sap.ui.layout.form.SimpleForm({
			            	        	  editable:true, 
			            	        	  layout:"ResponsiveGridLayout", 
			            	        	  content : [
			            	        	             new sap.m.Label({
			            	        	            	 text : that.oApplicationFacade.getResourceBundle().getText("TITLE"),
			            	        	            	 textAlign : "Right",
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),

			            	        	             that.languageTextInput,

			            	        	             new sap.m.Label({
			            	        	            	 text : that.oApplicationFacade.getResourceBundle().getText("SUB_TITLE"),
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),

			            	        	             that.languageDescriptionInput,

			            	        	             new sap.m.Label({
			            	        	            	 text : that.oApplicationFacade.getResourceBundle().getText("LANGUAGE")+":",
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3"
			            	        	            	 })
			            	        	             }),

			            	        	             that.languageKeySelect,

			            	        	             new sap.m.Button({
			            	        	            	 icon:"sap-icon://add",
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L2 M2 S2"
			            	        	            	 }),
			            	        	            	 press : function(){

			            	        	            		 if(that.languageTextInput.getValue() || that.languageDescriptionInput.getValue()){
			            	        	            			 for(var i=0;i<that.addedLanguagesList.getModel("tileConfig").getData().ADDITIONAL_LANGUAGE_ARRAY.length;i++){
			            	        	            				 if(that.addedLanguagesList.getModel("tileConfig").getData().ADDITIONAL_LANGUAGE_ARRAY[i].isoLanguage === that.languageKeySelect.getSelectedItem().getText()){
			            	        	            					 sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_LANGUAGE_EXISTS",that.languageKeySelect.getSelectedItem().getText()));
			            	        	            					 return;
			            	        	            				 }
			            	        	            			 }
			            	        	            			 var addedLanguageObject = {
			            	        	            					 "title" : that.languageTextInput.getValue(),
			            	        	            					 "description" : that.languageDescriptionInput.getValue(),
			            	        	            					 "isoLanguage" : that.languageKeySelect.getSelectedItem().getText(),
			            	        	            					 "language" : that.languageKeySelect.getSelectedKey()
			            	        	            			 };
			            	        	            			 that.addedLanguagesList.getModel("tileConfig").getData().ADDITIONAL_LANGUAGE_ARRAY.push(addedLanguageObject);
			            	        	            			 that.addedLanguagesList.getModel("tileConfig").getData().NO_OF_ADDITIONAL_LANGUAGES = that.addedLanguagesList.getModel("tileConfig").getData().ADDITIONAL_LANGUAGE_ARRAY.length;
			            	        	            			 that.addedLanguagesList.getModel("tileConfig").updateBindings();
			            	        	            			 that.languageTextInput.setValue("");
			            	        	            			 that.languageDescriptionInput.setValue("");
			            	        	            		 }
			            	        	            	 }
			            	        	             })
			            	        	             ]
			            	          })
			            	          ]
			            }).addStyleClass("languageGrid"),

			            that.addedLanguagesList
			            ],

			            beginButton : new sap.m.Button({
			            	text : that.oApplicationFacade.getResourceBundle().getText("OK"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            	}
			            }),
			            endButton : new sap.m.Button({
			            	text : that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
			            	press : function(){
			            		// revert to initial model
			            		var dataRef = that.modelRef.getData();
			            		dataRef.ADDITIONAL_LANGUAGE_ARRAY = onLoadData.ADDITIONAL_LANGUAGE_ARRAY;
			            		dataRef.NO_OF_ADDITIONAL_LANGUAGES = onLoadData.NO_OF_ADDITIONAL_LANGUAGES;
			            		that.modelRef.setData(dataRef);
			            		additionalLanguageDialog.close();
			            	}
			            })
		});

		var data = modelData.SAP_LANGUAGE_ARRAY;

		for(var i=0;i<data.length;i++){
			if((data[i].LAISO).toUpperCase() == (sap.ui.getCore().getConfiguration().getLocale().getLanguage()).toUpperCase()){
				data.splice(i,1);
			}
		}
		that.languageKeySelect.setModel(this.getView().getModel("tileConfig"), "tileConfig");
		that.languageKeySelect.bindItems("tileConfig>/SAP_LANGUAGE_ARRAY", new sap.ui.core.Item({
			text: "{tileConfig>LAISO}",
			key: "{tileConfig>SPRAS}"
		}));

		additionalLanguageDialog.open();
		var onLoadData = jQuery.extend(true, {}, this.modelRef.getData(), {});
	},

	hasUIChanged: function() {
		var that = this;
		var obj = {};
		var oldPayload = that.initialData;
		var newPayload = jQuery.extend(true, {}, that.modelRef.getData(), {});

		if(JSON.stringify(oldPayload) == JSON.stringify(newPayload)) {
			return false;
		}
		
		var appParameters = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
			oldPayload : oldPayload.CHIP.APP_PARAMETERS,
			newPayload : newPayload.CHIP.APP_PARAMETERS,
			objectType : "APP_PARAMETERS"
		});

		obj.oldPayload = oldPayload.CHIP;
		delete obj.oldPayload.APP_PARAMETERS;
		delete obj.oldPayload.MULTI_MEASURE; 
		delete obj.oldPayload.appParameters;
		delete obj.oldPayload.configurationObj;
		delete obj.oldPayload.HARVEY_DIMENSION;
		delete obj.oldPayload.harveyFilters;
		obj.newPayload = newPayload.CHIP;
		delete obj.newPayload.APP_PARAMETERS;
		delete obj.newPayload.MULTI_MEASURE; 
		delete obj.newPayload.appParameters;
		delete obj.newPayload.configurationObj;
		delete obj.newPayload.HARVEY_DIMENSION;
		delete obj.newPayload.harveyFilters;		
		obj.objectType = "Chips";
		obj = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(obj);
		that.chipTextPayload = [];
		if(newPayload.NO_OF_ADDITIONAL_LANGUAGES) {
			for(var i=0;i<newPayload.NO_OF_ADDITIONAL_LANGUAGES.length;i++){
				var chipTextObject = {};
				chipTextObject.title = newPayload.ADDITIONAL_LANGUAGE_ARRAY[i].title;
				chipTextObject.description = newPayload.ADDITIONAL_LANGUAGE_ARRAY[i].description;
				chipTextObject.language = newPayload.ADDITIONAL_LANGUAGE_ARRAY[i].language;
				that.chipTextPayload.push(chipTextObject);
			}
		}
		that.languagePayloadForDirtyBitTest = []; 
		for(var i=0;i<oldPayload.NO_OF_ADDITIONAL_LANGUAGES.length;i++){
			var textObject = {};
			textObject.language = oldPayload.NO_OF_ADDITIONAL_LANGUAGES[i].language;
			textObject.description = oldPayload.NO_OF_ADDITIONAL_LANGUAGES[i].description;
			textObject.title= oldPayload.NO_OF_ADDITIONAL_LANGUAGES[i].title;
			that.languagePayloadForDirtyBitTest.push(textObject);
		}
		var languageDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
			oldPayload : that.languagePayloadForDirtyBitTest,
			newPayload : that.chipTextPayload,
			objectType : "CHIP_TEXTS"
		});

		if((obj && obj.updates && obj.updates.length) || (languageDeltaObject && languageDeltaObject.deletes && languageDeltaObject.deletes.length) || (languageDeltaObject && languageDeltaObject.updates && languageDeltaObject.updates.length) || (appParameters && appParameters.deletes && appParameters.deletes.length) || (appParameters && appParameters.updates && appParameters.updates.length)) {
			return true;
		}
		else {
			return false;
		}

	},

	handleBackAndCancel: function() {
		var that = this;
		this.errorMessages=[];
		this.errorState=false;

//		var obj = {};
//var oldPayload = that.initialData;
//var newPayload = that.modelRef.getData();

//var appParameters = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
//		oldPayload : oldPayload.CHIP.APP_PARAMETERS,
//		newPayload : newPayload.CHIP.APP_PARAMETERS,
//		objectType : "APP_PARAMETERS"
//		});

//		obj.oldPayload = oldPayload.CHIP;
//		delete obj.oldPayload.APP_PARAMETERS;
//		delete obj.oldPayload.MULTI_MEASURE; 
//		delete obj.oldPayload.appParameters;
//		delete obj.oldPayload.configurationObj;
//		obj.newPayload = newPayload.CHIP;
//		delete obj.newPayload.APP_PARAMETERS;
//		delete obj.newPayload.MULTI_MEASURE; 
//		delete obj.newPayload.appParameters;
//		delete obj.newPayload.configurationObj;
//		obj.objectType = "Chips";
//		obj = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(obj);
//		that.chipTextPayload = [];
//		if(newPayload.NO_OF_ADDITIONAL_LANGUAGES) {
//		for(var i=0;i<newPayload.NO_OF_ADDITIONAL_LANGUAGES.length;i++){
//		var chipTextObject = {};
//		chipTextObject.title = newPayload.ADDITIONAL_LANGUAGE_ARRAY[i].title;
//		chipTextObject.description = newPayload.ADDITIONAL_LANGUAGE_ARRAY[i].description;
//		chipTextObject.language = newPayload.ADDITIONAL_LANGUAGE_ARRAY[i].language;
//		that.chipTextPayload.push(chipTextObject);
//		}
//		}
//		that.languagePayloadForDirtyBitTest = []; 
//		for(var i=0;i<oldPayload.NO_OF_ADDITIONAL_LANGUAGES.length;i++){
//		var textObject = {};
//		textObject.language = oldPayload.NO_OF_ADDITIONAL_LANGUAGES[i].language;
//		textObject.description = oldPayload.NO_OF_ADDITIONAL_LANGUAGES[i].description;
//		textObject.title= oldPayload.NO_OF_ADDITIONAL_LANGUAGES[i].title;
//		that.languagePayloadForDirtyBitTest.push(textObject);
//		}
//		var languageDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
//		oldPayload : that.languagePayloadForDirtyBitTest,
//		newPayload : that.chipTextPayload,
//		objectType : "CHIP_TEXTS"
//		});

		if(this.hasUIChanged()) {
			var backDialog = new sap.m.Dialog({
				icon:"sap-icon://warning2",
				title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
				state:"Error",
				type:"Message",
				content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("ON_BACK_WARNING")})],
				beginButton: new sap.m.Button({
					text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
					press: function(){
						sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
					}
				}),
				endButton: new sap.m.Button({
					text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
					press:function(){backDialog.close();}
				})                                              
			});
			backDialog.open();
		}
		else {
			sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
		}
	},

	handleNavToDrillDown: function() {
		var that = this;
		this.errorMessages=[];
		this.errorState=false;
		var path = that.context.getPath();
		function navToDrillDown() {
			if(that.modelRef.getData().CHIP.navType == "2") {
				var chipData = that.modelRef.getData().CHIP;
				//sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "editAPFConfiguration?sap-apf-configuration-id=" + that.modelRef.getData().CHIP.apfConfId});
				if(chipData.apfAppId && chipData.apfConfId) {
					sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "editAPFConfiguration", route: "app", context: chipData.apfAppId + "/config/" + chipData.apfConfId});
				}
				else {
					sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "editAPFConfiguration"});
				}
			}
			else {
				/*sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "configureSBKPIDrilldown", route: "detail", context: (path)});*/
				/* Go first to the Tile app homepage, then goto Drilldown modeller */
				sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action: "configureSBKPITile", route: "detail", context: (path)});
				setTimeout(function(){
					sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "configureSBKPIDrilldown", route: "detail", context: (path)});
				},0);
			}
		}
		this.saveTile(navToDrillDown);
	},

	fetchChipData: function(obj) {
		var that = this;
		var finalChipObj = {};
		if(this.createMode) {
			var evaluationObj = {};
			if(obj.evalContextPath) {
				var evalContext = new sap.ui.model.Context(this.oApplicationFacade.getODataModel(), '/' + obj.evalContextPath);
				evaluationObj = this.metadataRef.getEvaluationById({context:evalContext, texts_for_chip:true, entity:"EVALUATIONS_MODELER", model:that.oApplicationFacade.getODataModel()});
				finalChipObj = this.formModelByEvaluation(evaluationObj);
			}
		}
		else if(this.editMode) {
			var chipObj = {};
			if(obj.chipContextPath) {
				var chipContext = new sap.ui.model.Context(this.oApplicationFacade.getODataModel(), '/' + obj.chipContextPath);
				chipObj = this.metadataRef.getChipById({context:chipContext, evaluation:true, texts:true, model:that.oApplicationFacade.getODataModel()});
				finalChipObj = this.formModelByChip(chipObj);
			}
		}
		else {
			finalChipObj = {CHIP:{}};
		}
		this.currentContextState = finalChipObj.CHIP.isActive;
		this.currentChipId = finalChipObj.CHIP.id;
		this.fetchOtherInfoAsync(finalChipObj);
		return finalChipObj;
	},

	formModelByEvaluation: function(evaluation) {
		var that = this;
		var obj = evaluation.EVALUATION;
		var chipObj = {CHIP:{}};
		if(evaluation.TEXTS_FOR_CHIP && evaluation.TEXTS_FOR_CHIP.length) {
			evaluation.TEXTS = evaluation.TEXTS_FOR_CHIP;
		}
		chipObj.CHIP.id = "";
		chipObj.CHIP.isActive = 0;
		chipObj.CHIP.evaluationId = obj.ID;
		chipObj.CHIP.tileType = "NT";
		chipObj.CHIP.dualTileType = "CT";
		chipObj.CHIP.title = obj.INDICATOR_TITLE || "";
		chipObj.CHIP.description = obj.TITLE || "";
		chipObj.CHIP.url = chipObj.url || this.getChipUrl(chipObj.tileType);
		chipObj.CHIP.keywords = "";
		chipObj.CHIP.configuration = "";
		chipObj.CHIP.storyId = "";
		chipObj.CHIP.navType = (!(obj.ACTION) || (obj.ACTION == this.sbAction)) ? "0" : "4";
		if(chipObj.CHIP.navType == "0") {
			chipObj.CHIP.semanticObject = obj.SEMANTIC_OBJECT || obj.COLUMN_NAME || "";
			chipObj.CHIP.semanticAction = obj.ACTION || this.sbAction;
		}
		else {
			chipObj.CHIP.semanticObject = this.lumiraSemanticObject;
			chipObj.CHIP.semanticAction = this.lumiraAction;
		}
		this.onLoadSemanticObject = obj.SEMANTIC_OBJECT || obj.COLUMN_NAME || "";
		this.onLoadSemanticAction = obj.ACTION || this.sbAction;
		chipObj.CHIP.appParameters = [];
		chipObj.CHIP.dimension = "";
		chipObj.CHIP.sortOrder = "0";
		chipObj.CHIP.semanticColorContribution = "Neutral";
		chipObj.CHIP.frameType = 'OneByOne';
		chipObj.CHIP.totalValueMeasure='';
		chipObj.CHIP.isKPIMeasureFractionMeasureHarvey = true;
		chipObj.CHIP.isKPIMeasureTotalMeasureHarvey = false;
		chipObj.CHIP.HARVEY_DIMENSION=[];
		chipObj.CHIP.harveyFilters=[{
			NAME:"",
			LABEL:"",
			OPERATOR:"EQ",
			VALUE_1:[],
			VALUE_2:[]
		}];
		chipObj.CHIP.MULTI_MEASURE = [{COLUMN_NAME: obj.COLUMN_NAME, semanticColor: "Error"}, {COLUMN_NAME: "", semanticColor: "Critical"}, {COLUMN_NAME: "", semanticColor: "Good"}];
		chipObj.TEXTS = [];
		var oChipObj = {};
		for(var i=0,l=evaluation.TEXTS.length; i<l; i++) {
			oChipObj = {};
			oChipObj.id = "";
			oChipObj.title = evaluation.TEXTS[i].TITLE;
			oChipObj.description = evaluation.TEXTS[i].DESCRIPTION;
			oChipObj.language = evaluation.TEXTS[i].LANGUAGE;
			chipObj.TEXTS.push(oChipObj);
		}
		//chipObj.TEXTS = evaluation.TEXTS;
		chipObj.EVALUATION = obj;
		return chipObj;
	},

	formModelByChip: function(chip) {
		var that = this;
		var obj = chip.CHIP;
		var chipObj = {CHIP:{}};
		var tmp;//
		if(chip.EVALUATION_INFO) {
			chipObj.EVALUATION = chip.EVALUATION_INFO;
		}
		chipObj.TEXTS = chip.TEXTS;
		chipObj.CHIP.id = obj.id || "";
		chipObj.CHIP.isActive = obj.isActive;
		chipObj.CHIP.evaluationId = obj.evaluationId || "";
		chipObj.CHIP.tileType = obj.tileType || "NT";
		if (obj.tileType == "DT-CT"){
			chipObj.CHIP.dualTileType = "CT";
			chipObj.CHIP.tileType = "DT";
		}
		else if (obj.tileType == "DT-CM"){
			chipObj.CHIP.dualTileType = "CM";
			chipObj.CHIP.tileType = "DT";
		}
		else if (obj.tileType == "DT-AT") {
			chipObj.CHIP.dualTileType = "AT";
			chipObj.CHIP.tileType = "DT";
		}
		else if (obj.tileType == "DT-TT") {
			chipObj.CHIP.dualTileType = "TT";
			chipObj.CHIP.tileType = "DT";
		}
		chipObj.CHIP.title = obj.title || "";
		chipObj.CHIP.description = obj.description || "";
		chipObj.CHIP.url = obj.url || this.getChipUrl(chipObj.tileType);
		chipObj.CHIP.keywords = obj.keywords || "";
		chipObj.CHIP.configuration = obj.configuration || "";

		//parsing chip configuration
		var tileConfiguration = null;
		var tileProperties = null;
		var additionalAppParameters = null;
		var evaluation = null;
		try {
			chipObj.CHIP.configurationObj = JSON.parse(chipObj.CHIP.configuration);
			if(chipObj.CHIP.configurationObj && chipObj.CHIP.configurationObj.tileConfiguration) {
				tileConfiguration = JSON.parse(chipObj.CHIP.configurationObj.tileConfiguration);
				if(tileConfiguration && tileConfiguration.TILE_PROPERTIES) {
					tileProperties = JSON.parse(tileConfiguration.TILE_PROPERTIES);
					if(tileProperties) {
						chipObj.CHIP.navType = tileProperties.navType || "0";
						chipObj.CHIP.frameType = tileProperties.frameType || 'OneByOne';
						chipObj.CHIP.semanticObject = tileProperties.semanticObject || "";
						chipObj.CHIP.semanticAction = tileProperties.semanticAction || "";
						this.onLoadSemanticObject = chipObj.CHIP.semanticObject || "";
						this.onLoadSemanticAction = chipObj.CHIP.semanticAction || "";
						chipObj.CHIP.storyId = tileProperties.storyId || "";
						chipObj.CHIP.apfConfId = tileProperties.apfConfId || "";
						chipObj.CHIP.apfConfName = (tileProperties.apfConfId) ? ('-NA-' + tileProperties.apfConfId) : "";
						chipObj.CHIP.dimension = tileProperties.dimension || "";

						chipObj.CHIP.HARVEY_DIMENSION=chipObj.CHIP.HARVEY_DIMENSION||[];
						// adapter to convert to backend data to chip data format
						chipObj.CHIP.harveyFilters=[{
							NAME:"",
							LABEL:"",
							OPERATOR:"EQ",
							VALUE_1:[],
							VALUE_2:[]
						}];
						if(tileProperties.harveyFilters && tileProperties.harveyFilters.length){
							tmp={};// tmp will not refered again after this block;
							chipObj.CHIP.harveyFilters=[];                                                                                                  
							tileProperties.harveyFilters.forEach(function(curFilter){
								if(!tmp[curFilter.NAME]){
									tmp[curFilter.NAME]={
											NAME:curFilter.NAME,
											OPERATOR:curFilter.OPERATOR,
											VALUE_1:[curFilter.VALUE_1],
											VALUE_2:[],
											LABEL:curFilter.NAME
									}
									chipObj.CHIP.harveyFilters.push(tmp[curFilter.NAME]);
								}else{
									tmp[curFilter.NAME].VALUE_1.push(curFilter.VALUE_1);
								}
							});
							if(chipObj.CHIP.HARVEY_DIMENSION.length==0){
								chipObj.CHIP.HARVEY_DIMENSION.push({
									name:tileProperties.harveyFilters[0].NAME,
									label:tileProperties.harveyFilters[0].NAME
								});
							}
						}
						chipObj.CHIP.totalValueMeasure=tileProperties.harveyTotalMeasure;
						chipObj.CHIP.isKPIMeasureFractionMeasureHarvey = tileProperties.isFractionMeasure;
						chipObj.CHIP.isKPIMeasureTotalMeasureHarvey = !tileProperties.isFractionMeasure;
						chipObj.CHIP.sortOrder = tileProperties.sortOrder || "";
						chipObj.CHIP.semanticColorContribution = tileProperties.semanticColorContribution || "Neutral";
					}
					additionalAppParameters = JSON.parse(tileConfiguration.ADDITIONAL_APP_PARAMETERS);
					chipObj.CHIP.appParameters = additionalAppParameters || [];
					evaluation = JSON.parse(tileConfiguration.EVALUATION);
					if(evaluation) {
						chipObj.CHIP.MULTI_MEASURE = tileProperties.COLUMN_NAMES || evaluation.COLUMN_NAMES || [{COLUMN_NAME: chipObj.EVALUATION.COLUMN_NAME, semanticColor: "Error"}, {COLUMN_NAME: "", semanticColor: "Critical"}, {COLUMN_NAME: "", semanticColor: "Good"}];
					}
				}
			}
		}
		catch(e) {
			// defaulting values
			jQuery.sap.log.error = "Failed to parse chip";
			chip.EVALUATION = chip.EVALUATION_INFO;
			delete chip.EVALUATION_INFO;
			chipObj = that.formModelByEvaluation(chip);
			chipObj.CHIP.id = obj.id;
			chipObj.CHIP.isActive = obj.isActive;
			this.errorConfigParse = true;
		}
		return chipObj;
	},

	fetchOtherInfoAsync: function(obj) {
		var that = this;

		// Set Footer Buttons
		this.updateFooterButtons(obj);

		// Fetch All Sap Languages - Adapter Implementation
		var langSuccessHandler = function(lang, arr, localeLanguage) {
			obj.SAP_LANGUAGES = lang;
			obj.SAP_LANGUAGE_ARRAY = arr;
			obj.localLanguage = localeLanguage;
		};
		this.metadataRef.getAllLanguages({async:false, success:langSuccessHandler, model:this.oDataModel});

//		this.oApplicationFacade.getODataModel().read("/LANGUAGE?$select=LAISO,SPRAS", null, null, false, function(data) {
//		data = data.results;
//		if(data.length) {
//		if(data.length == 1) {
//		obj.SAP_LANGUAGES = {LAISO:{},SPRAS:{}};
//		obj.SAP_LANGUAGES.LAISO[data[0]["LAISO"]] = data[0]["SPRAS"]; that.languagesObject.SPRAS[data[0]["SPRAS"]] = data[0]["LAISO"];
//		}
//		else {
//		obj.SAP_LANGUAGES = data.reduce(function(p,c,i,a) { that.languagesObject = that.languagesObject || {}; that.languagesObject.LAISO = that.languagesObject.LAISO || {}; that.languagesObject.SPRAS = that.languagesObject.SPRAS || {}; if(i == 1){ that.languagesObject.LAISO[a[0]["LAISO"]] = a[0]["SPRAS"]; that.languagesObject.SPRAS[a[0]["SPRAS"]] = a[0]["LAISO"]; }  that.languagesObject.LAISO[a[i]["LAISO"]] = a[i]["SPRAS"]; that.languagesObject.SPRAS[a[i]["SPRAS"]] = a[i]["LAISO"]; return that.languagesObject;});
//		}
//		obj.SAP_LANGUAGE_ARRAY = data;
//		obj.localLanguage = obj.SAP_LANGUAGES.LAISO[sap.ui.getCore().getConfiguration().getLocale().getLanguage().split("-")[0].toUpperCase()];
//		}
//		});

		// Pick Additional Language Texts
		var languageData = obj.TEXTS;
		var additionalLanguageData = [];
		var i;
		for(i=0;i<languageData.length;i++){
			if(languageData[i].language != obj.localLanguage){
				additionalLanguageData.push(languageData[i]);
			}
		}
		var languageArray = [];
		var i;
		for(i=0;i<additionalLanguageData.length;i++){
			var languageObject = {};
			languageObject.title = additionalLanguageData[i].title;
			languageObject.description = additionalLanguageData[i].description;
			languageObject.language = additionalLanguageData[i].language;
			languageObject.isoLanguage = obj.SAP_LANGUAGES.SPRAS[languageObject.language]
			languageObject.isActive = obj.isActive;
			languageArray.push(languageObject);
		}
		obj.ADDITIONAL_LANGUAGE_ARRAY = languageArray;
		obj.NO_OF_ADDITIONAL_LANGUAGES = obj.ADDITIONAL_LANGUAGE_ARRAY.length || 0;
		that.byId('additionalLanguageLink').bindProperty("text","tileConfig>/NO_OF_ADDITIONAL_LANGUAGES",function(sValue){
			return that.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+sValue+")";
		});

		// Pick Control Visibility
		obj.CONTROL = this.getControlObject(obj);

		// Fetch All Dimensions For Contribution Tile, Trend Tile
		try {
			this.oModelForEntity = this.populateDimension(obj.EVALUATION.ODATA_URL, obj.EVALUATION.ODATA_ENTITYSET);
			obj.CHIP.dimension = obj.CHIP.dimension || this.oModelForEntity.getData().dimensions[0].dimensionName; 
		} catch (err) {

		} finally {
			if (this.oModelForEntity.getData().dimensions.length) {
				obj.DIMENSIONS = this.oModelForEntity.getData();
			} else {
				obj.DIMENSIONS = [];
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("UNABLE_TO_FETCH_NAVIG"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("UNABLE_TO_FETCH_NAVIG")
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			}
		}

		// Pick App Parameters
		var parametersArr = [];
		var appParameters = obj.CHIP.appParameters;
		if(appParameters && Object.keys(appParameters).length) {
			for(var key in appParameters) {
				if(appParameters.hasOwnProperty(key)) {
					parametersArr.push({NAME:key, VALUE:appParameters[key]});
				}
			}
		}
		obj.CHIP.APP_PARAMETERS = parametersArr;

		// Fetch Evaluations Filters, Values Async
		var successHandler = function(bean) {
			var container = {};
			obj.TAGS = {};
			if(bean.TAGS) {
				for(var i=0,l=bean.TAGS.length;i<l;i++) {
					obj.TAGS[bean.TAGS[i].TAG] = bean.TAGS[i].TYPE;
				}
			}
			if(bean.INDICATOR_TAGS) {
				for(var i=0,l=bean.INDICATOR_TAGS.length;i<l;i++) {
					obj.TAGS[bean.INDICATOR_TAGS[i].TAG] = "IN";
				}
			}
			obj.FILTERS = [];
			if(bean.FILTERS) {
				for(var i=0,l=bean.FILTERS.length;i<l;i++) {
					container = {};
					container.TYPE = bean.FILTERS[i].TYPE;
					container.NAME = bean.FILTERS[i].NAME;
					container.VALUE_1 = bean.FILTERS[i].VALUE_1;
					container.VALUE_2 = bean.FILTERS[i].VALUE_2;
					container.OPERATOR = bean.FILTERS[i].OPERATOR;
					obj.FILTERS.push(container);
				}
			}
			obj.VALUES = [];
			var measureObj = {Measures:[]};
			measureObj.Measures.push({COLUMN_NAME:"", COLUMN_TEXT:""});
			if(obj.EVALUATION && obj.EVALUATION.COLUMN_NAME) {
				measureObj.Measures.push({COLUMN_NAME:obj.EVALUATION.COLUMN_NAME, COLUMN_TEXT:obj.EVALUATION.COLUMN_NAME});
			}
			if(bean.VALUES) {
				for(var i=0,l=bean.VALUES.length; i<l; i++) {
					container = {};
					// Pick Additional Filters for Comparison Tile Multiple Measures
					if(/^\d{2}/.test(bean.VALUES[i].TYPE.toString())) {
						measureObj.Measures.push({COLUMN_NAME: bean.VALUES[i].COLUMN_NAME, COLUMN_TEXT: bean.VALUES[i].COLUMN_NAME});
					}
					else {
						container.TYPE = bean.VALUES[i].TYPE;
						container.FIXED = bean.VALUES[i].FIXED;
						container.COLUMN_NAME = bean.VALUES[i].COLUMN_NAME;
						container.ODATA_PROPERTY = bean.VALUES[i].ODATA_PROPERTY;
						obj.VALUES.push(container);
					}
				}
			}
			if(measureObj.Measures.length < 3) {
				that.inSufficientAdditionalMeasure = true;
			}
			var measureObjOpt = jQuery.extend(true,{},measureObj,{});
			if(measureObjOpt && measureObjOpt.Measures && measureObjOpt.Measures.length) {
				measureObjOpt.Measures[0].COLUMN_TEXT = "("+ that.oApplicationFacade.getResourceBundle().getText("NONE") +")";
			}
			obj.ADDITIONAL_MEASURES = measureObj;
			obj.ADDITIONAL_MEASURES_OPT = measureObjOpt;
			if(bean.TEXTS) {
				obj.TEXTS = bean.TEXTS;
			}
			that.getView().getModel("tileConfig").setData(obj);
			that.setTooltipForAllSelect();

			if(obj.CHIP.apfConfId) {
				var apfModel = new sap.ui.model.odata.ODataModel("/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata", true);
				function apfConfigNameCallBack(d) {
					if(d.length && d[0]) {
						that.modelRef.getData().CHIP.apfConfName = d[0].AnalyticalConfigurationName;
						that.modelRef.getData().CHIP.apfAppId = d[0].Application;
						that.getView().getModel("tileConfig").setData(that.modelRef.getData());
						that.initialData = jQuery.extend(true,{},that.modelRef.getData(),{});
					}
				}
				function apfConfigNameErrCallBack(d,s,x) {
				}
				that.metadataRef.getDataByEntity({entity:"AnalyticalConfigForSemObjQueryResults", async:true, filter:("AnalyticalConfiguration eq '" + obj.CHIP.apfConfId + "'"), success:apfConfigNameCallBack, error:apfConfigNameErrCallBack, model:apfModel});
			}

			that.getView().byId(obj.CHIP.tileType).$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
			if(that.errorConfigParse) {
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_PARSE_CHIP_INFO"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_PARSE_CHIP_INFO")
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			}
			that.errorConfigParse = false;
			that.initialData = jQuery.extend(true,{},obj,{});
			if(obj.CHIP.tileType && obj.CHIP.tileType == "DT") {
				var selectedTile=that.getView().byId("selectTileType").getSelectedKey();
				that.getView().byId("selectVizRight").fireChange(selectedTile);
			}
		};
		that.metadataRef.getEvaluationById({ID:obj.CHIP.evaluationId, IS_ACTIVE:1, async:true, success:successHandler, noEvaluation:true, tags:true, indicator_tags:true, values:true, filters:true, entity:"EVALUATIONS", model:that.oApplicationFacade.getODataModel()});
		this.initializeDimensionsForHarveyFilters(obj);// fetches all dimen
		return obj;
	},

	setTooltipForAllSelect: function() {
		this.byId("selectTileType").setTooltip(this.byId("selectTileType").getSelectedItem().getText());
		this.byId("selectNavType").setTooltip(this.byId("selectNavType").getSelectedItem().getText());
		this.byId("selectSortOrder").setTooltip(this.byId("selectSortOrder").getSelectedItem().getText());
		this.byId("selectDimension").setTooltip(this.byId("selectDimension").getSelectedItem().getText());
		this.byId("semanticColorContribution").setTooltip(this.byId("semanticColorContribution").getSelectedItem().getText());
		this.byId("selectVizRight").setTooltip(this.byId("selectVizRight").getSelectedItem().getText());
		this.byId("measure1").setTooltip(this.byId("measure1").getSelectedItem().getText());
		this.byId("measureColor1").setTooltip(this.byId("measureColor1").getSelectedItem().getText());
		this.byId("measure2").setTooltip(this.byId("measure2").getSelectedItem().getText());
		this.byId("measureColor2").setTooltip(this.byId("measureColor2").getSelectedItem().getText());
		this.byId("measure3").setTooltip(this.byId("measure3").getSelectedItem().getText());
		this.byId("measureColor3").setTooltip(this.byId("measureColor3").getSelectedItem().getText());
	},
	
	saveTile: function(callback) {
		var that = this;
		that.errorMessages = [];
		that.errorState = false;
		//usability improvement - Save appParams without explicit click on "+"
		that.isPropertyAdded = true;
		if(that.getView().byId("appPropertyName").getValue() || that.getView().byId("appPropertyValue").getValue()){
			that.addNewProperty();
		}
		if(!that.isPropertyAdded){
			return;
		}

		var configuration = that.formChipConfiguration();

		function publishChipCallBack(data) {
			try {
				that.currentChipId = JSON.parse(data).response[0].id;
			}
			catch(e) {
				that.currentChipId = that.currentChipId || null; 
			}
			finally {
				that.oApplicationFacade.__tileModified = true;
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
				if(callback) {
					callback();
				}
				else {
					that.refreshMasterList();
					//that.oApplicationFacade.getODataModel().refresh();
					sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
				}
			}
		}
		function publishChipErrCallBack(err) {
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
			that.errorMessages.push({
				"type":"Error",
				"title":that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"),
				"description" : err.responseText
			});
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
		}

		mode = that.createMode ? "create" : (that.editMode ? "edit" : "edit");
		that.mode = mode;
		that.metadataRef.publishChip(configuration, mode, that, publishChipCallBack, publishChipErrCallBack);
		that.setFooterOnError();
	},


	checkForValidChipForActivation: function() {
		var that = this;
		var dataRef = that.modelRef.getData();
		var data = dataRef.CHIP;
		var errorLog = "";
		var configuration = null;

		if(((!(data.semanticObject) || (data.semanticObject.length == (data.semanticObject.split(" ").length - 1))) && (Number(data.navType) != 0))) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_OBJECT") + "\n";
			that.byId("semanticObjectText").setValueState("Error");
			that.byId("semanticObjectText").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_OBJECT"));
		}
		if(data.semanticObject.indexOf(" ") > -1) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("INVALID_SEMANTIC_OBJECT") + "\n";
			that.byId("semanticObjectText").setValueState("Error");
			that.byId("semanticObjectText").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("INVALID_SEMANTIC_OBJECT"));
		}
		if(((!(data.semanticAction) || (data.semanticAction.length == (data.semanticAction.split(" ").length - 1))) && (Number(data.navType) != 0))) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_ACTION") + "\n";
			that.byId("selectODD").setValueState("Error");
			that.byId("selectODD").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_ACTION"));
		}
		if(data.semanticAction.indexOf(" ") > -1) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("INVALID_SEMANTIC_ACTION") + "\n";
			that.byId("selectODD").setValueState("Error");
			that.byId("selectODD").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("INVALID_SEMANTIC_ACTION"));
		}
		if(((!(data.storyId) || (data.storyId.length == (data.storyId.split(" ").length - 1))) && (Number(data.navType) == 1))) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_STORY_ID") + "\n";
			that.byId("selectStoryId").setValueState("Error");
			that.byId("selectStoryId").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_STORY_ID"));
		}
		if(data.storyId.indexOf(" ") > -1) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("INVALID_STORY_ID") + "\n";
			that.byId("selectStoryId").setValueState("Error");
			that.byId("selectStoryId").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("INVALID_STORY_ID"));
		}
		if(((!(data.apfConfId) || (data.apfConfId.length == (data.apfConfId.split(" ").length - 1))) && (Number(data.navType) == 2))) {
			if((data.semanticObject === that.APF_SEMANTIC_OBECT) && (data.semanticAction === that.APF_ACTION)) {
				errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_CONFIG_ID") + "\n";
				that.byId("apfConfId").setValueState("Error");
				that.byId("apfConfId").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_CONFIG_ID"));
			}
		}
		if(!(data.title) || (data.title.length == (data.title.split(" ").length - 1))) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_TITLE") + "\n";
			that.byId("tileTitle").setValueState("Error");
			that.byId("tileTitle").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_TITLE"));
		}
		if(!(data.description) || (data.description.length == (data.description.split(" ").length - 1))) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_DESCRIPTION");
			that.byId("tileSubtitle").setValueState("Error");
			that.byId("tileSubtitle").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_DESCRIPTION"));
		}
		if((data.tileType == "CM" || data.dualTileType == "CM") && !(errorLog)) {
			configuration = that.formChipConfiguration();
			var evaluation = JSON.parse(JSON.parse(JSON.parse(configuration.configuration).tileConfiguration).EVALUATION);
			var tileProperties = JSON.parse(JSON.parse(JSON.parse(configuration.configuration).tileConfiguration).TILE_PROPERTIES);
			var evaluationMultiMeasureArray = tileProperties.COLUMN_NAMES || evaluation.COLUMN_NAMES;
			if(!(evaluationMultiMeasureArray) || !(evaluationMultiMeasureArray.length) || (evaluationMultiMeasureArray.length < 2)) {
				errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES");
			}
			else {
				for(var i=0,l=evaluationMultiMeasureArray.length; i<l; i++) {
					if(!(evaluationMultiMeasureArray[i].COLUMN_NAME) || !(evaluationMultiMeasureArray[i].semanticColor)) {
						errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES");
						break;
					}
				}
				if(!errorLog) {
					if(evaluationMultiMeasureArray.length == 2) {
						if(evaluationMultiMeasureArray[0].COLUMN_NAME == evaluationMultiMeasureArray[1].COLUMN_NAME) {
							errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
						}
					}
					else if(evaluationMultiMeasureArray.length == 3) {
						if(evaluationMultiMeasureArray[0].COLUMN_NAME == evaluationMultiMeasureArray[1].COLUMN_NAME) {
							errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
						} 
						else if(evaluationMultiMeasureArray.COLUMN_NAME == evaluationMultiMeasureArray[2].COLUMN_NAME) {
							errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
						}
						else if(evaluationMultiMeasureArray[1].COLUMN_NAME == evaluationMultiMeasureArray[2].COLUMN_NAME) {
							errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
						}
					}
				}
			}
		}
		return errorLog;
	},

	selectVizRight : function(obj){
		var rightViz;
		var dataRef = this.modelRef.getData();
		dataRef.CONTROL = dataRef.CONTROL || {};
		if(obj.CHIP){
			dataRef = obj;
			var rightVizKey = obj.CHIP.dualTileType;
		}
		else{
			var rightVizKey = this.getView().byId("selectVizRight").getSelectedKey();
		}

		if(rightVizKey == "CT"){
			rightViz = sap.ui.core.Fragment.byId("tiles","compchart");
			dataRef.CONTROL.vDimension = true;
			dataRef.CONTROL.vMultiMeasure = false;
			dataRef.CONTROL.vSortOrder = true;
			dataRef.CONTROL.vSemanticColorContribution = true;
		}
		else if(rightVizKey == "CM"){
			rightViz = sap.ui.core.Fragment.byId("tiles","compchartmul");
			dataRef.CONTROL.vDimension = false;
			dataRef.CONTROL.vMultiMeasure = true;
			dataRef.CONTROL.vSortOrder = false;
			dataRef.CONTROL.vSemanticColorContribution = false;
		}
		else if(rightVizKey == "AT"){
			rightViz = sap.ui.core.Fragment.byId("tiles","bulletchart");
			dataRef.CONTROL.vDimension = false;
			dataRef.CONTROL.vMultiMeasure = false;
			dataRef.CONTROL.vSortOrder = false;
			dataRef.CONTROL.vSemanticColorContribution = false;
		}
		else if(rightVizKey == "TT"){
			rightViz = sap.ui.core.Fragment.byId("tiles","areachart");
			dataRef.CONTROL.vDimension = true;
			dataRef.CONTROL.vMultiMeasure = false;
			dataRef.CONTROL.vSortOrder = false;
			dataRef.CONTROL.vSemanticColorContribution = false;
		}
		this.getView().byId("DT").getTileContent()[1].setContent(rightViz);
		this.modelRef.setData(dataRef);
		this.getView().byId("selectVizRight").setTooltip(this.getView().byId("selectVizRight").getSelectedItem().getText());
		return dataRef;
	},

	getControlObject: function(obj) {
		var control = obj.CONTROL || {};

		this.getView().byId('NT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('CT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('TT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('AT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('CM').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('DT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		//this.getView().byId('HT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId(obj.CHIP.tileType).$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));

		if(obj && obj.CHIP && obj.CHIP.tileType) {
			control.isHarvey=false;
			switch(obj.CHIP.tileType) {
			case 'NT': control.vDimension = false;
			control.vMultiMeasure = false;
			control.vSortOrder = false;
			control.vSemanticColorContribution = false;
			control.vVizLeft = false;
			control.vVizRight = false;
			break;
			case 'AT': control.vDimension = false;
			control.vMultiMeasure = false;
			control.vSortOrder = false;
			control.vSemanticColorContribution = false;
			control.vVizLeft = false;
			control.vVizRight = false;
			break;
			case 'CT': control.vDimension = true;
			control.vMultiMeasure = false;
			control.vSortOrder = true;
			control.vSemanticColorContribution = true;
			control.vVizLeft = false;
			control.vVizRight = false;
			break;
			case 'TT': control.vDimension = true;
			control.vMultiMeasure = false;
			control.vSortOrder = false;
			control.vSemanticColorContribution = false;
			control.vVizLeft = false;
			control.vVizRight = false;
			break;
			case 'CM': control.vDimension = false;
			control.vMultiMeasure = true;
			control.vSortOrder = false;
			control.vSemanticColorContribution = false;
			control.vVizLeft = false;
			control.vVizRight = false;
			break;
			case 'DT': control.vDimension = false;
			control.vDimension = true;
			control.vMultiMeasure = false;
			control.vSortOrder = true;
			control.vSemanticColorContribution = true;
			control.vVizLeft = true;
			control.vVizRight = true;
			obj.CONTROL = control;
			obj = this.selectVizRight(obj);
			control = obj.CONTROL;
			break;
			case 'HT' : control.isHarvey = true;
			control.vDimension=false;
			control.vMultiMeasure = false;
			control.vSortOrder = false;
			control.vSemanticColorContribution = false;
			control.vVizLeft = false;
			control.vVizRight = false;
			break;

			default : 	break;
			}
		}

		if(obj && obj.CHIP && obj.CHIP.navType) {
			switch(obj.CHIP.navType.toString()) {
			case '0': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = false;
			control.vStoryId = false;
			control.vSelectNavType = false;
			control.vAPFConfId = false;
			break;
			case '1': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = true;
			control.vStoryId = true;
			control.vSelectNavType = true;
			control.vAPFConfId = false;
			break;
			case '2': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = true;
			control.vStoryId = false;
			control.vSelectNavType = true;
			control.vAPFConfId = true;
			break;
			case '3': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = true;
			control.vStoryId = false;
			control.vSelectNavType = true;
			control.vAPFConfId = false;
			break;
			case '4': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = true;
			control.vStoryId = false;
			control.vSelectNavType = true;
			control.vAPFConfId = false;
			break;
			case '5': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = true;
			control.vStoryId = false;
			control.vSelectNavType = true;
			control.vAPFConfId = false;
			break;
			default: break; 
			}
		}
		return control;
	},

	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,false);
	},

	getInitialModelData: function() {
		var control = {};
		control.vStoryId = false;
		control.vAPFConfId = false;
		control.vDimension = false;
		control.vMultiMeasure = false;
		control.vSortOrder = false;
		control.vSemanticColorContribution = false;
		control.vVizLeft = false;
		control.vVizRight = false;
		return {CONTROL:control};
	},

});