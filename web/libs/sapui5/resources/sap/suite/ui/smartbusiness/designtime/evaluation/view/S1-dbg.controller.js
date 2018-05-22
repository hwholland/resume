/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */

jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.IDGenerator");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");
jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/view/evaluationParameters.css");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.evaluation.view.S1",{	
    onAfterRendering : function(){
        var that = this;
        that.initialModel = that._cloneObj(that.getView().getModel().getData());
        if(that.showDataSourceError) {
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
            that.errorMessages.push({
                "type" : "Error",
                "title" : that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"),
                "description" : that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS")
            });
            that.errorState = true;
        }
        if(that.inputParameterSapClientCheckBox){
            that.inputParameterSapClientCheckBox.fireSelect();
        }
        if(that.mandatoryFilterSapClientCheckBox){
            that.mandatoryFilterSapClientCheckBox.fireSelect();
        }
        that.byId("scaleFactorSelect").setTooltip(that.byId("scaleFactorSelect").getSelectedItem().getText());
        that.byId("decimalPrecisionSelect").setTooltip(that.byId("decimalPrecisionSelect").getSelectedItem().getText());
    },
    navigateBack : function(){
        var that = this;
        var isActive;
        var backDialog = new sap.m.Dialog({
            icon:"sap-icon://warning2",
            title:that.oResourceBundle.getText("WARNING"),
            state:"Warning",
            type:"Message",
            content:[new sap.m.Text({text:that.oResourceBundle.getText("NAVIGATION_DATA_LOSS")})],
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
        var updateRequired = false;
        if(that.getView().getModel().getData().mode === "create"){
            var batch = {};
            batch.oldPayload = that.getEvalParamPayload(that.initialModel);
            batch.newPayload = that.getEvalParamPayload(that.getView().getModel().getData());
            batch.objectType = "Evaluations";
            batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
            if(batch.updates.length > 0){
                updateRequired = true;
            }
        }
        else{
            var that = this,i = 0;

            var batch = {};
            that.saveFilters(that.getView());
            that.saveValues(that.getView());
            that.saveTags(that.getView());
            that.saveProperties(that.getView());
            that.saveAdditionalLanguages(that.getView());

            //checking for changes in evaluation parameters
            batch.oldPayload = that.getEvalParamPayload(that.evalDetails);
            batch.oldPayload.DATA_SPECIFICATION = "";
            isActive = batch.oldPayload.IS_ACTIVE;
            batch.oldPayload.IS_ACTIVE = 0;
            batch.newPayload = that.getEvalParamPayload(that.getView().getModel().getData());
            batch.newPayload.DATA_SPECIFICATION = "";
            batch.objectType = "Evaluations";
            batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
            if(batch.updates.length > 0){
                updateRequired = true;
            }

            //for changes in evaluation filters
            batch.oldPayload = that.evalDetails.FILTERS;
            for(var key in batch.oldPayload){
                batch.oldPayload[key].IS_ACTIVE = 0;
            }
            batch.newPayload = that.evalFiltersPayload;
            batch.objectType = "EVALUATION_FILTERS";
            batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
            if(batch.deletes.length > 0){
                updateRequired = true;
            }
            if(batch.updates.length > 0){
                updateRequired = true;
            }

            //for changes in evaluation values
            for(i=0;i<that.evalDetails.VALUES.length;i++){
                if(that.evalDetails.VALUES[i].COLUMN_NAME){
                    delete that.evalDetails.VALUES[i].FIXED;
                }
                else{
                    delete that.evalDetails.VALUES[i].COLUMN_NAME;
                }
            }
            batch.oldPayload = that.evalDetails.VALUES;
            for(var key in batch.oldPayload){
                batch.oldPayload[key].IS_ACTIVE = 0;
            }
            batch.newPayload = that.valuesPayload;
            batch.objectType = "EVALUATION_VALUES";
            batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
            if(batch.deletes.length > 0){
                updateRequired = true;
            }
            if(batch.updates.length > 0){
                updateRequired = true;
            }

            //for changes in evaluation tags
            batch.oldPayload = that.evalDetails.TAGS;
            for(var key in batch.oldPayload){
                batch.oldPayload[key].IS_ACTIVE = 0;
            }
            batch.newPayload = that.tagsPayload;
            batch.objectType = "TAGS";
            batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
            if(batch.deletes.length > 0){
                updateRequired = true;
            }
            if(batch.updates.length > 0){
                updateRequired = true;
            }

            //for changes in evaluation properties
            batch.oldPayload = that.evalDetails.PROPERTIES;
            for(var key in batch.oldPayload){
                batch.oldPayload[key].IS_ACTIVE = 0;
            }
            batch.newPayload = that.propPayload
            batch.objectType = "PROPERTIES";
            batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
            if(batch.deletes.length > 0){
                updateRequired = true;
            }
            if(batch.updates.length > 0){
                updateRequired = true;
            }

            //for changes in additional languages
            batch.oldPayload = that.evalDetails.ADDITIONAL_LANGUAGE_ARRAY;
            for(var key in batch.oldPayload){
                batch.oldPayload[key].IS_ACTIVE = 0;
            }
            batch.newPayload = that.languagesPayload
            batch.objectType = "EVALUATION_TEXTS";
            batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
            if(batch.deletes.length > 0){
                updateRequired = true;
            }
            if(batch.updates.length > 0){
                updateRequired = true;
            }

        }
        if(updateRequired){
            backDialog.open();
        }
        else{
            window.history.back();
        }
    },
    onInit : function() {
        var that = this;
        that.hasSapClient = false;
        that.userSessionClient="";
        this.showDataSourceError = false;
        this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
        sap.suite.ui.smartbusiness.sb_createevaluation = this;
        this.RESERVED_EVAL_ID_NAMESPACE = ".sap.sample";

        this.errorMessages = [];
        this.errorState = false;

        this.CDS = "cds";
        this.HANA = "hana";
        this.VIEW_MODE = this.HANA;
        var urlParam;
        var sessionClientUrl = "/sap/hba/r/sb/core/logic/GetSessionClient.xsjs";
        jQuery.sap.require("sap.suite.ui.smartbusiness.lib.AppSetting");
        sap.suite.ui.smartbusiness.lib.AppSetting.init({
            oControl : this.byId("evalId"),
            controllerReference : this,
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
            action: that.generateEvalId
        });
        this.settingModel = sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
        sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");
        this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");

        /* use url parameter `?viewmode=cds` to launch app based on an CDS view */
        if(urlParam = jQuery.sap.getUriParameters().get("viewmode")) {
            if(urlParam.toLowerCase && urlParam.toLowerCase() == this.CDS)
                this.VIEW_MODE = this.CDS;
        }

        that.fromHome = false;
        this.oOptionsForCreate = {
                onBack : function(){
                    that.navigateBack();
                },

                bSuppressBookmarkButton : {},
                oEditBtn : {
                    sI18nBtnTxt : "SAVE",
                    onBtnPressed : function(evt) {
                        that.saveAndExit();
                    }
                },
                buttonList : [{
                    sI18nBtnTxt : "SAVE_CREATE_NEW",
                    onBtnPressed : function(evt) {
                        that.saveAndCreateNew();
                    }
                }, 
                {
                    sI18nBtnTxt : "SAVE_AND_ACTIVATE",
                    onBtnPressed : function(evt) {
                        that.saveAndActivate();
                    }
                },{
                    sI18nBtnTxt : "ACTIVATE_CREATE_NEW",
                    onBtnPressed : function(evt) {
                        that.activateAndCreateNew();
                    }
                },{
                    sI18nBtnTxt : "ACTIVATE_CONFIGURE",
                    onBtnPressed : function(evt) {
                        that.activateAndAddTiles();
                    }
                },{
                    sI18nBtnTxt : "CANCEL",
                    onBtnPressed : function(evt) {
                        that.navigateBack();
                    }
                }]
        };

        this.oOptionsForEdit = {
                bSuppressBookmarkButton : {},
                onBack : function(){
                    that.navigateBack();
                },
                oEditBtn : {
                    sI18nBtnTxt : "SAVE",
                    onBtnPressed : function(evt) {
                        that.saveAndExit();
                    }
                },
                buttonList : [{
                    sI18nBtnTxt : "SAVE_AND_ACTIVATE",
                    onBtnPressed : function(evt) {
                        that.saveAndActivate();
                    }
                }, {
                    sI18nBtnTxt : "DELETE",
                    onBtnPressed : function(evt) {
                        that.deleteDraft();
                    }
                }, {
                    sI18nBtnTxt : "CANCEL",
                    onBtnPressed : function(evt) {
                        that.navigateBack();
                    }
                }]
        };

        this.oOptionsOnErrorForCreate = {
                onBack : function(){
                    that.navigateBack();
                },
                bSuppressBookmarkButton : {},
                oNegativeAction : {
                    sIcon : "sap-icon://alert",
                    sId : "errorBtn",
                    sControlId : "errorBtn",
                    onBtnPressed : function(event) {
                        sap.suite.ui.smartbusiness.lib.Util.utils.handleMessagePopover(event,that);
                    }
                },
                buttonList : [{
                    sI18nBtnTxt : "SAVE",
                    onBtnPressed : function(evt) {
                        that.saveAndExit();
                    }
                }, {
                    sI18nBtnTxt : "SAVE_CREATE_NEW",
                    onBtnPressed : function(evt) {
                        that.saveAndCreateNew();
                    }
                }, 
                {
                    sI18nBtnTxt : "SAVE_AND_ACTIVATE",
                    onBtnPressed : function(evt) {
                        that.saveAndActivate();
                    }
                },{
                    sI18nBtnTxt : "ACTIVATE_CREATE_NEW",
                    onBtnPressed : function(evt) {
                        that.activateAndCreateNew();
                    }
                },{
                    sI18nBtnTxt : "ACTIVATE_CONFIGURE",
                    onBtnPressed : function(evt) {
                        that.activateAndAddTiles();
                    }
                },{
                    sI18nBtnTxt : "CANCEL",
                    onBtnPressed : function(evt) {
                        that.navigateBack();
                    }
                }]
        };

        this.oOptionsOnErrorForEdit = {
                bSuppressBookmarkButton : {},
                onBack : function(){
                    that.navigateBack();
                },
                oNegativeAction : {
                    sIcon : "sap-icon://alert",
                    sId : "errorBtn",
                    sControlId : "errorBtn",
                    onBtnPressed : function(event) {
                        sap.suite.ui.smartbusiness.lib.Util.utils.handleMessagePopover(event,that);
                    }
                },
                buttonList : [{
                    sI18nBtnTxt : "SAVE",
                    onBtnPressed : function(evt) {
                        that.saveAndExit();
                    }
                }, {
                    sI18nBtnTxt : "SAVE_AND_ACTIVATE",
                    onBtnPressed : function(evt) {
                        that.saveAndActivate();
                    }
                }, {
                    sI18nBtnTxt : "DELETE",
                    onBtnPressed : function(evt) {
                        that.deleteDraft();
                    }
                }, {
                    sI18nBtnTxt : "CANCEL",
                    onBtnPressed : function(evt) {
                        that.navigateBack();
                    }
                }]
        };
        this.setHeaderFooterOptions(that.oOptionsForCreate);
        this.busyDialog = new sap.m.BusyDialog();
        this.oResourceBundle = this.oApplicationFacade.getResourceBundle();
        var oModel = new sap.ui.model.json.JSONModel({NO_OF_ADDITIONAL_LANGUAGES:0, VIEW_MODE:this.VIEW_MODE});
        this.getView().setModel(oModel); 
        this.oDataModel = this.oApplicationFacade.getODataModel();

        //Fetching Session Client
        if(that.VIEW_MODE != "cds"){
            $.ajax({
                url:sap.suite.ui.smartbusiness.lib.Util.utils.appendUrlParameters(sessionClientUrl),
                async : false,
                success:function(data){
                    that.userSessionClient = data.sessionClient;
                },
                error:function(jqXHR, textStatus, errorThrown){
                    if(jqXHR.status == 404){
                        that.sessionClientXsjsMissing = true;
                    }	
                    else{
                        that.sessionClientFetchError = true;
                        that.errorMessages.push({
                            "type" : "Error",
                            "title" : that.oResourceBundle.getText("SESSION_CLIENT_FETCH_FAILED")
                        });
                        sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);
                    }
                }});
        }

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
            this.oDataModelCDS.attachMetadataFailed(function(s){
                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_CDS_MODE"));
                that.errorMessages.push({
                    "type" : "Error",
                    "title" : that.oResourceBundle.getText("ERROR_CDS_MODE")
                });
                that.errorState = true;
            });
            this.byId("evalId").setMaxLength(40);
        }
        else if(this.VIEW_MODE == this.HANA){
            this.byId("evalId").setMaxLength(512);
        }

        this.editDraft = false;
        //this.oDataModel.attachRequestCompleted(that.onODataServiceLoad, that); // this is to ensure that we fire
        // select event on the odata
        // service field only after we
        // receive the data
        this.oModelForInputParameters = new sap.ui.model.json.JSONModel();
        this.oModelForDimensions = new sap.ui.model.json.JSONModel();

        var evalContext = this.evalContext || "";
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
            }).addStyleClass("propertyEntryGrid");;
        });

        //Adapter Implementation ---

        // Fetch All Sap Languages - Adapter Implementation
        var langSuccessHandler = function(obj, arr, localeLanguage) {
            that.SAP_LANGUAGES = obj;
            that.SAP_LANGUAGE_ARRAY = arr;
            that.localLanguage = localeLanguage;
        };
        this.metadataRef.getAllLanguages({async:false, success:langSuccessHandler, model:this.oDataModel});
        this.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES", 0);
        this.setInputParameterAndFilterLayout();
        this.decideMode();

        this.valid_maxlength = {};
        this.valid_maxlength.hana = {
                id: 512,
                title: 128,
        };
        this.valid_maxlength.cds = {
                id: 40,
                title: 40,
        };

    },
    decideMode : function(){
        var that = this;
        this.oRouter.attachRouteMatched(function(evt) {
            this.showDataSourceError = false;
            this.getView().getModel().setProperty("/SCALING","0")
            if(evt.getParameter("name") === "duplicateEvaluation"){
                try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                        sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_TITLE_DUPLICATE"));
                    }
                } catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_TITLE_DUPLICATE"))
                }
                this.evalContext = evt.getParameter("arguments").evaluationContext;
                this.indicatorContext = evt.getParameter("arguments").indicatorContext;
                that.getView().getModel().setProperty("/mode","create");
                that.generateEvalId(that);
                that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_TITLE_DUPLICATE"));
                that.byId("evalId").setEditable(true);
                that.populateEvalDetails();
                that.duplicateEval = true;
                that.fromHome = false;
            }
            else if(evt.getParameter("name") === "editEvaluationDraft"){
                that.setHeaderFooterOptions(that.oOptionsForEdit);
                try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                        sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"));
                    }
                } catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"))
                }
                this.evalContext = evt.getParameter("arguments").evaluationContext;
                this.indicatorContext = evt.getParameter("arguments").indicatorContext;
                that.getView().getModel().setProperty("/mode","edit");
                this.editDraft = true;
                that.populateEvalDetails();
                that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"));
                that.byId("evalId").setEditable(false);
                that.fromHome = false;
            }
            else if(evt.getParameter("arguments").indicatorContext && evt.getParameter("arguments").evaluationContext){
                try {
                    if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
                        sap.ushell.services.AppConfiguration.setWindowTitle(that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"));
                    }
                } catch(e){
                    jQuery.sap.log.error("Error Setting Window Page Title : "+that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"))
                }
                this.evalContext = evt.getParameter("arguments").evaluationContext;
                this.indicatorContext = evt.getParameter("arguments").indicatorContext;
                that.getView().getModel().setProperty("/mode","edit");
                that.populateEvalDetails();
                that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_TITLE_EDIT"));
                that.byId("evalId").setEditable(false);
                that.fromHome = false;
            }
            else if(evt.getParameter("arguments").indicatorContext){
                that.getView().getModel().setProperty("/mode","create");
                that.generateEvalId(that);
                that.busyDialog.open();
                this.indicatorContext = evt.getParameter("arguments").indicatorContext;
                that.getView().getModel().setProperty("/IS_ACTIVE",0);
                that.getView().getModel().setProperty("/DECIMAL_PRECISION",-1);
                that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES", 0);
                that.getKpiDetails();
                that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_TITLE"));
                that.byId("indicatorId").setEditable(false);
                that.fromHome = false;
            }
            else{
                that.byId("selectKpi").setText(that.oResourceBundle.getText("SELECT_KPI_OPI"));
                that.generateEvalId(that);
                that.getView().getModel().setProperty("/mode","create");
                that.getView().getModel().setProperty("/IS_ACTIVE",0);
                that.getView().getModel().setProperty("/DECIMAL_PRECISION",-1);
                that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES", 0);
                that._oControlStore.oTitle.setText(that.oResourceBundle.getText("FULLSCREEN_TITLE"));
                that.fromHome = true;
            }

        }, this);
    },
    populateEvalDetails : function(){
        var that = this;
        that.busyDialog.open();

        var indicatorFetchCallBack = function(kpiData) {
            kpiData = kpiData.INDICATOR;
            that.getView().getModel().setProperty("/INDICATOR",kpiData.ID);
            that.byId("indicatorId").setEditable(false);
            that.getView().getModel().setProperty("/INDICATORTITLE",kpiData.TITLE);
            that.getView().getModel().setProperty("/GOAL_TYPE",kpiData.GOAL_TYPE);
            if(kpiData.DATA_SPECIFICATION){
                that.getView().getModel().setProperty("/DATA_SPECIFICATION",kpiData.DATA_SPECIFICATION);
                that.byId("additionalInfo").setVisible(true);
            }
            else{
                that.byId("additionalInfo").setVisible(false);
            }
            that.getView().getModel().setProperty("/INDICATOR_TYPE",kpiData.TYPE);
        };
        var indicatorFetchErrCallBack = function(d,s,x) {
            that.busyDialog.close();
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_DOES_NOT_EXIST"));
            that.errorMessages.push({
                "type" : "Error",
                "title" : that.oResourceBundle.getText("ERROR_KPI_DOES_NOT_EXIST")
            });
            that.errorState = true;
        };
        var indicatorContext = new sap.ui.model.Context(that.getView().getModel(), '/' + that.indicatorContext);
        that.metadataRef.getKPIById({context:indicatorContext, success:indicatorFetchCallBack, error:indicatorFetchErrCallBack, async:false, model:that.oDataModel});



        var evaluationFetchErrCallBack = function(d,s,x) {
            that.busyDialog.close();
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_EVALUATION_DOES_NOT_EXIST"));
            that.errorMessages.push({
                "type" : "Error",
                "title" : that.oResourceBundle.getText("ERROR_EVALUATION_DOES_NOT_EXIST")
            });
            that.errorState = true;
        };
        var evaluationFetchCallBack = function(data) {
            var evaluation = data.EVALUATION;
            that.evalDetails = {};
            that.evalDetails = jQuery.extend(true,evaluation,data);
            delete that.evalDetails.EVALUATION;
            that.getView().getModel().setProperty("/ID",evaluation.ID);
            that.getView().getModel().setProperty("/TITLE",evaluation.TITLE);
            that.getView().getModel().setProperty("/DESCRIPTION",evaluation.DESCRIPTION);
            that.getView().getModel().setProperty("/IS_ACTIVE",0);
            that.getView().getModel().setProperty("/SEMANTIC_OBJECT",evaluation.SEMANTIC_OBJECT);
            that.getView().getModel().setProperty("/ACTION",evaluation.ACTION);
            if(evaluation.GOAL_TYPE){
                that.getView().getModel().setProperty("/GOAL_TYPE",evaluation.GOAL_TYPE);
            }
            that.getView().getModel().setProperty("/INDICATOR_TYPE",evaluation.INDICATOR_TYPE);
            that.getView().getModel().setProperty("/OWNER_NAME",evaluation.OWNER_NAME);
            that.getView().getModel().setProperty("/OWNER_ID",evaluation.OWNER_ID);
            that.getView().getModel().setProperty("/OWNER_E_MAIL",evaluation.OWNER_E_MAIL);
            that.getView().getModel().setProperty("/VIEW_NAME",evaluation.VIEW_NAME);
            that.getView().getModel().setProperty("/ODATA_URL",evaluation.ODATA_URL);
            that.getView().getModel().setProperty("/COLUMN_NAME",evaluation.COLUMN_NAME);  
            that.getView().getModel().setProperty("/SCALING",evaluation.SCALING);
            that.getView().getModel().setProperty("/DECIMAL_PRECISION",evaluation.DECIMAL_PRECISION);
            that.getView().getModel().setProperty("/VALUES_SOURCE",evaluation.VALUES_SOURCE);
            that.createTargetThresholdLayout();
            if(evaluation.ODATA_ENTITYSET){
                that.getView().getModel().setProperty("/ODATA_ENTITYSET",evaluation.ODATA_ENTITYSET);
                try{
                    that.oModelForMeasure = that.populateMeasure(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
                    that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
                }
                catch(e){
                    that.showDataSourceError = true;
                    that.resetDimensionsAndInputParameters();
                }
            }
            that.getView().getModel().updateBindings();

            //Texts
            languageData = data.TEXTS || [];
            var languageArray = [];
            that.evalDetails.ADDITIONAL_LANGUAGE_ARRAY = [];
            for(i=0;i<languageData.length;i++){
                var languageObject = {};
                languageObject.TITLE = languageData[i].TITLE;
                languageObject.DESCRIPTION = languageData[i].DESCRIPTION;
                that.oDataModel.read("/LANGUAGE?$filter=SPRAS eq '"+languageData[i].LANGUAGE+"'", null, null, false, function(langData) {
                    languageObject.LANGUAGE_KEY = langData.results[0].SPRAS;
                    languageObject.LANGUAGE = langData.results[0].LAISO;
                    languageObject.IS_ACTIVE = that.getView().getModel().getData().IS_ACTIVE;
                    languageObject.ID = that.getView().getModel().getData().ID;
                });
                if(languageObject.LANGUAGE_KEY!=that.localLanguage){
                    languageArray.push(languageObject);
                }
            }
            that.getView().getModel().setProperty("/ADDITIONAL_LANGUAGE_ARRAY",languageArray);
            that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES",languageArray.length); 
            for(var i=0;i<languageArray.length;i++){
                var langObj = {};
                langObj.ID = languageArray[i].ID;
                langObj.IS_ACTIVE = languageArray[i].IS_ACTIVE;
                langObj.LANGUAGE = languageArray[i].LANGUAGE_KEY;
                langObj.TITLE = languageArray[i].TITLE;
                langObj.DESCRIPTION = languageArray[i].DESCRIPTION;
                that.evalDetails.ADDITIONAL_LANGUAGE_ARRAY.push(langObj);
            }
            //that.evalDetails.ADDITIONAL_LANGUAGE_ARRAY = languageArray;
            that.evalDetails.NO_OF_ADDITIONAL_LANGUAGES = languageArray.length;


            //Tags
            var tagsArr = data.TAGS || [];
            if(tagsArr.length > 0){
                var tags = "";
                for(var i=0;i<tagsArr.length;i++){
                    tags+=tagsArr[i].TAG+",";
                }
                tags = tags.substring(0,tags.length-1);
                that.getView().getModel().setProperty("/TAG",tags);
            }

            //Filters
            var filtersArr = data.FILTERS || [];
            if(filtersArr.length){
                var inputParams = [], dimensions = [],j=0,k=0;
                for(var i=0;i<filtersArr.length;i++){
                    if(filtersArr[i].TYPE === "PA"){
                        inputParams[j] = {};
                        inputParams[j++] = filtersArr[i];
                    }
                    else if(filtersArr[i].TYPE === "FI"){
                        dimensions[k] = {};
                        dimensions[k++] = filtersArr[i];
                    }
                }
                if(inputParams.length > 0){
                    var inputParamFormatted =  {};
                    inputParamFormatted.inputParameters = [];
                    inputParamFormatted.inputParameters = that.formObjectForFilters(inputParams);
                    if(that.oModelForInputParameters.getData().inputParameters && that.oModelForInputParameters.getData().inputParameters.length) {
                        for(var i=0;i<that.oModelForInputParameters.getData().inputParameters.length;i++){
                            for(var j=0;j<inputParamFormatted.inputParameters.length;j++){
                                if(that.oModelForInputParameters.getData().inputParameters[i].name === inputParamFormatted.inputParameters[j].name){
                                    that.oModelForInputParameters.getData().inputParameters[i].value_1 = inputParamFormatted.inputParameters[j].value_1;
                                    that.oModelForInputParameters.getData().inputParameters[i].value_2 = inputParamFormatted.inputParameters[j].value_2;
                                }
                            }
                        }
                        that.oModelForInputParameters.updateBindings();

                    }
                }
                if(dimensions.length > 0){
                    var filtersFormatted = {};
                    filtersFormatted.selectedDimensions = [];
                    filtersFormatted.selectedDimensions = that.formObjectForFilters(dimensions);
                    that.oModelForDimensions.getData().selectedDimensions = filtersFormatted.selectedDimensions;
                    that.oModelForDimensions.updateBindings();

                }
            }

            //Properties
            var propertiesArr = data.PROPERTIES || [];
            if(propertiesArr.length > 0){
                that.getView().getModel().setProperty("/PROPERTIES",propertiesArr);
                that.getView().getModel().updateBindings();
            }

            //Values
            var valuesArr = data.VALUES || [];
            if(valuesArr.length > 0){
                for(i=0;i<valuesArr.length;i++){
                    if(valuesArr[i].FIXED){
                        that.populateTargetAndTresholds(valuesArr[i].TYPE,valuesArr[i].FIXED);
                    }
                    else{
                        that.populateTargetAndTresholds(valuesArr[i].TYPE,valuesArr[i].COLUMN_NAME);
                    }
                } 
            }

            that.busyDialog.close();
        };

        var evaluationContext = new sap.ui.model.Context(that.getView().getModel(), '/' + that.evalContext);
        that.metadataRef.getEvaluationById({context:evaluationContext, success:evaluationFetchCallBack, error:evaluationFetchErrCallBack, async:false, filters:true, values:true, properties:true, tags: true, texts:true, model:that.oDataModel});		
    },
    populateAdditionalMeasures : function(type,value){
        var that = this;
        var multiInput = that.getView().byId("additionalMeasures");
        multiInput.addToken(new sap.m.Token({text : value}));
        that.getView().byId("additionalMeasures").setVisible(true);
        that.getView().byId("additionalMeasureLabel").setVisible(true);
        that.getView().byId("selectedLabel").setVisible(true);
        that.getView().byId("selectedadditionalMeasures").setVisible(true);
        that.selectedMeasure();
    },
    populateTargetAndTresholds : function(type,value){
        var that = this;
        switch(type){
        case "CL" : that.getView().getModel().setProperty("/CRITICALLOW",value);break;
        case "WL" : that.getView().getModel().setProperty("/WARNINGLOW",value);break;
        case "TA" : that.getView().getModel().setProperty("/TARGET",value);break;
        case "CH" : that.getView().getModel().setProperty("/CRITICALHIGH",value);break;
        case "WH" : that.getView().getModel().setProperty("/WARNINGHIGH",value);break;
        case "TC" : that.getView().getModel().setProperty("/TREND",value);break;
        case "RE" : that.getView().getModel().setProperty("/REFERENCE_VALUE",value);break;
        default : that.populateAdditionalMeasures(type,value);
        }
    },
    formObjectForFilters : function(listOfFilters){
        var i = 0, j = 0, k = 0,l=0, temp = [], tempObj;
        var dataSource = this.evalDetails.ODATA_URL;
        var entitySet = this.evalDetails.ODATA_ENTITYSET;
        var queryResultObjDimensions = sap.suite.ui.smartbusiness.lib.OData.filter(dataSource,entitySet).getAsObject();
        var extensions = null;
        var requiredProperty = false;
        var filterRestriction = null;

        for(i=0;i<listOfFilters.length;i++){
            requiredProperty = false;
            filterRestriction = null;
            if(queryResultObjDimensions && queryResultObjDimensions[listOfFilters[i].NAME] && 
                    queryResultObjDimensions[listOfFilters[i].NAME].getKeyProperty() && 
                    queryResultObjDimensions[listOfFilters[i].NAME].getKeyProperty().extensions){
                extensions = queryResultObjDimensions[listOfFilters[i].NAME].getKeyProperty().extensions;
                for(l=0;l<extensions.length;l++){
                    if(extensions[l].name == "required-in-filter" && extensions[l].value == "true"){
                        requiredProperty = true;						
                    }
                    if(extensions[l].name == "filter-restriction"){
                        filterRestriction = extensions[l].value;
                    }
                }
            }
            if(listOfFilters[i].OPERATOR == "BT"){
                tempObj = {};
                tempObj = {"name":listOfFilters[i].NAME, "operator":listOfFilters[i].OPERATOR,  "value_1":listOfFilters[i].VALUE_1, "value_2":listOfFilters[i].VALUE_2};
                tempObj.required = requiredProperty;
                tempObj.filterRestriction = filterRestriction;
                temp[j++] = tempObj; 
            }
            else{
                for(k=0;k<temp.length;k++){
                    if((temp[k].name == listOfFilters[i].NAME) && (temp[k].operator == listOfFilters[i].OPERATOR)){
                        break;
                    }
                }
                if(k == temp.length){
                    tempObj = {};
                    tempObj = {"name":listOfFilters[i].NAME, "operator":listOfFilters[i].OPERATOR,  "value_1":listOfFilters[i].VALUE_1, "value_2":listOfFilters[i].VALUE_2};
                    tempObj.required = requiredProperty;
                    tempObj.filterRestriction = filterRestriction;
                    temp[j++] = tempObj;
                }
                else{
                    temp[k].value_1+=","+listOfFilters[i].VALUE_1;
                }
            }
        }
        return temp;
    },

    // Adapter Implementation ----

    getKpiDetails : function() {
        var that = this;
        if(!that.indicatorContext){
            that.busyDialog.close();
            that.indicatorContext = "INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)"
        }

        var indicatorContext = new sap.ui.model.Context(that.getView().getModel(), '/' + that.indicatorContext);
        var indicatorFetchCallBack = function(data) {
            var indicator = data.INDICATOR;

            if(indicator.IS_ACTIVE == 0){
                sap.m.MessageToast.show(that.oResourceBundle.getText("ERROR_INACTIVE_KPI_CANNOT_HAVE_EVALUATION"));
                window.location.hash = "FioriApplication-SBWorkspace?sap-system=" + sap.suite.ui.smartbusiness.lib.Util.utils.getHanaSystem() + 
                "&/detail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=0)";
                return;
            }
            that.getView().byId("indicatorId").setValueState("None");

            that.getView().getModel().setProperty("/INDICATOR", indicator.ID);
            that.getView().getModel().setProperty("/INDICATORTITLE", indicator.TITLE);
            that.getView().getModel().setProperty("/DESCRIPTION", indicator.DESCRIPTION);
            that.getView().getModel().setProperty("/OWNER_NAME", indicator.OWNER_NAME);
            that.getView().getModel().setProperty("/OWNER_ID", indicator.OWNER_ID);
            that.getView().getModel().setProperty("/OWNER_E_MAIL", indicator.OWNER_E_MAIL);
            that.getView().getModel().setProperty("/SEMANTIC_OBJECT", indicator.SEMANTIC_OBJECT);
            that.getView().getModel().setProperty("/ACTION", indicator.ACTION);
            that.getView().getModel().setProperty("/INDICATOR_TYPE", indicator.TYPE);
            that.getView().getModel().setProperty("/VIEW_NAME", indicator.VIEW_NAME);
            that.getView().getModel().setProperty("/ODATA_URL", indicator.ODATA_URL);
            that.getView().getModel().setProperty("/COLUMN_NAME", indicator.COLUMN_NAME);
            that.getView().getModel().setProperty("/GOAL_TYPE", indicator.GOAL_TYPE);
            that.getView().getModel().setProperty("/DATA_SPECIFICATION", indicator.DATA_SPECIFICATION);
            if(indicator.DATA_SPECIFICATION != ""){
                that.byId("additionalInfo").setVisible(true);
            }
            else{
                that.byId("additionalInfo").setVisible(false);
            }
            that.createTargetThresholdLayout();
            if (indicator.ODATA_ENTITYSET) {
                that.getView().getModel().setProperty("/ODATA_ENTITYSET", indicator.ODATA_ENTITYSET);
                that.resetDimensionsAndInputParameters();
                try{
                    that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
                    that.oModelForMeasure = that.populateMeasure(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
                    if(that.inputParameterSapClientCheckBox){
                        that.inputParameterSapClientCheckBox.fireSelect();
                    }
                }
                catch(e) {
                    sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
                    that.errorMessages.push({
                        "type":"Error",
                        "title":that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"),
                        "description" : that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS")
                    });
                    that.errorState = true;
                    that.resetDimensionsAndInputParameters();
                }

            }

            //Tags
            var tagsArr = data.TAGS || [];
            if(tagsArr.length > 0){
                var tags = "";
                for(var i=0;i<tagsArr.length;i++){
                    tags+=tagsArr[i].TAG+",";
                }
                tags = tags.substring(0,tags.length-1);
                that.getView().getModel().setProperty("/TAG",tags);
            }

            //Properties
            var propertiesArr = data.PROPERTIES || [];
            if(propertiesArr.length > 0){
                that.getView().getModel().setProperty("/PROPERTIES",propertiesArr);
                that.getView().getModel().updateBindings();
            }

            that.busyDialog.close();
        };

        var indicatorFetchErrCallBack = function(d,s,k) {
            that.busyDialog.close(); 
            that.getView().byId("indicatorId").setValueState("Error");
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_KPI_DOES_NOT_EXIST"));
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_KPI_DOES_NOT_EXIST")
            });
            that.errorState = true;
        };

        that.metadataRef.getKPIById({context:indicatorContext, async:false, texts:true, tags:true, properties:true, success:indicatorFetchCallBack, error:indicatorFetchErrCallBack, model:that.oDataModel});
    },
    getEvalParamPayload : function(formData) {
        var evalPayload = {};
        evalPayload.ID = formData.ID;
        evalPayload.DESCRIPTION = formData.DESCRIPTION;
        evalPayload.INDICATOR = formData.INDICATOR;
        evalPayload.ODATA_URL = formData.ODATA_URL;
        evalPayload.VIEW_NAME = formData.VIEW_NAME;
        evalPayload.COLUMN_NAME = formData.COLUMN_NAME;
        evalPayload.OWNER_NAME = formData.OWNER_NAME;
        evalPayload.OWNER_E_MAIL = formData.OWNER_E_MAIL;
        evalPayload.OWNER_ID = formData.OWNER_ID;
        evalPayload.CREATED_BY = "";
        evalPayload.CHANGED_BY = "";
        evalPayload.IS_ACTIVE = formData.IS_ACTIVE;
        evalPayload.SCALING = parseInt(formData.SCALING)||0;
        evalPayload.TITLE = formData.TITLE;
        evalPayload.ENTITY_TYPE = "";
        evalPayload.ODATA_ENTITYSET = formData.ODATA_ENTITYSET;
        evalPayload.ODATA_PROPERTY = "";
        evalPayload.SEMANTIC_OBJECT = formData.SEMANTIC_OBJECT;
        evalPayload.ACTION = formData.ACTION;
        evalPayload.DATA_SPECIFICATION = formData.DATA_SPECIFICATION;
        evalPayload.GOAL_TYPE = formData.GOAL_TYPE;
        evalPayload.INDICATOR_TYPE = formData.INDICATOR_TYPE;
        evalPayload.VALUES_SOURCE = formData.VALUES_SOURCE;
        evalPayload.DECIMAL_PRECISION = parseInt(formData.DECIMAL_PRECISION)||0;
        return evalPayload;
    },
    setFilterPayload : function(id, type, name, operator, value1, value2) {
        var obj = {};
        obj.ID = id;
        obj.IS_ACTIVE = this.getView().getModel().getData().IS_ACTIVE;
        obj.TYPE = type;
        obj.NAME = name;
        obj.OPERATOR = operator;
        obj.VALUE_1 = value1;
        if (value2)
            obj.VALUE_2 = value2;
        else
            obj.VALUE_2 = "";
        return obj;

    },
    getInputParamPayload : function(form) {
        var evalInputParams = {}, j = 0;
        var formData = form.getModel().getData();
        if (form.getController().oModelForInputParameters) {
            evalInputParams = form.getController().oModelForInputParameters.getData();
            if (evalInputParams.inputParameters) {
                if (evalInputParams.inputParameters.length > 0) {
                    var i = 0, filterValue = [], filterValue1;
                    while (i < evalInputParams.inputParameters.length) {
                        if (evalInputParams.inputParameters[i].operator === "BT") {
                            if ((evalInputParams[i].value_1 !== "") || (evalInputParams[i].value_2 !== "")) {
                                filterValue = evalInputParams.inputParameters[i].value_1.split(",");
                                filterValue1 = evalInputParams.inputParameters[i].value_2.split(",");
                                if ((filterValue1.length === 1) && (!filterValue.length === 1)) {

                                    evalInputParams.inputParameters[i].value_1 = (evalInputParams.inputParameters[i].propertyType == "Edm.DateTime")
                                    ? new Date(evalInputParams.inputParameters[i].value_1).toJSON() : evalInputParams.inputParameters[i].value_1;
                                    evalInputParams.inputParameters[i].value_2 = (evalInputParams.inputParameters[i].propertyType == "Edm.DateTime")
                                    ? new Date(evalInputParams.inputParameters[i].value_2).toJSON() : evalInputParams.inputParameters[i].value_2;
                                    this.evalFiltersPayload[j] = {};
                                    this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "PA",
                                            evalInputParams.inputParameters[i].name, evalInputParams.inputParameters[i].operator,
                                            evalInputParams.inputParameters[i].value_1, evalInputParams.inputParameters[i].value_2);
                                    j++;
                                }
                            }
                        } else {
                            filterValue = evalInputParams.inputParameters[i].value_1.split(",");
                            if (filterValue.length > 0) {
                                for ( var k = 0; k < filterValue.length; k++) {
                                    if (filterValue[k] !== "") {

                                        filterValue[k] = (evalInputParams.inputParameters[i].propertyType == "Edm.DateTime")
                                        ? new Date(filterValue[k]).toJSON() : filterValue[k];
                                        this.evalFiltersPayload[j] = {};
                                        this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "PA",
                                                evalInputParams.inputParameters[i].name, evalInputParams.inputParameters[i].operator,
                                                filterValue[k]);
                                        j++;
                                    }
                                }
                            }
                        }
                        i++;
                    }
                }
            }

        }
    },
    getFiltersPayload : function(form) {
        var formData = form.getModel().getData();
        var evalDimensionFilters = {}, j = this.evalFiltersPayload.length;
        if (form.getController().oModelForDimensions) {
            evalDimensionFilters = form.getController().oModelForDimensions.getData();
            if (evalDimensionFilters.selectedDimensions) {
                if (evalDimensionFilters.selectedDimensions.length > 0) {
                    var i = 0, filterValue = [], filterValue1;
                    while (i < evalDimensionFilters.selectedDimensions.length) 
                    {
                        if (evalDimensionFilters.selectedDimensions[i].operator === "BT") 
                        {
                            if ((evalDimensionFilters.selectedDimensions[i].value_1 !== "")
                                    && (evalDimensionFilters.selectedDimensions[i].value_2 !== ""))
                            {
                                filterValue = evalDimensionFilters.selectedDimensions[i].value_1.split(",");
                                filterValue1 = evalDimensionFilters.selectedDimensions[i].value_2.split(",");
                                if ((filterValue1.length === 1) || (!filterValue.length === 1))
                                {
                                    evalDimensionFilters.selectedDimensions[i].value_1 = (evalDimensionFilters.selectedDimensions[i].propertyType == "Edm.DateTime")
                                    ? new Date(evalDimensionFilters.selectedDimensions[i].value_1).toJSON() : evalDimensionFilters.selectedDimensions[i].value_1;
                                    evalDimensionFilters.selectedDimensions[i].value_2 = (evalDimensionFilters.selectedDimensions[i].propertyType == "Edm.DateTime")
                                    ? new Date(evalDimensionFilters.selectedDimensions[i].value_2).toJSON() : evalDimensionFilters.selectedDimensions[i].value_2;
                                    this.evalFiltersPayload[j] = {};
                                    this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "FI",
                                            evalDimensionFilters.selectedDimensions[i].name,
                                            evalDimensionFilters.selectedDimensions[i].operator,
                                            evalDimensionFilters.selectedDimensions[i].value_1,
                                            evalDimensionFilters.selectedDimensions[i].value_2);

                                    j++;
                                }
                            }
                        } else {
                            filterValue = evalDimensionFilters.selectedDimensions[i].value_1.split(",");
                            if (filterValue.length > 0) 
                            {
                                for (var k = 0; k < filterValue.length; k++)
                                {
                                    if (filterValue[k] != "")
                                    {      
                                        filterValue[k] = (evalDimensionFilters.selectedDimensions[i].propertyType == "Edm.DateTime")
                                        ? new Date(filterValue[k]).toJSON() : filterValue[k];
                                        this.evalFiltersPayload[j] = {};
                                        this.evalFiltersPayload[j] = this.setFilterPayload(formData.ID, "FI",
                                                evalDimensionFilters.selectedDimensions[i].name,
                                                evalDimensionFilters.selectedDimensions[i].operator, 
                                                filterValue[k]);
                                        j++;
                                    }

                                }
                            }
                        }
                        i++;
                    }
                }
            }
        }
    },

    getThresholdValue : function(id, type, state, value) {
        var obj = {};
        obj.ID = id;
        obj.TYPE = type;
        obj.IS_ACTIVE = state;

        var form = this.getView();
        var formData = form.getModel().getData();
        var valueType = formData.VALUES_SOURCE;
        if (valueType === "MEASURE") {
            obj.COLUMN_NAME = value;
        }
        if (valueType === "FIXED") {
            obj.FIXED = value;
        }
        if (valueType === "RELATIVE"){
            if(type=="TA" || type=="TC" || type=="RE"){
                obj.COLUMN_NAME = value;
            }
            else{
                obj.FIXED = value;
            }
        }
        obj.ODATA_PROPERTY = "";
        return obj;
    },
    getRangePayload : function(form) {
        var formData = form.getModel().getData();
        var i = 0;
        if (formData.CRITICALHIGH && formData.CRITICALHIGH !== "") {
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "CH", formData.IS_ACTIVE, formData.CRITICALHIGH);
            i++;
        }
        if (formData.WARNINGHIGH && formData.WARNINGHIGH !== "") {
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "WH", formData.IS_ACTIVE, formData.WARNINGHIGH);
            i++;
        }
        if (formData.TARGET && formData.TARGET !== "") {
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "TA", formData.IS_ACTIVE,formData.TARGET);
            i++;
        }
        if (formData.CRITICALLOW && formData.CRITICALLOW !== "") {
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "CL", formData.IS_ACTIVE,formData.CRITICALLOW);
            i++;
        }
        if (formData.WARNINGLOW && formData.WARNINGLOW !== "") {
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "WL", formData.IS_ACTIVE,formData.WARNINGLOW);
            i++;
        }
    },
    getMaximizingPayload : function(form) {
        var formData = form.getModel().getData();
        var i = this.valuesPayload.length;

        if (formData.TARGET && formData.TARGET !== "") {
            this.valuesPayload[i] = this
            .getThresholdValue(formData.ID, "TA", formData.IS_ACTIVE, formData.TARGET);
            i++;
        }
        if (formData.CRITICALLOW && formData.CRITICALLOW !== "") {
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "CL", formData.IS_ACTIVE,formData.CRITICALLOW);
            i++;
        }
        if (formData.WARNINGLOW && formData.WARNINGLOW !== "") {
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "WL", formData.IS_ACTIVE,formData.WARNINGLOW);
            i++;
        }
    },
    getMinimizingPayload : function(form) {
        var formData = form.getModel().getData();
        var i = this.valuesPayload.length;

        if (formData.CRITICALHIGH && formData.CRITICALHIGH !== "") {
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "CH", formData.IS_ACTIVE,formData.CRITICALHIGH);
            i++;
        }
        if (formData.WARNINGHIGH && formData.WARNINGHIGH !== "") {
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "WH", formData.IS_ACTIVE,formData.WARNINGHIGH);
            i++;
        }
        if (formData.TARGET && formData.TARGET !== "") {
            this.valuesPayload[i] = this
            .getThresholdValue(formData.ID, "TA", formData.IS_ACTIVE, formData.TARGET);
            i++;
        }

    },
    saveFilters : function(form) {
        this.evalFiltersPayload = [];
        this.getInputParamPayload(form);
        this.getFiltersPayload(form);
    },
    saveValues : function(form) {
        var that = this;
        this.valuesPayload = [];
        var formData = form.getModel().getData();
        switch (formData.GOAL_TYPE) {
        case "RA" :
            that.getRangePayload(form);
            break;
        case "MA" :
            that.getMaximizingPayload(form);
            break;
        case "MI" :
            that.getMinimizingPayload(form);
            break;
        }
        if (formData.TREND && formData.TREND !== "") {
            var i = this.valuesPayload.length;
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "TC", formData.IS_ACTIVE, formData.TREND);
            i++;
        }
        if (formData.REFERENCE_VALUE && formData.REFERENCE_VALUE !== "") {
            var i = this.valuesPayload.length;
            this.valuesPayload[i] = this.getThresholdValue(formData.ID, "RE", formData.IS_ACTIVE, formData.REFERENCE_VALUE);
            i++;
        }
        if(that.getView().byId("additionalMeasures").getTokens().length){
            var tokens = that.getView().byId("additionalMeasures").getTokens();
            for(var i=0,j=this.valuesPayload.length;i<tokens.length;i++){
                var type = "0";
                if (i.toString().length === 1) { 
                    type = "0"+i; 
                }
                else{
                    type = i.toString();
                }
                this.valuesPayload[j++] = {
                        ID:formData.ID,
                        IS_ACTIVE:formData.IS_ACTIVE,
                        TYPE:type,
                        COLUMN_NAME:tokens[i].getText(),
                        ODATA_PROPERTY:""
                }
            }
        }
    },
    saveTags : function(form) {
        var formData = form.getModel().getData();
        this.tagsPayload = [];
        if (formData.TAG) {
            var tags = [];

            tags = formData.TAG.split(",");
            for ( var i = 0; i < tags.length; i++) {
                this.tagsPayload[i] = {};
                this.tagsPayload[i].ID = formData.ID;
                this.tagsPayload[i].IS_ACTIVE = formData.IS_ACTIVE;
                this.tagsPayload[i].TYPE = "EV";
                this.tagsPayload[i].TAG = tags[i];
            }
        }

    },
    saveProperties : function(form) {
        var formData = form.getModel().getData();
        this.propPayload = [];
        if (formData.PROPERTIES) {
            for ( var i = 0; i < formData.PROPERTIES.length; i++) {
                this.propPayload[i] = {};
                this.propPayload[i].ID = formData.ID;
                this.propPayload[i].IS_ACTIVE = formData.IS_ACTIVE;
                this.propPayload[i].TYPE = "EV";
                this.propPayload[i].NAME = formData.PROPERTIES[i].NAME;
                this.propPayload[i].VALUE = formData.PROPERTIES[i].VALUE;
            }

        }
    },
    saveAdditionalLanguages : function(form){
        var that = this;
        var formData = form.getModel().getData();
        this.languagesPayload = [];
        if(formData.NO_OF_ADDITIONAL_LANGUAGES > 0){
            var i=0,j=0,k=0,temp;
            for(i=0;i<formData.ADDITIONAL_LANGUAGE_ARRAY.length;i++){
                this.languagesPayload[i] = {};
                this.languagesPayload[i].ID = formData.ID;
                this.languagesPayload[i].IS_ACTIVE = formData.IS_ACTIVE;
                this.languagesPayload[i].LANGUAGE = formData.ADDITIONAL_LANGUAGE_ARRAY[i].LANGUAGE_KEY;
                this.languagesPayload[i].TITLE = formData.ADDITIONAL_LANGUAGE_ARRAY[i].TITLE;
                this.languagesPayload[i].DESCRIPTION = formData.ADDITIONAL_LANGUAGE_ARRAY[i].DESCRIPTION;
            }
        }

    },
    createBatchForEvalCreateMode : function(oEvent){
        var that = this;
        that.evalPayload = {};
        that.evalPayload.ID = that.evalParamPayload.ID;
        that.evalPayload.IS_ACTIVE = that.evalParamPayload.IS_ACTIVE;
        that.evalPayload.EVALUATION = that.evalParamPayload;
        delete that.evalPayload.EVALUATION.ID;
        delete that.evalPayload.EVALUATION.IS_ACTIVE;

        that.evalPayload.FILTERS = [];
        that.evalPayload.FILTERS = that.evalFiltersPayload;
        for(var i=0;i<that.evalPayload.FILTERS.length;i++){
            delete that.evalPayload.FILTERS[i].ID;
            delete that.evalPayload.FILTERS[i].IS_ACTIVE;
        }
        that.evalPayload.VALUES = [];
        that.evalPayload.VALUES = that.valuesPayload;
        for(var i=0;i<that.evalPayload.VALUES.length;i++){
            delete that.evalPayload.VALUES[i].ID;
            delete that.evalPayload.VALUES[i].IS_ACTIVE;
        }
        that.evalPayload.TAGS = [];
        that.evalPayload.TAGS = that.tagsPayload;
        for(var i=0;i<that.evalPayload.TAGS.length;i++){
            delete that.evalPayload.TAGS[i].ID;
            delete that.evalPayload.TAGS[i].IS_ACTIVE;
        }
        that.evalPayload.PROPERTIES = [];
        that.evalPayload.PROPERTIES = that.propPayload;
        for(var i=0;i<that.evalPayload.PROPERTIES.length;i++){
            delete that.evalPayload.PROPERTIES[i].ID;
            delete that.evalPayload.PROPERTIES[i].IS_ACTIVE;
        }


        that.evalPayload.TEXTS = [];
        that.evalPayload.TEXTS = that.languagesPayload;
        for(var i=0;i<that.evalPayload.TEXTS.length;i++){
            delete that.evalPayload.TEXTS[i].ID;
            delete that.evalPayload.TEXTS[i].IS_ACTIVE;
        }

        var evalPayload = {payload:that.evalPayload};
        evalPayload.keys = {};
        evalPayload.keys.ID = that.evalPayload.ID;
        evalPayload.keys.IS_ACTIVE = that.evalPayload.IS_ACTIVE;
        delete evalPayload.ID;
        delete evalPayload.IS_ACTIVE;

        var url = "EVALUATION";

        that.metadataRef.create(url,evalPayload,null,function(data){
            that.saveSuccessHandling(oEvent);
        },function(error){
            that.saveErrorHandling(error);
        });
    },

    createBatchPayload:function(oEvent){
        var that = this,i = 0;
        var path, updateRequired = false;
        var updatePayload = {};
        var batch = {};
        var formData = that.getView().getModel().getData();
        updatePayload.ID = formData.ID;
        updatePayload.IS_ACTIVE = formData.IS_ACTIVE;
        //checking for changes in evaluation parameters
        batch.oldPayload = that.getEvalParamPayload(that.evalDetails);
        batch.newPayload = that.evalParamPayload;
        batch.objectType = "Evaluations";
        batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
        if(batch.updates.length > 0){
            updatePayload.EVALUATION = {};
            updatePayload.EVALUATION.update = {}
            updatePayload.EVALUATION.update = that.evalParamPayload;
            delete updatePayload.EVALUATION.update.ID;
            delete updatePayload.EVALUATION.update.IS_ACTIVE;
            updateRequired = true;
        }

        //for changes in evaluation filters
        batch.oldPayload = that.evalDetails.FILTERS;
        batch.newPayload = that.evalFiltersPayload;
        batch.objectType = "EVALUATION_FILTERS";
        batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
        updatePayload.FILTERS = {};
        if(batch.deletes.length > 0){
            for(i=0;i<batch.deletes.length;i++){
                delete batch.deletes[i].ID;
                delete batch.deletes[i].IS_ACTIVE;
            }
            updatePayload.FILTERS.remove = batch.deletes;
            updateRequired = true;
        }
        if(batch.updates.length > 0){
            for(var i=0;i<batch.updates.length;i++){
                delete batch.updates[i].ID;
                delete batch.updates[i].IS_ACTIVE;
            }
            updatePayload.FILTERS.create = batch.updates;
            updateRequired = true;
        }

        //for changes in evaluation values
        for(i=0;i<that.evalDetails.VALUES.length;i++){
            if(that.evalDetails.VALUES[i].COLUMN_NAME){
                delete that.evalDetails.VALUES[i].FIXED;
            }
            else{
                delete that.evalDetails.VALUES[i].COLUMN_NAME;
            }
        }
        batch.oldPayload = that.evalDetails.VALUES;
        batch.newPayload = that.valuesPayload;
        batch.objectType = "EVALUATION_VALUES";
        batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
        updatePayload.VALUES = {};
        if(batch.deletes.length > 0){
            for(var i=0;i<batch.deletes;i++){
                delete batch.deletes[i].ID;
                delete batch.deletes[i].IS_ACTIVE;
            }
            updatePayload.VALUES.remove = batch.deletes;
            updateRequired = true;
        }
        if(batch.updates.length > 0){
            for(var i=0;i<batch.updates.length;i++){
                delete batch.updates[i].ID;
                delete batch.updates[i].IS_ACTIVE;
            }
            updatePayload.VALUES.create = batch.updates;
            updateRequired = true;
        }

        //for changes in evaluation tags
        batch.oldPayload = that.evalDetails.TAGS;
        batch.newPayload = that.tagsPayload;
        batch.objectType = "TAGS";
        batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
        updatePayload.TAGS = {};
        if(batch.deletes.length > 0){
            for(i=0;i<batch.deletes.length;i++){
                delete batch.deletes[i].ID;
                delete batch.deletes[i].IS_ACTIVE;
            }
            updatePayload.TAGS.remove = batch.deletes;
            updateRequired = true;
        }
        if(batch.updates.length > 0){
            for(var i=0;i<batch.updates.length;i++){
                delete batch.updates[i].ID;
                delete batch.updates[i].IS_ACTIVE;
            }
            updatePayload.TAGS.create = batch.updates;
            updateRequired = true;
        }


        //for changes in evaluation properties
        batch.oldPayload = that.evalDetails.PROPERTIES;
        batch.newPayload = that.propPayload
        batch.objectType = "PROPERTIES";
        batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
        updatePayload.PROPERTIES = {};
        if(batch.deletes.length > 0){
            for(i=0;i<batch.deletes.length;i++){
                delete batch.deletes[i].ID;
                delete batch.deletes[i].IS_ACTIVE;
            }
            updatePayload.PROPERTIES.remove = batch.deletes;
            updateRequired = true;
        }
        if(batch.updates.length > 0){
            for(var i=0;i<batch.updates.length;i++){
                delete batch.updates[i].ID;
                delete batch.updates[i].IS_ACTIVE;
            }
            updatePayload.PROPERTIES.create = batch.updates;
            updateRequired = true;
        }

        //for changes in additional languages
        batch.oldPayload = that.evalDetails.ADDITIONAL_LANGUAGE_ARRAY;
        batch.newPayload = that.languagesPayload
        batch.objectType = "EVALUATION_TEXTS";
        batch = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck(batch);
        updatePayload.TEXTS = {}
        if(batch.deletes.length > 0){
            for(i=0;i<batch.deletes.length;i++){
                delete batch.deletes[i].ID;
                delete batch.deletes[i].IS_ACTIVE;
            }
            updatePayload.TEXTS.remove = batch.deletes;
            updateRequired = true;
        }
        if(batch.updates.length > 0){
            for(var i=0;i<batch.updates.length;i++){
                delete batch.updates[i].ID;
                delete batch.updates[i].IS_ACTIVE;
            }
            updatePayload.TEXTS.create = batch.updates;
            updateRequired = true;
        }
        if(!updateRequired){
            that.busyDialog.close();   
            that.saveSuccessHandling(oEvent);
            return;
        }
        else{
            var evalPayload = {payload:updatePayload};
            evalPayload.keys = {};
            evalPayload.keys.ID = updatePayload.ID;
            evalPayload.keys.IS_ACTIVE = updatePayload.IS_ACTIVE;
            delete evalPayload.ID;
            delete evalPayload.IS_ACTIVE;

            var url = "EVALUATION";
            that.metadataRef.update(url,evalPayload,null,function(data){
                that.saveSuccessHandling(oEvent);
            },function(error){
                that.saveErrorHandling(error);
            });
        }
    },
    saveErrorHandling : function(error){
        var that = this;
        sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_EVAL_SAVE"));
        that.errorMessages.push({
            "type":"Error",
            "title":that.oResourceBundle.getText("ERROR_EVAL_SAVE")
        });
        that.errorState = true;
        that.busyDialog.close();
    },
    saveSuccessHandling : function(oEvent){
        var that = this;
        sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_EVAL_SAVE"));
        if(oEvent === "activate" || oEvent === "saveActivate" || oEvent === "activateAndCreateNew"){
            var obj = {};
            obj.ID = that.getView().getModel().getData().ID;
            var url = "ACTIVATE_EVALUATION";
            that.metadataRef.create(url,obj,null,function(data){
                that.busyDialog.close();
                sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_EVAL_ACTIVATE"));
                if(oEvent === "activate") {
                    window.location.hash = "FioriApplication-configureSBKPITile?sap-system=" + sap.suite.ui.smartbusiness.lib.Util.utils.getHanaSystem() + "&/detail/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)";
                }
                else if(oEvent === "saveActivate" && !that.fromHome) {
                    window.location.hash = "FioriApplication-SBWorkspace?sap-system=" + sap.suite.ui.smartbusiness.lib.Util.utils.getHanaSystem() + "&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)";
                } else if(oEvent === "activateAndCreateNew") {
                    that.byId("evalId").setEditable(true);
                    that.getView().getModel().setData({});
                    that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES",0);
                    that.getKpiDetails();
                    window.location.hash = "FioriApplication-createSBKPIEvaluation&/addEvaluation/"+that.indicatorContext;
                }
                else if(that.fromHome){
                    window.location.hash = "";
                }
            },function(error){
                that.busyDialog.close(); 
                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ACTIVATING_EVALUATION"));
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_ACTIVATING_EVALUATION")
                });
                that.errorState = true;
            });
        }
        else if(oEvent == "create"){
            that.busyDialog.close(); 
            if(that.fromHome){
                window.location.hash = "";
            }
            else{
                if(this.editDraft){
                    window.location.hash = "FioriApplication-SBWorkspace?sap-system=" + sap.suite.ui.smartbusiness.lib.Util.utils.getHanaSystem() + "&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=1)";
                }
                else
                    if(that.duplicateEval){
                        window.location.hash = "FioriApplication-SBWorkspace?sap-system=" + sap.suite.ui.smartbusiness.lib.Util.utils.getHanaSystem() + "&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=0)";
                    }
                    else
                        if(that.evalDetails){
                            var isActive = that.evalDetails.IS_ACTIVE;
                            window.location.hash = "FioriApplication-SBWorkspace?sap-system=" + sap.suite.ui.smartbusiness.lib.Util.utils.getHanaSystem() + "&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE="+isActive+")";
                        }
                        else{
                            window.location.hash = "FioriApplication-SBWorkspace?sap-system=" + sap.suite.ui.smartbusiness.lib.Util.utils.getHanaSystem() + "&/evalDetail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)/EVALUATIONS_MODELER(ID='"+that.getView().getModel().getData().ID+"',IS_ACTIVE=0)";
                        }
            }
        }
        else if(oEvent == "createNew"){
            that.busyDialog.close(); 
            that.byId("evalId").setEditable(true);
            that.getView().getModel().setData({});
            that.getView().getModel().setProperty("/NO_OF_ADDITIONAL_LANGUAGES",0);
            that.getKpiDetails();
            window.location.hash = "FioriApplication-createSBKPIEvaluation&/addEvaluation/"+that.indicatorContext;
        }
        that.busyDialog.close();
    },
    setFooterOnError : function(){
        if(this.editDraft === true){
            if(this.errorMessages.length > 1){
                this.setHeaderFooterOptions(this.oOptionsOnErrorForEdit);
            }
            else{
                this.setHeaderFooterOptions(this.oOptionsForEdit);
            }
        }
        else{
            if(this.errorMessages.length > 1){
                this.setHeaderFooterOptions(this.oOptionsOnErrorForCreate);
            }
            else{
                this.setHeaderFooterOptions(this.oOptionsForCreate);
            }
        }
    },
    saveAndExit : function(oEvent) {
        var that = this;
        that.createBatch = [];
        that.deleteBatch = [];

        this.errorMessages = [];
        this.errorState = false;

        var errorCheck = false;
        var formData = that.getView().getModel().getData();
        var data = {
                errorMsg : [] 
        };

        if(this.VIEW_MODE === "hana"){
            that.byId("odataServiceInput").setValueState("None");
        }
        else{
            that.byId("odataServiceInputCDS").setValueState("None");
        }
        that.byId("entitySetInput").setValueState("None");
        that.byId("valueMeasureInput").setValueState("None");

        if (!(formData.INDICATOR) || formData.INDICATOR.trim() === "") {
            that.byId("indicatorId").setValueState("Error");
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_SELECT_KPI"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_SELECT_KPI")
            });
            that.errorState = true;			
            errorCheck = true;
        }
        if (!(formData.ID)) {
            that.byId("evalId").setValueState("Error");
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID")
            });
            that.errorState = true;			
            errorCheck = true;
        }

        if (!(formData.TITLE) || formData.TITLE.trim() === "") {
            that.byId("evalTitle").setValueState("Error");
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_TITLE"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_TITLE")
            });
            that.errorState = true;			
            errorCheck = true;
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
        if(errorCheck){
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
        if (that.byId("indicatorId").getValueState() === "Error") {
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_KPI_DOES_NOT_EXIST"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_KPI_DOES_NOT_EXIST")
            });
            that.errorState = true;			
            errorCheck = true;
        }
        if (that.byId("evalOwnerEmail").getValueState() === "Error") {
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_E_MAIL"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_E_MAIL")
            });
            that.errorState = true;			
            errorCheck = true;
        }
        if (that.byId("semanticObject").getValueState() === "Error") {
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_VALID_SEMANTIC_OBJECT"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_VALID_SEMANTIC_OBJECT")
            });
            that.errorState = true;			
            errorCheck = true;
        }
        if (that.byId("action").getValueState() === "Error") {
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_VALID_SEMANTIC_OBJECT"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_VALID_SEMANTIC_OBJECT")
            });
            that.errorState = true;			
            errorCheck = true;
        }
        if (that.byId("evalTitle").getValueState() === "Error") {
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_VALID_EVALUATION_TITLE"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_VALID_EVALUATION_TITLE")
            });
            that.errorState = true;			
            errorCheck = true;
        }
        if(formData.mode === "edit"){
            if (!formData.ID) {
                that.byId("evalId").setValueState("Error");
                data.errorMsg.push({
                    text : that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID"),
                    icon : "sap-icon://error",
                    state : sap.ui.core.ValueState.Error
                });
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID")
                });
                that.errorState = true;			
                errorCheck = true;
            }
            if (that.byId("evalId").getValueState() === "Error") {
                if(that.evalIdEval_reason == "NOT_START_WITH_PERIOD") {
                    data.errorMsg.push({
                        text : that.oResourceBundle.getText("ERROR_CDS_EVAL_ID_BEGIN_WITH_PERIOD"),
                        icon : "sap-icon://error",
                        state : sap.ui.core.ValueState.Error
                    });
                    that.errorMessages.push({
                        "type":"Error",
                        "title":that.oResourceBundle.getText("ERROR_CDS_EVAL_ID_BEGIN_WITH_PERIOD")
                    });
                    that.errorState = true;			
                    errorCheck = true;
                    that.evalIdEval_reason = null;
                } else if(that.evalIdEval_reason == "_START_WITH_PERIOD") {
                    data.errorMsg.push({
                        text : that.oResourceBundle.getText("ERROR_HANA_EVAL_ID_BEGIN_WITH_PERIOD"),
                        icon : "sap-icon://error",
                        state : sap.ui.core.ValueState.Error
                    });
                    that.errorMessages.push({
                        "type":"Error",
                        "title":that.oResourceBundle.getText("ERROR_HANA_EVAL_ID_BEGIN_WITH_PERIOD")
                    });
                    that.errorState = true;			
                    errorCheck = true;
                    that.evalIdEval_reason = null;
                } else {
                    data.errorMsg.push({
                        text : that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID"),
                        icon : "sap-icon://error",
                        state : sap.ui.core.ValueState.Error
                    });
                    that.errorMessages.push({
                        "type":"Error",
                        "title":that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID")
                    });
                    that.errorState = true;			
                    errorCheck = true;
                }
            }
        }
        else{
            if(!that.validateEvalId()){
                if (!formData.ID) {
                    that.byId("evalId").setValueState("Error");
                    data.errorMsg.push({
                        text : that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID"),
                        icon : "sap-icon://error",
                        state : sap.ui.core.ValueState.Error
                    });
                    that.errorMessages.push({
                        "type":"Error",
                        "title":that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID")
                    });
                    that.errorState = true;			
                    errorCheck = true;
                }
                if (that.byId("evalId").getValueState() === "Error") {
                    if(that.evalIdEval_reason == "NOT_START_WITH_PERIOD") {
                        data.errorMsg.push({
                            text : that.oResourceBundle.getText("ERROR_CDS_EVAL_ID_BEGIN_WITH_PERIOD"),
                            icon : "sap-icon://error",
                            state : sap.ui.core.ValueState.Error
                        });
                        that.errorMessages.push({
                            "type":"Error",
                            "title":that.oResourceBundle.getText("ERROR_CDS_EVAL_ID_BEGIN_WITH_PERIOD")
                        });
                        that.errorState = true;			
                        errorCheck = true;
                        that.evalIdEval_reason = null;
                    } else if(that.evalIdEval_reason == "_START_WITH_PERIOD") {
                        data.errorMsg.push({
                            text : that.oResourceBundle.getText("ERROR_HANA_EVAL_ID_BEGIN_WITH_PERIOD"),
                            icon : "sap-icon://error",
                            state : sap.ui.core.ValueState.Error
                        });
                        that.errorMessages.push({
                            "type":"Error",
                            "title":that.oResourceBundle.getText("ERROR_HANA_EVAL_ID_BEGIN_WITH_PERIOD")
                        });
                        that.errorState = true;			
                        errorCheck = true;
                        that.evalIdEval_reason = null;
                    } else {
                        data.errorMsg.push({
                            text : that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID"),
                            icon : "sap-icon://error",
                            state : sap.ui.core.ValueState.Error
                        });
                        that.errorMessages.push({
                            "type":"Error",
                            "title":that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID")
                        });
                        that.errorState = true;			
                        errorCheck = true;
                    }
                }
            }
            else{
                return;
            }
        }
        if(formData.VALUES_SOURCE === "FIXED"){

            var notNumberErrors = this._areEvaluationValuesNumber(this.getView().getModel().getData());
            if(notNumberErrors.length){
                var msg = "";
                for(i=0; i < notNumberErrors.length; i++){
                    msg = msg + this.oResourceBundle.getText("ENTER_NUMERIC_VALUE_FOR_" + notNumberErrors[i]) + "\n";
                }

                data.errorMsg.push({
                    text : msg,
                    icon : "sap-icon://error",
                    state : sap.ui.core.ValueState.Error
                });
                that.errorMessages.push({
                    "type":"Error",
                    "title":msg
                });
                that.errorState = true;			
                errorCheck = true;
            }
            else{
                var validatedEvalValues = this.validateEvaluationValues(this.getView().getModel().getData());
                if(validatedEvalValues.length){

                    var msg = this.oResourceBundle.getText("ERROR_ENTER_VALID_THRESHOLD_VALUES");
                    var i;
                    for(i=0;i<validatedEvalValues.length;i++){
                        if(validatedEvalValues[i]==="CL"){
                            if(this.getView().getModel().getData().GOAL_TYPE === "RA"){
                                msg = msg+"\n"+this.oResourceBundle.getText("CRITICAL_LOW");
                            }
                            else{
                                msg = msg+"\n"+this.oResourceBundle.getText("CRITICAL");
                            }
                        }
                        if(validatedEvalValues[i]==="WL"){
                            if(this.getView().getModel().getData().GOAL_TYPE === "RA"){
                                msg = msg+"\n"+this.oResourceBundle.getText("WARNING_LOW");
                            }
                            else{
                                msg = msg+"\n"+this.oResourceBundle.getText("WARNING");
                            }
                        }
                        if(validatedEvalValues[i]==="TA"){
                            msg = msg+"\n"+this.oResourceBundle.getText("TARGET");
                        }
                        if(validatedEvalValues[i]==="CH"){
                            if(this.getView().getModel().getData().GOAL_TYPE === "RA"){
                                msg = msg+"\n"+this.oResourceBundle.getText("CRITICAL_HIGH");
                            }
                            else{
                                msg = msg+"\n"+this.oResourceBundle.getText("CRITICAL");
                            }
                        }
                        if(validatedEvalValues[i]==="WH"){
                            if(this.getView().getModel().getData().GOAL_TYPE === "RA"){
                                msg = msg+"\n"+this.oResourceBundle.getText("WARNING_HIGH");
                            }
                            else{
                                msg = msg+"\n"+this.oResourceBundle.getText("WARNING");
                            }
                        }
                    }
                    data.errorMsg.push({
                        text : msg,
                        icon : "sap-icon://error",
                        state : sap.ui.core.ValueState.Error
                    });
                    that.errorMessages.push({
                        "type":"Error",
                        "title":msg
                    });
                    that.errorState = true;			
                    errorCheck = true;
                }
            }
        }
        if(formData.VALUES_SOURCE === "RELATIVE"){
            var thresholdData = this.getView().getModel().getData();
            var patt = /^(?=.*\d)\d*(?:\.\d\d)?$/;
            var msg="";

            if(thresholdData.GOAL_TYPE === "MA"){
                if((thresholdData.WARNINGLOW!="" && thresholdData.WARNINGLOW!=null) && (thresholdData.CRITICALLOW!="" && thresholdData.CRITICALLOW!=null) && parseInt(thresholdData.WARNINGLOW) <= parseInt(thresholdData.CRITICALLOW)){
                    msg += this.oResourceBundle.getText("CRITICAL_SHOULD_BE_LESS_THAN_WARNING");
                }
                if(thresholdData.WARNINGLOW>=100 && (thresholdData.WARNINGLOW !="" && thresholdData.WARNINGLOW!=null)){
                    msg +="\n" +this.oResourceBundle.getText("WARNING_SHOULD_BE_LESS_THAN_100");
                }
                if(thresholdData.CRITICALLOW!="" && (thresholdData.CRITICALLOW>=100 && thresholdData.CRITICALLOW!=null)){
                    msg +="\n" +this.oResourceBundle.getText("CRITICAL_SHOULD_BE_LESS_THAN_100");
                }
                if((thresholdData.WARNINGLOW !="" && thresholdData.WARNINGLOW!=null) && !patt.test(thresholdData.WARNINGLOW)){
                    msg += "\n" +this.oResourceBundle.getText("ENTER_NUMERIC_VALUE_FOR_WARNING");
                }
                if((thresholdData.CRITICALLOW!="" && thresholdData.CRITICALLOW!=null) && !patt.test(thresholdData.CRITICALLOW)){
                    msg += "\n" +this.oResourceBundle.getText("ENTER_NUMERIC_VALUE_FOR_CRITICAL");
                }
            }
            if(thresholdData.GOAL_TYPE === "MI"){
                if((thresholdData.CRITICALHIGH!="" && thresholdData.CRITICALHIGH!=null) && (thresholdData.WARNINGHIGH!="" && thresholdData.WARNINGHIGH!=null) && parseInt(thresholdData.CRITICALHIGH) <= parseInt(thresholdData.WARNINGHIGH)){
                    msg += this.oResourceBundle.getText("CRITICAL_SHOULD_BE_MORE_THAN_WARNING"); 
                }
                if(thresholdData.CRITICALHIGH<=100 && (thresholdData.CRITICALHIGH !="" && thresholdData.CRITICALHIGH!=null)){
                    msg += "\n"+this.oResourceBundle.getText("CRITICAL_SHOULD_BE_MORE_THAN_100");
                }
                if(thresholdData.WARNINGHIGH<=100 && (thresholdData.WARNINGHIGH !="" && thresholdData.WARNINGHIGH!=null)){
                    msg += "\n"+this.oResourceBundle.getText("WARNING_SHOULD_BE_MORE_THAN_100");
                }
                if(thresholdData.CRITICALHIGH!="" && thresholdData.CRITICALHIGH!=null && !patt.test(thresholdData.CRITICALHIGH)){
                    msg += "\n" +this.oResourceBundle.getText("ENTER_NUMERIC_VALUE_FOR_CRITICAL");
                }
                if((thresholdData.WARNINGHIGH!="" && thresholdData.WARNINGHIGH!=null && !patt.test(thresholdData.WARNINGHIGH))){
                    msg += "\n" +this.oResourceBundle.getText("ENTER_NUMERIC_VALUE_FOR_WARNING");
                }
            }
            if(thresholdData.GOAL_TYPE === "RA"){
                if((thresholdData.CRITICALHIGH!="" && thresholdData.CRITICALHIGH!=null) && (thresholdData.CRITICALHIGH!="" && thresholdData.CRITICALHIGH!=null) && parseInt(thresholdData.CRITICALHIGH) <= parseInt(thresholdData.WARNINGHIGH)){
                    msg += this.oResourceBundle.getText("CRITICAL_HIGH_MORE_THAN_WARNING_HIGH");
                }
                if((thresholdData.WARNINGLOW!="" && thresholdData.WARNINGLOW!=null) && (thresholdData.CRITICALLOW!="" && thresholdData.CRITICALLOW!=null) && parseInt(thresholdData.WARNINGLOW) <= parseInt(thresholdData.CRITICALLOW)){
                    msg += "\n"+this.oResourceBundle.getText("WARNING_LOW_MORE_THAN_CRITICAL_LOW");
                }
                if(thresholdData.CRITICALHIGH<=100 && (thresholdData.CRITICALHIGH !="" && thresholdData.CRITICALHIGH!=null)){
                    msg += "\n"+this.oResourceBundle.getText("CRITICAL_HIGH_SHOULD_BE_MORE_THAN_100");
                }
                if(thresholdData.WARNINGHIGH<=100 && (thresholdData.WARNINGHIGH !="" && thresholdData.WARNINGHIGH!=null)){
                    msg += "\n"+this.oResourceBundle.getText("WARNING_HIGH_SHOULD_BE_MORE_THAN_100");
                }
                if(thresholdData.CRITICALLOW>=100 && (thresholdData.CRITICALLOW!="" && thresholdData.CRITICALLOW!=null)){
                    msg += "\n"+this.oResourceBundle.getText("CRITICAL_LOW_SHOULD_BE_LESS_THAN_100");
                }
                if(thresholdData.WARNINGLOW>=100 && (thresholdData.WARNINGLOW !="" && thresholdData.WARNINGLOW!=null)){
                    msg += "\n"+this.oResourceBundle.getText("WARNING_LOW_SHOULD_BE_LESS_THAN_100");
                }
                if((thresholdData.WARNINGLOW !="" && thresholdData.WARNINGLOW!=null) && !patt.test(thresholdData.WARNINGLOW)){
                    msg += "\n" +this.oResourceBundle.getText("ENTER_NUMERIC_VALUE_FOR_WARNING_LOW");
                }
                if((thresholdData.CRITICALLOW!="" && thresholdData.CRITICALLOW!=null) && !patt.test(thresholdData.CRITICALLOW)){
                    msg += "\n" +this.oResourceBundle.getText("ENTER_NUMERIC_VALUE_FOR_CRITICAL_LOW");
                }
                if(thresholdData.CRITICALHIGH!="" && thresholdData.CRITICALHIGH!=null && !patt.test(thresholdData.CRITICALHIGH)){
                    msg += "\n" +this.oResourceBundle.getText("ENTER_NUMERIC_VALUE_FOR_CRITICAL_HIGH");
                }
                if((thresholdData.WARNINGHIGH!="" && thresholdData.WARNINGHIGH!=null && !patt.test(thresholdData.WARNINGHIGH))){
                    msg += "\n" +this.oResourceBundle.getText("ENTER_NUMERIC_VALUE_FOR_WARNING_HIGH");
                }
            }
            if(msg!=""){
                data.errorMsg.push({
                    text : msg,
                    icon : "sap-icon://error",
                    state : sap.ui.core.ValueState.Error
                });
                that.errorMessages.push({
                    "type":"Error",
                    "title":msg
                });
                that.errorState = true;			
                errorCheck = true;
            }
        }


        if(!that.indicatorContext){
            that.indicatorContext = "INDICATORS_MODELER(ID='"+formData.INDICATOR+"',IS_ACTIVE=1)";
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
        if(errorCheck){
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
        //usability improvement - Save appParams without explicit click on "+"
        that.isPropertyAdded = true;
        if(that.getView().byId("propertyName").getValue() || that.getView().byId("propertyValue").getValue()){
            that.addNewProperty();
        }
        if(!that.isPropertyAdded){
            return;
        }

        that.busyDialog.open();
        that.evalParamPayload = {};
        that.evalParamPayload = that.getEvalParamPayload(that.getView().getModel().getData());
        that.saveFilters(that.getView());
        that.saveValues(that.getView());
        that.saveTags(that.getView());
        that.saveProperties(that.getView());
        that.saveAdditionalLanguages(that.getView());
        if(!oEvent){
            oEvent = "create";
        }

        if(formData.mode === "create"){
            that.createBatch = that.createBatchForEvalCreateMode(oEvent);
        }
        else if(formData.mode === "edit"){
            if(that.evalDetails.IS_ACTIVE === 0 && formData.IS_ACTIVE === 0){
                that.createBatchPayload(oEvent);
            }
            else if(that.evalDetails.IS_ACTIVE === 1 && formData.IS_ACTIVE === 0){
                that.getView().getModel().setProperty("/mode","create");
                that.createBatch = that.createBatchForEvalCreateMode(oEvent); 
            }
        }

    },

    saveAndCreateNew : function(oEvent) {
        this.saveAndExit("createNew");
    },
    saveAndActivate : function(){
        var that = this;
        that.checkForActivation("saveActivate");
    },
    activateAndCreateNew : function() {
        this.checkForActivation("activateAndCreateNew")
    },
    checkForActivation : function(param){
        var that = this;
        var errorCheck = false;
        var formData = that.getView().getModel().getData();

        this.errorMessages = [];
        this.errorState = false;

        var data = {
                errorMsg : [] 
        };
        if (!(formData.INDICATOR) || formData.INDICATOR.trim() === "") {
            that.byId("indicatorId").setValueState("Error");
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_SELECT_KPI"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_SELECT_KPI")
            });
            that.errorState = true;			
            errorCheck = true;
        }
        if (!(formData.ID)) {
            that.byId("evalId").setValueState("Error");
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_ID")
            });
            that.errorState = true;			
            errorCheck = true;
        }

        if (!(formData.TITLE) || formData.TITLE.trim() === "") {
            that.byId("evalTitle").setValueState("Error");
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_TITLE"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_EVALUATION_TITLE")
            });
            that.errorState = true;			
            errorCheck = true;
        }

        var error = that.validateDimensionsAndInputParameters();
        if (error.error) {
            if (error.errorType === "mandatoryFieldEmpty") {
                data.errorMsg.push({
                    text : that.oResourceBundle.getText("ERROR_ENTER_ALL_INPUT_PARAMETERS"),
                    icon : "sap-icon://error",
                    state : sap.ui.core.ValueState.Error
                });
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_ENTER_ALL_INPUT_PARAMETERS")
                });
                that.errorState = true;			
                errorCheck = true;
            }
            if (error.errorType === "fieldEmpty") {
                data.errorMsg.push({
                    text : that.oResourceBundle.getText("ERROR_ENTER_ALL_DIMENSION_VALUES"),
                    icon : "sap-icon://error",
                    state : sap.ui.core.ValueState.Error
                });
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_ENTER_ALL_DIMENSION_VALUES")
                });
                that.errorState = true;			
                errorCheck = true;
            }
            if(error.errorType === "invalidEntry"){
                data.errorMsg.push({
                    text : that.oResourceBundle.getText("ERROR_INVALID_TEXT_FOR",error.errorDimension.name),
                    icon : "sap-icon://error",
                    state : sap.ui.core.ValueState.Error
                });                        
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_INVALID_TEXT_FOR",error.errorDimension.name)
                });
                that.errorState = true;			
                errorCheck = true;
            }
        }
        if(formData.ODATA_URL === ""){
            if(this.VIEW_MODE === "hana"){
                that.byId("odataServiceInput").setValueState("Error");
            }
            else{
                that.byId("odataServiceInputCDS").setValueState("Error");
            }

            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_ODATA_URL"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_ODATA_URL")
            });
            that.errorState = true;			
            errorCheck = true;
        }
        if(!formData.ODATA_ENTITYSET || formData.ODATA_ENTITYSET === ""){
            that.byId("entitySetInput").setValueState("Error");
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET")
            });
            that.errorState = true;			
            errorCheck = true;
        }
        if(!formData.COLUMN_NAME || formData.COLUMN_NAME === ""){
            that.byId("valueMeasureInput").setValueState("Error");
            data.errorMsg.push({
                text : that.oResourceBundle.getText("ERROR_ENTER_MEASURE"),
                icon : "sap-icon://error",
                state : sap.ui.core.ValueState.Error
            });
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_MEASURE")
            });
            that.errorState = true;			
            errorCheck = true;
        }

        if(this.inputParameterSapClientCheckBox && this.inputParameterSapClientCheckBox.getSelected()){
            if(this.sessionClientFetchError && this.VIEW_MODE != "cds"){
                data.errorMsg.push({
                    text : that.oResourceBundle.getText("SESSION_CLIENT_FETCH_FAILED"),
                    icon : "sap-icon://error",
                    state : sap.ui.core.ValueState.Error
                });
                that.errorMessages.push({
                    "type" : "Error",
                    "title" : that.oResourceBundle.getText("SESSION_CLIENT_FETCH_FAILED")
                });
                that.errorState = true;			
                errorCheck = true;
            }
        }

        if(that.getView().byId("additionalMeasures").getTokens().length){
            var additionalMeasures = that.getView().byId("additionalMeasures").getTokens();
            for(var i=0,l=additionalMeasures.length; i<l; i++) {
                if(additionalMeasures[i].getText() == formData.COLUMN_NAME) {
                    that.byId("additionalMeasures").setValueState("Error");
                    data.errorMsg.push({
                        text : that.oResourceBundle.getText("ADDI_MEASURE_HAS_MAIN_MEASURE"),
                        icon : "sap-icon://error",
                        state : sap.ui.core.ValueState.Error
                    });
                    that.errorMessages.push({
                        "type":"Error",
                        "title":that.oResourceBundle.getText("ADDI_MEASURE_HAS_MAIN_MEASURE")
                    });
                    that.errorState = true;			
                    errorCheck = true;
                }
            }
        }
        var oTable = new sap.m.Table({
            columns : [new sap.m.Column({
                header : new sap.m.Text({
                    text : that.oResourceBundle.getText("ERRORHEADER")
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
        if(errorCheck){
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

        if(!formData.TARGET  || formData.TARGET == ""){
            var backDialog = new sap.m.Dialog({
                icon:"sap-icon://warning2",
                title:that.oResourceBundle.getText("WARNING"),
                state:"Warning",
                type:"Message",
                content:[new sap.m.Text({text:that.oResourceBundle.getText("ERROR_TARGET_NOT_ENTERED")})],
                beginButton: new sap.m.Button({
                    text:that.oResourceBundle.getText("CONTINUE"),
                    press: function(){
                        backDialog.close();
                        that.saveAndExit(param);
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
            that.saveAndExit(param);
        }
    },
    activateAndAddTiles:function(){
        var that = this;
        that.checkForActivation("activate");
    },
    cancel : function() {
        this.navigateBack();
    },

    deleteDraft:function(){
        var that = this;
        var obj = {};
        obj.ID = that.getView().getModel().getData().ID;
        obj.IS_ACTIVE = that.getView().getModel().getData().IS_ACTIVE;

        var url = "EVALUATION";

        that.metadataRef.remove(url,obj,function(data){
            sap.m.MessageToast.show(that.oResourceBundle.getText("SUCCESS_DELETING_DRAFT"));
            window.location.hash = "FioriApplication-SBWorkspace?sap-system=" + sap.suite.ui.smartbusiness.lib.Util.utils.getHanaSystem() + "&/detail/INDICATORS_MODELER(ID='"+that.getView().getModel().getData().INDICATOR+"',IS_ACTIVE=1)";
        },function(error){
            sap.suite.ui.smartbusiness.lib.Utlib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_DELETING_DRAFT"));
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_DELETING_DRAFT")
            });
            that.errorState = true;
        });

    },
    validateEvalId : function() {
        var that = this;
        var evalIdField = this.getView().byId('evalId');

        var is_active = 0;
        var evalId = evalIdField.getValue();
        if(this.VIEW_MODE == this.CDS){
            evalIdField.setValue(evalId.toUpperCase());
        }

        if (evalId) {
            /* reserved for test data */
            if(evalId.lastIndexOf(this.RESERVED_EVAL_ID_NAMESPACE, 0) === 0) {
                evalIdField.setValueState("Error");
                return false;
            }
            /* CDS evalIds must begin with PERIOD */
            else if(this.VIEW_MODE == this.CDS && evalId[0] != '.') {
                this.evalIdEval_reason = "NOT_START_WITH_PERIOD";
                evalIdField.setValueState("Error");
                return false;
            }
            /* only CDS evalIds must begin with PERIOD */
            else if(this.VIEW_MODE == this.HANA && evalId[0] == '.') {
                this.evalIdEval_reason = "_START_WITH_PERIOD";
                evalIdField.setValueState("Error");
                return false;
            }
            else if (!(/^[a-zA-Z0-9.]*$/.test(evalId)) || evalId.length > this.valid_maxlength[this.VIEW_MODE].id) {
                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID"));
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_ID")
                });
                that.errorState = true;
                evalIdField.setValueState("Error");
                return true;
            } else {
                evalIdField.setValueState("None");

                var evaluationCheckCallBack = function(data) {
                    if(data.length > 0){
                        if (data[0].ID) {
                            evalIdField.setValueState("Error");
                            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_EVAL_WITH_ID_EXISTS",evalId));
                            that.errorMessages.push({
                                "type":"Error",
                                "title":that.oResourceBundle.getText("ERROR_EVAL_WITH_ID_EXISTS",evalId)
                            });
                            that.errorState = true;
                            return true;
                        } else {
                            evalIdField.setValueState("None");
                        }
                    }
                    else{
                        evalIdField.setValueState("None");
                    }
                };

                var evaluationCheckErrCallBack = function() {
                    evalIdField.setValueState("None");
                };
                this.metadataRef.getDataByEntity({entity:"EVALUATIONS", filter:"ID eq '" + evalId + "'", async:false, success:evaluationCheckCallBack, error:evaluationCheckErrCallBack, model:this.oDataModel});
            }
        }
        return false;
    },

    validateEvalTitle: function() {
        var evalTitleField = this.getView().byId('evalTitle');
        var evalTitle = evalTitleField.getValue();
        if(!evalTitle) {
            evalTitleField.setValueState("Error");
            return false;
        }

        if (evalTitle.length > this.valid_maxlength[this.VIEW_MODE].title) {
            evalTitleField.setValueState("Error");
            return false
        } else {
            evalTitleField.setValueState("None");
            return true;
        }
    },

    validateEmailAddress : function() {
        var that = this;
        var evalOwnerEmailField = this.getView().byId('evalOwnerEmail');
        var evalOwnerEmailValue = evalOwnerEmailField.getValue();
        if (evalOwnerEmailValue) {
            if (!(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]/.test(evalOwnerEmailValue))) {
                evalOwnerEmailField.setValueState("Error");
                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_E_MAIL"));
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_ENTER_VALID_EVAL_E_MAIL")
                });
                that.errorState = true;
            } else {
                evalOwnerEmailField.setValueState("None");
            }
        } else {
            evalOwnerEmailField.setValueState("None");
        }
    },

    /// Adapter Implementation Fail ---->>> SelectDialog does not liveChange for json model
    listAllKpis : function() {
        var that = this;
        var hanaViewValueHelpDialog = new sap.m.SelectDialog({
            title : that.oResourceBundle.getText("SELECT_KPI"),
            noDataText : that.oResourceBundle.getText("NO_DATA_FOUND"),
            items : {
                path : "/INDICATORS_MODELER",
                template : new sap.m.ObjectListItem({
                    title : "{TITLE}",
                    number : "{EVALUATION_COUNT}",
                    firstStatus : new sap.m.ObjectStatus({
                        text : "Evaluations",
                    }),
                    attributes : [new sap.m.ObjectAttribute({
                        text : "{ID}",
                        visible : "{SB_APP_SETTING>/ID_VISIBLE}"
                    })]

                })
            },
            confirm : function(oEvent) {
                that.busyDialog.open(); 
                that.indicatorContext = "INDICATORS_MODELER(ID='"+oEvent.getParameter("selectedItem").getBindingContext().getProperty("ID")+"',IS_ACTIVE=1)"
                that.getKpiDetails();

            },
            liveChange : function(oEvent) {
                var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
                var oFilterById = new sap.ui.model.Filter("tolower(ID)", sap.ui.model.FilterOperator.Contains,
                        searchValue);
                var oFilterByTitle = new sap.ui.model.Filter("tolower(TITLE)", sap.ui.model.FilterOperator.Contains,
                        searchValue);
                var oFilterISActive = new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ,1);
                var oBinding = oEvent.getSource().getBinding("items");
                var firstFilters = new sap.ui.model.Filter([oFilterById,oFilterByTitle], false);
                var secondFilters = new sap.ui.model.Filter([oFilterISActive], true);
                oBinding.filter(new sap.ui.model.Filter([firstFilters, secondFilters], true));
            }
        });
        hanaViewValueHelpDialog.setModel(that.oDataModel);
        var filters = [];
        filters.push(new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 1));
        hanaViewValueHelpDialog.getBinding("items").filter(new sap.ui.model.Filter(filters,true));
        hanaViewValueHelpDialog.open();
    },

    /// Adapter Implementation Fail ---->>> SelectDialog does not liveChange for json model
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
                that.getView().getModel().setProperty("/ODATA_URL","");
                that.getView().getModel().setProperty("/ODATA_ENTITYSET","");
                that.getView().getModel().setProperty("/COLUMN_NAME","");
                var viewFieldId = that.VIEW_MODE == that.CDS ? "viewInputCDS" : "viewInput";
                that.getView().byId(viewFieldId).setValueState("None");
                var odataFieldId = that.VIEW_MODE == that.CDS ? "odataServiceInputCDS" : "odataServiceInput";
                that.getView().byId(odataFieldId).setValueState("None");
                that.getView().byId("entitySetInput").setValueState("None");
                that.getView().byId("valueMeasureInput").setValueState("None");

                that.currentSelectedHanaViewObject = oEvent.getParameter("selectedItem").getBindingContext().getObject();
                that.byId('viewInput').fireChange();
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
        hanaViewValueHelpDialog.setModel(this.oDataModel);
        hanaViewValueHelpDialog.open();
    },
    /* pick @CDS view*/
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
                that.getView().getModel().setProperty("/ODATA_URL","");
                that.getView().getModel().setProperty("/ODATA_ENTITYSET","");
                that.getView().getModel().setProperty("/COLUMN_NAME","");
                var viewFieldId = that.VIEW_MODE == that.CDS ? "viewInputCDS" : "viewInput";
                that.getView().byId(viewFieldId).setValueState("None");
                var odataFieldId = that.VIEW_MODE == that.CDS ? "odataServiceInputCDS" : "odataServiceInput";
                that.getView().byId(odataFieldId).setValueState("None");
                that.getView().byId("entitySetInput").setValueState("None");
                that.getView().byId("valueMeasureInput").setValueState("None");

                that.resetAdditionalMeasures();
                that.currentSelectedHanaViewObject = oEvent.getParameter("selectedItem").getBindingContext().getObject();
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
    hanaViewChange : function(value){
        var that = this;
        that.getView().getModel().setProperty("/ODATA_URL","");
        that.getView().getModel().setProperty("/ODATA_ENTITYSET","");
        that.getView().getModel().setProperty("/COLUMN_NAME","");
        var viewFieldId = this.VIEW_MODE == this.CDS ? "viewInputCDS" : "viewInput";
        if(!(value.getSource().getValue() === "")){
            that.getView().byId(viewFieldId).setValueState("None");
        }
        var odataFieldId = this.VIEW_MODE == this.CDS ? "odataServiceInputCDS" : "odataServiceInput";
        that.getView().byId(odataFieldId).setValueState("None");
        that.getView().byId("entitySetInput").setValueState("None");
        that.getView().byId("valueMeasureInput").setValueState("None");
        that.resetAdditionalMeasures();
        that.resetDimensionsAndInputParameters();
    },


    /// Adapter Implementation Fail ---->>> SelectDialog does not liveChange for json model
    handleOdataServiceValueHelp:function(){
        var that = this;
        if(!that.byId("viewInput").getValue()){
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_A_HANA_VIEW"));
            that.getView().byId("viewInput").setValueState("Error");
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_A_HANA_VIEW")
            });
            that.errorState = true;
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
                    that.getView().getModel().setProperty("/ODATA_ENTITYSET","");
                    that.getView().getModel().setProperty("/COLUMN_NAME","");
                    var odataFieldId = that.VIEW_MODE == that.CDS ? "odataServiceInputCDS" : "odataServiceInput";
                    that.getView().byId(odataFieldId).setValueState("None");
                    that.getView().byId("entitySetInput").setValueState("None");
                    that.getView().byId("valueMeasureInput").setValueState("None");

                    that.resetAdditionalMeasures();
                    that.currentSelectedODataUrlObject = oEvent.getParameter("selectedItem").getBindingContext().getObject();
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

    /* pick @CDS odata */
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
                var odataFieldId = that.VIEW_MODE == that.CDS ? "odataServiceInputCDS" : "odataServiceInput";
                that.getView().byId(odataFieldId).setValueState("None");
                that.getView().byId("entitySetInput").setValueState("None");
                that.getView().byId("valueMeasureInput").setValueState("None");

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

    oDataUrlChange : function(value){
        var that = this;
        that.getView().getModel().setProperty("/ODATA_ENTITYSET","");
        that.getView().getModel().setProperty("/COLUMN_NAME","");
        var odataFieldId = this.VIEW_MODE == this.CDS ? "odataServiceInputCDS" : "odataServiceInput";
        if(!(value.getSource().getValue() === "")){
            that.getView().byId(odataFieldId).setValueState("None");
        }
        that.getView().byId("entitySetInput").setValueState("None");
        that.getView().byId("valueMeasureInput").setValueState("None");
        that.resetAdditionalMeasures();
        that.resetDimensionsAndInputParameters();
    },

    handleEntitySetValueHelp : function(){
        var that = this;
        var odataFieldId = this.VIEW_MODE == this.CDS ? "odataServiceInputCDS" : "odataServiceInput";
        if(!that.byId(odataFieldId).getValue()){
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ODATA_URL"));
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_ODATA_URL")
            });
            that.errorState = true;
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
                    that.resetDimensionsAndInputParameters();
                    that.getView().byId("entitySetInput").setValueState("None");					
                    that.resetAdditionalMeasures();
                    try {
                        that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
                    }
                    catch(e) {
                        sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
                        that.errorMessages.push({
                            "type":"Error",
                            "title":that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"),
                            "description" : that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS")
                        });
                        that.errorState = true;
                        that.resetDimensionsAndInputParameters();
                    }

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
                    that.resetDimensionsAndInputParameters();
                    that.resetAdditionalMeasures();
                    try {
                        that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
                    }
                    catch(e) {
                        sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
                        that.errorMessages.push({
                            "type":"Error",
                            "title":that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"),
                            "description" : that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS")
                        });
                        that.errorState = true;
                        that.resetDimensionsAndInputParameters();
                    }

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
    entitySetChange : function(value){
        var that = this;
        that.resetAdditionalMeasures();
        if(that.getView().getModel().getProperty("/ODATA_URL") && that.getView().getModel().getProperty("/ODATA_ENTITYSET")) {

            try {
                that.populateDimensionsAndInputParameters(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
                that.getView().byId("entitySetInput").setValueState("None");
            }
            catch(e) {
                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"), that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS"));
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"),
                    "description" : that.oResourceBundle.getText("ERROR_ODATA_ANALYTICS")
                });
                that.errorState = true;
                that.resetDimensionsAndInputParameters();
            }
        }
        else {
            that.resetDimensionsAndInputParameters();
            that.getView().byId("entitySetInput").setValueState("None");
            that.getView().getModel().setProperty("/COLUMN_NAME","");
        }

    },
    handleMeasureValueHelp : function(){
        var that = this;
        var that = this;
        if(!that.byId("entitySetInput").getValue()){
            that.byId("entitySetInput").setValueState("Error");
            that.byId("valueMeasureInput").setValueState("None");
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET"));
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET")
            });
            that.errorState = true;
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
                        }
                    ,
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
                    that.getView().byId("valueMeasureInput").setValueState("None");
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

    measureChange : function(value){
        var that = this;
        if(!that.byId("entitySetInput").getValue()){
            that.byId("entitySetInput").setValueState("Error");
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET"));
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_ENTITY_SET")
            });
            that.errorState = true;
        }
        else{
            try {
                that.oModelForMeasure = that.populateMeasure(that.getView().getModel().getProperty("/ODATA_URL"), that
                        .getView().getModel().getProperty("/ODATA_ENTITYSET"));
                that.getView().byId("valueMeasureInput").setValueState("None");

            } catch (err) {

            }
        }
    },

    validateSemantic : function(oEvent) {
        var that = this;
        if( oEvent.getParameter("value").indexOf(' ') === -1 ){
            this.byId(oEvent.getParameter("id")).setValueState("None");
        }
        else{
            this.byId(oEvent.getParameter("id")).setValueState("Error");
        }


    },

    handleChangeAdditionalInfo : function(oEvent) {
        var that = this;
        that.getView().getModel().setProperty("info", that.getView().byId("additionalInfoId"));

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
    //Odata For Analytics
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

    additionalInformationForKpi : function(evt) {
        var that = this;
        that.dialogAdditionalInfo = new sap.m.Dialog({
            type : "Message",
            title : that.oResourceBundle.getText("ADDITIONAL_INFO_FROM_KPI"),
            content : [new sap.m.Label({text:{path:'/DATA_SPECIFICATION', formatter:function(value){
                if(that.getView().getModel().getData().DATA_SPECIFICATION){
                    return that.getView().getModel().getData().DATA_SPECIFICATION;
                }
                else{
                    return that.oResourceBundle.getText("ERROR_NO_DATA_TO_DISPLAY");
                }
            }}})],//.setText(oController.getView().getModel().getData().DATA_SPECIFICATION)],
            beginButton : new sap.m.Button({
                text : that.oResourceBundle.getText("CLOSE"),
                press : function(oEvent) {
                    oEvent.getSource().getParent().close();
                }
            })
        });
        that.dialogAdditionalInfo.setModel(that.getView().getModel());
        that.dialogAdditionalInfo.open();
    },


    openDecimalInfo: function(oEvent){
        var that=this;
        var oCustomHeader = new sap.m.Bar({
            width:"100%",
            contentMiddle:
                [new sap.m.Label({
                    text:that.oResourceBundle.getText("DECIMAL_PRECISION")
                })],
                contentRight :
                    [new sap.m.Button({
                        icon:"sap-icon://decline",
                        press : function() {
                            infoPopOver.close();
                        }
                    })]
        });

        var infoPopOver = new sap.m.ResponsivePopover({

            showHeader:true,
            customHeader:oCustomHeader,
            contentWidth: "15%",
            contentHeight : "20%",
            verticalScrolling : true,
            horizontalScrolling : false,
            placement: sap.m.PlacementType.Right,
            content:[
                     new sap.m.Text({
                         width:"100%",
                         textAlign: "Left",
                         text:that.oResourceBundle.getText("INFO_TEXT_DECIMAL_PRECISION")

                     }).addStyleClass("evaluationThresholdInfoHeader")
                     ]
        });
        infoPopOver.openBy(oEvent.getSource());

    },


    addNewProperty : function() {
        var that = this;
        if (this.getView().byId("propertyName").getValue()) {
            this.getView().byId("propertyName").setValueState("None");
            if (this.getView().byId("propertyValue").getValue()) {
                this.getView().byId("propertyValue").setValueState("None");
                var propertyModel = this.getView().byId('propertyNameValueBox').getModel();
                propertyModel.getData().PROPERTIES = propertyModel.getData().PROPERTIES || [];
                for(var i=0; i<propertyModel.getData().PROPERTIES.length;i++){
                    if((propertyModel.getData().PROPERTIES[i].NAME === this.getView().byId("propertyName").getValue()) && (propertyModel.getData().PROPERTIES[i].VALUE === this.getView().byId("propertyValue").getValue())){
                        sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(this.oResourceBundle.getText("ERROR_PROPERTY_VALUE_PAIR_EXISTS"));
                        that.errorMessages.push({
                            "type":"Error",
                            "title":that.oResourceBundle.getText("ERROR_PROPERTY_VALUE_PAIR_EXISTS")
                        });
                        that.errorState = true;
                    }
                }

                propertyModel.getData().PROPERTIES.push({
                    NAME : this.getView().byId("propertyName").getValue(),
                    VALUE : this.getView().byId("propertyValue").getValue()
                });
                propertyModel.updateBindings();
                this.getView().byId("propertyName").setValue("");
                this.getView().byId("propertyValue").setValue("");
            } else {
                that.isPropertyAdded = false;
                this.getView().byId("propertyValue").setValueState("Error");
                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_PROPERTY_VALUE"));
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_ENTER_PROPERTY_VALUE")
                });
                that.errorState = true;
            }
        } else {
            that.isPropertyAdded = false;
            this.getView().byId("propertyName").setValueState("Error");
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_PROPERTY_NAME"));
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_PROPERTY_NAME")
            });
            that.errorState = true;
        }
    },

    removeProperty : function(evt) {
        var path = evt.getSource().getBindingContext().getPath();
        evt.getSource().getBindingContext().getModel().getData().PROPERTIES.splice(path.substring(path
                .lastIndexOf("/") + 1), 1);
        evt.getSource().getBindingContext().getModel().updateBindings();
    },

    _appendSystemAlias : function(uri, sysAlias) {
        if(sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
            var urlParsingService = sap.ushell.Container.getService("URLParsing");
            if(urlParsingService) {
                uri = urlParsingService.addSystemToServiceUrl(uri, sysAlias);
            }
        }
        return uri;
    },

    populateDimensionsAndInputParameters : function(dataSource, entitySet) {
        var that = this;
        dataSource = this._appendSystemAlias(dataSource);
        var dimensions = [];
        var inputParameters = [];
        var mandatoryFilters = [];
        var mandatoryFilterNames = [];
        this.oData4SAPAnalyticsModel = new sap.ui.model.analytics.odata4analytics.Model(new sap.ui.model.analytics.odata4analytics.Model.ReferenceByURI(dataSource), null);
        this.queryResultObj = this.oData4SAPAnalyticsModel.findQueryResultByName(entitySet);
        this.queryResultFilters = sap.suite.ui.smartbusiness.lib.OData.filter(dataSource,entitySet);
        var queryResultObjDimensions = this.queryResultFilters.getAsObject();

        for (key in queryResultObjDimensions) {
            var name = queryResultObjDimensions[key].getName();
            var propertyType = queryResultObjDimensions[key].getKeyProperty().type;
            var extensions = queryResultObjDimensions[key].getKeyProperty().extensions;
            var requiredProperty = false;
            var filterRestriction = null;
            var mandatoryFiltersPresent = this.queryResultFilters.getMandatoryList().length;
            for(var i=0;i<extensions.length;i++){
                if(extensions[i].name == "required-in-filter" && extensions[i].value == "true"){
                    requiredProperty = true;
                }
                if(extensions[i].name == "filter-restriction"){
                    filterRestriction = extensions[i].value;
                }
            }
            var newObj = {
                    name : name,
                    propertyType : propertyType,
                    required : requiredProperty,
                    filterRestriction : filterRestriction
            };
            dimensions.push(newObj);
        }
        var data = this.oModelForDimensions.getData();
        data.dimensions = dimensions;
        data.dimensions.sort();
        data.dataSource = dataSource;
        data.entitySet = entitySet;

        if(data.selectedDimensions){
            for(var key in data.selectedDimensions){
                data.selectedDimensions[key].propertyType = this.queryResultObj.findDimensionByName(data.selectedDimensions[key].name)?this.queryResultObj.findDimensionByName(data.selectedDimensions[key].name).getKeyProperty().type:"";  
                if(data.selectedDimensions[key].propertyType == "Edm.DateTime"){    
                    var valueArray = data.selectedDimensions[key].value_1.split(",");
                    for( i in valueArray){      
                        if( valueArray[i] != ""){
                            var dateObj = new Date(valueArray[i]);
                            var month = dateObj.getMonth()+1;
                            month = /^\d$/.test(month) ? "0"+ month : month;
                            var date = dateObj.getDate();
                            date = /^\d$/.test(date) ? "0"+ date : date;
                            var hours = dateObj.getHours();
                            hours = /^\d$/.test(hours) ? "0"+ hours : hours;
                            var minutes = dateObj.getMinutes();
                            minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
                            var seconds = dateObj.getSeconds();
                            seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
                            valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
                        }
                    }
                    data.selectedDimensions[key].value_1 = valueArray.join(",");
                    valueArray = null;
                    valueArray = data.selectedDimensions[key].value_2.split(",");
                    for(var i in valueArray){
                        if(valueArray[i] != ""){
                            var dateObj = new Date(data.selectedDimensions[key].value_2);
                            var month = dateObj.getMonth()+1;
                            month = /^\d$/.test(month) ? "0"+ month : month;
                            var date = dateObj.getDate();
                            date = /^\d$/.test(date) ? "0"+ date : date;
                            var hours = dateObj.getHours();
                            hours = /^\d$/.test(hours) ? "0"+ hours : hours;
                            var minutes = dateObj.getMinutes();
                            minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
                            var seconds = dateObj.getSeconds();
                            seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
                            valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
                        }
                    }
                    data.selectedDimensions[key].value_2 = valueArray.join(",");
                    this.dimensionValue[data.selectedDimensions[key].name] = this.dimensionValue[data.selectedDimensions[key].name] ? this.dimensionValue[data.selectedDimensions[key].name] : {};
                    this.dimensionValue[data.selectedDimensions[key].name]["value_1"] = data.selectedDimensions[key].value_1;
                    this.dimensionValue[data.selectedDimensions[key].name]["value_2"] = data.selectedDimensions[key].value_2;                                      
                }
            }
        }
        else{
            if(mandatoryFiltersPresent){
                data.selectedDimensions = [];
                for(var i=0;i<data.dimensions.length;i++){
                    if(data.dimensions[i].required==true){
                        var dimensionObject = this._cloneObj(data.dimensions[i]);
                        dimensionObject.value_1 = "";
                        dimensionObject.value_2 = "";
                        if(data.dimensions[i].filterRestriction == "interval") {
                            dimensionObject.operator = "BT";
                        }
                        else if(data.dimensions[i].filterRestriction == "single-value") {
                            dimensionObject.operator = "EQ";
                        }
                        else {
                            dimensionObject.operator = "EQ";
                        }
                        data.selectedDimensions.push(dimensionObject);
                    }
                }
            }
        }

        if(mandatoryFiltersPresent){
            this.byId("mandatoryFiltersDataGrid").setVisible(true);
            if(that.VIEW_MODE != "cds"){
                var sapClientMandFilters;
                for(key in data.selectedDimensions){
                    if((that.sessionClientXsjsMissing !== true) && (data.selectedDimensions[key].name === "P_SAPClient" || data.selectedDimensions[key].name === "V_SAPClient" || data.selectedDimensions[key].name === "SAPClient") && data.selectedDimensions[key].required){
                        sapClientMandFilters = data.selectedDimensions.splice(key,1);
                        if(this.getView().getModel().getData().mode === "create" && (!this.evalDetails || this.evalDetails.IS_ACTIVE === 0)){
                            sapClientMandFilters[0].value_1 = "$$$";
                            that.hasSapClient = true;
                        }
                        data.selectedDimensions.push(sapClientMandFilters[0]);
                        break;
                    }
                }
            }
        }
        else{
            this.byId("mandatoryFiltersDataGrid").setVisible(false);
        }
        this.oModelForDimensions.setData(data);

        //inputParameters
        var inputParametersObj = this.queryResultObj.getParameterization();
        if (inputParametersObj)
        {                              
            if(this.oModelForInputParameters.getData().inputParameters)
            {   
                var inputParameters = this.oModelForInputParameters.getData().inputParameters;
                for(var key in inputParameters)
                {
                    inputParameters[key].propertyType = inputParametersObj.findParameterByName(inputParameters[key].name).getProperty().type;
                    if(inputParameters[key].propertyType == "Edm.DateTime")
                    {
                        var valueArray = inputParameters[key].value_1.split(",");
                        for( i in valueArray)
                        {        
                            if( valueArray[i] != "")
                            {
                                var dateObj = new Date(valueArray[i]);
                                var month = dateObj.getMonth()+1;
                                month = /^\d$/.test(month) ? "0"+ month : month;
                                var date = dateObj.getDate();
                                date = /^\d$/.test(date) ? "0"+ date : date;
                                var hours = dateObj.getHours();
                                hours = /^\d$/.test(hours) ? "0"+ hours : hours;
                                var minutes = dateObj.getMinutes();
                                minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
                                var seconds = dateObj.getSeconds();
                                seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
                                valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
                            }
                        }
                        inputParameters[key].value_1 = valueArray.join(",");
                        valueArray = null;
                        valueArray = inputParameters[key].value_2.split(",");
                        for(var i in valueArray)
                        {
                            if(valueArray[i] != "")
                            {
                                var dateObj = new Date(data.selectedDimensions[key].value_2);
                                var month = dateObj.getMonth()+1;
                                month = /^\d$/.test(month) ? "0"+ month : month;
                                var date = dateObj.getDate();
                                date = /^\d$/.test(date) ? "0"+ date : date;
                                var hours = dateObj.getHours();
                                hours = /^\d$/.test(hours) ? "0"+ hours : hours;
                                var minutes = dateObj.getMinutes();
                                minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
                                var seconds = dateObj.getSeconds();
                                seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
                                valueArray[i] = dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds();
                            }
                        }
                        inputParameters[key].value_2 = valueArray.join(",");
                    }
                }                                       
            }
            else
            {   
                var inputParametersNames = inputParametersObj.getAllParameters();
                for ( var key in inputParametersNames) {
                    var name = inputParametersNames[key].getName();
                    var propertyType = inputParametersNames[key].getProperty().type;
                    var optional = inputParametersNames[key].isOptional();
                    var newObj = {
                            name : name,
                            propertyType : propertyType,
                            operator : "EQ",
                            value_1 : "",
                            value_2 : ""
                    };
                    inputParameters.push(newObj);
                }
            }
            if (inputParameters.length > 0){
                this.byId("noInputParameterGrid").setVisible(false);
                this.byId("inputParameterDataGrid").setVisible(true);
            }
            else{
                this.byId("noInputParameterGrid").setVisible(true);
                this.byId("inputParameterDataGrid").setVisible(false);
            }
            data = this.oModelForInputParameters.getData();
            data.inputParameters = inputParameters;
            var sapClient;
            if(data.inputParameters.length>0){
                if(that.VIEW_MODE != "cds"){
                    for(key in data.inputParameters){
                        if((that.sessionClientXsjsMissing !== true) && data.inputParameters[key].name === "P_SAPClient" || data.inputParameters[key].name === "V_SAPClient" || data.inputParameters[key].name === "SAPClient"){
                            //that.hasSapClient = true;
                            sapClient = data.inputParameters.splice(key,1);
                            if(this.getView().getModel().getData().mode === "create" && (!this.evalDetails || this.evalDetails.IS_ACTIVE === 0)){
                                sapClient[0].value_1 = "$$$";
                            }
                            data.inputParameters.push(sapClient[0]);

                            break;
                        }
                    }
                }
            }
            this.oModelForInputParameters.setData(data);
        }              
    },

    setInputParameterAndFilterLayout : function() {
        var that = this;
        this.dimensionValueHelpDialogs = {};
        this.dimensionValue = {};

        this.byId("noInputParameterGrid").setVisible(true);
        this.byId("inputParameterDataGrid").setVisible(false);
        this.byId("mandatoryFiltersDataGrid").setVisible(false);

        this.byId("inputParameterBaseLayout").setModel(this.oModelForInputParameters);

        //inputParameter Layout
        this.byId("inputParameterBaseLayout").bindAggregation("items", "/inputParameters", function(sId, oContext) {
            that.inputParameterOperator = new sap.m.Select({
                width : "100%",
                customData : [{
                    key : "valueType",
                    value : "value_1"
                }],
                items : [new sap.ui.core.Item({
                    text : that.oResourceBundle.getText("EQUAL_TO"),
                    key : "EQ"
                })],
                selectedKey : "{operator}",
                layoutData : new sap.ui.layout.GridData({
                    span : "L3 M3"
                })
            });
            that.inputParameterValue = new sap.m.Input({
                value : "{value_1}",
                customData : [{
                    key : "valueType",
                    value : "value_1"
                }],
                //showValueHelp : true,
                valueHelpRequest : jQuery.proxy(that.openInputParameterValueHelpDialog,that),
                change : jQuery.proxy(that.handleDimensionValueChange, that),
                valueState : {
                    path : "error_1",
                    formatter : function(error) {
                        if (error)
                            return "Error";
                        else
                            return "None";
                    }
                },
                layoutData : new sap.ui.layout.GridData({
                    span : "L3 M3"
                })
            });
            if((that.VIEW_MODE != "cds") && (oContext.getProperty().name === "P_SAPClient" || oContext.getProperty().name === "V_SAPClient" || oContext.getProperty().name === "SAPClient") && (that.sessionClientXsjsMissing !== true)){
                that.inputParameterSapClientCheckBox = new sap.m.CheckBox({
                    text : that.oResourceBundle.getText("PICK_FROM_HANA_SESSION_CLIENT"),
                    selected : {
                        path:"value_1",
                        formatter: function(value){
                            if(value === "$$$"){
                                return true;
                            }
                            else{
                                return false;
                            }
                        }
                    },
                    select : function(){
                        var len = this.getModel().getData().inputParameters.length;
                        if(this.getSelected()===true){ //When Checked
                            if(that.sessionClientFetchError){
                                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("SESSION_CLIENT_FETCH_FAILED"));
                            }
                            that.inputParameterValue.setVisible(false);
                            this.getModel().getData().inputParameters[len-1].value_1 = "$$$";
                        }
                        else{ //When Unchecked
                            that.inputParameterValue.setVisible(true);
                            if(this.getModel().getData().inputParameters[len-1].value_1 === "$$$"){
                                that.inputParameterValue.setValue("");
                            }
                        }
                    },
                    layoutData : new sap.ui.layout.GridData({
                        span : "L3 M3"
                    })
                });
                that.inputParameterOperator = that.inputParameterSapClientCheckBox;
                if(that.getView().getModel().getData().mode === "create"){
                    that.inputParameterValue.setVisible(false);
                }
            }
            that.inputParameterGrid = new sap.ui.layout.Grid({
                defaultSpan : "L9 M9",
                content : [new sap.m.Input({
                    value : "{name}",
                    width : "100%",
                    textAlign : sap.ui.core.TextAlign.End,
                    editable:false,
                    layoutData : new sap.ui.layout.GridData({
                        span : "L3 M3"
                    })
                }), that.inputParameterOperator, that.inputParameterValue]
            });
            return that.inputParameterGrid;
        });


        this.byId("mandatoryFilterBaseLayout").setModel(this.oModelForDimensions);

        //mandatory Filters Layout
        this.byId("mandatoryFilterBaseLayout").bindAggregation("items", "/selectedDimensions", function(sId, oContext) {
            that.mandatoryFilterOperator = new sap.m.Select({
                width : "100%",
                customData : [{
                    key : "valueType",
                    value : "value_1"
                }],
                items : [new sap.ui.core.Item({
                    text : (oContext.getObject().filterRestriction != "interval") ? that.oResourceBundle.getText("EQUAL_TO") : that.oResourceBundle.getText("BETWEEN"),
                            key : (oContext.getObject().filterRestriction != "interval") ? "EQ" : "BT"	
                })],
                selectedKey : "{operator}",
                layoutData : new sap.ui.layout.GridData({
                    span : "L3 M3"
                })
            });
            that.mandatoryFilterValue = new sap.m.Input({
                value : "{value_1}",
                customData : [{
                    key : "valueType",
                    value : "value_1"
                }],
                //showValueHelp : true,
                valueHelpRequest : jQuery.proxy(that.openInputParameterValueHelpDialog,that),
                change : jQuery.proxy(that.handleDimensionValueChange, that),
                valueState : {
                    path : "error_1",
                    formatter : function(error) {
                        if (error)
                            return "Error";
                        else
                            return "None";
                    }
                },
                layoutData : new sap.ui.layout.GridData({
                    span : "L3 M3"
                })
            });
            that.mandatoryFilterValueTo = new sap.m.Input({
                value : "{value_2}",
                visible : (oContext.getObject().filterRestriction != "interval") ? false : true,
                        customData : [{
                            key : "valueType",
                            value : "value_2"
                        }],
                        //showValueHelp : true,
                        valueHelpRequest : jQuery.proxy(that.openInputParameterValueHelpDialog,that),
                        change : jQuery.proxy(that.handleDimensionValueChange, that),
                        valueState : {
                            path : "error_1",
                            formatter : function(error) {
                                if (error)
                                    return "Error";
                                else
                                    return "None";
                            }
                        },
                        layoutData : new sap.ui.layout.GridData({
                            span : "L3 M3"
                        })
            });
            if((that.VIEW_MODE != "cds") && (oContext.getProperty().name === "P_SAPClient" || oContext.getProperty().name === "V_SAPClient" || oContext.getProperty().name === "SAPClient") && (that.sessionClientXsjsMissing !== true)){
                that.mandatoryFilterSapClientCheckBox = new sap.m.CheckBox({
                    text : that.oResourceBundle.getText("PICK_FROM_HANA_SESSION_CLIENT"),
                    selected : {
                        path:"value_1",
                        formatter: function(value){
                            if(value === "$$$"){
                                return true;
                            }
                            else{
                                return false;
                            }
                        }
                    },
                    select : function(){
                        var len = this.getModel().getData().selectedDimensions.length;
                        if(this.getSelected()===true){ //When Checked
                            that.mandatoryFilterValue.setVisible(false);
                            this.getModel().getData().selectedDimensions[len-1].value_1 = "$$$"; 
                        }
                        else{ //When Unchecked
                            that.mandatoryFilterValue.setVisible(true);
                            if(this.getModel().getData().selectedDimensions[len-1].value_1 === "$$$"){
                                that.mandatoryFilterValue.setValue("");
                            }
                        }
                    },
                    layoutData : new sap.ui.layout.GridData({
                        span : "L3 M3"
                    })
                });
                that.mandatoryFilterOperator = that.mandatoryFilterSapClientCheckBox;
                if(that.getView().getModel().getData().mode === "create"){
                    that.mandatoryFilterValue.setVisible(false);
                }
            }
            that.mandatoryFilterGrid = new sap.ui.layout.Grid({
                defaultSpan : "L9 M9",
                content : [new sap.m.Input({
                    value : "{name}",
                    width : "100%",
                    textAlign : sap.ui.core.TextAlign.End,
                    editable:false,
                    layoutData : new sap.ui.layout.GridData({
                        span : "L3 M3"
                    })
                }), that.mandatoryFilterOperator, that.mandatoryFilterValue, that.mandatoryFilterValueTo]
            });
            return that.mandatoryFilterGrid;
        });

        var aFilterMandatory = new sap.ui.model.Filter("required",sap.ui.model.FilterOperator.EQ,true);
        this.byId("mandatoryFilterBaseLayout").getBinding("items").filter(aFilterMandatory);

        //Dimensions Layout
        this.byId("dimensionLayoutHeaders").setVisible(false);
        this.byId("baseDimensionLayout").setModel(this.oModelForDimensions);
        this.byId("baseDimensionLayout").bindAggregation("items", "/selectedDimensions", function(sId, oContext) {
            var dimensionOperator = new sap.m.Select({
                width : "100%",
                customData : [{
                    key : "valueType",
                    value : "value_1"
                }],
                items: that.formatOptionalFiltersOperators(oContext),
                /*items : [new sap.ui.core.Item({
                    text : that.oResourceBundle.getText("EQUAL_TO"),
                    key : "EQ"
                }), new sap.ui.core.Item({
                    text : that.oResourceBundle.getText("GREATER_THAN"),
                    key : "GT"
                }), new sap.ui.core.Item({
                    text : that.oResourceBundle.getText("LESS_THAN"),
                    key : "LT"
                }), new sap.ui.core.Item({
                    text : that.oResourceBundle.getText("NOT_EQUAL_TO"),
                    key : "NE"
                }), new sap.ui.core.Item({
                    text : that.oResourceBundle.getText("BETWEEN"),
                    key : "BT"
                })],*/
                selectedKey : "{operator}",
                change : jQuery.proxy(that.handleOperatorChange, that),
                layoutData : new sap.ui.layout.GridData({
                    span : "L3 M3"
                })
            });
            var dimensionValue = new sap.m.Input({
                value : "{value_1}",
                customData : [{
                    key : "valueType",
                    value : "value_1"
                }],
                showValueHelp : true,
                valueState : {
                    path : "error_1",
                    formatter : function(error) {
                        if (error)
                            return "Error";
                        else
                            return "None";
                    }
                },
                valueHelpRequest : jQuery.proxy(that.handleDimensionValueHelp, that),
                change : jQuery.proxy(that.handleDimensionValueChange, that),
                layoutData : new sap.ui.layout.GridData({
                    span : "L3 M3"
                })
            });
            var dimensionValueTo = new sap.m.Input({
                value : "{value_2}",
                customData : [{
                    key : "valueType",
                    value : "value_2"
                }],
                showValueHelp : true,
                visible : {
                    path : "operator",
                    formatter : function(operator) {
                        return (operator === "BT") ? true : false;
                    }
                },
                valueState : {
                    path : "error_2",
                    formatter : function(error) {
                        if (error)
                            return "Error";
                        else
                            return "None";
                    }
                },
                valueHelpRequest : jQuery.proxy(that.handleDimensionValueToHelp, that),
                change : jQuery.proxy(that.handleDimensionValueChange, that),
                layoutData : new sap.ui.layout.GridData({
                    span : "L3 M3"
                })
            });
            var dimensionValueToLabel = new sap.m.Label({
                text : "To",
                visible : {
                    path : "operator",
                    formatter : function(operator) {
                        return (operator === "BT") ? true : false;
                    }
                }
            });
            var dimensionValueLayout = new sap.m.VBox({
                items : [dimensionValue, dimensionValueToLabel, dimensionValueTo],
                layoutData : new sap.ui.layout.GridData({
                    span : "L3 M3"
                })
            });
            var dimensionDel = new sap.m.Button({
                icon : "sap-icon://sys-cancel",
                type : "Transparent",
                layoutData : new sap.ui.layout.GridData({
                    span : "L1 M1 S1"
                }),
                press : function(evt) {
                    var path = evt.getSource().getBindingContext().getPath();
                    if(that.dimensionValue){
                        if(that.dimensionValue[evt.getSource().getBindingContext().getObject().name]){
                            delete that.dimensionValue[evt.getSource().getBindingContext().getObject().name];
                        }
                    }
                    evt.getSource().getBindingContext().getModel().getData().selectedDimensions.splice(path.substring(path
                            .lastIndexOf("/") + 1), 1);
                    evt.getSource().getBindingContext().getModel().updateBindings();

                    if(evt.getSource().getBindingContext().getModel().getData().selectedDimensions.length == 0){
                        that.byId("dimensionLayoutHeaders").setVisible(false);
                    }
                }
            });
            var dimensionGrid = new sap.ui.layout.Grid({
                defaultSpan : "L12 M12",
                content : [new sap.m.Input({
                    value : "{name}",
                    width : "100%",
                    textAlign : sap.ui.core.TextAlign.End,
                    editable:false,
                    layoutData : new sap.ui.layout.GridData({
                        span : "L3 M3"
                    })
                }), dimensionOperator, dimensionValueLayout,dimensionDel]
            });
            return dimensionGrid;
        });

        var aFilterMandatory = new sap.ui.model.Filter("required",sap.ui.model.FilterOperator.NE,true);
        this.byId("baseDimensionLayout").getBinding("items").filter(aFilterMandatory);
    },
    
    formatOptionalFiltersOperators : function(oContext){
    	var sPath = oContext.getPath().replace(/\D/g, '');
    	var sFilterRestriction = oContext.getModel().oData.selectedDimensions[sPath].filterRestriction || null;
    switch(sFilterRestriction){
    	case "single-value":
    		return [new sap.ui.core.Item({
                text : this.oResourceBundle.getText("EQUAL_TO"),
                key : "EQ"
            })];
    		break;
    		
    	default: 
    		return [new sap.ui.core.Item({
                text : this.oResourceBundle.getText("EQUAL_TO"),
                key : "EQ"
            }), new sap.ui.core.Item({
                text : this.oResourceBundle.getText("GREATER_THAN"),
                key : "GT"
            }), new sap.ui.core.Item({
                text : this.oResourceBundle.getText("LESS_THAN"),
                key : "LT"
            }), new sap.ui.core.Item({
                text : this.oResourceBundle.getText("NOT_EQUAL_TO"),
                key : "NE"
            }), new sap.ui.core.Item({
                text : this.oResourceBundle.getText("BETWEEN"),
                key : "BT"
            })];
    		break;  
    	
    	}
    },

    openInputParameterValueHelpDialog : function(name) {
        var that = this;
        var inputParameterValueHelpDialog = new sap.m.SelectDialog({
            title : that.oResourceBundle.getText("SELECT_VALUES"),
            multiSelect : true,
            rememberSelections : true,
            items : {
                path : "/results",
                template : new sap.m.StandardListItem({
                    title : "{" + name + "}",
                })
            },
            confirm : function(oEvent) {
            },
            liveChange : function(oEvent) {
            }
        });
        inputParameterValueHelpDialog.setGrowingThreshold(100);
        inputParameterValueHelpDialog.open();
    },

    openDimensionDialog : function() {
        var that = this;
        var sapClientFilter1 = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.NE, "P_SAPClient");
        var sapClientFilter2 = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.NE, "V_SAPClient");
        var sapClientFilter3 = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.NE, "SAPClient");
        var oFilterRequired = new sap.ui.model.Filter("required", sap.ui.model.FilterOperator.NE, true);
        var filterSapClient = new sap.ui.model.Filter([sapClientFilter1,sapClientFilter2,sapClientFilter3],true);

        if (!this.dimensionDialog) {
            var oSorter1 = new sap.ui.model.Sorter("label",false);
            this.dimensionDialog = new sap.m.SelectDialog({
                title : that.oResourceBundle.getText("SELECT_DIMENSION_TO_ADD_FILTERS"),
                multiSelect : true,
                items : {
                    path : "/dimensions",
                    sorter : oSorter1,
                    template : new sap.m.StandardListItem({title : "{label}",description : "{name}"})
                },
                confirm : function(oEvent) {
                    var selectedDimensions = that.oModelForDimensions.getData().selectedDimensions||[];
                    var selectedItems = oEvent.getParameter("selectedItems");
                    var aContexts = [];
                    for(var key in selectedItems){
                        aContexts[key] = selectedItems[key].getBindingContext();
                    }
                    for ( var key in aContexts) {
                        var selectedObject = that._cloneObj(aContexts[key].getObject());
                        selectedObject.value_1 = "";
                        selectedObject.value_2 = "";
                        selectedObject.operator = "EQ";
                        selectedDimensions.unshift(selectedObject);
                    }
                    if (aContexts.length > 0)
                        that.byId("dimensionLayoutHeaders").setVisible(true);
                    else
                        that.byId("dimensionLayoutHeaders").setVisible(false);
                    that.oModelForDimensions.setProperty("/selectedDimensions", selectedDimensions);
                },
                liveChange : function(oEvent) {
                    var searchValue = oEvent.getParameter("value");
                    var thirdFilters;
                    var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, searchValue);
                    var oFilterLabel = new sap.ui.model.Filter("label", sap.ui.model.FilterOperator.Contains, searchValue);


                    var firstFilters = new sap.ui.model.Filter([oFilter,oFilterLabel], false);
                    var secondFilters = new sap.ui.model.Filter([oFilterRequired], true);
                    if(that.hasSapClient === true){
                        thirdFilters = new sap.ui.model.Filter([filterSapClient,secondFilters],true);
                    }
                    else{
                        thirdFilters = new sap.ui.model.Filter([secondFilters],true);
                    }
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter(new sap.ui.model.Filter([firstFilters, thirdFilters], true));
                }
            });
            this.dimensionDialog.setGrowingThreshold(100);

            try {
                that.mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(that.getView().getModel().getProperty("/ODATA_URL"), that.getView().getModel().getProperty("/ODATA_ENTITYSET"));
                var columnLabelObj = that.mProperties.getLabelMappingObject();
                var dimensionModelData = that.oModelForDimensions.getData();
                var dimensionArray = that.oModelForDimensions.getData().dimensions;
                for(var i=0,l=dimensionArray.length; i<l; i++) {
                    dimensionArray[i].label = columnLabelObj[dimensionArray[i].name];
                }
                dimensionModelData.dimensions = dimensionArray;
                that.oModelForDimensions.setData(dimensionModelData);
            }
            catch(e) {
                jQuery.sap.log.error("Failed to instantiate the odata model");
                throw e;
            }

            this.dimensionDialog.setModel(this.oModelForDimensions);
            
        }
        if(that.hasSapClient === true){
            this.dimensionDialog.getBinding("items").filter([filterSapClient,oFilterRequired],false);
        }
        this.dimensionDialog.open();
    },


    handleDimensionValueHelp : function(oEvent) {
        this.openDimensionValueHelpDialog(oEvent, "value_1");
    },

    handleDimensionValueToHelp : function(oEvent) {
        this.openDimensionValueHelpDialog(oEvent, "value_2");
    },

    getMandatoryFilters : function(){
        var that = this;
        var mandatoryFiltersArray = [];
        var selectedDimensions = this.oModelForDimensions.getData().selectedDimensions;
        for(var i in selectedDimensions){
            if(selectedDimensions[i].required==true){
                if(selectedDimensions[i].value_1 === "$$$"){
                    if(that.VIEW_MODE != "cds"){
                        mandatoryFiltersArray.push({ 
                            OPERATOR: selectedDimensions[i].operator, 
                            NAME: selectedDimensions[i].name, 
                            VALUE_1: that.userSessionClient,
                            VALUE_2: selectedDimensions[i].value_2, 
                            TYPE: "FI"
                        });
                    }
                }
                else{
                    mandatoryFiltersArray.push({ 
                        OPERATOR: selectedDimensions[i].operator, 
                        NAME: selectedDimensions[i].name, 
                        VALUE_1: selectedDimensions[i].value_1,
                        VALUE_2: selectedDimensions[i].value_2, 
                        TYPE: "FI"
                    });
                }
            }
        }
        return mandatoryFiltersArray;
    },

    openDimensionValueHelpDialog : function(oEvent, valueType) {
        var that = this;
        var parentInputField = oEvent.getSource();
        var baseModel = this.getView().getModel();
        var dimensionValuesModel = new sap.ui.model.json.JSONModel();
        var inputParameterArray = [];
        this.dimensionContext = oEvent.getSource().getBindingContext();
        var dimensionName = oEvent.getSource().getBindingContext().getProperty("name");
        var dimensionOperator = oEvent.getSource().getBindingContext().getProperty("operator");
        var dimensionType = oEvent.getSource().getBindingContext().getProperty("propertyType");
        var inputParameterData = this.oModelForInputParameters.getData().inputParameters;
        for ( var key in inputParameterData) {
            if(inputParameterData[key].value_1 === "$$$"){
                if(that.VIEW_MODE != "cds"){
                    inputParameterArray.push({ 
                        OPERATOR: inputParameterData[key].operator, 
                        NAME: inputParameterData[key].name, 
                        VALUE_1: that.userSessionClient,
                        VALUE_2: inputParameterData[key].value_2, 
                        TYPE: "PA" // TYPE { FI, PA} 
                    }); 
                }
            }
            else{
                inputParameterArray.push({ 
                    OPERATOR: inputParameterData[key].operator, 
                    NAME: inputParameterData[key].name, 
                    VALUE_1: inputParameterData[key].value_1,
                    VALUE_2: inputParameterData[key].value_2, 
                    TYPE: "PA" // TYPE { FI, PA} 
                }); 
            }
        }
        var allMandatoryFiltersEntered = this.allMandatoryFiltersEntered();
        if(!allMandatoryFiltersEntered){
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_ALL_MANDATORY_FILTERS"));
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_ENTER_ALL_MANDATORY_FILTERS")
            });
            that.errorState = true;
        }
        var queryService = sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
            serviceUri : baseModel.getProperty("/ODATA_URL"),
            entitySet : baseModel.getProperty("/ODATA_ENTITYSET"),
            filter : inputParameterArray.concat(that.getMandatoryFilters()),
            dimension : dimensionName
        });
        queryService.model.read(queryService.uri, null, null, false, function(data) {
            if (that.dimensionValue[dimensionName])
            {
                that.dimensionValue[dimensionName][valueType] = that.dimensionValue[dimensionName][valueType]
                ? that.dimensionValue[dimensionName][valueType] : "";
                var dimensionValueArray = that.dimensionValue[dimensionName][valueType] === ""
                    ? null : that.dimensionValue[dimensionName][valueType].split(",");
                for (key in dimensionValueArray)
                {      var userInputData = true;
                for ( var i in data.results)
                {   if(dimensionType == "Edm.DateTime")
                {      var date = new Date(dimensionValueArray[key]).toJSON();
                var dateFromService = new Date(data.results[i][dimensionName]).toJSON();
                if(date == dateFromService)
                {      userInputData = false;
                break;                                                                     
                }
                }
                else if (dimensionValueArray[key] === data.results[i][dimensionName])
                {  userInputData = false;
                break;
                }
                }
                if (userInputData)
                {
                    var userInputValueObject = {};
                    userInputValueObject[dimensionName] = dimensionValueArray[key];
                    userInputValueObject.userInput = true;
                    userInputValueObject.selected = true;
                    data.results.push(userInputValueObject);
                }
                else
                    data.results[i].selected = true;
                }
            }
            dimensionValuesModel.setData(data);
        }, function(error) {

        });

        var oSorter1 = new sap.ui.model.Sorter(dimensionName,false,function(context) {

            if (context.getProperty("userInput") === true)
                return {
                key : "USER_VALUES",
                text : that.oResourceBundle.getText("VALUES_ENTERED_BY_USER")
            };
            else
                return {
                key : "SERVICE_VALUES",
                text : that.oResourceBundle.getText("VALUES_FETCHED_FROM_SERVICE")
            };
        });
        this.dimensionValueHelpDialogs = new sap.m.SelectDialog(
                {
                    title : that.oResourceBundle.getText("SELECT_VALUES"),
                    multiSelect : true,
                    rememberSelections : true,
                    items : {
                        path : "/results",
                        sorter : oSorter1,
                        template : new sap.m.StandardListItem({
                            title : "{"+dimensionName+"}",                                                                   
                            selected : "{selected}"
                        })
                    },
                    confirm : function(oEvent) {
                        var selectedDimensionValues = "";
                        var aContexts = oEvent.getParameter("selectedContexts");
                        for ( var key in aContexts)
                        {      
                            if(dimensionType == "Edm.DateTime")
                            {   var dateObj = new Date(aContexts[key].getProperty(that.dimensionContext.getProperty("name")));
                            var month = dateObj.getMonth()+1;
                            month = /^\d$/.test(month) ? "0"+ month : month;
                            var date = dateObj.getDate();
                            date = /^\d$/.test(date) ? "0"+ date : date;
                            var hours = dateObj.getHours();
                            hours = /^\d$/.test(hours) ? "0"+ hours : hours;
                            var minutes = dateObj.getMinutes();
                            minutes = /^\d$/.test(minutes) ? "0"+ minutes : minutes;
                            var seconds = dateObj.getSeconds();
                            seconds = /^\d$/.test(seconds) ? "0"+ seconds : seconds;
                            selectedDimensionValues = selectedDimensionValues + dateObj.getFullYear()+"-"+ month +"-"+date+" "+hours+":"+minutes+":"+seconds+"."+dateObj.getMilliseconds()+",";     
                            }
                            else
                                selectedDimensionValues = selectedDimensionValues + aContexts[key].getProperty(that.dimensionContext.getProperty("name")) + ",";
                        }
                        selectedDimensionValues = selectedDimensionValues.substring(0, selectedDimensionValues.length - 1);
                        that.oModelForDimensions.setProperty(that.dimensionContext.getPath() + "/" + valueType,selectedDimensionValues);
                        parentInputField.fireChange({
                            value : selectedDimensionValues
                        });
                        that.dimensionValue[dimensionName] = that.dimensionValue[dimensionName] ? that.dimensionValue[dimensionName] : {};
                        that.dimensionValue[dimensionName][valueType] = selectedDimensionValues;
                    },
                    liveChange : function(oEvent) {
                        var searchValue = oEvent.getParameter("value");
                        var oFilter = new sap.ui.model.Filter(dimensionName, sap.ui.model.FilterOperator.Contains,
                                searchValue);
                        var oBinding = oEvent.getSource().getBinding("items");
                        oBinding.filter([oFilter]);
                    }
                });
        this.dimensionValueHelpDialogs.setGrowingThreshold(100);
        this.dimensionValueHelpDialogs.setModel(dimensionValuesModel);

        var dimensions = this.oModelForDimensions.getData().selectedDimensions;
        var items = this.dimensionValueHelpDialogs.getItems();
        for(var i=0;i<dimensions.length;i++){
            if((dimensionName === dimensions[i].name) &&(dimensionOperator === dimensions[i].operator)){
                var value;
                if(dimensions[i].operator === "BT"){
                    if(valueType === "value_1")
                        value = dimensions[i].value_1.split(",");
                    else
                        value = dimensions[i].value_2.split(",");
                }
                else{
                    value = dimensions[i].value_1.split(",");
                }

                for(var j=0;j<value.length;j++){
                    for(var k=1;k<items.length;k++){
                        if(value[j] === items[k].getTitle()){
                            items[k].setSelected(true);
                        }
                    }
                }
            }
        }

        this.dimensionValueHelpDialogs.open();
        for(var i=1;i<items.length;i++){
            if(!items[i].getSelected()){
                this.dimensionValueHelpDialogs.getItems()[i].setSelected(true);
                this.dimensionValueHelpDialogs.getItems()[i].setSelected(false);
            }
        }
    },

    allMandatoryFiltersEntered : function(){
        var dataSource = this.getView().getModel().getData().ODATA_URL;
        var entitySet = this.getView().getModel().getData().ODATA_ENTITYSET;

        if(dataSource && entitySet){
            this.queryResultFilters = sap.suite.ui.smartbusiness.lib.OData.filter(dataSource,entitySet);
            var mandatoryFilters = this.queryResultFilters.getMandatoryList();

            var mandatoryFiltersLength = mandatoryFilters.length;
            var i=0;j=0,l=0;
            var selectedDimensionsLength = 0;
            var selectedDimensions = this.oModelForDimensions.getData().selectedDimensions;
            if(selectedDimensions){
                selectedDimensionsLength = selectedDimensions.length;
                if(selectedDimensionsLength){
                    for(i=0;i<mandatoryFiltersLength;i++){
                        for(j=0;j<selectedDimensionsLength;j++){
                            if(mandatoryFilters[i]===selectedDimensions[j].name){
                                if(!selectedDimensions[j].value_1){
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    },



    handleDimensionValueChange : function(oEvent) {
        this.validateValue(oEvent, "dimensionValue");
        var valueType = oEvent.getSource().getCustomData()[0].getValue(); //value_1 or value_2
        var dimensionName = oEvent.getSource().getBindingContext().getProperty("name");
        if (!this.dimensionValue[dimensionName])
            this.dimensionValue[dimensionName] = {};
        this.dimensionValue[dimensionName][valueType] = oEvent.getParameter("value");
    },

    validateValue : function(oEvent, sourceType) {
        var that = this,result;
        var dimensionName = oEvent.getSource().getBindingContext().getProperty("name");
        var valueType = oEvent.getSource().getCustomData()[0].getValue();
        var valueArray = (sourceType === "dimensionValue") ? oEvent.getParameter("value").split(",") : oEvent
                .getSource().getBindingContext().getProperty("value_1");

        //Checking if multiple values for BT
        var operator = oEvent.getSource().getBindingContext().getProperty("operator");
        if (operator === "BT") {
            if (valueArray.length > 1) {
                result = false;
                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_MULTIPLE_VALUES_FOR_BETWEEN",dimensionName));
                that.errorMessages.push({
                    "type":"Error",
                    "title":that.oResourceBundle.getText("ERROR_MULTIPLE_VALUES_FOR_BETWEEN",dimensionName)
                });
                that.errorState = true;
                var sPath = valueType === "value_1"? oEvent.getSource().getBindingContext().getPath() + "/error_1"	: oEvent.getSource().getBindingContext().getPath() + "/error_2";
                oEvent.getSource().getModel().setProperty(sPath, true);
                return;
            } else {
                var sPath = valueType === "value_1"
                    ? oEvent.getSource().getBindingContext().getPath() + "/error_1"
                            : oEvent.getSource().getBindingContext().getPath() + "/error_2";
                    oEvent.getSource().getModel().setProperty(sPath, false);
            }
        }


        //Checking filter restrictions

        //to implement this for single value filter restrictions

        /*		var filterRestriction = oEvent.getSource().getBindingContext().getProperty("filterRestriction");
		if(filterRestriction === "single-value"){
			if (valueArray.length > 1) {
				result = false;
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_MULTIPLE_VALUES_FOR_SINGLE_VALUE_FILTER",dimensionName));
				var sPath = oEvent.getSource().getBindingContext().getPath() + "/error_1";
				oEvent.getSource().getModel().setProperty(sPath, true);
				return;
			}
		}
         */		

        //to implement this for multiple value filter restirctions

        /*		else if(filterRestriction === "multiple-value"){
			if (valueArray.length <= 1) {
				result = false;
				sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_ENTER_VALUES_FOR_MULTIPLE_VALUE_FILTER",dimensionName));
				var sPath = oEvent.getSource().getBindingContext().getPath() + "/error_1";
				oEvent.getSource().getModel().setProperty(sPath, true);
				return;
			}
		}
         */
        //Checking dimension value types are correct
        var expectedValueType = oEvent.getSource().getBindingContext().getProperty("propertyType");
        var errorMsg,pattern;
        for ( var key in valueArray) {
            result = true;
            var scriptTagPattern = /<(script)(.*)\/?>/i;
            var jsFunctionDefinitionPattern = /function\s*[^\(]*\(\s*([^\)]*)\)/;
            var jsFunctionCallPattern = /[^\(]*\(\s*([^\)]*)\)\s*{/;
            if (scriptTagPattern.test(valueArray[key]) || jsFunctionDefinitionPattern.test(valueArray[key])
                    || jsFunctionCallPattern.test(valueArray[key])) {
                result = false;
                errorMsg = that.oResourceBundle.getText("ERROR_INVALID_TEXT_FOR",dimensionName);
            }
            if(expectedValueType == "Edm.Int32" || expectedValueType == "Edm.Int16" || expectedValueType == "Edm.Int64")
            {
                pattern = /^[-+]?\d+$/;
                result = pattern.test(valueArray[key]) ? true : false;
                errorMsg = that.oResourceBundle.getText("ERROR_INVALID_ENTRY_ENTER_INTEGER",dimensionName);
            } 
            else if(expectedValueType == "Edm.Decimal")
            {
                pattern = /^[-+]?\d+(\.\d+)?$/;
                result = pattern.test(valueArray[key])?true:false;
                errorMsg = that.oResourceBundle.getText("ERROR_INVALID_ENTRY_ENTER_DECIMAL",dimensionName);
            }
            else if(expectedValueType == "Edm.DateTime")
            {
                pattern = /^[1-9][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])(\s([0-1][0-9]|2[0-3]):[0-5][0-9]:([0-9]|[0-5][0-9])[.][0-9]+)?$/;
                result = pattern.test(valueArray[key])?true:false;
                errorMsg = that.oResourceBundle.getText("ERROR_INVALID_ENTRY_ENTER_DATE",dimensionName);
            }

            if (!result) {
                sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(errorMsg);
                that.errorMessages.push({
                    "type":"Error",
                    "title":errorMsg
                });
                that.errorState = true;
                var sPath = valueType === "value_1"
                    ? oEvent.getSource().getBindingContext().getPath() + "/error_1"
                            : oEvent.getSource().getBindingContext().getPath() + "/error_2";
                    oEvent.getSource().getModel().setProperty(sPath, true);
                    return;
            } else {
                var sPath = valueType === "value_1"
                    ? oEvent.getSource().getBindingContext().getPath() + "/error_1"
                            : oEvent.getSource().getBindingContext().getPath() + "/error_2";
                    oEvent.getSource().getModel().setProperty(sPath, false);
            }
        }
    },

    handleOperatorChange : function(oEvent) {
        var context = oEvent.getSource().getBindingContext();
        context.getObject().value_1 = "";
        if(this.dimensionValue){
            if(this.dimensionValue[context.getObject().name]){
                this.dimensionValue[context.getObject().name].value_1="";
            }
        }

        if (context.getProperty("operator") === "BT") {
            context.getObject().value_2 = "";
            if(this.dimensionValue){
                if(this.dimensionValue[context.getObject().name]){
                    this.dimensionValue[context.getObject().name].value_2="";
                }
            }
        } 
        context.getModel().updateBindings();
    },

    validateDimensionsAndInputParameters : function() {
        var inputParameters = this.oModelForInputParameters.getData().inputParameters;
        var dimensions = this.oModelForDimensions.getData().selectedDimensions;
        var error = false;
        var errorType = "";
        var errorDimension = "";
        for ( var key in inputParameters) {
            if (inputParameters[key].error_1 === true || inputParameters[key].error_2 === true)
                error = true;
            if (inputParameters[key].value_1 === "") {
                error = true;
                errorType = "mandatoryFieldEmpty";
                inputParameters[key].error_1 = true;
            }
        }
        this.oModelForInputParameters.updateBindings();
        for ( var key in dimensions) {
            if (dimensions[key].error_1 === true || dimensions[key].error_2 === true){
                error = true;
                errorType = "invalidEntry";
                errorDimension = dimensions[key];
            }
            if (dimensions[key].value_1 === "") {
                error = true;
                errorType = "fieldEmpty";
                dimensions[key].error_1 = true;
            }
            if (dimensions[key].operator === "BT" && dimensions[key].value_2 === "") {
                error = true;
                errorType = "fieldEmpty";
                dimensions[key].error_2 = true;
            }
        }
        this.oModelForDimensions.updateBindings();
        return {
            error : error,
            errorType : errorType,
            errorDimension : errorDimension
        };
    },

    resetDimensionsAndInputParameters : function() {
        this.oModelForDimensions.setData({});
        this.oModelForInputParameters.setData({});
        this.dimensionDialog = null;
        this.dimensionValueHelpDialogs = {};
        this.dimensionValue = {};

        this.byId("noInputParameterGrid").setVisible(true);
        this.byId("inputParameterDataGrid").setVisible(false);
        this.byId("mandatoryFiltersDataGrid").setVisible(false);
    },

    createTargetThresholdLayout : function() {
        var that = this;
        var trend = this.getView().getModel().getData().TREND;
        var reference_value = this.getView().getModel().getData().REFERENCE_VALUE;
        if (this.getView().getModel().getData().INDICATOR) {
            this.getView().byId('targetThresholdPanel').setVisible(true);
            this.getView().byId("additionalMeasures").setVisible(true);
            this.getView().byId("additionalMeasureLabel").setVisible(true);
            this.getView().byId("selectedLabel").setVisible(true);
            this.getView().byId("selectedadditionalMeasures").setVisible(true);
            this.selectedMeasure();
            this.getView().byId('targetThresholdPanel').getContent()[0].destroy();
            if(this.getView().getModel().getData().mode !== "edit"){
                delete this.getView().getModel().getData().CRITICALHIGH;
                delete this.getView().getModel().getData().WARNINGHIGH;
                delete this.getView().getModel().getData().TARGET;
                delete this.getView().getModel().getData().WARNINGLOW;
                delete this.getView().getModel().getData().CRITICALLOW;
                delete this.getView().getModel().getData().TREND;
                delete this.getView().getModel().getData().REFERENCE_VALUE;
            }
            that.getView().byId('targetThresholdPanel').addContent(new sap.ui.core.mvc.XMLView({
                viewName : "sap.suite.ui.smartbusiness.designtime.evaluation.view.createEvalTargetThresholdTrendInput",
                viewData : {controller:that}
            }));
        }
        if (!this.getView().getModel().getData().INDICATOR) {
            this.getView().byId('targetThresholdPanel').setVisible(false);
            this.getView().byId("additionalMeasures").setVisible(false);
            this.getView().byId("additionalMeasureLabel").setVisible(false);
            this.getView().byId("selectedLabel").setVisible(true);
            this.getView().byId("selectedadditionalMeasures").setVisible(true);
        }
        this.getView().getModel().setProperty("TREND",trend);
        this.getView().getModel().setProperty("REFERENCE_VALUE",reference_value);

    },

    addAdditionalLanguageDialog : function(){
        var that=this;
        this.additionalLanguageListModel = new sap.ui.model.json.JSONModel();
        this.additionalLanguageListModelData = jQuery.extend([], that.getView().getModel().getData().ADDITIONAL_LANGUAGE_ARRAY);
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
        this.addedLanguagesList = new sap.m.Table({
            showNoData:true,
            columns:[
                     new sap.m.Column({

                     }),
                     new sap.m.Column({

                     }),
                     new sap.m.Column({

                     })
                     ],
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
        this.addedLanguagesList.bindItems("additionalLanguageListModel>/", new sap.m.ColumnListItem({
            cells : [
                     new sap.m.ObjectIdentifier({
                         title : "{additionalLanguageListModel>TITLE}",
                         text : "{additionalLanguageListModel>DESCRIPTION}",
                         layoutData : new sap.ui.layout.GridData({
                             span : "L12 M12 S12",
                             vAlign : "Middle"
                         }),
                     }),
                     new sap.m.Label({
                         text : "{additionalLanguageListModel>LANGUAGE}",
                         design : "Bold",
                         layoutData : new sap.ui.layout.GridData({
                             span : "L6 M6 S6",
                             vAlign : "Middle"
                         }),
                     }),
                     new sap.m.Button({
                         icon : "sap-icon://sys-cancel",
                         type : "Transparent",
                         layoutData : new sap.ui.layout.GridData({
                             span : "L2 M2 S2"
                         }),
                         press : function(oEvent){
                             var deletedIndex = oEvent.getSource().getBindingContext("additionalLanguageListModel").getPath().substr(1);
                             var newData = that.addedLanguagesList.getModel("additionalLanguageListModel").getData().splice(deletedIndex,1);
                             that.addedLanguagesList.getModel("additionalLanguageListModel").updateBindings();
                             that.setEnable();
                         },
                     })
                     ]
        }));
        this.addedLanguagesList.setModel(that.additionalLanguageListModel,"additionalLanguageListModel");

        var additionalLanguageDialog = new sap.m.Dialog({
            contentHeight : "50%",
            contentWidth : "25%",
            title : this.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE"),
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
                                                             var str = that.languageTextInput.getValue().replace(/\s+/g, '');
                                                             if(str===""){
                                                                 that.languageTextInput.setValueState(sap.ui.core.ValueState.Error); 
                                                             }else{
                                                                 that.languageTextInput.setValueState(sap.ui.core.ValueState.None);
                                                             }

                                                             if(that.languageTextInput.getValue() && str !== ""){
                                                                 for(var i=0;i<that.addedLanguagesList.getModel("additionalLanguageListModel").getData().length;i++){
                                                                     if(that.addedLanguagesList.getModel("additionalLanguageListModel").getData()[i].LANGUAGE_KEY === that.languageKeySelect.getSelectedItem().getKey()){
                                                                         sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_LANGUAGE_EXISTS",that.languageKeySelect.getSelectedItem().getText()));
                                                                         return;
                                                                     }
                                                                 }

                                                                 var addedLanguageObject = {
                                                                         "TITLE" : that.languageTextInput.getValue(),
                                                                         "DESCRIPTION" : that.languageDescriptionInput.getValue(),
                                                                         "LANGUAGE_KEY" : that.languageKeySelect.getSelectedItem().getKey(),
                                                                         "LANGUAGE" : that.languageKeySelect.getSelectedItem().getText()
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
                        that.addedLanguagesList],
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

        this.setEnable();
        additionalLanguageDialog.open();

    },
    _cloneObj:function(ele){
        var tmp;
        if(ele instanceof Array){
            tmp=[];
            for(var i=0;i<ele.length;i++){
                tmp[i]=this._cloneObj(ele[i]);
            }
        }else if(ele instanceof Object){
            tmp={};
            for(var each in ele){
                if(ele.hasOwnProperty(each)){
                    tmp[each]=this._cloneObj(ele[each]);     
                }
            }
        }else{
            tmp=ele;
        }
        return tmp;
    },
    formatLangCount : function(value){
        if(!this.getView().getModel().getData()){
            value = 0;
        }
        else
            value = this.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES;
        return this.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGE")+"("+value+")";
    },
    convert:function(value){

        jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
        var valFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({ style: "standard" , decimals:value});
        var fNum = valFormatter.format(0);
        return fNum;
    },
    validateEvaluationValues: function(data) {
        data = data || this.getView().getModel().getData();
        var values = [];
        var errors = [];
        var score = 0;
        var duplicates = {};
        if(data.CRITICALLOW || data.CRITICALLOW === 0) {
            values.push({key: "CL", value: data.CRITICALLOW, score: score++});
        }
        if(data.WARNINGLOW || data.WARNINGLOW === 0) {
            values.push({key: "WL", value: data.WARNINGLOW, score: score++});
        }
        if(data.TARGET || data.TARGET === 0) {
            values.push({key: "TA", value: data.TARGET, score: score++});
        }
        if(data.WARNINGHIGH || data.WARNINGHIGH === 0) {
            values.push({key: "WH", value: data.WARNINGHIGH, score: score++});
        }
        if(data.CRITICALHIGH || data.CRITICALHIGH === 0) {
            values.push({key: "CH", value: data.CRITICALHIGH, score: score++});
        }
        values.sort(function(a,b) { return (a.value - b.value)});
        for(var i=0,l=values.length; i<l; i++) {
            if(values[i].score != i) {
                errors.push(values[i].key);
            }
            if(values[i] && values[i-1]) {
                if(values[i].value == values[i-1].value) {
                    duplicates[values[i-1].key] = values[i-1].value;
                    duplicates[values[i].key] = values[i].value;
                }
            }
        }
        if(!(errors.length)) {
            errors = Object.keys(duplicates);
        }
        return errors;
    },

    resetAdditionalMeasures : function(){
        var that = this;
        if(that.getView().getModel().getData().ODATA_URL && that.getView().getModel().getData().ODATA_ENTITYSET){
            /*			if(that.getView().byId('targetThresholdPanel').getContent()[0].getController().measuresDialog){
				var measureModel = that.getView().byId('targetThresholdPanel').getContent()[0].getController().populateMeasure(that.getView().getModel().getData().ODATA_URL,that.getView().getModel().getData().ODATA_ENTITYSET);
				that.getView().byId('targetThresholdPanel').getContent()[0].getController().measuresDialog.setModel(measureModel);
			}*/
            if(that.measureDialog){
                var measureModel = that.populateMeasure(that.getView().getModel().getData().ODATA_URL,that.getView().getModel().getData().ODATA_ENTITYSET);
                that.measuresDialog.setModel(measureModel);
            }

        }
        else{
            /*			if(that.getView().byId('targetThresholdPanel').getContent()[0].getController().measuresDialog){
				var measureModel = new sap.ui.model.json.JSONModel({});
				that.getView().byId('targetThresholdPanel').getContent()[0].getController().measuresDialog.setModel(measureModel);
			}*/
            if(that.measureDialog){
                var measureModel = new sap.ui.model.json.JSONModel({});
                that.measuresDialog.setModel(measureModel);
            }
        }
        //that.getView().byId('targetThresholdPanel').getContent()[0].byId('additionalMeasures').removeAllTokens();
        that.getView().byId("additionalMeasures").removeAllTokens();
    },

    isCDSMode: function(mode) {
        return mode == this.CDS;
    },

    isHANAMode: function(mode) {
        return mode != this.CDS;
    },
    createMeasuresDialog : function(){
        this.parentController = this.getView().getController();
        var that = this;
        var oDataUrl = this.parentController.getView().getModel().getData().ODATA_URL;
        var oDataEntitySet = this.parentController.getView().getModel().getData().ODATA_ENTITYSET;
        if(!(oDataUrl && oDataEntitySet)){
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET"));
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("ERROR_WRONG_ENTITY_SET")
            });
            that.errorState = true;
            return;
        }
        var measureModel = this.populateMeasure(oDataUrl,oDataEntitySet);
        that.measuresDialog = new sap.m.SelectDialog({
            title: that.oResourceBundle.getText("SELECT_MEASURE"),
            noDataText: that.oResourceBundle.getText("NO_DATA_FOUND"),
            multiSelect : true,
            items: {
                path: "/measures",
                template: new sap.m.StandardListItem({
                    title:"{measureName}",

                })},
                confirm : function(oEvent){
                    var oSelectedItem = oEvent.getParameter("selectedItems");
                    for ( var key in oSelectedItem)
                    {   
                        that.byId("additionalMeasures").addToken(new sap.m.Token({text : oSelectedItem[key].getTitle()}));
                        that.measuresDialog.removeItem(oSelectedItem[key]);
                    }
                    that.selectedMeasure();
                }
        });
        that.measuresDialog.setModel(measureModel);
    },
    selectedMeasure : function(){
        var that = this;
        that.byId("selectedadditionalMeasures").setVisible(true);
        that.byId("selectedLabel").setVisible(true);
        var measures = [];
        measures = that.byId("additionalMeasures").getTokens();
        if(measures.length == 0){
            that.byId("selectedadditionalMeasures").setVisible(false);
            that.byId("selectedLabel").setVisible(false);
            that.byId("selectedadditionalMeasures").setText("");
        }
        else{
            var selectedText = "";
            for(var i=0;i<measures.length;i++){
                if(i == 0){
                    selectedText = selectedText + measures[i].getText();
                }
                else{
                    selectedText = selectedText +", "+ measures[i].getText();
                }
            }
            that.byId("selectedadditionalMeasures").setText(selectedText);
        }
    },
    multiMeasureTokenChange : function(oEvent){
        var that = this;
        if(oEvent.getParameter("type") == "removed"){
            if(!that.measuresDialog){
                that.createMeasuresDialog();
            }
            var item = oEvent.getParameter("token");
            var measures = [];
            measures = that.measuresDialog.getModel().getData().measures;
            for(var i=0;i<measures.length;i++){
                if(measures[i].measureName === item.getText()){
                    that.measuresDialog.addItem(
                            new sap.m.StandardListItem({
                                title : item.getText(),
                            })
                    );
                }
            }
            that.selectedMeasure();	
        }
        var measures = [];
        measures = that.byId("additionalMeasures").getTokens();
        for(var i=0,l=measures.length; i<l; i++) {
            if(measures[i].getText() == that.getView().getModel().getData().COLUMN_NAME) {
                that.byId("additionalMeasures").setValueState("Error");
                return;
            }
            else{
                that.byId("additionalMeasures").setValueState("None");
            }
        }
    },
    openAdditionalMeasures : function(oEvent){
        var that = this;
        var oMeasure = this.getView().getModel().getData().COLUMN_NAME;
        if(!oMeasure || oMeasure === ""){
            that.byId("valueMeasureInput").setValueState("Error");
            sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oResourceBundle.getText("SELECT_VALUE_MEASURE"));
            that.errorMessages.push({
                "type":"Error",
                "title":that.oResourceBundle.getText("SELECT_VALUE_MEASURE")
            });
            that.errorState = true;
            return;
        }

        if(!that.measuresDialog){
            that.createMeasuresDialog();
        }

        var oFilterMeasure = new sap.ui.model.Filter("measureName", sap.ui.model.FilterOperator.NE,oMeasure);
        that.measuresDialog.getBinding("items").filter([oFilterMeasure],false);
        var items = that.measuresDialog.getItems();
        var tokens = that.byId("additionalMeasures").getTokens();
        for(var i=0;i<tokens.length;i++){
            for(var j=0;j<items.length;j++){
                if(tokens[i].getText() === items[j].getTitle()){
                    that.measuresDialog.removeItem(items[j]);
                }
            }
        }
        that.measuresDialog.open();
    },


    generateEvalId : function(oController){

        var x = {};
        x.title = "";
        var promiseObj = sap.suite.ui.smartbusiness.lib.IDGenerator.generateEvaluationId(x);
        var id;
        promiseObj.done(function(eId){
            id = eId;
            oController.getView().getModel().getData().ID = id;
            oController.getView().getModel().updateBindings();
        });
    },
    multiMeasureChange : function(value){
        var that = this;
        var measures = [];
        measures = that.byId("additionalMeasures").getValue().split(",");
        for(var i=0;i<measures.length;i++){
            that.byId("additionalMeasures").setValue("")
            that.byId("additionalMeasures").addToken(new sap.m.Token({text : measures[i]}));
        }
        measures = that.byId("additionalMeasures").getTokens();
        if(measures.length == 0){
            that.byId("additionalMeasures").setValueState("None");
        }
        for(var i=0,l=measures.length; i<l; i++) {
            if(measures[i].getText() == that.getView().getModel().getData().COLUMN_NAME) {
                that.byId("additionalMeasures").setValueState("Error");
                return;
            }
            else{
                that.byId("additionalMeasures").setValueState("None");
            }
        }
    },

    _areEvaluationValuesNumber: function(data) {

        var errors = [];
        if ( (data.CRITICALLOW && isNaN(data.CRITICALLOW)) || 
                (data.CRITICALHIGH && isNaN(data.CRITICALHIGH))) {
            errors.push("CRITICAL");
        }
        if ( (data.WARNINGLOW && isNaN(data.WARNINGLOW)) || 
                (data.WARNINGHIGH && isNaN(data.WARNINGHIGH))) {
            errors.push("WARNING");
        }
        if (data.TARGET && isNaN(data.TARGET)) {
            errors.push("TARGET");
        }
        return errors;
    },

    scaleFactorChange: function(evt) {
        evt.getSource().setTooltip(evt.getParameters().selectedItem.getText());
    },

    decimalPrecisionChange: function(evt) {
        evt.getSource().setTooltip(evt.getParameters().selectedItem.getText());
    }
});


