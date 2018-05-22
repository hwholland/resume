sap.ui.controller("sap.ui.rta.test.Demo.ObjectPage.blockscolor.BlockBlueWithInfoController", {

    onInit: function () {
     } ,

	onAfterRendering: function() {
		var oText = this.getView().byId("moreContentText");
		var sMode = this.getView().getParent().getMode();
		(sMode === "Expanded")? oText.setText("...More Content") :  oText.setText("");
	},



    onParentBlockModeChange: function () {

    }
});
