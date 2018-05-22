jQuery.sap.declare("sap.ui.comp.qunit.personalization.test.Action");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.actions.Press");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
jQuery.sap.require("sap.ui.comp.qunit.personalization.test.Util");

sap.ui.comp.qunit.personalization.test.Action = sap.ui.test.Opa5.extend("sap.ui.comp.qunit.personalization.test.Action", {

	iLookAtTheScreen: function() {
		return this;
	},

	iPressOnPersonalizationButton: function() {
		return this.waitFor({
			viewName: "Main",
			id: "IDP13nDialogButton",
			actions: new sap.ui.test.actions.Press(),
			errorMessage: "The personalization button was not pressable"
// success: function(oButton) {
// oButton.$().trigger("tap");
// }
		});
	},

	iClickOnTheCheckboxSelectAll: function() {
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
			success: function() {
				oSelectAllCheckbox.$().trigger("tap");
			}
		});
	},

	iNavigateToPanel: function(sPanelType) {
		if (sap.ui.Device.system.phone) {
			return this.waitFor({
				controlType: "sap.m.List",
				success: function(aLists) {
					var oItem = sap.ui.comp.qunit.personalization.test.Util.getNavigationItem(aLists[0], sap.ui.comp.qunit.personalization.test.Util.getTextOfPanel(sPanelType));
					oItem.$().trigger("tap");
				}
			});
		}
		return this.waitFor({
			controlType: "sap.m.SegmentedButton",
			success: function(aSegmentedButtons) {
				var oGroupButton = sap.ui.comp.qunit.personalization.test.Util.getNavigationItem(aSegmentedButtons[0], sap.ui.comp.qunit.personalization.test.Util.getTextOfPanel(sPanelType));
				oGroupButton.$().trigger("tap");
			}
		});
	},

	iSelectColumn: function(sColumnName) {
		return this.waitFor({
			controlType: "sap.m.CheckBox",
			success: function(aCheckBoxes) {
				aCheckBoxes.some(function(oCheckBox) {
					var oItem = oCheckBox.getParent();
					if (oItem.getCells) {
						var oText = oItem.getCells()[0];
						if (oText.getText() === sColumnName) {
							oCheckBox.$().trigger("tap");
							return true;
						}
					}
				});
			}
		});
	},

	iPressRemoveLineButton: function() {
		var oFirstRemoveLineButton;
		return this.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.Button",
			check: function(aButtons) {
				return aButtons.some(function(oButton) {
					if (oButton.getIcon() !== "sap-icon://sys-cancel") {
						return false;
					}
					if (!oFirstRemoveLineButton) {
						oFirstRemoveLineButton = oButton;
					}
					return true;
				});
			},
			success: function() {
				oFirstRemoveLineButton.$().trigger("tap");
			}
		});
	},

	iPressRestoreButton: function() {
		var oRestoreButton;
		return this.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.Button",
			check: function(aButtons) {
				return aButtons.filter(function(oButton) {
					if (oButton.getText() !== sap.ui.comp.qunit.personalization.test.Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_RESET")) {
						return false;
					}
					oRestoreButton = oButton;
					return true;
				});
			},
			success: function(aButtons) {
				oRestoreButton.$().trigger("tap");
			}
		});
	},

	iPressCancelButton: function() {
		var oCancelButton;
		return this.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.Button",
			check: function(aButtons) {
				return aButtons.filter(function(oButton) {
					if (oButton.getText() !== sap.ui.comp.qunit.personalization.test.Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_CANCEL")) {
						return false;
					}
					oCancelButton = oButton;
					return true;
				});
			},
			success: function(aButtons) {
				oCancelButton.$().trigger("tap");
			}
		});
	},

	iPressOkButton: function() {
		var oOKButton;
		return this.waitFor({
			searchOpenDialogs: true,
			controlType: "sap.m.Button",
			check: function(aButtons) {
				return aButtons.filter(function(oButton) {
					if (oButton.getText() !== sap.ui.comp.qunit.personalization.test.Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_OK")) {
						return false;
					}
					oOKButton = oButton;
					return true;
				});
			},
			success: function(aButtons) {
				oOKButton.$().trigger("tap");
			},
			errorMessage: "Did not find the 'OK' button"
		});
	},

	iChangeSortSelectionTo: function(sColumnKey) {
		var oComboBox = null;
		this.waitFor({
			controlType: "sap.m.ComboBox",
			success: function(aComboBoxes) {
				oComboBox = aComboBoxes[0];
			}
		});
		return this.waitFor({
			controlType: "sap.m.ComboBox",
			matchers: function(oControl) {
				return oComboBox.getId() === oControl.getId() && !!oControl.getDomRef("arrow");
			},
			success: function(aComboBoxes) {
				var oComboBox = aComboBoxes[0];
				oComboBox.focus();
				oComboBox.setValue(sColumnKey);
			}
		});
	},

	iChangeFilterSelectionToDate: function(sDate) {
		return this.waitFor({
			controlType: "sap.m.DatePicker",
			success: function(aDatePickers) {
				var oDatePicker = aDatePickers[0];
				oDatePicker.setValue(sDate);
			}
		});
	},

	iSimulateSettingVariant: function() {
		return this.waitFor({
			id: "IDSetVariantButton",
			viewName: "Main",
			success: function(oButton) {
				oButton.$().trigger("tap");
			}
		});
	},

	iPressBackButton: function() {
		var oBackButton;
		return this.waitFor({
			controlType: "sap.m.Button",
			check: function(aButtons) {
				return aButtons.filter(function(oButton) {
					if (oButton.getType() !== "Back") {
						return false;
					}
					oBackButton = oButton;
					return true;
				});
			},
			success: function(aButtons) {
				oBackButton.$().trigger("tap");
			}
		});
	}
});
