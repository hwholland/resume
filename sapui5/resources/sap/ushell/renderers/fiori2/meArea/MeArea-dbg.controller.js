// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, setTimeout, clearTimeout */
    /*jslint plusplus: true, nomen: true */
    var oModel = new sap.ui.model.json.JSONModel({
        actions: [],
        userPreferences : {
            entries : []
        },
        apps : {
            recentActivities: []
        }
    });
    sap.ui.controller("sap.ushell.renderers.fiori2.meArea.MeArea", {
        onInit: function () {
            this.aControlsWithPressHandler = [];
            this.getView().setModel(oModel, "meAreaModel");
            this._addActionItemToOverflowSupport();
        },

        onBeforeRendering: function () {
            if (oModel.getProperty('/apps/recentActivities') && oModel.getProperty('/apps/recentActivities').length) {
                return;
            }
            this.refreshUserActivities();
        },

        refreshUserActivities: function () {
            var oUserRecentsSrvc = sap.ushell.Container.getService('UserRecents');
            oUserRecentsSrvc.getRecentActivity().done(function (aActivity) {
                aActivity.forEach(function(oItem) {
                    oItem.timestamp = sap.ushell.utils.formatDate(oItem.timestamp);
                });
                oModel.setProperty('/apps/recentActivities', aActivity);
            });
        },

        createViewByName : function (oEvent, sName, sViewId) {
            var oView = sViewId ? sap.ui.getCore().byId(sViewId) : null;
            if (!oView) {
                var oSrc = oEvent.getSource(),
                    oCtx = oSrc.getBindingContext(),
                    sPath = oCtx ? oCtx.getPath() : "",
                    sViewName = sName || oCtx.getModel().getProperty(sPath + "/viewName");

                sViewId = sViewId || oCtx.getModel().getProperty(sPath + "/id");
                oView = sap.ui.view(sViewId, {
                    viewName: sViewName,
                    type: 'JS',
                    viewData: {}
                });
            }

            return oView;
        },

        logout: function () {
            jQuery.sap.require('sap.m.MessageBox');
            var oLoading = new sap.ushell.ui.launchpad.LoadingDialog({text: ""}),
                bShowLoadingScreen = true,
                bIsLoadingScreenShown = false,
                oLogoutDetails = {};

            sap.ushell.Container.getGlobalDirty().done(function (dirtyState) {
                bShowLoadingScreen = false;
                if (bIsLoadingScreenShown === true) {
                    oLoading.exit();
                    oLoading = new sap.ushell.ui.launchpad.LoadingDialog({text: ""});
                }

                var _getLogoutDetails = function (dirtyState) {
                    var oLogoutDetails = {},
                        oResourceBundle = sap.ushell.resources.i18n;

                    if (dirtyState === sap.ushell.Container.DirtyState.DIRTY) {
                        // show warning only if it is sure that there are unsaved changes
                        oLogoutDetails.message = oResourceBundle.getText('unsaved_data_warning_popup_message');
                        oLogoutDetails.icon = sap.m.MessageBox.Icon.WARNING;
                        oLogoutDetails.messageTitle = oResourceBundle.getText("unsaved_data_warning_popup_title");
                    } else {
                        // show 'normal' logout confirmation in all other cases, also if dirty state could not be determined
                        oLogoutDetails.message = oResourceBundle.getText('logoutConfirmationMsg');
                        oLogoutDetails.icon = sap.m.MessageBox.Icon.QUESTION;
                        oLogoutDetails.messageTitle = oResourceBundle.getText("logoutMsgTitle");
                    }

                    return oLogoutDetails;
                };

                oLogoutDetails = _getLogoutDetails(dirtyState);
                sap.m.MessageBox.show(oLogoutDetails.message, oLogoutDetails.icon,
                    oLogoutDetails.messageTitle, [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            oLoading.openLoadingScreen();
                            oLoading.showAppInfo(sap.ushell.resources.i18n.getText('beforeLogoutMsg'), null);
                            sap.ushell.Container.logout();
                        }
                    }, sap.ui.core.ElementMetadata.uid("confirm"));
            });
            if (bShowLoadingScreen === true) {
                oLoading.openLoadingScreen();
                bIsLoadingScreenShown = true;
            }
        },

        _addPressHandlerToActions: function (oControl) {
            if (this.aControlsWithPressHandler.indexOf(oControl.getId()) === -1) {
                this.aControlsWithPressHandler.push(oControl.getId());
                oControl.attachPress(function () {
                    sap.ui.getCore().byId("viewPortContainer").switchState("Center");
                });
            }
        },
        _getControlsWithPressHandler: function () {
            return this.aControlsWithPressHandler;
        },
        _addActionItemToOverflowSupport: function () {
            if (sap.m._overflowToolbarHelpers && sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopoverControls._mSupportedControls) {
                var mSupported = sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopoverControls._mSupportedControls;
                var oPrototypeToExtend = sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopoverControls.prototype;
                var aControlNamesToAdd = [
                    "sap.ushell.ui.launchpad.ActionItem",
                    "sap.ushell.ui.footerbar.AboutButton",
                    "sap.ushell.ui.footerbar.ContactSupportButton",
                    "sap.ushell.ui.footerbar.EndUserFeedback",
                    "sap.ushell.ui.footerbar.HideGroupsButton",
                    "sap.ushell.ui.footerbar.LogoutButton",
                    "sap.ushell.ui.footerbar.UserPreferencesButton",
                    "sap.m.Button"
                ];
                var fnCapitalize = function (sName) {
                    return sName.substring(0, 1).toUpperCase() + sName.substring(1);
                };
                var oSupports = {
                    canOverflow: true,
                    listenForEvents: ["press"],
                    noInvalidationProps: ["enabled", "type"]
                };
                var fnPreProcess = function (oControl) {
                    oControl.setActionType('standard');
                    var sType = oControl.getType();

                    if (sType !== sap.m.ButtonType.Accept && sType !== sap.m.ButtonType.Reject) {
                        oControl.setType(sap.m.ButtonType.Transparent);
                    }
                };

                var fnPostProcess = function (oControl) {
                    oControl.setActionType('action');
                };
                aControlNamesToAdd.forEach(function (sName) {
                    mSupported[sName] = oSupports;
                    var sCap = sName.split(".").map(fnCapitalize).join("");
                    var sPreProcessPrefix = '_preProcess';
                    var sPostProcessPrefix = '_postProcess';
                    oPrototypeToExtend[sPreProcessPrefix + sCap] = fnPreProcess;
                    oPrototypeToExtend[sPostProcessPrefix + sCap] = fnPostProcess;
                });
            }
        }
    });
}());