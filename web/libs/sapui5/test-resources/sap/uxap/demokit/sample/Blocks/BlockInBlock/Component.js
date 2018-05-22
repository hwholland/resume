jQuery.sap.declare("sap.uxap.sample.Blocks.BlockInBlock.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Blocks.BlockInBlock.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Blocks.BlockInBlock.BlockInBlock",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "BlockInBlock.view.xml",
                    "jsonData.json",
                    "Block.js",
                    "Block.view.xml",
                    "InnerBlock.js",
                    "InnerBlock.view.xml"
                ]
            }
        }
    }
});