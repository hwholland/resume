// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.Shell
 */
(function () {
    "use strict";
    /*global module, ok, stop, test, jQuery, sap, sinon, window */
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");

    var attachThemeChangedStub,
        historyBackStub,
        sCachedConfig,
        oRendererControl;

    module("sap.ushell.renderers.fiori2.Renderer", {
        setup: function () {
            sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            jQuery.sap.getObject("services.NavTargetResolution.config", 0, JSON.parse(sCachedConfig)).resolveLocal = [
                {
                    "linkId": "Shell-home",
                    resolveTo: {
                        additionalInformation: "SAPUI5.Component=sap.ushell.components.flp",
                        applicationType: "URL",
                        url: "/ushell/resources/sap/ushell/components/flp",
                        "loadCoreExt": false,    // avoid loading of core-ext-light and default dependencies
                        "loadDefaultDependencies": false
                    }
                }];
            window.location.hash = "";
            //Do not bootstrap here; config must be set before
            //sap.ushell.bootstrap("local");
            if (window.hasher && window.hasher.getHash()) {
                window.hasher.setHash('');
            }
            historyBackStub = sinon.stub(window.history, 'back');
            attachThemeChangedStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
//            window.location.hash = "";
            historyBackStub.restore();
            window["sap-ushell-config"] = JSON.parse(sCachedConfig);
            if (oRendererControl) {
                oRendererControl.destroy();
            }
            delete sap.ushell.Container;
            attachThemeChangedStub.restore();
            if (jQuery.sap.getUriParameters.restore) {
                jQuery.sap.getUriParameters.restore();
            }
        }
    });

    function _testAppState(expectedStateName, iHeadItems, bSearch, aExcludedActions, bApp) {
        var oShell = sap.ui.getCore().byId("shell"),
            stateName = oShell.getModel().getProperty("/currentState").stateName,
            searchAvailable,
            aActions,
            aActionsIds,
            app;

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        ok(stateName === expectedStateName, 'state: ' + stateName + ", expected state: " + expectedStateName);

        ok(oShell.getHeadItems().length === iHeadItems, 'home button is not displayed on ' + expectedStateName + ' state');
        searchAvailable = (sap.ui.getCore().byId("sf").getParent() !== null);
        ok(searchAvailable === bSearch, 'sf button is not displayed on ' + expectedStateName + ' state');

        //verify excluded actions
        aActions = sap.ui.getCore().byId("headActions").getButtons();
        aActionsIds = [];
        jQuery.each(aActions, function (i, action) {
            aActionsIds.push(action.getId());
        });

        jQuery.each(aExcludedActions, function (i, action) {
            ok(aActionsIds.indexOf(aExcludedActions[i]) === -1, aExcludedActions[i] + ' button is not displayed');
        });

        //verify app is opend in case bApp = true
        //as there is no hash fragment the id of the application element is 'application-'
        app = sap.ui.getCore().byId("application-") || sap.ui.getCore().byId("shellPage-");
        ok(!app === !bApp, 'application found');

    }

    function _getContainerConfiguration() {
        var oBaseConfig = JSON.parse(sCachedConfig);
        oBaseConfig.renderers = {
            fiori2: {
                componentData: {
                    config: {
                        changeOpacity : "off",
                        applications: {
                            "Shell-home" : {

                            }
                        },
                        rootIntent: "Shell-home"
                    }
                }
            }
        };
        jQuery.sap.getObject("services.NavTargetResolution.config", 0, oBaseConfig).resolveLocal = [
            {
                "linkId": "Shell-home",
                resolveTo: {
                    additionalInformation: "SAPUI5.Component=sap.ushell.components.flp",
                    applicationType: "URL",
                    url: "/ushell/resources/sap/ushell/components/flp",
                    "loadCoreExt": false,    // avoid loading of core-ext-light and default dependencies
                    "loadDefaultDependencies": false
                }
            }];
        return oBaseConfig;
    }

//    test("disable search", function () {
//        window["sap-ushell-config"] = {
//            renderers: {
//                fiori2: {
//                    componentData: {
//                        config: {
//                            enableSearch: false
//                        }
//                    }
//                }
//            }
//        };
//        sap.ushell.bootstrap("local");
//        var oUserRecentsStub = sinon.stub(sap.ushell.Container.getService("UserRecents"), "addAppUsage");
//
//        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
//        var search = sap.ui.getCore().byId("sf");
//        ok(!search, 'verify search field is hidden');
//        oRenderer.destroy();
//        oUserRecentsStub.restore();
//    });

    asyncTest("enable search", function () {
        // overwrite config only partially
        sap.ushell.bootstrap("local");

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        setTimeout(function () {
            var search = sap.ui.getCore().byId("sf");
            ok(search, 'verify search field is displayed');
            start();
        }, 100);

    });

    asyncTest("Contact Support Button disabled by default", function () {
        sap.ushell.bootstrap("local");

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        setTimeout(function () {
            //Invoke opening of the Action Sheet
            sap.ui.getCore().byId("mainShell").fireAfterRendering();
            sap.ui.getCore().byId("actionsBtn").firePress();

            var isVisible = sap.ui.getCore().byId("ContactSupportBtn").getVisible();
            ok(!isVisible, 'verify contact support button is hidden');
            start();
        }, 100);
    });

    asyncTest("Enable Contact Support Button", function () {
        // overwrite config only partially
        jQuery.sap.getObject("sap-ushell-config", 0).renderers = {
            fiori2: {
                componentData: {
                    config: {
                        appState : "standalone",
                        changeOpacity : "off",
                        rootIntent : "Shell-home",
                        applications: {
                            "Shell-home" : {

                            }
                        }
                    }
                }
            }
        };
        jQuery.sap.getObject("sap-ushell-config.services", 0).SupportTicket = {
            // service has to be enabled explicitly
            config: {
                enabled: true
            }
        };
        sap.ushell.bootstrap("local");

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        setTimeout(function () {
            //Invoke opening of the Action Sheet
            sap.ui.getCore().byId("mainShell").fireAfterRendering();
            sap.ui.getCore().byId("actionsBtn").firePress();

            var isVisible = sap.ui.getCore().byId("ContactSupportBtn").getVisible();
            ok(isVisible, 'verify contact support button is displayed');
            start();
        }, 100);
    });

    asyncTest("create renderer with url params including resolved navigation", function () {
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "standalone";
//        config.services = undefined;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").done(function () {
            var oShell,
                stateName;

            // this is an asyn call!
            start();
            jQuery.sap.require("sap.ui.core.routing.Router");
            window.hasher.setHash("#xxxx-yyy~navResCtx?navigationMode=newWindowThenEmbedded&additionalInformation=&applicationType=URL&url=http%253A%252F%252Fwalla.co.il");
            oRendererControl = sap.ushell.Container.createRenderer("fiori2");
            oShell = sap.ui.getCore().byId("shell");
            stateName = oShell.getModel().getProperty("/currentState").stateName;
            ok(stateName === 'standalone', 'state is standalone');
            window.hasher.setHash("");
        });
    });

    asyncTest("Headerless application state & personalization enablement 1", function () {
        var config = _getContainerConfiguration();

        config.renderers.fiori2.componentData.config.appState =  "headerless";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local");

        // first test is to see that personalization is off due to the headerless mode
        oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        setTimeout(function () {
            var oShell = sap.ui.getCore().byId("shell"),
                bEnablePers = oShell.getModel().getProperty("/personalization");

            ok(bEnablePers === false, 'verify personalization is off due to appstate headerless mode');

            //reset the headerVisible property that was changed in this test for other tests
            oShell.getModel().setProperty("/states/home/headerVisible", true);

            start();
        }, 100);
    });

    asyncTest("Headerless application state & personalization enablement 2", function () {
         // second test is to see that personalization is off due to headerless mode (even though configuration indicates that personalization if enabled)
        var config = _getContainerConfiguration();

        config.renderers.fiori2.componentData.config.appState =  "headerless";
        config.renderers.fiori2.componentData.config.enablePersonalization =  true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local");
        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        setTimeout(function () {
            var oShell = sap.ui.getCore().byId("shell"),
                bEnablePers = oShell.getModel().getProperty("/personalization");

            ok(bEnablePers === false, 'verify personalization is off due to appstate headerless mode even when configuration allows personalization');

            //reset the headerVisible property that was changed in this test for other tests
            oShell.getModel().setProperty("/states/home/headerVisible", true);

            start();
        }, 100);
    });

    asyncTest("Headerless application state & personalization enablement 3", function () {
        // third test is to see that personalization is off due to non-headerless mode BUT configuration set personalization off
        var config = _getContainerConfiguration();

        config.renderers.fiori2.componentData.config.appState =  "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization =  false;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local");
        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        setTimeout(function () {
            var oShell = sap.ui.getCore().byId("shell"),
                bEnablePers = oShell.getModel().getProperty("/personalization");

            ok(bEnablePers === false, 'verify personalization is off due to non-headerless mode BUT configuration set personalization off');
            start();
        }, 100);
    });

    asyncTest("Headerless application state & personalization enablement 4", function () {
          // fourth test is to see that personalization is off due to non-headerless mode BUT configuration simply do not have personalization property
        var config = _getContainerConfiguration();

        config.renderers.fiori2.componentData.config.appState =  "standalone";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local");

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        setTimeout(function () {
            var oShell = sap.ui.getCore().byId("shell"),
                bEnablePers = oShell.getModel().getProperty("/personalization");

            ok(bEnablePers === false, 'verify personalization is off due to non-headerless mode BUT configuration simply do not have personalization property');

            start();
        }, 100);
    });

    asyncTest("Headerless application state & personalization enablement 5", function () {
        // fifth test is to see that personalization is on due to non-headerless mode and configuration enables personalization
        var config = _getContainerConfiguration();

        config.renderers.fiori2.componentData.config.appState =  "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization =  true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local");

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        setTimeout(function () {
            var oShell = sap.ui.getCore().byId("shell"),
                bEnablePers = oShell.getModel().getProperty("/personalization");

            ok(bEnablePers === true, 'verify personalization is on due to non-headerless mode and configuration enables personalization');

            start();
        }, 100);
    });

    asyncTest("create custom shell", function () {
        // fifth test is to see that personalization is on due to non-headerless mode and configuration enables personalization
        var config = _getContainerConfiguration();

        config.renderers.fiori2.componentData.config.appState =  "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization =  true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local");

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        setTimeout(function () {
            var oShell = sap.ui.getCore().byId("shell"),
                bEnablePers = oShell.getModel().getProperty("/personalization"),
                oModel,
                oCurrentState,
                oTileActionsButton;

            sap.ushell.Container.getRenderer("fiori2").createExtendedShellState('test1', function () {
                oTileActionsButton = sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                    id: "testx1",
                    text: "testx1",
                    icon: 'sap-icon://edit',
                    tooltip: sap.ushell.resources.i18n.getText("activateActionMode"),
                    press: function () {
                        sap.ushell.components.flp.ActionMode.toggleActionMode(oModel, "Menu Item");
                    }
                }, true, true);
            });

            sap.ushell.Container.getRenderer("fiori2").applyExtendedShellState('test1');

            oModel = oShell.getModel();
            oCurrentState = oModel.getProperty("/currentState");

            ok(oCurrentState.actions[0] === "ContactSupportBtn", 'Validate ContactSupportBtn at action[0]');
            ok(oCurrentState.actions[1] === "EndUserFeedbackBtn", 'Validate EndUserFeedbackBtn at action[1]');
            ok(oCurrentState.actions[2] === "userPreferencesButton", 'Validate userPreferencesButton at action[2]');
            ok(oCurrentState.actions[3] === "testx1", 'Validate testx1 at action[3]');
            ok(oCurrentState.actions[4] === "logoutBtn", 'Validate logoutBtn at action[4]');

            start();
        }, 100);
    });

    asyncTest("shell api, validate apply extended shell state override current shell.", function () {
        // fifth test is to see that personalization is on due to non-headerless mode and configuration enables personalization
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization =  true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local");

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        setTimeout(function () {
            var oShell = sap.ui.getCore().byId("shell");
            var bEnablePers = oShell.getModel().getProperty("/personalization");
            sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                id: "base1",
                text: "base1",
                icon: 'sap-icon://edit',
                tooltip: sap.ushell.resources.i18n.getText("activateActionMode"),
                press: function () {
                    sap.ushell.components.flp.ActionMode.toggleActionMode(oModel, "Menu Item");
                }
            }, true, true);

            sap.ushell.Container.getRenderer("fiori2").createExtendedShellState('test1', function () {
                sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem",{
                    id: "testx1",
                    text: "testx1",
                    icon: 'sap-icon://edit',
                    tooltip: sap.ushell.resources.i18n.getText("activateActionMode"),
                    press: function () {
                        sap.ushell.components.flp.ActionMode.toggleActionMode(oModel, "Menu Item");
                    }
                }, true, true);
            });

            sap.ushell.Container.getRenderer("fiori2").applyExtendedShellState('test1');

            var oModel = oShell.getModel();
            var oCurrentState = oModel.getProperty("/currentState");

            ok(oCurrentState.actions[0] === "ContactSupportBtn", 'Validate ContactSupportBtn at action[0]');
            ok(oCurrentState.actions[1] === "EndUserFeedbackBtn", 'Validate EndUserFeedbackBtn at action[1]');
            ok(oCurrentState.actions[2] === "userPreferencesButton", 'Validate userPreferencesButton at action[2]');
            ok(oCurrentState.actions[3] === "testx1", 'Validate testx1 at action[4]');
            ok(oCurrentState.actions[4] === "base1", 'Validate base1 at action[3]');
            ok(oCurrentState.actions[5] === "logoutBtn", 'Validate logoutBtn at action[5]');

            start();
        }, 100)

    });

    asyncTest("shell api, validate apply extended shell state override base shell state home.", function () {
        // fifth test is to see that personalization is on due to non-headerless mode and configuration enables personalization
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization =  true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local");

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        setTimeout(function () {
            var oShell = sap.ui.getCore().byId("shell");
            var bEnablePers = oShell.getModel().getProperty("/personalization");
            var homeBase1Element = sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                id: "homebase1",
                text: "homebase1",
                icon: 'sap-icon://edit',
                tooltip: sap.ushell.resources.i18n.getText("activateActionMode"),
                press: function () {
                    sap.ushell.components.flp.ActionMode.toggleActionMode(oModel, "Menu Item");
                }
            }, true, false, ["home"]);

            sap.ushell.Container.getRenderer("fiori2").createExtendedShellState('test1', function () {
                sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem",{
                    id: "testx1",
                    text: "testx1",
                    icon: 'sap-icon://edit',
                    tooltip: sap.ushell.resources.i18n.getText("activateActionMode"),
                    press: function () {
                        sap.ushell.components.flp.ActionMode.toggleActionMode(oModel, "Menu Item");
                    }
                }, true, true);
            });

            sap.ushell.Container.getRenderer("fiori2").applyExtendedShellState('test1');

            var oModel = oShell.getModel();
            var oCurrentState = oModel.getProperty("/currentState");

            ok(oCurrentState.actions[0] === "ContactSupportBtn", 'Validate ContactSupportBtn at action[0]');
            ok(oCurrentState.actions[1] === "EndUserFeedbackBtn", 'Validate EndUserFeedbackBtn at action[1]');
            ok(oCurrentState.actions[2] === "userPreferencesButton", 'Validate userPreferencesButton at action[2]');
            ok(oCurrentState.actions[3] === "homebase1", 'Validate homebase1 at action[3]');
            ok(oCurrentState.actions[4] === "testx1", 'Validate testx1 at action[4]');
            ok(oCurrentState.actions[5] === "logoutBtn", 'Validate logoutBtn at action[5]');

            sap.ushell.Container.getRenderer("fiori2").hideActionButton([homeBase1Element.getId()], false, ["home"]);            
            start();
        }, 100)

    });

    /**
     * Verify that the renderer API function setFloatingContainerContent eventually calls the shell.controller function _setShellItem,
     * with the crrect PropertyString and statuses  
     */
    test("Floating cotnainer - test setFloatingContainerContent", function () {
        sap.ushell.bootstrap("local");
        var oShellView,
            oShellController,
            oButton,
            oShellSetItemStub,
            oWrapperDomElement,
            oDomNode;

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        oShellView = sap.ui.getCore().byId("mainShell");
        oShellController = oShellView.getController();
        oButton = new sap.m.Button("testButton", {test: "testButton"});
        oShellSetItemStub = sinon.stub(oShellController, "_setShellItem").returns();
        oWrapperDomElement = document.createElement("DIV");
        oWrapperDomElement.className = "sapUshellShellFloatingContainerWrapper";
        oDomNode = document.getElementById("qunit");
        oDomNode.appendChild(oWrapperDomElement);

        sap.ushell.Container.getRenderer("fiori2").setFloatingContainerContent(oButton, false, ["home", "app"]);

        ok(oShellSetItemStub.calledOnce === true, "Shell controller function _setShellItem called once");
        ok(oShellSetItemStub.args[0][0] === "floatingContainerContent", "Shell controller function _setShellItem called with PropertyString: floatingContainerContent");
        ok(oShellSetItemStub.args[0][3][0] === "home", "Shell controller function _setShellItem called with 1st status: home");
        ok(oShellSetItemStub.args[0][3][1] === "app", "Shell controller function _setShellItem called with 2nd status: app");

        oShellSetItemStub.restore();
    });

    /**
     * Verify that the renderer API function setFloatingContainerVisibility eventually calls ShellView.OUnifiedShell function setFloatingContainerVisible
     * with the correct boolean parameter
     */
    test("Floating cotnainer - test setFloatingContainerVisible", function () {
        sap.ushell.bootstrap("local");
        var oShellView,
            oUnifiedShell,
            oShellSetVisibilityStub;

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        oShellView = sap.ui.getCore().byId("mainShell");
        oUnifiedShell = oShellView.getOUnifiedShell();
        oShellSetVisibilityStub = sinon.stub(oUnifiedShell, "setFloatingContainerVisible").returns();

        sap.ushell.Container.getRenderer("fiori2").setFloatingContainerVisibility(true);

        ok(oShellSetVisibilityStub.calledOnce === true, "ShellView.getOUnifiedShell().setFloatingContainerVisible called once");
        ok(oShellSetVisibilityStub.args[0][0] === true, "ShellView.OUnifiedShell function setFloatingContainerVisible called with the correct boolean parameter");

        oShellSetVisibilityStub.restore();
    });

    /**
     * Verify that the renderer API function getFloatingContainerVisiblity eventually calls ShellView.OUnifiedShell function getFloatingContainerVisible
     */
    test("Floating cotnainer - test getFloatingContainerVisible", function () {
        sap.ushell.bootstrap("local");
        var oShellView,
            oUnifiedShell,
            oShellGetVisibilityStub;

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        oShellView = sap.ui.getCore().byId("mainShell");
        oUnifiedShell = oShellView.getOUnifiedShell();
        oShellGetVisibilityStub = sinon.stub(oUnifiedShell, "getFloatingContainerVisible").returns();

        sap.ushell.Container.getRenderer("fiori2").getFloatingContainerVisiblity(true);

        ok(oShellGetVisibilityStub.calledOnce === true, "ShellView.getOUnifiedShell().setFloatingContainerVisible called once");

        oShellGetVisibilityStub.restore();
    });

    asyncTest("shell api, custom merge function.", function () {
        // fifth test is to see that personalization is on due to non-headerless mode and configuration enables personalization
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization =  true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local");

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        setTimeout(function () {
            var oShell = sap.ui.getCore().byId("shell");
            var bEnablePers = oShell.getModel().getProperty("/personalization");

            sap.ushell.Container.getRenderer("fiori2").createExtendedShellState('test1', function () {
                sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem",{
                    id: "testx1",
                    text: "testx1",
                    icon: 'sap-icon://edit',
                    tooltip: sap.ushell.resources.i18n.getText("activateActionMode"),
                    press: function () {
                        sap.ushell.components.flp.ActionMode.toggleActionMode(oModel, "Menu Item");
                    }
                }, true, true);
            });

            sap.ushell.Container.getRenderer("fiori2").applyExtendedShellState('test1', function (oCustomStateJSON) {
                sap.ushell.Container.getRenderer("fiori2").showHeaderItem(oCustomStateJSON.headItems, true);
                sap.ushell.Container.getRenderer("fiori2").showToolAreaItem(oCustomStateJSON.toolAreaItems, true);
                sap.ushell.Container.getRenderer("fiori2").showHeaderEndItem(oCustomStateJSON.headEndItems, true);
                sap.ushell.Container.getRenderer("fiori2").showSubHeader(oCustomStateJSON.subHeader, true);
                sap.ushell.Container.getRenderer("fiori2").showActionButton(oCustomStateJSON.actions, true, undefined, true);
                sap.ushell.Container.getRenderer("fiori2").showLeftPaneContent(oCustomStateJSON.paneContent, true);
                sap.ushell.Container.getRenderer("fiori2").showFloatingActionButton(oCustomStateJSON.floatingActions, true);
            });

            var oModel = oShell.getModel();
            var oCurrentState = oModel.getProperty("/currentState");

            ok(oCurrentState.actions[0] === "ContactSupportBtn", 'Validate ContactSupportBtn at action[1]');
            ok(oCurrentState.actions[1] === "EndUserFeedbackBtn", 'Validate EndUserFeedbackBtn at action[2]');
            ok(oCurrentState.actions[2] === "userPreferencesButton", 'Validate userPreferencesButton at action[3]');
            ok(oCurrentState.actions[3] === "testx1", 'Validate testx1 at action[0]');
            ok(oCurrentState.actions[4] === "logoutBtn", 'Validate logoutBtn at action[5]');

            start();
        }, 100)
    });

