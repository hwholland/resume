/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */

jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.drilldown.view.AnalyticalMap", {
	
	onInit: function() {
		this.parentController = null;
		if(this.getView().getViewData()) {
			var viewData = this.getView().getViewData();
			this.parentController = viewData.parent;
		}
		this.utilsRef = sap.suite.ui.smartbusiness.lib.Util.utils;
		this.getAllMapColors();
		this.mapDetails = this.getMapDetails();
	},
	onBeforeRendering: function() {
	
	},
	onAfterRendering: function() {
	
	},
	onExit: function() {
		
	},
	onRegionClick: function(e) {
		var that = this;
		jQuery.sap.log.info("Clicked on " + e.getParameter("code"));
	},
	onRegionContextMenu: function(e) {
		
	},
	formatCountryCode: function(code) {
		return code;
	},
	renderMap: function() {
		var that = this;
		var pController = that.parentController;
		var map = that.getView().analyticalMap;
		
		var tooltipBindingObject = {parts:[], formatter:jQuery.proxy(that.formatTooltip, that)};
		var allMeasures = that.mapDetails.getAllMeasures();
		tooltipBindingObject.parts.push({path:that.mapDetails.getMapDimension()});
		tooltipBindingObject.parts.push({path:that.mapDetails.getMapDimensionTextName()});
		allMeasures.forEach(function(measure){
			tooltipBindingObject.parts.push({path:measure});
		});
		
		var template = new sap.ui.vbm.Region({ 
			code: {path: that.mapDetails.getMapDimension(),formatter:jQuery.proxy(that.formatCountryCode,that)},
			color: {parts:[{path: that.mapDetails.getMapMeasure()},{path: that.mapDetails.getThresholdMeasure()}], formatter:that.getColorFormatterFunction(pController.EVALUATION, that)},
			tooltip : tooltipBindingObject//,
			//click: jQuery.proxy(that.onRegionClick, that)
		});
		
		map.bindAggregation("regions", "/data", template);
		//that.getView().analyticalMap.setModel(pController.chartModel);
	},
	getRgbaColorCode: function(sapColorCode, opacity) {
		var hexColorCode = sap.ui.core.theming.Parameters.get(sapColorCode);
		var rgba = this.utilsRef.convertHexToRgba(hexColorCode, opacity);
		return rgba;
	},
	getColorFormatterFunction: function(eval, context) {
		var colorFormatter = null;
		
		var semanticMaxFormatter = function(main, threshold) {
			main = parseFloat(main);
			threshold = parseFloat(threshold);
			return ((main > threshold) ? context.colors.semanticGoodColorRgba : ((main == threshold) ? context.colors.semanticNeutralColorRgba : context.colors.semanticBadColorRgba));
		};
		var semanticMinFormatter = function(main, threshold) {
			main = parseFloat(main);
			threshold = parseFloat(threshold);
			return ((main < threshold) ? context.colors.semanticGoodColorRgba : ((main == threshold) ? context.colors.semanticNeutralColorRgba : context.colors.semanticBadColorRgba));
		}
		var rangeFormatter = function(main, threshold) {
			main = parseFloat(main);
			threshold = parseFloat(threshold);
			return context.colors.semanticNeutralColorRgba;
		}
		var nonSemanticMaxFormatter = function(main, threshold) {
			main = parseFloat(main);
			threshold = parseFloat(threshold);
			return ((main > threshold) ? context.colors.nonSemanticGoodColorRgba : ((main == threshold) ? context.colors.nonSemanticNeutralColorRgba : context.colors.nonSemanticBadColorRgba));
		};
		var nonSemanticMinFormatter = function(main, threshold) {
			main = parseFloat(main);
			threshold = parseFloat(threshold);
			return ((main < threshold) ? context.colors.nonSemanticGoodColorRgba : ((main == threshold) ? context.colors.nonSemanticNeutralColorRgba : context.colors.nonSemanticBadColorRgba));
		}
		
		if(eval.isMaximizingKpi()) {
			colorFormatter = (context.mapDetails.isColorSchemeAutoSemantic()) ? semanticMaxFormatter : nonSemanticMaxFormatter;
		}
		else if(eval.isMinimizingKpi()) {
			colorFormatter = (context.mapDetails.isColorSchemeAutoSemantic()) ? semanticMinFormatter : nonSemanticMinFormatter;
		}
		else {
			colorFormatter = rangeFormatter;
		}
		return colorFormatter;
	},
	getAllMapColors: function() {
		this.colors = {};
		this.colors.NONSEMANTIC_GOOD_OPACITY = "1.0";
		this.colors.NONSEMANTIC_NEUTRAL_OPACITY = "0.60";
		this.colors.NONSEMANTIC_BAD_OPACITY = "0.30";
		this.colors.semanticGoodColorRgba = this.colors.semanticGoodColorRgba || this.getRgbaColorCode("sapUiPositive");
		this.colors.semanticBadColorRgba = this.colors.semanticBadColorRgba || this.getRgbaColorCode("sapUiNegative");
		this.colors.semanticNeutralColorRgba = this.colors.semanticNeutralColorRgba || this.getRgbaColorCode("sapUiNeutral");
		this.colors.nonSemanticGoodColorRgba = this.colors.nonSemanticGoodColorRgba || this.getRgbaColorCode("sapUiNeutral", this.colors.NONSEMANTIC_GOOD_OPACITY);
		this.colors.nonSemanticBadColorRgba = this.colors.nonSemanticBadColorRgba || this.getRgbaColorCode("sapUiNeutral", this.colors.NONSEMANTIC_BAD_OPACITY);
		this.colors.nonSemanticNeutralColorRgba = this.colors.nonSemanticNeutralColorRgba || this.getRgbaColorCode("sapUiNeutral", this.colors.NONSEMANTIC_NEUTRAL_OPACITY);
	},
	getMapDetails: function() {
		var pController = this.parentController;
		var selectedView = pController.SELECTED_VIEW;
		var allDimenions = selectedView.getDimensions();
		var allMeasures = selectedView.getMeasures();
		var mapDimension = (allDimenions && allDimenions.length) ? allDimenions[0] : "";
		var mapDimensionText = pController.DIMENSION_TEXT_PROPERTY_MAPPING[mapDimension];
		var chartConfiguration = (selectedView.getChartConfiguration() && selectedView.getChartConfiguration().length) ? selectedView.getChartConfiguration()[0] : null;
		var isColorSchemeAutoSemantic = chartConfiguration.getColorScheme().isAutoSemantic();
		var thresholdMeasure = "";
		var allMeasuresExceptThreshold = [];
		if(chartConfiguration) {
			thresholdMeasure = chartConfiguration.getThresholdMeasure();
			if(thresholdMeasure) {
				allMeasures.forEach(function(measure){
					if(measure != thresholdMeasure) {
						allMeasuresExceptThreshold.push(measure);
					}
				});
			}
			else {
				allMeasuresExceptThreshold = allMeasures;
			}
		}
		var mapMeasure = allMeasuresExceptThreshold[0];
		
		return {
			getMapMeasure: function() {
				return mapMeasure;
			},
			getAllMeasures: function() {
				return allMeasures;
			},
			getMapDimension: function() {
				return mapDimension;
			},
			isColorSchemeAutoSemantic: function() {
				return isColorSchemeAutoSemantic;
			},
			getThresholdMeasure: function() {
				return thresholdMeasure;
			},
			getMeasuresExceptThreshold: function() {
				return allMeasuresExceptThreshold;
			},
			setMapMeasure: function(measure) {
				mapMeasure = measure;
			},
			getMapDimensionTextName: function() {
				return mapDimensionText;
			}
		}
	},
	formatTooltip: function() {
		var pController = this.parentController;
		var values = arguments;
		var columnTextObj = pController.COLUMN_LABEL_MAPPING;
		var resourceBundle = pController.getView().getModel("i18n").getResourceBundle();
		var tooltipTxt = resourceBundle.getText("OTHER_MEASURES") + " : \n";
		var mapMeasureTxt = resourceBundle.getText("MAIN_MEASURE") + " : \n";
		var thresholdMeasureTxt = resourceBundle.getText("THRESHOLD_MEASURE") + " : \n";
		var dimensionTxt = resourceBundle.getText("DIMENSIONS") + " : \n";
		var mapMeasure = this.mapDetails.getMapMeasure();
		var thresholdMeasure = this.mapDetails.getThresholdMeasure();
		var allMeasures = this.mapDetails.getAllMeasures();
		var mapDetails = this.mapDetails;
		
		dimensionTxt += (columnTextObj[this.mapDetails.getMapDimension()] || this.mapDetails.getMapDimension()) + " - " + values[1];
		
		for(var i=0,l=allMeasures.length; i<l; i++) {
			if(allMeasures[i] == mapMeasure) { 
				mapMeasureTxt += (columnTextObj[allMeasures[i]] || allMeasures[i]) + " - " + values[i+2];
			}
			else if(allMeasures[i] == thresholdMeasure) {
				thresholdMeasureTxt += (columnTextObj[allMeasures[i]] || allMeasures[i]) + " - " + values[i+2];
			}
			else {
				tooltipTxt += (columnTextObj[allMeasures[i]] || allMeasures[i]) + " - " + values[i+2];
			}
		}
		tooltipTxt = dimensionTxt + "\n\n" + mapMeasureTxt + "\n\n" + thresholdMeasureTxt + "\n\n" + tooltipTxt;
		return tooltipTxt;
	}
	
});
