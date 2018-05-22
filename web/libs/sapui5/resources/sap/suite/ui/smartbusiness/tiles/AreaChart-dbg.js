/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.tiles.AreaChart");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Generic");
sap.suite.ui.smartbusiness.tiles.Generic.extend("sap.suite.ui.smartbusiness.tiles.AreaChart", {
    metadata : {
        properties : {
            kpiValueRequired : {
                type : "boolean",
                defaultValue : false
            },
            tileType : {
                type : "string",
                defaultValue : "TT"
            }
        }
    },
    renderer : {} //No need to write Anything
});

sap.suite.ui.smartbusiness.tiles.AreaChart.prototype.init = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.init.apply(this);
    var buildChartItem = function (sName) {
        return new sap.suite.ui.commons.MicroAreaChartItem({
            color: "Neutral",
            points: {
                path: "/" + sName + "/data",
                template: new sap.suite.ui.commons.MicroAreaChartPoint({
                    x: "{day}",
                    y: "{balance}"

                })
            }
        });
    };
    var buildMACLabel = function (sName) {
        return new sap.suite.ui.commons.MicroAreaChartLabel({
            label: "{/" + sName + "/label}",
            color: "{/" + sName + "/color}"
        });
    };
    this.setAggregation("_tile", new sap.suite.ui.commons.GenericTile({
        header  :"{/header}",
        subheader  : "{/subheader}",
        size : this.getSize(),
        frameType : this.getFrameType(),
        tileContent : new sap.suite.ui.commons.TileContent({
            unit : "{/unit}",
            size: this.getSize(),
            footer : "{/footerNum}",
            content: new  sap.suite.ui.commons.MicroAreaChart({
                width: "{/width}",
                height: "{/height}",
                size: this.getSize(),
                target: buildChartItem("target"),
                innerMinThreshold: buildChartItem("innerMinThreshold"),
                innerMaxThreshold: buildChartItem("innerMaxThreshold"),
                minThreshold: buildChartItem("minThreshold"),
                maxThreshold: buildChartItem("maxThreshold"),
                chart: buildChartItem("chart"),
                minXValue: "{/minXValue}",
                maxXValue: "{/maxXValue}",
                minYValue: "{/minYValue}",
                maxYValue: "{/maxYValue}",
                firstXLabel: buildMACLabel("firstXLabel"),
                lastXLabel: buildMACLabel("lastXLabel"),
                firstYLabel: buildMACLabel("firstYLabel"),
                lastYLabel: buildMACLabel("lastYLabel"),
                minLabel: buildMACLabel("minLabel"),
                maxLabel: buildMACLabel("maxLabel"),
                
            })
        }),
        press: jQuery.proxy(this.tilePressed, this)
    }));
    this.jsonModel = new sap.ui.model.json.JSONModel();
    this.setModel(this.jsonModel);
};
sap.suite.ui.smartbusiness.tiles.AreaChart.prototype.onBeforeRendering = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.onBeforeRendering.apply(this);
    if(this.getContentOnly()) {
        var buildChartItem = function (sName) {
            return new sap.suite.ui.commons.MicroAreaChartItem({
                color: "Neutral",
                points: {
                    path: "/" + sName + "/data",
                    template: new sap.suite.ui.commons.MicroAreaChartPoint({
                        x: "{day}",
                        y: "{balance}"

                    })
                }
            });
        };
        var buildMACLabel = function (sName) {
            return new sap.suite.ui.commons.MicroAreaChartLabel({
                label: "{/" + sName + "/label}",
                color: "{/" + sName + "/color}"
            });
        };
        this.setAggregation("_tile", new sap.suite.ui.commons.TileContent({
            unit : "",
            size: this.getSize(),
            footer : "",
            content: new  sap.suite.ui.commons.MicroAreaChart({
                width: "{/width}",
                height: "{/height}",
                size: this.getSize(),
                target: buildChartItem("target"),
                innerMinThreshold: buildChartItem("innerMinThreshold"),
                innerMaxThreshold: buildChartItem("innerMaxThreshold"),
                minThreshold: buildChartItem("minThreshold"),
                maxThreshold: buildChartItem("maxThreshold"),
                chart: buildChartItem("chart"),
                minXValue: "{/minXValue}",
                maxXValue: "{/maxXValue}",
                minYValue: "{/minYValue}",
                maxYValue: "{/maxYValue}",
                firstXLabel: buildMACLabel("firstXLabel"),
                lastXLabel: buildMACLabel("lastXLabel"),
                firstYLabel: buildMACLabel("firstYLabel"),
                lastYLabel: buildMACLabel("lastYLabel"),
                minLabel: buildMACLabel("minLabel"),
                maxLabel: buildMACLabel("maxLabel"),
                
            })
        }));
    }
};
sap.suite.ui.smartbusiness.tiles.AreaChart.prototype.getEvalValueMeasureName = function(oConfig, type, retType){
    var evalValue = oConfig.VALUES.results;
    for(var i = 0; i < evalValue.length; i++){
        if(evalValue[i].TYPE == type)
            if(retType === "FIXED")
                return evalValue[i].FIXED;
            else
                return evalValue[i].COLUMN_NAME;
    }
};

