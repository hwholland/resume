(function () {
    "use strict";
    /* global test module ok */
    jQuery.sap.require("sap.ushell.ui.footerbar.ContactSupportButton");
    jQuery.sap.require("sap.ushell.UserActivityLog");
    jQuery.sap.require("sap.ushell.ui.launchpad.ViewPortContainer");
    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.adapters.local.SupportTicketAdapterTest",
        {
            setup : function () {
                sap.ushell.bootstrap("local");

                var oModel = new sap.ui.model.json.JSONModel({
                    currentState: {}
                });
                oModel.setProperty("/currentState/stateName", "home");
                this.oViewPortContainer = new sap.ushell.ui.launchpad.ViewPortContainer({id: "viewPortContainer"});
                this.oViewPortContainer.setModel(oModel);
                sap.ushell.UserActivityLog.activate();
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                delete sap.ushell.Container;
                this.oViewPortContainer.destroy();
            }
        }
        );

    test("Check user input text received", function () {
        var supportDialog,
            oTextArea,
            oSendButton;

        // avoid creating the real local SupportTicketAdapter
        jQuery.sap.declare("sap.ushell.adapters.local.SupportTicketAdapter");
        sap.ushell.adapters.local.SupportTicketAdapter = function () {
            this.createTicket = function (oSupportObject) {
                ok(oSupportObject.text, 'new test');

                var oDeferred = new jQuery.Deferred(),
                    sTicketId = "1234567";

                oDeferred.resolve(sTicketId);
                return oDeferred.promise();
            };
        };

        supportDialog = new sap.ushell.ui.footerbar.ContactSupportButton();
        supportDialog.showContactSupportDialog();
        oTextArea = sap.ui.getCore().byId("textArea");
        oSendButton = sap.ui.getCore().byId("contactSupportSendBtn");

        oTextArea.setValue("new test");
        oSendButton.firePress();
        supportDialog.oDialog.destroy();
    });

    test("Check client context data - error collection", function () {
        var supportDialog,
            oSendButton;

        // avoid creating the real local SupportTicketAdapter
        jQuery.sap.declare("sap.ushell.adapters.local.SupportTicketAdapter");
        sap.ushell.adapters.local.SupportTicketAdapter = function () {
            this.createTicket = function (oSupportObject) {
                var sClientContext = oSupportObject.clientContext,
                    logs = sClientContext.userLog,
                    foundOne = 0,
                    foundTwo = 0,
                    logIndex,
                    log,
                    oDeferred = new jQuery.Deferred(),
                    sTicketId;

                for (logIndex in logs) {
                    if (logs.hasOwnProperty(logIndex)) {
                        log = logs[logIndex];
                        if (log.type === 'ERROR') {
                            if (log.messageText.indexOf("test error one") !== -1) {
                                foundOne = 1;
                            } else if (log.messageText.indexOf("test error two") !== -1) {
                                foundTwo = 1;
                            }
                        }
                    }
                }
                ok(foundOne && foundTwo, "not found");
                sTicketId = "1234567";
                oDeferred.resolve(sTicketId);
                return oDeferred.promise();
            };
        };

        //Invoke two errors
        jQuery.sap.log.error("test error one");
        jQuery.sap.log.error("test error two");

        supportDialog = new sap.ushell.ui.footerbar.ContactSupportButton();
        supportDialog.showContactSupportDialog();
        oSendButton = sap.ui.getCore().byId("contactSupportSendBtn");
        oSendButton.firePress();
        supportDialog.oDialog.destroy();
    });
}());
