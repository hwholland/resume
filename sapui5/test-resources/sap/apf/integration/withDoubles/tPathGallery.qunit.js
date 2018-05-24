	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");

    jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
    jQuery.sap.registerModulePath('sap.apf.integration', '../');
    jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
    jQuery.sap.require('sap.apf.integration.withDoubles.helper');
    jQuery.sap.require('sap.apf.integration.withDoubles.persistenceHelper');
    jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
    jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
    jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
    jQuery.sap.require('sap.apf.testhelper.doubles.uiApi');
    jQuery.sap.require('sap.apf.testhelper.doubles.request');
    jQuery.sap.require('sap.apf.testhelper.doubles.representation');
    jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
    jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
    jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
    jQuery.sap.require('sap.apf.testhelper.doubles.navigationHandler');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.Component');
	jQuery.sap.require('sap.apf.ui.instance');
	jQuery.sap.require("jquery.sap.storage");

	QUnit.module('Path Gallery Integration Tests', {
		beforeEach : function() {
			sap.apf.testhelper.injectURLParameters({"sap-client" : "777"});
			sap.apf.integration.withDoubles.helper.saveConstructors();
			sap.apf.integration.withDoubles.persistenceHelper.setup(this);
			var inject = {
					constructors : {
						NavigationHandler : sap.apf.testhelper.doubles.NavigationHandler
					}
			};
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi("CompUi", "/path/to/applicationConfiguration.json", inject);

			sap.apf.integration.withDoubles.persistenceHelper.init();
			this.spyGetLayoutView = function() {
				this.layout = new sap.ui.layout.VerticalLayout();
				this.layout.getController = function() {
					this.setFilter = function(param) {return param;};
					this.setMasterTitle = function() {return null;};
					this.setDetailTitle = function() {return null;};
					this.setMasterHeaderButton = function() {return null;};
					this.addMasterFooterContentLeft = function() {return null;};
					this.detailTitleRemoveAllContent = function() {return null;};
					this.enableDisableOpenIn = function() {return null;};
					return this;
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
				return this.layout;
			};
			//return this.layout;
		//};
		this.spy1 = sinon.spy(this.spyGetLayoutView);
		sinon.stub(this.oGlobalApi.oUiApi, "getLayoutView", this.spy1);
		this.analysisPath = this.oGlobalApi.oUiApi.getAnalysisPath();
		this.analysisPathController = this.analysisPath.getController();
		this.stepContainer = this.oGlobalApi.oUiApi.getStepContainer();
		this.stepContainerController = this.stepContainer.getController();
	},
	afterEach : function() {
		sap.apf.integration.withDoubles.helper.restoreConstructors();
		sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
		this.oGlobalApi.oCompContainer.destroy();
		this.oGlobalApi.oUiApi.getLayoutView.restore();
		if ((jQuery(".sapMDialog ").length) !== 0) {
			sap.ui.getCore().byId(jQuery(".sapMDialog ")[0].id).destroy();
		}
	},
	createThreeSteps : function() {
		this.oStep1 = this.oGlobalApi.oCoreApi.createStep("stepTemplate1", function() {
			return;
		});
		this.oStep2 = this.oGlobalApi.oCoreApi.createStep("stepTemplate3", function() {
			return;
		});
		this.oStep3 = this.oGlobalApi.oCoreApi.createStep("stepTemplate1", function() {
			return;
		});
	}
});
QUnit.test("Test opening of path from path gallery", function(assert) {
	assert.expect(14);
	var that = this;
	var done = assert.async();

	that.createThreeSteps();
	that.oGlobalApi.oCoreApi.setActiveStep(that.oStep2);
	that.oGlobalApi.oCoreApi.savePath("myPath", callbackSave.bind(that));

	function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
		assert.equal(oEntityTypeMetadata.type, "entityTypeMetadata", "Correct type of metadata");
		assert.equal(oMessageObject, undefined, "Message object expected undefined");
		this.oGlobalApi.oCoreApi.readPaths(callbackRead.bind(this));
	}
	function callbackRead(data) {
		var self = this;
		var galleryData = data.paths;
		var totalPaths = data.paths.length;
		this.analysisPathName = data.paths[0].AnalysisPathName;
		var utcDate = data.paths[0].LastChangeUTCDateTime;
		var numberPattern = /\d+/g;
		var timeStamp = parseInt(utcDate.match(numberPattern)[0], 10);
		var date = ((new Date(timeStamp)).toString()).split(' ');
		var dateToShow = date[1] + "-" + date[2] + "-" + date[3];
		this.StepCount = data.paths[0].StructuredAnalysisPath.steps.length;
		this.indexOfActiveStep = data.paths[0].StructuredAnalysisPath.indexOfActiveStep;
		var guid = data.paths[0].AnalysisPath;
		galleryData[0].guid = guid;
		galleryData[0].title = data.paths[0].AnalysisPathName;
		galleryData[0].StructuredAnalysisPath.noOfSteps = this.StepCount;
		galleryData[0].description = dateToShow + "  -   (" + this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ this.StepCount ]) + ")";
		galleryData[0].summary = self.AnalysisPathName + "- (" + dateToShow + ") - (" + this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ this.StepCount ]) + ")";
		var description = galleryData[0].description;
		var jsonData = {
			GalleryElements : galleryData
		};
		var oInject = {
			uiApi : this.oGlobalApi.oUiApi,
			oCoreApi : this.oGlobalApi.oCoreApi,
			oContext : this.oGlobalApi.oContext,
			oSerializationMediator : this.oGlobalApi.oSerializationMediator
		};
		this.pathGallery = new sap.ui.view({
			type : sap.ui.core.mvc.ViewType.JS,
			viewName : "sap.apf.ui.reuse.view.pathGallery",
			viewData : {
				oInject : oInject,
				jsonData : jsonData
			}
		});
		assert.ok(typeof this.pathGallery.getController().openPathGallery === "function", "openPathGallery function available");
		this.pathGallery.getController().openPathGallery();
		assert.ok(this.pathGallery, "Path Gallery View is Available");
		assert.ok(typeof this.pathGallery.getController === "function", "Path Gallery Controller is Available");
		assert.equal(jQuery(".sapMDialog ").length, 1, "Hierrachical select dialog of Path Gallery rendered on UI");
		assert.equal(totalPaths, sap.ui.getCore().byId(jQuery(".sapMDialog ")[0].id).getContent()[0].getPages()[0].getContent()[0].getItems().length, "Number of paths shown in Path gallery are same as those saved ");
		assert.equal(this.analysisPathName, sap.ui.getCore().byId(jQuery(".sapMDialog ")[0].id).getContent()[0].getPages()[0].getContent()[0].getItems()[0].getTitle(), "Path Name shown in path Gallery is same as saved Path");
		var dateShown = sap.ui.getCore().byId(jQuery(".sapMDialog ")[0].id).getContent()[0].getPages()[0].getContent()[0].getItems()[0].getDescription();
		assert.equal(description, dateShown, "Date of path shown in path Gallery is same as Last changed utc date time");
		sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).getContent()[0].getPages()[0].getContent()[0].getItems()[0].firePress();
		sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).getContent()[0].getPages()[1].getContent()[0].getItems()[1].firePress();
		assert.equal(self.oGlobalApi.oUiApi.getAnalysisPath().oSavedPathName.getTitle(), self.analysisPathName, "Title of the path set correctly");
		assert.equal(self.oGlobalApi.oCoreApi.isDirty(), false, "Path is not dirty");
		assert.equal(self.oGlobalApi.oCoreApi.getSteps().length, self.StepCount, "Path created with all steps");
		assert.deepEqual(self.oGlobalApi.oCoreApi.getActiveStep(), self.oStep2, "Active step set correctly");
		assert.equal(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().stepViews.length, 3, "Path successfully opened on UI");
		done();
	}
});