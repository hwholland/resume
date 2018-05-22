jQuery.sap.declare("sap.uxap.sample.Blocks.SingleView.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Blocks.SingleView.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Blocks.SingleView.SingleView",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "SingleView.view.xml",
                    "SimpleForm.js",
                    "SimpleForm.view.xml"
                ]
            }
        }
    }
});