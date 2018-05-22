// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/*global jQuery, sap*/

(function () {
    "use strict";
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.declare("sap.ushell.ui.launchpad.CatalogTileContainerRenderer");
    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainerRenderer");

    /**
     * @class CatalogTileContainer renderer.
     * @static
     *
     * @private
     */
    sap.ushell.ui.launchpad.CatalogTileContainerRenderer = {};

    sap.ushell.ui.launchpad.CatalogTileContainerRenderer = sap.ui.core.Renderer.extend(sap.ushell.ui.launchpad.TileContainerRenderer);

}());
