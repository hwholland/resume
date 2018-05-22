jQuery.sap.require("sap.ui.model.json.JSONModel");

sap.ui.controller("sap.uxap.testkit.ObjectPageLayoutColumn", {

	onInit : function () {
 		this.oJsonConfigModel = new sap.ui.model.json.JSONModel(
				{
					subSectionLayout : "TitleOnTop"
				});
		this.getView().setModel(this.oJsonConfigModel, "ConfigModel");
		this.isTitleOnTop = true;
	},

	toggleTitle : function () {
		this.isTitleOnTop = !(this.isTitleOnTop);
		this.oJsonConfigModel.setProperty("/subSectionLayout", this.isTitleOnTop ? "TitleOnTop" : "TitleOnLeft");
	}

});
