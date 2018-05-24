// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.components.flp.launchpad.PagingManager
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.components.flp.launchpad.PagingManager");
    jQuery.sap.require("sap.ushell.services.Container");

    var oPagingManager = null;

    var mockData;

    module("sap.ushell.components.flp.launchpad.PagingManager", {
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oPagingManager = null;
        }
    });
    test("PagingManager create instance", function () {
        oPagingManager = new sap.ushell.components.flp.launchpad.PagingManager('catalogPaging', {
            supportedElements: {
                tile : {className: 'sapUshellTile'},
                link : {className: 'sapUshellLinkTile'}
            },
            containerHeight: 500,
            containerWidth: 500
        });

        ok(oPagingManager, 'PagingManager Instance was created');
    });

    test("PagingManager number of tiles per page Size (500, 500)", function () {
        oPagingManager = new sap.ushell.components.flp.launchpad.PagingManager('catalogPaging', {
            supportedElements: {
                tile : {className: 'sapUshellTile'},
                link : {className: 'sapUshellLinkTile'}
            },
            containerHeight: 500,
            containerWidth: 500
        });

        ok(oPagingManager, 'PagingManager Instance was created');
        oPagingManager.moveToNextPage();
        ok(oPagingManager.getNumberOfAllocatedElements() == 48, 'PagingManager tiles in first page');
        oPagingManager.moveToNextPage();
        ok(oPagingManager.getNumberOfAllocatedElements() == 96, 'PagingManager tiles in secound page');

    });

    test("PagingManager number of tiles per page Size (100, 350)", function () {
        oPagingManager = new sap.ushell.components.flp.launchpad.PagingManager('catalogPaging', {
            supportedElements: {
                tile : {className: 'sapUshellTile'},
                link : {className: 'sapUshellLinkTile'}
            },
            containerHeight: 100,
            containerWidth: 350
        });

        ok(oPagingManager, 'PagingManager Instance was created');
        oPagingManager.moveToNextPage();
        ok(oPagingManager.getNumberOfAllocatedElements() == 6, 'PagingManager tiles in first page');
        oPagingManager.moveToNextPage();
        ok(oPagingManager.getNumberOfAllocatedElements() == 12, 'PagingManager tiles in secound page');
    });

    test("PagingManager number of tiles per page Size (1000, 1000)", function () {
        oPagingManager = new sap.ushell.components.flp.launchpad.PagingManager('catalogPaging', {
            supportedElements: {
                tile : {className: 'sapUshellTile'},
                link : {className: 'sapUshellLinkTile'}
            },
            containerHeight: 1000,
            containerWidth: 1000
        });

        ok(oPagingManager, 'PagingManager Instance was created');
        oPagingManager.moveToNextPage();
        ok(oPagingManager.getNumberOfAllocatedElements() == 186, 'PagingManager tiles in first page');
        oPagingManager.moveToNextPage();
        ok(oPagingManager.getNumberOfAllocatedElements() == 372, 'PagingManager tiles in secound page');
    });

    test("PagingManager number of tiles per page Size (10, 10)", function () {
        oPagingManager = new sap.ushell.components.flp.launchpad.PagingManager('catalogPaging', {
            supportedElements: {
                tile : {className: 'sapUshellTile'},
                link : {className: 'sapUshellLinkTile'}
            },
            containerHeight: 10,
            containerWidth: 10
        });
        ok(oPagingManager, 'PagingManager Instance was created');
        oPagingManager.moveToNextPage();
        ok(oPagingManager.getNumberOfAllocatedElements() == 10, 'PagingManager tiles in first page');
        oPagingManager.moveToNextPage();
        ok(oPagingManager.getNumberOfAllocatedElements() == 20, 'PagingManager tiles in secound page');
    });
}());