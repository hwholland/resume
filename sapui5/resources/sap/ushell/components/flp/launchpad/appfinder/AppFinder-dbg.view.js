// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, jQuery */
    /*jslint nomen: true */

    sap.ui.jsview("sap.ushell.components.flp.launchpad.appfinder.AppFinder", {

        createContent: function (oController) {
            var that = this;
            this.addEventDelegate({
                onAfterShow: function () {
                    //in the App Finder the home button should be enabled
                    //check that the home button exists, and that it is not the back button in Fiori 2.0...
                    var oHomeBtn = sap.ui.getCore().byId('homeBtn');
                    if (oHomeBtn && oHomeBtn.setEnabled && oHomeBtn.getTarget()) {
                        oHomeBtn.setEnabled(true);
                    }

                },
                onAfterHide: function () {
                    var oHomeBtn = sap.ui.getCore().byId('homeBtn');
                    //check that the home button exists, and that it is not the back button in Fiori 2.0...
                    if (oHomeBtn && oHomeBtn.setEnabled && oHomeBtn.getTarget()) {
                        oHomeBtn.setEnabled(false);
                    }

                    //since the shell heade was modified -> need to remove it
                    if (that.isFiori2) {
                        that.oController._updateShellHeader(undefined);
                    }
                }
            });

            this.parentComponent = sap.ui.core.Component.getOwnerComponentFor(this);
            this.setModel(this.parentComponent.getModel());
            this.enableEasyAccess = this.getModel().getProperty("/enableEasyAccess");
            if (this.enableEasyAccess) {
                if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet  && (!sap.ui.Device.system.combi)) {
                    this.enableEasyAccess = false;
                }
            }
            var oResourceBundle = sap.ushell.resources.i18n;
            if (this.enableEasyAccess) {
                this.segmentedButton = new sap.m.SegmentedButton({
                    buttons: [
                        new sap.m.Button("catalog", {
                            text: oResourceBundle.getText("appFinderCatalogTitle"),
                            press: function (oEvent) {
                                oController.onSegmentButtonClick(oEvent);
                            }
                        }),
                        new sap.m.Button('userMenu', {
                            text: oResourceBundle.getText("appFinderUserMenuTitle"),
                            press: function (oEvent) {
                                oController.onSegmentButtonClick(oEvent);
                            }
                        }),
                        new sap.m.Button('sapMenu', {
                            text: oResourceBundle.getText("appFinderSapMenuTitle"),
                            press: function (oEvent) {
                                oController.onSegmentButtonClick(oEvent);
                            }
                        })]
                });
                var aButtons = this.segmentedButton.getButtons();
                for (var i = 0; i < aButtons.length; i++) {
                    var button = aButtons[i];
                    button.addAriaLabelledBy(button.getId() + "View");
                    button.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                        key: "aria-controls",
                        value: button.getId() + "View",
                        writeToDom: true
                    }));
                }
            }

            var oRenderer = sap.ushell.Container.getRenderer('fiori2');
            this.isFiori2 = oRenderer.isFiori2();

            this.oPage = new sap.m.Page("appFinderPage", {
                showHeader: this.isFiori2 ? false : true,
                showSubHeader: this.enableEasyAccess ? true : false,
                showFooter: false,
                showNavButton: false,
                enableScrolling: false,
                title : {
                    parts : ["/groupContext/title"],
                    formatter : function (title) {
                        return !title ? oResourceBundle.getText("appFinderTitle") : oResourceBundle.getText("appFinder_group_context_title", title);
                    }
                },
                subHeader: this.enableEasyAccess ? new sap.m.Toolbar({
                    justifyContent: sap.m.FlexJustifyContent.Center,
                    content: this.segmentedButton
                }) : undefined
            });
//            oPage.addDelegate({
//                onAfterRendering: function () {
//                    //set initial focus
//                    jQuery("#catalogTilesPage header button").attr("tabindex", -1);
//                }
//            });

            return this.oPage;
        },

        getControllerName: function () {
            return "sap.ushell.components.flp.launchpad.appfinder.AppFinder";
        }
    });
}());
