jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');

jQuery.sap.declare('test.sap.apf.ui.tDeleteAnalysisPath');

jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.odata.savedPaths");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");

jQuery.sap.require("sap.apf.integration.withDoubles.helper");
(function() {
	'use strict';
	var oGlobalApi, oPathGalleryWithDelete;
	function getDialog(key) {
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
	function pressDeleteItem(itemId) {
		sap.ui.getCore().byId(jQuery(".sapMLIBIconDel")[itemId].getAttribute("id")).firePress();
		sap.ui.getCore().applyChanges();
	}
	function pressOkButtonOfDialog(key, assert, continuation) {
		var done = assert.async();
		var dialog = getDialog(key);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	function pressCancelButtonOfDialog(key, assert, continuation) {
		var done = assert.async();
		var dialog = getDialog(key);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getEndButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	function pressCloseButtonOfDialog(key, assert, continuation) {
		var done = assert.async();
		var dialog = getDialog(key);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			continuation({});
			done();
		});
		dialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	function getFormattedDate(utcDate) {
		var numberPattern = /\d+/g;
		var timeStamp = parseInt(utcDate.match(numberPattern)[0], 10);
		var date = ((new Date(timeStamp)).toString()).split(' ');
		var formatteddate = date[1] + "-" + date[2] + "-" + date[3];
		return formatteddate;
	}
	//Here are stubs required for Test case
	function doNothing() {
	}
	function getLayoutViewStub() {
		var layout = new sap.ui.layout.VerticalLayout();
		layout.getController = getLayoutControllerStub;
		return layout;
	}
	function getLayoutControllerStub() {
		return {
			setFilter : function(param) {
				return param;
			},
			setMasterTitle : doNothing,
			setDetailTitle : doNothing,
			setMasterHeaderButton : doNothing,
			addMasterFooterContentLeft : doNothing,
			detailTitleRemoveAllContent : doNothing,
			enableDisableOpenIn : doNothing
		};
	}
	function deleteListItemDouble(oResponse, metaData, oMessageObject) {
		return function(guid, callback) {
			callback(oResponse, metaData, oMessageObject);
		};
	}
	function readAllPathsDouble(oResponse, metaData, oMessageObject) {
		return function(callback) {
			callback(oResponse, metaData, oMessageObject);
		};
	}
	QUnit.module("Delete Analysis Path Unit Tests", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			var oInject;
			var getDataForPathGallery = function(data) {
				var galleryData = data.paths;
				for( var i in galleryData) {
					galleryData[i].StructuredAnalysisPath = galleryData[i].StructuredAnalysisPath;
					var noOfSteps = galleryData[i].StructuredAnalysisPath.steps.length;
					var dateToShow = getFormattedDate(galleryData[i].LastChangeUTCDateTime);
					galleryData[i].guid = galleryData[i].AnalysisPath;
					galleryData[i].title = galleryData[i].AnalysisPathName;
					galleryData[i].StructuredAnalysisPath.noOfSteps = noOfSteps;
					galleryData[i].description = dateToShow + "  -   (" + oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
					galleryData[i].summary = galleryData[i].AnalysisPathName + "- (" + dateToShow + ") - (" + oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
				}
				var jsonData = {
					GalleryElements : galleryData
				};
				oInject = {
					uiApi : oGlobalApi.oUiApi,
					oCoreApi : oGlobalApi.oCoreApi,
					oContext : oGlobalApi.oContext,
					oSerializationMediator : oGlobalApi.oSerializationMediator
				};
				oPathGalleryWithDelete = new sap.ui.view({
					type : sap.ui.core.mvc.ViewType.JS,
					viewName : "sap.apf.ui.reuse.view.deleteAnalysisPath",
					viewData : {
						oInject : oInject,
						jsonData : jsonData
					}
				});
			};
			var aSavedPaths = sap.apf.testhelper.odata.getSavedPaths();
			getDataForPathGallery(aSavedPaths);
			sinon.stub(oGlobalApi.oUiApi, "getLayoutView", getLayoutViewStub);
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
			oGlobalApi.oUiApi.getLayoutView.restore();
		}
	});
	QUnit.test("when calling openPathGallery function which opens dialog with delete mode ", function(assert) {
		//arrangement
		var jsonData = oPathGalleryWithDelete.getViewData().jsonData;
		var dateToShow = getFormattedDate(jsonData.GalleryElements[0].LastChangeUTCDateTime);
		var noOfSteps = jsonData.GalleryElements[0].StructuredAnalysisPath.steps.length;
		var totalPath = jsonData.GalleryElements.length;
		var description = dateToShow + "  -   (" + oGlobalApi.oCoreApi.getTextNotHtmlEncoded("no-of-steps", [ noOfSteps ]) + ")";
		//action
		oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = getDialog("select-analysis-path");
		var dialogPathlength = selectAnalysisPathDialog.getContent()[0].getItems().length;
		var analysisPathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var descriptionOnUi = selectAnalysisPathDialog.getContent()[0].getItems()[0].getDescription();
		//assert
		assert.strictEqual(selectAnalysisPathDialog.isOpen(), true, "then Dialog for deleteing path is opened on ui");
		assert.strictEqual(totalPath, dialogPathlength, "then Number of paths shown in Path gallery are same as those saved ");
		assert.strictEqual(jsonData.GalleryElements[0].AnalysisPathName, analysisPathName, "then Path Name to be deleted is 'TestPath1'");
		assert.strictEqual(description, descriptionOnUi, "then Description in path Gallery with delete mode on UI is same as saved description");
		assert.strictEqual(selectAnalysisPathDialog.hasStyleClass("sapUiSizeCompact"), true, "then Select Analysis Path Gallery has the correct style class");
		//cleanup
		pressCloseButtonOfDialog("select-analysis-path", assert, doNothing);
	});
	QUnit.test("when triggering delete icon and 'No' is pressed on Delete Analysis Path Dialog", function(assert) {
		//arrangement
		oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		//action
		pressDeleteItem(0);
		var delDialog = getDialog("delPath");
		//assert
		assert.ok(delDialog, "then Delete Analysis Path dialog exists");
		assert.strictEqual(delDialog.isOpen(), true, "then Delete Analysis Path dialog is open");
		pressCancelButtonOfDialog("delPath", assert, function() {
			delDialog = getDialog("delPath");
			assert.strictEqual(delDialog, undefined, "then Delete Analysis Path dialog is closed");
		});
		// cleanup
		pressCloseButtonOfDialog("select-analysis-path", assert, doNothing);
	});
	QUnit.test("when deleting a saved path from the path gallery(Successful UI callback - delete and read success callbacks", function(assert) {
		//arrangement
		oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = getDialog("select-analysis-path");
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var pathGUID = oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}));
		var spyPutMessage = sinon.spy(oGlobalApi.oCoreApi, 'putMessage');
		var oResponseForReadPath = {
			paths : [ 1, 2, 3 ]
		};
		var spyRead = sinon.stub(oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble(oResponseForReadPath, {}));
		//action
		pressDeleteItem(0);
		//assert
		pressOkButtonOfDialog("delPath", assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, true, "Then readPath is called");
			assert.notEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has been deleted from the UI");
			assert.strictEqual(spyPutMessage.calledOnce, false, "Then Message Object is not present");
		});
		//cleanup
		oGlobalApi.oSerializationMediator.deletePath.restore();
		oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog("select-analysis-path", assert, doNothing);
		oGlobalApi.oCoreApi.putMessage.restore();
	});
	QUnit.test("when deleting a saved path from the path gallery(Unsuccessful UI callback - Failure of delete callback - oResponse not of type object", function(assert) {
		//arrangement
		oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = getDialog("select-analysis-path");
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var pathGUID = oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble("", {}));
		var spyRead = sinon.stub(oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble({}, {}));
		var spyPutMessage = sinon.spy(oGlobalApi.oCoreApi, 'putMessage');
		//action
		pressDeleteItem(0);
		//assert
		pressOkButtonOfDialog("delPath", assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, false, "Then readPath is not called");
			assert.strictEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has not been deleted from the UI");
			assert.strictEqual(spyPutMessage.calledOnce, true, "Then Message Object is present");
		});
		//cleanup
		oGlobalApi.oSerializationMediator.deletePath.restore();
		oGlobalApi.oCoreApi.readPaths.restore();
		oGlobalApi.oCoreApi.putMessage.restore();
		pressCloseButtonOfDialog("select-analysis-path", assert, doNothing);
	});
	QUnit.test("when deleting a saved path from the path gallery(Unsuccessful UI callback - Failure of delete callback - oMessageObject is present", function(assert) {
		//arrangement
		oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = getDialog("select-analysis-path");
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var oMessageObject = oGlobalApi.oCoreApi.createMessageObject({
			code : "6009",
			aParameters : [ "delete", pathName ]
		});
		var oResponseForReadPath = {
			paths : [ 1, 2, 3 ]
		};
		var pathGUID = oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}, oMessageObject));
		var spyRead = sinon.stub(oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble(oResponseForReadPath, {}));
		var spyPutMessage = sinon.spy(oGlobalApi.oCoreApi, 'putMessage');
		//action
		pressDeleteItem(0);
		//assert
		pressOkButtonOfDialog("delPath", assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, false, "Then readPath is not called");
			assert.strictEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has not been deleted from the UI");
			assert.strictEqual(spyPutMessage.called, true, "Then Message Object is also put on the console");
		});
		//cleanup
		oGlobalApi.oSerializationMediator.deletePath.restore();
		oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog("select-analysis-path", assert, doNothing);
	});
	QUnit.test("when deleting a saved path from the path gallery(Unsuccessful UI callback - Failure of read callback - - oResponse not of type object", function(assert) {
		//arrangement
		oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = getDialog("select-analysis-path");
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var pathGUID = oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}));
		var spyRead = sinon.stub(oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble("", {}));
		var spyPutMessage = sinon.spy(oGlobalApi.oCoreApi, 'putMessage');
		//action
		pressDeleteItem(0);
		//assert
		pressOkButtonOfDialog("delPath", assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, true, "Then readPath is not called");
			assert.notEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has been deleted from the UI");
			assert.strictEqual(spyPutMessage.calledOnce, true, "Then Message Object is also present");
		});
		//cleanup
		oGlobalApi.oSerializationMediator.deletePath.restore();
		oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog("select-analysis-path", assert, doNothing);
	});
	QUnit.test("when deleting a saved path from the path gallery(Unsuccessful UI callback - Failure of read callback - - oMessage Object present", function(assert) {
		//arrangement
		oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = getDialog("select-analysis-path");
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var oMessageObject = oGlobalApi.oCoreApi.createMessageObject({
			code : "6005",
			aParameters : [ pathName ]
		});
		var pathGUID = oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}));
		var spyRead = sinon.stub(oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble("", {}, oMessageObject));
		var spyPutMessage = sinon.spy(oGlobalApi.oCoreApi, 'putMessage');
		//action
		pressDeleteItem(0);
		//assert
		pressOkButtonOfDialog("delPath", assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, true, "Then readPath is not called");
			assert.notEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has been deleted from the UI");
			assert.strictEqual(spyPutMessage.called, true, "Then Message Object is also present");
		});
		//cleanup
		oGlobalApi.oSerializationMediator.deletePath.restore();
		oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog("select-analysis-path", assert, doNothing);
	});
	QUnit.test("When current opened path is deleted)", function(assert) {
		//arrangement
		oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		var selectAnalysisPathDialog = getDialog("select-analysis-path");
		var pathName = selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle();
		var analysisPath = oGlobalApi.oUiApi.getAnalysisPath();
		var toolbarController = analysisPath.getToolbar().getController();
		analysisPath.oSavedPathName.setTitle(pathName);
		var pathGUID = oPathGalleryWithDelete.oViewData.jsonData.GalleryElements[0].guid;
		var spyDelete = sinon.stub(oGlobalApi.oSerializationMediator, 'deletePath', deleteListItemDouble({}, {}));
		var spyPutMessage = sinon.spy(oGlobalApi.oCoreApi, 'putMessage');
		var spyResetAnalysisPath = sinon.spy(toolbarController, 'resetAnalysisPath');
		var oResponseForReadPath = {
			paths : [ 1, 2, 3 ]
		};
		var spyRead = sinon.stub(oGlobalApi.oCoreApi, 'readPaths', readAllPathsDouble(oResponseForReadPath, {}));
		//action
		pressDeleteItem(0);
		//assert
		pressOkButtonOfDialog("delPath", assert, function() {
			assert.strictEqual(spyDelete.calledOnce, true, "Then deletePath is called");
			assert.strictEqual(spyDelete.calledWith(pathGUID), true, "Then deletePath is called with correct GUID");
			assert.strictEqual(spyRead.calledOnce, true, "Then readPath is called");
			assert.notEqual(selectAnalysisPathDialog.getContent()[0].getItems()[0].getTitle(), pathName, "Then Path has been deleted from the UI");
			assert.strictEqual(spyPutMessage.calledOnce, false, "Then Message Object is not present");
			assert.strictEqual(oGlobalApi.oUiApi.getAnalysisPath().oSavedPathName.getTitle(), "Unnamed Analysis Path", "Current opened path deleted");
			assert.strictEqual(spyResetAnalysisPath.calledOnce, true, "Then Analysis Path has been reset");
		});
		//cleanup
		oGlobalApi.oSerializationMediator.deletePath.restore();
		oGlobalApi.oCoreApi.readPaths.restore();
		pressCloseButtonOfDialog("select-analysis-path", assert, doNothing);
	});
	QUnit.test("When clicking on Cancel button of delete analysis path Dialog", function(assert) {
		//arrange
		oPathGalleryWithDelete.getController().openPathGallery();
		sap.ui.getCore().applyChanges();
		//action
		pressCloseButtonOfDialog("select-analysis-path", assert, function(){
			assert.strictEqual(oPathGalleryWithDelete.bIsDestroyed, true, "then view is destroyed");
		});
	});
})();