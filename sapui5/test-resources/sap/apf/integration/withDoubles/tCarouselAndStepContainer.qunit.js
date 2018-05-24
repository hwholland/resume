/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
/*global window, sap, jQuery, sinon */
/*global jQuery*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../');
// apf doubles/stubs
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.testhelper.doubles.uiApi');
jQuery.sap.require('sap.apf.testhelper.doubles.navigationHandler');
jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
jQuery.sap.require('sap.apf.testhelper.helper');
(function() {
	'use strict';
	var oGlobalApi, oCarouselView, metadata;
	/**
	 * @function
	 * @name sap.apf.integration.withDoubles.tCarouselAndStepContainer#doNothing
	 * @description Dummy function for stubbing unused methods
	 * */
	function doNothing() {
	}
	/**
	 * @function
	 * @name sap.apf.integration.withDoubles.tCarouselAndStepContainer#drawRepresentation
	 * @param {Object} oCurrentStep - current step to be added in container
	 * @param {Boolean} bStepChanged - change of steps indicator
	 * @description To draw the representation in step container
	 * */
	function drawRepresentation(oCurrentStep, bStepChanged) {
		var nIndex = oGlobalApi.oCoreApi.getSteps().indexOf(oCurrentStep);
		if (nIndex === 0) {
			oGlobalApi.oUiApi.getAnalysisPath().getController().refreshAnalysisPath();
			oGlobalApi.oCoreApi.setActiveStep(oGlobalApi.oCoreApi.getSteps()[oGlobalApi.oCoreApi.getSteps().length - 1]);
		}
		oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation.prototype.bIsAlternateView = false;
		oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation.prototype.type = "none";
		oGlobalApi.oUiApi.getAnalysisPath().getController().updateCurrentStep(oCurrentStep, nIndex, bStepChanged);
	}
	/**
	 * @function
	 * @name sap.apf.integration.withDoubles.tCarouselAndStepContainer#doOnAfterRendering
	 * @param {App} layout - ApplicationLayout as an application
	 * @param {Object} assert - test asserts
	 * @param {Function} continuation - callback to be executed after onAfterRendering event
	 * @description Executes the continuation in the onAfterRendering event callback
	 * */
	function doOnAfterRendering(layout, assert, continuation) {
		var done = assert.async();
		layout.onAfterRendering = function() {
			continuation({});
			done();
		};
	}
	/**
	 * @function
	 * @name sap.apf.integration.withDoubles.tCarouselAndStepContainer#createSteps
	 * @param {Object} testContext - test reference
	 * @description Creates the steps
	 * */
	function createSteps(testContext) {
		var sampleStepTemplate;
		if (oGlobalApi.oCoreApi.getStepTemplates()[0]) {
			sampleStepTemplate = oGlobalApi.oCoreApi.getStepTemplates()[0];
		}
		oGlobalApi.oCoreApi.createStep(sampleStepTemplate.id, drawRepresentation.bind(testContext), sampleStepTemplate.getRepresentationInfo()[0].representationId);//pie
		oGlobalApi.oCoreApi.createStep(sampleStepTemplate.id, drawRepresentation.bind(testContext), sampleStepTemplate.getRepresentationInfo()[1].representationId);//column
	}
	/**
	 * @function
	 * @name sap.apf.integration.withDoubles.tCarouselAndStepContainer#metadataStub 
	 * @description To stub sap.apf.testhelper.doubles.metadata
	 * */
	function metadataStub() {
		var obj = {};
		obj.getPropertyMetadata = function(sPropertyName) {
			if (sPropertyName === "CustomerName") {
				metadata = {
					"aggregation-role" : "dimension",
					"dataType" : {
						"maxLength" : "10",
						"type" : "Edm.String"
					},
					"label" : "Customer Name",
					"name" : "CustomerName"
				};
				return metadata;
			}
			if (sPropertyName === "DaysSalesOutstanding") {
				metadata = {
					"aggregation-role" : "measure",
					"dataType" : {
						"maxLength" : "10",
						"type" : "Edm.String"
					},
					"label" : "DSO",
					"name" : "DaysSalesOutstanding"
				};
				return metadata;
			}
		};
		return obj;
	}
	/**
	 * @function
	 * @name sap.apf.integration.withDoubles.tCarouselAndStepContainer#getEventCallbackStub 
	 * @param {sap.apf.core.constants.eventTypes} eventType - the registered callback for event callback
	 * @description To stub oGlobalApi.oApi.getEventCallback
	 * */
	function getEventCallbackStub(eventType) {
		return oGlobalApi.oUiApi.getEventCallback(eventType);
	}
	QUnit.module('Carousel & Step Container Tests', {
		beforeEach : function() {
			var inject = {
				constructors : {
					Metadata : sap.apf.testhelper.doubles.Metadata,
					Request : sap.apf.testhelper.doubles.Request,
					NavigationHandler : sap.apf.testhelper.doubles.NavigationHandler
				}
			};
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi("CompUi", 
					"/apf-test/test-resources/sap/apf/testhelper/config/applicationConfigurationIntegration.json", inject);
			//Carousel View Instance
			oCarouselView = oGlobalApi.oUiApi.getAnalysisPath().getCarousel();
			// stubs & spies
			sinon.stub(oGlobalApi.oApi, 'getEventCallback', getEventCallbackStub);
			sinon.stub(oGlobalApi.oUiApi, 'getEventCallback', doNothing);
			sinon.stub(sap.apf.testhelper.doubles, 'Metadata', metadataStub);
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			sap.apf.testhelper.doubles.Metadata.restore();
			oGlobalApi.oApi.getEventCallback.restore();
			oGlobalApi.oUiApi.getEventCallback.restore();
		}
	});
	QUnit.test("When Carousel API loaded", function(assert) {
		//assert
		assert.ok(oCarouselView, "then Carousel View exists");
		assert.ok(oCarouselView.oController, "then Carousel Controller exists");
	});
	QUnit.test('When adding steps', function(assert) {
		// arrangement
		var testContext = this;
		var sampleStepTemplate;
		// act
		oGlobalApi.oUiApi.createApplicationLayout().placeAt("stepContainerContent");
		doOnAfterRendering(oGlobalApi.oUiApi.createApplicationLayout(), assert, function() {
			if (oGlobalApi.oCoreApi.getStepTemplates()[0]) {
				sampleStepTemplate = oGlobalApi.oCoreApi.getStepTemplates()[0];
			}
			// assert
			assert.strictEqual(typeof oGlobalApi.oUiApi.getStepContainer, "function", "Before addition of steps, Step Container Exists");
			// act
			oGlobalApi.oCoreApi.createStep(sampleStepTemplate.id, drawRepresentation.bind(testContext), sampleStepTemplate.getRepresentationInfo()[0].representationId);
			// assert
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps().length, 1, "then 1st Step added successfully");
			assert.strictEqual(oGlobalApi.oUiApi.getStepContainer().oController.getCurrentRepresentation().type, "PieChart", "Pie Chart is inserted in the step container and is active");
			// act
			oGlobalApi.oCoreApi.createStep(sampleStepTemplate.id, drawRepresentation.bind(testContext), sampleStepTemplate.getRepresentationInfo()[1].representationId);
			//assert
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps().length, 2, "then 2nd Step added successfully,");
			assert.strictEqual(oGlobalApi.oUiApi.getStepContainer().oController.getCurrentRepresentation().type, "ColumnChart", "Column Chart is inserted in the step container and is active");
			assert.notEqual(oGlobalApi.oUiApi.getStepContainer().oController.getCurrentRepresentation().type, "PieChart", "Step 1 is inactive");
			assert.strictEqual(jQuery(".DnD-block").length, 3, "then steps exists in carousel container");
			// cleanups
			oGlobalApi.oUiApi.createApplicationLayout().destroy();
		});
	});
	QUnit.test('When switching steps', function(assert) {
		// arrange
		var testContext = this;
		var event = jQuery.Event("keydown");
		oGlobalApi.oUiApi.createApplicationLayout().placeAt("stepContainerContent");
		// act
		doOnAfterRendering(oGlobalApi.oUiApi.createApplicationLayout(), assert, function() {
			createSteps(testContext);
			// assert
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[0].oController.representationInstance, "PieChart", "1st step (pie chart) added");
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[1].oController.representationInstance, "ColumnChart", " 2nd step (column chart) added");
			assert.strictEqual(oGlobalApi.oUiApi.getStepContainer().oController.getCurrentRepresentation().type, "ColumnChart", "Step 2 (Column chart) is active");
			// act
			event.which = 13;
			jQuery(jQuery(".DnD-block")[1]).trigger(event);
			// assert
			assert.strictEqual(oGlobalApi.oUiApi.getStepContainer().oController.getCurrentRepresentation().type, "PieChart", "then on selecting step 1 (pie chart), it becomes active");
			assert.notEqual(oGlobalApi.oUiApi.getStepContainer().oController.getCurrentRepresentation().type, "ColumnChart", "then Step 2 is inactive");
			// cleanups
			oGlobalApi.oUiApi.createApplicationLayout().destroy();
		});
	});
	QUnit.test('When doing drag/drop of step', function(assert) {
		// arrange
		var testContext = this;
		oGlobalApi.oUiApi.createApplicationLayout().placeAt("stepContainerContent");
		// act
		doOnAfterRendering(oGlobalApi.oUiApi.createApplicationLayout(), assert, function() {
			createSteps(testContext);
			// assert
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[0].oController.representationInstance, "PieChart", "then Before drag/drop, first step is pie chart");
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[1].oController.representationInstance, "ColumnChart", " 2nd step is column chart");
			// act
			oCarouselView.up.firePress();
			// assert
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[0].oController.representationInstance, "ColumnChart", "then After drag/drop, first step is Column chart");
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[1].oController.representationInstance, "PieChart", " 2nd step is Pie chart");
			// cleanups
			oGlobalApi.oUiApi.createApplicationLayout().destroy();
		});
	});
	QUnit.test('When removing 1st step', function(assert) {
		// arrange
		var testContext = this;
		oGlobalApi.oUiApi.createApplicationLayout().placeAt("stepContainerContent");
		// act
		doOnAfterRendering(oGlobalApi.oUiApi.createApplicationLayout(), assert, function() {
			createSteps(testContext);
			// assert
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[0].oController.representationInstance, "PieChart", "Before deletion, 1st step is pie chart");
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[1].oController.representationInstance, "ColumnChart", " 2nd step is column chart");
			//act
			jQuery(jQuery(".DnD-block")[0]).remove();
			oCarouselView.oController.removeStep(0); // Remove Step Index 0
			// assert
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews.length, 1, "then First Step is removed successfully and only 1 steps available");
			assert.strictEqual(jQuery(".DnD-block").length, 2, "then first Step removed from carousel container");
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[0].oController.representationInstance, "ColumnChart", "First step(pie chart) is replaced by second step(column chart)");
			// cleanups
			oGlobalApi.oUiApi.createApplicationLayout().destroy();
		});
	});
	QUnit.test('When removing last step', function(assert) {
		// arrange
		var testContext = this;
		oGlobalApi.oUiApi.createApplicationLayout().placeAt("stepContainerContent");
		// act
		doOnAfterRendering(oGlobalApi.oUiApi.createApplicationLayout(), assert, function() {
			createSteps(testContext);
			// assert
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[0].oController.representationInstance, "PieChart", "Before deletion, 1st step is pie chart");
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[1].oController.representationInstance, "ColumnChart", " 2nd step is column chart");
			// act
			jQuery(jQuery(".DnD-block")[1]).remove();
			oCarouselView.oController.removeStep(1); // Remove Step Index 2
			// assert
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews.length, 1, "then  last Step is removed successfully and 1 steps available");
			assert.strictEqual(jQuery(".DnD-block").length, 2, "then last Step removed from carousel container");
			assert.strictEqual(oGlobalApi.oUiApi.getStepContainer().oController.getCurrentRepresentation().type, "PieChart", "Pie chart is active");
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[0].oController.representationInstance, "PieChart", " 1st step is PieChart chart");
			// cleanups
			oGlobalApi.oUiApi.createApplicationLayout().destroy();
		});
	});
	QUnit.test('When removing all steps', function(assert) {
		// arrange
		var testContext = this;
		oGlobalApi.oUiApi.createApplicationLayout().placeAt("stepContainerContent");
		// act
		doOnAfterRendering(oGlobalApi.oUiApi.createApplicationLayout(), assert, function() {
			createSteps(testContext);
			// assert
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[0].oController.representationInstance, "PieChart", "Before deletion, 1st step is pie chart");
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews[1].oController.representationInstance, "ColumnChart", " 2nd step is column chart");
			// act
			oGlobalApi.oUiApi.getAnalysisPath().getToolbar().getController().resetAnalysisPath(); //Remove All Steps
			// assert
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps().length, 0, "then all Steps removed successfully, no steps available");
			assert.strictEqual(jQuery(".DnD-block").length, 1, "then all Step removed from carousel container");
			// cleanups
			oGlobalApi.oUiApi.createApplicationLayout().destroy();
		});
	});
}());
