/*!
 * ${copyright}
 */
/*global jQuery, sap */
/**
 * Provides control sap.ushell.ui.shell.ShellNavigationMenu
 */
sap.ui.define(['jquery.sap.global', 'sap/ushell/library', 'sap/m/FlexBox', 'sap/m/List'],
    function (jQuery) {
        "use strict";

        var ShellNavigationMenu = sap.ui.core.Control.extend("sap.ushell.ui.shell.ShellNavigationMenu",
            {
                metadata: {
                    properties: {
                    },
                    aggregations : {
                        items:     {type : "sap.m.ListItem", group : "Misc", defaultValue : null, singularName: "item"},

                        /**
                         * Mini-Tiles aggregation is currently limited to 9 items, as decided by UX
                         */
                        miniTiles: {type : "sap.ushell.ui.shell.NavigationMiniTile", group : "Misc", defaultValue : null, singularName: "miniTile"}
                    },
                    events: {
                    }
                },
                renderer: {
                    render:  function (oRm, oControl) {

                        oRm.write('<div  tabindex="0" ');
                        oRm.writeControlData(oControl);
                        oRm.write('>');

                        // hierarchy list items
                        oRm.write('<div  tabindex="0" id="hierarchyItems" >');
                        oRm.renderControl(oControl.oItemsList);
                        oRm.write('</div>');

                        // render the text-bar-tab control only in case we have mini-tiles (related apps)
                        var aMiniTiles = oControl.getMiniTiles();
                        if (aMiniTiles && aMiniTiles.length > 0) {
                            oRm.renderControl(oControl.oTextTabBar);
                        }
                        oRm.write('</div>');
                    }
                }
            });


        /************************************** Start: Keyboard Navigation **************************************/

        var KeyboardNavigation = function (oMiniTilesBox) {
            this.init(oMiniTilesBox);
        };

        KeyboardNavigation.prototype.init = function(oMiniTilesBox) {
            this.keyCodes = jQuery.sap.KeyCodes;
            this.jqElement = oMiniTilesBox.$();
            this.jqElement.on('keydown.keyboardNavigation', this.keydownHandler.bind(this));
        };

        KeyboardNavigation.prototype.destroy = function () {
            if (this.jqElement) {
                this.jqElement.off(".keyboardNavigation");
            }
            delete this.jqElement;
        };


        KeyboardNavigation.prototype.keydownHandler = function(e) {
            switch (e.keyCode) {
                case this.keyCodes.ARROW_UP:
                    this.upDownHandler(e, true);
                    break;
                case this.keyCodes.ARROW_DOWN:
                    this.upDownHandler(e, false);
                    break;
                case this.keyCodes.ARROW_LEFT:
                    this.leftRightHandler(e, false);
                    break;
                case this.keyCodes.ARROW_RIGHT:
                    this.leftRightHandler(e, true);
                    break;
                case this.keyCodes.HOME:
                    this.homeEndHandler(e, true);
                    break;
                case this.keyCodes.END:
                    this.homeEndHandler(e, false);
                    break;
                case this.keyCodes.PAGE_UP:
                    this.pageUpDownHandler(e, true);
                    break;
                case this.keyCodes.PAGE_DOWN:
                    this.pageUpDownHandler(e, false);
                    break;
                default : break;
            }
        };

        KeyboardNavigation.prototype.pageUpDownHandler = function (e, isPageUp) {
            var jqFocused = jQuery(document.activeElement);
            if (!jqFocused.hasClass("sapUshellNavMiniTile")) {
                return false;
            }
            // implement if needed
        };


        KeyboardNavigation.prototype.upDownHandler = function (e, isUp) {
            // implement
            var jqFocused = jQuery(document.activeElement);
            if (!jqFocused.hasClass("sapUshellNavMiniTile")) {
                return false;
            }

            /**
             * as the structure of the content is
             *
             * FlexBox  -
             *          - FlexItem (no tab index) -> miniTile (tab index)
             *              .
             *              .
             *              .
             *          - FlexItem (no tab index) -> miniTile (tab index)
             *
             *
             * And we focus on the inner mini tile object, we must go up (by calling .parent()) 
             * 2 tiles in order to gain reference to the parent container of all items
             * in order to calculate the indexes correctly
             */
            var jqParent = jqFocused.parent().parent();
            var currentItemIndex = jqFocused.parent().index();
            var jqParentItems = jqParent.children();
            var nextIndex;

            // up/down navigates between rows, so we must add / subtract 3 from the index
            // as there are always 3 tiles in a row (maximum)
            if (isUp) {

                nextIndex = currentItemIndex - 3;
                if (nextIndex < 0) {
                    nextIndex += 9;
                }

            } else {
                nextIndex = (currentItemIndex + 3) % jqParentItems.length;
            }

            var nextFocus = jqParentItems[nextIndex].children[0];
            this._swapItemsFocus(e, jqFocused, nextFocus);
        };

        KeyboardNavigation.prototype.leftRightHandler = function (e, isRight) {
            var fName = isRight ? "next" : "prev";
            var jqFocused = jQuery(document.activeElement);
            if (!jqFocused.hasClass("sapUshellNavMiniTile")) {
                return false;
            }

            // Each tile rendered within a Flex-Item which DO NOT HAVE tab-index. (only the inner Mini-tile container has tabindex)
            // therefore if we trigger next/prev() selectors directly on the inner div (which is the mini-tile)
            // we will not find the next one.
            // We must go one level up (by parent()) afterwards, run the selector and the actual item to focus on
            // it the inner div (as explained before), therefore the next item for focus resides under children() selector
            var nextFlexItem = jqFocused.parent()[fName]();
            var nextFocus = nextFlexItem.children();
            if (!nextFocus.length) {
                return false;
            }

            this._swapItemsFocus(e, jqFocused, nextFocus);
        };

        /* Home/End switch from the first to last mini-tile */
        KeyboardNavigation.prototype.homeEndHandler = function (e, isHome) {
            var fName = isHome ? "first" : "last";
            var jqFocused = jQuery(document.activeElement);
            if (!jqFocused.hasClass("sapUshellNavMiniTile")) {
                return false;
            }
            e.preventDefault();
            var nextFocus = this.jqElement.find(".sapUshellNavMiniTile")[fName]();
            this._swapItemsFocus(e, jqFocused, nextFocus);
        };

        /* switch focus between items */
        KeyboardNavigation.prototype._swapItemsFocus = function (e, jqItemFrom, jqItemTo) {
            //to preserve last focusable item, first item received tabindex=-1, second tabindex=-1.
            e.preventDefault();
            jqItemTo.focus();
        };

        /************************************** Shell Navigation Menu **************************************/

        ShellNavigationMenu.prototype.init = function () {

            // private list member which renders the items aggregation of this control
            this.oItemsList = new sap.m.List("sapUshellNavHierarchyItems");

            // private flex-box member which renders the mini-tiles aggregation of this control
            this.oMiniTilesBox =  new sap.m.FlexBox("sapUshellNavRelatedAppsFlexBox");
        };

        /* before open method:
           this is done from performance reasons, to lazy-load the non-necessary resources */
        ShellNavigationMenu.prototype._beforeOpen = function () {

            if (!this.bInitialized) {

                this.oMiniTilesTab = new sap.m.IconTabFilter("sapUshellNavRelatedAppsTabFilter", {
                    text: sap.ushell.resources.i18n.getText("shellNavMenu_relatedApps"),
                    content: [this.oMiniTilesBox]
                });

                this.oTextTabBar = new sap.m.IconTabBar("sapUshellNavMenuTabBar", {
                    expanded: true,
                    expandable: false,
                    items: [this.oMiniTilesTab]
                });

                this.bInitialized = true;
            }
        };

        /* after open method:
         initialize the keyboard-navigation inner module
         for the mini-tiles grid (flexBox)
          ONLY in case we run in desktop
         */
        ShellNavigationMenu.prototype._afterOpen = function () {
            if (sap.ui.Device.system.desktop) {
                if (this.keyboardNavigation) {
                    this.keyboardNavigation.destroy();
                }
                this.keyboardNavigation = new KeyboardNavigation(this.oMiniTilesBox);
            }
        };

        /*
         * methods for overriding default behavior of the aggregation management by the infrastructure,
         * in order to delegate the aggregation controls to an inner control which should render them instead
         *  (the related-apps flex-box items aggregation)
         */
        ShellNavigationMenu.prototype.getMiniTiles = function () {
            return this.oMiniTilesBox.getItems();
        };
        ShellNavigationMenu.prototype.insertMiniTile = function (oMiniTile, iIndex) {
            this.oMiniTilesBox.insertItem(oMiniTile, iIndex);
            return this;
        };
        ShellNavigationMenu.prototype.addMiniTile = function (oMiniTile) {
            if (this.oMiniTilesBox.getItems().length < 9) {
                this.oMiniTilesBox.addItem(oMiniTile);
            } else {
                jQuery.sap.log.warning("ShellNavigationMenu.addMiniTile - miniTiles aggregation is already at maximum size of 9 elements " +
                    "- current item was not added.");
            }
            return this;
        };
        ShellNavigationMenu.prototype.removeMiniTile = function (iIndex) {
            this.oMiniTilesBox.removeItem(iIndex);
            return this;
        };
        ShellNavigationMenu.prototype.removeAllMiniTiles = function () {
            this.oMiniTilesBox.removeAllItems();
            return this;
        };
        ShellNavigationMenu.prototype.destroyMiniTiles = function () {
            this.oMiniTilesBox.destroyItems();
            return this;
        };
        ShellNavigationMenu.prototype.indexOfMiniTile = function (oMiniTile) {
            return this.oMiniTilesBox.indexOfItem(oMiniTile);
        };


        /*
         * methods for overriding default behavior of the aggregation management by the infrastructure,
         * in order to delegate the aggregation controls to an inner control which should render them instead
         *  (the items-list items aggregation)
         */
        ShellNavigationMenu.prototype.getItems = function () {
            return this.oItemsList.getItems();
        };
        ShellNavigationMenu.prototype.insertItem = function (oHierarchyItem, iIndex) {
            this.oItemsList.insertItem(oHierarchyItem, iIndex);
            return this;
        };
        ShellNavigationMenu.prototype.addItem = function (oHierarchyItem) {
            this.oItemsList.addItem(oHierarchyItem);
            return this;
        };
        ShellNavigationMenu.prototype.removeItem = function (iIndex) {
            this.oItemsList.removeItem(iIndex);
            return this;
        };
        ShellNavigationMenu.prototype.removeAllItems = function () {
            this.oItemsList.removeAllItems();
            return this;
        };
        ShellNavigationMenu.prototype.destroyItems = function () {
            this.oItemsList.destroyItems();
            return this;
        };
        ShellNavigationMenu.prototype.indexOfItem = function (oHierarchyItem) {
            return this.oItemsList.indexOfItem(oHierarchyItem);
        };

        // destroy all private inner controls
        ShellNavigationMenu.prototype.exit = function () {
            // list and grid are always created - so we always need to destroy it
            this.oItemsList.destroy();
            this.oMiniTilesBox.destroy();

            // text-tab filter & bar should be destroyed only if initialized
            // (e.g. if menu was opened at least one time - see _beforeOpen method)
            if (this.bInitialized) {
                this.oMiniTilesTab.destroy();
                this.oTextTabBar.destroy();
            }
            // keyboard navigation should be destroyed only in case initialized
            // (see _afterOpen method)
            if (this.keyboardNavigation) {
                this.keyboardNavigation.destroy();
            }
        };

        return ShellNavigationMenu;
    }, true);
