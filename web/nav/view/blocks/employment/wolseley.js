sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.employment.wolseley", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.employment.wolseley",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.employment.wolseley",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
