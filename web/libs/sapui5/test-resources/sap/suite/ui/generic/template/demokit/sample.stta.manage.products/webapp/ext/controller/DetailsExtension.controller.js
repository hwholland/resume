sap.ui.controller("STTA_MP.ext.controller.DetailsExtension", {
	onObjectPageCustomAction: function() {
		sap.m.MessageBox.success("Hello from ObjectPage custom action!", {});
	},
	onMySmartTableValidation: function() {
		var aDescriptions = this.extensionAPI.getSelectedContexts("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table");
		for (var i = 0; i < aDescriptions.length; i++) {
			if (aDescriptions[i].getProperty("ActiveLanguage") !== "EN") {
				sap.m.MessageBox.success("Language " + aDescriptions[i].getProperty("ActiveLanguage") + " not yet supported", {});
				return;
			}
		}
	}
});