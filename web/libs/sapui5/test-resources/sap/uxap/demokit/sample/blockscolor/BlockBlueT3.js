jQuery.sap.declare("sap.uxap.sample.blockscolor.BlockBlueT3");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.blockscolor.BlockBlueT3", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT3",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.blockscolor.BlockBlueT3",
                type: "XML"
            }
        }
    }
});