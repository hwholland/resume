sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - ManageProducts - MainJourneyFilters");

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

	opaTest("#3 Check If The List Of Products Is Displayed, When The Button Is Pressed ", function(Given, When, Then) {
		// Action
		When.onTheMainPage.clickGo();
		Then.onTheMainPage.theListIsDisplayed();
	});

	opaTest("#4 Check Filter Button Working ", function(Given, When, Then) {
		// Action
		When.onTheMainPage.clickFilter();
		Then.onTheMainPage.checkFilterPopup('Filters');
	});

	opaTest("#5 Check Select Filters Popup", function(Given, When, Then) {
		When.onTheMainPage.clickFilterLink();
		Then.onTheMainPage.selectFilterPopupTitleCorrect();
	});

	opaTest("#6 Check Select Filters Working", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }
		
		Given.onTheMainPage.selectFilter();
		When.onTheMainPage.clickFilterOk();
		Then.onTheMainPage.checkFilterAdded();
	});

	opaTest("#7 Check Selected Filters Working", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }
		Given.onTheMainPage.clickFilterGo();
		Then.onTheMainPage.iShouldSeeThePageTitle();
		Then.onTheMainPage.checkTableEntries();
	});

	opaTest("#8 Check 'Filter(1)' Button Existence", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }
		// Assertions
		Then.onTheDetailPage.checkFilterButtonToRemove();
	});
	
	opaTest("#9 Check Filter Popup", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }
		When.onTheMainPage.clickFilterToRemove();
		Then.onTheMainPage.checkFilterPopup('Filters');
	});
	
	opaTest("#10 Check Filter Removal", function(Given, When, Then) {
		// currently these tests fail at the nightly-build on firefox, locally no issues 
	  if (sap.ui.Device.browser.firefox) {
	  	ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
	  	return this;
	  }
		When.onTheMainPage.removeFilter();
		When.onTheMainPage.clickFilterGo();
		Then.onTheMainPage.thePageTitleIsCorrect();
		Then.onTheMainPage.checkFilterRemoved();
	});
	
});