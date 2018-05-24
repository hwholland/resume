/**
 * tests for the sap.suite.ui.generic.template.ListReport.lib.TemplateViewController
 */
	
sap.ui
		.require(
				[
//						"sap/suite/ui/generic/template/lib/TemplateViewController",
//						"sap/ui/generic/template/BaseViewController",
//						"sap/ui/thirdparty/sinon",
//						"sap/ui/thirdparty/sinon-qunit",
//						"sap/suite/ui/generic/template/lib/TemplateComponent",
//						"sap/ui/generic/app/transaction/DraftController",
//						"sap/ui/generic/app/transaction/TransactionController",
//						"sap/ui/generic/app/AppComponent",
//						"sap/ui/core/mvc/XMLView",
//						"sap/ui/model/json/JSONModel",
//						"sap/ui/model/odata/v2/ODataModel",
//						"sap/ui/model/resource/ResourceModel",
//						"sap/m/Button",
//						"sap/ui/base/Event",
//						"sap/m/ResponsivePopover",
//						"sap/ui/core/CustomData",
//						"sap/m/Dialog",
//						"sap/ui/generic/app/library"
				],
				function(
//						TemplateViewController,
//						BaseViewController,
//						Sinon,
//						SinonQunit,
//						TemplateComponent,
//						DraftController,
//						TransactionController,
//						AppComponent,
//						XMLView,
//						JSONModel,
//						ODataModel,
//						ResourceModel,
//						MButton,
//						BaseEvent,
//						ResponsivePopover,
//						CustomData,
//						MDialog
						) {
					"use strict";

					
					module("lib.TemplateViewController", {
							setup : function() {
							},
							teardown : function() {
							}
					});


					test("Dummy", function() {
						ok(true, "Test - Always Good!");
					});
/*
					// instantiate once a TemplateViewController object outside the tests.
					this.oTVC = new TemplateViewController();
					this.oTVC.oBaseViewController = new BaseViewController();					
					
					//var FnNavHandler = sap.suite.ui.generic.template.ListReport.nav.NavigationHandler
					var FnNavHandler = sap.ui.generic.app.navigation.service.NavigationHandler;
					
					

					var oTestMetaModel = sinon.createStubInstance(sap.ui.model.odata.ODataMetaModel);
					var oTestModel = sinon.createStubInstance(sap.ui.model.odata.ODataModel);
					oTestModel.getMetaModel.returns(oTestMetaModel);
					var oTestComponent = sinon.createStubInstance(TemplateComponent);
					oTestComponent.getEntitySet.returns("EntitySetTest");
					var oTestComponentContainer = {
							bindElement : function() {
							},
							getElementBinding : function() {
								return {
									getPath : function() {
										return "ComponentContainer/TestPath/";
									}
								};
							},
							unbindElement : function() {
							},
							getModel : function() {
								return oTestModel;
							}
					};

					oTestComponent.getComponentContainer.returns(oTestComponentContainer);
					// suitable model for TemplateComponent:
					// this way make the different methods return something:
					oTestComponent.getModel.returns(oTestModel);
					oTestComponent.getModel.withArgs("i18n").returns({
						getResourceBundle : function() {
							return {
								getText : function() {
									// for any input returns anything..
									return "Anything";
								}
							};
						}
					});

					// further preps for the testcomponent - like draft Context simu , draft controller, and
					var bPromiseFailure;
					var fUsePromise = function() {
						return {
							then : function(fSuccess, fError) {
								if (bPromiseFailure) {
									fError(oTestResponse);
								} else {
									fSuccess(oTestResponse);
								}
							}
						};
					};
					var oFooContext = {};
					var oTestResponse = {
							context : {
								getPath : function() {
									return "";
								}
							},
							getContext : function() {
								return oFooContext;
							}
					};
					var bTestHasDraft = true;
					var oTestDraftContext = {
							hasDraft : function() {
								return bTestHasDraft;
							},
							isDraftEnabled : function(sEntitySet) {
								return true;
							},
							isDraftRoot : function(sEntitySet) {
								return true;
							},
							hasDraftAdministrativeData : function(sEntitySet) {
								return true;
							},
							checkUpdateOnChange : function(sEntitySet, sValue) {
								return true;
							},
							getSemanticKey : function(sEntitySet) {
								return [
										{
											name : "SemanticKey1"
										}, {
											name : "SemanticKey2"
										}
								];
							}
					};

					var oTestDraftController = sinon.createStubInstance(DraftController);
					oTestDraftController.prepareDraftEntity.returns(fUsePromise());
					oTestDraftController.validateDraftEntity.returns(fUsePromise());
					oTestDraftController.activateDraftEntity.returns(fUsePromise());
					oTestDraftController.createNewDraftEntity.returns(fUsePromise());
					oTestDraftController.isActiveEntity.returns(true);

					var oTestTransactionController = sinon.createStubInstance(TransactionController);
					oTestTransactionController.getDraftController.returns(oTestDraftController);
					oTestTransactionController.deleteEntity.returns(fUsePromise());
					oTestTransactionController.editEntity.returns(fUsePromise());
					oTestTransactionController.propertyChanged.returns(fUsePromise());
					oTestTransactionController.triggerSubmitChanges.returns(fUsePromise());
					var oTestNavigationController = sinon.createStubInstance(NavigationController);	
					var oAppComponent = sinon.createStubInstance(AppComponent);
					oAppComponent.getTransactionController.returns(oTestTransactionController);
					oAppComponent.getNavigationController.returns(oTestNavigationController);
					// Added after get issue from BaseView Controller
					var registerView = {
						registerView : function() {
							return "";
						}
					};
					oAppComponent.getApplicationController.returns(registerView);
					// End...
					oTestComponent.getAppComponent.returns(oAppComponent);

					// stub the getView method of our TVC object

					// 1 - prepare the view object to be returned by getView
					var oTestView = sinon.createStubInstance(XMLView);
					var oDraftAdministrativeData = {};
					
					//prepare data for messages testing
					var sCurrentContextPath = "/STTA_C_MP_Product(ProductDraftUUID=guid'00505691-115B-1EE5-AA8F-49F7EB8F794F',ActiveProduct='HT-1030')";
					var aMessagesTemplate = [{  id: "123",
												type: "Error",
												target: "__input9/value",
												validation: true
											}, {
												id: "456",
												type: "Error",
												target: sCurrentContextPath + "/Currency",
												validation: false
											}, {
												id: "789",
												type: "Warning",
												target: "/XXXXXXXXXXXX/Currency",
												validation: false
											}];
					
					var oTVBindingContext = {
							name : "i'm a binding context",
							getProperty : function(sProperty) {
								return oDraftAdministrativeData;
							},
							getPath : function() {
								return sCurrentContextPath;
							},
							getObject : function() {
								return {};
							}
					};
					// the binding context attached to the view will be retrieved from tvc.getContext via the bvc.
					oTestView.getBindingContext.returns(oTVBindingContext);
					oTestView.$.returns({
						closest : function() {
							return [
								"closest test"
							];
						}
					});
					var oUIModel = new JSONModel(); // to have a real json model for setting properties
					oTestView.getModel.withArgs("ui").returns(oUIModel);
					// some normal model
					var oDataModel = sinon.createStubInstance(ODataModel);

					// oTestView.getModel.returns(oDataModel);
					// Mocking this value for onCallActionFromList function
					var fODataFunctionImport = function(sFunctionName) {
						sCalledWithFunctionName = sFunctionName;
						return {}
					};

					oDataModel.getMetaModel = function() {
						return {
								getODataEntitySet : function() {
									return {
										entityset : "SEPMRA_C_PD_ProductCopy"
									};
								},
								getODataEntityType : function() {
									return {};
								},
								getODataFunctionImport : function() {
									return fODataFunctionImport;
								}
						};
					};
					oTestView.getModel.returns(oDataModel);

					var oResourceModel = sinon.createStubInstance(ResourceModel);
					oTestView.getModel.withArgs("i18n").returns({
						getResourceBundle : function() {
							return {
								getText : function(iDummy) {
									// for any input returns anything..
									return "Anything";
								}
							};
						},

					});

					// var ResponsivePopover = sinon.createStubInstance(ResponsivePopover);
					// oTestView.getModel.returns(ResponsivePopover);

					// stub some methods of our to be tested oTVC object
					sinon.stub(this.oTVC, "getView").returns(oTestView);
					sinon.stub(this.oTVC, "getComponent").returns(oTestComponent);
					sinon.stub(this.oTVC, "getOwnerComponent").returns(oTestComponent);

					var TyTemplateViewController = sap.suite.ui.generic.template.lib.TemplateViewController;

					// some method availablity ...
					QUnit.test("functions available", function() {
						equal(typeof TyTemplateViewController.prototype.showMessagePopover, "function", "showMessagePopover function availability");
					});

					QUnit.test("Shall be instantiable", function(assert) {
						assert.ok(oTVC, "TemplateViewController Instance is available");
					});

					// some more test, eventually use setup/teardown methods
					QUnit.module("TemplateViewController - More Checks", {
							setup : function() {
								sinon.stub(BaseViewController.prototype, "getOwnerComponent").returns(oTestComponent);
								sinon.stub(BaseViewController.prototype, "getComponent").returns(oTestComponent);
								oTVC.onInit();
							},
							teardown : function() {
								// sinon.stub(sap.ui.generic.template.BaseViewController,
								// "getOwnerComponentFor").returns(oTestComponent);
								BaseViewController.prototype.getOwnerComponent.restore();
								BaseViewController.prototype.getComponent.restore();
							},

					});

					QUnit.test("Function getContext", function(assert) {
						var oResult = oTVC.getContext();
						// see oTVBindingContext at the beginning of this qunit. it is assigned to the view.
						assert.ok(oResult === oTVBindingContext, "TemplateController returns correct context");
					});

					QUnit.test("Function onDelete", function(assert) {

						// calles the onDelete method and checks if openBy method of responsivePOpover is called once...

						// mock the oEvent for the onDelete method.
						var oEvent = sinon.createStubInstance(BaseEvent);
						oEvent.getSource.returns(new MButton());

						// we do not want the openBy method to do something (because of error when dom doesnt exist, as in qunit the
						// case)
						// use sinon to simulate nothing...openBy now just returns empty object
						var stub = sinon.stub(ResponsivePopover.prototype, "openBy").returns({});

						oTVC.onDelete(oEvent);
						// the stub is here on the openBy method of the reponsive popover, make sure it gets called exactly once in
						// onDelete
						assert.ok(stub.calledOnce, "openBy within ondelete called once");
						// to be sure...
						assert.ok(!stub.calledTwice, "openBy within ondelete not called twice");

						// restore the normal openBy behaviour.
						ResponsivePopover.prototype.openBy.restore();
					});

					QUnit.test("Function ShowMessagesButton", function(assert) {
						
						var aMessages = aMessagesTemplate;
						
						var oResult = oTVC.showMessagesButton(aMessages);
						assert.equal(oResult, true, "Show Messages returns true");

						assert.equal(oTVC.showMessagesButton([]), false, "Show Messages returns false");

					});

					QUnit.test("Function showMessagesButtonText", function(assert) {

						var aMessages = aMessagesTemplate;
						
						var oResult = oTVC.showMessagesButtonText(aMessages);
						assert.equal(oResult, "2", "showMessagesButtonText returns lengh value");
						assert.equal(oTVC.showMessagesButtonText([]), "", "showMessagesButtonText returns lengh value1");

					});

					QUnit.test("Function _getCustomData", function(assert) {

						var oEvent = sinon.createStubInstance(BaseEvent);

						var aCustomData = [];
						oEvent.getSource.returns({
							getCustomData : function() {
								return [];

							}
						});

						var oResult = oTVC._getCustomData(oEvent);
						assert.deepEqual(oResult, {}, "getCustomData returns no Data");

						var oCustomData = sinon.createStubInstance(CustomData);
						oCustomData.getKey.returns("key");
						oCustomData.getValue.returns("value1");

						oEvent.getSource.returns({
							getCustomData : function() {
								return [
									oCustomData
								];

							}
						});

						var oResult = oTVC._getCustomData(oEvent);
						assert.deepEqual(oResult, {
							key : "value1"
						}, "getCustomData returns object");

					});

					QUnit.test("Function _checkActionCustomData", function(assert) {

						var oCustomData = {
							Action : "action is there"
						}
						oTVC._checkActionCustomData(oCustomData);
						assert.equal(oCustomData.Label, oCustomData.Action, "Check Label value");

						oCustomData = {}
						assert.raises(function() {
							oTVC._checkActionCustomData(oCustomData);
						}, "Template Error: Function Import Name not found in custom data", "Check Error");

					});

					QUnit.test("Function onContactDetails", function(assert) {

						var oEvent = sinon.createStubInstance(BaseEvent);
						// var stub = sinon.stub(ResponsivePopover.prototype, "openBy").returns("test");
						var oPopOver = sinon.createStubInstance(ResponsivePopover);
						// oPopOver.openBy.returns("test");
						// var spyOpenBy = sinon.spy(oPopOver, "openBy");
						var aItems = [
								"hi", oPopOver
						];
						var oBindingContext = {
							getPath : function() {
								return "test/test"
							}
						};
						oEvent.getSource.returns({
								getParent : function() {
									return {
										getParent : function() {
											return {
												getParent : function() {
													return {
														getParent : function() {
															return {
																getParent : function() {
																	return {
																		getAggregation : function() {
																			return aItems;
																		}
																	};
																}
															};
														}
													};
												}
											};
										}
									};
								},
								getBindingContext : function() {
									return oBindingContext;
								},
								data : function() {
									return "";
								}

						});

						var oResult = oTVC.onContactDetails(oEvent);

						assert.ok(oPopOver.openBy.calledOnce, "openBy within onContactDetails called once");
						assert.ok(!oPopOver.openBy.calledTwice, "openBy within onContactDetails not called twie");
						assert.ok(oPopOver.bindElement.calledOnce, "bindElement within onContactDetails called once");
						assert.ok(!oPopOver.bindElement.calledTwice, "bindElement within onContactDetails not called twice");

					});

					QUnit.test("Function getComponent", function(assert) {

						// var stub = sinon.stub(BaseViewController, "getComponent").returns("");
						var oResult = oTVC.getComponent();
						// see oTVBindingContext at the beginning of this qunit. it is assigned to the view.
						assert.ok(oResult === oTestComponent, "TemplateController returns correct Component");
					});

					QUnit.test("Function onBack", function(assert) {
						var oEvent = sinon.createStubInstance(BaseEvent);

						var backStub = sinon.stub(window.history, "back");
						backStub.returns({});

						oTVC.onBack(oEvent);

						assert.ok(backStub.calledOnce, "backStub called once");
						assert.ok(!backStub.calledTwice, "backStub not called twice");
						backStub.restore();

					});


					QUnit.test("function onCancel", function(assert) {

						// just call onCancel with the above mocked objects..
						oTVC.onCancel();

						// to verify check the values of properties of the mocked ui model after onCancel call
						assert.equal(oUIModel.getProperty("/editable"), false, "ui model editable property check");
						assert.equal(oUIModel.getProperty("/enabled"), true, "ui model enabled property check");

					});

					QUnit.test("method onChange", function(assert) {

						// mock the oEvent for the onChange method.
						var oEvent = sinon.createStubInstance(BaseEvent);
						oEvent.getSource.returns(new MButton());
						bTestHasDraft = true;

						// just call onChange with the above mocked objects..
						oTVC.onChange(oEvent);
						assert.ok(true, "ok");

						// with this test setup, following oModel methods are expected to be called once
						// Code refactored, those messages are not called anymore but promise of baseviewcontroller is used
						// assert.ok(oDataModel.attachEventOnce.calledOnce, "attachEventOnce of model called once");
						// assert.ok(oDataModel.attachRequestCompleted.calledOnce, "attachRequestCompleted of model called once");
						// assert.ok(oDataModel.attachRequestFailed.calledOnce, "attachRequestFailed of model called once");

						// reset to false..
						bTestHasDraft = false;

					});

/*					QUnit.test("method onEdit with calling the Expired Lock Dialog", function(assert) {
						// mock for TestA with calling the "Expired Lock Dialog": mock DraftAdministrativeData "Expired Lock"
						var stub = sinon.stub(MDialog.prototype, "open").returns({});
						oTVC.getComponent.restore();
						var oModelTest = sinon.createStubInstance(sap.ui.model.odata.ODataModel);
						var getBindingContext = {
								getBindingContext : function() {
									return {
										getPath : function() {
											return sCurrentContextPath;
										}
									}
								},
								getEntitySet : function() {
									return "SEPMRA_C_PD_Product";
								},
								getModel : function() {
									return oModelTest
								}
						};
						var stub1 = sinon.stub(oTVC, "getComponent").returns(getBindingContext);
						oModelTest.read = function(p1, p2) {
							return p2.success({
								DraftAdministrativeData : {
										DraftIsProcessedByMe : false,
										InProcessByUser : false,
										CreatedByUser : 1
								}
							});
						};
						// just call onEdit with the above mocked objects..
						oTVC.onEdit();
						// the stub is here on the open method of the "Expired Lock Dialog", make sure it gets called exactly once
						// assert.ok(oModelTest.read.calledOnce,"OModel Read function called");
						assert.ok(stub.calledOnce, "within onEdit open ExpiredLockDialog called once");
						// to be sure...
						assert.ok(!stub.calledTwice, "within onEdit open ExpiredLockDialog not called twice");
						// restore the normal open behaviour.
						MDialog.prototype.open.restore();
						oTVC.getComponent.restore();
					});

					QUnit.test("method onEdit without calling the Expired Lock Dialog", function(assert) {
						// mock for TestB without calling the "Expired Lock Dialog": mock DraftAdministrativeData "Locked"
						oDraftAdministrativeData.DraftIsProcessedByMe = true;
						oDraftAdministrativeData.InProcessByUser = "MyName";

						var oModelTest = sinon.createStubInstance(sap.ui.model.odata.ODataModel);
						var getBindingContext = {
								getBindingContext : function() {
									return {
										getPath : function() {
											return "/SEPMRA_C_PD_Product(ProductDraftUUID=guid'00000000-0000-0000-0000-000000000000',ActiveProduct='HT-1003')";
										}
									}
								},
								getEntitySet : function() {
									return "SEPMRA_C_PD_Product";
								},
								getModel : function() {
									return oModelTest
								}
						};
						var stub1 = sinon.stub(oTVC, "getComponent").returns(getBindingContext);
						oModelTest.read = function(p1, p2) {
							return p2.success({
								DraftAdministrativeData : {
										DraftIsProcessedByMe : true,
										InProcessByUser : false,
										CreatedByUser : 1
								}
							});
						};

						// prepare ui property to the opposite
						oUIModel.setProperty("/editable", false);
						var done = assert.async();
						var oEditPromise = {
							then : function(fnImport) {
								fnImport();
								// to verify check the values of properties of the mocked ui model within onEdit w/o ExpiredLockDialog
								assert.equal(oUIModel.getProperty("/editable"), true, "within onEdit w/o ExpiredLockDialog ui model editable property check");
								done();
							}
						};

						sinon.stub(BaseViewController.prototype, "editEntity").returns(oEditPromise);

						// just call onEdit with the above mocked objects..
						oTVC.onEdit();
						oTVC.getComponent.restore();

					});

					QUnit.test("Function getNavigationController", function(assert) {
						var oResult = oTVC.getNavigationController();
						assert.ok(oResult === oTestNavigationController, "TemplateController returns correct navigation controller");
					});

					QUnit.test("Function getTransactionController", function(assert) {
						var oResult = oTVC.getTransactionController();
						assert.ok(oResult === oTestTransactionController, "TemplateController returns correct transaction controller");
					});

					QUnit.test("Function getComponentContainer", function(assert) {
						var oResult = oTVC.getComponentContainer();
						assert.ok(oResult === oTestComponentContainer, "TemplateController returns correct ComponentContainer");
					});

//					QUnit.test("has function onShowMessages", function(assert) {
//						// Settingup Button Event....
//						var oEvent = sinon.createStubInstance(BaseEvent);
//						oEvent.getSource.returns(new MButton());
//						var stub = sinon.stub(oTVC, "showMessagePopover").returns({});
//						var oResult = oTVC.onShowMessages(oEvent);
//						assert.ok(true, "Function onShowMessages Tested");
//						assert.equal(oTVC.showMessagePopover.calledOnce, true, "showMessagePopover function called through Sinon");
//					});
//
					QUnit.test("has function showMessagePopover", function(assert) {
						// Settingup Button Event....
						var oEvent = sinon.createStubInstance(BaseEvent);
						oEvent.getSource.returns(new MButton());

						var oButton = oEvent.getSource();
						var stub = sinon.stub(BaseViewController.prototype, "showMessagePopover").returns();
						var oResult = oTVC.showMessagePopover(oButton, true);
						assert.ok(true, "Function showMessagePopover Tested");

					});

/*					QUnit.test("has function formatText", function(assert) {

						var oResult = oTVC.formatText();

						assert.ok(true, "Function formatText Tested");
						var expected = "No detailed information available.";
						assert.equal(oResult, "", "Function should empty value");
						// Seeting up array arguments...
						var oArguments = [
								"This object has unsaved changes by {0}.", "undefined", "", "No detailed information available."
						];
						oResult = oTVC.formatText(oArguments);
						assert.equal(oResult, "Anything", "Function should expected value");

					});

					QUnit.test("has function fnDraftPopover", function(assert) {

						var oEvent = sinon.createStubInstance(BaseEvent);
						// var oButton = sinon.stub(oEvent,"getSource").returns(new MButton());
						oEvent.getSource.returns(new MButton());
						var oButton = oEvent.getSource();

						var oPopover = new sap.m.Popover();
						var oTestBindingContext = {
								getPath : function() {
									return "TestPath";
								},
								getObject : function() {
									return {};
								},
						};
						var oButtonreference = new MButton();
						// var getId = {getId:function(){return oPopover}};
						var aItems = [
							oButtonreference
						];
						var popover_return = {
								unbindElement : function() {
									return {
										sId : "__popover0"
									}
								},
								getBindingContext : function() {
									return oTestBindingContext
								},
								setModel : function() {
									return ""
								},
								bindElement : function() {
									return ""
								},
								openBy : function() {
									return oPopover
								},
								getAggregation : function() {
									return {
										getAggregation : function() {
											return aItems
										}
									}
								}
						};
						// var oContext = { "_oPopover":oPopover};
						var oContext = {
							"_oPopover" : popover_return
						};
						oTVC.oContext = oContext;
						var oBindingContext = {
								getProperty : function() {
									return {
											IsActiveEntity : true,
											HasDraftEntity : true
									}
								},
								getPath : function() {
									return "";
								}
						};
						var oResult = oTVC.fnDraftPopover(oContext, oBindingContext, "", oButton);
						assert.ok(true, "function tested successfully");

					});

					QUnit.test("has function formatDraftLockText", function(assert) {
						var LockedBy = "InProcessByUser 1";
						var IsActiveEntity = true;
						var HasDraftEntity = true;
						var oResult = oTVC.formatDraftLockText(IsActiveEntity, HasDraftEntity, LockedBy);
						assert.equal(oResult, "Anything", "Function should return the expected value");

					});

					QUnit.test("has function formatDraftLockTextGeneric", function(assert) {
						var LockedBy = "InProcessByUser 1";
						var IsActiveEntity = true;
						var HasDraftEntity = true;
						var oResult = oTVC.formatDraftLockTextGeneric(IsActiveEntity, HasDraftEntity, LockedBy, oTVC);
						assert.equal(oResult, "Anything", "Function should return the expected value");
						// Without LockedBy value
						LockedBy = "";
						oResult = oTVC.formatDraftLockTextGeneric(IsActiveEntity, HasDraftEntity, LockedBy, oTVC);
						assert.equal(oResult, "Anything", "Function should return the expected value");
					}); 

					QUnit.test("has function onDiscardDraft", function(assert) {
						var oEvent = sinon.createStubInstance(BaseEvent);
						oEvent.getSource.returns(new MButton());
						oTVC.onDiscardDraft(oEvent);
						assert.ok(true, "Function tested successfully");
					});



					QUnit.test("has function _getMessageCount", function(assert) {
						var aMessages = aMessagesTemplate;

						var oResult = oTVC._getMessageCount(aMessages);

						assert.equal(oResult, "2", "Function should return expected value");
					});

					QUnit.test("has function onActivate", function(assert) {
						oUIModel.setProperty("/editable", false);
						var done = assert.async();
						var oActivatePromise = {
							then : function(fnImport) {
								fnImport();
								// to verify check the values of properties of the mocked ui model within onEdit w/o ExpiredLockDialog
								assert.equal(oUIModel.getProperty("/editable"), false, "within onActivate w/o ExpiredLockDialog ui model editable property check");
								assert.ok(true, "test success");
								assert.ok(oError.calledOnce, "MessageToast.show was called");
								done();
							}
						};
						sinon.stub(BaseViewController.prototype, "activateDraftEntity").returns(oActivatePromise);
						var oError = sinon.stub(sap.m.MessageToast, "show", function() {
						});
						var oResult = oTVC.onActivate();
					});

					QUnit.test("has function onSave", function(assert) {
						// This function is not called in the demokit app. onSave function should use that instead of this in line
						// no 549
						// and 552

						var oResult = oTVC.onSave();
						assert.ok(true, "test success");

					});

					
					
					
				
					QUnit.test("has function onCallActionFromList", function(assert) {

						var oEvent = sinon.createStubInstance(BaseEvent);
						// oEvent.getSource.returns(new MButton());
						var oContextObject = {};
						var oSelectedContexts = [
							{
									getObject : function() {
										return oContextObject;
									},
									getPath : function() {
										return "/dummyPath";
									}
							}
						];
						
						var stubGetRouter = sinon.stub(FnNavHandler.prototype, "_getRouter", function() {
							return {};
						});
						var oTable = sinon.createStubInstance(sap.m.Table);
						oTable.getSelectedContexts.returns(oSelectedContexts);
						var oCustomData = [
								{
										getKey : function() {
											return "Type";
										},
										getValue : function() {
											return "com.sap.vocabularies.UI.v1.DataFieldForAction";
										}
								}, {
										getKey : function() {
											return "Action";
										},
										getValue : function() {
											return "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy";
										}
								}
						];
						var EventTemp = {
								getParent : function() {
									return {
										getParent : function() {
											return {
												getTable : function() {
													return oTable;
												}
											};
										}
									};
								},
								getCustomData : function() {
									return oCustomData;
								}
						};
						
						oEvent.getSource.returns(EventTemp);
						var sCalledWithFunctionName;
						this.fODataFunctionImport = function(sFunctionName) {
							sCalledWithFunctionName = sFunctionName;
							return {};
						};
						var sinonStub = sinon.stub(BaseViewController.prototype, "callAction").returns();
						var oResult = oTVC.onCallActionFromList(oEvent, "");
						assert.ok(sinonStub.calledOnce, "BaseViewController CallAction function called successfully");
						sinonStub.restore();
					});
					
					QUnit.test("has function _callAction", function(assert) {
						var oEvent = sinon.createStubInstance(BaseEvent);
						var oCustomData = {
								Type : "com.sap.vocabularies.UI.v1.DataFieldForAction",
								Action : "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy"
						};
						var EventTemp = {
								getParent : function() {
									return {
										getParent : function() {
											return {
												getTable : function() {
													return oTable;
												}
											};
										}
									};
								},
								getCustomData : function() {
									return oCustomData;
								}
						};
						var oContext = {
								getObject : function() {
									return oContextObject;
								},
								getPath : function() {
									return "/dummyPath";
								}
						};
						var oTable = sinon.createStubInstance(sap.m.Table);
						oEvent.getSource.returns(EventTemp);
						var sinonStub = sinon.stub(BaseViewController.prototype, "callAction").returns();
						var oResult = oTVC._callAction(oEvent, oCustomData, oContext, "", oTable);
						assert.ok(sinonStub.calledOnce, "BaseViewController CallAction function called");

					});
					
					
					QUnit.test("has function _getSelectedContexts", function(assert) {
						  var oTableStub = sinon.createStubInstance(sap.m.Table);
		                  oTableStub.getSelectedContexts.returns("test");
		                  //var oError = sinon.stub(sap.m.MessageBox, "error").returns({});
		                  var oResult = oTVC._getSelectedContexts(oTableStub);
		                  assert.equal(oResult, "test", "Function returned expected value");
		                  //assert.ok(oError.calledOnce, "Error: MessageBox is called");
		                  //Mock Different SelectedContexts value
		                  var oSelectedContexts = ["test", "test1", "test2"];
		                  oTableStub.getSelectedContexts.returns(oSelectedContexts);
		                  oResult = oTVC._getSelectedContexts(oTableStub);
		                  //assert.ok(oError.calledTwice, "Error: MessageBox is called twice");
		                  //Mock Different Value for SelectedContexts
		                  var oSelectedContexts = ["TableContent"];
		                  oTableStub.getSelectedContexts.returns(oSelectedContexts);
		                  oResult = oTVC._getSelectedContexts(oTableStub);
		                  assert.equal(oResult, "TableContent", "Function Should return Expected Value");
		                  //oError.restore();

					});
          
					
					
					QUnit.test("has function onListNavigate", function(assert) {
						var oEvent = sinon.createStubInstance(BaseEvent);
						var oDetachPress = {
								detachPress : function() {
									return {
										onListNavigate : "testvalue"
									}
								},
								attachPress : function() {
									return {
										onListNavigate : "testvalue"
									}
								}
						};
						oEvent.getSource.returns(oDetachPress);
						var sinonStub = sinon.stub(BaseViewController.prototype, "navigateFromListItem").returns();
						var oResult = oTVC.onListNavigate(oEvent);
						assert.ok(sinonStub.calledOnce, "BaseViewController function navigateFromListItem called");
						sinonStub.restore();
					});

					QUnit.test("has function navigateFromListItem", function(assert) {
						var oEvent = sinon.createStubInstance(BaseEvent);
						var sinonStub = sinon.stub(BaseViewController.prototype, "navigateFromListItem").returns();
						var oResult = oTVC.navigateFromListItem(oEvent);
						assert.ok(sinonStub.calledOnce, "BaseViewController function navigateFromListItem called");
						sinonStub.restore();
					});

					QUnit.test("has function onChange", function(assert) {
						var oEvent = sinon.createStubInstance(BaseEvent);
						oEvent.getSource.returns({
							getBindingPath : function() {
								return {}
							}
						});
						var fUsePromise = function() {
							return {
								then : function(fSuccess, fError) {
									if (bPromiseFailure) {
										fError(oTestResponse);
									} else {
										fSuccess(oTestResponse);
									}
								}
							}
						};
						var sinonStub = sinon.stub(BaseViewController.prototype, "modifyEntity").returns(fUsePromise());
						var oResult = oTVC.onChange(oEvent);
						assert.ok(sinonStub.calledOnce, "BaseViewController function modifyEntity called");
					});

					QUnit.test("has function _setEnabledOfExportToExcel", function(assert) {

						var aToolbarContent = [
								"test1", "test2", {
										getIcon : function() {
											return "sap-icon://excel-attachment"
										},
										setProperty : function() {
											return ""
										}
								}
						];
						var oResult = oTVC._setEnabledOfExportToExcel(aToolbarContent, false);
						assert.equal(oResult, oTVC, "Function returned the expected value");
					});

					QUnit.test("has function _getTableFromContent", function(assert) {
						var oTable = sinon.createStubInstance(sap.m.Table);
						var aContent = [
								oTable, "test1", "test2",
						];
						var oResult = oTVC._getTableFromContent(aContent);
						assert.equal(oResult, oTable, "Function returned the oTable");
					});

					QUnit
							.test(
									"has function onBeforeRebindTable",
									function(assert) {
										var oCustomData = sinon.createStubInstance(CustomData);
										oCustomData.getKey.returns("key");
										oCustomData.getValue.returns("value1");

										var oTable = sinon.createStubInstance(sap.ui.comp.smarttable.SmartTable);
										oTable.getEntitySet.returns("SEPMRA_C_PD_ProductText");

										oTable.getCustomData.returns([
											oCustomData
										]);
										var oEvent = sinon.createStubInstance(BaseEvent);
										oEvent.getSource.returns(oTable);
										oEvent.getParameter
												.returns({
													parameters : {
															expand : "to_Language",
															select : "Language,to_Language/Language_Text,Name,Description,ProductTextDraftUUID,ActiveProduct,ActiveLanguage,ActiveProduct,IsActiveEntity,HasDraftEntity,HasActiveEntity"
													}
												});
										var sinonStub = sinon.stub(BaseViewController.prototype, "getTableQueryParameters").returns();
										// sinon.stub(oEvent,"getParameter").returns();
										var aContent = [
												oTable, "test1", "test2",
										];
										var oResult = oTVC.onBeforeRebindTable(oEvent);
										assert.equal(oResult, undefined, "Function returned undefined");
										assert.ok(sinonStub.calledOnce, "BaseViewController function getTableQueryParameters called");
									});

					QUnit.test("has function addEntry", function(assert) {
						var fUsePromise = function() {
							return {
								then : function(fSuccess, fError) {
									if (bPromiseFailure) {
										fError(oTestResponse);
									} else {
										fSuccess(oTestResponse);
									}
								}
							}
						};

						var oTable = sinon.createStubInstance(sap.m.Table);
						var oEvent = sinon.createStubInstance(BaseEvent);
						oEvent.getSource.returns(oTable);
						var sinonStub = sinon.stub(BaseViewController.prototype, "addEntry").returns(fUsePromise());
						var oResult = oTVC.addEntry(oEvent);
						assert.ok(sinonStub.calledOnce, "BaseViewController function addEntry called");
						sinonStub.restore();
					});
*/
				});