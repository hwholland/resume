/*
 * Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

jQuery.sap.require("sap.ca.ui.images.images");
jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("/") + "/sap/ca/scfld/md/css/flower.css");
sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.drilldown.view.emptyView", {

	onInit : function() {
		var oImage = this.byId("flower");
		//this.errorMessages = [];
		this.errorState = false;
		
		if (oImage){
			oImage.setSrc(sap.ca.ui.images.images.Flower);
		}
//		var sLink = document.createElement('link');
//		sLink.setAttribute('rel', 'stylesheet');
//		sLink.setAttribute('type', 'text/css');
//		sLink.setAttribute('href', 'resources/sap/ca/scfld/md/css/flower.css');
//		sLink.setAttribute('id', 'emptyView_stylesheet');
//		document.getElementsByTagName('head')[0].appendChild(sLink);
		
		this.getView().addEventDelegate(this, this);
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(oEvent) {
				if (oEvent.data && (oEvent.data.viewTitle || oEvent.data.languageKey || oEvent.data.infoText)){
					this.setTitleAndMessage(oEvent.data.viewTitle, oEvent.data.languageKey, oEvent.data.infoText);
				}
			}, this)                                                   
		});

		var view = this.getView();
		var that=this;
		if(this.oApplicationFacade.navigatingWithinDrilldown) {
			this.navigatingWithinDrilldown = true;
			this.oApplicationFacade.navigatingWithinDrilldown = undefined;
		} 
		else {
			this.navigatingWithinDrilldown = false;
		}
		//the route handler is only here for backwards compatibility
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "noDataView") {

				if(this.oApplicationFacade.copyClipboard) {
					this.copyClipboard = this.oApplicationFacade.copyClipboard;
				}
				this.isPasteEnabled = false;
				var str=oEvent.getParameter("arguments").contextPath;
				var context = new sap.ui.model.Context(view.getModel(), '/' + str);
				view.setBindingContext(context);
				this.context = context;
				try{
					this.evaluationId = view.getBindingContext().getObject()["ID"];
				}catch(e){
					try{
						this.evaluationId=  str.match(/ID=[^,]+/g)[0].replace(/(ID=')|(')/g,"");
					}catch(e){
						this.evaluationId=str.replace(/EVALUATIONS_MODELER\('|'\)/g,"")
					}
				}

				var oArgument = oEvent.getParameter("arguments");

				this.setTitleAndMessage(oArgument.viewTitle, oArgument.languageKey);
				
				if(this.copyClipboard && Object.keys(this.copyClipboard) && Object.keys(this.copyClipboard).length) {
					this.checkEvaluationForPaste();
				}
				else {
					if(this._oControlStore && this._oControlStore.oButtonListHelper) {
						this.updateHeaderFooterOptions(false);
					}
				}
				
			}
		}, this);


	},
	lauchConfigurator: function() {

		this.DDA_MODEL =  sap.suite.ui.smartbusiness.lib.DrilldownModel.Model.getInstance(this.evaluationId, true, this.getView().getModel("i18n"));
		
		var contextPath = this.evaluationId + "/" + this.DDA_MODEL.NEW_VIEWID;
		this.oApplicationFacade.navigatingWithinDrilldown = this.navigatingWithinDrilldown;
		sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"configureChart", context: contextPath});
		
		//this.oRouter.navTo("configureChart",{evaluationId: this.evaluationId, viewId: this.DDA_MODEL.NEW_VIEWID});

		//this.evaluationId = null;
	},
	getHeaderFooterOptions : function() {
		var that=this;
		this.oHeaderFooterOptions = { 
				bSuppressBookmarkButton : true,
				sI18NDetailTitle: "DRILLDOWN_CONFIG_DETAILS",
				oEditBtn : {
					sI18nBtnTxt : "CONFIGURE",
					onBtnPressed : function(evt) {
						that.lauchConfigurator()
					},
					bEnabled : false, // default true
				},
				buttonList : [{
				            	  sId : "Paste", // optional
				            	  sI18nBtnTxt : "PASTE",
				            	  bDisabled : (!(that.isPasteEnabled)),
				            	  onBtnPressed : function(evt) {
				            		  if(that.errorState) {
											sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAILED_TO_LOAD_ODATA"), that.errorMsg);
											return;
										}
				            		  that.copyDDAConfiguration();
				            	  }
				              }
				              ]
		};
		return this.oHeaderFooterOptions;
	},

	setTitleAndMessage : function (sViewTitle, sLanguageKey, sInfoText) {
		// set view title
		var oPage = this.byId("sap.ca.scfld.md.view.empty");
		var sTitle= this.oApplicationFacade.oApplicationImplementation.getResourceBundle().getText(sViewTitle);
		if (!sTitle || sTitle === sViewTitle) {
			//fallback: show message also as title
			if (!sInfoText){
				sTitle = this.oApplicationFacade.oApplicationImplementation.getUiLibResourceBundle().getText(this.oApplicationFacade.oApplicationImplementation.oConfiguration.getDefaultEmptyMessageKey());
			}
			else
			{
				sTitle = sInfoText;
			}
		};
		oPage.setTitle(sTitle);

		// set message text                        
		var oLabel = this.byId("emptyLabel");
		if (!sInfoText){
			var sMessage = this.oApplicationFacade.oApplicationImplementation.getUiLibResourceBundle().getText(sLanguageKey);
			if (!sMessage || sMessage === sLanguageKey) {
				//fallback
				sMessage = this.oApplicationFacade.oApplicationImplementation.getUiLibResourceBundle().getText(this.oApplicationFacade.oApplicationImplementation.oConfiguration.getDefaultEmptyMessageKey());
			};
			oLabel.setText(sMessage);
		}
		else
		{
			oLabel.setText(sInfoText);
		}
	},
	
	updateHeaderFooterOptions: function(paste) {
		this.isPasteEnabled = paste;
		this.setHeaderFooterOptions(this.getHeaderFooterOptions());
	},
	
	checkEvaluationForPaste: function() {
		var currentEvaluationData = this.context.getObject();

		if((this.copyClipboard.evaluationData.ID == currentEvaluationData.ID) || this.checkEvaluationForPaste1()) {
			this.updateHeaderFooterOptions(false);
		}
		else {
			this.updateHeaderFooterOptions(true);
		}
		
//		if(this.copyClipboard.evaluationData.ID != currentEvaluationData.ID) {
//			for(var i=0,l=this.copyClipboard.MasterData.ALL_MEASURES.length; i<l; i++) {
//				if(currentMasterData.ALL_MEASURES.indexOf(this.copyClipboard.MasterData.ALL_MEASURES[i]) == -1) {
//					this.updateHeaderFooterOptions(false);
//					return;
//				}
//			}
//			for(var i=0,l=this.copyClipboard.MasterData.ALL_DIMENSIONS.length; i<l; i++) {
//				if(currentMasterData.ALL_DIMENSIONS.indexOf(this.copyClipboard.MasterData.ALL_DIMENSIONS[i]) == -1) {
//					this.updateHeaderFooterOptions(false);
//					return;
//				}
//			}
//			this.updateHeaderFooterOptions(true);
//		}
//		else {
//			this.updateHeaderFooterOptions(false);
//		}
//		return;
	},
	
	checkEvaluationForPaste1: function() {
		var currentEvaluationData = this.context.getObject();
		var masterData = this.copyClipboard.masterData;
		var measures = {};
		var dimensions = {};
		var allDimensions = sap.suite.ui.smartbusiness.lib.Util.odata.getAllDimensions(currentEvaluationData.ODATA_URL, currentEvaluationData.ODATA_ENTITYSET);
		var allMeasures = sap.suite.ui.smartbusiness.lib.Util.odata.getAllMeasures(currentEvaluationData.ODATA_URL, currentEvaluationData.ODATA_ENTITYSET);
		if(allMeasures.length) {
			if(allMeasures.length == 1) {
				measures[allMeasures[0]] = "M";
			}
			else {
				measures = allMeasures.reduce(function(p,c,i,a) { measures = measures || {}; if(i == 1){ measures[a[0]] = "M"; }  measures[a[i]] = "M"; return measures;});
			}
		}
		if(allDimensions.length) {
			if(allDimensions.length == 1) {
				dimensions[allDimensions[0]] = "D";
			}
			else {
				dimensions = allDimensions.reduce(function(p,c,i,a) { dimensions = dimensions || {}; if(i == 1){ dimensions[a[0]] = "D"; }  dimensions[a[i]] = "D"; return dimensions;});
			}
		}
		
		var error = null;
		this.diffHeaders = [];
		
		for(var i=0,l=masterData.FILTERS.length; i<l; i++) {
			delete masterData.FILTERS[i].__metadata;
			if(dimensions[masterData.FILTERS[i].DIMENSION] != "D") {
				if(error == null) {
					error = {};
				}
				if(error.DIMENSIONS == undefined) {
					error.DIMENSIONS = {};
				}
				if(error.DIMENSIONS[masterData.FILTERS[i].DIMENSION] == undefined) {
					error.DIMENSIONS[masterData.FILTERS[i].DIMENSION] = [];
				} 
				masterData.FILTERS[i].entityType = "FILTER";
				error.DIMENSIONS[masterData.FILTERS[i].DIMENSION].push(masterData.FILTERS[i]);
			}
		}
		
		for(var i=0,l=masterData.CHART.length; i<l; i++) {
			delete masterData.CHART[i].__metadata;
			if(masterData.CHART[i].THRESHOLD_MEASURE) {
				if(measures[masterData.CHART[i].THRESHOLD_MEASURE] != "M") {
					if(error == null) {
						error = {};
					}
					if(error.MEASURES == undefined) {
						error.MEASURES = {};
					}
					if(error.MEASURES[masterData.CHART[i].THRESHOLD_MEASURE] == undefined) {
						error.MEASURES[masterData.CHART[i].THRESHOLD_MEASURE] = [];	
					}
					masterData.CHART[i].entityType = "THRESHOLD_MEASURE";
					error.MEASURES[masterData.CHART[i].THRESHOLD_MEASURE].push(masterData.CHART[i]);
				}
			}
		}

		for(var i=0,l=masterData.COLUMNS.length; i<l; i++) {
			delete masterData.COLUMNS[i].__metadata;
			var measure = null;
			var dimension = null;
			if(masterData.COLUMNS[i].TYPE == "MEASURE") {
				if((measures[masterData.COLUMNS[i].NAME] != "M")) {
					if(error == null) {
						error = {};
					}
					if(error.MEASURES == undefined) {
						error.MEASURES = {};
					}
					if(error.MEASURES[masterData.COLUMNS[i].NAME] == undefined) {
						error.MEASURES[masterData.COLUMNS[i].NAME] = [];	
					}
					masterData.COLUMNS[i].entityType = "MEASURE";
					error.MEASURES[masterData.COLUMNS[i].NAME].push(masterData.COLUMNS[i]);
					//error.MEASURES[masterData.COLUMNS[i].NAME][error.MEASURES[masterData.COLUMNS[i].NAME].length-1].entityType = "MEASURE";
				}
				if((measures[masterData.COLUMNS[i].SORT_BY] != "M")) {
					if(error == null) {
						error = {};
					}
					if(error.MEASURES == undefined) {
						error.MEASURES = {};
					}
					if(error.MEASURES[masterData.COLUMNS[i].SORT_BY] == undefined) {
						error.MEASURES[masterData.COLUMNS[i].SORT_BY] = [];	
					}
					measure = jQuery.extend(true, {}, masterData.COLUMNS[i], {});
					measure.entityType = "SORT_BY";
					error.MEASURES[masterData.COLUMNS[i].SORT_BY].push(measure);
				}
			}
			else if(masterData.COLUMNS[i].TYPE == "DIMENSION") {
				if((dimensions[masterData.COLUMNS[i].NAME] != "D")) {
					if(error == null) {
						error = {};
					}
					if(error.DIMENSIONS == undefined) {
						error.DIMENSIONS = {};
					}
					if(error.DIMENSIONS[masterData.COLUMNS[i].NAME] == undefined) {
						error.DIMENSIONS[masterData.COLUMNS[i].NAME] = [];	
					}
					masterData.COLUMNS[i].entityType = "DIMENSION";
					error.DIMENSIONS[masterData.COLUMNS[i].NAME].push(masterData.COLUMNS[i]);
					//error.DIMENSIONS[masterData.COLUMNS[i].NAME][error.DIMENSIONS[masterData.COLUMNS[i].NAME].length-1].entityType = "DIMENSION";
				}
				if((dimensions[masterData.COLUMNS[i].SORT_BY] != "D")) {
					if(error == null) {
						error = {};
					}
					if(error.DIMENSIONS == undefined) {
						error.DIMENSIONS = {};
					}
					if(error.DIMENSIONS[masterData.COLUMNS[i].SORT_BY] == undefined) {
						error.DIMENSIONS[masterData.COLUMNS[i].SORT_BY] = [];	
					}
					dimension = jQuery.extend(true, {}, masterData.COLUMNS[i], {});
					dimension.entityType = "SORT_BY";
					error.DIMENSIONS[masterData.COLUMNS[i].SORT_BY].push(dimension);
				}
			}
		}
		
		for(var i=0,l=masterData.HEADER.length; i<l; i++) {
			if(masterData.HEADER[i].EVALUATION_ID !== masterData.HEADER[i].REFERENCE_EVALUATION_ID) {
				this.diffHeaders.push(masterData.HEADER[i]);
			}
			else {
				if((masterData.HEADER[i].VISUALIZATION_TYPE != "NT") && (masterData.HEADER[i].VISUALIZATION_TYPE != "AT")) {
					if((masterData.HEADER[i].VISUALIZATION_TYPE === "CM")) {
						var measuresArr = undefined;
						try{
							measuresArr = JSON.parse(JSON.parse(masterData.HEADER[i].CONFIGURATION).MEASURES);
						}
						catch(e) {
							throw new Error("Failed to parse multiple measures of Comparison Chart Multiple Measures");
						}
						
						for(var j=0,m=measuresArr.length; i<m; i++) {
							if(measures[measuresArr[j]["name"]] != "M") {
								masterData.HEADER[i].entityType = "HEADERS";
								if(error == null) {
									error = {};
								}
								if(error.MEASURES == undefined) {
									error.MEASURES = {};
								}
								if(error.MEASURES[measuresArr[j]["name"]] == undefined) {
									error.MEASURES[measuresArr[j]["name"]] = [];	
								}
								error.MEASURES[measuresArr[j]["name"]].push(masterData.HEADER[i]);
								break;
							}
						}
					}
					else {
						if(dimensions[masterData.HEADER[i].DIMENSION] != "D") {
							masterData.HEADER[i].entityType = "HEADERS";
							if(error == null) {
								error = {};
							}
							if(error.DIMENSIONS == undefined) {
								error.DIMENSIONS = {};
							}
							if(error.DIMENSIONS[masterData.HEADER[i].DIMENSION] == undefined) {
								error.DIMENSIONS[masterData.HEADER[i].DIMENSION] = [];	
							}
							error.DIMENSIONS[masterData.HEADER[i].DIMENSION].push(masterData.HEADER[i]);
						}
					}
				}
			}
		}
		return error;
	},
	
	copyDDAConfiguration: function() {
		var that = this;
		if(this.copyClipboard && this.copyClipboard.evaluationData) {
			var payload = {sourceEvaluationId:this.copyClipboard.evaluationData.ID, targetEvaluationId: that.evaluationId};
			var callCopyDDA = function(){
				sap.suite.ui.smartbusiness.lib.Util.utils.create(sap.suite.ui.smartbusiness.lib.Util.utils.serviceUrl("COPY_DDA_CONFIGURATION_SERVICE_URI"),payload,null,function(data){
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DDA_COPY_SUCCESS"));
					that.oApplicationFacade.__refreshModel = 1;
					sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action:"configureSBKPIDrilldown", route:"detail", context: "EVALUATIONS_MODELER(ID='" + that.evaluationId + "',IS_ACTIVE=1)"});
					//that.getView().getModel().refresh();
				},function(err){
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DDA_COPY_ERROR"), err.responseText);
					});
			};
			callCopyDDA();
		}
	},
	
	onAfterRendering: function() {
		
	}

});
