(function () {
    "use strict";

    var oLpaData = jQuery.sap.getObject("sap.ushell.test.data.cdm.launchPageAdapter", 0),
        oCdmData = jQuery.sap.getObject("sap.ushell.test.data.cdm.cdmSiteService", 0),
        oCstrData = jQuery.sap.getObject("sap.ushell.test.data.cdm.ClientSideTargetResolution", 0);

    /*
     * CDM LaunchPageAdapter
     *  test data exposed by the CDM LPA
     */
    oLpaData.groups = {};
    oLpaData.groups.home = {
        title : "HOME Apps",
        id : "HOME",
        isPreset : true,
        isVisible : true,
        isGroupLocked : false,
        tiles :  [{
            "id":"tile_0_HOME", // generated id
            "size":"1x1",
            "tileType":"sap.ushell.ui.tile.StaticTile",
            "properties":{
                "title": "title - Static App Launcher 1",
                "subtitle": "subtitle - Static App Launcher 1",
                "chipId": "tile_0_HOME",         // generated id - TODO remove as redundant
                "info": "no info in CDM",        //TODO remove!
                "icon": "sap-icon://Fiori2/F0018",
                "targetURL": "#App1-viaStatic",
                "tilePersonalization": undefined
            }
        }],
        links: []
   };
   oLpaData.groups.ONE = {
            title : "ONE Apps",
            id : "ONE",
            isPreset : true,
            isVisible : true,
            isGroupLocked : false,
            "tiles": [
                      {
                        "id": "tile_0_ONE",
                        "properties": {
                          "chipId": "tile_0_ONE",
                          "icon": "sap-icon://Fiori2/F0018",
                          "info": "no info in CDM",
                          "subtitle": "subtitle - Static App Launcher 1",
                          "targetURL": "#App1-viaStatic",
                          "tilePersonalization": undefined,
                          "title": "title - Static App Launcher 1"
                        },
                        "size": "1x1",
                        "tileType": "sap.ushell.ui.tile.StaticTile"
                      },
                      {
                        "id": "tile_1_ONE",
                        "properties": {
                          "chipId": "tile_1_ONE",
                          "icon": "sap-icon://Fiori2/F0022",
                          "info": "no info in CDM",
                          "subtitle": "subtitle - Static App Launcher over",
                          "targetURL": "#App1-overwritten",
                          "tilePersonalization": undefined,
                          "title": "Overwrite me in ONE"
                        },
                        "size": "1x1",
                        "tileType": "sap.ushell.ui.tile.StaticTile"
                      }
                    ],
            links: []
       };

    /*
     * CdmSiteService
     *  test data exposed by the CDM CdmS Service
     */
    oCdmData.groupIds = ["HOME"];
    oCdmData.groupIdsTwo = ["ONE", "HOME"];
    oCdmData.groups = {};
    oCdmData.groups.home = {
        "identification" : {
            "id" : "HOME",
            "namespace" : "",
            "title" : "HOME Apps"
        },
        "payload" : {
            "tiles" : [ {
                "id" : "static_tile_1",
                "target" : {
                    "semanticObject" : "App1",
                    "action" : "viaStatic"
                }
            } ],
            "links" : [ /*{
                "id" : "static_link_1",
                "target" : {
                    "semanticObject" : "App1",
                    "action" : "viaStatic"
                }
            }*/ ],
            "groups" : []
        }
    };
    oCdmData.groups.ONE = {
            "identification" : {
                "id" : "ONE",
                "namespace" : "",
                "title" : "ONE Apps"
            },
            "payload" : {
                "tiles" : [ {
                    "id" : "static_tile_1",
                    "target" : {
                        "semanticObject" : "App1",
                        "action" : "viaStatic"
                    }
                },
                {
                    "id" : "dyna_tile_1",
                    "title" : "Overwrite me in ONE",
                    "indicatorDataSource":{
                        "path":"/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=10&srv=234132432"
                     },
                    "target" : {
                        "semanticObject" : "App1",
                        "action" : "overwritten"
                    }
                } ],
                "links" : [ /*{
                    "id" : "static_link_1",
                    "target" : {
                        "semanticObject" : "App1",
                        "action" : "viaStatic"
                    }
                }*/ ],
                "groups" : []
            }
        };
    oCdmData.site = {
         applications : {
             "AppDesc1" : {
                 "sap.app":{
                     "title":"translated title of application",
                     "ach":"FIN-XX",
                     "applicationVersion":{
                         "version":"1.0.0"
                     },
                     "destination":{
                        "name":"U1YCLNT000"
                     },
                     "crossNavigation":{
                        "inbounds":{
                            "start" : {
                                "semanticObject" : "App1",
                                "action" : "viaStatic",
                                "signature": {}
                            },
                             "sneaky" : {
                                "semanticObject" : "App1",
                                "action" : "viaStatic",
                                "signature": {}
                            }
                        }
                     }
                  },
                  "sap.ui":{
                     "technology":"WDA",
                     "icons":{
                        "icon":"sap-icon:\/\/Fiori2\/F0018"
                     },
                     "deviceTypes":{
                        "desktop":true,
                        "tablet":false,
                        "phone":false
                     }
                  }
             },
             "AppDesc2" : {
                 "sap.app":{
                     "title":"App desc 2 title",
                     "ach":"FIN-XX",
                     "applicationVersion":{
                         "version":"1.0.0"
                     },
                     "destination":{
                        "name":"U1YCLNT000"
                     },
                     "crossNavigation":{
                        "inbounds":{
                            "start" : {
                                "semanticObject" : "App2",
                                "action" : "viaStatic",
                                "signature": {}
                            },
                             "sneaky" : {
                                "semanticObject" : "App2",
                                "action" : "withFilter",
                                "signature": {
                                    "parameter" : {
                                        "abc" : { "filter" : { "value" : "ABC"} }
                                    }
                                }
                            }
                        }
                     }
                  },
                  "sap.ui":{
                     "technology":"WDA",
                     "icons":{
                        "icon":"sap-icon:\/\/Fiori2\/F0018"
                     },
                     "deviceTypes":{
                        "desktop":true,
                        "tablet":false,
                        "phone":false
                     }
                  }
             }
         },
         catalogs : {
             "cat1":{
                 "identification":{
                     "id":"Cat1",
                     "title":"Cat1 title"
                 },
                 "payload":{
                     "appDescriptors":[
                         {
                             "id":"AppDesc1"
                         },
                         {
                             "id":"AppDesc2"
                         }
                     ]
                 }
             },
           "cat2":{
              "identification":{
                 "id":"Cat2",
                 "title":"Accounts Payable - Checks"
              },
              "payload":{
                  "appDescriptors":[
                                    {
                                        "id":"AppDesc1"
                                    },
                                    {
                                        "id":"AppDesc3"
                                    }
                                ]
                            }
            }
         },
         groups : {
             "ONE" : oCdmData.groups.ONE,
             "HOME" : oCdmData.groups.HOME
         }
    };
    /*
     * ClientSideTargetResolution
     *  test data exposed by the ClientSideTargetResolution Service
     */
    oCstrData.resolvedTileHashes = {
        "#App1-viaStatic" : {
            "title": "title - Static App Launcher 1",
            "subtitle": "subtitle - Static App Launcher 1",
            "icon": "sap-icon://Fiori2/F0018",
            "tileComponentLoadInfo": "#App1-viaStatic",
            "isCustomTile": false
        },
        "#App1-overwritten" : {
            "title": "title - Static App Launcher over",
            "subtitle": "subtitle - Static App Launcher over",
            "icon": "sap-icon://Fiori2/F0022",
            "tileComponentLoadInfo": "#App1-overwritten",
            "isCustomTile": false
        }
        /// O_CUSTOM_1_RESOLVED = {"title":"Custom Dynamic App
        // Launcher","subtitle":"slow refresh (15
        // min)","icon":"sap-icon://time-entry-request","size":"1x1","tileComponentLoadInfo":{"componentProperties":{"url":"../../../../sap/ushell/demotiles/cdm/customtile"},"applicationType":"URL","text":"Custom
        // Dynamic App
        // Launcher","url":"../../../../sap/ushell/demotiles/cdm/customtile","componentName":"sap.ushell.demotiles.cdm.customtile"},"indicatorDataSource":{"path":"/sap/bc/zgf_persco?sap-client=120&action=KPI&Delay=4&srv=234132432","refresh":900},"isCustomTile":true,"targetOutbound":{"semanticObject":"Action","action":"toappnavsample","parameters":{"XXX":{"value":"yyy"}}}};


    };
})();
