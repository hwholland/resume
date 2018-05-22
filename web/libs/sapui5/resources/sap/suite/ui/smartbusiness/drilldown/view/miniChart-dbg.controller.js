jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageBox");
sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.drilldown.view.miniChart", {
	_getEvaluationId : function() {
		try {
			var startupParameters = this.oConnectionManager.getComponent().oComponentData.startupParameters;
			return startupParameters["evaluationId"][0];
		}catch(e) {
			return sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters().evaluationId[0];
		}
	},
	_detachHashChangeListener : function() {
		try {
			this._proxyHashChangeListener = null;
			this.hashChangerAttached = true;
		} catch(e) {
			jQuery.sap.log.error("Error Detaching hashChanged Event");
		}
	},
	onInit : function(){
		var that=this;
		var oOptions = {
				onBack: function () {
					window.history.back();
				},
				additionalShareButtonList : [],
				sFullscreenTitle: "",
		};
		this.setHeaderFooterOptions(oOptions);
		this.getPage().getCustomHeader().getContentMiddle()[0].setText("");
		this.SAP_SYSTEM = "HANA";
		this._requestTimeLog = {};
		var EVAL_ID = this._getEvaluationId();
		var EVAL_ID_FOR_DDA_CONFIG = EVAL_ID;
		this._EVALUATION_ID = EVAL_ID;
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
				that.displayMiniCharts();
				if( this.CONFIGURATION.getAllViews().length==0){
					jQuery.sap.log.error("drilldown not configured");
					return;
				}
				var startTimeBundledEvaluationFetch = new Date().getTime();
			},
			error : function() {
				jQuery.sap.log.error("Drilldown Configuration Fetching Failed");
			},
			context : this,
			sapSystem : this.SAP_SYSTEM
		},callback);
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
	renderKpiHeaders: function(headers) {
		var self = this;
		var mobileGrid = this.byId("mobileGrid");
		mobileGrid.removeAllContent();
		this.miniChartManager = sap.suite.ui.smartbusiness.drilldown.lib.MiniChartManager.renderHeaders({
			allTiles : headers,
			headerContainer : mobileGrid,
			sapSystem : this.SAP_SYSTEM,
			urlFilters : this.getUrlFilters(),
			onNavigation : function(){
				self._detachHashChangeListener();
			}
		});
	},
	displayMiniCharts : function(){
		var aHeaders = this.CONFIGURATION.getHeaders();
			if(!(aHeaders && aHeaders.length)){
				//objectHeaderContainer.setVisible(false);
			}
			else{
				this.renderKpiHeaders(aHeaders);
			}
		$(window).trigger('resize');
	},
});
