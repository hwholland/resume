sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.consulting.kc", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.consulting.kc",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.consulting.kc",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
