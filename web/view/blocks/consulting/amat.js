sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.consulting.amat", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.consulting.amat",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.consulting.amat",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
