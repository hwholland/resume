jQuery.sap.registerModulePath("sap.uiext.inbox.qunit.mockServer", "mockServer/");

jQuery.sap.require("sap.uiext.inbox.qunit.tcm.InboxTCMFunctionImportQUnit");
jQuery.sap.require("sap.uiext.inbox.qunit.mockServer.InboxMockServerQUnit");

asyncTest("callSearchUsers", 1, function() {
	
	var params = {SearchPattern: "adm", MaxResults: 10, SAP__Origin: "LOCALHOST_C73_00"};
	var sResponseStatus = "";
	var fnSuccess = function(oData, response){
						sResponseStatus = "OK";
						equal(sResponseStatus, "OK", "Response is ok");
					};
	var fnError = function(oData, response){
						sResponseStatus = "Not OK";
					};
					
	var delayedCall = function(){
		var oRequest = oTCMFunctionImport.callSearchUsers (params, fnSuccess, fnError);
		start();
	};
	
	setTimeout(delayedCall, 500);

});