jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
(function() {
	'use strict';
	var oModelerInstance, oNavigationTargetView, spyOnConfigEditorSetIsUnsaved, spyOnInit, setDetailDataSpy;
	var spyOnNavTargetGetSemanticObj, spyOnNavTargetGetAction, spyOnNavTargetSetSemanticObj, spyOnNavTargetSetAction, spyOnUpdateSelectedNode, spyOnUpdateTitleAndBreadCrumb, spyOnSetNavigationTargetName;
	var spyOnNavTargetSetGlobal, spyOnNavTargetSetStepSpecific, spyOnGetAllAvailableSemanticObjects, spyOnGetSemanticActions;
	function _getAllAvailableSemanticObjectsStub(callBackFn) {
		var aSemanticObjects = [ {
			id : "FioriApplication"
		}, {
			id : "APFI2ANav"
		}, {
			id : "Account"
		} ];
		var messageObject;
		callBackFn(aSemanticObjects, messageObject);
	}
	function _getSemanticActionsStub(args) {
		var oSemanticActionsForFioriApplication = {
			semanticActions : [ {
				id : "executeAPFConfiguration",
				text : "Execute APF Configuration"
			}, {
				id : "analyzeKPIDetails",
				text : "Analyze KPI Details"
			} ]
		};
		var oSemanticActionsForAPFI2ANav = {
			semanticActions : [ {
				id : "analyzeKPIDetails",
				text : "Analyze KPI Details"
			}, {
				id : "launchNavTarget",
				text : "Detailed Analysis"
			} ]
		};
		var oSemanticActionsForUserInputSemanticObj = {
			semanticActions : []
		};
		var oDeferredForSemanticActions = new jQuery.Deferred();
		if (args === "FioriApplication") {
			oDeferredForSemanticActions.resolve(oSemanticActionsForFioriApplication);
		} else if (args === "APFI2ANav") {
			oDeferredForSemanticActions.resolve(oSemanticActionsForAPFI2ANav);
		} else if (args === "Account" || args === "UserInputSemanticObject") {
			oDeferredForSemanticActions.resolve(oSemanticActionsForUserInputSemanticObj);
		}
		return oDeferredForSemanticActions.promise();
	}
	function _instantiateView(sId, assert) {
		var oNavigationTargetController = new sap.ui.controller("sap.apf.modeler.ui.controller.navigationTarget");
		spyOnInit = sinon.spy(oNavigationTargetController, "onInit");
		setDetailDataSpy = sinon.spy(oNavigationTargetController, "setDetailData");
		spyOnGetAllAvailableSemanticObjects = sinon.stub(oModelerInstance.modelerCore, "getAllAvailableSemanticObjects", _getAllAvailableSemanticObjectsStub);
		spyOnGetSemanticActions = sinon.stub(oModelerInstance.modelerCore, "getSemanticActions", _getSemanticActionsStub);
		var oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.navigationTarget",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oNavigationTargetController,
			viewData : {
				updateSelectedNode : oModelerInstance.updateSelectedNode,
				updateTitleAndBreadCrumb : oModelerInstance.updateTitleAndBreadCrumb,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				getText : oModelerInstance.modelerCore.getText,
				getAllAvailableSemanticObjects : spyOnGetAllAvailableSemanticObjects,
				getSemanticActions : spyOnGetSemanticActions,
				createMessageObject : oModelerInstance.modelerCore.createMessageObject,
				putMessage : oModelerInstance.modelerCore.putMessage,
				setNavigationTargetName : oModelerInstance.setNavigationTargetName,
				oParams : {
					name : "navigationTarget",
					arguments : {
						configId : oModelerInstance.tempUnsavedConfigId,
						navTargetId : sId
					}
				}
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then navigation target onInit function is called and view is initialized in setup module");
		assert.strictEqual(setDetailDataSpy.calledOnce, true, "then navigation target setDetailData function is called in initial setup");
		assert.strictEqual(spyOnGetAllAvailableSemanticObjects.calledOnce, true, "then all semantic objects are fetched");
		return oView;
	}
	function _oEventStub(sSemanticObject) {
		return {
			getParameter : function() {
				return sSemanticObject;
			}
		};
	}
	function _getInfoToUpdateSelectedNode(id, oNavTarget, sDescription) {
		return {
			id : id,
			icon : oNavTarget.isGlobal() ? "sap-icon://BusinessSuiteInAppSymbols/icon-where-used" : "sap-icon://pushpin-off",
			name : sDescription
		};
	}
	function _getDataToUpdateNavTargetName(id, sDescription) {
		return {
			key : id,
			value : sDescription
		};
	}
	QUnit.module("Test for navigation target with semantic object and action from list", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				spyOnNavTargetGetSemanticObj = sinon.spy(oModelerInstance.firstNavigationtarget, "getSemanticObject");
				spyOnNavTargetGetAction = sinon.spy(oModelerInstance.firstNavigationtarget, "getAction");
				spyOnNavTargetSetSemanticObj = sinon.spy(oModelerInstance.firstNavigationtarget, "setSemanticObject");
				spyOnNavTargetSetAction = sinon.spy(oModelerInstance.firstNavigationtarget, "setAction");
				spyOnNavTargetSetGlobal = sinon.spy(oModelerInstance.firstNavigationtarget, "setGlobal");
				spyOnNavTargetSetStepSpecific = sinon.spy(oModelerInstance.firstNavigationtarget, "setStepSpecific");
				//instantiate the view
				oNavigationTargetView = _instantiateView(oModelerInstance.firstNavigationTargetId, assert);
				assert.strictEqual(spyOnGetSemanticActions.calledOnce, true, "then semantic actions for a particular semantic object fetched");
				spyOnUpdateSelectedNode = sinon.spy(oNavigationTargetView.getViewData(), "updateSelectedNode");
				spyOnUpdateTitleAndBreadCrumb = sinon.spy(oNavigationTargetView.getViewData(), "updateTitleAndBreadCrumb");
				spyOnSetNavigationTargetName = sinon.spy(oNavigationTargetView.getViewData(), "setNavigationTargetName");
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
			oModelerInstance.modelerCore.getAllAvailableSemanticObjects.restore();
			oModelerInstance.modelerCore.getSemanticActions.restore();
			oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oNavigationTargetView.destroy();
		}
	});
	QUnit.test("When Navigation Target is initialized", function(assert) {
		//arrange
		var divToPlaceNavigationTarget = document.createElement("div");
		divToPlaceNavigationTarget.setAttribute('id', 'contentOfNT');
		document.body.appendChild(divToPlaceNavigationTarget);
		oNavigationTargetView.placeAt("contentOfNT");
		sap.ui.getCore().applyChanges();
		var focusedElement = document.activeElement;
		//assert
		assert.ok(oNavigationTargetView, "then Navigation target view exists");
		//navigation target sub view assert
		assert.ok(oNavigationTargetView.byId("idContextMappingView"), "then Navigation target Context Mapping View is instantiated");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 4, "then getSemanticObject function is called 4 times for existing navigation target");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 2, "then getAction function is called twice for existing navigation target");
		//navigation target semantic object field asserts
		assert.deepEqual(document.body, focusedElement, "Since Navigation target exists already " +
				"so body has focus instead semantic object field");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "FioriApplication", "then Semantic object is set from list for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectLabel").getRequired(), true, "then semantic object label is set as mandatory");
		//navigation target action fields field asserts
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "executeAPFConfiguration", "then Action is set from list of actions for the semantic object");
		assert.strictEqual(oNavigationTargetView.byId("idActionLabel").getRequired(), true, "then action label is set as mandatory");
		//navigation target description field asserts
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Execute APF Configuration", "then Description is set as action text on init for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), oModelerInstance.modelerCore.getText("globalNavTargets"), "then Navigation target type is set");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), false, "then Assigned step label is not visible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), false, "then Assigned step combo is not visible");
		document.body.removeChild(document.getElementById('contentOfNT'));
	});
	QUnit.test("When navigation target view data has to be reset", function(assert) {
		//arrangement
		var spyOnGetNavTarget = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getNavigationTarget");
		var spyFireEvent = sinon.spy(oNavigationTargetView, "fireEvent");
		//action
		oNavigationTargetView.getController().updateSubViewInstancesOnReset(oNavigationTargetView.getViewData().oConfigurationEditor);
		//assertions
		assert.strictEqual(spyOnGetNavTarget.calledOnce, true, "then navigation target object is fetched after reset");
		assert.strictEqual(spyFireEvent.calledWith("updateSubViewInstancesOnResetEvent"), true, "then navigation target context mapping view is updated with new instances of editor and navigation target objects");
		//cleanup
		oModelerInstance.configurationEditorForUnsavedConfig.getNavigationTarget.restore();
	});
	QUnit.test("When semantic object value is changed and semantic object and action is from the list", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idSemanticObjectField").setSelectedKey("APFI2ANav");
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "Analyze KPI Details");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "Analyze KPI Details");
		//action
		oNavigationTargetView.getController().handleChangeSemanticObjectValue(_oEventStub("APFI2ANav"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "APFI2ANav", "then Semantic object is changed for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "analyzeKPIDetails", "then First action is set from list of actions for the changed semantic object");
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Analyze KPI Details", "then Description is set as action text");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledOnce, true, "then setSemanticObject function is called once");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledWith("APFI2ANav"), true, "then setSemanticObject function is called with correct arguments");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 5, "then getSemanticObject function is called 5 times");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 3, "then getAction for changed semantic object is called 3 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith(oModelerInstance.modelerCore.getText("navigationTarget") + ": " + "Analyze KPI Details"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When semantic object value is changed and semantic object is present in list and there are no available actions for that semantic object", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idSemanticObjectField").setSelectedKey("Account");
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "Account");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "Account");
		//action
		oNavigationTargetView.getController().handleChangeSemanticObjectValue(_oEventStub("Account"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "Account", "then Semantic object is changed");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "", "then action field is set to empty since no actions are available for that Semantic object");
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Account", "then Description is set same as semantic object");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledOnce, true, "then setSemanticObject function is called once");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledWith("Account"), true, "then setSemanticObject function is called with correct arguments");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 6, "then getSemanticObject function is called 6 times");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 2, "then getAction for changed semantic object is called twice");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith(oModelerInstance.modelerCore.getText("navigationTarget") + ": " + "Account"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When semantic object value is changed and semantic object is an user input", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idSemanticObjectField").setValue("UserInputSemanticObject");
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "UserInputSemanticObject");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "UserInputSemanticObject");
		//action
		oNavigationTargetView.getController().handleChangeSemanticObjectValue(_oEventStub("UserInputSemanticObject"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "UserInputSemanticObject", "Semantic object is changed for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "", "Action is set to empty as user input semantic object does not have any actions");
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "UserInputSemanticObject", "Description is set as the semantic object when semantic object is not from the list");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledOnce, true, "then setSemanticObject function is called once");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledWith("UserInputSemanticObject"), true, "then setSemanticObject function is called with correct arguments");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 6, "then getSemanticObject function is called 6 times");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 2, "then getAction for changed semantic object is called twice");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith(oModelerInstance.modelerCore.getText("navigationTarget") + ": " + "UserInputSemanticObject"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When semantic object value is changed and it is set to empty", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idSemanticObjectField").setValue("");
		//action
		oNavigationTargetView.getController().handleChangeSemanticObjectValue(_oEventStub(""));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "", "Semantic object is changed and set to empty");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "executeAPFConfiguration", "Action is not changed and remains the same as before");
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Execute APF Configuration", "Description is not changed and remains the same as before");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledOnce, false, "then setSemanticObject function is not called");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 4, "then getSemanticObject function is called 4 times");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 2, "then getAction for changed semantic object is called twice");
		assert.strictEqual(spyOnUpdateSelectedNode.called, false, "then the tree node is not updated and remains same as before");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.called, false, "then the title and breadcrumb is not updated and remains same as before");
		assert.strictEqual(spyOnSetNavigationTargetName.called, false, "then setNavigationTargetName is not called");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When action is changed from existing list of actions", function(assert) {
		//arrangement
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "Analyze KPI Details");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "Analyze KPI Details");
		oNavigationTargetView.byId("idActionField").setSelectedKey("analyzeKPIDetails");
		//action
		oNavigationTargetView.getController().handleChangeofAction(_oEventStub("analyzeKPIDetails"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Analyze KPI Details", "then Action text is set as description for changed action present in the list");
		assert.strictEqual(spyOnNavTargetSetAction.calledOnce, true, "then setAction function is called once");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 4, "then getAction function is called 4 times");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 4, "then getSemanticObject function is called 4 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith(oModelerInstance.modelerCore.getText("navigationTarget") + ": " + "Analyze KPI Details"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When action is changed and it is not present in the list of available actions for a particular semantic object(USER ACTION)", function(assert) {
		//arrangement
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "FioriApplication");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "FioriApplication");
		oNavigationTargetView.byId("idActionField").setValue("User Action");
		//action
		oNavigationTargetView.getController().handleChangeofAction(_oEventStub("User Action"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "FioriApplication", "then Semantic object is set as description");
		assert.strictEqual(spyOnNavTargetSetAction.calledOnce, true, "then setAction function is called once");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 4, "then getAction function is called 4 times");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 5, "then getSemanticObject function is called 5 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith(oModelerInstance.modelerCore.getText("navigationTarget") + ": " + "FioriApplication"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When action is changed and set to empty", function(assert) {
		//arrangement
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "FioriApplication");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "FioriApplication");
		oNavigationTargetView.byId("idActionField").setValue("");
		//action
		oNavigationTargetView.getController().handleChangeofAction(_oEventStub(""));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "FioriApplication", "then Semantic object is set as description when action is set as empty");
		assert.strictEqual(spyOnNavTargetSetAction.called, false, "then setAction function is not called");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 2, "then getAction function is called twice");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 5, "then getSemanticObject function is called 5 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith(oModelerInstance.modelerCore.getText("navigationTarget") + ": " + "FioriApplication"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When navigation target type is changed to step specific", function(assert) {
		//arrangement
		oModelerInstance.unsavedStepWithoutFilterMapping.addNavigationTarget(oModelerInstance.firstNavigationTargetId);
		oNavigationTargetView.byId("idNavigationTargetTypeField").setSelectedKey(oModelerInstance.modelerCore.getText("stepSpecific"));
		var expectedOutput = [ {
			stepKey : "Step-1",
			stepName : "step A"
		}, {
			stepKey : "Step-2",
			stepName : "step B"
		} ];
		var aSelectedKeys = [ "Step-1" ];
		//action
		oNavigationTargetView.getController().handleChangeOfNavigationTargetType();
		//assertions
		assert.strictEqual(spyOnNavTargetSetStepSpecific.calledOnce, true, "then setStepSpecific function is called once");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), oModelerInstance.modelerCore.getText("stepSpecific"), "then Navigation target type is changed to step specific");
		assert.strictEqual(oModelerInstance.firstNavigationtarget.isGlobal(), false, "then Navigation target is step specific");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), true, "then Assigned step label is visible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), true, "then Assigned step combo is visible");
		assert.deepEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getModel().getData().Objects, expectedOutput, "then assigned steps combobox is populated with steps available in editor");
		assert.deepEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getSelectedKeys(), aSelectedKeys, "then correct steps are selected in the combo box");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When navigation target type is changed to global", function(assert) {
		//arrangement
		oModelerInstance.unsavedStepWithoutFilterMapping.addNavigationTarget(oModelerInstance.firstNavigationTargetId);
		assert.deepEqual(oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId).length, 1, "then initially navigation target is assigned to one of the steps");
		assert.deepEqual(oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId), [ "Step-1" ], "then navigation target is assigned to Step-1");
		oNavigationTargetView.byId("idAssignedStepsCombo").setSelectedKeys(oModelerInstance.stepIdUnsavedWithoutFilterMapping);
		oNavigationTargetView.getController().handleChangeForAssignedSteps();
		oNavigationTargetView.byId("idNavigationTargetTypeField").setSelectedKey(oModelerInstance.modelerCore.getText("globalNavTargets"));
		//action
		oNavigationTargetView.getController().handleChangeOfNavigationTargetType();
		//assertions
		assert.strictEqual(spyOnNavTargetSetGlobal.calledOnce, true, "then setGlobal function is called once");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), oModelerInstance.modelerCore.getText("globalNavTargets"), "then Navigation target type is changed to global");
		assert.strictEqual(oModelerInstance.firstNavigationtarget.isGlobal(), true, "then Navigation target is set to global");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), false, "then Assigned step label is invisible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), false, "then Assigned step combo is invisible");
		assert.deepEqual(oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId).length, 0, "then there are no steps assigned to this navigation target");
		assert.deepEqual(oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId), [], "then navigation target has been removed from Step-1");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When steps assigned to a navigation target are changed", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idAssignedStepsCombo").setSelectedKeys(oModelerInstance.stepIdUnsavedWithoutFilterMapping);
		//action
		oNavigationTargetView.getController().handleChangeForAssignedSteps();
		//assertions
		assert.deepEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getSelectedKeys(), oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId),
				"Step is selected in assigned step combo");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When navigation target is in valid state fetch getValidationState", function(assert) {
		//assertion
		assert.strictEqual(oNavigationTargetView.getController().getValidationState(), true, "then navigation target is in valid state");
	});
	QUnit.test("When navigation target is not in valid state fetch getValidationState", function(assert) {
		//action
		oNavigationTargetView.byId("idSemanticObjectField").setValue("");
		//assertion
		assert.strictEqual(oNavigationTargetView.getController().getValidationState(), false, "then navigation target is not in valid state");
	});
	QUnit.test("When navigation target view is destroyed", function(assert) {
		//arrangement
		var spyDestroyOfContextMappingView = sinon.spy(oNavigationTargetView.byId("idContextMappingView"), "destroy");
		//action
		oNavigationTargetView.destroy();
		//assertion
		assert.strictEqual(spyDestroyOfContextMappingView.calledOnce, true, "then destroy is called on navTargetContextmMapping view");
	});
	QUnit.module("Test for a Navigation Target for which semantic object and action is an user input", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				spyOnNavTargetGetSemanticObj = sinon.spy(oModelerInstance.secondNavigationtarget, "getSemanticObject");
				spyOnNavTargetGetAction = sinon.spy(oModelerInstance.secondNavigationtarget, "getAction");
				spyOnNavTargetSetSemanticObj = sinon.spy(oModelerInstance.secondNavigationtarget, "setSemanticObject");
				spyOnNavTargetSetAction = sinon.spy(oModelerInstance.secondNavigationtarget, "setAction");
				//instantiate the view
				oNavigationTargetView = _instantiateView(oModelerInstance.secondNavigationTargetId, assert);
				assert.strictEqual(spyOnGetSemanticActions.calledOnce, true, "then service to fetch semantic actions for User input SO is called once which is resolved by empty array");
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
			oModelerInstance.modelerCore.getAllAvailableSemanticObjects.restore();
			oModelerInstance.modelerCore.getSemanticActions.restore();
			oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oNavigationTargetView.destroy();
		}
	});
	QUnit.test("When Navigation Target is initialized", function(assert) {
		//assert
		assert.ok(oNavigationTargetView, "then Navigation target view exists");
		//navigation target sub view assert
		assert.ok(oNavigationTargetView.byId("idContextMappingView"), "then Navigation target Context Mapping View is instantiated");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 5, "then getSemanticObject function is called 5 times for user input semantic object and action");
		assert.strictEqual(spyOnNavTargetGetAction.calledOnce, true, "then getAction function is called once for user input semantic object and action");
		//navigation target semantic object field asserts
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "UserInputSemanticObject", "then User input semantic object is set on init for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectLabel").getRequired(), true, "then semantic object label is set as mandatory");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getModel().getData().Objects.length, 3, "then semantic object field model is populated correctly");
		//navigation target action fields field asserts
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "UserAction", "then User input action is set for the user input semantic object for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idActionLabel").getRequired(), true, "then action label is set as mandatory");
		//navigation target description field asserts
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "UserInputSemanticObject", "then Description is set same as user input semantic object ");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), oModelerInstance.modelerCore.getText("stepSpecific"), "then Navigation target type is set");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), true, "then Assigned step label is visible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), true, "then Assigned step combo is visible");
	});
	QUnit.module("Test for a Navigation Target which is new", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				//instantiate the view
				oNavigationTargetView = _instantiateView("newNavigationTarget", assert);
				assert.strictEqual(spyOnGetSemanticActions.calledOnce, false, "then actions for a new navigation target are not fetched since SO is undefined");
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
			oModelerInstance.modelerCore.getAllAvailableSemanticObjects.restore();
			oModelerInstance.modelerCore.getSemanticActions.restore();
			oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oNavigationTargetView.destroy();
		}
	});
	QUnit.test("When Navigation Target is initialized", function(assert) {
		//arrange
		var divToPlaceNavigationTarget = document.createElement("div");
		divToPlaceNavigationTarget.setAttribute('id', 'contentOfNT');
		document.body.appendChild(divToPlaceNavigationTarget);
		oNavigationTargetView.placeAt("contentOfNT");
		sap.ui.getCore().applyChanges();
		var focusedElement = document.activeElement;
		//assert
		assert.ok(oNavigationTargetView, "then Navigation target view exists");
		//navigation target sub view assert
		assert.ok(oNavigationTargetView.byId("idContextMappingView"), "then Navigation target Context Mapping View is instantiated");
		//navigation target semantic object field asserts
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").sId, focusedElement.parentElement.id, "Since Navigation target has created as new " + "so semantic object field has focus on it ");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "", "Semantic object is set as empty for a new navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectLabel").getRequired(), true, "then semantic object label is set as mandatory");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getModel().getData().Objects.length, 3, "then semantic object field model is populated correctly");
		//navigation target action fields field asserts
		assert.equal(oNavigationTargetView.byId("idActionField").getValue(), "", "Action is set as empty for new navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idActionLabel").getRequired(), true, "then action label is set as mandatory");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getModel().getData().Objects.length, 0, "then action field is not populated unless semantic object from list is chosen");
		//navigation target description field asserts
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "", "then Description is set as empty for a new navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), oModelerInstance.modelerCore.getText("globalNavTargets"), "then Navigation target type is set");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), false, "then Assigned step label is not visible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), false, "then Assigned step combo is not visible");
		document.body.removeChild(document.getElementById('contentOfNT'));
	});
}());