// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.LogoutButton");	
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.ui.footerbar.LogoutButton", {
    	/**
         * This method is called before each test
         */
    	setup: function () {
    		sap.ushell.bootstrap("local");
        },
        /**
         * This method is called after each test. Add every restoration code here
         * 
         */
        teardown: function () {
        	delete sap.ushell.Container;
        }
    });

    test("Constructor Test", function () {
    	this.translationBundle = sap.ushell.resources.i18n;
    	var logoutButton = new sap.ushell.ui.footerbar.LogoutButton();
        ok(logoutButton.getIcon() == "sap-icon://log" , "Check dialog icon");
        ok(logoutButton.getText("text") == this.translationBundle.getText("logoutBtn_title") , "Check dialog title");
    });
}());
