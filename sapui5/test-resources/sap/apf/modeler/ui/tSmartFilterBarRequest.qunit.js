/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tSmartFilterBarRequest');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
(function() {
	'use strict';
	var oSFBRequestView, smartFilterBarInstance, spyOnAutoComplete, spyOnGetAllEntityTypesOfService, spyOnGetServiceOfSFB, spyOnGetEntityTypeOfSFB, spyOnConfigEditorRegisterService, spyOnSetServiceOfSFB, spyOnSetEntityTypeOfSFB, spyOnConfigEditorSetIsUnsaved, oModelerInstance;
	function _doNothing() {
		return "";
	}
	function _placeViewAt(oSFBView) {
		var divToPlaceSmartFilter = document.createElement("div");
		divToPlaceSmartFilter.setAttribute('id', 'contentOfSFB');
		document.body.appendChild(divToPlaceSmartFilter);
		oSFBView.placeAt("contentOfSFB");
		sap.ui.getCore().applyChanges();
	}
	function _instantiateView(assert) {
		var oTextPool, oTextPoolHelper, oView;
		var oSFBRequestController = new sap.ui.controller("sap.apf.modeler.ui.controller.smartFilterBarRequest");
		var spyOnInit = sinon.spy(oSFBRequestController, "onInit");
		var spyOnBeforeRender = sinon.spy(oSFBRequestController, "onBeforeRendering");
		var spyOnAfterRender = sinon.spy(oSFBRequestController, "onAfterRendering");
		oTextPool = oModelerInstance.configurationHandler.getTextPool();
		oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(oTextPool);
		sinon.stub(sap.apf.modeler.ui.utils, "TextPoolHelper", function() {
			return oTextPoolHelper;
		});
		spyOnAutoComplete = sinon.spy(oTextPoolHelper, "setAutoCompleteOn");
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerService");
		spyOnGetAllEntityTypesOfService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntityTypesOfService");
		spyOnGetServiceOfSFB = sinon.spy(smartFilterBarInstance, "getService");
		spyOnGetEntityTypeOfSFB = sinon.spy(smartFilterBarInstance, "getEntityType");
		spyOnSetServiceOfSFB = sinon.spy(smartFilterBarInstance, "setService");
		spyOnSetEntityTypeOfSFB = sinon.spy(smartFilterBarInstance, "setEntityType");
		oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.requestOptions",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oSFBRequestController,
			viewData : {
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oTextReader : oModelerInstance.modelerCore.getText,
				oParentObject : smartFilterBarInstance,
				getCalatogServiceUri : _doNothing
			}
		});
		_placeViewAt(oView);
		assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
		assert.strictEqual(spyOnBeforeRender.called, true, "then SFB request onBeforeRender function is called");
		assert.strictEqual(spyOnAfterRender.called, true, "then SFB request onAfterRender function is called");
		return oView;
	}
	function _destroyResources() {
		document.body.removeChild(document.getElementById('contentOfSFB'));
		sap.apf.modeler.ui.utils.TextPoolHelper.restore();
		oSFBRequestView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
		oSFBRequestView.getViewData().oConfigurationEditor.registerService.restore();
		oSFBRequestView.getViewData().oConfigurationEditor.getAllEntityTypesOfService.restore();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oSFBRequestView.destroy();
	}
	QUnit.module("For an existing smart filter", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				//create SFB
				oModelerInstance.configurationEditorForUnsavedConfig.setFilterOption({
					smartFilterBar : true
				});
				smartFilterBarInstance = oModelerInstance.configurationEditorForUnsavedConfig.getSmartFilterBar();
				smartFilterBarInstance.setService("testService1");
				smartFilterBarInstance.setEntityType("entityType1");
				oSFBRequestView = _instantiateView(assert);
				done();
			});
		},
		afterEach : function() {
			_destroyResources();
		}
	});
	QUnit.test("When SFB view is initialized", function(assert) {
		//arrange
		var oViewData = oSFBRequestView.getViewData();
		var oController = oSFBRequestView.getController();
		var oDependenciesForService = {
			oConfigurationEditor : oViewData.oConfigurationEditor,
			type : "service"
		};
		var oModelForSFBEntityType = {
			"Objects" : [ {
				"key" : "entityType1",
				"name" : "entityType1"
			}, {
				"key" : "entityType2",
				"name" : "entityType2"
			} ]
		};
		//assert
		assert.ok(oSFBRequestView, "then SFB Request view is available");
		// auto Complete enabled asserts
		assert.strictEqual(spyOnAutoComplete.calledOnce, true, "then autocomplete function is called");
		assert.strictEqual(spyOnAutoComplete.calledWith(oSFBRequestView.byId("idSource"), oDependenciesForService), true, "then autocomplete is enabled on field source");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfSFB.calledOnce, true, "then SFB service is got from the SFB object");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then SFB source field is populated");
		// entity type section asserts
		assert.strictEqual(spyOnGetEntityTypeOfSFB.calledOnce, true, "then SFB entity type is got from the SFB object");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then SFB entity type label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entityType1", "then SFB entity types field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForSFBEntityType, "then SFB entity types field model is set");
		assert.strictEqual(spyOnGetAllEntityTypesOfService.calledOnce, true, "then all entity types are fetched for the service");
		assert.strictEqual(spyOnGetAllEntityTypesOfService.calledWith(oSFBRequestView.byId("idSource").getValue()), true, "then entity types are fetched for the correct service");
		// property visibility asserts
		assert.strictEqual(oSFBRequestView.byId("idSelectProperties").getVisible(), false, "then property box is not visible");
		assert.strictEqual(oSFBRequestView.byId("idSelectPropertiesLabel").getVisible(), false, "then property label is not visible");
	});
	QUnit.test("When source is changed", function(assert) {
		//arrangement
		var oModelForSFBEntityType = {
			"Objects" : [ {
				"key" : "entityType3",
				"name" : "entityType3"
			} ]
		};
		//action
		oSFBRequestView.byId("idSource").setValue("testService2");
		oSFBRequestView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService2"), true, "then SFB service is checked for registration");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.registerService("testService2"), true, "then SFB service is valid service");
		assert.strictEqual(spyOnSetServiceOfSFB.calledWith("testService2"), true, "then setService is called on smart filter bar object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getService(), "testService2", "then service of SFB is changed");
		//for entity type
		assert.strictEqual(spyOnSetEntityTypeOfSFB.calledWith("entityType3"), true, "then setEntityType is called the smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getEntityType(), "entityType3", "then entity type of SFB is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "entityType3", "then SFB entity field is populated");
		assert.deepEqual(oSFBRequestView.byId("idEntity").getModel().getData(), oModelForSFBEntityType, "then SFB entity field model is set");
		assert.strictEqual(spyOnGetAllEntityTypesOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntityTypesOfService.calledWith("testService2"), true, "then entity types are fetched for the correct service");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oSFBRequestView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oSFBRequestView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(oSelectDialog.getTitle(), "Select Service", "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oSFBRequestView.byId("idSource").setValue("");
		oSFBRequestView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty SFB service is not checked for registration");
		assert.strictEqual(spyOnSetServiceOfSFB.calledWith(undefined), true, "then setService is called on smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getService(), undefined, "then service of SFB is changed");
		//for entity type
		assert.strictEqual(spyOnSetEntityTypeOfSFB.calledWith(undefined), true, "then setEntityTypeOfSFB is called the smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getEntityType(), "", "then entity type of SFB is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "", "then SFB entity type field is populated");
		assert.strictEqual(oSFBRequestView.getController().byId("idEntityLabel").getRequired(), false, "then SFB entity type label field is set as not required");
		assert.deepEqual(oSFBRequestView.byId("idEntity").getModel(), undefined, "then SFB entity type field model is set");
		assert.strictEqual(spyOnGetAllEntityTypesOfService.calledWith(""), false, "then entity types are not fetched for the empty service");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oSFBRequestView.byId("idSource").setValue("test1");
		oSFBRequestView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then SFB service is checked for registration");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.registerService("test11"), undefined, "then SFB service is an invalid service");
		assert.strictEqual(spyOnSetServiceOfSFB.calledWith(undefined), true, "then setService is called on smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getService(), undefined, "then service of SFB is changed");
		//for entity type
		assert.strictEqual(spyOnSetEntityTypeOfSFB.calledWith(undefined), true, "then setEntityType is called the smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getEntityType(), "", "then entity type of SFB is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "", "then SFB entity type field is populated");
		assert.strictEqual(oSFBRequestView.getController().byId("idEntityLabel").getRequired(), false, "then SFB entity type label field is set as not required");
		assert.deepEqual(oSFBRequestView.byId("idEntity").getModel(), undefined, "then SFB entity type field model is set");
		assert.strictEqual(spyOnGetAllEntityTypesOfService.calledWith(""), false, "then entity types are not fetched for the empty service");
	});
	QUnit.test("When entity type is changed", function(assert) {
		//action
		oSFBRequestView.byId("idEntity").setSelectedKey("entityType2");
		oSFBRequestView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oSFBRequestView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity type
		assert.strictEqual(spyOnSetEntityTypeOfSFB.calledWith("entityType2"), true, "then setEntityType is called the smart filter object");
		assert.strictEqual(oSFBRequestView.getViewData().oParentObject.getEntityType(), "entityType2", "then entity type of SFB is changed");
		assert.strictEqual(oSFBRequestView.byId("idEntity").getSelectedKey(), "entityType2", "then SFB entity type field is populated");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oSFBRequestView.getController().getValidationState(), true, "then SFB view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oSFBRequestView.byId("idEntity").clearSelection();
		//assert
		assert.strictEqual(oSFBRequestView.getController().getValidationState(), false, "then SFB view is not in valid state");
	});
	QUnit.module("For a smart filter with no service and entity type", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				//create SFB
				oModelerInstance.configurationEditorForUnsavedConfig.setFilterOption({
					smartFilterBar : true
				});
				smartFilterBarInstance = oModelerInstance.configurationEditorForUnsavedConfig.getSmartFilterBar();
				oSFBRequestView = _instantiateView(assert);
				done();
			});
		},
		afterEach : function() {
			_destroyResources();
		}
	});
	QUnit.test("When SFB view is initialized", function(assert) {
		//arrange
		var oViewData = oSFBRequestView.getViewData();
		var oController = oSFBRequestView.getController();
		var oDependenciesForService = {
			oConfigurationEditor : oViewData.oConfigurationEditor,
			type : "service"
		};
		var focusedElement = document.activeElement;
		//assert
		assert.ok(oSFBRequestView, "then SFB Request view is available");
		// auto Complete enabled asserts
		assert.strictEqual(spyOnAutoComplete.calledOnce, true, "then autocomplete function is called");
		assert.strictEqual(spyOnAutoComplete.calledWith(oSFBRequestView.byId("idSource"), oDependenciesForService), true, "then autocomplete is enabled on field source");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfSFB.calledOnce, true, "then SFB service is got from the SFB object");
		assert.strictEqual(oController.byId("idSource").getValue(), "", "then SFB source field is populated");
		// entity type section asserts
		assert.strictEqual(spyOnGetEntityTypeOfSFB.calledOnce, false, "then SFB entity type is not got from the SFB object");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), false, "then SFB entity type label field is not set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "", "then SFB entity types field is not populated");
		assert.deepEqual(oController.byId("idEntity").getModel(), undefined, "then SFB entity types field model is not set");
		assert.strictEqual(spyOnGetAllEntityTypesOfService.calledOnce, false, "then all entity types are not fetched for the empty service");
		assert.strictEqual(spyOnGetAllEntityTypesOfService.calledWith(oSFBRequestView.byId("idSource").getValue()), false, "then entity types are not fetched for the empty service");
		// property visibility asserts
		assert.strictEqual(oSFBRequestView.byId("idSelectProperties").getVisible(), false, "then property box is disabled");
		assert.strictEqual(oSFBRequestView.byId("idSelectPropertiesLabel").getVisible(), false, "then property label is disabled");
		// initial focus asserts
		assert.strictEqual(oSFBRequestView.byId("idSource").sId, focusedElement.parentElement.id, "then the focus is set on the source field");
	});
}());
