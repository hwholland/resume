sap.ui.define(['sap/ui/core/UIComponent'],
    function(UIComponent) {
    "use strict";

    var Component = UIComponent.extend("sap.viz.sample.Hierarchical.Component", {

        metadata : {
            rootView : "sap.viz.sample.Hierarchical.Hierarchical",
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
                        "Hierarchical.view.xml",
                        "Hierarchical.controller.js",
                        "CustomerFormat.js",
                        "InitPage.js"
                    ]
                }
            }
        }
    });

    return Component;

});