sap.suite.ui.smartbusiness.tiles.AreaChart.prototype.doProcess = function() {
    var that = this;
    this._fetchDataForAreaChartTile(function(modelData) {
      var deviationTileObj={};
        /*deviationTileObj.data=kpiValue.kpiData;
        if(kpiValue.unitPrefix){
            deviationTileObj.unit = kpiValue.unitPrefix;
        }*/
        if(true || that.isAssociatedKpi()) {
            deviationTileObj.subheader= this.oConfig.TITLE;
            deviationTileObj.header= this.oConfig.INDICATOR_TITLE;
        }
        deviationTileObj=jQuery.extend({},deviationTileObj,modelData);
        that.jsonModel.setData(deviationTileObj);
        that.setDoneState();
    }, this.logError);
};

sap.suite.ui.smartbusiness.tiles.AreaChart.prototype._fetchDataForAreaChartTile = function(fnSuccess,fnError){
    var that = this;
    /* Preparing arguments for the prepareQueryServiceUri function */
    var oParam = {};
    this.oConfig=this.EVALUATION_DATA;
    oParam.serviceUri = this._addSystemAliasToUri(this.oConfig.ODATA_URL, this.getSapSystem());
    oParam.entitySet = this.oConfig.ODATA_ENTITYSET;
    oParam.measure = this.oConfig.COLUMN_NAME;
    oParam.dimension = this.getDimension();
    if(!this.getDimension()) {
        this.logError("Dimension is Missing : Can't Render Area Chart");
        return;
    }
    oParam.filter = this.getAllFilters();
    if(this.oConfig.VALUES_SOURCE == "MEASURE"){
        var fullyFormedMeasure = that.oConfig.COLUMN_NAME;
        switch(that.oConfig.GOAL_TYPE){
        case "MI" :
            that.sWarningHigh =  that.getEvalValueMeasureName(that.oConfig, "WH", "MEASURE");
            that.sCriticalHigh =  that.getEvalValueMeasureName(that.oConfig, "CH", "MEASURE");
            that.sTarget =  that.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
            that.sTrend =  that.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
            //fullyFormedMeasure += ","+that.sWarningHigh +"," +that.sCriticalHigh+","+ that.sTarget;
            break;
        case "MA" :
            that.sWarningLow =  that.getEvalValueMeasureName(that.oConfig, "WL", "MEASURE");
            that.sCriticalLow =  that.getEvalValueMeasureName(that.oConfig, "CL", "MEASURE");
            that.sTarget =  that.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
            that.sTrend =  that.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
            //fullyFormedMeasure += ","+that.sWarningLow +"," +that.sCriticalLow+","+ that.sTarget;
            break;
        case "RA" :
            that.sWarningHigh =  that.getEvalValueMeasureName(that.oConfig, "WH", "MEASURE");
            that.sCriticalHigh =  that.getEvalValueMeasureName(that.oConfig, "CH", "MEASURE");
            that.sTarget =  that.getEvalValueMeasureName(that.oConfig, "TA", "MEASURE");
            that.sTrend =  that.getEvalValueMeasureName(that.oConfig, "TC", "MEASURE");
            that.sWarningLow =  that.getEvalValueMeasureName(that.oConfig, "WL", "MEASURE");
            that.sCriticalLow =  that.getEvalValueMeasureName(that.oConfig, "CL", "MEASURE");
            //fullyFormedMeasure += ","+that.sWarningLow +"," +that.sCriticalLow+","+ that.sTarget + "," + that.sWarningHigh + "," + that.sCriticalHigh;
            break;
        }
        var _allMeasures = [that.sWarningHigh, that.sCriticalHigh, that.sTarget, that.sTrend, that.sWarningLow, that.sCriticalLow];
        _allMeasures.forEach(function(eachMeasureName) {
            if(eachMeasureName) {
                fullyFormedMeasure +=","+eachMeasureName;
            }
        }, this);
        oParam.measure = fullyFormedMeasure;
    }
    var finalQuery = sap.suite.ui.smartbusiness.lib.Util.odata.getUri(oParam);
    var UOMPROPERTY = this.UOM_PROPERTY_MAPPING[this.oConfig.COLUMN_NAME];
    var UOMValue = "";
    this.areaChartODataRef = finalQuery.model.read(finalQuery.uri, null, null, true, function(data) {
        if(data && data.results && data.results.length) {
            if(UOMPROPERTY) {
                UOMValue = data.results[0][UOMPROPERTY];
            }
            oParam.dimension = that.TEXT_PROPERTY_MAPPING[that.getDimension()];
            that.UOM = UOMValue;
            var modelData=  that. _processDataForAreaChart(data,that.oConfig.VALUES_SOURCE,oParam.dimension,that.oConfig.COLUMN_NAME);
            modelData.unit = UOMValue ;
            fnSuccess.call(that,modelData);
        } else {
            that.setNoData();
        }
    },function(eObject) {
        if(eObject && eObject.response) {
            jQuery.sap.log.error(eObject.message +" : "+eObject.request.requestUri);
        }
    });
};

