sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.employment.dxs", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.employment.dxs",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.employment.dxs",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
