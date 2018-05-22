/*global location*/
sap.ui.define([
	"sap/ui/rta/test/Demo/ObjectPage/controller/BaseController",
	"sap/ui/rta/RuntimeAuthoring"
], function(BaseController, RTA) {
	"use strict";

	return BaseController.extend("sap.ui.rta.test.Demo.ObjectPage.controller.Detail", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		
		onInit: function() {
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