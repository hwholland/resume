jQuery.sap.declare('sap.apf.tests.integration.withDoubles.tSaveAndSaveAs');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance'); // FIXME must occur in ALL test file that require helper.js
jQuery.sap.require('sap.apf.tests.integration.withDoubles.helper');
jQuery.sap.require('sap.apf.tests.integration.withDoubles.persistenceHelper');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.uiApi');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require('sap.apf.testhelper.doubles.request');
jQuery.sap.require('sap.apf.testhelper.doubles.representation');
jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
jQuery.sap.require('sap.apf.Component');
jQuery.sap.require('sap.apf.ui.instance');
jQuery.sap.require("jquery.sap.storage");

module('Save, Save As AnalysisPath Integration Tests', {
	/* globals setTimeout */
	setup : function() {
		sap.apf.tests.integration.withDoubles.helper.saveConstructors();
		sap.apf.tests.integration.withDoubles.persistenceHelper.setup(this);
		this.oGlobalApi = sap.apf.testhelper.doubles.UiApi();
		this.oGlobalApi.oCoreApi.loadApplicationConfig("pathOfNoInterest");
		this.oGlobalApi.oCoreApi.setContext(sap.apf.tests.integration.withDoubles.helper.defineFilter(this.oGlobalApi.oCoreApi, {
			"SAPClient" : "777"
		}));
		sap.apf.tests.integration.withDoubles.persistenceHelper.init();
		this.spyGetLayoutView = function() {
			this.layout = new sap.ui.layout.VerticalLayout();
			this.layout.getController = function() {
				this.resetAllFilters = function(param) {
					return param;
				};
				this.setMasterTitle = function() {
					return null;
				};
				this.setDetailTitle = function() {
					return null;
				};
				this.setMasterHeaderButton = function() {
					return null;
				};
				this.addMasterFooterContentLeft = function() {
					return null;
				};
				this.detailTitleRemoveAllContent = function() {
					return null;
				};
				return this;
			};
			return this.layout;
		};
		this.spy1 = sinon.spy(this.spyGetLayoutView);
		sinon.stub(this.oGlobalApi.oUiApi, "getLayoutView", this.spy1);
		this.analysisPath = this.oGlobalApi.oUiApi.getAnalysisPath();
		this.analysisPathController = this.analysisPath.getController();
		this.stepContainer = this.oGlobalApi.oUiApi.getStepContainer();
		this.stepContainerController = this.stepContainer.getController();
	},
	teardown : function() {
		var self = this;
		sap.apf.tests.integration.withDoubles.helper.restoreConstructors();
		sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
		this.oGlobalApi.oContext.oCompContainer.destroy();
		if (jQuery(".sapMDialog").length > 0) {
			sap.ui.getCore().byId(jQuery(".sapMDialog")[jQuery(".sapMDialog").length - 1].getAttribute("id")).attachAfterClose(function() {
				self.oGlobalApi.oUiApi.getLayoutView.restore();
			});
		}
		if ((jQuery(".sapCaUiHSD").length) !== 0) {
			sap.ui.getCore().byId(jQuery(".sapCaUiHSD")[0].id).destroy();
		}
	},
	createThreeSteps : function() {
		this.oStep1 = this.oGlobalApi.oCoreApi.createStep("stepTemplate1", function() {
			return;
		});
		this.oStep2 = this.oGlobalApi.oCoreApi.createStep("stepTemplate3", function() {
			return;
		});
		this.oStep3 = this.oGlobalApi.oCoreApi.createStep("stepTemplate1", function() {
			return;
		});
	}
});
function findDialogByTitle(title) {
	var oExpectedDialog;
	jQuery.each(jQuery('.sapMDialog'), function(name, element) {
		var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
		if (oDialog.getTitle() === title) {
			oExpectedDialog = oDialog;
		}
	});
	return oExpectedDialog;
}
asyncTest("Testss SAVE, SAVE AS of a path", function() {
	expect(5);
	this.createThreeSteps();
	this.oGlobalApi.oCoreApi.savePath("myPath", callbackSave.bind(this)); //Save atleast one path as save dialog is called only in success call back of readpaths
	function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
		equal(oEntityTypeMetadata.type, "entityTypeMetadata", "Correct type of metadata");
		equal(oMessageObject, undefined, "Message object expected undefined");
	}
	this.oGlobalApi.oUiApi.getAnalysisPath().getToolbar().oActionListItem.getItems()[2].firePress();
	var self = this;
	var saveDialog = findDialogByTitle("Save Analysis Path");
	self.oGlobalApi.oUiApi.getAnalysisPath().getToolbar().getController().oInput.setValue("newPathSaved");
	saveDialog.getBeginButton().setEnabled(true);// enabling the save button
	saveDialog.getBeginButton().firePress();// saving the path
	equal(self.oGlobalApi.oUiApi.getAnalysisPath().oSavedPathName.getTitle(), "newPathSaved", "Title set correctly to analysis path.Path Saved Successfully");
	setTimeout(function() {
		self.oGlobalApi.oUiApi.getAnalysisPath().getToolbar().oActionListItem.getItems()[3].firePress();
		self.oGlobalApi.oUiApi.getAnalysisPath().getToolbar().getController().oInput.getParent().attachAfterOpen(function() {
			var saveDialog = findDialogByTitle("Save Analysis Path");
			saveDialog.getBeginButton().setEnabled(true);// enabling the save button
			saveDialog.getBeginButton().firePress();// saving the path
			setTimeout(function() {
				var existingPathDialog = findDialogByTitle("Caution");
				existingPathDialog.getBeginButton().firePress();// saving the existing name path
				equal(self.oGlobalApi.oUiApi.getAnalysisPath().oSavedPathName.getTitle(), "newPathSaved", "Title set correctly to analysis path.Path Updated Successfully");
				self.oGlobalApi.oCoreApi.readPaths(callbackRead.bind(self));
				function callbackRead(oResponse) {
					self.oGlobalApi.oCoreApi.removeStep(self.oStep2, function() {
						return;
					});
					self.oGlobalApi.oUiApi.getAnalysisPath().getToolbar().oActionListItem.getItems()[3].firePress();
					var saveAsDialog = findDialogByTitle("Save Analysis Path");
					self.oGlobalApi.oUiApi.getAnalysisPath().getToolbar().getController().oInput.setValue("modifiedPathSaved");
					saveAsDialog.getBeginButton().setEnabled(true);// enabling the save button
					saveAsDialog.getBeginButton().firePress();// saving the path
					equal(self.oGlobalApi.oUiApi.getAnalysisPath().oSavedPathName.getTitle(), "modifiedPathSaved", "Title set correctly to analysis path.Path Updated Successfully");
					start();
				}
			}, 500);
		});
	}, 500);
});