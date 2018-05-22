jQuery.sap.declare('sap.apf.modeler.ui.tNewApplication');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var oNewApplicationView, getTextSpy, oApplicationHandler;
	//function to return handle change event
	function _getEvent(sValue) {
		return {
			getParameters : function() {
				return {
					value : sValue
				};
			}
		};
	}
	QUnit.module("Adding a new application", {
		beforeEach : function(assert) {
			var oNewApplicationController = new sap.ui.controller("sap.apf.modeler.ui.controller.newApplication");
			var spyOnInit = sinon.spy(oNewApplicationController, "onInit");
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				var oParentControl = new sap.m.Table();
				getTextSpy = sinon.spy(oModelerInstance.modelerCore, "getText");
				oApplicationHandler = oModelerInstance.applicationHandler;
				oNewApplicationView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.newApplication",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : oNewApplicationController,
					viewData : {
						oParentControl : oParentControl,
						oCoreApi : oModelerInstance.modelerCore
					}
				});
				assert.strictEqual(spyOnInit.calledOnce, true, "then new application onInit function is called when view is initialized");
				done();
			});
		},
		afterEach : function() {
			getTextSpy.restore();
			oNewApplicationView.destroy();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		}
	});
	QUnit.test("When new application view is initialized", function(assert) {
		//arrangement
		var oDialog = oNewApplicationView.byId("idNewAppDialog");
		//assertions
		assert.ok(oNewApplicationView, "then new application view exists");
		assert.ok(oDialog, "then Dialog to add an application exists");
		assert.strictEqual(oDialog.isOpen(), true, "then Dialog to add an application is opened on UI");
		assert.strictEqual(oNewApplicationView.byId("idDescriptionInput").getValue(), "", "then application description is blank when view is initialized");
		assert.strictEqual(oNewApplicationView.byId("idSemanticObjectInput").getValue(), "FioriApplication", "then semantic object is set to 'FioriApplication' already");
		assert.strictEqual(getTextSpy.calledWith("newApplication"), true, "then title is set correctly for new application dialog");
		assert.strictEqual(getTextSpy.calledWith("description"), true, "then text for description label is set correctly");
		assert.strictEqual(getTextSpy.calledWith("semanticObject"), true, "then text for semantic object label is set correctly");
		assert.strictEqual(getTextSpy.calledWith("save"), true, "then text for save button of dialog is set correctly");
		assert.strictEqual(getTextSpy.calledWith("cancel"), true, "then text for cancel button of dialog is set correctly");
		assert.strictEqual(oNewApplicationView.byId("idSaveButton").getEnabled(), false, "then save button of dialog is disabled since decription is blank initially");
	});
	QUnit.test("When application description is changed and valid value is given in the description field", function(assert) {
		//arrangement
		var oEvent = _getEvent("TestApplication");
		//action
		oNewApplicationView.getController().handleAppDescriptionLiveChange(oEvent);
		//assertion
		assert.strictEqual(oNewApplicationView.byId("idSaveButton").getEnabled(), true, "then Save button is enabled since application decription was provided");
	});
	QUnit.test("When application description is changed and invalid value is given in the description field", function(assert) {
		//arrangement
		var oEvent = _getEvent(" ");
		//action
		oNewApplicationView.getController().handleAppDescriptionLiveChange(oEvent);
		//assertion
		assert.strictEqual(oNewApplicationView.byId("idSaveButton").getEnabled(), false, "then Save button is disabled since application decription was not provided");
	});
	QUnit.test("When clicking on Save button of Dialog and save is successful", function(assert) {
		//arrangement
		var appObj = {
			ApplicationName : "Test Application",
			SemanticObject : "FioriApplication"
		};
		var setAndSaveStub = function(appObj, uiCallback) {
			uiCallback("", {}, undefined);
		};
		var setAndSaveSpy = sinon.stub(oApplicationHandler, "setAndSave", setAndSaveStub);
		var updateAppListSpy = sinon.spy(oNewApplicationView.getViewData().oParentControl, "fireEvent");
		oNewApplicationView.byId("idDescriptionInput").setValue("Test Application");
		oNewApplicationView.byId("idSemanticObjectInput").setValue("FioriApplication");
		//action
		oNewApplicationView.byId("idNewAppDialog").getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(setAndSaveSpy.calledOnce, true, "then modeler core method to set and save applictaion called");
		assert.deepEqual(setAndSaveSpy.getCall(0).args[0], appObj, "then modeler core setAndSave method called with correct app object");
		assert.ok(setAndSaveSpy.getCall(0).args[1] instanceof Function, "then modeler core setAndSave methods second parameter is the UI callback");
		assert.strictEqual(updateAppListSpy.calledOnce, true, "then event to update application list is fired");
		assert.strictEqual(updateAppListSpy.calledWith("addNewAppEvent"), true, "then event to update application list is fired with correct parameters");
		//cleanup
		oApplicationHandler.setAndSave.restore();
		oNewApplicationView.getViewData().oParentControl.fireEvent.restore();
	});
	QUnit.test("When clicking on Save button of Dialog and error occured in saving(messageobject is not undefined)", function(assert) {
		//arrangement
		var appObj = {
			ApplicationName : "Test Application",
			SemanticObject : "FioriApplication"
		};
		var setAndSaveStub = function(appObj, uiCallback) {
			uiCallback("", {}, true);
		};
		var setAndSaveSpy = sinon.stub(oApplicationHandler, "setAndSave", setAndSaveStub);
		var updateAppListSpy = sinon.spy(oNewApplicationView.getViewData().oParentControl, "fireEvent");
		var coreErrorMessageSpy = sinon.spy(oNewApplicationView.getViewData().oCoreApi, "putMessage");
		oNewApplicationView.byId("idDescriptionInput").setValue("Test Application");
		oNewApplicationView.byId("idSemanticObjectInput").setValue("FioriApplication");
		//action
		oNewApplicationView.byId("idNewAppDialog").getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(setAndSaveSpy.calledOnce, true, "then modeler core method to set and save applictaion called");
		assert.deepEqual(setAndSaveSpy.getCall(0).args[0], appObj, "then modeler core setAndSave method called with correct app object");
		assert.ok(setAndSaveSpy.getCall(0).args[1] instanceof Function, "then modeler core setAndSave methods second parameter is the UI callback");
		assert.strictEqual(updateAppListSpy.calledOnce, false, "then event to update application list is not fired since there was an error in saving");
		assert.strictEqual(coreErrorMessageSpy.calledOnce, true, "then error message is logged");
		//cleanup
		oApplicationHandler.setAndSave.restore();
		oNewApplicationView.getViewData().oParentControl.fireEvent.restore();
		oNewApplicationView.getViewData().oCoreApi.putMessage.restore();
	});
	QUnit.test("When clicking on Cancel button of Dialog", function(assert) {
		//action
		oNewApplicationView.byId("idNewAppDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(oNewApplicationView.bIsDestroyed, true, "then view is destroyed");
	});
}());