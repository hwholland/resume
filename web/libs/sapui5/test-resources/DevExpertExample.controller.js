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
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);// OneWay, TwoWay, OneTime

			this.getView().setModel(oModel);
			this.getView().setModel(new ResourceModel({
				bundleName: "sap.ui.comp.sample.smartlink.example_DevExpert.i18n.i18n"
			}), "i18n");
		},

		onPressResetModel: function(oEvent) {
			this.getView().getModel().getData().Price = 1000.01;
			this.getView().getModel().refresh(true);
		}
	});
});
