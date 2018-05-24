jQuery.sap.declare('sap.apf.modeler.ui.tImportFiles');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var oImportFilesView, getTextSpy, oApplicationHandler, getApplicationHandlerSpy, fireEventSpy, showMsgToastSpy, callbackOverwrite, callbackDoNotOverwrite, callbackImport;
	var importDialog, jsonFileUploader, textFileUploader, readerStub, readAsTextSpy;
	function _getDialogAndItsElements() {
		importDialog = oImportFilesView.byId("idImportFilesDialog");
		jsonFileUploader = oImportFilesView.byId("idJsonFileUploader");
		textFileUploader = oImportFilesView.byId("idTextFileUploader");
	}
	function _getApplicationHandlerStub(oModelerInstance) {
		oApplicationHandler = oModelerInstance.applicationHandler;
	}
	function _importConfigurationStub(stringifiedJson, callback, callbackImport1) {
		callback(callbackOverwrite, callbackDoNotOverwrite, "Test Configuration");
		callbackImport = callbackImport1;
	}
	function _getJsonUploadCompleteEvent() {
		return {
			getSource : function() {
				var data = {
					"configHeader" : [ {
						"Application" : "54DD795664A10518E10000000A445B6D",
						"ApplicationName" : "APF Test Application",
						"SemanticObject" : "SBTestApp",
						"AnalyticalConfiguration" : "54DD79F764A10518E10000000A445B6D",
						"AnalyticalConfigurationName" : "APF Test Application",
						"UI5Version" : "1.27.1-SNAPSHOT",
						"CreationUTCDateTime" : "/Date(1423809274738)/",
						"LastChangeUTCDateTime" : "/Date(1423809274738)/"
					} ]
				};
				return {
					oFileUpload : {
						files : [ new File([ JSON.stringify(data) ], 'sample.json') ]
					}
				};
			}
		};
	}
	function _getTextPropertyUploadCompleteEvent() {
		return {
			getSource : function() {
				var data = "#ApfApplicationId=1";
				return {
					oFileUpload : {
						files : [ new File([ data ], 'sample.properties') ]
					}
				};
			}
		};
	}
	function _getReaderStub() {
		var reader = new FileReader();
		readerStub = sinon.stub(window, "FileReader", function() {
			return reader;
		});
		readAsTextSpy = sinon.spy(reader, "readAsText");
		return reader;
	}
	QUnit.module("Test Import of conpfiguration and text properties file", {
		beforeEach : function(assert) {
			var oImportFilesController = new sap.ui.controller("sap.apf.modeler.ui.controller.importFiles");
			var spyOnInit = sinon.spy(oImportFilesController, "onInit");
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				var oParentControl = new sap.m.Table();
				getTextSpy = sinon.spy(oModelerInstance.modelerCore, "getText");
				getApplicationHandlerSpy = sinon.stub(oModelerInstance.modelerCore, "getApplicationHandler", _getApplicationHandlerStub(oModelerInstance));
				oImportFilesView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.importFiles",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : oImportFilesController,
					viewData : {
						oParentControl : oParentControl,
						oCoreApi : oModelerInstance.modelerCore
					}
				});
				callbackOverwrite = sinon.stub();
				callbackDoNotOverwrite = sinon.stub();
				showMsgToastSpy = sinon.spy(sap.m.MessageToast, "show");
				fireEventSpy = sinon.spy(oImportFilesView.getViewData().oParentControl, "fireEvent");
				assert.strictEqual(spyOnInit.calledOnce, true, "then import files onInit function is called when view is initialized");
				done();
			});
		},
		afterEach : function() {
			callbackOverwrite.reset();
			callbackDoNotOverwrite.reset();
			getTextSpy.restore();
			getApplicationHandlerSpy.restore();
			showMsgToastSpy.restore();
			fireEventSpy.restore();
			oImportFilesView.destroy();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		}
	});
	QUnit.test("When import files view is initialized", function(assert) {
		//arrange
		var oDialog = oImportFilesView.byId("idImportFilesDialog");
		//assertions on import files dialog
		assert.ok(oImportFilesView, "then importFiles view exists");
		assert.ok(oDialog, "then Dialog to import files from local system exists");
		assert.strictEqual(oDialog.isOpen(), true, "then Dialog to import files from local system is opened on UI");
		assert.strictEqual(getTextSpy.calledWith("importConfig"), true, "then title is set correctly for import files dialog");
		assert.strictEqual(getTextSpy.calledWith("jsonFile"), true, "then text for JSON file label is set correctly");
		assert.strictEqual(getTextSpy.calledWith("jsonFileInputPlaceHolder"), true, "then placeholder for json file uploader is set correctly");
		assert.strictEqual(getTextSpy.calledWith("textFile"), true, "then text for text file label is set correctly");
		assert.strictEqual(getTextSpy.calledWith("textFileInputPlaceHolder"), true, "then placeholder for text file uploader is set correctly");
		assert.strictEqual(getTextSpy.calledWith("upload"), true, "then text for upload button of dialog is set correctly");
		assert.strictEqual(getTextSpy.calledWith("cancel"), true, "then text for cancel button of dialog is set correctly");
	});
	QUnit.test("When import files dialog is opened on UI", function(assert) {
		//act
		oImportFilesView.getController().addAcceptAttribute();
		//assert
		assert.strictEqual(jQuery("#" + oImportFilesView.getId() + "--idJsonFileUploader-fu").attr("accept"), ".json", "then accept attribute of JSONFileUploader is set to .json");
		assert.strictEqual(jQuery("#" + oImportFilesView.getId() + "--idTextFileUploader-fu").attr("accept"), ".properties", "then accept attribute of TextFileUploader is set to .properties");
		//cleanup
		oImportFilesView.getController().handleCancelOfImportFilesDialog();
	});
	QUnit.test("When only .json file is added in uploader and upload button of the dialog is clicked", function(assert) {
		//arrange
		_getDialogAndItsElements();
		var jsonFileUploaderSpy = sinon.spy(jsonFileUploader, "upload");
		jsonFileUploader.setValue("Test.json");
		textFileUploader.setValue("");
		//act
		importDialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(jsonFileUploaderSpy.calledOnce, true, "then upload of json file Called");
		//cleanup
		importDialog.getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		jsonFileUploaderSpy.restore();
	});
	QUnit.test("When only .properties file is added in uploader and upload button of the dialog is clicked", function(assert) {
		//arrange
		_getDialogAndItsElements();
		var textFileUploaderSpy = sinon.spy(textFileUploader, "upload");
		jsonFileUploader.setValue(null);
		textFileUploader.setValue("Test.properties");
		//act
		importDialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(textFileUploaderSpy.calledOnce, true, "then upload of text properties file Called");
		//cleanup
		importDialog.getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		textFileUploaderSpy.restore();
	});
	QUnit.test("When both .json and .properties file is added in uploader and upload button of the dialog is clicked", function(assert) {
		//arrange
		_getDialogAndItsElements();
		var jsonFileUploaderSpy = sinon.spy(jsonFileUploader, "upload");
		jsonFileUploader.setValue("Test.json");
		textFileUploader.setValue("Test.properties");
		//act
		importDialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(jsonFileUploaderSpy.calledOnce, true, "then initially upload of json file is called when both files are present");
		//cleanup
		importDialog.getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		jsonFileUploaderSpy.restore();
	});
	QUnit.test("When clicking on Cancel button of import files dialog", function(assert) {
		//action
		oImportFilesView.byId("idImportFilesDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(oImportFilesView.bIsDestroyed, true, "then view is destroyed");
	});
	if (!sap.ui.Device.browser.msie && !sap.ui.Device.browser.edge) {
		//In IE-Sinon throws error of Object does not support this action so skipping the below two file tests  only in IE
		QUnit.test("When uploading configuration file and both application and configuration do not exist", function(assert) {
			//arrange
			var done = assert.async();
			var importConfigurationLocalStub = function(stringifiedJson, callback, callbackImport) {
				callbackImport("", {}, undefined);
			};
			var importConfigurationSpy = sinon.stub(oImportFilesView.getViewData().oCoreApi, "importConfiguration", importConfigurationLocalStub);
			var reader = _getReaderStub();
			//act		
			oImportFilesView.getController().handleJSONFileUploadComplete(_getJsonUploadCompleteEvent());
			//assert
			assert.strictEqual(readAsTextSpy.calledOnce, true, "then file has been read as text");
			reader.addEventListener("load", function() {
				assert.strictEqual(importConfigurationSpy.calledOnce, true, "then importConfigurationSpy function is called once");
				assert.strictEqual(typeof (importConfigurationSpy.getCall(0).args[0]), "string", "then importConfiguration function is called with stringified json as first parameter");
				assert.ok(importConfigurationSpy.getCall(0).args[1] instanceof Function, "then importConfiguration functions second parameter is a callback(callbackOverwrite,callbackNew)");
				assert.ok(importConfigurationSpy.getCall(0).args[2] instanceof Function, "then importConfiguration functions third parameter is a callback");
				assert.strictEqual(fireEventSpy.calledOnce, true, "then event to update application list is fired");
				assert.strictEqual(fireEventSpy.calledWith("updateAppListEvent"), true, "then event to update application list is fired with correct parameters");
				assert.strictEqual(showMsgToastSpy.calledOnce, true, "then success message toast for successfull import shown on UI");
				done();
				importConfigurationSpy.restore();
			});
			//cleanups
			readerStub.restore();
			oImportFilesView.byId("idImportFilesDialog").getEndButton().firePress();
			sap.ui.getCore().applyChanges();
		});
		QUnit.test("When uploading configuration file and configuration already exists", function(assert) {
			//arrange
			var done = assert.async();
			var importConfigurationSpy = sinon.stub(oImportFilesView.getViewData().oCoreApi, "importConfiguration", _importConfigurationStub);
			var reader = _getReaderStub();
			var oController = oImportFilesView.getController();
			//act		
			oController.handleJSONFileUploadComplete(_getJsonUploadCompleteEvent());
			reader.addEventListener("load", function() {
				//assertions on overwrite confirmation which opens on UI
				var oOverwriteDialog = oImportFilesView.getDependents()[0];
				assert.strictEqual(oOverwriteDialog.isOpen(), true, "then Dialog for overwrite confirmation is opened on UI");
				assert.strictEqual(getTextSpy.calledWith("configAlreadyExists"), true, "then title of overwrite confirmation dialog is set correctly");
				assert.strictEqual(getTextSpy.calledWith("overwriteDialogMsg"), true, "then Overwrite confirmation message label available in the dialog");
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[1].getButtons().length, 2, "then two options either to overwrite or create a new config available");
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[1].getSelectedIndex(), 0, "then first option to overwrite existing configuration is selected by default");
				assert.strictEqual(getTextSpy.calledWith("overwriteConfig"), true, "then text of radio button to overwrite configuration set correctly");
				assert.strictEqual(getTextSpy.calledWith("doNotOverwriteConfig"), true, "then text of radio button to create a new configuration set correctly");
				assert.strictEqual(getTextSpy.calledWith("newConfigTitle"), true, "then text of label for new configuration title set correctly");
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getVisible(), false, "then layout for new configuration title is not visible initially");
				assert.strictEqual(getTextSpy.calledWith("ok"), true, "then text of begin button of overwrite dialog set correctly");
				assert.strictEqual(getTextSpy.calledWith("cancel"), true, "then text of end button of overwrite dialog set correctly");
				//action - select do not overwrite existing configuration radio option(create a new config)
				oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[1]);
				oController.handleChangeForOverwriteConfigOptions();
				//assertions- when do not overwrite existing configuration radio option is selected (create a new config)
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getVisible(), true, "then layout for new configuration title is visible");
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getEnabled(), true, "then input for new configuration title is enabled");
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getValue(), "Test Configuration", "then input for new configuration title is prefilled with existing configuration name");
				//action - select again first option to overwrite configuration
				oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[0]);
				oController.handleChangeForOverwriteConfigOptions();
				//assertions - when there is title for new config title in input field
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getVisible(), true, "then layout for new configuration title is still visible since the input field contains a title");
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getEnabled(), false, "then input for new configuration title is disabled since we switched back to overwrite config option");
				//action - select do not overwrite existing configuration radio option,clear the title in input field and again select first option to overwrite configuration
				oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[1]);
				oController.handleChangeForOverwriteConfigOptions();
				oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].setValue("");
				oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[0]);
				oController.handleChangeForOverwriteConfigOptions();
				//assertions - when there is no title for new config title in input field. Its blank.
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getVisible(), false, "then layout for new configuration title is not visible since the input field was empty");
				//action - select do not overwrite existing configuration radio option,keep input field empty and click on Import
				oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[1]);
				oController.handleChangeForOverwriteConfigOptions();
				oOverwriteDialog.getBeginButton().firePress();
				sap.ui.getCore().applyChanges();
				//assertions - when title for new configuration is left empty
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getValueState(), sap.ui.core.ValueState.Error, "then Value state for input field is set to Error since its blank");
				done();
				importConfigurationSpy.restore();
			});
			//cleanups
			readerStub.restore();
			oImportFilesView.byId("idImportFilesDialog").getEndButton().firePress();
			sap.ui.getCore().applyChanges();
			assert.strictEqual(oImportFilesView.getDependents()[0], undefined, "then on cancel press overwrite dialog is destroyed");
		});
		QUnit.test("When uploading configuration and when configuration already exists and on overwriting the existing configuration", function(assert) {
			//arrange
			var done = assert.async();
			var importConfigurationSpy = sinon.stub(oImportFilesView.getViewData().oCoreApi, "importConfiguration", _importConfigurationStub);
			var reader = _getReaderStub();
			//act		
			oImportFilesView.getController().handleJSONFileUploadComplete(_getJsonUploadCompleteEvent());
			reader.addEventListener("load", function() {
				oImportFilesView.getDependents()[0].getBeginButton().firePress();
				sap.ui.getCore().applyChanges();
				callbackImport("", {}, undefined);//call callbackImport explicitly after callbackOverwrite/callbackCreateNew are executed
				//assertion
				assert.strictEqual(importConfigurationSpy.calledOnce, true, "then importConfigurationSpy function is called once");
				assert.strictEqual(callbackOverwrite.calledOnce, true, "then callback for overwrite is called and existing configuration is overwritten");
				assert.strictEqual(callbackDoNotOverwrite.called, false, "then callback for creating a new config is not called");
				assert.strictEqual(fireEventSpy.calledOnce, true, "then event to update application list is fired");
				assert.strictEqual(fireEventSpy.calledWith("updateAppListEvent"), true, "then event to update application list is fired with correct parameters");
				assert.strictEqual(showMsgToastSpy.calledOnce, true, "then success message toast for successfull import shown on UI");
				done();
				importConfigurationSpy.restore();
			});
			//cleanups
			readerStub.restore();
			oImportFilesView.byId("idImportFilesDialog").getEndButton().firePress();
			sap.ui.getCore().applyChanges();
		});
		QUnit.test("When uploading configuration and when configuration already exists and on not overwriting existing configuration and providing a title for new config", function(assert) {
			//arrange
			var done = assert.async();
			var importConfigurationSpy = sinon.stub(oImportFilesView.getViewData().oCoreApi, "importConfiguration", _importConfigurationStub);
			var reader = _getReaderStub();
			var oController = oImportFilesView.getController();
			//act		
			oController.handleJSONFileUploadComplete(_getJsonUploadCompleteEvent());
			reader.addEventListener("load", function() {
				var oOverwriteDialog = oImportFilesView.getDependents()[0];
				oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[1]);
				oController.handleChangeForOverwriteConfigOptions();
				oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].setValue("New Title For Config");
				oOverwriteDialog.getBeginButton().firePress();
				sap.ui.getCore().applyChanges();
				callbackImport("", {}, undefined);//call callbackImport explicitly after callbackOverwrite/callbackCreateNew are executed
				//assertion
				assert.strictEqual(importConfigurationSpy.calledOnce, true, "then importConfigurationSpy function is called once");
				assert.strictEqual(callbackDoNotOverwrite.calledOnce, true, "then callback for creating a new config is called and a new config is created without overriding the existing one");
				assert.strictEqual(callbackOverwrite.called, false, "then callback for overwrite is not called");
				assert.strictEqual(fireEventSpy.calledOnce, true, "then event to update application list is fired");
				assert.strictEqual(fireEventSpy.calledWith("updateAppListEvent"), true, "then event to update application list is fired with correct parameters");
				assert.strictEqual(showMsgToastSpy.calledOnce, true, "then success message toast for successfull import shown on UI");
				done();
				importConfigurationSpy.restore();
			});
			//cleanups
			readerStub.restore();
			oImportFilesView.byId("idImportFilesDialog").getEndButton().firePress();
			sap.ui.getCore().applyChanges();
		});
		QUnit.test("When importing configuration and when configuration already exists and on not overwriting existing configuration and not providing title for new config", function(assert) {
			//arrange
			var done = assert.async();
			var importConfigurationSpy = sinon.stub(oImportFilesView.getViewData().oCoreApi, "importConfiguration", _importConfigurationStub);
			var reader = _getReaderStub();
			var oController = oImportFilesView.getController();
			//act		
			oController.handleJSONFileUploadComplete(_getJsonUploadCompleteEvent());
			reader.addEventListener("load", function() {
				var oOverwriteDialog = oImportFilesView.getDependents()[0];
				oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[1]);
				oController.handleChangeForOverwriteConfigOptions();
				oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].setValue("");
				oOverwriteDialog.getBeginButton().firePress();
				sap.ui.getCore().applyChanges();
				callbackImport("", {}, undefined);//call callbackImport explicitly after callbackOverwrite/callbackCreateNew are executed
				//assertion
				assert.strictEqual(importConfigurationSpy.calledOnce, true, "then importConfigurationSpy function is called once");
				assert.strictEqual(callbackOverwrite.called, false, "then callback for creating a new config is not called");
				assert.strictEqual(callbackDoNotOverwrite.called, false, "then callback for overwrite is not called");
				assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getValueState(), sap.ui.core.ValueState.Error, "then Value state for input field is set to Error since title for new config is empty");
				done();
				importConfigurationSpy.restore();
			});
			//cleanups
			readerStub.restore();
			oImportFilesView.byId("idImportFilesDialog").getEndButton().firePress();
			sap.ui.getCore().applyChanges();
		});
		QUnit.test("When uploading properties file, configuration file is present in uploader", function(assert) {
			//arrange
			var done = assert.async();
			var oImportTextsSpy = sinon.spy(oImportFilesView.getViewData().oCoreApi, "importTexts");
			var reader = _getReaderStub();
			oImportFilesView.byId("idJsonFileUploader").setValue("Test.json");
			//act
			oImportFilesView.getController().handleTextFileUploadComplete(_getTextPropertyUploadCompleteEvent());
			//assert
			assert.strictEqual(readAsTextSpy.calledOnce, true, "then file has been read as text");
			reader.addEventListener("load", function() {
				assert.strictEqual(oImportTextsSpy.calledOnce, true, "then core api to Import Texts is called");
				done();
				oImportTextsSpy.restore();
			});
			readerStub.restore();
			oImportFilesView.byId("idImportFilesDialog").getEndButton().firePress();
			sap.ui.getCore().applyChanges();
		});
		QUnit.test("When uploading properties file, configuration file is not present in uploader", function(assert) {
			//arrange
			var done = assert.async();
			var oImportTextsSpy = sinon.spy(oImportFilesView.getViewData().oCoreApi, "importTexts");
			var reader = _getReaderStub();
			oImportFilesView.byId("idJsonFileUploader").setValue("");
			//act
			oImportFilesView.getController().handleTextFileUploadComplete(_getTextPropertyUploadCompleteEvent());
			//assert
			assert.strictEqual(readAsTextSpy.calledOnce, true, "then file has been read as text");
			reader.addEventListener("load", function() {
				assert.strictEqual(oImportTextsSpy.calledOnce, false, "then core api to Import Texts is not called");
				assert.strictEqual(showMsgToastSpy.calledOnce, true, "then message toast to select json file before uploading properties file is shown");
				assert.strictEqual(getTextSpy.calledWith("chooseJsonFile"), true, "then message toast to select json file before uploading properties file is called with correct text");
				done();
				oImportTextsSpy.restore();
			});
			readerStub.restore();
			oImportFilesView.byId("idImportFilesDialog").getEndButton().firePress();
			sap.ui.getCore().applyChanges();
		});
	}
}());