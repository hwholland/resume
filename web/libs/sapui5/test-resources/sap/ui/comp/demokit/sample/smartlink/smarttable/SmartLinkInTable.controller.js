sap.ui.controller("sap.ui.comp.sample.smartlink.smarttable.SmartLinkInTable", {

	onInit: function() {
		"use strict";
		var oModel, oView;

		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "foo/"
		});
		oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/smarttable/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/smarttable/mockserver/");
		oMockServer.start();
		oModel = new sap.ui.model.odata.ODataModel("foo", true);
		oModel.setCountSupported(false);
		oView = this.getView();
		oView.setModel(oModel);
	},
	
	onNavTargetsObtained: function(oEvent){
		"use strict";
		var oParameters = oEvent.getParameters();
		
		var oForm = new sap.ui.layout.form.SimpleForm({
			maxContainerCols: 1
		});
		
		oForm.addContent(new sap.ui.core.Title({
			text: "Extra content"
		}));		
		
		var oText = new sap.m.Text({text: "The links shown in this dialog where created by registering the SemanticObjectControllers' events. In a unified shell, the links would be loaded from the 'CrossApplicationNavigation' service."});
		oForm.addContent(oText);
		
		oParameters.show("SAP Explored", new sap.ui.comp.navpopover.LinkData({text: "Main Navigation", href:" "}), 
				[
				 new sap.ui.comp.navpopover.LinkData({text: "Link 1"}),
				 new sap.ui.comp.navpopover.LinkData({text: "Link 2"}),
				 new sap.ui.comp.navpopover.LinkData({text: "Link 3"})
				 ],
				 oForm);
	},
	
	onNavigate: function(oEvent){
		"use strict";
		var oParameters = oEvent.getParameters();
		sap.m.MessageBox.show(oParameters.text + " has been pressed!", { icon: sap.m.MessageBox.Icon.INFORMATION, title: "SmartLink demo", actions: [sap.m.MessageBox.Action.OK] });
		
	}
});
