sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.skills.lw", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.skills.lw",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.skills.lw",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
