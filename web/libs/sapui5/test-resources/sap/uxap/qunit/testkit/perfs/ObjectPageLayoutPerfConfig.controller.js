jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.ui.model.odata.ODataModel");
jQuery.sap.require("sap.ui.model.json.JSONModel");

sap.ui.controller("sap.uxap.testkit.perfs.ObjectPageLayoutPerfConfig", {
	onInit: function () {

        var oModel;

        oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData("test-resources/testkit/model/VendorData.json");
        var oView = this.getView();

        oView.setModel(oModel, "objectPageData");
        oView.bindElement("objectPageData>/Vendors('3511')");


	}

});
