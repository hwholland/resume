// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    var oClock,
        oLoadingDialog,
        testContainer,
        demiItemData = {
            id : 'testLoadingDialog',
            text : ''
        };

    module("sap.ushell.ui.launchpad.LoadingDialog", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oLoadingDialog = new sap.ushell.ui.launchpad.LoadingDialog(demiItemData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
            oLoadingDialog._oPopup.setContent(oLoadingDialog);
            oLoadingDialog.placeAt('testContainer');
            oClock = sinon.useFakeTimers();
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oLoadingDialog._oPopup.setContent(oLoadingDialog);
            oClock.restore();
            oLoadingDialog.destroy();
            jQuery(testContainer).remove();
            delete sap.ushell.Container;
        }
    });

    asyncTest("Test Loading dialog animation without interval", function () {
        oLoadingDialog.setLoadAnimationWithInterval(false);
        oLoadingDialog.openLoadingScreen();
        oClock.tick(1);
        oLoadingDialog._oPopup.setContent(oLoadingDialog);
        start();
        var bFlowerAnimationShown = jQuery.find('.sapUshellLoadingDialogControl:not(.sapUshellVisibilityHidden)').length;

        ok(bFlowerAnimationShown, 'Flower animation should be shown immediately');
    });

    asyncTest("Test Loading dialog animation with interval by default", function () {
        oLoadingDialog.openLoadingScreen();
        oClock.tick(2999);
        oLoadingDialog._oPopup.setContent(oLoadingDialog);
        start();
        var bFlowerAnimationHidden = jQuery.find('.sapUshellLoadingDialogControl.sapUshellVisibilityHidden').length;

        ok(bFlowerAnimationHidden, 'By default, flower animation should not be shown after 3 secs');
        oClock.tick(3001);
        var bFlowerAnimationShown = jQuery.find('.sapUshellLoadingDialogControl:not(.sapUshellVisibilityHidden)').length;

        ok(bFlowerAnimationShown, 'By default, flower animation should be shown after 3 secs');
    });

    asyncTest("Assure delayed Fiori Flower animation is terminated after closing loading screen", function () {
        oLoadingDialog.openLoadingScreen();
        oLoadingDialog.closeLoadingScreen();
        oClock.tick(3001);
        oLoadingDialog._oPopup.setContent(oLoadingDialog);
        start();
        var bFlowerAnimationHidden = jQuery.find('.sapUshellLoadingDialogControl.sapUshellVisibilityHidden').length;

        ok(bFlowerAnimationHidden, 'closeLoadingScreen() should terminate the delayed Fiori Flower animation');
    });
}());
