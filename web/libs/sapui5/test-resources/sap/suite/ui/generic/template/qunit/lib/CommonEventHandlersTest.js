/**
 * tests for the sap.suite.ui.generic.template.lib.CommonEventHandlers
 */

sap.ui
.require(
		["sap/ui/core/mvc/XMLView", "sap/ui/comp/smarttable/SmartTable", "sap/m/Table", "sap/m/MessageBox",
		 "sap/ui/base/Event", "sap/ui/generic/app/navigation/service/NavigationHandler",
		 "sap/ui/comp/smartfilterbar/SmartFilterBar", "sap/suite/ui/generic/template/lib/TemplateComponent",
		 "sap/ui/table/Table", "sap/ui/generic/app/AppComponent", "sap/ui/thirdparty/sinon",
		 "sap/ui/thirdparty/sinon-qunit", "sap/suite/ui/generic/template/lib/CommonUtils",
		 "sap/suite/ui/generic/template/lib/CommonEventHandlers", "sap/ui/core/CustomData", "sap/m/ListBase",
		 "sap/ui/model/Context", "sap/ui/model/odata/v2/ODataModel"],
		 function(XMLView, SmartTable, MTable, MessageBox, Event, NavigationHandler, SmartFilterBar, TemplateComponent,
				 UiTable, AppComp, Sinon, SinonQunit, CommonUtils, CommonEventHandlers, CustomData, ListBase, Context,
				 ODataModel) {
			"use strict";

			// sut
			var oCommonEventHandlers;
			// variables for spies
			var oNavigateFromListItemArguments;
			var bCRUDManagerCallActionCalled;
			var oNavigationHandlerNavigateArguments;
			var oNavigationHandlerMixAttributesArguments;
			var oGetManifestEntryArguments;
			var oCommonUtilsGetTextArguments;
			// configuration of stubs
			var oNavigationHandlerMixAttributesResult;
			var oOutbound; // outbound defined in manifest
			var sCrossNavigationOutbound; // Outbound defined in Manifest
			var aSelectedContexts = []; // selected context
			var oHeaderContextObject; // header context object for obejct page
			var draftCase = true;
			var userAction = true;
			//preperation for all tests the same
			
			var oSmartTable = sinon.createStubInstance(SmartTable);
			oSmartTable.getItems.returns([]);
			// the smart table will have a sap.m.Table, that is getTable returns a m.table
			// other options could be possible too
			var oMTable = sinon.createStubInstance(MTable);
			oSmartTable.getTable.returns(oMTable);
			
			var oMessageBoxStub; 
			
			module("lib.CommonEventHandlers", {
				setup: function() {
					jQuery.sap.require("sap/m/MessageBox");
					oMessageBoxStub = sinon.stub(sap.m.MessageBox, "error", function(){jQuery.sap.log.debug("sap.m.MessageBox.error called... (replaced for test with Sinon Stub)")});

					var oTemplateUtils = {
							oCommonUtils: {
								getText: function(sKey) {
									oCommonUtilsGetTextArguments = arguments;
								},
								getContentDensityClass: jQuery.noop,
								getSelectedContexts: function(oControl) {
									return aSelectedContexts;
								},
								getNavigationHandler: function() {
									return {
										navigate: function() {
											oNavigationHandlerNavigateArguments = arguments;
										},
										mixAttributesAndSelectionVariant: function() {
											oNavigationHandlerMixAttributesArguments = arguments;
											return oNavigationHandlerMixAttributesResult;
										}
									};
								},
								dataLossConfirmation: function(f){
									// in case the confirmation popup is clicked with OK
									if( userAction === true){
										f();
									}
									// in case of CANCEL -> do not execute the function
								},
								navigateFromListItem: function() {
									oNavigateFromListItemArguments = arguments;
								},
								isDraftEnabled: function(){
									return draftCase;
								},
								getParentTable : function(){
									return oSmartTable;
								},
								getTableBinding: jQuery.noop
							},
							oComponentUtils: {},
							oServices: {
								oNavigationController: {},
								oCRUDManager: {
									callAction: function() {
										bCRUDManagerCallActionCalled = true;

										return {
											then : jQuery.noop
//												function(fSuccess, fError) {
//												if (bPromiseFailure) {
//													fError();
//												} else {
//													fSuccess();
//												}
//											}
										}
									}
								}
							}
					};

					var oController = {
							getOwnerComponent: function() {
								return {
									getAppComponent: function() {
										return {
											getManifestEntry: function() {
												oGetManifestEntryArguments = arguments;
												var oOutbounds = {};
												oOutbounds[sCrossNavigationOutbound] = oOutbound;
												return {
													crossNavigation: {
														outbounds: oOutbounds
													}
												}
											}
										};
									}
								};
							},
							getView: function() {
								return {
									getBindingContext: function() {
										return {
											getObject: function() {
												return oHeaderContextObject;
											}
										};
									},
									getModel: function() {
										return {
											hasPendingChanges: function() {
												return true;
											}
										};
									}
								};
							}
					};

					oCommonEventHandlers = new CommonEventHandlers(oController, oTemplateUtils.oComponentUtils,
							oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);

				},
				teardown: function() {
					oMessageBoxStub.restore();
				}
			});

			QUnit.test("Dummy", function() {
				ok(true, "Test - Always Good!");
			});

			QUnit
			.test(
					"Function onCallActionFromList",
					function(assert) {

						var oEvent = sinon.createStubInstance(Event);

						var oCustomData = new CustomData();
						oCustomData.setKey("Type");

						oEvent.getSource.returns({
							getParent: function() {
								return {
									getParent: function() {
										return {
											getTable: jQuery.noop
										};
									}
								};
							},
							getCustomData: function() {
								return [oCustomData];
							}
						});

						var oSmartFilterBar = undefined; 

						oCustomData.setValue("com.sap.vocabularies.UI.v1.DataFieldForAction");
						// NO ITEM SELECTED: user selects no item in table --> currently not possible for actions, but might
						// be supported in the future for actions that don't have parameters at all
						bCRUDManagerCallActionCalled = false;
						oCommonEventHandlers.onCallActionFromList(oEvent);
						assert
						.strictEqual(bCRUDManagerCallActionCalled, false,
								"NO ITEM SELECTED: user selects no item in table --> not possible for actions; check that processing is not allowed");
						// ONE ITEM SELECTED: supported
						bCRUDManagerCallActionCalled = false;
						aSelectedContexts.push({});
						oCommonEventHandlers.onCallActionFromList(oEvent);
						assert.strictEqual(bCRUDManagerCallActionCalled, true,
								"ONE ITEM SELECTED: supported; check that processing is allowed");
						// MULTIPLE ITEMS SELECTED: function import actions on multiple instances --> currently not
						// supported
						bCRUDManagerCallActionCalled = false;
						aSelectedContexts.push({});
						oCommonEventHandlers.onCallActionFromList(oEvent);
						assert
						.strictEqual(
								bCRUDManagerCallActionCalled,
								true,
								"MULTIPLE ITEMS SELECTED: function import actions on multiple instances --> not supported; check that processing is not allowed");

						oCustomData.setValue("com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation");
						// NO ITEM SELECTED: user selects no item in table - not supported
						oNavigationHandlerNavigateArguments = undefined;
						aSelectedContexts = [];
						oCommonEventHandlers.onCallActionFromList(oEvent);

						assert.equal(oNavigationHandlerNavigateArguments, undefined,
								"NO ITEM SELECTED: user selects no item in table - not supported");
						// ONE ITEM SELECTED: supported
						oNavigationHandlerNavigateArguments = undefined;
						var oContext = new Context();
						oContext.oModel = new ODataModel("abc", {});
						oContext.sPath = "abc";
						aSelectedContexts.push(oContext);
						oCommonEventHandlers.onCallActionFromList(oEvent);
						assert.ok(oNavigationHandlerNavigateArguments,
								"ONE ITEM SELECTED: supported; check that processing is allowed");
						// MULTIPLE ITEMS SELECTED: navigation to multiple instances --> currently not supported
						oNavigationHandlerNavigateArguments = undefined;
						aSelectedContexts.push(oContext);
						oCommonEventHandlers.onCallActionFromList(oEvent);
						assert
						.equal(oNavigationHandlerNavigateArguments, undefined,
								"MULTIPLE ITEMS SELECTED: navigation to multiple instances --> not supported; check that processing is not allowed");

					});

			// chevron should also allow intent based navigation (intent to be defined in manifest)
			// preparation: use one event handler for one purpose (instead of onCallActionFromList for all actions, even
			// for the ShowDetailsAction)
			// however, context of the event differs between button and cehvron navigation -> introduce a new event
			// handler only for the button
			QUnit.test("onShowDetails, nothing selected -> no Navigation, error message", function(assert) {
				// configure stubs
				aSelectedContexts = [];
				// prepare input
				var oEventSource = {
						getParent: function() {
							return {
								getParent: function() {
									return {
										getTable: jQuery.noop
									};
								}
							};
						}
					};
				// initialize spies
				oNavigateFromListItemArguments = undefined;
				oCommonUtilsGetTextArguments = undefined;
				// execute
				oCommonEventHandlers.onShowDetails(oEventSource);
				// check
				assert.equal(oNavigateFromListItemArguments, undefined,
				"ShowDetails pressed, nothing selected -> navigate not called");
				assert.equal(oCommonUtilsGetTextArguments[0], "ST_GENERIC_NO_ITEM_SELECTED",
				"error message: No item selected");
			});

			QUnit.test("onShowDetails, 1 line selected -> Navigation to object page", function(assert) {
				// configure stubs
				aSelectedContexts = [{
					getPath: jQuery.noop
				}];
				// prepare input
				var oTable = {};
				var oEventSource = {
						getParent: function() {
									return {
										getParent: function() {
											return {
												getTable: function() {
													return oTable;
												}
											};
										}
									};
								}
							};
				// initialize spies
				oNavigateFromListItemArguments = undefined;
				// execute
				oCommonEventHandlers.onShowDetails(oEventSource);
				// check
				assert.equal(oNavigateFromListItemArguments.length, 2,
				"ShowDetails pressed, 1 line selected -> navigate called with two parameters");
				assert.equal(oNavigateFromListItemArguments[0], aSelectedContexts[0],
				"first parameter is the given context");
				assert.equal(oNavigateFromListItemArguments[1], oTable, "second parameter is the table");

			});

			QUnit.test("onShowDetails, multiple lines selected -> no Navigation, error message", function(assert) {
				// configure stubs
				aSelectedContexts = [{}, {}];
				// prepare input
				var oEventSource = {
						getParent: function() {
									return {
										getParent: function() {
											return {
												getTable: jQuery.noop
											};
										}
									};
								}
							};
				// initialize spies
				oNavigateFromListItemArguments = undefined;
				oCommonUtilsGetTextArguments = undefined;
				// execute
				oCommonEventHandlers.onShowDetails(oEventSource);
				// check
				assert.equal(oNavigateFromListItemArguments, undefined,
				"ShowDetails pressed, multiple lines selected -> navigate not called");
				assert.equal(oCommonUtilsGetTextArguments[0], "ST_GENERIC_MULTIPLE_ITEMS_SELECTED",
				"error message: Multiple items selected");
			});

			
			QUnit.test("onListNavigate (chevron) -> Navigation to object page", function(assert) {
				// configure stubs
				aSelectedContexts = [];
				// prepare input
				var oTable = {};
				var oContext = {};
				var oEventSource = {
						getParent: function() {
									return oTable;
								},
								getBindingContext: function() {
									return oContext;
								}
							};
				// initialize spies
				oNavigateFromListItemArguments = undefined;
				
			  //***** DRAFT CASE ******
				draftCase = true;
				
				oCommonEventHandlers.onListNavigate(oEventSource);
				// check
				assert.equal(oNavigateFromListItemArguments.length, 2,
				"onListNavigate (chevron) DRAFT -> navigate called with two parameters");
				assert.equal(oNavigateFromListItemArguments[0], oContext, "first parameter is the given context");
				assert.equal(oNavigateFromListItemArguments[1], oTable, "second parameter is the table");
				
				//***** NON - DRAFT CASE ******
				draftCase = false;
					
				//  OK Button 
				userAction = true;
				oNavigateFromListItemArguments = undefined;
				oCommonEventHandlers.onListNavigate(oEventSource);
				// check
				assert.equal(oNavigateFromListItemArguments.length, 2,
				"onListNavigate (chevron) NON-DRAFT + OK-> navigate called with two parameters");
				assert.equal(oNavigateFromListItemArguments[0], oContext, "first parameter is the given context");
				assert.equal(oNavigateFromListItemArguments[1], oTable, "second parameter is the table");
					
					
				//  CANCEL Button 
				/*
				userAction = false;
				oNavigateFromListItemArguments = undefined;
				oCommonEventHandlers.onListNavigate(oEventSource);
					
				// check
				assert.equal(oNavigateFromListItemArguments, undefined,
				"ShowDetails pressed, nothing selected NON-DRAFT + CANCEL -> navigate not called");
				*/
				
			});

			

			QUnit.test("onListNavigateIntent (generic checks)", function(assert) {
				// configure stubs
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				// prepare input
				var oEventSource = {
						getCustomData: function() {
							return [{
								getKey: function() {
									return "CrossNavigation";
								},
								getValue: function() {
									return sCrossNavigationOutbound;
								}
							}];
						},
						getBindingContext: function() {
							return {
								getObject: jQuery.noop
							};
						}
					};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oGetManifestEntryArguments = undefined;
				// execute
				oCommonEventHandlers.onListNavigateIntent(oEventSource);
				// check
				assert.equal(oNavigationHandlerNavigateArguments.length, 5,
				"onListNavigateIntent -> navigation handler called with five parameters");

				assert.equal(oGetManifestEntryArguments.length, 1, "Get Manifest Entry called with one parameter");
				assert.equal(oGetManifestEntryArguments[0], "sap.app", "to read the manifest entry for sap.app");

				assert.equal(oNavigationHandlerNavigateArguments[0], oOutbound.semanticObject,
				"First parameter: semantic object defined in manifest");
				assert.equal(oNavigationHandlerNavigateArguments[1], oOutbound.action,
				"Second parameter: Action defined in manifest");

				assert.equal(typeof oNavigationHandlerNavigateArguments[4], "function",
				"Fifth parameter: A function to handle errors");
				// oNavigationHandlerNavigateArguments[4] && oNavigationHandlerNavigateArguments[4](oError);
				// assert.equal(false, true, "tbd: check function to handle errors ");
			});

			QUnit.test("onListNavigateIntent (ListReport specific)", function(assert) {
				// configure stubs
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				oNavigationHandlerMixAttributesResult = {
						propertyName: "Value"
				};
				// prepare input
				var oContextObject = {
						lineAttribute: "lineXYZ"
				};
				var sTableVariantId = "TableVariantID_4711";
				var oEventSource = {
						getCustomData: function() {
								return [{
									getKey: function() {
										return "CrossNavigation";
									},
									getValue: function() {
										return sCrossNavigationOutbound;
									}
								}];
							},
							getBindingContext: function() {
								return {
									getObject: function() {
										return oContextObject;
									}
								};
							},
							getParent: function() {
								return {
									getParent: function() {
										return {
											getCurrentVariantId: function() {
												return sTableVariantId;
											}
										};
									}
								};
							}
						};
				var sSelectionVariant = "test";
				var oSmartFilterBar = {
						getDataSuiteFormat: function() {
							return sSelectionVariant;
						}
				};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oNavigationHandlerMixAttributesArguments = undefined;
				// execute
				oCommonEventHandlers.onListNavigateIntent(oEventSource, oSmartFilterBar);
				// check
				assert.equal(oNavigationHandlerMixAttributesArguments.length, 2, "MixAttributes called with 2 parameters");
				assert.equal(oNavigationHandlerMixAttributesArguments[0], oContextObject,
				"First parameter is the context object");
				assert.equal(oNavigationHandlerMixAttributesArguments[1], sSelectionVariant,
				"Second is the selection variant");

				assert.equal(oNavigationHandlerNavigateArguments[2], JSON.stringify(oNavigationHandlerMixAttributesResult),
				"Third parameter: Parameters for the target app - currently filled according to 'Gießkanne'");
				assert.equal(oNavigationHandlerNavigateArguments[3].selectionVariant, sSelectionVariant,
				"Forth parameter has a property selectionVariant containing the selection variant");
				assert.equal(oNavigationHandlerNavigateArguments[3].tableVariantID, sTableVariantId,
				"Forth parameter has a property tableVariantID containg the id of the table variant");
				assert.equal(oNavigationHandlerNavigateArguments[3].customData, undefined,
				"Forth parameter has no (or undefined) property customData"); // as of today - not clear if this might
			});

			QUnit.test("onListNavigateIntent (ObjectPage specific)", function(assert) {
				// configure stubs
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				oHeaderContextObject = {
						headerAttribute: "headerABC"
				};
				// prepare input
				var oContextObject = {
						lineAttribute: "lineXYZ"
				};
				// var sSelectionVariant = "test";
				var sTableVariantId = "TableVariantID_4711";
				var oEventSource = {
						getCustomData: function() {
							return [{
								getKey: function() {
									return "CrossNavigation";
								},
								getValue: function() {
									return sCrossNavigationOutbound;
								}
							}];
						},
						getBindingContext: function() {
							return {
								getObject: function() {
									return oContextObject;
								}
							};
						}
					};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				// execute
				oCommonEventHandlers.onListNavigateIntent(oEventSource);
				// check
				assert.equal(oNavigationHandlerNavigateArguments[2], JSON.stringify(jQuery.extend(oContextObject,
						oHeaderContextObject)),
						"Third parameter: Parameters for the target app - currently filled according to 'Gießkanne'");
				assert.deepEqual(oNavigationHandlerNavigateArguments[3], {}, "Forth parameter has to be an empty object");

			});
			
			
			QUnit.test("onShowDetailsIntent, nothing selected -> no Navigation, error message", function(assert) {
				// configure stubs
				aSelectedContexts = [];
				// prepare input
				var oEventSource = {
						getParent: function() {
								return {
									getParent: function() {
										return {
											getTable: jQuery.noop
										};
									}
								};
							}
						};
				// initialize spies
				oNavigateFromListItemArguments = undefined;
				oCommonUtilsGetTextArguments = undefined;
				// execute
				oCommonEventHandlers.onShowDetailsIntent(oEventSource);
				// check
				assert.equal(oNavigateFromListItemArguments, undefined,
				"ShowDetails pressed, nothing selected -> navigate not called");
				assert.equal(oCommonUtilsGetTextArguments[0], "ST_GENERIC_NO_ITEM_SELECTED",
				"error message: No item selected");
			});

			QUnit.test("onShowDetailsIntent (generic checks)", function(assert) {
				// configure stubs
				aSelectedContexts = [{
					getObject: jQuery.noop
				}];				
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				// prepare input
				var oEventSource = {
						getParent: function() {
								return {
									getParent: function() {
										return {
											getTable: jQuery.noop
										};
									}
								};
							},
							getCustomData: function() {
								return [{
									getKey: function() {
										return "CrossNavigation";
									},
									getValue: function() {
										return sCrossNavigationOutbound;
									}
								}];
							}
						};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oGetManifestEntryArguments = undefined;
				// execute
				oCommonEventHandlers.onShowDetailsIntent(oEventSource);
				// check
				assert.equal(oNavigationHandlerNavigateArguments.length, 5,
				"onListNavigateIntent -> navigation handler called with five parameters");

				assert.equal(oGetManifestEntryArguments.length, 1, "Get Manifest Entry called with one parameter");
				assert.equal(oGetManifestEntryArguments[0], "sap.app", "to read the manifest entry for sap.app");

				assert.equal(oNavigationHandlerNavigateArguments[0], oOutbound.semanticObject,
				"First parameter: semantic object defined in manifest");
				assert.equal(oNavigationHandlerNavigateArguments[1], oOutbound.action,
				"Second parameter: Action defined in manifest");

				assert.equal(typeof oNavigationHandlerNavigateArguments[4], "function",
				"Fifth parameter: A function to handle errors");
				// oNavigationHandlerNavigateArguments[4] && oNavigationHandlerNavigateArguments[4](oError);
				// assert.equal(false, true, "tbd: check function to handle errors ");
			});

			QUnit.test("onShowDetailsIntent (ListReport specific)", function(assert) {
				// configure stubs
				var oContextObject = {
						lineAttribute: "lineXYZ"
				};
				aSelectedContexts = [{
					getObject: function(){return oContextObject;}
				}];				
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				// prepare input
				var sTableVariantId = "TableVariantID_4711";
				var oEventSource = {
						getParent: function() {
								return {
									getParent: function() {
										return {
											getTable: jQuery.noop,
											getCurrentVariantId: function() {
												return sTableVariantId;
											}
										};
									}
								};
							},
							getCustomData: function() {
								return [{
									getKey: function() {
										return "CrossNavigation";
									},
									getValue: function() {
										return sCrossNavigationOutbound;
									}
								}];
							}
						};
				var sSelectionVariant = "test";
				var oSmartFilterBar = {
						getDataSuiteFormat: function() {
							return sSelectionVariant;
						}
				};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				oNavigationHandlerMixAttributesArguments = undefined;
				// execute
				oCommonEventHandlers.onShowDetailsIntent(oEventSource, oSmartFilterBar);
				// check
				assert.equal(oNavigationHandlerMixAttributesArguments.length, 2, "MixAttributes called with 2 parameters");
				assert.equal(oNavigationHandlerMixAttributesArguments[0], oContextObject,
				"First parameter is the context object");
				assert.equal(oNavigationHandlerMixAttributesArguments[1], sSelectionVariant,
				"Second is the selection variant");

				assert.equal(oNavigationHandlerNavigateArguments[2], JSON.stringify(oNavigationHandlerMixAttributesResult),
				"Third parameter: Parameters for the target app - currently filled according to 'Gießkanne'");
				assert.equal(oNavigationHandlerNavigateArguments[3].selectionVariant, sSelectionVariant,
				"Forth parameter has a property selectionVariant containing the selection variant");
				assert.equal(oNavigationHandlerNavigateArguments[3].tableVariantID, sTableVariantId,
				"Forth parameter has a property tableVariantID containg the id of the table variant");
				assert.equal(oNavigationHandlerNavigateArguments[3].customData, undefined,
				"Forth parameter has no (or undefined) property customData"); // as of today - not clear if this might
			});

			QUnit.test("onShowDetailsIntent (ObjectPage specific)", function(assert) {
				// configure stubs
				var oContextObject = {
						lineAttribute: "lineXYZ"
				};
				aSelectedContexts = [{
					getObject: function(){return oContextObject;}
				}];				
				oOutbound = {
						semanticObject: "Test Semantic Object",
						action: "Test Action"
				};
				sCrossNavigationOutbound = "Test Outbound";
				// prepare input
				var oEventSource = {
						getParent: function() {
									return {
										getParent: function() {
											return {
												getTable: jQuery.noop
											};
										}
									};
								},
								getCustomData: function() {
									return [{
										getKey: function() {
											return "CrossNavigation";
										},
										getValue: function() {
											return sCrossNavigationOutbound;
										}
									}];
								}
							};
				// initialize spies
				oNavigationHandlerNavigateArguments = undefined;
				// execute
				oCommonEventHandlers.onShowDetailsIntent(oEventSource);
				// check
				assert.equal(oNavigationHandlerNavigateArguments[2], JSON.stringify(jQuery.extend(oContextObject,
						oHeaderContextObject)),
						"Third parameter: Parameters for the target app - currently filled according to 'Gießkanne'");
				assert.deepEqual(oNavigationHandlerNavigateArguments[3], {}, "Forth parameter has to be an empty object");
			});

			QUnit.test("onShowDetailsIntent, multiple lines selected -> no Navigation, error message", function(assert) {
				// configure stubs
				aSelectedContexts = [{}, {}];
				// prepare input
				var oEventSource = {
						getParent: function() {
									return {
										getParent: function() {
											return {
												getTable: jQuery.noop
											};
										}
									};
								}
							};
				// initialize spies
				oNavigateFromListItemArguments = undefined;
				oCommonUtilsGetTextArguments = undefined;
				// execute
				oCommonEventHandlers.onShowDetailsIntent(oEventSource);
				// check
				assert.equal(oNavigateFromListItemArguments, undefined,
				"ShowDetails pressed, multiple lines selected -> navigate not called");
				assert.equal(oCommonUtilsGetTextArguments[0], "ST_GENERIC_MULTIPLE_ITEMS_SELECTED",
				"error message: Multiple items selected");
			});
			
		});
