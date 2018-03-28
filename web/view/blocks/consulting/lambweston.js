sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.consulting.lambweston", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.consulting.lambweston",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.consulting.lambweston",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
