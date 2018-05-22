/*!
 * ${copyright}
 */

sap.ui.define(['jquery.sap.global'],
    function (jQuery) {
        "use strict";
        jQuery.sap.declare("sap.ushell.ui.launchpad.ViewPortContainerRenderer");

        /**
         * * viewPortContainer renderer.
         * * @namespace
         * */
        var ViewPortContainerRenderer = {};

        ViewPortContainerRenderer.renderViewPortPart = function (oControl, ctxDomRef, sViewPortId) {
            var jqViewPort = jQuery(ctxDomRef).find("#" + sViewPortId);
            //centerViewPort.find(".sapUshellViewPortInner").remove();
            var rm = sap.ui.getCore().createRenderManager();
            rm.render(oControl, jqViewPort[0]);
            rm.destroy();
        };

        ViewPortContainerRenderer._renderViewPort = function (rm, aViewPortControls, sId,  aViewPortClassNames) {
            //Start the viewport itself/
            rm.write("<div");
            aViewPortClassNames.forEach(function (sClassName) {
                rm.addClass(sClassName);
            });
            rm.writeClasses();
            rm.writeAttribute("id", sId);
            rm.write(">");
            //Write inner viewport controls.
            aViewPortControls.forEach(function (oViewPortControl) {
                rm.renderControl(oViewPortControl);
            });
            rm.write("</div>");
        };

        ViewPortContainerRenderer._renderCenterViewPort = function (rm, aViewPortControls, sId,  aViewPortClassNames) {
            //Write viewport wrapper.
            rm.write("<div");
            rm.addClass('sapUshellViewPortWrapper');
            rm.writeClasses();
            rm.writeAttribute("id", sId + '-wrapper');
            rm.write(">");
            ViewPortContainerRenderer._renderViewPort(rm, aViewPortControls, sId,  aViewPortClassNames);
            rm.write("</div>");
        };

        /**
         * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
         *
         * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
         * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
         */
        ViewPortContainerRenderer.render = function (rm, oControl) {
            // return immediately if control is invisible
            if (!oControl.getVisible()) {
                return;
            }

            rm.write("<div");
            rm.writeControlData(oControl);
            if (oControl.getWidth()) {
                rm.addStyle("width", oControl.getWidth());
            }
            oControl.getHeight();
            if (oControl.getHeight()) {
                rm.addStyle("height", oControl.getHeight());
            }
            if (this.renderAttributes) {
                this.renderAttributes(rm, oControl); // may be used by inheriting renderers, but DO NOT write class or style attributes! Instead, call addClass/addStyle.
            }
            var oStates = oControl._states,
                oState = oStates[oControl.sCurrentState],
                aVisibleViewPortsData = oState.visibleViewPortsData,
                sTranslateX = oControl._getTranslateXValue(oControl.sCurrentState),
                aLeftViewPortClasses = ["sapUshellViewPortLeft"],
                aCenterViewPortClasses = ["sapUshellViewPortCenter"],
                aRightViewPortClasses = ["sapUshellViewPortRight"];

            var oConfiguration = sap.ui.getCore().getConfiguration();
            this.bIsRTL = !jQuery.isEmptyObject(oConfiguration) && oConfiguration.getRTL ? oConfiguration.getRTL() : false;
            rm.addStyle(this.bIsRTL ? 'right' : 'left', sTranslateX);
            rm.writeStyles();
            rm.write(">");
            aVisibleViewPortsData.forEach(function (entry) {
                switch (entry.viewPortId) {
                case 'leftViewPort':
                    aLeftViewPortClasses.push(entry.className);
                    break;
                case 'centerViewPort':
                    aCenterViewPortClasses.push(entry.className);
                    break;
                case 'rightViewPort':
                    aRightViewPortClasses.push(entry.className);
                    break;
                }
            });
            ViewPortContainerRenderer._renderViewPort(rm, oControl.getLeftViewPort(), 'leftViewPort',  aLeftViewPortClasses);
            ViewPortContainerRenderer._renderCenterViewPort(rm, oControl.getCenterViewPort(), 'centerViewPort',  aCenterViewPortClasses);
            ViewPortContainerRenderer._renderViewPort(rm, oControl.getRightViewPort(), 'rightViewPort',  aRightViewPortClasses);
            rm.write("</div>");
        };

        return ViewPortContainerRenderer;

    }, /* bExport= */ true);
