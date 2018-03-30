sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel",
    "resume/web/model/js/VizFrame",
    "sap/viz/ui5/controls/Popover"
], function(Controller, JSONModel, VizFrame, Popover) {
    "use strict";

    /**
     * @class      solo.web.controller.Home
     * @extends    sap.ui.core.mvc.Controller
     */
    return Controller.extend("resume.web.controller.Home", {

        onInit: function() {
            var oTokens = this.getOwnerComponent().getModel("tokens");
            this.getView().setModel(oTokens, "tokens");
            var oViz = this.getOwnerComponent().getModel("viz");
            this.getView().setModel(oViz, "viz");
            console.log(oViz);
            var oVizProperties = {
                "general": {
                },
                "legend": {
                    "title": {
                        "visible": true
                    }
                },
                "plotArea": {
                    "colorPalette": [
                        "sapUiChartPaletteSequentialHue1Light3",
                        "sapUiChartPaletteSequentialHue1Light2",
                        "sapUiChartPaletteSequentialHue1Light1",
                        "sapUiChartPaletteSequentialHue1Dark2",
                        "sapUiChartPaletteSequentialHue1Dark1"
                    ]
                },
                "title": {
                    "visible": false
                }
            };
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            //var oVizFrame2 = this.oVizFrame = this.getView().byId("idVizFrame2")
            oVizFrame.setVizProperties(oVizProperties);
            //oVizFrame2.setVizProperties(oVizProperties);
            oVizFrame.setModel(oViz);
            //oVizFrame2.setModel(oViz);
            var oVizPopover = new Popover(this.createId("Popover"));
            console.log(this.getView());
            oVizPopover.connect(oVizFrame.getVizUid());
            //oVizPopover.connect(oVizFrame2.getVizUid());
        },

        onAfterRendering: function() {
            //console.log(this);
            //console.log(this.getView());
            
        }

    });
});