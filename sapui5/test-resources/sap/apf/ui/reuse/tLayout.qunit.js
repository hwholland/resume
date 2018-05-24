jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.helper");
jQuery.sap.require("sap.apf.testhelper.stub.ajaxStub");
jQuery.sap.require("sap.apf.testhelper.odata.savedPaths");
(function() {
	'use strict';
	var oGlobalApi, layoutView;
	function doNothing() {
	}
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
	function pressButtonsOfDialog(dialogId, buttonId, assert, continuation) {
		var done = assert.async();
		var dialog = layoutView.byId(dialogId);
		// ensure the async callback afterClose has successfully completed.
		dialog.attachAfterClose(function() {
			sap.ui.getCore().applyChanges();
			continuation({});
			done();
		});
		layoutView.byId(buttonId).firePress();
		sap.ui.getCore().applyChanges();
	}
	//Below stubs and Doubles required for Navigation realted test cases...
	function savePathDouble(savedPathJson) {
		return function(arg1, arg2) {
			var callback;
			if (arg2 instanceof Function) {
				callback = arg2;
			}
			jQuery.getJSON(savedPathJson, function(data) {
				callback(data, {}, undefined);
			});
		};
	}
	function getStepsDouble() {
		return function() {
			return [ "firstStep", "secondStep", "thirdStep" ];
		};
	}
	function readPathsStub(callback) {
		var savedPathJson = "/pathOfNoInterest/savedPaths.json";
		jQuery.getJSON(savedPathJson, function(data) {
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
	}
	// Below Stubs are required for layout functionality test cases
	function getTextEncodedStub(x) {
		return x;
	}
	function getApplicationConfigPropertiesStub() {
		return {
			appName : "sap-working-capital-analysis"
		};
	}
	function getNotificationBarStub() {
		var layout = new sap.ui.layout.VerticalLayout();
		layout.getController = function(){
			return {
				showMessage : doNothing
			};
		};
		return layout;
	}
	function getEventCallbackStub(eventType) {
		return oGlobalApi.oUiApi.getEventCallback(eventType);
	}
	function getStepContainerStub() {
		return new sap.ui.layout.VerticalLayout();
	}
	function getFacetFilterControlStub() {
		var oControl = new sap.ui.layout.VerticalLayout();
		oControl.getFilterExpression = function() {
			var filterExpresn = [];
			return filterExpresn;
		};
		oControl.resetAllFilters = function() {
			return "";
		};
		return oControl;
	}
	function getNavigationTargetsStub() {
		var deferred = jQuery.Deferred();
		deferred.resolve({
			navigationMode : "forward"
		});
		return deferred.promise();
	}
	function getActiveStep0Stub() {
		return {
			getSelectedRepresentation : getSelectedRepresentation0Stub,
			getAssignedNavigationTargets : navstub
		};
	}
	function getSelectedRepresentation0Stub() {
		return {
			type : sap.apf.ui.utils.CONSTANTS.representationTypes.BAR_CHART,
			viewSettingsDialog : new sap.m.ViewSettingsDialog({}),
			toggleInstance : doNothing
		};
	}
	function navstub() {
		return {
			expectedResult : [ {
				id : 'nav-MM',
				type : 'navigationTarget'
			} ]
		};
	}
	QUnit.module('APF UI Reuse', {
		beforeEach : function(assert) {
			sap.apf.testhelper.stub.stubJQueryAjax();
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			sinon.stub(oGlobalApi.oCoreApi, 'getApplicationConfigProperties', getApplicationConfigPropertiesStub);
			sinon.stub(oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', getTextEncodedStub);
			sinon.stub(oGlobalApi.oUiApi, 'getNotificationBar', getNotificationBarStub);
			sinon.stub(oGlobalApi.oUiApi, 'getStepContainer', getStepContainerStub);
			sinon.stub(oGlobalApi.oApi, 'getEventCallback', getEventCallbackStub);
			sinon.stub(oGlobalApi.oUiApi, 'getEventCallback', getEventCallbackStub);
			layoutView = oGlobalApi.oUiApi.getLayoutView();
		},
		afterEach : function() {
			jQuery.ajax.restore();
			oGlobalApi.oCoreApi.getApplicationConfigProperties.restore();
			oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
			oGlobalApi.oUiApi.getNotificationBar.restore();
			oGlobalApi.oUiApi.getStepContainer.restore();
			oGlobalApi.oApi.getEventCallback.restore();
			oGlobalApi.oUiApi.getEventCallback.restore();
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test('When Layout view is initialized', function(assert) {
		//arrangement
		var spyLayoutView = sinon.spy(layoutView, 'onAfterRendering');
		//action
		layoutView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		layoutView.byId("applicationView").fireAfterMasterOpen();
		sap.ui.getCore().applyChanges();
		//assert
		assert.ok(layoutView, 'Layout View available');
		assert.strictEqual(spyLayoutView.called, true, "Then the layout renrendered successfully");
		assert.strictEqual(layoutView.byId("applicationPage").getTitle(), "sap-working-capital-analysis", "Header Text is added to the layout");
		assert.strictEqual(layoutView.byId("stepContainer") instanceof sap.m.Page, true, "StepContainer is added to layout");
		assert.strictEqual(layoutView.byId("analysisPath") instanceof sap.m.Page, true, "AnalysisPath is added to layout");
		assert.strictEqual(layoutView.byId("subHeader") instanceof sap.m.ScrollContainer, true, "SubHeader is added to layout");
		assert.strictEqual(layoutView.byId("masterFooter") instanceof sap.m.Bar, true, "MasterFooter is added to layout");
		assert.strictEqual(layoutView.byId("detailFooter") instanceof sap.m.Bar, true, "Detail is added to layout");
	});
	QUnit.test('When calling addMasterFooterContentRight', function(assert) {
		//arrangement
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		var oLabel2 = new sap.m.Label({
			text : "Label 2"
		});
		//action
		layoutView.getController().addMasterFooterContentRight(oLabel);
		layoutView.getController().addMasterFooterContentRight(oLabel2);
		sap.ui.getCore().applyChanges();
		var checkContentRight = layoutView.byId("masterFooter").getContentRight()[0];
		//assert
		assert.strictEqual(oLabel, checkContentRight, "Then addMasterFooterContentRight() - control added to MasterFooterRight");
		assert.strictEqual(layoutView.byId("masterFooter").getContentRight()[1].getIcon(), "sap-icon://overflow", "Content overflow Button Added to Footer in case of multiple contents");
	});
	QUnit.test('When calling addMasterFooterContentLeft', function(assert) {
		//arrangement
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		//action
		layoutView.getController().addMasterFooterContentLeft(oLabel);
		sap.ui.getCore().applyChanges();
		var checkContentLeft = layoutView.byId("masterFooter").getContentLeft()[0];
		//assert
		assert.strictEqual(oLabel, checkContentLeft, "addMasterFooterContentLeft() - control added to MasterFooterLeft");
	});
	QUnit.test('When calling addFacetFiler', function(assert) {
		//action
		layoutView.getController().addFacetFilter(getFacetFilterControlStub());
		sap.ui.getCore().applyChanges();
		var subHeaderval = layoutView.byId("subHeader");
		var facetfilterval = subHeaderval.getContent();
		//assert
		assert.strictEqual(facetfilterval.length, 1, "Then the facetfilterview has added successfully");
	});
	QUnit.test('When calling showMaster', function(assert) {
		//action
		layoutView.getController().showMaster();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(layoutView.byId("applicationView").isMasterShown(), true, "Then the master page has shown");
	});
	QUnit.test('When calling addDetailFooterContentLeft', function(assert) {
		//arrangement
		var oLabel = new sap.m.Label({
			text : "Label 1"
		});
		//action
		layoutView.getController().addDetailFooterContentLeft(oLabel);
		sap.ui.getCore().applyChanges();
		var checkContentLeft = layoutView.byId("detailFooter").getContentLeft()[0];
		//assert
		assert.strictEqual(oLabel, checkContentLeft, "Then addDetailFooterContentLeft() - control added to DetailFooterLeft");
	});
	QUnit.test('When calling hideMaster', function(assert) {
		//arrangement - Test for Phone
		sap.ui.Device.system.phone = true;
		sap.ui.getCore().applyChanges();
		//action
		layoutView.getController().hideMaster();
		//assert
		var currentPageID = layoutView.byId("applicationView").getCurrentDetailPage().getId();
		var detailPageID = layoutView.byId("stepContainer").getId();
		assert.strictEqual(currentPageID, detailPageID, "Then Master is hidden and Current Page  in Phone StepContainer Detail Page");
		//cleanup
		sap.ui.Device.system.phone = false;
		sap.ui.getCore().applyChanges();
		//arrangement - Test for tablet
		sap.ui.Device.system.tablet = true;
		sap.ui.getCore().applyChanges();
		//action
		layoutView.getController().hideMaster();
		currentPageID = layoutView.byId("applicationView").getCurrentDetailPage().getId();
		detailPageID = layoutView.byId("stepContainer").getId();
		//assert
		assert.strictEqual(currentPageID, detailPageID, "Then Master is hidden and Current Page  in tablet StepContainer Detail Page");
	});
	QUnit.test('When Adding Open In button(as Enabled)', function(assert) {
		//action
		layoutView.getController().addOpenInButton();
		sap.ui.getCore().applyChanges();
		var checkContentRight = layoutView.byId("detailFooter").getContentRight()[0];
		//assert
		assert.ok(checkContentRight instanceof sap.m.Button, "Open in button is added to the right side of the footer with a global Navigation Target");
		assert.strictEqual(layoutView.getController().openInBtn.getEnabled(), true, "Then the OpenIn Button is enabled");
	});
	QUnit.test('When Adding Open In button (as Enabled)', function(assert) {
		//arrangements
		sinon.stub(layoutView.getController().oNavigationHandler, 'getNavigationTargets', getNavigationTargetsStub);
		sinon.stub(layoutView.getController().oCoreApi, 'getActiveStep', getActiveStep0Stub);
		//action
		layoutView.getController().addOpenInButton();
		sap.ui.getCore().applyChanges();
		var checkContentRight = layoutView.byId("detailFooter").getContentRight()[0];
		//assert
		assert.ok(checkContentRight instanceof sap.m.Button, "Open in button is added to the right side of the footer with Navigation Target");
		assert.strictEqual(layoutView.getController().openInBtn.getEnabled(), true, "Then the OpenIn Button is Enabled");
	});
	QUnit.test('when a non-dirty path and navigation to previous page happens', function(assert) {
		// arrange
		var newPathDialog = layoutView.byId("idNewDialog");
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		// assert
		assert.strictEqual(newPathDialog, undefined, "then before navigation button press, new dialog is not opened");
		// act
		layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = layoutView.byId("idNewDialog");
		// assert
		assert.strictEqual(newPathDialog, undefined, "when navigation button press, new dialog not opened");
		assert.strictEqual(navToPrevPage.calledOnce, true, "then navigates to previous page");
		// cleanups
		navToPrevPage.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "Ok" button of new dialog then clicking "Cancel" button of save dialog', function(assert) {
		// arrange
		var savedPathJson = "/pathOfNoInterest/savedPaths.json";
		sinon.stub(oGlobalApi.oCoreApi, 'readPaths', readPathsStub);
		var newPathDialog = layoutView.byId("idNewDialog"), saveDialog;
		var analysisPath = oGlobalApi.oUiApi.getAnalysisPath();
		var toolBarController = analysisPath.getToolbar().getController();
		var pathName = "analysisPathName";
		analysisPath.oSavedPathName.setTitle(pathName);
		// create spies and stubs
		var spySavePath = sinon.stub(toolBarController.oSerializationMediator, 'savePath', savePathDouble(savedPathJson));
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		sinon.stub(oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		//var stubReadPath = readPathsStub(savedPathJson, testContext);
		analysisPath.getController().refresh(0);
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(newPathDialog, undefined, "before navigation button press: Analysis path to save dialog is not opened");
		// act
		layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "when navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "When navigation Button press: new dialog opened");
		pressButtonsOfDialog("idNewDialog", "idYesButton", assert, function() {
			saveDialog = getDialog("save-analysis-path");
			assert.ok(saveDialog, " then save-analysis-path dialog exists");
			assert.strictEqual(saveDialog.isOpen(), true, "then Save dialog opened");
			var done = assert.async();
			saveDialog.getEndButton().firePress();
			sap.ui.getCore().applyChanges();
			saveDialog.attachAfterClose(function() {
				// assert
				saveDialog = getDialog("save-analysis-path");
				assert.strictEqual(saveDialog, undefined, "then Save dialog does not exist");
				assert.strictEqual(spySavePath.calledOnce, false, "when Cancel, then savePath not called");
				assert.strictEqual(navToPrevPage.calledOnce, false, "then remains in the same page");
				// cleanups
				navToPrevPage.restore();
				done();
			});
		});
		// cleanups
		oGlobalApi.oCoreApi.readPaths.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "Ok" button of new dialog then clicking "Ok" button of save dialog', function(assert) {
		// arrange
		var savedPathJson = "/pathOfNoInterest/savedPaths.json";
		var done;
		var newPathDialog = layoutView.byId("idNewDialog"), saveDialog;
		var analysisPath = oGlobalApi.oUiApi.getAnalysisPath();
		var toolBarController = analysisPath.getToolbar().getController();
		var pathName = "analysisPathName";
		analysisPath.oSavedPathName.setTitle(pathName);
		// create spies and stubs
		var spySavePath = sinon.stub(toolBarController.oSerializationMediator, 'savePath', savePathDouble(savedPathJson));
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		sinon.stub(oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		sinon.stub(oGlobalApi.oCoreApi, 'readPaths', readPathsStub);
		analysisPath.getController().refresh(0);
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(newPathDialog, undefined, "before navigation button press: Analysis path to save dialog not opened");
		// act
		layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "After navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "After navigation Button press: new opened");
		pressButtonsOfDialog("idNewDialog", "idYesButton", assert, function() {
			saveDialog = getDialog("save-analysis-path");
			assert.ok(saveDialog, "then save-analysis-path dialog exists");
			assert.strictEqual(saveDialog.isOpen(), true, "then Save dialog is in open state");
			done = assert.async();
			saveDialog.getBeginButton().firePress();
			sap.ui.getCore().applyChanges();
			saveDialog.attachAfterClose(function() {
				// assert
				saveDialog = getDialog("save-analysis-path");
				assert.strictEqual(saveDialog, undefined, "then Save dialog does not exist");
				assert.strictEqual(spySavePath.calledOnce, true, "when ok then savePath called");
				assert.strictEqual(navToPrevPage.calledOnce, true, "then navigated to previous page");
				// cleanups
				navToPrevPage.restore();
				done();
			});
		});
		// cleanups
		oGlobalApi.oCoreApi.readPaths.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "No" button of new dialog', function(assert) {
		// arrange
		var newPathDialog = layoutView.byId("idNewDialog"), saveAnalysisPathDialog;
		var analysisPath = oGlobalApi.oUiApi.getAnalysisPath();
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		sinon.stub(oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		analysisPath.getController().refresh(0);
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(newPathDialog, undefined, "Before navigation button press: Analysis path to save dialog not opened");
		// act
		layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "After navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "After navigation Button press: new dialog opened");
		pressButtonsOfDialog("idNewDialog", "idNoButton", assert, function() {
			saveAnalysisPathDialog = getDialog("save-analysis-path");
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
			assert.strictEqual(navToPrevPage.calledOnce, true, "Navigating to previous page");
		});
		// cleanups
		oGlobalApi.oCoreApi.getSteps.restore();
		navToPrevPage.restore();
	});
	QUnit.test('when a dirty path and navigation to previous page happens,then clicking "Cancel" button of new dialog', function(assert) {
		// arrange
		var newPathDialog = layoutView.byId("idNewDialog"), saveAnalysisPathDialog;
		var analysisPath = oGlobalApi.oUiApi.getAnalysisPath();
		var navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		sinon.stub(oGlobalApi.oCoreApi, 'getSteps', getStepsDouble());
		analysisPath.getController().refresh(0);
		sap.ui.getCore().applyChanges();
		// assert
		assert.strictEqual(newPathDialog, undefined, "Before navigation button press: Analysis path to save dialog not opened");
		// act
		layoutView.byId("applicationPage-navButton").firePress();
		sap.ui.getCore().applyChanges();
		newPathDialog = layoutView.byId("idNewDialog");
		// assert
		assert.ok(newPathDialog, "After navigation Button press: new dialog exist");
		assert.strictEqual(newPathDialog.isOpen(), true, "After navigation Button press: new dialog opened");
		pressButtonsOfDialog("idNewDialog", "idCancelButton", assert, function() {
			saveAnalysisPathDialog = getDialog("save-analysis-path");
			//assert
			assert.strictEqual(saveAnalysisPathDialog, undefined, "then Save dialog does not exist");
			assert.strictEqual(navToPrevPage.calledOnce, false, "Remains in the same page");
		});
		//cleanups
		oGlobalApi.oCoreApi.getSteps.restore();
		navToPrevPage.restore();
	});
})();