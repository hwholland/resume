sap.ui.controller("sap.ui.comp.sample.VariantManagement.example1.VariantManagement", {

	onSave: function(oEvent) {
		"use strict";
		jQuery.sap.require("sap.m.MessageToast");
		var params = oEvent.getParameters();
		var sMessage = "New Name: " + params.name + "\nDefault: " + params.def + "\nOverwrite:" + params.overwrite + "\nSelected Item Key: " + params.key;
		sap.m.MessageToast.show(sMessage);
	},
	onManage: function(oEvent) {
		"use strict";
		jQuery.sap.require("sap.m.MessageToast");
		var params = oEvent.getParameters();
		var renamed = params.renamed;
		var deleted = params.deleted;
		var sMessage = "renamed: \n";
		for (var h = 0; h < renamed.length; h++) {
			sMessage += renamed[h].key + "=" + renamed[h].name + "\n";
		}
		sMessage += "\n\ndeleted: ";
		for (var f = 0; f < deleted.length; f++) {
			sMessage += deleted[f] + ",";
		}

		sap.m.MessageToast.show(sMessage);
	},
	onSelect: function(oEvent) {
		"use strict";
		var params = oEvent.getParameters();
		var sMessage = "New Variant Selected: " + params.key;
		sap.m.MessageToast.show(sMessage);
	}
});