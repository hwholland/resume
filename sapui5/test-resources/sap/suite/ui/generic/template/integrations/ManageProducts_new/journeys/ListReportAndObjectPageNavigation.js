sap.ui.require(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";
 
		QUnit.module("Navigations For List Report and Object Page");
 
		opaTest("The navigation from the List Report to the Object Page is correct", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();
			
			// actions
			When.onTheListReportPage
				.iClickTheGoButton()
				.and
				.iClickTheItemInTheTable(2);
			
			// assertions
			Then.onTheObjectPage.thePageContextShouldBeCorrect();
		});
		
		opaTest("The navigation from the Object Page to the List Report is correct", function (Given, When, Then) {
			// actions
			When.onTheObjectPage.iClickTheBackButton();
				
			// assertions
			Then.onTheListReportPage
				.theFilterBarIsInTheSameStateAsBefore()
				.and
				.theTableIsInTheSameStateAsBefore();
		});
		
		opaTest("The navigation from the List Report to the Object Page with a different item is correct", function (Given, When, Then) {
			// actions
			When.onTheListReportPage.iClickTheItemInTheTable(3);
			
			// assertions
			Then.onTheObjectPage
				.thePageContextShouldBeCorrect()
				.and
				.iTeardownMyApp();;
		});
	}
);