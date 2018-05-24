// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap*/
    /*jslint nomen: true */

    jQuery.sap.require("sap.ushell.ui.appfinder.AppBox");

    sap.ui.jsview("sap.ushell.components.flp.launchpad.appfinder.HierarchyApps", {

        createContent: function (oController) {
            this.oController = oController;

            var oPinButton = new sap.m.Button({
                icon: {
                    path: "easyAccess>bookmarkCount",
                    formatter : function (bookmarkCount) {
                        return (!!bookmarkCount) ? "sap-icon://accept" : "sap-icon://add";
                    }
                },
                press: oController.showSaveAppPopover.bind(oController)
            });
            oPinButton.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "tabindex",
                value: "-1",
                writeToDom: true
            }));
            oPinButton.addStyleClass("sapUshellPinButton");

            this.oItemTemplate = new sap.ushell.ui.appfinder.AppBox({
                title: "{easyAccess>text}",
                url: "{easyAccess>url}",
                pinButton: oPinButton,
                tabindex: {
                    path: "easyAccess>text"
                },
                press: [oController.onAppBoxPressed, oController]
            });
            this.oItemTemplate.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "tabindex",
                value: "-1",
                writeToDom: true
            }));

            this.layout = new sap.m.FlexBox({
                items: {
                    path: "easyAccess>/apps",
                    template: this.oItemTemplate
                },
                wrap: sap.m.FlexWrap.Wrap
            });
            this.layout.addDelegate({
                onAfterRendering: function () {
                    var items = this.getItems();
                    var updateTabindex = function (customData) {
                        if (customData.getKey() === "tabindex") {
                            customData.setValue("0");
                        }
                    };
                    if (items.length) {
                        items[0].getCustomData().forEach(updateTabindex);
                        items[0].getPinButton().getCustomData().forEach(updateTabindex);
                    }
                }.bind(this.layout)
            });

            this.crumbsModel = new sap.ui.model.json.JSONModel({crumbs:[]});

            this.linkTemplate = new sap.m.Link({
                text: "{crumbs>text}",
                press: function (e) {
                    var crumbData = e.oSource.getBinding("text").getContext().getObject();
                    this.getViewData().navigateHierarchy(crumbData.path, false);

                }.bind(this)
            });

            this.breadcrumbs = new sap.m.Breadcrumbs({
                links: {
                  path: "crumbs>/crumbs",
                  template: this.linkTemplate
                },
                currentLocationText: "{/text}"
            });

            this.breadcrumbs.setModel(this.crumbsModel, "crumbs");
            return [this.breadcrumbs, this.layout];
        },
        
        getControllerName: function () {
            return "sap.ushell.components.flp.launchpad.appfinder.HierarchyApps";
        }
    });
}());
