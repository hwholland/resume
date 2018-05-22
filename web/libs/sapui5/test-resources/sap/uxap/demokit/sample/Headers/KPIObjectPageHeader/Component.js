jQuery.sap.declare("sap.uxap.sample.Headers.KPIObjectPageHeader.Component");

sap.ui.core.UIComponent.extend("sap.uxap.sample.Headers.KPIObjectPageHeader.Component", {

    metadata : {
        rootView : "sap.uxap.sample.Headers.KPIObjectPageHeader.KPIObjectPageHeader",
        dependencies : {
            libs : [
                "sap.m"
            ]
        },
        config : {
            sample : {
                stretch : true,
                files : [
                    "KPIObjectPageHeader.view.xml",
                    "KPIObjectPageHeader.controller.js"
                ]
            }
        }
    }
});