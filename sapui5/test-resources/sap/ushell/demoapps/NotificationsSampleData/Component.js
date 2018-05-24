(function () {
    "use strict";

    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.NotificationsSampleData.Component");
    jQuery.sap.require("sap.ui.core.Component");

    // new Component
    sap.ui.core.Component.extend("sap.ushell.demo.NotificationsSampleData.Component", {

        metadata: {
            version: "@version@",
            library: "sap.ushell.demo.NotificationsSampleData"
        },

        init: function () {
            jQuery.sap.require('sap.ui.core.util.MockServer');
            var notifications = jQuery.sap.loadResource('../test-resources/sap/ushell/demoapps/NotificationsSampleData/model/NS_Notifications.json');
            var notificationsByType = jQuery.sap.loadResource('../test-resources/sap/ushell/demoapps/NotificationsSampleData/model/NS_Notifications_By_Type.json');
            var oMockServer = new sap.ui.core.util.MockServer({
                requests: [
                    {
                        method: 'GET',
                        path: new RegExp("/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model/Notifications.*"),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, notifications);
                        }
                    },
//                    {
//                        method: 'GET',
//                        path: new RegExp("/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model//Notifications?$expand=Actions,NavigationTargetParams"),
//                        response: function (xhr) {
//                            xhr.respondJSON(200, {}, notificationsByType);
//                        }
//                    },
                    {
                        method: 'GET',
                        path: new RegExp("/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model/GetBadgeNumber().*"),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, {d: {GetBadgeNumber: {Number: 10}}});
                        }
                    },
                    {
                        method: 'POST',
                        path: new RegExp("/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model/ResetBadgeNumber.*"),
                        response: function (xhr) {
                            xhr.respondJSON(204, {}, '');
                        }
                    },
                    {
                        method: 'POST',
                        path: new RegExp("/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model/Dismiss.*"),
                        response: function (xhr) {
                            xhr.respondJSON(204, {}, '');
                        }
                    },
                    {
                        method: 'POST',
                        path: new RegExp("/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model/MarkRead.*"),
                        response: function (xhr) {
                            xhr.respondJSON(204, {}, '');
                        }
                    },
                    {
                        method: 'POST',
                        path: new RegExp("/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model/ExecuteAction.*"),
                        response: function (xhr) {
                            xhr.respondJSON(204, {}, '');
                        }
                    }

                ]
            });

            oMockServer.start();
            var oSrv = sap.ushell.Container.getService('Notifications');
            oSrv._setWorkingMode();
        }
    });
})();
