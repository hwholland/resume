/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.tiles.HarveyBall");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Generic");
sap.suite.ui.smartbusiness.tiles.Generic.extend("sap.suite.ui.smartbusiness.tiles.HarveyBall", {
    metadata : {
        properties : {
            kpiValueRequired : {
                type : "boolean",
                defaultValue : true
            },
            tileType : {
                type : "string",
                defaultValue : "CM"
            },
            size : {
                type : "string",
                defaultValue : "S"
            },
        }
    },
    renderer : {} //No need to write Anything
});

sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.init = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.init.apply(this);
    this._bShowUOM = false;
    this._bUseFormattedVDMValue = false;
    this._bShowKpiMeasureUOMInFooter = true;
    this._bHasKpiMeasure = null;
    this._oDataRequestReference={};
    this.setAggregation("_tile", new sap.suite.ui.commons.GenericTile({
        header  :"{/header}",
        subheader  : "{/subheader}",
        size : this.getSize(),
        frameType : this.getFrameType(),
        tileContent : new sap.suite.ui.commons.TileContent({
            size: "S",
            content: new sap.suite.ui.commons.HarveyBallMicroChart({
				total:"{/totalValue}",
				size:"S",
				items:[new sap.suite.ui.commons.HarveyBallMicroChartItem({
				    	   fraction:"{/fractionValue}",
				    	   color : "{/color}"
				       })]
			})
        }),
        press: jQuery.proxy(this.tilePressed, this)
    }));
    this.jsonModel = new sap.ui.model.json.JSONModel();
    this.setModel(this.jsonModel);
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.onBeforeRendering = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.onBeforeRendering.apply(this);
    if(this.getContentOnly()) {
        this.setAggregation("_tile", new sap.suite.ui.commons.TileContent({
            size: "S",
            content: new sap.suite.ui.commons.HarveyBallMicroChart({
				total:"{/totalValue}",
				size: "S",
				items:[new sap.suite.ui.commons.HarveyBallMicroChartItem({
				    	   fraction:"{/fractionValue}",
				    	   color : "{/color}"
				       })]
			})
        }));
    }
};

sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype._getTrendColor = function() {

    var returnColor = null;
    var wL = window.parseFloat(this.WARNING_LOW_VALUE);
    var cL = window.parseFloat(this.CRITICAL_LOW_VALUE);
    var cH = window.parseFloat(this.CRITICAL_HIGH_VALUE);
    var wH = window.parseFloat(this.WARNING_HIGH_VALUE);
    var improvementDirection = this.EVALUATION_DATA.GOAL_TYPE;
    if(this.evaluationApi.isMinimizingKpi()) {
        if(this.hasSomeValue(cH, wH)) {
            if(this.KPI_VALUE < wH) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
            } else if(this.KPI_VALUE <= cH) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
            } else {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
            }
        }

    } else if(this.evaluationApi.isMaximizingKpi()) {
        if(this.hasSomeValue(cL, wL)) {
            if(this.KPI_VALUE < cL) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
            } else if(this.KPI_VALUE <= wL) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
            } else {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
            }
        }
    } else {
        if(this.hasSomeValue(wL, wH, cL, cH)) {
            if(this.KPI_VALUE < cL || this.KPI_VALUE > cH) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Error;
            } else if((this.KPI_VALUE >= cL && this.KPI_VALUE <= wL) || 
                    (this.KPI_VALUE >= wH && this.KPI_VALUE <= cH)
            ) {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Critical;
            } else {
                returnColor = sap.suite.ui.commons.InfoTileValueColor.Good ;
            }
        }
    }
    return returnColor;
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.doProcess = function() {
    var that = this;
    this._fetchDataForHarveyBallTile(function(data) {
    	var isTotalMeasureACurrency = this.isACurrencyMeasure(this.getVariable("totalMeasure"));
    	var isFractionalMeasureACurrency = this.isACurrencyMeasure(this.getVariable("fractionMeasure"));
        var jsonData={
        		totalValue:Number(data.totalValue),
        		totalValueLabel  : this.libFormat(Number (data.totalValue), isTotalMeasureACurrency, data.totalValueUnit) +" "+data.totalValueUnit,
        		fractionValue:Number(data.fractionValue),
        		fractionValueLabel : this.libFormat(Number(data.fractionValue), isFractionalMeasureACurrency, data.fractionValueUnit) +" "+data.fractionValueUnit
        };
        if(that.getTileConfiguration().IS_HARVEY_FRACTION_KPIMEASURE){
        	jsonData.color = that._getTrendColor();
        }
        if(true || that.isAssociatedKpi()) {
        	jsonData.subheader= this.evaluationApi.getTitle();
        	jsonData.header= this.evaluationApi.getKpiName();
        }
        if(this._bShowKpiMeasureUOMInFooter && this._bHasKpiMeasure) {
        	
        }
        that.jsonModel.setData(jsonData);
        that.setDoneState();
        that.initPopup();
    }, this.logError);
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype._getFormattedHarveyFilters = function(aHarveyFilters){
	var tmp=[];
	if( aHarveyFilters && aHarveyFilters[0] && aHarveyFilters[0].VALUE_1){
		aHarveyFilters[0].VALUE_1.forEach(function(curVal){    			
			harveyFilters.push({
				NAME:aHarveyFilters[0].NAME,
				TYPE: "FI",
				VALUE_1:[curVal],
				OPERATOR:tileConfiguration.HARVEY_FILTERS[0].OPERATOR,
				VALUE_2:[]
			})
		})
	}
	if(tileConfiguration.HARVEY_FILTERS[0] && tileConfiguration.HARVEY_FILTERS[0].VALUE_1){
	}
	
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype._fetchDataForHarveyBallTile = function(fnSuccess,fnError){
	function makeODataRequest(oModel,sUri,sMeasure,valType,fnS,fnE){
		var uom = that.UOM_PROPERTY_MAPPING[sMeasure];
	    var oDataRef = oModel.read(sUri, null, null, true, function(data) {
	    	that.deregisterODataRequest(valType);
	        if(data && data.results && data.results.length) {
	        	kpiData[valType] = data.results[0][sMeasure];
	        	kpiData[valType+"Unit"] = data.results[0][uom]|| ""; //kpiData.unit||data.results[0][unit]||"";
	        	fnS.call(that,kpiData);		
	        } else {
	            fnE.call(that,"no Response from QueryServiceUri");
	        }
	    },function(eObject) {
	    	that.deregisterODataRequest(valType);
	        if(eObject && eObject.response) {
	            jQuery.sap.log.error(eObject.message +" : "+eObject.request.requestUri);
	        }
	    });
		that.registerODataRequest(valType,oDataRef);
	}
	var that = this;
    /* Preparing arguments for the prepareQueryServiceUri function */
    var tileConfiguration=this.getTileConfiguration();
    this._bHasKpiMeasure = true;
    var oQuery;
    var kpiData={};
    var harveyFilters=[];
    var valueType;// totalValue or fractionValue
    var oParam ={
    		serviceUri : this._addSystemAliasToUri(this.evaluationApi.getODataUrl(), this.getSapSystem()),
    		entitySet  : this.evaluationApi.getEntitySet(),
    		measure    : this.evaluationApi.getKpiMeasureName(),
    		filter	   : this.getAllFilters()
    };
    if(tileConfiguration.IS_HARVEY_FRACTION_KPIMEASURE){
    	oParam.measure = tileConfiguration.HARVEY_TOTAL_MEASURE;
    	kpiData.fractionValue = this.KPI_VALUE;
    	kpiData.fractionValueUnit = this.UOM;
    	valueType = "totalValue";
    }else{
    	tileConfiguration.HARVEY_FILTERS=tileConfiguration.HARVEY_FILTERS||[];

    	kpiData.totalValue = this.KPI_VALUE;
    	kpiData.totalValueUnit = this.UOM;
    	oParam.filter = oParam.filter.concat(harveyFilters);
    	valueType = "fractionValue";
    }
    this.setVariable('fractionMeasure', this.evaluationApi.getKpiMeasureName());
    this.setVariable('totalMeasure', oParam.measure);
    
    oQuery = sap.suite.ui.smartbusiness.lib.Util.odata.getUri(oParam);
    
    makeODataRequest(oQuery.model,oQuery.uri,oParam.measure,valueType,fnSuccess,fnError);
   // makeODataRequest(fractionValueQuery.model,fractionValueQuery.uri,oParam2.measure,"fractionValue",fnSuccess,fnError);
        
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.doDummyProcess = function() {
    this.jsonModel.setData(this.getDummyData());
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.getDummyData=function(){
	return this._cleanUpDummyData({
        subheader : "Expenses by Region",
        header : "Comparative Annual Totals",
        footerNum : "",
        footerComp : "",
        scale: "M",
        unit: "EUR",
		fractionValue: 34,
		totalValue:100,
        size:"S",
        color:"Good",
	});
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.showPopup = function() {
	this._popover.openBy(this);
};

sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.initPopup = function() {
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
    
    var getValueState = function(color){
        return {
        "Error" : sap.ui.core.ValueState.Error,
        "Neutral" : sap.ui.core.ValueState.None,
        "Good" : sap.ui.core.ValueState.Success,
        "Warning" : sap.ui.core.ValueState.Warning,
        "Critical" : sap.ui.core.ValueState.Warning
        }[color] || sap.ui.core.ValueState.None;
    };
    
    thresholdList.bindItems("/THRESHOLDS", new sap.m.ObjectListItem({
    	title : "{name}",
    	number : "{value}",
    	numberState: {
            path: "color",
            formatter: getValueState
        }
    }));
    thresholdList.setModel(model);
    
    var thresholdVals = this.jsonModel.getData().data;
    
    if(this.evaluationApi.getScaling() == -2) {    	
    	for(var each in thresholdVals) {
			if(thresholdVals[each]) {
				thresholdVals[each].value = (thresholdVals[each].value *100) + " %" ;
			}    				
		}
    }
    
    for (var j in thresholdVals) {
	    modelData.THRESHOLDS.push({
	        name : thresholdVals[j].title,
	        value : this.VALUE_FORMATTER.format(thresholdVals[j].value),
	        color: thresholdVals[j].color
	    });
    }
    
    model.setData(modelData);
    var oCustomHeader = new sap.m.Bar({
        contentMiddle:[ new sap.m.Label({
            text: this.getModel("i18n").getProperty("DETAILS")
        })],
        contentRight:(jQuery.device.is.phone) ? [] :
            [new sap.m.Button({
                icon:"sap-icon://decline",
                width : "2.375rem",
                press:jQuery.proxy(function(){if(this._popover.isOpen()){this._popover.close();}},
                	this)
            })]
    });
    this._popover = new sap.m.ResponsivePopover({
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
    oStaticArea.addContent(this._popover, true);
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.registerODataRequest=function(sKey,oRef){
	this._oDataRequestReference[sKey]=oRef;
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.deregisterODataRequest=function(sKey){
	delete this._oDataRequestReference[sKey];
};
sap.suite.ui.smartbusiness.tiles.HarveyBall.prototype.abortODataCalls = function() {
	for(var each in this._oDataRequestReference){
		this._oDataRequestReference[each].abort();
		this.deregisterODataRequest(each);
	}
};
