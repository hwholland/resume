QUnit.module("Aggregation binding with factory function", {
	beforeEach : function() {
		var aChartKeys,
			oModel,
			oFirstVizFrameContent,
			oSecondVizFrameContent;

		oFirstVizFrameContent = new sap.suite.ui.commons.ChartContainerContent("firstChartContainerContent",{
			content : new sap.viz.ui5.controls.VizFrame("firstVizFrame")
		});
		oSecondVizFrameContent = new sap.suite.ui.commons.ChartContainerContent("secondChartContainerContent",{
			content : new sap.viz.ui5.controls.VizFrame("secondVizFrame")
		});
		this.oChartContainer = new sap.suite.ui.commons.ChartContainer("chartContainer");

		aChartKeys = [
			{
				key : "first"
			},
			{
				key : "second"
			}
		];
		oModel = new sap.ui.model.json.JSONModel({
			"chartKeys" : aChartKeys
		});

		this.oChartContainer.setModel(oModel);

		this.oChartContainer.bindAggregation("content", "/chartKeys", function(sId, oContext) {
			var sKey = oContext.getProperty("key");
			if (sKey === "first") {
				return oFirstVizFrameContent;
			} else if (sKey === "second") {
				return oSecondVizFrameContent;
			}
		});

		this.oChartContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
	},
	afterEach : function() {
		this.oChartContainer.destroy();
		this.oChartContainer = null;
	}
});

QUnit.test("The content aggregation is bound correctly", function(assert) {
	// Arrrange
	// Act
	// Assert
	assert.equal(this.oChartContainer.getContent().length, 2, "There are two contents in the aggregation");
});

QUnit.test("Call of public API function addContent", function(assert) {
	// Arrrange
	var oThirdVizFrameContent;
	oThirdVizFrameContent = new sap.suite.ui.commons.ChartContainerContent("thirdChartContainerContent",{
		content : new sap.viz.ui5.controls.VizFrame("thirdVizFrame")
	});
	// Act
	this.oChartContainer.addContent(oThirdVizFrameContent);
	// Assert
	assert.equal(this.oChartContainer.getContent().length, 3, "The content aggregation is updated and there are three contents in the aggregation");
});

QUnit.test("Call of public API function removeAllAggregation with the aggregation content", function(assert) {
	// Arrrange
	// Act
	this.oChartContainer.removeAllAggregation("content", true);
	// Assert
	assert.equal(this.oChartContainer.getContent().length, 0, "The content aggregation is updated and there are no contents in the aggregation");
});