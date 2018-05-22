sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - Sales Order - Main Page - Filters");

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

	opaTest("Check If The List Of Sales Orders Is Displayed, When The Button Is Pressed ", function(Given, When, Then) {

		// Action
		When.onTheMainPage.clickGo();

		Then.onTheMainPage.theListIsDisplayed();

	});

	opaTest("Check Filter Button Working ", function(Given, When, Then) {

		// Action
		When.onTheMainPage.clickFilter();

		Then.onTheMainPage.checkFilterPopup();

	});

	opaTest("Check Select Filters Popup", function(Given, When, Then) {

		When.onTheMainPage.clickFilterLink();
		Then.onTheMainPage.selectFilterPopupTitleCorrect();

	});

	opaTest("Check Select Filters Working", function(Given, When, Then) {

		Given.onTheMainPage.selectFilter();

		When.onTheMainPage.clickFilterOk();

		Then.onTheMainPage.checkFilterAdded();

	});

	opaTest("Check Selected Filters Working", function(Given, When, Then) {

		Given.onTheMainPage.clickFilterGo();
		Then.onTheMainPage.checkTableEntries();

	});

	
	opaTest("Check 'Filter(1)' Button Existence", function(Given, When, Then) {
		// Assertions
		Then.onTheDetailPage.checkFilterButtonToRemove();

	});
	
	
	opaTest("Check Filter Popup", function(Given, When, Then) {
		When.onTheDetailPage.clickFilterToRemove();
		Then.onTheMainPage.checkFilterPopup();
		
	});
	
	opaTest("Check Filter Removal", function(Given, When, Then) {
		When.onTheMainPage.removeFilter();
		When.onTheMainPage.clickFilterGo();
		Then.onTheMainPage.thePageTitleIsCorrect();
		Then.onTheMainPage.checkFilterRemoved();
		
	});
	
	
	
	// increase timeout, default 30000 is not enough
	QUnit.config.testTimeout = 77777;
	
	
	
});