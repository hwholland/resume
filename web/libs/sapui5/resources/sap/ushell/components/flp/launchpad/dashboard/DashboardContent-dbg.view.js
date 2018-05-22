// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/**
 * @fileOverview The Fiori launchpad main view.<br>
 * The view is of type <code>sap.ui.jsview</code> that includes a <code>sap.m.page</code>
 * with a header of type <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>
 * and content of type <code>sap.ushell.ui.launchpad.DashboardGroupsContainer</code>.
 *
 * @version 1.38.26
 * @name sap.ushell.components.flp.launchpad.dashboard.DashboardContent.view
 * @private
 */
(function () {
    "use strict";
    /*global jQuery, sap, document, self */
    /*jslint plusplus: true, nomen: true, vars: true */

    jQuery.sap.require("sap.ushell.components.flp.launchpad.dashboard.DashboardGroupsBox");
    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");
    jQuery.sap.require("sap.ushell.ui.launchpad.Tile");
    jQuery.sap.require("sap.ushell.override");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.Layout");
    jQuery.sap.require("sap.ushell.ui.launchpad.AnchorItem");
    jQuery.sap.require("sap.ushell.ui.shell.RightFloatingContainer");

    sap.ui.jsview("sap.ushell.components.flp.launchpad.dashboard.DashboardContent", {

        /**
         * Creating the content of the main dashboard view.
         * The view is basically a sap.m.Page control that contains:
         *  - AnchorNavigationBar as header.
         *  - DashboardGroupsBox that contains the groups and tiles as content.
         */
        createContent: function (oController) {
            var oDashboardGroupsBoxModule,
                that = this,
                oViewPortContainer = sap.ui.getCore().byId("viewPortContainer"),
                bConfigEnableNotificationsPreview;

            this.isTouch = sap.ui.Device.system.combi ? false : (sap.ui.Device.system.phone || sap.ui.Device.system.tablet);
            this.isCombi = sap.ui.Device.system.combi;
            this.parentComponent = sap.ui.core.Component.getOwnerComponentFor(this);
            this.oModel = this.parentComponent.getModel();
            this.addStyleClass("sapUshellDashboardView");
            this.ieHtml5DnD = !!(this.oModel.getProperty("/personalization") && (sap.ui.Device.browser.msie || sap.ui.Device.browser.edge) && sap.ui.Device.browser.version >= 11 &&
            (sap.ui.Device.system.combi || sap.ui.Device.system.tablet));

            sap.ui.getCore().getEventBus().subscribe("launchpad", "contentRendered", this._onAfterDashboardShow, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "initialConfigurationSet", this._onAfterDashboardShow, this);
            sap.ui.getCore().byId('navContainerFlp').attachAfterNavigate(this.onAfterNavigate, this);

            this.addEventDelegate({
                onBeforeFirstShow: function () {
                    var oDashboardManager = sap.ushell.components.flp.launchpad.getDashboardManager();
                    oDashboardManager.loadPersonalizedGroups();
                    that.onAfterNavigate();
                },
                onAfterShow: function () {
                    //in case we came back from the catalog, and groups were added to home page
                    that.getController()._addBottomSpace();
                    var oRenderer = sap.ushell.Container.getRenderer('fiori2');

                    oRenderer.showRightFloatingContainer(false);
                },
                onAfterHide: function (evt) {
                }
            });

            // Create that AnchorNavigationBar object - the header of the dashboard page 
            this.oAnchorNavigationBar = this._getAnchorNavigationBar(oController);

            oDashboardGroupsBoxModule = new sap.ushell.components.flp.launchpad.dashboard.DashboardGroupsBox();
            // Create the DashboardGroupsBox object that contains groups and tiles
            this.oDashboardGroupsBox = oDashboardGroupsBoxModule.createGroupsBox(oController, this.oModel);

            // If NotificationsPreview is enabled by configuration - then shifting the scaled center viewPort (when moving ot he right viewport) is also enabled.
            // When notification preview in rendered  the dashboard is smaller in width,
            // hence, when it is being scaled it also needs to be shifted in order to "compensate" for the area of the notifications preview
            bConfigEnableNotificationsPreview = this.oModel.getProperty('/configEnableNotificationsPreview');
            if (oViewPortContainer) {
                oViewPortContainer.shiftCenterTransitionEnabled(bConfigEnableNotificationsPreview);
            }

            var fnUpdateAggregation = function (sName) {
                /*jslint nomen: true */
                var oBindingInfo = this.mBindingInfos[sName],
                    oAggregationInfo = this.getMetadata().getJSONKeys()[sName],
                    oClone;

                jQuery.each(this[oAggregationInfo._sGetter](), jQuery.proxy(function (i, v) {
                    this[oAggregationInfo._sRemoveMutator](v);
                }, this));
                jQuery.each(oBindingInfo.binding.getContexts(), jQuery.proxy(function (i, v) {
                    oClone = oBindingInfo.factory(this.getId() + "-" + i, v) ? oBindingInfo.factory(this.getId() + "-" + i, v).setBindingContext(v, oBindingInfo.model) : "";
                    this[oAggregationInfo._sMutator](oClone);
                }, this));
            };

            this.oPreviewNotificationsContainerPlaceholder = new sap.ushell.ui.shell.RightFloatingContainer({
                id: 'notifications-preview-container-placeholder',
                visible: {
                    path: '/enableNotificationsPreview',
                    formatter: this._handleNotificationsPreviewVisibility.bind(this)
                }
            }).addStyleClass('sapUshellPreviewNotificationsConainer');
            this.oPreviewNotificationsContainer = new sap.ushell.ui.shell.RightFloatingContainer({
                id: 'notifications-preview-container',
                top: 5.5,
                right: '1rem',
                floatingContainerItems: {
                    path: "/previewNotificationItems",
                    factory: function (functionId, oContext) {
                        return sap.ui.getCore().byId(oContext.getObject().previewItemId);
                    }},
                visible: {
                    path: '/enableNotificationsPreview',
                    formatter: this._handleNotificationsPreviewVisibility.bind(this)
                }
            }).addStyleClass('sapContrastPlus')
            .addStyleClass('sapContrast');
            this.oPreviewNotificationsContainer.updateAggregation = fnUpdateAggregation;

            this.oPage = new sap.m.Page('sapUshellDashboardPage', {
                customHeader: this.oAnchorNavigationBar,
                content: [
                    this.oDashboardGroupsBox,
                    this.oPreviewNotificationsContainerPlaceholder,
                    this.oPreviewNotificationsContainer
                ]
            });

            return [
                this.oPage
            ];
        },

        _handleNotificationsPreviewVisibility: function (bEnableNotificationsPreview) {
            var oRenderer = sap.ushell.Container.getRenderer('fiori2'),
                sCurrentViewPortState = oRenderer.getCurrentViewportState(),
                bIsCenter = sCurrentViewPortState === 'Center',
                oNotificationSrvc = sap.ushell.Container.getService('Notifications');

            this.oDashboardGroupsBox.toggleStyleClass('sapUshellDashboardGroupsContainerSqueezed', bEnableNotificationsPreview);
            this.oAnchorNavigationBar.toggleStyleClass('sapUshellAnchorNavigationBarSqueezed', bEnableNotificationsPreview);
            bEnableNotificationsPreview = bEnableNotificationsPreview && bIsCenter;
            if (bEnableNotificationsPreview) {
                if (!this.bNotificationsRegistered) {
                    oNotificationSrvc.registerNotificationsUpdateCallback(this.oController._notificationsUpdateCallback.bind(this.oController));
                    this.bNotificationsRegistered = true;
                }
                // If the first Notifications read already happened, then this registration is too late and we missed the data of the first read
                if (oNotificationSrvc.isFirstDataLoaded()) {
                    setTimeout(function () {
                        if (this.oController && this.oController._notificationsUpdateCallback) {
                            this.oController._notificationsUpdateCallback();
                        }
                    }.bind(this), 300);
                }
                if (!this.bSubscribedToViewportStateSwitch) {
                    this.bHeadsupNotificationsInitialyVisible = oRenderer.getRightFloatingContainerVisibility();
                    sap.ui.getCore().getEventBus().subscribe("launchpad", "afterSwitchState", this._handleViewportStateSwitch, this);
                    this.bSubscribedToViewportStateSwitch = true;
                }
                //this._handleHeadsupNotificationsPresentation(sCurrentViewPortState);
            }

            return bEnableNotificationsPreview;
        },

        // *********************************************************************************************
        // *************************** AnchorNavigationBar functions - Begin ***************************

        _fOnAfterAnchorBarRenderingHandler: function (oEvent) {
            var xRayEnabled = this.getModel() && this.getModel().getProperty('/enableHelp');
            if (this.getDefaultGroup()) {
                // if xRay is enabled
                if (xRayEnabled) {
                    this.addStyleClass("help-id-homeAnchorNavigationBarItem"); //xRay help ID
                }
            } else {
                // if xRay is enabled
                if (xRayEnabled) {
                    this.addStyleClass("help-id-anchorNavigationBarItem"); //xRay help ID
                }
            }
        },

        _getAnchorItemTemplate: function () {
            var oAnchorItemTemplate = new sap.ushell.ui.launchpad.AnchorItem({
                index : "{index}",
                title: "{title}",
                groupId: "{groupId}",
                defaultGroup : "{isDefaultGroup}",
                selected: false,
                isGroupRendered: "{isRendered}",
                visible: {
                    parts: ["/tileActionModeActive", "isGroupVisible", "visibilityModes"],
                    formatter: function (tileActionModeActive, isGroupVisible, visibilityModes) {
                        //Empty groups should not be displayed when personalization is off or if they are locked or default group not in action mode
                        if (!visibilityModes[tileActionModeActive ? 1 : 0]) {
                            return false;
                        }
                        return isGroupVisible || tileActionModeActive;
                    }
                },
                afterRendering : this._fOnAfterAnchorBarRenderingHandler
            });
            return oAnchorItemTemplate;
        },

        _getAnchorNavigationBar: function (oController) {
            var oAnchorItemTemplate = this._getAnchorItemTemplate(),
                oAnchorNavigationBar = new sap.ushell.ui.launchpad.AnchorNavigationBar("anchorNavigationBar", {
                    selectedItemIndex: "{/topGroupInViewPortIndex}",
                    itemPress: [ function (oEvent) {
                        this._handleAnchorItemPress(oEvent);
                    }, oController ],
                    groups: {
                        path: "/groups",
                        template: oAnchorItemTemplate
                    }
                });
            oAnchorNavigationBar = this._extendAnchorNavigationBar(oAnchorNavigationBar);
            oAnchorNavigationBar.addStyleClass("sapContrastPlus");
            return oAnchorNavigationBar;
        },

        _extendAnchorNavigationBar: function (oAnchorNavigationBar) {
            var oExtendedAnchorNavigationBar = jQuery.extend(oAnchorNavigationBar, {
                onsapskipforward: function (oEvent) {
                    oEvent.preventDefault();
                    sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                    sap.ushell.components.flp.ComponentKeysHandler.goToTileContainer(oEvent, this.bGroupWasPressed);
                    this.bGroupWasPressed = false;
                },
                onsaptabnext: function (oEvent) {
                    oEvent.preventDefault();
                    var jqFocused = jQuery(":focus");
                    if (!jqFocused.parent().parent().siblings().hasClass("sapUshellAnchorItemOverFlow") ||
                        (jqFocused.parent().parent().siblings().hasClass("sapUshellAnchorItemOverFlow") &&
                        jqFocused.parent().parent().siblings().hasClass("sapUshellShellHidden"))) {
                        sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        sap.ushell.components.flp.ComponentKeysHandler.goToTileContainer(oEvent);
                        this.bGroupWasPressed = false;
                    } else {
                        var jqElement = jQuery(".sapUshellAnchorItemOverFlow button");
                        jqElement.focus();
                    }
                },
                onsapskipback: function (oEvent) {
                    oEvent.preventDefault();
                    sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                    sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                },
                onsaptabprevious: function (oEvent) {
                    oEvent.preventDefault();
                    var jqFocused = jQuery(":focus");
                    if (!jqFocused.parent().hasClass("sapUshellAnchorItemOverFlow")) {
                        sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                    } else {
                        var jqElement = jQuery(".sapUshellAnchorItem:visible:first");
                        if (!jqElement.length) {
                            sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(oEvent);
                        }
                        jqElement.focus();
                    }
                },
                onsapenter: function (oEvent) {
                    oEvent.srcControl.getDomRef().click();
                },
                onsapspace: function (oEvent) {
                    oEvent.srcControl.getDomRef().click();
                }
            });
            return oExtendedAnchorNavigationBar;
        },

        // **************************** AnchorNavigationBar functions - End ****************************
        // *********************************************************************************************

        _addActionModeButtonsToDashboard: function () {
            if (sap.ushell.components.flp.ActionMode) {
                sap.ushell.components.flp.ActionMode.init(this.getModel());
            }
        },

        _createActionModeMenuButton : function () {
            var oTileActionsButton = sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                id: "ActionModeBtn",
                text: sap.ushell.resources.i18n.getText("activateActionMode"),
                icon: 'sap-icon://edit',
                press: function () {
                    var dashboardGroups = this.oDashboardGroupsBox.getGroups();
                    sap.ushell.components.flp.ActionMode.toggleActionMode(this.oModel, "Menu Item", dashboardGroups);
                }.bind(this)
            }, false, true);
            // if xRay is enabled
            if (this.oModel.getProperty("/enableHelp")) {
                oTileActionsButton.addStyleClass('help-id-ActionModeBtn');// xRay help ID
            }
            sap.ushell.Container.getRenderer("fiori2").showActionButton(oTileActionsButton.getId(), true);
        },

        _createFloatingActionButton : function () {
            var oFloatingActionButton = sap.ushell.Container.getRenderer("fiori2").addFloatingActionButton("sap.ushell.ui.shell.ShellFloatingAction", {
                id: "floatingActionBtn",
                icon: 'sap-icon://edit',
                press: function (oEvent) {
                    var dashboardGroups = this.oDashboardGroupsBox.getGroups();
                    sap.ushell.components.flp.ActionMode.toggleActionMode(this.oModel, "Floating Button", dashboardGroups);
                    sap.ushell.Layout.reRenderGroupsLayout(null);
                }.bind(this),
                tooltip: sap.ushell.resources.i18n.getText("activateActionMode")
            }, false, true);

            oFloatingActionButton.data("sap-ui-fastnavgroup", "true", true); // Write into DOM
            oFloatingActionButton.addEventDelegate({

                onsapskipback: function (oEvent) {
                    oEvent.preventDefault();
                    sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                },

                onsaptabprevious: function (oEvent) {
                    oEvent.preventDefault();
                    sap.ushell.renderers.fiori2.AccessKeysHandler.bFocusOnShell = false;
                }
            });

            // if xRay is enabled
            if (this.oModel.getProperty("/enableHelp")) {
                oFloatingActionButton.addStyleClass('help-id-floatingActionBtn');// xRay help ID
            }

            sap.ushell.Container.getRenderer("fiori2").showFloatingActionButton(oFloatingActionButton.getId(), true);

        },

        _createActionButtons : function () {
            var bEnablePersonalization = this.oModel.getProperty("/personalization"),
                that = this;
            // Create action mode button in the user actions menu
            if (this.oModel.getProperty("/actionModeMenuButtonEnabled") && bEnablePersonalization) {
                this._createActionModeMenuButton();
            }

            var oConfig = sap.ushell.Container.getRenderer('fiori2').getModelConfiguration(),
                bMeAreaEnabled = oConfig.enableMeArea;

            // Create floating action mode button
            if (this.oModel.getProperty("/actionModeFloatingButtonEnabled") && bEnablePersonalization && !bMeAreaEnabled) {
                this._createFloatingActionButton();
            }

            //handle open catalog
            if (bEnablePersonalization) {
                this.oOpenCatalogItem = sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                    id: "openCatalogBtn",
                    text: sap.ushell.resources.i18n.getText("open_appFinder"),
                    icon: 'sap-icon://sys-find',
                    actionType: bMeAreaEnabled ? 'action' : 'default',
                    press: function () {
                        that.parentComponent.getRouter().navTo('appFinder', {'menu': 'catalog'});
                        var viewPortContainer = sap.ui.getCore().byId('viewPortContainer');
                        viewPortContainer.switchState("Center");
                    }
                }, true, true);

                // if xRay is enabled
                if (this.oModel.getProperty("/enableHelp")) {
                    this.oOpenCatalogItem.addStyleClass('help-id-openCatalogActionItem');// xRay help ID
                }
            }
        },

        onAfterNavigate: function (oEvent) {
            var oNavContainerFlp = sap.ui.getCore().byId('navContainerFlp'),
                oCurrentViewName = oNavContainerFlp ? oNavContainerFlp.getCurrentPage().getViewName() : undefined,
                bInDashboard = oCurrentViewName == "sap.ushell.components.flp.launchpad.dashboard.DashboardContent",
                oRenderer = sap.ushell.Container.getRenderer("fiori2"),
                that = this;

            bInDashboard = bInDashboard && sap.ui.getCore().byId('shell') &&
                sap.ui.getCore().byId('shell').getModel() && sap.ui.getCore().byId('shell').getModel().getProperty("/currentState/stateName") == "home";

            if (bInDashboard) {
                oRenderer.createExtendedShellState("dashboardExtendedShellState", function () {
                    this._createActionButtons();
                    oRenderer.setHeaderHiding(false);
                }.bind(this));

                this.getController()._setCenterViewPortShift();

                //Add action menu items
                this._addActionModeButtonsToDashboard();

                // set the focus to anchorSelectedItem group
                var visibleGroups = that.oAnchorNavigationBar.getVisibleGroups(),
                    anchorSelectedItemIndex = that.oAnchorNavigationBar.getSelectedItemIndex(),
                    anchorItemToFocus = visibleGroups[anchorSelectedItemIndex];
                if (anchorItemToFocus) {
                    jQuery(anchorItemToFocus.getDomRef()).focus();
                }
                setTimeout(function () {
                    if (sap.ushell.Container) {
                        oRenderer.applyExtendedShellState("dashboardExtendedShellState");
                    }
                }, 0);

                if (this.oAnchorNavigationBar && this.oAnchorNavigationBar.anchorItems) {
                    this.oAnchorNavigationBar.setNavigationBarItemsVisibility();
                    this.oAnchorNavigationBar.adjustItemSelection(this.oAnchorNavigationBar.getSelectedItemIndex());
                }
            }
        },

        _handleViewportStateSwitch: function (sChannelId, sEventId, oData) {
            var sCurrentViewportState = oData.getParameter('to');
            //this._handleHeadsupNotificationsPresentation(sCurrentViewportState);

            if (sCurrentViewportState == 'Center') {
                var oNotificationsPreviewContainer = sap.ui.getCore().byId("notifications-preview-container");
                if (oNotificationsPreviewContainer && oNotificationsPreviewContainer.setFloatingContainerItemsVisiblity) {
                    oNotificationsPreviewContainer.setFloatingContainerItemsVisiblity(true);
                }

            }
        },

        _handleHeadsupNotificationsPresentation : function (sCurrentViewPortState) {
            var oRenderer = sap.ushell.Container.getRenderer('fiori2'),
                bIsCenterViewportState = sCurrentViewPortState === 'Center',
                oPreviewNotificationsContainerDomRef = this.oPreviewNotificationsContainer.getDomRef(),
                oHeadsupNotificationsContainerBoundingRect = oPreviewNotificationsContainerDomRef && oPreviewNotificationsContainerDomRef.getBoundingClientRect(),
                bPreviewContainerNotInViewport = oHeadsupNotificationsContainerBoundingRect ? oHeadsupNotificationsContainerBoundingRect.bottom < 0 : false,
                bShowHeadsupNotificationsContainer = bIsCenterViewportState ? bPreviewContainerNotInViewport : this.bHeadsupNotificationsInitialyVisible;

            oRenderer.showRightFloatingContainer(bShowHeadsupNotificationsContainer);
        },

        _onAfterDashboardShow : function (oEvent) {
            var aJqTileContainers = jQuery('.sapUshellTileContainer:visible'),
                oNavContainerFlp = sap.ui.getCore().byId('navContainerFlp'),
                oCurrentViewName = oNavContainerFlp ? oNavContainerFlp.getCurrentPage().getViewName() : undefined,
                bIsInDashboard = oCurrentViewName == "sap.ushell.components.flp.launchpad.dashboard.DashboardContent",
                bTileActionsModeActive = this.oModel.getProperty('/tileActionModeActive'),
                oViewPortContainer,
                bPreviewNotificationsActive;

            if (bIsInDashboard) {
                if (!bTileActionsModeActive) {
                    sap.ushell.utils.handleTilesVisibility();
                    sap.ushell.utils.refreshTiles();
                    var iTopGroupInViewPortIndex = this.oModel.getProperty('/topGroupInViewPortIndex'),
                        jqTopGroupInViewPort = jQuery(aJqTileContainers[iTopGroupInViewPortIndex]),
                        jqFirstTile = jqTopGroupInViewPort.find('.sapUshellTile:first'),
                        jqElementToFocus = jqFirstTile.length ? jqFirstTile : jQuery("#configBtn");

                    // The ViewPortContainer needs to be notified whether Preview of NotificationsPreview is enabled or not,
                    //  since it has effect on the transition of the scaled center viewPort when switching to the right viewport
                    bPreviewNotificationsActive = this.oModel.getProperty('/enableNotificationsPreview');
                    oViewPortContainer = sap.ui.getCore().byId("viewPortContainer");
                    if (oViewPortContainer) {
                        oViewPortContainer.shiftCenterTransition(bPreviewNotificationsActive);
                    }
                    setTimeout(function () {
                        jqElementToFocus.focus();
                    }, 1000);
                }
                this.onAfterNavigate();
            }
        },

        getControllerName: function () {
            return "sap.ushell.components.flp.launchpad.dashboard.DashboardContent";
        },

        _isInDeashboard: function () {
            var oNavContainer = sap.ui.getCore().byId("viewPortContainer"),
                oControl = sap.ui.getCore().byId("dashboardGroups");

            return ((oNavContainer.getCurrentCenterPage() === "application-Shell-home") && (oControl.getModel().getProperty("/currentViewName") === "home"));
        },

        exit: function () {
            sap.ui.core.mvc.View.prototype.exit.apply(this, arguments);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "contentRendered", this._onAfterDashboardShow, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "initialConfigurationSet", this._onAfterDashboardShow, this);
            if (this.bSubscribedToViewportStateSwitch) {
                sap.ui.getCore().getEventBus().unsubscribe("launchpad", "afterSwitchState", this._handleViewportStateSwitch, this);
                this.bSubscribedToViewportStateSwitch = false;
            }
        }
    });
}());