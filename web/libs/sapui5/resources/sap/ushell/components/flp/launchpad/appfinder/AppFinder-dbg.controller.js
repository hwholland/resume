// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, window */
    /*jslint nomen: true */

    jQuery.sap.require("sap.ushell.ui.launchpad.AccessibilityCustomData");

    sap.ui.controller("sap.ushell.components.flp.launchpad.appfinder.AppFinder", {
        onInit: function () {
            sap.ushell.Container.getRenderer("fiori2").createExtendedShellState("appFinderExtendedShellState", function () {
                sap.ushell.Container.getRenderer("fiori2").showHeaderItem("homeBtn", true);
                var isMobile = sap.ui.Device.system.phone;
                sap.ushell.Container.getRenderer("fiori2").setHeaderHiding(isMobile);
            });
            var that = this;
            var oView = this.getView();
            var oModel = oView.getModel();
            //make sure the groups are loaded
            if (!oModel.getProperty("/groups") || oModel.getProperty("/groups").length === 0) {
                var dashboardMgr = sap.ushell.components.flp.launchpad.getDashboardManager();
                dashboardMgr.loadPersonalizedGroups();
            }

            var enableEasyAccess = oView.enableEasyAccess;
            this.oRouter = this.getView().parentComponent.getRouter();

            this.catalogView = sap.ui.view("catalogView", {
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.components.flp.launchpad.appfinder.Catalog",
                height: "100%",
                viewData: {parentComponent: oView.parentComponent}
            });
            this.catalogView.addStyleClass('sapUiGlobalBackgroundColor sapUiGlobalBackgroundColorForce');

            this._addViewCustomData(this.catalogView, "appFinderCatalogTitle");

            this.oRouter.getRoute("catalog").attachPatternMatched(function (oEvent) {
                that._navigateTo.apply(that,["appFinder","catalog"]);
            });

            this.oRouter.getRoute("appFinder").attachPatternMatched(function (oEvent) {
                that._applyExtendedShellstate();
                that._getPathAndHandleGroupContext(oEvent);
                //in fiori 2.0 the header should be merged -> the shell header should be "App Finder"
                if (that.oView.isFiori2) {
                    that._updateShellHeader(that.oView.oPage.getTitle());
                }
                if (enableEasyAccess) {
                    that.onShow(oEvent);
                }
                sap.ui.getCore().getEventBus().publish("showCatalog");
            });

            if (!enableEasyAccess) {
                // we assume that when enableEasyAccess is undefined or false, then currentMenu should be catalog
                this.currentMenu = "catalog";
                oView.oPage.addContent(this.catalogView);
            }
        },

        _applyExtendedShellstate : function() {
            setTimeout(function () {
                if (sap.ushell.Container) {
                    sap.ushell.Container.getRenderer("fiori2").applyExtendedShellState("appFinderExtendedShellState");
                }
            }, 0);
        },
        getCurrentMenuName: function () {
            return this.currentMenu;
        },
        _navigateTo: function(sName, sMenu) {
            var sGroupContext = this.oView.getModel().getProperty("/groupContext");
            var sGroupContextPath = sGroupContext ? sGroupContext.path : null;
            if (sGroupContextPath) {
                this.oRouter.navTo(sName, {
                    'menu': sMenu,
                    filters: JSON.stringify({targetGroup: encodeURIComponent(sGroupContextPath)})
                }, true);
            } else {
                this.oRouter.navTo(sName, {
                    'menu': sMenu
                }, true);

            }
        },

        getSystemsModel: function () {
            if (this.getSystemsPromise) {
                return this.getSystemsPromise;
            }

            var easyAccessSystemsModel = new sap.ui.model.json.JSONModel();
            easyAccessSystemsModel.setProperty('/systemSelected', null);
            easyAccessSystemsModel.setProperty('/systemsList', []);

            this.getSystemsPromise = this.getSystems().then(function (aReturnSystems) {
                easyAccessSystemsModel.setProperty("/systemsList", aReturnSystems);
                return easyAccessSystemsModel;
            });
            return this.getSystemsPromise;
        },
        onSegmentButtonClick: function (oEvent) {
            switch (oEvent.getParameters().id) {
                case "catalog":
                    this._navigateTo("appFinder","catalog");
                    break;
                case "userMenu":
                    this._navigateTo("appFinder","userMenu");
                    break;
                case "sapMenu":
                    this._navigateTo("appFinder","sapMenu");
                    break;
            }
        },
        onShow: function (oEvent) {
            var oParameters = oEvent.getParameter('arguments');
            var menu = oParameters.menu;
            if (menu === this.getCurrentMenuName()) {
                return;
            }
            this.currentMenu = menu;

            var oView = this.getView();
            oView.segmentedButton.setSelectedButton(menu);
            if (menu === 'catalog') {
                oView.oPage.removeAllContent();
                oView.oPage.addContent(this.catalogView);
            } else {
                this.getSystemsModel().then(function (menu, systemsModel) {
                    if (menu === 'userMenu') {
                        if (!this.userMenuView) {
                            this.userMenuView = new sap.ui.view("userMenuView", {
                                type: sap.ui.core.mvc.ViewType.JS,
                                viewName: "sap.ushell.components.flp.launchpad.appfinder.EasyAccess",
                                height: "100%",
                                viewData: {
                                    menuName: "USER_MENU",
                                    easyAccessSystemsModel: systemsModel,
                                    parentComponent: oView.parentComponent
                                }
                            });
                            this._addViewCustomData(this.userMenuView, "appFinderUserMenuTitle");
                        }
                        oView.oPage.removeAllContent();
                        oView.oPage.addContent(this.userMenuView);
                    } else if (menu === 'sapMenu') {
                        if (!this.sapMenuView) {
                            this.sapMenuView = new sap.ui.view("sapMenuView", {
                                type: sap.ui.core.mvc.ViewType.JS,
                                viewName: "sap.ushell.components.flp.launchpad.appfinder.EasyAccess",
                                height: "100%",
                                viewData: {
                                    menuName: "SAP_MENU",
                                    easyAccessSystemsModel: systemsModel,
                                    parentComponent: oView.parentComponent
                                }
                            });
                            this._addViewCustomData(this.sapMenuView, "appFinderSapMenuTitle");
                        }
                        oView.oPage.removeAllContent();
                        oView.oPage.addContent(this.sapMenuView);
                    }

                }.bind(this, this.currentMenu));
            }
        },

        /**
         *get the group path (if exists) and update the model with the group context
         * @param oEvent
         * @private
         */
        _getPathAndHandleGroupContext : function (oEvent) {
            var oParameters = oEvent.getParameter('arguments');
            var sDataParam = oParameters.filters;
            var oDataParam = sDataParam ? JSON.parse(sDataParam) : sDataParam;
            var sPath = (oDataParam && decodeURIComponent(oDataParam.targetGroup)) || "";

            sPath = sPath === 'undefined' ? undefined : sPath;
            this._updateModelWithGroupContext(sPath);
        },

        /**
         * Update the groupContext part of the model with the path and ID of the context group, if exists
         *
         * @param {string} sPath - the path in the model of the context group, or empty string if no context exists
         */
        _updateModelWithGroupContext : function (sPath) {
            var oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
                oModel  = this.oView.getModel(),
                oGroupModel,
                oGroupContext = {
                    path : sPath,
                    id : "",
                    title : ""
                };

            // If sPath is defined and is different than empty string - set the group context id.
            // The recursive call is needed in order to wait until groups data is inserted to the model
            if (sPath && sPath !== "") {
                var timeoutGetGroupDataFromModel = function () {
                    var aModelGroups = oModel.getProperty("/groups");
                    if (aModelGroups.length) {
                        oGroupModel = oModel.getProperty(sPath);
                        oGroupContext.id = oLaunchPageService.getGroupId(oGroupModel.object);
                        oGroupContext.title = oGroupModel.title || oLaunchPageService.getGroupTitle(oGroupModel.object);
                        return;
                    }
                    setTimeout(timeoutGetGroupDataFromModel, 100);
                };
                timeoutGetGroupDataFromModel();
            }
            oModel.setProperty("/groupContext", oGroupContext);
        },

        /**
         *
         * @returns {*} - a list of systems to show in the system selector dialog
         */
        getSystems: function () {
            var oDeferred = new jQuery.Deferred();
            var systemsModel = [];
            var clientService = sap.ushell.Container.getService("ClientSideTargetResolution");
            if (!clientService) {
                oDeferred.reject("cannot get ClientSideTargetResolution service");
            } else {
                clientService.getEasyAccessSystems().done(function (oSystems) {
                    var aSystemsID = Object.keys(oSystems);
                    for (var i = 0; i < aSystemsID.length; i++) {
                        var sCurrentsystemID = aSystemsID[i];
                        systemsModel[i] = {
                            "systemName": oSystems[sCurrentsystemID].text,
                            "systemId": sCurrentsystemID
                        };
                    }

                    oDeferred.resolve(systemsModel);
                }).fail(function (sErrorMsg) {
                    oDeferred.reject("An error occurred while retrieving the systems: " + sErrorMsg);
                });
            }
            return oDeferred.promise();
        },

        _addViewCustomData: function (oView, sTitleName) {
            var oResourceBundle = sap.ushell.resources.i18n;

            oView.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "role",
                value: "main",
                writeToDom: true
            }));
            oView.addCustomData(new sap.ushell.ui.launchpad.AccessibilityCustomData({
                key: "aria-label",
                value: oResourceBundle.getText(sTitleName),
                writeToDom: true
            }));
        },

        _initializeShellUIService: function () {
            jQuery.sap.require("sap.ushell.ui5service.ShellUIService");
            this.oShellUIService = new sap.ushell.ui5service.ShellUIService({
                scopeObject: this.getOwnerComponent(),
                scopeType: "component"
            });
        },

        _updateShellHeader: function (sTitle) {
            if (!this.oShellUIService) {
                this._initializeShellUIService()
            }
            this.oShellUIService.setTitle(sTitle);
        }
    });
}());
