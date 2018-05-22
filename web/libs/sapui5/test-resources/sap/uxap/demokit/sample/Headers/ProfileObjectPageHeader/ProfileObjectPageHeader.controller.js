
sap.ui.controller("sap.uxap.sample.Headers.ProfileObjectPageHeader.ProfileObjectPageHeader", {

    onInit: function () {
        var oJsonModel = new sap.ui.model.json.JSONModel("./test-resources/sap/uxap/demokit/sample/Headers/block/employee.json");

        this.getView().setModel(oJsonModel, "ObjectPageModel");

        if (sap.ui.Device.system.desktop) {
            this._oSplitContainer = sap.ui.getCore().byId("splitApp");
            this._oSplitContainer.backToPage = jQuery.proxy(function () {

                this.setMode("ShowHideMode");
                this.showMaster();

                sap.m.SplitContainer.prototype.backToPage.apply(this, arguments);

            }, this._oSplitContainer);
        }
    },

    onBeforeRendering: function () {

        //hide master for this page
        if (sap.ui.Device.system.desktop) {
            this._oSplitContainer.setMode("HideMode");
            this._oSplitContainer.hideMaster();
        }
    }

});