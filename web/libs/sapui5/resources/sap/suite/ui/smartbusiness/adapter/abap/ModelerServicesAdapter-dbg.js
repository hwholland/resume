/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 * @deprecated since SAPUI 5 version 1.28.0
 */
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.abap.ModelerServicesAdapter");
sap.suite.ui.smartbusiness.adapter.abap.ModelerServicesAdapter = function() {
	
	var that = this;
	this.cache = this.cache || {};
	
	var _ENTITYKEYS={
			DDA_COLUMN : ["EVALUATION_ID",{name:"IS_ACTIVE",formatter:function(s){return parseInt(s);}},"CONFIGURATION_ID","NAME","TYPE"],
			DDA_CHART : ["EVALUATION_ID","IS_ACTIVE","CONFIGURATION_ID"],
			EVALUATIONS : ["ID","IS_ACTIVE"],
			EvaluationTexts : ["ID","IS_ACTIVE","LANGUAGE"],
			IndicatorTexts : ["ID","IS_ACTIVE","LANGUAGE"],
			INDICATORS : ["ID","IS_ACTIVE"],
			IndicatorTexts : ["ID","IS_ACTIVE","LANGUAGE"],
			EVALUATION_FILTERS : ["ID","IS_ACTIVE","TYPE","NAME","VALUE_1","OPERATOR","VALUE_2"],
			FILTERS : ["ID","IS_ACTIVE","TYPE","NAME","VALUE_1","OPERATOR","VALUE_2"],
			EVALUATION_VALUES : ["ID","IS_ACTIVE","TYPE"],
			TAGS : ["ID","IS_ACTIVE","TYPE","TAG"],
			PROPERTIES : ["ID","IS_ACTIVE","TYPE","NAME","VALUE"],
			CHIPS: ["ID","IS_ACTIVE"],
			INDICATOR : [],
			EVALUATION : [],
			CHIPS: [],
			ACTIVATE_INDICATOR: [],
			ACTIVATE_EVALUATION: [],
			INDICATOR_FAVOURITE: [],
			EVALUATION_FAVOURITE: [],
			ASSOCIATION: [],
			ACTIVATE_ASSOCIATION: [],
			ACTIVATE_CHIP: [],
			AUTHORIZATION: []
	}
	_ENTITYSETMAP={
			EVALUATION:"EVALUATIONS",
			CHIP:"CHIPS",
			INDICATOR:"INDICATORS",
			FILTERS : "EVALUATION_FILTERS",
			TEXTS : "EVALUATION_TEXTS",
			VALUES : "EVALUATION_VALUES"
	}
	_DATATYPE={
			IS_ACTIVE:"int"
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
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "COUNTER":"COUNTER", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION", "INDICATOR":"INDICATOR", "SCALING":"SCALING", "ODATA_URL":"ODATA_URL", "ODATA_ENTITYSET":"ODATA_ENTITYSET", "VIEW_NAME":"VIEW_NAME", "COLUMN_NAME":"COLUMN_NAME", "OWNER_NAME":"OWNER_NAME", "OWNER_E_MAIL":"OWNER_E_MAIL", "OWNER_ID":"OWNER_ID", "CREATED_BY":"CREATED_BY", "CREATED_ON":"CREATED_ON", "CHANGED_BY":"CHANGED_BY", "CHANGED_ON":"CHANGED_ON", "ENTITY_TYPE":"ENTITY_TYPE", "ODATA_PROPERTY":"ODATA_PROPERTY", "SEMANTIC_OBJECT":"SEMANTIC_OBJECT", "ACTION":"ACTION", "VALUES_SOURCE":"VALUES_SOURCE", "INDICATOR_TYPE":"INDICATOR_TYPE", "DATA_SPECIFICATION":"DATA_SPECIFICATION", "GOAL_TYPE":"GOAL_TYPE", "MANUAL_ENTRY":"MANUAL_ENTRY", "LAST_WORKED_ON":"LAST_WORKED_ON", "CHIPS_COUNT":"CHIPS_COUNT", "INDICATOR_TITLE":"INDICATOR_TITLE", "VIEWS_COUNT":"VIEWS_COUNT", "NAMESPACE":"NAMESPACE"
					},
					"reverseBean": {
						"ID":"ID", "IS_ACTIVE":"IS_ACTIVE", "COUNTER":"COUNTER", "TITLE":"TITLE", "DESCRIPTION":"DESCRIPTION", "INDICATOR":"INDICATOR", "SCALING":"SCALING", "ODATA_URL":"ODATA_URL", "ODATA_ENTITYSET":"ODATA_ENTITYSET", "VIEW_NAME":"VIEW_NAME", "COLUMN_NAME":"COLUMN_NAME", "OWNER_NAME":"OWNER_NAME", "OWNER_E_MAIL":"OWNER_E_MAIL", "OWNER_ID":"OWNER_ID", "CREATED_BY":"CREATED_BY", "CREATED_ON":"CREATED_ON", "CHANGED_BY":"CHANGED_BY", "CHANGED_ON":"CHANGED_ON", "ENTITY_TYPE":"ENTITY_TYPE", "ODATA_PROPERTY":"ODATA_PROPERTY", "SEMANTIC_OBJECT":"SEMANTIC_OBJECT", "ACTION":"ACTION", "VALUES_SOURCE":"VALUES_SOURCE", "INDICATOR_TYPE":"INDICATOR_TYPE", "DATA_SPECIFICATION":"DATA_SPECIFICATION", "GOAL_TYPE":"GOAL_TYPE", "MANUAL_ENTRY":"MANUAL_ENTRY", "LAST_WORKED_ON":"LAST_WORKED_ON", "CHIPS_COUNT":"CHIPS_COUNT", "INDICATOR_TITLE":"INDICATOR_TITLE", "VIEWS_COUNT":"VIEWS_COUNT"
					}
				},
				"CHIP": {
					"bean": { 
						"ID":"id", "IS_ACTIVE":"isActive", "EVALUATION_ID":"evaluationId", "CATALOG_ID":"catalogId", "TYPE":"tileType", "COUNTER":"COUNTER", "CREATED_BY":"createdBy", "CHANGED_BY":"changedBy", "CREATED_ON":"createdOn", "CHANGED_ON":"changedOn"
					},
					"reverseBean": {
						"id":"ID", "isActive":"IS_ACTIVE", "evaluationId":"EVALUATION_ID", "catalogId":"CATALOG_ID", "tileType":"TYPE", "COUNTER":"COUNTER", "createdBy":"CREATED_BY", "changedBy":"CHANGED_BY", "createdOn":"CREATED_ON", "changedOn":"CHANGED_ON"
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
						"ID":"id", "IS_ACTIVE":"isActive", "LANGUAGE":"language", "CATALOG_ID":"catalogId", "TITLE":"title", "DESCRIPTION":"description"
					},
					"reverseBean": {
						"id":"ID", "isActive":"IS_ACTIVE", "language":"LANGUAGE", "catalogId":"CATALOG_ID", "title":"TITLE", "description":"DESCRIPTION"
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
		return "/sap/opu/odata/SSB/SMART_BUSINESS_MODELER_SRV";
	};

	this.getDesigntimeServiceUrl = function() {
		jQuery.sap.log.info("Abap Adapter --> Designtime Service URI");
		return "/sap/opu/odata/SSB/SMART_BUSINESS_MODELER_SRV";
	};

	this.getRuntimeServiceUrl = function() {
		jQuery.sap.log.info("Abap Adapter --> Runtime Service URI");
		return "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV";
	};

	function _encodeURL(uRi) {
		return jQuery.sap.encodeURL(uRi);
	};

	this.getSessionUser = function(obj) {
		jQuery.sap.log.info("Abap Adapter --> Calling Session User");
		/*
		 *            Implement Fetching Session User
		 */
		var username = null;
		var succ = obj.success;
		var err = obj.error;
		
		if(that.cache.sessionUser) {
			username = that.cache.sessionUser;
			jQuery.sap.log.info("Abap Adapter --> Current Session User From Cache - " + that.cache.sessionUser);
			if(succ) {
				succ(username);
			}
		}
		else {
			try {
				if(!(sap.ushell && sap.ushell.Container)) {
					jQuery.sap.require(sap.ushell.Container);
				}
				username = sap.ushell.Container.getUser().getId();
				that.cache.sessionUser = username;
				jQuery.sap.log.info("Abap Adapter --> Current Session User - " + that.cache.sessionUser);
				if(succ) {
					succ(username);
				}
			}
			catch(e) {
				jQuery.sap.log.error("Abap Adapter --> Fetching Session User Failed");
				if(err) {
					err(d,s,x);
				}
			}
		}
		return that.cache.sessionUser;
	};

	this.getSystemInfo = function(obj) {
		jQuery.sap.log.info("Abap Adapter --> Fetching System Info");
		
		var env = null;
		var succ = obj.success;
		var err = obj.error;
		
		function sysInfoFetchCallBack(d) {
			if(d === null || d === undefined) {
				d = {};
				d.SYSFLAG = 1;
			}
			if(d.length && d[0]) {
				env = parseInt(d[0].SYSFLAG,10);
			}
			// This should not exist
			// Purely for testing purposes only => For testing customer scenario overriding env with url parameter 
			if(jQuery.sap.getUriParameters().get("env") == "cust") {
				env = 0;
			}
			that.cache.env = env;
			jQuery.sap.log.info("Abap Adapter --> System Environment - " + ((that.cache.env) ? "SAP" : "Non-SAP"));
			if(succ) {
				succ(env);
			}
		}
		
		function sysInfoFetchErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Fetching System Info Failed");
			if(err) {
				err(d,s,x);
			}
		}
		
		if(that.cache.env == undefined) {
			that.getDataByEntity({entity:"SysInfoSet",async:obj.async || false, success:sysInfoFetchCallBack, error:sysInfoFetchErrCallBack, model:obj.model});
		}
		else {
			jQuery.sap.log.info("Abap Adapter --> System Environment From Cache - " + ((that.cache.env) ? "SAP" : "Non-SAP"));
			if(succ) {
				succ(that.cache.env);
			}
		}
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
				
				jQuery.sap.log.info("Abap Adapter --> Logon Language - " + that.cache.localeIsoLanguage + " - " + that.cache.localeSapLanguage);
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
			jQuery.sap.log.info("Abap Adapter --> Picking All Languages from cache");
			that.cache.localeIsoLanguage = sap.ui.getCore().getConfiguration().getLocale().getLanguage().split("-")[0].toUpperCase();
			that.cache.localLanguage = that.cache.SAP_LANGUAGES.LAISO[that.cache.localeIsoLanguage];
			that.cache.localeSapLanguage = that.cache.localLanguage;
			if(succ) {
				succ(that.cache.SAP_LANGUAGES, that.cache.SAP_LANGUAGE_ARRAY, that.cache.localLanguage);
			}
		}
		else {
			jQuery.sap.log.info("Abap Adapter --> Calling All Languages");
			this.getDataByEntity({entity:"LANGUAGE",async:(obj.async || false), success:langSuccessHandler, error:langErrorHandler, model:obj.model});
		}
		
	};

	this.getKPIById = function(obj) {
		jQuery.sap.log.info("Abap Adapter --> Calling KPI Data");
		/*
		 *            Copied from Hana Adapter Make Changes If required
		 */
		var that = this;
		if(!(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) && !(obj.context)) {
			throw new Error("Failed to get Indicator Id or Status for data fetch");
			return null;
		}
		var contextPath = null;
		var context = obj.context || null;
		//var url = getDesigntimeServiceUrl();
		var model = obj.model || getDesigntimeModel(); //|| new sap.ui.model.odata.ODataModel(url, true);
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
				dataBean[referenceObject[i]] = (A[i].data) ? ((A[i].data.results) ? A[i].data.results : A[i].data) : null;
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
		jQuery.sap.log.info("Abap Adapter --> Calling Evaluation Data");

		/*
		 *            Copied from Hana Adapter Make Changes If required
		 */
		var that = this;
		if(!(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) && !(obj.context)) {
			throw new Error("Failed to get Evaluation Id or Status for data fetch");
			return null;
		}
		var contextPath = null;
		var context = obj.context || null;
		//var url = getDesigntimeServiceUrl();
		var model = obj.model || getDesigntimeModel(); //|| new sap.ui.model.odata.ODataModel(url, true);
		var dataBean = {};
		if(obj.context) {
			contextPath = obj.context.sPath;
			if(obj.context.getObject()) {
				obj.ID = obj.context.getObject().ID;
				obj.IS_ACTIVE = obj.context.getObject().IS_ACTIVE;
			}
			else {
				obj.ID = contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
				obj.IS_ACTIVE = ((contextPath.indexOf("IS_ACTIVE='0'") != -1) || (contextPath.indexOf("IS_ACTIVE='1'") != -1)) ? ((contextPath.indexOf("IS_ACTIVE='0'") != -1) ? 0 : 1) : null;
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
				dataBean[referenceObject[i]] = (A[i].data) ? ((A[i].data.results) ? A[i].data.results : A[i].data) : null;
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
		jQuery.sap.log.info("Abap Adapter --> Calling Association Data");
		/*
		 *            Copied from Hana Adapter Make Changes If required
		 */

		var that = this;
//		if(!(obj.ID && obj.IS_ACTIVE !== null && obj.IS_ACTIVE !== undefined) && !(obj.context)) {
//			throw new Error("Failed to get Indicator Id or Status for data fetch");
//			return null;
//		}
		var contextPath = null;
		var context = obj.context || null;
		//var url = getDesigntimeServiceUrl();
		var model = obj.model || getDesigntimeModel(); //|| new sap.ui.model.odata.ODataModel(url, true);
		var dataBean = {};
		if(obj.context) {
			contextPath = obj.context.sPath;
//			if(obj.context.getObject()) {
//			obj.ID = obj.context.getObject().ID;
//			obj.IS_ACTIVE = obj.context.getObject().IS_ACTIVE;
//			}
//			else {
//			obj.ID = contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
//			obj.IS_ACTIVE = ((contextPath.indexOf("IS_ACTIVE=0") != -1) || (contextPath.indexOf("IS_ACTIVE=1") != -1)) ? ((contextPath.indexOf("IS_ACTIVE=0") != -1) ? 0 : 1) : null;
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
				dataBean[referenceObject[i]] = (A[i].data) ? ((A[i].data.results) ? A[i].data.results : A[i].data) : null;
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
		jQuery.sap.log.info("Abap Adapter --> Calling Chip Data");
		/*
		 *            Copied from Hana Adapter Make Changes If required
		 */

		var that = this;
		if(!(obj.id && obj.isActive !== null && obj.isActive !== undefined) && !(obj.context)) {
			throw new Error("Failed to get Chip Id or Status for data fetch");
			return null;
		}
		var contextPath = null;
		var context = obj.context || null;
		//var url = getDesigntimeServiceUrl();
		var model = obj.model || getDesigntimeModel(); //|| new sap.ui.model.odata.ODataModel(url, true);
		var dataBean = {};
		if(obj.context) {
			contextPath = obj.context.sPath;
			if(obj.context.getObject()) {
				obj.id = obj.context.getObject().ID;
				obj.isActive = obj.context.getObject().IS_ACTIVE;
			}
			else {
				obj.id = contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');
				obj.isActive = ((contextPath.indexOf("IS_ACTIVE=0") != -1) || (contextPath.indexOf("IS_ACTIVE=1") != -1)) ? ((contextPath.indexOf("IS_ACTIVE=0") != -1) ? 0 : 1) : null;
			}
		}
		else if(obj.id && obj.isActive !== null && obj.isActive !== undefined) {
			obj.entity = obj.entity || "/CHIPS";
			obj.entity = (obj.entity.indexOf("/") != 0) ? ("/" + obj.entity) : obj.entity;
			contextPath = obj.entity + "(ID='" + obj.id + "',IS_ACTIVE=" + obj.isActive + ")";
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
				dataBean[referenceObject[i]] = (A[i].data) ? ((A[i].data.results) ? A[i].data.results : A[i].data) : null;
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
		jQuery.sap.log.info("Abap Adapter --> Calling Chips for Evaluation");
		obj.async = false;
		obj.chips= true;
		var finalSuccessHandler = obj.success;
		var finalErrorHandler = obj.error;
		that.chipObj = {};
		
		function evaluationFetchCallBack(evaluationObj) {
			var evaluation = evaluationObj.EVALUATION;
			if(obj.partial) {
				that.chipObj = {EVALUATION:evaluationObj.EVALUATION, CHIPS:evaluationObj.CHIPS, CATALOGS:[]};
				finalSuccessHandler(that.chipObj);
				return;
			}
			that.chipObj = {EVALUATION:evaluationObj.EVALUATION, CHIPS:[], CATALOGS:[]};
			var catalogObj = _fetchCatalogChipsForEvaluation(evaluationObj);
			var chips = _fetchChipsFromUI2(finalSuccessHandler, finalErrorHandler);
		}
		
		function evaluationFetchErrCallBack(d,s,x) {	
			if(finalErrorHandler) {
				finalErrorHandler(d,s,x);
			}
		}
		
		obj.success = evaluationFetchCallBack;
		obj.error = evaluationFetchErrCallBack;
		var evaluationObj = this.getEvaluationById(obj);
		return null;
	};

	this.getDataByEntity = function(obj) {
		jQuery.sap.log.info("Abap Adapter --> Calling Entity Data");
		/*
		 * Copied from Hana Adapter Make Changes If required
		 */
		var that = this;
		var url = obj.uri;
		var model = obj.model || (url ? new sap.ui.model.odata.ODataModel(url,true) : getDesigntimeModel());
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

	this.populateRelevantEntitySet = function(dialog, modelData, controller) {
		jQuery.sap.log.info("Abap Adapter --> Calling for Relevant Entity Sets");
		/*
		 * Implement the abap service to fetch the relevant entity set given the cds view and odata uri
		 */
	};

	this.getAllViews = function(obj) {
		jQuery.sap.log.info("Abap Adapter --> Calling for All Views");
		/*
		 * Implement the abap service to fetch all the CDS views in the system
		 */
	};

	this.getPlatform = function() {
		jQuery.sap.log.info("Abap Adapter --> Fetching Platform");
		that.cache.platform = that.cache.platform || "abap";
		jQuery.sap.log.info("Abap Adapter --> Platform - " + that.cache.platform);
		return that.cache.platform;
	};
	
	function _getContextPath(entity, keys, oContext, ignoreContext) {
		entity=entity.replace(/\/$/g,"");
		var context=(_ENTITYSETMAP[entity]||entity);
		//var context=(_ENTITYSETMAP[entity]||entity)+"/";
		if (!ignoreContext) {
			try {
				var allKeys = (_ENTITYKEYS[entity] && _ENTITYKEYS[entity].length) ? _ENTITYKEYS[entity] : Object.keys(keys);
			} catch (e) {
				var allKeys = keys instanceof Object?Object.keys(keys):[];
			}
			if (allKeys.length) {
				context += "(";
				for (var i = 0,encloser; i < allKeys.length; i++) {
					var curKey = allKeys[i];
					encloser=_DATATYPE[curKey]=="int"?"":"'";//values to be enclosed by single quote(') in case of string,and by nothing in case of integer
					var contextValue = (keys[curKey] == undefined) ? oContext[curKey] : keys[curKey];
					context += allKeys[i] + "="+encloser+ contextValue + encloser+",";
				}
				context = context.replace(/,$/g, "") + ")";
			}
		}
		return context;
	}

	function _addBatchChangeOperations(oDataModel, entity, payload, keys, method, fnS, fnE) {
		var that = this, contextPath, aRequests = [];
		if (!(payload instanceof Array)) {
			payload = [payload];
		}
		for (var i = 0; i < payload.length; i++) {
			if (Object.keys(payload[i]).length == 0)
				continue;
			for (var each in keys) {
				payload[i][each] = keys[each];
			}
			contextPath = _getContextPath(entity, keys, payload[i], method == "POST");
			if (method == "DELETE") {
				aRequests.push(oDataModel.createBatchOperation(contextPath, method));
			} else {
				aRequests.push(oDataModel.createBatchOperation(contextPath, method, payload[i]));
			}
		}
		if (aRequests.length) {
			oDataModel.addBatchChangeOperations(aRequests);
		} else {
			fnS();
		}
	}
	function _serviceRequest(getRequest, onError,fnS,fnE) {
		var requestPool = getRequest()
		if (requestPool && requestPool.length) {
			var that = this;
			var serviceUri=getDesigntimeServiceUrl();
			var oDataModel=sap.suite.ui.smartbusiness.lib.Util.odata?sap.suite.ui.smartbusiness.lib.Util.odata.getModelByServiceUri(serviceUri):new sap.ui.model.odata.ODataModel(serviceUri, true);
			for (var i = 0, request; i < requestPool.length && ((request = requestPool[i])); i++) {
				_addBatchChangeOperations(oDataModel, request.entity, request.payload, request.keys, request.method,fnS,fnE);
			}

			oDataModel.submitBatch(function(data, response) {
				_serviceRequest(getRequest, onError,fnS,fnE);
			}, onError, true);
		}
	}
	function _registerRequests(aPayload, entity) {
		var remove = [], update = [], defaultMethod = "POST", tmp = aPayload;
		var aReturn = [];
		if (!(tmp instanceof Array)) {
			tmp = [tmp];
		}
		for (var i = 0, cur; i < tmp.length; i++) {
			var cur = tmp[i].payload || tmp[i];
			var curKeys = tmp[i].keys || null;
			for (var each in cur) {
				var curItem = cur[each] || {};
				if (curItem.remove) {
					remove.push({
						keys: curKeys,
						payload: curItem.remove,
						method: "DELETE",
						entity: each
					});
				}
				if (curItem.update) {
					update.push({
						keys: curKeys,
						payload: curItem.update,
						method: "PUT",
						entity: each
					});
				}
				if (curItem.create) {
					update.push({
						keys: curKeys,
						payload: curItem.create,
						method: "POST",
						entity: each
					});
				}
				if (!(curItem.remove || curItem.create || curItem.update)) {
					update.push({
						keys: curKeys,
						payload: curItem,
						method: defaultMethod,
						entity: each
					});
				}

			}
		}
		if (remove.length)
			aReturn.push(remove);
		if (update.length)
			aReturn.push(update);
		return aReturn;

	}
	function _registerDeleteRequests(aPayload, entity) {
		var remove = [], tmp = aPayload;
		var defaultMethod = "DELETE";
		if (!(aPayload instanceof Array)) {
			tmp = aPayload.payload || aPayload;
			tmp = [tmp];
		}
		for (var i = 0, cur; i < tmp.length; i++) {
			cur = tmp[i];
			remove.push({
				keys: cur,
				payload: cur,
				method: defaultMethod,
				entity: entity
			})
		}
		return remove.length ? [remove] : [];
	}
	function _save(action, data, fnS, fnE, entity) {
		var requestQueue = [], i = 0;
		function onError() {
			delete requestQueue;
			fnE();
		}
		function getNextRequest() {
			var request = requestQueue[i++];
			if (!request) {
				fnS();
			}
			return request;
		}
		if (action == 'remove') {
			requestQueue = _registerDeleteRequests(data, entity);
		} else {
			requestQueue = _registerRequests(data, entity);
		}
		_serviceRequest(getNextRequest, onError,fnS,fnE);
	}
	this.create= function(entity, payload, parameters, fnS, fnE, async, urlParameters) {
		_save("create", payload, fnS, fnE, entity);
	};
	this.update= function(entity, payload, parameters, fnS, fnE, merge, eTag, async, urlParameters) {
		_save("update", payload, fnS, fnE, entity);
	};
	this.remove= function(entity, payload, fnS, fnE, eTag, additionalPayload, async, urlParameters) {
		_save("remove", payload, fnS, fnE, entity);
	};

	this.addSystemToServiceUrl = function(url) {
		jQuery.sap.log.info("Abap Adapter --> Add System to Service Url");
		return url;
	};

	this.getUI2Scope = function() {
		if(!(that.cache.ui2Scope)) {
			jQuery.sap.log.info("Abap Adapter --> Fetching UI2 Scope from URL");
			var scope = "CUST";
			var sysInfo = that.getSystemInfo({async:false, model:getDesigntimeModel()});
			if(sysInfo) {
				scope = "CONF";
				var urlScope = jQuery.sap.getUriParameters().get("scope");
				if(urlScope === "CUST") {
					scope = urlScope;
				}
			}
			else {
				scope = "CUST";
			}
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
	
	function _fetchCatalogChipsForEvaluation(eval) {
		var chip = eval.CHIPS;
		var fChips = [];
		var fChip = {};
		var catalogObj = {};
		var getObjByChip = {};
		var chipId = null;
		if(chip && chip.length) {
			for(var i=0,l=chip.length; i<l; i++) {
				// chip bean until the service is fixed
				fChip = {};
				fChip.id = chip[i].ID;
				fChip.isActive = 1; //chip[i].IS_ACTIVE;
				fChip.catalogId = chip[i].CATALOG_ID;
				fChip.evaluationId = chip[i].EVALUATION_ID;
				fChip.tileType = chip[i].TYPE;
				fChip.COUNTER = 1; //|| chip[i].COUNTER;
				getObjByChip[fChip.id] = fChip;
				catalogObj[chip[i].CATALOG_ID] = catalogObj[chip[i].CATALOG_ID] || {};
				catalogObj[chip[i].CATALOG_ID][chip[i].ID] = catalogObj[chip[i].CATALOG_ID][chip[i].ID] || false; 
			}
		}
		that.chipObj.getObjByChip = getObjByChip;
		that.chipObj.catalogObj = catalogObj;
		return catalogObj;
	};
	
	function _fetchChipsFromUI2(succ, err) {
		var catalogs = that.chipObj.catalogObj;
		var oDeferred = jQuery.Deferred();
		if(!(sap.ushell && sap.ushell.Container)) {
			jQuery.sap.require(sap.ushell.Container);
		}
		var oFactory = that.getUI2Factory();
		var oPBService = that.getUI2PageBuildingService(oFactory);
		var catalogCount = 0;
		var errorState = false;
		
		function _pageFetchSucc(page) {
			var chips = [];
			var chip = {};
			var bagObj = {};
			var tilePropertiesArr = [];
			if(!errorState) {
				chips = (page.Chips && page.Chips.results) ? page.Chips.results : [];
				that.chipObj.CATALOGS.push(page);
				for(var i=0,l=chips.length; i<l; i++) {
					if(that.chipObj.getObjByChip[chips[i].catalogPageChipInstanceId]) {
						that.chipObj.catalogObj[page.id][chips[i].catalogPageChipInstanceId] = true;
						chip = that.chipObj.getObjByChip[chips[i].catalogPageChipInstanceId] || {};
						chip.catalogName = page.title;
						chip.title = chips[i].title;
						// fetching chip title and description from bag
						if(chips[i].ChipBags && chips[i].ChipBags.results && chips[i].ChipBags.results.length) {
							bagObj = chips[i].ChipBags.results[0];
							if(bagObj.ChipProperties && bagObj.ChipProperties.results && bagObj.ChipProperties.results.length) {
								tilePropertiesArr = bagObj.ChipProperties.results;
								for(var j=0,m=tilePropertiesArr.length; j<m; j++) {
									if(tilePropertiesArr[j].name == "title") {
										chip.title = tilePropertiesArr[j].value;
									}
									if(tilePropertiesArr[j].name == "description") {
										chip.description = tilePropertiesArr[j].value;
									}
								}
							}
						}
						chip.url = chips[i].url;
						chip.configuration = chips[i].configuration;
						that.chipObj.CHIPS.push(chip);
					}
				}
				var currentCatalogObj = that.chipObj.catalogObj[page.id];
				for(var chipReference in currentCatalogObj) {
					if(!(currentCatalogObj[chipReference])) {
						that.chipObj.affectedTiles = that.chipObj.affectedTiles || [];
						that.chipObj.affectedTiles.push(chipReference);
						var affectedChip = that.chipObj.getObjByChip[chipReference];
						affectedChip.catalogName = "-NA-" + affectedChip.catalogId;
						affectedChip.configuration = JSON.stringify({});
						affectedChip.title = that.chipObj.EVALUATION.INDICATOR_TITLE;
						affectedChip.description = that.chipObj.EVALUATION.TITLE;
						affectedChip.isAffected = true;
						that.chipObj.CHIPS.push(affectedChip);
					}
				}
				if(catalogCount == 0) {
					if(!errorState) {
						succ(that.chipObj);
					}
					
				}
				else {
					catalogCount--;
				}
				//succ(that.chipObj);
			}
		}
		
		function _pageFetchErr(d,s,x) {
			errorState = true;
			if(err) {
				jQuery.sap.log.error("Catalog " + this.Catalog + " does not exist");
				err(d,s,x);
			}
		}
		
//		function readCatalog(currCatalog) {
//			var currentCatalog = currCatalog;
//			function _pageFetchErr(d,s,x) {
//				errorState = true;
//				if(err) {
//					err(d,s,x);
//				}
//			}
//			oPBService.readCatalog(currCatalog,_pageFetchSucc, _pageFetchErr, false, false);
//		}
		
		catalogCount = (catalogs) ? Object.keys(catalogs).length-1: 0;
		for(var catalog in catalogs) {
			//readCatalog(catalog);
			oPBService.readCatalog(catalog,_pageFetchSucc, jQuery.proxy(_pageFetchErr,{Catalog:catalog}), false, false);
		}
		if(!(Object.keys(catalogs).length)) {
			succ(that.chipObj);
		}
		return oDeferred.promise();
	};
	
	this.readChipFromUI2ById = function(catalogId, chipInstanceId, succ, err) {
		var UI2_PAGE = 'X-SAP-UI2-PAGE';
		var chipId = UI2_PAGE + ":" + catalogId + ":" + chipInstanceId;
		var oPBService = this.getUI2PageBuildingService();
		oPBService.readChip(chipId, succ, err);
	};
	
	this.readAllUI2Catalogs = function(succ, err, filter) {
		var oPBService = this.getUI2PageBuildingService();
		oPBService.readCatalogs(succ, err, filter);
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
	
	this.removeTile = function(payload, controllerRef, succ, err) {
		jQuery.sap.log.info("Abap Adapter --> Calling Chip delete");
		if(!(sap.ushell && sap.ushell.Container)) {
			jQuery.sap.require(sap.ushell.Container);
		}
		
		if(payload.isAffected) {
			removeFromUI2CallBack();
			return;
		}
		
		var oFactory = that.getUI2Factory();
		var oPB = that.getUI2PageBuildingService(oFactory);
		var oPageStub = new sap.ui2.srvc.Page(oFactory,payload.catalogId);
		
		function removeFromUI2CallBack() {
			jQuery.sap.log.info("Abap Adapter --> Chip Instance removed successfully");
			var finalPayload = {ID:payload.id, IS_ACTIVE:payload.isActive};
			that.remove("CHIP", finalPayload, succ, err);
		}
		
		function removeFromUI2ErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while removing the Chip Instance");
			err(d,s,x);
		}
		
		function chipLoadCallBack() {
			jQuery.sap.log.info("Abap Adapter --> Chip Stub loaded successfully");
			oChip = oChipStub;
			oChip.remove(removeFromUI2CallBack, removeFromUI2ErrCallBack);
		}
		
		function chipLoadErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while loading the Chip Stub");
			err(d,s,x);
		}
		
		function pageLoadCallBack() {
			jQuery.sap.log.info("Abap Adapter --> Page Stub loaded successfully");
			oPage = oPageStub;
			oChips = oPage.getChipInstances();
			for(var i=0,l=oChips.length; i<l; i++) {
				if(oChips[i].getId() == payload.id) {
					oChipStub = oChips[i];
				}
			}
			oChipStub.remove(removeFromUI2CallBack, removeFromUI2ErrCallBack);
			//oChipStub.load(chipLoadCallBack,chipLoadErrCallBack);
		}
		
		function pageLoadErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while loading the Page Stub");
			err(d,s,x);
		}
		
		oPageStub.load(pageLoadCallBack,pageLoadErrCallBack);
		
	};
	
	function _createTile(payload, controllerRef, succ, err) {
		if(!(sap.ushell && sap.ushell.Container)) {
			jQuery.sap.require(sap.ushell.Container);
		}
		var oFactory = that.getUI2Factory();
		var oPB = that.getUI2PageBuildingService(oFactory);
		var chipId = getUI2ChipIdByTileType(payload.tileType);
		payload.id = chipId;
		payload.chipId = chipId;
		//oPB.createPageChipInstanceFromRawData({chipId:chipId, configuration:payload.configuration, pageId:payload.catalogId, title:payload.title, description:payload.description}, publishToUI2CallBack, publishToUI2ErrCallBack);
		var oChipStub = new sap.ui2.srvc.Chip(payload,oFactory);
		var oPageStub = new sap.ui2.srvc.Page(oFactory,payload.catalogId);
		var oChip = null;
		var oPage = null;
		
		function publishToMappingTable(d) {
			var chipPayload = {payload:{CHIP:{ID:payload.ID,IS_ACTIVE:1,EVALUATION_ID:payload.evaluationId,TYPE:payload.tileType,CATALOG_ID:payload.catalogId}}};
			that.create('CHIP', chipPayload, null, succ, err);
		}
		
		function writeToBagCallBack(d) {
			jQuery.sap.log.info("Abap Adapter --> Bag updated successfully for the Chip Instance");
		}
		
		function writeToBagErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while writing into the Bag of the Chip Instance");
			err(d,s,x);
		}
		
		function writeConfigCallBack(d) {
			jQuery.sap.log.info("Abap Adapter --> Configuration updated successfully for the Chip Instance");
			publishToMappingTable(d);
		}
		
		function writeConfigErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while writing Configuration to the Chip Instance");
			err(d,s,x);
		}
		
		function publishToUI2CallBack(d) {
			var UI2_PAGE = 'X-SAP-UI2-PAGE';
			jQuery.sap.log.info("Abap Adapter --> Chip Instance created successfully");
			var oChipInstance = d;
			var instanceId = oChipInstance.getId();
			payload.ID = instanceId;
			payload.configuration = payload.configuration.replace(/___CHIPINSTID______CHIPINSTID___/g, instanceId);
			payload.configuration = payload.configuration.replace(/_____CHIPID__________CHIPID_____/g, UI2_PAGE +":" + payload.catalogId + ":" + instanceId);
			oChipInstance.getApi().writeConfiguration.setParameterValues(payload.configuration, writeConfigCallBack, writeConfigErrCallBack);
			oChipInstance.setTitle(payload.title);
			var tilePropertiesBag = oChipInstance.getBag("sb_tileProperties");
			tilePropertiesBag.setText("title",payload.title);
			tilePropertiesBag.setText("description",payload.description);
			tilePropertiesBag.save(writeToBagCallBack, writeToBagErrCallBack);
		}
		
		function publishToUI2ErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error in creating a Chip Instance in the UI2 Catalog");
			err(d,s,x);
		}
		
		function chipLoadCallBack() {
			jQuery.sap.log.info("Abap Adapter --> Chip Stub loaded successfully");
			oChip = oChipStub;
			oPage.addChipInstance(oChip, publishToUI2CallBack, publishToUI2ErrCallBack);
		}
		
		function chipLoadErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while loading the Chip Stub");
			err(d,s,x);
		}
		
		function pageLoadCallBack() {
			jQuery.sap.log.info("Abap Adapter --> Page Stub loaded successfully");
			oPage = oPageStub;
			oChipStub.load(chipLoadCallBack,chipLoadErrCallBack);
		}
		
		function pageLoadErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while loading the Page Stub");
			err(d,s,x);
		}
		
		oPageStub.load(pageLoadCallBack,pageLoadErrCallBack);
	};
	
	function _updateTile(payload, controllerRef, succ, err) {
		if(!(sap.ushell && sap.ushell.Container)) {
			jQuery.sap.require(sap.ushell.Container);
		}
		var oFactory = that.getUI2Factory();
		var oPB = that.getUI2PageBuildingService(oFactory);
		
		var chipId = getUI2ChipIdByTileType(payload.tileType);
		//payload.id = chipId;
		//payload.chipId = chipId;
		//oPB.createPageChipInstanceFromRawData({chipId:chipId, configuration:payload.configuration, pageId:payload.catalogId, title:payload.title, description:payload.description}, publishToUI2CallBack, publishToUI2ErrCallBack);
		var oChips = [];
		var oChipStub = new sap.ui2.srvc.Chip(payload,oFactory);
		var oPageStub = new sap.ui2.srvc.Page(oFactory,payload.catalogId);
		var oChip = null;
		var oPage = null;
		
		function publishToMappingTable(d) {
			var chipPayload = {keys:{ID:payload.ID,IS_ACTIVE:1},payload:{CHIP:{update:[{ID:payload.ID,IS_ACTIVE:1,EVALUATION_ID:payload.evaluationId,TYPE:payload.tileType,CATALOG_ID:payload.catalogId}]}}};
			controllerRef.metadataRef.update('CHIP', chipPayload, null, succ, err);
		}
		
		function writeToBagCallBack(d) {
			jQuery.sap.log.info("Abap Adapter --> Bag updated successfully for the Chip Instance");
		}
		
		function writeToBagErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while writing into the Bag of the Chip Instance");
			err(d,s,x);
		}
		
		function writeConfigCallBack(d) {
			jQuery.sap.log.info("Abap Adapter --> Configuration updated successfully for the Chip Instance");
			publishToMappingTable(d);
		}
		
		function writeConfigErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while writing Configuration to the Chip Instance");
			err(d,s,x);
		}
		
		function publishToUI2CallBack(d) {
			jQuery.sap.log.info("Abap Adapter --> Chip Instance created successfully");
			var oChipInstance = d;
			payload.ID = oChipInstance.getId();
			oChipInstance.getApi().writeConfiguration.setParameterValues(payload.configuration, writeConfigCallBack, writeConfigErrCallBack);
			oChipInstance.setTitle(payload.title);
			var tilePropertiesBag = oChipInstance.getBag("sb_tileProperties");
			tilePropertiesBag.setText("title",payload.title);
			tilePropertiesBag.setText("description",payload.description);
			tilePropertiesBag.save(writeToBagCallBack, writeToBagErrCallBack);
		}
		
		function publishToUI2ErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error in creating a Chip Instance in the UI2 Catalog");
			err(d,s,x);
		}
		
		function chipLoadCallBack() {
			jQuery.sap.log.info("Abap Adapter --> Chip Stub loaded successfully");
			oChip = oChipStub;
			publishToUI2CallBack(oChip);
			//oPage.addChipInstance(oChip, publishToUI2CallBack, publishToUI2ErrCallBack);
		}
		
		function chipLoadErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while loading the Chip Stub");
			err(d,s,x);
		}
		
		function pageLoadCallBack() {
			jQuery.sap.log.info("Abap Adapter --> Page Stub loaded successfully");
			oPage = oPageStub;
			oChips = oPage.getChipInstances();
			for(var i=0,l=oChips.length; i<l; i++) {
				if(oChips[i].getId() == payload.id) {
					oChipStub = oChips[i];
				}
			}
			oChipStub.load(chipLoadCallBack,chipLoadErrCallBack);
		}
		
		function pageLoadErrCallBack(d,s,x) {
			jQuery.sap.log.error("Abap Adapter --> Error while loading the Page Stub");
			err(d,s,x);
		}
		
		oPageStub.load(pageLoadCallBack,pageLoadErrCallBack);
	};
	
	this.publishChip = function(payload, mode, controllerRef, succ, err) {
		if(mode == "create") {
			jQuery.sap.log.info("Abap Adapter --> Calling Chip create");
			_createTile(payload, controllerRef, succ, err);
		}
		else {
			jQuery.sap.log.info("Abap Adapter --> Calling Chip update");
			_updateTile(payload, controllerRef, succ, err);
		}
	};
	
	this.isTokenHandlingEnabledForODataRead = function() {
		return true;
	};

};
