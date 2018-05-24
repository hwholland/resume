sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.summary.techskills", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.summary.techskills",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.summary.techskills",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
