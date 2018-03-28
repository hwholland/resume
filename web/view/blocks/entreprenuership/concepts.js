sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.entreprenuership.concepts", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.entreprenuership.concepts",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.entreprenuership.concepts",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
