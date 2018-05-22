jQuery.sap.declare("sap.suite.ui.commons.sample.HeaderContainer.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.HeaderContainer.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.HeaderContainer.HeaderContainer",
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