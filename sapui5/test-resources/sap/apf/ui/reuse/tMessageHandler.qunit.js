jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
(function() {
	'use strict';
	var oGlobalApi, oView;
	function doNothing() {
	}
	function layoutStub() {
		return new sap.m.App();
	}
	function getDialogByTitleKey(key) {
		sap.ui.getCore().applyChanges();
		var title = oGlobalApi.oCoreApi.getTextNotHtmlEncoded(key);
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function(name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			if (title.indexOf(oDialog.getTitle()) !== -1 && oDialog.getTitle() !== "") { // matching even if text resource missing
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	function removeMessageToast() {
		if (jQuery('.sapMMessageToast').length > 0) {
			jQuery('.sapMMessageToast').remove();
		}
	}
	QUnit.module('Message Handler', {
		beforeEach : function() {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			oView = oGlobalApi.oUiApi.getNotificationBar();
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test('When Calling show Message with Information Message', function(assert) {
		//arrangement
		var spyMessageBox = sinon.spy(sap.m.MessageBox, 'information');
		sinon.stub(oGlobalApi.oUiApi, 'getLayoutView', layoutStub);
		var errorMessageObject = oGlobalApi.oCoreApi.createMessageObject({
			code : "10002",
			aParameters : []
		});
		errorMessageObject.setSeverity("information");
		errorMessageObject.setMessage("This is an Information Message");
		//action
		oView.getController().showMessage(errorMessageObject);
		//assert
		assert.ok(errorMessageObject, "Then Message Object created");
		assert.strictEqual(spyMessageBox.called, true, "Then Message Toast shown");
		assert.strictEqual(spyMessageBox.getCall(0).args[0], "This is an Information Message", "Then Message Box is opened on UI");
		//cleanup
		oGlobalApi.oUiApi.getLayoutView.restore();
		spyMessageBox.restore();
	});
	QUnit.test('When Calling show Message with Error Message', function(assert) {
		//arrangement
		var spyMessageToastShow = sinon.spy(sap.m.MessageToast, 'show');
		sinon.stub(oGlobalApi.oUiApi, 'getLayoutView', layoutStub);
		var errorMessageObject = oGlobalApi.oCoreApi.createMessageObject({
			code : "10002",
			aParameters : []
		});
		errorMessageObject.setSeverity("error");
		errorMessageObject.setMessage("This is Error Message");
		//action
		oView.getController().showMessage(errorMessageObject);
		sap.ui.getCore().applyChanges();
		//assert
		assert.ok(errorMessageObject, "Then Error Message Object created");
		assert.strictEqual(spyMessageToastShow.called, true, "Then Message Toast shown");
		assert.strictEqual(spyMessageToastShow.getCall(0).args[0], "This is Error Message", "Then Message Toast shown");
		//cleanup
		oGlobalApi.oUiApi.getLayoutView.restore();
		spyMessageToastShow.restore();
		removeMessageToast();
	});
	QUnit.test('When Calling show Message with Warning Message', function(assert) {
		//arrangement
		sinon.stub(oGlobalApi.oUiApi, 'getLayoutView', layoutStub);
		var spyMessageToastShow = sinon.spy(sap.m.MessageToast, 'show');
		var warningMessageObject = new sap.apf.core.MessageObject({
			code : "10001",
			params : []
		});
		warningMessageObject.setSeverity("warning");
		warningMessageObject.setMessage("This is Warning Message");
		//action
		oView.getController().showMessage(warningMessageObject);
		sap.ui.getCore().applyChanges();
		//assert
		assert.ok(warningMessageObject, "Then Warning Message Object created");
		assert.strictEqual(spyMessageToastShow.called, true, "Then Message Toast shown");
		assert.strictEqual(spyMessageToastShow.getCall(0).args[0], "This is Warning Message", "Then Warning text is shown in toast");
		//cleanup
		oGlobalApi.oUiApi.getLayoutView.restore();
		sap.m.MessageToast.show.restore();
	});
	QUnit.test('When calling show Message with Unknown Message', function(assert) {
		//arrangement
		sinon.stub(oGlobalApi.oUiApi, 'getLayoutView', layoutStub);
		var spyUnknowError = sinon.spy(jQuery.sap.log, 'error');
		var unknownMessage = new sap.apf.core.MessageObject({
			code : "10001",
			params : []
		});
		unknownMessage.setSeverity("Unknown");
		unknownMessage.setMessage("This is Unknown Message");
		//action
		oView.getController().showMessage(unknownMessage);
		sap.ui.getCore().applyChanges();
		//assert
		assert.ok(unknownMessage, "Then Unknown Message Object created");
		assert.strictEqual(spyUnknowError.called, true, "Then unknown error is logged on console");
		//cleanup
		oGlobalApi.oUiApi.getLayoutView.restore();
		jQuery.sap.log.error.restore();
	});
	QUnit.test('When Fatal Error Happens', function(assert) {
		//arrangement
		sinon.stub(oGlobalApi.oUiApi, 'getLayoutView', layoutStub);
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		var fatalMO = new sap.apf.core.MessageObject({
			code : "10001",
			params : []
		});
		fatalMO.setSeverity("fatal");
		fatalMO.setMessage("This is Fatal Message");
		var spyLogMessages = function() {
			var a = [ "100", "101", "100" ];
			return a;
		};
		sinon.stub(oGlobalApi.oCoreApi, 'getLogMessages', spyLogMessages);
		//action
		oView.getController().showMessage(fatalMO);
		sap.ui.getCore().applyChanges();
		var dialog = getDialogByTitleKey("fatal");
		//assert
		assert.ok(fatalMO, "Then Fatal Message Object created");
		assert.strictEqual(dialog.isOpen(), true, "Error dialog is open");
		assert.strictEqual(dialog.getTitle(), "fatal", "The title of dialog is fatal");
		dialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		assert.strictEqual(navToPrevPage.calledOnce, true, "then navigates to previous page");
		// cleanups
		navToPrevPage.restore();
		oGlobalApi.oCoreApi.getLogMessages.restore();
		dialog.destroy();
	});
	QUnit.test('When Session Timeout happens', function(assert) {
		//arrangement
		sinon.stub(oGlobalApi.oUiApi, 'getLayoutView', layoutStub);
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		var getTextSpy = sinon.spy(oGlobalApi.oCoreApi, "getTextNotHtmlEncoded");
		var fatalMO = new sap.apf.core.MessageObject({
			code : "10001",
			params : []
		});
		fatalMO.setSeverity("fatal");
		fatalMO.setMessage("This is Fatal Message");
		var spyLogMessages = function() {
			var a = [ "5021", "101", "100" ];
			return a;
		};
		sinon.stub(oGlobalApi.oCoreApi, 'getLogMessages', spyLogMessages);
		//action
		oView.getController().showMessage(fatalMO);
		sap.ui.getCore().applyChanges();
		var dialog = getDialogByTitleKey("fatal");
		//assert
		assert.strictEqual(dialog.isOpen(), true, "Error dialog is open");
		assert.strictEqual(dialog.getTitle(), "fatal", "The title of dialog is fatal");
		dialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		assert.strictEqual(navToPrevPage.calledOnce, true, "then navigates to previous page");
		assert.strictEqual(getTextSpy.calledWith("application-reload"), true, "then message shown in popup for session timeout is shown correctly");
		// cleanups
		navToPrevPage.restore();
		getTextSpy.restore();
		oGlobalApi.oCoreApi.getLogMessages.restore();
		dialog.destroy();
	});
})();