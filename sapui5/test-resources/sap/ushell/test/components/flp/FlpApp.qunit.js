// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.components.flp.launchpad.dashboard.DashboardContent
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.components.flp.launchpad.DashboardManager");
    jQuery.sap.require("sap.ushell.renderers.fiori2.AccessKeysHandler");
    jQuery.sap.require("sap.ushell.renderers.fiori2.RendererExtensions");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");

    var oComponent,
        sComponentName = "sap.ushell.components.flp",
        sUrl = "/ushell/resources/sap/ushell/components/flp/",
        oComponentData =
        {
            config: {
                enableSetTheme: true,
                enableHelp: true,
                preloadLibrariesForRootIntent: false,
                applications: {
                    "Shell-home" : {
                        enableActionModeMenuButton: true,
                        enableActionModeFloatingButton: true,
                        enableTileActionsIcon: false,
                        enableHideGroups: true,
                        enableHelp: true,
                        enableLockedGroupsCompactLayout: false,
                        enableTilesOpacity: false
                    }
                },
                rootIntent: "Shell-home"
            }
        },
        sDashboardViewName = "sap.ushell.components.flp.launchpad.dashboard.DashboardContent",
        sCatalogViewName = "sap.ushell.components.flp.launchpad.appfinder.Catalog",
        sAppFinderViewName = "sap.ushell.components.flp.launchpad.appfinder.AppFinder",
        oLoadingDialog,
        fAddHeaderItemStub,
        fSetLeftPaneVisibilityStub,
        fAddOptionsActionSheetButtonStub,
        fSetHeaderHidingStub,
        fGetConfiguration,
        oViewPortContainer;

    module("sap.ushell.components.flp.Component", {
        setup: function () {
            sap.ushell.bootstrap("local");
            sap.ushell.Container.getRenderer = function () {
                return {
                    createExtendedShellState : function() {

                    },
                    applyExtendedShellState: function () {

                    },
                    getModelConfiguration: function () {
                        return {
                            enableNotificationsUI: true
                        };
                    },
                    getCurrentViewportState: function () {
                        return 'Center';
                    },
                    isFiori2: function () {
                        return false;
                    }
                };
            };
            oLoadingDialog = new sap.ushell.ui.launchpad.LoadingDialog({
                id: "loadingDialog"
            });
            oViewPortContainer = new sap.ushell.ui.launchpad.ViewPortContainer({
                id: "viewPortContainer"
            });
            fAddHeaderItemStub = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "addHeaderItem");
            fSetLeftPaneVisibilityStub = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "setLeftPaneVisibility");
            fAddOptionsActionSheetButtonStub = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "addOptionsActionSheetButton");
            fSetHeaderHidingStub = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "setHeaderHiding");
            fGetConfiguration = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "getConfiguration").returns({
                enableSetTheme: true,
                enableHelp: true,
                preloadLibrariesForRootIntent: false
            });

            oComponent = sap.ui.component({
                id: "applicationsap-ushell-components-flp-component",
                name: sComponentName,
                componentData : oComponentData
            });

        },
        teardown: function () {
            delete sap.ushell.Container;
            oComponent.destroy();
            oLoadingDialog.destroy();
            fAddHeaderItemStub.restore();
            fSetLeftPaneVisibilityStub.restore();
            fAddOptionsActionSheetButtonStub.restore();
            fSetHeaderHidingStub.restore();
            fGetConfiguration.restore();
            hasher.setHash('');
            var oHideGroupsBtn = sap.ui.getCore().byId("hideGroupsBtn");
            if (oHideGroupsBtn) {
                oHideGroupsBtn.destroy();
            }
            oViewPortContainer.destroy();
        }
    });

    test("test setTilesNoVisibility is called on app launch",function (){
        var oController = new sap.ui.controller("sap.ushell.components.flp.launchpad.dashboard.DashboardContent"),
            oData = {
                additionalInformation: {
                    indexOf: function (data) {
                        return -1;
                    }
                }
            },
            originalGetOwnerComponent = oController.getOwnerComponent;
        oController.getOwnerComponent = function () {
            return {
                getMetadata: function () {
                    return {
                        getComponentName: function () {
                            return 1;
                        }
                    };
                }
            };
        };
        var spySetTilesNoVisibility = sinon.spy(sap.ushell.utils,"setTilesNoVisibility"),
            oModel = new sap.ui.model.json.JSONModel({
                currentViewName: "home",
                tileActionModeActive: true,
                getProperty: function () {
                }
            });
        oController.getView = sinon.stub().returns({
            getModel : function () {
                return oModel;
            }
        });
        jQuery.sap.require("sap.ushell.components.flp.ActionMode");
        sap.ushell.components.flp.ActionMode.init(oModel);
        oController._appOpenedHandler("","",oData);

        ok("Test setTilesNoVisibility is called on app launch (not home app)",spySetTilesNoVisibility.called);
        oController.getOwnerComponent =  originalGetOwnerComponent;
        oController.destroy();
    });

    test("create instance", function () {
        sap.ushell.Container.getRenderer = function () {
            return {
                createExtendedShellState : function () {

                },
                applyExtendedShellState: function () {

                }
            };
        };

        jQuery.sap.registerResourcePath (sComponentName, sUrl);
        ok(oComponent,'Instance was created');

    });
    test("application configurations were saved on component data", function () {
        jQuery.sap.registerResourcePath (sComponentName, sUrl);

        var oConfig = oComponent.getComponentData().config,
            oAppData = oConfig.applications[oConfig.rootIntent];
        ok(oAppData.hasOwnProperty("enableHideGroups"),'Application configuration property exists');
        ok(!oAppData.hasOwnProperty("preloadLibrariesForRootIntent"),'Shell configuration property does not exists');
    });

    test("verify component's router views", function () {
        jQuery.sap.registerResourcePath (sComponentName, sUrl);

        var oRouter = oComponent.getRouter();
        ok(oRouter,'Router was created successfully');

        var oViews = oRouter.getViews()._oViews;
        ok(oViews.hasOwnProperty(sDashboardViewName),'After initializing the router, the dashboard view exists');

        var fLoadAllCatalogsStub = sinon.stub(oComponent.oDashboardManager, "loadAllCatalogs");

        oRouter.navTo("catalog");
        ok(oViews[sAppFinderViewName].getContent()[0].getContent()[0].sViewName == sCatalogViewName,'After navigation to the catalog, the catalog view exists');

        fLoadAllCatalogsStub.restore();
    });

    test("verify dashboard and catalog views were created successfully", function () {
        jQuery.sap.registerResourcePath (sComponentName, sUrl);

        var oRouter = oComponent.getRouter(),
            oViews = oRouter.getViews()._oViews,
            oDashboardView = oViews[sDashboardViewName];

        ok(oDashboardView.getContent().length > 0,'get Dashboard Content Test');
        oDashboardView.destroy();

        var fLoadAllCatalogsStub = sinon.stub(oComponent.oDashboardManager, "loadAllCatalogs");

        oRouter.navTo("catalog");
        var oCatalogView = oViews[sAppFinderViewName];

        ok(oCatalogView.getContent().length > 0,'get Catalog Content Test');
        oCatalogView.destroy();

        fLoadAllCatalogsStub.restore();
    });

    test("catalog create content Test", function () {
        var oController = sap.ui.controller("sap.ushell.components.flp.launchpad.appfinder.Catalog"),
            tileTitle = "tile_title",
            firstAddedGroupTitle = "first_added_group",
            firstRemovedGroupTitle = "first_removed_group",
            numberOfAddedGroups = [1, 0, 1, 2, 2, 0, 1, 2],
            numberOfRemovedGroups = [0, 1, 1, 0, 1, 2, 2, 2],
            getTextFromBundle = sap.ushell.resources.i18n,
            successMessages = [
                getTextFromBundle.getText("tileAddedToSingleGroup", [tileTitle, firstAddedGroupTitle]),
                getTextFromBundle.getText("tileRemovedFromSingleGroup", [tileTitle, firstRemovedGroupTitle]),
                getTextFromBundle.getText("tileAddedToSingleGroupAndRemovedFromSingleGroup", [tileTitle, firstAddedGroupTitle, firstRemovedGroupTitle]),
                getTextFromBundle.getText("tileAddedToSeveralGroups", [tileTitle, numberOfAddedGroups[3]]),
                getTextFromBundle.getText("tileAddedToSeveralGroupsAndRemovedFromSingleGroup", [tileTitle, numberOfAddedGroups[4], firstRemovedGroupTitle]),
                getTextFromBundle.getText("tileRemovedFromSeveralGroups", [tileTitle, numberOfRemovedGroups[5]]),
                getTextFromBundle.getText("tileAddedToSingleGroupAndRemovedFromSeveralGroups", [tileTitle, firstAddedGroupTitle, numberOfRemovedGroups[6]]),
                getTextFromBundle.getText("tileAddedToSeveralGroupsAndRemovedFromSeveralGroups", [tileTitle, numberOfAddedGroups[7], numberOfRemovedGroups[7]])
            ];

        for (var index = 0; index < numberOfAddedGroups.length; index++) {
            var message = oController.prepareDetailedMessage(tileTitle, numberOfAddedGroups[index], numberOfRemovedGroups[index], firstAddedGroupTitle, firstRemovedGroupTitle);
            ok(successMessages[index] == message, 'Expected message: ' + successMessages[index] + ' Message returned: ' + message);
        }
        oController.destroy();
    });

    test("verify flp does not change shell on shellViewStateChanged", function () {
        sinon.spy(sap.ushell.Container.getRenderer(), "applyExtendedShellState");

        jQuery.sap.registerResourcePath (sComponentName, sUrl);
        sap.ui.getCore().getEventBus().publish("launchpad", "shellViewStateChanged");

        //validate that shell api is not invoked.
        ok(!sap.ushell.Container.getRenderer().applyExtendedShellState.called, 'validate that shell api is not invoked.');
    });


    test("error handling content Test", function () {
        var oController = sap.ui.controller("sap.ushell.components.flp.launchpad.appfinder.Catalog"),
            tileTitle = "tile_title",
            numberOfAddToGroupsFails =      [0, 0, 1, 0, 2, 0, 1],
            numberOfRemoveFromGroupsFails = [0, 1, 0, 1, 0, 2, 1],
            createNewGroupFail =            [1, 1, 0, 0, 0, 0, 0],
            oGroup = {title: "test group"},
            oErroneousActions = [],
            getTextFromBundle = sap.ushell.resources.i18n,
            failMessages = [
                getTextFromBundle.getText("fail_tile_operation_create_new_group"),
                getTextFromBundle.getText("fail_tile_operation_some_actions"),
                getTextFromBundle.getText("fail_tile_operation_add_to_group", [tileTitle, oGroup.title]),
                getTextFromBundle.getText("fail_tile_operation_remove_from_group", [tileTitle, oGroup.title]),
                getTextFromBundle.getText("fail_tile_operation_add_to_several_groups", [tileTitle]),
                getTextFromBundle.getText("fail_tile_operation_remove_from_several_groups", [tileTitle]),
                getTextFromBundle.getText("fail_tile_operation_some_actions")
            ];

        for (var index = 0; index < numberOfAddToGroupsFails.length; index++) {
            oErroneousActions = [];
            if (numberOfAddToGroupsFails[index] > 0){
                for (var actionIndex = 0; actionIndex < numberOfAddToGroupsFails[index]; actionIndex++) {
                    oErroneousActions.push({group: oGroup, status: 0, action: actionIndex == 0 ? 'addTileToNewGroup' : 'add'});
                }
            }
            if (numberOfRemoveFromGroupsFails[index] > 0){
                for (var actionIndex = 0; actionIndex < numberOfRemoveFromGroupsFails[index]; actionIndex++) {
                    oErroneousActions.push({group: oGroup, status: 0, action: 'remove'});
                }
            }
            if (createNewGroupFail[index] > 0){
                oErroneousActions.push({group: oGroup, status: 0, action: 'createNewGroup'});
            }

            var message = oController.prepareErrorMessage(oErroneousActions, tileTitle);
            ok(failMessages[index] == getLocalizedText(message.messageId, message.parameters), 'Expected message: ' + failMessages[index] + ' Message returned: ' + message);
        }
        oController.destroy();
    });

    var getLocalizedText = function (sMsgId, aParams) {
        return aParams ? sap.ushell.resources.i18n.getText(sMsgId, aParams)  : sap.ushell.resources.i18n.getText(sMsgId);
    };
}());
