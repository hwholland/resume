jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require('sap.apf.modeler.ui.utils.APFRouter');
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require('sap.apf.modeler.ui.utils.navigationHandler');
jQuery.sap.require('sap.apf.modeler.ui.utils.helper');
jQuery.sap.require('sap.apf.modeler.ui.utils.APFTree');
(function() {
	'use strict';
	var oConfigurationListView, oModelerInstance, memorizeConfigurationStub, restoreMemorizedConfigurationStub, saveConfigEditorStub, memorizedEditor, spyOnShowOfMsgToast, resetConfigurationSpy;
	function _doNothing() {
	}
	function _instantiateView(oConfigurationListController) {
		var oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.configurationList",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oConfigurationListController
		});
		return oView;
	}
	function _placeViewAt(oConfigurationListView) {
		var divToPlaceConfigList = document.createElement("configList");
		divToPlaceConfigList.setAttribute('id', 'configListView');
		document.body.appendChild(divToPlaceConfigList);
		oConfigurationListView.placeAt("configListView");
		sap.ui.getCore().applyChanges();
	}
	function _updateConfigList() {
		oConfigurationListView.getController().createConfigList();
		oConfigurationListView.getController().updateConfigListView();
		oConfigurationListView.getController().updateTree();
	}
	function _setupForSwitchFromNewConfig(assert) {
		//arrangement
		var done = assert.async();
		var oSubView, oParams;
		var oNewConfigurationObj = {
			AnalyticalConfigurationName : "test config D"
		};
		var newConfigId = oConfigurationListView.getController().configurationHandler.setConfiguration(oNewConfigurationObj);
		oConfigurationListView.getController().configurationHandler.loadConfiguration(newConfigId, function(configurationEditor) {
			oConfigurationListView.getController().configEditor = configurationEditor;
			oConfigurationListView.getController().configId = newConfigId;
			_updateConfigList();
			saveConfigEditorStub = sinon.stub(configurationEditor, "save", _saveFn);
			oParams = {
				name : "configuration",
				arguments : {
					appId : oConfigurationListView.getController().oModel.getData().aConfigDetails[3].Application,
					configId : oConfigurationListView.getController().oModel.getData().aConfigDetails[3].AnalyticalConfiguration
				}
			};
			oConfigurationListView.getController().updateSubView(oParams);
			oConfigurationListView.getController().oTreeInstance.setSelection(oConfigurationListView.getController().oTreeInstance.getNodes()[3]);
			//action
			oSubView = oConfigurationListView.getController()._getSubView();
			oSubView.byId("idConfigTitle").setValue("");
			oConfigurationListView.getController().oTreeInstance.setSelection(oConfigurationListView.getController().oTreeInstance.getNodes()[1]);
			//assert
			assert.strictEqual(oConfigurationListView.getController().configurationHandler.getList().length, 4, "then the new configuration is created and 4 configurations exist");
			assert.strictEqual(memorizeConfigurationStub.calledOnce, true, "configuration editor is memorized while a selection is made");
			assert.notEqual(sap.ui.getCore().byId("idMandatoryValidationDialogFragement--idMandatoryValidationDialog"), undefined, "then mandatory popup dialog is available");
			done();
		});
	}
	function _setupForSavedConfig() {
		//arrangement
		var oParams;
		oConfigurationListView.getController().configEditor = oModelerInstance.configurationEditorForSavedConfig;
		oConfigurationListView.getController().configId = oModelerInstance.configIdSaved;
		saveConfigEditorStub = sinon.stub(oModelerInstance.configurationEditorForSavedConfig, "save", _saveFn);
		oModelerInstance.configurationEditorForSavedConfig.setCategory({
			labelKey : "test category C"
		});
		_updateConfigList();
		oParams = {
			name : "configuration",
			arguments : {
				appId : oConfigurationListView.getController().oModel.getData().aConfigDetails[1].Application,
				configId : oConfigurationListView.getController().oModel.getData().aConfigDetails[1].AnalyticalConfiguration
			}
		};
		oConfigurationListView.getController().updateSubView(oParams);
		oConfigurationListView.getController().oTreeInstance.setSelection(oConfigurationListView.getController().oTreeInstance.getNodes()[1]);
	}
	function _setupForSwitchFromNonNewConfig(assert) {
		var oSubView;
		_setupForSavedConfig();
		//action
		oSubView = oConfigurationListView.getController()._getSubView();
		oSubView.byId("idConfigTitle").setValue("");
		oModelerInstance.configurationEditorForSavedConfig.setIsUnsaved();
		oConfigurationListView.getController().oTreeInstance.setSelection(oConfigurationListView.getController().oTreeInstance.getNodes()[2]);
		//assert
		assert.strictEqual(memorizeConfigurationStub.calledOnce, true, "configuration editor is memorized while a selection is made");
		assert.notEqual(sap.ui.getCore().byId("idMandatoryValidationDialogFragement--idMandatoryValidationDialog"), undefined, "then mandatory popup dialog is available");
	}
	function _setupForSwitchInsideSameConfig(assert) {
		var oSubView;
		_setupForSavedConfig();
		//action
		oSubView = oConfigurationListView.getController()._getSubView();
		oSubView.byId("idConfigTitle").setValue("");
		oModelerInstance.configurationEditorForSavedConfig.setIsUnsaved();
		oConfigurationListView.getController().oTreeInstance.setSelection(oConfigurationListView.getController().oTreeInstance.getNodes()[1].getNodes()[1].getNodes()[0]);
		//assert
		assert.strictEqual(memorizeConfigurationStub.calledOnce, true, "configuration editor is memorized while a selection is made");
		assert.notEqual(sap.ui.getCore().byId("idMandatoryValidationDialogFragement--idMandatoryValidationDialog"), undefined, "then mandatory popup dialog is available");
	}
	function _oGetRouterStub() {
		return {
			navTo : _doNothing,
			attachRoutePatternMatched : _doNothing
		};
	}
	function _memorizeConfigurationFn() {
		memorizedEditor = jQuery.extend(true, {}, oConfigurationListView.getController().configEditor);
	}
	function _restoreMemorizedConfigurationFn() {
		return memorizedEditor;
	}
	function _saveFn(callback) {
		var id = "TestConfigId";
		callback(id, {}, undefined);
	}
	function _pressButtonOnMandatoryPopup(assert, buttonNumber, continuation) {
		var done = assert.async();
		var mandatoryPopupDialog = sap.ui.getCore().byId("idMandatoryValidationDialogFragement--idMandatoryValidationDialog");
		// ensure the async callback afterClose has successfully completed.
		mandatoryPopupDialog.attachAfterClose(function() {
			assert.strictEqual(sap.ui.getCore().byId("idMandatoryValidationDialogFragement--idMandatoryValidationDialog"), undefined, "then mandatory popup dialog is destroyed");
			continuation();
			done();
		});
		mandatoryPopupDialog.getButtons()[buttonNumber].firePress();
		sap.ui.getCore().applyChanges();
	}
	function _pressButtonOnLossOfDataPopup(assert, buttonNumber, continuation) {
		var done = assert.async();
		var lossOfDataDialog = sap.ui.getCore().byId("idMessageDialogFragment--idMessageDialog");
		// ensure the async callback afterClose has successfully completed.
		lossOfDataDialog.attachAfterClose(function() {
			assert.strictEqual(sap.ui.getCore().byId("idMessageDialogFragment--idMessageDialog"), undefined, "then loss of data popup dialog is destroyed");
			continuation();
			done();
		});
		lossOfDataDialog.getButtons()[buttonNumber].firePress();
		sap.ui.getCore().applyChanges();
	}
	QUnit.module("Configuration List Unit Tests", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance;//Modeler instance from callback
				that.oCoreApi = that.oModelerInstance.modelerCore;
				sap.apf.modeler.ui.utils.APFRouter = {
					patternMatch : function() {
						return that;
					}
				};
				that.oGetOwnerComponentStub = {
					oCoreApi : that.oModelerInstance.modelerCore
				};
				that.oGetRouterStub = function() {
					var obj = {};
					obj.navTo = function() {
						return that;
					};
					return obj;
				};
				sap.ui.core.UIComponent.extend("sap.apf.modeler.Component", {});
				sinon.stub(sap.ui.core.UIComponent, "getRouterFor", that.oGetRouterStub);
				var getAllAvailableSemanticObjectsStub = function(callBackFn) {
					var aSemanticObjects = [ {
						id : "FioriApplication"
					}, {
						id : "APFI2ANav"
					} ];
					var messageObject;
					callBackFn(aSemanticObjects, messageObject);
				};
				var oSemanticActionsForFioriApplication = {
					semanticActions : [ {
						id : "executeAPFConfiguration",
						text : "Execute APF Configuration"
					}, {
						id : "analyzeKPIDetails",
						text : "Analyze KPI Details"
					} ]
				};
				var oSemanticActionsForUserInputSemanticObject = {
					semanticActions : []
				};
				var getSemanticActionsStub = new sinon.stub();
				var oDeferredFirstCall = new jQuery.Deferred();
				oDeferredFirstCall.resolve(oSemanticActionsForFioriApplication);
				var oDeferredSecondCall = new jQuery.Deferred();
				oDeferredSecondCall.resolve(oSemanticActionsForUserInputSemanticObject);
				getSemanticActionsStub.withArgs("FioriApplication").returns(oDeferredFirstCall.promise());
				getSemanticActionsStub.withArgs("UserInputSemanticObject").returns(oDeferredSecondCall.promise());
				sinon.stub(that.oModelerInstance.modelerCore, "getAllAvailableSemanticObjects", getAllAvailableSemanticObjectsStub);
				sinon.stub(that.oModelerInstance.modelerCore, "getSemanticActions", getSemanticActionsStub);
				that.oByIdStub = function(param) {
					if (param === "configPage") {
						return new sap.m.Page();
					} else if (param === "idSavebutton" || param === "idCancelbutton" || param === "idExportbutton" || param === "idExecuteButton") {
						return new sap.m.Button();
					} else if (param === "idConfigMasterData" || param === "idConfigDetail") {
						return new sap.m.VBox({
							items : [ new sap.apf.modeler.ui.utils.APFTree() ]
						});
					} else if (param === "idConfigTree") {
						var oTreeNodeTemplate = new sap.ui.commons.TreeNode({});
						oTreeNodeTemplate.bindProperty("text", "name");
						oTreeNodeTemplate.bindProperty("icon", "icon");
						oTreeNodeTemplate.bindProperty("expanded", "expanded");
						oTreeNodeTemplate.bindProperty("selectable", "selectable");
						oTreeNodeTemplate.bindProperty("isSelected", "isSelected");
						oTreeNodeTemplate.bindProperty("hasExpander", "hasExpander");
						var oModel = that.oModel = new sap.ui.model.json.JSONModel({
							aConfigDetails : [ {
								AnalyticalConfiguration : "configId",
								Application : "appId",
								bIsLoaded : true,
								bToggleState : false,
								expanded : false,
								hasExpander : true,
								isSelected : false,
								name : "Test Configuration 1",
								selectable : true,
								type : "configuration",
								configData : [ {
									expanded : false,
									selectable : false,
									name : "Facet Filters",
									filters : [ {
										expanded : false,
										id : "facetFilterId",
										isSelected : false,
										name : "From Date",
										selectable : true,
										type : "facetFilter"
									} ]
								}, {
									expanded : false,
									selectable : false,
									name : "Categories",
									categories : [ {
										expanded : false,
										id : "Category-1",
										isSelected : false,
										name : "Time",
										selectable : true,
										type : "category",
										steps : [ {
											expanded : false,
											id : "Step-1",
											isSelected : false,
											name : "Revenue Over Time",
											selectable : true,
											type : "step",
											representations : [ {
												expanded : false,
												icon : "sap-icon://bar-chart",
												id : "Step-1-Representation-1",
												isSelected : false,
												name : "Column Chart",
												selectable : true,
												type : "representation"
											} ]
										} ]
									}, {
										expanded : false,
										id : "Category-2",
										isSelected : false,
										name : "Revenue",
										selectable : true,
										type : "category",
										steps : []
									}, {
										expanded : false,
										id : "Category-3",
										isSelected : false,
										name : "Customer Country",
										selectable : true,
										type : "category",
										steps : [ {
											expanded : false,
											id : "Step-1",
											isSelected : false,
											name : "Revenue Over Time",
											selectable : true,
											type : "step",
											representations : []
										} ]
									} ]
								}, {
									expanded : false,
									selectable : false,
									name : "navTargets",
									navTargets : [ {
										expanded : false,
										id : "NavigationTarget-1",
										isSelected : false,
										name : "Execute APF Configuration",
										selectable : true,
										type : "navigationTarget"
									}, {
										expanded : false,
										id : "NavigationTarget-2",
										isSelected : false,
										name : "UserInputSemanticObject",
										selectable : true,
										type : "navigationTarget"
									} ]
								} ]
							}, {
								AnalyticalConfiguration : "configId1",
								Application : "appId",
								isSelected : false,
								bIsLoaded : false,
								bToggleState : false,
								expanded : false,
								hasExpander : true,
								selected : true,
								name : "New Configuration",
								selectable : true,
								type : "configuration",
								configData : []
							} ]
						});
						return new sap.apf.modeler.ui.utils.APFTree().bindAggregation("nodes", "/aConfigDetails", oTreeNodeTemplate).setModel(oModel);
					} else if (param === "idConfigTitleMaster") {
						return new sap.m.Label();
					} else if (param === "idConfigDetailData") {
						var oModelerInstance = that.oModelerInstance;
						return new sap.ui.layout.Grid({
							content : [ sap.ui.view({
								viewName : "sap.apf.modeler.ui.view.configuration",
								type : "XML",
								viewData : {
									updateConfigTree : oModelerInstance.updateConfigTree,
									updateSelectedNode : oModelerInstance.updateSelectedNode,
									updateTree : oModelerInstance.updateTree,
									updateTitleAndBreadCrumb : oModelerInstance.updateTitleAndBreadCrumb,
									oConfigurationHandler : oModelerInstance.configurationHandler,
									oApplicationHandler : oModelerInstance.applicationHandler,
									oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
									getText : oModelerInstance.modelerCore.getText,
									oParams : {
										name : "configuration",
										arguments : {
											appId : oModelerInstance.applicationCreatedForTest,
											configId : oModelerInstance.tempUnsavedConfigId
										}
									}
								}
							}) ]
						});
					} else if (param === "idFooterBarMain") {
						return new sap.m.Bar();
					}
				};
				that.oGetViewStub = function() {
					var obj = {};
					obj.setModel = function() {
						return null;
					};
					obj.addStyleClass = function() {
						return null;
					};
					obj.addDependent = function() {
						return null;
					};
					return obj;
				};
				that.oGetRepresentationTypesStub = function() {
					return [ {
						constructor : "sap.apf.ui.representations.columnChart",
						id : "ColumnChart",
						label : {
							key : "ColumnChart",
							kind : "text",
							type : "label"
						},
						metadata : {
							dimensions : {
								supportedKinds : [ {
									kind : "xAxis",
									max : "*",
									min : "1"
								}, {
									kind : "legend",
									max : "*",
									min : "0"
								} ]
							},
							measures : {
								supportedKinds : [ {
									kind : "yAxis",
									max : "*",
									min : "1"
								} ]
							},
							picture : "sap-icon://bar-chart",
							type : "representationType"
						}
					} ];
				};
				var oConfigNode = [ {
					id : "configId",
					name : "Test Configuration 1",
					oParams : {
						arguments : {
							configId : "configId"
						}
					}
				} ];
				that.oConfigNode = oConfigNode;
				var oFacetFilterNode = [ {
					id : "configId",
					name : "Test Configuration 1",
					oParams : {
						arguments : {
							configId : "configId"
						}
					}
				}, {
					id : "facetFilterId",
					name : "From Date",
					oParams : {
						arguments : {
							configId : "configId",
							facetFilterId : "facetFilterId"
						}
					}
				} ];
				that.oFacetFilterNode = oFacetFilterNode;
				var oSmartFilterNode = [ {
					id : "configId",
					name : "Test Configuration 1",
					oParams : {
						arguments : {
							configId : "configId"
						}
					}
				}, {
					id : "smartFilterBarId",
					name : "Smart Filter",
					oParams : {
						arguments : {
							configId : "configId",
							facetFilterId : "smartFilterId"
						}
					}
				} ];
				that.oSmartFilterNode = oSmartFilterNode;
				var oCategoryNode = [ {
					id : "configId",
					name : "Test Configuration 1",
					oParams : {
						arguments : {
							configId : "configId"
						}
					}
				}, {
					id : "Category-2",
					name : "Revenue",
					oParams : {
						arguments : {
							configId : "configId",
							categoryId : "Category-2"
						}
					}
				} ];
				that.oCategoryNode = oCategoryNode;
				var oStepNode = [ {
					id : "configId",
					name : "Test Configuration 1",
					oParams : {
						arguments : {
							configId : "configId"
						}
					}
				}, {
					id : "Category-2",
					name : "Revenue",
					oParams : {
						arguments : {
							configId : "configId",
							categoryId : "Category-2"
						}
					}
				}, {
					id : "Step-1",
					name : "Revenue Over Time",
					oParams : {
						arguments : {
							configId : "configId",
							categoryId : "Category-2",
							stepId : "Step-1"
						}
					}
				} ];
				that.oStepNode = oStepNode;
				var oRepresentationNode = [ {
					id : "configId",
					name : "Test Configuration 1",
					oParams : {
						arguments : {
							configId : "configId"
						}
					}
				}, {
					id : "Category-2",
					name : "Revenue",
					oParams : {
						arguments : {
							configId : "configId",
							categoryId : "Category-2"
						}
					}
				}, {
					id : "Step-1",
					name : "Revenue Over Time",
					oParams : {
						arguments : {
							configId : "configId",
							categoryId : "Category-2",
							stepId : "Step-1"
						}
					}
				}, {
					id : "Step-1-Representation-1",
					name : "Column Chart",
					oParams : {
						arguments : {
							configId : "configId",
							categoryId : "Category-2",
							stepId : "Step-1",
							representationId : "Step-1-Representation-1"
						}
					}
				} ];
				that.oRepresentationNode = oRepresentationNode;
				var oNavigationTargetNode = [ {
					id : "configId",
					name : "Test Configuration 1",
					oParams : {
						arguments : {
							configId : "configId"
						}
					}
				}, {
					id : "NavigationTarget-1",
					name : "Execute APF Configuration",
					oParams : {
						arguments : {
							configId : "configId",
							navTargetId : "NavigationTarget-1"
						}
					}
				} ];
				that.oNavigationTargetNode = oNavigationTargetNode;
				that.oConfigurationListController = new sap.ui.controller("sap.apf.modeler.ui.controller.configurationList");
				sinon.stub(that.oConfigurationListController, "getOwnerComponent", sinon.stub().returns(that.oGetOwnerComponentStub));
				sinon.stub(that.oConfigurationListController, "byId", that.oByIdStub);
				sinon.stub(that.oConfigurationListController, "getView", that.oGetViewStub);
				that.oConfigurationListController.oCoreApi = that.oConfigurationListController.getOwnerComponent().oCoreApi;
				that.oConfigurationListController.onInit();
				that.oConfigurationListController.applicationHandler = that.oModelerInstance.applicationHandler;
				that.oConfigurationListController.configurationHandler = that.oModelerInstance.configurationHandler;
				that.oConfigurationListController.configEditor = that.oModelerInstance.configurationEditorForSavedConfig;
				sinon.stub(that.oConfigurationListController.oCoreApi, "getRepresentationTypes", that.oGetRepresentationTypesStub);
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			this.oConfigurationListController.configEditor = this.oModelerInstance.configurationEditorForSavedConfig;
			this.oConfigurationListController.getOwnerComponent.restore();
			this.oConfigurationListController.byId.restore();
			this.oConfigurationListController.getView.restore();
			this.oConfigurationListController.oCoreApi.getRepresentationTypes.restore();
			sap.ui.core.UIComponent.getRouterFor.restore();
			if ((jQuery(".sapMDialog").length) !== 0) {
				//sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).getBeginButton().firePress();
				sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).destroy();
			}
			this.oModelerInstance.modelerCore.getAllAvailableSemanticObjects.restore();
			this.oModelerInstance.modelerCore.getSemanticActions.restore();
			this.oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			return;
		}
	});
	QUnit.test("Test availability of Configuration List controller", function(assert) {
		assert.ok(this.oConfigurationListController, "Configuration List Controller is Available");
	});
	QUnit.test("Test availability of all APIs in configurationList controller", function(assert) {
		assert.ok(typeof this.oConfigurationListController.onInit === "function", "OnInit function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.setConfigListMasterTitle === "function", "setConfigListMasterTitle function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.onAfterRendering === "function", "onAfterRendering function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.updateSubView === "function", "updateSubView function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.clearTitleAndBreadCrumb === "function", "clearTitleAndBreadCrumb() function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._getAllPossibleNodes === "function", "getAllPossibleNodes() function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._createTextForBreadCrumb === "function", "_createTextForBreadCrumb() function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._createLinkForBreadCrumb === "function", "_createLinkForBreadCrumb() function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._breadCrumbCreation === "function", "_breadCrumbCreation() function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._navigateToNode === "function", "navigateToNode() function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.updateTitleAndBreadCrumb === "function", "updateTitleAndBreadCrumb function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.setSelectionOnTree === "function", "setSelectionOnTree function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.removeSelectionOnTree === "function", "removeSelectionOnTree function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.updateSelectedNode === "function", "updateSelectedNode function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.createConfigList === "function", "createConfigList function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.showNoConfigSelectedText === "function", "showNoConfigSelectedText function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.updateConfigListView === "function", "updateConfigListView function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.getSPathForConfig === "function", "getSPathForConfig function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.getSPathFromURL === "function", "getSPathFromURL function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._handleExportButtonPress === "function", "_handleExportButtonPress function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._handleOpenConfigLinkPress === "function", "_handleOpenConfigLinkPress function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._handleOpenTextsLinkPress === "function", "_handleOpenTextsLinkPress function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._handleCloseOfExportDialog === "function", "_handleCloseOfExportDialog function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.updateConfigTree === "function", "updateConfigTree function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.updateTree === "function", "updateTree function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._handleToggleTreeNode === "function", "_handleToggleTreeNode function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController.handleSavePress === "function", "handleSavePress function Available in Configuration List controller");
		//Private API's related to navigation handling
		assert.ok(typeof this.oConfigurationListController._isNewSubView === "function", "_isNewSubView function Available in Configuration List controller");
		assert.ok(typeof this.oConfigurationListController._getCurrentConfigurationNode === "function", "_getCurrentConfigurationNode function Available in Configuration List controller");
	});
	QUnit.test("onInit Test", function(assert) {
		this.oConfigurationListController.onInit();
		assert.ok(this.oConfigurationListController.toolbarController, "Toolbar instance available");
		assert.ok(this.oConfigurationListController.oTreeInstance, "APF Tree instance available");
		assert.ok(this.oConfigurationListController.oTitleBreadCrumbView, "Title and Breadcrumb view instance available");
		assert.ok(this.oConfigurationListController.oTitleBreadCrumbController, "Title and Breadcrumb controller instance available");
		assert.equal(this.oConfigurationListController.bProgramaticSelection, false, "Programatic selection boolean set to false");
	});
	QUnit.test("setConfigListMasterTitle Test", function(assert) {
		this.oConfigurationListController.setConfigListMasterTitle("");
		assert.equal(this.oConfigurationListController.byId("idConfigTitleMaster").getText(), "", "Title set correctly to configurationList view master content");
	});
	QUnit.test("updateSubView Test", function(assert) {
		var oParams = {
			name : "configuration",
			arguments : {
				appId : "test App Id",
				configId : "test Config Id"
			}
		};
		var oGetSPathFromURLStub = function() {
			var obj = {
				sPath : "/aConfigDetails/1",
				objectType : "configuration"
			};
			return obj;
		};
		var oSetSubViewContainerHeightStub = function() {
			return null;
		};
		sinon.stub(this.oConfigurationListController, "getSPathFromURL", oGetSPathFromURLStub);
		sinon.stub(this.oConfigurationListController, "_setSubViewContainerHeight", oSetSubViewContainerHeightStub);
		this.oConfigurationListController.updateSubView(oParams);
		assert.equal(this.oConfigurationListController._getSubView().getViewName(), "sap.apf.modeler.ui.view.configuration", "Proper subview is loaded in the detail area");
	});
	QUnit.test("clearTitleAndBreadCrumb Test", function(assert) {
		this.oConfigurationListController.clearTitleAndBreadCrumb();
		assert.equal(this.oConfigurationListController.oTitleBreadCrumbView.byId("IdFormTitle").getText(), "", "Title cleared");
		assert.deepEqual(this.oConfigurationListController.oTitleBreadCrumbView.byId("IdBreadCrumb").getContent(), [], "BreadCrumb cleared");
	});
	QUnit.test("getAllPossibleNodes Test -when selected node is a configuration node", function(assert) {
		var oParentNodeContext = {
			configId : "configId",
			configurationName : "Test Configuration 1"
		};
		var oNodeDetails = this.oConfigurationListController._getAllPossibleNodes(oParentNodeContext);
		assert.deepEqual(oNodeDetails, this.oConfigNode, "Node Details returned are same as expected node details for Configuration Node");
	});
	QUnit.test("getAllPossibleNodes Test -when selected node is a facet filter node", function(assert) {
		var oParentNodeContext = {
			facetFilterId : "facetFilterId",
			facetFilterName : "From Date",
			configId : "configId",
			configurationName : "Test Configuration 1"
		};
		var oNodeDetails = this.oConfigurationListController._getAllPossibleNodes(oParentNodeContext);
		assert.deepEqual(this.oFacetFilterNode, oNodeDetails, "Node Details returned are same as expected node details for facet filter Node");
	});
	QUnit.test("getAllPossibleNodes Test -when selected node is a category node", function(assert) {
		var oParentNodeContext = {
			categoryId : "Category-2",
			categoryName : "Revenue",
			configId : "configId",
			configurationName : "Test Configuration 1"
		};
		var oNodeDetails = this.oConfigurationListController._getAllPossibleNodes(oParentNodeContext);
		assert.deepEqual(this.oCategoryNode, oNodeDetails, "Node Details returned are same as expected node details for category Node");
	});
	QUnit.test("getAllPossibleNodes Test -when selected node is a step node", function(assert) {
		var oParentNodeContext = {
			stepId : "Step-1",
			stepName : "Revenue Over Time",
			categoryId : "Category-2",
			categoryName : "Revenue",
			configId : "configId",
			configurationName : "Test Configuration 1"
		};
		var oNodeDetails = this.oConfigurationListController._getAllPossibleNodes(oParentNodeContext);
		assert.deepEqual(this.oStepNode, oNodeDetails, "Node Details returned are same as expected node details for step Node");
	});
	QUnit.test("getAllPossibleNodes Test -when selected node is a representation node", function(assert) {
		var oParentNodeContext = {
			representationId : "Step-1-Representation-1",
			representationName : "Column Chart",
			stepId : "Step-1",
			stepName : "Revenue Over Time",
			categoryId : "Category-2",
			categoryName : "Revenue",
			configId : "configId",
			configurationName : "Test Configuration 1"
		};
		var oNodeDetails = this.oConfigurationListController._getAllPossibleNodes(oParentNodeContext);
		assert.deepEqual(this.oRepresentationNode, oNodeDetails, "Node Details returned are same as expected node details for Representation Node");
	});
	QUnit.test("getAllPossibleNodes Test -when selected node is a Navigation Target node", function(assert) {
		var oParentNodeContext = {
			configId : "configId",
			configurationName : "Test Configuration 1",
			navTargetId : "NavigationTarget-1",
			navTargetName : "Execute APF Configuration"
		};
		var oNodeDetails = this.oConfigurationListController._getAllPossibleNodes(oParentNodeContext);
		assert.deepEqual(oNodeDetails, this.oNavigationTargetNode, "Node Details returned are same as expected node details for Navigation Target Node");
	});
	QUnit.test("createTextForBreadCrumb Test", function(assert) {
		var sType = this.oConfigurationListController.oCoreApi.getText("category");
		var oText = this.oConfigurationListController._createTextForBreadCrumb(sType);
		assert.equal(oText.getText(), sType, "TextView Created using given text");
	});
	QUnit.test("createLinkForBreadCrumb Test", function(assert) {
		var sName = "TestConfiguration 1";
		var oLink = this.oConfigurationListController._createLinkForBreadCrumb(sName);
		assert.equal(oLink.getText(), sName, "Link Created using given text");
	});
	QUnit.test("createIconForBreadCrumb Test", function(assert) {
		var sSrc = "sap-icon://open-command-field";
		var oIcon = this.oConfigurationListController._createIconForBreadCrumb();
		assert.equal(oIcon.getSrc(), sSrc, "Icon Created BreadCrumb");
	});
	QUnit.test("breadCrumbCreation Test -When selected Node is a configuration node", function(assert) {
		var oSelectedNodes = this.oConfigNode;
		var sConfigName = "Test Configuration 1";
		this.oConfigurationListController._breadCrumbCreation(oSelectedNodes);
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[0].getText(), sConfigName, "BreadCrumb created for Configuration Node");
	});
	QUnit.test("breadCrumbCreation Test -When selected Node is a facet filter node", function(assert) {
		var oSelectedNodes = this.oFacetFilterNode;
		var sConfigName = "Test Configuration 1";
		var sFacetFilterStruct = "Facet Filter";
		var sSrc = "sap-icon://open-command-field";
		var sFacetFilterName = "From Date";
		this.oConfigurationListController._breadCrumbCreation(oSelectedNodes, sFacetFilterStruct);
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[0].getText(), sConfigName, "Configuration Node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[1].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[2].getText(), sFacetFilterStruct, "facetFilter structural node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[3].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[4].getText(), sFacetFilterName, "facetFilter node added in breadcrumb");
	});
	QUnit.test("breadCrumbCreation Test -When selected Node is a smart filter node", function(assert) {
		var oSelectedNodes = this.oSmartFilterNode;
		var sConfigName = "Test Configuration 1";
		var sSmartFilterStruct = "Smart Filter Bar";
		var sSrc = "sap-icon://open-command-field";
		var sSmartFilterName = "Smart Filter";
		this.oConfigurationListController._breadCrumbCreation(oSelectedNodes, sSmartFilterStruct);
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[0].getText(), sConfigName, "Configuration Node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[1].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[2].getText(), sSmartFilterStruct, "smartFilter structural node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[3].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[4].getText(), sSmartFilterName, "smartFilter node added in breadcrumb");
	});
	QUnit.test("breadCrumbCreation Test -When selected Node is a category node", function(assert) {
		var oSelectedNodes = this.oCategoryNode;
		var sConfigName = "Test Configuration 1";
		var sCategoryStruct = "category";
		var sSrc = "sap-icon://open-command-field";
		var sCategoryName = "Revenue";
		this.oConfigurationListController._breadCrumbCreation(oSelectedNodes, sCategoryStruct);
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[0].getText(), sConfigName, "Configuration Node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[1].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[2].getText(), sCategoryStruct, "category structural node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[3].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[4].getText(), sCategoryName, "category node added in breadcrumb");
	});
	QUnit.test("breadCrumbCreation Test -When selected Node is a step node", function(assert) {
		var oSelectedNodes = this.oStepNode;
		var sConfigName = "Test Configuration 1";
		var sCategoryStruct = "category";
		var sSrc = "sap-icon://open-command-field";
		var sCategoryName = "Revenue";
		var sStepName = "Revenue Over Time";
		this.oConfigurationListController._breadCrumbCreation(oSelectedNodes, sCategoryStruct);
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[0].getText(), sConfigName, "Configuration Node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[1].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[2].getText(), sCategoryStruct, "category structural node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[3].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[4].getText(), sCategoryName, "category node added in breadcrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[5].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[6].getText(), sStepName, "Step Node added in BreadCrumb");
	});
	QUnit.test("breadCrumbCreation Test -When selected Node is a representation node", function(assert) {
		var oSelectedNodes = this.oRepresentationNode;
		var sConfigName = "Test Configuration 1";
		var sCategoryStruct = "category";
		var sSrc = "sap-icon://open-command-field";
		var sCategoryName = "Revenue";
		var sStepName = "Revenue Over Time";
		var sRepresenationName = "Column Chart";
		this.oConfigurationListController._breadCrumbCreation(oSelectedNodes, sCategoryStruct);
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[0].getText(), sConfigName, "Configuration Node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[1].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[2].getText(), sCategoryStruct, "category structural node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[3].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[4].getText(), sCategoryName, "category node added in breadcrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[5].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[6].getText(), sStepName, "Step Node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[7].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[8].getText(), sRepresenationName, "Representation Node added in BreadCrumb");
	});
	QUnit.test("breadCrumbCreation Test -When selected Node is a Navigation Target node", function(assert) {
		var oSelectedNodes = this.oNavigationTargetNode;
		var sConfigName = "Test Configuration 1";
		var sSrc = "sap-icon://open-command-field";
		var sNavigationTargetStruct = "Navigation Target";
		var sNavigationTargetName = "Execute APF Configuration";
		this.oConfigurationListController._breadCrumbCreation(oSelectedNodes, sNavigationTargetStruct);
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[0].getText(), sConfigName, "Configuration Node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[1].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[2].getText(), sNavigationTargetStruct, "navigation structural node added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[3].getSrc(), sSrc, "Navigation icon added in BreadCrumb");
		assert.deepEqual(this.oConfigurationListController.oBreadCrumb.getContent()[4].getText(), sNavigationTargetName, "Representation Node added in BreadCrumb");
	});
	QUnit.test("navigateToNode Test - when selected link is a configuration link", function(assert) {
		var sPath = "/aConfigDetails/0";
		var oContextFromModel = this.oConfigurationListController.oTreeInstance.getModel().getContext(sPath);
		this.oConfigurationListController._navigateToNode(sPath);
		var oNode = this.oConfigurationListController.oTreeInstance.getNodeByContext(oContextFromModel);
		assert.equal(oNode.getBindingContext().getObject().isSelected, true, "Configuration Node Selected");
	});
	QUnit.test("navigateToNode Test - when selected link is a facet filter link", function(assert) {
		var sPath = "/aConfigDetails/0/configData/0/filters/0";
		var oContextFromModel = this.oConfigurationListController.oTreeInstance.getModel().getContext(sPath);
		this.oConfigurationListController._navigateToNode(sPath);
		var oNode = this.oConfigurationListController.oTreeInstance.getNodeByContext(oContextFromModel);
		assert.equal(oNode.getBindingContext().getObject().isSelected, true, "facet filter node selected");
	});
	QUnit.test("navigateToNode Test - when selected link is a category link", function(assert) {
		var sPath = "/aConfigDetails/0/configData/1/categories/0";
		var oContextFromModel = this.oConfigurationListController.oTreeInstance.getModel().getContext(sPath);
		this.oConfigurationListController._navigateToNode(sPath);
		var oNode = this.oConfigurationListController.oTreeInstance.getNodeByContext(oContextFromModel);
		assert.equal(oNode.getBindingContext().getObject().isSelected, true, "category Node selected");
	});
	QUnit.test("navigateToNode Test - when selected link is a step link", function(assert) {
		var sPath = "/aConfigDetails/0/configData/1/categories/0/steps/0";
		var oContextFromModel = this.oConfigurationListController.oTreeInstance.getModel().getContext(sPath);
		this.oConfigurationListController._navigateToNode(sPath);
		var oNode = this.oConfigurationListController.oTreeInstance.getNodeByContext(oContextFromModel);
		assert.equal(oNode.getBindingContext().getObject().isSelected, true, "step Node selected");
	});
	QUnit.test("navigateToNode Test - when selected link is a representation link", function(assert) {
		var sPath = "/aConfigDetails/0/configData/1/categories/0/steps/0/representations/0";
		var oContextFromModel = this.oConfigurationListController.oTreeInstance.getModel().getContext(sPath);
		this.oConfigurationListController._navigateToNode(sPath);
		var oNode = this.oConfigurationListController.oTreeInstance.getNodeByContext(oContextFromModel);
		assert.equal(oNode.getBindingContext().getObject().isSelected, true, "representation Node selected");
	});
	QUnit.test("navigateToNode Test - when selected link is a target navigation link", function(assert) {
		var sPath = "/aConfigDetails/0/configData/2/navTargets/0";
		var oContextFromModel = this.oConfigurationListController.oTreeInstance.getModel().getContext(sPath);
		this.oConfigurationListController._navigateToNode(sPath);
		var oNode = this.oConfigurationListController.oTreeInstance.getNodeByContext(oContextFromModel);
		assert.equal(oNode.getBindingContext().getObject().isSelected, true, "target navigation Node selected");
	});
	//Contents of breadcrumb tested in _breadCrumbCreation test.No need to test again in updateTitleAndBreadCrumb test
	QUnit.test("updateTitleAndBreadCrumb Test - when selected node is a configuration node", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0]);
		this.oConfigurationListController.updateTitleAndBreadCrumb();
		var expectedText = this.oConfigurationListController.oCoreApi.getText("configuration") + ": Test Configuration 1";
		assert.equal(this.oConfigurationListController.oTitleBreadCrumbView.byId("IdFormTitle").getText(), expectedText, "Detail form title set correctly");
	});
	QUnit.test("updateTitleAndBreadCrumb Test - when selected node is a facet filter node", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0].getNodes()[0].getNodes()[0]);
		this.oConfigurationListController.updateTitleAndBreadCrumb();
		var expectedText = this.oConfigurationListController.oCoreApi.getText("facetFilter") + ": From Date";
		assert.equal(this.oConfigurationListController.oTitleBreadCrumbView.byId("IdFormTitle").getText(), expectedText, "Detail form title set correctly");
	});
	QUnit.test("updateTitleAndBreadCrumb Test - when selected node is a category node", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0].getNodes()[1].getNodes()[0]);
		this.oConfigurationListController.updateTitleAndBreadCrumb();
		var expectedText = this.oConfigurationListController.oCoreApi.getText("category") + ": Time";
		assert.equal(this.oConfigurationListController.oTitleBreadCrumbView.byId("IdFormTitle").getText(), expectedText, "Detail form title set correctly");
	});
	QUnit.test("updateTitleAndBreadCrumb Test - when selected node is a step node", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0].getNodes()[1].getNodes()[0].getNodes()[0]);
		this.oConfigurationListController.updateTitleAndBreadCrumb();
		var expectedText = this.oConfigurationListController.oCoreApi.getText("step") + ": Revenue Over Time";
		assert.equal(this.oConfigurationListController.oTitleBreadCrumbView.byId("IdFormTitle").getText(), expectedText, "Detail form title set correctly");
	});
	QUnit.test("updateTitleAndBreadCrumb Test - when selected node is a representation node", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0].getNodes()[1].getNodes()[0].getNodes()[0].getNodes()[0]);
		this.oConfigurationListController.updateTitleAndBreadCrumb();
		var expectedText = this.oConfigurationListController.oCoreApi.getText("representation") + ": Column Chart";
		assert.equal(this.oConfigurationListController.oTitleBreadCrumbView.byId("IdFormTitle").getText(), expectedText, "Detail form title set correctly");
	});
	QUnit.test("updateTitleAndBreadCrumb Test - when selected node is a navigation target node", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0].getNodes()[2].getNodes()[0]);
		this.oConfigurationListController.updateTitleAndBreadCrumb();
		var expectedText = this.oConfigurationListController.oCoreApi.getText("navigationTarget") + ": Execute APF Configuration";
		assert.equal(this.oConfigurationListController.oTitleBreadCrumbView.byId("IdFormTitle").getText(), expectedText, "Detail form title set correctly");
	});
	QUnit.test("updateTitleAndBreadCrumb Test - when node title is changed from the detail subview", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0]);
		this.oConfigurationListController.updateTitleAndBreadCrumb("My Title");
		assert.equal(this.oConfigurationListController.oTitleBreadCrumbView.byId("IdFormTitle").getText(), "My Title", "Detail form title set correctly");
	});
	QUnit.test("setSelectionOnTree Test", function(assert) {
		this.oConfigurationListController.setSelectionOnTree(this.oConfigurationListController.oTreeInstance.getNodes()[0].getBindingContext());
		assert.deepEqual(this.oConfigurationListController.oTreeInstance.getSelection(), this.oConfigurationListController.oTreeInstance.getNodes()[0], "Selection set properly on the tree");
	});
	QUnit.test("removeSelectionOnTree Test - when configuration list controller has no selected node instance", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0]);
		this.oConfigurationListController.removeSelectionOnTree();
		assert.equal(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].isSelected, false, "Selection removed from the tree");
	});
	QUnit.test("removeSelectionOnTree Test - when configuration list controller has selected node instance", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0]);
		this.oConfigurationListController.selectedNode = this.oConfigurationListController.oTreeInstance.getNodes()[0];
		this.oConfigurationListController.removeSelectionOnTree();
		assert.equal(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].isSelected, false, "Selection removed from the tree");
		assert.equal(this.oConfigurationListController.oTreeInstance.getSelection(), null, "Selection has been removed from the tree");
	});
	QUnit.test("updateSelectedNode Test - update title of a saved node", function(assert) {
		var params = {
			name : "Updated Title"
		};
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0]);
		this.oConfigurationListController.updateSelectedNode(params);
		assert.equal(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].name, params.name, "Title of the node updated correctly");
	});
	QUnit.test("updateSelectedNode Test - update title of newly added configuration node", function(assert) {
		var params = {
			id : "tempId",
			name : "Test new node title"
		};
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0]);
		this.oConfigurationListController.updateSelectedNode(params);
		assert.equal(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].name, params.name, "Title of the node updated correctly");
	});
	QUnit.test("updateSelectedNode Test - update title and icon of saved representation node", function(assert) {
		var params = {
			icon : "sap-icon://line-chart",
			name : "Line Chart"
		};
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0].getNodes()[1].getNodes()[0].getNodes()[0].getNodes()[0]);
		this.oConfigurationListController.updateSelectedNode(params);
		assert.equal(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].configData[1].categories[0].steps[0].representations[0].icon, params.icon, "Icon of the node updated correctly");
		assert.equal(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].configData[1].categories[0].steps[0].representations[0].name, params.name, "Title of the node updated correctly");
	});
	QUnit.test("updateSelectedNode Test - update title and icon of newly added representation node", function(assert) {
		var params = {
			id : "Rep-1",
			name : "myRepresentation",
			icon : "sap-icon://line-chart"
		};
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0].getNodes()[1].getNodes()[0].getNodes()[0].getNodes()[0]);
		this.oConfigurationListController.updateSelectedNode(params);
		assert.equal(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].configData[1].categories[0].steps[0].representations[0].icon, params.icon, "Icon of the node updated correctly");
		assert.equal(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].configData[1].categories[0].steps[0].representations[0].name, params.name, "Title of the node updated correctly");
	});
	QUnit.test("createConfigList Test", function(assert) {
		this.oConfigurationListController.createConfigList();
		assert.equal(this.oConfigurationListController.oModel.getData().aConfigDetails.length, 3, "List of configurations created");
	});
	QUnit.test("showNoConfigSelectedText Test", function(assert) {
		this.oConfigurationListController.toolbarController.byId("idCopyButton").setEnabled(true);
		this.oConfigurationListController.toolbarController.byId("idDeleteButton").setEnabled(true);
		this.oConfigurationListController.showNoConfigSelectedText();
		assert.equal(this.oConfigurationListController.toolbarController.byId("idCopyButton").getEnabled(), false, "showNoConfigSelectedText executed properly");
		assert.equal(this.oConfigurationListController.toolbarController.byId("idDeleteButton").getEnabled(), false, "showNoConfigSelectedText executed properly");
	});
	QUnit.test("updateConfigListView Test - when application has more than one configurations", function(assert) {
		this.oConfigurationListController.toolbarController.byId("idCopyButton").setEnabled(true);
		this.oConfigurationListController.toolbarController.byId("idDeleteButton").setEnabled(true);
		this.oConfigurationListController.selectedNode = null;
		this.oConfigurationListController.configList = this.oConfigurationListController.oTreeInstance.getNodes();
		this.oConfigurationListController.updateConfigListView();
		assert.equal(this.oConfigurationListController.toolbarController.byId("idCopyButton").getEnabled(), false, "Copy button disabled as no configuration is selected.");
		assert.equal(this.oConfigurationListController.toolbarController.byId("idDeleteButton").getEnabled(), false, "Delete button disabled as no configuration is selected.");
	});
	QUnit.test("updateConfigListView Test - when application has only one configuration", function(assert) {
		this.oConfigurationListController.selectedNode = null;
		this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails.splice(1, 1);
		this.oConfigurationListController.configList = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		this.oConfigurationListController.updateConfigListView();
		assert.equal(this.oConfigurationListController.toolbarController.byId("idCopyButton").getEnabled(), true, "Copy button enabled as only one configuration is available and it is selected by default");
		assert.equal(this.oConfigurationListController.toolbarController.byId("idDeleteButton").getEnabled(), true, "Delete button enabled as only one configuration is available and it is selected by default");
	});
	QUnit.test("getSPathForConfig Test", function(assert) {
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var sPath = this.oConfigurationListController.getSPathForConfig("configId");
		assert.equal(sPath, "/aConfigDetails/0", "sPath returned is proper");
	});
	QUnit.test("getSPathFromURL Test - when selected node is a configuration node", function(assert) {
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var params = {
			name : "configuration",
			arguments : {
				appId : "appId",
				configId : "configId"
			}
		};
		var oValidURL = this.oConfigurationListController.getSPathFromURL(params);
		var expectedValidURL = {
			sPath : "/aConfigDetails/0",
			objectType : "configuration"
		};
		assert.deepEqual(oValidURL, expectedValidURL, "sPath for configuration node is proper");
	});
	QUnit.test("getSPathFromURL Test - when selected node is a facet filter node", function(assert) {
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var params = {
			name : "facetFilter",
			arguments : {
				appId : "appId",
				configId : "configId",
				facetFilterId : "facetFilterId"
			}
		};
		var oValidURL = this.oConfigurationListController.getSPathFromURL(params);
		var expectedValidURL = {
			sPath : "/aConfigDetails/0/configData/0/filters/0",
			objectType : "facetFilter"
		};
		assert.deepEqual(oValidURL, expectedValidURL, "sPath for facet filter node is proper");
	});
	QUnit.test("getSPathFromURL Test - when selected node is a category node", function(assert) {
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var params = {
			name : "category",
			arguments : {
				appId : "appId",
				configId : "configId",
				categoryId : "Category-1"
			}
		};
		var oValidURL = this.oConfigurationListController.getSPathFromURL(params);
		var expectedValidURL = {
			sPath : "/aConfigDetails/0/configData/1/categories/0",
			objectType : "category"
		};
		assert.deepEqual(oValidURL, expectedValidURL, "sPath for category node is proper");
	});
	QUnit.test("getSPathFromURL Test - when selected node is a step node", function(assert) {
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var params = {
			name : "step",
			arguments : {
				appId : "appId",
				configId : "configId",
				categoryId : "Category-1",
				stepId : "Step-1"
			}
		};
		var oValidURL = this.oConfigurationListController.getSPathFromURL(params);
		var expectedValidURL = {
			sPath : "/aConfigDetails/0/configData/1/categories/0/steps/0",
			objectType : "step"
		};
		assert.deepEqual(oValidURL, expectedValidURL, "sPath for step node is proper");
	});
	QUnit.test("getSPathFromURL Test - when selected node is a representation node", function(assert) {
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var params = {
			name : "representation",
			arguments : {
				appId : "appId",
				configId : "configId",
				categoryId : "Category-1",
				stepId : "Step-1",
				representationId : "Step-1-Representation-1"
			}
		};
		var oValidURL = this.oConfigurationListController.getSPathFromURL(params);
		var expectedValidURL = {
			sPath : "/aConfigDetails/0/configData/1/categories/0/steps/0/representations/0",
			objectType : "representation"
		};
		assert.deepEqual(oValidURL, expectedValidURL, "sPath for representation node is proper");
	});
	QUnit.test("getSPathFromURL Test - when selected node is a navigation target node", function(assert) {
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var params = {
			name : "navigationTarget",
			arguments : {
				appId : "appId",
				configId : "configId",
				navTargetId : "NavigationTarget-1"
			}
		};
		var oValidURL = this.oConfigurationListController.getSPathFromURL(params);
		var expectedValidURL = {
			sPath : "/aConfigDetails/0/configData/2/navTargets/0",
			objectType : "navigationTarget"
		};
		assert.deepEqual(oValidURL, expectedValidURL, "sPath for navigation target node is proper");
	});
	QUnit.test("_handleExportButtonPress Test - when mandatory fields are not filled", function(assert) {
		this.oConfigurationListController.configId = this.oModelerInstance.tempSavedConfigId;
		this.oConfigurationListController._handleExportButtonPress();
		sap.ui.getCore().byId(jQuery(".sapMDialog")[0].id).getBeginButton().firePress();
		var oOpenFileStub = function() {
			return null;
		};
		sinon.stub(this.oConfigurationListController, "_openFile", oOpenFileStub);
		this.oConfigurationListController._handleOpenConfigLinkPress();
		this.oConfigurationListController._handleOpenTextsLinkPress();
		assert.equal(jQuery(".sapMDialog").length, 1, "Export Configuration Dialog is opened on UI");
		this.oConfigurationListController._openFile.restore();
	});
	QUnit.test("updateConfigTree Test - when a new category is assigned to a step, the step is added to that category", function(assert) {
		this.oConfigurationListController.configEditor = this.oModelerInstance.configurationEditorForUnsavedConfig;
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var objectContexts = [ {
			oldContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-1",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			},
			newContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-2",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			}
		} ];
		this.oConfigurationListController.updateConfigTree(objectContexts);
		assert.equal(this.oConfigurationListController.oModel.getData().aConfigDetails[0].configData[1].categories[1].steps.length, 1, "Step Added to the ne category");
	});
	QUnit.test("updateConfigTree Test - when a category is assigned to a step, if step is already present in that category step is not added again in that category", function(assert) {
		this.oConfigurationListController.configEditor = this.oModelerInstance.configurationEditorForUnsavedConfig;
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var objectContexts = [ {
			oldContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-1",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			},
			newContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-3",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			}
		} ];
		this.oConfigurationListController.updateConfigTree(objectContexts);
		assert.equal(this.oConfigurationListController.oModel.getData().aConfigDetails[0].configData[1].categories[2].steps.length, 1, "Step is not added to the tne category again as it was already present");
	});
	QUnit.test("updateConfigTree Test - when a category assigned to a step is removed", function(assert) {
		this.oConfigurationListController.configEditor = this.oModelerInstance.configurationEditorForUnsavedConfig;
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var objectContexts = [ {
			oldContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-1",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			},
			newContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-3",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			},
			removeStep : true
		} ];
		this.oConfigurationListController.updateConfigTree(objectContexts);
		assert.equal(this.oConfigurationListController.oModel.getData().aConfigDetails[0].configData[1].categories[2].steps.length, 0, "Step is removed from the category which is deleted");
	});
	QUnit.test("updateConfigTree Test - If the step is being removed from the present category, prepare context of the next category in which the step is present", function(assert) {
		this.oConfigurationListController.configEditor = this.oModelerInstance.configurationEditorForUnsavedConfig;
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var objectContexts = [ {
			oldContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-1",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			},
			newContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-2",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			}
		}, {
			oldContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-1",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			},
			newContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-1",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			},
			categoryChangeContext : {
				arguments : {
					appId : "appId",
					categoryId : "Category-2",
					configId : "configId",
					stepId : "Step-1"
				},
				name : "step"
			},
			removeStep : true,
			changeCategory : true
		} ];
		this.oConfigurationListController.updateConfigTree(objectContexts);
		assert.equal(this.oConfigurationListController.oModel.getData().aConfigDetails[0].configData[1].categories[1].steps.length, 1, "Step is added to the new category and removed from current category");
	});
	QUnit.test("updateTree Test", function(assert) {
		this.oConfigurationListController.configEditor = this.oModelerInstance.configurationEditorForUnsavedConfig;
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		this.oConfigurationListController.configId = "configId";
		this.oConfigurationListController.modelUpdateDeferred = {};
		this.oConfigurationListController.modelUpdateDeferred[0] = new jQuery.Deferred();
		var getConfigurationStub = function(id) {
			var obj = {
				AnalyticalConfigurationName : "Test Configuration 1"
			};
			return obj;
		};
		sinon.stub(this.oModelerInstance.configurationHandler, "getConfiguration", getConfigurationStub);
		this.oConfigurationListController.updateTree();
		assert.equal(this.oConfigurationListController.oModel.getData().aConfigDetails[0].configData[1].categories.length, 2, "Categories array prepared as per the editor instance");
		assert.equal(this.oConfigurationListController.oModel.getData().aConfigDetails[0].configData[1].categories[0].steps.length, 2, "Steps array prepared as per the editor instance");
		this.oModelerInstance.configurationHandler.getConfiguration.restore();
	});
	QUnit.test("Test for toggle of a tree node", function(assert) {
		//arrangement
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var oNode = this.oConfigurationListController.oTreeInstance.getNodes()[0];
		var divOfQunitFixture;
		//act
		this.oConfigurationListController.oTreeInstance.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		oNode.getDomRef().click();//fireToggleOpenState does not work for tree expansion and therefore the div has to be clicked to trigger the event
		//assert
		assert.strictEqual(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].expanded, true, "then expanded state is true in model");
		assert.strictEqual(oNode.getExpanded(), true, "then node is expanded in the tree");
		//act
		oNode.getDomRef().click();
		//assert
		assert.strictEqual(this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails[0].expanded, false, "then expanded state is false in model");
		assert.strictEqual(oNode.getExpanded(), false, "then node is not expanded in the tree");
		//cleanup
		divOfQunitFixture = jQuery("#qunit-fixture")[0];
		divOfQunitFixture.removeChild(divOfQunitFixture.children[0]);
	});
	QUnit.test("_handleToggleTreeNode Test - if tree structure is already loaded for a configuration", function(assert) {
		//arrangement
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var spyOnUpdateBindings = sinon.spy(this.oConfigurationListController.oModel, "updateBindings");
		var oSelf = this;
		var oEvent = {
			getSource : function() {
				var oNode = oSelf.oConfigurationListController.oTreeInstance.getNodes()[0];
				oNode.setExpanded();
				return oNode;
			}
		};
		//act
		this.oConfigurationListController._handleToggleTreeNode(oEvent);
		//assert
		assert.strictEqual(this.oConfigurationListController.oModel.getData().aConfigDetails[0].expanded, true, "then node is expanded");
		assert.strictEqual(spyOnUpdateBindings.calledOnce, true, "then model is updated since configuration is already loaded");
		//cleanup
		this.oConfigurationListController.oModel.updateBindings.restore();
		this.oConfigurationListController.oTreeInstance.getNodes()[0].setExpanded(false);
		this.oConfigurationListController.oModel.getData().aConfigDetails[0].expanded = false;
	});
	QUnit.test("_isNewSubView Test - with prefix apf1972", function(assert) {
		var oParams = {
			name : "configuration",
			arguments : {
				appId : "appId",
				configId : "apf1972configId"
			}
		};
		var isNew = this.oConfigurationListController._isNewSubView(oParams);
		assert.equal(isNew, true, "New Configuration Subview loaded");
	});
	QUnit.test("_isNewSubView Test - when it is a configuration node", function(assert) {
		var oParams = {
			name : "configuration",
			arguments : {
				appId : "appId",
				configId : "configId"
			}
		};
		var isNew = this.oConfigurationListController._isNewSubView(oParams);
		assert.equal(isNew, true, "New Configuration Subview loaded");
	});
	QUnit.test("_isNewSubView Test - when it is a facetfilter node", function(assert) {
		var oParams = {
			name : "facetFilter",
			arguments : {
				appId : "appId",
				configId : "configId",
				facetFilterId : "ffId"
			}
		};
		var isNew = this.oConfigurationListController._isNewSubView(oParams);
		assert.equal(isNew, true, "New Facet filter Subview loaded");
	});
	QUnit.test("_isNewSubView Test - when it is a category node", function(assert) {
		var oParams = {
			name : "facetFilter",
			arguments : {
				appId : "appId",
				configId : "configId",
				facetFilterId : "ffId",
				categoryId : "Category-1"
			}
		};
		var isNew = this.oConfigurationListController._isNewSubView(oParams);
		assert.equal(isNew, true, "New category Subview loaded");
	});
	QUnit.test("_isNewSubView Test - when it is a step node", function(assert) {
		var oParams = {
			name : "step",
			arguments : {
				appId : "appId",
				configId : "configId",
				facetFilterId : "ffId",
				categoryId : "Category-1",
				stepId : "StepId"
			}
		};
		var isNew = this.oConfigurationListController._isNewSubView(oParams);
		assert.equal(isNew, true, "New step subview loaded");
	});
	QUnit.test("_isNewSubView Test - when it is a representation node", function(assert) {
		var oParams = {
			name : "representation",
			arguments : {
				appId : "appId",
				configId : this.oModelerInstance.tempUnsavedConfigId,
				categoryId : "Category-1",
				stepId : "Step-1",
				representationId : "repId"
			}
		};
		var isNew = this.oConfigurationListController._isNewSubView(oParams);
		assert.equal(isNew, true, "New representation subview loaded");
	});
	QUnit.test("_isNewSubView Test - when it is a navigation target node", function(assert) {
		var oParams = {
			name : "navigationTarget",
			arguments : {
				appId : "appId",
				configId : "configId",
				navTargetId : "navTarget1"
			}
		};
		var isNew = this.oConfigurationListController._isNewSubView(oParams);
		assert.equal(isNew, true, "New Navigation Target Subview loaded");
	});
	QUnit.test("_getCurrentConfigurationNode Test", function(assert) {
		this.oConfigurationListController.configId = "configId";
		var configId = this.oConfigurationListController._getCurrentConfigurationNode();
		assert.deepEqual(configId, this.oConfigurationListController.oTreeInstance.getNodes()[0], "Current selected configuration returned");
	});
	QUnit.test("handleSavePress Test - when message object is undefined", function(assert) {
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0]);
		this.oConfigurationListController.selectedNode = this.oConfigurationListController.oTreeInstance.getNodes()[0];
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var oNavigateToDifferentViewStub = function() {
			return null;
		};
		sinon.stub(this.oConfigurationListController, "navigateToDifferntView", oNavigateToDifferentViewStub);
		var oSaveStub = function(callback) {
			var id = "TestConfigId";
			callback(id, {}, undefined);
		};
		sinon.stub(this.oConfigurationListController.configEditor, "save", oSaveStub);
		this.oConfigurationListController.handleSavePress();
		assert.equal(this.oConfigurationListController.oModel.getData().aConfigDetails[0].AnalyticalConfiguration, "TestConfigId", "COnfiguration Saved Successfully");
		this.oConfigurationListController.navigateToDifferntView.restore();
		this.oConfigurationListController.configEditor.save.restore();
	});
	QUnit.test("handleSavePress Test - when message object is defined", function(assert) {
		this.oConfigurationListController.configEditor = this.oModelerInstance.configurationEditorForUnsavedConfig;
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0]);
		this.oConfigurationListController.selectedNode = this.oConfigurationListController.oTreeInstance.getNodes()[0];
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		var oNavigateToDifferentViewStub = function() {
			return null;
		};
		sinon.stub(this.oConfigurationListController, "navigateToDifferntView", oNavigateToDifferentViewStub);
		var oSelf = this;
		var oSaveStub = function(callback) {
			var oMessageObject = oSelf.oConfigurationListController.oCoreApi.createMessageObject({
				code : "12000"
			});
			var id = "TestConfigId";
			callback(id, {}, oMessageObject);
		};
		sinon.stub(this.oConfigurationListController.configEditor, "save", oSaveStub);
		this.oConfigurationListController.handleSavePress();
		assert.equal(this.oConfigurationListController.oModel.getData().aConfigDetails[0].AnalyticalConfiguration, "configId", "COnfiguration not Saved");
		this.oConfigurationListController.navigateToDifferntView.restore();
		this.oConfigurationListController.configEditor.save.restore();
	});
	QUnit.test("Test _getNavigationTargetName and _setNavigationTargetName", function(assert) {
		this.oConfigurationListController.configId = "configId";
		this.oConfigurationListController.oModel.getData().aConfigDetails = this.oConfigurationListController.oTreeInstance.getModel().getData().aConfigDetails;
		this.oConfigurationListController.modelUpdateDeferred = {};
		this.oConfigurationListController.modelUpdateDeferred[0] = new jQuery.Deferred();
		this.oConfigurationListController.modelUpdateDeferred[0].resolve(this.oConfigurationListController.oModel.getData());
		var params = {
			key : "NavigationTarget-1",
			value : "Execute APF Configuration"
		};
		this.oConfigurationListController._setNavigationTargetName(params);
		assert.equal("Execute APF Configuration", this.oConfigurationListController.navTargetTextsTable[0].texts[0].value, "The text was set in the table");
		this.oConfigurationListController._getNavigationTargetName("NavigationTarget-1").then(function(value) {
			assert.equal(value, "Execute APF Configuration", "The text was got from the navigation target texts table");
		});
	});
	QUnit.test("Test _deleteConfigNavTargetTexts", function(assert) {
		this.oConfigurationListController.modelUpdateDeferred = {};
		this.oConfigurationListController.modelUpdateDeferred[0] = new jQuery.Deferred();
		this.oConfigurationListController.modelUpdateDeferred[1] = new jQuery.Deferred();
		this.oConfigurationListController.modelUpdateDeferred[2] = new jQuery.Deferred();
		this.oConfigurationListController.modelUpdateDeferred[3] = new jQuery.Deferred();
		var navTargetTexts = {
			"0" : {
				"texts" : [ {
					"key" : "NavigationTarget-1",
					"value" : "Execute APF Configuration"
				}, {
					"key" : "NavigationTarget-1",
					"value" : "launch"
				} ]
			},
			"2" : {
				"texts" : [ {
					"key" : "NavigationTarget-1",
					"value" : "Execute APF Configuration"
				}, {
					"key" : "NavigationTarget-1",
					"value" : "launch"
				} ]
			},
			"3" : {
				"texts" : [ {
					"key" : "NavigationTarget-1",
					"value" : "Execute APF Configuration"
				}, {
					"key" : "NavigationTarget-1",
					"value" : "Analyze KPI Details"
				} ]
			}
		};
		var modelUpdateDeffered = {
			"0" : this.oConfigurationListController.modelUpdateDeferred[1],
			"1" : this.oConfigurationListController.modelUpdateDeferred[2],
			"2" : this.oConfigurationListController.modelUpdateDeferred[3]
		};
		this.oConfigurationListController.navTargetTextsTable = jQuery.extend(true, {}, navTargetTexts);
		this.oConfigurationListController._deleteConfigNavTargetTexts(0, 4);
		assert.equal(this.oConfigurationListController.navTargetTextsTable[0], undefined, "The navigation target texts for the deleted configuration was deleted");
		assert.deepEqual(this.oConfigurationListController.navTargetTextsTable[1].texts, navTargetTexts[2].texts, "The navigation target texts for the loaded configurations were copied to the precedeing key");
		assert.deepEqual(this.oConfigurationListController.navTargetTextsTable[2].texts, navTargetTexts[3].texts, "The navigation target texts for the loaded configurations were copied to the precedeing key");
		assert.deepEqual(this.oConfigurationListController.modelUpdateDeferred, modelUpdateDeffered, "The deferred object for deleted configuration was deleted");
	});
	QUnit.test("Test press of execute button", function(assert) {
		//arrangement
		var navigateToGenericRuntime = function(appId, configId, navigationMethod) {
			return;
		};
		var navigateToGenericRuntimeStub = sinon.stub(this.oCoreApi, "navigateToGenericRuntime", navigateToGenericRuntime);
		this.oConfigurationListController.oTreeInstance.setSelection(this.oConfigurationListController.oTreeInstance.getNodes()[0]);
		//act
		this.oConfigurationListController.handleExecuteButtonPress();
		//assert
		assert.strictEqual(navigateToGenericRuntimeStub.calledOnce, true, "then navigate to generic runtime was called");
		assert.strictEqual(navigateToGenericRuntimeStub.calledWith("appId", "configId", window.open), true, "then navigate to generic runtime was called");
		//cleanup
		this.oCoreApi.navigateToGenericRuntime.restore();
	});
	QUnit.module("Configuration List Unit Tests - Memorize and restore configuration", {
		beforeEach : function(assert) {
			var oGetOwnerComponentStub;
			var done = assert.async();
			var oConfigurationListController = new sap.ui.controller("sap.apf.modeler.ui.controller.configurationList");
			var spyOnInit = sinon.spy(oConfigurationListController, "onInit");
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;//Modeler instance from callback
				oGetOwnerComponentStub = {
					oCoreApi : oModelerInstance.modelerCore
				};
				memorizeConfigurationStub = sinon.stub(oModelerInstance.configurationHandler, "memorizeConfiguration", _memorizeConfigurationFn);
				restoreMemorizedConfigurationStub = sinon.stub(oModelerInstance.configurationHandler, "restoreMemorizedConfiguration", _restoreMemorizedConfigurationFn);
				resetConfigurationSpy = sinon.spy(oModelerInstance.configurationHandler, "resetConfiguration");
				spyOnShowOfMsgToast = sinon.spy(sap.m.MessageToast, "show");
				oConfigurationListController.applicationHandler = oModelerInstance.applicationHandler;
				oConfigurationListController.configurationHandler = oModelerInstance.configurationHandler;
				oConfigurationListController.appId = oModelerInstance.applicationCreatedForTest;
				//Component and router capabilities are stubbed
				sinon.stub(oConfigurationListController, "getOwnerComponent", sinon.stub().returns(oGetOwnerComponentStub));
				sap.ui.core.UIComponent.extend("sap.apf.modeler.Component", {});
				sinon.stub(sap.ui.core.UIComponent, "getRouterFor", _oGetRouterStub);
				oConfigurationListView = _instantiateView(oConfigurationListController);
				_placeViewAt(oConfigurationListView);
				assert.strictEqual(spyOnInit.calledOnce, true, "then onInit function is called and view is initialized");
				done();
			});
		},
		afterEach : function() {
			spyOnShowOfMsgToast.restore();
			saveConfigEditorStub.restore();
			oModelerInstance.configurationHandler.memorizeConfiguration.restore();
			oModelerInstance.configurationHandler.restoreMemorizedConfiguration.restore();
			oModelerInstance.configurationHandler.resetConfiguration.restore();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			sap.ui.core.UIComponent.getRouterFor.restore();
			document.body.removeChild(document.getElementById('configListView'));
			oConfigurationListView.destroy();
		}
	});
	QUnit.test("Test reset of mandatory fields, when switching between configurations, press YES on reset mandatory fields and YES on loss of data popup to save current configuration before switch", function(assert) {
		//arrangement
		var successMessageOnSave = oModelerInstance.modelerCore.getText("successOnSave");
		_setupForSwitchFromNonNewConfig(assert);
		//action
		_pressButtonOnMandatoryPopup(assert, 0, function() {
			assert.notEqual(sap.ui.getCore().byId("idMessageDialogFragment--idMessageDialog"), undefined, "then loss of data popup dialog is available");
			_pressButtonOnLossOfDataPopup(assert, 0, function() {
				//assert
				assert.strictEqual(restoreMemorizedConfigurationStub.calledOnce, true, "then memorized configuration editor is restored for a reset of mandatory fields");
				assert.strictEqual(oConfigurationListView.getController().configEditor.getConfigurationName(), "test config B", "then the configuration title is reset");
				assert.strictEqual(saveConfigEditorStub.calledOnce, true, "	then configuration is saved on press of Yes on loss of data popup");
				assert.strictEqual(spyOnShowOfMsgToast.calledWith(successMessageOnSave, {
					width : "20em",
					offset : "0 -64"
				}), true, "then success toast is displayed after save");
				assert.strictEqual(oConfigurationListView.getController().oTreeInstance.getSelection().getBindingContext().getObject().name, "test config C", "then configuration switch happened after save");
			});
		});
	});
	QUnit.test("Test reset of mandatory fields, when switching between configurations, press YES on reset mandatory fields and NO on loss of data popup to save current configuration(saved) before switch", function(assert) {
		//arrangement
		_setupForSwitchFromNonNewConfig(assert);
		//action
		_pressButtonOnMandatoryPopup(assert, 0, function() {
			assert.notEqual(sap.ui.getCore().byId("idMessageDialogFragment--idMessageDialog"), undefined, "then loss of data popup dialog is available");
			_pressButtonOnLossOfDataPopup(assert, 1, function() {
				//assert
				assert.strictEqual(restoreMemorizedConfigurationStub.calledOnce, false, "then memorized configuration editor is not restored for a reset of mandatory fields for a saved configuration");
				assert.strictEqual(oConfigurationListView.getController().configurationHandler.getList().length, 3, "then the saved configuration is not deleted and both configurations exist");
				assert.strictEqual(saveConfigEditorStub.calledOnce, false, "then configuration is not saved on press of No on loss of data popup");
				assert.strictEqual(resetConfigurationSpy.calledOnce, true, "then resetConfiguration is called to reset configuration before switching to another configuration");
				assert.strictEqual(oConfigurationListView.getController().oTreeInstance.getSelection().getBindingContext().getObject().name, "test config C", "then configuration switch happened after No was pressed");
			});
		});
	});
	QUnit.test("Test reset of mandatory fields, when switching between configurations, press YES on reset mandatory fields and NO on loss of data popup to not save current configuration(new) before switch", function(assert) {
		//arrangement
		_setupForSwitchFromNewConfig(assert);
		//action
		_pressButtonOnMandatoryPopup(assert, 0, function() {
			assert.notEqual(sap.ui.getCore().byId("idMessageDialogFragment--idMessageDialog"), undefined, "then loss of data popup dialog is available");
			_pressButtonOnLossOfDataPopup(assert, 1, function() {
				//assert
				assert.strictEqual(restoreMemorizedConfigurationStub.calledOnce, false, "then memorized configuration editor is not restored for a reset of mandatory fields for a new view");
				assert.strictEqual(oConfigurationListView.getController().configurationHandler.getList().length, 3, "then the new configuration is deleted and only one configuration exists");
				assert.strictEqual(saveConfigEditorStub.calledOnce, false, "then configuration is not saved on press of No on loss of data popup");
				assert.strictEqual(resetConfigurationSpy.calledOnce, true, "then resetConfiguration is called to reset configuration before switching to another configuration");
				assert.strictEqual(oConfigurationListView.getController().oTreeInstance.getSelection().getBindingContext().getObject().name, "test config B", "then configuration switch happened after resetConfiguration call");
			});
		});
	});
	QUnit.test("Test reset of mandatory fields, when switching between configurations, press YES on reset mandatory fields when switching between nodes of same configuration", function(assert) {
		//arrangement
		_setupForSwitchInsideSameConfig(assert);
		//action
		_pressButtonOnMandatoryPopup(assert, 0, function() {
			//assert
			assert.strictEqual(restoreMemorizedConfigurationStub.calledOnce, true, "then memorized configuration editor is restored for a reset of mandatory fields");
			assert.strictEqual(oConfigurationListView.getController().oTreeInstance.getSelection().getBindingContext().getObject().name, "test category C", "then node switch happened after restore memorized configuration");
		});
	});
	QUnit.test("Test reset of mandatory fields, when switching between configurations, press NO on reset mandatory fields when switching between nodes of same configuration", function(assert) {
		//arrangement
		_setupForSwitchInsideSameConfig(assert);
		//action
		_pressButtonOnMandatoryPopup(assert, 1, function() {
			//assert
			assert.strictEqual(restoreMemorizedConfigurationStub.calledOnce, false, "then memorized configuration editor is not restored for a reset of mandatory fields");
			assert.strictEqual(oConfigurationListView.getController().oTreeInstance.getSelection().getBindingContext().getObject().name, "test config B", "then node switch did not happen");
		});
	});
	QUnit.test("Test reset of mandatory fields, when switching between configurations, press YES on loss of data popup when switching between different configurations", function(assert) {
		//arrangement
		var oSubView;
		var successMessageOnSave = oModelerInstance.modelerCore.getText("successOnSave");
		_setupForSavedConfig();
		//action
		oSubView = oConfigurationListView.getController()._getSubView();
		oSubView.byId("idConfigTitle").setValue("change title");
		oModelerInstance.configurationEditorForSavedConfig.setIsUnsaved();
		oConfigurationListView.getController().oTreeInstance.setSelection(oConfigurationListView.getController().oTreeInstance.getNodes()[2]);
		assert.notEqual(sap.ui.getCore().byId("idMessageDialogFragment--idMessageDialog"), undefined, "then loss of data popup dialog is available");
		_pressButtonOnLossOfDataPopup(assert, 0, function() {
			//assert
			assert.strictEqual(memorizeConfigurationStub.calledTwice, true, "configuration editor is memorized while a selection is made");
			assert.strictEqual(saveConfigEditorStub.calledOnce, true, "	then configuration is saved on press of Yes on loss of data popup");
			assert.strictEqual(spyOnShowOfMsgToast.calledWith(successMessageOnSave, {
				width : "20em",
				offset : "0 -64"
			}), true, "then success toast is displayed after save");
			assert.strictEqual(resetConfigurationSpy.calledOnce, false, "then resetConfiguration is not called to reset configuration while switch to another configuration after press of YES");
			assert.strictEqual(oConfigurationListView.getController().oTreeInstance.getSelection().getBindingContext().getObject().name, "test config C", "then node switch happened after save");
		});
	});
	QUnit.test("Test reset of mandatory fields, when switching between configurations, press NO on loss of data popup when switching between different configurations", function(assert) {
		//arrangement
		var oSubView;
		_setupForSavedConfig();
		//action
		oSubView = oConfigurationListView.getController()._getSubView();
		oSubView.byId("idConfigTitle").setValue("change title");
		oModelerInstance.configurationEditorForSavedConfig.setIsUnsaved();
		oConfigurationListView.getController().oTreeInstance.setSelection(oConfigurationListView.getController().oTreeInstance.getNodes()[2]);
		assert.notEqual(sap.ui.getCore().byId("idMessageDialogFragment--idMessageDialog"), undefined, "then loss of data popup dialog is available");
		_pressButtonOnLossOfDataPopup(assert, 1, function() {
			//assert
			assert.strictEqual(memorizeConfigurationStub.calledOnce, true, "configuration editor is memorized while a selection is made");
			assert.strictEqual(saveConfigEditorStub.calledOnce, false, "then configuration is not saved on press of No on loss of data popup");
			assert.strictEqual(resetConfigurationSpy.calledOnce, true, "then resetConfiguration is called to reset configuration while switch to another configuration after press of NO");
			assert.strictEqual(oConfigurationListView.getController().oTreeInstance.getSelection().getBindingContext().getObject().name, "test config C", "then node switch happened after reset");
		});
	});
	QUnit.test("Test reset of mandatory fields, when switching between configurations, press CANCEL on loss of data popup when switching between different configurations", function(assert) {
		//arrangement
		var oSubView;
		_setupForSavedConfig();
		//action
		oSubView = oConfigurationListView.getController()._getSubView();
		oSubView.byId("idConfigTitle").setValue("change title");
		oModelerInstance.configurationEditorForSavedConfig.setIsUnsaved();
		oConfigurationListView.getController().oTreeInstance.setSelection(oConfigurationListView.getController().oTreeInstance.getNodes()[2]);
		assert.notEqual(sap.ui.getCore().byId("idMessageDialogFragment--idMessageDialog"), undefined, "then loss of data popup dialog is available");
		_pressButtonOnLossOfDataPopup(assert, 2, function() {
			//assert
			assert.strictEqual(memorizeConfigurationStub.calledOnce, true, "configuration editor is memorized while a selection is made");
			assert.strictEqual(saveConfigEditorStub.calledOnce, false, "then configuration is not saved on press of Cancel on loss of data popup");
			assert.strictEqual(resetConfigurationSpy.calledOnce, false, "then resetConfiguration is not called to reset configuration while switch to another configuration after press of Cancel");
			assert.strictEqual(oSubView.byId("idConfigTitle").getValue(), "change title", "then node switch did not happen after press of Cancel");
		});
	});
	QUnit.test("Test reset of mandatory fields, when switching between configurations, press YES on reset mandatory fields and CANCEL on loss of data popup to save current configuration before switch", function(assert) {
		//arrangement
		_setupForSwitchFromNewConfig(assert);
		//action
		_pressButtonOnMandatoryPopup(assert, 0, function() {
			assert.notEqual(sap.ui.getCore().byId("idMessageDialogFragment--idMessageDialog"), undefined, "then loss of data popup dialog is available");
			_pressButtonOnLossOfDataPopup(assert, 2, function() {
				//assert
				assert.strictEqual(restoreMemorizedConfigurationStub.calledOnce, false, "then memorized configuration editor is not restored for a reset of mandatory fields for a new view");
				assert.strictEqual(oConfigurationListView.getController().configurationHandler.getList().length, 4, "then the new configuration is not deleted and 4 configurations exist");
				assert.strictEqual(saveConfigEditorStub.calledOnce, false, "then configuration is not saved on press of Cancel on loss of data popup popup");
				assert.strictEqual(resetConfigurationSpy.calledOnce, false, "then resetConfiguration is not called to reset configuration and switch does not happen to another configuration");
				assert.strictEqual(oConfigurationListView.getController().oTreeInstance.getSelection().getBindingContext().getObject().name, "test config D", "then configuration switch did not happen since cancel was pressed");
				//cleanup
				oModelerInstance.configurationHandler.removeConfiguration(oConfigurationListView.getController().configId, _doNothing);
			});
		});
	});
}());