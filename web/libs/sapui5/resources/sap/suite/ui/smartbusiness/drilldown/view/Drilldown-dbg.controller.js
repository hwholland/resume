/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */

jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageBox");
sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.drilldown.view.Drilldown", {
	_getEvaluationId : function() {
		try {
			var startupParameters = this.oConnectionManager.getComponent().oComponentData.startupParameters;
			return startupParameters["evaluationId"][0];
		}catch(e) {
			return sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters().evaluationId[0];
		}
	},
	_getDataFromUrl : function() {
		try {
			var startupParameters = this.oConnectionManager.getComponent().oComponentData.startupParameters;
			this.TILE_TYPE='';
			this.DIMENSION='';
			if(startupParameters["tileType"]) {
				this.TILE_TYPE = startupParameters["tileType"][0];
			}
			if(startupParameters["dimension"]) {
				this.DIMENSION = startupParameters["dimension"][0];
			}
			if(startupParameters["sap-system"]) {
				this.SAP_SYSTEM = startupParameters["sap-system"][0];
			}
			if(startupParameters["chipId"]) {
				this.CHIP_ID = startupParameters["chipId"][0];
			}
		}catch(e) {
			var sParams = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters();
			if(sParams) {
				if(sParams.tileType) {
					this.TILE_TYPE = sParams.tileType[0];
				}
				if(sParams.dimension) {
					this.DIMENSION = sParams.dimension[0];
				}
				if(sParams["sap-system"]) {
					this.SAP_SYSTEM = sParams["sap-system"][0];
				}
				if(sParams["chipId"]) {
					this.CHIP_ID = sParams["chipId"][0];
				}
			}
		}
	},

	fetchAllEvaluations : function(oParam){
		var headerEvalArray = [this._getEvaluationId()];
		var oHeaders = this.CONFIGURATION.getHeaders();
		oHeaders.forEach(function(curHeader) {
			if(curHeader.isAssociated()) {
				if(headerEvalArray.indexOf(curHeader.getReferenceEvaluationId()) == -1) {
					headerEvalArray.push(curHeader.getReferenceEvaluationId());
				}
				if(headerEvalArray.indexOf(curHeader.getEvaluationId()) == -1) {
					headerEvalArray.push(curHeader.getEvaluationId());
				}
			}
		});
		this._bundled_evaluations_call_ref = sap.suite.ui.smartbusiness.drilldown.lib.Configuration.setEvaluationsCache({
			evalIdArray : headerEvalArray,
			sapSystem : this.SAP_SYSTEM,
			success: oParam.success,
			context: oParam.context
		});
	}, 
	onAfterRendering : function() {
			},
	onInit : function() {
		var that = this;
		//prevent the routematch handler from closing the dialog whenever hash changes
//		if(jQuery.device.is.desktop){ //do the above only for desktop

		if(sap.ui.Device.system.desktop){ //do the above only for desktop
			this.getOwnerComponent().setRouterSetCloseDialogs(false);
			this.byId("header-ribbon").setShowTitleSelector(true);
		}
		// trigger this function on orientation change

		//ESLINT jQuery.device deprecated 

//		if(jQuery.device.is.ipad){

		if(sap.ui.Device.system.tablet){
			$(window ).on("orientationchange", function(event) {
				that.getUIComponents().getHeaderContainer().rerender();
			});
		}
		// invalidating cache on page load
		sap.suite.ui.smartbusiness.lib.Util.cache.invalidateKpiDetailsCache();
		this._requestTimeLog = {};
		this._busyDialog = new sap.m.BusyDialog();
		sap.sb_drilldown_app = this;
		this.EVALUATION = null;
		this.CONFIGURATION = null;
		this.SELECTED_VIEW = null;
		this.POPOVER_VIEW_NAVIGATION_MODEL = new sap.ui.model.json.JSONModel({"VIEW_NAVIGATION":[]});
		this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL = new sap.ui.model.json.JSONModel({"APP_NAVIGATION":[]});
		this.SEMANTIC_OBJECT = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getSemanticObject();
		this.ACTION = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getAction();

		//var locale = new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage());

		this.urlParsingService = sap.ushell.Container.getService("URLParsing");
		this.metadataRef = sap.suite.ui.smartbusiness.Adapter.getService("ModelerServices");
		this.addExportMethodToTable();
		var EVAL_ID = this._getEvaluationId();
		var EVAL_ID_FOR_DDA_CONFIG = EVAL_ID;
		this._EVALUATION_ID = EVAL_ID;
		this.firstTimeFlag = false;
		this._getDataFromUrl();
		if(!this._proxyHashChangeListener) {
			this._proxyHashChangeListener = jQuery.proxy(this.hashChangeListener, this);
			this._attachHashChangeEvent();
		}
		this._busyDialog.open();

		var isModelSEnv = sap.suite.ui.smartbusiness.Configuration.isMetadataFromABAP();
		if(isModelSEnv) {
			var oRuntimeService = sap.suite.ui.smartbusiness.Adapter.getService("RuntimeServices");
			oRuntimeService.getDataByEntity({
				entity : "PROPERTIES",
				filter : "TYPE eq 'EV' and IS_ACTIVE eq 1 and ID eq '" + EVAL_ID + "' and NAME eq 'SAP:Copied_From'",
				async : false,
				success : function(data) {
					if(data && data.length) {
						EVAL_ID_FOR_DDA_CONFIG = data[0].VALUE || EVAL_ID;
					}
				},
				error : function(err) {
					jQuery.sap.log.error(err && err.message);
				}
			});
		}
		var startTimeConfigFetch = new Date().getTime();
		var callback = function(oDataBatchReference){
            this.DDA_CONFIG_ODATA_CALL_REF = oDataBatchReference;
		};

		sap.suite.ui.smartbusiness.drilldown.lib.Configuration.loadConfiguration({
			evaluationId : EVAL_ID_FOR_DDA_CONFIG,
			cache : true,
			success : function(batchResponse) {
				var endTimeConfigFetch = new Date().getTime();
				this._requestTimeLog["DDA_CONFIG_FETCH"] = {
						title : "Configuration",
						time : endTimeConfigFetch - startTimeConfigFetch
				};
				this.CONFIGURATION = sap.suite.ui.smartbusiness.drilldown.lib.Configuration.parse(EVAL_ID_FOR_DDA_CONFIG, batchResponse);
				var that=this;
				if( this.CONFIGURATION.getAllViews().length==0){
					jQuery.sap.log.error("drilldown not configured");
					var oI18nModel = that.getView().getModel("i18n");
					sap.m.MessageBox.alert(oI18nModel.getResourceBundle().getText("DDA_NOT_CONFIGURED"), function () {
						window.location.hash = "";
						that._busyDialog.close();
					});
					return;
				}

				var startTimeBundledEvaluationFetch = new Date().getTime();
				this.fetchAllEvaluations({
					success: function() {
						var endTimeBundledEvaluationFetch = new Date().getTime();
						this._requestTimeLog["BUNDLED_EVALUATIONS_FETCH"] = {
								title : "Evaluations",
								time : endTimeBundledEvaluationFetch - startTimeBundledEvaluationFetch
						};
						this.EVALUATION_ODATA_CALL_REF = sap.suite.ui.smartbusiness.drilldown.lib.Configuration.getEvaluationById({
							id : EVAL_ID,
							cache : true,
							filters : true,
							thresholds : true,
							success : function(evalData) {
								this._busyDialog.close();
								this.EVALUATION = sap.suite.ui.smartbusiness.lib.Util.kpi.parseEvaluation(evalData);
								if(this.metadataRef.getPlatform().toUpperCase() === "HANA") {
									this.EVALUATION.parse_sapclient();
								}
								this._initialize();
								if(jQuery.device.is.phone){
									var objectHeader = this.getUIComponents().getHeader();
									objectHeader.addAttribute(new sap.m.ObjectAttribute({
										text : this.EVALUATION.getDescription()
									}));
								}
							},
							error : function() {
								this._busyDialog.close();
								throw new Error("Evaluation Details Not Found with ID : "+EVAL_ID);
							},
							context : this,
							sapSystem : this.SAP_SYSTEM
						});
					},
					context : this,
				});
			},
			error : function() {
				jQuery.sap.log.error("Drilldown Configuration Fetching Failed");
				this._busyDialog.close();
			},
			context : this,
			sapSystem : this.SAP_SYSTEM
		},callback);


	},
	updateFilter : function() {
		/**
		 * Show the Filters if View switched from Chart/Table Context
		 */
		var filter = this.getUIComponents().getFilter();
		var filterObj = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters(["viewId"]);
		if(filter.getVisible()){
			filter.refreshFilter();
		}else{
			filter.setVisible(true);
		}
		this._fixFacetListSelection();
	},
	onBeforeRendering : function() {

	},

	isACurrencyMeasure : function(measure) {
		var sUri = this.metadataRef.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM);
		var entitySet = this.EVALUATION.getEntitySet();
		return sap.suite.ui.smartbusiness.lib.Util.odata.getFormattingMetadata(sUri, entitySet, measure)._hasCurrency;
	},

	libFormat: function(n, isACurrencyMeasure, currencyCode) {
		isACurrencyMeasure = isACurrencyMeasure || false;
		currencyCode = currencyCode || null;
		jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Formatter");
		return sap.suite.ui.smartbusiness.lib.Formatter.getLocaleFormattedValue(
				Number(n), this.EVALUATION.getScaling(), this.nDecimal, isACurrencyMeasure, currencyCode);
	},

	libFormat_nonscaled: function(n, isACurrencyMeasure, currencyCode) {
		isACurrencyMeasure = isACurrencyMeasure || false;
		currencyCode = currencyCode || null;
		jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Formatter");
		return sap.suite.ui.smartbusiness.lib.Formatter.getLocaleFormattedValue_nonscaled(
				Number(n), this.EVALUATION.getScaling(), this.nDecimal, isACurrencyMeasure, currencyCode);
	},

	getLibFormatter: function(n, isACurrencyMeasure, oScale, decimals) {
		if (oScale == null || typeof oScale == "undefined") {
			oScale = this.EVALUATION.getScaling();
		}
		if (decimals == null || typeof decimals == "undefined") {
			decimals = this.nDecimal;
		}
		isACurrencyMeasure = isACurrencyMeasure || false;
		jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Formatter");
		return sap.suite.ui.smartbusiness.lib.Formatter.getLocaleFormatter(
				Number(n), oScale, decimals, isACurrencyMeasure);
	},

	getLibFormatter_nonscaled: function(n, isACurrencyMeasure, oScale, decimals) {
		if (oScale == null || typeof oScale == "undefined") {
			oScale = this.EVALUATION.getScaling();
		}
		if (decimals == null || typeof decimals == "undefined") {
			decimals = this.nDecimal;
		}
		isACurrencyMeasure = isACurrencyMeasure || false;
		jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Formatter");
		return sap.suite.ui.smartbusiness.lib.Formatter.getLocaleFormatter_nonscaled(
				Number(n), oScale, decimals, isACurrencyMeasure);
	},

	_initialize : function() {
		/**
		 * Fix : Header Footer Options
		 */
		var that = this;
    	this._OPEN_IN_LINKS = {};
        this._fetchNavigationLinks().done(function(results){
        	if(results && results.length) {
        		that.setHeaderFooterOptions(that.getHeaderFooterOptions());
        		that._initExternalNavigationLinks(results);
        		that.renderTitle();
        	} else {
        		that.setHeaderFooterOptionsWithoutOpenInButton();
        	}
        });

		//decimals given by user
		this.nDecimal=this.EVALUATION.getDecimalPrecision();
		if (typeof this.nDecimal == "undefined") {
			/* default to AUTO */
			this.nDecimal = -1;
		}
		this.oFormatOptions_ca= {
				style: "standard" 
		};
		this.oFormatOptions_core={style:"short"};
		this.oFormatOptions_percent={style:"percent"};
		if(!(this.nDecimal == null || this.nDecimal == -1)) {
			this.oFormatOptions_ca.decimals = this.nDecimal;
			this.oFormatOptions_core.minFractionDigits=this.nDecimal;
			this.oFormatOptions_core.maxFractionDigits=this.nDecimal;
		}
		if(this.nDecimal == -1){
			/* given a value of -1 so as to force an error when used */
			this.oFormatOptions_ca.decimals = -1;
			this.oFormatOptions_core.minFractionDigits= -1;
			this.oFormatOptions_core.maxFractionDigits= -1;
		}

		//Set Window Page Title
		var windowPageTitle = this.EVALUATION.getKpiName()+" - "+this.EVALUATION.getTitle();
		try {
			if(sap.ushell.services.AppConfiguration && sap.ushell.services.AppConfiguration.setWindowTitle){
				sap.ushell.services.AppConfiguration.setWindowTitle(windowPageTitle);
			}
		} catch(e){
			jQuery.sap.log.error("Error Setting Window Page Title : "+windowPageTitle)
		}
		/*Prepare OData MetaData like Label, Text Property, UnitProperty*/
		var mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(this.metadataRef.addSystemToServiceUrl(this.EVALUATION.getODataUrl(),this.SAP_SYSTEM),this.EVALUATION.getEntitySet());
		//var mProperties = sap.suite.ui.smartbusiness.lib.Util.odata.properties(this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(),this.SAP_SYSTEM),this.EVALUATION.getEntitySet());
		this.COLUMN_LABEL_MAPPING = mProperties.getLabelMappingObject();
		this.DIMENSION_TEXT_PROPERTY_MAPPING = mProperties.getTextPropertyMappingObject();
		this.MEASURE_UNIT_PROPERTY_MAPPING = mProperties.getUnitPropertyMappingObject();

		/**
		 * Prepare Add To Home Dialog
		 */
		this._initAddToHomeDialogBox();

		var viewListModel = new sap.ui.model.json.JSONModel();
		viewListModel.setData(this.CONFIGURATION.getAllViews());
		var UIComponents = this.getUIComponents();

		UIComponents.getVizChartContainer().setModel(viewListModel,"VIEW_SWITCH");

		//model for chart
		this.chartModel = new sap.ui.model.json.JSONModel();
		var chartModelSize = 9999;
		this.chartModel.setSizeLimit(chartModelSize);
		UIComponents.getVizChartContainer().setModel(this.chartModel);
		//model for aggregate Number, unit etc
		this.EvaluationHeaderModel = new sap.ui.model.json.JSONModel();
		UIComponents.getHeader().setModel(this.EvaluationHeaderModel);
		//model of title lable
		this.titleModel = new sap.ui.model.json.JSONModel();
		UIComponents.getPage().getCustomHeader().getContentMiddle()[0].setModel(this.titleModel);
		this.renderDrilldownHeader();
		//act according to hash
		this._initRequestTimeLogChart();
		this.hashChangeListener();
		sap.ui.Device.orientation.attachHandler(this.renderTitle, this);        

	},
	applyTrendColor : function(WL,CL,CH,WH,goalType,kpiValue) {

		var returnColor = null;
		var wL = parseFloat(WL);
		var cL = parseFloat(CL);
		var cH = parseFloat(CH);
		var wH = parseFloat(WH);
		if(goalType=="MI") {
			if(cH && wH) {
				if(kpiValue < wH) {
					returnColor = sap.ui.core.ValueState.Success ;
				} else if(kpiValue <= cH) {
					returnColor = sap.ui.core.ValueState.Warning;
				} else {
					returnColor = sap.ui.core.ValueState.Error;
				}
			}

		} else if(goalType=="MA") {
			if(cL && wL) {
				if(kpiValue < cL) {
					returnColor = sap.ui.core.ValueState.Error;
				} else if(kpiValue <= wL) {
					returnColor = sap.ui.core.ValueState.Warning;
				} else {
					returnColor = sap.ui.core.ValueState.Success;
				}
			}
		} else {
			if(wL && wH && cL && cH) {
				if(kpiValue < cL || kpiValue > cH) {
					returnColor = sap.ui.core.ValueState.Error;
				} else if((kpiValue >= cL && kpiValue <= wL) || 
						(kpiValue >= wH && kpiValue <= cH)
				) {
					returnColor = sap.ui.core.ValueState.Warning;
				} else {
					returnColor = sap.ui.core.ValueState.Success ;
				}
			}
		}
		return returnColor;
	},
	switchedToTableView : function() {
		if(this.getUIComponents().getChart()) {
			this.setChartSelectionContextObject(null);
		}
	},
	switchedToChartView : function() {
		this.getUIComponents().getTable().setSelectedContext(null);
	},
	renderDrilldownHeader : function() {
		var aFilters = this.CONFIGURATION.getFilters();
		var objectHeaderContainer = this.getUIComponents().getHeaderContainer();
		this.renderFilters(aFilters);
		var aHeaders = this.CONFIGURATION.getHeaders();
		if(!((aHeaders && aHeaders.length) || this.EVALUATION.getDescription())){
			this.getUIComponents().getHeader().setShowTitleSelector(false);
		}
		this.renderTitle();
		this.renderEvaluationHeader();
	},
	renderTitle: function() {
		var title_label = this.getUIComponents().getPage().getCustomHeader().getContentMiddle()[0];
		if(title_label) {
			if(this.EVALUATION) {
				title_label.setText(this.EVALUATION.getKpiName());
			}
		}
	},
	renderFilters: function(filters) {
		var facetFilter = this.getUIComponents().getFilter();
		facetFilter.setEvaluationData(this.EVALUATION);
		facetFilter.setEvaluationId(this.EVALUATION.getId());
		facetFilter.setDimensions(filters);
		facetFilter.setSapSystem(this.SAP_SYSTEM);
	},

	displayMiniCharts : function(){
		var objectHeader = this.getUIComponents().getHeader();
		var objectHeaderContainer = this.getUIComponents().getHeaderContainer();
		var objectHeaderAttributes = objectHeader.getAttributes() || [];
		if(objectHeaderContainer.getVisible() || objectHeaderAttributes.length){
			objectHeaderContainer.setVisible(false);
			objectHeader.removeAllAttributes();
		}
		else{
			var aHeaders = this.CONFIGURATION.getHeaders();
			if(!(aHeaders && aHeaders.length)){
				objectHeaderContainer.setVisible(false);
			}
			else{
				objectHeaderContainer.setVisible(true);
				this.renderKpiHeaders(aHeaders);
			}
			objectHeader.removeAllAttributes();
			objectHeader.addAttribute(new sap.m.ObjectAttribute({
				text : this.EVALUATION.getDescription()
			}));
		}
		this._fixPostResizeIssue();
		$(window).trigger('resize');
		//Fixing post resize issue.
	},

	renderKpiHeaders: function(headers) {
		var self = this;
		var header_container = this.getUIComponents().getTileContainer();
		header_container.removeAllItems();
		this.miniChartManager = sap.suite.ui.smartbusiness.drilldown.lib.MiniChartManager.renderHeaders({
			allTiles : headers,
			headerContainer : header_container,
			sapSystem : this.SAP_SYSTEM,
			urlFilters : this.getUrlFilters(),
			onNavigation : function(){
				self._detachHashChangeListener();
			}
		});
	},
	renderView: function(currentView) {
		this.table = null;
		this.chart = null;
		this.geoMap = null;
		this.analyticalMap = null;
		this._addUIComponents(currentView); //based on configuration

		var chartColumns = currentView.getColumns()
		var chartConfig = currentView.getChartConfiguration();
		this.renderTable(chartColumns, chartConfig[0].getColorScheme());
		if(this.chart) {
			//first element passed since getChartConfiguration() returns an array
			this.renderChart(currentView, chartConfig[0], chartColumns);
		}
		else if(this.analyticalMap) { 
			this.renderAnalyticalMap(currentView); 
		} 
		else if(this.geoMap) { 
			this.renderGeoMap(currentView); 
		}
	},

	/**
	 * @desc fetches Evaluation data and binds value to aggregate number
	 * @param [filters] - null if only evaluation filters are to be considered
	 */
	renderEvaluationHeader : function() {
		var self = this;
		var objectHeader = this.getUIComponents().getHeader(), that = this;
		objectHeader.setTitle(this.EVALUATION.getTitle());

		var kpiMeasure = this.EVALUATION.getKpiMeasureName();

		/* 
		 * Just in case the odata service provides a formatted measure value
		 *  as sap:text, use it. Else fallback to measure value 
		 */
		var formatted_kpiMeasure = kpiMeasure;
//		if(this.DIMENSION_TEXT_PROPERTY_MAPPING[kpiMeasure]) {
//		formatted_kpiMeasure = this.DIMENSION_TEXT_PROPERTY_MAPPING[kpiMeasure];
//		}

		var kpiMeasureUnitProperty = this.MEASURE_UNIT_PROPERTY_MAPPING[kpiMeasure];

		/*
		 * Bypass ca formatter when using formatted kpi measure value 
		 * returned by odata source
		 */




		objectHeader.bindProperty("number",{
			parts: [{path: "/data/" + formatted_kpiMeasure},
			        {path: "/data/" + kpiMeasureUnitProperty}],
			        formatter: function(value, currencyCode) {
			        	if (formatted_kpiMeasure != kpiMeasure) {
			        		return value;
			        	}
			        	if(value) {
			        		var isACurrencyMeasure = self.isACurrencyMeasure(kpiMeasure);
			        		currencyCode = currencyCode || null;
			        		return self.libFormat_nonscaled(value, isACurrencyMeasure, currencyCode);
			        	}
			        	return value;
			        }
		});

		if(kpiMeasureUnitProperty) {
			objectHeader.bindProperty("numberUnit", "/data/" + kpiMeasureUnitProperty);
		}
	},
	fetchKpiValue: function() {
		if(!this.CONFIGURATION.isAggregateValueEnabled()) {
			return;
		}
		var that = this;
		var oUriObject = sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
			//serviceUri : this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM),
			serviceUri : this.metadataRef.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM),
			entitySet : this.EVALUATION.getEntitySet(),
			measure: this._getEvaluationThresholdMeasures(),
			filter : this.getAllFilters()
		});
		var startTimeFetchKpiValue = new Date().getTime();
		var evaluationId = this._getEvaluationId();
		this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_SUCCESS = function(data) {
			var endTimeFetchKpiValue = new Date().getTime();
			that._requestTimeLog["KPI_VALUE"] = {
					title : "Kpi Value",
					time : endTimeFetchKpiValue - startTimeFetchKpiValue
			};
			if(data && data.results.length) {
				that.EvaluationHeaderModel.setData({data:data.results[0]});
				//Colouring the Aggregate Value
				var header = that.getView().byId("header-ribbon");
				var kpiObject = data.results[0];
				if(that.EVALUATION){
					var kpiValue, WL,CL,CH,WH,color;
					kpiValue = parseFloat(kpiObject[that.EVALUATION.getKpiMeasureName()]);
					var evaluationTrend = that.EVALUATION.getThresholds();

//					if(that.EVALUATION.getThresholdValueType()=="FIXED"){
//					WL = evaluationTrend.getWarningLow();
//					CL = evaluationTrend.getCriticalLow();
//					CH = evaluationTrend.getCriticalHigh();
//					WH = evaluationTrend.getWarningHigh();
//					}
					if(that.EVALUATION.getThresholdValueType()=="MEASURE"){
						var i, valuesObject = that.EVALUATION.getValues().results;
						for(i=0;i<valuesObject.length;i++){
							if(valuesObject[i].TYPE == "WL"){
								WL = kpiObject[valuesObject[i].COLUMN_NAME];
							}
							if(valuesObject[i].TYPE == "CL"){
								CL = kpiObject[valuesObject[i].COLUMN_NAME];    
							}
							if(valuesObject[i].TYPE == "CH"){
								CH = kpiObject[valuesObject[i].COLUMN_NAME];
							}
							if(valuesObject[i].TYPE == "WH"){
								WH = kpiObject[valuesObject[i].COLUMN_NAME];
							}
						}
						color = that.applyTrendColor(WL,CL,CH,WH,that.EVALUATION.getGoalType(),kpiValue);
						header.setNumberState(color);
					}
					else if(that.EVALUATION.getThresholdValueType()=="RELATIVE"){
						var i, targetValue, valuesObject = that.EVALUATION.getValues().results;
						for(i=0;i<valuesObject.length;i++){
							if(valuesObject[i].TYPE == "TA"){
								targetValue = kpiObject[valuesObject[i].COLUMN_NAME]
								break;
							}
						}

						for(i=0;i<valuesObject.length;i++){
							if(valuesObject[i].TYPE == "WL"){
								WL = Number(targetValue)*valuesObject[i].FIXED/100;
							}
							if(valuesObject[i].TYPE == "CL"){
								CL = Number(targetValue)*valuesObject[i].FIXED/100;    
							}
							if(valuesObject[i].TYPE == "CH"){
								CH = Number(targetValue)*valuesObject[i].FIXED/100;
							}
							if(valuesObject[i].TYPE == "WH"){
								WH = Number(targetValue)*valuesObject[i].FIXED/100;
							}
						}
						color = that.applyTrendColor(WL,CL,CH,WH,that.EVALUATION.getGoalType(),kpiValue);
						header.setNumberState(color);
					}
				}
				sap.suite.ui.smartbusiness.lib.Util.cache.setKpiDetailsById(evaluationId,data);
				// removing from current_calls 
				if(sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId]) {
					var x = sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId];
					delete sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId];
					x.resolve();
				}
			} else {
				delete sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId];
				jQuery.sap.log.error("Couldn't fetch Aggregate Value. Response was "+data+" for uri : "+oUriObject.uri);
				that.EvaluationHeaderModel.setData({data:{}});
			}
		};
		this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_FAIL = function(err) {
			jQuery.sap.log.error(err);
			that.EvaluationHeaderModel.setData({data:{}});
			if(sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId]){
				var x = sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId];
				delete sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId];
				x.reject();
			}
		};
		var fromCache = sap.suite.ui.smartbusiness.lib.Util.cache.getKpiDetailsById(evaluationId);
		if(fromCache) {
			this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_SUCCESS(fromCache);
		}
		//if the call is currently in progress
		else if(sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId]){
			jQuery.when(sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId]).then(function() {
				var data = sap.suite.ui.smartbusiness.lib.Util.cache.getKpiDetailsById(evaluationId);
				that.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_SUCCESS(data);
			},function(errorMessage) {jQuery.sap.log.error(errorMessage)});
		}
		else {
			sap.suite.ui.smartbusiness.lib.Util.cache.current_calls[evaluationId] = jQuery.Deferred();
			this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF = oUriObject.model.read(oUriObject.uri, null, null, true,this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_SUCCESS ,this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF_FAIL);
		}
	},
	_addPopoverContent : function(oControl, bIsTable) {
		var listOfViews = new sap.m.List({
			visible : {
				path : "/VIEW_NAVIGATION",
				formatter : function(oArray) {
					if(oArray && oArray.length >0) {
						return true;
					}
					return false;
				}
			}
		});
		listOfViews.bindItems("/VIEW_NAVIGATION", new sap.m.ActionListItem({
			text : "{TITLE}",
			customData : new sap.ui.core.CustomData({
				key : "{ID}",
				value : "{ID}"
			}),
			press : jQuery.proxy(this._onViewSelection,this,{publishContext : true, isTable : !!bIsTable})
		}).addStyleClass("smartbusinessTablePopoverAction").setTooltip("{TITLE}"));
		var allViews = this._getListOfViewsForPopover(this.CONFIGURATION.getAllViews(), this.SELECTED_VIEW.getId()); 
		listOfViews.setModel(this.POPOVER_VIEW_NAVIGATION_MODEL);

		var listOfNavigations = new sap.m.List({
			/*
            visible : {
                path : "/APP_NAVIGATION",
                formatter : function(oArray) {
                    if(oArray && oArray.length >0) {
                        return true;
                    }
                    return false;
                }
            }*/
		});
		this._popoverNavigationListReferences.push(listOfNavigations);
		listOfNavigations.bindItems("/APP_NAVIGATION", new sap.m.StandardListItem({
			title : "{text}",
			type : sap.m.ListType.Navigation,
			customData : new sap.ui.core.CustomData({
				key : "{id}",
				value : "{applicationType}"
			}),
			press : jQuery.proxy(this._onAppSelection,this,{publishContext : true, isTable : !!bIsTable})
		}).setTooltip("{text}"));
		listOfNavigations.setModel(this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL);

		var popoverContent = new sap.m.VBox({
			items : [listOfViews, listOfNavigations],
			width : "99%"
		});
		oControl.setPopoverFooter(popoverContent);
	},
	_addUIComponents : function(viewConfiguration) {
		this.table = null;
		this.chart = null;
		this.geoMap = null; 
		this.analyticalMap = null;
		var chartToolbarRef = this.getUIComponents().getVizChartContainer();
		chartToolbarRef.removeAllContent();

		var chartConfiguration = viewConfiguration.getChartConfiguration()[0];
		if(chartConfiguration) {
			var that = this;
			this._popoverNavigationListReferences =  [];
			this.table = new sap.suite.ui.smartbusiness.drilldown.lib.CustomTable({
				mode : sap.m.ListMode.SingleSelectMaster
			}).addStyleClass("smartBusinessDrilldownTable");
			this.table.attachSelectionChange(function() {
				that._onTableRowSelected(); 
			});
			this.table.addEventDelegate({
				onAfterRendering : function() {
					that.switchedToTableView();
				}
			});
			this.table.setModel(this.getView().getModel("i18n"), "i18n");
			this._addPopoverContent(this.table, true);
			if(chartConfiguration.getChartType().isTable()) {
				var tableFrame = new sap.suite.ui.commons.ChartContainerContent({
					icon: 'sap-icon://table-chart',
				});
				tableFrame.setContent(this.table);
				chartToolbarRef.addContent(tableFrame); 				
			} else if(chartConfiguration.getChartType().isGeoMap()) {
				// Add Geo Map Content
			} else if(chartConfiguration.getChartType().isAnalyticalMap()) {
				// Add Choropleth Content
				try {
					this.analyticalMap = new sap.ui.core.mvc.JSView({
						viewName : "sap.suite.ui.smartbusiness.drilldown.view.AnalyticalMap",
						viewData : {parent:this}
					});
				}
				catch(e) {
					jQuery.sap.log.error("Map view not available");
					jQuery.sap.log.error(e.message);
					throw (e);
				}
				var tableFrame = new sap.suite.ui.commons.ChartContainerContent({
					icon: 'sap-icon://table-chart',
				});
				var mapContainer = new sap.m.VBox({items:[this.analyticalMap], fitContainer:true});
				tableFrame.setContent(mapContainer);
				chartToolbarRef.addContent(tableFrame); 				
			} else {				
				this.chart = new sap.viz.ui5.controls.VizFrame({
					vizType : "bar",
					uiConfig : {
						applicationSet : 'fiori'
					},						
				});
				this.chart.setVizProperties({
					plotArea: {
						dataLabel : {
							visible: true,
							formatString: "dataLabelFormatter",
							hideWhenOverlap: false
						}
					},
					legend: {
						title: {
							visible : false
						},
						isScrollable: true
					},
					title: {
						visible: false
					},
					valueAxis:{
						label:{
							formatString:"yValueAxisFormatter"
						}
					}
				});

				this.vizChartPopover = new sap.viz.ui5.controls.Popover().setFormatString("vizPopOver");

				this.vizChartPopover.connect(this.chart.getVizUid());
				this.chart.addEventDelegate({
					onAfterRendering : function() {
						that.switchedToChartView();
					}
				});
				var vizChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
					icon: "sap-icon://bar-chart",
				});
				vizChartContainerContent.setContent(this.chart);
				chartToolbarRef.addContent(vizChartContainerContent);
				var tableFrame = new sap.suite.ui.commons.ChartContainerContent({
					icon: 'sap-icon://table-chart',
				});
				tableFrame.setContent(this.table);
				chartToolbarRef.addContent(tableFrame);
				//this._addVizPopoverContent(chartPopover, false);				
			}
		} else {
			jQuery.sap.log.error("NO Chart Configuration found!! ");
		}

	},
	_setNoDataText : function(sPropertyKey) {
		this.table.setNoDataText(this.getView().getModel("i18n").getProperty(sPropertyKey));
		if(this.chart) {
//			if(this.use_CA) {
//			this.chart.setNoData(new sap.m.Label({
//			text : this.getView().getModel("i18n").getProperty(sPropertyKey)
//			}));
//			} else {

//			}
		}
	},
	fetchDataForChart : function() {
		var chartToolbarRef = this.getUIComponents().getVizChartContainer();
		var VIEW = this.SELECTED_VIEW;
		var that = this;
		try {
			this.chartModel.setData({data:[]});
			chartToolbarRef.setBusy(true);
			var dimensions = [].concat(this.SELECTED_VIEW.getDimensions());
			/*
			 * 	dimensions.forEach(function(sDimensionName) {
				var oDimension = VIEW.findDimensionByName(sDimensionName);
				var sortByDimension = oDimension.getSortBy();
				if((dimensions.indexOf(sortByDimension) == -1)) {
					if(oDimension.getSortOrder() == "asc" || oDimension.getSortOrder() == "desc") {
						dimensions.push(sortByDimension);
					}
				}
			});
			 * 
			 */
			var measures = this.SELECTED_VIEW.getMeasures();
			var sortingToBeApplied = null;
			if(this.TABLE_SORTING && this.TABLE_SORTING.length) {
				sortingToBeApplied = this.TABLE_SORTING;
			} else if(this.COLUMNS_SORT && this.COLUMNS_SORT.length) {
				sortingToBeApplied = this.COLUMNS_SORT;
			}
			var dataLimit = null;
			try {
				var iDataLimit = window.parseInt(this.SELECTED_VIEW.getChartConfiguration()[0].getDataLimit());
				if(isNaN(iDataLimit)) {
					jQuery.sap.log.error("Invalid Data Limit Value : "+dataLimit);
				} else {
					if(iDataLimit!=-1) {
						dataLimit = iDataLimit;
					}
				}
			}catch(e) {
				jQuery.sap.log.error("Error parsing Data Limit Value")
			}
			var oUriObject = sap.suite.ui.smartbusiness.lib.Util.odata.getUri({
				serviceUri : this.metadataRef.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM),
				//serviceUri : this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM),
				entitySet : this.EVALUATION.getEntitySet(),
				dimension : dimensions,
				measure : measures,
				filter : this.getAllFilters(),
				sort : sortingToBeApplied,
				dataLimit : dataLimit
			});
			//Set NoData Text for Chart and Table
			this._setNoDataText("DATA_LOADING");
			var startTimeChartDataFetch = new Date().getTime();
			this.CHART_TABLE_DATA_ODATA_CALL_REF = oUriObject.model.read(oUriObject.uri, null, null, true, function(data) {
				var endTimeChartDataFetch = new Date().getTime();
				that._requestTimeLog["CHART_TABLE_DATA"] = {
						title : "Chart/Table Data",
						time : endTimeChartDataFetch - startTimeChartDataFetch
				};
				if(data.results.length === 0) {
					that._setNoDataText("DATA_NODATA");
				}
				that.chartModel.setData({data:data.results});
				chartToolbarRef.setBusy(false);
				if(that.getUIComponents().getChart()) {
					that.setAllVizFormatters();					
				}
				if(data.results.length) {
					that._appendUOMToTableHeader(data.results[0]);
					that._appendUOMToVizChartAxis(data.results[0]);					
				}
			}, function() {
				jQuery.sap.log.error("Error fetching data : "+oUriObject.uri);
				that._setNoDataText("DATA_LOADING_FAILED");
				that.chartModel.setData({data:[]});
				chartToolbarRef.setBusy(false);
				that.chartModel.setData({data:[]});
			});
		} catch(e) {
			that._setNoDataText("DATA_LOADING_FAILED");
			jQuery.sap.log.error(e);
			chartToolbarRef.setBusy(false);
			this.chartModel.setData({data:[]});
		}
	},
	_getTableContextParameters : function(dimensionsArray) {
		var extraFilters = {};
		var tableSelectedContext =  this.getUIComponents().getTable().getSelectedContext();
		if(tableSelectedContext && tableSelectedContext.length) {
			tableSelectedContext.forEach(function(eachContext) {
				dimensionsArray.forEach(function(eachDimension){
					var dimensionValue = eachContext[eachDimension];
					if(dimensionValue==null){
						dimensionValue="SAP_SMARTBUSINESS_NULL";
					}
					if(dimensionValue||dimensionValue==0 ||dimensionValue=='') {
						if(dimensionValue.getTime) {
							dimensionValue = dimensionValue.getTime();
						}
						if(!extraFilters[eachDimension]) {
							extraFilters[eachDimension] = [];
						}
						extraFilters[eachDimension].push(dimensionValue);
					}
				});
			});
		}
		return extraFilters;
	},
	_getChartContextParameters : function(dimensionsArray) {
		var extraFilters, chartContexts;
		chartContexts = this.getChartSelectionContextObject();
		extraFilters = {};
		if(chartContexts) {
			var dataSet = this.getUIComponents().getChart().getDataset();
			for(var each in chartContexts) {
				var context = chartContexts[each];
				var cObject = dataSet.findContext(context).getObject();
				dimensionsArray.forEach(function(eachDimension){
					var dimensionValue = cObject[eachDimension];
					if(dimensionValue==null){
						dimensionValue="SAP_SMARTBUSINESS_NULL";
					}
					if(dimensionValue||dimensionValue==0 ||dimensionValue=='') {
						if(dimensionValue.getTime) {
							dimensionValue = dimensionValue.getTime();
						}
						if(extraFilters[eachDimension]) {
							extraFilters[eachDimension].push(dimensionValue);
						} else {
							extraFilters[eachDimension] = [];
							extraFilters[eachDimension].push(dimensionValue);
						}
					}
				});
			}
		}
		return extraFilters;
	},
	_onViewSelection : function(customParam, oEvent) {
		var viewId = oEvent.getSource().getCustomData()[0].getKey();
		var parameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters();
		var dimensionsArray = this.SELECTED_VIEW.getDimensions();
		var extraFilters = this[customParam.isTable ? "_getTableContextParameters" : "_getChartContextParameters"](dimensionsArray,false);
		for(var each in extraFilters) {
			if(parameters[each]) {
				delete parameters[each];
			}
			parameters[each] = extraFilters[each]
		}
		parameters["viewId"] = viewId;
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setApplicationParameters(parameters,false);
		if(customParam.isTable){
			this.getUIComponents().getTable().setSelectedContext(null);
		}else{
			this.setChartSelectionContextObject(null);
		}
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateHash();
		//this._hideOrShowFacetFilterIfRequired();
	},
	getChartSelectionContextObject : function() {
//		if(this.use_CA) {
//		return this._chartPopoverContext;  
//		}
	},
	setChartSelectionContextObject : function(oValue) {
//		if(this.use_CA) {
//		this._chartPopoverContext = oValue;
//		}
	},
	_detachHashChangeListener : function() {
		try {
			this.hashChanger.detachEvent("hashChanged", this._proxyHashChangeListener); 
			this._proxyHashChangeListener = null;
			this.hashChangerAttached = true;
		} catch(e) {
			jQuery.sap.log.error("Error Detaching hashChanged Event");
		}
	},
	_onAppSelection : function(customParam, oEvent) {
		var cleanUp = function(appParameters, contextParameters) {
			if(contextParameters) {
				for(var sParamKey in contextParameters) {
					if(appParameters && appParameters[sParamKey]) {
						delete appParameters[sParamKey];
					}
				}
			}
		};
		var extraFilters, navId = oEvent.getSource().getCustomData()[0].getKey();
		var appType = oEvent.getSource().getCustomData()[0].getValue();
		var soAction = navId.split("~")[0];
		var splits = soAction.split("-");
		var so = splits[0];
		var action = splits[1];
		var appParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters(["viewId"]);
		if(so == "AdhocAnalysis") {
			appParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters();
		}
		var startupParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters();
		//var extraParameters = appParameters?jQuery.extend(true,{},appParameters):{};
		var extraParameters = {};
		var dimensionsArray = this.SELECTED_VIEW.getDimensions();
		if(customParam.isFromOpenIn) {
			//Navigation Link Clicked from OpenIn
			extraFilters = this._getTableContextParameters(dimensionsArray);
			cleanUp(appParameters, extraFilters);
			jQuery.extend(true, extraParameters, extraFilters);
			extraFilters = this._getVizChartContextParameters(dimensionsArray); 
			cleanUp(appParameters, extraFilters);
			jQuery.extend(true, extraParameters, extraFilters);
		} else {
			if(customParam.isTable) {
				//Navigation Link Clicked from Table Popover
				extraFilters = this._getTableContextParameters(dimensionsArray);
				cleanUp(appParameters, extraFilters);
				jQuery.extend(true, extraParameters, extraFilters);
			} else {
				//Navigation Link Clicked From Chart Popover
				extraFilters = this._getChartContextParameters(dimensionsArray);
				cleanUp(appParameters, extraFilters);
				jQuery.extend(true, extraParameters, extraFilters);
			}
		}
		jQuery.extend(true, extraParameters, startupParameters, appParameters);

		//New Code - Using Shell API to Change the HASH
		if(sap.ushell.Container && sap.ushell.Container.getService) {
			var oCrossApplicationNavigation = sap.ushell.Container.getService("CrossApplicationNavigation");
			if(oCrossApplicationNavigation) {
				var targetAppHash = oCrossApplicationNavigation.hrefForExternal({
					target : {
						semanticObject : so,
						action : action
					},
					params : extraParameters
				});
				if(appType=="SAPUI5"){
					this._detachHashChangeListener();
				}
				window.location.hash = targetAppHash;
			} else {
				jQuery.sap.log.error("ushell CrossApplicationNavigation service returns null");
			}
		} else {
			jQuery.sap.log.error("ushell Services not running");
		}
		//Old Code - Manually Changing the hash
		/*
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setSemanticObject(so, false);
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setAction(action, false);
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setApplicationParameters(null, false);
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(appParameters, false);
		var dimensionsArray = this.SELECTED_VIEW.getDimensions();
		if(customParam.isFromOpenIn) {
			//Navigation Link Clicked from OpenIn
			extraFilters = this._getTableContextParameters(dimensionsArray);
			sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(extraFilters, false);
			extraFilters = this.use_CA ? this._getChartContextParameters(dimensionsArray) : this._getVizChartContextParameters(dimensionsArray); 
			sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(extraFilters, false);
		} else {
			if(customParam.isTable) {
				extraFilters = this._getTableContextParameters(dimensionsArray);
				sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(extraFilters, false);
				//Navigation Link Clicked from Table Popover
			} else {
				extraFilters = this._getChartContextParameters(dimensionsArray);
				sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(extraFilters, false);
				//Navigation Link Clicked From Chart Popover
			}
		}
		this._detachHashChangeListener();
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateHash();
		 */
	},
	_fillChartTablePopoverContent : function() {
		var that=this;
		var aViews = this._getListOfViewsForPopover(this.CONFIGURATION.getAllViews(), this.SELECTED_VIEW.getId());
		this.POPOVER_VIEW_NAVIGATION_MODEL.setData({
			VIEW_NAVIGATION : aViews
		});
		this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.setData({
			APP_NAVIGATION : []
		});
		if(this._popoverNavigationListReferences && this._popoverNavigationListReferences.length) {
			this._popoverNavigationListReferences.forEach(function(oNavigationList) {
				oNavigationList.setNoDataText(" ");
				oNavigationList.setBusy(true);
			}, this);
		}

		that._fetchNavigationLinks().done(function(){
			var NavigationService = sap.suite.ui.smartbusiness.Adapter.getService("Navigation");
			that.SEMANTIC_OBJECT_BY_CONTEXT_LINKS_ODATA_CALL_REF = NavigationService.getLinksByContext({
				semanticObject : that.SEMANTIC_OBJECT,
				dimensions : that.SELECTED_VIEW.getDimensions(),
				context : that,
				viewId : that.EVALUATION.getId() + "_" + that.SELECTED_VIEW.getId()
			}).done(function(links){
				var OPEN_IN_LINKS = jQuery.extend({}, that._OPEN_IN_LINKS);
				var uniqueLinks = that._getUniqueNavLinks(links, OPEN_IN_LINKS);
				if(uniqueLinks.length) {
					that.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.setData({
						APP_NAVIGATION : uniqueLinks
					});
				}
				if(that._popoverNavigationListReferences && that._popoverNavigationListReferences.length) {
					that._popoverNavigationListReferences.forEach(function(oNavigationList) {
						oNavigationList.setBusy(false);
						//oNavigationList.setNoDataText("-");
					}, that);
				}
			})
		});
	},    
	_getListOfViewsForPopover : function(allViews, excludeThisViewId) {
		var array = [];
		allViews.forEach(function(view){
			if(view.ID !== excludeThisViewId) {
				array.push(jQuery.extend(false, {}, view));
			}
		});
		return array;
	},
	_onTableRowSelected : function() {
		this._fillChartTablePopoverContent();
	},

	_getStacking : function(chartColumns) {
		var stacking = {
				stacking : false,
				dimensionStacked : false,
				measureStacked : false,
				stackedDimensionName : null
		};
		var currentView  = this.SELECTED_VIEW;
		chartColumns.forEach(function(eachColumn) {
			var oColumn = currentView.findColumnByName(eachColumn);
			if(oColumn.isMeasure()) {
				if(oColumn.isStacked()) {
					stacking.stacking = true;
					stacking.measureStacked = true;
					return false;
				}
			}
		});
		if(!stacking.stacking) {
			chartColumns.forEach(function(eachColumn) {
				var oColumn = currentView.findColumnByName(eachColumn);
				if(oColumn.isDimension()) {
					if(oColumn.isStacked()) {
						stacking.stacking = true;
						stacking.dimensionStacked = true;
						if(oColumn.getAxis() == 2) {
							stacking.stackedDimensionName = oColumn.getName()
							return false;
						}
					}
				}
			});
		}
		return stacking;
	},
	_getEvaluationThresholdMeasures : function(){
		var thresholdMeasuresArray = [];
		thresholdMeasuresArray.push(this.EVALUATION.getKpiMeasureName());
		if(this.EVALUATION.getThresholdValueType() === "MEASURE" || this.EVALUATION.getThresholdValueType() === "RELATIVE") {
			var thresholdObjArray = this.EVALUATION.getValues().results ;
			if(thresholdObjArray && thresholdObjArray.length) {
				for(var i=0;i<thresholdObjArray.length;i++) {
					if((thresholdObjArray[i]).COLUMN_NAME && !((thresholdObjArray[i]).FIXED)) {
						thresholdMeasuresArray.push((thresholdObjArray[i]).COLUMN_NAME);
					}
				}
			}
		}
		return thresholdMeasuresArray;
	},

	renderChart: function(viewConfiguration, chartConfig, chartColumns) {
		var that=this;
		var chart = this.getUIComponents().getChart();

		if(!chartConfig || !chartColumns.length)
			return;

		var vizVbox = this.getUIComponents().getVIZvbox();

		// render viz chart :			
		vizVbox.setVisible(true);

		chart.addEventDelegate({                    // find another solution.              
			onAfterRendering : function() {
				that._fillVizChartPopoverContent(that.vizChartPopover, false);
			}
		});

		chart.attachSelectData(jQuery.proxy(this._onVizChartDataPointSelection, this, {chartPopover: this.vizChartPopover})); 
		var dataSet = this.create_vizDataset(chartConfig, chartColumns);
		var oViz = this.getVizTypeAndIcon(chartConfig, viewConfiguration);
		chart.setVizType(oViz.type);
		chart.getParent().setIcon(oViz.icon);
		chart.setDataset(dataSet);		
//		this.setAllVizFormatters();
		this._addFeedsToVizFrame(chart, chartConfig, chartColumns);

		this.applyColorToVizChart(chart, chartConfig);	

		// for dual axes and bubble(add formatting etc. to viz properties):
		if(chartConfig.isDualAxis() || chartConfig.getChartType().isBubble()) {
			var vProperties = this.chart.getVizProperties();
			vProperties.valueAxis2 = {
					label:{
						formatString:"y2ValueAxisFormatter"
					}
			};
			this.chart.setVizProperties(vProperties);

			if((this.EVALUATION.getScaling() == -2) && (chartConfig.isAbsoluteValue()) && (chartConfig.getChartType().isBar() || chartConfig.getChartType().isColumn())) {
				this._handleVizDualAxisWhenPercentScale(that.chart);
			}
		}

		// end.

		this._showChartLegendIfApplicable(chartConfig,chartColumns);

	},
	renderAnalyticalMap : function(viewConfiguration) {
		var analyticalMap = this.getUIComponents().getAnalyticalMap();
		var mapController = analyticalMap.analyticalMap.getParent().getController();
		mapController.renderMap();
	},
	renderGeoMap : function(viewConfiguration) {
		var geoMap = this.getUIComponents().getGeoMap();
	},
	_showChartLegendIfApplicable : function(oChartConfig, aColumns) {
		var otoolbar = this.getUIComponents().getVizChartContainer() ;
		var oStacking = this._getStacking(aColumns);
		var VIEW = this.SELECTED_VIEW;
		var oChartType = oChartConfig.getChartType();
		var isStackApplied = ((oChartType.isBar() || oChartType.isColumn()) && oStacking.dimensionStacked && oStacking.stackedDimensionName && (VIEW.getDimensionCount() > 1)) ? true : false ;        

		if((VIEW.getMeasures().length > 1) || (isStackApplied)) {             //  || ((VIEW.getMeasures()).indexOf(this.EVALUATION.getKpiMeasureName()) == -1)
			otoolbar.setShowLegend(true);
		} else {
			otoolbar.setShowLegend(false);
		}

	},

	_isEvaluationThresholdMeasure: function(oMsr) {
		if(this.thresholdMeasuresArray && this.thresholdMeasuresArray.length) {
			var thresholdMsrsArray = this.thresholdMeasuresArray;
		} else {
			var thresholdMsrsArray = this._getEvaluationThresholdMeasures();
		}
		if(thresholdMsrsArray && thresholdMsrsArray.length) {
			if(thresholdMsrsArray.indexOf(oMsr) != -1) {
				return true;					
			} 
		}
		return false;
	},
	_getMeasuresByAxis: function() {
		var that = this;
		var VIEW = this.SELECTED_VIEW;
		var measures = VIEW.getMeasures() ;
		var axis1Msrs = [], axis2Msrs = [] ;
		for(var i=0;i<measures.length;i++) {
			var oColumn = VIEW.findColumnByName(measures[i]);
			if(oColumn.isMeasure() && (oColumn.getAxis() == 1)) {
				axis1Msrs.push(measures[i]);
			} else if(oColumn.isMeasure() && (oColumn.getAxis() == 2)) {
				axis2Msrs.push(measures[i]);
			}
		}
		return {
			axis1Msr:axis1Msrs,
			axis2Msr:axis2Msrs 
		}
	},
	_isMeasureSetPercentScaled: function(oMsrs) {
		if(this.thresholdMeasuresArray && this.thresholdMeasuresArray.length) {
			var thresholdMsrsArray = this.thresholdMeasuresArray;
		} else {
			var thresholdMsrsArray = this._getEvaluationThresholdMeasures();
		}
		if(thresholdMsrsArray && thresholdMsrsArray.length && oMsrs && oMsrs.length) {
			for(var i=0;i<oMsrs.length;i++) {
				if(thresholdMsrsArray.indexOf(oMsrs[i]) != -1) {
					return true;					
				} 
			}
		}
		return false;
	},

	_getChartNumberFormatter:function(isStandard, decimals, measure, overridePercentScaling, formatCsv){
		var self = this;
		overridePercentScaling = overridePercentScaling || false;
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}

		return function(s){
			if(!isNumber(s))
				if(formatCsv)
					return '"' + s + '"';
				else
					return s;
			var isACurrencyMeasure = self.isACurrencyMeasure(measure);
			var scale = overridePercentScaling ? 0 : null;
			var chartFormatter = self.getLibFormatter(s, isACurrencyMeasure, scale, decimals);
			if(formatCsv)
				return '"' + s + '"';
			return chartFormatter.format(Number(s));
		};
	},
	_getChartPercentFormatter:function(formatCsv){
		var that = this;
		var percentFormatter = that.getLibFormatter(1, false, -2);

		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		return function(s){
			if(isNumber(s)) {
				if(formatCsv)
					return '"' + s + '"';
				else
					return percentFormatter.format(Number(s));
			} else if(formatCsv) {
				return '"' + s + '"';
			} else
				return s;
		};
	},

	getColumnValueFormatter:function(sName,bIsDimension,isPercentScaled,axisScaled,formatCsv){
		var that = this;
		var VIEW = this.SELECTED_VIEW;    	
		var oConfig = (VIEW.getChartConfiguration())[0];
		var formatter;
		if(bIsDimension){
			formatter=function (s) {
				if(formatCsv) {
					return (s===0 || s) ? '"' + s + '"' : '"'+s+'"';
				} else {
					return (s===0 || s) ? s + "" : s;
				}
			};
		}else{
			if(isPercentScaled) {
				if(oConfig.getChartType().isTable()) {
					if(that._isEvaluationThresholdMeasure(sName))
//						formatter=this._getChartPercentFormatter(true);
						formatter=this._getChartPercentFormatter(formatCsv);
						else
							formatter=this._getChartNumberFormatter(true,this.nDecimal, sName, true, formatCsv);
				} else if((oConfig.isDualAxis()) && (oConfig.isAbsoluteValue()) && (oConfig.getChartType().isBar() || oConfig.getChartType().isColumn())) {
					var oColumn = VIEW.findColumnByName(sName);
					if(axisScaled[(oColumn.getAxis())-1] && that._isEvaluationThresholdMeasure(sName))
//						formatter=this._getChartPercentFormatter(true);
						formatter=this._getChartPercentFormatter(formatCsv);
					else
						formatter=this._getChartNumberFormatter(true,this.nDecimal, sName, true, formatCsv);
				} else {
//					formatter=this._getChartPercentFormatter(true);
					if(that._isEvaluationThresholdMeasure(sName)) {
						formatter=this._getChartPercentFormatter(formatCsv);
					} else {
						formatter=this._getChartNumberFormatter(true,this.nDecimal, sName, true, formatCsv);
					}
				}
			}
			else	
				formatter=this._getChartNumberFormatter(true,this.nDecimal, sName, true, formatCsv);
		}
		//var sUri =this.urlParsingService.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM);
		var sUri =this.metadataRef.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM);
		var oMetaData=sap.suite.ui.smartbusiness.lib.Util.odata.getEdmType(sUri,sName,true);
		var sType=oMetaData.type;
		var sFormat=oMetaData.format;
		sFormat = sFormat.toUpperCase();
		if(sType=='Edm.DateTime'){
			if(!sap.suite.ui.smartbusiness.lib.Util.odata.isTimeZoneIndependent(sUri,this.EVALUATION.getEntitySet())){
				var style;
				if(sFormat=="DATE" || sFormat=="NONE"){
					style="daysAgo";
				}else if(sFormat=="DATETIME"){
					style="";
				}
				if(style){
					var oF=new sap.ca.ui.model.type.Date({
						style: style
					});
					formatter=function(s){
						if(formatCsv)
							return '"' + oF.formatValue(s,"string") + '"';
						else
							return oF.formatValue(s,"string");
					};
				}else{
					var oF= sap.ui.core.format.DateFormat.getDateTimeInstance();
					formatter=function(ts){
						if(ts && ts.getMinutes){
							if(formatCsv)
								return '"' + oF.format(ts) + '"';
							else
								return oF.format(ts);
						}
						if(formatCsv)
							return '"' + ts + '"';
						else
							return ts;
					};
				}
			}else{
				formatter=function(ts){
					if(ts && ts.getMinutes){
						ts.setMinutes( ts.getMinutes() + ts.getTimezoneOffset());
						var instanceType=(sFormat=="DATE")?"getDateInstance":"getDateTimeInstance";
						return sap.ui.core.format.DateFormat[instanceType]().format(ts);
					}
					if(formatCsv)
						return '"' + ts + '"';
					else
						return ts;
				};
			}
		}
		return formatter;
	},
	/*	getChartPopoverFormatter:function(){
		jQuery.sap.require("sap.ui.core.format.NumberFormat");
		jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
		var oChartConfig= this.SELECTED_VIEW.getChartConfiguration()[0];
		var formatterArray=[[],[],[]] ;
		var that=this;
		var VIEW = this.SELECTED_VIEW;
		var measures=this.SELECTED_VIEW.getMeasures();
		var uom = this.MEASURE_UNIT_PROPERTY_MAPPING;
		var oChartType = oChartConfig.getChartType() ;
		var sUri =this.metadataRef.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM);
		var entitySet = this.EVALUATION.getEntitySet();
		var data=this.getUIComponents().getChart().getModel().getData().data;

		var percentFormatter = sap.ui.core.format.NumberFormat.getPercentInstance(this.oFormatOptions_percent);



		var isPercentScaled = ((this.EVALUATION.getScaling() == -2) && (this._isMeasureSetPercentScaled(measures)));


		function _getFormatter(sMeasure,sUri, entitySet, chartData) {


			var formattingMatadata  = sap.suite.ui.smartbusiness.lib.Util.odata.getFormattingMetadata(sUri, entitySet, sMeasure );
			return function(val){


				if (formattingMatadata._hasSapText) {

//						//	TODO:	sap:text based formatting
					return sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(val);

				}
				else 
				if(formattingMatadata._hasCurrency){
					var currencyValue = (chartData && chartData[0])?chartData[0][formattingMatadata._currencyColumn]?chartData[0][formattingMatadata._currencyColumn]:"":"";
					return sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(val, currencyValue);
				}
				else{
							var unit = "";
							var data=that.getUIComponents().getChart().getModel().getData().data;
							if(data && data.length) {
								unit=(data && data[0])?data[0][uom[sMeasure]]?" "+data[0][uom[sMeasure]]:"":"";
								data[0][uom[sMeasure]]
							}
							var numberFormatter= sap.ui.core.format.NumberFormat.getFloatInstance(that.oFormatOptions_core);
							return numberFormatter.format(val)+unit;
				  }
			}
		}


		function _getPercentFormatter(sMeasure) {

			return function(val) {
				return percentFormatter.format(val) ;
			} 
		}

		if(oChartConfig.isPercentageValue()){
			for(var k=0;k<measures.length;k++){


				formatterArray[0].push(function(val) {
					return percentFormatter.format(val) ;
				});
				formatterArray[1].push(function(val) {
					return percentFormatter.format(val) ;
				});
			}
		} else {			
			if((oChartConfig.isDualAxis()) && (oChartConfig.isAbsoluteValue()) && (oChartConfig.getChartType().isBar() || oChartConfig.getChartType().isColumn())) {
				var axisMeasures = this._getMeasuresByAxis();
				var isAxis1Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis1Msr);
				var isAxis2Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis2Msr);
				if(isPercentScaled && isAxis1Scaled) {
					for(var k=0;k<axisMeasures.axis1Msr.length;k++){
						formatterArray[0].push(_getPercentFormatter((axisMeasures.axis1Msr)[k]));
					}
				} else {
					for(var k=0;k<axisMeasures.axis1Msr.length;k++){
						formatterArray[0].push(_getFormatter((axisMeasures.axis1Msr)[k],sUri, entitySet, data));
					}
				}
				if(isPercentScaled && isAxis2Scaled) {
					for(var k=0;k<axisMeasures.axis2Msr.length;k++){
						formatterArray[1].push(_getPercentFormatter((axisMeasures.axis2Msr)[k]));
					}
				} else {
					for(var k=0;k<axisMeasures.axis2Msr.length;k++){
						formatterArray[1].push(_getFormatter((axisMeasures.axis2Msr)[k],sUri, entitySet, data));
					}
				}
			} else if(oChartConfig.getChartType().isBubble()) {
				for(var k=0;k<measures.length;k++){
					if(!(formatterArray[k]))
						formatterArray[k]=[];
					if(isPercentScaled)
						formatterArray[k].push(_getPercentFormatter(measures[k]));
					else
						formatterArray[k].push(_getFormatter(measures[k],sUri, entitySet, data));
				}
			} else {
				for(var k=0;k<measures.length;k++){
					if(isPercentScaled)
						formatterArray[0].push(_getPercentFormatter(measures[k]));
					else
						formatterArray[0].push(_getFormatter(measures[k],sUri, entitySet, data));
				}
			}			
		}
		return formatterArray;

	},               */

	/* TABLE Related Methods Start Here*/
	_getVisibleColumns : function(defaultColumns) {
		var visibleColumns = [];
		defaultColumns.forEach(function(column, index, array) {
			var oColumn = this.SELECTED_VIEW.findColumnByName(column);
			if(oColumn.isVisibleInTable()) {
				visibleColumns.push(column);
			}
		},this);
		return visibleColumns;
	},
	_getValueState : function(actualValue, thresholdValue) {
		if(!this.EVALUATION.isTargetKpi()) {
			if(actualValue < thresholdValue) {
				return this.EVALUATION.isMaximizingKpi() ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.Success;
			} else if (actualValue == thresholdValue) {
				return sap.ui.core.ValueState.None;
			} else {
				return this.EVALUATION.isMaximizingKpi() ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error;
			}
		} else {
			return sap.ui.core.ValueState.None;
		}
	},
	_getTableCell : function(originalMeasure, colorScheme, isPercentScaled, axisScale) {
		var sUri =this.metadataRef.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM);
		var entitySet = this.EVALUATION.getEntitySet();
		var formattingMatadata  = sap.suite.ui.smartbusiness.lib.Util.odata.getFormattingMetadata(sUri, entitySet, originalMeasure );

		var thresholdMeasure = this.SELECTED_VIEW.getChartConfiguration()[0] && this.SELECTED_VIEW.getChartConfiguration()[0].getThresholdMeasure();
		var that = this;

		function _getCurrencyFormatter() {
			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			return function(s, currencyCode){
				var isACurrencyMeasure = true;
				return that.libFormat_nonscaled(s, isACurrencyMeasure, currencyCode);
			};
		}

		if (formattingMatadata._hasCurrency && !isPercentScaled) {

			if(this.EVALUATION.isTargetKpi()) {
				return new sap.m.Label({
					text : {
						parts:[{path : originalMeasure},{path : formattingMatadata._currencyColumn}],
						formatter:_getCurrencyFormatter()
					},
					tooltip : {
                        parts:[{path : originalMeasure},{path : formattingMatadata._currencyColumn}],
                        formatter:_getCurrencyFormatter()
                    }
				});
			} else {
				if(colorScheme.isAutoSemantic() && thresholdMeasure) {
					return new sap.m.ObjectNumber({
						number: {
							parts:[{path : originalMeasure},{path : formattingMatadata._currencyColumn}],
							formatter:_getCurrencyFormatter()
						},
						tooltip: {
                            parts:[{path : originalMeasure},{path : formattingMatadata._currencyColumn}],
                            formatter:_getCurrencyFormatter()
                        },
						state : {
							parts : [
							         {path : originalMeasure},
							         {path : thresholdMeasure}
							         ],
							         formatter : function(oMeasureValue, tMeasureValue) {
							        	 try {
							        		 oMeasureValue = window.parseFloat(oMeasureValue);
							        		 tMeasureValue = window.parseFloat(tMeasureValue);
							        		 return that._getValueState(oMeasureValue, tMeasureValue);
							        	 }catch(e) {
							        		 return sap.ui.core.ValueState.None;
							        	 }
							         }
						}
					});
				} else {
					return new sap.m.Label({
						text : {
							parts:[{path : originalMeasure},{path : formattingMatadata._currencyColumn}],
							formatter:_getCurrencyFormatter()
						},
						tooltip : {
                            parts:[{path : originalMeasure},{path : formattingMatadata._currencyColumn}],
                            formatter:_getCurrencyFormatter()
                        }
					});
				}
			}

		}
		else{
			if(this.EVALUATION.isTargetKpi()) {
				return new sap.m.Label({
					text : {
						path : originalMeasure,
						formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
					},
					tooltip : {
                        path : originalMeasure,
                        formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
                    }
				});
			} else {
				if(colorScheme.isAutoSemantic() && thresholdMeasure) {
					return new sap.m.ObjectNumber({
						number: {
							path: originalMeasure,
							formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
						},
						tooltip: {
                            path: originalMeasure,
                            formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
                        },
						state : {
							parts : [
							         {path : originalMeasure},
							         {path : thresholdMeasure}
							         ],
							         formatter : function(oMeasureValue, tMeasureValue) {
							        	 try {
							        		 oMeasureValue = window.parseFloat(oMeasureValue);
							        		 tMeasureValue = window.parseFloat(tMeasureValue);
							        		 return that._getValueState(oMeasureValue, tMeasureValue);
							        	 }catch(e) {
							        		 return sap.ui.core.ValueState.None;
							        	 }
							         }
						}
					});
				} else {
					return new sap.m.Label({
						text : {
							path : originalMeasure,
							formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
						},
						tooltip : {
                            path : originalMeasure,
                            formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
                        }
					});
				}
			}

		}

