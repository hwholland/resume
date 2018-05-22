jQuery.sap.declare("sap.ui.comp.qunit.personalization.test.Assertion");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.core.MessageType");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ui.comp.qunit.personalization.test.Util");
jQuery.sap.require("test.sap.ui.comp.personalization.Util"); // test...
jQuery.sap.require("sap.chart.Chart");

sap.ui.comp.qunit.personalization.test.Assertion = sap.ui.test.Opa5.extend("sap.ui.comp.qunit.personalization.test.Assertion", {

	isTabSelected: function(oSegmentedButton, sTabName) {
		if (!oSegmentedButton || sTabName === "") {
			return false;
		}
		var sSelectedButtonID = oSegmentedButton.getSelectedButton();
		var oSelectedButton = sap.ui.comp.qunit.personalization.test.Util.getNavigationItem(oSegmentedButton, sTabName);
		return sSelectedButtonID === oSelectedButton.getId();
	},

	/**
	 * @param {sap.m.SegmentedButton || sap.m.List} oNavigationControl
	 */
	getNavigationItem: function(oNavigationControl, sPanelName) {
		if (!oNavigationControl || sPanelName === "") {
			return null;
		}
		var oNavigationItem = null;
		if (sap.ui.Device.system.phone) {
			oNavigationControl.getItems().some(function(oNavigationItem_) {
				if (oNavigationItem_.getTitle() === sPanelName) {
					oNavigationItem = oNavigationItem_;
					return true;
				}
			});
		} else {
			oNavigationControl.getButtons().some(function(oNavigationItem_) {
				if (oNavigationItem_.getText() === sPanelName) {
					oNavigationItem = oNavigationItem_;
					return true;
				}
			});
		}
		return oNavigationItem;
	},

	iShouldSeePersonalizationButton: function() {
		return this.waitFor({
			id: "IDP13nDialogButton",
			viewName: "Main",
			success: function(oButton) {
				ok(oButton, "Found the personalization Button");
			}
		});
	},

	thePersonalizationDialogOpens: function() {
		return this.waitFor({
			controlType: "sap.m.P13nDialog",
			check: function(aP13nDialogs) {
				return aP13nDialogs.length > 0;
			},
			success: function(aP13nDialogs) {
				// aP13nDialogs[0].setShowResetEnabled(true); // workaround because changing filter selection (Action.iChangeFilterSelectionToDate())
				// does not trigger enabling of "Restore" button
				ok(aP13nDialogs.length, 'Personalization Dialog should be open');
			}
		});
	},

	thePersonalizationDialogShouldBeClosed: function() {
		var aDomP13nDialogs;
		return this.waitFor({
			check: function() {
				var frameJQuery = Opa5.getWindow().jQuery;
				var fnDialog = frameJQuery.sap.getObject('sap.m.P13nDialog');
				aDomP13nDialogs = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnDialog);
				// console.log("Check: there are " + aDomP13nDialogs.length + " P13nDialogs...");
				return !aDomP13nDialogs.length;
			},
			success: function() {
				ok(!aDomP13nDialogs.length);
			},
			timeout: 5
		});
	},

	iShouldSeeNavigationControl: function() {
		if (sap.ui.Device.system.phone) {
			return this.waitFor({
				controlType: "sap.m.List",
				success: function(aLists) {
					ok(aLists.length === 1, "List should appear");
				},
				errorMessage: "sap.m.List not found"
			});
		}
		return this.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.SegmentedButton",
			success: function(aSegmentedButtons) {
				ok(aSegmentedButtons.length === 1, "Segmented Button should appear");
			},
			errorMessage: "sap.m.SegmentedButton not found"
		});
	},

	iShouldSeeNavigationControlWithPanels: function(iNumberOfPanels) {
		if (sap.ui.Device.system.phone) {
			return this.waitFor({
				controlType: "sap.m.List",
				success: function(aLists) {
					ok(aLists[0].getItems().length === iNumberOfPanels, "List with " + iNumberOfPanels + " lines should appear");
				}
			});
		}
		return this.waitFor({
			controlType: "sap.m.SegmentedButton",
			success: function(aSegmentedButtons) {
				ok(aSegmentedButtons[0].getButtons().length === iNumberOfPanels, "Segmented Button with " + iNumberOfPanels + " tabs should appear");
			}
		});
	},

	iShouldSeePanelsInOrder: function(aOrderedPanelNames) {
		if (sap.ui.Device.system.phone) {
			return this.waitFor({
				controlType: "sap.m.List",
				success: function(aLists) {
					ok(aLists[0].getItems());
				}
			});
		}
		return this.waitFor({
			controlType: "sap.m.SegmentedButton",
			success: function(aSegmentedButtons) {
				aOrderedPanelNames.forEach(function(sPanelType, iIndex) {
					var sTabText = aSegmentedButtons[0].getButtons()[iIndex].getText();
					var sText = sap.ui.comp.qunit.personalization.test.Util.getTextOfPanel(sPanelType);
					ok(sTabText === sText, (iIndex + 1) + ". tab should be " + sPanelType);
				});
			}
		});
	},

	iShouldSeeSelectedTab: function(sPanelType) {
		return this.waitFor({
			controlType: "sap.m.SegmentedButton",
			success: function(aSegmentedButtons) {
				ok(this.isTabSelected(aSegmentedButtons[0], sap.ui.comp.qunit.personalization.test.Util.getTextOfPanel(sPanelType)));
			}
		});
	},

	iShouldSeePanel: function(sPanelType) {
		return this.waitFor({
			controlType: sap.ui.comp.qunit.personalization.test.Util.getControlTypeOfPanel(sPanelType),
			success: function(aPanels) {
				ok(aPanels[0].getVisible());
			}
		});
	},

	iShouldSeeTheCheckboxSelectAllSwitchedOn: function(bIsSwitchedOn) {
		var oSelectAllCheckbox;
		return this.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.CheckBox",
			check: function(aCheckboxes) {
				return aCheckboxes.filter(function(oCheckbox) {
					if (jQuery.sap.endsWith(oCheckbox.getId(), '-sa')) {
						oSelectAllCheckbox = oCheckbox;
						return true;
					}
					return false;
				});
			},
			success: function(aCheckboxes) {
				ok(oSelectAllCheckbox.getSelected() === bIsSwitchedOn);
			}
		});
	},

	iShouldSeeTableWithVisibleColumns: function(iNumberVisibleColumns) {
		return this.waitFor({
			controlType: "sap.ui.table.Table",
			success: function(aTables) {
				var aVisibleColumns = aTables[0].getColumns().filter(function(oColumn) {
					return oColumn.getVisible();
				});
				ok(aVisibleColumns.length === iNumberVisibleColumns);
			}
		});
	},

	TableShouldHaveColumns: function(iNumberColumns) {
		return this.waitFor({
			controlType: "sap.ui.table.Table",
			success: function(aTables) {
				ok(aTables[0].getColumns().length === iNumberColumns);
			}
		});
	},

	iShouldSeeAllTableItemsSelected: function(bIsSelected) {
		return this.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.Table",
			success: function(aTables) {
				var oTable = aTables[0];
				if (bIsSelected) {
					ok(oTable.getItems().length === oTable.getSelectedItems().length);
				} else {
					ok(oTable.getSelectedItems().length === 0);
				}
			}
		});
	},

	iShouldSeeSomeSelectedTableItems: function(iNumberOfTableItems) {
		return this.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.Table",
			success: function(aTables) {
				ok(aTables[0].getSelectedItems().length === iNumberOfTableItems);
			}
		});
	},

	iShouldSeeGroupSelectionWithColumnName: function(sColumnName) {
		return this.waitFor({
			controlType: "sap.m.ComboBox",
			success: function(aComboBoxes) {
				var oComboBox = aComboBoxes[0];
				ok(oComboBox.getSelectedItem().getText() === sColumnName);
			}
		});
	},

	theComboBoxShouldHaveWarningMessage: function() {
		return this.waitFor({
			controlType: "sap.m.ComboBox",
			success: function(aComboBoxes) {
				var oComboBox = aComboBoxes[0];
				ok(oComboBox.getValueState() === sap.ui.core.MessageType.Warning);
				ok(oComboBox.getValueStateText() === sap.ui.comp.qunit.personalization.test.Util.getTextFromResourceBundle("sap.ui.comp", "PERSODIALOG_MSG_GROUPING_NOT_POSSIBLE_DESCRIPTION"));
			}
		});
	},

	theComboBoxShouldNotHaveWarningMessage: function() {
		return this.waitFor({
			controlType: "sap.m.ComboBox",
			success: function(aComboBoxes) {
				var oComboBox = aComboBoxes[0];
				ok(oComboBox.getValueState() === sap.ui.core.MessageType.None);
				ok(oComboBox.getValueStateText() === "");
			}
		});
	},

	iShouldSeeSortSelectionWithColumnName: function(sColumnName) {
		return this.waitFor({
			controlType: "sap.m.ComboBox",
			success: function(aComboBoxes) {
				var oComboBox = aComboBoxes[0];
				ok(oComboBox.getSelectedItem().getText() === sColumnName);
			}
		});
	},

	iShouldSeeSortSelectionWithSortOrder: function(sSortOrder) {
		return this.waitFor({
			controlType: "sap.m.Select",
			success: function(aSelects) {
				var oSelect = aSelects[0];
				ok(oSelect.getSelectedItem().getText() === sSortOrder);
			}
		});
	},

	iShouldSeeFilterSelectionWithColumnName: function(sColumnName) {
		return this.waitFor({
			controlType: "sap.m.ComboBox",
			success: function(aComboBoxes) {
				var oComboBox = aComboBoxes[0];
				ok(oComboBox.getSelectedItem().getText() === sColumnName);
			}
		});
	},

	iShouldSeeFilterSelectionWithOperation: function(sOperation) {
		return this.waitFor({
			controlType: "sap.m.Select",
			success: function(aSelects) {
				var oSelect = aSelects[0];
				ok(oSelect.getSelectedItem().getText() === sOperation);
			}
		});
	},

	iShouldSeeFilterSelectionWithValueDate: function(sDate) {
		var bFound = false;
		return this.waitFor({
			controlType: "sap.m.DatePicker",
			check: function(aDatePickers) {
				return aDatePickers.filter(function(oDatePicker) {
					sDate = sap.ui.core.format.DateFormat.getDateInstance().format(new Date(sDate));
					if (oDatePicker.getValue() === sDate) {
						bFound = true;
						return true;
					}
					return false;
				});
			},
			success: function(aDatePickers) {
				ok(bFound);
// var oDatePicker = aDatePickers[0];
// sDate = sap.ui.core.format.DateFormat.getDateInstance().format(new Date(sDate));
// ok(oDatePicker.getValue() === sDate);
			}
		});
	},

	iShouldSeeFilterSelectionWithValueInput: function(sText) {
		return this.waitFor({
			controlType: "sap.m.Input",
			success: function(aInputs) {
				var oInput = aInputs[0];
				ok(oInput.getValue() === sText);
			}
		});
	},

	theNumberOfSelectedDimeasuresShouldRemainStable: function() {
		return this.waitFor({
			controlType: "sap.chart.Chart",
			success: function(aCharts) {
				var oChart = aCharts[0];
				var aVisibleCols = [];
				oChart.getModel().getServiceAnnotations()["EPM_DEVELOPER_SCENARIO_SRV.Product"]["com.sap.vocabularies.UI.v1.LineItem"].forEach(function(oLineItem) {
					aVisibleCols.push(oLineItem.Value.Path);
				});
				ok((oChart.getVisibleDimensions().length + oChart.getVisibleMeasures().length) === aVisibleCols.length);
			}
		});
	},

	theNumberOfFilterableColumnKeysShouldRemainStable: function() {
		var oTable = null;
		this.waitFor({
			controlType: "sap.ui.table.Table",
			success: function(aTables) {
				oTable = aTables[0];
			}
		});
		return this.waitFor({
			controlType: "sap.m.ComboBox",
			success: function(aComboBoxes) {
				var oComboBox = aComboBoxes[0];
				var oResult = oTable.getModel().getAnalyticalExtensions().findQueryResultByName("ProductCollection");
				var aFilterableColumns = oResult._oEntityType.getFilterablePropertyNames();
				ok(oComboBox.getKeys().length === aFilterableColumns.length);
			}
		});
	},

	theNumberOfSortableColumnKeysShouldRemainStable: function() {
		var oTable = null;
		this.waitFor({
			controlType: "sap.ui.table.Table",
			success: function(aTables) {
				oTable = aTables[0];
			}
		});
		return this.waitFor({
			controlType: "sap.m.ComboBox",
			success: function(aComboBoxes) {
				var oComboBox = aComboBoxes[0];
				var oResult = oTable.getModel().getAnalyticalExtensions().findQueryResultByName("ProductCollection");
				var aSortableColumns = oResult._oEntityType.getSortablePropertyNames();
				ok(oComboBox.getKeys().length - 1 === aSortableColumns.length); // (none) excluded
			}
		});
	},

	theDirtyFlagOnToolbarIsDisplayed: function(bIsDisplayed) {
		return this.waitFor({
			id: "IDDirtyFlagLabel",
			viewName: "Main",
			success: function(oLabel) {
				ok(test.sap.ui.comp.personalization.Util.hasDirtyFlag(oLabel) === bIsDisplayed);
			}
		});
	}
});
