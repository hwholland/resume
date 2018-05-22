/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.IDGenerator");
(function() {
	var defaultSettings = {
			EVALUATION_ID_PREFIX : "E",	
			KPI_ID_PREFIX : "K",	
			VIEW_ID_PREFIX : "V"	
	};
	//URL Should be read from Adapter
	//var PUNYCODE_SERVICE_URL = sap.......Adapter.getService("AppConfiguration").getPunyCodeServiceUrl();
	var PUNYCODE_SERVICE_URL = "/tmp/aijaz/rnd/test.xsjs"; //for testing purpose
	var F = function() {};
	var IDGenerationStrategy = {
		TIMESTAMP : "TIMESTAMP",
		PUNYCODE : "PUNYCODE"
	};
	var CURRENT_STRATEGY = IDGenerationStrategy.TIMESTAMP;
	var padding = function(number, maxLength) {
		var str = ""+number;
		if(str.length >= maxLength) {
			return str;
		} else {
			return new Array(maxLength - str.length + 1).join('0') + number;
		}
	};
	var fnGenerateId = null;
	(function(strategy) {
		switch(strategy) {
			case IDGenerationStrategy.TIMESTAMP:
				fnGenerateId =  function(oParam) {
					var deferred = new jQuery.Deferred();
					var prefix = oParam.prefix;
					if(oParam.title) {
						prefix = (oParam.title+"").replace(/[\s]+/g, ".")
					}
					prefix = prefix + "." + new Date().getTime();
					deferred.resolve(prefix);
					return deferred.promise();
				};
				break;
			case IDGenerationStrategy.PUNYCODE : 
				fnGenerateId = function(oParam) {
					jQuery.sap.require("sap.ui.thirdparty.punycode");
					var title = punycode.encode(oParam.title.replace(/\s|\W/g,""));
					//Length Restriction Should be read from Adapter - Hardcoding 35
					if(title.length > 35) {
						title = title.substring(0, 35);
					}
					return jQuery.ajax({
						url : PUNYCODE_SERVICE_URL,
						type : "get",
						data : {
							type : oParam.type,
							id : title
						},
						dataType : "json"
					}).pipe(function(data) {
						if(data.found) {
							var id = data.id.substring(0,35), numberSuffix, finalId;
							var lastPart = data.id.substring(35);
							if(lastPart.length) {
								numberSuffix = -1;
								if(isNaN(lastPart)) {
									numberSuffix = 0;
								} else {
									numberSuffix = Number(lastPart);
									++numberSuffix;
								}
								finalId = id + padding(numberSuffix, 4);
							} else {
								finalId = id + padding(0, 4);
							}
							return finalId;
						} else {
							return title + padding(0, 4);
						}
					});
				};
				break;
			default : 
				throw new Error("Please use a valid ID Generation Strategy");
		}
		
	})(CURRENT_STRATEGY);
	F.prototype = {
		//Parameter 'type' is used by backend service to query the corresponding table (If Strategy is NOT TIMESTAMP)
		generateEvaluationId : function (oSetting) {
			return fnGenerateId({prefix : defaultSettings.EVALUATION_ID_PREFIX, title : oSetting && oSetting.title, type:"evaluation"});
		},
		generateKpiId : function(oSetting) {
			return fnGenerateId({prefix : defaultSettings.KPI_ID_PREFIX, title : oSetting && oSetting.title, type:"kpi"});
		},
		generateViewId : function(oSetting) {
			return fnGenerateId({prefix : defaultSettings.VIEW_ID_PREFIX, title : oSetting && oSetting.title, type:"view"});
		}
	};
	sap.suite.ui.smartbusiness.lib.IDGenerator = new F();
})();