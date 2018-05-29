sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.skills.ko", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.skills.ko",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.skills.ko",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);