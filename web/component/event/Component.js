sap.ui.define(['sap/ui/core/UIComponent', 'sap/ui/model/json/JSONModel'],
    function(UIComponent, JSONModel) {
        "use strict";

        var Component = UIComponent.extend("event.Component", {
            metadata: {
                manifest: "json"
            },
            init: function() {
                var oModel = new JSONModel();
                var oData = {
                    activeModel: null
                };
                oModel.setData(oData);
                sap.ui.getCore().setModel(oModel, "models");
                var oEventBus = sap.ui.getCore().getEventBus();
                var oData = {};
                var fnFunction = function(oData) {
                };
                oEventBus.subscribe("Dialog", "Open", this.setActiveModel);
                //oEventBus.publish("sChannelId", "sEventId", oData);
            },

            setActiveModel: function(sChannel, sEvent, oData) {
                var oModel = sap.ui.getCore().getModel("models");
                var oModelData = oModel.getData();
                console.log(oData.method + oData.subject + oData.class);
                oModelData.activeModel = oData.method + oData.subject + oData.class;
                oModel.setData(oModelData);
                sap.ui.getCore().setModel(oModel, "models");
                console.log(sap.ui.getCore().getModel("models"));
            }
        });

        /**
         * Basically, I am trying to organize the event processes that are responsible for instantiating a new control.
         * Yes, I want to handle that at a global level, rather than at the view level.
         * Whenever the getComponent function would be run, it should be called from here, after checking to see if the model
         * already exists.
         * 
         * First time someone clicks on view -> company -> general
         * getCompnent(Table)
         * create 
         */


        return Component;
    });