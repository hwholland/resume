sap.ui.define(['sap/ui/core/UIComponent'],
    function(UIComponent) {
    "use strict";

    var Component = UIComponent.extend("sap.viz.sample.MultipleMeasuresForOneSeries.Component", {

        metadata : {
            rootView : "sap.viz.sample.MultipleMeasuresForOneSeries.MultipleMeasuresForOneSeries",
            includes : ["../../css/exploredStyle.css"],
            dependencies : {
                libs : [
                    "sap.viz",
                    "sap.m"
                ]
            },
            config : {
                sample : {
                    stretch : true,
                    files : [
                        "MultipleMeasuresForOneSeries.view.xml",
                        "MultipleMeasuresForOneSeries.controller.js",
                        "CustomerFormat.js",
                        "InitPage.js"
                    ]
                }
            }
        }
    });

    return Component;

});
