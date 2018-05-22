jQuery.sap.declare("sap.uxap.testkit.blocks.BasicDivBlock");
//jQuery.sap.require("sap.uxap.BlockBase");
jQuery.sap.require("sap.uxap.BlockBase");

sap.uxap.BlockBase.extend("sap.uxap.testkit.blocks.BasicDivBlock", {
    metadata: {
        properties: {
            "height": {type: "string", group: "Appearance"},
            "backgroundColor": {type: "string", group: "Appearance"}
        }
    }
});

