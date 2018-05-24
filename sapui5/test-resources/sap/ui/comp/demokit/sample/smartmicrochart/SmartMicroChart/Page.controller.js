sap.ui.define([ "sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer" ],
	function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartMicroChart.Page", {
		onInit: function() {
			this._initMockServer();
			var oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);
			this.getView().setModel(oModel);

			var oSmartChart = this.getView().byId("smartChartBullet");
			oSmartChart.setUnitOfMeasure(this.getView().byId("unitLabelBullet"));
			oSmartChart.setChartTitle(this.getView().byId("titleLabelBullet"));
			oSmartChart.setChartDescription(this.getView().byId("descriptionLabelBullet"));
			this.getView().byId("titleLabelBullet").bindElement("/Products('PC')");
			this.getView().byId("descriptionLabelBullet").bindElement("/Products('PC')");
			this.getView().byId("unitLabelBullet").bindElement("/Products('PC')");

			oSmartChart = this.getView().byId("smartChartArea");
			oSmartChart.setUnitOfMeasure(this.getView().byId("unitLabelArea"));
			oSmartChart.setChartTitle(this.getView().byId("titleLabelArea"));
			oSmartChart.setChartDescription(this.getView().byId("descriptionLabelArea"));
		},

		onExit : function() {
			this._oMockServer.stop();
		},

		_initMockServer : function() {
			this._oMockServer = new MockServer({
				rootUri : "smartmicrochart.SmartMicroChart/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/mockserver/metadata.xml", {
				sMockdataBaseUrl : "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/mockserver"
			});

			this._oMockServer.start();
		}
	});
});