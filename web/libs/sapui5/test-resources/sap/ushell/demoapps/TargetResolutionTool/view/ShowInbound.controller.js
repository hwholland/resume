// @copyright@
/*global sap*/
sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller"
], function (jQuery, oController) {
    "use strict";
    return oController.extend("sap.ushell.demo.TargetResolutionTool.view.ShowInbound", {
        onInit: function () {
            this.oInboundModel = this.getView().getViewData();
            this.getView().setModel(this.oInboundModel);
            this.oInboundModel.bindTree("/").attachChange(this._onModelChanged);
        },
        onBackClicked: function () {
            this.oApplication.navigate("toView", "InboundsBrowser");
        },
        _onModelChanged: function () { }
    });
});
