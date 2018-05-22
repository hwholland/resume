sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - Sales Order - Main Page");

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

	opaTest("Check 'Hide Filter Bar' Button Existence", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.checkHideFilterButton();

	});

	opaTest("Check 'Filter' Button Existence", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.checkFilterButton();

	});

	opaTest("Check Settings Popup Dialog Comes With The Title ", function(Given, When, Then) {

		// Action
		When.onTheMainPage.clickSetting();

		Then.onTheMainPage.dialogOpen();
	});

	opaTest("Check Settings Popup Dialog Title Correct ", function(Given, When, Then) {

		Then.onTheMainPage.dialogTitle();
	});

	opaTest("Close Dialog", function(Given, When, Then) {
		When.onTheMainPage.closeDialog();
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

	// increase timeout, default 30000 is not enough
	QUnit.config.testTimeout = 88888;

});