//		// && (originalMeasure !== thresholdMeasure) put this condition if required
//		if(this.EVALUATION.isTargetKpi()) {
//		return new sap.m.Label({
//		text : {
//		path : originalMeasure,
//		formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
//		}
//		});
//		} else {
//		if(colorScheme.isAutoSemantic() && thresholdMeasure) {
//		return new sap.m.ObjectNumber({
//		number: {
//		path: originalMeasure,
//		formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
//		},
//		state : {
//		parts : [
//		{path : originalMeasure},
//		{path : thresholdMeasure}
//		],
//		formatter : function(oMeasureValue, tMeasureValue) {
//		try {
//		oMeasureValue = window.parseFloat(oMeasureValue);
//		tMeasureValue = window.parseFloat(tMeasureValue);
//		return that._getValueState(oMeasureValue, tMeasureValue);
//		}catch(e) {
//		return sap.ui.core.ValueState.None;
//		}
//		}
//		}
//		});
//		} else {
//		return new sap.m.Label({
//		text : {
//		path : originalMeasure,
//		formatter:this.getColumnValueFormatter(originalMeasure,false,isPercentScaled,axisScale)
//		}
//		});
//		}
//		}
	},
	_sortTableByColumnName : function(oColumnHeader) {
		var iconMapping = {
				"asc" : String.fromCharCode(0xe1e1),
				"desc" : String.fromCharCode(0xe1e2)
		};
		var sortOrder = null;
		if(oColumnHeader.sort_by === void (0)) {
			sortOrder = "desc";
		} else {
			sortOrder = oColumnHeader.sort_by =="asc" ? "desc" : "asc";
		}
		oColumnHeader.sort_by = sortOrder;
		var allColumns = this.getUIComponents().getTable().getColumns();
		allColumns.forEach(function(oColumn) {
			var header = oColumn.getHeader();
			header.setText(header.dimension_label+(header.UOM?" ("+header.UOM+")":""));
		});

		oColumnHeader.setText(iconMapping[sortOrder]+" "+oColumnHeader.dimension_label+(oColumnHeader.UOM?" ("+oColumnHeader.UOM+")":""));

		var oColumn = this.SELECTED_VIEW.findColumnByName(oColumnHeader.dimension_key);
		var actualSortBy = oColumn.getSortBy();

		this.TABLE_SORTING = [{
			name : actualSortBy,
			order : sortOrder
		}];
		this.fetchDataForChart();

	},
	_appendUOMToTableHeader : function(result) {
		if(this.UOM_APPENDED_TO_HEADER) {
			return;
		}
		var columns = this.getUIComponents().getTable().getColumns();
		columns.forEach(function(oColumn) {
			var columnHeaderText = oColumn.getHeader().getText();
			var columnName = oColumn.column_name;
			var oColumnObject = this.SELECTED_VIEW.findColumnByName(columnName);
			if(oColumnObject.isMeasure()) {
				var uomProperty = this.MEASURE_UNIT_PROPERTY_MAPPING[columnName];
				if(uomProperty!==columnName) {
					var uomValue = result[uomProperty];
					if(uomValue) {
						oColumn.getHeader().UOM = uomValue;
						oColumn.getHeader().setText(columnHeaderText+" ("+uomValue+")");
						oColumn.getHeader().setTooltip(columnHeaderText+" ("+uomValue+")");
					}
				}
			}
		},this);
		this.UOM_APPENDED_TO_HEADER = true;
	},
	renderTable: function(tableColumns, colorScheme) {
		var that = this;

		var vizVbox = this.getUIComponents().getVIZvbox();
		vizVbox.setVisible(true);

		var table = this.getUIComponents().getTable();
		var oConfig = (this.SELECTED_VIEW.getChartConfiguration())[0];
		table.removeAllColumns();
		var SELECTED_VIEW = this.SELECTED_VIEW;
		var visibleColumns = this._getVisibleColumns(tableColumns);
		this.COLUMNS_SORT = [];
		tableColumns.forEach(function(sColumn, index, allColumns) {
			var oColumn = this.SELECTED_VIEW.findColumnByName(sColumn);
			if(oColumn.getSortBy() && oColumn.getSortOrder()) {
				/*TO be on safer side.. Checking the sort order value */
				if(oColumn.getSortOrder() == "asc" || oColumn.getSortOrder() == "desc") {
					this.COLUMNS_SORT.push({
						name : oColumn.getSortBy(),
						order : oColumn.getSortOrder()
					});
				}
			}
		}, this);

		var isPercentScaled = false ;
		if((this.EVALUATION.getScaling() == -2) && !((oConfig.isPercentageValue()) && (oConfig.getChartType().isBar() || oConfig.getChartType().isColumn()))) {
			isPercentScaled = this._isMeasureSetPercentScaled(this.SELECTED_VIEW.getMeasures());			 
		}

		var axisScale = [] ;
		if(isPercentScaled) {
			if((oConfig.isDualAxis()) && (oConfig.isAbsoluteValue()) && (oConfig.getChartType().isBar() || oConfig.getChartType().isColumn())) {
				var axisMeasures = this._getMeasuresByAxis();
				axisScale.push(this._isMeasureSetPercentScaled(axisMeasures.axis1Msr));
				axisScale.push(this._isMeasureSetPercentScaled(axisMeasures.axis2Msr));
			}
		}

		var template =  new sap.m.ColumnListItem({
			type: sap.m.ListType.Active 
		});
		for (var i = 0, l= visibleColumns.length ; i < l; i++) {
			var oColumn = this.SELECTED_VIEW.findColumnByName(visibleColumns[i]);
			var Label = new sap.m.Label({
				text: this.COLUMN_LABEL_MAPPING[visibleColumns[i]], //Use the Label instead of Technical Column Name
				tooltip: this.COLUMN_LABEL_MAPPING[visibleColumns[i]]
			}).addStyleClass("tableColumnHeader");
			Label.dimension_key = visibleColumns[i];
			Label.dimension_label = this.COLUMN_LABEL_MAPPING[visibleColumns[i]];
			Label.attachBrowserEvent("click", function() {
				that._sortTableByColumnName(this);
			});
			var columns = new sap.m.Column({
				hAlign: oColumn.isMeasure() ? "End" : "Begin",
						styleClass: "qty",
						header: Label,
						minScreenWidth: "Tablet",
						demandPopin: true,
			});
			columns.column_name = visibleColumns[i];
			if(oColumn.isMeasure()) {
				//Dynamically get oCell object based on Threshold Measure
				var oCell = this._getTableCell(visibleColumns[i], colorScheme, isPercentScaled, axisScale);
				template.addCell(oCell);
			} else {
				var oCell = new sap.m.Label({
					text: {
						path: this.DIMENSION_TEXT_PROPERTY_MAPPING[visibleColumns[i]],
						formatter:this.getColumnValueFormatter(this.DIMENSION_TEXT_PROPERTY_MAPPING[visibleColumns[i]],true)
					},
					tooltip: {
                        path: this.DIMENSION_TEXT_PROPERTY_MAPPING[visibleColumns[i]],
                        formatter:this.getColumnValueFormatter(this.DIMENSION_TEXT_PROPERTY_MAPPING[visibleColumns[i]],true)
                    }
				});
				template.addCell(oCell);
			}
			table.addColumn(columns);
		}
		table.bindAggregation("items", "/data", template);
	},
	/* TABLE Related Methods End Here*/



	/*
	 * EVENT-HANDLERS :: BEGIN
	 */

	_abortPendingODataCalls : function() {
		var abort = function(oDataCallRef) {
			try {
				if(oDataCallRef) {
					oDataCallRef.abort();
				}
			}catch(e) {}
		};
		var abortArray = function(aODataCallRef) {
			if(aODataCallRef && aODataCallRef.length) {
				aODataCallRef.forEach(function(odataCallRef) {
					abort(odataCallRef);
				});
			}
		};
		abort(this.DDA_CONFIG_ODATA_CALL_REF);
		abort(this._bundled_evaluations_call_ref);
		abort(this.EVALUATION_ODATA_CALL_REF);
		abort(this.SEMANTIC_OBJECT_LINKS_ODATA_CALL_REF);
		abortArray(this.SEMANTIC_OBJECT_BY_CONTEXT_LINKS_ODATA_CALL_REF);
		abort(this.CHART_TABLE_DATA_ODATA_CALL_REF);
		abort(this.FETCH_AGREGATION_VALUE_ODATA_CALL_REF);
	},
	onBack: function(evt) {
		this._abortPendingODataCalls();
		window.history.back();

	},
	_resetConfigurations : function() {
		this.TABLE_SORTING = null;
		this.UOM_APPENDED_TO_HEADER = null;
		this.setChartSelectionContextObject(null);
	},

	_attachHashChangeEvent: function () {
		this.hashChanger = this.oRouter.oHashChanger;
		var that = this;
		if (this.hashChanger) {
			try {
				if (!that.hashChangerAttached) {
					this.hashChanger.attachEvent("hashChanged", this._proxyHashChangeListener);
					this.hashChanger.viewRef = this;
				}
				that.hashChangerAttached = true;
			} catch (e) {
				jQuery.sap.log.error("Couldn't Attach HashChange Event");
			}
		} else {

			jQuery.sap.log.error("Router HashChanger Object Found NULL");
		}
	},
	getUrlFilters : function() {
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
	},
	getAllFilters : function() {
		var evaluationFilters = this.EVALUATION.getFilters()["results"] || [];
		var urlFilters=this.getUrlFilters();
		var tmp={};
		urlFilters.forEach(function(o){
			tmp[o.NAME]=true;

		});
		return urlFilters.concat(evaluationFilters.filter(function(o){
			return !tmp[o.NAME];
		}));
	},
	getAdditionFiltersForChipConfiguration : function() {
		var params = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters(["viewId"]/*Excludes array keys*/);
		var urlFilters = [];
		if(params) {
			for (var key in params) {
				var filterValues = params[key];
				if(filterValues && filterValues.length) {
					filterValues.forEach(function(eachFilterValue) {
						var tempArray = [];
						tempArray[0] = key;
						tempArray[1] = "EQ";
						tempArray[2] = eachFilterValue;
						tempArray[3] = "";
						urlFilters.push(tempArray);
					});
				}
			}
		}
		return urlFilters;
	},
	_hideKpiHeaderIfRequired : function() {
		return;

		if(this.CONFIGURATION.getHeaders().length == 0) {
			return;
		}
		try {
			var appParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters(["viewId"]);
			if(appParameters) {
				if(Object.keys(appParameters).length) {
					this.getUIComponents().getTileContainer().$().css("overflow","hidden");
					this.getUIComponents().getTileContainer().$().animate({
						height : "0px"
					});
					return;
				}
			}
			this.getUIComponents().getTileContainer().$().animate({
				height : "156px"
			});
		} catch(e) {
			jQuery.sap.log.error("Failed to Hide KPI Header : "+e);
		}
	},
	hashChangeListener: function (hashChangeEvent) {
		this.NEW_HASH = hashChangeEvent ? hashChangeEvent.getParameter("newHash") : "";
		this.OLD_HASH = hashChangeEvent ? hashChangeEvent.getParameter("oldHash") : "";        
		var AppParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters();
		var Key_ViewId = "viewId";
		//when no specific view specified - take default view (default mode)
		if(!AppParameters[Key_ViewId]) {
			this.SELECTED_VIEW = this.CONFIGURATION.getDefaultView();
			if (this.SELECTED_VIEW) {
				this.renderView(this.SELECTED_VIEW);
				AppParameters.viewId = [this.SELECTED_VIEW.getId()];
				sap.suite.ui.smartbusiness.drilldown.lib.Hash.setApplicationParameters(AppParameters, false);
				var hash = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getHash();
				window.location.replace("#"+hash);
			} else {
				jQuery.sap.log.error("Evaluation does not have any views configured");
			}
		}
		//when application starts with a specific viewId/filter in the hash (bookmark mode)
		else if(!this.SELECTED_VIEW) {
			this.firstTimeFlag = true;
			this.SELECTED_VIEW = this.CONFIGURATION.findViewById(AppParameters[Key_ViewId][0]);
			if (this.SELECTED_VIEW) {
				this._resetConfigurations();
				this.renderView(this.SELECTED_VIEW);
				//accessing internal property _oFirstDimensionSelect to set selected View.
				//It doesn't fire the change automatically; so done manually
				this._hideKpiHeaderIfRequired();
				this._setViewComboBoxSelectedIndex();
				this.fetchKpiValue();
				this.fetchDataForChart();
				this.updateFilter();
			} else {
				jQuery.sap.log.error("The view with viewId : "+ AppParameters[Key_ViewId][0]  + " does not exist");
			}
		}
		//when viewId gets changed in the hash (viewswitch mode)
		else if(this.SELECTED_VIEW && AppParameters[Key_ViewId][0] != this.SELECTED_VIEW.getId()) {
			this.SELECTED_VIEW = this.CONFIGURATION.findViewById(AppParameters[Key_ViewId][0]);
			if(this.firstTimeFlag) {
				sap.suite.ui.smartbusiness.lib.Util.cache.invalidateKpiDetailsCache();
			}
			this._setViewComboBoxSelectedIndex();
			this._resetConfigurations();
			this.renderView(this.SELECTED_VIEW);
			this.fetchKpiValue();
			this.fetchDataForChart();
			this._hideKpiHeaderIfRequired();
			this.updateFilter();
			this._refreshKpiHeaderTiles();
		}
		//when filters/view change in the hash
		else {
			// invalidating cache on change of filters
			if(this.firstTimeFlag) {
				sap.suite.ui.smartbusiness.lib.Util.cache.invalidateKpiDetailsCache();
			}
			this._setViewComboBoxSelectedIndex();
			this._hideKpiHeaderIfRequired();
			this.updateFilter();
			this.fetchKpiValue();
			this.fetchDataForChart();
			this._refreshKpiHeaderTiles();
		}
		this.byId("vizViewSelector").setTooltip(((this.SELECTED_VIEW && this.SELECTED_VIEW.getTitle()) || ""));
	},
	_refreshKpiHeaderTiles : function() {
		var header_container = this.getUIComponents().getTileContainer();
		sap.suite.ui.smartbusiness.drilldown.lib.MiniChartManager.hashChangeListner({
			allTiles : this.CONFIGURATION.getHeaders(),
			headerContainer : header_container,
			sapSystem : this.SAP_SYSTEM,
			urlFilters : this.getUrlFilters(),
			firstTimeFlag : this.firstTimeFlag
		});
		this.firstTimeFlag = true;
	},
	_setViewComboBoxSelectedIndex : function() {
		try {
			var vizViewSelector = this.getView().byId("vizViewSelector");	
			vizViewSelector.setSelectedKey(this.SELECTED_VIEW.getId());				
		} catch(e) {
			jQuery.sap.log.error("Failed to Set Selected Index of View ComboBox");
		}
	}, 
	//Experimental
	_fixFacetListSelection : function() {
		try {
			var filter = this.getUIComponents().getFilter();
			var facetFilter = filter.getFacetFilterReference();
			var urlParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters(["viewId"]);
			var facetLists = facetFilter.getLists();
			if(facetLists.length) {
				facetLists.forEach(function(facetList) {
					var dimensionName = facetList._techName;
					if(urlParameters[dimensionName]) {
						var aFilterValue = urlParameters[dimensionName];
						var items = facetList.getItems();
						if(items.length) {
							items.forEach(function(item) {
								var curKey=item.getBindingContext().getObject()[facetList._techName]||"";
								curKey=curKey.getTime?curKey.getTime()+"":curKey+"";
								if(aFilterValue.indexOf(curKey) > -1) {
									item.setSelected(true);
								} else {
									item.setSelected(false);
								}
							});
						}
					} else {
						var items = facetList.getItems();
						if(items.length) {
							items.forEach(function(item) {
								item.setSelected(false);
							});
						}
					}
				}, this);
			}
		} catch(e) {
		}
	},
	/*
	 * EVENT-HANDLERS :: END
	 */
	_getUniqueNavLinks : function(results, existingLinks) {
		var uniqueLinks=[];
		var curApp = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getSemanticObject()+"-"+sap.suite.ui.smartbusiness.drilldown.lib.Hash.getAction();
		results.forEach(function(s){
			var t=s.id.split("~")[0];
			if(t) {
				if(!existingLinks[t]) {
					existingLinks[t] = t;
					if(s.id.indexOf(curApp) == -1) {
						uniqueLinks.push(s);
					}
				}
			}
		});
		return uniqueLinks;
	},
	_initExternalNavigationLinks : function(results) {
		var that=this;
		this.noNavigationLinks = false;
		this.listOfLinks = new sap.m.List({
			//noDataText : "-"
		});		
		this._externalLinkPromiseObject = {};
		sap.suite.ui.smartbusiness.Adapter.getService("Navigation").reset();
		this._oExternalNavLinksSOPopover = new sap.m.ResponsivePopover({
			modal:false,
			showHeader : false,
			enableScrolling:true,
			verticalScrolling:true,
			horizontalScrolling:false,
			placement:sap.m.PlacementType.Top,
			contentWidth:"18rem",
			content : that.listOfLinks
		});
		if(jQuery.device.is.phone) {
			this._oExternalNavLinksSOPopover.setShowHeader(true);
		}
		var model = new sap.ui.model.json.JSONModel({"EXTERNAL_APP_LINKS" : null});
		that.listOfLinks.bindItems("/EXTERNAL_APP_LINKS", new sap.m.StandardListItem({
			title : "{text}",
			customData : new sap.ui.core.CustomData({
				key : "{id}",
				value : "{applicationType}"
			}),
			tooltip : "{text}",
			type : sap.m.ListType.Navigation,
			press : jQuery.proxy(that._onAppSelection,that,{publishContext : true,isFromOpenIn : true})
		})).setModel(model);
		that.listOfLinks.getModel().setData({"EXTERNAL_APP_LINKS" : results});
//      this._oExternalNavLinksSOPopover.attachAfterOpen(function(){
//          that._fetchNavigationLinks();
//      });
	},
	_externalLinkPromiseObject : {},
	_fetchNavigationLinks : function() {
		var key = "EXTERNAL_NAV_LINK";
		if(!this._externalLinkPromiseObject[key]) {
			var that = this;
			var deferred = new jQuery.Deferred();
	//		this._externalLinkPromiseObject[key] = deferred.promise();
	//		this._oExternalNavLinksSOPopover.setBusy(true);
			var NavigationService = sap.suite.ui.smartbusiness.Adapter.getService("Navigation");
			var so = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getSemanticObject();
			var semanticObject = [so];
			var startTimeFetchSOLinks = new Date().getTime();
			var businessParamsMap = {};
			if(this.CHIP_ID) {
				businessParamsMap["chipId"] = this.CHIP_ID;
			}
			if(this._EVALUATION_ID) {
				businessParamsMap["evaluationId"] = this._EVALUATION_ID;
			}
			that.SEMANTIC_OBJECT_LINKS_ODATA_CALL_REF = NavigationService.getLinksBySemanticObject({
				success : function(results) {
					var endTimeFetchSOLinks = new Date().getTime();
					that._requestTimeLog["SEMANTIC_OBJECT_LINKS"] = {
							title : "Semantic Object Links",
							time : endTimeFetchSOLinks - startTimeFetchSOLinks
					};
					results = that._getUniqueNavLinks(results, that._OPEN_IN_LINKS) || [];
					if(results.length){
						// that.listOfLinks.getModel().setData({"EXTERNAL_APP_LINKS" : results});
					}
					//that._oExternalNavLinksSOPopover.setBusy(false);
					deferred.resolve(results);
				},
				async : true,
				error : function(error) {
					jQuery.sap.log.error("Error fetching navigation links by semantic object : "+so);
					that._oExternalNavLinksSOPopover.setBusy(false);
					deferred.reject();
				},
				semanticObject : semanticObject,
				businessParam : businessParamsMap,
				context : that
			});
		} 
		return deferred.promise();
		//return this._externalLinkPromiseObject[key];
	},

	_showExternalNavigationLinks : function(srcControl) {
		if(!this._oExternalNavLinksSOPopover.isOpen()) {
			this._oExternalNavLinksSOPopover.openBy(srcControl);	
		}
	},
	_toggleFilter : function() {
		var oController = this;
		var filter = this.getUIComponents().getFilter();
		if(!filter.getSelectedItems())
		{
			filter.setVisible(!filter.getVisible());
		}else
			if(filter.getSelectedItems() && filter.getVisible()==true){

				this.oI18nModel = oController.getView().getModel("i18n");
				sap.m.MessageBox.alert(oController.oI18nModel.getResourceBundle().getText("Do_you_really_want_to_reset_the_filters?"),{onClose:function(oEvent){
					if(oEvent=="OK"){
						filter.resetFilter();
						filter.setVisible(false);
					}else if(oEvent=="CANCEL"){
						filter.setVisible(true);
					}
				},
				title:oController.oI18nModel.getResourceBundle().getText("Reset_Filters"),
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL]
				});



			}
	},
	setHeaderFooterOptionsWithoutOpenInButton : function() {
		var options = this.getHeaderFooterOptions();
		options.buttonList = [];
		this.setHeaderFooterOptions(options);
		/*
		 * On Setting Header and Footer Again,the page title is Lost 
		 */
		this.renderTitle();
	},
	getHeaderFooterOptions : function() {
		var options = this._getHeaderFooterOptions();
		var oController = this;
		var oI18nModel = oController.getView().getModel("i18n");
		var os = sap.ui.Device.os.name;
		if(os && os == sap.ui.Device.os.OS.WINDOWS) {
			options.additionalShareButtonList.push({
				sBtnTxt: oI18nModel.getResourceBundle().getText("EXPORT_AS_CSV"),
				sIcon: "sap-icon://excel-attachment",
				onBtnPressed: function (oEvent) {
					oController._exportAsCSV();
				}
			});

		}
		if((window.location.hostname =="localhost") || (jQuery.sap.getUriParameters().get("sbcmode") == "99")) {
			options.additionalShareButtonList.push({
				sBtnTxt: "Enable Compact Mode",
				sIcon: "sap-icon://resize",
				onBtnPressed: function (oEvent) {
					if(oController._compactMode) {
						oController.getView().removeStyleClass("sapUiSizeCompact");
						oController._compactMode = false;
						oEvent.getSource().setText("Enable Compact Mode");
					} else {
						oController.getView().addStyleClass("sapUiSizeCompact");
						oController._compactMode = true;
						oEvent.getSource().setText("Disable Compact Mode");
					}
					//Fixing post resize issue.
					this._fixPostResizeIssue();
					jQuery(window).trigger("resize");
				}
			});
		}
		if((window.location.hostname =="localhost") || (jQuery.sap.getUriParameters().get("sbrequestlog") == "99")) {
			options.additionalShareButtonList.push({
				sBtnTxt: "Request-Time Log",
				sIcon: "sap-icon://time-entry-request",
				onBtnPressed: function (oEvent) {
					oController._performance.start(oController._requestTimeLog, oController._compactMode);
				}
			});
		}
		/*
		var ELIGIBLE_TILES_TO_ENABLE_ADD_TO_HOME = ["NT","AT","TT"];
		if(true || ELIGIBLE_TILES_TO_ENABLE_ADD_TO_HOME.indexOf(this.TILE_TYPE) > -1) {
		 */
		if(oController.CHIP_ID && oController.CHIP_ID != sap.suite.ui.smartbusiness.Configuration.Constants.SMARTBUSINESS_NULL_VALUE) {
			options.additionalShareButtonList.push({
				sBtnTxt: oI18nModel.getResourceBundle().getText("SAVE_AS_TILE"),
				sIcon: "sap-icon://add-favorite",
				onBtnPressed: function (oEvent) {
					oController._openAddToHomeDialogBox();
				}
			});
		}
		return options;
	},
	_getHeaderFooterOptions : function () {
		var oController = this;
		var oI18nModel = oController.getView().getModel("i18n");
		this.oListItem = new sap.m.ObjectListItem();
		var add2HomeIcon = String.fromCharCode(0xe078);
		var oOptions = {
				onBack: function () {
					oController._abortPendingODataCalls();
					window.history.back();
				},
				sFullscreenTitle: "",
				onFacetFilter: function() {
					oController._toggleFilter();
					oController._fixPostResizeIssue();
					$(window).trigger('resize');
				},
				buttonList : [{
					sBtnTxt : oI18nModel.getResourceBundle().getText("OPEN_IN_LABEL"),
					onBtnPressed: function (oEvent) {
						oController._showExternalNavigationLinks(oEvent.getSource());
					}
				}],
				bSuppressBookmarkButton: true,
				oJamOptions: {
					fGetShareSettings: function () {
						var oHeader = oController.getView().byId("header-ribbon");
						// Create object List Item for shareToJam
						var oListItem = new sap.m.ObjectListItem();
						oListItem.setTitle(oHeader.getTitle());
						oListItem.setNumber(oHeader.getNumber());
						oListItem.setNumberUnit(oHeader.getNumberUnit());
						var oShareSettings = {
								object: {
									id: window.location.href,
									display: oListItem,
									share: "SAP Smart Business" //TODO
								}
						};
						return oShareSettings;
					},
				},additionalShareButtonList : [],
				oEmailSettings: {
					fGetMailBody: function () {
						var oHeader = oController.getView().byId("header-ribbon");
						if(oHeader.getNumberUnit()){
							return "(" + oController.EVALUATION.getKpiName().trim() + "/" + oHeader.getTitle().trim() + ": " + oHeader.getNumber() +" "+ (oHeader.getNumberUnit()) +")" + "\n" + window.location.href;
						}
						else{
							return "(" + oController.EVALUATION.getKpiName().trim() + "/" + oHeader.getTitle().trim() + ": " + oHeader.getNumber()  +")" + "\n" + window.location.href;	
						}
					}
				},
		};
		if(jQuery.device.is.phone)
		{
			oOptions.buttonList.push({
				sBtnTxt : oI18nModel.getResourceBundle().getText("SHOW_RELATED_KPIS"),
				onBtnPressed: function (oEvent) {
					var action = oController.ACTION;
					oController._detachHashChangeListener();
					sap.suite.ui.smartbusiness.lib.Util.utils.setHash({action:action, route:"miniChart"});
				}
			});
		}
		return oOptions;
	},
	_initRequestTimeLogChart : function() {
		if((window.location.hostname =="localhost") || (jQuery.sap.getUriParameters().get("sbrequestlog") == "99")) {
			jQuery.sap.require("sap.suite.ui.smartbusiness.drilldown.lib.Performance");
			this._performance = new sap.suite.ui.smartbusiness.drilldown.lib.Performance();
		}
	},

	addExportMethodToTable : function() {

		var that = this;
		sap.m.Table.prototype.exportData = sap.m.Table.prototype.exportData || function (mSettings) {

			jQuery.sap.require("sap.ui.core.util.Export");
			mSettings = mSettings || {};
			if (!mSettings.rows) {
				mSettings.rows = {
						path: "/data",
				};
			}
			var oExport = new sap.ui.core.util.Export(mSettings);
			this.addDependent(oExport);
			return oExport;
		}
	},

	_exportAsCSV : function() {
		var that = this;
		jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
		var columnNames = [];
		var configuredColumns = [];
		var oConfig = (this.SELECTED_VIEW.getChartConfiguration())[0];
		var isPercentScaled = false ;
		configuredColumns = this.SELECTED_VIEW.getColumns();
		for(var i=0;i<configuredColumns.length; i++) {
			columnNames.push(configuredColumns[i]);
			var textMappingProperty = this.DIMENSION_TEXT_PROPERTY_MAPPING[configuredColumns[i]];
			var uomProperty = this.MEASURE_UNIT_PROPERTY_MAPPING[configuredColumns[i]]
			if(textMappingProperty && textMappingProperty!=configuredColumns[i]) {
				columnNames.push(textMappingProperty);
			}
			if(uomProperty) {
				columnNames.push(uomProperty);
			}
		}

		if((that.EVALUATION.getScaling() == -2) && !((oConfig.isPercentageValue()) && (oConfig.getChartType().isBar() || oConfig.getChartType().isColumn()))) {
			isPercentScaled = that._isMeasureSetPercentScaled(that.SELECTED_VIEW.getMeasures());			 
		}

		var column = jQuery.map(columnNames, function(colName){
			return {
				name : that.COLUMN_LABEL_MAPPING[colName] || colName,
				template : {
					content : {
						path: colName,
						formatter: that.getColumnValueFormatter(colName, that.SELECTED_VIEW.getDimensions().indexOf(colName) > -1 ? true : false, isPercentScaled, false, true)
					}
				}
			};
		});

		this.getUIComponents().getTable().exportData({
			exportType : new sap.ui.core.util.ExportTypeCSV({separatorChar : ","}),
			columns : column
		}).saveFile().always(function() {
			this.destroy();
		});    

	},


	_openAddToHomeDialogBox : function() {
		this.oATHDialog.setModel(this.getView().getModel("i18n"), "i18n");
		this._compactMode ? this.oATHDialog.addStyleClass("sapUiSizeCompact") : this.oATHDialog.removeStyleClass("sapUiSizeCompact");
		this.oATHDialog.open();
	},
	_initAddToHomeDialogBox  : function() {
		var oController = this;
		this.oATHDialogContent = new sap.ui.view({
			type : "XML",
			viewName : "sap.suite.ui.smartbusiness.drilldown.view.AddToHome",
			viewData : this
		});
		this.oATHDialog = new sap.m.Dialog({
			title : "{i18n>SAVE_AS_TILE_DIALOG_TITLE}",
			content : [
			           this.oATHDialogContent  
			           ],
			           beginButton : new sap.m.Button({
			        	   text : "{i18n>OK_BUTTON}",
			        	   press : function() {
			        		   oController.oATHDialogContent.getController().publishTile(function(){
			        			   oController.oATHDialog.close();
			        		   });
			        	   }
			           }), 
			           endButton : new sap.m.Button({
			        	   text : "{i18n>CANCEL_BUTTON}",
			        	   press : function() {
			        		   oController.oATHDialog.close();
			        	   }
			           })
		});
		this.oATHDialog.addStyleClass("sbAddToHomeDialogBox");
		this.getView().addDependent(this.oATHDialog);
	},
	getUIComponents : function() {
		var page = this.getView().byId("smartbusiness_drilldown_page");
		var vizChartContainer = this.getView().byId("vizChartContainer");
		var header = this.getView().byId("header-ribbon");
		var headerContainer = this.byId('headerContainerVBox');

		var tilesContainer = this.getView().byId("header-container");
		var facetFilter = this.getView().byId("facetFilter");

		var vizVbox = this.getView().byId("vizVbox");

		var that = this;

		return {
			getChart : function() {
				return that.chart;
			},
			getTable : function() {
				return that.table;
			},
			getVizChartContainer : function() {
				return vizChartContainer;
			},
			getFilter : function() {
				return facetFilter;
			},
			getHeader : function() {
				return header;
			},
			getHeaderContainer : function() {
				return headerContainer;
			},
			getTileContainer : function() {
				return tilesContainer;
			},
			getPage : function() {
				return page;
			},
			getVIZvbox : function() {
				return vizVbox;
			},
			getAnalyticalMap : function() {
				return that.analyticalMap;
			},
			getGeoMap : function() {
				return that.geoMap;
			}
		};
	},
	onExit : function() {
		this._abortPendingODataCalls();
		this._detachHashChangeListener();
	},


