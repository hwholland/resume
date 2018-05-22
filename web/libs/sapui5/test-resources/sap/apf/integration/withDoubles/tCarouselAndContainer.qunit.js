/*!
* SAP APF Analysis Path Framework
* 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
*/
/*global window, sap, jQuery, module, test, ok, asyncTest, expect, equal, start, sinon */
(function() {
    'use strict';

    jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
    jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance'); // FIXME must occur in ALL test file that require helper.js
    jQuery.sap.require('sap.apf.testhelper.helper');
    jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
    jQuery.sap.require('sap.apf.tests.integration.withDoubles.helper');
    jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
    jQuery.sap.require('sap.apf.testhelper.doubles.request');
    jQuery.sap.require('sap.apf.testhelper.doubles.representation');
    jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
    jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
    jQuery.sap.require('sap.apf.testhelper.doubles.uiApi');
    
    jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
    jQuery.sap.require('sap.apf.testhelper.stub.ajaxStub');
    jQuery.sap.require('sap.apf.testhelper.stub.givenMessagesTextsAndConfigs');
    jQuery.sap.require('sap.apf.testhelper.stub.givenAnalyticalConfigs');
    jQuery.sap.require('sap.apf.testhelper.stub.textResourceHandlerStub');
    
    jQuery.sap.require("sap.apf.core.utils.uriGenerator");
	
    
    var drawRepresentation = function(oCurrentStep, bStepChanged) {
		this.oGlobalApi.oCoreApi.setActiveStep(this.oGlobalApi.oCoreApi.getSteps()[0]);
		var nIndex = this.oGlobalApi.oCoreApi.getSteps().indexOf(this.oGlobalApi.oCoreApi.getActiveStep());
		if (nIndex === 0) {
			this.oGlobalApi.oUiApi.getAnalysisPath().getController().refreshAnalysisPath();
			this.oGlobalApi.oCoreApi.setActiveStep(this.oGlobalApi.oCoreApi.getSteps()[this.oGlobalApi.oCoreApi.getSteps().length - 1]);
		}

		this.oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation.prototype.bIsAlternateView = false;
		this.oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation.prototype.type = "none";
		this.oGlobalApi.oUiApi.getAnalysisPath().getController().updateCurrentStep(oCurrentStep, nIndex, bStepChanged);
	};

	module('Carousel & Container Setup', {
		setup : function() {
		    sap.apf.testhelper.stub.stubJQueryAjax();
            sap.apf.testhelper.stub.textResourceHandlerStub.setup(this);
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			this.oGlobalApi = sap.apf.testhelper.doubles.UiApi();
			sap.apf.core.Metadata = sap.apf.testhelper.doubles.Metadata;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;

			this.oGlobalApi.oCoreApi.loadApplicationConfig("/pathOfNoInterest/applicationConfigurationIntegration.json"); //Load Application Configuration
			var self = this;
			var spyGetEventCallback = function(eventType) {
				return self.oGlobalApi.oUiApi.getEventCallback(eventType);
			};
			sinon.stub(this.oGlobalApi.oApi, 'getEventCallback', spyGetEventCallback);
			var spyUiGetEventCallback = function(){
				return "";
			};
			sinon.stub(this.oGlobalApi.oUiApi, 'getEventCallback', spyUiGetEventCallback);

            var metadata;
			var newMetadata = function() {
				this.getPropertyMetadata = function(sPropertyName) {
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
			};
			
			var fakeResetAllFilters = function () {
				return null;// intensionally empty
			};			

			//Carousel View & Controller Instance
			this.oCarouselView = this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel();
			this.oCarouselController = this.oCarouselView.oController;
			
			sinon.stub(sap.apf.testhelper.doubles, 'Metadata', newMetadata);
		},
		teardown : function() {
			sap.apf.testhelper.doubles.Metadata.restore();
			this.oGlobalApi.oContext.oCompContainer.destroy();
			this.oGlobalApi.oApi.getEventCallback.restore();
			this.oGlobalApi.oUiApi.getEventCallback.restore();
			jQuery("#stepContainerContent").remove();
			sap.apf.testhelper.stub.textResourceHandlerStub.teardown();
            jQuery.ajax.restore();
		}
	});
	
	asyncTest('Carousel & Step Container', function() {
		
		var self = this;
		this.oGlobalApi.oUiApi.createApplicationLayout().placeAt("stepContainerContent");
		expect(9);
		
		this.oGlobalApi.oUiApi.createApplicationLayout().onAfterRendering = function () {
			
			var sampleStepTemplate;
			if (self.oGlobalApi.oCoreApi.getStepTemplates()[0]) {
				sampleStepTemplate = self.oGlobalApi.oCoreApi.getStepTemplates()[0];
			}
			self.oGlobalApi.oCoreApi.createStep(sampleStepTemplate.id, drawRepresentation.bind(self), sampleStepTemplate.getRepresentationInfo()[0].representationId);
			
			equal(self.oGlobalApi.oCoreApi.getSteps().length, 1, "Step is added successfully");
			ok(typeof self.oGlobalApi.oUiApi.getStepContainer === "function", "Step Container Exists");
			equal(self.oGlobalApi.oUiApi.getStepContainer().oController.getCurrentRepresentation().type, "PieChart", "Pie Chart is inserted in the representation container" );
			equal(jQuery(".DnD-block").length, 2, "Step exists in carousel container");
			
			self.oGlobalApi.oCoreApi.createStep(sampleStepTemplate.id, drawRepresentation.bind(self), sampleStepTemplate.getRepresentationInfo()[0].representationId);
			
			window.setTimeout(function () {
				self.oGlobalApi.oUiApi.getAnalysisPath().getToolbar().getController().resetAnalysisPath(); //Remove All Steps
				equal(self.oGlobalApi.oCoreApi.getSteps().length, 0, "All Steps is removed successfully");
				equal(jQuery(".DnD-block").length, 1, "All Step removed from carousel container");
				
				self.oGlobalApi.oCoreApi.createStep(sampleStepTemplate.id, drawRepresentation.bind(self), sampleStepTemplate.getRepresentationInfo()[0].representationId);
				self.oGlobalApi.oCoreApi.createStep(sampleStepTemplate.id, drawRepresentation.bind(self), sampleStepTemplate.getRepresentationInfo()[0].representationId);
				
				window.setTimeout(function () {
					jQuery(jQuery(".DnD-block")[0]).remove();
					self.oCarouselController.removeStep(1); // Remove Step Index 0
					equal(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews.length, 1, "One Step is removed successfully");
					ok(self.oGlobalApi.oUiApi.getStepContainer(), "Step Container Exists");
					equal(jQuery(".DnD-block").length, 2, "One Step removed from carousel container");
					start();
				}, 2000);
			}, 1500);
		};
		

		
	});
}());
