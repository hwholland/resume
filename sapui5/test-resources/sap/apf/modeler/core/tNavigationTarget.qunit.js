/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery sinon */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.modeler.core.navigationTarget");
jQuery.sap.require("sap.apf.modeler.core.configurationObjects");
jQuery.sap.require("sap.apf.modeler.core.elementContainer");
(function() {
	'use strict';
	QUnit.module("M Navigation Target", {
		beforeEach : function() {
			this.id = "NavigationTargetId";
			this.semanticObject = "SemanticObject01";
			this.action = "Action01";
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ElementContainer : sap.apf.modeler.core.ElementContainer
				}
			};
			this.navigationTarget = new sap.apf.modeler.core.NavigationTarget(this.id, this.inject);
			this.filterMappingService = "filterMappingService";
			this.filterMappingEntitySet = "filterMappingEntitySet";
			this.filterMappingTargetProperty1 = "filterMappingTargetProperty1";
			this.filterMappingTargetProperty2 = "filterMappingTargetProperty2";
		}
	});
	QUnit.test("navigationTarget instantiation", function(assert) {
		assert.ok(this.navigationTarget instanceof sap.apf.modeler.core.NavigationTarget, "WHEN instantiate THEN an instance of the right type is returned");
		var result = this.navigationTarget.getId();
		assert.equal(result, this.id, "WHEN getId THEN the right id is returned");
	});
	QUnit.test("navigationTarget set/get for attributes", function(assert) {
		var result;
		this.navigationTarget.setSemanticObject(this.semanticObject);
		result = this.navigationTarget.getSemanticObject();
		assert.equal(result, this.semanticObject, "WHEN set/getSemanticObject THEN the right value is returned");
		this.navigationTarget.setAction(this.action);
		result = this.navigationTarget.getAction();
		assert.equal(result, this.action, "WHEN set/getAction THEN the right value is returned");
	});
	QUnit.test("Filter Mapping - Setter, Getter and Remove", function(assert) {
		this.navigationTarget.setFilterMappingService(this.filterMappingService);
		this.navigationTarget.setFilterMappingEntitySet(this.filterMappingEntitySet);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty1);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty2);
		assert.equal(this.navigationTarget.getFilterMappingService(), this.filterMappingService, "Method getFilterMappingService() returns correct service");
		assert.equal(this.navigationTarget.getFilterMappingEntitySet(), this.filterMappingEntitySet, "Method getFilterMappingEntitySet() returns correct entity set");
		assert.deepEqual(this.navigationTarget.getFilterMappingTargetProperties(), [ this.filterMappingTargetProperty1, this.filterMappingTargetProperty2 ], "Method getFilterMappingTargetProperties() returns correct array of target properties");
		this.navigationTarget.removeFilterMappingTargetProperty(this.filterMappingTargetProperty1);
		assert.equal(this.navigationTarget.getFilterMappingTargetProperties().indexOf(this.filterMappingTargetProperty1), -1, "Filter mapping target properties can be removed");
	});
	QUnit.test("navigationTarget copy with new id", function(assert) {
		this.navigationTarget.setSemanticObject(this.semanticObject);
		this.navigationTarget.setAction(this.action);
		this.navigationTarget.setStepSpecific();
		this.navigationTarget.setFilterMappingService(this.filterMappingService);
		this.navigationTarget.setFilterMappingEntitySet(this.filterMappingEntitySet);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty1);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty2);
		var newIdForCopy = "NewIdForCopy";
		var copy = this.navigationTarget.copy(newIdForCopy);
		assert.equal(copy.getId(), newIdForCopy, "WHEN copy with new id THEN the copy gets the new id");
		assert.ok(copy instanceof sap.apf.modeler.core.NavigationTarget, "WHEN copy with new id THEN an instance of the right type is returned");
		assert.equal(copy.getSemanticObject(), this.semanticObject, "WHEN copy with new id THEN the value of the semantic object is copied as well");
		assert.equal(copy.getAction(), this.action, "WHEN copy with new id THEN the value of the action is copied as well");
		assert.ok(copy.isStepSpecific(), "WHEN copy with new id THEN isStepSpecific information is copied as well");
		assert.equal(copy.getFilterMappingService(), this.filterMappingService, "WHEN copy with new id THEN getFilterMappingService() returns correct service");
		assert.equal(copy.getFilterMappingEntitySet(), this.filterMappingEntitySet, "WHEN copy with new id THEN getFilterMappingEntitySet() returns correct entity set");
		assert.deepEqual(copy.getFilterMappingTargetProperties(), [ this.filterMappingTargetProperty1, this.filterMappingTargetProperty2 ], "WHEN copy with new id THEN getFilterMappingTargetProperties() returns correct array of target properties");
	});
	QUnit.test("navigationTarget copy without new id", function(assert) {
		this.navigationTarget.setSemanticObject(this.semanticObject);
		this.navigationTarget.setAction(this.action);
		this.navigationTarget.setStepSpecific();
		this.navigationTarget.setFilterMappingService(this.filterMappingService);
		this.navigationTarget.setFilterMappingEntitySet(this.filterMappingEntitySet);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty1);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty2);
		var copy = this.navigationTarget.copy();
		assert.equal(copy.getId(), this.id, "WHEN copy without new id THEN the copy gets the old id");
		assert.ok(copy instanceof sap.apf.modeler.core.NavigationTarget, "WHEN copy without new id  THEN an instance of the right type is returned");
		assert.equal(copy.getSemanticObject(), this.semanticObject, "WHEN copy without new id  THEN the value of the semantic object is copied as well");
		assert.equal(copy.getAction(), this.action, "WHEN copy without new id  THEN the value of the action is copied as well");
		assert.ok(copy.isStepSpecific(), "WHEN copy without new id THEN isStepSpecific information is copied as well");
		assert.equal(copy.getFilterMappingService(), this.filterMappingService, "WHEN copy with new id THEN getFilterMappingService() returns correct service");
		assert.equal(copy.getFilterMappingEntitySet(), this.filterMappingEntitySet, "WHEN copy with new id THEN getFilterMappingEntitySet() returns correct entity set");
		assert.deepEqual(copy.getFilterMappingTargetProperties(), [ this.filterMappingTargetProperty1, this.filterMappingTargetProperty2 ], "WHEN copy with new id THEN getFilterMappingTargetProperties() returns correct array of target properties");
	});
}());