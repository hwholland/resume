/*global sap, apf, modeler, core, jQuery, module, test, ok, equal, notEqual, deepEqual, notStrictEqual, notDeepEqual, expect, sinon, asyncTest, start, OData, window  */

(function() {
    'use strict';

	jQuery.sap.require("sap.ui.test.Opa5");
	jQuery.sap.require("sap.ui.test.opaQunit");
	jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
	// Arrangements
	var Arrangements = sap.ui.test.Opa5.extend("arrangement", {});
	// Actions
	var myActions = jQuery.extend({}, sap.apf.tests.integration.withMockServer.helper.CommonActions);
	myActions.iPressOnAddStepButtonToTestFooter = function() {
		return this.waitFor({
			viewName : "ui.reuse.view.carousel",
			controlType : "sap.m.Button",
			success : function(aButtons) {
				var oAddStepButton = aButtons[0];
				oAddStepButton.$().trigger("tap");
			}
		});
	};
	myActions.iAddAStepToTestFooter = function(sCategoryTitle, sStepTitle, sRepTitle) {
		return this.iPressOnAddStepButtonToTestFooter().and.iSelectAStepFromStepGallery(sCategoryTitle, sStepTitle, sRepTitle);
	};
	myActions.iClickOnFacetFilterList = function(params) {
		return this.waitFor({
			viewName : "facetFilter",
			controlType : "sap.m.Button",
			success : function(aButtons) {
				var Button;
				if (params === "P_FromDate") {
					Button = aButtons[0];
				} else if (params === "P_ToDate") {
					Button = aButtons[1];
				} else if (params === "CompanyCode") {
					Button = aButtons[2];
				} else if (params === "CustomerCountry") {
					Button = aButtons[3];
				}
				Button.$().trigger("tap");
			}
		});
	};
	myActions.iChangeValueFromFacetFilterList = function(params) {
		return this.waitFor({
			viewName : "facetFilter",
			controlType : "sap.m.FacetFilter",
			success : function(facetFilter) {
				var facetFilterList;
				if (params === "P_FromDate") {
					facetFilterList = facetFilter[0].getLists()[0];
				} else if (params === "P_ToDate") {
					facetFilterList = facetFilter[0].getLists()[1];
				} else if (params === "CompanyCode") {
					facetFilterList = facetFilter[0].getLists()[2];
				} else if (params === "CustomerCountry") {
					facetFilterList = facetFilter[0].getLists()[3];
				}
				facetFilterList.removeSelectedKeys();
				facetFilterList.setSelectedItem(facetFilterList.getItems()[1]);
			}
		});
	};
	myActions.iChangeAFacetFilterValue = function(params) {
		if (params === "P_FromDate") {
			return this.iClickOnFacetFilterList(params).and.iChangeValueFromFacetFilterList(params).and.iAddAStep("Time", "Revenue and Receivables over Time", "Line Chart");
		}
        if (params === "P_ToDate") {
			return this.iClickOnFacetFilterList(params).and.iChangeValueFromFacetFilterList(params).and.iAddAStep("Time", "Revenue and Receivables over Time", "Line Chart");
		}
        if (params === "CompanyCode") {
			return this.iClickOnFacetFilterList(params).and.iChangeValueFromFacetFilterList(params).and.iAddAStep("Line Items", "List of Open Line Items", "Table Representation");
		}
        if (params === "CustomerCountry") {
			return this.iClickOnFacetFilterList(params).and.iChangeValueFromFacetFilterList(params).and.iAddAStep("Country of Customer ", "Revenue by Country of Customer", "Pie Chart");
		}
	};
	myActions.iSelectADifferentReportingCurrency = function() {
		return this.waitFor({
			searchOpenDialogs : true,
			viewName : "sbtestapp.controls.view.reportingCurrency",
			controlType : "sap.m.StandardList",
			success : function(aListItems) {
				aListItems[5].getItems()[0].$().trigger("tap");
			}
		});
	};
	myActions.iClickTheReportingCurrencyButton = function() {
		return this.waitFor({
			viewName : "sbtestapp.controls.view.reportingCurrency",
			controlType : "sap.m.Button",
			success : function(aButtons) {
				aButtons[0].$().trigger("tap");
			}
		});
	};
	myActions.iClickTheExchangeRateButton = function() {
		return this.waitFor({
			viewName : "sbtestapp.controls.view.exchangeRate",
			controlType : "sap.m.Button",
			success : function(aButtons) {
				aButtons[0].$().trigger("tap");
			}
		});
	};
	myActions.iChangeReportingCurrencyValue = function() {
		return this.iClickTheReportingCurrencyButton().and.iSelectADifferentReportingCurrency().and.iAddAStepToTestFooter("Time", "Revenue and Receivables over Time", "Line Chart");
	};
	myActions.iClickOnSeeMoreFooterControlsButton = function() {
		return this.waitFor({
			viewName : "ui.reuse.view.layout",
			controlType : "sap.m.Bar",
			success : function(bar) {
				bar[1].getContentRight()[1].$().trigger("tap");
			}
		});
	};
	myActions.iDoSomeSelections = function() {
		return this.waitFor({
			viewName : "stepContainer",
			controlType : "sap.viz.ui5.Pie",
			success : function(pieChart) {
				var oChart = pieChart[0];
				var dimensionName = oChart.getDataset().getDimensions()[0].getName();
				var measureName = oChart.getDataset().getMeasures()[0].getName();
				var extDataResp = oChart.getModel().getData().data;
				var selectionObjects = [];
                var i, selObj;
				for( i = 0; i < 2; i++) {
					selObj = {
						data : {}
					};
					selObj.data[dimensionName] = extDataResp[i]["CustomerName"];
					selObj.data[measureName] = parseFloat(extDataResp[i]["RevenueAmountInDisplayCrcy_E"]);
					selectionObjects.push(selObj);
				}
				oChart.selection(selectionObjects);
			}
		});
	};
	var Actions = sap.ui.test.Opa5.extend("action", myActions);
	// Assertions
	//Facet Filter Assertions
	var Assertions = sap.ui.test.Opa5.extend("assertion", {
		iShouldSeeTheFacetFilter : function() {
			return this.waitFor({
				viewName : "facetFilter",
				controlType : "sap.m.FacetFilter",
				success : function(facetFilter) {
					ok(facetFilter[0], "Facet Filter Present on the UI");
				}
			});
		},
		iShouldSeeFourFacetFilterLists : function() {
			return this.waitFor({
				viewName : "facetFilter",
				controlType : "sap.m.FacetFilter",
				success : function(facetFilter) {
					equal(facetFilter[0].getLists().length, 4, "Four Facet Filter Lists Present on the UI");
				}
			});
		},
		iShouldSeeFacetFilterListsInOrder : function() {
			return this.waitFor({
				viewName : "facetFilter",
				controlType : "sap.m.FacetFilter",
				success : function(facetFilter) {
					equal(facetFilter[0].getLists()[0].getKey(), "P_FromDate", "From Date is the first facet filter shown on the UI which is as per the order given in the configuration");
					equal(facetFilter[0].getLists()[1].getKey(), "P_ToDate", "From Date is the first facet filter shown on the UI which is as per the order given in the configuration");
					equal(facetFilter[0].getLists()[2].getKey(), "CompanyCode", "From Date is the first facet filter shown on the UI which is as per the order given in the configuration");
					equal(facetFilter[0].getLists()[3].getKey(), "CustomerCountry", "From Date is the first facet filter shown on the UI which is as per the order given in the configuration");
				}
			});
		},
		iShouldSeeDefaultFacetFilterListsValues : function() {
			return this.waitFor({
				viewName : "facetFilter",
				controlType : "sap.m.FacetFilter",
				success : function(facetFilter) {
					var suffix = "2013";
					var text1 = facetFilter[0].getLists()[0].getSelectedItem().getText();
					var text2 = facetFilter[0].getLists()[1].getSelectedItem().getText();
					ok(text1.indexOf(suffix, text1.length - suffix.length) !== -1, "From Date value shown correctly on UI as set by smart business context");
					ok(text2.indexOf(suffix, text2.length - suffix.length) !== -1, "To Date shown correctly on UI as set by smart business context");
					equal(facetFilter[0].getLists()[2].getSelectedItems().length, 2, "Two company codes set on UI as per the smart business context");
					equal(facetFilter[0].getLists()[3].getSelectedItems().length, 10, "10 Customer countries set on UI as per the smart business context");
				}
			});
		},
		iShouldSeeTheTimeChartWithFacetfilterTimeFrame : function(params) {
			return this.waitFor({
				viewName : "stepContainer",
				controlType : "sap.viz.ui5.Line",
				success : function(lineChart) {
					var oChart = lineChart[0];
					if (params) {
						if (params === "P_FromDate") {
							equal(oChart.getModel().getData().data[0].YearMonth, "201311", "Chart loaded with selected FromDate from Facet Filter");
						} else if (params === "P_ToDate") {
							equal(oChart.getModel().getData().data[oChart.getModel().getData().data.length - 1].YearMonth, "201311", "Chart loaded with selected ToDate from Facet Filter");
						}
					} else {
						equal(oChart.getModel().getData().data[0].YearMonth, "201310", "Chart loaded with correct default timeframe(FromDate)");
						equal(oChart.getModel().getData().data[oChart.getModel().getData().data.length - 1].YearMonth, "201312", "Chart loaded with correct default timeframe(ToDate)");
					}
				}
			});
		},
		iShouldSeeTheCountryChartWithFacetfilterCountries : function(params) {
			return this.waitFor({
				viewName : "stepContainer",
				controlType : "sap.viz.ui5.Pie",
				success : function(pieChart) {
					var oChart = pieChart[0];
					var customerCountries = oChart.getModel().getData().data.reduce(function(previous, current) {
						if (previous.indexOf(current.CustomerCountry) === -1) {
							previous.push(current.CustomerCountry);
						}
						return previous;
					}, []);
					if (params) {
						equal(customerCountries.length, 1, "Chart loaded with correct Customer Countries from the facet filter");
					} else {
						equal(customerCountries.length, 10, "Chart loaded with correct Customer Countries from the facet filter");
					}
				}
			});
		},
		iShouldSeeTheLineItemsWithFacetfilterCompanyCodes : function(params) {
			return this.waitFor({
				viewName : "stepContainer",
				controlType : "sap.m.Table",
				success : function(table) {
					var oChart = table[0];
					var companyCodes = oChart.getModel().getData().tableData.reduce(function(previous, current) {
						if (previous.indexOf(current.CompanyCode) === -1) {
							previous.push(current.CompanyCode);
						}
						return previous;
					}, []);
					if (params) {
						equal(companyCodes.length, 1, "Chart loaded with correct Company Codes from facet filter");
					} else {
						equal(companyCodes.length, 2, "Chart loaded with correct Company Codes from facet filter");
					}
				}
			});
		},
		//Footer Assertions
		iShouldSeeReportingCurrencyButton : function() {
			return this.waitFor({
				viewName : "sbtestapp.controls.view.reportingCurrency",
				controlType : "sap.m.Button",
				success : function(aButtons) {
					ok(aButtons[0], "Reporting Currency Button Present on the footer");
				}
			});
		},
		iShouldSeeDefaultCurrencyInSelectDialog : function() {
			return this.waitFor({
				searchOpenDialogs : true,
				viewName : "sbtestapp.controls.view.reportingCurrency",
				controlType : "sap.m.StandardListItem",
				success : function(aListItems) {
					ok(aListItems, "Currency Select Dialog Opened On UI");
					equal(aListItems.length, 2, "Two Currencies shown in the currency select dialog");
					equal(aListItems[1].getSelected(), true, "EURO currency selected by default");
					aListItems[0].getParent().getParent().getBeginButton().firePress();
				}
			});
		},
		iShouldSeeTheTimeChartWithSelectedCurrency : function(params) {
			return this.waitFor({
				viewName : "ui.reuse.view.stepContainer",
				controlType : "sap.viz.ui5.Line",
				success : function(lineChart) {
					var oChart = lineChart[0];
					if (params) {
						equal(oChart.getDataset().getMeasures()[0].getName(), "Revenue (USD)", "Chart loaded with selected currency USD");
					} else {
						equal(oChart.getDataset().getMeasures()[0].getName(), "Revenue (EUR)", "Chart loaded with correct default currency EUR");
					}
				}
			});
		},
		iShouldSeeExchangeRateButton : function() {
			return this.waitFor({
				viewName : "sbtestapp.controls.view.exchangeRate",
				controlType : "sap.m.Button",
				success : function(aButtons) {
					ok(aButtons[0], "ExchangeRate Button Present on the footer");
				}
			});
		},
		iShouldSeeDefaulValuesInExchangeDialog : function() {
			return this.waitFor({
				searchOpenDialogs : true,
				viewName : "sbtestapp.controls.view.exchangeRate",
				controlType : "sap.m.Select",
				success : function(aDropdowns) {
					ok(aDropdowns.length, "Exchange Rate Type dropdown and Date Type dropdown shown in UI");
					equal(aDropdowns[0].getItems()[0].getKey(), "M", "Default Exchange Rate Type M selected in dialog");
					equal(aDropdowns[0].getItems()[0].getText(), "M - Standard translation at average rate", "Default Exchange Rate Text shown correctly in dialog");
					equal(aDropdowns[1].getItems()[0].getKey(), "postingDate", "Posting Date Selected by default");
					equal(aDropdowns[1].getItems()[0].getText(), "Dynamic Date", "Text shown as dynamic date in exchange rate date dropdown");
					aDropdowns[0].getParent().getParent().getParent().getEndButton().firePress();
				}
			});
		},
		iShouldSeeSelectionsOnChart : function() {
			return this.waitFor({
				viewName : "stepContainer",
				controlType : "sap.viz.ui5.Column",
				success : function(columnChart) {
					var oChart = columnChart[0];
					ok(oChart.selection(), "Selections transferred to the next chart");
				}
			});
		}
	});
	sap.ui.test.Opa5.extendConfig({
		arrangements : new Arrangements(),
		actions : new Actions(),
		assertions : new Assertions()
	});
	module("Facet Filter Tests", {
		setup : function() {
			sap.ui.test.Opa5.extendConfig({
				viewNamespace : "sap.apf.ui.reuse.view."
			});
		}
	});
	//Facet Filter Tests
	window.opaTest("Check Facet Filter on the UI", function(Given, When, Then) {
		Given.iStartMyAppInAFrame("../../demokit/app/index.html?sap-ui-language=EN");
		When.iLookAtTheScreen();
		Then.iShouldSeeTheFacetFilter();
	});
	window.opaTest("Check count of FacetFilterList on the UI", function(Given, When, Then) {
		When.iLookAtTheScreen();
		Then.iShouldSeeFourFacetFilterLists();
	});
	window.opaTest("Check whether order of FacetFilterList on the UI is same as in configuration", function(Given, When, Then) {
		When.iLookAtTheScreen();
		Then.iShouldSeeFacetFilterListsInOrder();
	});
	window.opaTest("Check default values of facet filter list", function(Given, When, Then) {
		When.iLookAtTheScreen();
		Then.iShouldSeeDefaultFacetFilterListsValues();
	});
	window.opaTest("Adding Line Chart to check whether from and to date facet filter values are reflected in the chart", function(Given, When, Then) {
		When.iAddAStep("Time", "Revenue and Receivables over Time", "Line Chart");
		Then.iShouldSeeTheTimeChartWithFacetfilterTimeFrame();
	});
	window.opaTest("Adding Pie Chart to check whether customer countries from facet filter are reflected in the chart", function(Given, When, Then) {
		When.iAddAStep("Country of Customer ", "Revenue by Country of Customer", "Pie Chart");
		Then.iShouldSeeTheCountryChartWithFacetfilterCountries();
	});
	window.opaTest("Adding Table Reresentation to check whether all company codes shown in facet filter are reflected in the chart", function(Given, When, Then) {
		When.iAddAStep("Line Items", "List of Open Line Items", "Table Representation");
		Then.iShouldSeeTheLineItemsWithFacetfilterCompanyCodes();
	});
	window.opaTest("Test if proper from date is reflected in chart after changing From Date from the facet Filter", function(Given, When, Then) {
		When.iChangeAFacetFilterValue("P_FromDate");
		Then.iShouldSeeTheTimeChartWithFacetfilterTimeFrame("P_FromDate");
	});
	window.opaTest("Test if proper to frame is reflected in chart after changing To Date from the facet Filter", function(Given, When, Then) {
		When.iChangeAFacetFilterValue("P_ToDate");
		Then.iShouldSeeTheTimeChartWithFacetfilterTimeFrame("P_ToDate");
	});
	window.opaTest("Test if proper CompanyCodes are reflected in chart after changing company codes from the facet Filter", function(Given, When, Then) {
		When.iChangeAFacetFilterValue("CompanyCode");
		Then.iShouldSeeTheLineItemsWithFacetfilterCompanyCodes("CompanyCode");
	});
	window.opaTest("Test if proper Customer Countries are reflected in chart after changing customer from the facet Filter", function(Given, When, Then) {
		When.iChangeAFacetFilterValue("CustomerCountry");
		Then.iShouldSeeTheCountryChartWithFacetfilterCountries("CustomerCountry");
	});
	module("Footer Tests", {
		setup : function() {
			sap.ui.test.Opa5.extendConfig({
				viewNamespace : "sap.apf."
			});
		}
	});
	window.opaTest("Check availability of reporting currency button on the footer", function(Given, When, Then) {
		When.iLookAtTheScreen();
		Then.iShouldSeeReportingCurrencyButton();
	});
	window.opaTest("Check on click of reportingCurrency button in footer select dialog opens and check the default selected currency", function(Given, When, Then) {
		When.iClickTheReportingCurrencyButton();
		Then.iShouldSeeDefaultCurrencyInSelectDialog();
	});
	window.opaTest("Check whether default value of reporting Currency is reflected in the chart", function(Given, When, Then) {
		When.iAddAStepToTestFooter("Time", "Revenue and Receivables over Time", "Line Chart");
		Then.iShouldSeeTheTimeChartWithSelectedCurrency();
	});
	window.opaTest("Test if proper reporting Currency is reflected in chart after changing currency from currency dialog", function(Given, When, Then) {
		When.iChangeReportingCurrencyValue();
		Then.iShouldSeeTheTimeChartWithSelectedCurrency("P_Currency");
	});
	window.opaTest("Check availability of exchange rate button on the footer", function(Given, When, Then) {
		When.iClickOnSeeMoreFooterControlsButton();
		Then.iShouldSeeExchangeRateButton();
	});
	window.opaTest("Check on click of exchangeRate button in footer exchange dialog opens and check the default values", function(Given, When, Then) {
		When.iClickTheExchangeRateButton();
		Then.iShouldSeeDefaulValuesInExchangeDialog();
	});
	module("Filter Passing between two steps", {
		setup : function() {
			sap.ui.test.Opa5.extendConfig({
				viewNamespace : "sap.apf.ui.reuse.view."
			});
		}
	});
	window.opaTest("Check filter passing between two charts", function(Given, When, Then) {
		When.iAddAStep("Customer", "Revenue by Customer", "Pie Chart").and.iDoSomeSelections().and.iAddAStep("Customer", "Revenue by Customer", "Column Chart");
		Then.iShouldSeeSelectionsOnChart();
	});
}());