jQuery.sap.require("sap.ui.model.json.JSONModel");

sap.ui.controller("sap.uxap.testkit.ObjectPageLayoutPerf", {

	onInit: function () {

		this.oJsonConfigModel = new sap.ui.model.json.JSONModel(
				{
					Section1 : true,
					SubSection1 : true,
					Block1:true,
					Section2 : true,
					SubSection2 : true,
					Block2:true,
					ShowMoreBlock2 : true,
					SubSection22 : true,
					Block22:true,
					Section3 : false,
					SubSection3 : false,
					Block3:false
				});
		this.getView().setModel(this.oJsonConfigModel, "ConfigModel");

        // JSON MODEL FOR LAZY LOADING
		var oJsonModel = new sap.ui.model.json.JSONModel("./test-resources/demokit/sample/ObjectPageOnJSONWithLazyLoading/HRData.json");
		this.getView().setModel(oJsonModel, "ObjectPageModel");

	}

});
