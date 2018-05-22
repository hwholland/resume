sap.ui.controller("sap.ui.comp.sample.smartform.SmartForm", {

	onInit: function() {
		var sURL, oModel;

		var sResourceUrl;
		sResourceUrl = "test-resources/sap/ui/comp/demokit/sample/smartform/i18n/i18n.properties";
		var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
		var oResourceModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: sResourceUrl,
			bundleLocale: sLocale
		});
		this.getView().setModel(oResourceModel, "i18n");
		/*
		 * LRep request are mocked in file: sap.ui.comp.sample.smartform.Component
		 */

		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "smartform.SmartForm/"
		});
		oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartform/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartform/mockserver/");
		oMockServer.start();
		oModel = new sap.ui.model.odata.v2.ODataModel("smartform.SmartForm", true);
		// oModel.setCountSupported(false);
		oModel.setDefaultBindingMode("TwoWay"); // <-- needed to take over changes into model

		this.getView().setModel(oModel);

		var that = this;
		oModel.getMetaModel().loaded().then(function() {
			that.getView().byId("smartForm").bindElement("/Products('1239102')");
		});

	},

	onExit: function() {
		var i;
	}
});
