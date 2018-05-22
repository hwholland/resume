// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
        "use strict";
        /*global jQuery, sap, console, window, hasher*/
        /*jslint plusplus: true, nomen: true*/
        jQuery.sap.require("sap.ushell.utils");

        sap.ui.controller("sap.ushell.renderers.fiori2.notifications.Notifications", {

            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel());
                this.oNotificationsService = sap.ushell.Container.getService("Notifications");
                this.notificationsUpdateCallback();
            },
            onBeforeRendering: function () {
                this.oNotificationsService.registerNotificationsUpdateCallback(this.notificationsUpdateCallback.bind(this));
            },

            /**
             * Called by notification service for handling notifications update
             *
             * - Registered as callback using a call to this.oNotificationsService.registerNotificationsUpdateCallback
             * - Called by Notifications service when updated notifications data is obtained
             * - Gets the updated notifications array and sets the model accordingly
             */
            notificationsUpdateCallback: function () {
                var that = this,
                    oTabBarSelectedSort,
                    bSortByDateAscending = false,
                    i;

                this.oNotificationsService.getNotifications().done(function (aNotifications) {
                    if (!aNotifications) {
                        return;
                    }
                    for (i = 0; i < aNotifications.length; i++) {
                        if (aNotifications[i].Priority === undefined || aNotifications[i].Priority === "") {
                            aNotifications[i].Priority = "MEDIUM";
                        }
                    }
                    oTabBarSelectedSort = that.getView().oPressedToolbarButton.getId();
                    if (oTabBarSelectedSort === "CreatedAt") {
                        bSortByDateAscending = that.getView().bSortByDateAscending;
                        if (bSortByDateAscending) {
                            aNotifications = that.ascendingSortBy(aNotifications, "CreatedAt");
                        } else {
                            aNotifications = that.descendingSortBy(aNotifications, "CreatedAt");
                        }
                    } else if (oTabBarSelectedSort === "NotificationTypeId") {
                        that.getNotificationsByTypeWithGroupHeaders();
                    } else {
                        aNotifications = that.descendingSortBy(aNotifications, oTabBarSelectedSort);
                    }
                    // Updating the model with the updated array of notification objects
                    that.getView().getModel().setProperty('/aNotifications', aNotifications);
                }).fail(function (data) {
                    jQuery.sap.log.error("Notifications control - call to notificationsService.getNotifications failed: ",
                        data,
                        "sap.ushell.renderers.fiori2.notifications.Notifications");
                });
            },

            executeAction: function (sNotificationId, sActionName) {
                var oPromise = this.oNotificationsService.executeAction(sNotificationId, sActionName),
                    that = this,
                    oRemovedNotification;
                oPromise.fail(function () {
                    sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedExecuteAction'));
                    if (oRemovedNotification) {
                        that.addNotificationToModel(oRemovedNotification.obj, oRemovedNotification.index);
                    }
                });
                oRemovedNotification = this.removeNotificationFromModel(sNotificationId);
            },
            executeBulkAction: function (aNotificationIds, sActionName, oGroup) {
                var oRemovedGroup = this.removeGroupFromModel(oGroup),
                    oPromise = this.oNotificationsService.executeBulkAction(aNotificationIds, sActionName),
                    aRemovedNotifications = oRemovedGroup.oGroup.notifications;

                oPromise.fail(function (oResult) {
                    sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedExecuteBulkAction'));
                    if (oResult.failedNotifications && oResult.failedNotifications.length > 0) {
                        var aNotificationsToReAdd = aRemovedNotifications.filter(function (oNotification, index, aArray) {
                            return oResult.failedNotifications.indexOf(oNotification.Id) > -1;
                        });

                        oRemovedGroup.oGroup.notifications = aNotificationsToReAdd;
                        this.reAddFailedGroup(oRemovedGroup);
                    }
                }.bind(this));
            },
            dismissBulkNotifications: function (aNotificationIds, oGroup) {
                var oRemovedGroup = this.removeGroupFromModel(oGroup),
                    oPromise = this.oNotificationsService.dismissBulkNotifications(aNotificationIds),
                    aRemovedNotifications = oRemovedGroup.oGroup.notifications;

                oPromise.fail(function (oResult) {
                    sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedExecuteBulkAction'));
                    if (oResult.failedNotifications && oResult.failedNotifications.length > 0) {
                        var aNotificationsToReAdd = aRemovedNotifications.filter(function (oNotification, index, aArray) {
                            return oResult.failedNotifications.indexOf(oNotification.Id) > -1;
                        });

                        oRemovedGroup.oGroup.notifications = aNotificationsToReAdd;
                        this.reAddFailedGroup(oRemovedGroup);
                    }
                }.bind(this));
            },
            reAddFailedGroup: function (oGroupToAdd) {
                var oModel = this.getView().getModel(),
                    aGroups = oModel.getProperty('/aNotificationsByType');

                aGroups.splice(oGroupToAdd.removedGroupIndex, 0, oGroupToAdd.oGroup);
                oModel.setProperty('/aNotificationsByType', aGroups);
            },
            removeGroupFromModel: function (oGroupToDelete) {
                var oModel = this.getView().getModel(),
                    aGroups = oModel.getProperty('/aNotificationsByType'),
                    oRemovedGroup = {
                        oGroup: oGroupToDelete,
                        removedGroupIndex: undefined
                    };

                aGroups.some(function (oGroup, iIndex) {
                    if (oGroup.Id === oGroupToDelete.Id) {
                        oRemovedGroup.removedGroupIndex = iIndex
                        aGroups.splice(iIndex, 1);
                        oModel.setProperty('/aNotificationsByType', aGroups);

                        return true;
                    }

                    return false;
                });

                return oRemovedGroup;

            },
            getNotificationsByTypeWithGroupHeaders: function () {
                var oPromise = this.oNotificationsService.getNotificationsByTypeWithGroupHeaders(),
                    that = this;
                oPromise.fail(function () {
                    sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedLoadingByType'));
                });
                oPromise.done(function (notificationsByType) {
                    var oJson = JSON.parse(notificationsByType),
                        arr = oJson.value,
                        result = [],
                        lastIndex = -1;
                    arr.forEach(function (item, index) {
                        if (item.IsGroupHeader) {
                            result.push(item);
                            lastIndex = lastIndex + 1;
                        } else {
                            if (result[lastIndex]) {
                                if (!result[lastIndex]['notifications']) {
                                    result[lastIndex]['notifications'] = [];
                                }
                                result[lastIndex]['notifications'].push(item);
                            }
                        }
                    });
                    that.getView().getModel().setProperty('/aNotificationsByType', result);
                });
            },
            onListItemPress: function (sNotificationId, sSemanticObject, sAction, aParameters) {
                var viewPortContainer = sap.ui.getCore().byId('viewPortContainer');

                if (hasher.getHash() === sSemanticObject + "-" + sAction) {
                    viewPortContainer.switchState("Center");
                } else {
                    sap.ushell.utils.toExternalWithParameters(sSemanticObject, sAction, aParameters);
                }
                this.markRead(sNotificationId);
            },
            addNotificationToModel: function (oNotification, index) {
                var oModel = this.getView().getModel(),
                    notifications = oModel.getProperty("/aNotifications"),
                    oTabBarSelectedSort = this.getView().oPressedToolbarButton.getId();
                notifications.splice(index, 0, oNotification);
                oModel.setProperty("/aNotifications", notifications);
                if (oTabBarSelectedSort === "NotificationTypeId") {
                    this.getNotificationsByTypeWithGroupHeaders();
                }
            },
            removeNotificationFromModel: function (notificationId) {
                var oModel = this.getView().getModel(),
                    oTabBarSelectedSort = this.getView().oPressedToolbarButton.getId();
                if (oTabBarSelectedSort === "CreatedAt" || oTabBarSelectedSort === "Priority") {
                    var oRemovedNotification = {},
                        notifications = oModel.getProperty("/aNotifications");

                    notifications.some(function (notification, index, array) {
                        if (notification.Id && notification.Id === notificationId) {
                            oRemovedNotification.obj = array.splice(index, 1)[0];
                            oRemovedNotification.index = index;
                            return true;
                        }
                    });
                    oModel.setProperty("/aNotifications", notifications);
                    return oRemovedNotification;
                } else {
                    var oRemovedNotification = {},
                        aGroups = oModel.getProperty("/aNotificationsByType");
                    for (var i = 0; i < aGroups.length; i++) {
                        var notifications = aGroups[i].notifications;
                        if (notifications.length == 1 && notifications[0].Id === notificationId) {
                            aGroups.splice(i, 1);
                        } else {
                            notifications.some(function (notification, index, array) {
                                if (notification.Id && notification.Id === notificationId) {
                                    oRemovedNotification.obj = array.splice(index, 1)[0];
                                    oRemovedNotification.index = index;
                                    return true;
                                }
                            });
                            aGroups[i].notifications = notifications;
                        }
                    }
                    oModel.setProperty("/aNotificationsByType", aGroups);
                    return oRemovedNotification;

                }
            },
            dismissNotification: function (notificationId) {
                //the NotificationListItem destroys itself when pressing on the "close" button.
                //so it disappears in the UI.
                //if the service call is successful, we will get the updated model from the service
                //via the standard update.
                //if the operation fails, the model won't be changed, so we just need to call
                //"updateItems" on the list, since the model contains the dismissed notification.
                var oPromise = this.oNotificationsService.dismissNotification(notificationId);
                oPromise.fail(function () {
                    sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedDismiss'));
                    var oList = sap.ui.getCore().byId('notificationsList');
                    if (oList) {
                        oList.updateItems();
                    }
                });
            },
            setMarkReadOnModel: function (notificationId, bIsRead) {
                var oModel = this.getView().getModel(),
                    notifications = oModel.getProperty("/aNotifications");
                notifications.some(function (notification, index, array) {
                    if (notification.Id && notification.Id === notificationId) {
                        notification.IsRead = bIsRead;
                        return true;
                    }
                });
                oModel.setProperty("/aNotifications", notifications);
            },
            markRead: function (sNotificationId) {
                var oPromise = this.oNotificationsService.markRead(sNotificationId),
                    that = this;
                oPromise.fail(function () {
                    sap.ushell.Container.getService('Message').error(sap.ushell.resources.i18n.getText('notificationsFailedMarkRead'));
                    that.setMarkReadOnModel(sNotificationId, false);
                });
                this.setMarkReadOnModel(sNotificationId, true);
            },

            ascendingSortBy: function (aNotifications, sPropertyToSortBy) {
                aNotifications.sort(function (x, y) {
                    var val1 = x[sPropertyToSortBy],
                        val2 = y[sPropertyToSortBy];

                    if (val1 === val2) {
                        val1 = x.id;
                        val2 = y.id;
                    }
                    return val2 > val1 ? -1 : 1;
                });
                return aNotifications;
            },
            descendingSortBy: function (aNotifications, sPropertyToSortBy) {
                aNotifications.sort(function (x, y) {
                    var val1 = x[sPropertyToSortBy],
                        val2 = y[sPropertyToSortBy];

                    // If the values of the two objects (the values of the sorting criterion) are equal,
                    // then in case on "Priority" take the created date as second sort field.
                    // In case of "CreatedAt" take the  objects' IDs as second sort field.
                    if (val1 === val2) {
                        if (sPropertyToSortBy === "Priority") {
                            val1 = x["CreatedAt"];
                            val2 = y["CreatedAt"];
                        } else {
                            val1 = x.id;
                            val2 = y.id;
                        }
                        return val1 > val2 ? -1 : 1;
                    }
                    // If the sorting criterion is "priority" then we can not just compare the strings, because then the priority order is: "High", "Low", Medium".
                    // instead, we find if one of the two objects has high priority.
                    // if not, then we check if the 1st object has medium priority.
                    // If not - then the 2nd object "wins"
                    if (sPropertyToSortBy === "Priority") {
                        if (val1 === "HIGH") {
                            return -1;
                        }
                        if (val2 === "HIGH") {
                            return 1;
                        }
                        if (val1 === "MEDIUM") {
                            return -1;
                        }
                        return 1;
                    }
                    return val1 > val2 ? -1 : 1;
                });
                return aNotifications;
            }
        })
        ;
    }
    ()
)
;
