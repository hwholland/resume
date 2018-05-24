jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../../integration');
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.interfaces.IfUiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.declare('test.sap.apf.ui.representations.utils.tVizHelper');
jQuery.sap.require('sap.apf.ui.instance');
jQuery.sap.require('sap.apf.ui.representations.utils.vizHelper');
(function() {
	QUnit.module("Viz Helper Tests", {
		beforeEach : function(assert) {
			sap.apf.core.SessionHandler = function() {
				this.fetchXcsrfToken = sinon.stub().returns(true);
			};
			this.oGlobalApi = sap.apf.testhelper.doubles.UiApi();
			this.parameter = {
				"dimensions" : [ {
					"fieldName" : "CompanyCodeCountry"
				} ],
				"measures" : [ {
					"fieldName" : "RevenueAmountInDisplayCrcy_E"
				}, {
					"fieldName" : "DaysSalesOutstanding"
				} ],
				"requiredFilters" : [ "CompanyCodeCountry" ],
				"alternateRepresentationType" : {
					"type" : "representationType",
					"id" : "table",
					"constructor" : "sap.apf.ui.representations.table",
					"picture" : "sap-icon://table-chart (sap-icon://table-chart/)",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "table"
					}
				}
			};
			this.vizHelper = new sap.apf.ui.representations.utils.vizHelper(this.oGlobalApi.oApi, this.parameter);
			this.sampleData = sap.apf.testhelper.odata.getSampleService(this.oGlobalApi.oApi, 'sampleData');
			var getPropertyMetadataStub = sinon.stub();
			getPropertyMetadataStub.withArgs("CompanyCodeCountry").returns({
				"dataType" : {
					"maxLength" : "10",
					"type" : "Edm.String"
				},
				"label" : "Company Code Country",
				"name" : "CompanyCodeCountry",
				"text" : "CompanyCodeCountryName"
			});
			getPropertyMetadataStub.withArgs("CompanyCodeCountryName").returns({
				"dataType" : {
					"maxLength" : "10",
					"type" : "Edm.String"
				},
				"label" : "Company Code Country Name",
				"name" : "CompanyCodeCountryName"
			});
			getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E").returns({
				"ISOCurrency" : "DisplayCurrency",
				"aggregation-role" : "measure",
				"dataType" : {
					"precision" : "26",
					"type" : "Edm.Decimal"
				},
				"filterable" : "false",
				"label" : "Revenue in Display Currency",
				"name" : "RevenueAmountInDisplayCrcy_E",
				"scale" : "DisplayCurrencyDecimals",
				"unit" : "RevenueAmountInDisplayCrcy_E.CURRENCY"
			});
			getPropertyMetadataStub.withArgs("DaysSalesOutstanding").returns({
				"dataType" : {
					"maxLength" : "10",
					"type" : "Edm.Int32"
				},
				"label" : "Days Sales Outstanding",
				"name" : "DaysSalesOutstanding"
			});
			this.sampleMetadata = {
				getPropertyMetadata : getPropertyMetadataStub
			};
		},
		afterEach : function() {
			this.oGlobalApi.oContext.oCompContainer.destroy();
		}
	});
	QUnit.test("Availability Tests", function(assert) {
		assert.ok(typeof this.vizHelper.init === "function", "init available");
		assert.ok(typeof this.vizHelper.getModel === "function", "getModel available");
		assert.ok(typeof this.vizHelper.getDataset === "function", "getDataset available");
		assert.ok(typeof this.vizHelper.getFilterCount === "function", "getFilterCount available");
		assert.ok(typeof this.vizHelper.getFilters === "function", "getFilters available");
		assert.ok(typeof this.vizHelper.getSelectionFromFilter === "function", "getSelectionFromFilter available");
		assert.ok(typeof this.vizHelper.getHighlightPointsFromSelectionEvent === "function", "getHighlightPointsFromSelectionEvent available");
		assert.ok(typeof this.vizHelper.getHighlightPointsFromDeselectionEvent === "function", "getHighlightPointsFromDeselectionEvent available");
		assert.ok(typeof this.vizHelper.getFilterFromSelection === "function", "getFilterFromSelection available");
		assert.ok(typeof this.vizHelper.validateSelectionModes === "function", "validateSelectionModes available");
	});
	QUnit.test("Functionality Tests", function(assert) {
		this.vizHelper.init(this.sampleData, this.sampleMetadata);
		assert.ok((this.vizHelper.displayNameLookup.CompanyCodeCountry.DISPLAY_NAME === "Company Code Country Name" && this.vizHelper.displayNameLookup.CompanyCodeCountry.VALUE === "formatted_CompanyCodeCountry"),
				"init Method - display name hash map is created");
		assert.ok((this.vizHelper.fieldNameLookup["Company Code Country Name"].FIELD_NAME === "CompanyCodeCountry" && this.vizHelper.fieldNameLookup["Company Code Country Name"].VALUE === "formatted_CompanyCodeCountry"),
				"init Method - field name hash map is created");
		assert.ok((this.vizHelper.extendedDataResponse[0].formatted_CompanyCodeCountry === "Argentina(AR)"), "init Method - Extended data response created.");
		assert.ok((this.vizHelper.filterLookup["Argentina(AR)"][0].id === "AR" && this.vizHelper.filterLookup["Argentina(AR)"][0].text === "Argentina(AR)"), "init Method - filter hash map created");
		var model = this.vizHelper.getModel();
		assert.equal(model.getData().data.length, this.sampleData.length, "getModel returns model");
		var dataset = this.vizHelper.getDataset();
		assert.ok((dataset.getDimensions().length === 1 && dataset.getMeasures().length === 2), "getDataset returns dataset");
		var dummySelections = [ {
			"data" : {
				"Company Code Country Name" : "Argentina(AR)",
				"Days Sales Outstanding" : 40.2
			}
		} ];
		var highLightPoints = this.vizHelper.getHighlightPointsFromSelectionEvent(dummySelections);
		assert.equal(highLightPoints.length, 16, "getHighlightPointsFromSelectionEvent returns highlightPoints");
		var filterObj = this.vizHelper.getFilterFromSelection();
		assert.equal(filterObj.getExpressions()[0][0].value, "AR", "getFilterFromSelection returns filter object");
		var selections = this.vizHelper.getSelectionFromFilter();
		assert.equal(selections.length, 16, "getSelectionFromFilter returns selection");
		var filterCount = this.vizHelper.getFilterCount();
		assert.equal(filterCount, 1, "getFilterCount returns filter count");
		var filterObject = {
			id : "AR",
			text : "Argentina(AR)"
		};
		var filterValues = this.vizHelper.getFilters();
		assert.deepEqual(filterValues[0], filterObject, "getFilters returns filter id and text objects");
		highLightPoints = this.vizHelper.getHighlightPointsFromDeselectionEvent(dummySelections);
		assert.equal(highLightPoints.length, 0, "getHighlightPointsFromDeselectionEvent returns highlightPoints");
		this.vizHelper.parameter.dimensions.push({
			fieldName : 'YearMonth' // Pushing one more dimension.
		});
		var setInteractionStub = sinon.stub();
		var dummyChart = {
			setInteraction : setInteractionStub
		};
		this.vizHelper.validateSelectionModes(dummyChart);
		var interaction = setInteractionStub.args[0][0];
		var selectability = interaction.getSelectability();
		var legendSelection = selectability.getLegendSelection();
		assert.ok(!legendSelection, "validateSelectionModes Method - disables legend selection.");
		this.vizHelper.parameter.requiredFilters = [ 'YearMonth' ]; // Changing the required Filter to second dimension.
		this.vizHelper.validateSelectionModes(dummyChart);
		interaction = setInteractionStub.args[1][0];
		selectability = interaction.getSelectability();
		var axisLabelSelection = selectability.getAxisLabelSelection();
		assert.ok(!axisLabelSelection, "validateSelectionModes Method - disables category selection");
		this.vizHelper.parameter.requiredFilters = []; // Emptying required filters
		this.vizHelper.validateSelectionModes(dummyChart);
		interaction = setInteractionStub.args[2][0];
		selectability = interaction.getSelectability();
		var selectionMode = selectability.getMode();
		assert.equal(selectionMode, "none", "validateSelectionModes Method - disables selection");
	});
})();