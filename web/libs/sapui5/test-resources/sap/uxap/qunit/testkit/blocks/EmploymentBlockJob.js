jQuery.sap.declare("sap.uxap.testkit.blocks.EmploymentBlockJob");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.testkit.blocks.EmploymentBlockJob", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.testkit.blocks.EmploymentBlockJobCollapsed",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.testkit.blocks.EmploymentBlockJobExpanded",
                type: "XML"
            }
        }
    }
});