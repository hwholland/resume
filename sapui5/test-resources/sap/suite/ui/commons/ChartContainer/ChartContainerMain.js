var oChartContainerMain = {
	/* ============================================================ */
	/* Initialization                                               */
	/* ============================================================ */
	/**
	 * Initializes the page.
	 *
	 * @public
	 */
	init : function() {
		var oChartContainer = new sap.suite.ui.commons.ChartContainer({
			customIcons : this._createChartContainerIcons(oConstants.chartContainer.icons),
			content : this._createChartContainerContent()
		});
		oChartContainer.setShowFullScreen(true);
		oChartContainer.setShowPersonalization(true);
		oChartContainer.setAutoAdjustHeight(true);

		oChartContainer.attachPersonalizationPress(this._onItemPress.bind(this, oConstants.chartContainer.personalizationPressMessage, null));
		oChartContainer.attachContentChange(this._onItemPress.bind(this, oConstants.chartContainer.contentChangeMessage, "selectedItemId"));

		var oDimensionSelectors = oConstants.chartContainer.dimensionSelectors;
		this._addChartContainerSelects(oChartContainer, oDimensionSelectors.selects);
		this._addChartContainerComboBoxes(oChartContainer, oDimensionSelectors.comboBoxes);

		var oApp = new sap.m.App();
		var oPage = this._createPage(oChartContainer);
		oApp.addPage(oPage);
		oApp.placeAt("content");
	},
	/* ============================================================ */
	/* Event Handling                                               */
	/* ============================================================ */
	/**
	 * Item press event handler.
	 *
	 * Calls MessageToas show method to display a message.
	 *
	 * @private
	 * @param {String} message Message to display
	 * @param {String} [paramName] Name of the parameter to get from the event
	 * @param {sap.ui.base.Event} oEvent The fired event
	 */
	_onItemPress : function (message, paramName, oEvent) {
		var oMessage = paramName ? message + oEvent.getParameter(paramName) : message;
		sap.m.MessageToast.show(oMessage);
	},
	/**
	 * Selection changed event handler.
	 *
	 * Alerts the passed message.
	 *
	 * @private
	 * @param {String} message Message to display
	 */
	_onSelectionChanged : function(message) {
		alert(message);
	},
	/* ============================================================ */
	/* Helper Methods                                               */
	/* ============================================================ */
	/**
	 * Creates a page for the test suite.
	 *
	 * @private
	 * @param {sap.suite.ui.commons.ChartContainer} chartContainer ChartContainer
	 */
	_createPage : function(chartContainer) {
		var oVBox = new sap.m.VBox({
			layoutData : new sap.ui.layout.SplitterLayoutData({
				resizable : false,
				size : "200px"
			}),
			items : [new sap.m.Text({
				text : oConstants.chartContainer.verticalBox.text
			})]
		});

		var oSplitter = new sap.ui.layout.Splitter({
			width : "100%",
			height : "100%",
			contentAreas : [oVBox, chartContainer]
		});

		var oText = oConstants.chartContainer.visibilityButton.text;
		var oVisibilityButton = new sap.m.Button({
			text : oText.main,
			press : function () {
				if (this.getText() === oText.main) {
					chartContainer.getSelectedContent().setVisible(false);
					var oContent = chartContainer.getContent();
					for (var i = 0; i < oContent.length; i++) {
						if (oContent[i].getVisible()) {
							chartContainer.switchChart(oContent[i]);
							break;
						}
					}
					chartContainer.updateChartContainer();
					this.setText(oText.reset);
				} else {
					var oChartContainerContent = chartContainer.getContent();
					for (var i = 0; i < oChartContainerContent.length; i++) {
						oChartContainerContent[i].setVisible(true);
					}
					chartContainer.updateChartContainer();
					this.setText(oText.main);
				}
			}
		});

		var oPageToolbar =  new sap.m.Toolbar({
			content : oVisibilityButton
		});

		return new sap.m.Page({
			title : oConstants.chartContainer.page.title,
			enableScrolling : false,
			content : oSplitter,
			subHeader : oPageToolbar
		});
	},
	/**
	 * Creates Chart Container content.
	 *
	 * @private
	 */
	_createChartContainerContent : function() {
		var aParams = this._createChartContainerParams();
		var aContents = [];

		for (var i = 0; i < aParams.length; i++) {
			aContents.push(new sap.suite.ui.commons.ChartContainerContent(aParams[i]));
		}

		return aContents;
	},
	/**
	 * Creates Chart Container parameters used for the content.
	 *
	 * @private
	 * @returns {Object[]} Chart Container parameters
	 */
	_createChartContainerParams : function() {
		// add analysis object to the first viz frame's feed items
		var oAnalysisObject = new sap.viz.ui5.controls.common.feeds.AnalysisObject(oConstants.vizFrames.bar.analysisObject);
		oConstants.vizFrames.bar.feedItems[1].values.push(oAnalysisObject);

		var oVizFrameBar = this._createVizFrame(oConstants.vizFrames.bar, oData.vizFrame);
		var oVizFrameLine = oVizFrameBar.clone(); //copy data from bar chart to line chart
		oVizFrameLine.setVizType("line");
		var oVizFrameBubble = this._createVizFrame(oConstants.vizFrames.bubble, oData.vizFrame3);
		var oVizFrameColumn = oVizFrameBar.clone(); //copies data from bar chart to column chart
		oVizFrameColumn.setVizType("column");
		var oVizFrameStackedBar = this._createVizFrame(oConstants.vizFrames.stackedBar, oData.vizFrame5);
		var oVizFrameStackedColumn = oVizFrameStackedBar.clone(); //clones data from stacked bar to stacked column chart
		oVizFrameStackedColumn.setVizType("stacked_column");
		var oVizFrameBullet = this._createVizFrame(oConstants.vizFrames.bullet, oData.vizFrame8);
		var oVizFrameCombination = oVizFrameBullet.clone(); //clones data from bullet chart to combination chart
		oVizFrameCombination.setVizType("combination");
		var oTable = this._createTable(oVizFrameBubble.getModel());

		return [{
			icon : "sap-icon://horizontal-bar-chart",
			title : "vizFrame Bar Chart Sample",
			content: oVizFrameBar
		}, {
			icon : "sap-icon://line-chart",
			title : "vizFrame Line Chart Sample",
			content: oVizFrameLine
		}, {
			icon : "sap-icon://bubble-chart",
			title : "vizFrame Bubble Chart Sample",
			content: oVizFrameBubble
		}, {
			icon : "sap-icon://vertical-bar-chart",
			title : "vizFrame Column Chart Sample",
			content: oVizFrameColumn
		}, {
			icon : "sap-icon://horizontal-stacked-chart",
			title : "vizFrame Stacked Bar Chart Sample",
			content: oVizFrameStackedBar
		}, {
			icon : "sap-icon://vertical-stacked-chart",
			title : "vizFrame Stacked Column Chart Sample",
			content: oVizFrameStackedColumn
		}, {
			icon : "sap-icon://business-objects-experience",
			title : "vizFrame Combination Chart Sample",
			content: oVizFrameCombination
		}, {
			icon : "sap-icon://horizontal-bar-chart-2",
			title : "vizFrame Bullet Chart Sample",
			content: oVizFrameBullet
		}, {
			icon : "sap-icon://table-chart",
			title : "Table Sample",
			content: oTable
		}, {
			icon : "sap-icon://map",
			title : "AnalyticMap Sample",
			content: getAnalyticMap()
		}];
	},
	/**
	 * Creates a Viz Frame with the passed constants and data.
	 *
	 * @private
	 * @param {Object} constants Constants
	 * @param {Object} data Data
	 * @returns {sap.viz.ui5.controls.VizFrame} Viz Frame
	 */
	_createVizFrame: function(constants, data) {
		var oVizFrame = new sap.viz.ui5.controls.VizFrame(constants.vizFrameConfig);

		var oDataset = new sap.viz.ui5.data.FlattenedDataset(constants.dataset);
		var oModel = oHelpers.getVizFrameModel(data.modelData);

		oVizFrame.setDataset(oDataset);
		oVizFrame.setModel(oModel);
		if (constants.vizProperties) {
			oVizFrame.setVizProperties(constants.vizProperties);
		}

		oHelpers.addFeedItems(oVizFrame, constants.feedItems);

		return oVizFrame;
	},
	/**
	 * Creates table used in the chart container content.
	 *
	 * @private
	 * @param {sap.ui.model.Model} model Model to use for the table
	 * @returns {sap.m.Table} The created table
	 */
	_createTable : function(model) {
		var oTable = new sap.m.Table({ //table chart
			width : "100%",
			fixedLayout : true,
			columns : oHelpers.createTableColumns(oConstants.table.columnLabelTexts)
		});

		var oTableTemplate = new sap.m.ColumnListItem({
			type : sap.m.ListType.Active,
			cells : oHelpers.createLabels(oConstants.table.templateCellLabelTexts)
		});

		oTable.bindItems(oConstants.table.itemBindingPath, oTableTemplate);
		oTable.setModel(model);

		return oTable;
	},
	/**
	 * Creates Chart Container parameters used for the content.
	 *
	 * @private
	 * @param {Object[]} icons Icons configuration used to create sap.ui.core.Icon
	 * @returns {sap.ui.core.Icon[]} Array of sap.ui.core.Icons
	 */
	_createChartContainerIcons : function(icons) {
		var aIcons = [];

		for (var i = 0; i < icons.length; i++) {
			aIcons.push(
				new sap.ui.core.Icon({
					src : icons[i].src,
					tooltip : icons[i].tooltip,
					width : icons[i].width,
					press : this._onItemPress.bind(this, icons[i].pressMessage, "id")
				})
			);
		}

		return aIcons;
	},
	/**
	 * Adds all Chart Container selects as dimension selectors.
	 *
	 * @private
	 * @param {sap.suite.ui.commons.ChartContainer} chartContainer Chart container
	 * @param {Object[]} selects Array of selects
	 */
	_addChartContainerSelects : function(chartContainer, selects) {
		var oSelectProps = {};
		for (var i = 0; i < selects.length; i++) {
			if (selects[i].name) {
				oSelectProps.name = selects[i].name;
			}

			oSelectProps.items = oHelpers.getCoreItems(selects[i].items);

			chartContainer.addDimensionSelector(new sap.m.Select(oSelectProps));
		}
	},
	/**
	 * Adds all Chart Container combo boxes as dimension selectors.
	 *
	 * @private
	 * @param {sap.suite.ui.commons.ChartContainer} chartContainer Chart container
	 * @param {Object[]} comboBoxes Array of combo boxes
	 */
	_addChartContainerComboBoxes : function(chartContainer, comboBoxes) {
		var oComboBox;
		for (var i = 0; i < comboBoxes.length; i++) {
			oComboBox = new sap.m.ComboBox({
				selectedKey: comboBoxes[i].selectedKey,
				items: comboBoxes[i].items,
				selectionChange: this._onSelectionChanged.bind(this, comboBoxes[i].selectionChangeMessage)
			});
			oComboBox.setWidth('10rem');

			chartContainer.addDimensionSelector(oComboBox);
		}
	}
}