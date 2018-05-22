sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
    "use strict";

    var sActiveRoute = null;

    /**
     * @class      solo.web.controller.Record
     * @extends    sap.ui.core.mvc.Controller
     */
    return Controller.extend("solo.web.controller.Record", {

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
            var sComponent = "dynamic.Spreadsheet";
            var pComponent = new Promise((resolve, reject) => {
                resolve(that.getOwnerComponent().getComponent(sComponent, sMethod, sSubject, sClass, that.getView()));
            }).then(function(oComponent) {
                var oControl = oComponent.getControl(sMethod, sSubject, sClass, that.getView());
                var oConfig = oComponent.getConfigModel().getData()[sMethod][sSubject][sClass];
                that._oRowTemplate = oConfig.row;
                that._oDataModel = new JSONModel();
                that._oDataModel.setData({
                    data: []
                });
                var oModel = that.getEmptyRow();
                oControl.setModel(oModel, "data");
                that.byId("RecordPage").addContent(oControl);
            });
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

        getEmptyRow: function() {
            var oLine = jQuery.extend(true, {}, this._oRowTemplate);
            var oData = this._oDataModel.getData();
            oData.data.push(oLine);
            this._oDataModel.setData(oData);
            return(this._oDataModel);
        },

        onReset: function() {
            this.byId("RecordPage").removeAllContent();
            var aHash = this.getBrowserHash();
            this.onNavigate(aHash[0], aHash[1], aHash[2]);
            this.getOwnerComponent().activeController = this;
        }
    });
});