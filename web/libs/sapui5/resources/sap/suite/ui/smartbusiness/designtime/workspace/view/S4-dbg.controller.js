/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/workspace/view/workspaceStyling.css");
sap.ui.getCore().loadLibrary("sap.suite.ui.commons");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.DrilldownConfiguration")
sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.workspace.view.S4", {
       
       onInit : function() {
          var that = this;
          this.errorMessages = [];
          this.errorModel =  new sap.ui.model.json.JSONModel();
          this.errorModel.setData(this.errorMessages);
          this.errorState = false;
          this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
          var view = this.getView();
          
          this.oApplicationFacade.evaluationDetails = [];
		  this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
		  if(this.metadataRef.getPlatform() == sap.suite.ui.smartbusiness.Configuration.Constants.Platform.ABAP) {
			this.isPlatformABAP = true;
		  }else {
			this.isPlatformABAP = false;
		  }
          this.initializeDrillDownViewPopover();
          this._addColumnsToTable();
          this.settingModel =sap.ui.getCore().getModel("SB_APP_SETTING") || new sap.ui.model.json.JSONModel();
          sap.ui.getCore().setModel(this.settingModel,"SB_APP_SETTING");
          this.getView().setModel(sap.ui.getCore().getModel("SB_APP_SETTING"),"SB_APP_SETTING");
          this.oRouter.attachRouteMatched(function(evt) {
        	  if (evt.getParameter("name") === "evalDetail") {
        		  that.byId("tilePanel").setExpanded(false);
        		  that.byId("drilldownPanel").setExpanded(false);
        		  
        		  
        		  var context = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").contextPath));
        		  var evalContext = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").evalPath));

        		  //For binding trend *********************************************************************************
        		  that.context = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").contextPath));
        		  that.evalContext = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").evalPath));

        		  that.evalPath = evt.getParameter("arguments").evalPath;
        		  that.contextPath = evt.getParameter("arguments").contextPath;

        		  var model = new sap.ui.model.json.JSONModel();
        		  var currentEvaluationData = null;
        		  
        		  if(!(that.oApplicationFacade.evaluationData) || !(that.oApplicationFacade.evaluationIndex)) {
        			  var indicatorData = that.metadataRef.getKPIById({context:that.context, evaluations:true, noIndicator: true, model:that.oApplicationFacade.getODataModel()});
        			  that.oApplicationFacade.evaluationData = indicatorData.EVALUATIONS;
        			  var currentEvalId = that.evalPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
        			  var currentEvalState = ((that.evalPath.indexOf("IS_ACTIVE=0") != -1) || (that.evalPath.indexOf("IS_ACTIVE=1") != -1)) ? ((that.evalPath.indexOf("IS_ACTIVE=0") != -1) ? 0 : 1) : null;
        			  for(var i=0,l=indicatorData.EVALUATIONS.length; i<l; i++) {
        				  if(indicatorData.EVALUATIONS[i].ID == currentEvalId && indicatorData.EVALUATIONS[i].IS_ACTIVE == currentEvalState) {
        					  that.oApplicationFacade.evaluationIndex = i;
        					  break;
        				  }
        			  }
        		  }
        		  
        		  if(that.oApplicationFacade.evaluationDetails && that.oApplicationFacade.evaluationDetails[that.oApplicationFacade.evaluationIndex]) {
        			  currentEvaluationData = that.oApplicationFacade.evaluationDetails[that.oApplicationFacade.evaluationIndex];
        		  }
        		  else {
        			  currentEvaluationData = that.metadataRef.getEvaluationById({context:that.evalContext, tags:true, properties:true, filters:true, values:true, noEvaluation: true,texts:true, texts_for_chips:true, model:that.oApplicationFacade.getODataModel()});
            		  currentEvaluationData.EVALUATION = that.oApplicationFacade.evaluationData[that.oApplicationFacade.evaluationIndex];
        			  currentEvaluationData.FILTERS_IP = that.formObjectForInputParametersAndFilters({results:currentEvaluationData.FILTERS}).EVALUATION_FILTERS;
            		  currentEvaluationData.VALUES_OBJ = that.formObjectForTrendThreshold(currentEvaluationData.EVALUATION,currentEvaluationData.VALUES);
            		  that.oApplicationFacade.evaluationDetails[that.oApplicationFacade.evaluationIndex] = currentEvaluationData;
        		  }
        		  currentEvaluationData.CHIPS=[];
        		  currentEvaluationData.DRILLDOWN = {ISLOADED:false};
        		  model.setData(currentEvaluationData);
        		  that.getView().setModel(model,"evaluation");
        		  that.modelRef = model;
        		  that.hideShow(model.getData().EVALUATION.GOAL_TYPE);
        		  //that.updateFooterButtons(model.getData().EVALUATION);
        	  }
          }, this);

       },
       
       formObjectForTrendThreshold : function(evaluationContextObj, evaluationValues){
          var obj = {TA:null, TC:null, RE:null, CL:null, CH:null, WL:null, WH:null};
          for(var i=0,l=evaluationValues.length; i<l; i++) {
                 if((evaluationContextObj.VALUES_SOURCE == "FIXED") || (!(evaluationContextObj.VALUES_SOURCE))) {
                        obj[evaluationValues[i]["TYPE"]] = evaluationValues[i]["FIXED"];
                 }
                 else if(evaluationContextObj.VALUES_SOURCE == "MEASURE") {
                        obj[evaluationValues[i]["TYPE"]] = evaluationValues[i]["COLUMN_NAME"];
                 }
                 else if(evaluationContextObj.VALUES_SOURCE == "RELATIVE") {
                	if(evaluationValues[i]["TYPE"] == "TA" || evaluationValues[i]["TYPE"] == "TC" || evaluationValues[i]["TYPE"] == "RE"){
                		obj[evaluationValues[i]["TYPE"]] = evaluationValues[i]["COLUMN_NAME"];
         			}
         			else{
         				obj[evaluationValues[i]["TYPE"]] = evaluationValues[i]["FIXED"]+"%";
         			}
                 }
          }
          if(evaluationContextObj) {
                 obj.GOAL_TYPE = evaluationContextObj.GOAL_TYPE;
          }
          else {
                 obj.GOAL_TYPE = null;
          }

          obj.VALUES_SOURCE = evaluationContextObj.VALUES_SOURCE || "FIXED";
          return obj;
       },
       
       formObjectForInputParametersAndFilters: function(listOfFilters){
          var obj = {EVALUATION_FILTERS:[]}, firstOcc=0, isBetween=0;
          var inputParameterObjectUnSorted = {};
          var inputParameterArraySorted = [];
          var filtersArray = [];
          var i,j, valuesStr = '', tempObj={};
           var tempName,tempOperator;
           var visited = new Array(listOfFilters.results.length);
           for(i=0;i<listOfFilters.results.length;i++){
        	   visited[i] = 0;
           }
           for(i=0;i<listOfFilters.results.length;i++){
        	   firstOcc = 0;
        	   valuesStr = '';
        	   tempName = (listOfFilters.results && listOfFilters.results.length) ? listOfFilters.results[i].NAME : "";
               tempOperator = (listOfFilters.results && listOfFilters.results.length) ? listOfFilters.results[i].OPERATOR : "";
                for(j=i;j<listOfFilters.results.length;j++){
                	if(listOfFilters.results[j].NAME == tempName && listOfFilters.results[j].OPERATOR == tempOperator && tempOperator!="BT"){
                		tempObj = {};
                        valuesStr += listOfFilters.results[j].VALUE_1 + ",";
                        tempObj = {"ID":listOfFilters.results[j].ID, "IS_ACTIVE":listOfFilters.results[j].IS_ACTIVE, "NAME":listOfFilters.results[j].NAME, "OPERATOR":listOfFilters.results[j].OPERATOR, "TYPE":listOfFilters.results[j].TYPE, "VALUES":valuesStr, "VALUE_2":null};
                        visited[j] = 1;
                	}
                	else if(listOfFilters.results[j].NAME == tempName && listOfFilters.results[j].OPERATOR == tempOperator && tempOperator=="BT"){
                		tempObj = {};
                		tempObj = {"ID":listOfFilters.results[j].ID, "IS_ACTIVE":listOfFilters.results[j].IS_ACTIVE, "NAME":listOfFilters.results[j].NAME, "OPERATOR":listOfFilters.results[j].OPERATOR, "TYPE":listOfFilters.results[j].TYPE, "VALUES":listOfFilters.results[j].VALUE_1, "VALUE_2":listOfFilters.results[j].VALUE_2};
                		visited[j] = 1;
                	}
                	else{
                		if(firstOcc == 0 && visited[j]==0){
                			i=j-1;
                			visited[j] = 1;
                			firstOcc = 1;
                		}
                	}
                }
                if(tempObj.VALUES){
                	if(tempObj.OPERATOR != "BT"){
                		tempObj.VALUES = tempObj.VALUES.substring(0,tempObj.VALUES.length-1);  //Remove the last comma
                	}
               	 obj.EVALUATION_FILTERS.push(tempObj);
                }
           }
           
           
           try{
        	   var evalData = this.oApplicationFacade.evaluationData[this.oApplicationFacade.evaluationIndex];
        	   var entitySet =  evalData.ODATA_ENTITYSET;
        	   var dataSource =  this._appendSystemAlias(evalData.ODATA_URL);
        	   this.oData4SAPAnalyticsModel = new sap.ui.model.analytics.odata4analytics.Model(new sap.ui.model.analytics.odata4analytics.Model.ReferenceByURI(dataSource), null);
        	   this.queryResultObj = this.oData4SAPAnalyticsModel.findQueryResultByName(entitySet);
        	   var inputParametersObj = this.queryResultObj.getParameterization();
        	   var inputParameters = [];
        	   var inputParametersNames = inputParametersObj.getAllParameters();
        	   var sapClient = {};
				for ( var key in inputParametersNames) {
					var name = inputParametersNames[key].getName();
					var propertyType = inputParametersNames[key].getProperty().type;
					var optional = inputParametersNames[key].isOptional();
					if(name=== "P_SAPClient" || name === "V_SAPClient" || name === "SAPClient"){
						sapClient = {
								name : name
						}
					}
					else{
						var newObj = {
								name : name
						};
						inputParameters.push(newObj);
					}
				}
				if(sapClient){
					inputParameters.push(sapClient);
				}
				for(i=0;i<obj.EVALUATION_FILTERS.length;i++){
					if(obj.EVALUATION_FILTERS[i].TYPE == "PA"){
						inputParameterObjectUnSorted[obj.EVALUATION_FILTERS[i].NAME] =  obj.EVALUATION_FILTERS[i];
					}
					else{
						filtersArray.push(obj.EVALUATION_FILTERS[i]);
					}
				}
				for(i=0;i<inputParameters.length;i++){
					inputParameterArraySorted.push(inputParameterObjectUnSorted[inputParameters[i].name]);
				}
           }
           catch(err){
				for(i=0;i<obj.EVALUATION_FILTERS.length;i++){
					if(obj.EVALUATION_FILTERS[i].TYPE == "PA"){
						inputParameterArraySorted.push(obj.EVALUATION_FILTERS[i]);
					}
					else{
						filtersArray.push(obj.EVALUATION_FILTERS[i]);
					}
				}
           }
           obj.EVALUATION_FILTERS = inputParameterArraySorted;
           obj.EVALUATION_FILTERS = obj.EVALUATION_FILTERS.concat(filtersArray);
           return obj;
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
       
       formatOwnerName: function(ownerName){
    	   var that = this;
    	   if(ownerName==null || ownerName==""){
    		   return "";
    	   }
    	   else{
    		   return sap.suite.ui.smartbusiness.lib.formatters.getBundleText(undefined, "OWNER", ownerName);
    	   }
       },
       
       formatGoalType: function(goalType) {
          var that = this;
          var goalTypeText = null;
          switch(goalType) {
          case 'MA': goalTypeText = that.oApplicationFacade.getResourceBundle().getText("MAXIMIZING"); break;
          case 'MI': goalTypeText = that.oApplicationFacade.getResourceBundle().getText("MINIMIZING"); break;
          case 'RA': goalTypeText = that.oApplicationFacade.getResourceBundle().getText("RANGE"); break;
          default : goalTypeText = that.oApplicationFacade.getResourceBundle().getText("NONE");
          }
          return goalTypeText;
       },
       formatThresholdCriticalHigh: function(goalType){
    	   var that = this;
    	   var thresholdText = null;
    	   goalType = goalType || 'RA';
           switch(goalType) {
           case 'MI': thresholdText = that.oApplicationFacade.getResourceBundle().getText("CRITICAL"); break;
           case 'RA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("CRITICAL_HIGH"); break;
           default : thresholdText = that.oApplicationFacade.getResourceBundle().getText("NONE");
           }
           return thresholdText;
       },
       formatThresholdWarningHigh: function(goalType){
    	   var that = this;
    	   var thresholdText = null;
    	   goalType = goalType || 'RA';
           switch(goalType) {
           case 'MI': thresholdText = that.oApplicationFacade.getResourceBundle().getText("WARNING"); break;
           case 'RA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("WARNING_HIGH"); break;
           default : thresholdText = that.oApplicationFacade.getResourceBundle().getText("NONE");
           }
           return thresholdText;
       },
       formatThresholdWarningLow: function(goalType){
    	   var that = this;
    	   var thresholdText = null;
    	   goalType = goalType || 'RA';
           switch(goalType) {
           case 'MA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("WARNING"); break;
           case 'RA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("WARNING_LOW"); break;
           default : thresholdText = that.oApplicationFacade.getResourceBundle().getText("NONE");
           }
           return thresholdText;
       },
       formatThresholdCriticalLow: function(goalType){
    	   var that = this;
    	   var thresholdText = null;
    	   goalType = goalType || 'RA';
           switch(goalType) {
           case 'MA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("CRITICAL"); break;
           case 'RA': thresholdText = that.oApplicationFacade.getResourceBundle().getText("CRITICAL_LOW"); break;
           default : thresholdText = that.oApplicationFacade.getResourceBundle().getText("NONE");
           }
           return thresholdText;
       },

       formatProperties: function(name, value) {
    	   return ((this.getView().byId("properties").getItems().length > 1) ? (', ' + name + ' : ' + value) : (name + ' : ' + value));
       },

       formatOperator: function(operatorType) {
    	   var that = this;
    	   var operatorTypeText = null;
    	   switch(operatorType) {
    	   case 'EQ' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("EQUAL_TO"); break;
    	   case 'GT' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("GREATER_THAN"); break;
    	   case 'LT' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("LESS_THAN"); break;
    	   case 'NE' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("NOT_EQUAL_TO"); break;
    	   case 'BT' : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("BETWEEN"); break;
    	   case undefined : operatorTypeText = null; break;
    	   default : operatorTypeText = that.oApplicationFacade.getResourceBundle().getText("NONE");
    	   }
    	   return operatorTypeText;
       },

       formatTypeOfFilter: function(inputType) {
    	   var that = this;
    	   var parameterTypeText = null;
    	   switch(inputType) {
    	   case 'FI' : parameterTypeText = that.oApplicationFacade.getResourceBundle().getText("FILTER"); break;
    	   case 'PA' : parameterTypeText = that.oApplicationFacade.getResourceBundle().getText("INPUT_PARAMETER"); break;
    	   case undefined : operatorTypeText = null; break;
    	   default : parameterTypeText = that.oApplicationFacade.getResourceBundle().getText("NONE");
    	   }
    	   return parameterTypeText;
       },

       getHeaderFooterOptions : function() {
    	   var that = this;
    	   this.oHeaderFooterOptions = {
    			   bSuppressBookmarkButton: {},
    			   onBack: function(){
    				   var hash = window.location.hash.replace("evalDetail","detail");
    				   sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({hash:hash.substr(0,hash.lastIndexOf("/"))}, true);
    			   },
    			   oUpDownOptions : {
    				   sI18NDetailTitle: "ITEM_DETAIL_HEADER",
    				   iPosition : 0,
    				   iCount : 0,
    				   fSetPosition : function (iNewPosition) {
    					   that.oApplicationFacade.evaluationIndex = iNewPosition;
    					   var nextEvalContextPath = "EVALUATIONS_MODELER(ID='" + that.oApplicationFacade.evaluationData[iNewPosition].ID + "',IS_ACTIVE=" + that.oApplicationFacade.evaluationData[iNewPosition].IS_ACTIVE + ")";
    					   var view = that.getView();
    					   that.oHeaderFooterOptions.oUpDownOptions.iPosition = that.oApplicationFacade.evaluationIndex;
    					   that.oHeaderFooterOptions.oUpDownOptions.iCount = that.oApplicationFacade.evaluationData.length;
    					   that.setHeaderFooterOptions(that.oHeaderFooterOptions);
    					   that.getHeaderFooterOptions();
    					   sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({action: "SBWorkspace", route: "evalDetail", context: (that.contextPath + "/" + nextEvalContextPath)});
    				   }
    			   },
    			   buttonList : that.getAllFooterButtons()
    	   };
    	   that.oHeaderFooterOptions.oUpDownOptions.iPosition = that.oApplicationFacade.evaluationIndex;
    	   that.oHeaderFooterOptions.oUpDownOptions.iCount = that.oApplicationFacade.evaluationData.length;
    	   that.setHeaderFooterOptions(that.oHeaderFooterOptions);
    	   that.updateFooterButtons(that.oApplicationFacade.evaluationData[that.oApplicationFacade.evaluationIndex]);
    	   return this.oHeaderFooterOptions;
       },

       formatEvalStatus: function(state, count) {
    	   var that = this;
    	   var isActive = "";
    	   if(count > 1) {
    		   isActive = (that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE") + "," + that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT"));
    	   }
    	   else if(state){
    		   isActive = that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE");
    	   }
    	   else {
    		   isActive = that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW");
    	   }
    	   return isActive;
       }, 
       
     //Binding of Evaluation values
       hideShow: function(goalType){
           var that = this;
           if(goalType=="MA"){
                  that.byId("CHlabel").setVisible(false);
                  that.byId("CHinput").setVisible(false);
                  
                  that.byId("WHlabel").setVisible(false);
                  that.byId("WHinput").setVisible(false);  
                  
                  that.byId("WLlabel").setVisible(true);
                  that.byId("WLinput").setVisible(true);
                  
                  that.byId("CLlabel").setVisible(true);
                  that.byId("CLinput").setVisible(true);
           }
           else if(goalType=="MI"){
                  that.byId("WLlabel").setVisible(false);
                  that.byId("WLinput").setVisible(false);
                  
                  that.byId("CLlabel").setVisible(false);
                  that.byId("CLinput").setVisible(false);
                  
                  that.byId("CHlabel").setVisible(true);
                  that.byId("CHinput").setVisible(true);
                  
                  that.byId("WHlabel").setVisible(true);
                  that.byId("WHinput").setVisible(true);  
           }
           else{
                  that.byId("WLlabel").setVisible(true);
                  that.byId("WLinput").setVisible(true);
                  
                  that.byId("CLlabel").setVisible(true);
                  that.byId("CLinput").setVisible(true);
                  
                  that.byId("CHlabel").setVisible(true);
                  that.byId("CHinput").setVisible(true);
                  
                  that.byId("WHlabel").setVisible(true);
                  that.byId("WHinput").setVisible(true);
           }
        },

       
       onAfterAllEvaluationContexts: function() {
          var that = this;
          
       },

       formatFavoriteMark: function(favMark) {
          return ((favMark) ? true : false);
       },

       getAllFooterButtons : function() {
          var that = this;
          return [/*{
	          	  sI18nBtnTxt : "Error",
	              sId : "errorBtn",
	              icon : "sap-icon://alert",
	              enabled : false,
	              onBtnPressed : function(event){
	                        sap.suite.ui.smartbusiness.lib.Util.utils.handleMessagePopover(event,that);
	              }              
	          	},*/{
                 sId: "activateButton",
                 sI18nBtnTxt : "ACTIVATE",
                 onBtnPressed : function(evt) {
                	 that.errorMessages=[];
                        var log = that.checkForMandatoryParametersForEvaluation();
                        ///Adapter Implementation ---->>
                        var evalTextFetchCallBack = function(data) {
                        	if(!(data && data.length)) {
                      		   log.error.push(that.oApplicationFacade.getResourceBundle().getText("ERROR_ENTER_EVALUATION_TITLE"));
                      	   }
                        };
                        
                        var evalTextFetchErrCallBack = function(err) {
                        	sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
                        	that.errorMessages.push({
                                "type":"Error",
                                "title":that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"),
                                "description":  err.response.body
                            });
                            sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 
                        };
                        
                        that.metadataRef.getDataByEntity({entity:"EVALUATION_TEXTS", filter:"ID eq '"+that.getView().getModel("evaluation").getData().EVALUATION.ID + "' and IS_ACTIVE eq 0 and TITLE ne ''", async:false, success:evalTextFetchCallBack, error:evalTextFetchErrCallBack, model:that.oApplicationFacade.getODataModel()});
                        
                        if(log.error.length) {
                              var errMsg = "";
                              for(var i=0,l=log.error.length; i<l; i++) {
                                     errMsg += errMsg ? "\n" : "";
                                     errMsg += that.oApplicationFacade.getResourceBundle().getText(log.error[i]);
                              }
                              sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"), errMsg);
                              that.errorMessages.push({
                                  "type":"Error",
                                  "title":that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"),
                                  "description":  errMsg
                              });
                              sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);   
                        }
                        else {
                        	  if(log.warning.length) {
                        		  var warnMsg = "";
                                  for(var i=0,l=log.warning.length; i<l; i++) {
                                         warnMsg += warnMsg ? "\n" : "";
                                         warnMsg += that.oApplicationFacade.getResourceBundle().getText(log.warning[i]);
                                  }
                                  
                                  var backDialog = new sap.m.Dialog({
              						icon:"sap-icon://warning2",
              						title:that.oApplicationFacade.getResourceBundle().getText("WARNING"),
              						state:"Warning",
              						type:"Message",
              						content:[new sap.m.Text({text:warnMsg + "\n\n" + that.oApplicationFacade.getResourceBundle().getText("WARNING_EV_ACTIVATE")})],
              						beginButton: new sap.m.Button({
              							text:that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
              							press: function(){
              								backDialog.close();
              								that.activateEvaluation();
              							}
              						}),
              						endButton: new sap.m.Button({
              							text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
              							press:function(){
              								backDialog.close();
              							}
              						})   	                                           
              					});
              					backDialog.open();
                        	  }	
                        	  else {
                        		  that.activateEvaluation(); 
                        	  }
                        }
                 }
          }, {
                 sId: "favouriteToggleButton",
                 sI18nBtnTxt : "ADD_FAVOURITE",
                 onBtnPressed : function(evt) {
                		that.errorMessages=[];
                        var path = "/FAVOURITES";
                        var contextObj = that.getView().getModel("evaluation").getData().EVALUATION;
                        var oDataModel = that.oApplicationFacade.getODataModel(); 
                        var payload = {ID:contextObj.ID, TYPE:contextObj.ENTITY_TYPE, USER_ID:that.oApplicationFacade.currentLogonHanaUser, MANUAL_ENTRY:1, LAST_WORKED_ON:null};
                        if(contextObj.MANUAL_ENTRY) {
                        	//odata remove
//                              path += "(ID='" + contextObj.ID + "',TYPE='" + contextObj.ENTITY_TYPE + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')";
//                              oDataModel.remove(path,null,function(data) {
//                                     sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_SUCCESS"));
//                                     oDataModel.refresh();
//                                     contextObj.MANUAL_ENTRY = 0;
//                                     that.updateFooterButtons(contextObj);
//                              }, function(err) {
//                                     sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"), err.response.body);
//                              });
                        	
                        	//xsjs remove
                        	that.metadataRef.remove("EVALUATION_FAVOURITE",payload,function(data) {
                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_SUCCESS"));
                        		contextObj.MANUAL_ENTRY = null;
                           		that.updateFooterButtons(contextObj);
                           		that.getView().getModel("evaluation").getData().EVALUATION = contextObj;
                           		that.getView().getModel("evaluation").setData(that.getView().getModel("evaluation").getData());
                        		//oDataModel.refresh();
                        		that.refreshMasterList();
                        		that.setBtnText("favouriteToggleButton",that.oApplicationFacade.getResourceBundle().getText("ADD_FAVOURITE"));
                        	}, function(err) {
                        		sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"), err.responseText);
                        		that.errorMessages.push({
                                    "type":"Error",
                                    "title":that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"), 
                                    "description":  err.responseText
                                });
                                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 
                        	});
                        }
                        else if(contextObj.MANUAL_ENTRY == 0) {
                        	// odata update
//                              path += "(ID='" + contextObj.ID + "',TYPE='" + contextObj.ENTITY_TYPE + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')";
//                              oDataModel.update(path,payload,null,function(data) {
//                                     sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_SUCCESS"));
//                                     oDataModel.refresh();
//                                     contextObj.MANUAL_ENTRY = 1;
//                                     that.updateFooterButtons(contextObj);
//                              }, function(err) {
//                                     sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"), err.response.body);
//                              });
                        	
                        	//xsjs update
                        	that.metadataRef.update("EVALUATION_FAVOURITE",payload,null,function(data) {
                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_SUCCESS"));
                        		contextObj.MANUAL_ENTRY = 1;
                        		that.updateFooterButtons(contextObj);
                        		that.getView().getModel("evaluation").getData().EVALUATION = contextObj;
                           		that.getView().getModel("evaluation").setData(that.getView().getModel("evaluation").getData());
                        		//oDataModel.refresh();
                        		that.refreshMasterList();
                        		that.setBtnText("favouriteToggleButton",that.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE"));
                        	}, function(err) {
                        		sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"), err.responseText);
                        		that.errorMessages.push({
                                    "type":"Error",
                                    "title":that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_DELETE_ERROR"),
                                    "description":  err.responseText
                                });
                                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 
                        	});
                        }
                        else if(contextObj.MANUAL_ENTRY == null) {
                        	//odata create
//                              oDataModel.create(path,payload,null,function(data) {
//                                     sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_SUCCESS"));
//                                     oDataModel.refresh();
//                                     contextObj.MANUAL_ENTRY = 1;
//                                     that.updateFooterButtons(contextObj);
//                              }, function(err) {
//                                     sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_ERROR"), err.response.body);
//                              });
                        	
                        	//xsjs create
                        	that.metadataRef.update("EVALUATION_FAVOURITE",payload,null,function(data) {
                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_SUCCESS"));
                        		contextObj.MANUAL_ENTRY = 1;
                        		that.updateFooterButtons(contextObj);
                        		that.getView().getModel("evaluation").getData().EVALUATION = contextObj;
                           		that.getView().getModel("evaluation").setData(that.getView().getModel("evaluation").getData());
                        		//oDataModel.refresh();
                        		that.refreshMasterList();
                        		that.setBtnText("favouriteToggleButton",that.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE"));
                        	}, function(err) {
                        		sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_ERROR"), err.responseText);
                        		that.errorMessages.push({
                                    "type":"Error",
                                    "title":that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_EV_ERROR"),
                                    "description":  err.responseText
                                });
                                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 
                        	});
                        }
                        contextObj.MANUAL_ENTRY ? evt.getSource().setText(that.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE"))
                                     : evt.getSource().setText(that.oApplicationFacade.getResourceBundle().getText("ADD_FAVOURITE"));
                 }             
          }, {
                 sId: "editButton",
                 sI18nBtnTxt : "EDIT",
                 onBtnPressed : function(evt) {
                	 that.errorMessages=[];
                	 var evalPath = "/" + that.evalPath;
                	 evalPath = (that.getView().getModel("evaluation").getData().EVALUATION.COUNTER == 2) ? evalPath.replace("IS_ACTIVE=1","IS_ACTIVE=0") : evalPath;
                	 if(that.getView().getModel("evaluation").getData().EVALUATION.COUNTER == 2){
                		 sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "createSBKPIEvaluation", route: "editEvaluationDraft", context: (that.contextPath.replace("INDICATORS_MODELER","INDICATORS") + evalPath.replace("EVALUATIONS_MODELER","EVALUATIONS"))});
                	 }
                	 else if(that.getView().getModel("evaluation").getData().EVALUATION.COUNTER == 1){
                		 sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "createSBKPIEvaluation", route: "editEvaluation", context: (that.contextPath.replace("INDICATORS_MODELER","INDICATORS") + evalPath.replace("EVALUATIONS_MODELER","EVALUATIONS"))});
                	 }
                 }
          }, {
                 sId: "deleteButton",
                 sI18nBtnTxt : "DELETE_BUTTON_TEXT",
                 onBtnPressed : function(evt) {
                	 that.errorMessages=[];
                	 	if(!(sap.m.MessageBox)) {
                	 		jQuery.sap.require("sap.m.MessageBox");
                	 	}
                        sap.m.MessageBox.show(
                                     that.oApplicationFacade.getResourceBundle().getText("WARNING_SINGLE_EVALUATION_DELETE"),
                                     "sap-icon://hint",
                                     that.oApplicationFacade.getResourceBundle().getText("DELETE_BUTTON_TEXT"),
                                     [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
                                     function(evt){
                                            if(evt=="OK"){
                                            	var ODataModel = that.oApplicationFacade.getODataModel();
                                            	var payloads = [];
                                            	payloads.push({ID:that.getView().getModel("evaluation").getData().EVALUATION.ID,IS_ACTIVE:that.getView().getModel("evaluation").getData().EVALUATION.IS_ACTIVE});
                                            	//odata remove
//                                            	var entity = "EVALUATIONS" + that.getView().getBindingContext().sPath.substr(1).substr(that.getView().getBindingContext().sPath.substr(1).indexOf("("));
//                                            	ODataModel.remove(entity,null,function(data){
//                                            		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_EV_SUCCESS"));
//                                            		ODataModel.refresh();
//                                            		window.history.back();
//                                            	},
//                                            	function(err){
//                                            		sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_EV_ERROR"), err.response.body);
//                                            	});
                                            	
                                            	//xsjs remove
                                            	that.metadataRef.remove("EVALUATION",payloads,function(data){
                                            		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_EV_SUCCESS"));
                                            		//ODataModel.refresh();
                                            		that.refreshMasterList();
                                            		var hash = window.location.hash.replace("evalDetail","detail");
                                            		sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({hash:hash.substr(0,hash.lastIndexOf("/"))}, true);
                                            	},
                                            	function(err){
                                            		sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_EV_ERROR"), err.responseText);
                                            		that.errorMessages.push({
                                                        "type":"Error",
                                                        "title":that.oApplicationFacade.getResourceBundle().getText("DELETE_EV_ERROR"),
                                                        "description":  err.responseText
                                                    });
                                                    sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 

                                            	});
                                            }
                                            if(evt=="CANCEL"){
                                                   
                                            }

                                     });
                 }
          }, {
                sId: "duplicateButton",
                sI18nBtnTxt : "DUPLICATE",
                onBtnPressed : function(evt) {
                	that.errorMessages=[];
                	//sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "createSBKPIEvaluation", route: "duplicateEvaluation", context: (that.contextPath.replace("INDICATORS_MODELER","INDICATORS")+"/" + that.evalPath.replace("EVALUATIONS_MODELER","EVALUATIONS"))});
                	this.duplicateEvalDialog = this.duplicateEvalDialog || that.createDuplicateDialog();
                	this.duplicateEvalDialog.setContentHeight("350px");
                	that.vBoxForIdPrefixText.setVisible(true);
                	that.prefixInput.setValue();
                	that.prefixInput.setValueState("None");
        	        that.prefixForm.setVisible(true);
                	if(!that.settingModel.getData().ID_VISIBLE){
                		that.vBoxForIdPrefixText.setVisible(false);
	        	        that.prefixForm.setVisible(false);
	        	        this.duplicateEvalDialog.setContentHeight("200px");
                	}
                	this.duplicateEvalDialog.open();
                	
                }
           }, {
                 sId: "addTileButton",
                 sI18nBtnTxt : "CONFIGURE_TILE",
                 onBtnPressed : function(evt){ 
                	 that.errorMessages=[];
                	 sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "configureSBKPITile", route: "detail", context: ("EVALUATIONS_MODELER" + that.evalPath.substr(that.evalPath.indexOf("(")))});
                 }
          }, {
                 sId: "drilldownButton",
                 sI18nBtnTxt : "DRILLDOWN_CONFIG",
                 onBtnPressed : function(evt) {
                	 that.errorMessages=[];
                	 sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "configureSBKPIDrilldown", route: "detail", context: ("EVALUATIONS_MODELER" + that.evalPath.substr(that.evalPath.indexOf("(")))});
                 }
          }, {
                 sId: "authUsersButton",
                 sI18nBtnTxt : "AUTH_USERS",
                 onBtnPressed : function(evt) {
                	 that.errorMessages=[];
                	 sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action: "authorizeSBEvaluation", route: "detail", context: (that.evalPath)});
                 }
          }];
       },
       
       createDuplicateDialog : function(){
    	   
    	var that = this;
   		
   		var evalOnlyRadButton = new sap.m.RadioButton({
       		groupName: "DuplicateEval",
       		text: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_EVAL_ONLY"),
       		selected:true
       	});
       	var evalAndEntitiesRadBtn = new sap.m.RadioButton({
       		groupName: "DuplicateEval",
       		text: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_EVAL_AND_ENTITIES")
       		
       	}); 
       	var evalOnlyText = new sap.m.Text({
       		text: that.oApplicationFacade.getResourceBundle().getText("EVAL_ONLY_TEXT")
       	});
       	var evalAndEntitiesText = new sap.m.Text({
       		text: that.oApplicationFacade.getResourceBundle().getText("EVAL_AND_ENTITIES_TEXT")
       	});
       	var generatedIdInfoText = new sap.m.Text({
       		text: that.oApplicationFacade.getResourceBundle().getText("GENERATED_ID_INFO")
       	});
       	var duplicateIdExample = new sap.m.Text({
       		text: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_ID_SAMPLE")
       	});
       	var prefixLabel = new sap.m.Label({
       		text: that.oApplicationFacade.getResourceBundle().getText("ID_PREFIX")
       	});
       	this.prefixInput = new sap.m.Input({
       		type:"Text",
       		maxLength:4,
       		placeholder: that.oApplicationFacade.getResourceBundle().getText("PREFIX_PLACEHOLDER"),
       		showValueHelp: false
       	}).attachLiveChange(function (){
       		that.validatePrefix();
       	});
       	var charLimitText = new sap.m.Text({
       		text: that.oApplicationFacade.getResourceBundle().getText("CHAR_LIMIT"),
       	})
       	var vBoxForEvalOnlyRadButton = new sap.m.VBox({
       		items:[
   			         evalOnlyRadButton,
   			         evalOnlyText
   			         ]
       	});
       	var vBoxForEvalAndEntitiesRadBtn = new sap.m.VBox({
   			items:[
   			         evalAndEntitiesRadBtn,
   			         evalAndEntitiesText
   			         ]
       	});
       	this.vBoxForIdPrefixText = new sap.m.VBox({
       		items:[
       		         generatedIdInfoText,
       		         duplicateIdExample
       		         ]
       	});
   	
       	var okBtn = new sap.m.Button({
   			text:that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_KPI_OK"),
   			press: function(){
   				if(evalOnlyRadButton.getSelected()){
   					if(that.prefixInput.getVisible()){
   						that.metadataRef.create("DUPLICATE_ENTITY",{flag:"EVALUATION-ONLY",id:that.getView().getModel("evaluation").getData().EVALUATION.ID, prefix:that.prefixInput.getValue()}, null,
   	                        	function(success){
   	   								duplicateDialog.close();
   	                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_SUCCESS"));
   	                        		that.refreshMasterList();
   	                        	},
   	                        	function(error){
   	                        		duplicateDialog.close();
   	                        		sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(JSON.parse(error.responseText).errorMessage);
   	                        		that.errorMessages.push({
                                        "type":"Error",
                                        "title":JSON.parse(error.responseText).errorMessage,
                                        "description":  ""
                                    });
                                    sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 
   	                        	});
   						
   					}else{
   						that.metadataRef.create("DUPLICATE_ENTITY",{flag:"EVALUATION-ONLY",id:that.getView().getModel("evaluation").getData().EVALUATION.ID, prefix:""}, null,
   	                        	function(success){
   	   								duplicateDialog.close();
   	                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_SUCCESS"));
   	                        		that.refreshMasterList();
   	                        	},
   	                        	function(error){
   	                        		duplicateDialog.close();
   	                        		sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(JSON.parse(error.responseText).errorMessage);
   	                        		that.errorMessages.push({
                                        "type":"Error",
                                        "title":JSON.parse(error.responseText).errorMessage,
                                        "description":  ""
                                    });
                                    sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 
   	                        	});
   						
   					}
   					
   					
   					
   				}else if(evalAndEntitiesRadBtn.getSelected()){
   					if(that.validatePrefix()){
   						that.metadataRef.create("DUPLICATE_ENTITY",{flag:"EVALUATION",id:that.getView().getModel("evaluation").getData().EVALUATION.ID, prefix:that.prefixInput.getValue()}, null,
   	                        	function(success){
   	   								duplicateDialog.close();
   	                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_SUCCESS"));
   	                        		that.refreshMasterList();
   	                        	},
   	                        	function(error){
   	                        		duplicateDialog.close();
   	                        		sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(JSON.parse(error.responseText).errorMessage);
   	                        		that.errorMessages.push({
                                        "type":"Error",
                                        "title":JSON.parse(error.responseText).errorMessage,
                                        "description":  ""
                                    });
                                    sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 
   	                        	});
   						
   					}else{
   						that.metadataRef.create("DUPLICATE_ENTITY",{flag:"EVALUATION",id:that.getView().getModel("evaluation").getData().EVALUATION.ID, prefix:""}, null,
   	                        	function(success){
   	   								duplicateDialog.close();
   	                        		sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_SUCCESS"));
   	                        		that.refreshMasterList();
   	                        	},
   	                        	function(error){
   	                        		duplicateDialog.close();
   	                        		sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(JSON.parse(error.responseText).errorMessage);
   	                        		that.errorMessages.push({
                                        "type":"Error",
                                        "title":JSON.parse(error.responseText).errorMessage,
                                        "description":  ""
                                    });
                                    sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 
   	                        	});
   						
   					}
             		  
   					
   				}
   			}
   		});
   		var cancelBtn = new sap.m.Button({
   			text: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_KPI_CANCEL"),
   			press: function(){
   				duplicateDialog.close();
   			}
   		});
   		
   		this.prefixForm = new sap.ui.layout.form.SimpleForm({
	        	  editable:true, 
		        	  layout:"ResponsiveGridLayout",
		        	  maxContainerCols:12,
					        labelSpanL:3,
					        labelSpanM:3,
					        labelSpanS:3,
					        columnsL:4,
					        columnsM:4,
					        columnsS:4,
		        	  content : [
								prefixLabel,
								that.prefixInput,
								charLimitText
		        	             ]
		          });
   		
       	var duplicateDialog = new sap.m.Dialog({
       		title: that.oApplicationFacade.getResourceBundle().getText("DUPLICATE_EVAL_DIALOG_TITLE"),
       		//contentHeight:"350px",
       		contentWidth:"100px",
       		verticalScrolling: false,
       		horizontalScrolling: false,
       		content:[
   					new sap.ui.layout.Grid({
   						width:"100%",
   						defaultSpan : "L12 M12 S12",
   						content: [
                       		         vBoxForEvalOnlyRadButton,
                       		         vBoxForEvalAndEntitiesRadBtn,
                       		         that.vBoxForIdPrefixText,
                       		         that.prefixForm
                       		         ]})
       		         ],
       		         beginButton: okBtn,
      					 endButton: cancelBtn
       	});
       	return duplicateDialog;
    	   
       },
       
       validatePrefix : function (){
   		var that=this;
   		this.HANA = "hana";
   		this.CDS = "cds";
   		this.VIEW_MODE = this.HANA;
   		var successStatus = true;
   		var urlParam;
   		if((urlParam = jQuery.sap.getUriParameters().get("viewmode"))) {
   			if(urlParam.toLowerCase && urlParam.toLowerCase() == this.CDS)
   				this.VIEW_MODE = this.CDS;
   		}
   		var prefix = that.prefixInput.getValue();
   		if(!prefix){
   			that.prefixInput.setValueState("None");
   		}
   		 if(this.VIEW_MODE == this.CDS){
   			that.prefixInput.setValue(prefix.toUpperCase());
   		}
   		if (prefix) {
   			/* CDS prefix must begin with PERIOD */
   			if(this.VIEW_MODE == this.CDS && prefix[0] != '.') {
   				//this.kpiIdEval_reason = "NOT_START_WITH_PERIOD";
   				that.prefixInput.setValueState("Error");
   				that.prefixInput.setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_CDS_EVAL_ID_BEGIN_WITH_PERIOD"));
   				successStatus = false;
   			}
   			/* Only CDS prefixs must begin with PERIOD */
   			else if(this.VIEW_MODE == this.HANA && prefix[0] == '.') {
   				//this.kpiIdEval_reason = "_START_WITH_PERIOD";
   				that.prefixInput.setValueState("Error");
   				that.prefixInput.setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_HANA_EVAL_ID_BEGIN_WITH_PERIOD"));
   				successStatus = false;
   			}
   			else if (!(/^[a-zA-Z0-9.]*$/.test(prefix))) {
   				that.prefixInput.setValueState("Error");
   				that.prefixInput.setValueStateText(that.oApplicationFacade.getResourceBundle().getText("ERROR_HANA_ID_PREFIX_NO_SPL_CHAR"));
   				successStatus = false;
   			} else {
   				that.prefixInput.setValueState("None");
   				that.prefixInput.setValueStateText();
   				//successStatus = true;
   			}
   		}
   		return successStatus;
   	},
       
       updateFooterButtons: function(evaluationObj) {
           evaluationObj = evaluationObj || this.getView().getModel("evaluation").getData().EVALUATION;
           var footerAllButtons = this.getAllFooterButtons();

           this.oHeaderFooterOptions.buttonList = [];
           
           
           if(evaluationObj.IS_ACTIVE) {
        	   this.oHeaderFooterOptions.oEditBtn = footerAllButtons[5];
        	   this.oHeaderFooterOptions.buttonList.push(footerAllButtons[6]);
               this.oHeaderFooterOptions.buttonList.push(footerAllButtons[7]);
           }
           else {
        	   this.oHeaderFooterOptions.oEditBtn = footerAllButtons[0];
           }
           
           if(evaluationObj.MANUAL_ENTRY) {
                  footerAllButtons[1].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("REMOVE_FAVOURITE");
           }
           else {
                  footerAllButtons[1].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("ADD_FAVOURITE"); 
           }
           this.oHeaderFooterOptions.buttonList.push(footerAllButtons[1]);
           
           if(evaluationObj.IS_ACTIVE){
           this.oHeaderFooterOptions.buttonList.push(footerAllButtons[4]);
           }
           
           if(evaluationObj.COUNTER == 2) {
                  footerAllButtons[2].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("EDIT_DRAFT");
           }
           else {
                  footerAllButtons[2].sI18nBtnTxt = this.oApplicationFacade.getResourceBundle().getText("EDIT"); 
           }
           this.oHeaderFooterOptions.buttonList.push(footerAllButtons[2]);
           
           this.oHeaderFooterOptions.buttonList.push(footerAllButtons[3]);
           
           this.setHeaderFooterOptions(this.oHeaderFooterOptions);
        },
        
        getConstructorParamForTile:function(sTileType){
        	var oConstructorParam;
        	switch(sTileType){

        	case "NT": oConstructorParam ={
				size:"S",
				value:"0.0",
				scale:"M",
				valueColor:"Good",
				unit:this.oApplicationFacade.getResourceBundle().getText("TILE_CURRENCY"),
				footer:this.oApplicationFacade.getResourceBundle().getText("ACTUAL")

			};
        	break;
        	case "CT": oConstructorParam ={
				scale: "M",
				size:"S",
				data: [new sap.suite.ui.commons.ComparisonData({title:this.oApplicationFacade.getResourceBundle().getText("VALUE_1"), value: 1550}),
				       new sap.suite.ui.commons.ComparisonData({title:this.oApplicationFacade.getResourceBundle().getText("VALUE_2"), value: 219.2}),
				       new sap.suite.ui.commons.ComparisonData({title:this.oApplicationFacade.getResourceBundle().getText("VALUE_3"), value: 66.46})]

			};
        	break;
        	case "AT": oConstructorParam ={
				scale: "M",
				size:"S",
				minValue: 0,
				maxvalue: 312,
				targetValue: 150,
				actual: new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
				thresholds: [new sap.suite.ui.commons.BulletChartData({value:312, color:"Error"}),
				             new sap.suite.ui.commons.BulletChartData({value:200, color:"Critical"})]
			};
        	break;
        	case "TT": oConstructorParam ={

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
			};
        	break;
        	case "CM": oConstructorParam ={
				scale: "M",
				size:"S",
				data: [new sap.suite.ui.commons.ComparisonData({title:this.oApplicationFacade.getResourceBundle().getText("MEASURE_1"), value: 34, color: "Good"}),
				       new sap.suite.ui.commons.ComparisonData({title:this.oApplicationFacade.getResourceBundle().getText("MEASURE_2"), value: 125, color: "Error"}),
				       new sap.suite.ui.commons.ComparisonData({title:this.oApplicationFacade.getResourceBundle().getText("MEASURE_3"), value: 97, color: "Critical"})]

			};
        	break;
        	case "HT": oConstructorParam ={
				total:100,
				size:"S",
				scale: "M",
				items:[new sap.suite.ui.commons.HarveyBallMicroChartItem({
					fraction:30,
					color: "Good"
				})]
			};
        	break;
	
        	}
        	return oConstructorParam;
        },
		getPreviewTile:function(tileType,context){
			var frameType = "OneByOne";
			var tileContent1,tileContent2;
			switch(tileType){
			
				case 'NT': tileContent1 = new sap.suite.ui.commons.NumericContent(this.getConstructorParamForTile(tileType));
							break;
				case 'CT': tileContent1 = new sap.suite.ui.commons.ComparisonChart(this.getConstructorParamForTile(tileType));
							break;
				
				case 'AT':	tileContent1 =  new sap.suite.ui.commons.BulletChart(this.getConstructorParamForTile(tileType));
							break;
				
				case 'TT': 	tileContent1 = new sap.suite.ui.commons.MicroAreaChart(this.getConstructorParamForTile(tileType));
							break;
				
				case 'CM':	tileContent1 =  new sap.suite.ui.commons.ComparisonChart(this.getConstructorParamForTile(tileType));
							break;
				
				case 'HT':	tileContent1 = new sap.suite.ui.commons.HarveyBallMicroChart(this.getConstructorParamForTile(tileType));
							break;
							
				case 'DT-AT': frameType = "TwoByOne";
							  tileContent1 = new sap.suite.ui.commons.NumericContent(this.getConstructorParamForTile("NT"));
							  tileContent2 =  new sap.suite.ui.commons.BulletChart(this.getConstructorParamForTile("AT"));
							  break;
					
				case 'DT-CT' :frameType = "TwoByOne"; 
							  tileContent1 = new sap.suite.ui.commons.NumericContent(this.getConstructorParamForTile("NT"));
							  tileContent2 =  new sap.suite.ui.commons.ComparisonChart(this.getConstructorParamForTile("CT"));
							  break;
					
				case 'DT-CM' :frameType = "TwoByOne";
							  tileContent1 = new sap.suite.ui.commons.NumericContent(this.getConstructorParamForTile("NT"));
							  tileContent2 =  new sap.suite.ui.commons.ComparisonChart(this.getConstructorParamForTile("CM"));
							  break;
					
				case 'DT-TT' :frameType = "TwoByOne";
							  tileContent1 = new sap.suite.ui.commons.NumericContent(this.getConstructorParamForTile("NT"));
							  tileContent2 =  new sap.suite.ui.commons.MicroAreaChart(this.getConstructorParamForTile("TT"));
							  break;
				
				
			}
			
			var tile = new sap.suite.ui.commons.GenericTile({
				size:"S",
				frameType:frameType,
				header: context.getProperty("title"),
				subheader: context.getProperty("description"),
				customData: [new sap.ui.core.CustomData({key:"tileType",value:tileType})],
				tileContent: new sap.suite.ui.commons.TileContent({content:tileContent1,size:"S"}),
				press: function(evt) {}
			});
			tile.addStyleClass("sbTile");
			if(tileContent2){
				tile.addTileContent(new sap.suite.ui.commons.TileContent({content:tileContent2,size:"S"}));
			}
			return tile;
			
		},
		getChipRow:function(id,context){

			var that = this;
			var tileContent,tile;
			var config = {};
			try {
				config = JSON.parse(JSON.parse(JSON.parse(context.getObject().configuration).tileConfiguration).TILE_PROPERTIES);
			}
			catch(e) {
				jQuery.sap.log.error("parsing of Chip Failed");
			}
			
			var navType = config.navType == "0"? "GENERIC_DRILLDOWN":"OTHER_DRILLDOWN";
			var statusText = "STATUS_ACTIVE_DRAFT";
			var statusState = "Success";
			var tileNotAvailableErrorState = false;
			var semanticObjectVisibility = Number(config.navType)?true:false;
			
			if(context.getObject().COUNTER == "1") {
				if(context.getObject().isActive) {
					statusText = "STATUS_ACTIVE";
				} else {
					statusText = "STATUS_NEW";
					statusState = "None";
				}
			}
			var statusObject = new sap.m.ObjectNumber({
				number: that.oApplicationFacade.getResourceBundle().getText(statusText),
				state: statusState
			})

			var tile = that.getPreviewTile(context.getProperty('tileType'),context);
			if(context.getProperty("isAffected")) {
				tile.addStyleClass("affectedTile");
				editButton.setEnabled(false);
				tileNotAvailableErrorState = true;
			}
			
			var editTile = function(evt) {
				var bindingContext = this.getBindingContext("evaluation");
				var chipObj = bindingContext.getObject();
				var chipContext = "CHIPS";
				var activeStatus = (chipObj.isActive && chipObj.COUNTER != 2)? 1 :0
						chipContext = chipContext + "(" + contextKeys.id + "='" + chipObj.id + "'," + contextKeys.isActive  + "="+ activeStatus +")";
				sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action:"configureSBKPITile", route:contextKeys.editTileRoute, context: (that.evalContext.sPath.substr(1) + "/" + chipContext)});
			}
			var editButton = new sap.m.Button({
				icon: "sap-icon://edit",
				type:sap.m.ButtonType.Transparent,
				press: editTile
			});
			

			var deleteButton = new sap.m.Button({
				icon:"sap-icon://sys-cancel",
				type:sap.m.ButtonType.Transparent,
				press: function(evt) {
					that.handleDelete(this);
				}
			});

			var cells = [];
			if(that.isPlatformABAP) {
				cells = [tile,
				         new sap.ui.layout.VerticalLayout({
				        	 content: [
				        	           new sap.m.Text({text: context.getObject().catalogName, visible:true}),
				        	           new sap.m.ObjectStatus({text: that.oApplicationFacade.getResourceBundle().getText("TILE_REMOVED_FROM_CATALOG"), state:"Error", visible:tileNotAvailableErrorState})
				        	           ]
				         }).addStyleClass("navigationVLayout"),
				         editButton /*, deleteButton*/];
			} else {
				cells = [tile,
				         new sap.ui.layout.VerticalLayout({
				        	 content: [
				        	           new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText(navType)}),
				        	           new sap.m.Text({text: that.oApplicationFacade.getResourceBundle().getText("SEMANTIC_OBJECT") + ': ' + config.semanticObject, visible:semanticObjectVisibility}),
				        	           new sap.m.Text({text: that.oApplicationFacade.getResourceBundle().getText("ACTION") + ': ' + config.semanticAction, visible:semanticObjectVisibility}),
				        	           ]
				         }).addStyleClass("navigationVLayout"),
				         statusObject,
				         editButton /*,deleteButton */];
			}

			var columnListItem = new sap.m.ColumnListItem({
				//type: "Navigation",
				cells: cells
			}); 
			
			if(!(that.isPlatformABAP)) {
				var contextKeys={
						id:"id",
						isActive: 'isActive',
						editTileRoute: 'editTile'
				};
				editButton.attachPress(editTile);
				columnListItem.attachPress(editTile);
			
			}else if(that.isPlatformABAP && !(context.getProperty("isAffected"))){
				var contextKeys={
						id:"ID",
						isActive: 'IS_ACTIVE',
						editTileRoute: 'editTileModelS'
				}
				editButton.attachPress(editTile);
				columnListItem.attachPress(editTile);
			} else {
				columnListItem.setType("Inactive");
			}
			return columnListItem;
		},
       checkForMandatoryParametersForEvaluation: function() {
          var that = this;
          var evaluationObj = that.getView().getModel("evaluation").getData().EVALUATION;
          var errorLog = [];
          var warningLog = [];
          var inputParameters = {};
          var evaluationFilters = that.getView().getModel("evaluation").getData().FILTERS;
          var evaluationValues = that.getView().getModel("evaluation").getData().VALUES;
          var isTarget = false;
          
          evaluationObj.ODATA_URL ? true : errorLog.push("ERROR_ENTER_ODATA_URL");
          evaluationObj.ODATA_ENTITYSET ? true : errorLog.push("ERROR_ENTER_ENTITY_SET");
          evaluationObj.COLUMN_NAME ? true : errorLog.push("ERROR_ENTER_MEASURE");

          if(evaluationObj.ODATA_URL && evaluationObj.ODATA_ENTITYSET) {
                 this.oData4SAPAnalyticsModel = new sap.ui.model.analytics.odata4analytics.Model(new sap.ui.model.analytics.odata4analytics.Model.ReferenceByURI(that._appendSystemAlias(evaluationObj.ODATA_URL)), null);
                 this.queryResultObj = this.oData4SAPAnalyticsModel.findQueryResultByName(evaluationObj.ODATA_ENTITYSET);
                 if(this.queryResultObj.getParameterization()) {
                        inputParameters = this.queryResultObj.getParameterization().getAllParameters();
                 }

                 for(var i=0,l=evaluationValues.length; i<l; i++) {
                	 if(evaluationValues[i].TYPE == "TA") {
                		 isTarget = true;
                	 }
                	 else if(evaluationValues[i].TYPE && (evaluationValues[i].TYPE.toString().search(/^\d\d$/) == 0)) {
                		 if(evaluationValues[i].COLUMN_NAME == evaluationObj.COLUMN_NAME) {
                			 errorLog.push("ADDI_MEASURE_HAS_MAIN_MEASURE");
                		 }
                	 }
                 }

                 if(!isTarget) {
                	 warningLog.push("ERROR_ENTER_TARGET");
                 }

                 for(var i=0,l=evaluationFilters.length; i<l; i++) {
                        if(evaluationFilters[i].TYPE == 'PA') {
                              if(inputParameters[evaluationFilters[i].NAME] && (evaluationFilters[i].VALUE_1 !== undefined) && (evaluationFilters[i].VALUE_1 !== null)) {
                                     delete inputParameters[evaluationFilters[i].NAME];
                              }
                        }
                 }
                 if(Object.keys(inputParameters).length) {
                        errorLog.push("ERROR_ENTER_ALL_INPUT_PARAMETERS");
                 }
          }
          return {error:errorLog, warning:warningLog};
       },
       formatFilterValue: function(value){
    	   if(!value)
    		   return value;
    	   var valueArray = value.split(",");
    	   pattern =/^[1-9][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3])(:[0-5][0-9]){2}[.][0-9]{3}Z$/;
           if(!pattern.test(valueArray[0]))
	    		return value;
    	   var dateArray = [];
    	   for(var key in valueArray)
    		   dateArray.push(new Date(valueArray[key]).toString());
    	   return dateArray.join(",");
       },
        
       formatTags: function(tag) { 
    	   return ((this.getView().byId("tags").getItems().length > 1) ? (', ' + tag) : (tag));
   	   },
   	   formatScalingFactor: function(scalingFactor) {
   		   var that = this;
   		   var scalingFactorText = null;
   		   switch(scalingFactor) {
	   		   case 0: 
	   			   scalingFactorText = that.oApplicationFacade.getResourceBundle().getText("AUTO");
	   			   break;
	   		   case -2:
	   			   scalingFactorText = that.oApplicationFacade.getResourceBundle().getText("PERCENT");
	   			   break;
	   		   default :
	   			   scalingFactorText = that.oApplicationFacade.getResourceBundle().getText("AUTO");
   		   }
   		   return scalingFactorText;
   	   },
   	   formatDecimalPrecision: function(decimalPrecision) {
   		   var that = this;
   		   var decimalPrecisionText = null;
   		   switch(decimalPrecision) {
	   		   case -1: 
	   			   decimalPrecisionText = that.oApplicationFacade.getResourceBundle().getText("AUTO");
	   			   break;
	   		   case 0: 
	   			   decimalPrecisionText = that.oApplicationFacade.getResourceBundle().getText("NO_DECIMAL");
	   			   break;
	   		   case 1: 
	   			   decimalPrecisionText = that.convert(1); 
	   			   break;
	   		   case 2: decimalPrecisionText = that.convert(2);
	   			   break;
	   		   case 3: decimalPrecisionText = that.convert(3);
	   			   break;
	   		   default : 
	   			   decimalPrecisionText = that.oApplicationFacade.getResourceBundle().getText("AUTO");
   		   }
   		   return decimalPrecisionText;
   	   },
   	   convert: function(value){
   		   jQuery.sap.require("sap.ui.core.format.NumberFormat");
   		   var valFormatter = sap.ui.core.format.NumberFormat.getFloatInstance( 
					{style: 'standard', 
						minFractionDigits: value,
						maxFractionDigits: value,}
			);
   		   var fNum = valFormatter.format(0);
   		   return fNum;
   	   },
       
       activateEvaluation: function() {
    	   var that = this;
    	   var payload = {};
    	   var entity = "ACTIVE_EVALUATIONS";
           payload.ID = that.getView().getModel("evaluation").getData().EVALUATION.ID;
           payload = payload;
           var ODataModel = that.oApplicationFacade.getODataModel();
           //odata write
//           ODataModel.create(entity,payload,null,function(data){
//                  sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_SUCCESS"));
//                  ODataModel.refresh();
//                  sap.suite.ui.smartbusiness.lib.Util.utils.hashChange({hash:window.location.hash.replace("IS_ACTIVE=0","IS_ACTIVE=1")});
//                  that.byId("evalStatus").setText(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE"));
//                  that.byId("evalStatus").setState(sap.ui.core.ValueState.Success); 
//                  that.setHeaderFooterOptions(that.oHeaderFooterOptions);
//           },
//           function(err){
//                  sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"), err.response.body);
//           });
           
           //xsjs write
           that.metadataRef.create("ACTIVATE_EVALUATION",payload,null,function(data){
        	   sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_SUCCESS"));
        	   //ODataModel.refresh();
        	   that.refreshMasterList();
        	   that.oApplicationFacade.evaluationDetails[that.oApplicationFacade.evaluationIndex].EVALUATION.IS_ACTIVE = 1;
        	   that.byId("evalStatus").setText(that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE"));
        	   that.byId("evalStatus").setState(sap.ui.core.ValueState.Success); 
        	   sap.suite.ui.smartbusiness.lib.Util.utils.replaceHash({hash:window.location.hash.replace("IS_ACTIVE=0","IS_ACTIVE=1")}, true);
        	   that.updateFooterButtons(that.oApplicationFacade.evaluationDetails[that.oApplicationFacade.evaluationIndex].EVALUATION);
           },
           function(err){
        	   sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"), err.responseText);
        	   that.errorMessages.push({
                   "type":"Error",
                   "title":that.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"),
                   "description":  err.responseText
               });
               sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that); 
           });
           
           
       },
       refreshMasterList: function() {
    	   var that = this;
    	   that.utilsRef.refreshMasterList(that,false);
       },
       _addColumnsToTable:function(){
			var tableRef = this.byId("tileGrid");
			tableRef.removeAllColumns();
			if(this.isPlatformABAP) {
				tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : this.oApplicationFacade.getResourceBundle().getText("TILE_TYPE")}),visible : true}));
				tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : this.oApplicationFacade.getResourceBundle().getText("CATALOGUE")}),visible : true}));
				tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : ""}),visible : true}));
				tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : ""}),visible : true}));
			}
			else {
				tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : this.oApplicationFacade.getResourceBundle().getText("TILE_TYPE")}),visible : true}));
				tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : this.oApplicationFacade.getResourceBundle().getText("NAVIGATION")}),visible : true}));
				tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : this.oApplicationFacade.getResourceBundle().getText("STATUS")}),visible : true}));
				tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : ""}),visible : true}));
				//tableRef.addColumn(new sap.m.Column({header : new sap.m.Label({text : ""}),visible : true}));
			}
       },
       onTilePanelExpanded: function(e){
    	   if(e.getParameter("expand")){
        	   var that = this;
    		   var oModel =this.getView().getModel("evaluation");
    		   if(oModel.getProperty("/CHIPS").length == 0){
    			   this.metadataRef.getChipByEvaluation({
    				   context:this.evalContext,
    				   success:function(data){
    					   oModel.setProperty("/CHIPS",data.CHIPS);
    				   },error:function(e){
    					   sap.suite.ui.smartbusiness.lib.Util.utils.showErrorMessage(this.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"), err.responseText);
    					   that.errorMessages.push({
      		                    "type":"Error",
      		                    "title":this.oApplicationFacade.getResourceBundle().getText("ACTIVATE_EV_ERROR"),
      		                    "description":  e.responseText
      		                });
      		                sap.suite.ui.smartbusiness.lib.Util.utils.setErrorState(that);  
    				   }, model:this.oApplicationFacade.getODataModel()
    				   
    			   });
    		   }
    	   }
       },
       initializeDrillDownViewPopover: function(){
    	   var that=this;
    	   var oResourceBundle = this.oApplicationFacade.getResourceBundle();
    	   this.drillDownViewPopover = new sap.m.ResponsivePopover({
    		   title:"{/TITLE}",
    		   content:[
    		            new sap.ui.layout.form.SimpleForm({
    		            	labelSpanL:2,
    		            	labelSpanM:2,
    		            	emptySpanL:0,
    		            	emptySpanM:0,
    		            	columnsL:1,
    		            	columnsM:1,
    		            	layout:"ResponsiveGridLayout",
    		            	content:[
    		            	         new sap.m.Label({
    		            	        	 text:oResourceBundle.getText("CHART_TYPE"),
    		            	        	 design: "Bold"
    		            	         }),
    		            	         new sap.m.Text({
    		            	        	 text:"{/CHART_TYPE}"
    		            	         }),
    		            	         new sap.m.Label({
    		            	        	 text:oResourceBundle.getText("MEASURES"),
    		            	        	 design: "Bold"
    		            	         }),
    		            	         new sap.m.Text({
    		            	        	 text:{
    		            	        		 path:"/MEASURES",
    		            	        		 formatter:function(aMeasures){
    		            	        			 return aMeasures?aMeasures.join():"";
    		            	        		 }
    		            	        	 }
    		            	         }),
    		            	         new sap.m.Label({
    		            	        	 text:oResourceBundle.getText("DIMENSIONS"),
    		            	        	 design: "Bold"
    		            	         }),
    		            	         new sap.m.Text({
    		            	        	 text:{
    		            	        		 path:"/DIMENSIONS",
    		            	        		 formatter:function(aDimensions){
    		            	        			 return aDimensions ? aDimensions.join():"";
    		            	        		 }
    		            	        	 }
    		            	         })
    		            	         ]
    		            })
    		            ],
    		            beginButton: new sap.m.Button({
    		            	text: oResourceBundle.getText("OPEN_IN_DRILLDOWN"),
    		            	press:function(){
    		            		var viewId = this.getModel().getProperty("/ID");
    		            		var evalId = this.getModel().getProperty("/EVALID");
    		            		sap.suite.ui.smartbusiness.lib.Util.utils.appToAppNavigation({action:"configureSBKPIDrilldown", route:"configureChart", context:evalId+"/"+viewId});
    		            	}
    		            })
    	   });
    	   this.drillDownViewPopover.setModel(new sap.ui.model.json.JSONModel());
       },
       onViewPressed: function(oEvent){
    	   var data = oEvent.getSource().getBindingContext("evaluation").getObject();
    	   this.drillDownViewPopover.getModel().setData(data);
    	   this.drillDownViewPopover.openBy(oEvent.getSource());
       },
       
       
       
   	openAdditionalLanguageDialog : function(oEvent){
		var that=this;
		this.additionalLanguageListModel = new sap.ui.model.json.JSONModel();
		this.additionalLanguageListModelData=[];
		this.additionalLanguageListModelData = that.getView().getModel('evaluation').getData().TEXTS;
		// Fetch All Sap Languages - Adapter Implementation
		var langSuccessHandler = function(obj, arr, localeLanguage) {
			that.SAP_LANGUAGES = obj;
			that.SAP_LANGUAGE_ARRAY = arr;
			that.localLanguage = localeLanguage;
		};
		var i=0;
		var l=this.additionalLanguageListModelData.length;
		sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices").getAllLanguages({async:false, success:langSuccessHandler, model:this.oDataModel});
		for(i=0;i<l;i++){
			this.additionalLanguageListModelData[i].ADDITIONAL_LANGUAGE_KEY = that.SAP_LANGUAGES.SPRAS[this.additionalLanguageListModelData[i].LANGUAGE]; 
			
		}
		//this.getView().getModel().getData().NO_OF_ADDITIONAL_LANGUAGES = this.additionalLanguageListModelData.length;
		this.additionalLanguageListModel.setData(this.additionalLanguageListModelData);

	

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
				        	  value : "{additionalLanguageListModel>TITLE}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L12 M12 S12",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>DESCRIPTION}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L7 M7 S7",
				        		  vAlign : "Middle"
				        	  }),
				        	  editable : false
				          }),
				          new sap.m.Input({
				        	  value : "{additionalLanguageListModel>ADDITIONAL_LANGUAGE_KEY}",
				        	  design : "Bold",
				        	  layoutData : new sap.ui.layout.GridData({
				        		  span : "L3 M3 S3"
				        	  }),
				        	  editable : false
				          }),
				         
				          ]
			})
		}));

		this.addedLanguagesList.setModel(that.additionalLanguageListModel,"additionalLanguageListModel");

		var additionalLanguageDialog = new sap.m.Dialog({
			contentHeight : "50%",
			contentWidth : "25%",
			title : that.oApplicationFacade.getResourceBundle().getText("ADDITIONAL_LANGUAGES"),
			content :  [
			           

			            that.addedLanguagesList

			            ],

			            endButton : new sap.m.Button({
			            	text : that.oApplicationFacade.getResourceBundle().getText("OK"),
			            	press : function(){
			            		additionalLanguageDialog.close();
			            	}
			            })
		});

			additionalLanguageDialog.open();
	},
	
	
       onDrillDownPanelExpanded: function(e){
    	   if(e.getParameter('expand')){
    		   var oModel =this.getView().getModel("evaluation");
    		   if(!(oModel.getProperty("/DRILLDOWN/ISLOADED"))){
    			   var evalId = this.oApplicationFacade.evaluationDetails[this.oApplicationFacade.evaluationIndex].EVALUATION.ID;
    			   var configuration=new sap.suite.ui.smartbusiness.lib.DrilldownConfiguration.Configuration(evalId);
    			   var viewConfig = configuration.getDefaultView();
    			   var headers = viewConfig ?(viewConfig.getHeaders()||[]) : [];
    			   var filters = viewConfig ?(viewConfig.getFilters()||[]) : [];
    			   var data = {
    					   FILTERS:filters.join(", "),
    					   VIEWS:[],
    					   ISLOADED:true,
    					   HEADERS_COUNT:headers.length
    			   };
    			   var allViews = configuration.getAllViews()||[];
    			   allViews.forEach(function(curView){
    				   var curViewConfig = configuration.findViewById(curView.ID);
    				   data.VIEWS.push({
    					   ID:curView.ID,
    					   EVALID:evalId,
    					   MEASURES: curViewConfig.getMeasures(),
    					   DIMENSIONS: curViewConfig.getDimensions(),
    					   TITLE: curViewConfig.getTitle(),
    					   CHART_TYPE: curViewConfig.getChartConfiguration()[0].oChart.CHART_TYPE,
    				   });
    			   });
    			   data.VIEW_COUNT = data.VIEWS.length;
    			  oModel.setProperty("/DRILLDOWN",data); 
    		   }
    	   }
       }

});

