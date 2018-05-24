/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.appfinder.AppBox.
jQuery.sap.declare("sap.ushell.ui.appfinder.AppBox");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ui/appfinder/AppBox.
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
 * <li>{@link #getTitle title} : string</li>
 * <li>{@link #getUrl url} : string</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getPinButton pinButton} : sap.m.Button</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ushell.ui.appfinder.AppBox#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ushell.ui.appfinder.AppBox#event:afterRendering afterRendering} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Add your documentation for the newui/appfinder/AppBox
 * @extends sap.ui.core.Control
 * @version 1.38.26
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.appfinder.AppBox
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ushell.ui.appfinder.AppBox", { metadata : {

	library : "sap.ushell",
	properties : {

		/**
		 */
		"title" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		"url" : {type : "string", group : "Misc", defaultValue : null}
	},
	aggregations : {

		/**
		 */
		"pinButton" : {type : "sap.m.Button", multiple : false}
	},
	events : {

		/**
		 */
		"press" : {}, 

		/**
		 */
		"afterRendering" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ushell.ui.appfinder.AppBox with name <code>sClassName</code> 
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
 * @name sap.ushell.ui.appfinder.AppBox.extend
 * @function
 */

sap.ushell.ui.appfinder.AppBox.M_EVENTS = {'press':'press','afterRendering':'afterRendering'};


/**
 * Getter for property <code>title</code>.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>title</code>
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#getTitle
 * @function
 */

/**
 * Setter for property <code>title</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTitle  new value for property <code>title</code>
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#setTitle
 * @function
 */


/**
 * Getter for property <code>url</code>.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>url</code>
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#getUrl
 * @function
 */

/**
 * Setter for property <code>url</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sUrl  new value for property <code>url</code>
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#setUrl
 * @function
 */


/**
 * Getter for aggregation <code>pinButton</code>.<br/>
 * 
 * @return {sap.m.Button}
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#getPinButton
 * @function
 */


/**
 * Setter for the aggregated <code>pinButton</code>.
 * @param {sap.m.Button} oPinButton
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#setPinButton
 * @function
 */
	

/**
 * Destroys the pinButton in the aggregation 
 * named <code>pinButton</code>.
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#destroyPinButton
 * @function
 */


/**
 *
 * @name sap.ushell.ui.appfinder.AppBox#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.ushell.ui.appfinder.AppBox</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.appfinder.AppBox</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.appfinder.AppBox</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.ushell.ui.appfinder.AppBox</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.appfinder.AppBox#firePress
 * @function
 */


/**
 *
 * @name sap.ushell.ui.appfinder.AppBox#afterRendering
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'afterRendering' event of this <code>sap.ushell.ui.appfinder.AppBox</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.appfinder.AppBox</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.appfinder.AppBox</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#attachAfterRendering
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'afterRendering' event of this <code>sap.ushell.ui.appfinder.AppBox</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.appfinder.AppBox#detachAfterRendering
 * @function
 */

/**
 * Fire event afterRendering to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.appfinder.AppBox} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.appfinder.AppBox#fireAfterRendering
 * @function
 */

// Start of sap/ushell/ui/appfinder/AppBox.js
/*global jQuery, sap*/
/**
 * @name sap.ushell.ui.appfinder.AppBox
 *
 * Provides control sap.ushell.ui.appfinder.AppBox
 * @private
 */
(function () {
    /*global sap */
    "use strict";

    sap.ushell.ui.appfinder.AppBox.prototype.init = function () {
    };

    sap.ushell.ui.appfinder.AppBox.prototype.onAfterRendering = function () {
        this.fireAfterRendering();
    };

    sap.ushell.ui.appfinder.AppBox.prototype.setTitle = function (sTitle) {
        this.setProperty("title", sTitle, true); // set property, but suppress rendering
    };

    sap.ushell.ui.appfinder.AppBox.prototype.setUrl = function (sIntent) {
        this.setProperty("url", sIntent, true); // set property, but suppress rendering
    };

    // browser events
    sap.ushell.ui.appfinder.AppBox.prototype.onclick = function (e) {
        this.firePress(e);
    };

    sap.ushell.ui.appfinder.AppBox.prototype.onsapspace = function (e) {
        e.preventDefault();
        this.firePress(e);
    };

    sap.ushell.ui.appfinder.AppBox.prototype.onsapenter = sap.ushell.ui.appfinder.AppBox.prototype.onsapspace;

}());