//	viz charts code :	

	create_vizDataset: function(oChartConfig, aColumns) {
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			data: {
				path: "/data"
			}
		});

		var oStacking = this._getStacking(aColumns);
		var VIEW = this.SELECTED_VIEW;
		//Adding Dimension to DataSet
		var oChartType = oChartConfig.getChartType();		
		aColumns.forEach(function(sColumn) {
			var oColumn = VIEW.findColumnByName(sColumn);
			if(oColumn.isDimension()) {
				var oDimensionDefinition = new sap.viz.ui5.data.DimensionDefinition({
					name : this.COLUMN_LABEL_MAPPING[oColumn.getName()],
					//axis : 1,
					value : {
						path : this.DIMENSION_TEXT_PROPERTY_MAPPING[oColumn.getName()],
						formatter : this.getColumnValueFormatter(this.DIMENSION_TEXT_PROPERTY_MAPPING[oColumn.getName()], true)
					}
				});
				oDimensionDefinition.column_name = oColumn.getName();
				oDataset.addDimension(oDimensionDefinition);
			}
		}, this);

		//Adding Measure to Dataset
		if(oChartType.isLine() || oChartType.isCombination() || oChartType.isBubble() || oChartType.isBar() || oChartType.isColumn()) {
			aColumns.forEach(function(sColumn) {
				var oColumn = VIEW.findColumnByName(sColumn);
				if(oColumn.isMeasure()) {
					var oMeasureDefinition = new sap.viz.ui5.data.MeasureDefinition({
						name : this.COLUMN_LABEL_MAPPING[oColumn.getName()],
						value : {
							path : oColumn.getName()
						}
					});
					oMeasureDefinition.column_name = oColumn.getName();
					oDataset.addMeasure(oMeasureDefinition);
				}
			}, this);
		}

		return oDataset;

	},

	setAllVizFormatters: function() {
		var that = this;
		sap.viz.api.env.Format.useDefaultFormatter(false);
		jQuery.sap.require("sap.ui.core.format.NumberFormat");

		var sUri =this.metadataRef.addSystemToServiceUrl(this.EVALUATION.getODataUrl(), this.SAP_SYSTEM);
		var entitySet = this.EVALUATION.getEntitySet();
		var data=this.getUIComponents().getChart().getModel().getData().data;
		var vizChart = this.chart;

		var oChartConfig = (this.SELECTED_VIEW.getChartConfiguration())[0];
		var oChartType =  oChartConfig.getChartType();
		var isPercentScaled = this._isMeasureSetPercentScaled(this.SELECTED_VIEW.getMeasures());
		if((this.EVALUATION.getScaling() == -2) && (oChartConfig.isDualAxis()) && (oChartConfig.isAbsoluteValue()) && (oChartType.isBar() || oChartType.isColumn())) {
			var axisMeasures = this._getMeasuresByAxis();
			var isAxis1Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis1Msr);
			var isAxis2Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis2Msr);
		}

		function _getFormatterForPopover(value,sUri, entitySet, chartData, vizChart, isACurrencyMeasure) {
			var numberFormat = that.getLibFormatter(value, isACurrencyMeasure, 0);
			return numberFormat.format(Number(value));
		}

		var customFormatter = {
				locale: function(){},
				format: function(value, pattern) {
					/*************************************************************************************
					 * [FORMATTING LIMITATION] 2015-03-27
					 *  To format popover and data-label based on currency or not, the measure in scope
					 *  is required to be passed here by this viz's method, which it isn't passing.
					 *  see //sapui5.hana.ondemand.com/sdk/docs/api/symbols/sap.viz.ui5.api.env.Format.html
					 *  For the timebeing, it's assumed that this measure is not of type currency.
					 **************************************************************************************/

					var isACurrencyMeasure = false;

					if(pattern == "yValueAxisFormatter"){
						var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance( 
								{style: 'short', 
									minFractionDigits: 1,
									maxFractionDigits: 1,}
						);
						if(oChartConfig.isPercentageValue() && (oChartType.isBar() || oChartType.isColumn())) {
							numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance();							
						} else if((that.EVALUATION.getScaling() == -2) && isPercentScaled && (oChartConfig.isDualAxis()) && (oChartType.isBar() || oChartType.isColumn())) {
							if(isAxis1Scaled) {
								numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
										{style: 'short', 
											minFractionDigits: 1,
											maxFractionDigits: 1,}
								);	
							}
						} else if((that.EVALUATION.getScaling() == -2) && isPercentScaled) {
							numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
									{style: 'short', 
										minFractionDigits: 1,
										maxFractionDigits: 1,}
							);	
						}	
						return numberFormat.format(Number(value)); 
					} else if(pattern == "y2ValueAxisFormatter"){
						var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance( 
								{style: 'short', 
									minFractionDigits: 1,
									maxFractionDigits: 1,}
						);
						if(oChartConfig.isPercentageValue() && (oChartType.isBar() || oChartType.isColumn())) {
							numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance();							
						} else if((that.EVALUATION.getScaling() == -2) && isPercentScaled && (oChartConfig.isDualAxis()) && (oChartType.isBar() || oChartType.isColumn())) {
							if(isAxis2Scaled) {
								numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
										{style: 'short', 
											minFractionDigits: 1,
											maxFractionDigits: 1,}
								);	
							}
						} else if((that.EVALUATION.getScaling() == -2) && isPercentScaled) {
							numberFormat = sap.ui.core.format.NumberFormat.getPercentInstance(
									{style: 'short', 
										minFractionDigits: 1,
										maxFractionDigits: 1,}
							);	
						}						
						return numberFormat.format(Number(value)); 
					} else if(pattern == "dataLabelFormatter"){
						var numberFormat = that.getLibFormatter(value, isACurrencyMeasure, 0);
						if((that.EVALUATION.getScaling() == -2) && isPercentScaled && !((oChartConfig.isPercentageValue() || oChartConfig.isDualAxis()) && (oChartType.isBar() || oChartType.isColumn()))) {
							numberFormat = that.getLibFormatter(value, isACurrencyMeasure, -2);
						}
						return numberFormat.format(Number(value));  
					} else if(pattern == "dataLabelPercentFormatter"){
						var numberFormat = that.getLibFormatter(value, isACurrencyMeasure, -2);
						return numberFormat.format(Number(value));  
					} else if(pattern == "vizPopOver"){
						if(oChartConfig.isPercentageValue() && (oChartType.isBar() || oChartType.isColumn())) {
							var numberFormat = that.getLibFormatter(value, isACurrencyMeasure, -2);
							return numberFormat.format(Number(value)); 
						} else if((that.EVALUATION.getScaling() == -2) && isPercentScaled  && !((oChartConfig.isPercentageValue() || oChartConfig.isDualAxis()) && (oChartType.isBar() || oChartType.isColumn()))) {
							var numberFormat = that.getLibFormatter(value, isACurrencyMeasure, -2);
							return numberFormat.format(Number(value));
						}
						return _getFormatterForPopover(value,sUri, entitySet, data, vizChart, isACurrencyMeasure); 
					} else if(pattern == "vizPercentPopOver"){
						var numberFormat = that.getLibFormatter(value, isACurrencyMeasure, -2);
						return numberFormat.format(Number(value));  
					} 
					else{
						return value;
					}
				}
		};

		jQuery.sap.require("sap.viz.ui5.api.env.Format");
		sap.viz.ui5.api.env.Format.numericFormatter(customFormatter);
	},

	_handleVizDualAxisWhenPercentScale: function(chart) {
		var that = this;
		var vProperties = chart.getVizProperties();
		var formatObj = {};
		var popopFormatter = {};
		var axisMeasures = this._getMeasuresByAxis();
		var isAxis1Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis1Msr);
		var isAxis2Scaled = this._isMeasureSetPercentScaled(axisMeasures.axis2Msr);
		if(isAxis1Scaled) {
			for(var i=0;i<axisMeasures.axis1Msr.length;i++) {
				formatObj[(that.COLUMN_LABEL_MAPPING[((axisMeasures.axis1Msr)[i])])] = "dataLabelPercentFormatter";
				popopFormatter[(that.COLUMN_LABEL_MAPPING[((axisMeasures.axis1Msr)[i])])] = "vizPercentPopOver";
			}
		} else {
			for(var i=0;i<axisMeasures.axis1Msr.length;i++) {
				formatObj[(that.COLUMN_LABEL_MAPPING[((axisMeasures.axis1Msr)[i])])] = "dataLabelFormatter";
				popopFormatter[(that.COLUMN_LABEL_MAPPING[((axisMeasures.axis1Msr)[i])])] = "vizPopOver";
			}
		}
		if(isAxis2Scaled) {
			for(var i=0;i<axisMeasures.axis2Msr.length;i++) {
				formatObj[(that.COLUMN_LABEL_MAPPING[((axisMeasures.axis2Msr)[i])])] = "dataLabelPercentFormatter";
				popopFormatter[(that.COLUMN_LABEL_MAPPING[((axisMeasures.axis2Msr)[i])])] = "vizPercentPopOver";
			}
		} else {
			for(var i=0;i<axisMeasures.axis2Msr.length;i++) {
				formatObj[(that.COLUMN_LABEL_MAPPING[((axisMeasures.axis2Msr)[i])])] = "dataLabelFormatter";
				popopFormatter[(that.COLUMN_LABEL_MAPPING[((axisMeasures.axis2Msr)[i])])] = "vizPopOver";
			}
		}
		vProperties.plotArea.dataLabel = {
				visible: true,
				formatString: formatObj
		};
		chart.setVizProperties(vProperties);
		//popover
		this.vizChartPopover.setFormatString(popopFormatter);
	},

	_appendUOMToVizChartAxis : function(data) {
		var oChart, aMeasures, oVizProperties, UOMS, uomFlag, uomPropertyName, uomValue, chartConfig, chartType;
		var getUomAsString = function (oUoms) {
			var aUoms = [];
			for(var each in oUoms) {
				aUoms.push(oUoms[each]);
			}
			return aUoms.join(" & ");
		};
		var getAxisObject = function (sAxisLabel) {
			return {
				visible : true,
				text : sAxisLabel
			};			
		}; 
		oChart = this.getUIComponents().getChart();
		if(!oChart) {
			return;
		}
		aMeasures = this.SELECTED_VIEW.getMeasures();
		oVizProperties = oChart.getVizProperties() || {};
		UOMS = {};
		uomFlag = false;
		if(aMeasures.length == 1 && aMeasures[0] == this.EVALUATION.getKpiMeasureName()) {
			var sMeasure = aMeasures[0];
			uomPropertyName = this.MEASURE_UNIT_PROPERTY_MAPPING[sMeasure];
			if(uomPropertyName) {
				uomValue = data[uomPropertyName];
				if(uomValue) {
					UOMS[sMeasure] = uomValue;
					uomFlag = true;
				} else {
					UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure];
				}
			} else {
				UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure];
			}
		} else {
			aMeasures.forEach(function(sMeasure) {
				uomPropertyName = this.MEASURE_UNIT_PROPERTY_MAPPING[sMeasure];
				if(uomPropertyName) {
					uomValue = data[uomPropertyName];
					if(uomValue) {
						UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure] +" ("+uomValue+")";
						uomFlag = true;
					} else {
						UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure];
					}
				} else {
					UOMS[sMeasure] = this.COLUMN_LABEL_MAPPING[sMeasure];
				}
			}, this);
		}
		chartConfig = this.SELECTED_VIEW.getChartConfiguration()[0];
		chartType = chartConfig.getChartType();
		if(uomFlag) {
			if(!(oVizProperties.valueAxis)) {
				oVizProperties.valueAxis = {};
			} 
			if(chartType.isColumn() || chartType.isBar()) {
//				if(chartConfig.isAbsoluteValue()) {
				if(chartConfig.isSingleAxis()) {
					oVizProperties.valueAxis.title = getAxisObject(getUomAsString(UOMS));					
				} else {
					var x1Axis = {}, x2Axis = {};
					aMeasures.forEach(function(sMeasure) {
						var oMeasure = this.SELECTED_VIEW.findMeasureByName(sMeasure);
						if(oMeasure.getAxis() == 1) {
							x1Axis[sMeasure] = UOMS[sMeasure];
						} else if(oMeasure.getAxis() == 2) {
							x2Axis[sMeasure] = UOMS[sMeasure];
						}
					}, this);
					oVizProperties.valueAxis.title = getAxisObject(getUomAsString(x1Axis));
					if(!(oVizProperties.valueAxis2)) {
						oVizProperties.valueAxis2 = {};
					} 
					oVizProperties.valueAxis2.title = getAxisObject(getUomAsString(x2Axis));					
				}
//				}
			} else if(chartType.isBubble()) {
				var sLabel = [];
				for(var i=0;i<2;i++) {
					sLabel[i] = UOMS[(aMeasures[i])];
				}
				oVizProperties.valueAxis.title = getAxisObject(sLabel[0]);
				if(!(oVizProperties.valueAxis2)) {
					oVizProperties.valueAxis2 = {};
				} 
				oVizProperties.valueAxis2.title = getAxisObject(sLabel[1]);								
			} else if (chartType.isTable()){
				//Nothing to do
			} else {
				oVizProperties.valueAxis.title = getAxisObject(getUomAsString(UOMS));
			}
			oChart.setVizProperties(oVizProperties);
		}
	},

	onVizViewChange: function(evt) {
		//Reseting something that needs to be reset  
		this._resetConfigurations();
		var selectedViewId = evt.getParameters().selectedItem.getProperty("key");
		/* Old Code - reseting all filters
        sap.suite.ui.smartbusiness.drilldown.lib.Hash.setApplicationParameters({
            viewId : [selectedViewId]
        });
		 */

		/**
		 * New Code - Do not reset filters on view change
		 */
		var AppParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters();
		AppParameters["viewId"] = [selectedViewId];
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setApplicationParameters(AppParameters);

	},

	getVizTypeAndIcon: function(chartConfig, viewConfiguration) {
		var vType = "bar";
		var vIcon = "sap-icon://bar-chart";
		var oType = chartConfig.getChartType();	
		if(oType.isBar()) {
			vIcon = "sap-icon://horizontal-bar-chart";
			if(chartConfig.isSingleAxis()) {
				if(chartConfig.isAbsoluteValue()) {
					if(chartConfig.isStackingEnabled(viewConfiguration)) {
						vType = "stacked_bar";
						vIcon = "sap-icon://horizontal-stacked-chart";
					} else {
						vType = "bar";
					}
				} else {
					vType = "100_stacked_bar";
					vIcon = "sap-icon://full-stacked-chart";
				}
			} else if(chartConfig.isDualAxis()) {
				if(chartConfig.isAbsoluteValue()) {
					vType = "dual_stacked_bar";
					vIcon = "sap-icon://horizontal-bar-chart";
				} else {
					vType = "100_dual_stacked_bar";
					vIcon = "sap-icon://full-stacked-chart";
				}
			}
		} else if(oType.isColumn()) {
			vType = "column";
			vIcon = "sap-icon://vertical-bar-chart";
			if(chartConfig.isSingleAxis()) {
				if(chartConfig.isAbsoluteValue()) {
					if(chartConfig.isStackingEnabled(viewConfiguration)) {
						vType = "stacked_column";
						vIcon = "sap-icon://vertical-stacked-chart";
					} else {
						vType = "column";
					}
				} else {
					vType = "100_stacked_column";
					vIcon = "sap-icon://full-stacked-column-chart";
				}
			} else if(chartConfig.isDualAxis()) {
				if(chartConfig.isAbsoluteValue()) {
					vType = "dual_stacked_column";
					vIcon = "sap-icon://vertical-bar-chart";
				} else {
					vType = "100_dual_stacked_column";
					vIcon = "sap-icon://full-stacked-column-chart";
				}
			}
		} else if(oType.isLine()) {
			vType = "line";
			vIcon = "sap-icon://line-chart";
		} else if(oType.isCombination()) {
			vType = "combination";
			vIcon = "sap-icon://business-objects-experience";
		} else if(oType.isBubble()) {
			vType = "bubble";
			vIcon = "sap-icon://bubble-chart";
		}		

		return {type:vType,icon:vIcon};
	},

	_fillVizChartPopoverContent : function(chartPopover, bIsTable) {
		var that=this;
		var aViews = this._getListOfViewsForPopover(this.CONFIGURATION.getAllViews(), this.SELECTED_VIEW.getId());
		this.POPOVER_VIEW_NAVIGATION_MODEL.setData({
			VIEW_NAVIGATION : aViews
		});
		this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.setData({
			APP_NAVIGATION : []
		});

		var popLinks = [];

		for(var i=0;i<this.POPOVER_VIEW_NAVIGATION_MODEL.getData().VIEW_NAVIGATION.length;i++){
			popLinks.push({
				type: 'action', 
				text: (this.POPOVER_VIEW_NAVIGATION_MODEL.getData().VIEW_NAVIGATION)[i].TITLE,
				press: jQuery.proxy(that._onVizViewSelection, that, {customData: (this.POPOVER_VIEW_NAVIGATION_MODEL.getData().VIEW_NAVIGATION)[i], publishContext : true, isTable : !!bIsTable})
			});
		}
//		popLinks.push({
//			type: 'action',
//			text: "-",
//			press: function(){ jQuery.sap.log.error("No Navigation links available"); },
//		});

		chartPopover.setActionItems(popLinks);

		that._fetchNavigationLinks().done(function() {
			var NavigationService = sap.suite.ui.smartbusiness.Adapter.getService("Navigation");
			that.SEMANTIC_OBJECT_BY_CONTEXT_LINKS_ODATA_CALL_REF = NavigationService.getLinksByContext({
				semanticObject : that.SEMANTIC_OBJECT,
				dimensions : that.SELECTED_VIEW.getDimensions(),
				context : that,
				viewId : that.EVALUATION.getId() + "_" + that.SELECTED_VIEW.getId()
			}).done(function(links) {
				var OPEN_IN_LINKS = jQuery.extend({}, that._OPEN_IN_LINKS);
				var uniqueLinks = that._getUniqueNavLinks(links, OPEN_IN_LINKS);
				if(uniqueLinks.length) {
					that.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.setData({
						APP_NAVIGATION : uniqueLinks
					});
				}
				if(uniqueLinks.length) {
					popLinks.pop();
					for(var i=0;i<that.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.getData().APP_NAVIGATION.length;i++){
						popLinks.push({
							type: 'action',
							text: (that.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.getData().APP_NAVIGATION)[i].text,
							press: jQuery.proxy(that._onVizAppSelection,that,{customData: (that.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.getData().APP_NAVIGATION)[i], publishContext : true, isTable : !!bIsTable}),
						});
					}
					chartPopover.setActionItems(popLinks);
				}               
			});
		});
	},    

	_addVizPopoverContent: function(chartPopover, bIsTable) {
		var that = this;

		var allViews = this._getListOfViewsForPopover(this.CONFIGURATION.getAllViews(), this.SELECTED_VIEW.getId()); 

		//this.popoverProps.actionItems = [];
		var popLinks = [];

		for(var i=0;i<this.POPOVER_VIEW_NAVIGATION_MODEL.getData().VIEW_NAVIGATION.length;i++){
			popLinks.push({
				type: 'action', 
				text: (this.POPOVER_VIEW_NAVIGATION_MODEL.getData().VIEW_NAVIGATION)[i].TITLE,
				press: jQuery.proxy(that._onVizViewSelection, that, {customData: (this.POPOVER_VIEW_NAVIGATION_MODEL.getData().VIEW_NAVIGATION)[i], publishContext : true, isTable : !!bIsTable})
			});
		}

//		var listOfNavigations = new sap.m.List({

//		});
//		this._popoverNavigationListReferences.push(listOfNavigations);
//		listOfNavigations.bindItems("/APP_NAVIGATION", new sap.m.StandardListItem({
//		title : "{text}",
//		type : sap.m.ListType.Navigation,
//		customData : new sap.ui.core.CustomData({
//		key : "{id}",
//		value : "{applicationAlias}"
//		}),
//		press : jQuery.proxy(this._onAppSelection,this,{publishContext : true, isTable : !!bIsTable})
//		}).setTooltip("{text}"));
//		listOfNavigations.setModel(this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL);

//		var popoverContent = new sap.m.VBox({
//		items : [listOfViews, listOfNavigations],
//		width : "99%"
//		});

		if(this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.getData().APP_NAVIGATION.length) {
			for(var i=0;i<this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.getData().APP_NAVIGATION.length;i++){
				popLinks.push({
					type: 'action',
					text: (this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.getData().APP_NAVIGATION)[i].text,
					press: jQuery.proxy(that._onVizAppSelection,that,{customData: (this.POPOVER_EXTERNAL_APP_NAVIGATION_MODEL.getData().APP_NAVIGATION)[i], publishContext : true, isTable : !!bIsTable}),
				});
			}
		} 
		chartPopover.setActionItems(popLinks);
//		chartPopover = new sap.viz.ui5.controls.Popover(that.popoverProps);
//		chartPopover.connect(that.oVizFrame.getVizUid());

	},

	_onVizViewSelection: function(customParam, oEvent) {
		var viewId = customParam.customData.ID;
		var parameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters();
		var dimensionsArray = this.SELECTED_VIEW.getDimensions();
		var extraFilters = this[customParam.isTable ? "_getTableContextParameters" : "_getVizChartContextParameters"](dimensionsArray,false);
		for(var each in extraFilters) {
			if(parameters[each]) {
				delete parameters[each];
			}
			parameters[each] = extraFilters[each]
		}
		parameters["viewId"] = viewId;
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setApplicationParameters(parameters,false);
		if(customParam.isTable){
			this.getUIComponents().getTable().setSelectedContext(null);
		}else{
			this.setChartSelectionContextObject(null);
		}
		
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateHash();
		//Old Code
		/*
		var parameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters();
		parameters["viewId"] = viewId;
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setApplicationParameters(parameters, false);
		var extraFilters = {};
		var dimensionsArray = this.SELECTED_VIEW.getDimensions();
		if(customParam.isTable) {
			extraFilters = this._getTableContextParameters(dimensionsArray);
			sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateApplicationParameters(extraFilters, false);
			this.getUIComponents().getTable().setSelectedContext(null);
		} else {
			extraFilters = this._getVizChartContextParameters(dimensionsArray);
			sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateApplicationParameters(extraFilters, false);
			this.setChartSelectionContextObject(null);
		}
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateHash();
		this._hideOrShowFacetFilterIfRequired();
		 */
	},

	_getVizChartContextParameters : function(dimensionsArray) {
		var that = this;
		var extraFilters, chartContexts;
		extraFilters = {};
		var dimeArray = this.DIMENSION_TEXT_PROPERTY_MAPPING;
		var x = [];
		dimensionsArray.forEach(function(dim){
			y = {};
			y.dimId = dim;
			y.dimText = dimeArray[dim];
			x.push(y); 
		})
		
		if(this.chart) {
			chartContexts = this.chart.vizSelection();
			var chartData = this.chart.getModel().getData().data; 
			if(chartContexts && chartContexts.length) {
				for(var i=0;i<chartContexts.length;i++) {
					var cObject = chartContexts[i];
					x.forEach(function(eachDimension){
						if(eachDimension.dimText) {
							var dimValArray = [];
							var selectedText = chartData[(cObject.data._context_row_number)][eachDimension.dimText];
							for(var itr = 0 ; itr < chartData.length; itr++) {
								if(chartData[itr][eachDimension.dimText] === selectedText) {
									dimValArray.push(chartData[itr][eachDimension.dimId]);
								}
							}
							for(var itr = 0; itr < dimValArray.length; itr++) {
								if(dimValArray[itr]==null){
							dimensionValue="SAP_SMARTBUSINESS_NULL";
						}
						if(dimValArray[itr] || dimValArray[itr]==0 || dimValArray[itr]=='') {
							if(dimValArray[itr].getTime) {
								dimValArray[itr] = dimValArray[itr].getTime();
							}
							if(extraFilters[eachDimension.dimId]) {
								extraFilters[eachDimension.dimId].push(dimValArray[itr]);
							} else {
								extraFilters[eachDimension.dimId] = [];
								extraFilters[eachDimension.dimId].push(dimValArray[itr]);
							}
						}
							}

						} else {
						var dimensionValue = chartData[(cObject.data._context_row_number)][eachDimension.dimId];        //(cObject.data)[(that.COLUMN_LABEL_MAPPING[eachDimension])];
						if(dimensionValue==null){
							dimensionValue="SAP_SMARTBUSINESS_NULL";
						}
						if(dimensionValue || dimensionValue==0 || dimensionValue=='') {
							if(dimensionValue.getTime) {
								dimensionValue = dimensionValue.getTime();
							}
							if(extraFilters[eachDimension.dimId]) {
								extraFilters[eachDimension.dimId].push(dimensionValue);
							} else {
								extraFilters[eachDimension.dimId] = [];
								extraFilters[eachDimension.dimId].push(dimensionValue);
							}
						}
						}
					});
				}
			}
		}
		return extraFilters;
	},

	_onVizAppSelection : function(customParam, oEvent) {
		var cleanUp = function(appParameters, contextParameters) {
			if(contextParameters) {
				for(var sParamKey in contextParameters) {
					if(appParameters && appParameters[sParamKey]) {
						delete appParameters[sParamKey];
					}
				}
			}
		};
		var extraFilters, navId = customParam.customData.id;
		var appType = customParam.customData.value ;
		var soAction = navId.split("~")[0];
		var splits = soAction.split("-");
		var so = splits[0];
		var action = splits[1];
		var appParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters(["viewId"]);
		if(so == "AdhocAnalysis") {
			appParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getApplicationParameters();
		}
		var startupParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters();
		//var extraParameters = appParameters?jQuery.extend(true,{},appParameters):{};
		var extraParameters = {};
		var dimensionsArray = this.SELECTED_VIEW.getDimensions();
		if(customParam.isFromOpenIn) {
			//Navigation Link Clicked from OpenIn
			extraFilters = this._getTableContextParameters(dimensionsArray);
			cleanUp(appParameters, extraFilters);
			jQuery.extend(true, extraParameters, extraFilters);
			extraFilters = this._getVizChartContextParameters(dimensionsArray); 
			cleanUp(appParameters, extraFilters);
			jQuery.extend(true, extraParameters, extraFilters);
		} else {
			if(customParam.isTable) {
				//Navigation Link Clicked from Table Popover
				extraFilters = this._getTableContextParameters(dimensionsArray);
				cleanUp(appParameters, extraFilters);
				jQuery.extend(true, extraParameters, extraFilters);
			} else {
				//Navigation Link Clicked From Chart Popover
				extraFilters = this._getVizChartContextParameters(dimensionsArray);
				cleanUp(appParameters, extraFilters);
				jQuery.extend(true, extraParameters, extraFilters);
			}
		}
		jQuery.extend(true, extraParameters, startupParameters,appParameters);

		//New Code - Using Shell API to Change the HASH
		if(sap.ushell.Container && sap.ushell.Container.getService) {
			var oCrossApplicationNavigation = sap.ushell.Container.getService("CrossApplicationNavigation");
			if(oCrossApplicationNavigation) {
				var targetAppHash = oCrossApplicationNavigation.hrefForExternal({
					target : {
						semanticObject : so,
						action : action
					},
					params : extraParameters
				});
				if(appType=="SAPUI5"){
					this._detachHashChangeListener();
				}
				window.location.hash = targetAppHash;
			} else {
				jQuery.sap.log.error("ushell CrossApplicationNavigation service returns null");
			}
		} else {
			jQuery.sap.log.error("ushell Services not running");
		}

		//Old Code - Changing hash manually
		/*
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setSemanticObject(so, false);
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setAction(action, false);
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.setApplicationParameters(null, false);
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(appParameters, false);
		var dimensionsArray = this.SELECTED_VIEW.getDimensions();
		if(customParam.isFromOpenIn) {
			//Navigation Link Clicked from OpenIn
			extraFilters = this._getTableContextParameters(dimensionsArray);
			sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(extraFilters, false);
			extraFilters = this._getVizChartContextParameters(dimensionsArray);
			sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(extraFilters, false);
		} else {
			if(customParam.isTable) {
				extraFilters = this._getTableContextParameters(dimensionsArray);
				sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(extraFilters, false);
				//Navigation Link Clicked from Table Popover
			} else {
				extraFilters = this._getVizChartContextParameters(dimensionsArray);
				sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateStartupParameters(extraFilters, false);
				//Navigation Link Clicked From Chart Popover
			}
		}
		this._detachHashChangeListener();
		sap.suite.ui.smartbusiness.drilldown.lib.Hash.updateHash();
		 */
	},

	_onVizChartDataPointSelection: function(customParam, oEvent) {
		if(!(customParam.chartPopover.getActionItems() && customParam.chartPopover.getActionItems().length)) {
			this._fillVizChartPopoverContent(customParam.chartPopover, false);
			//this._addVizPopoverContent(customParam.chartPopover, false);
		}
	},

	_addFeedsToVizFrame: function(oVizFrame, chartConfig, aColumns) {
		var that = this;
		var oStacking = this._getStacking(aColumns);
		var VIEW = this.SELECTED_VIEW;
		var oChartType = chartConfig.getChartType();

		var dimensionLabels=[],measureLabels=[] ;
		for(var i=0;i<VIEW.getDimensions().length;i++) {
			dimensionLabels.push(that.COLUMN_LABEL_MAPPING[((VIEW.getDimensions())[i])]);
		}
		for(var i=0;i<VIEW.getMeasures().length;i++) {
			measureLabels.push(that.COLUMN_LABEL_MAPPING[((VIEW.getMeasures())[i])]);
		}

		if(oChartType.isBubble()) {
			var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "primaryValues",
				type: "Measure",
				values: [measureLabels[0]]
			}), feedSecondaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "secondaryValues",
				type: "Measure",
				values: [measureLabels[1]]
			}), feedBubbleWidth = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "bubbleWidth",
				type: "Measure",
				values: [measureLabels[2]]
			}), feedRegionColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "regionColor",
				type: "Dimension",
				values: dimensionLabels
			});
			oVizFrame.addFeed(feedPrimaryValues);
			oVizFrame.addFeed(feedSecondaryValues);
			oVizFrame.addFeed(feedBubbleWidth);
			oVizFrame.addFeed(feedRegionColor);
		} else if((oChartType.isBar() || oChartType.isColumn()) && (chartConfig.isDualAxis())) {
			var dualMsr = this._getMeasuresByAxis();
			var dualMsrAxis1 = [],dualMsrAxis2 = [] ;
			for(var i=0;i<dualMsr.axis1Msr.length;i++) {
				dualMsrAxis1.push(that.COLUMN_LABEL_MAPPING[dualMsr.axis1Msr[i]] || dualMsr.axis1Msr[i]);
			}
			for(var i=0;i<dualMsr.axis2Msr.length;i++) {
				dualMsrAxis2.push(that.COLUMN_LABEL_MAPPING[dualMsr.axis2Msr[i]] || dualMsr.axis2Msr[i]);
			}
			var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "primaryValues",
				type: "Measure",
				values: dualMsrAxis1
			});
			var feedSecValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "secondaryValues",
				type: "Measure",
				values: dualMsrAxis2
			});
			var feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "axisLabels",
				type: "Dimension",
				values: dimensionLabels
			});
			oVizFrame.addFeed(feedPrimaryValues);
			oVizFrame.addFeed(feedSecValues);
			oVizFrame.addFeed(feedAxisLabels);
		} else if((oChartType.isBar() || oChartType.isColumn()) && oStacking.dimensionStacked && oStacking.stackedDimensionName && (VIEW.getDimensionCount() > 1)) {
			var index = dimensionLabels.indexOf(that.COLUMN_LABEL_MAPPING[(oStacking.stackedDimensionName)]);
			if (index > -1) {
				var oDimStackArray = dimensionLabels.splice(index, 1);
			}
			var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "primaryValues",
				type: "Measure",
				values: measureLabels
			}), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "axisLabels",
				type: "Dimension",
				values: dimensionLabels
			}); 
			oVizFrame.addFeed(feedPrimaryValues);
			oVizFrame.addFeed(feedAxisLabels);
			if(oDimStackArray && oDimStackArray.length) {
				var feedRegionColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid: "regionColor",
					type: "Dimension",
					values: oDimStackArray
				});			
				oVizFrame.addFeed(feedRegionColor);
			}
		} else {
			var feedPrimaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "primaryValues",
				type: "Measure",
				values: measureLabels
			}), feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
				uid: "axisLabels",
				type: "Dimension",
				values: dimensionLabels
			});
			oVizFrame.addFeed(feedPrimaryValues);
			oVizFrame.addFeed(feedAxisLabels);
		}
	},

	applyColorToVizChart: function(chart, chartConfig) {
		// implement custom coloring ..............................
		var oController = this;

		this.oI18nModel = oController.getView().getModel("i18n");
		var oChartType = chartConfig.getChartType();
//		var colorMapper = this.getCAtoVizColorMapping();
		var thresholdMeasure = chartConfig.getThresholdMeasure();
		var colorScheme = chartConfig.getColorScheme();
		if(!colorScheme.getText()) {
			jQuery.sap.log.error("Color Scheme Value Missing");
			return;
		}
		var measures = chart.getDataset().getMeasures();
		var oVizProperties = chart.getVizProperties();
		oVizProperties.plotArea.dataPointStyle = {};
		chart.setVizProperties(oVizProperties);
		if((oChartType.isBar() || oChartType.isColumn()) && (chartConfig.isDualAxis())) {
			oVizProperties.plotArea.primaryValuesColorPalette = [];
			oVizProperties.plotArea.secondaryValuesColorPalette = [];
		} else {
			oVizProperties.plotArea.colorPalette = [];	
		}				
		if(colorScheme.isManual()) {
			measures.forEach(function(oMeasure, index, oMeasures) {
				var _color = this.SELECTED_VIEW.findMeasureByName(oMeasure.column_name).getColor();
				var _axis = this.SELECTED_VIEW.findMeasureByName(oMeasure.column_name).getAxis();
				if(!_color) {
					if(colorScheme.isManualSemantic()) {
						jQuery.sap.log.warning("Semantic Color NOT found for measure name : " + oMeasure.getName() +", assigning default to 'Neutral Light'");
						_color= "sapUiChartPaletteSemanticNeutralLight1";
					} else {
						jQuery.sap.log.warning("Color NOT found for measure name : " + oMeasure.getName() +", assigning default color");
						_color = "";
					}
				}
				var vizColor = (oController.convertCAtoVizColorCode(_color)) || ("sapUiChartPaletteQualitativeHue"+((index % 11)+1));
				if((oChartType.isBar() || oChartType.isColumn()) && (chartConfig.isDualAxis())) {
					if(_axis == 1) {
						(oVizProperties.plotArea.primaryValuesColorPalette).push(vizColor);
					} else if(_axis == 2) {
						(oVizProperties.plotArea.secondaryValuesColorPalette).push(vizColor);
					}
				} else {
					(oVizProperties.plotArea.colorPalette).push(vizColor);
				}
			}, this);
			chart.setVizProperties(oVizProperties);
		} else if(colorScheme.isAutoSemantic() && !this.EVALUATION.isTargetKpi()) {
			if(thresholdMeasure) {
				measures.forEach(function(oMeasure, index, oMeasures) {
					var _axis = this.SELECTED_VIEW.findMeasureByName(oMeasure.column_name).getAxis();
					if(oMeasure.getName() ==  thresholdMeasure) {
						if((oChartType.isBar() || oChartType.isColumn()) && (chartConfig.isDualAxis())) {
							if(_axis == 1) {
								(oVizProperties.plotArea.primaryValuesColorPalette).push("sapUiChartPaletteSemanticNeutral");
							} else if(_axis == 2) {
								(oVizProperties.plotArea.secondaryValuesColorPalette).push("sapUiChartPaletteSemanticNeutral");
							}
						} else {
							(oVizProperties.plotArea.colorPalette).push("sapUiChartPaletteSemanticNeutral");
						}						
					} else {
						if((oChartType.isBar() || oChartType.isColumn()) && (chartConfig.isDualAxis())) {
							if(_axis == 1) {
								(oVizProperties.plotArea.primaryValuesColorPalette).push("sapUiChartPaletteSemanticGood");
							} else if(_axis == 2) {
								(oVizProperties.plotArea.secondaryValuesColorPalette).push("sapUiChartPaletteSemanticGood");
							}
						} else {
							(oVizProperties.plotArea.colorPalette).push("sapUiChartPaletteSemanticGood");
						}						
					}
				}, this);
				oVizProperties.plotArea.dataPointStyle = {
						rules:
							[
							 {
								 callback: function (oContext) {
									 var data = chart.getModel().getData().data;
									 var bindingContext = oContext._context_row_number;
									 var bindingData = data[bindingContext];
									 var referenceMeasureValue = bindingData[thresholdMeasure];
									 if(referenceMeasureValue!=null && typeof referenceMeasureValue!='undefined') {
										 if(oContext[oContext.measureNames] > referenceMeasureValue) {
											 if(oController.EVALUATION.isMaximizingKpi())
												 return true;
										 } else if(oContext[oContext.measureNames] < referenceMeasureValue) {
											 if(oController.EVALUATION.isMinimizingKpi())
												 return true;
										 }
									 } else
										 return false;	
								 },
								 properties: {
									 color: "sapUiChartPaletteSemanticGoodLight1" 
								 },
								 displayName: (oController.oI18nModel.getResourceBundle().getText("GOOD"))
							 },{
								 callback: function (oContext) {
									 var data = chart.getModel().getData().data;
									 var bindingContext = oContext._context_row_number;
									 var bindingData = data[bindingContext];
									 var referenceMeasureValue = bindingData[thresholdMeasure];
									 if(referenceMeasureValue!=null && typeof referenceMeasureValue!='undefined') {
										 if(oContext[oContext.measureNames] > referenceMeasureValue) {
											 if(oController.EVALUATION.isMinimizingKpi())
												 return true;
										 } else if(oContext[oContext.measureNames] < referenceMeasureValue) {
											 if(oController.EVALUATION.isMaximizingKpi())
												 return true;
										 }
									 } else
										 return false;	
								 },
								 properties : {
									 color : "sapUiChartPaletteSemanticBadLight1"
								 },
								 displayName: (oController.oI18nModel.getResourceBundle().getText("BAD"))
							 },{
								 callback: function (oContext) {
									 var data = chart.getModel().getData().data;
									 var bindingContext = oContext._context_row_number;
									 var bindingData = data[bindingContext];
									 var referenceMeasureValue = bindingData[thresholdMeasure];
									 if(referenceMeasureValue==null || typeof referenceMeasureValue=='undefined') {
										 jQuery.sap.log.error("Threshold Measure:'"+thresholdMeasure+"' not in Dataset. Error Applying Semantic Color");
										 return true;
									 } 	
								 },
								 properties : {
									 color : "sapUiChartPaletteSemanticNeutralLight1"
								 },
								 displayName: (oController.oI18nModel.getResourceBundle().getText("NEUTRAL"))
							 }],
							 others : {
								 properties: {
									 color: 'sapUiChartPaletteSemanticNeutral'
								 },
								 displayName: (oController.oI18nModel.getResourceBundle().getText("THRESHOLD_REFERENCE"))
							 }
				}
				chart.setVizProperties(oVizProperties);
			} else {
				jQuery.sap.log.error("Chart Color Scheme is Auto-Semantic but no threshold measure Configured!!!");
			}
		} else {
			jQuery.sap.log.debug("Color Scheme is None: Default Color will be used by viz Chart");			
		}

		if(colorScheme.isAutoSemantic()) {
			if(this.EVALUATION.isTargetKpi()) {
				jQuery.sap.log.error("Auto Semantic Coloring can not be applied on target type KPI");
			}
		}
	},

	/*	getCAtoVizColorMapping: function() {
		var colorMapper = {
				"sapUiChart1" : "sapUiChartPaletteQualitativeHue1",
				"sapUiChart2" : "sapUiChartPaletteQualitativeHue2",
				"sapUiChart3" : "sapUiChartPaletteQualitativeHue3",
				"sapUiChart4" : "sapUiChartPaletteQualitativeHue4",
				"sapUiChart5" : "sapUiChartPaletteQualitativeHue5",
				"sapUiChart6" : "sapUiChartPaletteQualitativeHue6",
				"sapUiChart7" : "sapUiChartPaletteQualitativeHue7",
				"sapUiChart8" : "sapUiChartPaletteQualitativeHue8",
				"sapUiChart9" : "sapUiChartPaletteQualitativeHue9",
				"sapUiChart10" : "sapUiChartPaletteQualitativeHue10",
				"sapUiChart11" : "sapUiChartPaletteQualitativeHue11",
				"sapCaUiChartSemanticColor-Bad" : "sapUiChartPaletteSemanticBad",
				"sapCaUiChartSemanticColor-Bad-Dark" : "sapUiChartPaletteSemanticBadDark1",
				"sapCaUiChartSemanticColor-Bad-Light" : "sapUiChartPaletteSemanticBadLight1",
				"sapCaUiChartSemanticColor-Critical" : "sapUiChartPaletteSemanticCritical",
				"sapCaUiChartSemanticColor-Critical-Dark" : "sapUiChartPaletteSemanticCriticalDark1",
				"sapCaUiChartSemanticColor-Critical-Light" : "sapUiChartPaletteSemanticCriticalLight1",
				"sapCaUiChartSemanticColor-Good" : "sapUiChartPaletteSemanticGood",
				"sapCaUiChartSemanticColor-Good-Dark" : "sapUiChartPaletteSemanticGoodDark1",
				"sapCaUiChartSemanticColor-Good-Light" : "sapUiChartPaletteSemanticGoodLight1",
				"sapCaUiChartSemanticColor-Neutral" : "sapUiChartPaletteSemanticNeutral",
				"sapCaUiChartSemanticColor-Neutral-Dark" : "sapUiChartPaletteSemanticNeutralDark1",
				"sapCaUiChartSemanticColor-Neutral-Light" : "sapUiChartPaletteSemanticNeutralLight1",
		};

		return colorMapper;
	},
	 */	
	convertCAtoVizColorCode: function(oColor) {
		var vColor = oColor;
		if(oColor) {
			var splitColorArray = oColor.match(/[a-zA-Z]+|[0-9]+/g);
			if(splitColorArray[0] === "sapUiChart") {
				vColor = "sapUiChartPaletteQualitativeHue"+splitColorArray[1];
			} else if(splitColorArray[0] === "sapCaUiChartSemanticColor") {
				if(splitColorArray.length === 2) {
					vColor = "sapUiChartPaletteSemantic"+splitColorArray[1];
				} else if(splitColorArray.length === 3) {
					vColor = "sapUiChartPaletteSemantic"+splitColorArray[1]+splitColorArray[2]+"1";
				}
			}
		}
		return vColor;
	},

	_fixPostResizeIssue : function() {
		//The CA Chart removes the selection if UI area is rerendered
		this.setChartSelectionContextObject(null);
	}
});
