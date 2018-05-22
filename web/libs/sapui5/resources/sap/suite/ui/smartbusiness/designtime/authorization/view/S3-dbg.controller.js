/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.authorization.view.S3", {

	onInit : function() {
		var that = this;
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		var view = this.getView();
		this.settingModel = sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");
		this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
				var contextPath = oEvent.getParameter("arguments").contextPath;
				view.setBindingContext(context);
				that.getUsersAndRoles(view.getBindingContext().getProperty("ID") || contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,''));
			}
		}, this);
		var that = this;
		this.oHeaderFooterOptions =
			 { 
				bSuppressBookmarkButton: {},
				oEditBtn : {
					sI18nBtnTxt : "S3_EDIT",
					onBtnPressed : function(evt) {
					sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"authorizeSBEvaluation", route:"subDetail", context: view.getBindingContext().getPath().split("/")[1]});
				},
				bEnabled : false, // default true
			},
		};
		
	},
	getUsersAndRoles:function(id){
		var that = this;
		this.byId("users").getBinding("content").filter([new sap.ui.model.Filter("ID", "EQ",id),new sap.ui.model.Filter("TYPE", "EQ","USER")]);
		this.byId("roles").getBinding("content").filter([new sap.ui.model.Filter("ID", "EQ",id),new sap.ui.model.Filter("TYPE", "EQ","ROLE")]);
		this.byId("users").getBinding("content").attachDataReceived(function(data){
			that.byId("usersTab").setCount(data.getSource().getLength());
			that.byId("usersTitle").setText(that.oApplicationFacade.getResourceBundle().getText("AUTH_USERS")+" ("+data.getSource().getLength()+")");
			that.byId("usersTitle").rerender();
		});
		this.byId("roles").getBinding("content").attachDataReceived(function(data){
			that.byId("rolesTab").setCount(data.getSource().getLength());
			that.byId("rolesTitle").setText(that.oApplicationFacade.getResourceBundle().getText("ROLES")+" ("+data.getSource().getLength()+")");
		});
	},
	formatId: function(id){
		return this.oApplicationFacade.getResourceBundle().getText("ID")+" : "+id;
	},
	formatOwner: function(owner){
		return sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "OWNER", owner);
	},
	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},
	formatProperties: function(name, value) {
		return ((this.getView().byId("properties").getItems().length > 1) ? (', ' + name + ' : ' + value) : (name + ' : ' + value));
	},
	formatFavoriteMark: function(favMark) {
        return ((favMark) ? true : false);
	},
	
	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,false);
	}
});
