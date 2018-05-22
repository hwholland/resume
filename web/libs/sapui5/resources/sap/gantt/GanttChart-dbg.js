/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global", "sap/ui/Device", "sap/gantt/GanttChartBase", "sap/ui/core/Core", "sap/ui/table/TreeTable", "sap/ui/table/Row",
	"sap/gantt/misc/Utility", "sap/ui/core/theming/Parameters", "sap/gantt/shape/SelectedShape", "sap/gantt/shape/ext/rls/SelectedRelationship",
	"sap/gantt/drawer/ShapeInRow", "sap/gantt/drawer/ShapeCrossRow", "sap/gantt/drawer/CursorLine", "sap/gantt/drawer/NowLine", "sap/gantt/drawer/VerticalLine",
	"sap/gantt/drawer/CalendarPattern","sap/gantt/drawer/ExpandedBackground",
	"sap/gantt/misc/AxisTime", "sap/gantt/misc/AxisOrdinal", "sap/gantt/misc/Format", "sap/gantt/shape/Group",
	// 3rd party lib
	"sap/ui/thirdparty/d3"
], function (jQuery, Device, GanttChartBase, Core, TreeTable, Row,
		Utility, Parameters, SelectedShape, SelectedRelationship,
		ShapeInRowDrawer, ShapeCrossRowDrawer, CursorLineDrawer, NowLineDrawer, VerticalLineDrawer,
		CalendarPattern, ExpandedBackground,
		AxisTime, AxisOrdinal, Format, Group) {
	"use strict";
	
	/**
	 * Creates and initializes a new Gantt Chart.
	 * 
	 * @param {string} [sId] ID for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * 
	 * @class 
	 * Gantt Chart control.
	 * 
	 * <p>The Gantt chart has a horizontal axis at the top that represents time and a vertical axis that represents rows.
	 * </p>
	 * 
	 * @extends sap.gantt.GanttChartBase
	 * 
	 * @author SAP SE
	 * @version 1.38.22
	 * 
	 * @constructor
	 * @public
	 * @alias sap.gantt.GanttChart
	 */
	var GanttChart = GanttChartBase.extend("sap.gantt.GanttChart", /** @lends sap.gantt.GanttChart.prototype */ {
		metadata: {
			aggregations: {
				_treeTable: {type: "sap.ui.table.TreeTable", multiple: false, visibility: "hidden"} // to ensure model pass down
			}
		}
	});

	GanttChart.prototype.init = function () {
		GanttChartBase.prototype.init.apply(this, arguments);
		jQuery.sap.measure.start("GanttChart init","GanttPerf:GanttChart init function");
		// create tree table
		this._oTT = new TreeTable(this.getId() + "-table", {
			visibleRowCountMode: "Auto",
			minAutoRowCount: 1,
			selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly,
			//selectionMode: sap.ui.table.SelectionMode.Multi,
			columnHeaderVisible: false
		});

		this._oRowStatusMap = {};
		this._oTT._bVariableRowHeightEnabled = true;

		//this will enable the legacy multi selection mode in 1.38.8
		this._oTT._enableLegacyMultiSelection = true;
		this._oTT.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);

		/***
		 * Overwrite _collectRowHeights to dynamically update row heights based on
		 * The execution context is tree table itself
		 */
		var that = this;
		this._oTT._collectRowHeights = function() {
			that._aHeights = TreeTable.prototype._collectRowHeights.apply(this);
			if (that._aHeights[0] !== undefined && that._aHeights[0] !== 0){
				that._iInferedBaseRowHeightOnTT = that._aHeights[0];
				if (!that._bTableReady){
					that._initialSvgDrawing();
				}
			}
			var iBaseRowHeight = that.getBaseRowHeight();
			var iFirstVisibleRowIndex = this.getFirstVisibleRow();
			var iRowCount = that._aHeights.length;
			var iMainRowHeight = iBaseRowHeight;
			var aShapeData = that._getDrawingData([iFirstVisibleRowIndex,iFirstVisibleRowIndex + iRowCount - 1]);
			if (aShapeData && aShapeData.length > 0){
				iMainRowHeight = aShapeData[0].rowSpan * iBaseRowHeight;
			}
			for (var i = 0; i < iRowCount; i++) {
				var oContext = this.getContextByIndex(iFirstVisibleRowIndex + i);
				if (oContext){
					var oContextObject = oContext.getObject();
					var sUid = oContextObject ? oContextObject.uid : undefined;
					if (sUid && that._oRowStatusMap[sUid]){
						that._aHeights[i] = that._oRowStatusMap[sUid].visibleRowSpan * iBaseRowHeight;
					} else {
						that._aHeights[i] = iMainRowHeight;
					}
				} else {
					that._aHeights[i] = iBaseRowHeight;
				}
			}

			return that._aHeights;
		};

		this._oTT.onvscroll = function (oEvent) {
			sap.ui.table.TreeTable.prototype.onvscroll.apply(this, arguments);
			that._onVSbScroll();
		};

		this._oColumn = new sap.ui.table.Column();
		this._oTT.addColumn(this._oColumn);
		this.setAggregation("_treeTable", this._oTT);

		this._oTT.attachEvent("_rowsUpdated", this._onTTRowUpdate.bind(this));
		this._oTT.attachRowSelectionChange(this._onRowSelectionChange, this);

		this._oTT.addEventDelegate({
			onAfterRendering: this._onTTHScrollAfterRendering
		}, this);
		
		this._oTT.addEventDelegate({
			onAfterRendering: this._initialSvgDrawing
		}, this);

		// create drawers
		this._oShapeInRowDrawer = new ShapeInRowDrawer();
		this._oShapeCrossRowDrawer = new ShapeCrossRowDrawer();
		this._oCursorLineDrawer = new CursorLineDrawer();
		this._oCalendarPatternDrawer = new CalendarPattern();
		this._oExpandedBackgroundDrawer = new ExpandedBackground();
		
		// internal private members
		this._oAxisTime = undefined;
		this._oAxisOrdinal = undefined;
		this._aFilteredRowData = undefined; // data to be drawn on svg using registed shape instances
		this._aShapeInstance = undefined;	// array of shape instances
		this._oShapeInstance = undefined;	// map of top shape instances
		this._oZoom = { // zoom info
			base: {}
		};
		this._oDataNamePerType = {};
		this._fLeftOffsetRate = 0.0;
		this._oStatusSet = null;
		this._nLowerRange = 0;
		this._nUpperRange = 0;
		
		this._aSelectedRelationships = undefined;
		this._oSelectedShapes = {};
		this._aSelectedShapeUids = undefined;
		// Sometimes when selectRowsAndShapes or selectShapes are called,
		// the shape data are not ready yet.
		// For this case, the IDs of shape data to be selected will be stored in this array,
		// and then will be cleared once the shape data are ready and the shapes are selected.
		this._aShapeIdsToBeSelected = [];
		
		//add for mouse events to support drag shape over views
		this._bMouseDown = false;
		this._bDragging = false;
		/**
		 *Reason to add a flag "_bDragStart": to distinguish the 'mouse click' and the 'mouse move' during a drag&drop case. It helps to distinguish a
		 *drag&drop and a simple mouse click,etc
		 */
		this._bDragStart = false;
		this._oDraggingData = undefined;
		
		this._lastHoverRowIndex = undefined;
		
		// defualt maps
		this._oChartSchemesConfigMap = {};
		this._oChartSchemesConfigMap[sap.gantt.config.DEFAULT_CHART_SCHEME_KEY] = sap.gantt.config.DEFAULT_CHART_SCHEME;
		this._oObjectTypesConfigMap = {};
		this._oObjectTypesConfigMap[sap.gantt.config.DEFAULT_OBJECT_TYPE_KEY] = sap.gantt.config.DEFAULT_OBJECT_TYPE;
		
		this._fExtendFactor = 0.382;
		
		// create default this._oAxisTime
		this._calZoomFromTimeAxisConfig(sap.gantt.config.DEFAULT_TIME_AXIS);
		this._createAxisTime(sap.gantt.config.DEFAULT_TIME_AXIS);
		
		// performance tuning
		this._mTimeouts = {};

		this._bCanApplyTableTransform = true;
		this._iFirstVisiableRowIndex = undefined;
		jQuery.sap.measure.end("GanttChart init");
	};
	
	GanttChart.prototype.setTimeAxis = function (oTimeAxis) {
		this.setProperty("timeAxis", oTimeAxis, true); // no need to trigger rerender
		this._createAxisTime(oTimeAxis);

		var oLastZoom = this._oZoom;
		this._oZoom = {base: {}};
		this._calZoomFromTimeAxisConfig(oTimeAxis);
		var oZoomInfo = this.getZoomInfo();
		if (oZoomInfo && oZoomInfo.determinedByChartWidth) {
			if (!oLastZoom.determinedByChartWidth
				|| !Utility.floatEqual(oLastZoom.determinedByConfig.fRate, oZoomInfo.determinedByConfig.fRate)
				|| !Utility.floatEqual(oLastZoom.determinedByConfig.fMaxRate, oZoomInfo.determinedByConfig.fMaxRate)
				|| !Utility.floatEqual(oLastZoom.determinedByChartWidth.fMinRate, oZoomInfo.determinedByChartWidth.fMinRate)) {
				this.fireEvent("_zoomInfoUpdated", {zoomInfo: oZoomInfo});
			}

			if (!oLastZoom.determinedByConfig.fRate
				|| !Utility.floatEqual(oLastZoom.determinedByConfig.fRate, oZoomInfo.determinedByConfig.fRate)) {
				this.setTimeZoomRate(oZoomInfo.determinedByConfig.fRate);
			}
		}

		this._oStatusSet = null;
		
		this._draw(true); // only _draw is triggered
		
		return this;
	};
	
	GanttChart.prototype.setLocale = function (oLocale) {
		this.setProperty("locale", oLocale, true); // no need to trigger rerender
		this._oAxisTime.setLocale(oLocale);
		this._updateLocaleInShapeInstances();
		this._draw(true);
		
		return this;
	};
	
	GanttChart.prototype.setChartSchemes = function (aChartSchemes) {
		this.setProperty("chartSchemes", aChartSchemes, true); // no need to trigger rerender
		// build a map for easy look up
		this._oChartSchemesConfigMap = {};
		if (aChartSchemes) {
			for (var i = 0; i < aChartSchemes.length; i++) {
				this._oChartSchemesConfigMap[aChartSchemes[i].getKey()] = aChartSchemes[i];
			}
		}
		
		this._draw(true);
		
		return this;
	};

	GanttChart.prototype._updateLocaleInShapeInstances = function () {
		if (this._aShapeInstance) {
			var oLocale = this.getLocale();
			jQuery.each(this._aShapeInstance, function (iKey, oValue) {
				oValue.mLocaleConfig = oLocale;
			});
		}
	};

	GanttChart.prototype.setObjectTypes = function (aObjectTypes) {
		this.setProperty("objectTypes", aObjectTypes, true); // no need to trigger rerender
		// build a map for easy look up
		this._oObjectTypesConfigMap = {};
		if (aObjectTypes) {
			for (var i = 0; i < aObjectTypes.length; i++){
				this._oObjectTypesConfigMap[aObjectTypes[i].getKey()] = aObjectTypes[i];
			}
		}
		
		this._draw(true);
		
		return this;
	};
	
	GanttChart.prototype.setSelectionMode = function (sSelectionMode) {
		this.setProperty("selectionMode", sSelectionMode, true);
		if (this._oTT) {
			if (sSelectionMode == sap.gantt.SelectionMode.MultiWithKeyboard) {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
			}else if (sSelectionMode == sap.gantt.SelectionMode.Multiple){
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
			}else if (sSelectionMode == sap.gantt.SelectionMode.Single) {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.Single);
			}else {
				this._oTT.setSelectionMode(sap.ui.table.SelectionMode.None);
			}
		}
		return this;
	};

	GanttChart.prototype._calZoomFromTimeAxisConfig = function (oTimeAxis) {
		if (!oTimeAxis) {
			return;
		}
		// init an object on this._oZoom
		this._oZoom.base.sGranularity = oTimeAxis.getGranularity();
		var oGranularity = oTimeAxis.getZoomStrategy()[this._oZoom.base.sGranularity];
		this._oZoom.determinedByConfig = {
			fRate: oTimeAxis.getRate()
		};
		// get granularity objects
		var oFinestGranularity = oTimeAxis.getZoomStrategy()[oTimeAxis.getFinestGranularity()];
		var oCoarsestGranularity = oTimeAxis.getZoomStrategy()[oTimeAxis.getCoarsestGranularity()];
		var oStart = d3.time.format("%Y%m%d%H%M%S").parse("20000101000000");
		// calculate base rate scale
		var oBaseDate = jQuery.sap.getObject(oGranularity.innerInterval.unit)
			.offset(oStart, oGranularity.innerInterval.span);
		this._oZoom.base.fScale = this._calZoomScale(oStart, oBaseDate, oGranularity.innerInterval.range);
		// calculate max rate scale
		var oMaxDate = jQuery.sap.getObject(oFinestGranularity.innerInterval.unit)
			.offset(oStart, oFinestGranularity.innerInterval.span);
		var fMaxScale = this._calZoomScale(oStart, oMaxDate, oFinestGranularity.innerInterval.range * 4);
		// calculate min rate scale
		var oMinDate = jQuery.sap.getObject(oCoarsestGranularity.innerInterval.unit)
			.offset(oStart, oCoarsestGranularity.innerInterval.span);
		var fMinScale = this._calZoomScale(oStart, oMinDate, oCoarsestGranularity.innerInterval.range);
		// calculate zoom rates
		this._oZoom.determinedByConfig.fMaxRate = this._oZoom.base.fScale / fMaxScale;
		this._oZoom.determinedByConfig.fMinRate = this._oZoom.base.fScale / fMinScale;
	};

	GanttChart.prototype._calZoomScale = function (oStartDate, oEndDate, iLength) {
		return (oEndDate.valueOf() - oStartDate.valueOf()) / iLength;
	};

	GanttChart.prototype._createAxisTime = function (oConfigTimeAxis) {
		var aStrategy = oConfigTimeAxis.getZoomStrategy();
		var oHorizonStartTime = d3.time.format("%Y%m%d%H%M%S").parse(
			oConfigTimeAxis.getPlanHorizon().getStartTime());
		var oHorizonEndTime = d3.time.format("%Y%m%d%H%M%S").parse(
			oConfigTimeAxis.getPlanHorizon().getEndTime());
		var nHorizonTimeRange = oHorizonEndTime.valueOf() - oHorizonStartTime.valueOf();

		var oGranularity = aStrategy[oConfigTimeAxis.getGranularity()];
		var nUnitTimeRange = jQuery.sap.getObject(oGranularity.innerInterval.unit)
				.offset(oHorizonStartTime, oGranularity.innerInterval.span).valueOf() - oHorizonStartTime.valueOf();

		this._oAxisTime = new AxisTime(
			[oHorizonStartTime, oHorizonEndTime],
			[0, Math.ceil(nHorizonTimeRange * oGranularity.innerInterval.range / nUnitTimeRange)],
			oConfigTimeAxis.getRate(), null, null,
			this.getLocale(), oConfigTimeAxis.getZoomStrategy());
		this._oZoom.determinedByConfig.fRate = oConfigTimeAxis.getRate();
		this._nLowerRange = this._oAxisTime.getViewRange()[0];
		this._nUpperRange = Math.ceil(this._oAxisTime.getViewRange()[1]);
	};

	GanttChart.prototype.setShapes = function (aShapes) {
		this.setProperty("shapes", aShapes, true); // no need to trigger rerender
		if (aShapes && aShapes.length > 0) {
			this._oShapesConfigMap = {};
			for (var i = 0; i < aShapes.length; i++) {
				this._oShapesConfigMap[aShapes[i].getKey()] = aShapes[i];
			}
			this._parseAndSortShape(this._oShapesConfigMap);
			
			this._draw(true);
		}
		return this;
	};

	GanttChart.prototype._parseAndSortShape = function (oShapeConfig, sTopShapeId) {
		var aRetVal = [];
		// parse shape instances
		var sShapeId, oShapeInst, oSelectedShapeInst, aAggregation, aPath, sSelectedShapeClassName;
		for (var i in oShapeConfig) {
			sShapeId = sTopShapeId ? sTopShapeId : i;
			oShapeInst = {};
			if (oShapeConfig[i].getShapeClassName()) {
				// create shape instance
					oShapeInst = this._instantiateCustomerClass(oShapeConfig[i].getShapeClassName(), i, oShapeConfig[i], sShapeId);
				var category = oShapeInst.getCategory(null, this._oAxisTime, this._oAxisOrdinal);
				// create selected shape instance for top shape only
				if (!sTopShapeId){
					sSelectedShapeClassName = oShapeConfig[i].getSelectedClassName();
					if (!sSelectedShapeClassName) {
						if (category == sap.gantt.shape.ShapeCategory.Relationship) {
							sSelectedShapeClassName = "sap.gantt.shape.ext.rls.SelectedRelationship";
							oSelectedShapeInst = new SelectedRelationship();
						}else {
							sSelectedShapeClassName = "sap.gantt.shape.SelectedShape";
						}
					}
					oSelectedShapeInst = this._instantiateCustomerClass(
							sSelectedShapeClassName, "selected" + i, oShapeConfig[i], sShapeId, true);
					oShapeInst.setAggregation("selectedShape", oSelectedShapeInst);
				}
				// create aggregations
				if (oShapeConfig[i].getGroupAggregation() && oShapeConfig[i].getGroupAggregation() instanceof Array) {
					// create aggregation classes for group
					aAggregation = this._parseAndSortShape(oShapeConfig[i].getGroupAggregation(), sShapeId);
					for (var k = 0; k < aAggregation.length; k++) {
						oShapeInst.addShape(aAggregation[k]);
					}
				} else if (oShapeConfig[i].getClippathAggregation() && oShapeConfig[i].getClippathAggregation() instanceof Array) {
					// create aggregation classes for clip-path
					aPath = this._parseAndSortShape(oShapeConfig[i].getClippathAggregation(), sShapeId);
					for (var j = 0; j < aPath.length; j++) {
						oShapeInst.addPath(aPath[j]);
					}
				}
			}
			aRetVal.push(oShapeInst);
		}

		// sort top shape instances and create map by shape id
		if (sTopShapeId){
			return aRetVal;
		} else {
			aRetVal.sort(function (oShape1, oShape2) {
				var level1 = jQuery.isNumeric(oShape1.mShapeConfig.getLevel()) ?
						oShape1.mShapeConfig.getLevel() : 99;
				var level2 = jQuery.isNumeric(oShape2.mShapeConfig.getLevel()) ?
						oShape2.mShapeConfig.getLevel() : 99;
				return level2 - level1;
			});
			this._aShapeInstance = aRetVal;

			var oShapeMap = {};
			jQuery.each(this._aShapeInstance, function (iKey, oValue) {
				oShapeMap[oValue.mShapeConfig.getKey()] = oValue;
			});
			this._oShapeInstance = oShapeMap;
		}
	};

	GanttChart.prototype._instantiateCustomerClass = function (sCustomerClassName, sShapeId, oShapeConfig, sTopShapeId, bSelectedShape) {
		var CustomerClass = jQuery.sap.getObject(sCustomerClassName);
		if (!CustomerClass) {
			jQuery.sap.require(sCustomerClassName);
			CustomerClass = jQuery.sap.getObject(sCustomerClassName);
		}
		
		var oCustomerClassInstance = new CustomerClass();
		var sTShapeId = sTopShapeId;
		if (sTShapeId === undefined) {
			sTShapeId = sShapeId;
		}
		this._storeCustomerClassId(sShapeId, oCustomerClassInstance.getId(), sTopShapeId, bSelectedShape);
		
		oCustomerClassInstance.mLocaleConfig = this.getLocale();
		oCustomerClassInstance.mShapeConfig = oShapeConfig;
		oCustomerClassInstance.mChartInstance = this;

		return oCustomerClassInstance;
	};
	
	/*
	 * {
	 * 		"activity": "__group0", //sId is the Id of shape class instance and it is randomly generated by UI5 framework
	 * 		"header": "__group1",
	 * 		...
	 * }
	 */
	GanttChart.prototype._storeCustomerClassId = function (sShapeId, sId, sTopShapeId, bSelectedShape) {
		if (!this._customerClassIds){
			this._customerClassIds = {};
		}
		if (this._oShapesConfigMap[sShapeId]){
			this._customerClassIds[sShapeId] = {
						"classId": sId,
						"topShapeId": sTopShapeId
					};
		}else {
			//non-topShape, when no shapeId in the shapeConfig.groupAggregation
			var sShape = sTopShapeId + "_" + sShapeId;
			this._customerClassIds[sShape] = {
					"classId": sId,
					"topShapeId": bSelectedShape ? undefined : sTopShapeId //no topShapeId for selectedShape
			};
		}
	};
	
	GanttChart.prototype._getIdByShapeId = function (sShapeId) {
		if (this._customerClassIds && this._customerClassIds[sShapeId]){
			return this._customerClassIds[sShapeId].classId;
		}
		return null;
	};
	
	GanttChart.prototype._getShapeIdById = function (sClassId) {
		if (this._customerClassIds){
			for (var sShapeId in this._customerClassIds) {
				var obj = this._customerClassIds[sShapeId];
				if (obj.classId === sClassId) {
					return {"shapeId": sShapeId, "topShapeId": obj.topShapeId};
				}
			}
		}
		return null;
	};

	GanttChart.prototype._genShapeConfig = function (sShapeId, oProp) {
		var obj = {}, oConfig;
		if (sShapeId !== null && sShapeId !== undefined) {
			obj.shapeId = sShapeId;
		}
		if (oProp.data) {
			obj.data = oProp.data;
		}
		if (oProp.level) {
			obj.level = oProp.level;
		}
		if (oProp.draw){
			oConfig = oProp.draw;
		} else {
			oConfig = oProp;
		}
		for (var item in oConfig) {
			if (item !== "class") {
				obj[item] = oConfig[item];
			}
		}
		return obj;
	};

	GanttChart.prototype.getZoomInfo = function () {
		var oTimeAxis = this.getTimeAxis();
		var oPlanHorizon = oTimeAxis.getPlanHorizon();
		var oInitHorizon = oTimeAxis.getInitHorizon();
		var $svgCtn = jQuery("#" + this.getId() + "-svg-ctn");
		if (!$svgCtn) {
			return null;
		}
		var nClientWidth = $svgCtn.width() - ((Core.getConfiguration().getRTL()) ? 0 : this._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar).width());
		if (!nClientWidth || nClientWidth <= 0) {
			return null;
		}
		this._oZoom.determinedByChartWidth = {};
		this._oZoom.determinedByChartWidth.fMinRate = this._oZoom.determinedByConfig.fMinRate;
		// calculate min zoom rate by time horizon against svg container width
		if (oPlanHorizon) {
			var fMinScale = this._calZoomScale(
				Format.abapTimestampToDate(oPlanHorizon.getStartTime()),
				Format.abapTimestampToDate(oPlanHorizon.getEndTime()),
				nClientWidth);
			this._oZoom.determinedByChartWidth.fMinRate =  this._oZoom.base.fScale / fMinScale;
			var fMinRate = (this._oZoom.determinedByChartWidth.fMinRate >
				this._oZoom.determinedByConfig.fMinRate) ? this._oZoom.determinedByChartWidth.fMinRate : this._oZoom.determinedByConfig.fMinRate;
			this._oZoom.determinedByConfig.fRate = fMinRate > this._oZoom.determinedByConfig.fRate ? fMinRate : this._oZoom.determinedByConfig.fRate;
		}
		// calculate suitable zoom rate by init horizon against svg container width
		if (oInitHorizon && oInitHorizon.getStartTime() && oInitHorizon.getEndTime()) {
			var fSuitableScale = this._calZoomScale(
				Format.abapTimestampToDate(oInitHorizon.getStartTime()),
				Format.abapTimestampToDate(oInitHorizon.getEndTime()),
				nClientWidth);
			this._oZoom.determinedByChartWidth.fSuitableRate = this._oZoom.base.fScale / fSuitableScale;
			this._oZoom.determinedByChartWidth.fSuitableRate = this._oZoom.determinedByChartWidth.fMinRate > this._oZoom.determinedByChartWidth.fSuitableRate
																? this._oZoom.determinedByChartWidth.fMinRate : this._oZoom.determinedByChartWidth.fSuitableRate;
		}
		this._oZoom.iChartWidth = nClientWidth;
		return this._oZoom;
	};

	GanttChart.prototype.setTimeZoomRate = function (fTimeZoomRate) {
		var fMinRate = (this._oZoom.determinedByChartWidth && (this._oZoom.determinedByChartWidth.fMinRate >
			this._oZoom.determinedByConfig.fMinRate)) ? this._oZoom.determinedByChartWidth.fMinRate : this._oZoom.determinedByConfig.fMinRate;
		this._oZoom.determinedByConfig.fRate = fMinRate > fTimeZoomRate ? fMinRate : fTimeZoomRate;
		this.setProperty("timeZoomRate", this._oZoom.determinedByConfig.fRate, true); // no need to trigger rerender
		this._oAxisTime.setZoomRate(this._oZoom.determinedByConfig.fRate);
		this._oAxisTime.setViewOffset(0);
		this._oStatusSet = null;
		this._nLowerRange = this._oAxisTime.getViewRange()[0];
		this._nUpperRange = Math.ceil(this._oAxisTime.getViewRange()[1]);
		this._draw(true); // only _draw is triggered
		return this;
	};
	
	GanttChart.prototype.getTimeZoomRate = function () {
		return this._oAxisTime.getZoomRate(this._oZoom.determinedByConfig.fRate);
	};
	/*
	 * Called by UI5 ManagedObject before and after retrieving data.
	 */
	GanttChart.prototype.updateRelationships = function (sReason) {
		var oBinding = this.getBinding("relationships");
		
		if (oBinding) {
			var aContext = oBinding.getContexts(0, 0);
			
			if (aContext && aContext.length > 0) {
				this._aRelationshipsContexts = aContext;
			}
		}
		this._prepareRelationshipDataFromModel();
	};
	
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.addRelationship = function (oRelationship) {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"addRelationship\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.insertRelationship = function (iIndex, oRelationship) {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"insertRelationship\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.removeRelationship = function (oRelationship) {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"removeRelationship\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.getRelationships = function () {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"getRelationships\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.destroyRelationships = function () {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"destroyRelationships\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.indexOfRelationship = function (oRelationship) {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"indexOfRelationship\" cannot be used programmatically!");
	};
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	GanttChart.prototype.removeAllRelationships = function () {
		jQuery.sap.log.error("The control manages the relationships aggregation. The method \"removeAllRelationships\" cannot be used programmatically!");
	};

	GanttChart.prototype._bindAggregation = function (sName, oBindingInfo) {
		if (sName == "rows" && oBindingInfo){
			var oModel = this.getModel(oBindingInfo.model);
			// resolve the path if view itself is binded
			var oBindingContext = this.getBindingContext(oBindingInfo.model);
			if (oBindingContext && oModel){
				oBindingInfo.path = oModel.resolve(oBindingInfo.path, oBindingContext);
			}
			this._oTT.bindRows(oBindingInfo);
		} else {
			return sap.ui.core.Control.prototype._bindAggregation.apply(this, arguments);
		}
	};

	GanttChart.prototype.onBeforeRendering = function () {
		this._bTableReady = false;
		this._iSvgHeight = 0;
		this._detachEvents();
	};

	GanttChart.prototype._detachEvents = function () {
		var $svgCtn = jQuery("#" + this.getId() + "-svg-ctn");	
		var $chartHeaderSvgCnt = jQuery("#" + this.getId() + "-header");

		// unbind wheel event
		$svgCtn.unbind("MozMousePixelScroll.sapUiTableMouseWheel", this._onMouseWheel);
		$svgCtn.unbind("wheel.sapUiTableMouseWheel", this._onMouseWheel.bind);

		// unbind mouse events
		$svgCtn.unbind("mouseleave", this._onSvgMouseLeave);
		$svgCtn.unbind("mouseenter", this._onSvgMouseEnter);
		$svgCtn.unbind("mousedown", this._onSvgMouseDown);
		$svgCtn.unbind("mousemove", this._onSvgMouseMove);
		$svgCtn.unbind("mouseup", this._onSvgMouseUp);
		$svgCtn.unbind("dblclick", this._onSvgDoubleClick);

		// unbind touch events
		if (Device.support.touch) {
			$svgCtn.unbind("touchstart", this._onSvgTouchstart);
			$svgCtn.unbind("touchend", this._onSvgTouchend);
			$svgCtn.unbind("touchmove", this._onSvgTouchmove);
			$chartHeaderSvgCnt.unbind("touchstart", this._onSvgTouchstart);
			$chartHeaderSvgCnt.unbind("touchend", this._onSvgTouchend);
			$chartHeaderSvgCnt.unbind("touchmove", this._onSvgTouchmove);
		}
	};

	GanttChart.prototype.onAfterRendering = function () {
		this._attachEvents();
	};

	GanttChart.prototype._attachEvents = function () {
		var $svgCtn = jQuery("#" + this.getId() + "-svg-ctn");	
		var $chartHeaderSvgCnt = jQuery("#" + this.getId() + "-header");
		
		// register wheel event
		if (Device.browser.firefox) {
			$svgCtn.bind("MozMousePixelScroll.sapUiTableMouseWheel", this._onMouseWheel.bind(this));
		} else {
			$svgCtn.bind("wheel.sapUiTableMouseWheel", this._onMouseWheel.bind(this));
		}

		// register mouse events
		$svgCtn.bind("mouseenter", this._onSvgMouseEnter.bind(this));
		$svgCtn.bind("mouseleave", this._onSvgMouseLeave.bind(this));
		$svgCtn.bind("mousedown", this._onSvgMouseDown.bind(this));
		$svgCtn.bind("mousemove", this._onSvgMouseMove.bind(this));
		$svgCtn.bind("mouseup", this._onSvgMouseUp.bind(this));
		$svgCtn.bind("dblclick", this._onSvgDoubleClick.bind(this));

		// register touch events
		if (Device.support.touch) {
			$svgCtn.bind("touchstart", this._onSvgTouchstart.bind(this));
			$svgCtn.bind("touchend", this._onSvgTouchend.bind(this));
			$svgCtn.bind("touchmove", this._onSvgTouchmove.bind(this));
			$chartHeaderSvgCnt.bind("touchstart", this._onSvgTouchstart.bind(this));
			$chartHeaderSvgCnt.bind("touchend", this._onSvgTouchend.bind(this));
			$chartHeaderSvgCnt.bind("touchmove", this._onSvgTouchmove.bind(this));
		}
	};
	
	GanttChart.prototype._onSvgMouseEnter = function (oEvent) {
		//This event is handled in the same manner as "mouseLeave"
		if (oEvent.button === 0 && oEvent.buttons !== 0 // check if the mouse left key is down
				&& oEvent.target && !this._bDragging
				&& (oEvent.target.id === this.getId() + "-svg-ctn"
						|| oEvent.target.id === this.getId() + "-svg"
						|| this._mouseInSvgCtn(oEvent))) {
			this.fireChartDragEnter({originEvent: oEvent});
		}
	};

	GanttChart.prototype._onSvgMouseLeave = function (oEvent) {
		/*Reason not using '_bDragging': '_bDragging' is set to true until 'mousemove' is triggered, but waiting
		 * that happen may sometimes miss the timing when 'mouseleave' is triggered if the drag happens really quick*/

		//The mouseleave&mouseenter will also be triggered by shapes inside the svg, so add this "IF" condition to only 
		//handle the events triggered by svg.
		//Also, in some bounding case, when user drag a shape from one view to another view through an area full of shapes
		//the events may be only triggered by those shapes, thus the svg will never get the event, so there is a need to
		//check whether mouse is in the svg-ctn area to ensure the event got handled whenever needed
		if (oEvent.target && (oEvent.target.id === this.getId() + "-svg-ctn"
								|| oEvent.target.id === this.getId() + "-svg" || !this._mouseInSvgCtn(oEvent))) {
			if (this._bDragStart && this._oDraggingData !== undefined) {
				this._handleDragLeave(oEvent);
			}
			this._destroyCursorLine();
			this._handleHoverLeave();
		}
	};

	GanttChart.prototype._mouseInSvgCtn = function (oEvent) {
		var $chartBodySvgCnt = jQuery("#" + this.getId() + "-svg-ctn");
		var oVsb = this._oTT.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar);
		var nClientWidth = $chartBodySvgCnt.width() - ((Core.getConfiguration().getRTL() || (jQuery(oVsb).css("display") == "none")) ? 0 : jQuery(oVsb).width());
		var nClientHeight = $chartBodySvgCnt.height();
		var oSvgCtnOffset = $chartBodySvgCnt.offset();
		var nMouseXInSvgCtn = (oEvent.pageX || oEvent.clientX) - oSvgCtnOffset.left;
		var nMouseYInSvgCtn = (oEvent.pageY || oEvent.clientY) - oSvgCtnOffset.top;
		if (nMouseYInSvgCtn >= 0 && nMouseYInSvgCtn < nClientHeight
				&& nMouseXInSvgCtn >= 0 && nMouseXInSvgCtn < nClientWidth) {
			return true;
		}
		return false;
	};

	GanttChart.prototype._onSvgMouseDown = function (oEvent) {
		this._prepareSelection(oEvent);
		this._prepareDragging(oEvent);
	};

	GanttChart.prototype._onSvgMouseMove = function(oEvent){
		this._drawCursorLine(oEvent);
		this._handleHover(oEvent);
	};
	
	GanttChart.prototype._onSvgMouseUp = function (oEvent) {
		/* check if a dragging is happended, if yes, fireShapeDragEnd
		 * Otherwise check if a single click or a double click should happend
		 */
		if (oEvent.button == 2){
			this._handleRightClick(oEvent);
		}else if (oEvent.button == 0 && !this._bDragging && this._bMouseDown) {
			this._handleSelectionChange(oEvent);
		}
	};

	GanttChart.prototype._onSvgDoubleClick = function (oEvent) {
		if (!this._bDragging && !oEvent.ctrlKey && !oEvent.shiftKey) {
			var param = this._composeParameterForClickPosition(oEvent);
			this.fireChartDoubleClick({
				objectInfo: param ? param.rowInfo : undefined,
				leadingRowInfo: param ? param.leadingRowInfo : undefined,
				timestamp: param ? param.startTime.getTime() : undefined,
				svgId: this.getId() + "-svg",
				svgCoordinate: param ? param.svgPoint : undefined,
				effectingMode: this.getMode(),
				originEvent: oEvent
			});
		}
	};

	GanttChart.prototype._onSvgTouchstart = function (oEvent) {
		this._prepareSelection(oEvent);
		this._onTouchScrollStart(oEvent);
	};
	
	GanttChart.prototype._onSvgTouchmove = function (oEvent) {
		this._onTouchScroll(oEvent);
	};
	
	GanttChart.prototype._onSvgTouchend = function (oEvent) {
		if (!this._bScrolling) {
			this._handleSelectionChange(oEvent);
		}else {
			this._setEventStatus("mouseUp");
			this._oLastSelectedShape = undefined;
		}
	};
	
	/**
	 * Handler for mousewheel event on scroll areas.
	 * @private
	 */
	GanttChart.prototype._onMouseWheel = function(oEvent) {
		var oOriginalEvent = oEvent.originalEvent;
		var bIsHorizontal = oOriginalEvent.shiftKey;
		var iScrollDelta = 0;
		if (Device.browser.firefox) {
			iScrollDelta = oOriginalEvent.detail;
		} else {
			if (bIsHorizontal) {
				if (Device.browser.msie || Device.browser.edge) {
					iScrollDelta = oOriginalEvent.deltaY;
				} else {
					iScrollDelta = oOriginalEvent.deltaX;
				}
				//iScrollDelta = oOriginalEvent.deltaX;
			} else {
				iScrollDelta = oOriginalEvent.deltaY;
			}
		}

		if (bIsHorizontal) {
			var sHsb = sap.ui.table.SharedDomRef.HorizontalScrollBar;
			var oHsb = this._oTT.getDomRef(sHsb);
			if (oHsb) {
				var iScrollLeft = oHsb.scrollLeft + iScrollDelta;
				//bubble-up only when scrolling reaches ganttchart boundary
				if (iScrollLeft > 0 && iScrollLeft < (this._oTT.getDomRef(sHsb + "-content").clientWidth - oHsb.clientWidth) - 1) {
					this._preventBubbleAndDefault(oEvent);
				}
				oHsb.scrollLeft = iScrollLeft;
			}
		}else {
			var sVsb = sap.ui.table.SharedDomRef.VerticalScrollBar;
			var oVsb = this._oTT.getDomRef(sVsb);
			if (oVsb) {
				//this._oTT._bIsScrolledByWheel = true;
				var iScrollTop = oVsb.scrollTop + iScrollDelta; 
				//bubble-up only when scrolling reaches ganttchart boundary
				if (iScrollTop > 0 && iScrollTop < (this._oTT.getDomRef(sVsb + "-content").clientHeight - oVsb.clientHeight) - 1) {
					this._preventBubbleAndDefault(oEvent);
				}
				oVsb.scrollTop = iScrollTop;
			}
		}
	};
	
	GanttChart.prototype._onTouchScrollStart = function (oEvent) {
		if (Device.system.combi || Device.system.phone || Device.system.tablet) {
			this._aTouchStartPosition = null;
			this._bIsScrollVertical = null;
			var oTouch = this._getMouseOrTouchPoint(oEvent);
			this._aTouchStartPosition = [oTouch.pageX, oTouch.pageY];
			var oVsb = this._oTT.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar);
			if (oVsb) {
				this._iTouchScrollTop = oVsb.scrollTop;
			}

			var oHsb = this._oTT.getDomRef(sap.ui.table.SharedDomRef.HorizontalScrollBar);
			if (oHsb) {
				this._iTouchScrollLeft = oHsb.scrollLeft;
			}
		}
	};
	
	GanttChart.prototype._onTouchScroll = function (oEvent) {
		if ((Device.system.combi || Device.system.phone || Device.system.tablet) && this._aTouchStartPosition) {
			var oTouch = this._getMouseOrTouchPoint(oEvent);
			var iDeltaX = (oTouch.pageX - this._aTouchStartPosition[0]);
			var iDeltaY = (oTouch.pageY - this._aTouchStartPosition[1]);
			if (this._bIsScrollVertical == null) {
				this._bIsScrollVertical = Math.abs(iDeltaY) > Math.abs(iDeltaX);
			}

			if (this._bIsScrollVertical) {
				var sVsb = sap.ui.table.SharedDomRef.VerticalScrollBar;
				var oVsb = this._oTT.getDomRef(sVsb);
				if (oVsb) {
					var iScrollTop = this._iTouchScrollTop - iDeltaY;
					//bubble-up only when scrolling reaches ganttchart boundary
					if (iScrollTop > 0 && iScrollTop < (this._oTT.getDomRef(sVsb + "-content").clientHeight - oVsb.clientHeight) - 1) {
						this._preventBubbleAndDefault(oEvent);
					}
					oVsb.scrollTop = iScrollTop;
				}
			} else {
				var sHsb = sap.ui.table.SharedDomRef.HorizontalScrollBar;
				var oHsb = this._oTT.getDomRef(sHsb);
				if (oHsb) {
					var iScrollLeft = this._iTouchScrollLeft - iDeltaX;
					//bubble-up only when scrolling reaches ganttchart boundary
					if (iScrollLeft > 0 && iScrollLeft < (this.getDomRef(sHsb + "-content").clientWidth - oHsb.clientWidth) - 1) {
						this._preventBubbleAndDefault(oEvent);
					}
					oHsb.scrollLeft = iScrollLeft;
				}
			}
			this._bScrolling = true;
		}
	};
	
	GanttChart.prototype._handleDragLeave = function (oEvent) {
		this._oDraggingData.targetSvgId = undefined;
		this._setEventStatus("dragLeave");
		//if drag a shape out of a chart(view), then fire an event to Gantt
		this.fireChartDragLeave({
			//eventStatus: this._bDragging, this._mouseup, this.mousedown, or can those status already can be judged by the target(null or not?)
			originEvent: oEvent,
			draggingSource: this._oDraggingData
		});
	};
	
	GanttChart.prototype._handleHoverLeave = function () {
		//Trigger mouseout event from oSVG to tree table
		var oTT = this._oTT;
		oTT.$().find(".sapUiTableRowHvr").trigger("mouseleave");

		this._lastHoverShapeUid = undefined;
		this._lastHoverRowIndex = -1;
	};

	//event handler for single click on chart
	GanttChart.prototype._handleSelectionChange = function (oEvent) {
		this._aShapeIdsToBeSelected = [];
		var oShapeData = d3.select(oEvent.target).data()[0];
		var sClassId;
		if (oEvent.target.getAttribute("class")){
			sClassId = oEvent.target.getAttribute("class").split(" ")[0];
		}
		var bSelectionChange = {};
		if (oShapeData !== undefined && this._judgeEnableSelection(oShapeData, sClassId) && this._oLastSelectedShape !== undefined && this._oLastSelectedShape.uid === oShapeData.uid) {
			//handle shape or relationship selection change
			bSelectionChange = this._selectionChange(oShapeData, oEvent.ctrlKey, oEvent.shiftKey, oEvent);
		}else if (this.getSelectionMode() === sap.gantt.SelectionMode.MultiWithKeyboard) {
			//handle row selection change
			this._syncTTSelection(oEvent);
			this._oLastSelectedShape = undefined;
		}else {
			//Non row selection in Fiori mode, when click on row, clear all shape selection
			if (this._aSelectedShapeUids !== undefined && this._aSelectedShapeUids.length > 0) {
				this._oSelectedShapes = {};
				this._aSelectedShapeUids = [];
				bSelectionChange.shapeSelectionChange = true;
			}
			if (this._aSelectedRelationships.length > 0) {
				this._aSelectedRelationships = [];
				bSelectionChange.relationshipSelectionChange = true;
			}
			if (bSelectionChange.shapeSelectionChange || bSelectionChange.relationshipSelectionChange) {
				this._drawSelectedShapes();
			}
		}
		this._setEventStatus("mouseUp");
		this._oLastSelectedShape = undefined;
		if (bSelectionChange.shapeSelectionChange) {
			this.fireShapeSelectionChange({
				originEvent: oEvent
			});
		}
		if (bSelectionChange.relationshipSelectionChange) {
			this.fireRelationshipSelectionChange({
				originEvent: oEvent
			});
		}
		this._handleClick(oEvent);
	};

	GanttChart.prototype._handleClick = function(oEvent) {
		var param = this._composeParameterForClickPosition(oEvent);
		this.fireChartClick({
			objectInfo: param ? param.rowInfo : undefined,
			leadingRowInfo: param ? param.leadingRowInfo : undefined,
			timestamp: param ? param.startTime.getTime() : undefined,
			svgId: this.getId() + "-svg",
			svgCoordinate: param ? param.svgPoint : undefined,
			effectingMode: this.getMode(),
			originEvent: oEvent
		});
	};

	GanttChart.prototype._handleRightClick = function (oEvent) {
		var param = this._composeParameterForClickPosition(oEvent);
		this.fireChartRightClick({
			objectInfo: param ? param.rowInfo : undefined,
			leadingRowInfo: param ? param.leadingRowInfo : undefined,
			timestamp: param ? param.startTime.getTime() : undefined,
			svgId: this.getId() + "-svg",
			svgCoordinate: param ? param.svgPoint : undefined,
			effectingMode: this.getMode(),
			originEvent: oEvent
		});
	};

	GanttChart.prototype._prepareSelection = function (oEvent) {
		if (Device.system.desktop && oEvent.button !== 0 ) {
			return false;
		}
		if (!this._bDragging) {
			var oShapeData = d3.select(oEvent.target).data()[0];
			var sClassId;
			if (oEvent.target.getAttribute("class")){
				sClassId = oEvent.target.getAttribute("class").split(" ")[0];
			}
			//only when the mousedown is happened to a selectable shape, the shape selection change & dragNdrop are available, but the row selection still works
			if (sClassId && oShapeData && this._judgeEnableSelection(oShapeData, sClassId)) {
				this._oLastSelectedShape = oShapeData;
			}
			this._setEventStatus("mouseDown");
		}
	};

	GanttChart.prototype._prepareDragging = function (oEvent) {
		if (oEvent.button == 0 ) {
			var oShapeData = d3.select(oEvent.target).data()[0];
			var sClassId;
			if (oEvent.target.getAttribute("class")){
				sClassId = oEvent.target.getAttribute("class").split(" ")[0];
			}
			//only when the mousedown is happened to a selectable shape, the shape selection change & dragNdrop are available, but the row selection still works
			if (sClassId && oShapeData && this._judgeEnableSelection(oShapeData, sClassId)) {
				/**
				 * Reason to move this out of the Timeout: in scenario when user drags a shape really quick to another view, the 'dragLeave' is triggered 
				 * before this "handleShapeDragStart“ got processed because of a delay of the timeout. Then it will generate wrong drop info from "dragEnd" event
				*/
				if (this._bMouseDown){
					this._handleShapeDragStart(oEvent);
				}
				//Needed for disabling default drag and drop behaviour in Firefox. This is not harmful to the behaviour in other browsers.
				this._preventBubbleAndDefault(oEvent);
			}
		}
	};
	
	GanttChart.prototype._drawCursorLine = function (oEvent) {
		if (this.getEnableCursorLine()) {
			var aSvg = jQuery("#" + this.getId() + "-svg");
			// calculate svg coordinate for hover
			var oSvgPoint = this._getSvgCoodinateByDiv(aSvg[0], oEvent.pageX || oEvent.clientX, oEvent.pageY || oEvent.clientY);

			// draw cursorLine. select svgs of all chart instances to impl synchronized cursorLine
			this._oCursorLineDrawer.drawSvg(
				d3.selectAll(".sapGanttChartSvg"),
				d3.selectAll(".sapGanttChartHeaderSvg"),
				this.getLocale(),
				oSvgPoint
			);
		}
	};
	
	GanttChart.prototype._destroyCursorLine = function () {
		if (this.getEnableCursorLine()) {
			this._oCursorLineDrawer.destroySvg(
				d3.selectAll(".sapGanttChartSvg"),
				d3.selectAll(".sapGanttChartHeaderSvg"));
		}
	};

	/**
	 * Handle Mouse over event on Gantt Chart SVG, fire chartMouseOver event once row index get changed.
	 * Meanwhile, trigger the mouse over browser event for the underlying tree table row in order to show
	 * the hover effect (gray background for hovered row)
	 * 
	 * @param {object} oEvent Event object
	 * @private
	 */
	GanttChart.prototype._handleHover = function (oEvent) {
		var param = this._composeParameterForClickPosition(oEvent);
		// Use leadingRowNum here to get the actual tree table row index
		var iRowIndex = param ? param.leadingRowNum - this._oTT.getFirstVisibleRow() : -1;
		iRowIndex = iRowIndex < 0 ? -1 : iRowIndex;
		var bExpandedRow = param ? param.isExpandedRow : false;

		var oShapeData = d3.select(oEvent.target).data()[0];
		if (iRowIndex  > -1 && 
				((oShapeData !== undefined && oShapeData.uid !== this._lastHoverShapeUid)
						|| (oShapeData === undefined && this._lastHoverShapeUid !== undefined) || iRowIndex !== this._lastHoverRowIndex)) {
			this.fireChartMouseOver({
				objectInfo: param ? param.rowInfo : undefined,
				leadingRowInfo: param ? param.leadingRowInfo : undefined,
				timestamp: param ? param.startTime.getTime() : undefined,
				svgId: this.getId() + "-svg",
				svgCoordinate: param ? param.svgPoint : undefined,
				effectingMode: this.getMode(),
				originEvent: oEvent
			});
			if (oShapeData !== undefined) {
				this._lastHoverShapeUid = oShapeData.uid;
			}else {
				this._lastHoverShapeUid = undefined;
			}
		}

		if (iRowIndex > -1 && iRowIndex !== this._lastHoverRowIndex) {
			var oTT = this._oTT;
			var oHoveredRow = oTT.getRows()[iRowIndex];
			if (oHoveredRow) {
				oTT.$().find(".sapUiTableRowHvr").trigger("mouseout");
				if (!bExpandedRow){
					oHoveredRow.$().trigger("mouseover");
				}
			}
		}
		if (iRowIndex !== this._lastHoverRowIndex) {
			this._lastHoverRowIndex = iRowIndex;
		}
	};

	GanttChart.prototype._preventBubbleAndDefault = function (oEvent) {
		oEvent.preventDefault();
		oEvent.stopPropagation();
		//oEvent.originalEvent.cancelBubble = true;
	};

	GanttChart.prototype.handleExpandChartChange = function(bExpanded, aChartSchemes, aSelectedIndices) {

		aSelectedIndices = aSelectedIndices ? aSelectedIndices : this._oTT.getSelectedIndices();

		// Do nothing if no selections on table
		if (aSelectedIndices.length > 0) {
			this._updateRowStatusMap(bExpanded, aChartSchemes, aSelectedIndices);
			this._oTT.updateRows();
		}

	};

	GanttChart.prototype.invertRowExpandStatus = function (aSelectedIndices, aChartSchemes) {

		aSelectedIndices = aSelectedIndices ? aSelectedIndices : this._oTT.getSelectedIndices();

		if (aSelectedIndices.length > 0 && aChartSchemes) {
			for (var i = 0; i < aSelectedIndices.length; i++){
				var iIndex = aSelectedIndices[i];
				var bExpanded = this._ifRowExpanded(iIndex, aChartSchemes);
				if (bExpanded !== null){
					this._updateRowStatusMap(!bExpanded, aChartSchemes, [iIndex]);
				}
			}

			this._oTT.updateRows();
		}
	};

	GanttChart.prototype._ifRowExpanded = function (iIndex, aChartSchemes) {
		var oTable = this._oTT;
		var oBinding = oTable.getBinding();
		var oContext = oBinding.getContextByIndex(iIndex);
		var bExpanded = null;

		if (oContext){
			//var sPath = oContext.getPath();
			var oContextObject = oContext.getObject();
			var sUid = oContextObject.uid;
			var oSchemeInfo = this._getRowSpanWithData(oContextObject, aChartSchemes),
				sSchemeName = oSchemeInfo.name;
			if (sUid && this._oRowStatusMap[sUid] && this._oRowStatusMap[sUid][sSchemeName]){
				bExpanded = true;
			} else {
				bExpanded = false;
			}
		}

		return bExpanded;
	};

	GanttChart.prototype._updateRowStatusMap = function (bExpanded, aExpandChartSchemes, aExpandedIndices) {
		var oTable = this._oTT;
		var oBinding = oTable.getBinding();
		for (var i = 0; i < aExpandedIndices.length; i++){
			var iIndex = aExpandedIndices[i];
			var oContext = oBinding.getContextByIndex(iIndex);
			if (oContext){
				//var sPath = oContext.getPath();
				var oContextObject = oContext.getObject();
				var sUid = oContextObject.uid;
				if (sUid){
					var oSchemeInfo = this._getRowSpanWithData(oContextObject, aExpandChartSchemes),
					sSchemeName = oSchemeInfo.name;

					if (bExpanded){
						if (this._oRowStatusMap[sUid]) {
							this._oRowStatusMap[sUid][sSchemeName] = oSchemeInfo;
						} else {
							this._oRowStatusMap[sUid] = {};
							this._oRowStatusMap[sUid][sSchemeName] = oSchemeInfo;
						}
					} else if (!bExpanded && this._oRowStatusMap[sUid]){
						delete this._oRowStatusMap[sUid][sSchemeName];
						delete this._oRowStatusMap[sUid].visibleRowSpan;
						if (jQuery.isEmptyObject(this._oRowStatusMap[sUid])) {
							delete this._oRowStatusMap[sUid];
							continue;
						}
					}
					this._getDrawingData([iIndex, iIndex]);
				}
			}
		}
	};

	GanttChart.prototype.isRowExpanded = function(){
		var bRowExpanded = !jQuery.isEmptyObject(this._oRowStatusMap);
		return bRowExpanded;
	};

	GanttChart.prototype._getRowSpanWithData = function (oSelectedData, aExpandChartSchemes) {
		//Calculate delta height
		var iRowSpan = 1,
			sScheme = null,
			aDrawData = null;

		for (var key = 0; key < aExpandChartSchemes.length; key++) {
			var sExpandScheme = aExpandChartSchemes[key];
			var sMode;
			if (this._oChartSchemesConfigMap[sExpandScheme] && this._oChartSchemesConfigMap[sExpandScheme].getModeKey()) {
				sMode = this._oChartSchemesConfigMap[sExpandScheme].getModeKey();
			} else {
				sMode = this.getMode();
			}

			//Check whether the current object data has the expanded chart scheme
			if (this._oObjectTypesConfigMap[oSelectedData.type] && this._oObjectTypesConfigMap[oSelectedData.type].getExpandedChartSchemeKeys().length > 0) {
				var aValidSchems = this._oObjectTypesConfigMap[oSelectedData.type].getExpandedChartSchemeKeys();
				if ($.inArray(sExpandScheme, aValidSchems) > -1) {
					//If the expandedChartScheme is available in current mode, return all valid data names, which can be drawn by shapes of the expandedChartScheme
					var oSchemeInfo = this._collectDataNameForValidChartScheme(sExpandScheme, sMode);
					if (oSchemeInfo) {
						aDrawData = oSchemeInfo.drawData;
						iRowSpan += oSchemeInfo.rowSpan;
						sScheme = sExpandScheme;
					}
				}
			}
		}
		return {
			rowSpan: iRowSpan,
			name: sScheme,
			data: aDrawData
		};
	};

	GanttChart.prototype._updateTableRowHeights = function () {
		if (this._aHeights){
			this._oTT._updateRowHeader(this._aHeights);
		}
	};
	GanttChart.prototype.notifySourceChange = function () {
		//when switch hierarchy, set the first row as the first visible row
		this._oTT.setFirstVisibleRow(0);
		// reset the rowStatusMap after switching hierarchy
		this.resetRowStatusMap();
	};

	GanttChart.prototype.resetRowStatusMap = function () {
		this._oRowStatusMap = {};
	};

	GanttChart.prototype._collectDataNameForValidChartScheme = function (sScheme, sMode) {
		if (this._oChartSchemesConfigMap[sScheme]) {
			var aDrawData = [], iRowSpan;
			var aShapesForChartScheme = this._oChartSchemesConfigMap[sScheme].getShapeKeys();
			iRowSpan = this._oChartSchemesConfigMap[sScheme].getRowSpan();
			var that = this;
			jQuery.each(aShapesForChartScheme, function (iKey, oVal) {
				if (that._oShapesConfigMap[oVal]) {
					var aModeKeys = that._oShapesConfigMap[oVal].getModeKeys();
					if ((aModeKeys && aModeKeys.length > 0 && $.inArray(sMode, aModeKeys) > -1) || aModeKeys.length == 0 || sMode == sap.gantt.config.DEFAULT_MODE_KEY) {
						aDrawData.push(that._oShapesConfigMap[oVal].getShapeDataName());
					} 
				}
			});
			if (aDrawData.length > 0 && iRowSpan >= 1) {
				return {"drawData" : aDrawData, "rowSpan" : iRowSpan};
			}
		}
	};

	GanttChart.prototype._composeParameterForClickPosition = function (event) {
		var aSvg = jQuery("#" + this.getId() + "-svg");
		var oSvgPoint = this._getSvgCoodinateByDiv(aSvg[0], event.pageX, event.pageY);
		var x = event.pageX - aSvg.offset().left || event.offsetX;
		var y = event.pageY - aSvg.offset().top || event.offsetY;
		if (!this._oAxisOrdinalOfVisibleRow) {
			return null;
		}

		var startTime = this._oAxisTime.viewToTime(x);

		// For expand chart scenario, get the main row (leading row) data
		// viewToRowIndex to get actual tree table row index.
		var oLeadingRowInfo,
			iLeadingRowIndex = this._oAxisOrdinalOfVisibleRow.viewToRowIndex(y, this._getVisibleRowCount()) + this._oTT.getFirstVisibleRow();
		var oContext = this._oTT.getContextByIndex(iLeadingRowIndex);
		if (oContext) {
			oLeadingRowInfo = this._getRowById(oContext.getObject() ? oContext.getObject().id : null);
		}

		// Only for expand chart. viewToElementIndex to get the clicked shape index (fake row)
		var bExpandedRow = false;
		var iShapeRowIndex = this._oAxisOrdinal.viewToElementIndex(y);
		var oShapeData = this._aFilteredRowData[iShapeRowIndex];
		if (oShapeData && oShapeData.index && oShapeData.index !== 0){
			bExpandedRow = true;
		}

		// If Gantt has no expand chart, leadingRowInfo equals rowInfo
		var param = {
			"startTime": startTime,
			"svgPoint": oSvgPoint,
			"leadingRowNum": iLeadingRowIndex,
			"leadingRowInfo": oLeadingRowInfo, 
			"rowIndex": iShapeRowIndex,
			"rowInfo": oShapeData,
			"isExpandedRow": bExpandedRow
		};
		return param;
	};

	/**
	 * Gets all row data
	 * @return {array} All row data
	 * @public
	 */
	GanttChart.prototype.getAllRowData = function() {
		var oBinding = this._oTT.getBinding("rows");
		return this._getDrawingData([0, oBinding.getLength() - 1]);
	};

	/**
	 * Gets the selected rows, shapes, and relationships
	 * @return {object} The returned object contains "rows" for all selected rows, "shapes" for all selected shapes, and "relationships" for all selected relationships
	 */
	GanttChart.prototype.getAllSelections = function () {
		var selectedRows = this.getSelectedRows();
		var selectedShapes = this.getSelectedShapes();
		var selectedRelationships = this.getSelectedRelationships();
		var currentSelection = {"rows": selectedRows, "shapes": selectedShapes, "relationships": selectedRelationships};
		return currentSelection;
	};

	/**
	 * Gets the selected rows
	 * @return {array} Selected rows
	 * @public
	 */
	GanttChart.prototype.getSelectedRows = function () {
		var aSelectedRows = [];
		var aSelectedIndexs = this._oTT.getSelectedIndices();
		var aAllRowData = this.getAllRowData();

		var aMainRows = [];
		for (var i = 0; i < aAllRowData.length; i++) {
			//filter out the expanded rows(this method should just collect the selected main rows, rather than
			//expanded rows)
			if (aAllRowData[i] && !aAllRowData[i].parentId) {
				aMainRows.push(aAllRowData[i]);
			}
		}
		for (var j = 0; j < aSelectedIndexs.length; j++) {
			if (aSelectedIndexs[j] > -1 && aSelectedIndexs[j] < aMainRows.length && aMainRows[aSelectedIndexs[j]]) {
				aSelectedRows.push(aMainRows[aSelectedIndexs[j]]);
			}
		}
		return aSelectedRows;
	};

	/**
	 * Gets the selected shapes
	 * @return {array} selected shapes
	 * @public
	 */
	GanttChart.prototype.getSelectedShapes = function () {
		this._setSelectedStatusFromData(this.getShapeDataNames(), this.getAllRowData());
		return this._oSelectedShapes;
	};
	
	/**
	 * Get all the current selected relationships
	 * @return {array} selected relationships
	 * @public
	 */
	GanttChart.prototype.getSelectedRelationships = function () {
		return this._aSelectedRelationships;
	};
	
	/**
	 * Get row object by shape uid
	 * @param {string} [sShapeUid] shape uid
	 * @return {object} row object
	 * @public
	 */
	GanttChart.prototype.getRowByShapeUid = function (sShapeUid) {
		return this._getRowByShapeUid(sShapeUid);
	};
	
	/**
	 * Selects shapes, and deselects all shapes when aIds is a null list and bIsExclusive is true
	 * @param {array} [aIds] List of the shapes that you want to select
	 * @param {boolean} [bIsExclusive] Whether all other selected shapes are deselected
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.selectShapes = function(aIds, bIsExclusive) {
		if (!this._aFilteredRowData || !this._aFilteredRowData.length > 0) {
			if (bIsExclusive) {
				this._aShapeIdsToBeSelected = [];
			}
			this._aShapeIdsToBeSelected = this._aShapeIdsToBeSelected.concat(aIds);
		}
		var i, j, aShapeData, oShapeData;
		if (this._aSelectedShapeUids === undefined) {
			this._aSelectedShapeUids = [];
		}
		if (!aIds || aIds.length < 1) {//deselect all
			this._oSelectedShapes = {};
			this._aSelectedShapeUids = [];
		}else if (bIsExclusive) {
			this._oSelectedShapes = {};
			this._aSelectedShapeUids = [];
			for (i = 0; i < aIds.length; i++) {
				aShapeData = this._getShapeDataById(aIds[i], false);
				for (j = 0; j < aShapeData.length; j++) {
					oShapeData = aShapeData[j];
					if (this._judgeEnableSelection(oShapeData)) { // judge whether the uid is existed and whether is enable selection
						this._selectShape(oShapeData);
					}
				}
			}
		}else {
			for (i = 0; i < aIds.length; i++) {
				aShapeData = this._getShapeDataById(aIds[i], false);
				for (j = 0; j < aShapeData.length; j++) {
					oShapeData = aShapeData[j];
					if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) > -1) {
						continue;
					}else if (this._judgeEnableSelection(oShapeData)) {
						this._selectShape(oShapeData);
					}
				}
			}
		}
		
		this._drawSelectedShapes();
		return this;
	};

	/**
	 * deselect shapes
	 * @param {array} [aIds] List of the shapes that you want to deselect
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.deselectShapes = function(aIds) {
		if (!aIds || aIds.length < 1) { // deselect all shape if no parameter is passed in
			this._oSelectedShapes = {};
			this._aSelectedShapeUids = [];
			this._drawSelectedShapes();
			return this;
		}
		for (var i = 0; i < aIds.length; i++) {
			var aShapeData = this._getShapeDataById(aIds[i]);
			for (var j = 0; j < aShapeData.length; j++){
				this._deselectShape(aShapeData[j]);
			}
		}
		this._drawSelectedShapes();
		return this;
	};
	
	/**
	 * Select rows and all shapes contained in those rows
	 * @param {array} [aIds] Row uids
	 * @param {boolean} [bIsExclusive] Wether all other selected rows and shapes are deselected
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.selectRowsAndShapes = function(aIds, bIsExclusive) {
		if (!aIds || aIds.length < 1) { // deselect all shape if no parameter is passed in
			this.deselectShapes();
			this.deselectRows();
			return this;
		}
		this.selectRows(aIds, bIsExclusive);
		if (bIsExclusive) {
			this._oSelectedShapes = {};
			this._aSelectedShapeUids = [];
		}
		if (!this._aSelectedShapeUids) {
			this._aSelectedShapeUids = [];
		}
		for (var id in aIds) {
			var sId = aIds[id];
			var oRowData = this._getRowById(sId);
			if (oRowData) {
				for (var sShapeId in oRowData.data) {
					if (oRowData.data[sShapeId] instanceof Array) {
						for ( var i = 0; i < oRowData.data[sShapeId].length; i++) {
							var oShapeData = oRowData.data[sShapeId][i];
							if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) < 0) {
								this._selectShape(oShapeData);
							}
						}
					}
				}
			}
		}
		this._drawSelectedShapes();
		
		return this;
	};

	/**
	 * Selects relationships, and deselects all other selected relationships if aIds is a null list and bIsExclusive is true
	 * @param {array} [aIds] List of the shapes that you want to select
	 * @param {boolean} [bIsExclusive] Whether all other selected shapes are deselected
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.selectRelationships = function(aIds, bIsExclusive) {
		var i, oRelationship;
		if (!this._aSelectedRelationships) {
			this._aSelectedRelationships = [];
		}
		if (!aIds || aIds.length < 1) {//deselect all
			if (this._aSelectedRelationships.length > 0) {
				this._aSelectedRelationships = [];
				this._drawSelectedShapes();
			}
			return this;
		}
		if (bIsExclusive) {
			this._aSelectedRelationships = [];
			for (i = 0; i < aIds.length; i++) {
				oRelationship = this._getShapeDataById(aIds[i], true)[0];
				if (oRelationship && this._judgeEnableSelection(oRelationship)) {
					this._aSelectedRelationships.push(oRelationship);
				}
			}
		} else {
			for (i = 0; i < aIds.length; i++) {
				oRelationship = this._getShapeDataById(aIds[i], true)[0];
				//if the relationship is unavailable or it is already in selection, ignore
				if (!oRelationship || jQuery.inArray(oRelationship, this._aSelectedRelationships) >= 0) {
					continue;
				} else if (this._judgeEnableSelection(oRelationship)) {
					this._aSelectedRelationships.push(oRelationship);
				}
			}
		}
		this._drawSelectedShapes();
		return this;
	};

	/**
	 * Deselects relationships
	 * @param {array} [aIds] List of the relationships that you want to deselect
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.deselectRelationships = function(aIds) {
		var aUids = [];
		if (!aIds || aIds.length < 1) { // deselect all relationships if no parameter is passed in
			this._aSelectedRelationships = [];
			this._drawSelectedShapes();
			return this;
		}
		if (aIds) {
			for (var i = 0; i < aIds.length; i++) {
				var uid = this._getUidById(aIds[i], true)[0];
				if (uid !== undefined) {
					aUids.push(uid);
				}
			}
		}
		for (var j in this._aSelectedRelationships) {
			var oSelectedRLS = this._aSelectedRelationships[j];
			if (jQuery.inArray(oSelectedRLS.uid, aUids) > -1) {
				var iIndex = this._aSelectedRelationships.indexOf(oSelectedRLS);
				this._aSelectedRelationships.splice(iIndex, 1);
			}
		}
		this._drawSelectedShapes();
		return this;
	};

	/**
	 * Selects rows
	 * @param {array} [aIds] List of the rows that you want to select
	 * @param {boolean} [bIsExclusive] Whether all other selected rows are deselected
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.selectRows = function(aIds, bIsExclusive) {
		var aBindingRows = this.getAllRowData();
		//var iFirstRow = this._oTT.getFirstVisibleRow();
		var aSelectedIndexs = this._oTT.getSelectedIndices();
		if (bIsExclusive && aSelectedIndexs.length > 0) {
			this._oTT.clearSelection();
		}
		for (var iIndex = 0; iIndex < aBindingRows.length; iIndex++) {
			if (jQuery.inArray(aBindingRows[iIndex].id, aIds) > -1 && jQuery.inArray(iIndex, aSelectedIndexs) < 0) {
				//check if the treetable support multiple selection
				var sSelectionMode = this._oTT.getSelectionMode();
				if (sSelectionMode === sap.ui.table.SelectionMode.MultiToggle) {
					this._oTT.addSelectionInterval(iIndex, iIndex);
				}else {
					this._oTT.setSelectedIndex(iIndex);
				}
			}
		}
		return this;
	};

	/**
	 * Deselects rows
	 * @param {array} [aIds] List of the rows that you want to deselect
	 * @return {boolean} True if the selection change is applied
	 * @public
	 */
	GanttChart.prototype.deselectRows = function(aIds) {
		if (!aIds || aIds.length < 1) { // deselect all rows if no parameter is passed in
			this._oTT.clearSelection();
			return this;
		}
		// the rest logic to be discussed, should boolean be returned?
		var aSelectedIndexs = this._oTT.getSelectedIndices();
		var aBindingRows = this.getAllRowData();
		for (var i = 0; i < aSelectedIndexs.length; i++) {
			var iIndex = aSelectedIndexs[i];
			if (jQuery.inArray(aBindingRows[iIndex].id, aIds) > -1) {
				this._oTT.removeSelectionInterval(iIndex, iIndex);
			}
		}
		return this;
	};

	/**
	 * Expands the GanttChart to the given level
	 * 
	 * @see sap.ui.table.TreeTable.expandToLevel
	 *
	 * @param {int} iLevel
	 *         Level to be expanded to
	 * @return {sap.gantt.GanttChart} A reference to the GanttChart control, which can be used for chaining
	 * @public
	 */
	GanttChart.prototype.expandToLevel = function (iLevel) {
		this._oTT.expandToLevel(iLevel);
		return this;
	};

	//Private method: check if an element is a relationship by its' sShapeUid
	GanttChart.prototype._isRelationship = function (sShapeUid) {
		if (Utility.getShapeDataNameByUid(sShapeUid) === sap.gantt.shape.ShapeCategory.Relationship) {
			return true;
		}	
		return false;
	};
	
	GanttChart.prototype._onRowSelectionChange = function (oEvent) {
		this.fireRowSelectionChange({
			originEvent: oEvent
		});
	};
	
	//Private method: ShapeSelectionChange, RelationshipSelectionChange
	GanttChart.prototype._selectionChange = function (oShapeData, bCtrl, bShift, origEvent) {
		if (this._aSelectedRelationships == undefined){
			this._aSelectedRelationships = [];
		}
		if (this._aSelectedShapeUids == undefined){
			this._aSelectedShapeUids = [];
		}
		/*
		 * Click on Shapes:	Clear any existing selection of all shape and select current shape.	Clear all rows selection.
		 * Click on Shapes + control key:	Keep existing selection of all shapes and change selection of current shape.	Keep all rows selection. Keep all relationship selection
		 * above 2 same for the relationships
		 * Old: Click on Shape + shift key = Click on Shape
		 */
		var bShapeSelectionChange = false;
		var bRelationshipSelectionChange = false;
		var targetUid = oShapeData.uid;
		var isRelationship = this._isRelationship(targetUid);
		if ((bCtrl && this.getSelectionMode() === sap.gantt.SelectionMode.MultiWithKeyboard) || this.getSelectionMode() === sap.gantt.SelectionMode.Multiple){
			//when ctrl key is pressed or in Fiori multiple selection mode
			if (!isRelationship) {
				//if the shape is already in selectedShapes, deselect it, otherwise select it
				if (this._aSelectedShapeUids !== undefined && jQuery.inArray(targetUid, this._aSelectedShapeUids) > -1){
					if (!this._bDragging) {
						bShapeSelectionChange = this._deselectShape(oShapeData);
					}
				}else {
					bShapeSelectionChange = this._selectShape(oShapeData);
				}
			}else {
				if (jQuery.inArray(oShapeData, this._aSelectedRelationships) < 0){
					this._aSelectedRelationships.push(oShapeData);
				}else {
					var index = this._aSelectedRelationships.indexOf(oShapeData);
					this._aSelectedRelationships.splice(index,1);
				}
				bRelationshipSelectionChange = true;
			}
		}else if (!isRelationship) {
			if ((jQuery.inArray(targetUid, this._aSelectedShapeUids) < 0 || this._aSelectedShapeUids.length > 1) && !this._bDragging) {
				//clear all the Selected Shapes, add the clicking one
				this._oSelectedShapes = {};
				this._aSelectedShapeUids = [];
				bShapeSelectionChange = true;
			}
			if (jQuery.inArray(targetUid, this._aSelectedShapeUids) < 0 ) {
				var bUpdated = this._selectShape(oShapeData);
				if (!bShapeSelectionChange && bUpdated) {
					bShapeSelectionChange = true;
				}
			}
			if (this._aSelectedRelationships.length > 0) {
				this._aSelectedRelationships = [];
				bRelationshipSelectionChange = true;
			}
		}else {//if the current clicking element is a relationship
			if ((jQuery.inArray(oShapeData, this._aSelectedRelationships) < 0) || this._aSelectedRelationships.length > 1){
				//clear all the Selected Shapes, add the clicking one
				this._aSelectedRelationships = [];
				this._aSelectedRelationships.push(oShapeData);
				bRelationshipSelectionChange = true;
			}
			if (this._aSelectedShapeUids !== undefined && this._aSelectedShapeUids.length > 0) {
				this._oSelectedShapes = {};
				this._aSelectedShapeUids = [];
				bShapeSelectionChange = true;
			}
		}
		if (bShapeSelectionChange || bRelationshipSelectionChange) {
			this._drawSelectedShapes();
		}
		return {
			shapeSelectionChange: bShapeSelectionChange,
			relationshipSelectionChange: bRelationshipSelectionChange
		};
	};

	/*
	 * update the selected status back to model data
	 */
	GanttChart.prototype._setSelectedStatusToData = function() {
		var aAllRowData = this.getAllRowData();
		if (aAllRowData && aAllRowData.length > 0 && this._aShapeIdsToBeSelected.length > 0) {
			for (var k in this._aShapeIdsToBeSelected) {
				var aShapeData = this._getShapeDataById(this._aShapeIdsToBeSelected[k], false);
				for (var l in aShapeData) {
					this._selectShape(aShapeData[l]);
				}
			}
			//this._aShapeIdsToBeSelected = [];
		}
		for (var sRow in aAllRowData) {
			var oRowData = aAllRowData[sRow];
			for (var sShapeDataName in oRowData.data) {
				var aShapes = oRowData.data[sShapeDataName];
				if (aShapes instanceof Array) {
					for ( var iIndex = 0; iIndex < aShapes.length; iIndex++) {
						var oShapeData = aShapes[iIndex];
						if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) > -1) {
							oShapeData.selected = true;
						}else {
							oShapeData.selected = false;
						}
					}
				}
			}
		}
		for (var i in this._aRelationships) {
			this._aRelationships[i].selected = false;
			if (this._aSelectedRelationships !== undefined && this._aSelectedRelationships.length > 0){
				for (var j in this._aSelectedRelationships) {
					if (this._aRelationships[i].uid === this._aSelectedRelationships[j].uid) {
						this._aRelationships[i].selected = true;
					}
				}
			}
		}
	};

	/*
	 * get the selections according to the data from model
	 */
	GanttChart.prototype._setSelectedStatusFromData = function (aShapeDataNames, aAllRowData) {
		this._oSelectedShapes = this._oSelectedShapes ? this._oSelectedShapes : {};
		this._aSelectedShapeUids = this._aSelectedShapeUids ? this._aSelectedShapeUids : [];
		this._bSelectedStatusUpdated = true;
		//var aAllRowData = this.getAllRowData(); //all row data in Model
		var aUpdatedShapeUids = [];
		for (var sRow in aAllRowData) {
			var oRowData = aAllRowData[sRow];
			for (var sShapeDataName in oRowData.data) {
				var aShapes = oRowData.data[sShapeDataName];
				//only loop the arrays, e.g tasks, activities
				if (aShapes instanceof Array && jQuery.inArray(sShapeDataName, aShapeDataNames) > -1) {
					for ( var i = 0; i < aShapes.length; i++) {
						var oShapeData = aShapes[i];
						if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) > -1) {
							//if the shape is already in selected list, update the shape data
							for (var k = 0; k < this._oSelectedShapes[sShapeDataName].length; k++) {
								if (this._oSelectedShapes[sShapeDataName][k].shapeUid === oShapeData.uid) {
									this._oSelectedShapes[sShapeDataName][k].shapeData = oShapeData;
									this._oSelectedShapes[sShapeDataName][k].objectInfoRef = oRowData;
									aUpdatedShapeUids.push(oShapeData.uid);
									break;
								}
							}
						} else if (oShapeData.selected) {
							this._oSelectedShapes[sShapeDataName] = this._oSelectedShapes[sShapeDataName] ? this._oSelectedShapes[sShapeDataName] : [];
							this._oSelectedShapes[sShapeDataName].push({"shapeUid": oShapeData.uid, "shapeData": oShapeData, "objectInfoRef": oRowData});
							this._aSelectedShapeUids.push(oShapeData.uid);
							aUpdatedShapeUids.push(oShapeData.uid);
						}
					}
				}
			}
		}
		
		//keep the this._aSelectedShapeUids&this._oSelectedShapes align with updated Model Data
		if (aUpdatedShapeUids.length < 1) {
			this._oSelectedShapes = {};
		} else {
			for (var sName in this._oSelectedShapes) {
				for (var index = this._oSelectedShapes[sName].length - 1; index >= 0; index--) {
					var oShape = this._oSelectedShapes[sName][index];
					if (jQuery.inArray(oShape.shapeUid, aUpdatedShapeUids) < 0) {
						this._oSelectedShapes[sName].splice(index, 1);
					}
				}
			}
		}
		this._aSelectedShapeUids = aUpdatedShapeUids;
		
		//loop given relationship data, collect the selected data into the selected relationship collection
		this._aSelectedRelationships = this._aSelectedRelationships ? this._aSelectedRelationships : [];
		var aTemp = [];
		for (var j in this._aRelationships) {
			var bExisting = false;
			for (var iIndex = 0; iIndex < this._aSelectedRelationships.length; iIndex++) {
				if (this._aSelectedRelationships[iIndex].uid === this._aRelationships[j].uid) {
					//if the relationship is in selected list, update the relationship data
					aTemp.push(this._aRelationships[j]);
					bExisting = true;
					break;
				}
			}
			if (!bExisting && this._aRelationships[j].selected) {
				aTemp.push(this._aRelationships[j]);
			}
		}
		//keep this._aSelectedRelationships align with updated Model Data
		this._aSelectedRelationships = aTemp;
	};
	/*
	 * Synconize the clicks on empty space of chart with selection of rows in the back table
	 */
	GanttChart.prototype._syncTTSelection = function(event){
		jQuery.sap.measure.start("GanttChart syncTTSelection","GanttPerf:GanttChart syncTTSelection function");
		var oTouchPoint = this._getMouseOrTouchPoint(event);
		var bShift = event.shiftKey;
		var bCtrl = event.ctrlKey;
		var $svg = jQuery("#" + this.getId() + "-svg")[0];
		var oClickPoint = this._getSvgCoodinateByDiv($svg, oTouchPoint.pageX, oTouchPoint.pageY);

		var iRowIndex = parseInt(this._oAxisOrdinalOfVisibleRow.viewToElementIndex(oClickPoint.y), 10);
		if (iRowIndex < 0){
			return false;
		}
		var aVisibleRows = this._oTT.getRows();
		var iIndex, oSelectedRow = d3.select("#" + aVisibleRows[iRowIndex].getId());
		if (iRowIndex < aVisibleRows.length && oSelectedRow && oSelectedRow.attr("data-sap-ui-rowindex")){
			iIndex = this._oTT.getFirstVisibleRow() + parseInt(oSelectedRow.attr("data-sap-ui-rowindex"), 10);
		}
		
		var sSelectionMode = this._oTT.getSelectionMode();
		if (iIndex >= 0 && sSelectionMode !== sap.ui.table.SelectionMode.None) {
			if (sSelectionMode === sap.ui.table.SelectionMode.Single) {
				if (!this._oTT.isIndexSelected(iIndex)) {
					this._oTT.setSelectedIndex(iIndex);
				} else {
					this._oTT.clearSelection();
				}
			} else {
				if (sSelectionMode === sap.ui.table.SelectionMode.MultiToggle && this.getSelectionMode === sap.gantt.SelectionMode.Multiple) {
					bCtrl = true;
				}
				if (bShift) {
					// If no row is selected getSelectedIndex returns -1 - then we simply select the clicked row:
					// Click on Empty place + shift key: Keep all shape/relationship selection.
					// sync the row selection with original treetable row selection behavior
					var iSelectedIndex = this._oTT.getSelectedIndex();
					if (iSelectedIndex >= 0) {
						if (iSelectedIndex < iIndex) {
							this._oTT.addSelectionInterval(iSelectedIndex, iIndex);
						}else {
							this._oTT.addSelectionInterval(iIndex, iSelectedIndex);
						}
					}else {
						this._oTT.setSelectedIndex(iIndex);
					}
				}else if (!this._oTT.isIndexSelected(iIndex)) {
					if (bCtrl) {
						this._oTT.addSelectionInterval(iIndex, iIndex);
					} else {
						//this._oTT.clearSelection();
						this._oTT.setSelectedIndex(iIndex);
					}
				}else if (bCtrl) {
					this._oTT.removeSelectionInterval(iIndex, iIndex);
				}else if (this._oTT.getSelectedIndices().length > 1) {
					//this._oTT.clearSelection();
					this._oTT.setSelectedIndex(iIndex);
				}
			}
		}
		jQuery.sap.measure.end("GanttChart syncTTSelection");
	};
	
	GanttChart.prototype._getMouseOrTouchPoint = function (oEvent) {
		// touchstart, touchmove
		if (oEvent.targetTouches && oEvent.targetTouches.length > 0) {
			return oEvent.targetTouches[oEvent.targetTouches.length - 1];
		// touchend
		} else if (oEvent.changedTouches && oEvent.changedTouches.length > 0) {
			return oEvent.changedTouches[oEvent.changedTouches.length - 1];
		}
		// mouse*
		return {"pageX": oEvent.pageX, "pageY": oEvent.pageY};
	};
	
	//Set global variances for svg events
	GanttChart.prototype._setEventStatus = function (sEventName) {
		switch (sEventName) {
			case "dragEnter":
				this._bDragStart = true;
				break;
			case "mouseDown":
				this._bMouseDown = true; 
				this._bDragging = false;
				this._bDragStart = false;
				this._bScrolling = false;
				break;
			case "shapeDragStart":
				this._bDragStart = true;
				break;
			case "shapeDragging":
				/**
				 * only when drag is prepared. if not do like this, when 'dragLeave' is
				 * triggered on gantt chart view A, the flag "_bDragging" is set to false. But the 
				 * "mousemove" handler is still from A until the dragged shape enter another gantt chart
				 * view B ("dragEnter" triggered on B),
				 * so before that, the "mousemove" keeps being triggered on A and the '_bDragging' would
				 * be set to true again, which is not expected and will cause wrong result of the final drop.
				*/
				if (this._bDragStart) {
					this._bDragging = true;
				}
				break;
			case "mouseUp":
				this._bMouseDown = false;
				this._bScrolling = false;
				break;
			case "shapeDragEnd":
				this._bDragging = false;
				this._bDragStart = false;
				this._oDraggingData = undefined;
				break;
			case "dragLeave":
				this._bDragging = false;
				this._bDragStart = false;
				break;
			default:
				break;
		}
	};
	
	GanttChart.prototype._handleShapeDragStart = function (oEvent) {
		var aSvg = jQuery("#" + this.getId() + "-svg");
		//if mouse down on a shape that is dragable
		var oSourceShapeData = d3.select(oEvent.target).data()[0];
		var sClassId = oEvent.target.getAttribute("class").split(" ")[0];
		if (oSourceShapeData !== undefined && this._judgeEnableDnD(oSourceShapeData, sClassId)) {
			var rowInfo = this._getRowByShapeUid(oSourceShapeData.uid);
			if (rowInfo) {
				var x = oEvent.pageX - aSvg.offset().left || oEvent.offsetX;
				var y = oEvent.pageY - aSvg.offset().top || oEvent.offsetY;
				var shapeX, shapeWidth;
				if (oEvent.target.getAttribute("x") && oEvent.target.getAttribute("width")) {
					shapeX = parseInt(oEvent.target.getAttribute("x"), 10);
					shapeWidth = parseInt(oEvent.target.getAttribute("width"), 10);
				}else if (oSourceShapeData.startTime){
					var x1 = this._oAxisTime.timeToView(Format.abapTimestampToDate(oSourceShapeData.startTime));
					var x2 = this._oAxisTime.timeToView(Format.abapTimestampToDate(oSourceShapeData.endTime));
					if (Core.getConfiguration().getRTL()) {
						shapeX = x2;
						shapeWidth = (x1 - x2) > 0 ? (x1 - x2) : 1;
					}else {
						shapeX = x1;
						shapeWidth = (x2 - x1) > 0 ? (x2 - x1) : 1;
					}
				}else {
					shapeX = x;
					shapeWidth = 1;
				}
				var oDragStartPoint = {"x": x, "y": y, "shapeX": shapeX, "shapeWidth": shapeWidth};
				
				var aSourceShapeData = [];
				aSourceShapeData.push({
					"shapeData": oSourceShapeData,
					"objectInfo": rowInfo
				});
				for (var sShapeDataName in this._oSelectedShapes) {
					var aShapeData = this._oSelectedShapes[sShapeDataName];
					if (aShapeData !== undefined) {
						for (var i in aShapeData) {
							if (aShapeData[i].shapeUid !== oSourceShapeData.uid && this._judgeEnableDnD(aShapeData[i].shapeData)) {
								aSourceShapeData.push({
									"shapeData": aShapeData[i].shapeData,
									"objectInfo": aShapeData[i].objectInfoRef
								});
							}
						}
					}
				}
				this._oDraggingData = {
						"sourceShapeData": aSourceShapeData,
						"dragStartPoint": oDragStartPoint,
						"sourceSvgId": this.getId(),
						"targetSvgId": this.getId(),
						"domObject": this._getDraggingDomObjs(oEvent)
				};
				this._setEventStatus("shapeDragStart");
				//remove all drag&drop related events bound to document.body
				jQuery(document.body).unbind("mousemove.ganttChartDragDrop");
				jQuery(document.body).unbind("mouseup.ganttChartDragDrop");
				jQuery(document.body).bind("mousemove.ganttChartDragDrop", this._handleShapeDragging.bind(this));
				jQuery(document.body).bind("mouseup.ganttChartDragDrop", this._handleShapeDragEnd.bind(this));
			}
		}
	};
	
	GanttChart.prototype._getDraggingDomObjs = function (oEvent) {
		var currentNode = d3.select(oEvent.target)[0][0];
		var sClasses; 
		if (currentNode.parentElement) {
			sClasses = currentNode.parentElement.getAttribute("class");
		} else if (currentNode.parentNode) {
			sClasses = currentNode.parentNode.getAttribute("class");
		}
		if (sClasses) {
			var sTopShapeClass = sClasses.split(" ")[0];
			if (sap.ui.getCore().byId(sTopShapeClass) instanceof sap.gantt.shape.Group){
				return currentNode.parentNode.childNodes;
			}
		}
		return [currentNode];
	};
	
	GanttChart.prototype._handleShapeDragging = function (oEvent) {
		if (!Device.support.touch && (oEvent.button !== 0 || oEvent.buttons === 0 || oEvent.ctrlKey)) {
			return false;
		}

		var aSvg = jQuery("#" + this.getId() + "-svg");
		var dx = Math.abs((oEvent.pageX - aSvg.offset().left || oEvent.offsetX) - this._oDraggingData.dragStartPoint.x);
		var dy = Math.abs((oEvent.pageY - aSvg.offset().top || oEvent.offsetY) - this._oDraggingData.dragStartPoint.y);
		if (dx > 3 || dy > 3) {
			var aDragDiv = d3.select("#dragDropShadow");
			var dragDiv = aDragDiv[0];
			if (this._oDraggingData === undefined) {
				if (!aDragDiv.empty()){
					aDragDiv.remove();
				}
			} else {
				var iShapeX = this._oDraggingData.dragStartPoint.shapeX;
				var iStartMouseX = this._oDraggingData.dragStartPoint.x;
				if (aDragDiv.empty() || dragDiv === null) {
					//when drag an unselected shape, check if need to clear other shape selection
					this._handleDragWithoutSelection(oEvent);
					var nShapeCount = this._oDraggingData.sourceShapeData.length;
					dragDiv = d3.select("body").append("div").attr("id", "dragDropShadow");
					dragDiv.classed("sapGanttDraggingShadow", true);
					var aCloneDoms = [];
					var width = 12;
					var height = 10;
					var fontSize = 12;
					for (var i = 0; i < this._oDraggingData.domObject.length; i++) {
						var oNode = d3.select(this._oDraggingData.domObject[i]);
						if (!oNode.empty()) {
							var currentWidth = parseInt(oNode.attr("width"), 10);
							var currentHeight = parseInt(oNode.attr("height"), 10);
							var sTransform = oNode.attr("transform");

							width = currentWidth > width ? currentWidth : width;
							height = currentHeight > height ? currentHeight : height;

							var sShadowTransform = "";
							if (sTransform) {
								var subs = sTransform.split(")");
								for (var iIndex = 0; iIndex < subs.length - 1; iIndex++){
									if (subs[iIndex].indexOf("translate") < 0) {
										sShadowTransform = sShadowTransform + subs[iIndex] + ") ";
									}
								}
								sShadowTransform.replace("))", ")");
							}
							var shadow = d3.select(this._oDraggingData.domObject[i].cloneNode())
								.classed("shadow", true)
								.attr("fill-opacity", "0.5")
								.attr("x", 0)
								.attr("y", 0)
								.attr("transform", sShadowTransform);
							aCloneDoms.push(shadow);
						}
					}
					var g = dragDiv.append("svg").attr("id", "dragDropShadowSvg").attr("width", width)
					.append("g").attr("id", "dragDropShadowSvgGroup");
					for (var k = 0; k < aCloneDoms.length; k++) {
						g.node().appendChild(aCloneDoms[k].node());
					}
					g.append("text")
						.attr("x", width / 2 - fontSize / 2)
						.attr("y", height - fontSize / 2 + 4)
						.attr("fill", "blue")
						.attr("font-size", fontSize)
						.text(function () {
							return nShapeCount; 
						});
				}
				var iCurrentX = iShapeX + (oEvent.pageX - iStartMouseX);
				var iCurrentY = oEvent.pageY;//calculate current Y on the align of shape&row
				d3.select("#dragDropShadow").style("left", iCurrentX + 4 + "px");
				d3.select("#dragDropShadow").style("top", iCurrentY + 4 + "px");
				jQuery(document.body).addClass("sapGanttDraggingCursor");

				this._setEventStatus("shapeDragging");
			}
		}
	};

	GanttChart.prototype._handleDragWithoutSelection = function (oEvent) {
		//if a drag is really happening, put the currently dragged shape into selected list
		if (jQuery.inArray(this._oDraggingData.sourceShapeData[0].shapeData.uid, this._aSelectedShapeUids) < 0) {
			var bRelSelectionChange = false;
			//if not support multiple selection without Ctrl key, clear all existing shape/relationship selection and select current shape
			if (this.getSelectionMode() !== sap.gantt.SelectionMode.Multiple) {
				if (this._aSelectedShapeUids && this._aSelectedShapeUids.length > 0) {
					this._aSelectedShapeUids = [];
					this._oSelectedShapes = {};
					//remove other shapes from dragging data
					this._oDraggingData.sourceShapeData.splice(1, this._oDraggingData.sourceShapeData.length - 1);
				}
				if (this._aSelectedRelationships && this._aSelectedRelationships.length > 0) {
					this._aSelectedRelationships = [];
					bRelSelectionChange = true;
				}
			}
			this._selectShape(this._oDraggingData.sourceShapeData[0].shapeData);
			this._drawSelectedShapes();
			this.fireShapeSelectionChange({
				originEvent: oEvent
			});
			if (bRelSelectionChange) {
				this.fireRelationshipSelectionChange({
					originEvent: oEvent
				});
			}
		}
	};
	
	GanttChart.prototype._handleShapeDragEnd = function (oEvent) {
		var div = d3.select("#dragDropShadow");
		if (!div.empty()){
			div.remove();
		}

		if (this._bDragging && this._oDraggingData !== undefined) {
			var sTargetSvgId = this.getId();
			this._collectDraggingShapeData(this._oDraggingData, oEvent);
			this.fireShapeDragEnd({
				originEvent: oEvent,
				sourceSvgId: this._oDraggingData.sourceSvgId,
				targetSvgId: sTargetSvgId,
				sourceShapeData: this._oDraggingData.sourceShapeData,
				targetData: this._oDraggingData.targetData
			});
		}

		jQuery(document.body).unbind("mousemove.ganttChartDragDrop");
		jQuery(document.body).unbind("mouseup.ganttChartDragDrop");
		jQuery(document.body).removeClass("sapGanttDraggingCursor");
		this._setEventStatus("shapeDragEnd");
	};
	
	GanttChart.prototype._collectDraggingShapeData = function (oDraggingSource, oEvent) {
		var aSvg = jQuery("#" + this.getId() + "-svg");
		var x = oEvent.pageX - aSvg.offset().left || oEvent.offsetX;
		var sStartPointX = oDraggingSource.dragStartPoint.x;
		var iDragDistance = parseInt(x, 10) - parseInt(sStartPointX, 10);
		var sShapeCurrentStartX = parseInt(oDraggingSource.dragStartPoint.shapeX, 10) + iDragDistance;
		var sShapeCurrentEndX = sShapeCurrentStartX + parseInt(oDraggingSource.dragStartPoint.shapeWidth, 10);
		var sNewStartTime, sNewEndTime;
		if (Core.getConfiguration().getRTL() === true) {
			sNewStartTime = Format.dateToAbapTimestamp(this._oAxisTime.viewToTime(sShapeCurrentEndX));
			sNewEndTime = Format.dateToAbapTimestamp(this._oAxisTime.viewToTime(sShapeCurrentStartX));
		} else {
			sNewStartTime = Format.dateToAbapTimestamp(this._oAxisTime.viewToTime(sShapeCurrentStartX));
			sNewEndTime = Format.dateToAbapTimestamp(this._oAxisTime.viewToTime(sShapeCurrentEndX));
		}
		/*
		 * Only Update the clicking shape data with the row object at the current point
		 * keep other shape data as the same as they are in sourceshapedata
		 */
		var param = this._composeParameterForClickPosition(oEvent);
		var rowInfo = param ? param.rowInfo : undefined;
		oDraggingSource.targetData = {
			"mouseTimestamp": {startTime: sNewStartTime, endTime: sNewEndTime},
			"mode": this.getMode(),
			"objectInfo": rowInfo
		};
	};

	/*
	 * set draggingSource when a drag is from outside of the current chart
	 */
	GanttChart.prototype.setDraggingData = function (oDraggingSource) {
		this._oDraggingData = oDraggingSource;
		if (this._oDraggingData !== undefined) {
			this._oDraggingData.targetSvgId = this.getId();
			jQuery(document.body).unbind("mousemove.ganttChartDragDrop");
			jQuery(document.body).unbind("mouseup.ganttChartDragDrop");
			jQuery(document.body).bind("mousemove.ganttChartDragDrop", this._handleShapeDragging.bind(this));
			jQuery(document.body).bind("mouseup.ganttChartDragDrop", this._handleShapeDragEnd.bind(this));
			this._setEventStatus("dragEnter");
		}
	};

	GanttChart.prototype._onTTHScrollAfterRendering = function () {
		this._updateScrollLeft(true);
		var $hsb = jQuery(this._oTT.getDomRef(sap.ui.table.SharedDomRef.HorizontalScrollBar));
		$hsb.unbind("scroll.sapUiTableHScroll");
		$hsb.unbind("scroll.sapUiTableHScrollForGanttChart", this._onHSbScroll);
		$hsb.bind("scroll.sapUiTableHScrollForGanttChart", jQuery.proxy(this._onHSbScroll, this));
	};
	
	GanttChart.prototype._getSvgHeight = function () {
		return this._oTT.$().find(".sapUiTableCCnt").height();
	};
	
	/*
	 * For internal use, called by GanttChartWithTable
	 */
	GanttChart.prototype._getRowHeights = function () {
		return this._aHeights;
	};
	
	GanttChart.prototype.setBaseRowHeight = function (nBaseRowHeight) {
		this.setProperty("baseRowHeight", nBaseRowHeight);
		this._oTT.setRowHeight(nBaseRowHeight);
	};
	
	GanttChart.prototype._setInferedBaseRowHeight = function (nInferedBaseRowHeight) {
		this._iInferedBaseRowHeight = nInferedBaseRowHeight;
	};
	
	GanttChart.prototype.getBaseRowHeight = function () {
		/*
		 * _iInferedBaseRowHeight is base row height of left panel,
		 * its value is given by GanttChartWithTable through calling _setInferedBaseRowHeight.
		 * _iInferedBaseRowHeightOnTT value is base row height of tree table inside GanttChart,
		 * its value is given during _collectRowHeights.
		 * _iInferedBaseRowHeight is used if available, otherwise using _iInferedBaseRowHeightOnTT,
		 * because left panel has higher row height than right at times
		 */
		
		return this._iInferedBaseRowHeight ? this._iInferedBaseRowHeight : this._iInferedBaseRowHeightOnTT;
	};
	
	GanttChart.prototype._initialSvgDrawing = function () {
		if (this.getBaseRowHeight() && this._iSvgHeight != this._getSvgHeight()) {
			this._iSvgHeight = this._getSvgHeight();
			this._bTableReady = true;

			var oContext = this._oTT.getContextByIndex(0);
			var oContextObject = oContext ? oContext.getObject() : undefined;
			var sUid = oContextObject ? oContextObject.uid : undefined;

			this._onTTRowUpdate(true);
			//At this time, the expaned row may not render correctly if uid is missing, so we have to update it again
			if (!sUid){
				this._oTT.updateRows();
			}
		}
	};

	GanttChart.prototype._onHSbScroll = function (oEvent) {
		var $hsb = this._oTT.$(sap.ui.table.SharedDomRef.HorizontalScrollBar);
		//Firefox scrollLeft doesn't work in RTL mode if passing positive number, must use scrollLeftRTL or passing negative number to scrollLeft()
		//To make the algorithm consistent, use scrollLeftRTL
		var nScrollLeft = (Core.getConfiguration().getRTL() && Device.browser.firefox) ? $hsb.scrollLeftRTL() : $hsb.scrollLeft();
		this.updateLeftOffsetRate(nScrollLeft);
		this._draw(false);
		if (this._scrollFlag) {
			delete this._scrollFlag;
			return;
		}
		this.fireHorizontalScroll({
			scrollSteps: nScrollLeft,
			leftOffsetRate: this._fLeftOffsetRate
		});
	};
	
	GanttChart.prototype._onVSbScroll = function () {
		this._bSelectedStatusUpdated = true;
		if (!this._mTimeouts._drawSvg) {
			this.$().find(".sapGanttChartSvg").css("transform", "translateY(" + (-this._oTT.$().find(".sapUiTableCCnt").scrollTop()) + "px)");
		}

		this.fireVerticalScroll({
			scrollSteps: this._oTT.getFirstVisibleRow(),
			scrollPosition: jQuery(this._oTT.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar)).scrollTop()
		});
	};

	GanttChart.prototype._hSbScrollLeft = function (nScrollPosition) {
		var $chartBodySvgCnt = jQuery("#" + this.getId() + "-svg-ctn");
		var $chartHeaderSvgCnt = jQuery("#" + this.getId() + "-header");
		var nScrollLeft;
		if (Core.getConfiguration().getRTL() === true) {
			//Header and Body should have same width. Use header to calculate the scroll position in RTL mode
			nScrollLeft = this._oStatusSet.aViewBoundary[1] - $chartHeaderSvgCnt.width() - nScrollPosition;
			if ( nScrollLeft < 0 ) {
				nScrollLeft = 0;
			}
		} else {
			nScrollLeft = nScrollPosition;
		}

		//scroll divs
		if (Core.getConfiguration().getRTL() === true && Device.browser.firefox) {
			if (Math.abs($chartBodySvgCnt.scrollLeftRTL() - nScrollLeft) > 1) {
				$chartBodySvgCnt.scrollLeftRTL(nScrollLeft);
			}
			if (Math.abs($chartHeaderSvgCnt.scrollLeftRTL() - nScrollLeft) > 1) {
				$chartHeaderSvgCnt.scrollLeftRTL(nScrollLeft);
			}
		} else {
			if (Math.abs($chartBodySvgCnt.scrollLeft() - nScrollLeft) > 1) {
				$chartBodySvgCnt.scrollLeft(nScrollLeft);
			}
			if (Math.abs($chartHeaderSvgCnt.scrollLeft() - nScrollLeft) > 1) {
				$chartHeaderSvgCnt.scrollLeft(nScrollLeft);
			}
		}

	};

	GanttChart.prototype.updateLeftOffsetRate = function(nPosition, nContentWidth) {
		//ie, ff, and cr are different in scroll bar handling in RTL mode.
		//ie: The scrollLeft() of scroll bar returns 0 if the scroll bar indicator is at the most right side.
		//It means in ie, the scrollLeft returns the width of the hidden DOM element which is at the right of the scroll bar
		//cr: The scrollLeft() of scroll bar returns 0 if the scroll bar indicator is at the most left side
		//It means in cr, the scrollLeft returns the width of the hidden DOM element which is at the left of the scroll bar
		//ff: The scrollLeft() returns negative value. The scrollLeftRTL() returns positive value.
		//To keep the fLeftOffsetRate value consistent, the fLeftOffsetRate always means 
		// (The width of hidden part at the left of scroll bar) / ( The total width - the visible width of the chart )
		//So for 3 browsers, the handling are all different:
		//ie: we doesn't use the value of scrollLeft() directly, because in ie, scrollLeft() returns the hidden part at right of scroll bar, do the conversion for ie
		//cr: no special handling;
		//ff: before call updateLeftOffsetRate, use the scrollLeftRTL() to get the value and pass it to nPosition
		var sHsb = sap.ui.table.SharedDomRef.HorizontalScrollBar;
		var nScrollWidth = nContentWidth ? nContentWidth : parseInt(this._oTT.$(sHsb + "-content").width(), 0);
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width() - ((Core.getConfiguration().getRTL()) ? 0 : this._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar).width());
		if (nScrollWidth - nClientWidth !== 0) {
			if (Core.getConfiguration().getRTL() === true && Device.browser.msie) {
				this._fLeftOffsetRate = (nScrollWidth - nPosition - nClientWidth) / (nScrollWidth - nClientWidth);
			} else {
				this._fLeftOffsetRate = nPosition / (nScrollWidth - nClientWidth);
			}
			this._fLeftOffsetRate = this._fLeftOffsetRate < 0 ? 0 : this._fLeftOffsetRate;
			this._fLeftOffsetRate = this._fLeftOffsetRate > 1 ? 1 : this._fLeftOffsetRate;
		}
		return this._fLeftOffsetRate;
	};

	GanttChart.prototype.jumpToPosition = function(value) {
		if (!isNaN(value) && !(value instanceof Date) && !(value instanceof Array)) {
			// when input parameter "value" is float value which means left offset rate
			this._fLeftOffsetRate = value;
			this._updateScrollLeft();
			return;
		}
		
		if (value instanceof Date) {
			// when value is Date format
			this._oDateToJump = [value];
			this._draw(false);
			return;
		}
		
		if (value instanceof Array) {
			// when value is an array which consists of two dates
			this._oDateToJump = value;
			this._draw(false);
			return;
		}
		
		// when value is null or undefined, then jump to initHorizon
		this._oDateToJump = [null];
		this._draw(false);
	};

	GanttChart.prototype._onTTRowUpdate = function () {
		if (this._bTableReady) {
			this._syncSvgHeightWithTT();
			this._syncSvgDataWithTT();
			this._draw(true);
		}
	};

	GanttChart.prototype._updateDataString = function () {
		var sShapeData = JSON.stringify(this._aFilteredRowData, function(key, value) {
			if (key === "bindingObj" || key === "contextObj") {
				return undefined;
			}
			return value;
		});
		if (this._sShapeData && sShapeData === this._sShapeData) {
			this._sShapeData = sShapeData;
			return false;
		} else {
			this._sShapeData = sShapeData;
			return true;
		}
	};

	GanttChart.prototype._syncSvgHeightWithTT = function () {
		var $svgCtn = this.$().find(".sapGanttChartSvgCtn");
		$svgCtn.height(this._getSvgHeight());
		var $svg = this.$().find(".sapGanttChartSvg");
		$svg.height(this._oTT.$().find(".sapUiTableCtrlRowScroll").height());
//		$svg.height(this._getSvgHeight());
	};

	GanttChart.prototype._syncSvgDataWithTT = function () {
		var oBinding = this._oTT.getBinding("rows");
		if (!oBinding) {
			return false;
		}
		var bJSONTreeBinding = oBinding.getMetadata().getName() === "sap.ui.model.json.JSONTreeBinding";
		
		var iFirstVisibleRow = this._oTT.getFirstVisibleRow();
		var iVisibleRowCount = this._getVisibleRowCount();
		
		// structured data for drawing by D3
		this._aFilteredRowData = [];
		this._aNonVisibleShapeData = [];
		// temporary variables
		var _aTopNonVisibleShapeData = [];
		var _aBottomNonVisibleShapeData = [];
		// default visible range
		var aVisibleRange = [iFirstVisibleRow, iFirstVisibleRow + iVisibleRowCount - 1];
		var bIfRelationshipsExist = this._aRelationshipsContexts && this._aRelationshipsContexts.length > 0;
		var aShapeDataNames = this.getShapeDataNames();

		if (bJSONTreeBinding) {
			//aVisibleRange = this._prepareVerticalDrawingRange();
			
			if (bIfRelationshipsExist) {
				oBinding.getContexts(0, 0);// get all contexts
				
				if (iFirstVisibleRow > 0) {
					_aTopNonVisibleShapeData = this._getDrawingData([0, iFirstVisibleRow - 1]);
				}
				_aBottomNonVisibleShapeData = this._getDrawingData([iFirstVisibleRow + iVisibleRowCount, oBinding.getLength() - 1]);
			
				oBinding.getContexts(aVisibleRange[0], aVisibleRange[1]);// get contexts of visible area
			}
			
			this._aFilteredRowData = this._getDrawingData(aVisibleRange);
		} else {
			if (bIfRelationshipsExist) {
				// oBinding.getContexts(0, 0) returns all contexts so we have to check whether iFirstVisibleRow is larger than 0
				if (iFirstVisibleRow > 0) {
					_aTopNonVisibleShapeData = this._createRowDataForODataModel(oBinding.getContexts(0, iFirstVisibleRow));
				}
				_aBottomNonVisibleShapeData = this._createRowDataForODataModel(oBinding.getContexts(iFirstVisibleRow + iVisibleRowCount, oBinding.getLength()));
			}
			
			// row contexts of the visible area
			// IMPORTANT: this must be called after getting the row contexts of non visible because Table._aRowIndexMap is refreshed every time when getContexts is called.
			var aRowContext = oBinding.getContexts(iFirstVisibleRow, iVisibleRowCount);
			this._aFilteredRowData = this._createRowDataForODataModel(aRowContext);
			
			// enhance row data
			Utility.generateRowUid(this._aFilteredRowData, this._oObjectTypesConfigMap, aShapeDataNames);
		}
		
		// merge _aTopNonVisibleShapeData with _aBottomNonVisibleShapeData
		this._aNonVisibleShapeData = _aTopNonVisibleShapeData.concat(_aBottomNonVisibleShapeData);

		//For performance perspective, don't generate uid for non visible rows.
		//Utility.generateRowUid(this._aNonVisibleShapeData, this._oObjectTypesConfigMap, aShapeDataNames);	// +uid
		if (!this._bSelectedStatusUpdated) {// make sure that call it only 1 time after Model.setData()
			this._setSelectedStatusFromData(aShapeDataNames, this._aFilteredRowData);
		}

		var iBaseRowHeight = this.getBaseRowHeight();
		if (!iBaseRowHeight) {
			iBaseRowHeight = 0;
		}
		this._oAxisOrdinal = this._createAxisOrdinal(this._aFilteredRowData, iBaseRowHeight, 0);
		
		// this._replaceDataRef(); // replace ref --TODO: move this logic to app
		this._cacheObjectPosition(this._aFilteredRowData, this._oAxisOrdinal);	// +y, +rowHeight
		this._cacheObjectPosition(_aTopNonVisibleShapeData, this._oAxisOrdinal, true);	// +y, +rowHeight
		this._cacheObjectPosition(_aBottomNonVisibleShapeData, this._oAxisOrdinal, false);	// +y, +rowHeight

		if (!this._aVisibleRange || this._aVisibleRange[0] !== aVisibleRange[0] || this._aVisibleRange[1] !== aVisibleRange[1]) {
			this._aVisibleRange = aVisibleRange;
			return true;
		}

		return false;
	};
	
	/*
	 * Creates row data array for the given row contexts via OData binding way.
	 */
	GanttChart.prototype._createRowDataForODataModel = function (aRowContexts) {
		var aShapeDataNames = this.getShapeDataNames();
		var oBinding = this._oTT.getBinding("rows");
		var oModel = oBinding.getModel();

		var aRowData = [];

		for (var i = 0; i < aRowContexts.length; i++) {
			if (aRowContexts[i] != undefined) {
				var oRowData = {
						"bindingObj": oBinding,
						"contextObj": aRowContexts[i],
						"data": aRowContexts[i].getObject(),
						"id": aRowContexts[i].getObject().id,
						"rowIndex": i
					};
				// for shape data, we support below cases:
				// 1. no shape classes set shapeDataName, then row data will be used as shape data;
				// 2. all shape classes set shapeDataName, then shape classes consume shape data;
				// mixture: some shape classes set shapeDataName and some don't, this is NOT supported.
				if (aShapeDataNames && aShapeDataNames.length > 0) {
					for (var j = 0; j < aShapeDataNames.length; j++) {
						var sShapeName = aShapeDataNames[j];//e.g. 'Header'
						var aShapeDataPath = aRowContexts[i].getProperty(sShapeName);//e.g. ["HeaderDetail('0%20')","HeaderDetail('48%20')"]
						var oShapeData;
						if (aShapeDataPath) {
							oRowData.data[sShapeName] = [];
							for (var k = 0; k < aShapeDataPath.length; k++) {
								var sShapeDataPath = aShapeDataPath[k];
								//aShapeDataPath may have already been shape data objects
								if (typeof sShapeDataPath === "string") {
									oShapeData = oModel.getData("/" + sShapeDataPath);
								} else {
									oShapeData = sShapeDataPath;
								}
								oRowData.data[sShapeName].push(oShapeData);
							}
						}
					}
				}
				aRowData.push(oRowData);
			}
		}
		return aRowData;
	};
	
	/*
	 * Calculate [rowHeight] and [y] property for each object based on a given axisY
	 * @param {object[]} objects Shape data array for whose entity we will add y and rowHeight properties to.
	 * @param {object} axisY AxisOrdinal object.
	 * @param {boolean} bAboveOrUnderVisibleArea Optional. Only used for drawing elements in the non visible area.
	 * 		if undefined, means the objects are in the visible area
	 * 		if true, means the objects are above the visible area, then y are -100
	 * 		if false, means the objects are under the visible area, then y are axisY.getViewRange()[1]+100
	 * @return undefined
	 */
	GanttChart.prototype._cacheObjectPosition = function (objects, axisY, bAboveVisibleArea) {
		if (objects && objects.length > 0) {
			if (bAboveVisibleArea === true) {
				for (var i = 0; i < objects.length; i++) {
					objects[i].y = -100;
					objects[i].rowHeight = axisY.getViewBandWidth();
				}
			} else if (bAboveVisibleArea === false) {
				for (var j = 0; j < objects.length; j++) {
					objects[j].y = axisY.getViewRange()[1] + 100;
					objects[j].rowHeight = axisY.getViewBandWidth();
				}
			} else {
				var aVisibleRow = [];
				var aVisibleRowSpan = [];
				for (var k = 0; k < objects.length; k++) {
					objects[k].y = axisY.elementToView(objects[k].uid);

					if (k > 0) {
						objects[k - 1].rowHeight = objects[k].y - objects[k - 1].y;
					}

					if (objects[k].visibleRowSpan) {
						objects[k].visibleRowHeight = objects[k].visibleRowSpan * axisY.getViewBandWidth();
						aVisibleRow.push(objects[k].uid);
						aVisibleRowSpan.push(objects[k].visibleRowSpan);
					}
				}
				objects[objects.length - 1].rowHeight = axisY.getViewRange()[1] - objects[objects.length - 1].y;
				this._oAxisOrdinalOfVisibleRow = new AxisOrdinal(aVisibleRow, aVisibleRowSpan, this.getBaseRowHeight(), 0);
			}
		}
	};
	
	/*
	 * Loop this._aRelationshipsContexts and call getObject method on each entity and then push the value into this._aRelationships
	 */
	GanttChart.prototype._prepareRelationshipDataFromModel = function () {
		this._aRelationships = [];
		if (this._aRelationshipsContexts) {
			for (var i = 0; i < this._aRelationshipsContexts.length; i++) {
				var oRelationship = this._aRelationshipsContexts[i].getObject();
				if (oRelationship !== undefined) {
					this._aRelationships.push(oRelationship);
				}
			}
		}
		Utility.generateUidByShapeDataName(this._aRelationships, "relationship"); // +uid for relationships
	};

	GanttChart.prototype._createAxisOrdinal = function (aShapeData, iBaseRowHeight, fShift) {
		var aRowNames = aShapeData.map(function (oRow) {
			return oRow.uid;
		});
		var aRowHeights = aShapeData.map(function (oRow) {
			if (oRow.rowSpan) {
				return oRow.rowSpan;
			} else {
				//For blank rows in hierarchy, just return 1, since there is no place to specify its rowSpan now...
				return 1;
			}
		});

		return new AxisOrdinal(aRowNames, aRowHeights, iBaseRowHeight, fShift);
	};

	GanttChart.prototype.getFilteredRowData = function(aRange) {
		return this._aFilteredRowData;
	};

	GanttChart.prototype._getDrawingData = function(aRange) {
		var fAddDataToExpandedRows = function(aExpandedRows, index, sDataType, oData) {
			if (!aExpandedRows[index]) {
				aExpandedRows.push({});
			} 
			if (!aExpandedRows[index][sDataType]) {
				aExpandedRows[index][sDataType] = [];
			}
			aExpandedRows[index][sDataType].push(oData);
		};

		var i, j, k, l, oRow, sChartScheme;
		var oBinding = this._oTT.getBinding("rows");
		var oBindingInfo = this._oTT.getBindingInfo("rows");
		var aRowList = [];
		var aShapeDataNames = this.getShapeDataNames();
		for (i = aRange[0]; i <= aRange[1]; i++) {
			var oContext = this._oTT.getContextByIndex(i);
			if (!oContext) {
				continue;
			} else {
				oRow = oContext.getObject();
				if (!oRow){
					continue;
				}
			}
			var rowSpan = 1;
			sChartScheme = this._oObjectTypesConfigMap[oRow.type] ?
				this._oObjectTypesConfigMap[oRow.type].getMainChartSchemeKey() :
				sap.gantt.config.DEFAULT_CHART_SCHEME_KEY;
			if (oRow.type) {
				var oChartScheme = this._oChartSchemesConfigMap[sChartScheme];
				if (oChartScheme) {
					rowSpan = oChartScheme.getRowSpan();
				}
			}
			var mainRow = {
					"bindingObj": oBinding,
					"bindingInfo": oBindingInfo,
					"contextObj": oContext,
					"data": oRow,
					"id": oRow.id,
					"rowSpan": rowSpan,
					"chartScheme": sChartScheme,
					"rowIndex": i,
					"index": 0,
					"visibleRowSpan": rowSpan
				};

			Utility.generateRowUid([mainRow], this._oObjectTypesConfigMap, aShapeDataNames);
			aRowList.push(mainRow);
			
			// for expanded row
			var sUid = oRow.uid;
			if (sUid && this._oRowStatusMap[sUid]) {
				for (sChartScheme in this._oRowStatusMap[sUid]) {
					var sMode;
					if (this._oChartSchemesConfigMap[sChartScheme] && this._oChartSchemesConfigMap[sChartScheme].getModeKey() && this._oChartSchemesConfigMap[sChartScheme].getModeKey() !== sap.gantt.config.DEFAULT_MODE_KEY) {
						sMode = this._oChartSchemesConfigMap[sChartScheme].getModeKey();
					} else {
						sMode = this.getMode();
					}
					var oSchemeInfo = this._collectDataNameForValidChartScheme(sChartScheme, sMode);
					if (oSchemeInfo && oSchemeInfo.drawData) {
						var maxIndex = 0;
						var aExpandedRows = [{}];
						//get the maximum number of valid expanded row
						for (j = 0; j < oSchemeInfo.drawData.length; j++) {
							if (!oRow[oSchemeInfo.drawData[j]]) {
								continue;
							}
							for (k = 0; k < oRow[oSchemeInfo.drawData[j]].length; k++) {
								var iRowIndex = oRow[oSchemeInfo.drawData[j]][k].rowIndex;
								if (iRowIndex && maxIndex < iRowIndex){
									maxIndex = iRowIndex;
								}
							}
						}
						
						//only if there is valid data to expand
						if (maxIndex > 0) {
							for (j = 0; j < oSchemeInfo.drawData.length; j++) {
								if (!oRow[oSchemeInfo.drawData[j]]) {
									continue;
								}
								for (k = 0; k < oRow[oSchemeInfo.drawData[j]].length; k++) {
									var index = oRow[oSchemeInfo.drawData[j]][k].rowIndex;
									if (index) {
										fAddDataToExpandedRows(aExpandedRows, index, oSchemeInfo.drawData[j], oRow[oSchemeInfo.drawData[j]][k]);
									} else {
										//check for data without valid row index, put them in all expanded rows
										for (l = 1; l <= maxIndex; l++) {
											fAddDataToExpandedRows(aExpandedRows, l, oSchemeInfo.drawData[j], oRow[oSchemeInfo.drawData[j]][k]);
										}
									}
								}
							}

							for (j = 1; j <= maxIndex; j++) {
								var oExpandedRow = {
									"bindingObj": oBinding,
									"bindingInfo": oBindingInfo,
									"data": aExpandedRows[j],
									"id":  oRow.id,
									"parentId": mainRow.id,
									"rowSpan": oSchemeInfo.rowSpan,
									"chartScheme": sChartScheme,
									"rowIndex": i,
									"index": j, // > 0
									"icon": this._oChartSchemesConfigMap[sChartScheme].getIcon(),
									"closeIcon": "./image/closeChart.png",
									"name": this._oChartSchemesConfigMap[sChartScheme].getName()
								};
								Utility.generateRowUid([oExpandedRow], this._oObjectTypesConfigMap, aShapeDataNames);
								aRowList.push(oExpandedRow);
								mainRow.visibleRowSpan += oSchemeInfo.rowSpan;
							}
							
						}
					}
				}
				this._oRowStatusMap[sUid].visibleRowSpan = mainRow.visibleRowSpan;
			}
		}
		return aRowList;
	};

	GanttChart.prototype._prepareVerticalDrawingRange = function() {
		var nLastBindingRow = this._oTT.getBinding("rows").getLength() - 1;
		if (nLastBindingRow < 0) {
			return [0, -1];
		}
		var nFirstVisibleRow = this._oTT.getFirstVisibleRow();
		var nLastVisibleRow = nFirstVisibleRow + this._getVisibleRowCount() - 1;
		var nFirstDrawingRow = nFirstVisibleRow;
		var nLastDrawingRow = nLastVisibleRow < nLastBindingRow ? nLastVisibleRow : nLastBindingRow;
		return [nFirstDrawingRow, nLastDrawingRow];
	};

	GanttChart.prototype._prepareHorizontalDrawingRange = function () {
		//oStatusSet must keep the value of LTR mode because other functions use it
		var nContentWidth = this._nUpperRange - this._nLowerRange;
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width() - ((Core.getConfiguration().getRTL()) ? 0 : this._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar).width());
		
		if (!this._oStatusSet) {
			this._updateScrollWidth();
		}
		
		var nScrollLeft = Math.ceil((this._fLeftOffsetRate ? this._fLeftOffsetRate : 0) * (nContentWidth - nClientWidth));
		if (this._oStatusSet) {
			if ((nClientWidth >= nContentWidth || (this._oStatusSet.aViewBoundary[0] <= nScrollLeft - this._oStatusSet.nOffset &&
				this._oStatusSet.aViewBoundary[1] >= nScrollLeft + nClientWidth - this._oStatusSet.nOffset))) {
				if (!this._mTimeouts._drawSvg) {
					this._scrollSvg();
				}
				
				return false;
			}
		}

		var nWidth = nClientWidth * (1 + this._fExtendFactor * 2);
		var nOffset = nScrollLeft - nClientWidth * this._fExtendFactor;
		if (nOffset < this._nLowerRange) {
			nWidth += nOffset;
			nOffset = 0;
		}
		if (nOffset + nWidth > this._nUpperRange) {
			nWidth = this._nUpperRange - nOffset;
		}

		this._oAxisTime.setViewOffset(nOffset);
		this._oStatusSet = {
				nWidth: nWidth,
				nOffset: nOffset,
				nScrollLeft: nScrollLeft,
				aViewBoundary: [0, nWidth],
				aTimeBoundary: [this._oAxisTime.viewToTime(0), this._oAxisTime.viewToTime(nWidth)],
				bRTL: Core.getConfiguration().getRTL()
		};

		return true;
	};

	GanttChart.prototype._updateZoomAndScrollInfo = function (oZoomInfo) {
		if (!this._oDateToJump) {
			return;
		}
		
		var nContentWidth = this._nUpperRange - this._nLowerRange;
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width() - ((Core.getConfiguration().getRTL()) ? 0 : this._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar).width());
		var oDateToJump = this._oDateToJump[0];
		if (!this._oDateToJump[0]) {
			if (!oZoomInfo.determinedByChartWidth.fSuitableRate) {
				this._oDateToJump = null;
				return;
			}
			oZoomInfo.determinedByConfig.fRate = oZoomInfo.determinedByChartWidth.fSuitableRate;
			var oInitHorizon = this.getTimeAxis().getInitHorizon();
			oDateToJump = Format.abapTimestampToDate(oInitHorizon.getStartTime());
		} else if (this._oDateToJump[1]) {
			var fJumpScale = this._calZoomScale(this._oDateToJump[0], this._oDateToJump[1], nClientWidth);
			var fJumpRate = oZoomInfo.base.fScale / fJumpScale;
			oZoomInfo.determinedByConfig.fRate = oZoomInfo.determinedByChartWidth.fMinRate > fJumpRate ? this._oZoom.determinedByChartWidth.fMinRate : fJumpRate;
			oDateToJump = this._oDateToJump[0];
		}
		var nDatePosition;
		if (Core.getConfiguration().getRTL() === true) {
			if (Device.browser.msie) {
				//Refer to the comments in updateLeftOffsetRate. Convert the the x value to nScrollLeft for ie
				nDatePosition = nContentWidth - this._oAxisTime.timeToView(oDateToJump) - this._oAxisTime.getViewOffset();
			} else {
				nDatePosition = this._oAxisTime.timeToView(oDateToJump) + this._oAxisTime.getViewOffset() - nClientWidth;
			}
			nDatePosition = nDatePosition < 0 ? 0 : nDatePosition;
		} else {
			nDatePosition = this._oAxisTime.timeToView(oDateToJump) + this._oAxisTime.getViewOffset();
		}
		this.updateLeftOffsetRate(nDatePosition, nContentWidth);

		this._oDateToJump = null;
	};
	
	GanttChart.prototype._draw = function (bForced) {
		if (!this._bTableReady) {
			return;
		}
		
		var nContentWidth = this._nUpperRange - this._nLowerRange;
		if (nContentWidth <= 2) {
			return;
		}
		
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width() - ((Core.getConfiguration().getRTL()) ? 0 : this._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar).width());
		if (!nClientWidth || nClientWidth <= 0 || nClientWidth > document.body.clientWidth) {
			return;
		}
		
		var fLastRate = this._oZoom.determinedByConfig.fRate;
		var oLastDeterminedByChartWidth = this._oZoom.determinedByChartWidth;
		var oZoomInfo = this.getZoomInfo();
		this._updateZoomAndScrollInfo(oZoomInfo);
		if (oZoomInfo && oZoomInfo.determinedByChartWidth) {
			if (!oLastDeterminedByChartWidth
				|| !Utility.floatEqual(fLastRate, oZoomInfo.determinedByConfig.fRate)
				|| !Utility.floatEqual(oLastDeterminedByChartWidth.fMinRate, oZoomInfo.determinedByChartWidth.fMinRate)) {
				this.fireEvent("_zoomInfoUpdated", {zoomInfo: oZoomInfo});
			}
			if (!fLastRate
				|| !Utility.floatEqual(fLastRate, oZoomInfo.determinedByConfig.fRate)
				|| !Utility.floatEqual(this._oAxisTime.getZoomRate(), oZoomInfo.determinedByConfig.fRate)) {
				this.setTimeZoomRate(oZoomInfo.determinedByConfig.fRate);
				return;
			}
		}
		
		if (!this._prepareHorizontalDrawingRange() && !bForced) {
			return;
		}
		
		this._updateTableRowHeights();
		var that = this;
		
		this._mTimeouts._drawSvg = this._mTimeouts._drawSvg || window.setTimeout(function() {
			that._drawSvg();
		}, 0);
	};

	GanttChart.prototype._updateScrollWidth = function () {
		var nContentWidth = this._nUpperRange - this._nLowerRange;
		this._oColumn.setWidth((nContentWidth - 2) + "px");
	};

	GanttChart.prototype._updateScrollLeft = function (bNeedScrollSync) {
		var sHsb = sap.ui.table.SharedDomRef.HorizontalScrollBar;
		var $hsb = this._oTT.$(sHsb);
		var $content = this._oTT.$(sHsb + "-content");
		var nScrollWidth = parseInt($content.width(), 0);
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width() - ((Core.getConfiguration().getRTL()) ? 0 : this._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar).width());
		var nScrollLeft = Math.ceil((this._fLeftOffsetRate ? this._fLeftOffsetRate : 0) * (nScrollWidth - nClientWidth)); 
		if ((Core.getConfiguration().getRTL() === true && Device.browser.msie)) {
			nScrollLeft = nScrollWidth - nScrollLeft - nClientWidth;
		}
		if ((Core.getConfiguration().getRTL() === true && Device.browser.firefox)) {
			if (Math.abs($hsb.scrollLeftRTL() - nScrollLeft) > 1) {
				this._scrollFlag = bNeedScrollSync ? undefined : true;
				$hsb.scrollLeftRTL(nScrollLeft);
			}
		} else if (Math.abs($hsb.scrollLeft() - nScrollLeft) > 1) {
			this._scrollFlag = bNeedScrollSync ? undefined : true;
			$hsb.scrollLeft(nScrollLeft);
		}
	};

	GanttChart.prototype._scrollSvg = function () {
		var $svg = jQuery("#" + this.getId() + "-svg");
		var $header = jQuery("#" + this.getId() + "-header-svg");
		if (Math.abs(this._oStatusSet.nWidth - $svg.width()) > 1) {
			//change the set width logic
			$svg.width(this._oStatusSet.nWidth + ((Core.getConfiguration().getRTL()) ? 0 : this._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar).width()));
		}
		if (Math.abs(this._oStatusSet.nWidth - $header.width()) > 1) {
			$header.width(this._oStatusSet.nWidth + ((Core.getConfiguration().getRTL()) ? 0 : this._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar).width()));
		}
		var nContentWidth = this._nUpperRange - this._nLowerRange;
		var nClientWidth = jQuery("#" + this.getId() + "-svg-ctn").width() - ((Core.getConfiguration().getRTL()) ? 0 : this._oTT.$(sap.ui.table.SharedDomRef.VerticalScrollBar).width());
		var nScrollLeft = Math.ceil((this._fLeftOffsetRate ? this._fLeftOffsetRate : 0) * (nContentWidth - nClientWidth));
		if (Core.getConfiguration().getRTL() === true && !Device.browser.msie) {
			//Refer to comments in updateLeftOffsetRate, since the scrollLeft() in RTL in ie already returns the value of hidden part at right, 
			//so no special handling for ie in RTL here.
			this._hSbScrollLeft(this._oStatusSet.nOffset - nScrollLeft + this._oStatusSet.nWidth - nClientWidth);
		} else {
			this._hSbScrollLeft(nScrollLeft - this._oStatusSet.nOffset);
		}
	};

	GanttChart.prototype._drawSvg = function () {
		jQuery.sap.measure.start("GanttChart _drawSvg","GanttPerf:GanttChart _drawSvg function");

		// before draw
		this._updateScrollLeft();
		jQuery("#" + this.getId() + "-svg-ctn").css("visibility", "hidden");
		this._scrollSvg();
		jQuery("#" + this.getId() + "-svg-ctn").css("visibility", "visible");
		this._sUiSizeMode = Utility.findSapUiSizeClass(this);

		// draw
		this._drawCalendarPattern();
		this._drawHeader();
		this._drawNowLine();
		this._drawVerticalLine();
		this._drawExpandedBackground();
		this._drawShapes();
		this._drawSelectedShapes(true);

		// after draw
		delete this._mTimeouts._drawSvg;
		this.$().find(".sapGanttChartSvg").css("transform", "translateY(" + (-this._oTT.$().find(".sapUiTableCCnt").scrollTop()) + "px)");
		this.fireEvent("_shapesUpdated", {aSvg: jQuery("#" + this.getId() + "-svg")});
		this._iFirstVisiableRowIndex = this._oTT.getFirstVisibleRow();
		this._bCanApplyTableTransform = true;

		//used this._bSelectedStatusUpdated to determine if updating selected status from data is needed,
		//so reset it in onBeforeRendering to make sure status updated correctly every time App re-sets Model/Data
		this._bSelectedStatusUpdated = undefined;
		
		jQuery.sap.measure.end("GanttChart _drawSvg");
	};

	GanttChart.prototype._drawHeader = function () {
		var $headerDom = jQuery(this.getDomRef()).find(".sapGanttChartHeader");
		var nSvgHeight = $headerDom.height();

		var oHeaderSvg = d3.select(jQuery(this.getDomRef()).find(".sapGanttChartHeaderSvg").get(0));
		oHeaderSvg.attr("height", nSvgHeight);

		// Split the total SVG height as 5 parts for drawing 
		// label0 (MM YYYY), label1 (DD) and vertical line (|)
		var nfirstRowYOffset = nSvgHeight / 5 * 2;
		var nMiddleLineYOffset = nSvgHeight / 5 * 4;
		var nSecondRowYOffset = nSvgHeight / 5 * 4;

		var aLabelList = this.getAxisTime().getTickTimeIntervalLabel(
				this.getAxisTime().getCurrentTickTimeIntervalKey(), null, [0, this._oStatusSet.nWidth]);

		// append group
		oHeaderSvg.selectAll("g").remove();
		var oGroupSvg = oHeaderSvg.append("g");

		// append text for labels on first row
		oGroupSvg.selectAll("label0")
			.data(aLabelList[0])
			.enter()
			.append("text")
			.classed("sapGanttTimeHeaderSvgText0", true)
			.text(function (d) {
				return d.label;
			}).attr("x", function (d) {
				return d.value;
			}).attr("y", function (d) {
				return nfirstRowYOffset;
			}).attr("text-anchor",  "start");

		// append text for labels on second row
		oGroupSvg.selectAll("label1")
			.data(aLabelList[1])
			.enter()
			.append("text")
			.classed("sapGanttTimeHeaderSvgText1", true)
			.text(function (d) {
				return d.label;
			}).attr("x", function (d) {
				// 5px spacing for the text
				return d.value + (Core.getConfiguration().getRTL() ? -5 : 5);
			}).attr("y", function (d) {
				return nSecondRowYOffset;
			});

		oHeaderSvg.selectAll(".sapGanttChartHeader .sapGanttTimeHeaderSvgText1")
			.each(function(d,i) {
				d3.select(this).append("title")
				.text(function (d) {
					return d.largeLabel;
				});
			});

		//IE can't render SVG text in rtl situation.This IE bug has not been fixed (developer.microsoft.com/en-us/microsoft-edge/platform/issues/817823/)
		//There is a mistake when set text-anchor to "end".In the meantime , SVG text don't support dx in IE.So I use function translate to change postion x when situation is IE and RTL.
		//But it will low the performance, so it should be set text-anchor to "end" to get ideal result when IE fix his bug.
		if ((Device.browser.msie || Device.browser.edge) && Core.getConfiguration().getRTL()) {
			d3.selectAll(".sapGanttChartHeader .sapGanttTimeHeaderSvgText0")
				.each(function(d,i) {
					d3.select(this).attr("transform", function(d) {
						var sOffsetTranslate = "translate(" + ( -Utility.calculateStringLength(d.label) * parseInt($(".sapGanttTimeHeaderSvgText0").css("font-size") , 10) / 2) + ")";
						return sOffsetTranslate;
					});
				});
			d3.selectAll(".sapGanttChartHeader .sapGanttTimeHeaderSvgText1")
				.each(function(d,i) {
					d3.select(this).attr("transform", function(d) {
						var sOffsetTranslate = "translate(" + ( -Utility.calculateStringLength(d.label) * parseInt($(".sapGanttTimeHeaderSvgText1").css("font-size") , 10) / 2) + ")";
						return sOffsetTranslate;
					});
				});
		}
		
		// append path for scales on both rows
		var sPathData = "";
		for (var i = 0; i < aLabelList[1].length; i++) {
			var oLabel = aLabelList[1][i];
			if (oLabel) {
				sPathData +=
					" M" +
					" " + (oLabel.value - 1 / 2) +
					" " + nMiddleLineYOffset +
					" L" +
					" " + (oLabel.value - 1 / 2 ) +
					" " + nSvgHeight;
			}
		}

		oGroupSvg.append("path").classed("sapGanttTimeHeaderSvgPath", true).attr("d", sPathData);
	};
	
	GanttChart.prototype._drawCalendarPattern = function () {
		var $GanttChartSvg = d3.select("#" + this.getId() + "-svg");
		this._oCalendarPatternDrawer.drawSvg($GanttChartSvg, this.getId(), this.getCalendarDef(), this._oStatusSet, this.getBaseRowHeight());
	};
	
	GanttChart.prototype._drawNowLine = function () {
		this._oNowlineDrawer  = new NowLineDrawer(this._oAxisTime);
		var $GanttChartHeader = d3.select("#" + this.getId() + "-header-svg"),
			$GanttChartSvg = d3.select("#" + this.getId() + "-svg");
		if (this.getEnableNowLine()) {
			this._oNowlineDrawer.drawSvg($GanttChartSvg, $GanttChartHeader);
		} else {
			this._oNowlineDrawer.destroySvg($GanttChartSvg, $GanttChartHeader);
		}
	};

	GanttChart.prototype._drawVerticalLine = function() {
		this._oVerticalLineDrawer = new VerticalLineDrawer(this.getAxisTime());
		var $GanttChartSvg = d3.select("#" + this.getId() + "-svg");
		if (this.getEnableVerticalLine()) {
			this._oVerticalLineDrawer.drawSvg($GanttChartSvg);
		} else {
			this._oVerticalLineDrawer.destroySvg($GanttChartSvg);
		}
	};

	GanttChart.prototype._drawExpandedBackground = function() {
		var aSvg = d3.select("#" + this.getId() + "-svg");
		
		if (!this._oTT || !this._oTT.getRows() || this._oTT.getRows().length <= 0) {
			return;
		}
		
		if (this._aFilteredRowData){
			var oChartSchemeBackgroundConfig = this._composeChartSchemeBackgroundConfig();
			this._oExpandedBackgroundDrawer.drawSvg(aSvg, this._aFilteredRowData, oChartSchemeBackgroundConfig);
		}
	};

	GanttChart.prototype._composeChartSchemeBackgroundConfig = function() {
		var oChartSchemeConfig = this._oChartSchemesConfigMap;
		var oBackgroundConfig = {};
		if (oChartSchemeConfig){
			for (var sShemeName in oChartSchemeConfig){
				if (oChartSchemeConfig[sShemeName].getHaveBackground()){
					oBackgroundConfig[sShemeName] = oChartSchemeConfig[sShemeName].getBackgroundClass();
				}
			}
		}

		return oBackgroundConfig;
	};

	GanttChart.prototype._drawShapes = function () {
		var aSvg = d3.select("#" + this.getId() + "-svg");
		// draw shape
		if (this._aFilteredRowData && this._aShapeInstance && this._aShapeInstance.length > 0) {

			this._collectDataPerShapeId();
			var relationshipDataSet = this._oShapeCrossRowDrawer.generateRelationshipDataSet(aSvg, this._oShapeInstance, this._aNonVisibleShapeData,
					this.getShapeDataNames(), this._aRelationships, this._oAxisTime, this._oAxisOrdinal);

			for (var i = 0; i < this._aShapeInstance.length; i++) {
				switch (this._aShapeInstance[i].getCategory(null, this._oAxisTime, this._oAxisOrdinal)) {
					case sap.gantt.shape.ShapeCategory.InRowShape:
						this._oShapeInRowDrawer.drawSvg(aSvg, this._aShapeInstance[i],
							this._oAxisTime, this._oAxisOrdinal, this._oStatusSet);
						break;
					case sap.gantt.shape.ShapeCategory.Relationship:
						this._aShapeInstance[i].dataSet = this._judgeDisplayableOfRLS(this._aShapeInstance[i]) ? relationshipDataSet : [];
						this._oShapeCrossRowDrawer.drawSvg(aSvg, this._aShapeInstance[i],
								this._oAxisTime, this._oAxisOrdinal);
						break;
					default:
						break;
				}
			}
		}
	};

	//draw all the selected shapes and relationships
	GanttChart.prototype._drawSelectedShapes = function (bInitial) {
		var aSvg = d3.select("#" + this.getId() + "-svg");

		//set selected Status for Shapes and relationships
		if (!bInitial) {
			this._setSelectedStatusToData();
		}
		// draw selected shape
		this._collectSelectedDataPerShapeId();
		var relationshipDataSet = this._oShapeCrossRowDrawer.generateRelationshipDataSet(aSvg, this._oShapeInstance, this._aNonVisibleShapeData,
				this.getShapeDataNames(), this._aSelectedRelationships, this._oAxisTime, this._oAxisOrdinal);
		for (var sShapeId in this._oShapeInstance) {
			var oSelectedClassIns = this._oShapeInstance[sShapeId].getAggregation("selectedShape");
			var category = oSelectedClassIns.getCategory(null, this._oAxisTime, this._oAxisOrdinal);
			switch (category) {
			case sap.gantt.shape.ShapeCategory.InRowShape:
				this._oShapeInRowDrawer.drawSvg(aSvg, oSelectedClassIns, this._oAxisTime, this._oAxisrdinal, this._oStatusSet);
				break;
			case sap.gantt.shape.ShapeCategory.Relationship:
				oSelectedClassIns.dataSet =  relationshipDataSet;
				this._oShapeCrossRowDrawer.drawSvg(aSvg, oSelectedClassIns,
						this._oAxisTime, this._oAxisOrdinal);
				break;
			default:
				break;
			}
		}
	};
	
	/*
	 * This method collect data according to current row's configuration/objectType/shape/chart scheme/mode.
	 * this._aFilteredRowData contains the data for all different shapes so here we need to pick up by sShapeName
	 * once is function finished execution, each instance of shape classes will have 'dataset' attribute
	 * and it is an array of the data picked up from this._aFilteredRowData for drawing that shape.
	 */
	GanttChart.prototype._collectDataPerShapeId = function () {
		var oRowData, oShapeData;
		//this._oShapeInstance is an object which has properties with format as below:
		//property key is the data name for shapes such as 'header'
		//property value is the instance of shape classes such as sap.gantt.shape.Rectangle
		//so the structure of this._oShapeInstance is like
		//{
		//	'header': <instance of sap.gantt.shape.ext.Chevron>
		//	'task': <sap.gantt.shape.Rectangle>
		//}
		for (var sShapeId in this._oShapeInstance) {
			var sShapeName = this._oShapeInstance[sShapeId].mShapeConfig.getShapeDataName();//e.g. Header
			this._oShapeInstance[sShapeId].dataSet = [];
			if (this._oShapeInstance[sShapeId]._attributeNameBindingMap) {
				this._oShapeInstance[sShapeId]._attributeNameBindingMap = undefined;
			}
			for (var i = 0; i < this._aFilteredRowData.length; i++) {
				//this._aFilteredRowData contains the data for all different shapes so here we need to pick up by sShapeName
				oRowData = this._aFilteredRowData[i];
				if (oRowData.isBlank) {
					continue;
				}
				//if user doesn't configure the shape with 'shapeDataName', add all row data to the shape
				if (!sShapeName) {
					this._oShapeInstance[sShapeId].dataSet.push({
						"objectInfoRef": oRowData,
						"shapeData": oRowData.data
					});
					continue;
				}

				if (!this._judgeDisplayableByShapeId(oRowData, sShapeId)) {
					continue;
				}
				oShapeData = oRowData.data[sShapeName];
				if (oShapeData){
					this._oShapeInstance[sShapeId].dataSet.push({
						"objectInfoRef": oRowData,
						"shapeData": oShapeData
					});
				}
			}
		}
	};

	GanttChart.prototype._collectSelectedDataPerShapeId = function () {
		//group the selected shape data into the dataSet of related selectedClass instance
		for (var sShapeId in this._oShapeInstance) {
			// If sShapeDataName is undefiend, the selectedShape will use row data to draw selection frame.
			var sShapeDataName = this._oShapeInstance[sShapeId].mShapeConfig.getShapeDataName() ?
								this._oShapeInstance[sShapeId].mShapeConfig.getShapeDataName() : undefined;//e.g. Header
			var oSelectedClassIns = this._oShapeInstance[sShapeId].getAggregation("selectedShape");
			var sCategory = oSelectedClassIns.getCategory(null, this._oAxisTime, this._oAxisOrdinal);
			//collect shape data for every selectedClass instance according to current selection
			oSelectedClassIns.dataSet = [];
			if (sCategory == sap.gantt.shape.ShapeCategory.Relationship) {
				var aShapeData = [];
				for (var j in this._aSelectedRelationships) {
					var oRelationshipData = this._aSelectedRelationships[j];
					//only when the relationship is display, it needs to be drew
					if (this._getShapeDataById(oRelationshipData.id, true) !== undefined) {
						aShapeData.push(oRelationshipData);
					}
				}
				oSelectedClassIns.dataSet.push({
					"shapeData": aShapeData
				});
			}else if (this._oSelectedShapes[sShapeDataName] !== undefined) {
				for (var i in this._oSelectedShapes[sShapeDataName]) {
					var oShape = this._oSelectedShapes[sShapeDataName][i];
					//only when the master shape is displayed, draw the selectedShape
					//var oRowData = this._getRowByShapeUid(oShape.shapeUid);
					var oRowData = this._getVisibleRowByShapeUid(oShape.shapeUid);
					if (oRowData !== undefined && oRowData !== null && this._oShapeInstance[sShapeId].getEnableSelection(oShape.shapeData, oShape.objectInfoRef) &&
							this._judgeDisplayableByShapeId(oRowData, sShapeId)){
						oShape.objectInfoRef = oRowData;
						oSelectedClassIns.dataSet.push({
							"objectInfoRef": oShape.objectInfoRef,
							"shapeData": [oShape.shapeData]
						});
					}
				}
			}
		}
	};
	
	GanttChart.prototype._judgeDisplayableByShapeId = function (oRowData, sShapeId) {
		var  sChartScheme, oChartScheme, aShapeIdsInChartScheme, sMode;
		if (oRowData.chartScheme) {
			sChartScheme = oRowData.chartScheme;
		} else {
			sChartScheme = this._oObjectTypesConfigMap[oRowData.data.type] ?
					this._oObjectTypesConfigMap[oRowData.data.type].getMainChartSchemeKey() :
					sap.gantt.config.DEFAULT_CHART_SCHEME_KEY;
		}
		oChartScheme = this._oChartSchemesConfigMap[sChartScheme];
		if (oChartScheme == undefined) {
			return false;
		}
		aShapeIdsInChartScheme = oChartScheme.getShapeKeys();
		/*
		 * determin mode. if mode is coded against chart scheme, it over-write current mode in chart
		 */
		sMode = oChartScheme.getModeKey() !== sap.gantt.config.DEFAULT_MODE_KEY ?
				oChartScheme.getModeKey() :
				this.getMode();
		//sMode = oChartScheme.getModeKey() ? oChartScheme.getModeKey() : this.getMode();
		/*
		 * check if shape should appear in current chart scheme and mode
		 */
		if ((sChartScheme !== sap.gantt.config.DEFAULT_CHART_SCHEME_KEY && aShapeIdsInChartScheme.indexOf(sShapeId) < 0 )
				|| (sMode !== sap.gantt.config.DEFAULT_MODE_KEY 
					&& this._oShapesConfigMap[sShapeId].getModeKeys() 
					&& this._oShapesConfigMap[sShapeId].getModeKeys().length > 0
					&& this._oShapesConfigMap[sShapeId].getModeKeys().indexOf(sMode) < 0 )
				|| !oRowData.data) {
			return false;
		}
		return true;
	};
	
	GanttChart.prototype._judgeDisplayableOfRLS = function (oShape) {

		var aShapeMode = this._oShapesConfigMap[oShape.mShapeConfig.getKey()] ? 
				this._oShapesConfigMap[oShape.mShapeConfig.getKey()].getModeKeys() : [];
		if (jQuery.inArray(this.getMode(), aShapeMode) < 0 && this.getMode() !== sap.gantt.config.DEFAULT_MODE_KEY) {
			return false;
		}
		return true;
	};

	//get Uid by id
	GanttChart.prototype._getUidById = function (sId, bRelationship) {
		var sUid = [];
		if (bRelationship) {
			for (var i in this._aRelationships) {
				var oRelationship = this._aRelationships[i];
				if (oRelationship.id == sId) {
					sUid.push(oRelationship.uid);
					break;
				}
			}	
		}else {
			var aAllRowData = this.getAllRowData();
			jQuery.each(aAllRowData, function (k, v) {
				var rowInfo = v;
				for (var sShape in rowInfo.data) {
					if (rowInfo.data[sShape] instanceof Array) {
						for (var i in rowInfo.data[sShape]) {
							//a shape can appear in different rows, so one id may have several uids
							if (rowInfo.data[sShape][i].id == sId) {
								sUid.push(rowInfo.data[sShape][i].uid);
							}
						}
					}
				}
			});
		}
		
		return sUid;
	};
	
	//get shapeData by uid
	GanttChart.prototype._getShapeDataByUid = function (sUid, bRelationship) {
		if (bRelationship) {// if it is a relationship
			for (var i in this._aRelationships) {
				var oRelationship = this._aRelationships[i];
				if (oRelationship.uid === sUid) {
					return oRelationship;
				}
			}
		}else {
			var rowInfo = this._getRowByShapeUid(sUid);
			var sShapeDataName = Utility.getShapeDataNameByUid(sUid);
			if (rowInfo !== undefined && rowInfo.data[sShapeDataName] !== undefined) {
				for ( var j = 0; j < rowInfo.data[sShapeDataName].length; j++) {
					var oShapeData = rowInfo.data[sShapeDataName][j];
					if (oShapeData.uid == sUid) {
						return oShapeData;
					}
				}
			}
		}
		return undefined;
	};
	
	/*
	 * get shapeData by id
	 * @para 
	 * @para
	 * @return an array as there may be multiple uids for a same id, as the shape can appear more than once
	 */
	GanttChart.prototype._getShapeDataById = function (sId, bRelationship) {
		var aShapeData = [];
		var aUids = this._getUidById(sId, bRelationship);
		for (var i in aUids) {
			var oShapeData = this._getShapeDataByUid(aUids[i], bRelationship);
			if (oShapeData !== undefined) {
				aShapeData.push(oShapeData);
			}
		}
		return aShapeData;
	};
	
	//get row obj by shape uid, including rows not in visible area
	//one shape(has an uid as unique key) may appear more then once in different rows, the uid includes row information
	GanttChart.prototype._getRowByShapeUid = function (sShapeUid) {
		var rowData;
		var sShapeDataName = Utility.getShapeDataNameByUid(sShapeUid);
		var bJSONTreeBinding = (this._oTT.getBinding("rows").getMetadata().getName() === "sap.ui.model.json.JSONTreeBinding");
		var sRowChartScheme = Utility.getChartSchemeByShapeUid(sShapeUid);
		//consider all rows including invisible rows
		var aAllRowData = this.getAllRowData();
		jQuery.each(aAllRowData, function (k, v) {
			var rowInfo = v;
			if (sRowChartScheme === "" || sRowChartScheme === rowInfo.chartScheme) {
				if (bJSONTreeBinding && rowInfo.data[sShapeDataName]) {
					for ( var i = 0; i < rowInfo.data[sShapeDataName].length; i++) {
						if (rowInfo.data[sShapeDataName][i].uid == sShapeUid) {
							rowData = rowInfo;
							return false;
						}
					}
				}else if (rowInfo.data.uid === sShapeUid) {
					rowData = rowInfo;
					return false;
				}
			}
		});
		return rowData;
	};

	//get row obj by shape uid, only consider visible rows
	GanttChart.prototype._getVisibleRowByShapeUid = function (sShapeUid) {
		var rowData;
		var sShapeDataName = Utility.getShapeDataNameByUid(sShapeUid);
		var bJSONTreeBinding = (this._oTT.getBinding("rows").getMetadata().getName() === "sap.ui.model.json.JSONTreeBinding");
		var sRowChartScheme = Utility.getChartSchemeByShapeUid(sShapeUid);
		jQuery.each(this._aFilteredRowData, function (k, v) {
			var rowInfo = v;
			if (sRowChartScheme === "" || sRowChartScheme === rowInfo.chartScheme) {
				if (bJSONTreeBinding && rowInfo.data[sShapeDataName]) {
					for ( var i = 0; i < rowInfo.data[sShapeDataName].length; i++) {
						if (rowInfo.data[sShapeDataName][i].uid == sShapeUid) {
							rowData = rowInfo;
							return false;
						}
					}
				}else if (rowInfo.data.uid === sShapeUid) {
					rowData = rowInfo;
					return false;
				}
			}
		});
		return rowData;
	};
	
	//get row by row id
	GanttChart.prototype._getRowById = function (sRowId) {
		var rowData;
		var aAllRowData = this.getAllRowData();
		jQuery.each(aAllRowData, function (k, v) {
			var rowInfo = v;
			if (rowInfo.data.id == sRowId) {
				rowData = rowInfo;
				return false;
			}
		});
		return rowData;
	};
	
	GanttChart.prototype._getSvgCoodinateByDiv = function(oNode, x, y){
		var oClickPoint = oNode.createSVGPoint();
			oClickPoint.x = x;
			oClickPoint.y = y;
			oClickPoint = oClickPoint.matrixTransform(oNode.getScreenCTM().inverse());
			oClickPoint.svgHeight = oNode.height.baseVal.value;
			oClickPoint.svgId = this.getId() + "-svg";
		
		return oClickPoint;
	};
	
	GanttChart.prototype._getTopShapeInstance = function (oShapeData, sClassId) {
		if (sClassId !== undefined) {
			var oShapeId = this._getShapeIdById(sClassId);
			if (oShapeId !== undefined && oShapeId !== null) {
				if (oShapeId.topShapeId !== undefined) {
					return this._oShapeInstance[oShapeId.topShapeId];
				}else {
					return this._oShapeInstance[oShapeId.shapeId];
				}
			}
		}else {
			var sShapeDataName = Utility.getShapeDataNameByUid(oShapeData.uid);
			for (var sShapeId in this._oShapeInstance) {
				var sShapeName = this._oShapeInstance[sShapeId].mShapeConfig.getShapeDataName();//e.g. Header
				if (sShapeDataName === sShapeName){
					var sTopShapeId = this._customerClassIds[sShapeId].topShapeId;
					if (sTopShapeId !== undefined) {
						return this._oShapeInstance[sTopShapeId];
					}else {
						return this._oShapeInstance[sShapeId];
					}
				}
			}
		}
		return undefined;
	};
	
	//judge if the shape is selectable
	GanttChart.prototype._judgeEnableSelection = function (oShapeData, sClassId) {	
		if (oShapeData === undefined) {
			return false;
		}
		var oTopShapeInstance = this._getTopShapeInstance(oShapeData, sClassId);
		if (oTopShapeInstance !== undefined) {
			return oTopShapeInstance.getEnableSelection(oShapeData);
		}
		//when the current shape class is instance of selectedShape
		var oShape = sap.ui.getCore().byId(sClassId);
		if (oShape) {
			return oShape.getEnableSelection(oShapeData);
		}
		return false;
	};
	
	GanttChart.prototype._judgeEnableDnD = function (oShapeData, sClassId) {
		if (oShapeData === undefined) {
			return false;
		}
		var oTopShapeInstance = this._getTopShapeInstance(oShapeData, sClassId);
		if (oTopShapeInstance !== undefined) {
			return oTopShapeInstance.getEnableDnD(oShapeData);
		}
		//when the current shape class is instance of selectedShape
		var oShape = sap.ui.getCore().byId(sClassId);
		if (oShape) {
			return oShape.getEnableDnD(oShapeData);
		}
		return false;
	};
	
	/*select shape by adding current selecting shape into the shape selection
	 * The structure of aSelectedShapes: {"ShapeDataName1": e.g. all selected activities, "ShapeDataName2": e.g. all selected tasks...--- arrays with a struture of {"shapeUid": "shapeData", "objectInfoRef"}
	 */
	GanttChart.prototype._selectShape = function (oShapeData) {
		var oRowInfo = this._getRowByShapeUid(oShapeData.uid);
		if (oRowInfo == undefined) {
			return false;
		}
		if (this._aSelectedShapeUids === undefined) {
			this._aSelectedShapeUids = [];
		}
		//If sShapeDataName is undefined, it means the shape has no shapeDataName and it consumes row data.
		var sShapeDataName = Utility.getShapeDataNameByUid(oShapeData.uid);
		if (this._oSelectedShapes[sShapeDataName] !== undefined && this._oSelectedShapes[sShapeDataName] !== null ) {
			var aShapes = this._oSelectedShapes[sShapeDataName];
			if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) > -1) { //if the shape is already in selection
				return false;
			}else {
				this._aSelectedShapeUids.push(oShapeData.uid);
				aShapes.push({"shapeUid": oShapeData.uid, "shapeData": oShapeData, "objectInfoRef": oRowInfo});
				return true;
			}
		}else {
			////If this._oSelectedShapes.undefined = {} is used to store selection data of the shape, which has no shapeDataName and consumes row data.
			this._aSelectedShapeUids.push(oShapeData.uid);
			this._oSelectedShapes[sShapeDataName] = [];
			this._oSelectedShapes[sShapeDataName].push({"shapeUid": oShapeData.uid, "shapeData": oShapeData, "objectInfoRef": oRowInfo});
			return true;
		}
	};

	// deselect current shape by remove it from the collection of selected shapes
	GanttChart.prototype._deselectShape = function (oShapeData) {
		var sShapeDataName = Utility.getShapeDataNameByUid(oShapeData.uid);
		if (jQuery.inArray(oShapeData.uid, this._aSelectedShapeUids) > -1) {
			var iIndex = this._aSelectedShapeUids.indexOf(oShapeData.uid);
			this._aSelectedShapeUids.splice(iIndex,1);
			var aShapes = this._oSelectedShapes[sShapeDataName];
			for (var i in aShapes) {
				if (aShapes[i].shapeUid === oShapeData.uid) {
					aShapes.splice(i,1);
					break;
				}
			}
			return true;
		}
		return false;
	};

	GanttChart.prototype.getAxisOrdinal = function () {
		return this._oAxisOrdinal;
	};
	
	GanttChart.prototype.getAxisTime = function () {
		return this._oAxisTime;
	};

	GanttChart.prototype.ondblclick = function (oEvent) {
		return null;
	};
	
	GanttChart.prototype.onclick = function (oEvent) {
		return null;
	};
	
	GanttChart.prototype.getSapUiSizeClass = function () {
		return this._sUiSizeMode;
	};
	
	/**
	 * Sets the first visible row in the Gantt Chart Control.
	 * 
	 * @see sap.ui.table.Table.setFirstVisibleRow
	 * 
	 * @param {int} iRowIndex The row index to be set as the first visible row
	 * @return {sap.gantt.GanttChart} A reference to the GanttChart control, which can be used for chaining
	 * @public
	 */
	GanttChart.prototype.setFirstVisibleRow = function(iRowIndex) {
		this._oTT.setFirstVisibleRow(iRowIndex);
		return this;
	};
	
	GanttChart.prototype._getVisibleRowCount = function () {
		return this._oTT.getVisibleRowCount() + 1;
	};
	
	/*
	 * Implementation of sap.gantt.GanttChartBase._setLargeDataScrolling method.
	 */
	GanttChart.prototype._setLargeDataScrolling = function(bLargeDataScrolling) {
		if (this._oTT._setLargeDataScrolling) {
			this._oTT._setLargeDataScrolling(!!bLargeDataScrolling);
		}
	};

	GanttChart.prototype.exit = function () {
		// TODO: destroy axis time and ordinal after refactor to listener pattern.
		// other children are all strong aggregation relations, no need to destroy.
		this._detachEvents();
		this._cleanUpTimers();
	};
	
	/**
	 * cleanup the timers when not required anymore
	 * @private
	 */
	GanttChart.prototype._cleanUpTimers = function() {
		for (var sKey in this._mTimeouts) {
			if (this._mTimeouts[sKey]) {
				clearTimeout(this._mTimeouts[sKey]);
				this._mTimeouts[sKey] = undefined;
			}
		}
	};

	return GanttChart;
}, true);
