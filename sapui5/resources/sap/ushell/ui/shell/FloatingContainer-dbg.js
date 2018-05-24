/*!
 * ${copyright}
 */
/**
 * An invisible container, located (i.e. floats) at the top right side of the shell and can host any <code>sap.ui.core.Control</code> object.<br>
 * Extends <code>sap.ui.core.Control</code>
 */

/*global jQuery, sap */
sap.ui.define(['jquery.sap.global', 'sap/ushell/library', 'sap/ui/Device'],
    function (jQuery, library, Device) {
        "use strict";
        var FloatingContainer = sap.ui.core.Control.extend("sap.ushell.ui.shell.FloatingContainer", {

                metadata: {
                    properties: {
                    },
                    aggregations: {
                        content : {type : "sap.ui.core.Control", multiple : true}
                    }
                },
                renderer: {
                    render: function (rm, oContainer) {
                        rm.write("<div");
                        rm.writeControlData(oContainer);
                        rm.addClass("sapUshellFloatingContainer");
                        rm.writeClasses();
                        rm.write(">");

                        if (oContainer.getContent() && oContainer.getContent().length) {
                            rm.renderControl(oContainer.getContent()[0]);
                        }
                        rm.write("</div>");
                    }
                }
            });

        FloatingContainer.prototype.init = function () {
            sap.ui.Device.resize.attachHandler(FloatingContainer.prototype._resizeHandler, this);
        };

        FloatingContainer.prototype._getWindowHeight = function () {
            return jQuery(window).height();
        };
        FloatingContainer.prototype._setContainerHeight = function (oContainer, iFinalHeight) {
            oContainer.css("max-height", iFinalHeight);
        };
        /**
         * Calculates the height of the floating container according to window size.
         * - iInitialContainerMaxHeight is the maximum height of the container according to UX definition.
         * - iAvailableHeightForContainer is the current window height minus the required offset of the container from the top.
         * - iFinalHeight can be one of the two:
         *   1. iAvailableHeightForContainer: If the maximum possible height (iAvailableHeightForContainer) is smaller then the requires height (iInitialContainerMaxHeight).
         *   2. iInitialContainerMaxHeight: since the window is high enough to contain it.
         */
        FloatingContainer.prototype._resizeHandler = function () {
            var oContainer = jQuery(".sapUshellFloatingContainer"),
                oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer"),
                oWrapper = oContainer.parent()[0],
                iWindowCurrentWidth = jQuery(window).width(),
                iWindowCurrentHeight = jQuery(window).height(),
                iContainerWidth = oContainer.width(),
                iContainerHeight = oContainer.height(),
                bContainerPosExceedWindowWidth,
                bContainerPosExceedWindowHeight,
                iLeftPos,
                iTopPos;

            if (oWrapper) {
                iLeftPos = oWrapper.style.left.replace("%", "");
                iLeftPos = iWindowCurrentWidth * iLeftPos / 100;
                iTopPos = oWrapper.style.top.replace("%", "");
                iTopPos = iWindowCurrentHeight * iTopPos / 100;
                bContainerPosExceedWindowWidth = iWindowCurrentWidth < (iLeftPos + iContainerWidth);
                bContainerPosExceedWindowHeight = iWindowCurrentHeight < (iTopPos + iContainerHeight);

                if (bContainerPosExceedWindowWidth) {
                    iLeftPos = iWindowCurrentWidth - iContainerWidth;
                }
                if (bContainerPosExceedWindowHeight) {
                    iTopPos = iWindowCurrentHeight - iContainerHeight;
                }

                if (!bContainerPosExceedWindowWidth && !bContainerPosExceedWindowHeight && oStorage && oStorage.get("floatingContainerStyle")) {
                    oWrapper.setAttribute("style", oStorage.get("floatingContainerStyle"));
                    return;
                }

                oWrapper.setAttribute("style", "left:" + iLeftPos * 100 / iWindowCurrentWidth + "%;top:" + iTopPos * 100 / iWindowCurrentHeight + "%;position:absolute;");
            }

        };
        FloatingContainer.prototype.setContent = function (aContent) {
            if (this.getDomRef()) {
                var rm = sap.ui.getCore().createRenderManager();
                rm.renderControl(aContent);
                rm.flush(this.getDomRef());
                rm.destroy();
            }
            this.setAggregation("content", aContent, true);
        };

        return FloatingContainer;
    }, true);