sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
    "use strict";
    var oBlock = BlockBase.extend("nav.view.block.entreprenuer", {
        metadata: {
            views: {
                Collapsed: {
                    viewName: "nav.view.block.entreprenuer",
                    type: "XML"
                },
                Expanded: {
                    viewName: "nav.view.block.entreprenuer",
                    type: "XML"
                }
            }
        }
    });
    return oBlock;
}, true);