jQuery.sap.declare('sap.apf.modeler.ui.tApplicationList');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var oApplicationListView, oModelerInstance, getOwnerComponentSpy, getApplicationHandlerSpy, getAppListSpy, getTextSpy, getRouterSpy;
	function _getOwnerComponentStub() {
		return {
			oCoreApi : oModelerInstance.modelerCore
		};
	}
	function _getApplicationHandlerStub(callback) {
		callback(oModelerInstance.applicationHandler);
	}
	function _getAppListStub() {
		return [ {
			Application : "1",
			ApplicationName : "app1",
			SemanticObject : "so1"
		}, {
			Application : "2",
			ApplicationName : "app2",
			SemanticObject : "so2"
		} ];
	}
	function _doNothing() {
	}
	function _getRouterStub() {
		return {
			attachRoutePatternMatched : _doNothing,
			navTo : _doNothing
		};
	}
	function _getConfigurationHandlerStub(appId, callback) {
		callback(oModelerInstance.configurationHandler);
	}
	function _getUnusedTextKeysStub(appId, callback) {
		callback("", undefined);
	}
	function _removeTextsStub(aUnusedTexts, appId, callback) {
		callback(undefined);
	}
	function _setAndSaveStub(updatedAppObject, callback, updateAppId) {
		callback("", {}, undefined);
	}
	function _editAppDescriptionandSemnaticObject() {
		oApplicationListView.getController().handleOnLiveChange();
		oApplicationListView.byId("idApplicationTable").getModel().getData().Objects[0].id = "3";
		oApplicationListView.byId("idApplicationTable").getModel().getData().Objects[0].description = "app3";
		oApplicationListView.byId("idApplicationTable").getModel().getData().Objects[0].semanticObject = "so3";
	}
	function _showDisplayModeAssertions(assert) {
		assert.strictEqual(oApplicationListView.byId("idEditButton").getVisible(), true, "then Edit button visibility is set to true");
		assert.strictEqual(oApplicationListView.byId("idSaveButton").getVisible(), false, "then Save Button visibility is set to false");
		assert.strictEqual(oApplicationListView.byId("idSaveButton").getEnabled(), false, "then Save button is disabled");
		assert.strictEqual(oApplicationListView.byId("idNewButton").getEnabled(), true, "then Add New application button is enabled");
		assert.strictEqual(oApplicationListView.byId("idTextCleanupButton").getVisible(), false, "then textpool cleanup button visibility is set to false");
		assert.strictEqual(oApplicationListView.byId("idTextCleanupButton").getEnabled(), false, "then textpool cleanup button is disabled");
		assert.strictEqual(oApplicationListView.byId("idCancelButton").getVisible(), false, "then Cancel Button visibility is set to false");
		assert.strictEqual(oApplicationListView.byId("idImportButton").getVisible(), true, "then Import Button visibility is set to true");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getMode(), "None", "then Application table mode is set to None");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getItems()[0].getType(), "Navigation", "then Navigation to configuration list page is possible");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[0].getEditable(), false, "then Application Description input is not editable");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[1].getEditable(), false, "then Semantic Object input is not editable");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].getVisible(), false, "then Delete icon visibilty is set to false");
	}
	function _showEditModeAssertions(assert) {
		assert.strictEqual(oApplicationListView.byId("idEditButton").getVisible(), false, "then Edit button visibility is set to false");
		assert.strictEqual(oApplicationListView.byId("idSaveButton").getVisible(), true, "then Save Button visibility is set to true");
		assert.strictEqual(oApplicationListView.byId("idNewButton").getEnabled(), false, "then Add New application button is disabled");
		assert.strictEqual(oApplicationListView.byId("idCancelButton").getVisible(), true, "then Cancel Button visibility is set to true");
		assert.strictEqual(oApplicationListView.byId("idTextCleanupButton").getVisible(), true, "then textpool cleanup button visibility is set to true");
		assert.strictEqual(oApplicationListView.byId("idImportButton").getVisible(), false, "then Import Button visibility is set to false");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getMode(), "SingleSelectMaster", "then Application table mode is set to None");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getItems()[0].getType(), "Inactive", "then all list items are in Inactive state with no navigation possible to configuration page");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[0].getEditable(), true, "then Application Description input is editable");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[1].getEditable(), true, "then Semantic Object input is editable");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].getVisible(), true, "then Delete icon is visibility is set to true");
		assert.ok(oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].getTooltip(), "then Delete icon tooltip is set");
	}
	QUnit.module("Application list Unit tests", {
		beforeEach : function(assert) {
			var oApplicationListController = new sap.ui.controller("sap.apf.modeler.ui.controller.applicationList");
			var spyOnInit = sinon.spy(oApplicationListController, "onInit");
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				sap.ui.core.UIComponent.extend("sap.apf.modeler.Component", {});
				getRouterSpy = sinon.stub(sap.ui.core.UIComponent, "getRouterFor", _getRouterStub);
				getOwnerComponentSpy = sinon.stub(oApplicationListController, "getOwnerComponent", _getOwnerComponentStub);
				getApplicationHandlerSpy = sinon.stub(oModelerInstance.modelerCore, "getApplicationHandler", _getApplicationHandlerStub);
				getAppListSpy = sinon.stub(oModelerInstance.applicationHandler, "getList", _getAppListStub);
				getTextSpy = sinon.spy(oModelerInstance.modelerCore, "getText");
				oApplicationListView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.applicationList",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : oApplicationListController
				});
				assert.strictEqual(spyOnInit.calledOnce, true, "then applicationList onInit function is called when view is initialized");
				done();
			});
		},
		afterEach : function() {
			getRouterSpy.restore();
			getOwnerComponentSpy.restore();
			getApplicationHandlerSpy.restore();
			getAppListSpy.restore();
			getTextSpy.restore();
			oApplicationListView.destroy();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		}
	});
	QUnit.test("When applicationList view is initialized", function(assert) {
		//arrangement
		var oExpectedData = {
			Objects : [ {
				description : "app1",
				id : "1",
				semanticObject : "so1"
			}, {
				description : "app2",
				id : "2",
				semanticObject : "so2"
			} ]
		};
		//assertions
		assert.ok(oApplicationListView, "then applicationList view exists");
		assert.strictEqual(getOwnerComponentSpy.calledOnce, true, "then getOwnerComponent of applicationList controller called once");
		assert.strictEqual(getTextSpy.calledWith("configModelerTitle"), true, "then title for entire configuration modeler application is set correctly");
		assert.strictEqual(getTextSpy.calledWith("applicationOverview"), true, "then title for application overview screen is set correctly");
		assert.strictEqual(getTextSpy.calledWith("applications"), true, "then label for displaying application count is set correctly");
		assert.strictEqual(getTextSpy.calledWith("description"), true, "then column header for description in table is set correctly");
		assert.strictEqual(getTextSpy.calledWith("semanticObject"), true, "then column header for semantic object in table is set correctly");
		assert.strictEqual(getTextSpy.calledWith("edit"), true, "then text for edit button in footer is set correctly");
		assert.strictEqual(getTextSpy.calledWith("save"), true, "then text for save button in footer is set correctly");
		assert.strictEqual(getTextSpy.calledWith("cancel"), true, "then text for cancel button in footer is set correctly");
		assert.strictEqual(getTextSpy.calledWith("textCleanUp"), true, "then text for textpool cleanup button in footer is set correctly");
		assert.strictEqual(getTextSpy.calledWith("import"), true, "then text for import button in footer is set correctly");
		assert.strictEqual(getTextSpy.calledWith("newApplication"), true, "then text for newApplication button in footer is set correctly");
		assert.strictEqual(getTextSpy.calledWith("deleteButton"), true, "then tooltip text for delete button is set correctly");
		assert.strictEqual(getApplicationHandlerSpy.calledOnce, true, "then getApplicationHandlerSpy is called once");
		assert.strictEqual(getAppListSpy.calledOnce, true, "then getAppListSpy is called once");
		assert.strictEqual(oApplicationListView.byId("idAppCount").getText(), "(2)", "then application count is set correctly");
		assert.deepEqual(oApplicationListView.byId("idApplicationTable").getModel().getData(), oExpectedData, "then model with expected data is set to the table");
		//assertions for events attached to controls
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").mEventRegistry.hasOwnProperty("addNewAppEvent"), true, "then addNewAppEvent is attached to the table");
		assert.strictEqual(oApplicationListView.byId("idApplicationTable").mEventRegistry.hasOwnProperty("updateAppListEvent"), true, "then updateAppListEvent is attached to the table");
	});
	QUnit.test("When add new application button is clicked", function(assert) {
		//action
		oApplicationListView.byId("idNewButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(oApplicationListView.getDependents()[0].getViewName(), "sap.apf.modeler.ui.view.newApplication", "then newApplication view is instantiated");
		assert.strictEqual(oApplicationListView.getDependents()[0].byId("idNewAppDialog").isOpen(), true, "then dialog to add new application is opened");
		//cleanup
		oApplicationListView.getDependents()[0].byId("idNewAppDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		oApplicationListView.removeAllDependents();
	});
	QUnit.test("When in display mode and a list item is pressed from table", function(assert) {
		//arrangement
		var mParameters = {
			listItem : oApplicationListView.byId("idApplicationTable").getItems()[0],
			srcControl : oApplicationListView.byId("idApplicationTable")
		};
		oApplicationListView.byId("idApplicationTable").fireItemPress(mParameters);
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(getRouterSpy.calledOnce, true, "then navigation to configuration list view happened");
	});
	QUnit.test("When in display mode and either description or semantic object is clicked", function(assert) {
		//arrangement
		var oEvt = {
			currentTarget : {
				id : oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[0].getId()
			}
		};
		//action
		oApplicationListView.getController().handleNavigationToConfigurationList(oEvt);
		//assertion
		assert.strictEqual(getRouterSpy.calledOnce, true, "then navigation to configuration list view happened");
	});
	QUnit.test("When edit button in footer is clicked", function(assert) {
		//action
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		_showEditModeAssertions(assert);
	});
	QUnit.test("When in edit mode and a list item is selected from table", function(assert) {
		//arrangement
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		//action
		oApplicationListView.byId("idApplicationTable").fireSelect(oApplicationListView.byId("idApplicationTable").getItems()[0]);
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(oApplicationListView.byId("idTextCleanupButton").getEnabled(), true, "then textpool cleanup button is enabled");
	});
	QUnit.test("When in edit mode description or semantic object is edited", function(assert) {
		//arrangement
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		//action
		oApplicationListView.getController().handleOnLiveChange();
		//assertion
		assert.strictEqual(oApplicationListView.byId("idSaveButton").getEnabled(), true, "then save button is enabled to save the changes made");
	});
	QUnit.test("When in edit mode,some changes are done in description and semantic object and save button in footer is clicked", function(assert) {
		//arrangement
		var setAndSaveSpy = sinon.stub(oModelerInstance.applicationHandler, "setAndSave", _setAndSaveStub);
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		_editAppDescriptionandSemnaticObject();
		//action
		oApplicationListView.byId("idSaveButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(setAndSaveSpy.calledOnce, true, "then setAndSaveSpy is called once");
		_showDisplayModeAssertions(assert);
		//cleanup
		setAndSaveSpy.restore();
	});
	QUnit.test("When in edit mode,some changes are done in description and semantic object and save button in footer is clicked and error occurs while saving", function(assert) {
		//arrangement
		var createMessageObjectSpy = sinon.spy(oModelerInstance.modelerCore, "createMessageObject");
		var putMessageSpy = sinon.spy(oModelerInstance.modelerCore, "putMessage");
		function _setAndSaveSpyLocalStub(updatedAppObject, callback, appId) {
			callback("", {}, {});
		}
		var setAndSaveSpy = sinon.stub(oModelerInstance.applicationHandler, "setAndSave", _setAndSaveSpyLocalStub);
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		_editAppDescriptionandSemnaticObject();
		//action
		oApplicationListView.byId("idSaveButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(setAndSaveSpy.calledOnce, true, "then setAndSaveSpy is called once");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11500", "then error message with correct code is logged");
		_showEditModeAssertions(assert);
		//clean up
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
		setAndSaveSpy.restore();
	});
	QUnit.test("When in edit mode and delete icon on an application list item is pressed", function(assert) {
		//action
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(oApplicationListView.getDependents()[0].getId(), "idDeleteConfirmationFragment--idDeleteConfirmation", "then delete confirmation fragment is instantiated");
		assert.strictEqual(oApplicationListView.getDependents()[0].isOpen(), true, "then delete confirmation dialog is opened");
		assert.strictEqual(getTextSpy.calledWith("confirmation"), true, "then title for delete confirmation dialog is set correctly");
		assert.strictEqual(getTextSpy.calledWith("deleteApp"), true, "then message inside delete confirmation dialog is set correctly");
		assert.strictEqual(getTextSpy.calledWith("deleteButton"), true, "then text of delete button is set correctly");
		assert.strictEqual(getTextSpy.calledWith("cancel"), true, "then text of cancel button is set correctly");
		oApplicationListView.getDependents()[0].getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		assert.strictEqual(oApplicationListView.getDependents()[0], undefined, "then on cancel press delete confirmation dialog is destroyed");
		//cleanup
		oApplicationListView.removeAllDependents();
	});
	QUnit.test("When in edit mode,for deleting a application clicking yes button on delete confirmation dialog", function(assert) {
		//arrangement
		var deleteAppStub = function(removeId, callback) {
			callback("", {}, undefined);
		};
		var deleteAppSpy = sinon.stub(oModelerInstance.applicationHandler, "removeApplication", deleteAppStub);
		//action
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].firePress();
		sap.ui.getCore().applyChanges();
		oApplicationListView.getDependents()[0].getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(deleteAppSpy.calledOnce, true, "then deleteAppSpy is called once");
		_showEditModeAssertions(assert);
		//cleanup
		deleteAppSpy.restore();
		oApplicationListView.removeAllDependents();
	});
	QUnit.test("When in edit mode and error occurs while deleting an application", function(assert) {
		//arrangement
		var createMessageObjectSpy = sinon.spy(oModelerInstance.modelerCore, "createMessageObject");
		var putMessageSpy = sinon.spy(oModelerInstance.modelerCore, "putMessage");
		var deleteAppStub = function(removeId, callback) {
			callback("", {}, {});
		};
		var deleteAppSpy = sinon.stub(oModelerInstance.applicationHandler, "removeApplication", deleteAppStub);
		//action
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		oApplicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].firePress();
		sap.ui.getCore().applyChanges();
		oApplicationListView.getDependents()[0].getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(deleteAppSpy.calledOnce, true, "then deleteAppSpy is called once");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11501", "then error message with correct code is logged");
		_showEditModeAssertions(assert);
		//cleanup
		deleteAppSpy.restore();
		oApplicationListView.removeAllDependents();
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test("When in edit mode and textpool cleanup button in footer is clicked", function(assert) {
		//arrangement
		var getConfigurationHandlerSpy = sinon.stub(oModelerInstance.modelerCore, "getConfigurationHandler", _getConfigurationHandlerStub);
		var getUnusedTextKeysSpy = sinon.stub(oModelerInstance.modelerCore, "getUnusedTextKeys", _getUnusedTextKeysStub);
		var successMsgToastSpy = sinon.spy(sap.m.MessageToast, "show");
		var removeTextsSpy = sinon.stub(oModelerInstance.textPool, "removeTexts", _removeTextsStub);
		oApplicationListView.byId("idApplicationTable").setSelectedContextPaths([ "/Objects/0" ]);
		//action
		oApplicationListView.byId("idTextCleanupButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(getConfigurationHandlerSpy.calledOnce, true, "then getConfigurationHandlerSpy is called once");
		assert.strictEqual(getUnusedTextKeysSpy.calledOnce, true, "then getUnusedTextKeys is called once");
		assert.strictEqual(removeTextsSpy.calledOnce, true, "then removeTextsSpy is called once");
		assert.strictEqual(successMsgToastSpy.calledOnce, true, "then successMsgToastSpy is called once");
		assert.strictEqual(getTextSpy.calledWith("successtextCleanup"), true, "then text shown in success message toast is correct");
		//cleanup
		getConfigurationHandlerSpy.restore();
		getUnusedTextKeysSpy.restore();
		successMsgToastSpy.restore();
		removeTextsSpy.restore();
	});
	QUnit.test("When in edit mode and textpool cleanup button in footer is clicked and error occurs while gettingUnusedTexts", function(assert) {
		//arrangement
		var createMessageObjectSpy = sinon.spy(oModelerInstance.modelerCore, "createMessageObject");
		var putMessageSpy = sinon.spy(oModelerInstance.modelerCore, "putMessage");
		var getConfigurationHandlerSpy = sinon.stub(oModelerInstance.modelerCore, "getConfigurationHandler", _getConfigurationHandlerStub);
		var successMsgToastSpy = sinon.spy(sap.m.MessageToast, "show");
		oApplicationListView.byId("idApplicationTable").setSelectedContextPaths([ "/Objects/0" ]);
		function _getUnusedTextKeysLocalStub(appId, callback) {
			callback("", "");
		}
		var getUnusedTextKeysSpy = sinon.stub(oModelerInstance.modelerCore, "getUnusedTextKeys", _getUnusedTextKeysLocalStub);
		var removeTextsSpy = sinon.stub(oModelerInstance.textPool, "removeTexts", _removeTextsStub);
		//action
		oApplicationListView.byId("idTextCleanupButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(getConfigurationHandlerSpy.calledOnce, true, "then getConfigurationHandlerSpy is called once");
		assert.strictEqual(getUnusedTextKeysSpy.calledOnce, true, "then getUnusedTextKeys is called once");
		assert.strictEqual(removeTextsSpy.calledOnce, false, "then removeTextsSpy is not called");
		assert.strictEqual(successMsgToastSpy.calledOnce, false, "then successMsgToastSpy is not called");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11506", "then error message with correct code is logged");
		//cleanup
		getConfigurationHandlerSpy.restore();
		getUnusedTextKeysSpy.restore();
		successMsgToastSpy.restore();
		removeTextsSpy.restore();
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test("When in edit mode and textpool cleanup button in footer is clicked and error occurs in removeTexts", function(assert) {
		//arrangement 
		var createMessageObjectSpy = sinon.spy(oModelerInstance.modelerCore, "createMessageObject");
		var putMessageSpy = sinon.spy(oModelerInstance.modelerCore, "putMessage");
		var getConfigurationHandlerSpy = sinon.stub(oModelerInstance.modelerCore, "getConfigurationHandler", _getConfigurationHandlerStub);
		var getUnusedTextKeysSpy = sinon.stub(oModelerInstance.modelerCore, "getUnusedTextKeys", _getUnusedTextKeysStub);
		var successMsgToastSpy = sinon.spy(sap.m.MessageToast, "show");
		oApplicationListView.byId("idApplicationTable").setSelectedContextPaths([ "/Objects/0" ]);
		function _removeTextsLocalStub(aUnusedTexts, appId, callback) {
			callback("");
		}
		var removeTextsSpy = sinon.stub(oModelerInstance.textPool, "removeTexts", _removeTextsLocalStub);
		//action
		oApplicationListView.byId("idTextCleanupButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(getConfigurationHandlerSpy.calledOnce, true, "then getConfigurationHandlerSpy is called once");
		assert.strictEqual(getUnusedTextKeysSpy.calledOnce, true, "then getUnusedTextKeys is called once");
		assert.strictEqual(removeTextsSpy.calledOnce, true, "then removeTextsSpy is called once");
		assert.strictEqual(successMsgToastSpy.calledOnce, false, "then successMsgToastSpy is not called");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11507", "then error message with correct code is logged");
		//cleanup
		getConfigurationHandlerSpy.restore();
		getUnusedTextKeysSpy.restore();
		successMsgToastSpy.restore();
		removeTextsSpy.restore();
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test("When in edit mode and there are no unsaved changes and cancel button is pressed", function(assert) {
		//action
		oApplicationListView.byId("idCancelButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		_showDisplayModeAssertions(assert);
	});
	QUnit.test("When in edit mode,there are unsaved changes and cancel button is pressed and yes button of unsaved confirmation dialog is pressed", function(assert) {
		//arrangement
		var setAndSaveSpy = sinon.stub(oModelerInstance.applicationHandler, "setAndSave", _setAndSaveStub);
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		_editAppDescriptionandSemnaticObject();
		//action
		oApplicationListView.byId("idCancelButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(oApplicationListView.getDependents()[0].getId(), "idUnsavedDataConfirmationFragment--idMessageDialog", "then unsaved message dialog fragment is instantiated");
		assert.strictEqual(oApplicationListView.getDependents()[0].isOpen(), true, "then confirmation dialog for unsaved changes is opened");
		assert.strictEqual(oApplicationListView.getDependents()[0].getButtons().length, 3, "then 3 buttons are available in the confirmation dialog for unsaved changes");
		//action - Test when yes button of confirmation dialog is pressed
		oApplicationListView.getDependents()[0].getButtons()[0].firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(setAndSaveSpy.calledOnce, true, "then setAndSaveSpy is called once");
		_showDisplayModeAssertions(assert);
		//cleanup
		oApplicationListView.removeAllDependents();
		setAndSaveSpy.restore();
	});
	QUnit.test("When in edit mode,there are unsaved changes and cancel button is pressed and no button of unsaved confirmation dialog is pressed", function(assert) {
		//arrangement
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		_editAppDescriptionandSemnaticObject();
		//action
		oApplicationListView.byId("idCancelButton").firePress();
		sap.ui.getCore().applyChanges();
		//action - Test when no button of confirmation dialog is pressed
		oApplicationListView.getDependents()[0].getButtons()[1].firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		_showDisplayModeAssertions(assert);
		//cleanup
		oApplicationListView.removeAllDependents();
	});
	QUnit.test("When in edit mode,there are unsaved changes and cancel button in footer is pressed and cancel button of unsaved confirmation dialog is pressed", function(assert) {
		//arrangement
		oApplicationListView.byId("idEditButton").firePress();
		sap.ui.getCore().applyChanges();
		_editAppDescriptionandSemnaticObject();
		//action
		oApplicationListView.byId("idCancelButton").firePress();
		sap.ui.getCore().applyChanges();
		//action - Test when no button of confirmation dialog is pressed
		oApplicationListView.getDependents()[0].getButtons()[2].firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(oApplicationListView.getDependents()[0], undefined, "then unsaved changes confirmation dialog is does not exist");
		_showEditModeAssertions(assert);
	});
	QUnit.test("When back button in application overview screen is clicked", function(assert) {
		//arrangement
		var navBackSpy = sinon.stub(window.history, "go", _doNothing);
		//action
		oApplicationListView.getController().handleNavBack();
		//assertion
		assert.strictEqual(navBackSpy.calledOnce, true, "then handler for navigating back to previous page called");
	});
	QUnit.test("When lrep is not active and import button in footer is clicked", function(assert) {
		//arrangement
		sinon.stub(oModelerInstance.modelerCore.getStartParameterFacade(), "isLrepActive", function() {
			return false;
		});
		//action
		oApplicationListView.byId("idImportButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions on Import Files dialog which opens
		assert.strictEqual(oApplicationListView.getDependents()[0].getViewName(), "sap.apf.modeler.ui.view.importFiles", "then importFiles view is instantiated");
		assert.strictEqual(oApplicationListView.getDependents()[0].byId("idImportFilesDialog").isOpen(), true, "then dialog for importFiles is opened");
		//cleanup
		oApplicationListView.getDependents()[0].byId("idImportFilesDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		oApplicationListView.removeAllDependents();
		oModelerInstance.modelerCore.getStartParameterFacade().isLrepActive.restore();
	});
	QUnit.test("When lrep is active and import button in footer is clicked", function(assert) {
		//arrangement
		//placing of view for popover assertions
		var divToPlaceAppList = document.createElement("div");
		divToPlaceAppList.setAttribute('id', 'contentOfAppList');
		document.body.appendChild(divToPlaceAppList);
		oApplicationListView.placeAt("contentOfAppList");
		sap.ui.getCore().applyChanges();
		//stubs
		sinon.stub(oModelerInstance.modelerCore.getStartParameterFacade(), "isLrepActive", function() {
			return true;
		});
		sinon.stub(oModelerInstance.modelerCore, "readAllConfigurationsFromVendorLayer", function() {
			var oDefferedCall = new jQuery.Deferred().resolve([]);
			return oDefferedCall.promise();
		});
		//action
		oApplicationListView.byId("idImportButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions for popover which opens up when lrep is active
		assert.strictEqual(jQuery(".sapMPopover").length, 1, "then popover opened on UI");
		assert.strictEqual(sap.ui.getCore().byId(jQuery(".sapMPopover")[0].id).getContent()[0].getItems().length, 2, "then popover contains two list items");
		assert.strictEqual(getTextSpy.calledWith("importDeliveredContent"), true, "then title for Import delivered content popover list item is set correctly");
		assert.strictEqual(getTextSpy.calledWith("importFiles"), true, "then title for Import Files popover list item is set correctly");
		//action - click on "Import Delivered Content from popover"
		sap.ui.getCore().byId(jQuery(".sapMPopover")[0].id).getContent()[0].getItems()[0].firePress();
		sap.ui.getCore().applyChanges();
		//assertions on import delivered content view
		assert.strictEqual(oApplicationListView.getDependents()[0].getViewName(), "sap.apf.modeler.ui.view.importDeliveredContent", "then importDeliveredContent view is instantiated");
		assert.strictEqual(oApplicationListView.getDependents()[0].byId("idImportDeliveredContentDialog").isOpen(), true, "then dialog for ImportDeliveredContent is opened");
		//cleanup
		oApplicationListView.getDependents()[0].byId("idImportDeliveredContentDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		oApplicationListView.removeAllDependents();
		//action
		oApplicationListView.byId("idImportButton").firePress();
		sap.ui.getCore().applyChanges();
		//action - click on "Import Files from popover"
		sap.ui.getCore().byId(jQuery(".sapMPopover")[0].id).getContent()[0].getItems()[1].firePress();
		sap.ui.getCore().applyChanges();
		//assertions on Import Files dialog which opens
		assert.strictEqual(oApplicationListView.getDependents()[0].getViewName(), "sap.apf.modeler.ui.view.importFiles", "then importFiles view is instantiated");
		assert.strictEqual(oApplicationListView.getDependents()[0].byId("idImportFilesDialog").isOpen(), true, "then dialog for importFiles is opened");
		//cleanup
		oApplicationListView.getDependents()[0].byId("idImportFilesDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		oApplicationListView.removeAllDependents();
		oModelerInstance.modelerCore.getStartParameterFacade().isLrepActive.restore();
		oModelerInstance.modelerCore.readAllConfigurationsFromVendorLayer.restore();
		document.body.removeChild(document.getElementById('contentOfAppList'));
	});
	QUnit.test("When a new application is saved", function(assert) {
		//arrangement
		var successMsgToastSpy = sinon.spy(sap.m.MessageToast, "show");
		//action
		oApplicationListView.getController().handleAdditionOfNewApp();
		//assertions
		assert.strictEqual(successMsgToastSpy.calledOnce, true, "then successMsgToastSpy is called once");
		assert.strictEqual(getTextSpy.calledWith("successsMsgForAppSave"), true, "then text shown in success message toast is correct");
	});
}());