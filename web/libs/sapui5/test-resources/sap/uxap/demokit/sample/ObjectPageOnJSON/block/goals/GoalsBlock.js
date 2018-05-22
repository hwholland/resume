jQuery.sap.declare("sap.uxap.sample.ObjectPageOnJSON.block.goals.GoalsBlock");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.ObjectPageOnJSON.block.goals.GoalsBlock", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.ObjectPageOnJSON.block.goals.GoalsBlock",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.ObjectPageOnJSON.block.goals.GoalsBlock",
                type: "XML"
            }
        }
    }
});
