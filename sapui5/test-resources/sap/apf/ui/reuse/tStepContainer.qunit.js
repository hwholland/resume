/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.declare('test.sap.apf.ui.tInstance');
jQuery.sap.require("sap.apf.testhelper.interfaces.IfUiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerNew");
jQuery.sap.require("sap.apf.testhelper.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
(function() {
	QUnit.module('APF UI', {
		beforeEach : function(assert) {
			sap.apf.testhelper.doubles.OriginalSessionHandler = sap.apf.core.SessionHandler;
			sap.apf.core.SessionHandler = sap.apf.testhelper.doubles.SessionHandlerNew;
			this.oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			this.oView = this.oGlobalApi.oUiApi.getStepContainer();
			this.oController = this.oView.getController();
			this.spyGetTextEncoded = function(x) {
				return x;
			};
			this.spyGetSteps = function() {
				this.indexOf = function() {
					return 3;
				};
				return this;
			};
			this.stepToolbarDrawRepCalled = false;
			var self = this;
			this.spyDrawRepresentation = function() {
				self.stepToolbarDrawRepCalled = true;
			};
			this.getParameterCalledOnce = false;
			this.getMainContentCalled = false;
			this.getDataCalled = false;
			this.getMetadataCalled = false;
			this.spyGetActiveStep = function() {
				this.title = "Step Title";
				this.longTitle = "Long Step Title";
				this.getSelectedRepresentationInfo = function() {
					this.picture = "sap-icon://line-chart";
					this.representationId = "lineChart";
					return this;
				};
				this.getSelectedRepresentation = function() {
					this.type = "lineChart";
					this.getMainContent = function() {
						self.getMainContentCalled = true;
						this.addEventDelegate = function() {
						};
						this.setHeight = function() {
						};
						this.setWidth = function() {
						};
						return this;
					};
					this.getAlternateRepresentation = function() {
						this.picture = "sap-icon://table-chart";
						return this;
					};
					this.bIsAlternateView = false;
					this.getSelections = function(){
						return [];
					};
					this.getSelectionCount = function(){
						return 0;
					};
					this.getParameter = function() {
						self.getParameterCalledOnce = true;
						this.requiredFilters = [ {
							label : "Customer"
						} ];
						this.dimensions = [ {
							fieldName : "FirstDimension",
							fieldDesc : {
								type : "label",
								kind : "text",
								key : "FirstDimensionKey"
							}
						} ]; 
						this.alternateRepresentationType = "sap.apf.ui.representations.table"
						return this;
					};
					this.getData = function() {
						self.getDataCalled = true;
					};
					this.setData = function() {
						self.setDataCalled = true;
					};
					this.getMetaData = function() {
						self.getMetadataCalled = true;
						this.getPropertyMetadata = function(x) {
							return x;
						};
						return this;
					};
					return this;
				};
				this.length = 2;
				return this;
			};
			this.spyGetActiveStep0 = function() {
				this.title = "Step Title";
				this.longTitle = "Long Step Title";
				this.getSelectedRepresentationInfo = function() {
					this.picture = "sap-icon://line-chart";
					this.representationId = "lineChart";
					return this;
				};
				this.getSelectedRepresentation = function() {
					this.type = "lineChart";
					this.getMainContent = function() {
						self.getMainContentCalled = true;
						this.addEventDelegate = function() {
						};
						this.setHeight = function() {
						};
						this.setWidth = function() {
						};
						return this;
					};
					this.getAlternateRepresentation = function() {
						this.picture = "sap-icon://table-chart";
						return this;
					};
					this.bIsAlternateView = true;
					this.getParameter = function() {
						self.getParameterCalledOnce = true;
						this.requiredFilters = [ {
							label : "Customer"
						} ];
						this.dimensions = [ {
							fieldName : "FirstDimension",
							fieldDesc : {
								type : "label",
								kind : "text",
								key : "FirstDimensionKey"
							}
						} ];
						this.alternateRepresentationType = {
							constructor : "sap.apf.ui.representations.table"
						};
						return this;
					};
					this.getData = function() {
						self.getDataCalled = true;
					};
					this.getMetaData = function() {
						self.getMetadataCalled = true;
						this.getPropertyMetadata = function(x) {
							if (x === "FirstDimension") {
								return x = {
									text : "dummy"
								};
							} else {
								return x;
							}
						};
						return this;
					};
					this.toggleInstance = {
						viewSettingsDialog : {
							open : function() {
								return "";
							}
						},
						getMainContent : function() {
							var obj = {};
							self.getMainContentCalled = true;
							obj.addEventDelegate = function() {
							};
							obj.getContent = function() {
								var arr = [];
								var obj1 = {};
								obj1.setHeight = function() {
								};
								obj1.setWidth = function() {
								};
								arr.push(obj1);
								return arr;
							};
							return obj;
						},
						setData : function() {
							return "";
						}
					};
					return this;
				};
				return this;
			};
			this.spyGetStep = function() {
				var stepsArray = [];
				var obj = {};
				obj.indexOf = function() {
					return 3;
				};
				obj.getSelectedRepresentation = function() {
					var obj1 = {};
					obj1.getParameter = function() {
						self.getParameterCalledOnce = true;
						var obj2 = {};
						obj2.requiredFilters = [ {
							label : "Customer"
						} ];
						obj2.dimensions = [ {
							fieldName : "FirstDimension",
							fieldDesc : {
								type : "label",
								kind : "text",
								key : "FirstDimensionKey"
							}
						} ], obj2.alternateRepresentationType = {
							constructor : "sap.apf.ui.representations.table"
						};
						return obj2;
					};
					obj1.getData = function() {
						self.getDataCalled = true;
					};
					obj1.getMetaData = function() {
						self.getMetadataCalled = true;
						var obj3 = {};
						obj3.getPropertyMetadata = function(x) {
							if (x === "FirstDimension") {
								return x = {
									text : "dummy"
								};
							} else {
								return x;
							}
						};
						return obj3;
					};
					return obj1;
				};
				stepsArray.push(obj);
				return stepsArray;
			};
			this.spyGetActiveStep1 = function() {
				this.title = "Step Title";
				this.longTitle = "Long Step Title";
				this.getSelectedRepresentationInfo = function() {
					this.picture = "sap-icon://line-chart";
					this.representationId = "lineChart";
					return this;
				};
				this.getSelectedRepresentation = function() {
					this.type = "GeoMap";
					this.getMainContent = function() {
						self.getMainContentCalled = true;
						this.addEventDelegate = function() {
						};
						this.getContent = function() {
							this.div = document.createElement("div");
							this.div.style = {
								height : ""
							};
							this.div.style = {
								width : ""
							};
							return this.div;
						};
						this.setContent = function(html) {
							return html;
						};
						return this;
					};
					this.bIsAlternateView = false;
					this.getAlternateRepresentation = function() {
						this.picture = "sap-icon://table-chart";
						return this;
					};
					this.getParameter = function() {
						self.getParameterCalledOnce = true;
						this.requiredFilters = [ {
							label : "Customer"
						} ];
						this.dimensions = [ {
							fieldName : "FirstDimension",
							fieldDesc : {
								type : "label",
								kind : "text",
								key : "FirstDimensionKey"
							}
						} ], this.alternateRepresentationType = {
							constructor : "sap.apf.ui.representations.table"
						};
						return this;
					};
					this.getData = function() {
						self.getDataCalled = true;
					};
					this.getMetaData = function() {
						return undefined;
					};
					return this;
				};
				return this;
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
	QUnit.test('Step Container API availability', function(assert) {
		assert.ok(typeof this.oView === "object", "Step Container View available");
		assert.ok(typeof this.oController === "object", "Step Container Controller available");
		assert.ok(typeof this.oView.getStepToolbar === "function", "Step Toolbar API available");
	});
	QUnit.test('Step Container Functionality: drawSelectionContainer', function(assert) {
		var calledShowSelectionCount = false;
		var spyShowSelectionCount = function() {
			calledShowSelectionCount = true;
			return null;
		};
		sinon.stub(this.oView.getStepToolbar().getController(), 'showSelectionCount', spyShowSelectionCount);
		assert.ok(typeof this.oController.drawSelectionContainer === "function", 'drawSelectionContainer alive');
		this.oController.drawSelectionContainer();
		assert.ok(calledShowSelectionCount, "drawSelection Container Called showSelectionCount");
		this.oView.getStepToolbar().getController().showSelectionCount.restore();
	});
	QUnit.test('Step Container Functionality: drawRepresentation ', function(assert) {
		assert.expect(5);
		var done = assert.async();
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		sinon.stub(this.oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', this.spyGetTextEncoded);
		sinon.stub(this.oView.getStepToolbar().getController(), 'drawRepresentation', this.spyDrawRepresentation);
		var detailTitleSet = false;
		var spyGetLayoutView = function() {
			this.getController = function() {
				this.setDetailTitle = function() {
					detailTitleSet = true;
				};
				return this;
			};
			return this;
		};
		sinon.stub(this.oGlobalApi.oUiApi, 'getLayoutView', spyGetLayoutView);
		assert.ok(typeof this.oController.drawRepresentation === "function", "drawRepresentation alive");
		this.oController.drawRepresentation();
		this.oController.setHeightAndWidth();
		var repInstnc = this.oController.getCurrentRepresentation();
		assert.notEqual(repInstnc, undefined, "getCurrentRepresentation() returns the representation instance");
		assert.ok(typeof this.oController.drawRepresentation === "function", "API drawRepresentation available");
		assert.ok(this.getMainContentCalled, "getMainContent called on selected Representation");
		assert.ok(this.stepToolbarDrawRepCalled, "drawRepresentation in Step toolbar Called");
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep0);
		this.oController.drawRepresentation();
		this.oController.setHeightAndWidth();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep1);
		this.div = this.oGlobalApi.oCoreApi.getActiveStep().getSelectedRepresentation().getMainContent();
		this.oController.drawRepresentation();
		this.oController.setHeightAndWidth();
		this.oView.getStepToolbar().placeAt('content');
		var self = this;
		setTimeout(function() {
			self.oController.setHeightAndWidth();
			self.oView.getStepToolbar().getController().drawRepresentation.restore();
			self.oGlobalApi.oUiApi.getLayoutView.restore();
			self.oGlobalApi.oCoreApi.getActiveStep.restore();
			self.oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
			done();
		}, 200);
	});
	QUnit.test('Step Container Functionality: createAlternateRepresentation', function(assert) {
		assert.ok(typeof this.oController.createAlternateRepresentation === "function", "API createAlternateRepresentation available");
		sinon.stub(this.oGlobalApi.oCoreApi, 'getSteps', this.spyGetStep);
		sinon.stub(this.oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', this.spyGetTextEncoded);
		this.oController.createAlternateRepresentation(0);
		assert.ok(this.getParameterCalledOnce, "Parameters for alternate Representation set");
		assert.ok(this.getDataCalled, "getData for Current Representation Called");
		assert.ok(this.getMetadataCalled, "getMetadata called for Current Representation");
		this.oGlobalApi.oCoreApi.getSteps.restore();
		this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
	});
	QUnit.test('Step Container Functionality: isActiveStepChanged', function(assert) {
		sinon.stub(this.oGlobalApi.oCoreApi, 'getSteps', this.spyGetSteps);
		assert.ok(typeof this.oController.isActiveStepChanged === "function", "isActiveStepChanged API alive");
		this.oController.currentActiveStepIndex = undefined;
		var out1 = this.oController.isActiveStepChanged();
		assert.ok(out1, "bActiveStepChange is true");
		this.oController.currentActiveStepIndex = 2;
		var out2 = this.oController.isActiveStepChanged();
		assert.ok(out2, "Current step is not Active step bActiveStepChanged is true");
		this.oController.currentActiveStepIndex = 3;
		var out3 = this.oController.isActiveStepChanged();
		assert.ok(!out3, "Current step is Active step bActiveStepChanged is false");
		this.oGlobalApi.oCoreApi.getSteps.restore();
	});
	QUnit.test('Step Container Functionality: isSelectedRepresentationChanged', function(assert) {
		assert.ok(this.oController.isSelectedRepresentationChanged, 'isSelectedRepresentationChanged alive');
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		this.oController.currentSelectedRepresentationId = undefined;
		var out1 = this.oController.isSelectedRepresentationChanged();
		assert.ok(out1, "Selected representation changed to Current representation");
		this.oController.currentSelectedRepresentationId = "ColumnChart";
		var out2 = this.oController.isSelectedRepresentationChanged();
		assert.ok(out2, "Selected representation id changed from different representation id");
		var spyGetCurrentRep = function() {
			this.type = "columnChart";
			return this;
		};
		sinon.stub(this.oController, 'getCurrentRepresentation', spyGetCurrentRep);
		this.oController.currentSelectedRepresentationId = "lineChart";
		var out3 = this.oController.isSelectedRepresentationChanged();
		assert.ok(out3, "Selected representation changed from different representation type");
		this.oController.getCurrentRepresentation.restore();
		var spyGetCurrentRep2 = function() {
			this.type = "lineChart";
			return this;
		};
		sinon.stub(this.oController, 'getCurrentRepresentation', spyGetCurrentRep2);
		this.oController.currentSelectedRepresentationId = "lineChart";
		var out4 = this.oController.isSelectedRepresentationChanged();
		assert.ok(!out4, "Selected representation is Current representation");
		this.oController.getCurrentRepresentation.restore();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
	});
	QUnit.test('Step Container Functionality: drawStepContent', function(assert) {
		assert.ok(this.oController.drawStepContent, "drawStepContent alive");
		sinon.stub(this.oGlobalApi.oCoreApi, 'getSteps', this.spyGetSteps);
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		sinon.stub(this.oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', this.spyGetTextEncoded);
		var getStepViewCalled = false;
		var spyGetAnalysisPath = function() {
			this.getCarousel = function() {
				this.getStepView = function(x) {
					this.oThumbnailChartLayout = new sap.ui.layout.VerticalLayout();
					getStepViewCalled = true;
					return this;
				};
				return this;
			};
			this.getController = function() {
				this.isOpenPath = false;
				this.isNewPath = false;
				return this;
			};
			return this;
		};
		var drawRepCalled = false;
		var spyDRep = function() {
			drawRepCalled = true;
		};
		sinon.stub(this.oGlobalApi.oUiApi, 'getAnalysisPath', spyGetAnalysisPath);
		sinon.stub(this.oController, 'drawRepresentation', spyDRep);
		this.oController.drawStepContent();
		sinon.stub(this.oController, 'isActiveStepChanged', function(assert) {
			return false;
		})
		sinon.stub(this.oController, 'isSelectedRepresentationChanged', function(assert) {
			return false;
		})
		this.oController.drawStepContent(false);
		assert.ok(getStepViewCalled, "Thumbnail Busy indicator triggered");
		assert.ok(drawRepCalled, "drawRepresentation called");
		// negative tests
		this.oGlobalApi.oUiApi.getAnalysisPath.restore();
		var spyGetAnalysisPath0 = function() {
			this.getCarousel = function() {
				this.getStepView = function(x) {
					this.oThumbnailChartLayout = new sap.ui.layout.VerticalLayout();
					this.oThumbnailChartLayout.setBusy(true);
					getStepViewCalled = true;
					return this;
				};
				return this;
			};
			return this;
		};
		sinon.stub(this.oGlobalApi.oUiApi, 'getAnalysisPath', spyGetAnalysisPath0);
		this.oController.drawStepContent();
		this.oController.isActiveStepChanged.restore();
		this.oController.isSelectedRepresentationChanged.restore();
		this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		this.oController.drawRepresentation.restore();
		this.oGlobalApi.oUiApi.getAnalysisPath.restore();
		this.oGlobalApi.oCoreApi.getSteps.restore();
	});
	QUnit.test("resizeContent() test", function(assert) {
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep);
		sinon.stub(this.oController, 'drawStepContent', function(assert) {
		});
		sinon.stub(this.oGlobalApi.oCoreApi, 'getTextNotHtmlEncoded', this.spyGetTextEncoded);
		this.oController.resizeContent();
		this.oGlobalApi.oCoreApi.getActiveStep.restore();
		this.getMainContentCalled = true;
		this.spyGetActiveStep2 = function() {
			this.title = "Step Title";
			this.longTitle = "Long Step Title";
			this.getSelectedRepresentationInfo = function() {
				this.picture = "sap-icon://line-chart";
				this.representationId = "lineChart";
				return this;
			};
			this.getSelectedRepresentation = function() {
				this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;
				this.getMainContent = function() {
					self.getMainContentCalled = true;
					this.addEventDelegate = function() {
					};
					this.getContent = function() {
						this.div = document.createElement("div");
						this.div.style = {
							height : ""
						};
						this.div.style = {
							width : ""
						};
						return this.div;
					};
					this.setContent = function(html) {
						return html;
					};
					return this;
				};
				this.bIsAlternateView = false;
				this.getAlternateRepresentation = function() {
					this.picture = "sap-icon://table-chart";
					return this;
				};
				this.getSelections = function(){
					return [];
				};
				this.getSelectionCount = function(){
					return 0;
				};
				this.getParameter = function() {
					self.getParameterCalledOnce = true;
					this.requiredFilters = [ {
						label : "Customer"
					} ];
					this.dimensions = [ {
						fieldName : "FirstDimension",
						fieldDesc : {
							type : "label",
							kind : "text",
							key : "FirstDimensionKey"
						}
					} ], this.alternateRepresentationType = {
						constructor : "sap.apf.ui.representations.table"
					};
					return this;
				};
				this.getData = function() {
					self.getDataCalled = true;
				};
				this.getMetaData = function() {
					return undefined;
				};
				return this;
			};
			return this;
		};
		sinon.stub(this.oGlobalApi.oCoreApi, 'getActiveStep', this.spyGetActiveStep2);
		var fnJqueryRestore = jQuery;
		jQuery = function() {
			return {
				offset : function() {
					return {
						top : 0
					}
				},
				css : function() {
				}
			}
		}
		assert.equal(this.getMainContentCalled, true, "getActiveStep() is called");
		this.oController.resizeContent();
		this.oController.drawStepContent.restore();
		this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded.restore();
		jQuery = fnJqueryRestore;
	});
})();
