sap.ui.define(['sap/ui/core/UIComponent'],
    function(UIComponent) {
    "use strict";

    var Component = UIComponent.extend("sap.viz.sample.ZoomInitialization.Component", {

        metadata : {
            rootView : "sap.viz.sample.ZoomInitialization.ZoomInitialization",
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
                        "ZoomInitialization.view.xml",
                        "ZoomInitialization.controller.js",
                        "CustomerFormat.js",
                        "InitPage.js"
                    ]
                }
            }
        }
    });

    return Component;

});
