jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../integration');
jQuery.sap.declare('sap.apf.ui.reuse.tViewSetting');
jQuery.sap.require("sap.apf.integration.withDoubles.helper");
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.uiApi");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
(function() {
	'use strict';
	var representationHelper, oGlobalApi, oViewSettingsDialog, oTableRepresentation;
	function _getSampleData() {
		return sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleData');
	}
	function _getsampleMetadata() {
		return {
			getPropertyMetadata : representationHelper.setPropertyMetadataStub.call()
		};
	}
	function _getDialogByEmptyTitle() {
		sap.ui.getCore().applyChanges();
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function(name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			if (oDialog.getTitle() === "") {
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	function _destroyViewSettingDialog() {
		var viewSettingDialog = _getDialogByEmptyTitle();
		if (viewSettingDialog !== undefined && viewSettingDialog.isOpen()) {
			viewSettingDialog.destroy();
		}
	}
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
	function _createTableRepresentationStub(requiredParameter, isAlternateRepresentation) {
		var aProperties = requiredParameter.dimensions.concat(requiredParameter.measures).length ? requiredParameter.dimensions.concat(requiredParameter.measures) : requiredParameter.properties; // read the table properties if available , else Concatenate dimensions & measures
		var aTableColumns = [];
		aProperties.forEach(function(property) {
			var oColumn = new sap.m.Column();
			var customDataForColumn = new sap.ui.core.CustomData({
				value : {
					text : property.fieldName,
					key : property.fieldName
				}
			});
			oColumn.addCustomData(customDataForColumn);
			aTableColumns.push(oColumn);
		});
		var aTableData = _getSampleData();
		var oModelForTable = new sap.ui.model.json.JSONModel();
		oModelForTable.setData({
			tableData : aTableData
		});
		var oTable = new sap.m.Table({
			items : {
				path : "/tableData",
				template : new sap.m.ColumnListItem({
					cells : new sap.m.Text()
				})
			},
			columns : [ aTableColumns ]
		});
		oTable.setModel(oModelForTable);
		var oTableRepresentation = {
			createViewSettingDialog : function() {
				return new sap.m.Dialog();
			},
			oTableRepresentation : oTable,
			setData : function() {
				return;
			},
			oParameter : {
				isAlternateRepresentation : isAlternateRepresentation
			},
			oApi : {
				updatePath : function() {
					return;
				}
			},
			orderby : requiredParameter.orderby
		};
		var oContainer = new sap.ui.layout.VerticalLayout();
		oContainer.addContent(new sap.m.ScrollContainer({
			content : oTableRepresentation.oTableRepresentation
		}));
		return oTableRepresentation;
	}
	QUnit.module("View Setting dialog - when orderby is not defined", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameter = representationHelper.representatationDataForAlternateRep();
			var oTableAlternateRepresentation = _createTableRepresentationStub(requiredParameter, true);
			var oViewSetting = new sap.ui.view({
				id : "idViewSettingForAlternateRep",
				type : sap.ui.core.mvc.ViewType.JS,
				viewName : "sap.apf.ui.reuse.view.viewSetting",
				viewData : oTableAlternateRepresentation
			});
			oViewSettingsDialog = oViewSetting.getContent()[0];
		},
		afterEach : function(assert) {
			sap.ui.getCore().byId("idViewSettingForAlternateRep").destroy();
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When view setting is instantiated and the default sort property is selected on the dialog", function(assert) {
		//assert
		assert.deepEqual(oViewSettingsDialog.getSortItems().length, 5, "Five items available in the sort dialog");
		assert.deepEqual(oViewSettingsDialog.getSelectedSortItem(), oViewSettingsDialog.getSortItems()[0].sId, "By default first item is selcted as the sort item");
		assert.deepEqual(oViewSettingsDialog.getSortDescending(), false, "Ascending is true by default");
		assert.deepEqual(oViewSettingsDialog.getSortItems()[0].getText(), _getsampleMetadata().getPropertyMetadata("CompanyCodeCountry").name, "the first sort item is " + oViewSettingsDialog.getSortItems()[0].getText());
		assert.deepEqual(oViewSettingsDialog.getSortItems()[1].getText(), _getsampleMetadata().getPropertyMetadata("BestPossibleDaysSalesOutstndng").name, "the second sort item is " + oViewSettingsDialog.getSortItems()[1].getText());
		assert.deepEqual(oViewSettingsDialog.getSortItems()[2].getText(), _getsampleMetadata().getPropertyMetadata("DaysSalesOutstanding").name, "the third sort item is " + oViewSettingsDialog.getSortItems()[2].getText());
		assert.deepEqual(oViewSettingsDialog.getSortItems()[3].getText(), _getsampleMetadata().getPropertyMetadata("YearMonth").name, "the fourth sort item is " + oViewSettingsDialog.getSortItems()[3].getText());
	});
	QUnit.test("When a sort property is changed on the view setting dialog for alternate representation", function(assert) {
		//arrange
		var done = assert.async();
		oViewSettingsDialog.open(); //open the view setting dialog
		var oldSortProperty = _getSelectedSortItem(oViewSettingsDialog);
		//act
		oViewSettingsDialog.setSelectedSortItem(oViewSettingsDialog.getSortItems()[1]);//change the sort property
		var oDialogInstance = _getDialogByEmptyTitle();
		oDialogInstance.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(oDialogInstance.isOpen(), true, "Then View Settings dialog is opened for sorting");
		oDialogInstance.attachAfterClose(function() {
			var updatedSortProperty = _getSelectedSortItem(oViewSettingsDialog);
			assert.strictEqual(updatedSortProperty.property, _getsampleMetadata().getPropertyMetadata("BestPossibleDaysSalesOutstndng").name, "Sort property is updated" + updatedSortProperty.property);
			assert.notEqual(updatedSortProperty, oldSortProperty, "Old sort property is different than updated sort propert");
			assert.strictEqual(_getsampleMetadata().getPropertyMetadata(updatedSortProperty.property).name, oViewSettingsDialog.getSortItems()[1].getText(), "Sort property has changed for the table");
			_destroyViewSettingDialog();
			done();
		});
	});
	QUnit.module("View Setting dialog - when orderby is defined", {
		beforeEach : function(assert) {
			oGlobalApi = new sap.apf.testhelper.doubles.UiApi();
			representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
			var requiredParameterWithOrderby = representationHelper.representatationDataWithProperty();
			oTableRepresentation = _createTableRepresentationStub(requiredParameterWithOrderby, false);
			var oViewSetting = new sap.ui.view({
				id : "idViewSettingForTable",
				type : sap.ui.core.mvc.ViewType.JS,
				viewName : "sap.apf.ui.reuse.view.viewSetting",
				viewData : oTableRepresentation
			});
			oViewSettingsDialog = oViewSetting.getContent()[0];
		},
		afterEach : function(assert) {
			sap.ui.getCore().byId("idViewSettingForTable").destroy();
			oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When a sort property is changed on the view setting dialog for a table representation", function(assert) {
		//arrange
		var done = assert.async();
		oViewSettingsDialog.open(); //open the view setting dialog
		var oldSortProperty = _getSelectedSortItem(oViewSettingsDialog);
		var spyUpdatePath = sinon.spy(oTableRepresentation.oApi, "updatePath");
		//act
		oViewSettingsDialog.setSelectedSortItem(oViewSettingsDialog.getSortItems()[1]);//change the sort property
		var oDialogInstance = _getDialogByEmptyTitle();
		oDialogInstance.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(oDialogInstance.isOpen(), true, "Then View Settings dialog is opened for sorting");
		oDialogInstance.attachAfterClose(function() {
			var updatedSortProperty = _getSelectedSortItem(oViewSettingsDialog);
			assert.strictEqual(updatedSortProperty.property, _getsampleMetadata().getPropertyMetadata("BestPossibleDaysSalesOutstndng").name, "Sort property is updated" + updatedSortProperty.property);
			assert.notEqual(updatedSortProperty, oldSortProperty, "Old sort property is different than updated sort propert");
			assert.strictEqual(_getsampleMetadata().getPropertyMetadata(updatedSortProperty.property).name, oViewSettingsDialog.getSortItems()[1].getText(), "Sort property has changed for the table");
			assert.strictEqual(spyUpdatePath.called, true, "Update path is called once the sort property is updated");
			_destroyViewSettingDialog();
			done();
		});
	});
}());
