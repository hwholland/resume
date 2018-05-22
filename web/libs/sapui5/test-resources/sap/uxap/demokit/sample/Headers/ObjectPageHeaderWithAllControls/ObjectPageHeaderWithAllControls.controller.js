
sap.ui.controller("sap.uxap.sample.Headers.ObjectPageHeaderWithAllControls.ObjectPageHeaderWithAllControls", {

    onInit: function () {
        var oJsonModel = new sap.ui.model.json.JSONModel("./test-resources/sap/uxap/demokit/sample/Headers/block/employee.json");

        this.getView().setModel(oJsonModel, "ObjectPageModel");

        var oSampleModel = new sap.ui.model.json.JSONModel({
            text:"working binding",
            icon:"sap-icon://chain-link"
        });

        this.getView().setModel(oSampleModel, "buttons");
    },
    onFormat: function () {
        return "formatted link";
    }


});