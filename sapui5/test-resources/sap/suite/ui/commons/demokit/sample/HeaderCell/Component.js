jQuery.sap.declare("sap.suite.ui.commons.sample.HeaderCell.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.HeaderCell.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.HeaderCell.HeaderCell",
                includes : [ "style.css" ],
                dependencies : {
                        libs : [
                                "sap.m",
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "HeaderCell.view.xml",
                                        "style.css"
                                ]
                        }
                }
        }
});