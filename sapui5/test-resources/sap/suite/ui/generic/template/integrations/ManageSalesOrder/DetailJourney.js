sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - Sales Order - Detail Page");

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

// opaTest("Check overflow button existance", function(Given, When, Then) {
// // Arrangements
// Then.onTheDetailPage.checkOverflowButton();
//
// });

	opaTest("Check Delete Button Existance", function(Given, When, Then) {

		Then.onTheDetailPage.checkDeleteButton();

	});

// opaTest("Check copy button existance", function(Given, When, Then) {
// Then.onTheDetailPage.checkCopyButton();
//
// });
// opaTest("Check Gross Amount button existance", function(Given, When, Then) {
// Then.onTheDetailPage.checkGrossAmtButton();
// });
// opaTest("Check Approve sales order button existance", function(Given, When, Then) {
// Then.onTheDetailPage.checkApproveButton();
//
// });
// opaTest("Check validate button existance", function(Given, When, Then) {
// Then.onTheDetailPage.checkValidateButton();
//
// });

	opaTest("Check Edit Button Existance", function(Given, When, Then) {
		Then.onTheDetailPage.checkEditButton();
	});

// opaTest("Check Add button existance", function(Given, When, Then) {
// Then.onTheDetailPage.checkAddButton();
//
// });

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

// opaTest("Check Draft Popup", function(Given, When, Then) {
// // // // Arrangements
// When.onTheDetailPage.clickItemForDraft();
// Then.onTheDetailPage.checkDraftPopup();
//
// });
//
// opaTest("Check Draft Item Exist Or Not", function(Given, When, Then) {
// // // // Arrangements
// Given.onTheDetailPage.clickResume();
// Given.onTheDetailPage.clickBack();
// Given.iStartMyApp();
// When.onTheMainPage.clickGo();
// Then.onTheMainPage.checkDraftItem();
//
// //
// });
//
// opaTest("Check Navigation By Click On Draft Item", function(Given, When, Then) {
// // Check on the draft item to check if the navigation is working
// When.onTheDetailPage.clickItemDraft();
// Then.onTheDetailPage.iShouldSeeThePageTitle();
// Then.onTheDetailPage.thePageTitleIsCorrect();
//
// });
//
// opaTest("Check Draft Popup For Discard", function(Given, When, Then) {
// // Check Draft popup again so that discard functionality will be checked
// Given.onTheDetailPage.clickBack();
// Given.iStartMyApp();
// Then.onTheMainPage.thePageTitleIsCorrect();
// When.onTheMainPage.clickGo().and.iWaitUntilTheListIsNotVisible();
// When.onTheDetailPage.clickItemForDraft();
// Then.onTheDetailPage.checkDraftPopup();
//
// });
//
// opaTest("Check Discard Navigation", function(Given, When, Then) {
// // Check if the discard draft functionality works or not
// When.onTheDetailPage.clickDiscard();
// Given.onTheDetailPage.clickBack();
// Then.onTheMainPage.thePageTitleIsCorrect();
//
// });
//
// opaTest("Check Select Filter For Draft Item", function(Given, When, Then) {
// // Put filter on the draft product id, so that discard draft functionality can be checked
// // // // Arrangements
// When.onTheMainPage.clickFilter();
// When.onTheMainPage.clickFilterLink();
// When.onTheMainPage.selectFilter();
// When.onTheMainPage.clickFilterOk();
// Then.onTheMainPage.checkDraftFilterAdded();
// //
// });
//
// opaTest("Check Item Discarded Or Not", function(Given, When, Then) {
// // Check if the item discarded successfully or not
// Given.onTheMainPage.clickFilterGo();
// Then.onTheMainPage.checkDraftItemDiscarded();
//
// });
//	
//	
//	

});
