sap.ui.require(["sap/ui/test/opaQunit"], function (opaTest) {
	"use strict";
	
	QUnit.module("List Report Page Delete");
	
	opaTest("Delete 1 item in the table", function (Given, When, Then) {
		Given.iStartTheListReport();
		
		When.onTheListReportPage
			.iClickTheGoButton()
			.and
			.iSelectADraftItemInTheTable()
			.and
			.iClickTheDeleteButton()
			.and
			.iWaitForTheDeleteDialogAndPressTheConfirmationButton();
		
		Then.onTheListReportPage
			.theSelectedItemIsDeleted()
			.and
			.iTeardownMyApp();
	});
});