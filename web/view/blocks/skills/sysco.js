sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.skills.sysco", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.skills.sysco",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.skills.sysco",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
