sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.skills.jimmyash", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.skills.jimmyash",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.skills.jimmyash",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
