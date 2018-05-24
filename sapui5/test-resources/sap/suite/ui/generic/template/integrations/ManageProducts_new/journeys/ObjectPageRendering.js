sap.ui.require(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";
 
		QUnit.module("Object Page Rendering");
 
		opaTest("The Title is rendered correctly", function(Given, When, Then) {
			// arrangements
			Given.iStartTheObjectPage();
			
			// actions
			When.onTheListReportPage.iLookAtTheScreen();
			
			// assertions
			Then.onTheObjectPage.thePageShouldContainTheCorrectTitle();
		});
		
		opaTest("The Actions are rendered correctly", function (Given, When, Then) {
			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			Then.onTheObjectPage.thePageShouldContainTheCorrectActions();
		});
		
		opaTest("The Header Facets are rendered correctly", function(Given, When, Then) {
			// actions
			When.onTheObjectPage.iLookAtTheScreen();
			
			// assertions
			Then.onTheObjectPage
				.theHeaderFacetGeneralInformationIsRendered()
				.and
				.theHeaderFacetProductCategoryIsRendered()
				.and
				.theHeaderFacetPriceDataPointIsRendered()
				.and
				.theHeaderFacetStockAvailabilityDataPointIsRendered()
				.and
				.theHeaderFacetProductDescriptionPlainTextIsRendered();
		});
		
		opaTest("The Facets are rendered correctly", function(Given, When, Then) {
			// actions
			When.onTheObjectPage.iLookAtTheScreen();
 
			// assertions
			Then.onTheObjectPage
				.theFacetProductInformationInsideTheFacetGeneralInformationIsRenderedCorrectly()
				.and
				.theFacetProductDescriptionsInsideTheFacetGeneralInformationIsRenderedCorrectly()
				.and
				.theFacetSupplierInsideTheFacetGeneralInformationIsRenderedCorrectly()
				.and
				.theFacetSalesRevenueIsRenderedCorrectly()
				.and
				.theFacetContactsIsRenderedCorrectly()
				.and
				.theExtensionFacetsAreRenderedCorrectly()
				.and
				.iTeardownMyApp();
		});
		
	}
);