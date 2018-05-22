QUnit.module("Lifecycle methods", {
	beforeEach : function() {
		this.oVizFrameContent = new sap.suite.ui.commons.ChartContainerContent("chartContainerContent",{
			content : new sap.viz.ui5.controls.VizFrame("vizFrameLifecycle")
		});
		this.oChartContainer = new sap.suite.ui.commons.ChartContainer("chartContainerLifecycle", {
			content : this.oVizFrameContent
		});
		this.oChartContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
	},
	afterEach : function() {
		this.oChartContainer.destroy();
		this.oChartContainer = null;
	}
});

QUnit.test("init creates all the necessary properties", function(assert) {
	this.oChartContainer.init();

	//private properties
	assert.deepEqual(this.oChartContainer._aUsedContentIcons, [], "_aUsedContentIcons is an empty array");
	assert.deepEqual(this.oChartContainer._aCustomIcons, [], "_aCustomIcons is an empty array");
	assert.ok(this.oChartContainer._oToolBar, "_oToolBar exists");
	assert.deepEqual(this.oChartContainer._aDimensionSelectors, [], "_aDimensionSelectors is an empty array");
	assert.equal(this.oChartContainer._bChartContentHasChanged, false, "_bChartContentHasChanged is set to false");
	assert.equal(this.oChartContainer._bControlNotRendered, true, "_bControlNotRendered is set to true");
	assert.equal(this.oChartContainer._bSegmentedButtonSaveSelectState, false, "_bSegmentedButtonSaveSelectState is set to false");
	assert.deepEqual(this.oChartContainer._mOriginalVizFrameHeights, {}, "_mOriginalVizFrameHeights is an empty object")
	assert.equal(this.oChartContainer._oActiveChartButton, null, "_oActiveChartButton is set to null");
	assert.equal(this.oChartContainer._oSelectedContent, null, "_oSelectedContent is set to null");
	assert.equal(this.oChartContainer._sResizeListenerId, null, "_sResizeListenerId is set to null");
});

QUnit.test("init creates OverflowToolbar correctly", function(assert) {
	var oToolbar = this.oChartContainer._oToolBar;

	this.oChartContainer.init();

	assert.deepEqual(oToolbar.getWidth(), "auto", "Toolbar width set to auto");
	assert.deepEqual(oToolbar.getDesign(), "Transparent", "Toolbar design set to Transparent");
	assert.deepEqual(oToolbar.getHeight(), "3rem", "Toolbar height set to 3rem");
});

