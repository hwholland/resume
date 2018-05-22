sap.ui.controller("sap.uxap.sample.Blocks.BoundModelMapping.BoundModelMapping", {

    onInit: function () {

        var oModel = new sap.ui.model.json.JSONModel({
            externalPath: "/Employee",
            Employee: {
                firstName: "Mark",
                lastName: "Hamill"
            }
        });

        var oBound = new sap.ui.model.json.JSONModel({ externalPath: "/Employee" });

        this.getView().setModel(oModel, "jsonModel");
    }
});