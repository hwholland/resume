jQuery.sap.require("sap.m.MessageToast");
sap.ui.controller("sap.uxap.sample.ObjectPageSubSectionSized.InfoButtonController", {

    onInit: function () {
     } ,

	onAfterRendering: function() {
		var button =    this.getView().byId("infoButton");
		var layout = this.getView().getParent().getColumnLayout();
		button.setText("Layout : " + layout);
	},


	onPress: function (oEvent) {
        sap.m.MessageToast.show(this.getView().getParent().getColumnLayout());
    },

    onParentBlockModeChange: function () {

    }
});
