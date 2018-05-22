/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/

jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.visualization.view.AddTileModelS", {
	onInit : function() {
		var that = this;
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		var view = this.getView();

		this.LUMIRA_SEMANTIC_OBECT = "LumiraAnalytics";
		this.LUMIRA_ACTION = "openStory";
		
		this.lumiraSemanticObject = "LumiraAnalytics";
		this.lumiraAction = "openStory";
		
		this.apfSemanticObject = "FioriApplication";
		this.apfAction = "executeAPFConfiguration";
		
		this.APF_SEMANTIC_OBECT = "FioriApplication";
		this.APF_ACTION = "executeAPFConfiguration";
		
		this.sbAction = "analyzeSBKPIDetails";
		this.busyDialog = new sap.m.BusyDialog();
		
		this.oRouter.attachRouteMatched(function(oEvent) {
			var that = this;
			if(oEvent.getParameter("name") == "addTileModelS") {
				this.createMode = true;
				this.editMode = false;
			}
			else if(oEvent.getParameter("name") == "editTileModelS") {
				this.createMode = false;
				this.editMode = true;
			}
			else {
				this.createMode = false;
				this.editMode = false;
			}
			if(this.createMode || this.editMode) {
				this.cache = {};
				this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
				this.confRef = sap.suite.ui.smartbusiness.Configuration;
				this.constantsRef = this.confRef.Constants;
				this.tileTypeConst = this.constantsRef.TileType;
				this.oDataModel = this.oApplicationFacade.getODataModel();
				this.PLATFORM = this.metadataRef.getPlatform();
				//this.sScope = "CONF";
				this.env = 0;
				
				var chipModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(chipModel,"tileConfig");
				this.modelRef = this.getView().getModel("tileConfig");
				
				var initialData = this.getInitialModelData();
				this.getView().getModel("tileConfig").setData(initialData);
				
				// Fetch System Environment info => Either running on SAP env or CUST env
				function sysInfoFetchCallBack(d) {
					that.env = d;
					var envData = that.getModelDataAfterEnv(that.env);
					that.getView().getModel("tileConfig").setData(envData);
				}
				function sysInfoFetchErrCallBack(d,s,x) {
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_SYS_INFO"), d.response.body);
				}
				this.metadataRef.getSystemInfo({async:false, success:sysInfoFetchCallBack, error:sysInfoFetchErrCallBack, model:this.oDataModel});
				
				this.oFactory = this.metadataRef.getUI2Factory();
				this.oPBService = this.metadataRef.getUI2PageBuildingService(this.oFactory);
				
				// Fetch Current Logon User
				if(!(that.oApplicationFacade.currentLogonHanaUser)) {
					//Adapter Implementation ----
					var sessionUserFetchCallBack = function(user) {
						that.oApplicationFacade.currentLogonHanaUser = user;
					};
					
					var sessionUserFetchErrCallBack = function(d,s,x) {
						that.oApplicationFacade.currentLogonHanaUser = null;
						sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), d.response.body);
					};
					 
					this.metadataRef.getSessionUser({async:true, success:sessionUserFetchCallBack, error:sessionUserFetchErrCallBack, model:this.oApplicationFacade.getODataModel()});
				}
				
//				var chipModel = new sap.ui.model.json.JSONModel();
//				this.getView().setModel(chipModel,"tileConfig");
//				this.modelRef = this.getView().getModel("tileConfig");
				this.busyDialog.open();
				var partialObject = this.fetchChipData({evalContextPath: oEvent.getParameter("arguments").contextPath, chipContextPath: oEvent.getParameter("arguments").chipContextPath});
				//this.getView().getModel("tileConfig").setData(partialObject);
				if(oEvent.getParameter("arguments").contextPath) {
					this.context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
					  var id = (/ID=\'.*\'/).exec(oEvent.getParameter("arguments").contextPath)[0];
                      that.kpiId = id.slice(id.indexOf("'")+1,id.lastIndexOf("'"));
				}
				if(oEvent.getParameter("arguments").chipContextPath) {
					this.chipContext = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").chipContextPath);
				}
				
				// Set Initial State
				this.appMode = oEvent.getParameter("name");
				that.byId("tileTitle").setValueState("None");
				that.byId("tileSubtitle").setValueState("None");
				that.byId("allCatalogs").setValueState("None");
				that.byId("semanticObjectText").setValueState("None");
				that.byId("selectODD").setValueState("None");
				that.byId("appPropertyName").setValueState("None");
				that.byId("appPropertyValue").setValueState("None");
				//that.byId("selectStoryId").setValueState("None");
				//that.byId("apfConfId").setValueState("None");
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

	getSelectedRadioButton : function(oEvent, confirmationType) {
		var bindingContext = this.getView().getBindingContext();
		var dataRef = this.modelRef.getData();
		if((oEvent && oEvent.mParameters.selected) || confirmationType){
			this.confirmationType = (oEvent) ? oEvent.getSource().data("drilldownType") : confirmationType;
			if (this.confirmationType === 'GDD') {
				dataRef.CHIP.navType = "0";
				dataRef.CONTROL = this.getControlObject(dataRef);
				dataRef.CHIP.semanticObject = this.tempSemanticObject || this.onLoadSemanticObject;
				dataRef.CHIP.semanticAction = this.sbAction;
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
		if(this.createMode) {
			this.selectTile(oEvent.getSource().data("tileType"));
		}
		else {
			if(this.modelRef.getData().CHIP.tileType != oEvent.getSource().data("tileType"))
				sap.m.MessageToast.show(this.oApplicationFacade.getResourceBundle().getText("BLOCK_TILETYPE_CHANGE_FOR_EDIT"));
		}
		//this.selectTile(oEvent.getSource().data("tileType"));
	},

	selectTile: function(key){
		var dataRef = this.modelRef.getData();
		dataRef.CHIP.tileType = key;
		dataRef.CONTROL = this.getControlObject(dataRef);
		this.modelRef.setData(dataRef);
		if(key == "CM") {
			if(this.cache.inSufficientAdditionalMeasure && !(this.cache.inSufficientAdditionalMeasureAlerted)) {
				sap.m.MessageToast.show(this.oApplicationFacade.getResourceBundle().getText("INSUFFICIENT_ADDL_MEASURES"));
				this.cache.inSufficientAdditionalMeasureAlerted = true;
			}
		}
		this.getView().byId(dataRef.CHIP.tileType).$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
	},

	selectSortOrder:function(oEvent){
	
	},

	selectNavType:function(oEvent, key){
		var dataRef = this.modelRef.getData();
		if(oEvent) {
			key = oEvent.getSource().getSelectedKey();
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
		default: break;
		}
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

		//chip properties
		payload.id = data.id || "";
		this.currentChipId = payload.id;
		payload.isActive = 1;
		payload.catalogId = data.catalogId;
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
	

		if(data.changedOn) {
			payload.changedOn = data.changedOn;
		}

		// TILE_PROPERTIES in configuration
		tileProperties.id = data.id || "_____CHIPID__________CHIPID_____";
		tileProperties.instanceId = data.instanceId || "___CHIPINSTID______CHIPINSTID___";
		tileProperties.catalogId = data.catalogId;
		
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
		if(data.tileType == 'TT') {
			tileProperties.dimension = data.dimension;
		}

		var evaluation = dataRef.EVALUATION;

		if(data.tileType == 'NT' || data.tileType == 'TT' || data.tileType == 'CT' || data.tileType == 'AT' || data.tileType == 'CM') {
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
			tileProperties.semanticObject = data.semanticObject || this.apfSemanticObject || this.APF_SEMANTIC_OBECT;
			tileProperties.semanticAction = data.semanticAction || this.apfAction || this.APF_ACTION;
		}
		else {
			tileProperties.semanticObject = data.semanticObject;
			tileProperties.semanticAction = data.semanticAction;
		}
		
		if(data.navLikeTId) {
			tileProperties.navLikeTId = data.navLikeTId; 
		}
		
		if(data.navLikeTCId) {
			tileProperties.navLikeTCId = data.navLikeTCId; 
		}
		
		// data to get the platform for tiles in S-Innovation
		tileProperties.sb_metadata = "abap";
		tileProperties.sb_navigation = "abap";
		tileProperties.sb_catalog = "abap";
		
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
//			tileConfig.EVALUATION_FILTERS = JSON.stringify([]);  
//			configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"0", timeStamp:Date.now().toString()});
//			if(configuration.length > tileConfigLimit) {
//				tileConfig.EVALUATION_VALUES = JSON.stringify([]);
//				tileConfig.EVALUATION_FILTERS = JSON.stringify([]);
//				configuration = JSON.stringify({tileConfiguration:JSON.stringify(tileConfig), isSufficient:"0", timeStamp:Date.now().toString()});
//			}
//		}

		payload.configuration = configuration;
		var saveChipPayload = payload;
		return saveChipPayload;
	},

	publishChip: function(payload) {
		var serviceStatus = true;
		var that = this;
		
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
			finalPayload.push({id:payload.id, isActive:payload.isActive, CHIP:payload, TEXTS:that.chipTextPayload});
			var saveService=sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");    
			saveService.create('CHIPS', payload, null, function(data){
				serviceStatus = true;
				that.currentChipId = JSON.parse(data).response[0].id;
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
			}
			, function(err){
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
			});
		}
		else if(this.editMode){
			if(this.currentContextState) {
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
				finalPayload.push({id:payload.id, isActive:payload.isActive, CHIP:payload, TEXTS:that.chipTextPayload});
			}
			else {
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
				finalPayload.push({id:payload.id, isActive:payload.isActive, CHIP:{update:payload}, TEXTS:textsUpdatePayload});
				sap.suite.ui.smartbusiness.lib.Util.utils.update(sap.suite.ui.smartbusiness.lib.Util.utils.serviceUrl("CHIP_SERVICE_URI"),finalPayload,null,function(data) {
					serviceStatus = true;
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
				},function(err){
					serviceStatus = false;
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), err.responseText);
				}); 
			}
		}
		return serviceStatus;
	},

	getChipUrl: function(tileType) {
		var chipUrls = {
				"NT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatornumeric/NumericTileChip.xml",
				"CT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorcontribution/ContributionTileChip.xml",
				"TT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorArea/AreaChartTileChip.xml",
				"AT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatordeviation/DeviationTileChip.xml",
				"CM" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorcomparison/ComparisonTileChip.xml",
				"DT-CT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorDualContribution/DualContributionChip.xml",
				"DT-CM" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorDualComparison/DualComparisonChip.xml",
				"DT-AT" : "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatorDualDeviation/DualDeviationChip.xml"
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
	},

	setGenericDrillDown: function(navType) {
		return (navType == 0) ? true : false;
	},

	setOtherDrillDown: function(navType) {
		return (navType > 0) ? true : false;
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
		var buttonsList = [
		                   {
		                	   sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("DELETE_DRAFT"),
		                	   onBtnPressed : function(evt) {
		                		   sap.m.MessageBox.show(
		                				   that.oApplicationFacade.getResourceBundle().getText("WANT_TO_DELETE_SELECTED_TILE"),
		                				   "sap-icon://hint",
		                				   that.oApplicationFacade.getResourceBundle().getText("DELETE"),
		                				   [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
		                				   function(evt){
		                					   if(evt=="OK"){
		                						   //xsjs remove
		                						   sap.suite.ui.smartbusiness.lib.Util.utils.remove(sap.suite.ui.smartbusiness.lib.Util.utils.serviceUrl("CHIP_SERVICE_URI"),{id:that.currentChipId,isActive:that.currentContextState},function(data) {
		                							   sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
		                							   //that.oApplicationFacade.getODataModel().refresh();
		                							   that.refreshMasterList();
		                							   sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
		                						   },function(err){
		                							   sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.response.body);
		                						   });
		                					   }
		                					   if(evt=="CANCEL"){

		                					   }
		                				   }
		                		   );
		                	   },
		                   }, {
		                	   sI18nBtnTxt : "SAVE_CREATE_NEW",
		                	   onBtnPressed : function(evt) {
		                		   function saveAndCreateNewCallBack() {
		                			   that.refreshMasterList();
		                			   var hashObj = hasher || window.hasher;
		                			   var currentHash = hasher.getHash();
		                			   sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "configureSBKPITile"});
		                			   setTimeout(function(){
		                				   sap.suite.ui.smartbusiness.lib.Util.utils.hashChange({hash: currentHash});
		                			   },0);
		                		   }
		                		   that.saveTile(saveAndCreateNewCallBack);
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

		if(chipObj && chipObj.CHIP) {
			if((!(chipObj.CHIP.isActive)) && (this.editMode)) {
				this.oHeaderFooterOptions.buttonList.push(buttonsList[0]);
			}
		}
		for(var i=1,l=buttonsList.length; i<l; i++) {
			if(i==2) {
				if(chipObj.CHIP && (chipObj.CHIP.isActive == 1)) {
					this.oHeaderFooterOptions.buttonList.push(buttonsList[i]);
				}
			}
			else {
				this.oHeaderFooterOptions.buttonList.push(buttonsList[i]);
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
	},

	handleSemanticObjectChange: function(evt) {
		this.tempSemanticObject = evt.getSource().getValue();
		if(evt.getSource().getValue()) {
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
		if(this.modelRef.getData().CHIP.navType.toString() == "0" || this.modelRef.getData().CHIP.navType.toString() == "4") {
			this.onLoadSemanticObject = evt.getSource().getValue();
		}
	},

	setSemanticAction: function(evt) {
		this.tempAction = evt.getSource().getValue();
		if(evt.getSource().getValue()) {
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

	handleStoryIdValueHelp: function() {
		var that = this;
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
				//that.byId("selectStoryId").setValue(that.tileConfigurationModel.getData().storyId);
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterPackage = new sap.ui.model.Filter("tolower(NAME)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterObject = new sap.ui.model.Filter("tolower(UUID)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage, oFilterObject], false));
			}
		});
		storyIdValueHelpDialog.open();
		var oDataStoryIdModel = new sap.ui.model.odata.ODataModel("/sap/bi/launchpad/integration/smb.xsodata",true);
		storyIdValueHelpDialog.setModel(oDataStoryIdModel);
		if(this.evaluationObj.VIEW_NAME) {
			storyIdValueHelpDialog.getBinding("items").filter([new sap.ui.model.Filter("VIEW_NAME","EQ",this.evaluationObj.VIEW_NAME)]);
		}
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
				        		  var deletedIndex = parseInt(path.substr(path.length - 1));
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
			errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_CONFIG_ID") + "\n";
			that.byId("apfConfId").setValueState("Error");
			that.byId("apfConfId").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_CONFIG_ID"));
		}
		if(!(data.title) || (data.title.length == (data.title.split(" ").length - 1))) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_TITLE") + "\n";
			that.byId("tileTitle").setValueState("Error");
			that.byId("tileTitle").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_TITLE"));
		}
		if(!(data.description) || (data.description.length == (data.description.split(" ").length - 1))) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_DESCRIPTION") + "\n";
			that.byId("tileSubtitle").setValueState("Error");
			that.byId("tileSubtitle").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_DESCRIPTION"));
		}
		if(!(data.catalogId)) {
			errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_SELECT_CATALOG") + "\n";
			that.byId("allCatalogs").setValueState("Error");
			that.byId("allCatalogs").setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_SELECT_CATALOG"));
		}
		if(data.tileType == "CM" && !(errorLog)) {
			configuration = that.formChipConfiguration();
			var evaluation = JSON.parse(JSON.parse(JSON.parse(configuration.configuration).tileConfiguration).EVALUATION);
			var evaluationMultiMeasureArray = evaluation.COLUMN_NAMES;
			if(!(evaluationMultiMeasureArray) || !(evaluationMultiMeasureArray.length) || (evaluationMultiMeasureArray.length < 2)) {
				errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES") + "\n";
			}
			else {
				for(var i=0,l=evaluationMultiMeasureArray.length; i<l; i++) {
					if(!(evaluationMultiMeasureArray[i].COLUMN_NAME) || !(evaluationMultiMeasureArray[i].semanticColor)) {
						errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES") + "\n";
						break;
					}
				}
				if(!errorLog) {
					if(evaluationMultiMeasureArray.length == 2) {
						if(evaluationMultiMeasureArray[0].COLUMN_NAME == evaluationMultiMeasureArray[1].COLUMN_NAME) {
							errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES") + "\n";
						}
					}
					else if(evaluationMultiMeasureArray.length == 3) {
						if(evaluationMultiMeasureArray[0].COLUMN_NAME == evaluationMultiMeasureArray[1].COLUMN_NAME) {
							errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES") + "\n";
						} 
						else if(evaluationMultiMeasureArray.COLUMN_NAME == evaluationMultiMeasureArray[2].COLUMN_NAME) {
							errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES") + "\n";
						}
						else if(evaluationMultiMeasureArray[1].COLUMN_NAME == evaluationMultiMeasureArray[2].COLUMN_NAME) {
							errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES") + "\n";
						}
					}
				}
			}
		}
		return errorLog;
	},

	saveTile: function(callback) {
		var that = this;
		var errorLog = "";
		var configuration = null;
		errorLog = that.checkForValidChipForActivation();
		if(errorLog) {
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), errorLog);
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
				that.busyDialog.close();
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("TILE_SAVED_SUCCESSFULLY"));
				//that.oApplicationFacade.getODataModel().refresh();
				that.oApplicationFacade.__tileModified = true;
				if(callback) {
					callback();
				}
				else {
					that.refreshMasterList();
					sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
				}
			}

			function publishChipErrCallBack(err){
				that.busyDialog.close();
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_TILE"), (err.responseText || err.description || err.title || JSON.stringify(err)));
			}

			mode = that.createMode ? "create" : (that.editMode ? "edit" : "edit");
			that.busyDialog.open();
			that.metadataRef.publishChip(configuration, mode, that, publishChipCallBack, publishChipErrCallBack);
		}
	},
	
	handleBackAndCancel: function() {
		var that = this;
		
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
		
//		var obj = {};
//		var oldPayload = that.initialData;
//		var newPayload = that.modelRef.getData();
//		
//		var appParameters = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
//			oldPayload : oldPayload.CHIP.APP_PARAMETERS,
//			newPayload : newPayload.CHIP.APP_PARAMETERS,
//			objectType : "APP_PARAMETERS"
//		});
//		
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
//			for(var i=0;i<newPayload.NO_OF_ADDITIONAL_LANGUAGES.length;i++){
//				var chipTextObject = {};
//				chipTextObject.title = newPayload.ADDITIONAL_LANGUAGE_ARRAY[i].title;
//				chipTextObject.description = newPayload.ADDITIONAL_LANGUAGE_ARRAY[i].description;
//				chipTextObject.language = newPayload.ADDITIONAL_LANGUAGE_ARRAY[i].language;
//				that.chipTextPayload.push(chipTextObject);
//			}
//		}
//		that.languagePayloadForDirtyBitTest = []; 
//		for(var i=0;i<oldPayload.NO_OF_ADDITIONAL_LANGUAGES.length;i++){
//			var textObject = {};
//			textObject.language = oldPayload.NO_OF_ADDITIONAL_LANGUAGES[i].language;
//			textObject.description = oldPayload.NO_OF_ADDITIONAL_LANGUAGES[i].description;
//			textObject.title= oldPayload.NO_OF_ADDITIONAL_LANGUAGES[i].title;
//			that.languagePayloadForDirtyBitTest.push(textObject);
//		}
//		var languageDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
//			oldPayload : that.languagePayloadForDirtyBitTest,
//			newPayload : that.chipTextPayload,
//			objectType : "CHIP_TEXTS"
//		});
//		
//		if((obj && obj.updates && obj.updates.length) || (languageDeltaObject && languageDeltaObject.deletes && languageDeltaObject.deletes.length) || (languageDeltaObject && languageDeltaObject.updates && languageDeltaObject.updates.length) || (appParameters && appParameters.deletes && appParameters.deletes.length) || (appParameters && appParameters.updates && appParameters.updates.length)) {
//			var backDialog = new sap.m.Dialog({
//				icon:"sap-icon://warning2",
//				title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
//				state:"Error",
//				type:"Message",
//				content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("ON_BACK_WARNING")})],
//				beginButton: new sap.m.Button({
//					text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
//					press: function(){
//						sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
//					}
//				}),
//				endButton: new sap.m.Button({
//					text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
//					press:function(){backDialog.close();}
//				})                                              
//			});
//			backDialog.open();
//		}
//		else {
//			sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
//		}
	},
	
	fetchChipData: function(obj) {
		var pageString = 'X-SAP-UI2-PAGE';
		var that = this;
		var finalChipObj = {};
		if(this.createMode) {
			var evaluationObj = {};
			if(obj.evalContextPath) {
				var evalContext = new sap.ui.model.Context(this.oApplicationFacade.getODataModel(), '/' + obj.evalContextPath);
				evaluationObj = this.metadataRef.getEvaluationById({context:evalContext, texts:true, entity:"EVALUATIONS_MODELER", model:that.oApplicationFacade.getODataModel()});
				finalChipObj = this.formModelByEvaluation(evaluationObj);
			}
		}
		else if(this.editMode) {
			var chipObj = {};
			var evaluationObj = {};
			if(obj.chipContextPath) {
				obj.chipContextPath = obj.chipContextPath.replace("id","ID");
				obj.chipContextPath = obj.chipContextPath.replace("isActive","IS_ACTIVE");
				var chipContext = new sap.ui.model.Context(this.oApplicationFacade.getODataModel(), '/' + obj.chipContextPath);
				var evalContext = new sap.ui.model.Context(this.oApplicationFacade.getODataModel(), '/' + obj.evalContextPath);
				evaluationObj = this.metadataRef.getEvaluationById({context:evalContext, entity:"EVALUATIONS_MODELER", model:that.oApplicationFacade.getODataModel()});
				chipObj = this.metadataRef.getChipById({context:chipContext, evaluation:false, texts:false, model:that.oApplicationFacade.getODataModel()});
				chipObj.EVALUATION = evaluationObj.EVALUATION;
				
				//bean needs to be created for this
				chipObj.CHIP.id = chipObj.CHIP.ID;
				chipObj.CHIP.catalogId = chipObj.CHIP.CATALOG_ID;
				chipObj.CHIP.evaluationId = chipObj.CHIP.EVALUATION_ID;
				chipObj.CHIP.tileType = chipObj.CHIP.TYPE;
				
				function chipInfoFetchSuccCallBack(data) {
					var chips = (data.Chips && data.Chips.results) ? data.Chips.results : [];
					var bagObj = {};
					var tilePropertiesArr = [];
					var chip = {};
					chipObj.CHIP.title = chip.title;
					chipObj.CHIP.title = '';
					for(var i=0,l=chips.length; i<l; i++) {
						if(chips[i].catalogPageChipInstanceId == chipObj.CHIP.id) {
							chip = chips[i];
							if(chips[i].ChipBags && chips[i].ChipBags.results && chips[i].ChipBags.results.length) {
								bagObj = chips[i].ChipBags.results[0];
								if(bagObj.ChipProperties && bagObj.ChipProperties.results && bagObj.ChipProperties.results.length) {
									tilePropertiesArr = bagObj.ChipProperties.results;
									for(var i=0,l=tilePropertiesArr.length; i<l; i++) {
										if(tilePropertiesArr[i].name == "title") {
											chipObj.CHIP.title = tilePropertiesArr[i].value;
										}
										if(tilePropertiesArr[i].name == "description") {
											chipObj.CHIP.description = tilePropertiesArr[i].value;
										}
									}
								}
							}
						}
					}
					chipObj.CHIP.catalogName = data.title;
					//chipObj.CHIP.title = chip.title;
					chipObj.CHIP.url = chip.url;
					chipObj.CHIP.configuration = chip.configuration;
					finalChipObj = that.formModelByChip(chipObj);
					that.currentContextState = finalChipObj.CHIP.isActive;
					that.currentChipId = finalChipObj.CHIP.id;
					that.fetchOtherInfoAsync(finalChipObj);
					return finalChipObj;
				}
				// Test this UI2 Chip Catalog
				that.oPBService.readCatalog(chipObj.CHIP.CATALOG_ID,chipInfoFetchSuccCallBack, null, false, false);
				//that.oPBService.readCatalogChips(chipObj.CHIP.CATALOG_ID, [pageString + ':' + chipObj.CHIP.CATALOG_ID + ':' + chipObj.CHIP.ID], chipInfoFetchSuccCallBack);
				return;
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
		chipObj.CHIP.id = "";
		chipObj.CHIP.isActive = 1;
		chipObj.CHIP.evaluationId = obj.ID;
		chipObj.CHIP.tileType = "NT";
		chipObj.CHIP.dualTileType = "CT";
		chipObj.CHIP.title = obj.INDICATOR_TITLE || "";
		chipObj.CHIP.description = obj.TITLE || "";
		chipObj.CHIP.url = chipObj.url || this.getChipUrl(chipObj.tileType);
		chipObj.CHIP.configuration = "";
		chipObj.CHIP.storyId = "";
		chipObj.CHIP.navType = (!(obj.ACTION) || (obj.ACTION == this.sbAction)) ? "0" : "4";
		if(chipObj.CHIP.navType == "0") {
			chipObj.CHIP.semanticObject = obj.SEMANTIC_OBJECT || obj.COLUMN_NAME || "";
			chipObj.CHIP.semanticAction = obj.ACTION || this.sbAction;
		}
		else {
			//chipObj.CHIP.semanticObject = this.lumiraSemanticObject;
			//chipObj.CHIP.semanticAction = this.lumiraAction;
			chipObj.CHIP.semanticObject = obj.SEMANTIC_OBJECT || obj.COLUMN_NAME || "";
			chipObj.CHIP.semanticAction = obj.ACTION || this.sbAction;
		}
		this.onLoadSemanticObject = obj.SEMANTIC_OBJECT || obj.COLUMN_NAME || "";
		this.onLoadSemanticAction = obj.ACTION || this.sbAction;
		chipObj.CHIP.appParameters = [];
		chipObj.CHIP.dimension = "";
		chipObj.CHIP.sortOrder = "0";
		chipObj.CHIP.semanticColorContribution = "Neutral";
		chipObj.CHIP.frameType = 'OneByOne';
		chipObj.CHIP.MULTI_MEASURE = [{COLUMN_NAME: obj.COLUMN_NAME, semanticColor: "Error"}, {COLUMN_NAME: "", semanticColor: "Critical"}, {COLUMN_NAME: "", semanticColor: "Good"}];
		chipObj.CHIP.navLikeTId = "";
		chipObj.CHIP.navLikeTCId = "";
		chipObj.TEXTS = [];
		for(var i=0,l=evaluation.TEXTS; i<l; i++) {
			chipObj.TEXTS[i].id = "";
			chipObj.TEXTS[i].title = evaluation.TEXTS[i].TITLE;
			chipObj.TEXTS[i].description = evaluation.TEXTS[i].DESCRIPTION;
			chipObj.TEXTS[i].language = evaluation.TEXTS[i].LANGUAGE;
		}
		//chipObj.TEXTS = evaluation.TEXTS;
		chipObj.EVALUATION = obj;
		return chipObj;
	},
	
	formModelByChip: function(chip) {
		var that = this;
		var obj = chip.CHIP;
		var chipObj = {CHIP:{}};
		if(chip.EVALUATION_INFO) {
			chipObj.EVALUATION = chip.EVALUATION_INFO;
		}
		if(chip.EVALUATION) {
			chipObj.EVALUATION = chip.EVALUATION;
		}
		chipObj.TEXTS = chip.TEXTS;
		chipObj.CHIP.id = obj.id || "";
		chipObj.CHIP.isActive = 1; //obj.isActive;
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
		
		if(obj.catalogName) {
			chipObj.CHIP.catalogName = obj.catalogName;
		}
		
		if(obj.catalogId) {
			chipObj.CHIP.catalogId = obj.catalogId;
		}
		
		chipObj.CHIP.title = obj.title || "";
		chipObj.CHIP.description = obj.description || "";
		chipObj.CHIP.url = obj.url || this.getChipUrl(chipObj.tileType);
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
						chipObj.CHIP.dimension = tileProperties.dimension || "";
						chipObj.CHIP.sortOrder = tileProperties.sortOrder || "";
						chipObj.CHIP.semanticColorContribution = tileProperties.semanticColorContribution || "Neutral";
						chipObj.CHIP.navLikeTId = tileProperties.navLikeTId || "";
						chipObj.CHIP.navLikeTCId = tileProperties.navLikeTCId || "";
						chipObj.CHIP.navLikeTName = chipObj.CHIP.navLikeTId ? '-NA-' + chipObj.CHIP.navLikeTId : "";
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
		
//		// Fetch All Sap Languages
//		this.oApplicationFacade.getODataModel().read("/LANGUAGE?$select=LAISO,SPRAS", null, null, false, function(data) {
//			data = data.results;
//			if(data.length) {
//				if(data.length == 1) {
//					obj.SAP_LANGUAGES = {LAISO:{},SPRAS:{}};
//					obj.SAP_LANGUAGES.LAISO[data[0]["LAISO"]] = data[0]["SPRAS"]; that.languagesObject.SPRAS[data[0]["SPRAS"]] = data[0]["LAISO"];
//				}
//				else {
//					obj.SAP_LANGUAGES = data.reduce(function(p,c,i,a) { that.languagesObject = that.languagesObject || {}; that.languagesObject.LAISO = that.languagesObject.LAISO || {}; that.languagesObject.SPRAS = that.languagesObject.SPRAS || {}; if(i == 1){ that.languagesObject.LAISO[a[0]["LAISO"]] = a[0]["SPRAS"]; that.languagesObject.SPRAS[a[0]["SPRAS"]] = a[0]["LAISO"]; }  that.languagesObject.LAISO[a[i]["LAISO"]] = a[i]["SPRAS"]; that.languagesObject.SPRAS[a[i]["SPRAS"]] = a[i]["LAISO"]; return that.languagesObject;});
//				}
//				obj.SAP_LANGUAGE_ARRAY = data;
//				obj.localLanguage = obj.SAP_LANGUAGES.LAISO[sap.ui.getCore().getConfiguration().getLocale().getLanguage().split("-")[0].toUpperCase()];
//			}
//		});
//		
//		// Pick Additional Language Texts
//		var languageData = obj.TEXTS;
//		var additionalLanguageData = [];
//		var i;
//		for(i=0;i<languageData.length;i++){
//			if(languageData[i].language != obj.localLanguage){
//				additionalLanguageData.push(languageData[i]);
//			}
//		}
//		var languageArray = [];
//		var i;
//		for(i=0;i<additionalLanguageData.length;i++){
//			var languageObject = {};
//			languageObject.title = additionalLanguageData[i].title;
//			languageObject.description = additionalLanguageData[i].description;
//			languageObject.language = additionalLanguageData[i].language;
//			languageObject.isoLanguage = obj.SAP_LANGUAGES.SPRAS[languageObject.language]
//			languageObject.isActive = obj.isActive;
//			languageArray.push(languageObject);
//		}
//		obj.ADDITIONAL_LANGUAGE_ARRAY = languageArray;
//		obj.NO_OF_ADDITIONAL_LANGUAGES = obj.ADDITIONAL_LANGUAGE_ARRAY.length || 0;
//		that.byId('additionalLanguageLink').bindProperty("text","tileConfig>/NO_OF_ADDITIONAL_LANGUAGES",function(sValue){
//			return that.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+sValue+")";
//		});
		
		// Pick Control Visibility
		obj.CONTROL = this.getControlObject(obj);
		
		// Fetch All Dimensions For Contribution Tile, Trend Tile
		try {
			this.oModelForEntity = this.populateDimension(obj.EVALUATION.ODATA_URL, obj.EVALUATION.ODATA_ENTITYSET);
			obj.CHIP.dimension = obj.CHIP.dimension || this.oModelForEntity.getData().dimensions[0].dimensionName; 
		} catch (err) {

		} finally {
			if (this.oModelForEntity && this.oModelForEntity.getData() && this.oModelForEntity.getData().dimensions && this.oModelForEntity.getData().dimensions.length) {
				obj.DIMENSIONS = this.oModelForEntity.getData();
			} else {
				obj.DIMENSIONS = [];
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("UNABLE_TO_FETCH_NAVIG"));
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
				that.cache.inSufficientAdditionalMeasure = true;
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
			that.busyDialog.close();
			
			if(!(that.env)) {
				// Fetch Navigate Like Tile Info From UI2 for Title, Description
				function fetchNavLikeTileCallBack(chip) {
					var modelData = that.modelRef.getData();
					if(chip.ChipBags && chip.ChipBags.results && chip.ChipBags.results.length) {
						if(chip.ChipBags.results[0] && chip.ChipBags.results[0].ChipProperties && chip.ChipBags.results[0].ChipProperties.results && chip.ChipBags.results[0].ChipProperties.results.length) {
							var chipBagProperties = chip.ChipBags.results[0].ChipProperties.results;
							for(var i=0,l=chipBagProperties.length; i<l; i++) {
								if(chipBagProperties[i].name == "title") {
									modelData.CHIP.navLikeTName = chipBagProperties[i].value;
									that.getView().getModel("tileConfig").setData(modelData);
								}
							}
						}
					}
				}

				function fetchNavLikeTileErrCallBack(d,s,x) {

				}

				if(obj.CHIP.navLikeTId && obj.CHIP.navLikeTCId) {
					that.metadataRef.readChipFromUI2ById(obj.CHIP.navLikeTCId, obj.CHIP.navLikeTId, fetchNavLikeTileCallBack, fetchNavLikeTileErrCallBack);
				}
				
				// Fetch the SAP:Copied_From Evaluation Id from PROPERTIES entity
				function fetchSAPCopiedEvaluationCallBack(evals) {
					that.cache.sapCopiedEvaluation = (evals && evals.length) ? evals[0].VALUE : "";
					jQuery.sap.log.info("SAP Copied Evaluation - " + that.cache.sapCopiedEvaluation);
				}
				function fetchSAPCopiedEvaluationErrCallBack() {
					
				}
				that.metadataRef.getDataByEntity({entity:"PROPERTIES", async:false, filter:"TYPE eq 'EV' and IS_ACTIVE eq 1 and ID eq '" + obj.EVALUATION.ID + "' and NAME eq 'SAP:Copied_From'", success:fetchSAPCopiedEvaluationCallBack, error:fetchSAPCopiedEvaluationErrCallBack, model:that.oDataModel});
			}		
			
			that.getView().byId(obj.CHIP.tileType).$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
			if(that.errorConfigParse) {
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_PARSE_CHIP_INFO"));
			}
			that.errorConfigParse = false;
			that.initialData = jQuery.extend(true,{},obj,{});
			if(obj.CHIP.tileType && obj.CHIP.tileType == "DT") {
				var selectedTile=that.getView().byId("selectTileType").getSelectedKey();
				that.getView().byId("selectVizRight").fireChange(selectedTile);
			}
		};
		that.metadataRef.getEvaluationById({ID:obj.CHIP.evaluationId, IS_ACTIVE:1, async:true, success:successHandler, noEvaluation:true, tags:true, indicator_tags:true, values:true, filters:true, entity:"EVALUATIONS_MODELER", model:that.oApplicationFacade.getODataModel()});
		return obj;
	},
	selectVizRight : function(){
	    var rightViz;
	    var dataRef = this.modelRef.getData();
	    dataRef.CONTROL = dataRef.CONTROL || {};
        var rightVizKey = this.getView().byId("selectVizRight").getSelectedKey();
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
        this.getView().byId("DT").getTileContent()[1].setContent(rightViz);
        this.modelRef.setData(dataRef);
	    
	},
	
	getControlObject: function(obj) {
		var control = obj.CONTROL || {};
		
		this.getView().byId('NT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('CT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('TT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('AT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('CM').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId('DT').$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
		this.getView().byId(obj.CHIP.tileType).$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
		
		if(obj && obj.CHIP && obj.CHIP.tileType) {
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
			default : break;
			}
		}
		
		if(obj && obj.CHIP && obj.CHIP.navType) {
			switch(obj.CHIP.navType.toString()) {
			case '0': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = false;
			control.vStoryId = false;
			control.vSelectNavType = false;
			break;
			case '1': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = true;
			control.vStoryId = true;
			control.vSelectNavType = true;
			break;
			case '2': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = true;
			control.vStoryId = false;
			control.vSelectNavType = true;
			break;
			case '3': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = true;
			control.vStoryId = false;
			control.vSelectNavType = true;
			break;
			case '4': control.vSemanticObject = true;
			control.vAction = true;
			control.eAction = true;
			control.vStoryId = false;
			control.vSelectNavType = true;
			break;
			default: break; 
			}
			control.vSelectNavigationType = true;
			control.vAppParameter = true;
		}
		if(this.env) {
			control.vNavigateLikeTile = false;
		}
		else {
			control.vNavigateLikeTile = true;
			control.vSemanticObject = false;
			control.vAction = false;
			control.eAction = false;
			control.vStoryId = false;
			control.vSelectNavType = false;
			control.vSelectNavigationType = false;
			control.vAppParameter = false;
		}
		
		if(this.createMode) {
			control.eSelectTileType = true;
			control.eSelectCatalog = true;
		}
		else if(this.editMode) {
			control.eSelectTileType = false;
			control.eSelectCatalog = false;
		}
		
		return control;
	},
	
	getSAPCopiedEvaluationChips:function(succ,err) {
		var that = this;
		function fetchSAPCopiedEvaluationChipsCallBack(chipObj) {
			that.cache.sapCopiedEvaluationChipObj = chipObj;
			if(succ) {
				succ(that.cache.sapCopiedEvaluationChipObj);
			}
		}
		function fetchSAPCopiedEvaluationChipsErrCallBack() {

		}
		if(that.cache.sapCopiedEvaluationChipObj) {
			if(succ) {
				succ(that.cache.sapCopiedEvaluationChipObj);
			}
		}
		else {
			if(!(that.cache.sapCopiedEvaluation)) {
				if(succ) {
					succ([]);
				}
				return;
			}
			that.metadataRef.getChipByEvaluation({ID:that.cache.sapCopiedEvaluation, IS_ACTIVE:1, success:fetchSAPCopiedEvaluationChipsCallBack, error:fetchSAPCopiedEvaluationChipsErrCallBack, model:that.oDataModel});
		}
	},

	getChipIdsForSAPEvaluation:function(succ,err,partially) {
		var that = this;
		partially = (partially) ? true : false;
		function fetchSAPCopiedEvaluationChipsCallBack(chipObj) {
			that.cache.chipIdsForSAPEvaluation = chipObj;
			if(succ) {
				succ(that.cache.chipIdsForSAPEvaluation);
			}
		}
		function fetchSAPCopiedEvaluationChipsErrCallBack() {

		}
		if(that.cache.chipIdsForSAPEvaluation) {
			if(succ) {
				succ(that.cache.chipIdsForSAPEvaluation);
			}
		}
		else {
			if(!(that.cache.sapCopiedEvaluation)) {
				if(succ) {
					succ([]);
				}
				return;
			}
			that.metadataRef.getChipByEvaluation({ID:that.cache.sapCopiedEvaluation, IS_ACTIVE:1, noEvaluation:true, success:fetchSAPCopiedEvaluationChipsCallBack, error:fetchSAPCopiedEvaluationChipsErrCallBack, partial:true, model:that.oDataModel});
		}
	},
	
	listAllCatalogs:function(evt){
		var that = this;
		var catalogModel =  new sap.ui.model.json.JSONModel();
		var filter = undefined;
		that.catalogModel = catalogModel;
		that.catalogsObj = {};

		function fetchAllCatalogsCallBack(d) {
			if(d) {
				var allCatalogs = d.results || d;
				var allCatalogIds = [];
				that.cache.allUI2Catalogs = that.cache.allUI2Catalogs || allCatalogs;
				if(that.env) {
					catalogModel.setData({Catalogs:that.cache.allUI2Catalogs});
					that.busyDialog.close();
					that.customMeasuresDialog.open();
					return;
				}
				else {
					if(!(that.oPBService.getReferencingCatalogIds)) {
						that.cache.relevantCustCatalogs = that.cache.allUI2Catalogs;
						catalogModel.setData({Catalogs:that.cache.allUI2Catalogs});
						that.busyDialog.close();
						that.customMeasuresDialog.open();
						jQuery.sap.log.error("getReferencingCatalogIds API missing, showing all Catalogs");
						return;
					}
					if(that.cache.relevantCustCatalogs) {
						that.catalogModel.setData({Catalogs:that.cache.relevantCustCatalogs});
						that.busyDialog.close();
						that.customMeasuresDialog.open();
						return;
					}
					if(!(that.cache.allUI2CatalogIds)) {
						for(var i=0,l=allCatalogs.length; i<l; i++) {
							allCatalogIds.push(allCatalogs[i].id);
							that.catalogsObj[allCatalogs[i].id] = allCatalogs[i].title;
						}
						that.cache.allUI2CatalogIds = allCatalogIds;
					}
					function fetchSAPCopiedEvaluationChipsCallBack(chipObj) {
						var UI2_PAGE = 'X-SAP-UI2-PAGE';
						var chips = chipObj.CHIPS;
						var chipCount = (chips) ? (chips.length-1) : 0;
						var referencedChipId = null;
						var catalogObj = {};
						var catalogs = [];
						// Calling To get Reference Catalogs Id
						function referenceCatalogsCallBack(d) {
							if(d) {
								d = (d.results) ? d.results : d;
								for(var j=0,m=d.length; j<m; j++) {
									if(!(catalogObj[d[j]])) {
										catalogObj[d[j]] = true;
										catalogs.push({id:d[j], title:that.catalogsObj[d[j]]});
									}
								}
								if(chipCount == 0) {
									that.cache.relevantCustCatalogs = catalogs;
									that.catalogModel.setData({Catalogs:catalogs});
									that.busyDialog.close();
									that.customMeasuresDialog.open();
								}
								else {
									chipCount--;
								}
							}
						}
						
						function referenceCatalogsErrCallBack(d,s,x) {
							that.busyDialog.close();
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("REF_CATALOG_FETCH_ERROR"));
						}
						
						if(chips && chips.length) {
							for(var i=0,l=chips.length; i<l; i++) {
								referencedChipId = UI2_PAGE + ":" + chips[i].CATALOG_ID + ":" + chips[i].ID;
								that.oPBService.getReferencingCatalogIds(referencedChipId, that.cache.allUI2CatalogIds, referenceCatalogsCallBack, referenceCatalogsErrCallBack);
							}
						}
						else {
							jQuery.sap.log.error("No tiles in the SAP shipped evaluation");
							that.cache.relevantCustCatalogs = catalogs;
							that.catalogModel.setData({Catalogs:catalogs});
							that.busyDialog.close();
							that.customMeasuresDialog.open();
						}
						
					}
					function fetchSAPCopiedEvaluationChipsErrCallBack(chipObj) {
						that.catalogModel.setData({Catalogs:[]});
						that.customMeasuresDialog.open();
						that.busyDialog.close();
					}
					that.getChipIdsForSAPEvaluation(fetchSAPCopiedEvaluationChipsCallBack, fetchSAPCopiedEvaluationChipsErrCallBack);
				}
			}
		}

		function fetchAllCatalogsErrCallBack(d) {
			that.catalogModel.setData({Catalogs:[]});
			that.busyDialog.close();
		}
		
		this.customMeasuresDialog = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("SELECT_CATALOGUE"),
			noDataText : that.oApplicationFacade.getResourceBundle().getText("NO_DATA"),
			items : {
				path : "/Catalogs",
				template : new sap.m.StandardListItem({
					title : {path:"title", formatter:that.formatCatalogTitle},
					description : {path: "id", formatter:jQuery.proxy(that.formatTileId,that)}

				})
			},
			confirm : function(oEvent) {
				var value = oEvent.getParameter("selectedItem").getBindingContext().getObject().title;
				that.selectedCatalogId= oEvent.getParameter("selectedItem").getBindingContext().getObject().id;
				//currentInput.setValue(value);
				var data = that.modelRef.getData();
				data.CHIP.catalogId = that.selectedCatalogId;
				data.CHIP.catalogName = value;
				that.modelRef.setData(data);
				that.byId("allCatalogs").setValueState("None");
			},
			liveChange : function(oEvent) {
				var searchValue = "" + oEvent.getParameter("value").toLowerCase() + "";
				var oFilterCatalogName = new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterCatalogId = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterCatalogName, oFilterCatalogId], false));
			}
		});
		this.customMeasuresDialog.setModel(that.catalogModel);
		
		filter = "startswith(id,'X-SAP-UI2-CATALOGPAGE')";
		//filter = (that.env) ? "startswith(id,'X-SAP-UI2-CATALOGPAGE')" : "startswith(id,'X-SAP-UI2-CATALOGPAGE:SAP')";
		if(that.cache.allUI2Catalogs) {
			fetchAllCatalogsCallBack(that.cache.allUI2Catalogs);
		}
		else {
			that.busyDialog.open();
			that.metadataRef.readAllUI2Catalogs(fetchAllCatalogsCallBack, fetchAllCatalogsErrCallBack, filter);
		}
		
	},

	listAllTilesForNavigation: function() {
		var that = this;
		var obj = {};
		that.navigateLikeTileModel =  new sap.ui.model.json.JSONModel();
		
		this.navigateLikeTileDialog = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("SELECT_TILE"),
			noDataText : that.oApplicationFacade.getResourceBundle().getText("NO_DATA"),
			items : {
				path : "/CHIPS",
				template : new sap.m.StandardListItem({
					title : {path:"title", formatter:that.formatNavLikeTileTitle},
					description : {path: "id", formatter:jQuery.proxy(that.formatTileId,that)}

				})
			},
			confirm : function(oEvent) {
				var data = that.modelRef.getData();
				var navigateLikeTileName = oEvent.getParameter("selectedItem").getBindingContext().getObject().title;
				var navigateLikeTileId = oEvent.getParameter("selectedItem").getBindingContext().getObject().id;
				var navigateLikeTileCatalogId = oEvent.getParameter("selectedItem").getBindingContext().getObject().catalogId
				var configuration = oEvent.getParameter("selectedItem").getBindingContext().getObject().configuration;
				try {
					data.CHIP.navLikeTName = navigateLikeTileName;
					data.CHIP.navLikeTId = navigateLikeTileId;
					data.CHIP.navLikeTCId = navigateLikeTileCatalogId;
					configuration = JSON.parse(configuration);
					var tileConfiguration = JSON.parse(configuration.tileConfiguration);
					var tileProperties = JSON.parse(tileConfiguration.TILE_PROPERTIES);
					var appParameters = JSON.parse(tileConfiguration.ADDITIONAL_APP_PARAMETERS);
					data.CHIP.navType = tileProperties.navType;
					data.CHIP.semanticObject = tileProperties.semanticObject;
					data.CHIP.semanticAction = tileProperties.semanticAction;
					
					if(tileProperties.storyId) {
						data.CHIP.storyId = tileProperties.storyId;
					}
					if(tileProperties.apfConfId) {
						data.CHIP.apfConfId = tileProperties.apfConfId;
					}
					data.CHIP.APP_PARAMETERS = [];
					if(Object.keys(appParameters).length) {
						for(var parameter in appParameters) {
							if(appParameters.hasOwnProperty(parameter)) {
								data.CHIP.APP_PARAMETERS.push({NAME:parameter, VALUE:appParameters[parameter]});
							}
						}
						
					}
				}
				catch(e) {
					data.CHIP.navType = data.CHIP.navType || 0;
					data.CHIP.semanticObject = data.CHIP.semanticObject || that.modelRef.getData().EVALUATION.COLUMN_NAME;
					data.CHIP.semanticAction = data.CHIP.semanticAction || that.sbAction;
				}
				that.modelRef.setData(data);
			},
			liveChange : function(oEvent) {
				var searchValue = "" + oEvent.getParameter("value").toLowerCase() + "";
				var oFilterCatalogName = new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterCatalogId = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterCatalogName, oFilterCatalogId], false));
			}
		});
		this.navigateLikeTileDialog.setModel(that.navigateLikeTileModel);
		
		function fetchSAPCopiedEvaluationChipsCallBack(chipObj) {
			that.busyDialog.close();
			that.navigateLikeTileDialog.open();
			that.navigateLikeTileModel.setData({CHIPS:chipObj.CHIPS});
		}
		
		function fetchSAPCopiedEvaluationChipsErrCallBack(chipObj) {
			that.navigateLikeTileDialog.open();
			that.busyDialog.close();
		}
		that.busyDialog.open();
		that.getSAPCopiedEvaluationChips(fetchSAPCopiedEvaluationChipsCallBack, fetchSAPCopiedEvaluationChipsErrCallBack);

	},
	
	formatNavLikeTileTitle: function(title) {
		var obj = this.getBindingContext().getObject()
		return (obj.title || obj.description) ? ((obj.title || "") + " - " + (obj.description || "")) : ("-NA-" + obj.id);
	},
	
	formatTileId: function(id) {
		return this.oApplicationFacade.getResourceBundle().getText("ID",id);
	},
	
	formatCatalogTitle: function(title) {
		var obj = this.getBindingContext().getObject();
		return obj.title || "-NA-" + obj.id;
	},
	
	refreshMasterList: function() {
 	   var that = this;
 	   that.utilsRef.refreshMasterList(that,false);
    },
    
    getInitialModelData: function() {
    	var control = {};
    	control.vNavigateLikeTile = false;
		control.vSemanticObject = false;
		control.vAction = false;
		control.eAction = false;
		control.vStoryId = false;
		control.vSelectNavType = false;
		control.vSelectNavigationType = false;
		control.vAppParameter = false;
		control.vDimension = false;
		control.vMultiMeasure = false;
		control.vSortOrder = false;
		control.vSemanticColorContribution = false;
		control.vVizLeft = false;
		control.vVizRight = false;
		
		if(this.createMode) {
			control.eSelectTileType = true;
			control.eSelectCatalog = true;
		}
		else if(this.editMode) {
			control.eSelectTileType = false;
			control.eSelectCatalog = false;
		}
		
		return {CONTROL:control};
    },
    
    getModelDataAfterEnv: function(env) {
    	var control = {};
    	if(env) {
    		control.vNavigateLikeTile = false;
    		control.vSemanticObject = true;
    		control.vAction = true;
    		control.eAction = true;
    		control.vStoryId = true;
    		control.vSelectNavType = true;
    		control.vSelectNavigationType = true;
    		control.vAppParameter = true;
    	}
    	else {
    		control.vNavigateLikeTile = true;
    		control.vSemanticObject = false;
    		control.vAction = false;
    		control.eAction = false;
    		control.vStoryId = false;
    		control.vSelectNavType = false;
    		control.vSelectNavigationType = false;
    		control.vAppParameter = false;
    	}
		control.vDimension = false;
		control.vMultiMeasure = false;
		control.vSortOrder = false;
		control.vSemanticColorContribution = false;
		control.vVizLeft = false;
		control.vVizRight = false;
		
		if(this.createMode) {
			control.eSelectTileType = true;
			control.eSelectCatalog = true;
		}
		else if(this.editMode) {
			control.eSelectTileType = false;
			control.eSelectCatalog = false;
		}
		
		return {CONTROL:control};
    }
	
});

