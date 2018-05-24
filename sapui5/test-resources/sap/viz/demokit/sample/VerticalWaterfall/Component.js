sap.ui.define(['sap/ui/core/UIComponent'],
    function(UIComponent) {
    "use strict";

    var Component = UIComponent.extend("sap.viz.sample.VerticalWaterfall.Component", {

        metadata : {
            rootView : "sap.viz.sample.VerticalWaterfall.VerticalWaterfall",
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
                        "VerticalWaterfall.view.xml",
                        "VerticalWaterfall.controller.js",
                        "ControllerOverall.js",
                        "CustomerFormat.js",
                        "InitPage.js"
                    ]
                }
            }
        }
    });

    return Component;

});
