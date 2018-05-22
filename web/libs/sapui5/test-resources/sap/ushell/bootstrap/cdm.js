// @copyright@
/**
 * @fileOverview The Unified Shell's bootstrap code for standalone demos.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap, window */

    window['sap-ui-config'] = {
        "xx-bootTask": function (fnCallback) {
            jQuery.sap.registerModulePath("sap.ushell.shells.demo", ".");

            // TODO: quick fix for search adapter test data
            jQuery.sap.registerModulePath("sap.ushell.adapters.local.searchResults", "./searchResults");

            //Load configuration for fiori demo
            //jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");

            jQuery.sap.require("sap.ushell.services.Container");

            // tell SAPUI5 that this boot task is done once the container has loaded
            sap.ushell.bootstrap("local").done(fnCallback);
            //TODO what about .fail()?
        }
    };
}());
