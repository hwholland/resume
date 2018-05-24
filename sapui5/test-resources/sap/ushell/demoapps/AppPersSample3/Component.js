// @copyright@

(function () {
    "use strict";
    /*global jQuery, sap*/

    // define a root UIComponent which exposes the main view
    jQuery.sap.declare("sap.ushell.demo.AppPersSample3.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");

    // new Component
    sap.ui.core.UIComponent.extend("sap.ushell.demo.AppPersSample3.Component", {

        oMainView : null,

        // use inline declaration instead of component.json to save 1 round trip
        metadata : {

            version : "1.0",

            library : "sap.ushell.demo.AppPersSample3",

            dependencies : {
                libs : [ "sap.m" ],
                components : [],
                ui5version : "1.16.0"
            },
            config: {
                "title": "App Pers Sample 3",
                //"resourceBundle" : "i18n/i18n.properties",
                //"titleResource" : "shellTitle",
                "icon" : "sap-icon://Fiori2/F002"
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
            this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample3.App");
            return this.oMainView;
        }
    });

}());