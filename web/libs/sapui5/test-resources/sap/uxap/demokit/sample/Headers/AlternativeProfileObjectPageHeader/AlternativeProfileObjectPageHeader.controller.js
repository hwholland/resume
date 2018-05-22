
sap.ui.controller("sap.uxap.sample.Headers.AlternativeProfileObjectPageHeader.AlternativeProfileObjectPageHeader", {

    onInit: function () {
        var oJsonModel = new sap.ui.model.json.JSONModel("./test-resources/sap/uxap/demokit/sample/Headers/block/employee.json");

        this.getView().setModel(oJsonModel, "ObjectPageModel");
    }


});