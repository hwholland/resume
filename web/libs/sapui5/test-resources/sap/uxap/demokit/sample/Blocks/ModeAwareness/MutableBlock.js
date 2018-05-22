jQuery.sap.declare("sap.uxap.testblocks.mutable.MutableBlock");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.testblocks.mutable.MutableBlock", {
    metadata: {
        views: {
            mode1: {
                viewName: "sap.uxap.testblocks.mutable.MutableBlock",
                type: "XML"
            },
            mode2: {
                viewName: "sap.uxap.testblocks.mutable.MutableBlock",
                type: "XML"
            }
        }
    }
});
