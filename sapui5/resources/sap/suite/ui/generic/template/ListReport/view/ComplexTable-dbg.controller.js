sap.ui.define(["sap/suite/ui/generic/template/lib/TemplateAssembler",
		"sap/suite/ui/generic/template/ListReport/controller/ControllerImplementation"], function(TemplateAssembler,
		ControllerImplementation) {
	"use strict";

	return TemplateAssembler.getTemplateController(ControllerImplementation.getMethods,
			"sap.suite.ui.generic.template.ListReport.view.ComplexTable", {
				getVisibleSelectionsWithDefaults: function() {
					// We need a list of all selection fields in the SmartFilterBar for which defaults are defined
					// (see method setSmartFilterBarDefaults) and which are currently visible.
					// This is needed by _getBackNavigationParameters in the NavigationController.
					var aVisibleFields = [];
					// if(this.oView.byId(this.sPrefix + ".DateKeyDate").getVisible()){
					// aVisibleFields.push("KeyDate");
					// }
					return aVisibleFields;
				},

				// ---------------------------------------------
				// Extensions
				// ---------------------------------------------
				onInitSmartFilterBarExtension: function(oEvent) {
				},
				getCustomAppStateDataExtension: function(oCustomData) {
				},
				restoreCustomAppStateDataExtension: function(oCustomData) {
				},
				onBeforeRebindTableExtension: function(oEvent) {
				}
			});
}, /* bExport= */true);