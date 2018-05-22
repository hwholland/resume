// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, jQuery */
    /*jslint nomen: true */

    sap.ui.jsview("sap.ushell.components.flp.launchpad.appfinder.HierarchyFolders", {

        createContent: function (oController) {
            var that = this;
            this.translationBundle = sap.ushell.resources.i18n;

            this.treePath = "";

            this.systemSelectorText = new sap.m.Text({
                text: {
                    path: "easyAccessSystemsModel>/systemSelected",
                    formatter: oController.systemSelectorTextFormatter.bind(oController)
                }
            });

            this.oItemTemplate = new sap.m.StandardListItem({
                title: "{easyAccess>text}",
                type: "Navigation",
                press: function () {
                    var path = this.getBindingContextPath();
                    that.getViewData().navigateHierarchy(path, true);
                }
            });

            this.oList = new sap.m.List({
                items: {
                    path: "easyAccess>" + this.treePath + "/folders",
                    template: this.oItemTemplate
                },
                updateFinished: function () {
                    that.finishEasyAccessAnimation(true);
                },
                noDataText: {
                    path: "easyAccessSystemsModel>/systemSelected",
                    formatter: function (oSystemSelected) {
                        if (oSystemSelected) {
                            return that.translationBundle.getText("easyAccessFolderWithNoItems");
                        }
                    }
                }
            });

            this.pageMenu = new sap.m.Page({
                title: "{easyAccess>/text}",
                showNavButton: false,
                enableScrolling: true,
                subHeader: new sap.m.Toolbar({
                    design: "Info",
                    height: "2rem",
                    active: {
                        path: "easyAccessSystemsModel>/systemsList",
                        formatter: function (systemsList) {
                            return systemsList.length > 1;
                        }
                    },
                    content: [
                        this.systemSelectorText,
                        new sap.m.ToolbarSpacer(),
                        new sap.ui.core.Icon({
                            width: "2rem",
                            src: "sap-icon://edit"
                        })
                    ],
                    press: [oController.onSystemSelectionPress, oController]
                }),
                content: this.oList
            });

            this.pageMenu.attachNavButtonPress(function () {
                var pathChunks = this.treePath.split("/");
                var newPathChunks = pathChunks.slice(0, pathChunks.length - 2);
                this.getViewData().navigateHierarchy(newPathChunks.join("/"), false);
            }.bind(this));

            return this.pageMenu;
        },

        getControllerName: function () {
            return "sap.ushell.components.flp.launchpad.appfinder.HierarchyFolders";
        },

        finishEasyAccessAnimation: function () {
            if (!this.jqFolderClone) {
                return;
            }

            if (this.forwardAnimation) {
                this.pageMenu.$().addClass("forwardToViewAnimation");
                this.jqFolderClone.addClass("forwardOutOfViewAnimation");
            } else {
                this.pageMenu.$().addClass("backToViewAnimation");
                this.jqFolderClone.addClass("backOutOfViewAnimation");
            }
            this.jqFolderClone.on("animationend", function () {
                this.pageMenu.$().removeClass("forwardToViewAnimation backToViewAnimation");
                var backButton = this.pageMenu.$().find(".sapMBarLeft button");
                if (backButton.length) {
                    backButton.focus();
                } else {
                    //timeout needed becouse firefox hides menu without it
                    setTimeout(function () {
                        this.pageMenu.$().find("header + header").focus();
                    }.bind(this));
                }
                if (this.jqFolderClone) {
                    this.jqFolderClone.remove();
                }
            }.bind(this));
        },

        prepareEasyAccessAnimation: function (forward) {
            this.forwardAnimation = forward;
            this.jqFolderClone = this.pageMenu.$().clone().removeAttr("data-sap-ui").css("z-index", "1");
            this.jqFolderClone.find("*").removeAttr("id");
            this.pageMenu.$().parent().append(this.jqFolderClone);
        },

        updatePageBindings: function (path, forwardAnimation) {
            var bShowBack = path.split("/").length > 2;
            this.treePath = path;
            this.pageMenu.setShowNavButton(bShowBack);
            this.pageMenu.setShowSubHeader(!bShowBack);
            this.prepareEasyAccessAnimation(forwardAnimation);
            this.pageMenu.bindProperty("title", "easyAccess>" + path + "/text");
            this.oList.bindItems("easyAccess>" + path + "/folders", this.oItemTemplate);
        }
    });
}());
