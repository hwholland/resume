sap.ui.define(['sap/ui/core/UIComponent', 'sap/ui/core/mvc/View'],
	function(UIComponent, View) {
	"use strict";

	var Component = UIComponent.extend("applicationUnderTestPerf.Component", {

		createContent : function () {
			return sap.ui.view({
				viewName : "view.Main",
				type : sap.ui.core.mvc.ViewType.XML
			});
		}

	});

	return Component;

});
