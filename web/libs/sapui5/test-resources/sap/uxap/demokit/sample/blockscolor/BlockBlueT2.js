jQuery.sap.declare("sap.uxap.sample.blockscolor.BlockBlueT2");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.blockscolor.BlockBlueT2", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT2",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT2",
                type: "XML"
            }
        }
    }
});