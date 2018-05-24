/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tFacetFilterFRR');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
(function() {
	'use strict';
	var oFRRView, spyOnAutoComplete, spyOnGetServiceOfFilterResolution, spyOnGetAllPropertiesOfEntitySet, spyOnGetEntitySetOfFilterResolution, spyOnGetAllEntitySetsOfService, spyOnGetSelectPropOfFilterResolution, spyOnConfigEditorRegisterService, spyOnSetServiceOfFilterResolution, spyOnSetEntitySetOfFilterResolution, spyOnAddSelectPropertyOfFilterResolution, spyOnConfigEditorSetIsUnsaved, spyOnRemoveSelectPropForValueHelp, oModelerInstance;
	function doNothing() {
		return "";
	}
	QUnit.module("For a facet filter with existing FRR", {
		beforeEach : function(assert) {
			var oTextPool, oTextPoolHelper;
			var oFRRController = new sap.ui.controller("sap.apf.modeler.ui.controller.facetFilterFRR");
			var spyOnInit = sinon.spy(oFRRController, "onInit");
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
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
				spyOnGetServiceOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "getServiceOfFilterResolution");
				spyOnGetEntitySetOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "getEntitySetOfFilterResolution");
				spyOnGetSelectPropOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "getSelectPropertiesOfFilterResolution");
				spyOnSetServiceOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "setServiceOfFilterResolution");
				spyOnSetEntitySetOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "setEntitySetOfFilterResolution");
				spyOnAddSelectPropertyOfFilterResolution = sinon.spy(oModelerInstance.facetFilterUnsaved, "addSelectPropertyOfFilterResolution");
				spyOnRemoveSelectPropForValueHelp = sinon.spy(oModelerInstance.facetFilterUnsaved, "removeSelectPropertyOfFilterResolution");
				oModelerInstance.facetFilterUnsaved.setUseSameRequestForValueHelpAndFilterResolution(false);
				oFRRView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.requestOptions",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : oFRRController,
					viewData : {
						oConfigurationHandler : oModelerInstance.configurationHandler,
						oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
						oTextReader : oModelerInstance.modelerCore.getText,
						oParentObject : oModelerInstance.facetFilterUnsaved,
						getCalatogServiceUri : doNothing
					}
				});
				assert.strictEqual(spyOnInit.calledOnce, true, "then request options onInit function is called and view is initialized");
				done();
			});
		},
		afterEach : function() {
			sap.apf.modeler.ui.utils.TextPoolHelper.restore();
			oFRRView.getViewData().oConfigurationEditor.setIsUnsaved.restore();
			oFRRView.getViewData().oConfigurationEditor.registerService.restore();
			oFRRView.getViewData().oConfigurationEditor.getAllPropertiesOfEntitySet.restore();
			oFRRView.getViewData().oConfigurationEditor.getAllEntitySetsOfService.restore();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oModelerInstance.reset();
			oFRRView.destroy();
		}
	});
	QUnit.test("When FRR view is initialized", function(assert) {
		//arrange
		var oViewData = oFRRView.getViewData();
		var oController = oFRRView.getController();
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
		assert.ok(oFRRView, "then FRR view is available");
		// auto Complete enabled asserts
		assert.strictEqual(spyOnAutoComplete.calledOnce, true, "then autocomplete function is called");
		assert.strictEqual(spyOnAutoComplete.calledWith(oFRRView.byId("idSource"), oDependenciesForService), true, "then autocomplete is enabled on field source");
		// source section asserts
		assert.strictEqual(spyOnGetServiceOfFilterResolution.calledOnce, true, "then filter resolution entity set is got from the facet filter object");
		assert.ok(oController.byId("idSourceLabel").getText(), "then filter resolution source label is populated");
		assert.strictEqual(oController.byId("idSource").getValue(), "testService1", "then filter resolution source field is populated");
		// entity section asserts
		assert.strictEqual(spyOnGetEntitySetOfFilterResolution.calledOnce, true, "then filter resolution entity set is got from the facet filter object");
		assert.ok(oController.byId("idEntityLabel").getText(), "then filter resolution entity label is populated");
		assert.strictEqual(oController.byId("idEntityLabel").getRequired(), true, "then filter resolution entity label field is set as required");
		assert.strictEqual(oController.byId("idEntity").getSelectedKey(), "entitySet1", "then filter resolution entity field is populated");
		assert.deepEqual(oController.byId("idEntity").getModel().getData(), oModelForVHREntity, "then filter resolution entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledOnce, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(oFRRView.byId("idSource").getValue()), true, "then entity sets are fetched for the correct service");
		// select property section asserts
		assert.strictEqual(spyOnGetSelectPropOfFilterResolution.calledOnce, true, "then filter resolution select properties are got from the facet filter object");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getText(), oViewData.oTextReader("vhSelectProperties"), "then filter resolution select properties label is populated");
		assert.strictEqual(oController.byId("idSelectPropertiesLabel").getRequired(), true, "then filter resolution select properties label field is set as required");
		assert.deepEqual(oController.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then filter resolution selected properties field are populated");
		assert.deepEqual(oController.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then filter resolution selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledOnce, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith(oFRRView.byId("idSource").getValue(), oController.byId("idEntity").getSelectedKey()), true, "then all selected properties are fetched for the correct service and entity");
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
		oFRRView.byId("idSource").setValue("testService3");
		oFRRView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("testService3"), true, "then filter resolution service is checked for registration");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.registerService("testService3"), true, "then filter resolution service is valid service");
		assert.strictEqual(spyOnSetServiceOfFilterResolution.calledWith("testService3"), true, "then setServiceOfFilterResolution is called on facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), "testService3", "then service of filter resolution is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith("entitySet9"), true, "then setEntitySetOfFilterResolution is called the facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "entitySet9", "then entity set of filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "entitySet9", "then filter resolution entity field is populated");
		assert.deepEqual(oFRRView.byId("idEntity").getModel().getData(), oModelForVHREntity, "then filter resolution entity field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.called, true, "then all entity sets are fetched for the service");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith("testService3"), true, "then entity sets are fetched for the correct service");
		//for select properties
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1" ], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "property1" ], "then filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then filter resolution selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService3", "entitySet9"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		oFRRView.byId("idSource").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = oFRRView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(oSelectDialog.getTitle(), "Select Service", "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When source is cleared", function(assert) {
		//action
		oFRRView.byId("idSource").setValue("");
		oFRRView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith(""), false, "then empty filter resolution service is not checked for registration");
		assert.strictEqual(spyOnSetServiceOfFilterResolution.calledWith(undefined), true, "then setServiceOfFilterResolution is called on facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), undefined, "then service of filter resolution is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith(undefined), true, "then setEntitySetOfFilterResolution is called the facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "", "then entity set of filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "", "then filter resolution entity set field is populated");
		assert.strictEqual(oFRRView.getController().byId("idEntityLabel").getRequired(), false, "then filter resolution entity label field is set as not required");
		assert.deepEqual(oFRRView.byId("idEntity").getModel(), undefined, "then filter resolution entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [], "then filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel(), undefined, "then filter resolution selected properties field model is set");
		assert.strictEqual(oFRRView.getController().byId("idSelectPropertiesLabel").getRequired(), false, "then filter resolution select properties label field is set as not required");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("", ""), false, "then all selected properties are not fetched for the empty service and entity");
	});
	QUnit.test("When source is changed to an invalid service", function(assert) {
		//action
		oFRRView.byId("idSource").setValue("test1");
		oFRRView.getController().handleChangeForSource();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for source
		assert.strictEqual(spyOnConfigEditorRegisterService.calledWith("test1"), true, "then filter resolution service is checked for registration");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.registerService("test11"), undefined, "then filter resolution service is an invalid service");
		assert.strictEqual(spyOnSetServiceOfFilterResolution.calledWith(undefined), true, "then setServiceOfFilterResolution is called on facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), undefined, "then service of filter resolution is changed");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith(undefined), true, "then setEntitySetOfFilterResolution is called the facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "", "then entity set of filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "", "then filter resolution entity set field is populated");
		assert.strictEqual(oFRRView.getController().byId("idEntityLabel").getRequired(), false, "then filter resolution entity label field is set as not required");
		assert.deepEqual(oFRRView.byId("idEntity").getModel(), undefined, "then filter resolution entity set field model is set");
		assert.strictEqual(spyOnGetAllEntitySetsOfService.calledWith(""), false, "then entity sets are not fetched for the empty service");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [], "then filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel(), undefined, "then filter resolution selected properties field model is set");
		assert.strictEqual(oFRRView.getController().byId("idSelectPropertiesLabel").getRequired(), false, "then filter resolution select properties label field is set as not required");
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
		oFRRView.byId("idEntity").setSelectedKey("entitySet2");
		oFRRView.getController().handleChangeForEntity();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for entity set
		assert.strictEqual(spyOnSetEntitySetOfFilterResolution.calledWith("entitySet2"), true, "then setEntitySetOfFilterResolution is called the facet filter object");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), "entitySet2", "then entity set of filter resolution is changed");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "entitySet2", "then filter resolution entity field is populated");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [], "then filter resolution selected properties field are populated");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getModel().getData(), oModelForVHRSelect, "then filter resolution selected properties field model is set");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.called, true, "then all selectable properties are fetched for the service and entity");
		assert.strictEqual(spyOnGetAllPropertiesOfEntitySet.calledWith("testService1", "entitySet2"), true, "then all selected properties are fetched for the correct service and entity");
	});
	QUnit.test("When select property is changed", function(assert) {
		//action
		oFRRView.byId("idSelectProperties").setSelectedKeys([ "property1", "property4" ]);
		oFRRView.getController().handleChangeForSelectProperty();
		//assert
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oFRRView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
		//for select properties
		assert.strictEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property1"), true, "then exisiting select property of filter resolution is removed");
		assert.deepEqual(spyOnRemoveSelectPropForValueHelp.calledWith("property3"), true, "then exisiting select property of filter resolution is removed");
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property1"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		assert.strictEqual(spyOnAddSelectPropertyOfFilterResolution.calledWith("property4"), true, "then addSelectPropertiesOfValueHelp is called the facet filter object");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [ "property1", "property4" ], "then select properties of filter resolution is changed");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property4" ], "then filter resolution selected properties field are populated");
	});
	QUnit.test("When facet filter is set to invisible", function(assert) {
		//arrangement
		oFRRView.getViewData().oParentObject.setInvisible();
		//action
		oFRRView.getController().clearFRRFields();
		//assert
		assert.strictEqual(oFRRView.getViewData().oParentObject.getServiceOfFilterResolution(), undefined, "then filter resolution source is cleared");
		assert.strictEqual(oFRRView.byId("idSource").getValue(), "", "then filter resolution source field is cleared");
		assert.strictEqual(oFRRView.getViewData().oParentObject.getEntitySetOfFilterResolution(), undefined, "then filter resolution entity set is cleared");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "", "then filter resolution entity field is cleared");
		assert.deepEqual(oFRRView.getViewData().oParentObject.getSelectPropertiesOfFilterResolution(), [], "then filter resolution select properties are cleared");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [], "then filter resolution select properties field is cleared");
		//cleanup
		oFRRView.getViewData().oParentObject.setVisible();
	});
	QUnit.test("When facet filter is set to use same as VHR", function(assert) {
		//arrangement
		oFRRView.getViewData().oParentObject.setUseSameRequestForValueHelpAndFilterResolution(true);
		//action
		oFRRView.getController().handleCopy();
		//assert
		assert.strictEqual(oFRRView.byId("idSource").getValue(), "testService1", "then filter resolution source field is set");
		assert.strictEqual(oFRRView.byId("idEntity").getSelectedKey(), "entitySet1", "then filter resolution entity field is set");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getSelectedKeys(), [ "property1", "property3" ], "then filter resolution select properties field is set");
	});
	QUnit.test("When facet filter is set to use same as VHR", function(assert) {
		//arrangement
		oFRRView.getViewData().oParentObject.setUseSameRequestForValueHelpAndFilterResolution(true);
		//action
		oFRRView.getController().enableOrDisableView();
		//assert
		assert.strictEqual(oFRRView.byId("idSource").getEnabled(), false, "then filter resolution source field is not enabled");
		assert.strictEqual(oFRRView.byId("idEntity").getEnabled(), false, "then filter resolution entity field is not enabled");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getEnabled(), false, "then filter resolution select properties field is not enabled");
	});
	QUnit.test("When facet filter is set to use same as VHR", function(assert) {
		//action
		oFRRView.getController().enableOrDisableView();
		//assert
		assert.strictEqual(oFRRView.byId("idSource").getEnabled(), true, "then filter resolution source field is enabled");
		assert.strictEqual(oFRRView.byId("idEntity").getEnabled(), true, "then filter resolution entity field is enabled");
		assert.deepEqual(oFRRView.byId("idSelectProperties").getEnabled(), true, "then filter resolution select properties field is enabled");
	});
	QUnit.test("Fetching validation state while view is valid", function(assert) {
		//assert
		assert.strictEqual(oFRRView.getController().getValidationState(), true, "then FRR view is in valid state");
	});
	QUnit.test("Fetching validation state while view is not valid", function(assert) {
		//action
		oFRRView.byId("idSelectProperties").setSelectedKeys([]);
		//assert
		assert.strictEqual(oFRRView.getController().getValidationState(), false, "then FRR view is not in valid state");
	});
}());
