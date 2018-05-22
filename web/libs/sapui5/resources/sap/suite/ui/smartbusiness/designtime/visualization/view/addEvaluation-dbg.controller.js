/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.visualization.view.addEvaluation", {

	onInit : function() {
		var that = this;
		this.context = null;
		var saveStatus = false;
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");

		var oOptions = {
				onBack : function(){
					that.navigateBack();
				},
				bSuppressBookmarkButton : {},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						if(!(that.validateEvalId())) {
							if(that.getView().getModel().getData().mode == "create"){
								saveStatus = that.saveEvaluation();
							}
							else{
								saveStatus = that.updateEvaluation();
							}
							if(saveStatus){
								that.refreshMasterList();
								that.navigateBack();
							}
							
						}
					}
				},
				buttonList : [
//				              {
//					sI18nBtnTxt : "SAVE_CREATE_NEW",
//					onBtnPressed : function(evt) {
//						if(!(that.validateEvalId())) {
//							saveStatus = that.saveEvaluation();
//							if(saveStatus){
//								sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile"});
//								that.refreshMasterList();
//							}
//						}
//					}	
//				}, 
				{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.navigateBack();
					}
				}]
		};
		this.setHeaderFooterOptions(oOptions);
		this.busyDialog = new sap.m.BusyDialog();
		this.oResourceBundle = this.oApplicationFacade.getResourceBundle();
		this.evalCreateModel = new sap.ui.model.json.JSONModel({NO_OF_ADDITIONAL_LANGUAGES:0});
		this.getView().setModel(this.evalCreateModel);
		this.oDataServiceUrl = this.metadataRef.getDesigntimeServiceUrl();
		this.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataServiceUrl,true)
		this.oModelForInputParameters = new sap.ui.model.json.JSONModel();
		this.oModelForDimensions = new sap.ui.model.json.JSONModel();

		this.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES", 0);

		this.setInputParameterAndFilterLayout();
		this.decideMode();
	},
	
	saveEvaluation : function(){
		var modelData = this.evalCreateModel.getData();
		var that=this;
		var saveStatus = false;
		var languagePayloadArray = [];
		var languagePayload = null;
		if(modelData.NO_OF_ADDITIONAL_LANGUAGES>0){
			var i;
			for (i = 0; i < modelData.NO_OF_ADDITIONAL_LANGUAGES; i++) {
				languagePayload = {};
				languagePayload.LANGUAGE = modelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_SPRAS_KEY;
				languagePayload.TITLE = modelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
				languagePayload.DESCRIPTION = modelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
				languagePayloadArray.push(languagePayload);
			}
		}

		this.saveFilters(that.getView());

		var payload ={
				"keys" : {
					"ID" : modelData.ID,
					"IS_ACTIVE" : 1
				},
				"payload" : {
					"EVALUATION" : {
						"TITLE" : modelData.TITLE,
						"DESCRIPTION" : modelData.DESCRIPTION,
						"SCALING" : modelData.SCALING,
						"INDICATOR" : modelData.INDICATOR,
						"ODATA_URL" : modelData.ODATA_URL,
						"ODATA_ENTITYSET" : modelData.ODATA_ENTITYSET,
						"VIEW_NAME" : modelData.VIEW_NAME,
						"COLUMN_NAME" : modelData.COLUMN_NAME,
						"OWNER_NAME" : modelData.OWNER_NAME,
						"OWNER_E_MAIL" : modelData.OWNER_E_MAIL,
						"OWNER_ID" : modelData.OWNER_ID,
						"ODATA_PROPERTY" : modelData.ODATA_PROPERTY,
						"SEMANTIC_OBJECT" : modelData.SEMANTIC_OBJECT,
						"ACTION" : modelData.ACTION,
						"VALUES_SOURCE" : modelData.VALUES_SOURCE,
						"INDICATOR_TYPE" : modelData.INDICATOR_TYPE,
						"GOAL_TYPE" : modelData.GOAL_TYPE,
						"ENTITY_TYPE" : "EV"
					},
					"FILTERS": this.evalFiltersPayload,
					"TEXTS" : languagePayloadArray,
					"PROPERTIES" : [{
						"NAME" : "SAP:Copied_From",
						"VALUE" : that.byId('evalTemplateId').getValue(),
						"TYPE" : "EV"
					}],
					"VALUES" : modelData.VALUES
				}
		};

		this.metadataRef.create("EVALUATIONS",payload,null,function(data){
			sap.m.MessageToast.show(that.oResourceBundle.getText("EVALUATION_SAVED_SUCCESSFULLY"));
			saveStatus = true;
			
		},function(err){
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_EVALUATION"));
			saveStatus = false;
		},false);
		return saveStatus;
	},

	updateEvaluation : function(){

		var modelData = this.evalCreateModel.getData();
		var that=this;
		var saveStatus = false;
		
		var languagePayloadArray = [];
		var languagePayload = null;
		if(modelData.NO_OF_ADDITIONAL_LANGUAGES>0){
			var i;
			for (i = 0; i < modelData.NO_OF_ADDITIONAL_LANGUAGES; i++) {
				languagePayload = {};
				languagePayload.LANGUAGE = modelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_SPRAS_KEY;
				languagePayload.TITLE = modelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
				languagePayload.DESCRIPTION = modelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
				languagePayloadArray.push(languagePayload);
			}
		}
		
		this.saveFilters(that.getView());

		var payload ={
				"keys" : {
					"ID" : modelData.ID,
					"IS_ACTIVE" : 1,
				},
				"payload" : {
					"EVALUATION" : {
						"update" : {
							"TITLE" : modelData.TITLE,
							"DESCRIPTION" : modelData.DESCRIPTION,
							"SCALING" : modelData.SCALING,
							"INDICATOR" : modelData.INDICATOR,
							"ODATA_URL" : modelData.ODATA_URL,
							"ODATA_ENTITYSET" : modelData.ODATA_ENTITYSET,
							"VIEW_NAME" : modelData.VIEW_NAME,
							"COLUMN_NAME" : modelData.COLUMN_NAME,
							"OWNER_NAME" : modelData.OWNER_NAME,
							"OWNER_E_MAIL" : modelData.OWNER_E_MAIL,
							"OWNER_ID" : modelData.OWNER_ID,
							"ODATA_PROPERTY" : modelData.ODATA_PROPERTY,
							"SEMANTIC_OBJECT" : modelData.SEMANTIC_OBJECT,
							"ACTION" : modelData.ACTION,
							"VALUES_SOURCE" : modelData.VALUES_SOURCE,
						}
					},
					"FILTERS": {
						"remove" : that.OLD_FILTER_DATA,
						"create" : that.evalFiltersPayload
					},
					"TEXTS" : {
						"remove" : that.OLD_ADDITIONAL_LANGUAGE_ARRAY,
						"create" : languagePayloadArray,
					},
				}
		};

		this.metadataRef.update("EVALUATIONS",payload,null,function(data){
			sap.m.MessageToast.show(that.oResourceBundle.getText("EVALUATION_SAVED_SUCCESSFULLY"));
			saveStatus = true;
			
		},function(err){
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_SAVING_EVALUATION"));
			saveStatus = false;
		},null,null,false);
		return saveStatus;
	},

	saveFilters : function(form) {
		this.evalFiltersPayload = [];
		this.getInputParamPayload(form);
		this.getFiltersPayload(form);
	},

	getInputParamPayload : function(form) {
		var evalInputParams = {}, j = 0;
		var formData = form.getModel().getData();
		if (form.getController().oModelForInputParameters) {
			evalInputParams = form.getController().oModelForInputParameters.getData();
			if (evalInputParams.inputParameters) {
				if (evalInputParams.inputParameters.length > 0) {
					var i = 0, filterValue = [], filterValue1;
					while (i < evalInputParams.inputParameters.length) {
						if (evalInputParams.inputParameters[i].operator === "BT") {
							if ((evalInputParams[i].value_1 !== "") || (evalInputParams[i].value_2 !== "")) {
								filterValue = evalInputParams.inputParameters[i].value_1.split(",");
								filterValue1 = evalInputParams.inputParameters[i].value_2.split(",");
								if ((filterValue1.length === 1) && (!filterValue.length === 1)) {

									evalInputParams.inputParameters[i].value_1 = (evalInputParams.inputParameters[i].propertyType == "Edm.DateTime")
									? new Date(evalInputParams.inputParameters[i].value_1).toJSON() : evalInputParams.inputParameters[i].value_1;
									evalInputParams.inputParameters[i].value_2 = (evalInputParams.inputParameters[i].propertyType == "Edm.DateTime")
									? new Date(evalInputParams.inputParameters[i].value_2).toJSON() : evalInputParams.inputParameters[i].value_2;
									this.evalFiltersPayload[j] = {};
									this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "PA",
											evalInputParams.inputParameters[i].name, evalInputParams.inputParameters[i].operator,
											evalInputParams.inputParameters[i].value_1, evalInputParams.inputParameters[i].value_2);
									j++;
								}
							}
						} else {
							filterValue = evalInputParams.inputParameters[i].value_1.split(",");
							if (filterValue.length > 0) {
								for ( var k = 0; k < filterValue.length; k++) {
									if (filterValue[k] !== "") {

										filterValue[k] = (evalInputParams.inputParameters[i].propertyType == "Edm.DateTime")
										? new Date(filterValue[k]).toJSON() : filterValue[k];
										this.evalFiltersPayload[j] = {};
										this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "PA",
												evalInputParams.inputParameters[i].name, evalInputParams.inputParameters[i].operator,
												filterValue[k]);
										j++;
									}
								}
							}
						}
						i++;
					}
				}
			}
		}
	},
	getFiltersPayload : function(form) {
		var formData = form.getModel().getData();
		var evalDimensionFilters = {}, j = this.evalFiltersPayload.length;
		if (form.getController().oModelForDimensions) {
			evalDimensionFilters = form.getController().oModelForDimensions.getData();
			if (evalDimensionFilters.selectedDimensions) {
				if (evalDimensionFilters.selectedDimensions.length > 0) {
					var i = 0, filterValue = [], filterValue1;
					while (i < evalDimensionFilters.selectedDimensions.length) 
					{
						if (evalDimensionFilters.selectedDimensions[i].operator === "BT") 
						{
							if ((evalDimensionFilters.selectedDimensions[i].value_1 !== "")
									&& (evalDimensionFilters.selectedDimensions[i].value_2 !== ""))
							{
								filterValue = evalDimensionFilters.selectedDimensions[i].value_1.split(",");
								filterValue1 = evalDimensionFilters.selectedDimensions[i].value_2.split(",");
								if ((filterValue1.length === 1) || (!filterValue.length === 1))
								{
									evalDimensionFilters.selectedDimensions[i].value_1 = (evalDimensionFilters.selectedDimensions[i].propertyType == "Edm.DateTime")
									? new Date(evalDimensionFilters.selectedDimensions[i].value_1).toJSON() : evalDimensionFilters.selectedDimensions[i].value_1;
									evalDimensionFilters.selectedDimensions[i].value_2 = (evalDimensionFilters.selectedDimensions[i].propertyType == "Edm.DateTime")
									? new Date(evalDimensionFilters.selectedDimensions[i].value_2).toJSON() : evalDimensionFilters.selectedDimensions[i].value_2;
									this.evalFiltersPayload[j] = {};
									this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "FI",
											evalDimensionFilters.selectedDimensions[i].name,
											evalDimensionFilters.selectedDimensions[i].operator,
											evalDimensionFilters.selectedDimensions[i].value_1,
											evalDimensionFilters.selectedDimensions[i].value_2);

									j++;
								}
							}
						} else {
							filterValue = evalDimensionFilters.selectedDimensions[i].value_1.split(",");
							if (filterValue.length > 0) 
							{
								for (var k = 0; k < filterValue.length; k++)
								{
									if (filterValue[k] != "")
									{      
										filterValue[k] = (evalDimensionFilters.selectedDimensions[i].propertyType == "Edm.DateTime")
										? new Date(filterValue[k]).toJSON() : filterValue[k];
										this.evalFiltersPayload[j] = {};
										this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "FI",
												evalDimensionFilters.selectedDimensions[i].name,
												evalDimensionFilters.selectedDimensions[i].operator, 
												filterValue[k]);
										j++;
									}

								}
							}
						}
						i++;
					}
				}
			}
		}
	},

	navigateBack : function(){
		this.byId('evalTemplateIdLabel').setVisible(true);
		this.byId('evalTemplateId').setVisible(true);
		this.byId('evalTemplateId').setEditable(true);
		this.byId('evalTemplateId').setValue("");
		this.byId('evalId').setEditable(true);
		var eval_id = this.evalCreateModel.getData().ID || null; 
		this.getView().getModel().setData({NO_OF_ADDITIONAL_LANGUAGES:0});
		this.resetDimensionsAndInputParameters();
		if(eval_id) {
			sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context:"EVALUATIONS_MODELER(ID='" + eval_id +"',IS_ACTIVE=1)"});
		}
		else {
			sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile"});
		}
	},

	listAllActiveEvaluations : function() {
		var that = this;
		var evaluationsDialog = new sap.m.SelectDialog({
			title : that.oResourceBundle.getText("SELECT_EVALUATION"),
			noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
			items : {
				path : "/EVALUATIONS_MODELER",
				template : new sap.m.ObjectListItem({
					title : {parts:[{path:"TITLE"},{path:"INDICATOR_TITLE"}], formatter:jQuery.proxy(that.formatTitleInEvalDialog, that)},
					attributes : [new sap.m.ObjectAttribute({
						text : "{ID}"
					})]
				})
			},
			confirm : function(oEvent) {
				that.byId('evalTemplateId').setValue(oEvent.getParameter("selectedItem").getAttributes()[0].getText());
				that.byId('evalTemplateId').fireChange();
			},
			liveChange : function(oEvent) {
				var searchValue = oEvent.getParameter("value");
				var oFilterById = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterByTitle = new sap.ui.model.Filter("TITLE", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterByIndTitle = new sap.ui.model.Filter("INDICATOR_TITLE", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterISActive = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.StartsWith,".");
				var oBinding = oEvent.getSource().getBinding("items");
				var firstFilters = new sap.ui.model.Filter([oFilterById,oFilterByTitle,oFilterByIndTitle], false);
				var secondFilters = new sap.ui.model.Filter([oFilterISActive], true);
				oBinding.filter(new sap.ui.model.Filter([firstFilters,secondFilters], true));
			}
		});
		evaluationsDialog.setModel(that.oDataModel);
		var filters = [];
		filters.push(new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.StartsWith, "."));
		evaluationsDialog.getBinding("items").filter(new sap.ui.model.Filter(filters,true));
		evaluationsDialog.open();
	},
	
	formatTitleInEvalDialog: function(evalTitle, indTitle) {
		var that = this;
		return ((indTitle || that.oResourceBundle.getText("TITLE_UNAVAILABLE")) + " - " + (evalTitle || that.oResourceBundle.getText("TITLE_UNAVAILABLE")));
	},

	changeEvalTemplate : function(){
		this.resetDimensionsAndInputParameters();
		this.setInputParameterAndFilterLayout();
		this.populateEvalDetails();
	},
	decideMode : function(){
		var that = this;
		this.oRouter.attachRouteMatched(function(evt) {
			if(evt.getParameter("name") === "editEvaluation"){
				that.getView().getModel().setProperty("/mode","edit");
				that.context = new sap.ui.model.Context(that.getView().getModel(), '/' + (evt.getParameter("arguments").contextPath));

				var id = (/ID=\'.*\'/).exec(evt.getParameter("arguments").contextPath)[0];
				var evalId = id.slice(id.indexOf("'")+1,id.lastIndexOf("'"));

				that.populateEvalDetails(evalId);
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("EDIT_EVALUATION"));
				that.byId("evalId").setEditable(false);
			}
			else if(evt.getParameter("name") === "addEvaluation"){
				that.getView().getModel().setProperty("/mode","create");
				that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES", 0);
				that.populateEvalDetails(null);
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("ADD_EVALUATION"));
				that.busyDialog.close();
			}
		},this);
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

	formObjectForFilters : function(listOfFilters){
		var i = 0, j = 0, k = 0, temp = [], tempObj;
		for(i=0;i<listOfFilters.length;i++){
			if(listOfFilters[i].OPERATOR == "BT"){
				tempObj = {};
				tempObj = {"name":listOfFilters[i].NAME, "operator":listOfFilters[i].OPERATOR,  "value_1":listOfFilters[i].VALUE_1, "value_2":listOfFilters[i].VALUE_2}
				temp[j++] = tempObj; 
			}
			else{
				for(k=0;k<temp.length;k++){
					if((temp[k].name == listOfFilters[i].NAME) && (temp[k].operator == listOfFilters[i].OPERATOR)){
						break;
					}
				}
				if(k == temp.length){
					tempObj = {};
					tempObj = {"name":listOfFilters[i].NAME, "operator":listOfFilters[i].OPERATOR,  "value_1":listOfFilters[i].VALUE_1, "value_2":listOfFilters[i].VALUE_2}
					temp[j++] = tempObj;
				}
				else{
					temp[k].value_1+=","+listOfFilters[i].VALUE_1;
				}
			}
		}
		return temp;
	},

	populateEvalDetails : function(evalId){
		var that = this;
		var evalData = null;
		var evaluationContext = null;
		that.busyDialog.open();
		if(this.evalCreateModel.getData().mode == "create"){
			if(this.byId('evalTemplateId').getValue()){
				evalId = this.byId('evalTemplateId').getValue();
				this.byId('dataSourcePanel').setVisible(true);
				this.byId('dataSourcePanel').setExpanded(false);
			}
			else{
				this.byId('dataSourcePanel').setVisible(false);
			}
		}
		if(evalId){
			evaluationContext = {
					ID : evalId,
					IS_ACTIVE : 1
			};
			evaluationMetaData = that.metadataRef.getEvaluationById({ID:evalId,IS_ACTIVE : 1,entity:"EVALUATIONS_MODELER",async:false, texts:true,values:true,filters:true,properties:true,tags:true,model:that.oDataModel});
			if(evaluationMetaData.EVALUATION){
				evalData = {};
				var e_id = evaluationMetaData.EVALUATION.ID;
				evaluationMetaData.EVALUATION.ID = (e_id.indexOf(".") === 0) ? e_id.substring(1) : e_id; 
				evalData = that._cloneObj(evaluationMetaData.EVALUATION);
				evalTextData = that._cloneObj(evaluationMetaData.TEXTS);
				evalFilterData = that._cloneObj(evaluationMetaData.FILTERS);
				evalValueData = that._cloneObj(evaluationMetaData.VALUES);
				evalPropertiesData = that._cloneObj(evaluationMetaData.PROPERTIES);

				that.getView().getModel().setProperty("/ID",evalData.ID);
				if(that.evalCreateModel.getData().mode=="edit"){
					that.byId('evalTemplateId').setVisible(false);
					that.byId('evalTemplateIdLabel').setVisible(false);
				}
				that.getView().getModel().setProperty("/TITLE",evalData.TITLE);
				that.getView().getModel().setProperty("/DESCRIPTION",evalData.DESCRIPTION);
				that.getView().getModel().setProperty("/SEMANTIC_OBJECT",evalData.SEMANTIC_OBJECT);
				that.getView().getModel().setProperty("/SCALING",evalData.SCALING);
				that.getView().getModel().setProperty("/ACTION",evalData.ACTION);
				that.getView().getModel().setProperty("/GOAL_TYPE",evalData.GOAL_TYPE);
				that.getView().getModel().setProperty("/INDICATOR_TYPE",evalData.INDICATOR_TYPE);
				that.getView().getModel().setProperty("/OWNER_NAME",evalData.OWNER_NAME);
				that.getView().getModel().setProperty("/OWNER_ID",evalData.OWNER_ID);
				that.getView().getModel().setProperty("/OWNER_E_MAIL",evalData.OWNER_E_MAIL);
				that.getView().getModel().setProperty("/VALUES_SOURCE",evalData.VALUES_SOURCE);
				that.getView().getModel().setProperty("/VIEW_NAME",evalData.VIEW_NAME);
				that.getView().getModel().setProperty("/ODATA_URL",evalData.ODATA_URL);
				if(evalData.ODATA_ENTITYSET){
					that.getView().getModel().setProperty("/ODATA_ENTITYSET",evalData.ODATA_ENTITYSET);
					try{
						that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
					}
					catch(e){
						sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
						that.resetDimensionsAndInputParameters();
						that.busyDialog.close();
					}
				}
				that.getView().getModel().setProperty("/COLUMN_NAME",evalData.COLUMN_NAME);  
				that.getView().getModel().setProperty("/INDICATOR",evalData.INDICATOR);
				that.getView().getModel().updateBindings();
				
				var langSuccessHandler = function(obj, arr, localeLanguage) {
					that.SAP_LANGUAGES = obj;
					that.SAP_LANGUAGE_ARRAY = arr;
					that.languageKeyModelData = that._cloneObj(arr);
					that.localLanguage = localeLanguage;
					that.localLAISOLanguage = sap.ui.getCore().getConfiguration().getLocale().getLanguage().split("-")[0].toUpperCase();
				};

				this.metadataRef.getAllLanguages({async:false, success:langSuccessHandler, model:this.oDataModel});

				var additionalLanguageData = [];
				var i;
				for(i=0;i<evalTextData.length;i++){
					if(evalTextData[i].LANGUAGE != that.localLanguage){
						additionalLanguageData.push(evalTextData[i]);
					}
				}
				var languageArray = [];
				var i;
				for(i=0;i<additionalLanguageData.length;i++){
					var languageObject = {};
					languageObject.ADDITIONAL_LANGUAGE_TITLE = additionalLanguageData[i].TITLE;
					languageObject.ADDITIONAL_LANGUAGE_DESCRIPTION = additionalLanguageData[i].DESCRIPTION;
					languageObject.ADDITIONAL_LANGUAGE_SPRAS_KEY = additionalLanguageData[i].LANGUAGE;
					if(that.SAP_LANGUAGES) {
						languageObject.ADDITIONAL_LANGUAGE_KEY = that.SAP_LANGUAGES.SPRAS[additionalLanguageData[i].LANGUAGE]; 
					}
					else {
						languageObject.ADDITIONAL_LANGUAGE_KEY = "";
					}
					languageArray.push(languageObject);
				}
				that.OLD_ADDITIONAL_LANGUAGE_ARRAY = additionalLanguageData;
				that.getView().getModel().setProperty("/ADDITIONAL_LANGUAGE_ARRAY",languageArray);
				that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES",languageArray.length);

				that.OLD_FILTER_DATA = evalFilterData;
				if(evalFilterData && evalFilterData.length > 0){
					var inputParams = [], dimensions = [],j=0,k=0;
					for(var i=0;i<evalFilterData.length;i++){
						if(evalFilterData[i].TYPE === "PA"){
							inputParams[j] = {};
							inputParams[j++] = evalFilterData[i];
						}
						else if(evalFilterData[i].TYPE === "FI"){
							dimensions[k] = {};
							dimensions[k++] = evalFilterData[i];
						}
					}
					if(inputParams.length > 0){
						var inputParamFormatted =  {};
						inputParamFormatted.inputParameters = [];
						inputParamFormatted.inputParameters = that.formObjectForFilters(inputParams);
						for(var i=0;i<that.oModelForInputParameters.getData().inputParameters.length;i++){
							for(var j=0;j<inputParamFormatted.inputParameters.length;j++){
								if(that.oModelForInputParameters.getData().inputParameters[i].name === inputParamFormatted.inputParameters[j].name){
									that.oModelForInputParameters.getData().inputParameters[i].value_1 = inputParamFormatted.inputParameters[j].value_1;
									that.oModelForInputParameters.getData().inputParameters[i].value_2 = inputParamFormatted.inputParameters[j].value_2;
								}
							}
						}
						that.oModelForInputParameters.updateBindings();
					}
					if(dimensions.length > 0){
						var filtersFormatted = {};
						filtersFormatted.selectedDimensions = [];
						filtersFormatted.selectedDimensions = that.formObjectForFilters(dimensions);
						that.oModelForDimensions.getData().selectedDimensions = filtersFormatted.selectedDimensions;
						that.oModelForDimensions.updateBindings();
					}
				}
				
				if(evalValueData){
					that.OLD_VALUES = evalValueData;
					that.getView().getModel().setProperty("/VALUES",evalValueData);
					that.formatEvalValues();
				}
				that.OLD_PROPERTIES = evalPropertiesData;
				that.getView().getModel().setProperty("/PROPERTIES",evalPropertiesData);
				
				that.busyDialog.close();

			}
			else{
				that.busyDialog.close();
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_EVALUATION_DOES_NOT_EXIST"));
			}
		}
	},

	formatEvalValues : function(){
		var evalData = this.evalCreateModel.getData();
		var that=this;
		evalData.TA = null;
		evalData.TC = null;
		evalData.RE = null; 
		evalData.CL = null;
		evalData.CH = null;
		evalData.WL = null;
		evalData.WH = null;

		for(var i=0;i<evalData.VALUES.length; i++) {
			if((evalData.VALUES_SOURCE == "FIXED")) {
				evalData[evalData.VALUES[i]["TYPE"]] = evalData.VALUES[i]["FIXED"];
			}
			else if(evalData.VALUES_SOURCE == "MEASURE") {
				evalData[evalData.VALUES[i]["TYPE"]] = evalData.VALUES[i]["COLUMN_NAME"];
			}
		}

		if(evalData.GOAL_TYPE == "RA"){
			this.byId('CHlabel').setText(that.oResourceBundle.getText("CRITICAL_HIGH"));
			this.byId('CLlabel').setText(that.oResourceBundle.getText("CRITICAL_LOW"));
			this.byId('WHlabel').setText(that.oResourceBundle.getText("WARNING_HIGH"));
			this.byId('WLlabel').setText(that.oResourceBundle.getText("WARNING_LOW"));
		}

		else if(evalData.GOAL_TYPE == "MA"){
			this.byId('CHlabel').setVisible(false);
			this.byId('CHinput').setVisible(false);
			this.byId('WHlabel').setVisible(false);
			this.byId('WHinput').setVisible(false);

			this.byId('CLlabel').setText(that.oResourceBundle.getText("CRITICAL"));
			this.byId('WLlabel').setText(that.oResourceBundle.getText("WARNING"));
		}

		else if(evalData.GOAL_TYPE == "MI"){
			this.byId('CLlabel').setVisible(false);
			this.byId('CLinput').setVisible(false);
			this.byId('WLlabel').setVisible(false);
			this.byId('WLinput').setVisible(false);

			this.byId('CHlabel').setText(that.oResourceBundle.getText("CRITICAL"));
			this.byId('WHlabel').setText(that.oResourceBundle.getText("WARNING"));
		}
		this.evalCreateModel.setData(evalData);
		this.evalCreateModel.updateBindings();
	},

	validateEvalId : function() {
		var that = this;
		var evalIdField = this.getView().byId('evalId');

		var is_active = 0;
		var evalId = evalIdField.getValue();
		if (evalId) {
			if ((!(/^[a-zA-Z0-9.]*$/.test(evalId))) || (evalId.indexOf(".") === 0)) {
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID"));
				evalIdField.setValueState("Error");
				return true;
			} else {
				evalIdField.setValueState("None");
				var evalExists = this.metadataRef.getEvaluationById({ID:evalId,IS_ACTIVE : 1,model:that.oDataModel});
				if(evalExists && evalExists.EVALUATION){
					evalIdField.setValueState("Error");
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_EVAL_WITH_ID_EXISTS",evalId));
					return true;
				}
				else{
					evalIdField.setValueState("None");
				}
			}
		}
		return false;
	},

	formatLangCount : function(value){
		if(!this.getView().getModel().getData()){
			value = 0;
		}
		else
			value = this.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES;
		return this.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+value+")";
	},

	addAdditionalLanguageDialog : function(){
		var that=this;
		this.additionalLanguageListModel = new sap.ui.model.json.JSONModel();
		this.additionalLanguageListModelData = jQuery.extend([], that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY);
		this.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES = this.additionalLanguageListModelData.length;
		this.additionalLanguageListModel.setData(this.additionalLanguageListModelData);

		this.languageTextInput = new sap.m.Input({
			layoutData : new sap.ui.layout.GridData({
				span : "L8 M8 S8"
			})
		});
		this.languageDescriptionInput = new sap.m.TextArea({
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
		});
		this.addedLanguagesList.bindItems("additionalLanguageListModel>/", new sap.m.CustomListItem({
			content : new sap.ui.layout.Grid({
				hSpacing: 1,
				vSpacing: 0,
				defaultSpan : "L12 M12 S12",
				content: [
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_TITLE}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L12 M12 S12",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_DESCRIPTION}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L6 M6 S6",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_KEY}",
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
				        		  var deletedIndex = oEvent.getSource().getBindingContext("additionalLanguageListModel").getPath().substr(1);
				        		  var newData = that.addedLanguagesList.getModel("additionalLanguageListModel").getData().splice(deletedIndex,1);
				        		  that.addedLanguagesList.getModel("additionalLanguageListModel").updateBindings();

				        	  },
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L2 M2 S2"
				        	  })
				          })]
			})
		}));
		this.addedLanguagesList.setModel(that.additionalLanguageListModel,"additionalLanguageListModel");

		var additionalLanguageDialog = new sap.m.Dialog({
			contentHeight : "50%",
			contentWidth : "25%",
			title : this.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE"),
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
			            	        	            	 text : that.oResourceBundle.getText("TITLE"),
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),
			            	        	             that.languageTextInput,
			            	        	             new sap.m.Label({
			            	        	            	 text : that.oResourceBundle.getText("DESCRIPTION"),
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),
			            	        	             that.languageDescriptionInput,
			            	        	             new sap.m.Label({
			            	        	            	 text : that.oResourceBundle.getText("LANGUAGE"),
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
			            	        	            			 for(var i=0;i<that.addedLanguagesList.getModel("additionalLanguageListModel").getData().length;i++){
			            	        	            				 if(that.addedLanguagesList.getModel("additionalLanguageListModel").getData()[i].LANGUAGE_KEY === that.languageKeySelect.getSelectedItem().getKey()){
			            	        	            					 sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_LANGUAGE_EXISTS",that.languageKeySelect.getSelectedItem().getKey()));
			            	        	            					 return;
			            	        	            				 }
			            	        	            			 }
			            	        	            			 var addedLanguageObject = {
			            	        	            					 "ADDITIONAL_LANGUAGE_TITLE" : that.languageTextInput.getValue(),
			            	        	            					 "ADDITIONAL_LANGUAGE_DESCRIPTION" : that.languageDescriptionInput.getValue(),
			            	        	            					 "ADDITIONAL_LANGUAGE_KEY" : that.languageKeySelect.getSelectedItem().getText(),
			            	        	            					 "ADDITIONAL_LANGUAGE_SPRAS_KEY" : that.languageKeySelect.getSelectedItem().getKey()
			            	        	            			 };
			            	        	            			 for(var i=0;i<that.SAP_LANGUAGE_ARRAY.length;i++){
			            	        	            				 if(that.languageKeySelect.getSelectedItem().getText() == that.SAP_LANGUAGE_ARRAY[i].LAISO){
			            	        	            					 addedLanguageObject.ADDITIONAL_LANGUAGE_KEY_DESCRIPTION = that.SAP_LANGUAGE_ARRAY[i].SPTXT
			            	        	            				 }
			            	        	            			 }
			            	        	            			 that.addedLanguagesList.getModel("additionalLanguageListModel").getData().push(addedLanguageObject);
			            	        	            			 that.addedLanguagesList.getModel("additionalLanguageListModel").updateBindings();
			            	        	            			 that.languageTextInput.setValue("");
			            	        	            			 that.languageDescriptionInput.setValue("");
			            	        	            		 }
			            	        	            	 }
			            	        	             })
			            	        	             ]
			            	          })

			            	          ]
			            }).addStyleClass("languageGrid"),
			            that.addedLanguagesList],
			            beginButton : new sap.m.Button({
			            	text : that.oResourceBundle.getText("OK"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            		that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY = that.addedLanguagesList.getModel("additionalLanguageListModel").getData();
			            		that.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES = that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY.length;
			            		that.getView().getModel().updateBindings();
			            	}
			            }),
			            endButton : new sap.m.Button({
			            	text : that.oResourceBundle.getText("CANCEL"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            	}
			            })
		});

		

		if(that.SAP_LANGUAGE_ARRAY && that.SAP_LANGUAGE_ARRAY.length){
			var oModel = new sap.ui.model.json.JSONModel();
			for(i=0;i<that.SAP_LANGUAGE_ARRAY.length;i++){
				if(that.SAP_LANGUAGE_ARRAY[i].LAISO == that.localLAISOLanguage){
					that.languageKeyModelData.splice(i,1);
				}
			}

			oModel.setData(that.languageKeyModelData);
			that.languageKeySelect.setModel(oModel, "otherLanguageKey");
			that.languageKeySelect.bindItems("otherLanguageKey>/", new sap.ui.core.Item({
				text: "{otherLanguageKey>LAISO}",
				key: "{otherLanguageKey>SPRAS}"
			}));
		}
		additionalLanguageDialog.open();
	},

	populateDimensionsAndInputParameters : function(dataSource, entitySet) {
		var dimensions = [];
		var inputParameters = [];
		this.oData4SAPAnalyticsModel = new sap.ui.model.analytics.odata4analytics.Model(new sap.ui.model.analytics.odata4analytics.Model.ReferenceByURI(dataSource), null);
		this.queryResultObj = this.oData4SAPAnalyticsModel.findQueryResultByName(entitySet);
		//var queryResultObjDimensions = this.queryResultObj.getAllDimensions();
		var queryResultObjDimensions = sap.suite.ui.smartbusiness.lib.Util.odata.getAllFilterableDimensionsWithProperty(dataSource, entitySet);
		for (key in queryResultObjDimensions) {
			var name = queryResultObjDimensions[key].getName();
			var propertyType = queryResultObjDimensions[key].getKeyProperty().type;
			var newObj = {
					name : name,
					propertyType : propertyType
			};
			dimensions.push(newObj);
		}
		var data = this.oModelForDimensions.getData();
		data.dimensions = dimensions;
		data.dataSource = dataSource;
		data.entitySet = entitySet;
		if(data.selectedDimensions)
		{      
			for(var key in data.selectedDimensions)
			{
				data.selectedDimensions[key].propertyType = this.queryResultObj.findDimensionByName(data.selectedDimensions[key].name)?
						this.queryResultObj.findDimensionByName(data.selectedDimensions[key].name).getKeyProperty().type:"";  
						if(data.selectedDimensions[key].propertyType == "Edm.DateTime")
						{    
							var valueArray = data.selectedDimensions[key].value_1.split(",");
							for( i in valueArray)
							{      if( valueArray[i] != "")
							{
								var dateObj = new Date(valueArray[i]);
								var month = dateObj.getMonth()+1;
								month = /^\d$/.test(month) ? "0"+ month : month;
								var date = dateObj.getDate();
								date = /^\d$/.test(date) ? "0"+ date : date;
								var hours = dateObj.getHours();
								hours = /^\d$/.test(hours) ? "0"+ hours : hours;
								var minutes = dateObj.getMinutes();
								minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
								var seconds = dateObj.getSeconds();
								seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
								valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
							}
							}
							data.selectedDimensions[key].value_1 = valueArray.join(",");
							valueArray = null;
							valueArray = data.selectedDimensions[key].value_2.split(",");
							for(var i in valueArray)
							{
								if(valueArray[i] != "")
								{
									var dateObj = new Date(data.selectedDimensions[key].value_2);
									var month = dateObj.getMonth()+1;
									month = /^\d$/.test(month) ? "0"+ month : month;
									var date = dateObj.getDate();
									date = /^\d$/.test(date) ? "0"+ date : date;
									var hours = dateObj.getHours();
									hours = /^\d$/.test(hours) ? "0"+ hours : hours;
									var minutes = dateObj.getMinutes();
									minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
									var seconds = dateObj.getSeconds();
									seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
									valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
								}
							}
							data.selectedDimensions[key].value_2 = valueArray.join(",");
							this.dimensionValue[data.selectedDimensions[key].name] = this.dimensionValue[data.selectedDimensions[key].name] ? this.dimensionValue[data.selectedDimensions[key].name] : {};
							this.dimensionValue[data.selectedDimensions[key].name]["value_1"] = data.selectedDimensions[key].value_1;
							this.dimensionValue[data.selectedDimensions[key].name]["value_2"] = data.selectedDimensions[key].value_2;                                      
						}
			}
		}
		this.oModelForDimensions.setData(data);
		var inputParametersObj = this.queryResultObj.getParameterization();
		if (inputParametersObj)
		{                              
			if(this.oModelForInputParameters.getData().inputParameters)
			{   
				var inputParameters = this.oModelForInputParameters.getData().inputParameters;
				for(var key in inputParameters)
				{
					inputParameters[key].propertyType = inputParametersObj.findParameterByName(inputParameters[key].name).getProperty().type;
					if(inputParameters[key].propertyType == "Edm.DateTime")
					{
						var valueArray = inputParameters[key].value_1.split(",");
						for( i in valueArray)
						{        
							if( valueArray[i] != "")
							{
								var dateObj = new Date(valueArray[i]);
								var month = dateObj.getMonth()+1;
								month = /^\d$/.test(month) ? "0"+ month : month;
								var date = dateObj.getDate();
								date = /^\d$/.test(date) ? "0"+ date : date;
								var hours = dateObj.getHours();
								hours = /^\d$/.test(hours) ? "0"+ hours : hours;
								var minutes = dateObj.getMinutes();
								minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
								var seconds = dateObj.getSeconds();
								seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
								valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
							}
						}
						inputParameters[key].value_1 = valueArray.join(",");
						valueArray = null;
						valueArray = inputParameters[key].value_2.split(",");
						for(var i in valueArray)
						{
							if(valueArray[i] != "")
							{
								var dateObj = new Date(data.selectedDimensions[key].value_2);
								var month = dateObj.getMonth()+1;
								month = /^\d$/.test(month) ? "0"+ month : month;
								var date = dateObj.getDate();
								date = /^\d$/.test(date) ? "0"+ date : date;
								var hours = dateObj.getHours();
								hours = /^\d$/.test(hours) ? "0"+ hours : hours;
								var minutes = dateObj.getMinutes();
								minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
								var seconds = dateObj.getSeconds();
								seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
								valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
							}
						}
						inputParameters[key].value_2 = valueArray.join(",");
					}
				}                                       
			}
			else
			{   
				var inputParametersNames = inputParametersObj.getAllParameters();
				for ( var key in inputParametersNames) {
					var name = inputParametersNames[key].getName();
					var propertyType = inputParametersNames[key].getProperty().type;
					var optional = inputParametersNames[key].isOptional();
					var newObj = {
							name : name,
							propertyType : propertyType,
							operator : "EQ",
							value_1 : "",
							value_2 : ""
					};
					inputParameters.push(newObj);
				}
			}
			if (inputParameters.length > 0)
				this.byId("inputParameterLayoutHeaders").setVisible(true);
			data = this.oModelForInputParameters.getData();
			data.inputParameters = inputParameters;
			this.oModelForInputParameters.setData(data);
		}              

	},
	
	setFilterPayload : function(id, type, name, operator, value1, value2) {
		var obj = {};
		obj.ID = id;
		obj.IS_ACTIVE = 1;
		obj.TYPE = type;
		obj.NAME = name;
		obj.OPERATOR = operator;
		obj.VALUE_1 = value1;
		if (value2)
			obj.VALUE_2 = value2;
		else
			obj.VALUE_2 = "";
		return obj;

	},

	setInputParameterAndFilterLayout : function() {
		var that = this;
		this.dimensionValueHelpDialogs = {};
		this.dimensionValue = {};
		this.byId("inputParameterLayoutHeaders").setVisible(false);
		this.byId("inputParameterBaseLayout").setModel(this.oModelForInputParameters);
		this.byId("inputParameterBaseLayout").bindAggregation("items", "/inputParameters", function(sId, oContext) {
			var inputParameterOperator = new sap.m.Select({
				width : "100%",
				customData : [{
					key : "valueType",
					value : "value_1"
				}],
				items : [new sap.ui.core.Item({
					text : that.oResourceBundle.getText("EQUAL_TO"),
					key : "EQ"
				})],
				selectedKey : "{operator}",
				layoutData : new sap.ui.layout.GridData({
					span : "L3 M3"
				})
			});
			var inputParameterValue = new sap.m.Input({
				value : "{value_1}",
				customData : [{
					key : "valueType",
					value : "value_1"
				}],
				//showValueHelp : true,
				valueHelpRequest : jQuery.proxy(that.openInputParameterValueHelpDialog,that),
				change : jQuery.proxy(that.handleDimensionValueChange, that),
				valueState : {
					path : "error_1",
					formatter : function(error) {
						if (error)
							return "Error";
						else
							return "None";
					}
				},
				layoutData : new sap.ui.layout.GridData({
					span : "L3 M3"
				})
			});
			var inputParameterGrid = new sap.ui.layout.Grid({
				defaultSpan : "L12 M12",
				content : [new sap.m.Input({
					value : "{name}",
					layoutData : new sap.ui.layout.GridData({
						span : "L3 M3"
					})
				}), inputParameterOperator, inputParameterValue]
			});
			return inputParameterGrid;
		});
		//Dimensions Layout
		this.byId("dimensionLayoutHeaders").setVisible(false);
		this.byId("baseDimensionLayout").setModel(this.oModelForDimensions);
		this.byId("baseDimensionLayout").bindAggregation("items", "/selectedDimensions", function(sId, oContext) {
			var dimensionOperator = new sap.m.Select({
				width : "100%",
				customData : [{
					key : "valueType",
					value : "value_1"
				}],
				items : [new sap.ui.core.Item({
					text : that.oResourceBundle.getText("EQUAL_TO"),
					key : "EQ"
				}), new sap.ui.core.Item({
					text : that.oResourceBundle.getText("GREATER_THAN"),
					key : "GT"
				}), new sap.ui.core.Item({
					text : that.oResourceBundle.getText("LESS_THAN"),
					key : "LT"
				}), new sap.ui.core.Item({
					text : that.oResourceBundle.getText("NOT_EQUAL_TO"),
					key : "NE"
				}), new sap.ui.core.Item({
					text : that.oResourceBundle.getText("BETWEEN"),
					key : "BT"
				})],
				selectedKey : "{operator}",
				change : jQuery.proxy(that.handleOperatorChange, that),
				layoutData : new sap.ui.layout.GridData({
					span : "L3 M3"
				})
			});
			var dimensionValue = new sap.m.Input({
				value : "{value_1}",
				customData : [{
					key : "valueType",
					value : "value_1"
				}],
				showValueHelp : true,
				valueState : {
					path : "error_1",
					formatter : function(error) {
						if (error)
							return "Error";
						else
							return "None";
					}
				},
				valueHelpRequest : jQuery.proxy(that.handleDimensionValueHelp, that),
				change : jQuery.proxy(that.handleDimensionValueChange, that),
				layoutData : new sap.ui.layout.GridData({
					span : "L3 M3"
				})
			});
			var dimensionValueTo = new sap.m.Input({
				value : "{value_2}",
				customData : [{
					key : "valueType",
					value : "value_2"
				}],
				showValueHelp : true,
				visible : {
					path : "operator",
					formatter : function(operator) {
						return (operator === "BT") ? true : false;
					}
				},
				valueState : {
					path : "error_2",
					formatter : function(error) {
						if (error)
							return "Error";
						else
							return "None";
					}
				},
				valueHelpRequest : jQuery.proxy(that.handleDimensionValueToHelp, that),
				change : jQuery.proxy(that.handleDimensionValueChange, that),
				layoutData : new sap.ui.layout.GridData({
					span : "L4 M4"
				})
			});
			var dimensionValueToLabel = new sap.m.Label({
				text : "To",
				visible : {
					path : "operator",
					formatter : function(operator) {
						return (operator === "BT") ? true : false;
					}
				}
			});
			var dimensionValueLayout = new sap.m.VBox({
				items : [dimensionValue, dimensionValueToLabel, dimensionValueTo],
				layoutData : new sap.ui.layout.GridData({
					span : "L3 M3"
				})
			});
			var dimensionDel = new sap.m.Button({
				icon : "sap-icon://sys-cancel",
				type : "Transparent",
				layoutData : new sap.ui.layout.GridData({
					span : "L2 M2 S2"
				}),
				press : function(evt) {
					var path = evt.getSource().getBindingContext().getPath();
					if(that.dimensionValue){
						if(that.dimensionValue[evt.getSource().getBindingContext().getObject().name]){
							delete that.dimensionValue[evt.getSource().getBindingContext().getObject().name]
						}
					}
					evt.getSource().getBindingContext().getModel().getData().selectedDimensions.splice(path.substring(path
							.lastIndexOf("/") + 1), 1);
					evt.getSource().getBindingContext().getModel().updateBindings();

					if(evt.getSource().getBindingContext().getModel().getData().selectedDimensions.length == 0){
						that.byId("dimensionLayoutHeaders").setVisible(false);
					}
				}
			});
			var dimensionGrid = new sap.ui.layout.Grid({
				defaultSpan : "L12 M12",
				content : [new sap.m.Input({
					value : "{name}",
					layoutData : new sap.ui.layout.GridData({
						span : "L3 M3"
					})
				}), dimensionOperator, dimensionValueLayout,dimensionDel]
			});
			return dimensionGrid;
		});
	},

	openInputParameterValueHelpDialog : function(name) {
		var that = this;
		var inputParameterValueHelpDialog = new sap.m.SelectDialog({
			title : that.oResourceBundle.getText("SELECT_VALUES"),
			multiSelect : true,
			rememberSelections : true,
			items : {
				path : "/results",
				template : new sap.m.StandardListItem({
					title : "{" + name + "}",
				})
			},
			confirm : function(oEvent) {
			},
			liveChange : function(oEvent) {
			}
		});
		inputParameterValueHelpDialog.setGrowingThreshold(100);
		inputParameterValueHelpDialog.open();
	},

	openDimensionDialog : function() {
		var that = this;
		if (!this.dimensionDialog) {
			var oSorter1 = new sap.ui.model.Sorter("name",false);
			this.dimensionDialog = new sap.m.SelectDialog({
				title : that.oResourceBundle.getText("SELECT_DIMENSIONS"),
				multiSelect : true,
				items : {
					path : "/dimensions",
					sorter : oSorter1,
					template : new sap.m.StandardListItem({title : "{name}"})
				},
				confirm : function(oEvent) {
					var selectedDimensions = that.oModelForDimensions.getData().selectedDimensions||[];
					var selectedItems = oEvent.getParameter("selectedItems");
					var aContexts = [];
					for(var key in selectedItems){
						aContexts[key] = selectedItems[key].getBindingContext();
					}
					for ( var key in aContexts) {
						var selectedObject = that._cloneObj(aContexts[key].getObject());
						selectedObject.value_1 = "";
						selectedObject.value_2 = "";
						selectedObject.operator = "EQ";
						selectedDimensions.push(selectedObject);
					}
					if (aContexts.length > 0)
						that.byId("dimensionLayoutHeaders").setVisible(true);
					else
						that.byId("dimensionLayoutHeaders").setVisible(false);
					that.oModelForDimensions.setProperty("/selectedDimensions", selectedDimensions);
				},
				liveChange : function(oEvent) {
					var searchValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([oFilter]);
				}
			});
			this.dimensionDialog.setGrowingThreshold(100);
			this.dimensionDialog.setModel(this.oModelForDimensions);

			/*if(that.getView().getModel().getData().mode == "edit" || that.getView().getModel().getData().mode == "duplicate")
			{
				var dialogItems = this.dimensionDialog.getItems();
				var selectedDimensions = this.oModelForDimensions.getData().selectedDimensions;
				for(var key in dialogItems)
				{      for(var dimensionKey in selectedDimensions)
				{
					if(dialogItems[key].getTitle() == selectedDimensions[dimensionKey].name)
						dialogItems[key].setSelected(true);
				}
				}
			}*/
		}
		this.dimensionDialog.open();
	},

	handleDimensionValueHelp : function(oEvent) {
		this.openDimensionValueHelpDialog(oEvent, "value_1");
	},

	handleDimensionValueToHelp : function(oEvent) {
		this.openDimensionValueHelpDialog(oEvent, "value_2");
	},

	openDimensionValueHelpDialog : function(oEvent, valueType) {
		var that = this;
		var parentInputField = oEvent.getSource();
		var baseModel = this.getView().getModel();
		var dimensionValuesModel = new sap.ui.model.json.JSONModel();
		var inputParameterArray = [];
		this.dimensionContext = oEvent.getSource().getBindingContext();
		var dimensionName = oEvent.getSource().getBindingContext().getProperty("name");
		var dimensionOperator = oEvent.getSource().getBindingContext().getProperty("operator")
		var dimensionType = oEvent.getSource().getBindingContext().getProperty("propertyType")
		var inputParameterData = this.oModelForInputParameters.getData().inputParameters;
		for ( var key in inputParameterData) {
			inputParameterArray.push({ 
				OPERATOR: inputParameterData[key].operator, 
				NAME: inputParameterData[key].name, 
				VALUE_1: inputParameterData[key].value_1,
				VALUE_2: inputParameterData[key].value_2, 
				TYPE: "PA" // TYPE { FI, PA} 
			}); 
		}
		var queryService = sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
			serviceUri : baseModel.getProperty("/ODATA_URL"),
			entitySet : baseModel.getProperty("/ODATA_ENTITYSET"),
			filter : inputParameterArray,
			dimension : dimensionName
		});
		queryService.model.read(queryService.uri, null, null, false, function(data) {
			if (that.dimensionValue[dimensionName])
			{
				that.dimensionValue[dimensionName][valueType] = that.dimensionValue[dimensionName][valueType]
				? that.dimensionValue[dimensionName][valueType] : "";
				var dimensionValueArray = that.dimensionValue[dimensionName][valueType] === ""
					? null : that.dimensionValue[dimensionName][valueType].split(",");
				for (key in dimensionValueArray)
				{      var userInputData = true;
				for ( var i in data.results)
				{   if(dimensionType == "Edm.DateTime")
				{      var date = new Date(dimensionValueArray[key]).toJSON();
				var dateFromService = new Date(data.results[i][dimensionName]).toJSON();
				if(date == dateFromService)
				{      userInputData = false;
				break;                                                                     
				}
				}
				else if (dimensionValueArray[key] === data.results[i][dimensionName])
				{  userInputData = false;
				break;
				}
				}
				if (userInputData)
				{
					var userInputValueObject = {};
					userInputValueObject[dimensionName] = dimensionValueArray[key];
					userInputValueObject.userInput = true;
					userInputValueObject.selected = true;
					data.results.push(userInputValueObject);
				}
				else
					data.results[i].selected = true;
				}
			}
			dimensionValuesModel.setData(data);
		}, function(error) {

		});

		var oSorter1 = new sap.ui.model.Sorter(dimensionName,false,function(context) {

			if (context.getProperty("userInput") === true)
				return {
				key : "USER_VALUES",
				text : that.oResourceBundle.getText("VALUES_ENTERED_BY_USER")
			};
			else
				return {
				key : "SERVICE_VALUES",
				text : that.oResourceBundle.getText("VALUES_FETCHED_FROM_SERVICE")
			};
		});
		this.dimensionValueHelpDialogs = new sap.m.SelectDialog(
				{
					title : that.oResourceBundle.getText("SELECT_VALUES"),
					multiSelect : true,
					rememberSelections : true,
					items : {
						path : "/results",
						sorter : oSorter1,
						template : new sap.m.StandardListItem({
							title : "{"+dimensionName+"}",                                                                   
							selected : "{selected}"
						})
					},
					confirm : function(oEvent) {
						var selectedDimensionValues = "";
						var aContexts = oEvent.getParameter("selectedContexts");
						for ( var key in aContexts)
						{      
							if(dimensionType == "Edm.DateTime")
							{   var dateObj = new Date(aContexts[key].getProperty(that.dimensionContext.getProperty("name")));
							var month = dateObj.getMonth()+1;
							month = /^\d$/.test(month) ? "0"+ month : month;
							var date = dateObj.getDate();
							date = /^\d$/.test(date) ? "0"+ date : date;
							var hours = dateObj.getHours();
							hours = /^\d$/.test(hours) ? "0"+ hours : hours;
							var minutes = dateObj.getMinutes();
							minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
							var seconds = dateObj.getSeconds();
							seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
							selectedDimensionValues = selectedDimensionValues + dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds()+",";     
							}
							else
								selectedDimensionValues = selectedDimensionValues + aContexts[key].getProperty(that.dimensionContext.getProperty("name")) + ",";
						}
						selectedDimensionValues = selectedDimensionValues.substring(0, selectedDimensionValues.length - 1);
						that.oModelForDimensions.setProperty(that.dimensionContext.getPath() + "/" + valueType,selectedDimensionValues);
						parentInputField.fireChange({
							value : selectedDimensionValues
						});
						that.dimensionValue[dimensionName] = that.dimensionValue[dimensionName] ? that.dimensionValue[dimensionName] : {};
						that.dimensionValue[dimensionName][valueType] = selectedDimensionValues;
					},
					liveChange : function(oEvent) {
						var searchValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter(dimensionName, sap.ui.model.FilterOperator.Contains,
								searchValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
					}
				});
		this.dimensionValueHelpDialogs.setGrowingThreshold(100);
		this.dimensionValueHelpDialogs.setModel(dimensionValuesModel);

		var dimensions = this.oModelForDimensions.getData().selectedDimensions;
		var items = this.dimensionValueHelpDialogs.getItems();
		for(var i=0;i<dimensions.length;i++){
			if((dimensionName === dimensions[i].name) &&(dimensionOperator === dimensions[i].operator)){
				var value;
				if(dimensions[i].operator === "BT"){
					if(valueType === "value_1")
						value = dimensions[i].value_1.split(",");
					else
						value = dimensions[i].value_2.split(",");
				}
				else{
					value = dimensions[i].value_1.split(",");
				}

				for(var j=0;j<value.length;j++){
					for(var k=1;k<items.length;k++){
						if(value[j] === items[k].getTitle()){
							items[k].setSelected(true);
						}
					}
				}
			}
		}
		this.dimensionValueHelpDialogs.open();
		for(var i=1;i<items.length;i++){
			if(!items[i].getSelected()){
				this.dimensionValueHelpDialogs.getItems()[i].setSelected(true);
				this.dimensionValueHelpDialogs.getItems()[i].setSelected(false);
			}
		}
	},

	handleDimensionValueChange : function(oEvent) {
		this.validateValue(oEvent, "dimensionValue");
		var valueType = oEvent.getSource().getCustomData()[0].getValue(); //value_1 or value_2
		var dimensionName = oEvent.getSource().getBindingContext().getProperty("name");
		if (!this.dimensionValue[dimensionName])
			this.dimensionValue[dimensionName] = {};
		this.dimensionValue[dimensionName][valueType] = oEvent.getParameter("value");
	},

	validateValue : function(oEvent, sourceType) {
		var that = this,result;
		var dimensionName = oEvent.getSource().getBindingContext().getProperty("name");
		var valueType = oEvent.getSource().getCustomData()[0].getValue();
		var valueArray = (sourceType === "dimensionValue") ? oEvent.getParameter("value").split(",") : oEvent
				.getSource().getBindingContext().getProperty("value_1");

		//Checking if multiple values for BT
		var operator = oEvent.getSource().getBindingContext().getProperty("operator");
		if (operator === "BT") {
			if (valueArray.length > 1) {
				result = false;
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_MULTIPLE_VALUES_FOR_BETWEEN",dimensionName));
				var sPath = valueType === "value_1"
					? oEvent.getSource().getBindingContext().getPath() + "/error_1"
							: oEvent.getSource().getBindingContext().getPath() + "/error_2";
					oEvent.getSource().getModel().setProperty(sPath, true);
					return;
			} else {
				var sPath = valueType === "value_1"
					? oEvent.getSource().getBindingContext().getPath() + "/error_1"
							: oEvent.getSource().getBindingContext().getPath() + "/error_2";
					oEvent.getSource().getModel().setProperty(sPath, false);
			}
		}

		//Checking dimension value types are correct
		var expectedValueType = oEvent.getSource().getBindingContext().getProperty("propertyType");
		var errorMsg,pattern;
		for ( var key in valueArray) {
			result = true;
			var scriptTagPattern = /<(script)(.*)\/?>/i;
			var jsFunctionDefinitionPattern = /function\s*[^\(]*\(\s*([^\)]*)\)/;
			var jsFunctionCallPattern = /[^\(]*\(\s*([^\)]*)\)\s*{/;
			if (scriptTagPattern.test(valueArray[key]) || jsFunctionDefinitionPattern.test(valueArray[key])
					|| jsFunctionCallPattern.test(valueArray[key])) {
				result = false;
				errorMsg = that.oResourceBundle.getText("ERROR_INVALID_TEXT_FOR",dimensionName);
			}
			if(expectedValueType == "Edm.Int32" || expectedValueType == "Edm.Int16" || expectedValueType == "Edm.Int64")
			{
				pattern = /^[-+]?\d+$/;
				result = pattern.test(valueArray[key]) ? true : false;
				errorMsg = that.oResourceBundle.getText("ERROR_INVALID_ENTRY_ENTER_INTEGER",dimensionName);
			} 
			else if(expectedValueType == "Edm.Decimal")
			{
				pattern = /^[-+]?\d+(\.\d+)?$/;
				result = pattern.test(valueArray[key])?true:false;
				errorMsg = that.oResourceBundle.getText("ERROR_INVALID_ENTRY_ENTER_DECIMAL",dimensionName);
			}
			else if(expectedValueType == "Edm.DateTime")
			{
				pattern = /^[1-9][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])(\s([0-1][0-9]|2[0-3]):[0-5][0-9]:([0-9]|[0-5][0-9])[.][0-9]+)?$/;
				result = pattern.test(valueArray[key])?true:false;
				errorMsg = that.oResourceBundle.getText("ERROR_INVALID_ENTRY_ENTER_DATE",dimensionName);
			}

			if (!result) {
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(errorMsg);
				var sPath = valueType === "value_1"
					? oEvent.getSource().getBindingContext().getPath() + "/error_1"
							: oEvent.getSource().getBindingContext().getPath() + "/error_2";
					oEvent.getSource().getModel().setProperty(sPath, true);
					return;
			} else {
				var sPath = valueType === "value_1"
					? oEvent.getSource().getBindingContext().getPath() + "/error_1"
							: oEvent.getSource().getBindingContext().getPath() + "/error_2";
					oEvent.getSource().getModel().setProperty(sPath, false);
			}
		}
	},

	handleOperatorChange : function(oEvent) {
		var context = oEvent.getSource().getBindingContext();
		context.getObject().value_1 = "";
		if(this.dimensionValue){
			if(this.dimensionValue[context.getObject().name]){
				this.dimensionValue[context.getObject().name].value_1="";
			}
		}

		if (context.getProperty("operator") === "BT") {
			context.getObject().value_2 = "";
			if(this.dimensionValue){
				if(this.dimensionValue[context.getObject().name]){
					this.dimensionValue[context.getObject().name].value_2="";
				}
			}
		} 
		context.getModel().updateBindings();
	},

	validateDimensionsAndInputParameters : function() {
		var inputParameters = this.oModelForInputParameters.getData().inputParameters;
		var dimensions = this.oModelForDimensions.getData().selectedDimensions;
		var error = false;
		var errorType = "";
		var errorDimension = "";
		for ( var key in inputParameters) {
			if (inputParameters[key].error_1 === true || inputParameters[key].error_2 === true)
				error = true;
			if (inputParameters[key].value_1 === "") {
				error = true;
				errorType = "mandatoryFieldEmpty";
				inputParameters[key].error_1 = true;
			}
		}
		this.oModelForInputParameters.updateBindings();
		for ( var key in dimensions) {
			if (dimensions[key].error_1 === true || dimensions[key].error_2 === true){
				error = true;
				errorType = "invalidEntry";
				errorDimension = dimensions[key];
			}
			if (dimensions[key].value_1 === "") {
				error = true;
				errorType = "fieldEmpty";
				dimensions[key].error_1 = true;
			}
			if (dimensions[key].operator === "BT" && dimensions[key].value_2 === "") {
				error = true;
				errorType = "fieldEmpty";
				dimensions[key].error_2 = true;
			}
		}
		this.oModelForDimensions.updateBindings();
		return {
			error : error,
			errorType : errorType,
			errorDimension : errorDimension
		};
	},

	resetDimensionsAndInputParameters : function() {
		this.oModelForDimensions.setData({});
		this.oModelForInputParameters.setData({});
		this.dimensionDialog = null;
		this.dimensionValueHelpDialogs = {};
		this.dimensionValue = {};
		this.byId("inputParameterLayoutHeaders").setVisible(false);
		this.byId("dimensionLayoutHeaders").setVisible(false);
	},

	formatGoalType: function(goalType) {
		var that = this;
		var goalTypeText = null;
		switch(goalType) {
		case 'MA': goalTypeText = that.oApplicationFacade.getResourceBundle().getText("MAXIMIZING"); break;
		case 'MI': goalTypeText = that.oApplicationFacade.getResourceBundle().getText("MINIMIZING"); break;
		case 'RA': goalTypeText = that.oApplicationFacade.getResourceBundle().getText("RANGE"); break;
		default : goalTypeText = that.oApplicationFacade.getResourceBundle().getText("NONE");
		}
		return goalTypeText;
	},

	formatProperties: function(name, value) {
		return ((this.getView().byId("properties").getItems().length > 1) ? (', ' + name + ' : ' + value) : (name + ' : ' + value));
	},
	
	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,false);
	}
	
});