jQuery.sap.declare("sap.uxap.sample.blockscolor.BlockGreen");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.blockscolor.BlockGreen", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.blockscolor.BlockGreen",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.blockscolor.BlockGreen",
                type: "XML"
            }
        }
    }
});