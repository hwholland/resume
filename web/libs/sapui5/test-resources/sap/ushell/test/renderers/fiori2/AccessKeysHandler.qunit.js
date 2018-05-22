// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.AccessKeysHandler
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require('sap.ushell.renderers.fiori2.AccessKeysHandler');
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.m.Text");
    jQuery.sap.require("sap.m.Label");
    jQuery.sap.require("sap.ui.layout.form.SimpleForm");
    jQuery.sap.require("sap.ui.thirdparty.hasher");

    module("sap.ushell.renderers.fiori2.AccessKeysHandler", {
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
        }
    });


    test("create a new instance of AccessKeysHandler Class", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler;

        ok(instance, "create a new instance");
    });

    test("check AccessKeysHandler Class init flags values", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler;

        ok(instance.bFocusOnShell === true, "flag init value should be true");
        ok(instance.bFocusPassedToExternalHandlerFirstTime === true, "flag init value should be true");
        ok(instance.isFocusHandledByAnotherHandler === false, "flag init value should be false");
    });

    asyncTest("move focus to inner application", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler,
            fnCallbackAppKeysHandler = sinon.spy(),
            getHashStub = sinon.stub(hasher, "getHash").returns("shell-home");

        instance.init();

        //register inner application keys handler
        sap.ushell.renderers.fiori2.AccessKeysHandler.registerAppKeysHandler(fnCallbackAppKeysHandler);
        // Trigger the F6 key event to move keys handling to inner application
        var F6keyCode = 117,
            oEvent = jQuery.Event("keydown", { keyCode: F6keyCode });
        // Set flag to false because the focus moves to the application responsibility
        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
        jQuery(document).trigger(oEvent);

        setTimeout(function () {
            start();
            ok(fnCallbackAppKeysHandler.calledOnce, "Application's keys handler function was not executed");

            instance = null;
            getHashStub.restore();
        }, 100);
    });

    test("check focus back to shell flags validity", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler;

        // Set flag to false because the focus moves to the application responsibility
        sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;

        // Move focus back to shell
        var F6keyCode = 117,
            oEvent = jQuery.Event("keydown", { keyCode: F6keyCode, shiftKey: true });
        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);

        ok(instance.bFocusOnShell === true, "flag value should be true");
    });

    test("test reset handlres after navigating to another application", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler,
            fnCallbackAppKeysHandler = sinon.spy(),
            currentKeysHandler = null,
            hasherGetHashStub = sinon.stub(hasher, "getHash").returns("some-app");

        //register inner application keys handler
        instance.registerAppKeysHandler(fnCallbackAppKeysHandler);

        currentKeysHandler = instance.getAppKeysHandler();
        ok(currentKeysHandler !== null, "currently there is a registered keys handler");

        // this function will be called once 'appOpend' event will be fired
        hasherGetHashStub.returns("another-app");
        instance.appOpenedHandler();
        currentKeysHandler = instance.getAppKeysHandler();
        ok(currentKeysHandler === null, "currently there is no registered keys handler");

        instance = null;
        hasherGetHashStub.restore();
    });

    test("check short keys dialog is creating successfully", function () {
        var translationBundle = sap.ushell.resources.i18n,
            instance = sap.ushell.renderers.fiori2.AccessKeysHandler;
        instance.oModel = new sap.ui.model.json.JSONModel({
            searchAvailable: true
        });
        // 2 short keys that comes from the component
        instance.aShortcutsDescriptions = [{text: "Alt+H", description: translationBundle.getText("actionHomePage")},
            {text: "Alt+C", description: translationBundle.getText("actionAppFinder")}];

        instance.handleAccessOverviewKey();

        var oDialog = sap.ui.getCore().byId("hotKeysGlossary");

        ok(oDialog !== null, "hot keys glossary dialog was created successfully");
        ok(oDialog.getContent()[0].getContent().length === 8, "gialog have 4 short keys and 4 labels");
    });

    test("check user preferences short keys", function () {
        sap.ushell.bootstrap("local");
        sap.ui.jsview("mainShell", "sap.ushell.renderers.fiori2.Shell")
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler,
            userPrefButton = new sap.ushell.ui.footerbar.UserPreferencesButton("userPreferencesButton"),
            fnShowUserPreferencesDialog = sinon.stub(userPrefButton, "showUserPreferencesDialog");

        instance.handleUserMenuKey();

        ok(fnShowUserPreferencesDialog.calledOnce, "user preferences dialog was opened successfully");
    });

    test("check handle shortcuts method work as expected", function () {
        var instance = sap.ushell.renderers.fiori2.AccessKeysHandler,
            oEvent = jQuery.Event("keydown", {keyCode: 83, altKey: true}), //S
            handleSearchKeyStub = sinon.stub(instance, "handleSearchKey"),
            handleUserMenuKeyStub = sinon.stub(instance, "handleUserMenuKey"),
            handleAccessOverviewKeyStub = sinon.stub(instance, "handleAccessOverviewKey");

        instance.handleShortcuts(oEvent);
        ok(handleSearchKeyStub.calledOnce, "search short key was handled correctly");

        oEvent = jQuery.Event("keydown", {keyCode: 85, altKey: true}); //U
        instance.handleShortcuts(oEvent);
        ok(handleUserMenuKeyStub.calledOnce, "user menu short key was handeled correctly");

        oEvent = jQuery.Event("keydown", {keyCode: 48, altKey: true}); //0
        instance.handleShortcuts(oEvent);
        ok(handleAccessOverviewKeyStub.calledOnce, "user overview screen was handeled correctly");
    });
}());