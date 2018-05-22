// define a root UIComponent which exposes the main view
/*global sap, jQuery */
jQuery.sap.declare("sap.ushell.demo.PersSrvTest.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.PersSrvTest.Component", {

    oMainView : null,

    // use inline declaration instead of component.json to save 1 round trip
    metadata : {

        version : "@version@",

        library : "sap.ushell.demo.PersSrvTest",

        dependencies : {
            libs : [ "sap.m" ],
            components : []
        },
        config: {
            "title": "Personalization Service Test",
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
        var oComponentData = this.getComponentData && this.getComponentData();

        this.oMainView = sap.ui.xmlview("sap.ushell.demo.PersSrvTest.App");

        return this.oMainView;
    }

});
