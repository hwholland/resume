
sap.ui.controller("sap.uxap.sample.Headers.KPIObjectPageHeader.KPIObjectPageHeader", {

    onInit: function () {
        var oJsonModel = new sap.ui.model.json.JSONModel("./test-resources/sap/uxap/demokit/sample/Headers/block/employee.json");

        this.getView().setModel(oJsonModel, "ObjectPageModel");
    },

	changeDesign : function() {
		var sDesign = this.getView().byId('headerForTest').getHeaderDesign();
		if(sDesign == "Light") {
			sDesign = "Dark";
		}
		else {
			sDesign = "Light";
		}
		this.getView().byId('headerForTest').setHeaderDesign(sDesign);

	}


});