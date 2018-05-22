// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, setTimeout, clearTimeout, $ */
    /*jslint plusplus: true, nomen: true */
    jQuery.sap.require("sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions");
    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");
    sap.ui.controller("sap.ushell.components.flp.launchpad.dashboard.DashboardContent", {

        onInit: function () {
            var oEventBus = sap.ui.getCore().getEventBus();

            this.handleDashboardScroll = this._handleDashboardScroll.bind(this);

            oEventBus.subscribe("launchpad", "appClosed", this._resizeHandler, this);
            oEventBus.subscribe("launchpad", "appOpened", this._appOpenedHandler, this);
            oEventBus.subscribe("launchpad", "dashboardModelContentLoaded", this._modelLoaded, this);
            oEventBus.subscribe('launchpad', 'actionModeInactive', this._handleGroupVisibilityChanges, this);

            //when the browser tab is hidden we want to stop sending requests from tiles
            window.document.addEventListener("visibilitychange", sap.ushell.utils.handleTilesVisibility, false);
            this.sViewId = "#" + this.oView.getId();

            //On Android 4.x, and Safari mobile in Chrome and Safari browsers sometimes we can see bug with screen rendering
            //so _webkitMobileRenderFix function meant to fix it after  `contentRefresh` event.
            if (sap.ui.Device.browser.mobile) {
                oEventBus.subscribe("launchpad", "contentRefresh", this._webkitMobileRenderFix, this);
            }
            this.isDesktop = (sap.ui.Device.system.desktop && (navigator.userAgent.toLowerCase().indexOf('tablet') < 0));
            this.isNotificationPreviewLoaded = false;

            this._setCenterViewPortShift();
        },

        onExit: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.unsubscribe("launchpad", "contentRefresh", this._webkitMobileRenderFix, this);
            oEventBus.unsubscribe("launchpad", "appClosed", this._resizeHandler, this);
            oEventBus.unsubscribe("launchpad", "appOpened", this._appOpenedHandler, this);
            oEventBus.unsubscribe("launchpad", "dashboardModelContentLoaded", this._modelLoaded, this);
            window.document.removeEventListener("visibilitychange", sap.ushell.utils.handleTilesVisibility, false);
        },

        onAfterRendering: function () {
            var oEventBus = sap.ui.getCore().getEventBus(),
                oView = this.getView(),
                oDomRef = oView.getDomRef(),
                oScrollableElement = oDomRef.getElementsByTagName('section'),
                oModel,
                topViewPortGroupIndex,
                oGroup,
                bIsInEditTitle,
                timer;

            jQuery(oScrollableElement[0]).off("scrollstop", this.handleDashboardScroll);
            jQuery(oScrollableElement[0]).on("scrollstop", this.handleDashboardScroll);

            //Bind launchpad event handlers
            oEventBus.unsubscribe("launchpad", "scrollToGroup", this._scrollToGroup, this);
            oEventBus.subscribe("launchpad", "scrollToGroup", this._scrollToGroup, this);
            oEventBus.unsubscribe("launchpad", "scrollToFirstVisibleGroup", this._scrollToFirstVisibleGroup, this);
            oEventBus.subscribe("launchpad", "scrollToFirstVisibleGroup", this._scrollToFirstVisibleGroup, this);

            sap.ui.Device.orientation.attachHandler(function () {
                var jqTileContainers = jQuery('#dashboardGroups').find('.sapUshellTileContainer:visible');
                if (jqTileContainers.length) {
                    oModel = this.getView().getModel();
                    topViewPortGroupIndex = oModel.getProperty('/topGroupInViewPortIndex');

                    if (jqTileContainers.get(topViewPortGroupIndex)) {
                        oGroup = sap.ui.getCore().byId(jqTileContainers.get(topViewPortGroupIndex).id);
                        bIsInEditTitle = oModel.getProperty('/editTitle');
                        this._publishAsync("launchpad", "scrollToGroup", {
                            group: oGroup,
                            isInEditTitle: bIsInEditTitle
                        });
                    }
                }
            }, this);

            jQuery(window).bind("resize", function () {
                clearTimeout(timer);
                timer = setTimeout(this._resizeHandler.bind(this), 300);
            }.bind(this));

            if (this.getView().getModel().getProperty("/personalization") && !sap.ushell.components.flp.ActionMode) {
                jQuery.sap.require("sap.ushell.components.flp.ActionMode");
                sap.ushell.components.flp.ActionMode.init(this.getView().getModel());
            }
            this._updateTopGroupInModel();
        },

        _setCenterViewPortShift: function () {
            var oViewPortContainer = sap.ui.getCore().byId("viewPortContainer");
            if (oViewPortContainer) {
                // The dashboard can contain the notification preview, hence,
                // shifting the scaled center veiwport (when moving to the right viewport) might be needed
                oViewPortContainer.shiftCenterTransition(true);
            }
        },

        _dashboardDeleteTileHandler: function (oEvent) {
            var oTileControl = oEvent.getSource(), oTile = oTileControl.getBindingContext().getObject().object,
                oData = {originalTileId: sap.ushell.Container.getService("LaunchPage").getTileId(oTile)};
            sap.ui.getCore().getEventBus().publish("launchpad", "deleteTile", oData, this);
        },

        dashboardTilePress: function () {
            sap.ui.getCore().getEventBus().publish("launchpad", "dashboardTileClick");
        },

        _updateTopGroupInModel: function () {
            var oModel = this.getView().getModel(),
                topViewPortGroupIndex = this._getIndexOfTopGroupInViewPort();

            oModel.setProperty('/topGroupInViewPortIndex', topViewPortGroupIndex);
        },

        _getIndexOfTopGroupInViewPort: function () {
            var oView = this.getView(),
                oDomRef = oView.getDomRef(),
                oScrollableElement = oDomRef.getElementsByTagName('section'),
                jqTileContainers = $(oScrollableElement).find('.sapUshellTileContainer'),
                oOffset = jqTileContainers.not('.sapUshellHidden').first().offset(),
                firstContainerOffset = (oOffset && oOffset.top) || 0,
                aTileContainersTopAndBottoms = [],
                nScrollTop = oScrollableElement[0].scrollTop,
                viewPortTop,
                topGroupIndex = 0;

            // In some weird corner cases, those may not be defined -> bail out.
            if (!jqTileContainers || !oOffset) {
                return topGroupIndex;
            }

            jqTileContainers.each(function () {
                if (!jQuery(this).hasClass("sapUshellHidden")) {
                    var nContainerTopPos = jQuery(this).parent().offset().top;
                    aTileContainersTopAndBottoms.push([nContainerTopPos, nContainerTopPos + jQuery(this).parent().height()]);
                }
            });

            viewPortTop = nScrollTop + firstContainerOffset;
            jQuery.each(aTileContainersTopAndBottoms, function (index, currentTileContainerTopAndBottom) {
                var currentTileContainerTop = currentTileContainerTopAndBottom[0],
                    currentTileContainerBottom = currentTileContainerTopAndBottom[1];

                //'24' refers to the hight decrementation of the previous TileContainer to improve the sync between the  top group in the viewport and the  selected group in the anchor bar.
                if (currentTileContainerTop - 24 <= viewPortTop && viewPortTop <= currentTileContainerBottom) {
                    topGroupIndex = index;
                    return false;
                }
            });
            return topGroupIndex;
        },

        _handleDashboardScroll: function () {
            var oView = this.getView();
            //sCurrentViewPortState = oRenderer.getCurrentViewportState();

            this._updateTopGroupInModel();
            sap.ushell.utils.handleTilesVisibility();

            //close anchor popover if it is open
            oView.oAnchorNavigationBar.closeOverflowPopup();

            //update anchor navigation bar
            oView.oAnchorNavigationBar.reArrangeNavigationBarElements();

            //Handle scrolling for the Notifications Preview.
            //oView._handleHeadsupNotificationsPresentation.apply(oView, [sCurrentViewPortState]);
        },

        //Delete or Reset a given group according to the removable state.
        _handleGroupDeletion: function (oGroupBindingCtx) {
            jQuery.sap.require('sap.m.MessageBox');
            var oEventBus = sap.ui.getCore().getEventBus(),
                oGroup = oGroupBindingCtx.getObject(),
                bIsGroupRemovable = oGroup.removable,
                sGroupTitle = oGroup.title,
                sGroupId = oGroup.groupId,
                oResourceBundle = sap.ushell.resources.i18n,
                oMessageSrvc = sap.ushell.Container.getService("Message"),
                mActions = sap.m.MessageBox.Action,
                mCurrentAction = (bIsGroupRemovable ? mActions.DELETE : oResourceBundle.getText('ResetGroupBtn'));

            oMessageSrvc.confirm(oResourceBundle.getText(bIsGroupRemovable ? 'delete_group_msg' : 'reset_group_msg', sGroupTitle), function (oAction) {
                if (oAction === mCurrentAction) {
                    oEventBus.publish("launchpad", bIsGroupRemovable ? 'deleteGroup' : 'resetGroup', {
                        groupId: sGroupId
                    });
                }
            }, oResourceBundle.getText(bIsGroupRemovable ? 'delete_group' : 'reset_group'), [mCurrentAction, mActions.CANCEL]);
        },

        _modelLoaded: function () {
            this.bModelInitialized = true;
            sap.ushell.Layout.getInitPromise().then(function () {
                this._initializeUIActions();
            }.bind(this));
        },
        _initializeUIActions: function () {
            var oDashboardUIActionsModule = new sap.ushell.components.flp.launchpad.dashboard.DashboardUIActions();
            oDashboardUIActionsModule.initializeUIActions(this);
        },
        //force browser to repaint Body, by setting it `display` property to 'none' and to 'block' again
        _forceBrowserRerenderElement: function (element) {
            var animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
            if (animationFrame) {
                animationFrame(function () {
                    var display = element.style.display;
                    element.style.display = 'none';
                    element.style.display = display;
                });
            } else {
                jQuery.sap.log.info('unsupported browser for animation frame');
            }
        },

        //function fixes Android 4.x Chrome, and Safari bug with poor rendering
        _webkitMobileRenderFix: function () {
            //force Chrome to repaint Body, by setting it `display` property to 'none' and to 'block' again
            if (sap.ui.Device.browser.chrome || sap.ui.Device.os.android) {
                // this includes almost all browsers and devices
                // if this is the IOS6 (as the previous fix causes double flickering
                // and this one only one flickering)
                this._forceBrowserRerenderElement(document.body);
            }
        },

        _resizeHandler: function () {
            this._addBottomSpace();
            sap.ushell.utils.handleTilesVisibility();

            //Layout calculation is relevant only when the dashboard is presented
            var bInDahsboard = jQuery.find("#dashboardGroups:visible").length;

            if (sap.ushell.Layout && bInDahsboard) {
                sap.ushell.Layout.reRenderGroupsLayout(null);
                this._initializeUIActions();
            }
        },

        _appOpenedHandler: function (sChannelId, sEventId, oData) {
            var oViewPortContainer,
                oParentComponent,
                sParentName,
                oModel = this.getView().getModel();

            // checking if application component opened is not the FLP App Component (e.g. navigation to an app, not 'Home')
            // call to set all tiles visibility off (so no tile calls will run in the background)
            oParentComponent = this.getOwnerComponent();
            sParentName = oParentComponent.getMetadata().getComponentName();
            if (oData.additionalInformation.indexOf(sParentName) === -1) {
                sap.ushell.utils.setTilesNoVisibility();// setting no visibility on all visible tiles
                // After an application is opened - the notification preview is not shown,
                // hence, shifting the scaled center veiwport (when moving to the right viewport) is not needed
                oViewPortContainer = sap.ui.getCore().byId("viewPortContainer");
                if (oViewPortContainer) {
                    oViewPortContainer.shiftCenterTransition(false);
                }
            }

            // in a direct navigation scenario the ActionMode might not exist yet.
            // In this case we would like to skip this check.
            if (sap.ushell.components.flp.ActionMode && sap.ushell.components.flp.ActionMode.oModel &&
                    sap.ushell.components.flp.ActionMode.oModel.getProperty("/tileActionModeActive")) {

                sap.ushell.components.flp.ActionMode.toggleActionMode(oModel, "Menu Item");
            }
        },
        _addBottomSpace: function () {
            sap.ushell.utils.addBottomSpace();
        },

        _scrollToFirstVisibleGroup: function (sChannelId, sEventId, oData) {
            var sGroupId,
                oViewGroups = this.oView.oDashboardGroupsBox.getGroups(),
                fromTop = oData.fromTop > 0 ? oData.fromTop : 0;

            if (oData.group) {
                sGroupId = oData.group.getGroupId();
            } else {
                // in case of scroll after deletion, the oData contains only the groupId.
                sGroupId = oData.groupId;
            }

            if (oViewGroups) {
                jQuery.each(oViewGroups, function (nIndex, oGroup) {
                    if (oGroup.getGroupId() === sGroupId) {
                        var iY = document.getElementById(oGroup.sId).offsetTop;
                        jQuery('.sapUshellDashboardView section').stop().animate({scrollTop: iY + fromTop}, 0);

                        //on press event we need to set the group in focus
                        if (oData.group && oData.focus) {
                            jQuery.sap.byId(oGroup.sId).focus();
                        }

                        return false;
                    }
                });
                sap.ushell.utils.addBottomSpace();
            }
        },

        /**
         * Scrolling the dashboard in order to show a desired group
         */
        _scrollToGroup: function (sChannelId, sEventId, oData) {
            var sGroupId,
                that = this,
                oViewGroups = this.oView.oDashboardGroupsBox.getGroups();

            if (oData.group) {
                sGroupId = oData.group.getGroupId();
            } else {
                // in case of scroll after deletion, the oData contains only the groupId.
                sGroupId = oData.groupId;
            }

            // The model flag /scrollingToGroup indicates a scroll-to-group action currently occurs,
            if (oViewGroups) {
                jQuery.each(this.oView.oDashboardGroupsBox.getGroups(), function (nIndex, oGroup) {
                    if (oGroup.getGroupId() === sGroupId) {
                        var iY;
                        setTimeout(function () {

                            iY = -1 * (document.getElementById('dashboardGroups').getBoundingClientRect().top) + document.getElementById(oGroup.sId).getBoundingClientRect().top;
                            iY += 49; // don't display group header after scroll. Group header will be visible in the anchor bar
                            jQuery('.sapUshellDashboardView section').stop().animate({scrollTop: iY}, 500);
                            if (oData.isInEditTitle) {
                                oGroup.setEditMode(true);
                            }
                        }, 300);

                        //fix bottom space, if this a deletion scenario the 'oData.groupId' will return true
                        if (oData.groupId || oData.groupChanged) {
                            that._addBottomSpace();
                        }
                        // Recalculate tiles visibility
                        sap.ushell.utils.handleTilesVisibility();
                        return false;
                    }
                });
            }
        },

        /**
         * Handler for dropping a tile object at the end of drag and drop action.
         *
         * @param event
         * @param ui : tile DOM Reference
         * @private
         */
        _handleDrop: function (event, ui) {
           
            var tileMoveInfo = sap.ushell.Layout.getLayoutEngine().layoutEndCallback(),
                oEventBus = sap.ui.getCore().getEventBus(),
                noRefreshSrc,
                noRefreshDst;

            if (!tileMoveInfo.tileMovedFlag) {
                return; //tile was not moved
            }
            noRefreshSrc = true;
            noRefreshDst = true; //Default - suppress re-rendering after drop
            //if src and destination groups differ - refresh src and dest groups
            //else if a tile has moved & dropped in a different position in the same group - only dest should refresh (dest == src)
            //if a tile was picked and dropped - but never moved - the previous if would have returned
            if ((tileMoveInfo.srcGroup !== tileMoveInfo.dstGroup)) {
                noRefreshSrc = noRefreshDst = false;
            } else if (tileMoveInfo.tile !== tileMoveInfo.dstGroup.getTiles()[tileMoveInfo.dstTileIndex]) {
                noRefreshDst = false;
            }
            tileMoveInfo.srcGroup.removeAggregation('tiles', tileMoveInfo.tile, noRefreshSrc);
            tileMoveInfo.dstGroup.insertAggregation('tiles', tileMoveInfo.tile, tileMoveInfo.dstTileIndex, noRefreshDst);

            oEventBus.publish("launchpad", "moveTile", {
                sTileId: tileMoveInfo.tile.getUuid(),
                toGroupId: tileMoveInfo.dstGroup.getGroupId(),
                toIndex: tileMoveInfo.dstTileIndex
            });

            oEventBus.publish("launchpad", "sortableStop");
        },
        _handleAnchorItemPress: function (oEvent) {
            this._scrollToGroup("launchpad", "scrollToGroup", {
                group: oEvent.getParameter('group'),
                groupChanged: false,
                focus: (oEvent.getParameter("action") === "sapenter")
            });
        },
        _addGroupHandler: function (oData) {
            var index,
                path = oData.getSource().getBindingContext().getPath(),
                parsePath = path.split("/");

            index = window.parseInt(parsePath[parsePath.length - 1], 10);

            if (oData.getSource().sParentAggregationName === "afterContent") {
                index = index + 1;
            }

            sap.ui.getCore().getEventBus().publish("launchpad", "createGroupAt", {
                title: sap.ushell.resources.i18n.getText("new_group_name"),
                location: index,
                isRendered: true
            });
        },

        /**
         * Callback functions that is registered for notification update.
         * Queries notifications service for the updated notifications, and updates the model with the relevant/recent ones
         */
        _notificationsUpdateCallback: function () {
            var that = this,
                iRequiredNotificationsNumber = 5,
                iTempRequiredNotificationsNumber = 0,
                aRecentNotificationsArray = this.getView().getModel().getProperty("/previewNotificationItems"),
                aNewNotifications = [],
                aNewNotificationsIds = [],
                tRecentCreationTime,
                tRecentCreationTimeFormatted,
                tTempCreationTime,
                tTempCreationTimeFormatted,
                index,
                i,
                oNotificationItem,
                bNotificationItemsRemoved = false,
                iMissingPreviewNotificationCount = iRequiredNotificationsNumber - aRecentNotificationsArray.length - 1;

            sap.ushell.Container.getService("Notifications").getNotifications().done(function (aNotifications) {
                if (!aNotifications) {
                    return;
                }

                var oNotificationsPreview = sap.ui.getCore().byId("notifications-preview-container"),
                    viewPortContainer;

                if (!this.isNotificationPreviewLoaded) {
                    oNotificationsPreview.setEnableBounceAnimations(true);
                }
                // remove from the preview notifications panel notifications that the user dismissed in the notifications view
                if (aRecentNotificationsArray && aRecentNotificationsArray.length) {
                    for (index = 0; index < aRecentNotificationsArray.length; index++) {
                        var sOriginalNotificationItemId = aRecentNotificationsArray[index].originalItemId,
                            bNotificationExists = false;

                        for (i = 0; i < aNotifications.length; i++) {
                            if (aNotifications[i].Id === sOriginalNotificationItemId) {
                                bNotificationExists = true;
                                break;
                            }
                            if (aRecentNotificationsArray[index].originalTimestamp > aNotifications[i].CreatedAt) {
                                break;
                            }
                        }

                        if (!bNotificationExists) {
                            aRecentNotificationsArray.splice(index, 1);
                            bNotificationItemsRemoved = true;
                            index--;
                        }
                    }
                }
                // Getting the time stamp of the previous most recent notification in case of new notification
                if (aRecentNotificationsArray && aRecentNotificationsArray.length > 0) {
                    tRecentCreationTime = aRecentNotificationsArray[0].originalTimestamp;
                    tRecentCreationTimeFormatted = sap.ushell.Container.getService("Notifications")._formatAsDate(tRecentCreationTime);
                }

                // From the given notifications - get the first five (up to five, actually) that:
                // - Have CteatedAt time stamp higher (i.e. more recent) than the previous most recent one
                for (index = 0; (index < aNotifications.length) && (iTempRequiredNotificationsNumber < iRequiredNotificationsNumber); index++) {
                    tTempCreationTime = aNotifications[index].CreatedAt;
                    tTempCreationTimeFormatted = sap.ushell.Container.getService("Notifications")._formatAsDate(tTempCreationTime);
                        if ((tRecentCreationTimeFormatted ? tTempCreationTimeFormatted > tRecentCreationTimeFormatted : true)) {
                        aNewNotifications[iTempRequiredNotificationsNumber] = aNotifications[index];
                        iTempRequiredNotificationsNumber++;
                    }
                }

                // case of dismiss notification need to bring "old" notification
                var newNotificationsCount = aNewNotifications.length;
                if (aRecentNotificationsArray && aRecentNotificationsArray.length > 0 && aRecentNotificationsArray.length < iRequiredNotificationsNumber && aNotifications.length > aRecentNotificationsArray.length) {
                    tRecentCreationTime = aRecentNotificationsArray[aRecentNotificationsArray.length - 1].originalTimestamp;
                    tRecentCreationTimeFormatted = sap.ushell.Container.getService("Notifications")._formatAsDate(tRecentCreationTime);
                    iTempRequiredNotificationsNumber = 0;
                    for (index = 0; (index < aNotifications.length) && (iTempRequiredNotificationsNumber <= iMissingPreviewNotificationCount); index++) {
                        tTempCreationTime = aNotifications[index].CreatedAt;
                        tTempCreationTimeFormatted = sap.ushell.Container.getService("Notifications")._formatAsDate(tTempCreationTime);
                        if ( tTempCreationTimeFormatted < tRecentCreationTimeFormatted ) {
                            aNewNotifications[newNotificationsCount + iTempRequiredNotificationsNumber] = aNotifications[index];
                            iTempRequiredNotificationsNumber++;
                        }
                    }
                }
                // Check if there are any new notification objects, if not - return
                if (aNewNotifications.length === 0 && !bNotificationItemsRemoved) {
                    this._disableNotificationPreviewBouncingAnimation(oNotificationsPreview);
                    return;
                }

                // Create new notification items, and store only their Id
                for (i = 0; i < aNewNotifications.length; i++) {
                    oNotificationItem = new sap.m.NotificationListItem({
                        hideShowMoreButton: true,
                        description: aNewNotifications[i].SensitiveText,
                        title: aNewNotifications[i].Text,
                        datetime: sap.ushell.utils.formatDate(aNewNotifications[i].CreatedAt),
                        priority: sap.ui.core.Priority[aNewNotifications[i].Priority.charAt(0) + aNewNotifications[i].Priority.substr(1).toLowerCase()],
                        press: function (oEvent) {
                            var sNotificationPathInModel = this.getBindingContext().getPath(),
                                aPathParts = sNotificationPathInModel.split("/"),
                                sPathToNotification = "/" + aPathParts[1] + "/" + aPathParts[2],
                                oNotificationModelEntry = this.getModel().getProperty(sPathToNotification),
                                sSemanticObject = oNotificationModelEntry.NavigationTargetObject,
                                sAction = oNotificationModelEntry.NavigationTargetAction,
                                aParameters = oNotificationModelEntry.NavigationTargetParams,
                                sNotificationId = oNotificationModelEntry.originalItemId,
                                oNotificationsService = sap.ushell.Container.getService("Notifications");
                            sap.ushell.utils.toExternalWithParameters(sSemanticObject, sAction, aParameters);
                            var oPromise = oNotificationsService.markRead(sNotificationId);
                            oPromise.fail(function () {
                                sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedMarkRead'));
                            });
                        },
                        close: function (oEvent) {
                            var sNotificationPathInModel = this.getBindingContext().getPath(),
                                aPathParts = sNotificationPathInModel.split("/"),
                                sPathToNotification = "/" + aPathParts[1] + "/" + aPathParts[2],
                                oNotificationModelEntry = this.getModel().getProperty(sPathToNotification),
                                sNotificationId = oNotificationModelEntry.originalItemId,
                                aRecentNotificationsArray = that.getView().getModel().getProperty("/previewNotificationItems"),
                                oNotificationsService = sap.ushell.Container.getService("Notifications"),
                                oPromise = oNotificationsService.dismissNotification(sNotificationId);

                            oPromise.done(function () {
                                //remove item from the notifications preview model
                                var i;

                                for (i = 0; i < aRecentNotificationsArray.length; i++) {
                                    if (aRecentNotificationsArray[i].originalItemId === sNotificationId) {
                                        break;
                                    }
                                }
                                aRecentNotificationsArray.splice(i, 1);
                                that.getView().getModel().setProperty("/previewNotificationItems", aRecentNotificationsArray);
                            });

                            oPromise.fail(function () {
                                sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedDismiss'));
                                that.getView().getModel().setProperty("/previewNotificationItems", aRecentNotificationsArray);
                            });
                        }

                    });

                    //TODO temporary Cozy/Compact implementation for SAPPHIRE
                    if (sap.ui.Device.system.desktop) {
                        oNotificationItem.removeStyleClass('sapUiSizeCozy');
                        oNotificationItem.addStyleClass('sapUiSizeCompact');
                    }//no need for "else", Cozy is the default mode

                    aNewNotificationsIds.push({
                        previewItemId: oNotificationItem.getId(),
                        originalItemId: aNewNotifications[i].Id,
                        originalTimestamp: aNewNotifications[i].CreatedAt,
                        NavigationTargetObject: aNewNotifications[i].NavigationTargetObject,
                        NavigationTargetAction: aNewNotifications[i].NavigationTargetAction,
                        NavigationTargetParams: aNewNotifications[i].NavigationTargetParams
                    });

                    //don't show preview notification when notification view is active

                    viewPortContainer = sap.ui.getCore().byId('viewPortContainer');

                    if (viewPortContainer.getCurrentState() === "RightCenter") {
                        oNotificationItem.addStyleClass("sapUshellRightFloatingContainerItemBounceOut");
                    }
                }

                // Check if there were any notifications in the model's previewNotificationItems property,
                // if not - simply assign the new ones
                if (aRecentNotificationsArray.length === 0) {
                    that.getView().getModel().setProperty("/previewNotificationItems", aNewNotificationsIds);
                    this._disableNotificationPreviewBouncingAnimation(oNotificationsPreview);
                    return;
                }

                // For each new notification - remove an old one from the model (if there are already 5) and add the new one
                // The For loop counts backwards since the aNewNotifications has the most recent object in index 0
                //  and we would like to be the last that is put in previewNotificationItems
                for (index = aNewNotificationsIds.length - 1; index > -1; index--) {
                    if (aRecentNotificationsArray.length === iRequiredNotificationsNumber) {
                        setTimeout(function () {
                            aRecentNotificationsArray.pop();
                            that.getView().getModel().setProperty("/previewNotificationItems", aRecentNotificationsArray);
                        }, 1000);
                    }
                    if (aNewNotificationsIds[index].originalTimestamp > aRecentNotificationsArray[0].originalTimestamp) {
                        aRecentNotificationsArray.unshift(aNewNotificationsIds[index]);
                    } else {
                        aRecentNotificationsArray.push(aNewNotificationsIds[index]);
                    }
                }
                that.getView().getModel().setProperty("/previewNotificationItems", aRecentNotificationsArray);
                this._disableNotificationPreviewBouncingAnimation(oNotificationsPreview);

            }.bind(this)).fail(function () {
            });
        },

        _disableNotificationPreviewBouncingAnimation: function (oNotificationsPreview) {
            if (!this.isNotificationPreviewLoaded) {
                this.isNotificationPreviewLoaded = true;
                oNotificationsPreview.setEnableBounceAnimations(false);
            }
        },

        _publishAsync: function (sChannelId, sEventId, oData) {
            var oBus = sap.ui.getCore().getEventBus();
            window.setTimeout(jQuery.proxy(oBus.publish, oBus, sChannelId, sEventId, oData), 1);
        },
        _changeGroupVisibility: function (oGroupBindingCtx) {
            var sBindingCtxPath = oGroupBindingCtx.getPath(),
                oModel = oGroupBindingCtx.getModel(),
                bGroupVisibilityState = oModel.getProperty(sBindingCtxPath + '/isGroupVisible');
            oModel.setProperty(sBindingCtxPath + '/isGroupVisible', !bGroupVisibilityState);
        },

        //Persist the group visibility changes (hidden groups) in the back-end upon deactivation of the Actions Mode.
        _handleGroupVisibilityChanges: function (sChannelId, sEventId, aOrigHiddenGroupsIds) {
            var oLaunchPageSrv = sap.ushell.Container.getService('LaunchPage'),
                oModel = this.getView().getModel(),
                aCurrentHiddenGroupsIds = sap.ushell.utils.getCurrentHiddenGroupIds(oModel),
                bSameLength = aCurrentHiddenGroupsIds.length === aOrigHiddenGroupsIds.length,
                bIntersect = bSameLength,
                oPromise;

            //Checks whether there's a symmetric difference between the current set of hidden groups and the genuine one
            aCurrentHiddenGroupsIds.some(function (sHiddenGroupId, iIndex) {
                if (!bIntersect) {
                    return true;
                }
                bIntersect = jQuery.inArray(sHiddenGroupId, aOrigHiddenGroupsIds) !== -1;

                return !bIntersect;
            });

            if (!bIntersect) {
                oPromise = oLaunchPageSrv.hideGroups(aCurrentHiddenGroupsIds);
                oPromise.done(function () {
                    oModel.updateBindings('groups');
                    this._handleToastMessage(aCurrentHiddenGroupsIds.length);
                }.bind(this));
                oPromise.fail(function () {
                    var msgService = sap.ushell.Container.getService('Message');

                    msgService.error(sap.ushell.resources.i18n.getText('hideGroups_error'));
                });
            }
        },

        _handleToastMessage: function (numOfHiddenGroups) {
            var sMsg = '';
            if (typeof numOfHiddenGroups === undefined) {
                return;
            }
            if (numOfHiddenGroups === 0) {  //All groups are visible on your home page
                sMsg = sap.ushell.resources.i18n.getText('hideGroups_none');
            } else if (numOfHiddenGroups === 1) {//1 group is hidden on your home page
                sMsg = sap.ushell.resources.i18n.getText('hideGroups_single');
            } else {//{0} groups are hidden on your home page
                sMsg = sap.ushell.resources.i18n.getText('hideGroups_multiple', numOfHiddenGroups);
            }
            sap.ushell.Container.getService('Message').show(sap.ushell.services.Message.Type.INFO, sMsg);
        }
    });
}());