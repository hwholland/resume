/*global sap, jQuery */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.AppPersSample.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.AppPersSample.Component", {

    oMainView : null,

    // use inline declaration instead of component.json to save 1 round trip
    metadata : {

        version : "@version@",

        library : "sap.ushell.demo.AppPersSample",

        dependencies : {
            libs : [ "sap.m" ],
            components : []
        },
        config: {
            "title": "App Pers Sample",
            //"resourceBundle" : "i18n/i18n.properties",
            //"titleResource" : "shellTitle",
            "icon" : "sap-icon://Fiori2/F0429"
        }
    // properties : {
    // // the shell passes application startup parameters using the
    // // componentData object
    // componentData : {
    // type : "object"
    // }
    // }
    },

    createContent : function () {
        "use strict";
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample.App");
        return this.oMainView;
    }

});
