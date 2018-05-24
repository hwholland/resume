sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - Sales Order - Main Page - Buttons");

	opaTest("Check if the Main Page Comes With The Title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Assertions
		// Assertions
		Then.onTheMainPage.iShouldSeeThePageTitle();

	});

	opaTest("Check if The Main Page Title is Correct", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.thePageTitleIsCorrect();
	});

	opaTest("Check 'Go' Button Existence", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.checkGoButton();
	});

	opaTest("Check 'Add' Button Existence", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.checkAddButton();

	});

	opaTest("Check 'Settings' Button Existence", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.checkSettingButton();

	});

	opaTest("Check 'Export Excel' Button Existence", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.checkExportButton();

	});

	/*opaTest("Check 'Hide Filter Bar' Button Existence", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.checkHideFilterButton();

	});
	*/
	opaTest("Check 'Show Filter Bar' Button Existence", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.checkShowFilterButton();

	});

	opaTest("Check 'Filter' Button Existence", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.checkFilterButton();

	});

	// increase timeout, default 30000 is not enough
	QUnit.config.testTimeout = 88888;

});
