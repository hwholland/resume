jQuery.sap.declare("sap.uxap.sample.Headers.AlternativeProfileObjectPageHeader.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Headers.AlternativeProfileObjectPageHeader.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Headers.AlternativeProfileObjectPageHeader.AlternativeProfileObjectPageHeader",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "AlternativeProfileObjectPageHeader.view.xml",
                    "AlternativeProfileObjectPageHeader.controller.js"
                ]
            }
        }
    }
});