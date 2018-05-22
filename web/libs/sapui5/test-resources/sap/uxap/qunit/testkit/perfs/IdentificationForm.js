jQuery.sap.declare("sap.uxap.testkit.perfs.IdentificationForm");
jQuery.sap.require("sap.uxap.BlockBase");


sap.uxap.BlockBase.extend("sap.uxap.testkit.perfs.IdentificationForm", {

    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.testkit.perfs.IdentificationForm",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.testkit.perfs.IdentificationForm",
                type: "XML"
            }

        },
        properties: {

           "columnLayout" : {type: "sap.uxap.ObjectPageBlockBaseColumnLayout", group: "Behavior", defaultValue: "1"},

           "labelSpanL": {
                defaultValue: 4,
                group : "Misc",
                type: "int"
            },
            "labelSpanM": {
                defaultValue: 2,
                group : "Misc",
                type: "int"
            },
            "emptySpanL": {
                defaultValue: 0,
                group : "Misc",
                type: "int"
            },
            "emptySpanM": {
                defaultValue: 0,
                group : "Misc",
                type: "int"
            },
            "columnsL": {
                defaultValue: 2,
                group : "Misc",
                type: "int"
            },
            "columnsM": {
                defaultValue: 1,
                group : "Misc",
                type: "int"
            }
        }
    }

});

