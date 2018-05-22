sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - Sales Order - Detail Page - Buttons ");

	opaTest("Start App And Load Items", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		When.onTheDetailPage.clickGo().and.iWaitUntilTheListIsNotVisible();
		Then.onTheDetailPage.checkLoadedItems();

	});

	opaTest("Check Navigation To The Detail Page", function(Given, When, Then) {
		// Arrangements
		When.onTheDetailPage.clickDetail();
		// Assertions
		Then.onTheDetailPage.iShouldSeeThePageTitle();
		Then.onTheDetailPage.thePageTitleIsCorrect();
	});


	opaTest("Check Delete Button Existance", function(Given, When, Then) {

		Then.onTheDetailPage.checkDeleteButton();

	});


	opaTest("Check Edit Button Existance", function(Given, When, Then) {
		Then.onTheDetailPage.checkEditButton().and.iTeardownMyAppFrame();
	});

	QUnit.config.testTimeout = 88888;
});
