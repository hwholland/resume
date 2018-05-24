sap.ui.define(["sap/ui/core/mvc/Controller"], function (oController) {
    return oController.extend("sap.ushell.demo.AppNavSample.view.View4", {

        oApplication : null,
        /**
        * Called when a controller is instantiated and its View controls (if available) are already created.
        * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
        * @memberOf view.Detail
        */
        onInit: function() {
            var that = this;

            this.oInputModel = new sap.ui.model.json.JSONModel({
                SO: "Action",
                action: "toappnavsample",
                params: "A=B&C=D",
                compactIntents: false
            });

            this.oModel = new sap.ui.model.json.JSONModel({
                SO: "Action",
                action: "toappnavsample",
                params: "A=B&C=D",
                supported: false,
                supportedColor: "red",
                navSupportedColor: "red",
                compactIntents: false,
                treatTechHintAsFilter : false,
                withAtLeastOneUsedParam : false,
                hashFragment: "",
                hashFragmentLength: 0,
                links : []
                //{ "name" : "x", "link" : "http://www.nytimes.com" , "escapedLink" : "http://www.nytimes.com" },
                //{ "name" : "yx", "link" : "http://www.nytimes.com", "escapedLink" : "http://www.nytimes.com" } ]
            });

            this.getView().setModel(this.oInputModel, "mdlInput");
            this.getView().setModel(this.oModel, "v1");

            this.updateFromInputModel();
            // // that.updateAppStateFromModelInitial();
            // register an event handler on the model, to track future changes
            this.oInputModel.bindTree("/").attachChange(function () {
                that.updateFromInputModel();
            });

        },
        handleTextLiveChange: function (oEvent) {
            var oMdlV1 = this.getView().getModel("v1"),
                sSemanticObject = this.byId("f2").getValue() || "",
                sAction = this.byId("f3").getValue() || "",
                sParams = this.byId("f4").getValue() || "",
                sIntent = "#" + sSemanticObject + "-" + sAction + (sParams.length > 0 ? "?" + sParams : "" );

            oMdlV1.setProperty("/hashFragment", sIntent);
            oMdlV1.setProperty("/hashFragmentLength", sIntent.length);
        },
        updateFromInputModel: function () {
            var sSemanticObject = this.getView().getModel("mdlInput").getProperty("/SO"),
                sAction = this.getView().getModel("mdlInput").getProperty("/action"),
                bCompactIntents = this.getView().getModel("mdlInput").getProperty("/compactIntents"),
                bwithAtLeastOneUsedParam = this.getView().getModel("mdlInput").getProperty("/withAtLeastOneUsedParam"),
                btreatTechHintAsFilter = this.getView().getModel("mdlInput").getProperty("/treatTechHintAsFilter"),
                oParams = sap.ushell.Container.getService("URLParsing").parseParameters("?" + this.getView().getModel("mdlInput").getProperty("/params") || ""),
                that = this,
                oRootComponent = this.getRootComponent(),
                href;
                // oLinks = this.getView().getModel("v1").getProperty("/links");

            this.args = {
                target: {
                    semanticObject : sSemanticObject,
                    action : sAction
                },
                params : oParams
            };
            href = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal(this.args, this.getRootComponent());
            if (this.getView() && this.getView().getModel()) {
                this.getView().getModel().setProperty("/toGeneratedLink", href);
            }
            if (btreatTechHintAsFilter || bwithAtLeastOneUsedParam) {
                sap.ushell.Container.getService("CrossApplicationNavigation").getLinks(
                        { semanticObject : sSemanticObject,
                          params : oParams,
                          withAtLeastOneUsedParam : bwithAtLeastOneUsedParam,
                          treatTechHintAsFilter : btreatTechHintAsFilter,
                          ui5Component : oRootComponent,
                          compactIntents : bCompactIntents
                        }
                    ).done(function(aRes) {
                        var aLinks = [];
                        aRes.forEach(function(oEntry) {
                            var sCorrectLink = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({ target : { shellHash : oEntry.intent}}, oRootComponent);
                            aLinks.push( { name : oEntry.text, link : oEntry.intent, escapedLink : sCorrectLink });
                        });
                        that.oModel.setProperty("/links",aLinks);
                    });
            } else {
                sap.ushell.Container.getService("CrossApplicationNavigation").getSemanticObjectLinks(
                    sSemanticObject,
                    oParams,
                    undefined, // bIgnoreFormFactor
                    oRootComponent,
                    undefined, // sAppStateKey
                    bCompactIntents
                ).done(function(aRes) {
                    var aLinks = [];
                    aRes.forEach(function(oEntry) {
                        var sCorrectLink = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({ target : { shellHash : oEntry.intent}}, oRootComponent);
                        aLinks.push( { name : oEntry.text, link : oEntry.intent, escapedLink : sCorrectLink });
                    });
                    that.oModel.setProperty("/links",aLinks);
                });
            }

            //{
            //    *   intent: "#AnObject-Action?A=B&C=e&C=j",
            //    *   text: "Perform action"
            //    * }
            var sShellHash = "#" + sap.ushell.Container.getService("URLParsing").constructShellHash(this.args);
            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported([sShellHash]).done(function(oRes) {
                if (oRes && oRes[sShellHash].supported === true){
                    that.oModel.setProperty("/supported", "supported");
                    that.oModel.setProperty("/supportedColor", "green");
                } else {
                    that.oModel.setProperty("/supported", "not supported");
                    that.oModel.setProperty("/supportedColor", "red");
                }
            });
            sap.ushell.Container.getService("CrossApplicationNavigation").isNavigationSupported([this.args]).done(function(oRes) {
                if (oRes && oRes[0].supported === true){
                    that.oModel.setProperty("/navSupported", "supported");
                    that.oModel.setProperty("/navSupportedColor", "green");
                } else {
                    that.oModel.setProperty("/navSupported", "not supported");
                    that.oModel.setProperty("/navSupportedColor", "red");
                }
            });

            this.handleTextLiveChange();
        },
        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf view.Detail
         */
        //	onBeforeRendering: function() {
        //
        //	},
        getMyComponent: function () {
            "use strict";
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        },

        handleBtn1Press : function() {
            this.oApplication.navigate("toView", "View2");
        },

        handleBtnGSOPress : function() {
            this.updateFromInputModel();
            //sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(this.args, this.getMyComponent());
        },

        handleListLinkPress : function (ev) {
            var sLink = ev.getSource().getSelectedItem().data("navigateTo");
            sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({ target : { shellHash : sLink} });
        },

        handleBtnAddParamsPress: function (oEvent) {
            var sCurrentParams = this.getView().getModel("mdlInput").getProperty("/params"),
                iNumParamsCurrent = sCurrentParams.split("&").length,
                iNumParams = iNumParamsCurrent * 2,
                iLastNum = parseInt(sCurrentParams.split(/[a-zA-Z]/).pop(), 10);

            var iStartFrom = (iLastNum || 0) + 1,
                i,
                aParams = [];

            for (i = iStartFrom; i <= iStartFrom + iNumParams; i++) {
                aParams.push("p" + i + "=v" + i);
            }

            var sSep = "&";
            if (iNumParamsCurrent === 0 || sCurrentParams === "") {
                sSep = "";
            }

            this.getView().getModel("mdlInput").setProperty("/params", sCurrentParams + sSep + aParams.join("&"));
        },
        handleBtnExpandPress: function (oEvent) {
            // get link text
            var oButton = oEvent.getSource(),
                oModel = new sap.ui.model.json.JSONModel();

            oModel.setData({
                linkText: oButton.data("linkText")
            });

            // create popover
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("sap.ushell.demo.AppNavSample.view.View4Popover", this);
                this.getView().addDependent(this._oPopover);
            }
            this._oPopover.setModel(oModel);

            // delay because addDependent will do a async rerendering and the
            // actionSheet will immediately close without it.
            jQuery.sap.delayedCall(0, this, function() {
                this._oPopover.openBy(oButton);
            });
        },
        getRootComponent: function () {
            return sap.ui.core.Component.getOwnerComponentFor(this.getView());
        },
        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf view.Detail
         */
         //	onAfterRendering: function() {
         //
         //	},

         /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf view.Detail
         */
        onExit: function () {
            "use strict";
            jQuery.sap.log.info("sap.ushell.demo.AppNavSample: onExit of View4");
        }

    });
});


