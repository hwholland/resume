(function() {
	'use strict';
	jQuery.sap.declare("test.sap.apf.ui.representations.tTable");

	jQuery.sap.registerModulePath("sap.apf.testhelper", "../../testhelper");

	jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
	jQuery.sap.require("sap.apf.testhelper.helper");
	jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
	jQuery.sap.require('sap.apf.testhelper.config.representationHelper');

	'use strict';
	var oGlobalApi, representationHelper, oTableRepresentation, oRequiredParamter;
	function _getSelectedSortItem(oViewSettingDialog) {
		var oSortOption = {};
		var oSelectedSortItem = oViewSettingDialog.getSelectedSortItem();
		oViewSettingDialog.getSortItems().forEach(function(oSortItem) {
			if (oSortItem.getId() === oSelectedSortItem) {
				oSortOption.property = oSortItem.getKey();
			}
		});
		oSortOption.descending = oViewSettingDialog.getSortDescending();
		return oSortOption;
	}
	function _createMainContentAndViewSettingDialog(oTableRepresentation) {
		var mainContent = oTableRepresentation.getMainContent("Table with Filter", 600, 600);
		var oViewSettingDialog = oTableRepresentation.createViewSettingDialog();
		oViewSettingDialog.setSelectedSortItem(oViewSettingDialog.getSortItems()[0]);
		return {
			mainContent : mainContent,
			oViewSettingDialog : oViewSettingDialog
		};
	}
	function _getsampleMetadata() {
		return {
			getPropertyMetadata : representationHelper.setPropertyMetadataStub.call()
		};
	}
	function _getSampleData() {
		return sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleData');
	}
	function _getDataPointForSelection() {
		return [ {
			data : {
				"Year Month" : "201312",
				"Days Sales Outstanding" : 55.22
			}
		}, {
			data : {
				"Year Month" : "201311",
				"Days Sales Outstanding" : 40.3
			}
		} ];
	}
	function _commonAssertrsForTableWithnoFilter(assert) {
		// arrange
		oRequiredParamter = representationHelper.representatationDataWithDimension();
		var thumbnailContent = oTableRepresentation.getThumbnailContent();
		var oExpectedParameter = oTableRepresentation.getParameter();
		var expectedData = oTableRepresentation.getData();
		var expectedMetadata = oTableRepresentation.getMetaData();
		var expectedRequestOptions = oTableRepresentation.getRequestOptions();
		// act
		var mainContent = oTableRepresentation.getMainContent("Table Without Filter", 600, 600);
		var oHeaderTable = mainContent.getContent()[0].getContent()[0];
		var oDataTable = mainContent.getContent()[0].getContent()[1].getContent()[0];
		// assert
		assert.deepEqual(oRequiredParamter, oExpectedParameter, "Then correct parameter is set on the table when diamnsions & measures are used as table column");
		assert.deepEqual(_getSampleData(), expectedData, "Then correct data is set on the table");
		assert.deepEqual(oTableRepresentation.aDataResponse, expectedData, "Then correct data is assigned to the data response");
		assert.deepEqual(oTableRepresentation.metadata, expectedMetadata, "Then Correct metadata is assigned to the table");
		assert.deepEqual(expectedRequestOptions.paging.top, 100, "Then Top 100 records have to be fetched when the request is fired for the first time");
		assert.deepEqual(expectedRequestOptions.paging.skip, 0, "Then No record is skipped when the request is fired for the first time");
		assert.strictEqual(thumbnailContent.getSrc(), "sap-icon://table-chart", "Then getThumbnailContent returns thumbnail content as a table icon");
		assert.ok(oHeaderTable instanceof sap.m.Table, "Then getMainContent returns an instance of table - this is the table with header");
		assert.ok(oDataTable instanceof sap.m.Table, "Then getMainContent returns an instance of table - this is the data table without header");
		assert.deepEqual(oDataTable.getModel().getData().tableData, _getSampleData(), "Then the data is correctly set on the data table");
		assert.deepEqual(oHeaderTable.getColumns().length, oDataTable.getColumns().length, "Then Data table and header tables have same columns");
		//check the header for table
		assert.strictEqual(oHeaderTable.getColumns()[0].getHeader().getText(), _getsampleMetadata().getPropertyMetadata("YearMonth").label, "Then correct header is set to the first column");
		assert.strictEqual(oHeaderTable.getColumns()[1].getHeader().getText(), _getsampleMetadata().getPropertyMetadata("DaysSalesOutstanding").label, "Then correct header is set to the second column");
		assert.strictEqual(oDataTable.getMode(), "None", "Then selection mode is set to none for the table when there is no required filter");
	}
	function _commonAssertrsForTableWithFilter(assert) {
		// arrange
		var oExpectedParameter = oTableRepresentation.getParameter();
		var expectedOrderby = oTableRepresentation.getParameter().orderby;
		var expectedRequestOptions = oTableRepresentation.getRequestOptions();
		//assert
		assert.deepEqual(oRequiredParamter, oExpectedParameter, "Then correct parameter is set on the table when properties are used as table column");
		assert.deepEqual(expectedRequestOptions.orderby, expectedOrderby, "Then correct sorting options are included in the request");
	}
	function _commonSetupForCreatingTable(requiredParameter) {
		var oTableRepresentation = new sap.apf.ui.representations.table(oGlobalApi.oApi, requiredParameter);
		oTableRepresentation.setData(_getSampleData(), _getsampleMetadata());
		return oTableRepresentation;
	}
	function _checkForTableInstanceAfterDestroy(assert, oTableRepresentation) {
		assert.strictEqual(oTableRepresentation.aDataResponse, null, "After destroy dataset is null");
		assert.strictEqual(oTableRepresentation.UI5ChartHelper, null, " After destroy UI5ChartHelper is null");
		assert.strictEqual(oTableRepresentation.orderby, undefined, " After destroy orderby is an empty array");
		assert.strictEqual(oTableRepresentation.oParameter, null, " After destroy oParameter is an empty array ");
		assert.strictEqual(oTableRepresentation.oViewSettingDialog, undefined, " After destroy oViewSetting dialog is undefined ");
	}
	QUnit.module("Table Tests - When there is no required filter on the table", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			oRequiredParamter = representationHelper.representatationDataWithDimension();
			oTableRepresentation = _commonSetupForCreatingTable(oRequiredParamter);
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When table is initialized and it has no required filter", function(assert) {
		//assert
		_commonAssertrsForTableWithnoFilter(assert);
	});
	QUnit.test("When getThumbnailContent is called for the table and there is no data", function(assert) {
		oTableRepresentation.aDataResponse = [];
		oTableRepresentation.setData(oTableRepresentation.aDataResponse, undefined);// no data 
		var thumbnailContent = oTableRepresentation.getThumbnailContent();
		assert.strictEqual(thumbnailContent.getContent()[0].getText(), oGlobalApi.oApi.getTextNotHtmlEncoded("noDataText"), "Then getThumbnailContent returns no data text");
	});
	QUnit.test("When getPrintContent is called for the table which has a required filter", function(assert) {
		var printContentSecondTable = oTableRepresentation.getPrintContent();
		var oSecondTableForPrint = printContentSecondTable.oTableForPrint.getContent()[0];
		assert.ok(printContentSecondTable.oTableForPrint.getId().search("layout") !== -1, "Then getPrintContent returns print content");
		assert.ok(oSecondTableForPrint, "Then Table for print is available");
	});
	QUnit.test("When createViewSettingDialog is called for the table", function(assert) {
		var oMainContentViewSetting = _createMainContentAndViewSettingDialog(oTableRepresentation);
		assert.strictEqual(oMainContentViewSetting.oViewSettingDialog instanceof sap.m.ViewSettingsDialog, true, "Then View setting dialog is created");
		assert.strictEqual(oMainContentViewSetting.oViewSettingDialog.getSortItems().length, 2, "Then View setting dialog has one sort item");
		var expectedRequestOptions = oTableRepresentation.getRequestOptions();
		var expectedOrderby = _getSelectedSortItem(oMainContentViewSetting.oViewSettingDialog);
		assert.deepEqual(expectedRequestOptions.orderby[0], expectedOrderby, "Then correct sorting options are included in the request");
	});
	QUnit.test("When filters are serialized and deserialized with empty value", function(assert) {
		//arrange
		var expectedFilterValue = [ {
			"data" : {}
		} ];
		//act
		oTableRepresentation.deserialize({
			oFilter : [ {
				data : {}
			} ]
		});
		//assert
		assert.deepEqual(oTableRepresentation.UI5ChartHelper.filterValues, expectedFilterValue, "Then nothing has been seleted so deserialized value is empty");
		//act
		var serializedData = oTableRepresentation.serialize();
		//assert
		assert.deepEqual(oTableRepresentation.UI5ChartHelper.filterValues, serializedData.oFilter, "Then nothing has been seleted so serialized value is empty");
	});
	QUnit.test("When filters are serialized and deserialized with filter value", function(assert) {
		//act
		oTableRepresentation.deserialize({
			oFilter : [ {
				data : {
					"Year Month" : "201312",
					"Days Sales Outstanding" : 55.22
				}
			}, {
				data : {
					"Year Month" : "201311",
					"Days Sales Outstanding" : 40.3
				}
			} ]
		});
		//assert
		assert.deepEqual(oTableRepresentation.UI5ChartHelper.filterValues, _getDataPointForSelection(), "Then two points got selected so selescted point is deserialized");
		//act
		var serializedData = oTableRepresentation.serialize();
		//assert
		assert.deepEqual(oTableRepresentation.UI5ChartHelper.filterValues, serializedData.oFilter, "Then two points got selected so selected point is serialised");
	});
	QUnit.test("When table is destroyed", function(assert) {
		//act
		oTableRepresentation.destroy();
		//assert
		_checkForTableInstanceAfterDestroy(assert, oTableRepresentation);
	});
	QUnit.module("Table Tests - When there is a required filter on the table", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			oRequiredParamter = representationHelper.representatationDataForAlternateRep();
			oTableRepresentation = _commonSetupForCreatingTable(oRequiredParamter);
		},
		afterEach : function() {
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When table is initialized and it has a required filter", function(assert) {
		//assert
		_commonAssertrsForTableWithFilter(assert);
	});
	QUnit.test("When getPrintContent is called for the table which has a required filter", function(assert) {
		//arrangement
		var printContent = oTableRepresentation.getPrintContent();
		var oTableForPrint = printContent.oTableForPrint.getContent()[0];
		//act
		oTableForPrint.setSelectedItem(oTableForPrint.getItems()[0]);
		//assert
		assert.ok(printContent.oTableForPrint.getId().search("layout") !== -1, "Then getPrintContent returns print content");
		assert.ok(oTableForPrint, "Table for print is available");
		assert.ok(printContent.aSelectedListItems, "Then selected items are available in Table for print");
	});
	QUnit.test("When Selection is toggled on the table", function(assert) {
		//arrangement
		var getActiveStepStub = function() {
			var oActiveStep = {};
			oActiveStep.getSelectedRepresentation = function() {
				var UI5ChartHelper = {};
				UI5ChartHelper.filterValues = [ "AR" ];
				return {
					UI5ChartHelper : UI5ChartHelper
				};
			};
			return oActiveStep;
		};
		//place the table on the DOM to perform the selection event
		function _placeTableAt(oDataTableScrollContainer) {
			var divToPlaceTable = document.createElement("div");
			divToPlaceTable.setAttribute('id', 'contentOfTable');
			document.body.appendChild(divToPlaceTable);
			oDataTableScrollContainer.placeAt("contentOfTable");
			sap.ui.getCore().applyChanges();
		}
		sinon.stub(oGlobalApi.oApi, "getActiveStep", getActiveStepStub);
		var mainContent = oTableRepresentation.getMainContent("Table with Filter", 600, 600);
		var oDataTable = mainContent.getContent()[0].getContent()[1].getContent()[0];
		var oDataTableScrollContainer = mainContent.getContent()[0];
		_placeTableAt(oDataTableScrollContainer);
		//toggle the selection for row
		oDataTable.attachUpdateFinished(function() {
			assert.strictEqual(oDataTable.getMode(), "MultiSelect", "Then election mode is set to multiple for the table when there is a required filter");
			sap.ui.getCore().applyChanges(); //needed to toggle the selection mode of the table
			//select the item
			//act
			oDataTable.getItems()[0].setSelected(true);
			assert.strictEqual(oTableRepresentation.getSelectionFromChart().length, 1, "Then there is one item selected on the table");
			//toggle selection
			sap.ui.getCore().byId(jQuery(".sapMCb")[0].id).fireSelect();
			sap.ui.getCore().applyChanges();
			var oFilter = oTableRepresentation.getFilter();
			//assert
			assert.strictEqual(oFilter.getExpressions().length, 0, "Then Filter expression is set on the table");
			assert.strictEqual(oTableRepresentation.getSelectionFromChart().length, 0, "Then there is no item selected on the table");
			assert.strictEqual(oTableRepresentation.getSelections().length, 0, "Then there is no item selected on the table");
			
			//select two items on the table
			oDataTable.getItems()[0].setSelected(true);
			oDataTable.getItems()[1].setSelected(true);
			//remove all the selections
			oTableRepresentation.removeAllSelection();
			assert.strictEqual(oTableRepresentation.getSelectionFromChart().length, 0, "Then there is no item selected on the table");
			document.body.removeChild(document.getElementById('contentOfTable'));
			oGlobalApi.oApi.getActiveStep.restore();
		});
	});
})();