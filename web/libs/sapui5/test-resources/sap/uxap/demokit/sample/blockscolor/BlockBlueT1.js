jQuery.sap.declare("sap.uxap.sample.blockscolor.BlockBlueT1");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.blockscolor.BlockBlueT1", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT1",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT1",
                type: "XML"
            }
        }
    }
});