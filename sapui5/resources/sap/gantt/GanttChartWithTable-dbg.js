/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Core", "sap/ui/Device", "sap/gantt/GanttChartBase", "sap/ui/table/Column", "sap/ui/table/TreeTable", "sap/ui/core/ScrollBar",
	"sap/ui/layout/Splitter", "sap/ui/layout/SplitterLayoutData",
	"sap/gantt/GanttChart", "sap/gantt/control/Cell", "sap/gantt/control/Toolbar",
	"sap/gantt/control/AssociateContainer","sap/gantt/drawer/SelectionPanel",
	"sap/gantt/misc/Utility", "sap/gantt/misc/AxisOrdinal","sap/ui/thirdparty/d3"
], function (Core, Device, GanttChartBase, Column, TreeTable, ScrollBar, Splitter, SplitterLayoutData,
		GanttChart, Cell, Toolbar, AssociateContainer, SelectionPanelDrawer, Utility, AxisOrdinal) {
	"use strict";
	
	/**
	 * Creates and initializes a new Gantt Chart with a TreeTable control on the left and a svg chart area on the right.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * 
	 * @class 
	 * Embed a <code>sap.ui.table.TreeTable</code> and a <code>sap.gantt.GanttChart</code> side-by-side.
	 * 
	 * <p>This class defines:
	 * The TreeTable part provide a column view of data with sorting/filtering functions available. The svg chart part provide graphic Gantt chart
	 * view of data. Both width can be adjusted by a splitter bar, and row scrolling are always synchronized.3
	 * </p>
	 * 
	 * @extends sap.gantt.GanttChartBase
	 * 
	 * @author SAP SE
	 * @version 1.38.22
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.GanttChartWithTable
	 */
	var GanttChartWithTable = GanttChartBase.extend("sap.gantt.GanttChartWithTable", /** @lends sap.gantt.GanttChartWithTable.prototype */ {
		metadata: {
			properties: {
				
				/**
				 * A customized cell callback function.
				 * 
				 * <p> This property is used in combination with configuration property <code>hierarchies</code>.
				 * If aggregation <code>columns</code> is provided, property <code>hierarchies</code> and <code>cellCallback</code> is ignored.
				 * Otherwise property <code>hierarchies</code> must provide column configurations that cellCallback can consume. And if cellCallback
				 * is not provided, a default cellCallback adds <code>sap.m.Label</code> to fill cells.
				 * </p>
				 */
				cellCallback: {type: "object"},
				
				/**
				 * Property propagated from <code>sap.ui.table.Table</code>.
				 * @see sap.ui.table.Table#fixedColumnCount
				 */
				fixedColumnCount: {type: "int"}
			},
			aggregations: {
				
				/**
				 * Controls to be place in Gantt chart toolbar.
				 * 
				 * <p>This aggregation is only used when custom toolbar item group is configured to be shown in Gantt chart toolbar.
				 * Different from the build-in buttons which are configured to be shown or hidden, these are free controls created 
				 * by application, only they are placed in container toolbar by <code>sap.gantt.GanttChartWithTable</code>.</p>
				 * 
				 * <p>A common recommendation is, if the source select group is enabled and application wants to pre-configure
				 * container layouts, the chance to change custom toolbar items is in event handler to event <code>ganttChartSwitchRequested</code>.</p>
				 */
				customToolbarItems: {type: "sap.ui.core.Control", multiple: true, visibility: "public",
					singularName: "customToolbarItem", bindable: "bindable"},
					
				/**
				 * Aggregation delegated to <code>sap.ui.table.Table</code>.
				 * 
				 * <p>If this aggregation is provided, call back property <code>cellCallBack</code> and column configuration in property <code>hierarchies</code> will be ignored.</p>
				 * @see sap.ui.table.Table#columns
				 */
				columns: {type: "sap.ui.table.Column", multiple: true, visibility: "public", singularName: "column"},
				
				_selectionPanel: {type: "sap.ui.table.TreeTable", multiple: false, visibility: "hidden"},
				_chart: {type: "sap.gantt.GanttChart", multiple: false, visibility: "hidden"}
			}
		}
	});

	GanttChartWithTable.prototype.init = function () {
		GanttChartBase.prototype.init.apply(this, arguments);
		// create chart
		jQuery.sap.measure.start("GanttChartWithTable Init","GanttPerf:GanttChartWithTable Init function");
		this._oGanttChart = new GanttChart();
		this.setAggregation("_chart", this._oGanttChart);
		this._oGanttChartCnt = new AssociateContainer({
			enableRootDiv: true,
			content: this._oGanttChart
		});
		this._oTC = this._oGanttChart._oTT;
		var that = this;

		// create selection panel
		this._oTT = new TreeTable({
			visibleRowCountMode: "Auto",
			minAutoRowCount: 1,
			fixedColumnCount: this.getFixedColumnCount(),
			selectionBehavior: sap.ui.table.SelectionBehavior.Row
			//selectionMode: sap.ui.table.SelectionMode.Multi
		});

		this._oTT._bVariableRowHeightEnabled = true;

		//this will enable the legacy multi selection mode in 1.38.8
		this._oTT._enableLegacyMultiSelection = true;
		this._oTT.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		this._oTT._collectRowHeights = function(){
			that._aHeights = TreeTable.prototype._collectRowHeights.apply(this);
			var iBaseRowHeight = that._aHeights[0];
			var iFirstVisibleRowIndex = this.getFirstVisibleRow();
			var iRowCount = that._aHeights.length;
			var iMainRowHeight = iBaseRowHeight;
			var aShapeData = that._oGanttChart._getDrawingData([iFirstVisibleRowIndex,iFirstVisibleRowIndex + iRowCount - 1]);
			if (aShapeData && aShapeData.length > 0){
				iMainRowHeight = aShapeData[0].rowSpan * iBaseRowHeight;
			}
			for (var i = 0; i < iRowCount; i++) {
				var oContext = this.getContextByIndex(iFirstVisibleRowIndex + i);
				if (oContext){
					var oContextObject = oContext.getObject();
					var sUid = oContextObject ? oContextObject.uid : undefined;
					if (sUid && that._oGanttChart._oRowStatusMap[sUid]){
						that._aHeights[i] = that._oGanttChart._oRowStatusMap[sUid].visibleRowSpan * iBaseRowHeight;
					} else {
						that._aHeights[i] = iMainRowHeight;
					}
				} else {
					that._aHeights[i] = iBaseRowHeight;
				}
			}
			return that._aHeights;
		};

		this._oTT._updateTableContent = function() {
			sap.ui.table.TreeTable.prototype._updateTableContent.apply(this, arguments);

			var aRows = this.getRows(),
				aRowHeights = that._aHeights;
			if (!aRowHeights) {
				return;
			}
			var $fixedRows = this.$().find(".sapUiTableCtrlFixed > tbody > tr");
			var $rowHeaders = this.$().find(".sapUiTableRowHdr");
			for (var iIndex = 0; iIndex < aRows.length; iIndex++) {
				var $Row = aRows[iIndex].$(),
					$fixedRow = $fixedRows.filter(":eq(" + iIndex + ")"),
					$rowHeader = $rowHeaders.filter(":eq(" + iIndex + ")"),
					iHeight = aRowHeights[iIndex] || 0;
				var iBaseRowHeight = that._oGanttChart.getBaseRowHeight();
				var bAddedClass = iHeight / iBaseRowHeight > 1;
				$Row.toggleClass('sapGanttExpandedRow', bAddedClass);
				$fixedRow.toggleClass('sapGanttExpandedRow', bAddedClass);
				$rowHeader.toggleClass('sapGanttExpandedRow', bAddedClass);
			}
		};

		this._oTT.onvscroll = function (oEvent) {
			sap.ui.table.TreeTable.prototype.onvscroll.apply(this, arguments);
			that._onSelectionPanelVSbScroll();
		};

		this._oTT.attachToggleOpenState(function(oEvent) {
			//bubble up the toggle event
			that.fireTreeTableToggleEvent({
				rowIndex : oEvent.getParameter("rowIndex"),
				rowContext : oEvent.getParameter("rowContext"),
				expanded : oEvent.getParameter("expanded")
			});
		});

		this._oTT.attachEvent("_rowsUpdated", this._onTTRowUpdate.bind(this));

		this.setAggregation("_selectionPanel", this._oTT);
		this._oToolbar = new Toolbar({
			type: sap.gantt.control.ToolbarType.Local,
			sourceId: sap.gantt.config.DEFAULT_HIERARCHY_KEY
		});
		this._oToolbar.data("holder", this);
		this._oToolbar.attachSourceChange(this._onToolbarSourceChange, this);
		this._oToolbar.attachExpandTreeChange(this._onToolbarExpandTreeChange, this);
		this._oToolbar.attachModeChange(this._onToolbarModeChange, this);
		this._oTT.addExtension(this._oToolbar);
		this._oSelectionPanelCnt = new AssociateContainer({
			enableRootDiv: true,
			content: this._oTT,
			layoutData: new SplitterLayoutData({
				size: "30%"
			})
		});

		// create horizontal layout
		this._oSplitter = new Splitter({
			width: "100%",
			height: "100%",
			orientation: sap.ui.core.Orientation.Horizontal,
			contentAreas: [this._oSelectionPanelCnt, this._oGanttChartCnt]
		}).addStyleClass("sapGanttViewSplitterH");

		// attach this to layout resize
		this._oSplitter.attachResize(this._onSplitterResize, this);

		// sync oTC oTT vertical scroll
		this._oGanttChart.attachHorizontalScroll(this._onChartHSbScroll, this);
		this._oGanttChart.attachVerticalScroll(this._onChartVSbScroll, this);
		this._oGanttChart.attachRowSelectionChange(this._onRowSelectionChange, this);
		this._oGanttChart.attachShapeSelectionChange(this._onShapeSelectionChange, this);
		this._oGanttChart.attachChartMouseOver(this._onChartMouseOver, this);
		this._oGanttChart.attachRelationshipSelectionChange(this._onRelationshipSelectionChange, this);
		this._oGanttChart.attachChartClick(this._onClick, this);
		this._oGanttChart.attachChartDoubleClick(this._onDoubleClick, this);
		this._oGanttChart.attachChartRightClick(this._onRightClick, this);

		this._oGanttChart.attachEvent("_zoomInfoUpdated", this._onZoomInfoUpdated, this);
		this._oGanttChart.attachEvent("_shapesUpdated", this._onShapesUpdated, this);
		this._oGanttChart.attachChartDragEnter(this._onChartDragEnter, this);
		this._oGanttChart.attachChartDragLeave(this._onChartDragLeave, this);
		this._oGanttChart.attachShapeDragEnd(this._onShapeDragEnd, this);
		
		this._oModesConfigMap = {};
		this._oModesConfigMap[sap.gantt.config.DEFAULT_MODE_KEY] = sap.gantt.config.DEFAULT_MODE;
		
		this._oToolbarSchemeConfigMap = {};
		this._oToolbarSchemeConfigMap[sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY] = sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME;
		this._oToolbarSchemeConfigMap[sap.gantt.config.EMPTY_TOOLBAR_SCHEME_KEY] = sap.gantt.config.EMPTY_TOOLBAR_SCHEME;
		
		this._oHierarchyConfigMap = {};
		this._oHierarchyConfigMap[sap.gantt.config.DEFAULT_HIERARCHY_KEY] = sap.gantt.config.DEFAULT_HIERARCHY;
		this._oDefaultExpansionStatus = {};

		this._oSelectionPanelDrawer = new SelectionPanelDrawer();

		this._bCanApplyTableTransform = true;
		this._iFirstVisiableRowIndex = undefined;

		// defualt maps
		this._oGanttChartSchemesConfigMap = {};
		this._oGanttChartSchemesConfigMap[sap.gantt.config.DEFAULT_CHART_SCHEME_KEY] = sap.gantt.config.DEFAULT_CHART_SCHEME;
		this._oObjectTypesConfigMap = {};
		this._oObjectTypesConfigMap[sap.gantt.config.DEFAULT_OBJECT_TYPE_KEY] = sap.gantt.config.DEFAULT_OBJECT_TYPE;
		this._oShapesConfigMap = {};
		jQuery.sap.measure.end("GanttChartWithTable Init");
	};
	
	GanttChartWithTable.prototype.setFixedColumnCount = function (iFixedColumnCount) {
		this.setProperty("fixedColumnCount", iFixedColumnCount);
		this._oTT.setFixedColumnCount(iFixedColumnCount);
		return this;
	};
	
	GanttChartWithTable.prototype.setTimeAxis = function (oTimeAxis) {
		this.setProperty("timeAxis", oTimeAxis, true);
		this._oGanttChart.setTimeAxis(oTimeAxis);
		return this;
	};

	GanttChartWithTable.prototype.setMode = function (sMode) {
		this.setProperty("mode", sMode);
		this._oGanttChart.setMode(sMode);
		this._oToolbar.setMode(sMode);
		return this;
	};
	
	GanttChartWithTable.prototype.setModes = function (aModes) {
		this.setProperty("modes", aModes);
		this._oToolbar.setModes(aModes);
		this._oGanttChart.setModes(aModes);
		this._oModesConfigMap = {};
		if (aModes) {
			for (var i = 0; i < aModes.length; i++) {
				this._oModesConfigMap[aModes[i].getKey()] = aModes[i];
			}
		}
		return this;
	};
	
	GanttChartWithTable.prototype.setSelectionMode = function (sSelectionMode) {
		this.setProperty("selectionMode", sSelectionMode);
		if (this._oTT) {
			if (sSelectionMode == sap.gantt.SelectionMode.None) {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.None);
				this._oTT.setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
			}else if (sSelectionMode == sap.gantt.SelectionMode.MultiWithKeyboard) {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
				this._oTT.setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
			}else {
				if (sSelectionMode == sap.gantt.SelectionMode.Single) {
					this._oTT.setSelectionMode(sap.ui.table.SelectionMode.Single);
				}else {
					this._oTT.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
				}
				this._oTT.setSelectionBehavior(sap.ui.table.SelectionBehavior.Row);
			}
		}
		
		if (this._oGanttChart) {
			this._oGanttChart.setSelectionMode(sSelectionMode);
		}
		return this;
	};
	
	GanttChartWithTable.prototype.setToolbarSchemes = function (aToolbarSchemes) {
		this.setProperty("toolbarSchemes", aToolbarSchemes);
		this._oToolbar.setToolbarSchemes(aToolbarSchemes);
		this._oToolbarSchemeConfigMap = {};
		if (aToolbarSchemes) {
			for (var i = 0; i < aToolbarSchemes.length; i++) {
				this._oToolbarSchemeConfigMap[aToolbarSchemes[i].getKey()] = aToolbarSchemes[i];
			}
		}
		return this;
	};

	GanttChartWithTable.prototype.setHierarchyKey = function (sHierarchyKey) {
		this.setProperty("hierarchyKey", sHierarchyKey);
		this._oGanttChart.setProperty("hierarchyKey", sHierarchyKey);
		this._oToolbar.setSourceId(sHierarchyKey);
		this._hierarchyChange();
		return this;
	};
	
	GanttChartWithTable.prototype.setHierarchies = function (aHierarchies) {
		this.setProperty("hierarchies", aHierarchies);
		this._oToolbar.setHierarchies(aHierarchies);
		this._oGanttChart.setHierarchies(aHierarchies);
		this._oHierarchyConfigMap = {};
		if (aHierarchies) {
			for (var i = 0; i < aHierarchies.length; i++) {
				this._oHierarchyConfigMap[aHierarchies[i].getKey()] = aHierarchies[i];
			}
		}
		this._hierarchyChange();
		return this;
	};
	
	GanttChartWithTable.prototype.setCalendarDef = function (oCalendarDef) {
		this.setAggregation("calendarDef", oCalendarDef);
		/*
		 * Copy oCalendarDef to this._oGanttChart instead of set it directly to this._oGanttChart.
		 * Because if we do so, in binding case, copying of private aggregation '_chart' won't copy
		 * template calendarDef. Therefore have to go this way.
		 * And in this way, have to set templateShareable = true if oCalendarDef is a template. 
		 */
		var oPSBindingInfo = oCalendarDef.getBindingInfo("defs");
		if (oPSBindingInfo) {
			oPSBindingInfo.templateShareable = true;
		}
		this._oGanttChart.setCalendarDef(oCalendarDef.clone());
		return this;
	};
	
	GanttChartWithTable.prototype._hierarchyChange = function () {
		var sHierarchyKey = this.getHierarchyKey();
		if (sHierarchyKey && this._oHierarchyConfigMap[sHierarchyKey]) {
			// if current hierarchy has a column configuration, generate columns from configuration.
			if (this._oHierarchyConfigMap[sHierarchyKey].getColumns() &&
					this._oHierarchyConfigMap[sHierarchyKey].getColumns().length > 0) {
				this._buildColumnFromCellCallback();
			} 
			// adjust current mode
			var sMode =  this.getMode();
			if (sMode === sap.gantt.config.DEFAULT_MODE_KEY && this._oHierarchyConfigMap[this.getHierarchyKey()]) {
				sMode = this._oHierarchyConfigMap[this.getHierarchyKey()].getActiveModeKey();
			}
			this.setMode(sMode);
		}
	};

	GanttChartWithTable.prototype._buildColumnFromCellCallback = function () {
		this._oTT.removeAllColumns();
		
		var oHierarchyConfig, aColumnConfig;
		oHierarchyConfig = this._oHierarchyConfigMap[this.getHierarchyKey()];
		if (oHierarchyConfig){
			aColumnConfig = oHierarchyConfig.getColumns();
		}
		if (aColumnConfig) {
			for (var i = 0; i < aColumnConfig.length; i++) {
				var oCol = new Column({
					label: aColumnConfig[i].getTitle(),
					sortProperty: aColumnConfig[i].getSortAttribute(),
					filterProperty: aColumnConfig[i].getFilterAttribute(),
					width: aColumnConfig[i].getWidth(),
					template: new Cell({
						cellCallback: this.getCellCallback(),
						columnConfig: aColumnConfig[i]
					})
				});
				this._oTT.addColumn(oCol);
			}
		}
	};
	
	GanttChartWithTable.prototype.setObjectTypes = function (aObjectTypes) {
		this.setProperty("objectTypes", aObjectTypes, true);
		this._oGanttChart.setObjectTypes(aObjectTypes);
		// build a map for easy look up
		this._oObjectTypesConfigMap = {};
		if (aObjectTypes) {
			for (var i = 0; i < aObjectTypes.length; i++){
				this._oObjectTypesConfigMap[aObjectTypes[i].getKey()] = aObjectTypes[i];
			}
		}
		return this;
	};
	
	GanttChartWithTable.prototype.setChartSchemes = function (aChartSchemes) {
		this.setProperty("chartSchemes", aChartSchemes, true);
		this._oGanttChart.setChartSchemes(aChartSchemes);
		// build a map for easy look up
		this._oGanttChartSchemesConfigMap = {};
		if (aChartSchemes) {
			for (var i = 0; i < aChartSchemes.length; i++) {
				this._oGanttChartSchemesConfigMap[aChartSchemes[i].getKey()] = aChartSchemes[i];
			}
		}
		return this;
	};
	
	GanttChartWithTable.prototype.setShapeDataNames = function (aShapeDataNames) {
		this.setProperty("shapeDataNames", aShapeDataNames);
		this._oGanttChart.setShapeDataNames(aShapeDataNames);
		return this;
	};
	
	GanttChartWithTable.prototype.setLocale = function (oLocale) {
		this.setProperty("locale", oLocale, true);
		this._oGanttChart.setLocale(oLocale);
		return this;
	};
	
	GanttChartWithTable.prototype.setShapes = function (aShapes) {
		this.setProperty("shapes", aShapes, true);
		this._oGanttChart.setShapes(aShapes);
		// build a map for easy look up
		this._oShapesConfigMap = {};
		if (aShapes) {
			for (var i = 0; i < aShapes.length; i++) {
				this._oShapesConfigMap[aShapes[i].getKey()] = aShapes[i];
			}
		}
		return this;
	};

	GanttChartWithTable.prototype.setSvgDefs = function (oSvgDefs) {
		this.setProperty("svgDefs", oSvgDefs);
		this._oGanttChart.setSvgDefs(oSvgDefs);
		return this;
	};

	GanttChartWithTable.prototype.setEnableCursorLine = function (bEnableCursorLine) {
		this.setProperty("enableCursorLine", bEnableCursorLine);
		this._oGanttChart.setEnableCursorLine(bEnableCursorLine);
		this._oToolbar.setEnableCursorLine(bEnableCursorLine);
		return this;
	};

	GanttChartWithTable.prototype.setEnableNowLine = function (bEnableNowLine) {
		this.setProperty("enableNowLine", bEnableNowLine);
		this._oGanttChart.setEnableNowLine(bEnableNowLine);
		this._oToolbar.setEnableNowLine(bEnableNowLine);
		return this;
	};

	GanttChartWithTable.prototype.setEnableVerticalLine = function (bEnableVerticalLine) {
		this.setProperty("enableVerticalLine", bEnableVerticalLine);
		this._oGanttChart.setEnableVerticalLine(bEnableVerticalLine);
		this._oToolbar.setEnableVerticalLine(bEnableVerticalLine);
		return this;
	};

	GanttChartWithTable.prototype.setTimeZoomRate = function (fTimeZoomRate) {
		this.setProperty("timeZoomRate", fTimeZoomRate, true);
		this._oGanttChart.setTimeZoomRate(fTimeZoomRate);
		return this;
	};
	
	GanttChartWithTable.prototype.getTimeZoomRate = function () {
		return this._oGanttChart.getTimeZoomRate();
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.addRelationship = function (oRelationship) {
		this._oGanttChart.addRelationship(oRelationship);
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.insertRelationship = function (iIndex, oRelationship) {
		this._oGanttChart.insertRelationship(iIndex, oRelationship);
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.removeRelationship = function (oRelationship) {
		this._oGanttChart.removeRelationship(oRelationship);
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.getRelationships = function () {
		this._oGanttChart.getRelationships();
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.destroyRelationships = function () {
		this._oGanttChart.destroyRelationships();
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.indexOfRelationship = function (oRelationship) {
		this._oGanttChart.indexOfRelationship(oRelationship);
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChartWithTable.prototype.removeAllRelationships = function () {
		this._oGanttChart.removeAllRelationships();
	};
	
	// This method is needed because once relationships data is retrieved from the backend,
	// UI5 core will try to call this method and if it not exist the updateAggregation method is called,
	// then it will execute binding.factory method which is a dummy method and causes exceptions.
	GanttChartWithTable.prototype.updateRelationships = function (sReason) {
		this._oGanttChart.updateRelationships(sReason);
	};

	GanttChartWithTable.prototype.setSelectionPanelSize = function (sCSSSize, bSuppressInvalidate) {
		this.setProperty("selectionPanelSize", sCSSSize, bSuppressInvalidate);
		this._oSelectionPanelCnt.setLayoutData(new SplitterLayoutData({
			size: sCSSSize
		}));
		return this;
	};

	GanttChartWithTable.prototype.addColumn = function (oColumn) {
		this._oTT.addColumn(oColumn);
	};

	GanttChartWithTable.prototype.insertColumn = function (oColumn, iIndex) {
		this._oTT.insertColumn(oColumn, iIndex);
	};

	GanttChartWithTable.prototype.removeColumn = function (oColumn) {
		this._oTT.removeColumn(oColumn);
	};

	GanttChartWithTable.prototype.removeAllColumns = function () {
		this._oTT.removeAllColumns();
	};
	
	GanttChartWithTable.prototype.getColumns = function () {
		return this._oTT.getColumns();
	};

	GanttChartWithTable.prototype._bindAggregation = function (sName, oBindingInfo) {
		var oModel, oBindingContext;
		if (sName == "rows" && oBindingInfo){
			oModel = this.getModel(oBindingInfo.model);
			// resolve the path if gantt chart itself is binded
			oBindingContext = this.getBindingContext(oBindingInfo.model);
			if (oBindingContext && oModel){
				oBindingInfo.path = oModel.resolve(oBindingInfo.path, oBindingContext);
			}
			// bind rows to tt and chart, two diff binding objects will be created
			this._oTT.bindRows(oBindingInfo);
			this._oGanttChart.bindRows(oBindingInfo);
			// sync behaviors of both controls (expand, etc...)
			this._oTC.updateRows = this._updateRows.bind(this);
		} else if (sName == "relationships" && oBindingInfo) {
			oModel = this.getModel(oBindingInfo.model);
			// resolve the path if gantt chart itself is binded
			oBindingContext = this.getBindingContext(oBindingInfo.model);
			if (oBindingContext && oModel){
				oBindingInfo.path = oModel.resolve(oBindingInfo.path, oBindingContext);
			}
			this._oGanttChart.bindRelationships(oBindingInfo);
		} else if (sName == "columns" && oBindingInfo) {
			oModel = this.getModel(oBindingInfo.model);

			oBindingContext = this.getBindingContext(oBindingInfo.model);
			if (oBindingContext && oModel){
				oBindingInfo.path = oModel.resolve(oBindingInfo.path, oBindingContext);
			}
			// bind columns to tt
			this._oTT.bindColumns(oBindingInfo);
		} else {
			return sap.ui.core.Control.prototype._bindAggregation.apply(this, arguments);
		}
	};

	GanttChartWithTable.prototype._updateRows = function (sReason) {
		if (this._oTC.getFirstVisibleRow() === this._oTT.getFirstVisibleRow() || sReason === sap.ui.model.ChangeReason.Filter || sReason === sap.ui.model.ChangeReason.Sort){
			sap.ui.table.Table.prototype.updateRows.apply(this._oTT, arguments);
		}
		sap.ui.table.Table.prototype.updateRows.apply(this._oTC, arguments);
	};

	GanttChartWithTable.prototype._detachToolbarEvents = function () {
		this._oToolbar.detachSourceChange(this._onToolbarSourceChange, this);
		this._oToolbar.detachExpandTreeChange(this._onToolbarExpandTreeChange, this);
	};

	GanttChartWithTable.prototype.onAfterRendering = function () {
		//expand tree table to default level expandedLevels defined in configuration of hierarchy
		this._expandDefaultLevel();
		this._attachEvents();
	};

	GanttChartWithTable.prototype._adjustChartHeaderHeight = function (){
		var $tableExtDiv = this._oTT.$().find(".sapUiTableExt");
		var $tableHeaderDiv = this._oTT.$().find(".sapUiTableColHdrCnt");
		var iGanttChartHeaderHeight;
		if ($tableExtDiv.height() === null){
			iGanttChartHeaderHeight = $tableExtDiv.outerHeight() + $tableHeaderDiv.height();
		} else {
			iGanttChartHeaderHeight = $tableExtDiv.outerHeight() + $tableHeaderDiv.height() + 1;
		}

		var $headerDiv = this._oGanttChart.$().find(".sapGanttChartHeader");
		$headerDiv.height(iGanttChartHeaderHeight);
		$headerDiv.css("min-height", iGanttChartHeaderHeight);
		var $headerSvg = this._oGanttChart.$().find(".sapGanttChartHeaderSvg");
		$headerSvg.height(iGanttChartHeaderHeight);
		$headerSvg.css("min-height", iGanttChartHeaderHeight);
	};

	GanttChartWithTable.prototype.onBeforeRendering = function () {
		if (this._oToolbar.getAllToolbarItems().length === 0) {
			this._oTT.removeExtension(this._oToolbar);
		} else if (this._oTT.getExtension().length == 0){
			this._oTT.addExtension(this._oToolbar);
		}
	};

	GanttChartWithTable.prototype._attachEvents = function () {
		// add 'onAfterRendering' event delegate to this._oTT
		var oDelegate = {
			onAfterRendering: this._syncGanttTablesDomEvents
		};
		this._oTT.removeEventDelegate(oDelegate);
		this._oTT.addEventDelegate(oDelegate,this);
		// add 'onAfterRendering' event delegate to this._oTC
		this._oTC.removeEventDelegate(oDelegate);
		this._oTC.addEventDelegate(oDelegate,this);

		this._appendMaskSvg();
		var $tableMaskSvg = this.$().find("#" + this.getId() + "-spm-svg-table");
		if (Device.browser.firefox) {
			$tableMaskSvg.unbind("MozMousePixelScroll.sapUiTableMouseWheel", this._onMouseWheel.bind(this));
			$tableMaskSvg.bind("MozMousePixelScroll.sapUiTableMouseWheel", this._onMouseWheel.bind(this));
		} else {
			$tableMaskSvg.unbind("wheel.sapUiTableMouseWheel", this._onMouseWheel.bind(this));
			$tableMaskSvg.bind("wheel.sapUiTableMouseWheel", this._onMouseWheel.bind(this));
		}
	};

	GanttChartWithTable.prototype._onMouseWheel = function(oEvent) {
		var oOriginalEvent = oEvent.originalEvent;
		var bIsHorizontal = oOriginalEvent.shiftKey;
		var iScrollDelta = 0;
		if (Device.browser.firefox) {
			iScrollDelta = oOriginalEvent.detail;
		} else {
			if (bIsHorizontal) {
				iScrollDelta = oOriginalEvent.deltaX;
			} else {
				iScrollDelta = oOriginalEvent.deltaY;
			}
		}

		if (bIsHorizontal) {
			var oHsb = this._oTT.getDomRef(sap.ui.table.SharedDomRef.HorizontalScrollBar);
			if (oHsb) {
				oHsb.scrollLeft = oHsb.scrollLeft + iScrollDelta;
			}
		}else {
			var oVsb = this._oTT.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar);
			if (oVsb) {
				//this._oTT._bIsScrolledByWheel = true;
				oVsb.scrollTop = oVsb.scrollTop + iScrollDelta;
			}
		}

		oEvent.preventDefault();
		oEvent.stopPropagation();
	}; 

	GanttChartWithTable.prototype._onRowSelectionChange = function (oEvent){
		
		this.fireRowSelectionChange({
			originEvent: oEvent.getParameter("originEvent")
		});
		this._oTT._oSelection.fireSelectionChanged(); //sync selection of oTC and oTT -- when table impl changes, change accordingly
	};

	GanttChartWithTable.prototype._onChartMouseOver = function (oEvent){
		var oParam = oEvent.getParameters();
		this.fireChartMouseOver({
			objectInfo: oParam.objectInfo,
			leadingRowInfo: oParam.leadingRowInfo,
			timestamp: oParam.timestamp,
			svgId: oParam.svgId,
			svgCoordinate: oParam.svgCoordinate, 
			effectingMode: oParam.effectingMode,
			originEvent: oParam.originEvent
		});
	};
	
	GanttChartWithTable.prototype._onShapeSelectionChange = function (oEvent){
		this.fireShapeSelectionChange({
			originEvent: oEvent.getParameter("originEvent")
		});
	};
	GanttChartWithTable.prototype._onRelationshipSelectionChange = function (oEvent){
		this.fireRelationshipSelectionChange({
			originEvent: oEvent.getParameter("originEvent")
		});
	};

	GanttChartWithTable.prototype._onClick = function(oEvent) {
		var oParam = oEvent.getParameters();
		this.fireChartClick({
			objectInfo: oParam.objectInfo,
			leadingRowInfo: oParam.leadingRowInfo,
			timestamp: oParam.timestamp,
			svgId: oParam.svgId,
			svgCoordinate: oParam.svgCoordinate, 
			effectingMode: oParam.effectingMode,
			originEvent: oParam.originEvent
		});
	};

	GanttChartWithTable.prototype._onDoubleClick = function (oEvent){
		var oParam = oEvent.getParameters();
		this.fireChartDoubleClick({
			objectInfo: oParam.objectInfo,
			leadingRowInfo: oParam.leadingRowInfo,
			timestamp: oParam.timestamp,
			svgId: oParam.svgId,
			svgCoordinate: oParam.svgCoordinate, 
			effectingMode: oParam.effectingMode,
			originEvent: oParam.originEvent
		});
	};
	/*
	 * This method will fire the right click event on the chart
	 */		
	GanttChartWithTable.prototype._onRightClick = function (oEvent){
		var oParam = oEvent.getParameters();
		this.fireChartRightClick({
			objectInfo: oParam.objectInfo,
			leadingRowInfo: oParam.leadingRowInfo,
			timestamp: oParam.timestamp,
			svgId: oParam.svgId,
			svgCoordinate: oParam.svgCoordinate, 
			effectingMode: oParam.effectingMode,
			originEvent: oParam.originEvent
		});
	};
 
	GanttChartWithTable.prototype._onChartDragEnter = function (oEvent) {
		this.fireChartDragEnter({
			originEvent: oEvent.getParameter("originEvent")
		});
	};
	
	GanttChartWithTable.prototype._onChartDragLeave = function (oEvent) {
		this.fireChartDragLeave({
			originEvent: oEvent.getParameter("originEvent"),
			draggingSource: oEvent.getParameter("draggingSource")
		});
			
	};
	
	GanttChartWithTable.prototype._onShapeDragEnd = function (oEvent) {
		var oParam = oEvent.getParameters();
		this.fireShapeDragEnd({
			originEvent: oParam.originEvent,
			sourceShapeData: oParam.sourceShapeData,
			targetData: oParam.targetData,
			sourceSvgId: oParam.sourceSvgId,
			targetSvgId: oParam.targetSvgId
		});
	};
	
	GanttChartWithTable.prototype._onChartHSbScroll = function (oEvent) {
		var nScrollLeft = (Core.getConfiguration().getRTL() && sap.ui.Device.browser.name === "ff") ? this._oTC.$(sap.ui.table.SharedDomRef.HorizontalScrollBar).scrollLeftRTL() : this._oTC.$(sap.ui.table.SharedDomRef.HorizontalScrollBar).scrollLeft();
		this.fireHorizontalScroll({
			scrollSteps: nScrollLeft,
			leftOffsetRate: this._oGanttChart.updateLeftOffsetRate(nScrollLeft)
		});
	};
	
	GanttChartWithTable.prototype._onChartVSbScroll = function (oEvent) {
		var $ttvsb = jQuery(this._oTT.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar));
		var $tcvsb = jQuery(this._oTC.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar));
		if (this.sScrollSource === null || this.sScrollSource !== "GanttChartWithTable") {
			this.sScrollSource = "GanttChart";
			$ttvsb.scrollTop($tcvsb.scrollTop());
		} else {
			this.sScrollSource = null;
		}

		this.fireVerticalScroll({
			scrollSteps: this._oTC.getFirstVisibleRow(),
			scrollPosition: jQuery(this._oTC.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar)).scrollTop()
		});
	};

	GanttChartWithTable.prototype._drawSvg = function () {
		this._appendMaskSvg();
		this._updateMaskSvg();
		this._updateTableRowHeights();
		this._drawSelectionPanel();
	};

	GanttChartWithTable.prototype._onZoomInfoUpdated = function (oEvent) {
		this.fireEvent("_zoomInfoUpdated", {zoomInfo: oEvent.getParameter("zoomInfo")});
	};

	GanttChartWithTable.prototype._onShapesUpdated = function (oEvent) {
		this.fireEvent("_shapesUpdated", {aSvg: oEvent.getParameter("aSvg")});
	};

	GanttChartWithTable.prototype._onSelectionPanelVSbScroll = function () {
		var $ttvsb = jQuery(this._oTT.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar));
		var $tcvsb = jQuery(this._oTC.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar));
		if (this.sScrollSource === null || this.sScrollSource !== "GanttChart") {
			this.sScrollSource = "GanttChartWithTable";
			$tcvsb.scrollTop($ttvsb.scrollTop());
		} else {
			this.sScrollSource = null;
		}
		this._applyTransform();
	};

	GanttChartWithTable.prototype._applyTransform = function(){
		this.$().find("#" + this.getId() + "-spm-svg-table")
			.css("transform", "translateY(" + (-this._oTT.$().find(".sapUiTableCCnt").scrollTop()) + "px)");
	};

	GanttChartWithTable.prototype._onSplitterResize = function (oEvent) {
		//this._oGanttChart._draw(true);
		this._oTC.updateRows();
		var oParam = oEvent.getParameters();
		// reset size of chart and selectionpanel explicitely to force chart div resizing
		// fire event
		this.fireSplitterResize(oParam);

	};

	GanttChartWithTable.prototype._onToolbarSourceChange = function (oEvent) {
		var oldHierarchy = this.getHierarchyKey();
		this.setHierarchyKey(oEvent.getParameter("id"));

		this.notifySourceChange();
		this.fireGanttChartSwitchRequested({
			hierarchyKey: oEvent.getParameter("id"),
			oldHierarchyKey: oldHierarchy
		});
	};

	GanttChartWithTable.prototype._onToolbarExpandTreeChange = function(oEvent){
		var sAction = oEvent.getParameter("action");
		if (sAction){
			var aSelectedRows = this._oTT.getSelectedIndices();
			for (var i = aSelectedRows.length - 1; i > -1; i--){
				this._oTT[sAction](aSelectedRows[i]);
				aSelectedRows = this._oTT.getSelectedIndices();
			}
		}
	};
	
	GanttChartWithTable.prototype._onToolbarModeChange = function (oEvent) {
		// update data if mode is bound to model
		var oBindingInfo = this.getBinding("mode");
		if (oBindingInfo) {
			oBindingInfo.setValue(oEvent.getParameter("mode"));
		}
		// trigger mode change
		this.setMode(oEvent.getParameter("mode"));
	};

	GanttChartWithTable.prototype.handleExpandChartChange = function (bExpanded, aChartSchemes, aSelectedIndices) {
		aSelectedIndices = aSelectedIndices ? aSelectedIndices : this._oTT.getSelectedIndices();
		this._oGanttChart.handleExpandChartChange(bExpanded, aChartSchemes, aSelectedIndices);
	};

	GanttChartWithTable.prototype.invertRowExpandStatus = function (aSelectedIndices, aChartSchemes) {
		if (aSelectedIndices && aSelectedIndices.length > 0 && aChartSchemes){
			this._oGanttChart.invertRowExpandStatus(aSelectedIndices, aChartSchemes);
		}
	};

	GanttChartWithTable.prototype._updateTableRowHeights = function () {
		var oTable = this._oTT;

		var aHeights = this._aHeights;
		if (!aHeights) {
			return;
		}
		
		oTable._updateRowHeader(aHeights);
	};
	
	GanttChartWithTable.prototype.setBaseRowHeight = function (nBaseRowHeight) {
		this.setProperty("baseRowHeight", nBaseRowHeight);
		this._oTT.setRowHeight(nBaseRowHeight);
		this._oGanttChart._setInferedBaseRowHeight(nBaseRowHeight);
		return this._oGanttChart.setBaseRowHeight(nBaseRowHeight);
	};

	GanttChartWithTable.prototype.getBaseRowHeight = function () {
		return this._oGanttChart.getBaseRowHeight();
	};

	GanttChartWithTable.prototype._onTTRowUpdate = function(){
		if (this._oGanttChart.isRowExpanded()){
			var $tableDom = this._oTT.$();
			var $tableMask = this.$().find("#" + this.getId() + "-spm-svg-table-ctn");
			$tableMask.height($tableDom.find(".sapUiTableCCnt").height());
			$tableMask.show();

			var $tableMaskSvg = $tableMask.find(".sapGanttSPMaskSvg");
			$tableMaskSvg.height($tableDom.find(".sapUiTableCtrlCnt").height());
			this._drawSvg();
		} else {
			var $tableMask = this.$().find("#" + this.getId() + "-spm-svg-table-ctn");
			$tableMask.hide();
		}
		this._adjustGanttInferredRowHeight();
		this._oTT._updateTableContent();
		this._adjustChartHeaderHeight();
	};

	GanttChartWithTable.prototype._adjustGanttInferredRowHeight = function (){
		var aHeights = this._aHeights;
		var iFirstVisibleRowIndex = this.getFirstVisibleRow();
		var aShapeDatas = this._oGanttChart._getDrawingData([iFirstVisibleRowIndex, iFirstVisibleRowIndex]);
		if (aHeights && aHeights.length > 0 && aShapeDatas && aShapeDatas.length > 0){
			var iBaseRowHeight = aHeights[0] / aShapeDatas[0].visibleRowSpan;
			this._oGanttChart._setInferedBaseRowHeight(iBaseRowHeight);
		}
		
	};

	GanttChartWithTable.prototype._syncGanttTablesDomEvents = function(oEvent) {

		var oSourceTable = oEvent.srcControl,
			oTargetTable = oSourceTable.getId() === this._oTT.getId() ? this._oTC : this._oTT;

		oSourceTable.$().find(".sapUiTableRowHdr, .sapUiTableTr").hover(function(oEvent) {
			var iIndex = jQuery(oEvent.currentTarget).data("sapUiRowindex");

			oTargetTable.$().find(".sapUiTableCtrlFixed > tbody > tr")
							.filter(":eq(" + iIndex + ")").addClass("sapUiTableRowHvr");
			oTargetTable.$().find(".sapUiTableCtrlScroll > tbody > tr")
							.filter(":eq(" + iIndex + ")").addClass("sapUiTableRowHvr");
			oTargetTable.$().find(".sapUiTableRowHdr")
							.filter(":eq(" + iIndex + ")").addClass("sapUiTableRowHvr");

		}, function(oEvent) {
			oTargetTable.$().find(".sapUiTableCtrlFixed > tbody > tr").removeClass("sapUiTableRowHvr");
			oTargetTable.$().find(".sapUiTableCtrlScroll > tbody > tr").removeClass("sapUiTableRowHvr");
			oTargetTable.$().find(".sapUiTableRowHdr").removeClass("sapUiTableRowHvr");
		});
	};

	/*
	 * Implementation of sap.gantt.GanttChartBase._setLargeDataScrolling method.
	 */
	GanttChartWithTable.prototype._setLargeDataScrolling = function(bLargeDataScrolling) {
		if (this._oTT._setLargeDataScrolling) {
			this._oTT._setLargeDataScrolling(!!bLargeDataScrolling);
		}
		if (this._oTC._setLargeDataScrolling) {
			this._oTC._setLargeDataScrolling(!!bLargeDataScrolling);
		}
	};

	/**
	 * Returns the effective toolbar scheme key.
	 * 
	 * @returns {string} - Toolbar scheme key.
	 * @public
	 */
	GanttChartWithTable.prototype.getToolbarSchemeKey = function () {
		return this._oToolbar.getToolbarSchemeKey();
	};

	/**
	 * Scrolls the visible chart area to a certain time. 
	 * 
	 * <p>It can be used to implement the function of 'Jump To First', 'Jump To Last' and 'Jump To Current'.</p>
	 *
	 * @param {Date} oDate The date object to which the user wants the visible area to scroll.
	 * @public
	 */
	GanttChartWithTable.prototype.jumpToPosition = function(oDate) {
		this._oGanttChart.jumpToPosition(oDate);
	};

	/**
	 * Selects in-row shapes and returns a success code.
	 * 
	 * @param {array} [aIds] List of the shapes that you want to select
	 * @param {boolean} [isExclusive] Whether all other selected shapes are deselected
	 * @return {boolean} If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.selectShapes = function(aIds, isExclusive) {
		return this._oGanttChart.selectShapes(aIds, isExclusive);
	};

	/**
	 * Deselects in-row shapes and returns a success code.
	 * 
	 * @param {array} [aIds] List the shapes that you want to deselect
	 * @return {boolean} If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.deselectShapes = function(aIds) {
		return this._oGanttChart.deselectShapes(aIds);
	};

	/**
	 * Selects relationships and returns a success code.
	 * 
	 * @param {array} [aIds] List of the relationships that you want to select
	 * @param {boolean} [isExclusive] Whether all other selected relationships are deselected
	 * @return {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.selectRelationships = function(aIds, isExclusive) {
		return this._oGanttChart.selectRelationships(aIds, isExclusive);
	};

	/**
	 * Deselects relationships and returns a success code.
	 * 
	 * @param {array} [aIds] List of the relationships that you want to deselect
	 * @return {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.deselectRelationships = function(aIds) {
		return this._oGanttChart.deselectRelationships(aIds);
	};

	/**
	 * Selects rows and returns a success code.
	 * 
	 * @param {array} [aIds] List of the rows that you want to select
	 * @param {boolean} [isExclusive] Whether all other selected elements are deselected
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.selectRows = function(aIds, isExclusive) {
		return this._oGanttChart.selectRows(aIds, isExclusive);
	};

	/**
	 * Deselects rows and returns a success code.
	 * 
	 * @param {array} [aIds] List of the rows that you want to deselect
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.deselectRows = function(aIds) {
		return this._oGanttChart.deselectRows(aIds);
	};
	
	/**
	 * Selects rows and all in-row shapes contained in the rows.
	 * 
	 * @param {array} [aIds] Row uids
	 * @param {boolean} [bIsExclusive] Whether all other selected rows and shapes are deselected
	 * @returns {boolean} - If any selection change is applied, returns true.
	 * @public
	 */
	GanttChartWithTable.prototype.selectRowsAndShapes = function(aIds, bIsExclusive) {
		return this._oGanttChart.selectRowsAndShapes(aIds, bIsExclusive);
	};

	/**
	 * Gets all selected rows, shapes, and relationships
	 * @return {object} The returned object contains "rows" for all selected rows, "shapes" for all selected shapes, and "relationships" for all selected relationships
	 * @public
	 */
	GanttChartWithTable.prototype.getAllSelections = function () {
		return this._oGanttChart.getAllSelections();
	};

	/**
	 * Gets selected in-row shapes.
	 * 
	 * @return {array} Returns all selected shapes in the chart
	 * @public
	 */
	GanttChartWithTable.prototype.getSelectedShapes = function() {
		var aSelectedShapes = this._oGanttChart.getSelectedShapes();
		return aSelectedShapes;
	};

	/**
	 * Gets selected rows.
	 * 
	 * @return {array} Returns all selected rows
	 * @public
	 */
	GanttChartWithTable.prototype.getSelectedRows = function() {
		var aSelectedRows = this._oGanttChart.getSelectedRows();
		return aSelectedRows;
	};

	/**
	 * Gets selected relationships.
	 * 
	 * @return {array} Returns all selected relationships in the chart
	 * @public
	 */
	GanttChartWithTable.prototype.getSelectedRelationships = function() {
		var aSelectedRelationships = this._oGanttChart.getSelectedRelationships();
		return aSelectedRelationships;
	};

	GanttChartWithTable.prototype.setDraggingData = function(oDraggingShape) {
		this._oGanttChart.setDraggingData(oDraggingShape);
	};

	/**
	 * Get row object by shape uid
	 * @param {string} [sShapeUid] shape uid
	 * @return {object} row object
	 * @public
	 */
	GanttChartWithTable.prototype.getRowByShapeUid = function (sShapeUid) {
		return this._oGanttChart.getRowByShapeUid(sShapeUid);
	};
	

	GanttChartWithTable.prototype._drawSelectionPanel = function () {
		var aTableSvg = d3.select("#" + this.getId() + "-spm-svg-table");
		var iTableHeaderWidth = this._oTT.$().find(".sapUiTableRowHdrScr").width();

		var aVisibleRowDatas = this._getVisibleRowData();
		if (aVisibleRowDatas !== undefined){
			this._oSelectionPanelDrawer.drawSvg(aTableSvg, aVisibleRowDatas, iTableHeaderWidth, this);
			this.$().find("#" + this.getId() + "-spm-svg-table").css("transform", "translateY(" + (-this._oTT.$().find(".sapUiTableCCnt").scrollTop()) + "px)");
			this._iFirstVisiableRowIndex = this._oTT.getFirstVisibleRow();
			this._bCanApplyTableTransform = true;
		}
	};

	GanttChartWithTable.prototype._getVisibleRowData = function () {
		var iFirstVisibleRow = this._oTT.getFirstVisibleRow();
		//"+1" is to keep consistency with GanttChart, where one extra row would be drawn
		var iVisibleRowCount = this.getVisibleRowCount() + 1;

		var aVisibleRowDatas = this._oGanttChart._getDrawingData([iFirstVisibleRow, iFirstVisibleRow + iVisibleRowCount - 1]);
		var iBaseRowHeight = this._oGanttChart.getBaseRowHeight();
		var iPointY = 0;

		for (var i = 0; i < aVisibleRowDatas.length; i++){
			var oShapeData = aVisibleRowDatas[i];
			oShapeData.rowHeight = oShapeData.rowSpan * iBaseRowHeight;
			oShapeData.y = iPointY;
			iPointY += oShapeData.rowHeight;
		}

		return aVisibleRowDatas;
	};

	GanttChartWithTable.prototype._appendMaskSvg = function(){
		var $tableMask = this.$().find("#" + this.getId() + "-spm-svg-table-ctn");
		var $tableDom = this._oTT.$();

		if ($tableMask.length == 0) {

			$tableMask = $("<div id='" + this.getId() + "-spm-svg-table-ctn' class='sapGanttChartSPMSvgCtn' >" + 
						"<svg id='" + this.getId() + "-spm-svg-table' class='sapGanttSPMaskSvg'>" +
						"</svg>" +
					"</div>");

			$tableDom.parent().append($tableMask);
		}
	};

	GanttChartWithTable.prototype._updateMaskSvg = function (){
		var $tableMask = this.$().find("#" + this.getId() + "-spm-svg-table-ctn");
		var $tableDom = this._oTT.$();

		$tableMask.height($tableDom.find(".sapUiTableCCnt").height());
		$tableMask.width($(document).width());
		
		$tableMask.css("top", this._oGanttChart.$().find(".sapGanttChartHeader").height() + 1);
		$tableMask.css("min-width", $tableDom.find("table").css("min-width"));
		
		var $tableMaskSvg = $tableMask.find(".sapGanttSPMaskSvg");
		$tableMaskSvg.width($tableMask.width());
		$tableMaskSvg.height($tableDom.find(".sapUiTableCtrlCnt").height());
	};

	GanttChartWithTable.prototype.getAxisOrdinal = function () {
		return this._oGanttChart.getAxisOrdinal();
	};

	GanttChartWithTable.prototype.getAxisTime = function () {
		return this._oGanttChart.getAxisTime();
	};

	GanttChartWithTable.prototype.getZoomInfo = function () {
		return this._oGanttChart.getZoomInfo();
	};

	GanttChartWithTable.prototype._expandDefaultLevel = function() {
		var aExpandedLevels;
		var sHierarchyKey = this.getHierarchyKey();
		//Check because default expansion should be applied only once
		if (this._oDefaultExpansionStatus) {
			if (this._oDefaultExpansionStatus[sHierarchyKey] === true) {
				return;
			}
		}

		if (this._oHierarchyConfigMap[sHierarchyKey] && this._oHierarchyConfigMap[sHierarchyKey].getExpandedLevels()) {
			aExpandedLevels = this._oHierarchyConfigMap[this.getHierarchyKey()].getExpandedLevels();
			var oBinding = this._oTT.getBinding("rows");
			if (!oBinding) {
				return;
			}
			var oTreeTableData = oBinding.getModel().getObject(oBinding.getPath());
			var iCurrentLevel = 0; //Traversal level
			var iRowCursor = 0;
			var aCollapseRowIndex = [];
			var aNodeNames = this._oTT.getBindingInfo("rows").parameters.arrayNames;
			var hasChildren = function(oNode) {
				for (var i = 0; i < aNodeNames.length; i++){
					if (oNode[aNodeNames[i]]) {
						return true;
					}
				}
				return false;
			};
			if (aExpandedLevels.length <= 0) {
				//No configuration, mark expand as applied and exit
				this._oDefaultExpansionStatus[sHierarchyKey] = true;
				return;
			} else {
				//Attach change event to binding
				//Expand the tree table to the level of length of configured levels
				//In change event handler. detach the event first, then find and collapse the nodes which do not match the config
				var fnCalculateCollapseRowIndex = function(index, oNode) {
					if (iCurrentLevel > aExpandedLevels.length) {
						if (iCurrentLevel === (aExpandedLevels.length + 1)) {
							iRowCursor++;
						}
						return;
					}
					if (hasChildren(oNode) === true) {
						if (!($.inArray(oNode.type, aExpandedLevels[iCurrentLevel]) > -1)) {
							if (aCollapseRowIndex) {
								aCollapseRowIndex.push(iRowCursor);
							} else {
								aCollapseRowIndex = [iRowCursor];
							}
						}
						iRowCursor++;
						if (iCurrentLevel <= aExpandedLevels.length) {
							iCurrentLevel++;
							for (var j = 0; j < aNodeNames.length; j++){
								if (oNode[aNodeNames[j]]) {
									jQuery.each(oNode[aNodeNames[j]], fnCalculateCollapseRowIndex);
								}
							}
							iCurrentLevel--;
						}
					} else {
						iRowCursor++;
					}
				};
				var fnCollapse = function() {
					oBinding.detachChange(fnCollapse, this);
					for (var i = 0; i < aNodeNames.length; i++){
						if (oTreeTableData[aNodeNames[i]]) {
							jQuery.each(oTreeTableData[aNodeNames[i]], fnCalculateCollapseRowIndex);
						}
					}
					oBinding.getContexts(this._oTT.getFirstVisibleRow(), 0);
					//must use inverted order because collapse will reset the index
					for (var iIndex = aCollapseRowIndex.length - 1; iIndex >= 0; iIndex--) {
						if (oBinding.getNodeByIndex(aCollapseRowIndex[iIndex])){
							this._oTT.collapse(aCollapseRowIndex[iIndex]);
						}
					}
				};
				oBinding.attachChange(fnCollapse, this);
				this._oTT.expandToLevel(aExpandedLevels.length);
			}
		}
		//update default expansion status of hierarchy to avoid it is applied again
		this._oDefaultExpansionStatus[sHierarchyKey] = true;
	};

	/**
	 * Expands the selection panel to the given level
	 * 
	 * @see sap.ui.table.TreeTable.expandToLevel
	 *
	 * @param {int} iLevel
	 *         Level of the selection panel to expand
	 * @return {sap.gantt.GanttChartWithTable} A reference to the GanttChartWithTable control, which can be used for chaining
	 * @public
	 */
	GanttChartWithTable.prototype.expandToLevel = function (iLevel) {
		this._oTT.expandToLevel(iLevel);
		return this;
	};

	/**
	 * Expands the row for the given row index in the selection panel
	 * 
	 * @see sap.ui.table.Table.expand
	 *
	 * @param {int} iRowIndex
	 *         Index of the row to expand
	 * @return {sap.gantt.GanttChartWithTable} A reference to the GanttChartWithTable control, which can be used for chaining
	 * @public
	 */
	GanttChartWithTable.prototype.expand = function(iRowIndex) {
		this._oTT.expand(iRowIndex);
		return this;
	};
	
	/**
	 * Collapses the row for the given row index in the selection panel
	 *
	 * @see sap.ui.table.Table.collapse
	 * 
	 * @param {int} iRowIndex
	 *         index of the row to expand
	 * @return {sap.gantt.GanttChartWithTable} A reference to the GanttChartWithTable control, which can be used for chaining
	 * @public
	 */
	GanttChartWithTable.prototype.collapse = function(iRowIndex) {
		this._oTT.collapse(iRowIndex);
		return this;
	};
	
	/**
	 * Selects a row in the selection panel.
	 * 
	 * @see sap.ui.table.Table.setSelectedIndex
	 * 
	 * @param {int} iRowIndex The row index to be selected (if any exists)
	 * @return {sap.gantt.GanttChartWithTable} A reference to the GanttChartWithTable control, which can be used for chaining
	 * @public
	 */
	GanttChartWithTable.prototype.setSelectedIndex = function(iRowIndex) {
		this._oTT.setSelectedIndex(iRowIndex);
		return this;
	};
	
	/**
	 * Retrieves the lead selection index. The lead selection index is, among other things, used to determine the
	 * start and end of a selection range, when using Shift-Click to select multiple entries. 
	 * 
	 * @see sap.ui.table.Table.getSelectedIndex
	 * 
	 * @return {int[]} An array containing all selected indexes (ascending ordered integers)
	 * @public
	 */
	GanttChartWithTable.prototype.getSelectedIndex = function() {
		return this._oTT.getSelectedIndex();
	};
	
	/**
	 * Gets the first visible row of the selection panel. 
	 * 
	 * @see sap.ui.table.Table.getFirstVisibleRow
	 * 
	 * @return {int} the first visible row index
	 * @public
	 */
	GanttChartWithTable.prototype.getFirstVisibleRow = function() {
		return this._oTT.getFirstVisibleRow();
	};

	/**
	 * Sets the first visible row in the selection panel.
	 * 
	 * @see sap.ui.table.Table.setFirstVisibleRow
	 * 
	 * @param {int} iRowIndex The row index to be set as the first visible row
	 * @return {sap.gantt.GanttChartWithTable} A reference to the GanttChartWithTable control, which can be used for chaining
	 * @public
	 */
	GanttChartWithTable.prototype.setFirstVisibleRow = function(iRowIndex) {
		this._oTT.setFirstVisibleRow(iRowIndex);
		return this;
	};
	
	/**
	 * Gets the number of visible rows in the selection panel. 
	 * 
	 * @see sap.ui.table.Table.getVisibleRowCount
	 * 
	 * @return {int} The first visible row index
	 * @public
	 */
	GanttChartWithTable.prototype.getVisibleRowCount = function() {
		return this._oTT.getVisibleRowCount();
	};
	
	GanttChartWithTable.prototype.getRows = function() {
		return this._oTT.getRows();
	};
	
	GanttChartWithTable.prototype.exit = function () {
		this._detachToolbarEvents();
		this._oSplitter.destroy();
	};

	GanttChartWithTable.prototype.notifySourceChange = function(){
		//when switch hierarchy, set the first row as the first visible row
		this._oTT.setFirstVisibleRow(0);
		this._oGanttChart.notifySourceChange();
	};

	/**
	 * Triggers automatic resizing of a column to the widest content.(experimental!)
	 * 
	 * @see sap.ui.table.Table.autoResizeColumn
	 * 
	 * @param {int} iColId column id
	 * @public
	 */
	GanttChartWithTable.prototype.autoResizeColumn = function(iColId) {
		if (iColId >= 0 && jQuery.isNumeric(iColId)) {
			this._oTT.autoResizeColumn(iColId);
		} else {
			for (var i = this._oTT.getColumns().length; i >= 0; i--) {
				this._oTT.autoResizeColumn(i);
			}
		}
	};
	/**
	 * Keep code here although it is not used. If autoResizeColumn enhanced by UI5, we can use it.
	 * Currently autoResizeColumn will cause table flashing several times. Because UI5 only support the autoResizeColumn
	 * one column by one column, no API to resize all columns one time.
	 * @private
	 */
	GanttChartWithTable.prototype._autoResizeColumn = function() {
		if (this._oHierarchyConfigMap[this.getHierarchyKey()].getAutoResizeColumn()) {
			this.autoResizeColumn();
		}
	};

	["addCustomToolbarItem", "insertCustomToolbarItem", "removeCustomToolbarItem", "indexOfCustomToolbarItem", "removeAllCustomToolbarItems", "destroyCustomToolbarItems", "getCustomToolbarItems"]
	.forEach(function (sMethod) {
		GanttChartWithTable.prototype[sMethod] = function () {
			return this._oToolbar[sMethod].apply(this._oToolbar, arguments);
		};
	});
	return GanttChartWithTable;
}, true);
