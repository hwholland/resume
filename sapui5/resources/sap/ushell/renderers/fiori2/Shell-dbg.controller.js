// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, window, document, setTimeout, hasher, confirm*/

    jQuery.sap.require("sap.ui.core.IconPool");

    /* dont delay these cause they are needed for direct bookmarks */

    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.services.Message");
    jQuery.sap.require("sap.ushell.services.ShellNavigation");
    jQuery.sap.require("sap.ushell.services.UsageAnalytics");
    jQuery.sap.require("sap.ushell.services.AppConfiguration");
    jQuery.sap.require("sap.ushell.services.Notifications");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingOverlay");
    jQuery.sap.require("sap.ushell.renderers.fiori2.AccessKeysHandler");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Lifecycle");
    jQuery.sap.require("sap.ushell.utils");

    // create global model and add some demo data
    var closeAllDialogs = true,
        enableHashChange = true,
        customShellStates = {},
        isMobile = sap.ui.Device.system.phone,
        oUserRecentsService,
        oModel = new sap.ui.model.json.JSONModel({
            searchAvailable: false,
            title: "", // no default value for title
            searchFiltering: true,
            showEndUserFeedback: false,
            searchTerm: "",
            isPhoneWidth: false,
            enableNotifications: false,
            enableNotificationsUI: false,
            notificationsCount: 0,
            currentViewPortState: "Center",
            states: {
                "home": {
                    "stateName": "home",
                    "showCurtain": false,
                    "headerHiding": false,
                    "headerVisible": true,
                    "showCatalog": false,
                    "showPane": false,
                    "showRightFloatingContainer": true,
                    "headItems": [],
                    "headEndItems": ["sf"],
                    "search": "",
                    "paneContent": [],
                    "actions": ["ContactSupportBtn", "EndUserFeedbackBtn", "userPreferencesButton", "logoutBtn"],
                    "floatingActions": [],
                    "subHeader": [],
                    "toolAreaItems": [],
                    "RightFloatingContainerItems": [],
                    "toolAreaVisible": false,
                    "floatingContainerContent": [],
                    "application" : {}
                },
                "app": {
                    "stateName": "app",
                    "showCurtain": false,
                    "headerHiding": isMobile,
                    "headerVisible": true,
                    "headEndItems": ["sf"],
                    "showCatalog": false,
                    "showPane": false,
                    "showRightFloatingContainer": true,
                    "paneContent": [],
                    "search": "",
                    "headItems": ["homeBtn"],
                    "actions": ["ContactSupportBtn", "EndUserFeedbackBtn", "aboutBtn", "userPreferencesButton", "logoutBtn"],
                    "floatingActions": [],
                    "subHeader": [],
                    "toolAreaItems": [],
                    "RightFloatingContainerItems": [],
                    "toolAreaVisible": false,
                    "floatingContainerContent": [],
                    "application" : {}
                },
                "minimal": {
                    "stateName": "minimal",
                    "showCurtain": false,
                    "headerHiding": false,
                    "headerVisible": true,
                    "headEndItems": [],
                    "showCatalog": false,
                    "showPane": false,
                    "showRightFloatingContainer": true,
                    "paneContent": [],
                    "headItems": [],
                    "actions": ["ContactSupportBtn", "EndUserFeedbackBtn", "aboutBtn", "userPreferencesButton", "logoutBtn"],
                    "floatingActions": [],
                    "subHeader": [],
                    "toolAreaItems": [],
                    "RightFloatingContainerItems": [],
                    "toolAreaVisible": false,
                    "floatingContainerContent": [],
                    "application" : {}
                },
                "standalone": {
                    "stateName": "standalone",
                    "showCurtain": false,
                    "headerHiding": isMobile,
                    "headerVisible": true,
                    "headEndItems": [],
                    "showCatalog": false,
                    "showPane": false,
                    "showRightFloatingContainer": true,
                    "paneContent": [],
                    "headItems": [],
                    "actions": ["ContactSupportBtn", "EndUserFeedbackBtn", "aboutBtn"],
                    "floatingActions": [],
                    "subHeader": [],
                    "toolAreaItems": [],
                    "RightFloatingContainerItems": [],
                    "toolAreaVisible": false,
                    "floatingContainerContent": [],
                    "application" : {}
                },
                "embedded": {
                    "stateName": "embedded",
                    "showCurtain": false,
                    "headerHiding": isMobile,
                    "headerVisible": true,
                    "headEndItems": ["standardActionsBtn"],
                    "showCatalog": false,
                    "showPane": false,
                    "showRightFloatingContainer": true,
                    "paneContent": [],
                    "headItems": [],
                    "actions": ["ContactSupportBtn", "EndUserFeedbackBtn", "aboutBtn"],
                    "floatingActions": [],
                    "subHeader": [],
                    "toolAreaItems": [],
                    "RightFloatingContainerItems": [],
                    "toolAreaVisible": false,
                    "floatingContainerContent": [],
                    "application" : {}
                },
                "headerless": {
                    "stateName": "headerless",
                    "showCurtain": false,
                    "headerHiding": isMobile,
                    "headerVisible": false,
                    "headEndItems": [],
                    "showCatalog": false,
                    "showPane": false,
                    "showRightFloatingContainer": true,
                    "paneContent": [],
                    "headItems": [],
                    "actions": [],
                    "floatingActions": [],
                    "subHeader": [],
                    "toolAreaItems": [],
                    "RightFloatingContainerItems": [],
                    "toolAreaVisible": false,
                    "floatingContainerContent": [],
                    "application" : {}
                }
            },
            userPreferences: {
                entries: []
            }
        }),
        oStateModelToUpdate = oModel,
        oCustomShellStateModel,
        oNavigationMode = {
            embedded: "embedded",
            newWindowThenEmbedded: "newWindowThenEmbedded",
            newWindow: "newWindow",
            replace: "replace"
        },
        oConfig = {},

    //allowed application state list that are allowed to be configured by oConfig.appState property
        allowedAppStates = ['minimal', 'app', 'standalone', 'embedded', 'headerless', 'home'];
    /**
     * @name sap.ushell.renderers.fiori2.Shell
     * @extends sap.ui.core.mvc.Controller
     * @public
     */
    sap.ui.controller("sap.ushell.renderers.fiori2.Shell", {

        oCoreExtLoadingDeferred: undefined,

        /**
         * SAPUI5 lifecycle hook.
         * @public
         */
        onInit: function () {
            this.bMeAreaSelected = false;
            this.oEndUserFeedbackConfiguration = {
                showAnonymous: true,
                anonymousByDefault: true,
                showLegalAgreement: true,
                showCustomUIContent: true,
                feedbackDialogTitle: true,
                textAreaPlaceholder: true,
                customUIContent: undefined
            };
            this.bUserImageAlreadyLoaded = undefined;
            this.bUpdateCustom = false;
            this.bMeAreaLoaded = false;
            // Add global model to view
            this.getView().setModel(oModel);
            // Bind the translation model to this view
            this.getView().setModel(sap.ushell.resources.i18nModel, "i18n");
            this.managedElements = {};
            this.oExtensionShellStates = {};

            sap.ui.getCore().getEventBus().subscribe("externalSearch", this.externalSearchTriggered, this);
            // handling of configuration should is done before the code block below otherwise the doHashChange is
            // triggered before the personalization flag is disabled (URL may contain hash value which invokes navigation)
            this._setConfigurationToModel();
            sap.ui.getCore().getEventBus().subscribe("launchpad", "contentRendered", this._loadCoreExt, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.loadUserImage, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "coreExtLoaded", this.checkEUFeedback, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "coreExtLoaded", this.loadMeAreaView, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.checkEUFeedback, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this.delayedCloseLoadingScreen, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "toggleContentDensity", this.toggleContentDensity, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "appOpened", this._loadCoreExtNWBC, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell.services.Notifications", "onNewNotifications", this._handleAlerts, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "appClosed", this.logApplicationUsage, this);

            // set current state
            var oConfig = (this.getView().getViewData() ? this.getView().getViewData().config : {}) || {},
                sRootIntent = oConfig ? oConfig.rootIntent : "",
                sCurrentHash = hasher.getHash(),
                oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sCurrentHash);

            if (!sCurrentHash.length || sRootIntent === oShellHash.semanticObject + "-" + oShellHash.action) {
                this.switchViewState('home'); // home is the default state of the shell
            }

            // make sure service instance is alive early, no further action needed for now
            sap.ushell.Container.getService("AppLifeCycle");

            sap.ushell.Container.getService("UsageAnalytics").init(sap.ushell.resources.i18n.getText("usageAnalytics"),
                sap.ushell.resources.i18n.getText("i_agree"),
                sap.ushell.resources.i18n.getText("i_disagree"),
                sap.ushell.resources.i18n.getText("remind_me_later"));

            oUserRecentsService = sap.ushell.Container.getService("UserRecents");

            if (sap.ushell.Container.getService("Notifications").isEnabled() === true) {
                oModel.setProperty("/enableNotifications", true);
                sap.ushell.Container.getService("Notifications").init();
                if (oConfig.enableNotificationsUI === true) {
                    oModel.setProperty("/enableNotificationsUI", true);
                    sap.ushell.Container.getService("Notifications").registerNotificationCountUpdateCallback(this.notificationsCountUpdateCallback.bind(this));
                }
            }

            this.history = new sap.ushell.renderers.fiori2.History();
            this.oViewPortContainer = sap.ui.getCore().byId("viewPortContainer");
            this.oNotificationsCountButton = sap.ui.getCore().byId("NotificationsCountButton");
            this.oApplicationLoadingScreen = sap.ui.getCore().byId("loadingDialog");

            //   this.toggleRtlMode(sap.ui.getCore().getConfiguration().getRTL());
            this.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");
            this.oShellNavigation.registerNavigationFilter(jQuery.proxy(this._handleEmptyHash, this));
            // must be after event registration (for synchronous navtarget resolver calls)
            this.oShellNavigation.init(jQuery.proxy(this.doHashChange, this));

            this.oShellNavigation.registerNavigationFilter(jQuery.proxy(this.handleDataLoss, this));
            sap.ushell.Container.getService("Message").init(jQuery.proxy(this.doShowMessage, this));
            sap.ushell.Container.setLogonFrameProvider(this._getLogonFrameProvider()); // TODO: TBD??????????
            this.bContactSupportEnabled = sap.ushell.Container.getService("SupportTicket").isEnabled();
            sap.ushell.renderers.fiori2.AccessKeysHandler.init(oModel);

            window.onbeforeunload = function () {
                if (sap.ushell.Container && sap.ushell.Container.getDirtyFlag()) {
                    if (!sap.ushell.resources.browserI18n) {
                        sap.ushell.resources.browserI18n = sap.ushell.resources.getTranslationModel(window.navigator.language).getResourceBundle();
                    }
                    return sap.ushell.resources.browserI18n.getText("dataLossExternalMessage");
                }
            };

            if (oModel.getProperty("/contentDensity")) {
                this._applyContentDensity();
            }

            if (oModel.getProperty("/enableNotificationsUI") === true) {
                // Add the notifications counter to the shell header
                this.addHeaderEndItem(["NotificationsCountButton"], false, ["home", "app"]);
            }
            if (oModel.getProperty("/enableMeArea") === true) {
                //in order to to get right buttons order in header, we need to remove the homeBtn and add it after meAreaHeaderButton
                this.removeHeaderItem("homeBtn", false, ["app"]);
                //add the MeArea toggle button & homeBtn
                this.addHeaderItem(["meAreaHeaderButton"], false, ["home", "app"]);
                this.addHeaderItem(["homeBtn"], false, ["app"]);
                this.removeActionButton(["logoutBtn"], false, ["home", "app"]);

                //in case meArea is on we need to listen to size changes to support
                //overflow behavior for end items in case there is not enough space
                //to show all in the header, and making sure that logo is displayed currectly
                sap.ui.Device.media.attachHandler(this.onScreenSizeChange.bind(this), null, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
                this.onScreenSizeChange(sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD));
            }
            if (oConfig.enableMergeAppAndShellHeaders === true) {
                this.initShellUIService();

                // we do this setModel here, as in the View, the shell-navigation-menu is used as an association member
                // of the ShellAppTitle object in which it does not inherit the Model from its parent
                if (this.getView().oShellNavigationMenu) {
                    this.getView().oShellNavigationMenu.setModel(oModel);
                }
            } else {
                //in Fiori 1.0 we need to show the home button also in the home page
                var aCurrentHeadItems = oModel.getProperty('/states/home/headItems');
                if (aCurrentHeadItems.indexOf('homeBtn') === -1) {
                    aCurrentHeadItems.push('homeBtn');
                    oModel.setProperty('/states/home/headItems', aCurrentHeadItems);
                }
            }
        },
        initShellUIService: function () {
            jQuery.sap.require("sap.ushell.ui5service.ShellUIService");
            this.oShellUIService = new sap.ushell.ui5service.ShellUIService({
                scopeObject: this.getOwnerComponent(),
                scopeType: "component"
            });

            this.oShellUIService._attachHierarchyChanged(this.onHierarchyChange.bind(this));
            this.oShellUIService._attachTitleChanged(this.onTitleChange.bind(this));
            this.oShellUIService._attachRelatedAppsChanged(this.onRelatedAppsChange.bind(this));
        },

        onHierarchyChange: function (oEvent) {
            this.isHierarchyChanged = true;
            var oHierarchy = oEvent.getParameters().data;
            if (!oHierarchy) {
                oHierarchy = [];
            }
            // we take the default value and save it with the data recived
            var oHierarchyDefaultValue = this.getHierarchyDefaultValue();
            var oExtendedHierarchy = oHierarchy.concat(oHierarchyDefaultValue);

            var oCurrentState = oModel.getProperty("/currentState");
            if (oCurrentState && oCurrentState.stateName === "home") {
                this._updateShellProperty("application/hierarchy", oExtendedHierarchy, false, ["home"]);
            }
            this._updateShellProperty("application/hierarchy", oExtendedHierarchy, true);
        },

        onTitleChange: function (oEvent) {
            this.isTitleChanged = true;
            var sTitle = oEvent.getParameters().data;
            if (!sTitle) {
                sTitle = this.getTitleDefaultValue();
            }
            var oCurrentState = oModel.getProperty("/currentState");
            if (oCurrentState && oCurrentState.stateName === "home") {
                this._updateShellProperty("application/title", sTitle, false, ["home"]);
            }
            this._updateShellProperty("application/title", sTitle, true);
        },

        onRelatedAppsChange: function (oEvent) {
            this.isRelatedAppsChanged = true;
            var oRelatedApps = oEvent.getParameters().data;
            if (!oRelatedApps) {
                oRelatedApps = [];
            }
            var oCurrentState = oModel.getProperty("/currentState");
            if (oCurrentState && oCurrentState.stateName === "home") {
                this._updateShellProperty("application/relatedApps", oRelatedApps, false, ["home"]);
            }
            this._updateShellProperty("application/relatedApps", oRelatedApps, true);
        },

        getHierarchyDefaultValue: function () {
            var oHierarchy = [];
            var oCurrentState = oModel.getProperty("/currentState");
            //If we navigate for a page with state == app add home to it
            if (oCurrentState && oCurrentState.stateName === "app") {
                //add home entry to hierarchy
                oHierarchy = [
                    {
                        icon: "sap-icon://home",
                        title: "Home",
                        // Intent is set to root directly to avoid multiple hash changes.
                        intent: oConfig.rootIntent ? "#" + oConfig.rootIntent : "#"
                    }
                ];
            }
            return oHierarchy;
        },

        getTitleDefaultValue: function () {
            var sTitle = "";
            var appMetaData = sap.ushell.services.AppConfiguration.getMetadata();
            if (appMetaData && appMetaData.title) {
                sTitle = appMetaData.title;
            }
            return sTitle;
        },

        _handleAlerts: function (sChannelId, sEventId, aNewNotifications) {
            var iNotificationsIndex;
            if (this.oViewPortContainer.getCurrentState() !== 'RightCenter') {
//                if (oModel.getProperty("/enableNotificationsUI") === true) {
                // Add the notifications counter to the shell header
                for (iNotificationsIndex = 0; iNotificationsIndex < aNewNotifications.length; iNotificationsIndex++) {
                    this.handleNotification(aNewNotifications[iNotificationsIndex]);
                }
//                }
            }
        },
        handleNotification: function (oNotification) {
            //create an element of RightFloatingContainer
            var oAlertEntry = sap.ushell.Container.getRenderer("fiori2").addRightFloatingContainerItem(
                {
                    press: function (oEvent) {
                        var viewPortContainer = sap.ui.getCore().byId('viewPortContainer');

                        if (hasher.getHash() === oNotification.NavigationTargetObject + "-" + oNotification.NavigationTargetAction) {
                            viewPortContainer.switchState("Center");
                        } else {
                            sap.ushell.utils.toExternalWithParameters(
                                oNotification.NavigationTargetObject,
                                oNotification.NavigationTargetAction,
                                oNotification.NavigationTargetParams
                            );
                        }
                        sap.ushell.Container.getService("Notifications").markRead(oNotification.Id);
                    },
                    datetime: oNotification.CreatedAt,
                    description: oNotification.SensitiveText,
                    title: oNotification.Text,
                    unread: oNotification.IsRead,
                    priority: "High"
                },
                true,
                true
            );
            oAlertEntry.addStyleClass('sapContrastPlus');
            oAlertEntry.addStyleClass('sapContrast');
            setTimeout(function () {
                sap.ushell.Container.getRenderer("fiori2").removeRightFloatingContainerItem(oAlertEntry.getId(), true);
            }, 3500);
        },
        _createActionButtons: function () {
            var oContactSupport,
                oEndUserFeedback,
                oEndUserFeedbackEnabled,
                oUserPrefButton = sap.ui.getCore().byId("userPreferencesButton"),
                oLogoutButton = sap.ui.getCore().byId("logoutBtn") || new sap.ushell.ui.footerbar.LogoutButton("logoutBtn"),
                oAboutButton = sap.ui.getCore().byId("aboutBtn") || new sap.ushell.ui.footerbar.AboutButton("aboutBtn");

            if (!oUserPrefButton) {
                oUserPrefButton = new sap.ushell.ui.footerbar.UserPreferencesButton("userPreferencesButton");
                this._setUserPrefModel(); // set the "/userPreference" property in the model
            }

            jQuery.sap.require('sap.ushell.ui.footerbar.ContactSupportButton');
            jQuery.sap.require('sap.ushell.ui.footerbar.EndUserFeedback');
            oContactSupport = new sap.ushell.ui.footerbar.ContactSupportButton("ContactSupportBtn", {
                visible: this.bContactSupportEnabled
            });
            oEndUserFeedbackEnabled = oModel.getProperty('/showEndUserFeedback');

            if (oEndUserFeedbackEnabled) {
                oEndUserFeedback = sap.ui.getCore().byId("EndUserFeedbackBtn") || new sap.ushell.ui.footerbar.EndUserFeedback("EndUserFeedbackBtn", {
                    showAnonymous: this.oEndUserFeedbackConfiguration.showAnonymous,
                    anonymousByDefault: this.oEndUserFeedbackConfiguration.anonymousByDefault,
                    showLegalAgreement: this.oEndUserFeedbackConfiguration.showLegalAgreement,
                    showCustomUIContent: this.oEndUserFeedbackConfiguration.showCustomUIContent,
                    feedbackDialogTitle: this.oEndUserFeedbackConfiguration.feedbackDialogTitle,
                    textAreaPlaceholder: this.oEndUserFeedbackConfiguration.textAreaPlaceholder,
                    customUIContent: this.oEndUserFeedbackConfiguration.customUIContent
                });
            }
            // if xRay is enabled
            if (oModel.getProperty("/enableHelp")) {
                oUserPrefButton.addStyleClass('help-id-loginDetails');// xRay help ID
                oLogoutButton.addStyleClass('help-id-logoutBtn');// xRay help ID
                oAboutButton.addStyleClass('help-id-aboutBtn');// xRay help ID
                if (oEndUserFeedbackEnabled) {
                    oEndUserFeedback.addStyleClass('help-id-EndUserFeedbackBtn'); // xRay help ID
                }
                oContactSupport.addStyleClass('help-id-contactSupportBtn');// xRay help ID
            }
            this.getView().aDanglingControls.push(oContactSupport, oUserPrefButton, oLogoutButton, oAboutButton);
            if (oEndUserFeedbackEnabled) {
                this.getView().aDanglingControls.push(oEndUserFeedback);
            }
        },
        _isCompactContentDensity: function () {
            var isCompact,
                oUser,
                userInfoService;
            if (!sap.ui.Device.support.touch) {
                isCompact = true;
            } else if (!sap.ui.Device.system.combi) {
                isCompact = false;
            } else {
                try {
                    userInfoService = sap.ushell.Container.getService("UserInfo");
                    oUser = userInfoService.getUser();
                } catch (e) {
                    jQuery.sap.log.error("Getting UserInfo service failed.");
                    oUser = sap.ushell.Container.getUser();
                }
                isCompact = (oUser.getContentDensity() === 'compact') ? true : false;
            }

            return isCompact;
        },

        _applyContentDensity: function (isCompact) {
            if (!this.getModel().getProperty("/contentDensity")) {
                return;
            }

            if (isCompact === undefined) {
                isCompact = this._isCompactContentDensity();
            }

            var appMetaData = sap.ushell.services.AppConfiguration.getMetadata();
            if (isCompact && !appMetaData.compactContentDensity) {
                isCompact = false;
            } else if (appMetaData.compactContentDensity && !appMetaData.cozyContentDensity) {
                isCompact = true;
            }

            if (isCompact) {
                jQuery('body').removeClass('sapUiSizeCozy');
                jQuery('body').addClass('sapUiSizeCompact');
            } else {
                jQuery('body').removeClass('sapUiSizeCompact');
                jQuery('body').addClass('sapUiSizeCozy');
            }

        },

        toggleContentDensity: function (sChannelId, sEventId, oData) {
            var isCompact = oData.contentDensity === "compact";

            this._applyContentDensity(isCompact);
        },

        checkEUFeedback: function () {
            if (!this.bFeedbackServiceChecked) {
                this.bFeedbackServiceChecked = true;
                try {
                    sap.ushell.Container.getService("EndUserFeedback").isEnabled()
                        .done(function () {
                            oModel.setProperty('/showEndUserFeedback', true);
                        })
                        .fail(function () {
                            oModel.setProperty('/showEndUserFeedback', false);
                        });
                } catch (e) {
                    jQuery.sap.log.error("EndUserFeedback adapter is not found", e.message || e);
                    oModel.setProperty('/showEndUserFeedback', false);
                }
            }
        },
        loadMeAreaView: function () {
            if (!sap.ui.getCore().byId('meArea') && !this.bMeAreaLoaded && oConfig.enableMeArea) {
                this.bMeAreaLoaded = true;
                var oMeAreaView = sap.ui.view("meArea", {
                    viewName: "sap.ushell.renderers.fiori2.meArea.MeArea",
                    type: 'JS',
                    viewData: this.getView().getViewData()
                });
                this.oViewPortContainer.addLeftViewPort(oMeAreaView);
                this.oViewPortContainer.navTo('leftViewPort', oMeAreaView.getId());
                this._createActionButtons();
            }
        },
        /**
         * Notifications update callback function.
         * Called by Notifications service, gets the updated notifications count and sets the model accordingly
         */
        notificationsCountUpdateCallback: function () {
            sap.ushell.Container.getService("Notifications").getUnseenNotificationsCount().done(function (iNumberOfNotifications) {
                setTimeout(function () {
                    var notificationsCounterValue = parseInt(iNumberOfNotifications, 10);
                    oModel.setProperty('/notificationsCount', notificationsCounterValue);
                }, 500);
            }).fail(function (data) {
                jQuery.sap.log.error("Shell.controller - call to notificationsService.getCount failed: ", data, "sap.ushell.renderers.lean.Shell");
            });
        },

        _handleEmptyHash: function (sHash) {
            sHash = (typeof sHash === "string") ? sHash : "";
            sHash = sHash.split("?")[0];
            if (sHash.length === 0) {
                var oViewData = this.getView() ? this.getView().getViewData() : {};
                oConfig = oViewData.config || {};
                //Migration support:  we have to set rootIntent empty
                //And continue navigation in order to check if  empty hash is resolved locally
                if (oConfig.migrationConfig) {
                    return this.oShellNavigation.NavigationFilterStatus.Continue;
                }
                if (oConfig.rootIntent) {
                    setTimeout(function () {
                        hasher.setHash(oConfig.rootIntent);
                    }, 0);
                    return this.oShellNavigation.NavigationFilterStatus.Abandon;
                }
            }
            return this.oShellNavigation.NavigationFilterStatus.Continue;
        },

        _setConfigurationToModel: function () {
            var oViewData = this.getView().getViewData(),
                stateEntryKey,
                curStates;

            if (oViewData) {
                oConfig = oViewData.config || {};
            }
            if (oConfig) {
                if (oConfig.states) {
                    curStates = oModel.getProperty('/states');
                    for (stateEntryKey in oConfig.states) {
                        if (oConfig.states.hasOwnProperty(stateEntryKey)) {
                            curStates[stateEntryKey] = oConfig.states[stateEntryKey];
                        }
                    }
                    oModel.setProperty('/states', curStates);
                }

                if (oConfig.appState === "headerless") {
                    // when appState is headerless we also remove the header in home state and disable the personalization.
                    // this is needed in case headerless mode will be used to navigate to the dashboard and not directly to an application.
                    // As 'home' is the official state for the dash board, we change the header visibility property of this state
                    oModel.setProperty("/personalization", false);
                    oModel.setProperty("/states/home/headerVisible", false);
                    //update the configuration as well for the method "getModelConfiguration"
                    oConfig.enablePersonalization = false;
                } else if (oConfig.enablePersonalization !== undefined) {
                    oModel.setProperty("/personalization", oConfig.enablePersonalization);
                }

                //EU Feedback flexable configuration
                if (oConfig.changeEndUserFeedbackTitle !== undefined) {
                    this.oEndUserFeedbackConfiguration.feedbackDialogTitle = oConfig.changeEndUserFeedbackTitle;
                }

                if (oConfig.changeEndUserFeedbackPlaceholder !== undefined) {
                    this.oEndUserFeedbackConfiguration.textAreaPlaceholder = oConfig.changeEndUserFeedbackPlaceholder;
                }

                if (oConfig.showEndUserFeedbackAnonymousCheckbox !== undefined) {
                    this.oEndUserFeedbackConfiguration.showAnonymous = oConfig.showEndUserFeedbackAnonymousCheckbox;
                }

                if (oConfig.makeEndUserFeedbackAnonymousByDefault !== undefined) {
                    this.oEndUserFeedbackConfiguration.anonymousByDefault = oConfig.makeEndUserFeedbackAnonymousByDefault;
                }

                if (oConfig.showEndUserFeedbackLegalAgreement !== undefined) {
                    this.oEndUserFeedbackConfiguration.showLegalAgreement = oConfig.showEndUserFeedbackLegalAgreement;
                }
                //EU Feedback configuration end.
                if (oConfig.enableSetTheme !== undefined) {
                    oModel.setProperty("/setTheme", oConfig.enableSetTheme);
                }
                // Compact Cozy mode
                if (oConfig.enableContentDensity !== undefined) {
                    oModel.setProperty("/contentDensity", oConfig.enableContentDensity);
                }
                // check for title
                if (oConfig.title) {
                    oModel.setProperty("/title", oConfig.title);
                }
                //Check if the configuration is passed by html of older version(1.28 and lower)
                if (oConfig.migrationConfig !== undefined) {
                    oModel.setProperty("/migrationConfig", oConfig.migrationConfig);
                }
                //User default parameters settings
                if (oConfig.enableUserDefaultParameters !== undefined) {
                    oModel.setProperty("/userDefaultParameters", oConfig.enableUserDefaultParameters);
                }

                if (oConfig.disableHomeAppCache !== undefined) {
                    oModel.setProperty("/disableHomeAppCache", oConfig.disableHomeAppCache);
                }

                if (oConfig.enableMeArea !== undefined) {
                    oModel.setProperty("/enableMeArea", oConfig.enableMeArea);
                }
                // xRay enablement configuration
                oModel.setProperty("/enableHelp", !!oConfig.enableHelp);
                oModel.setProperty("/searchAvailable", (oConfig.enableSearch !== false));

                // in Fiori2.0 should disable the header-hiding (automatically collapsing of header)
                // (currently we check if mergeAppAndShellHeaders is enabled)
                if (oConfig.enableMergeAppAndShellHeaders) {
                    this._updateShellProperty("headerHiding", false, false, ["home", "app"]);
                }
            }
        },

        getModelConfiguration: function () {
            var oViewData = this.getView().getViewData(),
                oConfiguration,
                oShellConfig;

            if (oViewData) {
                oConfiguration = oViewData.config || {};
                oShellConfig = jQuery.extend({}, oConfiguration);
            }
            delete oShellConfig.applications;
            return oShellConfig;
        },
        /**
         * This method will be used by the Container service in order to create, show and destroy a Dialog control with an
         * inner iframe. The iframe will be used for rare scenarios in which additional authentication is required. This is
         * mainly related to SAML 2.0 flows.
         * The api sequence will be managed by UI2 services.
         * @returns {{create: Function, show: Function, destroy: Function}}
         * @private
         */
        _getLogonFrameProvider: function () {
            var oView = this.getView();

            return {
                /* @returns a DOM reference to a newly created iFrame. */
                create: function () {
                    return oView.createIFrameDialog();
                },

                /* make the current iFrame visible to user */
                show: function () {
                    oView.showIFrameDialog();
                },

                /* hide, close, and destroy the current iFrame */
                destroy: function () {
                    oView.destroyIFrameDialog();
                }
            };
        },

        onExit: function () {
            sap.ui.getCore().getEventBus().unsubscribe("externalSearch", this.externalSearchTriggered, this);
            sap.ui.getCore().getEventBus().unsubscribe("contentRendered", this._loadCoreExt, this);
            sap.ui.getCore().getEventBus().unsubscribe("appOpened", this.loadUserImage, this);
            sap.ui.getCore().getEventBus().unsubscribe("coreExtLoaded", this.checkEUFeedback, this);
            sap.ui.getCore().getEventBus().unsubscribe("coreExtLoaded", this.loadMeAreaView, this);
            sap.ui.getCore().getEventBus().unsubscribe("appOpened", this.checkEUFeedback, this);
            sap.ui.getCore().getEventBus().unsubscribe("appOpened", this.delayedCloseLoadingScreen, this);
            sap.ui.getCore().getEventBus().unsubscribe("toggleContentDensity", this.toggleContentDensity, this);
            sap.ui.getCore().getEventBus().unsubscribe("appOpened", this._loadCoreExtNWBC, this);
            sap.ui.getCore().getEventBus().unsubscribe("onNewNotifications", this._handleAlerts, this);
            sap.ui.getCore().getEventBus().unsubscribe("appClosed", this.logApplicationUsage, this);

            this.oShellNavigation.hashChanger.destroy();
            this.getView().aDanglingControls.forEach(function (oControl) {
                if (oControl.destroyContent) {
                    oControl.destroyContent();
                }
                oControl.destroy();
            });
            sap.ushell.UserActivityLog.deactivate(); // TODO:
            if (sap.ushell.Container) {
                if (sap.ushell.Container.getService("Notifications").isEnabled() === true) {
                    sap.ushell.Container.getService("Notifications").destroy();
                }
            }
        },


        getAnimationType: function () {
            //return sap.ui.Device.os.android ? "show" : "fade";
            return "show";
        },

        onCurtainClose: function (oEvent) {
            jQuery.sap.log.warning("Closing Curtain", oEvent);


        },

        /**
         * Navigation Filter function registered with ShellNavigation service.
         * Triggered on each navigation.
         * Aborts navigation if there are unsaved data inside app(getDirtyFlag returns true).
         *
         * @private
         */
        handleDataLoss: function (newHash, oldHash) {
            if (!enableHashChange) {
                enableHashChange = true;
                this.closeLoadingScreen();
                return this.oShellNavigation.NavigationFilterStatus.Custom;
            }

            if (sap.ushell.Container.getDirtyFlag()) {
                if (!sap.ushell.resources.browserI18n) {
                    sap.ushell.resources.browserI18n = sap.ushell.resources.getTranslationModel(window.navigator.language).getResourceBundle();
                }
                /*eslint-disable no-alert*/
                if (confirm(sap.ushell.resources.browserI18n.getText("dataLossInternalMessage"))) {
                    /*eslint-enable no-alert*/
                    sap.ushell.Container.setDirtyFlag(false);
                    return this.oShellNavigation.NavigationFilterStatus.Continue;
                }
                //when browser back is performed the browser pops the hash from the history, we push it back.
                enableHashChange = false;
                hasher.setHash(oldHash);
                return this.oShellNavigation.NavigationFilterStatus.Custom;
            }

            return this.oShellNavigation.NavigationFilterStatus.Continue;
        },
        /**
         * Callback registered with Message service. Triggered on message show request.
         *
         * @private
         */
        doShowMessage: function (iType, sMessage, oParameters) {
            jQuery.sap.require("sap.m.MessageToast");
            jQuery.sap.require("sap.m.MessageBox");
            if (iType === sap.ushell.services.Message.Type.ERROR) {
                //check that SupportTicket is enabled and verify that we are not in a flow in which Support ticket creation is failing,
                // if this is the case we don't want to show the user the contact support button again
                if (sap.ushell.Container.getService("SupportTicket").isEnabled() && sMessage !== sap.ushell.resources.i18n.getText("supportTicketCreationFailed")) {
                    try {
                        jQuery.sap.require("sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage");
                        var errorMsg = new sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage("EmbeddedSupportErrorMessage", {
                            title: oParameters.title || sap.ushell.resources.i18n.getText("error"),
                            content: new sap.m.Text({
                                text: sMessage
                            })
                        });
                        errorMsg.open();
                    } catch (e) {
                        sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR,
                            oParameters.title || sap.ushell.resources.i18n.getText("error"));
                    }
                } else {
                    sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.ERROR,
                        oParameters.title || sap.ushell.resources.i18n.getText("error"));
                }
            } else if (iType === sap.ushell.services.Message.Type.CONFIRM) {
                if (oParameters.actions) {
                    sap.m.MessageBox.show(sMessage, sap.m.MessageBox.Icon.QUESTION, oParameters.title, oParameters.actions, oParameters.callback);
                } else {
                    sap.m.MessageBox.confirm(sMessage, oParameters.callback, oParameters.title);
                }
            } else {
                sap.m.MessageToast.show(sMessage, {duration: oParameters.duration || 3000});
            }
        },

        /**
         * Callback registered with NavService. Triggered on navigation requests
         *
         * A cold start state occurs whenever the user has previously opened the window.
         * - page is refreshed
         * - URL is pasted in an existing window
         * - user opens the page and pastes a URL
         *
         * @return {boolean} whether the application is in a cold start state
         */
        _isColdStart: function () {
            if (this.history.getHistoryLength() <= 1) {  // one navigation: coldstart!
                return true;
            }
            this._isColdStart = function () {
                return false;
            };
            return false;
        },

        _logRecentActivity: function (oRecentActivity) {
            if (oConfig && oConfig.enableRecentActivity) {
                // Triggering the app usage mechanism to log this openApp action.
                // Using setTimeout in order not to delay the openApp action
                setTimeout(function () {
                    if (sap.ushell.Container) {
                        sap.ushell.services.AppConfiguration.addActivity(oRecentActivity);
                    }
                }, 700);
            }
        },

        _logOpenAppAction: function (sFixedShellHash) {
            if (oConfig && oConfig.enableTilesOpacity) {
                // Triggering the app usage mechanism to log this openApp action.
                // Using setTimeout in order not to delay the openApp action
                setTimeout(function () {
                    if (sap.ushell.Container) {
                        oUserRecentsService.addAppUsage(sFixedShellHash);
                    }
                }, 700);
            }
        },

        /**
         * Sets application container based on information in URL hash.
         *
         * This is a callback registered with NavService. It's triggered
         * whenever the url (or the hash fragment in the url) changes.
         *
         * NOTE: when this method is called, the new URL is already in the
         *       address bar of the browser. Therefore back navigation is used
         *       to restore the URL in case of wrong navigation or errors.
         *
         * @public
         */
        doHashChange: function (sShellHash, sAppPart, sOldShellHash, sOldAppPart, oParseError) {
            var that = this,
                iOriginalHistoryLength,
                sFixedShellHash;
            sap.ushell.utils.addTime("ShellControllerHashChange");
            this.lastApplicationFullHash = sOldAppPart ? sOldShellHash + sOldAppPart : sOldShellHash;
            if (!enableHashChange) {
                enableHashChange = true;
                this.closeLoadingScreen();
                return;
            }

            if (oParseError) {
                this.hashChangeFailure(this.history.getHistoryLength(), oParseError.message, null, "sap.ushell.renderers.fiori2.Shell.controller", false);
                return;
            }
            if (sap.m.InstanceManager && closeAllDialogs) {
                sap.m.InstanceManager.closeAllDialogs();
                sap.m.InstanceManager.closeAllPopovers();
            }

            closeAllDialogs = true;
            // navigation begins
            this.openLoadingScreen();

            if (sap.ushell.utils.getParameterValueBoolean("sap-ushell-no-ls")) {
                this.closeLoadingScreen();
            }

            // save current history length to handle errors (in case)
            iOriginalHistoryLength = this.history.getHistoryLength();

            sFixedShellHash = this.fixShellHash(sShellHash);

            // track hash change
            this.history.hashChange(sFixedShellHash, sOldShellHash);

            // we save the current-application before resolving the next navigation's fragment,
            // as in cases of navigation in a new window we need to set it back
            // for the app-configuration to be consistent
            this.currentAppBeforeNav = sap.ushell.services.AppConfiguration.getCurrentAppliction();

            this._resolveHashFragment(sFixedShellHash).done(function (oResolvedHashFragment, oParsedShellHash) {
                var sIntent = oParsedShellHash ? oParsedShellHash.semanticObject + "-" + oParsedShellHash.action : "",
                    oConfig = that._getConfig(),
                    oExistingPage,
                // for SAPUI5 apps, the application type is still "URL" due to backwards compatibility, but the NavTargetResolution
                // service already extracts the component name, so this can directly be used as indicator
                    sTargetUi5ComponentName = oResolvedHashFragment && oResolvedHashFragment.ui5ComponentName,
                    bTargetIsUi5App = !!sTargetUi5ComponentName,
                    bComponentLoaded = oResolvedHashFragment && oResolvedHashFragment.componentHandle;

                // In case of empty hash, if there is a resolved target, set the flag to false, from now on the rootIntent will be an empty hash.
                // Otherwise, change hash to rootIntent to triger normal resolution
                if (that.getModel().getProperty("/migrationConfig")) {
                    oConfig.migrationConfig = false;
                    that.getModel().setProperty("/migrationConfig", false);

                    if (oResolvedHashFragment && sFixedShellHash === '#') {
                        oConfig.rootIntent = "";
                    } else if (sFixedShellHash === '#') {
                        setTimeout(function () {
                            hasher.setHash(oConfig.rootIntent);
                        }, 0);
                        return;
                    }
                }

                /*
                 * Pre-navigation logic for library loading
                 *
                 * Before navigating to an app, we need to make sure:
                 *
                 * Since 1.38, the loading of a target app's UI5 Component including it's
                 * dependencies and the core-ext-light.js preload module has been factored out
                 * into a new shell service called "Ui5ComponentLoader". This service deals
                 * with most aspects (see the call below).
                 *
                 * There are 3 exceptions:
                 * 1. platforms can optimize the direct application start by triggering the loading earlier. In this case,
                 *      the corresponding bootstrap code can define a promise in variable
                 *      window["sap-ushell-async-libs-promise-directstart"] which resolves to a navtarget resolution result;
                 *      for UI5 components, the loading can also be triggered early. If the component is already loaded,
                 *      the nav target resolution result contains a property "componentHandle", so that loading can be omitted here.
                 * 2. loading of the core-ext-light.js module is explicitly skipped for the FLP component; in this case, the
                 *      lazy loading is triggered via the contentRendered method
                 * 3. the home page component might be cached; when the navigation target is the home page (see "oExistingPage" below),
                 *      component loading os also skipped as the cached component is used
                 */
                if (bComponentLoaded) {
                    that._initiateApplication(oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength);
                    return;
                }

                // for non-UI5 apps, we can directly initiate the navigation
                if (!bTargetIsUi5App) {
                    that._initiateApplication(oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength);
                    return;
                }

                // add application config to the application properties
                if (oConfig && oConfig.applications && oConfig.applications[sIntent]) {
                    oResolvedHashFragment.applicationConfiguration = oConfig.applications[sIntent];
                }

                oExistingPage = that._getExistingAppAndDestroyIfNotRoot(sIntent);
                if (oExistingPage) {
                    // root intent (home): directly navigate to the app
                    that._initiateApplication(oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength);
                    return;
                } else {
                    // normal application:
                    // fire the _prior.newUI5ComponentInstantion event before creating the new component instance, so that
                    // the ApplicationContainer can stop the router of the current app (avoid inner-app hash change notifications)
                    // TODO: this dependency to the ApplicationContainer is not nice, but we need a fast fix now; we should refactor
                    // the ApplicationContainer code, because most of the logic has to be done by the shell controller; maybe rather introduce
                    // a utility module
                    sap.ui.getCore().getEventBus().publish("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion",
                        {
                            name : sTargetUi5ComponentName
                        }
                    );

                    // load ui5 component via shell service; core-ext-light will be loaded as part of the asyncHints
                    sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(
                        oResolvedHashFragment, oParsedShellHash, that._createWaitForRendererCreatedPromise()
                    ).done(function (oResolutionResultWithComponentHandle) {
                            that._initiateApplication(oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength);
                        }).fail(function (vError) {
                            that.hashChangeFailure(iOriginalHistoryLength, "Failed to load U5 component for navigation intent " + sFixedShellHash,
                                vError, "sap.ushell.renderers.fiori2.Shell.controller", false);
                        });
                }
            }).fail(function (sMsg) {
                that.hashChangeFailure(iOriginalHistoryLength, "Failed to resolve navigation target: " + sFixedShellHash,
                    sMsg, "sap.ushell.renderers.fiori2.Shell.controller", false);
            });
        },

        _initiateApplication: function (oResolvedHashFragment, sFixedShellHash, oParsedShellHash, iOriginalHistoryLength) {
            var oMetadata = sap.ushell.services.AppConfiguration.getMetadata(oResolvedHashFragment);

            // the activation of user activity logging must be done after the app component is fully loaded
            // otherwise the module loading sequence causes race conditions on firefox
            if (this.bContactSupportEnabled) {
                sap.ushell.UserActivityLog.activate();
            }

            this._logOpenAppAction(sFixedShellHash);

            try {
                this.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
            } catch (oExc) {
                if (oExc.stack) {
                    jQuery.sap.log.error("Application initialization failed due to an Exception:\n" + oExc.stack);
                }
                this.hashChangeFailure(iOriginalHistoryLength, oExc.name, oExc.message, oMetadata ? oMetadata.title : "", false);
            } finally {
                // always load UI plug-ins after navigation, except when the core resources are not yet fully loaded
                // this flag is false or undefined if core-ext loading was explicitly switched off (homepage case)
                // or the resolved target is not a UI5 app; in that case, the plug-in loading is triggered by the AppOpened event
                if (oResolvedHashFragment && oResolvedHashFragment.coreResourcesFullyLoaded && !this._pluginLoadingTriggered) {
                    this._pluginLoadingTriggered = true;
                    jQuery.sap.log.info("Triggering load of 'RendererExtension' plug-ins after application initialization",
                        null, "sap.ushell.renderers.fiori2.Shell");
                    sap.ushell.Container.getService("PluginManager").loadPlugins("RendererExtensions");
                }
            }
        },

        /**
         * Callback registered with NavService. Triggered on navigation requests
         *
         * @param {string} sShellHash
         *     the hash fragment to parse (must start with "#")
         *
         * @returns {jQuery.Deferred.promise}
         *     a promise resolved with an object containing the resolved hash
         *     fragment (i.e., the result of
         *     {@link sap.ushell.services.NavTargetResolution#resolveHashFragment}),
         *     the parsed shell hash obtained via
         *     {@link sap.ushell.services.URLParsing#parseShellHash},
         *     and a boolean value indicating whether application dependencies <b>and</b> core-ext-light were loaded earlier.
         *     The promise is rejected with an error message in case errors occur.
         */
        _resolveHashFragment: function (sShellHash) {
            var oResolvedHashFragment,
                oParsedShellHashParams,
                oParsedShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sShellHash),
                oDeferred = new jQuery.Deferred();

            /*
             * Optimization: reconstruct the result of resolveHashFragment if
             * navResCtx is found in the hash fragment.
             */
            oParsedShellHashParams = oParsedShellHash && oParsedShellHash.params || {};
            if (oParsedShellHash && oParsedShellHash.contextRaw && oParsedShellHash.contextRaw === "navResCtx"
                    // be robust
                && oParsedShellHashParams
                && oParsedShellHashParams.additionalInformation && (oParsedShellHashParams.additionalInformation[0] || oParsedShellHashParams.additionalInformation[0] === "")
                && oParsedShellHashParams.applicationType && oParsedShellHashParams.applicationType[0]
                && oParsedShellHashParams.url && oParsedShellHashParams.url[0]
                && oParsedShellHashParams.navigationMode && (oParsedShellHashParams.navigationMode[0] || oParsedShellHashParams.additionalInformation[0] === "")
            //&& oParsedShellHashParams.title            && oParsedShellHashParams.title[0]
            ) {
                oParsedShellHashParams = oParsedShellHash.params || {};

                oResolvedHashFragment = {
                    additionalInformation: oParsedShellHashParams.additionalInformation[0],
                    applicationType: oParsedShellHashParams.applicationType[0],
                    url: oParsedShellHashParams.url[0],
                    navigationMode: oParsedShellHashParams.navigationMode[0]
                };

                if (oParsedShellHashParams.title) {
                    oResolvedHashFragment.text = oParsedShellHashParams.title[0];
                }

                oDeferred.resolve(oResolvedHashFragment, oParsedShellHash);
            } else {
                // Check and use resolved hash fragment from direct start promise if it's there
                if (window["sap-ushell-async-libs-promise-directstart"]) {
                    window["sap-ushell-async-libs-promise-directstart"]
                        .then(function (oDirectstartPromiseResult) {
                            oDeferred.resolve(
                                oDirectstartPromiseResult.resolvedHashFragment,
                                oParsedShellHash
                            );
                            delete window["sap-ushell-async-libs-promise-directstart"];
                        },
                        function (sMsg) {
                            oDeferred.reject(sMsg);
                            delete window["sap-ushell-async-libs-promise-directstart"];
                        });
                    return oDeferred.promise();
                }

                // Perform target resolution as normal...
                sap.ushell.Container.getService("NavTargetResolution").resolveHashFragment(sShellHash)
                    .done(function (oResolvedHashFragment) {
                        oDeferred.resolve(oResolvedHashFragment, oParsedShellHash);
                    })
                    .fail(function (sMsg) {
                        oDeferred.reject(sMsg);
                    });
            }

            return oDeferred.promise();
        },


        /**
         * Handles navigation modes that depend on current state such as the
         * history. In these cases of conditional navigation, this method calls
         * {@link #navigate}.
         *
         * @param {object} oParsedShellHash
         *     the parsed shell hash obtained via
         *     {@link sap.ushell.services.URLParsing} service
         * @param {string} sFixedShellHash
         *     the hash fragment to navigate to. It must start with "#" (i.e., fixed).<br />
         * @param {object} oMetadata
         *     the metadata object obtained via
         *     {@link sap.ushell.services.AppConfiguration#parseShellHash}
         * @param {object} oResolvedHashFragment
         *     the hash fragment resolved via
         *     {@link sap.ushell.services.NavTargetResolution#resolveHashFragment}
         *
         * @returns {boolean} whether conditional navigation was handled
         * @private
         */
        _handleConditionalNavigation: function (oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment) {
            var sNavigationMode = oResolvedHashFragment.navigationMode;

            if (sNavigationMode === oNavigationMode.newWindowThenEmbedded) {
                /*
                 * Implement newWindowThenEmbedded based on current state.
                 */
                if (this._isColdStart() || (oParsedShellHash.contextRaw && oParsedShellHash.contextRaw === "navResCtx") || this.history.backwards) {
                    /*
                     * coldstart -> always open in place because the new window
                     *              was opened by the user
                     *
                     * navResCtx -> url was generated by us and opened in a new
                     *              window or pasted in an existing window
                     *
                     * history.backwards -> url was was previously opened in
                     *              embedded mode (at any point in the
                     *              history), and we need to navigate back to
                     *              it in the same mode.
                     */
                    oResolvedHashFragment.navigationMode = oNavigationMode.embedded;
                    this.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

                } else {
                    // simplified processing in 1.34
                    // always resolve original hash in new window
                    // (with ClientSideTargetResolution the resolution overhead is marginal)
                    // and the former ~navResCtx injection has security, complexity and other issues,
                    // e.g. navigation has side effects, thus it is not optional
                    // e.g. NavTargetResolution.getCurrentResolutionResult()
                    oResolvedHashFragment.navigationMode = oNavigationMode.newWindow;
                    oResolvedHashFragment.url = encodeURI(sFixedShellHash);
                    this.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);
                }

                return true;
            }

            if (sNavigationMode === oNavigationMode.newWindow && this._isColdStart()) {
                /*
                 * Replace the content of the current window if the user has
                 * already opened one.
                 */
                oResolvedHashFragment.navigationMode = oNavigationMode.replace;
                this.navigate(oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment);

                return true;
            }

            return false;
        },

        /**
         * Performs navigation based on the given resolved hash fragment.
         *
         * @param {object} oParsedShellHash
         *     the parsed shell hash obtained via
         *     {@link sap.ushell.services.URLParsing} service
         * @param {string} sFixedShellHash
         *     the hash fragment to navigate to. It must start with "#" (i.e., fixed).<br />
         * @param {object} oMetadata
         *     the metadata object obtained via
         *     {@link sap.ushell.services.AppConfiguration#parseShellHash}
         * @param {object} oResolvedHashFragment
         *     the hash fragment resolved via
         *     {@link sap.ushell.services.NavTargetResolution#resolveHashFragment}
         */
        navigate: function (oParsedShellHash, sFixedShellHash, oMetadata, oResolvedHashFragment) {
            var sNavigationMode = (jQuery.isPlainObject(oResolvedHashFragment) ? oResolvedHashFragment.navigationMode : null),
                sUrlWithSapUser,
                oEpcm;

            /*
             * A null navigationMode is a no-op, it indicates no navigation
             * should occur. However, we need to restore the current hash to
             * the previous one. If coldstart happened (history has only one
             * entry), we go to the shell home.
             */
            if (sNavigationMode === null) {
                if (this._isColdStart()) {
                    hasher.setHash("");
                    return;
                }

                enableHashChange = false;
                this.history.pop();
                this._windowHistoryBack(1);
                return;
            }

            if (sap.ushell.utils.isNativeWebGuiNavigation(oResolvedHashFragment)) {
                // TODO: check coldstart/browser back: we would go to the homepage or close the window
                try {
                    sUrlWithSapUser = sap.ushell.utils.appendUserIdToUrl("sap-user", oResolvedHashFragment.url);
                    oEpcm = window.external.getPrivateEpcm();
                    oEpcm.doNavigate(sUrlWithSapUser);
                    enableHashChange = false;
                    this.closeLoadingScreen();
                    this._windowHistoryBack(1);
                    // set back the current application to be the one before this navigation occured as current application
                    // is opened in a new window
                    sap.ushell.services.AppConfiguration.setCurrentApplication(this.currentAppBeforeNav);
                } catch (e) {
                    if (e.stack) {
                        jQuery.sap.log.error("Application initialization failed due to an Exception:\n" + e.stack);
                    }
                    this.hashChangeFailure(this.history.getHistoryLength(), e.name, e.message, oMetadata.title, false);
                }
                return;
            }

            if (this._handleConditionalNavigation.apply(this, arguments)) {
                return;
            }

            if (sNavigationMode === oNavigationMode.embedded) {
                this._handleEmbeddedNavMode(sFixedShellHash, oParsedShellHash, oMetadata, oResolvedHashFragment);

                // maybe restore hash...
                if (oParsedShellHash && oParsedShellHash.contextRaw === "navResCtx") {
                    // historical invocation pattern no longer used which allowed
                    // injectiong foreign urls via url parameter
                    // -> prone to url injection
                    //
                    // invication via this mechanism is flawed as it does not resolve
                    // the target in the new window, thus leading to
                    // states which are not consistent (e.g. NavTargetResolution.getCurrentResolutionResult) is wrong.
                    //
                    // should be removed from product for security and complexity considerations
                    //
                    enableHashChange = false;
                    //replace tiny hash in window
                    // PLEASE don't only treat the sunny side of the beach:
                    // just use the intent X-Y~navResCtx without the fancy stuff and see how it crashes.
                    if (oParsedShellHash
                        && oParsedShellHash.params
                        && oParsedShellHash.params.original_intent
                        && oParsedShellHash.params.original_intent[0]) {
                        hasher.replaceHash(oParsedShellHash.params.original_intent[0]);
                        // replace tiny hash in our history model
                        this.history._history[0] = oParsedShellHash.params.original_intent[0];
                    }
                }
                return;
            }

            if (sNavigationMode === oNavigationMode.replace) {
                // restore hash
                enableHashChange = false;
                this._changeWindowLocation(oResolvedHashFragment.url);
                return;
            }

            if (sNavigationMode === oNavigationMode.newWindow) {
                // restore hash
                enableHashChange = false;
                
                this._openAppNewWindow(oResolvedHashFragment.url);
                this.history.pop();
                var oVarInstance = oResolvedHashFragment.componentHandle && oResolvedHashFragment.componentHandle.getInstance && 
                    oResolvedHashFragment.componentHandle.getInstance({});
                if (oVarInstance) {
                    oVarInstance.destroy();
                }
                this._windowHistoryBack(1);
                // set back the current application to be the one before this navigation occured as current application
                // is opened in a new window
                sap.ushell.services.AppConfiguration.setCurrentApplication(this.currentAppBeforeNav);
                return;
            }

            // the navigation mode doesn't match any valid one.
            // In this case an error message is logged and previous hash is fetched
            this.hashChangeFailure(this.history.getHistoryLength(), "Navigation mode is not recognized", null, "sap.ushell.renderers.fiori2.Shell.controller", false);
        },

        _handleEmbeddedNavMode: function (sFixedShellHash, oParsedShellHash, oMetadata, oResolvedHashFragment) {
            var sAppId,
                oInnerControl,
                bLegacyApp,
                bIsNavToHome,
                oHomeBtn = sap.ui.getCore().byId('homeBtn'),
                sIntent;

            this.resetShellUIServiceHandlers();

            this.setAppIcons(oMetadata);

            // obtain a unique id for the app (or the component)
            sAppId = '-' + oParsedShellHash.semanticObject + '-' + oParsedShellHash.action;

            bLegacyApp = (oResolvedHashFragment.applicationType === "NWBC" || oResolvedHashFragment.applicationType === "TR");
            bIsNavToHome = sFixedShellHash === "#" ||
            (oConfig.rootIntent && oConfig.rootIntent === oParsedShellHash.semanticObject + "-" + oParsedShellHash.action);

            if (bIsNavToHome && !this.oHomeApp && !oConfig.disableHomeAppCache) {
                //save the "home app" component so that we will be able to initialize its router
                //when navigating back to it
                this._saveHomePageComponent();
            }
            //Support migration from version 1.28 or lower in case local resolution for empty hash was used
            sIntent = oParsedShellHash ? oParsedShellHash.semanticObject + "-" + oParsedShellHash.action : "";

            if (bLegacyApp && !oResolvedHashFragment.explicitNavMode) {
                if (oResolvedHashFragment.applicationType === "NWBC" && oConfig.appState && oConfig.appState === "headerless") {
                    this.switchViewState("headerless");
                } else {
                    this.switchViewState("minimal");
                }
            } else if (bIsNavToHome) {
                this.switchViewState("home");
                if (!oConfig.enableMergeAppAndShellHeaders) {
                    if (oHomeBtn) {
                        oHomeBtn.setEnabled(false);
                    }
                }
            } else {
                this.switchViewState(
                    allowedAppStates.indexOf(oConfig.appState) >= 0
                        ? oConfig.appState
                        : "app"
                );
                if (!oConfig.enableMergeAppAndShellHeaders) {
                    if (oHomeBtn) {
                        oHomeBtn.setEnabled(true);
                    }
                }
            }
            oInnerControl = this.getWrappedApplication(
                sIntent,
                oMetadata,             // metadata
                oResolvedHashFragment, // the resolved Navigation Target
                sAppId,
                oResolvedHashFragment.fullWidth || oMetadata.fullWidth || bLegacyApp
            );
            //set the NavContainer intialPage
            if (bIsNavToHome && !oConfig.disableHomeAppCache) {
                if (!this.oViewPortContainer.getInitialCenterViewPort()) {
                    this.oViewPortContainer.setInitialCenterViewPort(oInnerControl);
                }
            }
            //Perform switch:
            this.oViewPortContainer.navTo('centerViewPort', oInnerControl.getId(), 'show');
            this.oViewPortContainer.switchState("Center");
        },

        _getExistingAppAndDestroyIfNotRoot: function (sIntent) {
            var oExistingPage;

            oExistingPage = this.oViewPortContainer && (this.oViewPortContainer.getViewPortControl('centerViewPort', "application" + '-' + sIntent)
            || this.oViewPortContainer.getViewPortControl('centerViewPort', "applicationShellPage" + '-' + sIntent));
            //if the page/app we are about to create already exists, we need to destroy it before
            //we go on with the flow. we have to destroy the existing page since we need to avoid
            //duplicate ID's
            //in case that we are navigating to the root intent, we do not destroy the page.
            if (oExistingPage && sIntent !== oConfig.rootIntent) {
                this.oViewPortContainer.removeCenterViewPort(oExistingPage.getId(), true);
                oExistingPage.destroy();
                return null;
            } else if (oExistingPage) {
                return oExistingPage;
            }
        },

        getWrappedApplication: function (sIntent, oMetadata, oResolvedNavigationTarget, sAppId, bFullWidth) {
            var oInnerControl,
                oExistingPage,
                oAppContainer,
                that = this;

            oExistingPage = this._getExistingAppAndDestroyIfNotRoot(sIntent, sAppId);
            if (oExistingPage) {
                if (this && this.closeLoadingScreen) { //for qunit
                    this.closeLoadingScreen();//In order to prevent unnecessary opening of the loading screen
                }
                return oExistingPage;
            }

            jQuery.sap.require('sap.ushell.components.container.ApplicationContainer');
            setTimeout(function () {

                setTimeout(function () {
                    //set the focus to shell
                    sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell();

                    setTimeout(function () {
                        //Screen reader: "Loading Complete"
                        that.readNavigationEnd();

                    },1000);
                },100);

                sap.ui.getCore().getEventBus().publish("launchpad", "appOpening", oResolvedNavigationTarget);
                jQuery.sap.log.info('app is being opened');
            }, 0);
            if (oConfig.applications) {
                oResolvedNavigationTarget.applicationConfiguration = oConfig.applications[sIntent];
            }

            oAppContainer = this._getAppContainer(sAppId, oResolvedNavigationTarget);

            // remove the component handle from the event data to allow JSON serialization
            if (oResolvedNavigationTarget && oResolvedNavigationTarget.componentHandle) {
                delete oResolvedNavigationTarget.componentHandle;
            }
            this.publishNavigationStateEvents(oAppContainer, oResolvedNavigationTarget);

            if (bFullWidth) {
                if (!oMetadata.hideLightBackground) {
                    //temporary solution for setting the light background for applications
                    oAppContainer.addStyleClass('sapMShellGlobalInnerBackground');
                }
                oInnerControl = oAppContainer;
            } else {
                jQuery.sap.require("sap.m.Shell");
                oInnerControl = new sap.m.Shell("applicationShellPage" + sAppId, {
                    logo: sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif'),
                    title: oMetadata.title,
                    showLogout: false,
                    app: oAppContainer
                }).addStyleClass("sapUshellApplicationPage");
                if (!oMetadata.title) {
                    oInnerControl.addStyleClass("sapUshellApplicationPageNoHdr");
                }
            }

            this._applyContentDensity();

            oAppContainer.onfocusin = function () {
                //focus not in the shell
                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime = false;
            };
            oAppContainer.onfocusout = function () {
                //focus in the shell
                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = true;
                sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusPassedToExternalHandlerFirstTime = true;
            };

            // Add inner control for next request
            this.oViewPortContainer.addCenterViewPort(oInnerControl);

            setTimeout(function() {
                if (this && this.closeLoadingScreen) { //for qunit
                    this.closeLoadingScreen();//In order to prevent unnecessary opening of the loading screen, we close it after the app rendered
                }
            },0);
            return oInnerControl;
        },

        //Set booleans to false which indicate whether shellUIService was called or not
        resetShellUIServiceHandlers: function () {
            this.isHierarchyChanged = false;
            this.isTitleChanged = false;
            this.isRelatedAppsChanged = false;
        },

        onAppAfterRendering: function (oApplication) {

            //wrapped in setTimeout since "pubilsh" is not async
            setTimeout(function () {
                sap.ui.getCore().getEventBus().publish("launchpad", "appOpened", oApplication);
                jQuery.sap.log.info('app was opened');
            }, 0);

            //publish the event externally
            sap.ushell.renderers.fiori2.utils.publishExternalEvent("appOpened", oApplication);

            //Call setHierarchy, setTitle, setRelatedApps with default values in case handlers were not called yet
            if (this.oShellUIService) {
                if (!this.isHierarchyChanged) {
                    this.oShellUIService.setHierarchy();
                }
                if (!this.isTitleChanged) {
                    this.oShellUIService.setTitle();
                }
                if (!this.isRelatedAppsChanged) {
                    this.oShellUIService.setRelatedApps();
                }
            }
        },

        _getAppContainer: function (sAppId, oResolvedNavigationTarget) {

            if (oConfig.enableMergeAppAndShellHeaders === true) {
                oResolvedNavigationTarget.shellUIService = this.oShellUIService.getInterface();
            }

            return new sap.ushell.components.container.ApplicationContainer("application" + sAppId, oResolvedNavigationTarget);
        },

        /**
         * adds a listener to the "componentCreated" Event that is published by the
         * "sap.ushell.components.container.ApplicationContainer".
         * once the "home app" Component is saved, the listener is removed, and this function
         * will not do anything.
         */
        _saveHomePageComponent: function () {
            if (this.oHomeApp) {
                return;
            }
            var that = this,
                sContainerNS = "sap.ushell.components.container.ApplicationContainer",
                fListener = function (oEvent, sChannel, oData) {
                    that.oHomeApp = oData.component;
                    sap.ui.getCore().getEventBus().unsubscribe(sContainerNS, 'componentCreated', fListener);
                };
            sap.ui.getCore().getEventBus().subscribe(sContainerNS, 'componentCreated', fListener);
        },

        /**
         * Shows an error message and navigates to the previous page.
         *
         * @param {number} iHistoryLength the length of the history
         *    <b>before</b> the navigation occurred.
         * @param {string} sMessage the error message
         * @param {string} sDetails the detailed error message
         * @param {string} sComponent the component that generated the error message
         */
        hashChangeFailure: function (iHistoryLength, sMessage, sDetails, sComponent, bEnableHashChange) {
            this.reportError(sMessage, sDetails, sComponent);
            this.closeLoadingScreen();
            //use timeout to avoid "MessageService not initialized.: error
            this.delayedMessageError(sap.ushell.resources.i18n.getText("fail_to_start_app_try_later"));
            closeAllDialogs = false;

            if (iHistoryLength === 0) {
                // if started with an illegal shell hash (deep link), we just remove the hash
                hasher.setHash("");
            } else {
                // navigate to the previous URL since in this state the hash that has failed to load is in the URL.
                if (jQuery.sap.getUriParameters().get("bFallbackToShellHome")) {
                    // The previous url is not valid navigation
                    hasher.setHash("");
                } else {
                    enableHashChange = bEnableHashChange;
                    this._windowHistoryBack(1);
                }
            }
        },

        reportError: function (sMessage, sDetails, sComponent) {
            jQuery.sap.log.error(sMessage, sDetails, sComponent);
        },

        delayedMessageError: function (sMsg) {
            setTimeout(function () {
                if (sap.ushell.Container !== undefined) {
                    sap.ushell.Container.getService("Message").error(sMsg);
                }
            }, 0);
        },

        fixShellHash: function (sShellHash) {
            if (!sShellHash) {
                sShellHash = '#';
            } else if (sShellHash.charAt(0) !== '#') {
                sShellHash = '#' + sShellHash;
            }
            return sShellHash;
        },

        publishNavigationStateEvents: function (oAppContainer, oApplication) {
            //after the app container is rendered, publish an event to notify
            //that an app was opened
            var origExit,
                sId = oAppContainer.getId ? oAppContainer.getId() : "",
                that = this;
            var appMetaData = sap.ushell.services.AppConfiguration.getMetadata(),
                sIcon = appMetaData.icon,
                sTitle = appMetaData.title;

            //Attach an event handler which will be called onAfterRendering
            oAppContainer.addEventDelegate({onAfterRendering: this.onAppAfterRendering.bind(this, oApplication)});

            //after the app container exit, publish an event to notify
            //that an app was closed
            origExit = oAppContainer.exit;
            oAppContainer.exit = function () {
                if (origExit) {
                    origExit.apply(this, arguments);
                }
                //apply the original density settings
                that._applyContentDensity();

                //wrapped in setTimeout since "pubilsh" is not async
                setTimeout(function () {
                    oApplication["appId"] = sId;
                    oApplication["usageIcon"] = sIcon;
                    oApplication["usageTitle"] = sTitle;
                    sap.ui.getCore().getEventBus().publish("launchpad", "appClosed", oApplication);
                    jQuery.sap.log.info('app was closed');
                }, 0);

                //publish the event externally
                sap.ushell.renderers.fiori2.utils.publishExternalEvent("appClosed", oApplication);
            };
        },

        _openAppNewWindow: function (sUrl) {
            var newWin = window.open(sUrl);

            if (!newWin) {
                var msg = sap.ushell.resources.i18n.getText("fail_to_start_app_popup_blocker", [window.location.hostname]);
                this.delayedMessageError(msg);
            }
        },

        _windowHistoryBack: function (iStepsBack) {
            window.history.back(iStepsBack);
        },

        _changeWindowLocation: function (sUrl) {
            window.location.href = sUrl;
        },

        setAppIcons: function (oMetadataConfig) {
            var sModulePath = jQuery.sap.getModulePath("sap.ushell"),
                oLaunchIconPhone = (oMetadataConfig && oMetadataConfig.homeScreenIconPhone) ||
                    (sModulePath + '/themes/base/img/launchicons/57_iPhone_Desktop_Launch.png'),
                oLaunchIconPhone2 = (oMetadataConfig && oMetadataConfig["homeScreenIconPhone@2"]) ||
                    (sModulePath + '/themes/base/img/launchicons/114_iPhone-Retina_Web_Clip.png'),
                oLaunchIconTablet = (oMetadataConfig && oMetadataConfig.homeScreenIconTablet) ||
                    (sModulePath + '/themes/base/img/launchicons/72_iPad_Desktop_Launch.png'),
                oLaunchIconTablet2 = (oMetadataConfig && oMetadataConfig["homeScreenIconTablet@2"]) ||
                    (sModulePath + '/themes/base/img/launchicons/144_iPad_Retina_Web_Clip.png'),
                oFavIcon = (oMetadataConfig && oMetadataConfig.favIcon) ||
                    (sModulePath + '/themes/base/img/launchpad_favicon.ico'),
                sTitle = (oMetadataConfig && oMetadataConfig.title) || "",
                sCurrentFavIconHref = this.getFavIconHref();
            if (sap.ui.Device.os.ios) {
                jQuery.sap.setIcons({
                    'phone': oLaunchIconPhone,
                    'phone@2': oLaunchIconPhone2,
                    'tablet': oLaunchIconTablet,
                    'tablet@2': oLaunchIconTablet2,
                    'favicon': oFavIcon,
                    'precomposed': true
                });
            } else if (sCurrentFavIconHref !== oFavIcon) {
                jQuery.sap.setIcons({
                    'phone': '',
                    'phone@2': '',
                    'tablet': '',
                    'tablet@2': '',
                    'favicon': oFavIcon,
                    'precomposed': true
                });
            }

            window.document.title = sTitle;
        },

        /**
         * sizeChange handler, trigger by the sap.ui.Device.media.attachHandler
         * to handle header end ites overflow scenario
         * @param oParams
         */
        handleEndItemsOverflow: function(oParams){
            var aEndItems = this.getModel().getProperty("/currentState/headEndItems");
            if (oParams.name === "Desktop" && aEndItems.indexOf("endItemsOverflowBtn") > -1){
                //we need to remove the endItemsOverflowBtn from the model in case we are
                //in desktop mode and in case it exists
                this.removeHeaderEndItem(["endItemsOverflowBtn"], false, ["home", "app"]);
                var oPopover = sap.ui.getCore().byId('headEndItemsOverflow');
                if (oPopover){
                    //we have to destroy the popover in order to make sure the enditems will
                    //be rendered currectly in the header and to avoid duplicate elements
                    //ids in the dom
                    oPopover.destroy();
                }
            } else if (oParams.name !== "Desktop" && aEndItems.indexOf("endItemsOverflowBtn") === -1){
                //we need to add the endItemsOverflowBtn to the model in case we are
                //not in desktop mode and in case it does not exists
                this.addHeaderEndItem(["endItemsOverflowBtn"], false, ["home", "app"]);
            }
        },

        /**
         * returns true if we are in overflow mode
         * we enter the overflow mode in case:
         *  - meArea is on
         *  - current width of the screen is not desktop (as recived from the sap.ui.Device.media
         *  - we have 3 buttons in the header (exluding the endItemsOverflowBtn)
         * @returns {boolean}
         */
        isHeadEndItemOverflow: function(){
            var aEndItems = this.getModel().getProperty("/currentState/headEndItems");
            if (aEndItems.indexOf("endItemsOverflowBtn") === -1){
                return false;
            } else {
                return aEndItems.length > 3;
            }
        },

        /**
         * return true for buttons that should go in the overflow and not in the header
         * @param sButtonNameInUpperCase
         * @returns {boolean}
         */
        isHeadEndItemInOverflow: function(sButtonNameInUpperCase){
            return sButtonNameInUpperCase !== "ENDITEMSOVERFLOWBTN" && !this.isHeadEndItemNotInOverflow(sButtonNameInUpperCase);
        },

        /**
         * return true for buttons that should be in the header and not in oveflow
         * In case overflow mode is on @see isHeadEndItemOverflow only the
         * NotificationsCountButton and the endItemsOverflowButtons should be in the header
         * in case overflow mode is off all buttons except endItemsOverflowButtons
         * should be in the header
         *
         * @param sButtonNameInUpperCase
         * @returns {boolean}
         */
        isHeadEndItemNotInOverflow: function(sButtonNameInUpperCase){
            if (this.isHeadEndItemOverflow()){
                if (sButtonNameInUpperCase === "NOTIFICATIONSCOUNTBUTTON" || sButtonNameInUpperCase === "ENDITEMSOVERFLOWBTN"){
                    return true;
                } else {
                    return false;
                }
            } else {
                if (sButtonNameInUpperCase === "ENDITEMSOVERFLOWBTN"){
                    return false;
                } else {
                    return true;
                }
            }
        },

        /**
         * in case the endItemsOverflowButtons was pressed we need to show
         * all overflow items in the action sheet
         * @param oEvent
         */
        pressEndItemsOverflow: function (oEvent) {
            // don't hide the shell header when the action sheet is open on mobile devices only
            if (!sap.ui.Device.system.desktop) {
                //keep original header hiding value for reset after action sheet close
                var origHeaderHiding = oModel.getProperty("/currentState").headerHiding;
                if (origHeaderHiding) {
                    //if the header hiding is false -> no need to update the property
                    oModel.setProperty("/currentState/headerHiding", false);
                }
            }

            var oPopover = sap.ui.getCore().byId('headEndItemsOverflow');
            function closePopover(){
                oPopover.close();
            }

            var oItemsLayout;
            if (oPopover) {
                oItemsLayout = oPopover.getContent()[0];
            } else {
                var oFilter = new sap.ui.model.Filter('', 'EQ', 'a');
                oFilter.fnTest = this.isHeadEndItemInOverflow.bind(this);

                oItemsLayout = new sap.ui.layout.VerticalLayout({
                        content: {
                            path: "/currentState/headEndItems",
                            filters: [oFilter],
                            factory: function (sId, oContext) {
                                var oCtrl = sap.ui.getCore().byId(oContext.getObject());
                                //we don't want to add the evnet listener more then once
                                oCtrl.detachPress(closePopover);
                                oCtrl.attachPress(closePopover);
                                return oCtrl;
                            }
                        }
                    }
                );

                oPopover = new sap.m.Popover("headEndItemsOverflow", {
                    placement: sap.m.PlacementType.Bottom,
                    showHeader: false,
                    content: oItemsLayout
                });
                oItemsLayout.updateAggregation = this.getView().updateShellAggregation;
                oPopover.setModel(oModel);
                this.getView().aDanglingControls.push(oPopover);
                oPopover.attachAfterClose(oPopover, function () {
                    // reset header hiding according to the current state (on mobile devices only)
                    if (!sap.ui.Device.system.desktop) {
                        if (origHeaderHiding) {
                            //set the orig header hiding only if it was changed
                            oModel.setProperty("/currentState/headerHiding", origHeaderHiding);
                        }
                    }
                });
            }
            if (oPopover.isOpen()){
                oPopover.close();
            } else {
                oItemsLayout.updateAggregation("content");
                oPopover.openBy(oEvent.getSource());
            }
        },


        getFavIconHref: function () {
            return jQuery('link').filter('[rel="shortcut icon"]').attr('href') || '';
        },

        externalSearchTriggered: function (sChannelId, sEventId, oData) {
            oModel.setProperty("/searchTerm", oData.searchTerm);
            oData.query = oData.searchTerm;
        },
        onAfterNavigate: function (oEvent) {
            this.closeLoadingScreen();

            var sHome = this.oViewPortContainer.getInitialCenterViewPort(), //DashboardPage
                sFrom = oEvent.getParameter("fromId"),
                oFrom = oEvent.getParameter("from");

            if (sFrom && sFrom !== sHome) {
                //this.oViewPortContainer.removeAggregation("centerViewPort", sFrom, true);
                this.oViewPortContainer.removeCenterViewPort(sFrom, true);
                oFrom.destroy();
            }

            sap.ushell.utils.addTime("ShellController.onAfterNavigate");
            if (oEvent.mParameters && oEvent.mParameters.toId === sHome) {
                sap.ui.getCore().byId("configBtn").focus();
                if (this.oHomeApp && this.oHomeApp.setInitialConfiguration) {
                    this.oHomeApp.setInitialConfiguration();
                }
            }
        },
        logApplicationUsage: function (oEvent, oName, oApplication) {
            if (oConfig && oConfig.enableRecentActivity) {
                var sTitle = oApplication.usageTitle,
                    sIcon = oApplication.usageIcon,
                    sAppType = "Application",
                    sId = oApplication.appId,
                    sIntent = sId,
                    sUrl = this.lastApplicationFullHash;

                if (sId.indexOf('-') > 0) {
                    sIntent = sId.substr(sId.indexOf('-') + 1);
                }
                this._logRecentActivity({
                    icon: sIcon,
                    title: sTitle,
                    appType: sAppType,
                    appId: "#" + sIntent,
                    url: "#" + sUrl
                });
            }
        },

        openLoadingScreen: function () {
            if (this.oApplicationLoadingScreen) {
                this.oApplicationLoadingScreen.openLoadingScreen();
            }
        },

        closeLoadingScreen: function () {
            if (this.oApplicationLoadingScreen) {
                this.oApplicationLoadingScreen.closeLoadingScreen();
            }
        },

        readNavigationEnd: function () {
            var oAccessibilityHelperLoadingComplete = document.getElementById("sapUshellLoadingAccessibilityHelper-loadingComplete");

            if (oAccessibilityHelperLoadingComplete) {
                oAccessibilityHelperLoadingComplete.setAttribute("aria-live","polite");
                oAccessibilityHelperLoadingComplete.innerHTML =  sap.ushell.resources.i18n.getText("loadingComplete");
                setTimeout(function(){
                    oAccessibilityHelperLoadingComplete.setAttribute("aria-live","off");
                    oAccessibilityHelperLoadingComplete.innerHTML = "";
                },0);
            }
        },

        delayedCloseLoadingScreen: function () {
            setTimeout(function () {
                this.closeLoadingScreen();
            }.bind(this), 600);
        },

        togglePane: function (oEvent) {
            var oSource = oEvent.getSource(),
                bState = oSource.getSelected();

            sap.ui.getCore().getEventBus().publish("launchpad", "togglePane", {currentContent: oSource.getModel().getProperty("/currentState/paneContent")});

            if (oEvent.getParameter("id") === "categoriesBtn") {
                oSource.getModel().setProperty("/currentState/showCurtainPane", !bState);
            } else {
                oSource.getModel().setProperty("/currentState/showPane", !bState);
            }
        },

        /**
         * OnClick handler of the notifications counter button, on the shell header right side
         */
        toggleNotificationsView: function (oEvent) {
            var oSource = oEvent.getSource(),
                bState = oSource.getSelected(),
                oNotificationView,
                oNotificationsService,
                oNotificationsPreviewContainer = sap.ui.getCore().byId("notifications-preview-container");

            if (!sap.ui.getCore().byId('notificationsView')) {
                // Create notifications view
                oNotificationView = sap.ui.view("notificationsView", {
                    viewName: "sap.ushell.renderers.fiori2.notifications.Notifications",
                    type: 'JS',
                    viewData: {}
                });
                //TODO temporary Cozy/Compact implementation for SAPPHIRE
                if (sap.ui.Device.system.desktop) {
                    oNotificationView.removeStyleClass('sapUiSizeCozy');
                    oNotificationView.addStyleClass('sapUiSizeCompact');
                }//no need for "else", Cozy is the default mode
                // Add the notifications view to the right pane of the viewPort
                this.oViewPortContainer.addRightViewPort(oNotificationView);
            }

            // If button is already selected (pressed)
            if (bState) {
                this.oViewPortContainer.switchState("Center");
            } else {
                oNotificationsService = sap.ushell.Container.getService("Notifications");
                oNotificationsService.notificationsSeen();
                this.getView().getModel().setProperty("/notificationsCount", 0);
                //TODO : REMOVE THE CALL FOR THIS CONTROL FROM THE SHELL!!!! (oNotificationsPreviewContainer)
                if (oNotificationsPreviewContainer) {
                    oNotificationsPreviewContainer.setFloatingContainerItemsVisiblity(false);
                    var itemsCount = oNotificationsPreviewContainer.getFloatingContainerItems().length;

                    setTimeout(function () {
                        this.oViewPortContainer.navTo('rightViewPort', "notificationsView", 'show');
                        this.oViewPortContainer.switchState("RightCenter");
                        sap.ui.getCore().getEventBus().publish("launchpad", "notificationViewOpened");
                    }.bind(this), 300 + (itemsCount * 100));
                } else {
                    this.oViewPortContainer.navTo('rightViewPort', "notificationsView", 'show');
                    this.oViewPortContainer.switchState("RightCenter");
                    sap.ui.getCore().getEventBus().publish("launchpad", "notificationViewOpened");
                }
            }
            oNotificationsService = sap.ushell.Container.getService("Notifications");
            oNotificationsService.notificationsSeen();
            this.getView().getModel().setProperty("/notificationsCount", 0);

        },
        /**
         * OnClick handler of the me area header button
         */
        toggleMeAreaView: function (oEvent) {
            var oSource = oEvent.getSource(),
                bState = oSource.getSelected(),
                oMeAreaView;

            // If button is already selected (pressed)
            if (bState) {
                this.oViewPortContainer.switchState("Center");

            } else {
                this.oViewPortContainer.switchState("LeftCenter");
                //create the Me Area view only after the animation starts
                //this give an immediate visual feedback when the user clicks on the Me Area button
                if (!sap.ui.getCore().byId('meArea') && !this.bMeAreaLoaded) {
                    this.bMeAreaLoaded = true;
                    oMeAreaView = sap.ui.view("meArea", {
                        viewName: "sap.ushell.renderers.fiori2.meArea.MeArea",
                        type: 'JS',
                        viewData: this.getView().getViewData()
                    });
                    this.oViewPortContainer.addLeftViewPort(oMeAreaView);
                    this.oViewPortContainer.navTo('leftViewPort', oMeAreaView.getId());
                    this._createActionButtons();
                }

            }

            this.bMeAreaSelected = !bState;
            this.validateShowLogo();
            this.handleHomeButtonVisibility();
        },

        onScreenSizeChange: function(oParams){
            this.validateShowLogo(oParams);
            this.handleHomeButtonVisibility(oParams);
            this.handleEndItemsOverflow(oParams);
        },

        /**
         * Home button should be invisible (in the shell header) in case of navigating to the MeArea on smart phone,
         * or in MeArea on other media, when opening the MeArea from the dashboard
         */
        handleHomeButtonVisibility : function (oParams) {
            var deviceType = sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name,
                oHomeBtn = sap.ui.getCore().byId("homeBtn"),
                bVisible = true,
                oCurrentState = oModel.getProperty("/currentState");

            if (!oHomeBtn) {
                return;
            }
            if ((deviceType === "Phone" && this.bMeAreaSelected) || (deviceType !== "Phone" && oCurrentState && (oCurrentState.stateName === "home"))) {
                bVisible = false;
            }
            oHomeBtn.setVisible(bVisible);
        },

        validateShowLogo: function(oParams) {
            var deviceType;
            if (oParams){
                deviceType = oParams.name;
            } else {
                deviceType = sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name;
            }
            var bShellLogoVisible = true;
            if (deviceType === "Phone" && !this.bMeAreaSelected) {
                bShellLogoVisible = false;
            }
            this._setShowLogoProperty(bShellLogoVisible);
        },

        /*
         * method used for navigation from items of the Shell-Application-Navigation-Menu.
         * this method makes sure the view-port is centered before triggering navigation
         * (as the notifications or me-area might be open, and in addition
         * fire an event to closes the popover which opens the navigation menu
         */
        navigateFromShellApplicationNavigationMenu: function (sIntent) {

            // we must make sure the view-port is centered before triggering navigation from shell-app-nav-menu
            this.oViewPortContainer.switchState("Center");

            // trigger the navigation
            hasher.setHash(sIntent);

            // close the popover which holds the navigation menu
            var oShellAppTitle =  sap.ui.getCore().byId("shellAppTitle");
            if (oShellAppTitle) {
                oShellAppTitle.close();
            }
        },

        loadUserImage: function () {
            if (!this.bUserImageAlreadyLoaded) {
                this.getView().loadUserImage();
                this.bUserImageAlreadyLoaded = true;
            }
        },

        _loadCoreExtNWBC: function (sSender, sEventName, oAppTarget) {
            if (oAppTarget && oAppTarget.applicationType == "NWBC") {
                setTimeout(this._loadCoreExt, 2000);
            }
        },

        _loadCoreExt: function () {
            //if sap.fiori.core or sap.fiori.core-ext-light are loaded, we do not need to load core-ext-light
            var bAlreadyLoaded = jQuery.sap.isDeclared('sap.fiori.core', true) || jQuery.sap.isDeclared('sap.fiori.core-ext-light', true),
                sModuleName = window['sap-ui-debug'] ? 'sap/fiori/core-ext-light-dbg.js' : 'sap/fiori/core-ext-light.js',
                that = this;

            function loadRendererExtensionPlugins() {
                if (!that._pluginLoadingTriggered) {
                    that._pluginLoadingTriggered = true;
                    jQuery.sap.log.info("Triggering load of 'RendererExtension' plug-ins after loading core-ext module (after home page content rendered)",
                        null, "sap.ushell.renderers.fiori2.Shell");
                    sap.ushell.Container.getService("PluginManager").loadPlugins("RendererExtensions");
                }
            }

            if (bAlreadyLoaded) {
                loadRendererExtensionPlugins();
                return;
            }

            this.oCoreExtLoadingDeferred = new jQuery.Deferred();
            jQuery.sap._loadJSResourceAsync(sModuleName)
                .then(function () {
                    loadRendererExtensionPlugins();
                    that.oCoreExtLoadingDeferred.resolve();
                    that._publishCoreExtLoadedEvent();
                })
                .catch(function () {
                    loadRendererExtensionPlugins();
                    jQuery.sap.log.warning('failed to load sap.fiori.core-ext-light');
                    that.oCoreExtLoadingDeferred.reject();
                });
        },

        _publishCoreExtLoadedEvent: function () {
            setTimeout(function () {
                sap.ui.getCore().getEventBus().publish("launchpad", "coreExtLoaded");
            }, 0);
        },

        isFiori2: function(){
            return oConfig.enableMergeAppAndShellHeaders;
        },

        /*--Strat new RE Code-------------------------------------------------------------------------*/
        /*-----------Signitures--Custom State Entry--------------------*/
        addEntryInShellStates: function (sEntry, entrySuffix, fnAdd, fnRemove, oStatesConfiguration) {
            var index,
                sStateName;

            if (!customShellStates[sEntry]) {
                customShellStates[sEntry] = {
                    fnAdd: fnAdd,
                    fnHide: fnRemove
                };

                //add new entry to the model
                var aStates = this._getStatesList();

                for (index = 0; index < aStates.length; index++) {
                    sStateName = aStates[index];
                    oModel.setProperty("/states/" + sStateName + "/" + sEntry, oStatesConfiguration[sStateName]);
                }

                //create the hook functions
                this["remove" + entrySuffix] = fnRemove;
                this["add" + entrySuffix] = fnAdd;
            } else {
                throw new Error("State entry already exsists:" + sEntry);
            }
        },

        validStateEntry: function (sName) {
            return !!customShellStates[sName];
        },

        removeCustomItems: function (sStateEntry, aIds, bCurrentState, aStates) {
            if (this.validStateEntry(sStateEntry)) {
                this.validStateEntry(sStateEntry).fnRemove(aIds, bCurrentState, aStates);
            } else {
                throw new Error("Invalid state entry:" + sStateEntry);
            }
        },

        addCustomItems: function (sStateEntry, aIds, bCurrentState, aStates) {
            if (this.validStateEntry(sStateEntry)) {
                this.validStateEntry(sStateEntry).fnAdd(aIds, bCurrentState, aStates);
            } else {
                throw new Error("Invalid state entry:" + sStateEntry);
            }
        },

        showRightFloatingContainer: function (bShow) {
            this._showRightFloatingContainer(bShow);
        },

        setHeaderHiding: function (bHiding) {
            this._setHeaderHiding(bHiding)
        },

        /*-----------Signitures--Remove--------------------*/
        removeHeaderItem: function (aIds, bCurrentState, aStates) {
            this._removeShellItem("headItems", aIds, bCurrentState, aStates);
        },

        removeToolAreaItem: function (aIds, bCurrentState, aStates) {
            this._removeShellItem("toolAreaItems", aIds, bCurrentState, aStates);
        },

        removeHeaderEndItem: function (aIds, bCurrentState, aStates) {
            this._removeShellItem("headEndItems", aIds, bCurrentState, aStates);
        },

        removeRightFloatingContainerItem: function (aIds, bCurrentState, aStates) {
            this._removeShellItem("RightFloatingContainerItems", aIds, bCurrentState, aStates);
        },

        removeSubHeader: function (aIds, bCurrentState, aStates) {
            this._removeShellItem("subHeader", aIds, bCurrentState, aStates);
        },

        removeActionButton: function (aIds, bCurrentState, aStates) {
            this._removeShellItem("actions", aIds, bCurrentState, aStates);
            //addCustomItems("actions", aIds, bCurrentState, aStates);
        },

        removeLeftPaneContent: function (aIds, bCurrentState, aStates) {
            this._removeShellItem("paneContent", aIds, bCurrentState, aStates);
        },

        removeFloatingActionButton: function (aIds, bCurrentState, aStates) {
            this._removeShellItem("floatingActions", aIds, bCurrentState, aStates);
        },

        /*------------Shells Extensions--------------------*/
        applyExtendedShellState: function (sShellName) {
            this.extendedShellState = sShellName;
            this.renderShellState();
        },
        renderShellState: function () {
            var sBaseStateName = oModel.getProperty("/currentState/stateName"),
                sPath = sBaseStateName[0] === "/" ? sBaseStateName : "/states/" + sBaseStateName,
                oTemplateShell, oTemplateStateJSON,
                oShellBaseStatus = jQuery.extend(true, {}, {}, oModel.getProperty(sPath)),
                oBaseShellStates = this.oExtensionShellStates[sBaseStateName],
                oCustomStateJSON = oBaseShellStates.customShellState.getProperty("/currentState");

            // Change "currentState" property in the model to the new base state
            var oBaseStateClone = new sap.ui.model.json.JSONModel({
                "currentState": jQuery.extend(true, {}, {}, oShellBaseStatus)
            });

            oStateModelToUpdate = oBaseStateClone;
            this.bUpdateCustom = false;

            //merge the template if it has one.
            if (this.extendedShellState) {
                oTemplateShell = oBaseShellStates.extendedShellStates[this.extendedShellState].customState;
                oTemplateStateJSON = oTemplateShell.getProperty("/currentState");
                this.addCustomShellStates(oTemplateStateJSON);
            }

            //merge the custom
            this.addCustomShellStates(oCustomStateJSON);
            oStateModelToUpdate = oModel;

            //set to current state.
            oModel.setProperty("/currentState", oBaseStateClone.getProperty("/currentState"));
            this.bUpdateCustom = true;
            oBaseStateClone.destroy();
        },
        addCustomShellStates: function (oTemplateStateJSON) {
            this.addHeaderItem(oTemplateStateJSON.headItems, true);
            this.addToolAreaItem(oTemplateStateJSON.toolAreaItems, true);
            this.addHeaderEndItem(oTemplateStateJSON.headEndItems, true);
            this.addSubHeader(oTemplateStateJSON.subHeader, true);
            this.addActionButton(oTemplateStateJSON.actions, true, undefined, false);
            this.addLeftPaneContent(oTemplateStateJSON.paneContent, true);
            this.addFloatingActionButton(oTemplateStateJSON.floatingActions, true);
            this.setCurrentApplicationInformation(oTemplateStateJSON.application);
            this.showRightFloatingContainer(oTemplateStateJSON.showRightFloatingContainer);
            this.setHeaderHiding(oTemplateStateJSON.headerHiding);
            this.setHeaderVisibility(oTemplateStateJSON.headerVisible, true);

        },
        createCustomShellState: function (sShellName) {
            return new sap.ui.model.json.JSONModel({
                "currentState": {
                    "stateName": sShellName,
                    "headEndItems" : [],
                    "paneContent" : [],
                    "headItems" : [],
                    "actions" : [],
                    "floatingActions" : [],
                    "subHeader" : [],
                    "toolAreaItems" : [],
                    "RightFloatingContainerItems": [],
                    "application": {},
                    "showRightFloatingContainer": true,
                    "headerHiding": undefined
                }
            });
        },
        createExtendedShellState: function (sShellName, fnCreationInstructions) {
            var sBaseStateName = oModel.getProperty("/currentState/stateName"),
                oBaseExtensionShellStates,
                oCustomStates = this.createCustomShellState(sShellName);

            if (!this.oExtensionShellStates[sBaseStateName]) {
                this.oExtensionShellStates[sBaseStateName] = {
                    extendedShellStates: {},
                    customShellState: this.createCustomShellState("custom")
                };
            }

            oBaseExtensionShellStates = this.oExtensionShellStates[sBaseStateName].extendedShellStates;

            //validate that extension shell state does not already exists.
            if (oBaseExtensionShellStates[sShellName]) {
                return false;
            }

            //change to shadow shell.
            oStateModelToUpdate = oCustomStates;
            fnCreationInstructions();
            //store shell state
            if (oBaseExtensionShellStates[sShellName]) {
                oBaseExtensionShellStates[sShellName].customState = oCustomStates;
            } else {
                oBaseExtensionShellStates[sShellName] = {
                    managedObjects: [],
                    customState: oCustomStates
                };
            }

            oStateModelToUpdate = oModel;

            return true;
        },

        /*-----------Signitures--Get--------------------*/

        getCurrentViewportState: function () {
            var oModel = this.getModel(),
                sViewPortState = oModel.getProperty('/currentViewPortState');

            return sViewPortState;
        },

        /*-----------Signitures--Add--------------------*/

        addHeaderItem: function (aIds, bCurrentState, aStates) {
            if (aIds.length) {
                this._addUpToThreeItem("headItems", aIds, bCurrentState, aStates);
            }
        },

        addToolAreaItem: function (sId, bCurrentState, aStates) {
            if (sId.length) {
                this._addToolAreaItem("toolAreaItems", sId, bCurrentState, aStates);
            }
        },

        addRightFloatingContainerItem: function (sId, bCurrentState, aStates) {
            if (sId.length) {
                this._addRightFloatingContainerItem("RightFloatingContainerItems", sId, bCurrentState, aStates);
            }
        },

        addHeaderEndItem: function (aIds, bCurrentState, aStates) {
            if (aIds.length) {
                this._addUpToThreeItem("headEndItems", aIds, bCurrentState, aStates);
            }
        },

        addSubHeader: function (aIds, bCurrentState, aStates) {
            if (aIds.length) {
                this._addShellItem("subHeader", aIds, bCurrentState, aStates);
            }
        },

        addActionButton: function (aIds, bCurrentState, aStates, bIsFirst) {
            if (aIds.length) {
                if (bIsFirst) {
                    this._addActionButtonAtStart("actions", aIds, bCurrentState, aStates);
                } else {
                    this._addActionButton("actions", aIds, bCurrentState, aStates);
                }
            }
        },

        addLeftPaneContent: function (aIds, bCurrentState, aStates) {
            if (aIds.length) {
                this._addShellItem("paneContent", aIds, bCurrentState, aStates);
            }
        },

        addFloatingActionButton: function (aIds, bCurrentState, aStates) {
            //TODO: Check how to fix the redundant rerendering upon back navigation (caused due to the floatingAction button).
            //Check for itamars commit.
            if (aIds.length) {
                this._addShellItem("floatingActions", aIds, bCurrentState, aStates);
            }
        },
        setCurrentApplicationInformation : function(oAppInformation) {
            if (!oAppInformation) {
                oAppInformation = {};
            }
            this._updateShellProperty("application", oAppInformation, true);
        },

        /*-----------------------------Handlers----------------------------------------------------------------*/
        _showRightFloatingContainer: function (bShow) {
            var fnValidation = function (aActionItems, aId, sState) {
                return true;
            }, fnUpdate = function (modelPropertyString, bValue, oCurrentModel) {
                oCurrentModel.setProperty(modelPropertyString, bValue);
            };

            this._setShellItem("showRightFloatingContainer", bShow, true, [], fnValidation, fnUpdate);
        },

        _setShowLogoProperty: function(bValue){
            var fnValidation = function (aActionItems, aId, sState) {
                return true;
            }, fnUpdate = function (modelPropertyString, bValue, oCurrentModel) {
                oCurrentModel.setProperty(modelPropertyString, bValue);
            };

            this._setShellItem("showLogo",bValue,false, ["home", "app"], fnValidation, fnUpdate);
        },

        _addActionButtonAtStart: function (sPropertyString, aId, bCurrentState, aStates) {
            var fnValidation = function (aActionItems, aId, sState) {
                return true;
            }, fnUpdate = function (modelPropertyString, aIds, oCurrentModel) {
                var aActions = oCurrentModel.getProperty(modelPropertyString),
                    cAIds = aIds.slice(0);

                oCurrentModel.setProperty(modelPropertyString, cAIds.concat(aActions));
            };
            this._setShellItem(sPropertyString, aId, bCurrentState, aStates, fnValidation, fnUpdate);
        },

        _addActionButton: function (sPropertyString, aId, bCurrentState, aStates) {
            var fnValidation = function (aActionItems, aId, sState) {
                return true;
            }, fnUpdate = function (modelPropertyString, aIds, oCurrentModel) {
                var aActions = oCurrentModel.getProperty(modelPropertyString);

                var iLogoutButtonIndex = aActions.indexOf("logoutBtn");
                if (iLogoutButtonIndex > -1) {
                    aActions.splice.apply(aActions, [iLogoutButtonIndex, 0].concat(aIds));
                } else {
                    aActions = aActions.concat(aIds);
                }

                oCurrentModel.setProperty(modelPropertyString, aActions);
            };
            this._setShellItem(sPropertyString, aId, bCurrentState, aStates, fnValidation, fnUpdate);
        },

        _makeEndUserFeedbackAnonymousByDefault : function (bEndUserFeedbackAnonymousByDefault) {
            this.oEndUserFeedbackConfiguration.anonymousByDefault = bEndUserFeedbackAnonymousByDefault;
        },

        _showEndUserFeedbackLegalAgreement : function (bShowEndUserFeedbackLegalAgreement) {
            this.oEndUserFeedbackConfiguration.showLegalAgreement = bShowEndUserFeedbackLegalAgreement;
        },

        _setFloatingContainerDragSelector: function (sElementToCaptureSelector) {

            if (this.oFloatingUIActions) {
                this.oFloatingUIActions.delete();
            }
            this.oFloatingUIActions = new sap.ushell.UIActions({
                containerSelector: "#shell",
                wrapperSelector: '.sapUshellShellFloatingContainerWrapper',
                draggableSelector: '.sapUshellShellFloatingContainerWrapper',//the element that we drag
                rootSelector: "#shell",
                cloneClass: "sapUshellFloatingContainer-clone",
                dragCallback: this._handleFloatingContainerUIStart.bind(this), //for hide the original item while dragging
                endCallback: this._handleFloatingContainerDrop.bind(this),
                moveTolerance: 3,
                switchModeDelay: 1000,
                isLayoutEngine: false,
                isTouch: false,//that.isTouch,
                elementToCapture: sElementToCaptureSelector,
                debug: jQuery.sap.debug()
            }).enable();

        },
        _setFloatingContainerContent: function (sPropertyString, aIds, bCurrentState, aStates) {
            var fnValidation = function (aItems, aIds, sState) {
                return aIds.length === 1;//aItems.length === 1;
            };
            var fnUpdate = function (modelPropertyString, aIds) {
                var aItems = oModel.getProperty(modelPropertyString),
                    aCopyItems = aItems.slice(0);
                oModel.setProperty(modelPropertyString, aCopyItems.concat(aIds));
            };
            var floatingContainerWrapper = document.querySelector(".sapUshellShellFloatingContainerWrapper"),
                storage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer");
            if (storage.get("floatingContainerStyle")) {
                floatingContainerWrapper.setAttribute("style", storage.get("floatingContainerStyle"));
            } else {
                var emSize = parseFloat(jQuery("body").css("font-size"));
                var iLeftPos =  jQuery(window).width() - jQuery("#shell-floatingContainer").width() - 2 * emSize;
                floatingContainerWrapper.setAttribute("style", "left:" + iLeftPos / jQuery(window).width() + "%;top:0;position:absolute;");
            }
            this._setShellItem(sPropertyString, aIds, bCurrentState, aStates, fnValidation, fnUpdate);
        },
        _handleFloatingContainerDrop: function (oEvent, ui, oDelta) {
            var floatingContainerWrapper = document.querySelector(".sapUshellShellFloatingContainerWrapper"),
                storage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer"),
                iWindowWidth = jQuery(window).width(),
                iWindowHeight = jQuery(window).height(),
                iPosLeft = oDelta.deltaX / iWindowWidth,
                iPosTop = oDelta.deltaY / iWindowHeight,
                sOrigContainerVisibility = floatingContainerWrapper.style.visibility,
                sOrigContainerDisplay = floatingContainerWrapper.style.display,
                iContainerLeft = parseFloat(floatingContainerWrapper.style.left.replace("%","")),
                iContainerTop = parseFloat(floatingContainerWrapper.style.top.replace("%",""));

            floatingContainerWrapper.style.visibility = 'hidden';
            floatingContainerWrapper.style.display = 'block';

            if (iContainerLeft) {
                iPosLeft = iContainerLeft + 100 * oDelta.deltaX / iWindowWidth;
            }

            if (iContainerTop) {
                iPosTop = iContainerTop + 100 * oDelta.deltaY / iWindowHeight;
            }

            floatingContainerWrapper.setAttribute("style", "left:" + iPosLeft + "%;top:" + iPosTop + "%;position:absolute;");
            floatingContainerWrapper.visibility = sOrigContainerVisibility;
            floatingContainerWrapper.display = sOrigContainerDisplay;
            storage.put("floatingContainerStyle", floatingContainerWrapper.getAttribute("style"));
        },
        _handleFloatingContainerUIStart: function (evt, ui) {
            var floatingContainer = ui;

            floatingContainer.style.display = "none";
            if (window.getSelection) {
                var selection = window.getSelection();
                // for IE
                try {
                    selection.removeAllRanges();
                } catch (e) {
                    // continue regardless of error
                }
            }
        },
        _setFloatingContainerVisibility: function (bVisible) {
            this.getView().getOUnifiedShell().setFloatingContainerVisible(bVisible);
        },

        _getFloatingContainerVisibility: function () {
            return this.getView().getOUnifiedShell().getFloatingContainerVisible();
        },

        _getRightFloatingContainerVisibility: function () {
            var oRightFloatingContainer = this.getView().getOUnifiedShell().getRightFloatingContainer(),
                bRightFloatingContainerVisible = oRightFloatingContainer && oRightFloatingContainer.getVisible();

            return bRightFloatingContainerVisible;
        },

        _addUpToThreeItem: function (sPropertyString, aId, bCurrentState, aStates) {
            var fnValidation = function (aItems, aIds, sState) {
                var allocatedItemSpace = 0,
                    index,
                    sId;

                //we always allow to create the overflow button
                if (aIds.length === 1 && aIds[0] === "endItemsOverflowBtn"){
                    return true;
                }
                for (index = 0; index < aItems.length; index++) {
                    sId = aItems[index];
                    if (sId === 'actionsBtn') {
                        allocatedItemSpace += 2;
                    } else if (sId !== "endItemsOverflowBtn"){
                        //increment the counter but not consider the overflow button
                        allocatedItemSpace++;
                    }

                    if (allocatedItemSpace + aIds.length > 3) {
                        jQuery.sap.log.warning("maximum of three items has reached, cannot add more items.");
                        return false;
                    }
                }

                return true;
            }, fnUpdate = function (modelPropertyString, aIds, oCurrentModel) {
                var aItems = oCurrentModel.getProperty(modelPropertyString),
                    aCopyItems = aItems.slice(0);
                //we need to make sure that the NotificationsCountButton is allways at the end
                if (aCopyItems[aCopyItems.length - 1] === "NotificationsCountButton"){
                    //in case NotificationsCountButton is visible we add the new items bofore it
                    aCopyItems.splice.apply(aCopyItems, [aCopyItems.length - 1, 0].concat(aIds));
                } else {
                    //in case NotificationsCountButton is not visible we add the new items at the end
                    aCopyItems = aCopyItems.concat(aIds);
                }
                oCurrentModel.setProperty(modelPropertyString, aCopyItems);
            };
            this._setShellItem(sPropertyString, aId, bCurrentState, aStates, fnValidation, fnUpdate);
        },

        _addShellItem: function (sPropertyString, aId, bCurrentState, aStates) {
            var fnValidation = function (aItems, aId, sState) {
                if (aItems.length > 0) {
                    jQuery.sap.log.warning("You can only add one item. Replacing existing item: " + aItems[0] + " in state: " + sState + ", with the new item: " + aId[0] + ".");
                }
                return true;
            }, fnUpdate = function (modelPropertyString, aIds, oCurrentModel) {
                oCurrentModel.setProperty(modelPropertyString, aId.slice(0));
            };
            this._setShellItem(sPropertyString, aId, bCurrentState, aStates, fnValidation, fnUpdate);
        },

        _updateShellProperty : function(sPropertyString, aValue, bCurrentState, aStates) {

            // validation function always returns true - no real validation
            var fnValidation = function (aItems, value, sState) {
                return value != undefined;
            }, fnUpdate = function (modelPropertyString, aValue, oCurrentModel) {
                oCurrentModel.setProperty(modelPropertyString, aValue);
            };

            this._setShellItem(sPropertyString, aValue, bCurrentState, aStates, fnValidation, fnUpdate);
        },

        _addRightFloatingContainerItem: function (sPropertyString, sId, bCurrentState, aStates) {
            var fnValidation = function () {
                return true;
            }, fnUpdate = function (modelPropertyString, sId, oCurrentModel) {
                var aItems = oCurrentModel.getProperty(modelPropertyString);
                aItems.unshift(sId);

                oCurrentModel.setProperty(modelPropertyString, aItems);
            };

            this._setShellItem(sPropertyString, sId, bCurrentState, aStates, fnValidation, fnUpdate);
        },

        _addToolAreaItem: function (sPropertyString, sId, bCurrentState, aStates) {
            var fnValidation = function () {
                return true;
            }, fnUpdate = function (modelPropertyString, sId, oCurrentModel) {
                var aItems = oCurrentModel.getProperty(modelPropertyString);
                aItems.push(sId);

                oCurrentModel.setProperty(modelPropertyString, aItems);
            };

            var index,
                aPassStates = this._getPassStates(aStates);

            for (index = 0; index < aPassStates.length; index++) {
                this.showShellItem("/toolAreaVisible", aPassStates[index], true);
            }

            this._setShellItem(sPropertyString, sId, bCurrentState, aStates, fnValidation, fnUpdate);
        },

        _removeShellItem: function (sPropertyString, sId, bCurrentState, aStates) {
            var fnValidation = function (aItems, aIds) {
                var location,
                    sId,
                    index;

                for (index = 0; index < aIds.length; index++) {
                    sId = aIds[index];
                    location = aItems.indexOf(sId);
                    if (location < 0) {
                        jQuery.sap.log.warning("You cannot remove Item: " + sId + ", the headItem does not exists.");
                        return false;
                    }
                }

                return true;
            }, fnUpdate = function (modelPropertyString, aIds, oCurrentModel) {
                var aItems = oModel.getProperty(modelPropertyString),
                    location,
                    sId,
                    index;

                for (index = 0; index < aIds.length; index++) {
                    sId = aIds[index];
                    location = aItems.indexOf(sId);
                    if (location > -1) {
                        aItems.splice(location, 1);
                    }
                }

                oCurrentModel.setProperty(modelPropertyString, aItems);
            };
            this._setShellItem(sPropertyString, sId, bCurrentState, aStates, fnValidation, fnUpdate);
        },

        _setShellItem: function (sPropertyString, aId, bCurrentState, aStates, fnValidation, fnUpdate) {
            var modelPropertyString,
                aItems,
                oCurrentModel = oStateModelToUpdate;

            if (bCurrentState === true) {
                modelPropertyString = "/currentState/" + sPropertyString;
                aItems = oCurrentModel.getProperty(modelPropertyString);

                //make validations
                if (fnValidation(aItems, aId, "currentState") === false) {
                    return;
                }
                fnUpdate(modelPropertyString, aId, oCurrentModel);
                //also update the oCustomShellStateModel
                //check that we are not pointing to a shadow shell
                if (oStateModelToUpdate === oModel && this.bUpdateCustom === true) {
                    fnUpdate(modelPropertyString, aId, oCustomShellStateModel);
                }
            } else {
                var aPassStates = this._getPassStates(aStates),
                    i,
                    oCurrentStateName = oCurrentModel.getProperty("/currentState/stateName");

                for (i = 0; i < aPassStates.length; i++) {
                    var sState = aPassStates[i],
                        j;
                    modelPropertyString = "/states/" + sState + "/" + sPropertyString;
                    aItems = oCurrentModel.getProperty(modelPropertyString);

                    //make validations
                    if (fnValidation(aItems, aId, sState) === false) {
                        return;
                    }

                    var aModelStates = this._getModelStates(sState);
                    for (j = 0; j < aModelStates.length; j++) {
                        modelPropertyString = "/states/" + aModelStates[j] + "/" + sPropertyString;
                        fnUpdate(modelPropertyString, aId, oCurrentModel);
                        if (oCurrentStateName === aModelStates[j]) {
                            //It was added to the base shell state so after we add it to the base recalculate the shell state.
                            if (this.bUpdateCustom) {
                                this.renderShellState();
                            }
                        }
                    }
                }
            }
        },

        //gets the array of the valid states that need to be update according to the arguments that were passed
        _getPassStates: function (aStates) {
            //an array with the relevant states that were pass as argument
            var aPassStates = [],
                i;
            aStates = aStates || [];

            for (i = 0; i < aStates.length; i++) {
                if (aStates[i] !== undefined) {
                    if (aStates[i] !== "home" && aStates[i] !== "app") {
                        throw new Error("sLaunchpadState value is invalid");
                    }
                    aPassStates.push(aStates[i]);
                }
            }

            if (!aPassStates.length) {
                aPassStates = ["app", "home"];
            }

            return aPassStates;
        },

        //gets all the models states that need to be update according to the state that was pass as argument
        _getModelStates: function (sStates) {

            //an array with the relevant states that need to updated in the model
            var aModelStates = [];

            //in case we need to update to the "app" state, need to update all app states
            if (sStates === "app") {
                var appStates = ["app", "minimal", "standalone", "embedded", "headerless"];
                aModelStates = aModelStates.concat(appStates);
            } else {
                aModelStates.push(sStates);
            }
            return aModelStates;
        },

        _getStatesList: function () {
            var oStates = oModel.getProperty("/states");

            return Object.keys(oStates);
        },

        /*---------------------------general purpose-------------------------*/

        showShellItem: function (sProperty, sState, bVisible) {

            var sModelStateProperty,
                oState,
                aStates = this._getModelStates(sState),
                aModelStates = this.getModel().getData().states,
                sModelCurrentStateProperty = "/currentState" + sProperty;
            for (var i = 0; i < aStates.length; i++) {
                oState = aModelStates[aStates[i]];
                sModelStateProperty = "/states/" + oState.stateName + sProperty;
                oStateModelToUpdate.setProperty(sModelStateProperty, bVisible);
            }
            if (oStateModelToUpdate.getProperty("/currentState/stateName") === sState) {
                oStateModelToUpdate.setProperty(sModelCurrentStateProperty, bVisible);
            }
        },

        _setHeaderTitle: function (sTitle, oInnerControl) {
            if (typeof sTitle !== "string") {
                throw new Error("sTitle type is invalid");
            }

            this.getView().getOUnifiedShell().getHeader().setTitleControl(sTitle, oInnerControl);
        },

        _setHeaderHiding: function (bHiding) {
            this._updateShellProperty("headerHiding", bHiding, true);
        },

        addEndUserFeedbackCustomUI: function (oCustomUIContent, bShowCustomUIContent) {
            if (oCustomUIContent) {
                this.oEndUserFeedbackConfiguration.customUIContent = oCustomUIContent;
            }
            if (bShowCustomUIContent === false) {
                this.oEndUserFeedbackConfiguration.showCustomUIContent = bShowCustomUIContent;
            }
        },

        setHeaderVisibility: function(bVisible, bCurrentState, aStates){
            this._updateShellProperty("headerVisible", bVisible, bCurrentState, aStates);
        },

        /*--End new RE Code-------------------------------------------------------------------------*/

        setFooter: function (oFooter) {
            if (typeof oFooter !== "object" || !oFooter.getId) {
                throw new Error("oFooter value is invalid");
            }
            if (this.getView().oShellPage.getFooter() !== null) { //there can be only 1 footer
                jQuery.sap.log.warning("You can only set one footer. Replacing existing footer: " + this.getView().oShellPage.getFooter().getId() + ", with the new footer: " + oFooter.getId() + ".");
            }
            this.getView().oShellPage.setFooter(oFooter);
        },

        removeFooter: function () {
            if (this.getView().oShellPage.getFooter() === null) {
                jQuery.sap.log.warning("There is no footer to remove.");
                return;
            }
            this.getView().oShellPage.setFooter(null);
        },

        addUserPreferencesEntry: function (entryObject) {
            this._validateUserPrefEntryConfiguration(entryObject);
            this._updateUserPrefModel(entryObject);
        },


        _validateUserPrefEntryConfiguration: function (entryObject) {
            if ((!entryObject) || (typeof entryObject !== "object")) {
                throw new Error("object oConfig was not provided");
            }
            if (!entryObject.title) {
                throw new Error("title was not provided");
            }

            if (!entryObject.value) {
                throw new Error("value was not provided");
            }

            if (typeof entryObject.entryHelpID !== "undefined") {
                if (typeof entryObject.entryHelpID !== "string") {
                    throw new Error("entryHelpID type is invalid");
                } else {
                    if (entryObject.entryHelpID === "") {
                        throw new Error("entryHelpID type is invalid");
                    }
                }
            }

            if (entryObject.title && typeof entryObject.title !== "string") {
                throw new Error("title type is invalid");
            }

            if (typeof entryObject.value !== "function" && typeof entryObject.value !== "string" && typeof entryObject.value !== "number") {
                throw new Error("value type is invalid");
            }

            if (entryObject.onSave && typeof entryObject.onSave !== "function") {
                throw new Error("onSave type is invalid");
            }

            if (entryObject.content && typeof entryObject.content !== "function") {
                throw new Error("content type is invalid");
            }

            if (entryObject.onCancel && typeof entryObject.onCancel !== "function") {
                throw new Error("onCancel type is invalid");
            }
        },
        addElementToManagedQueue: function (oItem) {
            //update extenstionShell
            //get the current model ref
            var sStateName = oStateModelToUpdate.getProperty("/currentState/stateName"),
                sBaseStateName = oModel.getProperty("/currentState/stateName"),
                oBaseExtensionShellStates,
                sItemId = oItem.getId();


            if (!this.oExtensionShellStates[sBaseStateName]) {
                this.oExtensionShellStates[sBaseStateName] = {
                    extendedShellStates: {},
                    customShellState: this.createCustomShellState("custom")
                };
            }

            oBaseExtensionShellStates = this.oExtensionShellStates[sBaseStateName].extendedShellStates;

            if (!oBaseExtensionShellStates[sStateName]) {
                oBaseExtensionShellStates[sStateName] = {
                    managedObjects: [],
                    customState: undefined
                };
            }

            oBaseExtensionShellStates[sStateName].managedObjects.push(sItemId);
            //Update managedElements
            var oManagedElement = this.managedElements[sItemId];

            if (oManagedElement) {
                oManagedElement.nRefCount++;
            } else {
                oManagedElement = {
                    oItem: oItem,
                    nRefCount: 1
                };
                this.managedElements[sItemId] = oManagedElement;
            }
        },
        destroyManageQueue: function (aExcludeStates) {
            var sShellStateKey,
                nExtendedShellStateIndex,
                sElementIdToRelease,
                oManagedElemet,
                oBaseStateExtensionShellStates,
                sBaseExtShellStateKey,
                oStateExtensionShellStates;

            //loop over base states home / app
            for (sShellStateKey in this.oExtensionShellStates) {
                if (this.oExtensionShellStates.hasOwnProperty(sShellStateKey)) {
                    // Do not delete the extensionShellsState on home or on states that created by home.
                    if (!aExcludeStates || aExcludeStates.indexOf(sShellStateKey) === -1) {
                        oBaseStateExtensionShellStates = this.oExtensionShellStates[sShellStateKey].extendedShellStates;
                        //loop over extended shell states
                        for (sBaseExtShellStateKey in oBaseStateExtensionShellStates) {
                            if (oBaseStateExtensionShellStates.hasOwnProperty(sBaseExtShellStateKey)) {
                                oStateExtensionShellStates = oBaseStateExtensionShellStates[sBaseExtShellStateKey].managedObjects;
                                //loop over the elements in that extension shell state
                                for (nExtendedShellStateIndex = 0; nExtendedShellStateIndex < oStateExtensionShellStates.length; nExtendedShellStateIndex++) {
                                    sElementIdToRelease = oStateExtensionShellStates[nExtendedShellStateIndex];
                                    oManagedElemet = this.managedElements[sElementIdToRelease];
                                    //update the number of references to the element, because the extended shell state ni longer available
                                    oManagedElemet.nRefCount--;

                                    if (oManagedElemet.nRefCount === 0) {
                                        //delete the object
                                        oManagedElemet.oItem.destroy();
                                    }
                                }
                                //remove the base extension for that shell state
                                delete oBaseStateExtensionShellStates[sBaseExtShellStateKey];
                            }
                        }
                        //remove the extended shell state
                        delete this.oExtensionShellStates[sShellStateKey];
                    }
                }
            }
        },
        switchViewState: function (sState, bSaveLastState) {

            var sPath = sState[0] === "/" ? sState : "/states/" + sState,
                oState = oModel.getProperty(sPath),
                oCurrentState = oModel.getProperty("/currentState") || {},
                excludeStatesInGC = ["home"];

            if (!!bSaveLastState) {
                oModel.setProperty("/lastState", oCurrentState);
            }

            this.destroyManageQueue(excludeStatesInGC);

            // Change "currentState" property in the model to the new state
            oModel.setProperty("/currentState", jQuery.extend(true, {}, {}, oState));

            //create custom shell state.
            if (!this.oExtensionShellStates[sState]) {
                this.oExtensionShellStates[sState] = {
                    extendedShellStates: {},
                    customShellState: this.createCustomShellState(sState)
                };
            }

            //change current state according to the sState.
            oCustomShellStateModel = this.oExtensionShellStates[sState].customShellState;
            this.extendedShellState = undefined;
            this.renderShellState();

            if (sState === "searchResults") {
                oModel.setProperty("/lastSearchScreen", '');
                if (!hasher.getHash().indexOf("Action-search") === 0) {
                    var searchModel = sap.ui.getCore().getModel("searchModel");
                    hasher.setHash("Action-search&/searchTerm=" + searchModel.getProperty("/uiFilter/searchTerms") + "&dataSource=" + JSON.stringify(searchModel.getProperty("/uiFilter/dataSource").getJson()));
                }
            }

            sap.ui.getCore().getEventBus().publish("launchpad", "shellViewStateChanged", oState);
        },

        _navBack: function () {
            // set meAria as closed when navigating back
            this.bMeAreaSelected = false;
            this.oViewPortContainer.switchState("Center");
            window.history.back();
        },

        _updateUserPrefModel: function (entryObject) {
            var newEntry = {
                "entryHelpID": entryObject.entryHelpID,
                "title": entryObject.title,
                "editable": entryObject.content ? true : false,
                "valueArgument": entryObject.value,
                "valueResult": null,
                "onSave": entryObject.onSave,
                "onCancel": entryObject.onCancel,
                "contentFunc": entryObject.content,
                "contentResult": null
            };
            var userPreferencesEntryArray = oModel.getProperty("/userPreferences/entries");
            userPreferencesEntryArray.push(newEntry);
            oModel.setProperty("/userPreferences/entries", userPreferencesEntryArray);
        },

        pressActionBtn: function (oEvent) {
            // don't hide the shell header when the action sheet is open on mobile devices only
            if (!sap.ui.Device.system.desktop) {
                //keep original header hiding value for reset after action sheet close
                var origHeaderHiding = oModel.getProperty("/currentState").headerHiding;
                if (origHeaderHiding) {
                    //if the header hiding is false -> no need to update the property
                    oModel.setProperty("/currentState/headerHiding", false);
                }
            }
            var oActionSheet = sap.ui.getCore().byId('headActions');
            if (!oActionSheet) {
                this._createActionButtons();
                // Filtering out buttons that does not exist.
                // i.e. when the button's name is included in the array /currentState/actions but the actual control was not created.
                // For example EndUserFeedback button is not created when EndUserFeedbackAdapter is not implemented,
                //  but its name ("EndUserFeedbackBtn") appears in the actions array for several states.
                var oFilter = new sap.ui.model.Filter('', 'EQ', 'a');
                oFilter.fnTest = function (sButtonNameInUpperCase) {
                    var aButtonsNames = oModel.getProperty("/currentState/actions"),
                        sButtonName,
                        index;
                    for (index = 0; index < aButtonsNames.length; index++) {
                        sButtonName = aButtonsNames[index];
                        if (sButtonName.toUpperCase() == sButtonNameInUpperCase) {
                            return !!sap.ui.getCore().byId(sButtonName);
                        }
                    }
                };

                oActionSheet = new sap.m.ActionSheet("headActions", {
                    placement: sap.m.PlacementType.Bottom,
                    buttons: {
                        path: "/currentState/actions",
                        filters: [oFilter],
                        factory: function (sId, oContext) {
                            var oCtrl = sap.ui.getCore().byId(oContext.getObject());
                            if (oCtrl && oCtrl.setActionType) {
                                oCtrl.setActionType("standart");
                            }
                            return oCtrl;
                        }
                    }
                });
                oActionSheet.updateAggregation = this.getView().updateShellAggregation;
                oActionSheet.setModel(oModel);
                this.getView().aDanglingControls.push(oActionSheet);
                oActionSheet.attachAfterClose(oActionSheet, function () {
                    // reset header hiding according to the current state (on mobile devices only)
                    if (!sap.ui.Device.system.desktop) {
                        if (origHeaderHiding) {
                            //set the orig header hiding only if it was changed
                            oModel.setProperty("/currentState/headerHiding", origHeaderHiding);
                        }
                    }
                });
            }
            oActionSheet.updateAggregation("buttons");
            oActionSheet.openBy(oEvent.getSource());
        },
        _setUserPrefModel: function () {
            var userPreferencesEntryArray = oModel.getProperty("/userPreferences/entries");
            var oDefaultUserPrefModel = this._getUserPrefDefaultModel();
            oDefaultUserPrefModel.entries = oDefaultUserPrefModel.entries.concat(userPreferencesEntryArray);

            oModel.setProperty("/userPreferences", oDefaultUserPrefModel);
        },

        _getUserPrefDefaultModel: function () {
            var that = this;
            var oUser = sap.ushell.Container.getUser();
            var language = oUser.getLanguage();
            var server = window.location.host;
            var languageTitle = sap.ushell.resources.i18n.getText("languageFld");
            var serverTitle = sap.ushell.resources.i18n.getText("serverFld");

            // search preferences (user profiling, concept of me)
            // entry is added async only if search is active
            jQuery.sap.require('sap.ushell.renderers.fiori2.search.userpref.SearchPrefs');
            var SearchPreferences = sap.ushell.renderers.fiori2.search.userpref.SearchPrefs;
            var searchPreferencesEntry = SearchPreferences.getEntry();
            searchPreferencesEntry.isSearchPrefsActive().done(function (isSearchPrefsActive) {
                if (!isSearchPrefsActive) {
                    return;
                }
                that.addUserPreferencesEntry(searchPreferencesEntry);
            });

            function ThemeSelectorEntry() {
                this.view = null;

                this.getView = function () {
                    if (!this.view || !sap.ui.getCore().byId('userPrefThemeSelector')) {
                        this.view = sap.ui.jsview("userPrefThemeSelector", "sap.ushell.renderers.fiori2.theme_selector.ThemeSelector");
                    }
                    return this.view;
                };

                var onSaveFunc = function () {
                    var dfd = this.getView().getController().onSave();
                    dfd.done(function () {
                        // re-calculate tiles background color according to the selected theme
                        if (oModel.getProperty("/tilesOpacity") === true) {
                            sap.ushell.utils.handleTilesOpacity();
                        }
                    });
                    return dfd;
                }.bind(this);

                var onCancelFunc = function () {
                    return this.getView().getController().onCancel();
                }.bind(this);

                var getContentFunc = function () {
                    return this.getView().getController().getContent();
                }.bind(this);

                var getValueFunc = function () {
                    return this.getView().getController().getValue();
                }.bind(this);

                var isThemeEditable;
                if (oModel.getProperty("/setTheme") !== undefined) {
                    isThemeEditable = oModel.getProperty("/setTheme") && oUser.isSetThemePermitted();
                } else {
                    isThemeEditable = oUser.isSetThemePermitted();
                }

                return {
                    entryHelpID: "themes",
                    title: sap.ushell.resources.i18n.getText("theme"),
                    editable: isThemeEditable,
                    valueArgument: getValueFunc,// the function which will be called to get the entry value
                    valueResult: null,
                    onSave: onSaveFunc,
                    onCancel: onCancelFunc, // the function which will be called when canceling entry changes
                    contentFunc: getContentFunc,// the function which will be called to get the content of the detailed entry
                    contentResult: null
                };
            }

            var themeSelectorEntry = new ThemeSelectorEntry();


            function UsageAnalyticsEntry() {
                this.view = null;

                this.getView = function () {
                    if (!this.view || !sap.ui.getCore().byId('userPrefUsageAnalyticsSelector')) {
                        this.view = sap.ui.jsview("userPrefUsageAnalyticsSelector", "sap.ushell.renderers.fiori2.usageAnalytics_selector.UsageAnalyticsSelector");
                    }
                    return this.view;
                };

                var onSaveFunc = function () {
                    return this.getView().getController().onSave();
                }.bind(this);

                var getContentFunc = function () {
                    return this.getView().getController().getContent();
                }.bind(this);

                var getValueFunc = function () {
                    return this.getView().getController().getValue();
                }.bind(this);

                return {
                    entryHelpID: "usageAnalytics",
                    title: sap.ushell.resources.i18n.getText("usageAnalytics"),
                    editable: sap.ushell.Container.getService("UsageAnalytics").isSetUsageAnalyticsPermitted(),
                    valueArgument: getValueFunc,// the function which will be called to get the entry value
                    valueResult: null,
                    onSave: onSaveFunc,
                    onCancel: null, // the function which will be called when canceling entry changes
                    contentFunc: getContentFunc,// the function which will be called to get the content of the detailed entry
                    contentResult: null
                };
            }

            var usageAnalyticsEntry = new UsageAnalyticsEntry();

            function CompactCozySelectorEntry() {
                this.view = null;

                this.getView = function () {
                    if (!this.view || !sap.ui.getCore().byId('userPrefCompactCozySelector')) {
                        this.view = sap.ui.jsview("userPrefCompactCozySelector", "sap.ushell.renderers.fiori2.compactCozy_selector.CompactCozySelector");
                    }
                    return this.view;
                };

                var onSaveFunc = function () {
                    return this.getView().getController().onSave();
                }.bind(this);

                var onCancelFunc = function () {
                    return this.getView().getController().onCancel();
                }.bind(this);

                var getContentFunc = function () {
                    return this.getView().getController().getContent();
                }.bind(this);

                var getValueFunc = function () {
                    return this.getView().getController().getValue();
                }.bind(this);

                return {
                    entryHelpID: "contentDensity",
                    title: sap.ushell.resources.i18n.getText("displayDensity"),
                    editable: true,
                    valueArgument: getValueFunc,// the function which will be called to get the entry value
                    valueResult: null,
                    onSave: onSaveFunc,
                    onCancel: onCancelFunc, // the function which will be called when canceling entry changes
                    contentFunc: getContentFunc,// the function which will be called to get the content of the detailed entry
                    contentResult: null
                };
            }

            function DefaultParametersEntry() {
                this.view = null;

                this.getView = function () {
                    if (!this.view || !sap.ui.getCore().byId('defaultParametersSelector')) {
                        this.view = sap.ui.jsview("defaultParametersSelector", "sap.ushell.renderers.fiori2.defaultParameters_selector.DefaultParameters");
                    }
                    return this.view;
                };

                var onSaveFunc = function () {
                    return this.getView().getController().onSave();
                }.bind(this);

                var onCancelFunc = function () {
                    return this.getView().getController().onCancel();
                }.bind(this);

                var getContentFunc = function () {
                    return this.getView().getController().getContent();
                }.bind(this);

                var getValueFunc = function () {
                    return this.getView().getController().getValue();
                }.bind(this);

                return {
                    //entryHelpID: "themes",
                    title: sap.ushell.resources.i18n.getText("userDefaults"),
                    editable: true,
                    visible: false,
                    valueArgument: getValueFunc,// the function which will be called to get the entry value
                    valueResult: null,
                    onSave: onSaveFunc,
                    onCancel: onCancelFunc, // the function which will be called when canceling entry changes
                    contentFunc: getContentFunc,// the function which will be called to get the content of the detailed entry
                    contentResult: null
                };
            }

            var entries =
                [
                    {
                        entryHelpID: "serverName",
                        title: serverTitle,
                        editable: false,
                        valueArgument: server,
                        valueResult: null
                    },
                    {
                        entryHelpID: "language",
                        title: languageTitle,
                        editable: false,
                        valueArgument: language,
                        valueResult: null
                    },
                    //Old theme is initialized to be the current theme
                    themeSelectorEntry

                ];

            if (sap.ushell.Container.getService("UsageAnalytics").systemEnabled() && sap.ushell.Container.getService("UsageAnalytics").isSetUsageAnalyticsPermitted()) {
                entries.push(usageAnalyticsEntry);
            }

            //if FLP is running on combi device AND compactCozy flag is on then create the view for user preferences
            if (sap.ui.Device.system.combi && oModel.getProperty("/contentDensity")) {
                entries.push(new CompactCozySelectorEntry());
            }

            if (oModel.getProperty("/userDefaultParameters")) {
                entries.push(new DefaultParametersEntry());
            }

            return {
                dialogTitle: sap.ushell.resources.i18n.getText("userPreferences"),
                isDetailedEntryMode: false,
                activeEntryPath: null, //the entry that is currently modified
                entries: entries
            };
        },
        onAfterViewPortSwitchState: function (oEvent) {
            var toState = oEvent.getParameter("to");
            var oShellAppTitle =  sap.ui.getCore().byId("shellAppTitle");
            oModel.setProperty("/currentViewPortState", toState);
            //Propagate the event 'afterSwitchState' for launchpad consumers.
            sap.ui.getCore().getEventBus().publish("launchpad", "afterSwitchState", oEvent);
            if (toState === "Center") {
                oShellAppTitle.setVisible(true);
            } else {
                oShellAppTitle.setVisible(false);
            }
        },
        getModel: function () {
            return oModel;
        },

        _getConfig: function() {
            return oConfig ? oConfig : {};
        },

        _createWaitForRendererCreatedPromise: function() {
            var oPromise,
                oRenderer;

            oRenderer = sap.ushell.Container.getRenderer();
            if (oRenderer) {
                // should always be the case except initial start; in this case, we return an empty array to avoid delays by an additional async operation
                jQuery.sap.log.debug("Shell controller._createWaitForRendererCreatedPromise: shell renderer already created, return empty array.");
                return [];
            } else {
                oPromise = new Promise(function(resolve, reject) {
                    var fnOnRendererCreated;

                    fnOnRendererCreated = function() {
                        jQuery.sap.log.info("Shell controller: resolving component waitFor promise after shell renderer created event fired.");
                        resolve();
                        sap.ushell.Container.detachRendererCreatedEvent(fnOnRendererCreated);
                    };
                    oRenderer = sap.ushell.Container.getRenderer();
                    if (oRenderer) {
                        // unlikely to happen, but be robust
                        jQuery.sap.log.debug("Shell controller: resolving component waitFor promise immediately (shell renderer already created");
                        resolve();
                    } else {
                        sap.ushell.Container.attachRendererCreatedEvent(fnOnRendererCreated);
                    }
                });
                return [ oPromise ];
            }
        }
    });
}());