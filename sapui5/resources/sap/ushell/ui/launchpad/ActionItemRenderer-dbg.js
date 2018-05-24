// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
/*global jQuery, sap, navigator*/

(function () {
    "use strict";
    /*jslint nomen: true*/
    jQuery.sap.declare("sap.ushell.ui.launchpad.ActionItemRenderer");
    jQuery.sap.require('sap.ui.core.Renderer');
    jQuery.sap.require('sap.m.ButtonRenderer');

    /**
     * @class sap.ushell.ui.launchpad.LoadingDialogRenderer
     * @static
     * @private
     */
    sap.ushell.ui.launchpad.ActionItemRenderer = {};


    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     * @private
     */
    sap.ushell.ui.launchpad.ActionItemRenderer = sap.ui.core.Renderer.extend(sap.m.ButtonRenderer);

}());
