/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides sap.ui.comp.smartmicrochart.SmartBulletMicroChart control
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/comp/providers/ChartProvider', 'sap/ui/core/Control', 'sap/suite/ui/microchart/library', 'sap/ui/core/CustomData', 'sap/m/ValueColor'],
	function(jQuery, library, ChartProvider, Control, MicroChartLibrary, CustomData, ValueColor) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.comp.smartmicrochart/SmartBulletMicroChart.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The SmartBulletMicroChart control creates a <code>sap.suite.ui.microchart.BulletMicroChart</code>
	 * based on OData metadata and the configuration specified by <code>mSettings</code>.
	 * The entitySet attribute must be specified to use the control. This attribute is used to fetch metadata and
	 * annotation information from the given default OData model. Based on this, the BulletMicroChart UI
	 * is created.
	 * <br>
	 * <b><i>Note:</i></b><br>
	 * Most of the attributes/properties are not dynamic and cannot be changed once the control has been
	 * initialized.
	 * @extends sap.ui.core.Control
	 * @version 1.38.33
	 * @since 1.38
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartmicrochart.SmartBulletMicroChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartBulletMicroChart = Control.extend("sap.ui.comp.smartmicrochart.SmartBulletMicroChart", /** @lends sap.ui.comp.smartmicrochart.SmartBulletMicroChart.prototype */ {
		metadata : {

			library : "sap.ui.comp",
			properties : {

				/**
				 * The entity set name from from where the data is fetched and and the internal BulletMicroChart representation is created.
				 * Note that this is not a dynamic UI5 property.
				 */
				entitySet : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Determines if any label is shown or not
				 */
				showLabel: {
					type: "boolean",
					group : "Appearance",
					defaultValue: true
				},

				/**
				 * Specifies the chart type. Note that this property is read-only.
				 */
				chartType : {
					type : "string",
					group : "Misc",
					defaultValue : "Bullet"
				},

				/**
				 * If set to <code>true</code>, this enables automatic binding of the chart using the chartBindingPath (if it exists)
				 * property.
				 */
				enableAutoBinding: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * This attribute can be used to specify the relative path ( without '/') to an entity ( not an entitySet) that
				 * is used during the binding of the chart. It can be e.g. a navigation property which will be added to the context path
				 */
				chartBindingPath : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Defines the width.
				 */
				width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : "164px"},

				/**
	 			 * If this is set to true, width and height of the control are determined by the width and height of the container in which the control is placed.
	 			 * <code>width</code> property is ignored in such case.
				 */
				isResponsive: {type: "boolean", group: "Appearance", defaultValue: false}

			},
			defaultAggregation: "_chart",
			aggregations: {
				/**
				 * This private aggregation is used for the internal binding of the DataPoint/CriticalityCalculation values used for calculation of the bar color
				 */
				_criticalityThresholds : {
					type : "sap.ui.core.CustomData",
					multiple : true,
					visibility : "hidden"
				},

				/**
				 * This private aggregation is used for the internal binding of the sap.suite.ui.microchart.BulletMicroChart
				 */
				_chart : {
					type : "sap.suite.ui.microchart.BulletMicroChart",
					multiple : false,
					visibility : "hidden"
				}
			},

			associations : {
				/**
				 * If the associated control is provided, its <code>text</code> property is set to the Title property of the Chart annotation.
				 * Title property of the DataPoint annotation is ignored.
				 * @since 1.38.0
				 */
				chartTitle : {
					type : "sap.m.Label",
					group : "Misc",
					multiple : false
				},
				/**
				 * If the associated control is provided, its <code>text</code> property is set to the Description property of the Chart annotation.
				 * Description property of the DataPoint annotation is ignored.
				 * @since 1.38.0
				 */
				chartDescription : {
					type : "sap.m.Label",
					group : "Misc",
					multiple : false
				},
				/**
				 * If the associated control is provided, its <code>text</code> property is set to the Unit of Measure. The Value property of the DataPoint annotation should be annotated with this Unit of Measure. It can be either ISOCurrency or Unit from the OData Measures annotations.
				 * @since 1.38.0
				 */
				unitOfMeasure : {
					type : "sap.m.Label",
					group : "Misc",
					multiple : false
				}
			},

			events : {

				/**
				 * Event fired once the control has been initialized.
				 */
				initialize : {}
			}
		}
	});

	SmartBulletMicroChart._GOOD_COLOR  = ValueColor.Good;
	SmartBulletMicroChart._CRITICAL_COLOR = ValueColor.Critical;
	SmartBulletMicroChart._ERROR_COLOR = ValueColor.Error;
	SmartBulletMicroChart._NEUTRAL_COLOR = ValueColor.Neutral;
	SmartBulletMicroChart._TARGET = "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target";
	SmartBulletMicroChart._MINIMIZE = "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize";
	SmartBulletMicroChart._MAXIMIZE = "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize";

	SmartBulletMicroChart.prototype.init = function() {
		this._bIsInitialized = false;
		this._bMetaModelLoadAttached = false;
		this._bBarColorSet = false;
		this.setProperty("chartType", "Bullet", true);
		this.setAggregation("_chart", new MicroChartLibrary.BulletMicroChart(), true);
	};

	/**
	 * Retrieve the bar color for the respective criticality type.
	 * @param {string} type The full criticality type as defined in the vocabulary or just the EnumMember's name
	 * @return {sap.m.ValueColor} The color that is associated with the criticality type
	 * @private
	 */
	SmartBulletMicroChart._mapCriticalityTypeWithColor = function(type) {
		var sType;
		if (!type) {
			return SmartBulletMicroChart._NEUTRAL_COLOR;
		} else if (jQuery.isNumeric(type)) {
			sType = type.toString();
		} else {
			sType = type;
		}
		sType = (sType.match(/(?:CriticalityType\/)?([^\/]*)$/) || [])[1] || "";
		switch (sType) {
			case 'Negative':
			case '1':
				return SmartBulletMicroChart._ERROR_COLOR;
			case 'Positive':
			case '3':
				return SmartBulletMicroChart._GOOD_COLOR;
			case 'Critical':
			case '2':
				return SmartBulletMicroChart._CRITICAL_COLOR;
			default:
				return SmartBulletMicroChart._NEUTRAL_COLOR;
		}
	};

	/**
	 * @private
	 */
	SmartBulletMicroChart.prototype.setChartType = function () {
		return this;
	};

	SmartBulletMicroChart.prototype.setEntitySet = function(entitySetName) {
		if (this.getProperty("entitySet") !== entitySetName) {
			this.setProperty("entitySet", entitySetName, true);
			this._initializeMetadata();
		}
		return this;
	};

	SmartBulletMicroChart.prototype.setShowLabel = function(bShowLabel) {
		if (this.getShowLabel() !== bShowLabel) {
			this.setProperty("showLabel", bShowLabel, true);
			var oChart = this.getAggregation("_chart");
			oChart.setProperty("showActualValue", bShowLabel, true);
			oChart.setProperty("showTargetValue", bShowLabel, true);
			oChart.setProperty("showDeltaValue", bShowLabel, true);
			oChart.setProperty("showValueMarker", bShowLabel, true);
			this.invalidate();
		}
		return this;
	};

	/**
	 * @private
	 */
	SmartBulletMicroChart.prototype.setChartType = function() {
		return this;
	};

	SmartBulletMicroChart.prototype.propagateProperties = function() {
		if (Control.prototype.propagateProperties) {
			Control.prototype.propagateProperties.apply(this, arguments);
		}
		this._initializeMetadata();
	};

	SmartBulletMicroChart.prototype.onBeforeRendering = function() {
		var oChart = this.getAggregation("_chart"); 
		oChart.setProperty("width", this.getWidth(), true);
		if (oChart.getMetadata().hasProperty("isResponsive")) {
			oChart.setProperty("isResponsive", this.getIsResponsive(), true);
			MicroChartLibrary._passParentContextToChild(this, oChart);
		}
	};

	/**
	 * Initializes the OData metadata necessary to create the chart
	 * @private
	 */
	SmartBulletMicroChart.prototype._initializeMetadata = function() {
		if (!this._bIsInitialized) {
			var oModel = this.getModel();
			if (oModel && (oModel instanceof sap.ui.model.odata.v2.ODataModel || oModel instanceof sap.ui.model.odata.ODataModel)) {
				if (!this._bMetaModelLoadAttached) {
					oModel.getMetaModel().loaded().then(this._onMetadataInitialized.bind(this));
					this._bMetaModelLoadAttached = true;
				}
			} else if (oModel) {
				// Could be a non ODataModel or a synchronous ODataModel --> just create the necessary helpers
				this._onMetadataInitialized();
			}
		}
	};

	/**
	 * Creates an instance of the chart provider
	 * @private
	 */
	SmartBulletMicroChart.prototype._createChartProvider = function() {
		var oModel, sEntitySetName;
		sEntitySetName = this.getEntitySet();
		oModel = this.getModel();

		// The SmartBulletMicroChart might also need to work for non ODataModel
		// models; hence we now create the chart independent
		// of ODataModel.
		if (oModel && sEntitySetName) {
			this._oChartProvider = new ChartProvider({
				entitySet : sEntitySetName,
				model : oModel
			});
		}
	};

	/**
	 * Called once the necessary Model metadata is available
	 * @private
	 */
	SmartBulletMicroChart.prototype._onMetadataInitialized = function() {
		var sBindingPath;
		this._bMetaModelLoadAttached = false;
		if (!this._bIsInitialized) {
			this._createChartProvider();
			if (this._oChartProvider) {
				this._oChartViewMetadata = this._oChartProvider.getChartViewMetadata();
				if (this._oChartViewMetadata) {
					this._oDataPointMetadata = this._oChartProvider.getChartDataPointMetadata();
					// Indicates the control is initialized and can be used in
					// the initialize event/otherwise!
					this._bIsInitialized = true;
					this.fireInitialize();
					this._createAndBindInnerChart();
					if (this.getEnableAutoBinding()) {
						if (this.getChartBindingPath()) {
							sBindingPath = this.getChartBindingPath();
							this.bindElement(sBindingPath);
						} else {
							jQuery.sap.log.error("The property chartBindingPath is not set thus the property enableAutoBinding cannot be applied");
						}
					}
				}
			}
		}
	};

	SmartBulletMicroChart.prototype._createAndBindInnerChart = function() {
		// checks the validation of Chart metadata
		if (!this._checkChartMetadata()) {
			jQuery.sap.log.error("The chart annotation contain errors. Please check the chart annotation.");
			return;
		}
		var sQualifier = this._getDatapointQualifier();
		// finds the DataPoint annotation in additionalAnnotations if the qualifier exists, otherwise point to the primaryAnnotation
		if (sQualifier) {
			this._oDataPointAnnotations = this._oDataPointMetadata.additionalAnnotations[sQualifier];
		} else {
			this._oDataPointAnnotations = this._oDataPointMetadata.primaryAnnotation;
		}
		if (this._oDataPointAnnotations) {
			if (!this._checkDataPointAnnotation()) {
				return;
			}
			this.getAggregation("_chart").addDelegate({
				onBeforeRendering : this._calculateBarColor.bind(this)
			}, this);
			this._bindValueProperties();
			this._bindAggregationActual();
			if (!this._bBarColorSet) {
				this._bindValuesForCriticalityCalculation(); // if bar color is set directly we do not need to bind _criticalityThresholds aggregation
			}
			// binds the criticality calculation properties to the threshold aggregation of SmartBulletChart
			this._bindChartThresholds();
			this.setAssociation();
		} else {
			jQuery.sap.log.error("The datapoint annotation is empty. Please check the datapoint annotation.");
		}
	};

	/**
	 * Binds control properties to the entity type properties
	 * @private
	 */
	SmartBulletMicroChart.prototype._bindValueProperties = function() {
		var fMaxValue, fMinValue;
		var oInnerChart = this.getAggregation("_chart");
		if (this._oDataPointAnnotations.TargetValue && this._oDataPointAnnotations.TargetValue.hasOwnProperty("Path")) {
			oInnerChart.bindProperty("targetValue", {
				path : this._oDataPointAnnotations.TargetValue.Path,
				type : "sap.ui.model.odata.type.Decimal"
			});
		}
		if (this._oDataPointAnnotations.ForecastValue && this._oDataPointAnnotations.ForecastValue.hasOwnProperty("Path")) {
			oInnerChart.bindProperty("forecastValue", {
				path : this._oDataPointAnnotations.ForecastValue.Path,
				type : "sap.ui.model.odata.type.Decimal"
			});
		}
		if (this._oDataPointAnnotations.MaximumValue) {
			if (this._oDataPointAnnotations.MaximumValue.hasOwnProperty("Path")) { // for compatibility reasons we have to support Path as well
				oInnerChart.bindProperty("maxValue", {
					path : this._oDataPointAnnotations.MaximumValue.Path,
					type : "sap.ui.model.odata.type.Decimal"
				});
			} else if (this._oDataPointAnnotations.MaximumValue.hasOwnProperty("Decimal")) {
				fMaxValue = parseFloat(this._oDataPointAnnotations.MaximumValue.Decimal);
				oInnerChart.setMaxValue(fMaxValue, true);
			}
		}

		if (this._oDataPointAnnotations.MinimumValue) {
			if (this._oDataPointAnnotations.MinimumValue.hasOwnProperty("Path")) { // for compatibility reasons we have to support Path as well
				oInnerChart.bindProperty("minValue", {
					path : this._oDataPointAnnotations.MinimumValue.Path,
					type : "sap.ui.model.odata.type.Decimal"
				});
			} else if (this._oDataPointAnnotations.MinimumValue.hasOwnProperty("Decimal")) {
				fMinValue = parseFloat(this._oDataPointAnnotations.MinimumValue.Decimal);
				oInnerChart.setMinValue(fMinValue, true);
			}
		}
	};


	/**
	 * Binds control aggregation 'actual' of the BulletMicroChart
	 * @private
	 */
	SmartBulletMicroChart.prototype._bindAggregationActual = function() {
		var oChartData;
		// if 'criticality' annotation is present in the metadata.xml its path is bound to the color property of the 'actual' aggregation
		if (this._oDataPointAnnotations.Criticality && this._oDataPointAnnotations.Criticality.hasOwnProperty("Path")) {
			oChartData = new MicroChartLibrary.BulletMicroChartData({
				value : {
					path : this._oDataPointAnnotations.Value.Path,
					type : "sap.ui.model.odata.type.Decimal"
				},
				color : {
					path : this._oDataPointAnnotations.Criticality.Path,
					formatter : SmartBulletMicroChart._mapCriticalityTypeWithColor
				}
			});
			this._bBarColorSet = true; // if the bar color is bound here we do not need to bind _criticalityThresholds aggregation and calculate the color

		} else {
			oChartData = new MicroChartLibrary.BulletMicroChartData({
				value : {
					path : this._oDataPointAnnotations.Value.Path,
					type : "sap.ui.model.odata.type.Decimal"
				}
			});
		}
		this.getAggregation("_chart").setAggregation("actual", oChartData, true);
	};

	/**
	 * Binds the criticality calculation properties to the thresholds of SmartBulletMicroChart according to different direction
	 * @private
	 */
	SmartBulletMicroChart.prototype._bindChartThresholds = function() {
		var sDirection, oCriticality;
		if (this._oDataPointAnnotations.CriticalityCalculation && this._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection &&
				this._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection.EnumMember) {
			oCriticality = this._oDataPointAnnotations.CriticalityCalculation;
			sDirection = oCriticality.ImprovementDirection.EnumMember;
			if (sDirection !== SmartBulletMicroChart._MINIMIZE && oCriticality.DeviationRangeLowValue && oCriticality.DeviationRangeLowValue.Path) {
				this._bindThresholdAggregation("thresholds", oCriticality.DeviationRangeLowValue.Path, SmartBulletMicroChart._ERROR_COLOR);
			}
			if (sDirection !== SmartBulletMicroChart._MINIMIZE && oCriticality.ToleranceRangeLowValue && oCriticality.ToleranceRangeLowValue.Path) {
				this._bindThresholdAggregation("thresholds", oCriticality.ToleranceRangeLowValue.Path, SmartBulletMicroChart._CRITICAL_COLOR);
			}
			if (sDirection !== SmartBulletMicroChart._MAXIMIZE && oCriticality.ToleranceRangeHighValue && oCriticality.ToleranceRangeHighValue.Path) {
				this._bindThresholdAggregation("thresholds", oCriticality.ToleranceRangeHighValue.Path, SmartBulletMicroChart._CRITICAL_COLOR);
			}
			if (sDirection !== SmartBulletMicroChart._MAXIMIZE && oCriticality.DeviationRangeHighValue && oCriticality.DeviationRangeHighValue.Path) {
				this._bindThresholdAggregation("thresholds", oCriticality.DeviationRangeHighValue.Path, SmartBulletMicroChart._ERROR_COLOR);
			}
		}
	};

	/**
	 * Adds aggregation for the SmartBulletMicroChart
	 * @param {string} sAggregationName which identifying the aggregation that SmartBulletMicroChart should be added to
	 * @param {string} sPath which is the value path from the OData metadata
	 * @param {string} sColor which is the semantic color of the value
	 * @private
	 */
	SmartBulletMicroChart.prototype._bindThresholdAggregation = function (sAggregationName, sPath, sColor) {
		var oThreshold = new MicroChartLibrary.BulletMicroChartData({
			value: {
				path : sPath,
				type : "sap.ui.model.odata.type.Decimal"
			},
			color: sColor
		});
		this.getAggregation("_chart").addAggregation(sAggregationName, oThreshold, true);
	};


	/**
	 * Binds values of DataPoint.CriticalityCalculation annotation to the hidden aggregation so that in 'OnBeforeRendering' the bar color can be calculated from them
	 * @private
	 */
	SmartBulletMicroChart.prototype._bindValuesForCriticalityCalculation = function() {
		var oCriticalityCalculation = this._oDataPointAnnotations.CriticalityCalculation;
		if (!oCriticalityCalculation) {
			return;
		}

		if ( oCriticalityCalculation.DeviationRangeLowValue && oCriticalityCalculation.DeviationRangeLowValue.hasOwnProperty("Path")) {
			this._bindCriticalityValues("deviationLow", oCriticalityCalculation.DeviationRangeLowValue.Path);
		}
		if ( oCriticalityCalculation.DeviationRangeHighValue && oCriticalityCalculation.DeviationRangeHighValue.hasOwnProperty("Path")) {
			this._bindCriticalityValues("deviationHigh", oCriticalityCalculation.DeviationRangeHighValue.Path);
		}
		if ( oCriticalityCalculation.ToleranceRangeLowValue && oCriticalityCalculation.ToleranceRangeLowValue.hasOwnProperty("Path")) {
			this._bindCriticalityValues("toleranceLow", oCriticalityCalculation.ToleranceRangeLowValue.Path);
		}
		if ( oCriticalityCalculation.ToleranceRangeHighValue && oCriticalityCalculation.ToleranceRangeHighValue.hasOwnProperty("Path")) {
			this._bindCriticalityValues("toleranceHigh", oCriticalityCalculation.ToleranceRangeHighValue.Path);
		}
	};

	/**
	 * Binds hidden aggregation '_criticalityThresholds'
	 * @param {string} sCriticalityKey		Threshold name
	 * @param {string} sCriticalityValue	The path to the threshold's value
	 * @private
	 */
	SmartBulletMicroChart.prototype._bindCriticalityValues = function(sCriticalityKey, sCriticalityValue) {
		var oCriticality = new CustomData({
			key: sCriticalityKey,
			value:  "{" + sCriticalityValue + "}"
		});
		this.addAggregation("_criticalityThresholds", oCriticality, false);
	};

	/**
	 * Gets the qualifier of DataPoint in Chart annotation
	 * @private
	 */
	SmartBulletMicroChart.prototype._getDatapointQualifier = function() {
		var oMeasureAttribute, sDatapointQualifier, aPath, sQualifier;
		if (this._oChartViewMetadata) {
			if (this._oChartViewMetadata.annotation && this._oChartViewMetadata.annotation.hasOwnProperty("MeasureAttributes") && this._oChartViewMetadata.annotation.MeasureAttributes.length > 0) {
				oMeasureAttribute = this._oChartViewMetadata.annotation.MeasureAttributes[0];
				if (oMeasureAttribute.DataPoint && oMeasureAttribute.DataPoint.hasOwnProperty("AnnotationPath")) {
					sQualifier = oMeasureAttribute.DataPoint.AnnotationPath;
					aPath = sQualifier.split("#");
					if (aPath.length === 2) {
						sDatapointQualifier = aPath[1];
					}
				}
			}
		}
		return sDatapointQualifier;
	};

	/**
	 * Calculate the bar color based on the CriticalityCalculation of the DataPoint annotation
	 * @private
	 */
	SmartBulletMicroChart.prototype._calculateBarColor = function() {
		var oThresholds = {}, iValue, oCriticalityCalculation, sDirection, iDeviationLow, iDeviationHigh, iToleranceLow, iToleranceHigh;
		if (this._bBarColorSet) { // if bar color is set directly it does not have to be calculated
			return;
		}
		oThresholds = this._getCriticalityThresholdsValues();
		if (jQuery.isEmptyObject(oThresholds)) {
			return;
		}
		iValue = this.getAggregation("_chart").getActual().getValue();
		oCriticalityCalculation = this._oDataPointAnnotations.CriticalityCalculation;
		if (oCriticalityCalculation.ImprovementDirection && oCriticalityCalculation.ImprovementDirection.EnumMember) {
			sDirection = oCriticalityCalculation.ImprovementDirection.EnumMember;
		} else {
			jQuery.sap.log.error("Without 'ImprovementDirection' annotation bar color cannot be calculated");
			return; // without 'ImprovementDirection' annotation bar color cannot be calculated
		}
		iDeviationLow = oThresholds.deviationLow;
		iDeviationHigh = oThresholds.deviationHigh;
		iToleranceLow = oThresholds.toleranceLow;
		iToleranceHigh = oThresholds.toleranceHigh;

		if (sDirection && sDirection === SmartBulletMicroChart._TARGET) {
			this._setBarColorForTarget(iValue, iToleranceLow, iToleranceHigh, iDeviationLow, iDeviationHigh);
		} else if (sDirection && sDirection === SmartBulletMicroChart._MINIMIZE) {
			this._setBarColorForMinimize(iValue, iToleranceLow, iToleranceHigh, iDeviationLow, iDeviationHigh);
		} else if (sDirection && sDirection === SmartBulletMicroChart._MAXIMIZE) {
			this._setBarColorForMaximize(iValue, iToleranceLow, iToleranceHigh, iDeviationLow, iDeviationHigh);
		}
	};

	/**
	 * Map the _criticalityThresholds aggregation to oThresholds
	 * @returns {Object} oThresholds
	 * @private
	 */
	SmartBulletMicroChart.prototype._getCriticalityThresholdsValues = function() {
		var oThresholds = {}, i;
		var aCriticalityThresholds = this.getAggregation("_criticalityThresholds");
		if (aCriticalityThresholds) {
			var iCriticalityThresholdsNumber = aCriticalityThresholds.length;
			for (i = 0; i < iCriticalityThresholdsNumber; i++) {
				if (aCriticalityThresholds[i].getKey() && aCriticalityThresholds[i].getValue() !== null) {
					oThresholds[aCriticalityThresholds[i].getKey()] = aCriticalityThresholds[i].getValue();
				}
			}
		}
		return oThresholds;
	};

	/**
	 * Determine and set the bar color for the 'Target' value of the ImprovementDirection of the DataPoint annotation
	 * @private
	 */
	SmartBulletMicroChart.prototype._setBarColorForTarget = function(iValue, iToleranceLow, iToleranceHigh, iDeviationLow, iDeviationHigh) {
		var oInnerChart = this.getAggregation("_chart");
		if (iValue >= iToleranceLow && iValue <= iToleranceHigh) {
			oInnerChart.getActual().setProperty("color", SmartBulletMicroChart._GOOD_COLOR, true);
		} else if ((iValue >= iDeviationLow && iValue < iToleranceLow) || (iValue > iToleranceHigh && iValue <= iDeviationHigh)) {
			oInnerChart.getActual().setProperty("color", SmartBulletMicroChart._CRITICAL_COLOR, true);
		} else if (iValue < iDeviationLow || iValue > iDeviationHigh) {
			oInnerChart.getActual().setProperty("color", SmartBulletMicroChart._ERROR_COLOR, true);
		}
	};

	/**
	 * Determine and set the bar color for the 'Minimize' value of the ImprovementDirection of the DataPoint annotation
	 * @private
	 */
	SmartBulletMicroChart.prototype._setBarColorForMinimize = function(iValue, iToleranceLow, iToleranceHigh, iDeviationLow, iDeviationHigh) {
		var oInnerChart = this.getAggregation("_chart");
		if (iValue <= iToleranceHigh) {
			oInnerChart.getActual().setProperty("color", SmartBulletMicroChart._GOOD_COLOR, true);
		} else if (iValue > iToleranceHigh && iValue <= iDeviationHigh) {
			oInnerChart.getActual().setProperty("color", SmartBulletMicroChart._CRITICAL_COLOR, true);
		} else if (iValue > iDeviationHigh) {
			oInnerChart.getActual().setProperty("color", SmartBulletMicroChart._ERROR_COLOR, true);
		}
	};

	/**
	 * Determine and set the bar color for the 'Maximize' value of the ImprovementDirection of the DataPoint annotation
	 * @private
	 */
	SmartBulletMicroChart.prototype._setBarColorForMaximize = function(iValue, iToleranceLow, iToleranceHigh, iDeviationLow, iDeviationHigh) {
		var oInnerChart = this.getAggregation("_chart");
		if (iValue >= iToleranceLow) {
			oInnerChart.getActual().setProperty("color", SmartBulletMicroChart._GOOD_COLOR, true);
		} else if (iValue < iToleranceLow && iValue >= iDeviationLow) {
			oInnerChart.getActual().setProperty("color", SmartBulletMicroChart._CRITICAL_COLOR, true);
		} else if (iValue < iDeviationLow) {
			oInnerChart.getActual().setProperty("color", SmartBulletMicroChart._ERROR_COLOR, true);
		}
	};


	/**
	 * Checks the validation of the Chart annotation.
	 * @private
	 */
	SmartBulletMicroChart.prototype._checkChartMetadata = function() {
		if (jQuery.isEmptyObject(this._oChartViewMetadata) && jQuery.isEmptyObject(this._oDataPointMetadata)) {
			jQuery.sap.log.error("The Chart or DataPoint annotation is empty.");
			return false;
		}
		if (this._oChartViewMetadata.annotation && this._oChartViewMetadata.annotation.ChartType) {
			// the chartType property in Chart annotation should be bullet
			if (this._oChartViewMetadata.annotation.ChartType.EnumMember === "com.sap.vocabularies.UI.v1.ChartType/Bullet") {
				return true;
			} else {
				jQuery.sap.log.error("The ChartType property in the Chart annotation is not bullet.");
				return false;
			}
		} else {
			jQuery.sap.log.error("The Chart annotation is invalid.");
			return false;
		}
	};

	/**
	 * Checks the validation of the DataPoint annotation.
	 * @private
	 */
	SmartBulletMicroChart.prototype._checkDataPointAnnotation = function() {
		var oCriticality;
		if (jQuery.isEmptyObject(this._oDataPointAnnotations)) {
			jQuery.sap.log.error("The DataPoint annotation is an empty object.");
			return false;
		}
		// when the Value property does not exist in the DataPoint annotation object, return false
		if (this._oDataPointAnnotations.Value && this._oDataPointAnnotations.Value.Path) {
			oCriticality = this._oDataPointAnnotations.CriticalityCalculation;
			this._checkCriticalityMetadata(oCriticality);
			return true;
		} else {
			jQuery.sap.log.error("The Value property does not exist in the DataPoint annotation. " +
					"This property is mandentory to generate the SmartBulletChart.");
			return false;
		}
	};

	/**
	 * Checks the validation of the CriticalityCalculation annotation.
	 * @param {object} oCriticality
	 * @private
	 */
	SmartBulletMicroChart.prototype._checkCriticalityMetadata = function(oCriticality) {
		var sImprovementDirection;
		if (jQuery.isEmptyObject(oCriticality)) {
			jQuery.sap.log.warning("The CriticalityCalculation property in DataPoint annotation is not provided.");
			return;
		}
		if (oCriticality.ImprovementDirection && oCriticality.ImprovementDirection.EnumMember) {
			sImprovementDirection = oCriticality.ImprovementDirection.EnumMember;

			switch (sImprovementDirection) {
			// Target improvement direction should contain all of the four criticality calculation properties
			case SmartBulletMicroChart._TARGET:
				this._checkCriticalityMetadataForTarget(oCriticality);
				break;
			// Minimize improvement direction should contain ToleranceRangeHighValue and DeviationRangeHighValue properties
			case SmartBulletMicroChart._MINIMIZE:
				this._checkCriticalityMetadataForMinimize(oCriticality);
				break;
			// Maximize improvement direction should contain DeviationRangeLowValue and ToleranceRangeLowValue properties
			case SmartBulletMicroChart._MAXIMIZE:
				this._checkCriticalityMetadataForMaximize(oCriticality);
				break;
			case "":
				jQuery.sap.log.warning("The improvement direction in DatPoint annotation is empty, it must be either Target, Minimize or Maximize.");
				break;
			default:
				jQuery.sap.log.warning("The improvement direction in DataPoint annotation must be either Target, Minimize or Maximize.");
			}
		} else {
			jQuery.sap.log.warning("The ImprovementDirection property in DataPoint annotation is not provided.");
		}
	};

	/**
	 * Checks the validation of the CriticalityCalculation annotation for target improvement direction.
	 * @param {object} oCriticality
	 * @private
	 */
	SmartBulletMicroChart.prototype._checkCriticalityMetadataForTarget = function(oCriticality) {
		if (!oCriticality.DeviationRangeLowValue || !oCriticality.DeviationRangeLowValue.Path) {
			jQuery.sap.log.warning("The DeviationRangeLowValue property in DataPoint annotation is missing for Target improvement direction.");
		}
		if (!oCriticality.ToleranceRangeLowValue || !oCriticality.ToleranceRangeLowValue.Path) {
			jQuery.sap.log.warning("The ToleranceRangeLowValue property in DataPoint annotation is missing for Target improvement direction.");
		}
		if (!oCriticality.ToleranceRangeHighValue || !oCriticality.ToleranceRangeHighValue.Path) {
			jQuery.sap.log.warning("The ToleranceRangeHighValue property in DataPoint annotation is missing for Target improvement direction.");
		}
		if (!oCriticality.DeviationRangeHighValue || !oCriticality.DeviationRangeHighValue.Path) {
			jQuery.sap.log.warning("The DeviationRangeHighValue property in DataPoint annotation is missing for Target improvement direction.");
		}
	};

	/**
	 * Checks the validation of the CriticalityCalculation annotation for minimize improvement direction.
	 * @param {object} oCriticality
	 * @private
	 */
	SmartBulletMicroChart.prototype._checkCriticalityMetadataForMinimize = function(oCriticality) {
		if (!oCriticality.ToleranceRangeHighValue || !oCriticality.ToleranceRangeHighValue.Path) {
			jQuery.sap.log.warning("The ToleranceRangeHighValue property in DataPoint annotation is missing for Minimize improvement direction.");
		}
		if (!oCriticality.DeviationRangeHighValue || !oCriticality.DeviationRangeHighValue.Path) {
			jQuery.sap.log.warning("The DeviationRangeHighValue property in DataPoint annotation is missing for Minimize improvement direction.");
		}
	};

	/**
	 * Checks the validation of the CriticalityCalculation annotation for maximize improvement direction.
	 * @param {object} oCriticality
	 * @private
	 */
	SmartBulletMicroChart.prototype._checkCriticalityMetadataForMaximize = function(oCriticality) {
		if (!oCriticality.DeviationRangeLowValue || !oCriticality.DeviationRangeLowValue.Path) {
			jQuery.sap.log.warning("The DeviationRangeLowValue property in DataPoint annotation is missing for Maximize improvement direction.");
		}
		if (!oCriticality.ToleranceRangeLowValue || !oCriticality.ToleranceRangeLowValue.Path) {
			jQuery.sap.log.warning("The ToleranceRangeLowValue property in DataPoint annotation is missing for Maximize improvement direction.");
		}
	};

	SmartBulletMicroChart.prototype.setAssociation = function (sAssociationName, sId, bSuppressInvalidate) {
		if (Control.prototype.setAssociation) {
			Control.prototype.setAssociation.apply(this, arguments);
		}
		var oUnit, oChartTitle, oChartDescription;
		oChartDescription = sap.ui.getCore().byId(this.getAssociation("chartDescription"));
		if (oChartDescription) {
			if (!(oChartDescription instanceof sap.m.Label)) {
				jQuery.sap.log.error("Control in association chartDescription should be of type sap.m.Label");
			} else {
				this._setChartDescription(oChartDescription);
			}
		}

		oChartTitle = sap.ui.getCore().byId(this.getAssociation("chartTitle"));
		if (oChartTitle) {
			if (!(oChartTitle instanceof sap.m.Label)) {
				jQuery.sap.log.error("Control in association chartTitle should be of type sap.m.Label");
			} else {
				this._setChartTitle(oChartTitle);
			}
		}

		oUnit = sap.ui.getCore().byId(this.getAssociation("unitOfMeasure"));
		if (oUnit) {
			if (!(oUnit instanceof sap.m.Label)) {
				jQuery.sap.log.error("Control in association unitOfMeasure should be of type sap.m.Label");
			} else {
				this._setUnitOfMeasure(oUnit);
			}
		}
		return this;
	};

	/**
	 * Set or binds the Property "text" of the association chartTitle
	 * @private
	 */
	SmartBulletMicroChart.prototype._setChartTitle = function(oChartTitle) {
		if (this._oChartViewMetadata && this._oChartViewMetadata.annotation && this._oChartViewMetadata.annotation.Title) {
			if (this._oChartViewMetadata.annotation.Title.hasOwnProperty("Path")) {
				oChartTitle.bindProperty("text", {
					path : this._oChartViewMetadata.annotation.Title.Path
				});
				oChartTitle.invalidate();
			} else if (this._oChartViewMetadata.annotation.Title.hasOwnProperty("String")) {
				if (this._oChartViewMetadata.annotation.Title.String.indexOf("{") === 0) {
					var aParts = this._oChartViewMetadata.annotation.Title.String.split(">");
					oChartTitle.bindProperty("text", {
						path : aParts[1].substring(0, aParts[1].length - 1),
						model : aParts[0].substring(1, aParts[1].length)
					});
					oChartTitle.invalidate();
				} else {
					oChartTitle.setProperty("text", this._oChartViewMetadata.annotation.Title.String, false);
				}
			}
		}
	};


	/**
	 * Set or bind the Property "text" of the association chartDescription
	 * @private
	 */
	SmartBulletMicroChart.prototype._setChartDescription = function(oChartDescription) {
		if (this._oChartViewMetadata && this._oChartViewMetadata.annotation && this._oChartViewMetadata.annotation.Description) {
			if (this._oChartViewMetadata.annotation.Description.hasOwnProperty("Path")) {
				oChartDescription.bindProperty("text", {
					path : this._oChartViewMetadata.annotation.Description.Path
				});
				oChartDescription.invalidate();
			} else if (this._oChartViewMetadata.annotation.Description.hasOwnProperty("String")) {
				if (this._oChartViewMetadata.annotation.Description.String.indexOf("{") === 0) {
					var aParts = this._oChartViewMetadata.annotation.Description.String.split(">");
					oChartDescription.bindProperty("text", {
						path : aParts[1].substring(0, aParts[1].length - 1),
						model : aParts[0].substring(1, aParts[1].length)
					});
					oChartDescription.invalidate();
				} else {
					oChartDescription.setProperty("text", this._oChartViewMetadata.annotation.Description.String, false);
				}
			}
		}
	};

	/**
	 * Set or bind the Property "text" of the association unitOfMeasure
	 * @private
	 */
	SmartBulletMicroChart.prototype._setUnitOfMeasure = function(oUnitOfMeasure) {
		var oUnitOfMeasureAnnotation = this._getUnitOfMeasureAnnotation();
		if (oUnitOfMeasureAnnotation && oUnitOfMeasureAnnotation.Path) {
			oUnitOfMeasure.bindProperty("text", {
				path : oUnitOfMeasureAnnotation.Path
			});
			oUnitOfMeasure.invalidate();
		} else if (oUnitOfMeasureAnnotation && oUnitOfMeasureAnnotation.String) {
			if (oUnitOfMeasureAnnotation.String.indexOf("{") === 0) {
				var aParts = oUnitOfMeasureAnnotation.String.split(">");
				oUnitOfMeasure.bindProperty("text", {
					path : aParts[1].substring(0, aParts[1].length - 1),
					model : aParts[0].substring(1, aParts[1].length)
				});
				oUnitOfMeasure.invalidate();
			} else {
				oUnitOfMeasure.setProperty("text", oUnitOfMeasureAnnotation.String, false);
			}
		}
	};

	/**
	 * Get the UnitOfMeasure Annotation for the EntityType property of the DataPoint Value annotation
	 * We consider either ISOCurrency or Unit annotation terms from the Measures annotations
	 * @returns {Object}
	 * @private
	 */
	SmartBulletMicroChart.prototype._getUnitOfMeasureAnnotation = function() {
		var sProp, oPropertyAnnotation;
		if (!this._oDataPointAnnotations) {
			return {};
		}
		if (this._oDataPointAnnotations.Value && this._oDataPointAnnotations.Value.Path) {
			oPropertyAnnotation = this._getPropertyAnnotation(this._oDataPointAnnotations.Value.Path);
		}
		if (oPropertyAnnotation) {
			for (sProp in oPropertyAnnotation) {
				if ((sProp.indexOf("ISOCurrency") > -1) || (sProp.indexOf("Unit") > -1)) {
					return oPropertyAnnotation[sProp];
				}
			}
		}
	};

	/**
	 * Get all annotations for the entityType property
	 * @param {string} sEntityTypePropertyName
	 * @returns {Object} oPropertyAnnotation
	 * @private
	 */
	SmartBulletMicroChart.prototype._getPropertyAnnotation = function(sEntityTypePropertyName) {
		var oMetaModel, sEntityTypeName, oEntityType, oPropertyAnnotation;
		oMetaModel = this.getModel().getMetaModel();
		sEntityTypeName = this._oChartProvider._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet());
		oEntityType = oMetaModel.getODataEntityType(sEntityTypeName);
		oPropertyAnnotation = oMetaModel.getODataProperty(oEntityType, sEntityTypePropertyName);
		return oPropertyAnnotation;
	};

	return SmartBulletMicroChart;
});
