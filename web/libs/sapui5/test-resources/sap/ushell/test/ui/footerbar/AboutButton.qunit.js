// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.AboutButton");
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.ui.footerbar.AboutButton", {
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
    	var aboutDialog = new sap.ushell.ui.footerbar.AboutButton();
        ok(aboutDialog.getIcon() == "sap-icon://hint" , "Check dialog icon");
        ok(aboutDialog.getText("text") == sap.ushell.resources.i18n.getText("about") , "Check dialog title");
        ok(aboutDialog.getTooltip() == sap.ushell.resources.i18n.getText("about") , "Check dialog title");
        
    });

    test("showAboutDialog Test", function () {
        //make sure no application is set in the AppConfiguration Service
        var oAppConfig = jQuery.sap.getObject("sap.ushell.services.AppConfiguration");
        if(oAppConfig){
            oAppConfig.setCurrentApplication();
        }
        
        var aboutDialog = new sap.ushell.ui.footerbar.AboutButton();
        //Show the dialog
        aboutDialog.showAboutDialog();
        
        //Get the about dialog content form
        var dialogFormContent = sap.ui.getCore().byId('aboutDialogFormID').getContent(),
        	translationBundle = sap.ushell.resources.i18n;
        
        
        var ui5Version = (sap.ui.version || "") + (' (' + (sap.ui.buildinfo.buildtime || "") + ')') || '';
        var userAgent = navigator.userAgent || '';
        
        ok(dialogFormContent[0].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #0"); 
        ok(dialogFormContent[0].getText() === translationBundle.getText("technicalName") , "Check form field value #0");
        ok(dialogFormContent[1].getMetadata()._sClassName === 'sap.m.Text' , "Check form field type #1"); 
        ok(dialogFormContent[1].getText() === '' , "Check form field value #1");
        ok(dialogFormContent[2].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #2"); 
        ok(dialogFormContent[2].getText() === translationBundle.getText("fioriVersionFld") , "Check form field value #2");
        ok(dialogFormContent[3].getMetadata()._sClassName === 'sap.m.Text' , "Check form field type #3"); 
        ok(dialogFormContent[3].getText() === '' , "Check form field value #3");
        ok(dialogFormContent[4].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #4"); 
        ok(dialogFormContent[4].getText() === translationBundle.getText("sapui5Fld") , "Check form field value #4");
        ok(dialogFormContent[5].getMetadata()._sClassName === 'sap.m.Text' , "Check form field type #5"); 
        ok(dialogFormContent[5].getText() === ui5Version , "Check form field value #5");
        ok(dialogFormContent[6].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #6"); 
        ok(dialogFormContent[6].getText() === translationBundle.getText("userAgentFld") , "Check form field value #6");
        ok(dialogFormContent[7].getMetadata()._sClassName === 'sap.m.Text' , "Check form field type #7"); 
        ok(dialogFormContent[7].getText() === userAgent , "Check form field value #7");
        ok(dialogFormContent[8].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #8"); 
        ok(dialogFormContent[8].getText() === '' , "Check form field value #8");

        //Destroy the about dialog
        sap.ui.getCore().byId('aboutContainerDialogID').destroy();
    });
}());
