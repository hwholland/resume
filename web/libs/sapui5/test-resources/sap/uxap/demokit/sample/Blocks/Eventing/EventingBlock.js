jQuery.sap.declare("sap.uxap.sample.Blocks.Eventing.EventingBlock");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.sample.Blocks.Eventing.EventingBlock", {
    metadata: {
        events: {
            "dummy" : {}
        }
        /* no additional views/modes defined */
    }
});
