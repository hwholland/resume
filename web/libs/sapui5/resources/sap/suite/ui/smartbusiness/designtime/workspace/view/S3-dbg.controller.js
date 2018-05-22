/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.workspace.view.S3", {

	onInit : function() {
		var that = this;
		this.errorMessages = [];
		this.errorModel =  new sap.ui.model.json.JSONModel();
		this.errorModel.setData(this.errorMessages);
		this.errorState = false;
		var view = this.getView();
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		this.settingModel =sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");
		this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");
		this.oRouter.attachRouteMatched(function(evt) {
			if(evt.getParameter("name") === "multiSelect") {
				var pageContent = this.getView().getContent()[0].getContent();
				for(var i=0,l=pageContent.length; i<l; i++) {
					pageContent[i].setVisible(false);
				}
				this.oApplicationFacade.multiSelectMode = true;
			}
			else if (evt.getParameter("name") === "detail") {

				that.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");

				if(this.oApplicationFacade.multiSelectMode) {
					var pageContent = this.getView().getContent()[0].getContent();
					for(var i=0,l=pageContent.length; i<l; i++) {
						pageContent[i].setVisible(true);
					}
					this.oApplicationFacade.multiSelectMode = undefined;
				}

				this.oApplicationFacade.currentContextPath = evt.getParameter("arguments").contextPath;

				this.context = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").contextPath));

				var model = new sap.ui.model.json.JSONModel();
				model.setData(that.metadataRef.getKPIById({context:this.context, tags:true, properties:true, texts:true, evaluations:true, associations:true, associationProperties: true, model:this.oApplicationFacade.getODataModel()}));
				view.setModel(model,"indicator");

				view.setBindingContext(this.context);
				view.contextPath = evt.getParameter("arguments").contextPath;

				this.updateFooterButtons(model.getData().INDICATOR);

				that.oApplicationFacade.evaluationData = model.getData().EVALUATIONS;
				that.oApplicationFacade.evaluationDetails = [];

			}
		}, this);

		this.oHeaderFooterOptions =
		{
				bSuppressBookmarkButton: {},
				buttonList : []
		};
		that.byId("directionArrowAssociation").setColor(sap.ui.core.theming.Parameters.get("sapUiLightText"));
	},

	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},

	onAfterRendering: function() {

	},

	formatOwner: function(owner) {
		return (owner || "");
	},

	formatStatus: function(status) {
		return ((status) ? (this.oApplicationFacade.getResourceBundle().getText("ACTIVE")) : this.oApplicationFacade.getResourceBundle().getText("DRAFT"));
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

	formatEvaluationCount: function(evalCount) {
		return (evalCount || 0);
	},

	formatFavoriteMark: function(favMark) {
		return ((favMark) ? true : false);
	},

	formatTags: function(tag) { 
		return ((this.getView().byId("tags").getItems().length > 1) ? (', ' + tag) : (tag));
	},

	formatAssociationCount: function(sourceCount,targetCount) {
		var that = this;
		if(sourceCount==null && targetCount==null){
			return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"(0)";
		}
		if(sourceCount==null){
			return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"("+targetCount+")";
		}
		if(targetCount==null){
			return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"("+sourceCount+")";
		}
		var count = (parseInt(sourceCount)+parseInt(targetCount));
		return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"("+count.toString()+")";
	},

	formatAssociationCountValue: function(sourceCount,targetCount) {
		var that = this;
		if(sourceCount==null && targetCount==null){
			return 0;
		}
		if(sourceCount==null){
			return targetCount;
		}
		if(targetCount==null){
			return sourceCount;
		}
		var count = (parseInt(sourceCount)+parseInt(targetCount));
		return count;
	},

	formatProperties: function(name, value)  {
		var prop = ((this.getView().byId("assoProperties").getItems().length > 1) ? (", " + name + " : " + value) : (name + " : " + value+","));
		return prop;
	},

	formatArrowDirection: function(source_indicator) {
		return ((source_indicator == this.getView().getModel("indicator").getData().INDICATOR.ID) ? ("sap-icon://arrow-right") : ("sap-icon://arrow-left"));  
	},
	formatAssociationType: function(associationType){
		if(associationType=="SUPPORTING"){
			return this.oApplicationFacade.getResourceBundle().getText("SUPPORTING");
		}
		else{
			return this.oApplicationFacade.getResourceBundle().getText("CONFLICTING");
		}
	},
	formatTargetIndicatorText: function(sourceIndicator, targetIndicator, sourceIndicatorTitle, targetIndicatorTitle) { 
		var indicatorText = null;
		if(targetIndicator == this.getView().getModel("indicator").getData().INDICATOR.ID) {
			indicatorText = sourceIndicatorTitle;
		}
		else {
			indicatorText = targetIndicatorTitle;
		}
		return indicatorText;
	},

	formatStatusOfAssociation: function(is_active,counter){
		var that = this;
		if(counter=="2"){
			var str = that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE")+","+that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT");
			return str;
		}
		if(is_active==0){
			return that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW");
		}
		if(is_active==1){
			return that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE");
		}
	},

	formatKpiStatus: function(state, count) {
		var that = this;
		var isActive = "";
		if(count > 1) {
			isActive = (that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE") + "," + that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT"));
		}
		else if(state){
			isActive = that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE");
		}
		else {
			isActive = that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW");
		}
		return isActive;
	},

	handleEvaluationSelect: function(evt) {
		var that = this;
		var bindingContext = evt.getParameter("listItem").getBindingContext("indicator");
		var evalContext = "/EVALUATIONS_MODELER(ID='" + bindingContext.getObject().ID + "',IS_ACTIVE=" + bindingContext.getObject().IS_ACTIVE + ")";
		this.oApplicationFacade.evaluationIndex = parseInt(bindingContext.getPath().substring(bindingContext.getPath().length - 1),10);
		sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"SBWorkspace", route:"evalDetail", context:(this.getView().contextPath + evalContext)});
	},

	getAllFooterButtons: function() {
		var that = this;
		var buttonList = [/*{
								sI18nBtnTxt : "Error",
								sId : "errorBtn",
								id : "errorBtn",
								bDisabled : false,
								onBtnPressed : function(event){
									sap.smartbusiness.ui.core.lib.Util.handleMessagePopover(event,that);
								}
						  },*/
		                  {
		                	  id: "addEval",
		                	  sId: "addEvaluationButton",
		                	  sI18nBtnTxt : "ADD_EVALUATION",
		                	  onBtnPressed : function(evt) {
		                		  that.errorMessages=[];
		                		  sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action:"createSBKPIEvaluation", route:"addEvaluation", context:(that.getView().contextPath)});
		                	  },
		                  }, {
		                	  sId: "favouriteToggleButton",
		                	  sI18nBtnTxt : "ADD_FAVOURITE",
		                	  onBtnPressed : function(evt) {
		                		  that.errorMessages=[];
		                		  var path = "/FAVOURITES";
		                		  var contextObj = that.getView().getModel("indicator").getData().INDICATOR;
		                		  var oDataModel = that.oApplicationFacade.getODataModel(); 
		                		  var payload = {ID:contextObj.ID, TYPE:contextObj.ENTITY_TYPE, USER_ID:that.oApplicationFacade.currentLogonHanaUser, MANUAL_ENTRY:1, LAST_WORKED_ON:null};
		                		  if(contextObj.MANUAL_ENTRY) {
		                			  //odata remove
//		                			  path += "(ID='" + contextObj.ID + "',TYPE='" + contextObj.ENTITY_TYPE + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')";
//		                			  oDataModel.remove(path,null,function(data) {
//		                			  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_DELETE_SUCCESS_KPI_OPI"));
//		                			  oDataModel.refresh();
//		                			  contextObj.MANUAL_ENTRY = 0;
//		                			  that.updateFooterButtons(contextObj);
//		                			  }, function(err) {
//		                			  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_DELETE_ERROR_KPI_OPI"), err.response.body);
//		                			  });

		                			  //xsjs remove
		                			  that.metadataRef.remove("INDICATOR_FAVOURITE",payload,function(data) {
		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_DELETE_SUCCESS_KPI_OPI"));
		                				  contextObj.MANUAL_ENTRY = 0;
		                				  that.updateFooterButtons(contextObj);
		                				  that.getView().getModel("indicator").getData().INDICATOR = contextObj;
		                				  that.getView().getModel("indicator").setData(that.getView().getModel("indicator").getData());
		                				  //oDataModel.refresh();
		                				  that.refreshMasterList();
		                			  }, function(err) {
		                				  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_DELETE_ERROR_KPI_OPI"), err.responseText);
		                				  that.errorMessages.push({
                                              "type":"Error",
                                              "title":that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_DELETE_ERROR_KPI_OPI"),
                                              "description":  err.responseText
	                                      });
	                                      sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);   
		                			  });
		                		  }
		                		  else if(contextObj.MANUAL_ENTRY == 0) {
		                			  //odata update
//		                			  path += "(ID='" + contextObj.ID + "',TYPE='" + contextObj.ENTITY_TYPE + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')";
//		                			  oDataModel.update(path,payload,null,function(data) {
//		                			  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
//		                			  oDataModel.refresh();
//		                			  contextObj.MANUAL_ENTRY = 1;
//		                			  that.updateFooterButtons(contextObj);
//		                			  }, function(err) {
//		                			  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"), err.response.body);
//		                			  });

		                			  //xsjs update
		                			  that.metadataRef.update("INDICATOR_FAVOURITE",payload,null,function(data) {
		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
		                				  contextObj.MANUAL_ENTRY = 1;
		                				  that.updateFooterButtons(contextObj);
		                				  that.getView().getModel("indicator").getData().INDICATOR = contextObj;
		                				  that.getView().getModel("indicator").setData(that.getView().getModel("indicator").getData());
		                				  //oDataModel.refresh();
		                				  that.refreshMasterList();
		                			  }, function(err) {
		                				  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"), err.responseText);
		                				  that.errorMessages.push({
                                              "type":"Error",
                                              "title":that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"), 
                                              "description":  err.responseText
	                                      });
	                                      sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);      
		                			  });
		                		  }
		                		  else if(contextObj.MANUAL_ENTRY == null) {
		                			  //odata create
//		                			  oDataModel.create(path,payload,null,function(data) {
//		                			  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
//		                			  oDataModel.refresh();
//		                			  contextObj.MANUAL_ENTRY = 1;
//		                			  that.updateFooterButtons(contextObj);
//		                			  }, function(err) {
//		                			  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"), err.response.body);
//		                			  });

		                			  //xsjs create
		                			  that.metadataRef.create("INDICATOR_FAVOURITE",payload,null,function(data) {
		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
		                				  contextObj.MANUAL_ENTRY = 1;
		                				  that.updateFooterButtons(contextObj);
		                				  that.getView().getModel("indicator").getData().INDICATOR = contextObj;
		                				  that.getView().getModel("indicator").setData(that.getView().getModel("indicator").getData());
		                				  //oDataModel.refresh();
		                				  that.refreshMasterList();
		                			  }, function(err) {
		                				  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"), err.responseText);
		                				  that.errorMessages.push({
                                              "type":"Error",
                                              "title":that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"),
                                              "description":  err.responseText
	                                      });
	                                      sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);  
		                			  });
		                		  }
		                	  }
		                  }, {
		                	  sId: "activateButton",
		                	  sI18nBtnTxt : "ACTIVATE",
		                	  onBtnPressed : function(evt) {
		                		  that.errorMessages=[];
		                		  var entity = "ACTIVE_INDICATORS";
		                		  var payload = {};
		                		  var payloads = [];
		                		  payload.ID = that.getView().getModel("indicator").getData().INDICATOR.ID;
		                		  payloads.push(payload);

		                		  //Adapter Implementation Required --->>		             		  
		                		  that.oApplicationFacade.getODataModel().read(("/INDICATOR_TEXTS?$filter=ID eq '"+that.getView().getModel("indicator").getData().INDICATOR.ID + "' and IS_ACTIVE eq 0 and TITLE ne ''"), null, null, false, function(data) {
		                			  if(data && data.results && data.results.length) {
		                				  var ODataModel = that.oApplicationFacade.getODataModel();
		                				  // odata write
//		                				  ODataModel.create(entity,payload,null,function(data){
//		                				  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_KPI_OPI_SUCCESS"));
//		                				  sap.suite.ui.smartbusiness.lib.Util.utils.hashChange({hash:window.location.hash.replace("IS_ACTIVE=0","IS_ACTIVE=1")});
//		                				  ODataModel.refresh(); 
//		                				  },
//		                				  function(err){
//		                				  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_KPI_OPI_ERROR"), err.response.body);
//		                				  });

		                				  //xsjs write
		                				  that.metadataRef.create("ACTIVATE_INDICATOR",payloads, null, function(data){
		                					  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_KPI_OPI_SUCCESS"));
		                					  sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({hash:window.location.hash.replace("IS_ACTIVE=0","IS_ACTIVE=1")}, true);
		                					  //ODataModel.refresh();
		                					  that.refreshMasterList();
		                				  },
		                				  function(err){
		                					  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_KPI_OPI_ERROR"), err.responseText);
		                					  that.errorMessages.push({
	                                              "type":"Error",
	                                              "title":that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_KPI_OPI_ERROR"),
	                                              "description":  err.responseText
		                                      });
		                                      sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);    
		                				  });
		                			  }
		                			  else {
		                				  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_KPI_OPI_TITLE"));
		                				  that.errorMessages.push({
                                              "type":"Error",
                                              "title":that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_KPI_OPI_TITLE"),
                                              "description":  ""
	                                      });
	                                      sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);  
		                			  }
		                		  }, function() {

		                		  });
		                	  }
		                  }, {
		                	  id: "editBut",
		                	  sId: "editButton",
		                	  sI18nBtnTxt : "EDIT",
		                	  onBtnPressed : function(evt) {
		                		  that.errorMessages=[];
		                		  sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
		                		  sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
		                		  sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI  = sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI || {};
		                		  sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace = true;
		                		  var contextPath = that.getView().contextPath;
		                		  contextPath = (that.getView().getBindingContext().getObject().COUNTER == 2) ? contextPath.replace("IS_ACTIVE=1","IS_ACTIVE=0") : contextPath;
		                		  contextPath = contextPath.replace("INDICATORS_MODELER","INDICATORS");
		                		  if(that.getView().getBindingContext().getObject().COUNTER == 2){
		                			  sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action:"createSBKPI", route:"editDraftKpi", context:(contextPath)});
		                		  }
		                		  else if(that.getView().getBindingContext().getObject().COUNTER == 1){
		                			  sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action:"createSBKPI", route:"editKpi", context:(contextPath)});
		                		  }
		                	  }
		                  }, {
		                	  sId: "deleteButton",
		                	  sI18nBtnTxt : "DELETE_BUTTON_TEXT",
		                	  onBtnPressed : function(evt) {
		                		  that.errorMessages=[];
		                		  if(!(sap.m.MessageBox)) {
		                			  jQuery.sap.require("sap.m.MessageBox");
		                		  }	
		                		  sap.m.MessageBox.show(
		                				  that.oApplicationFacade.getResourceBundle().getText("WARNING_SINGLE_INDICATOR_DELETE_KPI_OPI"),
		                				  "sap-icon://hint",
		                				  that.oApplicationFacade.getResourceBundle().getText("DELETE_BUTTON_TEXT"),
		                				  [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
		                				  function(evt){
		                					  if(evt=="OK"){
		                						  var entity = that.getView().contextPath.substring(1).replace("INDICATORS_MODELER","INDICATORS");
		                						  var payloads = [];
		                						  payloads.push({ID:that.getView().getModel("indicator").getData().INDICATOR.ID,IS_ACTIVE:that.getView().getModel("indicator").getData().INDICATOR.IS_ACTIVE});
		                						  var ODataModel = that.oApplicationFacade.getODataModel();
		                						  //odata remove
//		                						  ODataModel.remove(entity,null,function(data){
//		                						  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_KPI_OPI_SUCCESS"));
//		                						  ODataModel.refresh();
//		                						  sap.suite.ui.smartbusiness.lib.Util.utils.hashChange({hash:window.location.hash.substr(0,window.location.hash.indexOf("&/"))});
//		                						  },
//		                						  function(err){
//		                						  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_KPI_OPI_ERROR"), err.response.body);
//		                						  });

		                						  //xsjs remove
		                						  that.metadataRef.remove("INDICATOR",payloads,function(data){
		                							  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_KPI_OPI_SUCCESS"));
		                							  //ODataModel.refresh();
		                							  that.refreshMasterList();
		                							  sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({hash:window.location.hash.substr(0,window.location.hash.indexOf("&/"))}, true);
		                						  },
		                						  function(err){
		                							  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_KPI_OPI_ERROR"), err.responseText);
		                							  that.errorMessages.push({
			                                              "type":"Error",
			                                              "title":that.oApplicationFacade.getResourceBundle().getText("DELETE_KPI_OPI_ERROR"),
			                                              "description":  err.responseText
				                                      });
				                                      sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);     
		                						  });
		                					  }
		                					  if(evt=="CANCEL"){

		                					  }
		                				  }
		                		  );
		                	  }
		                  },
		                  {
		                	  sId: "duplicateButton",
		                	  sI18nBtnTxt : "DUPLICATE",
		                	  onBtnPressed : function(evt){
		                		  that.errorMessages=[];
//		                		  sap.suite.ui.smartbusiness = sap.suite.ui.smartbusiness || {};
//		                		  sap.suite.ui.smartbusiness.modelerAppCache = sap.suite.ui.smartbusiness.modelerAppCache || {};
//		                		  sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI  = sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI || {};
//		                		  sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace = true;
//		                		  sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action:"createSBKPI", route:"duplicateKpi", context:(that.getView().contextPath.replace("INDICATORS_MODELER","INDICATORS"))});
		                		  this.duplicateKPIDialog = this.duplicateKPIDialog || that.createDuplicateDialog();
		                		  this.duplicateKPIDialog.setContentHeight("350px");
		                		  that.vBoxForIdPrefixText.setVisible(true);
		                		  that.prefixInput.setValue();
		                		  that.prefixInput.setValueState("None");
			        	          that.prefixForm.setVisible(true);
		                		  if(!that.settingModel.getData().ID_VISIBLE){
		                			  that.vBoxForIdPrefixText.setVisible(false);
				        	          that.prefixForm.setVisible(false);
				        	          this.duplicateKPIDialog.setContentHeight("200px");
		                		  }
		                		  this.duplicateKPIDialog.open();
		                		  
		                	  }
		                  } 

		                  ];

		return buttonList;
	},

	createDuplicateDialog : function(){

		var that = this;

		var kpiOnlyRadButton = new sap.m.RadioButton({
			groupName: "DuplicateKPI",
			text: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_KPI_ONLY"),
			selected:true
		});
		var kpiAndEntitiesRadBtn = new sap.m.RadioButton({
			groupName: "DuplicateKPI",
			text: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_KPI_AND_ENTITIES")

		}); 
		var kpiOnlyText = new sap.m.Text({
			text: that.oApplicationFacade.getResourceBundle().getText("KPI_ONLY_TEXT")
		});
		var kpiAndEntitiesText = new sap.m.Text({
			text: that.oApplicationFacade.getResourceBundle().getText("KPI_AND_ENTITIES_TEXT")
		});
		var generatedIdInfoText = new sap.m.Text({
			text: that.oApplicationFacade.getResourceBundle().getText("GENERATED_ID_INFO")
		});
		var duplicateIdExample = new sap.m.Text({
			text: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_ID_SAMPLE")
		});
		var prefixLabel = new sap.m.Label({
			text: that.oApplicationFacade.getResourceBundle().getText("ID_PREFIX")
		});
		this.prefixInput = new sap.m.Input({
			type:"Text",
			maxLength:4,
			placeholder: that.oApplicationFacade.getResourceBundle().getText("PREFIX_PLACEHOLDER"),
			showValueHelp: false
		}).attachLiveChange(function (){
       		that.validatePrefix();
       	});
		var charLimitText = new sap.m.Text({
			text: that.oApplicationFacade.getResourceBundle().getText("CHAR_LIMIT"),
		})
		var vBoxForKPIOnlyRadButton = new sap.m.VBox({
			items:[
			       kpiOnlyRadButton,
			       kpiOnlyText
			       ]
		});
		var vBoxForKPIAndEntitiesRadBtn = new sap.m.VBox({
			items:[
			       kpiAndEntitiesRadBtn,
			       kpiAndEntitiesText
			       ]
		});
		this.vBoxForIdPrefixText = new sap.m.VBox({
			items:[
			       generatedIdInfoText,
			       duplicateIdExample
			       ]
		});

		var okBtn = new sap.m.Button({
			text:that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_KPI_OK"),
			press: function(){
				if(kpiOnlyRadButton.getSelected()){
					
					if(that.prefixInput.getVisible()){
						if(that.validatePrefix()){
							that.metadataRef.create("DUPLICATE_ENTITY",{flag:"INDICATOR-ONLY", id:that.getView().getModel("indicator").getData().INDICATOR.ID, prefix:that.prefixInput.getValue()}, null,  
									function(success){
								duplicateDialog.close();
								sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_SUCCESS"));
								that.refreshMasterList();
							},
							function(error){
								duplicateDialog.close();
								sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(JSON.parse(error.responseText).errorMessage);
								that.errorMessages.push({
									"type":"Error",
									"title":JSON.parse(error.responseText).errorMessage,
									"description":  ""
								});
								sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);  

							});
						}
					}else{
						that.metadataRef.create("DUPLICATE_ENTITY",{flag:"INDICATOR-ONLY", id:that.getView().getModel("indicator").getData().INDICATOR.ID, prefix:""}, null,  
								function(success){
							duplicateDialog.close();
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_SUCCESS"));
							that.refreshMasterList();
						},
						function(error){
							duplicateDialog.close();
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(JSON.parse(error.responseText).errorMessage);
							that.errorMessages.push({
								"type":"Error",
								"title":JSON.parse(error.responseText).errorMessage,
								"description":  ""
							});
							sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);  

						});
						
					}				
					

				}else if(kpiAndEntitiesRadBtn.getSelected()){
					if(that.prefixInput.getVisible()){
						if(that.validatePrefix()){
							that.metadataRef.create("DUPLICATE_ENTITY",{flag:"INDICATOR", id:that.getView().getModel("indicator").getData().INDICATOR.ID, prefix:that.prefixInput.getValue()}, null,  
									function(success){
								duplicateDialog.close();
								sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_SUCCESS"));
								that.refreshMasterList();
							},
							function(error){
								duplicateDialog.close();
								sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(JSON.parse(error.responseText).errorMessage);
								that.errorMessages.push({
									"type":"Error",
									"title":JSON.parse(error.responseText).errorMessage,
									"description":  ""
								});
								sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);  
							});
							
						}
					}else{
						that.metadataRef.create("DUPLICATE_ENTITY",{flag:"INDICATOR", id:that.getView().getModel("indicator").getData().INDICATOR.ID, prefix:""}, null,  
								function(success){
							duplicateDialog.close();
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_SUCCESS"));
							that.refreshMasterList();
						},
						function(error){
							duplicateDialog.close();
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(JSON.parse(error.responseText).errorMessage);
							that.errorMessages.push({
								"type":"Error",
								"title":JSON.parse(error.responseText).errorMessage,
								"description":  ""
							});
							sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);  
						});
					}

					
				}
			}
		});
		var cancelBtn = new sap.m.Button({
			text: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_KPI_CANCEL"),
			press: function(){
				duplicateDialog.close();
			}
		});
		
		this.prefixForm = new sap.ui.layout.form.SimpleForm({
     	   editable:true, 
    	   layout:"ResponsiveGridLayout",
    	   maxContainerCols:12,
    	   labelSpanL:3,
    	   labelSpanM:3,
    	   labelSpanS:3,
    	   columnsL:4,
    	   columnsM:4,
    	   columnsS:4,
    	   content : [
    	              prefixLabel,
    	              that.prefixInput,
    	              charLimitText
    	              ]
       });
		
		var duplicateDialog = new sap.m.Dialog({
			title: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_KPI_DIALOG_TITLE"),
			//contentHeight:"350px",
			contentWidth:"100px",
			verticalScrolling: false,
			horizontalScrolling: false,
			content:[
			         new sap.ui.layout.Grid({
			        	 width:"100%",
			        	 defaultSpan : "L12 M12 S12",
			        	 content: [
			        	           vBoxForKPIOnlyRadButton,
			        	           vBoxForKPIAndEntitiesRadBtn,
			        	           that.vBoxForIdPrefixText,
			        	           that.prefixForm
			        	           ]})
			         ],
			         beginButton: okBtn,
			         endButton: cancelBtn
		});
		return duplicateDialog;

	},
	
	validatePrefix : function (){
		var that=this;
		this.HANA = "hana";
		this.CDS = "cds";
		this.VIEW_MODE = this.HANA;
		var successStatus = true;
		var urlParam;
		if((urlParam = jQuery.sap.getUriParameters().get("viewmode"))) {
			if(urlParam.toLowerCase && urlParam.toLowerCase() == this.CDS)
				this.VIEW_MODE = this.CDS;
		}
		var prefix = that.prefixInput.getValue();
		if(!prefix){
   			that.prefixInput.setValueState("None");
   		}
		 if(this.VIEW_MODE == this.CDS){
			that.prefixInput.setValue(prefix.toUpperCase());
		}
		if (prefix) {
			/* CDS prefix must begin with PERIOD */
			if(this.VIEW_MODE == this.CDS && prefix[0] != '.') {
				//this.kpiIdEval_reason = "NOT_START_WITH_PERIOD";
				that.prefixInput.setValueState("Error");
				that.prefixInput.setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_CDS_KPI_ID_BEGIN_WITH_PERIOD"));
				successStatus = false;
			}
			/* Only CDS prefixs must begin with PERIOD */
			else if(this.VIEW_MODE == this.HANA && prefix[0] == '.') {
				//this.kpiIdEval_reason = "_START_WITH_PERIOD";
				that.prefixInput.setValueState("Error");
				that.prefixInput.setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_HANA_KPI_ID_BEGIN_WITH_PERIOD"));
				successStatus = false;
			}
			else if (!(/^[a-zA-Z0-9.]*$/.test(prefix))) {
				that.prefixInput.setValueState("Error");
				that.prefixInput.setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_HANA_ID_PREFIX_NO_SPL_CHAR"));
				successStatus = false;
			} else {
				that.prefixInput.setValueState("None");
				that.prefixInput.setValueStateText();
				//successStatus = true;
			}
		}
		return successStatus;
	},

	updateFooterButtons: function(indicatorObj) {
		indicatorObj = indicatorObj || this.getView().getBindingContext().getObject();
		var footerAllButtons = this.getAllFooterButtons();

		this.oHeaderFooterOptions.buttonList = [];

		if((indicatorObj.COUNTER == 2) || (indicatorObj.IS_ACTIVE)) {
			this.oHeaderFooterOptions.oEditBtn = footerAllButtons[0];
		}

		if(indicatorObj.MANUAL_ENTRY) {
			footerAllButtons[1].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE");
		}
		else {
			footerAllButtons[1].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("ADD_FAVOURITE"); 
		}
		this.oHeaderFooterOptions.buttonList.push(footerAllButtons[1]);

		if(!(indicatorObj.IS_ACTIVE)) {
			this.oHeaderFooterOptions.oEditBtn = footerAllButtons[2];
		}
		
		if(indicatorObj.IS_ACTIVE) {
		this.oHeaderFooterOptions.buttonList.push(footerAllButtons[5]);
		}

		if(indicatorObj.COUNTER == 2) {
			footerAllButtons[3].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("EDIT_DRAFT");
		}
		else {
			footerAllButtons[3].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("EDIT"); 
		}
		this.oHeaderFooterOptions.buttonList.push(footerAllButtons[3]);

		this.oHeaderFooterOptions.buttonList.push(footerAllButtons[4]);

		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	},

	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,false);
	},
	openAdditionalLanguageDialog : function(){
		var that=this;
		this.additionalLanguageListModel = new sap.ui.model.json.JSONModel();
		this.additionalLanguageListModelData=[];
		this.additionalLanguageListModelData = that.getView().getModel('indicator').getData().TEXTS;
		// Fetch All Sap Languages - Adapter Implementation
		var langSuccessHandler = function(obj, arr, localeLanguage) {
			that.SAP_LANGUAGES = obj;
			that.SAP_LANGUAGE_ARRAY = arr;
			that.localLanguage = localeLanguage;
		};
		var i=0;
		var l=this.additionalLanguageListModelData.length;
		sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices").getAllLanguages({async:false, success:langSuccessHandler, model:this.oDataModel});
		for(i=0;i<l;i++){
			this.additionalLanguageListModelData[i].ADDITIONAL_LANGUAGE_KEY = that.SAP_LANGUAGES.SPRAS[this.additionalLanguageListModelData[i].LANGUAGE]; 
			
		}
		//this.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES = this.additionalLanguageListModelData.length;
		this.additionalLanguageListModel.setData(this.additionalLanguageListModelData);

	

		this.addedLanguagesList = new sap.m.List({
			showNoData:false,
			layoutData : new sap.ui.layout.GridData({
				span : "L5 M5 S5"
			}),
		});
		
		this.setEnable = function(){
			if(this.addedLanguagesList.getItems().length==0)
			{
				additionalLanguageDialog.getBeginButton().setEnabled(false); //enabling the "OK" button when an entry is added
			}else{
				additionalLanguageDialog.getBeginButton().setEnabled(true);
			}
		}
		
		
		
		
		
		
		this.addedLanguagesList.bindItems("additionalLanguageListModel>/", new sap.m.CustomListItem({
			content : new sap.ui.layout.Grid({
				hSpacing: 1,
				vSpacing: 0,
				defaultSpan : "L12 M12 S12",
				content: [
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>TITLE}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L12 M12 S12",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>DESCRIPTION}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L7 M7 S7",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_KEY}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L3 M3 S3"
				        	  }),
				        	  editable : false
				          }),
				         
				          ]
			})
		}));

		this.addedLanguagesList.setModel(that.additionalLanguageListModel,"additionalLanguageListModel");

		var additionalLanguageDialog = new sap.m.Dialog({
			contentHeight : "50%",
			contentWidth : "25%",
			title : that.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGES"),
			content :  [
			           

			            that.addedLanguagesList

			            ],

			            endButton : new sap.m.Button({
			            	text : that.oApplicationFacade.getResourceBundle().getText("OK"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            	}
			            })
		});

			additionalLanguageDialog.open();
	}


});

