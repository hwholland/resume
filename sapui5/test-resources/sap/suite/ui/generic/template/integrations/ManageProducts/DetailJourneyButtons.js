sap.ui.require([], function() {
	
	"use strict";

	QUnit.module("Journey - ManageProducts - DetailJourneyButtons");

	opaTest("#1 Start App And Load Item", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		//When.onTheDetailPage.clickGo().and.iWaitUntilTheListIsNotVisible();
		When.onTheDetailPage.clickGo();
		Then.onTheDetailPage.checkLoadedItems();
	});

	opaTest("#2 Check The Navigatation To Detail Page", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }

		// Arrangements
		When.onTheDetailPage.clickDetail(4);

		// Assertions
		Then.onTheDetailPage.iShouldSeeThePageTitle();
		Then.onTheDetailPage.thePageTitleIsCorrect();
	});
/*
	opaTest("#3 Check Overflow Button", function(Given, When, Then) {
		Then.onTheDetailPage.checkOverflowButtonVisible();
//		Then.onTheDetailPage.checkOverflowButton();
	});
*/
	opaTest("#4 Check Delete Button Existance", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }
		//When.onTheDetailPage.clickOverflow();
		Then.onTheDetailPage.checkDeleteButton();
	});

	opaTest("#5 Check Edit Button Existance", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }
		Then.onTheDetailPage.checkEditButton();
	});

//	opaTest("#5 Click Delete Button", function(Given, When, Then) {
//		When.onTheDetailPage.clickDelete();
//	});

	opaTest("#6 Check Copy Button Existance", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }
		// When.onTheDetailPage.clickOverflow();
		Then.onTheDetailPage.checkCopyButton();
	});
	
	opaTest("#7 Back to List Report", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }
		When.onTheDetailPage.clickBack();
		Then.onTheMainPage.thePageTitleIsCorrect();
	});

});