sap.suite.ui.smartbusiness.tiles.AreaChart.prototype._processDataForAreaChart= function(data,type,dimensionName,sMeasure){
    var that = this;
    var evaluationValues = that.oConfig.VALUES.results;
    var dimensionArray = [];
    var measureArray = [];
    var wHArray = [];
    var cHArray = [];
    var cLArray = [];
    var wLArray = [];
    var dataLength = data.results.length;
    var scaleFactor = that.oConfig.SCALING;
    var firstXlabel = data.results[0][dimensionName];
    var minThresholdMeasure, maxThresholdMeasure, innerMinThresholdMeasure, innerMaxThresholdMeasure, targetMeasure;
    var lastXlabel = data.results[data.results.length - 1][dimensionName];
    var firstYLabelValue = Number(data.results[0][sMeasure]);
    var lastYLabelValue = Number(data.results[data.results.length - 1][sMeasure]);
    var goaltype = that.oConfig.GOAL_TYPE;

    for (i in data.results) {
        data.results[i][dimensionName] = Number(i);
        data.results[i][sMeasure] = Number(data.results[i][sMeasure]);
        that.sWarningHigh ? data.results[i][that.sWarningHigh] = Number(data.results[i][that.sWarningHigh]) :"";
        that.sCriticalHigh ? data.results[i][that.sCriticalHigh] = Number(data.results[i][that.sCriticalHigh]) :"";
        that.sCriticalLow ? data.results[i][that.sCriticalLow] = Number(data.results[i][that.sCriticalLow]) :"";
        that.sWarningLow ? data.results[i][that.sWarningLow] = Number(data.results[i][that.sWarningLow]) :"";
        that.sTarget ? data.results[i][that.sTarget] = Number(data.results[i][that.sTarget]) :"";
        that.sWarningHigh ? wHArray.push(data.results[i][that.sWarningHigh]) :"";
        that.sCriticalHigh ? cHArray.push(data.results[i][that.sCriticalHigh]) :"";
        that.sCriticalLow ? cLArray.push(data.results[i][that.sCriticalLow]):"";
        that.sWarningLow ?  wLArray.push(data.results[i][that.sWarningLow]) :"";
        dimensionArray.push(data.results[i][dimensionName]);
        measureArray.push(data.results[i][sMeasure]);
    }
    
    this.FINAL_MEASURE_VALUE = data.results[i][sMeasure];
    this.FINAL_DIMENSION_NAME = this.TEXT_PROPERTY_MAPPING[dimensionName] || dimensionName;
    this.FINAL_DIMENSION_VALUE = lastXlabel;
    
    if(type == "MEASURE") {
	    this.TARGET_VALUE = data.results[i][that.sTarget];
		this.CRITICAL_LOW_VALUE = data.results[i][that.sCriticalLow];
		this.WARNING_LOW_VALUE = data.results[i][that.sWarningLow];
		this.CRITICAL_HIGH_VALUE = data.results[i][that.sCriticalHigh];
		this.WARNING_HIGH_VALUE = data.results[i][that.sWarningHigh];
    } else {
    	var parseEvalValues = function(e){var x={};for(var k in e){x[e[k].TYPE]=e[k].FIXED};return x;};
    	var thresholds = parseEvalValues(evaluationValues);
    	this.TARGET_VALUE = thresholds.TA;
		this.CRITICAL_LOW_VALUE = thresholds.CL;
		this.WARNING_LOW_VALUE = thresholds.WL;
		this.CRITICAL_HIGH_VALUE = thresholds.CH;
		this.WARNING_HIGH_VALUE = thresholds.WH;
    }
	
	this.initTTPopup();
	
    try {
        firstXlabel = that.formatOdataObjectToString(firstXlabel);
        lastXlabel = that.formatOdataObjectToString(lastXlabel);   
    } catch (e) {
        that.logError(e);
    }
    var minMeasure = Math.min.apply(Math, measureArray); //to obtain the starting value
    var oScaledValueFirst = "";
    var calculatedValueForScaling = firstYLabelValue;
    /*if(this.oConfig.SCALING == -2)
        calculatedValueForScaling *= 100;*/
    var isACurrencyMeasure = this.isACurrencyMeasure(this.oConfig.COLUMN_NAME);
    var formattedFirstYLabel = this.libFormat(calculatedValueForScaling, isACurrencyMeasure, this.UOM);
    var firstYLabel = formattedFirstYLabel.toString();
    /*if(this.oConfig.SCALING == -2)
        firstYLabel += " %";*/
    var maxMeasure = Math.max.apply(Math, measureArray); //to obtain the last value
    calculatedValueForScaling = lastYLabelValue;
    /*if(this.oConfig.SCALING == -2)
        calculatedValueForScaling *= 100;*/
    sap.ui.getCore().byId("m1e1 title")
    var formattedLastYLabel = this.libFormat(calculatedValueForScaling, isACurrencyMeasure, this.UOM);
    var lastYLabel = formattedLastYLabel.toString();
    /*if(this.oConfig.SCALING == -2)
        lastYLabel += " %";*/
    try {
        var minDimension = that.formatOdataObjectToString(Math.min.apply(Math, dimensionArray)); //to obtain the starting value 
        var maxDimension = that.formatOdataObjectToString(Math.max.apply(Math, dimensionArray)); //to obtain the last value
    } catch (e) {
        that.logError(e);
    }
    if(type == "MEASURE"){
        (wHArray.length !=0) ? (that.firstwH = wHArray[minDimension]) &&  (that.lastwH = wHArray[maxDimension]) :""; 
        (cHArray.length !=0) ? (that.firstcH = cHArray[minDimension]) && (that.lastcH = cHArray[maxDimension]) : ""; 
        (cLArray.length !=0) ? (that.firstcL = cLArray[minDimension]) && (that.lastcL = cLArray[maxDimension]) :"";
        (wLArray.length !=0) ? ( that.firstwL = wLArray[minDimension]) && (that.lastwL = wLArray[maxDimension]):"";
    }

    var updatedModel = {
        width: "100%",
        height: "100%",
        unit: that.unit || "",
        chart: {
            color: "Neutral",
            data: data.results
        },
        minXValue: minDimension,
        maxXValue: maxDimension,
        minYValue: minMeasure,
        maxYValue: maxMeasure,
        firstXLabel: {
            label: firstXlabel + "",
            color: "Neutral"
        },
        lastXLabel: {
            label: lastXlabel + "",
            color: "Neutral"
        },
        firstYLabel: {
            label: firstYLabel + "",
            color: "Neutral"
        },
        lastYLabel: {
            label: lastYLabel + "",
            color: "Neutral"
        },
        minLabel: {},
        maxLabel: {}
    };

    switch (goaltype) {
    case "MA":
        for (i in evaluationValues) {
            if (evaluationValues[i].TYPE == "CL") {
                updatedModel.minThreshold = {
                        color: "Error",
                    };
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                that.cl = Number(evaluationValues[i].FIXED);
                updatedModel.minThreshold.data = (type  == "MEASURE") ? data.results : [newObj];
                minThresholdMeasure = (type  == "MEASURE") ? that.sCriticalLow : sMeasure;
               
            } else if (evaluationValues[i].TYPE == "WL") {
                updatedModel.maxThreshold = {
                        color: "Good"
                    };
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                updatedModel.maxThreshold.data = (type  == "MEASURE") ? data.results : [newObj];
                maxThresholdMeasure= (type  == "MEASURE") ?  that.sWarningLow : sMeasure;
                that.wl = Number(evaluationValues[i].FIXED);
                   
                }
                 else if (evaluationValues[i].TYPE == "TA") {
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                updatedModel.target = {
                    color: "Neutral",
                };
                updatedModel.target.data = (type  == "MEASURE") ? data.results : [newObj];
                targetMeasure= (type  == "MEASURE") ? that.sTarget : sMeasure;
            }
        }
            updatedModel.innerMinThreshold = {
                data: [

                ]
            };
            updatedModel.innerMaxThreshold = {
                data: [

                ]
            };
            if(type  == "FIXED"){
                updatedModel.firstYLabel.color =  firstYLabelValue < that.cl ? "Error" : ((that.cl <= firstYLabelValue) && (firstYLabelValue <= that.wl)) ? "Critical" : (firstYLabelValue > that.wl) ? "Good" : "Neutral" ;
                updatedModel.lastYLabel.color = lastYLabelValue < that.cl ? "Error" : ((that.cl <= lastYLabelValue) && (lastYLabelValue <= that.wl)) ? "Critical" : (lastYLabelValue > that.wl) ? "Good" : "Neutral" ;
            }
            else if(type == "MEASURE" && that.firstwL && that.lastwL && that.firstcL && that.lastcL){
                updatedModel.firstYLabel.color = firstYLabelValue < that.firstcL ? "Error" : ((that.firstcL <= firstYLabelValue) && (firstYLabelValue <= that.firstwL)) ? "Critical" : (firstYLabelValue > that.firstwL) ? "Good": "Neutral" ;
                updatedModel.lastYLabel.color = lastYLabelValue < that.lastcL ? "Error" : ((that.lastcL <= lastYLabelValue) && (lastYLabelValue <= that.lastwL)) ? "Critical" : (lastYLabelValue > that.lastwL) ? "Good" : "Neutral" ;
            }

        break;
    case "MI":
        for (i in evaluationValues) {

            if (evaluationValues[i].TYPE == "CH") {
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                that.ch =  Number(evaluationValues[i].FIXED);
                updatedModel.maxThreshold = {
                    color: "Error",
                };
                updatedModel.maxThreshold.data = (type  == "MEASURE") ? data.results : [newObj];
                maxThresholdMeasure= (type  == "MEASURE") ? that.sCriticalHigh : sMeasure;
            } else if (evaluationValues[i].TYPE == "WH") {
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                that.wh = Number(evaluationValues[i].FIXED);
                updatedModel.minThreshold = {
                    color: "Good",
                };
                updatedModel.minThreshold.data = (type  == "MEASURE") ? data.results : [newObj];
                minThresholdMeasure= (type  == "MEASURE") ? that.sWarningHigh : sMeasure;
                
            } else if (evaluationValues[i].TYPE == "TA") {
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                updatedModel.target = {
                    color: "Neutral",
                };
                updatedModel.target.data = (type  == "MEASURE") ? data.results : [newObj];
                targetMeasure= (type  == "MEASURE") ? that.sTarget : sMeasure;
            }


        }
        if(type  == "FIXED"){
            updatedModel.firstYLabel.color = firstYLabelValue > that.ch ? "Error" : ((that.wh <= firstYLabelValue) && (firstYLabelValue <= that.ch)) ? "Critical" : (firstYLabelValue < that.wh) ? "Good" : "Neutral" ;
            updatedModel.lastYLabel.color = lastYLabelValue > that.ch ? "Error" : ((that.wh <= lastYLabelValue) && (lastYLabelValue <= that.ch)) ? "Critical" : (lastYLabelValue < that.wh) ? "Good" : "Neutral" ;
        }
        else if(type == "MEASURE" && that.firstwH && that.lastwH && that.firstcH && that.lastcH){
            updatedModel.firstYLabel.color = firstYLabelValue > that.firstcH ? "Error" : ((that.firstwH <= firstYLabelValue) && (firstYLabelValue <= that.firstcH)) ? "Critical" : (firstYLabelValue < that.firstwH) ? "Good" : "Neutral" ;
            updatedModel.lastYLabel.color = lastYLabelValue > that.lastcH ? "Error" : ((that.lastwH <= lastYLabelValue) && (lastYLabelValue <= that.lastcH)) ? "Critical" : (lastYLabelValue < that.lastwH) ? "Good" : "Neutral" ;
            
        }
        updatedModel.innerMaxThreshold = {
            data: [

            ]
        };
        updatedModel.innerMinThreshold = {
            data: [

            ]
        };
        break;
    case "RA":
        for (i in evaluationValues) {

            if (evaluationValues[i].TYPE == "CH") {
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                that.ch = Number(evaluationValues[i].FIXED);
                updatedModel.maxThreshold = {
                    color: "Error",
                };
                updatedModel.maxThreshold.data = (type  == "MEASURE") ?  data.results : [newObj];
                maxThresholdMeasure= (type  == "MEASURE") ? that.sCriticalHigh : sMeasure;
            } else if (evaluationValues[i].TYPE == "WH") {
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                that.wh = Number(evaluationValues[i].FIXED);
                updatedModel.innerMaxThreshold = {
                    color: "Good",
                };
                updatedModel.innerMaxThreshold.data = (type  == "MEASURE") ? data.results : [newObj];
                innerMaxThresholdMeasure= (type  == "MEASURE") ? that.sWarningHigh : sMeasure;
            } else if (evaluationValues[i].TYPE == "WL") {
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                that.wl = Number(evaluationValues[i].FIXED);
                updatedModel.innerMinThreshold = {
                    color: "Good",
                };
                updatedModel.innerMinThreshold.data = (type  == "MEASURE") ?  data.results : [newObj];
                innerMinThresholdMeasure= (type  == "MEASURE") ? that.sWarningLow : sMeasure;
            } else if (evaluationValues[i].TYPE == "CL") {
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                that.cl = Number(evaluationValues[i].FIXED);
                updatedModel.minThreshold = {
                    color: "Error",
                };
                updatedModel.minThreshold.data = (type  == "MEASURE") ? data.results : [newObj];
                minThresholdMeasure= (type  == "MEASURE") ? that.sCriticalLow : sMeasure;
            } else if (evaluationValues[i].TYPE == "TA") {
                var newObj = new Object();
                newObj[dimensionName] = "";
                newObj[sMeasure] = Number(evaluationValues[i].FIXED);
                updatedModel.target = {
                    color: "Neutral",
                };
                updatedModel.target.data = (type  == "MEASURE") ? data.results : [newObj];
                targetMeasure= (type  == "MEASURE") ? that.sTarget : sMeasure;
            }
        }
        if(type  == "FIXED"){
            updatedModel.firstYLabel.color = (firstYLabelValue > that.ch || firstYLabelValue < that.cl ) ? "Error" : ((that.wh <= firstYLabelValue) && (firstYLabelValue <= that.ch)) || ((that.cl <= firstYLabelValue) && (firstYLabelValue <= that.wl))  ? "Critical" : ((firstYLabelValue >= that.wl) && (firstYLabelValue <= that.wh)) ? "Good" : "Neutral" ;
            updatedModel.lastYLabel.color = (lastYLabelValue > that.ch || lastYLabelValue < that.cl ) ? "Error" : ((that.wh <= lastYLabelValue) && (lastYLabelValue <= that.ch)) || ((that.cl <= lastYLabelValue) && (lastYLabelValue <= that.wl))  ? "Critical" : ((lastYLabelValue >= that.wl) && (lastYLabelValue <= that.wh)) ? "Good"  : "Neutral" ;
        }
        else if(type == "MEASURE" && that.firstwL && that.lastwL && that.firstcL && that.lastcL && that.firstwH && that.lastwH && that.firstcH && that.lastcH){
            updatedModel.firstYLabel.color = (firstYLabelValue > that.firstcH || firstYLabelValue < that.firstcL ) ? "Error" : ((that.firstwH <= firstYLabelValue) && (firstYLabelValue <= that.firstcH)) || ((that.firstcL <= firstYLabelValue) && (firstYLabelValue <= that.firstwL))  ? "Critical" : ((firstYLabelValue >= that.firstwL) && (firstYLabelValue <= that.firstwH)) ? "Good" : "Neutral" ;
            updatedModel.lastYLabel.color = (lastYLabelValue > that.lastcH || lastYLabelValue < that.lastcL ) ? "Error" : ((that.lastwH <= lastYLabelValue) && (lastYLabelValue <= that.lastcH)) || ((that.lastcL <= lastYLabelValue) && (lastYLabelValue <= that.lastwL))  ? "Critical" : ((lastYLabelValue >= that.lastwL) && (lastYLabelValue <= that.lastwH)) ? "Good" : "Neutral" ;
        }
        break;

    }

    var buildChartItem = function (sName, a, b, type) {
            return new sap.suite.ui.commons.MicroAreaChartItem({
                color: "{/" + sName + "/color}",
                points: {
                    path: "/" + sName + "/data",
                    template: new sap.suite.ui.commons.MicroAreaChartPoint({
                        x: "{" + a + "}",
                        y: "{" + b + "}"

                    })
                }
            });
    };
    var tileControlRef = null;
    if(this.getContentOnly()) {
    	tileControlRef = that.getTileControl();
    } else {
    	tileControlRef = that.getTileControl().getTileContent()[0].getContent();
    }
    tileControlRef.setTarget(buildChartItem("target", dimensionName, targetMeasure));
    tileControlRef.setInnerMinThreshold(buildChartItem("innerMinThreshold", dimensionName, innerMinThresholdMeasure));
    tileControlRef.setInnerMaxThreshold(buildChartItem("innerMaxThreshold", dimensionName, innerMaxThresholdMeasure));
    tileControlRef.setMinThreshold(buildChartItem("minThreshold", dimensionName, minThresholdMeasure));
    tileControlRef.setMaxThreshold(buildChartItem("maxThreshold", dimensionName, maxThresholdMeasure));
    tileControlRef.setChart(buildChartItem("chart", dimensionName, sMeasure));
    return updatedModel;



  
};
sap.suite.ui.smartbusiness.tiles.AreaChart.prototype.doDummyProcess = function() {
    this.jsonModel.setData(this.getDummyDataForAreaChartTile());
};

