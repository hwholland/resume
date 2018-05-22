/*globals QUnit*/
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");

(function (QUnit, Opa5) {
	
	Opa5.extendConfig({
		viewNamespace : "flSmartFormOpa.view.",
		arrangements : new Opa5({
			iStartTheFormSample : function () {

				return this.iStartMyAppInAFrame("../flSmartFormOpa/index.html?sap-client=000&sap-ui-debug=true&useMockServer=true&useFakeLrep=true&sap-ui-fl-changeMode=true");

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
			iPressTheAdaptButton: function () {
				return this.waitFor({
					viewName: "S1",
					id : "MainForm",
					success : function (oSmartForm) {
						oSmartForm.$('AdaptationButton').trigger("tap");
					},
					errorMessage : "did not find the Button"
				});
			},
			onAdaptationDialogFieldListGroup: function(group){
				return {
					field: function(field){
						return {
							iClickTheCheckBox: iClickCheckBox.bind(this, group, field),
							iSelectTheElement: iSelectTheElement.bind(this, group, field)
						};
					}.bind(this),
					iClickTheCheckBox : iClickCheckBox.bind(this, group, undefined),
					iSelectTheElement : iSelectTheElement.bind(this, group, undefined)
				};
			},
			iPressTheMoveButton: function(direction, times) {
				return this.waitFor({
					id : "smartFormPersDialog-Content-Move" + direction + "Button",
					success : function (oMoveButton) {
						times = times || 1;
						Array.apply(null, {length: times}).forEach(function(){
							oMoveButton.$().trigger("tap");
						});
					},
					errorMessage : "did not find the move " + direction + " button"
				});
			},
			iPressOk: function(){
				return this.waitFor({
					id : "smartFormPersDialog-OkButton",
					success : function (oOkButton) {
						oOkButton.$().trigger("tap");
					},
					errorMessage : "did not find the ok button"
				});
			}
		}),
		assertions: new Opa5({
			smartFormGroup: function(group){
				return {
					field: function(field){
						return {
							shouldBeVisible: shouldBeVisible.bind(this, group, field),
							shouldHaveId: shouldHaveId.bind(this, group, field)
						};
					}.bind(this),
					shouldBeVisible : shouldBeVisible.bind(this, group, undefined),
					shouldHaveId : shouldHaveId.bind(this, group, undefined)
				};
			},
			theAdaptationDialogShouldBeVisible: function(){
				return this.waitFor({
					id : "smartFormPersDialog",
					success : function (oAdapationDialog) {
						ok(oAdapationDialog, 'Adapation Dialog should be open');
					},
					errorMessage : "did not find the checkbox"
				});
			}
		})
	});

	function shouldBeVisible(group, field, visible){
		return this.waitFor({
			viewName : "S1",
			id : "MainForm",
			success : function (oSmartForm) {
				var element = oSmartForm.getGroups()[group];
				if (field !== undefined){
					element = element.getGroupElements()[field];
				}
				strictEqual(element.getVisible(), visible, 'Element ' + group + ' field ' + field + ' should be visible: ' + visible);
			},
			errorMessage : "did find the smart form"
		});
	}

	function shouldHaveId(group, field, id){
		return this.waitFor({
			viewName : "S1",
			id : "MainForm",
			success : function (oSmartForm) {
				var element = oSmartForm.getGroups()[group];
				if (field !== undefined){
					element = element.getGroupElements()[field];
				}
				var lastIdSegment = element.getId().split('--').pop();
				strictEqual(lastIdSegment, id, 'Element Group ' + group + ' field ' + field + ' should have id: ' + id);
			},
			errorMessage : "did find the smart form"
		});
	}

	function iClickCheckBox(group, field){
		return this.waitFor({
			id : "smartFormPersDialog-Content-FieldList",
			success : function (oFieldList) {
				var element = oFieldList.getNodes()[group];
				if (field !== undefined){
					element = element.getNodes()[field];
				}
				element.$('CheckBox').trigger("tap");
			},
			errorMessage : "did not find the checkbox"
		});
	}

	function iSelectTheElement(group, field){
		return this.waitFor({
			id : "smartFormPersDialog-Content-FieldList",
			success : function (oFieldList) {
				var element = oFieldList.getNodes()[group];
				if (field !== undefined){
					element = element.getNodes()[field];
				}
				element.$().trigger("click");
			},
			errorMessage : "did not find the element"
		});
	}

	QUnit.module("Adaptation Dialog Interacting with the SmartForm");

	opaTest("Should open the adaptation dialog and make the second field on the first group and the second group invisible", function(Given, When, Then) {
		Given.iStartTheFormSample();

		Then.smartFormGroup(0).field(1).shouldBeVisible(true);
		Then.smartFormGroup(1).shouldBeVisible(true);

		When.iWait(0).and.iPressTheAdaptButton();
		Then.theAdaptationDialogShouldBeVisible();

		When.onAdaptationDialogFieldListGroup(0).field(1).iClickTheCheckBox().and.onAdaptationDialogFieldListGroup(1).iClickTheCheckBox().and.iPressOk();

		Then.smartFormGroup(0).field(1).shouldBeVisible(false).and.smartFormGroup(1).shouldBeVisible(false);
	});

	opaTest("Should open the adaptation dialog and move the 4th field (AccountingDocumentHeaderText) of the first group to the third position in the third group", function(Given, When, Then) {
		When.iWait(0).and.iPressTheAdaptButton();
		Then.theAdaptationDialogShouldBeVisible();

		Then.smartFormGroup(0).field(3).shouldHaveId('GeneralLedgerDocument.AccountingDocumentHeaderText');

		When.onAdaptationDialogFieldListGroup(0).field(3).iSelectTheElement();
		When.iPressTheMoveButton('Bottom', 2).and.iPressTheMoveButton('Down', 2).and.iPressTheMoveButton('Top').and.iPressTheMoveButton('Down').and.iPressTheMoveButton('Up').and.iPressTheMoveButton('Down', 2);
		When.iPressOk();

		Then.smartFormGroup(2).field(2).shouldHaveId('GeneralLedgerDocument.AccountingDocumentHeaderText');
	});

})(QUnit, sap.ui.test.Opa5);