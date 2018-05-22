jQuery.sap.declare("sap.suite.ui.commons.sample.GenericTileStates.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.GenericTileStates.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.GenericTileStates.GenericTileStates",
                dependencies : {
                        libs : [
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "GenericTileStates.view.xml",
                                ]
                        }
                }
        }
});