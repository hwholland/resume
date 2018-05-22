jQuery.sap.declare("sap.uxap.sample.Blocks.Eventing.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Blocks.Eventing.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Blocks.Eventing.Eventing",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "Eventing.view.xml",
                    "Eventing.controller.js",
                    "EventingBlock.js",
                    "EventingBlock.view.xml",
                    "EventingBlockController.controller.js"
                ]
            }
        }
    }
});