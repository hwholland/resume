jQuery.sap.declare("sap.uxap.sample.ObjectPageOnJSON.block.personal.PersonalBlockPart1");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.ObjectPageOnJSON.block.personal.PersonalBlockPart1", {
    metadata: {
        views: {
            Collapsed: {
                viewName: "sap.uxap.sample.ObjectPageOnJSON.block.personal.PersonalBlockPart1",
                type: "XML"
            },
            Expanded: {
                viewName: "sap.uxap.sample.ObjectPageOnJSON.block.personal.PersonalBlockPart1",
                type: "XML"
            }
        }
    }
});
