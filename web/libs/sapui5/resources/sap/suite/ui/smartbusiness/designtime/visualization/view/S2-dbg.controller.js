/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");

sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.visualization.view.S2", {

	onInit: function() {
		var that = this;
		that.selectedGroupItemKey = "workspace";
		that.selectedGroupItemIndex = 0;
		that.lastSavedIndex = 0;
		this.oApplicationFacade.masterListControllerRef = this;
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
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
		this.settingModel =sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
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
		that.lastSortingOrder =  {indicatorTextOrder:null, order:new sap.ui.model.Sorter("CHANGED_ON",true,null)};
		
		this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
		this.confRef = sap.suite.ui.smartbusiness.Configuration;
		this.constantsRef = this.confRef.Constants;
		this.env = 0;
		
		// Fetch System Environment info => Either running on SAP env or CUST env
		function sysInfoFetchCallBack(d) {
			that.env = d;
		}
		
		function sysInfoFetchErrCallBack(d,s,x) {
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_SYS_INFO"), d.response.body);
		}
		
		this.metadataRef.getSystemInfo({async:false, success:sysInfoFetchCallBack, error:sysInfoFetchErrCallBack, model:this.oDataModel});

		if(this.env) {
			this.byId("list").getBinding("items").filter([new sap.ui.model.Filter("IS_ACTIVE","EQ",1)]);	
		}	
		else {
			this.byId("list").getBinding("items").filter([new sap.ui.model.Filter("NAMESPACE",sap.ui.model.FilterOperator.NE,"."), new sap.ui.model.Filter("IS_ACTIVE","EQ",1)],false);
		}
		
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
		
		this.setSorting("changedate", true);
		
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
						        	 text: that.oApplicationFacade.getResourceBundle().getText("FAVORITE"),
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
							that.byId("visualizationInfo").setText(infoBarText);	
						}
						else {
							that.byId("visualizationInfo").setText("");
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
		                            {text:that.oApplicationFacade.getResourceBundle().getText("BY_INDICATOR"),key:"indicator", index:1},
		                            {text:that.oApplicationFacade.getResourceBundle().getText("BY_OWNER"),key:"owner", index:2},
		                            {text:that.oApplicationFacade.getResourceBundle().getText("NONE"),key:"none", index:3},
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
		var obj = {
				sI18NMasterTitle : that.metadataRef.getPlatform() == that.constantsRef.Platform.ABAP ? "ALL_EVALUATIONS" : "MASTER_TITLE", 
				onBack: function() {
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
				},
			};
		if(that.metadataRef.getPlatform() == that.constantsRef.Platform.ABAP){
			obj.onAddPress = function(evt){
				sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"addEvaluation", context:""});
			}
		}
		return obj; 
	},
	formatEvaluationHeader:function(indicatorTitle,evaluationTitle){
		var that = this;
		if(indicatorTitle==null && evaluationTitle!=null){
			return(that.oApplicationFacade.getResourceBundle().getText("TITLE_UNAVAILABLE")+"- "+evaluationTitle);
		}
		else if(indicatorTitle!=null && evaluationTitle==null){
			return(indicatorTitle+" -"+that.oApplicationFacade.getResourceBundle().getText("TITLE_UNAVAILABLE"));
		}
		else if(indicatorTitle==null && evaluationTitle==null){
			return (that.oApplicationFacade.getResourceBundle().getText("TITLE_UNAVAILABLE")+" - "+that.oApplicationFacade.getResourceBundle().getText("TITLE_UNAVAILABLE"));
		}
		else{
			return (indicatorTitle+" - "+evaluationTitle);
		}
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
		default: groupTitle = that.oApplicationFacade.getResourceBundle().getText("ALL_EVALUATIONS");
		}
		return {
			key: groupTitle,
			text: groupTitle
		}
		//return {text: ("KPI: " + context.getProperty("INDICATOR")), key: context.getProperty("INDICATOR")}; 
	},
	
	setGrouping: function(key, groupDescending) {
		var that = this;
		groupDescending = groupDescending || false;
		var list = that.getView().byId("list");
		var groupOption;
		if(key == "workspace") {
			groupOption = new sap.ui.model.Sorter("MANUAL_ENTRY",groupDescending,function(context){
				var indicator_type = context.getProperty("MANUAL_ENTRY");
				var groupTitle = "";
				switch(indicator_type) {
				case 1: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");
				break;
				case 0: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");
				break;
				default: groupTitle = that.oApplicationFacade.getResourceBundle().getText("ALL_EVALUATIONS");
				}
				return {
					key: groupTitle,
					text: groupTitle
				}
			})
		} 
		else if(key == "indicator") {
			groupOption = new sap.ui.model.Sorter("INDICATOR",groupDescending,function(context){
				return {
					key: context.getProperty("INDICATOR"),
					text: ("KPI: " + context.getProperty("INDICATOR"))
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
		else if(key == "none") {
			groupOption = null;
		}
		
		if(that.lastSortingOrder.indicatorTextOrder && that.lastSortingOrder.order && key != "none"){
			list.getBinding("items").sort([groupOption,that.lastSortingOrder.order,that.lastSortingOrder.indicatorTextOrder],true);
		}
		else if(!that.lastSortingOrder.indicatorTextOrder && that.lastSortingOrder.order && key != "none"){
			list.getBinding("items").sort([groupOption,that.lastSortingOrder.order],true);
		}
		else{
			if(that.lastSortingOrder.indicatorTextOrder && that.lastSortingOrder.order){
				list.getBinding("items").sort([that.lastSortingOrder.indicatorTextOrder, that.lastSortingOrder.order]);
			}
			else{
				list.getBinding("items").sort([that.lastSortingOrder.order]);
			}
		}
		this.lastGroupingOption = groupOption;
	},
	
	setFiltering: function(items) {
		var filtersArray = [];
		var list = this.getView().byId("list");
		
		var filterObject = {
			"self_created": (new sap.ui.model.Filter("CREATED_BY", sap.ui.model.FilterOperator.EQ, this.oApplicationFacade.currentLogonHanaUser)),
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
		var sortOrder,sortByIndicator;
		if(key == "changedate") {
			sortOrder = new sap.ui.model.Sorter("CHANGED_ON",groupDescending,null);
		}
		else if(key == "name") {
			sortOrder = new sap.ui.model.Sorter("TITLE",groupDescending,null);
			sortByIndicator = new sap.ui.model.Sorter("INDICATOR_TITLE",groupDescending,null);
		}
		else if(key == "id") {
			sortOrder = new sap.ui.model.Sorter("ID",groupDescending,null);
		}
		
		if(that.lastGroupingOption){
			if(sortByIndicator){
				list.getBinding("items").sort([that.lastGroupingOption,sortByIndicator,sortOrder],true); 
			}
			else{
				list.getBinding("items").sort([that.lastGroupingOption,sortOrder],true); 
			}
		}
		else{
			if(sortByIndicator){
				list.getBinding("items").sort([sortByIndicator,sortOrder]);
			}
			else{
				list.getBinding("items").sort([sortOrder]);
			}
		}
		this.lastSortingOrder = {indicatorTextOrder:sortByIndicator, order:sortOrder};
	},
	
	formatChipCount: function(chipCount) {
		return chipCount || 0;
	},
	formatTile:function(chipCount){
		if (chipCount==1)
			return this.oApplicationFacade.getResourceBundle().getText("Tile");
		else 
			return this.oApplicationFacade.getResourceBundle().getText("Tiles");
	},
	
	applySearchPatternToListItem : function(oItem, sfilterPattern) {
		return sap.suite.ui.smartbusiness.lib.Util.utils.applySearchPatternToListItem.apply(this,arguments);
	
	},
	
	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,true);
	},
	
	onExit: function() {
		var hashObj = hasher || window.hasher;
		if(!(hashObj.getHash())) {
			sap.suite.ui.smartbusiness.lib.Util.utils.backToHome();
		}
	}
});