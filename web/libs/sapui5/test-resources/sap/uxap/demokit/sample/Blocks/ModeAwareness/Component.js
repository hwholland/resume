jQuery.sap.declare("sap.uxap.sample.Blocks.ModeAwareness.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Blocks.ModeAwareness.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Blocks.ModeAwareness.ModeAwareness",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "ModeAwareness.view.xml",
                    "MutableBlock.js",
                    "MutableBlock.view.xml",
                    "MutableBlockController.controller.js"
                ]
            }
        }
    }
});