(function() {
	'use strict';

	jQuery.sap.declare('test.sap.apf.ui.tInstance');

	jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');

	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require('sap.apf.testhelper.doubles.navigationHandler');
	jQuery.sap.require("sap.apf.testhelper.helper");
	jQuery.sap.require('sap.apf.ui.instance');

	var oGlobalApi, oUiApi;
	/**
	 * @function
	 * @name sap.apf.ui.tInstance#doNothing
	 * @description Dummy function for stubbing unused methods
	 * */
	function doNothing() {
	}
	// Function Needed for  "Facet Filter function Call Test"  Starts here....
	function getLabelForStartDate() {
		return {
			"type" : "label",
			"kind" : "text",
			"key" : "StartDate"
		};
	}
	function getPropertyNameForStartDate() {
		return "StartDate";
	}
	function getMultiSelectionForStartDate() {
		return false;
	}
	function getMetadataForStartDate() {
		var oDeferredMetadata = jQuery.Deferred();
		var oPropertyMetadata = {
			"name" : "StartDate",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "8"
			},
			"label" : "Start Date",
			"aggregation-role" : "dimension",
			"isCalendarDate" : "true"
		};
		oDeferredMetadata.resolve(oPropertyMetadata);
		return oDeferredMetadata.promise();
	}
	function getValuesForStartDate() {
		var oDeferredValues = jQuery.Deferred();
		var aFilterValues = [ {
			"StartDate" : "20000101"
		}, {
			"StartDate" : "20000201"
		} ];
		var oNewPromiseForStartDateValues = jQuery.Deferred();
		oDeferredValues.resolve(aFilterValues, oNewPromiseForStartDateValues.promise());
		return oDeferredValues.promise();
	}
	/**
	 * @function
	 * @name sap.apf.ui.tInstance#formatterDouble
	 * @description stub for formatter 
	 * @return oFormatterStub
	 */
	function formatterDouble() {
		var getFormattedValueStub = sinon.stub();
		var oFormatterStub = {
			getFormattedValue : getFormattedValueStub
		};
		//Different formatted values returned based on the arguments passed
		getFormattedValueStub.withArgs("StartDate", "20000101").returns("1/1/2000");
		getFormattedValueStub.withArgs("StartDate", "20000201").returns("2/1/2000");
		return oFormatterStub;
	}
	sinon.stub(sap.apf.ui.utils, "formatter", sinon.stub().returns(formatterDouble()));
	function getTextEncodedStub(x) {
		return x;
	}
	/**
	 * @function
	 * @name sap.apf.ui.tInstance#getApplicationConfigPropertiesStub
	 * @description Stub for getApplicationConfigProperties
	 * @return appName
	 */
	function getApplicationConfigPropertiesStub() {
		return {
			appName : "sap-working-capital-analysis"
		};
	}
	function getStartParameterFacadeStub() {
		return {
			getSteps : function() {
				var arr = [];
				arr.push("step1");
				return arr;
			}
		};
	}
	function getConfigurationFilter() {
		var arr = [];
		var getSelectedValuesStubStartDate = sinon.stub();
		var oDeferredSelectedValuesStartDate = jQuery.Deferred();
		var aSelectedFilterValuesStartDate = [ "20000201" ];
		var oNewPromiseForStartDateSelectedValues = jQuery.Deferred();
		oDeferredSelectedValuesStartDate.resolve(aSelectedFilterValuesStartDate, oNewPromiseForStartDateSelectedValues.promise());
		//Different values returned based on the call count
		getSelectedValuesStubStartDate.onCall(0).returns(oDeferredSelectedValuesStartDate.promise());
		var obj = {
			getLabel : getLabelForStartDate,
			getPropertyName : getPropertyNameForStartDate,
			isMultiSelection : getMultiSelectionForStartDate,
			getAliasNameIfExistsElsePropertyName : doNothing,
			getMetadata : getMetadataForStartDate,
			getValues : getValuesForStartDate,
			getSelectedValues : getSelectedValuesStubStartDate,
			setSelectedValues : doNothing
		};
		arr.push(obj);
		return arr;
	}
	QUnit.module('UI API Tests', {
		beforeEach : function(assert) {
			var inject = {
					constructors : {
						NavigationHandler : sap.apf.testhelper.doubles.NavigationHandler
				}
			};
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi(undefined, undefined, inject);
			oUiApi = oGlobalApi.oUiApi;
			sinon.stub(oGlobalApi.oCoreApi, 'getApplicationConfigProperties', getApplicationConfigPropertiesStub);
			sinon.stub(oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', getTextEncodedStub);
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			oGlobalApi.oCoreApi.getApplicationConfigProperties.restore();
			oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
		}
	});
	QUnit.test('When adding control in detailFooter', function(assert) {
		//arrangements
		var layout = oUiApi.getLayoutView();
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		//action
		oUiApi.addDetailFooterContent(oLabel);
		var checkContentLeft = layout.byId("detailFooter").getContentLeft()[0];
		//assert
		assert.strictEqual(checkContentLeft, oLabel, "Then the control has loaded successfully");
	});
	QUnit.test('When adding control in MasterFooterContentRight', function(assert) {
		//arrangements
		var layout = oUiApi.getLayoutView();
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		//action
		oUiApi.addMasterFooterContentRight(oLabel);
		var checkContentRight = layout.byId("masterFooter").getContentRight()[0];
		//assert
		assert.strictEqual(checkContentRight, oLabel, "Then the control has loaded successfully");
	});
	QUnit.test('When invoking  event callbacks', function(assert) {
		//action
		oUiApi.setEventCallback(sap.apf.core.constants.eventTypes.contextChanged, doNothing);
		var eventval = oUiApi.getEventCallback(sap.apf.core.constants.eventTypes.contextChanged);
		//assert
		assert.strictEqual(eventval, doNothing, "Then got the event callback successsfully");
	});
	QUnit.test('When  recreating application layout', function(assert) {
		//arrangements
		var spyLayoutView = sinon.spy(oUiApi, 'getLayoutView');
		//action

		var appname = oUiApi.createApplicationLayout();
		//assert
		assert.ok(appname instanceof sap.m.App, "Then application created successfully");
		assert.strictEqual(spyLayoutView.called, false, "Then the layout is not recreated again");
	});
	QUnit.test('When calling destroy function', function(assert) {
		//arrangements
		var printHelper = oUiApi.getAnalysisPath().getToolbar().getController();
		var carousel = oUiApi.getAnalysisPath().getCarousel();
		var stepContainer = oUiApi.stepContainer;
		var notificationBar = oUiApi.messageHandler;
		var layout = oUiApi.applicationLayout;
		var oFacetFilter = oUiApi.oFacetFilterView;
		var toolbarController = oUiApi.getAnalysisPath().getToolbar().getController();
		var stepGalleryController = oUiApi.getAnalysisPath().getCarousel().getStepGallery().getController();
		var setpToolbarController = oUiApi.getStepContainer().getController().getView().getStepToolbar().getController();
		//action
		oUiApi.destroy();
		//assert
		assert.strictEqual(printHelper.oPrintHelper, undefined, "Then oPrintHelper is destroyed");
		assert.strictEqual(carousel.dndBox, undefined, "Then courosel is destroyed");
		assert.strictEqual(stepContainer, undefined, "Then step container is destroyed");
		assert.strictEqual(notificationBar, undefined, "Then notification bar is destroyed");
		assert.strictEqual(layout, undefined, "Then application layout is destroyed");
		assert.strictEqual(oFacetFilter, undefined, "Then facetFilter is destroyed");
		assert.strictEqual(toolbarController.saveDialog, undefined, "Then saveDialog is destroyed");
		assert.strictEqual(toolbarController.newOpenDilog, undefined, "Then OpenDialog is destroyed");
		assert.strictEqual(toolbarController.newDialog, undefined, "Then NewDialog is destroyed");
		assert.strictEqual(toolbarController.delConfirmDialog, undefined, "Then DeleteConfirmationDialog is destroyed");
		assert.strictEqual(toolbarController.confirmDialog, undefined, "Then ConfirmationDialog is destroyed");
		assert.strictEqual(toolbarController.confrimLogoffDialog, undefined, "Then LogOffDialog is destroyed");
		assert.strictEqual(toolbarController.noPathAddedDialog, undefined, "Then NoPathAddedDialog is destroyed");
		assert.strictEqual(stepGalleryController.oHierchicalSelectDialog, undefined, "Then HierchicalDialog is destroyed");
		assert.strictEqual(setpToolbarController.selectionDisplayDialog, undefined, "Then SelectionDialog is destroyed");
	});
	QUnit.test('When calling handleStartup with forward promise and Steps', function(assert) {
		//arrangements
		sinon.stub(oGlobalApi.oCoreApi, 'getStartParameterFacade', getStartParameterFacadeStub);
		var spyCreateFirstStep = sinon.spy(oGlobalApi.oCoreApi, 'createFirstStep');
		var deferred = jQuery.Deferred();
		deferred.resolve({
			navigationMode : "forward"
		});
		//action
		oUiApi.handleStartup(deferred.promise());
		var stepId = oGlobalApi.oCoreApi.getStartParameterFacade().getSteps()[0].stepId;
		var repId = oGlobalApi.oCoreApi.getStartParameterFacade().getSteps()[0].representationId;
		//assert
		assert.strictEqual(spyCreateFirstStep.getCall(0).args[0], stepId, "Then 1st  param is Step ID");
		assert.strictEqual(spyCreateFirstStep.getCall(0).args[1], repId, "Then 2nd  param is Representation ID");
		assert.ok(spyCreateFirstStep.getCall(0).args[2] instanceof Function, "Then 3rd param is callback");
		assert.strictEqual(spyCreateFirstStep.calledOnce, true, "Then the firststep has created successfully");
		oGlobalApi.oCoreApi.getStartParameterFacade.restore();
	});
	QUnit.test('When calling handleStartup in forward promise with No Steps', function(assert) {
		//arrangements
		var spyCreateFirstStep = sinon.spy(oGlobalApi.oCoreApi, 'createFirstStep');
		var deferred = jQuery.Deferred();
		deferred.resolve({
			navigationMode : "forward"
		});
		//action
		oUiApi.handleStartup(deferred.promise());
		//assert
		assert.strictEqual(spyCreateFirstStep.calledOnce, false, "Then no Step has created");
	});
	QUnit.test('When calling handleStartup with backward promise', function(assert) {
		//arrangements
		var spyUpdatePath = sinon.spy(oGlobalApi.oCoreApi, 'updatePath');
		var deferred = jQuery.Deferred();
		deferred.resolve({
			navigationMode : "backward"
		});
		//action
		oUiApi.handleStartup(deferred.promise());
		var analysispathname = oUiApi.getAnalysisPath();
		var titlename = analysispathname.oSavedPathName.getTitle();
		//assert
		assert.ok(spyUpdatePath.getCall(0).args[0] instanceof Function, "Then the param is callback");
		assert.strictEqual(spyUpdatePath.calledOnce, true, "Then the analysispath has updates successfully");
		assert.strictEqual(titlename, "unsaved", "Then the title for analysispath has set successfully");
	});
	QUnit.test('When drawing Facetfilter', function(assert) {
		//action
		oGlobalApi.oUiApi.drawFacetFilter(getConfigurationFilter());
		var subHeaderval = oGlobalApi.oUiApi.getLayoutView().byId("subHeader");
		var facetfilterval = subHeaderval.getContent();
		var facetFilterForPrint = oGlobalApi.oUiApi.getFacetFilterForPrint();
		//assert
		assert.strictEqual(facetfilterval.length, 1, "Then the facetfilterview has added successfully");
		assert.strictEqual(facetFilterForPrint.getLists().length, 1, "Then the facetfilterview is avilable for print");
	});
}());
