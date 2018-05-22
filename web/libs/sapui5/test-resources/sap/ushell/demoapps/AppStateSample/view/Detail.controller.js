/*global sap, jQuery */
sap.ui.controller("sap.ushell.demo.AppStateSample.view.Detail", {

    collectionNames : ["Fiori2",
                       "Fiori3",
                       "Fiori4",
                       "Fiori5",
                       "Fiori6",
                       "Fiori7",
                       "BusinessSuiteInAppSymbols",
                       "FioriInAppIcons",
                       "FioriNonNative"
                       ],

    collectIcons : function () {
        "use strict";
        var res = [],
            sUri = "sap-icon://Fiori2/F0002",
            nr,
            that,
            names;
        this.collectionNames.forEach(function (sCollectionName) {
            if (sap.ui.core.IconPool.getIconCollectionNames().indexOf(sCollectionName) < 0) {
                // in the noshell use case, the icon collections are not registered
                return;
            }
            names = sap.ui.core.IconPool.getIconNames(sCollectionName);
            if (names) {
                names.forEach(function (nm, idx) {
                    sUri = "sap-icon://" + sCollectionName + "/" + nm;
                    res.push({ key : sUri, Index : idx, CollectionName : sCollectionName });
                });
            }
        });
        return res;
    },

    renderIcons : function (sCollectionName) {
        "use strict";
        var sUri = "sap-icon://Fiori2/F0002",
            nr,
            that,
            names;
        if (sap.ui.core.IconPool.getIconCollectionNames().indexOf(sCollectionName) < 0) {
            // in the noshell use case, the icon collections are not registered
            return;
        }
        names = sap.ui.core.IconPool.getIconNames(sCollectionName);
        if (!names) {
            return;
        }
        nr = names.length;
        that = this;
        that.getView().byId("pgView2").addContent(new sap.m.Text({text: sCollectionName + ": " + nr + "icons"}));
        names.forEach(function (nm, idx) {
            sUri = "sap-icon://" + sCollectionName + "/" + nm;
            that.getView().byId("pgView2").addContent(new sap.ui.core.Icon({
                height: "38px",
                //press: chips.tiles.utils.onSelectIcon.bind(null, oController),
                size: "2rem",
                src: sUri,
                tooltip: sUri + "(" + idx + ")",
                width: "38px"
            }));
        });
    },

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function () {
        "use strict";
        var that = this;
        this.collectionNames.forEach(function (sNm) {
            that.renderIcons(sNm);
        });
        this.oModel = new sap.ui.model.json.JSONModel({ search : "abc", icons: this.collectIcons()
            });
        this.getView().setModel(this.oModel);
        this.getView().byId("search").attachLiveChange(this.handleChange.bind(this));
        this.getMyComponent().getModel("AppState").bindProperty("/appState/filter").attachChange(this.updateModel.bind(this));
        this.updateModel();
    },

    getMyComponent: function () {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        return sap.ui.component(sComponentId);
    },

    updateModel : function () {
        "use strict";
        var filter,
            res;
        res = this.collectIcons();
        filter = this.getMyComponent().getModel("AppState").getProperty("/appState/filter");
        jQuery.sap.log.info("updateModel ... " + filter);
        filter = filter.split(" ");
        filter.forEach(function (nv) {
            res = res.filter(function (obj) {
                return obj.key.indexOf(nv) >= 0;
            });
        });
        this.oModel.getData().icons = res;
        this.oModel.refresh();
    },

    handleChange : function (ev) {
        "use strict";
        var res,
            search;
        jQuery.sap.log.info("handleChange ..." + ev.oSource.getModel("AppState").getProperty("/appState/filter"));
        // update the model AppState
        ev.oSource.getModel("AppState").setProperty("/appState/filter", ev.mParameters.newValue);
    },

    getRouter: function () {
        "use strict";
        return sap.ui.core.UIComponent.getRouterFor(this);
    },

    onClearSearch : function () {
        "use strict";
        this.getView().byId("search").setValue("");
    },
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Detail
*/
//onBeforeRendering: function() {
//
//},

    handleBtn1Press : function () {
        "use strict";
        this.getRouter().navTo("toView1", {iAppState : this.getMyComponent().getInnerAppStateKey()});
    }


});