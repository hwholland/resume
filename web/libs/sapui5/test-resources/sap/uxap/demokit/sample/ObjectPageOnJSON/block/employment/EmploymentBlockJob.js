jQuery.sap.declare("sap.uxap.sample.ObjectPageOnJSON.block.employment.EmploymentBlockJob");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.ObjectPageOnJSON.block.employment.EmploymentBlockJob", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.ObjectPageOnJSON.block.employment.EmploymentBlockJobCollapsed",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.ObjectPageOnJSON.block.employment.EmploymentBlockJobExpanded",
                type: "XML"
            }
        }
    }
});