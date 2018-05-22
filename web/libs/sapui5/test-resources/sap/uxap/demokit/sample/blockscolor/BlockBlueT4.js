jQuery.sap.declare("sap.uxap.sample.blockscolor.BlockBlueT4");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.blockscolor.BlockBlueT4", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT4",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT4",
                type: "XML"
            }
        }
    }
});