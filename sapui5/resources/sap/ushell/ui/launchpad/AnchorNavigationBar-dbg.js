/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.launchpad.AnchorNavigationBar.
jQuery.sap.declare("sap.ushell.ui.launchpad.AnchorNavigationBar");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.m.Bar");


/**
 * Constructor for a new ui/launchpad/AnchorNavigationBar.
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
 * <li>{@link #getAccessibilityLabel accessibilityLabel} : string</li>
 * <li>{@link #getSelectedItemIndex selectedItemIndex} : int (default: 0)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getGroups groups} : sap.ushell.ui.launchpad.AnchorItem[]</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul>
 * <li>{@link sap.ushell.ui.launchpad.AnchorNavigationBar#event:afterRendering afterRendering} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li>
 * <li>{@link sap.ushell.ui.launchpad.AnchorNavigationBar#event:itemPress itemPress} : fnListenerFunction or [fnListenerFunction, oListenerObject] or [oData, fnListenerFunction, oListenerObject]</li></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.m.Bar#constructor sap.m.Bar}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Add your documentation for the newui/launchpad/AnchorNavigationBar
 * @extends sap.m.Bar
 * @version 1.38.26
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.Bar.extend("sap.ushell.ui.launchpad.AnchorNavigationBar", { metadata : {

	library : "sap.ushell",
	properties : {

		/**
		 * A value for an optional accessibility label
		 */
		"accessibilityLabel" : {type : "string", group : "", defaultValue : null},

		/**
		 */
		"selectedItemIndex" : {type : "int", group : "Misc", defaultValue : 0}
	},
	aggregations : {

		/**
		 */
		"groups" : {type : "sap.ushell.ui.launchpad.AnchorItem", multiple : true, singularName : "group"}
	},
	events : {

		/**
		 */
		"afterRendering" : {}, 

		/**
		 */
		"itemPress" : {}
	}
}});


/**
 * Creates a new subclass of class sap.ushell.ui.launchpad.AnchorNavigationBar with name <code>sClassName</code> 
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
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar.extend
 * @function
 */

sap.ushell.ui.launchpad.AnchorNavigationBar.M_EVENTS = {'afterRendering':'afterRendering','itemPress':'itemPress'};


/**
 * Getter for property <code>accessibilityLabel</code>.
 * A value for an optional accessibility label
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>accessibilityLabel</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#getAccessibilityLabel
 * @function
 */

/**
 * Setter for property <code>accessibilityLabel</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sAccessibilityLabel  new value for property <code>accessibilityLabel</code>
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#setAccessibilityLabel
 * @function
 */


/**
 * Getter for property <code>selectedItemIndex</code>.
 *
 * Default value is <code>0</code>
 *
 * @return {int} the value of property <code>selectedItemIndex</code>
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#getSelectedItemIndex
 * @function
 */

/**
 * Setter for property <code>selectedItemIndex</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {int} iSelectedItemIndex  new value for property <code>selectedItemIndex</code>
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#setSelectedItemIndex
 * @function
 */


/**
 * Getter for aggregation <code>groups</code>.<br/>
 * 
 * @return {sap.ushell.ui.launchpad.AnchorItem[]}
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#getGroups
 * @function
 */


/**
 * Inserts a group into the aggregation named <code>groups</code>.
 *
 * @param {sap.ushell.ui.launchpad.AnchorItem}
 *          oGroup the group to insert; if empty, nothing is inserted
 * @param {int}
 *             iIndex the <code>0</code>-based index the group should be inserted at; for 
 *             a negative value of <code>iIndex</code>, the group is inserted at position 0; for a value 
 *             greater than the current size of the aggregation, the group is inserted at 
 *             the last position        
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#insertGroup
 * @function
 */

/**
 * Adds some group <code>oGroup</code> 
 * to the aggregation named <code>groups</code>.
 *
 * @param {sap.ushell.ui.launchpad.AnchorItem}
 *            oGroup the group to add; if empty, nothing is inserted
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#addGroup
 * @function
 */

/**
 * Removes an group from the aggregation named <code>groups</code>.
 *
 * @param {int | string | sap.ushell.ui.launchpad.AnchorItem} vGroup the group to remove or its index or id
 * @return {sap.ushell.ui.launchpad.AnchorItem} the removed group or null
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#removeGroup
 * @function
 */

