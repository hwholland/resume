// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.components.flp.launchpad.ComponentKeysHandler
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */
    jQuery.sap.require("sap.ushell.components.flp.ComponentKeysHandler");
    jQuery.sap.require("sap.m.NavContainer");
    var oNavContainerFlp;
    module("sap.ushell.components.flp.ComponentKeysHandler", {
        setup: function () {
            oNavContainerFlp = new sap.m.NavContainer({
                id: "navContainerFlp",
                defaultTransitionName: 'show'
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oNavContainerFlp.destroy();
        }
    });


    test("create a new instance of ComponentKeysHandler Class", function () {
        var instance = sap.ushell.components.flp.ComponentKeysHandler;

        ok(instance, "create a new instance");
    });

    test("test both catalog and dashboard keyboard events", function () {
        var event = {
                "keyCode" : 32,
                preventDefault: function () {
                    return;
                }}, //space
            fSpaceButtonHandlerStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "spaceButtonHandler"),
            fHomeEndButtonsHandlerStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "homeEndButtonsHandler");

        sap.ushell.components.flp.ComponentKeysHandler.mainKeydownHandler(event);
        ok(fSpaceButtonHandlerStub.calledOnce, "spaceButtonHandler was called after pressing space button");

        event = {"keyCode" : 36}; //HOME
        sap.ushell.components.flp.ComponentKeysHandler.mainKeydownHandler(event);
        ok(fHomeEndButtonsHandlerStub.calledOnce, "HomeEndButtonsHandler was called after pressing space button");
        ok(fHomeEndButtonsHandlerStub.args[0][0] === "first", "spaceButtonHandler was called with the correct parameter");

        event = {"keyCode" : 35}; //END
        sap.ushell.components.flp.ComponentKeysHandler.mainKeydownHandler(event);
        ok(fHomeEndButtonsHandlerStub.calledTwice, "HomeEndButtonsHandler was called after pressing space button");
        ok(fHomeEndButtonsHandlerStub.args[1][0] === "last", "spaceButtonHandler was called with the correct parameter");

        fSpaceButtonHandlerStub.restore();
        fHomeEndButtonsHandlerStub.restore();
    });

    test("test dashboard keyboard events", function () {
        var event,
            fRenameGroupStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "renameGroup"),
            fGroupHeaderNavigationStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "groupHeaderNavigation"),
            fDeleteButtonHandlerStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "deleteButtonHandler"),
            fArrowsButtonsHandlerStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "arrowsButtonsHandler"),
            fGoToFirstTileOfSiblingGroupStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "goToFirstTileOfSiblingGroup");

        event = {"keyCode": 113}; //F2
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fRenameGroupStub.calledOnce, "renameGroup was called after pressing F2 button");

        event = {"keyCode": 118}; //F7
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fGroupHeaderNavigationStub.calledOnce, "groupHeaderNavigation was called after pressing F7 button");

        event = {"keyCode": 46}; //Delete
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fDeleteButtonHandlerStub.calledOnce, "deleteButtonHandler was called after pressing delete button");

        event = {"keyCode": 8}; //Backspace
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fDeleteButtonHandlerStub.calledTwice, "deleteButtonHandler was called after pressing backspace button");

        event = {"keyCode": 38}; //Arrow UP
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fArrowsButtonsHandlerStub.calledOnce, "arrowsButtonsHandler was called after pressing arrow up");
        ok(fArrowsButtonsHandlerStub.args[0][0] === "up", "arrowsButtonsHandler was called with 'up' parameter");

        event = {"keyCode": 40}; //Arrow DOWN
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fArrowsButtonsHandlerStub.calledTwice, "arrowsButtonsHandler was called after pressing arrow down");
        ok(fArrowsButtonsHandlerStub.args[1][0] === "down", "arrowsButtonsHandler was called with 'down' parameter");

        event = {"keyCode": 39}; //Arrow RIGHT
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fArrowsButtonsHandlerStub.calledThrice, "arrowsButtonsHandler was called after pressing arrow right");
        ok(fArrowsButtonsHandlerStub.args[2][0] === "right", "arrowsButtonsHandler was called with 'right' parameter");

        event = {"keyCode": 37}; //Arrow LEFT
        fArrowsButtonsHandlerStub.called = false;
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fArrowsButtonsHandlerStub.called, "arrowsButtonsHandler was called after pressing arrow left");
        ok(fArrowsButtonsHandlerStub.args[3][0] === "left", "arrowsButtonsHandler was called with 'left' parameter");

        event = {"keyCode": 33}; //Page UP
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fGoToFirstTileOfSiblingGroupStub.calledOnce, "goToFirstTileOfSiblingGroup was called after pressing page up");
        ok(fGoToFirstTileOfSiblingGroupStub.args[0][0] === "prev", "goToFirstTileOfSiblingGroup was called with 'prev' parameter");

        event = {"keyCode": 34}; //Page DOWN
        sap.ushell.components.flp.ComponentKeysHandler.dashboardKeydownHandler(event);
        ok(fGoToFirstTileOfSiblingGroupStub.calledTwice, "goToFirstTileOfSiblingGroup was called after pressing page down");
        ok(fGoToFirstTileOfSiblingGroupStub.args[1][0] === "next", "goToFirstTileOfSiblingGroup was called with 'next parameter");

        fRenameGroupStub.restore();
        fGroupHeaderNavigationStub.restore();
        fDeleteButtonHandlerStub.restore();
        fArrowsButtonsHandlerStub.restore();
        fGoToFirstTileOfSiblingGroupStub.restore();
    });

    test("test catalog keyboard events", function () {
        var event,
            fUpDownButtonsHandlerStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "upDownButtonsHandler"),
            fGoFromFocusedTileStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "goFromFocusedTile"),
            fGoToFirstTileOfSiblingGroupInCatalogStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "goToFirstTileOfSiblingGroupInCatalog");

        event = {"keyCode": 38}; //Arrow UP
        sap.ushell.components.flp.ComponentKeysHandler.catalogKeydownHandler(event);
        ok(fUpDownButtonsHandlerStub.calledOnce, "arrowsButtonsHandler was called after pressing arrow up");
        ok(fUpDownButtonsHandlerStub.args[0][0] === "up", "arrowsButtonsHandler was called with 'up' parameter");
        ok(fUpDownButtonsHandlerStub.args[0][1] === "catalog", "arrowsButtonsHandler was called with 'catalog' as page name parameter");

        event = {"keyCode": 40}; //Arrow DOWN
        sap.ushell.components.flp.ComponentKeysHandler.catalogKeydownHandler(event);
        ok(fUpDownButtonsHandlerStub.calledTwice, "arrowsButtonsHandler was called after pressing arrow down");
        ok(fUpDownButtonsHandlerStub.args[1][0] === "down", "arrowsButtonsHandler was called with 'down' parameter");
        ok(fUpDownButtonsHandlerStub.args[1][1] === "catalog", "arrowsButtonsHandler was called with 'catalog' as page name parameter");

        event = {"keyCode": 39}; //Arrow RIGHT
        sap.ushell.components.flp.ComponentKeysHandler.catalogKeydownHandler(event);
        ok(fGoFromFocusedTileStub.calledOnce, "goFromFocusedTile was called after pressing arrow right");
        ok(fGoFromFocusedTileStub.args[0][0] === "right", "goFromFocusedTile was called with 'right' parameter");
        ok(fGoFromFocusedTileStub.args[0][2] === "catalog", "fGoFromFocusedTileStub was called with 'catalog' as page name parameter");

        event = {"keyCode": 37}; //Arrow LEFT
        sap.ushell.components.flp.ComponentKeysHandler.catalogKeydownHandler(event);
        ok(fGoFromFocusedTileStub.calledTwice, "goFromFocusedTile was called after pressing arrow left");
        ok(fGoFromFocusedTileStub.args[1][0] === "left", "goFromFocusedTile was called with 'left' parameter");
        ok(fGoFromFocusedTileStub.args[1][2] === "catalog", "fGoFromFocusedTileStub was called with 'catalog' as page name parameter");

        event = {"keyCode": 33}; //Page UP
        sap.ushell.components.flp.ComponentKeysHandler.catalogKeydownHandler(event);
        ok(fGoToFirstTileOfSiblingGroupInCatalogStub.calledOnce, "goToFirstTileOfSiblingGroup was called after pressing page up");
        ok(fGoToFirstTileOfSiblingGroupInCatalogStub.args[0][0] === "prev", "goToFirstTileOfSiblingGroup was called with 'prev' parameter");

        event = {"keyCode": 34}; //Page DOWN
        sap.ushell.components.flp.ComponentKeysHandler.catalogKeydownHandler(event);
        ok(fGoToFirstTileOfSiblingGroupInCatalogStub.calledTwice, "goToFirstTileOfSiblingGroup was called after pressing page down");
        ok(fGoToFirstTileOfSiblingGroupInCatalogStub.args[1][0] === "next", "goToFirstTileOfSiblingGroup was called with 'next parameter");

        fUpDownButtonsHandlerStub.restore();
        fGoFromFocusedTileStub.restore();
        fGoToFirstTileOfSiblingGroupInCatalogStub.restore();
    });

    test("test handleShortcuts events", function () {
        var event = {"altKey" : true, "keyCode" : 67}, //'C'
            fHandleCatalogKeyStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "handleCatalogKey"),
            fHandleHomepageKeyStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "handleHomepageKey"),
            oModel = new sap.ui.model.json.JSONModel({
                personalization : true
            });
        sap.ushell.components.flp.ComponentKeysHandler.oModel = oModel;

        sap.ushell.components.flp.ComponentKeysHandler.handleShortcuts(event);
        ok(fHandleCatalogKeyStub.calledOnce, "handleCatalogKey was called after pressing alt+C buttons");

        event = {"altKey" : true, "keyCode" : 72}; //'H'
        sap.ushell.components.flp.ComponentKeysHandler.handleShortcuts(event);
        ok(fHandleHomepageKeyStub.calledOnce, "handleHomepageKey was called after pressing alt+H buttons");

        fHandleCatalogKeyStub.restore();
        fHandleHomepageKeyStub.restore();
    });

    test("test - handle different focus scenarios based on the initial focus position and the pressed keys", function () {
        var event = {"shiftKey" : true},
            fMainKeydownHandlerStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "mainKeydownHandler"),
            fDashboardKeydownHandlerStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "dashboardKeydownHandler"),
            fCatalogKeydownHandlerStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "catalogKeydownHandler"),
            fGoToTileContainerStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "goToTileContainer"),
            fGoToFirstAnchorNavigationItemStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "goToFirstAnchorNavigationItem"),
            fGoToFirstCatalogTileStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "goToFirstCatalogTile"),
            fGoToFirstCatalogHeaderItemStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "goToFirstCatalogHeaderItem"),
            oModel = new sap.ui.model.json.JSONModel({
                currentViewName : "home"
            }),
            bFocusPassedFirstTime = true;
        oNavContainerFlp.getCurrentPage = function () {
            return {
                getViewName : function () {
                    return "sap.ushell.components.flp.launchpad.dashboard.DashboardContent";
                }
            };
        }
        sap.ushell.components.flp.ComponentKeysHandler.oModel = oModel;

        sap.ushell.components.flp.ComponentKeysHandler.handleFocusOnMe(event, bFocusPassedFirstTime);
        ok(fGoToTileContainerStub.calledOnce, "focus should be on dashboard tile container");

        event = {"shiftKey" : false};
        sap.ushell.components.flp.ComponentKeysHandler.handleFocusOnMe(event, bFocusPassedFirstTime);
        ok(fGoToFirstAnchorNavigationItemStub.calledOnce, "focus should be on dashboard first anchor navigation item");

        bFocusPassedFirstTime = false;
        sap.ushell.components.flp.ComponentKeysHandler.handleFocusOnMe(event, bFocusPassedFirstTime);
        ok(fMainKeydownHandlerStub.calledOnce, "focus should be handled by the main handler");
        ok(fDashboardKeydownHandlerStub.calledOnce, "focus should be handled by the dashboard handler");

        oNavContainerFlp.getCurrentPage = function () {
            return {
                getViewName : function () {
                    return "sap.ushell.components.flp.launchpad.appfinder.AppFinder";
                },
                getController: function () {
                    return {
                        getCurrentMenuName: function () {
                            return 'catalog';
                        }
                    };
                }
            };
        }
        bFocusPassedFirstTime = true;
        event = {"shiftKey" : true};
        sap.ushell.components.flp.ComponentKeysHandler.handleFocusOnMe(event, bFocusPassedFirstTime);
        ok(fGoToFirstCatalogTileStub.calledOnce, "focus should be on catalog tile");

        event = {"shiftKey" : false};
        sap.ushell.components.flp.ComponentKeysHandler.handleFocusOnMe(event, bFocusPassedFirstTime);
        ok(fGoToFirstCatalogHeaderItemStub.calledOnce, "focus should be on catalog header");

        bFocusPassedFirstTime = false;
        sap.ushell.components.flp.ComponentKeysHandler.handleFocusOnMe(event, bFocusPassedFirstTime);
        ok(fMainKeydownHandlerStub.calledTwice, "focus should be handled by the main handler");
        ok(fCatalogKeydownHandlerStub.calledOnce, "focus should be handled by the catalog handler");

        fMainKeydownHandlerStub.restore();
        fDashboardKeydownHandlerStub.restore();
        fCatalogKeydownHandlerStub.restore();
        fGoToTileContainerStub.restore();
        fGoToFirstAnchorNavigationItemStub.restore();
        fGoToFirstCatalogTileStub.restore();
        fGoToFirstCatalogHeaderItemStub.restore();
    });

    var _fnAnchorArrowNavigationTestHelper = function (sDirection, bIsRTL, sExpectedFocusedElementId) {
        var fnGetRtlStub = sinon.stub(sap.ui, 'getCore').returns({
                getConfiguration: function (){
                    return {
                        getRTL: function () {
                            return bIsRTL;
                        }
                    };
                }
            }),
            jqAnchorItem1 = jQuery('<div id="jqAnchorItem1" class="sapUshellAnchorItem"  tabindex="0" style="height: 1rem;width: 0;">')
                .appendTo('body'),
            jqAnchorItem2 = jQuery('<div id="jqAnchorItem2" class="sapUshellAnchorItem" tabindex="0" style="height: 1rem;width: 0;">')
                .appendTo('body'),
            jqAnchorItem3 = jQuery('<div id="jqAnchorItem3" class="sapUshellAnchorItem" tabindex="0" style="height: 1rem;width: 0;">')
                .appendTo('body'),
            jqFocused;

        jqAnchorItem2.focus();
        sap.ushell.components.flp.ComponentKeysHandler.handleAnchorNavigationItemsArrowKeys(sDirection);
        jqFocused = jQuery(document.activeElement);
        ok(jqFocused.attr('id') === sExpectedFocusedElementId, 'The focus has been moved to the: ' + sDirection);

        fnGetRtlStub.restore();
        jQuery(jqAnchorItem1).remove();
        jQuery(jqAnchorItem2).remove();
        jQuery(jqAnchorItem3).remove();
    };

    test('test right-arrow navigation between Anchor Navigation items', function () {
        _fnAnchorArrowNavigationTestHelper('right', false, 'jqAnchorItem3');
    });

    test('test left-arrow navigation between Anchor Navigation items', function () {
        _fnAnchorArrowNavigationTestHelper('left', false, 'jqAnchorItem1');
    });

    test('test right-arrow navigation between Anchor Navigation items in RTL', function () {
        _fnAnchorArrowNavigationTestHelper('right', true, 'jqAnchorItem1');
    });

    test('test left-arrow navigation between Anchor Navigation items in RTL', function () {
        _fnAnchorArrowNavigationTestHelper('left', true, 'jqAnchorItem3');
    });

    test("test getNumberOfTileInRow in the catalog", function () {
        var catalog = jQuery('<div id="catalogTiles">').appendTo('body'),
            catalogContainer = jQuery('<div class="sapUshellTileContainerContent" style="width: 40rem; height: 30rem">').appendTo(catalog),
            tile1 = jQuery('<div class="sapUshellTile" style="height: 10.875rem;width: 11.375rem;">')
                .appendTo(catalogContainer),
            tile2 = jQuery('<div class="sapUshellTile" style="height: 10.875rem;width: 11.375rem;">')
                .appendTo(catalogContainer),
            tile3 = jQuery('<div class="sapUshellTile" style="height: 10.875rem;width: 11.375rem;">')
                .appendTo(catalogContainer),
            numOfTileInLine,
            bIsLink = false;

        numOfTileInLine = sap.ushell.components.flp.ComponentKeysHandler.getNumberOfTileInRow("catalog", bIsLink);
        ok(numOfTileInLine === 3, "the expected number of tiles in a line is 3. actual value is " + numOfTileInLine);

        catalogContainer.width("75rem");
        numOfTileInLine = sap.ushell.components.flp.ComponentKeysHandler.getNumberOfTileInRow("catalog", bIsLink);
        ok(numOfTileInLine === 6, "the expected number of tiles in a line is 6. actual value is " + numOfTileInLine);

        jQuery(tile1).remove();
        jQuery(tile2).remove();
        jQuery(tile3).remove();
        jQuery(catalog).remove();
        jQuery(catalogContainer).remove();
    });

    test("test getNumberOfTileInRow in the dashboard", function () {
        var dashboard = jQuery('<div id="dashboardGroups" style="width: 40rem; height: 30rem">').appendTo('body'),
            tile1 = jQuery('<div class="sapUshellTile" style="height: 10.875rem;width: 11.375rem;">')
                .appendTo(dashboard),
            tile2 = jQuery('<div class="sapUshellTile" style="height: 10.875rem;width: 11.375rem;">')
                .appendTo(dashboard),
            tile3 = jQuery('<div class="sapUshellTile" style="height: 10.875rem;width: 11.375rem;">')
                .appendTo(dashboard),
            numOfTileInLine,
            bIsLink = false;

        numOfTileInLine = sap.ushell.components.flp.ComponentKeysHandler.getNumberOfTileInRow("dashboard", bIsLink);
        ok(numOfTileInLine === 3, "the expected number of tiles in a line is 3. actual value is " + numOfTileInLine);

        dashboard.width("75rem");
        numOfTileInLine = sap.ushell.components.flp.ComponentKeysHandler.getNumberOfTileInRow("dashboard", bIsLink);
        ok(numOfTileInLine === 6, "the expected number of tiles in a line is 6. actual value is " + numOfTileInLine);

        jQuery(tile1).remove();
        jQuery(tile2).remove();
        jQuery(tile3).remove();
        jQuery(dashboard).remove();
    });

    test("test getNumberOfTileInRow in the dashboard with links", function () {
        var dashboard = jQuery('<div id="dashboardGroups" style="width: 45rem; height: 30rem">').appendTo('body'),
            tile1 = jQuery('<div class="sapUshellLinkTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            tile2 = jQuery('<div class="sapUshellLinkTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            tile3 = jQuery('<div class="sapUshellLinkTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            numOfTileInLine,
            bIsLink = true;

        numOfTileInLine = sap.ushell.components.flp.ComponentKeysHandler.getNumberOfTileInRow("dashboard", bIsLink);
        ok(numOfTileInLine === 2, "the expected number of tiles in a line is 2. actual value is " + numOfTileInLine);

        dashboard.width("90rem");
        numOfTileInLine = sap.ushell.components.flp.ComponentKeysHandler.getNumberOfTileInRow("dashboard", bIsLink);
        ok(numOfTileInLine === 4, "the expected number of tiles in a line is 4. actual value is " + numOfTileInLine);

        jQuery(tile1).remove();
        jQuery(tile2).remove();
        jQuery(tile3).remove();
        jQuery(dashboard).remove();
    });

    test("test - go to first tile in top tilecontainer or to the last visited tile in the top tilecontainer", function () {
        var dashboard = jQuery('<div id="dashboardGroups" style="width: 45rem; height: 30rem">').appendTo('body'),
            tileContainer = jQuery('<div class="sapUshellTileContainer">').appendTo(dashboard),
            tile1 = jQuery('<div id="tile1" class="sapUshellTile" style="height: 2rem;width: 22.375rem;visibility: visible">')
                .appendTo(tileContainer),
            tile2 = jQuery('<div id="tile2" class="sapUshellTile" style="height: 2rem;width: 22.375rem;visibility: visible">')
                .appendTo(tileContainer),
            tile3 = jQuery('<div id="tile3" class="sapUshellLinkTile" style="height: 2rem;width: 22.375rem;visibility: visible">')
                .appendTo(tileContainer),
            oModel = new sap.ui.model.json.JSONModel({
                topGroupInViewPortIndex : 0
            }),
            setTileFocusStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "setTileFocus"),
            bGoToFirstOrLastTileInSelectedGroup = true;

        sap.ushell.components.flp.ComponentKeysHandler.oModel = oModel;
        sap.ushell.components.flp.ComponentKeysHandler.goToEdgeTile("first", bGoToFirstOrLastTileInSelectedGroup);
        ok(setTileFocusStub.callCount === 1, "setTileFocus was called" );
        ok(setTileFocusStub.args[0][0].attr("id") === "tile1", "the expected tile to get the focus is 'tile1'. " +
            "actual focus is on " + setTileFocusStub.args[0][0].attr("id"));

        bGoToFirstOrLastTileInSelectedGroup = false; // go to last visited tile
        jQuery("#tile2").attr("tabindex", 0);
        sap.ushell.components.flp.ComponentKeysHandler.goToEdgeTile("first", bGoToFirstOrLastTileInSelectedGroup);
        ok(setTileFocusStub.callCount === 2, "setTileFocus was called" );
        ok(setTileFocusStub.args[1][0].attr("id") === "tile2", "the expected tile to get the focus is 'tile2'. " +
            "actual focus is on " + setTileFocusStub.args[1][0].attr("id"));

        jQuery("#tile2").removeAttr("tabindex");
        jQuery("#tile3").attr("tabindex", 0);
        sap.ushell.components.flp.ComponentKeysHandler.goToEdgeTile("first", bGoToFirstOrLastTileInSelectedGroup);
        ok(setTileFocusStub.callCount === 3, "setTileFocus was called" );
        ok(setTileFocusStub.args[2][0].attr("id") === "tile3", "the expected tile to get the focus is 'tile3'. " +
            "actual focus is on " + setTileFocusStub.args[2][0].attr("id"));

        jQuery(tile1).remove();
        jQuery(tile2).remove();
        jQuery(tile3).remove();
        jQuery(tileContainer).remove();
        jQuery(dashboard).remove();
        setTileFocusStub.restore();
    });

    test("test - go to first visible tilecontainer in the viewport", function () {
        var dashboard = jQuery('<div id="dashboardGroups" style="width: 45rem; height: 30rem">').appendTo('body'),
            tileContainer1 = jQuery('<div id="tileContainer1" class="sapUshellTileContainer">').appendTo(dashboard),
            tileContainer2 = jQuery('<div id="tileContainer2" class="sapUshellTileContainer">').appendTo(dashboard),
            tileContainer3 = jQuery('<div id="tileContainer3" class="sapUshellTileContainer">').appendTo(dashboard),
            tileContainer4 = jQuery('<div id="tileContainer4" class="sapUshellTileContainer">').appendTo(dashboard),
            oModel = new sap.ui.model.json.JSONModel({
                topGroupInViewPortIndex : 0
            }),
            setTileContainerSelectiveFocusStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "setTileContainerSelectiveFocus");

        sap.ushell.components.flp.ComponentKeysHandler.oModel = oModel;
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstVisibleTileContainer();
        ok(setTileContainerSelectiveFocusStub.callCount === 1, "setTileContainerSelectiveFocusStub was called" );
        ok(setTileContainerSelectiveFocusStub.args[0][0].attr("id") === "tileContainer1", "the expected tile to get the focus is 'tileContainer1'. " +
            "actual focus is on " + setTileContainerSelectiveFocusStub.args[0][0].attr("id"));

        oModel.setProperty("/topGroupInViewPortIndex", 1);
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstVisibleTileContainer();
        ok(setTileContainerSelectiveFocusStub.callCount === 2, "setTileContainerSelectiveFocusStub was called" );
        ok(setTileContainerSelectiveFocusStub.args[1][0].attr("id") === "tileContainer2", "the expected tile to get the focus is 'tileContainer2'. " +
            "actual focus is on " + setTileContainerSelectiveFocusStub.args[1][0].attr("id"));

        oModel.setProperty("/topGroupInViewPortIndex", 3);
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstVisibleTileContainer();
        ok(setTileContainerSelectiveFocusStub.callCount === 3, "setTileContainerSelectiveFocusStub was called" );
        ok(setTileContainerSelectiveFocusStub.args[2][0].attr("id") === "tileContainer4", "the expected tile to get the focus is 'tileContainer4'. " +
            "actual focus is on " + setTileContainerSelectiveFocusStub.args[2][0].attr("id"));

        oModel.setProperty("/topGroupInViewPortIndex", 10);
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstVisibleTileContainer();
        ok(setTileContainerSelectiveFocusStub.callCount === 3, "setTileContainerSelectiveFocusStub was not called because there is no tileContainer " +
            "in index 10 - bad input" );

        jQuery(tileContainer1).remove();
        jQuery(tileContainer2).remove();
        jQuery(tileContainer3).remove();
        jQuery(tileContainer4).remove();
        jQuery(dashboard).remove();
        setTileContainerSelectiveFocusStub.restore();
    });

    test("test go to first tile in next / prev group in dashboard", function () {
        var dashboard = jQuery('<div id="dashboardGroups" style="width: 45rem; height: 30rem">').appendTo('body'),
            tileContainer1 = jQuery('<div class="sapUshellDashboardGroupsContainerItem">').appendTo(dashboard),
            tile11 = jQuery('<div id="tile11" class="sapUshellTile" style="height: 2rem;width: 22.375rem;" tabindex="0">')
                .appendTo(tileContainer1),
            tile12 = jQuery('<div id="tile12" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(tileContainer1),
            tile13 = jQuery('<div id="tile13" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(tileContainer1),
            tileContainer2 = jQuery('<div class="sapUshellDashboardGroupsContainerItem">').appendTo(dashboard),
            tile21 = jQuery('<div id="tile21" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(tileContainer2),
            tile22 = jQuery('<div id="tile22" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(tileContainer2),
            tile23 = jQuery('<div id="tile23" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(tileContainer2),
            tileContainer3 = jQuery('<div class="sapUshellDashboardGroupsContainerItem">').appendTo(dashboard),
            tile31 = jQuery('<div id="tile31" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(tileContainer3),
            tile32 = jQuery('<div id="tile32" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(tileContainer3),
            tile33 = jQuery('<div id="tile33" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(tileContainer3),
            e = jQuery.Event("keyup"),
            moveScrollDashboardStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "moveScrollDashboard");

        tile11.focus();

        sap.ushell.components.flp.ComponentKeysHandler.goToFirstTileOfSiblingGroup("next", e);
        ok(moveScrollDashboardStub.callCount === 1, "moveScrollDashboard was called");
        ok(moveScrollDashboardStub.args[0][0].attr("id") === "tile21", "the expected tile to get the focus is 'tile21'. " +
            "actual focus is on " + moveScrollDashboardStub.args[0][0].attr("id"));

        jQuery("#tile11").removeAttr("tabindex");
        jQuery("#tile21").attr("tabindex", 0);
        tile21.focus();
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstTileOfSiblingGroup("next", e);
        ok(moveScrollDashboardStub.callCount === 2, "moveScrollDashboard was called");
        ok(moveScrollDashboardStub.args[1][0].attr("id") === "tile31", "the expected tile to get the focus is 'tile31'. " +
            "actual focus is on " + moveScrollDashboardStub.args[1][0].attr("id"));

        jQuery("#tile21").removeAttr("tabindex");
        jQuery("#tile31").attr("tabindex", 0);
        tile31.focus();
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstTileOfSiblingGroup("next", e);
        ok(moveScrollDashboardStub.callCount === 3, "moveScrollDashboard was called");
        ok(moveScrollDashboardStub.args[2][0].attr("id") === "tile33", "the expected tile to get the focus is 'tile33'. " +
            "actual focus is on " + moveScrollDashboardStub.args[2][0].attr("id"));

        jQuery("#tile31").removeAttr("tabindex");
        jQuery("#tile33").attr("tabindex", 0);
        tile33.focus();
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstTileOfSiblingGroup("prev", e);
        ok(moveScrollDashboardStub.callCount === 4, "moveScrollDashboard was called");
        ok(moveScrollDashboardStub.args[3][0].attr("id") === "tile21", "the expected tile to get the focus is 'tile21'. " +
            "actual focus is on " + moveScrollDashboardStub.args[3][0].attr("id"));

        jQuery(tileContainer1).remove();
        jQuery(tile11).remove();
        jQuery(tile12).remove();
        jQuery(tile13).remove();
        jQuery(tileContainer2).remove();
        jQuery(tile21).remove();
        jQuery(tile22).remove();
        jQuery(tile23).remove();
        jQuery(tileContainer3).remove();
        jQuery(tile31).remove();
        jQuery(tile32).remove();
        jQuery(tile33).remove();
        jQuery(dashboard).remove();
        moveScrollDashboardStub.restore();
    });

    test("test go to first tile in next / prev group in catalog", function () {
        var dashboard = jQuery('<div id="dashboardGroups" style="width: 45rem; height: 30rem">').appendTo('body'),
            header1 = jQuery('<h3 class="sapUshellHeaderTile"></h3>').appendTo(dashboard),
            tile11 = jQuery('<div id="tile11" class="sapUshellTile" style="height: 2rem;width: 22.375rem;" tabindex="0">')
                .appendTo(dashboard),
            tile12 = jQuery('<div id="tile12" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            tile13 = jQuery('<div id="tile13" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            header2 = jQuery('<h3 class="sapUshellHeaderTile"></h3>').appendTo(dashboard),
            tile21 = jQuery('<div id="tile21" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            tile22 = jQuery('<div id="tile22" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            tile23 = jQuery('<div id="tile23" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            header3 = jQuery('<h3 class="sapUshellHeaderTile"></h3>').appendTo(dashboard),
            tile31 = jQuery('<div id="tile31" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            tile32 = jQuery('<div id="tile32" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            tile33 = jQuery('<div id="tile33" class="sapUshellTile" style="height: 2rem;width: 22.375rem;">')
                .appendTo(dashboard),
            e = jQuery.Event("keyup"),
            moveScrollCatalogStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "moveScrollCatalog"),
            setTileFocusStub = sinon.stub(sap.ushell.components.flp.ComponentKeysHandler, "setTileFocus");

        tile11.focus();

        sap.ushell.components.flp.ComponentKeysHandler.goToFirstTileOfSiblingGroupInCatalog("next", e);
        ok(moveScrollCatalogStub.callCount === 1, "moveScrollCatalog was called");
        ok(setTileFocusStub.args[0][0].attr("id") === "tile21", "the expected tile to get the focus is 'tile21'. " +
            "actual focus is on " + setTileFocusStub.args[0][0].attr("id"));

        jQuery("#tile11").removeAttr("tabindex");
        jQuery("#tile21").attr("tabindex", 0);
        tile21.focus();
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstTileOfSiblingGroupInCatalog("next", e);
        ok(moveScrollCatalogStub.callCount === 2, "moveScrollCatalog was called");
        ok(setTileFocusStub.args[1][0].attr("id") === "tile31", "the expected tile to get the focus is 'tile31'. " +
            "actual focus is on " + setTileFocusStub.args[1][0].attr("id"));

        jQuery("#tile21").removeAttr("tabindex");
        jQuery("#tile31").attr("tabindex", 0);
        tile31.focus();
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstTileOfSiblingGroupInCatalog("next", e);
        ok(moveScrollCatalogStub.callCount === 3, "moveScrollCatalog was called");
        ok(setTileFocusStub.args[2][0].attr("id") === "tile33", "the expected tile to get the focus is 'tile33'. " +
            "actual focus is on " + setTileFocusStub.args[2][0].attr("id"));

        jQuery("#tile31").removeAttr("tabindex");
        jQuery("#tile33").attr("tabindex", 0);
        tile33.focus();
        sap.ushell.components.flp.ComponentKeysHandler.goToFirstTileOfSiblingGroupInCatalog("prev", e);
        ok(moveScrollCatalogStub.callCount === 4, "moveScrollCatalog was called");
        ok(setTileFocusStub.args[3][0].attr("id") === "tile21", "the expected tile to get the focus is 'tile21'. " +
            "actual focus is on " + setTileFocusStub.args[3][0].attr("id"));

        jQuery(header1).remove();
        jQuery(tile11).remove();
        jQuery(tile12).remove();
        jQuery(tile13).remove();
        jQuery(header2).remove();
        jQuery(tile21).remove();
        jQuery(tile22).remove();
        jQuery(tile23).remove();
        jQuery(header3).remove();
        jQuery(tile31).remove();
        jQuery(tile32).remove();
        jQuery(tile33).remove();
        jQuery(dashboard).remove();
        moveScrollCatalogStub.restore();
        setTileFocusStub.restore();
    });
}());
