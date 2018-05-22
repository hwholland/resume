// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, window, OData */
    /*jslint nomen: true */

    sap.ui.controller("sap.ushell.components.flp.launchpad.appfinder.EasyAccess", {

        DEFAULT_URL : "/sap/opu/odata/UI2",
        DEFAULT_NUMBER_OF_LEVELS: 3,

        onInit: function () {
            var that = this;
            this.translationBundle = sap.ushell.resources.i18n;
            this.oView = this.getView();
            var oEasyAccessSystemsModel = this.oView.getModel("easyAccessSystemsModel");
            var binding = new sap.ui.model.Binding(oEasyAccessSystemsModel, "/systemSelected", oEasyAccessSystemsModel.getContext("/systemSelected"));
            binding.attachChange(that.adjustUiOnSystemChange.bind(this));
            this.menuName = this.oView.getViewData().menuName;
            this.systemId = null;
            this.easyAccessCache = {};

            this.easyAccessModel = new sap.ui.model.json.JSONModel();
            this.oView.hierarchyFolders.setModel(this.easyAccessModel, "easyAccess");
            this.oView.hierarchyApps.setModel(this.easyAccessModel, "easyAccess");

            this.checkIfSystemSelectedAndLoadData();
        },

        onAfterRendering: function () {
            this.oView.hierarchyApps.getController()._updateAppBoxedWithPinStatuses();
        },

        checkIfSystemSelectedAndLoadData: function () {
            var oSystemSelected = this.oView.getModel("easyAccessSystemsModel").getProperty("/systemSelected");
            if (oSystemSelected) {
                this.systemId = oSystemSelected.systemId;
                this.loadMenuItemsFirstTime(this.oView.getViewData().menuName, oSystemSelected);
            }
        },

        navigateHierarchy: function (path, forward) {
            this.oView.hierarchyFolders.setBusy(false);
            var entity = this.easyAccessModel.getProperty(path ? path : "/");
            if (typeof entity.folders != "undefined") {
                this.oView.hierarchyFolders.updatePageBindings(path, forward);
                this.oView.hierarchyApps.getController().updatePageBindings(path);
                return;
            }
            this.oView.hierarchyFolders.setBusy(true);
            this.getMenuItems(this.menuName, this.systemId, entity.id, entity.level).then(function (path, response) {
                this.easyAccessModel.setProperty(path + "/folders", response.folders);
                this.easyAccessModel.setProperty(path + "/apps", response.apps);
                this.oView.hierarchyFolders.updatePageBindings(path, forward);
                this.oView.hierarchyApps.getController().updatePageBindings(path);
                this.oView.hierarchyFolders.setBusy(false);
            }.bind(this, path), function (error) {
                this.handleGetMenuItemsError(error);
            }.bind(this));
        },

        adjustUiOnSystemChange: function () {
            if (this.systemId && this.easyAccessModel.getData()) {
                this.easyAccessCache[this.systemId] = this.easyAccessModel.getData();
            }

            var oSystemSelected = this.oView.getModel("easyAccessSystemsModel").getProperty("/systemSelected");
            if (oSystemSelected) {
                this.systemId = oSystemSelected.systemId;
                var newData = this.easyAccessCache[this.systemId];
                if (newData) {
                    this.easyAccessModel.setData(newData);
                    this.navigateHierarchy("", false);
                } else {
                    this.oView.hierarchyFolders.setBusy(true);
                    this.loadMenuItemsFirstTime(this.menuName, oSystemSelected);
                }
            }
        },

        loadMenuItemsFirstTime: function (menuName, oSystem) {
            return this.getMenuItems(menuName, oSystem.systemId, "", 0).then(function (response) {
                response.text = oSystem.systemName || oSystem.systemId;
                this.easyAccessModel.setData(response);
                this.oView.hierarchyFolders.setBusy(false);
                this.navigateHierarchy("", false);
            }.bind(this), function (error) {
                this.handleGetMenuItemsError(error);
                this.oView.hierarchyFolders.updatePageBindings("/", false);
                this.oView.hierarchyApps.getController().updatePageBindings("/");
            }.bind(this));
        },

        handleGetMenuItemsError: function(error) {
            jQuery.sap.require('sap.m.MessageBox');
            var sErrorMessage = this.getErrorMessage(error);
            sap.m.MessageBox.error(sErrorMessage);
            this.easyAccessModel.setData("");
            this.oView.hierarchyFolders.setBusy(false);
        },

        getErrorMessage: function(error) {
            var sMenuNameString="";
            if (this.menuName == "SAP_MENU") {
                sMenuNameString = this.translationBundle.getText("easyAccessSapMenuNameParameter");
            } else if (this.menuName == "USER_MENU") {
                sMenuNameString = this.translationBundle.getText("easyAccessUserMenuNameParameter");
            }

            if (error) {
                if (error.message) {
                    return this.translationBundle.getText("easyAccessErrorGetDataErrorMsg",[sMenuNameString, error.message]);
                } else {
                    return this.translationBundle.getText("easyAccessErrorGetDataErrorMsg",[sMenuNameString, error]);
                }
            } else {
                return this.translationBundle.getText("easyAccessErrorGetDataErrorMsgNoReason",sMenuNameString);
            }
        },


        /**
         *
         * @param {string} menuType - the service that need to be called (can be USER_MENU or SAP_MENU)
         * @param {string} systemId - the system that the user choose in the system selector
         * @param {string} entityId - the "root" entity. Can be a specific id or "" in case it is the first call
         * @param {number} entityLevel - the entity level (if it is the root entity the level should be 0)
         * @param {string} numberOfNextLevels - how much levels would like to retrieve. id no value is passed the default value is 3
         * @returns {*} - an object to add to the system easy access model
         */
        getMenuItems: function (menuType, systemId, entityId, entityLevel, numberOfNextLevels) {
            var oDeferred = new jQuery.Deferred();

            if (menuType != "SAP_MENU" && menuType != "USER_MENU") {
                oDeferred.reject("Invalid menuType parameter");
            }

            if (typeof systemId !== "string" || systemId === "") {
                oDeferred.reject("Invalid systemId parameter");
            }

            if (typeof entityId !== "string") {
                oDeferred.reject("Invalid entityId parameter");
            }

            if (typeof entityLevel !== "number") {
                oDeferred.reject("Invalid entityLevel parameter");
            }

            if (numberOfNextLevels && typeof numberOfNextLevels !== "number") {
                oDeferred.reject("Invalid numberOfNextLevels parameter");
            }

            if (entityId == "") {
                entityLevel = 0;
            }
            var iNumberOfNextLevelsValue;
            var oModel = this.getView().getModel();
            var iConfiguredNumbersOfLevels = oModel.getProperty("/easyAccessNumbersOfLevels");
            if (iConfiguredNumbersOfLevels) {
                iNumberOfNextLevelsValue = iConfiguredNumbersOfLevels;
            } else if (numberOfNextLevels) {
                iNumberOfNextLevelsValue = numberOfNextLevels;
            } else {
                iNumberOfNextLevelsValue = this.DEFAULT_NUMBER_OF_LEVELS;
            }
            var iLevelFilter = entityLevel + iNumberOfNextLevelsValue + 1;

            var sServiceUrl = this._getODataRequestUrl(menuType, systemId, entityId, iLevelFilter);

            var oRequest = {
                requestUri: sServiceUrl
            };

            var oCallOdataServicePromise = this._callODataService(oRequest, systemId, entityId ,iLevelFilter );
            oCallOdataServicePromise.done(function (data) {
                oDeferred.resolve(data);
            });
            oCallOdataServicePromise.fail(function(error){
                oDeferred.reject(error);
            });

            return oDeferred.promise();
        },

        _callODataService: function (oRequest, systemId, entityId, iLevelFilter) {

            jQuery.sap.require("sap.ui.thirdparty.datajs");
            var that = this;
            var oDeferred = new jQuery.Deferred();

            OData.read(
                oRequest,

                // Success handler
                function (oResult, oResponseData) {
                    if (oResult && oResult.results && oResponseData && oResponseData.statusCode === 200) {
                        var oReturnedModel=that._oDataResultFormatter(oResult.results, systemId, entityId, iLevelFilter);
                        oDeferred.resolve(oReturnedModel);

                    }

                },

                //Fail handler
                function (oMessage) {
                    oDeferred.reject(oMessage);
                }
            );

            return oDeferred.promise();

        },

        _appendSystemToUrl: function (oData, sSystemId) {
            if (oData.url) {
                return oData.url + (oData.url.indexOf('?') > 0 ? '&' : '?') + 'sap-system=' + sSystemId;
            }
        },
        
        _oDataResultFormatter: function (aResults, systemId, entityId, iLevelFilter) {
            var oFoldersMap={};
            var oReturnedData = {};

            if (entityId == "") {
                oReturnedData = {
                    id: "root",
                    text: "root",
                    level: 0,
                    folders: [],
                    apps: []
                };
                oFoldersMap.root = oReturnedData;
            } else {
                oReturnedData = {
                    id: entityId,
                    folders: [],
                    apps: []
                };
                oFoldersMap[entityId] = oReturnedData;
            }

            var odataResult;
            for (var i = 0; i < aResults.length; i++) {
                odataResult = aResults[i];

                var oParent;
                if (odataResult.parentId=="" && odataResult.level == "01") {
                    oParent = oFoldersMap["root"]
                } else {
                    oParent = oFoldersMap[odataResult.parentId];
                }

                var oMenuItem = {
                    id : odataResult.Id,
                    text: odataResult.text,
                    level: parseInt(odataResult.level, 10)
                };
                if (odataResult.type == 'FL') {
                    oMenuItem.folders = [];
                    oMenuItem.apps = [];
                    if (odataResult.level == iLevelFilter - 1) {
                        oMenuItem.folders = undefined;
                        oMenuItem.apps = undefined;
                    }
                    if (oParent && oParent.folders) {
                        oParent.folders.push(oMenuItem);
                    }
                    oFoldersMap[odataResult.Id] = oMenuItem;
                } else {
                    oMenuItem.url = this._appendSystemToUrl(odataResult, systemId);
                    if (oParent && oParent.apps) {
                        oParent.apps.push(oMenuItem);
                    }
                }
            }
            return oReturnedData;
        },

        _getODataRequestUrl: function (menuType, systemId, entityId, iLevelFilter) {
            var sServiceUrl;
            var oModel = this.getView().getModel();
            if (menuType == "SAP_MENU"){
                var oSapMenuServiceUrlConfig = oModel.getProperty("/sapMenuServiceUrl");
                if (oSapMenuServiceUrlConfig){
                    sServiceUrl = oSapMenuServiceUrlConfig;
                } else {
                    sServiceUrl = this.DEFAULT_URL +"/EASY_ACCESS_MENU";
                }

            } else if (menuType == "USER_MENU"){
                var oUserMenuServiceUrlConfig = oModel.getProperty("/userMenuServiceUrl");
                if (oUserMenuServiceUrlConfig){
                    sServiceUrl = oUserMenuServiceUrlConfig;
                } else {
                    sServiceUrl = this.DEFAULT_URL + "/USER_MENU";
                }
            }

            var sLevelFilter;
            if (iLevelFilter < 10) {
                sLevelFilter = "0" + iLevelFilter;
            } else {
                sLevelFilter = iLevelFilter.toString();
            }

            var entityIdFilter = "";
            if (entityId) {
                // we check if the entityId is already encoded
                // in case not (e.g. decoding it equals to the value itself) - we encode it
                if (decodeURIComponent(entityId) === entityId) {
                    entityId = encodeURIComponent(entityId);
                }
                entityIdFilter = "('" + entityId + "')/AllChildren";
            }

            return sServiceUrl = sServiceUrl + ";o=" + systemId + "/MenuItems" + entityIdFilter + "?$filter=level lt '" + sLevelFilter + "'&$orderby=level,text";
        }


    });
}());
