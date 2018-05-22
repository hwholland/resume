/**
 * @fileOverview Library to Manage rendering of Viz Charts.
 * Reads configuration from config.js.
 */

(function () {
	"use strict";
	jQuery.sap.declare("sap.ovp.cards.charts.VizAnnotationManager");
	sap.ovp.cards.charts.VizAnnotationManager = sap.ovp.cards.charts.VizAnnotationManager || {};


	/* All constants feature here */
	sap.ovp.cards.charts.VizAnnotationManager.constants = {
		LABEL_KEY: "sap:label",
		TEXT_KEY: "sap:text",
		TYPE_KEY: "type",
		NAME_KEY: "name",
		NAME_CAP_KEY: "Name"
	};
	
	/* All constans for error messages feature here */
	sap.ovp.cards.charts.VizAnnotationManager.errorMessages = {
		CARD_WARNING: "OVP-AC: Analytic card: Warning: ",	
		CARD_ERROR: "OVP-AC: Analytic card Error: ",
		CARD_ANNO_ERROR: "OVP-AC: Analytic card: Error ",
		CHART_ANNO_ERROR: "OVP-AC: Analytic card: Error ",
		INVALID_CHART_ANNO: "OVP-AC: Analytic Cards: Invalid Chart Annotation.",
		ANALYTICAL_CONFIG_ERROR: "Analytic card configuration error",
		CACHING_ERROR: "no model defined while caching OdataMetaData",
		INVALID_MAXITEMS: "maxItems is Invalid. ",
		NO_DATASET: "OVP-AC: Analytic Cards: Could not obtain dataset.",
		SORTORDER_WARNING:"SortOrder is present in PresentationVariant, but it is empty or not well formed.",
		BOOLEAN_ERROR: "Boolean value is not present in PresentationVariant.",
		IS_MANDATORY: "is mandatory.",
		IS_MISSING: "is missing.",
		NOT_WELL_FORMED: "is not found or not well formed)",
		MISSING_CHARTTYPE: "Missing ChartType in ",
		CHART_ANNO: "Chart Annotation.",
		CARD_ANNO: "card annotation.",
		CARD_CONFIG: "card configuration.",
		CARD_CONFIG_ERROR: "Could not obtain configuration for ",
		CARD_CONTAINER_ERROR: "Could not obtain card container. ",
		DATA_UNAVAIALABLE: "No data available.",
		CONFIG_LOAD_ERROR: "Failed to load config.json. Reason: ",
		INVALID_CHARTTYPE: "Invalid ChartType given for ",
		INVALID_CONFIG: "No valid configuration given for ",
		CONFIG_JSON: "in config.json",
		ENTER_INTEGER: "Please enter an Integer.",
		NO_CARD_MODEL: "Could not obtain Cards model.",
		ANNO_REF: "com.sap.vocabularies.UI.v1 annotation.",
		INVALID_REDUNDANT: "Invalid/redundant role configured for ",
		CHART_IS: "chart is/are ",
		CARD_CONFIG_JSON:"card from config.json",
		ALLOWED_ROLES: "Allowed role(s) for ",
		DIMENSIONS_MANDATORY: "DimensionAttributes are mandatory.",
		MEASURES_MANDATORY: "MeasureAttributes are mandatory.",
		CARD_LEAST: "card: Enter at least ",
		CARD_MOST: "card: Enter at most ",
		FEEDS: "feed(s).",
		MIN_FEEDS: "Minimum number of feeds required for ",
		FEEDS_OBTAINED: "card is not configured. Obtained ",
		FEEDS_REQUIRED: "feed(s), Required: "			
	};


	/*
	 * Reads filters from annotation and prepares data binding path
	 */
	sap.ovp.cards.charts.VizAnnotationManager.formatItems = function(iContext, oEntitySet, oSelectionVariant, oPresentationVariant, oDimensions, oMeasures) {
		var dataModel = iContext.getSetting("dataModel");
		var ret = "{";
		var dimensionsList = [];
		var measuresList = [];
		var sorterList = [];
		var bFilter = oSelectionVariant && oSelectionVariant.SelectOptions;
		var bParams = oSelectionVariant && oSelectionVariant.Parameters;
		var bSorter = oPresentationVariant && oPresentationVariant.SortOrder;
		var maxItemTerm = oPresentationVariant && oPresentationVariant.MaxItems, maxItems = null;
		var aConfigFilters;
		var tmp;
		var entitySet = null;
		var self = sap.ovp.cards.charts.VizAnnotationManager;
		var textKey = self.constants.TEXT_KEY;

		if (maxItemTerm) {
			maxItems = maxItemTerm.Int32 ? maxItemTerm.Int32 : maxItemTerm.Int;
		}

		if (maxItems) {
			if (maxItems == "0") {
				jQuery.sap.log.error("OVP-AC: Analytic card Error: maxItems is configured as " +
					maxItems);
				ret += "}";
				return ret;
			}
			if (!/^\d+$/.test(maxItems)) {
				jQuery.sap.log.error("OVP-AC: Analytic card Error: maxItems is Invalid. " +
					"Please enter an Integer.");
				ret += "}";
				return ret;
			}
		}

		if (bParams) {
			var path = sap.ovp.cards.AnnotationHelper.resolveParameterizedEntitySet(dataModel, oEntitySet, oSelectionVariant);
			ret += "path: '" + path + "'";
		} else {
			ret += "path: '/" + oEntitySet.name + "'";
		}

		var filters = [];
		if (!iContext || !iContext.getSetting('ovpCardProperties')) {
			jQuery.sap.log.error(self.errorMessages.ANALYTICAL_CONFIG_ERROR);
			ret += "}";
			return ret;
		}
		entitySet = iContext.getSetting('ovpCardProperties').getProperty("/entitySet");
		if (!dataModel || !entitySet) {
			return ret;
		}
		var oMetadata = self.getMetadata(dataModel, entitySet);
		aConfigFilters = iContext.getSetting('ovpCardProperties').getProperty("/filters");

		if (bFilter) {
			jQuery.each(oSelectionVariant.SelectOptions, function() {
				var prop = this.PropertyName.PropertyPath;
				jQuery.each(this.Ranges, function() {
					if (this.Sign.EnumMember === "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I") {
						var filtervalue = sap.ovp.cards.charts.VizAnnotationManager.getPrimitiveValue(this.Low);
						var filtervaueHigh = this.High && this.High.String;
						var formatByType = self.formatByType;
						filtervalue = formatByType(oMetadata, prop, filtervalue);
						var filter = {
								path : prop,
								operator : this.Option.EnumMember.split("/")[1],
								value1 : filtervalue
						};
						if (filtervaueHigh) {
							filter.value2 = formatByType(oMetadata, prop, filtervaueHigh);
						}
						filters.push(filter);
					}
				});
			});
		}

		/*
		 * code for ObjectStream
		 */
		if (aConfigFilters && aConfigFilters.length > 0){
			filters = filters.concat(aConfigFilters);
		}

		if (filters.length > 0) {
			ret += ", filters: " + JSON.stringify(filters);
		}

		if (bSorter) {
			var oSortAnnotationCollection = oPresentationVariant.SortOrder;
			if (oSortAnnotationCollection.length < 1) {
				jQuery.sap.log.warning(self.errorMessages.CARD_WARNING + self.errorMessages.SORTORDER_WARNING);
			} else {
				var sSorterValue = "";
				var oSortOrder;
				var sSortOrder;
				var sSortBy;
				for (var i = 0; i < oSortAnnotationCollection.length; i++) {
					oSortOrder = oSortAnnotationCollection[i];
					sSortBy = oSortOrder.Property.PropertyPath;
					sorterList.push(sSortBy);
					if (typeof oSortOrder.Descending == "undefined") {
						sSortOrder = 'true';
					} else {
						var checkFlag = oSortOrder.Descending.Bool || oSortOrder.Descending.Boolean;
						if (!checkFlag) {
							jQuery.sap.log.warning(self.errorMessages.CARD_WARNING + self.errorMessages.BOOLEAN_ERROR);
							sSortOrder = 'true';
						} else {
							sSortOrder = checkFlag.toLowerCase() == 'true' ? 'true' : 'false';
						}
					}
					sSorterValue = sSorterValue + "{path: '" + sSortBy + "',descending: " + sSortOrder + "},";
				}
				/* trim the last ',' */
				ret += ", sorter: [" + sSorterValue.substring(0, sSorterValue.length - 1) + "]";
			}
		}

		jQuery.each(oMeasures, function(i, m){
			tmp = m.Measure.PropertyPath;
			measuresList.push(tmp);
			if (oMetadata && oMetadata[tmp] && oMetadata[tmp][textKey] && tmp != oMetadata[tmp][textKey]) {
				measuresList.push(oMetadata[tmp][textKey] ? oMetadata[tmp][textKey] : tmp);
			}
		});
		jQuery.each(oDimensions, function(i, d){
			tmp = d.Dimension.PropertyPath;
			dimensionsList.push(tmp);
			if (oMetadata && oMetadata[tmp] && oMetadata[tmp][textKey] && tmp != oMetadata[tmp][textKey]) {
				dimensionsList.push(oMetadata[tmp][textKey] ? oMetadata[tmp][textKey] : tmp);
			}
		});
		ret += ", parameters: {select:'" + [].concat(dimensionsList, measuresList).join(",");
		if (sorterList.length > 0) {
			ret += "," + sorterList.join(",");
		}
		/* close `parameters` */
		ret += "'}";

		if (maxItems) {
			ret += ", length: " + maxItems;
		}
		ret += "}";
		return ret;
	};
	sap.ovp.cards.charts.VizAnnotationManager.formatItems.requiresIContext = true;


	sap.ovp.cards.charts.VizAnnotationManager.formatByType = function(oMetadata, sProp, sVal) {
		var self = sap.ovp.cards.charts.VizAnnotationManager;
		var typeKey = self.constants.TYPE_KEY;
		if (!oMetadata || !oMetadata[sProp] || !oMetadata[sProp][typeKey]) {
			return sVal;
		}
		var aNumberTypes = [
			"Edm.Int",
			"Edmt.Int16",
			"Edm.Int32",
			"Edm.Int64",
			"Edm.Decimal"
		];
		var currentType = oMetadata[sProp][typeKey];
		if (jQuery.inArray(currentType, aNumberTypes) !== -1){
			return Number(sVal);
		}
		return sVal;
	};


	sap.ovp.cards.charts.VizAnnotationManager.returnDateFormat = function(date) {
		if (date) {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd-MMM"});
			return oDateFormat.format(new Date(date));
		}
		return "";
	};


	sap.ovp.cards.charts.VizAnnotationManager.formatChartAxes = function() {
		jQuery.sap.require("sap.ui.core.format.NumberFormat");
		var customFormatter = {
				locale: function(){},
				format: function(value, pattern) {
					if (pattern == "axisFormatter") {
						var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance(
							{style: 'short',
								minFractionDigits: 2,
								maxFractionDigits: 2}
						);
						return numberFormat.format(Number(value)); 
					}
				}
		};

		jQuery.sap.require("sap.viz.ui5.api.env.Format");
		sap.viz.ui5.api.env.Format.numericFormatter(customFormatter);
	};


	sap.ovp.cards.charts.VizAnnotationManager.hideDateTimeAxis = function(vizFrame, feedName) {
		var dataModel = vizFrame.getModel();
		var type = vizFrame.getVizType();
		if (type != "line" && type != "bubble") {
			return;
		}
		if (!feedName) {
			feedName = type == "line" ? "categoryAxis" : "valueAxis";
		}
		var entitySet = vizFrame.getModel('ovpCardProperties').getProperty("/entitySet");
		if (!dataModel || !entitySet) {
			return;
		}
		var oMetadata = this.getMetadata(dataModel, entitySet);
		var feeds = vizFrame.getFeeds();
		for (var i = 0; i < feeds.length; i++) {
			if (feeds[i].getUid() == feedName) {
				var feedValues = feeds[i].getValues();
				if (!feedValues) {
					return;
				}
				for (var j = 0; j < feedValues.length; j++) {
					if (oMetadata[feedValues[j][this.constants.TYPE_KEY]] != "Edm.DateTime") {
						return;
					}
				}
				vizFrame.setVizProperties({categoryAxis:{
					title:{
						visible: false
					}
				}});
				return;
			}
		}
	};


	/*
	 * Check if annotations exist vis-a-vis manifest
	 * @param {String} term - Annotation with Qualifier
	 * @param {Object} annotation - Annotation Data
	 * @param {String} type - Type of Annotation
	 * @param {Boolean} [bMandatory=false] - Whether the term is mandatory
	 * @param {String} logViewId - Id of the view for log purposes
	 * @param {String} contentFragment - To check whether we're dealing with
	 * generic analytic card or legacy type.
	 * @returns {Boolean}
	 */
	sap.ovp.cards.charts.VizAnnotationManager.checkExists = function(term, annotation, type, bMandatory, logViewId, contentFragment) {
		var self = sap.ovp.cards.charts.VizAnnotationManager;
		bMandatory = typeof bMandatory === "undefined" ? false : bMandatory;
		var ret = false;
		var annoTerm;
		if (!term && bMandatory) {
			jQuery.sap.log.error(logViewId + self.errorMessages.CARD_ERROR + type + self.errorMessages.IS_MANDATORY);
			return ret;
		}
		if (!term) {
			/* Optional parameters can be blank */
			jQuery.sap.log.warning(logViewId + self.errorMessagesCARD_WARNING + type + self.errorMessages.IS_MISSING);
			ret = true;
			return ret;
		}
		annoTerm = annotation[term];
		if (!annoTerm || typeof annoTerm !== "object") {
			var logger = bMandatory ? jQuery.sap.log.error : jQuery.sap.log.warning;
			logger(logViewId + self.errorMessages.CARD_ERROR + "in " + type +
					". (" + term + " " + self.errorMessages.NOT_WELL_FORMED);
			return ret;
		}
		/*
		 * For new style generic analytical card, make a check chart annotation
		 * has chart type.
		 */
		if (contentFragment &&
			contentFragment == "sap.ovp.cards.charts.analytical.analyticalChart" &&
			type == "Chart Annotation" &&
			(!annoTerm.ChartType || !annoTerm.ChartType.EnumMember)) {
			jQuery.sap.log.error(logViewId + self.errorMessages.CARD_ERROR + self.errorMessages.MISSING_CHARTTYPE +
					self.errorMessages.CHART_ANNO);
			return ret;
		}
		ret = true;
		return ret;
	};

	/*
	 * Check and log errors/warnings if any.
	 */
	sap.ovp.cards.charts.VizAnnotationManager.validateCardConfiguration = function(oController) {
		var self = sap.ovp.cards.charts.VizAnnotationManager;
		var ret = false;
		if (!oController) {
			return ret;
		}
		var selVar;
		var chartAnno;
		var contentFragment;
		var preVar;
		var idAnno;
		var dPAnno;
		var entityTypeData;
		var logViewId = "";
		var oCardsModel;
		var oView = oController.getView();
		if (oView) {
			logViewId = "[" + oView.getId() + "] ";
		}

		if (!(oCardsModel = oController.getCardPropertiesModel())) {
			jQuery.sap.log.error(logViewId + self.errorMessages.CARD_ERROR + "in " + self.errorMessages.CARD_CONFIG +
					self.errorMessages.NO_CARD_MODEL);
			return ret;
		}

		entityTypeData = oCardsModel.getProperty("/entityType");
		if (!entityTypeData || jQuery.isEmptyObject(entityTypeData)) {
			jQuery.sap.log.error(logViewId + self.errorMessages.CARD_ERROR + "in " + self.errorMessages.CARD_ANNO);
			return ret;
		}

		selVar = oCardsModel.getProperty("/selectionAnnotationPath");
		chartAnno = oCardsModel.getProperty("/chartAnnotationPath");
		preVar = oCardsModel.getProperty("/presentationAnnotationPath");
		idAnno = oCardsModel.getProperty("/identificationAnnotationPath");
		dPAnno = oCardsModel.getProperty("/dataPointAnnotationPath");
		contentFragment = oCardsModel.getProperty("/contentFragment");

		ret = this.checkExists(selVar, entityTypeData, "Selection Variant", false, logViewId);
		ret = this.checkExists(chartAnno, entityTypeData, "Chart Annotation", true, logViewId, contentFragment) && ret;
		ret = this.checkExists(preVar, entityTypeData, "Presentation Variant", false, logViewId) && ret;
		ret = this.checkExists(idAnno, entityTypeData, "Identification Annotation", true, logViewId) && ret;
		ret = this.checkExists(dPAnno, entityTypeData, "Data Point", false, logViewId) && ret;
		return ret;
	};


	/*
	 * Check if backend supplies no data.
	 * If so, show the no-data fragment.
	 * Commented out due to an issue with filters.
	 * Shows No data available even when correct filters are applied the second time.
	 * So, removing it temporarily.
	 */
	sap.ovp.cards.charts.VizAnnotationManager.checkNoData = function(oEvent, cardContainer, vizFrame) {
//		var self = sap.ovp.cards.charts.VizAnnotationManager;
//		var data, noDataDiv;
//		if (!cardContainer) {
//			jQuery.sap.log.error(self.errorMessages.CARD_ERROR + self.errorMessages.CARD_CONTAINER_ERROR +
//					"(" + vizFrame.getId() + ")");
//			return;
//		}
//		data = oEvent.getParameter("data");
//		if (!data || jQuery.isEmptyObject(data) ||
//			!data.results || !data.results.length) {
//
//			jQuery.sap.log.error(self.errorMessages.CARD_ERROR + self.errorMessages.DATA_UNAVAIALABLE  +
//					"(" + vizFrame.getId() + ")");
//			noDataDiv = sap.ui.xmlfragment("sap.ovp.cards.charts.generic.noData");
//			cardContainer.removeAllItems();
//			cardContainer.addItem(noDataDiv);
//		}
	};


	/*
	 * @param {Object} [oChartType] - Chart Annotation Object
	 * @returns {Object} - Get config object of a particular chart type from
	 * configuration defined in config.json.
	 * If the param is absent, return config of all charts.
	 */
	sap.ovp.cards.charts.VizAnnotationManager.getConfig = function(oChartType) {
		var self = sap.ovp.cards.charts.VizAnnotationManager;
		var ret = {};
		var chartAnnoName, chartType, analyticDIR, reference, fullConf = null;
		var bChartType = !!oChartType;
		if (!jQuery.sap.getObject("sap.ovp.cards.charts.config")) {
			analyticDIR = jQuery.sap.getModulePath("sap.ovp.cards.charts");
			sap.ovp.cards = sap.ovp.cards  || {};
			sap.ovp.cards.charts = sap.ovp.cards.charts || {};
			try {
				sap.ovp.cards.charts.config = jQuery.sap.loadResource({
					url: analyticDIR + "/config.json",
					dataType: "json",
					async: false
				});
			} catch (e) {
				jQuery.sap.log.error(self.errorMessages.CONFIG_LOAD_ERROR + e);
			}
			sap.ovp.cards.charts.config = sap.ovp.cards.charts.config || {};
		}
		fullConf = sap.ovp.cards.charts.config;

		if (!bChartType) {
			return fullConf;
		}

		if (!oChartType.EnumMember ||
			!(chartAnnoName = oChartType.EnumMember.split("/")) ||
			chartAnnoName.length < 2) {
			jQuery.sap.log.error(self.errorMessages.CARD_ERROR + self.errorMessages.INVALID_CHARTTYPE +
					self.errorMessages.ANNO_REF);
			return ret;
		}
		chartType = chartAnnoName[1];
		if (!fullConf[chartType]) {
			jQuery.sap.log.error(self.errorMessages.INVALID_CONFIG + chartType + " " +
					self.errorMessages.CONFIG_JSON);
			return ret;
		}
		if ((reference = fullConf[chartType].reference) &&
			fullConf[reference]) {
			var virtualEntry = jQuery.extend(true, {}, fullConf[reference]);
			fullConf[chartType] = virtualEntry;
		}
		ret = fullConf[chartType];
		return ret;
	};


	/*
	 * Formatter for VizFrame type.
	 * @param {Object} oChartType - Chart Annotation Object
	 * @returns {String} Valid Enum for Vizframe type
	 */
	sap.ovp.cards.charts.VizAnnotationManager.getChartType = function(oChartType) {
		var ret = "";
		var self = sap.ovp.cards.charts.VizAnnotationManager;
		var config = self.getConfig(oChartType);
		if (!config) {
			return ret;
		}
		ret = config.type;
		return ret;
	};


	/*
	 * Check if roles are valid for dimension/measure for the chart type
	 */
	sap.ovp.cards.charts.VizAnnotationManager.checkRolesForProperty = function(queue, config, type) {
		var self = sap.ovp.cards.charts.VizAnnotationManager;
		/* Nothing remains in the queue, all good !!! */
		if (!queue.length) {
			return;
		}
		var feedtype = type == "dimension" ? "Dimension" : "Measure";
		var queuedNames = [];
		jQuery.each(queue, function(i, val) {
			if (!val || !val[feedtype] || !val[feedtype].PropertyPath) {
				jQuery.sap.log.error(self.errorMessages.INVALID_CHART_ANNO);
				return false;
			}
			queuedNames.push(val[feedtype].PropertyPath);
		});
		var allowedRoles = jQuery.map(config.feeds, function(f) {
			if (f.type == type) {
				if (f.role) {
					return f.role.split("|");
				}
				return [];
			}
		});
		allowedRoles = jQuery.grep(allowedRoles, function(role, i) {
			return jQuery.inArray(role, allowedRoles) == i;
		}).join(", ");

		jQuery.sap.log.error(self.errorMessages.CARD_ERROR + self.errorMessages.INVALID_REDUNDANT  +
			type + "(s) " + queuedNames.join(", ") + ". " + self.errorMessages.ALLOWED_ROLES + config.type +
			self.errorMessages.CHART_IS + allowedRoles);
	};

	sap.ovp.cards.charts.VizAnnotationManager.getPrimitiveValue = function(oValue) {
		var value;

		if (oValue) {
			if (oValue.String) {
				value = oValue.String;
			} else if (oValue.Boolean) {
				value = sap.ovp.cards.charts.VizAnnotationManager.getBooleanValue(oValue);
			} else {
				value = sap.ovp.cards.charts.VizAnnotationManager.getNumberValue(oValue);
			}
		}
		return value;
	};

	sap.ovp.cards.charts.VizAnnotationManager.getBooleanValue = function(oValue, bDefault) {
		if (oValue && oValue.Boolean) {
			if (oValue.Boolean.toLowerCase() === "true") {
				return true;
			} else if (oValue.Boolean.toLowerCase() === "false") {
				return false;
			}
		}
		return bDefault;
	};

	sap.ovp.cards.charts.VizAnnotationManager.getNumberValue = function(oValue) {
		var value;

		if (oValue) {
			if (oValue.String) {
				value = Number(oValue.String);
			} else if (oValue.Int) {
				value = Number(oValue.Int);
			} else if (oValue.Decimal) {
				value = Number(oValue.Decimal);
			} else if (oValue.Double) {
				value = Number(oValue.Double);
			} else if (oValue.Single) {
				value = Number(oValue.Single);
			}
		}
		return value;
	};

	/*
	 * Construct VizProperties and Feeds for VizFrame
	 * @param {Object} VizFrame
	 */
	sap.ovp.cards.charts.VizAnnotationManager.buildVizAttributes = function(vizFrame) {
		var oCardsModel, entityTypeObject, chartAnno, chartContext;
		var chartType, allConfig, config, aDimensions, aMeasures;
		var oVizProperties;
		var aQueuedProperties, aQueuedDimensions, aQueuedMeasures;
		var aPropertyWithoutRoles, aDimensionWithoutRoles = [], aMeasureWithoutRoles = [];
		var self = sap.ovp.cards.charts.VizAnnotationManager;
		var reference;
		chartType = vizFrame.getVizType();
		allConfig = this.getConfig();
		for (var key in allConfig) {
			if ((reference = allConfig[key].reference) &&
					allConfig[reference]) {
				var virtualEntry = jQuery.extend(true, {}, allConfig[reference]);
				allConfig[key] = virtualEntry;
			}
			if (allConfig[key].type == chartType) {
				config = allConfig[key];
				break;
			}
		}

		if (!config) {
			jQuery.sap.log.error(self.errorMessages.CARD_ERROR + "in " + self.errorMessages.CARD_CONFIG +
					self.errorMessages.CARD_CONFIG_ERROR + chartType + " " + self.errorMessages.CARD_CONFIG_JSON);
			return;
		}

		if (!(oCardsModel = vizFrame.getModel('ovpCardProperties'))) {
			jQuery.sap.log.error(self.errorMessages.CARD_ERROR + "in " + self.errorMessages.CARD_CONFIG +
					self.errorMessages.NO_CARD_MODEL);
			return;
		}
		var dataModel = vizFrame.getModel();
		var entitySet = oCardsModel.getProperty("/entitySet");
		if (!dataModel || !entitySet) {
			return;
		}
		entityTypeObject = oCardsModel.getProperty("/entityType");
		if (!entityTypeObject) {
			jQuery.sap.log.error(self.errorMessages.CARD_ANNO_ERROR + "in " + self.errorMessages.CARD_ANNO);
			return;
		}
		var oMetadata = self.getMetadata(dataModel, entitySet);
		chartAnno = oCardsModel.getProperty("/chartAnnotationPath");
		if (!chartAnno || !(chartContext = entityTypeObject[chartAnno])) {
			jQuery.sap.log.error(self.errorMessages.CARD_ANNO_ERROR + "in " + self.errorMessages.CARD_ANNO);
			return;
		}

		if (!(aDimensions = chartContext.DimensionAttributes) ||
				!aDimensions.length) {
			jQuery.sap.log.error(self.errorMessages.CHART_ANNO_ERROR + "in " + self.errorMessages.CHART_ANNO + " " +
					self.errorMessages.DIMENSIONS_MANDATORY);
			return;
		}
		if (!(aMeasures = chartContext.MeasureAttributes) ||
				!aMeasures.length) {
			jQuery.sap.log.error(self.errorMessages.CHART_ANNO_ERROR + "in " + self.errorMessages.CHART_ANNO + " " +
					self.errorMessages.MEASURES_MANDATORY);
			return;
		}

		var bErrors = false;
		/*
		 * Check if given number of dimensions, measures
		 * are valid acc to config's min and max requirements
		 */
		[config.dimensions, config.measures].forEach(function(entry, i) {
			var oProperty = i ? aMeasures : aDimensions;
			var typeCue = i ? "measure(s)" : "dimension(s)";
			if (entry.min && oProperty.length < entry.min) {
				jQuery.sap.log.error(self.errorMessages.CARD_ERROR + "in " + chartType +
					" " + self.errorMessages.CARD_LEAST + entry.min + " " + typeCue);
				bErrors = true;
			}
			if (entry.max && oProperty.length > entry.max) {
				jQuery.sap.log.error(self.errorMessages.CARD_ERROR + "in " + chartType +
						self.errorMessages.CARD_MOST + entry.max + " " + typeCue);
				bErrors = true;
			}
		});

		if (bErrors) {
			return;
		}

		/* HEADER UX stuff */
		var bHideAxisTitle = true;
		
		if (config.hasOwnProperty("properties") &&
				config.properties.hasOwnProperty("hideLabelWhenHeader") &&
				!config.properties["hideLabelWhenHeader"]) {
			bHideAxisTitle = false;
		} else {
			var dPAnno = oCardsModel.getProperty("/dataPointAnnotationPath");
			var manifestTitle = oCardsModel.getProperty("/title");
			var manifestSubTitle = oCardsModel.getProperty("/subTitle");
			var headerAnnotation = entityTypeObject[dPAnno];
			var bDataPointTitleExist = (headerAnnotation &&
									typeof headerAnnotation == "object" &&
									headerAnnotation.Title &&
									headerAnnotation.Title.String);
			/*
			 * Show Axis Title(s) on chart only if none of the following exist:
			 * DataPoint->Title, manifest->title, manifest->subTitle
			 */
			if (!bDataPointTitleExist &&
					!manifestTitle &&
					!manifestSubTitle) {
					bHideAxisTitle = false;
			}
		}

		vizFrame.removeAllAggregation();
		/*
		 * Default viz properties template
		 */
		oVizProperties = {
				legend: {
					isScrollable: false
				},
				title: {
					visible: false
				},
				interaction:{
					noninteractiveMode: false,
					selectability: {
						legendSelection: false,
						axisLabelSelection: false,
						mode: 'EXCLUSIVE',
						plotLassoSelection: false,
						plotStdSelection: true
					},
					zoom:{   
							enablement: 'disabled'
					}
				},
				plotArea:{
					window: {
						start: 'firstDataPoint',
						end: 'lastDataPoint'
					}
				},
				general:{
					groupData: false
				}
		};

		aQueuedDimensions = aDimensions.slice();
		aQueuedMeasures = aMeasures.slice();
		jQuery.each(config.feeds, function(i, feed) {
			var uid = feed.uid;
			var aFeedProperties = [];
			if (feed.type) {
				var iPropertiesLength, feedtype, propertyName;
				if (feed.type === "dimension") {
					iPropertiesLength = aDimensions.length;
					feedtype = "Dimension";
					propertyName = "dimensions";
					aQueuedProperties = aQueuedDimensions;
					aPropertyWithoutRoles = aDimensionWithoutRoles;
				} else {
					iPropertiesLength = aMeasures.length;
					feedtype = "Measure";
					propertyName = "measures";
					aQueuedProperties = aQueuedMeasures;
					aPropertyWithoutRoles = aMeasureWithoutRoles;
				}
				var min = 0, max = iPropertiesLength;
				if (feed.min) {
					min = min > feed.min ? min : feed.min;
				}
				if (feed.max) {
					max = max < feed.max ? max : feed.max;
				}
				/* If no roles configured - add the property to feed */
				if (!feed.role) {
					var len = aQueuedProperties.length;
					for (var j = 0; j < len && aFeedProperties.length < max; ++j) {
						var val = aQueuedProperties[j];
						aQueuedProperties.splice(j, 1);
						--len;
						--j;
						aFeedProperties.push(val);
					}
				} else {
					var rolesByPrio = feed.role.split("|");
					jQuery.each(rolesByPrio, function(j, role) {
						if (aFeedProperties.length == max) {
							return false;
						}
						var len = aQueuedProperties.length;
						for (var k = 0; k < len && aFeedProperties.length < max; ++k) {
							var val = aQueuedProperties[k];
							if (val && val.Role && val.Role.EnumMember &&
								val.Role.EnumMember.split("/") && val.Role.EnumMember.split("/")[1]) {
								var annotationRole = val.Role.EnumMember.split("/")[1];
								if (annotationRole == role) {
									aQueuedProperties.splice(k, 1);
									--len;
									--k;
									aFeedProperties.push(val);
								}
							} else if (jQuery.inArray(val, aPropertyWithoutRoles) == -1) {
								aPropertyWithoutRoles.push(val);
							}
						}
					});
					if (aFeedProperties.length < max) {
						jQuery.each(aPropertyWithoutRoles, function(k, val) {
							/* defaultRole is the fallback role */
							var defaultRole;
							var index;
							if ((defaultRole = config[propertyName].defaultRole)  &&
								(jQuery.inArray(defaultRole, rolesByPrio) !== -1) &&
								(index = jQuery.inArray(val, aQueuedProperties)) !== -1) {
								aQueuedProperties.splice(index, 1);
								aFeedProperties.push(val);
								if (aFeedProperties.length == max) {
									return false;
								}
							}
						});
					}
					if (aFeedProperties.length < min) {
						jQuery.sap.log.error(self.errorMessages.CARD_ERROR + self.errorMessages.MIN_FEEDS + chartType +
						" " + self.errorMessages.FEEDS_OBTAINED + aFeedProperties.length + " " + self.errorMessages.FEEDS_REQUIRED + min +
						" " + self.errorMessages.FEEDS);
						return false;
					}
				}
				if (aFeedProperties.length) {
					var aFeeds = [];
					var dataset;
					if (!(dataset = vizFrame.getDataset())) {
						jQuery.sap.log.error(self.errorMessages.NO_DATASET);
						return false;
					}
					jQuery.each(aFeedProperties, function(i, val) {
						if (!val || !val[feedtype] || !val[feedtype].PropertyPath) {
							jQuery.sap.log.error(self.errorMessages.INVALID_CHART_ANNO);
							return false;
						}
						var property = val[feedtype].PropertyPath;
						var feedName = property;
						var textColumn = property;
						var edmType = null;
						if (oMetadata && oMetadata[property]) {
							feedName = oMetadata[property][self.constants.LABEL_KEY] || property;
							textColumn = oMetadata[property][self.constants.TEXT_KEY] || property;
							edmType = oMetadata[property][self.constants.TYPE_KEY] || null;
						}
						var displayBindingPath;
						if (edmType == "Edm.DateTime" && textColumn == property) {
							displayBindingPath = "{path:'" + property + "', formatter: 'sap.ovp.cards.charts.VizAnnotationManager.returnDateFormat'}";
						} else {
							displayBindingPath = "{" + textColumn + "}";
						}
						aFeeds.push(feedName);
						if (feedtype == "Dimension") {
							dataset.addDimension(new sap.viz.ui5.data.DimensionDefinition({
								name: feedName,
								value: "{" + property + "}",
								displayValue: displayBindingPath
							}));
						} else {
							dataset.addMeasure(new sap.viz.ui5.data.MeasureDefinition({
								name: feedName,
								value: "{" + property + "}"
							}));
						}

					});
					vizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
						'uid': uid,
						'type': feedtype,
						'values': aFeeds
					}));
					oVizProperties[uid] = {
							title:{
								visible: bHideAxisTitle ? false : true,
								text: aFeeds.join(", ")
							},
							label:{
								formatString:'axisFormatter'
							}
					};
					if (uid == "valueAxis") {
						oVizProperties[uid].layout = {
									maxWidth: 0.4
						};
					}
				}
			}
		});

		this.checkRolesForProperty(aQueuedDimensions, config, "dimension");
		this.checkRolesForProperty(aQueuedMeasures, config, "measure");

		vizFrame.setVizProperties(oVizProperties);
	};


	/*
	 * Get the (cached) OData metadata information.
	 */
	sap.ovp.cards.charts.VizAnnotationManager.getMetadata = function(model, entitySet) {
		var map = this.cacheODataMetadata(model);
		if (!map) {
			return undefined;
		}
		return map[entitySet];
	};


	/*
	 * Cache OData metadata information with key as UI5 ODataModel id.
	 */
	sap.ovp.cards.charts.VizAnnotationManager.cacheODataMetadata  = function(model) {
		var self = sap.ovp.cards.charts.VizAnnotationManager;
		if (model){
			if (!jQuery.sap.getObject("sap.ovp.cards.charts.cachedMetaModel")) {
				sap.ovp.cards.charts.cachedMetaModel = {};
			}
		var map = sap.ovp.cards.charts.cachedMetaModel[model.getId()];
		if (!map) {
			var metaModel = model.getMetaModel();
			map = {};
			var container = metaModel.getODataEntityContainer();
			jQuery.each(container.entitySet, function(anIndex,entitySet) {
				var entityType = metaModel.getODataEntityType(entitySet.entityType);
				var entitysetMap = {};
				jQuery.each(entityType.property,function(propertyIndex,property) {
					entitysetMap[property.name] = property;
				});
				map[entitySet.name] = entitysetMap;
			});
			sap.ovp.cards.charts.cachedMetaModel[model.getId()] = map;
		}
		return map;
		} else {
			jQuery.sap.log.error(self.errorMessages.CARD_ERROR + self.errorMessages.CACHING_ERROR );
		}
	};
	sap.ovp.cards.charts.VizAnnotationManager.getSelectedDataPoint = function(vizFrame, controller) {


		vizFrame.attachSelectData(function(oEvent){

			var self = sap.ovp.cards.charts.VizAnnotationManager;
			var oCardsModel = vizFrame.getModel('ovpCardProperties');
			var dataModel = vizFrame.getModel();
			var entitySet = oCardsModel.getProperty("/entitySet");
			var oMetadata = self.getMetadata(dataModel, entitySet);			
			var dimensionArrayNames = [], dimensions = [];
			var finalDimensions = {};
			var dimensionsArr = vizFrame.getDataset().getDimensions();
			var contextNumber;

			for (var i = 0; i < dimensionsArr.length; i++){
				dimensionArrayNames.push(dimensionsArr[i].getName());
			}

			var allData = jQuery.map(vizFrame.getDataset().getBinding("data").getCurrentContexts(), function(x) {return x.getObject();});

			if (oEvent.getParameter("data") && oEvent.getParameter("data")[0] && oEvent.getParameter("data")[0].data){
				
				contextNumber = oEvent.getParameter("data")[0].data._context_row_number;
				
				dimensions = Object.keys(oEvent.getParameter("data")[0].data);

				for (var j = 0; j < dimensionArrayNames.length; j++){
					for (var k = 0; k < dimensions.length; k++){
						if (dimensionArrayNames[j] == dimensions[k]){ 
							for (var key in oMetadata) {
								if (oMetadata.hasOwnProperty(key)) {
									var propertyName = oMetadata[key][self.constants.LABEL_KEY] || oMetadata[key][self.constants.NAME_KEY] || oMetadata[key][self.constants.NAME_CAP_KEY];
									if (propertyName == dimensions[k]) {
										finalDimensions[key] = allData[contextNumber][key];
									}
								}
							}							
						}
					}
				}
				var payLoad = {getObject : function(){return finalDimensions;}};

				controller.doNavigation(payLoad);
			}
		});
	};
}());
