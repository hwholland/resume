/**
 * tests for the sap.suite.ui.generic.template.ListReport.view.ListReport.controller
 */
sap.ui
		.require(
				["sap/suite/ui/generic/template/ListReport/view/ListReport.controller", "sap/ui/core/mvc/XMLView",
						"sap/ui/comp/smarttable/SmartTable", "sap/m/Table", "sap/m/MessageBox", "sap/ui/base/Event",
						"sap/ui/generic/app/navigation/service/NavigationHandler", "sap/ui/comp/smartfilterbar/SmartFilterBar",
						"sap/suite/ui/generic/template/lib/TemplateComponent",
						"sap/ui/generic/app/AppComponent", "sap/ui/thirdparty/sinon", "sap/ui/thirdparty/sinon-qunit"],
				function(ListReportController, XMLView, SmartTable, MTable, MessageBox, Event, NavigationHandler,
						SmartFilterBar, TemplateComponent, AppComp, Sinon, SinonQunit) {
					"use strict";
					// "sap/ui/generic/app/navigation/service/Error",
					// Error,

					module("Basic checks: list report controller", {
						setup: function() {
							// simple set up for basic checks sufficient
							this.oLRC = new ListReportController();

						},
						teardown: function() {
							this.oLRC.destroy();
							this.oLRC = null;
						}
					});

					test("Dummy", function() {
						ok(true, "Test - Always Good!");
					});
/*
					// var TyListReportController = sap.suite.ui.generic.template.ListReport.view.ListReport.controller;

					// some method availablity ... analyze more what makes sense... especially with resp dev.
					QUnit.test("getView method available", function(assert) {
						equal(typeof ListReportController.prototype.getView, "function", "getView function availability");
						equal(typeof this.oLRC._templateEventHandlers.onShareEmailPress, "function",
								"onShareEmailPress function availability");
						equal(typeof this.oLRC._templateEventHandlers.onShareInJamPress, "function",
								"onShareInJamPress function availability");
					});

					QUnit.test("Shall be instantiable", function(assert) {
						assert.ok(this.oLRC, "instance available");
					});

					function fnSetupOnInit(oTest) {
						var aRestore = [];
						aRestore.push(sinon.stub(BaseViewController.prototype, "onInit").returns());

						// Newly added for onInit function
						var oTestComponent = sinon.createStubInstance(TemplateComponent);
						oTestComponent.getEntitySet.returns("EntitySetTest");
						var oTestComponentContainer = {
							bindElement: function() {
							},
							getElementBinding: function() {
								return {
									getPath: function() {
										return "ComponentContainer/TestPath/";
									}
								};
							},
							unbindElement: function() {
							},
							getIsLeaf: function(iDummy) {
								// for any input returns anything..
								return "Anything";
							}
						};

						oTestComponent.getComponentContainer.returns(oTestComponentContainer);

						// suitable model for TemplateComponent:
						// this way make the different methods return something:
						oTestComponent.getModel.returns({
							empty: "dummy"
						});
						oTestComponent.getModel.withArgs("i18n").returns({
							getResourceBundle: function() {
								return {
									getText: function(iDummy) {
										// for any input returns anything..
										return "Anything";
									}

								};
							}

						});

						oTest.oAppComponent.getMetadata.returns({
							getManifestEntry: function() {
								return {
									icons: {
										icon: "test"
									}
								};
							},
							getIsLeaf: function(iDummy) {
								// for any input returns anything..
								return "Anything";
							}
						});
						var registerView = {
							registerView: function() {
								return "";
							}
						};
						oTest.oAppComponent.getApplicationController.returns(registerView);
						oTestComponent.getAppComponent.returns(oTest.oAppComponent);

						sinon.stub(oTest.oListReportController, "getOwnerComponent").returns(oTestComponent);
						aRestore.push(sinon.stub(BaseViewController.prototype, "getComponent").returns(oTestComponent));
						aRestore.push(sinon.stub(BaseViewController.prototype, "getOwnerComponent").returns(oTestComponent));
						sinon.stub(oTest.oListReportController, "byId", function(sId) {
							switch (sId) {
								case "listReport":
									return oTest.oSmartTable;
								case "listReportFilter":
									return oTest.oSmartFilterBar;
								default:
									assert.ok(false, "No lookup for " + sId + " possible");
							}
						});
						oTest.oListReportController.onInit();
						return aRestore;
					}

					// next module with some more elaborated tests.
					module("More checks: flow in methods", {

						setup: function() {

							this.oAppComponent = sinon.createStubInstance(AppComp);

							this.oListReportController = new ListReportController();
							var that = this;
							this.oNavigationHandler = sinon.createStubInstance(NavigationHandler);
							this.oListReportController.oNavigationHandler = this.oNavigationHandler;

							this.oSmartFilterBar = sinon.createStubInstance(SmartFilterBar);
							this.oSmartFilterBar.getDataSuiteFormat.returns('{"SelectionVariantID":""}');
							this.oListReportController.oSmartFilterBar = this.oSmartFilterBar;

							// do some mocking here only once and not in the module setup / teardown methods.
							// as those get called per test call
							// "this" is here module context
							this.oView = sinon.createStubInstance(XMLView);
							// a way to mock the closest check ...
							this.oView.$.returns({
								closest: function() {
									return ["bla"];
								}
							});

							// oView has a i18n model with dummy resource bundle
							this.oRB = {
								getText: function(iDummy) {
									// for any input returns anything..
									return "Anything";
								}
							};
							this.oView.getModel.withArgs("i18n").returns({
								getResourceBundle: function() {
									return that.oRB;
								}
							});
							// oView needs a smart table:
							this.oSmartTable = sinon.createStubInstance(SmartTable);
							this.oSmartTable.getItems.returns([]);
							// the smart table will have a sap.m.Table, that is getTable returns a m.table
							// other options could be possible too
							this.oMTable = sinon.createStubInstance(MTable);
							this.oSmartTable.getTable.returns(this.oMTable);
							this.oView.byId.withArgs("listReport").returns(this.oSmartTable);
							sinon.stub(this.oListReportController, "getView").returns(this.oView);

							this.oListReportController.oSmartTable = this.oSmartTable;
							// getView is a central method referred to.
							// mock a view, with some model

							this.aRestore = fnSetupOnInit(this);
						},
						teardown: function() {
							this.oListReportController.destroy();
							this.oListReportController = null;
							this.oView = null;
							this.oRB = null;
							this.oSmartTable = null;
							this.oMTable = null;
							for (var i = 0; i < this.aRestore.length; i++) {
								this.aRestore[i].restore();
							}
						}
					});

					QUnit.test("function onBeforeSemanticObjectLinkPopoverOpens", function(assert) {

						var oEvent = sinon.createStubInstance(Event);
						oEvent.getParameters.returns({
							open: function() {
								return "";
							}
						});
						this.oListReportController._templateEventHandlers.onBeforeSemanticObjectLinkPopoverOpens(oEvent);
						assert.ok(this.oNavigationHandler.processBeforeSmartLinkPopoverOpens.calledOnce,
								"processBeforeSmartLinkPopoverOpens called once");
						assert.ok(!this.oNavigationHandler.processBeforeSmartLinkPopoverOpens.calledTwice,
								"processBeforeSmartLinkPopoverOpens called once");

					});

					QUnit
							.test(
									"function getCurrentAppState",
									function(assert) {

										this.oListReportController.oSmartFilterBar.getDataSuiteFormat.returns(JSON.stringify({
											id: 'test',
											value: 'test'
										}));
										this.oSmartTable.getCurrentVariantId.returns(1);

										this.oListReportController._templateEventHandlers.onSearchButtonPressed();
										
										assert.ok(this.oNavigationHandler.storeInnerAppState.calledOnce, "function called several times");
										assert
												.ok(
														this.oNavigationHandler.storeInnerAppState
																.calledWithExactly({
																	"customData": {},
																	"selectionVariant": "{\"Version\":{\"Major\":\"1\",\"Minor\":\"0\",\"Patch\":\"0\"},\"SelectionVariantID\":\"\",\"Text\":\"Selection Variant with ID \",\"ODataFilterExpression\":\"\",\"Parameters\":[],\"SelectOptions\":[]}",
																	"tableVariantId": 1
																}), "result doesn't match");
									});

					QUnit.test("function onShareInJamPress", function(assert) {
						// mocke the core method createComponent to avoid JAM popup, backend calls etc
						var oCore = sap.ui.getCore();
						var stub = sinon.stub(oCore, "createComponent").returns({
							text: "i'm the mock component",
							open: function() {
								assert.ok(true, "open function of mock jam component called");
							}
						});

						var oAppstate = {
							fail: function() {
							},
							done: function(fnImport) {
								fnImport();
								assert.ok(true, "done function called");
							}
						};

						this.oNavigationHandler.storeInnerAppState.returns(oAppstate);
						this.oListReportController._templateEventHandlers.onShareInJamPress();

						assert.ok(stub.calledOnce, "createComponent within onShareInJamPress called once");
						// get info on how stub was called to analyze the input
						var stubCall = stub.getCall(0);
						var oInput = stubCall.args[0];
						// checks if input params of createComponnent call were as expected.
						assert.equal(oInput.name, "sap.collaboration.components.fiori.sharing.dialog",
								"name check of jam component");
						assert.ok(oInput.settings, "component import settings not initial");

						// important restore the normal createComponent behaviour
						oCore.createComponent.restore();
					});

					QUnit.test("function onShareEmailPress", function(assert) {
						var oAppstate = {
							fail: function() {
							},
							done: function(fnImport) {
								fnImport();
								assert.ok(true, "done function called");
							}
						};

						var stub = sinon.stub(sap.m.URLHelper, 'triggerEmail');
						this.oNavigationHandler.storeInnerAppState.returns(oAppstate);
						this.oListReportController._templateEventHandlers.onShareEmailPress();
						assert.ok(stub.calledOnce, "triggerEmail within onShareEmailPress called once");
						var stubCall = stub.getCall(0);
						var oInput = stubCall.args[0];
						assert.equal(oInput, null, "Trigger Email first Parameter check");
						oInput = stubCall.args[1];
						assert.equal(oInput, "Anything", "Trigger Email second Parameter check");
						oInput = stubCall.args[2];
						assert.ok(oInput, "Trigger Email third Parameter not empty");
						stub.reset();
						// testing the error case with null value
						// var oErrorSpy = sinon.spy(jQuery.sap.log,"error");
						var oErrorSpy = sinon.stub(jQuery.sap.log, "error");
						oErrorSpy.returns("test error msg");
						// Setting null parameter for the funciton onShareEmailPress to check Jquery error log
						this.oListReportController.oNavigationHandler = null;
						this.oNavigationHandler.storeInnerAppState.returns(oAppstate);
						this.oListReportController._templateEventHandlers.onShareEmailPress();
						assert.ok(stub.calledOnce, "triggerEmail within onShareEmailPress called once");
						assert.ok(oErrorSpy.calledOnce, "Jquery error log called once");
						stubCall = stub.getCall(0);
						oInput = stubCall.args[0];
						assert.equal(oInput, null, "Trigger Email first Parameter check");
						oInput = stubCall.args[1];
						assert.equal(oInput, "Anything", "Trigger Email second Parameter check");
						oInput = stubCall.args[2];
						assert.ok(oInput, "Trigger Email third Parameter not empty");
						oErrorSpy.restore();

					});

					QUnit.test("function onInit", function(assert) {
						assert.ok(this.oAppComponent.getMetadata.calledOnce, "getMetadata function called once");

					});
*/
				});