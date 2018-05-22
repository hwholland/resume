
/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */

(function() {
	jQuery.sap.require("sap.ui.test.Opa5");
	jQuery.sap.require("sap.ui.test.opaQunit");
	jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
	// Arrangements
	var Arrangements = sap.ui.test.Opa5.extend("arrangement", {});
	// Actions
	var myActions = jQuery.extend({}, sap.apf.tests.integration.withMockServer.helper.CommonActions);
	
	//Remove the first step
	myActions.iRemoveTheStep = function() {
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
	
	//To Make step active & inactive
	myActions.iMakeFirstStepActive= function() {
		return this.waitFor({
			success : function() {
				var jQuery = sap.ui.test.Opa5.getJQuery(); // Get jQuery of iFrame.
				var e = jQuery.Event("keydown");
				e.which = 13; // # Enter Key Code 
				jQuery(jQuery(".DnD-block")[1]).trigger(e);
			}
		});
	};
	
	//Swap the steps
	myActions.iSwapTheSteps = function () {
		return this.waitFor({
			viewName : "layout",
			controlType : "sap.m.Button",
			success : function(aButtons) {
				var oAddStepButton = aButtons[6];
				oAddStepButton.$().trigger("tap");
			}
		});
	}
	
	//Saving Path
	myActions.iClickObjectHeader = function () {
		return this.waitFor({
			viewName : "layout",
			controlType : "sap.m.ObjectHeader",
			success : function(header) {
				var oButton = header[0];
				oButton.$().find(".sapMOHTitleArrow .sapUiIcon").trigger("click");
			}
		});	
	}
	
	myActions.iSavePath = function () {
		return this.waitFor({
			viewName : "layout",
			check: function (ele) {
				var jQuery = sap.ui.test.Opa5.getJQuery();
				var popover = jQuery(".sapMPopover");
				return popover.length;
			},
			success : function() {
				var jQuery = sap.ui.test.Opa5.getJQuery();
				jQuery(".sapMPopover li:eq(2)").trigger("tap");
			}
		});	
	}
	
	myActions.iClickOnSave = function () {
		this.waitFor({
            searchOpenDialogs : true,
            controlType : "sap.m.Button",
            success : function (btn) {
            	btn[0].setEnabled();
            	btn[0].$().trigger("tap");
            },
            errorMessage : "Did not find the dialog"
        });
	}
	
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
		iShouldSeeTheSecondStep : function() {
			return this.waitFor({
				viewName : "step",
				success : function(aSteps) {
					var oSecondStep = aSteps[1];
					this.getContext().oSecondStep = oSecondStep;
					ok(oSecondStep, "Second Step Added!");
				}
			});
		},
		iShouldSeeTheStepsSwapped : function () {
			return this.waitFor({
				viewName : "step",
				check : function () {
					var jQuery = sap.ui.test.Opa5.getJQuery();
					var block = jQuery(".DnD-block")[2];
					return !jQuery(block).position().top;
				},
				success : function(aSteps) {
					var jQuery = sap.ui.test.Opa5.getJQuery();
					var secondBlock = jQuery(".DnD-block")[2];
					ok(jQuery(secondBlock).position().top === 0, "Second Step is swapped to first position");
				}
			});
		},
		iShouldNotSeeAnyStep : function() {
			return this.waitFor({
				success : function() {
					var jQuery = sap.ui.test.Opa5.getJQuery();
					var bIsFirstStepPresent = this.getContext().oFirstStep.$().length;
					var headerText = jQuery(".sapApfObjectHeader").text();
					var chartContainerText = jQuery(".initialText").text();
					ok(!bIsFirstStepPresent, "Step are Removed!");
					equal(headerText.charAt(0), "*", "Currently in dirty state");
					equal(chartContainerText, "To start your analysis, add an analysis step or open a saved analysis path", "Chart container is empty with information message");
				}
			});
		},
		iShouldSeeMsgDialog : function () {
            this.waitFor({
                searchOpenDialogs : true,
                controlType : "sap.m.Text",
                success : function (text) {
                	equal(text[0].$().text(), "Add at least one step to the path before saving", "Cannot save path with empty steps");
                },
                errorMessage : "Did not find the dialog"
            });
        },
		iShouldSeeSaveMsgDialog : function () {
            this.waitFor({
                searchOpenDialogs : true,
                controlType : "sap.m.Input",
                success : function (input) {
                	input[0].$().find("input").val("New Save Path");
                	equal(input[0].$().find("input").val(), "New Save Path", "Save Dialog exists with input");
                },
                errorMessage : "Did not find the dialog"
            });
        },
        iShouldSeeSaveMsgToast : function () {
        	return this.waitFor({
				success : function(msg) {
					var jQuery = sap.ui.test.Opa5.getJQuery();
					equal(jQuery(".sapMMessageToast").text(),"Path 'New Save Path' saved ", "Path Saved Successfully");
				}
			});
        },
        iShouldSeeFirstActiveChart : function () {
        	return this.waitFor({
        		viewName : "layout",
				success : function(layout) {
					var vizChart = layout[0].$().find(".viz-controls-chart-layer:eq(1)").length;
					equal(vizChart, 1, "Line Chart is active chart is the main container");
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
	
	window.opaTest("Creating Second Step", function(Given, When, Then) {
		// Add a Step to path (TIME >> Revenue and Receivables over Time >> Clustered Column Chart)
		When.iAddAStep("Time", "Revenue and Receivables over Time", "Clustered Column Chart");
		Then.iShouldSeeTheSecondStep();
	});
	
	window.opaTest("Swap the Step", function(Given, When, Then) {
		When.iSwapTheSteps();
		Then.iShouldSeeTheStepsSwapped();
	});
	
	window.opaTest("Set the first step active and second step inactive", function(Given, When, Then) {
		// Add a Step to path (TIME >> Revenue and Receivables over Time >> Clustered Column Chart)
		When.iMakeFirstStepActive();
		Then.iShouldSeeFirstActiveChart();
	});
	
	window.opaTest("Check Save Dialog with input text", function(Given, When, Then) {
		When.iClickObjectHeader().and.iSavePath();
		Then.iShouldSeeSaveMsgDialog();
	});
	
	window.opaTest("Save the path", function(Given, When, Then) {
		When.iClickOnSave();
		Then.iShouldSeeSaveMsgToast();
	});
	
	window.opaTest("Removing Step & Checking Dirty State & Checking Text in Chart Container", function(Given, When, Then) {
		// Tap on Remove Icon on Step
		When.iRemoveTheStep().and.iRemoveTheStep();
		Then.iShouldNotSeeAnyStep();
	});
	
	window.opaTest("Saving path with empty steps", function (Given, When, Then) {
		When.iClickObjectHeader().and.iSavePath();
		Then.iShouldSeeMsgDialog();
	});
	
}());
