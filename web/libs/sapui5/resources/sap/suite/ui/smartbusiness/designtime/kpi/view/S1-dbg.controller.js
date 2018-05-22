/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/

jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.IDGenerator");
jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/kpi/view/KpiParametersCss.css");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.kpi.view.S1", {

	onInit : function() {
		var that = this;
		this.RESERVED_KPI_ID_NAMESPACE = ".sap.sample";
		
		this.HANA = "hana";
		this.CDS = "cds";
		this.VIEW_MODE = this.HANA;
		var urlParam;

		this.errorMessages = [];
		this.errorState = false;

		jQuery.sap.require("sap.suite.ui.smartbusiness.lib.AppSetting");
		sap.suite.ui.smartbusiness.lib.AppSetting.init({
			oControl : that.byId("kpiId"),
			controllerReference : that,
			hideElement  : "input",
			i18n: {
				checkBoxText: that.oApplicationFacade.getResourceBundle().getText("CHECKBOX_TEXT"),
				saveText: that.oApplicationFacade.getResourceBundle().getText("OK"),
				cancelText: that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				settingsText: that.oApplicationFacade.getResourceBundle().getText("SETTINGS"),
				settingInfoTitle: that.oApplicationFacade.getResourceBundle().getText("SETTING_INFO_TITLE"),
				settingInfoText: that.oApplicationFacade.getResourceBundle().getText("SETTING_INFO_TEXT")
			},
			title : that.oApplicationFacade.getResourceBundle().getText("SETTINGS_SB"),
			action: that.generateKpiId
		});
		this.settingModel = sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");
		this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");
		/* use url parameter `?viewmode=cds` to launch app based on an CDS view */
		if(urlParam = jQuery.sap.getUriParameters().get("viewmode")) {
			if(urlParam.toLowerCase && urlParam.toLowerCase() == this.CDS)
				this.VIEW_MODE = this.CDS;
		}
		this.getView().getModel().oData["VIEW_MODE"] = this.VIEW_MODE;
		
		
		//Adapter Implementation ---
		this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
		sap.suite.ui.smartbusiness.sb_createkpi = this;
		
		this.kpiCreateModel = new sap.ui.model.json.JSONModel();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		
		/**********************************************CDS based OData services****************************************************
		 * >get all CDS views
		 * 		/sap/opu/odata/SSB/CDS_ODATA_ENTITY_FETCH_SRV_01/CDSViewSet
		 * >get all OData urls
		 * 		/sap/opu/odata/SSB/CDS_ODATA_ENTITY_FETCH_SRV_01/PackOdataSet
		 * >get OData urls from selected CDS view (example)
		 * 		/sap/opu/odata/SSB/CDS_ODATA_ENTITY_FETCH_SRV_01/CDSViewSet(CdsName='%2FSSB%2FEVAL_FILTRS')/?$expand=ODATAnameSet
		 * >get relevant EntitySets from selected CDS view and selected odata (example)
		 * 		/sap/opu/odata/SSB/CDS_ODATA_ENTITY_FETCH_SRV_01/ODATAnameSet(CdsName='%2FSSB%2FC_EVALUATIONFILTERS',OdataName='',OdataURL='%2Fsap%2Fopu%2Fodata%2FSSB%2FSMART_BUSINESS_SRV',SrvName='',SrvVersion='',SrvNamespace='')/?$expand=EntityTypeSet
		 ****************************************************************************************************************************/
		if(this.VIEW_MODE == this.CDS) {
			this.oDataModelCDS = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SSB/CDS_ODATA_ENTITY_FETCH_SRV_01");
			this.oDataModelCDS.attachMetadataFailed(function(s){sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_CDS_MODE"))});
			this.byId("kpiId").setMaxLength(40);
		}
		else if(this.VIEW_MODE == this.HANA){
			this.byId("kpiId").setMaxLength(512);
		}
		
		this.viewData = {};
		this.oResourceBundle = this.oApplicationFacade.getResourceBundle();
		
		//Adapter Implementation ---
		
		// Fetch All Sap Languages - Adapter Implementation
		var langSuccessHandler = function(obj, arr, localeLanguage) {
			that.SAP_LANGUAGES = obj;
			that.SAP_LANGUAGE_ARRAY = arr;
			that.localLanguage = localeLanguage;
		};
		this.metadataRef.getAllLanguages({async:false, success:langSuccessHandler, model:this.oDataModel});

		this.oOptions = {
				bSuppressBookmarkButton : {},
				onBack : function(){
					that.cancel();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.save();
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE_CREATE_NEW",
					onBtnPressed : function(evt) {
						that.saveAndCreateNew();
					}
				},{
					sI18nBtnTxt : "SAVE_ACTIVATE",
					onBtnPressed : function(evt) {
						that.saveAndActivate();
					}
				},{
					sI18nBtnTxt : "ACTIVATE_CREATE_NEW",
					onBtnPressed : function(evt) {
						that.activateAndCreateNew();
					}
				},{
					sI18nBtnTxt : "ACTIVATE_ADD_EVAL",
					onBtnPressed : function(evt) {
						that.activateAndAddEvaluation();
					}
				},{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.cancel();
					}
				}]
		};

		this.oErrorOptions = {
				bSuppressBookmarkButton : {},
				onBack : function(){
					that.cancel();
				},
				oNegativeAction : {
					sControlId : "errorBtn",
					sId : "errorBtn",
					sIcon : "sap-icon://alert",
					bDisabled : false,
					onBtnPressed : function(event){
						sap.suite.ui.smartbusiness.lib.Util.utils.handleMessagePopover(event,that);
					}
				},

				buttonList : [{
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.save();
					}
				},{
					sI18nBtnTxt : "SAVE_CREATE_NEW",
					onBtnPressed : function(evt) {
						that.saveAndCreateNew();
					}
				},{
					sI18nBtnTxt : "SAVE_ACTIVATE",
					onBtnPressed : function(evt) {
						that.saveAndActivate();
					}
				},{
					sI18nBtnTxt : "ACTIVATE_CREATE_NEW",
					onBtnPressed : function(evt) {
						that.activateAndCreateNew();
					}
				},{
					sI18nBtnTxt : "ACTIVATE_ADD_EVAL",
					onBtnPressed : function(evt) {
						that.activateAndAddEvaluation();
					}
				},{
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.cancel();
					}
				}]
		};

		this.editDraftOptions = {
				bSuppressBookmarkButton : {},
				sI18NFullscreenTitle : "FULLSCREEN_EDIT_TITLE",
				onBack : function(){
					that.cancel();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.save();
					}
				},
				buttonList : [{
					sI18nBtnTxt : "SAVE_ACTIVATE",
					onBtnPressed : function(evt) {
						that.saveAndActivate();
					}
				}, {
					sI18nBtnTxt : "DELETE_DRAFT",
					onBtnPressed : function(evt) {
						that.deleteDraft();
					}
				}, {
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.cancel();
					}
				}]
		};

		this.oErrorOptionsForDraft = {
				bSuppressBookmarkButton : {},
				sI18NFullscreenTitle : "FULLSCREEN_EDIT_TITLE",
				onBack : function(){
					that.cancel();
				},
				oNegativeAction : {
					sControlId : "errorBtn",
					sId : "errorBtn",
					sIcon : "sap-icon://alert",
					bDisabled : false,
					onBtnPressed : function(event){
						sap.suite.ui.smartbusiness.lib.Util.utils.handleMessagePopover(event,that);
					}
				},

				buttonList : [{
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.save();
					}
				},{
					sI18nBtnTxt : "SAVE_ACTIVATE",
					onBtnPressed : function(evt) {
						that.saveAndActivate();
					}
				}, {
					sI18nBtnTxt : "DELETE_DRAFT",
					onBtnPressed : function(evt) {
						that.deleteDraft();
					}
				}, {
					sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.cancel();
					}
				}]
		};

		this.valid_maxlength = {};
		this.valid_maxlength.hana = {
				id: 512,
				title: 128,
		};
		this.valid_maxlength.cds = {
				id: 40,
				title: 40,
		};

		this.setHeaderFooterOptions(this.oOptions);

		this.byId("kpiGoalTypeSelect").attachChange(function goalTypeChange(evt) {
			evt.getSource().setTooltip(evt.getParameters().selectedItem.getText());
		});
		
		this.oRouter.attachRouteMatched(function(evt){
			that.route = evt.getParameter("name");
			if(evt.getParameter("name") == "editKpi"){
				that.context = new sap.ui.model.Context(that.getView().getModel(), '/' + (evt.getParameter("arguments").contextPath));

				var id = (/ID=\'.*\'/).exec(evt.getParameter("arguments").contextPath)[0];
				var kpiId = id.slice(id.indexOf("'")+1,id.lastIndexOf("'"));

				var active = (/IS_ACTIVE=.*/).exec(evt.getParameter("arguments").contextPath)[0];
				var is_active = active.slice(active.indexOf("=")+1,active.lastIndexOf(")"));

				that.viewData = {
						mode : "EDIT",
						ID : kpiId,
						IS_ACTIVE : parseInt(is_active)
				}
				if(that.viewData.IS_ACTIVE == 1){
					that.viewData.IS_DRAFT = true;
				}
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"));
				try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                            sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"));
                    }
				} catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"))
				}
			}
			else if(evt.getParameter("name") == "editDraftKpi"){
				that.editDraft = true;
				that.context = new sap.ui.model.Context(that.getView().getModel(), '/' + (evt.getParameter("arguments").contextPath));

				var id = (/ID=\'.*\'/).exec(evt.getParameter("arguments").contextPath)[0];
				var kpiId = id.slice(id.indexOf("'")+1,id.lastIndexOf("'"));

				var active = (/IS_ACTIVE=.*/).exec(evt.getParameter("arguments").contextPath)[0];
				var is_active = active.slice(active.indexOf("=")+1,active.lastIndexOf(")"));

				that.viewData = {
						mode : "EDIT",
						ID : kpiId,
						IS_ACTIVE : parseInt(is_active),
						IS_DRAFT : true
				}
				that.setHeaderFooterOptions(that.editDraftOptions);
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"));
				try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                            sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"));
                    }
				} catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_EDIT_TITLE"))
				}
			}
			else if(evt.getParameter("name") == "duplicateKpi"){
				that.context = new sap.ui.model.Context(that.getView().getModel(), '/' + (evt.getParameter("arguments").contextPath));

				var id = (/ID=\'.*\'/).exec(evt.getParameter("arguments").contextPath)[0];
				var kpiId = id.slice(id.indexOf("'")+1,id.lastIndexOf("'"));

				var active = (/IS_ACTIVE=.*/).exec(evt.getParameter("arguments").contextPath)[0];
				var is_active = active.slice(active.indexOf("=")+1,active.lastIndexOf(")"));

				that.viewData = {
						mode : "DUPLICATE",
						ID : kpiId,
						IS_ACTIVE : parseInt(is_active)
				}
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_TITLE"));
			}
			else{
				that.viewData = {
						mode : "CREATE",
				}
				that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_TITLE"));
			}

			if (that.viewData.mode == "CREATE") {
				var kpiModelData = {};
				kpiModelData.MODE = "CREATE";
				kpiModelData.TYPE = "KPI";
				kpiModelData.KPITYPE = true;
				kpiModelData.OPITYPE = false;
				kpiModelData.NO_OF_ADDITIONAL_LANGUAGES = 0;
				kpiModelData.ADDITIONAL_LANGUAGE_ARRAY = [];
				kpiModelData.GOAL_TYPE = "MA";
				kpiModelData.VIEW_MODE = that.VIEW_MODE;

				that.kpiModelDataForDirtyBitCheck = $.extend(true,{},kpiModelData);

				that.kpiCreateModel.setData(kpiModelData);
				that.getView().setModel(that.kpiCreateModel);
				that.generateKpiId(that);
			} else if (that.viewData.mode == "EDIT" || that.viewData.mode == "DUPLICATE") {
				
				//Adapter Implementation ---

				var indicatorFetchCallBack = function(indicator) {
					var indicatorData = indicator.INDICATOR;
					that.indicatorPayloadForDirtyBitTest = $.extend(true,{},indicatorData);
					var tagData = indicator.TAGS;
					var propertiesData = indicator.PROPERTIES;
					var languageData = indicator.TEXTS;
					
					//indicator info
					indicatorData.MODE = that.viewData.mode;
					indicatorData.VIEW_MODE = that.VIEW_MODE;
					if (indicatorData.TYPE == "KPI") {
						indicatorData.KPITYPE = true;
						indicatorData.OPITYPE = false;
					} else if (indicatorData.TYPE == "OPI") {
						indicatorData.KPITYPE = false;
						indicatorData.OPITYPE = true;
					}

					//tags
					tagData = (tagData.results) ? tagData.results : tagData;
					var tagArray = [];
					var i;
					for(i=0;i<tagData.length;i++){
						tagArray.push(tagData[i].TAG);
					}
					indicatorData.TAGS = tagArray;
					indicatorData.TAG = indicatorData.TAGS.toString(",");
					that.OLD_TAGS = tagArray;

					//properties
					propertiesData = (propertiesData.results) ? propertiesData.results : propertiesData;
					var propertiesArray = [];
					var i;
					for(i=0;i<propertiesData.length;i++){
						var propertiesObject = {};
						propertiesObject.NAME = propertiesData[i].NAME,
						propertiesObject.VALUE = propertiesData[i].VALUE
						propertiesArray.push(propertiesObject);
					}
					indicatorData.PROPERTIES = propertiesArray;
					that.OLD_PROPERTIES = $.extend(true,[], propertiesArray);

					//languages
					languageData = (languageData.results) ? languageData.results : languageData;
					var additionalLanguageData = [];
					var i;
					for(i=0;i<languageData.length;i++){
						if(languageData[i].LANGUAGE != that.localLanguage){
							additionalLanguageData.push(languageData[i]);
						}
					}
					var languageArray = [];
					var i;
					for(i=0;i<additionalLanguageData.length;i++){
						var languageObject = {};
						languageObject.ADDITIONAL_LANGUAGE_TITLE = additionalLanguageData[i].TITLE;
						languageObject.ADDITIONAL_LANGUAGE_DESCRIPTION = additionalLanguageData[i].DESCRIPTION;
						languageObject.ADDITIONAL_LANGUAGE_SPRAS_KEY = additionalLanguageData[i].LANGUAGE;
						if(that.SAP_LANGUAGES) {
							languageObject.ADDITIONAL_LANGUAGE_KEY = that.SAP_LANGUAGES.SPRAS[additionalLanguageData[i].LANGUAGE]; 
						}
						else {
							languageObject.ADDITIONAL_LANGUAGE_KEY = "";
						}
						languageArray.push(languageObject);
					}
					indicatorData.ADDITIONAL_LANGUAGE_ARRAY = languageArray;
					indicatorData.NO_OF_ADDITIONAL_LANGUAGES = indicatorData.ADDITIONAL_LANGUAGE_ARRAY.length; 
					that.OLD_ADDITIONAL_LANGUAGE_ARRAY = languageArray;


					/// Code to be removed

					/*
                                                                                that.oDataModel.read("/TAGS?$filter=ID eq '" + indicatorData.ID + "' and IS_ACTIVE eq " + indicatorData.IS_ACTIVE + " and TYPE eq 'IN'", null, null, false, function(tagData) {

                                                                                },function(error){
                                                                                                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_FETCHING_TAGS"));
                                                                                });

                                                                                that.oDataModel.read("/PROPERTIES?$filter=ID eq '" + indicatorData.ID + "' and IS_ACTIVE eq " + indicatorData.IS_ACTIVE + " and TYPE eq 'IN'", null, null, false, function(propertiesData) {

                                                                                },function(error){
                                                                                                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_FETCHING_PROPERTIES"));
                                                                                });

                                                                                that.oDataModel.read("/INDICATOR_TEXTS?$filter=ID eq '" + indicatorData.ID + "' and IS_ACTIVE eq " + indicatorData.IS_ACTIVE, null, null, false, function(languageData) {

                                                                                },function(error){
                                                                                                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_FETCHING_ADDITIONAL_LANGUAGES"));
                                                                                });
					 */

					that.kpiCreateModel.setData(indicatorData);
					that.getView().setModel(that.kpiCreateModel);

					if(indicatorData.MODE == "EDIT"){
						that.getView().byId("kpiId").setEditable(false);
					}
					if(indicatorData.MODE == "DUPLICATE"){
						that.generateKpiId(that);
					}
				};

				var indicatorFetchErrCallBack = function(error){
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("YMSG_ERROR_RETRIEVING_DATA"));
					that.errorMessages.push({
						"type":"Error",
						"title":that.oResourceBundle.getText("YMSG_ERROR_RETRIEVING_DATA")
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);

				};

				that.metadataRef.getKPIById({ID:that.viewData.ID, IS_ACTIVE:that.viewData.IS_ACTIVE, texts:true, tags:true, properties:true, async:false, entity:"INDICATORS", success:indicatorFetchCallBack, error:indicatorFetchErrCallBack, model:that.oDataModel});


				/// Code to be removed
				/*
                                                                that.oDataModel.read("/INDICATORS(ID='" + that.viewData.ID  + "',IS_ACTIVE="             + that.viewData.IS_ACTIVE + ")", null, null, false, function(indicatorData) {
                                                                                that.indicatorPayloadForDirtyBitTest = $.extend(true,{},indicatorData);

                                                                                indicatorData.MODE = that.viewData.mode;
                                                                                indicatorData.VIEW_MODE = that.VIEW_MODE;
                                                                                if (indicatorData.TYPE == "KPI") {
                                                                                                indicatorData.KPITYPE = true;
                                                                                                indicatorData.OPITYPE = false;
                                                                                } else if (indicatorData.TYPE == "OPI") {
                                                                                                indicatorData.KPITYPE = false;
                                                                                                indicatorData.OPITYPE = true;
                                                                                }

                                                                                that.oDataModel.read("/TAGS?$filter=ID eq '" + indicatorData.ID + "' and IS_ACTIVE eq " + indicatorData.IS_ACTIVE + " and TYPE eq 'IN'", null, null, false, function(tagData) {
                                                                                                tagData = tagData.results;
                                                                                                var tagArray = [];
                                                                                                var i;
                                                                                                for(i=0;i<tagData.length;i++){
                                                                                                                tagArray.push(tagData[i].TAG);
                                                                                                }
                                                                                                indicatorData.TAGS = tagArray;
                                                                                                indicatorData.TAG = indicatorData.TAGS.toString(",");
                                                                                                that.OLD_TAGS = tagArray;
                                                                                },function(error){
                                                                                                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_FETCHING_TAGS"));
                                                                                });

                                                                                that.oDataModel.read("/PROPERTIES?$filter=ID eq '" + indicatorData.ID + "' and IS_ACTIVE eq " + indicatorData.IS_ACTIVE + " and TYPE eq 'IN'", null, null, false, function(propertiesData) {
                                                                                                propertiesData = propertiesData.results;
                                                                                                var propertiesArray = [];
                                                                                                var i;
                                                                                                for(i=0;i<propertiesData.length;i++){
                                                                                                                var propertiesObject = {};
                                                                                                                propertiesObject.NAME = propertiesData[i].NAME,
                                                                                                                propertiesObject.VALUE = propertiesData[i].VALUE

                                                                                                                propertiesArray.push(propertiesObject);
                                                                                                }
                                                                                                indicatorData.PROPERTIES = propertiesArray;
                                                                                                that.OLD_PROPERTIES = $.extend(true,[], propertiesArray);
                                                                                },function(error){
                                                                                                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_FETCHING_PROPERTIES"));
                                                                                });

                                                                                that.oDataModel.read("/INDICATOR_TEXTS?$filter=ID eq '" + indicatorData.ID + "' and IS_ACTIVE eq " + indicatorData.IS_ACTIVE, null, null, false, function(languageData) {
                                                                                                languageData = languageData.results;
                                                                                                var additionalLanguageData = [];
                                                                                                var i;
                                                                                                for(i=0;i<languageData.length;i++){
                                                                                                                if(languageData[i].LANGUAGE != that.localLanguage){
                                                                                                                                additionalLanguageData.push(languageData[i]);
                                                                                                                }
                                                                                                }
                                                                                                var languageArray = [];
                                                                                                var i;
                                                                                                for(i=0;i<additionalLanguageData.length;i++){
                                                                                                                var languageObject = {};
                                                                                                                languageObject.ADDITIONAL_LANGUAGE_TITLE = additionalLanguageData[i].TITLE;
                                                                                                                languageObject.ADDITIONAL_LANGUAGE_DESCRIPTION = additionalLanguageData[i].DESCRIPTION;
                                                                                                                languageObject.ADDITIONAL_LANGUAGE_SPRAS_KEY = additionalLanguageData[i].LANGUAGE;
                                                                                                                that.oDataModel.read("/LANGUAGE?$filter=SPRAS eq '"+additionalLanguageData[i].LANGUAGE+"'", null, null, false, function(data) {
                                                                                                                                languageObject.ADDITIONAL_LANGUAGE_KEY = data.results[0].LAISO;
                                                                                                                });
                                                                                                                languageArray.push(languageObject);
                                                                                                }
                                                                                                indicatorData.ADDITIONAL_LANGUAGE_ARRAY = languageArray;
                                                                                                indicatorData.NO_OF_ADDITIONAL_LANGUAGES = indicatorData.ADDITIONAL_LANGUAGE_ARRAY.length; 
                                                                                                that.OLD_ADDITIONAL_LANGUAGE_ARRAY = languageArray;
                                                                                },function(error){
                                                                                                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_FETCHING_ADDITIONAL_LANGUAGES"));
                                                                                });

                                                                                that.kpiCreateModel.setData(indicatorData);
                                                                                that.getView().setModel(that.kpiCreateModel);

                                                                                if(indicatorData.MODE == "EDIT"){
                                                                                                that.getView().byId("kpiId").setEditable(false);
                                                                                }

                                                                },function(error){
                                                                                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("YMSG_ERROR_RETRIEVING_DATA"));
                                                                });
				 */

			}
			var form = that.getView().byId('kpiParameterInputForm');
			form.addContent(new sap.m.Label({
				text : that.oResourceBundle.getText("PROPERTY_NAME_VALUE")
			}));

			if (that.viewData.mode === "EDIT" || that.viewData.mode === "DUPLICATE") {
				that.byId("odataServiceInput").fireChange();
			}

			that.getView().byId("propertyNameValueBox").bindAggregation("items", "/PROPERTIES", function(a, b) {
				return new sap.ui.layout.Grid({
					content : [new sap.m.Input({
						value : "{NAME}",
						layoutData : new sap.ui.layout.GridData({
							span : "L4 M4 S4"
						})
					}), new sap.m.Input({
						value : "{VALUE}",
						layoutData : new sap.ui.layout.GridData({
							span : "L4 M4 S4"
						})
					}), new sap.m.Button({
						icon : "sap-icon://sys-cancel",
						type : "Transparent",
						layoutData : new sap.ui.layout.GridData({
							span : "L2 M2 S2"
						}),
						press : function(evt) {
							that.removeProperty(evt);
						}
					})],
					defaultSpan : "L12 M12 S12"
				}).addStyleClass("propertyEntryGrid");
			});

		});
	},

	onAfterRendering: function() {
		this.byId("kpiGoalTypeSelect").setTooltip(this.byId("kpiGoalTypeSelect").getSelectedItem().getText());
	},
	
	setFooterOnError : function(){
		var that = this;
		
		if(this.editDraft === true){
			if(this.errorMessages.length > 1){
				this.setHeaderFooterOptions(this.oErrorOptionsForDraft);
			}
			else{
				this.setHeaderFooterOptions(this.editDraftOptions);
			}
		}
		else{
			if(this.errorMessages.length > 1){
				this.setHeaderFooterOptions(this.oErrorOptions);
			}
			else{
				this.setHeaderFooterOptions(this.oOptions);
			}
		}
	},

	save : function() {

		var that = this;
		that.errorMessages = [];
		this.errorState = false;
		var successStatus = this.saveKpiDetails();
		if(successStatus){
			if(this.viewData.IS_DRAFT){
				sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: "INDICATORS_MODELER(ID='"+this.getView().getModel().getData().ID+"',IS_ACTIVE=1)"});
			}
			else{
				if(sap.suite.ui.smartbusiness.modelerAppCache && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace) {
					sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: "INDICATORS_MODELER(ID='"+this.getView().getModel().getData().ID+"',IS_ACTIVE=0)"});
				}
				else{
					sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({});
				}
			}
		}
		else{
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(this);
		}
	},

	activateAndAddEvaluation : function() {
		var that=this;
		var successStatus = false;
		var activationStatus = false;
		that.errorMessages = [];
		that.errorState = false;
		successStatus = this.saveKpiDetails();
		if(successStatus){
			var payload = {
					ID : this.getView().getModel().getData().ID
			};
			//Adapter Implementation ---->> NOT DONE

			that.metadataRef.create('ACTIVATE_INDICATOR',payload,null,function(data){
				if(that.getView().getModel().getData().TYPE == "KPI"){
					sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_KPI_SUCCESS"));
				}
				else{
					sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_OPI_SUCCESS"));
				}
				activationStatus = true;
			},function(error){
				if(that.getView().getModel().getData().TYPE == "KPI"){
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_KPI_ERROR"));
					that.errorMessages.push({
						"type":"Error",
						"title":that.oResourceBundle.getText("ACTIVATE_KPI_ERROR")
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
				}
				else{
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_OPI_ERROR"));
					that.errorMessages.push({
						"type":"Error",
						"title":that.oResourceBundle.getText("ACTIVATE_OPI_ERROR")
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
				}
				activationStatus = false;
			});                                           
		}
		else{
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(this);
		}
		if(activationStatus){
			sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "createSBKPIEvaluation", route: "addEvaluation", context: "INDICATORS_MODELER(ID='"+this.getView().getModel().getData().ID+"',IS_ACTIVE=1)"});
		}

	},

	saveAndCreateNew : function() {

		var that = this;
		this.errorMessages = [];
		this.errorState = false;
		var successStatus = this.saveKpiDetails();
		if(successStatus){

			var kpiModelData = {};
			kpiModelData.MODE = "CREATE";
			kpiModelData.NO_OF_ADDITIONAL_LANGUAGES = 0;
			kpiModelData.ADDITIONAL_LANGUAGE_ARRAY = [];
			kpiModelData.GOAL_TYPE = "MA";
			kpiModelData.KPITYPE = true;
			kpiModelData.OPITYPE = false;
			kpiModelData.TYPE = "KPI";
			this.kpiCreateModel.setData(kpiModelData);

			this.getView().setModel(this.kpiCreateModel);
			this.getView().getModel().getData().KPITYPE = true;
			this.getView().getModel().getData().OPITYPE = false;
			this.getView().getModel().getData().TYPE = "KPI";
			this.getView().byId("KPI").setSelected(true);
			this.getView().byId("OPI").setSelected(false);
			this.getView().getModel().updateBindings();

			this.getView().byId('kpiId').setEditable(true);
			this.getView().byId('viewInput').fireChange();
			this.kpiModelDataForDirtyBitCheck = $.extend(true,{},kpiModelData);
			sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "createSBKPI"});
			that.generateKpiId(that);
		}
		else{
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(this);
		}

	},

	activateAndCreateNew : function(){
		var that = this;
		this.errorMessages = [];
		this.errorState = false;
		var successStatus = this.saveKpiDetails();
		if(successStatus){
			var payload = {
					ID : this.getView().getModel().getData().ID
			};

			/// Adapter Implementation ---->> NOT DONE

			that.metadataRef.create('ACTIVATE_INDICATOR',payload,null,function(data){
				if(that.getView().getModel().getData().TYPE == "KPI"){
					sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_KPI_SUCCESS"));
				}
				else{
					sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_OPI_SUCCESS"));
				}
				activationStatus = true;
			},function(error){
				if(that.getView().getModel().getData().TYPE == "KPI"){
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_KPI_ERROR"));
					that.errorMessages.push({
						"type":"Error",
						"title":that.oResourceBundle.getText("ACTIVATE_KPI_ERROR")
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
				}
				else{
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_OPI_ERROR"));
					that.errorMessages.push({
						"type":"Error",
						"title":that.oResourceBundle.getText("ACTIVATE_KPI_ERROR")
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
				}
				activationStatus = false;
			});

		}

		if(activationStatus){

			var kpiModelData = {};
			kpiModelData.MODE = "CREATE";
			kpiModelData.NO_OF_ADDITIONAL_LANGUAGES = 0;
			kpiModelData.ADDITIONAL_LANGUAGE_ARRAY = [];
			kpiModelData.GOAL_TYPE = "MA";
			kpiModelData.KPITYPE = true;
			kpiModelData.OPITYPE = false;
			kpiModelData.TYPE = "KPI";
			this.kpiCreateModel.setData(kpiModelData);

			this.getView().setModel(this.kpiCreateModel);
			this.getView().getModel().getData().KPITYPE = true;
			this.getView().getModel().getData().OPITYPE = false;
			this.getView().getModel().getData().TYPE = "KPI";
			this.getView().byId("KPI").setSelected(true);
			this.getView().byId("OPI").setSelected(false);
			this.getView().getModel().updateBindings();

			this.getView().byId('kpiId').setEditable(true);
			this.getView().byId('viewInput').fireChange();
			this.kpiModelDataForDirtyBitCheck = $.extend(true,{},kpiModelData);
			sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "createSBKPI"});
			that.generateKpiId(that);
		}
	},

	saveAndActivate : function(){
		var that=this;
		var  successStatus = false;
		var activationStatus = false;
		this.errorMessages =[];
		this.errorState = false;
		successStatus = this.saveKpiDetails();
		if(successStatus){
			var payload = {
					ID : this.getView().getModel().getData().ID
			};

			/// Adapter Implementation ---->> NOT DONE

			that.metadataRef.create('ACTIVATE_INDICATOR',payload,null,function(data){
				if(that.getView().getModel().getData().TYPE == "KPI"){
					sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_KPI_SUCCESS"));
				}
				else{
					sap.m.MessageToast.show(that.oResourceBundle.getText("ACTIVATE_OPI_SUCCESS"));
				}
				activationStatus = true;
			},function(error){
				if(that.getView().getModel().getData().TYPE == "KPI"){
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_KPI_ERROR"));
					that.errorMessages.push({
						"type":"Error",
						"title":that.oResourceBundle.getText("ACTIVATE_KPI_ERROR")
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
				}
				else{
					sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ACTIVATE_OPI_ERROR"));
					that.errorMessages.push({
						"type":"Error",
						"title":that.oResourceBundle.getText("ACTIVATE_OPI_ERROR")
					});
					sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
				}
				activationStatus = false;
			});

		}

		if(activationStatus){

			if(sap.suite.ui.smartbusiness.modelerAppCache && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace) {
				sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: "INDICATORS_MODELER(ID='"+this.getView().getModel().getData().ID+"',IS_ACTIVE=1)"});
			}
			else{
				sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({});
			}
		}
	},

	deleteDraft : function(){
		var that=this;
		var backDialog = new sap.m.Dialog({
			icon:"sap-icon://warning2",
			title:that.oResourceBundle.getText("WARNING"),
			state:"Warning",
			type:"Message",
			content:[new sap.m.Text({text:that.oResourceBundle.getText("WARNING_DELETE_DRAFT_KPI_OPI")})],
			beginButton: new sap.m.Button({
				text:that.oResourceBundle.getText("OK"),
				press: function(){
					backDialog.close();
					that.callDeleteDraft();
				}
			}),
			endButton: new sap.m.Button({
				text:that.oResourceBundle.getText("CANCEL"),
				press:function(){
					backDialog.close();
				}
			})                                                        
		});
		backDialog.open();
	},

	callDeleteDraft: function() {
		var that = this;
		var payload = {};
		payload.ID = that.viewData.ID;
		payload.IS_ACTIVE = that.viewData.IS_ACTIVE;

		///Adapter Implementation ---->> NOT DONE

		that.metadataRef.remove('INDICATOR',payload,function(data){
			if(that.getView().getModel().getData().TYPE == "KPI"){
				sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_KPI_DELETE"));
			}
			else{
				sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_OPI_DELETE"));
			}
			sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: "INDICATORS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)"});

		},function(error){
			if(that.getView().getModel().getData().TYPE == "KPI"){
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_DELETE"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_KPI_DELETE")
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			}
			else{
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_OPI_DELETE"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_OPI_DELETE")
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			}
		});
	},

	cancel : function() {
		var that=this;
		var indicatorChanged = false;
		var languageChanged = false;
		var tagChanged = false;
		var propertiesChanged = false;

		if(this.route === "createKpi"){

			if(that.kpiCreateModel.getData().ADDITIONAL_LANGUAGE_ARRAY && that.kpiCreateModel.getData().ADDITIONAL_LANGUAGE_ARRAY.length){
				languageChanged = true;
			}
			if((that.kpiCreateModel.getData().TAGS && that.kpiCreateModel.getData().TAGS.length) || that.kpiCreateModel.getData().TAG){
				tagChanged = true;
			}
			if(that.kpiCreateModel.getData().PROPERTIES && that.kpiCreateModel.getData().PROPERTIES.length){
				propertiesChanged = true;
			}

			delete that.kpiModelDataForDirtyBitCheck.ADDITIONAL_LANGUAGE_ARRAY;
			delete that.kpiModelDataForDirtyBitCheck.TAG;
			delete that.kpiModelDataForDirtyBitCheck.TAGS;
			delete that.kpiModelDataForDirtyBitCheck.PROPERTIES;
			delete that.kpiCreateModel.getData().ADDITIONAL_LANGUAGE_ARRAY;
			delete that.kpiCreateModel.getData().TAG;
			delete that.kpiCreateModel.getData().TAGS;
			delete that.kpiCreateModel.getData().PROPERTIES;

			var indicatorDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
				oldPayload : that.kpiModelDataForDirtyBitCheck,
				newPayload : that.kpiCreateModel.getData(),
				objectType : "INDICATORS"
			});

			if(indicatorDeltaObject && indicatorDeltaObject.updates.length){
				indicatorChanged = true;
			}

			if(indicatorChanged || languageChanged || tagChanged || propertiesChanged){

				var backDialog = new sap.m.Dialog({
					icon:"sap-icon://warning2",
					title:that.oResourceBundle.getText("WARNING"),
					state:"Warning",
					type:"Message",
					content:[new sap.m.Text({text:that.oResourceBundle.getText("WARNING_UNSAVED_MESSAGE")})],
					beginButton: new sap.m.Button({
						text:that.oResourceBundle.getText("CONTINUE"),
						press: function(){
							backDialog.close();
							window.history.back();
						}
					}),
					endButton: new sap.m.Button({
						text:that.oResourceBundle.getText("CANCEL"),
						press:function(){
							backDialog.close();
						}
					})                                                        
				});
				backDialog.open();
			}
			else{
				window.history.back();
			}
		}

		else{

			var indicatorDelta = that.getIndicatorChanges();
			var tagDelta = that.getTagChanges();
			var propertiesDelta = that.getPropertiesChanges();
			var languageDelta = that.getLanguageChanges();

			if(indicatorDelta && (indicatorDelta.updates.length)){
				indicatorChanged = true;
			}

			if(languageDelta && (languageDelta.updates.length || languageDelta.deletes.length)){
				languageChanged = true;
			}
			if(tagDelta &&(tagDelta.updates.length || tagDelta.deletes.length)){
				tagChanged = true;
			}

			if(propertiesDelta && (propertiesDelta.updates.length || propertiesDelta.deletes.length)){
				propertiesChanged = true;
			}

			if(indicatorChanged || languageChanged || tagChanged || propertiesChanged){
				var backDialog = new sap.m.Dialog({
					icon:"sap-icon://warning2",
					title:that.oResourceBundle.getText("WARNING"),
					state:"Warning",
					type:"Message",
					content:[new sap.m.Text({text:that.oResourceBundle.getText("WARNING_UNSAVED_MESSAGE")})],
					beginButton: new sap.m.Button({
						text:that.oResourceBundle.getText("CONTINUE"),
						press: function(){
							backDialog.close();
							window.history.back();
//							if(sap.suite.ui.smartbusiness.modelerAppCache && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace) {
//	if(that.context) {
//	if(that.route == "editKpi" || that.route == "duplicateKpi") {
//	sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: that.context.sPath.substr(1).replace("INDICATORS","INDICATORS_MODELER")});
//}
//else if(that.route == "editDraftKpi") {
//	sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: that.context.sPath.substr(1).replace("INDICATORS","INDICATORS_MODELER").replace("IS_ACTIVE=0","IS_ACTIVE=1")});
//							}
//							}
//							else {
//							sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace"});
//							}
//							}
//							else {
//							sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({});
//							}
						}
					}),
					endButton: new sap.m.Button({
						text:that.oResourceBundle.getText("CANCEL"),
						press:function(){
							backDialog.close();
						}
					})                                                        
				});
				backDialog.open();
			}
			else{
				window.history.back();
//				if(sap.suite.ui.smartbusiness.modelerAppCache && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace) {
//				if(that.context) {
//				if(that.route == "editKpi" || that.route == "duplicateKpi") {
//				sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: that.context.sPath.substr(1).replace("INDICATORS","INDICATORS_MODELER")});
//				}
//				else if(that.route == "editDraftKpi") {
//				sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace", route: "detail", context: that.context.sPath.substr(1).replace("INDICATORS","INDICATORS_MODELER").replace("IS_ACTIVE=0","IS_ACTIVE=1")});
//				}
//				}
//				else {
//				sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "SBWorkspace"});
//				}
//				}
//				else {
//				sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({});
//				}
			}
		}
	},

	saveKpiDetails : function() {

		//Adapter Implementation ---->> NOT DONE

		var that = this;
		var kpiDetailsModelData = this.kpiCreateModel.getData();
		var successStatus = true;
		var data = {
				errorMsg : []
		};

		//usability improvement - Save appParams without explicit click on "+"
		that.isPropertyAdded = true;
		if(that.getView().byId("kpiPropertyName").getValue() || that.getView().byId("kpiPropertyValue").getValue()){
			that.addNewProperty();
		}
		if(!that.isPropertyAdded){
			return;
		}

		var indicatorPayload = {
				"ID" :    kpiDetailsModelData.ID || "",
				"IS_ACTIVE" : 0,
				"INDICATOR":{
					"DESCRIPTION" : kpiDetailsModelData.DESCRIPTION || "",
					"GOAL_TYPE" : kpiDetailsModelData.GOAL_TYPE || "",
					"TITLE" : kpiDetailsModelData.TITLE || "",
					"TYPE" : kpiDetailsModelData.TYPE || "",
					"OWNER_E_MAIL" : kpiDetailsModelData.OWNER_E_MAIL || "",
					"OWNER_ID" : kpiDetailsModelData.OWNER_ID || "",
					"OWNER_NAME" : kpiDetailsModelData.OWNER_NAME || "",
					"COLUMN_NAME" : kpiDetailsModelData.COLUMN_NAME || "",
					"DATA_SPECIFICATION" : kpiDetailsModelData.DATA_SPECIFICATION || "",
					"ODATA_URL" : kpiDetailsModelData.ODATA_URL || "",
					"ODATA_ENTITYSET" : kpiDetailsModelData.ODATA_ENTITYSET || "",
					"VIEW_NAME" : kpiDetailsModelData.VIEW_NAME || "",
					"ENTITY_TYPE" : "",
					"SEMANTIC_OBJECT" : kpiDetailsModelData.SEMANTIC_OBJECT || "",
					"ACTION" : kpiDetailsModelData.ACTION || ""
				}
		};

		if (!indicatorPayload.ID) {
			if(this.getView().getModel().getData().TYPE === "KPI"){
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_ENTER_KPI_ID")
				});
				data.errorMsg.push({
					text : that.oResourceBundle.getText("ERROR_ENTER_KPI_ID"),
					icon : "sap-icon://error",
					state : sap.ui.core.ValueState.Error
				});
				this.errorState = true;
			}
			else{
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_ENTER_OPI_ID")
				});
				data.errorMsg.push({
					text : that.oResourceBundle.getText("ERROR_ENTER_OPI_ID"),
					icon : "sap-icon://error",
					state : sap.ui.core.ValueState.Error
				});
				this.errorState = true;			
			}
			successStatus = false;
		}

		if (that.byId("kpiId").getValueState() === "Error") {
			if(that.kpiIdEval_reason == "NOT_START_WITH_PERIOD") {
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_CDS_KPI_ID_BEGIN_WITH_PERIOD")
				});
				data.errorMsg.push({
					text : that.oResourceBundle.getText("ERROR_CDS_KPI_ID_BEGIN_WITH_PERIOD"),
					icon : "sap-icon://error",
					state : sap.ui.core.ValueState.Error
				});
				this.errorState = true;			
				that.kpiIdEval_reason = null;
			} else if(that.kpiIdEval_reason == "_START_WITH_PERIOD") {
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_HANA_KPI_ID_BEGIN_WITH_PERIOD")
				});
				data.errorMsg.push({
					text : that.oResourceBundle.getText("ERROR_HANA_KPI_ID_BEGIN_WITH_PERIOD"),
					icon : "sap-icon://error",
					state : sap.ui.core.ValueState.Error
				});
				this.errorState = true;			
				that.kpiIdEval_reason = null;
			} else {
				if(that.byId("kpiId").getValue()){
					that.errorMessages.push({
						"type":"Error",
						"title":that.oResourceBundle.getText("ERROR_ENTER_VALID_KPI_ID")
					});
					data.errorMsg.push({
						text : that.oResourceBundle.getText("ERROR_ENTER_VALID_KPI_ID"),
						icon : "sap-icon://error",
						state : sap.ui.core.ValueState.Error
					});
					this.errorState = true;
				}
			}
			successStatus = false;
		}
		if (!this.validateKpiTitle()) {
			if(this.getView().getModel().getData().TYPE === "KPI"){
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_ENTER_VALID_KPI_TITLE")
				});
				data.errorMsg.push({
					text : that.oResourceBundle.getText("ERROR_ENTER_VALID_KPI_TITLE"),
					icon : "sap-icon://error",
					state : sap.ui.core.ValueState.Error
				});
				this.errorState = true;
			}
			else{
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_ENTER_OPI_TITLE")
				});
				data.errorMsg.push({
					text : that.oResourceBundle.getText("ERROR_ENTER_OPI_TITLE"),
					icon : "sap-icon://error",
					state : sap.ui.core.ValueState.Error
				});
				this.errorState = true;
			}
		}

		if(!indicatorPayload.INDICATOR.TITLE){
			if(this.getView().getModel().getData().TYPE === "KPI"){
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_ENTER_KPI_TITLE")
				});
				data.errorMsg.push({
					text : that.oResourceBundle.getText("ERROR_ENTER_KPI_TITLE"),
					icon : "sap-icon://error",
					state : sap.ui.core.ValueState.Error
				});
				this.errorState = true;			
			}
			else{
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ERROR_ENTER_OPI_TITLE")
				});
				data.errorMsg.push({
					text : that.oResourceBundle.getText("ERROR_ENTER_OPI_TITLE"),
					icon : "sap-icon://error",
					state : sap.ui.core.ValueState.Error
				});
				this.errorState = true;			
			}
			this.getView().byId('kpiTitle').setValueState("Error");
			successStatus = false;
		}
		if(that.byId("kpiOwnerEmail").getValueState() === "Error"){
			that.errorMessages.push({
				"type":"Error",
				"title":that.oResourceBundle.getText("ERROR_ENTER_VALID_KPI_EMAIL")
			});
			data.errorMsg.push({
				text : that.oResourceBundle.getText("ERROR_ENTER_VALID_KPI_EMAIL"),
				icon : "sap-icon://error",
				state : sap.ui.core.ValueState.Error
			});
			this.errorState = true;			
			successStatus = false;
		}

		if(that.byId("semanticObject").getValueState() === "Error"){
			that.errorMessages.push({
				"type":"Error",
				"title":that.oResourceBundle.getText("ERROR_ENTER_VALID_SEMANTIC_OBJECT")
			});
			data.errorMsg.push({
				text : that.oResourceBundle.getText("ERROR_ENTER_VALID_SEMANTIC_OBJECT"),
				icon : "sap-icon://error",
				state : sap.ui.core.ValueState.Error
			});
			this.errorState = true;			
		}
		if (that.byId("action").getValueState() === "Error") {
			that.errorMessages.push({
				"type":"Error",
				"title":that.oResourceBundle.getText("ERROR_ENTER_VALID_SEMANTIC_OBJECT")
			});
			data.errorMsg.push({
				text : that.oResourceBundle.getText("ERROR_ENTER_VALID_SEMANTIC_OBJECT"),
				icon : "sap-icon://error",
				state : sap.ui.core.ValueState.Error
			});
			this.errorState = true;			
		}
		
		var oTable = new sap.m.Table({
			columns : [new sap.m.Column({
				header : new sap.m.Text({
					text : that.oResourceBundle.getText("ERRORHEADERSAVE")
				})
			})]
		});
		var oTemplate = new sap.m.ColumnListItem({
			cells : [
			         new sap.ui.layout.Grid({        
			        	 vSpacing:0,
			        	 hSpacing:1,
			        	 content:[
			        	          new sap.m.ObjectStatus({
			        	        	  icon:"{icon}",
			        	        	  state:"{state}",
			        	        	  layoutData: new sap.ui.layout.GridData({span: "L2 M2 S2"})
			        	          }),
			        	          new sap.m.Text({
			        	        	  maxLines:3, 
			        	        	  text : "{text}",
			        	        	  layoutData: new sap.ui.layout.GridData({span: "L10 M10 S10"})
			        	          })
			        	          ]
			         })]
		});
		this.setFooterOnError();
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(data);
		oTable.setModel(oModel);
		oTable.bindAggregation("items", "/errorMsg", oTemplate);
		if(this.errorState){
			var oDialog = new sap.m.Dialog({
				icon:"sap-icon://error",
				content: [oTable],
				contentWidth : "25%",
				title: that.oResourceBundle.getText("ERRORCOUNT",data.errorMsg.length),
				state: "Error",
				buttons : [new sap.m.Button({
					text : that.oResourceBundle.getText("OK"),
					press : function(){
						oDialog.close();
					}
				})]
			});
			oDialog.open();
			return;
		}


		if(!that.errorState){
			if(this.viewData.mode == "DUPLICATE"){
				if(!this.validateKpiId()){
					return;
				}
			}
			if(that.viewData.mode == "CREATE" || that.viewData.mode == "DUPLICATE" || (that.viewData.mode == "EDIT" && this.viewData.IS_ACTIVE == 1)){
				indicatorPayload.TEXTS = [];
				indicatorPayload.TAGS = [];
				indicatorPayload.PROPERTIES = [];
				var languagePayload = that.insertLanguagePayload();
				var propertiesPayload = that.insertPropertiesPayload();
				var tagPayload = that.insertTagPayload();

				if(languagePayload.length){
					indicatorPayload.TEXTS = languagePayload;
				}
				if(propertiesPayload.length){
					indicatorPayload.PROPERTIES = 	propertiesPayload;
				}
				if(tagPayload.length){
					indicatorPayload.TAGS = tagPayload;
				}

				var kpiPayload = {payload:indicatorPayload};
				kpiPayload.keys = {};
				kpiPayload.keys.ID = indicatorPayload.ID;
				kpiPayload.keys.IS_ACTIVE = indicatorPayload.IS_ACTIVE;
				delete kpiPayload.ID;
				delete kpiPayload.IS_ACTIVE;

				that.metadataRef.create('INDICATOR',kpiPayload,null,function(data){
					if(that.getView().getModel().getData().TYPE == "KPI"){
						sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_KPI_SAVE"));
					}
					else{
						sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_OPI_SAVE"));
					}
					successStatus = true;
				},function(error){
					if(that.getView().getModel().getData().TYPE == "KPI"){
						sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_SAVE"));
						that.errorMessages.push({
							"type":"Error",
							"title":that.oResourceBundle.getText("ERROR_KPI_SAVE")
						});
						sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
					}
					else{
						sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_OPI_SAVE"));
						that.errorMessages.push({
							"type":"Error",
							"title":that.oResourceBundle.getText("ERROR_OPI_SAVE")
						});
						sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
					}
					successStatus = false;	
				});
			}
			else if(that.viewData.mode == "EDIT"){

				indicatorPayload.TEXTS = {};
				indicatorPayload.TAGS = {};
				indicatorPayload.PROPERTIES = {};

				var indicatorChanged = false;
				var languageChanged = false;
				var tagChanged = false;
				var propertiesChanged = false;

				var indicatorDeltaObject = that.getIndicatorChanges();

				if(indicatorDeltaObject){
					if(indicatorDeltaObject.updates.length){
						indicatorChanged = true;
						indicatorPayload.INDICATOR = {};
						for(var i=0;i<indicatorDeltaObject.updates.length;i++){
							indicatorPayload.INDICATOR.update = indicatorDeltaObject.updates[i];
						}
					}
				}

				var languageDeltaObject = that.getLanguageChanges(); 
				if(languageDeltaObject){
					if(languageDeltaObject.deletes.length){
						languageChanged = true;
						for(var i=0;i<languageDeltaObject.deletes.length;i++){
							indicatorPayload.TEXTS.remove = languageDeltaObject.deletes;
						}
					}
					if(languageDeltaObject.updates.length){
						languageChanged = true;
						for(var i=0;i<languageDeltaObject.updates.length;i++){
							indicatorPayload.TEXTS.create = languageDeltaObject.updates;
						}
					}
				}

				var tagDeltaObject = that.getTagChanges();

				if(tagDeltaObject){
					if(tagDeltaObject.deletes.length){
						tagChanged = true;
						for(var i=0;i<tagDeltaObject.deletes.length;i++){
							indicatorPayload.TAGS.remove = tagDeltaObject.deletes;
						}
					}
					if(tagDeltaObject.updates.length){
						tagChanged = true;
						for(var i=0;i<tagDeltaObject.updates.length;i++){
							indicatorPayload.TAGS.create = tagDeltaObject.updates;
						}
					}
				}

				var propertiesDeltaObject = that.getPropertiesChanges();

				if(propertiesDeltaObject){
					if(propertiesDeltaObject.deletes.length){
						propertiesChanged = true;
						for(var i=0;i<propertiesDeltaObject.deletes.length;i++){
							indicatorPayload.PROPERTIES.remove = propertiesDeltaObject.deletes;
						}
					}
					if(propertiesDeltaObject.updates.length){
						propertiesChanged = true;
						for(var i=0;i<propertiesDeltaObject.updates.length;i++){
							indicatorPayload.PROPERTIES.create = propertiesDeltaObject.updates;
						}
					}
					
				}
				if(indicatorChanged || tagChanged || propertiesChanged || languageChanged){
					
					var kpiPayload = {payload:indicatorPayload};
					kpiPayload.keys = {};
					kpiPayload.keys.ID = indicatorPayload.ID;
					kpiPayload.keys.IS_ACTIVE = indicatorPayload.IS_ACTIVE;
					delete kpiPayload.ID;
					delete kpiPayload.IS_ACTIVE;
					
					that.metadataRef.update('INDICATOR',kpiPayload,null,function(data){
						if(that.getView().getModel().getData().TYPE == "KPI"){
							sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_KPI_SAVE"));
						}
						else{
							sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_OPI_SAVE"));
						}
						successStatus = true;
					},function(error){
						if(that.getView().getModel().getData().TYPE == "KPI"){
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_SAVE"));
							that.errorMessages.push({
								"type":"Error",
								"title":that.oResourceBundle.getText("ERROR_KPI_SAVE")
							});
							sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
						}
						else{
							sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_OPI_SAVE"));
							that.errorMessages.push({
								"type":"Error",
								"title":that.oResourceBundle.getText("ERROR_OPI_SAVE")
							});
							sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
						}
						successStatus = false;	
					});
				}
			}
		}
		return successStatus;
	},

	getIndicatorChanges : function(){

		var oldIndicatorPayloadData = this.indicatorPayloadForDirtyBitTest;
		var newIndicatorPayloadData = this.kpiCreateModel.getData();

		var oldPayload = {
				"DESCRIPTION" : oldIndicatorPayloadData.DESCRIPTION || "",
				"GOAL_TYPE" : oldIndicatorPayloadData.GOAL_TYPE || "",
				"TITLE" : oldIndicatorPayloadData.TITLE || "",
				"TYPE" : oldIndicatorPayloadData.TYPE || "",
				"OWNER_E_MAIL" : oldIndicatorPayloadData.OWNER_E_MAIL || "",
				"OWNER_ID" : oldIndicatorPayloadData.OWNER_ID || "",
				"OWNER_NAME" : oldIndicatorPayloadData.OWNER_NAME || "",
				"COLUMN_NAME" : oldIndicatorPayloadData.COLUMN_NAME || "",
				"DATA_SPECIFICATION" : oldIndicatorPayloadData.DATA_SPECIFICATION || "",
				"ODATA_URL" : oldIndicatorPayloadData.ODATA_URL || "",
				"ODATA_ENTITYSET" : oldIndicatorPayloadData.ODATA_ENTITYSET || "",
				"VIEW_NAME" : oldIndicatorPayloadData.VIEW_NAME || "",
				"ENTITY_TYPE" : "",
				"SEMANTIC_OBJECT" : oldIndicatorPayloadData.SEMANTIC_OBJECT || "",
				"ACTION" : oldIndicatorPayloadData.ACTION || ""	
		};

		var newPayload = {
				"DESCRIPTION" : newIndicatorPayloadData.DESCRIPTION || "",
				"GOAL_TYPE" : newIndicatorPayloadData.GOAL_TYPE || "",
				"TITLE" : newIndicatorPayloadData.TITLE || "",
				"TYPE" : newIndicatorPayloadData.TYPE || "",
				"OWNER_E_MAIL" : newIndicatorPayloadData.OWNER_E_MAIL || "",
				"OWNER_ID" : newIndicatorPayloadData.OWNER_ID || "",
				"OWNER_NAME" : newIndicatorPayloadData.OWNER_NAME || "",
				"COLUMN_NAME" : newIndicatorPayloadData.COLUMN_NAME || "",
				"DATA_SPECIFICATION" : newIndicatorPayloadData.DATA_SPECIFICATION || "",
				"ODATA_URL" : newIndicatorPayloadData.ODATA_URL || "",
				"ODATA_ENTITYSET" : newIndicatorPayloadData.ODATA_ENTITYSET || "",
				"VIEW_NAME" : newIndicatorPayloadData.VIEW_NAME || "",
				"ENTITY_TYPE" : "",
				"SEMANTIC_OBJECT" : newIndicatorPayloadData.SEMANTIC_OBJECT || "",
				"ACTION" : newIndicatorPayloadData.ACTION || ""	
		};

		var indicatorDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
			oldPayload : oldPayload,
			newPayload : newPayload,
			objectType : "INDICATORS"
		});

		return indicatorDeltaObject;
	},

	getLanguageChanges : function(){
		var that=this;
		this.languagePayloadForDirtyBitTest = [];
		var newLanguagePayload = this.insertLanguagePayload();
		for(var i=0;i<this.OLD_ADDITIONAL_LANGUAGE_ARRAY.length;i++){
			var languageObject = {};
			languageObject.LANGUAGE = this.OLD_ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_SPRAS_KEY;
			languageObject.TITLE = this.OLD_ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
			languageObject.DESCRIPTION = this.OLD_ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;
			this.languagePayloadForDirtyBitTest.push(languageObject);
		}

		var languageDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
			oldPayload : that.languagePayloadForDirtyBitTest,
			newPayload : newLanguagePayload,
			objectType : "INDICATOR_TEXTS"
		});

		return languageDeltaObject;
	},

	getTagChanges : function(){
		var that=this;
		this.tagPayloadForDirtyBitTest = [];
		var newTagPayload = this.insertTagPayload();
		var oldTagPayload = [];
		for(var i=0;i<that.OLD_TAGS.length;i++){
			var tagObject = {};
			tagObject.TAG = that.OLD_TAGS[i];
			tagObject.TYPE = "IN";
			this.tagPayloadForDirtyBitTest.push(tagObject);
		}

		var tagDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
			oldPayload : that.tagPayloadForDirtyBitTest,
			newPayload : newTagPayload,
			objectType : "TAGS"
		});

		return tagDeltaObject;
	},

	getPropertiesChanges : function(){
		var that=this;
		this.propertiesPayloadForDirtyBitTest = [];
		var newPropertiesPayload = this.insertPropertiesPayload();
		for(var i=0;i<this.OLD_PROPERTIES.length;i++){
			var propertiesObject = {};
			propertiesObject.TYPE = "IN";
			propertiesObject.NAME = that.OLD_PROPERTIES[i].NAME;
			propertiesObject.VALUE = that.OLD_PROPERTIES[i].VALUE;
			this.propertiesPayloadForDirtyBitTest.push(propertiesObject);
		}

		var propertiesDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
			oldPayload : that.propertiesPayloadForDirtyBitTest,
			newPayload : newPropertiesPayload,
			objectType : "PROPERTIES"
		});

		return propertiesDeltaObject;
	},

	insertLanguagePayload : function(){
		var kpiDetailsModelData = this.kpiCreateModel.getData();
		var languagePayload = {};
		var languagePayloadArray = [];
		if(kpiDetailsModelData.NO_OF_ADDITIONAL_LANGUAGES>0){
			var i;
			for (i = 0; i < kpiDetailsModelData.NO_OF_ADDITIONAL_LANGUAGES; i++) {
				languagePayload = {};
				languagePayload.LANGUAGE = kpiDetailsModelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_SPRAS_KEY;
				languagePayload.TITLE = kpiDetailsModelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_TITLE;
				languagePayload.DESCRIPTION = kpiDetailsModelData.ADDITIONAL_LANGUAGE_ARRAY[i].ADDITIONAL_LANGUAGE_DESCRIPTION;

				languagePayloadArray.push(languagePayload);
			}
		}
		return languagePayloadArray;
	},

	insertTagPayload : function(){
		var kpiDetailsModelData = this.kpiCreateModel.getData();
		var tagPayload = {};
		var tagPayloadArray = [];
		if (kpiDetailsModelData.TAG) {
			var tagArray = kpiDetailsModelData.TAG.split(",");
			var i;
			for (i = 0; i < tagArray.length; i++) {
				tagPayload = {};
				tagPayload.TYPE = "IN";
				tagPayload.TAG = tagArray[i];

				tagPayloadArray.push(tagPayload);
			}
		}
		return tagPayloadArray;
	},

	insertPropertiesPayload : function(){
		var kpiDetailsModelData = this.kpiCreateModel.getData();
		var propertyPayload = {};
		var propertyPayloadArray = [];
		if (kpiDetailsModelData.PROPERTIES) {
			var i;
			for (i = 0; i < kpiDetailsModelData.PROPERTIES.length; i++) {
				propertyPayload = {};
				propertyPayload.TYPE = "IN";
				propertyPayload.NAME = kpiDetailsModelData.PROPERTIES[i].NAME;
				propertyPayload.VALUE = kpiDetailsModelData.PROPERTIES[i].VALUE;

				propertyPayloadArray.push(propertyPayload);
			}
		}
		return propertyPayloadArray;
	},

	addAdditionalLanguageDialog : function(){

		var that=this;
		this.additionalLanguageListModel = new sap.ui.model.json.JSONModel();
		this.additionalLanguageListModelData = $.extend([], that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY);
		this.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES = this.additionalLanguageListModelData.length;
		this.additionalLanguageListModel.setData(this.additionalLanguageListModelData);

		this.languageTextInput = new sap.m.Input({
			layoutData : new sap.ui.layout.GridData({
				span : "L8 M8 S8"
			})
		});
		this.languageDescriptionInput = new sap.m.TextArea({
			layoutData : new sap.ui.layout.GridData({
				span : "L8 M8 S8"
			})
		});
		this.languageKeySelect = new sap.m.Select({
			layoutData : new sap.ui.layout.GridData({
				span : "L6 M6 S6"
			})
		});

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
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_TITLE}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L12 M12 S12",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_DESCRIPTION}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L6 M6 S6",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_KEY}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L4 M4 S4"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Button({
				        	  icon : "sap-icon://sys-cancel",
				        	  type : "Transparent",
				        	  press : function(oEvent){
				        		  var deletedIndex = oEvent.getSource().getBindingContext("additionalLanguageListModel").getPath().substr(1);
				        		  var newData = that.addedLanguagesList.getModel("additionalLanguageListModel").getData().splice(deletedIndex,1);
				        		  that.addedLanguagesList.getModel("additionalLanguageListModel").updateBindings();
				        		  //that.setEnable();
				        	  },
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L2 M2 S2"
				        	  })
				          })
				          ]
			})
		}));

		this.addedLanguagesList.setModel(that.additionalLanguageListModel,"additionalLanguageListModel");

		var additionalLanguageDialog = new sap.m.Dialog({
			contentHeight : "50%",
			contentWidth : "25%",
			title : that.oResourceBundle.getText("ADDITIONAL_LANGUAGE"),
			content :  [
			            new sap.ui.layout.Grid({
			            	hSpacing: 1,
			            	vSpacing: 4,
			            	defaultSpan : "L12 M12 S12",
			            	content: [
			            	          new sap.ui.layout.form.SimpleForm({
			            	        	  editable:true, 
			            	        	  layout:"ResponsiveGridLayout", 
			            	        	  content : [
			            	        	             new sap.m.Label({
			            	        	            	 text : that.oResourceBundle.getText("TITLE"),
			            	        	            	 textAlign : "Right",
			            	        	            	 required:true,
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),

			            	        	             that.languageTextInput,

			            	        	             new sap.m.Label({
			            	        	            	 text : that.oResourceBundle.getText("DESCRIPTION"),
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3",
			            	        	            	 })
			            	        	             }),

			            	        	             that.languageDescriptionInput,

			            	        	             new sap.m.Label({
			            	        	            	 text : that.oResourceBundle.getText("LANGUAGE"),
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L3 M3 S3"
			            	        	            	 })
			            	        	             }),

			            	        	             that.languageKeySelect,

			            	        	             new sap.m.Button({
			            	        	            	 icon:"sap-icon://add",
			            	        	            	 layoutData : new sap.ui.layout.GridData({
			            	        	            		 span : "L2 M2 S2"
			            	        	            	 }),
			            	        	            	 press : function(){
			            	        	            		 if(that.languageTextInput.getValue()==""){
			            	        	            			 that.languageTextInput.setValueState(sap.ui.core.ValueState.Error); 
			            	        	            		 }else{
			            	        	            			 that.languageTextInput.setValueState(sap.ui.core.ValueState.None);
			            	        	            		 }

			            	        	            		 if(that.languageTextInput.getValue()){
			            	        	            			 for(var i=0;i<that.addedLanguagesList.getModel("additionalLanguageListModel").getData().length;i++){
			            	        	            				 if(that.addedLanguagesList.getModel("additionalLanguageListModel").getData()[i].ADDITIONAL_LANGUAGE_KEY === that.languageKeySelect.getSelectedItem().getText()){
			            	        	            					 sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_LANGUAGE_EXISTS",that.languageKeySelect.getSelectedItem().getText()));
			            	        	            					 return;
			            	        	            				 }
			            	        	            			 }

			            	        	            			 var addedLanguageObject = {
			            	        	            					 "ADDITIONAL_LANGUAGE_TITLE" : that.languageTextInput.getValue(),
			            	        	            					 "ADDITIONAL_LANGUAGE_DESCRIPTION" : that.languageDescriptionInput.getValue(),
			            	        	            					 "ADDITIONAL_LANGUAGE_KEY" : that.languageKeySelect.getSelectedItem().getText(),
			            	        	            					 "ADDITIONAL_LANGUAGE_SPRAS_KEY" : that.languageKeySelect.getSelectedItem().getKey()
			            	        	            			 };
			            	        	            			 that.addedLanguagesList.getModel("additionalLanguageListModel").getData().push(addedLanguageObject);
			            	        	            			 that.addedLanguagesList.getModel("additionalLanguageListModel").updateBindings();
			            	        	            			 that.languageTextInput.setValue("");
			            	        	            			 that.languageDescriptionInput.setValue("");
			            	        	            		 }
			            	        	            		 that.setEnable();
			            	        	            	 }
			            	        	             })

			            	        	             ]
			            	          })

			            	          ]
			            }).addStyleClass("languageGrid"),

			            that.addedLanguagesList

			            ],

			            beginButton : new sap.m.Button({
			            	text : that.oResourceBundle.getText("OK"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            		that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY = that.addedLanguagesList.getModel("additionalLanguageListModel").getData();
			            		that.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES = that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY.length;
			            		that.getView().getModel().updateBindings();
			            	}
			            }),
			            endButton : new sap.m.Button({
			            	text : that.oResourceBundle.getText("CANCEL"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            	}
			            })
		});

		/// Adapter Implementation ----

		var data = jQuery.extend(true, [], that.SAP_LANGUAGE_ARRAY, []);
		for(var i=0;i<data.length;i++){

			if((data[i].LAISO).toUpperCase() == (sap.ui.getCore().getConfiguration().getLocale().getLanguage()).toUpperCase()){
				data.splice(i,1);
			}
		}
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(data);
		that.languageKeySelect.setModel(oModel, "otherLanguageKey");
		that.languageKeySelect.bindItems("otherLanguageKey>/", new sap.ui.core.Item({
			text: "{otherLanguageKey>LAISO}",
			key: "{otherLanguageKey>SPRAS}"
		}));

