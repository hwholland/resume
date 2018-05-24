// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.JamDiscussButton");
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.ui.footerbar.JamDiscussButton", {
        /**
         * This method is called before each test
         */
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
        }
    });

    test("Constructor Test", function () {
    	var JamDiscussDialog = new sap.ushell.ui.footerbar.JamDiscussButton();
        ok(JamDiscussDialog.getIcon() == "sap-icon://discussion-2" , "Check dialog icon");
        ok(JamDiscussDialog.getText("text") == sap.ushell.resources.i18n.getText("discussBtn") , "Check dialog title");
    });

    test("showDiscussDialog Test", function () {
    	var settingsData = {};
    	jQuery.sap.declare("sap.collaboration.components.fiori.feed.dialog.Component");
    	
    	sap.ui.core.UIComponent.extend("sap.collaboration.components.fiori.feed.dialog.Component", {
    		createContent : function() {
    		},
    		setSettings :  function(settingObject) {
    			settingsData = settingObject;
        	},
            open : function() {
            	// do nothing;
            }
    	});
    	
        var JamDiscussDialog = new sap.ushell.ui.footerbar.JamDiscussButton({
            jamData: {
                object: {
                    id: window.location.href,
                    display: new sap.m.Text({text: "Test One"})
                },
                oDataServiceUrl: 'Some url',
                feedType: 'type',
                groupIds: 'noGroups'
            }
        });

        //Show the dialog
        JamDiscussDialog.showDiscussDialog();
        ok(settingsData.object.id === window.location.href, "Check id");
        ok(settingsData.object.display.getText() === "Test One", "Check display text");
        ok(settingsData.oDataServiceUrl === "Some url", "Check oDataServiceUrl");
        ok(settingsData.feedType === "type", "Check feedType");
        ok(settingsData.groupIds === "noGroups", "Check groupIds");
    });
}());
