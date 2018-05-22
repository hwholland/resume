sap.ui.controller("sap.ui.comp.sample.smarttable.SmartTable", {
	onInit: function() {
		var oModel, oView;
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "sapuicompsmarttable/"
		});
		this._oMockServer = oMockServer;
		oMockServer.simulate("./mockserver/metadata.xml", "./mockserver/");
		oMockServer.start();
		oModel = new sap.ui.model.odata.ODataModel("sapuicompsmarttable", true);
		oModel.setCountSupported(false);
		oView = this.getView();
		oView.setModel(oModel);
		this.oData = null;
		this.getView().byId('smartFilterBar').search();

		this.getView().byId('smartFilterBar').attachPendingChange(function(oEvent) {
			if (oEvent.getParameter("pendingValue") === false)
			sap.m.MessageToast.show("PendingValue is false");
		});

	},
	onExit: function() {
		this._oMockServer.stop();
	},
	serializeFilterData: function() {
		this.oData = this.getView().byId('smartFilterBar').fetchVariant(true);
		this.getView().byId('debugtext').setText(JSON.stringify(this.oData));
	},
	deserializeFilterData: function() {
		if (this.oData) {
			var oSmartFilterbar = this.getView().byId('smartFilterBar');
			oSmartFilterbar.applyVariant(this.oData,true);

			sap.m.MessageToast.show("isPending() = " + oSmartFilterbar.isPending());
		}
	},
	serializeDataSuiteFormat: function() {
		this.oDSData = this.getView().byId('smartFilterBar').getDataSuiteFormat();
		this.getView().byId('debugtext').setText(this.oDSData);
	},
	deserializeDataSuiteFormat: function() {
		if (this.oDSData) {
			var oSmartFilterbar = this.getView().byId('smartFilterBar');
			oSmartFilterbar.setDataSuiteFormat(this.oDSData);

			sap.m.MessageToast.show("isPending() = " + oSmartFilterbar.isPending());
		}
	},

	toggleTimeHandling: function() {
		var oSmartFilterbar = this.getView().byId('smartFilterBar');
		var oConditionType = oSmartFilterbar.getConditionTypeByKey("BLDAT");
		oConditionType.setIgnoreTime(!oConditionType.getIgnoreTime());
	},

	handleFilterChange: function(oEvent) {

	}

});
