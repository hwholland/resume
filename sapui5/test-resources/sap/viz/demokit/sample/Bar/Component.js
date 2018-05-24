sap.ui.define(['sap/ui/core/UIComponent'],
    function(UIComponent) {
    "use strict";

    var Component = UIComponent.extend("sap.viz.sample.Bar.Component", {

        metadata : {
            rootView : "sap.viz.sample.Bar.Bar",
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
                        "Bar.view.xml",
                        "Bar.controller.js",
                        "CustomerFormat.js",
                        "InitPage.js"
                    ]
                }
            }
        }
    });

    return Component;

});
