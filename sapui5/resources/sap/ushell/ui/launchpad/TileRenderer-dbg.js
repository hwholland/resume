// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/*global jQuery, sap*/

(function () {
    "use strict";
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.declare("sap.ushell.ui.launchpad.TileRenderer");

    /**
     * @class Tile renderer.
     * @static
     *
     * @private
     */
    sap.ushell.ui.launchpad.TileRenderer = {};
    // var translationBundle = sap.ushell.resources.i18n;

    /**
     * Renders the HTML for the given control, using the provided
     * {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            oRm the RenderManager that can be used for writing to the render
     *            output buffer
     * @param {sap.ui.core.Control}
     *            oControl an object representation of the control that should be
     *            rendered
     */
    sap.ushell.ui.launchpad.TileRenderer.render = function (oRm, oControl) {
        var oTileView = null, oModel = oControl.getModel(),
            aContent;
        try {
            oTileView = oControl.getTileViews()[0];
        } catch (ex) {
            jQuery.sap.log.warning("Failed to load tile view: ", ex.message);
            oTileView = new sap.m.Text({ text: "Failed to load. "});
        }
        var oTileContainer = oControl.getParent(),
            oTiles = oTileContainer.getTiles ? oTileContainer.getTiles() : [],
            oVisibleTiles = oTiles.filter(function (oTile) {
                return oTile.getVisible();
            }),
            iCurrentItemIndex = oVisibleTiles.indexOf(oControl) > -1 ? oVisibleTiles.indexOf(oControl) + 1 : "";

        oRm.write("<li");

        // if xRay is enabled
        if (oModel && oModel.getProperty("/enableHelp")) {
            // currently only the Tile (and the Tile's footer) has a data attribute in teh xRay integration
            // (as using this value as a class value instead as done in all of the static elements causes parsing errors in the xRay hotspot definition flow)
            oRm.writeAttribute("data-tileCatalogId", oControl.getTileCatalogId());// xRay support
        }
        oRm.writeControlData(oControl);
        oRm.addClass("sapUshellTile");
        //FeedTile BG should be transparent, since sapUshellTile BG style cannot be changed,
        //We add a special styleClass to FeedTile in order to set its BG to transparent
        if (oTileView && oTileView.getContent && sap.suite && sap.suite.ui && sap.suite.ui.commons && sap.suite.ui.commons.FeedTile) {
            aContent = oTileView.getContent();
            aContent.forEach(function (oItem) {
                if (oItem instanceof sap.suite.ui.commons.FeedTile) {
                    oRm.addClass("sapUshellFeedTileBG");
                }
            });
        }

        if (oControl.getFootItems() && oControl.getFootItems().length > 0) {
            oRm.addClass("sapUshellTileFooter");
        }
        if (oControl.getLong()) {
            oRm.addClass("sapUshellLong");
        }
        if (!oControl.getVisible()) {
            oRm.addClass("sapUshellHidden");
        }
        if (oControl.getIsLocked()){
            oRm.addClass("sapUshellLockedTile");
        }
        oRm.writeClasses();
        oRm.writeAccessibilityState(oControl, {role: "option", posinset : iCurrentItemIndex, setsize : oVisibleTiles.length});
        oRm.writeAttribute("aria-describedby", oControl.getParent().getId() + "-groupheader");

        if (oControl.getIeHtml5DnD()) {
            oRm.writeAttribute("draggable", "true");
        }
        oRm.writeAttributeEscaped("tabindex", "-1");
        var layoutPosition = oControl.data('layoutPosition');
        if (layoutPosition) {
            var stylePosition = '-webkit-transform:' + layoutPosition.translate3D + ';-ms-transform:' + layoutPosition.translate2D + ';transform:' + layoutPosition.translate3D;
            oRm.writeAttribute("style", stylePosition);
        }

        oRm.write(">");


        // Add the ActioMode cover DIV to the tile
        oRm.write("<div");
        oRm.addClass("sapUshellTileActionLayerDiv");
        oRm.writeClasses();
        oRm.write(">");

        if (!oControl.getShowActionsIcon()) {
            // we display the Delete action icon - only if tile is not part of a locked group
            if (!oControl.getIsLocked() && oControl.getTileActionModeActive()) {
                // render the trash bin action


                // outer div - the click area for the delete action
                oRm.write("<div");
                oRm.addClass("sapUshellTileDeleteClickArea");
                oRm.writeClasses();
                oRm.write(">");

                // 2nd div - to draw the circle around the icon
                oRm.write("<div");
                oRm.addClass("sapUshellTileDeleteIconOuterClass");
                oRm.writeClasses();
                oRm.write(">");

                oRm.renderControl(oControl._initDeleteAction()); // initialize & render the tile's delete action icon

                oRm.write("</div>");// 2nd div - to draw the circle around the icon
                oRm.write("</div>"); // outer div - the click area for the delete action
            }
        }

        // if tile is rendered in Edit-Mode (Tile Action mode)
        if (oControl.getTileActionModeActive()) {
            // add a div to render the tile's bottom overflow icon
            oRm.write("<div class='sapUshellTileActionDivCenter'></div>");
            oRm.write("<div");
            oRm.addClass("sapUshellTileActionIconDivBottom");
            oRm.writeClasses();
            oRm.write(">");
            oRm.write("<div");
            oRm.addClass("sapUshellTileActionIconDivBottomInnerDiv");
            oRm.writeClasses();
            oRm.write(">");
            oRm.renderControl(oControl.getActionSheetIcon());
            oRm.write("</div>");
            oRm.write("</div>");
        }

        oRm.write("</div>");

        // Tile Content
        oRm.addClass("sapUshellTileInner");
        // action mode is true
        if (oControl.getProperty('tileActionModeActive')) {
            oRm.addClass("sapUshellTileActionBG");
        }


        if (this.renderTileView) {
            this.renderTileView(oRm, oTileView, oControl.getTarget());
        }


        // if Tile has the ActionsIcon (overflow icon at its top right corner) - display it
        if (oControl.getShowActionsIcon()) {
            oRm.renderControl(oControl.actionIcon);
        }

        // Tile Footer Items
        oRm.write("<footer");

        // if xRay is enabled
        if (oModel && oModel.getProperty("/enableHelp")) {
            // currently only the Tile (and the Tile's footer) has a data attribute in teh xRay integration
            // (as using this value as a class value instead as done in all of the static elements causes parsing errors in the xRay hotspot definition flow)
            oRm.writeAttribute("data-tileCatalogId", "addRemoveTile-" + oControl.getTileCatalogId());
        }

        oRm.addClass("sapUshellTileFooterElement");
        oRm.writeClasses();
        oRm.write(">");
        jQuery.each(oControl.getFootItems(), function () {
            oRm.renderControl(this);
        });
        oRm.write("</footer>");

        oRm.write("</li>");
    };

    sap.ushell.ui.launchpad.TileRenderer.renderTileView = function (oRm, oTileView, sTarget) {
        if ((sTarget || "") !== "") {
            oRm.write("<a");
            oRm.writeClasses();
            oRm.writeAttributeEscaped("href", "#" + sTarget);
            oRm.write(">");
            oRm.renderControl(oTileView);
            oRm.write("</a>");
        } else {
            oRm.write("<div");
            oRm.writeClasses();
            oRm.write(">");
            oRm.renderControl(oTileView);
            oRm.write("</div>");
        }
    };

}());
