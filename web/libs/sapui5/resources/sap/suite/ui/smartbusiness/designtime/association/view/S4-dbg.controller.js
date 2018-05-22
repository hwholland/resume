/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 */

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/association/view/nameValueTable.css");

sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.association.view.S4", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit: function() {
		var that = this; 
		var view = this.getView();
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");

		this.errorMessages = [];
		this.errorState = false;

		var onAfterAssociationTypeFetch = function (d) {
			if(that.initialAssociationType) {
				that.byId("associationTypeSelect").setSelectedKey(that.initialAssociationType);
				that.byId("associationTypeSelect").setTooltip(that.byId("associationTypeSelect").getSelectedItem().getText());
			}
			else {
				var title = d.getParameters().data && d.getParameters().data.results && d.getParameters().data.results[0] && d.getParameters().data.results[0].TITLE;
				that.byId("associationTypeSelect").setTooltip(title);
			}
			
		};
		
		this.byId("associationTypeSelect").getBinding("items").attachDataReceived(onAfterAssociationTypeFetch);
		
		this.oRouter.attachRouteMatched(function(evt) {
			that.viewMode = evt.getParameter("name");
			that.directionChange=0;
			that.getView().byId("associationPropertyValue").setValueState("None");
			that.getView().byId("associationPropertyName").setValueState("None");

			if (evt.getParameter("name") === "associationEdit") {

				var context = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").contextPath));
				that.associationContext = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").associationPath));

				view.sourceIndicatorContexts = {contextPath:evt.getParameter("arguments").contextPath, context:context};
				view.associationContexts = {contextPath:evt.getParameter("arguments").associationPath, context:that.associationContext};

				view.setBindingContext(that.associationContext);

				that.modelForSelectAssociation = new sap.ui.model.json.JSONModel();
				that.byId("associationTypeSelect").setModel(that.modelForSelectAssociation, "associationSelectModel");

				that.sourceIndicatorModel = new sap.ui.model.json.JSONModel();
				that.byId("sourceIndicatorContent").setModel(that.sourceIndicatorModel, "sourceIndicator");

				that.targetIndicatorModel = new sap.ui.model.json.JSONModel();
				that.byId("targetIndicatorContent").setModel(that.targetIndicatorModel, "targetIndicator");

				that.associationPropertiesModel = new sap.ui.model.json.JSONModel();
				that.byId("propertyNameValueBox").setModel(that.associationPropertiesModel, "associationProp");

				/// Adapter Implementation ---->>
				var associationFetchCallBack = function(data) {
					var association = data.ASSOCIATION;
					var source = data.SOURCE_INDICATOR_INFO;
					var target = data.TARGET_INDICATOR_INFO;
					var properties = data.PROPERTIES;

					//that.modelForSelectAssociation.setData({TITLE:association.TITLE, TYPE:association.TYPE});
					that.byId("associationTypeSelect").setSelectedKey(association.TYPE);
					if(that.byId("associationTypeSelect").getSelectedItem()) {
						that.byId("associationTypeSelect").setTooltip(that.byId("associationTypeSelect").getSelectedItem().getText());
					}
					
					that.associationData = association;
					that.initialAssociationType = association.TYPE;

					that.contextIndicatorId = data.SOURCE_INDICATOR_INFO.ID;

					that.sourceIndicatorModel.setData({INDICATOR:source});
					if(source && source.length) {
						that.byId("sourceIndicatorText").setText(that.oApplicationFacade.getResourceBundle().getText("CURRENT_KPI_OPI")+": " + (source[0].TITLE || ""));
						that.initialSourceIndicatorId = source[0].ID;
					}
					else {
						that.byId("sourceIndicatorText").setText(that.oApplicationFacade.getResourceBundle().getText("CURRENT_KPI_OPI")+": " + (source.TITLE || ""));
						that.initialSourceIndicatorId = source.ID;
					}

					that.targetIndicatorModel.setData({INDICATOR:target});
					if(target && target.length) {
						that.byId("selectedKpiOpiId").setValue(target[0].TITLE);
						that.initialTargetIndicatorId = target[0].ID;
					}
					else {
						that.byId("selectedKpiOpiId").setValue(target.TITLE);
						that.initialTargetIndicatorId = target.ID;
					}

					that.associationPropertiesModel.setData({PROPERTIES:properties});
					//Storing initial of Properties model
					that.oldPropertiesList = $.extend(true, {}, that.getView().byId('propertyNameValueBox').getModel("associationProp"));
				};

				var associationFetchErrCallBack = function() {

				};
				that.metadataRef.getAssociationById({context:view.associationContexts.context, async:false, source:true, target:true, properties:true, success:associationFetchCallBack, error:associationFetchErrCallBack, model:that.oApplicationFacade.getODataModel()});
			}
			else if (evt.getParameter("name") === "associationCreate") {
				that.sourceIndicatorModel = new sap.ui.model.json.JSONModel();
				that.byId("sourceIndicatorContent").setModel(that.sourceIndicatorModel, "sourceIndicator");

				that.associationData = {};

				that.targetIndicatorModel = new sap.ui.model.json.JSONModel();
				that.targetIndicatorModel.setData({INDICATOR:[]});
				that.byId("targetIndicatorContent").setModel(that.targetIndicatorModel, "targetIndicator");

				that.associationPropertiesModel = new sap.ui.model.json.JSONModel();
				that.byId("propertyNameValueBox").setModel(that.associationPropertiesModel, "associationProp");
				that.associationPropertiesModel.setData({PROPERTIES:[]});
				that.oldPropertiesList = $.extend(true, {}, that.associationPropertiesModel);

				this.byId("selectedKpiOpiId").setEditable(true);

				var context = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").contextPath));
				that.associationContext = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").associationPath));

				view.sourceIndicatorContexts = {contextPath:evt.getParameter("arguments").contextPath, context:context};
				view.associationContexts = {contextPath:evt.getParameter("arguments").associationPath, context:that.associationContext};
				view.setBindingContext(context);
				that.byId("selectedKpiOpiId").setValue("");

				var sourceIndicatorFetchCallBack = function(data) {
					var sourceIndicator = data.INDICATOR;
					that.byId("sourceIndicatorText").setText(that.oApplicationFacade.getResourceBundle().getText("CURRENT_KPI_OPI")+": " + (sourceIndicator.TITLE || ""));
					that.sourceIndicatorModel.setData({INDICATOR:sourceIndicator});
					that.contextIndicatorId = sourceIndicator.ID;
				};

				var sourceIndicatorFetchErrCallBack = function(d,s,x) {

				};

				if(context.getObject()) {
					that.contextIndicatorId = view.getBindingContext().getProperty("ID");
					this.byId("sourceIndicatorText").setText(that.oApplicationFacade.getResourceBundle().getText("CURRENT_KPI_OPI")+": "+ (view.getBindingContext().getProperty("TITLE") || ""));
					that.sourceIndicatorModel.setData({INDICATOR:that.oApplicationFacade.getODataModel().oData[evt.getParameter("arguments").contextPath]});
				}
				else {
					that.metadataRef.getKPIById({context:view.sourceIndicatorContexts.context, async:false, success:sourceIndicatorFetchCallBack, error:sourceIndicatorFetchErrCallBack, model:that.oApplicationFacade.getODataModel()});
				}
				if(this.byId("associationTypeSelect").getSelectedItem()) {
					this.byId("associationTypeSelect").setSelectedKey(this.byId("associationTypeSelect").getItems()[0].getKey());
					this.byId("associationTypeSelect").setTooltip(this.byId("associationTypeSelect").getSelectedItem().getText());
				}
			}
		}, this);

		this.oHeaderFooterOptions = {
				bSuppressBookmarkButton : {},
				onBack: function(){
					that.handleOnBack();
				},
				oEditBtn : {
					sId: "SAVE",
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						view.getController().saveAndExit(0);
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE_AND_ACTIVATE",
					onBtnPressed : function(evt) {
						view.getController().saveAndExit(1);
						view.getController().activateAssociation();
					}
				},{
					sI18nBtnTxt : "SAVE_CREATE_NEW",
					onBtnPressed : function(evt) {
						view.getController().saveAndCreateNew();
					}
				},{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.handleCancel(evt);
					}
				}]
		};
		this.oErrorOptions = {
				onBack: function(){
					that.handleOnBack();
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
					sId: "SAVE",
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						view.getController().saveAndExit(0);
					}
				},{
					sI18nBtnTxt : "SAVE_AND_ACTIVATE",
					onBtnPressed : function(evt) {
						view.getController().saveAndExit(1);
						view.getController().activateAssociation();
					}
				},{
					sI18nBtnTxt : "SAVE_CREATE_NEW",
					onBtnPressed : function(evt) {
						view.getController().saveAndCreateNew();
					}
				},{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.handleCancel(evt);
					}
				}]
		};
		var delText = that.oApplicationFacade.getResourceBundle().getText("DELETE")+" "+that.oApplicationFacade.getResourceBundle().getText("DRAFT");
		this.oHeaderFooterOptionsForDraft = {
				bSuppressBookmarkButton : {},
				onBack: function(){
					that.handleOnBackForDraft();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						view.getController().saveAndExit(0);
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE_AND_ACTIVATE",
					onBtnPressed : function(evt) {
						view.getController().saveAndExit(1);
						view.getController().activateAssociation();
					}
				},{
					sI18nBtnTxt : "SAVE_CREATE_NEW",
					onBtnPressed : function(evt) {
						view.getController().saveAndCreateNew();
					}
				},{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.handleCancelForDraft(evt);
					}
				},{
					sI18nBtnTxt : delText,
					onBtnPressed : function(evt) {
						that.handleDeleteForDraft(evt,delText);
					}
				}]
		};
		that.byId("directionArrowAssociation").setColor(sap.ui.core.theming.Parameters.get("sapUiLightText"));
		/*that.byId("deleteAssociationProp").setColor(sap.ui.core.theming.Parameters.get("sapUiLightText"));*/

		this.oErrorOptionsForDraft = {
				bSuppressBookmarkButton : {},
				onBack: function(){
					that.handleOnBackForDraft();
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
						view.getController().saveAndExit(0);
					}
				},{
					sI18nBtnTxt : "SAVE_AND_ACTIVATE",
					onBtnPressed : function(evt) {
						view.getController().saveAndExit(1);
						view.getController().activateAssociation();
					}
				},{
					sI18nBtnTxt : "SAVE_CREATE_NEW",
					onBtnPressed : function(evt) {
						view.getController().saveAndCreateNew();
					}
				},{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.handleCancelForDraft(evt);
					}
				},{
					sI18nBtnTxt : delText,
					onBtnPressed : function(evt) {
						that.handleDeleteForDraft(evt,delText);
					}
				}]
		};
	},

	setFooterOnError : function(){
		var that = this;
		if(that.errorMessages.length>1){
			switch(that.viewMode){
			case "associationCreate" :
				that.setHeaderFooterOptions(that.oErrorOptions);
				break;
			case "associationEdit" :
				that.setHeaderFooterOptions(that.oErrorOptionsForDraft);
				break;
			}
		}else{
			switch(that.viewMode){
			case "associationCreate" :
				that.setHeaderFooterOptions(that.oHeaderFooterOptions);
				break;

			case "associationEdit" :
				that.setHeaderFooterOptions(that.oHeaderFooterOptionsForDraft);
				break;
			}
		}

	},

	handleOnBack : function(){
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
					if(that.viewMode=="associationEdit"){
						that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath.replace("INDICATORS","INDICATORS_MODELER")});
					}
					else if(that.viewMode=="associationCreate"){
						that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath});
					}
				}
			}),
			endButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				press:function(){backDialog.close();}
			})                                              
		});
		if(that.anythingChangedOnBack()==true){
			backDialog.open();
		}
		else{
			if(that.viewMode=="associationEdit"){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath.replace("INDICATORS","INDICATORS_MODELER")});
			}
			else if(that.viewMode=="associationCreate"){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath});
			}
		}
	},

	handleOnBackForDraft : function(){
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
					if(that.viewMode=="associationEdit"){
						that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath.replace("INDICATORS","INDICATORS_MODELER")});
					}
					else if(that.viewMode=="associationCreate"){
						that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath});
					}
				}
			}),
			endButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				press:function(){backDialog.close();}
			})                                              
		});
		if(that.anythingChangedOnBack()==true){
			backDialog.open();
		}
		else{
			if(that.viewMode=="associationEdit"){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath.replace("INDICATORS","INDICATORS_MODELER")});
			}
			else if(that.viewMode=="associationCreate"){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath});
			}
		}
	},

	handleCancel : function(evt){
		var that = this;
		var backDialog = new sap.m.Dialog({
			icon:"sap-icon://warning2",
			title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
			state:"Error",
			type:"Message",
			content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("ON_BACK_WARNING")})],
			beginButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
				press: function(){that.cancel();}
			}),
			endButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				press:function(){backDialog.close();}
			})                                              
		});
		if(that.anythingChangedOnBack()==true){
			backDialog.open();
		}
		else{
			if(that.viewMode=="associationEdit"){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath.replace("INDICATORS","INDICATORS_MODELER")});
			}
			else if(that.viewMode=="associationCreate"){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath});
			}
		}
	},

	handleCancelForDraft : function(){
		var that = this;
		var backDialog = new sap.m.Dialog({
			icon:"sap-icon://warning2",
			title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
			state:"Error",
			type:"Message",
			content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("ON_BACK_WARNING")})],
			beginButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
				press: function(){view.getController().cancel();}
			}),
			endButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				press:function(){backDialog.close();}
			})                                              
		});
		backDialog.open();
	},

	handleDeleteForDraft : function(evt,delText){
		var that = this;
		var confirmDialog = new sap.m.Dialog({
			title: delText,
			type:"Message",
			beginButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("OK"),
				press: function(){
					that.errorMessages=[];
					that.errorState = false;
					confirmDialog.close();
					that.deleteDraft();
					if(that.viewMode=="associationEdit"){
						that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath.replace("INDICATORS","INDICATORS_MODELER")});
					}
				}
			}),
			endButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				press:function(){
					confirmDialog.close();
				}
			})                                              
		});
		confirmDialog.open();
	},
	formOldAssociationObject: function(str) {
		var that = this;
		var oldAssociationPayload={};
		oldAssociationPayload.TYPE = str.substring(str.indexOf("'",str.search("TYPE"))+1, str.indexOf("'",str.indexOf("'",str.search("TYPE"))+1));
		oldAssociationPayload.SOURCE_INDICATOR= str.substring(str.indexOf("'",str.search("SOURCE_INDICATOR"))+1, str.indexOf("'",str.indexOf("'",str.search("SOURCE_INDICATOR"))+1));
		oldAssociationPayload.TARGET_INDICATOR= str.substring(str.indexOf("'",str.search("TARGET_INDICATOR"))+1, str.indexOf("'",str.indexOf("'",str.search("TARGET_INDICATOR"))+1));
		oldAssociationPayload.IS_ACTIVE= parseInt(str.substring(str.indexOf("=",str.search("IS_ACTIVE"))+1, str.indexOf("=",str.search("IS_ACTIVE"))+2));

		return oldAssociationPayload;
	},
	anythingChangedOnBack: function(){
		var that = this;
		var sPath = (that.viewMode != "associationCreate") ? that.associationContext.sPath : null;
		var oldAssociationObject = sPath ? that.formOldAssociationObject(sPath) : {TARGET_INDICATOR:"",SOURCE_INDICATOR:"",TYPE:this.byId("associationTypeSelect").getItems()[0].getKey(),IS_ACTIVE:0};
		var newAssociationProperties = that.getView().byId('propertyNameValueBox').getModel("associationProp").getData().PROPERTIES;
		var oldAssociationProperties = that.oldPropertiesList ? that.oldPropertiesList.getData().PROPERTIES : [];

		var updatePropertiesPayload = that.utilsRef.dirtyBitCheck({
			oldPayload : oldAssociationProperties,
			newPayload : newAssociationProperties,
			objectType : "ASSOCIATION_PROPERTIES"
		});
		if(oldAssociationObject.TARGET_INDICATOR != (that.targetIndicatorModel.getData().INDICATOR.ID || "") || that.directionChange==1 || oldAssociationObject.TYPE!=that.byId("associationTypeSelect").getSelectedItem().getKey() || updatePropertiesPayload.updates.length>0 || updatePropertiesPayload.deletes.length>0){
			return true;
		}
		else{
			return false;
		}
	},
	deleteDraft: function(){
		var that = this;
		var sPath = that.associationContext.sPath;
		var deletObject = that.formOldAssociationObject(sPath);
		that.metadataRef.remove("ASSOCIATION",deletObject,function(data){
			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
			//ODataModel.refresh();
		},
		function(error){
			that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"));
			that.errorMessages.push({
				"type":"Error",
				"title":that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED")
			});
			that.utilsRef.setErrorState(that);
		});
	},
	changeValueState: function(){
		var that = this;
		that.getView().byId("associationPropertyValue").setValueState("None");
		that.getView().byId("associationPropertyName").setValueState("None");
	},
	getHeaderFooterOptions : function() {
		var that = this;
		var sPath = that.associationContext.sPath;
		var IS_ACTIVE = parseInt(sPath.charAt(sPath.indexOf("=",sPath.search("IS_ACTIVE"))+1));
		if(that.viewMode=="associationEdit"){
			if(IS_ACTIVE==1){
				return this.oHeaderFooterOptions;
			}
			else{
				return this.oHeaderFooterOptionsForDraft;
			}
		}
		else if(that.viewMode=="associationCreate"){
			return this.oHeaderFooterOptions;
		}
	},
	handleAssociationTypeChange : function(evt){
		var that = this;
		var modelForProperties = this.getView().byId('propertyNameValueBox').getModel("associationProp");
		modelForProperties.getData().PROPERTIES = modelForProperties.getData().PROPERTIES || [];
		for(i=0;i<modelForProperties.getData().PROPERTIES.length;i++){
			if(modelForProperties.getData().PROPERTIES[i].TYPE=="SUPPORTING"){
				modelForProperties.getData().PROPERTIES[i].TYPE="CONFLICTING";
			}
			else{
				modelForProperties.getData().PROPERTIES[i].TYPE="SUPPORTING";
			}
		}
		modelForProperties.updateBindings();
		evt.getSource().setTooltip(evt.getParameters().selectedItem.getText());
//		if(this.viewMode == "associationEdit") {
//		if((this.byId("associationTypeSelect").getSelectedItem().getKey() != this.initialAssociationType) || (this.sourceIndicatorModel.getData().INDICATOR.ID != this.initialSourceIndicatorId) || (this.targetIndicatorModel.getData().INDICATOR.ID != this.initialTargetIndicatorId)) {
//		this.setBtnEnabled("SAVE",false);
//		}
//		else {
//		this.setBtnEnabled("SAVE",true);
//		}
//		}
	},

	handleReverseAssociationDirection : function(){
		var that = this;
		if(that.directionChange==0){
			that.directionChange=1;
		}
		else{
			that.directionChange=0;
		}
		var i,temp;
		var sourceIndicator = this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR;
		var targetIndicator = this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR;

		if(targetIndicator.length==0){
			this.getView().byId("selectedKpiOpiId").setValueState("Error");
			that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("TARGET_KPI_NOT_SELECTED"));
			this.errorMessages.push({"type":"Error","title":that.oApplicationFacade.getResourceBundle().getText("TARGET_KPI_NOT_SELECTED")});
			that.utilsRef.setErrorState(that);
		}
		else{
			this.byId("sourceIndicatorContent").getModel("sourceIndicator").setData({INDICATOR:targetIndicator});
			this.byId("targetIndicatorContent").getModel("targetIndicator").setData({INDICATOR:sourceIndicator});

			//Handle reverse for properties
			var modelForProperties = this.getView().byId('propertyNameValueBox').getModel("associationProp");
			modelForProperties.getData().PROPERTIES = modelForProperties.getData().PROPERTIES || [];

			for(i=0;i<modelForProperties.getData().PROPERTIES.length;i++){
				temp = null;
				temp = modelForProperties.getData().PROPERTIES[i].SOURCE_INDICATOR;
				modelForProperties.getData().PROPERTIES[i].SOURCE_INDICATOR = modelForProperties.getData().PROPERTIES[i].TARGET_INDICATOR;
				modelForProperties.getData().PROPERTIES[i].TARGET_INDICATOR = temp;
			}      
			modelForProperties.updateBindings();
		}
