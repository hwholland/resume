sap.ui.require(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";
 
		QUnit.module("Object Page Create");
 
		opaTest("Clicking on the 'Create' button will go into create/edit mode", function(Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();
 
			// actions
			When.onTheListReportPage
				.iClickTheCreateButton();
 
			// assertions
			Then.onTheObjectPage
				.thePageShouldBeInEditMode();
		});

		opaTest("Enter the content of mandatory fields", function(Given, When, Then) {
			// actions
			When.onTheObjectPage
				.iChangeTheFieldIntheFieldGroup("Product", "GeneralInformation", "EPM-000815")
				.and
				.iChangeTheFieldIntheFieldGroup("Supplier", "GeneralInformation", "100000001")
				.and
				.iChangeTheFieldIntheFieldGroup("ProductCategory", "GeneralInformation", "Accessories")
				.and
				.iChangeTheFieldIntheFieldGroup("Price", "GeneralInformation", "22.00")
				.and
				.iChangeTheFieldIntheFieldGroup("Height", "TechnicalData", "4.00")
				.and
				.iChangeTheFieldIntheFieldGroup("Width", "TechnicalData", "5.00")
				.and
				.iChangeTheFieldIntheFieldGroup("Depth", "TechnicalData", "6.00")
				.and
				.iChangeTheFieldIntheFieldGroup("Weight", "TechnicalData", "11.00");
//				.and
//				.iClickTheSaveButton();
			
			// assertions
			Then.onTheObjectPage
				.theDraftStatusIsDraftSaved();
		});

		opaTest("Navigate back to the ListReport", function(Given, When, Then) {
			// actions
			When.onTheObjectPage.iClickTheBackButton();
			When.onTheListReportPage.iClickTheGoButton();
			
			// assertions
			Then.onTheListReportPage
				.theResponsiveTableHeaderHastheCorrectNumberOfItems(126) // +1 for the draft
				.and
				.iTeardownMyApp();
		});
	}
);