QUnit.test("init creates _oFullScreenButton correctly", function(assert) {
	var oFullScreenBtn = this.oChartContainer._oFullScreenButton;

	this.oChartContainer.init();

	assert.ok(oFullScreenBtn, "Full screen button created");
	assert.ok(oFullScreenBtn instanceof sap.m.OverflowToolbarButton,  "Full screen button is an instance of sap.m.OverflowToolbarButton");
	assert.equal(oFullScreenBtn.getIcon(), "sap-icon://full-screen", "Full screen button icon is correct");
	assert.equal(oFullScreenBtn.getType(), sap.m.ButtonType.Transparent, "Full screen button type is correct");
	assert.equal(oFullScreenBtn.getText(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_FULLSCREEN"), "Full screen button text is correct");
	assert.equal(oFullScreenBtn.getTooltip(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_FULLSCREEN"), "Full screen button tooltip is correct");
});

QUnit.test("init creates _oPopup correctly", function(assert) {
	var oPopup = this.oChartContainer._oPopup;

	this.oChartContainer.init();

	assert.ok(oPopup, "Popup created");
	assert.ok(oPopup instanceof sap.ui.core.Popup,  "Popup is an instance of sap.ui.core.Popup");
	assert.equal(oPopup.getModal(), false, "Popup modal is correct");
	assert.equal(oPopup.getAutoClose(), false, "Popup autoClose is false");
});

QUnit.test("init creates _oShowLegendButton correctly", function(assert) {
	var oShowLegendButton = this.oChartContainer._oShowLegendButton;

	this.oChartContainer.init();

	assert.ok(oShowLegendButton, "Button created");
	assert.ok(oShowLegendButton instanceof sap.m.OverflowToolbarButton, "Popup is an instance of sap.m.OverflowToolbarButton");
	assert.equal(oShowLegendButton.getIcon(), "sap-icon://legend", "button icon is correct");
	assert.equal(oShowLegendButton.getType(), sap.m.ButtonType.Transparent, "type is correct");
	assert.equal(oShowLegendButton.getText(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_LEGEND"), "text is correct");
	assert.equal(oShowLegendButton.getTooltip(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_LEGEND"), "tooltip is correct");
});

QUnit.test("init creates _oPersonalizationButton correctly", function(assert) {
	var oPersonalizationButton = this.oChartContainer._oPersonalizationButton;

	this.oChartContainer.init();

	assert.ok(oPersonalizationButton, "button created");
	assert.ok(oPersonalizationButton instanceof sap.m.OverflowToolbarButton, "Is an instance of sap.m.OverflowToolbarButton");
	assert.equal(oPersonalizationButton.getIcon(), "sap-icon://action-settings", "button icon is correct");
	assert.equal(oPersonalizationButton.getType(), sap.m.ButtonType.Transparent, "type is correct");
	assert.equal(oPersonalizationButton.getText(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_PERSONALIZE"), "text is correct");
	assert.equal(oPersonalizationButton.getTooltip(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_PERSONALIZE"), "tooltip is correct");
});

QUnit.test("init creates _oZoomInButton correctly", function(assert) {
	var oZoomInButton = this.oChartContainer._oZoomInButton;

	this.oChartContainer.init();

	assert.ok(oZoomInButton, "button created");
	assert.ok(oZoomInButton instanceof sap.m.OverflowToolbarButton, "Is an instance of sap.m.OverflowToolbarButton");
	assert.equal(oZoomInButton.getIcon(), "sap-icon://zoom-in", "button icon is correct");
	assert.equal(oZoomInButton.getType(), sap.m.ButtonType.Transparent, "type is correct");
	assert.equal(oZoomInButton.getText(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_ZOOMIN"), "text is correct");
	assert.equal(oZoomInButton.getTooltip(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_ZOOMIN"), "tooltip is correct");
});

QUnit.test("init creates _oZoomOutButton correctly", function(assert) {
	var oZoomOutButton = this.oChartContainer._oZoomOutButton;

	this.oChartContainer.init();

	assert.ok(oZoomOutButton, "button created");
	assert.ok(oZoomOutButton instanceof sap.m.OverflowToolbarButton, "Is an instance of sap.m.OverflowToolbarButton");
	assert.equal(oZoomOutButton.getIcon(), "sap-icon://zoom-out", "button icon is correct");
	assert.equal(oZoomOutButton.getType(), sap.m.ButtonType.Transparent, "type is correct");
	assert.equal(oZoomOutButton.getText(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_ZOOMOUT"), "text is correct");
	assert.equal(oZoomOutButton.getTooltip(), this.oChartContainer._oResBundle.getText("CHARTCONTAINER_ZOOMOUT"), "tooltip is correct");
});

QUnit.test("init creates _oChartSegmentedButton correctly", function(assert) {
	var oChartSegmentedButton = this.oChartContainer._oChartSegmentedButton;

	this.oChartContainer.init();

	assert.ok(oChartSegmentedButton, "button created");
	assert.ok(oChartSegmentedButton instanceof sap.m.SegmentedButton, "Is an instance of sap.m.SegmentedButton");
});

QUnit.test("init creates _oChartTitle correctly", function(assert) {
	var oChartTitle = this.oChartContainer._oChartTitle;

	this.oChartContainer.init();

	assert.ok(oChartTitle, "Chart title created");
	assert.ok(oChartTitle instanceof sap.m.Title, "Chart title is an instance of sap.m.Title");
});

QUnit.test("onAfterRendering calls the necessary methods", function(assert) {
	this.oChartContainer._sResizeListenerId = null;

	var sResizeId = "testResizeId";
	var oSelectedContent = {
		getContent: function() {
			return new sap.viz.ui5.controls.VizFrame();
		}
	};

	var stubRegister = sinon.stub(sap.ui.core.ResizeHandler, "register").returns(sResizeId);
	var stubGetAutoAdjustHeight = sinon.stub(this.oChartContainer, "getAutoAdjustHeight");
	var stubGetFullScreen = sinon.stub(this.oChartContainer, "getFullScreen").returns(true);
	var stubDelayedCall = sinon.stub(jQuery.sap, "delayedCall");
	var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
	var spyGetContent = sinon.spy(oSelectedContent, "getContent");

	var oChartContainer = this.oChartContainer.onAfterRendering();

	assert.ok(stubRegister.called, "resizeHandler.register called");
	assert.ok(stubGetAutoAdjustHeight.called, "getAutoAdjustHeight called");
	assert.ok(stubGetFullScreen.called, "getFullScreen called");
	assert.ok(stubDelayedCall.called, "jQuery.sap.delayedCall called");
	assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
	assert.ok(spyGetContent.called, "getContent on selected content called");
	assert.ok(this.oChartContainer._oScrollEnablement, "_oScrollEnablement is created");
	assert.ok(this.oChartContainer._oScrollEnablement instanceof sap.ui.core.delegate.ScrollEnablement, "_oScrollEnablement is an instance of sap.ui.core.delegate.ScrollEnablement");
	assert.equal(this.oChartContainer._oScrollEnablement.getHorizontal(), false, "_oScrollEnablement is not horizontal when selected content is a viz frame");
	assert.equal(this.oChartContainer._oScrollEnablement.getVertical(), false, "_oScrollEnablement is not horizontal when selected content is a viz frame");
	assert.equal(this.oChartContainer._sResizeListenerId, sResizeId, "_sResizeListenerId is set");

	stubRegister.restore();
	stubDelayedCall.restore();
});

QUnit.test("onBeforeRendering calls the necessary methods", function(assert) {
	var sResizeHandlerId = "testResizeHandler";
	this.oChartContainer._sResizeListenerId = sResizeHandlerId;
	this.oChartContainer._bChartContentHasChanged = false;
	this.oChartContainer._bControlNotRendered = true;
	var sCustomIcon1 = "customIcon1";
	var sCustomIcon2 = "customIcon2";
	var aCustomIcons = [sCustomIcon1, sCustomIcon2];
	this._aCustomIcons = aCustomIcons;

	var stubDeregister = sinon.stub(sap.ui.core.ResizeHandler, "deregister");
	var stubChartChange = sinon.stub(this.oChartContainer, "_chartChange");
	var stubGetAggregation = sinon.stub(this.oChartContainer, "getAggregation").returns(aCustomIcons);
	var stubAddButtonToCustomIcons = sinon.stub(this.oChartContainer, "_addButtonToCustomIcons");
	var stubAdjustDisplay = sinon.stub(this.oChartContainer, "_adjustDisplay");
	var stubDestroyButtons = sinon.stub(this.oChartContainer, "_destroyButtons");

	var oChartContainer = this.oChartContainer.onBeforeRendering();

	assert.ok(stubDeregister.called, "resizeHandler.deregister called");
	assert.ok(stubGetAggregation.called, "getAggregation called");
	assert.ok(stubGetAggregation.calledWith("customIcons"), "getAggregation called with customIcons");
	assert.ok(stubAddButtonToCustomIcons.called, "_addButtonToCustomIcons called");
	assert.ok(stubAddButtonToCustomIcons.calledTwice, "_addButtonToCustomIcons called twice");
	assert.ok(stubAddButtonToCustomIcons.calledWith(sCustomIcon1), "_addButtonToCustomIcons called with custom icon 1");
	assert.ok(stubAddButtonToCustomIcons.calledWith(sCustomIcon2), "_addButtonToCustomIcons called with custom icon 2");
	assert.ok(stubDeregister.calledWith(sResizeHandlerId), "resizeHandler.deregister called with the current resize handler");
	assert.ok(stubChartChange.called, "_chartChange called when the control is not rendered yet");
	assert.ok(stubAdjustDisplay.called, "adjustDisplay called");
	assert.ok(stubDestroyButtons.called, "destroyButtons called");
	assert.equal(this.oChartContainer._sResizeListenerId, null, "_sResizeListenerId is set to null");
	assert.deepEqual(this.oChartContainer._aCustomIcons, [], "_aCustomIcons is set to an empty array");

	stubDeregister.restore();
});

QUnit.test("exit destroys all controls", function(assert) {
	var spyDestroyFullScreenButton = sinon.spy();
	var oFullScreenButton = {
		destroy: spyDestroyFullScreenButton
	};
	this.oChartContainer._oFullScreenButton = oFullScreenButton;
	var spyDestroyPopup = sinon.spy();
	var oPopup = {
		destroy: spyDestroyPopup
	};
	this.oChartContainer._oPopup = oPopup;
	var spyDestroyShowLegendButton = sinon.spy();
	var oShowLegendButton = {
		destroy: spyDestroyShowLegendButton
	};
	this.oChartContainer._oShowLegendButton = oShowLegendButton;
	var spyDestroyPersonalizationButton = sinon.spy();
	var oPersonalizationButton = {
		destroy: spyDestroyPersonalizationButton
	};
	this.oChartContainer._oPersonalizationButton = oPersonalizationButton;
	var spyDestroyActiveChartButton = sinon.spy();
	var oActiveChartButton = {
		destroy: spyDestroyActiveChartButton
	};
	this.oChartContainer._oActiveChartButton = oActiveChartButton;
	var spyDestroyChartSegmentedButton = sinon.spy();
	var oChartSegmentedButton = {
		destroy: spyDestroyChartSegmentedButton
	};
	this.oChartContainer._oChartSegmentedButton = oChartSegmentedButton;
	var spyDestroySelectedContent = sinon.spy();
	var oSelectedContent = {
		destroy: spyDestroySelectedContent
	};
	this.oChartContainer._oSelectedContent = oSelectedContent;
	var spyDestroyToolBar = sinon.spy();
	var oToolBar = {
		destroy: spyDestroyToolBar
	};
	this.oChartContainer._oToolBar = oToolBar;
	var spyDestroyDimensionSelector = sinon.spy();
	var oDimensionSelector = {
		destroy: spyDestroyDimensionSelector
	};
	this.oChartContainer._aDimensionSelectors = [oDimensionSelector, oDimensionSelector];
	var spyDestroyScrollEnablement = sinon.spy();
	var oScrollEnablement = {
		destroy: spyDestroyScrollEnablement
	};
	this.oChartContainer._oScrollEnablement = oScrollEnablement;
	var spyDestroyZoomInButton = sinon.spy();
	var oZoomInButton = {
		destroy: spyDestroyZoomInButton
	};
	this.oChartContainer._oZoomInButton = oZoomInButton;
	var spyDestroyZoomOutButton = sinon.spy();
	var oZoomOutButton = {
		destroy: spyDestroyZoomOutButton
	};
	this.oChartContainer._oZoomOutButton = oZoomOutButton;
	var stubDeregister = sinon.stub(sap.ui.core.ResizeHandler, "deregister");

	var oChartContainer = this.oChartContainer.exit();

	assert.ok(spyDestroyFullScreenButton.called, "destroy on _oFullScreenButton called");
	assert.equal(this.oChartContainer._oFullScreenButton, undefined, "_oFullScreenButton is undefined");
	assert.ok(spyDestroyPopup.called, "destroy on _oPopup called");
	assert.equal(this.oChartContainer._oPopup, undefined, "_oPopup is undefined");
	assert.ok(spyDestroyShowLegendButton.called, "destroy on _oShowLegendButton called");
	assert.equal(this.oChartContainer._oShowLegendButton, undefined, "_oShowLegendButton is undefined");
	assert.ok(spyDestroyPersonalizationButton.called, "destroy on _oPersonalizationButton called");
	assert.equal(this.oChartContainer._oPersonalizationButton, undefined, "_oPersonalizationButton is undefined");
	assert.ok(spyDestroyActiveChartButton.called, "destroy on _oActiveChartButton called");
	assert.equal(this.oChartContainer._oActiveChartButton, undefined, "_oActiveChartButton is undefined");
	assert.ok(spyDestroyChartSegmentedButton.called, "destroy on _oChartSegmentedButton called");
	assert.equal(this.oChartContainer._oChartSegmentedButton, undefined, "_oChartSegmentedButton is undefined");
	assert.ok(spyDestroySelectedContent.called, "destroy on _oSelectedContent called");
	assert.equal(this.oChartContainer._oSelectedContent, undefined, "_oSelectedContent is undefined");
	assert.ok(spyDestroyToolBar.called, "destroy on _oToolBar called");
	assert.equal(this.oChartContainer._oToolBar, undefined, "_oToolBar is undefined");
	assert.ok(spyDestroyDimensionSelector.called, "destroy on a dimension selector called");
	assert.ok(spyDestroyDimensionSelector.calledTwice, "destroy on a dimension selector called twice");
	assert.equal(this.oChartContainer._aDimensionSelectors, undefined, "_aDimensionSelectors is undefined");
	assert.ok(spyDestroyScrollEnablement.called, "destroy on _oScrollEnablement called");
	assert.equal(this.oChartContainer._oScrollEnablement, undefined, "_oScrollEnablement is undefined");
	assert.ok(spyDestroyZoomInButton.called, "destroy on _oZoomInButton called");
	assert.equal(this.oChartContainer._oZoomInButton, undefined, "_oZoomInButton is undefined");
	assert.ok(spyDestroyZoomOutButton.called, "destroy on _oZoomOutButton called");
	assert.equal(this.oChartContainer._oZoomOutButton, undefined, "_oZoomOutButton is undefined");
	assert.ok(stubDeregister.called, "resizeHandler.deregister called");

	stubDeregister.restore();
});
QUnit.module("ChartContainer Default Property Values", {
	beforeEach : function() {
		this.oChartContainer = new sap.suite.ui.commons.ChartContainer({
			title : "Chart Container",
			selectorGroupLabel : "Select Dimension"
		});
		this.oChartContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
	},
	afterEach : function() {
		this.oChartContainer.destroy();
		this.oChartContainer = null;
	}
});
QUnit.test("ChartContainer.showPersonalization", function(assert) {
	assert.strictEqual(this.oChartContainer.getShowPersonalization(), false, "showPersonalization should be disabled by default");
});
QUnit.test("ChartContainer.showFullScreen", function(assert) {
	assert.strictEqual(this.oChartContainer.getShowFullScreen(), false, "showFullScreen should disabled by default");
});
QUnit.test("ChartContainer.fullScreen", function(assert) {
	assert.strictEqual(this.oChartContainer.getFullScreen(), false, "fullScreen should disabled by default");
});
QUnit.test("ChartContainer.showLegend", function(assert) {
	assert.strictEqual(this.oChartContainer.getShowLegend(), true, "showLegend should be enabled by default");
});
QUnit.test("ChartContainer.showLegendButton", function(assert) {
	assert.strictEqual(this.oChartContainer.getShowLegendButton(), true, "showLegendButton should be true by default");
});
QUnit.test("ChartContainer.title", function(assert) {
	var sTitle = "Chart Container";
	assert.strictEqual(this.oChartContainer.getTitle(), sTitle, "Title should be correct");
});
QUnit.test("ChartContainer.selectorGroupLabel", function(assert) {
	var aSelectorGroupLabel = "Select Dimension";
	assert.strictEqual(this.oChartContainer.getSelectorGroupLabel(), aSelectorGroupLabel, "selectorGroupLabel should be correct");
});
QUnit.test("ChartContainer.autoAdjustHeight", function(assert) {
	assert.strictEqual(this.oChartContainer.getAutoAdjustHeight(), false, "AutoAdjustHeight should be disabled by default");
});

QUnit.module("ChartContainer Properties with override values", {
	beforeEach : function() {
		this.oChartContainer = new sap.suite.ui.commons.ChartContainer({
			showPersonalization : true,
			showFullScreen : true,
			fullScreen : true,
			showLegend : false,
			autoAdjustHeight : true,
			showLegendButton : false
		});
		this.oChartContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
	},
	afterEach : function() {
		this.oChartContainer.destroy();
		this.oChartContainer = null;
	}
});

QUnit.test("ChartContainer.showPersonalization", function(assert) {
	assert.strictEqual(this.oChartContainer.getShowPersonalization(), true, "showPersonalization is enabled");
});
QUnit.test("ChartContainer.showFullScreen", function(assert) {
	assert.strictEqual(this.oChartContainer.getShowFullScreen(), true, "showFullScreen is enabled");
});
//fullScreen property can't set for first time, always false
QUnit.test("ChartContainer.fullScreen", function(assert) {
	assert.strictEqual(this.oChartContainer.getFullScreen(), false, "First time fullScreen is false");
});
QUnit.test("ChartContainer.showLegend", function(assert) {
	assert.strictEqual(this.oChartContainer.getShowLegend(), false, "showLegend is disabled");
});
QUnit.test("ChartContainer.showLegendButton", function(assert) {
	assert.strictEqual(this.oChartContainer.getShowLegendButton(), false, "showLegendButton is disabled");
});
QUnit.test("ChartContainer.autoAdjustHeight", function(assert) {
	assert.strictEqual(this.oChartContainer.getAutoAdjustHeight(), true, "AutoAdjustHeight is enabled");
});
// Test legend button overrides
QUnit.test("ChartContainer.showLegend", function(assert) {
	this.oChartContainer.setShowLegendButton(false);
	assert.strictEqual(this.oChartContainer.getShowLegend(), false, "showLegend is disabled");
});
QUnit.test("ChartContainer.showLegendButton", function(assert) {
	assert.strictEqual(this.oChartContainer.getShowLegendButton(), false, "showLegendButton is disabled");
});

QUnit.module("ChartContainerContent Properties", {
	beforeEach : function() {
		var oVizFrame3 = new sap.viz.ui5.controls.VizFrame({
			'width' : '600px',
			'height' : '300px',
			'vizType' : 'bar',
			'uiConfig' : {
				'applicationSet' : 'fiori'
			},
			'vizProperties' : {
				'plotArea' : {
					'dataLabel' : {
						'visible' : 'true',
						'formatString' : "#,##0.00"
					}
				}
			}
		});
		this.oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
			icon : "sap-icon://bubble-chart",
			title : "vizFrame Bubble Chart Sample",
			content : oVizFrame3
		});
		this.oChartContainerContent.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
	},
	afterEach : function() {
		this.oChartContainerContent.destroy();
		this.oChartContainerContent = null;
	}
});

QUnit.test("ChartContainerContent Default Property Values", function(assert) {
	assert.equal(this.oChartContainerContent.getIcon(), "sap-icon://bubble-chart", "chartContainerContent has icon");
	assert.equal(this.oChartContainerContent.getTitle(), "vizFrame Bubble Chart Sample", "chartContainerContent has title");
	assert.ok(this.oChartContainerContent.getContent(0) instanceof sap.viz.ui5.controls.VizFrame, "Should be an instance of new sap.viz.ui5.controls.VizFrame");
	var sVizType = 'bar';
	assert.equal(this.oChartContainerContent.getContent(0).getVizType(), sVizType, "viz type should be bar");
});