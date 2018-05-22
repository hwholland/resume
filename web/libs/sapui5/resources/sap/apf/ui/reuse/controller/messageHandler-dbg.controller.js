/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global window*/
/**
 **@class messageHandler
 **@name messageHandler 
 **@memberOf sap.apf.ui.reuse.controller
 **@description controller for view.messageHandler
 * 
 */
/**/
jQuery.sap.require("sap.m.MessageBox");
(function() {
	'use strict';
	var oViewData;
	function _createMessageText(oMessageObject) {
		var text = oMessageObject.getMessage();
		while (oMessageObject.getPrevious()) {
			oMessageObject = oMessageObject.getPrevious();
			text = text + '\n' + oMessageObject.getMessage();
		}
		return text;
	}
	function _closeApplication() {
		window.history.go(-1);
	}
	function _showInfoMessageBox(oController, oMessageObject) {
		sap.m.MessageBox.information(oMessageObject.getMessage(), {
			styleClass : sap.ui.Device.system.desktop ? "sapUiSizeCompact" : ""
		});
	}
	function _showSuccessMsgToast(oController, oMessageObject) {
		sap.m.MessageToast.show(oMessageObject.getMessage(), {
			width : "20em"
		});
	}
	function _checkIsSessionTimeOut(oController) {
		var aLogMessages = oViewData.oCoreApi.getLogMessages();
		var bSessionTimeOut = false;
		for( var i = 0; i < aLogMessages.length; i++) {
			if (aLogMessages[i].search(5021) !== -1) {
				bSessionTimeOut = true;
				break;
			}
		}
		return bSessionTimeOut;
	}
	function _openDetailedLogDialog(oController, oMessageObject) {
		var oDetailLogDialog = new sap.m.Dialog({
			title : oMessageObject.getSeverity(),
			type : sap.m.DialogType.Message,
			state : sap.ui.core.ValueState.Error,
			content : new sap.ui.core.HTML({
				content : [ '<div><p> ' + jQuery.sap.encodeHTML(_createMessageText(oMessageObject)) + '</p></div>' ].join(""),
				sanitizeContent : true
			}),
			beginButton : new sap.m.Button({
				text : oViewData.oCoreApi.getTextNotHtmlEncoded("close"),
				press : function() {
					oDetailLogDialog.close();
				}
			}),
			afterClose : function() {
				oDetailLogDialog.destroy();
			}
		});
		oDetailLogDialog.setInitialFocus(oDetailLogDialog);
		oDetailLogDialog.open();
	}
	function _showFatalErrorDialog(oController, oMessageObject) {
		var bSessionTimeOut = _checkIsSessionTimeOut(oController);
		var oDialog = new sap.m.Dialog({
			title : oMessageObject.getSeverity(),
			type : sap.m.DialogType.Message,
			state : sap.ui.core.ValueState.Error,
			content : [ new sap.m.Text({
				text : bSessionTimeOut ? oViewData.oCoreApi.getTextNotHtmlEncoded("application-reload") : oMessageObject.getMessage()
			}), new sap.m.VBox({
				alignItems : sap.m.FlexAlignItems.End,
				items : [ new sap.m.Link({
					text : oViewData.oCoreApi.getTextNotHtmlEncoded("showDetails"),
					press : function() {
						_openDetailedLogDialog(oController, oMessageObject);
					}
				}) ]
			}) ],
			beginButton : new sap.m.Button({
				text : oViewData.oCoreApi.getTextNotHtmlEncoded("ok"),
				press : function() {
					_closeApplication();
				}
			}),
			afterClose : function() {
				oDialog.destroy();
			}
		});
		oDialog.setInitialFocus(oDialog);
		oDialog.open();
	}
	sap.ui.controller("sap.apf.ui.reuse.controller.messageHandler", {
		onInit : function() {
			var oController = this;
			if (sap.ui.Device.system.desktop) {
				oController.getView().addStyleClass("sapUiSizeCompact");
			}
			oViewData = oController.getView().getViewData();
		},
		showMessage : function(oMessageObject) {
			var oController = this;
			var severity = oMessageObject.getSeverity();
			switch (severity) {
				case sap.apf.core.constants.message.severity.fatal:
					oViewData.uiApi.getLayoutView().setBusy(false);
					_showFatalErrorDialog(oController, oMessageObject);
					break;
				case sap.apf.core.constants.message.severity.error:
					oViewData.uiApi.getLayoutView().setBusy(false);
					break;
				case sap.apf.core.constants.message.severity.information:
					_showInfoMessageBox(oController, oMessageObject);
					break;
				case sap.apf.core.constants.message.severity.success:
					_showSuccessMsgToast(oController, oMessageObject);
					break;
				default:
					jQuery.sap.log.error("Error type not defined");
					break;
			}
			if (severity === sap.apf.core.constants.message.severity.warning || severity === sap.apf.core.constants.message.severity.error) {
				sap.m.MessageToast.show(oMessageObject.getMessage(), {
					width : "40%",
					offset : "0 -50",
					animationDuration : 2000
				});
			}
		}
	});
}());