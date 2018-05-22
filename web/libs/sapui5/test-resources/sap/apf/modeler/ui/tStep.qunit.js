jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	function doNothing() {
		return "";
	}
	QUnit.module("Step Unit Tests - Existing step without filter mapping", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				that.oModelerInstance = oModelerInstance;
				that.stepView = sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.step",
					type : "XML",
					viewData : {
						updateConfigTree : that.oModelerInstance.updateConfigTree,
						updateSelectedNode : that.oModelerInstance.updateSelectedNode,
						updateTree : that.oModelerInstance.updateTree,
						updateTitleAndBreadCrumb : that.oModelerInstance.updateTitleAndBreadCrumb,
						oConfigurationHandler : that.oModelerInstance.configurationHandler,
						oApplicationHandler : that.oModelerInstance.applicationHandler,
						oConfigurationEditor : that.oModelerInstance.configurationEditorForUnsavedConfig,
						getText : that.oModelerInstance.modelerCore.getText,
						getNavigationTargetName : that.oModelerInstance.getNavigationTargetName,
						oParams : {
							name : "step",
							arguments : {
								configId : that.oModelerInstance.tempUnsavedConfigId,
								categoryId : that.oModelerInstance.categoryIdUnsaved,
								stepId : that.oModelerInstance.stepIdUnsavedWithoutFilterMapping
							}
						}
					}
				});
				that.stepController = that.stepView.getController();
				//Top N setting is done on the setup
				that.stepController.step.setTopNValue(100);
				that.stepController.step.setTopNSortProperties([ {
					property : "property2",
					ascending : true
				} ]);
				that.stepController._setSortDataForStep();
				that.sortDataItems = that.stepView.byId("idStepSortLayout").getItems();
				that.oSortDataPropertyEvent = { //event stub for the add/delete sort property row in the step
					getSource : function() {
						var selectedItem = {};
						selectedItem.getBindingContext = function() {
							var obj = {};
							obj.getObject = function() {
								return {
									aAllProperties : [ {
										sAggregationRole : "dimension",
										sDefaultLable : "dimensionproperty1",
										sLabel : "Label",
										sName : "property1"
									} ]
								};
							};
							obj.getPath = function() {
								return "/aSortRows/0";
							};
							obj.getProperty = function() {
								return "property1";
							};
							return obj;
						};
						selectedItem.getSelectedKey = function() {
							return "property1";
						};
						selectedItem.getParent = function() {
							return this.sortDataItems[0];
						};
						return selectedItem;
					}
				};
				done();
			});
		},
		afterEach : function() {
			this.oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			this.stepView.destroy();
		}
	});
	QUnit.test("Test availability of step view and controller", function(assert) {
		assert.ok(this.stepView, "Step view is Available");
		assert.ok(typeof this.stepView.getController === "function", "Step controller is available");
	});
	QUnit.test("Test availability of API's of step controller", function(assert) {
		assert.ok(typeof this.stepController.onInit === "function", "onInit function available in step controller");
		assert.ok(typeof this.stepController.setDetailData === "function", "setDisplayData function available in step controller");
		assert.ok(typeof this.stepController.handleChangeDetailValueForTree === "function", "handleChangeDetailValueForTree function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForLongTitle === "function", "handleChangeForLongTitle function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForCategory === "function", "handleChangeForCategory function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForService === "function", "handleChangeForService function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForEntity === "function", "handleChangeForEntity function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForSelectProperty === "function", "handleChangeForSelectProperty function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForRequiredFilter === "function", "handleChangeForRequiredFilter function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForTargetFilter === "function", "handleChangeForTargetFilter function available in step controller");
		assert.ok(typeof this.stepController.handleFilterMapKeepSource === "function", "handleFilterMapKeepSource function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForLeftTop === "function", "handleChangeForLeftTop function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForRightTop === "function", "handleChangeForRightTop function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForLeftBottom === "function", "handleChangeForLeftBottom function available in step controller");
		assert.ok(typeof this.stepController.handleChangeForRightBottom === "function", "handleChangeForRightBottom function available in step controller");
		assert.ok(typeof this.stepController.getValidationState === "function", "getValidationState function available in step controller");
	});
	QUnit.test("Test availabilty of all UI controls in step view without filter mapping", function(assert) {
		assert.ok(this.stepView.byId("idstepTitle"), "Title for step available on UI");
		assert.ok(this.stepView.byId("idstepLongTitle"), "Long title for step available on UI");
		assert.ok(this.stepView.byId("idCategorySelect"), "Category select for step available on UI");
		assert.ok(this.stepView.byId("idSourceSelect"), "Source select for step available on UI");
		assert.ok(this.stepView.byId("idEntitySelect"), "Entity select for step available on UI");
		assert.ok(this.stepView.byId("idSelectPropCombo"), "Select properties for step available on UI");
		assert.ok(this.stepView.byId("idReqFilterSelect"), "Required filter for step available on UI");
		assert.ok(this.stepView.byId("idLeftTop"), "Left top corner text for step available on UI");
		assert.ok(this.stepView.byId("idRightTop"), "Right top corner text for step available on UI");
		assert.ok(this.stepView.byId("idLeftBottom"), "Left bottom corner text for step available on UI");
		assert.ok(this.stepView.byId("idRightBottom"), "Right bottom corner text for step available on UI");
		assert.ok(this.stepView.byId("idChartIcon"), "Chart icon for step available on UI");
	});
	QUnit.test("Test onInit of existing step without filter mapping", function(assert) {
		//arrange
		this.stepController.onInit();
		var divToPlaceStep = document.createElement("div");
		divToPlaceStep.setAttribute('id', 'contentOfStep');
		document.body.appendChild(divToPlaceStep);
		this.stepView.placeAt("contentOfStep");
		sap.ui.getCore().applyChanges();
		var focusedElement = document.activeElement;
		//assert
		assert.strictEqual(document.body, focusedElement, "Since step is already exists " + "so body has focus instead step title");
		assert.equal(this.stepView.byId("idstepTitle").getValue(), "step A", "Step Title is set for step");
		assert.equal(this.stepView.byId("idstepLongTitle").getValue(), "step A long title", "Step long title is set for step");
		assert.equal(this.stepView.byId("idCategorySelect").getSelectedKeys()[0], "Category-1", "Category is set for step");
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), "testService1", "Source is set for step");
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), "entitySet1", "Entity set is set for step");
		var selectProperties = [ "property2", "property3", "property4" ];
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectProperties, "Selected properties is set for step");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), "property2", "Required filter is set for step");
		assert.equal(this.stepView.byId("idLeftTop").getValue(), "Left top corner", "Left top corner text set for step");
		assert.equal(this.stepView.byId("idRightTop").getValue(), "Right top corner", "Right top corner text set for step");
		assert.equal(this.stepView.byId("idLeftBottom").getValue(), "Left bottom corner", "Left bottom corner text set for step");
		assert.equal(this.stepView.byId("idRightBottom").getValue(), "Right bottom corner", "Right bottom corner text set for step");
		document.body.removeChild(document.getElementById('contentOfStep'));
	});
	QUnit.test(" step for existing step without filter mapping", function(assert) {
		this.stepController.setDetailData();
		assert.equal(this.stepView.byId("idstepTitle").getValue(), "step A", "Step title is set for step");
		assert.equal(this.stepView.byId("idstepLongTitle").getValue(), "step A long title", "Step long title is set for step");
		assert.equal(this.stepView.byId("idCategorySelect").getSelectedKeys()[0], "Category-1", "Category is set for step");
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), "testService1", "Source is set for step");
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), "entitySet1", "Entity set is set for step");
		var selectProperties = [ "property2", "property3", "property4" ];
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectProperties, "Selected properties is set for step");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), "property2", "Required filter is set for step");
		assert.equal(this.stepView.byId("idLeftTop").getValue(), "Left top corner", "Left top corner text set for step");
		assert.equal(this.stepView.byId("idRightTop").getValue(), "Right top corner", "Right top corner text set for step");
		assert.equal(this.stepView.byId("idLeftBottom").getValue(), "Left bottom corner", "Left bottom corner text set for step");
		assert.equal(this.stepView.byId("idRightBottom").getValue(), "Right bottom corner", "Right bottom corner text set for step");
		//check the availability  of Top N - For the step which has Top N settings
		assert.equal(this.stepView.byId("idDataReductionRadioGroup").getSelectedButton().getText(), this.oModelerInstance.modelerCore.getText("topN"), "By default No Data Reduction is selected for the Top N");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getVisible(), true, "Data Records label is visible for the step which does not have Top N");
		assert.equal(this.stepView.byId("idStepSortLayout").getVisible(), true, "Sort layout visible for the step which does not have Top N");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getRequired(), true, "Data record is mandatory when Top N is selected for the step");
		assert.equal(this.stepView.byId("idCustomRecordValue").isMandatory, true, "Mandatory tag is added to the input field if a given values is set as Top N");
	});
	QUnit.test("Test handleChangeDetailValueForTree for existing step", function(assert) {
		this.stepView.byId("idstepTitle").setValue("step A edited");
		this.stepController.handleChangeDetailValueForTree();
		assert.equal(this.stepView.byId("idstepTitle").getValue(), "step A edited", "Step title is edited and set for existing step");
		this.stepView.byId("idstepTitle").setValue("");
		this.stepController.handleChangeDetailValueForTree();
		assert.equal(this.stepView.byId("idstepTitle").getValue(), "", "Empty step title is not set for existing step");//Empty string is set in input control(UI) but not as step title id
	});
	QUnit.test("Test handleChangeForLongTitle for existing step", function(assert) {
		this.stepView.byId("idstepLongTitle").setValue("step A long title edited");
		this.stepController.handleChangeForLongTitle();
		assert.equal(this.stepView.byId("idstepLongTitle").getValue(), "step A long title edited", "Step long title is edited and set for existing step");
	});
	QUnit.test("Test handleChangeForCategory for existing step", function(assert) {
		assert.deepEqual(this.stepView.byId("idCategorySelect").getSelectedKeys(), [ "Category-1" ], "Step is assigned to a category");
		this.stepView.byId("idCategorySelect").setSelectedKeys([ "Category-2" ]);
		this.stepController.handleChangeForCategory();
		assert.deepEqual(this.stepView.byId("idCategorySelect").getSelectedKeys(), [ "Category-2" ], "Step category is edited and set for existing step");
		this.stepView.byId("idCategorySelect").removeSelectedKeys([ "Category-2" ]);
		this.stepController.handleChangeForCategory();
		assert.deepEqual(this.stepView.byId("idCategorySelect").getSelectedKeys(), [], "Category is removed for existing step and is empty");//Only on the UI; If the user navigates then the last unselected category is set for step
		this.stepView.byId("idCategorySelect").setSelectedKeys([ "Category-1", "Category-2" ]);
		this.stepController.handleChangeForCategory();
		assert.deepEqual(this.stepView.byId("idCategorySelect").getSelectedKeys(), [ "Category-1", "Category-2" ], "Multiple categories is set for existing step");
	});
	QUnit.test("Test handleChangeForStepSpecific for existing step", function(assert) {
		this.stepView.byId("idStepSpecificCombo").setSelectedKeys(this.oModelerInstance.secondNavigationTargetId);
		this.stepController.handleChangeForStepSpecific();
		assert.deepEqual(this.stepView.byId("idStepSpecificCombo").getSelectedKeys(), this.oModelerInstance.unsavedStepWithoutFilterMapping.getNavigationTargets(), "Step specific target is selected");
	});
	QUnit.test("Test _prepareGlobalList for existing step", function(assert) {
		this.stepController._prepareGlobalList();
		assert.equal(this.stepView.byId("idGlobalCombo").getModel().getData().global.length, 1, "Global navigation targets are populated");
	});
	QUnit.test("Test _prepareStepSpecificList for existing step", function(assert) {
		this.stepController._prepareStepSpecificList();
		assert.equal(this.stepView.byId("idStepSpecificCombo").getModel().getData().stepSpecific.length, 1, "Step specific navigation targets are populated");
	});
	QUnit.test("Test handleChangeForService for existing step without filter mapping - first entity set of new service has no common properties", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySetOfOldService = "entitySet1";
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		//For new source - first entity set has no common properties(from properties that were selected in old entity set)
		this.stepView.byId("idSourceSelect").setValue(aServiceList[1]);
		var oEvt = {
			getParameter : function() {
				var id = "idSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), aServiceList[1], "Step service is edited and set for existing step");
		assert.notEqual(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySetOfOldService, "Entity set differs for step after service is modified");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when source is changed because entity set is modified and when properties selected in old entity set are not common with new entity set");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), [], "No selected properties set for new entity set in new service since properties selected in old entity set not common with new entity set");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for new entity set in new service is none since properties selected in old entity set are not common with new entity set");
	});
	QUnit.test("Test handleChangeForService for existing step without filter mapping - first entity set of new service has common properties including required filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySetOfOldService = "entitySet1";
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		//For new source - first entity set has common properties(from properties that were selected in old entity set) including the required filter
		this.stepView.byId("idSourceSelect").setValue(aServiceList[2]);
		var oEvt = {
			getParameter : function() {
				var id = "idSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		var commonProperties = [ "property1", "property2" ];
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), aServiceList[2], "Step service is edited and set for existing step");
		assert.notEqual(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySetOfOldService, "Entity set differs for step after service is modified");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when source is changed because entity set is modified and when properties selected in old entity set are not completly common with new entity set");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), commonProperties, "Selected properties for new entity set is set with select properties that were common with old and new entity sets");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"), "Required filter for new entity set in new service is set to none");
	});
	QUnit.test("Test handleChangeForService for existing step without filter mapping - first entity set of new service has common properties not including required filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySetOfOldService = "entitySet1";
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		var requiredFilterOfOldEntity = "property1";
		//For new source - first entity set has common properties(from properties that were selected in old entity set) not including the required filter
		this.stepView.byId("idSourceSelect").setValue(aServiceList[3]);
		var oEvt = {
			getParameter : function() {
				var id = "idSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		var commonProperties = [ "property2" ];
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), aServiceList[3], "Step service is edited and set for existing step");
		assert.notEqual(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySetOfOldService, "Entity set differs for step after service is modified");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when source is changed because entity set is modified and when properties selected in old entity set are not completly common with new entity set");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), commonProperties, "Selected properties for new entity set is set with select properties that were common with old and new entity sets");
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity,
				"Required filter differs for step when entity set is modified and select properties that were common with old and new entity does not include the required filter");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for new entity set is none when select properties that were common with old and new entity does not include the required filter");
	});
	QUnit.test("Test handleChangeForService for existing step - set invalid service", function(assert) {
		var entitySetOfOldService = "entitySet1";
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		//For new source - first entity set has no common properties(from properties that were selected in old entity set)
		this.stepView.byId("idSourceSelect").setValue("testInvalidService");
		var oEvt = {
			getParameter : function() {
				var id = "idSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), "testInvalidService", "Service for step edited and set");
		assert.notEqual(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySetOfOldService, "Entity set differs for step after service is modified and is invalid");
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), "", "Entity set for invalid step service is set to empty");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity, "Selected properties differs for step when source is changed to invalid service");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), [], "No selected properties set for invalid service");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"), "Required filter is empty for invalid service");
	});
	QUnit.test("Test handleChangeForEntity for existing step without filter mapping - new entity set has no common properties", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[0]);
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		var requiredFilterOfOldEntity = "property1";
		//When new entity set has no common properties(from properties that were selected in old entity set)
		this.stepView.byId("idEntitySelect").setSelectedKey(entitySets[1]);
		var oEvt = {
			getParameter : function() {
				var id = "idEntitySelect";
				return id;
			}
		};
		this.stepController.handleChangeForEntity(oEvt);
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySets[1], "Entity set is edited and set for existing step");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when entity set is modified and when properties selected in old entity set are not common with new entity set");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), [], "No selected properties set for new entity set since properties selected in old entity set not common with new entity set");
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity,
				"Required filter differs for step when entity set is modified and when properties selected in old entity set are not common with new entity set");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for new entity set is none since properties selected in old entity set are not common with new entity set");
	});
	QUnit.test("Test handleChangeForEntity for existing step without filter mapping - new entity set has common properties including the required filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[0]);
		var selectPropertiesOfOldEntity = [ "property2", "property3", "property4" ];
		var requiredFilterOfOldEntity = "property2";
		//When new entity set has the common properties(from properties that were selected in old entity set) including the required filter
		this.stepView.byId("idEntitySelect").setSelectedKey(entitySets[3]);
		var oEvt = {
			getParameter : function() {
				var id = "idEntitySelect";
				return id;
			}
		};
		this.stepController.handleChangeForEntity(oEvt);
		var commonProperties = [ "property2" ];
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySets[3], "Entity set is edited and set for existing step");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when entity set is modified and when properties selected in old entity set are not completly common with new entity set");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), commonProperties, "Selected properties for new entity set is set with select properties that were common with old and new entity sets");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity,
				"Required filter for new entity set is same when there are common properties selected with old and new entity sets which includes the required filter");
	});
	QUnit.test("Test handleChangeForEntity for existing step without filter mapping - new entity set has common properties not including the required filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[0]);
		var selectPropertiesOfOldEntity = [ "property2", "property3", "property4" ];
		var requiredFilterOfOldEntity = "property2";
		//When new entity set has the common properties(from properties that were selected in old entity set) not including the required filter
		this.stepView.byId("idEntitySelect").setSelectedKey(entitySets[4]);
		var oEvt = {
			getParameter : function() {
				var id = "idEntitySelect";
				return id;
			}
		};
		this.stepController.handleChangeForEntity(oEvt);
		var commonProperties = [ "property3" ];
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySets[4], "Entity set is edited and set for existing step");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when entity set is modified and when properties selected in old entity set are not completly common with new entity set");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), commonProperties, "Selected properties for new entity set is set with select properties that were common with old and new entity");
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity,
				"Required filter differs for step when entity set is modified and select properties that were common with old and new entity does not include the required filter");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for new entity set is none when select properties that were common with old and new entity does not include the required filter");
	});
	QUnit.test("Test handleChangeForSelectProperty for existing step without filter mapping - new select properties includes the required filter", function(assert) {
		var selectProperties = [ "property2", "property3", "property4" ];
		var requiredFilterOfOldEntity = "property2";
		var newSelectProperties = [ "property1", "property2", "property3", "property4" ];
		this.stepView.byId("idSelectPropCombo").setSelectedKeys(newSelectProperties);
		var oEvt = {
			getParameter : function() {
				var id = "idSelectPropCombo";
				return id;
			}
		};
		this.stepController.handleChangeForSelectProperty(oEvt);
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectProperties, "Selected properties differs for step when properties are changed");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), newSelectProperties, "Selected properties set for step with the new selections");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity, "Required filter for step is same since new select properties has the previously selected required filter");
	});
	QUnit.test("Test handleChangeForSelectProperty for existing step without filter mapping - new select properties does not include the required filter", function(assert) {
		var selectProperties = [ "property1", "property2", "property3" ];
		var requiredFilterOfOldEntity = "property2";
		var newSelectProperties = [ "property1", "property4" ];
		this.stepView.byId("idSelectPropCombo").setSelectedKeys(newSelectProperties);
		var oEvt = {
			getParameter : function() {
				var id = "idSelectPropCombo";
				return id;
			}
		};
		this.stepController.handleChangeForSelectProperty(oEvt);
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectProperties, "Selected properties differs for step when properties are changed");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), newSelectProperties, "Selected properties set for step with the new selections");
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity, "Required filter is not the same since the required filter is not present in the new select properties");
		assert
				.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
						"Required filter for step is set to none since new select properties does not have previously selected required filter");
	});
	QUnit.test("Test handleChangeForRequiredFilter for existing step without filter mapping", function(assert) {
		var selectProperties = [ "property1", "property2", "property3" ];
		var requiredFilterOfOldEntity = "property1";
		this.stepView.byId("idReqFilterSelect").setSelectedKey(selectProperties[2]);
		var oEvt = {
			getParameter : function() {
				var id = "idReqFilterSelect";
				return id;
			}
		};
		this.stepController.handleChangeForRequiredFilter(oEvt);
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity, "Required filter is modified after choosing a new one ");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), selectProperties[2], "Required filter for step is edited and set");
	});
	QUnit.test("Test handleChangeForLeftTop for step", function(assert) {
		this.stepView.byId("idLeftTop").setValue("Left top corner edited");
		this.stepController.handleChangeForLeftTop();
		assert.equal(this.stepView.byId("idLeftTop").getValue(), "Left top corner edited", "Left top corner for step is edited and set");
	});
	QUnit.test("Test handleChangeForRightTop for step", function(assert) {
		this.stepView.byId("idRightTop").setValue("Right top corner edited");
		this.stepController.handleChangeForRightTop();
		assert.equal(this.stepView.byId("idRightTop").getValue(), "Right top corner edited", "Right top corner for step is edited and set");
	});
	QUnit.test("Test handleChangeForLeftBottom for step", function(assert) {
		this.stepView.byId("idLeftBottom").setValue("Left bottom corner edited");
		this.stepController.handleChangeForLeftBottom();
		assert.equal(this.stepView.byId("idLeftBottom").getValue(), "Left bottom corner edited", "Left bottom corner for step is edited and set");
	});
	QUnit.test("Test handleChangeForRightBottom for step", function(assert) {
		this.stepView.byId("idRightBottom").setValue("Right bottom corner edited");
		this.stepController.handleChangeForLeftBottom();
		assert.equal(this.stepView.byId("idRightBottom").getValue(), "Right bottom corner edited", "Right bottom corner for step is edited and set");
	});
	QUnit.test("Test getValidationState for step", function(assert) {
		var validState = this.stepController.getValidationState();
		assert.equal(validState, true, "The state of the mandatory field is valid");
		this.stepView.byId("idstepTitle").setValue("");
		this.stepView.byId("idSourceSelect").setValue("");
		validState = this.stepController.getValidationState();
		assert.equal(validState, false, "The state of the mandatory fields are not valid");
	});
	QUnit.test("Test _handleChangeForSortData for step", function(assert) {
		var oSelectPropertyControl = this.stepView.byId("idStepSortLayout").getItems()[0].getContent()[1]; // the select control in the sort data layout
		//the sort property is set to "property1", change the sort property to "property2"
		oSelectPropertyControl.setSelectedKey("property2");
		this.stepController._handleChangeForSortData(this.oSortDataPropertyEvent);
		var sChangedSortProperty = this.stepView.byId("idStepSortLayout").getModel().getData().aSortRows[0].property;
		assert.equal(sChangedSortProperty, "property2", "Sort property is changed to property2");
	});
	QUnit.test("Test _handleChangeForSortData for step", function(assert) {
		var oSortDirectionSelectControl = this.stepView.byId("idStepSortLayout").getItems()[0].getContent()[3]; // the select control for sort direction in the sort data layout
		var sExpectedSortDirection = this.stepView.byId("idStepSortLayout").getModel().getData().aSortRows[0].ascending;
		assert.equal(sExpectedSortDirection, "Ascending", "Sort direction is ascending");
		//change the sort direction to "Descending"
		oSortDirectionSelectControl.setSelectedKey("Descending");
		this.stepController._handleChangeForSortData(this.oSortDataPropertyEvent);
		var sChangedSortDirection = this.stepView.byId("idStepSortLayout").getModel().getData().aSortRows[0].ascending;
		assert.equal(sChangedSortDirection, "Descending", "Sort direction is Descending");
	});
	QUnit.module("Step Unit Tests - Existing step with filter mapping", {
		beforeEach : function(assert) {
			var that = this;
			var done1 = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				that.oModelerInstance = oModelerInstance;
				that.stepView = sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.step",
					type : "XML",
					viewData : {
						updateConfigTree : that.oModelerInstance.updateConfigTree,
						updateSelectedNode : that.oModelerInstance.updateSelectedNode,
						updateTree : that.oModelerInstance.updateTree,
						updateTitleAndBreadCrumb : that.oModelerInstance.updateTitleAndBreadCrumb,
						oConfigurationHandler : that.oModelerInstance.configurationHandler,
						oApplicationHandler : that.oModelerInstance.applicationHandler,
						oConfigurationEditor : that.oModelerInstance.configurationEditorForUnsavedConfig,
						getText : that.oModelerInstance.modelerCore.getText,
						getNavigationTargetName : that.oModelerInstance.getNavigationTargetName,
						oParams : {
							name : "step",
							arguments : {
								configId : that.oModelerInstance.tempUnsavedConfigId,
								categoryId : that.oModelerInstance.categoryIdUnsaved,
								stepId : that.oModelerInstance.stepIdUnsavedWithFilterMapping
							}
						},
						getCalatogServiceUri : doNothing
					}
				});
				that.stepController = that.stepView.getController();
				done1();
			});
		},
		afterEach : function() {
			this.oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		}
	});
	QUnit.test("Test availabilty of all UI controls in step view with filter mapping", function(assert) {
		assert.ok(this.stepView.byId("idstepTitle"), "Title for step available on UI");
		assert.ok(this.stepView.byId("idstepLongTitle"), "Long title for step available on UI");
		assert.ok(this.stepView.byId("idCategorySelect"), "Category select for step available on UI");
		assert.ok(this.stepView.byId("idSourceSelect"), "Source select for step available on UI");
		assert.ok(this.stepView.byId("idEntitySelect"), "Entity select for step available on UI");
		assert.ok(this.stepView.byId("idSelectPropCombo"), "Select properties for step available on UI");
		assert.ok(this.stepView.byId("idReqFilterSelect"), "Required filter for step available on UI");
		assert.ok(this.stepView.byId("idFilterMapSourceSelect"), "Filter map source for step available on UI");
		assert.ok(this.stepView.byId("idFilterMapEntitySelect"), "Filter map entity for step available on UI");
		assert.ok(this.stepView.byId("idFilterMapTargetFilterCombo"), "Filter map target filter for step available on UI");
		assert.ok(this.stepView.byId("idFilterKeepSourceCheckBox"), "Filter map keep source for step available on UI");
	});
	QUnit.test("Test onInit of existing step with filter mapping", function(assert) {
		this.stepController.onInit();
		assert.equal(this.stepView.byId("idstepTitle").getValue(), "step B", "Step Title is set for step");
		assert.equal(this.stepView.byId("idstepLongTitle").getValue(), "step B long title", "Step long title is set for step");
		assert.equal(this.stepView.byId("idCategorySelect").getSelectedKeys()[0], "Category-1", "Category is set for step");
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), "testService1", "Source is set for step");
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), "entitySet1", "Entity set is set for step");
		var selectProperties = [ "property1", "property2", "property3" ];
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectProperties, "Selected properties is set for step");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), "property1", "Required filter is set for step");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "testService1", "Filter mapping source is set for step");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet3", "Filter mapping entity set is set for step");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property8", "Filter mapping target filter is set for step");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test setDetailData for existing step with filter mapping", function(assert) {
		this.stepController.setDetailData();
		assert.equal(this.stepView.byId("idstepTitle").getValue(), "step B", "Step title is set for step");
		assert.equal(this.stepView.byId("idstepLongTitle").getValue(), "step B long title", "Step long title is set for step");
		assert.equal(this.stepView.byId("idCategorySelect").getSelectedKeys()[0], "Category-1", "Category is set for step");
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), "testService1", "Source is set for step");
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), "entitySet1", "Entity set is set for step");
		var selectProperties = [ "property1", "property2", "property3" ];
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectProperties, "Selected properties is set for step");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), "property1", "Required filter is set for step");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "testService1", "Filter mapping source is set for step");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet3", "Filter mapping entity set is set for step");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property8", "Filter mapping target filter is set for step");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForService for existing step with filter mapping - first entity set of new service has no common properties", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySetOfOldService = "entitySet1";
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		//For new source - first entity set has no common properties(from properties that were selected in old entity set)
		this.stepView.byId("idSourceSelect").setValue(aServiceList[1]);
		var oEvt = {
			getParameter : function() {
				var id = "idSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), aServiceList[1], "Step service is edited and set for existing step");
		assert.notEqual(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySetOfOldService, "Entity set differs for step after service is modified");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when source is changed because entity set is modified and when properties selected in old entity set are not common with new entity set");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), [], "No selected properties set for new entity set in new service since properties selected in old entity set not common with new entity set");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for new entity set in new service is none since properties selected in old entity set are not common with new entity set");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service does not change when step source is modified");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity is null when step source is modified and select properties change");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity set to none when step source is modified and select properties change");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter is empty when step source is modified because entity and select properties changes with no common properties");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForService for existing step with filter mapping - first entity set of new service has common properties including required filter of step and filter mapping target filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySetOfOldService = "entitySet1";
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		//For new source - first entity set has common properties(from properties that were selected in old entity set) including the required filter
		this.stepView.byId("idSourceSelect").setValue(aServiceList[2]);
		var oEvt = {
			getParameter : function() {
				var id = "idSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		var commonProperties = [ "property1", "property2" ];
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), aServiceList[2], "Step service is edited and set for existing step");
		assert.notEqual(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySetOfOldService, "Entity set differs for step after service is modified");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when source is changed because entity set is modified and when properties selected in old entity set are not completly common with new entity set");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), commonProperties, "Selected properties for new entity set is set with select properties that were common with old and new entity sets");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for new entity set in new service is same when there are common properties selected with old and new entity sets which includes the required filter");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service does not change when step source is modified");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity set does not change when step source is modified");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter when step source is modified is same beacuse select properties are same with common properties in both entities");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForService for existing step with filter mapping - first entity set of new service has common properties including required filter of step and not the filter mapping target filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySetOfOldService = "entitySet1";
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		//For new source - first entity set has common properties(from properties that were selected in old entity set) including the required filter of step and not the filter mapping target filter
		this.stepView.byId("idSourceSelect").setValue(aServiceList[2]);
		var oEvt = {
			getParameter : function() {
				var id = "idSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		var commonProperties = [ "property1", "property2" ];
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), aServiceList[2], "Step service is edited and set for existing step");
		assert.notEqual(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySetOfOldService, "Entity set differs for step after service is modified");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when source is changed because entity set is modified and when properties selected in old entity set are not completly common with new entity set");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), commonProperties, "Selected properties for new entity set is set with select properties that were common with old and new entity sets");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for new entity set in new service is same when there are common properties selected with old and new entity sets which includes the required filter");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service cleared when step source is modified");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity set is cleared when step source is modified");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter cleared when step source is modified because entity and select properties changes");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForEntity for existing step with filter mapping - new entity set has no common properties", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[0]);
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		var requiredFilterOfOldEntity = "property1";
		//When new entity set has no common properties(from properties that were selected in old entity set)
		this.stepView.byId("idEntitySelect").setSelectedKey(entitySets[1]);
		var oEvt = {
			getParameter : function() {
				var id = "idEntitySelect";
				return id;
			}
		};
		this.stepController.handleChangeForEntity(oEvt);
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySets[1], "Entity set is edited and set for existing step");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when entity set is modified and when properties selected in old entity set are not common with new entity set");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), [], "No selected properties set for new entity set since properties selected in old entity set not common with new entity set");
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity,
				"Required filter differs for step when entity set is modified and when properties selected in old entity set are not common with new entity set");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for new entity set is none since properties selected in old entity set are not common with new entity set");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service cleared when entity set is modified");
		assert.notEqual(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet3", "Filter mapping entity set differs when entity set is modified and select properties are not common with the previous entity set");
		assert.deepEqual(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity set is set to empty when entity set is modified and select properties are not common with the previous entity set");
		assert.notEqual(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property8", "Filter mapping target filter change when entity set is modified and select properties are not common with the previous entity set");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter is empty when entity set is modified and select properties are not common with the previous entity set");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForEntity for existing step with filter mapping - new entity set has common properties including the required filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[0]);
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		var requiredFilterOfOldEntity = "property1";
		//When new entity set has the common properties(from properties that were selected in old entity set) including the required filter
		this.stepView.byId("idEntitySelect").setSelectedKey(entitySets[3]);
		var oEvt = {
			getParameter : function() {
				var id = "idEntitySelect";
				return id;
			}
		};
		this.stepController.handleChangeForEntity(oEvt);
		var commonProperties = [ "property1", "property2" ];
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySets[3], "Entity set is edited and set for existing step");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when entity set is modified and when properties selected in old entity set are not completly common with new entity set");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), commonProperties, "Selected properties for new entity set is set with select properties that were common with old and new entity sets");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity,
				"Required filter for new entity set is same when there are common properties selected with old and new entity sets which includes the required filter");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "testService1", "Filter mapping service does not change when entity set is modified");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet3",
				"Filter mapping entity set is same when entity set is modified and select properties are common with the previous entity set and includes the required filter");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property8",
				"Filter mapping target filter is same when entity set is modified and select properties are common with the previous entity set and includes the required filter");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForEntity for existing step with filter mapping - new entity set has common properties not including the required filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[0]);
		var selectPropertiesOfOldEntity = [ "property1", "property2", "property3" ];
		var requiredFilterOfOldEntity = "property1";
		//When new entity set has the common properties(from properties that were selected in old entity set) not including the required filter
		this.stepView.byId("idEntitySelect").setSelectedKey(entitySets[4]);
		var oEvt = {
			getParameter : function() {
				var id = "idEntitySelect";
				return id;
			}
		};
		this.stepController.handleChangeForEntity(oEvt);
		var commonProperties = [ "property3" ];
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), entitySets[4], "Entity set is edited and set for existing step");
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectPropertiesOfOldEntity,
				"Selected properties differs for step when entity set is modified and when properties selected in old entity set are not completly common with new entity set");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), commonProperties, "Selected properties for new entity set is set with select properties that were common with old and new entity");
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity,
				"Required filter differs for step when entity set is modified and select properties that were common with old and new entity does not include the required filter");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for new entity set is none when select properties that were common with old and new entity does not include the required filter");
		assert.equal(this.stepView.byId("idFilterMapping").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapSourceLabel").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapEntityLabel").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterLabel").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getVisible(), false, "Filter mapping layout is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapKeepSourceLabel").getVisible(), false, "Filter mapping layout is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getVisible(), false, "Filter mapping layout is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service set is empty when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity set is empty when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter is empty when required filter is none");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForSelectProperty for existing step with filter mapping - new select properties does not includes the required filter,new required filter not present in entity of filter mapping", function(assert) {
		var selectProperties = [ "property1", "property2", "property3", "property4" ];
		var newSelectProperties = [ "property4" ];
		this.stepView.byId("idSelectPropCombo").setSelectedKeys(newSelectProperties);
		var oEvt = {
			getParameter : function() {
				var id = "idSelectPropCombo";
				return id;
			}
		};
		this.stepController.handleChangeForSelectProperty(oEvt);
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectProperties, "Selected properties differs for step when properties are changed");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), newSelectProperties, "Selected properties set for step with the new selections");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
				"Required filter for step is set to None since new select properties does not have the previously selected required filter");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service does not change when entity set is modified");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity set is empty when new select properties not common with any entity in filter mapping service");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter is empty when new select properties not common with any entity in filter mapping service");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForSelectProperty for existing step with filter mapping - new select properties includes the required filter and some select properties common with entity in filter mapping service", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[0]);
		var oldEntitySetOfFilterMap = "entitySet6";
		var selectProperties = [ "property1" ];
		var oldFilterMapTarget = [ "property8" ];
		this.oModelerInstance.unsavedStepWithFilterMapping.setEntitySet(entitySets[6]);
		var newSelectProperties = [ "property1", "property9" ];
		this.oModelerInstance.unsavedStepWithFilterMapping.addSelectProperty("property1");
		this.oModelerInstance.unsavedStepWithFilterMapping.addSelectProperty("property9");
		this.stepView.byId("idSelectPropCombo").setSelectedKeys(newSelectProperties);
		var oEvt = {
			getParameter : function() {
				var id = "idSelectPropCombo";
				return id;
			}
		};
		this.stepController.handleChangeForSelectProperty(oEvt);
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectProperties, "Selected properties differs for step when properties are changed");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), newSelectProperties, "Selected properties set for step with the new selections");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), "property1", "Required filter for step is same since it new select properties contain the required filter");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "testService1", "Filter mapping service does not change when entity set is modified");
		assert.notEqual(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), oldEntitySetOfFilterMap, "Filter mapping entity set differs when new select properties not common with previous entity in filter mapping service");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet3", "Filter mapping entity set is modified when new select properties not common with previous entity in filter mapping service");
		assert.notEqual(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), oldFilterMapTarget,
				"Filter mapping target filter is differs when new select properties not completely common with previous entity in filter mapping service and old filter mapping target does not exist in new filter mapping entity set");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForSelectProperty for existing step with filter mapping - new select properties does not include the required filter", function(assert) {
		var selectProperties = [ "property1", "property2", "property3" ];
		var requiredFilterOfOldEntity = "property1";
		var newSelectProperties = [ "property2", "property4" ];
		this.stepView.byId("idSelectPropCombo").setSelectedKeys(newSelectProperties);
		var oEvt = {
			getParameter : function() {
				var id = "idSelectPropCombo";
				return id;
			}
		};
		this.stepController.handleChangeForSelectProperty(oEvt);
		assert.notDeepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), selectProperties, "Selected properties differs for step when properties are changed");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), newSelectProperties, "Selected properties set for step with the new selections");
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity, "Required filter is not the same since the required filter is not present in the new select properties");
		assert
				.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"),
						"Required filter for step is set to none since new select properties does not have previously selected required filter");
		assert.equal(this.stepView.byId("idFilterMapping").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapSourceLabel").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapEntityLabel").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterLabel").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getVisible(), false, "Filter mapping layout is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapKeepSourceLabel").getVisible(), false, "Filter mapping layout is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getVisible(), false, "Filter mapping layout is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service set is empty when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity set is empty when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter is empty when required filter is none");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForRequiredFilter for existing step with filter mapping", function(assert) {
		var selectProperties = [ "property1", "property2", "property3" ];
		var requiredFilterOfOldEntity = "property1";
		this.stepView.byId("idReqFilterSelect").setSelectedKey(selectProperties[2]);
		var oEvt = {
			getParameter : function() {
				var id = "idReqFilterSelect";
				return id;
			}
		};
		this.stepController.handleChangeForRequiredFilter(oEvt);
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity, "Required filter is modified after choosing a new one ");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), selectProperties[2], "Required filter for step is edited and set");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "testService1", "Filter mapping service does not change when required filter is modified");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet3", "Filter mapping entity set does not change when required filter is modified");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property8", "Filter mapping target filter when required filter is modified is same");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForRequiredFilter for existing step with filter mapping and set it to none", function(assert) {
		var requiredFilterOfOldEntity = "property1";
		this.stepView.byId("idReqFilterSelect").setSelectedKey(this.oModelerInstance.modelerCore.getText("none"));
		var oEvt = {
			getParameter : function() {
				var id = "idReqFilterSelect";
				return id;
			}
		};
		this.stepController.handleChangeForRequiredFilter(oEvt);
		assert.notEqual(this.stepView.byId("idReqFilterSelect").getSelectedKey(), requiredFilterOfOldEntity, "Required filter is modified after choosing a new one ");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"), "Required filter for step is edited and set");
		assert.equal(this.stepView.byId("idFilterMapping").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapSourceLabel").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapEntityLabel").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterLabel").getVisible(), false, "Filter mapping is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getVisible(), false, "Filter mapping layout is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapKeepSourceLabel").getVisible(), false, "Filter mapping layout is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getVisible(), false, "Filter mapping layout is hidden when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service set is empty when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity set is empty when required filter is none");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter is empty when required filter is none");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForService(Filter Mapping service) for existing step with filter mapping - required filter not present in any enitites of new source", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySetOfOldFilterMappingService = "entitySet3";
		this.stepView.byId("idFilterMapSourceSelect").setValue(aServiceList[1]);
		var oEvt = {
			getParameter : function() {
				var id = "idReqFilterSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service is edited and set");
		assert
				.notEqual(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), entitySetOfOldFilterMappingService,
						"Filter mapping entity changes when filter mapping source is modified and source has no entity sets with the required filter");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity set to empty when filter mapping source is modified");
		assert.notEqual(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property8", "Filter mapping target filter changes when step source is modified and source has no entity sets with the required filter");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter is empty when filter mapping source is modified and source has no entity sets with the required filter");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForService(Filter Mapping service) for existing step with filter mapping - required filter present in enitites of new source", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySetOfOldFilterMappingService = "entitySet3";
		this.stepView.byId("idFilterMapSourceSelect").setValue(aServiceList[2]);
		var oEvt = {
			getParameter : function() {
				var id = "idFilterMapSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "testService3", "Filter mapping service is edited and set");
		assert.notEqual(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), entitySetOfOldFilterMappingService, "Filter mapping entity changes when filter mapping source is modified and source has entity sets with the required filter");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet9", "Filter mapping entity set to first entity set in source which has the required filter");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property8", "Filter mapping target filter is same when new entity set contains the required filter");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test Change in Filter Mapping Section Source should not affect the Step Request section properties", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySetOfOldFilterMappingService = "entitySet3";
		var sStepRequestValues = [];
		sStepRequestValues = this.stepView.byId("idSelectPropCombo").getSelectedKeys();
		this.stepView.byId("idFilterMapSourceSelect").setValue(aServiceList[2]);
		var oEvt = {
			getParameter : function() {
				var id = "idFilterMapSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "testService3", "Filter mapping service is edited and set");
		assert.notEqual(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), entitySetOfOldFilterMappingService, "Filter mapping entity changes when filter mapping source is modified and source has entity sets with the required filter");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet9", "Filter mapping entity set to first entity set in source which has the required filter");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property8", "Filter mapping target filter is same when new entity set contains the required filter");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), sStepRequestValues, "Selected property did not get changed after made changes in Filter mapping Source");
		assert.deepEqual(this.oModelerInstance.unsavedStepWithFilterMapping.getSelectProperties(), sStepRequestValues, "Source selected properties remains same in core after the change of filter mapping source");
	});
	QUnit.test("Test Change in Filter Mapping Section Entity should not affect the Step Request section properties", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[2]);
		var sStepRequestValues = [];
		sStepRequestValues = this.stepView.byId("idSelectPropCombo").getSelectedKeys();
		this.stepView.byId("idFilterMapEntitySelect").setSelectedKey(entitySets[2]);
		var oEvt = {
			getParameter : function() {
				var id = "idFilterMapEntitySelect";
				return id;
			}
		};
		this.stepController.handleChangeForEntity(oEvt);
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), sStepRequestValues, "Selected property did not get changed after made changes in Filter mapping Entity set");
		assert.deepEqual(this.oModelerInstance.unsavedStepWithFilterMapping.getSelectProperties(), sStepRequestValues, "Source selected properties remains same in core after the change of filter mapping entity");
	});
	QUnit.test("Test handleChangeForService(Filter Mapping service) for existing step with filter mapping - invalid service", function(assert) {
		var entitySetOfOldFilterMappingService = "entitySet3";
		this.stepView.byId("idFilterMapSourceSelect").setValue("testInvalidService");
		var oEvt = {
			getParameter : function() {
				var id = "idFilterMapSourceSelect";
				return id;
			}
		};
		this.stepController.handleChangeForService(oEvt);
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "", "Filter mapping service is edited and set");
		assert.notEqual(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), entitySetOfOldFilterMappingService, "Filter mapping entity differs for filter mapping after service is modified and is invalid");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "", "Filter mapping entity after is set to empty for invalid service");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys().length, 0, "Filter mapping target filter is set to empty for invalid service");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForEntity(Filter mapping entity) for existing step with filter mapping - new entity set includes target filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[0]);
		//When new entity set has no common properties(from properties that were selected in old entity set)
		this.stepView.byId("idFilterMapEntitySelect").setSelectedKey(entitySets[3]);
		var oEvt = {
			getParameter : function() {
				var id = "idFilterMapEntitySelect";
				return id;
			}
		};
		this.stepController.handleChangeForEntity(oEvt);
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "testService1", "Filter mapping service does not change when entity set is modified");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet4", "Filter mapping entity set is edited and set");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property8",
				"Filter mapping target filter is same when entity set is modified and select properties are common with the previous entity set and includes the target filter");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForEntity(Filter mapping entity) for existing step with filter mapping - new entity set does not include target filter", function(assert) {
		var aServiceList = this.oModelerInstance.serviceList;
		var entitySets = this.oModelerInstance.configurationEditorForUnsavedConfig.getAllEntitySetsOfService(aServiceList[0]);
		//When new entity set has no common properties(from properties that were selected in old entity set)
		this.stepView.byId("idFilterMapEntitySelect").setSelectedKey(entitySets[5]);
		var oEvt = {
			getParameter : function() {
				var id = "idFilterMapEntitySelect";
				return id;
			}
		};
		this.stepController.handleChangeForEntity(oEvt);
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getValue(), "testService1", "Filter mapping service does not change when entity set is modified");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet11", "Filter mapping entity set is edited and set");
		assert.notEqual(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), [ "property8" ], "Filter mapping target filter differs when entity set is modified and select properties do not includes the required filter");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleChangeForTargetFilter for existing step with filter mapping", function(assert) {
		this.stepView.byId("idFilterMapTargetFilterCombo").setSelectedKeys([ "property1" ]);
		var oEvt = {
			getParameter : function() {
				var id = "idFilterMapTargetFilterCombo";
				return id;
			}
		};
		this.stepController.handleChangeForTargetFilter(oEvt);
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getSelectedKey(), "entitySet3", "Filter mapping entity set is set");
		assert.notEqual(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), [ "property8" ], "Filter mapping target filter differs when target filter is modified");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getSelectedKeys(), "property1", "Filter mapping target filter is edited and set");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step");
	});
	QUnit.test("Test handleFilterMapKeepSource for existing step with filter mapping ", function(assert) {
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), true, "Filter mapping keep source check box is true for step before change");
		this.stepView.byId("idFilterKeepSourceCheckBox").setSelected(false);
		this.stepController.handleFilterMapKeepSource();
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getSelected(), false, "Filter mapping keep source check box is false for step after change");
	});
	QUnit.test("Test handleChangeForSelectProperty for existing step  - When there is a change in select properties, Top N fields must remain the same", function(assert) {
		var expectedTopNSettings = this.stepController.step.getTopN();
		var newSelectProperties = [ "property1", "property2", "property3", "property4" ];
		this.stepView.byId("idSelectPropCombo").setSelectedKeys(newSelectProperties);
		var oEvt = {
			getParameter : function() {
				var id = "idSelectPropCombo";
				return id;
			}
		};
		this.stepController.handleChangeForSelectProperty(oEvt);
		var resultTopNSettings = this.stepController.step.getTopN();
		assert.deepEqual(expectedTopNSettings, resultTopNSettings, "Top N settings are retained on change of select properties");
	});
	QUnit.test("Test handleChangeForSelectProperty for existing step  - When there is no select properties, Top N fields must be hidden", function(assert) {
		this.stepView.byId("idSelectPropCombo").setSelectedKeys([]);
		var oEvt = {
			getParameter : function() {
				var id = "idSelectPropCombo";
				return id;
			}
		};
		this.stepController.handleChangeForSelectProperty(oEvt);
		//check the availability  of Top N - For the step which does not have any select property
		assert.equal(this.stepController.step.getTopN(), undefined, "Top N is undefined for the step ");
		assert.equal(this.stepView.byId("idDataReduction").getVisible(), false, "Data reduction layout is not visible");
		assert.equal(this.stepView.byId("idDataReductionLabel").getVisible(), false, "Data reduction label is not visible");
		assert.equal(this.stepView.byId("idDataReductionRadioButton").getVisible(), false, "Data reduction radio buttons is not visible");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getVisible(), false, "Data Records label is not visible");
		assert.equal(this.stepView.byId("idCustomRecordValue").getVisible(), false, "Custom data record input is not visible");
		assert.equal(this.stepView.byId("idStepSortLayout").getVisible(), false, "Sort layout not visible");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getRequired(), false, "Data record is not mandatory when Top N is selected for the step");
		assert.equal(this.stepView.byId("idCustomRecordValue").isMandatory, false, "Mandatory tag is removed from the input field if a given values is set as Top N");
	});
	QUnit.test("When source selected from value help in the input field", function(assert) {
		//action
		this.stepView.byId("idSourceSelect").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = this.stepView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(oSelectDialog.getTitle(), "Select Service", "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.test("When filter mapping source selected from value help in the input field", function(assert) {
		//action
		this.stepView.byId("idFilterMapSourceSelect").fireValueHelpRequest();
		sap.ui.getCore().applyChanges();
		var oSelectDialog = this.stepView.byId("idCatalogServiceView").byId("idGatewayCatalogListDialog");
		//assert
		assert.ok(oSelectDialog, "Select dialog exists after firing value help request");
		assert.strictEqual(oSelectDialog.getTitle(), "Select Service", "Exisitng select dialog is the Gateway select service dialog");
		//cleanups
		oSelectDialog.destroy();
	});
	QUnit.module("Step Unit Tests - New Step", {
		beforeEach : function(assert) {
			var that = this;
			var done1 = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				that.oModelerInstance = oModelerInstance;
				that.stepView = sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.step",
					type : "XML",
					viewData : {
						updateConfigTree : that.oModelerInstance.updateConfigTree,
						updateSelectedNode : that.oModelerInstance.updateSelectedNode,
						updateTree : that.oModelerInstance.updateTree,
						updateTitleAndBreadCrumb : that.oModelerInstance.updateTitleAndBreadCrumb,
						oConfigurationHandler : that.oModelerInstance.configurationHandler,
						oApplicationHandler : that.oModelerInstance.applicationHandler,
						oConfigurationEditor : that.oModelerInstance.configurationEditorForUnsavedConfig,
						getText : that.oModelerInstance.modelerCore.getText,
						getNavigationTargetName : that.oModelerInstance.getNavigationTargetName,
						oParams : {
							name : "step",
							arguments : {
								configId : that.oModelerInstance.tempUnsavedConfigId,
								categoryId : that.oModelerInstance.categoryIdUnsaved,
								stepId : "newStep0"
							}
						}
					}
				});
				that.stepController = that.stepView.getController();
				//Top N setting is done in the setup
				that.stepController.step.addSelectProperty('property1');
				that.stepController.step.setTopNValue(100);
				that.stepController.step.setTopNSortProperties([ {
					property : "property1",
					ascending : true
				} ]);
				that.stepController._setSortDataForStep();
				that.sortDataItems = that.stepView.byId("idStepSortLayout").getItems();
				that.oSortDataPropertyEvent = { //event stub for the add/delete sort property row in the step
					getSource : function() {
						var selectedItem = {};
						selectedItem.getBindingContext = function() {
							var obj = {};
							obj.getObject = function() {
								return {
									aAllProperties : [ {
										sAggregationRole : "dimension",
										sDefaultLable : "dimensionproperty1",
										sLabel : "Label",
										sName : "property1"
									} ]
								};
							};
							obj.getPath = function() {
								return "/aSortRows/0";
							};
							obj.getProperty = function() {
								return "property1";
							};
							return obj;
						};
						selectedItem.getSelectedKey = function() {
							return "property1";
						};
						selectedItem.getParent = function() {
							return this.sortDataItems[0];
						};
						return selectedItem;
					}
				};
				done1();
			});
		},
		afterEach : function() {
			this.stepController.step.resetTopN();
			this.oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			this.stepView.destroy();
		}
	});
	QUnit.test("Test onInit of new step", function(assert) {
		//arrange
		this.stepController.onInit();
		var divToPlaceStep = document.createElement("div");
		divToPlaceStep.setAttribute('id', 'contentOfStep');
		document.body.appendChild(divToPlaceStep);
		this.stepView.placeAt("contentOfStep");
		sap.ui.getCore().applyChanges();
		var focusedElement = document.activeElement;
		//assert
		assert.strictEqual(this.stepView.byId("idstepTitle").sId, focusedElement.parentElement.id, "Since step is created as new so step title has focus on it ");
		assert.equal(this.stepView.byId("idstepTitle").getValue(), "", "Step Title is set to empty for new step");
		assert.equal(this.stepView.byId("idstepLongTitle").getValue(), "", "Step long title is set to empty for new step");
		assert.equal(this.stepView.byId("idCategorySelect").getSelectedKeys()[0], "Category-1", "Category is set for new step");
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), "", "Source is set to empty for new step");
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), "", "Entity set is set to empty for step");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), [], "Selected properties is set to empty for new step");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"), "Required filter is set to emptyfor step");
		document.body.removeChild(document.getElementById('contentOfStep'));
	});
	QUnit.test("Test setDetailData of new step", function(assert) {
		this.stepController.setDetailData();
		assert.equal(this.stepView.byId("idstepTitle").getValue(), "", "Step Title is set to empty for new step");
		assert.equal(this.stepView.byId("idstepLongTitle").getValue(), "", "Step long title is set to empty for new step");
		assert.equal(this.stepView.byId("idCategorySelect").getSelectedKeys()[0], "Category-1", "Category is set for new step");
		assert.equal(this.stepView.byId("idSourceSelect").getValue(), "", "Source is set to empty for new step");
		assert.equal(this.stepView.byId("idEntitySelect").getSelectedKey(), "", "Entity set is set to empty for step");
		assert.deepEqual(this.stepView.byId("idSelectPropCombo").getSelectedKeys(), [], "Selected properties is set to empty for new step");
		assert.equal(this.stepView.byId("idReqFilterSelect").getSelectedKey(), this.oModelerInstance.modelerCore.getText("none"), "Required filter is set to emptyfor step");
		//check the availability  of Top N - For the step which does not have Top N settings
		assert.equal(this.stepController.step.getTopN(), undefined, "Top N is undefined for the step by default");
		assert.equal(this.stepView.byId("idDataReduction").getVisible(), false, "Data reduction layout is not visible for new step");
		assert.equal(this.stepView.byId("idDataReductionLabel").getVisible(), false, "Data reduction label is not visible for new step");
		assert.equal(this.stepView.byId("idDataReductionRadioButton").getVisible(), false, "Data reduction radio buttons is not visible for new step");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getVisible(), false, "Data Records label is not visible for new step");
		assert.equal(this.stepView.byId("idCustomRecordValue").getVisible(), false, "Custom data record input is not visible for new step");
		assert.equal(this.stepView.byId("idStepSortLayout").getVisible(), false, "Sort layout not visible for new step");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getRequired(), false, "Data record is not mandatory when Top N is selected for the step");
		assert.equal(this.stepView.byId("idCustomRecordValue").isMandatory, false, "Mandatory tag is removed from the input field if a given values is set as Top N");
		//check the visibility of filter mapping field for the new step
		assert.equal(this.stepView.byId("idFilterMapping").getVisible(), false, "Filter mapping is hidden for new step");
		assert.equal(this.stepView.byId("idFilterMapSourceLabel").getVisible(), false, "Filter mapping is hidden for new step");
		assert.equal(this.stepView.byId("idFilterMapSourceSelect").getVisible(), false, "Filter mapping is hidden for new step");
		assert.equal(this.stepView.byId("idFilterMapEntityLabel").getVisible(), false, "Filter mapping is hidden for new step");
		assert.equal(this.stepView.byId("idFilterMapEntitySelect").getVisible(), false, "Filter mapping is hidden for new step");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterLabel").getVisible(), false, "Filter mapping is hidden for new step");
		assert.equal(this.stepView.byId("idFilterMapTargetFilterCombo").getVisible(), false, "Filter mapping layout is hidden for new step");
		assert.equal(this.stepView.byId("idFilterMapKeepSourceLabel").getVisible(), false, "Filter mapping layout is hidden for new step");
		assert.equal(this.stepView.byId("idFilterKeepSourceCheckBox").getVisible(), false, "Filter mapping layout is hidden for new step");
	});
	QUnit.test("Test handleChangeForDataReduction of step - When there is no Top N settings", function(assert) {
		var self = this;
		var oEvent = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getSelectedButton = function() {
					var oButton = {};
					oButton.getText = function() {
						return self.oModelerInstance.modelerCore.getText("noDataReduction");
					};
					return oButton;
				};
				return selectedItem;
			}
		};
		this.stepController.handleChangeForDataReduction(oEvent);
		assert.equal(this.stepController.step.getTopN(), undefined, "Top N is undefined for the step by default");
		assert.equal(this.stepView.byId("idDataReductionRadioGroup").getSelectedButton().getText(), this.oModelerInstance.modelerCore.getText("noDataReduction"), "By default No Data Reduction is selected for the Top N");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getVisible(), false, "Data Records label is not visible for the step which does not have Top N");
		assert.equal(this.stepView.byId("idCustomRecordValue").getVisible(), false, "Custom data record input is not visible for the step which does not have Top N");
		assert.equal(this.stepView.byId("idStepSortLayout").getVisible(), false, "Sort layout not visible for the step which does not have Top N");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getRequired(), false, "Data record is not mandatory when Top N is selected for the step");
		assert.equal(this.stepView.byId("idCustomRecordValue").isMandatory, false, "Mandatory tag is removed from the input field if a given values is set as Top N");
	});
	QUnit.test("Test handleChangeForDataReduction of step - When there is Default Top N settings", function(assert) {
		var self = this;
		sinon.stub(this.stepController.step, "getSelectProperties", function() {
			return [ "property1" ];
		});
		var oEvent = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getSelectedButton = function() {
					var oButton = {};
					oButton.getText = function() {
						return self.oModelerInstance.modelerCore.getText("topN");
					};
					return oButton;
				};
				return selectedItem;
			}
		};
		this.stepController.handleChangeForDataReduction(oEvent);
		assert.deepEqual(this.stepController.step.getTopN().orderby[0].property, "property1", "First select property is set at sort field for step by default");
		assert.deepEqual(this.stepController.step.getTopN().orderby[0].ascending, true, "Asceding is true for first select propert in step by default");
		assert.equal(this.stepView.byId("idDataReductionRadioGroup").getSelectedButton().getText(), this.oModelerInstance.modelerCore.getText("noDataReduction"), "By default No Data Reduction is selected for the Top N");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getVisible(), true, "Data Records label is visible for the step which does not have Top N");
		assert.equal(this.stepView.byId("idCustomRecordValue").getVisible(), true, "Custom data record input is visible for the step which does not have Top N");
		assert.equal(this.stepView.byId("idStepSortLayout").getVisible(), true, "Sort layout visible for the step which does not have Top N");
		assert.equal(this.stepView.byId("idDataRecordsLabel").getRequired(), true, "Data record is mandatory when Top N is selected for the step");
		assert.equal(this.stepView.byId("idCustomRecordValue").isMandatory, true, "Mandatory tag is added to the input field if a given values is set as Top N");
		this.stepController.step.getSelectProperties.restore();
	});
	QUnit.test("Test handleChangeForDataRecordInputValue of step - when null value is provided as Top N record number", function(assert) {
		var self = this;
		var oEventWithNullValue = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getValue = function() {
					return "";
				};
				selectedItem.setValueState = function(state) {
					self.stepView.byId("idCustomRecordValue").setValueState(state);
				};
				selectedItem.setValueStateText = function(sText) {
					self.stepView.byId("idCustomRecordValue").setValueStateText(sText);
				};
				return selectedItem;
			}
		};
		this.stepController.handleChangeForDataRecordInputValue(oEventWithNullValue); //null value is given in the input field
		assert.equal(this.stepController.getValidationState(), false, "Step is not in valid state since the top N value is not enetered in the input field");
	});
	QUnit.test("Test handleChangeForDataRecordInputValue of step - when 0 value is provided as Top N record number", function(assert) {
		var self = this;
		var oEventWithNullValue = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getValue = function() {
					return "0";
				};
				selectedItem.setValueState = function(state) {
					self.stepView.byId("idCustomRecordValue").setValueState(state);
				};
				selectedItem.setValueStateText = function(sText) {
					self.stepView.byId("idCustomRecordValue").setValueStateText(sText);
				};
				return selectedItem;
			}
		};
		this.stepController.handleChangeForDataRecordInputValue(oEventWithNullValue); //zero value is given in the input field
		assert.equal(this.stepView.byId("idCustomRecordValue").getValueState(), "Error", "Input field for data records is not in valid state since the top N value is not valid");
	});
	QUnit.test("Test handleChangeForDataRecordInputValue of step - when float value is provided as Top N record number", function(assert) {
		var self = this;
		var oEventWithNullValue = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getValue = function() {
					return "200.45";
				};
				selectedItem.setValueState = function(state) {
					self.stepView.byId("idCustomRecordValue").setValueState(state);
				};
				selectedItem.setValueStateText = function(sText) {
					self.stepView.byId("idCustomRecordValue").setValueStateText(sText);
				};
				return selectedItem;
			}
		};
		this.stepController.handleChangeForDataRecordInputValue(oEventWithNullValue); //float value is given in the input field
		assert.equal(this.stepView.byId("idCustomRecordValue").getValueState(), "Error", "Input field for data records is not in valid state since the top N value is not valid");
	});
	QUnit.test("Test handleChangeForDataRecordInputValue of step - when negative value is provided as Top N record number", function(assert) {
		var self = this;
		var oEventWithNullValue = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getValue = function() {
					return "-200";
				};
				selectedItem.setValueState = function(state) {
					self.stepView.byId("idCustomRecordValue").setValueState(state);
				};
				selectedItem.setValueStateText = function(sText) {
					self.stepView.byId("idCustomRecordValue").setValueStateText(sText);
				};
				return selectedItem;
			}
		};
		this.stepController.handleChangeForDataRecordInputValue(oEventWithNullValue); //float value is given in the input field
		assert.equal(this.stepView.byId("idCustomRecordValue").getValueState(), "Error", "Input field for data records is not in valid state since the top N value is not valid");
	});
	QUnit.test("Test handleChangeForDataRecordInputValue of step - when value greater than 32 bit integer value is provided as Top N record number", function(assert) {
		var self = this;
		var oEventWithNullValue = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getValue = function() {
					return "10001";
				};
				selectedItem.setValueState = function(state) {
					self.stepView.byId("idCustomRecordValue").setValueState(state);
				};
				selectedItem.setValueStateText = function(sText) {
					self.stepView.byId("idCustomRecordValue").setValueStateText(sText);
				};
				return selectedItem;
			}
		};
		this.stepController.handleChangeForDataRecordInputValue(oEventWithNullValue); //float value is given in the input field
		assert.equal(this.stepView.byId("idCustomRecordValue").getValueState(), "Error", "Input field for data records is not in valid state since the top N value is not valid");
	});
	QUnit.test("Test handleChangeForDataRecordInputValue of step - when valid value is provided as Top N record number", function(assert) {
		var self = this;
		var oEventWithValidValue = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getValue = function() {
					return "200";
				};
				selectedItem.setValueState = function(state) {
					self.stepView.byId("idCustomRecordValue").setValueState(state);
				};
				selectedItem.setValueStateText = function(sText) {
					self.stepView.byId("idCustomRecordValue").setValueStateText(sText);
				};
				return selectedItem;
			}
		};
		this.stepController.handleChangeForDataRecordInputValue(oEventWithValidValue); //valid value is given in the input field
		assert.equal(this.stepView.byId("idCustomRecordValue").getValueState(), "None", "Input field for data records is in valid state since the top N value is valid");
		assert.notEqual(this.stepController.step.getTopN().orderby.length, 0, "Orderby is defined for the step");
		assert.notEqual(this.stepController.step.getTopN().top, undefined, "Top N value is defined for the step");
	});
	QUnit.test("Test _setSortDataForStep for step", function(assert) {
		var oSortDataSet = this.stepView.byId("idStepSortLayout").getModel().getData();
		assert.equal(oSortDataSet.aSortRows.length, 1, "step sort data layout is available");
		oSortDataSet.aSortRows.forEach(function(oProperty) {
			assert.ok(oProperty.property, "Sort property is available :" + oProperty.property);
			assert.ok(oProperty.ascending, "Sort direction is available :" + oProperty.ascending);
			assert.ok(oProperty.aAllProperties, "Properties used for sorting are available");
		});
		this.stepController._handleChangeForAddSortRow(this.oSortDataPropertyEvent); // add sort row event
		var newSortDataItemsAfterAdd = this.stepView.byId("idStepSortLayout").getModel().getData().aSortRows;
		assert.equal(newSortDataItemsAfterAdd.length, 2, "One more sort data layout is available for the step, one sort data layout added");
		this.stepController._handleChangeForDeleteSortRow(this.oSortDataPropertyEvent); // delete sort row event
		var newSortDataItemsAfterDelete = this.stepView.byId("idStepSortLayout").getModel().getData().aSortRows;
		assert.equal(newSortDataItemsAfterDelete.length, 1, "One  sort data layout is deleted for the step");
	});
}());
