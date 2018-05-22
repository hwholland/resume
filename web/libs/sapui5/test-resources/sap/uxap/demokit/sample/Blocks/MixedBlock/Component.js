jQuery.sap.declare("sap.uxap.sample.Blocks.MixedBlock.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Blocks.MixedBlock.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Blocks.MixedBlock.MixedBlock",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "MixedBlock.view.xml",
                    "MixedBlock.controller.js",
                    "MixedBlockView.view.xml",
                    "MixedBlock.js",
                    "SimpleEdit.view.xml",
                    "SimpleEdit.js"
                ]
            }
        }
    }
});