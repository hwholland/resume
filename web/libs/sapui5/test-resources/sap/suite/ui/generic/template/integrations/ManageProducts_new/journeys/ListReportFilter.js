sap.ui.require(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";
 
		QUnit.module("List Report Page - Filter Search");
 
		opaTest("The Search with no Filter displays all items", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();
 
			// actions
			When.onTheListReportPage.iClickTheGoButton();
 
			// assertions
			Then.onTheListReportPage
				.theResponsiveTableHeaderHastheCorrectNumberOfItems(127)
				.and
				.theResponsiveTableIsFilledWithItems(25) // 25 is the max for a table
		});
		
		opaTest("Searching for 'Own Draft' in the Filter should return 1 item", function (Given, When, Then) {
			// actions
			When.onTheListReportPage
				.iSetTheFilterFieldEditingStatus(1) // Editing Status: 0-All 1-Own Draft 2-Locked by Another User 3-Unsaved Changes by Another User 4-No Changes 
				.and
				.iClickTheGoButton();
			
			// assertions
			Then.onTheListReportPage
				.theResponsiveTableHeaderHastheCorrectNumberOfItems(1)
				.and
				.theResponsiveTableIsFilledWithItems(1)
				.and 
				.theResponsiveTableContainsTheCorrectItems({
					EditingStatus: 1 // Editing Status: 0-All 1-Own Draft 2-Locked by Another User 3-Unsaved Changes by Another User 4-No Changes
				});
		});
		
		opaTest("Searching for Editing Status = 'All' & Supplier = '100000000' in the Filter should return 2 items", function (Given, When, Then) {
			// actions
			When.onTheListReportPage
				.iSetTheFilterFieldEditingStatus(0) 			// Editing Status: 0-All 1-Own Draft 2-Locked by Another User 3-Unsaved Changes by Another User 4-No Changes
				.and
				.iSetTheFilterField("Supplier", "100000000")
				.and
				.iClickTheGoButton();
			
			// assertions
			Then.onTheListReportPage
				.theResponsiveTableHeaderHastheCorrectNumberOfItems(2)
				.and
				.theResponsiveTableIsFilledWithItems(2)
				.and
				.theResponsiveTableContainsTheCorrectItems({
					Supplier: "100000000",
					EditingStatus: 0 // Editing Status: 0-All 1-Own Draft 2-Locked by Another User 3-Unsaved Changes by Another User 4-No Changes
				})
				.and
				.iTeardownMyApp();
		});
	}
);