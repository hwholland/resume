sap.ui.controller("sap.ui.comp.sample.personalization.example1.Example", {

	onInit: function() {
		// enable 'mock' variant management
		jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
		sap.ui.fl.FakeLrepConnector.enableFakeConnector("test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/component-test-changes.json");

		jQuery.sap.require("sap.ui.core.util.MockServer");
		this.oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "demokit.personalization.example1/"
		});
		this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/personalization/mockserver/");
		this.oMockServer.start();

		// create and set ODATA Model
		this.oModel = new sap.ui.model.odata.ODataModel("demokit.personalization.example1", true);
		this.getView().setModel(this.oModel);
	},

	onBeforeRebindTable: function(oEvent) {
		var mBindingParams = oEvent.getParameter("bindingParams");
		var oDataModel = oEvent.getSource().getModel();
		mBindingParams.sorter.forEach(function(oSorter) {
			if (oSorter.vGroup) {
				oSorter.fnGroup = function(oContext) {
					var oValue = oContext.getProperty(oSorter.sPath);
					var oData = oContext.getProperty(oContext.getPath());
					var sColumnLabel = oDataModel.getProperty('/#' + oData.__metadata.type + '/' + oSorter.sPath + '/@sap:label');
					return {
						key: (oSorter.sPath === "Date" ? oValue.toDateString() : oValue),
						text: sColumnLabel + ": " + (oSorter.sPath === "Date" ? oValue.toDateString() : oValue)
					};
				};
			}
		});
	},

	onExit: function() {
		this.oMockServer.stop();
		this.oModel.destroy();
	}
});
