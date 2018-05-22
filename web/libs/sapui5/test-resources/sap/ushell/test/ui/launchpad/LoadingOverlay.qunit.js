// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingOverlay");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    var oLoadingOverlay,
        testContainer,
        demiItemData = {
            id : 'testLoadingOverlay',
            text : ''
        };

    module("sap.ushell.ui.launchpad.LoadingOverlay", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oLoadingOverlay = new sap.ushell.ui.launchpad.LoadingOverlay(demiItemData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oLoadingOverlay.destroy();
            jQuery(testContainer).remove();
            delete sap.ushell.Container;
        }
    });

    test("TestLoadingOverlay Init", function () {
        var jqLoadingArea = jQuery("#sapUshellLoadingArea"),
            jqLoadingOverlay = jQuery("#sapUshellLoadingOverlay");
        ok(jqLoadingArea[0].className === "sapUshellLoadingDialogArea");
        ok(jqLoadingOverlay[0].className === "sapUshellLoadingOverlayStyle sapUshellShellHidden");
    });
    test("isOpen", function () {
        oLoadingOverlay.openLoadingScreen();
        ok(oLoadingOverlay.isOpen() === true);
        oLoadingOverlay.closeLoadingScreen();
        ok(oLoadingOverlay.isOpen() === false);
    });

}());
