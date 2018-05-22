// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.PageBuilding
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.services.Container"); // necessary for stand-alone tests

    module("sap.ushell.services.PageBuilding.integration", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    asyncTest("getFactory", function () {
        var oFactory,
            oPageBuildingService;

        expect(1);
        sap.ushell.bootstrap("abap", {
            abap: "sap.ushell_abap.adapters.abap",
            hana: "sap.ushell_abap.adapters.hana"
        }).always(function () {
            start();
            oPageBuildingService = sap.ushell.Container.getService("PageBuilding");
            oFactory = oPageBuildingService.getFactory();
            ok(oFactory instanceof sap.ui2.srvc.Factory, "A factory was created.");
        });
    });

    asyncTest("read page set", function () {
        var oPageBuildingService;

        // prepare test
        sap.ushell.bootstrap("abap", {
            abap: "sap.ushell_abap.adapters.abap",
            hana: "sap.ushell_abap.adapters.hana"
        }).done(function () {
            oPageBuildingService = sap.ushell.Container.getService("PageBuilding");

            // code under test
            oPageBuildingService.getPageSet("/UI2/Fiori2LaunchpadHome")
                .fail(sap.ui2.srvc.test.onError)
                .done(function (oPageSet) {
                    var i, aPages = oPageSet.getPages();

                    start();
                    ok(sap.ui2.srvc.isArray(aPages), "is array");
                    for (i = 0; i < aPages.length; i += 1) {
                        ok(aPages[i] instanceof sap.ui2.srvc.Page, "element " + i + " is a page");
                    }
                });
        });
    });
}());
