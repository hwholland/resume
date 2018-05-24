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
jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerNew");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require('sap.apf.utils.navigationHandler');
(function() {
	QUnit.module("Navigation target unit tests", {
		beforeEach : function(assert) {
			var self = this;
			sap.apf.integration.withDoubles.helper.saveConstructors();
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			this.navTargetsWithoutStepSpecific = {
				global : [ {
					id : "NavigationTarget-1",
					semanticObject : "FioriApplication",
					action : "analyzeKPIDetails",
					text : "Analyze KPI Details"
				}, {
					id : "NavigationTarget-2",
					semanticObject : "APFI2ANav",
					action : "launchNavTarget",
					text : "Detailed Analysis"
				} ],
				stepSpecific : []
			};
			this.navTargetsWithStepSpecific = {
				global : [ {
					id : "NavigationTarget-1",
					semanticObject : "FioriApplication",
					action : "analyzeKPIDetails",
					text : "Analyze KPI Details"
				}, {
					id : "NavigationTarget-2",
					semanticObject : "APFI2ANav",
					action : "launchNavTarget",
					text : "Detailed Analysis"
				} ],
				stepSpecific : [ {
					id : "NavigationTarget-3",
					semanticObject : "FioriApplication",
					action : "analyzeKPIDetails",
					text : "Analyze KPI Details"
				}, {
					id : "NavigationTarget-4",
					semanticObject : "APFI2ANav",
					action : "launchNavTarget",
					text : "Detailed Analysis"
				} ]
			};
			var stubGetTextEncoded = function(x) {
				return x;
			};
			var stubGetApplicationConfigProperties = function() {
				var appName = {
					appName : "sap-working-capital-analysis"
				};
				return appName;
			};
			var stubGetNotificationBar = function() {
				var layout = new sap.ui.layout.VerticalLayout();
				layout.getController = function(){
					return {
						showMessage : function(){}
					};
				};
				return layout;
			};
			var stubStepContainer = function() {
				return new sap.ui.layout.VerticalLayout();
			};
			var stubAnalysisPath = function() {
				return new sap.ui.layout.VerticalLayout();
			};
			sinon.stub(this.oGlobalApi.oCoreApi, 'getApplicationConfigProperties', stubGetApplicationConfigProperties);
			sinon.stub(this.oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', stubGetTextEncoded);
			sinon.stub(this.oGlobalApi.oUiApi, 'getNotificationBar', stubGetNotificationBar);
			sinon.stub(this.oGlobalApi.oUiApi, 'getStepContainer', stubStepContainer);
			sinon.stub(this.oGlobalApi.oUiApi, 'getAnalysisPath', stubAnalysisPath);
			var getNavigationTargetsStub = new sinon.stub();
			var oDeferredFirstCall = new jQuery.Deferred();
			oDeferredFirstCall.resolve(this.navTargetsWithoutStepSpecific);
			var oDeferredSecondCall = new jQuery.Deferred();
			oDeferredSecondCall.resolve(this.navTargetsWithStepSpecific);
			getNavigationTargetsStub.onFirstCall().returns(oDeferredFirstCall.promise());
			getNavigationTargetsStub.onSecondCall().returns(oDeferredSecondCall.promise());
			this.layoutView = this.oGlobalApi.oUiApi.getLayoutView();
			this.layoutController = this.layoutView.getController();
			this.oNavigationHandler = this.layoutView.getViewData().oNavigationHandler;
			this.oNavigationHandler.getNavigationTargets = getNavigationTargetsStub;
			this.selectedNavTarget = "";
			this.navigateToAppSpy = function(selectedNavTarget) {
				self.selectedNavTarget = selectedNavTarget;
			};
			this.spyNavigateToApp = sinon.spy(this.navigateToAppSpy);
			sinon.stub(this.oNavigationHandler, "navigateToApp", this.spyNavigateToApp);
		},
		afterEach : function() {
			this.oGlobalApi.oCoreApi.getApplicationConfigProperties.restore();
			this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
			this.oGlobalApi.oUiApi.getNotificationBar.restore();
			this.oGlobalApi.oUiApi.getStepContainer.restore();
			this.oGlobalApi.oUiApi.getAnalysisPath.restore();
			this.oNavigationHandler.navigateToApp.restore();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Populate open in popover and navigate", function(assert) {
		//Global navigation target test
		this.layoutController.openInBtn.firePress();
		assert.deepEqual(this.layoutController.oNavListPopover.getContent()[0].getModel().getData().navTargets, this.navTargetsWithoutStepSpecific.global, "Open in pop over is populated with global navigation target actions");
		this.layoutController.oNavListPopover.getContent()[0].getItems()[0].firePress();
		assert.equal(this.selectedNavTarget, "NavigationTarget-1", "Global Navigation target is selected from the open in popover");
		assert.ok(this.spyNavigateToApp.called === true, "Navigated to selected global navigation target");
		//Step specific target test
		this.layoutController.openInBtn.firePress();
		var stepSpecificList = this.layoutController.oNavListPopover.getContent()[0].getModel().getData().navTargets;
		var globalList = this.layoutController.oNavListPopover.getContent()[2].getModel().getData().navTargets;
		var list = {
			global : globalList,
			stepSpecific : stepSpecificList
		};
		assert.deepEqual(list, this.navTargetsWithStepSpecific, "Open in pop over is populated with step specific and global navigation target actions");
		this.layoutController.oNavListPopover.getContent()[0].getItems()[0].firePress();
		assert.equal(this.selectedNavTarget, "NavigationTarget-3", "Step specific Navigation target is selected from the open in popover");
		assert.ok(this.spyNavigateToApp.called === true, "Navigated to selected step specific navigation target");
	});
}());