jQuery.sap.require("sap/m/MessageBox");

sap.ui.controller("sap.ui.comp.sample.smartcontrols.Example", {

	
	onInit: function() {
		jQuery.sap.require("sap.ui.core.util.MockServer");
		
		this.oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "demokit.smartcontrols/"
		});
		sap.ui.core.util.MockServer.config({
			autoRespond: true,
			autoRespondAfter: 100
		});
		this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartcontrols/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartcontrols/mockserver/");
		this.oMockServer.start();

		// create and set ODATA Model
		this.oModel = new sap.ui.model.odata.ODataModel("demokit.smartcontrols", true);
		this.getView().setModel(this.oModel);
		
		this.getView().byId("smartTable")
		
		
	},
	onTableInitialized : function() {
		return;
		var that = this;
		this.getView().byId("smartTable").getTable().attachRowSelectionChange(function(oEvent) {
			if (oEvent.getSource().getSelectedIndices().length === 1 && oEvent.getParameter("rowContext")) {
				that.getView().byId("smartForm").bindElement(oEvent.getParameter("rowContext").getPath());
				that.getView().byId("smartForm").setVisible(true);
			} else {
				that.getView().byId("smartForm").unbindElement();
				that.getView().byId("smartForm").setVisible(false);
			}
		})
		
	},
	onNavigationTargetsObtained: function(oEvent) {
		var oParameters = oEvent.getParameters();
		var oSemanticAttributes = oParameters.semanticAttributes;
		if (oSemanticAttributes.SemanticObjectCategory === "Projector") {
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				text: "Homepage",
				href: "http://www.sap.com",
				target: "_blank"
			}), [
				new sap.ui.comp.navpopover.LinkData({
					text: "Edit"
				})
			], new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: oSemanticAttributes.SemanticObjectName
					}), new sap.m.Image({
						src: "test-resources/sap/ui/demokit/explored/img/HT-6100.jpg", //oSemanticAttributes.ProductPicUrl,
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
		} else if (oSemanticAttributes.SemanticObjectCategory === "Printer"){
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				text: "Homepage",
				href: "http://www.sap.com",
				target: "_blank"
			}), [
				new sap.ui.comp.navpopover.LinkData({
					text: "Edit"
				})
			], new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: oSemanticAttributes.SemanticObjectName
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
		}
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
		document.location.href = "http://wdfn32183811a:1080/uilib-sample/explored.html#/sample/sap.ui.comp.sample.smartform/preview"
	},

	onExit: function() {
		this.oMockServer.stop();
		this.oModel.destroy();
	}
});
