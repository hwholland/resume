sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.consulting.ag", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.consulting.ag",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.consulting.ag",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
