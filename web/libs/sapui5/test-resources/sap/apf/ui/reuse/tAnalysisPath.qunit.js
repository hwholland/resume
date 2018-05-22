jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfMessageHandler");
jQuery.sap.require("sap.apf.testhelper.interfaces.IfCoreApi");
jQuery.sap.require("sap.apf.testhelper.interfaces.IfUiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.stub.ajaxStub");
jQuery.sap.require("sap.apf.testhelper.stub.textResourceHandlerStub");
jQuery.sap.require("sap.apf.testhelper.config.sampleConfiguration");
jQuery.sap.require("sap.apf.testhelper.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.odata.sampleServiceData");
jQuery.sap.require("sap.apf.testhelper.doubles.coreApi");
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.testhelper.doubles.request");
jQuery.sap.require("sap.apf.testhelper.doubles.metadata");
jQuery.sap.require("sap.apf.testhelper.doubles.representation");
jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerNew");
jQuery.sap.require('sap.apf.ui.instance');
jQuery.sap.declare('test.sap.apf.ui.reuse.tAnalysisPath');
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
(function() {
	QUnit.module("Availability Tests For Analysis Path and Popover Menu", {
		beforeEach : function(assert) {
			sap.apf.integration.withDoubles.helper.saveConstructors();
			sap.apf.testhelper.stub.textResourceHandlerStub.setup(this);
			sap.apf.testhelper.stub.stubJQueryAjax();
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			sap.apf.core.getMetadata = sap.apf.testhelper.doubles.Metadata;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			this.oStep = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[2].id, function(assert) {
			}, this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId);// creating a step
			this.oGlobalApi.oCoreApi.setActiveStep(this.oGlobalApi.oCoreApi.getSteps()[0]);
			this.nIndex = this.oGlobalApi.oCoreApi.getSteps().indexOf(this.oStep);
			this.bStepChanged = true;
			this.spyGetLayoutView = function() {
				this.layout = new sap.ui.layout.VerticalLayout();
				this.layout.getController = function() {
					this.resetAllFilters = function(param) {
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
					return this;
				};
				return this.layout;
			};
			sinon.stub(this.oGlobalApi.oUiApi, 'getLayoutView', this.spyGetLayoutView);
			this.oGlobalApi.oUiApi.getAnalysisPath().getController().refreshAnalysisPath();
			this.DrawThumbnailContent = function() {
				return this;
			};
			this.spyRefreshCarousel = function() {
				return this;
			};
			this.initialStep = function() {
				return this;
			};
			this.carouselContent = function(param) {
				return param;
			};
			sinon.stub(this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel(), 'carouselContent', this.carouselContent);
			this.spyInitialStep = sinon.spy(this.initialStep);
			this.spyDrawThumbnailContent = sinon.spy(this.DrawThumbnailContent);
			sinon.stub(this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getStepView(0).getController(), 'drawThumbnailContent', this.spyDrawThumbnailContent);
			sinon.stub(this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController(), 'refreshCarousel', this.spyRefreshCarousel);
			this.spyStepContainer = function() {
				this.vLayout = new sap.ui.layout.VerticalLayout();
				this.getController = function() {
					this.drawStepContent = function() {
						return this;
					};
					this.drawRepresentation = function() {
						return this;
					};
					return this;
				};
				return this;
			};
			this.spyStepContainerFunctions = sinon.spy(this.spyStepContainer);
			sinon.stub(this.oGlobalApi.oUiApi, 'getStepContainer', this.spyStepContainerFunctions);
			this.analysisPath = this.oGlobalApi.oUiApi.getAnalysisPath();
			this.analysisPathController = this.analysisPath.getController();
			this.oActionListItem = this.analysisPath.oActionListItem;
		},
		afterEach : function() {
			jQuery.ajax.restore();
			sap.apf.testhelper.stub.textResourceHandlerStub.teardown();
			sap.apf.integration.withDoubles.helper.restoreConstructors();
			this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getStepView(0).getController().drawThumbnailContent.restore();
			this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().refreshCarousel.restore();
			this.oGlobalApi.oUiApi.getStepContainer.restore();
			this.oGlobalApi.oUiApi.getLayoutView.restore();
			this.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().carouselContent.restore();
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
			this.oGlobalApi.oCoreApi.removeStep(this.oGlobalApi.oCoreApi.getSteps()[0], function(assert) {
			});
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Path name and dirty state of initial path", function(assert) {
		assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), "Unnamed Analysis Path", "The Analysis Path name has the correct title");
		assert.strictEqual(this.analysisPath.oSavedPathName.getTitle().indexOf("*"), -1, "Name of a new Analysis Path does not have a *");
		var bStarInName = (this.analysisPath.oSavedPathName.getTitle().indexOf("*") !== -1);
		assert.strictEqual(this.oGlobalApi.oCoreApi.isDirty(), bStarInName, "Dirty state and * match for a new analysis path");
	});
	QUnit.test("API availability in Analysis Path Controller", function(assert) {
		assert.ok(typeof this.analysisPathController.refresh === "function", "Refresh API available on the analysis path controller");
		assert.ok(typeof this.analysisPathController.refreshAnalysisPath === "function", "Refresh Carousel API available on the analysis path controller");
		assert.ok(typeof this.analysisPathController.drawMainChart === "function", "Draw mail chart API available on the analysis path controller");
		assert.ok(typeof this.analysisPathController.drawThumbnail === "function", "Draw Thumbnail API available on the analysis path controller");
		assert.ok(typeof this.analysisPathController.callBackForUpdatePath === "function", "Callback for update path API available on the analysis path controller");
		assert.ok(typeof this.analysisPathController.callBackForUpdatePathAndSetLastStepAsActive === "function", "callBackForUpdatePathAndSetLastStepAsActive API available on the analysis path controller");
	});
	QUnit.test('refresh() test', function(assert) {
		this.analysisPathController.refresh(0);
		assert.ok(typeof this.analysisPathController.refresh === "function", "refresh() called");
	});
	QUnit.test('refresh() test with second step being the active step', function(assert) {
		this.oStep1 = this.oGlobalApi.oCoreApi.createStep(this.oGlobalApi.oCoreApi.getStepTemplates()[2].id, function(assert) {
		}, this.oGlobalApi.oCoreApi.getStepTemplates()[2].getRepresentationInfo()[0].representationId);// creating a step
		this.oGlobalApi.oCoreApi.setActiveStep(this.oGlobalApi.oCoreApi.getSteps()[1]);
		this.analysisPathController.refresh(0);
		assert.ok(typeof this.analysisPathController.refresh === "function", "refresh() called");
		this.oGlobalApi.oCoreApi.removeStep(this.oGlobalApi.oCoreApi.getSteps()[0], function(assert) {
		});
	});
	QUnit.test('refreshAnalysisPath() test', function(assert) {
		this.analysisPathController.refreshAnalysisPath();
		assert.ok(typeof this.analysisPathController.refreshAnalysisPath === "function", "refreshAnalysisPath() called");
	});
	QUnit.test('drawMainChart() test', function(assert) {
		this.analysisPathController.drawMainChart(this.bStepChanged);
		assert.strictEqual(this.spyStepContainerFunctions.called, true, "drawStepContent() has been called");
	});
	QUnit.test('drawThumbnail() test', function(assert) {
		this.analysisPathController.drawThumbnail(this.nIndex, this.bStepChanged);
		assert.strictEqual(this.spyDrawThumbnailContent.called, true, "drawThumbnailContent() has been called");
	});
	QUnit.test('updateCurrentStep() test', function(assert) {
		this.oGlobalApi.oUiApi.getAnalysisPath().getController().isOpenPath = true;
		this.analysisPathController.updateCurrentStep(this.oStep, this.nIndex, this.bStepChanged);
		assert.strictEqual(this.spyStepContainerFunctions.called, true, "drawStepContent() has been called from updateCurrentStep");
		assert.strictEqual(this.spyDrawThumbnailContent.called, true, "drawThumbnailContent() has been called from updateCurrentStep");
	});
	QUnit.test('callBackForUpdatePath() test', function(assert) {
		this.analysisPathController.callBackForUpdatePath(this.oStep, this.bStepChanged);
		assert.strictEqual(this.spyStepContainerFunctions.called, true, "drawStepContent() has been called from callBackForUpdatePath");
	});
	QUnit.test('callBackForUpdatePathAndSetLastStepAsActive() test', function(assert) {
		this.analysisPathController.callBackForUpdatePathAndSetLastStepAsActive(this.oStep, this.bStepChanged);
		assert.strictEqual(this.spyDrawThumbnailContent.called, true, "drawThumbnailContent() has been called from callBackForUpdatePathAndSetLastStepAsActive");
		assert.strictEqual(this.spyStepContainerFunctions.called, true, "drawStepContent() has been called from callBackForUpdatePathAndSetLastStepAsActive");
	});
	QUnit.test("Avalibiliy of menu popover in the analyis path", function(assert) {
		var oActionListPopover = this.analysisPath.oActionListPopover;
		var listItems = this.oActionListItem.getContent()[0].getItems();
		assert.ok(oActionListPopover, "Menu Popover available");
		assert.equal(listItems.length, 6, "Six actions availbale in menu popover");
		assert.equal(listItems[0].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("new"), "New button available");
		assert.equal(listItems[1].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("open"), "Open button available");
		assert.equal(listItems[2].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("save"), "Save button available");
		assert.equal(listItems[3].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("saveAs"), "Save As button available");
		assert.equal(listItems[4].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("delete"), "Delete button available");
		assert.equal(listItems[5].getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("print"), "Print button available");
	});
	QUnit.test('Set path title for new clean path', function(assert) {
	    this.analysisPathController.setPathTitle();
        assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded('unsaved'), 'Language dependent default title without asterisk');
    });
	QUnit.test('Set path title for unsaved dirty path', function(assert) {
	    this.oGlobalApi.oCoreApi.setDirtyState(true);
	    this.analysisPathController.setPathTitle();
	    assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), '*' + this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded('unsaved'), 'Asterisk indicates dirty path with language dependent default title');
	});
	QUnit.test('Set path title for a saved or opened path', function(assert) {
	    this.oGlobalApi.oCoreApi.setPathName("User's Delight");
	    this.analysisPathController.setPathTitle();
	    assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), "User's Delight", 'Previously set path name returned displayed as clean path');
	});
	QUnit.test('Set path title for a saved or opened dirty path', function(assert) {
	    this.oGlobalApi.oCoreApi.setPathName("User's Delight");
	    this.oGlobalApi.oCoreApi.setDirtyState(true);
	    this.analysisPathController.setPathTitle();
	    assert.strictEqual(this.analysisPath.oSavedPathName.getTitle(), "*User's Delight", 'Previously set path name prefixed with astersik as indicator for dirty path');
	});
})();