/**
 * Removes all the controls in the aggregation named <code>groups</code>.<br/>
 * Additionally unregisters them from the hosting UIArea.
 * @return {sap.ushell.ui.launchpad.AnchorItem[]} an array of the removed elements (might be empty)
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#removeAllGroups
 * @function
 */

/**
 * Checks for the provided <code>sap.ushell.ui.launchpad.AnchorItem</code> in the aggregation named <code>groups</code> 
 * and returns its index if found or -1 otherwise.
 *
 * @param {sap.ushell.ui.launchpad.AnchorItem}
 *            oGroup the group whose index is looked for.
 * @return {int} the index of the provided control in the aggregation if found, or -1 otherwise
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#indexOfGroup
 * @function
 */
	

/**
 * Destroys all the groups in the aggregation 
 * named <code>groups</code>.
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#destroyGroups
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#afterRendering
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'afterRendering' event of this <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#attachAfterRendering
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'afterRendering' event of this <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#detachAfterRendering
 * @function
 */

/**
 * Fire event afterRendering to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#fireAfterRendering
 * @function
 */


/**
 *
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#itemPress
 * @event
 * @param {sap.ui.base.Event} oControlEvent
 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
 * @param {object} oControlEvent.getParameters
 * @public
 */
 
/**
 * Attach event handler <code>fnFunction</code> to the 'itemPress' event of this <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>.<br/>.
 * When called, the context of the event handler (its <code>this</code>) will be bound to <code>oListener<code> if specified
 * otherwise to this <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>.<br/> itself. 
 *  
 *
 * @param {object}
 *            [oData] An application specific payload object, that will be passed to the event handler along with the event object when firing the event.
 * @param {function}
 *            fnFunction The function to call, when the event occurs.  
 * @param {object}
 *            [oListener] Context object to call the event handler with. Defaults to this <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>.<br/> itself.
 *
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#attachItemPress
 * @function
 */

/**
 * Detach event handler <code>fnFunction</code> from the 'itemPress' event of this <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>.<br/>
 *
 * The passed function and listener object must match the ones used for event registration.
 *
 * @param {function}
 *            fnFunction The function to call, when the event occurs.
 * @param {object}
 *            oListener Context object on which the given function had to be called.
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @public
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#detachItemPress
 * @function
 */

/**
 * Fire event itemPress to attached listeners.
 *
 * @param {Map} [mArguments] the arguments to pass along with the event.
 * @return {sap.ushell.ui.launchpad.AnchorNavigationBar} <code>this</code> to allow method chaining
 * @protected
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar#fireItemPress
 * @function
 */

// Start of sap/ushell/ui/launchpad/AnchorNavigationBar.js
/**
 * @name sap.ushell.ui.launchpad.AnchorNavigationBar
 *
 * @private
 */
/*global jQuery, sap*/

