// @copyright@

(function () {
    "use strict";
    /*global document, jQuery, parent, sap, window*/

    jQuery.sap.require("sap.m.MessageBox");

    function onMessage(oEvent) {
        jQuery.sap.log.debug("Received message from origin '" + oEvent.origin + "': " + oEvent.data, undefined, "sap.ushell.demo.PostMessageTestApp");
        var oMessageData;
        try {
            oMessageData = JSON.parse(oEvent.data);
        } catch (e) {
            // could be some message which is not meant for us, so we just log with debug level
            jQuery.sap.log.debug(
                "Message received from origin '" + oEvent.origin + "' cannot be parsed: " + e,
                oEvent.data,
                "sap.ushell.components.container.ApplicationContainer"
            );
            return;
        }
        if (oMessageData.type === "response") {
            if (oMessageData.status === "success") {
                sap.m.MessageToast.show("Post Message Response: " +
                    JSON.stringify(oMessageData.body.result));
            } else if (oMessageData.status === "error") {
                sap.m.MessageToast.show("Error: " +
                    JSON.stringify(oMessageData.body.message));
            } else {
                sap.m.MessageBox.show("No status in response", {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Protocol error"
                });
            }
        }
    }

    sap.ui.controller("sap.ushell.demo.PostMessageTestApp.PostMessageTest", {

        /**
        * Called when a controller is instantiated and its View controls (if available) are
        * already created. Can be used to modify the View before it is displayed, to bind
        * event handlers and do other one-time initialization.
        */
        onInit: function () {
            window.addEventListener("message", onMessage);
        },


        /**
        * Called when the Controller is destroyed. Use this one to free resources and finalize
        * activities.
        */
        onExit: function () {
            window.removeEventListener("message", onMessage);
        }

    });

}());