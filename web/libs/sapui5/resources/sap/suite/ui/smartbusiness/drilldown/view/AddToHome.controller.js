/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.require("sap.m.MessageBox");sap.ui.controller("sap.suite.ui.smartbusiness.drilldown.view.AddToHome",{onInit:function(){this.drilldownController=this.getView().getViewData();this.evaluationApi=this.drilldownController.EVALUATION;this.thresholds=this.evaluationApi.getThresholds();this.LAYOUT=this.byId("container");this.SAP_SYSTEM=this.drilldownController.SAP_SYSTEM;try{this.LAYOUT_MODEL=new sap.ui.model.json.JSONModel({TITLE:"",CL:this.thresholds.getCriticalLow(),CH:this.thresholds.getCriticalHigh(),WL:this.thresholds.getWarningLow(),WH:this.thresholds.getWarningHigh(),TA:this.thresholds.getTarget(),TC:this.thresholds.getTrend(),RE:this.thresholds.getReference(),MINIMIZING_KPI:this.evaluationApi.isMinimizingKpi(),MAXIMIZING_KPI:this.evaluationApi.isMaximizingKpi(),TARGET_KPI:this.evaluationApi.isTargetKpi()});this.LAYOUT.setModel(this.LAYOUT_MODEL),this.createForm(this.evaluationApi.getThresholdValueType());}catch(e){}},createForm:function(v){var _=function(m){return{parts:[{path:m},{path:"/TARGET_KPI"}],formatter:function(M,t){if(M||t){return true;}return false;}}};var f=null;var n=null;if(v=="MEASURE"){f=new sap.ui.layout.form.SimpleForm({content:[new sap.m.Label({text:"{i18n>SUB_TITLE_LABEL}",required:true}),new sap.m.Input({value:"{/TITLE}"})]});n=new sap.m.Label({text:"{i18n>DYNAMIC_MEASURE_NOT_EDITABLE}"});n.addStyleClass("labelDynamicThresholdNotEditable");}else if(v=="RELATIVE"){f=new sap.ui.layout.form.SimpleForm({content:[new sap.m.Label({text:"{i18n>SUB_TITLE_LABEL}",required:true}),new sap.m.Input({value:"{/TITLE}"}),new sap.m.Label({text:"{i18n>CRITICAL_HIGH_LABEL}",visible:_("/MINIMIZING_KPI")}),new sap.m.Input({value:"{/CH}",visible:_("/MINIMIZING_KPI"),valueState:sap.ui.core.ValueState.Error,valueStateText:"{i18n>CRITICAL_HIGH_VALUE_HELP}"}),new sap.m.Label({text:"{i18n>WARNING_HIGH_LABEL}",visible:_("/MINIMIZING_KPI")}),new sap.m.Input({value:"{/WH}",visible:_("/MINIMIZING_KPI"),valueState:sap.ui.core.ValueState.Warning,valueStateText:"{i18n>WARNING_HIGH_VALUE_HELP}"}),new sap.m.Label({text:"{i18n>TARGET_LABEL}"}),new sap.m.Input({value:"{/TA}",valueState:sap.ui.core.ValueState.None,valueStateText:"{i18n>TARGET_VALUE_HELP}",editable:false}),new sap.m.Label({text:"{i18n>WARNING_LOW_LABEL}",visible:_("/MAXIMIZING_KPI")}),new sap.m.Input({value:"{/WL}",visible:_("/MAXIMIZING_KPI"),valueState:sap.ui.core.ValueState.Warning,valueStateText:"{i18n>WARNING_LOW_VALUE_HELP}"}),new sap.m.Label({text:"{i18n>CRITICAL_LOW_LABEL}",visible:_("/MAXIMIZING_KPI")}),new sap.m.Input({value:"{/CL}",visible:_("/MAXIMIZING_KPI"),valueState:sap.ui.core.ValueState.Error,valueStateText:"{i18n>CRITICAL_LOW_VALUE_HELP}"}),]});}else{f=new sap.ui.layout.form.SimpleForm({content:[new sap.m.Label({text:"{i18n>SUB_TITLE_LABEL}",required:true}),new sap.m.Input({value:"{/TITLE}"}),new sap.m.Label({text:"{i18n>CRITICAL_HIGH_LABEL}",visible:_("/MINIMIZING_KPI")}),new sap.m.Input({value:"{/CH}",visible:_("/MINIMIZING_KPI"),valueState:sap.ui.core.ValueState.Error,valueStateText:"{i18n>CRITICAL_HIGH_VALUE_HELP}"}),new sap.m.Label({text:"{i18n>WARNING_HIGH_LABEL}",visible:_("/MINIMIZING_KPI")}),new sap.m.Input({value:"{/WH}",visible:_("/MINIMIZING_KPI"),valueState:sap.ui.core.ValueState.Warning,valueStateText:"{i18n>WARNING_HIGH_VALUE_HELP}"}),new sap.m.Label({text:"{i18n>TARGET_LABEL}"}),new sap.m.Input({value:"{/TA}",valueState:sap.ui.core.ValueState.None,valueStateText:"{i18n>TARGET_VALUE_HELP}"}),new sap.m.Label({text:"{i18n>WARNING_LOW_LABEL}",visible:_("/MAXIMIZING_KPI")}),new sap.m.Input({value:"{/WL}",visible:_("/MAXIMIZING_KPI"),valueState:sap.ui.core.ValueState.Warning,valueStateText:"{i18n>WARNING_LOW_VALUE_HELP}"}),new sap.m.Label({text:"{i18n>CRITICAL_LOW_LABEL}",visible:_("/MAXIMIZING_KPI")}),new sap.m.Input({value:"{/CL}",visible:_("/MAXIMIZING_KPI"),valueState:sap.ui.core.ValueState.Error,valueStateText:"{i18n>CRITICAL_LOW_VALUE_HELP}"}),]});}this.LAYOUT.removeAllItems();this.LAYOUT.addItem(f);if(n){this.LAYOUT.addItem(n);}},validate:function(c,C){var a=this.drilldownController.getView().getModel("i18n");var m=this.LAYOUT_MODEL.getData();var o={title:""};var t=this.thresholds.getTargetType();if(t==="FIXED"){var n=this._areEvaluationValuesNumber(m);if(n.length){var b="";for(i=0;i<n.length;i++){b=b+a.getProperty("ENTER_NUMERIC_VALUE_FOR_"+n[i])+"\n";}C.call(this,{errorMessage:b});return;}var v=this._validateEvaluationValues(m);if(v.length){var b=a.getProperty("ERROR_ENTER_VALID_THRESHOLD_VALUES");var i;for(i=0;i<v.length;i++){if(v[i]==="CL"){if(this.evaluationApi.getGoalType()==="RA"){b=b+"\n"+a.getProperty("CRITICAL_LOW");}else{b=b+"\n"+a.getProperty("CRITICAL");}}if(v[i]==="WL"){if(this.evaluationApi.getGoalType()==="RA"){b=b+"\n"+a.getProperty("WARNING_LOW");}else{b=b+"\n"+a.getProperty("WARNING");}}if(v[i]==="TA"){b=b+"\n"+a.getProperty("TARGET");}if(v[i]==="CH"){if(this.evaluationApi.getGoalType()==="RA"){b=b+"\n"+a.getProperty("CRITICAL_HIGH");}else{b=b+"\n"+a.getProperty("CRITICAL");}}if(v[i]==="WH"){if(this.evaluationApi.getGoalType()==="RA"){b=b+"\n"+a.getProperty("WARNING_HIGH");}else{b=b+"\n"+a.getProperty("WARNING");}}}C.call(this,{errorMessage:b});return;}}if(t==="RELATIVE"){var p=/^(?=.*\d)\d*(?:\.\d\d)?$/;var b="";if(this.evaluationApi.getGoalType()==="MA"){if((m.WL!=""&&m.WL!=null)&&(m.CL!=""&&m.CL!=null)&&parseInt(m.WL)<=parseInt(m.CL)){b+=a.getProperty("CRITICAL_SHOULD_BE_LESS_THAN_WARNING");}if(m.WL>=100&&(m.WL!=""&&m.WL!=null)){b+="\n"+a.getProperty("WARNING_SHOULD_BE_LESS_THAN_100");}if(m.CL!=""&&(m.CL>=100&&m.CL!=null)){b+="\n"+a.getProperty("CRITICAL_SHOULD_BE_LESS_THAN_100");}if((m.WL!=""&&m.WL!=null)&&!p.test(m.WL)){b+="\n"+a.getProperty("ENTER_NUMERIC_VALUE_FOR_WARNING");}if((m.CL!=""&&m.CL!=null)&&!p.test(m.CL)){b+="\n"+a.getProperty("ENTER_NUMERIC_VALUE_FOR_CRITICAL");}}if(this.evaluationApi.getGoalType()==="MI"){if((m.CH!=""&&m.CH!=null)&&(m.WH!=""&&m.WH!=null)&&parseInt(m.CH)<=parseInt(m.WH)){b+=a.getProperty("CRITICAL_SHOULD_BE_MORE_THAN_WARNING");}if(m.CH<=100&&(m.CH!=""&&m.CH!=null)){b+="\n"+a.getProperty("CRITICAL_SHOULD_BE_MORE_THAN_100");}if(m.WH<=100&&(m.WH!=""&&m.WH!=null)){b+="\n"+a.getProperty("WARNING_SHOULD_BE_MORE_THAN_100");}if(m.CH!=""&&m.CH!=null&&!p.test(m.CH)){b+="\n"+a.getProperty("ENTER_NUMERIC_VALUE_FOR_CRITICAL");}if((m.WH!=""&&m.WH!=null&&!p.test(m.WH))){b+="\n"+a.getProperty("ENTER_NUMERIC_VALUE_FOR_WARNING");}}if(this.evaluationApi.getGoalType()==="RA"){if((m.CH!=""&&m.CH!=null)&&(m.CH!=""&&m.CH!=null)&&parseInt(m.CH)<=parseInt(m.WH)){b+=a.getProperty("CRITICAL_HIGH_MORE_THAN_WARNING_HIGH");}if((m.WL!=""&&m.WL!=null)&&(m.CL!=""&&m.CL!=null)&&parseInt(m.WL)<=parseInt(m.CL)){b+="\n"+a.getProperty("WARNING_LOW_MORE_THAN_CRITICAL_LOW");}if(m.CH<=100&&(m.CH!=""&&m.CH!=null)){b+="\n"+a.getProperty("CRITICAL_HIGH_SHOULD_BE_MORE_THAN_100");}if(m.WH<=100&&(m.WH!=""&&m.WH!=null)){b+="\n"+a.getProperty("WARNING_HIGH_SHOULD_BE_MORE_THAN_100");}if(m.CL>=100&&(m.CL!=""&&m.CL!=null)){b+="\n"+a.getProperty("CRITICAL_LOW_SHOULD_BE_LESS_THAN_100");}if(m.WL>=100&&(m.WL!=""&&m.WL!=null)){b+="\n"+a.getProperty("WARNING_LOW_SHOULD_BE_LESS_THAN_100");}if((m.WL!=""&&m.WL!=null)&&!p.test(m.WL)){b+="\n"+a.getProperty("ENTER_NUMERIC_VALUE_FOR_WARNING_LOW");}if((m.CL!=""&&m.CL!=null)&&!p.test(m.CL)){b+="\n"+a.getProperty("ENTER_NUMERIC_VALUE_FOR_CRITICAL_LOW");}if(m.CH!=""&&m.CH!=null&&!p.test(m.CH)){b+="\n"+a.getProperty("ENTER_NUMERIC_VALUE_FOR_CRITICAL_HIGH");}if((m.WH!=""&&m.WH!=null&&!p.test(m.WH))){b+="\n"+a.getProperty("ENTER_NUMERIC_VALUE_FOR_WARNING_HIGH");}}if(b!=""){C.call(this,{errorMessage:b});return;}}if(this.evaluationApi.getThresholdValueType()=="MEASURE"){if(!m.TITLE.trim()){C.call(this,{errorMessage:this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_TITLE_MISSING")});}else{o.title=m.TITLE.trim();c.call(this,o);}}else if(this.evaluationApi.getThresholdValueType()=="RELATIVE"){if(!m.TITLE.trim()){C.call(this,{errorMessage:this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_TITLE_MISSING")});return;}o.title=m.TITLE.trim();o.evaluationValues=[];var d=m.TA?m.TA.trim():null;var e=m.CL?m.CL.trim():null;var f=m.CH?m.CH.trim():null;var W=m.WL?m.WL.trim():null;var g=m.WH?m.WH.trim():null;if(d){o.evaluationValues.push({TYPE:"TA",FIXED:null,ID:this.evaluationApi.getId(),COLUMN_NAME:d,ODATA_PROPERTY:null});}if(e){o.evaluationValues.push({TYPE:"CL",FIXED:e,ID:this.evaluationApi.getId(),COLUMN_NAME:null,ODATA_PROPERTY:null});}if(f){o.evaluationValues.push({TYPE:"CH",FIXED:f,ID:this.evaluationApi.getId(),COLUMN_NAME:null,ODATA_PROPERTY:null});}if(W){o.evaluationValues.push({TYPE:"WL",FIXED:W,ID:this.evaluationApi.getId(),COLUMN_NAME:null,ODATA_PROPERTY:null});}if(g){o.evaluationValues.push({TYPE:"WH",FIXED:g,ID:this.evaluationApi.getId(),COLUMN_NAME:null,ODATA_PROPERTY:null});}if(o.evaluationValues.length==0){o.evaluationValues=null;}c.call(this,o);}else{if(!m.TITLE.trim()){C.call(this,{errorMessage:this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_TITLE_MISSING")});return;}o.title=m.TITLE.trim();o.evaluationValues=[];var d=m.TA?m.TA.trim():null;var e=m.CL?m.CL.trim():null;var f=m.CH?m.CH.trim():null;var W=m.WL?m.WL.trim():null;var g=m.WH?m.WH.trim():null;if(d){o.evaluationValues.push({TYPE:"TA",FIXED:d,ID:this.evaluationApi.getId(),COLUMN_NAME:null,ODATA_PROPERTY:null});}if(e){o.evaluationValues.push({TYPE:"CL",FIXED:e,ID:this.evaluationApi.getId(),COLUMN_NAME:null,ODATA_PROPERTY:null});}if(f){o.evaluationValues.push({TYPE:"CH",FIXED:f,ID:this.evaluationApi.getId(),COLUMN_NAME:null,ODATA_PROPERTY:null});}if(W){o.evaluationValues.push({TYPE:"WL",FIXED:W,ID:this.evaluationApi.getId(),COLUMN_NAME:null,ODATA_PROPERTY:null});}if(g){o.evaluationValues.push({TYPE:"WH",FIXED:g,ID:this.evaluationApi.getId(),COLUMN_NAME:null,ODATA_PROPERTY:null});}if(o.evaluationValues.length==0){o.evaluationValues=null;}c.call(this,o);}},_addTileToHomePage:function(c){var t=this;var b=sap.ushell.Container.getService("Bookmark");var a=null;b.addCatalogTileToGroup(c,a,{baseUrl:"/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata",remoteId:"HANA_CATALOG"}).done(function(){sap.m.MessageToast.show(t.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_ADDED_TO_HOME_SUCCESSFULLY"));jQuery.sap.log.info("Tile Added to HOME");}).fail(function(e){sap.m.MessageToast.show(t.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_ADD_TO_HOME_FAILED"));jQuery.sap.log.error("Failed to add tile to home : "+e);});},_notifyShell:function(c){var s=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService;if(s){oNotifyShell=s("LaunchPage");if(oNotifyShell&&oNotifyShell.onCatalogTileAdded){oNotifyShell.onCatalogTileAdded(c);}}},publishTile:function(c){var t=this;this.validate(function(a){var C=sap.suite.ui.smartbusiness.Adapter.getService("CatalogServices");var r=C.savePersonalizedTile({evaluationId:this.evaluationApi.getId(),tileType:this.drilldownController.TILE_TYPE,dimension:this.drilldownController.DIMENSION,additionalFilters:this.drilldownController.getAdditionFiltersForChipConfiguration(),evaluationValues:a.evaluationValues?a:null,title:a.title,sapSystem:this.SAP_SYSTEM,success:function(r){sap.m.MessageToast.show(t.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_CREATED_SUCCESSFULLY"));c.call();t._addTileToHomePage(r.chipId);t._notifyShell(r.chipId);},error:function(r){jQuery.sap.log.error(r.message);sap.m.MessageToast.show(t.drilldownController.getView().getModel("i18n").getProperty("PERSONALIZED_TILE_CREATION_FAILED"));c.call();}});},function(e){sap.m.MessageBox.show(e.errorMessage,null,this.drilldownController.getView().getModel("i18n").getProperty("VALIDATION_ERROR_HEADER"))});},_validateEvaluationValues:function(m){var v=[];var e=[];var s=0;var d={};if(m.CL||m.CL===0){v.push({key:"CL",value:m.CL,score:s++});}if(m.WL||m.WL===0){v.push({key:"WL",value:m.WL,score:s++});}if(m.TA||m.TA===0){v.push({key:"TA",value:m.TA,score:s++});}if(m.WH||m.WH===0){v.push({key:"WH",value:m.WH,score:s++});}if(m.CH||m.CH===0){v.push({key:"CH",value:m.CH,score:s++});}v.sort(function(a,b){return(a.value-b.value)});for(var i=0,l=v.length;i<l;i++){if(v[i].score!=i){e.push(v[i].key);}if(v[i]&&v[i-1]){if(v[i].value==v[i-1].value){d[v[i-1].key]=v[i-1].value;d[v[i].key]=v[i].value;}}}if(!(e.length)){e=Object.keys(d);}return e;},_areEvaluationValuesNumber:function(m){var e=[];if(isNaN(m.CL)||isNaN(m.CH)){e.push("CRITICAL");}if(isNaN(m.WL)||isNaN(m.WH)){e.push("WARNING");}if(isNaN(m.TA)){e.push("TARGET");}return e;},onAfterRendering:function(){}});