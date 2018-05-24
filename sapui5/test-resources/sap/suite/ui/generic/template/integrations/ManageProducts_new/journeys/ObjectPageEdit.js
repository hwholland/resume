sap.ui.require(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";
 
		QUnit.module("Object Page Edit");
 
		opaTest("Clicking on the 'Edit' button will go into edit mode", function(Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();
 
			// actions
			When.onTheListReportPage
				.iClickTheGoButton()
				.and
				.iClickTheItemInTheTable(3);
			When.onTheObjectPage
				.iClickTheEditButton();
 
			// assertions
			Then.onTheObjectPage
				.thePageShouldBeInEditMode();
		});
		
		opaTest("Change the content of a field and Save", function(Given, When, Then) {
			// actions
			When.onTheObjectPage
				.iChangeTheFieldIntheFieldGroup("Height", "TechnicalData", "4.00")
				.and
				.iClickTheSaveButton();
			
			// assertions
			Then.onTheObjectPage
				.theDraftStatusIsDraftSaved();
		});
		
		opaTest("Navigate back to the ListReport and reload the list", function(Given, When, Then) {
			// actions
			When.onTheObjectPage.iClickTheBackButton();
			When.onTheListReportPage.iClickTheGoButton();
			
			// assertions
			Then.onTheListReportPage.theResponsiveTableHeaderHastheCorrectNumberOfItems(128); // +1 for the draft
		});
		
		opaTest("Click on the new draft and check the changes", function(Given, When, Then) {
			// actions
			When.onTheListReportPage
				.iClickTheItemInTheTable(1);
 
			// assertions
			Then.onTheObjectPage
				.theFieldIntheFieldGroupHasValue("Height", "TechnicalData", "4.000")
				.and
				.iTeardownMyApp();
		});
	}
);