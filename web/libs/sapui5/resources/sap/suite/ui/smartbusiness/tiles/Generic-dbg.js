/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.tiles.Generic");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");
sap.ui.core.Control.extend("sap.suite.ui.smartbusiness.tiles.Generic", {
    metadata : {
        properties : {
            evaluationId : "string",
            associationEvaluationId : {
                type : "string",
                defaultValue : null
            },
            header : "string",
            subheader : "string",
            mode : {
                type : "string",
                defaultValue : "RUNTIME"
            },
            size : {
                type : "string",
                defaultValue : "S"
            },
            dimension : {
                type : "string",
                defaultValue : null
            },
            frameType : {
                type : "string",
                defaultValue :"OneByOne"
            },
            contentOnly : {
            	type : "boolean",
            	defaultValue : false
            },
            kpiValueRequired : {
                type : "boolean",
                defaultValue : true
            },
            sapSystem : {
                type : "string",
                defaultValue : null
            },
            additionalFilters : {
                type: "object",
                defaultValue: {}
            	
            },
            visible : {
                type : "boolean",
                defaultValue : true
            },
            click : {
                type : "boolean",
                defaultValue: true
            },
            onNavigation : {
            	type : "function",
            	defaultValue: null
            },
            tileConfiguration : {
            	type : "object",
            	defaultValue : null
            	/** Expected Format
            	 {
            	 	MEASURES : [
            	  		{name : 'X', color : <SemanticName>}
            	  	],
            	  	SORTING : {
            	  		order : 'asc/desc',
            	  		by : 'M/D'
            	  	}, 
            	  	
            	 }
            	 */
            }
        },
        events : {
        	navigation : {}
        },
        aggregations : {
            _tile : {
                type:"sap.ui.core.Control",
                multiple:false,
                visibility : "hidden"
            }
        }
    }
});
sap.suite.ui.smartbusiness.tiles.Generic.Mode = {
        "RUNTIME" : "RUNTIME",
        "DUMMY" : "DUMMY",
};

