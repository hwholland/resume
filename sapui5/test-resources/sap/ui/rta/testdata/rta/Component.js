sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/fl/FakeLrepConnector",
	"sap/ui/rta/util/FakeLrepConnectorLocalStorage"
], function(
	UIComponent,
	FakeLrepConnector,
	FakeLrepConnectorLocalStorage) {

	"use strict";

	return UIComponent.extend("sap.ui.rta.test.Component", {

		metadata: {
			manifest: "json"
		},


		init : function() {
			this._bShowAdaptButton = this.getComponentData().showAdaptButton ? this.getComponentData().showAdaptButton : false;
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		},

		/**
		 * Initialize the application
		 * 
		 * @returns {sap.ui.core.Control} the content
		 */
		createContent : function() {

			// app specific setup
			this._createFakeLrep();

			var oApp = new sap.m.App();

			var oModel = new sap.ui.model.json.JSONModel({
				showAdaptButton : this._bShowAdaptButton
			});

			var oPage = sap.ui.view("idMain1", {
				viewName : "sap.ui.rta.test.ComplexTest",
				type : sap.ui.core.mvc.ViewType.XML
			});

			oPage.setModel(oModel, "view");

			oApp.addPage(oPage);

			return oApp;

		},

		/**
		 * Create the FakeLrep with localStorage
		 * @private
		 */
		_createFakeLrep: function () {
			
			if (/[&?](sap-rta-clear-cache-lrep=(true|x)[&#]?)+/i.test(window.location.search)) {
				
				jQuery.extend(FakeLrepConnector.prototype, FakeLrepConnectorLocalStorage);
				FakeLrepConnector.deleteChanges();
			}
			
			if (/[&?](sap-rta-mock-lrep=(true|x)[&#]?)+/i.test(window.location.search)) {
				
				jQuery.extend(FakeLrepConnector.prototype, FakeLrepConnectorLocalStorage);
				FakeLrepConnector.enableFakeConnector(jQuery.sap.getModulePath("sap.ui.rta.test.FakeLrepConnector") + ".json");
			}
		}

	});
});