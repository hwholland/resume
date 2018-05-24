sap.ui.controller("sap.ui.comp.sample.smartchart.SmartChart", {
	onInit: function() {
		var oModel, oView;
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "sapuicompsmartchart/"
		});
		this._oMockServer = oMockServer;
		oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartchart/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartchart/mockserver/");
		oMockServer.start();
		oModel = new sap.ui.model.odata.ODataModel("sapuicompsmartchart", true);
		oModel.setCountSupported(false);
		oView = this.getView();
		oView.setModel(oModel);
		this.bUseVariants = false;
	},
	onExit: function() {
		this._oMockServer.stop();
	},
	toggleVariantManagement: function() {
		var oButton = this.getView().byId("toggleVariantMangement");
		if (this.bUseVariants) {
			oButton.setText("Enable Variant Management");
			this.getView().byId("withoutVariant").setVisible(true);
			this.getView().byId("withVariant").setVisible(false);
		} else {
			oButton.setText("Disable Variant Management");
			this.getView().byId("withoutVariant").setVisible(false);
			this.getView().byId("withVariant").setVisible(true);
		}
		this.bUseVariants = !this.bUseVariants;

	},

	_getCurrentChart: function() {

		var oSmartChart = null;
		if (this.getView().byId("withoutVariant").getVisible()) {
			oSmartChart = this.getView().byId("ItemsSmartChart");
		} else if (this.getView().byId("withoutVariant").getVisible()) {
			oSmartChart = this.getView().byId("ItemsSmartChart2");
		}

		return oSmartChart;

	},

	toggleButtonList: function() {

		var oSmartChart = this._getCurrentChart();

		if (oSmartChart) {
			if (oSmartChart.__getAvailableChartTypes) {
				oSmartChart._getAvailableChartTypes = oSmartChart.__getAvailableChartTypes;
				delete oSmartChart.__getAvailableChartTypes;
				oSmartChart.setUseListForChartTypeSelection(true);
			} else {
				oSmartChart.__getAvailableChartTypes = oSmartChart._getAvailableChartTypes;
				oSmartChart._getAvailableChartTypes = function() {
					return [
						{
							key: 'bar',
							text: "Bar"
						}, {
							key: "column",
							text: "Column"
						}, {
							key: "donut",
							text: "Donut"
						}
					];
				};
				oSmartChart.setUseListForChartTypeSelection(false);
			}

			oSmartChart._updateVisibilityOfChartTypes(oSmartChart._oSegmentedButton);
		}
	},

	toggleDetailsButton: function() {
		var oSmartChart = this._getCurrentChart();
		
		oSmartChart.setShowDetailsButton(!oSmartChart.getShowDetailsButton());
		oSmartChart.setShowSemanticNavigationButton(!oSmartChart.getShowSemanticNavigationButton());
	},

	toggleDrillBreadcrumbs: function() {
		var oSmartChart = this._getCurrentChart();
		
		oSmartChart.setShowDrillBreadcrumbs(!oSmartChart.getShowDrillBreadcrumbs());
	}
});
