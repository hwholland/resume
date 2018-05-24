///////////////
//Testing Module - Init
////////////////
module("Init ScfldMasterController");
var oScfldMasterController;
// require ScfldMasterController
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
test("New", function() {
	oScfldMasterController = new sap.ca.scfld.md.controller.ScfldMasterController();
	ok(oScfldMasterController, "Controller is initialized.");
});

//test("onInit", function() {
//	oScfldMasterController.onInit();
//	ok(oScfldMasterController, "onInit() is called.");
//});