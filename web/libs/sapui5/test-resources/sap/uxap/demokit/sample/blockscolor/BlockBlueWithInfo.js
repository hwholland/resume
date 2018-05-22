jQuery.sap.declare("sap.uxap.sample.blockscolor.BlockBlueWithInfo");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.blockscolor.BlockBlueWithInfo", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueWithInfo",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueWithInfo",
                type: "XML"
            }
        }
    }
});