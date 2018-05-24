// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, document, self */
    /*jslint plusplus: true, nomen: true, vars: true */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.m.Label");

    sap.ui.jsview("sap.ushell.renderers.fiori2.usageAnalytics_selector.UsageAnalyticsSelector", {

        createContent: function (oController) {
            this.oMessage = new sap.m.Text({
                text: sap.ushell.Container.getService("UsageAnalytics").getLegalText()
            }).addStyleClass('sapUshellUsageAnalyticsSelectorLegalTextMessage');

            this.oSwitchButton = new sap.m.Switch('usageAnalyticsSwitch', {
                customTextOn: " ",
                customTextOff: " ",
                state: {
                    path: "/trackUsageAnalytics",
                    mode: sap.ui.model.BindingMode.TwoWay
                }
            });
            this.oLabel = new sap.m.Label({text: sap.ushell.resources.i18n.getText("allowTracking")}).addStyleClass('sapUshellUsageAnalyticsSelectorLabel');

            return [this.oMessage, this.oLabel, this.oSwitchButton];
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.usageAnalytics_selector.UsageAnalyticsSelector";
        }

    });

}());