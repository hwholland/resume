jQuery.sap.declare("sap.suite.ui.commons.sample.HeaderContainerNoDividers.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.HeaderContainerNoDividers.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.HeaderContainerNoDividers.HeaderContainer",
                dependencies : {
                        libs : [
                                "sap.m",
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "HeaderContainer.view.xml"
                                ]
                        }
                }
        }
});