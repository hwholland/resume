/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/

jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.Formatter");

var autoFormat = (function(){
	/*****************************
	 * INTERNAL METHODS
	 ****************************/
	
	this._getMantissaLength = function(num){
        var sNum = num.toString();
        var initPos = 0;
        if(num < 0){
            initPos = 1;
        }
        return (sNum.indexOf('.') === -1 ) ? (num < 0 ? sNum.length -1:sNum.length):  
            sNum.substring(initPos, sNum.indexOf('.')).length;
    };        

    this._getLocaleFormatter_FormattedValue = function(num, oScale, oDecimal, style, isACurrencyMeasure, currencyCode) {
    	jQuery.sap.require("sap.ui.core.format.NumberFormat");
    	var formatter;
    	var formatted_value;
    	if (isACurrencyMeasure) {
    		formatter = sap.ui.core.format.NumberFormat.getCurrencyInstance({style:style, showMeasure: false});
    		currencyCode = currencyCode || null;
    		formatted_value = formatter.format(num, currencyCode);
    		return {formatter: formatter, formatted_value: formatted_value};
    	}

		/* The auto-formatter doesn't take care of %s */
		if (oScale === -2) {
			if(oDecimal == -1 || oDecimal == null || typeof oDecimal == "undefined") {
				oDecimal = 2;
	            var mantissaLength  = this._getMantissaLength(num * 100)
	            if(!(mantissaLength % 3)){
	            	oDecimal = 1;
	            }
	            if(mantissaLength % 3 === 1){
	            	oDecimal = 3;
	            }
	            if(mantissaLength % 3 === 2){
	            	oDecimal = 2;
	            }
	            if(Math.abs(num) % Math.pow(10, mantissaLength-1) == 0) {
	            	oDecimal = 0;
	            }
	            else if((Math.abs(num) % Math.pow(10, mantissaLength-1)) < 6*Math.pow(10, mantissaLength - 4)) {
	            	oDecimal = 0;
	            }
			}
			var oFormatOptions= {
					minFractionDigits: oDecimal,
					maxFractionDigits: oDecimal
			};
			formatter = sap.ui.core.format.NumberFormat.getInstance(oFormatOptions)
			formatted_value = formatter.format(num * 100);
			return {formatter: formatter, formatted_value: formatted_value};
		}
    	
        /* var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage()); */
        var sD = 2;
    	var oFormatOptions = {
    		style : style
    	};
        var fNum;
    	if(!(oDecimal==-1 || oDecimal==null)){
    		oFormatOptions.shortDecimals=Number(oDecimal);
    		oFormatOptions.minFractionDigits=Number(oDecimal);
    		oFormatOptions.maxFractionDigits=Number(oDecimal);
    	}
    	var valFormatter = sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);
        if(oDecimal == -1 || oDecimal == null) {
            var mantissaLength  = this._getMantissaLength(num)
            if(!(mantissaLength % 3)){
                sD = 1;
            }
            if(mantissaLength % 3 === 1){
                sD = 3;
            }
            if(mantissaLength % 3 === 2){
                sD = 2;
            }
            if(Math.abs(num) % Math.pow(10, mantissaLength-1) == 0) {
                sD = 0;
            }
            else if((Math.abs(num) % Math.pow(10, mantissaLength-1)) < 6*Math.pow(10, mantissaLength - 4)) {
                sD = 0;
            }                
            valFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({ style: style ,
            										shortDecimals:sD,
													minFractionDigits:sD,
													maxFractionDigits:sD
													});
            fNum = valFormatter.format(num);
        } else {
        	fNum = valFormatter.format(num);
        }
        return {formatter: valFormatter, formatted_value: fNum};
    };
    
    this._getLocaleFormattedValue = function(num, oScale, oDecimal, style, isACurrencyMeasure, currencyCode) {
    	return this._getLocaleFormatter_FormattedValue(num, oScale, oDecimal, style, isACurrencyMeasure, currencyCode)["formatted_value"];
    }
    
    this._getLocaleFormatter = function(num, oScale, oDecimal, style, isACurrencyMeasure) {
    	return this._getLocaleFormatter_FormattedValue(num, oScale, oDecimal, style, isACurrencyMeasure, null)["formatter"];
    }
    
    
    /********************************
     * API METHODS
     *******************************/
    /**
     * Returns value according to smartbusiness formatting logic
     *
     * @param {Number} num
     * 		Value to be formatted
     * @param {Number} oScale
     * 		Scaling Factor
     * @param {Number} oDecimal
     * 		Decimal Precision (-1 for Auto)
     * @param {boolean} isACurrencyMeasure
     *   	whether the value has to be formatted as currency
     */
    this.getLocaleFormattedValue = function(num, oScale, oDecimal, isACurrencyMeasure, currencyCode) {
    	isACurrencyMeasure = isACurrencyMeasure || false;
    	return this._getLocaleFormattedValue(num, oScale, oDecimal, "short", isACurrencyMeasure, currencyCode);
    };
    
    this.getLocaleFormattedValue_nonscaled = function(num, oScale, oDecimal, isACurrencyMeasure, currencyCode) {
    	isACurrencyMeasure = isACurrencyMeasure || false;
    	return this._getLocaleFormattedValue(num, oScale, oDecimal, "standard", isACurrencyMeasure, currencyCode);
    };
    
    this.getLocaleFormatter = function(num, oScale, oDecimal, isACurrencyMeasure) {
    	isACurrencyMeasure = isACurrencyMeasure || false;
    	return this._getLocaleFormatter(num, oScale, oDecimal, "short", isACurrencyMeasure);
    };
    
    this.getLocaleFormatter_nonscaled = function(num, oScale, oDecimal, isACurrencyMeasure) {
    	isACurrencyMeasure = isACurrencyMeasure || false;
    	return this._getLocaleFormatter(num, oScale, oDecimal, "standard", isACurrencyMeasure);
    };
});

sap.suite.ui.smartbusiness.lib.Formatter = new autoFormat();
