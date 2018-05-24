/*globals QUnit, ok, opaTest*/
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");

jQuery.sap.require("sap.ui.Device");

(function(QUnit, Opa5) {
	"use strict";

	QUnit.config.testTimeout  = 90000;

	Opa5.extendConfig({
		viewNamespace: "view.",
		arrangements: new Opa5({
			iStartTheFormSample: function() {

				return this.iStartMyAppInAFrame("../../../comp/filterbar/filterBarTest.html");

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
						Opa5.assert.ok(true, 'waited');
					},
					errorMessage: 'waited'
				});
			},
			iPressTheFiltersButton: function() {
				
				return this.waitFor({
					controlType: "sap.m.Button",
					success: function(aButtons) {
						var oFiltersButton = aButtons[aButtons.length-2];
						oFiltersButton.$().trigger("tap");
					},
					errorMessage: "did not find the button 'Filters'"
				});
			},	
			iPressTheMoreLink: function() {
				return this.waitFor({
					controlType: "sap.m.Link",					
					success: function(aLink) {												
						var oEventName = ((sap.ui.Device.system.phone) || (sap.ui.Device.system.tablet)) ? "tap" : "click";					
						aLink[0].$().trigger(oEventName);						
					},
					errorMessage: "did not find the change filters link"
				});
			},
			
			iPressCancelOnSelectFiltersDialog: function() {
				return this.iPressButtonOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("SELECT_FILTER_FIELDS");
				}, "FILTER_BAR_CANCEL", "Cancel-button on 'Select Filters' dialog not found");
			},			

			iPressCancelOnFiltersDialog: function() {
				return this.iPressButtonOnDialog(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FILTER_BAR_ADV_FILTERS_DIALOG");
				}, "FILTER_BAR_CANCEL", "Cancel-button on 'Select Filters' dialog not found");
			},				
			
			iPressButtonOnDialog: function(fnMatcher, sButtonTextKey, sErrorMsg) {
				return this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Dialog",
					matchers: fnMatcher,
					success: function(aDialogs) {
						var oCancelButton = this.retrieveButton(aDialogs[0].getButtons(), getTextFromCompResourceBundle(sButtonTextKey));
						if (oCancelButton) {
							oCancelButton.$().trigger("tap");
						}
					},
					errorMessage: sErrorMsg
				});
			},
			
			retrieveButton: function(aButtons, sButtonText) {
				
				for (var i=0; i < aButtons.length; i++) {
					if (aButtons[i].getText() === sButtonText) {
						return aButtons[i];
					}
				}
				
				return null;
			}
			
		}),
		assertions: new Opa5({
			theFiltersDialogShouldBeOpen: function() {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					success: function(aDialogs) {
						Opa5.assert.ok(aDialogs[0], 'Filters Dialog should be open');
						Opa5.assert.equal(aDialogs[0].getTitle(), getTextFromCompResourceBundle("FILTER_BAR_ADV_FILTERS_DIALOG"));						
					},
					errorMessage: "did not find the filters dialog",
					timeout: 15
				});
			},
			theSelectFiltersDialogShouldBeOpen: function() {
				return this.waitFor({
					controlType: "sap.m.Dialog",
					success: function(aDialogs) {
						Opa5.assert.ok(aDialogs[1], 'Select Filters Dialog should be open');
						Opa5.assert.equal(aDialogs[1].getTitle(), getTextFromCompResourceBundle("SELECT_FILTER_FIELDS"));						
					},
					errorMessage: "did not find the 'Select Filters' dialog",
					timeout: 15
				});
			},		
			checkFilterBarExistence: function() {				
				return this.waitFor({
					id: "theFilterBar",
					success: function(oFilterBar) {
						Opa5.assert.ok(oFilterBar, 'FilterBar should be visible');
					},
					errorMessage: "did not find the 'Select Filters' dialog",
					timeout: 15
				});
			},			
			checkHideFilterBarButtonState: function() {
				return this.waitFor({
					controlType: "sap.m.Button",
					success: function(aButtons) {
						var oHideShowFilterBar = null;
						var sTextShow = getTextFromCompResourceBundle("FILTER_BAR_SHOW");
						var sTextHide = getTextFromCompResourceBundle("FILTER_BAR_HIDE");
						for (var i=0; i < aButtons.length; i++) {
							if ((aButtons[i].getText() === sTextShow) || (aButtons[i].getText() === sTextHide)) {
								oHideShowFilterBar = aButtons[i];
								break;
							}
						}
						if (sap.ui.Device.system.phone) {
							Opa5.assert.ok(!oHideShowFilterBar, 'oHideShowFilterBar should not be displayed');
						} else if (sap.ui.Device.system.tablet && !sap.ui.Device.system.desktop) {
							Opa5.assert.ok(oHideShowFilterBar, 'oShowHideFilterBar should be displayed');
							Opa5.assert.equal(oHideShowFilterBar.getText(), sTextShow);
						} else {
							Opa5.assert.ok(oHideShowFilterBar, 'oHideShowFilterBar should be displayed');
							Opa5.assert.equal(oHideShowFilterBar.getText(), sTextHide);							
						}							
					},
					errorMessage: "did not find the button 'hide show filters'",
					timeout: 15
				});
			},		
					
			theFiltersDialogShouldBeClosed: function() {
				return this.dialogShouldBeClosed(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("FILTER_BAR_ADV_FILTERS_DIALOG");
				}, 'dialog is closed', 'dialog should be closed');
			},
			theSelectDialogShouldBeClosed: function() {
				return this.dialogShouldBeClosed(function(dialog) {
					return dialog.getTitle() === getTextFromCompResourceBundle("SELECT_FILTER_FIELDS");
				}, 'dialog is closed', 'dialog should be closed');
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
						Opa5.assert.ok(true, sSuccessMsg);
					},
					errorMessage: sErrorMsg
				});
			},			
		})
	});			

	
	function getTextFromCompResourceBundle(sTextKey) {
		return getTextFromResourceBundle('sap.ui.comp', sTextKey);
	}

	function getTextFromResourceBundle(sLib, sTextKey) {
		var oCore = Opa5.getWindow().sap.ui.getCore();
		return oCore.getLibraryResourceBundle(sLib).getText(sTextKey);
	}
	
	// FIXME: test doesn't work in headless PhantomJS test cycle => commented out!
	QUnit.module("FilterBar interactions");
	if (!sap.ui.Device.browser.phantomJS) {

		opaTest("Initial Display", function(Given, When, Then) {
			Given.iStartTheFormSample();

			When.iWait(0);
			Then.checkFilterBarExistence();
			
			if (!sap.ui.Device.system.phone) {		
				Then.checkHideFilterBarButtonState();
			}
	        			
		});

		opaTest("Open the Dialogs", function(Given, When, Then) {

			When.iPressTheFiltersButton();
			Then.theFiltersDialogShouldBeOpen();		
				
			When.iPressTheMoreLink();
			Then.theSelectFiltersDialogShouldBeOpen();				
			
		});		
	

		opaTest("Closing the Select Filters Dialog", function(Given, When, Then) {

			When.iPressCancelOnSelectFiltersDialog();
			Then.theSelectDialogShouldBeClosed();						
			
		});				

		opaTest("Closing the Filters Dialog", function(Given, When, Then) {

			When.iPressCancelOnFiltersDialog();
			Then.theFiltersDialogShouldBeClosed();						
			
		});			
		
		
	} else {
		QUnit.test("Pseudo Test", function() {
			ok(true, "FIXME! The test is not working in headless PhantomJS test run!");
		});
	}

})(QUnit, sap.ui.test.Opa5);	