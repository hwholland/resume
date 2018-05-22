jQuery.sap.declare("sap.uxap.sample.Blocks.MultiView.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Blocks.MultiView.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Blocks.MultiView.MultiView",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "MultiView.view.xml",
                    "MultiViewBlock.js",
                    "MultiViewBlockCollapsed.view.xml",
                    "MultiViewBlockCommon.controller.js",
                    "MultiViewBlockExpanded.view.xml"
                ]
            }
        }
    }
});