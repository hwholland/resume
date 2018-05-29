sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.visualize.data", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.visualize.data",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.visualize.data",
					type: "XML"
				}
			}
		},
		onInit: function() {
			var oTokens = this.getOwnerComponent().getModel("tokens");
            this.getView().setModel(oTokens, "tokens");
		}
	});
	return myBlock;
}, true);
