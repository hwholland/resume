/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfUiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerNew");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.helper");
(function() {
	QUnit.module('APF UI Reuse', {
		beforeEach : function(assert) {
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			this.oView = this.oGlobalApi.oUiApi.getStepContainer().getStepToolbar();
			this.oController = this.oView.getController();
			this.spyGetActiveStep = function() {
				this.step = {};
				this.step.title = "Step Title";
				this.step.getSelectedRepresentationInfo = function() {
					return {
						picture : "sap-icon://line-chart",
						label : {
							type : "label",
							key : "LineChart",
							kind : "text"
						}
					};
				};
				this.step.getSelectedRepresentation = function() {
					this.repObj = {};
					var selectionData = {
						id : "AR",
						text : "Argentina(AR)"
					};
					var aSelectionData = [];
					aSelectionData.push(selectionData);
					this.repObj.getSelections = function() {
						return aSelectionData;
					};
					this.repObj.getSelectionCount = function() {
						return 0;
					};
					this.repObj.removeAllSelection = function() {
						return null;
					};
					this.repObj.bIsAlternateView = false;
					this.repObj.getAlternateRepresentation = function() {
						this.altObj = {};
						this.altObj.id = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;
						this.altObj.picture = "sap-icon://table-view";
						return this.altObj;
					};
					this.repObj.getParameter = function() {
						return {
							requiredFilters : [ {
								label : "Customer"
							} ]
						};
					};
					this.repObj.getData = function() {
						return;
					};
					this.repObj.getMetaData = function() {
						this.metObj = {};
						this.metObj.getPropertyMetadata = function(x) {
							return x;
						};
						return this.metObj;
					};
					this.repObj.type = sap.apf.ui.utils.CONSTANTS.representationTypes.LINE_CHART;
					var oColumn = new sap.m.Column();
					var customDataForColumn = new sap.ui.core.CustomData({
						value : {
							text : "YearMonth",
							key : "YearMonth"
						}
					});
					oColumn.addCustomData(customDataForColumn);
					this.repObj.toggleInstance = {
						getColumnFromProperties : function() {
							return;
						},
						createViewSettingDialog : function() {
							return new sap.m.Dialog();
						},
						oTableRepresentation : new sap.m.Table({
							columns : [ oColumn ]
						}),
						setData : function() {
							return;
						},
						adoptSelection : function() {
							return;
						}
					};
					return this.repObj;
				};
				this.step.setSelectedRepresentation = function(id) {
					return id;
				};
				this.step.getRepresentationInfo = function() {
					return [ {
						picture : "sap-icon://line-chart",
						label : {
							type : "label",
							key : "LineChart",
							kind : "text"
						}
					}, {
						picture : "sap-icon://bar-chart",
						label : {
							type : "label",
							key : "ColumnChart",
							kind : "text"
						}
					} ];
				};
				return this.step;
			};
			this.spyGetStepContainer = function() {
				this.contObj = {};
				this.contObj.getController = function() {
					this.obj = {};
					this.obj.drawStepContent = function() {
						return null;
					};
					this.obj.createAlternateRepresentation = function() {
						return null;
					};
					return this.obj;
				};
				return this.contObj;
			};
			this.spyGetStepTemplates = function() {
				var stepTemplates = [ {
					title : "Step Title",
					getRepresentationInfo : function() {
						var repInfo = [ {
							label : "lineChart",
							picture : "sap-icon://line-chart"
						}, {
							label : "columnChart",
							picture : "sap-icon://bar-chart"
						} ];
						return repInfo;
					}
				} ];
				return stepTemplates;
			};
			this.spyGetActiveStep1 = function() {
				this.step = {};
				this.step.title = "Step Title";
				this.step.getSelectedRepresentationInfo = function() {
					return {
						picture : "sap-icon://line-chart",
						label : {
							type : "label",
							key : "LineChart",
							kind : "text"
						}
					};
				};
				this.step.getSelectedRepresentation = function() {
					this.repObj = {};
					var aSelectionData = [];
					this.repObj.getSelections = function() {
						return aSelectionData;
					};
					this.repObj.getSelectionCount = function() {
						return 0;
					};
					this.repObj.removeAllSelection = function() {
						return null;
					};
					this.repObj.bIsAlternateView = false;
					var oColumn = new sap.m.Column();
					var customDataForColumn = new sap.ui.core.CustomData({
						value : {
							text : "YearMonth",
							key : "YearMonth"
						}
					});
					oColumn.addCustomData(customDataForColumn);
					this.repObj.oTableRepresentation = new sap.m.Table({
						columns : [ oColumn ]
					});
					this.repObj.getAlternateRepresentation = function() {
						this.altObj = {};
						this.altObj.id = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;
						return this.altObj;
					};
					this.repObj.getParameter = function() {
						return {
							requiredFilters : [ {
								label : null
							} ]
						};
					};
					this.repObj.getData = function() {
						return;
					};
					this.repObj.getMetaData = function() {
						return undefined;
					};
					this.repObj.type = sap.apf.ui.utils.CONSTANTS.representationTypes.LINE_CHART;
					return this.repObj;
				};
				this.step.setSelectedRepresentation = function(id) {
					return id;
				};
				this.step.getRepresentationInfo = function() {
					return [ 2 ];
				};
				return this.step;
			};
			this.spyGetActiveStep0 = function() {
				this.step = {};
				this.step.title = "Step Title";
				this.step.getSelectedRepresentationInfo = function() {
					return {
						picture : "sap-icon://line-chart",
						label : {
							type : "label",
							key : "LineChart",
							kind : "text"
						}
					};
				};
				this.step.getSelectedRepresentation = function() {
					this.repObj = {};
					var aSelectionData = [];
					this.repObj.getSelections = function() {
						return aSelectionData;
					};
					this.repObj.getSelectionCount = function() {
						return 0;
					};
					this.repObj.removeAllSelection = function() {
						return null;
					};
					this.repObj.bIsAlternateView = false;
					this.repObj.getAlternateRepresentation = function() {
						this.altObj = {};
						this.altObj.id = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;
						return this.altObj;
					};
					this.repObj.getParameter = function() {
						return {
							requiredFilters : [ {
								label : "Customer"
							} ]
						};
					};
					this.repObj.getData = function() {
						return;
					};
					this.repObj.getMetaData = function() {
						this.metObj = {};
						this.metObj.getPropertyMetadata = function(x) {
							return x;
						};
						return this.metObj;
					};
					this.repObj.type = sap.apf.ui.utils.CONSTANTS.representationTypes.LINE_CHART;
					return this.repObj;
				};
				this.step.setSelectedRepresentation = function(id) {
					return id;
				};
				this.step.getRepresentationInfo = function() {
					return [ 2 ];
				};
				return this.step;
			};
			sinon.stub(this.oGlobalApi.oCoreApi, 'createMessageObject', function(assert) {
			});
			sinon.stub(this.oGlobalApi.oCoreApi, 'putMessage', function(assert) {
			});
		},
		afterEach : function() {
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.OriginalSessionHandler;
			this.oGlobalApi.oCoreApi.putMessage.restore();
			this.oGlobalApi.oCoreApi.createMessageObject.restore();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test('Step Toolbar API availability', function(assert) {
		assert.ok(typeof this.oView === "object", "Step Toolbar View available");
		assert.ok(typeof this.oController === "object", "Step Toolbar Controller available");
	});
	QUnit.test('Step Toolbar Functionality: insertContentLeft', function(assert) {
		assert.ok(typeof this.oController.insertContentLeft === "function", "insertContentLeft Available");
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		this.oController.insertContentLeft();
		var leftContent = this.oView.chartToolbar.getToolBar().getContentLeft();
		var rightContent = this.oView.chartToolbar.getToolBar().getContentRight();
		assert.equal(rightContent[0].getText(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("resetSelection"), "Reset Selection link Added to Toolbar");
		rightContent[0].firePress();
		assert.ok(leftContent[3].hasStyleClass('showSelection'), "Selected Number End Text Added to Toolbar");
		assert.ok(leftContent[2].hasStyleClass('showSelection'), "Selected Number Link Added to Toolbar");
		assert.ok(leftContent[1].hasStyleClass('showSelection'), "Selected Number Added to Toolbar");
		assert.ok(leftContent[0].hasStyleClass('currentStep'), "Current Anaysis Step text is added to Toolbar");
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
	});
	QUnit.test('Step Toolbar Functionality: showSelectionCount', function(assert) {
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		this.oController.insertContentLeft();
		this.oController.showSelectionCount();
		assert.ok(typeof this.oController.showSelectionCount === "function", "showSelectionCount API available");
		assert.equal(this.oController.selectedNumber.getText(), "(" + this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("selected-objects", [ "Customer" ]), "Selection Number Label available");
		assert.equal(this.oController.selectedNumberLink.getText(), 1, "Selected number available");
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep1);
		this.oController.insertContentLeft();
		this.oController.showSelectionCount();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep0);
		this.oController.insertContentLeft();
		this.oController.showSelectionCount();
		assert.equal(this.oController.selectedNumber.getText(), "", "Selection Number Label is not shown since selectionCount is 0 and metadata is not available");
		assert.equal(this.oController.selectedNumberLink.getText(), "", "Selected number count not available since selectionCount is 0");
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
	});
	QUnit.test('Step Toolbar Functionality: drawAlternateRepresentation', function(assert) {
		this.spyGetAnalysisPath = function() {
			this.obj = {};
			this.obj.getCarousel = function() {
				this.obj2 = {};
				this.obj2.getStepView = function() {
					this.obj3 = {};
					this.obj3.getController = function() {
						this.obj4 = {};
						this.obj4.drawThumbnailContent = function() {
							return null;
						};
						return this.obj4;
					};
					return this.obj3;
				};
				return this.obj2;
			};
			this.obj.getController = function() {
				return {
					refresh : function() {
						return null;
					}
				};
			};
			return this.obj;
		};
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		assert.ok(typeof this.oController.drawAlternateRepresentation === "function", "drawAlternateRepresentation API Available");
		this.oController.drawAlternateRepresentation();
		assert.equal(this.oView.chartToolbar.getToolBar().getContentRight()[0].getIcon(), "sap-icon://table-view", "Alternate Representation Icon is added to the toolbar");
		assert.equal(this.oView.chartToolbar.getToolBar().getContentRight()[1].getIcon(), "sap-icon://drop-down-list", "View settings Icon added to the toolbar");
		sinon.stub(this.oGlobalApi.oUiApi, "getStepContainer", this.spyGetStepContainer);
		sinon.stub(this.oGlobalApi.oUiApi, 'getAnalysisPath', this.spyGetAnalysisPath);
		this.oController.alternateRepresentationBtn.firePress();
		this.oGlobalApi.oUiApi.getStepContainer.restore();
		this.oGlobalApi.oUiApi.getAnalysisPath.restore();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
	});
	QUnit.test('Step Toolbar Functionality: drawSingleRepresentation ', function(assert) {
		this.spyGetAnalysisPath = function() {
			this.obj = {};
			this.obj.getCarousel = function() {
				this.obj2 = {};
				this.obj2.getStepView = function() {
					this.obj3 = {};
					this.obj3.getController = function() {
						this.obj4 = {};
						this.obj4.drawThumbnailContent = function() {
							return null;
						};
						return this.obj4;
					};
					return this.obj3;
				};
				return this.obj2;
			};
			return this.obj;
		};
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		assert.ok(typeof this.oController.drawSingleRepresentation === "function", "drawSingleRepresentation API available");
		this.oController.drawSingleRepresentation();
		assert.equal(this.oView.chartToolbar.getToolBar().getContentRight()[0].getText(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("resetSelection"), "Deselection link is added");
		assert.equal(this.oView.chartToolbar.getToolBar().getContentRight()[1].getIcon(), "sap-icon://line-chart", "Single Representation Button added to Chart Toolbar");
		sinon.stub(this.oGlobalApi.oUiApi, "getStepContainer", this.spyGetStepContainer);
		sinon.stub(this.oGlobalApi.oUiApi, 'getAnalysisPath', this.spyGetAnalysisPath);
		this.oView.chartToolbar.getToolBar().getContentRight()[1].firePress();
		assert.equal(this.oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation().bIsAlternateView, false, "Draw Step Content called");
		this.oGlobalApi.oUiApi.getStepContainer.restore();
		this.oGlobalApi.oUiApi.getAnalysisPath.restore();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
	});
	QUnit.test('Step Toolbar Functionality: drawMultipleRepresentation', function(assert) {
		assert.ok(typeof this.oController.drawMultipleRepresentation === "function", "drawMultipleRepresentation API available");
		var self = this;
		this.getStepsCalled = false;
		this.spyGetSteps = function() {
			this.indexOf = function(x) {
				return 1;
			};
			self.getStepsCalled = true;
			this.step = {};
			this.step.title = "Step Title";
			this.step.getSelectedRepresentation = function() {
				var obj = {};
				obj.bIsAlternateView = false;
				return obj;
			};
			this.step.setSelectedRepresentation = function(id) {
				return id;
			};
			return [ this.step ];
		};
		this.spyGetAnalysisPath = function() {
			this.obj = {};
			this.obj.getController = function() {
				this.obj1 = {};
				this.obj1.refresh = function() {
					return null;
				};
				this.obj1.callBackForUpdatePath = function(x) {
					return x;
				};
				return this.obj1;
			};
			return this.obj;
		};
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		sinon.stub(this.oGlobalApi.oCoreApi, 'getStepTemplates', this.spyGetStepTemplates);
		sinon.stub(this.oGlobalApi.oCoreApi, 'getSteps', this.spyGetSteps);
		sinon.stub(this.oGlobalApi.oUiApi, 'getAnalysisPath', this.spyGetAnalysisPath);
		this.oController.drawMultipleRepresentation();
		assert.ok(this.getStepsCalled, "Chart is added to Icon list for multiple Representations");
		var rightContent = this.oView.chartToolbar.getToolBar().getContentRight();
		assert.equal(rightContent[0].getText(), this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("resetSelection"), "Deselection link is added to toolbar");
		assert.equal(rightContent[1].getIcon(), "sap-icon://line-chart", "First Representation Icon added to Popover");
		assert.equal(rightContent[2].getIcon(), "sap-icon://bar-chart", "Second Representation Icon added to Popover");
		assert.equal(rightContent[3].getIcon(), "sap-icon://line-chart", "Selected Representation Button added to Step Toolbar");
		rightContent[1].firePress();
		var activeStep = this.spyGetActiveStep();
		var evt = {};
		evt.getParameter = function(a) {
			var listObj = {};
			listObj.getCustomData = function() {
				var newObj = {};
				newObj.getValue = function() {
					return {
						nActiveStepIndex : 0,
						oCurrentActiveStep : activeStep,
						oRepresentationType : {
							representationId : "id",
							label : {
								type : "label",
								key : "LineChart",
								kind : "text"
							}
						}
					};
				};
				var arr = [ newObj ];
				return arr;
			};
			return listObj;
		};
		this.oController.openList(evt);
		this.oGlobalApi.oCoreApi.getSteps.restore();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		this.oGlobalApi.oCoreApi.getStepTemplates.restore();
		this.oGlobalApi.oUiApi.getAnalysisPath.restore();
	});
	QUnit.test('Step Toolbar Functionality: drawToolbar', function(assert) {
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		this.oController.drawToolBar();
		assert.ok(typeof this.oController.showAndHideIcons === "function", "showAndHideIcons() is available");
		assert.ok(typeof this.oController.renderIcons === "function", "renderIcons() is available");
		sinon.stub(this.oGlobalApi.oCoreApi, 'getStepTemplates', this.spyGetStepTemplates);
		this.oController.renderIcons();
		this.oController.isSwitchRepresentation = true;
		this.oController.renderIcons();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		this.oGlobalApi.oCoreApi.getStepTemplates.restore();
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep0);
		this.oController.showAndHideIcons();
		this.oController.chartIconInserted = false;
		this.oController.renderIcons();
		this.oController.showAndHideIcons();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep1);
		this.oController.viewSettingsIcon = false;
		this.oController.renderIcons();
		this.oView.chartToolbar.setShowLegend(false);
		this.oController.renderIcons();
		this.oController.showAndHideIcons();
		sinon.stub(this.oView.chartToolbar, 'rerender', function(assert) {
		});
		sinon.stub(this.oView.chartToolbar, 'getFullScreen', function(assert) {
			return true;
		});
		this.oController.showAndHideIcons();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		this.oView.chartToolbar.rerender.restore();
		this.oView.chartToolbar.getFullScreen.restore();
	});
	QUnit.test('Step Toolbar Functionality: drawRepresentation', function(assert) {
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		this.calledOnce = false;
		var self = this;
		this.spyInsertChart = function() {
			self.calledOnce = true;
		};
		sinon.stub(this.oView.chartToolbar, "insertChart", this.spyInsertChart);
		this.oController.drawRepresentation();
		sinon.stub(this.oView.chartToolbar, 'rerender', function(assert) {
		});
		sinon.stub(this.oView.chartToolbar, 'getFullScreen', function(assert) {
			return true;
		});
		this.oController.drawRepresentation();
		assert.ok(this.calledOnce, 'Chart inserted using drawRepresentation API');
		this.oView.chartToolbar.insertChart.restore();
		this.oView.chartToolbar.rerender.restore();
		this.oView.chartToolbar.getFullScreen.restore();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
	});
	QUnit.test('Step Toolbar Functionality: insertViewSettingsIcon', function(assert) {
		this.spyGetActiveStep0 = function() {
			this.getSelectedRepresentationInfo = function() {
				return {
					picture : "sap-icon://line-chart",
					label : {
						type : "label",
						key : "LineChart",
						kind : "text"
					}
				};
			};
			this.getSelectedRepresentation = function() {
				this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;
				this.getColumnFromProperties = function() {
					return;
				};
				var oColumn = new sap.m.Column();
				var customDataForColumn = new sap.ui.core.CustomData({
					value : {
						text : "YearMonth",
						key : "YearMonth"
					}
				});
				oColumn.addCustomData(customDataForColumn);
				this.oTableRepresentation = new sap.m.Table({
					columns : [ oColumn ]
				});
				this.createViewSettingDialog = function() {
					var oDialog = new sap.m.Dialog({
						endButton : new sap.m.Button()
					});
					oDialog.getEndButton().attachPress(function() {
						oDialog.close();
					});
					return oDialog;
				};
				return this;
			};
			return this;
		};
		var spy1 = sinon.spy(this.spyGetActiveStep0);
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', spy1);
		this.oController.isTableRepresentation = false;
		this.oController.insertViewSettingsIcon();
		assert.equal(this.oView.chartToolbar.getToolBar().getContentRight()[0].getIcon(), "sap-icon://drop-down-list", "ViewSettings button added to stepToolbar");
		this.oView.chartToolbar.getToolBar().getContentRight()[0].firePress();
		assert.equal(spy1.called, true, "Toggled instance, viewSettings dialog open() is called");
		this.oController.isTableRepresentation = true;
		this.oView.chartToolbar.getToolBar().getContentRight()[0].firePress();
		assert.equal(spy1.called, true, "Table representation, viewSettings dialog open() is called");
		var viewSettingDialogInstance = sap.ui.getCore().byId(jQuery(".sapMDialog")[0].getAttribute("id"));
		viewSettingDialogInstance.getEndButton().firePress();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
	});
})();