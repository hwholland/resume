/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)

(function() {

	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');

	jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerNew");
	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
		jQuery.sap.require("sap.ui.qunit.qunit-coverage");
	}

	QUnit.module('APF UI Representation Utils', {
		beforeEach : function(assert) {
			var inject = {
					SessionHandler : sap.apf.testhelper.doubles.sessionHandlerStubbedAjax
			};
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi("CompUi", 
					"/apf-test/test-resources/sap/apf/testhelper/config/applicationConfigurationIntegration.json", inject);
			var self = this;
			var spyGetEventCallback = function(eventType) {
				return self.oGlobalApi.oUiApi.getEventCallback(eventType);
			};
			sinon.stub(this.oGlobalApi.oApi, 'getEventCallback', spyGetEventCallback);
			sinon.stub(this.oGlobalApi.oUiApi, 'getEventCallback', spyUiGetEventCallback);
			var spyUiGetEventCallback = function() {
				return "";
			};
			var newMetadata = {
				getPropertyMetadata : function(sPropertyName) {
					var metadata;
					switch (sPropertyName) {
						case "CustomerName":
							metadata = {
								"aggregation-role" : "dimension",
								"dataType" : {
									"maxLength" : "10",
									"type" : "Edm.String"
								},
								"label" : "Customer Name",
								"name" : "CustomerName"
							};
							break;
						case "YearMonth":
							metadata = {
								"name" : "YearMonth",
								"isCalendarYearMonth" : "true",
								"dataType" : {
									"type" : "Edm.String",
									"maxLength" : "6"
								},
								"aggregation-role" : "dimension",
								"label" : "Year and Month"
							};
							break;
						case "CalendarDate":
							metadata = {
								"name" : "CalendarYear",
								"isCalendarDate" : "true",
								"dataType" : {
									"maxLength" : "10",
									"type" : "Edm.String"
								},
								"aggregation-role" : "dimension",
								"label" : "Year and Month"
							};
							break;
						case "CalendarWeek":
							metadata = {
								"name" : "CalendarWeek",
								"isCalendarYearWeek" : "true",
								"dataType" : {
									"maxLength" : "10",
									"type" : "Edm.String"
								},
								"aggregation-role" : "dimension",
								"label" : "Year and Month"
							};
							break;
						case "CalendarQuarter":
							metadata = {
								"name" : "CalendarQuarter",
								"isCalendarYearQuarter" : "true",
								"dataType" : {
									"maxLength" : "10",
									"type" : "Edm.String"
								},
								"aggregation-role" : "dimension",
								"label" : "Year and Month"
							};
							break;
						case "DaysSalesOutstanding":
							metadata = {
								"aggregation-role" : "measure",
								"dataType" : {
									"maxLength" : "10",
									"type" : "Edm.String"
								},
								"label" : "DSO",
								"name" : "DaysSalesOutstanding"
							};
							break;
						case "RevenueAmountInCoCodeCrcy_E":
							metadata = {
								"name" : "RevenueAmountInDisplayCrcy_E",
								"ISOCurrency" : "DisplayCurrency",
								"scale" : "DisplayCurrencyDecimals",
								"dataType" : {
									"type" : "Edm.Decimal",
									"precision" : "34"
								},
								"filterable" : "false",
								"aggregation-role" : "measure",
								"label" : "Revenue in Display Currency",
								"unit" : "RevenueAmountInDisplayCrcy_E.CURRENCY"
							};
							break;
						case "DebitAmountInCoCodeCrcy_E":
							metadata = {
								"name" : "RevenueAmountInDisplayCrcy_E",
								"ISOCurrency" : "DisplayCurrency",
								"scale" : "DisplayCurrencyDecimals",
								"dataType" : {
									"type" : "Edm.Decimal",
									"precision" : "34"
								},
								"filterable" : "false",
								"aggregation-role" : "measure",
								"label" : "Revenue in Display Currency",
								"unit" : "measureunit"
							};
							break;
						case "RevenueAmountInDisplayCrcy_E.CURRENCY":
							metadata = {
								"semantics" : "currency-code"
							};
							break;
						case "measureunit":
							metadata = {
								"semantics" : "unit-of-measure"
							};
							break;
						case "DebitAmountInCoCodeCrcy_E2":
							metadata = {
								"name" : "DebitAmountInCoCodeCrcy_E2",
								"ISOCurrency" : "DisplayCurrency",
								"scale" : "DisplayCurrencyDecimals",
								"dataType" : {
									"type" : "Edm.Decimal",
									"precision" : "34"
								},
								"filterable" : "false",
								"aggregation-role" : "measure",
								"label" : "Revenue in Display Currency",
								"unit" : "newunit"
							};
							break;
						case "DebitAmountInCoCodeCrcy_EWithScale":
							metadata = {
								"name" : "DebitAmountInCoCodeCrcy_EWithScale",
								"ISOCurrency" : "DisplayCurrency",
								"scale" : "3",
								"dataType" : {
									"type" : "Edm.Decimal",
									"precision" : "3"
								},
								"filterable" : "false",
								"aggregation-role" : "measure",
								"label" : "Revenue in Display Currency",
								"unit" : "newunit"
							};
							break;
						case "newunit":
							metadata = {
								"semantics" : "new-unit"
							};
							break;
						case "PostingDate_E":
							metadata = {
								"name" : "PostingDate_E",
								"dataType" : {
									"type" : "Edm.DateTime"
								},
								"aggregation-role" : "dimension",
								"label" : "Posting Date"
							};
							break;
						default:
							metadata = {};
							break;
					}
					return metadata;
				}
			};
			this.aDataResponse = [ {
				"CalendarDate" : "20140310",
				"CalendarWeek" : "201421",
				"CalendarQuarter" : "20142",
				"YearMonth" : "201305",
				"PostingDate_E" : "/Date(1335830400000)/",
				"SAPClient" : "777",
				"CompanyCode" : "1000",
				"Customer" : "1001",
				"DisplayCurrencyDecimals" : "2",
				"CustomerName" : "Nelson Tax & Associates",
				"DaysSalesOutstanding" : "54.66",
				"RevenueAmountInCoCodeCrcy_E" : "3844.82",
				"CoArea" : "1000",
				"RevenueAmountInDisplayCrcy_E.CURRENCY" : "USD",
				"measureunit" : "KG"
			}, {
				"SAPClient" : "777",
				"RevenueAmountInDisplayCrcy_E.CURRENCY" : "USD",
				"YearMonth" : "201306",
				"CompanyCode" : "1000",
				"Customer" : "1002",
				"CustomerName" : "Becker Berlin",
				"DaysSalesOutstanding" : "43.73",
				"RevenueAmountInCoCodeCrcy_E" : "6044",
				"CoArea" : "2000"
			}, {
				"SAPClient" : "777",
				"YearMonth" : "201307",
				"RevenueAmountInDisplayCrcy_E.CURRENCY" : "USD",
				"CompanyCode" : "1000",
				"Customer" : "1003",
				"CustomerName" : "ABACO, CASA DE BOLSA",
				"DaysSalesOutstanding" : "43.4",
				"RevenueAmountInCoCodeCrcy_E" : "3544.44",
				"CoArea" : "3000"
			}, {
				"SAPClient" : "777",
				"YearMonth" : "201308",
				"RevenueAmountInDisplayCrcy_E.CURRENCY" : "USD",
				"CompanyCode" : "1000",
				"Customer" : "1004",
				"CustomerName" : "ANDERSON CLAYTON &CO",
				"DaysSalesOutstanding" : "43.39",
				"RevenueAmountInCoCodeCrcy_E" : "3444.71",
				"CoArea" : "4000"
			} ];
			this.formatter = new sap.apf.ui.utils.formatter({
				getEventCallback : this.oGlobalApi.oApi.getEventCallback.bind(this.oGlobalApi.oApi),
				getTextNotHtmlEncoded : this.oGlobalApi.oApi.getTextNotHtmlEncoded
			}, newMetadata, this.aDataResponse);
			this.newDataResponse = [];
			this.formatter0 = new sap.apf.ui.utils.formatter({
				getEventCallback : this.oGlobalApi.oApi.getEventCallback.bind(this.oGlobalApi.oApi),
				getTextNotHtmlEncoded : this.oGlobalApi.oApi.getTextNotHtmlEncoded
			}, newMetadata, this.newDataResponse);
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();
			this.oGlobalApi.oApi.getEventCallback.restore();
			this.oGlobalApi.oUiApi.getEventCallback.restore();
		}
	});
	QUnit.test("Availability tests", function(assert) {
		assert.ok(typeof this.formatter.getFormattedValue === "function", "getFormattedValue() available");
		assert.ok(typeof this.formatter.doYearMonthFormat === "function", "doYearMonthFormat() available");
		assert.ok(typeof this.formatter.isAmountField === "function", "isAmountField() available");
		assert.ok(typeof this.formatter.getPrecision === "function", "getPrecision() available");
		assert.ok(typeof this.formatter.getFormatString === "function", "getFormatString() available");
	});
	QUnit.test('getFormattedValue() -Unit test', function(assert) {
		//amount type TODO
		var formatedValue;
		formatedValue = this.formatter.getFormattedValue("RevenueAmountInCoCodeCrcy_E", 3844.82);
		assert.strictEqual(formatedValue.charAt(1), ((2345).toLocaleString().charAt(1)), "The thousand seperator in the formated amount value is correct");
		assert.strictEqual(formatedValue.charAt(5), ((2.5).toLocaleString().charAt(1)), "The decimal seperator in the formated amount value is correct");
		//yearMonth type
		formatedValue = this.formatter.getFormattedValue("YearMonth", "201305");
		assert.strictEqual(formatedValue, this.oGlobalApi.oApi.getTextNotHtmlEncoded('month-5-shortName') + " 2013", "Formatted the given yearMonth value : " + formatedValue);
		//dateTime type
		formatedValue = this.formatter.getFormattedValue("PostingDate_E", "/Date(1335830400000)/");
		assert.strictEqual(formatedValue, new Date(1335830400000).toLocaleDateString(), "Formatted the given date time value according to locale : " + formatedValue);
		//CalendarDate tyoe
		formatedValue = this.formatter.getFormattedValue("CalendarDate", "20140310");
		assert.strictEqual(formatedValue, new Date(2014, 02, 10).toLocaleDateString(), "Formatted the given Calendar date value according to locale : " + formatedValue);
		//CalendarWeek type
		formatedValue = this.formatter.getFormattedValue("CalendarWeek", "201421");
		assert.strictEqual(formatedValue, "CW21" + " " + "2014", "Formatted the given date time value to calendar week : " + formatedValue);
		//CalendarQuarter type
		formatedValue = this.formatter.getFormattedValue("CalendarQuarter", "20142");
		assert.strictEqual(formatedValue, "Q2" + " " + "2014", "Formatted the given date time value to calendar quarter : " + formatedValue);
		//not of any type, default value
		formatedValue = this.formatter.getFormattedValue("CustomerName", "Nelson Tax & Associates");
		assert.strictEqual(formatedValue, "Nelson Tax & Associates", "Returned the field Value as its not of type amount,dateTime and yearMonth : " + formatedValue);
		//negative tests - dateTime with null dateTime Value
		formatedValue = this.formatter.getFormattedValue("PostingDate_E", null);
		assert.strictEqual(formatedValue, "-", "getFormattedValue() for PostingDate_E returns '-' for null field value");
		//negative tests - dateTime with invalid dateTime Value
		formatedValue = this.formatter.getFormattedValue("PostingDate_E", "/Date()/");
		assert.strictEqual(formatedValue, "-", "getFormattedValue() for PostingDate_E returns '-' for Invalid dateTime value");
		//negative tests - amount type with null field Value
		formatedValue = this.formatter.getFormattedValue("RevenueAmountInCoCodeCrcy_E", null);
		assert.strictEqual(formatedValue, "-", "getFormattedValue() for RevenueAmountInCoCodeCrcy_E returns empty for null amount value");
		//negative tests - amount type when no semantics for currency defined
		formatedValue = this.formatter.getFormattedValue("DebitAmountInCoCodeCrcy_E", 3844.02);
		assert.strictEqual(formatedValue, 3844.02, "getFormattedValue() for DebitAmountInCoCodeCrcy_E returns fieldvalue when semantics of metadata.unit is not defined");
		//negative tests - invalid Date
		formatedValue = this.formatter.getFormattedValue("CalendarDate", "/Date()/");
		assert.strictEqual(formatedValue, "-", "getFormattedValue() for CalendarDate returns '' for Invalid dateTime value");
		//negative test - calendarWeek null value
		formatedValue = this.formatter.getFormattedValue("CalendarWeek", null);
		assert.strictEqual(formatedValue, "", "getFormattedValue() for CalendarWeek returns ' ' for null value");
		//negative test - calendarQuarter null value
		formatedValue = this.formatter.getFormattedValue("CalendarQuarter", null);
		assert.strictEqual(formatedValue, "", "getFormattedValue() for CalendarQuarter returns ' ' for null value");
		//amount type when the scale is directly given in metadata
		formatedValue = this.formatter.getFormattedValue("DebitAmountInCoCodeCrcy_EWithScale", 3844.02);
		assert.strictEqual(formatedValue, 3844.02, "getFormattedValue() for DebitAmountInCoCodeCrcy_EWithScale returns fieldvalue when the scale is provided in metadata");
	});
	QUnit.test("doYearMonthFormat() - Unit Test", function(assert) {
		var formattedValue = this.formatter.doYearMonthFormat("201305");
		assert.strictEqual(formattedValue, this.oGlobalApi.oApi.getTextNotHtmlEncoded('month-5-shortName') + " 2013", "Formatted the provided yearMonth value");
	});
	QUnit.test("isAmountField() - Unit Test", function(assert) {
		var isAmtField;
		isAmtField = this.formatter.isAmountField("RevenueAmountInCoCodeCrcy_E");
		assert.strictEqual(isAmtField, true, "Returns true since Amount field is given");
		isAmtField = this.formatter.isAmountField("CustomerName");
		assert.strictEqual(isAmtField, false, "Returns false since amount field is not given");
	});
	QUnit.test("getPrecision() - Unit Test", function(assert) {
		var prec = this.formatter.getPrecision("RevenueAmountInCoCodeCrcy_E");
		assert.strictEqual(this.aDataResponse[0].DisplayCurrencyDecimals, prec, "Precision value returned for provided amount field");
	});
	QUnit.test("getFormatString() - Unit Test", function(assert) {
		var measure = [ {
			"fieldName" : "RevenueAmountInCoCodeCrcy_E",
			"fieldDesc" : {
				"type" : "label",
				"kind" : "text",
				"key" : "RevenueAmountInDisplayCrcy_Ekey"
			}
		} ];
		var formatString = this.formatter.getFormatString(measure[0]); // get the format string for a measure
		assert.strictEqual(formatString, "#,#0.00", "Format string for any chart type for one measure");
	});
	QUnit.test("getFormattedValueForTextProperty() - Unit Test", function(assert) {
		var oTextToBeFormattedWithId = {
			"text" : "CustomerName",
			"key" : "CustomerId"
		};
		var fieldName = "CustomerName";
		var formattedTextWithId = this.formatter.getFormattedValueForTextProperty(fieldName, oTextToBeFormattedWithId);
		assert.strictEqual(formattedTextWithId, "CustomerName (CustomerId)", "Formatted text is concatenated : " + formattedTextWithId);
		var oTextToBeFormatted = {
			"text" : "CustomerName"
		};
		var formattedText = this.formatter.getFormattedValueForTextProperty(fieldName, oTextToBeFormatted);
		assert.strictEqual(formattedText, "CustomerName", "Formatted text is not concatenated : " + formattedText);
	});
})();
