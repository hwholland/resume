/*
 * Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");

jQuery.sap.require("sap.ca.ui.images.images");
jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("/") + "/sap/ca/scfld/md/css/flower.css");

sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.visualization.view.emptyView", {

	onInit : function() {
		var oImage = this.byId("flower");
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
		var that = this;
		if(this.oApplicationFacade.navigatingWithinDrilldown) {
			this.navigatingWithinDrilldown = true;
			this.oApplicationFacade.navigatingWithinDrilldown = undefined;
		} 
		else {
			this.navigatingWithinDrilldown = false;
		}
		this.busyDialog = new sap.m.BusyDialog();
		//the route handler is only here for backwards compatibility
		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "noDataView") {
				this.evalContext = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
				var oArgument = oEvent.getParameter("arguments");
				this.setTitleAndMessage(oArgument.viewTitle, oArgument.languageKey);
				 
				this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
				this.confRef = sap.suite.ui.smartbusiness.Configuration;
				this.constantsRef = this.confRef.Constants;
				this.tileTypeConst = this.constantsRef.TileType;
				this.PLATFORM = this.metadataRef.getPlatform();
				this.env = 0;
				this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
				
				if(this.PLATFORM == this.constantsRef.Platform.ABAP) {
					this.isPlatformABAP = true;
				}
				else {
					this.isPlatformABAP = false;
				}
				
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
					}					]
					this.oHeaderFooterOptions.additionalShareButtonList = [];
				}

				
				// Fetch System Environment info => Either running on SAP env or CUST env
				function sysInfoFetchCallBack(d) {
					that.env = d;
					//that.sScope = d.SYS_FLAG ? "CONF" : "CUST"; 
				}
				
				function sysInfoFetchErrCallBack(d,s,x) {
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_SYS_INFO"), d.response.body);
				}
				
				this.metadataRef.getSystemInfo({async:false, success:sysInfoFetchCallBack, error:sysInfoFetchErrCallBack, model:this.oDataModel});
			}
		}, this);
	},
	
	handleEvalDelete: function() {
		var that = this;
		var modelData = {EVALUATION:that.evalContext.getObject()};
		
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
	},
	
	getHeaderFooterOptions : function() {
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
	
	refreshMasterList: function() {
		var that = this;
		that.utilsRef.refreshMasterList(that,false);
	}
});