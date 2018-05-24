sap.ui.controller("sap.ui.comp.sample.smarttable.smarttablesmartmicrochart.App", {
	onInit: function() {
		this._initMockServer();
		var oModel = new sap.ui.model.odata.v2.ODataModel("sap.ui.comp.sample.smarttable.smarttablesmartmicrochart", true);
		var oView = this.getView();
		oView.setModel(oModel);
	},

	onExit: function() {
		this._oMockServer.stop();
	},

	_initMockServer: function() {
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "sap.ui.comp.sample.smarttable.smarttablesmartmicrochart/"
		});
		this._oMockServer = oMockServer;
		this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smarttable/smarttablesmartmicrochart/mockserver/metadata.xml", {
			sMockdataBaseUrl : "test-resources/sap/ui/comp/demokit/sample/smarttable/smarttablesmartmicrochart/mockserver"
		});
		oMockServer.start();
	},
	
	onBeforeRebindTable: function(oEvent) {
		var bindingParams = oEvent.getParameter("bindingParams");
		bindingParams.parameters.select += ",Revenue,TargetRevenue,ForecastRevenue,DeviationRangeLow,DeviationRangeHigh,ToleranceRangeLow,ToleranceRangeHigh,MinValue,MaxValue";
	}
});