(function () {
    "use strict";
    jQuery.sap.require("sap.ushell.override");


    // Overwrite update function (version without filter/sort support)
    var fnUpdateGroups = sap.ushell.override.updateAggregatesFactory("groups");
    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.updateGroups = function () {
        fnUpdateGroups.apply(this, arguments);
        if (this.getDomRef() && this.getGroups().length) {
            this.reArrangeNavigationBarElements();
        }
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.init = function () {
        sap.ui.Device.resize.attachHandler(this.reArrangeNavigationBarElements, this);
        this.bGroupWasPressed = false;
        this.bIsRtl = sap.ui.getCore().getConfiguration().getRTL();

    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.onAfterRendering = function () {
        this.reArrangeNavigationBarElements();
        var selectedItemIndex = this.getSelectedItemIndex() || 0;
        //call adjustItemSelection with timeout since after deletion of group
        //the dashboard scrolls and changes the selection wrongly
        //so wait a bit for the scroll and then adjust the selection
        setTimeout(function () {
            this.adjustItemSelection(selectedItemIndex);
        }.bind(this), 100);

        var aGroups = this.getGroups(),
            that = this;

        jQuery.each(aGroups, function (index, aGroup) {
            this.attachPress(function (oEvent) {
                that.fireItemPress({group: oEvent.getSource()});
                that.bGroupWasPressed = true;
            });
        });
        jQuery(".sapUshellAnchorNavigationBarItemsScroll").scroll(this.setNavigationBarItemsVisibility.bind(this));
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.closeOverflowPopup = function () {
        this.oPopover.close();
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.reArrangeNavigationBarElements = function () {
        this.anchorItems =  this.getVisibleGroups();
        var selectedItemIndex = this.getSelectedItemIndex() || 0;

        if (this.anchorItems.length) {
            //Make sure only one item is selected at a time
            this.adjustItemSelection(selectedItemIndex);
        }

        if (sap.ui.Device.system.phone && this.anchorItems.length) {
            this.anchorItems.forEach(function (oItem, index) {
                oItem.setIsGroupVisible(false);
            });
            this.anchorItems[this.getSelectedItemIndex()].setIsGroupVisible(true);
        } else {
            setTimeout(function () {
                this.setNavigationBarItemsVisibility();
            }.bind(this), 200);
        }
        this._adjustAnchorBarAriaProperties(this.anchorItems);
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype._scrollToGroupByGroupIndex = function (groupIndex) {
        var anchorBar = sap.ui.Device.system.tablet ? jQuery(".sapUshellAnchorNavigationBarItemsScroll") : jQuery(".sapUshellAnchorNavigationBarItems"),
            anchorBarOffset = anchorBar.offset() ? anchorBar.offset().left : 0,
            jsSelectedItem = this.anchorItems[groupIndex].getDomRef(),
            selectedItemOffset,
            scrollValueX;
        if (jsSelectedItem) {
            selectedItemOffset = jsSelectedItem.offsetLeft;
            //In RTL offsetLeft of the container and the inner item is not enough to calculate the scrollLeft position
            //Since the offsets of the elements can get large negative values, but scrollLeft will be always set to 0 in case of negative value
            //In order to calculate the relative scroll position of item inside the anchor bar, we calculate here the overall
            //Width of the anchor items and then add the selected group offset to it, by that preventing the scroll value from getting negative
            scrollValueX = this.bIsRtl ? this._normalizeScrollBarWidth() + selectedItemOffset + 64 : selectedItemOffset - anchorBarOffset - 48; // add 2rem space + 1rem padding for the left overflow arrow
            anchorBar.animate({scrollLeft : scrollValueX}, 200, this.setNavigationBarItemsVisibility.bind(this));
        }
    };
    /*
        Sums and returns all anchor items width values
     */
    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype._normalizeScrollBarWidth = function () {
        var iLastItemOffset = this.anchorItems[this.anchorItems.length - 1].getDomRef().offsetLeft,
            iFirstItemOffset = this.anchorItems[0].getDomRef().offsetLeft,
            iTotalItemsWidth = Math.abs(iLastItemOffset) - Math.abs(iFirstItemOffset);
            return iTotalItemsWidth;
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.setNavigationBarItemsVisibility = function () {
        if (!sap.ui.Device.system.phone) {
            //check if to show or hide the popover overflow button
            if (this.anchorItems.length && (!this.isMostRightAnchorItemVisible() || !this.isMostLeftAnchorItemVisible()) || sap.ui.Device.system.phone) {
                this.oOverflowButton.removeStyleClass("sapUshellShellHidden");
                jQuery('.sapUshellAnchorItemOverFlow').removeClass("sapUshellShellHidden");
            } else if (this.oOverflowButton) {
                this.oOverflowButton.addStyleClass("sapUshellShellHidden");
                jQuery('.sapUshellAnchorItemOverFlow').addClass("sapUshellShellHidden");
            }
            //add left / right overflow indication on anchor items with respect to locale direction
            if (this.bIsRtl) {
                if (this.anchorItems.length && !this.isMostLeftAnchorItemVisible()) {
                    this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden");
                    jQuery(".sapUshellAnchorNavigationBarItems").addClass("sapUshellOverflowLeft");
                } else if (this.oOverflowRightButton) {
                    this.oOverflowRightButton.addStyleClass("sapUshellShellHidden");
                    jQuery(".sapUshellAnchorNavigationBarItems").removeClass("sapUshellOverflowLeft");
                }
                if (this.anchorItems.length && !this.isMostRightAnchorItemVisible()) {
                    this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden");
                    jQuery(".sapUshellAnchorNavigationBarItems").addClass("sapUshellOverflowRight");
                } else if (this.oOverflowLeftButton) {
                    this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden");
                    jQuery(".sapUshellAnchorNavigationBarItems").removeClass("sapUshellOverflowRight");
                }
            } else {

                if (this.anchorItems.length && !this.isMostLeftAnchorItemVisible()) {
                    this.oOverflowLeftButton.removeStyleClass("sapUshellShellHidden");
                    jQuery(".sapUshellAnchorNavigationBarItems").addClass("sapUshellOverflowLeft");
                } else if (this.oOverflowLeftButton) {
                    this.oOverflowLeftButton.addStyleClass("sapUshellShellHidden");
                    jQuery(".sapUshellAnchorNavigationBarItems").removeClass("sapUshellOverflowLeft");
                }
                if (this.anchorItems.length && !this.isMostRightAnchorItemVisible()) {
                    this.oOverflowRightButton.removeStyleClass("sapUshellShellHidden");
                    jQuery(".sapUshellAnchorNavigationBarItems").addClass("sapUshellOverflowRight");
                } else if (this.oOverflowRightButton) {
                    this.oOverflowRightButton.addStyleClass("sapUshellShellHidden");
                    jQuery(".sapUshellAnchorNavigationBarItems").removeClass("sapUshellOverflowRight");
                }
            }

            //remove the left padding from the first visible item
            jQuery(".sapUshellAnchorItem.firstItem").removeClass("firstItem");
            var jqFirstVisibleItem = jQuery(".sapUshellAnchorItem:visible").first();
            jqFirstVisibleItem.addClass("firstItem");
        } else {
            if (this.anchorItems.length) {
                this.oOverflowButton.removeStyleClass("sapUshellShellHidden");
                var selectedItemIndex = this.getSelectedItemIndex() || 0;
                this.oPopover.setTitle(this.anchorItems[selectedItemIndex].getTitle());
            }
        }
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.adjustItemSelection = function (iSelectedIndex) {
        setTimeout(function () {
            if (this.anchorItems && this.anchorItems.length) {
                this.anchorItems.forEach(function (oItem) {
                    oItem.setSelected(false);
                });
                this.anchorItems[iSelectedIndex].setSelected(true);

                //scroll to group
                this._scrollToGroupByGroupIndex(iSelectedIndex);
            }
        }.bind(this), 200);
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.isMostRightAnchorItemVisible = function () {
        var jqNavigationBar = jQuery('.sapUshellAnchorNavigationBar'),
            navigationBarWidth = !jQuery.isEmptyObject(jqNavigationBar) ? jqNavigationBar.width() : 0,
            navigationBarOffset = !jQuery.isEmptyObject(jqNavigationBar) && jqNavigationBar.offset() ?
                jqNavigationBar.offset().left : 0,
            lastItem = this.bIsRtl ? this.anchorItems[0].getDomRef() : this.anchorItems[this.anchorItems.length - 1].getDomRef(),
            lastItemWidth = !jQuery.isEmptyObject(lastItem) ? jQuery(lastItem).width() : 0,
            lastItemOffset;
        //when the anchor bar isn't visible, the items gets negative width
        //use the minimal width for items instead
        if (lastItemWidth < 0) {
            lastItemWidth = 80;
        }
        lastItemOffset = lastItem && jQuery(lastItem).offset() ? jQuery(lastItem).offset().left : 0;

        //last item is completely shown in the navigation bar
        if (lastItemOffset + lastItemWidth <= navigationBarOffset +  navigationBarWidth) {
            return true;
        }
        return false;
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.isMostLeftAnchorItemVisible = function () {
        var jqNavigationBar = jQuery('.sapUshellAnchorNavigationBar'),
            navigationBarOffsetLeft = !jQuery.isEmptyObject(jqNavigationBar) && jqNavigationBar.offset() ? jqNavigationBar.offset().left : 0,
            firstItem = this.bIsRtl ? this.anchorItems[this.anchorItems.length - 1].getDomRef() : this.anchorItems[0].getDomRef(),
            firstItemOffset = !jQuery.isEmptyObject(firstItem) && jQuery(firstItem).offset() ? jQuery(firstItem).offset().left : 0;

        //last item is not completely shown in the navigation bar
        if (firstItemOffset >= navigationBarOffsetLeft) {
            return true;
        }
        return false;
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.setSelectedItemIndex = function (iSelectedIndex) {
        if (iSelectedIndex !== undefined) {
            this.setProperty("selectedItemIndex", iSelectedIndex, true);
        }
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype._getOverflowLeftArrowButton = function () {
        this.oOverflowLeftButton = new sap.m.Button({
            icon: 'sap-icon://slim-arrow-left',
            tooltip: sap.ushell.resources.i18n.getText("scroll_beginning"),
            press: function (oEvent) {
                this._scrollToGroupByGroupIndex(0);
            }.bind(this)
        }).addStyleClass("sapUshellShellHidden");

        return this.oOverflowLeftButton;
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype._getOverflowRightArrowButton = function () {
        this.oOverflowRightButton = new sap.m.Button({
            icon: 'sap-icon://slim-arrow-right',
            tooltip: sap.ushell.resources.i18n.getText("scroll_end"),
            press: function (oEvent) {
                this._scrollToGroupByGroupIndex(this.anchorItems.length - 1);
            }.bind(this)
        }).addStyleClass("sapUshellShellHidden");

        return this.oOverflowRightButton;
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype._getOverflowButton = function () {
        var that = this,
            oList;

        oList = new sap.m.List({
            mode: sap.m.ListMode.SingleSelectMaster,
            rememberSelections: false,
            selectionChange: function (oEvent) {
                that.fireItemPress({group: oEvent.getParameter('listItem')});
                that.oPopover.close();
            }
        });


        this.oPopover = new sap.m.Popover({
            showArrow: false,
            showHeader: false,
            placement: sap.m.PlacementType.Bottom,
            content: [oList],
            horizontalScrolling: false,
            beforeOpen: function () {
                jQuery('.sapUshellAnchorItemOverFlow').addClass("sapUshellAnchorItemOverFlowOpen");
                //place the popover under the overflow button
                var jqOverflowBtn = jQuery(".sapUshellAnchorItemOverFlow"),
                    bIsRtl = sap.ui.getCore().getConfiguration().getRTL(),
                    rightPos = bIsRtl ? "auto" : jQuery(window).width() - (jqOverflowBtn.offset().left + jqOverflowBtn.outerWidth()) + 'px',
                    leftPos = bIsRtl ? jqOverflowBtn.offset().left + 'px': "auto";
                setTimeout(function () {
                    jQuery(this.getDomRef()).css({
                        'right': rightPos , 'left': leftPos
                    });
                }.bind(this), 0);
            },
            afterClose: function () {
                jQuery('.sapUshellAnchorItemOverFlow').removeClass("sapUshellAnchorItemOverFlowOpen");
                jQuery('.sapUshellAnchorItemOverFlow').toggleClass("sapUshellAnchorItemOverFlowPressed", false);
            }
        }).addStyleClass("sapUshellAnchorItemsPopover")
            .addStyleClass('sapContrastPlus');

        this.oOverflowButton = new sap.m.Button({
            icon: 'sap-icon://slim-arrow-down',
            tooltip: sap.ushell.resources.i18n.getText("more_groups"),
            press: function (oEvent) {
                that.anchorItems = that.getVisibleGroups();
                oList.destroyItems();
                that.anchorItems.forEach(function (oGroup) {
                    var item = new sap.ushell.ui.launchpad.GroupListItem({
                        title: oGroup.getTitle(),
                        groupId: oGroup.getGroupId(),
                        type: sap.m.ListType.Active
                    });

                    if (oGroup.sId === jQuery(".sapUshellAnchorItemSelected").attr("id")) {
                        item.addStyleClass("sapUshellAnchorPopoverItemSelected");
                    } else {
                        item.addStyleClass("sapUshellAnchorPopoverItemNonSelected");
                    }
                    oList.addItem(item);
                });
                that.oPopover.openBy(this);
                jQuery('.sapUshellAnchorItemOverFlow').toggleClass("sapUshellAnchorItemOverFlowPressed", true);
            }
        }).addStyleClass("sapUshellShellHidden").addStyleClass('sapContrastPlus');
        return this.oOverflowButton;
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype.getVisibleGroups = function () {
        return this.getGroups().filter(function (oGroup) {
            return oGroup.getVisible();
        });
    };

    sap.ushell.ui.launchpad.AnchorNavigationBar.prototype._adjustAnchorBarAriaProperties = function (aGroups) {
        var i;

        for (i = 0; i < aGroups.length; i++) {
            var jsGroup = jQuery(aGroups[i].getDomRef());
            jsGroup.attr("aria-posinset", i + 1);
            jsGroup.attr("aria-setsize", aGroups.length);
        }
    };
}());