sap.suite.ui.smartbusiness.tiles.AreaChart.prototype.showTTPopup = function() {
	this._TTpopOver.openBy(this);
};

sap.suite.ui.smartbusiness.tiles.AreaChart.prototype.initTTPopup = function() {
	var self = this;
	var model = new sap.ui.model.json.JSONModel();
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
    	this.FINAL_MEASURE_VALUE = (this.FINAL_MEASURE_VALUE * 100) + " %" ;
    	for(var each in thresholdVals) {
			if(thresholdVals[each]) {
				thresholdVals[each] = (thresholdVals[each]*100) + " %" ;
			}    				
		}
    }
    modelData.THRESHOLDS.push({
    	name: this.getModel("i18n").getProperty("ACTUAL"),
    	value: this.VALUE_FORMATTER.format(this.FINAL_MEASURE_VALUE)
    })

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
            text: this.FINAL_DIMENSION_NAME && this.FINAL_DIMENSION_VALUE ? 
            		this.FINAL_DIMENSION_NAME+" ("+this.FINAL_DIMENSION_VALUE+")" : 
            			this.getModel("i18n").getProperty("THRESHOLD_LABEL")
        })],
        contentRight:(jQuery.device.is.phone) ? [] :
            [new sap.m.Button({
                icon:"sap-icon://decline",
                width : "2.375rem",
                press:jQuery.proxy(function(){if(this._TTpopOver.isOpen()){this._TTpopOver.close();}},
                	this)
            })]
    });
    this._TTpopOver = new sap.m.ResponsivePopover({
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
    oStaticArea.addContent(this._TTpopOver, true);
};


