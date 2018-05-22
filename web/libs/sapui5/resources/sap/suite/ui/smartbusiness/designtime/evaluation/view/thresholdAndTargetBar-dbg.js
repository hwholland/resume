/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/

jQuery.sap.declare("sap.suite.ui.smartbusiness.designtime.evaluation.view.thresholdAndTargetBar");
jQuery.sap.includeStyleSheet("../../resources/sap/suite/ui/smartbusiness/designtime/evaluation/view/thresholdAndTargetBar.css");
sap.ui.core.Control.extend("sap.suite.ui.smartbusiness.designtime.evaluation.view.thresholdAndTargetBar", {
	metadata : {
		properties : {
			criticalLow:"int",
			warningLow:"int",
			target:"int",
			criticalHigh:"int",
			warningHigh:"int",
			goalType:"string"
		},
	},

	renderer : function (oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("thresholdAndTargetBar");
		oRm.writeClasses();
		oRm.write(">");

		switch(oControl.getGoalType()){
		case "MA" : {
			oControl.getMaximizingThresholdBar(oRm,oControl);
			break;
		}
		case "MI" : {
			oControl.getMinimizingThresholdBar(oRm,oControl);
			break;
		}
		case "RA" : {
			oControl.getRangeThresholdBar(oRm,oControl);
			break;
		}
		}
		oRm.write("</div>");
	},

	generateBlock : function(oRm,oControl,color,widthOfBlock){
		oRm.write("<div");
		oRm.addClass("block");
		oRm.writeClasses();
		oRm.addStyle("width",widthOfBlock+"%");
		oRm.addStyle("background-color",color);
		oRm.writeStyles();
		oRm.write("></div>");
	},
	
	generateBar : function(oRm,oControl,color){
		oRm.write("<div");
		oRm.addClass("thresholdBar");
		oRm.addStyle("background-color",color);
		oRm.writeStyles();
		oRm.writeClasses();
		oRm.write("></div>");
	},
	
	generateThresholdDiv : function(oRm,oControl){
		oRm.write("<div");
		oRm.addClass("thresholdDiv");
		oRm.writeClasses();
		oRm.write(">");
	},
	
	generateEmptyDiv : function(oRm,oControl,widthOfDiv){
		oRm.write("<div");
		oRm.addStyle("width",widthOfDiv+"%");
		oRm.writeStyles();
		oRm.write("></div>");
	},
	
	generateNumbers : function(oRm,oControl,num){
		oRm.write("<div");
		oRm.write(">")
		oRm.writeEscaped(num);
		oRm.write("</div>");
	},
	
	getMaximizingThresholdBar : function(oRm,oControl){
		var target=oControl.getTarget();
		var criticalLow = oControl.getCriticalLow();
		var warningLow = oControl.getWarningLow();
		var offsetWidth = 10;
		
		criticalLowSection=(criticalLow/target)*100;
		warningLowSection=((warningLow-criticalLow)/target)*100;
		targetSection = 100-(criticalLowSection+warningLowSection);
		
		oControl.generateThresholdDiv(oRm,oControl);	
		oControl.generateBlock(oRm,oControl, sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')),criticalLowSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')),warningLowSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),targetSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),offsetWidth);
		oRm.write("</div>");		//end of threshold div
		oControl.generateThresholdDiv(oRm,oControl);
		oControl.generateEmptyDiv(oRm,oControl,criticalLowSection);
		oControl.generateNumbers(oRm,oControl,"1");
		oControl.generateEmptyDiv(oRm,oControl,warningLowSection);
		oControl.generateNumbers(oRm,oControl,"2");
		oControl.generateEmptyDiv(oRm,oControl,targetSection);
		oControl.generateNumbers(oRm,oControl,"3");
		oControl.generateEmptyDiv(oRm,oControl,offsetWidth);
		oRm.write("</div>");		//end of number div
	},

	getMinimizingThresholdBar : function(oRm,oControl){
		var target=oControl.getTarget();
		var warningHigh = oControl.getWarningHigh();
		var criticalHigh = oControl.getCriticalHigh();
		var offsetWidth = 10;
		
		targetSection = (target/criticalHigh)*100;
		warningHighSection=((warningHigh-target)/criticalHigh)*100;
		criticalHighSection = ((criticalHigh-warningHigh)/criticalHigh)*100;
		
		oControl.generateThresholdDiv(oRm,oControl);	
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),offsetWidth);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),targetSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')),warningHighSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')),criticalHighSection);
		oRm.write("</div>");		//end of threshold div
		oControl.generateThresholdDiv(oRm,oControl);	
		oControl.generateEmptyDiv(oRm,oControl,offsetWidth);
		oControl.generateNumbers(oRm,oControl,"1");
		oControl.generateEmptyDiv(oRm,oControl,targetSection);
		oControl.generateNumbers(oRm,oControl,"2");
		oControl.generateEmptyDiv(oRm,oControl,warningHighSection);
		oControl.generateNumbers(oRm,oControl,"3");
		oControl.generateEmptyDiv(oRm,oControl,criticalHighSection);
		oRm.write("</div>");
	},

	getRangeThresholdBar : function(oRm,oControl){

		var target=oControl.getTarget();
		var criticalLow = oControl.getCriticalLow();
		var warningLow = oControl.getWarningLow();
		var warningHigh = oControl.getWarningHigh();
		var criticalHigh = oControl.getCriticalHigh();
		var offsetWidth = 10;
		
		criticalLowSection=(criticalLow/criticalHigh)*100;
		warningLowSection=((warningLow-criticalLow)/criticalHigh)*100;
		targetSection = (((target-warningLow)/criticalHigh)*100)/2;
		warningHighSection = ((warningHigh-target)/criticalHigh)*100;
		criticalHighSection = ((criticalHigh-warningHigh)/criticalHigh)*100;
		
		oControl.generateThresholdDiv(oRm,oControl);
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')),criticalLowSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')),warningLowSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),targetSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiPositive')),targetSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiCritical')),warningHighSection);
		oControl.generateBar(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')));
		oControl.generateBlock(oRm,oControl,sap.suite.ui.smartbusiness.lib.Util.utils.convertHexToRgba(sap.ui.core.theming.Parameters.get('sapUiNegative')),criticalHighSection);
		oRm.write("</div>");		//end of threshold buffer div
		oControl.generateThresholdDiv(oRm,oControl);
		oControl.generateEmptyDiv(oRm,oControl,criticalLowSection);
		oControl.generateNumbers(oRm,oControl,"1");
		oControl.generateEmptyDiv(oRm,oControl,warningLowSection);
		oControl.generateNumbers(oRm,oControl,"2");
		oControl.generateEmptyDiv(oRm,oControl,targetSection);
		oControl.generateNumbers(oRm,oControl,"3");
		oControl.generateEmptyDiv(oRm,oControl,targetSection);
		oControl.generateNumbers(oRm,oControl,"4");
		oControl.generateEmptyDiv(oRm,oControl,warningHighSection);
		oControl.generateNumbers(oRm,oControl,"5");
		oControl.generateEmptyDiv(oRm,oControl,criticalHighSection);
		oRm.write("</div>");
	}
});