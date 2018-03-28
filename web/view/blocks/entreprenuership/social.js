sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.entreprenuership.social", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.entreprenuership.social",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.entreprenuership.social",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
