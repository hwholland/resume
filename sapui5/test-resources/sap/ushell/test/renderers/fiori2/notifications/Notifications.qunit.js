// @copyright@
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.Shell
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon, window, hasher */
    jQuery.sap.require("sap.ushell.test.utils");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ui.thirdparty.hasher");

    module("sap.ushell.renderers.fiori2.notifications.Notifications", {
        setup: function () {
            window["sap-ushell-config"] = {
                "services": {
                    "Notifications": {
                        config: {
                            enabled: true,
                            serviceUrl: "/sap/opu/odata/SAP/ZNS_NOTIFICATIONS_SRV"
                        }
                    }
                },
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                                "enableNotificationsUI": true,
                                "applications": {
                                    "Shell-home": {}
                                },
                                "rootIntent": "Shell-home"
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local");
            this.oService = sap.ushell.Container.getService("Notifications");
            this.oMessageService = sap.ushell.Container.getService("Message");
            this.oErrorStub = sinon.stub(this.oMessageService, "error").returns(function () {
            });
            this.executeActionStub = sinon.stub(this.oService, "executeAction").returns({
                fail: function () {
                }
            });
            this.executeBulkActionStub = sinon.stub(this.oService, "executeBulkAction").returns({
                fail: function () {
                }
            });
            this.dismissBulkNotificationsStub = sinon.stub(this.oService, "dismissBulkNotifications").returns({
                fail: function () {
                }
            });
            this.markReadStub = sinon.stub(this.oService, "markRead").returns({
                fail: function () {
                }
            });
            this.dismissNotificationStub = sinon.stub(this.oService, "dismissNotification").returns({
                fail: function () {
                }
            });
            this.getNotificationStub = sinon.stub(this.oService, "getNotifications").returns(jQuery.Deferred().resolve(
                [
                    {
                        "Id": "00505692-409C-1EE5-ABDA-8F15E3E3B020",
                        "OriginId": "G1Y_800",
                        "CreatedAt": "2015-12-30T09:05:12Z",
                        "IsActionable": true,
                        "IsRead": false,
                        "IsGroupable": true,
                        "IsGroupHeader": false,
                        "NavigationTargetAction": "DisplayObject",
                        "NavigationTargetObject": "PurchaseOrder",
                        "NotificationTypeId": "00505692-5975-1EE5-A991-2706A9CB0001",
                        "ParentId": "00000000-0000-0000-0000-000000000000",
                        "Priority": "MEDIUM",
                        "SensitiveText": "Purchase order #1807 for $5,000 by Gavin Gradel requires your approval",
                        "Text": "A purchase order requires your approval",
                        "GroupHeaderText": "Purchase orders requiring your approval",
                        "NotificationCount": 0,
                        "Actor": {"Id": "BAR-LEV", "DisplayText": "BAR-LEV", "ImageSource": "BAR-LEV"},
                        "NavigationTargetParams": [
                            {
                                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B020",
                                "Key": "PurchaseOrderId",
                                "Value": "236400"
                            },
                            {
                                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B020",
                                "Key": "PurchaseOrderVendor",
                                "Value": "PARTNER_137"
                            }
                        ],
                        "Actions": [
                            {
                                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0000",
                                "ActionText": "Accept",
                                "GroupActionText": "Accept All",
                                "Nature": "POSITIVE"
                            },
                            {
                                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0001",
                                "ActionText": "Reject",
                                "GroupActionText": "Reject All",
                                "Nature": "NEGATIVE"
                            }
                        ]
                    },
                    {
                        "Id": "00505692-409C-1EE5-ABDA-8FA41F727020",
                        "OriginId": "G1Y_800",
                        "CreatedAt": "2015-12-20T09:05:20Z",
                        "IsActionable": true,
                        "IsRead": true,
                        "IsGroupable": true,
                        "IsGroupHeader": false,
                        "NavigationTargetAction": "display",
                        "NavigationTargetObject": "LeaveRequest",
                        "NotificationTypeId": "00505692-5975-1EE5-A991-2706A9CB0002",
                        "ParentId": "00000000-0000-0000-0000-000000000000",
                        "Priority": "LOW",
                        "SensitiveText": "Leave request #1808 by Gavin Gradel requires your attention",
                        "Text": "A leave request requires your attention",
                        "GroupHeaderText": "Leave requests requiring your attention",
                        "NotificationCount": 0,
                        "Actor": {"Id": "BAR-LEV", "DisplayText": "BAR-LEV", "ImageSource": "BAR-LEV"},
                        "NavigationTargetParams": [
                            {
                                "NotificationId": "00505692-409C-1EE5-ABDA-8FA41F727020",
                                "Key": "LeaveRequestId",
                                "Value": "AA-DD0055"
                            },
                            {
                                "NotificationId": "00505692-409C-1EE5-ABDA-8FA41F727020",
                                "Key": "LeaveRequestMode",
                                "Value": "EditAsManager"
                            }
                        ],
                        "Actions": [
                            {
                                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0011",
                                "ActionText": "Deny",
                                "GroupActionText": "Deny All",
                                "Nature": "NEGATIVE"
                            },
                            {
                                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0010",
                                "ActionText": "Approve",
                                "GroupActionText": "Approve All",
                                "Nature": "POSITIVE"
                            }
                        ]
                    },
                    {
                        "Id": "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                        "OriginId": "G1Y_800",
                        "CreatedAt": "2015-12-25T09:05:12Z",
                        "IsActionable": true,
                        "IsRead": false,
                        "IsGroupable": true,
                        "IsGroupHeader": false,
                        "NavigationTargetAction": "DisplayObject",
                        "NavigationTargetObject": "PurchaseOrder",
                        "NotificationTypeId": "00505692-5975-1EE5-A991-2706A9CB0001",
                        "ParentId": "00000000-0000-0000-0000-000000000000",
                        "Priority": "HIGH",
                        "SensitiveText": "Purchase order #1807 for $5,000 by Gavin Gradel requires your approval",
                        "Text": "A purchase order requires your approval",
                        "GroupHeaderText": "Purchase orders requiring your approval",
                        "NotificationCount": 0,
                        "Actor": {"Id": "BAR-LEV", "DisplayText": "BAR-LEV", "ImageSource": "BAR-LEV"},
                        "NavigationTargetParams": [
                            {
                                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                                "Key": "PurchaseOrderId",
                                "Value": "236400"
                            },
                            {
                                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                                "Key": "PurchaseOrderVendor",
                                "Value": "PARTNER_137"
                            }
                        ],
                        "Actions": [
                            {
                                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0000",
                                "ActionText": "Accept",
                                "GroupActionText": "Accept All",
                                "Nature": "POSITIVE"
                            },
                            {
                                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0001",
                                "ActionText": "Reject",
                                "GroupActionText": "Reject All",
                                "Nature": "NEGATIVE"
                            }
                        ]
                    }
                ]));


            this.getNotificationsByTypeWithGroupHeaders = sinon.stub(this.oService, "getNotificationsByTypeWithGroupHeaders").returns(jQuery.Deferred().resolve(
                '{"@odata.context":"$metadata#Notifications","value":[{"Id":"005056ab-6fd8-1ee5-b3ca-91c4c583b209","OriginId":"LOCAL","CreatedAt":"2016-03-17T13:38:33Z","IsActionable":true,"IsRead":false,"IsGroupable":true,"IsGroupHeader":true,"NavigationTargetAction":"","NavigationTargetObject":"","NotificationTypeId":"005056ab-6fd8-1ee5-b3ca-91c4c583b209","NotificationTypeKey":"LeaveRequest-key","ParentId":"00000000-0000-0000-0000-000000000000","Priority":"LOW","SensitiveText":"","Text":"","GroupHeaderText":"You have 2 leave requests requiring your attention","NotificationCount":2,"Actor":{"Id":"","DisplayText":"","ImageSource":""},"NavigationTargetParams":[],"Actions":[{"ActionId":"Deny-key","ActionText":"Deny","GroupActionText":"Deny All","Nature":"NEGATIVE"},{"ActionId":"Approve-key","ActionText":"Approve","GroupActionText":"Approve All","Nature":"POSITIVE"}]},{"Id":"005056ab-6fd8-1ee5-bb88-b15ceb897dd0","OriginId":"LOCAL","CreatedAt":"2016-03-17T13:38:33Z","IsActionable":true,"IsRead":false,"IsGroupable":true,"IsGroupHeader":false,"NavigationTargetAction":"toappnavsample","NavigationTargetObject":"Action","NotificationTypeId":"005056ab-6fd8-1ee5-b3ca-91c4c583b209","NotificationTypeKey":"LeaveRequest-key","ParentId":"005056ab-6fd8-1ee5-b3ca-91c4c583b209","Priority":"LOW","SensitiveText":"Leave request #1894 by Gavin Gradel requires your attention","Text":"A leave request requires your attention","GroupHeaderText":"","NotificationCount":0,"Actor":{"Id":"BAR-LEV","DisplayText":"BAR-LEV","ImageSource":"https://scn.sap.com/people/guest/avatar/BAR-LEV.png"},"NavigationTargetParams":[{"NotificationId":"005056ab-6fd8-1ee5-bb88-b15ceb897dd0","Key":"LeaveRequestId","Value":"724934632"},{"NotificationId":"005056ab-6fd8-1ee5-bb88-b15ceb897dd0","Key":"PosId","Value":"10"}],"Actions":[{"ActionId":"Deny-key","ActionText":"Deny","GroupActionText":"Deny All","Nature":"NEGATIVE"},{"ActionId":"Approve-key","ActionText":"Approve","GroupActionText":"Approve All","Nature":"POSITIVE"}]},{"Id":"005056ab-6fd8-1ee5-bb88-b1231d763dd0","OriginId":"LOCAL","CreatedAt":"2016-03-17T13:38:31Z","IsActionable":true,"IsRead":false,"IsGroupable":true,"IsGroupHeader":false,"NavigationTargetAction":"toappnavsample","NavigationTargetObject":"Action","NotificationTypeId":"005056ab-6fd8-1ee5-b3ca-91c4c583b209","NotificationTypeKey":"LeaveRequest-key","ParentId":"005056ab-6fd8-1ee5-b3ca-91c4c583b209","Priority":"LOW","SensitiveText":"Leave request #1239 by Gavin Gradel requires your attention","Text":"A leave request requires your attention","GroupHeaderText":"","NotificationCount":0,"Actor":{"Id":"BAR-LEV","DisplayText":"BAR-LEV","ImageSource":"https://scn.sap.com/people/guest/avatar/BAR-LEV.png"},"NavigationTargetParams":[{"NotificationId":"005056ab-6fd8-1ee5-bb88-b1231d763dd0","Key":"LeaveRequestId","Value":"724934632"},{"NotificationId":"005056ab-6fd8-1ee5-bb88-b1231d763dd0","Key":"PosId","Value":"10"}],"Actions":[{"ActionId":"Deny-key","ActionText":"Deny","GroupActionText":"Deny All","Nature":"NEGATIVE"},{"ActionId":"Approve-key","ActionText":"Approve","GroupActionText":"Approve All","Nature":"POSITIVE"}]},{"Id":"005056ab-6fd8-1ee5-b3ca-966123d21209","OriginId":"LOCAL","CreatedAt":"2016-03-17T12:50:48Z","IsActionable":true,"IsRead":false,"IsGroupable":true,"IsGroupHeader":true,"NavigationTargetAction":"","NavigationTargetObject":"","NotificationTypeId":"005056ab-6fd8-1ee5-b3ca-966123d21209","NotificationTypeKey":"PurchaseOrder-key","ParentId":"005056ab-6fd8-1ee5-b3ca-91c4c583b209","Priority":"HIGH","SensitiveText":"","Text":"","GroupHeaderText":"Purchase orders requiring your approval","NotificationCount":3,"Actor":{"Id":"","DisplayText":"","ImageSource":""},"NavigationTargetParams":[],"Actions":[{"ActionId":"Accept-key","ActionText":"Accept","GroupActionText":"Accept All","Nature":"POSITIVE"},{"ActionId":"Reject-key","ActionText":"Reject","GroupActionText":"Reject All","Nature":"NEGATIVE"}]},{"Id":"005056ab-6fd8-1ee5-bb87-dbdb958ddc01","OriginId":"LOCAL","CreatedAt":"2016-03-17T12:50:48Z","IsActionable":true,"IsRead":false,"IsGroupable":true,"IsGroupHeader":false,"NavigationTargetAction":"toappstatesample","NavigationTargetObject":"Action","NotificationTypeId":"005056ab-6fd8-1ee5-b3ca-966123d21209","NotificationTypeKey":"PurchaseOrder-key","ParentId":"005056ab-6fd8-1ee5-b3ca-966123d21209","Priority":"HIGH","SensitiveText":"Purchase order #4639 for $8,000 by Gavin Gradel requires your approval","Text":"A purchase order requires your approval","GroupHeaderText":"","NotificationCount":0,"Actor":{"Id":"BAR-LEV","DisplayText":"BAR-LEV","ImageSource":"https://scn.sap.com/people/guest/avatar/BAR-LEV.png"},"NavigationTargetParams":[{"NotificationId":"005056ab-6fd8-1ee5-bb87-dbdb958ddc01","Key":"PurchaseOrderId","Value":"236400"},{"NotificationId":"005056ab-6fd8-1ee5-bb87-dbdb958ddc01","Key":"PurchaseOrderVendor","Value":"PARTNER_137"}],"Actions":[{"ActionId":"Accept-key","ActionText":"Accept","GroupActionText":"Accept All","Nature":"POSITIVE"},{"ActionId":"Reject-key","ActionText":"Reject","GroupActionText":"Reject All","Nature":"NEGATIVE"}]},{"Id":"005056ab-6fd8-1ee5-bb87-c5e0ae017bd2","OriginId":"LOCAL","CreatedAt":"2016-03-17T12:45:53Z","IsActionable":true,"IsRead":false,"IsGroupable":true,"IsGroupHeader":false,"NavigationTargetAction":"toappstatesample","NavigationTargetObject":"Action","NotificationTypeId":"005056ab-6fd8-1ee5-b3ca-966123d21209","NotificationTypeKey":"PurchaseOrder-key","ParentId":"005056ab-6fd8-1ee5-b3ca-966123d21209","Priority":"HIGH","SensitiveText":"Purchase order #3687 for $3,000 by Gavin Gradel requires your approval","Text":"A purchase order requires your approval","GroupHeaderText":"","NotificationCount":0,"Actor":{"Id":"BAR-LEV","DisplayText":"BAR-LEV","ImageSource":"https://scn.sap.com/people/guest/avatar/BAR-LEV.png"},"NavigationTargetParams":[{"NotificationId":"005056ab-6fd8-1ee5-bb87-c5e0ae017bd2","Key":"PurchaseOrderId","Value":"236400"},{"NotificationId":"005056ab-6fd8-1ee5-bb87-c5e0ae017bd2","Key":"PurchaseOrderVendor","Value":"PARTNER_137"}],"Actions":[{"ActionId":"Accept-key","ActionText":"Accept","GroupActionText":"Accept All","Nature":"POSITIVE"},{"ActionId":"Reject-key","ActionText":"Reject","GroupActionText":"Reject All","Nature":"NEGATIVE"}]},{"Id":"005056ab-6fd8-1ee5-bb87-858d41447b52","OriginId":"LOCAL","CreatedAt":"2016-03-17T12:31:29Z","IsActionable":true,"IsRead":false,"IsGroupable":true,"IsGroupHeader":false,"NavigationTargetAction":"toappstatesample","NavigationTargetObject":"Action","NotificationTypeId":"005056ab-6fd8-1ee5-b3ca-966123d21209","NotificationTypeKey":"PurchaseOrder-key","ParentId":"005056ab-6fd8-1ee5-b3ca-966123d21209","Priority":"HIGH","SensitiveText":"Purchase order #1242 for $8,000 by Gavin Gradel requires your approval","Text":"A purchase order requires your approval","GroupHeaderText":"","NotificationCount":0,"Actor":{"Id":"BAR-LEV","DisplayText":"BAR-LEV","ImageSource":"https://scn.sap.com/people/guest/avatar/BAR-LEV.png"},"NavigationTargetParams":[{"NotificationId":"005056ab-6fd8-1ee5-bb87-858d41447b52","Key":"PurchaseOrderId","Value":"236400"},{"NotificationId":"005056ab-6fd8-1ee5-bb87-858d41447b52","Key":"PurchaseOrderVendor","Value":"PARTNER_137"}],"Actions":[{"ActionId":"Accept-key","ActionText":"Accept","GroupActionText":"Accept All","Nature":"POSITIVE"},{"ActionId":"Reject-key","ActionText":"Reject","GroupActionText":"Reject All","Nature":"NEGATIVE"}]}]}'
            ));


            this.oView = new sap.ui.view(
                {
                    type: sap.ui.core.mvc.ViewType.JS,
                    viewName: "sap.ushell.renderers.fiori2.notifications.Notifications"
                });

            this.oController = this.oView.getController();

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            this.getNotificationStub.restore();
            this.oErrorStub.restore();
            this.executeActionStub.restore();
            this.dismissBulkNotificationsStub.restore();
            this.dismissNotificationStub.restore();
            this.oController.destroy();
            this.oView.destroy();
            delete sap.ushell.Container;

        }
    });


    test("init notification view", function () {
        var notification = this.oController.getView().getModel().getProperty('/aNotifications');
        equal(notification.length, 3, "On init the callback should be called ");
    });
    test("verify executeAction", function () {
        this.oController.executeAction('00505692-409C-1EE5-ABDA-8FA41F727020', 'actionName');
        // ok(executeActionStub.calledOnce, "On init the callback should be called ");
        var notification = this.oController.getView().getModel().getProperty('/aNotifications');
        equal(notification.length, 2, "2 notification expected since on init was 3 notification and one removed ");

        //remove not existing notificationId
        this.oController.executeAction('not_existing_notification_id', 'actionName');
        notification = this.oController.getView().getModel().getProperty('/aNotifications');
        equal(notification.length, 2, "2 notification expected since no notification should be removed from previous step ");

        this.oController.executeAction('00505692-409C-1EE5-ABDA-8F15E3E3B020', 'actionName');
        notification = this.oController.getView().getModel().getProperty('/aNotifications');
        equal(notification.length, 1, "2 notification expected since on init was 3 notification and 2 removed ");
    });

    test("verify ascendingSortBy and descendingSortBy createdAt", function () {
        var notification = this.oController.getView().getModel().getProperty('/aNotifications');
        equal(notification[0].CreatedAt, "2015-12-30T09:05:12Z", "the 1st notification in the array is the new one 30-Dec-2015");
        equal(notification[1].CreatedAt, "2015-12-25T09:05:12Z", "the 2nd notification in the array is  25-Dec-2015");
        equal(notification[2].CreatedAt, "2015-12-20T09:05:20Z", "the 3rd notification in the array is  20-Dec-2015");
        this.oController.ascendingSortBy(notification, 'CreatedAt');
        equal(notification[0].CreatedAt, "2015-12-20T09:05:20Z", "the 1st notification in the array is the old one");
        equal(notification[1].CreatedAt, "2015-12-25T09:05:12Z", "the 2nd notification in the array is  25-Dec-2015");
        equal(notification[2].CreatedAt, "2015-12-30T09:05:12Z", "the last notification in the array is the new one 30-Dec-2015");
        this.oController.descendingSortBy(notification, 'CreatedAt');
        equal(notification[0].CreatedAt, "2015-12-30T09:05:12Z", "the 1st notification in the array is the new one 30-Dec-2015");
        equal(notification[1].CreatedAt, "2015-12-25T09:05:12Z", "the 2nd notification in the array is  25-Dec-2015");
        equal(notification[2].CreatedAt, "2015-12-20T09:05:20Z", "the 3rd notification in the array is  20-Dec-2015");
    });

    test("verify descendingSortBy Priority", function () {
        var notification = this.oController.getView().getModel().getProperty('/aNotifications');
        equal(notification[0].Priority, "MEDIUM", "the 1st notification in the array is in MEDIUM prio");
        equal(notification[1].Priority, "HIGH", "the 2nd notification in the array is  HIGH");
        equal(notification[2].Priority, "LOW", "the 3rd notification in the array is  LOW");
        this.oController.descendingSortBy(notification, 'Priority');
        equal(notification[0].Priority, "HIGH", "the 1st notification in the array should be HIGH");
        equal(notification[1].Priority, "MEDIUM", "the 2nd notification in the array should be MEDIUM");
        equal(notification[2].Priority, "LOW", "the last notification in the array Should be LOW");
    });

    test("verify descendingSortBy Type", function () {
        var notification = this.oController.getView().getModel().getProperty('/aNotifications');
        equal(notification[0].NotificationTypeId, "00505692-5975-1EE5-A991-2706A9CB0001", "the 1st notification in the array is type 00505692-5975-1EE5-A991-2706A9CB0001");
        equal(notification[1].NotificationTypeId, "00505692-5975-1EE5-A991-2706A9CB0001", "the 2nd notification in the array is  type 00505692-5975-1EE5-A991-2706A9CB0001 ");
        equal(notification[2].NotificationTypeId, "00505692-5975-1EE5-A991-2706A9CB0002", "the 3rd notification in the array is  type 00505692-5975-1EE5-A991-2706A9CB0002");
        this.oController.descendingSortBy(notification, 'NotificationTypeId');
        equal(notification[0].NotificationTypeId, "00505692-5975-1EE5-A991-2706A9CB0002", "the 1st notification in the array should have type 00505692-5975-1EE5-A991-2706A9CB0002");
        equal(notification[1].NotificationTypeId, "00505692-5975-1EE5-A991-2706A9CB0001", "the 2nd notification in the array should have type 00505692-5975-1EE5-A991-2706A9CB0001");
        equal(notification[2].NotificationTypeId, "00505692-5975-1EE5-A991-2706A9CB0001", "the last notification in the array should have type 00505692-5975-1EE5-A991-2706A9CB0001");
    });

    /**
     * Verify that launching a navigation action from a Notification object results in a correct call to CrossApplicationNavigation service
     * including the business parameters
     */
    test("Navigate on Notification launch", function () {
        var notifications = this.oController.getView().getModel().getProperty('/aNotifications'),
            oGetHashStub = sinon.stub(hasher, "getHash", function () {
                return "X-Y";
            }),
            oToExternalSpy = sinon.spy(),
            oGetServiceStub = sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {
                if (sServiceName === "CrossApplicationNavigation") {
                    return {
                        toExternal : oToExternalSpy
                    };
                }
            }),
            sFirstNotificationSemanticObject = notifications[0].NavigationTargetObject,
            sFirstNotificationAction = notifications[0].NavigationTargetAction,
            sFirstNotificationParam1Key = notifications[0].NavigationTargetParams[0].Key,
            sFirstNotificationParam1Value = notifications[0].NavigationTargetParams[0].Value,
            sFirstNotificationParam2Key = notifications[0].NavigationTargetParams[1].Key,
            sFirstNotificationParam2Value = notifications[0].NavigationTargetParams[1].Value;

        this.oController.onListItemPress(
            notifications[0].id,
            notifications[0].NavigationTargetObject,
            notifications[0].NavigationTargetAction,
            notifications[0].NavigationTargetParams
        );

        ok(oToExternalSpy.calledOnce === true, "The function toExternal of CrossApplicationNavigation service called once");

        // Verify that the parameters (SemanticObject, Action, businessParameters) of the first notification objects were passed to toExternal
        ok(oToExternalSpy.args[0][0].target.semanticObject === sFirstNotificationSemanticObject, "The function toExternal called with the correct semanticObject");
        ok(oToExternalSpy.args[0][0].target.action === sFirstNotificationAction, "The function toExternal called with the correct action");
        ok(oToExternalSpy.args[0][0].params[sFirstNotificationParam1Key] === sFirstNotificationParam1Value, "The function toExternal called with the correct 1st parameter");
        ok(oToExternalSpy.args[0][0].params[sFirstNotificationParam2Key] === sFirstNotificationParam2Value, "The function toExternal called with the correct correct 2nd parameter");

        oGetHashStub.restore();
        oGetServiceStub.restore();
    });

    test("verify markRead", function () {
        var notification = this.oController.getView().getModel().getProperty('/aNotifications');
        equal(notification[0].IsRead, false, "the 1st notification in the array is not read");
        equal(notification[1].IsRead, false, "the 2nd notification in the array is not read");
        equal(notification[2].IsRead, true, "the 3rd notification in the array is  read");
        this.oController.markRead(notification[0].Id); // mark as read the first one
        equal(this.markReadStub.callCount, 1, "service markRead should call once");
        equal(notification[0].IsRead, true, "the 1st notification in the array should be read");
        this.oController.markRead(notification[2].Id); // mark as read the third one
        equal(this.markReadStub.callCount, 2, "service markRead should call twice");
        equal(notification[2].IsRead, true, "the 3rd notification in the array should stay read");
    });

    test("error handling - markRead", function () {
        var sId = "00505692-409C-1EE5-ABDA-8F15E3E3B020",
            failCB,
            getNotificationFromModel = function (sId) {
                var notifications = this.oController.getView().getModel().getProperty('/aNotifications');
                return notifications.filter(function (item) {
                    return item.Id === sId;
                })[0];
            }.bind(this),
            failStub = function (cb) {
                failCB = cb;
            };
        this.markReadStub.returns({
            fail: failStub
        });
        this.oController.markRead(sId);
        ok(this.markReadStub.calledOnce, 'markRead service call was done');
        ok(getNotificationFromModel(sId).IsRead, 'notification marked as read in model');
        failCB();
        ok(!getNotificationFromModel(sId).IsRead, 'notification marked as unread in model after fail');

    });

    test("error handling - executeAction", function () {
        var sId = "00505692-409C-1EE5-ABDA-8F15E3E3B020",
            sActionId = "00505692-5975-1EE5-A991-2706A9CC0000",
            notifications = this.oController.getView().getModel().getProperty('/aNotifications'),
            notificationExists = notifications.some(function (item) {
                return item.Id === sId;
            }),
            failCB,
            failStub = function (cb) {
                failCB = cb;
            };
        this.executeActionStub.returns({
            fail: failStub
        });

        ok(notificationExists, 'notification exists before action');

        this.oController.executeAction(sId, sActionId);
        ok(this.executeActionStub.calledOnce, 'dismissNotification service call was done');

        notifications = this.oController.getView().getModel().getProperty('/aNotifications');
        notificationExists = notifications.some(function (item) {
            return item.Id === sId;
        });
        ok(!notificationExists, 'notification removed after action');

        // should be uncomment when bug 1670198949 is fixed.
        //failCB();
        //notifications = this.oController.getView().getModel().getProperty('/aNotifications');
        //notificationExists = notifications.some(function (item) {
            //return item.Id === sId;
        //});
        //ok(notificationExists, 'notification added after action failed');
    });

    test("error handling - dismissNotification", function () {
        var sId = "00505692-409C-1EE5-ABDA-8F15E3E3B020",
            failCB,
            failStub = function (cb) {
                failCB = cb;
            },
            updateItemsStub = sinon.stub();
        this.dismissNotificationStub.returns({
            fail: failStub
        });
        var coreStub = sinon.stub(sap.ui, "getCore").returns({
            byId: function () {
                return {
                    updateItems: updateItemsStub
                }
            }
        });
        this.oController.dismissNotification(sId);
        failCB();
        ok(this.dismissNotificationStub.calledOnce, 'dismissNotification service call was done');
        ok(updateItemsStub.calledOnce, 'list.updateItems was called after dismiss');
        coreStub.restore();
    });

    test("verify getNotificationsByTypeWithGroupHeaders", function () {
        this.oController.getNotificationsByTypeWithGroupHeaders();
        ok(this.getNotificationsByTypeWithGroupHeaders.calledOnce, 'getNotificationsByTypeWithGroupHeaders service call was done');
        var aGroups = this.oController.getView().getModel().getProperty("/aNotificationsByType");
        equal(aGroups.length, 2, '2 groups expected');
        equal(aGroups[1].notifications.length, 3, '3 notification in second group expected');
        equal(aGroups[0].notifications.length, 2, '2 notification in fisrt group expected');
    });

    test("verify executeBulkAction", function () {
        var aNotificationIds = [
                "005056ab-6fd8-1ed5-bb89-ea35b66f609d",
                "005056ab-6fd8-1ee5-bb88-b1231d763dd0"
            ],
            sActionName = "Approve-key",
            oGroupToDelete = {Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209"},
            aGroups;
        var dfd = jQuery.Deferred();
        this.executeBulkActionStub.returns(dfd.promise());
        this.oController.getNotificationsByTypeWithGroupHeaders();
        this.oController.executeBulkAction(aNotificationIds, sActionName, oGroupToDelete);
        dfd.resolve();
        ok(this.executeBulkActionStub.calledOnce, 'executeBulkAction service call was done');
        aGroups = this.oController.getView().getModel().getProperty("/aNotificationsByType");
        equal(aGroups.length, 1, '1 groups expected since 1 group deleted from Model');
        equal(aGroups[0].notifications.length, 3, 'now the 1st group should contain 3 notifications');
    });

    test("verify executeBulkAction reject", function () {
        var aNotificationIds = [
                "005056ab-6fd8-1ee5-bb88-b1231d763dd0",
                "005056ab-6fd8-1ee5-bb88-b15ceb897dd0"
            ],
            sActionName = "Approve-key",
            oGroupToDelete = {Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209", notifications: [{Id: "005056ab-6fd8-1ee5-bb88-b1231d763dd0"},{Id: "005056ab-6fd8-1ee5-bb88-b15ceb897dd0"}]},
            aGroups;
        var dfd = jQuery.Deferred();
        this.executeBulkActionStub.returns(dfd.promise());
        this.oController.getNotificationsByTypeWithGroupHeaders();
        this.oController.executeBulkAction(aNotificationIds, sActionName, oGroupToDelete);
        dfd.reject({
            "succededNotifications": [
                "005056ab-6fd8-1ed5-bb89-ea35b66f609d"
            ],
            "failedNotifications": [
                "005056ab-6fd8-1ee5-bb88-b1231d763dd0"
            ]
        });
        ok(this.executeBulkActionStub.calledOnce, 'executeBulkAction service call was done');
        aGroups = this.oController.getView().getModel().getProperty("/aNotificationsByType");
        equal(aGroups.length, 2, '2 groups expected since the group was not deleted from Model');
        equal(aGroups[0].notifications.length, 1, 'now the 1st group should contain 1 notifications');
        equal(aGroups[1].notifications.length, 3, 'now the 2st group should contain 3 notifications');
    });

    test("verify dismissBulkNotifications", function () {
        var aNotificationIds = [
                "005056ab-6fd8-1ed5-bb89-ea35b66f609d",
                "005056ab-6fd8-1ee5-bb88-b1231d763dd0"
            ],
            oGroupToDelete = {Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209"},
            aGroups;
        var dfd = jQuery.Deferred();
        this.dismissBulkNotificationsStub.returns(dfd.promise());
        this.oController.getNotificationsByTypeWithGroupHeaders();
        this.oController.dismissBulkNotifications(aNotificationIds, oGroupToDelete);
        dfd.resolve();
        ok(this.dismissBulkNotificationsStub.calledOnce, 'dismissBulkNotifications service call was done');
        aGroups = this.oController.getView().getModel().getProperty("/aNotificationsByType");
        equal(aGroups.length, 1, '1 groups expected since 1 group deleted from Model');
        equal(aGroups[0].notifications.length, 3, 'now the 1st group should contain 3 notifications');
    });

    test("verify dismissBulkNotifications reject", function () {
        var aNotificationIds = [
                "005056ab-6fd8-1ee5-bb88-b1231d763dd0",
                "005056ab-6fd8-1ee5-bb88-b15ceb897dd0"
            ],
            sActionName = "Approve-key",
            oGroupToDelete = {Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209", notifications: [{Id: "005056ab-6fd8-1ee5-bb88-b1231d763dd0"},{Id: "005056ab-6fd8-1ee5-bb88-b15ceb897dd0"}]},
            aGroups;
        var dfd = jQuery.Deferred();
        this.dismissBulkNotificationsStub.returns(dfd.promise());
        this.oController.getNotificationsByTypeWithGroupHeaders();
        this.oController.dismissBulkNotifications(aNotificationIds, oGroupToDelete);
        dfd.reject({
            "succededNotifications": [
                "005056ab-6fd8-1ed5-bb89-ea35b66f609d"
            ],
            "failedNotifications": [
                "005056ab-6fd8-1ee5-bb88-b1231d763dd0"
            ]
        });
        ok(this.dismissBulkNotificationsStub.calledOnce, 'dismissBulkNotifications service call was done');
        aGroups = this.oController.getView().getModel().getProperty("/aNotificationsByType");
        equal(aGroups.length, 2, '2 groups expected since the group was not deleted from Model');
        equal(aGroups[0].notifications.length, 1, 'now the 1st group should contain 1 notifications');
        equal(aGroups[1].notifications.length, 3, 'now the 2st group should contain 3 notifications');
    });

    test("verify executeAction on Type tab", function () {
        this.oController.getNotificationsByTypeWithGroupHeaders();
        this.oView.oPressedToolbarButton = sap.ui.getCore().byId('NotificationTypeId');
        this.oController.executeAction('005056ab-6fd8-1ee5-bb88-b15ceb897dd0', 'actionName');
        var notificationModel = this.oController.getView().getModel().getProperty('/aNotificationsByType');
        equal(notificationModel.length, 2, "2 notification groups expected ");
        equal(notificationModel[0].notifications.length, 1, "1 notification in the first group expected ");
        this.oController.executeAction('005056ab-6fd8-1ee5-bb88-b1231d763dd0', 'actionName');
        equal(notificationModel.length, 1, "1 notification groups expected since no more notification in the first group ");
    });


}());
