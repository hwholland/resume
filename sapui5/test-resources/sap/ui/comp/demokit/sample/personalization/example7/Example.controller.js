sap.ui.controller("sap.ui.comp.sample.personalization.example7.Example", {

	onInit: function() {
		// enable 'mock' variant management
		jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
		sap.ui.fl.FakeLrepConnector.enableFakeConnector("test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/component-test-changes.json");

		jQuery.sap.require("sap.ui.core.util.MockServer");
		this.oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "demokit.personalization.example7/"
		});
		this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/");
		this.oMockServer.start();

		// create and set ODATA Model
		this.oModel = new sap.ui.model.odata.ODataModel("demokit.personalization.example7", true);
		this.getView().setModel(this.oModel);
	},

	onExit: function() {
		this.oMockServer.stop();
		this.oModel.destroy();
	}
});
