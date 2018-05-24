/*
 * Copyright(c) 2015 SAP SE
 */
/*global QUnit, jQuery, sap, console, sap, sinon */

jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require('sap.apf.core.utils.filterTerm');

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper/');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
/*eslint no-invalid-this:0*/

(function() {
	'use strict';
	QUnit.module('sap.apf.core.utils.FilterTerm.traverse() - contract with visitor', {
		beforeEach: function (/* assert */) {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			/**
			 * @constructor
			 */
			function EmptyVisitor() {
				this.processAnd = function(filter, aFilters) {
				};
				this.processOr = function(filter, aFilters) {
				};
				this.processTerm = function(term) {
				};
				this.processEmptyFilter = function() {
				};
				this.process = function(filter) {
				};
			}
			this.visitor = new EmptyVisitor();
			this.spyProcess = sinon.spy( this.visitor, 'process');
			this.spyProcessAnd = sinon.spy( this.visitor, 'processAnd');
			this.spyProcessOr = sinon.spy( this.visitor, 'processOr');
			this.spyProcessTerm = sinon.spy( this.visitor, 'processTerm');
			this.spyProcessEmptyFilter = sinon.spy( this.visitor, 'processEmptyFilter');
		}
	});
	QUnit.test('traverse empty filter - shall call visitor.processEmptyFilter()', function (assert) {
		var filter = new sap.apf.core.utils.FilterTerm(this.messageHandler, 'A', sap.apf.core.constants.FilterOperators.EQ, '1');

		filter.traverse(this.visitor);

		assert.strictEqual(this.spyProcessAnd.callCount, 0, 'spyProcessAnd');
		assert.strictEqual(this.spyProcessOr.callCount, 0, 'spyProcessOr');
		assert.strictEqual(this.spyProcessTerm.callCount, 1, 'spyProcessTerm');
		assert.strictEqual(this.spyProcessEmptyFilter.callCount, 0, 'then processEmptyFilter called once');
		assert.strictEqual(this.spyProcess.callCount, 0, 'then process not called ');
	});
}());