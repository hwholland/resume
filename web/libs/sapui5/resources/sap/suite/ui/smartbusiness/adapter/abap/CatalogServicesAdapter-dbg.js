/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
* @deprecated since SAPUI 5 version 1.28.0
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.adapter.abap.CatalogServicesAdapter");
sap.suite.ui.smartbusiness.adapter.abap.CatalogServicesAdapter = function() {
       var that = this;
       var cache={};
       var chipIdByType={
    		   'NT' : 'X-SAP-UI2-CHIP:/SSB/NUMERIC_TILE',
    		   'CT' : 'X-SAP-UI2-CHIP:/SSB/COMPARISON_TILE',
    		   'TT' : 'X-SAP-UI2-CHIP:/SSB/TREND_TILE',
    		   'AT' : 'X-SAP-UI2-CHIP:/SSB/DEVIATION_TILE',
    		   'CM' : 'X-SAP-UI2-CHIP:/SSB/COMPARISON_MM_TILE',
    		   'DT-CT' : 'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_COMPARISON',
    		   'DT-CM' : 'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_COMPARISON_MM',
    		   'DT-AT' : 'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_DEVIATION',
    		   'DT-TT' : 'X-SAP-UI2-CHIP:/SSB/DUAL_NUMERIC_TREND'
       };
       var getEvaluationValues = function(evaluation, oEvaluationValues) {
              if(oEvaluationValues) {
                     return oEvaluationValues.evaluationValues;
              } else {
                     var values = [];
                     evaluation.VALUES.forEach(function(jsonObject) {
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
       var getUI2Factory=function() {
              if(!(cache.ui2Factory)) {
                     var sScope = "PERS";
                     jQuery.sap.log.info("Abap Adapter --> Creating UI2 Factory with Scope - " + sScope);
                     if(sap.ushell && sap.ushell.Container) {
                           cache.ui2Factory = sap.ushell.Container.getService("PageBuilding", sScope).getFactory();
                     }
              }
              else {
                     jQuery.sap.log.info("Abap Adapter --> Picking UI2 Factory from cache");
              }
              return cache.ui2Factory;
       };
       
       function _createTile(payload, succ, err) {
              if(!(sap.ushell && sap.ushell.Container)) {
                     jQuery.sap.require(sap.ushell.Container);
              }
              var oFactory = getUI2Factory();
              var oPB = getUI2Factory().getPageBuildingService();
              var chipId = chipIdByType[payload.tileType];
              payload.id = chipId;
              payload.chipId = chipId;
              //oPB.createPageChipInstanceFromRawData({chipId:chipId, configuration:payload.configuration, pageId:payload.catalogId, title:payload.title, description:payload.description}, publishToUI2CallBack, publishToUI2ErrCallBack);
              var oChipStub = new sap.ui2.srvc.Chip(payload,oFactory);
              var oPageStub = new sap.ui2.srvc.Page(oFactory,payload.catalogId);
              var oChip = null;
              var oPage = null;
              var newChipId = null;
              
              function writeToBagCallBack(d) {
                     jQuery.sap.log.info("Abap Adapter --> Bag updated successfully for the Chip Instance");
              }
              
              function writeToBagErrCallBack(d,s,x) {
                     jQuery.sap.log.error("Abap Adapter --> Error while writing into the Bag of the Chip Instance");
                     err(d,s,x);
              }
              
              function writeConfigCallBack(d) {
                     jQuery.sap.log.info("Abap Adapter --> Configuration updated successfully for the Chip Instance");
                     if(succ) {
                           succ({response:{chipId:newChipId}});
                     }
              }
              
              function writeConfigErrCallBack(d,s,x) {
                     jQuery.sap.log.error("Abap Adapter --> Error while writing Configuration to the Chip Instance");
                     err(d,s,x);
              }
              
              function publishToUI2CallBack(d) {
                     jQuery.sap.log.info("Abap Adapter --> Chip Instance created successfully");
                     var UI2_PAGE = 'X-SAP-UI2-PAGE';
                     var oChipInstance = d;
                     var instanceId = oChipInstance.getId();
                     payload.ID = instanceId;
                     payload.configuration = payload.configuration.replace(/___CHIPINSTID______CHIPINSTID___/g, instanceId);
                     payload.configuration = payload.configuration.replace(/_____CHIPID__________CHIPID_____/g, UI2_PAGE +":" + payload.catalogId + ":" + instanceId);
                     newChipId = UI2_PAGE +":" + payload.catalogId + ":" + instanceId;
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

       this.publishChip = function(payload, mode, succ, err) {
              if(mode == "create") {
                     jQuery.sap.log.info("Abap Adapter --> Calling Chip create");
                     _createTile(payload, succ, err);
              }
              else {
                     jQuery.sap.log.info("Abap Adapter --> Calling Chip update");
                     //_updateTile(payload, succ, err);
              }
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
                     oRuntimeService = sap.suite.ui.smartbusiness.Adapter.getService("RuntimeServices");
                     var evaluationData = oRuntimeService.getEvaluationById({
                           id  : oParam.evaluationId,
                           ID  : oParam.evaluationId,
                           cache : true,
                           filters : true,
                           values : true,
                           thresholds : true,
                           useRuntimeService : true,
                           sapSystem : oParam.sapSystem
                     });
                     if(evaluationData.EVALUATION && evaluationData.EVALUATION.ID) {
                           var TIMESTAMP = Date.now()+"";
                           var MASTER_OBJECT = {};
                           //MASTER_OBJECT["id"] = CHIP_ID;
                           
                           function fetchChipCallBack(oChip) {
                                  var oChipConfiguration = JSON.parse(oChip.configuration);

                                  oChipConfiguration.isSufficient = "1";
                                  oChipConfiguration.timestamp = TIMESTAMP;

                                  var oChipTileConfiguration = JSON.parse(oChipConfiguration.tileConfiguration);

                                  var tileProperties = JSON.parse(oChipTileConfiguration.TILE_PROPERTIES);
                                  tileProperties.id = "_____CHIPID__________CHIPID_____";
                                  tileProperties.instanceId = "___CHIPINSTID______CHIPINSTID___";
                                  tileProperties.catalogId = "/UI2/Fiori2LaunchpadHome";
                                  oChipTileConfiguration.TILE_PROPERTIES = JSON.stringify(tileProperties);

                                   oChipTileConfiguration.ADDITIONAL_FILTERS = JSON.stringify(_getAdditionFilters(oParam.additionalFilters));
                                  oChipTileConfiguration.EVALUATION_VALUES = JSON.stringify(getEvaluationValues(evaluationData, oParam.evaluationValues));

                                  oChipConfiguration.tileConfiguration= JSON.stringify(oChipTileConfiguration);
                                  oChipConfiguration=JSON.stringify(oChipConfiguration);
                                  oChip.configuration = oChipConfiguration;
                                  oChip.tileType = oParam.tileType;
                                  oChip.catalogId = "/UI2/Fiori2LaunchpadHome";
                                  oChip.title = oChip.title || evaluationData.INDICATOR_TITLE;
                                  oChip.description = oParam.title || evaluationData.TITLE;
                                  that.publishChip(oChip, "create", oParam.success, oParam.error);
                                  //var oPB = getUI2Factory().getPageBuildingService();
//                                oPB.createPageChipInstanceFromRawData({
//                                       chipId:chipIdByType[oParam.tileType],
//                                       configuration: oChipConfiguration,
//                                       pageId: "/UI2/Fiori2LaunchpadHome",
//                                       title: oParam.title,
//                                }, function(responseObject) {
//                                       response.status = "Success",
//                                       response.message="Tile Created Successfully";
//                                }, function(errorObject) {
//                                       response.status="Failed",
//                                       response.message="Error Creating Tile";
//                                       response.errorDescription = errorObject;
//                                });
                           }
                           
                           function fetchChipErrCallBack(d,s,x) {
                                  
                           }
                           
                           try {
                                  oStartupParameters = sap.suite.ui.smartbusiness.drilldown.lib.Hash.getStartupParameters();
                                  sChipId = oStartupParameters["chipId"][0];
                                  sChipId = decodeURIComponent(sChipId);
                                  sChipId = decodeURIComponent(sChipId);
                                  oChip = oRuntimeService.getChipById({
                                         id : sChipId,
                                         success : fetchChipCallBack,
                                         error : fetchChipErrCallBack
                                  });
                           } catch(e) {
                                  return  {
                                         status : "Failed",
                                         message : e.message
                                  };
                           }

                     } else {
                           response.status="Failed",
                           response.message="Invalid Evaluation Id : "+oParam.evaluationId;
                     }
              } else {
                     response.status="Failed",
                     response.message="Mandatory Param evaluationId or TileType is Missing";
              }
              return response;
       };

};

