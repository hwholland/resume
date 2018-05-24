jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");

sap.ui.controller("sap.ui.comp.sample.smartfield.SmartField", {

	onInit: function() {
		var sURL, oModel, oView;

		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "smartfield.SmartField/"
		});
		oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartfield/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartfield/mockserver/");
		oMockServer.start();
		oModel = new sap.ui.model.odata.v2.ODataModel("smartfield.SmartField", true);
		// oModel.setCountSupported(false);
		oModel.setDefaultBindingMode("TwoWay"); // <-- needed to take over changes into model

		oView = this.getView();
		oView.setModel(oModel);
		oView.bindElement("/Products('1239102')");
	},

	onChangeEditMode: function(oEvent) {
		var oView = this.getView();
		var bFlag = !oView.byId("idCategory").getContextEditable();

		oView.byId("idProductId").setContextEditable(bFlag);
		oView.byId("idName").setContextEditable(bFlag);
		oView.byId("idCategory").setContextEditable(bFlag);
		oView.byId("idDescription").setContextEditable(bFlag);
		oView.byId("idPrice").setContextEditable(bFlag);
		oView.byId("idStatus").setContextEditable(bFlag);
		oView.byId("idQuantity").setContextEditable(bFlag);
		oView.byId("idPassword").setContextEditable(bFlag);
	},

	onChangeEnabledMode: function(oEvent) {
		var oView = this.getView();
		var bFlag = !oView.byId("idCategory").getEnabled();

		oView.byId("idProductId").setEnabled(bFlag);
		oView.byId("idName").setEnabled(bFlag);
		oView.byId("idCategory").setEnabled(bFlag);
		oView.byId("idDescription").setEnabled(bFlag);
		oView.byId("idPrice").setEnabled(bFlag);
		oView.byId("idStatus").setEnabled(bFlag);
		oView.byId("idQuantity").setEnabled(bFlag);
		oView.byId("idPassword").setEnabled(bFlag);
	}

});
