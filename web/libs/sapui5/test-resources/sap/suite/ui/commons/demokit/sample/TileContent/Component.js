jQuery.sap.declare("sap.suite.ui.commons.sample.TileContent.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.TileContent.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.TileContent.TileContent",
                dependencies : {
                        libs : [
                                "sap.m",
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "TileContent.view.xml"
                                ]
                        }
                }
        }
});