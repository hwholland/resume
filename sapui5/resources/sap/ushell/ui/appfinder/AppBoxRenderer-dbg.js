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
    jQuery.sap.declare("sap.ushell.ui.appfinder.AppBoxRenderer");

    sap.ushell.ui.appfinder.AppBoxRenderer = sap.ui.core.Renderer.extend(sap.ui.core.Control);
    sap.ushell.ui.appfinder.AppBoxRenderer.render = function (rm, oAppBox) {
        rm.write("<div");
        rm.writeControlData(oAppBox);
        rm.addClass("sapUshellAppBox");
        rm.writeAccessibilityState({
            label: oAppBox.getTitle(),
            role: "button"
        });
        rm.writeClasses();
        rm.write(">");
        rm.write("<div");
        rm.addClass("sapUshellAppBoxInner");
        rm.writeClasses();
        rm.write(">");
        rm.writeEscaped(oAppBox.getTitle());
        rm.renderControl(oAppBox.getPinButton());
        rm.write("</div>");
        rm.write("</div>");

    };
}());
