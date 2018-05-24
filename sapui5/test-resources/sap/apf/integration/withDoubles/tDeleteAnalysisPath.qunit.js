jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.uiApi');
jQuery.sap.require('sap.apf.testhelper.doubles.navigationHandler');
jQuery.sap.require('sap.apf.integration.withDoubles.helper');
jQuery.sap.require('sap.apf.integration.withDoubles.persistenceHelper');
jQuery.sap.require('sap.apf.Component');
jQuery.sap.require('sap.apf.ui.instance');
jQuery.sap.require("jquery.sap.storage");

QUnit.module('Delete Analysis Path Integration Tests', {
	beforeEach : function() {
		sap.apf.testhelper.injectURLParameters({
			"sap-client" : "777"
		});
		sap.apf.integration.withDoubles.helper.saveConstructors();
		sap.apf.integration.withDoubles.persistenceHelper.setup(this);

		sap.apf.integration.withDoubles.persistenceHelper.init();
		var inject = {
				constructors : {
					NavigationHandler : sap.apf.testhelper.doubles.NavigationHandler
				}
		};
		this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi("CompUi", "/path/to/applicationConfiguration.json", inject);


		this.spyGetLayoutView = function() {
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
		this.spy1 = sinon.spy(this.spyGetLayoutView);
		sinon.stub(this.oGlobalApi.oUiApi, "getLayoutView", this.spy1);
		this.analysisPath = this.oGlobalApi.oUiApi.getAnalysisPath();
		this.analysisPathController = this.analysisPath.getController();
		this.stepContainer = this.oGlobalApi.oUiApi.getStepContainer();
		this.stepContainerController = this.stepContainer.getController();
	},
	afterEach : function() {
		if (jQuery(".sapMDialog").length !== 0) {
			sap.ui.getCore().byId(jQuery(".sapMDialog")[0].getAttribute("id")).destroy();
		}
		sap.apf.integration.withDoubles.helper.restoreConstructors();
		sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
		this.oGlobalApi.oCompContainer.destroy();
		this.oGlobalApi.oUiApi.getLayoutView.restore();
	},
	createThreeSteps : function() {
		this.oStep1 = this.oGlobalApi.oCoreApi.createStep("stepTemplate1", function() {
		});
		this.oStep2 = this.oGlobalApi.oCoreApi.createStep("stepTemplate3", function() {
		});
		this.oStep3 = this.oGlobalApi.oCoreApi.createStep("stepTemplate1", function() {
		});
	}
});
QUnit.test("Deletion of saved path from Path Gallery", function(assert) {
	assert.expect(11);
	var that = this;
	that.saveCounter = 0;
	var done = assert.async();

	that.createThreeSteps();
	that.oGlobalApi.oCoreApi.savePath("TestPath1", callbackSave.bind(that));
	that.oGlobalApi.oCoreApi.savePath("TestPath2", callbackSave.bind(that));
	that.oGlobalApi.oCoreApi.savePath("TestPath3", callbackSave.bind(that));

	function callbackSave(data) {
		that.saveCounter++;
		if (that.saveCounter === 3) {
			that.oGlobalApi.oCoreApi.readPaths(callbackRead.bind(that));
		}
	}

	function callbackRead(data) {
		var galleryData = data.paths;
		this.totalPaths = data.paths.length;
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
		galleryData[0].StructuredAnalysisPath.noOfSteps = this.StepCount;
		galleryData[0].description = dateToShow + "  -   (" + this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ this.StepCount ]) + ")";
		
		galleryData[0].summary = this.analysisPathName + "- (" + dateToShow + ") - (" + this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ this.StepCount ]) + ")";
		var description = galleryData[0].description;
		var jsonData = {
			GalleryElements : galleryData
		};
		var oInject = {
			uiApi : this.oGlobalApi.oUiApi,
			oCoreApi : this.oGlobalApi.oCoreApi,
			oContext : this.oGlobalApi.oContext
		};
		this.pathGalleryWithDelete = new sap.ui.view({
			type : sap.ui.core.mvc.ViewType.JS,
			viewName : "sap.apf.ui.reuse.view.deleteAnalysisPath",
			viewData : {
				oInject : oInject,
				jsonData : jsonData
			}
		});
		assert.ok(typeof this.pathGalleryWithDelete.getController().openPathGallery === "function", "openPathGallery function available");
		this.pathGalleryWithDelete.getController().openPathGallery();
		assert.ok(this.pathGalleryWithDelete, "deleteAnalysisPath View is Available");
		assert.ok(typeof this.pathGalleryWithDelete.getController === "function", "deleteAnalysisPath Controller is Available");
		assert.equal(jQuery(".sapMDialog").length, 1, "Dialog for Path Gallery with Delete mode available on ui");
		assert.equal(this.totalPaths, sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).getContent()[0].getItems().length, "Number of paths shown in Path gallery are same as those saved ");
		assert.equal(this.analysisPathName, sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).getContent()[0].getItems()[0].getTitle(), "Path Name to be deleted is 'TestPath1'");
		var descriptionOnUi = sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).getContent()[0].getItems()[0].getDescription();
		assert.equal(description, descriptionOnUi, "Description in path Gallery with delete mode on UI is same as saved description");
		assert.equal(jQuery(".sapMLIBIconDel").length, this.totalPaths, "Delete Icon Available for all the paths");
		var self = this;
		self.oGlobalApi.oUiApi.getAnalysisPath().oSavedPathName.setTitle("TestPath1");
		sap.ui.getCore().byId(jQuery(".sapMLIBIconDel")[0].getAttribute("id")).firePress();
		sap.ui.getCore().byId(jQuery(".sapMDialog")[1].getAttribute("id")).getBeginButton().firePress();
		assert.notEqual(sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).getContent()[0].getItems()[0].getTitle(), self.analysisPathName, "List item deleted from the UI");
		self.oGlobalApi.oCoreApi.readPaths(callbackRead.bind(self));
		function callbackRead(data) {
			var pathsPresent = data.paths.length;
			assert.equal((self.totalPaths) - 1, pathsPresent, "Path deleted successfully");
			
		}
		assert.equal(self.oGlobalApi.oUiApi.getAnalysisPath().oSavedPathName.getTitle(), "Unnamed Analysis Path", "Current opened path deleted.Therefore Analysis Path has been resetted");
		sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).close();
		sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).destroy();
		done();
	}
});
