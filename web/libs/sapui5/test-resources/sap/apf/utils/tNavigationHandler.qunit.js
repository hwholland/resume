/*globals window, sinon*/
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.testhelper.ushellHelper");
jQuery.sap.require('sap.apf.utils.navigationHandler');
jQuery.sap.require('sap.apf.core.utils.filter');
jQuery.sap.require('sap.apf.utils.filter');
jQuery.sap.require('sap.ui.thirdparty.sinon');
(function() {
	'use strict';
	function commonSetup(context, navigationTargets, navigationTargetsAssignedToActiveStep, buildComplexCummulativeFilter) {
		context.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
		context.callCountCumulativeFilter = 0;
		context.xAppStateIdInUrlHash = "";
		var inject = {
			instances : {
				messageHandler : context.messageHandler,
				component : {},
				startFilterHandler : {
					getStartFilters : function() {
						return jQuery.Deferred().resolve();
					},
					serialize : function(isNavigation) {
						context.serializeStartFilterHandlerCalled = true;
						context.serializeStartFilterHandlerIsNavigation = isNavigation;
						return jQuery.Deferred().resolve({
							startFilters : 'Gamma'
						});
					},
					deserialize : function() {
						context.deserializeStartFilterHandlerCalled = true;
					}
				}
			},
			functions : {
				getAllParameterEntitySetKeyProperties : function(callback){
					callback(['pA']);
				},
				isFilterReductionActive : function() {
					return context.isFilterReductionActive;
				},
				getNavigationTargets : function() {
					return navigationTargets;
				},
				getActiveStep : function() {
					return {
						getAssignedNavigationTargets : function() {
							return navigationTargetsAssignedToActiveStep;
						}
					};
				},
				getCumulativeFilterUpToActiveStep : function() {
					var leftFilterPart, rightFilterPart;
					context.callCountCumulativeFilter++;

					if (buildComplexCummulativeFilter) {
						leftFilterPart = new sap.apf.core.utils.Filter(context.messageHandler).addOr('A', 'eq', '1').addOr('A', 'eq', '2').addOr('A', 'eq', '1');
						rightFilterPart = new sap.apf.core.utils.Filter(context.messageHandler).addOr('A', 'eq', '1').addOr('A', 'eq', '2').addOr('A', 'eq', '42');
						context.cumulativeFilter = new sap.apf.core.utils.Filter(context.messageHandler).addAnd(leftFilterPart).addAnd(rightFilterPart);
					} else {
						context.cumulativeFilter = new sap.apf.core.utils.Filter(context.messageHandler, "SAPClient", "EQ", "888");
						context.cumulativeFilter.addAnd(new sap.apf.core.utils.Filter(context.messageHandler, "Country", "EQ", "BRA"));
					}

					return jQuery.Deferred().resolve(context.cumulativeFilter);
				},
				serialize : function() {
					context.serializeCalled = true;
					return {
						path : 'Alpha'
					};
				},
				serializeFilterIds : function() {
					context.serializeFilterIdsCalled = true;
					return {
						filterId1 : 'PropertyBeta',
						filterId2 : 'PropertyEpsilon'
					};
				},
				isDirty : function() {
				    context.isDirtyCalled = true;
				    return true;
				},
				getPathName : function() {
				    context.getPathNameCalled = true;
				    return 'What a Path!';
				},
				deserialize : function() {
					context.deserializeCalled = true;
				},
				deserializeFilterIds : function() {
					context.deserializeFilterIdsCalled = true;
				},
                setDirtyState : function() {
                    context.setDirtyStateCalled = true;
                },
                setPathName : function() {
                    context.setPathNameCalled = true;
                },
				createRequest : function(sRequestConfigurationId) {
					context.createRequestCalled = true;
					context.sRequestConfigurationId = sRequestConfigurationId;
					return {
						sendGetInBatch : function(oFilter, fnCallback, oRequestOptions) {
							context.sendGetInBatchCalled = true;
							if (context.letMappingRequestFail) {
								fnCallback(new sap.apf.core.MessageObject({
									code : "5001"
								}));
								return;
							}
							var oResponse = {
								data : [ {
									targetProperty1 : "A",
									targetProperty2 : "B"
								}, {
									targetProperty1 : "C",
									targetProperty2 : "D"
								} ]
							};
							fnCallback(oResponse);
						}
					};
				},
				getXappStateId : function() {
					return context.xAppStateIdInUrlHash;
				}
			}
		};
		context.navigationHandler = new sap.apf.utils.NavigationHandler(inject);
	}
	QUnit.module("Navigation Handler Customizing", {
		beforeEach : function(assert) {
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				isStepSpecific : false
			}, {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial",
				isStepSpecific : true
			} ];
			var config = {
				functions : {
					getSemanticObjectLinkIntents : function(semanticObject) {
						if (semanticObject === "DaysSalesOutstanding") {
							return [ {
								intent : "DaysSalesOutstanding-analyzeDSO~fupps",
								text : "analyzeDSOTEXT"
							} ];
						} else if (semanticObject === "Materials") {
							return [ {
								intent : "Materials-analyzeMaterial?aParameter=2",
								text : "analyzeMaterialTEXT"
							}, {
								intent : "Materials-countMaterial~H",
								text : "countMaterialTEXT"
							} ];
						}
					}
				}
			};
			sap.apf.testhelper.ushellHelper.setup(config);
		},
		afterEach : function() {
			sap.apf.testhelper.ushellHelper.teardown();
		}
	});
	QUnit.test("WHEN getNavigationTargets without existing assignment of navigation targets to step", function(assert) {
		commonSetup(this, this.defaultTargets);
		var expectedNavigationTargets = {
			global : [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				text : "analyzeDSOTEXT"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				text : "analyzeMaterialTEXT"
			} ],
			stepSpecific : []
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN only global targets are returned. List of step specific targets is empty.");
		});
	});
	QUnit.test("WHEN getNavigationTargets with assignment of navigation targets to step", function(assert) {
		commonSetup(this, this.defaultTargets, [ {
			id : 'nav-MM2',
			type : 'navigationTarget'
		} ]);
		var expectedNavigationTargets = {
			global : [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				text : "analyzeDSOTEXT"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				text : "analyzeMaterialTEXT"
			} ],
			stepSpecific : [ {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial",
				text : "countMaterialTEXT"
			} ]
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN targets are returned in their respective category. Either global or step specific.");
		});
	});
	QUnit.module("Navigation Handler Customizing reading texts with missing intent", {
		beforeEach : function(assert) {
			var that = this;
			that.callCounterGetSemanticObjectLinks = 0;
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial",
				isStepSpecific : false
			}, {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial"
			} ];
			commonSetup(this, this.defaultTargets);
			var config = {
				functions : {
					getSemanticObjectLinkIntents : function(semanticObject) {
						if (semanticObject === "DaysSalesOutstanding") {
							that.callCounterGetSemanticObjectLinks++;
							return [ {
								intent : "DaysSalesOutstanding-analyzeDSO~fupps",
								text : "analyzeDSOTEXT"
							} ];
						} else if (semanticObject === "Materials") {
							return [ {
								intent : "Materials-analyzeMaterial?aParameter=2",
								text : "analyzeMaterialTEXT"
							} ];
						}
					}
				}
			};
			sap.apf.testhelper.ushellHelper.setup(config);
		},
		afterEach : function() {
			sap.apf.testhelper.ushellHelper.teardown();
		}
	});
	QUnit.test("WHEN getNavigationTargets is called", function(assert) {
		var that = this;
		var expectedNavigationTargets = {
			"global" : [ {
				"action" : "analyzeDSO",
				"id" : "nav-SD",
				"semanticObject" : "DaysSalesOutstanding",
				"text" : "analyzeDSOTEXT"
			}, {
				"action" : "analyzeMaterial",
				"id" : "nav-MM1",
				"semanticObject" : "Materials",
				"text" : "analyzeMaterialTEXT"
			} ],
			"stepSpecific" : []
		};
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN navigation targets with text expected");
		});
		this.navigationHandler.getNavigationTargets().done(function(navTargets) {
			assert.deepEqual(navTargets, expectedNavigationTargets, "THEN on SECOND CALL navigation targets with text expected");
			assert.equal(that.callCounterGetSemanticObjectLinks, 1, "THEN results are buffered");
		});
	});
	QUnit.module('Outbound navigation', {
		beforeEach : function(assert) {
			var that = this;
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial"
			}, {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial"
			} ];
			commonSetup(this, this.defaultTargets);
			sap.apf.testhelper.ushellHelper.setup();
			that.resultGetHash = "";
			this.hashChangerSave = sap.ui.core.routing.HashChanger;
			sap.ui.core.routing.HashChanger = {
				getInstance : function() {
					return {
						getHash : function() {
							return that.resultGetHash;
						},
						replaceHash : function() {
							that.replaceHashCalled = true;
							return;
						}
					};
				}
			};
		},
		afterEach : function() {
			sap.apf.testhelper.ushellHelper.teardown();
			sap.ui.core.routing.HashChanger = this.hashChangerSave;
		}
	});
	QUnit.test("WHEN navigateToApp is called", function(assert) {
		this.navigationHandler.navigateToApp('nav-SD');
		var expectedTarget = {
			"action" : "analyzeDSO",
			"semanticObject" : "DaysSalesOutstanding"
		};
		assert.deepEqual(sap.ushell.externalNavigationConfiguration.target, expectedTarget, "THEN navigation parameter target as expected");
		assert.equal(sap.ushell.externalNavigationConfiguration.appStateKey, "AppStateKey1972", "THEN appStateKey as expected");
		assert.ok(!this.createRequestCalled, "No request for filter mapping was created");
		assert.ok(!this.sendGetInBatchCalled, "No request for filter mapping was executed");
		var expectedCumulatedFilter = {
			aFilters : [ {
				sPath : "SAPClient",
				sOperator : "EQ",
				oValue1 : "888"
			}, {
				sPath : "Country",
				sOperator : "EQ",
				oValue1 : "BRA"
			} ],
			bAnd : true
		};
		assert.deepEqual(sap.apf.testhelper.ushellHelper.spys.setData.sapApfCumulativeFilter, expectedCumulatedFilter, "THEN the expected cumulated filter is passed to the navigation target");
	});
	QUnit.test("Navigate calls path serialization", function(assert) {
		this.navigationHandler.navigateToApp('nav-SD');
		assert.equal(this.serializeCalled, true, 'Navigation gets serialized path');
	});
	QUnit.test("Navigate calls filter ID handler serialization", function(assert) {
		this.navigationHandler.navigateToApp('nav-SD');
		assert.equal(this.serializeFilterIdsCalled, true, 'Navigation gets serialized filter ID property mapping');
	});
	QUnit.test("Navigate calls start filter handler serialization", function(assert) {
		this.navigationHandler.navigateToApp('nav-SD');
		assert.equal(this.serializeStartFilterHandlerCalled, true, 'Navigation gets serialized context');
	});
	QUnit.test("Navigate calls start filter handler serialization with indicator for navigation set to 'true'", function(assert) {
		this.navigationHandler.navigateToApp('nav-SD');
		assert.equal(this.serializeStartFilterHandlerIsNavigation, true, 'Serialization called correctly');
	});
	QUnit.test("Navigate calls getCumulativeFilterUpToActiveStep twice", function(assert) {
		this.navigationHandler.navigateToApp('nav-SD');
		assert.equal(this.callCountCumulativeFilter, 1, 'Navigation calls getCumulativeFilterUpToActiveStep()');
	});
	QUnit.test("Navigate retrieves current dirty state", function(assert) {
	    this.navigationHandler.navigateToApp('nav-SD');
	    assert.equal(this.isDirtyCalled, true, 'Navigation gets current dirty state');
	});
	QUnit.test("Navigate retrieves current path name", function(assert) {
	    this.navigationHandler.navigateToApp('nav-SD');
	    assert.equal(this.getPathNameCalled, true, 'Navigation gets current path name');
	});
	QUnit.test("Push APF state (path, filter ID property mapping and start filter handler) to app state", function(assert) {
		var sapApfCumulativeFilter;
		var expectedSapApfState = {
			path : 'Alpha',
			filterIdHandler : {
				filterId1 : 'PropertyBeta',
				filterId2 : 'PropertyEpsilon'
			},
			startFilterHandler : {
				startFilters : 'Gamma'
			},
			dirtyState : true,
			pathName : 'What a Path!'
		};
		this.navigationHandler.navigateToApp('nav-SD');
		assert.deepEqual(sap.apf.testhelper.ushellHelper.spys.setData.sapApfState, expectedSapApfState, 'Combined APF state was passed to app state');
		sapApfCumulativeFilter = sap.apf.utils.Filter.createFilterFromSapUi5FilterJSON(this.messageHandler, sap.apf.testhelper.ushellHelper.spys.setData.sapApfCumulativeFilter).getInternalFilter();
		assert.ok(this.cumulativeFilter.isEqual(sapApfCumulativeFilter), "Correct SAPUI5 cumulative filter passed to app state");
		assert.equal(sap.apf.testhelper.ushellHelper.spys.isSaved, true, 'App state saved');
	});
	QUnit.test("Check navigation mode: backward", function(assert) {
		assert.expect(6);
		this.resultGetHash = "gugge=musik&sap-xapp-state=ABc123456&james=last&sap-iapp-state=123456ABcd&hugo=steak";
		var result = this.navigationHandler.checkMode();
		result.done(function(mode) {
			assert.deepEqual(mode, {
				navigationMode : "backward"
			}, "Backward navigation detected");
			assert.ok(this.deserializeCalled, 'Path deserialization called in backward mode');
			assert.ok(this.deserializeFilterIdsCalled, 'Filter ID handler deserialization called in backward mode');
			assert.ok(this.deserializeStartFilterHandlerCalled, 'StartFilterHandler deserialization called in backward mode');
			assert.ok(this.setDirtyStateCalled, 'Path deserialization sets dirty state in backward mode');
			assert.ok(this.setPathNameCalled, 'Path deserialization sets path name in backward mode');
		}.bind(this));
	});
	QUnit.test("Check navigation mode: forward", function(assert) {
		assert.expect(1);
		this.resultGetHash = "gugge=musik&james=last&hugo=steak";
		var result = this.navigationHandler.checkMode();
		result.done(function(mode) {
			assert.deepEqual(mode, {
				navigationMode : "forward"
			}, "Forward navigation detected");
		});
	});
	QUnit.test("Check navigation mode: forward with xapp-state", function(assert) {
		assert.expect(1);
		this.xAppStateIdInUrlHash = '0123456789';
		var result = this.navigationHandler.checkMode();
		result.done(function(mode) {
			assert.deepEqual(mode, {
				navigationMode : "forward",
				sapApfCumulativeFilter : "UI5 filter expression"
			}, "Forward navigation with xapp state detected");
		});
	});
	QUnit.test("checkMode() removes sap-iapp-state in hash", function(assert) {
		this.navigationHandler.checkMode();
		assert.ok(this.replaceHashCalled, "sap-iapp-state successfully removed in hash");
	});
	QUnit.module("Navigation Handler - Navigation with filter mapping", {
		beforeEach : function(assert) {
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO",
				filterMapping : {
					requestForMappedFilter : "RequestForFilterMapping1",
					target : [ "targetProperty1", "targetProperty2" ]
				}
			} ];
			commonSetup(this, this.defaultTargets);
			sap.apf.testhelper.ushellHelper.setup();
		},
		afterEach : function() {
			sap.apf.testhelper.ushellHelper.teardown();
			sap.ui.core.routing.HashChanger = this.hashChangerSave;
		}
	});
	QUnit.test("WHEN navigateToApp is called and the request for filter mapping fails", function(assert) {
		this.letMappingRequestFail = true;
		this.navigationHandler.navigateToApp('nav-SD'); //CUT
		assert.ok(this.createRequestCalled, "THEN the request for filter mapping is created");
		assert.equal(this.sRequestConfigurationId, "RequestForFilterMapping1", 'THEN the request for filter mapping is created with the right configuration Id');
		assert.ok(this.sendGetInBatchCalled, "THEN the request for filter mapping is executed");
		assert.equal(this.messageHandler.spyResults.putMessage.getCode(), "5001", "THEN the error from the failed request for filter mapping is logged");
		assert.ok(!sap.apf.testhelper.ushellHelper.spys.setData && !sap.apf.testhelper.ushellHelper.spys.isSaved, "THEN the navigation is not further processed");
	});
	QUnit.test("WHEN navigateToApp is called and the request for filter mapping succeeds", function(assert) {
		var expectedCumulatedFilter = {
			aFilters : [ {
				sPath : "SAPClient",
				sOperator : "EQ",
				oValue1 : "888"
			}, {
				sPath : "Country",
				sOperator : "EQ",
				oValue1 : "BRA"
			}, {
				aFilters : [ {
					aFilters : [ {
						sPath : "targetProperty1",
						sOperator : "EQ",
						oValue1 : "A"
					}, {
						sPath : "targetProperty2",
						sOperator : "EQ",
						oValue1 : "B"
					} ],
					bAnd : true
				}, {
					aFilters : [ {
						sPath : "targetProperty1",
						sOperator : "EQ",
						oValue1 : "C"
					}, {
						sPath : "targetProperty2",
						sOperator : "EQ",
						oValue1 : "D"
					} ],
					bAnd : true
				} ],
				bAnd : false
			} ],
			bAnd : true
		};
		this.navigationHandler.navigateToApp('nav-SD'); //CUT
		assert.ok(this.createRequestCalled, "THEN the request for filter mapping is created");
		assert.equal(this.sRequestConfigurationId, "RequestForFilterMapping1", 'THEN the request for filter mapping is created with the right configuration Id');
		assert.ok(this.sendGetInBatchCalled, "THEN the request for filter mapping is executed");
		assert.ok(sap.apf.testhelper.ushellHelper.spys.setData && sap.apf.testhelper.ushellHelper.spys.isSaved, "THEN the navigation is further processed");
		assert.deepEqual(sap.apf.testhelper.ushellHelper.spys.setData.sapApfCumulativeFilter, expectedCumulatedFilter, "THEN the expected cumulated filter including the filter mapping is passed to the navigation target");
	});
	
	QUnit.module('Outbound navigation with AND without filter simplification', {
		beforeEach : function(assert) {
			var that = this;
			this.defaultTargets = [ {
				id : 'nav-SD',
				semanticObject : "DaysSalesOutstanding",
				action : "analyzeDSO"
			}, {
				id : 'nav-MM1',
				semanticObject : "Materials",
				action : "analyzeMaterial"
			}, {
				id : 'nav-MM2',
				semanticObject : "Materials",
				action : "countMaterial"
			} ];
			var buildComplexCummulativeFilter = true;
			commonSetup(this, this.defaultTargets, undefined, buildComplexCummulativeFilter);
			sap.apf.testhelper.ushellHelper.setup();
			that.resultGetHash = "";
			this.hashChangerSave = sap.ui.core.routing.HashChanger;
			sap.ui.core.routing.HashChanger = {
				getInstance : function() {
					return {
						getHash : function() {
							return that.resultGetHash;
						},
						replaceHash : function() {
							that.replaceHashCalled = true;
							return;
						}
					};
				}
			};
			sinon.stub(jQuery.sap, 'uid', function () {
				return 'someId';
			});
		},
		afterEach : function() {
			sap.apf.testhelper.ushellHelper.teardown();
			sap.ui.core.routing.HashChanger = this.hashChangerSave;
			jQuery.sap.uid.restore();
		}
	});
	QUnit.test("WHEN navigateToApp is called", function(assert) {

		this.isFilterReductionActive = false;
		this.navigationHandler.navigateToApp('nav-SD');

		var expectedCumulatedFilterWithoutFilterReduction = 
				{
				  bAnd: true,
				  aFilters: [
				    {
				      bAnd: false,
				      aFilters: [
				        {
				          sOperator: "EQ",
				          sPath: "A",
				          oValue1: "1"
				        },
				        {
				          sOperator: "EQ",
				          sPath: "A",
				          oValue1: "2"
				        },
				        {
				          sOperator: "EQ",
				          sPath: "A",
				          oValue1: "1"
				        }
				      ]
				    },
				    {
				      bAnd: false,
				      aFilters: [
				        {
				          sOperator: "EQ",
				          sPath: "A",
				          oValue1: "1"
				        },
				        {
				          sOperator: "EQ",
				          sPath: "A",
				          oValue1: "2"
				        },
				        {
				          sOperator: "EQ",
				          sPath: "A",
				          oValue1: "42"
				        }
				      ]
				    }
				  ]
		};
		var expectedSelectionVariant = 	
		{
		  "Parameters": [],
		  "SelectOptions": [
		    {
		      "PropertyName": "A",
		      "Ranges": [
		        {
		          "Low": "1",
		          "Option": "EQ",
		          "Sign": "I"
		        },
		        {
		          "Low": "2",
		          "Option": "EQ",
		          "Sign": "I"
		        }
		      ]
		    }
		  ],
		  "SelectionVariantID": "someId"
		};
		assert.deepEqual(sap.apf.testhelper.ushellHelper.spys.setData.sapApfCumulativeFilter, expectedCumulatedFilterWithoutFilterReduction, "THEN the expected cumulated filter is passed to the navigation target");
		assert.deepEqual(sap.apf.testhelper.ushellHelper.spys.setData.selectionVariant, expectedSelectionVariant, "THEN selectionVariant is passed to the navigation target");

		this.isFilterReductionActive = true;
		this.navigationHandler.navigateToApp('nav-SD');

		var expectedCumulatedFilterWithFilterReduction = 
		{
			  bAnd: false,
			  aFilters: [
			    {
			      sOperator: "EQ",
			      sPath: "A",
			      oValue1: "1"
			    },
			    {
			      sOperator: "EQ",
			      sPath: "A",
			      oValue1: "2"
			    }
			  ]
		};
		var expectedSelectionVariant = {
				SelectionVariantID: 'someId',
				Parameters: [],
				SelectOptions: [{
					PropertyName: 'A',
					Ranges: [{
						Low: '1',
						Sign: 'I',
						Option: 'EQ'
					},{
						Low: '2',
						Sign: 'I',
						Option: 'EQ'
					}]
				}]
		};
		assert.deepEqual(sap.apf.testhelper.ushellHelper.spys.setData.sapApfCumulativeFilter, expectedCumulatedFilterWithFilterReduction, "THEN the simplified / reduced expected cumulated filter is passed to the navigation target");
		assert.deepEqual(sap.apf.testhelper.ushellHelper.spys.setData.selectionVariant, expectedSelectionVariant, "THEN the simplified / reduced selectionVariant is passed to the navigation target");

	});
	QUnit.module("generateSelectionVariant", {
		beforeEach: function (){
			commonSetup(this, undefined, undefined, false);
			sinon.stub(jQuery.sap, 'uid', function () {
				return 'someId';
			});
		},
		afterEach: function () {
			jQuery.sap.uid.restore();
		}
	});
	QUnit.test("SelectionVariant if filterreduction is turned off", function (assert) {
		this.isFilterReductionActive = false;
		var filter = new sap.apf.core.utils.Filter(this.messageHandler, 'A', 'le', '5');
		filter.addAnd(new sap.apf.core.utils.Filter(this.messageHandler, 'A', 'eq', '1'));
		
		var expect = {
				SelectionVariantID: 'someId',
				Parameters: [],
				SelectOptions: [{
					PropertyName: 'A',
					Ranges: [{
						Low: '1',
						Option: 'EQ',
						Sign: 'I'
					}]
				}]
		};
		var promise = this.navigationHandler.generateSelectionVariant(filter);
		promise.done(function(selectionVariant){
			assert.deepEqual(selectionVariant, expect, 'selectionVariant with simplified filter returned');
		});
	});
	QUnit.test("SelectionVariant if filterreduction is turned on", function (assert) {
		this.isFilterReductionActive = true;
		var filter = new sap.apf.core.utils.Filter(this.messageHandler, 'A', 'eq', '1');
		var expect = {
				SelectionVariantID: 'someId',
				Parameters: [],
				SelectOptions: [{
					PropertyName: 'A',
					Ranges: [{
						Low: '1',
						Option: 'EQ',
						Sign: 'I'
					}]
				}]
		};
		var promise = this.navigationHandler.generateSelectionVariant(filter);
		promise.done(function(selectionVariant){
			assert.deepEqual(selectionVariant, expect, 'selectionVariant returned');
		});
	});
	QUnit.test("SelectionVariant if filterreduction is turned on and empty filter is given", function (assert) {
		this.isFilterReductionActive = true;
		var filter = new sap.apf.core.utils.Filter(this.messageHandler);
		var expect = {
				SelectionVariantID: 'someId'
		};
		var promise = this.navigationHandler.generateSelectionVariant(filter);
		promise.done(function(selectionVariant){
			assert.deepEqual(selectionVariant, expect, 'selectionVariant with empty selectOptions is returned');
		});
	});
	QUnit.test("SelectionVariant if filterreduction is turned off and not well-formed filter is given", function (assert) {
		this.isFilterReductionActive = false;
		var filter = new sap.apf.core.utils.Filter(this.messageHandler);
		var leftFilter = new sap.apf.core.utils.Filter(this.messageHandler).addAnd("A", "LE", 1);
		var rightFilter = new sap.apf.core.utils.Filter(this.messageHandler).addOr("A", "EQ", 2).addOr("A","EQ",3);
		filter.addAnd(leftFilter).addAnd(rightFilter);
		var expect = {
			"SelectionVariantID": "someId",
			"Text": "Filter could not be converted to a selectionVariant"
		};
		var promise = this.navigationHandler.generateSelectionVariant(filter);
		promise.done(function(selectionVariant){
			assert.deepEqual(selectionVariant, expect, 'selectionVariant with empty selectOptions is returned');
		});
	});
})();