/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(['sap/ui/core/theming/Parameters', 'sap/gantt/misc/Utility'], function (Parameters, Utility) {
	"use strict";

	/**
	 * Gantt Chart with table renderer.
	 *
	 * @namespace
	 */
	var GanttChartWithTable = {};

	GanttChartWithTable.render = function (oRenderManager, oGanttChartWithTable) {
		oRenderManager.write("<div");
		oRenderManager.writeControlData(oGanttChartWithTable);
		oRenderManager.addClass("sapUiTableHScr");  //force horizontal scroll bar to show
		oRenderManager.addClass("sapGanttChartWithTable");
		oRenderManager.writeClasses();
		oRenderManager.addStyle("width", oGanttChartWithTable.getWidth());
		oRenderManager.addStyle("height", oGanttChartWithTable.getHeight());
		oRenderManager.writeStyles();
		oRenderManager.write(">");

		var iHeight = this._getColumnHeaderHeight(oGanttChartWithTable);
		oGanttChartWithTable._oTT.setColumnHeaderHeight(iHeight);

		oRenderManager.renderControl(oGanttChartWithTable._oSplitter);
		oRenderManager.write("</div>");

	};

	GanttChartWithTable._getColumnHeaderHeight = function(oGanttChartWithTable) {
		var iHeight = 0;
		if (oGanttChartWithTable._oToolbar.getAllToolbarItems().length == 0) {

			var iPaddingTop = sap.ui.getCore().getConfiguration().getTheme() === "sap_hcb" ? 2 : 0,
				sMode = Utility.findSapUiSizeClass(oGanttChartWithTable);

			if (sMode === "sapUiSizeCompact" || sMode === "sapUiSizeCondensed") {
				iHeight = parseInt(Parameters.get("sapGanttChartCompactHeaderHeight"), 10) - iPaddingTop;
			} else if (sMode === "sapUiSizeCozy") {
				iHeight = parseInt(Parameters.get("sapGanttChartHeaderHeight"), 10) - iPaddingTop;
			} else {
				iHeight = parseInt(Parameters.get("sapGanttChartHeaderDefaultHeight"), 10) - iPaddingTop;
			}
		}
		return iHeight;
	};

	return GanttChartWithTable;
}, /* bExport= */ true);
