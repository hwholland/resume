/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.hana.CatalogServicesAdapter");
sap.suite.ui.smartbusiness.adapter.hana.CatalogServicesAdapter = function() {
    var getEvaluationValues = function(evaluation, oEvaluationValues) {
        if(oEvaluationValues) {
            return oEvaluationValues.evaluationValues;
        } else {
            var values = [];
            evaluation.VALUES["results"].forEach(function(jsonObject) {
                delete jsonObject.__metadata;
                var obj = {};
                for(var prop in jsonObject) {
                    if(jsonObject.hasOwnProperty(prop)) {
                        obj[prop] = jsonObject[prop];
                    }
                }
                values.push(obj);
            });
            return values;
        }
    };
    var _getAdditionFilters = function(filters) {
        var finalArray=  [];
        if(filters && filters.length) {
            filters.forEach(function(eachArray) {
                var object = {};
                object["NAME"] = eachArray[0];
                object["OPERATOR"] = eachArray[1];
                object["VALUE_1"] = eachArray[2];
                object["VALUE_2"] = eachArray[3];
                object["TYPE"] = "FI";
                finalArray.push(object);
            });
        }
        return finalArray;
    };
    var _appendSystemAlias = function(uri, sysAlias) {
    	if(sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
    		var urlParsingService = sap.ushell.Container.getService("URLParsing");
    		if(urlParsingService) {
    			uri = urlParsingService.addSystemToServiceUrl(uri, sysAlias);
    		}
    	}
    	return uri;
    };
    var publishTileODataWrite = function(payload, systemAlias, sCallback, fCallback) {
    	var serviceUri = "/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata";
    	serviceUri = _appendSystemAlias(serviceUri, systemAlias);
        var ODataModel = sap.suite.ui.smartbusiness.lib.Util.odata.getModelByServiceUri(serviceUri);
        ODataModel.create("/CHIPS_USER", payload, null, function() {
            sCallback.call();
        }, function(err) {
            fCallback.call(null,err);
        }, false);
    };
    var publishTileXsjsService = function(payload, systemAlias, sCallback, fCallback) {
    	var serviceUri = "/sap/hba/r/sb/core/logic/__token.xsjs";
    	serviceUri = _appendSystemAlias(serviceUri, systemAlias);
    	jQuery.ajax({
    		url : serviceUri,
    		type : "HEAD",
    		async : false,
    		headers : {
    			"X-CSRF-Token" : "Fetch"
    		},
    		success : function(data, status, xhr) {
    	    	serviceUri = "/sap/hba/r/sb/core/logic/addToCatalog.xsjs";
    	    	serviceUri = _appendSystemAlias(serviceUri, systemAlias);
        		var token = xhr.getResponseHeader("x-csrf-token");
        		jQuery.ajax({
        			url : serviceUri,
        			type : "POST",
        			async : false,
        			data : encodeURIComponent(JSON.stringify(payload)),
        			dataType : "json",
        			headers : {
        				"x-csrf-token" : token
        			},
        			success : function(data) {
        				sCallback.call(null, data);
        			},
        			error : function(err) {
        				fCallback.call(null, err);
        			}
        		});
    		},
    		error : function(err) {
    			fCallback.call(null, err);
    		}
    	});
    };
	this.savePersonalizedTile = function(oParam) {
        var response = {}, oRuntimeService, oStartupParameters, sChipId, oChip;
        /**
         * oParam {
         *         title : '',
         *         description:''
         *         evaluationId : '',//Mandatory
         *         tileType : '' , //Mandatory - PossibleValues : NT, TT, CT, AT
         *         semanticObject : '',
         *         semanticAction : '',
         *         additionalFilters : [
         *              ["COUNTRY","EQ","INDIA",""],
         *              ["TIME","BT","10:20","11:20"]
         *          ],
         *          additionalAppParameters : {
         *              StoryId : '',
         *              
         *          },
         *          evaluationValues : [
         *              //for Maximizing Kpi
         *              {"TYPE" : "TA", FIXED : 2000},
         *              {"TYPE" : "CL", FIXED : 3000},
         *              {"TYPE" : "WL", FIXED : 2500}
         *              //For MINiMIZING KPI
         *              {"TYPE" : "TA", FIXED : 2000},
         *              {"TYPE" : "CH", FIXED : 3000},
         *              {"TYPE" : "WH", FIXED : 2500}

         *              //for Target Kpi
         *              {"TYPE" : "CL", FIXED : 3000},
         *              {"TYPE" : "WL", FIXED : 2500}
         *              {"TYPE" : "TA", FIXED : 2000},
         *              {"TYPE" : "CH", FIXED : 3000},
         *              {"TYPE" : "WH", FIXED : 2500}
         *              
         *          ] 
         * }
         */
        if(oParam.evaluationId && oParam.tileType) {
            var evaluationData = sap.suite.ui.smartbusiness.lib.Util.kpi.getEvaluationById({
                id  : oParam.evaluationId,
                cache : true,
                filters : true,
                thresholds : true,
                useRuntimeService : true,
                sapSystem : oParam.sapSystem
            });
            if(evaluationData && evaluationData.ID) {
                var TIMESTAMP = Date.now()+"";
                var MASTER_OBJECT = {};
                //MASTER_OBJECT["id"] = CHIP_ID;
                try {
                	oRuntimeService = sap.suite.ui.smartbusiness.Adapter.getService("RuntimeServices");
                	oStartupParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters();
                	sChipId = oStartupParameters["chipId"][0];
                	oChip = oRuntimeService.getChipById({
                		id : sChipId,
                		isActive : 1
                	});
                	oChip = oChip.CHIP;
                } catch(e) {
                	return  {
                		status : "Failed",
                		message : e.message
                	};
                }
                MASTER_OBJECT["tileType"] = oChip.tileType;
                MASTER_OBJECT["url"] = oChip.url;
                MASTER_OBJECT["description"] = oParam.title || evaluationData.TITLE;
                MASTER_OBJECT["title"] = evaluationData.INDICATOR_TITLE;
                MASTER_OBJECT["catalogId"] = "HANA_CATALOG";
                MASTER_OBJECT["configuration"] = { 
                };
                MASTER_OBJECT["evaluationId"] = oChip.evaluationId
                MASTER_OBJECT["keywords"] = oChip.keywords;
                
                oChipConfiguration = JSON.parse(oChip.configuration);
                oChipConfiguration.isSufficient = "1";
                oChipConfiguration.timestamp = TIMESTAMP;
                
                oChipTileConfiguration = JSON.parse(oChipConfiguration.tileConfiguration);
                
                var tileProperties = JSON.parse(oChipTileConfiguration.TILE_PROPERTIES);
                tileProperties.id = "_____CHIPID__________CHIPID_____";
                oChipTileConfiguration.TILE_PROPERTIES = JSON.stringify(tileProperties);
                
                oChipTileConfiguration.ADDITIONAL_FILTERS = JSON.stringify(_getAdditionFilters(oParam.additionalFilters));
                var EVALUATION_VALUES = getEvaluationValues(evaluationData, oParam.evaluationValues);
                oChipTileConfiguration.EVALUATION_VALUES = JSON.stringify(EVALUATION_VALUES);
                
                MASTER_OBJECT.configuration = {
                	tileConfiguration : JSON.stringify(oChipTileConfiguration)	
                };
                var masterConfiguration = JSON.stringify(MASTER_OBJECT.configuration);
                if(masterConfiguration.length > 4096) {
                	oChipTileConfiguration.EVALUATION_FILTERS = JSON.stringify([]);
                	MASTER_OBJECT.configuration.isSufficient = "0";
                    MASTER_OBJECT.configuration = {
                    	tileConfiguration : JSON.stringify(oChipTileConfiguration)	
                    };
                    masterConfiguration = JSON.stringify(MASTER_OBJECT.configuration);
                    if(masterConfiguration.length > 4096) {
                    	oChipTileConfiguration.EVALUATION_VALUES = JSON.stringify([]);
                    }
                }
                MASTER_OBJECT.configuration = masterConfiguration;
                /*
                var TILE_PROPERTIES  =  getTileProperties(evaluationData, oParam.tileType, oParam.semanticObject, oParam.semanticAction);
                TILE_PROPERTIES["id"] = CHIP_ID;
                TILE_PROPERTIES["dimension"] = oParam.dimension;
                var EVALUATION_FILTERS = JSON.stringify(getEvaluationFilters(evaluationData));
                var EVALUATION_VALUES = getEvaluationValues(evaluationData, oParam.evaluationValues);
                var EVALUATION = JSON.stringify(getEvaluationDetails(evaluationData));
                MASTER_OBJECT.configuration.tileConfiguration["TILE_PROPERTIES"] = JSON.stringify(TILE_PROPERTIES);
                MASTER_OBJECT.configuration.tileConfiguration["EVALUATION_VALUES"] = JSON.stringify(EVALUATION_VALUES);
                MASTER_OBJECT.configuration.tileConfiguration["EVALUATION"] = EVALUATION;
                MASTER_OBJECT.configuration.tileConfiguration["ADDITIONAL_FILTERS"] = JSON.stringify(_getAdditionFilters(oParam.additionalFilters));
                MASTER_OBJECT.configuration.tileConfiguration["ADDITIONAL_APP_PARAMETERS"] = JSON.stringify(oParam.additionalAppParameters || {});
                MASTER_OBJECT.configuration.tileConfiguration["timestamp"] = TIMESTAMP;
                MASTER_OBJECT.configuration["isSufficient"] = "0";
                MASTER_OBJECT["evaluationId"] = evaluationData.ID;
                MASTER_OBJECT["keywords"] = oParam.keywords || null;
                var configurationLength = JSON.stringify(MASTER_OBJECT.configuration).length;
                if(configurationLength > 4096) {
                    MASTER_OBJECT.configuration.tileConfiguration["EVALUATION_FILTERS"] = JSON.stringify([]);
                    MASTER_OBJECT.configuration["isSufficient"] = "0";
                }
                MASTER_OBJECT["configuration"].tileConfiguration = JSON.stringify(MASTER_OBJECT["configuration"].tileConfiguration);
                MASTER_OBJECT["configuration"] = JSON.stringify(MASTER_OBJECT["configuration"]);
                */
                publishTileXsjsService(MASTER_OBJECT, oParam.sapSystem, function(responseObject) {
                    response.status = "Success",
                    response.chipId = responseObject.chipId,
                    response.message="Tile Created Successfully";
                }, function(errorObject) {
                    response.status="Failed",
                    response.message="Error Creating Tile";
                    response.errorDescription = errorObject;
                });
            } else {
                response.status="Failed",
                response.message="Invalid Evaluation Id : "+oParam.evaluationId;
            }
        } else {
            response.status="Failed",
            response.message="Mandatory Param evaluationId or TileType is Missing";
        }
        if(response.status == 'Success') {
        	oParam.success(response);
        } else {
        	oParam.error(response);
        }
        return response;
	};
};
