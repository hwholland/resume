/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2016 SAP AG. All rights reserved
*/
jQuery.sap.declare('sap.apf.modeler.ui.tConfiguration');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
(function() {
	'use strict';
	var oModelerInstance, oConfigurationView, oTextPool, oTextPoolHelper, spyOnConfigEditorSetIsUnsaved, spyOnGetFilterOption, spyOnSetFilterOption, spyOnIsDataLostOnFilterOptionChange;
	var spyOnGetConfiguration, spyOnGetCategories, spyOnGetSteps;
	function _doNothing() {
	}
	function _instantiateView(oModelerInstance, sId, assert, configurationEditor) {
		var oConfigurationController = sap.ui.controller("sap.apf.modeler.ui.controller.configuration");
		var onInitSpy = sinon.spy(oConfigurationController, "onInit");
		var setDetailDataSpy = sinon.spy(oConfigurationController, "setDetailData");
		var getApplicationSpy = sinon.spy(oModelerInstance.applicationHandler, "getApplication");
		if (configurationEditor) {
			spyOnConfigEditorSetIsUnsaved = sinon.spy(configurationEditor, "setIsUnsaved");
			spyOnGetCategories = sinon.spy(configurationEditor, "getCategories");
			spyOnGetSteps = sinon.spy(configurationEditor, "getSteps");
			spyOnGetFilterOption = sinon.spy(configurationEditor, "getFilterOption");
			spyOnSetFilterOption = sinon.spy(configurationEditor, "setFilterOption");
			spyOnIsDataLostOnFilterOptionChange = sinon.spy(configurationEditor, "isDataLostByFilterOptionChange");
		}
		var oView = sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.configuration",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oConfigurationController,
			viewData : {
				updateSelectedNode : oModelerInstance.updateSelectedNode,
				updateConfigTree : oModelerInstance.updateConfigTree,
				updateTitleAndBreadCrumb : oModelerInstance.updateTitleAndBreadCrumb,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oApplicationHandler : oModelerInstance.applicationHandler,
				oConfigurationEditor : configurationEditor,
				getText : oModelerInstance.modelerCore.getText,
				updateTree : _doNothing,
				oParams : {
					name : "configuration",
					arguments : {
						appId : oModelerInstance.applicationCreatedForTest,
						configId : sId
					}
				}
			}
		});
		assert.strictEqual(onInitSpy.calledOnce, true, "then configuration's onInit function is called and view is initialized");
		assert.strictEqual(setDetailDataSpy.calledOnce, true, "then configuration's setDetailData function is called");
		assert.strictEqual(getApplicationSpy.calledOnce, true, "then getApplication is called");
		assert.strictEqual(getApplicationSpy.calledWith(oModelerInstance.applicationCreatedForTest), true, "then getApplication is called with the input '" + oModelerInstance.applicationCreatedForTest + "'");
		getApplicationSpy.restore();
		setDetailDataSpy.restore();
		onInitSpy.restore();
		return oView;
	}
	function _pressButtonOnFilterOptionChangeDialog(assert, buttonNumber, continuation) {
		var filterOptionChangeDialog = sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons");
		filterOptionChangeDialog.getButtons()[buttonNumber].firePress();
		assert.strictEqual(sap.ui.getCore().byId("idFilterOptionChangeFragment--idDialogWithTwoButtons"), undefined, "then filter option dialog is destroyed");
		continuation();
	}
	function _destroyResources(oConfigEditor) {
		if (oConfigEditor) {
			spyOnConfigEditorSetIsUnsaved.restore();
			spyOnGetCategories.restore();
			spyOnGetSteps.restore();
			spyOnGetFilterOption.restore();
			spyOnSetFilterOption.restore();
			spyOnIsDataLostOnFilterOptionChange.restore();
		}
		sap.apf.modeler.ui.utils.TextPoolHelper.restore();
		spyOnGetConfiguration.restore();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oConfigurationView.destroy();
	}
	QUnit.module("Configuration Unit Tests - New configuration", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				oTextPool = oModelerInstance.configurationHandler.getTextPool();
				oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(oTextPool);
				sinon.stub(sap.apf.modeler.ui.utils, "TextPoolHelper", function() {
					return oTextPoolHelper;
				});
				spyOnGetConfiguration = sinon.spy(oModelerInstance.configurationHandler, "getConfiguration");
				oConfigurationView = _instantiateView(oModelerInstance, oModelerInstance.newConfigId, assert, undefined);
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			_destroyResources();
		}
	});
	QUnit.test("When configuration page is initialised", function(assert) {
		//arrange
		var divToPlaceConfiguration = document.createElement("div");
		divToPlaceConfiguration.setAttribute('id', 'contentOfConfiguration');
		document.body.appendChild(divToPlaceConfiguration);
		oConfigurationView.placeAt("contentOfConfiguration");
		sap.ui.getCore().applyChanges();
		var focusedElement = document.activeElement;
		// assert
		assert.strictEqual(oConfigurationView.byId("idConfigTitle").sId, focusedElement.parentElement.id, "Since the configuration is " + "new so configuration title has focus on it ");
		assert.strictEqual(oConfigurationView.byId("idConfigTitle").getValue(), "", "Configuration title is not set for new configuration");
		assert.strictEqual(oConfigurationView.byId("idConfigurationId").getValue(), "", "Configuration ID is not set for new configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfCategories").getValue(), "", "Number of categories is not set for new configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfSteps").getValue(), "", "Number of steps is not set for new configuration");
		assert.strictEqual(oConfigurationView.byId("idSemanticObject").getValue(), oModelerInstance.appA.SemanticObject, "Semantic object is set");
		assert.strictEqual(oConfigurationView.getController().getValidationState(), false, "then configuration is not in valid state");
		assert.strictEqual(spyOnGetConfiguration.calledWith(oModelerInstance.newConfigId), true, "then the configuration is called with the new configuration Id");
		assert.strictEqual(spyOnGetConfiguration.calledOnce, true, "then the configuration retrieval is called once");
		assert.strictEqual(oConfigurationView.byId("idFilterTypeRadioGroup").getEnabled(), false, "then the filter type radio group is disabled");
		//cleanup
		document.body.removeChild(document.getElementById('contentOfConfiguration'));
	});
	QUnit.test("When adding configuration title", function(assert) {
		// arrange
		var sConfigTitle = "test new configuration";
		oConfigurationView.byId("idConfigTitle").setValue(sConfigTitle);
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(oConfigurationView.getViewData(), "updateTitleAndBreadCrumb");
		var spyOnUpdateSelectedNode = sinon.spy(oConfigurationView.getViewData(), "updateSelectedNode");
		var spyOnSetTextOfTextPool = sinon.spy(oTextPool, "setText");
		var expectedContext = {
			appId : oModelerInstance.applicationCreatedForTest
		};
		var expectedConfigInfo = {
			name : sConfigTitle
		};
		// act
		oConfigurationView.getController().handleChangeDetailValue();
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, true, "then the title and breadcrumb is called once");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWithMatch(sConfigTitle), true, "then the title and breadcrumb is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWithMatch(expectedConfigInfo, expectedContext), true, "then the configuration node is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, true, "then the configuration node is called once");
		// assertions on UI
		assert.strictEqual(oConfigurationView.byId("idConfigurationId").getValue(), "", "Configuration ID is not set for new configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfCategories").getValue(), "", "Number of categories are zero set for new configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfSteps").getValue(), "", "Number of steps are zero for new configuration");
		// cleanups
		spyOnUpdateTitleAndBreadCrumb.restore();
		spyOnUpdateSelectedNode.restore();
		spyOnSetTextOfTextPool.restore();
	});
	QUnit.test("When configuration page is in valid state", function(assert) {
		// arrange
		oConfigurationView.byId("idConfigTitle").setValue("test new configuration");
		//assert
		assert.strictEqual(oConfigurationView.getController().getValidationState(), true, "then configuration is in valid state");
	});
	QUnit.module("Configuration Unit Tests - Unsaved existing configuration", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				oTextPool = oModelerInstance.configurationHandler.getTextPool();
				oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(oTextPool);
				sinon.stub(sap.apf.modeler.ui.utils, "TextPoolHelper", function() {
					return oTextPoolHelper;
				});
				spyOnGetConfiguration = sinon.spy(oModelerInstance.configurationHandler, "getConfiguration");
				oConfigurationView = _instantiateView(oModelerInstance, oModelerInstance.tempUnsavedConfigId, assert, oModelerInstance.configurationEditorForUnsavedConfig);
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			_destroyResources(oModelerInstance.configurationEditorForUnsavedConfig);
		}
	});
	QUnit.test("When configuration page is initialised ", function(assert) {
		// assert
		assert.strictEqual(oConfigurationView.byId("idConfigTitle").getValue(), "test config A", "Configuration title is set for existing configuration");
		assert.strictEqual(oConfigurationView.byId("idConfigurationId").getValue(), "", "Configuration ID is set for existing configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfCategories").getValue(), "2", "Number of categories is set for existing configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfSteps").getValue(), "2", "Number of steps is not set for new configuration");
		assert.strictEqual(oConfigurationView.byId("idSemanticObject").getValue(), oModelerInstance.appA.SemanticObject, "Semantic object is set");
		assert.strictEqual(oConfigurationView.byId("idFilterTypeRadioGroup").getEnabled(), true, "then the filter type radio group is enabled");
		assert.strictEqual(oConfigurationView.byId("idFilterTypeRadioGroup").getSelectedButton().getCustomData()[0].getValue(), "facetFilter", "then the filter type is facet filter");
		assert.strictEqual(oConfigurationView.getController().getValidationState(), true, "then configuration is in valid state");
		assert.strictEqual(spyOnGetConfiguration.calledWith(oModelerInstance.tempUnsavedConfigId), true, "then the configuration is called with the correct config Id");
		assert.strictEqual(spyOnGetConfiguration.calledOnce, true, "then the configuration retrieval is called once");
		assert.strictEqual(spyOnGetConfiguration.returnValues.length, 1, "then the configuration is loaded");
		assert.strictEqual(spyOnGetCategories.calledOnce, true, "then the categories are fetched");
		assert.strictEqual(spyOnGetSteps.calledOnce, true, "then the steps are fetched");
		assert.strictEqual(spyOnGetFilterOption.calledOnce, true, "then the filter option is fetched");
	});
	QUnit.test("When changing configuration title", function(assert) {
		// arrange
		var sConfigTitle = "test edit configuration";
		oConfigurationView.byId("idConfigTitle").setValue(sConfigTitle);
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(oConfigurationView.getViewData(), "updateTitleAndBreadCrumb");
		var spyOnUpdateSelectedNode = sinon.spy(oConfigurationView.getViewData(), "updateSelectedNode");
		var spyOnSetTextOfTextPool = sinon.spy(oTextPool, "setText");
		var expectedConfigInfo = {
			name : sConfigTitle
		};
		// act
		oConfigurationView.getController().handleChangeDetailValue();
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, true, "then the title and breadcrumb is called once");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWithMatch(sConfigTitle), true, "then the title and breadcrumb is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWithMatch(expectedConfigInfo), true, "then the configuration node is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, true, "then the configuration node is called once");
		// assertions on UI
		assert.strictEqual(oConfigurationView.byId("idConfigurationId").getValue(), "", "Configuration ID is not set for configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfCategories").getValue(), "2", "Number of categories are available for configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfSteps").getValue(), "2", "Number of steps are available for configuration");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration's editor is set to unsaved");
		// cleanups
		spyOnUpdateTitleAndBreadCrumb.restore();
		spyOnUpdateSelectedNode.restore();
		spyOnSetTextOfTextPool.restore();
	});
	QUnit.test("When clearing configuration title", function(assert) {
		// arrange
		var sConfigTitle = "";
		oConfigurationView.byId("idConfigTitle").setValue(sConfigTitle);
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(oConfigurationView.getViewData(), "updateTitleAndBreadCrumb");
		var spyOnUpdateSelectedNode = sinon.spy(oConfigurationView.getViewData(), "updateSelectedNode");
		var spyOnSetTextOfTextPool = sinon.spy(oTextPool, "setText");
		var expectedConfigInfo = {
			name : sConfigTitle
		};
		// act
		oConfigurationView.getController().handleChangeDetailValue();
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, false, "then the title and breadcrumb is not called once");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWithMatch(sConfigTitle), false, "then the title and breadcrumb is not updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWithMatch(expectedConfigInfo), false, "then the configuration node is not updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, false, "then the configuration node is not called once");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration's editor is set to unsaved");
		// assertions on UI
		assert.strictEqual(oConfigurationView.byId("idConfigurationId").getValue(), "", "Configuration ID is not set for configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfCategories").getValue(), "2", "Number of categories are available for configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfSteps").getValue(), "2", "Number of steps are available for configuration");
		// cleanups
		spyOnUpdateTitleAndBreadCrumb.restore();
		spyOnUpdateSelectedNode.restore();
		spyOnSetTextOfTextPool.restore();
	});
	QUnit.test("When changing filter option type to smart filter and press Continue in the filter option change dialog", function(assert) {
		// arrange
		oConfigurationView.byId("idFilterTypeRadioGroup").setSelectedButton(oConfigurationView.byId("smartFilterBar"));
		// act
		oConfigurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		// act on dialog
		_pressButtonOnFilterOptionChangeDialog(assert, 0, function() {
			assert.strictEqual(spyOnSetFilterOption.calledOnce, true, "then setFilterOption is called once");
			assert.strictEqual(spyOnSetFilterOption.calledWith({
				smartFilterBar : true
			}), true, "then setFilterOption is called with smartFilterBar");
			assert.strictEqual(oConfigurationView.getViewData().oConfigurationEditor.getFacetFilters().length, 0, "then no facet filters are available");
			assert.ok(oConfigurationView.getViewData().oConfigurationEditor.getSmartFilterBar(), "then smart filter bar is available");
		});
	});
	QUnit.test("When changing filter option type to smart filter and press Cancel in the filter option change dialog", function(assert) {
		// arrange
		oConfigurationView.byId("idFilterTypeRadioGroup").setSelectedButton(oConfigurationView.byId("smartFilterBar"));
		// act
		oConfigurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		// act on dialog
		_pressButtonOnFilterOptionChangeDialog(assert, 1, function() {
			assert.strictEqual(spyOnSetFilterOption.calledOnce, false, "then setFilterOption is not called once");
			assert.strictEqual(spyOnSetFilterOption.calledWith({
				smartFilterBar : true
			}), false, "then setFilterOption is not called with smartFilterBar");
			assert.ok(oConfigurationView.getViewData().oConfigurationEditor.getFacetFilters().length, "then facet filters are available since switch did not occur");
		});
	});
	QUnit.test("When changing filter option type to none and press Continue in the filter option change dialog", function(assert) {
		// arrange
		oConfigurationView.byId("idFilterTypeRadioGroup").setSelectedButton(oConfigurationView.byId("none"));
		// act
		oConfigurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		// act on dialog
		_pressButtonOnFilterOptionChangeDialog(assert, 0, function() {
			assert.strictEqual(spyOnSetFilterOption.calledOnce, true, "then setFilterOption is called once");
			assert.strictEqual(spyOnSetFilterOption.calledWith({
				none : true
			}), true, "then setFilterOption is called with none");
			assert.strictEqual(oConfigurationView.getViewData().oConfigurationEditor.getFacetFilters().length, 0, "then no facet filters are available");
		});
	});
	QUnit.test("When changing filter option type to smart filter and press Cancel in the filter option change dialog", function(assert) {
		// arrange
		oConfigurationView.byId("idFilterTypeRadioGroup").setSelectedButton(oConfigurationView.byId("none"));
		// act
		oConfigurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").isOpen(), true, "then filter option change dialog is open");
		// act on dialog
		_pressButtonOnFilterOptionChangeDialog(assert, 1, function() {
			assert.strictEqual(spyOnSetFilterOption.calledOnce, false, "then setFilterOption is not called once");
			assert.strictEqual(spyOnSetFilterOption.calledWith({
				none : true
			}), false, "then setFilterOption is not called with none");
			assert.ok(oConfigurationView.getViewData().oConfigurationEditor.getFacetFilters().length, "then facet filters are available since switch did not occur");
		});
	});
	QUnit.module("Configuration Unit Tests - Saved configuration", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				oTextPool = oModelerInstance.configurationHandler.getTextPool();
				oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(oTextPool);
				sinon.stub(sap.apf.modeler.ui.utils, "TextPoolHelper", function() {
					return oTextPoolHelper;
				});
				spyOnGetConfiguration = sinon.spy(oModelerInstance.configurationHandler, "getConfiguration");
				oConfigurationView = _instantiateView(oModelerInstance, oModelerInstance.configIdSaved, assert, oModelerInstance.configurationEditorForSavedConfig);
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			_destroyResources(oModelerInstance.configurationEditorForSavedConfig);
		}
	});
	QUnit.test("When configuration page is initialised ", function(assert) {
		//arrange
		var divToPlaceConfiguration = document.createElement("div");
		divToPlaceConfiguration.setAttribute('id', 'contentOfConfiguration');
		document.body.appendChild(divToPlaceConfiguration);
		oConfigurationView.placeAt("contentOfConfiguration");
		sap.ui.getCore().applyChanges();
		var focusedElement = document.activeElement;
		// assert
		assert.deepEqual(document.body, focusedElement, "Since the configuration is already saved " + "so body has focus on it instead configuration title");
		assert.strictEqual(oConfigurationView.byId("idConfigTitle").getValue(), "test config B", "Configuration title is set for existing configuration");
		assert.strictEqual(oConfigurationView.byId("idConfigurationId").getValue(), oModelerInstance.configIdSaved, "Configuration ID not set for existing configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfCategories").getValue(), "0", "Number of categories are not available for existing configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfSteps").getValue(), "0", "Number of steps are not available for new configuration");
		assert.strictEqual(oConfigurationView.byId("idSemanticObject").getValue(), oModelerInstance.appA.SemanticObject, "Semantic object is set");
		assert.strictEqual(oConfigurationView.byId("idFilterTypeRadioGroup").getEnabled(), true, "then the filter type radio group is enabled");
		assert.strictEqual(oConfigurationView.byId("idFilterTypeRadioGroup").getSelectedButton().getCustomData()[0].getValue(), "smartFilterBar", "then the filter type is smart filter");
		assert.strictEqual(oConfigurationView.getController().getValidationState(), true, "then configuration is in valid state");
		assert.strictEqual(spyOnGetConfiguration.calledWith(oModelerInstance.configIdSaved), true, "then the configuration is called with the correct config Id");
		assert.strictEqual(spyOnGetConfiguration.calledOnce, true, "then the configuration retrieval is called once");
		assert.strictEqual(spyOnGetConfiguration.returnValues.length, 1, "then the configuration is loaded");
		assert.strictEqual(spyOnGetCategories.calledOnce, true, "then the categories are fetched");
		assert.strictEqual(spyOnGetSteps.calledOnce, true, "then the steps are fetched");
		assert.strictEqual(spyOnGetFilterOption.calledOnce, true, "then the filter option is fetched");
		document.body.removeChild(document.getElementById('contentOfConfiguration'));
	});
	QUnit.test("When changing configuration title", function(assert) {
		// arrange
		var sConfigTitle = "test edit configuration";
		oConfigurationView.byId("idConfigTitle").setValue(sConfigTitle);
		var spyOnUpdateTitleAndBreadCrumb = sinon.spy(oConfigurationView.getViewData(), "updateTitleAndBreadCrumb");
		var spyOnUpdateSelectedNode = sinon.spy(oConfigurationView.getViewData(), "updateSelectedNode");
		var spyOnSetTextOfTextPool = sinon.spy(oTextPool, "setText");
		var expectedConfigInfo = {
			name : sConfigTitle
		};
		// act
		oConfigurationView.getController().handleChangeDetailValue();
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledOnce, true, "then the title and breadcrumb is called once");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWithMatch(sConfigTitle), true, "then the title and breadcrumb is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWithMatch(expectedConfigInfo), true, "then the configuration node is updated with the config title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledOnce, true, "then the configuration node is called once");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration's editor is set to unsaved");
		// assertions on UI
		assert.strictEqual(oConfigurationView.byId("idConfigurationId").getValue(), oModelerInstance.configIdSaved, "Configuration ID is available for configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfCategories").getValue(), "0", "Number of categories are not available for configuration");
		assert.strictEqual(oConfigurationView.byId("idNoOfSteps").getValue(), "0", "Number of steps are not available for configuration");
		// cleanups
		spyOnUpdateTitleAndBreadCrumb.restore();
		spyOnUpdateSelectedNode.restore();
		spyOnSetTextOfTextPool.restore();
	});
	QUnit.test("When changing filter option type to none and there is no data lost", function(assert) {
		// arrange
		oConfigurationView.byId("idFilterTypeRadioGroup").setSelectedButton(oConfigurationView.byId("none"));
		// act
		oConfigurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(spyOnSetFilterOption.calledOnce, true, "then setFilterOption is called once");
		assert.strictEqual(spyOnSetFilterOption.calledWith({
			none : true
		}), true, "then setFilterOption is called with none");
	});
	QUnit.test("When changing filter option type to facetFilter and there is no data lost", function(assert) {
		// arrange
		oConfigurationView.byId("idFilterTypeRadioGroup").setSelectedButton(oConfigurationView.byId("facetFilter"));
		// act
		oConfigurationView.getController().handleChangeForFilterType();
		// assert
		assert.strictEqual(spyOnIsDataLostOnFilterOptionChange.calledOnce, true, "then isDataLostOnFilterOptionChange is called once");
		assert.strictEqual(spyOnSetFilterOption.calledOnce, true, "then setFilterOption is called once");
		assert.strictEqual(spyOnSetFilterOption.calledWith({
			facetFilter : true
		}), true, "then setFilterOption is called with facetFilter");
	});
}());