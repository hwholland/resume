sap.ui.define(['sap/ui/core/UIComponent'],
    function(UIComponent) {
    "use strict";

    var Component = UIComponent.extend("sap.viz.sample.Bullet.Component", {

        metadata : {
            rootView : "sap.viz.sample.Bullet.Bullet",
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
                        "Bullet.view.xml",
                        "Bullet.controller.js",
                        "CustomerFormat.js",
                        "InitPage.js"
                    ]
                }
            }
        }
    });

    return Component;

});
