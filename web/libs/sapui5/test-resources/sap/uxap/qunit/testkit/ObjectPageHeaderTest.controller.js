

sap.ui.controller("sap.uxap.testkit.ObjectPageHeaderTest", {

	onInit: function () {
		var oJsonModel = new sap.ui.model.json.JSONModel("./test-resources/demokit/sample/ObjectPageOnJSON/HRData.json");

		this.getView().setModel(oJsonModel, "ObjectPageModel");
//		var oHeader= this.getView().byId("headerForTest");
//		var sHeaderImageId=this.byId("headerImage").getId();
//		var oImageResizeAnimation= new sap.uxap.ScrollAnimation({
//			name:"resize",
//			animationFor:sHeaderImageId,
//			params:{
//				originalWidth: 135, // not mandatory
//				originalHeight: 135,  // not mandatory
//				destWidth: 30,
//				destHeight: 30
//			}
//		});
//		oHeader.addScrollAnimation(oImageResizeAnimation);

	},

	onActionPress: function (oEvent) {
		alert("action called!");
	}
});
