/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.launchpad.LoadingDialog.
jQuery.sap.declare("sap.ushell.ui.launchpad.LoadingDialog");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ui/launchpad/LoadingDialog.
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
 * <ul>
 * <li>{@link #getIconUri iconUri} : sap.ui.core.URI</li>
 * <li>{@link #getText text} : sap.ui.core.URI</li>
 * <li>{@link #getLoadAnimationWithInterval loadAnimationWithInterval} : boolean (default: true)</li></ul>
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
 * Displays a loading dialog with an indicator that an app is loading
 * @extends sap.ui.core.Control
 * @version 1.38.26
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.launchpad.LoadingDialog
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ushell.ui.launchpad.LoadingDialog", { metadata : {

	library : "sap.ushell",
	properties : {

		/**
		 * the sap-icon://-style URI of an icon
		 */
		"iconUri" : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},

		/**
		 * the text to be displayed
		 */
		"text" : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},

		/**
		 * defines whether the presentation of the Fiori flower animation should be displayed with an interval
		 */
		"loadAnimationWithInterval" : {type : "boolean", group : "Appearance", defaultValue : true}
	}
}});


/**
 * Creates a new subclass of class sap.ushell.ui.launchpad.LoadingDialog with name <code>sClassName</code> 
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
 * @name sap.ushell.ui.launchpad.LoadingDialog.extend
 * @function
 */


/**
 * Getter for property <code>iconUri</code>.
 * the sap-icon://-style URI of an icon
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>iconUri</code>
 * @public
 * @name sap.ushell.ui.launchpad.LoadingDialog#getIconUri
 * @function
 */

/**
 * Setter for property <code>iconUri</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sIconUri  new value for property <code>iconUri</code>
 * @return {sap.ushell.ui.launchpad.LoadingDialog} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.LoadingDialog#setIconUri
 * @function
 */


/**
 * Getter for property <code>text</code>.
 * the text to be displayed
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>text</code>
 * @public
 * @name sap.ushell.ui.launchpad.LoadingDialog#getText
 * @function
 */

/**
 * Setter for property <code>text</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sText  new value for property <code>text</code>
 * @return {sap.ushell.ui.launchpad.LoadingDialog} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.LoadingDialog#setText
 * @function
 */


/**
 * Getter for property <code>loadAnimationWithInterval</code>.
 * defines whether the presentation of the Fiori flower animation should be displayed with an interval
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>loadAnimationWithInterval</code>
 * @public
 * @name sap.ushell.ui.launchpad.LoadingDialog#getLoadAnimationWithInterval
 * @function
 */

/**
 * Setter for property <code>loadAnimationWithInterval</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bLoadAnimationWithInterval  new value for property <code>loadAnimationWithInterval</code>
 * @return {sap.ushell.ui.launchpad.LoadingDialog} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.LoadingDialog#setLoadAnimationWithInterval
 * @function
 */

// Start of sap/ushell/ui/launchpad/LoadingDialog.js
(function () {
    "use strict";
    /*global jQuery, sap, window */
    /*jslint nomen: true*/
    jQuery.sap.require("sap.ui.core.Icon");
    jQuery.sap.require("sap.ui.core.Popup");
    jQuery.sap.require("sap.m.Label");
    jQuery.sap.require('sap.ushell.ui.launchpad.AccessibilityCustomData');

    sap.ushell.ui.launchpad.LoadingDialog.prototype.init = function () {
        this._oPopup = new sap.ui.core.Popup();
        this._oPopup.restoreFocus = false;
        this._oPopup.setShadow(false);
        //adds the class "sapUshellLoadingDialog" to UI5 block layer
        this._oPopup.setModal(true, "sapUshellLoadingDialog");
        this.oIcon = new sap.ui.core.Icon();
        this._sLabelId = this.getId() + 'loadingLabel';
        this._oLabel = new sap.m.Label(this._sLabelId);
    };

    sap.ushell.ui.launchpad.LoadingDialog.prototype.exit = function () {
        this._oPopup.close();
        this._oPopup.destroy();
        this.oIcon.destroy();
        this._oLabel.destroy();
    };

    sap.ushell.ui.launchpad.LoadingDialog.prototype.isOpen = function () {
        return this._oPopup.isOpen();
    };

    sap.ushell.ui.launchpad.LoadingDialog.prototype.openLoadingScreen = function () {

        if (this.getLoadAnimationWithInterval()) {
            this.toggleStyleClass('sapUshellVisibilityHidden', true);
            this._iTimeoutId = setTimeout(function () {
                this.toggleStyleClass('sapUshellVisibilityHidden', false);
            }.bind(this), 3000);
        } else {
            //Show the Fiori Flower and the appInfo at any rate in case the Animation is applied without interval.
            this.toggleStyleClass('sapUshellVisibilityHidden', false);
        }
        if (!this.getVisible()) {
            this.setProperty('visible', true, true);
            this.$().show();
        }
        if (!this.isOpen()) {
            if (!this._oPopup.getContent()) {
                this._oPopup.setContent(this);
            }
            this._oPopup.setPosition("center center", "center center", document, "0 0", "fit");
            //wrap with setimout.
            this._oPopup.open();
        }
    };

    sap.ushell.ui.launchpad.LoadingDialog.prototype.setLoadAnimationWithInterval = function (bShowLoadingAnimation) {
        this.setProperty('loadAnimationWithInterval', bShowLoadingAnimation, true);
    };

    sap.ushell.ui.launchpad.LoadingDialog.prototype.showAppInfo = function (sAppTitle, sIconUri, bAnnounceAppTitle) {
        this.setProperty('text', sAppTitle, true);
        this.setProperty('iconUri', sIconUri, true);
        this.oIcon.setSrc(sIconUri);
        this._oLabel.setText(sAppTitle);
    };

    sap.ushell.ui.launchpad.LoadingDialog.prototype.closeLoadingScreen = function () {
        if (this._iTimeoutId) {
            //Terminate delayed Fiori Flower presentation.
            clearTimeout(this._iTimeoutId);
        }
        // When closing the loading flower, we would like to clean the label text
        // in order not to have the same text in the next time that the flower is shown (i.e. in the next navigation)
        this._oLabel.setText("");
        if (this.getVisible()) {
            this.setProperty('visible', false, true);
            this.$().hide();
            this._oPopup.close();
        }
    };

    sap.ushell.ui.launchpad.LoadingDialog.prototype.onAfterRendering = function () {
        //set the width of the control for proper alignment
        this.$().css("width", "20rem");
        setTimeout(function () {
            //Each time we call oPopup.open, dialog gets rendered , in order to prevent the unnecesary rendering,
            //domref is set as the content of the popup instead of the dialog.
            //Then, loading dialog is set again as popup content in openLoadingScreen
            this._oPopup.setContent(this.getDomRef());
        }.bind(this), 0);
    };

    sap.ushell.ui.launchpad.LoadingDialog.prototype.setText = function (sText) {
        // suppress invalidation as triggering invalidation eventually leads to the render-manager to render
        // an empty place-holder which is an empty span (RenderManager.writeInvisiblePlaceholderData)
        // this happens due to the fact that the rendered object is not a control
        // see LoadingDialog.onAfterRendering -> setTimeout -> popup set content
        this.setProperty("text", sText, true);

        // take a reference to the label itself, to manually modify the text instead of re-rendering
        var jqLabel = jQuery("#" + this._sLabelId);
        if (jqLabel && jqLabel[0]) {
            jqLabel[0].textContent = sText;
        }
    };
}());
