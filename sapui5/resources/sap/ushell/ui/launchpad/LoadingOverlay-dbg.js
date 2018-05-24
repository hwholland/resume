/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.launchpad.LoadingOverlay.
jQuery.sap.declare("sap.ushell.ui.launchpad.LoadingOverlay");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ui/launchpad/LoadingOverlay.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Displays a loading overlay on app loading
 * @extends sap.ui.core.Control
 * @version 1.38.26
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.launchpad.LoadingOverlay
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ushell.ui.launchpad.LoadingOverlay", { metadata : {

	library : "sap.ushell"
}});


/**
 * Creates a new subclass of class sap.ushell.ui.launchpad.LoadingOverlay with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.ushell.ui.launchpad.LoadingOverlay.extend
 * @function
 */

// Start of sap/ushell/ui/launchpad/LoadingOverlay.js
(function () {
    "use strict";
    /*global jQuery, sap, window */
    /*jslint nomen: true*/

    /**
     * LoadingOverlay
     *
     * @name sap.ushell.ui.launchpad.LoadingOverlay
     * @private
     */

    sap.ushell.ui.launchpad.LoadingOverlay.prototype.init = function () {
        var body = document.getElementsByTagName("body")[0],
            elLoadingOverlay = document.createElement("DIV"),
            elAccessibilityHelper = document.createElement("DIV"),
            elAccessibilityAppInfo = document.createElement("DIV"),
            elAccessibilityLoadingComplete = document.createElement("DIV"),
            elLoadingArea = document.createElement("DIV");

        elLoadingArea.setAttribute("id", "sapUshellLoadingArea");
        elLoadingArea.setAttribute("class", "sapUshellLoadingDialogArea");
        elLoadingArea.setAttribute("style", "height: 0px; width: 0px; overflow: hidden; float: left;");
        body.insertBefore(elLoadingArea, body.firstChild);
        elAccessibilityHelper.setAttribute("id", "sapUshellLoadingAccessibilityHelper");
        elAccessibilityHelper.setAttribute("class", "sapUshellLoadingAccessibilityHelper");
        elAccessibilityAppInfo.setAttribute("id", "sapUshellLoadingAccessibilityHelper-appInfo");
        elAccessibilityAppInfo.setAttribute("aria-atomic", "true");
        elAccessibilityLoadingComplete.setAttribute("id", "sapUshellLoadingAccessibilityHelper-loadingComplete");
        elAccessibilityLoadingComplete.setAttribute("aria-atomic", "true");
        elAccessibilityLoadingComplete.setAttribute("aria-live", "polite");
        elLoadingOverlay.setAttribute("id", "sapUshellLoadingOverlay");
        elLoadingOverlay.setAttribute("class", "sapUshellLoadingOverlayStyle sapUshellShellHidden");
        elLoadingOverlay.setAttribute("style", "z-index: 8;visibility: visible;");
        elAccessibilityHelper.appendChild(elAccessibilityAppInfo);
        elAccessibilityHelper.appendChild(elAccessibilityLoadingComplete);
        elLoadingArea.appendChild(elAccessibilityHelper);
        body.insertBefore(elLoadingOverlay, elLoadingArea);
        
    };

    sap.ushell.ui.launchpad.LoadingOverlay.prototype.openLoadingScreen = function () {
        jQuery("#sapUshellLoadingOverlay").toggleClass("sapUshellShellHidden", false);
    };

    sap.ushell.ui.launchpad.LoadingOverlay.prototype.isOpen = function () {
        return !jQuery("#sapUshellLoadingOverlay").hasClass("sapUshellShellHidden");
    };

    sap.ushell.ui.launchpad.LoadingOverlay.prototype.closeLoadingScreen = function () {
        jQuery("#sapUshellLoadingOverlay").toggleClass("sapUshellShellHidden", true);
    };

}());
