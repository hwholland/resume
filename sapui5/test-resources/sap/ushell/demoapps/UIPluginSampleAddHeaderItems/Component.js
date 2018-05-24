(function () {
    "use strict";

    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.UIPluginSampleAddHeaderItems.Component");
    jQuery.sap.require("sap.ui.core.Component");

    var sComponentName = "sap.ushell.demo.UIPluginSampleAddHeaderItems";

    // new Component
    sap.ui.core.Component.extend("sap.ushell.demo.UIPluginSampleAddHeaderItems.Component", {

        metadata : {
            version: "@version@",
            library: "sap.ushell.demo.UIPluginSampleAddHeaderItems"
        },

        /**
         * Returns the shell renderer instance in a reliable way,
         * i.e. independent from the initialization time of the plug-in.
         * This means that the current renderer is returned immediately, if it
         * is already created (plug-in is loaded after renderer creation) or it
         * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
         * before the renderer is created).
         *
         *  @returns {object}
         *      a jQuery promise, resolved with the renderer instance, or
         *      rejected with an error message.
         */
        _getRenderer: function () {
            var that = this,
                oDeferred = new jQuery.Deferred(),
                oShellContainer,
                oRenderer;

            that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
            if (!that._oShellContainer) {
                oDeferred.reject("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
            } else {
                oRenderer = that._oShellContainer.getRenderer();
                if (oRenderer) {
                    oDeferred.resolve(oRenderer);
                } else {
                    // renderer not initialized yet, listen to rendererCreated event
                    that._onRendererCreated = function (oEvent) {
                        oRenderer = oEvent.getParameter("renderer");
                        if (oRenderer) {
                            oDeferred.resolve(oRenderer);
                        } else {
                            oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
                        }
                    };
                    that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
                }
            }
            return oDeferred.promise();
        },

        init: function () {
            var that = this,
                fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
            this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

            this._getRenderer().fail(function (sErrorMessage) {
                jQuery.sap.log.error(sErrorMessage, undefined, sComponentName);
            })
            .done(function (oRenderer) {

                var oPluginParameters = that.getComponentData().config, // obtain plugin parameters
                    sRendererExtMethod;

                if (oPluginParameters.position === "end") {
                    sRendererExtMethod = "addHeaderEndItem";
                } else if (oPluginParameters.position === "begin") {
                    sRendererExtMethod = "addHeaderItem";
                } else {
                    jQuery.sap.log.error("Invalid 'position' parameter, must be one of <begin, end>", undefined, sComponentName);
                    return;
                }

                if (typeof oRenderer[sRendererExtMethod] === "function") {
                    oRenderer[sRendererExtMethod](
                        "sap.ushell.ui.shell.ShellHeadItem", {
                            tooltip: oPluginParameters.tooltip || "",
                            icon: sap.ui.core.IconPool.getIconURI(oPluginParameters.icon || "question-mark"),
                            press: function () {
                                sap.m.MessageToast.show(oPluginParameters.message || "Default Toast Message");
                            }
                        },
                        true,
                        false);
                } else {
                    jQuery.sap.log.error("Extension method '" + sRendererExtMethod + "' not supported by shell renderer", undefined, sComponentName);
                    return;
                }
            });
        },

        exit: function () {
            if (this._oShellContainer && this._onRendererCreated) {
                this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
            }
        }
    });
})();
