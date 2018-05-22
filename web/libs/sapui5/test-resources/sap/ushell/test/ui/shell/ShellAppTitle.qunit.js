// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* global module,ok,test,jQuery,sap,sinon*/
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.ui.shell.ShellAppTitle");
    jQuery.sap.require("sap.ushell.services.Container");
    module("sap.ushell.ui.shell.ShellAppTitle", {
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

        jQuery.sap.require("sap.ushell.resources");
        var text = "application title";
        var shellAppTitle = new sap.ushell.ui.shell.ShellAppTitle({text: text});

        ok(shellAppTitle.getText() === text ,"Check text");
        ok(!shellAppTitle.getNavigationMenu(), "Check navigation menu is empty");

        var oShellNavigationMenu = new sap.ushell.ui.shell.ShellNavigationMenu("shellNavMenu");
        shellAppTitle.setNavigationMenu(oShellNavigationMenu);

        ok(shellAppTitle.getNavigationMenu() === "shellNavMenu", "Check association assignment to the navigation menu");

        oShellNavigationMenu.destroy();
        shellAppTitle.destroy();
    });


    test("Renderer Test", function () {

        jQuery.sap.getObject("sap-ushell-config", 0).renderers = {
            fiori2: {
                componentData: {
                    config: {
                        enableMergeAppAndShellHeaders: true,
                        rootIntent: "Shell-home"
                    }
                }
            }
        };

        sap.ushell.bootstrap("local");
        sap.ushell.Container.createRenderer("fiori2");

        var renderer = sap.ushell.Container.getRenderer("fiori2"),
            shell = sap.ui.getCore().byId("shell"),
            oShellView = sap.ui.getCore().byId("mainShell"),
            oShellController = oShellView.getController(),
            oShellHeader = shell.getHeader(),
            oAppTitle = oShellHeader.getAppTitle();


        // prepare event data to simulate ShellUIService callback on the shell-controller for setting title
        var oEvent = {}, eventData;
        oEvent.getParameters = function () { return { data : eventData }; };
        eventData = "Application's title";
        oShellController.onTitleChange(oEvent);

        // (1) check text was modified in app title
        ok(oAppTitle.getText() === "Application's title", "Check application title");

        // (2) see that navigation menu exists but no hierarchy items added
        var sNavMenu = oAppTitle.getNavigationMenu();
        var oNavMenu = sap.ui.getCore().byId(sNavMenu);
        ok(!(oNavMenu.getItems() && oNavMenu.getItems().length > 0), "check that no hierarchy items exist on nav menu");

        // prepare event data to simulate ShellUIService callback on the shell-controller for setting hierarchy which was changed
        eventData = [
            {   title : "Item",
                subtitle : "Item 2",
                icon : "someIconURI"
            }
        ];
        // trigger the event callback
        oShellController.onHierarchyChange(oEvent);

        // (4) check that title was not changed
        ok(oAppTitle.getText() === "Application's title", "Check application title");
        oNavMenu.setModel( oShellView.getModel());

        // (5) check that a hierarchy item was created
        ok(oNavMenu.getItems() && oNavMenu.getItems().length === 1, "check that hierarchy item created on the navigation menu");

        // (6) validate the hierarchy item which was created according to the factory method as created within the shell-view
        var oHierarchyItem = oNavMenu.getItems()[0];
        var expectedRes = eventData[0];
        ok(oHierarchyItem instanceof sap.m.StandardListItem, "check that hierarchy item created");
        ok(oHierarchyItem.getProperty("title")       === expectedRes.title,    "check that hierarchy property assigned");
        ok(oHierarchyItem.getProperty("description") === expectedRes.subtitle, "check that hierarchy property assigned");
        ok(oHierarchyItem.getProperty("icon")        === expectedRes.icon,     "check that hierarchy property assigned");


        // prepare event data to simulate ShellUIService callback on the shell-controller for setting Related-Apps which were changed
        eventData = [
            {   title : "App 1",
                subtitle : "App1 subtitle",
                icon : "someIconURI",
                intent: "#someintent1"
            },
            {   title : "Item",
                subtitle : "Item 2",
                icon : "someIconURI",
                intent: "#someintent2"
            }
        ];

        // trigger the event callback
        oShellController.onRelatedAppsChange(oEvent);

        // (7) check that title was not changed
        ok(oAppTitle.getText() === "Application's title", "Check application title");
        oNavMenu.setModel( oShellView.getModel());

        // (8) check that a hierarchy item was not modified AND relatedApps created correctly
        ok(oNavMenu.getItems() && oNavMenu.getItems().length === 1, "check that hierarchy item created was not changed due to setting related apps");
        ok(oNavMenu.getMiniTiles() && oNavMenu.getMiniTiles().length === 2, "check that related apps hierarchy item created on the navigation menu");

        // (9) validate the related Apps items which was created according to the factory method as created within the shell-view
        var oRelatedAppMiniTile = oNavMenu.getMiniTiles()[0];
        expectedRes = eventData[0];
        ok(oRelatedAppMiniTile instanceof sap.ushell.ui.shell.NavigationMiniTile,   "check that related app item created");
        ok(oRelatedAppMiniTile.getProperty("title")       === expectedRes.title,    "check that related app property assigned");
        ok(oRelatedAppMiniTile.getProperty("subtitle") === expectedRes.subtitle, "check that related app property assigned");
        ok(oRelatedAppMiniTile.getProperty("icon")        === expectedRes.icon,     "check that related app property assigned");
        ok(oRelatedAppMiniTile.getProperty("intent")      === expectedRes.intent,   "check that related app property assigned");

        oRelatedAppMiniTile = oNavMenu.getMiniTiles()[1];
        expectedRes = eventData[1];
        ok(oRelatedAppMiniTile instanceof sap.ushell.ui.shell.NavigationMiniTile,   "check that related app item created");
        ok(oRelatedAppMiniTile.getProperty("title")       === expectedRes.title,    "check that related app property assigned");
        ok(oRelatedAppMiniTile.getProperty("subtitle") === expectedRes.subtitle, "check that related app property assigned");
        ok(oRelatedAppMiniTile.getProperty("icon")        === expectedRes.icon,     "check that related app property assigned");
        ok(oRelatedAppMiniTile.getProperty("intent")      === expectedRes.intent,   "check that related app property assigned");


        // prepare event data to simulate ShellUIService callback on the shell-controller for setting Related-Apps which were changed
        eventData = [
            {   title : "App 1",
                subtitle : "App1 subtitle",
                icon : "someIconURI",
                intent: "#someintent1"
            },
            {   title : "App 2",
                subtitle : "Item 2",
                icon : "someIconURI",
                intent: "#someintent2"
            },
            {   title : "App 3",
                subtitle : "App1 subtitle",
                icon : "someIconURI",
                intent: "#someintent1"
            },
            {   title : "App 4",
                subtitle : "Item 2",
                icon : "someIconURI",
                intent: "#someintent2"
            },
            {   title : "App 5",
                subtitle : "App1 subtitle",
                icon : "someIconURI",
                intent: "#someintent1"
            },
            {   title : "App 6",
                subtitle : "Item 2",
                icon : "someIconURI",
                intent: "#someintent2"
            },
            {   title : "App 7",
                subtitle : "App1 subtitle",
                icon : "someIconURI",
                intent: "#someintent1"
            },
            {   title : "App 8 ",
                subtitle : "Item 2",
                icon : "someIconURI",
                intent: "#someintent2"
            },
            {   title : "App 9",
                subtitle : "App1 subtitle",
                icon : "someIconURI",
                intent: "#someintent1"
            },
            {   title : "App 10",
                subtitle : "Item 2",
                icon : "someIconURI",
                intent: "#someintent2"
            },
            {   title : "App 11",
                subtitle : "Item 2",
                icon : "someIconURI",
                intent: "#someintent2"
            }
        ];

        // trigger the event callback
        oShellController.onRelatedAppsChange(oEvent);

        // (10) check that a hierarchy item was not modified due to related apps change
        ok(oNavMenu.getItems() && oNavMenu.getItems().length === 1, "check that hierarchy item created was not changed due to setting related apps");

        // (11) MAKE SURE no more than 9 related apps reside on the navigation menu although event passed 11 related apps in array
        ok(oNavMenu.getMiniTiles() && oNavMenu.getMiniTiles().length === 9, "check that related apps hierarchy item created on the navigation menu");

        oRelatedAppMiniTile = oNavMenu.getMiniTiles()[8];
        expectedRes = eventData[8];

        // (12) MAKE SURE last related app created is the 9th related app from the event data
        ok(oRelatedAppMiniTile instanceof sap.ushell.ui.shell.NavigationMiniTile,   "check that related app item created");
        ok(oRelatedAppMiniTile.getProperty("title")       === expectedRes.title,    "check that related app property assigned");
        ok(oRelatedAppMiniTile.getProperty("subtitle")    === expectedRes.subtitle, "check that related app property assigned");
        ok(oRelatedAppMiniTile.getProperty("icon")        === expectedRes.icon,     "check that related app property assigned");
        ok(oRelatedAppMiniTile.getProperty("intent")      === expectedRes.intent,   "check that related app property assigned");

        renderer.destroy();
    });


}());
