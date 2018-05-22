// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel*/
jQuery.sap.declare("sap.ushell.demo.UserDefaults.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.UserDefaults.Component", {

    metadata : {

        "library": "sap.ushell.demo.UserDefaults",

        "version" : "@version@",

        "includes" : [

        ],

        "dependencies" : {
            "libs" : [
                "sap.m",
                "sap.ui.comp"
            ],
            "components" : [
            ]
        },

        "config" : {
            "title": "UserDefaults Application",
            //"resourceBundle" : "i18n/i18n.properties",
            //"titleResource" : "shellTitle",
            "icon" : "sap-icon://Fiori2/F0002",
            // In real Fiori apps, don't use absolute paths, but reference your icons/images
            // as shown in sap.ca's scfld.md.sample app.
            "favIcon" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0002_My_Accounts.ico",
            "homeScreenIconPhone" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/57_iPhone_Desktop_Launch.png",
            "homeScreenIconPhone@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/114_iPhone-Retina_Web_Clip.png",
            "homeScreenIconTablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/72_iPad_Desktop_Launch.png",
            "homeScreenIconTablet@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/144_iPad_Retina_Web_Clip.png",
            "startupImage320x460" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
            "startupImage640x920" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
            "startupImage640x1096" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
            "startupImage768x1004" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
            "startupImage748x1024" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1024_x_748.png",
            "startupImage1536x2008" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
            "startupImage1496x2048" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/2048_x_1496.png"
        },

        routing: {
            config: {
                viewType : "XML",
                viewPath: "",  // leave empty, common prefix
                targetControl: "app",
                targetAggregation: "detailPages",
                clearTarget: false,
                callback: function (oRoute, oArguments, oConfig, oControl, oView) {
                    "use strict";
                    oControl.toDetail(oView.getId());
                }
            },
            routes: [
                     {
                         pattern : "SimpleEditor", // will be the url and from has to be provided in the data
                         view : "sap.ushell.demo.UserDefaults.view.SimpleEditor",
                         name : "toEditor" // name used for listening or navigating to this route
                     },
                     {
                         pattern : "UsedParams", // will be the url and from has to be provided in the data
                         view : "sap.ushell.demo.UserDefaults.view.UsedParams",
                         name : "toUsedParams" // name used for listening or navigating to this route
                     },
                     {
                         pattern : "ShowEvents",
                         view : "sap.ushell.demo.UserDefaults.view.ShowEvents",
                         name : "toShowEvents"
                     },
                     {
                         pattern : ":all*:", // catchall
                         view : "sap.ushell.demo.UserDefaults.view.SimpleEditor",
                         name : "catchall"// name used for listening or navigating to this route
                     }
            ]
        }
    },

    getAutoPrefixId : function() {
        return true;
    },

    createContent : function() {

        var oMainView = sap.ui.view({
            type : sap.ui.core.mvc.ViewType.XML,
            viewName : "sap.ushell.demo.UserDefaults.Main"
        });

        return oMainView;
    },

    init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        // this component should automatically initialize the router!
        this.getRouter().initialize();
    }

});

