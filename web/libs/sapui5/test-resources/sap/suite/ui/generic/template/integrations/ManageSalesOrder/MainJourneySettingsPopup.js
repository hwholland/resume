sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - Sales Order - Main Page - Settings Popup");

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

	
	// increase timeout, default 30000 is not enough
	QUnit.config.testTimeout = 88888;

});
