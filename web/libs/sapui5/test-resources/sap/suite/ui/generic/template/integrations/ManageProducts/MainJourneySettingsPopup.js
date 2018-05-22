sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - ManageProducts - MainJourneySettingsPopup");

	opaTest("#1 Check if The Main Page Coming With Title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		// Assertions
		Then.onTheMainPage.iShouldSeeThePageTitle();
	});

	opaTest("#2 Check if The Main Page Title Is Correct", function(Given, When, Then) {
		// Assertions
		Then.onTheMainPage.thePageTitleIsCorrect();
	});

	opaTest("#3 Check Settings Popup Dialog Comes With The Title ", function(Given, When, Then) {
		// Action
		When.onTheMainPage.clickSetting();
		Then.onTheMainPage.dialogOpen();
	});

	opaTest("#4 Check Settings Popup Dialog Title Correct ", function(Given, When, Then) {
		Then.onTheMainPage.dialogTitle();
	});

	opaTest("#5 Check Closing Of Dialog", function(Given, When, Then) {
		When.onTheMainPage.closeDialog();
		Then.onTheMainPage.thePageTitleIsCorrect();
	});
	
});