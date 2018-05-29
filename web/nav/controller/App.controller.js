sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("nav.controller.App", {

		onInit: function () {
            var oTimelineModel = this.getOwnerComponent().getModel("timeline");
            var oTimelineData = oTimelineModel.getData();
            oTimelineData.data.forEach(element => {
                var oDate = new Date(element.Date);
                element.Date = oDate;
            });
            oTimelineModel.setData(oTimelineData);
            console.log(oTimelineData);
        },
        
        onAfterRendering: function() {
            
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
        }
	});

});

