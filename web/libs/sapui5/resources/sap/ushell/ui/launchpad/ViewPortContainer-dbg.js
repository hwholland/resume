/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.launchpad.ViewPortContainer.
jQuery.sap.declare("sap.ushell.ui.launchpad.ViewPortContainer");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new ui/launchpad/ViewPortContainer.
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
 * <li>{@link #getHeight height} : sap.ui.core.CSSSize (default: '100%')</li>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize (default: '100%')</li>
 * <li>{@link #getVisible visible} : boolean (default: true)</li>
 * <li>{@link #getDefaultState defaultState} : sap.ushell.ui.launchpad.ViewPortState (default: sap.ushell.ui.launchpad.ViewPortState.Center)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getLeftViewPort leftViewPort} : sap.ui.core.Control[]</li>
 * <li>{@link #getCenterViewPort centerViewPort} : sap.ui.core.Control[]</li>
 * <li>{@link #getRightViewPort rightViewPort} : sap.ui.core.Control[]</li></ul>
 * </li>
 * <li>Associations
 * <ul>
 * <li>{@link #getInitialCenterViewPort initialCenterViewPort} : string | sap.ui.core.Control</li>
 * <li>{@link #getInitialRightViewPort initialRightViewPort} : string | sap.ui.core.Control</li>
 * <li>{@link #getInitialLeftViewPort initialLeftViewPort} : string | sap.ui.core.Control</li></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ushell.ui.launchpad.ViewPortContainer#event:navigate navigate} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ushell.ui.launchpad.ViewPortContainer#event:afterSwitchState afterSwitchState} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ushell.ui.launchpad.ViewPortContainer#event:afterNavigate afterNavigate} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * ViewPort container
 * @extends sap.ui.core.Control
 * @version 1.38.26
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ushell.ui.launchpad.ViewPortContainer", { metadata : {

	library : "sap.ushell",
	properties : {

		/**
		 */
		"height" : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

		/**
		 */
		"width" : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

		/**
		 */
		"visible" : {type : "boolean", group : "Appearance", defaultValue : true},

		/**
		 */
		"defaultState" : {type : "sap.ushell.ui.launchpad.ViewPortState", group : "Appearance", defaultValue : sap.ushell.ui.launchpad.ViewPortState.Center}
	},
	aggregations : {

		/**
		 */
		"leftViewPort" : {type : "sap.ui.core.Control", multiple : true, singularName : "leftViewPort"}, 

		/**
		 */
		"centerViewPort" : {type : "sap.ui.core.Control", multiple : true, singularName : "centerViewPort"}, 

		/**
		 */
		"rightViewPort" : {type : "sap.ui.core.Control", multiple : true, singularName : "rightViewPort"}
	},
	associations : {

		/**
		 */
		"initialCenterViewPort" : {type : "sap.ui.core.Control", multiple : false}, 

		/**
		 */
		"initialRightViewPort" : {type : "sap.ui.core.Control", multiple : false}, 

		/**
		 */
		"initialLeftViewPort" : {type : "sap.ui.core.Control", multiple : false}
	},
	events : {

		/**
		 */
		"navigate" : {}, 

		/**
		 */
		"afterSwitchState" : {
			parameters : {

				/**
				 */
				"from" : {type : "sap.ui.core.Control"}, 

				/**
				 */
				"to" : {type : "sap.ui.core.Control"}
			}
		}, 

		/**
		 */
		"afterNavigate" : {
			parameters : {

				/**
				 */
				"from" : {type : "sap.ui.core.Control"}, 

				/**
				 */
				"to" : {type : "sap.ui.core.Control"}
			}
		}
	}
}});


/**
 * Creates a new subclass of class sap.ushell.ui.launchpad.ViewPortContainer with name <code>sClassName</code> 
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
 * @name sap.ushell.ui.launchpad.ViewPortContainer.extend
 * @function
 */

sap.ushell.ui.launchpad.ViewPortContainer.M_EVENTS = {'navigate':'navigate','afterSwitchState':'afterSwitchState','afterNavigate':'afterNavigate'};


/**
 * Getter for property <code>height</code>.
 *
 * Default value is <code>100%</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>height</code>
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getHeight
 * @function
 */

/**
 * Setter for property <code>height</code>.
 *
 * Default value is <code>100%</code> 
 *
 * @param {sap.ui.core.CSSSize} sHeight  new value for property <code>height</code>
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#setHeight
 * @function
 */


/**
 * Getter for property <code>width</code>.
 *
 * Default value is <code>100%</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is <code>100%</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#setWidth
 * @function
 */


/**
 * Getter for property <code>visible</code>.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#setVisible
 * @function
 */


/**
 * Getter for property <code>defaultState</code>.
 *
 * Default value is <code>Center</code>
 *
 * @return {sap.ushell.ui.launchpad.ViewPortState} the value of property <code>defaultState</code>
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getDefaultState
 * @function
 */

/**
 * Setter for property <code>defaultState</code>.
 *
 * Default value is <code>Center</code> 
 *
 * @param {sap.ushell.ui.launchpad.ViewPortState} oDefaultState  new value for property <code>defaultState</code>
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#setDefaultState
 * @function
 */


/**
 * Getter for aggregation <code>leftViewPort</code>.<br/>
 * 
 * @return {sap.ui.core.Control[]}
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getLeftViewPort
 * @function
 */


/**
 * Inserts a leftViewPort into the aggregation named <code>leftViewPort</code>.
 *
 * @param {sap.ui.core.Control}
 *          oLeftViewPort the leftViewPort to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the leftViewPort should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the leftViewPort is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the leftViewPort is inserted at 
 *             the last position        
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#insertLeftViewPort
 * @function
 */

/**
 * Adds some leftViewPort <code>oLeftViewPort</code> 
 * to the aggregation named <code>leftViewPort</code>.
 *
 * @param {sap.ui.core.Control}
 *            oLeftViewPort the leftViewPort to add; if empty, nothing is inserted
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#addLeftViewPort
 * @function
 */

/**
 * Removes an leftViewPort from the aggregation named <code>leftViewPort</code>.
 *
 * @param {int | string | sap.ui.core.Control} vLeftViewPort the leftViewPort to remove or its index or id
 * @return {sap.ui.core.Control} the removed leftViewPort or null
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#removeLeftViewPort
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>leftViewPort</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.core.Control[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#removeAllLeftViewPort
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.core.Control</code> in the aggregation named <code>leftViewPort</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.core.Control}
 *            oLeftViewPort the leftViewPort whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#indexOfLeftViewPort
 * @function
 */
	

/**
 * Destroys all the leftViewPort in the aggregation 
 * named <code>leftViewPort</code>.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#destroyLeftViewPort
 * @function
 */


/**
 * Getter for aggregation <code>centerViewPort</code>.<br/>
 * 
 * @return {sap.ui.core.Control[]}
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getCenterViewPort
 * @function
 */


/**
 * Inserts a centerViewPort into the aggregation named <code>centerViewPort</code>.
 *
 * @param {sap.ui.core.Control}
 *          oCenterViewPort the centerViewPort to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the centerViewPort should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the centerViewPort is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the centerViewPort is inserted at 
 *             the last position        
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#insertCenterViewPort
 * @function
 */

/**
 * Adds some centerViewPort <code>oCenterViewPort</code> 
 * to the aggregation named <code>centerViewPort</code>.
 *
 * @param {sap.ui.core.Control}
 *            oCenterViewPort the centerViewPort to add; if empty, nothing is inserted
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#addCenterViewPort
 * @function
 */

/**
 * Removes an centerViewPort from the aggregation named <code>centerViewPort</code>.
 *
 * @param {int | string | sap.ui.core.Control} vCenterViewPort the centerViewPort to remove or its index or id
 * @return {sap.ui.core.Control} the removed centerViewPort or null
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#removeCenterViewPort
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>centerViewPort</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.core.Control[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#removeAllCenterViewPort
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.core.Control</code> in the aggregation named <code>centerViewPort</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.core.Control}
 *            oCenterViewPort the centerViewPort whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#indexOfCenterViewPort
 * @function
 */
	

/**
 * Destroys all the centerViewPort in the aggregation 
 * named <code>centerViewPort</code>.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#destroyCenterViewPort
 * @function
 */


/**
 * Getter for aggregation <code>rightViewPort</code>.<br/>
 * 
 * @return {sap.ui.core.Control[]}
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getRightViewPort
 * @function
 */


/**
 * Inserts a rightViewPort into the aggregation named <code>rightViewPort</code>.
 *
 * @param {sap.ui.core.Control}
 *          oRightViewPort the rightViewPort to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the rightViewPort should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the rightViewPort is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the rightViewPort is inserted at 
 *             the last position        
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#insertRightViewPort
 * @function
 */

/**
 * Adds some rightViewPort <code>oRightViewPort</code> 
 * to the aggregation named <code>rightViewPort</code>.
 *
 * @param {sap.ui.core.Control}
 *            oRightViewPort the rightViewPort to add; if empty, nothing is inserted
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#addRightViewPort
 * @function
 */

/**
 * Removes an rightViewPort from the aggregation named <code>rightViewPort</code>.
 *
 * @param {int | string | sap.ui.core.Control} vRightViewPort the rightViewPort to remove or its index or id
 * @return {sap.ui.core.Control} the removed rightViewPort or null
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#removeRightViewPort
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>rightViewPort</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ui.core.Control[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#removeAllRightViewPort
 * @function
 */

/**
 * Checks for the provided <code>sap.ui.core.Control</code> in the aggregation named <code>rightViewPort</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ui.core.Control}
 *            oRightViewPort the rightViewPort whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#indexOfRightViewPort
 * @function
 */
	

/**
 * Destroys all the rightViewPort in the aggregation 
 * named <code>rightViewPort</code>.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#destroyRightViewPort
 * @function
 */


/**
 *
 * @return {string} Id of the element which is the current target of the <code>initialCenterViewPort</code> association, or null
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getInitialCenterViewPort
 * @function
 */

/**
 *
 * @param {string | sap.ui.core.Control} vInitialCenterViewPort 
 *    Id of an element which becomes the new target of this <code>initialCenterViewPort</code> association.
 *    Alternatively, an element instance may be given.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#setInitialCenterViewPort
 * @function
 */


	
/**
 *
 * @return {string} Id of the element which is the current target of the <code>initialRightViewPort</code> association, or null
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getInitialRightViewPort
 * @function
 */

/**
 *
 * @param {string | sap.ui.core.Control} vInitialRightViewPort 
 *    Id of an element which becomes the new target of this <code>initialRightViewPort</code> association.
 *    Alternatively, an element instance may be given.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#setInitialRightViewPort
 * @function
 */


	
/**
 *
 * @return {string} Id of the element which is the current target of the <code>initialLeftViewPort</code> association, or null
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#getInitialLeftViewPort
 * @function
 */

/**
 *
 * @param {string | sap.ui.core.Control} vInitialLeftViewPort 
 *    Id of an element which becomes the new target of this <code>initialLeftViewPort</code> association.
 *    Alternatively, an element instance may be given.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#setInitialLeftViewPort
 * @function
 */


	
/**
 *
 * @name sap.ushell.ui.launchpad.ViewPortContainer#navigate
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'navigate' event of this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#attachNavigate
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'navigate' event of this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#detachNavigate
 * @function
 */

/**
 * Fire event navigate to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.ViewPortContainer#fireNavigate
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.ViewPortContainer#afterSwitchState
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {sap.ui.core.Control} oControlEvent.getParameters.from
 * @param {sap.ui.core.Control} oControlEvent.getParameters.to
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'afterSwitchState' event of this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#attachAfterSwitchState
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'afterSwitchState' event of this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#detachAfterSwitchState
 * @function
 */

/**
 * Fire event afterSwitchState to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'from' of type <code>sap.ui.core.Control</code> </li>
 * <li>'to' of type <code>sap.ui.core.Control</code> </li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.ViewPortContainer#fireAfterSwitchState
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.ViewPortContainer#afterNavigate
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @param {sap.ui.core.Control} oControlEvent.getParameters.from
 * @param {sap.ui.core.Control} oControlEvent.getParameters.to
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'afterNavigate' event of this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#attachAfterNavigate
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'afterNavigate' event of this <code>sap.ushell.ui.launchpad.ViewPortContainer</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.ViewPortContainer#detachAfterNavigate
 * @function
 */

/**
 * Fire event afterNavigate to attached listeners.
 * 
 * Expects following event parameters:
 * <ul>
 * <li>'from' of type <code>sap.ui.core.Control</code> </li>
 * <li>'to' of type <code>sap.ui.core.Control</code> </li>
 * </ul>
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.ViewPortContainer} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.ViewPortContainer#fireAfterNavigate
 * @function
 */

// Start of sap/ushell/ui/launchpad/ViewPortContainer.js
/**
 * @name sap.ushell.ui.launchpad.ViewPortContainer
 *
 * @private
 */

(function () {
    "use strict";
    /*global jQuery, sap, window*/
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.declare("sap.ushell.ui.launchpad.ViewPortContainer");
    jQuery.sap.require('sap.ui.core.theming.Parameters');
    sap.ushell.ui.launchpad.ViewPortContainer.prototype.init = function () {
        this.bShiftCenterTransition = true;
        this.bShiftCenterTransitionEnabled = false;
        var oConfiguration = sap.ui.getCore().getConfiguration();
        this.bIsRTL = !jQuery.isEmptyObject(oConfiguration) && oConfiguration.getRTL ? oConfiguration.getRTL() : false;
        this.bTransitionEndHandlerRegistered = false;
        this._oViewPortsNavigationHistory = {
            leftViewPort: {
                visitedControls: [],
                indexOfCurrentlyDisplayedControl: null
            },
            centerViewPort: {
                visitedControls: [],
                indexOfCurrentlyDisplayedControl: null
            },
            rightViewPort: {
                visitedControls: [],
                indexOfCurrentlyDisplayedControl: null
            }
        };
        this._states = {
            Left: {
                translateX: '',
                visibleViewPortsData: [
                    {
                        viewPortId: 'leftViewPort',
                        className: "leftClass",
                        isActive: true
                    }
                ]
            },
            Center: {
                translateX: '',
                visibleViewPortsData: [
                    {
                        viewPortId: 'centerViewPort',
                        className: "centerClass",
                        isActive: true
                    }
                ]
            },
            Right: {
                translateX: '',
                visibleViewPortsData: [
                    {
                        viewPortId: 'rightViewPort',
                        className: "rightClass",
                        isActive: true
                    }
                ]
            },
            LeftCenter: {
                translateX: '',
                visibleViewPortsData: [
                    {
                        viewPortId: 'leftViewPort',
                        className: "front",
                        isActive: true
                    },
                    {
                        viewPortId: 'centerViewPort',
                        className: "backLeft",
                        isActive: false
                    }
                ]
            },
            CenterLeft: {
                translateX: '',
                visibleViewPortsData: [
                    {
                        viewPortId: 'centerViewPort',
                        className: "frontLeft",
                        isActive: true
                    },
                    {
                        viewPortId: 'leftViewPort',
                        className: "back",
                        isActive: false
                    }
                ]
            },
            RightCenter: {
                translateX: '',
                visibleViewPortsData: [
                    {
                        viewPortId: 'rightViewPort',
                        className: "front",
                        isActive: true
                    },
                    {
                        viewPortId: 'centerViewPort',
                        className: "backRight",
                        isActive: false
                    }
                ]
            },
            CenterRight: {
                translateX: '',
                visibleViewPortsData: [
                    {
                        viewPortId: 'centerViewPort',
                        className: "frontRight",
                        isActive: true
                    },
                    {
                        viewPortId: 'rightViewPort',
                        className: "back",
                        isActive: false
                    }
                ]
            }
        };

        sap.ui.Device.media.attachHandler(this._handleSizeChange.bind(this), null, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
        sap.ui.Device.orientation.attachHandler(this._handleSizeChange, this);

        jQuery(window).bind("resize", function () {
            this._handleSizeChange();
        }.bind(this));
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.removeCenterViewPort = function (oControl, bSuppressInvalidate) {
        this.removeAggregation('centerViewPort', oControl, bSuppressInvalidate);
        //Update viewPort Navigation History after removing navigation.
        this._popFromViewPortNavigationHistory('centerViewPort', oControl);
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._popFromViewPortNavigationHistory = function (sViewPortId, oControlToPop) {
        var oNavHistory = this._oViewPortsNavigationHistory[sViewPortId],
            aVisitedControls = oNavHistory ? oNavHistory.visitedControls : [],
            iIndexOfRemovedControl = aVisitedControls.indexOf(oControlToPop);

        if (aVisitedControls.length > 0) {
            oNavHistory.visitedControls = aVisitedControls.slice(iIndexOfRemovedControl + 1, oNavHistory.visitedControls.length);
            oNavHistory.indexOfCurrentlyDisplayedControl = oNavHistory.visitedControls.length - 1;
        }
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.addCenterViewPort = function (oControl) {
        var bIsInCenterViewPort = this._isInCenterViewPort(oControl);

        oControl.toggleStyleClass("hidden", true);
        oControl.addStyleClass("sapUshellViewPortItemSlideFrom");
        if (!bIsInCenterViewPort) {
            this.addAggregation('centerViewPort', oControl, true);
        }
        if (this.domRef && !bIsInCenterViewPort) {
            this.getRenderer().renderViewPortPart(oControl, this.domRef, 'centerViewPort');
        }
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.addLeftViewPort = function (oControl) {
        oControl.toggleStyleClass("hidden", true);
        if (this.domRef) {
            this.getRenderer().renderViewPortPart(oControl, this.domRef, 'leftViewPort');
        }
        this.addAggregation('leftViewPort', oControl, true);
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.addRightViewPort = function (oControl) {
        oControl.toggleStyleClass("hidden", true);
        if (this.domRef) {
            this.getRenderer().renderViewPortPart(oControl, this.domRef, 'rightViewPort');
        }
        this.addAggregation('rightViewPort', oControl, true);
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.setInitialCenterViewPort = function (oControl) {
        var sCurrentlyDisplayedControlId = this._getCurrentlyDispalyedControl('centerViewPort'),
            bIsInCenterViewPort = this._isInCenterViewPort(oControl);

        oControl.addStyleClass("sapUshellViewPortItemSlideFrom");
        //Avoid re-rendering the viewport part if the viewport container itself hasn't been rendered
        //or the target control has beed already added previously (the control is already rendered in such case)
        if (this.domRef && !bIsInCenterViewPort) {
            this.getRenderer().renderViewPortPart(oControl, this.domRef, 'centerViewPort');
        }
        this._setCurrentlyDisplayedControl('centerViewPort', oControl);
        if (!bIsInCenterViewPort) {
            this.addAggregation('centerViewPort', oControl, true);           
        }
       this.setAssociation('initialCenterViewPort', oControl, true);
        if (sCurrentlyDisplayedControlId && sCurrentlyDisplayedControlId !== oControl.getId()) {
            this.fireAfterNavigate({
                fromId: sCurrentlyDisplayedControlId,
                from: sap.ui.getCore().byId(sCurrentlyDisplayedControlId),
                to: sap.ui.getCore().byId(oControl),
                toId: oControl.getId()
            });
        }
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.setInitialLeftViewPort = function (oControl) {
        var sCurrentlyDisplayedControlId = this._getCurrentlyDispalyedControl('leftViewPort');

        this.addAggregation('leftViewPort', oControl, true);
        //oControl.toggleStyleClass("hidden", false);
        this._setCurrentlyDisplayedControl('leftViewPort', oControl);
        if (this.domRef) {
            this.getRenderer().renderViewPortPart(oControl, this.domRef, 'leftViewPort');
        }
        this.setAssociation('initialLeftViewPort', oControl, true);
        if (sCurrentlyDisplayedControlId && sCurrentlyDisplayedControlId !== oControl.getId()) {
            this.fireAfterNavigate({
                fromId: sCurrentlyDisplayedControlId,
                from: sap.ui.getCore().byId(sCurrentlyDisplayedControlId),
                to: sap.ui.getCore().byId(oControl),
                toId: oControl.getId()
            });
        }
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.setInitialRightViewPort = function (oControl) {
        var sCurrentlyDisplayedControlId = this._getCurrentlyDispalyedControl('rightViewPort');
        this.addAggregation('rightViewPort', oControl, true);
        //oControl.toggleStyleClass("hidden", false);
        this._setCurrentlyDisplayedControl('rightViewPort', oControl);
        if (this.domRef) {
            this.getRenderer().renderViewPortPart(oControl, this.domRef, 'rightViewPort');
        }
        this.setAssociation('initialRightViewPort', oControl, true);
        if (sCurrentlyDisplayedControlId && sCurrentlyDisplayedControlId !== oControl.getId()) {
            this.fireAfterNavigate({
                fromId: sCurrentlyDisplayedControlId,
                from: sap.ui.getCore().byId(sCurrentlyDisplayedControlId),
                to: sap.ui.getCore().byId(oControl),
                toId: oControl.getId()
            });
        }
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._isInViewPort = function (sViewPortId, oControl) {
        var aViewPortControls = this.getAggregation(sViewPortId),
            bIsInViewPort = aViewPortControls ? aViewPortControls.indexOf(oControl) > -1 : false;

        return bIsInViewPort;
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._isInCenterViewPort = function (oControl) {
        return this._isInViewPort('centerViewPort', oControl);
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._isInLeftViewPort = function (oControl) {
        return this._isInViewPort('leftViewPort', oControl);
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._isInRightViewPort = function (oControl) {
        return this._isInViewPort('rightViewPort', oControl);
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.getCurrentCenterPage = function () {
        return this._getCurrentlyDispalyedControl('centerViewPort');
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.getCurrentRightPage = function () {
        return this._getCurrentlyDispalyedControl('rightViewPort');
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.getCurrentLeftPage = function () {
        return this._getCurrentlyDispalyedControl('leftViewPort');
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.navTo = function (viewPortId, controlId, transitionName, data, oTransitionParameters) {
        var sCurrentlyDisplayedControlId = this._getCurrentlyDispalyedControl(viewPortId),
            aViewPortControls = this.getAggregation(viewPortId),
            bTargetControlFound = aViewPortControls.some(function (oControl, index) {
                if (oControl.getId() === controlId) {
                    return true;
                }
            });

        if (!bTargetControlFound) {
            jQuery.sap.log.error("ViewPort Container Error: Couldn't find target control");
        } else if (!sCurrentlyDisplayedControlId || sCurrentlyDisplayedControlId !== controlId) {
            var oTargetControl = sap.ui.getCore().byId(controlId);

            oTargetControl.toggleStyleClass("hidden", false);
            var fnOnTransitionFinished = function () {
                this.fireAfterNavigate({
                    toId: controlId,
                    to: controlId ? sap.ui.getCore().byId(controlId) : null,
                    fromId: sCurrentlyDisplayedControlId,
                    from: sCurrentlyDisplayedControlId ? sap.ui.getCore().byId(sCurrentlyDisplayedControlId) : null
                });
            }.bind(this);
            this._setCurrentlyDisplayedControl(viewPortId, oTargetControl, transitionName, fnOnTransitionFinished);
        }
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._getCurrentlyDispalyedControl = function (sViewPortId) {
        var oNavHistory = this._oViewPortsNavigationHistory[sViewPortId];

        return oNavHistory.visitedControls[oNavHistory.indexOfCurrentlyDisplayedControl];
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._setCurrentlyDisplayedControl = function (sViewPortId, oControl, transitionName, fnOnTransitionFinished) {
        var oNavHistory = this._oViewPortsNavigationHistory[sViewPortId],
            aVisitedControls = oNavHistory.visitedControls,
            sCurrentlyDisplayedControlId = this._getCurrentlyDispalyedControl(sViewPortId),
            oCurrentlyDisplayedControl = sCurrentlyDisplayedControlId ? sap.ui.getCore().byId(sCurrentlyDisplayedControlId) : null,
            sTransitionName = (sViewPortId === 'centerViewPort' && transitionName) ? transitionName : 'show';

        aVisitedControls.push(oControl.getId());
        oNavHistory.indexOfCurrentlyDisplayedControl = jQuery.isNumeric(oNavHistory.indexOfCurrentlyDisplayedControl) ? oNavHistory.indexOfCurrentlyDisplayedControl + 1 : 0;
        this._handleViewPortTransition(sViewPortId, sTransitionName, oControl, oCurrentlyDisplayedControl, fnOnTransitionFinished);
        this._updateTranslateXvalues();
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._handleSizeChange = function () {
        this._updateTranslateXvalues();
        var sTranslateX = this._getTranslateXValue(this.sCurrentState);

        if (this.getDomRef()) {
            jQuery(this.getDomRef()).css(this.bIsRTL ? 'right' : 'left', sTranslateX);
        }

        this.fixViewportScrollbars();
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._updateTranslateXvalues = function () {
        var oTheming = sap.ui.core.theming.Parameters,
            sLeftViewPortWidth,
            sRightViewPortWidth;

        if (window.matchMedia('(min-width: 1920px)').matches) {
            sLeftViewPortWidth = oTheming.get('sapUshellLeftViewPortWidthLarge');
            sRightViewPortWidth = oTheming.get('sapUshellRightViewPortWidthXXXLarge');
        } else if (window.matchMedia('(min-width: 1600px)').matches) {
            sLeftViewPortWidth = oTheming.get('sapUshellLeftViewPortWidthMedium');
            sRightViewPortWidth = oTheming.get('sapUshellRightViewPortWidthXXLarge');
        } else if (window.matchMedia('(min-width: 1440px)').matches) {
            sLeftViewPortWidth = oTheming.get('sapUshellLeftViewPortWidthMedium');
            sRightViewPortWidth = oTheming.get('sapUshellRightViewPortWidthXLarge');
        } else if (window.matchMedia('(min-width: 1280px)').matches) {
            sLeftViewPortWidth = oTheming.get('sapUshellLeftViewPortWidthMedium');
            sRightViewPortWidth = oTheming.get('sapUshellRightViewPortWidthLarge');
        } else if (window.matchMedia('(min-width: 1024px)').matches) {
            sLeftViewPortWidth = oTheming.get('sapUshellLeftViewPortWidthSmall');
            sRightViewPortWidth = oTheming.get('sapUshellRightViewPortWidthMedium');
        } else if (window.matchMedia('(min-width: 601px)').matches) {
            sLeftViewPortWidth =  oTheming.get('sapUshellLeftViewPortWidthSmall');
            sRightViewPortWidth = oTheming.get('sapUshellRightViewPortWidthSmall');
        } else if (window.matchMedia('(max-width : 600px)').matches) {
            // In case of smart-phones, the oTheming.get function returns "100%" instead of value in REMs,
            // so instead - we obtain the window.width
            sLeftViewPortWidth = jQuery(window).width() / parseFloat(jQuery("body").css("font-size"));
            sRightViewPortWidth = jQuery(window).width() / parseFloat(jQuery("body").css("font-size"));
        }

        this._updateStatesWithTranslateXvalues(sLeftViewPortWidth, sRightViewPortWidth);
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._updateStatesWithTranslateXvalues = function (sLeftViewPortWidth, sRightViewPortWith) {
        var iTempCalculation = 0,
            iLeftPosition;

        if (sLeftViewPortWidth !== null && sRightViewPortWith !== null) {
            this._states.Center.translateX = '-' + parseFloat(sLeftViewPortWidth) + 'rem';

            this._states.LeftCenter.translateX = "0";
            iTempCalculation =   -1 * (parseFloat(sLeftViewPortWidth) + parseFloat(sRightViewPortWith));

            this._states.RightCenter.translateX = iTempCalculation.toString() + 'rem';
            iLeftPosition = this._calculateRightViewPortLeftPosotion();

            jQuery(".sapUshellViewPortRight").css("left", iLeftPosition);
        }
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._calculateRightViewPortLeftPosotion = function () {
        var iLeftPosition = 0,
            iWindowWidth,
            iLeftViewPortWidth;

        iWindowWidth = jQuery(window).width();
        iLeftViewPortWidth = jQuery(".sapUshellViewPortLeft").width();

        iLeftPosition = iWindowWidth + iLeftViewPortWidth;

        return iLeftPosition;
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._handleViewPortTransition = function (sViewPortId, sTransitionName, oTargetControl, oCurrentlyDisplayedControl, fnOnTransitionFinished) {
        //Cureently viewport transition is supported only for center viewport.
        if (sViewPortId !== 'centerViewPort') {
            return;
        }
        if (!oCurrentlyDisplayedControl) {
            sTransitionName = 'show';
        }

        switch (sTransitionName) {
        case 'show':
            oTargetControl.toggleStyleClass("hidden", false);
            if (oCurrentlyDisplayedControl) {
                oCurrentlyDisplayedControl.toggleStyleClass("hidden");
            }
            if (fnOnTransitionFinished) {
                fnOnTransitionFinished();
            }
            break;
        case 'slide':
            oTargetControl.toggleStyleClass("hidden", false);
            setTimeout(function () {
                var jqTargetControl = jQuery(oTargetControl.getDomRef());

                jqTargetControl.css({
                    'transition' : "transform 0.4s",
                    '-webkit-transform' : "translateX(-100%)",
                    'transform' : "translateX(-100%)"
                });
                setTimeout(function () {
                    jqTargetControl.css({
                        'transition' : "transform 0s",
                        '-webkit-transform' : "translateX(0%)",
                        'transform' : "translateX(0%)"
                    });
                    oCurrentlyDisplayedControl.toggleStyleClass("hidden", true);
                    if (fnOnTransitionFinished) {
                        fnOnTransitionFinished();
                    }
                }, 500);
            }, 100);
            break;
        case 'slideBack':
            var jqCurrentlyDisplayedControl = jQuery('#' + this.getCurrentCenterPage());

            setTimeout(function () {
                jqCurrentlyDisplayedControl.css({
                    'transition' : "transform 0.7s",
                    '-webkit-transform' : "translateX(100%)",
                    'transform' :  "translateX(100%)"
                });
            },50);
            setTimeout(function () {
                oTargetControl.toggleStyleClass("hidden", false);
                setTimeout(function () {
                    if (oCurrentlyDisplayedControl) {
                        jqCurrentlyDisplayedControl.css({
                            'transition' : "transform 0s",
                            '-webkit-transform' : "translateX(0%)",
                            'transform' : "translateX(0%)"
                        });
                        oCurrentlyDisplayedControl.toggleStyleClass("hidden", true);
                    }
                    if (fnOnTransitionFinished) {
                        fnOnTransitionFinished();
                    }
                }, 200);
            }, 500);
            break;
        case 'fade':
            var jqTargetControl = jQuery(oTargetControl.getDomRef());

            if (oCurrentlyDisplayedControl) {
                var jqCurDispCtrl = jQuery(oCurrentlyDisplayedControl.getDomRef());
                jqCurDispCtrl.fadeToggle(250);
            }
            jqTargetControl.fadeIn(500, fnOnTransitionFinished ? fnOnTransitionFinished : null);
            break;
        }
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.onAfterRendering = function () {
        this.domRef = this.getDomRef();
        if (this.sCurrentState.indexOf("Center") == 0) {
            var rightViewId = this._states["Right"].visibleViewPortsData[0].viewPortId;
            jQuery(document.getElementById(rightViewId)).css("display", "none");
        }

    };
    sap.ushell.ui.launchpad.ViewPortContainer.prototype.onBeforeRendering = function () {
        this._updateTranslateXvalues();

    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.setDefaultState = function (sStateName) {
        this.setCurrentState(sStateName);
        // the 3. parameter supress rerendering
        this.setProperty("defaultState", sStateName, true);
    };
    
    /**
     * Handler for viewPort transitionend event, called after the viewPort's state was switched and the animation is finished
     * This handler sets the right/left property of the viewPort's DOM element css, as done by Alex Pashkov
     */
    sap.ushell.ui.launchpad.ViewPortContainer.prototype.endOfAnimationEventHandler = function () {
        var sTranslateX = this._states[this.sTargetState].translateX,
            oViewPortContainerElement = this.getDomRef();

        // Moving the viewPort
        jQuery(oViewPortContainerElement).css({
            '-webkit-transform' : "translateX(0%)",
            'transform' : "translateX(0%)",
            'transition' : "initial"
        });

        jQuery(oViewPortContainerElement).css(this.bIsRTL ? 'right' : 'left', sTranslateX);
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.switchState = function (sStateName) {
        var oViewPortContainerElement,
            aggrLst,
            toAggrNames = [],
            fromAggrNames = [],
            aggrIndex,
            iTanslateX;

        this.sTargetState = sStateName;
        if (sStateName !== this.sCurrentState) {
            var sTranslateX = this._getTranslateXValue(sStateName),
                aViewPortsDataBeforeSwitch = this._states[this.sCurrentState].visibleViewPortsData,
                aViewPortsDataAfterSwitch = this._states[sStateName].visibleViewPortsData,
                jqViewPortContainer = jQuery(this.getDomRef());

            if (sStateName.indexOf("Right") == 0) {
                var rightViewId = aViewPortsDataAfterSwitch[0].viewPortId;
                jQuery(document.getElementById(rightViewId)).css("display", "block");
            }

            //Clean styles of the previous state
            aViewPortsDataBeforeSwitch.forEach(function (item) {
                jqViewPortContainer.find('#' + item.viewPortId).removeClass(item.className);
            });

            this._handleCenterViewPortAnimation(sStateName);
            oViewPortContainerElement = this.getDomRef();

            if (this.bIsRTL) {
                iTanslateX = parseInt(sTranslateX, 10);
                iTanslateX = -iTanslateX;
                sTranslateX = iTanslateX.toString() + "rem";
            }

            // Moving the viewPort
            jQuery(oViewPortContainerElement).css({
                '-webkit-transform' : "translateX(" + sTranslateX + ")",
                'transform' : "translateX(" + sTranslateX + ")",
                'transition' : "transform 0.5s"
            });

            setTimeout(function () {
                this.endOfAnimationEventHandler();
            }.bind(this), 550);

            for (aggrIndex = 0; aggrIndex < this._states[this.sCurrentState].visibleViewPortsData.length; aggrIndex++) {
                fromAggrNames.push(this._states[this.sCurrentState].visibleViewPortsData[aggrIndex].viewPortId);
            }

            for (aggrIndex = 0; aggrIndex < this._states[sStateName].visibleViewPortsData.length; aggrIndex++) {
                toAggrNames.push(this._states[sStateName].visibleViewPortsData[aggrIndex].viewPortId);
            }

            setTimeout(function () {
                var ind = 0, aggrNamesInd;

                if (this.sCurrentState.indexOf("Center") == 0) {
                    var rightViewId = this._states["Right"].visibleViewPortsData[0].viewPortId;
                    jQuery(document.getElementById(rightViewId)).css("display", "none");
                }

                for (aggrNamesInd = 0; aggrNamesInd < fromAggrNames.length; aggrNamesInd++) {
                    aggrLst = this.getAggregation(fromAggrNames[aggrNamesInd]);

                    for (ind = 0; ind < aggrLst.length; ind++) {
                        if (aggrLst[ind].onViewStateHide) {
                            aggrLst[ind].onViewStateHide();
                        }
                    }
                }

                for (aggrNamesInd = 0; aggrNamesInd < toAggrNames.length; aggrNamesInd++) {
                    aggrLst = this.getAggregation(toAggrNames[aggrNamesInd]);

                    for (ind = 0; ind < aggrLst.length; ind++) {
                        if (aggrLst[ind].onViewStateShow) {
                            aggrLst[ind].onViewStateShow();
                        }
                    }
                }

                this.fixViewportScrollbars();

                aViewPortsDataAfterSwitch.forEach(function (item) {
                    jqViewPortContainer.find('#' + item.viewPortId).addClass(item.className);
                });
            }.bind(this), 700);

            jQuery('#' + aViewPortsDataBeforeSwitch[0].viewPortId).removeClass("active");

            var fnSwitchToCenter = function () {
                this.switchState('Center');
            }.bind(this);
            var fnSwitchLeftToCenter = function (e) {
                //left part consist of content and padding, padding is needed to see central part through it.
                //so we need to determine if click was on left container or on empty padding space
                var contentWidth = parseInt(window.getComputedStyle(e.currentTarget).width, 10);
                if (e.offsetX > contentWidth) {
                    this.switchState('Center');
                }
            }.bind(this);
            var jqCenterWrapper = jQuery(this.getDomRef()).find('.sapUshellViewPortWrapper');
            var jqLeftWrapper = jQuery(this.getDomRef()).find('.sapUshellViewPortLeft');

            if (sStateName !== 'Center') {
                //this click will work when we move to the right side "notification aria", when central part will be on top
                jqCenterWrapper.on('click', fnSwitchToCenter);
                jqCenterWrapper.addClass('sapUshellViewPortWrapperClickable');
                //this click will work when we move to the left side "Me aria", left container will be on top of central wrapper
                jqLeftWrapper.on('click', fnSwitchLeftToCenter);
            } else {
                jqCenterWrapper.off('click', fnSwitchToCenter);
                jqCenterWrapper.removeClass('sapUshellViewPortWrapperClickable');
                jqLeftWrapper.off('click', fnSwitchLeftToCenter);
            }

            this.setCurrentState(sStateName);
        }
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.fixViewportScrollbars = function () {
        var activeViewPort = this.getCurrentState(),
            viewPortData = this._states[activeViewPort].visibleViewPortsData;

        jQuery('#' + viewPortData[0].viewPortId).css("height", "100%");

        if (viewPortData[0].viewPortId === "leftViewPort") {
            if (this.bIsRTL) {
                var paddingLeft = window.innerWidth - jQuery("#leftViewPort").width();
                jQuery("#leftViewPort").css("padding-left", paddingLeft);
            } else {
                var paddingRight = window.innerWidth - jQuery("#leftViewPort").width();
                jQuery("#leftViewPort").css("padding-right", paddingRight);
            }
        }

        jQuery('#' + viewPortData[0].viewPortId).addClass("active");
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.setCurrentState = function (sStateName) {
        var sFromState = this.sCurrentState;
        this.sCurrentState = sStateName;
        this.fireAfterSwitchState({
            to: sStateName,
            from: sFromState
        });
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.getCurrentState = function () {
      return this.sCurrentState;
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.getViewPortControl = function (sViewPortId, sDesiredControlId) {
        var aViewPortControls = this.getAggregation(sViewPortId),
            index;

        if (aViewPortControls) {
            for (index = 0; index < aViewPortControls.length; index++) {
                if (aViewPortControls[index] && (aViewPortControls[index].getId() === sDesiredControlId)) {
                    return aViewPortControls[index];
                }
            }
        }

        return null;
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype.getViewPort = function (pageId) {
        var aPages = this.getCenterViewPort(),
            index;

        for (index = 0; index < aPages.length; index++) {
            if (aPages[index] && (aPages[index].getId() === pageId)) {
                return aPages[index];
            }
        }

        return null;
    };

    /**
     * Handling center viewPort animation.
     * Adding and removing style classes to the center viewPort according to the viewPort movement.,
     * Considering also the boolean flag bShiftCenterTransition
     *  indicating whether the center viewPort should be moved further to the right
     *  in order to compensate for the notifications preview area.
     */
    sap.ushell.ui.launchpad.ViewPortContainer.prototype._handleCenterViewPortAnimation = function (sNewState) {
        var centerViewPortJQueryObj = this._getCenterViewPortJQueryObject(),
            bShiftCenterTransition = this._shiftCenterTransition();

        // If switching from the center viewPort to the right or to the left - then animation class is added
        if (this.sCurrentState === "Center") {
            if (sNewState === "RightCenter") {
                if (bShiftCenterTransition === true) {
                    centerViewPortJQueryObj.addClass('sapUshellScaledShiftedCenterWhenInRightViewPort');
                } else {
                    centerViewPortJQueryObj.addClass('sapUshellScaledCenterWhenInRightViewPort');
                }
            } else if (sNewState === "LeftCenter") {
                centerViewPortJQueryObj.addClass('sapUshellScaledCenterWhenInLeftViewPort');
            }

        // If switching from the right or the left to the center viewPort - then animation classes should be removed
        } else if (sNewState === "Center") {
            if (this.sCurrentState === "RightCenter") {
                centerViewPortJQueryObj.removeClass('sapUshellScaledCenterWhenInRightViewPort');
                centerViewPortJQueryObj.removeClass('sapUshellScaledShiftedCenterWhenInRightViewPort');
            } else if (this.sCurrentState === "LeftCenter") {
                centerViewPortJQueryObj.removeClass('sapUshellScaledCenterWhenInLeftViewPort');
            }
        } else if ((this.sCurrentState === "LeftCenter") && (sNewState === "RightCenter")) {
            if (bShiftCenterTransition === true) {
                centerViewPortJQueryObj.addClass('sapUshellScaledShiftedCenterWhenInRightViewPort');
            } else {
                centerViewPortJQueryObj.addClass('sapUshellScaledCenterWhenInRightViewPort');
            }
            centerViewPortJQueryObj.removeClass('sapUshellScaledCenterWhenInLeftViewPort');
        } else if ((this.sCurrentState === "RightCenter") && (sNewState === "LeftCenter")) {
		    centerViewPortJQueryObj.addClass('sapUshellScaledCenterWhenInLeftViewPort');
		    centerViewPortJQueryObj.removeClass('sapUshellScaledCenterWhenInRightViewPort');
		    centerViewPortJQueryObj.removeClass('sapUshellScaledShiftedCenterWhenInRightViewPort');
        }
    };

    /**
     * Determines whether the center view port will need to be moved in order to compensate for smaller dashboard.
     * For example: If NotificationsPreview is enabled. In this case the dashboard is smaller in width,
     * hence, when it is being scaled, it also needs to be shifted in order to "compensate" for the area of the notifications preview
     */
    sap.ushell.ui.launchpad.ViewPortContainer.prototype.shiftCenterTransitionEnabled = function (bEnabled) {
        this.bShiftCenterTransitionEnabled = bEnabled;
    };

    /**
     * When notifications preview area exists at the right side of the dashboard:
     * When the viewPort switches to rightCenter state - there should be wider movement of the (scaled) center to the right
     * in order to cover the notifications preview area
     */
    sap.ushell.ui.launchpad.ViewPortContainer.prototype.shiftCenterTransition = function (bShift) {
        this.bShiftCenterTransition = bShift;
    };

    /**
     * Whether the center view port needs to be shifted in order to compensate for smaller dashboard.
     * Returns true if Notifications are enabled, and if shifting is enabled and currently needed (according to the state, the shown page, etc..)
     */
    sap.ushell.ui.launchpad.ViewPortContainer.prototype._shiftCenterTransition = function () {
        return sap.ushell.Container.getService("Notifications").isEnabled() &&
               this.bShiftCenterTransitionEnabled &&
               this.bShiftCenterTransition;
    };

    sap.ushell.ui.launchpad.ViewPortContainer.prototype._getCenterViewPortJQueryObject = function () {
        var jqViewPortContainer = jQuery(this.getDomRef()),
            centerViewPortId = this._states.Center.visibleViewPortsData[0].viewPortId,
            centerViewPortJQueryObj = jqViewPortContainer.find('#' + centerViewPortId);

        return centerViewPortJQueryObj;
    };

    /**
     * Calculate the required offset (in rem) of the viewPort.
     * There are two options:
     * 1. When sTargetStateName and this.sCurrentState are the same, for example on initial loading
     * 2. When there is a switch in state and sTargetStateName doesn't equal this.sCurrentState,
     *    in this case the result is the delta between the TranslateX values of the two.
     *
     * @param {string} sTargetStateName The state to which the viewPort switches
     *
     * @param {string} sGivenCurrentStateName The current state of the viewPort -
     *        this parameter is required since in some cases this.sCurrentState equals sTargetStateName
     *        and we still need the previous state for correct calculation of the offset
     *
     * @return {string} the required X offset of the viewPort in rem
     */
    sap.ushell.ui.launchpad.ViewPortContainer.prototype._getTranslateXValue = function (sTargetStateName, sGivenCurrentStateName) {
        var sTargetStateTranslateX = this._states[sTargetStateName].translateX,
            sCurrentStateTranslateX,
            iTargetStateTranslateX,
            iCurrentStateTranslateX;

        if (sGivenCurrentStateName !== undefined) {
            sCurrentStateTranslateX = this._states[sGivenCurrentStateName].translateX;
        } else {
            sCurrentStateTranslateX = this._states[this.sCurrentState].translateX;
        }

        // In order to calculate the delta of the two TranslateX values - we need them as integers
        iCurrentStateTranslateX = parseInt(sCurrentStateTranslateX, 10);
        iTargetStateTranslateX = parseInt(sTargetStateTranslateX, 10);

        if (!sGivenCurrentStateName && (sTargetStateName === this.sCurrentState)) {
            return sTargetStateTranslateX;
        }
        return (iTargetStateTranslateX - iCurrentStateTranslateX).toString() + "rem";
    };

    sap.ushell.ui.launchpad.ViewPortContainer.transitions = sap.ushell.ui.launchpad.ViewPortContainer.transitions || {};
}());