//		if(this.viewMode == "associationEdit") {
//		if((this.byId("associationTypeSelect").getSelectedItem().getKey() != this.initialAssociationType) || (this.sourceIndicatorModel.getData().INDICATOR.ID != this.initialSourceIndicatorId) || (this.targetIndicatorModel.getData().INDICATOR.ID != this.initialTargetIndicatorId)) {
//		this.setBtnEnabled("SAVE",false);
//		}
//		else {
//		this.setBtnEnabled("SAVE",true);
//		}
//		}
	},

	listAllKpis:function(){ 
		var that = this;

		that.hanaViewValueHelpDialog = that.hanaViewValueHelpDialog || new sap.m.SelectDialog({
			title: that.oApplicationFacade.getResourceBundle().getText("SELECT_VIEW"),
			noDataText: that.oApplicationFacade.getResourceBundle().getText("NO_DATA_FOUND"),
			items: {
				path: "/INDICATORS_MODELER",
				template: new sap.m.ObjectListItem({
					title:"{TITLE}",
					number:"{parts:[{path:'ASSOCIATION_SOURCE_COUNT'},{path:'ASSOCIATION_TARGET_COUNT'}], formatter:'.formatAssociationCount'}",
					firstStatus: new sap.m.ObjectStatus({
						text: that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS"),
					}),
					attributes: [
					             new sap.m.ObjectAttribute({
					            	 text: "{ID}"
					             })
					             ]
				}),
			},
			confirm: function(oEvent){
				var i;
				if (that.viewMode === "associationEdit"){                            
				}
				else if (that.viewMode === "associationCreate"){
					if(that.getView().byId("selectedKpiOpiId").getValueState()==="Error"){
						that.getView().byId("selectedKpiOpiId").setValueState("None");
					}
				}
				that.byId("selectedKpiOpiId").setValue(oEvent.getParameter("selectedItem").getBindingContext().getProperty("TITLE"));
				that.targetIndicatorModel.setData({INDICATOR:oEvent.getParameter("selectedItem").getBindingContext().getObject()});
				that.targetIndicatorModel.updateBindings();

				//Change Properties Target kpi
				var modelForProperties = that.getView().byId('propertyNameValueBox').getModel("associationProp");
				modelForProperties.getData().PROPERTIES = modelForProperties.getData().PROPERTIES || [];

				for(i=0;i<modelForProperties.getData().PROPERTIES.length;i++){
					modelForProperties.getData().PROPERTIES[i].TARGET_INDICATOR = oEvent.getParameter("selectedItem").getBindingContext().getProperty("ID");
				}      
				modelForProperties.updateBindings();
//				if(that.viewMode == "associationEdit") {
//				if((that.byId("associationTypeSelect").getSelectedItem().getKey() != that.initialAssociationType) || (that.sourceIndicatorModel.getData().INDICATOR.ID != that.initialSourceIndicatorId) || (that.targetIndicatorModel.getData().INDICATOR.ID != that.initialTargetIndicatorId)) {
//				that.setBtnEnabled("SAVE",false);
//				}
//				else {
//				that.setBtnEnabled("SAVE",true);
//				}
//				}
			},
			liveChange: function(oEvent){
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterById = new sap.ui.model.Filter("tolower(ID)", sap.ui.model.FilterOperator.Contains, searchValue);
				var oFilterByTitle = new sap.ui.model.Filter("tolower(TITLE)", sap.ui.model.FilterOperator.Contains, searchValue);
				var oFilterCurrentId = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.NE, that.contextIndicatorId);
				var oFilterIsActive = new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 1);
				var oBinding = oEvent.getSource().getBinding("items");
				var firstFilters = new sap.ui.model.Filter([oFilterById,oFilterByTitle], false);
				var secondFilters = new sap.ui.model.Filter([oFilterCurrentId,oFilterIsActive], true);
				oBinding.filter(new sap.ui.model.Filter([firstFilters, secondFilters], true));
			}
		});    
		that.hanaViewValueHelpDialog.setModel(that.oApplicationFacade.getODataModel());
		var filters = [];
		filters.push(new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 1));
		filters.push(new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.NE, that.contextIndicatorId));
		that.hanaViewValueHelpDialog.getBinding("items").filter(new sap.ui.model.Filter(filters,true));
		that.hanaViewValueHelpDialog.open();
	},

	addNewProperty: function() {
		var that = this;
		var propertyPresent = 0;
		if(this.getView().byId("associationPropertyName").getValue() && this.getView().byId("associationPropertyValue").getValue()) {

			if(this.viewMode=="associationEdit"){
				this.isActiveValue = 0;
			}
			else if(this.viewMode=="associationCreate"){

				var targetIndicator = this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR;
				if(targetIndicator.length==0){
					this.getView().byId("selectedKpiOpiId").setValueState("Error");
					that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("TARGET_KPI_NOT_SELECTED"));
					this.errorMessages.push({"type":"Error","title":that.oApplicationFacade.getResourceBundle().getText("TARGET_KPI_NOT_SELECTED")});
					that.utilsRef.setErrorState(that);
					return;
				}
				this.isActiveValue = 0;
			}                    
			this.getView().byId("associationPropertyName").setValueState("None");
			if(this.getView().byId("associationPropertyValue").getValue()){
				this.getView().byId("associationPropertyValue").setValueState("None");
				var propertyModel = this.getView().byId('propertyNameValueBox').getModel("associationProp");
				propertyModel.getData().PROPERTIES = propertyModel.getData().PROPERTIES || [];

				for(var i=0;i<propertyModel.getData().PROPERTIES.length;i++){
					if(propertyModel.getData().PROPERTIES[i].NAME == this.getView().byId("associationPropertyName").getValue() && propertyModel.getData().PROPERTIES[i].VALUE == this.getView().byId("associationPropertyValue").getValue()){
						propertyPresent = 1;
					}
				}
				if(propertyPresent == 0){
					propertyModel.getData().PROPERTIES.push({NAME:this.getView().byId("associationPropertyName").getValue(),VALUE:this.getView().byId("associationPropertyValue").getValue(), TYPE:this.byId("associationTypeSelect").getSelectedItem().getKey(), SOURCE_INDICATOR:(this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR.ID || this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR[0].ID), TARGET_INDICATOR:(this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR.ID || this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR[0].ID), IS_ACTIVE:this.isActiveValue});
					propertyModel.updateBindings();
					this.getView().byId("associationPropertyName").setValue("");
					this.getView().byId("associationPropertyValue").setValue("");
				}
				else{
					this.getView().byId("associationPropertyValue").setValueState("Error");
					this.getView().byId("associationPropertyName").setValueState("Error");
					that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_PROPERTY_VALUE"));
					this.errorMessages.push({"type":"Error","title":that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_PROPERTY_VALUE")});
					that.utilsRef.setErrorState(that);
				}
			}
			else {
				this.getView().byId("associationPropertyValue").setValueState("Error");
				that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_VALUE"));
				this.errorMessages.push({"type":"Error","title":that.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_VALUE")});
				that.utilsRef.setErrorState(that);
			}
		}
		else {
			if(!this.getView().byId("associationPropertyName").getValue()){
				this.getView().byId("associationPropertyName").setValueState("Error");
				that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_NAME"));
				this.errorMessages.push({"type":"Error","title":that.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_NAME")});
				that.utilsRef.setErrorState(that);
			}
			else{
				this.getView().byId("associationPropertyValue").setValueState("Error");
				this.getView().byId("associationPropertyName").setValueState("None");
				that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ENTER_THE_PROPERTY_VALUE"));
				this.errorMessages.push({"type":"Error","title":that.oApplicationFacade.getResourceBundle().getText("ENTER_THE_PROPERTY_VALUE")});
				that.utilsRef.setErrorState(that);
			}
//			this.getView().byId("associationPropertyName").setValueState("Error");
//			that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ENTER_PROPERTY_NAME"));
		}
	},

	removeProperty : function(evt) { 
		var that = this;
		var path = evt.getSource().getBindingContext("associationProp").getPath();
		evt.getSource().getBindingContext("associationProp").getModel().getData().PROPERTIES.splice(path
				.substring(path.lastIndexOf("/") + 1), 1);
		evt.getSource().getBindingContext("associationProp").getModel().updateBindings();
	},

	saveAndExit: function(isSaveAndActivate) {
		var that = this;
		that.errorMessages = [];
		this.saveAssociation(isSaveAndActivate);

		if(isSaveAndActivate==0){
			//that.oApplicationFacade.getODataModel().refresh();
			if(this.viewMode=="associationEdit" && that.errorState == false){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath.replace("INDICATORS","INDICATORS_MODELER")});
			}
			else if(this.viewMode=="associationCreate" && that.errorState == false){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath});
			}
		}
	},

	activateAssociation: function() {
		var that = this;
		var sourceIndicator = this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR.length ? this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR[0] : this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR;
		var targetIndicator = this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR.length ? this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR[0] : this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR;

		that.ODataModel = that.oApplicationFacade.getODataModel();



		/*that.ODataModel.create("/ACTIVE_ASSOCIATIONS", payload, null, function(data) {
                     sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVATED"));
              }, function(err) {
                     that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_ACTIVATION_FAILED"));
              });   
		 */

		/****ACTIVATE ASSOCIATION****/
		that.metadataRef.create("ACTIVATE_ASSOCIATION",that.payload,null,
				function() {
			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVATED"));
			that.oApplicationFacade.getODataModel().refresh();
			if(that.viewMode=="associationEdit" && that.errorState == false){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath.replace("INDICATORS","INDICATORS_MODELER")});
			}
			else if(that.viewMode=="associationCreate" && that.errorState == false){
				that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath});
			}
		},
		function(err) {
			that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_ACTIVATION_FAILED"), err.responseText);
			this.errorMessages.push({"type":"Error","title":that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_ACTIVATION_FAILED"),"description" : err.responseText});
			that.utilsRef.setErrorState(that);
			
		});
		//that.oApplicationFacade.getODataModel().refresh();
		that.setFooterOnError();
		/*****************************************/
	},

	saveAndCreateNew: function() {
		var that = this;
		that.errorMessages = [];
		this.saveAssociation();

		that.byId("selectedKpiOpiId").setValue("");
		that.targetIndicatorModel.setData({});
		that.targetIndicatorModel.updateBindings();

		//Change Properties Target kpi
		var modelForProperties = that.getView().byId('propertyNameValueBox').getModel("associationProp");
		modelForProperties.getData().PROPERTIES = modelForProperties.getData().PROPERTIES || [];

		modelForProperties.getData().PROPERTIES = [];   
		modelForProperties.updateBindings();
		that.setFooterOnError();
		//this.oApplicationFacade.getODataModel().refresh();
	},

	cancel: function() {
		var that = this;
		if(that.viewMode=="associationEdit"){
			that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath.replace("INDICATORS","INDICATORS_MODELER")});
		}
		else if(that.viewMode=="associationCreate"){
			that.utilsRef.replaceHash({action:"manageSBKPIAssociation", route:"detail", context:that.getView().sourceIndicatorContexts.contextPath});
		}
	},

	formOldObjectForAssociation: function(sourceIndicator,targetIndicator) {
		var that = this;

		var sourceIndicatorObj = that.sourceIndicatorModel.getData().INDICATOR.length ? that.sourceIndicatorModel.getData().INDICATOR[0] : that.sourceIndicatorModel.getData().INDICATOR;
		var oldAssociationPayload = {TYPE:this.byId("associationTypeSelect").getSelectedItem().getKey(),SOURCE_INDICATOR:sourceIndicator.ID, TARGET_INDICATOR:targetIndicator.ID, IS_ACTIVE:0, CREATED_BY:sourceIndicatorObj.CREATED_BY, CREATED_ON:sourceIndicatorObj.CREATED_ON, CHANGED_BY:null, CHANGED_ON:null};
		var str = that.associationContext.sPath;

		oldAssociationPayload.TYPE = str.substring(str.indexOf("'",str.search("TYPE"))+1, str.indexOf("'",str.indexOf("'",str.search("TYPE"))+1));
		oldAssociationPayload.SOURCE_INDICATOR= str.substring(str.indexOf("'",str.search("SOURCE_INDICATOR"))+1, str.indexOf("'",str.indexOf("'",str.search("SOURCE_INDICATOR"))+1));
		oldAssociationPayload.TARGET_INDICATOR= str.substring(str.indexOf("'",str.search("TARGET_INDICATOR"))+1, str.indexOf("'",str.indexOf("'",str.search("TARGET_INDICATOR"))+1));
		oldAssociationPayload.IS_ACTIVE= parseInt(str.substring(str.indexOf("=",str.search("IS_ACTIVE"))+1, str.indexOf("=",str.search("IS_ACTIVE"))+2));

		return oldAssociationPayload;
	},

	performBatchOperation : function(batchArray){
		var that = this;
		that.oDataModel = that.oApplicationFacade.getODataModel();
		that.oDataModel.addBatchChangeOperations(batchArray);
		that.oDataModel.submitBatch(function(data,response,errorResponse){
			if(errorResponse.length)
			{      
				that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED")
				});
				that.utilsRef.setErrorState(that);
				//return;
			}
			var error = false;
			var responses = data.__batchResponses[0].__changeResponses;
			for(var key in responses)
				if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200")
					error = true;                     
			if(error){
				that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED")
				});
				that.utilsRef.setErrorState(that);
			}
			else
			{      
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED"));
			}
		}, function(error){
			that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED"));
			that.errorMessages.push({
				"type":"Error",
				"title":that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED")
			});
			that.utilsRef.setErrorState(that);
		},false);
	},

	savePropertiesHelper : function(associationPropertiesPayload, updateAssociationPayload, sourceIndicator, targetIndicator, isSaveAndActivate){
		var that = this;
		that.batchArray = [];
		var propertyPayload;
		var propertyPayloadArray = [];
		that.oDataModel = that.oApplicationFacade.getODataModel();


		for (var i = 0; i < associationPropertiesPayload.PROPERTIES.length; i++) {
			propertyPayload = {}
			propertyPayload.IS_ACTIVE = 0;
			propertyPayload.TYPE = associationPropertiesPayload.PROPERTIES[i].TYPE;
			propertyPayload.NAME = associationPropertiesPayload.PROPERTIES[i].NAME;
			propertyPayload.VALUE = associationPropertiesPayload.PROPERTIES[i].VALUE;
			propertyPayload.SOURCE_INDICATOR = associationPropertiesPayload.PROPERTIES[i].SOURCE_INDICATOR;
			propertyPayload.TARGET_INDICATOR = associationPropertiesPayload.PROPERTIES[i].TARGET_INDICATOR;
			propertyPayloadArray.push(propertyPayload);
		}

		if((that.viewMode === "associationEdit" && !(that.associationData.IS_ACTIVE)) || (that.viewMode === "associationEdit" && that.associationData.IS_ACTIVE && isSaveAndActivate)){

			var finalAssociationEditPayload={};
			finalAssociationEditPayload.DELETE={};
			finalAssociationEditPayload.CREATE={};


			var that = this;
			var sourceIndicator = this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR.length ? this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR[0] : this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR;
			var targetIndicator = this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR.length ? this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR[0] : this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR;

			that.ODataModel = that.oApplicationFacade.getODataModel();
			that.payload = {TYPE:that.byId("associationTypeSelect").getSelectedItem().getKey(),SOURCE_INDICATOR:sourceIndicator.ID, TARGET_INDICATOR:targetIndicator.ID};




			if(updateAssociationPayload.updates.length!=0){
				var entityForDelete = that.associationContext.sPath;
				that.batchArray.push(that.oDataModel.createBatchOperation(entityForDelete,"DELETE"));
				that.batchArray.push(that.oDataModel.createBatchOperation("/ASSOCIATIONS","POST",updateAssociationPayload.updates[0]));
			}

			var oldPropertyArray = that.oldPropertiesList.getData().PROPERTIES;
			var updatePropertiesPayload = that.utilsRef.dirtyBitCheck({
				oldPayload : oldPropertyArray,
				newPayload : propertyPayloadArray,
				objectType : "ASSOCIATION_PROPERTIES"
			});

			if(updateAssociationPayload.updates.length!=0 ){
				finalAssociationEditPayload.DELETE={"TYPE": updateAssociationPayload.deletes[0].TYPE, "SOURCE_INDICATOR": updateAssociationPayload.deletes[0].SOURCE_INDICATOR,
						"TARGET_INDICATOR":updateAssociationPayload.deletes[0].TARGET_INDICATOR,"IS_ACTIVE":updateAssociationPayload.deletes[0].IS_ACTIVE,"PROPERTY":oldPropertyArray};

				finalAssociationEditPayload.CREATE={"TYPE": updateAssociationPayload.updates[0].TYPE,"SOURCE_INDICATOR": updateAssociationPayload.updates[0].SOURCE_INDICATOR,
						"TARGET_INDICATOR":updateAssociationPayload.updates[0].TARGET_INDICATOR,"IS_ACTIVE":updateAssociationPayload.updates[0].IS_ACTIVE,"PROPERTY":propertyPayloadArray

				};
				//update association
				that.metadataRef.update("ASSOCIATION",finalAssociationEditPayload,null,
						function() {
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED"));
					that.oApplicationFacade.getODataModel().refresh();
				},
				function(err) {
					that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED"), err.responseText);
					that.errorMessages.push({
						"type":"Error",
						"title":that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED"),
						"description":err.responseText
					});
					that.utilsRef.setErrorState(that);
				});
				//that.oApplicationFacade.getODataModel().refresh();
			}
			//If only properties are changed
			else{
				if(updatePropertiesPayload.deletes.length>0){
					finalAssociationEditPayload.TYPE = updatePropertiesPayload.deletes[0].TYPE;
					finalAssociationEditPayload.TARGET_INDICATOR = updatePropertiesPayload.deletes[0].TARGET_INDICATOR;
					finalAssociationEditPayload.SOURCE_INDICATOR = updatePropertiesPayload.deletes[0].SOURCE_INDICATOR;
					finalAssociationEditPayload.IS_ACTIVE = updatePropertiesPayload.deletes[0].IS_ACTIVE;
				}
				if(updatePropertiesPayload.updates.length>0){
					finalAssociationEditPayload.TYPE = updatePropertiesPayload.updates[0].TYPE;
					finalAssociationEditPayload.TARGET_INDICATOR = updatePropertiesPayload.updates[0].TARGET_INDICATOR;
					finalAssociationEditPayload.SOURCE_INDICATOR = updatePropertiesPayload.updates[0].SOURCE_INDICATOR;
					finalAssociationEditPayload.IS_ACTIVE = updatePropertiesPayload.updates[0].IS_ACTIVE;
				}
				finalAssociationEditPayload.PROPERTY = {remove:updatePropertiesPayload.deletes, create:updatePropertiesPayload.updates};
				delete finalAssociationEditPayload.CREATE;
				delete finalAssociationEditPayload.DELETE;
				//update association
				that.metadataRef.update("ASSOCIATION",finalAssociationEditPayload,null,
						function() {
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED"));
					that.oApplicationFacade.getODataModel().refresh();
				},
				function(err) {
					that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED"), err.responseText);
					that.errorMessages.push({
						"type":"Error",
						"title":that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED"),
						"description":err.responseText
					});
					that.utilsRef.setErrorState(that);
				});
				//that.oApplicationFacade.getODataModel().refresh();
			}
			/*if(updatePropertiesPayload.deletes.length!=0){

                           var flag;
                           for(var i=0;i<updatePropertiesPayload.deletes.length;i++){
                                  flag = 0;
                                  if(that.batchArray.length>0){
                                         for(var j=0;j<that.batchArray.length;j++){
                                                var requestUri = that.batchArray[j].requestUri;
                                                var str = requestUri.substring(0,requestUri.indexOf('('));
                                                var sourceIndicator = requestUri.substring(requestUri.indexOf("'",requestUri.search("SOURCE_INDICATOR"))+1,requestUri.indexOf("'",requestUri.indexOf("'",requestUri.search("SOURCE_INDICATOR"))+1));
                                                var targetIndicator = requestUri.substring(requestUri.indexOf("'",requestUri.search("TARGET_INDICATOR"))+1,requestUri.indexOf("'",requestUri.indexOf("'",requestUri.search("TARGET_INDICATOR"))+1));

                                                if(that.batchArray[j].method=="DELETE" && str=="ASSOCIATIONS" && sourceIndicator==updatePropertiesPayload.deletes[i].SOURCE_INDICATOR && targetIndicator==updatePropertiesPayload.deletes[i].TARGET_INDICATOR){
                                                       flag=1;
                                                }
                                         }
                                  }
                                  if(flag==0){
                                         var entityPropDelete = "/ASSOCIATION_PROPERTIES(TYPE='"+updatePropertiesPayload.deletes[i].TYPE+"',NAME='"+updatePropertiesPayload.deletes[i].NAME+"',VALUE='"+updatePropertiesPayload.deletes[i].VALUE+"',SOURCE_INDICATOR='"+updatePropertiesPayload.deletes[i].SOURCE_INDICATOR+"',TARGET_INDICATOR='"+updatePropertiesPayload.deletes[i].TARGET_INDICATOR+"',IS_ACTIVE="+updatePropertiesPayload.deletes[i].IS_ACTIVE+")";
                                         that.batchArray.push(that.oDataModel.createBatchOperation(entityPropDelete,"DELETE"));
                                  }
                           }
                     }
                     if(updatePropertiesPayload.updates.length!=0){
                           for(var i=0;i<updatePropertiesPayload.updates.length;i++){
                                  that.batchArray.push(that.oDataModel.createBatchOperation("/ASSOCIATION_PROPERTIES","POST",updatePropertiesPayload.updates[i]));
                           }
                     }
                     if(that.batchArray){
                           that.performBatchOperation(that.batchArray);
                     }
                     else{
                            sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED"));
                     }*/
		}
		if(that.viewMode === "associationCreate" || (that.viewMode === "associationEdit" && that.associationData.IS_ACTIVE && !isSaveAndActivate)){
			var sourceIndicatorObj = that.sourceIndicatorModel.getData().INDICATOR.length ? that.sourceIndicatorModel.getData().INDICATOR[0] : that.sourceIndicatorModel.getData().INDICATOR;
			var associationPayload = {TYPE:that.byId("associationTypeSelect").getSelectedItem().getKey(),SOURCE_INDICATOR:sourceIndicator.ID, TARGET_INDICATOR:targetIndicator.ID, IS_ACTIVE:0, CREATED_BY:sourceIndicatorObj.CREATED_BY, CREATED_ON:sourceIndicatorObj.CREATED_ON, CHANGED_BY:null, CHANGED_ON:null};


			that.finalAssociationPayload ={};
			that.finalAssociationPayload.TYPE=associationPayload.TYPE;
			that.finalAssociationPayload.SOURCE_INDICATOR=associationPayload.SOURCE_INDICATOR
			that.finalAssociationPayload.TARGET_INDICATOR=associationPayload.TARGET_INDICATOR
			that.finalAssociationPayload.IS_ACTIVE=associationPayload.IS_ACTIVE
			that.finalAssociationPayload.PROPERTY=propertyPayloadArray;




			var sourceIndicator = this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR.length ? this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR[0] : this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR;
			var targetIndicator = this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR.length ? this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR[0] : this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR;

			that.ODataModel = that.oApplicationFacade.getODataModel();
			that.payload = {TYPE:that.byId("associationTypeSelect").getSelectedItem().getKey(),SOURCE_INDICATOR:sourceIndicator.ID, TARGET_INDICATOR:targetIndicator.ID};


			that.metadataRef.create("ASSOCIATION",that.finalAssociationPayload,null,
					function() {
				sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED"));
				that.oApplicationFacade.getODataModel().refresh();
			},
			function(err) {
				that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED"), err.responseText);
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED_FAILED"),
					"description":err.responseText
				});
				that.utilsRef.setErrorState(that);

			});

			//that.oApplicationFacade.getODataModel().refresh();

			/*that.batchArray.push(that.oDataModel.createBatchOperation("/ASSOCIATIONS","POST",associationPayload))
                     if(propertyPayloadArray){
                           for(var i=0; i<propertyPayloadArray.length;i++){
                                  that.batchArray.push(that.oDataModel.createBatchOperation("/ASSOCIATION_PROPERTIES","POST",propertyPayloadArray[i]));
                           }
                     }
                     if(that.batchArray){
                           that.performBatchOperation(that.batchArray);
                     }
                     else{
                            sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ASSOCIATION_SAVED"));
                     }*/
		}
		that.setFooterOnError();
	},


	saveAssociationHelper : function(sourceIndicator,targetIndicator,isSaveAndActivate){
		var that = this;
		var sourceIndicatorObj = {};
		if(that.sourceIndicatorModel.getData().INDICATOR.length) {
			sourceIndicatorObj = that.sourceIndicatorModel.getData().INDICATOR[0];
		}
		else {
			sourceIndicatorObj = that.sourceIndicatorModel.getData().INDICATOR;
		}
		var associationPayload = {TYPE:that.byId("associationTypeSelect").getSelectedItem().getKey(),SOURCE_INDICATOR:sourceIndicator.ID, TARGET_INDICATOR:targetIndicator.ID, IS_ACTIVE:0, CREATED_BY:sourceIndicatorObj.CREATED_BY, CREATED_ON:sourceIndicatorObj.CREATED_ON, CHANGED_BY:null, CHANGED_ON:null};
		var associationPropertiesPayload = {PROPERTIES:that.getView().byId('propertyNameValueBox').getModel("associationProp").getData().PROPERTIES}
		var updateAssociationPayload = null;

		if((that.viewMode === "associationEdit" && !(that.associationData.IS_ACTIVE)) || (that.viewMode === "associationEdit" && that.associationData.IS_ACTIVE && isSaveAndActivate)){
			var oldAssociationObject = that.formOldObjectForAssociation(sourceIndicator, targetIndicator);
			updateAssociationPayload = that.utilsRef.dirtyBitCheck({
				oldPayload : oldAssociationObject,
				newPayload : associationPayload,
				objectType : "ASSOCIATIONS"
			});

			that.savePropertiesHelper(associationPropertiesPayload, updateAssociationPayload, sourceIndicator, targetIndicator, isSaveAndActivate);
		}
		else if(that.viewMode === "associationCreate" || (that.viewMode === "associationEdit" && that.associationData.IS_ACTIVE)){
			that.savePropertiesHelper(associationPropertiesPayload, updateAssociationPayload, sourceIndicator, targetIndicator);
		}
	},

	saveAssociation: function(isSaveAndActivate) {
		var that = this;
		var sourceIndicator = {};
		var targetIndicator = {};
		if(this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR.length && this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR.length) {
			sourceIndicator = this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR[0];
			targetIndicator = this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR[0];
		}
		else {
			sourceIndicator = this.byId("sourceIndicatorContent").getModel("sourceIndicator").getData().INDICATOR;
			targetIndicator = this.byId("targetIndicatorContent").getModel("targetIndicator").getData().INDICATOR;
		}
		var payload = {};
		if(this.viewMode === "associationEdit") {
			that.saveAssociationHelper(sourceIndicator,targetIndicator,isSaveAndActivate);
		}
		else if(that.viewMode === "associationCreate") {
			if(targetIndicator==null){
				that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_KPI_TO_ASSOCIATE"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("SELECT_A_KPI_TO_ASSOCIATE")
				});
				that.utilsRef.setErrorState(that);

				that.byId("selectedKpiOpiId").setValueState(sap.ui.core.ValueState.Error);

			}
			else if(targetIndicator.length==0){
				that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_KPI_TO_ASSOCIATE"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oApplicationFacade.getResourceBundle().getText("SELECT_A_KPI_TO_ASSOCIATE")
				});
				that.utilsRef.setErrorState(that);
				that.byId("selectedKpiOpiId").setValueState(sap.ui.core.ValueState.Error);

			}
			else{
				that.saveAssociationHelper(sourceIndicator,targetIndicator,isSaveAndActivate);
				that.oApplicationFacade.getODataModel().refresh();
			}

		}
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for oController one!).
	 */
	onBeforeRendering: function() {
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one oController SAPUI5 controls get after being rendered.
	 */
	onAfterRendering: function() {
	},

	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,false);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 */
	onExit: function() {

	}

});
