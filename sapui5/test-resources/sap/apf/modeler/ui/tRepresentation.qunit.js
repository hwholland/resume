jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
(function() {
	'use strict';
	QUnit.module("Representation Unit Tests", {
		beforeEach : function(assert) {
			var self = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				self.oModelerInstance = oModelerInstance;//Modeler instance from callback
				self.oFooterBar = new sap.m.Bar();
				self.representationView = sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.representation",
					type : "XML",
					viewData : {
						updateConfigTree : self.oModelerInstance.updateConfigTree,
						updateSelectedNode : self.oModelerInstance.updateSelectedNode,
						updateTree : self.oModelerInstance.updateTree,
						updateTitleAndBreadCrumb : self.oModelerInstance.updateTitleAndBreadCrumb,
						oConfigurationHandler : self.oModelerInstance.configurationHandler,
						oApplicationHandler : self.oModelerInstance.applicationHandler,
						oConfigurationEditor : self.oModelerInstance.configurationEditorForUnsavedConfig,
						getText : self.oModelerInstance.modelerCore.getText,
						getEntityTypeMetadata : self.oModelerInstance.configurationEditorForUnsavedConfig.getEntityTypeMetadata,
						getRepresentationTypes : self.oModelerInstance.configurationEditorForUnsavedConfig.getRepresentationTypes,
						sCurrentChartType : "ColumnChart",
						oFooter : self.oFooterBar,
						oParams : {
							name : "representation",
							arguments : {
								configId : self.oModelerInstance.tempUnsavedConfigId,
								categoryId : self.oModelerInstance.categoryIdUnsaved,
								stepId : self.oModelerInstance.stepIdUnsavedWithoutFilterMapping,
								representationId : self.oModelerInstance.firstRepresentationIdUnsaved
							}
						}
					}
				});
				self.representationController = self.representationView.getController();
				self.sortDataItems = self.representationView.byId("idSortLayout").getItems();
				self.basicDataItems = self.representationView.byId("idBasicDataLayout").getItems();
				self.oBasicDataEvent = { //event stub for the add/delete basic property row in the representation
					getSource : function() {
						var selectedItem = {};
						selectedItem.getBindingContext = function() {
							var obj = {};
							obj.getObject = function() {
								return {
									aAllProperties : [ {
										sAggregationRole : "dimension",
										sDefaultLable : "dimensionproperty2",
										sLabel : "Label",
										sName : "property2"
									} ],
									nMax : "*",
									nMin : "1",
									sAggregationRole : "dimension",
									sKind : "xAxis",
									sLabel : "dimensionproperty2",
									sSelectedProperty : "property2"
								};
							};
							obj.getPath = function() {
								return "/aPropertyRows/0";
							};
							obj.getProperty = function() {
								return "dimension";
							};
							return obj;
						};
						selectedItem.getSelectedKey = function() {
							return "property2";
						};
						selectedItem.getParent = function() {
							return self.basicDataItems[0];
						};
						return selectedItem;
					}
				};
				self.oSortDataPropertyEvent = { //event stub for the add/delete sort property row in the representation
					getSource : function() {
						var selectedItem = {};
						selectedItem.getBindingContext = function() {
							var obj = {};
							obj.getObject = function() {
								return {
									aAllProperties : [ {
										sAggregationRole : "dimension",
										sDefaultLable : "dimensionproperty2",
										sLabel : "Label",
										sName : "property2"
									} ]
								};
							};
							obj.getPath = function() {
								return "/aSortRows/0";
							};
							obj.getProperty = function() {
								return "property3";
							};
							return obj;
						};
						selectedItem.getSelectedKey = function() {
							return "property3";
						};
						selectedItem.getParent = function() {
							return this.sortDataItems[0];
						};
						return selectedItem;
					}
				};
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			this.oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		}
	});
	QUnit.test("Test _insertPreviewButtonInFooter for representation", function(assert) {
		this.representationController._insertPreviewButtonInFooter();
		assert.equal(this.oFooterBar.getContentRight()[0].getText(), this.oModelerInstance.modelerCore.getText("preview"), "Preview button added to the bar");
	});
	QUnit.test("Test _removePreviewButtonFromFooter for representation", function(assert) {
		this.representationController._removePreviewButtonFromFooter();
		assert.equal(this.oFooterBar.getContentRight().length, 0, "Preview button not avilable in to footer bar");
	});
	QUnit.test("Test availability of representation view and controller", function(assert) {
		assert.ok(this.representationView, "representation view is Available");
		assert.ok(typeof this.representationView.getController === "function", "Representation controller is available");
	});
	QUnit.test("Test availability of API's of representation controller", function(assert) {
		assert.ok(typeof this.representationController.onInit === "function", "onInit function available in representation controller");
		assert.ok(typeof this.representationController.setDetailData === "function", "setDisplayData function available in representation controller");
		assert.ok(typeof this.representationController.handleChangeForChartType === "function", "handleChangeForChartType function available in representation controller");
		assert.ok(typeof this.representationController._createDimMeasForCharts === "function", "Create Dimansion & Measure for BarClass,ColumnClass,Line Chart function available in representation controller");
		assert.ok(typeof this.representationController.handleChangeForCornerText === "function", "handleChangeForCornerText function available in representation controller");
		assert.ok(typeof this.representationController.onExit === "function", "onExit function available in representation controller");
		assert.ok(typeof this.representationController._setDisplayText === "function", "_setDisplayText privatefunction available in representation controller");
		assert.ok(typeof this.representationController._addAutoCompleteFeatureOnInputs === "function", "_addAutoCompleteFeatureOnInputs private function available in representation controller");
		assert.ok(typeof this.representationController._bindBasicRepresentationData === "function", "_bindBasicRepresentationData private function available in representation controller");
		assert.ok(typeof this.representationController._bindSortLayoutData === "function", "_bindSortLayoutData private function available in representation controller");
		assert.ok(typeof this.representationController._insertPreviewButtonInFooter === "function", "_insertPreviewButtonInFooter private function available in representation controller");
		assert.ok(typeof this.representationController._removePreviewButtonFromFooter === "function", "_removePreviewButtonFromFooter private function available in representation controller");
		assert.ok(typeof this.representationController._handlePreviewButtonPress === "function", "_handlePreviewButtonPress private function available in representation controller");
		assert.ok(typeof this.representationController._getPreviewDetails === "function", "_getPreviewDetails private function available in representation controller");
		assert.ok(typeof this.representationController._getParentStepLongTitle === "function", "_getParentrepresentationLongTitle private function available in representation controller");
		assert.ok(typeof this.representationController._getParentStepTitle === "function", "_getParentrepresentationTitle private function available in representation controller");
		assert.ok(typeof this.representationController._getSelectPropertiesFromParentStep === "function", "_getSelectPropertiesFromParentrepresentation private function available in representation controller");
		assert.ok(typeof this.representationController._getCornerTextsFromConfigObject === "function", "_getCornerTextsFromConfigObject private function available in representation controller");
		assert.ok(typeof this.representationController._getChartTypeDataset === "function", "_getChartTypeDataset private function available in representation controller");
		assert.ok(typeof this.representationController._getChartPictureDataset === "function", "_getChartPictureDataset private function available in representation controller");
		assert.ok(typeof this.representationController._updatePictureDataset === "function", "_updatePictureDataset private function available in representation controller");
		assert.ok(typeof this.representationController._getPropertyDataset === "function", "_getPropertyDataset private function available in representation controller");
		assert.ok(typeof this.representationController._getSortDataset === "function", "_getSortDataset private function available in representation controller");
		assert.ok(typeof this.representationController._getCornerTextsDataset === "function", "_getCornerTextsDataset private function available in representation controller");
		assert.ok(typeof this.representationController._setDefaultRepresentationType === "function", "_setDefaultRepresentationType private function available in representation controller");
		assert.ok(typeof this.representationController._setDefaultProperties === "function", "_setDefaultProperties private function available in representation controller");
		assert.ok(typeof this.representationController._updateAndSetDatasetsByChartType === "function", "_updateAndSetDatasetsByChartType private function available in representation controller");
		assert.ok(typeof this.representationController._updatePropertyDatasetByChartType === "function", "_updatePropertyDatasetByChartType private function available in representation controller");
		assert.ok(typeof this.representationController._updateSortDatasetByChartType === "function", "_updateSortDatasetByChartType private function available in representation controller");
		assert.ok(typeof this.representationController._setPropertiesFromCurrentDataset === "function", "_setPropertiesFromCurrentDataset private function available in representation controller");
		assert.ok(typeof this.representationController._setSortFieldsFromCurrentDataset === "function", "_setSortFieldsFromCurrentDataset private function available in representation controller");
		assert.ok(typeof this.representationController._getRepresentationMetadata === "function", "_getRepresentationMetadata private function available in representation controller");
		assert.ok(typeof this.representationController._handleChangeForBasicDataSelectProperty === "function", "_handleChangeForBasicDataSelectProperty private function available in representation controller");
		assert.ok(typeof this.representationController._handleChangeForBasicDataPropertyRowLabelInput === "function", "handleChangeForBasicDataPropertyRowLabelInput private function available in representation controller");
		assert.ok(typeof this.representationController._handlerForBasicDataAddPropertyRow === "function", "handlerForBasicDataAddPropertyRow private function available in representation controller");
		assert.ok(typeof this.representationController._handlerForBasicDataDeletePropertyRow === "function", "handlerForBasicDataDeletePropertyRow private function available in representation controller");
		assert.ok(typeof this.representationController._handleChangeForSortDataProperty === "function", "_handleChangeForSortDataProperty private function available in representation controller");
		assert.ok(typeof this.representationController._handleChangeForSortDirection === "function", "handleChangeForSortDirection private function available in representation controller");
		assert.ok(typeof this.representationController._handleChangeForAddSortRow === "function", "handleChangeForAddSortRow private function available in representation controller");
		assert.ok(typeof this.representationController._handleChangeForDeleteSortRow === "function", "handleChangeForDeleteSortRow private function available in representation controller");
	});
	QUnit.test("Test setDetailData for representation", function(assert) {
		this.representationController.setDetailData();
		assert.equal(this.representationController.mDataset.oChartPictureDataset.ColumnChart, "sap-icon://bar-chart", "Icon for the column chart is : " + this.representationController.mDataset.oChartPictureDataset.ColumnChart);
		assert.equal(this.representationController.mDataset.oChartPictureDataset.BubbleChart, "sap-icon://bubble-chart", "Icon for the bubble chart is : " + this.representationController.mDataset.oChartPictureDataset.ColumnChart);
		assert.equal(this.representationController.mDataset.oChartPictureDataset.sSelectedChartPicture, "sap-icon://bar-chart", "Icon for the chart is : " + this.representationController.mDataset.oChartPictureDataset.sSelectedChartPicture);
		assert.equal(this.representationController.mDataset.oChartTypeDataset.sSelectedChartType, "ColumnChart", "Selected chart type is:" + this.representationController.mDataset.oChartTypeDataset.sSelectedChartType);
		assert.deepEqual(this.representationController.mDataset.oChartTypeDataset.aChartTypes.length, 3, "Three charts are available in the chart data set");
		assert.equal(this.representationController.mDataset.oCornerTextsDataset.LeftLower, "Left bottom corner from rep", "Left bottom corner text is :" + this.representationController.mDataset.oCornerTextsDataset.LeftLower);
		assert.equal(this.representationController.mDataset.oCornerTextsDataset.LeftUpper, "Left top corner from rep", "Left upper corner text is :" + this.representationController.mDataset.oCornerTextsDataset.LeftUpper);
		assert.equal(this.representationController.mDataset.oCornerTextsDataset.RightLower, "Right bottom corner from rep", "Right bottom corner text is :" + this.representationController.mDataset.oCornerTextsDataset.RightLower);
		assert.equal(this.representationController.mDataset.oCornerTextsDataset.RightUpper, "Right top corner from rep", "Left bottom corner text is :" + this.representationController.mDataset.oCornerTextsDataset.RightUpper);
		var nPropertyRows = this.representationController.mDataset.oPropertyDataset.aPropertyRows;
		assert.equal(nPropertyRows.length, 3, "Three property rows for colum chart");
		var nSortPropertyRows = this.representationController.mDataset.oSortDataset.aSortRows;
		assert.equal(nSortPropertyRows.length, 1, "One sort property row for colum chart");
		//labels for the property rows
		var sLabelFirstDimension = this.representationController.oEntityMetadata.getPropertyMetadata("property2").label;
		var sExpectedLabelFirstDimension = this.representationController.mDataset.oPropertyDataset.aPropertyRows[0].sLabel;
		assert.notEqual(sLabelFirstDimension, sExpectedLabelFirstDimension, "Label for first property row is differnt than the default label :" + sLabelFirstDimension);
		var sLabelSecondDimension = this.representationController.oEntityMetadata.getPropertyMetadata("property3").label;
		var sExpectedLabelSecondDimension = this.representationController.mDataset.oPropertyDataset.aPropertyRows[1].sLabel;
		assert.equal(sLabelSecondDimension, sExpectedLabelSecondDimension, "Label for second property row is :" + sExpectedLabelSecondDimension);
		var sLabelFirstMeasure = this.representationController.oEntityMetadata.getPropertyMetadata("property4").name;
		var sExpectedLabelFirstMeasure = this.representationController.mDataset.oPropertyDataset.aPropertyRows[2].sLabel;
		assert.equal(sLabelFirstMeasure, sExpectedLabelFirstMeasure, "Label for third property row is :" + sLabelFirstMeasure);
	});
	QUnit.test("Test handleChangeForChartType for representation ColumnChart", function(assert) {
		var oEvt = {
			getParameter : function() {
				var selectedItem = {};
				selectedItem.getKey = function() {
					return "ColumnChart";
				};
				return selectedItem;
			}
		};
		var spy = sinon.spy();
		sinon.stub(this.representationController, "_switchLabelForCharts", spy);
		this.representationController.sCurrentChartType = "BarChart";
		this.representationController.handleChangeForChartType(oEvt);
		assert.strictEqual(spy.calledOnce, true, "Switch Label For Charts Called for Column chart");
		var sAlternateRep = this.representationController.oRepresentation.getAlternateRepresentationType();
		var sRepType = this.representationController.oRepresentation.getRepresentationType();
		var sCurrentChartType = this.representationController.sCurrentChartType;
		var aCategories = this.oModelerInstance.configurationEditorForUnsavedConfig.getCategoriesForStep(this.representationController.oParentStep.getId());
		assert.equal(sAlternateRep, "TableRepresentation", "Alternate representation type is table");
		assert.equal(sRepType, "ColumnChart", "Representation type is :" + sRepType);
		assert.equal(sCurrentChartType, "ColumnChart", "Current chart type is :" + sCurrentChartType);
		assert.deepEqual(aCategories, [ "Category-1" ], "Category assigned is : " + aCategories);
		assert.equal(this.representationController.oConfigurationEditor.isSaved(), false, "Configuration editor is unsaved");
		this.representationController._switchLabelForCharts.restore();
	});
	QUnit.test("Test handleChangeForChartType for switching LineChart to ColumnChart", function(assert) {
		var oEvt = {
			getParameter : function() {
				var selectedItem = {};
				selectedItem.getKey = function() {
					return "ColumnChart";
				};
				return selectedItem;
			}
		};
		var spy = sinon.spy();
		sinon.stub(this.representationController, "_switchLabelForCharts", spy);
		this.representationController.sCurrentChartType = "LineChart";
		this.representationController.handleChangeForChartType(oEvt);
		assert.strictEqual(spy.called, false, "Switch Label For Charts Not Called for Column chart");
		this.representationController._switchLabelForCharts.restore();
	});
	QUnit.test("Test _creatDimMesForCharts for BarClass Chart", function(assert) {
		var sHorizontal = sap.apf.core.constants.representationMetadata.kind.XAXIS;
		var sVertical = sap.apf.core.constants.representationMetadata.kind.YAXIS;
		var sAggDim = this.oModelerInstance.modelerCore.getText("dimension");
		var sAggMeas = this.oModelerInstance.modelerCore.getText("measure");
		var xAxis = this.oModelerInstance.modelerCore.getText("xAxis");
		var yAxis = this.oModelerInstance.modelerCore.getText("yAxis");
		this.representationController.bIsBarClassType = true;
		var sText = this.representationController._createDimMeasForCharts("dimension", sHorizontal);
		assert.strictEqual(this.oModelerInstance.modelerCore.getText("dim-measure-label", [ sAggDim, yAxis ]), sText, "Dimension For Vertical BarChart");
		sText = this.representationController._createDimMeasForCharts("measure", sVertical);
		assert.strictEqual(this.oModelerInstance.modelerCore.getText("dim-measure-label", [ sAggMeas, xAxis ]), sText, "Measure For Horizontal BarChart");
	});
	QUnit.test("Test _creatDimMesForCharts for ColumnClass Chart", function(assert) {
		var sHorizontal = sap.apf.core.constants.representationMetadata.kind.XAXIS;
		var sVertical = sap.apf.core.constants.representationMetadata.kind.YAXIS;
		var sAggDim = this.oModelerInstance.modelerCore.getText("dimension");
		var sAggMeas = this.oModelerInstance.modelerCore.getText("measure");
		var xAxis = this.oModelerInstance.modelerCore.getText("xAxis");
		var yAxis = this.oModelerInstance.modelerCore.getText("yAxis");
		this.representationController.bIsBarClassType = false;
		var sText = this.representationController._createDimMeasForCharts("dimension", sHorizontal);
		assert.strictEqual(this.oModelerInstance.modelerCore.getText("dim-measure-label", [ sAggDim, xAxis ]), sText, "Dimension For Horizonatl ColumnChart");
		sText = this.representationController._createDimMeasForCharts("measure", sVertical);
		assert.strictEqual(this.oModelerInstance.modelerCore.getText("dim-measure-label", [ sAggMeas, yAxis ]), sText, "Measure For Vertical ColumnChart");
	});
	QUnit.test("When the chart type is DualLine", function(assert) {
		//arrange
		var sHorizontal = sap.apf.core.constants.representationMetadata.kind.XAXIS;
		var sVertical = sap.apf.core.constants.representationMetadata.kind.YAXIS;
		var sVertical2 = sap.apf.core.constants.representationMetadata.kind.YAXIS2;
		var sAggDim = this.oModelerInstance.modelerCore.getText("dimension");
		var sAggMeas = this.oModelerInstance.modelerCore.getText("measure");
		var xAxis = this.oModelerInstance.modelerCore.getText("xAxis");
		var yAxis2 = this.oModelerInstance.modelerCore.getText("yAxis2");
		//act
		this.representationController.bIsDualLineChart = true;
		var sText = this.representationController._createDimMeasForCharts("dimension", sHorizontal);
		//assert
		assert.strictEqual(this.oModelerInstance.modelerCore.getText("dim-measure-label", [ sAggDim, xAxis ]), sText, "Then Label will be Dimension For Horizontal Axis");
		//act
		sText = this.representationController._createDimMeasForCharts("measure", sVertical);
		//assert KS - texts may not be constructed
		//assert.strictEqual(this.oModelerInstance.modelerCore.getText("dim-measure-label", [ sAggMeas, "Left " + yAxis ]), sText, "Then Label will be Measure For Left Vertical Axis");
		//act
		sText = this.representationController._createDimMeasForCharts("measure", sVertical2);
		//assert
		assert.strictEqual(this.oModelerInstance.modelerCore.getText("dim-measure-label", [ sAggMeas, yAxis2 ]), sText, "Then Label will be Measure For Right Vertical Axis");
	});
	QUnit.test("Test handleChangeForCornerText for representation", function(assert) {
		var oEvt = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getValue = function() {
					return "Text From Rep";
				};
				selectedItem.getBindingPath = function() {
					return "LeftUpper";
				};
				return selectedItem;
			}
		};
		this.representationController.handleChangeForCornerText(oEvt);
		assert.equal(this.representationController.oConfigurationEditor.isSaved(), false, "Configuration editor is unsaved");
		var aCornerTexts = this.representationController.mDataset.oCornerTextsDataset;
		assert.equal(aCornerTexts.LeftLower, "Left bottom corner from rep", "Left bottom corner text is :" + aCornerTexts.LeftLower);
		assert.equal(aCornerTexts.LeftUpper, "Text From Rep", "Left upper corner text is :" + aCornerTexts.LeftUpper);
		assert.equal(aCornerTexts.RightLower, "Right bottom corner from rep", "Right bottom corner text is :" + aCornerTexts.RightLower);
		assert.equal(aCornerTexts.RightUpper, "Right top corner from rep", "Left bottom corner text is :" + aCornerTexts.RightUpper);
	});
	QUnit.test("Test _getParentStepLongTitle for representation", function(assert) {
		var sStepLongTitle = this.representationController._getParentStepLongTitle();
		assert.equal(sStepLongTitle, "step A long title", "Step long title is : " + sStepLongTitle);
	});
	QUnit.test("Test _getParentStepTitle for representation", function(assert) {
		var sStepTitle = this.representationController._getParentStepTitle();
		assert.equal(sStepTitle, "step A", "Step title is : " + sStepTitle);
	});
	QUnit.test("Test _getSelectPropertiesFromParentStep for representation", function(assert) {
		var aSelectedProperty = this.representationController._getSelectPropertiesFromParentStep();
		var aSelectedPropertyName = [];
		aSelectedProperty.map(function(property) {
			aSelectedPropertyName.push(property.sName);
		});
		var expectedSelectProeprty = [ "property2", "property3", "property4" ];
		assert.deepEqual(aSelectedPropertyName, expectedSelectProeprty, "Selected properties in step is: " + aSelectedProperty);
	});
	QUnit.test("Test _getChartTypeDataset for representation", function(assert) {
		var aChartTypeData = this.representationController._getChartTypeDataset();
		assert.equal(aChartTypeData.aChartTypes.length, 3, "Three chart types are available");
		assert.equal(aChartTypeData.aChartTypes[0].sId, "ColumnChart", "Id of the chart is column chart");
		assert.equal(aChartTypeData.sSelectedChartType, "ColumnChart", "Selected chart type is column chart");
	});
	QUnit.test("Test _getChartPictureDataset for representation", function(assert) {
		var aChartPictureData = this.representationController._getChartPictureDataset();
		assert.equal(aChartPictureData.ColumnChart, "sap-icon://bar-chart", "Icon for the chart is : " + aChartPictureData.ColumnChart);
		assert.equal(aChartPictureData.sSelectedChartPicture, "sap-icon://bar-chart", "Icon for the chart is : " + aChartPictureData.ColumnChart);
	});
	QUnit.test("Test _getPropertyDataset for representation", function(assert) {
		var oPropertyDataSet = this.representationController._getPropertyDataset();
		oPropertyDataSet.aPropertyRows.forEach(function(oProperty) {
			assert.ok(oProperty.nMax, "Maximum count for property" + oProperty + "as" + oProperty.sAggregationRole + "is available");
			assert.ok(oProperty.nMin, "Maximum count for property" + oProperty + "as" + oProperty.sAggregationRole + "is available");
			assert.ok(oProperty.sKind, "Kind for property" + oProperty + "is available : " + oProperty.sKind);
		});
	});
	QUnit.test("Test _getCornerTextsDataset for representation , value of corner texts will be overridden if the text is available in representation", function(assert) {
		var aCornerTexts = this.representationController._getCornerTextsFromConfigObject(this.representationController.oParentStep);
		assert.equal(aCornerTexts.LeftLower, "Left bottom corner", "Left bottom corner text is :" + aCornerTexts.LeftLower);
		assert.equal(aCornerTexts.LeftUpper, "Left top corner", "Left upper corner text is :" + aCornerTexts.LeftUpper);
		assert.equal(aCornerTexts.RightLower, "Right bottom corner", "Right bottom corner text is :" + aCornerTexts.RightLower);
		assert.equal(aCornerTexts.RightUpper, "Right top corner", "Left bottom corner text is :" + aCornerTexts.RightUpper);
	});
	QUnit.test("Test _setDefaultRepresentationType for representation", function(assert) {
		this.representationController._setDefaultRepresentationType();
		var sAlternateRep = this.representationController.oRepresentation.getAlternateRepresentationType();
		var sRepType = this.representationController.oRepresentation.getRepresentationType();
		var sCurrentChartType = this.representationController.sCurrentChartType;
		var aCategories = this.oModelerInstance.configurationEditorForUnsavedConfig.getCategoriesForStep(this.representationController.oParentStep.getId());
		assert.equal(sAlternateRep, "TableRepresentation", "Alternate representation type is table");
		assert.equal(sRepType, "ColumnChart", "Representation type is :" + sRepType);
		assert.equal(sCurrentChartType, "ColumnChart", "Default chart type is :" + sCurrentChartType);
		assert.deepEqual(aCategories, [ "Category-1" ], "Category assigned is : " + aCategories);
		assert.equal(this.representationController.oConfigurationEditor.isSaved(), false, "Configuration editor is unsaved");
	});
	QUnit.test("Test _updatePropertyDatasetByChartType for representation", function(assert) {
		var previousPropertyRows = this.representationController.mDataset.oPropertyDataset.aPropertyRows;
		assert.equal(previousPropertyRows.length, 3, "Three property rows for colum chart");
		this.representationController._updateAndSetDatasetsByChartType("BubbleChart");
		var newPropertyRows = this.representationController.mDataset.oPropertyDataset.aPropertyRows;
		assert.equal(newPropertyRows.length, 6, "Six property rows for bubble chart");
	});
	QUnit.test("Test _updateSortDatasetByChartType for representation", function(assert) {
		var previousSortPropertyRows = this.representationController.mDataset.oSortDataset.aSortRows;
		assert.ok(previousSortPropertyRows.length > 0, "Sort property row available for colum chart");
		assert.equal(this.representationView.byId("idSortLayout").getVisible(), true, "Sort layout not visible for column chart");
		assert.equal(this.representationView.byId("idSorting").getVisible(), true, "Sort property row not visible for column chart");
		this.representationController._updateSortDatasetByChartType("BubbleChart");
		assert.equal(this.representationView.byId("idSortLayout").getVisible(), false, "Sort layout not visible for bubble chart");
		assert.equal(this.representationView.byId("idSorting").getVisible(), false, "Sort property row not visible for bubble chart");
	});
	QUnit.test("Test _getRepresentationMetadata for representation", function(assert) {
		var oRepMetadata = this.representationController._getRepresentationMetadata();
		assert.ok(oRepMetadata.BubbleChart, "Metadata for bubble chart is available");
		assert.equal(oRepMetadata.BubbleChart.dimensions.supportedKinds.length, 2, "Two supported kinds for dimensions for bubble chart is available");
		assert.equal(oRepMetadata.BubbleChart.measures.supportedKinds.length, 4, "Four supported kinds for measures for bubble chart is available");
		assert.ok(oRepMetadata.ColumnChart, "Metadata for column chart is available");
		assert.equal(oRepMetadata.ColumnChart.dimensions.supportedKinds.length, 2, "Two supported kinds for dimensions for column chart is available");
		assert.equal(oRepMetadata.ColumnChart.measures.supportedKinds.length, 1, "One supported kind for measures for column chart is available");
	});
	QUnit.test("Test _bindBasicRepresentationData for representation", function(assert) {
		this.representationController._bindBasicRepresentationData();
		assert.equal(this.basicDataItems.length, 3, "Basic data layout is available for the representation, two dimensions and one measures");
		this.representationView.byId("idBasicDataLayout").getItems()[0].getContent()[5].getItems()[0].firePress();//click on add button
		var newBasicDataItems = this.representationView.byId("idBasicDataLayout").getItems();
		assert.equal(newBasicDataItems.length, 4, "One more basic data layout is available for the representation, one basic data layout added");
		this.representationView.byId("idBasicDataLayout").getItems()[0].getContent()[5].getItems()[1].firePress();//click on less button
		var previousSortDataItems = this.representationView.byId("idBasicDataLayout").getItems();
		assert.equal(previousSortDataItems.length, 3, "One basic data layout is available for the representation, second is deleted");
	});
	QUnit.test("Test _bindBasicRepresentationData for BarChart representation", function(assert) {
		var sAggDim = this.oModelerInstance.modelerCore.getText("dimension");
		var sAggMeas = this.oModelerInstance.modelerCore.getText("measure");
		var xAxis = this.oModelerInstance.modelerCore.getText("xAxis");
		var yAxis = this.oModelerInstance.modelerCore.getText("yAxis");
		this.representationController.sCurrentChartType = "BarChart";
		this.representationController._bindBasicRepresentationData();
		assert.strictEqual(this.basicDataItems.length, 3, "Basic data layout is available for the representation, two dimensions and one measures");
		assert.strictEqual(this.oModelerInstance.modelerCore.getText("display", [ this.oModelerInstance.modelerCore.getText("dim-measure-label", [ sAggDim, yAxis ]) ]), this.representationView.byId("idBasicDataLayout").getItems()[0].getContent()[0]
				.getText(), "Dimension for Vertical Axis");
		assert.strictEqual(this.oModelerInstance.modelerCore.getText("dim-measure-label", [ sAggMeas, xAxis ]), this.representationView.byId("idBasicDataLayout").getItems()[2].getContent()[0].getText(), "Measure for Horizontal Axis");
	});
	QUnit.test("Test _handlerForBasicDataAddPropertyRow for representation", function(assert) {
		assert.equal(this.basicDataItems.length, 3, "Basic data layout is available for the representation, two dimensions and one measures");
		this.representationController._handlerForBasicDataAddPropertyRow(this.oBasicDataEvent); // add row event
		var newBasicDataItems = this.representationController.mDataset.oPropertyDataset.aPropertyRows;
		assert.equal(newBasicDataItems.length, 4, "One more basic data layout is available for the representation, one basic data layout added");
		//		var sLabel = this.representationController.mDataset.oPropertyDataset.aPropertyRows[1].sLabel;
		//		equal(sLabel, "dimensionproperty1", "Default lable is copied for the new propery row");
		var sSelectedProperty = this.representationController.mDataset.oPropertyDataset.aPropertyRows[0].sSelectedProperty;
		var sFirstProperty = this.representationController.mDataset.oPropertyDataset.aPropertyRows[0].aAllProperties[0].sName;
		assert.equal(sSelectedProperty, sFirstProperty, "First property is selected in the newly added property row");
	});
	QUnit.test("Test _handlerForBasicDataDeletePropertyRow for representation", function(assert) {
		var basicRepDataItems = this.representationController.mDataset.oPropertyDataset.aPropertyRows;
		assert.equal(basicRepDataItems.length, 3, "Basic data layout is available for the representation, two dimensions and one measures");
		this.representationController._handlerForBasicDataAddPropertyRow(this.oBasicDataEvent); // add row event
		var newBasicDataItemsAfterAdd = this.representationController.mDataset.oPropertyDataset.aPropertyRows;
		assert.equal(newBasicDataItemsAfterAdd.length, 4, "One more basic data layout is available for the representation, one basic data layout added");
		this.representationController._handlerForBasicDataDeletePropertyRow(this.oBasicDataEvent); // delete row event
		var newBasicDataItemsAfterDelete = this.representationController.mDataset.oPropertyDataset.aPropertyRows;
		assert.equal(newBasicDataItemsAfterDelete.length, 3, "One  basic data layout is deleted for the representation");
	});
	QUnit.test("Test _handleChangeForBasicDataSelectProperty for representation", function(assert) {
		var oSelectPropertyControl = this.basicDataItems[0].getContent()[1]; // the select control in the basic data layout
		assert.equal(oSelectPropertyControl.getSelectedKey(), "property2", "Property2 is the current selected property");
		var sLabelFirstDimension = this.representationController.oEntityMetadata.getPropertyMetadata("property2").label;
		var sExpectedLabelFirstDimension = this.representationController.mDataset.oPropertyDataset.aPropertyRows[0].sLabel;
		assert.notEqual(sLabelFirstDimension, sExpectedLabelFirstDimension, "The default label is different than the label given to the dimension" + "label given is-" + sExpectedLabelFirstDimension + " ; Default label is-" + sLabelFirstDimension);
		//change the select property to "property3", on change of selected property, default label is assigned to the property
		oSelectPropertyControl.setSelectedKey("property3");
		this.representationController._handleChangeForBasicDataSelectProperty(this.oBasicDataEvent);
		var sLabelSecondDimension = this.representationController.oEntityMetadata.getPropertyMetadata("property3").label;
		var sExpectedLabelSecondDimension = this.representationController.mDataset.oPropertyDataset.aPropertyRows[1].sLabel;
		assert.equal(sLabelSecondDimension, sExpectedLabelSecondDimension, "The default label is " + sLabelSecondDimension + " for second dimension of the representation");
	});
	QUnit.test("Test _bindSortLayoutData for representation", function(assert) {
		this.representationController._bindSortLayoutData();
		assert.equal(this.representationView.byId("idSortLayout").getItems().length, 1, "Basic sort data layout is available for the representation");
		this.representationView.byId("idSortLayout").getItems()[0].getContent()[4].getItems()[0].firePress();//click on add button
		var newSortDataItems = this.representationView.byId("idSortLayout").getItems();
		assert.equal(newSortDataItems.length, 2, "One more sort data layout is available for the representation, one sort data layout added");
		this.representationView.byId("idSortLayout").getItems()[0].getContent()[4].getItems()[1].firePress();//click on less button
		var previousSortDataItems = this.representationView.byId("idSortLayout").getItems();
		assert.equal(previousSortDataItems.length, 1, "One sort data layout is available for the representation, second is deleted");
	});
	QUnit.test("Test _getSortDataset for representation", function(assert) {
		this.representationController.oRepresentation.addOrderbySpec("property3", "true");
		var oSortDataSet = this.representationController._getSortDataset();
		oSortDataSet.aSortRows.forEach(function(oProperty) {
			assert.ok(oProperty.sSortProperty, "Sort property is avialble :" + oProperty.sSortProperty);
			assert.ok(oProperty.sDirection, "Sort direction is avialble :" + oProperty.sDirection);
			assert.ok(oProperty.aAllProperties, "Properties used for sorting are available");
		});
		//check if all the controls in the sort layout is editable in case Top N is not set on the parent step
		this.representationController.setDetailData();
		var sSortContent = this.representationView.byId("idSortLayout").getItems();
		sSortContent.forEach(function(oSortRow) {
			oSortRow.getContent().forEach(function(oControl) {
				if (oControl.getEnabled) {
					assert.equal(oControl.getEnabled(), true, "Property and sort direction dropdown in the sort layout are enabled");
				}
				if (oControl.getItems) {
					oControl.getItems().forEach(function(item) {
						if (item.getVisible) {
							assert.equal(oControl.getVisible(), true, "Add/delete icon in the sort layout are visible");
						}
					});
				}
			});
		});
	});
	QUnit.test("Test _handleChangeForSortDataProperty for representation", function(assert) {
		var oSelectPropertyControl = this.sortDataItems[0].getContent()[1]; // the select control in the sort data layout
		//the sort property is set to "property3", change the sort property to "property1"
		oSelectPropertyControl.setSelectedKey("property1");
		this.representationController._handleChangeForSortDataProperty(this.oSortDataPropertyEvent);
		var sChangedSortProperty = this.representationController.mDataset.oSortDataset.aSortRows[0].sSortProperty;
		assert.equal(sChangedSortProperty, "property1", "Sort property is selected as property1");
	});
	QUnit.test("Test _handleChangeForSortDirection for representation", function(assert) {
		var oSortDirectionSelectControl = this.sortDataItems[0].getContent()[3]; // the select control for sort direction in the sort data layout
		var sExpectedSortDirection = this.representationController.mDataset.oSortDataset.aSortRows[0].sDirection;
		assert.equal(sExpectedSortDirection, "Ascending", "Sort direction is ascending");
		//change the sort direction to "Descending"
		oSortDirectionSelectControl.setSelectedKey("Descending");
		this.representationController._handleChangeForSortDirection(this.oSortDataPropertyEvent);
		var sChangedSortDirection = this.representationController.mDataset.oSortDataset.aSortRows[0].sDirection;
		assert.equal(sChangedSortDirection, "Descending", "Sort direction is Descending");
	});
	QUnit.test("Test _handleChangeForAddSortRow for representation", function(assert) {
		assert.equal(this.sortDataItems.length, 1, "Sort data layout is available for the representation");
		this.representationController._handleChangeForAddSortRow(this.oSortDataPropertyEvent); // add sort row event
		var newSortDataItemsAfterAdd = this.representationController.mDataset.oSortDataset.aSortRows;
		assert.equal(newSortDataItemsAfterAdd.length, 2, "One more sort data layout is available for the representation, one sort data layout added");
	});
	QUnit.test("Test _handleChangeForDeleteSortRow for representation", function(assert) {
		assert.equal(this.sortDataItems.length, 1, "Sort data layout is available for the representation");
		this.representationController._handleChangeForAddSortRow(this.oSortDataPropertyEvent); // add sort row event
		var newSortDataItemsAfterAdd = this.representationController.mDataset.oSortDataset.aSortRows;
		assert.equal(newSortDataItemsAfterAdd.length, 2, "One more sort data layout is available for the representation, one sort data layout added");
		this.representationController._handleChangeForDeleteSortRow(this.oSortDataPropertyEvent); // delete sort row event
		var newSortDataItemsAfterDelete = this.representationController.mDataset.oSortDataset.aSortRows;
		assert.equal(newSortDataItemsAfterDelete.length, 1, "One  sort data layout is deleted for the representation");
	});
	QUnit.test("Test onExit for representation", function(assert) {
		this.representationController.onExit();
		assert.equal(this.oFooterBar.getContentRight().length, 0, "Preview button not avilable in to footer bar");
	});
	QUnit.module("Representation Unit Tests - New Representation", {
		beforeEach : function(assert) {
			var self = this;
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				self.oModelerInstance = oModelerInstance;//Modeler instance from callback
				self.oFooterBar = new sap.m.Bar();
				self.representationView = sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.representation",
					type : "XML",
					viewData : {
						updateConfigTree : self.oModelerInstance.updateConfigTree,
						updateSelectedNode : self.oModelerInstance.updateSelectedNode,
						updateTree : self.oModelerInstance.updateTree,
						updateTitleAndBreadCrumb : self.oModelerInstance.updateTitleAndBreadCrumb,
						oConfigurationHandler : self.oModelerInstance.configurationHandler,
						oApplicationHandler : self.oModelerInstance.applicationHandler,
						oConfigurationEditor : self.oModelerInstance.configurationEditorForUnsavedConfig,
						getText : self.oModelerInstance.modelerCore.getText,
						getEntityTypeMetadata : self.oModelerInstance.configurationEditorForUnsavedConfig.getEntityTypeMetadata,
						getRepresentationTypes : self.oModelerInstance.configurationEditorForUnsavedConfig.getRepresentationTypes,
						sCurrentChartType : "ColumnChart",
						oFooter : self.oFooterBar,
						oParams : {
							name : "representation",
							arguments : {
								configId : self.oModelerInstance.tempUnsavedConfigId,
								categoryId : self.oModelerInstance.categoryIdUnsaved,
								stepId : self.oModelerInstance.stepIdUnsavedWithoutFilterMapping,
								representationId : "newRepresentation0"
							}
						}
					}
				});
				self.basicDataItems = self.representationView.byId("idBasicDataLayout").getItems();
				self.representationController = self.representationView.getController();
				self.representationController.oRepresentation.removeDimension("property3");// remove one dimension so that the legend has "None" as selected property
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			this.oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		}
	});
	QUnit.test("Test setDetailData of new representation", function(assert) {
		this.representationController.setDetailData();
		//for a new representation, one dimension and one measure is selected by default
		var sAlternateRep = this.representationController.oRepresentation.getAlternateRepresentationType();
		var sRepType = this.representationController.oRepresentation.getRepresentationType();
		var sCurrentChartType = this.representationController.sCurrentChartType;
		var aCategories = this.oModelerInstance.configurationEditorForUnsavedConfig.getCategoriesForStep(this.representationController.oParentStep.getId());
		assert.equal(sAlternateRep, "TableRepresentation", "Alternate representation type is table");
		assert.equal(sRepType, "ColumnChart", "Representation type is :" + sRepType);
		assert.equal(sCurrentChartType, "ColumnChart", "Default chart type is :" + sCurrentChartType);
		assert.deepEqual(aCategories, [ "Category-1" ], "Category assigned is : " + aCategories);
		var aDimension = this.representationController.oRepresentation.getDimensions();
		var sKindFirstDimension = this.representationController.oRepresentation.getDimensionKind("property2");
		var sLabelFirstDimension = this.representationController.oEntityMetadata.getPropertyMetadata("property2").label;
		var sExpectedLabelFirstDimension = this.representationController.mDataset.oPropertyDataset.aPropertyRows[0].sLabel;
		assert.equal(sLabelFirstDimension, sExpectedLabelFirstDimension, "The default label is Dimesion for first dimension of new representation");
		var aMeasure = this.representationController.oRepresentation.getMeasures();
		var sKindFirstMeasure = this.representationController.oRepresentation.getMeasureKind("property4");
		var sLabelFirstMeasure = this.representationController.oEntityMetadata.getPropertyMetadata("property4").name;
		var sExpectedLabelFirstMeasure = this.representationController.mDataset.oPropertyDataset.aPropertyRows[2].sLabel;
		assert.equal(sLabelFirstMeasure, sExpectedLabelFirstMeasure, "The default label is Measure for first measure of new representation");
		assert.deepEqual(aDimension, [ "property2" ], "First Dimension is set by default");
		assert.deepEqual(aMeasure, [ "property4" ], "First measure is set by default");
		assert.equal(sKindFirstDimension, "xAxis", "Kind for first dimension is :" + sKindFirstDimension);
		assert.equal(sKindFirstMeasure, "yAxis", "Kind for first measure is :" + sKindFirstMeasure);
		assert.equal(this.representationController.oConfigurationEditor.isSaved(), false, "Configuration editor is unsaved");
	});
	QUnit.test("Test _setDefaultProperties for representation", function(assert) {
		this.representationController._setDefaultProperties();
		var aDimension = this.representationController.oRepresentation.getDimensions();
		var sKindFirstDimension = this.representationController.oRepresentation.getDimensionKind("property2");
		var aMeasure = this.representationController.oRepresentation.getMeasures();
		var sKindFirstMeasure = this.representationController.oRepresentation.getMeasureKind("property4");
		assert.deepEqual(aDimension, [ "property2" ], "First Dimension is set by default");
		assert.deepEqual(aMeasure, [ "property4" ], "First measure is set by default");
		assert.equal(sKindFirstDimension, "xAxis", "Kind for first dimension is :" + sKindFirstDimension);
		assert.equal(sKindFirstMeasure, "yAxis", "Kind for first measure is :" + sKindFirstMeasure);
	});
	QUnit.test("Test _getPreviewDetails for representation", function(assert) {
		var oPreviewDetail = this.representationController._getPreviewDetails();
		assert.equal(oPreviewDetail.sChartType, "ColumnChart", "Chart type available for preview is :" + oPreviewDetail.sChartType);
		assert.equal(oPreviewDetail.sStepTitle, "step A", "Title for step for preview is : " + oPreviewDetail.sStepTitle);
		assert.equal(oPreviewDetail.sStepLongTitle, "step A long title", "Long title for step for preview is : " + oPreviewDetail.sStepLongTitle);
		assert.deepEqual(oPreviewDetail.aDimensions, [ "property2", "property3" ], "Dimensions available for preview is :" + oPreviewDetail.aDimensions);
		assert.deepEqual(oPreviewDetail.aMeasures, [ "property4" ], "Measures available for preview is :" + oPreviewDetail.aMeasures);
		assert.equal(oPreviewDetail.aDimensions.length, 2, "Two dimensions avaialble for preview of column chart");
		assert.equal(oPreviewDetail.aMeasures.length, 1, "One measure avaialble for preview of column chart");
		assert.ok(oPreviewDetail.aSort, "Sort property avaialble for preview of column chart");
		assert.equal(oPreviewDetail.aCornerTexts.sLeftLower, "Left bottom corner", "Left bottom corner text is :" + oPreviewDetail.aCornerTexts.sLeftLower);
		assert.equal(oPreviewDetail.aCornerTexts.sLeftUpper, "Left top corner", "Left upper corner text is :" + oPreviewDetail.aCornerTexts.sLeftUpper);
		assert.equal(oPreviewDetail.aCornerTexts.sRightLower, "Right bottom corner", "Right bottom corner text is :" + oPreviewDetail.aCornerTexts.sRightLower);
		assert.equal(oPreviewDetail.aCornerTexts.sRightUpper, "Right top corner", "Left bottom corner text is :" + oPreviewDetail.aCornerTexts.sRightUpper);
	});
	QUnit.test("Test _setPropertiesFromCurrentDataset for representation", function(assert) {
		this.representationController._setPropertiesFromCurrentDataset();
		var aDimension = this.representationController.oRepresentation.getDimensions();
		var sKindFirstDimension = this.representationController.oRepresentation.getDimensionKind("property2");
		var aMeasure = this.representationController.oRepresentation.getMeasures();
		var sKindFirstMeasure = this.representationController.oRepresentation.getMeasureKind("property4");
		assert.deepEqual(aDimension, [ "property2" ], "First Dimension is set by default");
		assert.deepEqual(aMeasure, [ "property4" ], "First measure is set by default");
		assert.equal(sKindFirstDimension, "xAxis", "Kind for first dimension is :" + sKindFirstDimension);
		assert.equal(sKindFirstMeasure, "yAxis", "Kind for first measure is :" + sKindFirstMeasure);
	});
	QUnit.test("Test _setDefaultLabelForSelectedProperty for representation", function(assert) {
		//the data is populated in the qunit, hence the content will not change. 
		//we need to pick up few control from the layout so that we could check the value on the UI
		//i.e. Does label control has "Label(Default)" title?
		var oLabelControl = this.basicDataItems[0].getContent()[3]; // the label control in the basic data layout
		//setting the default label for a property
		this.representationController._setDefaultLabelForSelectedProperty("property2", oLabelControl);
		assert.equal(oLabelControl.getText(), this.oModelerInstance.modelerCore.getText("label") + "(" + this.oModelerInstance.modelerCore.getText("default") + ")", "Label text is prefixed with default");
		var sLabelFirstDimension = this.representationController.oEntityMetadata.getPropertyMetadata("property2").label;
		var sExpectedLabelFirstDimension = this.representationController.mDataset.oPropertyDataset.aPropertyRows[0].sLabel;
		assert.equal(sLabelFirstDimension, sExpectedLabelFirstDimension, "The default label is " + sLabelFirstDimension + " for second dimension of the representation");
		//Property does not have lable	
		var oLabelControlForProperty4 = this.basicDataItems[2].getContent()[2]; // the label control in the basic data layout
		//setting the default label for a property
		this.representationController._setDefaultLabelForSelectedProperty("property4", oLabelControlForProperty4);
		assert.strictEqual(oLabelControl.getText(), this.oModelerInstance.modelerCore.getText("label") + "(" + this.oModelerInstance.modelerCore.getText("default") + ")", "Label text is prefixed with default");
		var sLabelFirstMeasure = this.representationController.oEntityMetadata.getPropertyMetadata("property4").name;
		var sExpectedLabelFirstMeasure = this.representationController.mDataset.oPropertyDataset.aPropertyRows[2].sLabel;
		assert.strictEqual(sLabelFirstMeasure, sExpectedLabelFirstMeasure, "The default label is " + sLabelFirstMeasure + " for second dimension of the representation");
	});
	QUnit.test("Test _handleChangeForBasicDataPropertyRowLabelInput for representation- Property is selected as None", function(assert) {
		var self = this;
		var oEvent = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getBindingContext = function() {
					var obj = {};
					obj.getProperty = function() {
						return "None";
					};
					return obj;
				};
				selectedItem.getValue = function() {
					return "";
				};
				selectedItem.getParent = function() {
					return self.basicDataItems[1];
				};
				return selectedItem;
			}
		};
		this.representationController._handleChangeForBasicDataPropertyRowLabelInput(oEvent);
		var aPropertyRows = this.representationController.mDataset.oPropertyDataset.aPropertyRows;
		aPropertyRows.forEach(function(propertyRow) {
			if (propertyRow.sSelectedProperty === self.oModelerInstance.modelerCore.getText("none")) {
				assert.equal(propertyRow.sLabel, "", "Lable field empty for property row where nothing is selected");
			}
		});
	});
	QUnit.test("Test _handleChangeForBasicDataPropertyRowLabelInput for representation", function(assert) {
		var self = this;
		var oEvent = {
			getSource : function() {
				var selectedItem = {};
				selectedItem.getBindingContext = function() {
					var obj = {};
					obj.getProperty = function() {
						return "property4";
					};
					return obj;
				};
				selectedItem.getValue = function() {
					return "Label";
				};
				selectedItem.getParent = function() {
					return self.basicDataItems[2];
				};
				return selectedItem;
			}
		};
		//the data is populated in the qunit, hence the content will not change. 
		//we need to pick up few control from the layout so that we could check the value on the UI
		//i.e. Does label control has "Label(Default)" title?
		//or Does the label input field is populated with the default label coming from metadata
		var oLabelControl = this.basicDataItems[2].getContent()[2]; // the label control in the basic data layout
		var oInputControl = this.basicDataItems[2].getContent()[3]; // the input control in the basic data layout
		//default lable for the property
		assert.equal(oLabelControl.getText(), this.oModelerInstance.modelerCore.getText("label") + "(" + this.oModelerInstance.modelerCore.getText("default") + ")", "Label text is prefixed with default");
		assert.equal(oInputControl.getValue(), this.representationController.oEntityMetadata.getPropertyMetadata("property4").name, "Label for the property is same as the default lable coming from metadata");
		//giving a manual label to a property
		oInputControl.setValue(this.oModelerInstance.modelerCore.getText("label"));
		this.representationController._handleChangeForBasicDataPropertyRowLabelInput(oEvent);
		assert.equal(oLabelControl.getText(), this.oModelerInstance.modelerCore.getText("label"), "Label text is not prefixed with default");
		assert.equal(oInputControl.getValue(), this.oModelerInstance.modelerCore.getText("label"), "Label text is manually eneterd as :- Label");
	});
	QUnit.test("Test sort properties on a representation when parent step has top N settings", function(assert) {
		this.representationController.oParentStep.setTopN(100, [ {
			property : "property3",
			ascending : true
		} ]);
		this.representationController.setDetailData();
		//sort properties should be same in representation as the step
		assert.deepEqual(this.representationController.oRepresentation.getOrderbySpecifications(), this.representationController.oParentStep.getTopN().orderby, "Sort option is same as the parent step");
		var sSortContent = this.representationView.byId("idSortLayout").getItems();
		sSortContent.forEach(function(oSortRow) {
			oSortRow.getContent().forEach(function(oControl) {
				if (oControl.getEnabled) {
					assert.equal(oControl.getEnabled(), false, "Property and sort direction dropdown in the sort layout are disabled");
				}
			});
		});
		//reset the top N on the parent step and the representation should have the older sort properties set
		var expectedSortData = [ {
			ascending : true,
			property : "property3"
		} ];
		this.representationController.oParentStep.resetTopN();
		assert.deepEqual(this.representationController.oRepresentation.getOrderbySpecifications(), expectedSortData, "Old sort data set on the representation");
	});
}());