sap.ui.require(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";
 
		QUnit.module("List Report Page Rendering");
 
		opaTest("The Title is rendered correctly", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();
 
			// actions
			When.onTheListReportPage.iLookAtTheScreen();
 
			// assertions
			Then.onTheListReportPage
				.thePageShouldContainTheCorrectTitle();
		});
		
		opaTest("The Filter Bar is rendered correctly", function (Given, When, Then) {
			// actions
			When.onTheListReportPage.iLookAtTheScreen();
			
			// assertions
			Then.onTheListReportPage
				.theFilterBarIsRenderedCorrectly()
				.and
				.theFilterSelectionFieldWhenDraftIsEnabledIsRenderedCorrectly()
				.and
				.theFilterSelectionFieldWhenForABreakoutIsRenderedCorrectly();
		});
		
		opaTest("The Table is rendered correctly", function (Given, When, Then) {
			// actions
			When.onTheListReportPage.iLookAtTheScreen();
 
			// assertions
			Then.onTheListReportPage
				.theSmartTableIsRenderedCorrectly()
				.and
				.theCustomToolbarForTheSmartTableIsRenderedCorrectly()
				.and
				.theResponsiveTableInsideTheSmartTableIsRenderedCorrrectly()
				.and
				.iTeardownMyApp();
		});
	}
);