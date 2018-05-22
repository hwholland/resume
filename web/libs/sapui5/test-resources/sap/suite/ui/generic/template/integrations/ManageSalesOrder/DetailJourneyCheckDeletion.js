sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - Sales Order - Main Page - Check Deletion");

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

	opaTest("Check Navigation To The Detail Page", function(Given, When, Then) {
		// Arrangements
		When.onTheDetailPage.clickDetail();
		// Assertions
		Then.onTheDetailPage.iShouldSeeThePageTitle();
		Then.onTheDetailPage.thePageTitleIsCorrect();
		Then.onTheDetailPage.checkDeleteButton();
	});
	
	
	
	opaTest("Check Navigation After Deletion", function(Given, When, Then) {

		When.onTheDetailPage.clickDelete();
		Then.onTheDetailPage.checkConfirmDeletePopup();
		When.onTheDetailPage.clickConfirm();
		Then.onTheMainPage.iShouldSeeThePageTitle();
		Then.onTheMainPage.thePageTitleIsCorrect()
	});

	opaTest("Check 'Filter(1)' Button Existence", function(Given, When, Then) {
		// Assertions
		Then.onTheDetailPage.checkFilterButtonToRemove();

	});

	opaTest("Check Deletion Working", function(Given, When, Then) {
		// Assertions
		When.onTheDetailPage.clickFilterToRemove();
		When.onTheMainPage.removeFilter();
		When.onTheMainPage.clickFilterGo().and.iWaitUntilTheListIsNotVisible().and.iWaitUntilTheBusyIndicatorIsGone();
		Then.onTheDetailPage.itemDeleted();
	});


});