/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");

sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.association.view.S2", {

	onInit: function() {
		var that = this;
		this.oApplicationFacade.masterListControllerRef = this;
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
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
			title :that.oApplicationFacade.getResourceBundle().getText("SETTINGS_SB"),
		});
		this.settingModel = sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");
		this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");
		that.oApplicationFacade.getODataModel().setSizeLimit(100000);
		that.selectedGroupItemKey = "workspace";
		that.selectedGroupItemIndex = 0;
		that.lastSavedIndex = 0;
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
			};
			 
			this.metadataRef.getSessionUser({async:true, success:sessionUserFetchCallBack, error:sessionUserFetchErrCallBack, model:this.oApplicationFacade.getODataModel()});
		}
		this.byId("list").getBinding("items").filter(new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 1));
		
	},
	createFilterOptions: function() {
		var that = this; 
		var filterOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("filterOptionsDialog"),
			filterItems: [
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
			            	  that.setFiltering(evt.getParameter("filterItems"));
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
		return {
			sI18NMasterTitle : "MASTER_TITLE",
			onBack : function() {
				window.history.back();
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
			}
		};
	},

	formatTitle: function(title) {
		return (title || "");
	},

	formatAssociationCount: function(sourceCount,targetCount) {
		if(sourceCount==null && targetCount==null){
			return 0;
		}
		if(sourceCount==null){
			return parseInt(targetCount);
		}
		if(targetCount==null){
			return parseInt(sourceCount);
		}
		return (parseInt(sourceCount)+parseInt(targetCount));
	},

	formatID: function(id,type) {
		if(type == "KPI") {
			return (this.oApplicationFacade.getResourceBundle().getText(type, id));
		}
		else {
			return (this.oApplicationFacade.getResourceBundle().getText(type) + ": " + id);
		}
	},
	setVisibility : function(){
		return sap.suite.ui.smartbusiness.lib.AppSetting.setVisibilty();
	},
	formatOwnerName: function(ownerName) {
		return (this.oApplicationFacade.getResourceBundle().getText("ADDED_BY",ownerName));
	},

	formatState: function(state) {
		return (state ? "ACTIVE" : "DRAFT");
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
		var list = this.getView().byId("list");
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
		var that = this
		var filtersArray = [];
		var list = this.getView().byId("list");

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
	
	onExit: function() {
		var hashObj = hasher || window.hasher;
		if(!(hashObj.getHash())) {
			sap.suite.ui.smartbusiness.lib.Util.utils.backToHome();
		}
	},
	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,true);
	}
});