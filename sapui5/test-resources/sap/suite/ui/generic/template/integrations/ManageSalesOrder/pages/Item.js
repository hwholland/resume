sap.ui.require([
	"sap/ui/test/Opa5", "sap/suite/ui/generic/template/integrations/ManageSalesOrder/pages/Common", "sap/ui/test/matchers/AggregationLengthEquals", "sap/ui/test/matchers/AggregationFilled"
], function(Opa5, Common, AggregationLengthEquals, AggregationFilled) {

	Opa5.createPageObjects({
		onTheItemPage: {
			baseClass: Common,

			
			actions: {

				clickitems: function() {
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

			},

			assertions: {

				iShouldSeeThePageTitle: function() {
					return this.waitFor({
						controlType: "sap.m.Text",
						success: function() {
							QUnit.ok(true, "The Items page has a title.");
						},
						errorMessage: "Can't see the Items page title."
					});
				},

				thePageTitleIsCorrect: function() {
					return this.waitFor({
						controlType: "sap.m.Text",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Sales Order Item"
						}),
						success: function(oTitle) {
							QUnit.ok(oTitle[0].getText() === "Sales Order Item", "The Items page title is correct.");
						},
						errorMessage: "The Items page title is incorrect."
					});
				},

			}

		}

	})
});
