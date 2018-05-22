define("flagbar-bundle",["sap_viz_ext_flag-src/js/FlagBarFlow"], function (flowDefinition) {
    
    var vizExtImpl = {
        viz   : [flowDefinition],
        module: [],
        feeds : []
    };

    var vizExtBundle = sap.bi.framework.declareBundle({
        "id" : "sap.viz.ext.flagbar",
        "version" : "1.0.0.0",
        "components" : [{
            "id" : "sap.viz.ext.flagbar",
            "provide" : "sap.viz.impls",
            "instance" : vizExtImpl,
            "customProperties" : {
                "name" : "Flag Bar Sample",
                "description" : "CVOM Extension Sample: Flag Bar Chart",
                "icon" : {"path" : ""},
                "category" : [],
                "resources" : [{"key": "sap.viz.ext.flagbar.ImgLoadPath", "path": "./sap_viz_ext_flag-src/resources/img/"}]
            }
        }]
    });

    // register bundle to support Lumira extension framework
    if (sap.bi.framework.getService("sap.viz.aio", "sap.viz.extapi")) {
        return sap.bi.framework.getService("sap.viz.aio", "sap.viz.extapi").core.registerBundle(vizExtBundle);
        //return vizExtBundle;
    } else {
        return vizExtBundle;
    }

});