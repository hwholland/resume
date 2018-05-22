jQuery.sap.declare("sap.uxap.sample.Blocks.ModelMapping.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Blocks.ModelMapping.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Blocks.ModelMapping.ModelMapping",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "ModelMapping.view.xml",
                    "ModelMapping.controller.js",
                    "ModelMappingBlock.js",
                    "ModelMappingBlock.view.xml"
                ]
            }
        }
    }
});