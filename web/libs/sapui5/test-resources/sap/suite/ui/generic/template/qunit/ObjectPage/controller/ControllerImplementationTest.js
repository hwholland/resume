/*
 * tests for the sap.suite.ui.generic.template.ObjectPage.controller.ControllerImplementation
 */

sap.ui.require(
				["sap/ui/thirdparty/sinon", "sap/ui/thirdparty/sinon-qunit",
						"sap/suite/ui/generic/template/lib/TemplateAssembler",
						"sap/suite/ui/generic/template/ObjectPage/controller/ControllerImplementation"],
				function(sinon, sinonQunit, TemplateAssembler, ControllerImplementation) {
					"use strict";

					jQuery.sap.require("sap.suite.ui.generic.template.lib.CommonUtils");

					var bHasPreserveChanges;
					var bModelReadCalled;
					var mModelReadParameters;
					var bCRUDManagerEditCalled;
					var bCRUDManagerEditPreserveChanges;
					var pCRUDManagerEditReturn = {
						then: jQuery.noop
					};
					var oUnsavedChangesDialogController;
					var bNavigateToContextCalled;
					var oNavigationTarget;

					var oTemplateUtils = {
						// oCommonUtils: sinon.createStubInstance(sap.suite.ui.generic.template.lib.CommonUtils)
						oCommonUtils: {
							triggerPrepareOnEnterKeyPress: jQuery.noop, // needed for setup
							executeGlobalSideEffect: jQuery.noop, // needed for setup
							getDialogFragment: function(sName, oController) { // needed for setup
								switch (sName) {
									case "sap.suite.ui.generic.template.ObjectPage.view.fragments.UnsavedChangesDialog":
										oUnsavedChangesDialogController = oController;
										return {
											getModel: function() {
												return {
													setProperty: jQuery.noop
												};
											},
											open: jQuery.noop,
											close: jQuery.noop
										};
								}
							},
							getText: jQuery.noop,
							isDraftEnabled: true,
							setRootPageToDirty: jQuery.noop
						},
						oComponentAPI: {
							registerView: jQuery.noop
						// needed for setup
						},
						oServices: {
							oDraftController: {
								getDraftContext: function() {
									return {
										isDraftRoot: function() {
											return true;
										},
										hasDraftAdministrativeData: function() {
											return true;
										},
										hasDraft: function() {
											return true;
										},
										hasPreserveChanges: function() { // new function to check whether new parameter is available
											return bHasPreserveChanges;
										}
									};
								}
							},
							oCRUDManager: {
								editEntity: function(bPreserveChanges) {
									bCRUDManagerEditCalled = true;
									bCRUDManagerEditPreserveChanges = bPreserveChanges;
									return pCRUDManagerEditReturn;
								}
							},
							oNavigationController: {
								navigateToContext: function(oContext) {
									bNavigateToContextCalled = true;
									oNavigationTarget = oContext;
								}
							}
						}
					};
					var oController = {
						getOwnerComponent: function() {
							return {
								getEntitySet: jQuery.noop,
								getBindingContext: function() {
									return {
										getPath: jQuery.noop
									};
								},
								getModel: function() {
									return {
										read: function(oPath, mParameters) {
											bModelReadCalled = true;
											mModelReadParameters = mParameters;
										}
									};
								}
							};
						}
					};
					var oMethods;

					module("ObjectPage.controller.ControllerImplementation", {
						setup: function() {
							oMethods = ControllerImplementation.getMethods(oTemplateUtils, oController);
							oMethods.onInit();
						},
						teardown: function() {
						}
					});

					QUnit.test("onEdit: old behaviour (without preserveChanges)",
							function(assert) {

								// preparation
								bHasPreserveChanges = false;
								bModelReadCalled = mModelReadParameters = bCRUDManagerEditCalled = undefined;

								// 1. Step: request DraftAdminData, when edit is pressed
								oMethods.handlers.onEdit();

								assert.equal(bModelReadCalled, true, "model read called when editing");
								assert.deepEqual(mModelReadParameters.urlParameters, {
									"$expand": "DraftAdministrativeData"
								}, "Expand on DraftAdminData requested");
								assert.equal(typeof (mModelReadParameters.success), "function", "Success function provided");

								// 2. Step:
								// a) no DraftAdminData (i.e. no draft) -> start editing
								mModelReadParameters.success({});
								assert.equal(bCRUDManagerEditCalled, true, "Edit called, when no draft exists");

								// b) own draft -> start editing
								bCRUDManagerEditCalled = undefined;
								mModelReadParameters.success({
									DraftAdministrativeData: {
										DraftIsProcessedByMe: true
									}
								});
								assert.equal(bCRUDManagerEditCalled, true, "Edit called, when own draft exists");

								// c) locked by another user -> start editing!!!
								// (in this case, error from backend is expected, which leads to message popup send by
								// BaseViewController
								bCRUDManagerEditCalled = undefined;
								mModelReadParameters.success({
									DraftAdministrativeData: {
										DraftIsProcessedByMe: false,
										InProcessByUser: "OTHER USER"
									}
								});
								assert.equal(bCRUDManagerEditCalled, true, "Edit called, when no draft by other user exists");

								// d) expired draft by another user -> unsaved changes popup shown
								bCRUDManagerEditCalled = undefined;
								mModelReadParameters.success({
									DraftAdministrativeData: {
										DraftIsProcessedByMe: false,
										InProcessByUser: ""
									}
								});
								assert.equal(bCRUDManagerEditCalled, undefined,
										"Edit not called, when expired draft by other user exists");
								assert.equal(typeof (oUnsavedChangesDialogController), "object",
										"Unsaved changes Popup created with controller...");
								assert.equal(typeof (oUnsavedChangesDialogController.onEdit), "function",
										"... with event handler onEdit");
								assert.equal(typeof (oUnsavedChangesDialogController.onCancel), "function", "... and onCancel");

								// e) if user cancels - no edit to be called
								bCRUDManagerEditCalled = undefined;
								oUnsavedChangesDialogController.onCancel();
								assert.equal(bCRUDManagerEditCalled, undefined, "Edit not called, when user cancels");

								// f) if user wants to discard others users draft and edit himself -> start editing
								bCRUDManagerEditCalled = undefined;
								oUnsavedChangesDialogController.onEdit();
								assert.equal(bCRUDManagerEditCalled, true,
										"Edit called, when user decides to discard others users draft and edit himself");

							});

					QUnit
							.test(
									"onEdit: new behaviour (with preserveChanges), no or own draft",
									function(assert) {
//										 var done = assert.async();
//										 setTimeout(function(){

										// preparation
										bHasPreserveChanges = true;

										// 1. Step: don't request DraftAdminData, when edit is pressed, but directly start editing
										// in several cases, this should just be fine -> navigation to the draft should happen
										// a) no DraftAdminData (i.e. no draft)
										// b) own draft
										bModelReadCalled = mModelReadParameters = bCRUDManagerEditCalled = bCRUDManagerEditPreserveChanges = bNavigateToContextCalled = oNavigationTarget = undefined;
										pCRUDManagerEditReturn = new Promise(function(resolve, reject) {
											resolve({
												context: "dummy"
											});
										});
										oMethods.handlers.onEdit();

										assert.equal(bModelReadCalled, undefined, "no model read call when editing");
										assert.equal(bCRUDManagerEditCalled, true, "but directly edit called");
										assert.equal(bCRUDManagerEditPreserveChanges, true, "... with preserve changes set to true");
										pCRUDManagerEditReturn.then(function() {
											assert.equal(bNavigateToContextCalled, true, "navigate called");
											assert.equal(oNavigationTarget, "dummy", "...with context given by CRUDManager");
										});
//										 done();
//										 })
									});

					QUnit
							.test(
									"onEdit: new behaviour (with preserveChanges), locked by other user",
									function(assert) {
//										var done = assert.async();
//										setTimeout(function() {

											// preparation
											bHasPreserveChanges = true;

											// in other cases, this should be rejected
											// c) locked by another user
											// d) expired draft by another user
											bModelReadCalled = mModelReadParameters = bCRUDManagerEditCalled = bCRUDManagerEditPreserveChanges = bNavigateToContextCalled = undefined;
											pCRUDManagerEditReturn = new Promise(function(resolve, reject) {
												reject();
											});
											oMethods.handlers.onEdit();

											assert.equal(bModelReadCalled, undefined, "no model read call when editing");
											assert.equal(bCRUDManagerEditCalled, true, "but directly edit called");
											assert.equal(bCRUDManagerEditPreserveChanges, true, "... with preserve changes set to true");

											pCRUDManagerEditReturn.then(function() {
												assert.equal(bNavigateToContextCalled, undefined, "navigate not called");
											});

//											done();
//										})

									});

					QUnit
							.test(
									"onEdit: new behaviour (with preserveChanges), unsaved changes by other user",
									function(assert) {
//										var done = assert.async();
//										setTimeout(function() {

											// preparation
											bHasPreserveChanges = true;

											// in other cases, this should be rejected
											// c) locked by another user
											// d) expired draft by another user
											bModelReadCalled = mModelReadParameters = bCRUDManagerEditCalled = bCRUDManagerEditPreserveChanges = oUnsavedChangesDialogController = undefined;
											pCRUDManagerEditReturn = new Promise(function(resolve, reject) {
												resolve({
													unsavedChanges: {
														sCreatedByUserDescription: "Other User"
													}
												});
											});
											oMethods.handlers.onEdit();

											assert.equal(bModelReadCalled, undefined, "no model read call when editing");
											assert.equal(bCRUDManagerEditCalled, true, "but directly edit called");
											assert.equal(bCRUDManagerEditPreserveChanges, true, "... with preserve changes set to true");

											pCRUDManagerEditReturn.then(function() {
												assert.equal(typeof (oUnsavedChangesDialogController), "object",
												"Unsaved changes Popup created with controller...");
										assert.equal(typeof (oUnsavedChangesDialogController.onEdit), "function",
												"... with event handler onEdit");
										assert.equal(typeof (oUnsavedChangesDialogController.onCancel), "function", "... and onCancel");

										// e) if user cancels - no edit to be called
										bCRUDManagerEditCalled = undefined;
										oUnsavedChangesDialogController.onCancel();
										assert.equal(bCRUDManagerEditCalled, undefined, "Edit not called, when user cancels");

										// f) if user wants to discard others users draft and edit himself -> start editing
										bCRUDManagerEditCalled = bCRUDManagerEditPreserveChanges = undefined;
										pCRUDManagerEditReturn = new Promise(function(resolve, reject) {
											resolve({
												context: "dummy"
											});
										});

										oUnsavedChangesDialogController.onEdit();
										assert.equal(bCRUDManagerEditCalled, true,
												"Edit called again, when user decides to discard others users draft and edit himself");
										assert.equal(bCRUDManagerEditPreserveChanges, false, "... but this time with preserve changes set to false");
										pCRUDManagerEditReturn.then(function() {
											assert.equal(bNavigateToContextCalled, true, "navigate called");
											assert.equal(oNavigationTarget, "dummy", "...with context given by CRUDManager");
										});
											});

//											done();
//										})

									});
				});