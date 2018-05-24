// Copyright (c) 2009-2014 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, jQuery */
    /*jslint nomen: true */

    sap.ui.jsview("sap.ushell.components.flp.launchpad.appfinder.EasyAccess", {

        createContent: function (oController) {
            this.setModel(this.getViewData().easyAccessSystemsModel, "easyAccessSystemsModel");
            this.setModel(this.getViewData().parentComponent.getModel());

            this.hierarchyFolders = sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.components.flp.launchpad.appfinder.HierarchyFolders",
                height: "100%",
                viewData: {
                    navigateHierarchy: this.oController.navigateHierarchy.bind(oController),
                    easyAccessSystemsModel: this.getModel("easyAccessSystemsModel")
                }
            });
            this.hierarchyFolders.addStyleClass("sapUshellHierarchyFolders");

            this.hierarchyApps = new sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.components.flp.launchpad.appfinder.HierarchyApps",
                height: "100%",
                viewData: {
                    navigateHierarchy: this.oController.navigateHierarchy.bind(oController)
                }
            });

            this.hierarchyApps.addStyleClass(" sapUshellAppsView sapMShellGlobalInnerBackground");

            var splitApp = new sap.m.SplitApp({
                masterPages: this.hierarchyFolders,
                detailPages: this.hierarchyApps
            });

            splitApp.setInitialMaster(this.hierarchyFolders);
            splitApp.setInitialDetail(this.hierarchyApps);

            return splitApp;
        },

        getControllerName: function () {
            return "sap.ushell.components.flp.launchpad.appfinder.EasyAccess";
        }
    });
}());
