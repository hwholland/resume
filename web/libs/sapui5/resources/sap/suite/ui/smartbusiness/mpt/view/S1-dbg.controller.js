/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.mpt.view.S1", {

	onInit : function() {
		var that = this;
		var view = this.getView();
		this.dateFormatter = sap.ui.core.format.DateFormat.getInstance({style:"long"});
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "fullscreen") {
				var context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
				view.setBindingContext(context);
				// Make sure the master is here
			}
		}, this);
		var that = this;
		that.selectedTile = null;
		that.runtimeRef = sap.suite.ui.smartbusiness.Adapter.getService("RuntimeServices");
		that.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		sap.sb_mpt = that;
		that.byId("tileGrid").getBinding("items").attachDataReceived(function() {
			that.updateChipsCount();
		});
	},

	onAfterRendering: function() {

	},
	
	getHeaderFooterOptions : function() {
		var that = this;
		
		function tileDeleteCallBack() {
			that.getView().getModel().refresh();
			that.selectedTile = null;
			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
		}
		
		function tileDeleteErrCallBack(d) {
			that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("CANNOT_DELETE_TILE"), d.response.body);
		}
		
		this.oHeaderFooterOptions = { 
				bSuppressBookmarkButton: {}, 
				onBack : function(){
					window.history.back();
				},
				oEditBtn : {
					sI18nBtnTxt : "DELETE_TILE",
					onBtnPressed : function(evt) {
						var selectedTiles = that.byId("tileGrid").getSelectedItems();
						if(selectedTiles.length) {
							that.handleDelete(selectedTiles);
						}
						else {
							that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_DELETE"));
						}
					},
					bEnabled : false, // default true
				}
		};
		return this.oHeaderFooterOptions;
	},
	
	_notifyShell : function(chipId) {
        var oService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
        if(oService) {
            oNotifyShell = oService("LaunchPage");
            if(oNotifyShell && oNotifyShell.onCatalogTileAdded) {
                oNotifyShell.onCatalogTileAdded(chipId);
            }
        }
    },
	
	handleDelete: function(tiles) {
		var that = this;
		var obj = [];
		for(var i=0,l=tiles.length; i<l; i++) {
			obj.push({id:tiles[i].getBindingContext().getObject().id});
		}
		
		function tileDeleteCallBack(res) {
			var chipId = null;
			try {
				chipId = JSON.parse(res).chipId;
			}
			catch(e) {
				jQuery.sap.log.error("Failed to parse the response");
			}
			if(chipId) {
				that._notifyShell(chipId);
			}
			that.getView().getModel().refresh();
//			that.selectedTile = null;
			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
		}
		
		function tileDeleteErrCallBack(d) {
			that.utilsRef.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("CANNOT_DELETE_TILE"), d.response.body);
		}
		
		sap.m.MessageBox.show(
				that.oApplicationFacade.getResourceBundle().getText("WANT_TO_DELETE_SELECTED_TILE"),
				"sap-icon://hint",
				that.oApplicationFacade.getResourceBundle().getText("DELETE"),
				[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
				function(evt){
					if(evt=="OK"){
						that.runtimeRef.handlePersonalizedTileDelete(obj, tileDeleteCallBack, tileDeleteErrCallBack);
					}
					if(evt=="CANCEL"){

					}
				}
		);
	},
	
	updateChipsCount: function() {
		var count = this.byId("tileGrid").getBinding("items").getLength();
		this.byId("chipsTableLabel").setText(this.oApplicationFacade.getResourceBundle().getText("PERS_TILE") + " (" + (count || 0) + ")");
	},
	
	_evalValueMapping: function() {
		return {
			"TA" : "TARGET",
			"CL" : "CRITICAL_LOW",
			"WL" : "WARNING_LOW",
			"CH" : "CRITICAL_HIGH",
			"WH" : "WARNING_HIGH"
		}
	},
	
	prepareFilterArray: function(filters) {
		var groupFilters = {};
		var filtersArr = [];
		var key = "";
		for(var i=0,l=filters.length; i<l; i++) {
			if(filters[i].OPERATOR != 'BT') {
				key = filters[i].NAME + "_" + filters[i].OPERATOR;
				if(groupFilters[key]) {
					groupFilters[key].VALUE_1.push(filters[i].VALUE_1);
				}
				else {
					groupFilters[key] = {};
					groupFilters[key].NAME = filters[i].NAME;
					groupFilters[key].OPERATOR = filters[i].OPERATOR;
					groupFilters[key].VALUE_1 = [filters[i].VALUE_1];
					groupFilters[key].VALUE_2 = "";
				}
			}
			else {
				key = filters[i].NAME + "_" + filters[i].OPERATOR + "_" + filters[i].VALUE_1 + "_" + filters[i].VALUE_2;
				groupFilters[key] = {};
				groupFilters[key].NAME = filters[i].NAME;
				groupFilters[key].OPERATOR = filters[i].OPERATOR;
				groupFilters[key].VALUE_1 = [filters[i].VALUE_1];
				groupFilters[key].VALUE_2 = [filters[i].VALUE_2];
			}
			 
		}
		
		for(var filter in groupFilters) {
			if(groupFilters.hasOwnProperty(filter)) {
				filtersArr.push(groupFilters[filter]);
			}
		}
		return filtersArr;
	},
	
	getTile: function(id,context){
		var that = this;
		var tileContents = [];
		var rBundle = that.oApplicationFacade.getResourceBundle();
		var chipObj = context.getObject();
		var config = {}, tileProperties = {}, evalValues = [], evaluation = {}, additionalFilters = [], addlFilters = [];
		try {
			config = JSON.parse(JSON.parse(chipObj.configuration).tileConfiguration);
			tileProperties = JSON.parse(config.TILE_PROPERTIES);
			evalValues = JSON.parse(config.EVALUATION_VALUES);
			evaluation = JSON.parse(config.EVALUATION);
			additionalFilters = JSON.parse(config.ADDITIONAL_FILTERS);
		}
		catch(e) {
			//sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_PARSE_CHIP_INFO"), (that.oApplicationFacade.getResourceBundle().getText("TILE_TITLE") + " : " + context.getObject().title + "\n" +  that.oApplicationFacade.getResourceBundle().getText("TILE_SUBTITLE") + " : " + context.getObject().description));
			config = config || {};
			tileProperties = tileProperties || {};
			evalValues = evalValues || [];
			evaluation = evaluation || {}; 
			additionalFilters = additionalFilters || [];
			//throw new Error("parsing of Chip Failed");
			jQuery.sap.log.error("parsing of Chip Failed");
		}
		
		var tileType = chipObj.tileType;
		var tileContentByTileType = {
				"NT": function() {
						return new sap.suite.ui.commons.NumericContent({value:"9999", size:sap.suite.ui.commons.InfoTileSize.Auto, scale:"K", valueColor:"Error"});
					},
				"CT": function() {
						return new sap.suite.ui.commons.ComparisonChart({
							scale: "M",
							size:sap.suite.ui.commons.InfoTileSize.Auto,
							data: [new sap.suite.ui.commons.ComparisonData({title:rBundle.getText("USA"), value: 1550}),
							       new sap.suite.ui.commons.ComparisonData({title:rBundle.getText("INDIA"), value: 219.2}),
							       new sap.suite.ui.commons.ComparisonData({title:rBundle.getText("GERMANY"), value: 66.46})]
							});
					},
				"TT" : function(){
						return new sap.suite.ui.commons.MicroAreaChart({
							size:sap.suite.ui.commons.InfoTileSize.Auto,
							width: "164px",
							height: "74px",
							minXValue: 0,
							maxXValue: 100,
							minYValue: 0,
							maxYValue: 100,
							firstXLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:rBundle.getText("JAN_01"), color:"Neutral"}),
							lastXLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:rBundle.getText("JAN_31"), color:"Neutral"}),
							firstYLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"3 M", color:"Error"}),
							lastYLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"23 M", color:"Good"}),
							target: new sap.suite.ui.commons.MicroAreaChartItem({
								points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:30}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:40}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:90})]
							}),
							innerMinThreshold: new sap.suite.ui.commons.MicroAreaChartItem({color:"Good"}),
							innerMaxThreshold: new sap.suite.ui.commons.MicroAreaChartItem({color:"Good"}),
							minThreshold:  new sap.suite.ui.commons.MicroAreaChartItem({
								color:"Error",
								points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:40}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:50}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:100})]
							}),
							maxThreshold:  new sap.suite.ui.commons.MicroAreaChartItem({
								color:"Error",
								points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:20}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:30}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:70})]
							}),
							chart: new sap.suite.ui.commons.MicroAreaChartItem({
								points:[new sap.suite.ui.commons.MicroAreaChartPoint({x:0,y:0}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:30,y:40}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:60,y:50}),
								        new sap.suite.ui.commons.MicroAreaChartPoint({x:100,y:100})]
							}),
						});
				},
			"AT": function(){
					return new sap.suite.ui.commons.BulletChart({
						scale: "M",
						size:sap.suite.ui.commons.InfoTileSize.Auto,
						minValue: 0,
						maxvalue: 312,
						targetValue: 150,
						actual: new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
						thresholds: [new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
						             new sap.suite.ui.commons.BulletChartData({value:200, color:"Critical"})]
					});
				},
			"CM": function() {
					return new sap.suite.ui.commons.ComparisonChart({
						scale: "M",
						size:sap.suite.ui.commons.InfoTileSize.Auto,
						data: [new sap.suite.ui.commons.ComparisonData({title:rBundle.getText("MEASURE_1"), value: 34, color: "Good"}),
						       new sap.suite.ui.commons.ComparisonData({title:rBundle.getText("MEASURE_2"), value: 125, color: "Error"}),
						       new sap.suite.ui.commons.ComparisonData({title:rBundle.getText("MEASURE_3"), value: 97, color: "Critical"})]
					});
				},
			"HT": function() {
					return new sap.suite.ui.commons.HarveyBallMicroChart({
						total:100,
						size:sap.suite.ui.commons.InfoTileSize.Auto,
						scale: "M",
						items:[new sap.suite.ui.commons.HarveyBallMicroChartItem({
						    	   fraction:30,
						    	   color: "Good"
						       })]
					});
				}
		};
		
		var valueSource = "COLUMN_NAME";
		if(evaluation.VALUES_SOURCE == "FIXED") {
			valueSource = "FIXED";
		}
		
		var evaluationValuesBox = new sap.m.VBox();
		for(var i=0,l=evalValues.length; i<l; i++) {
			if(evalValues[i].TYPE && that._evalValueMapping()[evalValues[i].TYPE]) {
				evaluationValuesBox.addItem(new sap.m.Text({text : rBundle.getText(that._evalValueMapping()[evalValues[i].TYPE]) + " - " + evalValues[i][valueSource]}).addStyleClass("evalValItems"));
			}
		}
		
		if(additionalFilters && additionalFilters.length) {
			addlFilters = that.prepareFilterArray(additionalFilters) || [];
		}
		var additionalFiltersBox = new sap.m.VBox();
		for(var i=0,l=addlFilters.length; i<l; i++) {
			if(jQuery.sap.getUriParameters().get("op")) {
				additionalFiltersBox.addItem(new sap.m.Text({text : addlFilters[i].NAME + " " + addlFilters[i].OPERATOR + " " + addlFilters[i].VALUE_1.join(",")}).addStyleClass("evalValItems"));
			}
			else {
				additionalFiltersBox.addItem(new sap.m.Text({text : addlFilters[i].NAME + " - " + addlFilters[i].VALUE_1.join(",")}).addStyleClass("evalValItems"));
			}
			
		}
		
		var tile = new sap.suite.ui.commons.GenericTile({
			//layoutData: new sap.ui.layout.GridData({span:"L4 M6 S12"}),
			size:sap.suite.ui.commons.InfoTileSize.Auto, 
			header: context.getProperty("title"),
			subheader: context.getProperty("description"),
			customData: [new sap.ui.core.CustomData({key:"tileType",value:context.getProperty("tileType")})],
//			tileContent: new sap.suite.ui.commons.TileContent({content:tileContent}),
			press: function(evt) {
//				that.selectedTile = evt.getSource();
//				var tiles = that.byId("tileGrid").getContent();
//				for(var i=0,l=tiles.length; i<l; i++) {
//					tiles[i].removeStyleClass("sbSelectedTile");
//				}
//				that.selectedTile.addStyleClass("sbSelectedTile");
			}
		}).addStyleClass("sbTile");
		
		if(tileType && (tileType.split("-").length == 2)) {
			 tile.setFrameType("TwoByOne");
		}
		
		if(tileType=="NT") {
			tileContents.push(tileContentByTileType["NT"]());
		}
		else if(tileType=="CT") {
			tileContents.push(tileContentByTileType["CT"]());
		}
			
		else if(tileType=="AT") {
			tileContents.push(tileContentByTileType["AT"]());
		}
			
		else if(tileType=="TT") {
			tileContents.push(tileContentByTileType["TT"]());
		} 
		
		else if(tileType=="HT"){
			tileContents.push(tileContentByTileType["HT"]());
		}
		
		else if(tileType=="CM") {
			tileContents.push(tileContentByTileType["CM"]());
		}
		else if(tileType == "DT-AT") {
            tileContents.push(tileContentByTileType["NT"]());
            tileContents.push(tileContentByTileType["AT"]());
        }
        else if(tileType == "DT-CT") {
        	tileContents.push(tileContentByTileType["NT"]());
            tileContents.push(tileContentByTileType["CT"]());
        }
        else if(tileType == "DT-CM") {
        	tileContents.push(tileContentByTileType["NT"]());
            tileContents.push(tileContentByTileType["CM"]());
        }
        else if(tileType == "DT-TT") {
        	tileContents.push(tileContentByTileType["NT"]());
            tileContents.push(tileContentByTileType["TT"]());
        }
        else if(tileType == "DT-HT") {
        	tileContents.push(tileContentByTileType["NT"]());
            tileContents.push(tileContentByTileType["HT"]());
        }
		
		tile.removeAllTileContent();
		
		for(var i=0,l=tileContents.length; i<l; i++) {
			tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContents[i], size: sap.suite.ui.commons.InfoTileSize.Auto}));
		}
		
		//return tile;
		var deleteButton = new sap.m.Button({
			icon:"sap-icon://sys-cancel",
			type:sap.m.ButtonType.Transparent,
			press: function(evt) {
				that.handleDelete(this);
			}
		});
		
		var cells = [tile,
		             evaluationValuesBox,
		             additionalFiltersBox,
		             new sap.m.Text({text: this.dateFormatter.format(new Date(chipObj.createdOn)), visible:true}),
		             //deleteButton
		             ];

		var columnListItem = new sap.m.ColumnListItem({
			type: "Inactive",
			cells: cells
		}); 
		
		return columnListItem;
	},
	
	searchTile: function(evt) {
		var searchValue = "'" + evt.getParameter("query").toLowerCase() + "'";
		var oFilterTitle = new sap.ui.model.Filter("tolower(title)", sap.ui.model.FilterOperator.Contains,searchValue);
		var oFilterSubtitle = new sap.ui.model.Filter("tolower(description)", sap.ui.model.FilterOperator.Contains,searchValue);
		var oBinding = this.byId("tileGrid").getBinding("items");
		oBinding.filter(new sap.ui.model.Filter([oFilterTitle, oFilterSubtitle], false));
	},
	
	setSorting: function(key, groupDescending) {
		groupDescending = groupDescending || false;
		var list = this.getView().byId("tileGrid");
		if(key == "tileType") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("tileType",groupDescending,null)]); 
		}
		else if(key == "title") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("title",groupDescending,null)]);
		}
		else if(key == "subtitle") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("description",groupDescending,null)]);
		}
		else if(key == "creation") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("createdOn",groupDescending,null)]);
		}
		else if(key == "none") {
			list.getBinding("items").sort([]);
		}
	},

	setFiltering: function(items) {
		var filtersArray = [];
		var list = this.getView().byId("tileGrid");

		var filterObject = {
				"NT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'NT')),
				"CT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'CT')),
				"AT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'AT')),
				"TT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'TT')),
				"CM": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'CM')),
				"HT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'HT')),
				"DT-CM" : (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-CM')), 
                "DT-CT" :(new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-CT')),
                "DT-AT" :(new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-AT')),
                "DT-TT" :(new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-TT'))
		};
		
		filtersArray = sap.suite.ui.smartbusiness.lib.Util.utils.getFilterArray(items, filterObject);
		
		if(filtersArray.length) {
			list.getBinding("items").filter(new sap.ui.model.Filter(filtersArray, true));
		}
		else {
			list.getBinding("items").filter(filtersArray);
		}
		
	},
	
	setFilteringN: function(items) {
		var filtersArray = [];
		var list = this.getView().byId("tileGrid");

		var filterObject = {
				"NT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'NT')),
				"CT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'CT')),
				"AT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'AT')),
				"TT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'TT')),
				"CM": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'CM')),
				"HT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'HT')),
				"DT-CM" : (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-CM')), 
                "DT-CT" :(new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-CT')),
                "DT-AT" :(new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-AT')),
                "DT-TT" :(new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-TT'))
		};
		
		filtersArray = this.getFilterArrayN(items, filterObject);
		
		if(filtersArray.length) {
			list.getBinding("items").filter(new sap.ui.model.Filter(filtersArray, true));
		}
		else {
			list.getBinding("items").filter(filtersArray);
		}
	},
	
	getFilterArrayN: function(items, filterObject) {
  	  var filtersArray = [];
  	  var filters = {}, key, pKey;
  	  for(var i=0,l=items.length; i<l; i++) {
  		  key = items[i].getDependents()[0].getText();
  		  pKey = "tileType";
  		  filters[pKey] = filters[pKey] || [];
  		  filters[pKey].push(filterObject[key]);
  	  } 

  	  for(var filter in filters) {
  		  filtersArray.push(new sap.ui.model.Filter(filters[filter], false));
  	  }
  	  return filtersArray;
    },

	
	handleSortPress: function() {
		var that = this;
		this.sortOptionsDialog = this.sortOptionsDialog || new sap.m.ViewSettingsDialog({
			id: this.createId("sortOptionsDialog"),
			sortItems: [
					new sap.m.ViewSettingsItem({
						text: that.oApplicationFacade.getResourceBundle().getText("TILE_TYPE"),
						key: "tileType"
					}), 
					new sap.m.ViewSettingsItem({
						text: that.oApplicationFacade.getResourceBundle().getText("TITLE"),
						key: "title"
					}),
					new sap.m.ViewSettingsItem({
						text: that.oApplicationFacade.getResourceBundle().getText("SUBTITLE"),
						key: "subtitle"
					}),
					new sap.m.ViewSettingsItem({
						text: that.oApplicationFacade.getResourceBundle().getText("CREATION_TIME"),
						key: "creation"
					}),
					new sap.m.ViewSettingsItem({
						text: that.oApplicationFacade.getResourceBundle().getText("NONE"),
						key: "none"
					})
					],
			confirm : function(evt) {
				if(evt.getParameter("sortItem")) {
					that.setSorting(evt.getParameter("sortItem").getKey(), evt.getParameter("sortDescending"));
            	}
			}
		});
		this.sortOptionsDialog.open();
	},
	
	handleFilterPressN: function() {
		var that = this;
		this.filterOptionsDialog = this.filterOptionsDialog || new sap.m.SelectDialog({
			id: this.createId("filterOptionsDialog"),
			title: "Filter By",
			multiSelect: true,
			rememberSelections: true,
			items: [
			  new sap.m.StandardListItem({
	        	  title: that.oApplicationFacade.getResourceBundle().getText("NUMERIC_TILE"),
	        	  dependents: [ new sap.m.Label({text:"NT"})]
	        	  //key: "NT"
	          }),
	          new sap.m.StandardListItem({
	        	  title: that.oApplicationFacade.getResourceBundle().getText("COMPARISON_TILE"),
	        	  dependents: [ new sap.m.Label({text:"CT"})]
	        	  //key: "CT"
	          }),
	          new sap.m.StandardListItem({
	        	  title: that.oApplicationFacade.getResourceBundle().getText("TREND_TILE"),
	        	  dependents: [ new sap.m.Label({text:"TT"})]
	        	  //key: "TT"
	          }),
	          new sap.m.StandardListItem({
	        	  title: that.oApplicationFacade.getResourceBundle().getText("ACTUAL_VS_TARGET_TILE"),
	        	  dependents: [ new sap.m.Label({text:"AT"})]
	        	  //key: "AT"
	          }),
	          new sap.m.StandardListItem({
	        	  title: that.oApplicationFacade.getResourceBundle().getText("COMPARISON_MM_TILE"),
	        	  dependents: [ new sap.m.Label({text:"CM"})]
	        	  //key: "CM"
	          }),
	          new sap.m.StandardListItem({
	        	  title: that.oApplicationFacade.getResourceBundle().getText("HARVEY_BALL_TILE"),
	        	  dependents: [ new sap.m.Label({text:"HT"})]
	        	  //key: "HT"
	          }),
              new sap.m.StandardListItem({
            	  title: that.oApplicationFacade.getResourceBundle().getText("DUAL_COMPARISON_TILE"),
            	  dependents: [ new sap.m.Label({text:"DT-CT"})]
            	  //key: "DT-CT"
              }),
              new sap.m.StandardListItem({
            	  title: that.oApplicationFacade.getResourceBundle().getText("DUAL_COMPARISON_MM_TILE"),
            	  dependents: [ new sap.m.Label({text:"DT-CM"})]
            	  //key: "DT-CM"
              }),
              new sap.m.StandardListItem({
            	  title: that.oApplicationFacade.getResourceBundle().getText("DUAL_DEVIATION_TILE"),
            	  dependents: [ new sap.m.Label({text:"DT-AT"})]
            	  //key: "DT-AT"
              }),
              new sap.m.StandardListItem({
            	  title: that.oApplicationFacade.getResourceBundle().getText("DUAL_TREND_TILE"),
            	  dependents: [ new sap.m.Label({text:"DT-TT"})]
            	  //key: "DT-TT"
              })
			 ],
			 confirm: function(evt) {
				 var infoBarText = "";
				 var selectedFilters = evt.getParameter("selectedItems");

				 that.setFilteringN(selectedFilters);

				 if(selectedFilters && selectedFilters.length) {
					 var filterObj = {};
					 for(var i=0,l=selectedFilters.length; i<l; i++) {
						 var key = selectedFilters[i].getDependents()[0].getText();
						 filterObj[key] = filterObj[key] || "";
						 filterObj[key] += (filterObj[key]) ? (",") : "";
						 filterObj[key] += selectedFilters[i].getTitle(); 
					 }

					 for(var filter in filterObj) {
						 if(filterObj.hasOwnProperty(filter)) {
							 infoBarText += (infoBarText) ? ", " : "";
							 infoBarText += filterObj[filter];
						 }
					 }
					 infoBarText = that.oApplicationFacade.getResourceBundle().getText("FILTERED_BY") + " : " + infoBarText;
					 that.byId("filterToolbar").setVisible(true);
					 that.byId("mptInfo").setText(infoBarText);	
				 }
				 else {
					 that.byId("mptInfo").setText("");
					 that.byId("filterToolbar").setVisible(false);
				 }

			 }
		});
		this.filterOptionsDialog.open();
	},
	
	handleFilterPress: function() {
		var that = this;
		this.filterOptionsDialog = this.filterOptionsDialog || new sap.m.ViewSettingsDialog({
			id: this.createId("filterOptionsDialog"),
			filterItems: [
			              new sap.m.ViewSettingsFilterItem({
			            	  text: that.oApplicationFacade.getResourceBundle().getText("TILE_TYPE"),
			            	  key: "tileType",
			            	  items: [
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("NUMERIC_TILE"),
			            	        	  key: "NT"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("COMPARISON_TILE"),
			            	        	  key: "CT"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("TREND_TILE"),
			            	        	  key: "TT"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("ACTUAL_VS_TARGET_TILE"),
			            	        	  key: "AT"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("COMPARISON_MM_TILE"),
			            	        	  key: "CM"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("HARVEY_BALL_TILE"),
			            	        	  key: "HT"
			            	          }),
                                      new sap.m.ViewSettingsItem({
                                          text: that.oApplicationFacade.getResourceBundle().getText("DUAL_COMPARISON_TILE"),
                                          key: "DT-CT"
                                      }),
                                      new sap.m.ViewSettingsItem({
                                          text: that.oApplicationFacade.getResourceBundle().getText("DUAL_COMPARISON_MM_TILE"),
                                          key: "DT-CM"
                                      }),
                                      new sap.m.ViewSettingsItem({
                                          text: that.oApplicationFacade.getResourceBundle().getText("DUAL_DEVIATION_TILE"),
                                          key: "DT-AT"
                                      }),
                                      new sap.m.ViewSettingsItem({
                                          text: that.oApplicationFacade.getResourceBundle().getText("DUAL_TREND_TILE"),
                                          key: "DT-TT"
                                      })
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
			            		  that.byId("mptInfo").setText(infoBarText);	
			            	  }
			            	  else {
			            		  that.byId("mptInfo").setText("");
			            		  that.byId("filterToolbar").setVisible(false);
			            	  }
			              }
		});
		this.filterOptionsDialog.open();
	}
	
});
