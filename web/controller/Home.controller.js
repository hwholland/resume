sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";

    /**
     * @class      solo.web.controller.Home
     * @extends    sap.ui.core.mvc.Controller
     */
    return Controller.extend("resume.web.controller.Home", {

        onInit: function() {
            var oData = this.getOwnerComponent().getModel("data");
            this.getView().setModel(oData, "data");
            var oTimeline = oData.getProperty("/timeline");
            oTimeline.forEach(element => {
                var oDate = new Date(element.Date);
                element.Date = oDate;
            });
        },

        onPressLinkedIn: function() {
            window.open("https://www.linkedin.com/in/harrisonholland", "_blank");
        },

        onPressGithub: function() {
            window.open("https://github.com/hwholland", "_blank");
        },

        onPressSDN: function() {
            window.open("https://people.sap.com/harrison.holland4", "_blank");
        },

        onPressEmail: function() {
            sap.m.URLHelper.triggerEmail("harrisonholland@gmail.com", "Info Request");
        },

    });
});