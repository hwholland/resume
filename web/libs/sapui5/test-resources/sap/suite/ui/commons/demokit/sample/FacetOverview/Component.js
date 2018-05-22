jQuery.sap.declare("sap.suite.ui.commons.sample.FacetOverview.Component");

sap.ui.core.UIComponent.extend("sap.suite.ui.commons.sample.FacetOverview.Component", {

        metadata : {
                rootView : "sap.suite.ui.commons.sample.FacetOverview.FacetOverview",
                includes : [ "FacetOverview/style.css" ],
                dependencies : {
                        libs : [
                                "sap.m",
                                "sap.suite.ui.commons"
                        ]
                },
                config : {
                        sample : {
                                files : [
                                        "FacetOverview.view.xml",
                                        "FacetOverview.controller.js",
                                        "Map.fragment.js",
                                        "style.css",
                                        "map.json"
                                ]
                        }
                }
        }
});