/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tNavTargetContextMapping');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
(function() {
	'use strict';
	var oNavTargetContextmappingView, spyOnAutoComplete, spyOnGetFilterMappingService, spyOnGetAllPropertiesOfEntitySet, spyOngetFilterMappingEntitySet, spyOnGetAllEntitySetsOfService, spyOnGetSelectPropOfFilterResolution, spyOnConfigEditorRegisterService, spyOnsetFilterMappingService, spyOnsetFilterMappingEntitySet, spyOnaddFilterMappingTargetProperty, spyOnConfigEditorSetIsUnsaved, spyOnRemoveSelectPropForValueHelp, modelerInstance;
	function doNothing() {
		return "";
	}
	QUnit.module("For a navigation target with existing context mapping service", {
		beforeEach : function(assert) {
			var oTextPool, oTextPoolHelper;
			var oNavTargetContextmappingController = new sap.ui.controller("sap.apf.modeler.ui.controller.navTargetContextMapping");
			var spyOnInit = sinon.spy(oNavTargetContextmappingController, "onInit");
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				modelerInstance = oModelerInstance;
				oTextPool = oModelerInstance.configurationHandler.getTextPool();
				oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(oTextPool);
				sinon.stub(sap.apf.modeler.ui.utils, "TextPoolHelper", function() {
					return oTextPoolHelper;
				});
				spyOnAutoComplete = sinon.spy(oTextPoolHelper, "setAutoCompleteOn");
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerService");
				spyOnGetAllPropertiesOfEntitySet = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySet");
				spyOnGetAllEntitySetsOfService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfService");
				spyOnGetFilterMappingService = sinon.spy(oModelerInstance.firstNavigationtarget, "getFilterMappingService");
				spyOngetFilterMappingEntitySet = sinon.spy(oModelerInstance.firstNavigationtarget, "getFilterMappingEntitySet");
				spyOnGetSelectPropOfFilterResolution = sinon.spy(oModelerInstance.firstNavigationtarget, "getFilterMappingTargetProperties");
				spyOnsetFilterMappingService = sinon.spy(oModelerInstance.firstNavigationtarget, "setFilterMappingService");
				spyOnsetFilterMappingEntitySet = sinon.spy(oModelerInstance.firstNavigationtarget, "setFilterMappingEntitySet");
				spyOnaddFilterMappingTargetProperty = sinon.spy(oModelerInstance.firstNavigationtarget, "addFilterMappingTargetProperty");
				spyOnRemoveSelectPropForValueHelp = sinon.spy(oModelerInstance.firstNavigationtarget, "removeFilterMappingTargetProperty");
				oNavTargetContextmappingView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.requestOptions",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : oNavTargetContextmappingController,
					viewData : {
						oConfigurationHandler : oModelerInstance.configurationHandler,
						oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
						oTextReader : oModelerInstance.modelerCore.getText,
						oParentObject : oModelerInstance.firstNavigationtarget,
						getCalatogServiceUri : doNothing
					}
				});
				assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
				done();
			});
		},
		afterEach : function() {
			sap.apf.modeler.ui.utils.TextPoolHelper.restore();
			oNavTargetContextmappingView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
			oNavTargetContextmappingView.getViewData().oConfigurationEditor.registerService.restore();
			oNavTargetContextmappingView.getViewData().oConfigurationEditor.getAllPropertiesOfEntitySet.restore();
			oNavTargetContextmappingView.getViewData().oConfigurationEditor.getAllEntitySetsOfService.restore();
			modelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oNavTargetContextmappingView.destroy();
		}
	});
	QUnit.test("When navTargetContextMapping view is initialized", function(assert) {
		//arrange
		var oViewData = oNavTargetContextmappingView.getViewData();
		var oController = oNavTargetContextmappingView.getController();
		var oDependenciesForService = {
			oConfigurationEditor : oViewData.oConfigurationEditor,
			type : "service"
		};
		var oModelForContextMappingEntity = {
			"Objects" : [ {
				"key" : "entitySet1",
				"name" : "entitySet1"
			}, {
				"key" : "entitySet2",
				"name" : "entitySet2"
			}, {
				"key" : "entitySet3",
				"name" : "entitySet3"
			}, {
				"key" : "entitySet4",
				"name" : "entitySet4"
			}, {
				"key" : "entitySet5",
				"name" : "entitySet5"
			}, {
				"key" : "entitySet11",
				"name" : "entitySet11"
			}, {
				"key" : "entitySet6",
				"name" : "entitySet6"
			}, {
				"key" : "entitySet7",
				"name" : "entitySet7"
			} ]
		};
		var oModelForContextMappingProperty = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property3",
				"name" : "property3"
			}, {
				"key" : "property4",
				"name" : "property4"
			} ]
		};
		//assert
		assert.ok(oNavTargetContextmappingView, "then navTargetContextMapping view is available");
		// auto Complete enabled asserts
		assert.strictEqual(spyOnAutoComplete.calledOnce, true, "then autocomplete function is called");
		assert.strictEqual(spyOnAutoComplete.calledWith(oNavTargetContextmappingView.byId("idSource"), oDependenciesForService), true, "then autocomplete is enabled on field source");
		// source section asserts
		assert.strictEqual(spyOnGetFilterMappingService.calledOnce, true, "then context mapping entity set is got from the navigation target object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then navigation target context mapping source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then navigation target context mapping source field is populated");
		// entity section asserts
		assert.strictEqual(spyOngetFilterMappingEntitySet.calledOnce, true, "then context mapping entity set is got from the navigation target object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then context mapping entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then context mapping entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then context mapping entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForContextMappingEntity, "then context mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oNavTargetContextmappingView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfFilterResolution.calledOnce, true, "then context mapping select properties are got from the navigation target object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("mappedProperties"), "then context mapping select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then context mapping select properties label field is set as required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then context mapping selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForContextMappingProperty, "then context mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oNavTargetContextmappingView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true,
				"then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source is changed", function(assert) {
		//arrangement
		var oModelForContextMappingEntity = {
			"Objects" : [ {
				"key" : "entitySet9",
				"name" : "entitySet9"
			} ]
		};
		var oModelForContextMappingProperty = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "property2",
				"name" : "property2"
			}, {
				"key" : "property8",
				"name" : "property8"
			} ]
		};
		//action
		oNavTargetContextmappingView.byId("idSource").setValue("testService3");
		oNavTargetContextmappingView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService3"), true, "then context mapping service is checked for registration");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.registerService("testService3"), true, "then context mapping service is valid service");
		assert.strictEqual(spyOnsetFilterMappingService.calledWith("testService3"), true, "then setFilterMappingService is called on navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingService(), "testService3", "then service of context mapping is changed");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith("entitySet9"), true, "then setFilterMappingEntitySet is called the navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet9", "then entity set of context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "entitySet9", "then context mapping entity field is populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idEntity").getModel().getData(), oModelForContextMappingEntity, "then context mapping entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService3"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnaddFilterMappingTargetProperty.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the navigation target object");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of context mapping is removed");
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1" ], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idSelectProperties").getSelectedKeys(), [ "property1" ], "then context mapping selected properties field are populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idSelectProperties").getModel().getData(), oModelForContextMappingProperty, "then context mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService3", "entitySet9"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oNavTargetContextmappingView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(oSelectDialog.getTitle(), "Select Service", "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idSource").setValue("");
		oNavTargetContextmappingView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty context mapping service is not checked for registration");
		assert.strictEqual(spyOnsetFilterMappingService.calledWith(undefined), true, "then setFilterMappingService is called on navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingService(), undefined, "then service of context mapping is changed");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith(undefined), true, "then setFilterMappingEntitySet is called the navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "", "then entity set of context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "", "then context mapping entity set field is populated");
		assert.strictEqual(oNavTargetContextmappingView.getController().byId("idEntityLabel").getRequired(), false, "then context mapping entity label field is set as not required");
		assert.deepEqual(oNavTargetContextmappingView.byId("idEntity").getModel(), undefined, "then context mapping entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of context mapping is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of context mapping is removed");
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idSelectProperties").getSelectedKeys(), [], "then context mapping selected properties field are populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idSelectProperties").getModel(), undefined, "then context mapping selected properties field model is set");
		assert.strictEqual(oNavTargetContextmappingView.getController().byId("idSelectPropertiesLabel").getRequired(), false, "then context mapping select properties label field is set as not required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idSource").setValue("test1");
		oNavTargetContextmappingView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then context mapping service is checked for registration");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.registerService("test11"), undefined, "then context mapping service is an invalid service");
		assert.strictEqual(spyOnsetFilterMappingService.calledWith(undefined), true, "then setFilterMappingService is called on navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingService(), undefined, "then service of context mapping is changed");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith(undefined), true, "then setFilterMappingEntitySet is called the navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "", "then entity set of context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "", "then context mapping entity set field is populated");
		assert.strictEqual(oNavTargetContextmappingView.getController().byId("idEntityLabel").getRequired(), false, "then context mapping entity label field is set as not required");
		assert.deepEqual(oNavTargetContextmappingView.byId("idEntity").getModel(), undefined, "then context mapping entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of context mapping is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of context mapping is removed");
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idSelectProperties").getSelectedKeys(), [], "then context mapping selected properties field are populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idSelectProperties").getModel(), undefined, "then context mapping selected properties field model is set");
		assert.strictEqual(oNavTargetContextmappingView.getController().byId("idSelectPropertiesLabel").getRequired(), false, "then context mapping select properties label field is set as not required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When entity set is changed", function(assert) {
		//arrangement
		var oModelForContextMappingProperty = {
			"Objects" : [ {
				"key" : "property5",
				"name" : "property5"
			}, {
				"key" : "property6",
				"name" : "property6"
			}, {
				"key" : "property7",
				"name" : "property7"
			} ]
		};
		//action
		oNavTargetContextmappingView.byId("idEntity").setSelectedKey("entitySet2");
		oNavTargetContextmappingView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnsetFilterMappingEntitySet.calledWith("entitySet2"), true, "then setFilterMappingEntitySet is called the navigation target object");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingEntitySet(), "entitySet2", "then entity set of context mapping is changed");
		assert.strictEqual(oNavTargetContextmappingView.byId("idEntity").getSelectedKey(), "entitySet2", "then context mapping entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of context mapping is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of context mapping is removed");
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idSelectProperties").getSelectedKeys(), [], "then context mapping selected properties field are populated");
		assert.deepEqual(oNavTargetContextmappingView.byId("idSelectProperties").getModel().getData(), oModelForContextMappingProperty, "then context mapping selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet2"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When select property is changed", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idSelectProperties").setSelectedKeys([ "property1", "property4" ]);
		oNavTargetContextmappingView.getController().handleChangeForSelectProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavTargetContextmappingView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of context mapping is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of context mapping is removed");
		assert.strictEqual(spyOnaddFilterMappingTargetProperty.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the navigation target object");
		assert.strictEqual(spyOnaddFilterMappingTargetProperty.calledWith("property4"), true, "then addSelectPropertiesOfValueHelp is called the navigation target object");
		assert.deepEqual(oNavTargetContextmappingView.getViewData().oParentObject.getFilterMappingTargetProperties(), [ "property1", "property4" ], "then select properties of context mapping is changed");
		assert.deepEqual(oNavTargetContextmappingView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property4" ], "then context mapping selected properties field are populated");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oNavTargetContextmappingView.getController().getValidationState(), true, "then navTargetContextMapping view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oNavTargetContextmappingView.byId("idSelectProperties").setSelectedKeys([]);
		//assert
		assert.strictEqual(oNavTargetContextmappingView.getController().getValidationState(), false, "then navTargetContextMapping view is not in valid state");
	});
}());