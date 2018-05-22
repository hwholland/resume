/*!
 * ${copyright}
 */
/*global jQuery, sap */
sap.ui.define(['jquery.sap.global', 'sap/ushell/library', 'sap/ui/Device', 'sap/ui/core/theming/Parameters'],
    function (jQuery, library, Device, oTheming, RightFloatingContainerItem) {
        "use strict";

        var RightFloatingContainer = sap.ui.core.Control.extend("sap.ushell.ui.shell.RightFloatingContainer", {

            metadata: {
                properties: {
                    size: {type: "sap.ui.core.CSSSize", group : "Appearance", defaultValue : '56px'},
                    top: {type: "string", group : "Appearance", defaultValue : '0'},
                    right: {type: "string", group : "Appearance", defaultValue : '0'},
                    textVisible: {type: "boolean", group : "Appearance", defaultValue : true},
                    insertItemsWithAnimation: {type: "boolean", group : "Appearance", defaultValue : true},
                    hideItemsAfterPresentation: {type: "boolean", group : "Appearance", defaultValue : false},
                    enableBounceAnimations: {type: "boolean", group : "Appearance", defaultValue : false}
                },
                aggregations: {
                    floatingContainerItems : {type : "sap.ui.core.Control", multiple : true}
                },
                events : {
                    /**
                     * Event is fired after rendering of the control.
                     */
                    afterRendering : {}
                }
            },
            renderer: {
                render: function (rm, oRightFloatingContainer) {
                    var bIsRTL = sap.ui.getCore().getConfiguration().getRTL();

                    rm.write("<ul");
                    rm.writeControlData(oRightFloatingContainer);
                    rm.addStyle('top', oRightFloatingContainer.getTop() + 'rem');
                    rm.addStyle(bIsRTL ? 'left' : 'right', oRightFloatingContainer.getRight());
                    rm.writeStyles();
                    rm.addClass("sapUshellRightFloatingContainer");
                    rm.writeClasses();
                    rm.write(">");
                    this.renderFloatingContainerItems(rm, oRightFloatingContainer);
                    rm.write("</ul>");
                },

                renderFloatingContainerItems: function (rm, oRightFloatingContainer) {

                    var aItems = oRightFloatingContainer.getFloatingContainerItems(),
                        i;
                    for (i = 0; i < aItems.length; i++) {
                        rm.renderControl(aItems[i]);
                    }
                }
            }

        });
        RightFloatingContainer.prototype.init = function () {
            var timer;
            jQuery(window).bind("resize", function () {
                clearTimeout(timer);
                timer = setTimeout(this._handleResize.bind(this), 100);
            }.bind(this));
            this.iRequiredItemsNumber = 5;
        };

        RightFloatingContainer.prototype.onBeforeRendering = function () {
        };

        RightFloatingContainer.prototype._setSize = function () {
        };
        RightFloatingContainer.prototype._handleResize = function () {
            //if there are no items, nothing to do
            if (this.getDomRef() && this.getFloatingContainerItems().length) {
                var nPreviousRequiredItems = this.iRequiredItemsNumber,
                    nWindowHeight = window.innerHeight,
                    oDomRef = this.getDomRef(),
                    nTopOffset = oDomRef.getBoundingClientRect().top,
                    jqItem = jQuery(oDomRef).find('li').first(),
                    nItemHeight,
                    aItems;
                //if no DOM element, nothing to do
                if (!jqItem.length) {
                    return;
                }
                nItemHeight = jqItem[0].clientHeight;
                //the maximum amount of items to display is 5 (if needed, this can be changed to a configuration later on)
                this.iRequiredItemsNumber = Math.min(parseInt((nWindowHeight - nTopOffset) / nItemHeight, 10), 5);
                if (nPreviousRequiredItems !== this.iRequiredItemsNumber) {
                    aItems = this.getFloatingContainerItems();
                    for (var i = 0; i < aItems.length; i++) {
                        if (i < this.iRequiredItemsNumber || isNaN(this.iRequiredItemsNumber)) {
                            aItems[i].removeStyleClass('sapUshellShellHidden');
                        } else {
                            aItems[i].addStyleClass('sapUshellShellHidden');
                        }
                    }
                }
            }
        };

        RightFloatingContainer.prototype.onAfterRendering = function () {
            this.fireAfterRendering();
            //after rendering call the resize handler to make sure that
            //we display only items that fit the height we have
            setTimeout(function () {
                this._handleResize();
            }.bind(this), 500);
        };
        RightFloatingContainer.prototype.setVisible = function (bVisible) {
            this.setProperty('visible', bVisible, true);
            if (bVisible) {
                jQuery(this.getDomRef()).css('visibility', 'visible');
            } else {
                jQuery(this.getDomRef()).css('visibility', 'hidden');
            }
        };
        RightFloatingContainer.prototype.setFloatingContainerItemsVisiblity = function (bVisible) {
            var items = this.getFloatingContainerItems(),
                timeout = bVisible ? 300 : 0;

            for (var i = 0; i < items.length; i++) {
                (function (index) {
                    return function () {
                        setTimeout(function () {
                            if (bVisible) {
                                items[index].removeStyleClass("sapUshellRightFloatingContainerItemBounceOut").addStyleClass("sapUshellRightFloatingContainerItemBounceIn");
                            } else {
                                items[index].removeStyleClass("sapUshellRightFloatingContainerItemBounceIn").addStyleClass("sapUshellRightFloatingContainerItemBounceOut");
                            }
                        }, timeout + index * 100);
                    };
                })(i)();
            }
        };

        RightFloatingContainer.prototype.addFloatingContainerItem = function (oNotificationListItem) {
            this.addAggregation('floatingContainerItems', oNotificationListItem);

            if (this.getInsertItemsWithAnimation()) {
                //Initially, add items as hidden (with height 0 and 'right' out of the viewport) and later, present them gradually with animation.
                oNotificationListItem.addStyleClass("sapUshellRightFloatingContainerItemHidden");

                if (this.getEnableBounceAnimations()) {
                    var items = this.getFloatingContainerItems(),
                        itemIndex = items.indexOf(oNotificationListItem);

                    setTimeout(function () {
                        oNotificationListItem.addStyleClass("sapUshellRightFloatingContainerItmHeightVisible").addStyleClass('sapUshellRightFloatingContainerItemBounceIn');
                    }, 500 + itemIndex * 100);
                } else {
                    setTimeout(function () {
                        var items = this.getFloatingContainerItems();
                        // Hide last item if there are already 5 items in the list
                        if (items.length > 5) {
                            var lastItem = items[items.length - 1];
                            lastItem.addStyleClass("sapUshellRightFloatingContainerHideLastItem");
                        }

                        oNotificationListItem.addStyleClass('sapUshellRightFloatingContainerItemBackToViewport').addStyleClass("sapUshellRightFloatingContainerItmHeightVisible");
                    }.bind(this), 500);
                }
            }
            if (this.getHideItemsAfterPresentation()) {
                //Remove it after 3 secounds.
                setTimeout(function () {
                    oNotificationListItem.removeStyleClass("sapUshellRightFloatingContainerItemBackToViewport");
                }, 3200);
            }
        };

        return RightFloatingContainer;

    }, /* bExport= */ true);