sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.skills.kraft", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.skills.kraft",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.skills.kraft",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
