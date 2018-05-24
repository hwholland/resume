// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.m.Button");

    var stub,
        bIsPhone = sap.ui.Device.system.phone,
        oTileContainer,
        oGroupHeaderActionPanel,
        groupHeaderActionData = {
    			content : [],
    			tileActionModeActive : true,
    			isOverflow : false
            },
        testContainer,
        demiItemData = {
            showHeader : false,
            showPlaceholder : false,
            showGroupHeader : true,
            groupHeaderLevel : sap.m.HeaderLevel.H3,
            showNoData : true,
            tiles : {}
        },
        _prepareTileContainerHeaderActions = function (bShowHeader, bShowMobileHeaderActionsBtn, bAddHeaderActions, bMockPhone) {
            sap.ui.Device.system.phone = bMockPhone;
            if (bAddHeaderActions) {
                var aHeaderActions = [
                    new sap.m.Button('headerActionBtn1', {text: 'headerActionBtn1'}),
                    new sap.m.Button('headerActionBtn2', {text: 'headerActionBtn2'})
                ];
                oGroupHeaderActionPanel.addContent(aHeaderActions[0]);
                oGroupHeaderActionPanel.addContent(aHeaderActions[1]);
                oTileContainer.addHeaderAction(oGroupHeaderActionPanel);
            }
            oGroupHeaderActionPanel.setIsOverflow(bMockPhone)
            oGroupHeaderActionPanel.setTileActionModeActive(bShowMobileHeaderActionsBtn);
            oTileContainer.setShowHeader(bShowHeader);
            oTileContainer.setShowMobileActions(bShowMobileHeaderActionsBtn);
            oTileContainer.placeAt('testContainer');
        },
        _prepareTileContainerEditFlags = function (bEditMode, bIsGroupLocked, bIsDefaultGroup, bIsTileActionModeActive) {
            oTileContainer.setShowHeader(true);
            oTileContainer.setEditMode(bEditMode);
            oTileContainer.setIsGroupLocked(bIsGroupLocked);
            oTileContainer.setDefaultGroup(bIsDefaultGroup);
            oTileContainer.setTileActionModeActive(bIsTileActionModeActive);
            oTileContainer.placeAt('testContainer');
        },
        _prepareTileContainerBeforeContent = function (bAddBeforeContent) {
            if (bAddBeforeContent) {
                var oBeforeContentBtn = new sap.m.Button('beforeContentBtn', {text: 'beforeContentBtn'});
                oTileContainer.addBeforeContent(oBeforeContentBtn);
            }
            oTileContainer.setShowHeader(true);
            oTileContainer.placeAt('testContainer');
        };


    module("sap.ushell.ui.launchpad.TileContainer", {
        setup: function () {
            //sinon.stub(sap.ushell.ui.launchpad.TileContainer.prototype.addNewItem, function (elem) { return true; });
            //stub = sinon.stub(sap.ushell.ui.launchpad.TileContainer, "addNewItem").callsArgWith(1, {}).returns({});
            //var mock = sinon.mock(sap.ushell.ui.launchpad.TileContainer);
            //mock.expects("addNewItem").once().callsArgWith(1, {}).returns({});
            //mock.verify();
            sap.ushell.bootstrap("local");
            oTileContainer = new sap.ushell.ui.launchpad.TileContainer(demiItemData);
            oGroupHeaderActionPanel = new sap.ushell.ui.launchpad.GroupHeaderActions(groupHeaderActionData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');

            jQuery.sap.getObject('sap.ushell.components.flp.ActionMode', 0);//'0' - Create object if such doesn't exist.
            if (sap.ushell.components.flp.ActionMode.activateGroupEditMode) {
                stub = sinon.stub(sap.ushell.components.flp.ActionMode, 'activateGroupEditMode');
            } else {
                sap.ushell.components.flp.ActionMode.activateGroupEditMode = function () {};
            }
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            if (stub) {
                stub.restore();
            }
            sap.ui.Device.system.phone = bIsPhone;
            oTileContainer.destroy();
            oGroupHeaderActionPanel.destroy();
            jQuery(testContainer).remove();
            delete sap.ushell.Container;
        }
    });


    var elementsToDisplayMock = [
        {
            getPath : function () {
                return "path 1";
            }
        },
        {
            getPath : function () {
                return "path 3";
            }
        },
        {
            getPath : function () {
                return "path 4";
            }
        },
        {
            getPath : function () {
                return "path 5";
            }
        },
        {
            getPath : function () {
                return "path 6";
            }
        },
        {
            getPath : function () {
                return "path 40";
            }
        }
    ];
    var onscreenElementsMock = [{
        getHeaderText : function () {
            return "header 1";
        }
    },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 1";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 2";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 3";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 4";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 5";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 6";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 7";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 8";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 9";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 10";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 11";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 12";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 13";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 14";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 15";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 16";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 17";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 18";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 19";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 20";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 21";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 22";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 23";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 24";
                    }
                };
            }
        },
        {
            getHeaderText : function () {
                return "header 2";
            }
        },
        {
            getHeaderText : function () {
                return "header 3";
            }
        },
        {
            getHeaderText : function () {
                return "header 4";
            }
        },
        {
            getHeaderText : function () {
                return "header 5";
            }
        }];

    var aSortersMock = [{
        fnGroup : function (elemToDisplay) {
            return "Test Group";
        }
    }];
    var oBindingInfoMock = [];

    test("TileContainer index on screen elements", function () {
        var item = new sap.ushell.ui.launchpad.TileContainer("catalogTiles1", demiItemData);
        var indexingMaps = item.indexOnScreenElements(onscreenElementsMock);
        ok(indexingMaps.onScreenHeaders['header 1'].aItemsRefrenceIndex === 0, "header 1");
        ok(indexingMaps.onScreenPathIndexMap['path 1'].aItemsRefrenceIndex === 1, "element path 1");
        ok(indexingMaps.onScreenPathIndexMap['path 2'].aItemsRefrenceIndex === 2, "element path 2");
        ok(indexingMaps.onScreenPathIndexMap['path 3'].aItemsRefrenceIndex === 3, "element path 3");
        ok(indexingMaps.onScreenPathIndexMap['path 4'].aItemsRefrenceIndex === 4, "element path 4");
        ok(indexingMaps.onScreenPathIndexMap['path 5'].aItemsRefrenceIndex === 5, "element path 5");
        ok(indexingMaps.onScreenPathIndexMap['path 6'].aItemsRefrenceIndex === 6, "element path 6");
        ok(indexingMaps.onScreenPathIndexMap['path 7'].aItemsRefrenceIndex === 7, "element path 7");
        ok(indexingMaps.onScreenPathIndexMap['path 8'].aItemsRefrenceIndex === 8, "element path 8");
        ok(indexingMaps.onScreenPathIndexMap['path 9'].aItemsRefrenceIndex === 9, "element path 9");
        ok(indexingMaps.onScreenPathIndexMap['path 10'].aItemsRefrenceIndex === 10, "element path 10");
        ok(indexingMaps.onScreenPathIndexMap['path 11'].aItemsRefrenceIndex === 11, "element path 11");
        ok(indexingMaps.onScreenPathIndexMap['path 12'].aItemsRefrenceIndex === 12, "element path 12");
        ok(indexingMaps.onScreenPathIndexMap['path 13'].aItemsRefrenceIndex === 13, "element path 13");
        ok(indexingMaps.onScreenHeaders['header 2'].aItemsRefrenceIndex === 25, "header 1");
        ok(indexingMaps.onScreenHeaders['header 3'].aItemsRefrenceIndex === 26, "header 1");
        ok(indexingMaps.onScreenHeaders['header 4'].aItemsRefrenceIndex === 27, "header 1");
        ok(indexingMaps.onScreenHeaders['header 5'].aItemsRefrenceIndex === 28, "header 1");
        item.destroy();
    });

    test("Mark visible on screen elements", function () {
        var item = new sap.ushell.ui.launchpad.TileContainer("catalogTiles2", demiItemData);
        var indexingMaps = item.indexOnScreenElements(onscreenElementsMock);
        var onScreenElem = {};
        item.markVisibleOnScreenElements(elementsToDisplayMock, indexingMaps);
        ok(indexingMaps.onScreenPathIndexMap['path 1'].isVisible === true, "path 1 visible");
        ok(indexingMaps.onScreenPathIndexMap['path 2'].isVisible === false, "path 2 not visible");
        ok(indexingMaps.onScreenPathIndexMap['path 3'].isVisible === true, "path 2 visible");
        item.destroy();
    });

    test("Create Missing Elements In OnScreen Elements", function () {
        var item = new sap.ushell.ui.launchpad.TileContainer("catalogTiles3", demiItemData);
        var indexingMaps = item.indexOnScreenElements(onscreenElementsMock);
        var lastFilteredItem = item.markVisibleOnScreenElements(elementsToDisplayMock, indexingMaps);
        item.createMissingElementsInOnScreenElements(indexingMaps, elementsToDisplayMock, lastFilteredItem, true, aSortersMock, oBindingInfoMock, function () {}, function () {});
        ok(indexingMaps.onScreenPathIndexMap['path 40'].isVisible === true, "path 40 created");
        item.destroy();
    });

    var _addHeaderActionsAggregationTestHelper = function (bExpectHeaderClassAdded, bExpectHeaderActionsButtonAdded, bExpectHeaderActionsAdded) {
        setTimeout(function () {
            start();
            var bSapHeaderActionsClassAdded = testContainer.find('.sapUshellContainerHeaderActions').length > 0,
                bHeaderActionsButtonAdded = testContainer.find('.sapUshellHeaderActionButton').length > 0,
                bHeaderActionsAdded = (testContainer.find('#headerActionBtn1').length && testContainer.find('#headerActionBtn2').length) > 0;

            if (typeof bExpectHeaderClassAdded !== 'undefined') {
                ok(bSapHeaderActionsClassAdded === bExpectHeaderClassAdded, 'Header Actions class:sapUshellContainerHeaderActions is added ');
            }
            if (typeof bExpectHeaderActionsButtonAdded !== 'undefined') {
                ok(bHeaderActionsButtonAdded === bExpectHeaderActionsButtonAdded, 'Header actions mobile button added');
            }
            if (typeof bExpectHeaderActionsAdded !== 'undefined') {
                ok(bHeaderActionsAdded === bExpectHeaderActionsAdded, 'Both header actions added');
            }
        }, 0);

    };

    asyncTest("Add header Actions aggregation - non mobile scenario test", function () {
        _prepareTileContainerHeaderActions(true, true, true, false);
        _addHeaderActionsAggregationTestHelper(true, undefined, true);
    });

    asyncTest("Add header Actions aggregation test - mobile  scenario test", function () {
        _prepareTileContainerHeaderActions(true, true, true, true);
        _addHeaderActionsAggregationTestHelper(true, true, false);
    });

    asyncTest("Add header Actions aggregation when showMobileActions is false - mobile  scenario test", function () {
        _prepareTileContainerHeaderActions(true, false, true, true);
        _addHeaderActionsAggregationTestHelper(undefined, false, false);
    });

    asyncTest("Add header Actions aggregation when showHeader is false test", function () {
        _prepareTileContainerHeaderActions(false, true, true, true);
        _addHeaderActionsAggregationTestHelper(false, false, false);
    });

    asyncTest("Add header Actions aggregation when showMobileActions is false - non mobile scenario", function () {
        _prepareTileContainerHeaderActions(true, false, true, false);
        _addHeaderActionsAggregationTestHelper(true, false, false);
    });

    asyncTest("No header Actions aggregation test - mobile scenario", function () {
        _prepareTileContainerHeaderActions(true, true, false, true);
        _addHeaderActionsAggregationTestHelper(true, false, false);
    });

    asyncTest("No header Actions aggregation when showMobileActions is true - mobile scenario", function () {
        _prepareTileContainerHeaderActions(true, true, false, false);
        _addHeaderActionsAggregationTestHelper(true, false, false);
    });

    var _tileContainerTitleSimulateClickTestHelper = function (bExpectInputFieldBeforeClick, bExpectInputFieldAfterClick) {
        setTimeout(function () {
            var bInputFieldBeforeClick = testContainer.find('.sapUshellTileContainerTitleInput').length > 0,
                jqTileContainerTitle = testContainer.find('.sapUshellContainerTitle');

            jqTileContainerTitle.trigger('click');
            setTimeout(function () {
                start();
                var bInputFieldAfterClick = testContainer.find('.sapUshellTileContainerTitleInput').length > 0;

                ok(bInputFieldBeforeClick === bExpectInputFieldBeforeClick, 'Input Field  did not exist  before simulating click on tile Container Title');
                ok(bInputFieldAfterClick === bExpectInputFieldAfterClick, 'Input Field added after simulating click on tile Container Title');
            }, 0);
        }, 0);
    };

    asyncTest("Tile Container Header Edit mode - simulate click test", function () {
        _prepareTileContainerEditFlags(false, false, false, true);
        _tileContainerTitleSimulateClickTestHelper(false, true);
    });

    asyncTest("Tile Container Header Edit mode - simulate click when group is locked", function () {
        _prepareTileContainerEditFlags(false, true, false, true);
        _tileContainerTitleSimulateClickTestHelper(false, false);
    });

    asyncTest("Tile Container Header Edit mode - simulate click when group is Default", function () {
        _prepareTileContainerEditFlags(false, false, true, true);
        _tileContainerTitleSimulateClickTestHelper(false, false);
    });

    asyncTest("Tile Container Header Edit mode - simulate click when Action Mode is not Active", function () {
        _prepareTileContainerEditFlags(false, false, false, false);
        _tileContainerTitleSimulateClickTestHelper(false, false);
    });

    asyncTest("Tile Container Header Edit mode test - when editMode is true", function () {
        _prepareTileContainerEditFlags(true, false, false, false);
        setTimeout(function () {
            start();
            var bInputFieldExist = testContainer.find('.sapUshellTileContainerTitleInput').length > 0;

            ok(bInputFieldExist, 'Input Field exists');
        }, 0);
    });

    var _tileContainerBeforeContentTestHelper = function (bExpectBeforeContentDivAdded, bExpectBeforeContentBtnAdded) {
        setTimeout(function () {
            start();
            var jqBeforeContentDiv = testContainer.find('.sapUshellTileContainerBeforeContent'),
                bBeforeContentDivAdded = jqBeforeContentDiv.length > 0,
                bBeforeContentBtnAdded = bBeforeContentDivAdded ? (jqBeforeContentDiv.find('#beforeContentBtn').length > 0) : false;

            ok(bBeforeContentDivAdded === bExpectBeforeContentDivAdded, 'BeforeContent div exists');
            ok(bBeforeContentBtnAdded === bExpectBeforeContentBtnAdded, 'BeforeContent button exists');

        }, 0);
    };

    asyncTest("Tile Container test with BeforeContent aggregation", function () {
        _prepareTileContainerBeforeContent(true);
        _tileContainerBeforeContentTestHelper(true, true);
    });

    asyncTest("Tile Container test - No BeforeContent aggregation", function () {
        _prepareTileContainerBeforeContent(false);
        _tileContainerBeforeContentTestHelper(false, false);
    });
}());
