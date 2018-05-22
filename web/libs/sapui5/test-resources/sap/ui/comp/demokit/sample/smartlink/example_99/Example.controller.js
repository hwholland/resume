sap.ui.controller("sap.ui.comp.sample.smartlink.example_99.Example", {

	onInit: function() {
		// ---- FLP server -----------------------------------------------------------
		jQuery.sap.require("sap.ui.core.util.MockServer");
		this.oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "demokit.smartlink.example_99/"
		});
		this.oMockServer.simulate("../../../../../test-resources/sap/ui/comp/demokit/sample/smartlink/example_99/mockserver/metadata.xml", "../../../../../test-resources/sap/ui/comp/demokit/sample/smartlink/example_99/mockserver/");
		this.oMockServer.start();

		// create and set ODATA Model
		this.oModel = new sap.ui.model.odata.ODataModel("demokit.smartlink.example_99", true);
		this.getView().setModel(this.oModel);
		this.getView().bindElement("/ProductCollection('1239102')");

// // ---- Local server -----------------------------------------------------------
// jQuery.sap.require("sap.ui.core.util.MockServer");
// this.oMockServer = new sap.ui.core.util.MockServer({
// rootUri: "demokit.smartlink.example_99/"
// });
// this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_99/mockserver/metadata.xml",
// "test-resources/sap/ui/comp/demokit/sample/smartlink/example_99/mockserver/");
// this.oMockServer.start();
//
// // Mock the ushell services
// jQuery.sap.require("sap.ui.comp.sample.smartlink.Util");
// sap.ui.comp.sample.smartlink.Util.mockUShellServices({
// ProductCollection: {
// action: "displayFactSheet",
// links: [
// {
// intent: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
// text: "Fact Sheet"
// }, {
// intent: "#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
// text: "Show product"
// }
// ]
// }
// });
//
// // create and set ODATA Model
// this.oModel = new sap.ui.model.odata.ODataModel("demokit.smartlink.example_99", true);
// this.getView().setModel(this.oModel);
// this.getView().bindElement("/ProductCollection('1239102')");
	},

	onExit: function() {
		this.oMockServer.stop();
		this.oModel.destroy();
	}
});
