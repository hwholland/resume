/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/

jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("sap.suite.ui.smartbusiness.drilldown.view.AddToHome", {
    onInit : function() {
        this.drilldownController = this.getView().getViewData();
        this.evaluationApi  = this.drilldownController.EVALUATION;
        this.thresholds = this.evaluationApi.getThresholds();
        this.LAYOUT = this.byId("container");
        this.SAP_SYSTEM  = this.drilldownController.SAP_SYSTEM;
        try {
            this.LAYOUT_MODEL = new sap.ui.model.json.JSONModel({
                TITLE : "",
                CL : this.thresholds.getCriticalLow(),
                CH : this.thresholds.getCriticalHigh(),
                WL : this.thresholds.getWarningLow(),
                WH : this.thresholds.getWarningHigh(),
                TA : this.thresholds.getTarget(),
                TC : this.thresholds.getTrend(),
                RE : this.thresholds.getReference(),
                MINIMIZING_KPI : this.evaluationApi.isMinimizingKpi(),
                MAXIMIZING_KPI : this.evaluationApi.isMaximizingKpi(),
                TARGET_KPI : this.evaluationApi.isTargetKpi()
            });
            this.LAYOUT.setModel(this.LAYOUT_MODEL),
            this.createForm(this.evaluationApi.getThresholdValueType());
        }catch(e) {
            
        }
    },
    createForm : function(valueSource) {
        var _getVisibilityObject = function(modelProperty) {
            return  {
                parts : [
                    {path : modelProperty},
                    {path : "/TARGET_KPI"}
                ],
                formatter : function(MinOrMax, target) {
                    if(MinOrMax || target) {
                        return true;
                    }
                    return false;
                }
            }
        };
        var formLayout = null;
        var nonEditableLabel = null;
        if(valueSource == "MEASURE") {
        	formLayout = new sap.ui.layout.form.SimpleForm({
                content : [
                   new sap.m.Label({text : "{i18n>SUB_TITLE_LABEL}", required : true}),
                   new sap.m.Input({value : "{/TITLE}"})
                ]
            });
            nonEditableLabel = new sap.m.Label({
                text : "{i18n>DYNAMIC_MEASURE_NOT_EDITABLE}"
            });
            nonEditableLabel.addStyleClass("labelDynamicThresholdNotEditable");
        }
        else if(valueSource == "RELATIVE") {
        	formLayout = new sap.ui.layout.form.SimpleForm({
                content : [
                   new sap.m.Label({text : "{i18n>SUB_TITLE_LABEL}", required : true}),
                   new sap.m.Input({value : "{/TITLE}"}),
                   
                   new sap.m.Label({text : "{i18n>CRITICAL_HIGH_LABEL}", visible : _getVisibilityObject("/MINIMIZING_KPI")}),
                   new sap.m.Input({value : "{/CH}", visible : _getVisibilityObject("/MINIMIZING_KPI"), valueState : sap.ui.core.ValueState.Error, valueStateText : "{i18n>CRITICAL_HIGH_VALUE_HELP}"}),
                   new sap.m.Label({text : "{i18n>WARNING_HIGH_LABEL}", visible : _getVisibilityObject("/MINIMIZING_KPI")}),
                   new sap.m.Input({value : "{/WH}", visible : _getVisibilityObject("/MINIMIZING_KPI"), valueState : sap.ui.core.ValueState.Warning, valueStateText : "{i18n>WARNING_HIGH_VALUE_HELP}"}),
                   
                   new sap.m.Label({text : "{i18n>TARGET_LABEL}"}),
                   new sap.m.Input({value : "{/TA}", valueState : sap.ui.core.ValueState.None, valueStateText : "{i18n>TARGET_VALUE_HELP}", editable:false}),
                   
                   new sap.m.Label({text : "{i18n>WARNING_LOW_LABEL}", visible : _getVisibilityObject("/MAXIMIZING_KPI")}),
                   new sap.m.Input({value : "{/WL}",visible :  _getVisibilityObject("/MAXIMIZING_KPI"), valueState : sap.ui.core.ValueState.Warning, valueStateText : "{i18n>WARNING_LOW_VALUE_HELP}"}),
                   new sap.m.Label({text : "{i18n>CRITICAL_LOW_LABEL}",visible :  _getVisibilityObject("/MAXIMIZING_KPI")}),
                   new sap.m.Input({value : "{/CL}", visible : _getVisibilityObject("/MAXIMIZING_KPI"), valueState : sap.ui.core.ValueState.Error, valueStateText : "{i18n>CRITICAL_LOW_VALUE_HELP}"}),
                ]
            });
        } else {
        	formLayout = new sap.ui.layout.form.SimpleForm({
                content : [
                   new sap.m.Label({text : "{i18n>SUB_TITLE_LABEL}", required : true}),
                   new sap.m.Input({value : "{/TITLE}"}),
                   
                   new sap.m.Label({text : "{i18n>CRITICAL_HIGH_LABEL}", visible : _getVisibilityObject("/MINIMIZING_KPI")}),
                   new sap.m.Input({value : "{/CH}", visible : _getVisibilityObject("/MINIMIZING_KPI"), valueState : sap.ui.core.ValueState.Error, valueStateText : "{i18n>CRITICAL_HIGH_VALUE_HELP}"}),
                   new sap.m.Label({text : "{i18n>WARNING_HIGH_LABEL}", visible : _getVisibilityObject("/MINIMIZING_KPI")}),
                   new sap.m.Input({value : "{/WH}", visible : _getVisibilityObject("/MINIMIZING_KPI"), valueState : sap.ui.core.ValueState.Warning, valueStateText : "{i18n>WARNING_HIGH_VALUE_HELP}"}),
                   
                   new sap.m.Label({text : "{i18n>TARGET_LABEL}"}),
                   new sap.m.Input({value : "{/TA}", valueState : sap.ui.core.ValueState.None, valueStateText : "{i18n>TARGET_VALUE_HELP}"}),
                   
                   new sap.m.Label({text : "{i18n>WARNING_LOW_LABEL}", visible : _getVisibilityObject("/MAXIMIZING_KPI")}),
                   new sap.m.Input({value : "{/WL}",visible :  _getVisibilityObject("/MAXIMIZING_KPI"), valueState : sap.ui.core.ValueState.Warning, valueStateText : "{i18n>WARNING_LOW_VALUE_HELP}"}),
                   new sap.m.Label({text : "{i18n>CRITICAL_LOW_LABEL}",visible :  _getVisibilityObject("/MAXIMIZING_KPI")}),
                   new sap.m.Input({value : "{/CL}", visible : _getVisibilityObject("/MAXIMIZING_KPI"), valueState : sap.ui.core.ValueState.Error, valueStateText : "{i18n>CRITICAL_LOW_VALUE_HELP}"}),
                ]
            });
        }
        this.LAYOUT.removeAllItems();
        this.LAYOUT.addItem(formLayout);
        if(nonEditableLabel) {
            this.LAYOUT.addItem(nonEditableLabel);
        }
    },
    validate : function(sCallback, fCallback) {
    	var i18nModel = this.drilldownController.getView().getModel("i18n");
        var modelData = this.LAYOUT_MODEL.getData();
        var object = {title : ""};
        var targetType = this.thresholds.getTargetType();
        
        if(targetType === "FIXED"){
        	
        	var notNumberErrors = this._areEvaluationValuesNumber(modelData);
        	if(notNumberErrors.length){
        		var msg = "";
        		for(i=0;i<notNumberErrors.length;i++){
        			msg = msg + i18nModel.getProperty("ENTER_NUMERIC_VALUE_FOR_" + notNumberErrors[i]) + "\n";
				}
				
				fCallback.call(this, {errorMessage : msg});
				return;
        	}
        	
			var validatedEvalValues = this._validateEvaluationValues(modelData);
			if(validatedEvalValues.length){

				var msg = i18nModel.getProperty("ERROR_ENTER_VALID_THRESHOLD_VALUES");
				var i;
				for(i=0;i<validatedEvalValues.length;i++){
					if(validatedEvalValues[i]==="CL"){
						if(this.evaluationApi.getGoalType() === "RA"){
							msg = msg+"\n"+i18nModel.getProperty("CRITICAL_LOW");
						}
						else{
							msg = msg+"\n"+i18nModel.getProperty("CRITICAL");
						}
					}
					if(validatedEvalValues[i]==="WL"){
						if(this.evaluationApi.getGoalType() === "RA"){
							msg = msg+"\n"+i18nModel.getProperty("WARNING_LOW");
						}
						else{
							msg = msg+"\n"+i18nModel.getProperty("WARNING");
						}
					}
					if(validatedEvalValues[i]==="TA"){
						msg = msg+"\n"+i18nModel.getProperty("TARGET");
					}
					if(validatedEvalValues[i]==="CH"){
						if(this.evaluationApi.getGoalType() === "RA"){
							msg = msg+"\n"+i18nModel.getProperty("CRITICAL_HIGH");
						}
						else{
							msg = msg+"\n"+i18nModel.getProperty("CRITICAL");
						}
					}
					if(validatedEvalValues[i]==="WH"){
						if(this.evaluationApi.getGoalType() === "RA"){
							msg = msg+"\n"+i18nModel.getProperty("WARNING_HIGH");
						}
						else{
							msg = msg+"\n"+i18nModel.getProperty("WARNING");
						}
					}
				}
				
				fCallback.call(this, {errorMessage : msg});
				return;
			}
		}
        if(targetType === "RELATIVE"){
			var patt = /^(?=.*\d)\d*(?:\.\d\d)?$/;
			var msg="";

			if(this.evaluationApi.getGoalType() === "MA"){
				if((modelData.WL!="" && modelData.WL!=null) && (modelData.CL!="" && modelData.CL!=null) && parseInt(modelData.WL) <= parseInt(modelData.CL)){
					msg += i18nModel.getProperty("CRITICAL_SHOULD_BE_LESS_THAN_WARNING");
				}
				if(modelData.WL>=100 && (modelData.WL !="" && modelData.WL!=null)){
					msg +="\n" +i18nModel.getProperty("WARNING_SHOULD_BE_LESS_THAN_100");
				}
				if(modelData.CL!="" && (modelData.CL>=100 && modelData.CL!=null)){
					msg +="\n" +i18nModel.getProperty("CRITICAL_SHOULD_BE_LESS_THAN_100");
				}
				if((modelData.WL !="" && modelData.WL!=null) && !patt.test(modelData.WL)){
					msg += "\n" +i18nModel.getProperty("ENTER_NUMERIC_VALUE_FOR_WARNING");
				}
				if((modelData.CL!="" && modelData.CL!=null) && !patt.test(modelData.CL)){
					msg += "\n" +i18nModel.getProperty("ENTER_NUMERIC_VALUE_FOR_CRITICAL");
				}
			}
			if(this.evaluationApi.getGoalType() === "MI"){
				if((modelData.CH!="" && modelData.CH!=null) && (modelData.WH!="" && modelData.WH!=null) && parseInt(modelData.CH) <= parseInt(modelData.WH)){
					msg += i18nModel.getProperty("CRITICAL_SHOULD_BE_MORE_THAN_WARNING"); 
				}
				if(modelData.CH<=100 && (modelData.CH !="" && modelData.CH!=null)){
					msg += "\n"+i18nModel.getProperty("CRITICAL_SHOULD_BE_MORE_THAN_100");
				}
				if(modelData.WH<=100 && (modelData.WH !="" && modelData.WH!=null)){
					msg += "\n"+i18nModel.getProperty("WARNING_SHOULD_BE_MORE_THAN_100");
				}
				if(modelData.CH!="" && modelData.CH!=null && !patt.test(modelData.CH)){
					msg += "\n" +i18nModel.getProperty("ENTER_NUMERIC_VALUE_FOR_CRITICAL");
				}
				if((modelData.WH!="" && modelData.WH!=null && !patt.test(modelData.WH))){
					msg += "\n" +i18nModel.getProperty("ENTER_NUMERIC_VALUE_FOR_WARNING");
				}
			}
			if(this.evaluationApi.getGoalType() === "RA"){
				if((modelData.CH!="" && modelData.CH!=null) && (modelData.CH!="" && modelData.CH!=null) && parseInt(modelData.CH) <= parseInt(modelData.WH)){
					msg += i18nModel.getProperty("CRITICAL_HIGH_MORE_THAN_WARNING_HIGH");
				}
				if((modelData.WL!="" && modelData.WL!=null) && (modelData.CL!="" && modelData.CL!=null) && parseInt(modelData.WL) <= parseInt(modelData.CL)){
					msg += "\n"+i18nModel.getProperty("WARNING_LOW_MORE_THAN_CRITICAL_LOW");
				}
				if(modelData.CH<=100 && (modelData.CH !="" && modelData.CH!=null)){
					msg += "\n"+i18nModel.getProperty("CRITICAL_HIGH_SHOULD_BE_MORE_THAN_100");
				}
				if(modelData.WH<=100 && (modelData.WH !="" && modelData.WH!=null)){
					msg += "\n"+i18nModel.getProperty("WARNING_HIGH_SHOULD_BE_MORE_THAN_100");
				}
				if(modelData.CL>=100 && (modelData.CL!="" && modelData.CL!=null)){
					msg += "\n"+i18nModel.getProperty("CRITICAL_LOW_SHOULD_BE_LESS_THAN_100");
				}
				if(modelData.WL>=100 && (modelData.WL !="" && modelData.WL!=null)){
					msg += "\n"+i18nModel.getProperty("WARNING_LOW_SHOULD_BE_LESS_THAN_100");
				}
				if((modelData.WL !="" && modelData.WL!=null) && !patt.test(modelData.WL)){
					msg += "\n" +i18nModel.getProperty("ENTER_NUMERIC_VALUE_FOR_WARNING_LOW");
				}
				if((modelData.CL!="" && modelData.CL!=null) && !patt.test(modelData.CL)){
					msg += "\n" +i18nModel.getProperty("ENTER_NUMERIC_VALUE_FOR_CRITICAL_LOW");
				}
				if(modelData.CH!="" && modelData.CH!=null && !patt.test(modelData.CH)){
					msg += "\n" +i18nModel.getProperty("ENTER_NUMERIC_VALUE_FOR_CRITICAL_HIGH");
				}
				if((modelData.WH!="" && modelData.WH!=null && !patt.test(modelData.WH))){
					msg += "\n" +i18nModel.getProperty("ENTER_NUMERIC_VALUE_FOR_WARNING_HIGH");
				}
			}
			if(msg!=""){
				fCallback.call(this, {errorMessage : msg});
				return;
			}
		}
        
        if(this.evaluationApi.getThresholdValueType() == "MEASURE") {
            if(!modelData.TITLE.trim()) {
                fCallback.call(this, {errorMessage : this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_TITLE_MISSING")});
            } else {
                object.title  = modelData.TITLE.trim();
                sCallback.call(this, object);
            }
        } else if(this.evaluationApi.getThresholdValueType() == "RELATIVE") {
        	if(!modelData.TITLE.trim()) {
                fCallback.call(this, {errorMessage : this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_TITLE_MISSING")});
                return;
            }
        	object.title  = modelData.TITLE.trim();
            object.evaluationValues = [];
            var targetValue = modelData.TA ? modelData.TA.trim() : null;
            var CLValue = modelData.CL ? modelData.CL.trim() : null;
            var CHValue = modelData.CH ? modelData.CH.trim() : null;
            var WLValue = modelData.WL? modelData.WL.trim() : null;
            var WHValue = modelData.WH? modelData.WH.trim() : null;
            if(targetValue) {
                object.evaluationValues.push({
                    TYPE :"TA",
                    FIXED : null,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : targetValue,
                    ODATA_PROPERTY : null
                });
            }
            if(CLValue) {
                object.evaluationValues.push({
                    TYPE :"CL",
                    FIXED : CLValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(CHValue) {
                object.evaluationValues.push({
                    TYPE :"CH",
                    FIXED : CHValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(WLValue) {
                object.evaluationValues.push({
                    TYPE :"WL",
                    FIXED : WLValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(WHValue) {
                object.evaluationValues.push({
                    TYPE :"WH",
                    FIXED : WHValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(object.evaluationValues.length == 0) {
                object.evaluationValues = null;
            }
            sCallback.call(this, object);
        } else {
            if(!modelData.TITLE.trim()) {
                fCallback.call(this, {errorMessage : this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_TITLE_MISSING")});
                return;
            }
            object.title  = modelData.TITLE.trim();
            object.evaluationValues = [];
            var targetValue = modelData.TA ? modelData.TA.trim() : null;
            var CLValue = modelData.CL ? modelData.CL.trim() : null;
            var CHValue = modelData.CH ? modelData.CH.trim() : null;
            var WLValue = modelData.WL? modelData.WL.trim() : null;
            var WHValue = modelData.WH? modelData.WH.trim() : null;
            if(targetValue) {
                object.evaluationValues.push({
                    TYPE :"TA",
                    FIXED : targetValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(CLValue) {
                object.evaluationValues.push({
                    TYPE :"CL",
                    FIXED : CLValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(CHValue) {
                object.evaluationValues.push({
                    TYPE :"CH",
                    FIXED : CHValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(WLValue) {
                object.evaluationValues.push({
                    TYPE :"WL",
                    FIXED : WLValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(WHValue) {
                object.evaluationValues.push({
                    TYPE :"WH",
                    FIXED : WHValue,
                    ID : this.evaluationApi.getId(),
                    COLUMN_NAME : null,
                    ODATA_PROPERTY : null
                });
            }
            if(object.evaluationValues.length ==0) {
                object.evaluationValues = null;
            }
            sCallback.call(this, object);
        }
    },
    _addTileToHomePage : function(chipId) {
    	var that = this;
        var oBookmarkService = sap.ushell.Container.getService("Bookmark");
        var categoryId = null ; //Adds to Default Group (My Home)
        oBookmarkService.addCatalogTileToGroup(chipId, categoryId, {
            baseUrl : "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata",
            remoteId : "HANA_CATALOG"
        }).done(function() {
        	sap.m.MessageToast.show(that.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_ADDED_TO_HOME_SUCCESSFULLY"));
            jQuery.sap.log.info("Tile Added to HOME");
        }).fail(function(oError) {
        	sap.m.MessageToast.show(that.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_ADD_TO_HOME_FAILED"));
            jQuery.sap.log.error("Failed to add tile to home : "+oError);
        });
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
    publishTile : function(callback) {
    	var that = this;
        this.validate(function(tObject) {
        	var oCatalogService = sap.suite.ui.smartbusiness.Adapter.getService("CatalogServices");
            var response  = oCatalogService.savePersonalizedTile({
                evaluationId : this.evaluationApi.getId(),
                tileType : this.drilldownController.TILE_TYPE,
                dimension : this.drilldownController.DIMENSION,
                additionalFilters : this.drilldownController.getAdditionFiltersForChipConfiguration(),
                evaluationValues : tObject.evaluationValues ? tObject : null,
                title : tObject.title,
                sapSystem : this.SAP_SYSTEM,
                success: function(response) {
                	sap.m.MessageToast.show(that.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_CREATED_SUCCESSFULLY"));
                    callback.call();
                    that._addTileToHomePage(response.chipId);
                    that._notifyShell(response.chipId);
                },
                error: function(response) {
                	 jQuery.sap.log.error(response.message);
                     sap.m.MessageToast.show(that.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_CREATION_FAILED"));
                     callback.call();
                }
            });
//            if(response.status == 'Success') {
//                
//            } else {
//               
//            }
        }, function(oError){
            sap.m.MessageBox.show(oError.errorMessage,null,this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_HEADER"))
        });
    }, 
    
    _validateEvaluationValues: function(modelData) {
		var values = [];
		var errors = [];
		var score = 0;
		var duplicates = {};
		if(modelData.CL || modelData.CL === 0) {
			values.push({key: "CL", value: modelData.CL, score: score++});
		}
		if(modelData.WL || modelData.WL === 0) {
			values.push({key: "WL", value: modelData.WL, score: score++});
		}
		if(modelData.TA || modelData.TA === 0) {
			values.push({key: "TA", value: modelData.TA, score: score++});
		}
		if(modelData.WH || modelData.WH === 0) {
			values.push({key: "WH", value: modelData.WH, score: score++});
		}
		if(modelData.CH || modelData.CH === 0) {
			values.push({key: "CH", value: modelData.CH, score: score++});
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
	
	_areEvaluationValuesNumber: function(modelData) {
		 
		 var errors = [];
		 if (isNaN(modelData.CL) || isNaN(modelData.CH)) {
			errors.push("CRITICAL");
		 }
		 if (isNaN(modelData.WL) || isNaN(modelData.WH)) {
				errors.push("WARNING");
			 }
		 if (isNaN(modelData.TA)) {
				errors.push("TARGET");
		 }
		 
		return errors;
		 
	 },
	 
    onAfterRendering : function() {
        
    }
});