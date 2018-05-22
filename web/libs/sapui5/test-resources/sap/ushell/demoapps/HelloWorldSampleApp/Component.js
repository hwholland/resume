/*global sap, jQuery */
jQuery.sap.declare("sap.ushell.demo.HelloWorldSampleApp.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.HelloWorldSampleApp.Component", {
    oMainView : null,

    metadata : {
        version : "@version@",
        library : "sap.ushell.demo.HelloWorldSampleApp",
        dependencies : {
            libs : [ "sap.m" ],
            components : []
        },
        config: {
            "title": "HelloWorldSampleApp",
            "icon" : "sap-icon://Fiori2/F0429"
        }
    },

    createContent : function () {
        "use strict";
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.HelloWorldSampleApp.App");
        return this.oMainView;
    }
});