jQuery.sap.declare("sap.uxap.sample.blockscolor.BlockBlueT5");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.blockscolor.BlockBlueT5", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT5",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT5",
                type: "XML"
            }
        }
    }
});