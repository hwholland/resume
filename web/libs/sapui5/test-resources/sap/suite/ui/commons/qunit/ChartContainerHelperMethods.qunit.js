QUnit.module("Helper methods", {
	beforeEach : function() {
		var oVizFrame = new sap.viz.ui5.controls.VizFrame("vizFrameHelpers");
		this.oVizFrameContent = new sap.suite.ui.commons.ChartContainerContent("chartContainerContentHelpers",{
			content : oVizFrame
		});
		this.oChartContainer = new sap.suite.ui.commons.ChartContainer("chartContainerHelpers", {
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

QUnit.test("_toggleFullScreen shows fullscreen when it's off", function(assert) {
	var bFullScreen = false;
	var stubGetProperty = sinon.stub(this.oChartContainer, "getProperty").returns(bFullScreen);
	var stubCloseFullScreen = sinon.stub(this.oChartContainer, "_closeFullScreen");
	var stubOpenFullScreen = sinon.stub(this.oChartContainer, "_openFullScreen");
	var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");

	this.oChartContainer._toggleFullScreen();

	assert.ok(stubGetProperty.called, "getProperty called");
	assert.ok(stubGetProperty.calledWith("fullScreen"), "getProperty called with fullscreen");
	assert.ok(stubCloseFullScreen.notCalled, "closeFullScreen not called");
	assert.ok(stubOpenFullScreen.called, "closeFullScreen called");
	assert.ok(stubSetProperty.called, "setProperty called");
	assert.ok(stubSetProperty.calledWith("fullScreen", true, true), "property set to true");
});

QUnit.test("_toggleFullScreen hides fullscreen when it's on", function(assert) {
	var bFullScreen = true;

	var stubGetProperty = sinon.stub(this.oChartContainer, "getProperty").returns(bFullScreen);
	var spyGetAggregation = sinon.spy(this.oChartContainer, "getAggregation");
	var stubInvalidate = sinon.stub(this.oChartContainer, "invalidate");
	var stubCloseFullScreen = sinon.stub(this.oChartContainer, "_closeFullScreen");
	var stubOpenFullScreen = sinon.stub(this.oChartContainer, "_openFullScreen");
	var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");

	this.oChartContainer._toggleFullScreen();

	assert.ok(stubGetProperty.called, "getProperty called");
	assert.ok(stubGetProperty.calledWith("fullScreen"), "getProperty called with fullscreen");
	assert.ok(spyGetAggregation.called, "getAggregation called");
	assert.ok(spyGetAggregation.calledWith("content"), "getAggregation called with content");
	assert.ok(stubInvalidate.called, "invalidate called");
	assert.ok(stubCloseFullScreen.called, "closeFullScreen called");
	assert.ok(stubOpenFullScreen.notCalled, "closeFullScreen not called");
	assert.ok(stubSetProperty.called, "setProperty called");
	assert.ok(stubSetProperty.calledWith("fullScreen", false, true), "property set to true");
});

QUnit.test("_openFullScreen opens the full screen", function(assert) {
	var stubOpen = sinon.stub(this.oChartContainer._oPopup, "open");
	var stubSetContent = sinon.stub(this.oChartContainer._oPopup, "setContent");

	this.oChartContainer._openFullScreen();

	assert.ok(this.oChartContainer._$overlay, "overlay jQuery property cretaed");
	assert.ok(this.oChartContainer._$overlay.hasClass("sapSuiteUiCommonsChartContainerOverlay"), "overlay has class sapSuiteUiCommonsChartContainerOverlay");
	assert.ok(this.oChartContainer._$overlay.find(this.oChartContainer.$content), "overlay has the content appended to it");
	assert.ok(stubOpen.called, "open on the popup called");
	assert.ok(stubSetContent.called, "setContent on the popup called");
});

QUnit.test("_closeFullScreen closes the full screen", function(assert) {
	var sContent = "testContent";

	var spyDestroy = sinon.spy();
	var spyReplaceWith = sinon.spy();
	var spyRemove = sinon.spy();
	var stubSetDesign = sinon.stub(this.oChartContainer._oToolBar, "setDesign");
	var stubClose = sinon.stub(this.oChartContainer._oPopup, "close");

	this.oChartContainer._oScrollEnablement = {
		destroy: spyDestroy
	};
	this.oChartContainer.$content = sContent;
	this.oChartContainer.$tempNode = {
		replaceWith: spyReplaceWith
	};
	this.oChartContainer._$overlay = {
		remove: spyRemove
	};

	this.oChartContainer._closeFullScreen();

	assert.ok(spyDestroy.called, "replaceWith on the $tmpNode called");
	assert.ok(spyReplaceWith.called, "replaceWith on the $tmpNode called");
	assert.ok(spyReplaceWith.calledWith(sContent), "replaceWith on the $tmpNode called with the content");
	assert.ok(stubSetDesign.called, "setDesign on the Toolbar called");
	assert.ok(stubSetDesign.calledWith(sinon.match(sap.m.ToolbarDesign.Auto)), "setDesign on the Toolbar called with 'sap.m.ToolbarDesign.Auto'");
	assert.deepEqual(this.oChartContainer._oScrollEnablement, null, "_oScrollEnablement is null");
	assert.ok(stubClose.called, "close on the popup called");
	assert.ok(spyRemove.called, "remove on overlay called");

	this.$tempNode = null;
	this.$content = null;
});

QUnit.test("_performHeightChanges perform height changes is viz frame", function(assert) {
	var spyGetAutoAdjustHeight = sinon.spy(this.oChartContainer, "getAutoAdjustHeight");
	var stubGetFullScreen = sinon.stub(this.oChartContainer, "getFullScreen").returns(true);
	var spyGetSelectedContent = sinon.spy(this.oChartContainer, "getSelectedContent");
	var stubRerender = sinon.stub(this.oChartContainer, "rerender");
	var stubRememberOriginalHeight = sinon.stub(this.oChartContainer, "_rememberOriginalHeight");

	this.oChartContainer._performHeightChanges();

	assert.ok(spyGetAutoAdjustHeight.called, "getAutoAdjustHeight called");
	assert.ok(stubGetFullScreen.called, "getFullScreen called");
	assert.ok(spyGetSelectedContent.called, "getSelectedContent called");
	assert.ok(stubRememberOriginalHeight.called, "_rememberOriginalHeight called");
	assert.ok(stubRerender.notCalled, "rerender not called");
});

QUnit.test("_performHeightChanges re-renders when content not a viz frame", function(assert) {
	var sOffsetWidth = "testOffsetWidth"
	var oDomRef = {
		offsetWidth: sOffsetWidth
	};
	var stubGetSelectedContentDomRef = sinon.stub().returns(oDomRef);
	var oContent = {
		getDomRef: stubGetSelectedContentDomRef
	};
	var stubGetContent = sinon.stub().returns(oContent);
	var oSelectedContent = {
		getContent: stubGetContent
	};

	var spyGetAutoAdjustHeight = sinon.spy(this.oChartContainer, "getAutoAdjustHeight");
	var stubGetFullScreen = sinon.stub(this.oChartContainer, "getFullScreen").returns(true);
	var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
	var spyGetDomRef = sinon.spy(this.oChartContainer, "getDomRef");
	var stubRememberOriginalHeight = sinon.stub(this.oChartContainer, "_rememberOriginalHeight");
	var stubRerender = sinon.stub(this.oChartContainer, "rerender");

	this.oChartContainer._performHeightChanges();

	assert.ok(spyGetAutoAdjustHeight.called, "getAutoAdjustHeight called");
	assert.ok(stubGetFullScreen.called, "getFullScreen called");
	assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
	assert.ok(stubGetContent.called, "getContent on selected content called");
	assert.ok(stubGetSelectedContentDomRef.called, "getDomRef on selected content's content called");
	assert.ok(spyGetDomRef.called, "getDomRef on chart container called");
	assert.ok(stubRememberOriginalHeight.notCalled, "_rememberOriginalHeight not called");
	assert.ok(stubRerender.called, "rerender on called");
});

QUnit.test("_rememberOriginalHeight stores the height when the chart has height", function(assert) {
	this.oChartContainer._mOriginalVizFrameHeights = ["test", "test2"];

	var iHeight = 5;
	var iId = 2;
	var stubGetHeight = sinon.stub().returns(iHeight);
	var stubGetId = sinon.stub().returns(iId);
	var oChart = {
		getHeight: stubGetHeight,
		getId: stubGetId
	};

	this.oChartContainer._rememberOriginalHeight(oChart);

	assert.ok(stubGetHeight.called, "getHeight on the passed chart called");
	assert.ok(stubGetId.called, "getId on the passed chart called");
	assert.equal(this.oChartContainer._mOriginalVizFrameHeights[iId], iHeight, "Height added to the viz frame heights properly");
});

QUnit.test("_rememberOriginalHeight stores the height as 0 when the chart has no height", function(assert) {
	this.oChartContainer._mOriginalVizFrameHeights = ["test", "test2"];

	var iId = 2;
	var stubGetId = sinon.stub().returns(iId);
	var oChart = {
		getHeight: "nonFunction",
		getId: stubGetId
	};

	this.oChartContainer._rememberOriginalHeight(oChart);

	assert.ok(stubGetId.called, "getId on the passed chart called");
	assert.equal(this.oChartContainer._mOriginalVizFrameHeights[iId], 0, "Height set as 0");
});

QUnit.test("_switchChart selects the chart from the passed id", function(assert) {
	var sChartId = "chartId";
	var sChart = "testChart";

	var stubFindChartById = sinon.stub(this.oChartContainer, "_findChartById").returns(sChart);
	var stubSetSelectedContent = sinon.stub(this.oChartContainer, "_setSelectedContent").returns(sChart);
	var stubFireContentChange = sinon.stub(this.oChartContainer, "fireContentChange");
	var stubRerender = sinon.stub(this.oChartContainer, "rerender");

	this.oChartContainer._switchChart(sChartId);

	assert.ok(stubFindChartById.called, "_findChartById called");
	assert.ok(stubSetSelectedContent.called, "_setSelectedContent called");
	assert.ok(stubSetSelectedContent.calledWith(sChart), "_setSelectedContent called with the found chart");
	assert.ok(stubFireContentChange.called, "fireContentChange called");
	assert.ok(stubFireContentChange.calledWith(sinon.match({
		selectedItemId : sChartId
	})), "fireContentChange called with an object with the id");
	assert.ok(stubRerender.called, "rerender called");
});

QUnit.test("_chartChange changes the chart properly", function(assert) {
	var aUsedIcons = this.oChartContainer._aUsedContentIcons.slice();
	this.oChartContainer._bChartContentHasChanged = true;

	var spyGetContent = sinon.spy(this.oChartContainer, "getContent");
	var spyDestroyButtons = sinon.spy(this.oChartContainer, "_destroyButtons");
	var stubRemoveAllButtons = sinon.stub(this.oChartContainer._oChartSegmentedButton, "removeAllButtons");
	var stubSetDefaultOnSegmentedButton = sinon.stub(this.oChartContainer, "_setDefaultOnSegmentedButton");
	var stubSwitchChart = sinon.stub(this.oChartContainer, "switchChart");
	var stubGetShowLegend = sinon.stub(this.oChartContainer, "getShowLegend");
	var stubSetSelectedContent = sinon.stub(this.oChartContainer, "_setSelectedContent");

	this.oChartContainer._chartChange();

	assert.ok(spyGetContent.called, "getContent called");
	assert.ok(spyDestroyButtons.called, "getContent called");
	assert.ok(spyDestroyButtons.calledWith(sinon.match(aUsedIcons)), "getContent called");
	assert.ok(stubRemoveAllButtons.notCalled, "removeAllButtons on _oChartSegmentedButton not called");
	assert.ok(stubSetDefaultOnSegmentedButton.notCalled, "_setDefaultOnSegmentedButton not called");
	assert.ok(stubSwitchChart.notCalled, "switchChart not called");
	assert.ok(stubGetShowLegend.called, "getShowLegend called");
	assert.ok(stubSetSelectedContent.called, "_setSelectedContent called");
	assert.ok(this.oChartContainer._oActiveChartButton, "_oActiveChartButton is set");
	assert.ok(this.oChartContainer._oActiveChartButton instanceof sap.m.Button, "_oActiveChartButton is an sap.m.Button");
	assert.ok(this.oChartContainer._aUsedContentIcons.length > 0, "_aUsedContentIcons are created");
	assert.equal(this.oChartContainer._bChartContentHasChanged, false, "_bChartContentHasChanged set to false");
});

QUnit.test("_chartChange changes the chart to null is there's no content", function(assert) {
	var aUsedIcons = "testIcons";
	this.oChartContainer._bChartContentHasChanged = true;
	this.oChartContainer._aUsedContentIcons = "testIcons";

	var stubGetContent = sinon.stub(this.oChartContainer, "getContent").returns([]);
	var stubDestroyButtons = sinon.stub(this.oChartContainer, "_destroyButtons");
	var stubRemoveAllButtons = sinon.stub(this.oChartContainer._oChartSegmentedButton, "removeAllButtons");
	var stubSetDefaultOnSegmentedButton = sinon.stub(this.oChartContainer, "_setDefaultOnSegmentedButton");
	var stubSwitchChart = sinon.stub(this.oChartContainer, "switchChart");

	this.oChartContainer._chartChange();

	assert.ok(stubGetContent.called, "getContent called");
	assert.ok(stubDestroyButtons.called, "getContent called");
	assert.ok(stubDestroyButtons.calledWith(aUsedIcons), "getContent called with the used icons");
	assert.ok(stubRemoveAllButtons.called, "removeAllButtons on _oChartSegmentedButton called");
	assert.ok(stubSetDefaultOnSegmentedButton.called, "_setDefaultOnSegmentedButton called");
	assert.ok(stubSwitchChart.called, "switchChart called");
	assert.ok(stubSwitchChart.calledWith(null), "switchChart called with null");
	assert.deepEqual(this.oChartContainer._aUsedContentIcons, [], "_aUsedContentIcons is set to an empty array");
	assert.equal(this.oChartContainer._bChartContentHasChanged, false, "_bChartContentHasChanged set to false");
});

QUnit.test("_findChartById returns if no content was found", function(assert) {
	var stubGetAggregation = sinon.stub(this.oChartContainer, "getAggregation");

	var oChart = this.oChartContainer._findChartById();

	assert.ok(stubGetAggregation.called, "getAggregation called");
	assert.ok(stubGetAggregation.calledWith("content"), "getAggregation called with 'content'");
	assert.deepEqual(oChart, null, "null returned");
});

QUnit.test("_findChartById returns if no content was found", function(assert) {
	var sChartId = "testId";
	var stubGetId = sinon.stub().returns(sChartId);
	var oContent = {
		getId: stubGetId
	};
	var stubGetContent = sinon.stub().returns(oContent);
	var oObject = {
		getContent: stubGetContent
	};
	var stubGetAggregation = sinon.stub(this.oChartContainer, "getAggregation").returns([oObject]);

	var oChart = this.oChartContainer._findChartById(sChartId);

	assert.ok(stubGetAggregation.called, "getAggregation called");
	assert.ok(stubGetAggregation.calledWith("content"), "getAggregation called with 'content'");
	assert.ok(stubGetContent.called, "getContent called");
	assert.ok(stubGetId.called, "getId called");
	assert.deepEqual(oChart, oObject, "found chart is found");
});

QUnit.test("_adjustIconsDisplay removes segmented buttons when chart container is rendered", function(assert) {
	this.oChartContainer._bControlNotRendered = false;

	var spyRemoveAllButtons = sinon.stub(this.oChartContainer._oChartSegmentedButton, "removeAllButtons");

	this.oChartContainer._adjustIconsDisplay();

	assert.ok(spyRemoveAllButtons.called, "removeAllButtons on _oChartSegmentedButton called");
});

QUnit.test("_adjustIconsDisplay doesn't remove segmented buttons when chart container is not yet rendered", function(assert) {
	this.oChartContainer._bControlNotRendered = true;

	var spyRemoveAllButtons = sinon.stub(this.oChartContainer._oChartSegmentedButton, "removeAllButtons");

	this.oChartContainer._adjustIconsDisplay();

	assert.ok(spyRemoveAllButtons.notCalled, "removeAllButtons on _oChartSegmentedButton not called");
});

QUnit.test("_addButtonToCustomIcons adds an overflowToolbar button to the custom icons", function(assert) {
	this.oChartContainer._aCustomIcons = [];

	var sTooltip = "iconTooltip";
	var sSrc = "testSource";

	var stubGetTooltip = sinon.stub().returns(sTooltip);
	var stubGetSrc = sinon.stub().returns(sSrc);
	var oIcon = {
		getTooltip: stubGetTooltip,
		getSrc: stubGetSrc
	};

	this.oChartContainer._addButtonToCustomIcons(oIcon);

	assert.ok(stubGetTooltip.called, "getTooltip called");
	assert.ok(stubGetSrc.called, "getSrc called");
	var oBtn = this.oChartContainer._aCustomIcons[0];
	assert.ok(oBtn, "icon has been added");
	assert.equal(oBtn.getIcon(), sSrc, "icon added properly");
	assert.equal(oBtn.getText(), sTooltip, "text set as tooltip");
	assert.equal(oBtn.getTooltip(), sTooltip, "tooltip set as the past tooltip");
	assert.equal(oBtn.getType(), sap.m.ButtonType.Transparent, "button type set as sap.m.ButtonType.Transparent");
	assert.equal(oBtn.getWidth(), "3rem", "button width set to 3rem");
});

QUnit.test("_zoom zooms in when needed", function(assert) {
	if (sap.ui.Device.system.desktop) {
		var oContent = new sap.viz.ui5.controls.VizFrame();
		var stubGetContent = sinon.stub().returns(oContent);
		var oSelectedContent = {
			getContent: stubGetContent
		};

		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
		var stubZoom = sinon.stub(oContent, "zoom");
		var stubFireCustomZoomInPress = sinon.stub(this.oChartContainer, "fireCustomZoomInPress");
		var stubFireCustomZoomOutPress = sinon.stub(this.oChartContainer, "fireCustomZoomOutPress");

		this.oChartContainer._zoom(true);

		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.ok(stubGetContent.called, "getContent called");
		assert.ok(stubZoom.called, "zoomIn on the chart called");
		assert.ok(stubZoom.calledWith(sinon.match({"direction": "in"})), "zoomIn on the chart called with direction in");
		assert.ok(stubFireCustomZoomInPress.called, "fireCustomZoomInPress on the chart called");
		assert.ok(stubFireCustomZoomOutPress.notCalled, "fireCustomZoomOutPress on the chart not called");
	} else {
		assert.ok(!sap.ui.Device.system.desktop, "Skipping the test for mobile devices that do not have zoom buttons")
	}
});

QUnit.test("_zoom zooms out when needed", function(assert) {
	var bZoomIn = false;
	var oContent = new sap.viz.ui5.controls.VizFrame();
	var stubGetContent = sinon.stub().returns(oContent);
	var oSelectedContent = {
		getContent: stubGetContent
	};

	var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
	var stubZoom = sinon.stub(oContent, "zoom");
	var stubFireCustomZoomInPress = sinon.stub(this.oChartContainer, "fireCustomZoomInPress");
	var stubFireCustomZoomOutPress = sinon.stub(this.oChartContainer, "fireCustomZoomOutPress");

	this.oChartContainer._zoom(bZoomIn);

	assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
	assert.ok(stubGetContent.called, "getContent called");
	assert.ok(stubZoom.called, "zoomIn on the chart called");
	assert.ok(stubZoom.calledWith(sinon.match({"direction": "out"})), "zoomIn on the chart called with direction out");
	assert.ok(stubFireCustomZoomInPress.notCalled, "fireCustomZoomInPress on the chart not called");
	assert.ok(stubFireCustomZoomOutPress.called, "fireCustomZoomOutPress on the chart called");
});

QUnit.test("_destroyButtons destroys all passed buttons", function(assert) {
	var spyDestroy = sinon.spy();
	var oButton = {
		destroy: spyDestroy
	};
	var aButtons = [oButton, oButton];

	this.oChartContainer._destroyButtons(aButtons);

	assert.ok(spyDestroy.called, "destroy called");
	assert.ok(spyDestroy.calledTwice, "destroy called twice");
});


QUnit.test("_setShowLegendForAllCharts shows legend for all charts", function(assert) {
	var bShowLegend = true;
	var spySetLegendVisible = sinon.spy();
	var oInnerChart = {
		setLegendVisible: spySetLegendVisible
	};
	var spyGetInnerContent = sinon.stub().returns(oInnerChart);
	var oContent = {
		getContent: spyGetInnerContent
	};
	var aContents = [oContent, oContent];

	var stubGetContent = sinon.stub(this.oChartContainer, "getContent").returns(aContents);

	this.oChartContainer._setShowLegendForAllCharts(bShowLegend);

	assert.ok(stubGetContent.called, "getContent called");
	assert.ok(spyGetInnerContent.called, "getContent on innner content called");
	assert.ok(spyGetInnerContent.calledTwice, "getContent on innner content called twice");
	assert.ok(spySetLegendVisible.called, "setLegendVisible on innner chart called");
	assert.ok(spySetLegendVisible.calledTwice, "setLegendVisible on innner chart called twice");
	assert.ok(spySetLegendVisible.calledWith(bShowLegend), "setLegendVisible on innner chart called with the passed show legend flag");
});