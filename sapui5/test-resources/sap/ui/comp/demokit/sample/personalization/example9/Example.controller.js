jQuery.sap.require("sap/m/MessageBox");

sap.ui.controller("sap.ui.comp.sample.personalization.example9.Example", {

	onInit: function() {
		// enable 'mock' variant management
		jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
		sap.ui.fl.FakeLrepConnector.enableFakeConnector("test-resources/sap/ui/comp/demokit/sample/personalization/example9/mockserver/component-test-changes.json");

		jQuery.sap.require("sap.ui.core.util.MockServer");
		this.oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "demokit.personalization.example9/"
		});
		this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/personalization/example9/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/personalization/example9/mockserver/");
		this.oMockServer.start();

		// create and set ODATA Model
		this.oModel = new sap.ui.model.odata.ODataModel("demokit.personalization.example9", true);
		this.getView().setModel(this.oModel);
	},

	onNavigationTargetsObtained: function(oEvent) {
		var oParameters = oEvent.getParameters();
		var oSemanticAttributes = oParameters.semanticAttributes;

		oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
			text: "Homepage",
			href: "http://www.sap.com",
			target: "_blank"
		}), [
			new sap.ui.comp.navpopover.LinkData({
				text: "Go to shopping cart"
			})
		], new sap.ui.layout.form.SimpleForm({
			maxContainerCols: 1,
			content: [
				new sap.ui.core.Title({
					text: "Product description"
				}), new sap.m.Image({
					src: "test-resources/sap/ui/demokit/explored/img/HT-1052.jpg", //oSemanticAttributes.ProductPicUrl,
					densityAware: false,
					width: "50px",
					height: "50px",
					layoutData: new sap.m.FlexItemData({
						growFactor: 1
					})
				}), new sap.m.Text({
					text: oSemanticAttributes.Description
				})
			]
		}));
	},

	onNavigate: function(oEvent) {
		var oParameters = oEvent.getParameters();
		if (oParameters.text === "Homepage") {
			return;
		}
		sap.m.MessageBox.show(oParameters.text + " has been pressed", {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: "SmartChart demo",
			actions: [
				sap.m.MessageBox.Action.OK
			]
		});
	},

	onExit: function() {
		this.oMockServer.stop();
		this.oModel.destroy();
	}
});
