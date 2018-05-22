jQuery.sap.declare("sap.suite.ui.commons.sample.GenericTile1x1.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.GenericTile1x1.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.GenericTile1x1.GenericTile1x1",
                dependencies : {
                        libs : [
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "GenericTile1x1.view.xml",
                                        "GenericTile1x1.controller.js"
                                ]
                        }
                }
        }
});