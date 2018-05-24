// Mock the ushell services
jQuery.sap.require("sap.ui.comp.sample.smartlink.Util");
sap.ui.comp.sample.smartlink.Util.mockUShellServices({
	demokit_smartlink_example_01_SemanticObjectName: {
		links: [
			{
				action: "displayFactSheet",
				intent: "?demokit_smartlink_example_01_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Fact Sheet"
			}, {
				action: "anyAction",
				intent: "?demokit_smartlink_example_01_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
				text: "Show product"
			}
		]
	},
	demokit_smartlink_example_02_SemanticObjectName: {
		links: [
			{
				action: "displayFactSheet",
				intent: "?demokit_smartlink_example_02_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Fact Sheet"
			}, {
				action: "anyAction",
				intent: "?demokit_smartlink_example_02_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
				text: "Show product"
			}
		]
	},
	demokit_smartlink_example_02_SemanticObjectProductId: {
		links: [
			{
				action: "displayFactSheet",
				intent: "?demokit_smartlink_example_02_SemanticObjectProductId#/sample/sap.ui.comp.sample.smartlink.listPage/preview",
				text: "Show List"
			}
		]
	},
	demokit_smartlink_example_02_SemanticObjectCategory: {
		links: []
	},
	demokit_smartlink_example_03_SemanticObjectName: {
		links: [
			{
				action: "displayFactSheet",
				intent: "?demokit_smartlink_example_03_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Fact Sheet"
			}
		]
	},
	demokit_smartlink_example_04_SemanticObjectName: {
		links: [
			{
				action: "displayFactSheet",
				intent: "?demokit_smartlink_example_04_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Fact Sheet"
			}, {
				action: "anyAction",
				intent: "?demokit_smartlink_example_04_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
				text: "Show product"
			}
		]
	},
	demokit_smartlink_example_05_SemanticObjectName: {
		links: [
			{
				action: "displayFactSheet",
				intent: "?demokit_smartlink_example_05_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "FactSheet of Name"
			}, {
				intent: "?demokit_smartlink_example_05_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
				text: "Show Name"
			}
		]
	}
});

sap.ui.define([], function() {
	"use strict";
// var RegisterMockForCrossApplicationNavigation = {
//
// }
	return {};
}, /* bExport= */true);
