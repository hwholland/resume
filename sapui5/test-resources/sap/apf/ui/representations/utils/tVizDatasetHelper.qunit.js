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
jQuery.sap.declare('test.sap.apf.ui.representations.utils.tVizDatasetHelper');
jQuery.sap.require('sap.apf.ui.instance');
jQuery.sap.require('sap.apf.ui.representations.utils.vizDatasetHelper');
(function() {
	QUnit.module("Viz Dataset Helper Tests", {
		beforeEach : function(assert) {
			sap.apf.core.SessionHandler = function() {
				this.fetchXcsrfToken = sinon.stub().returns(true);
			};
			this.axisType = "group";
			this.parameter = {
				"dimensions" : [ {
					"name" : "CompanyCodeCountry",
					"value" : "Country of Customer",
					"kind" : "regionColor"
				} ],
				"measures" : [ {
					"name" : "DaysSalesOutstanding",
					"value" : "DSO",
					"kind" : "xAxis"
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
			var bIsGroupTypeChart = true;
			this.vizDatasetHelper = new sap.apf.ui.representations.utils.VizDatasetHelper(bIsGroupTypeChart);
		}
	});
	QUnit.test("Availability Test", function(assert) {
		assert.ok(typeof this.vizDatasetHelper.getDataset === "function", "getDataset available");
	});
	QUnit.test("getDataset test", function(assert) {
		var dataset = this.vizDatasetHelper.getDataset(this.parameter);
		assert.ok((dataset.dimensions.length === 1 && dataset.measures.length === 1), "getDataset returns dataset");
		var axisCheck = dataset.dimensions[0].axis;
		assert.ok(axisCheck === 1, "Axis 1 set for first dimension");
		var measureAxisCheck = dataset.measures[0][this.axisType];
		assert.ok(measureAxisCheck === 1, "Axis 1 set for first measure");
		this.vizDatasetHelper.parameter.dimensions.push({
			name : 'YearMonth', // Pushing one more dimension.
			value : 'Time',
			kind : 'regionShape'
		});
		this.vizDatasetHelper.parameter.measures.push({
			name : 'DaysPayableOutstanding', // Pushing one more measure.
			value : 'DPO',
			kind : 'yAxis'
		});
		dataset = this.vizDatasetHelper.getDataset(this.parameter);
		assert.ok((dataset.dimensions.length === 2 && dataset.measures.length === 2), "getDataset returns dataset with one more measure and dimension");
		axisCheck = dataset.dimensions[1].axis;
		assert.ok(axisCheck === 2, "Axis 2 set for second dimension");
		measureAxisCheck = dataset.measures[1][this.axisType];
		assert.ok(measureAxisCheck === 2, "Axis 2 set for second measure");
	});
})();