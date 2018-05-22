// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.JamShareButton");
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.ui.footerbar.JamShareButton", {
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
    	var jamShareButton = new sap.ushell.ui.footerbar.JamShareButton();
        ok(jamShareButton.getIcon() == "sap-icon://share-2" , "Check button icon");
        ok(jamShareButton.getText("text") == sap.ushell.resources.i18n.getText("shareBtn") , "Check button title");
    });

    
    test("showShareDialog Test", function () {
    	var settingsData = {};
    	jQuery.sap.declare("sap.collaboration.components.fiori.sharing.dialog.Component");
    	
    	sap.ui.core.UIComponent.extend("sap.collaboration.components.fiori.sharing.dialog.Component", {
    		createContent : function() {
    		},
    		setSettings :  function(settingObject) {
    			settingsData = settingObject.object;
        	},
            open : function() {
            	// do nothing;
            }
    	});

    	var jamShareButton = new sap.ushell.ui.footerbar.JamShareButton({
            jamData: {
            	object: {
                    id: window.location.href,
                    display: new sap.m.Text({text: "Test title"}),
                    share: "sharing"
                }
            }
        });

        //Show the dialog
        jamShareButton.showShareDialog();
        ok(settingsData.id === window.location.href , "Check id");
        ok(settingsData.display.getText() === "Test title" , "Check display title");
        ok(settingsData.share === "sharing" , "Check share");
    });
}());
