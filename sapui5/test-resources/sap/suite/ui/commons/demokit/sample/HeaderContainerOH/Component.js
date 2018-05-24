jQuery.sap.declare("sap.suite.ui.commons.sample.HeaderContainerOH.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.HeaderContainerOH.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.HeaderContainerOH.Page",
                dependencies : {
                        libs : [
                                "sap.m",
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "Page.view.xml",
                                        "Page.controller.js"
                                ]
                        }
                }
        }
});