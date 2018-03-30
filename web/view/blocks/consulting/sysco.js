sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("resume.web.view.blocks.consulting.sysco", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "resume.web.view.blocks.consulting.sysco",
					type: "XML"
				},
				Expanded: {
					viewName: "resume.web.view.blocks.consulting.sysco",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);
