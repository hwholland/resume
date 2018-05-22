/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tFacetFilterVHR');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
(function() {
	'use strict';
	var oVHRView, spyOnAutoComplete, spyOnGetServiceOfValueHelp, spyOnGetAllPropertiesOfEntitySet, spyOnGetEntitySetOfValueHelp, spyOnGetAllEntitySetsOfService, spyOnGetSelectPropOfValueHelp, spyOnConfigEditorRegisterService, spyOnSetServiceOfValueHelp, spyOnSetEntitySetOfValueHelp, spyOnAddSelectPropForValueHelp, spyOnConfigEditorSetIsUnsaved, spyOnRemoveSelectPropForValueHelp, oModelerInstance;
	function doNothing() {
		return "";
	}
	QUnit.module("For a facet filter with existing VHR", {
		beforeEach : function(assert) {
			var oTextPool, oTextPoolHelper;
			var oVHRController = new sap.ui.controller("sap.apf.modeler.ui.controller.facetFilterVHR");
			var spyOnInit = sinon.spy(oVHRController, "onInit");
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				oTextPool = modelerInstance.configurationHandler.getTextPool();
				oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(oTextPool);
				sinon.stub(sap.apf.modeler.ui.utils, "TextPoolHelper", function() {
					return oTextPoolHelper;
				});
				spyOnAutoComplete = sinon.spy(oTextPoolHelper, "setAutoCompleteOn");
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				spyOnConfigEditorRegisterService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "registerService");
				spyOnGetAllPropertiesOfEntitySet = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllPropertiesOfEntitySet");
				spyOnGetAllEntitySetsOfService = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getAllEntitySetsOfService");
				spyOnGetServiceOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "getServiceOfValueHelp");
				spyOnGetEntitySetOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "getEntitySetOfValueHelp");
				spyOnGetSelectPropOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "getSelectPropertiesOfValueHelp");
				spyOnSetServiceOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "setServiceOfValueHelp");
				spyOnSetEntitySetOfValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "setEntitySetOfValueHelp");
				spyOnAddSelectPropForValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "addSelectPropertyOfValueHelp");
				spyOnRemoveSelectPropForValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "removeSelectPropertyOfValueHelp");
				oVHRView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.requestOptions",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : oVHRController,
					viewData : {
						oConfigurationHandler : oModelerInstance.configurationHandler,
						oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
						oTextReader : oModelerInstance.modelerCore.getText,
						oParentObject : oModelerInstance.facetFilterUnsaved,
						getCalatogServiceUri : doNothing
					}
				});
				oVHRView.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
				assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
				done();
			});
		},
		afterEach : function() {
			sap.apf.modeler.ui.utils.TextPoolHelper.restore();
			oVHRView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
			oVHRView.getViewData().oConfigurationEditor.registerService.restore();
			oVHRView.getViewData().oConfigurationEditor.getAllPropertiesOfEntitySet.restore();
			oVHRView.getViewData().oConfigurationEditor.getAllEntitySetsOfService.restore();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oModelerInstance.reset();
			oVHRView.destroy();
		}
	});
	QUnit.test("When VHR view is initialized", function(assert) {
		//arrange
		var oViewData = oVHRView.getViewData();
		var oController = oVHRView.getController();
		var oDependenciesForService = {
			oConfigurationEditor : oViewData.oConfigurationEditor,
			type : "service"
		};
		var oModelForVHREntity = {
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
		var oModelForVHRSelect = {
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
		assert.ok(oVHRView, "then VHR view is available");
		// auto Complete enabled asserts
		assert.strictEqual(spyOnAutoComplete.calledOnce, true, "then autocomplete function is called");
		assert.strictEqual(spyOnAutoComplete.calledWith(oVHRView.byId("idSource"), oDependenciesForService), true, "then autocomplete is enabled on field source");
		// required fields asserts
		assert.strictEqual(oVHRView.getController().byId("idEntityLabel").getRequired(), true, "then value help entity label field is set as required");
		assert.strictEqual(oVHRView.getController().byId("idSelectPropertiesLabel").getRequired(), true, "then value help select properties label field is set as required");
		assert.strictEqual(oVHRView.getController().byId("idSourceLabel").getRequired(), true, "then value help service label field is set as required");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfValueHelp.calledOnce, true, "then value help entity set is got from the facet filter object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then value help source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then value help source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySetOfValueHelp.calledOnce, true, "then value help entity set is got from the facet filter object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then value help entity label is populated");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then value help entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForVHREntity, "then value help entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oVHRView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfValueHelp.calledOnce, true, "then value help select properties are got from the facet filter object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("vhSelectProperties"), "then value help select properties label is populated");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then value help selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oVHRView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source is changed", function(assert) {
		//arrangement
		var oModelForVHREntity = {
			"Objects" : [ {
				"key" : "entitySet9",
				"name" : "entitySet9"
			} ]
		};
		var oModelForVHRSelect = {
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
		oVHRView.byId("idSource").setValue("testService3");
		oVHRView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService3"), true, "then value help service is checked for registration");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.registerService("testService3"), true, "then value help service is valid service");
		assert.strictEqual(spyOnSetServiceOfValueHelp.calledWith("testService3"), true, "then setServiceOfValueHelp is called on facet filter object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), "testService3", "then service of value help is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith("entitySet9"), true, "then setEntitySetOfValueHelp is called the facet filter object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "entitySet9", "then entity set of value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "entitySet9", "then value help entity field is populated");
		assert.deepEqual(oVHRView.byId("idEntity").getModel().getData(), oModelForVHREntity, "then value help entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService3"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1" ], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "property1" ], "then value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService3", "entitySet9"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oVHRView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oVHRView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(oSelectDialog.getTitle(), "Select Service", "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oVHRView.byId("idSource").setValue("");
		oVHRView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty value help service is not checked for registration");
		assert.strictEqual(spyOnSetServiceOfValueHelp.calledWith(undefined), true, "then setServiceOfValueHelp is called on facet filter object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), undefined, "then service of value help is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith(undefined), true, "then setEntitySetOfValueHelp is called the facet filter object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "", "then entity set of value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "", "then value help entity set field is populated");
		assert.deepEqual(oVHRView.byId("idEntity").getModel(), undefined, "then value help entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of value help is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [], "then value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel(), undefined, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oVHRView.byId("idSource").setValue("test1");
		oVHRView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then value help service is checked for registration");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.registerService("test11"), undefined, "then value help service is an invalid service");
		assert.strictEqual(spyOnSetServiceOfValueHelp.calledWith(undefined), true, "then setServiceOfValueHelp is called on facet filter object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), undefined, "then service of value help is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith(undefined), true, "then setEntitySetOfValueHelp is called the facet filter object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "", "then entity set of value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "", "then value help entity set field is populated");
		assert.deepEqual(oVHRView.byId("idEntity").getModel(), undefined, "then value help entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of value help is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [], "then value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel(), undefined, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When entity set is changed", function(assert) {
		//arrangement
		var oModelForVHRSelect = {
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
		oVHRView.byId("idEntity").setSelectedKey("entitySet2");
		oVHRView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfValueHelp.calledWith("entitySet2"), true, "then setEntitySetOfValueHelp is called the facet filter object");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), "entitySet2", "then entity set of value help is changed");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "entitySet2", "then value help entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of value help is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of value help is removed");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [], "then value help selected properties field are populated");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then value help selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet2"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When select property is changed", function(assert) {
		//action
		oVHRView.byId("idSelectProperties").setSelectedKeys([ "property1", "property4" ]);
		oVHRView.getController().handleChangeForSelectProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oVHRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of value help is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of value help is removed");
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		assert.strictEqual(spyOnAddSelectPropForValueHelp.calledWith("property4"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [ "property1", "property4" ], "then select properties of value help is changed");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property4" ], "then value help selected properties field are populated");
	});
	QUnit.test("When facet filter VHR is cleared", function(assert) {
		//action
		oVHRView.getController().clearVHRFields();
		//assert
		assert.strictEqual(oVHRView.getViewData().oParentObject.getServiceOfValueHelp(), undefined, "then value help source is cleared");
		assert.strictEqual(oVHRView.byId("idSource").getValue(), "", "then value help source field is cleared");
		assert.strictEqual(oVHRView.getViewData().oParentObject.getEntitySetOfValueHelp(), undefined, "then value help entity set is cleared");
		assert.strictEqual(oVHRView.byId("idEntity").getSelectedKey(), "", "then value help entity field is cleared");
		assert.deepEqual(oVHRView.getViewData().oParentObject.getSelectPropertiesOfValueHelp(), [], "then value help select properties are cleared");
		assert.deepEqual(oVHRView.byId("idSelectProperties").getSelectedKeys(), [], "then value help select properties field is cleared");
		assert.strictEqual(oVHRView.getController().byId("idEntityLabel").getRequired(), true, "then value help entity label field is still set to required");
		assert.strictEqual(oVHRView.getController().byId("idSelectPropertiesLabel").getRequired(), true, "then value help select properties label field is still set to required");
		assert.strictEqual(oVHRView.getController().byId("idSourceLabel").getRequired(), true, "then value help service label field is still set to required");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oVHRView.getController().getValidationState(), true, "then VHR view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oVHRView.byId("idSelectProperties").setSelectedKeys([]);
		//assert
		assert.strictEqual(oVHRView.getController().getValidationState(), false, "then VHR view is not in valid state");
	});
}());
