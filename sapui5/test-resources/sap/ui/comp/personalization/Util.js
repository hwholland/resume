/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

/**
 * @namespace Provides utitlity functions for table personalization tests
 * @name sap.ui.comp.qunit.personalization.Util
 * @author SAP SE
 * @version 1.38.33
 * @private
 * @since 1.30.0
 */
sap.ui.define([
	'sap/ui/base/Object', 'sap/chart/Chart', 'sap/ui/comp/personalization/Util'
], function(BaseObject, Chart, UtilPersonalization) {
	"use strict";

	var Util = BaseObject.extend("sap.ui.comp.qunit.personalization.Util", /** @lends sap.ui.comp.qunit.personalization.Util */
	{});

	Util.getColumnKeysOfTable = function(oTable) {
		var aTableColumnKeys = [];
		if (!oTable) {
			return [];
		}
		oTable.getColumns().forEach(function(oColumn) {
			aTableColumnKeys.push(UtilPersonalization.getColumnKey(oColumn));
		}, this);
		return aTableColumnKeys;
	};

	/**
	 * Look at the end of the label text for the Dirty flag.
	 */
	Util.hasDirtyFlag = function(oLabel) {
		var sText = oLabel.getText();
		return (sText.indexOf("*") !== -1 && sText.indexOf("*") === (sText.length - 1));
	};

	Util.setDirtyFlag = function(oLabel, bIsChanged) {
		if (!oLabel) {
			return;
		}
		var sText = oLabel.getText();
		var bTextDirty = this.hasDirtyFlag(oLabel);
		if (!bTextDirty && bIsChanged) {
			// Add Dirty Flag with 'space' if there is a text, else without 'space'
			oLabel.setText(sText + (sText === "" ? "" : " ") + "*");
		} else if (bTextDirty && !bIsChanged) {
			oLabel.setText(sText.substring(0, sText.length - 1));
		}
	};

	Util.permuteColumnsByVisibleOrder = function(oColumnKey2ColumnMap, aOrderOfVisibleColumns) {
		var aColumns = [];
		for ( var sColKey in oColumnKey2ColumnMap) {
			aColumns.push(oColumnKey2ColumnMap[sColKey]);
		}
		var fGetFirstVisibleColumnExcluding = function(aColumnsQueue, aExcluding) {
			for (var i = 0, iLength = aColumnsQueue.length; i < iLength; i++) {
				var sColumnKey = UtilPersonalization.getColumnKey(aColumnsQueue[i]);
				if (aColumnsQueue[i].getVisible() && aExcluding.indexOf(sColumnKey) < 0) {
					return aColumnsQueue[i];
				}
			}
			return null;
		};
		for (var i = 0, iLength = aOrderOfVisibleColumns.length; i < iLength; i++) {
			var oColumnFrom = oColumnKey2ColumnMap[aOrderOfVisibleColumns[i]];
			var iIndexFrom = aColumns.indexOf(oColumnFrom);
			var oColumnTo = fGetFirstVisibleColumnExcluding(aColumns.slice(0, iIndexFrom + 1), aOrderOfVisibleColumns.slice(0, i + 1));
			if (!oColumnTo) {
				continue; // nothing to do, go ahead
			}
			var iIndexTo = aColumns.indexOf(oColumnTo);
			var aColumnsTemp = aColumns.splice(iIndexTo, 1, oColumnFrom);
			aColumns.splice(iIndexFrom, 1, aColumnsTemp[0]);
		}
	};

	Util.getAvailableChartTypes = function(oChart) {
		var aAvailableChartTypes = [];
		var mChartTypes = Chart.getChartTypes();
		oChart.getAvailableChartTypes().available.forEach(function(oChartTypeKey) {
			aAvailableChartTypes.push({
				key: oChartTypeKey.chart,
				text: mChartTypes[oChartTypeKey.chart]
			});
		});
		return aAvailableChartTypes;
	};

	Util.getGroupFormatterForDate = function(oDate) {
		var sYear = oDate.getFullYear();
		return {
			key: sYear,
			text: sYear
		};
	};

	Util.getGroupFormatterForBoolean = function(oBoolean) {
		return {
			key: oBoolean,
			text: oBoolean
		};
	};

	Util.getGroupFormatterForText = function(sText, sLabel) {
		var sKey = sText.charAt(0);
		return {
			key: sKey,
			text: sLabel + ": " + sKey
		}
	};

	Util.getGroupFormatterForNumber = function(iNumber) {
		var iTenner = Math.floor(iNumber / 10) * 10;
		return {
			key: iTenner,
			text: iTenner
		}
	};

	/**
	 * @param {string} sKey
	 * @param {sap.ui.table.Column[] | sap.m.Column[]} aColumns
	 * @returns {sap.ui.table.Column | sap.m.Column | null}
	 */
	Util.getColumn = function(sColumnKey, aColumns) {
		var oResultColumn = null;
		aColumns.some(function(oColumn) {
			if (UtilPersonalization.getColumnKey(oColumn) === sColumnKey) {
				oResultColumn = oColumn;
				return true;
			}
		}, this);
		return oResultColumn;
	};

	Util.addSorter = function(oTable, aPathOfSorter) {
		var aSorter = [];
		var oBinding = this.getBindingObject(oTable);
		aPathOfSorter.forEach(function(oSortParams) {
			var bDescending = oSortParams.order === "Descending";// P13nConditionOperation.Descending;
			aSorter.push(new sap.ui.model.Sorter(oSortParams.path, bDescending));
			var oColumn = null;
			if (oTable instanceof sap.ui.table.Table) {
				oColumn = this.getColumn(oSortParams.path, oTable.getColumns());
			} else if (oTable instanceof sap.ui.comp.smarttable.SmartTable) {
				oColumn = this.getColumn(oSortParams.path, oTable._oTable.getColumns());
			}
			if (oColumn) {
				oColumn.setSorted(true);
			}
		}, this);
		oBinding.sort(aSorter);
	};

	Util.addFilterer = function(oTable, aPathOfFilterer) {
		var aFilterer = [];
		var oBinding = this.getBindingObject(oTable);
		aPathOfFilterer.forEach(function(oFilterParams) {
			aFilterer.push(new sap.ui.model.Filter(oFilterParams.path, oFilterParams.operation, oFilterParams.value1, oFilterParams.value2));
			var oColumn = null;
			if (oTable instanceof sap.ui.table.Table) {
				oColumn = this.getColumn(oFilterParams.path, oTable.getColumns());
			} else if (oTable instanceof sap.ui.comp.smarttable.SmartTable) {
				oColumn = this.getColumn(oFilterParams.path, oTable._oTable.getColumns());
			}
			if (oColumn) {
				oColumn.setFiltered(true);
				oColumn.setFilterOperator(oFilterParams.operation);
				oColumn.setFilterValue(oFilterParams.value1);
				// filterType: sPath === "Date" ? "sap.ui.model.type.Date" : undefined,
			}
		}, this);
		oBinding.filter(aFilterer);
	};

	Util.addGroup = function(oTable, aPathOfGroups) {
		aPathOfGroups.forEach(function(oGroupParams) {
			var oColumn = null;
			if (oTable instanceof sap.ui.table.Table) {
				oColumn = this.getColumn(oGroupParams.path, oTable.getColumns());
			} else if (oTable instanceof sap.ui.comp.smarttable.SmartTable) {
				oColumn = this.getColumn(oGroupParams.path, oTable._oTable.getColumns());
			}
			if (oColumn) {
				oColumn.setGrouped(true);
			}
		}, this);
	};

	Util.updateFiltererFromP13nModelDataChange = function(oTable, oP13nChangeData) {
		var aFilters = [];
		var oBinding = this.getBindingObject(oTable);
		if (oP13nChangeData.filter && oP13nChangeData.filter.filterItems) {
			var aColumns = oTable.getColumns();
			oP13nChangeData.filter.filterItems.forEach(function(oModelItem) {
				var oColumn = this.getColumn(oModelItem.columnKey, aColumns);
				var sPath = UtilPersonalization.getColumnKey(oColumn);
				aFilters.push(new sap.ui.model.Filter(sPath, oModelItem.operation, oModelItem.value1, oModelItem.value2));
			}, this);
		}
		oBinding.filter(aFilters);
	};

	Util.updateSortererFromP13nModelDataChange = function(oTable, oP13nChangeData, oJSONData) {
		var aColumns = oTable.getColumns();
		var oBinding = this.getBindingObject(oTable);
		var that = this;
		var aSorters = [];

		if (oTable instanceof sap.m.Table) {
			if (oP13nChangeData.group && oP13nChangeData.group.groupItems) {
				oP13nChangeData.group.groupItems.some(function(oModelItem) {
					var oColumn = this.getColumn(oModelItem.columnKey, aColumns);
					var sPath = oModelItem.columnKey;
					var bDescending = oModelItem.operation === sap.m.P13nConditionOperation.GroupDescending;

					var oElement = UtilPersonalization.getArrayElementByKey("path", sPath, oJSONData);
					if (oElement.type === "Date") {
						aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, function(oContext) {
							return that.getGroupFormatterForDate(oContext.getProperty(sPath));
						}));
						return true;
					} else if (oElement.type === "Number") {
						aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, function(oContext) {
							return that.getGroupFormatterForNumber(oContext.getProperty(sPath));
						}));
						return true;
					} else if (oElement.type === "Boolean") {
						aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, function(oContext) {
							return that.getGroupFormatterForBoolean(oContext.getProperty(sPath));
						}));
						return true;
					} else if (oElement.type === "String") {
						aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, function(oContext) {
							return that.getGroupFormatterForText(oContext.getProperty(sPath), oColumn.getHeader().getText());
						}));
						return true;
					}
				}, this);
			}
		}
		if (oP13nChangeData.sort && oP13nChangeData.sort.sortItems) {
			var fGetSorterByPath = function(aSorters, sPath) {
				var oFoundSorter;
				aSorters.some(function(oSorter) {
					if (oSorter.sPath === sPath) {
						oFoundSorter = oSorter;
						return true;
					}
				}, true);
				return oFoundSorter;
			};
			oP13nChangeData.sort.sortItems.forEach(function(oSortItem) {
				var oColumn = this.getColumn(oSortItem.columnKey, aColumns);
				var sPath = UtilPersonalization.getColumnKey(oColumn);
				var bDescending = oSortItem.operation === "Descending";// P13nConditionOperation.Descending;
				var oSorter = fGetSorterByPath(aSorters, sPath);
				if (oSorter) {
					oSorter.bDescending = bDescending;
				} else {
					aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
				}
			}, this);
		}
		oBinding.sort(aSorters);
	};

	Util.getBindingObject = function(oTable) {
		if (oTable instanceof sap.ui.table.Table) {
			return oTable.getBinding("rows");
		} else if (oTable instanceof sap.m.Table) {
			return oTable.getBinding("items");
		} else if (oTable instanceof sap.ui.comp.smarttable.SmartTable) {
			return this.getBindingObject(oTable._oTable);
		} else if (oTable instanceof sap.ui.comp.personalization.ChartWrapper) {
			return oTable.getChartObject().getBinding("data");
		}
		return null;
	};

	Util.addAnalyticalColumns = function(oTable, oModel, sEntitySet) {
		var oResult = oModel.getAnalyticalExtensions().findQueryResultByName(sEntitySet);
		var oEntityTypeProperties = oResult.getEntityType().getProperties();

		var aSortableColumns = oResult._oEntityType.getSortablePropertyNames();
		var aFilterableColumns = oResult._oEntityType.getFilterablePropertyNames();

		var i;
		for (i in oEntityTypeProperties) {
			var sPath = oEntityTypeProperties[i].name;
			this.addAnalyticalColumn(oTable, sPath, aSortableColumns, aFilterableColumns);
		}
	};

	Util.addAnalyticalColumnPerf = function(oTable, oModel, sEntitySet) {

		// Determine columns
		var aColumnKeysOrdered = this.getVisibleColumnsFromODataModel(oModel);

		var oResult = oModel.getAnalyticalExtensions().findQueryResultByName(sEntitySet);
		var oEntityTypeProperties = oResult.getEntityType().getProperties();

		for ( var i in oEntityTypeProperties) {
			var sPath = oEntityTypeProperties[i].name;
			if (aColumnKeysOrdered.indexOf(sPath) > -1) {
				this.addAnalyticalColumn(oTable, sPath, [], []);
			}
		}
	};

	Util.createAnalyticalColumns = function(oTable, aColumnKeys, sEntitySet) {
		var oColumnKey2ColumnMap = {};
		var oModel = oTable.getModel();
		var aVisibleColumns = this.getVisibleColumnsFromODataModel(oModel);
		var oResult = oModel.getAnalyticalExtensions().findQueryResultByName(sEntitySet);
		var oEntityTypeProperties = oResult.getEntityType().getProperties();

// var aSortableColumns = oResult._oEntityType.getSortablePropertyNames();
// var aFilterableColumns = oResult._oEntityType.getFilterablePropertyNames();

		for ( var i in oEntityTypeProperties) {
			var sPath = oEntityTypeProperties[i].name;
			if (aColumnKeys.indexOf(sPath) < 0) {
				continue;
			}

			var bVisible = aVisibleColumns.indexOf(sPath) === -1 ? false : true;
			var oColumn = new sap.ui.table.AnalyticalColumn({
				label: new sap.m.Label({
					text: sPath
				}),
				grouped: false,
				summed: false,
				visible: bVisible,
				autoResizable: true,
				showFilterMenuEntry: false,
				template: new sap.m.Text({
					wrapping: false,
					text: {
						path: sPath,
						type: sPath === "Price" ? "sap.ui.model.odata.type.Double" : (sPath === "Bool" ? "sap.ui.model.odata.type.Boolean" : (sPath === "Date" ? "sap.ui.model.odata.type.DateTime" : (sPath === "Time" ? "sap.ui.model.odata.type.Time" : "sap.ui.model.odata.type.String"))), //
						constraints: {
							displayFormat: sPath === "Date" ? "Date" : ""
						}
					}
				})
// sortProperty: aSortableColumns.indexOf(sPath) === -1 ? undefined : sPath,
// filterProperty: aFilterableColumns.indexOf(sPath) === -1 ? undefined : sPath,
// leadingProperty: sPath
			}).data("p13nData", {
				columnKey: sPath,
				type: sPath === "Date" ? "date" : (sPath === "Price" ? "numeric" : "string")
			});
			oColumnKey2ColumnMap[sPath] = oColumn;
		}

		return oColumnKey2ColumnMap;
	};

	Util.addAnalyticalColumn = function(oTable, sPath, aSortableColumns, aFilterableColumns) {
		oTable.addColumn(new sap.ui.table.AnalyticalColumn({
			visible: true,
			autoResizable: true,
			showFilterMenuEntry: false,
			template: sPath,
			sortProperty: aSortableColumns.indexOf(sPath) === -1 ? undefined : sPath,
			filterProperty: aFilterableColumns.indexOf(sPath) === -1 ? undefined : sPath,
			leadingProperty: sPath
		}).data("p13nData", {
			columnKey: sPath,
			type: sPath === "Date" ? "date" : (sPath === "Price" ? "numeric" : "string")
		}));
	};

	Util.getVisibleColumnsFromODataModel = function(oModel) {
		var aVisibleCols = [];
		oModel.getServiceAnnotations()["EPM_DEVELOPER_SCENARIO_SRV.Product"]["com.sap.vocabularies.UI.v1.LineItem"].forEach(function(oLineItem) {
			aVisibleCols.push(oLineItem.Value.Path);
		});
		return aVisibleCols;
	};

	Util.convertDateFromODataToJSON = function(aOData) {
		var aJSON = [];
		aOData.forEach(function(oData) {
			var oJSON = oData;
			oJSON.Date = new Date(parseInt(oJSON.Date.substr(6)));
			oJSON.Time = new Date(oJSON.Time.ms);
			aJSON.push(oJSON);
		});
		return aJSON;
	};

	return Util;
}, /* bExport= */true);
