/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.launchpad.ActionItem.
jQuery.sap.declare("sap.ushell.ui.launchpad.ActionItem");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.m.Button");


/**
 * Constructor for a new ui/launchpad/ActionItem.
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
 * <li>{@link #getActionType actionType} : string (default: 'standard')</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ushell.ui.launchpad.ActionItem#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ushell.ui.launchpad.ActionItem#event:afterRendering afterRendering} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.m.Button#constructor sap.m.Button}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * @extends sap.m.Button
 * @version 1.38.26
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.launchpad.ActionItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.Button.extend("sap.ushell.ui.launchpad.ActionItem", { metadata : {

	library : "sap.ushell",
	properties : {

		/**
		 * type of button to create
		 */
		"actionType" : {type : "string", group : "Appearance", defaultValue : 'standard'}
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
 * Creates a new subclass of class sap.ushell.ui.launchpad.ActionItem with name <code>sClassName</code> 
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
 * @name sap.ushell.ui.launchpad.ActionItem.extend
 * @function
 */

sap.ushell.ui.launchpad.ActionItem.M_EVENTS = {'press':'press','afterRendering':'afterRendering'};


/**
 * Getter for property <code>actionType</code>.
 * type of button to create
 *
 * Default value is <code>standard</code>
 *
 * @return {string} the value of property <code>actionType</code>
 * @public
 * @name sap.ushell.ui.launchpad.ActionItem#getActionType
 * @function
 */

/**
 * Setter for property <code>actionType</code>.
 *
 * Default value is <code>standard</code> 
 *
 * @param {string} sActionType  new value for property <code>actionType</code>
 * @return {sap.ushell.ui.launchpad.ActionItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ActionItem#setActionType
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.ActionItem#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.ushell.ui.launchpad.ActionItem</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.ActionItem</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.ActionItem</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.ActionItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ActionItem#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.ushell.ui.launchpad.ActionItem</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.ActionItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ActionItem#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.ActionItem} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.ActionItem#firePress
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.ActionItem#afterRendering
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'afterRendering' event of this <code>sap.ushell.ui.launchpad.ActionItem</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.ActionItem</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.ActionItem</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.ActionItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ActionItem#attachAfterRendering
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'afterRendering' event of this <code>sap.ushell.ui.launchpad.ActionItem</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.ActionItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ActionItem#detachAfterRendering
 * @function
 */

/**
 * Fire event afterRendering to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.ActionItem} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.ActionItem#fireAfterRendering
 * @function
 */

// Start of sap/ushell/ui/launchpad/ActionItem.js
(function () {
    "use strict";
    /*global sap */
    /*jslint nomen: true*/
    /**
     * @name sap.ushell.ui.launchpad.ActionItem
     *
     * @private
     */
    sap.ushell.ui.launchpad.ActionItem.prototype.init = function () {
        if (sap.m.Button.prototype.init) {
            sap.m.Button.prototype.init.apply(this, arguments);
        }
        this.sOrigType = undefined;
    };

    sap.ushell.ui.launchpad.ActionItem.prototype.setActionType = function (sType) {
        if (!this.sOrigType) {
            this.sOrigType = this.getType();
        }
        if (sType === 'action') {
            this.setType(sap.m.ButtonType.Unstyled);
            this.addStyleClass("sapUshellActionItem");
        } else {
            this.sOrigType ? this.setType(this.sOrigType) : this.setType(sap.m.ButtonType.Standard);
            this.removeStyleClass("sapUshellActionItem");
        }
        this.setProperty('actionType', sType, true);
    };
}());
