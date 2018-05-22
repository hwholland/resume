sap.ui.define([], function() {
	"use strict";
	var formatter = {
		addTax: function(sNettoPrice) {
			var fBruttoPrice = sap.ui.core.format.NumberFormat.getFloatInstance().parse(sNettoPrice) * 1.19;
			return sap.ui.core.format.NumberFormat.getFloatInstance().format(fBruttoPrice);
		}
	}
	return formatter;
}, /* bExport= */true);
