jQuery.sap.declare("sap.uxap.sample.Headers.ProfileObjectPageHeader.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Headers.ProfileObjectPageHeader.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Headers.ProfileObjectPageHeader.ProfileObjectPageHeader",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "ProfileObjectPageHeader.view.xml",
                    "ProfileObjectPageHeader.controller.js"
                ]
            }
        }
    }
});