//		var allLanguagesFetchCallBack = function(data) {
//	data = (data.results) ? data.results : data;
//		var i;
//		for(var i=0;i<data.length;i++){

//		if((data[i].LAISO).toUpperCase() == (sap.ui.getCore().getConfiguration().getLocale().getLanguage()).toUpperCase()){
//		data.splice(i,1);
//		}
//		}
//		var oModel = new sap.ui.model.json.JSONModel();
//		oModel.setData(data);
//		that.languageKeySelect.setModel(oModel, "otherLanguageKey");
//		that.languageKeySelect.bindItems("otherLanguageKey>/", new sap.ui.core.Item({
//		text: "{otherLanguageKey>LAISO}",
//		key: "{otherLanguageKey>SPRAS}"
//		}));
//		};

//		this.metadataRef.getDataByEntity({entity:"LANGUAGE", async:false, success:allLanguagesFetchCallBack, model:this.oDataModel});

		/*
                                this.oDataModel.read("/LANGUAGE?$select=LAISO,SPRAS", null, null, false, function(data) {

                                });
		 */

		// disabling the okay button when no additional language is there

		this.setEnable();
		additionalLanguageDialog.open();
	},

	addNewProperty : function() {
		var that=this;

		if (this.getView().byId("kpiPropertyName").getValue()) {
			this.getView().byId("kpiPropertyName").setValueState("None");
			if (this.getView().byId("kpiPropertyValue").getValue()) {
				this.getView().byId("kpiPropertyValue").setValueState("None");
				var propertyModel = this.getView().byId('propertyNameValueBox').getModel();
				propertyModel.getData().PROPERTIES = propertyModel.getData().PROPERTIES || [];
				for(var i=0; i<propertyModel.getData().PROPERTIES.length;i++){
					if((propertyModel.getData().PROPERTIES[i].NAME === this.getView().byId("kpiPropertyName").getValue()) && (propertyModel.getData().PROPERTIES[i].VALUE === this.getView().byId("kpiPropertyValue").getValue())){
						sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(this.oResourceBundle.getText("ERROR_PROPERTY_VALUE_PAIR_EXISTS"));
						that.errorMessages.push({
							"type":"Error",
							"title":that.oResourceBundle.getText("ERROR_PROPERTY_VALUE_PAIR_EXISTS")
						});
						sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
						return;
					}
				}
				propertyModel.getData().PROPERTIES.push({
					NAME : this.getView().byId("kpiPropertyName").getValue(),
					VALUE : this.getView().byId("kpiPropertyValue").getValue()
				});
				propertyModel.updateBindings();
				this.getView().byId("kpiPropertyName").setValue("");
				this.getView().byId("kpiPropertyValue").setValue("");
			} else {
				that.isPropertyAdded = false;
				this.getView().byId("kpiPropertyValue").setValueState("Error");
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ENTER_PROPERTY_VALUE"));
				that.errorMessages.push({
					"type":"Error",
					"title":that.oResourceBundle.getText("ENTER_PROPERTY_VALUE")
				});
				sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
			}
		} else {
			that.isPropertyAdded = false;
			this.getView().byId("kpiPropertyName").setValueState("Error");
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ENTER_PROPERTY_NAME"));
			that.errorMessages.push({
				"type":"Error",
				"title":that.oResourceBundle.getText("ENTER_PROPERTY_NAME")
			});
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
		}
	},

	removeProperty : function(evt) {
		var path = evt.getSource().getBindingContext().getPath();
		evt.getSource().getBindingContext().getModel().getData().PROPERTIES.splice(path.substring(path.lastIndexOf("/") + 1), 1);
		evt.getSource().getBindingContext().getModel().updateBindings();
	},
	kpiOpiRadioButtonChange : function(oEvent) {
		if (this.getView().byId('KPI').getSelected() == true) {
			this.getView().getModel().getData().TYPE = "KPI";
			this.getView().getModel().getData().KPITYPE = true;
			this.getView().getModel().getData().OPITYPE = false;
		}
		else{
			this.getView().getModel().getData().TYPE = "OPI";
			this.getView().getModel().getData().KPITYPE = false;
			this.getView().getModel().getData().OPITYPE = true;
		}
		if(this.getView().byId('OPI').getSelected() == true) {
			this.getView().getModel().getData().TYPE = "OPI";
			this.getView().getModel().getData().KPITYPE = false;
			this.getView().getModel().getData().OPITYPE = true;
		}
		else{
			this.getView().getModel().getData().TYPE = "KPI";
			this.getView().getModel().getData().KPITYPE = true;
			this.getView().getModel().getData().OPITYPE = false;
		}
	},


	validateKpiId : function() {
		var kpiIdField = this.getView().byId('kpiId');
		var that=this;
		var successStatus = false;

		var kpiId = kpiIdField.getValue();

		if(this.VIEW_MODE == this.CDS){
			kpiIdField.setValue(kpiId.toUpperCase());
		}
		if (kpiId) {
			/* reserved for test data */
			if(kpiId.lastIndexOf(this.RESERVED_KPI_ID_NAMESPACE, 0) === 0) {
				kpiIdField.setValueState("Error");
				successStatus = false;
			}
			/* CDS kpiIds must begin with PERIOD */
			else if(this.VIEW_MODE == this.CDS && kpiId[0] != '.') {
				this.kpiIdEval_reason = "NOT_START_WITH_PERIOD";
				kpiIdField.setValueState("Error");
				successStatus = false;
			}
			/* Only CDS kpiIds must begin with PERIOD */
			else if(this.VIEW_MODE == this.HANA && kpiId[0] == '.') {
				this.kpiIdEval_reason = "_START_WITH_PERIOD";
				kpiIdField.setValueState("Error");
				successStatus = false;
			}
			else if (!(/^[a-zA-Z0-9.]*$/.test(kpiId)) || kpiId.length > this.valid_maxlength[this.VIEW_MODE].id) {
				kpiIdField.setValueState("Error");
				successStatus = false;
			} else {
				kpiIdField.setValueState("None");

				//// Adapter Implementation ----

				var indicatorCheckCallBack = function(indicatorData) {
					if (indicatorData[0]) {
						kpiIdField.setValueState("Error");
						sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ID_ALREADY_EXISTS"));
						that.errorMessages.push({
							"type":"Error",
							"title":that.oResourceBundle.getText("ID_ALREADY_EXISTS")
						});
						sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
						successStatus = false;
					} else {
						kpiIdField.setValueState("None");
						successStatus = true;
					}
				};

				var indicatorCheckErrCallBack = function() {
					kpiIdField.setValueState("None");
					successStatus = true;
				};

				this.metadataRef.getDataByEntity({entity:"INDICATORS", filter:"ID eq '" + kpiId + "'", async:false, success:indicatorCheckCallBack, error:indicatorCheckErrCallBack, model:this.oDataModel});
			}
		}
		return successStatus;
	},

	validateKpiTitle : function() {
		var kpiTitleField = this.getView().byId('kpiTitle');
		var kpiTitle = kpiTitleField.getValue();
		if(!kpiTitle) {
			kpiTitleField.setValueState("None");
			return true;
		}

		if (kpiTitle.length > this.valid_maxlength[this.VIEW_MODE].title) {
			kpiTitleField.setValueState("Error");
			return false
		} else {
			kpiTitleField.setValueState("None");
			return true;
		}
	},

	formatAdditionalLanguageLink : function(sValue){
		return this.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+sValue+")";
	},

	formatSemanticActionLabel : function(sValue){
		return sValue+"/"+this.oApplicationFacade.getResourceBundle().getText("ACTION");
	},

	validateEmailAddress : function() {

		var kpiOwnerEmailField = this.getView().byId('kpiOwnerEmail');
		var kpiOwnerEmailValue = kpiOwnerEmailField.getValue();
		if (kpiOwnerEmailValue) {
			if (!(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]/.test(kpiOwnerEmailValue))) {
				kpiOwnerEmailField.setValueState("Error");
			} else {
				kpiOwnerEmailField.setValueState("None");
			}
		} else {
			kpiOwnerEmailField.setValueState("None");
		}
	},

	populateRelevantEntitySet : function(dialog) {
		var that = this;
		var modelData = this.getView().getModel().getData();

		//Adapter Implementation ----
		that.metadataRef.populateRelevantEntitySet(dialog, modelData, that);
	},

	populateRelevantEntitySet_CDS : function(dialog) {
		var selectedCDSView_CdsName = encodeURIComponent(this.getView().getModel().getProperty("/VIEW_NAME_CdsName"));
		var selected_odata_url = encodeURIComponent(this.getView().getModel().getProperty("/ODATA_URL"));
		var expandParam = "EntityTypeSet";
		var uri = "/ODATAnameSet(CdsName='" + 
		selectedCDSView_CdsName
		+
		"\',OdataName='',OdataURL='" +
		selected_odata_url
		+
		"',SrvName='',SrvVersion='',SrvNamespace='')/?$expand=" +
		expandParam;

		this.oDataModelCDS.read(uri, null, null, false, function(data) {
			var data = data[expandParam].results;
			var cdsEntitySetModel = new sap.ui.model.json.JSONModel();
			cdsEntitySetModel.setData(data);
			dialog.setModel(cdsEntitySetModel);
			dialog.open();
		});
	},

	/// Adapter Required  ---> NOT DONE

	handleHanaViewValueHelp : function() {
		var that = this;
		var hanaViewValueHelpDialog = new sap.m.SelectDialog({
			title : that.oResourceBundle.getText("SELECT_VIEW"),
			noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
			items : {
				path : "/HANA_VIEWS",
				template : new sap.m.StandardListItem({
					title : {
						parts : [{
							path : "OBJECT",
							type : new sap.ui.model.type.String()
						}, {
							path : "PACKAGE",
							type : new sap.ui.model.type.String()
						}, {
							path : "SUFFIX",
							type : new sap.ui.model.type.String()
						}],
						formatter : function(o, p, s) {
							if (s.indexOf("view") != -1)
								return p + "/" + o;
							else
								return p + "::" + o;
						}
					},
					description : "{SUFFIX}"
				})
			},
			confirm : function(oEvent) {
				that.getView().getModel().setProperty("/VIEW_NAME", oEvent.getParameter("selectedItem").getProperty("title"));
				that.byId("viewInput").fireChange();
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterPackage = new sap.ui.model.Filter("tolower(PACKAGE)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oFilterObject = new sap.ui.model.Filter("tolower(OBJECT)", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage, oFilterObject], false));
			}
		});

		hanaViewValueHelpDialog.setModel(this.oDataModel);
		hanaViewValueHelpDialog.open();

		//Adapter Implementation Fail ---->> SelectDialog liveChange fails on json binding

		//var views = that.metadataRef.getAllViews({async:false, model:that.oDataModel}); 
		//var viewsModel = new sap.ui.model.json.JSONModel();
		//viewsModel.setData({HANA_VIEWS:views});
		//hanaViewValueHelpDialog.setModel(viewsModel);

	},

	/*pick @CDS view*/
	handleCDSViewValueHelp : function() {
		var that = this;
		var hanaViewValueHelpDialog = new sap.m.SelectDialog({
			title : that.oResourceBundle.getText("SELECT_VIEW"),
			noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
			items : {
				path : "/",
				template : new sap.m.StandardListItem({
					title : {
						parts : [{
							path : "PackName",
							type : new sap.ui.model.type.String()
						}, {
							path : "CdsName",
							type : new sap.ui.model.type.String()
						}],
						formatter : function(p, c) {
							return p + "::" + c;
						}
					}
				})
			},
			confirm : function(oEvent) {
				that.getView().getModel().setProperty("/VIEW_NAME", oEvent.getParameter("selectedItem").getProperty("title"));
				that.getView().getModel().setProperty("/VIEW_NAME_CdsName", oEvent.getParameter("selectedItem").getBindingContext().getProperty("CdsName"));
				that.getView().getModel().setProperty("/VIEW_NAME_PackName", oEvent.getParameter("selectedItem").getBindingContext().getProperty("PackName"));
				that.byId("viewInputCDS").fireChange();
			},
			liveChange : function(oEvent) {
				var i, s, s1, s2, both;
				/* can expect syntax <PackName>::<CdsName> */
				s = s1 = s2 = oEvent.getParameter("value").toUpperCase();
				both = false;
				if((i = s.lastIndexOf("::")) !== -1) {
					s1 = s.substring(0, i);
					s2 = s.substring(i + 2, s.length);
					both = true;
				}
				var oFilterPackage = new sap.ui.model.Filter("PackName", sap.ui.model.FilterOperator.Contains,s1);
				var oFilterObject = new sap.ui.model.Filter("CdsName", sap.ui.model.FilterOperator.Contains,s2);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage, oFilterObject], both));
			}
		});
		this.oDataModelCDS.read("/CDSViewSet", null, null, false, function(data) {
			var data = data.results;
			var cdsViewListModel = new sap.ui.model.json.JSONModel();
			cdsViewListModel.setData(data);
			hanaViewValueHelpDialog.setModel(cdsViewListModel);
		});
		hanaViewValueHelpDialog.open();
	},

	handleHanaViewInputChange : function(){
		this.getView().getModel().getData().ODATA_URL = "";
		this.getView().getModel().getData().ODATA_ENTITYSET = "";
		this.getView().getModel().getData().COLUMN_NAME = "";
		this.getView().getModel().updateBindings();
	},

	handleOdataServiceValueHelp:function(){
		var that = this;
		if(!that.byId("viewInput").getValue()){
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_HANA_VIEW"));
			that.errorMessages.push({
				"type":"Error",
				"title":that.oResourceBundle.getText("ERROR_ENTER_HANA_VIEW")
			});
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
		}
		else{
			var selectedHanaView = that.getView().getModel().getProperty("/VIEW_NAME");
			selectedHanaView = (selectedHanaView.indexOf("/") != -1 ? selectedHanaView.split("/") : selectedHanaView
					.split("::"));
			var hanaOdataServiceHelpDialog = new sap.m.SelectDialog({
				title : that.oResourceBundle.getText("SELECT_ODATA_SERVICE"),
				noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
				items : {
					path : "/ODATA_FOR_ENTITY(P_PACKAGE='" + selectedHanaView[0] + "',P_OBJECT='" + selectedHanaView[1] + "')/Results",
					template : new sap.m.StandardListItem({
						title : {
							parts : [{
								path : "PACKAGE",
								type : new sap.ui.model.type.String()
							}, {
								path : "OBJECT",
								type : new sap.ui.model.type.String()
							}],
							formatter : function(o, p, s) {
								o = o.replace(/\./g, '/');
								return "/" + o + "/" + p + ".xsodata";
							}
						},
					})
				},
				confirm : function(oEvent) {
					that.getView().getModel().setProperty("/ODATA_URL", oEvent.getParameter("selectedItem").getProperty("title"));
				},
				liveChange : function(oEvent) {
					var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
					var oFilterPackage = new sap.ui.model.Filter("tolower(PACKAGE)", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oFilterObject = new sap.ui.model.Filter("tolower(OBJECT)", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter([oFilterPackage, oFilterObject], false));
				}
			});
			hanaOdataServiceHelpDialog.setModel(that.oDataModel);
			hanaOdataServiceHelpDialog.open();
		}
	},

	/*pick @CDS odata*/
	handleOdataServiceValueHelpCDS:function(){
		var that = this;
		if(!that.byId("viewInputCDS").getValue()){
			var readUri = "/PackOdataSet";
			var expandParam = null;
		}
		else{
			var selectedCDSView_CdsName = encodeURIComponent(that.getView().getModel().getProperty("/VIEW_NAME_CdsName"));
			var selectedCDSView_PackName = encodeURIComponent(that.getView().getModel().getProperty("/VIEW_NAME_PackName"));
			var readUri = "/CDSViewSet(CdsName='" + selectedCDSView_CdsName + "')/?$expand=ODATAnameSet";
			var expandParam = "ODATAnameSet";
		}
		var hanaOdataServiceHelpDialog = new sap.m.SelectDialog({
			title : that.oResourceBundle.getText("SELECT_ODATA_SERVICE"),
			noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
			items : {
				path : "/",
				template : new sap.m.StandardListItem({
					title : {
						parts : [{
							path : "OdataURL",
							type : new sap.ui.model.type.String()
						}],
						formatter : function(o) {
							/* strip the hostname and querystring */
							return (function(h) {return jQuery("<a>").attr("href",h)[0]["pathname"]})(o);
						}
					},
				})
			},
			confirm : function(oEvent) {
				that.getView().getModel().setProperty("/ODATA_URL", oEvent.getParameter("selectedItem").getProperty("title"));
			},
			liveChange : function(oEvent) {
				var searchValue = oEvent.getParameter("value");
				var oFilterPackage = new sap.ui.model.Filter("OdataURL", sap.ui.model.FilterOperator.Contains,searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterPackage], false));
			}
		});

		this.oDataModelCDS.read(readUri, null, null, false, function(data) {
			var data = expandParam ? data[expandParam].results : data.results;
			var cdsViewListModel = new sap.ui.model.json.JSONModel();
			cdsViewListModel.setData(data);
			hanaOdataServiceHelpDialog.setModel(cdsViewListModel);
		});
		hanaOdataServiceHelpDialog.open();
	},

	handleEntitySetValueHelp : function(){
		var that = this;
		var odataFieldId = this.VIEW_MODE == this.CDS ? "odataServiceInputCDS" : "odataServiceInput";
		if(!that.byId(odataFieldId).getValue()){
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ODATA_SERVICE_URL"));
			that.errorMessages.push({
				"type":"Error",
				"title":that.oResourceBundle.getText("ERROR_ENTER_ODATA_SERVICE_URL")
			});
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);

		}
		else{
			var that = this;
			that.oModelForEntity;

			var hanaEntitySetHelpDialog = new sap.m.SelectDialog({
				title : that.oResourceBundle.getText("SELECT_ENTITY_SET"),
				noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
				items : {
					path : "/entitySet",
					template : new sap.m.StandardListItem({
						title : {
							parts : [{
								path : "entityName",
								type : new sap.ui.model.type.String()
							}],
							formatter : function(o,s) {
								return o;
							}
						},
					})
				},
				confirm : function(oEvent) {
					that.getView().getModel().setProperty("/ODATA_ENTITYSET", oEvent.getParameter("selectedItem").getProperty("title"));
				},
				liveChange : function(oEvent) {
					var searchValue = oEvent.getParameter("value");
					var oFilterPackage = new sap.ui.model.Filter("entityName", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter([oFilterPackage], false));
				}

			});

			var CDSEntitySetHelpDialog = new sap.m.SelectDialog({
				title : that.oResourceBundle.getText("SELECT_ENTITY_SET"),
				noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
				items : {
					path : "/",
					template : new sap.m.StandardListItem({
						title : {
							parts : [{
								path : "EntityName",
								type : new sap.ui.model.type.String()
							}],
							formatter : function(o,s) {
								return o;
							}
						},
					})
				},
				confirm : function(oEvent) {
					that.getView().getModel().setProperty("/ODATA_ENTITYSET", oEvent.getParameter("selectedItem").getProperty("title"));
				},
				liveChange : function(oEvent) {
					var searchValue = oEvent.getParameter("value");
					var oFilterPackage = new sap.ui.model.Filter("entityName", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter([oFilterPackage], false));
				}

			});

			try {
				if(that.getView().getModel().getData().VIEW_NAME)  {
					if(this.VIEW_MODE != this.CDS) {
						that.populateRelevantEntitySet(hanaEntitySetHelpDialog);
					} else {
						that.populateRelevantEntitySet_CDS(CDSEntitySetHelpDialog);
					}
				}
				else {
					that.oModelForEntity = that.populateEntitySet(that.getView().byId(odataFieldId).getValue());
					hanaEntitySetHelpDialog.setModel(that.oModelForEntity);
					hanaEntitySetHelpDialog.open();
				}
			} catch (err) {

			} 
		}
	},
	handleMeasureValueHelp : function(){
		var that = this;
		if(!that.byId("entitySetInput").getValue()){
			sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET"));
			that.errorMessages.push({
				"type":"Error",
				"title":that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET")
			});
			sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);

		}
		else{
			try {
				that.oModelForMeasure = that.populateMeasure(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
				that.mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
				var measureObj = that.mProperties.getLabelMappingObject();
				var measureArray = that.oModelForMeasure.getData().measures;
				for(var i=0,l=measureArray.length; i<l; i++) {
					measureArray[i].measureLabel = measureObj[measureArray[i].measureName];
				}
				that.oModelForMeasure.setData({measures:measureArray});
			} catch (err) {
			}
			var hanaMeasureHelpDialog = new sap.m.SelectDialog({
				title : that.oResourceBundle.getText("SELECT_MEASURE"),
				noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
				items : {
					path : "/measures",
					template : new sap.m.StandardListItem({
						title : {
							parts : [{
								path : "measureLabel",
								type : new sap.ui.model.type.String()
							}],
							formatter : function(o,s) {
								return o;
							}
						},
						description : {
							parts : [{
								path : "measureName",
								type : new sap.ui.model.type.String()
							}],
							formatter : function(o,s) {
								return o;
							}
						}
					})
				},
				confirm : function(oEvent) {
					that.getView().getModel().setProperty("/COLUMN_NAME", oEvent.getParameter("selectedItem").getBindingContext().getProperty("measureName"));
				},
				liveChange : function(oEvent) {
					var searchValue = oEvent.getParameter("value");
					var oFilter = new sap.ui.model.Filter("measureName", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oFilter1 = new sap.ui.model.Filter("measureLabel", sap.ui.model.FilterOperator.Contains,
							searchValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(new sap.ui.model.Filter([oFilter,oFilter1], false));
				}
			});
			hanaMeasureHelpDialog.setModel(that.oModelForMeasure);
			hanaMeasureHelpDialog.open();
		}
	},

	handleChangeAdditionalInfo : function(oEvent) {
		var that = this;
		that.getView().getModel().setProperty("info", that.getView().byId("additionalInfoId"));
	},

	validateSemantic : function(oEvent) {
		var that = this;
		var semanticObj = that.getView().byId("semanticObject");
		if( oEvent.getParameter("value").indexOf(' ') === -1 ){
			this.byId(oEvent.getParameter("id")).setValueState("None");
		}
		else{
			this.byId(oEvent.getParameter("id")).setValueState("Error");
		}


	},

	populateEntitySet : function(dataSource) {
		var oController = this;
		var oModel = new sap.ui.model.json.JSONModel();
		var resultEntity = [], entityDataArray = [], obj = {};
		var i;
		resultEntity = sap.suite.ui.smartbusiness.lib.Util.odata.getAllEntitySet(dataSource);
		for (i = 0; i < resultEntity.length; i++) {
			obj = {};
			obj.entityName = resultEntity[i];
			entityDataArray.push(obj);
		}
		oModel.setData({
			entitySet : entityDataArray
		});
		return oModel;
	},

	validateQueryServiceURI : function(dataSource) {
		dataSource = jQuery.trim(dataSource);
		if (!jQuery.sap.startsWith(dataSource, "/")) {
			dataSource = "/" + dataSource;
		}
		if (jQuery.sap.endsWith(dataSource, "/")) {
			dataSource = dataSource.substring(0, dataSource.length - 1);
		}
		return dataSource;
	},

	populateMeasure : function(dataSource, entitySet) {
		dataSource = this.validateQueryServiceURI(dataSource) + "";
		entitySet = entitySet + "";
		var measures = [], measureDataArray = [], obj = {};
		var i;
		measures = sap.suite.ui.smartbusiness.lib.Util.odata.getAllMeasures(dataSource, entitySet);
		for (i = 0; i < measures.length; i++) {
			obj = {};
			obj.measureName = measures[i];
			measureDataArray.push(obj);
		}
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			measures : measureDataArray
		});
		return oModel;
	},

	onODataServiceLoad : function() {
		var that = this;
		setTimeout(function() {
			that.getView().getModel().setProperty("/ODATA_URL",that.getView().byId("odataServiceSelect").getSelectedItem().getText());
			that.getView().byId("odataServiceSelect").fireChange();
		}, 0);
		this.oDataModel.detachRequestCompleted(that.onODataServiceLoad, that);
	},

	onEntitySetServiceLoad : function() {
		var that = this;

		setTimeout(function() {
			that.getView().getModel().setProperty("/ODATA_ENTITYSET",that.getView().byId("entitySetSelect").getSelectedItem().getText());
			that.getView().byId("entitySetSelect").fireChange();
		}, 0);
	},

	onMeasureServiceLoad : function() {
		var that = this;

		setTimeout(function() {
			that.getView().getModel().setProperty("/COLUMN_NAME",that.getView().byId("valueMeasureSelect").getSelectedItem().getText());
			that.getView().byId("valueMeasureSelect").fireChange();
		}, 0);
	},

	isCDSMode: function(mode) {
		return mode == this.CDS;
	},

	isHANAMode: function(mode) {
		return mode != this.CDS;
	},
	generateKpiId : function(oController){
		var x = {};
		x.title = "";
		var promiseObj = sap.suite.ui.smartbusiness.lib.IDGenerator.generateKpiId(x);
		var id;
		promiseObj.done(function(kId){
			id = kId;
			oController.getView().getModel().getData().ID = id;
			oController.getView().getModel().updateBindings();
		});
	},
	onExit: function() {
		var hashObj = hasher || window.hasher;
		if(!(hashObj.getHash())) {
			sap.suite.ui.smartbusiness.lib.Util.utils.backToHome();
		}
		if(sap.suite.ui.smartbusiness.modelerAppCache && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI && sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace) {
			delete sap.suite.ui.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace;
		}
	}
});
