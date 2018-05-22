sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";

    var sActiveRoute = null;

    /**
     * @class      solo.web.controller.View
     * @extends    sap.ui.core.mvc.Controller
     */
    return Controller.extend("solo.web.controller.View", {

        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRouteMatched(this._onRouteMatched);
            var aHash = this.getBrowserHash();
            this.onNavigate(aHash[0], aHash[1], aHash[2]);
            this.getOwnerComponent().activeController = this;
        },

        _onRouteMatched: function (oEvent) {
            var oRouteConfig = oEvent.getParameter("config");
            if(sActiveRoute) {
                if(sActiveRoute !== oRouteConfig.pattern) {
                    var oComponent = this._oOwner.mAggregations.rootControl.getParent();
                    oComponent.activeController.onReset();
                }
            }
            sActiveRoute = oRouteConfig.pattern;
        },

        /**
         * @brief Retrieves a new control from the dynamic Table component
         * @method  onNavigate
         * @memberof    solo.web.controller.View
         */
        onNavigate: function(sMethod, sSubject, sClass) {
            var that = this;
            var sComponent = "dynamic.Table";
            var pComponent = new Promise((resolve, reject) => {
                that.getDataModel(sMethod, sSubject, sClass);
                resolve(that.getOwnerComponent().getComponent(sComponent, sMethod, sSubject, sClass, that.getView()));
            }).then(function (oComponent) {
                that._oComponent = oComponent;
                var oControl = oComponent.getControl(sMethod, sSubject, sClass, that.getView());
                that.byId("ViewPage").addContent(oControl);
            });
        },

        getDataModel: function (sMethod, sSubject, sClass) {
            var that = this;
            var fnSuccess = function (response) {
                var oModel = new JSONModel();
                oModel.setProperty("/data", response);
                that.getView().setModel(oModel, "data");
                //oModel.setProperty("/data")
                console.log(that.getView());
            };
            this.getOwnerComponent().post(
                "/db/view",
                {
                    config: {
                        method: sMethod,
                        subject: sSubject,
                        class: sClass
                    }
                },
                fnSuccess,
                fnSuccess);
       
        },
        /**
         * Gets the current action by reading the URL browser hash value that is
         * currently set (gets set when a user clicks one of the left-hand
         * navigation links).
         *
         * @method     getBrowserHash
         * @memberOf   solo.web.controller.View
         * @return     {String}  The current action as a string.
         * @private
         */
        getBrowserHash: function() {
            var aHash = this.getOwnerComponent().getBrowserHash();
            return (aHash);
        },

        onReset: function() {
            console.log("on reset");
            console.log(this.byId("ViewPage"));
            this.byId("ViewPage").removeAllContent();
            var aHash = this.getBrowserHash();
            this.onNavigate(aHash[0], aHash[1], aHash[2]);
            this.getOwnerComponent().activeController = this;
        }
    });
});