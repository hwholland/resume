// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.launchpad.DashboardManager
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.renderers.fiori2.launchpad.DashboardManager");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");


    // avoid creating the real local LaunchPageAdapter
    function overrideLaunchPageAdapter() {
        var oAdapter = sap.ushell.Container.getService('LaunchPage');
        jQuery.extend(oAdapter, {
            moveTile : function() { return jQuery.Deferred().resolve()},
            getTileView : function () {
                var oDfd = jQuery.Deferred();
                oDfd.resolve({destroy : function(){}});
                return oDfd.promise();
            },
            getTileId : function () {
            },
            getTileTarget : function () {
            },
            getTileTitle : function () {
            },
            setTileVisible: function () {
            },
            isTileIntentSupported : function (oTile) {
                return (oTile.properties.formFactor.indexOf("Desktop") != -1);
            },
            addTile : function (oCatalogTile, oGroup) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve(oCatalogTile);
                return oDfd.promise();
            },
            isCatalogsValid : function (oCatalog) {
                return true;
            },
            getGroups : function() {
                return jQuery.Deferred().resolve(mockData.groups);
            },
            addGroup: function (sTitle) {
                var oGroup = {
                    id: sTitle,
                    groupId: sTitle,
                    title: sTitle,
                    tiles: []
                };
                return jQuery.Deferred().resolve(oGroup);
            },
            getCatalogs : function () {
                var oDfd = jQuery.Deferred();

                //Simulate an async function with a loading delay of up to 5 sec
                // Simulates a progress call (the progress function of the promise will be called)
                mockData.catalogs.forEach(function (oCatalog) {
                    window.setTimeout(function () {
                        oDfd.notify(oCatalog);
                    }, 50);
                });
                // TODO: simulate a failure (which will trigger the fail function of the promise)
                //oDfd.reject();

                window.setTimeout(function () {
                    oDfd.resolve(mockData.catalogs);
                }, 350);

                return oDfd.promise();
            },
            getGroupId : function(oGroup) {
                return oGroup.id;
            },
            getDefaultGroup : function() {
                return jQuery.Deferred().resolve([]);
            },
            getGroupTiles : function(oGroup){
                return oGroup.tiles
            },
            getGroupTitle : function(oGroup) {
                return oGroup.title;
            },
            setGroupTitle : function(oGroup, sTitle) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            moveGroup : function(oGroup, iIndex) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeGroup : function(oGroup, iIndex) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            removeTile : function(oGroup, oTile) {
                var oDfd = jQuery.Deferred();
                oDfd.resolve();
                return oDfd.promise();
            },
            isGroupRemovable : function() {
                return true;
            },
            getTileSize : function() {
                return "1x1";
            },
            getCatalogTileSize : function() {
                return "1x1";
            },
            getTileDebugInfo : function() {
                return "";
            },
            getCatalogError : function() {
                return "";
            },
            getCatalogId : function(oCatalog) {
                return oCatalog.id;
            },
            getCatalogTitle : function(oCatalog) {
                return oCatalog.title;
            },
            getCatalogTiles : function(oCatalog) {
                return jQuery.Deferred().resolve(oCatalog.tiles);
            },
            getCatalogTileTitle : function(oCatalogTile) {
                return oCatalogTile.id;
            },
            getCatalogTileKeywords : function() {
                return "";
            },
            getCatalogTileId : function(oCatalogTile) {
                return oCatalogTile.id;
            },
            getCatalogTileView : function() {
                return {destroy: function() {}};
            }
        });
        //mock data for jsview object
        sap.ui.jsview = function () {
            return {
                setWidth: function () {
                },
                setDisplayBlock: function () {
                },
                addEventDelegate: function () {
                }
            }
        };
    }

    var oDashboardManager = null;
    var oEventBus = sap.ui.getCore().getEventBus();
 
    var mockData,
        oldsap_ui_jsview,
        oUserRecentsStub;

    module("sap.ushell.renderers.fiori2.launchpad.DashboardManager", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oUserRecentsStub = sinon.stub(sap.ushell.Container.getService("UserRecents"), "addAppUsage");
            oldsap_ui_jsview = sap.ui.jsview;
            overrideLaunchPageAdapter();
            mockData = {
                groups: [
                    {
                        id: "group_0",
                        groupId: "group_0",
                        title: "group_0",
                        isGroupVisible: true,
                        object: {
                            id: "group_0",
                            groupId: "group_0",
                            tiles: [
                                    {
                                        id: "tile_00",
                                        uuid: "tile_00",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_00",
                                            uuid: "tile_00"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Phone"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_01",
                                        uuid: "tile_01",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_01",
                                            uuid: "tile_01"
                                        },
                                        properties: {
                                            formFactor: "Tablet,Phone"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_02",
                                        uuid: "tile_02",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_02",
                                            uuid: "tile_02"
                                        },
                                        properties: {
                                            formFactor: "Desktop"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_03",
                                        uuid: "tile_03",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_03",
                                            uuid: "tile_03"
                                        },
                                        properties: {
                                            formFactor: "Phone"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_04",
                                        uuid: "tile_04",
                                        isTileIntentSupported: true,
                                        object: {
                                            id: "tile_04",
                                            uuid: "tile_04"
                                        },
                                        properties: {
                                            formFactor: "Desktop,Tablet"
                                        },
                                        content: []
                                    },
                                    {
                                        id: "tile_05",
                                        uuid: "tile_05",
                                        isTileIntentSupported: false,
                                        object: {
                                            id: "tile_05",
                                            uuid: "tile_05"
                                        },
                                        properties: {
                                            formFactor: "Tablet"
                                        },
                                        content: []
                                    }
                                ]
                        },
                        tiles: [
                            {
                                id: "tile_00",
                                uuid: "tile_00",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: {
                                    formFactor: "Desktop,Phone"
                                },
                                content: []
                            },
                            {
                                id: "tile_01",
                                uuid: "tile_01",
                                isTileIntentSupported: false,
                                object: {
                                    id: "tile_01",
                                    uuid: "tile_01"
                                },
                                properties: {
                                    formFactor: "Tablet,Phone"
                                },
                                content: []
                            },
                            {
                                id: "tile_02",
                                uuid: "tile_02",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_02",
                                    uuid: "tile_02"
                                },
                                properties: {
                                    formFactor: "Desktop"
                                },
                                content: []
                            },
                            {
                                id: "tile_03",
                                uuid: "tile_03",
                                isTileIntentSupported: false,
                                object: {
                                    id: "tile_03",
                                    uuid: "tile_03"
                                },
                                properties: {
                                    formFactor: "Phone"
                                },
                                content: []
                            },
                            {
                                id: "tile_04",
                                uuid: "tile_04",
                                isTileIntentSupported: true,
                                object: {
                                    id: "tile_04",
                                    uuid: "tile_04"
                                },
                                properties: {
                                    formFactor: "Desktop,Tablet"
                                },
                                content: []
                            },
                            {
                                id: "tile_05",
                                uuid: "tile_05",
                                isTileIntentSupported: false,
                                object: {
                                    id: "tile_05",
                                    uuid: "tile_05"
                                },
                                properties: {
                                    formFactor: "Tablet"
                                },
                                content: []
                            }
                        ]
                    },
                    {
                        id: "group_1",
                        groupId: "group_1",
                        title: "group_1",
                        isGroupVisible: true,
                        object: {
                            id: "group_1",
                            groupId: "group_1"
                        },
                        tiles: []
                    },
                    {
                        id: "group_2",
                        groupId: "group_2",
                        title: "group_2",
                        isGroupVisible: true,
                        object: {
                            id: "group_2",
                            groupId: "group_2",
                            tiles: [
                                    {
    	                                id: "tile_00",
    	                                uuid: "tile_00",
    	                                isTileIntentSupported: true,
    	                                object: {
    	                                    id: "tile_00",
    	                                    uuid: "tile_00"
    	                                },
    	                                properties: {
    	                                    formFactor: "Desktop,Phone"
    	                                },
                                        content: []
    	                            }
                                    ]
                        },
                        tiles: [
                                {
	                                id: "tile_00",
	                                uuid: "tile_00",
	                                isTileIntentSupported: true,
	                                object: {
	                                    id: "tile_00",
	                                    uuid: "tile_00"
	                                },
	                                properties: {
	                                    formFactor: "Desktop,Phone"
	                                },
                                    content: []
	                            }
                                ]
                    },
                    
                    {
                        id: "group_hidden",
                        groupId: "group_hidden",
                        title: "group_hidden",
                        isGroupVisible: false,
                        object: {
                            id: "group_hidden",
                            groupId: "group_hidden"
                        },
                        tiles: [
                                {
                                    id: "tile_00",
                                    uuid: "tile_00",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_00",
                                        uuid: "tile_00"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Phone"
                                    },
                                    content: []
                                },
                                {
                                    id: "tile_01",
                                    uuid: "tile_01",
                                    isTileIntentSupported: true,
                                    object: {
                                        id: "tile_01",
                                        uuid: "tile_01"
                                    },
                                    properties: {
                                        formFactor: "Desktop,Tablet,Phone"
                                    },
                                    content: []
                                }
                                ]
                    },
                    {
                        id: "group_03",
                        groupId: "group_03",
                        title: "group_03",
                        isGroupVisible: true,
                        object: {
                            id: "group_03",
                            groupId: "group_03"
                        },
                        tiles: []
                    },
                    
                    
                ],
                catalogs: [
                    {
                        id: "catalog_0",
                        title: "catalog_0",
                        tiles: [
                            {
                                id: "tile_00",
                                uuid: "tile_00",
                                object: {
                                    id: "tile_00",
                                    uuid: "tile_00"
                                },
                                properties: {
                                    formFactor: "Desktop,Phone"
                                },
                                content: []
                            },
                            {
                                id: "tile_01",
                                uuid: "tile_01",
                                properties: {
                                    formFactor: "Tablet,Phone"
                                },
                                content: []
                            },
                            {
                                id: "tile_02",
                                uuid: "tile_02",
                                properties: {
                                    formFactor: "Desktop"
                                },
                                content: []
                            }
                        ]
                    },
                    {
                        id: "catalog_1",
                        title: "catalog_1",
                        tiles: [
                            {
                                id: "tile_11",
                                uuid: "tile_11",
                                properties: {
                                        formFactor: "Desktop,Tablet"
                                },
                                content: []
                            },
                            {
                                id: "tile_12",
                                uuid: "tile_12",
                                properties: {
                                    formFactor: "Tablet"
                                },
                                content: []
                            }
                        ]
                    }
                ],
                catalogTiles : [
                         {
							id : "tile_00",
							uuid : "tile_00",
							src : {
								id : "tile_00",
								uuid : "tile_00",
								properties : {
									formFactor : "Desktop,Phone"
								}
							},
							properties : {
								formFactor : "Desktop,Phone"
							},
							associatedGroups : []
						}, {
							id : "tile_01",
							uuid : "tile_01",
							src : {
								id : "tile_01",
								uuid : "tile_01",
								properties : {
									formFactor : "Tablet,Phone"
								}
							},
							properties : {
								formFactor : "Tablet,Phone"
							},
							associatedGroups : []
						}, {
							id : "tile_02",
							uuid : "tile_02",
							src : {
								id : "tile_02",
								uuid : "tile_02",
								properties : {
									formFactor : "Desktop"
								}
							},
							properties : {
								formFactor : "Desktop"
							},
							associatedGroups : []
						},
						{
                            id: "tile_11",
                            uuid: "tile_11",
                            src : {
								id : "tile_11",
								uuid : "tile_11",
                            properties: {
                                    formFactor: "Desktop,Tablet"
                            }
							},
                            properties: {
                                    formFactor: "Desktop,Tablet"
                            },
							associatedGroups : []
                        },
                        {
                            id: "tile_12",
                            uuid: "tile_12",
                            src : {
								id : "tile_12",
								uuid : "tile_12",
	                            properties: {
	                                formFactor: "Tablet"
	                            }
							},
                            properties: {
                                formFactor: "Tablet"
                            },
							associatedGroups : []
                        }
                ],
                tagList: []
            };
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oDashboardManager.destroy();
            oDashboardManager = null;
            sap.ui.jsview = oldsap_ui_jsview;
            oUserRecentsStub.restore();
            delete sap.ushell.Container;
        }
    });

    test("create instance", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        ok(oDashboardManager, 'Instance was created');
    });


    test("move tile to empty group", function () {
    	
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "moveTile", {
            sTileId: "tile_02",
            toGroupId: "group_1",
            toIndex: 2
        });

        aGroups = oDashboardManager.getModel().getProperty('/groups');
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength - 1, "Original group length decreased by 1");
        equal(aGroups[1].tiles[0].id, "tile_02", "Expected tile was moved to the second group");
    });
    
    test("move tile to another group with null index", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "moveTile", {
            sTileId: "tile_02",
            toGroupId: "group_1",
            toIndex: null
        });

        aGroups = oDashboardManager.getModel().getProperty('/groups');
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength - 1, "Original group length decreased by 1");
        equal(aGroups[1].tiles[aGroups[1].tiles.length - 1].id, "tile_02", "Tile which moved with null index should be added to the last position in the tiles array");
    });

    test("move tile to the same group with null index", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "moveTile", {
            sTileId: "tile_02",
            toGroupId: "group_0",
            toIndex: null
        });

        aGroups = oDashboardManager.getModel().getProperty('/groups');
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length stayed the same");
        equal(aGroups[0].tiles[aGroups[0].tiles.length - 1].id, "tile_02", "Tile which moved with null index should be added to the last position in the tiles array");
    });

    test("move tile to empty group and back", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "moveTile", {
            sTileId: "tile_04",
            toGroupId: "group_1",
            toIndex: 0
        });

        aGroups = oDashboardManager.getModel().getProperty('/groups');
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength - 1, "Original group length decreased by 1");
        equal(aGroups[1].tiles[0].id, "tile_04", "Expected tile was moved to the second group");

        oEventBus.publish("launchpad", "moveTile", {
            sTileId: "tile_04",
            toGroupId: "group_0",
            toIndex: 0
        });

        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length increased by 1");
        equal(aGroups[0].tiles[0].id, "tile_04", "Expected tile was moved back to the first group");
    });

    test("move tile left in the same group with hidden tiles", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "moveTile", {
            sTileId: "tile_04",
            toGroupId: "group_0",
            toIndex: 1
        });

        aGroups = oDashboardManager.getModel().getProperty('/groups');
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length stayed the same");
        equal(aGroups[0].tiles[1].id, "tile_04", "Expected tile was moved to index 1 in the model (before the hidden tile)");
    });

    test("move tile right in the same group with hidden tiles", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var iOriginalGroupTilesLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "moveTile", {
            sTileId: "tile_02",
            toGroupId: "group_0",
            toIndex: 2
        });

        aGroups = oDashboardManager.getModel().getProperty('/groups');
        ok(aGroups[0].tiles.length === iOriginalGroupTilesLength, "Original group length stayed the same");
        equal(aGroups[0].tiles[4].id, "tile_02", "Expected tile was moved to index 4 in the model");
    });
    
    test("map tiles in groups", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oDashboardManager.mapCatalogTilesToGroups();
        var oTileGroups = oDashboardManager.oTileCatalogToGroupsMap["tile_00"];

        ok(oTileGroups.length === 2, "Two groups were mapped for 'tile_00'");
        
        oTileGroups = oDashboardManager.oTileCatalogToGroupsMap["tile_01"];
        ok(oTileGroups.length === 1, "One groups were mapped for 'tile_01'");
        oTileGroups = oDashboardManager.oTileCatalogToGroupsMap["tile_11"];
        ok(oTileGroups === undefined, "Zero groups were mapped for 'tile_11'");
        
    });
    
    test("map tiles in groups - update model", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        oDashboardManager.mapCatalogTilesToGroups();
        var oTileGroups = oDashboardManager.oTileCatalogToGroupsMap["tile_00"];

        ok(oTileGroups.length === 2, "Two groups were mapped for 'tile_00'");
        
        oDashboardManager.updateCatalogTilesToGroupsMap();
        var catalogTiles = oDashboardManager.getModel().getProperty('/catalogTiles'),
        	associatedGrps;
        for ( var index = 0; index < catalogTiles.length; index++) {
        	if (catalogTiles[index].id === "tile_00") {
        		 associatedGrps = catalogTiles[index].associatedGroups;
        		 ok(associatedGrps.length === 2, "Two groups in associatedGrps of 'tile_00'");
        	}
        	if (catalogTiles[index].id === "tile_11") {
       		 associatedGrps = catalogTiles[index].associatedGroups;
       		 ok(associatedGrps.length === 0, "Zero groups in associatedGrps of 'tile_11'");
        	}
		}
    });
    
    asyncTest("verify catalog drop down model", function () {
        expect(2);
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel({})});
        oEventBus.publish("showCatalog", {});

        setTimeout(function() {//since the showCatalog flow is asynchronous
            var oModel = oDashboardManager.getModel();
            var aCatalogs = oModel.getProperty('/catalogs');

            equal(aCatalogs.length, 3, "catalog drop down array should contain 3 items");
            equal(aCatalogs[0].title, "All catalogs", "the first item in the catalog drop down should be 'All catalogs'");
            start();
        }, 1500);
    });

    asyncTest("verify tiles catalog model", function () {
        var isTileInMock = function(oTile) {
            var oCatalogs = mockData.catalogs;
            for (var i = 0; i < oCatalogs.length; i++) {
                for (var j = 0; j < oCatalogs[i].tiles.length; j++) {
                    if (oCatalogs[i].tiles[j].id == oTile.id) {
                        return true;
                    }
                }
            }
            return false;
        };

        expect(6);
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel({})});
        oEventBus.publish("showCatalog", {});

        setTimeout(function() {//since the showCatalog flow is asynchronous
            var oModel = oDashboardManager.getModel();
            var aTileCatalogs = oModel.getProperty('/catalogTiles');

            equal(aTileCatalogs.length, 5, "tile catalogs array should contain 5 items");
            for (var i = 0; i < aTileCatalogs.length; i++) {
                equal(isTileInMock(aTileCatalogs[i]), true, "tile with id " + aTileCatalogs[i].id + " should appear in the mock data");
            }
            start();
        }, 1500);
    });

    test("verify catalog tile tag list", function () {
    	var aMockTagPool = ["tag2", "tag4", "tag2", "tag4", "tag1", "tag2", "tag2", "tag3", "tag1", "tag3", "tag2", "tag4"];
            oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
            oDashboardManager.tagsPool = aMockTagPool;
            
            // Calling the tested function:
            // Reads the tags from initialTagPool, aggregates them and inserts them to tagList property of the model
            oDashboardManager.getTagList();
            // get tagList from model
            var aModelTagList = oDashboardManager.getModel().getProperty('/tagList');
            
            equal(aModelTagList.length, 4, "Length of tag list in the model is 4");
            equal(aModelTagList[0].occ, 5, "Tag2 appears 5 times");
            equal(aModelTagList[0].tag, "tag2", "Tag2 has the most occurrences");
            equal(aModelTagList[3].occ, 2, "Tag3 appears 2 times");
            equal(aModelTagList[3].tag, "tag3", "Tag3 has the least occurrences");
    });
    
    asyncTest("verify isTileIntentSupported property", function () {
        var getIsTileIntentSupportedFromMock = function (sTileId) {
            var oCatalogs = mockData.catalogs;
            var aTiles;
            for (var i = 0; i < oCatalogs.length; i++) {
                aTiles = oCatalogs[i].tiles;
                for (var j = 0; j < aTiles.length; j++) {
                    if (aTiles[j].id == sTileId) {
                        return (aTiles[j].properties.formFactor.indexOf("Desktop") != -1);
                    }
                }
            }
            return false;
        };

        expect(6);
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel({})});
        oEventBus.publish("showCatalog", {});

        setTimeout(function() {//since the showCatalog flow is asynchronous
            var oModel = oDashboardManager.getModel();
            var aTileCatalogs = oModel.getProperty('/catalogTiles');

            equal(aTileCatalogs.length, 5, "tile catalogs array should contain 5 items");
            for (var i = 0; i < aTileCatalogs.length; i++) {
                equal(aTileCatalogs[i].isTileIntentSupported, getIsTileIntentSupportedFromMock(aTileCatalogs[i].id),
                    "tile " + aTileCatalogs[i].id + " supposed not to be supported in Desktop");
            }
            start();
        }, 1800);
    });
   
    asyncTest("create a new group and save tile", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var oModel = oDashboardManager.getModel();
        var aGroups = oModel.getProperty('/groups');
        var iOriginalGroupsLength = aGroups.length;

        var catalogTileContext = new sap.ui.model.Context(oModel, "/catalogTiles/0");
        var newGroupName = 'group_4';

        oDashboardManager._createGroupAndSaveTile({
            catalogTileContext : catalogTileContext,
            newGroupName: newGroupName
        });

        setTimeout(function() {
	        var aGroups = oDashboardManager.getModel().getProperty('/groups');
	        var catalogTileId = oDashboardManager.getModel().getProperty("/catalogTiles/0/id");
            var newGroupTile = aGroups[aGroups.length - 1].tiles[0].object.id;

	        ok(aGroups.length === iOriginalGroupsLength + 1, "Original groups length increased by 1");
	        equal(aGroups[aGroups.length - 1].title, "group_4", "Expected group was added");
	        ok(newGroupTile === catalogTileId, "A tile was added to the new group");

	        start();
        }, 1000);
    });
    
    asyncTest("verify new group creation and failure in adding tile", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var oModel = oDashboardManager.getModel();
        var aGroups = oModel.getProperty('/groups');
        var iOriginalGroupsLength = aGroups.length;
        
        var catalogTileContext = new sap.ui.model.Context(oModel, "/catalogTiles/0");
        var newGroupName = 'group_4';

        var tmpFunction = oDashboardManager._createTile;
        oDashboardManager._createTile = function(){
            var deferred = jQuery.Deferred();
            deferred.resolve({group: null, status: 0, action: 'add'}); // 0 - failure
            return deferred.promise();
        }

        oDashboardManager._createGroupAndSaveTile({
            catalogTileContext : catalogTileContext,
            newGroupName: newGroupName
        });

        setTimeout(function() {
	        var aGroups = oDashboardManager.getModel().getProperty('/groups');

            ok(aGroups.length === iOriginalGroupsLength + 1, "Original groups length increased by 1");
            ok(aGroups[aGroups.length - 1].tiles.length === 0, "Tile was not added to the new group");
	        start();

            oDashboardManager._createTile = tmpFunction;
        }, 1000);
    });  
    
    test("verify new group validity", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var oModel = oDashboardManager.getModel();
        var aGroups = oModel.getProperty('/groups');
        var iOriginalGroupsLength = aGroups.length;        
        var catalogTileContext = new sap.ui.model.Context(oModel, "/catalogTiles/0");
        
        var newGroupName = null;
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
        	catalogTileContext: catalogTileContext,
        	newGroupName: newGroupName
        });

        var newGroupName = '';
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
        	catalogTileContext: catalogTileContext,
        	newGroupName: newGroupName
        });

        var newGroupName = ' ';
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
        	catalogTileContext: catalogTileContext,
        	newGroupName: newGroupName
        });

        var newGroupName = undefined;
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
        	catalogTileContext: catalogTileContext,
        	newGroupName: newGroupName
        });

        var newGroupName = {a:"1", b:"2", c:"3"}; //object    
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
        	catalogTileContext: catalogTileContext,
        	newGroupName: newGroupName
        });

        var newGroupName = new function(){}; 
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
        	catalogTileContext: catalogTileContext,
        	newGroupName: newGroupName
        });

        var newGroupName = 1;   //digit 
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
        	catalogTileContext: catalogTileContext,
        	newGroupName: newGroupName
        });

        var newGroupName = true;    // boolean
        oEventBus.publish("launchpad", "createGroupAndSaveTile", {
        	catalogTileContext: catalogTileContext,
        	newGroupName: newGroupName
        });

        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        ok(aGroups.length === iOriginalGroupsLength , "New group was not added");
    });

    test("verify change group title", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var sOriginalGroupTitle = aGroups[0].title;

        oEventBus.publish("launchpad", "changeGroupTitle", {
            newTitle: "new_group_title",
            groupId: "group_0"
        });

        aGroups = oDashboardManager.getModel().getProperty('/groups');
        var sNewGroupTitle = aGroups[0].title;
        ok(sNewGroupTitle !== sOriginalGroupTitle, "Group title changed");
        equal(sNewGroupTitle, "new_group_title", "Expected title was set");
    });
    
    test("verify move group", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var sGroup0Id = aGroups[0].id;
        var sGroup1Id = aGroups[1].id;
        var sGroup2Id = aGroups[2].id;

        oEventBus.publish("launchpad", "moveGroup", {
        	fromIndex: 2,
        	toIndex: 0
        });

        aGroups = oDashboardManager.getModel().getProperty('/groups');
        equal(aGroups[0].id, sGroup2Id, "Group 2 moved to index 0");
        equal(aGroups[1].id, sGroup0Id, "Group 0 moved to index 1");
        equal(aGroups[2].id, sGroup1Id, "Group 1 moved to index 2");
    });
    
    test("verify move group with Hidden groups", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var sGroup0Id = aGroups[0].id;
        var sGroup1Id = aGroups[1].id;
        var sGroup2Id = aGroups[2].id;
        var sGroup3Id = aGroups[3].id; //hidden
        var sGroup4Id = aGroups[4].id;
        
        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
            fromIndex: 1,
            toIndex: 3
        });

        aGroups = oDashboardManager.getModel().getProperty('/groups');
        equal(aGroups[4].id, sGroup1Id, "Group in index 1 moved to index 4 in the model");
        equal(aGroups[1].id, sGroup2Id, "Group in index 2 moved to index 1 in the model");
        equal(aGroups[2].id, sGroup3Id, "Group in index 3 moved to index 2 in the model");
        equal(aGroups[3].id, sGroup4Id, "Group in index 4 moved to index 3 in the model");
        
        //sGroup0Id
        //sGroup2Id
        //sGroup3Id - hidden
        //sGroup4Id
        //sGroup1Id
       
        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
            fromIndex: 0,
            toIndex: 1
        });
        
        equal(aGroups[0].id, sGroup2Id, "Group in index 0 is 2");
        equal(aGroups[1].id, sGroup0Id, "Group in index 1 is 0");
        equal(aGroups[2].id, sGroup3Id, "Group in index 2 is 3");
        equal(aGroups[4].id, sGroup1Id, "Group in index 3 is 1");
        //sGroup2Id
        //sGroup0Id
        //sGroup3Id - hidden
        //sGroup4Id
        //sGroup1Id
        
        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
            fromIndex: 3,
            toIndex: 1
        });
        equal(aGroups[0].id, sGroup2Id, "Group in index 0 is 2");
        equal(aGroups[1].id, sGroup1Id, "Group in index 1 is 1");
        equal(aGroups[2].id, sGroup0Id, "Group in index 2 is 0");
        equal(aGroups[3].id, sGroup3Id, "Group in index 3 is 3");
        //sGroup2Id
        //sGroup1Id
        //sGroup0Id
        //sGroup3Id - hidden
        //sGroup4Id
        var model = oDashboardManager.getModel();
        var groups = model.getProperty('/groups');
        groups.push({
            id: "group_007",
            groupId: "group_007",
            title: "group_007",
            isGroupVisible: true,
            object: {
                id: "group_007",
                groupId: "group_007"
            },
            tiles: []
        });
        model.setProperty('/groups', groups);
        //sGroup2Id
        //sGroup1Id
        //sGroup0Id
        //sGroup3Id - hidden
        //sGroup4Id
        //group_007
        
        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
            fromIndex: 4,
            toIndex: 3
        });
        equal(aGroups[2].id, sGroup0Id, "Group in index 2 is 0");
        equal(aGroups[3].id, "group_007", "Group in index 3 is 007");
        equal(aGroups[4].id, sGroup3Id, "Group in index 4 is 3");
        equal(aGroups[5].id, sGroup4Id, "Group in index 5 is 4");
        //sGroup2Id
        //sGroup1Id
        //sGroup0Id
        //group_007
        //sGroup3Id - hidden
        //sGroup4Id

        //Replace without hidden groups "impact"
        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
            fromIndex: 0,
            toIndex: 2
        });
        equal(aGroups[0].id, sGroup1Id, "Group in index 0 is 1");
        equal(aGroups[1].id, sGroup0Id, "Group in index 1 is 0");
        equal(aGroups[2].id, sGroup2Id, "Group in index 2 is 2");

        //sGroup1Id
        //sGroup0Id
        //sGroup2Id
        //group_007
        //sGroup3Id - hidden
        //sGroup4Id
        oEventBus.publish("launchpad", "moveGroup", { //Move second group to the end (not counting one hidden group and the moving group itself)
            fromIndex: 3,
            toIndex: 1
        });
        equal(aGroups[0].id, sGroup1Id, "Group in index 0 is 1");
        equal(aGroups[1].id, "group_007", "Group in index 1 is 007");
        equal(aGroups[2].id, sGroup0Id, "Group in index 2 is 0");
        equal(aGroups[3].id, sGroup2Id, "Group in index 3 is 2");
        //sGroup1Id
        //group_007
        //sGroup0Id
        //sGroup2Id
        //sGroup3Id - hidden
        //sGroup4Id
    });

    asyncTest("verify delete group", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var iOriginalGroupsLength = aGroups.length;

        oEventBus.publish("launchpad", "deleteGroup", {
        	groupId: "group_0"
        });

        setTimeout(function() {
        	aGroups = oDashboardManager.getModel().getProperty('/groups');
            equal(aGroups.length, iOriginalGroupsLength-1, "Groups length decreased by 1");
            
            start();
        }, 1000);
       
    });
    
    
    asyncTest("verify delete tile", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel(mockData)});
        var aGroups = oDashboardManager.getModel().getProperty('/groups');
        var iOriginalGroupLength = aGroups[0].tiles.length;

        oEventBus.publish("launchpad", "deleteTile", {
        	tileId: "tile_01"
        });

        setTimeout(function() {
        	aGroups = oDashboardManager.getModel().getProperty('/groups');
            equal(aGroups[0].tiles.length, iOriginalGroupLength-1, "Group length decreased by 1");
            
            start();
        }, 1000);
       
    });


    var aGroups,
        oTileContent;

    module("sap.ushell.renderers.fiori2.launchpad.DashboardManager-2", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oUserRecentsStub = sinon.stub(sap.ushell.Container.getService("UserRecents"), "addAppUsage");
            aGroups =
                [{
                    id: "group_0",
                    title: "KPIs",
                    isPreset: true,
                    tiles: [
                        {
                            id : "tile_00",
                            title : "Sales Performance",
                            size : "1x1",
                            tileType : "sap.ushell.ui.tile.DynamicTile"
                        },
                        {
                            id: "tile_01",
                            title: "WEB GUI",
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.TileBase"
                        }
                    ]
                }];
            oTileContent = {destroy: function(){}};

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oDashboardManager.destroy();
            oDashboardManager = null;
            oUserRecentsStub.restore();
            delete sap.ushell.Container;
        }
    });

    test("getTileView - sync tiles", function () {
        var oLaunchPageService = sap.ushell.Container.getService('LaunchPage');
        var fGetGroupsStub = sinon.stub(oLaunchPageService, "getGroups");
        fGetGroupsStub.returns(jQuery.Deferred().resolve(aGroups));
        var fGetDefaultGroup = sinon.stub(oLaunchPageService, "getDefaultGroup");
        fGetDefaultGroup.returns(jQuery.Deferred().resolve(aGroups[0]));
        var fGetTileView = sinon.stub(oLaunchPageService, "getTileView");
        fGetTileView.returns(jQuery.Deferred().resolve(oTileContent));

        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel({groups: {}})});
        oDashboardManager.loadPersonalizedGroups();
        var aModelGroups = oDashboardManager.getModel().getProperty('/groups');
        ok(aModelGroups.length === 1, "groups length should be 1 :" + aModelGroups.length);
        ok(aModelGroups[0].tiles.length === 2, "tiles length should be 2 :" + aModelGroups[0].tiles.length);
        ok(aModelGroups[0].tiles[0].content[0] === oTileContent, "tile 0 view");
        ok(aModelGroups[0].tiles[1].content[0] === oTileContent, "tile 1 view");

        fGetGroupsStub.restore();
        fGetDefaultGroup.restore();
        fGetTileView.restore();
    });

    test("getTileView - async tiles", function () {
        var clock = sinon.useFakeTimers("setTimeout");
        var oLaunchPageService = sap.ushell.Container.getService('LaunchPage');
        var fGetGroupsStub = sinon.stub(oLaunchPageService, "getGroups");
        fGetGroupsStub.returns(jQuery.Deferred().resolve(aGroups));
        var fGetDefaultGroup = sinon.stub(oLaunchPageService, "getDefaultGroup");
        fGetDefaultGroup.returns(jQuery.Deferred().resolve(aGroups[0]));
        var fGetTileView = sinon.stub(oLaunchPageService, "getTileView", function(oTile){
            var oDfd = jQuery.Deferred();
            if(oTile.id === "tile_00"){
                setTimeout(function(){
                    oDfd.reject();
                },10);
            }
            else{
                setTimeout(function(){
                    oDfd.resolve(oTileContent);
                },20);
            }
            return oDfd.promise();
        });

        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel({groups: {}})});
        oDashboardManager.loadPersonalizedGroups();
        var aModelGroups = oDashboardManager.getModel().getProperty('/groups');
        ok(aModelGroups.length === 1, "groups length should be 1 :" + aModelGroups.length);
        ok(aModelGroups[0].tiles.length === 2, "tiles length should be 2 :" + aModelGroups[0].tiles.length);
        ok(aModelGroups[0].tiles[0].content[0].getState() === "Loading", "tile 0 view loading");
        ok(aModelGroups[0].tiles[0].tall === false, "tile 0 size tall");
        ok(aModelGroups[0].tiles[0]['long'] === false, "tile 0 size long");
        ok(aModelGroups[0].tiles[1].content[0].getState() === "Loading", "tile 1 view loading");

        /**
         * make the first tile resolve and verify the model is not changed due to the bulk update
         * that wait additional 50 milliseconds
         */
        clock.tick(10);
        ok(aModelGroups[0].tiles[0].content[0].getState() === "Loading", "tile 1 view still loading");

        var fGetTileSize = sinon.stub(oLaunchPageService, "getTileSize");
        fGetTileSize.returns("2x2");
        clock.tick(70);

        ok(aModelGroups[0].tiles[0].content[0].getState() === "Failed", "tile 0 view failed");
        ok(aModelGroups[0].tiles[1].content[0] === oTileContent, "tile 1 view loaded");
        ok(aModelGroups[0].tiles[1].tall === true, "tile 1 size changed tall");
        ok(aModelGroups[0].tiles[1]['long'] === true, "tile 1 size changed long");

        fGetGroupsStub.restore();
        fGetDefaultGroup.restore();
        fGetTileView.restore();
        fGetTileSize.restore();
        clock.restore();
    });

    test("Verify sorted group", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel({groups:[]})});

        var oPageBuilderService = sap.ushell.Container.getService('LaunchPage'),
            fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            lockedGroupsLocatedCorrectly = true,
            numOfLockedGroup,
            aGroups;

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oDashboardManager.loadGroupsFromArray(mockData.groups);
        aGroups = oDashboardManager.getModel().getProperty('/groups');

        numOfLockedGroup = jQuery.grep(aGroups, function(group) {
            return group.isGroupLocked;
        }).length;

        for(var i = 0; i < numOfLockedGroup; i++){
            if (aGroups[i].isGroupLocked === false){
                lockedGroupsLocatedCorrectly = false;
                break;
            }
        }

        ok(lockedGroupsLocatedCorrectly, "All groups sorted correctly");
        ok(aGroups[numOfLockedGroup].isDefaultGroup, "Home group is located properly");
        fGetDefaultGroupStub.restore();
    });

    test("Verify locked groups are sorted in lexicographic order", function () {
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: new sap.ui.model.json.JSONModel({groups:[]})});

        var oPageBuilderService = sap.ushell.Container.getService('LaunchPage'),
            fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup"),
            numOfLockedGroup,
            isSorted = true;
        aGroups;

        fGetDefaultGroupStub.returns(jQuery.Deferred().resolve(mockData.groups[0]));
        oDashboardManager.loadGroupsFromArray(mockData.groups);
        aGroups = oDashboardManager.getModel().getProperty('/groups');

        numOfLockedGroup = jQuery.grep(aGroups, function(group) {
            return group.isGroupLocked;
        }).length;

        for (var index = 1; index < numOfLockedGroup; index++){
            if (aGroups[index-1].title.toLowerCase() > aGroups[index].title.toLowerCase()) {
                isSorted = false;
                break;
            }
        }

        ok(isSorted, "All locked groups sorted in lexicographic order correctly");
        fGetDefaultGroupStub.restore();
    });

    test("Verify that _addBookmarkToModel adds bookmark to default group if no target group was specified", function () {
        var oTempModel = new sap.ui.model.json.JSONModel(),
            oModelGroup,
            oPageBuilderService,
            fGetDefaultGroupStub,
            fLoadPersonalizedGroupsStub,
            aGroups,
            fGetTileModelStub,
            fUpdateTileModelStub,
            fGetGroupIdStub,
            fIsLockedGroup,
            oDefaultGroup = {
                isDefaultGroup: true,
                isGroupLocked: function () {return false; },
                visibilityModes: {},
                groupId: "group2ID",
                tiles: [],
                object: {
                    groupId: "group2ID",
                    isGroupLocked: false,
                }
            };

        // Fill the model with 3 groups, the 2nd one (id: group2ID) is the default group
        oTempModel.setProperty(
            "/groups",
            [
                {
                    isDefaultGroup: false,
                    groupId: "group1ID",
                    object: {
                        groupId: "group1ID"
                    }
                },
                oDefaultGroup,
                {
                    isDefaultGroup: false,
                    groupId: "group3ID",
                    object: {
                        groupId: "group3ID"
                    }
                }
            ]
        );
        oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: oTempModel});
        oPageBuilderService = sap.ushell.Container.getService('LaunchPage');

        // LaunchPage service stubs:
        fGetDefaultGroupStub = sinon.stub(oPageBuilderService, "getDefaultGroup");
        fGetGroupIdStub = sinon.stub(oPageBuilderService, "getGroupId", function (oGroupObject) {
            return oGroupObject.groupId;
        });
        fIsLockedGroup = sinon.stub(oPageBuilderService, "isGroupLocked", function (oGroupObject) {
        	return oGroupObject.isGroupLocked;
        });

        // DashboardManager stubs:
        fLoadPersonalizedGroupsStub = sinon.stub(oDashboardManager, "loadPersonalizedGroups");
        fGetTileModelStub = sinon.stub(oDashboardManager, "_getTileModel").returns({});
        fUpdateTileModelStub = sinon.stub(oDashboardManager, "_updateModelWithTileView");

        oDashboardManager._addBookmarkToModel(undefined, undefined, { tile: {}, group: undefined});

        ok(fGetTileModelStub.args[0][1] === false, "getTileModel called with the default group, whose isGroupLocked function returns false");
        oModelGroup = oTempModel.getProperty("/groups/1");
        ok(oModelGroup.tiles.length === 1, "Verify adding the bookmark to the dafault group");

        fGetDefaultGroupStub.restore();
        fLoadPersonalizedGroupsStub.restore();
        fGetTileModelStub.restore();
        fUpdateTileModelStub.restore();
        fGetGroupIdStub.restore();
        fIsLockedGroup.restore();
    });

    test("Verify that loadPersonalizedGroups is called when adding bookmark", function () {
        var oTempModel = new sap.ui.model.json.JSONModel(),
            fLoadPersonalizedGroupsStub;
            oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {model: oTempModel});



        // DashboardManager stubs:
        fLoadPersonalizedGroupsStub = sinon.stub(oDashboardManager, "loadPersonalizedGroups");

        oDashboardManager._addBookmarkToModel(undefined, undefined, { tile: undefined, group: undefined});

        ok(fLoadPersonalizedGroupsStub.called, "loadPersonalizedGroups is called when tile is undefined ( real life scenario)");


        fLoadPersonalizedGroupsStub.restore();
    });


}());
