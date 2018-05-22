/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.ModelerReadServices");
jQuery.sap.require("sap.suite.ui.smartbusiness.lib.Util");

sap.suite.ui.smartbusiness.lib.ModelerReadServices = (function() {
	return {
		_encodeURL: function(uRi) {
			return jQuery.sap.encodeURL(uRi);
		},
		
		getDesigntimeServiceUrl : function() {
			return "/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata";
		},
		
		getAllKPIs: function(obj) {
			var that = this;
			var url = this.getDesigntimeServiceUrl();
			var model = obj.model || new sap.ui.model.odata.ODataModel(url,true);
			var expand = "";
			var filter = "";
			var data = null;
			var success = obj.success || function(d,s,x) {
				data = (d && d.results) ? d.results : d;
			}
			var error = obj.error || function(d,s,x) {
				jQuery.sap.log.error(d);
				jQuery.sap.log.error(s);
				jQuery.sap.log.error(x);
			}
			var entity = obj.entity || "/INDICATORS_MODELER";
			entity = (entity.indexOf("/") == 0) ? entity : ("/" + entity);
			if(obj.tags) {
				expand += (expand) ? "," : ""; 
				expand += "TAGS";
			}
			if(obj.properties) {
				expand += (expand) ? "," : "";
				expand += "PROPERTIES";
			}
			if(obj.texts) {
				expand += (expand) ? "," : "";
				expand += "TEXTS";
			}
			if(obj.evaluations) {
				expand += (expand) ? "," : "";
				expand += "EVALUATIONS";
			}
			if(obj.associations) {
				expand += (expand) ? "," : "";
				expand += "ASSOCIATION_SOURCE";
				expand += "ASSOCIATION_TARGET";
			}
			if(obj.filter) {
				filter = obj.filter;
			}
			obj.async = (obj.async) ? true : false;
			model.read(entity, null, (filter || null), obj.async, success, error);
			return data;
		},
		
		getKPIMasterDetailsById: function(obj) {
			var that = this;
			if(!(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) && !(obj.context)) {
				throw new Error("Failed to get Indicator Id or Status for data fetch");
				return null;
			}
			var contextPath = null;
			var context = obj.context || null;
			var url = this.getDesigntimeServiceUrl();
			var model = obj.model || new sap.ui.model.odata.ODataModel(url, true);
			var dataBean = {};
			if(obj.context) {
				contextPath = obj.context.sPath;
				if(obj.context.getObject()) {
					obj.ID = obj.context.getObject().ID;
					obj.IS_ACTIVE = obj.context.getObject().IS_ACTIVE;
				}
				else {
					obj.ID = contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
					obj.IS_ACTIVE = ((contextPath.indexOf("IS_ACTIVE=0") != -1) || (contextPath.indexOf("IS_ACTIVE=1") != -1)) ? ((contextPath.indexOf("IS_ACTIVE=0") != -1) ? 0 : 1) : null;
				}
			}
			else if(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) {
				obj.ENTITY = obj.ENTITY || "/INDICATORS_MODELER";
				obj.ENTITY = (obj.ENTITY.indexOf("/") != 0) ? ("/" + obj.ENTITY) : obj.ENTITY;
				contextPath = obj.ENTITY + "(ID='" + obj.ID + "',IS_ACTIVE=" + obj.IS_ACTIVE + ")";
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
			if(obj.texts) {
				batchRequests.push(model.createBatchOperation(contextPath+"/TEXTS","GET"));
				referenceObject.push("TEXTS");
			}
			if(obj.evaluations) {
				batchRequests.push(model.createBatchOperation(contextPath+"/EVALUATIONS","GET"));
				referenceObject.push("EVALUATIONS");
			}
			if(obj.associations && obj.associationProperties) {
				batchRequests.push(model.createBatchOperation("/ASSOCIATIONS_MODELER?$filter=" + that._encodeURL("SOURCE_INDICATOR eq '" + obj.ID + "' or TARGET_INDICATOR eq '" + obj.ID + "'") + "&$expand=PROPERTIES","GET"));
				referenceObject.push("ASSOCIATIONS");
			}
			else if(obj.associations) {
				batchRequests.push(model.createBatchOperation(contextPath+"/ASSOCIATION_SOURCE","GET"));
				batchRequests.push(model.createBatchOperation(contextPath+"/ASSOCIATION_TARGET","GET"));
				referenceObject.push("ASSOCIATION_SOURCE");
				referenceObject.push("ASSOCIATION_TARGET");
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
			if(obj.associations && obj.associationProperties) {
				for(var i=0,l=dataBean.ASSOCIATIONS.length; i<l; i++) {
					if(dataBean.ASSOCIATIONS[i].PROPERTIES) {
						if(dataBean.ASSOCIATIONS[i].PROPERTIES.results && dataBean.ASSOCIATIONS[i].PROPERTIES.results.length) {
							dataBean.ASSOCIATIONS[i].PROPERTIES = dataBean.ASSOCIATIONS[i].PROPERTIES.results;
						}
						else {
							dataBean.ASSOCIATIONS[i].PROPERTIES = [];
						}
					}
					else {
						dataBean.ASSOCIATIONS[i].PROPERTIES = [];
					}
				}
			}
			else {
				dataBean.ASSOCIATIONS = [].concat(dataBean.ASSOCIATION_SOURCE).concat(dataBean.ASSOCIATION_TARGET);	
			}
			return dataBean;
		},
		
		getEvaluationMasterDetailsById: function(obj) {
			var that = this;
			if(!(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) && !(obj.context)) {
				throw new Error("Failed to get Evaluation Id or Status for data fetch");
				return null;
			}
			var contextPath = null;
			var context = obj.context || null;
			var url = this.getDesigntimeServiceUrl();
			var model = obj.model || new sap.ui.model.odata.ODataModel(url, true);
			var dataBean = {};
			if(obj.context) {
				contextPath = obj.context.sPath;
				if(obj.context.getObject()) {
					obj.ID = obj.context.getObject().ID;
					obj.IS_ACTIVE = obj.context.getObject().IS_ACTIVE;
				}
				else {
					obj.ID = contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
					obj.IS_ACTIVE = ((contextPath.indexOf("IS_ACTIVE=0") != -1) || (contextPath.indexOf("IS_ACTIVE=1") != -1)) ? ((contextPath.indexOf("IS_ACTIVE=0") != -1) ? 0 : 1) : null;
				}
			}
			else if(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) {
				obj.ENTITY = obj.ENTITY || "/EVALUATIONS_MODELER";
				obj.ENTITY = (obj.ENTITY.indexOf("/") != 0) ? ("/" + obj.ENTITY) : obj.ENTITY;
				contextPath = obj.ENTITY + "(ID='" + obj.ID + "',IS_ACTIVE=" + obj.IS_ACTIVE + ")";
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
			if(obj.tags) {
				batchRequests.push(model.createBatchOperation(contextPath+"/TAGS","GET"));
				referenceObject.push("TAGS");
			}
			if(obj.properties) {
				batchRequests.push(model.createBatchOperation(contextPath+"/PROPERTIES","GET"));
				referenceObject.push("PROPERTIES");
			}
			if(obj.texts) {
				batchRequests.push(model.createBatchOperation(contextPath+"/TEXTS","GET"));
				referenceObject.push("TEXTS");
			}
			if(obj.filters) {
				batchRequests.push(model.createBatchOperation(contextPath+"/FILTERS","GET"));
				referenceObject.push("FILTERS");
			}
			if(obj.values) {
				batchRequests.push(model.createBatchOperation(contextPath+"/VALUES","GET"));
				referenceObject.push("VALUES");
			}
			if(obj.chips) {
				batchRequests.push(model.createBatchOperation(contextPath+"/CHIPS","GET"));
				referenceObject.push("CHIPS");
			}
			if(obj.dda_configurations) {
				batchRequests.push(model.createBatchOperation(contextPath+"/DDA_CONFIGURATIONS","GET"));
				referenceObject.push("DDA_CONFIGURATIONS");
			}
			if(obj.dda_header_tiles) {
				batchRequests.push(model.createBatchOperation(contextPath+"/DDA_HEADER_TILES","GET"));
				referenceObject.push("DDA_HEADER_TILES");
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
		},
		
		getChipMasterDetailsById: function(obj) {
			var that = this;
			if(!(obj.id && obj.isActive !== null && obj.isActive !== undefined) && !(obj.context)) {
				throw new Error("Failed to get Chip Id or Status for data fetch");
				return null;
			}
			var contextPath = null;
			var context = obj.context || null;
			var url = this.getDesigntimeServiceUrl();
			var model = obj.model || new sap.ui.model.odata.ODataModel(url, true);
			var dataBean = {};
			if(obj.context) {
				contextPath = obj.context.sPath;
				if(obj.context.getObject()) {
					obj.id = obj.context.getObject().id;
					obj.isActive = obj.context.getObject().isActive;
				}
				else {
					obj.id = contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
					obj.isActive = ((contextPath.indexOf("isActive=0") != -1) || (contextPath.indexOf("isActive=1") != -1)) ? ((contextPath.indexOf("isActive=0") != -1) ? 0 : 1) : null;
				}
			}
			else if(obj.id && obj.isActive !== null && obj.isActive !== undefined) {
				obj.ENTITY = obj.ENTITY || "/CHIPS_MODELER";
				obj.ENTITY = (obj.ENTITY.indexOf("/") != 0) ? ("/" + obj.ENTITY) : obj.ENTITY;
				contextPath = obj.ENTITY + "(id='" + obj.ID + "',isActive=" + obj.isActive + ")";
				context = new sap.ui.model.Context(model, contextPath);
			}
			
			var s = obj.success;
			var e = obj.error;
			
			var batchRequests = [];
			var referenceObject = [];
			if(!(obj.noChip)) {
				if(context && context.getObject() && Object.keys(context.getObject()) && Object.keys(context)) {
					dataBean.CHIP = context.getObject();
				}
				else {
					batchRequests.push(model.createBatchOperation(contextPath,"GET"));
					referenceObject.push("CHIP");
				}
			}
			if(obj.evaluation) {
				batchRequests.push(model.createBatchOperation(contextPath+"/EVALUATION_INFO","GET"));
				referenceObject.push("EVALUATION_INFO");
			}
			if(obj.texts) {
				batchRequests.push(model.createBatchOperation(contextPath+"/TEXTS","GET"));
				referenceObject.push("TEXTS");
			}
			if(obj.dda_configurations) {
				batchRequests.push(model.createBatchOperation(contextPath+"/DDA_CONFIGURATIONS","GET"));
				referenceObject.push("DDA_CONFIGURATIONS");
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
				throw new Error("Failed to fetch Chip details");
			},obj.async);
			return dataBean;
		}
	};
})();