sap.ui.jsfragment("sap.suite.ui.commons.sample.FacetOverview.Map", { 
    createContent: function(oController) {
            jQuery.sap.require("sap.ui.vbm.VBI");
            var oVBI = new sap.ui.vbm.VBI('vizBizMap', { width : "100%", height: "100%" });
            jQuery.getJSON("test-resources/sap/suite/ui/commons/demokit/sample/FacetOverview/map.json", function(oData) { oVBI.load(oData); });
            return oVBI;
    } 
});
