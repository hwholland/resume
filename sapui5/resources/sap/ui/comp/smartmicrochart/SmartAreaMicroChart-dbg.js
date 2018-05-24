/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartmicrochart.SmartAreaMicroChart.
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', 'sap/suite/ui/microchart/library', 'sap/ui/core/Control', 'sap/ui/comp/providers/ChartProvider', 'sap/m/ValueColor', 'sap/ui/core/CustomData', 'sap/ui/model/odata/CountMode'],
	function(jQuery, CompLibrary, MicroChartLibrary, Control, ChartProvider, ValueColor, CustomData, CountMode) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.comp.smartmicrochart/SmartAreaMicroChart.
	 *
	 * @param {string}
	 *          [sId] id for the new control, generated automatically if no id is given
	 * @param {object}
	 *          [mSettings] initial settings for the new control
	 * @class The SmartAreaMicroChart control creates a AreaMicroChart based on OData metadata and the configuration
	 *        specified. The entitySet attribute must be specified to use the control. This attribute is used to fetch
	 *        fields from OData metadata, from which Micro Area Chart UI will be generated; it can also be used to fetch
	 *        the actual chart data.<br>
	 *        <b><i>Note:</i></b><br>
	 *        Most of the attributes/properties are not dynamic and cannot be changed once the control has been
	 *        initialised.
	 * @extends sap.ui.core.Control
	 * @version 1.38.33
	 * @since 1.38
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartmicrochart.SmartAreaMicroChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SmartAreaMicroChart = Control.extend("sap.ui.comp.smartmicrochart.SmartAreaMicroChart", /** @lends sap.ui.comp.smartmicrochart.SmartAreaMicroChart.prototype */ {
		metadata : {

			library : "sap.ui.comp",
			properties : {

				/**
				 * The entity set name from where the data is fetched and the internal AreaMicroChart representation is created. Note that this is not a dynamic UI5
				 * property
				 */
				entitySet : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Determines if the target value and actual value
				 * are displayed or not
				 */
				showLabel: {
					type: "boolean",
					group : "Appearance",
					defaultValue: true
				},

				/**
				 * Specifies the type of Chart.
				 */
				chartType : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Only <code>true</code> value is supported: the chart will be bound to the chartBindingPath or to the entitySet
				 */
				enableAutoBinding: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * This attribute can be used to specify the relative path ( without '/') to an entitySet ( not a single entity)
				 * that is used during the binding of the chart. It can be e.g. a navigation property which will be added to the context path.
				 * If not specified, the entitySet attribute is used instead.
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
				 * Defines the height.
				 */
				height : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : "74px"},

				/**
				 * If this set to true, width and height of the control are determined by the width and height of the container in which the control is placed. Size and Width properties are ignored in such case.
				 */
				isResponsive: {type: "boolean", group: "Appearance", defaultValue: false}
			},
			defaultAggregation: "_chart",
			aggregations : {
				/**
				 * This private aggregation is used for the internal binding of the sap.suite.ui.microchart.AreaMicroChart
				 */
				_chart : {
					type : "sap.suite.ui.microchart.AreaMicroChart",
					multiple : false,
					visibility : "hidden"
				},
				/**
				 * This private aggregation is used for the internal binding of the chart text, description and unit of measure values in case the value is provided via ODataModel
				 */
				_chartTexts : {
					type : "sap.m.ListBase",
					multiple : false,
					visibility : "hidden"
				}
			},
			associations : {
				/**
				 * If the associated control is provided, its Text property is set to the Title property of the Chart annotation.
				 * Title property of the DataPoint annotation is ignored.
				 * since version 1.38
				 */
				chartTitle : {
					type : "sap.m.Label",
					group : "Misc",
					multiple : false
				},
				/**
				 * If the associated control is provided, its Text property is set to the Description property of the Chart annotation.
				 * Description property of the DataPoint annotation is ignored.
				 * since version 1.38
				 */
				chartDescription : {
					type : "sap.m.Label",
					group : "Misc",
					multiple : false
				},
				/**
				 * If the associated control is provided, its Text property is set to the Unit of Measure. The Value property of the DataPoint annotation should be annotated with this Unit of Measure. It can be either ISOCurrency or Unit from the OData Measures annotations.
				 * @since 1.38
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

	SmartAreaMicroChart.prototype.init = function() {
		this._bIsinitialized = false;
		this._bMetaModelLoadAttached = false;
		this.setProperty("chartType", "Area", true);
		this.setAggregation("_chart", new MicroChartLibrary.AreaMicroChart(), true);
	};

	SmartAreaMicroChart.prototype.onBeforeRendering = function() {
		var oChart = this.getAggregation("_chart");
		oChart.setProperty("width", this.getWidth(), true);
		oChart.setProperty("height", this.getHeight(), true);
		if (oChart.getMetadata().hasProperty("isResponsive")) {
			oChart.setProperty("isResponsive", this.getIsResponsive(), true);
			MicroChartLibrary._passParentContextToChild(this, oChart);
		}
	};

	SmartAreaMicroChart.prototype.setEntitySet = function(sEntitySetName) {
		if (this.getProperty("entitySet") !== sEntitySetName) {
			this.setProperty("entitySet", sEntitySetName, true);
			this._initializeMetadata();
		}
		return this;
	};

	SmartAreaMicroChart.prototype.setShowLabel = function(bShowLabel) {
		if (this.getShowLabel() !== bShowLabel) {
			this.setProperty("showLabel", bShowLabel, true);
			this.getAggregation("_chart").setProperty("showLabel", bShowLabel, true);
			this.invalidate();
		}
		return this;
	};

	/**
	 * @private
	 */
	SmartAreaMicroChart.prototype.setEnableAutoBinding = function(bEnableAutoBinding) {
		this.setProperty("enableAutoBinding", true, true);
		return this;
	};

	/**
	 * @private
	 */
	SmartAreaMicroChart.prototype.setChartType = function() {
		return this;
	};

	/**
	 * Calls propagateProperties of Control and initializes the metadata afterwards.
	 * @private
	 */
	SmartAreaMicroChart.prototype.propagateProperties = function() {
		if (Control.prototype.propagateProperties) {
			Control.prototype.propagateProperties.apply(this, arguments);
		}
		this._initializeMetadata();
	};

	/**
	 * Initializes the OData metadata needed to create the chart
	 * @private
	 */
	SmartAreaMicroChart.prototype._initializeMetadata = function() {
		if (!this._bIsinitialized) {
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
	SmartAreaMicroChart.prototype._createChartProvider = function() {
		var oModel, sEntitySetName;
		sEntitySetName = this.getEntitySet();
		oModel = this.getModel();
		// The SmartAreaMicroChart might also needs to work for non ODataModel models; hence we now create the chart
		// independent of ODataModel.
		if (oModel && sEntitySetName) {
			this._oChartProvider = new ChartProvider({
				entitySet : sEntitySetName,
				model : oModel
			});
		}
	};

	/**
	 * Called once the needed metadata of the is available
	 * @private
	 */
	SmartAreaMicroChart.prototype._onMetadataInitialized = function() {
		this._bMetaModelLoadAttached = false;
		if (!this._bIsinitialized) {
			this._createChartProvider();
			if (this._oChartProvider) {
				this._oChartViewMetadata = this._oChartProvider.getChartViewMetadata();
				this._oDataPointAnnotations = this._oChartProvider.getChartDataPointMetadata().additionalAnnotations[this._getDataPointQualifier()];
				if (this._oChartViewMetadata) {
					this._bIsinitialized = true;
					this.fireInitialize();
					if (this.getEnableAutoBinding()) {
						if (this.getChartBindingPath()) {
							this._sBindingPath = this.getChartBindingPath();
						} else if (this.getEntitySet()) {
							this._sBindingPath = '/' + this.getEntitySet();
						} else {
							jQuery.sap.log.warning("Neither the property chartBindingPath nor entitySet is set thus the property enableAutoBinding cannot be applied");
						}
					}
					this._createAndBindInnerChart();
					this._bindChartTexts();
				}
			}
		}
	};

	/**
	 * Checks if the medatada is correct and fills the aggregations of the contained AreaMicroChart.
	 * @private
	 */
	SmartAreaMicroChart.prototype._createAndBindInnerChart = function() {
		if (!this._checkChartMetadata()) {
			jQuery.sap.log.error("Created annotations not valid. Please review the annotations and metadata.");
			return;
		}

		this._buildChartItem("chart", this._oDataPointAnnotations.Value.Path);
		this._buildChartItem("target", this._oDataPointAnnotations.TargetValue.Path);

		if (!this._checkThresholdMetadata()){
			jQuery.sap.log.error("Threshold annotations not ok. Please review annotation and metadata.");
			return;
		}
		this._buildThreshold();
	};

	/**
	 * The method is responsible for filling all the threscholds of the contained AreaMicroChart.
	 * @private
	 */
	SmartAreaMicroChart.prototype._buildThreshold = function() {
		var oCriticality = this._oDataPointAnnotations.CriticalityCalculation;
		var oInnerChart = this.getAggregation("_chart");

		if (this._checkCriticalityCalculationData("Target")) {
			this._buildChartItem("minThreshold", oCriticality.DeviationRangeLowValue.Path);
			this._buildChartItem("maxThreshold", oCriticality.DeviationRangeHighValue.Path);
			this._buildChartItem("innerMinThreshold", oCriticality.ToleranceRangeLowValue.Path);
			this._buildChartItem("innerMaxThreshold", oCriticality.ToleranceRangeHighValue.Path);
			oInnerChart.getInnerMinThreshold().setProperty("color", ValueColor.Good, true);
			oInnerChart.getInnerMaxThreshold().setProperty("color", ValueColor.Good, true);
			oInnerChart.getMinThreshold().setProperty("color", ValueColor.Error, true);
			oInnerChart.getMaxThreshold().setProperty("color", ValueColor.Error, true);

		} else if (this._checkCriticalityCalculationData("Minimize")) {
			this._buildChartItem("minThreshold", oCriticality.ToleranceRangeHighValue.Path);
			this._buildChartItem("maxThreshold", oCriticality.DeviationRangeHighValue.Path);
			oInnerChart.getMinThreshold().setProperty("color", ValueColor.Good, true);
			oInnerChart.getMaxThreshold().setProperty("color", ValueColor.Error, true);

		} else if (this._checkCriticalityCalculationData("Maximize")) {
			this._buildChartItem("minThreshold", oCriticality.DeviationRangeLowValue.Path);
			this._buildChartItem("maxThreshold", oCriticality.ToleranceRangeLowValue.Path);
			oInnerChart.getMinThreshold().setProperty("color", ValueColor.Error, true);
			oInnerChart.getMaxThreshold().setProperty("color", ValueColor.Good, true);
		}
	};

	/**
	 * Check criticality data for specified direction
	 *
	 * @param {string} direction The ImprovementDirection to be checked (case-sensitive)
	 * @return {boolean} Returns true if the information needed for criticality calculation for the specified direction is available, otherwise returns false
	 * @private
	 */
	SmartAreaMicroChart.prototype._checkCriticalityCalculationData = function(direction) {
		var oCriticality = this._oDataPointAnnotations.CriticalityCalculation;
		var sCriticalityDirection = oCriticality.ImprovementDirection.EnumMember;
		var sDirection = "com.sap.vocabularies.UI.v1.ImprovementDirectionType/" + direction;

		if (direction === "Target" && sCriticalityDirection === sDirection) {
			return _hasMember(oCriticality, "DeviationRangeLowValue", "Path") &&
					_hasMember(oCriticality, "DeviationRangeHighValue", "Path") &&
					_hasMember(oCriticality, "ToleranceRangeLowValue", "Path") &&
					_hasMember(oCriticality, "ToleranceRangeHighValue", "Path");

		} else if (direction === "Minimize" && sCriticalityDirection === sDirection) {
			return _hasMember(oCriticality, "DeviationRangeHighValue", "Path") && _hasMember(oCriticality, "ToleranceRangeHighValue", "Path");

		} else if (direction === "Maximize" && sCriticalityDirection === sDirection) {
			return _hasMember(oCriticality, "DeviationRangeLowValue", "Path") && _hasMember(oCriticality, "ToleranceRangeLowValue", "Path");
		}
		return false;

		function _hasMember(obj, member, property){
			return !jQuery.isEmptyObject(obj) && !jQuery.isEmptyObject(obj[member]) && obj[member][property];
		}
	};

	/**
	 * Created AreaMicroChartItem for the given aggregation name and based on the given path 
	 * Only the data binding paths are prepared. Actual data will be filled once the the binding occurs.
	 * @private
	 */
	SmartAreaMicroChart.prototype._buildChartItem = function(sAggregationName, sPath) {
		var oPointTemplate, oItem;
		oPointTemplate = new MicroChartLibrary.AreaMicroChartPoint({
			x : {
				path : this._oChartViewMetadata.dimensionFields[0],
				type : "sap.ui.model.odata.type.Decimal"
			},
			y : {
				path : sPath,
				type : "sap.ui.model.odata.type.Decimal"
			}
		});

		oItem = new MicroChartLibrary.AreaMicroChartItem({
			points : {
				path : this._sBindingPath,
				template : oPointTemplate,
				parameters : {
					countMode : CountMode.None
				}
			}
		});

		this.getAggregation("_chart").setAggregation(sAggregationName, oItem, true);
	};

	/**
	 * Gets the qualifier of the DataPoint annotation.
	 * @private
	 */
	SmartAreaMicroChart.prototype._getDataPointQualifier = function() {
		var aMeasureAttributes = [], sDatapointQualifier, aPath, sQualifier;
		if (this._oChartViewMetadata) {
			if (this._oChartViewMetadata.annotation.hasOwnProperty("MeasureAttributes")) {
				aMeasureAttributes = this._oChartViewMetadata.annotation.MeasureAttributes;
				var iLen = aMeasureAttributes.length;
				for (var i = 0; i < iLen; i++) {
					if (aMeasureAttributes[i].DataPoint && aMeasureAttributes[i].DataPoint.hasOwnProperty("AnnotationPath")) {
						sQualifier = aMeasureAttributes[i].DataPoint.AnnotationPath;
						aPath = sQualifier.split("#");
						if (aPath.length === 2) {
							sDatapointQualifier = aPath[1];
						}
					}
				}
			}
		}
		return sDatapointQualifier;
	};

	/**
	 * Executes a basic validity check of the metadata of the chart, necessary to create the inner chart.
	 * @private
	 */
	SmartAreaMicroChart.prototype._checkChartMetadata = function() {
		if (this._oChartViewMetadata &&
				this._oChartViewMetadata.fields &&
				this._oChartViewMetadata.fields.length > 0) {
			return true;
		} else {
			jQuery.sap.log.error("Annotations not ok. Please review annotation and metadata.");
			return false;
		}
	};

	/**
	 * Executes a validity check of the threshold related metadata of the chart.
	 * @private
	 */
	SmartAreaMicroChart.prototype._checkThresholdMetadata = function() {
		if (this._oDataPointAnnotations.CriticalityCalculation &&
				this._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection &&
				this._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection.EnumMember) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Reads the Title, Description and UnitOfMeasure from the annotations.
	 * Binds them ( in case of Paths) or sets them ( in case of Strings) to the corresponding properties of the hidden aggregation _chartTexts
	 * @private
	 */
	SmartAreaMicroChart.prototype._bindChartTexts = function() {
		var sTitle, oLabel, oList, sDescription, oUnitOfMeasureAnnotation, sUnitOfMeasure, oBinding;
		if (this.getAggregation("_chartTexts")) {
			return;
		}
		if (this.getChartDescription()) {
			if (!(sap.ui.getCore().byId(this.getChartDescription()) instanceof sap.m.Label)) {
				jQuery.sap.log.error("Control in association chartDescription should be of type sap.m.Label");
			}
		}

		if (this.getChartTitle()) {
			if (!(sap.ui.getCore().byId(this.getChartTitle()) instanceof sap.m.Label)) {
				jQuery.sap.log.error("Control in association chartTitle should be of type sap.m.Label");
			}
		}

		if (this.getUnitOfMeasure()) {
			if (!(sap.ui.getCore().byId(this.getUnitOfMeasure()) instanceof sap.m.Label)) {
				jQuery.sap.log.error("Control in association unitOfMeasure should be of type sap.m.Label");
			}
		}

		if (jQuery.isEmptyObject(this._oChartViewMetadata) || jQuery.isEmptyObject(this._oChartViewMetadata.annotation)) {
			return;
		}
		if (this._oChartViewMetadata.annotation.Title) {
			if (this._oChartViewMetadata.annotation.Title.hasOwnProperty("Path")) {
				sTitle = "{" + this._oChartViewMetadata.annotation.Title.Path + "}";
			} else if (this._oChartViewMetadata.annotation.Title.hasOwnProperty("String")) {
				sTitle = this._oChartViewMetadata.annotation.Title.String;
			}
		}
		if (this._oChartViewMetadata.annotation.Description) {
			if (this._oChartViewMetadata.annotation.Description.hasOwnProperty("Path")) {
				sDescription = "{" + this._oChartViewMetadata.annotation.Description.Path + "}";
			} else if (this._oChartViewMetadata.annotation.Description.hasOwnProperty("String")) {
				sDescription = this._oChartViewMetadata.annotation.Description.String;
			}
		}
		oUnitOfMeasureAnnotation = this._getUnitOfMeasureAnnotation();
		if (!!oUnitOfMeasureAnnotation) {
			if (oUnitOfMeasureAnnotation.Path) {
				sUnitOfMeasure = "{" + oUnitOfMeasureAnnotation.Path + "}";
			} else if (oUnitOfMeasureAnnotation.String) {
				sUnitOfMeasure = oUnitOfMeasureAnnotation.String;
			}
		}
		if (sTitle || sDescription || sUnitOfMeasure) {
			oLabel = new sap.m.StandardListItem({
				title : sTitle,
				description : sDescription,
				info : sUnitOfMeasure
			});

			oList = new sap.m.List({
				items: {
					path: this._sBindingPath,
					template: oLabel
				}
			});
			this.setAggregation("_chartTexts", oList, true);
			oBinding = this.getAggregation("_chartTexts").getBinding("items");
			if (oBinding) {
				oBinding.attachChange(this._setLabels, this);
			}
		}
	};

	/**
	 * Reads the Title, Description and UnitOfMeasure from the hidden aggregation __chartTexts and sets the Text property of the corresponding associations
	 * @private
	 */
	SmartAreaMicroChart.prototype._setLabels = function() {
		var aLabels, sTitle, oChartTitle, sDescription, sUnitOfMeasure, oChartDescription, oUnitOfMeasure;
		if (!this.getAggregation("_chartTexts")) {
			return;
		}
		aLabels = this.getAggregation("_chartTexts").getItems();
		if (aLabels.length > 0) {
			sTitle = this.getAggregation("_chartTexts").getItems()[0].getTitle();
			oChartTitle = sap.ui.getCore().byId(this.getChartTitle());
			if (oChartTitle) {
				if (sTitle) {
					oChartTitle.setProperty("text", sTitle, false);
				} else {
					oChartTitle.setProperty("text", "", false);
				}
			}
			sDescription = this.getAggregation("_chartTexts").getItems()[0].getDescription();
			oChartDescription = sap.ui.getCore().byId(this.getChartDescription());
			if (oChartDescription) {
				if (sDescription) {
					oChartDescription.setProperty("text", sDescription, false);
				} else {
					oChartDescription.setProperty("text", "", false);
				}
			}
			sUnitOfMeasure = this.getAggregation("_chartTexts").getItems()[0].getInfo();
			oUnitOfMeasure = sap.ui.getCore().byId(this.getUnitOfMeasure());
			if (oUnitOfMeasure) {
				if (sUnitOfMeasure) {
					oUnitOfMeasure.setProperty("text", sUnitOfMeasure, false);
				} else {
					oUnitOfMeasure.setProperty("text", "", false);
				}
			}
		}
	};


	/**
	 * Get the UnitOfMeasure Annotation for the EntityType property of the DataPoint Value annotation
	 * We consider either ISOCurrency or Unit annotation terms from the Measures annotations
	 * @returns {Object}
	 * @private
	 */
	SmartAreaMicroChart.prototype._getUnitOfMeasureAnnotation = function() {
		var sProp, oPropertyAnnotation;
		if (!this._oDataPointAnnotations) {
			return;
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
	SmartAreaMicroChart.prototype._getPropertyAnnotation = function(sEntityTypePropertyName) {
		var oMetaModel, sEntityTypeName, oEntityType, oPropertyAnnotation;
		oMetaModel = this.getModel().getMetaModel();
		sEntityTypeName = this._oChartProvider._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet());
		oEntityType = oMetaModel.getODataEntityType(sEntityTypeName);
		oPropertyAnnotation = oMetaModel.getODataProperty(oEntityType, sEntityTypePropertyName);
		return oPropertyAnnotation;
	};

	return SmartAreaMicroChart;
});