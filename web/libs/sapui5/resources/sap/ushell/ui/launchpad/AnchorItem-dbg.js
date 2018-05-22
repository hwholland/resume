/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.launchpad.AnchorItem.
jQuery.sap.declare("sap.ushell.ui.launchpad.AnchorItem");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ui/launchpad/AnchorItem.
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
 * <li>{@link #getSelected selected} : boolean (default: false)</li>
 * <li>{@link #getGroupId groupId} : string</li>
 * <li>{@link #getDefaultGroup defaultGroup} : boolean (default: false)</li>
 * <li>{@link #getIndex index} : int</li>
 * <li>{@link #getVisible visible} : boolean</li>
 * <li>{@link #getIsGroupVisible isGroupVisible} : boolean (default: true)</li>
 * <li>{@link #getIsGroupRendered isGroupRendered} : boolean (default: false)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ushell.ui.launchpad.AnchorItem#event:press press} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ushell.ui.launchpad.AnchorItem#event:afterRendering afterRendering} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Add your documentation for the newui/launchpad/AnchorItem
 * @extends sap.ui.core.Control
 * @version 1.38.26
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ushell.ui.launchpad.AnchorItem", { metadata : {

	library : "sap.ushell",
	properties : {

		/**
		 */
		"title" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		"selected" : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 */
		"groupId" : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		"defaultGroup" : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 */
		"index" : {type : "int", group : "Misc", defaultValue : null},

		/**
		 */
		"visible" : {type : "boolean", group : "Misc", defaultValue : null},

		/**
		 */
		"isGroupVisible" : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 */
		"isGroupRendered" : {type : "boolean", group : "Misc", defaultValue : false}
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
 * Creates a new subclass of class sap.ushell.ui.launchpad.AnchorItem with name <code>sClassName</code> 
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
 * @name sap.ushell.ui.launchpad.AnchorItem.extend
 * @function
 */

sap.ushell.ui.launchpad.AnchorItem.M_EVENTS = {'press':'press','afterRendering':'afterRendering'};


/**
 * Getter for property <code>title</code>.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>title</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#getTitle
 * @function
 */

/**
 * Setter for property <code>title</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sTitle  new value for property <code>title</code>
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#setTitle
 * @function
 */


/**
 * Getter for property <code>selected</code>.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>selected</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#getSelected
 * @function
 */

/**
 * Setter for property <code>selected</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bSelected  new value for property <code>selected</code>
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#setSelected
 * @function
 */


/**
 * Getter for property <code>groupId</code>.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>groupId</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#getGroupId
 * @function
 */

/**
 * Setter for property <code>groupId</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sGroupId  new value for property <code>groupId</code>
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#setGroupId
 * @function
 */


/**
 * Getter for property <code>defaultGroup</code>.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>defaultGroup</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#getDefaultGroup
 * @function
 */

/**
 * Setter for property <code>defaultGroup</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bDefaultGroup  new value for property <code>defaultGroup</code>
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#setDefaultGroup
 * @function
 */


/**
 * Getter for property <code>index</code>.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>index</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#getIndex
 * @function
 */

/**
 * Setter for property <code>index</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iIndex  new value for property <code>index</code>
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#setIndex
 * @function
 */


/**
 * Getter for property <code>visible</code>.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#setVisible
 * @function
 */


/**
 * Getter for property <code>isGroupVisible</code>.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>isGroupVisible</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#getIsGroupVisible
 * @function
 */

/**
 * Setter for property <code>isGroupVisible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bIsGroupVisible  new value for property <code>isGroupVisible</code>
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#setIsGroupVisible
 * @function
 */


/**
 * Getter for property <code>isGroupRendered</code>.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>isGroupRendered</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#getIsGroupRendered
 * @function
 */

/**
 * Setter for property <code>isGroupRendered</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bIsGroupRendered  new value for property <code>isGroupRendered</code>
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#setIsGroupRendered
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.AnchorItem#press
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'press' event of this <code>sap.ushell.ui.launchpad.AnchorItem</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.AnchorItem</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.AnchorItem</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#attachPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'press' event of this <code>sap.ushell.ui.launchpad.AnchorItem</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#detachPress
 * @function
 */

/**
 * Fire event press to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.AnchorItem#firePress
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.AnchorItem#afterRendering
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'afterRendering' event of this <code>sap.ushell.ui.launchpad.AnchorItem</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.AnchorItem</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.AnchorItem</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#attachAfterRendering
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'afterRendering' event of this <code>sap.ushell.ui.launchpad.AnchorItem</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorItem#detachAfterRendering
 * @function
 */

/**
 * Fire event afterRendering to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.AnchorItem} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.AnchorItem#fireAfterRendering
 * @function
 */

// Start of sap/ushell/ui/launchpad/AnchorItem.js
/*global jQuery, sap*/
/**
 * @name sap.ushell.ui.launchpad.AnchorItem
 *
 * @private
 */
(function () {
    "use strict";


    sap.ushell.ui.launchpad.AnchorItem.prototype.onAfterRendering = function () {
        this.fireAfterRendering();
    };
    sap.ushell.ui.launchpad.AnchorItem.prototype.setTitle = function (sTitle) {
        this.setProperty("title", sTitle, true);        // set property, but suppress rerendering
        this.$().find(".sapUshellAnchorItemInner").text(sTitle);
    };
    sap.ushell.ui.launchpad.AnchorItem.prototype.setGroupId = function (v) {
        this.setProperty("groupId", v, true);        // set property, but suppress rerendering
    };

    sap.ushell.ui.launchpad.AnchorItem.prototype.setSelected = function (bSelected) {
        bSelected = !!bSelected;
        this.setProperty("selected", bSelected, true);
        if (bSelected) {
            var jqSelected = jQuery(".sapUshellAnchorItemSelected");
            jqSelected.each( function () {
                jQuery(this).toggleClass("sapUshellAnchorItemSelected", false);
                jQuery(this).attr("aria-selected", false);
            });
        }
        this.$().attr("aria-selected", bSelected);
        this.$().toggleClass("sapUshellAnchorItemSelected", bSelected);

    };
    sap.ushell.ui.launchpad.AnchorItem.prototype.setIsGroupRendered = function (bRendered) {
        bRendered = !!bRendered;
        this.setProperty("isGroupRendered", bRendered, true);
        if (bRendered) {
            this.removeStyleClass("sapUshellAnchorItemNotRendered");
        } else {
            this.addStyleClass("sapUshellAnchorItemNotRendered");
        }
    };
    sap.ushell.ui.launchpad.AnchorItem.prototype.setIsGroupVisible = function (bVisible) {
        bVisible = !!bVisible;
        this.setProperty("isGroupVisible", bVisible, true);
        this.toggleStyleClass("sapUshellShellHidden", !bVisible);
    };

    // browser events
    sap.ushell.ui.launchpad.AnchorItem.prototype.onclick = function () {
        this.firePress();
    };

}());
