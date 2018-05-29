sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.entreprenuership.solo", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.entreprenuership.solo",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.entreprenuership.solo",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
