sap.ui.controller("sap.ui.comp.sample.personalization.exampleForTreeTableWithOData.TreeTable", {
	onInit: function() {
		jQuery.sap.require("sap.ui.core.util.MockServer");

		var oModel;

		this.oMockServer = new sap.ui.core.util.MockServer({

			/**
			 * take attention for the content in rootUri -> this value has to be unique as otherwise the MockServer will crash IF more then one MockServer instances (from other tests)
			 * listen for the same rootUri! It can only listen one MockServer instance to one unique rootUri for HTTP requests.
			 */
			rootUri: "tree/"
		});

		// Create requests for different types of protocols
		this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/personalization/exampleForTreeTableWithOData/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/personalization/exampleForTreeTableWithOData/mockserver/");
		this.oMockServer.start();

		oModel = new sap.ui.model.odata.v2.ODataModel("tree", true);
		this.getView().setModel(oModel);
	},
	onExit: function() {
		this.oMockServer.stop();
	}
});
