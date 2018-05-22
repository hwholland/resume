jQuery.sap.declare("sap.suite.ui.commons.sample.HeaderContainerVM.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.HeaderContainerVM.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.HeaderContainerVM.HeaderContainerVM",
                includes : [ "HeaderContainerVM/style.css" ],
                dependencies : {
                        libs : [
                                "sap.m",
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "HeaderContainerVM.view.xml",
                                        "style.css"
                                ]
                        }
                }
        }
});