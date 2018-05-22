/*globals QUnit, ok, opaTest*/
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.fl.registry.Settings");

(function(QUnit, Opa5, Settings) {
	"use strict";

	QUnit.config.testTimeout  = 90000;

	Opa5.extendConfig({
		viewNamespace: "flSmartFormOpa.view.",
		arrangements: new Opa5({
			iAllowTheAdaptationButton: function () {
				sap.ui.fl.registry.Settings.allowFlexibilityAdaptationButton();
			},
			iStartTheFormSample: function() {

				return this.iStartMyAppInAFrame("../../../flSmartFormOpa/index.html?sap-client=000&useMockServer=true&useFakeLrep=true&sap-ui-fl-changeMode=true");

			}
		}),
		actions: new Opa5({
			iWait: function(iMs){
				var bReady = false;
				return this.waitFor({
					check: function() {
						setTimeout(function(){
							bReady = true;
						}, iMs);
						return bReady;
					},
					success: function() {
						ok(true, 'waited');
					},
					errorMessage: 'waited'
				});
			},
			iPressTheAdaptButton: function() {
				return this.waitFor({
					viewName: "S1",
					id: "MainForm",
					success: function(oSmartForm) {
						return this.waitFor({
							viewName: "S1",
							id: oSmartForm.getId() + "-" + oSmartForm._getCustomToolbar().getId() + "-AdaptationButton",
							success: function(oAdaptationButton) {
								oAdaptationButton.$().trigger("tap");
							},
							errorMessage: "did not find the Button"
						});
					},
					errorMessage: "did find the smart form"
				});
			},
			onAdaptationDialogFieldListGroup: function(group) {
				return {
					field: function(field) {
						return {
							iClickTheHideButton: iHideANode.bind(this, group, field),
							iSelectTheElement: iSelectTheElement.bind(this, group, field)
						};
					}.bind(this),
					iClickTheHideButton: iHideANode.bind(this, group, undefined),
					iSelectTheElement: iSelectTheElement.bind(this, group, undefined)
				};
			},
			iPressTheMoveButton: function(direction, times) {
				return this.waitFor({
					id: "smartFormPersDialog-Content-Move" + direction + "Button",
					success: function(oMoveButton) {
						times = times || 1;
						Array.apply(null, {
							length: times
						}).forEach(function() {
							oMoveButton.$().trigger("tap");
						});
					},
					errorMessage: "did not find the move " + direction + " button"
				});
			},
			iPressOk: function() {
				return this.waitFor({
					id: "smartFormPersDialog-OkButton",
					success: function(oOkButton) {
						oOkButton.$().trigger("tap");
					},
					errorMessage: "did not find the ok button"
				});
			},
			iPressTransport: function() {
				return this.waitFor({
					id: "smartFormPersDialog-TransportButton",
					success: function(oTransportButton) {
						oTransportButton.$().trigger("tap");
					},
					errorMessage: "did not find the transport button"
				});
			},
			iPressRestore: function() {
				return this.waitFor({
					id: "smartFormPersDialog-RestoreButton",
					success: function(oRestoreButton) {
						oRestoreButton.$().trigger("tap");
					},
					errorMessage: "did not find the restore button"
				});
			},
			iPressCancel: function() {
				return this.waitFor({
					id: "smartFormPersDialog-CancelButton",
					success: function(oCancelButton) {
						oCancelButton.$().trigger("tap");
					},
					errorMessage: "did not find the cancel button"
				});
			},
			iPressOkOnTransportDialog: function() {
				return this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Dialog",
					matchers: function(oDialog) {
						return oDialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_TRANSPORT_INAPPLICABLE_TITLE");
					},
					success: function(aDialogs) {
						aDialogs[0].getButtons()[0].$().trigger("tap");
					},
					errorMessage: "did not find the transport error dialog ok button"
				});
			},
			iPressCancelOnRestoreDialog: function() {
				return this.iPressButtonAtIndexOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_RESET_TITLE");
				}, 1, "did not find the restore dialog cancel button index 1");
			},
			iPressOkOnRestoreDialog: function() {
				return this.iPressButtonAtIndexOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_RESET_TITLE");
				}, 0, "did not find the restore dialog ok button index 0");
			},
			iPressOkOnRestoreSuccessDialog: function() {
				return this.iPressButtonAtIndexOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_DISCARD_SUCCESS_TITLE");
				}, 0, "did not find the restore success dialog ok button index 0");
			},
			iPressCancelOnTransportSelectionDialog: function() {
				return this.iPressButtonAtIndexOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromFlResourceBundle("TRANSPORT_DIALOG_TITLE_SIMPLE");
				}, 2, "did not find the transport selection dialog cancel button index 2");
			},
			iPressOkOnTransportSelectionDialog: function() {
				return this.iPressButtonAtIndexOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromFlResourceBundle("TRANSPORT_DIALOG_TITLE_SIMPLE");
				}, 1, "did not find the transport selection dialog ok button index 1");
			},
			iPressOkOnAllChangesTransportedDialog: function() {
				return this.iPressButtonAtIndexOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_TRANSPORT_SUCCESS_TITLE");
				}, 0, "did not find the all change have been made transportable dialog ok button index 0");
			},
			iPressButtonAtIndexOnDialog: function(fnMatcher, iIndex, sErrotMsg) {
				return this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Dialog",
					matchers: fnMatcher,
					success: function(aDialogs) {
						aDialogs[0].getButtons()[iIndex].$().trigger("tap");
					},
					errorMessage: sErrotMsg
				});
			}
		}),
		assertions: new Opa5({
			smartFormGroup: function(group) {
				return {
					field: function(field) {
						return {
							shouldBeVisible: shouldBeVisible.bind(this, group, field),
							shouldHaveId: shouldHaveId.bind(this, group, field)
						};
					}.bind(this),
					shouldBeVisible: shouldBeVisible.bind(this, group, undefined),
					shouldHaveId: shouldHaveId.bind(this, group, undefined)
				};
			},
			groupsOnPopup: function(groupIndex) {
				return {
					fieldsOnPopup: function(fieldIndex) {
						return {
							shouldBeVisible: shouldBeVisibleOnPopup.bind(this, groupIndex, fieldIndex),
							shouldHaveLabel: shouldHaveLabelOnPopup.bind(this, groupIndex, fieldIndex)
						};
					}.bind(this),
					shouldBeVisible: shouldBeVisibleOnPopup.bind(this, groupIndex, undefined),
					shouldHaveLabel: shouldHaveLabelOnPopup.bind(this, groupIndex, undefined)
				};
			},
			theAdaptationDialogShouldBeOpen: function() {
				return this.waitFor({
					id: "smartFormPersDialog",
					success: function(oAdapationDialog) {
						ok(oAdapationDialog, 'Adapation Dialog should be open');
					},
					errorMessage: "did not find the adaptation dialog",
					timeout: 15
				});
			},
			theAdaptationDialogShouldBeClosed: function() {
				return this.waitFor({
					check: function() {
						return !Opa5.getWindow().sap.ui.getCore().byId('smartFormPersDialog');
					},
					timeout: 2,
					success: function() {
						ok(true, 'The Adaptation Dialog is NOT open');
					},
					errorMessage: 'The Adaptation Dialog is NOT open'
				});
			},
			theRestoreDialogShouldBeOpen: function() {
				return this.dialogShouldBeOpen(function(oDialog) {
					return oDialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_RESET_TITLE");
				}, 'Restore dialog should be open', "Restore dialog should be open");
			},
			theRestoreDialogShouldBeClosed: function() {
				return this.dialogShouldBeClosed(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_RESET_TITLE");
				}, 'Restore dialog should be NOT open', 'Restore dialog should be NOT open');
			},
			theRestoreSuccessDialogShouldBeOpen: function() {
				return this.dialogShouldBeOpen(function(oDialog) {
					return oDialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_DISCARD_SUCCESS_TITLE");
				}, 'Restore success dialog should be open', "Restore success dialog should be open");
			},
			theRestoreSuccessDialogShouldBeClosed: function() {
				return this.dialogShouldBeClosed(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_DISCARD_SUCCESS_TITLE");
				}, 'Restore success dialog should be NOT open', 'Restore success dialog should be NOT open');
			},
			theTransportNotApplicableDialogShouldBeOpen: function() {
				return this.dialogShouldBeOpen(function(oDialog) {
					return oDialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_TRANSPORT_INAPPLICABLE_TITLE");
				}, 'Not applicable Transport Error Message is open', "Not applicable Transport Error Message is open");
			},
			theTransportNotApplicableDialogShouldBeClosed: function() {
				return this.dialogShouldBeClosed(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_TRANSPORT_INAPPLICABLE_TITLE");
				}, 'Not applicable Transport Error Message is NOT open', 'Not applicable Transport Error Message is NOT open');
			},
			theTransportSelectionDialogShouldBeOpen: function() {
				return this.dialogShouldBeOpen(function(dialog) {
					return dialog.getTitle() === getTextFromFlResourceBundle("TRANSPORT_DIALOG_TITLE_SIMPLE");
				}, 'Transport Select Dialog is open', "Did not find the select transport selection dialog");
			},
			theTransportSelectionDialogShouldBeClosed: function() {
				return this.dialogShouldBeClosed(function(dialog) {
					return dialog.getTitle() === getTextFromFlResourceBundle("TRANSPORT_DIALOG_TITLE_SIMPLE");
				}, 'Transport Selection Dialog is NOT open', 'Transport Selection Dialog is NOT open');
			},
			theAllChangesHaveBeenMadeTransportableDialogShouldBeOpen: function() {
				return this.dialogShouldBeOpen(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_TRANSPORT_SUCCESS_TITLE");
				}, 'All changes have been made transportable dialog is open', "Did not find the all changes have been made transportable dialog");
			},
			theAllChangesHaveBeenMadeTransportableDialogShouldBeClosed: function() {
				return this.dialogShouldBeClosed(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FORM_PERS_TRANSPORT_SUCCESS_TITLE");
				}, 'All changes have been made transportable dialog is NOT open', 'All changes have been made transportable dialog is NOT open');
			},
			dialogShouldBeOpen: function(fnMatcher, sSuccessMsg, sErrorMsg) {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					matchers: fnMatcher,
					success: function(aDialogs) {
						Opa5.assert.strictEqual(aDialogs.length, 1, sSuccessMsg);
					},
					errorMessage: sErrorMsg
				});
			},
			dialogShouldBeClosed: function(fnDialogCheck, sSuccessMsg, sErrorMsg) {
				return this.waitFor({
					check: function() {
						var frameJQuery = Opa5.getWindow().jQuery;
						var fnDialog = frameJQuery.sap.getObject('sap.m.Dialog');
						var dialogs = Opa5.getPlugin().getAllControlsInContainer(frameJQuery('body'), fnDialog);
						return !dialogs.some(fnDialogCheck);
					},
					timeout: 2,
					success: function() {
						ok(true, sSuccessMsg);
					},
					errorMessage: sErrorMsg
				});
			}
		})
	});

	function getTextFromCompResourceBundle(sTextKey) {
		return getTextFromResourceBundle('sap.ui.comp', sTextKey);
	}

	function getTextFromFlResourceBundle(sTextKey) {
		return getTextFromResourceBundle('sap.ui.fl', sTextKey);
	}

	function getTextFromResourceBundle(sLib, sTextKey) {
		var oCore = Opa5.getWindow().sap.ui.getCore();
		return oCore.getLibraryResourceBundle(sLib).getText(sTextKey);
	}

	function shouldBeVisible(group, field, visible) {
		return this.waitFor({
			viewName: "S1",
			id: "MainForm",
			success: function(oSmartForm) {
				var element = oSmartForm.getGroups()[group];
				if (field !== undefined) {
					element = element.getGroupElements()[field];
				}
				Opa5.assert.strictEqual(element.getVisible(), visible, 'Element ' + group + ' field ' + field + ' should be visible: ' + visible);
			},
			errorMessage: "did find the smart form"
		});
	}

	function shouldBeVisibleOnPopup(groupIndex, fieldIndex, visible) {
		return this.waitFor({
			id: "smartFormPersDialog-Content-FieldList",
			success: function(fieldList) {
				var targetNode = fieldList.getNodes()[groupIndex];
				if (fieldIndex >= 0) {
					targetNode = targetNode.getNodes()[fieldIndex];
				}
				Opa5.assert.strictEqual(targetNode.getIsVisible(), visible, 'Group ' + groupIndex + ' field ' + fieldIndex + ' should be visible: ' + visible + " on dirtaround");
			},
			errorMessage: "did find the fieldList of the dirtaround"
		});
	}

	function shouldHaveLabelOnPopup(groupIndex, fieldIndex, label) {
		return this.waitFor({
			id: "smartFormPersDialog-Content-FieldList",
			success: function(fieldList) {
				var targetNode = fieldList.getNodes()[groupIndex];
				if (fieldIndex >= 0) {
					targetNode = targetNode.getNodes()[fieldIndex];
				}
				Opa5.assert.strictEqual(targetNode.getLabel(), label, 'Element Group ' + groupIndex + ' field ' + fieldIndex + ' should have label: ' + label + " on dirtaround");
			},
			errorMessage: "did not find the smart form on dirtaround"
		});
	}

	function shouldHaveId(group, field, id) {
		return this.waitFor({
			viewName: "S1",
			id: "MainForm",
			success: function(oSmartForm) {
				var element = oSmartForm.getGroups()[group];
				if (field !== undefined) {
					element = element.getGroupElements()[field];
				}
				var lastIdSegment = element.getId().split('--').pop();
				Opa5.assert.strictEqual(lastIdSegment, id, 'Element Group ' + oSmartForm + ' field ' + field + ' should have id: ' + id);
			},
			errorMessage: "did find the smart form"
		});
	}

	function iHideANode(group, field) {
		return this.waitFor({
			id: "smartFormPersDialog-Content-FieldList",
			success: function(oFieldList) {
				var element = oFieldList.getNodes()[group];
				if (field !== undefined) {
					element = element.getNodes()[field];
				}

				element.setIsVisible(false);
			},
			errorMessage: "did not find the hide button"
		});
	}

	function iSelectTheElement(group, field) {
		return this.waitFor({
			id: "smartFormPersDialog-Content-FieldList",
			success: function(oFieldList) {
				var element = oFieldList.getNodes()[group];
				if (field !== undefined) {
					element = element.getNodes()[field];
				}
				element.$().trigger("click");
			},
			errorMessage: "did not find the element"
		});
	}

	// FIXME: test doesn't work in headless PhantomJS test cycle => commented out!
	QUnit.module("Adaptation Dialog Interacting with the SmartForm");
	if (!sap.ui.Device.browser.phantomJS) {

		opaTest("When I open the adaptation dialog and click transport, a not applicable message should appear, as there are nor changes to make transportable", function(Given, When, Then) {
			Given.iAllowTheAdaptationButton();
			Given.iStartTheFormSample();


			When.iWait(0).and.iPressTheAdaptButton();
			Then.theAdaptationDialogShouldBeOpen();

			When.iPressTransport();
			Then.theTransportNotApplicableDialogShouldBeOpen();

			When.iPressOkOnTransportDialog();

			Then.theTransportNotApplicableDialogShouldBeClosed();
			Then.theAdaptationDialogShouldBeClosed();
		});

		opaTest("When I press the adapt button, then the adaptation dialog should be open; When I press restore, then the restore dialog should should be open and the adaptation dialog should be open; When I press cancel on restore dialog, then the restore dialog should be closed, and the adaptation dialog should be open", function(Given, When, Then) {
			Given.iAllowTheAdaptationButton();

			When.iPressTheAdaptButton();
			Then.theAdaptationDialogShouldBeOpen();

			When.iPressRestore();
			Then.theRestoreDialogShouldBeOpen().and.theAdaptationDialogShouldBeOpen();

			When.iPressCancelOnRestoreDialog();

			Then.theRestoreDialogShouldBeClosed().and.theAdaptationDialogShouldBeOpen();
		});

		opaTest("When I press restore, then the restore and the adaptation dialog should be open; When I press ok on restore dialog, then the restore dialog should be closed and the restore success and the adaptation dialog should be open; When I press ok on restore success dialog, then the restore success and the adaptation dialog should be closed", function(Given, When, Then) {
			Given.iAllowTheAdaptationButton();

			When.iPressRestore();
			Then.theRestoreDialogShouldBeOpen().and.theAdaptationDialogShouldBeOpen();

			When.iPressOkOnRestoreDialog();
			Then.theRestoreDialogShouldBeClosed().and.theRestoreSuccessDialogShouldBeOpen().and.theAdaptationDialogShouldBeOpen();

			When.iPressOkOnRestoreSuccessDialog();
			Then.theRestoreSuccessDialogShouldBeClosed().and.theAdaptationDialogShouldBeClosed();
		});

		opaTest("Should open the adaptation dialog and make the second field on the first group and the second group invisible", function(Given, When, Then) {
			Given.iAllowTheAdaptationButton();

			Then.smartFormGroup(0).field(1).shouldBeVisible(true);
			When.iPressTheAdaptButton();
			Then.theAdaptationDialogShouldBeOpen();

			When.onAdaptationDialogFieldListGroup(0).field(1).iClickTheHideButton(); // hide field 'Document Number'

			When.iPressOk();
			Then.theAdaptationDialogShouldBeClosed();

			// Check if the field and group is
			Then.smartFormGroup(0).field(1).shouldBeVisible(false);

			// check if the field is invisible in the dirtaround we well
			When.iPressTheAdaptButton();
			Then.theAdaptationDialogShouldBeOpen();
			Then.groupsOnPopup(0).fieldsOnPopup(1).shouldHaveLabel("Document Number");
			Then.groupsOnPopup(0).fieldsOnPopup(0).shouldHaveLabel("Company Code");

			When.iPressCancel();
			Then.theAdaptationDialogShouldBeClosed();
		});

		opaTest("Should open the adaptation dialog and make the second group invisible", function(Given, When, Then) {
			Given.iAllowTheAdaptationButton();

			Then.smartFormGroup(1).shouldBeVisible(true);
			When.iPressTheAdaptButton();
			Then.theAdaptationDialogShouldBeOpen();

			When.onAdaptationDialogFieldListGroup(1).iClickTheHideButton(); // hide 'Dates' section

			When.iPressOk();
			Then.theAdaptationDialogShouldBeClosed();

			// Check if the group is invisible
			Then.smartFormGroup(1).shouldBeVisible(false);

			// check if the group is invisible in the dirtaround as well
			When.iPressTheAdaptButton();
			Then.theAdaptationDialogShouldBeOpen();
			Then.groupsOnPopup(1).shouldBeVisible(false);

			When.iPressCancel();
			Then.theAdaptationDialogShouldBeClosed();
		});

		opaTest("Should open the adaptation dialog and move the 4th field (AccountingDocumentHeaderText) of the first group to the second position in the third group", function(Given, When, Then) {
			Given.iAllowTheAdaptationButton();

			When.iPressTheAdaptButton();
			Then.theAdaptationDialogShouldBeOpen();

			Then.smartFormGroup(0).field(3).shouldHaveId('GeneralLedgerDocument.AccountingDocumentHeaderText');

			When.onAdaptationDialogFieldListGroup(0).field(2).iSelectTheElement();
			When.iPressTheMoveButton('Bottom', 2).and.iPressTheMoveButton('Down', 2).and.iPressTheMoveButton('Top').and.iPressTheMoveButton('Down').and.iPressTheMoveButton('Up').and.iPressTheMoveButton('Down', 2);
			When.iPressOk();
			Then.theAdaptationDialogShouldBeClosed();

			//Then.smartFormGroup(3).field(2).shouldBeVisible(true);
			Then.smartFormGroup(3).field(2).shouldHaveId('GeneralLedgerDocument.FiscalYear');

		});

		opaTest("When I open the adaptation dialog and click transport, a transport selection dialog should appear, as there are now changes that are transportable; I cancel it", function(Given, When, Then) {
			Given.iAllowTheAdaptationButton();

			When.iPressTheAdaptButton();
			Then.theAdaptationDialogShouldBeOpen();

			When.iPressTransport();
			Then.theTransportSelectionDialogShouldBeOpen();

			When.iPressCancelOnTransportSelectionDialog();

			Then.theTransportSelectionDialogShouldBeClosed().and.theAdaptationDialogShouldBeClosed();
		});

		opaTest("When I open the adaptation dialog and click transport, a transport selection dialog should appear, as there are now changes that are transportable; I select the first one and click ok", function(Given, When, Then) {
			Given.iAllowTheAdaptationButton();

			When.iPressTheAdaptButton();
			Then.theAdaptationDialogShouldBeOpen();

			When.iPressTransport();
			Then.theTransportSelectionDialogShouldBeOpen();

			When.iPressOkOnTransportSelectionDialog();

			Then.theTransportSelectionDialogShouldBeClosed();
			Then.theAllChangesHaveBeenMadeTransportableDialogShouldBeOpen();

			When.iPressOkOnAllChangesTransportedDialog();

			Then.theAllChangesHaveBeenMadeTransportableDialogShouldBeClosed().and.theAdaptationDialogShouldBeClosed();
		});

	} else {
		QUnit.test("Pseudo Test", function() {
			ok(true, "FIXME! The test is not working in headless PhantomJS test run!");
		});
	}

})(QUnit, sap.ui.test.Opa5, sap.ui.fl.registry.Settings);
