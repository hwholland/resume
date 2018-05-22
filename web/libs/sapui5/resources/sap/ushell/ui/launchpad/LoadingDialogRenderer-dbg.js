// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/*global jQuery, sap, navigator*/

(function () {
    "use strict";
    /*jslint nomen: true*/
    jQuery.sap.declare("sap.ushell.ui.launchpad.LoadingDialogRenderer");

    /**
     * @class sap.ushell.ui.launchpad.LoadingDialogRenderer
     * @static
     * @private
     */
    sap.ushell.ui.launchpad.LoadingDialogRenderer = {};


    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     * @private
     */
    sap.ushell.ui.launchpad.LoadingDialogRenderer.render = function (oRm, oControl) {
        var sTooltip = oControl.getTooltip_AsString();

        if (jQuery("#sapUshellLoadingAccessibilityHelper").length === 0) {
            oRm.write("<div");
            oRm.writeAttribute("id", "sapUshellLoadingAccessibilityHelper");
            oRm.addClass("sapUshellLoadingAccessibilityHelper");
            oRm.writeClasses();
            oRm.write(">");
            oRm.write("<div");
            oRm.writeAttribute("id", "sapUshellLoadingAccessibilityHelper-appInfo");
            oRm.writeAttribute("aria-atomic", "true");
            oRm.writeAttribute("role", "alert");
            oRm.write(">");
            oRm.write("</div>");
            oRm.write("<div");
            oRm.writeAttribute("id", "sapUshellLoadingAccessibilityHelper-loadingComplete");
            oRm.writeAttribute("aria-atomic", "true");
            oRm.writeAttribute("aria-live", "polite");
            oRm.write(">");

            oRm.write("</div>");

            oRm.write("</div>");
        }
        // add custom class to label
        oControl._oLabel.addStyleClass("sapUshellLoadingDialogLabel");
        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.addClass("sapUshellLoadingDialogControl");
        oRm.writeClasses();

        if (sTooltip) {
            oRm.writeAttributeEscaped("title", sTooltip);
        }
        oRm.write(">");

        if (jQuery.os.ios || !oControl._isPlatformDependent) {
            this.renderAppInfo(oRm, oControl);
            this.renderFioriFlower(oRm, oControl);
        } else {
            this.renderFioriFlower(oRm, oControl);
            this.renderAppInfo(oRm, oControl);
        }
        oRm.write("</div>");
    };

    sap.ushell.ui.launchpad.LoadingDialogRenderer.renderAppInfo = function (oRm, oControl) {
        oRm.write("<div").addClass("sapUshellLoadingDialogAppData").writeClasses();
        oRm.write(">");
        if (oControl.getIconUri()) {
            oRm.renderControl(oControl.oIcon);
        }
        oRm.renderControl(oControl._oLabel);
        oRm.write("</div>");
    };

    sap.ushell.ui.launchpad.LoadingDialogRenderer.renderFioriFlower = function (oRm, oControl) {
        /*jslint regexp: true */
        var i,
            bReplaceFlower = false,
            aUserAgentRegexes = [
                /Android\s4\.2.+GT-I9505.+Chrome\/18/ // Chrome 18 on Android 4.2.x / Samsung Galaxy S4
            ];
        // some browsers do not get the flower but the replacement
        if (navigator.userAgent) {
            for (i = 0; i < aUserAgentRegexes.length; i = i + 1) {
                // if one of the user agent matches, the replacement is drawn
                if (aUserAgentRegexes[i].test(navigator.userAgent)) {
                    bReplaceFlower = true;
                    // exit loop
                    break;
                }
            }
        }
        // create either flowery code or busy indicator
        if (jQuery.support.cssAnimations && !bReplaceFlower) {
            oRm.write("<div id='fiori2-loader'>");
            oRm.write("<div class='fiori2-blossom'>");
            for (i = 1; i < 6; i = i + 1) {
                oRm.write("<div class='fiori2-leafContainer fiori2-leafContainer" + i + "'>");
                oRm.write("<div class='fiori2-leaf fiori2-leaf" + i + "'></div>");
                // end leafContainer
                oRm.write("</div>");
            }      // end blossom
            oRm.write("</div>");
            // end fiori2-loader
            oRm.write("</div>");
        }
    };

}());
