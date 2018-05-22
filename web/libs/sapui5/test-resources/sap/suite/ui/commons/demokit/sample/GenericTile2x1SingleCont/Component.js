jQuery.sap.declare("sap.suite.ui.commons.sample.GenericTile2x1SingleCont.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.GenericTile2x1SingleCont.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.GenericTile2x1SingleCont.GenericTile2x1SingleCont",
                dependencies : {
                        libs : [
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "GenericTile2x1SingleCont.view.xml",
                                        "GenericTile2x1SingleCont.controller.js"
                                ]
                        }
                }
        }
});