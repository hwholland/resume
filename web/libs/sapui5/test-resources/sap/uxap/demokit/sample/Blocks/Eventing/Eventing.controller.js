jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("sap.uxap.sample.Blocks.Eventing.Eventing", {

    onDummy: function (oEvent) {
        sap.m.MessageToast.show('dummy event fired by control ' + oEvent.getSource().getId());
    }
});
