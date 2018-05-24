/*!
 * ${copyright}
 */
/*global jQuery, sap*/
// Provides default renderer for control sap.ushell.ui.shell.ShellLayout
sap.ui.define(['jquery.sap.global'],
    function (jQuery) {
        "use strict";

        /**
         * Shell Layout renderer.
         * @namespace
         */
        var ShellLayoutRenderer = {};

        /**
         * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
         * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
         * @param {sap.ui.core.Control} oShell an object representation of the control that should be rendered
         */
        ShellLayoutRenderer.render = function (rm, oShell) {
            var id = oShell.getId(),
                sClassName;

            rm.write("<div");
            rm.writeControlData(oShell);
            rm.addClass("sapUshellShell");
            if (oShell.getShowAnimation()) {
                rm.addClass("sapUshellShellAnim");
            }
            if (!oShell.getHeaderVisible()) {
                rm.addClass("sapUshellShellNoHead");
            }
            rm.addClass("sapUshellShellHead" + (oShell._showHeader ? "Visible" : "Hidden"));
            rm.writeClasses();
            rm.write(">");

            //use the showBrandLine to tell if the background should be behind the header or not
            //in Fiori 1.0 the background should not be rendered behind the header
            if (!oShell.getShowBrandLine()) {
                rm.write("<div id='", id, "-strgbg' class='sapUshellShellBG sapContrastPlus" + (oShell._useStrongBG ? " sapUiStrongBackgroundColor" : "") + "'></div>");
                rm.write("<div class='sapUiGlobalBackgroundImage sapUiGlobalBackgroundImageForce sapUshellShellBG sapContrastPlus'></div>");
            }

            if (oShell.getShowBrandLine()) {
                rm.write("<hr id='", id, "-brand' class='sapUshellShellBrand'/>");
            }

            rm.write("<header id='", id, "-hdr'  class='sapContrastPlus sapUshellShellHead'><div>");
            rm.write("<div id='", id, "-hdrcntnt' class='sapUshellShellCntnt'>");
            if (oShell.getHeader()) {
                rm.renderControl(oShell.getHeader());
            }

            rm.write("</div>", "</div>", "</header>");
            if (oShell.getFloatingContainer()) {
                rm.write("<div");
                rm.addClass("sapUshellShellFloatingContainerWrapper ");
                if (!oShell.getFloatingContainerVisible()) {
                    rm.addClass("sapUshellShellHidden");
                }
                rm.writeClasses();
                rm.write(">");
                rm.renderControl(oShell.getFloatingContainer());
                rm.write("</div>");
            }
            if (oShell.getToolArea()) {
                rm.write("<aside>");
                rm.renderControl(oShell.getToolArea());
                rm.write("</aside>");
            }

            if (oShell.getRightFloatingContainer()) {
                rm.write("<aside>");
                rm.renderControl(oShell.getRightFloatingContainer());
                rm.write("</aside>");
            }

            sClassName = "sapUshellShellCntnt sapUshellShellCanvas";
            if (oShell.getBackgroundColorForce()) {
                sClassName += " sapUiGlobalBackgroundColor sapUiGlobalBackgroundColorForce";
            }
            rm.write("<div id='", id, "-cntnt' class='" + sClassName + "'>");

            //use the showBrandLine to tell if the background should be behind the header or not
            //in Fiori 1.0 the background should not be rendered behind the header
            if (oShell.getShowBrandLine()) {
                rm.write("<div id='", id, "-strgbg' class='sapUshellShellBG sapContrastPlus" + (oShell._useStrongBG ? " sapUiStrongBackgroundColor" : "") + "'></div>");
                rm.write("<div class='sapUiGlobalBackgroundImage sapUiGlobalBackgroundImageForce sapUshellShellBG sapContrastPlus'></div>");
            }
            rm.renderControl(oShell.getCanvasSplitContainer());

            rm.write("</div>");

            rm.write("<span id='", id, "-main-focusDummyOut' tabindex='-1'></span>");

            rm.renderControl(oShell.getFloatingActionsContainer());

            rm.write("</div>");
        };

        return ShellLayoutRenderer;

    }, /* bExport= */ true);
