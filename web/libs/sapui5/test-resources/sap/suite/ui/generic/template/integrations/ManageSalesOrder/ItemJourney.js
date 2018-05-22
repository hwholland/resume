sap.ui.require([], function() {


	QUnit.module("Journey - Sales Order - Item Page");



	opaTest("Should Navigate to Detail Page", function(Given, When, Then) {
		// Arrangements
		When.onTheDetailPage.clickDetail();

		// Assertions
		Then.onTheDetailPage.iShouldSeeThePageTitle();
		Then.onTheDetailPage.thePageTitleIsCorrect();
		Then.onTheDetailPage.theListIsDisplayed();
	});

	opaTest("Should Navigate to Items Page", function(Given, When, Then) {
		// Arrangements
		When.onTheItemPage.clickitems();

		// Assertions
		Then.onTheItemPage.iShouldSeeThePageTitle();
		Then.onTheItemPage.thePageTitleIsCorrect();

	});

});
