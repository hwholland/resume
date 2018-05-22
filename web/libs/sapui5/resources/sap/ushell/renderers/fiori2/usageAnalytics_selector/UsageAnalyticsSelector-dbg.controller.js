// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap */
    sap.ui.controller("sap.ushell.renderers.fiori2.usageAnalytics_selector.UsageAnalyticsSelector", {

        onInit: function () {
            this.oUser = sap.ushell.Container.getUser();
            var oModel = new sap.ui.model.json.JSONModel({
                'trackUsageAnalytics': this.oUser.getTrackUsageAnalytics()
            });
            this.getView().setModel(oModel);
        },
        getContent: function () {
            var that = this;
            var deferred = jQuery.Deferred();
            deferred.resolve(that.getView());
            return deferred.promise();
        },

        getValue: function () {
            var deferred = jQuery.Deferred(),
                i18n = sap.ushell.resources.i18n,
                oModel = this.getView().getModel();
            deferred.resolve(oModel.getProperty('/trackUsageAnalytics') ? i18n.getText("trackingEnabled") : i18n.getText("trackingDisabled"));
            return deferred.promise();
        },

        onSave: function () {
            var currentUserTracking = this.getView().getModel().getProperty('/trackUsageAnalytics');
            return sap.ushell.Container.getService("UsageAnalytics").setTrackUsageAnalytics(currentUserTracking);
        }
    });
}());