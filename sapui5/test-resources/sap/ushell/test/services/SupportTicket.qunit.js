// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.services.SupportTicket and customizable
 * extensions
 */
(function () {
    "use strict";
    /*global equal, module,
      test,
      jQuery, sap, window */
    jQuery.sap.require("sap.ushell.services.Container");
    module(
        "sap.ushell.services.SupportTicket",
        {
            setup : function () {
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                jQuery.sap.getObject("sap-ushell-config.services.SupportTicket.config", 0).enabled = false;
                delete sap.ushell.Container;
            }
        }
    );

    test("service disabled by default - factory instantiation", function () {
        var oService = null;

        sap.ushell.bootstrap("local");

        oService = sap.ushell.Container.getService("SupportTicket");
        equal(oService.isEnabled(), false);
    });

    test("service disabled by default - constructor call", function () {
        jQuery.sap.require("sap.ushell.services.SupportTicket");
        var oService = new sap.ushell.services.SupportTicket();

        equal(oService.isEnabled(), false);
    });

    test("service enabled if set in bootstrap config", function () {
        var oService = null;

        jQuery.sap.getObject("sap-ushell-config.services.SupportTicket.config", 0).enabled = true;

        sap.ushell.bootstrap("local");

        oService = sap.ushell.Container.getService("SupportTicket");
        equal(oService.isEnabled(), true);
    });

}());