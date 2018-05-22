jQuery.sap.declare("sap.suite.ui.commons.sample.GenericTile2x1TwoCont.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.GenericTile2x1TwoCont.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.GenericTile2x1TwoCont.GenericTile2x1TwoCont",
                dependencies : {
                        libs : [
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "GenericTile2x1TwoCont.view.xml",
                                        "GenericTile2x1TwoCont.controller.js"
                                ]
                        }
                }
        }
});