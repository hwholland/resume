sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", 'sap/ui/model/resource/ResourceModel', "./formatter"
], function(Controller, JSONModel, ResourceModel, formatter) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlink.example_DevExpert.Example", {

		formatter: formatter,

		onInit: function() {
			var oModel = new JSONModel({
				Price: 1000.01
			});
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			this.getView().setModel(oModel);
		},

		onPressResetModel: function(oEvent) {
			this.getView().getModel().getData().Price = 1000.01;
			this.getView().getModel().refresh(true);
		}
	});
});
