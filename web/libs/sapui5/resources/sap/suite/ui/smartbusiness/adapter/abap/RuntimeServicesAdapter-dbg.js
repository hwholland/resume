/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.abap.RuntimeServicesAdapter");
sap.suite.ui.smartbusiness.adapter.abap.RuntimeServicesAdapter = function() {
	
	var that = this;
	this.cache = this.cache || {};
		
	function getRuntimeModel() {
		that.cache.runtimeModel = that.cache.runtimeModel || new sap.ui.model.odata.ODataModel(that.getRuntimeServiceUrl(), true);
		return that.cache.runtimeModel; 
	};

	this.getRuntimeServiceUrl = function() {
		jQuery.sap.log.info("Abap Adapter --> Runtime Service URI");
		return "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV";
	};

	function _encodeURL(uRi) {
		return jQuery.sap.encodeURL(uRi);
	};

	this.getKPIById = function(obj) {
		jQuery.sap.log.info("Abap Adapter --> Calling KPI Data");
		var that = this;
		if(!(obj.ID) && !(obj.context)) {
			throw new Error("Failed to get Indicator Id for data fetch");
			return null;
		}
		var contextPath = null;
		var context = obj.context || null;
		//var url = getRuntimeServiceUrl();
		var model = obj.model || getRuntimeModel(); //|| new sap.ui.model.odata.ODataModel(url, true);
		var dataBean = {};
		if(obj.context) {
			contextPath = obj.context.sPath;
			if(obj.context.getObject()) {
				obj.ID = obj.context.getObject().ID;
			}
			else {
				obj.ID = contextPath.split("'")[1].split("'")[0];
			}
		}
		else if(obj.ID) {
			obj.entity = obj.entity || "/INDICATORS";
			obj.entity = (obj.entity.indexOf("/") != 0) ? ("/" + obj.entity) : obj.entity;
			contextPath = obj.entity + "('" + obj.ID + "')";
			context = new sap.ui.model.Context(model, contextPath);
		}

		var s = obj.success;
		var e = obj.error;

		var batchRequests = [];
		var referenceObject = [];

		if(!(obj.noIndicator)) {
			if(context && context.getObject() && Object.keys(context.getObject()) && Object.keys(context)) {
				dataBean.INDICATOR = context.getObject();
			}
			else {
				batchRequests.push(model.createBatchOperation(contextPath,"GET"));
				referenceObject.push("INDICATOR");
			}
		}
		if(obj.tags) {
			batchRequests.push(model.createBatchOperation(contextPath+"/TAGS","GET"));
			referenceObject.push("TAGS");
		}
		if(obj.properties) {
			batchRequests.push(model.createBatchOperation(contextPath+"/PROPERTIES","GET"));
			referenceObject.push("PROPERTIES");
		}
		obj.async = (obj.async) ? true : false;
		model.addBatchReadOperations(batchRequests);
		model.submitBatch(function(data, response) {
			var A = data.__batchResponses;
			for(var i=0,l=A.length; i<l; i++) {
				jQuery.sap.log.info(referenceObject[i] + " : " + JSON.stringify(A[i]));
				dataBean[referenceObject[i]] = (A[i].data.results) ? A[i].data.results : A[i].data;
			}
			if(s) {
				s(dataBean);
			}
		}, function(errorObject){
			if(e) {
				e(errorObject);
			}
			throw new Error("Failed to fetch Indicator details");
		},obj.async);
		return dataBean;
	};

	this.getEvaluationById = function(obj) {
		jQuery.sap.log.info("Abap Adapter --> Calling Evaluation Data");

		/*
		 *            Copied from Hana Adapter Make Changes If required
		 */
		var that = this;
		if(!(obj.ID) && !(obj.context)) {
			throw new Error("Failed to get Evaluation Id or Status for data fetch");
			return null;
		}
		var contextPath = null;
		var context = obj.context || null;
		//var url = getRuntimeServiceUrl();
		var model = obj.model || getRuntimeModel(); //|| new sap.ui.model.odata.ODataModel(url, true);
		var dataBean = {};
		if(obj.context) {
			contextPath = obj.context.sPath;
			if(obj.context.getObject()) {
				obj.ID = obj.context.getObject().ID;
			}
			else {
				obj.ID = contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
			}
		}
		else if(obj.ID) {
			obj.entity = obj.entity || "/EVALUATIONS";
			obj.entity = (obj.entity.indexOf("/") != 0) ? ("/" + obj.entity) : obj.entity;
			contextPath = obj.entity + "('" + obj.ID + "')";
			context = new sap.ui.model.Context(model, contextPath);
		}

		var s = obj.success;
		var e = obj.error;

		var batchRequests = [];
		var referenceObject = [];
		if(!(obj.noEvaluation)) {
			if(context && context.getObject() && Object.keys(context.getObject()) && Object.keys(context)) {
				dataBean.EVALUATION = context.getObject();
			}
			else {
				batchRequests.push(model.createBatchOperation(contextPath,"GET"));
				referenceObject.push("EVALUATION");
			}
		}
		if(obj.indicator) {
			batchRequests.push(model.createBatchOperation(contextPath+"/INDICATOR_PROPERTIES","GET"));
			referenceObject.push("INDICATOR_PROPERTIES");
		}
		if(obj.tags) {
			batchRequests.push(model.createBatchOperation(contextPath+"/TAGS","GET"));
			referenceObject.push("TAGS");
		}
		if(obj.properties) {
			batchRequests.push(model.createBatchOperation(contextPath+"/PROPERTIES","GET"));
			referenceObject.push("PROPERTIES");
		}
		if(obj.filters) {
			batchRequests.push(model.createBatchOperation(contextPath+"/FILTERS","GET"));
			referenceObject.push("FILTERS");
		}
		if(obj.values) {
			batchRequests.push(model.createBatchOperation(contextPath+"/VALUES","GET"));
			referenceObject.push("VALUES");
		}
		obj.async = (obj.async) ? true : false;
		model.addBatchReadOperations(batchRequests);
		model.submitBatch(function(data, response) {
			var A = data.__batchResponses;
			for(var i=0,l=A.length; i<l; i++) {
				jQuery.sap.log.info(referenceObject[i] + " : " + JSON.stringify(A[i]));
				dataBean[referenceObject[i]] = (A[i].data.results) ? A[i].data.results : A[i].data;
			}
			if(s) {
				s(dataBean);
			}
		}, function(errorObject){
			if(e) {
				e(errorObject);
			}
			throw new Error("Failed to fetch Evaluation details");
		},obj.async);

		return dataBean;

	};

	this.getUI2Scope = function() {
		if(!(that.cache.ui2Scope)) {
			jQuery.sap.log.info("Abap Adapter --> Fetching UI2 Scope from URL");
			var scope = "PERS";
			that.cache.ui2Scope = scope;
		}
		else {
			jQuery.sap.log.info("Abap Adapter --> Fetching UI2 Scope from cache");
		}
		jQuery.sap.log.info("Abap Adapter --> Current UI2 Scope - " + that.cache.ui2Scope);
		return that.cache.ui2Scope;
	};

	this.getUI2Factory = function() {
		if(!(that.cache.ui2Factory)) {
			var sScope = sScope || this.getUI2Scope();
			jQuery.sap.log.info("Abap Adapter --> Creating UI2 Factory with Scope - " + sScope);
			if(sap.ushell && sap.ushell.Container) {
				that.cache.ui2Factory = sap.ushell.Container.getService("PageBuilding", sScope).getFactory();
			}
		}
		else {
			jQuery.sap.log.info("Abap Adapter --> Picking UI2 Factory from cache");
		}
		return that.cache.ui2Factory;
	};

	this.getUI2PageBuildingService = function() {
		if(!(that.cache.ui2PageBuildeingService)) {
			if(sap.ushell && sap.ushell.Container) {
				jQuery.sap.log.info("Abap Adapter --> Creating UI2 PageBuildingService");
				var factory = this.getUI2Factory();
				that.cache.ui2PageBuildeingService = factory.getPageBuildingService();
			}
		}
		else {
			jQuery.sap.log.info("Abap Adapter --> Picking UI2 PageBuildingService from cache");
		}
		return that.cache.ui2PageBuildeingService;
	};

	this.getChipById = function(obj) {
		jQuery.sap.log.info("Abap Adapter --> Calling Chip Data");
		/*
		 *            Copied from Hana Adapter Make Changes If required
		 */
		var evalObj = {};
		var chipObj = {};
		var that = this;
		if(!(obj.id) && !(obj.context)) {
			throw new Error("Failed to get Chip Id for data fetch");
			return null;
		}
		var contextPath = null;
		var context = obj.context || null;
		//var url = getRuntimeServiceUrl();
		var model = obj.model || getRuntimeModel(); //|| new sap.ui.model.odata.ODataModel(url, true);
		var dataBean = {};
		if(obj.context) {
			contextPath = obj.context.sPath;
			if(obj.context.getObject()) {
				obj.id = obj.context.getObject().id;
			}
			else {
				obj.id = contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
			}
		}
		else if(obj.id) {
			obj.entity = obj.entity || "/Chips";
			obj.entity = (obj.entity.indexOf("/") != 0) ? ("/" + obj.entity) : obj.entity;
			contextPath = obj.entity + "('" + obj.id + "')";
			context = new sap.ui.model.Context(model, contextPath);
		}

		obj.entity =  obj.entity + "('" + obj.id + "')";
		var chipSuccess = obj.success;
		var chipError = obj.error;
		var oPBService = that.getUI2PageBuildingService();
		var chipId = obj.id;
		
		function readChipCallBack(d) {
			if(d.ChipBags && d.ChipBags.results && d.ChipBags.results.length) {
				var bagObj = d.ChipBags.results[0];
				if(bagObj.ChipProperties && bagObj.ChipProperties.results && bagObj.ChipProperties.results.length) {
					tilePropertiesArr = bagObj.ChipProperties.results;
					for(var j=0,m=tilePropertiesArr.length; j<m; j++) {
						if(tilePropertiesArr[j].name == "title") {
							d.title = tilePropertiesArr[j].value;
						}
						if(tilePropertiesArr[j].name == "description") {
							d.description = tilePropertiesArr[j].value;
						}
					}
				}
			}
			chipSuccess(d);
		}
		
		function readChipErrCallBack(d,s,x) {
			chipError(d,s,x);
		} 
		
		oPBService.readChip(chipId, readChipCallBack, readChipErrCallBack);
		obj.async = false;
		return dataBean;
	};

	function getUI2ChipIdByTileType(type) {
		var chipId = {
				'NT' : 'X-SAP-UI2-CHIP:/SSB/NUMERIC_TILE',
				'CT' : 'X-SAP-UI2-CHIP:/SSB/COMPARISON_TILE',
				'TT' : 'X-SAP-UI2-CHIP:/SSB/TREND_TILE',
				'AT' : 'X-SAP-UI2-CHIP:/SSB/DEVIATION_TILE',
				'CM' : 'X-SAP-UI2-CHIP:/SSB/COMPARISON_MM_TILE',
				'DT-CT' : 'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_COMPARISON',
				'DT-CM' : 'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_COMPARISON_MM',
				'DT-AT' : 'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_DEVIATION',
				'DT-TT' : 'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_TREND'
		}
		return chipId[type];
	}

	this.getDataByEntity = function(obj) {
		jQuery.sap.log.info("Abap Adapter --> Calling Entity Data");
		/*
		 * Copied from Hana Adapter Make Changes If required
		 */
		var that = this;
		var url = obj.uri;
		var model = obj.model || (url ? new sap.ui.model.odata.ODataModel(url,true) : getRuntimeModel());
		var expand = "";
		var expandArr = [];
		var filter = "";
		var select = "";
		var orderby = "";
		var top = null;
		var skip = null;
		var data = null;
		var succHandler = obj.success;
		var errHandler = obj.error;
		if(!(obj.entity)) {
			jQuery.sap.log.error("Entity or Context is missing for getDataByEntity call");
			throw Error("Entity or Context is missing for getDataByEntity call");
		}
		jQuery.sap.log.info("Abap Adapter --> Calling Entity Data - " + obj.entity);
		entity = obj.entity;
		entity = (entity.indexOf("/") == 0) ? entity : ("/" + entity);
		if(obj.select) {
			if(typeof(obj.select) == "string") {
				select = obj.select;
			}
			else {
				select = obj.select;
			}
		}
		if(obj.expand) {
			if(obj.expand instanceof Array) {
				for(var i=0,l=obj.expand.length; i<l; i++) {
					expand += (expand) ? "," : "";
					expand += obj.expand[i];
				}
				expandArr = obj.expand;
			}
			else if(typeof(obj.expand) == "string") {
				expand = obj.expand;
				expandArr = obj.expand.split(",");
			}
		}
		if(obj.filter) {
			if(typeof(obj.filter) == "string") {
				filter = obj.filter;
			}
			else {
				filter = obj.filter;
			}
		}
		if(obj.orderby) {
			if(typeof(obj.orderby) == "string") {
				orderby = obj.orderby;
			}
			else {
				orderby = obj.orderby;
			}
		}
		obj.async = (obj.async) ? true : false;
		if(entity.indexOf("$select") == -1) {
			if(select) {
				entity += (entity.indexOf("?") == -1) ? ("?$select=" + select) : ("&$select=" + select); 
			}
		}
		if(entity.indexOf("$expand") == -1) {
			if(expand) {
				entity += (entity.indexOf("?") == -1) ? ("?$expand=" + expand) : ("&$expand=" + expand); 
			}
		}
		if(entity.indexOf("$filter") == -1) {
			if(filter) {
				entity += (entity.indexOf("?") == -1) ? ("?$filter=" + filter) : ("&$filter=" + filter); 
			}
		}
		if(entity.indexOf("$orderby") == -1) {
			if(orderby) {
				entity += (entity.indexOf("?") == -1) ? ("?$orderby=" + orderby) : ("&$orderby=" + orderby); 
			}
		}
		if(entity.indexOf("$top") == -1) {
			if(Number(top)) {
				entity += (entity.indexOf("?") == -1) ? ("?$top=" + Number(top)) : ("&$top=" + Number(top)); 
			}
		}
		if(entity.indexOf("$skip") == -1) {
			if(Number(skip)) {
				entity += (entity.indexOf("?") == -1) ? ("?$skip=" + Number(skip)) : ("&$skip=" + Number(skip)); 
			}
		}

		var success = function(d,s,x) {
			data = (d && d.results) ? d.results : d;
			if(succHandler) {
				succHandler(data);
			}
		}
		var error = function(d,s,x) {
			jQuery.sap.log.error(d);
			jQuery.sap.log.error(s);
			jQuery.sap.log.error(x);
			if(errHandler) {
				data = {d:d,s:s,x:x};
				errHandler(d,s,x);
			}
		}

		model.read(entity, null, null, obj.async, success, error);
		return data;
	};

	this.getDataByBatch = function() {
		jQuery.sap.log.info("Abap Adapter --> Calling Entity Batch Data");
	};

	this.getPlatform = function() {
		jQuery.sap.log.info("Abap Adapter --> Fetching Platform");
		that.cache.platform = that.cache.platform || "abap";
		jQuery.sap.log.info("Abap Adapter --> Platform - " + that.cache.platform);
		return that.cache.platform;
	};

	this.addSystemToServiceUrl = function(url) {
		jQuery.sap.log.info("Abap Adapter --> Add System to Service Url");
		return url;
	};
	
	this.isTokenHandlingEnabledForODataRead = function() {
		return true;
	};

};
