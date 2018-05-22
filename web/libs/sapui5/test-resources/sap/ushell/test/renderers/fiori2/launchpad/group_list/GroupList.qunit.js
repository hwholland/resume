// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.launchpad.group_list.GroupList
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");

    var attachThemeChangedStub;

    module("sap.ushell.renderers.fiori2.launchpad.group_list.GroupList", {
        setup: function () {
            sap.ushell.bootstrap("local");
            attachThemeChangedStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
        	
        	delete sap.ushell.Container;
            attachThemeChangedStub.restore();
        }
    });

    test("createContent Test", function () {
    	var oRenderer = sap.ushell.Container.createRenderer("fiori2");
    	var oGroupListView = sap.ui.jsview("sap.ushell.renderers.fiori2.launchpad.group_list.GroupList");
        ok(oGroupListView.getContent().length === 1,'get Content Test');
        oGroupListView.destroy();
        oRenderer.destroy();
    });
    
    test("personalization is 'off' - footer is not displayed Test", function () {
    	var oRenderer = sap.ushell.Container.createRenderer("fiori2");
    	sap.ui.getCore().byId("shell").getModel().setProperty("/personalization", false);
    	
        var oGroupListView = sap.ui.jsview("sap.ushell.renderers.fiori2.launchpad.group_list.GroupList"),
        	oGroupListViewContent = oGroupListView.getContent(),
        	oGroupListPageContent; 
        
        ok(oGroupListViewContent.length === 1,'get Content Test');
        oGroupListPageContent = oGroupListViewContent[0].getContent(); 
        ok(oGroupListPageContent.length === 2,'get Content group list page');
        ok(oGroupListViewContent[0].getFooter() === null,'no footer in group list page');

        oGroupListView.destroy();
        oRenderer.destroy();
        sap.ui.getCore().byId("openCatalogActionItem").destroy();
        sap.ui.getCore().byId("lastHiddenSidebarTabFocusHelper").destroy();
        
    });
    
    test("personalization is 'on' - footer is displayed Test", function () {
    	var oRenderer = sap.ushell.Container.createRenderer("fiori2");
    	sap.ui.getCore().byId("shell").getModel().setProperty("/personalization", true);
    	
        var oGroupListView = sap.ui.jsview("sap.ushell.renderers.fiori2.launchpad.group_list.GroupList"),
        	oGroupListViewContent = oGroupListView.getContent(),
        	oGroupListPageContent; 
        
        ok(oGroupListViewContent.length === 1,'get Content Test');
        oGroupListPageContent = oGroupListViewContent[0].getContent(); 
        ok(oGroupListPageContent.length === 2,'get Content group list page');
        ok(oGroupListViewContent[0].getFooter() !== null,'footer in group list page');

        oGroupListView.destroy();
        oRenderer.destroy();
    });
}());
