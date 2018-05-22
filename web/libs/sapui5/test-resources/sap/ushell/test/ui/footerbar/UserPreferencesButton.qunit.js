// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap, asyncTest */

    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.ui.footerbar.UserPreferencesButton");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    

    var UserPrefButton,
        historyBackStub,
        oRenderer;
    module("sap.ushell.ui.footerbar.UserPreferencesButton", {
        /**
         * This method is called before each test
         */
        setup: function () {
            sap.ushell.bootstrap("local");
            historyBackStub = sinon.stub(window.history, 'back');
            oRenderer = sap.ushell.Container.createRenderer("fiori2");
            this.initialUserPrefModel = jQuery.extend(true, {}, sap.ui.getCore().byId("shell").getModel().getProperty("/userPreferences"));
            UserPrefButton = new sap.ushell.ui.footerbar.UserPreferencesButton();
        },
        /**
         * This method is called after each test. Add every restoration code here
         * 
         */
        teardown: function () {
            UserPrefButton.destroy();
            sap.ui.getCore().byId("shell").getModel().setProperty("/userPreferences", this.initialUserPrefModel);
            sap.ushell.test.restoreSpies(sap.ui.getCore().applyTheme);
            oRenderer.destroy();
            historyBackStub.restore();
            delete sap.ushell.Container;
        }
    });

    asyncTest("User Default Settings Entry test with parameters", 3, function () {
        var UserPrefDefaultSettings = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.renderers.fiori2.defaultParameters_selector.DefaultParameters");
        var hasRelevantMaintainableParametersOriginal = sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParameters;

        sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParameters = function() {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve(true);
            return oDeferred.promise();
        };

        //Check default settings getValue()
        var oDeferred = UserPrefDefaultSettings.oController.getValue();
        oDeferred.done(function (valueObject) {
            start();
            ok(typeof (valueObject) === 'object');
            ok(valueObject.value === 1);
            ok(valueObject.displayText === "");
        });
        UserPrefDefaultSettings.destroy();
        sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParametersOriginal = hasRelevantMaintainableParametersOriginal;
    });

    asyncTest("User Default Settings Entry test with no parameters", 3, function () {
        var UserPrefDefaultSettings = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.renderers.fiori2.defaultParameters_selector.DefaultParameters");
        var hasRelevantMaintainableParametersOriginal = sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParameters;

        sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParameters = function() {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve(false);
            return oDeferred.promise();
        };

        //Check default settings getValue()
        var oDeferred = UserPrefDefaultSettings.oController.getValue();
        oDeferred.done(function (valueObject) {
            start();
            ok(typeof (valueObject) === 'object');
            ok(valueObject.value === 0);
            ok(valueObject.displayText === "");
        });
        UserPrefDefaultSettings.destroy();
        sap.ushell.Container.getService("UserDefaultParameters").hasRelevantMaintainableParametersOriginal = hasRelevantMaintainableParametersOriginal;
    });

    test("Constructor Test", function () {
        ok(UserPrefButton.getIcon() == "sap-icon://person-placeholder" , "Check dialog icon");
        ok(UserPrefButton.getText("text") == sap.ushell.resources.i18n.getText("userPreferences") , "Check dialog title");
    });

}());