//    asyncTest("iframe intent", function () {
//        var iframe = document.createElement("iframe");
//        iframe.setAttribute('id', 'flp');
//        document.body.appendChild(iframe);
//        iframe.setAttribute('src', '/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html?appState=standalone#UI2Fiori2SampleApps-appnavsample');
//        jQuery(iframe).css({visibility: 'hidden', width: 0, height: 0});
//
//        iframe.onload = function () {
//            var iframeWin = iframe.contentWindow;
//            //Invoke opening of the Action Sheet
//            var oShell = iframeWin.sap.ui.getCore().byId("shell");
//            var stateName = oShell.getModel().getProperty("/currentState").stateName;
//
//            jQuery(iframe).remove();
//            ok(stateName === 'standalone', 'state is standalone');
//            start();
//        };
//    });
//
//    asyncTest("iframe resolved", function () {
//        var iframe = document.createElement("iframe");
//        iframe.setAttribute('id', 'flp1');
//        document.body.appendChild(iframe);
//        iframe.setAttribute('src', '/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html?appState=standalone#xxxx-yyy~navResCtx?additionalInformation=&applicationType=URL&url=http%253A%252F%252Fwalla.co.il');
//        jQuery(iframe).css({visibility: 'hidden', width: 0, height: 0});
//
//        iframe.onload = function () {
//            var iframeWin = iframe.contentWindow;
//            //Invoke opening of the Action Sheet
//            var oShell = iframeWin.sap.ui.getCore().byId("shell");
//            var stateName = oShell.getModel().getProperty("/currentState").stateName;
//
//            jQuery(iframe).remove();
//            ok(stateName === 'standalone', 'state is standalone');
//            start();
//        };
//    });
    /**
     * test EdnUserFeedback UI API
     */
    test("Renderer API - EndUserFeedback", function () {
        sap.ushell.bootstrap("local");
        var oContainer = sap.ushell.Container.createRenderer("fiori2"),
            oRenderer = sap.ushell.Container.getRenderer("fiori2"),
            oShellView = sap.ui.getCore().byId("mainShell"),
            oController = oShellView.getController(),
            oEndUserFeedbackConfiguration = oController.oEndUserFeedbackConfiguration;

        ok(oEndUserFeedbackConfiguration.anonymousByDefault === true, "Initial value of oEndUserFeedbackConfiguration.anonymousByDefault is true");
        ok(oEndUserFeedbackConfiguration.showLegalAgreement === true, "Initial value of oEndUserFeedbackConfiguration.showLegalAgreement is true");

        oRenderer.makeEndUserFeedbackAnonymousByDefault(false);
        oRenderer.showEndUserFeedbackLegalAgreement(false);

        ok(oEndUserFeedbackConfiguration.anonymousByDefault === false, "After API call - Value of oEndUserFeedbackConfiguration.anonymousByDefault is false");
        ok(oEndUserFeedbackConfiguration.showLegalAgreement === false, "After API call - Value of oEndUserFeedbackConfiguration.showLegalAgreement is false");

        oRenderer.destroy();
        oContainer.destroy();
    });

    
    /**
     * test setHeaderVisibility API
     */
    test("Renderer API - setHeaderVisibility", function () {
        sap.ushell.bootstrap("local");
        var oContainer = sap.ushell.Container.createRenderer("fiori2"),
            oRenderer = sap.ushell.Container.getRenderer("fiori2");

        var oShellView = sap.ui.getCore().byId("mainShell");
        var oController = oShellView.getController();
        var oModel = oShellView.getModel();

        var bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, true, "Header visibility = true by default");

        oRenderer.setHeaderVisibility(false, true);
        bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, false, "Header visibility = false after calling the API");
        oController.switchViewState("app");
        bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, true, "Header visibility = true after changing the state");
        oController.switchViewState("home");
        bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, false, "Header visibility = false after changing the state to home");


        oRenderer.setHeaderVisibility(false, false, ["home"]);
        bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, false, "Header visibility = false after calling the API on state home");
        oController.switchViewState("app");
        bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, true, "Header visibility = true after changing the state toa app");
        oController.switchViewState("home");
        bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, false, "Header visibility = false after changing the state to home again");


        oRenderer.setHeaderVisibility(false, false, ["home", "app"]);
        bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, false, "Header visibility = false after calling the API on state home and app");
        oController.switchViewState("app");
        bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, false, "Header visibility = true after changing the state toa app");
        oController.switchViewState("home");
        bHeaderVisible = oModel.getProperty("/currentState/headerVisible");
        equal(bHeaderVisible, false, "Header visibility = true after changing the state to home again");

        oRenderer.destroy();
        oContainer.destroy();
    });

    test("Header Items - test showSeparator", function () {
        sap.ushell.bootstrap("local");
        var oShellView,
            oShellController,
            isFiori2Stub,
            oControl;

        oRendererControl = sap.ushell.Container.createRenderer("fiori2");

        oShellView = sap.ui.getCore().byId("mainShell");
        oShellController = oShellView.getController();
        isFiori2Stub = sinon.stub(oShellController, "isFiori2");

        //check default behavior for Fiori1
        sap.ushell.Container.getRenderer("fiori2").addHeaderItem(undefined, {id: "headerItem"}, false, true);
        sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem(undefined, {id: "headerEndItem"}, false, true);

        equals(isFiori2Stub.callCount, 2, "isFiori2 called twice");
        oControl = sap.ui.getCore().byId("headerItem");
        equals(oControl.getShowSeparator(), true, "default showSeparator flag should be true");
        oControl.destroy();
        oControl = sap.ui.getCore().byId("headerEndItem");
        equals(oControl.getShowSeparator(), true, "default showSeparator flag should be true");
        oControl.destroy();

        //check default behavior for Fiori2
        isFiori2Stub.returns(true);
        sap.ushell.Container.getRenderer("fiori2").addHeaderItem(undefined, {id: "headerItem"}, false, true);
        sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem(undefined, {id: "headerEndItem"}, false, true);

        equals(isFiori2Stub.callCount, 4, "isFiori2 called 2 more times");
        oControl = sap.ui.getCore().byId("headerItem");
        equals(oControl.getShowSeparator(), false, "in Fiori2 showSeparator flag should be false");
        oControl.destroy();
        oControl = sap.ui.getCore().byId("headerEndItem");
        equals(oControl.getShowSeparator(), false, "in Fiori2 showSeparator flag should be false");
        oControl.destroy();

        isFiori2Stub.restore();
    });



}());
