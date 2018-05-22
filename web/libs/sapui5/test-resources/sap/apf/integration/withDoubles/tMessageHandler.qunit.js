(function() {
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.require('sap.apf.tests.integration.withDoubles.helper');
    jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance'); // FIXME must occur in ALL test file that require helper.js
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
	jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
	jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
	jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
	jQuery.sap.require('sap.apf.testhelper.doubles.request');
	jQuery.sap.require('sap.apf.testhelper.doubles.representation');
	jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
	jQuery.sap.require('sap.apf.testhelper.doubles.uiApi');
	jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
	jQuery.sap.require('sap.apf.ui.instance');
	jQuery.sap.require('sap.apf.ui.representations.columnChart');
	jQuery.sap.require("sap.apf.core.utils.uriGenerator");
	jQuery.sap.require('sap.apf.ui.representations.utils.vizDatasetHelper');
	module("Integration test", {
		setup : function() {
			sap.apf.tests.integration.withDoubles.helper.saveConstructors();
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			this.oGlobalApi = sap.apf.testhelper.doubles.UiApi();
			sap.apf.core.getMetadata = sap.apf.testhelper.doubles.Metadata;
			sap.apf.core.Request = sap.apf.testhelper.doubles.Request;
			this.spyGetFacetFilter = function() {
				this.layout = new sap.ui.layout.VerticalLayout();
				this.layout.getFilterExpresion = function() {
					return [];
				};
				this.layout.resetAllFilters = function() {
					return;
				};
				return this.layout;
			};
			//sinon.stub(this.oGlobalApi.oUiApi, 'getFacetFilter', this.spyGetFacetFilter);
			this.oGlobalApi.oCoreApi.getUriGenerator = function() { //Extend the oCoreApi
				return sap.apf.core.utils.uriGenerator;
			};
			var sConfigPath = sap.apf.testhelper.determineTestResourcePath() + '/testhelper/config/applicationConfiguration.json'; //Pass the appropriate file to construct the path
			this.fnOriginalAjax = jQuery.ajax;
			sap.apf.testhelper.replacePathsInAplicationConfiguration(this.fnOriginalAjax);
			this.oGlobalApi.oCoreApi.loadApplicationConfig(sConfigPath); //Load Application Configuration
			this.oView = this.oGlobalApi.oUiApi.getNotificationBar();
			this.oController = this.oView.getController();
			var fnCallbackMessageHandling = this.oView.initializeHandler;
			this.oGlobalApi.oCoreApi.activateOnErrorHandling(true);
			this.oGlobalApi.oCoreApi.setCallbackForMessageHandling(fnCallbackMessageHandling.bind(this.oView));
			this.parameters = {};
			this.parameters.dimensions = [ {
				key : "Dimension1",
				kind : "xAxis"
			} ];
			this.parameters.measures = [ {
				key : "Measure1",
				kind : "yAxis"
			} ];
			this.parameters.sort = {};
			this.parameters.alternateRepresentationType = "";
			this.parameters.requiredFilters = [];
			this.columnChart = new sap.apf.ui.representations.columnChart(this.oGlobalApi.oCoreApi, this.parameters);
		},
		teardown : function() {
			sap.apf.tests.integration.withDoubles.helper.restoreConstructors();
			this.oGlobalApi.oContext.oCompContainer.destroy();
			jQuery.ajax = this.fnOriginalAjax;
		}
	});
	test('Scenario: Error Handling on getMainContent of ColumnChart for null data', function() {
		ok(this.columnChart, "Column Chart available");
		var bIsGroupTypeChart = true;
		var vizDatasetHelper = new sap.apf.ui.representations.utils.VizDatasetHelper(bIsGroupTypeChart);
		this.columnChart.UI5ChartHelper.init(undefined, undefined, bIsGroupTypeChart, vizDatasetHelper);
		this.columnChart.aDataResponse = [];
		var self = this;
		var formatter;
		var spySetData = function() {
			self.columnChart.formatter = new sap.apf.ui.representations.utils.formatter(self.oGlobalApi.oApi, undefined, []);
		};
		sinon.stub(this.columnChart, 'setData', spySetData);
		this.columnChart.setData([], undefined);
		this.columnChart.getMainContent("Step Title");
		equal($('.sapMMessageToast').length, 1, "No data Error caught");
		equal($('.sapMMessageToast')[0].textContent, "Data is not available for step Step Title", "Error text shown ->" + $('.sapMMessageToast')[0].textContent);
		this.columnChart.setData.restore();
	});
})();
