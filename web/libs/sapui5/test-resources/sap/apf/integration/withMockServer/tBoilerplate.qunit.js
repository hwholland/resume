(function() {
	jQuery.sap.registerModulePath('sap.apf.tests.integration', '../');
	jQuery.sap.require("sap.apf.tests.integration.withMockServer.helper");
	jQuery.sap.require("sap.ui.test.Opa5");
	jQuery.sap.require("sap.ui.test.opaQunit");
	jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
	// Arrangements
	var Arrangements = sap.ui.test.Opa5.extend("arrangement", {});
	// Actions
	var myActions = jQuery.extend({}, sap.apf.tests.integration.withMockServer.helper.CommonActions);
	myActions.iRemoveTheFirstStep = function() {
		return this.waitFor({
			check : function() {
				var jQuery = sap.ui.test.Opa5.getJQuery(); // Get jQuery of iFrame.
				return jQuery('.DnD-removeIconWrapper').length;
			},
			success : function() {
				var oWindow = sap.ui.test.Opa5.getWindow(); // Get iFrame window.
				var oDocument = oWindow.document;
				var oEvt = oDocument.createEvent("MouseEvents");
				oEvt.initMouseEvent("mousedown", true, true, oWindow, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				var oRemoveIcon = oDocument.getElementsByClassName("DnD-removeIconWrapper")[0];
				oRemoveIcon.dispatchEvent(oEvt);
			}
		});
	};
	var Actions = sap.ui.test.Opa5.extend("action", myActions);
	// Assertions
	var Assertions = sap.ui.test.Opa5.extend("assertion", {
		iShouldSeeTheAddStepButton : function() {
			return this.waitFor({
				viewName : "carousel",
				controlType : "sap.m.Button",
				success : function(aButtons) {
					ok(aButtons[0], "Add Button is found!");
				}
			});
		},
		iShouldSeeTheFirstStep : function() {
			return this.waitFor({
				viewName : "step",
				success : function(aSteps) {
					var oFirstStep = aSteps[0];
					this.getContext().oFirstStep = oFirstStep;
					ok(oFirstStep, "First Step Added!");
				}
			});
		},
		iShouldNotSeeAnyStep : function() {
			return this.waitFor({
				success : function() {
					var bIsFirstStepPresent = this.getContext().oFirstStep.$().length;
					ok(!bIsFirstStepPresent, "First Step is Removed!");
				}
			});
		}
	});
	sap.ui.test.Opa5.extendConfig({
		arrangements : new Arrangements(),
		actions : new Actions(),
		assertions : new Assertions(),
		viewNamespace : "sap.apf.ui.reuse.view."
	});
	window.opaTest("Check Add Step Button", function(Given, When, Then) {
		Given.iStartMyAppInAFrame("../../demokit/app/index.html?sap-ui-language=EN");
		When.iLookAtTheScreen();
		Then.iShouldSeeTheAddStepButton();
	});
	window.opaTest("Creating First Step", function(Given, When, Then) {
		// Add a Step to path (TIME >> Revenue and Receivables over Time >> Line Chart)
		When.iAddAStep("Time", "Revenue and Receivables over Time", "Line Chart");
		Then.iShouldSeeTheFirstStep();
	});
	window.opaTest("Removing First Step", function(Given, When, Then) {
		// Tap on Remove Icon on Step
		When.iRemoveTheFirstStep();
		Then.iShouldNotSeeAnyStep();
	});
}());
