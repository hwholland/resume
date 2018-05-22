// define a root UIComponent which exposes the main view
jQuery.sap.declare("flSmartFormOpa.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

sap.ui.core.UIComponent.extend("flSmartFormOpa.Component", {
	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {

		var app = new sap.m.App({
			initialPage : "idMain1"
		});
		var page = sap.ui.view({
			id : "idMain1",
			viewName : "flSmartFormOpa.view.Main",
			type : sap.ui.core.mvc.ViewType.XML
		});
		app.addPage(page);

		return app;
	}
});