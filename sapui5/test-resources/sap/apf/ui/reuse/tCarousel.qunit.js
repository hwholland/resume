/*
 * Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved
 */
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfUiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.stub.ajaxStub");
jQuery.sap.require("sap.apf.testhelper.stub.textResourceHandlerStub");
jQuery.sap.require("sap.apf.testhelper.config.sampleConfiguration");
jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerNew");
jQuery.sap.require("sap.apf.testhelper.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.odata.sampleServiceData");
jQuery.sap.require("sap.apf.testhelper.doubles.request");
jQuery.sap.require("sap.apf.testhelper.doubles.metadata");
jQuery.sap.require("sap.apf.testhelper.doubles.representation");
jQuery.sap.declare('test.sap.apf.ui.reuse.tCarousel');
jQuery.sap.require('sap.apf.ui.instance');
(function() {
	QUnit.module("Carousel qUnit", {
		beforeEach : function(assert) {
			sap.apf.testhelper.stub.textResourceHandlerStub.setup(this);
			sap.apf.testhelper.stub.stubJQueryAjax();
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			sap.apf.core.getMetadata = sap.apf.testhelper.doubles.Metadata;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			this.oCarouselView = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel();
			this.oCarouselController = this.oCarouselView.oController;
			this.getLayoutViewStub = function() {
				this.layout = new sap.ui.layout.VerticalLayout();
				this.layout.getController = function() {
					this.setFilter = function(param) {
						return param;
					};
					this.setMasterTitle = function() {
						return null;
					};
					this.setDetailTitle = function() {
						return null;
					};
					this.setMasterHeaderButton = function() {
						return null;
					};
					this.addMasterFooterContentLeft = function() {
						return null;
					};
					this.detailTitleRemoveAllContent = function() {
						return null;
					};
					this.enableDisableOpenIn = function() {
						return null;
					};
					return this;
				};
				return this.layout;
			};
			sinon.stub(this.oGlobalApi.oUiApi, "getLayoutView", this.getLayoutViewStub);
			//Slice the initial step
			var stepTemplates = this.oGlobalApi.oCoreApi.getStepTemplates();
			stepTemplates.pop(5);
			this.oGlobalApi.oCoreApi.getStepTemplates = function() {
				return stepTemplates;
			};
			this.analysisPath = this.oGlobalApi.oUiApi.getAnalysisPath();
			this.analysisPathController = this.analysisPath.getController();
		},
		afterEach : function() {
			this.oGlobalApi.oUiApi.getLayoutView.restore();
			jQuery.ajax.restore();
			sap.apf.testhelper.stub.textResourceHandlerStub.teardown();
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Availability of View and Controller Api's", function(assert) {
		//test1: All API's Availability
		assert.ok(typeof this.oCarouselController.moveStep === "function", 'Move Step Available');
		assert.ok(typeof this.oCarouselController.removeStep === "function", 'Delete Step Available');
		assert.ok(typeof this.oCarouselController.addStep === "function", 'Add Step Available');
		assert.ok(typeof this.oCarouselController.getStepData === "function", 'getStepData is Available');
		assert.ok(typeof this.oCarouselController.showStepGallery === "function", 'showStepGallery is Available');
		assert.ok(typeof this.oCarouselController.refreshCarousel === "function", 'refreshCarousel is Available');
		assert.ok(typeof this.oCarouselController.removeAllSteps === "function", 'removeAllSteps is Available');
		assert.ok(typeof this.oCarouselView === "object", "carouselView is available");
	});
	QUnit.test("Add Step", function(assert) {
		var oStep1 = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[2].id, function(assert) {
		}, this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId);
		var step = this.oGlobalApi.oCoreApi.getSteps()[0];
		this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().oViewData = this.oGlobalApi;
		this.oCarouselController.addStep(step);
		var dndBox = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().getView().dndBox;
		var stepContainer = this.oGlobalApi.oUiApi.getStepContainer();
		var stepView = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().getView().stepViews;
		this.analysisPath.getCarousel().getController().refreshCarousel();
		this.analysisPathController.refresh(0);
		this.oCarouselController.onInit();
		this.oCarouselController.onAfterRendering();
		assert.ok(typeof this.oCarouselView.carouselContent(this.oCarouselController) === "object", "Carousel View Exists");
		assert.ok(typeof stepContainer === "object", "Step container exists");
		assert.ok(typeof oStep1 === "object", "First step added");
	});
	QUnit.test("Remove Step", function(assert) {
		var oStep1 = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[2].id, function(assert) {
		}, this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId);
		var step = this.oGlobalApi.oCoreApi.getSteps()[0];
		var chartStub = function() {
			return {
				chart : {
					removeEventDelegate : function(event, fn) {
						var doNothing;
					}
				}
			};
		};
		sinon.stub(step, 'getSelectedRepresentation', chartStub);
		this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().oViewData = this.oGlobalApi;
		this.oCarouselController.addStep(step);
		var stepView = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().getView().stepViews;
		this.oCarouselController.removeStep(0); //Remove Step
		assert.equal(stepView.length, 0, "Step Removed Successfully");
		step.getSelectedRepresentation.restore();
	});
	QUnit.test("Remove All Step", function(assert) {
		var oStep1 = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[2].id, function(assert) {
		}, this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId);
		var step = this.oGlobalApi.oCoreApi.getSteps()[0];
		var chartStub = function() {
			return {
				chart : {
					removeEventDelegate : function(event, fn) {
						var doNothing;
					}
				}
			};
		};
		sinon.stub(step, 'getSelectedRepresentation', chartStub);
		this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().oViewData = this.oGlobalApi;
		this.oCarouselController.addStep(step);
		var stepView = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().getView().stepViews;
		this.oCarouselController.removeAllSteps(); //Remove Step
		assert.equal(stepView.length, 0, "All Steps Removed Successfully");
		step.getSelectedRepresentation.restore();
	});
	QUnit.test("Get Step Data", function(assert) {
		var oStep1 = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[2].id, function(assert) {
		}, this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId);
		var step = this.oGlobalApi.oCoreApi.getSteps()[0];
		this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().oViewData = this.oGlobalApi;
		var stepData = this.oCarouselController.getStepData(step);
		assert.equal(stepData.index, 0, "Step Data index exists");
		assert.equal(stepData.thumbnail.leftLower, "localTextReferenceStepTemplate1LeftLower", "Step Data left lower thumbnail exists");
		assert.equal(stepData.thumbnail.leftUpper, "localTextReferenceStepTemplate1LeftUpper", "Step Data left upper thumbnail exists");
		assert.equal(stepData.thumbnail.rightLower, "localTextReferenceStepTemplate1RightLower", "Step Data right lower thumbnail exists");
		assert.equal(stepData.thumbnail.rightUpper, "localTextReferenceStepTemplate1RightUpper", "Step Data right upper thumbnail exists");
		assert.equal(stepData.title, "localText2", "Step Data Title exists");
	});
	QUnit.test("Move Step", function(assert) {
		var oStep1 = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[2].id, function(assert) {
		}, this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId);
		var oStep2 = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[2].id, function(assert) {
		}, this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId);
		var step = this.oGlobalApi.oCoreApi.getSteps()[0];
		this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().oViewData = this.oGlobalApi;
		this.oCarouselController.addStep(step);
		var dndBox = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().getView().dndBox;
		var stepContainer = this.oGlobalApi.oUiApi.getStepContainer();
		var stepView = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().getView().stepViews;
		this.analysisPath.getCarousel().getController().refreshCarousel();
		this.analysisPathController.refresh(0);
		var beforeSwap1 = stepView[0].getId();
		var beforeSwap2 = stepView[1].getId();
		this.oCarouselController.moveStep(0, 1);
		assert.notEqual(beforeSwap1, stepView[0].getId(), "Index 1 Step is not equal after move");
		assert.equal(beforeSwap1, stepView[1].getId(), "After move step both the steps are equal successfully");
	});
	QUnit.test("Add First Step", function(assert) {
		var stepTemplates = this.oGlobalApi.oCoreApi.getStepTemplates();
		stepTemplates[0].id = "initial";
		var restoreGetStepTemplates = this.oGlobalApi.oCoreApi.getStepTemplates;
		this.oGlobalApi.oCoreApi.getStepTemplates = function() {
			return stepTemplates;
		};
		var step = this.oGlobalApi.oCoreApi.getSteps()[0];
		this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().oViewData = this.oGlobalApi;
		var dndBox = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().getView().dndBox;
		var stepContainer = this.oGlobalApi.oUiApi.getStepContainer();
		var stepView = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().getView().stepViews;
		this.analysisPath.getCarousel().getController().refreshCarousel();
		this.analysisPathController.refresh(0);
		assert.ok(typeof stepContainer === "object", "First Step Added Successfully");
		//Restore the Stubbed Fn's
		this.oGlobalApi.oCoreApi.getStepTemplates = restoreGetStepTemplates;
	});
	QUnit.test("Carousel View Apis", function(assert) {
		var fnOriginalSwapBlocks = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().dndBox.swapBlocks;
		this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().dndBox.swapBlocks = function() {
			return true;
		};
		this.oCarouselView.down.firePress();
		//Restore
		this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().dndBox.swapBlocks = fnOriginalSwapBlocks;
		//Api's Availability Check
		assert.ok(typeof this.oCarouselView.getStepGallery === "function", "Get Step Gallery Exists");
		assert.ok(typeof this.oCarouselView.getChartToolbar === "function", "Get Charttoolbar Exists");
		assert.ok(typeof this.oCarouselView.getControllerName === "function", "Get Controller Name Exists");
		assert.ok(typeof this.oCarouselView.getStepView === "function", "Get Step View Exists");
		assert.equal(this.oCarouselView.getChartToolbar(), undefined, "Chart toolbar not loaded");
		assert.ok(typeof this.oCarouselView.createContent(this.oCarouselController) === "object", "Carosuel Content Exists");
		assert.equal(this.oCarouselView.getControllerName(), "sap.apf.ui.reuse.controller.carousel", "Controller Name Exists");
		assert.ok(typeof this.oCarouselView.getStepGallery() === "object", "Step Gallery Exists");
	});
}());