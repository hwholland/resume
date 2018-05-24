// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.LaunchPage
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, module, throws ok, start, strictEqual, stop, test, jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.services.LaunchPage");
    jQuery.sap.require("sap.ushell.adapters.local.LaunchPageAdapter");
    jQuery.sap.require("sap.ushell.resources");

    var sUshellTestRootPath = jQuery.sap.getResourcePath('sap/ushell').replace('resources', 'test-resources'),
        oLaunchPageConfig = {
            config: {
                pathToLocalizedContentResources: sUshellTestRootPath + "/test/services/resources/resources.properties",
                groups: [{
                    id: "group_0",
                    title: "test_group1",
                    isPreset: true,
                    isVisible: true,
                    isGroupLocked: false,
                    tiles: [{
                        id: "9a6eb46c-2d10-3a37-90d8-8f49f60cb111",
                        title: "test_tile_header",
                        size: "1x1",
                        tileType: "sap.ushell.ui.tile.TileBase",
                        keywords: ["test_keywords"],
                        properties: {
                            chipId: "catalogTile_1",
                            title: "test_tile_header",
                            subtitle: "test_sub_tile_header",
                            infoState: "Neutral",
                            info: "test_info",
                            icon: "sap-icon://travel-expense-report",
                            targetURL: "",
                            formFactor: "Desktop,Tablet,Phone"
                        }
                    },
                        {
                            id: "tile_001",
                            title: "test_tile_preview_api",
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.TileBase",
                            keywords: ["test_keywords"],
                            properties: {
                                chipId: "catalogTile_1",
                                infoState: "Neutral",
                                info: "test_info",
                                formFactor: "Desktop,Tablet,Phone"
                            }
                        },
                        {
                            id: "tile_787",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            isLink: true,
                            properties: {
                                text: "I am a link!",
                                href: "#Action-todefaultapp"
                            }
                        },
                        {
                            id: "tile_777",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            isLink: true,
                            properties: {
                                text: "I am an external link!",
                                href: "http://www.google.com"
                            }
                        }
                    ]
                }, {
                    id: "group_1",
                    title: "test_group2",
                    isPreset: true,
                    isVisible: true,
                    isGroupLocked: false,
                    tiles: [{}]
                }, {
                    id: "group_2",
                    title: "test_group3",
                    isPreset: true,
                    isVisible: true,
                    isGroupLocked: false,
                    tiles: [
                        {
                            id: "tile_102",
                            title: "Test component tile",
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            moduleName: "sap.ushell.demo.demoTiles",
                            moduleType: "UIComponent",
                            namespace: "sap.ushell.demo.demoTiles",
                            path: sUshellTestRootPath + "/demoapps/demoTiles/",
                            properties: {
                                chipId: "catalogTile_38",
                                title: "Test component tile",
                                subtitle: "A tile wrapped in a component",
                                infoState: "Neutral",
                                info: "0 days running without bugs",
                                icon: "sap-icon://flight",
                                targetURL: "#Action-todefaultapp",
                                formFactor: "Desktop,Tablet"
                            }
                        },
                        {
                            id: "tile_103",
                            title: "Test view tile",
                            size: "1x1",
                            tileType: "sap.ushell.ui.tile.StaticTile",
                            moduleName: "sap.ushell.demo.demoTiles.TestViewTile",
                            moduleType: "JS",
                            namespace: "sap.ushell.demo.demoTiles",
                            path: sUshellTestRootPath + "/demoapps/demoTiles/",
                            properties: {
                                chipId: "catalogTile_38",
                                title: "Test view tile",
                                subtitle: "A tile wrapped in a view",
                                infoState: "Neutral",
                                info: "0 days running without bugs",
                                icon: "sap-icon://flight",
                                targetURL: "#Action-todefaultapp",
                                formFactor: "Desktop,Tablet"
                            }
                        }
                    ]
                }],
                catalogs: [
                    {
                        id: "test_catalog_01",
                        title: "test_catalog1",
                        tiles: [{}]
                    }, {
                        id: "test_catalog_02",
                        title: "test_catalog2",
                        tiles: [{}]
                    }
                ]
            }
        };

    module("sap.ushell.services.LaunchPage", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ushell.test.restoreSpies(
            );
        }
    });

    test("addBookmark failures", function () {
        var oLaunchPageService = new sap.ushell.services.LaunchPage();

        // code under test and tests
        throws(function () {
            oLaunchPageService.addBookmark();
        });
        throws(function () {
            oLaunchPageService.addBookmark("Test");
        });
        throws(function () {
            oLaunchPageService.addBookmark({});
        }, /Title missing in bookmark configuration/);
        throws(function () {
            oLaunchPageService.addBookmark({title: ""});
        }, /Title missing in bookmark configuration/);
        throws(function () {
            oLaunchPageService.addBookmark({title: "MyTitle"});
        }, /URL missing in bookmark configuration/);
    });

    test("addBookmark success", function () {
        var oActualPromise,
            oBookmarkConfig = { title: "MyTitle", url: "MyUrl" },
            oLaunchPageAdapter =  {
                addBookmark: sinon.stub().returns(new jQuery.Deferred().promise())
            },
            oLaunchPageService;

        // prepare test
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        // code under test
        oActualPromise = oLaunchPageService.addBookmark(oBookmarkConfig);

        // test
        ok(oLaunchPageAdapter.addBookmark.calledOnce);
        ok(oLaunchPageAdapter.addBookmark.calledWith(oBookmarkConfig));
        strictEqual(oActualPromise, oLaunchPageAdapter.addBookmark.returnValues[0]);
    });

    test("setTileVisible", function () {
        var oTile = {},
            oLaunchPageAdapter =  {
                setTileVisible: sinon.spy()
            },
            oLaunchPageService;

        // prepare test
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        // code under test
        oLaunchPageService.setTileVisible(oTile, true);

        // test
        ok(oLaunchPageAdapter.setTileVisible.calledOnce);
        ok(oLaunchPageAdapter.setTileVisible.calledWithExactly(oTile, true));
    });

    test("getCatalogError", function () {
        var oCatalog = {},
            oLaunchPageAdapter =  {
                getCatalogError: sinon.stub().returns("foo")
            },
            oLaunchPageService;

        // prepare test
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        // code under test
        strictEqual(oLaunchPageService.getCatalogError(oCatalog), "foo");

        // test
        ok(oLaunchPageAdapter.getCatalogError.calledOnce);
        ok(oLaunchPageAdapter.getCatalogError.calledWithExactly(oCatalog));
    });

    test("isTileIntentSupported", function () {
        var oTile = {},
            oLaunchPageAdapter = {
                isTileIntentSupported: sinon.stub().returns("foo") // deliberately no boolean
            },
            oLaunchPageService;

        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage({});
        strictEqual(oLaunchPageService.isTileIntentSupported(oTile), true);

        // part 2: delegates to adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        strictEqual(oLaunchPageService.isTileIntentSupported(oTile), "foo");
        ok(oLaunchPageAdapter.isTileIntentSupported.calledOnce);
        ok(oLaunchPageAdapter.isTileIntentSupported.calledWithExactly(oTile));
    });

    test("isGroupVisible", function () {
        var oGroup = {},
            oLaunchPageAdapter = {
                isGroupVisible: sinon.stub().returns("visible")
            },
            oLaunchPageService;

        // part 1: unsupported in adapter - default value received from the service directly
        oLaunchPageService = new sap.ushell.services.LaunchPage({});
        strictEqual(oLaunchPageService.isGroupVisible(oGroup), true);

        // part 2: delegates to adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        strictEqual(oLaunchPageService.isGroupVisible(oGroup), "visible");
        ok(oLaunchPageAdapter.isGroupVisible.calledOnce);
        ok(oLaunchPageAdapter.isGroupVisible.calledWithExactly(oGroup));
    });

    test("isGroupLocked", function () {
        var oGroup = {},
            oLaunchPageAdapter = {
                isGroupLocked: sinon.stub().returns("foo")
            },
            oLaunchPageService;

        // part 1: unsupported in adapter - default value received from the service directly
        oLaunchPageService = new sap.ushell.services.LaunchPage({});
        strictEqual(oLaunchPageService.isGroupLocked(oGroup), false);

        // part 2: delegates to adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        strictEqual(oLaunchPageService.isGroupLocked(oGroup), "foo");
        ok(oLaunchPageAdapter.isGroupLocked.calledOnce);
        ok(oLaunchPageAdapter.isGroupLocked.calledWithExactly(oGroup));
    });

    test("hideGroups", function () {
        var aGroups = [],
            oLaunchPageAdapter = {
                hideGroups: sinon.stub().returns({
                    fail: function (f) {},
                    done: function (f) {return this; }
                })
            },
            oLaunchPageService;

        // part 1: unsupported in adapter - A deferred object is expected which is in failed status
        oLaunchPageService = new sap.ushell.services.LaunchPage({});
        var oDeferred = oLaunchPageService.hideGroups([]);
        strictEqual(oDeferred.state(), 'rejected');

        // part 2: delegates to adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.hideGroups(aGroups);
        ok(oLaunchPageAdapter.hideGroups.calledOnce);
        ok(oLaunchPageAdapter.hideGroups.calledWithExactly(aGroups));
    });

    test("getCatalogData", function () {
        var oCatalog = {},
            oResult = {},
            oLaunchPageAdapter,
            oLaunchPageService,
            oLogMock = sap.ushell.test.createLogMock()
                .filterComponent("sap.ushell.services.LaunchPage")
                .warning("getCatalogData not implemented in adapter", null,
                    "sap.ushell.services.LaunchPage");

        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage({
            getCatalogId: function (oCatalog0) {
                strictEqual(oCatalog0, oCatalog);
                return "foo";
            }
        });
        deepEqual(oLaunchPageService.getCatalogData(oCatalog), {id: "foo"});
        oLogMock.verify();

        // part 2: delegates to adapter
        oLaunchPageAdapter = {
            getCatalogData: sinon.stub().returns(oResult)
        };
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        strictEqual(oLaunchPageService.getCatalogData(oCatalog), oResult);
        ok(oLaunchPageAdapter.getCatalogData.calledOnce);
        ok(oLaunchPageAdapter.getCatalogData.calledWithExactly(oCatalog));
    });

    test("test countBookmarks", function () {
        var oActualPromise,
            oExpectedPromise = (new jQuery.Deferred()).promise(),
            oLaunchPageAdapter =  {
                countBookmarks: sinon.stub().returns(oExpectedPromise)
            },
            oLaunchPageService;

        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        throws(function () {
            oLaunchPageService.countBookmarks();
        }, /Missing URL/);
        throws(function () {
            oLaunchPageService.countBookmarks("");
        }, /Missing URL/);
        throws(function () {
            oLaunchPageService.countBookmarks({});
        }, /Missing URL/);
        ok(oLaunchPageAdapter.countBookmarks.notCalled);

        oActualPromise = oLaunchPageService.countBookmarks("###");

        strictEqual(oActualPromise, oExpectedPromise);
        ok(oLaunchPageAdapter.countBookmarks.calledOnce);
        strictEqual(oLaunchPageAdapter.countBookmarks.args[0][0], "###");
    });

    test("test deleteBookmarks", function () {
        var oActualPromise,
            oExpectedPromise = (new jQuery.Deferred()).promise(),
            oLaunchPageAdapter =  {
                deleteBookmarks: sinon.stub().returns(oExpectedPromise)
            },
            oLaunchPageService;

        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        throws(function () {
            oLaunchPageService.deleteBookmarks();
        }, /Missing URL/);
        throws(function () {
            oLaunchPageService.deleteBookmarks("");
        }, /Missing URL/);
        throws(function () {
            oLaunchPageService.deleteBookmarks({});
        }, /Missing URL/);
        ok(oLaunchPageAdapter.deleteBookmarks.notCalled);

        oActualPromise = oLaunchPageService.deleteBookmarks("###");

        strictEqual(oActualPromise, oExpectedPromise);
        ok(oLaunchPageAdapter.deleteBookmarks.calledOnce);
        strictEqual(oLaunchPageAdapter.deleteBookmarks.args[0][0], "###");
    });

    test("test updateBookmarks", function () {
        var oActualPromise,
            oExpectedPromise = (new jQuery.Deferred()).promise(),
            oLaunchPageAdapter =  {
                updateBookmarks: sinon.stub().returns(oExpectedPromise)
            },
            oLaunchPageService,
            oParameters = {
                url: "foo"
            };

        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        throws(function () {
            oLaunchPageService.updateBookmarks();
        }, /Missing URL/);
        throws(function () {
            oLaunchPageService.updateBookmarks("");
        }, /Missing URL/);
        throws(function () {
            oLaunchPageService.updateBookmarks({});
        }, /Missing URL/);
        throws(function () {
            oLaunchPageService.updateBookmarks("foo");
        }, /Missing parameters/);
        throws(function () {
            oLaunchPageService.updateBookmarks("foo", true);
        }, /Missing parameters/);
        ok(oLaunchPageAdapter.updateBookmarks.notCalled);

        oActualPromise = oLaunchPageService.updateBookmarks("###", oParameters);

        strictEqual(oActualPromise, oExpectedPromise);
        ok(oLaunchPageAdapter.updateBookmarks.calledOnce);
        strictEqual(oLaunchPageAdapter.updateBookmarks.args[0][0], "###");
        strictEqual(oLaunchPageAdapter.updateBookmarks.args[0][1], oParameters);
    });

    test("Tile actions", function () {
        var oTile = {},
            aInternalActions,
            aExternalActions1,
            aExternalActions2,
            oLaunchPageAdapter,
            oLaunchPageService;



        // part 1: no actions
        oLaunchPageAdapter = {};
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        deepEqual(oLaunchPageService.getTileActions(oTile), []);

        // part 2: internal actions
        aInternalActions = [{text: "InternalAction1"}, {text: "InternalAction2"}];
        oLaunchPageAdapter = {
            getTileActions : sinon.stub().returns(aInternalActions)
        };
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        deepEqual(oLaunchPageService.getTileActions(oTile), aInternalActions);
        ok(oLaunchPageAdapter.getTileActions.calledWithExactly(oTile));

        // part 3: external actions
        aExternalActions1 = [{text: "ExternalAction11"}, {text: "ExternalAction12"}];
        aExternalActions2 = [{text: "ExternalAction21"}, {text: "ExternalAction22"}];
        oLaunchPageAdapter = {};
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions1));
        oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions2));

        deepEqual(oLaunchPageService.getTileActions(oTile), aExternalActions1.concat(aExternalActions2));


        // part 4: internal and external actions
        aInternalActions = [{text: "InternalAction1"}, {text: "InternalAction2"}];
        oLaunchPageAdapter = {
            getTileActions : sinon.stub().returns(aInternalActions)
        };
        aExternalActions1 = [{text: "ExternalAction11"}, {text: "ExternalAction12"}];
        aExternalActions2 = [{text: "ExternalAction21"}, {text: "ExternalAction22"}];
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions1));
        oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions2));

        deepEqual(oLaunchPageService.getTileActions(oTile), aInternalActions.concat(aExternalActions1.concat(aExternalActions2)));

        ok(oLaunchPageAdapter.getTileActions.calledWithExactly(oTile));
    });

    asyncTest("getCatalogWithTranslation", function () {
        var oLaunchPageAdapter,
            oLaunchPageService,

        oLaunchPageAdapter = new sap.ushell.adapters.local.LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.getCatalogs().done(function (aCatalogs) {
            start();
            ok(aCatalogs[0].title === "Translated Catalog 1", "Group translation error for aCatalog[0].title");
            ok(aCatalogs[1].title === "Translated Catalog 2", "Group translation error for aCatalog[1].title");
        });
    });

    asyncTest("getGroupsWithTranslation", function () {
        var oLaunchPageAdapter,
            oLaunchPageService,

            oLaunchPageAdapter = new sap.ushell.adapters.local.LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.getGroups().done(function (aGroups) {
            start();
            ok(aGroups[0].title === "Translated Group 1", "Group translation error for aGroups[0].title");
            ok(aGroups[1].title === "Translated Group 2", "Group translation error for aGroups[1].title");
        });
    });

    asyncTest("getViewDataWithTranslation", function () {
        var oLaunchPageAdapter,
            oLaunchPageService,

            oLaunchPageAdapter = new sap.ushell.adapters.local.LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[0].tiles[0]).done(function (oView) {
            start();
            ok(oView.getProperty('title') === "Translated Header title", "Translated title check");
            ok(oView.getProperty('subtitle') === "Translated Sub Title", "Translated Sub Title");
            ok(oView.getProperty('info') === "Translated Info", "Translated Info");
            ok(oLaunchPageConfig.config.groups[0].tiles[0].keywords[0] === "Translated Keyword", "Translated keywords");
        });

    });

    asyncTest("getViewForLinks - Intent", function () {
        var oLaunchPageAdapter,
            oLaunchPageService,

            oLaunchPageAdapter = new sap.ushell.adapters.local.LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[0].tiles[2]).done(function (oView) {
            start();
            ok(oView.getTarget() === "", "Target should be empty in case url is an intent");
        });

    });

    asyncTest("getViewForLinks - External Link", function () {
        var oLaunchPageAdapter,
            oLaunchPageService,

            oLaunchPageAdapter = new sap.ushell.adapters.local.LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[0].tiles[3]).done(function (oView) {
            start();
            ok(oView.getTarget() === "_blank", "Target should be '_blank' in case url is an intent");
        });

    });

    asyncTest("getViewForComponentTile", function () {
        var oLaunchPageAdapter,
            oLaunchPageService,

            oLaunchPageAdapter = new sap.ushell.adapters.local.LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[2].tiles[0]).done(function (oTileUI) {
            start();
            ok(oTileUI.getMetadata().getName() === "sap.ui.core.ComponentContainer", "Module path registered and Component wrapped with ComponentContainer");
        });

    });

    asyncTest("getViewForViewTileTile", function () {
        var oLaunchPageAdapter,
            oLaunchPageService,

            oLaunchPageAdapter = new sap.ushell.adapters.local.LaunchPageAdapter(undefined, undefined, oLaunchPageConfig);
        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.getTileView(oLaunchPageConfig.config.groups[2].tiles[1]).done(function (oTileUI) {
            start();
            ok(oTileUI.getMetadata().getName() === "sap.ui.core.mvc.JSView", "Modelu path registered and View tile retreived");
        });

    });

}());
