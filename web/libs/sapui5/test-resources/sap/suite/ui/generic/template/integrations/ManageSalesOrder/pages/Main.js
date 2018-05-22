sap.ui.require([
	"sap/ui/test/Opa5", "sap/suite/ui/generic/template/integrations/ManageSalesOrder/pages/Common", "sap/ui/test/matchers/AggregationLengthEquals", "sap/ui/test/matchers/AggregationFilled"
], function(Opa5, Common, AggregationLengthEquals, AggregationFilled) {
	"use strict";
	var first_sales_order = null;
	Opa5.createPageObjects({
		onTheMainPage: {
			baseClass: Common,
			actions: {

				clickGo: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
									new sap.ui.test.matchers.PropertyStrictEquals({
										name: "text",
										value: "Go"
									}),

									function(oButton) {
										return oButton.getEnabled();
									}
								],
						success: function(oButton) {
							oButton[0].$().trigger("tap");

						},
						errorMessage: "Did not find the 'Start' button."
					});
				},

				clickSetting: function() {
					var SettingsButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://action-settings") {
									return false;
								}

								SettingsButton = oButton;
								return true;
							});
						},

						success: function() {
							SettingsButton.$().trigger("tap");

						},
						errorMessage: "Did not find the 'Setting' button."
					});
				},

				closeDialog: function() {
					var cancelButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Cancel"
						}),

						success: function(oButton) {
							oButton[0].$().trigger("tap");

						},
						errorMessage: "Did not find the 'Setting' button."
					});
				},

				removeFilter: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.InputBase",
						// viewName : sViewName,
						success: function(oInputBase) {
							var empty;
							oInputBase[0].setValue(empty);

						},
						errorMessage: "Filter removed sucessfully."
					});
				},
				
				
				iWaitUntilTheBusyIndicatorIsGone : function() {
					return this.waitFor({
						controlType: "sap.m.Table",
							
						matchers: [
									new AggregationFilled({
										name: "items"
									}),
									
									function(oTable) {

										var oFirstItem = oTable.getItems()[0].getBindingContext().getPath();
										var itm = oTable.getItems()[0].getBindingContext().getObject(oFirstItem);
 								

			                        return itm.ActiveSalesOrder === "500000001";
									},
									
									
								],
								
								
						errorMessage: "The Table is still visible"
					});
				},
				
				
				iWaitUntilTheListIsNotVisible: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: function(oTable) {
							// visible false also returns visible controls so we need an extra check here

							if (oTable._busyTabIndices.length == 0) {
								return oTable.$().is(":visible");
							} else {
								return !oTable.$().is(":visible");
							}

						},
						errorMessage: "The Table is still visible"
					});
				},
				
				
				clickFilter: function() {
					var cancelButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Filters"
						}),

						success: function(oButton) {
							oButton[0].$().trigger("tap");

						},
						errorMessage: "Did not find the 'Filters' button."
					});
				},

				clickFilterLink: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Link",
						success: function(oLinks) {
							oLinks[0].firePress();

						},
						errorMessage: "Did not find the 'Filters links'."
					});
				},

				selectFilter: function() {

					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.CheckBox",
						success: function(oFilter) {
							var selected = true;
							oFilter[0].$().trigger("tap");
							oFilter[1].$().trigger("tap");
							oFilter[2].$().trigger("tap");
							oFilter[3].$().trigger("tap");
							oFilter[4].$().trigger("tap");
							oFilter[5].$().trigger("tap");
							oFilter[6].$().trigger("tap");
							oFilter[7].$().trigger("tap");
						

						},
						errorMessage: "Did not find the 'Filter'."
					});
				},

				clickFilterOk: function() {

					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "OK"
						}),

						success: function(oButton) {
							oButton[0].$().trigger("tap");

						},
						errorMessage: "Did not find the 'Filter Ok' button."
					});
				},

				clickFilterGo: function() {
					var cancelButton = null;
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Go"
						}),

						success: function(oButton) {
							oButton[0].$().trigger("tap");

						},
						errorMessage: "Did not find the 'Filters Go'."
					});
				}
			},

			assertions: {
				iShouldSeeThePageTitle: function() {
					return this.waitFor({
						controlType: "sap.m.Title",
						timeout: 70,
						success: function() {
							QUnit.ok(true, "The main page has a title.");
						},
						errorMessage: "Can't see the main page title."
					});
				},

				thePageTitleIsCorrect: function() {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Manage Sales Orders",
							timeout: 70
						}),
						success: function(oTitle) {
							QUnit.ok(oTitle[0].getText() === "Manage Sales Orders", "The Main page title is correct.");
						},
						errorMessage: "The main page title is incorrect."
					});
				},

				checkGoButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Go"
						}),
						// viewName : sViewName,
						success: function(oButton1) {
							QUnit.ok(true, "The page has a Go button.");
						},
						errorMessage: "The page has no Go button."
					});
				},

				checkAddButton: function() {
					var addButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://add") {
									return false;
								}

								addButton = oButton;
								return true;
							});
						},

						success: function(aButtons) {
							QUnit.ok(true, "The page has a add button.");
							for (var int = 0; int < aButtons.length; int++) {
								console.log(aButtons[int].getIcon());
							}
						},
						errorMessage: "The page has no add button."
					});
				},

				checkHideFilterButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Hide Filter Bar"
						}),
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Hide Filter Bar button.");
						},
						errorMessage: "The page has no Hide Filter Bar button."
					});
				},

				checkShowFilterButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Show Filter Bar"
						}),
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Show Filter Bar button.");
						},
						errorMessage: "The page has no Show Filter Bar button."
					});
				},
				
				
				
				checkFilterButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Filters"
						}),
						success: function(oButton2) {
							QUnit.ok(true, "The page has a Filters button.");
						},
						errorMessage: "The page has no Filters button."
					});
				},

				checkSettingButton: function() {
					var SettingsButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://action-settings") {
									return false;
								}

								SettingsButton = oButton;
								return true;
							});
						},

						success: function() {
							QUnit.ok(true, "The page has a setting button.");

						},
						errorMessage: "The page has no setting button."
					});
				},

				checkExportButton: function() {
					var ExportButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://excel-attachment") {
									return false;
								}

								ExportButton = oButton;
								return true;
							});
						},

						success: function() {
							QUnit.ok(true, "The page has a excel export button.");
						},
						errorMessage: "The page has no excel export button."
					});
				},

				dialogOpen: function() {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "View Settings"
						}),
						// viewName : sViewName,
						success: function(oTitle) {
							QUnit.ok(true, "Setting Dialog opened with a title");
						},
						errorMessage: "Setting Dialog not opened with a title."
					});
				},

				dialogTitle: function() {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "View Settings"
						}),
						// viewName : sViewName,
						success: function(oTitle) {

							QUnit.ok(oTitle[0].getText() === "View Settings", "The page title is correct.");
						},
						errorMessage: "Setting Dialog page title is incorrect"
					});
				},

				theListIsDisplayed: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						// id : "listReport",
						matchers: [
									new AggregationFilled({
										name: "items"
									}), function(oTable) {
										var oContext;
										if (oTable.getItems()[0]) {
											oContext = oTable.getItems()[0].getBindingContext();
										}
										return !!oContext;
									}
								],
						success: function(oTable) {
							var oFirstItem = oTable[0].getItems()[0].getBindingContext().getPath();
// This is to store the first sales order number and will be used for checking the filters in the below OPA tests
							first_sales_order = oTable[0].getItems()[0].getBindingContext().getObject(oFirstItem);
							QUnit.notEqual(oTable[0].getItems().length, 0, "The list is displayed.");
						},
						errorMessage: "The list is NOT displayed."
					});

				},

				
				
				checkFilterRemoved: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: [
							new AggregationFilled({
								name: "items"
							}), function(oTable) {
								var oContext;
								if (oTable.getItems()[0]) {
									oContext = oTable.getItems()[0].getBindingContext();
								}
								return !!oContext;
							}
						],
						success: function(oTable) {
							var oFirstItem = oTable[0].getItems()[0].getBindingContext().getPath();
							// This is to store the first sales order number and will be used for checking the filters in the below OPA tests
							first_sales_order = oTable[0].getItems()[0].getBindingContext().getObject(oFirstItem);
							QUnit.ok(oTable[0].getItems().length > 1, "The filter removed successfully");
							
						},
						errorMessage: "Filter is not removed"
					});
				},
				
				
				
				checkFilterPopup: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Filters"
						}),
						// viewName : sViewName,
						success: function(oTitle) {
							QUnit.ok(true, "Filter Dialog opened with a title");
						},
						errorMessage: "Filter Dialog not opened with a title."
					});
				},

				selectFilterPopupTitleCorrect: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Select Filters"
						}),
						// viewName : sViewName,
						success: function(oTitle) {
							QUnit.ok(true, "Select Filter Dialog opened with a title");
						},
						errorMessage: "Select Filter Dialog not opened with a title."
					});
				},

				checkFilterAdded: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.InputBase",
						// viewName : sViewName,
						success: function(oInputBase) {
							QUnit.ok(true, "Filter added successfully");
							oInputBase[0].setValue(first_sales_order.ActiveSalesOrder);

						},
						errorMessage: "Filter not added sucessfully."
					});
				},

				checkTableEntries: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							QUnit.equal(oTable[0].getItems().length, 1, "The list has one item, filter working.");
						},
						errorMessage: "Filter not Working"
					});
				}

			}
		}
	})
});