// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

/**
 * User notifications View.<br>
 * Located at the right pane of the ViewPortContainer.<br>
 * Includes the list of notifications that can be sorted according to different criteria.<br><br>
 *
 * The main UI controls in the view are:<br>
 *  sap.m.ScrollContainer {id: "notificationsScrollContainer"}<br>
 *  that includes sap.m.Panel {id: "notificationsSorter"} that contains the sorting header bar and the notifications list:<br>
 *    Panel header:  sap.m.Toolbar {id: "sortingToolbar"} that contains sap.m.Button objects, one for each sorting criterion.<br>
 *    Panel content: sap.m.List{id: "notificationsList"} that contains sap.m.NotificationListItem object for each notification object<br>
 */

(function () {
    "use strict";
    /*global jQuery, sap, document */
    /*jslint plusplus: true, nomen: true */

    jQuery.sap.require("sap.m.NotificationListItem");

    sap.ui.jsview("sap.ushell.renderers.fiori2.notifications.Notifications", {
        createContent: function (oController) {
            var oScrollContainer,
                that = this;

            // Define notification action button template
            this.oActionListItemTemplate = new sap.m.Button({
                text: "{ActionText}",
                type: {
                    parts: ["Nature"],
                    formatter: function (nature) {
                        return nature === "POSITIVE" ? "Accept" : "Reject";
                    }
                },
                press: function (oEvent) {
                    var sNotificationPathInModel = this.getBindingContext().getPath(),
                        oNotificationModelPart = this.getModel().getProperty(sNotificationPathInModel),
                        aPathParts = sNotificationPathInModel.split("/"),
                        oTabBarSelectedSort = that.oPressedToolbarButton.getId(),
                        sPathToNotification = oTabBarSelectedSort === 'NotificationTypeId' ? "/" + aPathParts[1] + "/" + aPathParts[2] + "/" + aPathParts[3] + "/" + aPathParts[4] : "/" + aPathParts[1] + "/" + aPathParts[2],
                        oNotificationModelEntry = this.getModel().getProperty(sPathToNotification),
                        sNotificationId = oNotificationModelEntry.Id;

                    oController.executeAction(sNotificationId, oNotificationModelPart.ActionId);
                }
            });
            this.oActionGroupItemTemplate = new sap.m.Button({
                text: "{GroupActionText}",
                type: {
                    parts: ["Nature"],
                    formatter: function (nature) {
                        return nature === "POSITIVE" ? "Accept" : "Reject";
                    }
                },
                press: function (oEvent) {
                    var sNotificationPathInModel = this.getBindingContext().getPath(),
                        oNotificationModelPart = this.getModel().getProperty(sNotificationPathInModel),
                        aPathParts = sNotificationPathInModel.split("/"),
                        sPathToNotification = "/" + aPathParts[1] + "/" + aPathParts[2],
                        oNotificationModelEntry = this.getModel().getProperty(sPathToNotification),
                        aNotificationIdsInGroup = [];

                    oNotificationModelEntry.notifications.forEach(function (item, index) {
                        aNotificationIdsInGroup.push(item.Id);
                    });

                    oController.executeBulkAction(aNotificationIdsInGroup, oNotificationModelPart.ActionId, oNotificationModelEntry);
                }
            });
            this.addStyleClass('sapUshellNotificationsView');
            this.bSortByDateAscending = false;
            // Define notification list item template
            this.oNotificationListItemTemplate = new sap.m.NotificationListItem({
                press: function (oEvent) {
                    var oBindingContext = this.getBindingContext(),
                        oModelPath = oBindingContext.sPath,
                        oModelPart = this.getModel().getProperty(oModelPath),
                        sSemanticObject = oModelPart.NavigationTargetObject,
                        sAction = oModelPart.NavigationTargetAction,
                        aParameters = oModelPart.NavigationTargetParams,
                        sNotificationId = oModelPart.Id;
                    oController.onListItemPress(sNotificationId, sSemanticObject, sAction, aParameters).bind(oController);
                },
                datetime: {
                    path: "CreatedAt",
                    formatter: sap.ushell.utils.formatDate.bind(oController)
                },
                description: "{SensitiveText}",
                title: "{Text}",
                buttons: {
                    path: "Actions",
                    templateShareable: true,
                    sorter: new sap.ui.model.Sorter('Nature', true),
                    template: this.oActionListItemTemplate
                },
                unread: {
                    parts: ["IsRead"],
                    formatter: function (isRead) {
                        return !isRead;
                    }
                },
                close: function (oEvent) {
                    var sNotificationPathInModel = this.getBindingContext().getPath(),
                        aPathParts = sNotificationPathInModel.split("/"),
                        sPathToNotification = "/" + aPathParts[1] + "/" + aPathParts[2],
                        oNotificationModelEntry = this.getModel().getProperty(sPathToNotification),
                        sNotificationId = oNotificationModelEntry.Id;
                    oController.dismissNotification(sNotificationId);
                },
                priority: {
                    parts: ["Priority"],
                    formatter: function (priority) {
                        if (priority) {
                            priority = priority.charAt(0) + priority.substr(1).toLowerCase();
                            return sap.ui.core.Priority[priority];
                        }
                    }
                }
            }).addStyleClass("sapUshellNotificationsListItem");

            this.oNotificationGroupTemplate = new sap.m.NotificationListGroup({
                title: "{GroupHeaderText}",
                description: "{GroupHeaderText}",
                collapsed: true,
                datetime: {
                    path: "CreatedAt",
                    formatter: sap.ushell.utils.formatDate.bind(oController)
                },
                buttons: {
                    path: "Actions",
                    templateShareable: true,
                    sorter: new sap.ui.model.Sorter('Nature', true),
                    template: this.oActionGroupItemTemplate
                },
                items: {
                    path: "notifications",
                    template: this.oNotificationListItemTemplate
                },
                close: function (oEvent) {
                    var sNotificationPathInModel = this.getBindingContext().getPath(),
                        aPathParts = sNotificationPathInModel.split("/"),
                        sPathToNotification = "/" + aPathParts[1] + "/" + aPathParts[2],
                        oNotificationModelEntry = this.getModel().getProperty(sPathToNotification),
                        aNotificationIdsInGroup = [];

                    oNotificationModelEntry.notifications.forEach(function (item, index) {
                        aNotificationIdsInGroup.push(item.Id);
                    });

                    oController.dismissBulkNotifications(aNotificationIdsInGroup,oNotificationModelEntry);
                },
                priority: {
                    parts: ["Priority"],
                    formatter: function (priority) {
                        if (priority) {
                            priority = priority.charAt(0) + priority.substr(1).toLowerCase();
                            return sap.ui.core.Priority[priority];
                        }
                    }
                }
            });
           this.oNotificationsList = new sap.m.List({
                mode: sap.m.ListMode.SingleSelect,
                noDataText: sap.ushell.resources.i18n.getText('noNotifications'),
                items: {
                    path: "/aNotifications",
                    template: this.oNotificationListItemTemplate,
                    templateShareable: true
                }
            }).addStyleClass("sapUshellNotificationsList")
            .addStyleClass('sapContrastPlus')
            .addStyleClass('sapContrast');

            oScrollContainer = new sap.m.ScrollContainer("notificationsScrollContainer", {
                content: this.oNotificationsList,
                vertical: true
            });

            var iConTab1 = new sap.m.Button("CreatedAt", {
                type: 'Transparent',
                iconFirst: false,
                text: sap.ushell.resources.i18n.getText('notificationsSortByDate'),
                tooltip: sap.ushell.resources.i18n.getText('notificationsSortByDateDescendingTooltip'),
                icon: "sap-icon://sort-descending",
                press: function () {
                    var sIcon,
                        aNotifications = this.getModel().getProperty("/aNotifications");
                    that.oNotificationsList.bindItems('/aNotifications', that.oNotificationListItemTemplate);
                    // If this button was already clicked, then an ascending/descending change should be made, including icon change
                    if (that.oPressedToolbarButton === this) {
                        that.bSortByDateAscending = !that.bSortByDateAscending;
                        sIcon = that.bSortByDateAscending ? "sap-icon://sort-ascending" : "sap-icon://sort-descending";
                        if (that.bSortByDateAscending) {
                            this.setTooltip(sap.ushell.resources.i18n.getText('notificationsSortByDateAscendingTooltip'));
                        } else {
                            this.setTooltip(sap.ushell.resources.i18n.getText('notificationsSortByDateDescendingTooltip'));
                        }
                        this.setIcon(sIcon);
                    } else {
                        // If another button was clicked, set this button as the "pressed" one, including style assignment
                        this.addStyleClass("bStyleActive");
                        that.oPressedToolbarButton.removeStyleClass("bStyleActive");
                        that.oPressedToolbarButton = this;
                    }
                    if (that.bSortByDateAscending) {
                        aNotifications = that.getController().ascendingSortBy(aNotifications, "CreatedAt");
                    } else {
                        aNotifications = that.getController().descendingSortBy(aNotifications, "CreatedAt");
                    }
                    this.getModel().setProperty("/aNotifications", aNotifications);
                }
            }),
                // Button for sorting by creation type
                iConTab2 = new sap.m.Button("NotificationTypeId", {
                    type: 'Transparent',
                    iconFirst: false,
                    text: sap.ushell.resources.i18n.getText('notificationsSortByType'),
                    tooltip: sap.ushell.resources.i18n.getText('notificationsSortByTypeTooltip'),
                    press: function () {
                        this.addStyleClass("bStyleActive");
                        if (that.oPressedToolbarButton !== undefined) {
                            that.oPressedToolbarButton.removeStyleClass("bStyleActive");
                        }
                        that.oPressedToolbarButton = this;
                        that.getController().getNotificationsByTypeWithGroupHeaders();
                        that.oNotificationsList.bindItems('/aNotificationsByType', that.oNotificationGroupTemplate);

                    }
                }),
                // Button for sorting by creation priority
                iConTab3 = new sap.m.Button("Priority", {
                    type: 'Transparent',
                    iconFirst: false,
                    text: sap.ushell.resources.i18n.getText('notificationsSortByPriority'),
                    tooltip: sap.ushell.resources.i18n.getText('notificationsSortByPriorityTooltip'),
                    press: function () {
                        that.oNotificationsList.bindItems('/aNotifications', that.oNotificationListItemTemplate);
                        this.addStyleClass("bStyleActive");
                        if (that.oPressedToolbarButton !== undefined) {
                            that.oPressedToolbarButton.removeStyleClass("bStyleActive");
                        }
                        that.oPressedToolbarButton = this;
                        var aNotifications = this.getModel().getProperty("/aNotifications");
                        aNotifications = that.getController().descendingSortBy(aNotifications, "Priority");
                        this.getModel().setProperty("/aNotifications", aNotifications);
                    }
                });


            this.oPressedToolbarButton = iConTab1;
            iConTab1.addStyleClass("bStyleActive");

            var notificationsPage = new sap.m.Page("notificationsSorter", {
                expanded: true,
                backgroundDesign: "Transparent",
                content: [oScrollContainer],
                headerContent: new sap.m.Toolbar("sortingToolbar", {content: [iConTab1, iConTab2, iConTab3]}).addStyleClass("sapUshellNotificationToolBar")
            }).addStyleClass("myPanel");

            return [notificationsPage];
        },
        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.notifications.Notifications";
        }
    });
}());
