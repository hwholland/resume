(function() {
	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.registerModulePath('sap.apf.integration', '../');
	jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
	jQuery.sap.require('sap.apf.integration.withDoubles.helper');
	jQuery.sap.require('sap.apf.integration.withDoubles.persistenceHelper');
	jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
	jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
	jQuery.sap.require('sap.apf.testhelper.doubles.uiApi');
	jQuery.sap.require('sap.apf.testhelper.doubles.navigationHandler');
	jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
	jQuery.sap.require('sap.apf.testhelper.doubles.request');
	jQuery.sap.require('sap.apf.testhelper.doubles.representation');
	jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
	jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
	jQuery.sap.require('sap.apf.testhelper.doubles.sessionHandlerNew');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.Component');
	jQuery.sap.require('sap.apf.ui.instance');
	jQuery.sap.require("jquery.sap.storage");
	jQuery.sap.require("sap.ui.test.Opa5");
	jQuery.sap.require("sap.ui.test.opaQunit");

	var oGlobalApi, oStep, analysisPath, analysisPathController;
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
	var arrangement = sap.ui.test.Opa5.extend("arrangement", {
		globalSetup : function() {
			sap.apf.testhelper.injectURLParameters({"sap-client" : "777"});
			sap.apf.integration.withDoubles.helper.saveConstructors();
			sap.apf.integration.withDoubles.persistenceHelper.setup(this);
			var inject = {
					constructors : {
						NavigationHandler : sap.apf.testhelper.doubles.NavigationHandler
				}
			};
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi(undefined, undefined, inject);

			sap.apf.integration.withDoubles.persistenceHelper.init();
			var spyGetLayoutView = function() {
				this.layout = new sap.ui.layout.VerticalLayout();
				this.layout.getController = function() {
					this.setFilter = function(param) {
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
					this.enableDisableOpenIn = function() {
						return null;
					};
					return this;
				};
				return this.layout;
			};
			var spy1 = sinon.spy(spyGetLayoutView);
			sinon.stub(oGlobalApi.oUiApi, "getLayoutView", spy1);
			analysisPath = oGlobalApi.oUiApi.getAnalysisPath();
			analysisPathController = analysisPath.getController();
		}
	});
	var action = sap.ui.test.Opa5.extend("action", {
		createStep : function() {
			var self = this;
			oStep = oGlobalApi.oCoreApi.createStep(oGlobalApi.oCoreApi.getStepTemplates()[0].id, function() {
				return;
			}, oGlobalApi.oCoreApi.getStepTemplates()[0].getRepresentationInfo()[0].representationId);// creating a step
			return this.waitFor({
				check : function() {
					var bStepExists = false;
					var stepLength = oGlobalApi.oCoreApi.getSteps().length;
					if (stepLength > 0) {
						bStepExists = true;
					}
					return bStepExists;
				},
				success : function() {
					oGlobalApi.oCoreApi.setActiveStep(oStep);
				},
				error : function() {
					ok(false, "Step creation failed!!!");
					self.globalTearDown();
				}
			});
		},
		pressCancelOnNewAnalysisPathDialog : function() {
			var self = this, bStarInName;
			analysisPathController.refresh(0);
			equal(oGlobalApi.oCoreApi.getSteps().length, 1, "One step is available in the analysis path");
			strictEqual(oGlobalApi.oCoreApi.isDirty(), true, "Dirty state is true");
			bStarInName = (analysisPath.oSavedPathName.getTitle().indexOf("*") !== -1);
			strictEqual(bStarInName, true, "Dirty state is indicated in the path name");
			analysisPath.getToolbar().oActionListItem.getItems()[0].firePress();
			return this.waitFor({
				check : function() {
					self.newPathDialog = findDialogByTitle(oGlobalApi.oCoreApi.getTextNotHtmlEncoded("newPath"));
					var bNewDialogExists = false;
					if (self.newPathDialog) {
						bNewDialogExists = true;
					}
					return bNewDialogExists;
				},
				success : function() {
					self.newPathDialog.getEndButton().firePress();
				},
				error : function() {
					ok(false, "Dialog for New Path is not on the UI!!!");
					self.globalTearDown();
				}
			});
		},
		pressOkOnNewAnalysisPathDialog : function() {
			var self = this,
			    bStarInName;
			analysisPathController.refresh(0);
            strictEqual(oGlobalApi.oCoreApi.isDirty(), true, "Dirty state is true");
            bStarInName = (analysisPath.oSavedPathName.getTitle().indexOf("*") !== -1);
            strictEqual(bStarInName, true, "Dirty state is indicated in the path name");
			analysisPath.getToolbar().oActionListItem.getItems()[0].firePress();
			return this.waitFor({
				check : function() {
					self.newPathDialog = findDialogByTitle(oGlobalApi.oCoreApi.getTextNotHtmlEncoded("newPath"));
					var bNewDialogExists = false;
					if (self.newPathDialog) {
						bNewDialogExists = true;
					}
					return bNewDialogExists;
				},
				success : function() {
					self.newPathDialog.getBeginButton().firePress();
				},
				error : function() {
					ok(false, "Dialog for New Path is not on the UI!!!");
					self.globalTearDown();
				}
			});
		},
		pressOkOnSaveAnalysisPathDialog : function() {
			var self = this;
			oGlobalApi.oCoreApi.savePath("myPath", callbackSave.bind(this));
			function callbackSave(oResponse, oEntityTypeMetadata, oMessageObject) {
				equal(oEntityTypeMetadata.type, "entityTypeMetadata", "Correct type of metadata");
				equal(oMessageObject, undefined, "Message object expected undefined");
				sPathId = oResponse.AnalysisPath;
				oGlobalApi.oCoreApi.readPaths(callbackRead.bind(this));
			}
			function callbackRead(data) {
				var galleryData = data.paths;
				this.analysisPathName = data.paths[0].AnalysisPathName;
				var utcDate = data.paths[0].LastChangeUtcDateTime;
				var date = ((new Date(utcDate)).toString()).split(' ');
				var dateToShow = date[1] + "-" + date[2] + "-" + date[3];
				this.StepCount = data.paths[0].StructuredAnalysisPath.steps.length;
				this.indexOfActiveStep = data.paths[0].StructuredAnalysisPath.indexOfActiveStep;
				var guid = data.paths[0].AnalysisPath;
				galleryData[0].guid = guid;
				galleryData[0].StructuredAnalysisPath.noOfSteps = this.StepCount;
				galleryData[0].description = dateToShow;
				galleryData[0].summary = this.analysisPathName;
				var jsonData = {
					GalleryElements : galleryData
				};
				var oInject = {
					uiApi : oGlobalApi.oUiApi,
					oCoreApi : oGlobalApi.oCoreApi,
					oContext : oGlobalApi.oContext
				};
				this.pathGallery = new sap.ui.view({
					type : sap.ui.core.mvc.ViewType.JS,
					viewName : "sap.apf.ui.reuse.view.pathGallery",
					viewData : {
						oInject : oInject,
						jsonData : jsonData
					}
				});
			}
			return this.waitFor({
				timeout : 1000,
				check : function() {
					self.saveDialog = findDialogByTitle(oGlobalApi.oCoreApi.getTextNotHtmlEncoded("save-analysis-path"));
					var bSaveDialogExists = false;
					if (self.saveDialog) {
						bSaveDialogExists = true;
					}
					return bSaveDialogExists;
				},
				success : function() {
					self.saveDialog.getBeginButton().firePress();
				},
				error : function() {
					ok(false, "Dialog for save Path is not on the UI!!!");
					self.globalTearDown();
				}
			});
		}
	});
	var assertion = sap.ui.test.Opa5.extend("assertion", {
		checkNewPathCreated : function() {
			var self = this;
			return this.waitFor({
				check : function() {
					var bNewPathCreated = false;
					var stepLength = oGlobalApi.oCoreApi.getSteps().length;
					if (stepLength === 0) {
						bNewPathCreated = true;
					}
					return bNewPathCreated;
				},
				success : function() {
					var stepsAfterReset = oGlobalApi.oCoreApi.getSteps().length,
					    bNoStarInName;
					equal(stepsAfterReset, 0, "No step present in analysis path");// new path button clicked , no step available in the path
					analysisPathController.refresh(0);
					strictEqual(oGlobalApi.oCoreApi.isDirty(), false, 'New path is clean'); 
					bNoStarInName = (analysisPath.oSavedPathName.getTitle().indexOf("*") == -1);
					strictEqual(bNoStarInName, true, "Dirty state is not indicated in the path name");
					self.globalTearDown();
				},
				error : function() {
					ok(false, "Path not saved!!!");
					self.globalTearDown();
				}
			});
		},
		globalTearDown : function() {
			sap.apf.integration.withDoubles.helper.restoreConstructors();
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
			oGlobalApi.oCompContainer.destroy();
		}
	});
	sap.ui.test.Opa5.extendConfig({
		arrangements : new arrangement(),
		actions : new action(),
		assertions : new assertion()
	});
	opaTest("Functionality of creating a new path from menu popover with saving the existing path", function(Given, When, Then) {
		Given.globalSetup(); // Arrangements
		When.createStep().and.pressOkOnNewAnalysisPathDialog().and.pressOkOnSaveAnalysisPathDialog(); //Actions - create steps,check on new and save the existing path
		Then.checkNewPathCreated(); // Assertions
	});
	opaTest("Functionality of creating a new path from menu popover without saving the existing path", function(Given, When, Then) {
		Given.globalSetup(); // Arrangements
		When.createStep().and.pressCancelOnNewAnalysisPathDialog(); //Actions-create steps,check on new and save the existine path
		Then.checkNewPathCreated(); // Assertions
	});
}());