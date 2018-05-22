/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.visualization.view.S3", {

	onInit : function() {
		var that = this;
//		this.getView().getContent()[0].addContent(new sap.ui.core.HTML({
//			content:'<div class="invisibleDiv">'
//		}));
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		this.busyDialog = new sap.m.BusyDialog();
		var view = this.getView();
		this.settingModel =sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");
		this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");
		this.navigatingWithinDrilldown = true;
		this.oRouter.attachRouteMatched(function(oEvent) {
//			$(".invisibleDiv").css("display","none");
			if (oEvent.getParameter("name") === "detail") {
				that.selectedTile = undefined;
				this.evalContext = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
				
				var chipModel = new sap.ui.model.json.JSONModel();
				chipModel.setSizeLimit(100000);
				this.getView().setModel(chipModel,"tileConfig");
				this.modelRef = this.getView().getModel("tileConfig");
				
				if(!!!this.oApplicationFacade.__tileModified && this.evalContext.getObject() && ((this.evalContext.getObject()["CHIPS_COUNT"] === null) || (this.evalContext.getObject()["CHIPS_COUNT"] === 0))){
//					$(".invisibleDiv").css("display","block");
					this.oApplicationFacade.__tileModified = null;
					this.getView().getModel("tileConfig").setData({CHIPS:[]});
					if(that.navigatingWithinDrilldown) {
						that.oApplicationFacade.navigatingWithinDrilldown = true;
					} 
					else {
						that.oApplicationFacade.navigatingWithinDrilldown = undefined;
					}
					sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"noDataView",context:that.evalContext.sPath.substr(1)});
					return;
				}

				//Adapter Implementation Code :
				this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
				this.confRef = sap.suite.ui.smartbusiness.Configuration;
				this.constantsRef = this.confRef.Constants;
				this.tileTypeConst = this.constantsRef.TileType;
				this.PLATFORM = this.metadataRef.getPlatform();
				this.env = 0;
				
				if(this.PLATFORM == this.constantsRef.Platform.ABAP) {
					this.isPlatformABAP = true;
				}
				else {
					this.isPlatformABAP = false;
				}
				
				// Fetch System Environment info => Either running on SAP env or CUST env
				function sysInfoFetchCallBack(d) {
					that.env = d;
				}
				
				function sysInfoFetchErrCallBack(d,s,x) {
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_SYS_INFO"), d.response.body);
				}
				
				this.metadataRef.getSystemInfo({async:false, success:sysInfoFetchCallBack, error:sysInfoFetchErrCallBack, model:this.oDataModel});
				
				var tableRef = this.byId("tileGrid");
				tableRef.removeAllColumns();
				if(this.isPlatformABAP) {
					tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : that.oApplicationFacade.getResourceBundle().getText("TILE_TYPE")}),visible : true}));
					//tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : that.oApplicationFacade.getResourceBundle().getText("NAVIGATION")}),visible : true}));
					tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : that.oApplicationFacade.getResourceBundle().getText("CATALOGUE")}),visible : true}));
					tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : ""}),visible : true}));
					tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : ""}),visible : true}));
				}
				else {
					tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : that.oApplicationFacade.getResourceBundle().getText("TILE_TYPE")}),visible : true}));
					tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : that.oApplicationFacade.getResourceBundle().getText("NAVIGATION")}),visible : true}));
					tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : that.oApplicationFacade.getResourceBundle().getText("STATUS")}),visible : true}));
					tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : ""}),visible : true}));
					tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : ""}),visible : true}));
				}
				
				function chipFetchCallBack(chips) {
					if(chips && chips.EVALUATION) {
						chips.EVALUATION.CHIPS_COUNT = (chips.CHIPS) ? chips.CHIPS.length : 0;
					}
//					$(".invisibleDiv").css("display","none");
					that.busyDialog.close();
					jQuery.sap.log.info("Chips fetch called and successful");
					if(!(chips && chips.CHIPS && chips.CHIPS.length)){
//						$(".invisibleDiv").css("display","block");
						sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"noDataView",context:that.evalContext.sPath.substr(1)});
						return;
					}
					else{
						that.getView().getModel("tileConfig").setData(chips);
						if(chips.affectedTiles && chips.affectedTiles.length) {
							that.handleAffectedTilesDialogOnSelect(chips);
						}
					}
				}
				
				function chipFetchErrCallBack(d,s,x) {
					that.busyDialog.close();
					that.getView().getModel("tileConfig").setData([]);
//					$(".invisibleDiv").css("display","block");
					jQuery.sap.log.error("Error occured while fetching chips");
					//sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"noDataView",context:that.evalContext.sPath.substr(1)});
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_CHIPS"), (JSON.stringify(d)));
				}
				
				this.busyDialog.open();
				this.metadataRef.getChipByEvaluation({context:this.evalContext, success:chipFetchCallBack, error:chipFetchErrCallBack, model:this.oApplicationFacade.getODataModel()});
				
				if(that.isPlatformABAP){
					this.oHeaderFooterOptions.buttonList = [
//					{
//						sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("EDIT_EVALUATION"),
//						onBtnPressed : function(evt){
//							sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"editEvaluation", context: that.evalContext.sPath.substr(1)});
//					    }
//					},
					{
						sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("DELETE_EVALUATION"),
						onBtnPressed : function(evt){
							that.handleEvalDelete();
					    }
					}
					]
					this.oHeaderFooterOptions.additionalShareButtonList = [];
				}
				// Make sure the master is here
			}
		}, this);
		var that = this;
		this.oHeaderFooterOptions = { 
				bSuppressBookmarkButton: {}, 
				oEditBtn : {
					sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("FULLSCREEN_TITLE"),
					onBtnPressed : function(evt) {
						if(that.navigatingWithinDrilldown) {
							that.oApplicationFacade.navigatingWithinDrilldown = true;
						} 
						else {
							that.oApplicationFacade.navigatingWithinDrilldown = undefined;
						}
						if(that.isPlatformABAP){
							sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"addTileModelS", context: that.evalContext.sPath.substr(1)});
						}
						else {
							sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"addTile", context: that.evalContext.sPath.substr(1)});
						}
					},
					bEnabled : false, // default true
				}           
		};
	},
	
	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},

	getChipRow: function(id,context){
		var that = this;
		var tileContent;
		var tile;
		var config = null;
		try {
			config = JSON.parse(JSON.parse(JSON.parse(context.getObject().configuration).tileConfiguration).TILE_PROPERTIES);
		}
		catch(e) {
			//sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_PARSE_CHIP_INFO"), (that.oApplicationFacade.getResourceBundle().getText("TILE_TITLE") + " : " + context.getObject().title + "\n" +  that.oApplicationFacade.getResourceBundle().getText("TILE_SUBTITLE") + " : " + context.getObject().description));
			config = {};
			//throw new Error("parsing of Chip Failed");
			jQuery.sap.log.error("parsing of Chip Failed");
		}
		var navType = new sap.m.Text();
		
		if(config.navType == "0") {
			navType.setText(that.oApplicationFacade.getResourceBundle().getText("GENERIC_DRILLDOWN"));
		}
		else {
			navType.setText(that.oApplicationFacade.getResourceBundle().getText("OTHER_DRILLDOWN"));
		}
		
		var status = new sap.m.ObjectNumber();
		
		if(context.getObject().COUNTER == "1") {
			if(context.getObject().isActive) {
				status.setNumber(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE"));
				status.setState("Success");
			}
			else {
				status.setNumber(that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW"));
				status.setState("None");
			}
		}
		else {
			status.setNumber(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE_DRAFT"));
			status.setState("Success");
		}
		
		var favourite;
		
		var semanticObjectVisibility;
		
		if(Number(config.navType)) {
			semanticObjectVisibility = true;
		}
		else {
			semanticObjectVisibility = false;
		}
		
		if(context.getProperty("tileType")==that.tileTypeConst["NT"])
			tileContent = new sap.suite.ui.commons.NumericContent({size:"S", value:"0.0", scale:"M", valueColor:"Good", unit:that.oApplicationFacade.getResourceBundle().getText("TILE_CURRENCY"), footer:that.oApplicationFacade.getResourceBundle().getText("ACTUAL")});
		else if(context.getProperty("tileType")==that.tileTypeConst["CT"])
			tileContent =  new sap.suite.ui.commons.ComparisonChart({
				scale: "M",
				size:"S",
				data: [new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("VALUE_1"), value: 1550}),
				       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("VALUE_2"), value: 219.2}),
				       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("VALUE_3"), value: 66.46})]
			});
		else if(context.getProperty("tileType")==that.tileTypeConst["AT"])
			tileContent =  new sap.suite.ui.commons.BulletChart({
				scale: "M",
				size:"S",
				minValue: 0,
				maxvalue: 312,
				targetValue: 150,
				actual: new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
				thresholds: [new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
				             new sap.suite.ui.commons.BulletChartData({value:200, color:"Critical"})]
			});
		else if(context.getProperty("tileType")==that.tileTypeConst["TT"])
			tileContent = new sap.suite.ui.commons.MicroAreaChart({
				size:"S",
				width: "130px",
				height: "59px",
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				firstXLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"Jan 1", color:"Neutral"}),
				lastXLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"Jan 31", color:"Neutral"}),
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
		else if(context.getProperty("tileType")==that.tileTypeConst["CM"]) {
			tileContent =  new sap.suite.ui.commons.ComparisonChart({
				scale: "M",
				size:"S",
				data: [new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("MEASURE_1"), value: 34, color: "Good"}),
				       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("MEASURE_2"), value: 125, color: "Error"}),
				       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("MEASURE_3"), value: 97, color: "Critical"})]
			});
		}else if(context.getProperty("tileType")==that.tileTypeConst["HT"]){
			tileContent= new sap.suite.ui.commons.HarveyBallMicroChart({
				total:100,
				size:"S",
				scale: "M",
				items:[new sap.suite.ui.commons.HarveyBallMicroChartItem({
				    	   fraction:30,
				    	   color: "Good"
				       })]
			});
		}
		tile = new sap.suite.ui.commons.GenericTile({
			size:"S", 
			header: context.getProperty("title"),
			subheader: context.getProperty("description"),
			customData: [new sap.ui.core.CustomData({key:"tileType",value:context.getProperty("tileType")})],
			tileContent: new sap.suite.ui.commons.TileContent({content:tileContent, size:"S",}),
			press: function(evt) {
//				var tiles = that.byId("tileGrid").getItems();
//				for(var i=0,l=tiles.length; i<l; i++) {
//					tiles[i].getCells()[0].$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiWhite"));
//				}
//				evt.getSource().$().css("border","solid 2px " + sap.ui.core.theming.Parameters.get("sapUiHighlight"));
			}
		}).addStyleClass("sbTile");
		
		if(context.getProperty("isAffected")) {
			tile.addStyleClass("affectedTile");
		}
		
		if(context.getProperty("tileType") == that.tileTypeConst["DT-AT"]) {
            tile.setFrameType("TwoByOne");
            var tileContentat = new sap.suite.ui.commons.NumericContent({ value:"0.0", 
                scale:"M", size:"S", valueColor:"Good", unit:that.oApplicationFacade.getResourceBundle().getText("TILE_CURRENCY"), footer:that.oApplicationFacade.getResourceBundle().getText("ACTUAL")});
            var tileContentat2 =  new sap.suite.ui.commons.BulletChart({
                scale: "M",
                size : "S",
                minValue: 0,
                maxvalue: 312,
                targetValue: 150,
                actual: new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
                thresholds: [new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
                             new sap.suite.ui.commons.BulletChartData({value:200, color:"Critical"})]
            });
            tile.removeAllTileContent();
            tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContentat, size: "S"}));
            tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContentat2, size : "S"}));
                                               
        }
        else if(context.getProperty("tileType") == that.tileTypeConst["DT-CT"]) {
            tile.setFrameType("TwoByOne");
            var tileContentct = new sap.suite.ui.commons.NumericContent({ value:"0.0", 
                scale:"M", size:"S", valueColor:"Good", unit:that.oApplicationFacade.getResourceBundle().getText("TILE_CURRENCY"), footer:that.oApplicationFacade.getResourceBundle().getText("ACTUAL")});
            var tileContentct2 =  new sap.suite.ui.commons.ComparisonChart({
                scale: "M",
                size:"S",
                data: [new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("VALUE_1"), value: 1550}),
                       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("VALUE_2"), value: 219.2}),
                       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("VALUE_3"), value: 66.46})]
            });
            tile.removeAllTileContent();
            tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContentct, size: "S"}));
            tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContentct2, size : "S"}));
        }
        else if(context.getProperty("tileType") == that.tileTypeConst["DT-CM"]) {
            tile.setFrameType("TwoByOne");
            var tileContentcm = new sap.suite.ui.commons.NumericContent({ value:"0.0", 
                scale:"M", size:"S", valueColor:"Good", unit:that.oApplicationFacade.getResourceBundle().getText("TILE_CURRENCY"), footer:that.oApplicationFacade.getResourceBundle().getText("ACTUAL")});
            var tileContentcm2 = new sap.suite.ui.commons.ComparisonChart({
                scale: "M",
                size:"S",
                data: [new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("MEASURE_1"), value: 34, color: "Good"}),
                       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("MEASURE_2"), value: 125, color: "Error"}),
                       new sap.suite.ui.commons.ComparisonData({title:that.oApplicationFacade.getResourceBundle().getText("MEASURE_3"), value: 97, color: "Critical"})]
            });
            tile.removeAllTileContent();
            tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContentcm, size: "S"}));
            tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContentcm2, size : "S"}));
        }
        else if(context.getProperty("tileType") == that.tileTypeConst["DT-TT"]) {
            tile.setFrameType("TwoByOne");
            var tileContenttt = new sap.suite.ui.commons.NumericContent({ value:"0.0", 
                scale:"M", size:"S", valueColor:"Good", unit:that.oApplicationFacade.getResourceBundle().getText("TILE_CURRENCY"), footer:that.oApplicationFacade.getResourceBundle().getText("ACTUAL")});
            var tileContenttt2 = new sap.suite.ui.commons.MicroAreaChart({
				size:"S",
				width: "130px",
				height: "59px",
				minXValue: 0,
				maxXValue: 100,
				minYValue: 0,
				maxYValue: 100,
				firstXLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"Jan 1", color:"Neutral"}),
				lastXLabel: new sap.suite.ui.commons.MicroAreaChartLabel({label:"Jan 31", color:"Neutral"}),
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
            tile.removeAllTileContent();
            tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContenttt, size: "S"}));
            tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContenttt2, size : "S"}));
        }
        
		function editPressEvent(evt) {
			var bindingContext = this.getBindingContext("tileConfig");
			var chipObj = bindingContext.getObject();
			var chipContext = "CHIPS";
			if(that.navigatingWithinDrilldown) {
				that.oApplicationFacade.navigatingWithinDrilldown = true;
			}
			else {
				that.oApplicationFacade.navigatingWithinDrilldown = undefined;
			}
			if(that.isPlatformABAP) {
				if(chipObj.isActive) {
					if(chipObj.COUNTER == 2) {
						chipContext = chipContext + "(ID='" + chipObj.id + "',IS_ACTIVE=0)";
					}
					else {
						chipContext = chipContext + "(ID='" + chipObj.id + "',IS_ACTIVE=1)";
					}
				}
				else {
					chipContext = chipContext + "(ID='" + chipObj.id + "',IS_ACTIVE=0)";
				}
				sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"editTileModelS", context: (that.evalContext.sPath.substr(1) + "/" + chipContext)});
			}
			else {
				if(chipObj.isActive) {
					if(chipObj.COUNTER == 2) {
						chipContext = chipContext + "(id='" + chipObj.id + "',isActive=0)";
					}
					else {
						chipContext = chipContext + "(id='" + chipObj.id + "',isActive=1)";
					}
				}
				else {
					chipContext = chipContext + "(id='" + chipObj.id + "',isActive=0)";
				}
				sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"editTile", context: (that.evalContext.sPath.substr(1) + "/" + chipContext)});
			}
		}
		
		var editButton = new sap.m.Button({
			icon: "sap-icon://edit",
			type:sap.m.ButtonType.Transparent,
			press: editPressEvent
		});
		
		if(context.getProperty("isAffected")) {
			editButton.setEnabled(false);
		}
		
		var deleteButton = new sap.m.Button({
			icon:"sap-icon://sys-cancel",
			type:sap.m.ButtonType.Transparent,
			press: function(evt) {
				that.handleDelete(this);
			}
		});
		
		var cells = [];
		
		var catalogName = new sap.m.Text({text:context.getObject().catalogName});
		
		var tileNotAvailableErrorState = context.getObject().isAffected ? true : false;
		
		if(that.isPlatformABAP) {
			cells = [tile,
//			         new sap.ui.layout.VerticalLayout({
//			        	 content: [
//			        	           navType,
//			        	           new sap.m.Text({text: that.oApplicationFacade.getResourceBundle().getText("SEMANTIC_OBJECT") + ': ' + config.semanticObject, visible:semanticObjectVisibility}),
//			        	           new sap.m.Text({text: that.oApplicationFacade.getResourceBundle().getText("ACTION") + ': ' + config.semanticAction, visible:semanticObjectVisibility}),
//			        	           ]
//			         }).addStyleClass("navigationVLayout"),
			         new sap.ui.layout.VerticalLayout({
			        	 content: [
			        	           new sap.m.Text({text: /*that.oApplicationFacade.getResourceBundle().getText("CATALOGUE") + ': ' + */context.getObject().catalogName, visible:true}),
			        	           new sap.m.ObjectStatus({text: that.oApplicationFacade.getResourceBundle().getText("TILE_REMOVED_FROM_CATALOG"), state:"Error", visible:tileNotAvailableErrorState})
			        	           ]
			         }).addStyleClass("navigationVLayout"),
			         editButton,
			         deleteButton];
		}
		else {
			cells = [tile,
			         new sap.ui.layout.VerticalLayout({
			        	 content: [
			        	           navType,
			        	           new sap.m.Text({text: that.oApplicationFacade.getResourceBundle().getText("SEMANTIC_OBJECT") + ': ' + config.semanticObject, visible:semanticObjectVisibility}),
			        	           new sap.m.Text({text: that.oApplicationFacade.getResourceBundle().getText("ACTION") + ': ' + config.semanticAction, visible:semanticObjectVisibility}),
			        	           ]
			         }).addStyleClass("navigationVLayout"),
			         status,
			         editButton,
			         deleteButton];
		}
		
		var columnListItem = new sap.m.ColumnListItem({
			type: "Navigation",
	    	cells: cells
		}); 
		
		if(!(that.isPlatformABAP)) {
			columnListItem.attachPress(function(evt) {
				var bindingContext = this.getBindingContext("tileConfig");
				var chipObj = bindingContext.getObject();
				var chipContext = "CHIPS";
				if(chipObj.isActive) {
					if(chipObj.COUNTER == 2) {
						chipContext = chipContext + "(id='" + chipObj.id + "',isActive=0)";
					}
					else {
						chipContext = chipContext + "(id='" + chipObj.id + "',isActive=1)";
					}
				}
				else {
					chipContext = chipContext + "(id='" + chipObj.id + "',isActive=0)";
				}
				if(that.navigatingWithinDrilldown) {
					that.oApplicationFacade.navigatingWithinDrilldown = true;
				}
				else {
					that.oApplicationFacade.navigatingWithinDrilldown = undefined;
				}
				sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"editTile", context: (that.evalContext.sPath.substr(1) + "/" + chipContext)});
			});
		}
		else if(that.isPlatformABAP && !(context.getProperty("isAffected"))){
			columnListItem.attachPress(function(evt) {
				var bindingContext = this.getBindingContext("tileConfig");
				var chipObj = bindingContext.getObject();
				var chipContext = "CHIPS";
				if(chipObj.isActive) {
					if(chipObj.COUNTER == 2) {
						chipContext = chipContext + "(ID='" + chipObj.id + "',IS_ACTIVE=0)";
					}
					else {
						chipContext = chipContext + "(ID='" + chipObj.id + "',IS_ACTIVE=1)";
					}
				}
				else {
					chipContext = chipContext + "(ID='" + chipObj.id + "',IS_ACTIVE=0)";
				}
				if(that.navigatingWithinDrilldown) {
					that.oApplicationFacade.navigatingWithinDrilldown = true;
				}
				else {
					that.oApplicationFacade.navigatingWithinDrilldown = undefined;
				}
				sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"editTileModelS", context: (that.evalContext.sPath.substr(1) + "/" + chipContext)});
			});
			
		}
		else {
			columnListItem.setType("Inactive");
		}
		
		return columnListItem;
		
	},

	handleDelete: function(contextObj) {
		var that = this;
		sap.m.MessageBox.show(
				that.oApplicationFacade.getResourceBundle().getText("WANT_TO_DELETE_SELECTED_TILE"),
				"sap-icon://hint",
				that.oApplicationFacade.getResourceBundle().getText("DELETE"),
				[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
				function(evt){
					if(evt=="OK"){
						function tileDeleteCallBack() {
							that.busyDialog.close();
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
							that.refreshMasterList();
							//that.oApplicationFacade.getODataModel().refresh();
							function chipRefetchCallBack(chips) {
								that.busyDialog.close();
								chips.EVALUATION.CHIPS_COUNT = (chips.CHIPS) ? chips.CHIPS.length : 0;
								that.getView().getModel("tileConfig").setData(chips);
								if(chips.EVALUATION.CHIPS_COUNT === 0){
									sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"noDataView",context:that.evalContext.sPath.substr(1)});
									return;
								}
							}

							function chipRefetchErrCallBack(d,s,x) {
								that.busyDialog.close();
								that.getView().getModel("tileConfig").setData([]);
							}
							that.metadataRef.getChipByEvaluation({context:that.evalContext, success:chipRefetchCallBack, error:chipRefetchErrCallBack, model:that.oApplicationFacade.getODataModel()});
						}
						function tileDeleteErrCallBack(err) {
							that.busyDialog.close();
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.responseText);
						}
						that.busyDialog.open();
						that.metadataRef.removeTile(contextObj.getBindingContext("tileConfig").getObject(),that, tileDeleteCallBack, tileDeleteErrCallBack);
					}
					if(evt=="CANCEL"){

					}
				}
		);
	},
	
	handleAffectedTilesDialogOnSelect: function(chipObj) {
		var that = this;
		var affectedTiles = chipObj.affectedTiles;
		var affectedTilesDialog = new sap.m.Dialog({
			icon:"sap-icon://warning2",
			title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
			state:"Error",
			type:"Message",
			content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("AFFECTED_TILES_DEL_DIALOG")})],
			beginButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("OK"),
				press: function(){
					function removeAffectedTilesCallBack() {
						that.busyDialog.close();
						sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("AFFECTED_TILES_DEL_SUCCESS"));
						that.refreshMasterList();
						function chipRefetchAfterAffectedCallBack(chips) {
							that.busyDialog.close();
							chips.EVALUATION.CHIPS_COUNT = (chips.CHIPS) ? chips.CHIPS.length : 0;
							that.getView().getModel("tileConfig").setData(chips);
							if(chips.EVALUATION.CHIPS_COUNT === 0){
								sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"noDataView",context:that.evalContext.sPath.substr(1)});
								return;
							}
						}

						function chipRefetchAfterAffectedErrCallBack(d,s,x) {
							that.busyDialog.close();
							that.getView().getModel("tileConfig").setData([]);
						}
						that.metadataRef.getChipByEvaluation({context:that.evalContext, success:chipRefetchAfterAffectedCallBack, error:chipRefetchAfterAffectedErrCallBack, model:that.oApplicationFacade.getODataModel()});
					}
					
					function removeAffectedTilesErrCallBack() {
						that.busyDialog.close();
						sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("AFFECTED_TILES_DEL_ERROR"));
					}
					
					affectedTilesDialog.close();
					var payloads = [];
					for(var i=0,l=affectedTiles.length; i<l; i++) {
						payloads.push({ID:affectedTiles[i], IS_ACTIVE:1});
					}
					if(payloads && payloads.length) {
						that.busyDialog.open();
						that.metadataRef.remove("CHIP", payloads, removeAffectedTilesCallBack, removeAffectedTilesErrCallBack);
					}
					//sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPITile", route:"detail", context: that.context.sPath.substr(1)});
				}
			}),
			endButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				press:function(){affectedTilesDialog.close();}
			})                                              
		});
		affectedTilesDialog.open();
	},
	
	handleEvalDelete: function() {
		var that = this;
		var modelData = that.modelRef.getData();
		if(modelData.CHIPS && modelData.CHIPS.length) {
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("EVALUATION_HAS_TILES_ERR"));
		}
		else {
			sap.m.MessageBox.show(
					that.oApplicationFacade.getResourceBundle().getText("WARNING_EVALUATION_DELETE"),
					"sap-icon://hint",
					that.oApplicationFacade.getResourceBundle().getText("DELETE"),
					[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
					function(evt){
						if(evt=="OK"){
							function evalDeleteCallBack() {
								that.busyDialog.close();
								sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("EVALUATION_DEL_SUCCESS"));
								that.refreshMasterList();
								sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({hash:window.location.hash.substr(0,window.location.hash.indexOf("&/"))}, true);
							}
							
							function evalDeleteErrCallBack() {
								that.busyDialog.close();
								sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERR_EVALUATION_DEL"));
							}
							var payload = {ID:modelData.EVALUATION.ID, IS_ACTIVE:modelData.EVALUATION.IS_ACTIVE};
							that.busyDialog.open();
							that.metadataRef.remove("EVALUATION", payload, evalDeleteCallBack, evalDeleteErrCallBack);
						}
						if(evt=="CANCEL"){

						}
					}
			);
		}
	},
	
	formatChipsCount: function(count) {
		return this.oApplicationFacade.getResourceBundle().getText("TILES") + " (" + (count || 0) + ")";
	},
	
	getFooterButtons: function() {
		var that = this;
		var buttonList = [
		                  {
		                	  sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("ACTIVATE"),
		                	  onBtnPressed : function(evt) {
		                		  if(that.selectedTile) {
		                			  var data = JSON.parse(JSON.parse(JSON.parse(that.selectedTile.getBindingContext("tileConfig").getObject().CHIP_MODELER.configuration).tileConfiguration).TILE_PROPERTIES);
		                			  var evaluation = JSON.parse(JSON.parse(JSON.parse(that.selectedTile.getBindingContext("tileConfig").getObject().CHIP_MODELER.configuration).tileConfiguration).EVALUATION);
		                			  var chipObj = that.selectedTile.getBindingContext("tileConfig").getObject().CHIP_MODELER;
		                			  var errorLog = "";
		                			  if(!(data.semanticObject && data.semanticAction && chipObj.title && chipObj.description) || (!(data.storyId) && data.navType == 1) || (data.semanticObject.length == (data.semanticObject.split(" ").length - 1)) || (data.semanticAction.length == (data.semanticAction.split(" ").length - 1)) ) {
		                				  if(!(data.semanticObject) || (data.semanticObject.length == (data.semanticObject.split(" ").length - 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_OBJECT") + "\n";
		                				  }
		                				  if(!(data.semanticAction) || (data.semanticAction.length == (data.semanticAction.split(" ").length - 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_SEMANTIC_ACTION") + "\n";
		                				  }
		                				  if(!(chipObj.title) || (that.selectedTile.getBindingContext().getObject().title.length == (that.selectedTile.getBindingContext().getObject().title.split(" ").length - 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_TITLE") + "\n";
		                				  }
		                				  if(!(chipObj.description) || (chipObj.description.length == (chipObj.description.split(" ").length - 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_DESCRIPTION") + "\n";
		                				  }
		                				  if((!(data.storyId) && (data.navType == 1))) {
		                					  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_STORY_ID");
		                				  }
		                				  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), errorLog);
		                			  } 
		                			  else {
		                				  if(that.selectedTile.getBindingContext().getObject().tileType == "CM") {
		                					  if(!(evaluation) || !(evaluation.COLUMN_NAMES) || !(evaluation.COLUMN_NAMES.length)) {
		                						  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES");
		                					  }
		                					  else {
		                						  for(var i=0,l=evaluation.COLUMN_NAMES.length; i<l; i++) {
		                							  if(!(evaluation.COLUMN_NAMES[i].COLUMN_NAME) || !(evaluation.COLUMN_NAMES[i].semanticColor)) {
		                								  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_THREE_MEASURES");
		                								  break;
		                							  }
		                						  }
		                						  if((!errorLog) && (evaluation.COLUMN_NAMES.length == 3)) {
		                							  if(evaluation.COLUMN_NAMES[0].COLUMN_NAME == evaluation.COLUMN_NAMES[1].COLUMN_NAME) {
		                								  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
		                							  } 
		                							  else if(evaluation.COLUMN_NAMES[0].COLUMN_NAME == evaluation.COLUMN_NAMES[2].COLUMN_NAME) {
		                								  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
		                							  }
		                							  else if(evaluation.COLUMN_NAMES[1].COLUMN_NAME == evaluation.COLUMN_NAMES[2].COLUMN_NAME) {
		                								  errorLog += that.oApplicationFacade.getResourceBundle().getText("ERROR_DUPLICATE_MEASURE_THREE_MEASURES");
		                							  }
		                						  }
		                					  }
		                				  }
		                				  if(errorLog) {
		                					  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), errorLog);
		                				  }
		                				  else {
		                					  //odata write
//		                					  that.oApplicationFacade.getODataModel().create("/ACTIVE_CHIPS",{id:that.selectedTile.getBindingContext().getObject().id},null,function(data) {
//		                						  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_SUCCESSFUL"));
//		                						  that.oApplicationFacade.getODataModel().refresh();
//		                						  that.selectedTile = undefined;
//		                						  that.updateFooterButtons();
//
//		                					  },function(err){
//		                						  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), err.response.body);
//		                					  });
		                					  
		                					  //xsjs write
		                					  that.metadataRef.create("ACTIVATE_CHIP",{id:chipObj.id},null,function(data) {
		                						  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_SUCCESSFUL"));
		                						  //that.oApplicationFacade.getODataModel().refresh();
		                						  that.refreshMasterList();
		                						  that.selectedTile = undefined;
		                						  that.updateFooterButtons();

		                					  },function(err){
		                						  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATION_ERROR"), err.responseText);
		                					  });
		                				  }
		                			  }
		                		  }
		                		  else {
		                			  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_DELETE"));
		                		  }
		                	  },
		                  },
		                  {
		                	  sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("EDIT")+" "+that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT"),
		                	  onBtnPressed : function(evt) {
		                		  if(that.selectedTile) {
		                			  var chipContext = that.selectedTile.getBindingContext("tileConfig").sPath.replace("isActive=1","isActive=0");
		                			  chipContext = chipContext.replace("/CHIPS_MODELER","CHIPS");
		                			  that.oRouter.navTo("editTile", {
		                				  contextPath : that.evalContext.sPath.substr(1),
		                				  chipContextPath : chipContext
		                			  });
		                		  }
		                		  else {
		                			  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_EDIT"));
		                		  }
		                	  },
		                  }, 
		                  {
		                	  sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("EDIT"),
		                	  onBtnPressed : function(evt) {
		                		  if(that.selectedTile) {
		                			  that.oRouter.navTo("editTile", {
		                				  contextPath : that.evalContext.sPath.substr(1),
		                				  chipContextPath : that.selectedTile.getBindingContext("chipObj").sPath.replace("/CHIPS_MODELER","CHIPS")
		                			  });
		                		  }
		                		  else {
		                			  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_EDIT"));
		                		  }
		                	  },
		                  },                                
		                  {
		                	  sI18nBtnTxt : that.oApplicationFacade.getResourceBundle().getText("DELETE"),
		                	  onBtnPressed : function(evt) {
		                		  if(that.selectedTile) {

		                			  sap.m.MessageBox.show(
		                					  that.oApplicationFacade.getResourceBundle().getText("WANT_TO_DELETE_SELECTED_TILE"),
		                					  "sap-icon://hint",
		                					  that.oApplicationFacade.getResourceBundle().getText("DELETE"),
		                					  [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
		                					  function(evt){
		                						  if(evt=="OK"){
		                							  that.oApplicationFacade.getODataModel().remove(that.selectedTile.getBindingContext("tileConfig").sPath.replace("CHIPS_MODELER","CHIPS"),null,function(data) {
		                								  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
		                								  //that.oApplicationFacade.getODataModel().refresh();
		                								  that.refreshMasterList();
		                								  that.selectedTile = undefined;
		                								  that.updateFooterButtons(); 
		                							  },function(err){
		                								  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"), err.response.body);
		                							  });
		                						  }
		                						  if(evt=="CANCEL"){

		                						  }
		                					  }
		                			  );
		                		  }
		                		  else {
		                			  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("SELECT_A_TILE_TO_DELETE"));
		                		  }
		                	  },
		                  }
		                  ]
		return buttonList;

	},

	setSorting: function(key, groupDescending) {
		groupDescending = groupDescending || false;
		var list = this.getView().byId("tileGrid");
		if(key == "tileType") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("tileType",groupDescending,null)]); 
		} 
		else if(key == "status") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("isActive",groupDescending,null), new sap.ui.model.Sorter("COUNTER",groupDescending,null)]);
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
//				"HT": (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'HT')),
				"DT-CM" : (new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-CM')), 
                "DT-CT" :(new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-CT')),
                "DT-AT" :(new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-AT')),
                "DT-TT" :(new sap.ui.model.Filter("tileType", sap.ui.model.FilterOperator.EQ, 'DT-TT')),
				"new": (new sap.ui.model.Filter("isActive", sap.ui.model.FilterOperator.EQ, 0)),
				"active": (new sap.ui.model.Filter("isActive", sap.ui.model.FilterOperator.EQ, 1))
		};
		
		filtersArray = sap.suite.ui.smartbusiness.lib.Util.utils.getFilterArray(items, filterObject);
		
		if(filtersArray.length) {
			list.getBinding("items").filter(new sap.ui.model.Filter(filtersArray, true));
		}
		else {
			list.getBinding("items").filter(filtersArray);
		}
		
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
						text: that.oApplicationFacade.getResourceBundle().getText("STATUS"),
						key: "status"
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
//			            	          new sap.m.ViewSettingsItem({
//			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("HARVEY_BALL_TILE"),
//			            	        	  key: "HT"
//			            	          }),
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
			              }),
			              new sap.m.ViewSettingsFilterItem({
			            	  text: that.oApplicationFacade.getResourceBundle().getText("STATUS"),
			            	  key: "status",
			            	  items: [
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW"),
			            	        	  key: "new"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE"),
			            	        	  key: "active"
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
			            		  that.byId("visualizationInfo").setText(infoBarText);	
			            	  }
			            	  else {
			            		  that.byId("visualizationInfo").setText("");
			            		  that.byId("filterToolbar").setVisible(false);
			            	  }
			              }
		});
		this.filterOptionsDialog.open();
	},
	
	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,false);
	},
	
	formatIndicatorTitle: function(i_title) {
		return this.oApplicationFacade.getResourceBundle().getText("KPI_TEXT") + " : " + i_title; 
	}
});


