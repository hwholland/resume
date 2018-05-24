sap.ui.define(function() {
	"use strict";

	var Controller = sap.ui.core.mvc.Controller.extend("sap.ui.demo.chartdemo.util.Controller", {
		getEventBus : function () {
			return this.getOwnerComponent().getEventBus();
		},

		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}
	});

	return Controller;

});
