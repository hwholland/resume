// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.SettingsButton");	
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.ui.footerbar.SettingsButton", {
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
    	var settingsButton = new sap.ushell.ui.footerbar.SettingsButton();
        ok(settingsButton.getIcon() == "sap-icon://action-settings" , "Check dialog icon");
        ok(settingsButton.getTooltip("text") == sap.ushell.resources.i18n.getText("helpBtn_tooltip") , "Check settings tooltip"); 
    });
    
    test("showSettingsMenu Test", function () {
        var settingsButton = new sap.ushell.ui.footerbar.SettingsButton();
        //Show the menu
        settingsButton.showSettingsMenu();
        
        //Get the settings menu content form
        var menuButtons = sap.ui.getCore().byId('settingsMenu').getButtons();
        
        ok(menuButtons.length === 3 , "Check number of buttons");
        ok(menuButtons[0].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.AboutButton' , "Check about button");
        ok(menuButtons[1].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.UserPreferencesButton' , "Check login details button");
        ok(menuButtons[2].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.LogoutButton' , "Check logout utton");
        
        
        //Destroy the about dialog
        sap.ui.getCore().byId('settingsMenu').destroy();
    });
    
    test("setMenuItems Test", function () {
        var settingsButton = new sap.ushell.ui.footerbar.SettingsButton();
        settingsButton.setMenuItems([new sap.ushell.ui.footerbar.AboutButton()]);
        
        //Show the menu
        settingsButton.showSettingsMenu();
        
        //Get the settings menu dialog content form
        var menuButtons = sap.ui.getCore().byId('settingsMenu').getButtons();
        
        ok(menuButtons.length === 4 , "Check number of buttons");
        ok(menuButtons[0].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.AboutButton' , "Check about button");
        ok(menuButtons[1].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.AboutButton' , "Check about button");
        ok(menuButtons[2].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.UserPreferencesButton' , "Check login details button");
        ok(menuButtons[3].getMetadata()._sClassName === 'sap.ushell.ui.footerbar.LogoutButton' , "Check logout utton");
                
        //Destroy the about dialog
        sap.ui.getCore().byId('settingsMenu').destroy();
    });
}());
