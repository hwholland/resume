/*
* Copyright(c) 2015 SAP SE
*/
/*global jQuery*/
// registering modules
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
// apf doubles/stubs
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.odata.savedPaths");
jQuery.sap.require("sap.apf.testhelper.stub.ajaxStub");
// the declaration.
jQuery.sap.declare('sap.apf.ui.reuse.tToolbar');
(function() {
	'use strict';
	function doNothing() {
	}
	/**
	* Executes the continuation in the afterClose event callback
	* @param {String} key
	* @param {Object} testContext
	* @param {Object} assert
	* @param {Function} continuation
	*/
	function pressOkButtonOfDialog(key, testContext, assert, continuation) {
		var done = assert.async();
		var dialog = getDialogByTitleKey(key, testContext);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	/**
	* Executes the continuation in the afterClose event callback
	* @param {String} key
	* @param {Object} testContext
	* @param {Object} assert
	* @param {Function} continuation
	*/
	function pressCancelButtonOfDialog(key, testContext, assert, continuation) {
		var done = assert.async();
		var dialog = getDialogByTitleKey(key, testContext);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getEndButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	/**
	* Executes the continuation in the afterClose event callback
	* @param {Object} assert
	* @param {Function} continuation
	*/
	function pressCancelButtonOfDialogByEmptyTitle(assert, continuation) {
		var done = assert.async();
		var dialog = getDialogByEmptyTitle();
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getEndButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	/**
	 * @function
	 * @name sap.apf.ui.reuse.tToolbar#pressButtonsOfActionListItem 
	 * @param {Object} testContext
	 * @param {Integer} Array index
	 * @description To press the buttons of ActionListItem
	 * */
	function pressButtonsOfActionListItem(testContext, arrayIndex) {
		testContext.toolbar.oActionListItem.getItems()[arrayIndex].firePress();
		sap.ui.getCore().applyChanges();
	}
	function savePathDouble(testContext) {
		return function(arg1, arg2, arg3) {
			//var guid;
			//var pathName;
			var callback;
			if (arg2 instanceof Function) {
				//pathName = arg1;
				callback = arg2;
			} else {
				//guid = arg1;
				//pathName = arg2;
				callback = arg3;
			}
			jQuery.getJSON(testContext.savedPathJson, function(data) {
				callback(data, {}, undefined);
			});
		};
	}
	/**
	* Function to search a dialog based on the title. The title is retrieved via text resource, and therefore language dependent.
	* No other alternative to find dialogs since unique ID, nor any specific css style class is available.
	* This is required mainly to distinguish different types of dialogs.
	* @param {String} key which is resolved by title text or not (not when the text resource is missing), matching is provided for both cases
	* @param {Object} testContext
	* @returns {*}
	*/
	function getDialogByTitleKey(key, testContext) {
		sap.ui.getCore().applyChanges();
		var title = testContext.oGlobalApi.oCoreApi.getTextNotHtmlEncoded(key);
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function(name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			//if (oDialog.getTitle() === title) {
			if (title.indexOf(oDialog.getTitle()) !== -1 && oDialog.getTitle() !== "") { // matching even if text resource missing
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	/**
	* Function to search a dialog based on empty string
	* @returns {*}
	*/
	function getDialogByEmptyTitle() {
		sap.ui.getCore().applyChanges();
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function(name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			if (oDialog.getTitle() === "") { // empty tile
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	QUnit.module("toolbar - Tests", {
		beforeEach : function(/* assert */) {
			var testContext = this;
			// Stub for AJAX call 
			sap.apf.testhelper.stub.stubJQueryAjax();
			// Double of UI API
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			// Usage of UI Global API
			this.savedPathJson = "/pathOfNoInterest/savedPaths.json";
			// AnalysisPath Needed to access the toolbar.
			var analysisPath = this.oGlobalApi.oUiApi.getAnalysisPath();
			// Premise for the whole test
			this.toolbar = analysisPath.getToolbar();
			this.toolbarController = this.toolbar.getController();
			this.oActionListItem = analysisPath.oActionListItem;
			//Common stubs required throughout this module
			/*Required to stub all unnecessary calls from layout controller */
			sinon.stub(this.oGlobalApi.oUiApi, "getLayoutView", function() {
				var layout = new sap.ui.layout.VerticalLayout();
				layout.getController = function() {
					return {
						addMasterFooterContentLeft : doNothing,
						enableDisableOpenIn : doNothing
					};
				};
				return layout;
			});
			/*
			* Stub required to make a dummy path with few steps in order for the save dialog to 
			 * appear else another dialog which says "No steps added" will appear
			*/
			sinon.stub(this.oGlobalApi.oCoreApi, 'getSteps', function() {
				return [ "firstStep", "secondStep", "thirdStep" ];
			});
			/* 
			 * Stub required to : 
			 * 1) Find from metadata the maximum number of paths  that are allowed to be saved in database ,
			 * 2) Find from metadata the maximum number of steps allowed in a path which has to be saved,
			 * Need this info before saving a path in order to stop saving if either of these exceeds
			 */
			sinon.stub(this.oGlobalApi.oCoreApi, 'readPaths', function(callback) {
				jQuery.getJSON(testContext.savedPathJson, function(data) {
					var metaData, metaDataValue;
					var i;
					for(i = 0; i < data.paths.length; i++) {
						data.paths[i].StructuredAnalysisPath = {
							steps : [ 2, 4 ]
						};
					}
					metaData = {
						getEntityTypeMetadata : function() {
							metaDataValue = {
								maximumNumberOfSteps : 32,
								maxOccurs : 255
							};
							return metaDataValue;
						}
					};
					callback(data, metaData, undefined);
				});
			});
		},
		afterEach : function(/* assert */) {
			this.oGlobalApi.oUiApi.getLayoutView.restore();
			// This is needed because of jQuery Ajax Stubbing 
			jQuery.ajax.restore();
			this.oGlobalApi.oCoreApi.getSteps.restore();
			this.oGlobalApi.oCoreApi.readPaths.restore();
			// restore the context created as part of UIApi.js double.
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(this.toolbar, 'then toolbar exists'); //eslint-disable-line no-invalid-this
	});
	/*NEW SCENARIOS*/
	QUnit.test('given an unsaved path,when clicking "New" button from toolbar,then clicking "Ok" button of new dialog then clicking "Cancel" button of save dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		var saveAnalysisPathDialog, newPathDialog;
		//act
		pressButtonsOfActionListItem(self, 0);
		//assert
		assert.ok(getDialogByTitleKey("newPath", self), "then analysis-path-not-saved dialog");
		//act
		pressOkButtonOfDialog("newPath", self, assert, function() {
			// dialog: analysis path not saved
			// dialog: input name & save
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.ok(saveAnalysisPathDialog, "when ok then save-analysis-path dialog exists");
			assert.equal(saveAnalysisPathDialog.isOpen(), true, "then Save dialog is in state open");
			//act
			pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
				saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
				//assert
				assert.strictEqual(spySavePath.called, false, "when cancel then savePath not called");
				assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
				//clean up
				self.oGlobalApi.oCoreApi.savePath.restore();
			});
		});
	});
	QUnit.test('given an unsaved path,when clicking "New" button from toolbar,then clicking "Ok" button of new dialog then clicking "Ok" button of save dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		//create spies and stubs
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		var spyRefreshCarousel = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController(), 'refreshCarousel', doNothing);
		var spyCarouselRerender = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel(), 'rerender', doNothing);
		var spyResetAnalysisPath = sinon.spy(self.toolbarController, "resetAnalysisPath");
		var saveAnalysisPathDialog, newPathDialog;
		//act 
		pressButtonsOfActionListItem(self, 0);
		pressOkButtonOfDialog("newPath", self, assert, function() {
			// dialog: analysis path not saved
			// dialog: input name & save
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.ok(saveAnalysisPathDialog, "when ok then save-analysis-path dialog exists");
			assert.equal(saveAnalysisPathDialog.isOpen(), true, "then Save dialog is in state open");
			//act
			pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
				//assert
				saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
				assert.strictEqual(spySavePath.calledOnce, true, "when ok then savePath called");
				assert.strictEqual(spySuccessToast.calledOnce, true, "then save success toast is called");
				assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
				assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
				assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6016", "then error message with correct code is logged");
				assert.strictEqual(spyRefreshCarousel.calledOnce, true, "then refreshCarousel called once");
				assert.strictEqual(spyCarouselRerender.calledOnce, true, "then carousel rerender called once");
				assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "then Path is reset");
				assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
				self.oGlobalApi.oCoreApi.savePath.restore();
				//cleanup
				createMessageObjectSpy.restore();
				putMessageSpy.restore();
			});
		});
	});
	QUnit.test('given an unsaved path,when clicking "New" button from toolbar,then clicking "No" button of new dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		//create stubs
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		var spyRefreshCarousel = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController(), 'refreshCarousel', doNothing);
		var spyCarouselRerender = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel(), 'rerender', doNothing);
		var spyResetAnalysisPath = sinon.spy(self.toolbarController, "resetAnalysisPath");
		var newPathDialog;
		//act 
		pressButtonsOfActionListItem(self, 0);
		pressCancelButtonOfDialog("newPath", self, assert, function() {
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			assert.strictEqual(spySavePath.called, false, "then savePath not called");
			assert.strictEqual(spyRefreshCarousel.calledOnce, true, "then refreshCarousel called once");
			assert.strictEqual(spyCarouselRerender.calledOnce, true, "then carousel rerender called once");
			assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "then Path is reset");
			//cleanup
			self.oGlobalApi.oCoreApi.savePath.restore();
		});
	});
	QUnit.test('given a saved path,when clicking "New" button from toolbar', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		//create stubs
		var spyRefreshCarousel = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController(), 'refreshCarousel', doNothing);
		var spyCarouselRerender = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel(), 'rerender', doNothing);
		var spyResetAnalysisPath = sinon.spy(self.toolbarController, "resetAnalysisPath");
		//act 
		pressButtonsOfActionListItem(self, 0);
		//assert
		assert.equal(analysisPath.oSavedPathName.getTitle(), self.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("unsaved"), "then Path is reseted");
		assert.strictEqual(spyRefreshCarousel.calledOnce, true, "then refreshCarousel called once");
		assert.strictEqual(spyCarouselRerender.calledOnce, true, "then carousel rerender called once");
		assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "then Path is reset");
	});
	/*OPEN SCENARIOS*/
	QUnit.test('given an unsaved path,when clicking "Open" button from toolbar,then clicking "Ok" button of new dialog then clicking "Cancel" button of save dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		var saveAnalysisPathDialog, newPathDialog;
		//act
		pressButtonsOfActionListItem(self, 1);
		//assert
		assert.ok(getDialogByTitleKey("newPath", self), "then analysis-path-not-saved dialog");
		//act
		pressOkButtonOfDialog("newPath", self, assert, function() {
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			// dialog: analysis path not saved
			// dialog: input name & save
			saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.ok(saveAnalysisPathDialog, "when ok then save-analysis-path dialog exists");
			assert.equal(saveAnalysisPathDialog.isOpen(), true, "then Save dialog is in state open");
			//act
			pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
				saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
				//assert
				assert.strictEqual(spySavePath.called, false, "when cancel then savePath not called");
				assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
				//clean up
				self.oGlobalApi.oCoreApi.savePath.restore();
			});
		});
	});
	QUnit.test('given an unsaved path,when clicking "Open" button from toolbar,then clicking "Ok" button of new dialog then clicking "Ok" button of save dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		var selectPathDialog, newPathDialog, saveAnalysisPathDialog;
		//act 
		pressButtonsOfActionListItem(self, 1);
		//assert
		assert.ok(getDialogByTitleKey("newPath", self), "then analysis-path-not-saved dialog");
		pressOkButtonOfDialog("newPath", self, assert, function() {
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog does not exist");
			// dialog: analysis path not saved
			// dialog: input name & save
			saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.ok(saveAnalysisPathDialog, "when ok then save-analysis-path dialog exists");
			assert.equal(saveAnalysisPathDialog.isOpen(), true, "then Save dialog is in state open");
			//act
			pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
				//assert
				assert.strictEqual(spySavePath.calledOnce, true, "when ok then savePath called");
				assert.strictEqual(spySuccessToast.calledOnce, true, "then save success toast called");
				assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
				assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
				assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6016", "then error message with correct code is logged");
				saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
				assert.strictEqual(saveAnalysisPathDialog, undefined, "then save dialog is closed");
				selectPathDialog = getDialogByEmptyTitle();
				assert.ok(selectPathDialog, "then selectPathDialog exists");
				assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
				pressCancelButtonOfDialogByEmptyTitle(assert, function() {
					selectPathDialog = getDialogByEmptyTitle();
					//assert
					assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
					//clean up
					self.oGlobalApi.oCoreApi.savePath.restore();
					createMessageObjectSpy.restore();
					putMessageSpy.restore();
				});
			});
		});
	});
	QUnit.test('given an unsaved path,when clicking "Open" button from toolbar,then clicking "No" button of new dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		analysisPath.getController().refresh(0);
		var selectPathDialog, newPathDialog;
		//create stubs
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		var spyRefreshCarousel = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController(), 'refreshCarousel', doNothing);
		var spyCarouselRerender = sinon.stub(self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel(), 'rerender', doNothing);
		var spyResetAnalysisPath = sinon.spy(self.toolbarController, "resetAnalysisPath");
		//act 
		pressButtonsOfActionListItem(self, 1);
		//assert
		assert.ok(getDialogByTitleKey("newPath", self), "then analysis-path-not-saved dialog");
		pressCancelButtonOfDialog("newPath", self, assert, function() {
			selectPathDialog = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(spySavePath.called, false, "then savePath not called");
			assert.strictEqual(spyRefreshCarousel.calledOnce, true, "then refreshCarousel called once");
			assert.strictEqual(spyCarouselRerender.calledOnce, true, "then rerender Carosel called once");
			assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "then resetAnalysisPath called once");
			assert.ok(selectPathDialog, "then selectPathDialog exists");
			assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
			newPathDialog = getDialogByTitleKey("newPath", self);
			assert.strictEqual(newPathDialog, undefined, "then New Path dialog has been closed and does not exist");
			pressCancelButtonOfDialogByEmptyTitle(assert, function() {
				selectPathDialog = getDialogByEmptyTitle();
				//assert
				assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
				//clean up
				self.oGlobalApi.oCoreApi.savePath.restore();
				self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().getController().refreshCarousel.restore();
				self.oGlobalApi.oUiApi.getAnalysisPath().getCarousel().rerender.restore();
			});
		});
	});
	QUnit.test('given a saved path,when clicking "Open" button from toolbar', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		var selectPathDialog;
		//act 
		pressButtonsOfActionListItem(self, 1);
		selectPathDialog = getDialogByEmptyTitle();
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		pressCancelButtonOfDialogByEmptyTitle(assert, function() {
			selectPathDialog = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
	});
	QUnit.test('given a saved path,when clicking "Open" button again from toolbar after closing select path gallery dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		var selectPathDialog;
		//act 
		pressButtonsOfActionListItem(self, 1);
		selectPathDialog = getDialogByEmptyTitle();
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists");
		assert.notEqual(selectPathDialog.getContent()[0].getModel().getData().GalleryElements.length, 0, "then list of saved path exist in open gallery element");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		pressCancelButtonOfDialogByEmptyTitle(assert, function() {
			selectPathDialog = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
		//act 
		pressButtonsOfActionListItem(self, 1);
		selectPathDialog = getDialogByEmptyTitle();
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists after pressing the open button again");
		assert.notEqual(selectPathDialog.getContent()[0].getModel().getData().GalleryElements.length, 0, "then list of saved path exist in open gallery element");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		pressCancelButtonOfDialogByEmptyTitle(assert, function() {
			selectPathDialog = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
	});
	QUnit.test('given a saved path,when performing two single clicks on "Open" button from toolbar', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		var selectPathDialogOnFirstClick, selectPathDialogOnSecondClick;
		//act 
		pressButtonsOfActionListItem(self, 1);
		selectPathDialogOnFirstClick = getDialogByEmptyTitle();
		//assert
		assert.ok(selectPathDialogOnFirstClick, "then selectPathDialog exists on first click");
		assert.equal(selectPathDialogOnFirstClick.isOpen(), true, "then selectPathDialog is in open state");
		pressButtonsOfActionListItem(self, 1);
		selectPathDialogOnSecondClick = getDialogByEmptyTitle();
		assert.deepEqual(selectPathDialogOnFirstClick, selectPathDialogOnSecondClick, "then only one 'Select Analysis Path' dialog exist after second click");
		pressCancelButtonOfDialogByEmptyTitle(assert, function() {
			selectPathDialogOnFirstClick = getDialogByEmptyTitle();
			//assert
			assert.strictEqual(selectPathDialogOnFirstClick, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
	});
	/*SAVE SCENARIOS*/
	QUnit.test('when clicking "Save" button from toolbar', function(assert) {
		var self = this; //eslint-disable-line no-invalid-this
		// pre-condition
		var saveDialog = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.strictEqual(saveDialog, undefined, "Dialog does not exist before");
		// arrangement - Required arrangement for this test already done in setup
		//  act
		pressButtonsOfActionListItem(self, 2);
		saveDialog = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.notStrictEqual(saveDialog, undefined, "then dialog exists");
		assert.equal(saveDialog.isOpen(), true, "then dialog is in state open");
		//close dialog
		pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
			var saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
		});
	});
	QUnit.test('when clicking "Save" button from toolbar and then button "Ok" button of Save dialog', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		//  act
		pressButtonsOfActionListItem(self, 2);
		self.toolbarController.oInput.setValue(pathName);
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(spySavePath.calledOnce, true, "then savePath called once");
			assert.strictEqual(spySavePath.getCall(0).args[0], pathName, "param is pathName");
			assert.ok(spySavePath.getCall(0).args[1] instanceof Function, "param is callback");
			assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6016", "then error message with correct code is logged");
			//clean up
			self.oGlobalApi.oCoreApi.savePath.restore();
			createMessageObjectSpy.restore();
			putMessageSpy.restore();
		});
	});
	QUnit.test('given an already saved path when pressing button "Save" button from the toolbar ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "TestPath";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		self.toolbarController.analysisPathName = analysisPath.oSavedPathName.getTitle();
		self.toolbarController.guid = "5347CB9377CD1E59E10000000A445B6D";
		// create spies
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		// act
		pressButtonsOfActionListItem(self, 2); // No dialog should come when saving an already existing path.
		var saveDialog = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.strictEqual(saveDialog, undefined, "then dialog does not exist");
		assert.strictEqual(spySavePath.calledOnce, true, "then savePath called once");
		assert.strictEqual(spySavePath.getCall(0).args[0], self.toolbarController.guid, "param is guid");
		assert.strictEqual(spySavePath.getCall(0).args[1], pathName, "param is pathName");
		assert.ok(spySavePath.getCall(0).args[2] instanceof Function, "param is callback");
		assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6017", "then error message with correct code is logged");
		//clean up
		self.oGlobalApi.oCoreApi.savePath.restore();
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test('given paths upto max limit have been saved and when saving a new path', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		//Restore readPaths stub and restub again to change the max limit of paths
		self.oGlobalApi.oCoreApi.readPaths.restore();
		sinon.stub(self.oGlobalApi.oCoreApi, 'readPaths', function(callback) {
			jQuery.getJSON(self.savedPathJson, function(data) {
				var metaData, metaDataValue;
				var i;
				for(i = 0; i < data.paths.length; i++) {
					data.paths[i].StructuredAnalysisPath = {
						steps : [ 2, 4 ]
					};
				}
				metaData = {
					getEntityTypeMetadata : function() {
						metaDataValue = {
							maximumNumberOfSteps : 2,
							maxOccurs : 8
						};
						return metaDataValue;
					}
				};
				callback(data, metaData, undefined);
			});
		});
		//  act
		pressButtonsOfActionListItem(self, 2);
		self.toolbarController.oInput.setValue(pathName);
		//act
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6014", "then error message with correct code is logged");
			//clean up
			createMessageObjectSpy.restore();
			putMessageSpy.restore();
		});
	});
	QUnit.test('when Maximum number of steps exceeded in a path ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		//Restore readPaths stub and restub again to change the max limit of steps
		self.oGlobalApi.oCoreApi.readPaths.restore();
		sinon.stub(self.oGlobalApi.oCoreApi, 'readPaths', function(callback) {
			jQuery.getJSON(self.savedPathJson, function(data) {
				var metaData, metaDataValue;
				var i;
				for(i = 0; i < data.paths.length; i++) {
					data.paths[i].StructuredAnalysisPath = {
						steps : [ 2, 4 ]
					};
				}
				metaData = {
					getEntityTypeMetadata : function() {
						metaDataValue = {
							maximumNumberOfSteps : 2,
							maxOccurs : 255
						};
						return metaDataValue;
					}
				};
				callback(data, metaData, undefined);
			});
		});
		//  act
		pressButtonsOfActionListItem(self, 2);
		self.toolbarController.oInput.setValue(pathName);
		//act
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6015", "then error message with correct code is logged");
			//clean up
			createMessageObjectSpy.restore();
			putMessageSpy.restore();
		});
	});
	QUnit.test('given when no steps are added and clicking on "Save" button from toolbar', function(assert) {
		//arrangement
		var self = this;//eslint-disable-line no-invalid-this
		//Restore getSteps and restub it again with zero steps
		self.oGlobalApi.oCoreApi.getSteps.restore();
		sinon.stub(self.oGlobalApi.oCoreApi, 'getSteps', function() {
			return [];
		});
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		// act
		pressButtonsOfActionListItem(self, 2);
		//assert
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6012", "then error message with correct code is logged");
		//clean up
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test('when preforming two single clicks on "Save" button from toolbar', function(assert) {
		var self = this; //eslint-disable-line no-invalid-this
		// pre-condition
		var saveDialogOnfirstClick = getDialogByTitleKey("save-analysis-path", self), saveDialogOnSecondClick;
		// assert
		assert.strictEqual(saveDialogOnfirstClick, undefined, "Dialog does not exist before");
		//  act
		pressButtonsOfActionListItem(self, 2);
		saveDialogOnfirstClick = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.notStrictEqual(saveDialogOnfirstClick, undefined, "then dialog exists on fisrt click");
		assert.equal(saveDialogOnfirstClick.isOpen(), true, "then dialog is in state open");
		// act
		pressButtonsOfActionListItem(self, 2);
		saveDialogOnSecondClick = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.deepEqual(saveDialogOnfirstClick, saveDialogOnSecondClick, "then only one 'save' dialog exist after second click");
		//close dialog
		pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
			var saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
		});
	});
	/*SAVE AS SCENARIOS*/
	QUnit.test('when clicking "Save As" button from toolbar', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		//  act
		pressButtonsOfActionListItem(self, 3);
		var saveDialog = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.notStrictEqual(saveDialog, undefined, "then dialog exists");
		assert.equal(saveDialog.isOpen(), true, "then dialog is in state oOpen");
		//clean up
		pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
			var saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
		}); // close dialog
	});
	QUnit.test('when clicking "Save As" button from toolbar and then clicking "Ok" button of Save As dialog ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "hugo";
		// create spies
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		//  act
		pressButtonsOfActionListItem(self, 3);
		// act
		self.toolbarController.oInput.setValue(pathName);
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			//assert
			assert.strictEqual(spySavePath.calledOnce, true, "then savePath called once");
			assert.strictEqual(spySavePath.getCall(0).args[0], pathName, "param is pathName");
			assert.ok(spySavePath.getCall(0).args[1] instanceof Function, "param is callback");
			assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
			assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6016", "then error message with correct code is logged");
			//clean up
			self.oGlobalApi.oCoreApi.savePath.restore();
			createMessageObjectSpy.restore();
			putMessageSpy.restore();
		});
	});
	QUnit.test('given already saved path, when clicking "Save As" button from toolbar and then clicking "No" button of "Overwrite AnalysisPath" dialog ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "TestPath";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		self.toolbarController.analysisPathName = analysisPath.oSavedPathName.getTitle();
		self.toolbarController.guid = "5347CB9377CD1E59E10000000A445B6D";
		// create spies
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		// act
		pressButtonsOfActionListItem(self, 3);
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			var overwritePathDialog = getDialogByTitleKey("caution", self);
			//assert
			assert.ok(overwritePathDialog, "when ok then overwrite Ananlysis path dialog exists");
			assert.equal(overwritePathDialog.isOpen(), true, "then overwrite AnanlysisPath dialog is in state open");
			//act
			pressCancelButtonOfDialog("caution", self, assert, function() {
				var saveDialog = getDialogByTitleKey("save-analysis-path", self);
				var sDifferentPathName = "newPath";
				saveDialog.getContent()[0].setValue(sDifferentPathName);
				pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
					//assert
					assert.strictEqual(spySavePath.calledOnce, true, "then savePath called once");
					assert.strictEqual(spySavePath.getCall(0).args[0], sDifferentPathName, "param is pathName");
					assert.ok(spySavePath.getCall(0).args[1] instanceof Function, "param is callback");
					assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
					assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
					assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
					assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6016", "then error message with correct code is logged");
					//clean up
					self.oGlobalApi.oCoreApi.savePath.restore();
					createMessageObjectSpy.restore();
					putMessageSpy.restore();
				});
			});
		});
	});
	QUnit.test('given already saved path, when clicking "Save As" button from toolbar and then clicking "Yes" button of "Overwrite AnalysisPath" dialog ', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		var pathName = "TestPath";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		self.toolbarController.analysisPathName = analysisPath.oSavedPathName.getTitle();
		self.toolbarController.guid = "5347CB9377CD1E59E10000000A445B6D";
		// create spies
		var spySavePath = sinon.stub(self.oGlobalApi.oCoreApi, 'savePath', savePathDouble(self));
		var spySuccessToast = sinon.spy(self.toolbarController, "getSuccessToast");
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		// act
		pressButtonsOfActionListItem(self, 3);
		pressOkButtonOfDialog("save-analysis-path", self, assert, function() {
			var overwritePathDialog = getDialogByTitleKey("caution", self);
			//assert
			//assert
			assert.ok(overwritePathDialog, "when ok then overwrite Ananlysis path dialog exists");
			assert.equal(overwritePathDialog.isOpen(), true, "then overwrite Ananlysis path is in state open");
			pressOkButtonOfDialog("caution", self, assert, function() {
				//assert
				assert.strictEqual(spySavePath.calledOnce, true, "then savePath called once");
				assert.strictEqual(spySavePath.getCall(0).args[0], self.toolbarController.guid, "param is guid");
				assert.strictEqual(spySavePath.getCall(0).args[1], pathName, "param is pathName");
				assert.ok(spySavePath.getCall(0).args[2] instanceof Function, "param is callback");
				assert.strictEqual(spySuccessToast.calledOnce, true, "then message toast shown");
				assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
				assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
				assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6017", "then error message with correct code is logged");
				//clean up
				self.oGlobalApi.oCoreApi.savePath.restore();
				createMessageObjectSpy.restore();
				putMessageSpy.restore();
			});
		});
	});
	QUnit.test('given when no steps are added and clicking on "Save As" button from toolbar', function(assert) {
		//arrangement
		var self = this;//eslint-disable-line no-invalid-this
		//Restore getSteps and restub it again with zero steps
		self.oGlobalApi.oCoreApi.getSteps.restore();
		sinon.stub(self.oGlobalApi.oCoreApi, 'getSteps', function() {
			return [];
		});
		var createMessageObjectSpy = sinon.spy(self.oGlobalApi.oCoreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(self.oGlobalApi.oCoreApi, "putMessage");
		// act
		pressButtonsOfActionListItem(self, 3);
		//assert
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "6012", "then error message with correct code is logged");
		//clean up
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test('when preforming two single clicks on "Save As" button from toolbar', function(assert) {
		// arrangement
		var self = this; //eslint-disable-line no-invalid-this
		//  act
		pressButtonsOfActionListItem(self, 3);
		var saveAsDialogOnfirstClick = getDialogByTitleKey("save-analysis-path", self), saveAsDialogOnSecondClick;
		// assert
		assert.notStrictEqual(saveAsDialogOnfirstClick, undefined, "then 'save As' dialog exists on first click");
		assert.equal(saveAsDialogOnfirstClick.isOpen(), true, "then dialog is in state Open");
		// act
		pressButtonsOfActionListItem(self, 3);
		saveAsDialogOnSecondClick = getDialogByTitleKey("save-analysis-path", self);
		// assert
		assert.deepEqual(saveAsDialogOnfirstClick, saveAsDialogOnSecondClick, "then only one 'save As' dialog exist after second click");
		//clean up
		pressCancelButtonOfDialog("save-analysis-path", self, assert, function() {
			var saveAnalysisPathDialog = getDialogByTitleKey("save-analysis-path", self);
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save As dialog does not exist");
		}); // close dialog
	});
	/*DELETE SCENARIOS*/
	QUnit.test('given a saved/unsaved path,when clicking "Delete" button from toolbar', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		var selectPathDialog;
		//act 
		pressButtonsOfActionListItem(self, 4);
		selectPathDialog = getDialogByTitleKey("select-analysis-path", self);
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		pressOkButtonOfDialog("select-analysis-path", self, assert, function() {
			selectPathDialog = getDialogByTitleKey("select-analysis-path", self);
			//assert
			assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
			assert.strictEqual(self.toolbarController.oPathGalleryDialog["deleteAnalysisPath"].bIsDestroyed, true, "Delete analysis path view is destroyed");
		});
	});
	QUnit.test('given a saved path,when clicking "Delete" button again from toolbar after closing select path gallery dialog', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		var selectPathDialog;
		//act 
		pressButtonsOfActionListItem(self, 4);
		selectPathDialog = getDialogByTitleKey("select-analysis-path", self);
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists");
		assert.notEqual(selectPathDialog.getContent()[0].getModel().getData().GalleryElements.length, 0, "then list of saved path exist in delete gallery element");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		pressOkButtonOfDialog("select-analysis-path", self, assert, function() {
			selectPathDialog = getDialogByTitleKey("select-analysis-path", self);
			//assert
			assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
		//act 
		pressButtonsOfActionListItem(self, 4);
		selectPathDialog = getDialogByTitleKey("select-analysis-path", self);
		//assert
		assert.ok(selectPathDialog, "then selectPathDialog exists on clicking the delete button again");
		assert.notEqual(selectPathDialog.getContent()[0].getModel().getData().GalleryElements.length, 0, "then list of saved path exist in delete gallery element");
		assert.equal(selectPathDialog.isOpen(), true, "then selectPathDialog is in open state");
		pressOkButtonOfDialog("select-analysis-path", self, assert, function() {
			selectPathDialog = getDialogByTitleKey("select-analysis-path", self);
			//assert
			assert.strictEqual(selectPathDialog, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
	});
	QUnit.test('given delete path gallery when clicking delete icon of path and clicking yes on delete confirmation dialog', function(assert) {
		//arrangement
		var self = this;//eslint-disable-line no-invalid-this
		var oListInfo = {};
		oListInfo.sPathName = "pathName";
		var deletePathDialog;
		//create spy
		var deletePathSpy = sinon.stub(self.oGlobalApi.oCoreApi, "deletePath", doNothing);
		this.toolbarController.getConfirmDelDialog(oListInfo);
		deletePathDialog = getDialogByTitleKey("delPath", self);
		//assert
		assert.ok(deletePathDialog, "then Confirmation delete dialog exists");
		assert.equal(deletePathDialog.isOpen(), true, "then Confirmation delete dialog is in open state");
		//act
		pressOkButtonOfDialog("delPath", self, assert, function() {
			deletePathDialog = getDialogByTitleKey("delPath", self);
			assert.strictEqual(deletePathDialog, undefined, "when clicking ok then Confirmation delete dialog is closed");
			assert.strictEqual(deletePathSpy.calledOnce, true, "deleteSaved path spy called once");
		});
	});
	QUnit.test('given delete path gallery when clicking delete icon of path and clicking "No" on deleteconfirmation dialog', function(assert) {
		//arrangement
		var self = this;//eslint-disable-line no-invalid-this
		var oListInfo = {};
		oListInfo.sPathName = "pathName";
		var deletePathDialog;
		//create spy
		var deletePathSpy = sinon.stub(self.oGlobalApi.oCoreApi, "deletePath", doNothing);
		this.toolbarController.getConfirmDelDialog(oListInfo);
		deletePathDialog = getDialogByTitleKey("delPath", self);
		//assert
		assert.ok(deletePathDialog, "then Confirmation delete dialog exists");
		assert.equal(deletePathDialog.isOpen(), true, "then Confirmation delete dialog is in open state");
		//act
		pressCancelButtonOfDialog("delPath", self, assert, function() {
			deletePathDialog = getDialogByTitleKey("delPath", self);
			assert.strictEqual(deletePathDialog, undefined, "when clicking 'Cancel' then Confirmation delete dialog is closed");
			assert.strictEqual(deletePathSpy.called, false, "when 'Cancel' then deleteSaved path spy not called");
		});
	});
	QUnit.test('given a saved path,when performing two single clicks on "Delete" button from toolbar', function(assert) {
		//arrangement
		var self = this; // eslint-disable-line no-invalid-this
		var pathName = "analysisPathName";
		var analysisPath = self.oGlobalApi.oUiApi.getAnalysisPath();
		analysisPath.oSavedPathName.setTitle(pathName);
		var selectPathDialogOnFirstClick, selectPathDialogOnSecondClick;
		//act 
		pressButtonsOfActionListItem(self, 4);
		selectPathDialogOnFirstClick = getDialogByTitleKey("select-analysis-path", self);
		//assert
		assert.ok(selectPathDialogOnFirstClick, "then selectPathDialog exists on first click");
		assert.equal(selectPathDialogOnFirstClick.isOpen(), true, "then selectPathDialog is in open state");
		// act
		pressButtonsOfActionListItem(self, 4);
		selectPathDialogOnSecondClick = getDialogByTitleKey("select-analysis-path", self);
		// assert
		assert.deepEqual(selectPathDialogOnFirstClick, selectPathDialogOnSecondClick, "then only one 'selectPathDialog' dialog exist after second click");
		pressOkButtonOfDialog("select-analysis-path", self, assert, function() {
			selectPathDialogOnFirstClick = getDialogByTitleKey("select-analysis-path", self);
			//assert
			assert.strictEqual(selectPathDialogOnFirstClick, undefined, "then 'Select Analysis Path' dialog does not exist");
		});
	});
}());