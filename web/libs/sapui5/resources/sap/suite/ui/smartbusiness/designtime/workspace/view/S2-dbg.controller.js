/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");

sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.workspace.view.S2", {

	onInit: function() {
		var that = this;
		this.errorMessages = [];
		this.errorModel =  new sap.ui.model.json.JSONModel();
		this.errorModel.setData(this.errorMessages);
		this.errorState = false;
		this.oApplicationFacade.masterListControllerRef = this;
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		that.selectedGroupItemKey = "workspace";
		that.selectedGroupItemIndex = 0;
		that.lastSavedIndex = 0;
		that.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices"); 
		that.oApplicationFacade.getODataModel().setSizeLimit(100000); 
		jQuery.sap.require("sap.suite.ui.smartbusiness.lib.AppSetting");
		sap.suite.ui.smartbusiness.lib.AppSetting.init({
			oControl : this.byId("list"),
			hideElement  : "list",
			i18n: {
				checkBoxText: that.oApplicationFacade.getResourceBundle().getText("CHECKBOX_TEXT"),
				saveText: that.oApplicationFacade.getResourceBundle().getText("OK"),
				cancelText: that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				settingsText: that.oApplicationFacade.getResourceBundle().getText("SETTINGS"),
				settingInfoTitle: that.oApplicationFacade.getResourceBundle().getText("SETTING_INFO_TITLE"),
				settingInfoText: that.oApplicationFacade.getResourceBundle().getText("SETTING_INFO_TEXT")
			},
			title : that.oApplicationFacade.getResourceBundle().getText("SETTINGS_SB"),
		});
		this.settingModel = sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");
		this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");
		that.lastGroupingOption = new sap.ui.model.Sorter("MANUAL_ENTRY",true,function(context){
			var indicator_type = context.getProperty("MANUAL_ENTRY");
			var groupTitle = "";
			switch(indicator_type) {
			case 1: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");
			break;
			case 0: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");
			break;
			default: groupTitle = that.oApplicationFacade.getResourceBundle().getText("ALL_KPI_OPI");
			}
			return {
				key: groupTitle,
				text: groupTitle
			}
		});
		
		that.lastSortingOrder =  new sap.ui.model.Sorter("CHANGED_ON",true,null);
		
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
                    "description":  d.response.body
                });
                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);   
			};

			this.metadataRef.getSessionUser({async:true, success:sessionUserFetchCallBack, error:sessionUserFetchErrCallBack, model:this.oApplicationFacade.getODataModel()});
		}

		this.defaultHeaderFooterOptions = {
				sI18NMasterTitle : "MASTER_TITLE",
				sI18NSearchFieldPlaceholder : "SEARCHFIELD_PLACEHOLDER",
//				onBack: function() {
//					sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({});
//					
//				},
				onEditPress : function(isMultiSelect) {
					that.toggleListSelection(isMultiSelect);
				},
				oFilterOptions : {
					onFilterPressed: function(evt) {
						that.getView().filterOptionDialog = that.getView().filterOptionDialog || that.createFilterOptions();
						that.getView().filterOptionDialog.open();
					}
				},
				oSortOptions : {
					onSortPressed: function(evt) {
						that.getView().sortOptionDialog = that.getView().sortOptionDialog || that.createSortOptions();
						that.getView().sortOptionDialog.open();
					}
				},
				oGroupOptions : {
					onGroupPressed: function(evt) {
						if(that.byId("groupOptionsDialog")){
							that.byId("groupOptionsDialog").destroy();
						}
						that.getView().groupOptionDialog = that.createGroupOptions();
						that.getView().groupOptionDialog.open();
						that.byId("groupOptionsDialog").getContent()[0].getItems()[that.selectedGroupItemIndex].setSelected(true);
					}
				},
				onAddPress : function(evt) {
					sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
					sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
					sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI  = sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI || {};
					sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace = true;
					sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action:"createSBKPI"});
				},
				buttonList : []

		};

		this.multiSelectHeaderFooterOptions = {
				bSuppressBookmarkButton: {},
				onBack: function() {
					sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({});
				},
				onEditPress : function(isMultiSelect) {
					that.toggleListSelection(isMultiSelect);
				},
				buttonList : [/*{
	              	  sI18nBtnTxt : "Error",
	                  sId : "errorBtn",
	                  icon : "sap-icon://alert",
	                  enabled : false,
	                  onBtnPressed : function(event){
	                            sap.suite.ui.smartbusiness.lib.Util.utils.handleMessagePopover(event,that);
	                  }              
	              	},*/{
					sId: "favouriteButton",
					sI18nBtnTxt : "FAVOURITE_BUTTON_TEXT",
					onBtnPressed : function(evt) { 
						that.errorMessages=[];
						if(that.byId("list").getSelectedContexts().length) {
							var selectedContexts = that.byId("list").getSelectedContexts();
							var payload = {};
							var batchOperations = [];
							var path = null;
							var isFavouritesSuccessful = true;
							var oDataModel = that.oApplicationFacade.getODataModel();
							//odata update
//							for(var i=0,l=selectedContexts.length; i<l; i++) {
//							payload = {ID:selectedContexts[i].getProperty("ID"), TYPE:selectedContexts[i].getProperty("ENTITY_TYPE"), USER_ID:that.oApplicationFacade.currentLogonHanaUser, MANUAL_ENTRY:1, LAST_WORKED_ON:null};
//							if(selectedContexts[i].getProperty("MANUAL_ENTRY") == null) {
//							// DO POST
//							batchOperations.push(oDataModel.createBatchOperation("/FAVOURITES","POST",payload));
//							}
//							else if(selectedContexts[i].getProperty("MANUAL_ENTRY") == 0) {
//							// DO PUT
//							path = "(ID='" + selectedContexts[i].getProperty("ID") + "',TYPE='" + selectedContexts[i].getProperty("ENTITY_TYPE") + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')"; 
//							batchOperations.push(oDataModel.createBatchOperation(("/FAVOURITES" + path),"PUT",payload));
//							}
//							else {
//							// DO NOTHING
//							}
//							}
//							oDataModel.addBatchChangeOperations(batchOperations);
//							oDataModel.submitBatch(function(data,response,errorResponse){
//							if(errorResponse.length)
//							{      isFavouritesSuccessful = false;
//							return;
//							}
//							var responses = data.__batchResponses[0].__changeResponses;
//							for(var key in responses)
//							if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//							isFavouritesSuccessful = false;   
//							}
//							},function(err){
//							isFavouritesSuccessful = false;
//							},false);

//							if(!isFavouritesSuccessful) {      
//							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_BATCH_SAVE_ERROR_KPI_OPI"));
//							}
//							else {
//							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_BATCH_SAVE_SUCCESS_KPI_OPI"));
//							oDataModel.refresh();
//							}

							//xsjs update
							var payloads = [];
							for(var i=0,l=selectedContexts.length; i<l; i++) {
								if(!(selectedContexts[i].getProperty("MANUAL_ENTRY"))) {
									payloads.push({ID:selectedContexts[i].getProperty("ID"), TYPE:selectedContexts[i].getProperty("ENTITY_TYPE"), USER_ID:that.oApplicationFacade.currentLogonHanaUser, MANUAL_ENTRY:1, LAST_WORKED_ON:null});
								}
							}
							if(payloads.length) {
								that.metadataRef.update("INDICATOR_FAVOURITE",payloads,null,function(data) {
									sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
									//oDataModel.refresh();
									that.refreshMasterList();
								}, function(err) {
									sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"));
									that.errorMessages.push({
	            						  "type":"Error",
	            						  "title":that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"),
	            						  "description": err.responseText
	            					  });
	            					  sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);   
								});
							}
							else {

							}
						}
						else {
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_SELECTED"));
						}
					}
				}, {
					sId: "removeFavouriteButton",
					sI18nBtnTxt : "REMOVE_FAV_BUTTON_TEXT",
					onBtnPressed : function(evt) { 
						that.errorMessages=[];
						if(that.byId("list").getSelectedContexts().length) {
							var selectedContexts = that.byId("list").getSelectedContexts();
							var batchOperations = [];
							var path = null;
							var isFavouritesSuccessful = true;
							var oDataModel = that.oApplicationFacade.getODataModel();
							//odata remove
//							for(var i=0,l=selectedContexts.length; i<l; i++) {
//							if(selectedContexts[i].getProperty("MANUAL_ENTRY") == null) {
//							// DO NOTHING
//							}
//							else if(selectedContexts[i].getProperty("MANUAL_ENTRY") == 0) {
//							// DO NOTHING
//							}
//							else {
//							// DO DELETE
//							path = "(ID='" + selectedContexts[i].getProperty("ID") + "',TYPE='" + selectedContexts[i].getProperty("ENTITY_TYPE") + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')"; 
//							batchOperations.push(oDataModel.createBatchOperation(("/FAVOURITES" + path),"DELETE"));
//							}
//							}
//							oDataModel.addBatchChangeOperations(batchOperations);
//							oDataModel.submitBatch(function(data,response,errorResponse){
//							if(errorResponse.length)
//							{      isFavouritesSuccessful = false;
//							return;
//							}
//							var responses = data.__batchResponses[0].__changeResponses;
//							for(var key in responses)
//							if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//							isFavouritesSuccessful = false;   
//							}
//							},function(error){
//							isFavouritesSuccessful = false;
//							},false);

//							if(!isFavouritesSuccessful) {      
//							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_BATCH_SAVE_ERROR_KPI_OPI"));
//							}
//							else {
//							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("REM_FAVOURITE_BATCH_SAVE_SUCCESS_KPI_OPI"));
//							oDataModel.refresh();
//							}

							//xsjs remove
							var payloads = [];
							for(var i=0,l=selectedContexts.length; i<l; i++) {
								if(selectedContexts[i].getProperty("MANUAL_ENTRY")) {
									payloads.push({ID:selectedContexts[i].getProperty("ID"), TYPE:selectedContexts[i].getProperty("ENTITY_TYPE"), USER_ID:that.oApplicationFacade.currentLogonHanaUser, MANUAL_ENTRY:1, LAST_WORKED_ON:null});
								}
							}
							if(payloads.length) {
								that.metadataRef.remove("INDICATOR_FAVOURITE",payloads,function(data) {
									sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("REM_FAVOURITE_BATCH_SAVE_SUCCESS_KPI_OPI"));
									//oDataModel.refresh();
									that.refreshMasterList();
								}, function(err) {
									sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_BATCH_SAVE_ERROR_KPI_OPI"));
									that.errorMessages.push({
					                    "type":"Error",
					                    "title":that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_BATCH_SAVE_ERROR_KPI_OPI"),
					                    "description":  ""
					                });
					                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);   
								});
							}
							else {

							}
						}
						else {
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_SELECTED"));
						}
					}
				}, {
					sId: "deleteButton",
					sI18nBtnTxt : "DELETE_BUTTON_TEXT",
					onBtnPressed : function(evt) {
						that.errorMessages=[];
						if(that.byId("list").getSelectedContexts().length) {
							sap.m.MessageBox.show(
									that.oApplicationFacade.getResourceBundle().getText("WARNING_INDICATOR_DELETE_KPI_OPI"),
									"sap-icon://hint",
									that.oApplicationFacade.getResourceBundle().getText("INDICATOR_DELETE_ALERT_TITLE"),
									[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
									function(evt){
										if(evt=="OK"){
											var selectedContexts = that.byId("list").getSelectedContexts();
											var payload = {};
											var batchOperations = [];
											var isDeletesSuccessful = true;
											var oDataModel = that.oApplicationFacade.getODataModel();
											//odata remove
//											for(var i=0,l=selectedContexts.length; i<l; i++) {
//											if(selectedContexts[i].getProperty("IS_ACTIVE") == 1) {
//											// DO ACTIVE DELETE

//											path = selectedContexts[i].sPath.replace("INDICATORS_MODELER","INDICATORS");
//											batchOperations.push(oDataModel.createBatchOperation(path,"DELETE"));

//											}
//											else if(selectedContexts[i].getProperty("IS_ACTIVE") == 0) {
//											// DO INACTIVE DELETE
//											path = selectedContexts[i].sPath.replace("INDICATORS_MODELER","INDICATORS");
//											batchOperations.push(oDataModel.createBatchOperation(path,"DELETE"));
//											}
//											else {
//											// DO NOTHING
//											}
//											}

//											oDataModel.addBatchChangeOperations(batchOperations);
//											oDataModel.submitBatch(function(data,response,errorResponse){
//											if(errorResponse.length)
//											{       isDeletesSuccessful = false;
//											return;
//											}
//											var responses = data.__batchResponses[0].__changeResponses;
//											for(var key in responses)
//											if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//											isDeletesSuccessful = false;      
//											}

//											},function(error){
//											isDeletesSuccessful = false;
//											},false);

//											if(!isDeletesSuccessful) { 
//											sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_BATCH_SAVE_ERROR_KPI_OPI"));
//											}
//											else {
//											sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_BATCH_SAVE_SUCCESS_KPI_OPI"));
//											oDataModel.refresh();
//											}

											//xsjs remove
											var payloads = [];
											for(var i=0,l=selectedContexts.length; i<l; i++) {
												payloads.push({ID:selectedContexts[i].getProperty("ID"),IS_ACTIVE:selectedContexts[i].getProperty("IS_ACTIVE")});
											}
											if(payloads.length) {
												that.metadataRef.remove("INDICATOR",payloads,function(data){
													sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_BATCH_SAVE_SUCCESS_KPI_OPI"));
													//oDataModel.refresh();
													that.refreshMasterList();
												},
												function(err){
													sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_BATCH_SAVE_ERROR_KPI_OPI"));
													that.errorMessages.push({
									                    "type":"Error",
									                    "title":that.oApplicationFacade.getResourceBundle().getText("DELETE_BATCH_SAVE_ERROR_KPI_OPI"),
									                    "description":  err.responseText
									                });
									                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);  
												});
											}
											else {

											}
										}
										if(evt=="CANCEL"){

										}
									}
							);
						}
						else {
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_SELECTED"));
						}
					}
				}]
		};

		if(jQuery.sap.getUriParameters().get("sap-sb-enable-export") == "true") {
			var exportButton = {
					sI18nBtnTxt : "EXPORT_INDICATORS_KPI_OPI",
					onBtnPressed : function(evt) {
						if(that.byId("list").getSelectedContexts().length) {
							that.exportIndicators();
						}
						else {
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_SELECTED"));
						}
					}
			}

			this.multiSelectHeaderFooterOptions.buttonList.unshift(exportButton);
		}  

		this.currentHeaderFooterOptions = this.defaultHeaderFooterOptions;
	},

	jsonForTestData:function(){
		return {
		    "indicatorData": {
		        "ID": "sample.sap.kpi",
		        "IS_ACTIVE": 0,
		        "INDICATOR": {
		            "TITLE": "Sample KPI",
		            "DESCRIPTION": "This is a Sample KPI",
		            "TYPE": "KPI",
		            "GOAL_TYPE": "RA"
		        },
		        "TEXTS": [
		            {
		                "TITLE": "sample kpi from sap",
		                "DESCRIPTION": "Sample KPI for understanding KPI creation",
		                "LANGUAGE": "D"
		            }
		        ],
		        "TAGS": [
		            {
		                "TYPE": "EV",
		                "TAG": "a"
		            }
		        ],
		        "PROPERTIES": [
		            {
		                "TYPE": "EV",
		                "NAME": "p1",
		                "VALUE": "v1"
		            }
		        ]
		    },
		    "evaluationData": {
		        "ID": "sample.sap.kpi.evaluation1",
		        "IS_ACTIVE": 0,
		        "EVALUATION": {
		            "DESCRIPTION": "Sample SAP Evaluation",
		            "INDICATOR": "sample.sap.kpi",
		            "ODATA_URL": "/sap/hba/r/sb/core/odata/SALESORDER_TEST.xsodata",
		            "VIEW_NAME": "",
		            "COLUMN_NAME": "TotalNetAmount",
		            "OWNER_NAME": "hewhomustnotbenamed",
		            "OWNER_E_MAIL": "hewhomustnotbenamed@sap.com",
		            "OWNER_ID": "hewhomustnotbenamed",
		            "CREATED_BY": "",
		            "CHANGED_BY": "",
		            "SCALING": 3,
		            "TITLE": "Sample SAP Evaluation",
		            "ENTITY_TYPE": "",
		            "ODATA_ENTITYSET": "Sales",
		            "ODATA_PROPERTY": "",
		            "SEMANTIC_OBJECT": "",
		            "ACTION": "",
		            "DATA_SPECIFICATION": "",
		            "GOAL_TYPE": "RA",
		            "INDICATOR_TYPE": "KPI",
		            "VALUES_SOURCE": "FIXED"
		        },
		        "FILTERS": [
		            {
		                "TYPE": "FI",
		                "NAME": "CompanyCode",
		                "OPERATOR": "EQ",
		                "VALUE_1": "1000",
		                "VALUE_2": ""
		            },
		            {
		                "TYPE": "FI",
		                "NAME": "CompanyCode",
		                "OPERATOR": "EQ",
		                "VALUE_1": "3000",
		                "VALUE_2": ""
		            }
		        ],
		        "VALUES": [
		            {
		                "TYPE": "CH",
		                "FIXED": "160000050",
		                "ODATA_PROPERTY": ""
		            },
		            {
		                "TYPE": "WH",
		                "FIXED": "160000040",
		                "ODATA_PROPERTY": ""
		            },
		            {
		                "TYPE": "TA",
		                "FIXED": "160000030",
		                "ODATA_PROPERTY": ""
		            },
		            {
		                "TYPE": "CL",
		                "FIXED": "160000010",
		                "ODATA_PROPERTY": ""
		            },
		            {
		                "TYPE": "WL",
		                "FIXED": "160000020",
		                "ODATA_PROPERTY": ""
		            },
		            {
		                "TYPE": "TC",
		                "FIXED": "160000030",
		                "ODATA_PROPERTY": ""
		            }
		        ],
		        "TEXTS": [
		            {
		                "LANGUAGE": "D",
		                "TITLE": "sample kpi evaluation",
		                "DESCRIPTION": "sample KPI evaluation"
		            }
		        ],
		        "TAGS": [
		            {
		                "TYPE": "EV",
		                "TAG": "a"
		            }
		        ],
		        "PROPERTIES": [
		            {
		                "TYPE": "EV",
		                "NAME": "p1",
		                "VALUE": "v1"
		            }
		        ]
		    },
		    "chipsData": {
		        "id": "",
		        "isActive": 0,
		        "CHIP": {
		            "catalogId": "HANA_CATALOG",
		            "title": "Sample SAP KPI",
		            "description": "Sample SAP KPI",
		            "tileType": "NT",
		            "evaluationId": "sample.sap.kpi.evaluation1",
		            "url": "/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/components/tiles/indicatornumeric/NumericTileChip.xml",
		            "keywords": "",
		            "configuration": "{\"tileConfiguration\":\"{\\\"ADDITIONAL_APP_PARAMETERS\\\":\\\"{}\\\",\\\"TILE_PROPERTIES\\\":\\\"{\\\\\\\"id\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"evaluationId\\\\\\\":\\\\\\\"sample.sap.kpi.evaluation1\\\\\\\",\\\\\\\"tileType\\\\\\\":\\\\\\\"NT\\\\\\\",\\\\\\\"frameType\\\\\\\":\\\\\\\"OneByOne\\\\\\\",\\\\\\\"navType\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"semanticObject\\\\\\\":\\\\\\\"TotalNetAmount\\\\\\\",\\\\\\\"semanticAction\\\\\\\":\\\\\\\"analyzeSBKPIDetails\\\\\\\"}\\\",\\\"EVALUATION_FILTERS\\\":\\\"[{\\\\\\\"TYPE\\\\\\\":\\\\\\\"FI\\\\\\\",\\\\\\\"NAME\\\\\\\":\\\\\\\"CompanyCode\\\\\\\",\\\\\\\"VALUE_1\\\\\\\":\\\\\\\"1000\\\\\\\",\\\\\\\"OPERATOR\\\\\\\":\\\\\\\"EQ\\\\\\\",\\\\\\\"VALUE_2\\\\\\\":\\\\\\\"\\\\\\\"},{\\\\\\\"TYPE\\\\\\\":\\\\\\\"FI\\\\\\\",\\\\\\\"NAME\\\\\\\":\\\\\\\"CompanyCode\\\\\\\",\\\\\\\"VALUE_1\\\\\\\":\\\\\\\"3000\\\\\\\",\\\\\\\"OPERATOR\\\\\\\":\\\\\\\"EQ\\\\\\\",\\\\\\\"VALUE_2\\\\\\\":\\\\\\\"\\\\\\\"}]\\\",\\\"EVALUATION_VALUES\\\":\\\"[{\\\\\\\"TYPE\\\\\\\":\\\\\\\"CH\\\\\\\",\\\\\\\"FIXED\\\\\\\":\\\\\\\"160000050\\\\\\\",\\\\\\\"COLUMN_NAME\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"ODATA_PROPERTY\\\\\\\":\\\\\\\"\\\\\\\"},{\\\\\\\"TYPE\\\\\\\":\\\\\\\"CL\\\\\\\",\\\\\\\"FIXED\\\\\\\":\\\\\\\"160000010\\\\\\\",\\\\\\\"COLUMN_NAME\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"ODATA_PROPERTY\\\\\\\":\\\\\\\"\\\\\\\"},{\\\\\\\"TYPE\\\\\\\":\\\\\\\"TA\\\\\\\",\\\\\\\"FIXED\\\\\\\":\\\\\\\"160000030\\\\\\\",\\\\\\\"COLUMN_NAME\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"ODATA_PROPERTY\\\\\\\":\\\\\\\"\\\\\\\"},{\\\\\\\"TYPE\\\\\\\":\\\\\\\"TC\\\\\\\",\\\\\\\"FIXED\\\\\\\":\\\\\\\"160000030\\\\\\\",\\\\\\\"COLUMN_NAME\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"ODATA_PROPERTY\\\\\\\":\\\\\\\"\\\\\\\"},{\\\\\\\"TYPE\\\\\\\":\\\\\\\"WH\\\\\\\",\\\\\\\"FIXED\\\\\\\":\\\\\\\"160000040\\\\\\\",\\\\\\\"COLUMN_NAME\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"ODATA_PROPERTY\\\\\\\":\\\\\\\"\\\\\\\"},{\\\\\\\"TYPE\\\\\\\":\\\\\\\"WL\\\\\\\",\\\\\\\"FIXED\\\\\\\":\\\\\\\"160000020\\\\\\\",\\\\\\\"COLUMN_NAME\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"ODATA_PROPERTY\\\\\\\":\\\\\\\"\\\\\\\"}]\\\",\\\"EVALUATION\\\":\\\"{\\\\\\\"ID\\\\\\\":\\\\\\\"sample.sap.kpi.evaluation1\\\\\\\",\\\\\\\"INDICATOR\\\\\\\":\\\\\\\"sample.sap.kpi\\\\\\\",\\\\\\\"INDICATOR_TYPE\\\\\\\":\\\\\\\"KPI\\\\\\\",\\\\\\\"INDICATOR_TITLE\\\\\\\":\\\\\\\"Sample KPI\\\\\\\",\\\\\\\"GOAL_TYPE\\\\\\\":\\\\\\\"RA\\\\\\\",\\\\\\\"TITLE\\\\\\\":\\\\\\\"Sample SAP Evaluation\\\\\\\",\\\\\\\"SCALING\\\\\\\":0,\\\\\\\"ODATA_URL\\\\\\\":\\\\\\\"/sap/hba/r/sb/core/odata/SALESORDER_TEST.xsodata\\\\\\\",\\\\\\\"ODATA_ENTITYSET\\\\\\\":\\\\\\\"Sales\\\\\\\",\\\\\\\"VIEW_NAME\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"COLUMN_NAME\\\\\\\":\\\\\\\"TotalNetAmount\\\\\\\",\\\\\\\"OWNER_NAME\\\\\\\":\\\\\\\"hewhomustnotbenamed\\\\\\\",\\\\\\\"VALUES_SOURCE\\\\\\\":\\\\\\\"FIXED\\\\\\\"}\\\"}\",\"isSufficient\":\"1\",\"timeStamp\":\"1410946294748\"}"
		        },
		        "TEXTS": [
		            {
		                "title": "sample",
		                "description": "sample",
		                "id": "<dynamic>",
		                "language": "D",
		                "isActive": 0
		            }
		        ]
		    },
		    "authorizationData": {
		        "ID": "sample.sap.kpi.evaluation1",
		        "REVOKE": [],
		        "GRANT": [
		            "BPRI",
		            "sap.hba.apps.kpi.s.roles::SAP_SMART_BUSINESS_MODELER",
		            "sap.hba.r.sb.core.roles::SAP_SMART_BUSINESS_MODELER"
		        ]
		    },

		    "payload": {
		        "DDA_COLUMNS": [
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view1",
		                "NAME": "CompanyCode",
		                "TYPE": "DIMENSION",
		                "SORT_BY": "CompanyCode",
		                "VISIBILITY": "BOTH",
		                "COLOR": "",
		                "STACKING": 0,
		                "AXIS": 1,
		                "SORT_ORDER": "none",
		                "COLUMNS_ORDER": 0,
		                "IS_ACTIVE": 1
		            },
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view1",
		                "NAME": "SalesOrder",
		               "TYPE": "DIMENSION",
		                "SORT_BY": "SalesOrder",
		                "VISIBILITY": "BOTH",
		                "COLOR": "",
		                "STACKING": 0,
		                "AXIS": 1,
		                "SORT_ORDER": "none",
		                "COLUMNS_ORDER": 1,
		                "IS_ACTIVE": 1
		            },
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view1",
		                "NAME": "ActualCost",
		                "TYPE": "MEASURE",
		                "SORT_BY": "ActualCost",
		                "VISIBILITY": "BOTH",
		                "COLOR": "",
		                "STACKING": 0,
		                "AXIS": 2,
		                "SORT_ORDER": "none",
		                "COLUMNS_ORDER": 2,
		                "IS_ACTIVE": 1
		            },            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view2",
		                "NAME": "CompanyCode",
		                "TYPE": "DIMENSION",
		                "SORT_BY": "CompanyCode",
		                "VISIBILITY": "BOTH",
		                "COLOR": "",
		                "STACKING": 0,
		                "AXIS": 1,
		                "SORT_ORDER": "none",
		                "COLUMNS_ORDER": 0,
		                "IS_ACTIVE": 1
		            },
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view2",
		                "NAME": "TotalNetAmount",
		                "TYPE": "MEASURE",
		                "SORT_BY": "TotalNetAmount",
		                "VISIBILITY": "BOTH",
		                "COLOR": "",
		                "STACKING": 0,
		                "AXIS": 2,
		                "SORT_ORDER": "none",
		                "COLUMNS_ORDER": 1,
		                "IS_ACTIVE": 1
		            },
		                                                {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view2",
		                "NAME": "ActualCost",
		                "TYPE": "MEASURE",
		                "SORT_BY": "ActualCost",
		                "VISIBILITY": "BOTH",
		                "COLOR": "",
		                "STACKING": 0,
		                "AXIS": 2,
		                "SORT_ORDER": "none",
		                "COLUMNS_ORDER": 2,
		                "IS_ACTIVE": 1
		            }
		        ],
		        "DDA_CHART": [
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view1",
		                "VALUE_TYPE": "ABSOLUTE",
		                "AXIS_TYPE": "SINGLE",
		                "CHART_TYPE": "Column",
		                "DATA_LIMIT": -1,
		                "COLOR_SCHEME": "NONE",
		                "IS_ACTIVE": 1,
		                "THRESHOLD_MEASURE": ""
		            },{
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view2",
		                "VALUE_TYPE": "ABSOLUTE",
		                "AXIS_TYPE": "SINGLE",
		                "CHART_TYPE": "Column",
		                "DATA_LIMIT": -1,
		                "COLOR_SCHEME": "AUTO_SEMANTIC",
		                "IS_ACTIVE": 1,
		                "THRESHOLD_MEASURE": "ActualCost"
		            }
		        ],
		        "DDA_MASTER_TEXT": [
		            {
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view1",
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "SAP_LANGUAGE_KEY": "E",
		                "TEXT": "view1",
		                "IS_ACTIVE": 1
		            },{
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view2",
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "SAP_LANGUAGE_KEY": "E",
		                "TEXT": "view2",
		                "IS_ACTIVE": 1
		            }
		        ],
		        "DDA_MASTER": [
		            {
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view1",
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIG_ORDER": 0,
		                "IS_ACTIVE": 1
		            },
		                                                {
		                "CONFIGURATION_ID": "sample.sap.kpi.evaluation1.view2",
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIG_ORDER": 1,
		                "IS_ACTIVE": 1
		            }
		        ],
		        "DDA_FILTERS": [
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "view1",
		                "DIMENSION": "SalesGroup",
		                "VISIBILITY": 1,
		                "IS_ACTIVE": 1
		            },
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "view1",
		                "DIMENSION": "TransactionCurrency",
		                "VISIBILITY": 1,
		                "IS_ACTIVE": 1
		            }
		        ],
		        "DDA_HEADER": [
		            {
		                "CONFIGURATION_ID": "view1",
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "VISUALIZATION_TYPE": "NT",
		                "VISIBILITY": 1,
		                "REFERENCE_EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "VISUALIZATION_ORDER": 0,
		                "DIMENSION": "CompanyCode",
		                "IS_ACTIVE": 1
		            }
		        ],
		        "DDA_CONFIGURATION": [
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "view1",
		                "PROPERTY_TYPE": "SAP_FILTER",
		                "PROPERTY_VALUE": "",
		                "VISIBILITY": 1,
		                "IS_ACTIVE": 1
		            },
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "view1",
		                "PROPERTY_TYPE": "SAP_AGGREGATE_VALUE",
		                "PROPERTY_VALUE": "",
		                "VISIBILITY": 1,
		                "IS_ACTIVE": 1
		            },
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "view1",
		                "PROPERTY_TYPE": "SAP_HEADER",
		                "PROPERTY_VALUE": "",
		                "VISIBILITY": 1,
		                "IS_ACTIVE": 1
		            },
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "view1",
		                "PROPERTY_TYPE": "QUERY_SERVICE_URI",
		                "PROPERTY_VALUE": "/sap/hba/r/sb/core/odata/SALESORDER_TEST.xsodata",
		                "VISIBILITY": 1,
		                "IS_ACTIVE": 1
		            },
		            {
		                "EVALUATION_ID": "sample.sap.kpi.evaluation1",
		                "CONFIGURATION_ID": "view1",
		                "PROPERTY_TYPE": "QUERY_ENTITY_SET",
		                "PROPERTY_VALUE": "Sales",
		                "VISIBILITY": 1,
		                "IS_ACTIVE": 1
		            }
		        ]
		    
		}
		};
	},

	createTestData : function(){
		var that = this;
		var payload = that.jsonForTestData();
		jQuery.ajax({
			type: "POST",
			async: false,
			dataType: "json",
			data:JSON.stringify(payload),
			url: "/sap/hba/r/sb/core/logic/testData.xsjs",
			headers: {"X-CSRF-Token": "Fetch"},
			success: function(d, s, x) {
				//that.oApplicationFacade.getODataModel().refresh();
				that.refreshMasterList();
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("GENERATE_TEST_ENTITIES_SUCCESS"));
			},
			error: function(e) {
				that.exportBusyDialog.close();
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("GENERATE_TEST_ENTITIES_ERROR"));
				that.errorMessages.push({
                    "type":"Error",
                    "title":that.oApplicationFacade.getResourceBundle().getText("GENERATE_TEST_ENTITIES_ERROR"),
                    "description":  ""
                });
                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);   
			},
		});

	},

	createFilterOptions: function() {
		var that = this;
		var filterOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("filterOptionsDialog"),
			filterItems: [
			              new sap.m.ViewSettingsFilterItem({
			            	  text: that.oApplicationFacade.getResourceBundle().getText("BY_STATUS"),
			            	  key: "status",
			            	  items: [
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("DRAFTS"),
			            	        	  key: "drafts"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("ACTIVATED"),
			            	        	  key: "activated"
			            	          }),
			            	          ]
			              }), 
			              new sap.m.ViewSettingsFilterItem({
			            	  text: that.oApplicationFacade.getResourceBundle().getText("ACTIVITY"),
			            	  key: "activity",
			            	  items: [
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("SELF_CREATED"),
			            	        	  key: "self_created"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("RECENTLY_WORKED_UPON"),
			            	        	  key: "recently_worked_upon"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("FAVOURITE"),
			            	        	  key: "favorite"
			            	          }),
			            	          ]
			              })
			              ],
			              confirm : function(evt) {
			            	  var infoBarText = "";
			            	  var selectedFilters = evt.getParameter("filterItems");

			            	  that.setFiltering(evt.getParameter("filterItems"));

			            	  if(selectedFilters && selectedFilters.length) {
			            		  var filterObj = {};
			            		  for(var i=0,l=selectedFilters.length; i<l; i++) {
			            			  filterObj[selectedFilters[i].getParent().getKey()] = filterObj[selectedFilters[i].getParent().getKey()] || "";
			            			  filterObj[selectedFilters[i].getParent().getKey()] += (filterObj[selectedFilters[i].getParent().getKey()]) ? (",") : "";
			            			  filterObj[selectedFilters[i].getParent().getKey()] += selectedFilters[i].getText(); 
			            		  }

			            		  for(var filter in filterObj) {
			            			  if(filterObj.hasOwnProperty(filter)) {
			            				  infoBarText += (infoBarText) ? " ; " : "";
			            				  infoBarText += filterObj[filter];
			            			  }
			            		  }
			            		  that.byId("filterToolbar").setVisible(true);
			            		  that.byId("workspaceInfo").setText(infoBarText);	
			            	  }
			            	  else {
			            		  that.byId("workspaceInfo").setText("");
			            		  that.byId("filterToolbar").setVisible(false);
			            	  }
			              }
		});
		return filterOptionsDialog;
	},

	createSortOptions: function() {
		var that = this;
		var sortOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("sortOptionsDialog"),
			sortItems: [
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("BY_CHANGE_DATE"),
			            	key: "changedate"
			            }),
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("BY_TYPE"),
			            	key: "type"
			            }),
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("BY_NAME"),
			            	key: "name"
			            }),
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("BY_ID"),
			            	key: "id"
			            })
			            ],
			            confirm : function(evt) {
			            	if(evt.getParameter("sortItem")) {
			            		that.setSorting(evt.getParameter("sortItem").getKey(), evt.getParameter("sortDescending"));
			            	}
//			            	else {
//			            		that.setGrouping("workspace", true);
//			            	}
			            }
		});
		sortOptionsDialog.setSelectedSortItem("changedate");
		sortOptionsDialog.setSortDescending(true);
		return sortOptionsDialog;
	},

	createGroupOptions: function() {
		var that = this;
		var jsonData = {groupItems:[
		                            {text:that.oApplicationFacade.getResourceBundle().getText("BY_WORKSPACE"),key:"workspace", index:0},
		                            {text:that.oApplicationFacade.getResourceBundle().getText("BY_TYPE"),key:"type", index:1},
		                            {text:that.oApplicationFacade.getResourceBundle().getText("BY_STATUS"),key:"status", index:2},
		                            {text:that.oApplicationFacade.getResourceBundle().getText("BY_OWNER"),key:"owner", index:3},
		                            {text:that.oApplicationFacade.getResourceBundle().getText("NONE"),key:"none", index:4}
		                            ]};
		var model = new sap.ui.model.json.JSONModel(jsonData);
		var groupOptionsDialog = new sap.m.Dialog({
			title: that.oApplicationFacade.getResourceBundle().getText("GROUP_BY"),
			id: this.createId("groupOptionsDialog"),
			content: [new sap.m.List({
				items:{
					path: "/groupItems",
					template: new sap.m.ObjectListItem({
						type:"Active",
					    title:"{text}"
					})
				},
				itemPress: function(evt){
					evt.getParameter("listItem").setSelected(true);
					that.selectedGroupItemKey = evt.getParameter("listItem").getBindingContext().getProperty("key");
					that.selectedGroupItemIndex = evt.getParameter("listItem").getBindingContext().getProperty("index");
					if(that.selectedGroupItemKey=="workspace"){
        				that.setGrouping(that.selectedGroupItemKey,true);
        			}
        			else{
        				that.setGrouping(that.selectedGroupItemKey,false);
        			}
        			that.lastSavedIndex = that.selectedGroupItemIndex;
        			this.getParent().close();
				}
			})
			],
//			beginButton: new sap.m.Button({
//        		text: that.oApplicationFacade.getResourceBundle().getText("OK"),
//        		press: function(evt){
//        			if(that.selectedGroupItemKey=="workspace"){
//        				that.setGrouping(that.selectedGroupItemKey,true);
//        			}
//        			else{
//        				that.setGrouping(that.selectedGroupItemKey,false);
//        			}
//        			that.lastSavedIndex = that.selectedGroupItemIndex;
//        			this.getParent().close();
//        		}
//        	}),
        	endButton: new sap.m.Button({
        		text: that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
        		press: function(evt){
        			that.selectedGroupItemIndex = that.lastSavedIndex;
        			this.getParent().close();
        		}
        	})
		});
		groupOptionsDialog.setModel(model);
		return groupOptionsDialog;
	},

	getHeaderFooterOptions : function() {
		var that = this;
		var that = this;
		var payload = that.jsonForTestData();
		if(jQuery.sap.getUriParameters().mParams.createTestData){
			if(this.currentHeaderFooterOptions.buttonList){
				var testDataButtonExists = false;
				for(var key in this.currentHeaderFooterOptions.buttonList){
					if(this.currentHeaderFooterOptions.buttonList[key].sId == "testDataButton")
						testDataButtonExists = true;
				}
				if(!testDataButtonExists){
					var obj = {
							sId: "testDataButton",
							sI18nBtnTxt : "GENERATE_TEST_ENTITIES",
							onBtnPressed : function(evt) {
								that.createTestData();
							}};
					this.currentHeaderFooterOptions.buttonList.push(obj);
				}
			}
			else{
				this.currentHeaderFooterOptions.buttonList = [{
					sId: "testDataButton",
					sI18nBtnTxt : "GENERATE_TEST_ENTITIES",
					onBtnPressed : function(evt) {
						that.createTestData();
					}}]
			}

		}
		return this.currentHeaderFooterOptions;
	},

	formatTitle: function(title) {
		return (title || "");
	},

	formatEvaluationCount: function(evalCount) {
		return (evalCount || 0);
	},

	formatID: function(id) {
		var that = this;
		return (that.oApplicationFacade.getResourceBundle().getText("KPI_MASTER_ID_TEXT") + ": " + (id || ""));
	},

	formatGroupName: function(context) {
		var that = this;
		var indicator_type = context.getProperty("MANUAL_ENTRY");
		var groupTitle = "";
		switch(indicator_type) {
		case 1: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");
		break;
		case 0: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");
		break;
		default: groupTitle = that.oApplicationFacade.getResourceBundle().getText("ALL_KPI_OPI");
		}
		return {
			key: groupTitle,
			text: groupTitle
		}
	},

	setGrouping: function(key, groupDescending) {
		var that = this;
		groupDescending = groupDescending || false;
		var list = that.getView().byId("list");
		var groupOption;
		if(key == "type") {
			groupOption = new sap.ui.model.Sorter("TYPE",groupDescending,function(context){
				return {
					key: context.getProperty("TYPE"),
					text: (context.getProperty("TYPE") + "S")
				}
			});
		} 
		else if(key == "status") {
			groupOption = new sap.ui.model.Sorter("IS_ACTIVE",groupDescending,function(context){
				return {
					key: context.getProperty("IS_ACTIVE") ? that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE") : that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT"),
							text: context.getProperty("IS_ACTIVE") ? that.oApplicationFacade.getResourceBundle().getText("ACTIVE_KPI_OPI") : that.oApplicationFacade.getResourceBundle().getText("DRAFT_KPI_OPI"),
				}
			});
		}
		else if(key == "owner") {
			groupOption = new sap.ui.model.Sorter("OWNER_NAME",groupDescending,function(context){
				var owner_name = context.getProperty("OWNER_NAME");
				var groupTitle = "";
				switch(owner_name) {
				case null: groupTitle = that.oApplicationFacade.getResourceBundle().getText("NO_OWNER");
				break;
				case "": groupTitle = that.oApplicationFacade.getResourceBundle().getText("NO_OWNER");
				break;
				default: groupTitle = owner_name;
				}
				return {
					key: groupTitle,
					text: groupTitle
				}
			});
		}
		else if(key == "workspace") {
			groupOption = new sap.ui.model.Sorter("MANUAL_ENTRY",groupDescending,function(context){
				var indicator_type = context.getProperty("MANUAL_ENTRY");
				var groupTitle = "";
				switch(indicator_type) {
				case 1: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");
				break;
				case 0: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");
				break;
				default: groupTitle = that.oApplicationFacade.getResourceBundle().getText("ALL_KPI_OPI");
				}
				return {
					key: groupTitle,
					text: groupTitle
				}
			});
		}
		else if(key == "none") {
			groupOption = null;
		}
		
		if(that.lastSortingOrder && key != "none"){
			list.getBinding("items").sort([groupOption,that.lastSortingOrder],true);
		}
		else{
			list.getBinding("items").sort([that.lastSortingOrder]);
		}
		this.lastGroupingOption = groupOption;
	},

	setFiltering: function(items) {
		var that = this;
		var filtersArray = [];
		var list = that.getView().byId("list");

		var filterObject = {
				"drafts": (new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 0)),
				"activated": (new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 1)),
				"self_created": (new sap.ui.model.Filter("CREATED_BY", sap.ui.model.FilterOperator.EQ, that.oApplicationFacade.currentLogonHanaUser)),
				"recently_worked_upon": (new sap.ui.model.Filter("MANUAL_ENTRY", sap.ui.model.FilterOperator.EQ, 0)),
				"favorite": (new sap.ui.model.Filter("MANUAL_ENTRY", sap.ui.model.FilterOperator.EQ, 1))
		};

		filtersArray = sap.suite.ui.smartbusiness.lib.Util.utils.getFilterArray(items, filterObject);

		if(filtersArray.length) {
			list.getBinding("items").filter(new sap.ui.model.Filter(filtersArray,true));
		}
		else {
			list.getBinding("items").filter(filtersArray);
		}
	},

	setSorting: function(key, groupDescending) {
		var that = this;
		groupDescending = groupDescending || false;
		var list = that.getView().byId("list");
		var sortOrder;
		if(key == "changedate") {
			sortOrder = new sap.ui.model.Sorter("CHANGED_ON",groupDescending,null);
		}
		else if(key == "type") { 
			sortOrder = new sap.ui.model.Sorter("TYPE",groupDescending,null);
		}
		else if(key == "name") {
			sortOrder = new sap.ui.model.Sorter("TITLE",groupDescending,null);
		}
		else if(key == "id") {
			sortOrder = new sap.ui.model.Sorter("ID",groupDescending,null);
		}
		
		if(that.lastGroupingOption){
			list.getBinding("items").sort([that.lastGroupingOption,sortOrder],true); 
		}
		else{
			list.getBinding("items").sort([sortOrder]);
		}
		this.lastSortingOrder = sortOrder;
	},

	toggleListSelection: function(isMultiSelect) {

		if(isMultiSelect) {
			this.byId("list").detachSelectionChange(this._handleSelect,this);
			this.byId("list").setMode("MultiSelect");
			this.currentHeaderFooterOptions = this.multiSelectHeaderFooterOptions;
			this.refreshHeaderFooterForEditToggle();
			this.oRouter.navTo("multiSelect",{});
			this.showEmptyView("DETAIL_TITLE",sap.ui.getCore().getConfiguration().getLanguage()," ");
		}
		else {
			this.byId("list").attachSelectionChange(this._handleSelect,this);
			this.byId("list").setMode("SingleSelectMaster");
			this.currentHeaderFooterOptions = this.defaultHeaderFooterOptions;
			this.refreshHeaderFooterForEditToggle();
			this.oRouter.navTo("detail",{
				contextPath: this.oApplicationFacade.currentContextPath
			});
		}
	},

	exportIndicators: function() { 
		var that = this;
		var dialogForHanaPackages = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("SELECT_PACKAGES"),
			items : {
				path : "/HANA_PACKAGES",
				template : new sap.m.StandardListItem({
					title : "{OBJECT}"
				})
			},
			confirm : function(oEvent) {
				var package_name = oEvent.getParameter("selectedItem").getProperty("title");

				if(package_name) {
					var payload = that.getExportObject();
					payload = payload.replace("<Hana Package Here>", oEvent.getParameter("selectedItem").getProperty("title"));
					var selectedContexts = that.byId("list").getSelectedContexts();
					var indicatorsString = "";
					var inactiveIndicatorsList = [];
					var inactiveIndicatorsText = "";
					for(var i=0,l=selectedContexts.length; i<l; i++) {
						if(selectedContexts[i].getProperty("IS_ACTIVE") == 1) {
							indicatorsString += (indicatorsString) ? ',' : ''; 
							indicatorsString += '{"value":"' + selectedContexts[i].getProperty("ID") + '","operator":"="}';
						}
						else {
							inactiveIndicatorsText += (inactiveIndicatorsText) ? ' , ' : '';
							inactiveIndicatorsText += '"' + selectedContexts[i].getProperty("TITLE") + '"';
							inactiveIndicatorsList.push(selectedContexts[i]);
						}
					}

					payload = payload.replace(/"<Indicators Here>"/g, indicatorsString);

					if(indicatorsString) {
						if(inactiveIndicatorsList.length) {
							sap.m.MessageBox.show(
									inactiveIndicatorsText + " " +that.oApplicationFacade.getResourceBundle().getText("INACTIVE_KPI_OPI_FOR_EXPORT"),
									"sap-icon://hint",
									that.oApplicationFacade.getResourceBundle().getText("EXPORT_ALERT_TITLE"),
									[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ], 
									function(evt) {
										if(evt=="OK") {
											that.callExportService(payload);
										}
										else {
										}
									});
						}
						else {
							that.callExportService(payload);
						}
					}
					else {
						sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_FOR_EXPORT"))
					}
				}
				else {
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_HANA_PACKAGE_SELECTED"));
				}
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterObject = new sap.ui.model.Filter("tolower(OBJECT)", sap.ui.model.FilterOperator.Contains,
						searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterObject], false));
			}
		});

		dialogForHanaPackages.setModel(this.oApplicationFacade.getODataModel());
		dialogForHanaPackages.open(); 
	},

	getExportObject : function() { 
		var expObj = {"data":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"]},{"tableName":"sap.hba.r.sb.core.db::INDICATOR_TEXTS","schema":"SAP_HBA","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"],"dependentOn":[]},{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","customKeys":["ID"],"keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"INDICATOR","mappingKey":"ID"}]},{"tableName":"sap.hba.r.sb.core.db::EVALUATION_TEXTS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"dependentKey":"INDICATOR","mappingKey":"ID","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"keys":{},"dependentKey":"ID","mappingKey":"ID"}]},{"tableName":"sap.hba.r.sb.core.db::EVALUATION_VALUES","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"dependentKey":"INDICATOR","mappingKey":"ID","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"keys":{},"dependentKey":"ID","mappingKey":"ID"}]},{"tableName":"sap.hba.r.sb.core.db::EVALUATION_FILTERS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"dependentKey":"INDICATOR","mappingKey":"ID","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"keys":{},"dependentKey":"ID","mappingKey":"ID"}]},{"tableName":"sap.hba.r.sb.core.db::PROPERTIES","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"TYPE":[{"value":"IN","operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"ID","mappingKey":"ID","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"customKeys":["ID","TYPE"]},{"tableName":"sap.hba.r.sb.core.db::PROPERTIES","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"TYPE":[{"value":"EV","operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"mappingKey":"ID","dependentKey":"INDICATOR","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"dependentKey":"ID","mappingKey":"ID"}],"customKeys":["ID","TYPE"]},{"tableName":"sap.hba.r.sb.core.db::TAGS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"TYPE":[{"value":"IN","operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"ID","mappingKey":"ID","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"customKeys":["ID","TYPE"]},{"tableName":"sap.hba.r.sb.core.db::TAGS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"TYPE":[{"value":"EV","operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"mappingKey":"ID","dependentKey":"INDICATOR","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"dependentKey":"ID","mappingKey":"ID"}],"customKeys":["ID","TYPE"]},{"tableName":"sap.hba.r.sb.core.db::ASSOCIATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"SOURCE_INDICATOR","mappingKey":"ID","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"customKeys":["SOURCE_INDICATOR"]},{"tableName":"sap.hba.r.sb.core.db::ASSOCIATION_PROPERTIES","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"SOURCE_INDICATOR","mappingKey":"ID","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"customKeys":["SOURCE_INDICATOR"]},{"tableName":"sap.hba.r.sb.core.db::DDA_MASTER","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_MASTER_TEXT","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_FILTERS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_HEADER","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_COLUMNS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_CHART","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_CONFIGURATION","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::CHIPS","schema":"SAP_HBA","keys":{"isActive":[{"value":1,"operator":"="}]},"customKeys":["id"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"evaluationId","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::CHIP_TEXTS","schema":"SAP_HBA","keys":{"isActive":[{"operator":"=","value":1}]},"customKeys":["id"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::CHIPS","schema":"SAP_HBA","keys":{"isActive":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"evaluationId","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}],"mappingKey":"id","dependentKey":"id"}]}],"file":{"package_name":"<Hana Package Here>"}};
		return JSON.stringify(expObj); 
	},

	callExportService: function(payload) {
		var that = this;

		jQuery.ajax({
			type: "HEAD",
			async: false,
			dataType: "json",
			url: "/sap/hba/r/sb/core/logic/__token.xsjs",
			headers: {"X-CSRF-Token": "Fetch"},
			success: function(d, s, x) {
				that.exportBusyDialog = that.exportBusyDialog || new sap.m.BusyDialog({text:that.oApplicationFacade.getResourceBundle().getText("EXPORT_KPI_OPI_BUSY_DIALOG_TEXT"), title:that.oApplicationFacade.getResourceBundle().getText("EXPORT_KPI_OPI_BUSY_DIALOG_TITLE")})
				that.exportBusyDialog.open();
				jQuery.ajax({
					url: "/sap/hba/r/sb/core/logic/transferToHanaRepo.xsjs",
					type: "POST",
					data: payload,
					headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token")},
					async: true,
					success: function(d) {
						that.exportBusyDialog.close();
						sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("EXPORT_SUCCESS"));
					},
					error: function(e) {
						that.exportBusyDialog.close();
						sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("EXPORT_ERROR"));
						that.errorMessages.push({
		                    "type":"Error",
		                    "title":that.oApplicationFacade.getResourceBundle().getText("EXPORT_ERROR"),
		                    "description":  ""
		                });
		                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);   
					}});

			},
			error: function() {
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERR_FETCH_AUTH_TOKEN"));
				$.sap.log.error("ERR_FETCH_AUTH_TOKEN");
				that.errorMessages.push({
                    "type":"Error",
                    "title":that.oApplicationFacade.getResourceBundle().getText("ERR_FETCH_AUTH_TOKEN"),
                    "description":  ""
                });
                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);  
			}
		});
	},

	onExit: function() {
		var hashObj = hasher || window.hasher;
		if(!(hashObj.getHash())) {
			sap.suite.ui.smartbusiness.lib.Util.utils.backToHome();
		}
	},

	applySearchPatternToListItem : function(oItem, sfilterPattern) {
		return sap.suite.ui.smartbusiness.lib.Util.utils.applySearchPatternToListItem.apply(this,arguments);
	
	},
	
	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,true);
	}

});

