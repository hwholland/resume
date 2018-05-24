// @copyright@
// The functionality of the sap.ui.core.routing.History heavily depends on the events of the HashChanger.
// The HashChanger allows to replace the default instance with a custom implementation to intercept the logic -
// this is currently done by the unified shell in order to handle cross-application navigation.

// This test executes the History test suite of ui5 core in the shell context. Therefore, failures might also be caused
// by regressions in sap.ui.core.routing.History

/**
 * @fileOverview integration tests for testing sap.ui.core.routing.History in the unified shell context (sap.ushell.services.ShellNavigation replaces the sap.ui.core.routing.HashChanger)
 */
(function () {
    "use strict";
    /* global module */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.ShellNavigation");
    jQuery.sap.require("sap.ushell.test.utils");

    var sOldHash = "",
        oHashChanger = null,
        fnShellCallback = function () { /* dummy */},
        oStandardHashChanger = new sap.ui.core.routing.HashChanger(),
        sOwnScriptDirectory = sap.ushell.test.getOwnScriptDirectory();

    window.sHashPrefix = "dummySO-action&/";

    module(
        "sap.ushell.services.ShellNavigation.History",
        {
            setup : function () {
                sOldHash = window.location.hash;

                sap.ushell.bootstrap("local");   // bootstrap required due to URLParsing service
                oStandardHashChanger.replaceHash(window.sHashPrefix);   // set a fake shell hash TODO: test with empty shell hash

                oHashChanger = new sap.ushell.services.ShellNavigationHashChanger();
                oHashChanger.initShellNavigation(fnShellCallback);
                oHashChanger.init();
                sap.ui.core.routing.HashChanger.replaceHashChanger(oHashChanger);

                jQuery.sap.require("sap.ui.core.routing.History");
                sap.ui.core.routing.HashChanger.getInstance().replaceHash(""); //since the initial hash will be parsed, we want it to be empty on every test
            },

            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                if (oHashChanger) {
                    oHashChanger.destroy();
                }

                oStandardHashChanger.replaceHash("");
                sap.ui.core.routing.HashChanger.replaceHashChanger(oStandardHashChanger);

                delete sap.ushell.Container;

                window.location.hash = sOldHash;
            }
        }
    );

    jQuery.sap.registerModulePath("sap.ui.core.qunit", sOwnScriptDirectory + "../../../../sap/ui/core/qunit");
    jQuery.sap.require("sap.ui.core.qunit.routing.HistoryQunit");

}());
