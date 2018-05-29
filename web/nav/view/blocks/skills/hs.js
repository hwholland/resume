sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.skills.hs", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.skills.hs",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.skills.hs",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
