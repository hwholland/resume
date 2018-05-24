jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../../integration');
jQuery.sap.declare('test.sap.apf.ui.representations.utils.vizFrameDatasetHelper');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfUiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require('sap.apf.ui.representations.utils.vizFrameDatasetHelper');
jQuery.sap.require('sap.apf.ui.instance');
(function() {
	'use strict';
	var parameter;
	QUnit.module("VizFrame Dataset Helper Tests", {
		beforeEach : function(assert) {
			parameter = {
				"dimensions" : [ {
					"name" : "CompanyCodeCountry",
					"value" : "Country of Customer",
					"kind" : "xAxis"
				} ],
				"measures" : [ {
					"name" : "DaysSalesOutstanding",
					"value" : "DSO",
					"kind" : "yAxis"
				} ]
			};
		}
	});
	QUnit.test("When parameter sent to dataset helper", function(assert) {
		var vizFrameDatasetHelper = new sap.apf.ui.representations.utils.vizFrameDatasetHelper();
		var oFlattendeDataSetFromHelper = vizFrameDatasetHelper.getDataset(parameter);
		var oClonedFlattendeDataSet = {
			"dimensions" : [ {
				"name" : "CompanyCodeCountry",
				"value" : "Country of Customer"
			} ],
			"measures" : [ {
				"name" : "DaysSalesOutstanding",
				"value" : "DSO"
			} ],
			"data" : {
				"path" : "/data"
			}
		};
		assert.deepEqual(oFlattendeDataSetFromHelper, oClonedFlattendeDataSet, "Then it returns properties required for flattende data set");
	});
	QUnit.test("When parameter sent to dataset helper(for TimeAxis Chart)", function(assert) {
		var vizFrameDatasetHelper = new sap.apf.ui.representations.utils.vizFrameDatasetHelper();
		var parameter = {
				"dimensions" : [ {
					"name" : "CompanyCodeCountry",
					"value" : "Country of Customer",
					"kind" : "xAxis",
					"dataType" : "date"
				} ],
				"measures" : [ {
					"name" : "DaysSalesOutstanding",
					"value" : "DSO",
					"kind" : "yAxis"
				} ]
			};
		var oFlattendeDataSetFromHelper = vizFrameDatasetHelper.getDataset(parameter);
		var oClonedFlattendeDataSet = {
			"dimensions" : [ {
				"name" : "CompanyCodeCountry",
				"value" : "Country of Customer",
				"dataType" : "date"
			} ],
			"measures" : [ {
				"name" : "DaysSalesOutstanding",
				"value" : "DSO"
			} ],
			"data" : {
				"path" : "/data"
			}
		};
		assert.deepEqual(oFlattendeDataSetFromHelper, oClonedFlattendeDataSet, "Then it returns properties required for flattende data set");
	});
})();