/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.staticValuesBuilder');
jQuery.sap.declare('sap.apf.modeler.ui.utils.tStaticValuesBuilder');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var staticValuesBuilder, oModelerInstance;
	QUnit.module("tests for staticValuesBuilder apis ", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				staticValuesBuilder = new sap.apf.modeler.ui.utils.staticValuesBuilder(oModelerInstance.modelerCore.getText);
				done();
			});
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(staticValuesBuilder, 'then staticValuesBuilder object exists');
	});
	QUnit.test('when testing nav target type data', function(assert) {
		// act
		var aNavTargetTypeData = staticValuesBuilder.getNavTargetTypeData();
		var expectedOutput = ["Assigned to All Steps","Assign to Specific Steps"];
		// assert
		assert.deepEqual(aNavTargetTypeData, expectedOutput, " then correct array with values id returned");
	});
})();