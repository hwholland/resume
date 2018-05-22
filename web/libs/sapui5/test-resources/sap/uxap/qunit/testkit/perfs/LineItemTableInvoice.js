jQuery.sap.declare("sap.uxap.testkit.perfs.LineItemTableInvoice");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.testkit.perfs.LineItemTableInvoice", {
    metadata: {

        properties:{
            "columnLayout"      : {type: "sap.uxap.ObjectPageBlockBaseColumnLayout", group: "Behavior", defaultValue: "3"},
            "maxRows"           : {type : "int", group : "Misc", defaultValue : 10},
            "title"             : {type : "string", group : "Misc", defaultValue : ""},
            "fullScreenTitle"   : {type : "string", group : "Misc", defaultValue : ""}
        },
        events : {
            "toggleTableFullScreen": {}
        },

        views: {
            Collapsed: {
                viewName: "sap.uxap.testkit.perfs.LineItemTableInvoice",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.testkit.perfs.LineItemTableInvoice",
                type: "XML"
            },
            FullScreen:{
                viewName: "sap.uxap.testkit.perfs.LineItemTableInvoice",
                type: "XML"
            }
        }
    }
});