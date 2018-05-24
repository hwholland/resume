sap.ui.controller("sap.ui.comp.sample.filterbar.example1.FilterBar", {

	onReset: function(oEvent) {
		jQuery.sap.require("sap.m.MessageToast");
		// var params = oEvent.getParameters();
		var sMessage = "onReset trigered";
		sap.m.MessageToast.show(sMessage);
	},
	onSearch: function(oEvent) {
		jQuery.sap.require("sap.m.MessageToast");
		// var params = oEvent.getParameters();
		var sMessage = "onSearch trigered";
		sap.m.MessageToast.show(sMessage);
	}

});