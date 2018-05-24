// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /*global module, ok, test, jQuery, sap, sinon */
    jQuery.sap.require("sap.ushell.ui.footerbar.AddBookmarkButton");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");

    var attachThemeChangedStub,
        addBookmarkSpy,
        oRenderer,
        historyBackStub,
        fGetConfiguration;

    module("sap.ushell.ui.footerbar.AddBookmarkButton", {
        setup: function () {
            historyBackStub = sinon.stub(window.history, 'back');
            sap.ushell.bootstrap("local");
            attachThemeChangedStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged");
            oRenderer = sap.ushell.Container.createRenderer("fiori2");
            addBookmarkSpy = sinon.stub(sap.ushell.Container.getService("LaunchPage"), "addBookmark");
            addBookmarkSpy.returns(jQuery.Deferred().resolve().promise());
            fGetConfiguration = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "getConfiguration").returns({});
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            attachThemeChangedStub.restore();
            oRenderer.destroy();
            addBookmarkSpy.restore();
            fGetConfiguration.restore();
            historyBackStub.restore();
            delete sap.ushell.Container;
        }
    });


    test("Constructor Test", function () {
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();
        ok(bookmark.getIcon() == "sap-icon://add-favorite" , "Check dialog icon");
        ok(bookmark.getText("text") == sap.ushell.resources.i18n.getText("addToHomePageBtn") , "Check button title");
        ok(bookmark.getEnabled() == true, "Check if button is enabled");
    });

    test("Custom Url Test 1 - a simple string", function () {
        this.isCheckCustomUrlCalled = false;
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {customUrl : "TestUrl", title: 'TestTitle' }});
        bookmark._openDialog = function () {
            this.oDialog = {
                close: function () {},
                destroy: function () {}
            };
            this.cb = function () {};
        };
        bookmark.showAddBookmarkDialog();
        bookmark._handleOkButtonPress();

        ok(addBookmarkSpy.calledOnce, "addBookmark service called");
        ok(addBookmarkSpy.getCall(0).args[0].url === "TestUrl", "expected value for customUrl is: TestUrl");

        bookmark.oSimpleForm.destroy();
        bookmark.destroy();
    });
    
    test("Custom Url Test 2 - a function", function () {
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {customUrl : function() {return "TestUrl";}, title: 'TestTitle' }});
        bookmark._openDialog = function () {
            this.oDialog = {
                close: function () {},
                destroy: function () {}
            };
            this.cb = function () {};
        };
        bookmark.showAddBookmarkDialog();
        bookmark._handleOkButtonPress();

        ok(addBookmarkSpy.calledOnce, "event: addBookmarkTile wasn't published");
        ok(addBookmarkSpy.getCall(0).args[0].url === "TestUrl", "expected value for customUrl is: TestUrl");

        bookmark.oSimpleForm.destroy();
        bookmark.destroy();
    });


    test("appData serviceURL Test 1 - simple string", function () {
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {serviceUrl : 'testServiceUrl', title: 'TestTitle' }});
        bookmark._openDialog = function () {
            this.oDialog = {
                close: function () {},
                destroy: function () {}
            };
            this.cb = function () {};
        };

        bookmark.showAddBookmarkDialog();
        bookmark._handleOkButtonPress();

        ok(addBookmarkSpy.calledOnce, "event: addBookmarkTile wasn't published");
        ok(addBookmarkSpy.getCall(0).args[0].serviceUrl === "testServiceUrl", "service URL plain string came back ok");
        bookmark.oSimpleForm.destroy();
        bookmark.destroy();
    });

    test("appData serviceURL Test 2 - a function ", function () {
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {serviceUrl : function () { return 'functionServiceUrl'; }, title: 'TestTitle' }});

        bookmark._openDialog = function () {
            this.oDialog = {
                close: function () {},
                destroy: function () {}
            };
            this.cb = function () {};
        };

        bookmark.showAddBookmarkDialog();
        bookmark._handleOkButtonPress();

        ok(addBookmarkSpy.calledOnce, "event: addBookmarkTile wasn't published");
        ok(addBookmarkSpy.getCall(0).args[0].serviceUrl === "functionServiceUrl", "service URL plain string came back ok");
        bookmark.oSimpleForm.destroy();
        bookmark.destroy();
    });

    test("Bookmark button setEnabled in standalone application and renderer is undefined Test", function () {
        var renderer = sap.ushell.renderers,
            rendererFiori2 = sap.ushell.renderers.fiori2;
        sap.ushell.renderers.fiori2 = undefined;
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();
        ok(bookmark.getEnabled() == true, "Check if disabled - shell is in standalone state and renderers.fiori2 = undefined");

        sap.ushell.renderers = undefined;
        bookmark.setEnabled();
        ok(bookmark.getEnabled() == true, "Check if disabled - shell is in standalone state and renderers = undefined");
        
        sap.ushell.renderers = renderer;
        sap.ushell.renderers.fiori2 = rendererFiori2;
    });
    test("Bookmark button Disabled in standalone state", function () {
        //Check that the button is disabled and invisible if the state of the shell is "standalone"
        fGetConfiguration.returns({
            appState : "standalone"
        });
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

        ok(bookmark.getEnabled() == false, "Check if disabled - shell is in standalone state");
        ok(bookmark.getVisible() == true, "Check if visible - shell is in standalone state");
    });

    test("Bookmark button Disabled in headerless state", function () {
        //Check that the button is disabled and invisible if the state of the shell is "headerless"
        fGetConfiguration.returns({
            appState : "headerless"
        });
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

        ok(bookmark.getEnabled() == false, "Check if disabled - shell is in headerless state");
        ok(bookmark.getVisible() == true, "Check if visible - shell is in headerless state");
    });

    test("Bookmark button Disabled in embedded state", function () {
        //Check that the button is disabled and invisible if the state of the shell is "embedded"
        fGetConfiguration.returns({
            appState : "embedded"
        });
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

        ok(bookmark.getEnabled() == false, "Check if disabled - shell is in embedded state");
        ok(bookmark.getVisible() == true, "Check if visible - shell is in embedded state");
    });

    test("Disable bookmark button when personalization is switched off", function () {
        fGetConfiguration.returns({
            enablePersonalization : false
        });
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

        ok(bookmark.getEnabled() == false, "Check if disabled - personalization is off");
        ok(bookmark.getVisible() == true, "Check if visible - personalization is off");
    });

    test("showAddBookmarkDialog Test", function () {
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton(),
            oResourceBundle = sap.ushell.resources.i18n;
        ok(bookmark.getEnabled() == true, "Enabled");
        bookmark.showAddBookmarkDialog();
        var bookmarkDialogContent = sap.ui.getCore().byId('bookmarkFormId').getContent()[0].getContent();
        ok(bookmarkDialogContent[0].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #1");
        ok(bookmarkDialogContent[0].getText() === " " + oResourceBundle.getText('previewFld') , "Check form field value #1");
        var tile = bookmarkDialogContent[1].getItems()[0];
        ok(tile.getMetadata()._sClassName === 'sap.ushell.ui.launchpad.Tile' , "Check tile exists");
        ok(bookmarkDialogContent[2].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #1");
        ok(bookmarkDialogContent[2].getText() === " " + oResourceBundle.getText('titleFld') , "Check form field value #1");
        ok(bookmarkDialogContent[3].getMetadata()._sClassName === 'sap.m.Input' , "Check form field type #2");
        ok(bookmarkDialogContent[3].getValue() === "" , "Check form field value #2");
        ok(bookmarkDialogContent[4].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #3");
        ok(bookmarkDialogContent[4].getText() === oResourceBundle.getText('subtitleFld') , "Check form field value #3");
        ok(bookmarkDialogContent[5].getMetadata()._sClassName === 'sap.m.Input' , "Check form field type #4");
        ok(bookmarkDialogContent[5].getValue() === "" , "Check form field value #4");
        ok(bookmarkDialogContent[6].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #5");
        ok(bookmarkDialogContent[6].getText() === oResourceBundle.getText('infoMsg') , "Check form field value #5");
        ok(bookmarkDialogContent[7].getMetadata()._sClassName === 'sap.m.Input' , "Check form field type #6");
        ok(bookmarkDialogContent[7].getValue() === '' , "Check form field value #6");

        sap.ui.getCore().byId('bookmarkDialog').destroy();
    });

    test("Disable dialog ok button when Title Field is empty", function () {
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton(),
            oResourceBundle = sap.ushell.resources.i18n;
        bookmark.showAddBookmarkDialog();
        var bookmarkDialogContent = sap.ui.getCore().byId('bookmarkFormId').getContent()[0].getContent();
        var titleInput = bookmarkDialogContent[3];
        var bookmarkDialogOkButton = sap.ui.getCore().byId('bookmarkDialog').getBeginButton();

        ok(titleInput.getValue() === "" && !bookmarkDialogOkButton.getProperty("enabled"), "Check the ok button is not enabled");
        titleInput.setValue("not empty");
        titleInput.fireLiveChange();
        ok(bookmarkDialogOkButton.getProperty("enabled"), "Check the ok button is enabled");

        sap.ui.getCore().byId('bookmarkDialog').destroy();
    });
    test ("Test bookmark button exit method", function (assert) {

        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton(),
            oModelDestroySpy = sinon.spy(bookmark.oModel, "destroy");
        bookmark.destroy();
        assert.ok(oModelDestroySpy.calledOnce, "The bookmark button model is destroyed");
        oModelDestroySpy.restore();
    });

}());
