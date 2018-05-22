jQuery.sap.declare("sap.uxap.sample.Blocks.MultiView.MultiViewBlock");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.Blocks.MultiView.MultiViewBlock", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.Blocks.MultiView.MultiViewBlockCollapsed",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.Blocks.MultiView.MultiViewBlockExpanded",
                type: "XML"
            }
        }
    }
});

