sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/comp/sample/smartlink/RegisterMockForCrossApplicationNavigation"
], function(Controller, JSONModel, RegisterMockForCrossApplicationNavigation) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlink.example_02.Example", {

		RegisterMockForCrossApplicationNavigation: RegisterMockForCrossApplicationNavigation,

		onInit: function() {
			jQuery.sap.require("sap.ui.core.util.MockServer");
			this.oMockServer = new sap.ui.core.util.MockServer({
				rootUri: "demokit.smartlink.example_02/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_02/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_02/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new sap.ui.model.odata.ODataModel("demokit.smartlink.example_02", true);
			var oView = this.getView();
			oView.setModel(this.oModel);
			oView.bindElement("/ProductCollection('1239102')");

			jQuery.sap.require("sap.ui.comp.navpopover.SemanticObjectController");
			sap.ui.comp.navpopover.SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {
				oView.byId("IDButtonOfName").setEnabled(sap.ui.comp.navpopover.SemanticObjectController.hasDistinctSemanticObject("demokit_smartlink_example_02_SemanticObjectName", oSemanticObjects));
				oView.byId("IDImageOfName").setVisible(sap.ui.comp.navpopover.SemanticObjectController.hasDistinctSemanticObject("demokit_smartlink_example_02_SemanticObjectName", oSemanticObjects));

				oView.byId("IDButtonOfProductId").setEnabled(sap.ui.comp.navpopover.SemanticObjectController.hasDistinctSemanticObject("demokit_smartlink_example_02_SemanticObjectProductId", oSemanticObjects));
				oView.byId("IDImageOfProductId").setVisible(sap.ui.comp.navpopover.SemanticObjectController.hasDistinctSemanticObject("demokit_smartlink_example_02_SemanticObjectProductId", oSemanticObjects));

				oView.byId("IDButtonOfCategory").setEnabled(sap.ui.comp.navpopover.SemanticObjectController.hasDistinctSemanticObject("demokit_smartlink_example_02_SemanticObjectCategory", oSemanticObjects));
				oView.byId("IDImageOfCategory").setVisible(sap.ui.comp.navpopover.SemanticObjectController.hasDistinctSemanticObject("demokit_smartlink_example_02_SemanticObjectCategory", oSemanticObjects));
			});
		},

		onPressButton: function(oEvent) {
			var oSetting = this._getSetting(oEvent.getSource());
			jQuery.sap.require("sap.ui.comp.navpopover.NavigationPopoverHandler");
			var oLinkHandler = new sap.ui.comp.navpopover.NavigationPopoverHandler({
				semanticObject: oSetting.semanticObject,
				semanticObjectLabel: oSetting.label,
				fieldName: oSetting.fieldName,
				control: oEvent.getSource(),
				beforePopoverOpens: function(oEvent_) {
					var oParameters = oEvent_.getParameters();
					var oDeferred = jQuery.Deferred();
					setTimeout(function() {
						oParameters.semanticAttributes[oSetting.semanticObject] = oSetting.modifiedAttribute;
						oParameters.setSemanticAttributes(oParameters.semanticAttributes);
						oParameters.open();
						oDeferred.resolve();
					}, 0);
					return oDeferred.promise();
				},
				navigationTargetsObtained: function(oEvent_) {
					var oParameters = oEvent_.getParameters();
					var oDeferred = jQuery.Deferred();
					setTimeout(function() {
						oParameters.show();
						oDeferred.resolve();
					}, 0);
					return oDeferred.promise();
				}
			});
			oLinkHandler._getPopover().then(function(oPopover) {
				var oLink = oPopover.getDirectLink();
				if (oLink) {
					window.location.href = oLink.getHref();
				} else {
					oPopover.show();
				}
			}, function(oError) {
				window.console.log("NavigationPopover could not be determined");
			});
		},

		onPressImage: function(oEvent) {
			var oSetting = this._getSetting(oEvent.getSource());
			jQuery.sap.require("sap.ui.comp.navpopover.NavigationPopoverHandler");
			var oLinkHandler = new sap.ui.comp.navpopover.NavigationPopoverHandler({
				semanticObject: oSetting.semanticObject,
				semanticObjectLabel: oSetting.label,
				fieldName: oSetting.fieldName,
				control: oEvent.getSource()
			});
			oLinkHandler._getPopover().then(function(oPopover) {
				var oLink = oPopover.getDirectLink();
				if (oLink) {
					window.location.href = oLink.getHref();
				} else {
					oPopover.show();
				}
			});
		},

		_getSetting: function(oControl) {
			switch (oControl.getId()) {
				case this.getView().getId() + "--IDButtonOfName":
				case this.getView().getId() + "--IDImageOfName":
					return {
						semanticObject: "demokit_smartlink_example_02_SemanticObjectName",
						fieldName: "Name",
						label: "Name",
						modifiedAttribute: "Modified Name"
					};
				case this.getView().getId() + "--IDButtonOfProductId":
				case this.getView().getId() + "--IDImageOfProductId":
					return {
						semanticObject: "demokit_smartlink_example_02_SemanticObjectProductId",
						fieldName: "ProductId",
						label: "Product ID",
						modifiedAttribute: "Modified Product ID"
					};
				case this.getView().getId() + "--IDButtonOfCategory":
				case this.getView().getId() + "--IDImageOfCategory":
					return {
						semanticObject: "demokit_smartlink_example_02_SemanticObjectCategory",
						fieldName: "Category",
						label: "Category",
						modifiedAttribute: "Modified Category"
					};
			}
		},

		onExit: function() {
			this.oMockServer.stop();
			this.oModel.destroy();
		}
	});
});