sap.suite.ui.smartbusiness.tiles.Generic.prototype._addSystemAliasToUri = function(uri, sysAlias) {
	if(sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
		var parsingService = sap.ushell.Container.getService("URLParsing");
		if(parsingService) {
			uri = parsingService.addSystemToServiceUrl(uri, sysAlias);
		}
	}
	return uri;
}; 
sap.suite.ui.smartbusiness.tiles.Generic.prototype.init = function () {
    this._oScalingFactor = {
            "0" : "",    
            "3" : "Kilo",
            "6" : "Million",
            "9" : "Billion",
            "-9" : "Nano",
            "-6" : "Micro",
            "-3" : "Milli"
    };
    this.EVALUATION_DATA = null;
    this.evaluationApi = null;
    this.THRESHOLD_MAPPING = {
        "TA" : {
            prop : 'TARGET_VALUE',
        },
        "CL" : {
            prop : 'CRITICAL_LOW_VALUE'
        },
        "CH" : {
            prop : 'CRITICAL_HIGH_VALUE'
        },
        "WL" : {
            prop : 'WARNING_LOW_VALUE'
        },
        "WH" : {
            prop : 'WARNING_HIGH_VALUE'
        },
        "TC" : {
            prop : 'TREND_VALUE',
        },
        "RE" : {
            prop : "REFERENCE_VALUE"
        }
    };
    for(var each in this.THRESHOLD_MAPPING) {
        var prop = this.THRESHOLD_MAPPING[each].prop;
        this[prop] = null;
    }
    this.setAggregation("_tile", new sap.suite.ui.commons.GenericTile({
        
    }));
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.onBeforeRendering = function () {
    //do nothing
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype._initODataMetadata = function() {
	var serviceUrl = this._addSystemAliasToUri(this.evaluationApi.getODataUrl(), this.getSapSystem());
    var oProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(serviceUrl, this.evaluationApi.getEntitySet());
    var columns = [];
    columns.push(this.evaluationApi.getKpiMeasureName());
    if(this.getDimension()) {
        columns.push(this.getDimension()); 
    }
    this.LABEL_PROPERTY_MAPPING = oProperties.getLabelMappingObject();
    this.TEXT_PROPERTY_MAPPING = oProperties.getTextPropertyMappingObject();
    this.UOM_PROPERTY_MAPPING = oProperties.getUnitPropertyMappingObject();
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.renderTile = function() {
    var evaluationId = this.getEvaluationId();
    if(this.isAssociatedKpi()) {
        evaluationId  = this.getAssociationEvaluationId();
    }
    this.setLoadingState();
    this.oData_Call_Ref_Evaluation_Details = sap.suite.ui.smartbusiness.drilldown.lib.Configuration.getEvaluationById({
        id : evaluationId,
        cache : true,
        filters : true,
        thresholds : true,
        sapSystem : this.getSapSystem(),
        success : function(evaluationData) {
            if(evaluationData.ID) {
                this.EVALUATION_DATA = evaluationData;
                if (this.EVALUATION_DATA.hasOwnProperty("DECIMAL_PRECISION") &&
                		(typeof this.EVALUATION_DATA.DECIMAL_PRECISION == "undefined")) {
                	/* default to AUTO */
                	this.EVALUATION_DATA.DECIMAL_PRECISION = -1;
                }
                this.evaluationApi = sap.suite.ui.smartbusiness.lib.Util.kpi.parseEvaluation(evaluationData);
                this.evaluationApi.parse_sapclient();
                this._initODataMetadata();
                this._fetchKpiValue(function() {
                    if(!this.getVisible()){
                        //this.$().hide(1000);
                        this.$().css("opacity","0.2");
                    }
                    else{
                        this.$().show(1000);
                       //this.$().css("display", "inline-block");
                    }
                    if(this.getClick())
                        this.$().off("click");
                    else
                        this.$().click(function(){
                            return false;
                        });
                    this._initThresholdPopOver();
                    try {
                        this.doProcess();
                    } catch(e) {
                        jQuery.sap.log.error("Error in doProcess() : "+ e.message);
                        this.setFailedState();
                    }
                });
            } else {
                this.logError("Empty results for evaluation Id : "+evaluationId);
            }
        },
        error : function(errorMessage) {
            this.logError(errorMessage);
        },
        context : this
    })
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype._getOtherThresholdMeasures = function() {
    var thresholds = this.EVALUATION_DATA.VALUES.results;
    var mObject = {};
    if(this.evaluationApi.getThresholdValueType() == "MEASURE" || this.evaluationApi.getThresholdValueType() == "RELATIVE") {
        thresholds.forEach(function(threshold) {
            var sMeasureColumn = threshold.COLUMN_NAME;
            if(sMeasureColumn) {
            	var tType = this.THRESHOLD_MAPPING[threshold.TYPE];
            	if(tType) {
                    mObject[tType.prop] = sMeasureColumn;
            	}
            }
        },this);
        return mObject;
    } else {
        thresholds.forEach(function(threshold) {
            var tType = this.THRESHOLD_MAPPING[threshold.TYPE];
            if(tType) {
                this[tType.prop] = threshold.FIXED;
            }
        }, this);
        return null;
    }
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype._getThresholdsValues = function(queryResult, thresholdMeasures) {
    if(thresholdMeasures) {
        for(var each in thresholdMeasures) {
            this[each] = queryResult[thresholdMeasures[each]];
        }
    }
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype._fetchKpiValue = function(sCallback) {
    if(this.getKpiValueRequired()) {
        var kpiMeasure = this.evaluationApi.getKpiMeasureName();
        var thresholdMeasures = this._getOtherThresholdMeasures();
        var kpiMeasures = [kpiMeasure];
        if(thresholdMeasures) {
            kpiMeasures.push(this.evaluationApi.getKpiMeasureName());
            for(var each in thresholdMeasures) {
                kpiMeasures.push(thresholdMeasures[each]);
            }
        }
        var uom = this.UOM_PROPERTY_MAPPING[kpiMeasure];
        var urlFilters = this.getUrlFilters();
        var evaluationFilters = this.evaluationApi.getFilters()["results"];
        var oQueryUri = sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
            serviceUri : this._addSystemAliasToUri(this.evaluationApi.getODataUrl(), this.getSapSystem()),
            entitySet : this.evaluationApi.getEntitySet(),
            measure : kpiMeasures,
            dimension : null,
            filter : this.getAllFilters()
        });
        var oThis = this;
        var evaluationId = this.getEvaluationId();
        if(this.isAssociatedKpi()) {
            evaluationId  = this.getAssociationEvaluationId();
        }
        this.Fetch_Kpi_Value_Success = function(data) {
            if(data && data.results.length && data.results[0][kpiMeasure]) {
                var results = data.results[0];
                oThis.KPI_VALUE = results[kpiMeasure];
                oThis.UOM = "";
                if(uom) {
                    oThis.UOM = results[uom];
                }
                oThis._getThresholdsValues(results, thresholdMeasures);
                // entering data into cache
                sap.suite.ui.smartbusiness.lib.Util.cache.setKpiDetailsById(evaluationId,data);
                // removing from current_calls 
              
				if(oThis.evaluationApi.getThresholdValueType() =="MEASURE"){
					var i, valuesObject = oThis.evaluationApi.getValues().results;
					for(i=0;i<valuesObject.length;i++){
						if(valuesObject[i].TYPE == "WL"){
							oThis.WARNING_LOW_VALUE = results[valuesObject[i].COLUMN_NAME];
						}
						if(valuesObject[i].TYPE == "CL"){
							oThis.CRITICAL_LOW_VALUE = results[valuesObject[i].COLUMN_NAME];    
						}
						if(valuesObject[i].TYPE == "CH"){
							oThis.CRITICAL_HIGH_VALUE = results[valuesObject[i].COLUMN_NAME];
						}
						if(valuesObject[i].TYPE == "WH"){
							oThis.WARNING_HIGH_VALUE = results[valuesObject[i].COLUMN_NAME];
						}
					}
				}
				else if(oThis.evaluationApi.getThresholdValueType() =="RELATIVE"){
					var i, targetValue, valuesObject = oThis.evaluationApi.getValues().results;
					for(i=0;i<valuesObject.length;i++){
						if(valuesObject[i].TYPE == "TA"){
							targetValue = results[valuesObject[i].COLUMN_NAME]
							break;
						}
					}

					for(i=0;i<valuesObject.length;i++){
						if(valuesObject[i].TYPE == "WL"){
							oThis.WARNING_LOW_VALUE = Number(targetValue)*valuesObject[i].FIXED/100;
						}
						if(valuesObject[i].TYPE == "CL"){
							oThis.CRITICAL_LOW_VALUE = Number(targetValue)*valuesObject[i].FIXED/100;    
						}
						if(valuesObject[i].TYPE == "CH"){
							oThis.CRITICAL_HIGH_VALUE = Number(targetValue)*valuesObject[i].FIXED/100;
						}
						if(valuesObject[i].TYPE == "WH"){
							oThis.WARNING_HIGH_VALUE = Number(targetValue)*valuesObject[i].FIXED/100;
						}
					}
				}
              
                if(sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId]) {
                    var x = sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId];
                    delete sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId];
                    x.resolve();
                    
                }
                sCallback.call(oThis);
                
            } else {
                oThis.setNoData();
            }
        };
   
        this.Fetch_Kpi_Value_Fail = function(errObject) {
            if(sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId]){
                sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId].reject();
            }
            oThis.logError("Error Fetching Kpi Value : "+oQueryUri.uri);
        };
        var fromCache = sap.suite.ui.smartbusiness.lib.Util.cache.getKpiDetailsById(evaluationId);
        //checking if data exists in cache or not
        if(fromCache) {
            this.Fetch_Kpi_Value_Success(fromCache);
        }
        //if the call is currently in progress
        else if(sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId]){
            jQuery.when(sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId]).then(function() {
                var data = sap.suite.ui.smartbusiness.lib.Util.cache.getKpiDetailsById(evaluationId);
                oThis.Fetch_Kpi_Value_Success(data);
            },function(errorMessage){oThis.logError(errorMessage)});
        }
        else {
            sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId] = jQuery.Deferred();
            this.OData_Call_Ref_Fetch_Kpi_Value = oQueryUri.model.read(oQueryUri.uri, null, null, true, this.Fetch_Kpi_Value_Success,this.Fetch_Kpi_Value_Fail);
        }
    } else {
        sCallback.call(this, null);
    }
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.getAllFilters = function() {
	   //return this.getUrlFilters().concat(this.evaluationApi.getFilters()["results"]);
		var evaluationFilters = this.evaluationApi.getFilters()["results"]|| [];
		var urlFilters=this.getAdditionalFilters()||[];
		var tmp={};
		urlFilters.forEach(function(o){
			tmp[o.NAME]=true;
		});
		return urlFilters.concat(evaluationFilters.filter(function(o){
			return !tmp[o.NAME];
		}));     
	   return ret;
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.getUrlFilters = function() {
    var params = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters(["viewId"]/*Excludes array keys*/);
    var urlFilters = [];
    for (var key in params) {
        var aFilterValues = params[key];
        if(aFilterValues && aFilterValues.length) {
            aFilterValues.forEach(function(sFilterValue) {
                var Obj = {};
                Obj["NAME"] = key;
                Obj["OPERATOR"] = "EQ";
                Obj["VALUE_1"] = sFilterValue;
                Obj["VALUE_2"] = "";
                Obj["TYPE"] = "FI";
                urlFilters.push(Obj);
            });
        }
    }
    return urlFilters;
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.onAfterRendering = function () {
    try {
        if(this.getMode() == sap.suite.ui.smartbusiness.tiles.Generic.Mode.RUNTIME) {
            this.renderTile();
        } else {
            this.doDummyProcess();
        }
    } catch(e) {
        jQuery.sap.log.error(e);
        this.setFailedState();
    }
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.numberOfLeadingZeros = function(num) {
    num = String(num);
    var count = 0;
    var decimal_index = num.indexOf('.');
    if (decimal_index == -1) return 0;
    if(Number(num.split('.')[0]) != 0)
        return 0;
    var i = decimal_index + 1;
    while(num[i++] == '0') {
        ++count;
    }
    return count;
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.formatValue = function(value, scalingFactor, MAX_LEN) {
    MAX_LEN= MAX_LEN || 4;
    var unit={3:"K",6:"M",9:"B",12:"T",0:""};
    unit["-3"] = "m";
    unit["-6"] = "u";
    unit["-9"] = "n";
    unit["-12"] = "t";
    unit["-2"] = "%";
    var temp,pre,suff;
    temp=Number(value).toPrecision(MAX_LEN);
    var zeroes = this.numberOfLeadingZeros(temp);
    if(zeroes > 0 && scalingFactor < 0){
        pre = temp*Math.pow(10,zeroes+MAX_LEN);
        suff = -(zeroes+MAX_LEN);
    }
    else
    {
        pre=Number(temp.split("e")[0]);
        suff=Number(temp.split("e")[1])||0;
    }
    if(!value && value!=0)
        return {value:"",unitPrefix:""};
        if(scalingFactor>=0)
        {
            if(suff%3!=0){
                if(suff%3==2){
                    if(suff+1==scalingFactor){
                        suff=suff+1;
                        pre=pre/10;
                    }
                    else{
                        suff=suff-2;
                        pre=pre*100;
                    }
                }
                else{
                    if(suff+2==scalingFactor){
                        suff=suff+2;
                        pre=pre/100;
                    }
                    else{
                        suff--;
                        pre=pre*10;
                    }
                }
            }


            else if(suff==15){
                pre=pre*1000;
                suff=12;
            }
        }
        // for negative scale factor and suff
        else{
        	if (scalingFactor=="-2"){
        		var x = this.formatValue((value*100),0);
            }
            else if (suff>=0 && value<10 && scalingFactor=="-3"){
                pre = value*Math.pow(10,3);
                suff = -3;
            }
            else if(suff>=0)
                return this.formatValue(value,0);

            else{
                suff = Math.abs(suff);
                scalingFactor = Math.abs(scalingFactor);
                if(scalingFactor > suff){
                    pre = pre/(Math.pow(10,suff%3));
                    suff = suff - (suff%3);
                }
                else{
                    var diff = suff - scalingFactor;
                    pre = pre/(Math.pow(10,diff));
                    suff  = suff - diff;
                }
                suff = 0-suff;
            }

        }
        // ending of neg scale factor
        pre+="";
        if(scalingFactor=="-2"){
            var valstr = (x.unitPrefix == "") ? Number(x.value+"").toFixed(4 - (x.value+"").indexOf('.')) : Number(x.value+"").toFixed(3 - (x.value+"").indexOf('.')) ;
            return {value:Number(valstr),unitPrefix:(x.unitPrefix)+unit[-2]};
        }
        pre = Number(pre).toFixed(4 - pre.indexOf('.'));
        return {value:Number(pre),unitPrefix:unit[suff]};
   
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.formatOdataObjectToString = function (value){
    if(value && value.constructor == Object){
        if(value.__edmType=="Edm.Time"){
            var milliseconds = value.ms;
            var seconds = Math.floor((milliseconds / 1000) % 60 );
            var minutes = Math.floor((milliseconds / 60000) % 60);
            var hours   = Math.floor((milliseconds / 3600000) % 24);
            return hours+"H"+minutes+"M"+seconds+"S";
        }
    }
    return value;
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.getScalingFactorMapping = function() {
    return this._oScalingFactor;
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.isAssociatedKpi = function(){
    if(this.getAssociationEvaluationId() && (this.getAssociationEvaluationId() !== this.getEvaluationId())){
        return true;
    }
    return false;
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.getTileControl = function() {
    return this.getAggregation("_tile");
};  
sap.suite.ui.smartbusiness.tiles.Generic.prototype.setFailedState = function() {
	if(this.getTileControl().setState) {
	    this.getTileControl().setState(sap.suite.ui.commons.LoadState.Failed);
	}
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.setLoadingState = function() {
	if(this.getTileControl().setState) {
		this.getTileControl().setState(sap.suite.ui.commons.LoadState.Loading);
	}
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.setDoneState = function() {
	if(this.getTileControl().setState) {
		this.getTileControl().setState(sap.suite.ui.commons.LoadState.Loaded);
	}
};

sap.suite.ui.smartbusiness.tiles.Generic.prototype.logError = function(errorMessage) {
    jQuery.sap.log.error(errorMessage);
    this.setFailedState();
}; 
sap.suite.ui.smartbusiness.tiles.Generic.prototype.setNoData = function(){
	this.getModel().setProperty('/footerNum',"No data available");
	this.getModel().setProperty('/footerComp',"No data available");
	this.getModel().setProperty('/header',this.EVALUATION_DATA.INDICATOR_TITLE);
	this.getModel().setProperty('/subheader',this.EVALUATION_DATA.TITLE);	
	this.setDoneState();
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.abortODataCalls = function() {
    var _abort = function(ref) {
        if(ref) {
            ref.abort();
        }
    };
    _abort(this.comparisionChartODataRef);
    _abort(this.OData_Call_Ref_Fetch_Kpi_Value);
    _abort(this.areaChartODataRef);
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.onExit = function() {
    this.abortODataCalls();
};

sap.suite.ui.smartbusiness.tiles.Generic.prototype.isACurrencyMeasure = function(measure) {
	jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");
	var sUri = this.EVALUATION_DATA.ODATA_URL;
	var entitySet = this.EVALUATION_DATA.ODATA_ENTITYSET;
	return sap.suite.ui.smartbusiness.lib.Util.odata.getFormattingMetadata(sUri, entitySet, measure)._hasCurrency;
};

sap.suite.ui.smartbusiness.tiles.Generic.prototype.libFormat = function(n, isACurrencyMeasure, currencyCode, overridePercentScaling) {
	isACurrencyMeasure = isACurrencyMeasure || false;
	currencyCode = currencyCode || null;
	overridePercentScaling = overridePercentScaling || false;
	var scaling = this.EVALUATION_DATA.SCALING;
	if (overridePercentScaling) {
		scaling = 0;
	}
	jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Formatter");
	return sap.suite.ui.smartbusiness.lib.Formatter.getLocaleFormattedValue(
			Number(n), scaling, this.EVALUATION_DATA.DECIMAL_PRECISION, isACurrencyMeasure, currencyCode);
};

/**
 * Dummy Department Below
 */

sap.suite.ui.smartbusiness.tiles.Generic.prototype.getDummyDataForNumericTile = function() {
    var data = {  
        subheader : "Expenses by Region",
        header : "Comparative Annual Totals",
        footerNum : "",
        footerComp : "",
        scale: "M",
        unit: "EUR",
        value: "10.34",
        size:"Auto",
        color:"Good",
    };
    return this._cleanUpDummyData(data);
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.getDummyDataForBulletTile = function() {
    var data =  {
        subheader : "Lorem Epsom" ,
        header : "Lorem Epsom" ,
        footerNum : "",
        footerComp : "Compare across regions",
        frameType:"OneByOne",
        scale: "M",
        actual: { value: 120, color: sap.suite.ui.commons.InfoTileValueColor.Good},
        targetValue: 100,
        thresholds: [
                     { value: 0, color: sap.suite.ui.commons.InfoTileValueColor.Error },
                     { value: 50, color: sap.suite.ui.commons.InfoTileValueColor.Critical },
                     { value: 150, color: sap.suite.ui.commons.InfoTileValueColor.Critical },
                     { value: 200, color: sap.suite.ui.commons.InfoTileValueColor.Error }
                     ],
                     showActualValue: true,
                     showTargetValue: true
    };
    return this._cleanUpDummyData(data);
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.getDummyDataForComparisonTile = function(){
    var data = {
        subheader : "Expenses By Region",
        header : "Comparative Anual Totals",
        footerNum : "",
        footerComp : "Compare across regions",
        scale: "MM",
        unit: "EUR",
        value: 8888,
        data: [
               { title: "Americas", value: 10},
               { title: "EMEA", value: 50},
               { title: "APAC", value: -20}
               ],
    };
    return this._cleanUpDummyData(data);
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.getDummyDataForMeasureComparisonTile = function(){
    var data = {
        subheader : "Lorem Epsom",
        header : "Lorem Epsom",
        footerNum : "",
        footerComp : "Compare across regions",
        scale: "M",
        unit: "EUR",
        value: 8888,
        data: [
               { title: "Measure 1", value: 50, color: "Good" },
               { title: "Measure 2", value: -20, color: "Error" },
               { title: "Measure 3", value: 10, color: "Critical" }
               ],
    };
    return this._cleanUpDummyData(data);
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.getDummyDataForAreaChartTile = function(){
    var data = {
        subheader: "Expenses By Region",
        header: "Comparative Anual Totals",
        footerNum: "",
        footerComp: "Compare across regions",
        scale: "MM",
        unit: "EUR",
        value: 8888,
        size: "S",
        frameType: "OneByOne",
        state: sap.suite.ui.commons.LoadState.Loaded,
        title: "US Profit Margin",
        footer: "Current Quarter",
        description: "Maximum deviation",
        width: "100%",
        height: "100%",
        chart: {
            color: "Good",
            data: [{
                day: 0,
                balance: 0
            }, {
                day: 30,
                balance: 20
            }, {
                day: 60,
                balance: 20
            }, {
                day: 100,
                balance: 80
            }]
        },
        target: {
            color: "Error",
            data: [{
                day: 0,
                balance: 0
            }, {
                day: 30,
                balance: 30
            }, {
                day: 60,
                balance: 40
            }, {
                day: 100,
                balance: 90
            }]
        },
        maxThreshold: {
            color: "Good",
            data: [{
                day: 0,
                balance: 0
            }, {
                day: 30,
                balance: 40
            }, {
                day: 60,
                balance: 50
            }, {
                day: 100,
                balance: 100
            }]
        },
        innerMaxThreshold: {
            color: "Error",
            data: []
        },
        innerMinThreshold: {
            color: "Neutral",
            data: []
        },
        minThreshold: {
            color: "Error",
            data: [{
                day: 0,
                balance: 0
            }, {
                day: 30,
                balance: 20
            }, {
                day: 60,
                balance: 30
            }, {
                day: 100,
                balance: 70
            }, ]
        },
        minXValue: 0,
        maxXValue: 100,
        minYValue: 0,
        maxYValue: 100,
        firstXLabel: {
            label: "June 123",
            color: "Error"
        },
        lastXLabel: {
            label: "June 30",
            color: "Error"
        },
        firstYLabel: {
            label: "0M",
            color: "Good"
        },
        lastYLabel: {
            label: "80M",
            color: "Critical"
        },
        minLabel: {},
        maxLabel: {}
    };
    return this._cleanUpDummyData(data);
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype._cleanUpDummyData = function(data) {
    /*
    if(!this.isAssociatedKpi()) {
        data.header = "";
        data.subheader = "";
    }*/
    data.header = this.getHeader() || "Lorem Epsom";
    data.subheader = this.getSubheader() || "Lorem Epsom";
    return data;
};
sap.suite.ui.smartbusiness.tiles.GenericRenderer = {};
sap.suite.ui.smartbusiness.tiles.GenericRenderer.render = function(oRm, oControl) {
    oRm.write("<div");
    oRm.writeControlData(oControl);
    oRm.addClass("drilldownKpiTile");
    oRm.writeClasses();
    oRm.write(">");
    oRm.renderControl(oControl.getTileControl());
    oRm.write("</div>");
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype._closePopover = function() {
    if(this._popOver.isOpen()) {
        this._popOver.close();
    }
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype._initThresholdPopOver = function() {
    var model = new sap.ui.model.json.JSONModel(modelData);
    var modelData = {"THRESHOLDS":[]};
    var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());
    jQuery.sap.require("sap.ui.core.format.NumberFormat");
    this.VALUE_FORMATTER = sap.ui.core.format.NumberFormat.getFloatInstance({
    			style: "standard"
    		},locale);
    var thresholdList = new sap.m.List({
    });
    thresholdList.bindItems("/THRESHOLDS", new sap.m.ObjectListItem({
        title : "{name}",
        number : "{value}",
        numberState : sap.ui.core.ValueState.None
    }));
    thresholdList.setModel(model);
    
    var thresholdVals = {} ; 
	thresholdVals.targetVal = this.TARGET_VALUE ;
	thresholdVals.critLowVal = this.CRITICAL_LOW_VALUE ;
	thresholdVals.warnLowVal = this.WARNING_LOW_VALUE ;
	thresholdVals.critHighVal = this.CRITICAL_HIGH_VALUE ;
	thresholdVals.warnHighVal = this.WARNING_HIGH_VALUE ;
	
    if(this.evaluationApi.getScaling() == -2) {    	
//    	if(this.evaluationApi.getThresholdValueType() == "FIXED") {
//    		for(var each in thresholdVals) {
//    			if(thresholdVals[each])
//    				thresholdVals[each] = thresholdVals[each] + " %" ;
//    		}
//    	} else if(this.evaluationApi.getThresholdValueType() == "MEASURE") {
//    		for(var each in thresholdVals) {
//    			if(thresholdVals[each]) {
//    				var otemp = this.formatValue(thresholdVals[each], "-2") ;
//    				thresholdVals[each] = otemp.value + otemp.unitPrefix ;
//    			}    				
//    		}
//    	}
    	for(var each in thresholdVals) {
			if(thresholdVals[each]) {
				//var otemp = sap.suite.ui.smartbusiness.lib.Util.utils.getLocaleFormattedValue((thresholdVals[each]*100), -2);
				thresholdVals[each] = (thresholdVals[each]*100) + " %" ;
			}    				
		}
    } 
    
    if(this.evaluationApi.isMaximizingKpi()) {
        if(thresholdVals.targetVal != undefined)
	    	modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("TARGET_LABEL"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.targetVal)
	        });
        if(thresholdVals.warnLowVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("WARNING"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.warnLowVal)
	        });
        if(thresholdVals.critLowVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("CRITICAL"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.critLowVal)
	        });
    } else if(this.evaluationApi.isMinimizingKpi()) {
    	if(thresholdVals.critHighVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("CRITICAL"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.critHighVal)
	        });
    	if(thresholdVals.warnHighVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("WARNING"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.warnHighVal)
	        });
    	if(thresholdVals.targetVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("TARGET_LABEL"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.targetVal)
	        });
    } else if(this.evaluationApi.isTargetKpi()) {
    	if(thresholdVals.critHighVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("CRITICAL_HIGH_LABEL"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.critHighVal)
	        });
    	if(thresholdVals.warnHighVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("WARNING_HIGH_LABEL"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.warnHighVal)
	        });
    	if(thresholdVals.targetVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("TARGET_LABEL"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.targetVal)
	        });
    	if(thresholdVals.warnLowVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("WARNING_LOW_LABEL"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.warnLowVal)
	        });
    	if(thresholdVals.critLowVal != undefined)
	        modelData.THRESHOLDS.push({
	            name : this.getModel("i18n").getProperty("CRITICAL_LOW_LABEL"),
	            value : this.VALUE_FORMATTER.format(thresholdVals.critLowVal)
	        });
    }
    
    model.setData(modelData);
    var oCustomHeader = new sap.m.Bar({
        contentMiddle:[ new sap.m.Label({
            text:this.getModel("i18n").getProperty("THRESHOLD_LABEL")
        })],
        contentRight:(jQuery.device.is.phone) ? [] :
            [new sap.m.Button({
                icon:"sap-icon://decline",
                width : "2.375rem",
                press:jQuery.proxy(this._closePopover, this)
            })]
    });
    this._popOver = new sap.m.ResponsivePopover({
        modal:false,
        enableScrolling:true,
        verticalScrolling:true,
        horizontalScrolling:false,
        placement:sap.m.PlacementType.Auto,
        contentWidth:"18rem",
        customHeader:oCustomHeader,
        content:[thresholdList]
    });
    var oStaticArea = sap.ui.getCore().getUIArea(sap.ui.getCore().getStaticAreaRef());
    oStaticArea.addContent(this._popOver, true);
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.showThresholds = function(){
    this._popOver.openBy(this);
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.tilePressed = function() {
    if(!this.isAssociatedKpi() && this.getMode() == sap.suite.ui.smartbusiness.tiles.Generic.Mode.RUNTIME) {
    	if(this.getTileType()=="NT" || this.getTileType() == "AT") {
            this.showThresholds();
         }
    	else if(this.getTileType() == "TT") {
        	this.showTTPopup && this.showTTPopup();
        }
    	else if(this.getTileType() == "CT") {
        	this.showCTPopup && this.showCTPopup();
        }
    	else if(this.getTileType() == "CM") {
        	this.showCMPopup && this.showCMPopup();
        }
    }
    //tiles should navigate to the drilldown of associated evaluations
    else if(this.isAssociatedKpi() && this.getMode() == sap.suite.ui.smartbusiness.tiles.Generic.Mode.RUNTIME) {
    	var startupParam = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters();
    	var appParam = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters(["viewId"]);
    	startupParam["evaluationId"] = [];
    	startupParam["chipId"] = [];
    	var evalId = this.getAssociationEvaluationId();
    	startupParam.evaluationId.push(evalId);
    	jQuery.sap.require("sap.suite.ui.smartbusiness.Configuration");
    	startupParam.chipId.push(sap.suite.ui.smartbusiness.Configuration.Constants.SMARTBUSINESS_NULL_VALUE);
    	sap.suite.ui.smartbusiness.drilldown.lib.Hash.setApplicationParameters(appParam, false);
    	sap.suite.ui.smartbusiness.drilldown.lib.Hash.setStartupParameters(startupParam, false);
    	var configuration = sap.suite.ui.smartbusiness.drilldown.lib.Configuration.getConfigurationFromCache(evalId);
    	try {
        	if(configuration) {
        		configurationApi = sap.suite.ui.smartbusiness.drilldown.lib.Configuration.parse(evalId, configuration);
        		if(configurationApi) {
        			var defaultView =  configurationApi.getDefaultView();
        			if(defaultView) {
        				var viewId = defaultView.getId();
        				if(viewId) {
        					this.fireNavigation();
        					sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateApplicationParameters({"viewId" : [viewId]}, false);
        				}
        			}
        		}
        	}
    	} catch(e) {
    		//Just to handle Exception
    	}
    	this.fireNavigation()
    	sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateHash();
    }
};
sap.suite.ui.smartbusiness.tiles.Generic.prototype.hasSomeValue = function() {
    var flag = true;
    if(arguments.length) {
        for(var i=0, l=arguments.length; i< l; i++) {
            if(arguments[i] || arguments[i] == "0") {
            } else {
                flag = false;
                break;
            }
        }
    } else {
        flag = false;
    }
    return flag;
};

