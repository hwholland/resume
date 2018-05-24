sap.ui.controller("sap.ui.comp.sample.smarttable.SmartTable", {
	onInit: function() {
		jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
		jQuery.sap.require("sap.ui.rta.util.FakeLrepConnectorLocalStorage");
		
		jQuery.extend(sap.ui.fl.FakeLrepConnector.prototype, sap.ui.rta.util.FakeLrepConnectorLocalStorage);
		sap.ui.fl.FakeLrepConnector.enableFakeConnector("FakeLrepConnector.json");
		
		
		var oModel, oView;
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "sapuicompsmarttable/"
		});
		this._oMockServer = oMockServer;
		oMockServer.simulate("./mockserver/metadata.xml");
		oMockServer.start();
		oModel = new sap.ui.model.odata.ODataModel("sapuicompsmarttable", true);
		oModel.setCountSupported(false);
		oView = this.getView();
		oView.setModel(oModel);
	},
	onExit: function() {
		this._oMockServer.stop();
	},
	switchToAdaptionMode: function() {
		jQuery.sap.require("sap.ui.rta.RuntimeAuthoring");
		var oRta = new sap.ui.rta.RuntimeAuthoring({
			rootControl : this.getOwnerComponent().getAggregation("rootControl")
		});
		oRta.start();
	}
});
