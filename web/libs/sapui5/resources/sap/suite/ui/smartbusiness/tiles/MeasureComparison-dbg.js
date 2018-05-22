/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.tiles.MeasureComparison");
jQuery.sap.require("sap.suite.ui.smartbusiness.tiles.Generic");
sap.suite.ui.smartbusiness.tiles.Generic.extend("sap.suite.ui.smartbusiness.tiles.MeasureComparison", {
    metadata : {
        properties : {
            kpiValueRequired : {
                type : "boolean",
                defaultValue : false
            },
            tileType : {
                type : "string",
                defaultValue : "CM"
            }
        }
    },
    renderer : {} //No need to write Anything
});

sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.init = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.init.apply(this);
    this._bShowUOM = false;
    this._bUseFormattedVDMValue = false;
    this._bShowKpiMeasureUOMInFooter = true;
    this._bHasKpiMeasure = null;
    this.setAggregation("_tile", new sap.suite.ui.commons.GenericTile({
        header  :"{/header}",
        subheader  : "{/subheader}",
        size : this.getSize(),
        frameType : this.getFrameType(),
        tileContent : new sap.suite.ui.commons.TileContent({
            unit : "{/unit}",
            size: this.getSize(),
            footer : "{/footerNum}",
            content: new sap.suite.ui.commons.ComparisonChart({
                scale : "{/scale}",
                size: this.getSize(),
                state: "{/state}",
                data: {
                    template: new sap.suite.ui.commons.ComparisonData({
                        title: "{title}",
                        value : "{value}",
                        color: "{color}",
                        displayValue : "{displayValue}"
                    }),
                    path: "/data"
                }
            })
        }),
        press: jQuery.proxy(this.tilePressed, this)
    }));
    this.jsonModel = new sap.ui.model.json.JSONModel();
    this.setModel(this.jsonModel);
};
sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.onBeforeRendering = function() {
    sap.suite.ui.smartbusiness.tiles.Generic.prototype.onBeforeRendering.apply(this);
    if(this.getContentOnly()) {
        this.setAggregation("_tile", new sap.suite.ui.commons.TileContent({
            unit : "{/unit}",
            size: this.getSize(),
            footer : "{/footerNum}",
            content: new sap.suite.ui.commons.ComparisonChart({
                scale : "{/scale}",
                size: this.getSize(),
                state: "{/state}",
                data: {
                    template: new sap.suite.ui.commons.ComparisonData({
                        title: "{title}",
                        value : "{value}",
                        color: "{color}",
                        displayValue : "{displayValue}"
                    }),
                    path: "/data"
                }
            })
        }));
    }
};

sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.doProcess = function() {
    var that = this;
    this._fetchDataForMeasureComparisonTile(function(comparisionData) {
        var jsonData={};
        this._processedComparisionData = this._processMeasureComparisionData(comparisionData);
        jsonData.data = this._processedComparisionData;
        if(true || that.isAssociatedKpi()) {
        	jsonData.subheader= this.evaluationApi.getTitle();
        	jsonData.header= this.evaluationApi.getKpiName();
        }
        if(this._bShowKpiMeasureUOMInFooter && this._bHasKpiMeasure) {
        	var kpiMeasureUOMProperty = this.UOM_PROPERTY_MAPPING[this.evaluationApi.getKpiMeasureName()];
        	if(kpiMeasureUOMProperty) {
        		jsonData.unit = comparisionData[kpiMeasureUOMProperty];
        	}
        }
        that.jsonModel.setData(jsonData);
        that.setDoneState();
        that.initCMPopup();
    }, this.logError);
};

sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype._fetchDataForMeasureComparisonTile = function(fnSuccess,fnError){
    var that = this;
    var _getAllMeasures  = function(tileConfiguration) {
    	var measures = [];
    	if(tileConfiguration && tileConfiguration.MEASURES && tileConfiguration.MEASURES.length) {
    		var configMeasures = tileConfiguration.MEASURES;
    		for(var i=0, l=configMeasures.length; i < l;i++) {
    			measures.push(configMeasures[i].name);
    		}
    	}
    	if(measures.length) {
        	return measures;
    	} else {
    		throw new Error("No Measures Defined for Measure Comparision Tile");
    	}
    };
	function checkIfDataPresent(data,columnNames){
		var isPresent = false;
		if(data && data.results && data.results.length){
    		for(var i=0,l=columnNames.length;i<l && !isPresent ;i++){
    			isPresent = data.results[0][columnNames[i]] !== null;
    		}
		}
		return isPresent;
	}
    /* Preparing arguments for the prepareQueryServiceUri function */
    var oParam = {};
    oParam.serviceUri = this._addSystemAliasToUri(this.evaluationApi.getODataUrl(), this.getSapSystem());
    oParam.entitySet = this.evaluationApi.getEntitySet();
    oParam.measure = _getAllMeasures(this.getTileConfiguration());
    if(oParam.measure.indexOf(this.evaluationApi.getKpiMeasureName()) > -1) {
    	this._bHasKpiMeasure = true;
    }
    oParam.filter = this.getAllFilters();
    var finalQuery = sap.suite.ui.smartbusiness.lib.Util.odata.getUri(oParam);
    this.comparisionChartODataRef = finalQuery.model.read(finalQuery.uri, null, null, true, function(data) {
        if(checkIfDataPresent(data,oParam.measure)) {
            fnSuccess.call(that,data.results[0]);
        } else {
            that.setNoData();
        }
    },function(eObject) {
        if(eObject && eObject.response) {
            jQuery.sap.log.error(eObject.message +" : "+eObject.request.requestUri);
        }
    });
};
sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype._processMeasureComparisionData = function(rawComparisionData) {
	var processedData = [],formattedValue, VDMFormattedProperty,UOM,measureTile, measureName,i, measures, obj;
	measures = this.getTileConfiguration().MEASURES;
	for(i=0, l=measures.length; i < l; i++) {
		obj = {};
		measureName = measures[i].name;
		measureTile = this.LABEL_PROPERTY_MAPPING[measureName];
		obj["title"] = measureTile;
		
		UOM = this.UOM_PROPERTY_MAPPING[measureName];
		VDMFormattedProperty = this.TEXT_PROPERTY_MAPPING[measureName];
		var calculatedValueForScaling = Number(rawComparisionData[measureName]);
		if(this._bUseFormattedVDMValue && VDMFormattedProperty && (VDMFormattedProperty != measureName)) {
			formattedValue = rawComparisionData[VDMFormattedProperty];
		} else {
			/*
		    if(this.evaluationApi.getScaling() == -2)
		        calculatedValueForScaling *= 100;
	        formattedValue = sap.suite.ui.smartbusiness.lib.Util.utils.getLocaleFormattedValue(calculatedValueForScaling, this.evaluationApi.getScaling());
	        if(this.evaluationApi.getScaling() == -2) 
	            formattedValue += " %"
	        */
			var isACurrency = this.isACurrencyMeasure(measureName);
			var unitValue = null;
			
			var isEvaluationThresholdMeasure = false;
			var kpiMeasure = this.evaluationApi.getKpiMeasureName();
			var thresholdMeasures = this._getOtherThresholdMeasures();
			if (measureName ===  kpiMeasure) {
				isEvaluationThresholdMeasure = true;
			} else if(thresholdMeasures) {
				for(var each in thresholdMeasures) {
					if (thresholdMeasures[each] === measureName) {
						isEvaluationThresholdMeasure = true;
					}
				}
			}

			if(isACurrency) {
				var kpiMeasureUOMProperty = this.UOM_PROPERTY_MAPPING[this.evaluationApi.getKpiMeasureName()];
	        	if(kpiMeasureUOMProperty) {
	        		unitValue = rawComparisionData[kpiMeasureUOMProperty];
	        	}
			}
	        formattedValue = this.libFormat(calculatedValueForScaling, isACurrency, unitValue);
		    if(this.evaluationApi.getScaling() == -2) {
		        /*calculatedValueForScaling = calculatedValueForScaling * 100;*/
		    	if(isEvaluationThresholdMeasure) {
		    		formattedValue = this.libFormat(calculatedValueForScaling, isACurrency, null, true);
		    	} else {
		    		formattedValue = this.libFormat(calculatedValueForScaling, isACurrency);
		    	}
	            /*formattedValue += " %"*/
		    }
		}
        obj.value = Number(rawComparisionData[measureName]); 
        obj.displayValue = "" + formattedValue;
        if(this._bShowUOM && UOM) {
        	obj.displayValue += " " + rawComparisionData[UOM];
        }
        obj.color = measures[i].color;
        processedData.push(obj);
	}
	return processedData;
};
sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.doDummyProcess = function() {
    this.jsonModel.setData(this.getDummyDataForMeasureComparisonTile());
};

sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.showCMPopup = function() {
	this._CTpopOver.openBy(this);
};

sap.suite.ui.smartbusiness.tiles.MeasureComparison.prototype.initCMPopup = function() {
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
                press:jQuery.proxy(function(){if(this._CTpopOver.isOpen()){this._CTpopOver.close();}},
                	this)
            })]
    });
    this._CTpopOver = new sap.m.ResponsivePopover({
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
    oStaticArea.addContent(this._CTpopOver, true);
};

