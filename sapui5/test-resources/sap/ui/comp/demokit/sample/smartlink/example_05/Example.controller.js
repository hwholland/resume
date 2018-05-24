sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/comp/sample/smartlink/example_05/formatter", "sap/ui/comp/sample/smartlink/RegisterMockForCrossApplicationNavigation"
], function(Controller, JSONModel, formatter, RegisterMockForCrossApplicationNavigation) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlink.example_05.Example", {

		RegisterMockForCrossApplicationNavigation: RegisterMockForCrossApplicationNavigation,

		formatter: formatter,

		onInit: function() {

			jQuery.sap.require("sap.ui.core.util.MockServer");
			this.oMockServer = new sap.ui.core.util.MockServer({
				rootUri: "demokit.smartlink.example_05/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_05/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_05/mockserver/");
			this.oMockServer.start();

			// Create and set ODATA Model
			this.oModel = new sap.ui.model.odata.ODataModel("demokit.smartlink.example_05", true);
			this.getView().setModel(this.oModel);
			this.getView().bindElement("/ProductCollection('1239102')");
		},

		onNavigationTargetsObtainedMainAndContent: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet",
				target: "_blank"
			}), null, new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: "Detailed information"
					}), new sap.m.Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		},

		onNavigationTargetsObtainedMainAndAction: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet",
				target: "_blank"
			}), [
				new sap.ui.comp.navpopover.LinkData({
					href: "#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
					text: "Application Specific Link",
					target: "_blank"
				})
			]);
		},

		onNavigationTargetsObtainedContentAndAction: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", null, [
				new sap.ui.comp.navpopover.LinkData({
					href: "#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
					text: "Application Specific Link",
					target: "_blank"
				})
			], new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: "Detailed information"
					}), new sap.m.Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		},

		onNavigationTargetsObtainedOnlyContent: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", null, null, new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: "Detailed information"
					}), new sap.m.Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		},

		onPrefetchDone: function(oEvent) {
			if (true) {
			}
		},

		onNavigationTargetsObtainedOnlyMain: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet"
			}), null, null);
		},

		onBeforePopoverOpens: function(oEvent) {
			var oParameters = oEvent.getParameters();
			var oDeferred = jQuery.Deferred();
			setTimeout(function() {
				oParameters.open();
				oDeferred.resolve();
			}, 500);
			return oDeferred.promise();
		},

		onExit: function() {
			this.oMockServer.stop();
			this.oModel.destroy();
		}
	});
});
