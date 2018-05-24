/*!
 * ${copyright}
 */
/*global jQuery, sap */
/**
 * Provides control sap.ushell.ui.shell.ShellAppTitle
 *
 * This control is responsible to display the Shell Header Title.
 * This control could be rendered in two different states:
 * 1. Title only: only the title will be rendered inside the Shell Header
 * 2. Title with popover button: A button will be placed in the Shell Header Title area.
 *    When the user clicks on the button, a popover will raise and render the innerControl as its content.
 *
 *    innerControl: the content of the popover. Will be destroyed by the ShellAppTitle control.
 */
sap.ui.define(['jquery.sap.global', 'sap/m/Button', 'sap/ui/core/IconPool', 'sap/ushell/library', './ShellNavigationMenu'],
    function (jQuery, Button, IconPool) {
        "use strict";

        var ShellAppTitle = Button.extend("sap.ushell.ui.shell.ShellAppTitle",
            {
                metadata: {
                    properties: {
                        text: {type : "string", group : "Misc", defaultValue : null},
                        tooltip: {type : "string", group : "Misc", defaultValue : null}
                    },
                    associations : {
                        navigationMenu: {type: "sap.ushell.ui.shell.ShellNavigationMenu"}
                    },
                    events: {
                        press: {}
                    }
                },

                renderer: {
                    render:  function (oRm, oControl) {

                        var sNavMenu = oControl.getNavigationMenu();
                        var sTitle = oControl.getText();
                        var bVisible = false;
                        if (sNavMenu) {
                            var oNavMenu = sap.ui.getCore().byId(sNavMenu);
                            bVisible = oNavMenu ? oNavMenu.getItems() && oNavMenu.getItems().length > 0 : false;
                            oControl.bIconVisible = bVisible;
                        }

                        // render the title
                        oRm.write('<div tabindex="0" ');
                        oRm.writeControlData(oControl);
                        oRm.addClass("sapUshellShellAppTitleContainer sapUshellAppTitle");
                        if (bVisible) {
                            oRm.addClass("sapUshellAppTitleClickable");
                        }
                        oRm.writeAttributeEscaped("aria-label", sTitle);
                        oRm.writeClasses();
                        oRm.write(">");

                        if (bVisible) {
                            oRm.write("<div ");
                            oRm.addClass("sapUshellShellHeadAction");
                            oRm.writeClasses();
                            oRm.write("><span class='sapUshellShellHeadActionImg sapUshellShellAppTitleHeadActionImg'>");
                            oRm.renderControl(oControl.oIcon);
                            oRm.write("</span>");
                            oRm.write("</div>");
                        }

                        oRm.write('<span class="sapUshellHeadTitle" >');
                        if (sTitle) {
                            oRm.writeEscaped(sTitle);
                        }
                        oRm.write("</span>");

                        oRm.write("</div>");
                    }
                }
            });

        ShellAppTitle.prototype.init = function () {
            //call the parent sap.m.Button init method
            if (Button.prototype.init) {
                Button.prototype.init.apply(this, arguments);
            }

            this.oIcon = IconPool.createControlByURI(sap.ui.core.IconPool.getIconURI("slim-arrow-down"));
            this.oIcon.addStyleClass("sapUshellAppTitleMenuIcon");
        };

        ShellAppTitle.prototype.onclick = function (oEvent) {

            // it may be that the Title was clicked on (and not the icon which opens the menu)
            // we need to make sure the icon is displayed (e.g. rendered) - in case not we do not
            // open the menu
            if (!this.bIconVisible) {
                return;
            }

            if (!this.oPopover) {

                this.oPopover = new sap.m.Popover("sapUshellAppTitlePopover", {
                    //showHeader: false,
                    showArrow: false,
                    placement: sap.m.PlacementType.Bottom
                }).addStyleClass("sapUshellAppTitleNavigationMenuPopover");

                this.bAppTitleClick = false;

                var oNavMenu = sap.ui.getCore().byId(this.getNavigationMenu());
                this.oPopover.addContent(oNavMenu);

                // before popover open - call to before menu open
                this.oPopover.attachBeforeOpen(function () {
                    oNavMenu._beforeOpen();
                });

                // after popover open - fix scrolling for IOS and call to menu after open
                this.oPopover.attachAfterOpen(function () {

                    // fix for scrolling (By @Alexander Pashkov) on sap.m.Popover being override
                    // in Mobile by UI5
                    this.oPopover.$().on("touchmove.scrollFix", function (e) {
                        e.stopPropagation();
                    });

                    // calls to afterOpen on the navigation menu itself in case some things needed to be made;
                    // initialize the keyboard navigation on the navigation menu only in case we
                    oNavMenu._afterOpen();
                }.bind(this));

                this.oPopover.attachBeforeClose(function(event) {
                    if (document.activeElement.id === this.getId()) {
                        this.bAppTitleClick = true;
                    }
                }.bind(this));
            }

            if (!this.bAppTitleClick) {
                this.oPopover.openBy(this.oIcon);
                this.firePress();
            } else {
                this.bAppTitleClick = false;
            }
            
        };

        ShellAppTitle.prototype.close = function () {
            if (this.oPopover && this.oPopover.isOpen()) {
                this.oPopover.close();
            }
        };

        ShellAppTitle.prototype.setTooltip = function (sTooltip) {
            this.oIcon.setTooltip(sTooltip);
        };

        ShellAppTitle.prototype.onsapspace = ShellAppTitle.prototype.onclick;

        ShellAppTitle.prototype.exit = function () {

            var oNavMenu = sap.ui.getCore().byId(this.getNavigationMenu());
            if (oNavMenu) {
                oNavMenu.destroy();
            }
            if (this.oPopover) {
                this.oPopover.destroy();
            }
        };

        return ShellAppTitle;
    }, true);
