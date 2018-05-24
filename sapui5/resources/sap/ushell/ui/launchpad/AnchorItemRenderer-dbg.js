// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/*global jQuery, sap*/
/**
 * @class AnchorItem renderer.
 * @static
 *
 * @private
 */

(function () {
    "use strict";
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ui.core.Control");
    jQuery.sap.declare("sap.ushell.ui.launchpad.AnchorItemRenderer");

    sap.ushell.ui.launchpad.AnchorItemRenderer = sap.ui.core.Renderer.extend(sap.ui.core.Control);
    sap.ushell.ui.launchpad.AnchorItemRenderer.render = function (rm, oAnchorItem) {
        var oAnchorNavigationBar = oAnchorItem.getParent(),
            oAnchorItems = oAnchorNavigationBar.getGroups(),
            oAnchorVisibleItems = oAnchorItems.filter(function (oGroup) {
                return oGroup.getVisible();
            }),
            iCurrentItemIndex = oAnchorVisibleItems.indexOf(oAnchorItem) > -1 ? oAnchorVisibleItems.indexOf(oAnchorItem) + 1 : "";

        rm.write("<li");
        rm.writeControlData(oAnchorItem);
        rm.addClass("sapUshellAnchorItem");
        rm.writeAccessibilityState(oAnchorItem, {role: "option", posinset : iCurrentItemIndex, setsize : oAnchorVisibleItems.length});
        rm.writeAttribute("tabindex", "0");
        if (!oAnchorItem.getVisible()) {
            rm.addClass("sapUshellShellHidden");
        }
        rm.writeClasses();
        rm.write(">");
        rm.write("<div");
        rm.addClass("sapUshellAnchorItemInner");
        rm.writeClasses();
        rm.write(">");
        rm.writeEscaped(oAnchorItem.getTitle());
        rm.write("</div>");
        rm.write("</li>");

    };
}());
