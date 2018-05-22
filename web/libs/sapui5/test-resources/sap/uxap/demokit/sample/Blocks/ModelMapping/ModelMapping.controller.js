sap.ui.controller("sap.uxap.sample.Blocks.ModelMapping.ModelMapping", {

    onInit: function () {

        var oModel = new sap.ui.model.json.JSONModel({
            Employee: {
                firstName: "Mark",
                lastName: "Hamill"
            }
        });

        this.getView().setModel(oModel, "jsonModel");
    }
});