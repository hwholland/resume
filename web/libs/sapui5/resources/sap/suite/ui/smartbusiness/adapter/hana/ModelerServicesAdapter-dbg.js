/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.hana.ModelerServicesAdapter");
sap.suite.ui.smartbusiness.adapter.hana.ModelerServicesAdapter = function() {
	
	var that = this;
	this.cache = this.cache || {};
	function getChipsWithoutHarveyBall(aChips){// to prevent harvey ball from appearing if already configured
		var tmp=[];
		for(var i=0,l=(aChips?aChips.length:0);i<l;i++){
			if(aChips[i].tileType!="HT"){
				tmp.push(aChips[i]);
			}
		}
		return tmp;
	}
	function entityNavigationDictionary(entity) {
		var entityNavDict = {
				"INDICATORS":{
					"indicator": {"entity":"INDICATORS", "type":"INDICATOR"},
					"texts": {"entity":"TEXTS", "type":"INDICATOR_TEXT"},
					"evaluations": {"entity":"EVALUATIONS", "type":"EVALUATION"},
					"tags": {"entity":"TAGS", "type":"TAG"},
					"properties": {"entity":"PROPERTIES", "type":"PROPERTY"},
					"associations": {"entity":"ASSOCIATIONS", "type":"ASSOCIATION"},
					"association_source": {"entity":"ASSOCIATION_SOURCE", "type":"ASSOCIATION"},
					"association_target": {"entity":"ASSOCIATION_TARGET", "type":"ASSOCIATION"}
				},
				"INDICATORS_MODELER":{
					"indicator": {"entity":"INDICATORS_MODELER", "type":"INDICATOR"},
					"texts": {"entity":"TEXTS", "type":"INDICATOR_TEXT"},
					"evaluations": {"entity":"EVALUATIONS", "type":"EVALUATION"},
					"tags": {"entity":"TAGS", "type":"TAG"},
					"properties": {"entity":"PROPERTIES", "type":"PROPERTY"},
					"associations": {"entity":"ASSOCIATIONS", "type":"ASSOCIATION"},
					"association_source": {"entity":"ASSOCIATION_SOURCE", "type":"ASSOCIATION"},
					"association_target": {"entity":"ASSOCIATION_TARGET", "type":"ASSOCIATION"}
				},
				"EVALUATIONS":{
					"evaluation": {"entity":"EVALUATIONS", "type":"EVALUATION"},
					"texts": {"entity":"TEXTS", "type":"EVALUATION_TEXT"},
					"chips": {"entity":"CHIPS", "type":"CHIP"},
					"tags": {"entity":"TAGS", "type":"TAG"},
					"properties": {"entity":"PROPERTIES", "type":"PROPERTY"},
					"indicator": {"entity":"INDICATOR_INFO", "type":"INDICATOR"},
					"filters": {"entity":"FILTERS", "type":"FILTER"},
					"values": {"entity":"VALUES", "type":"VALUE"},
					"dda_configurations": {"entity":"DDA_CONFIGURATIONS", "type":"DDA_MASTER"},
					"dda_header_tiles": {"entity":"DDA_HEADER_TILES", "type":"DDA_HEADER"}
				},
				"EVALUATIONS_MODELER":{
					"evaluation": {"entity":"EVALUATIONS_MODELER", "type":"EVALUATION"},
					"texts": {"entity":"TEXTS", "type":"EVALUATION_TEXT"},
					"chips": {"entity":"CHIPS", "type":"CHIP"},
					"tags": {"entity":"TAGS", "type":"TAG"},
					"properties": {"entity":"PROPERTIES", "type":"PROPERTY"},
					"indicator": {"entity":"INDICATOR_INFO", "type":"INDICATOR"},
					"filters": {"entity":"FILTERS", "type":"FILTER"},
					"values": {"entity":"VALUES", "type":"VALUE"},
					"dda_configurations": {"entity":"DDA_CONFIGURATIONS", "type":"DDA_MASTER"},
					"dda_header_tiles": {"entity":"DDA_HEADER_TILES", "type":"DDA_HEADER"},
					"texts_for_chip": {"entity":"TEXTS_FOR_CHIP", "type":"EVALUATION_TEXT"}
				},
				"CHIPS":{
					"texts": {"entity":"TEXTS", "type":"CHIP_TEXT"},
					"evaluation": {"entity":"EVALUATION_INFO", "type":"EVALUATION"},
					"dda_configurations": {"entity":"DDA_CONFIGURATIONS", "type":"DDA_MASTER"}
				}
		};
		return entityNavDict[entity];
	};
	
	function beanDictionary(entity) {
		return beans = {
				"INDICATOR": {
					"bean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "COUNTER":"COUNTER", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION", "TYPE":"TYPE", "DATA_SPECIFICATION":"DATA_SPECIFICATION", "GOAL_TYPE":"GOAL_TYPE", "ODATA_URL":"ODATA_URL", "ODATA_ENTITYSET":"ODATA_ENTITYSET", "VIEW_NAME":"VIEW_NAME", "COLUMN_NAME":"COLUMN_NAME", "OWNER_NAME":"OWNER_NAME", "OWNER_E_MAIL":"OWNER_E_MAIL", "OWNER_ID":"OWNER_ID", "CREATED_BY":"CREATED_BY", "CREATED_ON":"CREATED_ON", "CHANGED_BY":"CHANGED_BY", "CHANGED_ON":"CHANGED_ON", "ENTITY_TYPE":"ENTITY_TYPE", "ODATA_PROPERTY":"ODATA_PROPERTY", "SEMANTIC_OBJECT":"SEMANTIC_OBJECT", "ACTION":"ACTION", "EVALUATION_COUNT":"EVALUATION_COUNT", "MANUAL_ENTRY":"MANUAL_ENTRY", "LAST_WORKED_ON":"LAST_WORKED_ON", "ASSOCIATION_SOURCE_COUNT":"ASSOCIATION_SOURCE_COUNT", "ASSOCIATION_TARGET_COUNT":"ASSOCIATION_TARGET_COUNT"
					},
					"reverseBean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "COUNTER":"COUNTER", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION", "TYPE":"TYPE", "DATA_SPECIFICATION":"DATA_SPECIFICATION", "GOAL_TYPE":"GOAL_TYPE", "ODATA_URL":"ODATA_URL", "ODATA_ENTITYSET":"ODATA_ENTITYSET", "VIEW_NAME":"VIEW_NAME", "COLUMN_NAME":"COLUMN_NAME", "OWNER_NAME":"OWNER_NAME", "OWNER_E_MAIL":"OWNER_E_MAIL", "OWNER_ID":"OWNER_ID", "CREATED_BY":"CREATED_BY", "CREATED_ON":"CREATED_ON", "CHANGED_BY":"CHANGED_BY", "CHANGED_ON":"CHANGED_ON", "ENTITY_TYPE":"ENTITY_TYPE", "ODATA_PROPERTY":"ODATA_PROPERTY", "SEMANTIC_OBJECT":"SEMANTIC_OBJECT", "ACTION":"ACTION", "EVALUATION_COUNT":"EVALUATION_COUNT", "MANUAL_ENTRY":"MANUAL_ENTRY", "LAST_WORKED_ON":"LAST_WORKED_ON", "ASSOCIATION_SOURCE_COUNT":"ASSOCIATION_SOURCE_COUNT", "ASSOCIATION_TARGET_COUNT":"ASSOCIATION_TARGET_COUNT"
					}
				},
				"EVALUATION": {
					"bean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "COUNTER":"COUNTER", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION", "INDICATOR":"INDICATOR", "SCALING":"SCALING", "ODATA_URL":"ODATA_URL", "ODATA_ENTITYSET":"ODATA_ENTITYSET", "VIEW_NAME":"VIEW_NAME", "COLUMN_NAME":"COLUMN_NAME", "OWNER_NAME":"OWNER_NAME", "OWNER_E_MAIL":"OWNER_E_MAIL", "OWNER_ID":"OWNER_ID", "CREATED_BY":"CREATED_BY", "CREATED_ON":"CREATED_ON", "CHANGED_BY":"CHANGED_BY", "CHANGED_ON":"CHANGED_ON", "ENTITY_TYPE":"ENTITY_TYPE", "ODATA_PROPERTY":"ODATA_PROPERTY", "SEMANTIC_OBJECT":"SEMANTIC_OBJECT", "ACTION":"ACTION", "VALUES_SOURCE":"VALUES_SOURCE", "INDICATOR_TYPE":"INDICATOR_TYPE", "DATA_SPECIFICATION":"DATA_SPECIFICATION", "GOAL_TYPE":"GOAL_TYPE", "MANUAL_ENTRY":"MANUAL_ENTRY", "LAST_WORKED_ON":"LAST_WORKED_ON", "CHIPS_COUNT":"CHIPS_COUNT", "INDICATOR_TITLE":"INDICATOR_TITLE", "VIEWS_COUNT":"VIEWS_COUNT","DECIMAL_PRECISION":"DECIMAL_PRECISION"
					},
					"reverseBean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "COUNTER":"COUNTER", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION", "INDICATOR":"INDICATOR", "SCALING":"SCALING", "ODATA_URL":"ODATA_URL", "ODATA_ENTITYSET":"ODATA_ENTITYSET", "VIEW_NAME":"VIEW_NAME", "COLUMN_NAME":"COLUMN_NAME", "OWNER_NAME":"OWNER_NAME", "OWNER_E_MAIL":"OWNER_E_MAIL", "OWNER_ID":"OWNER_ID", "CREATED_BY":"CREATED_BY", "CREATED_ON":"CREATED_ON", "CHANGED_BY":"CHANGED_BY", "CHANGED_ON":"CHANGED_ON", "ENTITY_TYPE":"ENTITY_TYPE", "ODATA_PROPERTY":"ODATA_PROPERTY", "SEMANTIC_OBJECT":"SEMANTIC_OBJECT", "ACTION":"ACTION", "VALUES_SOURCE":"VALUES_SOURCE", "INDICATOR_TYPE":"INDICATOR_TYPE", "DATA_SPECIFICATION":"DATA_SPECIFICATION", "GOAL_TYPE":"GOAL_TYPE", "MANUAL_ENTRY":"MANUAL_ENTRY", "LAST_WORKED_ON":"LAST_WORKED_ON", "CHIPS_COUNT":"CHIPS_COUNT", "INDICATOR_TITLE":"INDICATOR_TITLE", "VIEWS_COUNT":"VIEWS_COUNT","DECIMAL_PRECISION":"DECIMAL_PRECISION"
					}
				},
				"CHIP": {
					"bean": { 
						"id":"id", "isActive":"isActive", "evaluationId":"evaluationId", "catalogId":"catalogId", "tileType":"tileType", "COUNTER":"COUNTER", "createdBy":"createdBy", "changedBy":"changedBy", "createdOn":"createdOn", "changedOn":"changedOn"
					},
					"reverseBean": {
						"id":"id", "isActive":"isActive", "evaluationId":"evaluationId", "catalogId":"catalogId", "tileType":"tileType", "COUNTER":"COUNTER", "createdBy":"createdBy", "changedBy":"changedBy", "createdOn":"createdOn", "changedOn":"changedOn"
					}
				},
				"ASSOCIATION": {
					"bean": {
						"NAMESPACE":"NAMESPACE", "TYPE":"TYPE", "SOURCE_INDICATOR":"SOURCE_INDICATOR", "TARGET_INDICATOR":"TARGET_INDICATOR", "IS_ACTIVE":"IS_ACTIVE", "COUNTER":"COUNTER", "CREATED_BY":"CREATED_BY", "CREATED_ON":"CREATED_ON", "CHANGED_BY":"CHANGED_BY", "CHANGED_ON":"CHANGED_ON", "SOURCE_INDICATOR_TITLE":"SOURCE_INDICATOR_TITLE", "TARGET_INDICATOR_TITLE":"TARGET_INDICATOR_TITLE"
					},
					"reverseBean": {
						"NAMESPACE":"NAMESPACE", "TYPE":"TYPE", "SOURCE_INDICATOR":"SOURCE_INDICATOR", "TARGET_INDICATOR":"TARGET_INDICATOR", "IS_ACTIVE":"IS_ACTIVE", "COUNTER":"COUNTER", "CREATED_BY":"CREATED_BY", "CREATED_ON":"CREATED_ON", "CHANGED_BY":"CHANGED_BY", "CHANGED_ON":"CHANGED_ON", "SOURCE_INDICATOR_TITLE":"SOURCE_INDICATOR_TITLE", "TARGET_INDICATOR_TITLE":"TARGET_INDICATOR_TITLE"
					}
				},
				"TAG": {
					"bean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "TYPE":"TYPE", "TAG":"TAG"
					},
					"reverseBean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "TYPE":"TYPE", "TAG":"TAG"
					}
				},
				"PROPERTY": {
					"bean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "TYPE":"TYPE", "NAME":"NAME", "VALUE":"VALUE"
					},
					"reverseBean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "TYPE":"TYPE", "NAME":"NAME", "VALUE":"VALUE"
					}
				},
				"FILTER": {
					"bean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "TYPE":"TYPE", "NAME":"NAME", "VALUE_1":"VALUE_1", "OPERATOR":"OPERATOR", "VALUE_2":"VALUE_2"
					},
					"reverseBean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "TYPE":"TYPE", "NAME":"NAME", "VALUE_1":"VALUE_1", "OPERATOR":"OPERATOR", "VALUE_2":"VALUE_2"
					}
				},
				"VALUE": {
					"bean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "TYPE":"TYPE", "FIXED":"FIXED", "COLUMN_NAME":"COLUMN_NAME", "ODATA_PROPERTY":"ODATA_PROPERTY"
					},
					"reverseBean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "TYPE":"TYPE", "FIXED":"FIXED", "COLUMN_NAME":"COLUMN_NAME", "ODATA_PROPERTY":"ODATA_PROPERTY"
					}
				},
				"DDA_MASTER": {
					"bean": {
						"EVALUATION_ID":"EVALUATION_ID", "CONFIGURATION_ID":"CONFIGURATION_ID", "CONFIG_ORDER":"CONFIG_ORDER", "TEXT":"TEXT", "IS_ACTIVE":"IS_ACTIVE"
					},
					"reverseBean": {
						"EVALUATION_ID":"EVALUATION_ID", "CONFIGURATION_ID":"CONFIGURATION_ID", "CONFIG_ORDER":"CONFIG_ORDER", "TEXT":"TEXT", "IS_ACTIVE":"IS_ACTIVE"
					}
				},
				"DDA_HEADER": {
					"bean": {
						"EVALUATION_ID":"EVALUATION_ID", "CONFIGURATION_ID":"CONFIGURATION_ID", "REFERENCE_EVALUATION_ID":"REFERENCE_EVALUATION_ID", "VISUALIZATION_TYPE":"VISUALIZATION_TYPE", "VISUALIZATION_ORDER":"VISUALIZATION_ORDER", "VISIBILITY":"VISIBILITY", "DIMENSION":"DIMENSION", "IS_ACTIVE":"IS_ACTIVE", "CONFIGURATION":"CONFIGURATION"
					},
					"reverseBean": {
						"EVALUATION_ID":"EVALUATION_ID", "CONFIGURATION_ID":"CONFIGURATION_ID", "REFERENCE_EVALUATION_ID":"REFERENCE_EVALUATION_ID", "VISUALIZATION_TYPE":"VISUALIZATION_TYPE", "VISUALIZATION_ORDER":"VISUALIZATION_ORDER", "VISIBILITY":"VISIBILITY", "DIMENSION":"DIMENSION", "IS_ACTIVE":"IS_ACTIVE", "CONFIGURATION":"CONFIGURATION"
					}
				},
				"LANGUAGE": {
					"bean": {
						"SPRAS":"SPRAS", "LAISO":"LAISO", "SPTXT":"SPTXT"
					},
					"reverseBean": {
						"SPRAS":"SPRAS", "LAISO":"LAISO", "SPTXT":"SPTXT"
					}
				},
				"INDICATOR_TEXT": {
					"bean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "LANGUAGE":"LANGUAGE", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION"
					},
					"reverseBean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "LANGUAGE":"LANGUAGE", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION"
					}
				},
				"EVALUATION_TEXT": {
					"bean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "LANGUAGE":"LANGUAGE", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION"
					},
					"reverseBean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "LANGUAGE":"LANGUAGE", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION"
					}
				},
				"CHIP_TEXT": {
					"bean": {
						"id":"id", "isActive":"isActive", "language":"language", "catalogId":"catalogId", "title":"title", "description":"description"
					},
					"reverseBean": {
						"id":"id", "isActive":"isActive", "language":"language", "catalogId":"catalogId", "title":"title", "description":"description"
					}
				}
		};
	};
	
	this.formBean = function(data, entity, isBean) {
	    var bean = {};
	    var outputs = [];
	    var output = {};
	    var datum = {};
	    var isArray = false;
	    if(isBean) {
	        bean = beans[entity].bean;
	    }
	    else {
	        bean = beans[entity].reverseBean;
	    }
	    if(data instanceof Array) {
	        isArray = true;
	    }
	    else {
	        data = [data];
	    }
	    for(var i=0,l=data.length; i<l; i++) {
	        output = {};
	        datum = data[i];
	        for(var col in bean) {
	            if(bean.hasOwnProperty(col)) {
	                if(datum[col] !== undefined && datum[col] !== null) {
	                    output[bean[col]] = datum[col];
	                }
	            }
	        }
	        outputs.push(output);
	    }
	    if(!isArray) {
	        outputs = outputs[0];
	    }
	    return outputs;
	};
	
	function getDesigntimeModel() {
		that.cache.designtimeModel = that.cache.designtimeModel || new sap.ui.model.odata.ODataModel(that.getDesigntimeServiceUrl(), true);
		return that.cache.designtimeModel; 
	};
	
	function getRuntimeModel() {
		that.cache.runtimeModel = that.cache.runtimeModel || new sap.ui.model.odata.ODataModel(that.getRuntimeServiceUrl(), true);
		return that.cache.runtimeModel; 
	};
	
	function getDesigntimeServiceUrl() {
		return "/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata";
	};
	
	this.getDesigntimeServiceUrl = function() {
		jQuery.sap.log.info("Hana Adapter --> Designtime Service URI");
		return "/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata";
	};
	
	this.getRuntimeServiceUrl = function() {
		jQuery.sap.log.info("Hana Adapter --> Runtime Service URI");
		return "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata";
	};
	
	function _encodeURL(uRi) {
		return jQuery.sap.encodeURL(uRi);
	};
	
	this.getSessionUser = function(obj) {
		jQuery.sap.log.info("Hana Adapter --> Calling Session User");
		var username = null;
		var succ = obj.success;
		var err = obj.error;
		var sessionUserFetchCallBack = function(user) {
			if(user instanceof Array) {
				if(user && user.length && user[0]) {
					username = user[0].LOGON_USER;
				}
			}
			else {
				username = user.LOGON_USER;
			}
			that.cache.sessionUser = username;
			jQuery.sap.log.info("Hana Adapter --> Current Session User - " + that.cache.sessionUser);
			if(succ) {
				succ(username);
			}
		};
		
		var sessionUserFetchErrCallBack = function(d,s,x) {
			if(err) {
				err(d,s,x);
			}
		};
		if(that.cache.sessionUser) {
			username = that.cache.sessionUser;
			jQuery.sap.log.info("Hana Adapter --> Current Session User From Cache - " + that.cache.sessionUser);
			succ(username);
		}
		else {
			this.getDataByEntity({entity:"SESSION_USER", async:(obj.async || false), success:sessionUserFetchCallBack, error:sessionUserFetchErrCallBack, model:obj.model});
		}
		return that.cache.sessionUser;
	};

	this.getSystemInfo = function(obj) {
		jQuery.sap.log.info("Hana Adapter --> Fetching System Info");
		var succ = obj.success;
		that.cache.env = 1;
		jQuery.sap.log.info("Hana Adapter --> System Environment - " + ((that.cache.env) ? "SAP HANA" : "Non-SAP"));
		succ(1);
		return that.cache.env;
	};
	
	this.getAllLanguages = function(obj) {
		/*
		 *            Implement Fetching All SAP Languages
		 */
		var localLanguage = undefined;
		var succ = obj.success;
		var err = obj.error;

		var langSuccessHandler = function(data) {
			data = (data.results) ? data.results : data;
			if(data.length) {
				if(data.length == 1) {
					var SAP_LANGUAGES = {LAISO:{},SPRAS:{}};
					SAP_LANGUAGES.LAISO[data[0]["LAISO"]] = data[0]["SPRAS"]; SAP_LANGUAGES.SPRAS[data[0]["SPRAS"]] = data[0]["LAISO"];
				}
				else {
					SAP_LANGUAGES = data.reduce(function(p,c,i,a) { SAP_LANGUAGES = SAP_LANGUAGES || {}; SAP_LANGUAGES.LAISO = SAP_LANGUAGES.LAISO || {}; SAP_LANGUAGES.SPRAS = SAP_LANGUAGES.SPRAS || {}; if(i == 1){ SAP_LANGUAGES.LAISO[a[0]["LAISO"]] = a[0]["SPRAS"]; SAP_LANGUAGES.SPRAS[a[0]["SPRAS"]] = a[0]["LAISO"]; }  SAP_LANGUAGES.LAISO[a[i]["LAISO"]] = a[i]["SPRAS"]; SAP_LANGUAGES.SPRAS[a[i]["SPRAS"]] = a[i]["LAISO"]; return SAP_LANGUAGES;});
				}
				var SAP_LANGUAGE_ARRAY = data;
				that.cache.SAP_LANGUAGES = SAP_LANGUAGES;
				that.cache.SAP_LANGUAGE_ARRAY = SAP_LANGUAGE_ARRAY;
				that.cache.localeIsoLanguage = sap.ui.getCore().getConfiguration().getLocale().getLanguage().split("-")[0].toUpperCase();
				localLanguage = SAP_LANGUAGES.LAISO[that.cache.localeIsoLanguage];
				that.cache.localLanguage = localLanguage;
				that.cache.localeSapLanguage = localLanguage;
				jQuery.sap.log.info("Hana Adapter --> Logon Language - " + that.cache.localeIsoLanguage + " - " + that.cache.localeSapLanguage);
			}
			if(succ) {
				succ(SAP_LANGUAGES, SAP_LANGUAGE_ARRAY, localLanguage);
			}
		};

		var langErrorHandler = function(d,s,x) {
			if(err) {
				err(d,s,x);
			}
		};

		if(that.cache.SAP_LANGUAGE_ARRAY && that.cache.SAP_LANGUAGES) {
			that.cache.localeIsoLanguage = sap.ui.getCore().getConfiguration().getLocale().getLanguage().split("-")[0].toUpperCase();
			that.cache.localLanguage = that.cache.SAP_LANGUAGES.LAISO[that.cache.localeIsoLanguage];
			that.cache.localeSapLanguage = that.cache.localLanguage;
			jQuery.sap.log.info("Hana Adapter --> Picking All Languages from cache");
			jQuery.sap.log.info("Hana Adapter --> Logon Language - " + that.cache.localeIsoLanguage + " - " + that.cache.localeSapLanguage);
			if(succ) {
				succ(that.cache.SAP_LANGUAGES, that.cache.SAP_LANGUAGE_ARRAY, that.cache.localLanguage);
			}
		}
		else {
			jQuery.sap.log.info("Hana Adapter --> Calling All Languages");
			this.getDataByEntity({entity:"LANGUAGE",async:(obj.async || false), success:langSuccessHandler, error:langErrorHandler, model:obj.model});
		}
		
	};
	
	this.getKPIById = function(obj) {
		jQuery.sap.log.info("Hana Adapter --> Calling KPI Data");
		var that = this;
		if(!(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) && !(obj.context)) {
			throw new Error("Failed to get Indicator Id or Status for data fetch");
			return null;
		}
		var contextPath = null;
		var context = obj.context || null;
		var url = getDesigntimeServiceUrl();
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
			obj.entity = obj.entity || "/INDICATORS_MODELER";
			obj.entity = (obj.entity.indexOf("/") != 0) ? ("/" + obj.entity) : obj.entity;
			contextPath = obj.entity + "(ID='" + obj.ID + "',IS_ACTIVE=" + obj.IS_ACTIVE + ")";
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
			batchRequests.push(model.createBatchOperation("/ASSOCIATIONS_MODELER?$filter=" + _encodeURL("SOURCE_INDICATOR eq '" + obj.ID + "' or TARGET_INDICATOR eq '" + obj.ID + "'") + "&$expand=PROPERTIES","GET"));
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

	};

	this.getEvaluationById = function(obj) {
		jQuery.sap.log.info("Hana Adapter --> Calling Evaluation Data");

		var that = this;
		if(!(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) && !(obj.context)) {
			throw new Error("Failed to get Evaluation Id or Status for data fetch");
			return null;
		}
		var contextPath = null;
		var context = obj.context || null;
		var url = getDesigntimeServiceUrl();
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
			obj.entity = obj.entity || "/EVALUATIONS_MODELER";
			obj.entity = (obj.entity.indexOf("/") != 0) ? ("/" + obj.entity) : obj.entity;
			contextPath = obj.entity + "(ID='" + obj.ID + "',IS_ACTIVE=" + obj.IS_ACTIVE + ")";
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
		if(obj.indicator_tags) {
			batchRequests.push(model.createBatchOperation(contextPath+"/INDICATOR_TAGS","GET"));
			referenceObject.push("INDICATOR_TAGS");
		}
		if(obj.properties) {
			batchRequests.push(model.createBatchOperation(contextPath+"/PROPERTIES","GET"));
			referenceObject.push("PROPERTIES");
		}
		if(obj.texts) {
			batchRequests.push(model.createBatchOperation(contextPath+"/TEXTS","GET"));
			referenceObject.push("TEXTS");
		}
		if(obj.texts_for_chip) {
			batchRequests.push(model.createBatchOperation(contextPath+"/TEXTS_FOR_CHIP","GET"));
			referenceObject.push("TEXTS_FOR_CHIP");
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
			if(dataBean.CHIPS){
				dataBean.CHIPS=getChipsWithoutHarveyBall(dataBean.CHIPS);
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

	this.getAssociationById = function(obj) {
		jQuery.sap.log.info("Hana Adapter --> Calling Association Data");

		var that = this;
//		if(!(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) && !(obj.context)) {
//			throw new Error("Failed to get Indicator Id or Status for data fetch");
//			return null;
//		}
		var contextPath = null;
		var context = obj.context || null;
		var url = getDesigntimeServiceUrl();
		var model = obj.model || new sap.ui.model.odata.ODataModel(url, true);
		var dataBean = {};
		if(obj.context) {
			contextPath = obj.context.sPath;
//			if(obj.context.getObject()) {
//				obj.ID = obj.context.getObject().ID;
//				obj.IS_ACTIVE = obj.context.getObject().IS_ACTIVE;
//			}
//			else {
//				obj.ID = contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
//				obj.IS_ACTIVE = ((contextPath.indexOf("IS_ACTIVE=0") != -1) || (contextPath.indexOf("IS_ACTIVE=1") != -1)) ? ((contextPath.indexOf("IS_ACTIVE=0") != -1) ? 0 : 1) : null;
//			}
		}
		else if(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) {
//			obj.entity = obj.entity || "/INDICATORS_MODELER";
//			obj.entity = (obj.entity.indexOf("/") != 0) ? ("/" + obj.entity) : obj.entity;
//			contextPath = obj.entity + "(ID='" + obj.ID + "',IS_ACTIVE=" + obj.IS_ACTIVE + ")";
//			context = new sap.ui.model.Context(model, contextPath);
		}

		var s = obj.success;
		var e = obj.error;

		var batchRequests = [];
		var referenceObject = [];

		if(!(obj.noAssociation)) {
			if(context && context.getObject() && Object.keys(context.getObject()) && Object.keys(context)) {
				dataBean.ASSOCIATION = context.getObject();
			}
			else {
				batchRequests.push(model.createBatchOperation(contextPath,"GET"));
				referenceObject.push("ASSOCIATION");
			}
		}
		if(obj.properties) {
			batchRequests.push(model.createBatchOperation(contextPath+"/PROPERTIES","GET"));
			referenceObject.push("PROPERTIES");
		}
		if(obj.source) {
			batchRequests.push(model.createBatchOperation(contextPath+"/SOURCE_INDICATOR_INFO","GET"));
			referenceObject.push("SOURCE_INDICATOR_INFO");
		}
		if(obj.target) {
			batchRequests.push(model.createBatchOperation(contextPath+"/TARGET_INDICATOR_INFO","GET"));
			referenceObject.push("TARGET_INDICATOR_INFO");
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
			throw new Error("Failed to fetch Association details");
		},obj.async);
		return dataBean;
	};
	
	this.getChipById = function(obj) {
		jQuery.sap.log.info("Hana Adapter --> Calling Chip Data");

		var that = this;
		if(!(obj.id && obj.isActive !== null && obj.isActive !== undefined) && !(obj.context)) {
			throw new Error("Failed to get Chip Id or Status for data fetch");
			return null;
		}
		var contextPath = null;
		var context = obj.context || null;
		var url = getDesigntimeServiceUrl();
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
			obj.entity = obj.entity || "/CHIPS_MODELER";
			obj.entity = (obj.entity.indexOf("/") != 0) ? ("/" + obj.entity) : obj.entity;
			contextPath = obj.entity + "(id='" + obj.id + "',isActive=" + obj.isActive + ")";
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

	};

	this.getChipByEvaluation = function(obj) {
		jQuery.sap.log.info("Hana Adapter --> Calling Chips for Evaluation");
		obj.async = false;
		obj.chips= true;
		if(obj.success) {
			var succ = obj.success;
			succ(this.getEvaluationById(obj));
			return null;
		}
		else {
			return this.getEvaluationById(obj);
		}
		 
	};
	
	this.getDataByEntity = function(obj) {
		jQuery.sap.log.info("Hana Adapter --> Calling Entity Data");
		var that = this;
		var url = obj.uri;
		var model = obj.model || (url ? new sap.ui.model.odata.ODataModel(url,true) : getDesigntimeModel());
		var expand = "";
		var expandArr = [];
		var filter = "";
		var select = "";
		var orderby = "";
		var top = obj.top || null;
		var skip = obj.skip || null;
		var data = null;
		var succHandler = obj.success;
		var errHandler = obj.error;
		if(!(obj.entity)) {
			jQuery.sap.log.error("Entity or Context is missing for getDataByEntity call");
			throw Error("Entity or Context is missing for getDataByEntity call");
		}
		jQuery.sap.log.info("Hana Adapter --> Calling Entity Data - " + obj.entity);
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
		jQuery.sap.log.info("Hana Adapter --> Calling Entity Batch Data");
	};

	this.populateRelevantEntitySet = function(dialog, modelData, controller) {
		jQuery.sap.log.info("Hana Adapter --> Calling for Relevant Entity Sets");
		var that = controller;
		var odata_package = modelData.ODATA_URL.substr(0,modelData.ODATA_URL.lastIndexOf("/"));
		odata_package = odata_package.replace(/\//g, '.').replace(".","");

		var odata_file = modelData.ODATA_URL.substr(modelData.ODATA_URL.lastIndexOf("/") + 1);
		odata_file = odata_file.split(".")[0];

		var entity = "/ODATA_FOR_ENTITY(P_PACKAGE='"+modelData.VIEW_NAME.split("/")[0] + "',P_OBJECT='" +modelData.VIEW_NAME.split("/")[1] + "')/Results";
		var filter = "PACKAGE eq '" + odata_package + "' and OBJECT eq '" + odata_file + "'";
		
		var relevantEntitySetCallBack = function(data) {
			if(data && data.length) {
				var cdata = data[0].CDATA_STR;
				dialog.open();

				// handling comments in the xsodata file
				if(cdata) {
					//handling "//"
					var eachLine = cdata.split("\n");
					for(var i=0,l=eachLine.length; i<l; i++) {
						if(eachLine[i].indexOf("//") != -1) {
							eachLine[i] = eachLine[i].substr(0, eachLine[i].indexOf("//"));
						}
					}
					cdata = eachLine.join("\n");

					//handling "/* */"
					while(cdata.indexOf("/*") != -1) {
						var start = cdata.indexOf("/*");
						var end = cdata.indexOf("*/");
						end = (end == -1) ? cdata.length : (end+2);
						cdata = cdata.substr(0,start) + cdata.substr(end);
					}
				}

				var entityDataArray = [];
				var oModel = new sap.ui.model.json.JSONModel();
				var a = cdata.split(modelData.VIEW_NAME.split("/")[0] + '::' + modelData.VIEW_NAME.split("/")[1]);
				if(a.length == 1) {
					a = cdata.split(modelData.VIEW_NAME.split("/")[0] + '/' + modelData.VIEW_NAME.split("/")[1]);
				}
				if(a.length == 1) {
					sap.m.MessageToast.show("OData Document not compatible");
					oModel = that.populateEntitySet(that.getView().byId("odataServiceInput").getValue());
					dialog.setModel(oModel);
					return;
				}
				for(var i=1,l=a.length; i<l; i++) {
					var obj = {};
					obj.entityName = a[i].split('"')[2];
					entityDataArray.push(obj);
				}
				oModel.setData({
					entitySet : entityDataArray
				});
				dialog.setModel(oModel);
				return;
			}
		};
		
		var relevantEntitySetErrCallBack = function(d,s,x) {
			
		}; 
		
		this.getDataByEntity({entity:entity, filter:filter, async:false, success:relevantEntitySetCallBack, error:relevantEntitySetErrCallBack, model:that.oDataModel});
	};
	
	this.getAllViews = function(obj) {
		jQuery.sap.log.info("Hana Adapter --> Calling for All Views");
		return this.getDataByEntity({entity:"HANA_VIEWS", async:(obj.async || false), model:obj.model});
	};
	
	this.getPlatform = function() {
		jQuery.sap.log.info("Hana Adapter --> Fetching Platform");
		that.cache.platform = that.cache.platform || "hana";
		jQuery.sap.log.info("Hana Adapter --> Platform - " + that.cache.platform);
		return that.cache.platform;
	};
	
	this.create = function(entity, payload, parameters, success, error, async, urlParameters) {
		jQuery.sap.log.info("Hana Adapter --> Calling Create Service");
		var uri = serviceCudUrl(entity);
		var that = this;
		async = async ? true : false;
		fetchCSRFToken().done(function(d,s,x) {
			jQuery.ajax({
				type: "POST",
				async: async,
				url: appendUrlParameters(uri, urlParameters),
				data: encodeURIComponent(JSON.stringify(preparePayloadForXSJSCrud(payload))),
				headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token"), "Accept-Language":sap.suite.ui.smartbusiness.lib.Util.utils.getLocaleLanguage()},
				success: success,
				error: error
			});
		});
	};

	this.update = function(entity, payload, parameters, success, error, merge, eTag, async, urlParameters) {
		jQuery.sap.log.info("Hana Adapter --> Calling Update Service");
		var uri = serviceCudUrl(entity);
		var that = this;
		async = async ? true : false;
		fetchCSRFToken().done(function(d,s,x) {
			jQuery.ajax({
				type: "PUT",
				async: async,
				url: appendUrlParameters(uri, urlParameters),
				data: encodeURIComponent(JSON.stringify(preparePayloadForXSJSCrud(payload))),
				headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token"), "Accept-Language":sap.suite.ui.smartbusiness.lib.Util.utils.getLocaleLanguage(), "If-None-Match": (eTag || "")},
				success: success,
				error: error
			});
		});
	};

	this.remove = function(entity, payload, success, error, eTag, additionalPayload, async, urlParameters) {
		jQuery.sap.log.info("Hana Adapter --> Calling Delete Service");
		var uri = serviceCudUrl(entity);
		var that = this;
		async = async ? true : false;
		fetchCSRFToken().done(function(d,s,x) {
			jQuery.ajax({
				type: "DELETE",
				async: async,
				url: appendUrlParameters(uri, urlParameters),
				data: encodeURIComponent(JSON.stringify(preparePayloadForXSJSCrud(payload))),
				headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token"), "Accept-Language":sap.suite.ui.smartbusiness.lib.Util.utils.getLocaleLanguage(), "If-None-Match": (eTag || "")},
				success: success,
				error: error
			});
		});
	};

	function preparePayloadForXSJSCrud(payload) {
		var xsjsPayload;
		if(payload instanceof Array) {
			xsjsPayload = [];
			for(var i=0,l=payload.length; i<l; i++) {
				obj = payload[i];
				if(!(obj.keys) && !(obj.payload)) {
					xsjsPayload.push(obj);
				}
				else {
					obj.keys = obj.keys || {};
					obj.payload = obj.payload || {};
					xsjsPayload.push(jQuery.extend(true,obj.keys,obj.payload,{}));
				}
				
			}
		}
		else if(payload instanceof Object) {
			xsjsPayload = {};
			obj = payload;
			if(!(obj.keys) && !(obj.payload)) {
				xsjsPayload = obj;
			}
			else {
				obj.keys = obj.keys || {};
				obj.payload = obj.payload || {};
				xsjsPayload = jQuery.extend(true,obj.keys,obj.payload,{});
			}
			
		}
		else {
			xsjsPayload = payload;
		}
		
		return xsjsPayload;
	};
	
	function fetchCSRFToken() {
		var tokenFetchServiceUrl = "/sap/hba/r/sb/core/logic/__token.xsjs";
		tokenFetchServiceUrl = that.addSystemToServiceUrl(tokenFetchServiceUrl);
		return jQuery.ajax({
			type: "HEAD",
			async: false,
			dataType: "json",
			url: tokenFetchServiceUrl,
			headers: {"X-CSRF-Token": "Fetch"},
			success: function(d, s, x) {

			},
			error: function() {

			}
		});
	};

	this.addSystemToServiceUrl = function(url, system) {
		jQuery.sap.log.info("Hana Adapter --> Add System to Service Url");
		if(sap.ushell && sap.ushell.Container) {
			if(system) {
				url = sap.ushell.Container.getService("URLParsing").addSystemToServiceUrl(url, system);
			}
			else {
				url = sap.ushell.Container.getService("URLParsing").addSystemToServiceUrl(url);
			}
		}
		return url;
	};
	
	this.getHanaSystem = function() {
		var hashObj = hasher || window.hasher; 
		var hashArr = hashObj.getHashAsArray();
		if(hashArr && hashArr.length && hashArr[0]) {
			var hashParameters = hashArr[0].substr(hashArr[0].indexOf("?") + 1).split("&");
			for(var i=0,l=hashParameters.length; i<l; i++) {
				if(hashParameters[i] && (hashParameters[i].indexOf("sap-system") != -1)) {
					return hashParameters[i].split("=")[1]; 
				}
			}
		}
		return "";
	}; 

	function appendUrlParameters(url, urlParameters) {
		var urlParts = url.split("?");
		if(urlParts.length > 2) {
			throw new Error("Url not formed properly");
		}
		urlParts[0] = that.addSystemToServiceUrl(urlParts[0]);
		url = urlParts[0];
		if(urlParts.length == 2) {
			url += "?" + urlParts[1];
		}
		if(urlParameters && Object.keys(urlParameters) && Object.keys(urlParameters).length) {
			url = url + "?" + jQuery.param(urlParameters);
		}
		return url;
	};

	function serviceCudUrl(entity) {
		var Constants = {
				INDICATOR : "/sap/hba/r/sb/core/logic/indicators.xsjs",
				EVALUATION : "/sap/hba/r/sb/core/logic/evaluations.xsjs",
				CHIP: "/sap/hba/r/sb/core/logic/chips.xsjs",
				ACTIVATE_INDICATOR: "/sap/hba/r/sb/core/logic/activateIndicator.xsjs",
				ACTIVATE_EVALUATION: "/sap/hba/r/sb/core/logic/activateEvaluation.xsjs",
				INDICATOR_FAVOURITE: "/sap/hba/r/sb/core/logic/favouriteIndicator.xsjs",
				EVALUATION_FAVOURITE: "/sap/hba/r/sb/core/logic/favouriteEvaluation.xsjs",
				ASSOCIATION: "/sap/hba/r/sb/core/logic/associations_cud.xsjs",
				ACTIVATE_ASSOCIATION: "/sap/hba/r/sb/core/logic/activateAssociation.xsjs",
				ACTIVATE_CHIP: "/sap/hba/r/sb/core/logic/activateChip.xsjs",
				AUTHORIZATION: "/sap/hba/r/sb/core/logic/authorization.xsjs",
				COPY_DDA_CONFIGURATION: "/sap/hba/r/sb/core/logic/copyDrilldownConfiguration.xsjs",
				DUPLICATE_ENTITY: "/sap/hba/r/sb/core/logic/deepCopy.xsjs",
				CHIP_USER: "/sap/hba/r/sb/core/logic/addToCatalog.xsjs"
		}
		return Constants[entity];
	};
	
	function _createTile(payload, controllerRef, succ, err) {
		that.create("CHIP",payload,null,succ,err);
	};
	
	function _updateTile(payload, controllerRef, succ, err) {
		that.update("CHIP",payload,null,succ,err);
	};
	
	this.removeTile = function(payload, controllerRef, succ, err) {
		this.remove("CHIP",{id:payload.id, isActive:payload.isActive},succ,err);
	};
	
	this.publishChip = function(payload, mode, controllerRef, succ, err) {
		var serviceStatus = true;
		payload.keywords = payload.keywords || "";
		delete payload.navType;
		delete payload.semanticObject;
		delete payload.action;
		var chipTextPayload = [];
		var finalPayload = [];
		
		if(controllerRef.modelRef.getData().NO_OF_ADDITIONAL_LANGUAGES) {
			for(var i=0;i<controllerRef.modelRef.getData().NO_OF_ADDITIONAL_LANGUAGES;i++){
				var chipTextObject = {};
				chipTextObject.title = controllerRef.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].title;
				chipTextObject.description = controllerRef.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].description;
				chipTextObject.id = payload.id;
				chipTextObject.language = controllerRef.modelRef.getData().ADDITIONAL_LANGUAGE_ARRAY[i].language;
				chipTextObject.isActive = 0;
				chipTextPayload.push(chipTextObject);
			}
		}
		
		if(mode == "create") {
			finalPayload.push({keys:{id:payload.id, isActive:payload.isActive}, payload:{CHIP:payload, TEXTS:chipTextPayload}});
			_createTile(finalPayload, controllerRef, succ, err);
		}
		else {
			if(controllerRef.currentContextState) {
				finalPayload.push({keys:{id:payload.id, isActive:payload.isActive}, payload:{CHIP:payload, TEXTS:chipTextPayload}});
				_createTile(finalPayload, controllerRef, succ, err);
			}
			else {
				var languagePayloadForDirtyBitTest = []; 
				for(var i=0;i<controllerRef.initialData.ADDITIONAL_LANGUAGE_ARRAY.length;i++){
					var textObject = {};
					textObject.id = payload.id;
					textObject.language = controllerRef.initialData.ADDITIONAL_LANGUAGE_ARRAY[i].language;
					textObject.isActive = controllerRef.initialData.ADDITIONAL_LANGUAGE_ARRAY[i].isActive;
					textObject.description = controllerRef.initialData.ADDITIONAL_LANGUAGE_ARRAY[i].description;
					textObject.title= controllerRef.initialData.ADDITIONAL_LANGUAGE_ARRAY[i].title;
					languagePayloadForDirtyBitTest.push(textObject);
				}
				var languageDeltaObject = sap.suite.ui.smartbusiness.lib.Util.utils.dirtyBitCheck({
					oldPayload : languagePayloadForDirtyBitTest,
					newPayload : chipTextPayload,
					objectType : "CHIP_TEXTS"
				});
				var textsUpdatePayload = {remove:[],create:[]};
				if(languageDeltaObject) {
					if(languageDeltaObject.deletes.length){
						for(var i=0;i<languageDeltaObject.deletes.length;i++){
							textsUpdatePayload.remove.push(languageDeltaObject.deletes[i]);
						}
					}
					if(languageDeltaObject.updates.length){
						for(var i=0;i<languageDeltaObject.updates.length;i++){
							textsUpdatePayload.create.push(languageDeltaObject.updates[i]);
						}
					}
				}
				finalPayload.push({keys:{id:payload.id, isActive:payload.isActive}, payload:{CHIP:{update:payload}, TEXTS:textsUpdatePayload}});
				_updateTile(finalPayload, controllerRef, succ, err);
			}
			
		}
	};
	
	this.isTokenHandlingEnabledForODataRead = function() {
		return false;
	};

};
