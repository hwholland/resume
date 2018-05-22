jQuery.sap.declare("sap.uxap.sample.ObjectPageOnJSON.block.personal.PersonalBlockPart2");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.ObjectPageOnJSON.block.personal.PersonalBlockPart2", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.ObjectPageOnJSON.block.personal.PersonalBlockPart2",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.ObjectPageOnJSON.block.personal.PersonalBlockPart2",
                type: "XML"
            }
        }
    }
});
