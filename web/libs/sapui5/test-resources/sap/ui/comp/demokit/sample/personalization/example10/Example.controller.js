sap.ui.controller("sap.ui.comp.sample.personalization.example10.Example", {
	
	onInit: function() {
		// enable 'mock' variant management
		jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
		sap.ui.fl.FakeLrepConnector.enableFakeConnector("test-resources/sap/ui/comp/demokit/sample/personalization/example10/mockserver/component-test-changes.json");
		
		jQuery.sap.require("sap.ui.core.util.MockServer");
		this.oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "demokit.personalization.example10/"
		});
		this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/personalization/example10/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/personalization/example10/mockserver/");
		this.oMockServer.start();

		this.oModel = new sap.ui.model.odata.v2.ODataModel("demokit.personalization.example10", true);
		this.getView().setModel(this.oModel);
	},
	
	onExit: function() {
		this.oMockServer.stop();
		this.oModel.destroy();
	}
});
