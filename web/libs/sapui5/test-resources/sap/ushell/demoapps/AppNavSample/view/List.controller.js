// @copyright@
/*global sap, jQuery, JSONModel, alert*/
sap.ui.controller("sap.ushell.demo.AppNavSample.view.List", {
    oApplication : null,
    oDialog: null,
    oPopover: null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.List
*/
    onInit: function () {
        "use strict";
        var srvc, page, myComponent, oAppSettingsButton, that;
        myComponent = this.getMyComponent();
        if (myComponent.getComponentData().startupParameters) {
            jQuery.sap.log.debug("startup parameters of appnavsample are " + JSON.stringify(myComponent.getComponentData().startupParameters));
        }
        page = this.oView.getContent()[0];
        srvc = sap.ushell.services.AppConfiguration;
        if (srvc) {
            page.setShowFooter(true);
            oAppSettingsButton = new sap.m.Button({text: "App Settings", press: function () {alert('app settings button clicked'); } });
            that = this;
            srvc.addApplicationSettingsButtons([oAppSettingsButton]);
            this.oActionSheet = new sap.m.ActionSheet({ id: this.getView().getId() + "actionSheet", placement: sap.m.PlacementType.Top });
            this.oActionSheet.addButton(new sap.ushell.ui.footerbar.JamDiscussButton());
            this.oActionSheet.addButton(new sap.ushell.ui.footerbar.JamShareButton());
            this.oActionSheet.addButton(new sap.ushell.ui.footerbar.AddBookmarkButton({id: this.getView().getId()  + "saveAsTile"}));
            this.oActionsButton = new sap.m.Button({
                id: this.getView().getId() + "actionSheetButton",
                press : function () {
                    that.oActionSheet.openBy(this);
                },
                icon : "sap-icon://action"
            });
            if (srvc && typeof srvc.getSettingsControl === "function") {
                page.setFooter(new sap.m.Bar({
//                    contentLeft: srvc.getSettingsControl(),
                    contentRight: this.oActionsButton
                }));
            }
        }

        // Store initial navigation in the model
        var bIsInitialNavigation = sap.ushell.Container.getService("CrossApplicationNavigation").isInitialNavigation();
        this.oModel = new sap.ui.model.json.JSONModel({
            isInitialNavigation: bIsInitialNavigation ? "yes" : "no",
            isInitialNavigationColor: bIsInitialNavigation ? "green" : "red"
        });
        this.getView().setModel(this.oModel, "listModel");
    },
    trackDataEvent : function () {
        "use strict";
        var inputFieldValue = this.getView().byId("dataInput").getValue(),
            srv = sap.ushell.Container.getService("UsageAnalytics");
        srv.logCustomEvent("Test", "Track Data Event", [inputFieldValue]);
    },
    getMyComponent: function () {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        return sap.ui.component(sComponentId);
    },
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.List
*/
//  onBeforeRendering: function() {
//
//  },

    handleDefaultDetailPress : function () {
        "use strict";
        this.oApplication.navigate("toView", "Detail");
    },

    handleBtn1Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View1");
    },

    handleBtn2Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View2");
    },
    handleBtn3Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View3");
    },
    handleBtn4Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View4");
    },

    handleBtnBackPress : function () {
        "use strict";
        this.oApplication.navigate("back", "");
    },
    handleBtnBackDetailPress : function () {
        "use strict";
        this.oApplication.navigate("backDetail", "");
    },
    handleBtnFwdPress : function () {
        "use strict";
        this.oApplication.navigate("Fwd", "");
    },
    handleSetDirtyFlagOn : function () {
        "use strict";
        sap.ushell.Container.setDirtyFlag(true);
    },
    handleSetDirtyFlagOff : function () {
        "use strict";
        sap.ushell.Container.setDirtyFlag(false);
    },
    handleSetFallBackToShellHomeOn : function () {
        "use strict";
        window.location.href = 'http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html?bFallbackToShellHome=true#Action-toappnavsample';
    },
    handleSetFallBackToShellHomeOff : function () {
        "use strict";
        window.location.href = 'http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html#Action-toappnavsample';
    },
    handleOpenDialogPress: function () {
        "use strict";
        if (!this.oDialog) {
            var that = this;
            this.oDialog = new sap.m.Dialog({
                id: this.getView().createId("dialog"),
                title : "Sample Dialog",
                type : sap.m.DialogType.Message,
                leftButton : new sap.m.Button({
                    text : "Cancel",
                    press : function () {
                        that.oDialog.close();
                    }
                }),
                content : [
                    new sap.m.Link({
                        href: "{/DefaultApp_display_href}",
                        text: "Cross app link (Default App)",
                        tooltip: "Dialog should be closed automatically when navigating to another app"
                    })
                ]
            });
            this.oDialog.setModel(this.oApplication.oView.getModel());

        }
        this.oDialog.open();
    },
    handleOpenPopoverPress: function () {
        "use strict";
        var oModel, sHref;
        if (!this.oPopover) {
            oModel = this.oApplication.oView.getModel();
            sHref = oModel.getProperty("/DefaultApp_display_href");
            this.oPopover = new sap.m.Popover({
                id: this.getView().createId("popover"),
                title: "Sample Popover",
                content: [
                    new sap.m.Link({
                        href: sHref,
                        text: "Cross app link (Default App)",
                        tooltip: "Popover should be closed automatically when navigating to another app"
                    })
                ]
            });
        }
        if (!this.oPopover.isOpen()) {
            this.oPopover.openBy(this.getView().byId("openPopover"));
        } else {
            this.oPopover.close();
        }
    },
    handleOpenMessageToastPress: function () {
        "use strict";
        sap.m.MessageToast.show("Sample message toast", { duration: 5000});
    },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.List
*/
//  onAfterRendering: function() {
//
//  },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.List
*/
    onExit: function () {
        "use strict";
        // dialogs and popovers are not part of the UI composition tree and must
        // therefore be
        // destroyed explicitly in the exit handler
        if (this.oDialog) {
            this.oDialog.destroy();
        }
        if (this.oPopover) {
            this.oPopover.destroy();
        }
        if (this.oActionSheet) {
            this.oActionSheet.destroy();
        }
        if (this.oActionsButton) {
            this.oActionsButton.destroy();
        }
    }

});
