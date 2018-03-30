sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";

    /**
     * @class      solo.web.controller.Home
     * @extends    sap.ui.core.mvc.Controller
     */
    return Controller.extend("resume.web.controller.Visualize", {

        onInit: function() {
            var oTokens = this.getOwnerComponent().getModel("tokens");
            this.getView().setModel(oTokens, "tokens");
        }
    });
});