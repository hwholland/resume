jQuery.sap.declare("sap.uxap.sample.Headers.ObjectPageHeaderWithAllControls.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Headers.ObjectPageHeaderWithAllControls.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Headers.ObjectPageHeaderWithAllControls.ObjectPageHeaderWithAllControls",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "ObjectPageHeaderWithAllControls.view.xml",
                    "ObjectPageHeaderWithAllControls.controller.js"
                ]
            }
        }
    }
});