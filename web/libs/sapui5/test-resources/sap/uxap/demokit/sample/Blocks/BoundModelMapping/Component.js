jQuery.sap.declare("sap.uxap.sample.Blocks.BoundModelMapping.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Blocks.BoundModelMapping.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Blocks.BoundModelMapping.BoundModelMapping",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "BoundModelMapping.view.xml",
                    "BoundModelMapping.controller.js",
                    "ModelMappingBlock.js",
                    "ModelMappingBlock.view.xml"
                ]
            }
        }
    }
});