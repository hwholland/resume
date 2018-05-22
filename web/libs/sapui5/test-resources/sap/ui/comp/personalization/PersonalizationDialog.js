/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2016 SAP SE. All rights reserved
 */

/**
 * @namespace Provides utitlity functions for the personalization dialog
 * @name sap.ui.comp.personalization.PersonalizationDialog
 * @author SAP SE
 * @version 1.38.33
 * @private
 * @since 1.25.0
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/base/ManagedObject', 'sap/ui/core/util/MockServer', 'sap/ui/model/odata/ODataModel', 'sap/ui/model/analytics/ODataModelAdapter', 'sap/m/Toolbar', 'sap/ui/commons/Toolbar', 'test/sap/ui/comp/personalization/Util', 'sap/chart/data/Dimension', 'sap/chart/data/Measure', 'sap/ui/comp/smartchart/SmartChart', 'sap/chart/Chart', 'sap/chart/library'
], function(jQuery, ManagedObject, MockServer, ODataModel, ODataModelAdapter, Toolbar, CommonsToolbar, TestUtil, Dimension, Measure, SmartChart, Chart) {
	"use strict";
	var PersonalizationDialog = ManagedObject.extend("sap.ui.comp.personalization.PersonalizationDialog", /** @lends sap.ui.comp.personalization.Controller */
	{
		constructor: function(sId, mSettings) {
			ManagedObject.apply(this, arguments);
		}
	});

	PersonalizationDialog._createCell = function(sPath, oData) {
		var oElement = sap.ui.comp.personalization.Util.getArrayElementByKey("path", sPath, oData.cols);
		if (oElement.control === "ObjectIdentifier") {
			return new sap.m.ObjectIdentifier({
				title: "{" + oElement.path + "}",
				text: "{" + oElement.path2 + "}"
			});
		} else if (oElement.control === "ObjectNumber") {
			return new sap.m.ObjectNumber({
				number: {
					path: oElement.path,
					type: "sap.ui.model.odata.type.Double"
				},
				unit: "{" + oElement.path2 + "}"
			});
		} else {
			return new sap.m.Label({
				text: {
					path: oElement.path,
					type: oElement.path === "Price" ? "sap.ui.model.odata.type.Double" : (oElement.path === "Date" ? "sap.ui.model.type.Date" : (oElement.path === "Time" ? "sap.ui.model.type.Time" : "sap.ui.model.type.String"))
				// constraints: {displayFormat: oElement.path === "Date" ? "Date" : ""}
				}
			});
		}
	};

	PersonalizationDialog.createMTable = function(sId, oData, bPerformanceOptimization, bUseVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup) {
		var that = this;

		// Determine columns
		var aColumnKeysOrdered = bPerformanceOptimization ? oData.pathOfVisibleCols : oData.cols.filter(function(oCol) {
			return !(oCol.tableType && oCol.tableType === "UITable");
		}).map(function(oCol) {
			return oCol.path;
		});

		// Create table
		var oTable = new sap.m.Table(sId, {
			headerToolbar: this.createToolbar("sap.m.Table", bUseVariantManagement ? sId : null, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup),
		});
		oTable.setModel(new sap.ui.model.json.JSONModel({
			items: TestUtil.convertDateFromODataToJSON(jQuery.extend(true, [], oData.oDataItems)),
			cols: aColumnKeysOrdered
		}));
		oTable.bindAggregation("columns", "/cols", function(sId, oContext) {
			var sColumnKey = oContext.getProperty(oContext.getPath());
			var oColumn = new sap.m.Column({
				header: new sap.m.Label({
					text: sColumnKey
				}),
				visible: oData.pathOfVisibleCols.indexOf(sColumnKey) === -1 ? false : true
			});
			that.setP13nData(oColumn, sColumnKey);
			return oColumn;
		});
		this._oTemplate = new sap.m.ColumnListItem({
			cells: aColumnKeysOrdered.map(function(sPath) {
				return that._createCell(sPath, oData);
			})
		});
		oTable.bindItems({
			path: "/items",
			template: this._oTemplate
		});

		TestUtil.addSorter(oTable, oData.pathOfSorter);
		// Note: sap.m.Table does not support Filter Property
		// this.addFilterer(oTable, oData.pathOfFilterer);

		return oTable;
	};

	PersonalizationDialog.createMColumns = function(oTable, oData, aColumnKeys) {
		var oColumnKey2ColumnMap = {};
		oData.cols.forEach(function(oCol) {
			if (aColumnKeys.indexOf(oCol.path) < 0) {
				return;
			}
			var bVisible = oData.pathOfVisibleCols.indexOf(oCol.path) === -1 ? false : true;
			var oColumn = new sap.m.Column({
				header: new sap.m.Label({
					text: oCol.text,
					tooltip: oCol.text + " Tooltip"
				}),
				visible: bVisible,
				tooltip: oCol.tooltip
			// mergeDuplicates: true
			});
			this.setP13nData(oColumn, oCol.path);
			oColumnKey2ColumnMap[oCol.path] = oColumn;
		}, this);

		// TestUtil.addSorter(oTable, oData.pathOfSorter);
		// Note: sap.m.Table does not support Filter Property
		// TestUtil.addFilterer(oTable, oData.pathOfFilterer);

		for ( var sColumnKey in oColumnKey2ColumnMap) {
			oTable.addColumn(oColumnKey2ColumnMap[sColumnKey]);
			this._oTemplate.addCell(this._createCell(sColumnKey, oData));
		}
		oTable.bindItems({
			path: "/items",
			template: this._oTemplate
		});

		return oColumnKey2ColumnMap;
	};

	PersonalizationDialog.createUITable = function(sId, oData, bPerformanceOptimization, bUseVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup) {

		// Create table
		var oTable = new sap.ui.table.Table(sId, {
			enableGrouping: true,
			showColumnVisibilityMenu: true,
			title: new sap.ui.commons.Label({
				text: ""
			}),
			toolbar: this.createToolbar("sap.ui.table.Table", bUseVariantManagement ? sId : null, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup),
		});
		oTable.setModel(new sap.ui.model.json.JSONModel({
			items: TestUtil.convertDateFromODataToJSON(jQuery.extend(true, [], oData.oDataItems))
		}));
		oTable.bindRows("/items");

		TestUtil.addSorter(oTable, oData.pathOfSorter);
		TestUtil.addFilterer(oTable, oData.pathOfFilterer);

		// Determine columns
		var aColumnKeysOrdered = bPerformanceOptimization ? oData.pathOfVisibleCols : oData.cols.filter(function(oCol) {
			return !(oCol.tableType && oCol.tableType === "UITable");
		}).map(function(oCol) {
			return oCol.path;
		});

		var oColumnKey2ColumnMap = this.createUIColumns(oTable, oData, aColumnKeysOrdered);

		TestUtil.permuteColumnsByVisibleOrder(oColumnKey2ColumnMap, aColumnKeysOrdered);

		aColumnKeysOrdered.forEach(function(sColumnKey) {
			oTable.addColumn(oColumnKey2ColumnMap[sColumnKey]);
		});

		return oTable;
	};

	PersonalizationDialog.createUIColumns = function(oTable, oData, aColumnKeys) {
		var oColumnKey2ColumnMap = {};
		oData.cols.forEach(function(oCol) {
			if (aColumnKeys.indexOf(oCol.path) < 0) {
				return;
			}
			var bVisible = oData.pathOfVisibleCols.indexOf(oCol.path) === -1 ? false : true;
			var oColumn = new sap.ui.table.Column({
				label: new sap.ui.commons.Label({
					text: oCol.text
				}),
				tooltip: oCol.text + " Tooltip",
				template: new sap.ui.commons.Label({
					text: {
						path: oCol.path,
						type: oCol.path === "Price" ? "sap.ui.model.type.Float" : (oCol.path === "Date" ? "sap.ui.model.type.Date" : (oCol.path === "Time" ? "sap.ui.model.type.Time" : "sap.ui.model.type.String"))
					// constraints: {displayFormat: oCol.path === "Date" ? "Date" : ""}
					}
				}),
				visible: bVisible,
				sortProperty: oCol.path,
				filterProperty: oCol.path,
			});
			this.setP13nData(oColumn, oCol.path);
			oColumnKey2ColumnMap[oCol.path] = oColumn;
		}, this);

		return oColumnKey2ColumnMap;
	};

	PersonalizationDialog.createAnalyticalTable = function(sId, oData, bPerformanceOptimization, bUseVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup) {

		this.startMockServer("/mockserver/", oData);

		// Create table
		var oTable = new sap.ui.table.AnalyticalTable(sId, {
			selectionMode: sap.ui.table.SelectionMode.Single, // sap.ui.table.SelectionMode.MultiToggle
			visibleRowCount: 10,
			allowColumnReordering: true,
			showColumnVisibilityMenu: true,
			enableColumnFreeze: true,
			enableCellFilter: true,
			numberOfExpandedLevels: 0,
			title: new sap.ui.commons.Label({
				text: ""
			}),
			toolbar: this.createToolbar("sap.ui.table.Table", bUseVariantManagement ? sId : null, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup)
		});
		var oModel = new ODataModel("/mockserver", true);
		ODataModelAdapter.apply(oModel);
		oTable.setModel(oModel);
		oTable.bindRows({
			path: "/" + oData.entitySet,
			parameters: {
				entitySet: oData.entitySet,
				useBatchRequests: true,
				useAcceleratedAutoExpand: false
			}
		});

		TestUtil.addSorter(oTable, oData.pathOfSorter);
		TestUtil.addFilterer(oTable, oData.pathOfFilterer);

		// Determine columns
		var aColumnKeysOrdered;
		if (bPerformanceOptimization) {
			aColumnKeysOrdered = this.getVisibleColumnsFromODataModel(oModel);
		} else {
			var oResult = oModel.getAnalyticalExtensions().findQueryResultByName(oData.entitySet); // "ProductCollection");
			var oEntityTypeProperties = oResult.getEntityType().getProperties();
			for ( var i in oEntityTypeProperties) {
				aColumnKeysOrdered.push(oEntityTypeProperties[i].name);
			}
		}

		var oColumnKey2ColumnMap = this.createAnalyticalColumns(oTable, oData, aColumnKeysOrdered);

		TestUtil.permuteColumnsByVisibleOrder(oColumnKey2ColumnMap, aColumnKeysOrdered);

		aColumnKeysOrdered.forEach(function(sColumnKey) {
			oTable.addColumn(oColumnKey2ColumnMap[sColumnKey]);
		});

		return oTable;
	};

	PersonalizationDialog.createAnalyticalColumns = function(oTable, oData, aColumnKeys) {

		var oColumnKey2ColumnMap = {};
		var oModel = oTable.getModel();
		var aVisibleColumns = this.getVisibleColumnsFromODataModel(oModel);
		var oResult = oModel.getAnalyticalExtensions().findQueryResultByName(oData.entitySet); // "ProductCollection");
		var oEntityTypeProperties = oResult.getEntityType().getProperties();

		var aSortableColumns = oResult._oEntityType.getSortablePropertyNames();
		var aFilterableColumns = oResult._oEntityType.getFilterablePropertyNames();

		for ( var i in oEntityTypeProperties) {
			var sPath = oEntityTypeProperties[i].name;
			if (aColumnKeys.indexOf(sPath) < 0) {
				continue;
			}

			var bVisible = aVisibleColumns.indexOf(sPath) === -1 ? false : true;
			var oColumn = new sap.ui.table.AnalyticalColumn({
				label: new sap.ui.commons.Label({
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
				}),
				sortProperty: aSortableColumns.indexOf(sPath) === -1 ? undefined : sPath,
				filterProperty: aFilterableColumns.indexOf(sPath) === -1 ? undefined : sPath,
				leadingProperty: sPath
			});
			this.setP13nData(oColumn, sPath);
			oColumnKey2ColumnMap[sPath] = oColumn;
		}

		return oColumnKey2ColumnMap;
	};

	PersonalizationDialog.createChart = function(sId, oData, bPerformanceOptimization, bUseVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup) {

		this.startMockServer("/mockserver/", oData);

		var oModel = new ODataModel("/mockserver", true);
		ODataModelAdapter.apply(oModel);

		var oResult = oModel.getAnalyticalExtensions().findQueryResultByName(oData.entitySet); // "ProductCollection");
		var oEntityTypeProperties = oResult.getEntityType().getProperties();

		var aSortableColumns = oResult._oEntityType.getSortablePropertyNames();
		var aFilterableColumns = oResult._oEntityType.getFilterablePropertyNames();

		var oColumn;
		var aVisibleColumns = this.getVisibleColumnsFromODataModel(oModel);
		var aDimensions = [], aMeasures = [], aNotDimeasures = [];
		var aDimensionsVisible = [], aMeasuresVisible = [];

		for ( var i in oEntityTypeProperties) {
			var sPath = oEntityTypeProperties[i].name;
			var bVisible = aVisibleColumns.indexOf(sPath) === -1 ? false : true;
			if (oResult.getAllDimensionNames().indexOf(sPath) > -1) {
				oColumn = new Dimension({
					label: sPath,
					name: sPath
				});
				this.setP13nData(oColumn, sPath);
				aDimensions.push(oColumn);
				if (bVisible) {
					aDimensionsVisible.push(sPath);
				}
			} else if (oResult.getAllMeasureNames().indexOf(sPath) > -1) {
				oColumn = new Measure({
					label: sPath,
					name: sPath
				});
				this.setP13nData(oColumn, sPath);
				aMeasures.push(oColumn);
				if (bVisible) {
					aMeasuresVisible.push(sPath);
				}
			} else {
				aNotDimeasures.push({
					columnKey: sPath,
					leadingProperty: sPath,
					sortProperty: aSortableColumns.indexOf(sPath) === -1 ? undefined : sPath,
					filterProperty: aFilterableColumns.indexOf(sPath) === -1 ? undefined : sPath,
					label: sPath,
					tooltip: sPath
				});
			}
		}

		var fSort = function(a, b) {
			var iA = aVisibleColumns.indexOf(a);
			var iB = aVisibleColumns.indexOf(b);
			if (iA < iB) {
				return -1;
			}
			if (iA > iB) {
				return 1;
			}
			// a must be equal to b
			return 0;
		};
		aDimensionsVisible.sort(fSort);
		aMeasuresVisible.sort(fSort);

		var oChart = new Chart(sId, {
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: sap.chart.ChartType.Column,
			selectionMode: sap.chart.SelectionMode.Single,
			visibleDimensions: aDimensionsVisible,
			visibleMeasures: aMeasuresVisible,
			dimensions: aDimensions,
			measures: aMeasures
		});
		oChart.data("NonDimeasures", aNotDimeasures);
		oChart.bindData({
			path: "/" + oData.entitySet,
			parameters: {
				entitySet: oData.entitySet,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		// assign Popover to chart
		jQuery.sap.require("sap.viz.ui5.controls.Popover");
		var oPopover = new sap.viz.ui5.controls.Popover({});
		oPopover.connect(oChart.getVizUid());

		return oChart;
	};

	PersonalizationDialog.createSmartChart = function(sId, oData, bUseVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup) {

		this.startMockServer("/mockserver/", oData);
		var oModel = new ODataModel("/mockserver", true);
		ODataModelAdapter.apply(oModel);

		var oSmartChart = new SmartChart(sId, {
			entitySet: oData.entitySet,
			useVariantManagement: bUseVariantManagement,
			useChartPersonalisation: true,
			persistencyKey: "SmartChartPersonalization",
			enableAutoBinding: true
		});
		oSmartChart.setModel(oModel);

		return oSmartChart;
	};

	PersonalizationDialog.startMockServer = function(sRootUri, oData) {
		// enable 'mock' variant management
		jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
		sap.ui.fl.FakeLrepConnector.enableFakeConnector("./mockserver/component-test-changes.json");

		var oServer = new MockServer({
			rootUri: sRootUri
		});
		oServer.simulate(oData.metadataUrl, oData.mockdataSettings);
		oServer.start();
	};

	PersonalizationDialog.setP13nData = function(oColumn, sPath) {
		var sType = "string";
		if (sPath === "Date") {
			sType = "date"
		}
		if (sPath === "Price") {
			sType = "numeric"
		}
		if (sPath === "Bool") {
			sType = "boolean"
		}
		if (sPath === "Time") {
			sType = "time"
		}

		if (oColumn instanceof sap.m.Column || oColumn instanceof Dimension || oColumn instanceof Measure) {
			oColumn.data("p13nData", {
				columnKey: sPath,
				sortProperty: sPath,
				filterProperty: sPath,
				leadingProperty: sPath,
				type: sType,
				maxLength: sPath === "Quantity" ? 10 : undefined
			});
		} else if (oColumn instanceof sap.ui.table.Column) {
			oColumn.data("p13nData", {
				columnKey: sPath,
				type: sType,
				maxLength: sPath === "Quantity" ? 10 : undefined
			// values: sPath === "Bool" ? ["0", "1"] : undefined
			});
		}
	};

	PersonalizationDialog.createToolbar = function(sTableType, sIDTable, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup) {
		if (sTableType === "sap.m.Table") {
			var oToolbar = new Toolbar();
			if (fOpenDialogFilter) {
				oToolbar.addContent(new sap.m.Button({
					icon: "sap-icon://filter",
					press: function(oEvent) {
						fOpenDialogFilter();
					}
				}));
			}
			if (fOpenDialogSort) {
				oToolbar.addContent(new sap.m.Button({
					icon: "sap-icon://sorting-ranking",
					press: function(oEvent) {
						fOpenDialogSort();
					}
				}));
			}
			if (fOpenDialogGroup) {
				oToolbar.addContent(new sap.m.Button({
					icon: "sap-icon://group-2",
					press: function(oEvent) {
						fOpenDialogGroup();
					}
				}));
			}
			if (fOpenDialogColumns) {
				oToolbar.addContent(new sap.m.Button({
					icon: "sap-icon://multi-select",
					press: function(oEvent) {
						fOpenDialogColumns();
					}
				}));
			}
			if (sIDTable) {
				oToolbar.addContent(new sap.ui.comp.smartvariants.SmartVariantManagement(sIDTable + "-SmartVariant", {
					showExecuteOnSelection: true,
					showShare: true
				}));
			}
			oToolbar.addContent(new sap.m.Label({
				text: ""
			}));
			oToolbar.addContent(new sap.m.ToolbarSpacer({}));
			if (fOpenDialog) {
				oToolbar.addContent(new sap.m.Button({
					icon: "sap-icon://action-settings",
					press: function(oEvent) {
						fOpenDialog();
					}
				}));
			}
			return oToolbar;
		} else if (sTableType === "sap.ui.table.Table") {
			var oToolbar = new CommonsToolbar();
			if (fOpenDialogFilter) {
				oToolbar.addItem(new sap.ui.commons.Button({
					icon: "sap-icon://filter",
					tooltip: "filter",
					press: function(oEvent) {
						fOpenDialogFilter();
					}
				}));
			}
			if (fOpenDialogSort) {
				oToolbar.addItem(new sap.ui.commons.Button({
					icon: "sap-icon://sorting-ranking",
					tooltip: "sort",
					press: function(oEvent) {
						fOpenDialogSort();
					}
				}));
			}
			if (fOpenDialogGroup) {
				oToolbar.addItem(new sap.ui.commons.Button({
					icon: "sap-icon://group-2",
					tooltip: "group",
					press: function(oEvent) {
						fOpenDialogGroup();
					}
				}));
			}
			if (fOpenDialogColumns) {
				oToolbar.addItem(new sap.ui.commons.Button({
					icon: "sap-icon://multi-select",
					tooltip: "columns",
					press: function(oEvent) {
						fOpenDialogColumns();
					}
				}));
			}
			if (sIDTable) {
				oToolbar.addItem(new sap.ui.comp.smartvariants.SmartVariantManagement(sIDTable + "-SmartVariant", {
					showExecuteOnSelection: true,
					showShare: true
				}));
			}
			oToolbar.addItem(new sap.ui.commons.Label());
			oToolbar.addItem(new sap.ui.commons.Label({
				text: ""
			}));
			if (fOpenDialog) {
				oToolbar.addRightItem(new sap.ui.commons.Button({
					icon: "sap-icon://action-settings",
					press: function(oEvent) {
						fOpenDialog();
					}
				}));
			}

			return oToolbar;
		}
	};

	PersonalizationDialog.getLabelOfDirtyFlag = function(oTable, oToolbar) {
		if (!oTable) {
			return null;
		}
		oToolbar = oToolbar || (oTable.getHeaderToolbar ? oTable.getHeaderToolbar() : oTable.getToolbar ? oTable.getToolbar() : null);
		if (!oToolbar) {
			return null;
		}
		var oLabel = null;
		if (oToolbar instanceof Toolbar) {
			oToolbar.getContent().some(function(oContent) {
				if (oContent instanceof sap.m.Label) {
					oLabel = oContent;
					return true;
				}
			});
		} else if (oToolbar instanceof CommonsToolbar) {
			oToolbar.getItems().some(function(oItem) {
				if (oItem instanceof sap.ui.commons.Label) {
					oLabel = oItem;
					return true;
				}
			});
		}
		return oLabel;
	};

	PersonalizationDialog.getVariantManagementIdOfTable = function(oTable) {
		return oTable.getId() + "-SmartVariant";
	};

	PersonalizationDialog.getVisibleColumnsFromODataModel = function(oModel) {
		var aVisibleCols = [];
		oModel.getServiceAnnotations()["EPM_DEVELOPER_SCENARIO_SRV.Product"]["com.sap.vocabularies.UI.v1.LineItem"].forEach(function(oLineItem) {
			aVisibleCols.push(oLineItem.Value.Path);
		});
		return aVisibleCols;
	};

	/* eslint-enable strict */

	return PersonalizationDialog;
}, /* bExport= */true);
