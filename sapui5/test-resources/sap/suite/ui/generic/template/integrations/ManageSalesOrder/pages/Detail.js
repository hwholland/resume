sap.ui.require([
	"sap/ui/test/Opa5", "sap/suite/ui/generic/template/integrations/ManageSalesOrder/pages/Common", "sap/ui/test/matchers/AggregationLengthEquals", "sap/ui/test/matchers/AggregationFilled"
], function(Opa5, Common, AggregationLengthEquals, AggregationFilled) {
	"use strict";

	Opa5.createPageObjects({
		onTheDetailPage: {
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
						errorMessage: "Did not find Go button."
					});
				},

				iWaitUntilTheBusyIndicatorIsGone : function () {
					return this.waitFor({
						controlType : "sap.m.Page",
						
						// inline-matcher directly as function
						matchers : function(oRootView) {
							// we set the view busy, so we need to query the parent of the app
							return oRootView.getParent().getBusy();
						},
						errorMessage : "The app is still busy."
					});
				},
				
				clickDetail: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							var oFirstItem = oTable[0].getItems()[0];
							oFirstItem.$().trigger("tap");
						},
						errorMessage: "Items not loaded."
					});

				},

				clickFilterToRemove: function() {

					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
							new sap.ui.test.matchers.PropertyStrictEquals({
								name: "text",
								value: "Filters (1)"
							}),

							function(oButton) {

								return oButton.getEnabled();
							}
						],

						success: function(aButtons) {
							aButtons[0].$().trigger("tap");

						},
						errorMessage: "Did not find the Filter (1) button."
					});
				},
				
				
				clickOverflow: function() {

					var overflowButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {

							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://overflow") {
									return false;
								}

								overflowButton = oButton;
								return true;
							});
						},

						success: function(aButtons) {
							overflowButton.$().trigger("tap");
							for (var int = 0; int < aButtons.length; int++) {
								console.log(aButtons[int].getIcon());
							}
						},
						errorMessage: "Did not find the overflow button."
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
				
				clickItemForDraft: function() {
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
							for (var i = 0; i < 100; i++) {
								var oFirstItem = oTable[0].getItems()[i].getBindingContext().getPath();
								var oDraftItem = oTable[0].getItems()[i].getBindingContext().getObject(oFirstItem);
								if (oDraftItem.HasDraftEntity == true && oDraftItem.IsActiveEntity == true) {
									break;
								}
							}

							var oFirstItem = oTable[0].getItems()[i];
							oFirstItem.$().trigger("tap");
						},
						errorMessage: "Items not loaded."
					});

				},
				
				clickDelete: function() {

					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Delete"
						}),

						success: function(aButtons) {
							aButtons[0].$().trigger("tap");
							QUnit.ok(true, "Delete button was clicked.");

						},
						errorMessage: "Did not find the delete button."
					});
				},

				clickConfirm: function() {

					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Delete"
						}),

						success: function(aButtons) {
							aButtons[0].$().trigger("tap");
							QUnit.ok(true, "Confirm button was clicked.");
							for (var int = 0; int < aButtons.length; int++) {
								console.log(aButtons[int].getIcon());
							}
						},
						errorMessage: "Did not find the confirm delete button."
					});
				}
			},

			assertions: {

				checkLoadedItems: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						// id : "listReport",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							QUnit.notEqual(oTable[0].getItems().length, 0, "Item Loaded.");
						},
						errorMessage: "Items not loaded."
					});
				},

				iShouldSeeThePageTitle: function() {
					return this.waitFor({
						controlType: "sap.m.Text",
						success: function() {
							QUnit.ok(true, "The detail page has a title.");
						},
						errorMessage: "Can't see the detail page title."
					});
				},

				thePageTitleIsCorrect: function() {
					return this.waitFor({
						controlType: "sap.m.Title",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Sales Order"
						}),
						success: function(oTitle) {
							QUnit.ok(oTitle[0].getText() === "Sales Order", "The Detail page title is correct.");
						},
						errorMessage: "The detail page title is incorrect."
					});
				},

				theListIsDisplayed: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						// id : "listReport",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oTable) {
							QUnit.notEqual(oTable[0].getItems().length, 0, "The Detail item list is displayed.");
						},
						errorMessage: "The list is NOT displayed."
					});

				},

				itemDeleted: function() {
					return this.waitFor({
						controlType: "sap.m.Table",

						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						success: function(oTable) {
							var oFirstItem = oTable[0].getItems()[0].getBindingContext().getPath();
							var itm = oTable[0].getItems()[0].getBindingContext().getObject(oFirstItem);

							QUnit.notEqual(itm.ActiveSalesOrder, "500000000", "The item deleted successfully" + itm.ActiveSalesOrder);

						},
						errorMessage: "Items not deleted"
					});

				},

				
				checkFilterButtonToRemove: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
							matchers: [
									new sap.ui.test.matchers.PropertyStrictEquals({
										name: "text",
										value: "Filters (1)"
									}),

									function(oButton) {
										return oButton.getEnabled();
									}
								],						
						
						success: function(oButton) {
							QUnit.ok(true, "The Main page has filter set button.");
						},
						errorMessage: "The Main page has no filter set button"
					});
				},
				
				
				
				checkOverflowButton: function() {
					var overflowButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {

							return aButtons.filter(function(oButton) {
								if (oButton.getIcon() !== "sap-icon://overflow") {
									return false;
								}

								overflowButton = oButton;
								return true;
							});
						},

						success: function(aButtons) {
							QUnit.ok(true, "The detail page has overflow button.");
							for (var int = 0; int < aButtons.length; int++) {
								console.log(aButtons[int].getIcon());
							}
						},
						errorMessage: "The detail page has no overflow button."
					});
				},

				checkDeleteButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
									new sap.ui.test.matchers.PropertyStrictEquals({
										name: "text",
										value: "Delete"
									}),

									function(oButton) {
										return oButton.getEnabled();
									}
								],
						success: function(oButton) {
							QUnit.ok(true, "The detail page has delete button.");
						},
						errorMessage: "The detail page has no delete button."
					});
				},

				checkCopyButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Copy"
						}),
						success: function(oButton) {
							QUnit.ok(true, "The detail page has copy button.");
						},
						errorMessage: "The detail page has no copy button."
					});
				},

				checkGrossAmtButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Calculate Gross Amount"
						}),
						success: function(oButton) {
							QUnit.ok(true, "The detail page has Gross Amount button.");
						},
						errorMessage: "The detail page has no Gross Amount button."
					});
				},

				checkApproveButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Approve Sales Order"
						}),
						success: function(oButton) {
							QUnit.ok(true, "The detail page has Approve button.");
						},
						errorMessage: "The detail page has no Approve button."
					});
				},

				checkValidateButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Validate"
						}),
						success: function(oButton) {
							QUnit.ok(true, "The detail page has Validate button.");
						},
						errorMessage: "The detail page has no Validate button."
					});
				},

				checkEditButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Edit"
						}),
						success: function(oButton) {
							QUnit.ok(true, "The detail page has Edit button.");
						},
						errorMessage: "The detail page has no Edit button."
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
						success: function(oButton) {
							QUnit.ok(true, "The detail page has Add button.");
						},
						errorMessage: "The detail page has no Add button."
					});
				},
				

				checkConfirmDeletePopup: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Delete"
						}),
						// viewName : sViewName,
						success: function(oTitle) {
							QUnit.ok(true, "Confirm Delete dialog opened with a title");
						},
						errorMessage: "Confirm Delete dialog not opened."
					});
				},
				
				checkDraftPopup: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Resume"
						}),
						success: function(oButton) {
							QUnit.ok(true, "The Draft Popup Open Successfully.");

						},
						errorMessage: "The Draft Popup is not Opened."
					});
				},
				
				
				

			}
		}
	})
});