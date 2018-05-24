/*global location*/
sap.ui.define([
	"sap/ui/rta/test/Demo/controller/BaseController",
	"sap/ui/rta/RuntimeAuthoring"
], function(BaseController, RTA) {
	"use strict";

	return BaseController.extend("sap.ui.rta.test.Demo.controller.Detail", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		
		onInit: function() {
			
			this.getView().byId("page").bindElement("/SalesOrders('5001656')");
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		
		switchToAdaptionMode : function() {
			
			var oRta = new RTA({
				rootControl : this.getOwnerComponent().getAggregation("rootControl")
			});
			oRta.start();
		}
	});

});